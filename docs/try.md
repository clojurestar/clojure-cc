---
title: Try Dialects
description:
  Install and try Clojure dialect REPLs and CLIs locally.
hide:
- navigation
- title
---

## Quick Clojure Dialect Usage

Use [in-1](in-1.md) to install and run these dialects with no prerequisites.
For formatters, linters, and other utilities, see [Clojure Tools](tools.md).

This table shows how to start each dialect's REPL or CLI.
You can adjust the command to do other things with the dialect like run a program with it.

| | Name | Dialect | Host | Command |
|--:|:-----|:--------|:-----|---------|
| **[1](#basilisp){ #basilisp }** | **[`basilisp`](https://docs.basilisp.org/en/latest/)** | [Basilisp](https://docs.basilisp.org/en/latest/) | Python | **`in-1 basilisp && basilisp repl`** |
| **[2](#bb){ #bb }** | **[`bb`](https://book.babashka.org/)** | [Babashka](https://book.babashka.org/) | GraalVM | **`in-1 bb && bb`** |
| **[3](#clj){ #clj }** | **[`clj`](https://clojure.org/)** | [Clojure](https://clojure.org/) | Java | **`in-1 clj && clj`** |
| **[4](#cljgo){ #cljgo }** | **[`cljgo`](https://muthuishere.github.io/cljgo/)** | [cljgo](https://muthuishere.github.io/cljgo/) | Go | **`in-1 cljgo && cljgo repl`** |
| **[5](#fennel){ #fennel }** | **[`fennel`](https://fennel-lang.org/)** | [Fennel](https://fennel-lang.org/) | Lua | **`in-1 fennel && fennel`** |
| **[6](#glj){ #glj }** | **[`glj`](https://github.com/glojurelang/glojure)** | [Glojure](https://github.com/glojurelang/glojure) | Go | **`in-1 glj && glj`** |
| **[7](#gloat){ #gloat }** | **[`gloat`](https://gloathub.org/)** | [Gloat](https://gloathub.org/) | Go | **`in-1 gloat && gloat --repl`** |
| **[8](#gobb){ #gobb }** | **[`gobb`](https://gobb.site/)** | [Gobb](https://gobb.site/) | Go | **`in-1 gobb && gobb`** |
| **[9](#hy){ #hy }** | **[`hy`](https://hylang.org/)** | [Hy](https://hylang.org/) | Python | **`in-1 hy && hy`** |
| **[10](#janet){ #janet }** | **[`janet`](https://janet-lang.org/)** | [Janet](https://janet-lang.org/) | C | **`in-1 janet && janet`** |
| **[11](#joker){ #joker }** | **[`joker`](https://joker-lang.org/)** | [Joker](https://joker-lang.org/) | Go | **`in-1 joker && joker`** |
| **[12](#jolt){ #jolt }** | **[`jolt`](https://jolt-lang.net/)** | [Jolt](https://jolt-lang.net/) | Chez Scheme | **`in-1 jolt && jolt`** |
| **[13](#lein){ #lein }** | **[`lein`](https://leiningen.org/)** | [Leiningen](https://leiningen.org/) | Java | **`in-1 lein && lein repl`** |
| **[14](#lg){ #lg }** | **[`lg`](https://nooga.github.io/let-go/)** | [let-go](https://nooga.github.io/let-go/) | Go | **`in-1 lg && lg`** |
| **[15](#nbb){ #nbb }** | **[`nbb`](https://github.com/babashka/nbb)** | [nbb](https://github.com/babashka/nbb) | Node.js | **`in-1 nbb && nbb`** |
| **[16](#phel){ #phel }** | **[`phel`](https://phel-lang.org/)** | [Phel](https://phel-lang.org/) | PHP | **`in-1 phel && phel`** |
| **[17](#squint){ #squint }** | **[`squint`](https://squint-cljs.github.io/squint/)** | [Squint](https://squint-cljs.github.io/squint/) | Node.js | **`in-1 squint && squint repl`** |
| **[18](#ys){ #ys }** | **[`ys`](https://yamlscript.org/)** | [YAMLScript](https://yamlscript.org/) | GraalVM | **`in-1 ys && ys --help`** |

The YAMLScript command shows its CLI options for evaluating expressions,
running programs, and transforming data.


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


## Want more dialects?

in-1 currently ships with the dialects listed above.
If you'd like to see another Clojure dialect supported here, please open an
issue on [GitHub](https://github.com/clojurestar/clojure-cc/issues).
