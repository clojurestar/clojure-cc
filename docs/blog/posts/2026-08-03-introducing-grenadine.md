---
date: 2026-08-03
authors: [ingydotnet]
categories: [ClojureStar, Grenadine]
---

# Introducing Grenadine

Most Clojure dialects eventually run into the same problem: the libraries they
want to use are published to Maven repositories, but the machinery for finding
and installing those libraries usually assumes a JVM.
Every dialect is left to solve POM parsing, transitive dependencies, version
conflicts, downloads and source loading for itself.

[Grenadine](https://github.com/clojurestar/grenadine) is a new portable Maven
dependency resolver written in pure Clojure.
Its goal is simple: give Clojure dialects one resolver they can share instead
of asking every implementation to rebuild the Maven dependency stack.
It is also a native, Java-free command for directly managing an M2 repository.

<!-- more -->

## Pomegranate, with the JVM pressed out

Grenadine's resolver core parses effective POMs, walks transitive dependency
graphs and fetches artifacts from
[Maven Central](https://central.sonatype.com/), [Clojars](https://clojars.org/)
or other configured repositories.
It supports newest, Maven-nearest and tools.deps conflict mediation, verifies
checksums and prepares extracted Clojure source roots for non-JVM runtimes.

The same core currently runs unchanged on JVM Clojure,
[Babashka](https://babashka.org/),
[Glojure](https://github.com/glojurelang/glojure),
[Jolt](https://github.com/jolt-lang/jolt) and
[let-go](https://github.com/nooga/let-go).
Small host adapters provide the filesystem, HTTP and load-path operations that
differ between runtimes.
That boundary gives another dialect a clear integration path without making it
reimplement dependency resolution.

## One portable call

Grenadine introduces `clojurestar.deps`, an intentionally small API for code
that should run across dialects:

```clojure
(require '[clojurestar.deps :as deps])

(deps/add-deps
 '{:deps
   {dev.weavejester/medley {:mvn/version "1.10.0"}}})

(require '[medley.core :as medley])

(println (medley/map-vals inc {:one 1 :two 2}))
```

The current versions of Jolt and Glojure both run this exact code unchanged.
Hopefully more dialects like Babashka and let-go can follow soon.

```sh
$ glj main.clj
{:one 2, :two 3}
$ jolt main.clj
{:one 2, :two 3}
```

The same `add-deps` form is available in each of the five current runtime
integrations.
Each dialect remains responsible for adding the resulting JARs or extracted
source roots to its own loader.
Dialect-specific namespaces remain available when a program needs richer
options or result data.

## A new kind of M2 tool

Grenadine also ships a native binary CLI
([for 13 machine platforms](https://github.com/clojurestar/grenadine/releases))
for full control of managing Maven dependencies.
It can add to, list, inspect and remove dependencies from the standard
`$HOME/.m2/repository` or any other selected repository, without starting Java.

```sh
grenadine --repository=my-m2 --add deps.edn
grenadine --repository=my-m2 --list
```

The expand operation shows the complete selected graph without installing its
JARs:

```sh
$ grenadine --expand https://github.com/clj-commons/clj-yaml/blob/master/deps.edn
org.clojure/clojure 1.10.1
org.clojure/core.specs.alpha 0.2.44
org.clojure/spec.alpha 0.2.176
org.flatland/ordered 1.15.12
org.yaml/snakeyaml 2.6
```

Adding that file installs the complete graph into the local Maven repository:

```sh
$ grenadine --add https://github.com/clj-commons/clj-yaml/blob/master/deps.edn
Installed org.clojure/clojure 1.10.1
Installed org.clojure/core.specs.alpha 0.2.44
Installed org.clojure/spec.alpha 0.2.176
Installed org.flatland/ordered 1.15.12
Installed org.yaml/snakeyaml 2.6
=> Installed: 5  Already: 0  Total: 5
```

Individual coordinates can be deleted by exact version or across all versions:

```sh
$ grenadine --delete org.flatland/ordered 1.15.12 org.yaml/snakeyaml
Deleted org.flatland/ordered 1.15.12
Deleted org.yaml/snakeyaml (all versions)
=> Deleted: 2  Missing: 0  Total: 2
```

Listing the repository now shows the three remaining artifacts:

```sh
$ grenadine --list
org.clojure/clojure 1.10.1
org.clojure/core.specs.alpha 0.2.44
org.clojure/spec.alpha 0.2.176
```

The same input can be expanded and removed from a selected repository:

```sh
grenadine --repository=my-m2 --remove \
  https://github.com/clj-commons/clj-yaml/blob/master/deps.edn
```

Inputs can be local or remote `deps.edn` files, URLs to `deps.edn` files or
Maven coordinates supplied directly on the command line.
Grenadine can delete an exact coordinate or expand and remove its complete
dependency closure.

See the [Grenadine documentation](https://clojurestar.github.io/grenadine/)
for library setup, installation options and the complete command reference.

## Help make it shared infrastructure

Grenadine is not meant to belong to one implementation.
It is infrastructure for helping all [Clojure dialects](../../dialects.md)
participate more fully in the library ecosystem that already exists in Maven
repositories.

If you maintain a dialect, try the portable API and help us build the next
runtime adapter.
If you use multiple dialects, tell us where dependency management still gets
in your way.
Join the conversation in the
[#clojurestar channel on Clojurians Slack](https://clojurians.slack.com/archives/C0B655S3R19).
