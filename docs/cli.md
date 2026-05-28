---
title: CLI Launcher
description:
  Launch any supported Clojure dialect REPL locally with a single curl + make
  command. No prerequisites.
hide:
- navigation
---

# Instant Clojure Dialect REPLs

A single command, no prerequisites, a working local REPL.

```bash
make -f <(curl -sL clojure.cc/repl.mk) <name>
```

The Makefile is hosted at <a href="https://github.com/clojurestar/clojure-cc/blob/main/docs/repl.mk"><code>clojure.cc/repl.mk</code></a>.
It uses [Makes](https://github.com/makeplus/makes) to auto-install both the
dialect *and* its host language (Java, Go, Python, PHP, etc.) into a local
cache directory.
Your system stays clean.


## Supported targets

| Name | Dialect | Host language |
|------|---------|---------------|
| `bb` | [Babashka](https://book.babashka.org/) | Native (GraalVM) |
| `clj` | [Clojure](https://clojure.org/) | Java |
| `glj` | [Glojure](https://github.com/glojurelang/glojure) | Go |
| `gloat` | [Gloat](https://gloathub.org/) | Go |
| `hy` | [Hy](https://hylang.org/) | Python |
| `janet` | [Janet](https://janet-lang.org/) | C |
| `joker` | [Joker](https://github.com/candid82/joker) | Go |
| `lein` | [Leiningen](https://leiningen.org/) | Java |
| `lg` | [let-go](https://github.com/nooga/let-go) | Go |
| `phel` | [Phel](https://phel-lang.org/) | PHP |

Plus:

| Name | Purpose |
|------|---------|
| `shell` | Start a shell with all of the above installed |
| `reset` | Delete the installation cache |
| `help` | Print the help text |


## Examples

Launch a Glojure REPL:

```bash
make -f <(curl -sL clojure.cc/repl.mk) glj
```

Pin a Babashka version:

```bash
make -f <(curl -sL clojure.cc/repl.mk) bb BABASHKA-VERSION=1.12.218
```

Or simplify with a shell alias:

```bash
alias repl='make -f <(curl -sL clojure.cc/repl.mk)'

repl clj
repl bb BABASHKA-VERSION=1.12.218
repl shell
```


## How it works

The launcher is a small Makefile that:

1. Clones [makeplus/makes](https://github.com/makeplus/makes) into a temp
   directory (`$TMPDIR/clojure-cc-repl/`).
2. Loads the language-specific module for the requested dialect.
3. Downloads the host language toolchain (Java, Go, Python...).
4. Downloads and installs the dialect.
5. Drops you straight into its REPL.

Everything lives under that single temp directory and can be cleared with:

```bash
make -f <(curl -sL clojure.cc/repl.mk) reset
```

See [makeplus/makes](https://github.com/makeplus/makes) for the
implementation details.


## Want more dialects?

The launcher currently ships with the dialects listed above.
If you'd like to see another Clojure dialect supported here, please open an
issue on [GitHub](https://github.com/clojurestar/clojure-cc/issues).
