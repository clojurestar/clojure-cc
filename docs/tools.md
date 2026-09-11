---
title: Clojure Tools
description:
  Install Clojure formatters, linters, dependency tools, and launchers.
hide:
- navigation
---

# Clojure Tools

Use [in-1](https://in-1.cc) to install these tools with no prerequisites.
See the [in-1 guide](in-1.md) for setup and installation options, or
[Try Dialects](try.md) for REPLs and language CLIs.

| | Name | Purpose | Command |
|--:|:-----|:--------|:--------|
| **[1](#bbin){ #bbin }** | **[`bbin`](https://github.com/babashka/bbin)** | Babashka script and tool installer | **`in-1 bbin && bbin --help`** |
| **[2](#clj-kondo){ #clj-kondo }** | **[`clj-kondo`](https://cljdoc.org/d/clj-kondo/clj-kondo/CURRENT)** | Static analyzer and linter | **`in-1 clj-kondo && clj-kondo --help`** |
| **[3](#cljfmt){ #cljfmt }** | **[`cljfmt`](https://github.com/weavejester/cljfmt)** | Code formatter | **`in-1 cljfmt && cljfmt --help`** |
| **[4](#gloat){ #gloat }** | **[`gloat`](https://gloathub.org/)** | Clojure and YAMLScript compiler and REPL client | **`in-1 gloat && gloat --repl`** |
| **[5](#grenadine){ #grenadine }** | **[`grenadine`](https://clojurestar.github.io/grenadine/)** | Dependency resolver | **`in-1 grenadine && grenadine --help`** |
| **[6](#jus){ #jus }** | **[`jus`](https://github.com/paintparty/jus)** | Terminal launcher for dialects | **`in-1 jus && jus`** |
| **[7](#lgx){ #lgx }** | **[`lgx`](https://github.com/abogoyavlensky/lgx)** | Package and project manager for let-go | **`in-1 lgx && lgx help`** |
| **[8](#zprint){ #zprint }** | **[`zprint`](https://cljdoc.org/d/zprint/zprint/CURRENT)** | Code and data formatter | **`in-1 zprint && zprint --help`** |


## Gloat REPL Client

The Gloat REPL client is more featureful than the plain dialect REPLs, with
many modern features including:

* Rainbow syntax highlighting
* Tab completion
* Stateful URL sharing
* Multiline forms and history scrolling

See <https://gloathub.org/doc/gloat-repl/> for full details.

`gloat` can connect to dialect nREPL servers started through these launchers:

| | Server | Command |
|--:|:-------|:--------|
| **[1](#server-babashka){ #server-babashka }** | Babashka | **`source <(curl -sL in-1.cc) gloat && gloat --repl=+bb`** |
| **[2](#server-jolt){ #server-jolt }** | Jolt | **`source <(curl -sL in-1.cc) gloat && gloat --repl=+jolt`** |
| **[3](#server-let-go){ #server-let-go }** | let-go | **`source <(curl -sL in-1.cc) gloat && gloat --repl=+lg`** |
