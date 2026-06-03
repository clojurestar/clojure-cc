# Run a Clojure dialect command
#
# Usage:
#   $(make -f <(curl -sL clojure.cc/cmd.mk)) <name>
#
# See clojure.cc/cli/ for full documentation.

R := https://github.com/makeplus/makes
T := $(or $(TMPDIR),$(TEMP),$(TMP),/tmp)
ifeq (,$(wildcard $T))
$(error Can't determine temp dir)
endif
T := $T/clojure-cc-cmd
M := $T/makes
$(shell [ -d '$M' ] || git clone -q $R '$M')
$(shell git -C '$M' pull -q)

MAKES-QUIET := 1
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
	@command -v $@

clj: $(JAVA) $(CLOJURE)
	@command -v $@

glj: $(GLJ)
	@command -v $@

gloat: $(GLOAT)
	@command -v $@

hy: $(HY)
	@command -v $@

janet: $(JANET)
	@command -v $@

joker: $(JOKER)
	@command -v $@

lein: $(LEIN)
	@command -v $@

lg: $(LG)
	@command -v $@

phel: $(PHEL)
	@command -v $@

reset:
	$(RM) -r $T


define HELP

Instant Clojure Dialect commands from clojure.cc!

Run an auto-installed Clojure dialect CLI command:

  $(make -f <(curl -sL clojure.cc/cmd.mk) <name>)
  make -f <(curl -sL clojure.cc/cmd.mk) <name> <NAME>-VERSION=1.2.3

Names of dialect targets and their VERSION variables:

* bb    - BABASHKA-VERSION - Babashka
* clj   - CLOJURE-VERSION  - Clojure   - Java
* glj   - GLOJURE-VERSION  - Glojure   - Go
* gloat - GLOAT-VERSION    - Gloat     - Go
* hy    - HY-VERSION       - Hy        - Python
* janet - JANET-VERSION    - Janet     - C
* joker - JOKER-VERSION    - Joker     - Go
* lein  - LEIN-VERSION     - Leiningen
* lg    - LET-GO-VERSION   - let-go    - Go
* phel  - PHEL-VERSION     - Phel      - PHP

* shell - Start a shell with all of the above installed
* reset - Delete the installation cache in $T
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
