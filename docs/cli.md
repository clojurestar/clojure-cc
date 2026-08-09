---
title: CLI Launcher
description:
  Install any supported Clojure dialect CLI locally with a single curl + source
  command.
  No prerequisites.
hide:
- navigation
---

# Instant Clojure Dialect Commands

A single command, no prerequisites, a working local Clojure dialect command.
This installs the dialect _(very quickly!)_ and adds its command directory to
`PATH`.
You can then run the command by name.

```bash
source <(curl -sL clojure.cc/get) bb && bb
```

The [`get` script](https://github.com/clojurestar/clojure-cc/blob/main/docs/get)
delegates installation to the
[`cmd.mk` Makefile](https://github.com/clojurestar/clojure-cc/blob/main/docs/cmd.mk).
It uses [Makes](https://github.com/makeplus/makes) to auto-install both the
dialect *and* its host language (Java, Go, Python, PHP, etc.) into a local cache
directory.
Your system stays clean.

> **Note:** For the Fish shell, use:
> ```fish
> curl -sL clojure.cc/get | source - bb; and bb
> ```


## Quick Dialect Usage

This table shows the command for each dialect to start its REPL.
You can adjust the command to do other things with the dialect like run a
program with it.

| Name | Dialect | Host | REPL Command |
|:-----|:--------|:-----|---------|
| **`bb`** | [Babashka](https://book.babashka.org/) | GraalVM | **`source <(curl -sL clojure.cc/get) bb && bb`** |
| **`clj`** | [Clojure](https://clojure.org/) | Java | **`source <(curl -sL clojure.cc/get) clj && clj`** |
| **`glj`** | [Glojure](https://github.com/glojurelang/glojure) | Go | **`source <(curl -sL clojure.cc/get) glj && glj`** |
| **`gloat`** | [Gloat](https://gloathub.org/) | Go | **`source <(curl -sL clojure.cc/get) gloat && gloat --repl`** |
| **`gobb`** | [Gobb](https://gobb.site/) | Go | **`source <(curl -sL clojure.cc/get) gobb && gobb`** |
| **`hy`** | [Hy](https://hylang.org/) | Python | **`source <(curl -sL clojure.cc/get) hy && hy`** |
| **`janet`** | [Janet](https://janet-lang.org/) | C | **`source <(curl -sL clojure.cc/get) janet && janet`** |
| **`joker`** | [Joker](https://github.com/candid82/joker) | Go | **`source <(curl -sL clojure.cc/get) joker && joker`** |
| **`jolt`** | [Jolt](https://github.com/jolt-lang/jolt) | Chez Scheme | **`source <(curl -sL clojure.cc/get) jolt && jolt`** |
| **`lein`** | [Leiningen](https://leiningen.org/) | Java | **`source <(curl -sL clojure.cc/get) lein && lein repl`** |
| **`lg`** | [let-go](https://github.com/nooga/let-go) | Go | **`source <(curl -sL clojure.cc/get) lg && lg`** |
| **`phel`** | [Phel](https://phel-lang.org/) | PHP | **`source <(curl -sL clojure.cc/get) phel && phel`** |

Plus:

| Command | Purpose |
|:--------|---------|
| **`make -f <(curl -sL clojure.cc/cmd.mk) shell`** | Start a shell with all of the above installed |
| **`make -f <(curl -sL clojure.cc/cmd.mk) reset`** | Delete the installation cache |
| **`make -f <(curl -sL clojure.cc/cmd.mk) help`** | Print the help text |


## Gloat REPL Client

The Gloat REPL client is more featureful than the plain dialect REPLs, with
many modern fetures including:

* Rainbow syntax highlighting
* Tab completion
* Stateful URL sharing
* Multiline forms and history scrolling

See <https://gloathub.org/doc/gloat-repl/> for full details.

`gloat` can connect to dialect nREPL servers started through these launchers:

| Server | Command |
|:-------|:--------|
| Babashka | **`source <(curl -sL clojure.cc/get) gloat && gloat --repl=+bb`** |
| Jolt | **`source <(curl -sL clojure.cc/get) gloat && gloat --repl=+jolt`** |
| let-go | **`source <(curl -sL clojure.cc/get) gloat && gloat --repl=+lg`** |


## Examples

Launch a Glojure REPL:

```bash
source <(curl -sL clojure.cc/get) glj && glj
```

Evaluate a let-go expression:

```bash
source <(curl -sL clojure.cc/get) lg && lg '(+ 1 2 3)'
```

Pin a Babashka version:

```bash
source <(curl -sL clojure.cc/get) bb BABASHKA-VERSION=1.12.218 &&
  bb -e 'babashka.fs/glob'
```

Or simplify with a shell function:

```bash
ccc() {
  local dialect=$1
  shift
  source <(curl -sL clojure.cc/get) "$dialect" && "$dialect" "$@"
}

ccc clj
ccc bb -e '(+ 1 2 3)'
```


## How it works

The sourced launcher delegates to a small Makefile that:

1. Clones [makeplus/makes](https://github.com/makeplus/makes) into a temp
   directory (`$TMPDIR/clojure-cc-cmd/`).
2. Loads the language-specific module for the requested dialect.
3. Downloads the host language toolchain (Java, Go, Python...).
4. Downloads and installs the dialect.
5. Creates a command wrapper containing the complete runtime environment.

The `get` script adds the wrapper directory to `PATH`. The original Makefile
form prints the wrapper's absolute path without changing the calling shell's
environment.

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
