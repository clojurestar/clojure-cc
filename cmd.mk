# Run a Clojure dialect command
#
# Usage:
#   $(make -f <(curl -sL clojure.cc/cmd.mk)) <name> [PREFIX=dir]
#
# See clojure.cc/try/ for full documentation.

R := https://github.com/makeplus/makes
T := $(or $(TMPDIR),$(TEMP),$(TMP),/tmp)
ifeq (,$(wildcard $T))
$(error Can't determine temp dir)
endif
PREFIX ?= $T/clojure-cc-cmd
PREFIX-PATH := $(abspath $(PREFIX))
P := $(or $(patsubst %/bin,%,$(PREFIX-PATH)),/)
ifneq ($(P),$(PREFIX-PATH))
$(warning clojure.cc: stripped trailing /bin from PREFIX; using PREFIX=$(P))
endif
M := $P/share/makes
$(shell mkdir -p '$P/share')
$(shell if [ -d '$M' ]; then \
  git -C '$M' pull -q; \
else \
  git clone -q --depth=1 '$R' '$M'; \
fi)

MAKES-QUIET := 1
override MAKES_LOCAL_DIR := $P/share
include $M/init.mk

# static-php-cli can lag PHP releases; keep Phel on a published build.
PHP-VERSION ?= 8.5.8

include $M/babashka.mk
include $M/clojure.mk
include $M/cljgo.mk
include $M/gloat.mk
include $M/glojure.mk
include $M/gobb.mk
include $M/hy.mk
include $M/janet.mk
include $M/joker.mk
include $M/jolt.mk
include $M/lein.mk
include $M/let-go.mk
include $M/phel.mk

include $M/shell.mk

PAGER ?= less -FRX
ifeq (less,$(PAGER))
PAGER := less -FRX
endif

unexport PERL5LIB PERL5OPT

WRAP-BIN := $P/bin
CLJ_CONFIG ?= $(LOCAL-HOME)/.clojure
CLJ_CACHE ?= $(CLJ_CONFIG)/.cpcache
CLJ_JVM_OPTS ?= -Duser.home=$(LOCAL-HOME)
export UV_CACHE_DIR ?= $(LOCAL-CACHE)/uv

FORCE:

define WRAP-CMD
$(WRAP-BIN)/$(1): $(2) FORCE
	@mkdir -p $(WRAP-BIN)
	@{ \
	  printf '%s\n' '#!/usr/bin/env bash'; \
	  printf '%s\n' 'unset PERL5LIB PERL5OPT'; \
	  printf 'export PATH=%q\n' '$(PATH)'; \
	  printf 'export LANG=%q\n' '$(LANG)'; \
	  printf 'export JAVA_HOME=%q\n' '$(JAVA_HOME)'; \
	  printf 'export CLJ_CONFIG=%q\n' '$(CLJ_CONFIG)'; \
	  printf 'export CLJ_CACHE=%q\n' '$(CLJ_CACHE)'; \
	  printf 'export CLJ_JVM_OPTS=%q\n' '$(CLJ_JVM_OPTS)'; \
	  printf 'export LEIN_HOME=%q\n' '$(LEIN_HOME)'; \
	  printf 'export LEIN_JVM_OPTS=%q\n' '$(LEIN_JVM_OPTS)'; \
	  printf 'export MAVEN_OPTS=%q\n' '$(MAVEN_OPTS)'; \
	  printf 'export UV_CACHE_DIR=%q\n' '$(UV_CACHE_DIR)'; \
	  printf 'export UV_TOOL_DIR=%q\n' '$(UV_TOOL_DIR)'; \
	  printf 'export UV_TOOL_BIN_DIR=%q\n' '$(UV_TOOL_BIN_DIR)'; \
	  printf 'export UV_PYTHON_INSTALL_DIR=%q\n' '$(UV_PYTHON_INSTALL_DIR)'; \
	  printf 'exec %q "$$$$@"\n' '$(or $(3),$(2))'; \
	} > $$@
	@chmod +x $$@

$(1): $(WRAP-BIN)/$(1)
	@printf '%s\n' '$$<'
endef

define WRAP-CMD-RLWRAP-REPL
$(WRAP-BIN)/$(1): $(2) FORCE
	@mkdir -p $(WRAP-BIN)
	@{ \
	  printf '%s\n' '#!/usr/bin/env bash'; \
	  printf '%s\n' 'unset PERL5LIB PERL5OPT'; \
	  printf 'export PATH=%q\n' '$(PATH)'; \
	  printf 'export LANG=%q\n' '$(LANG)'; \
	  printf 'export JAVA_HOME=%q\n' '$(JAVA_HOME)'; \
	  printf 'export CLJ_CONFIG=%q\n' '$(CLJ_CONFIG)'; \
	  printf 'export CLJ_CACHE=%q\n' '$(CLJ_CACHE)'; \
	  printf 'export CLJ_JVM_OPTS=%q\n' '$(CLJ_JVM_OPTS)'; \
	  printf 'export LEIN_HOME=%q\n' '$(LEIN_HOME)'; \
	  printf 'export LEIN_JVM_OPTS=%q\n' '$(LEIN_JVM_OPTS)'; \
	  printf 'export MAVEN_OPTS=%q\n' '$(MAVEN_OPTS)'; \
	  printf 'export UV_CACHE_DIR=%q\n' '$(UV_CACHE_DIR)'; \
	  printf 'export UV_TOOL_DIR=%q\n' '$(UV_TOOL_DIR)'; \
	  printf 'export UV_TOOL_BIN_DIR=%q\n' '$(UV_TOOL_BIN_DIR)'; \
	  printf 'export UV_PYTHON_INSTALL_DIR=%q\n' '$(UV_PYTHON_INSTALL_DIR)'; \
	  printf '%b\n' 'if command -v rlwrap >/dev/null 2>&1 && { [ -z "\044{1+x}" ] || [ "\044{1-}" = repl ]; }; then'; \
	  printf '  exec rlwrap %q "$$$$@"\n' '$(or $(3),$(2))'; \
	  printf '%s\n' 'fi'; \
	  printf 'exec %q "$$$$@"\n' '$(or $(3),$(2))'; \
	} > $$@
	@chmod +x $$@

$(1): $(WRAP-BIN)/$(1)
	@printf '%s\n' '$$<'
endef


default:: help

help:
	@echo "$$HELP" | $(PAGER)

$(eval $(call WRAP-CMD,bb,$(BB)))
$(eval $(call WRAP-CMD,clj,$(CLOJURE),$(dir $(CLOJURE))clj))
$(eval $(call WRAP-CMD,cljgo,$(CLJGO)))
$(eval $(call WRAP-CMD,glj,$(GLJ)))
$(eval $(call WRAP-CMD,gloat,$(GLOAT)))
$(eval $(call WRAP-CMD,gobb,$(GOBB)))
$(eval $(call WRAP-CMD,hy,$(HY)))
$(eval $(call WRAP-CMD,janet,$(JANET)))
$(eval $(call WRAP-CMD,joker,$(JOKER)))
$(eval $(call WRAP-CMD-RLWRAP-REPL,jolt,$(JOLT)))
$(eval $(call WRAP-CMD,lein,$(LEIN)))
$(eval $(call WRAP-CMD,lg,$(LG)))
$(eval $(call WRAP-CMD-RLWRAP-REPL,phel,$(PHEL)))


define HELP

Instant Clojure Dialect commands from ClojureStar!

Run an auto-installed Clojure dialect CLI command:

  $(make -f <(curl -sL clojure.cc/cmd.mk) <name>)
  make -f <(curl -sL clojure.cc/cmd.mk) <name> <NAME>-VERSION=1.2.3
  make -f <(curl -sL clojure.cc/cmd.mk) <name> PREFIX=/path/to/dir

Names of dialect targets and their VERSION variables:

* bb    - BABASHKA-VERSION - Babashka
* clj   - CLOJURE-VERSION  - Clojure   - Java
* cljgo - CLJGO-VERSION    - cljgo     - Go
* glj   - GLOJURE-VERSION  - Glojure   - Go
* gloat - GLOAT-VERSION    - Gloat     - Go
* gobb  - GOBB-VERSION     - Gobb      - Go
* hy    - HY-VERSION       - Hy        - Python
* janet - JANET-VERSION    - Janet     - C
* joker - JOKER-VERSION    - Joker     - Go
* jolt  - JOLT-VERSION     - Jolt      - Chez Scheme
* lein  - LEIN-VERSION     - Leiningen
* lg    - LET-GO-VERSION   - let-go    - Go
* phel  - PHEL-VERSION     - Phel      - PHP

* shell - Start a shell with all of the above installed
* help  - Print this help

For example:

  $(make -f <(curl -sL clojure.cc/cmd.mk) glj)
  $(make -f <(curl -sL clojure.cc/cmd.mk) bb BABASHKA-VERSION=1.12.218)

You can simplify with a shell alias:

  ccc() (
    dialect=$1; shift
    $(make -f <(curl -sL clojure.cc/cmd.mk) "$dialect") "$@"
  )

  ccc clj
  ccc bb BABASHKA-VERSION=1.12.218
  ccc shell

See https://github.com/makeplus/makes for internals.
It auto-installs not only the Clojure dialects, but also the host
languages they depend on. You don't need Java, Go, Python etc.
installed already to try these dialects.

endef
export HELP
