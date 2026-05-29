R :=  https://github.com/makeplus/makes
M := .cache/makes
$(shell [ -d $M ] || (git clone -q $R '$M'))

include $M/init.mk
include $M/clean.mk
PYTHON-VENV := $(ROOT)/venv
include $M/python.mk
include $M/typos.mk
include $M/ys.mk
GLOJURE-VERSION := 0.6.5-rc30
# Set before include: glojure.mk uses `override GLOJURE-REPO`, which silently
# locks the value and ignores any later plain `:=` assignment.
GLOJURE-REPO := https://github.com/gloathub/glojure
include $M/go.mk
include $M/glojure.mk

GLOJURE-TAG := v$(patsubst v%,%,$(GLOJURE-VERSION))
GLOJURE-DIR := $(LOCAL-CACHE)/glojure-$(GLOJURE-TAG)

$(GLOJURE-DIR):
	@echo "* Cloning glojure $(GLOJURE-TAG) locally"
	git clone -q -b $(GLOJURE-TAG) --config advice.detachedHead=false \
	  $(GLOJURE-REPO) $@
SHELL-DEPS += $(PYTHON-VENV)
include $M/shell.mk

export UV_LINK_MODE := copy
export UV_CACHE_DIR := $(ROOT)/.cache/uv
export NO_MKDOCS_2_WARNING := 1

# Override python.mk's venv recipe: use uv venv instead of python -m venv
# (avoids ensurepip hang with uv-managed standalone Python builds).
$(PYTHON-VENV): $(PYTHON)
	@echo '+++ Installing a Python virtualenv in $@'
	uv venv --python $(PYTHON-NAME) $@
	$(if $(wildcard requirements.txt),uv pip install -r requirements.txt,true)
	@echo

REPO ?= git@github.com:clojurestar/clojure-cc

MAKES-CLEAN := \
  docs/dialects.md \
  docs/javascripts/cc-logo-data.js \
  docs/repl/wasm_exec.js \
  site \

MAKES-REALCLEAN := \
  $(PYTHON-VENV) \
  docs/repl/glj.wasm \
  hooks/__pycache__/ \
  repo-data.yaml \

MAKES-DISTCLEAN := .cache/

DEPS := \
  $(PYTHON-VENV) \


default::

GLJ-WASM := docs/repl/glj.wasm
GLJ-WASM-EXEC := docs/repl/wasm_exec.js

# Build the in-browser Glojure REPL WebAssembly binary
$(GLJ-WASM): $(GO) $(GLOJURE-DIR)
	@mkdir -p $(dir $@)
	cd $(GLOJURE-DIR)/cmd/glj && \
	  GOOS=js \
	  GOARCH=wasm \
	  CGO_ENABLED=0 \
	  go build \
	    -ldflags "-X github.com/gloathub/glojure/pkg/runtime.version=$(GLOJURE-VERSION)" \
	    -o $(ROOT)/$@ .

$(GLJ-WASM-EXEC): $(GO)
	@mkdir -p $(dir $@)
	cp $(GOROOT)/lib/wasm/wasm_exec.js $@

glj-wasm: $(GLJ-WASM) $(GLJ-WASM-EXEC)

# Refresh star counts and latest-release info into repo-data.yaml
repo-data: $(YS)
	ys util/repo-data.ys

# Generate dialect catalog from YAML data
# repo-data.yaml is optional: if absent the Stars and Release columns render
# empty. Refresh it with `make repo-data` before publishing.
docs/dialects.md: util/dialects.ys src/dialects.yaml src/dialects.md \
                  $(wildcard repo-data.yaml) $(YS)
	ys $< > $@

# Generate logo dialect data JS from YAML data
docs/javascripts/cc-logo-data.js: util/cc-logo-data.ys src/dialects.yaml $(YS)
	ys $< > $@

# Build main site (production)
site: $(DEPS) glj-wasm docs/dialects.md docs/javascripts/cc-logo-data.js
	mkdocs build -d $@

# Serve locally with MkDocs
# Kill any other 'mkdocs serve' first so a stale dev server on the same port
# doesn't block startup.
serve: $(DEPS) glj-wasm docs/dialects.md docs/javascripts/cc-logo-data.js
	-pkill -f 'mkdocs serve' 2>/dev/null
	mkdocs serve --livereload

# Build alias
build: site

# Lint check
lint: $(TYPOS)
	typos

# Deploy to production: refresh repo data, build, force-push to gh-pages
publish: repo-data
	$(MAKE) site
	cd site && \
	  git init && \
	  git add -A && \
	  git commit -m 'Deploy to production' && \
	  git push -f $(REPO) HEAD:gh-pages
	$(RM) -r site
