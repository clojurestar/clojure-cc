---
title: CLI Launcher
description:
  Launch any supported Clojure dialect CLI locally with a single curl + make
  command.
  No prerequisites.
hide:
- navigation
---

# Instant Clojure Dialect Commands

A single command, no prerequisites, a working local Clojure dialect command.

```bash
$(make -f <(curl -sL clojure.cc/cmd.mk) <name>) [<arg>...]
```

You can use this to try a dialect REPL or command, or share a command with
others, regardless of whether they have the dialect installed to run it.

The Makefile is hosted at <a href="https://github.com/clojurestar/clojure-cc/blob/main/docs/cmd.mk"><code>clojure.cc/cmd.mk</code></a>.
It uses [Makes](https://github.com/makeplus/makes) to auto-install both the
dialect *and* its host language (Java, Go, Python, PHP, etc.) into a local
cache directory.
Your system stays clean.

> **NOTE:** The command above should work in the Bash and Zsh shells.
> Fish users can use this instead:
> ```
> (make -f (curl -sL clojure.cc/cmd.mk | psub) <name>) [<arg>...]
> ```


## Starting Dialect REPLs

| Name | Dialect | Host | REPL Command |
|:-----|:--------|:-----|---------|
| **`bb`** | [Babashka](https://book.babashka.org/) | GraalVM | **`$(make -f <(curl -sL clojure.cc/cmd.mk) bb)`** |
| **`clj`** | [Clojure](https://clojure.org/) | Java | **`$(make -f <(curl -sL clojure.cc/cmd.mk) clj)`** |
| **`glj`** | [Glojure](https://github.com/glojurelang/glojure) | Go | **`$(make -f <(curl -sL clojure.cc/cmd.mk) glj)`** |
| **`gloat`** | [Gloat](https://gloathub.org/) | Go | **`$(make -f <(curl -sL clojure.cc/cmd.mk) gloat) --repl`** |
| **`hy`** | [Hy](https://hylang.org/) | Python | **`$(make -f <(curl -sL clojure.cc/cmd.mk) hy)`** |
| **`janet`** | [Janet](https://janet-lang.org/) | C | **`$(make -f <(curl -sL clojure.cc/cmd.mk) janet)`** |
| **`joker`** | [Joker](https://github.com/candid82/joker) | Go | **`$(make -f <(curl -sL clojure.cc/cmd.mk) joker)`** |
| **`lein`** | [Leiningen](https://leiningen.org/) | Java | **`$(make -f <(curl -sL clojure.cc/cmd.mk) lein) repl`** |
| **`lg`** | [let-go](https://github.com/nooga/let-go) | Go | **`$(make -f <(curl -sL clojure.cc/cmd.mk) lg)`** |
| **`phel`** | [Phel](https://phel-lang.org/) | PHP | **`$(make -f <(curl -sL clojure.cc/cmd.mk) phel)`** |

Plus:

| Name | Purpose |
|:-----|---------|
| **`shell`** | Start a shell with all of the above installed |
| **`reset`** | Delete the installation cache |
| **`help`** | Print the help text |


## Examples

Launch a Glojure REPL:

```bash
$(make -f <(curl -sL clojure.cc/cmd.mk) glj)
```

Evaluate a let-go expression:

```bash
$(make -f <(curl -sL clojure.cc/cmd.mk) lg) '(+ 1 2 3)'
```

Pin a Babashka version:

```bash
$(make -f <(curl -sL clojure.cc/cmd.mk) bb BABASHKA-VERSION=1.12.218) -e 'babashka.fs/glob'
```

Or simplify with a shell function:

```bash
ccc() (
  dialect=$1; shift
  $(make -f <(curl -sL clojure.cc/cmd.mk) "$dialect") "$@"
)

ccc clj
ccc bb BABASHKA-VERSION=1.12.218
ccc shell
```


## How it works

The launcher is a small Makefile that:

1. Clones [makeplus/makes](https://github.com/makeplus/makes) into a temp
   directory (`$TMPDIR/clojure-cc-cmd/`).
2. Loads the language-specific module for the requested dialect.
3. Downloads the host language toolchain (Java, Go, Python...).
4. Downloads and installs the dialect.
5. Drops you straight into its REPL.

Everything lives under that single temp directory and can be cleared with:

```bash
make -f <(curl -sL clojure.cc/cmd.mk) reset
```

See [makeplus/makes](https://github.com/makeplus/makes) for the
implementation details.


## Want more dialects?

The launcher currently ships with the dialects listed above.
If you'd like to see another Clojure dialect supported here, please open an
issue on [GitHub](https://github.com/clojurestar/clojure-cc/issues).
