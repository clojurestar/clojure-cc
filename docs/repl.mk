# Start a Clojure dialect REPL.
#
# Usage:
#   make -f <(curl -sL clojure.cc/repl.mk) <name>
# See clojure.cc/cli/ for full documentation.

R := https://github.com/makeplus/makes
T := $(or $(TMPDIR),$(TEMP),$(TMP),/tmp)
ifeq (,$(wildcard $T))
$(error Can't determine temp dir)
endif
T := $T/clojure-cc-repl
M := $T/makes
$(shell [ -d '$M' ] || git clone -q $R '$M')
$(shell git -C '$M' pull -q)

include $M/init.mk

include $M/babashka.mk
include $M/clojure.mk
include $M/gloat.mk
include $M/glojure.mk
include $M/hy.mk
include $M/janet.mk
include $M/joker.mk
include $M/lein.mk
include $M/let-go.mk
include $M/phel.mk

include $M/shell.mk

PAGER ?= less -FRX
ifeq (less,$(PAGER))
PAGER := less -FRX
endif

unexport PERL5LIB PERL5OPT


default:: help

help:
	@echo "$$HELP" | $(PAGER)

bb: $(BB)
	$@

clj: $(CLJ)
	$@

glj: $(GLJ)
	$@

gloat: $(GLOAT)
	$@ --repl

hy: $(HY)
	$@

janet: $(JANET)
	$@

joker: $(JOKER)
	$@

lein: $(LEIN)
	$@ repl

lg: $(LG)
	$@

phel: $(PHEL)
	$(if $(shell command -v rlwrap),rlwrap )$@

reset:
	$(RM) -r $T


define HELP

Instant Clojure Dialect REPLs from ClojureStar!

Start an auto-installed Clojure dialect CLI REPL client:

  make -f <(curl -sL clojure.cc/repl.mk) <name>
  make -f <(curl -sL clojure.cc/repl.mk) <name> <NAME>-VERSION=1.2.3

Names of REPL targets and their VERSION variables:

* bb    - BABASHKA-VERSION - Babashka REPL
* clj   - CLOJURE-VERSION  - Clojure REPL   - Java
* glj   - GLOJURE-VERSION  - Glojure REPL   - Go
* gloat - GLOAT-VERSION    - Gloat REPL     - Go
* hy    - HY-VERSION       - Hy REPL        - Python
* janet - JANET-VERSION    - Janet REPL     - C
* joker - JOKER-VERSION    - Joker REPL     - Go
* lein  - LEIN-VERSION     - Leiningen REPL
* lg    - LET-GO-VERSION   - let-go REPL    - Go
* phel  - PHEL-VERSION     - Phel REPL      - PHP

* shell - Start a shell with all of the above installed
* reset - Delete the installation cache in $T
* help  - Print this help

For example:

  make -f <(curl -sL clojure.cc/repl.mk) glj
  make -f <(curl -sL clojure.cc/repl.mk) bb BABASHKA-VERSION=1.12.218

You can simplify with a shell alias:

  alias repl='make -f <(curl -sL clojure.cc/repl.mk)'
  repl glj
  repl bb BABASHKA-VERSION=1.12.218

See https://github.com/makeplus/makes for internals.
It auto-installs not only the Clojure dialects, but also the host
languages they depend on. You don't need Java, Go, Python etc.
installed already to try these REPLs.

endef
export HELP
