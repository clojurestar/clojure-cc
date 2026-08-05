---
date: 2026-08-05
slug: introducing-gobb
categories:
  - ClojureStar
---

# Introducing Gobb: Go + bb

> TL;DR [Gobb](https://gobb.site/)

I became a Clojure programmer 3 years ago for very specific reasons.
I lead maintenance of the [YAML](https://yaml.org) data language, and I wanted
to expand the YAML ecosystem, including making a YAML based programming
language.
Clojure had the right stuff to make this happen.

The combination that made this possible was GraalVM's `native-image` compiler
and [Babashka](https://babashka.org/)'s [SCI](https://github.com/babashka/sci)
runtime.
Together they gave me a way to write
[YAMLScript](https://yamlscript.org/) in Clojure and still ship it as native
binaries and shared libraries.
Those shared libraries now sit behind YAMLScript binding libraries for 32
programming languages.

That was the reason I started writing Clojure, and it is still the main reason
I write Clojure today.

<!-- more -->

## Looking beyond GraalVM

After working this way for about a year, I became increasingly frustrated with
GraalVM.

The `native-image` compiler is famously slow.
It does not cross-compile, and its practical release-platform coverage is
limited.
The Oracle GraalVM distribution I use is licensed under
[Oracle's GFTC](https://www.oracle.com/downloads/licenses/graal-free-license.html),
not an OSI-approved open source license.

More fundamentally, the whole stack was based on the JVM.
That is a natural home for most of the Clojure community, but it was not the
home I wanted for YAML.
YAML is deeply embedded in the Go ecosystem, especially around Kubernetes and
cloud infrastructure.
I wanted my YAML tools to fit naturally into that world.

Last summer I discovered
[Glojure](https://github.com/glojurelang/glojure), a port of Clojure hosted on
Go, and began working with its author, James Hamlin.
Later that winter I created [Gloat](https://gloathub.org/) to automate turning
Clojure programs into Go source, native binaries, shared libraries and
WebAssembly.

By then I was also working on [YAMLStar](https://yamlstar.org/), a common YAML
framework for all programming languages and a variant of the YAMLScript code
base.
Around this time, Gloat reached the point where it could compile YAMLStar's
Clojure code into shared libraries and make the same 32 language bindings work.

There was just one rather important problem: it was 40 times slower than the
GraalVM version.

That was about 5-6 months ago and Glojure has evolved massively since then.
The Glojure optimization work at the end of July closed the practical
performance gap enough for YAMLStar to switch completely to Glojure and the Go
stack.
There is no JVM and no SCI runtime in the new YAMLStar implementation.
YAMLScript should be able to follow soon, once its remaining Java YAML parser
dependency has been replaced.

## A bigger possibility for Clojure

Once YAMLStar made that switch, I realized this could be much bigger than my
own YAML projects.

Gloat and Glojure offer a new way to compile Clojure programs that:

- uses openly licensed technology;
- compiles much faster than GraalVM `native-image`
- cross-compiles to about 25 platform architectures, including BSDs, 32-bit
  systems and WebAssembly; and
- has reached practical native runtime performance while continuing to get
  faster.

That felt like a really big deal for Clojure.
The problem was figuring out how to make the point in a way that Clojure
programmers would immediately understand.

Two weeks ago I had an idea: what if Glojure could compile Babashka itself?

Babashka is one of the clearest demonstrations of why native Clojure matters.
People already understand `bb`, its startup time, its scripting model and the
remarkable amount of useful Clojure software bundled into one executable.
If Babashka source could run on Glojure, then the possibilities of this new
stack would be much harder to dismiss as a YAML-specific curiosity.

It also sounded like a project that could take years, assuming it was even
possible at all.

## From a question to a working binary

So I wrote a 17-milestone plan and gave it to my AI coding agent.
Within about 30 minutes it had compiled selected Babashka source into the first
working binary.

I called the project [Gobb](https://gobb.site/): Go + bb.
It is pronounced "Joe-Bee," rhyming with "Moby."

The first binary was only milestone one.
The agent kept working through the plan, and Gobb has now completed 14 of the
17 milestones.
It can evaluate expressions and scripts, run a native REPL, load project
dependencies, execute project tasks, start REPL and HTTP services and run
Babashka's reusable REPL loop as WebAssembly directly in a browser.

You can [try that browser REPL now](https://gobb.site/repl/).

Gobb also ships prebuilt binaries for 15 platforms.
The underlying Go toolchain can target about 25 platform architectures,
including native systems, WASI and browser WebAssembly.

The architecture is straightforward:

```text
Babashka-compatible source and behavior
                  |
            Gobb host layer
                  |
          Glojure runtime
                  |
         Gloat compilation
                  |
       Go native binary or Wasm
```

Gobb uses Babashka source where that source is portable, but it is not merely a
recompiled copy of Babashka.
Babashka's host implementation is built around SCI, JVM classes and GraalVM
configuration.
Gobb replaces those responsibilities with Glojure, Go-backed adapters and a
compatibility layer that is being filled in feature by feature.

There is no JVM, GraalVM or SCI anywhere in the Gobb runtime.

## Babashka in a browser

The browser result deserves special attention.

Gobb compiles Babashka's reusable REPL loop and the Glojure runtime to browser
WebAssembly.
The result is a BB-style Clojure REPL running directly in a web page, without
an iframe or a remote evaluation service.
Putting Babashka source into a browser this way seems like a significant result
on its own.

The native and browser REPLs also share a common session format.
Every form in the session is stored in a Base64-encoded URL fragment.
Clicking **Share** in the browser copies that URL.
Pressing ++ctrl+s++ in the native Gobb REPL prints a URL in the same format.

Give the URL to someone else and it opens the browser REPL, replays the forms
in order and reconstructs the session state.
They can paste the URL into the browser or a gobb REPL client.
That makes a REPL session into something you can hand to another person: an
executable example, a bug reproduction, a tiny tutorial or just an interesting
piece of Clojure.

This is not a claim that all of Babashka now works in every browser.
It is proof that real Babashka source and its familiar interactive model can
cross that boundary using Glojure and Gloat.

## What Gobb is not

Gobb is not a Babashka competitor, and it is not ready to replace Babashka.
It is an architecture proof.

Its compatibility work is still very much in progress.
The current milestone is closing the remaining gaps exposed by Babashka's
upstream library tests.
Some ordinary BB programs already work; many libraries still encounter missing
Java compatibility or Glojure runtime behavior.
The [public roadmap](https://gobb.site/roadmap/) shows both the completed work
and what remains.

Before announcing Gobb, I spoke with Babashka's author, Michiel Borkent
([@borkdude](https://github.com/borkdude)).
I wanted to be clear about why I had made it and to avoid creating extra work
or implying that this was an alternative Babashka project he should support.

He was fine with me announcing it, while being equally clear that he did not
have time to maintain it.
His suggested framing was: "Announce it as a fun experiment just to see how far
you can push things."

That is what Gobb is.
Neither of us is promising to turn it into a production environment.
I have pressing work of my own, and my reason for building Gobb was to make a
larger possibility visible.

## Programming in broader strokes

The role of AI in this project is not incidental, and I do not want to hide
it.
I designed the experiment, wrote the staged plan, made the architectural
choices and directed the work.
An AI agent performed most of the implementation, testing and iteration needed
to carry that plan forward.

A Clojure friend recently told me something close to this:

> After programming my entire life, I feel like I am allowed to program in
> broader strokes.

That is how I think about this work.
I am not less interested in correctness, tests or technical detail.
I am interested in using the best tools available to explore larger ideas than
I could reasonably implement alone in the same amount of time.

Gobb went from an uncertain thought experiment to a working native and browser
runtime in days.
It is not production-ready, but it is real enough to demonstrate that the
underlying idea works.

## The real invitation

Try [Gobb](https://github.com/gloathub/gobb).
Experiment with the [browser REPL](https://gobb.site/repl/).
Look through its measured compatibility work and decide for yourself what it
proves.

But Gobb itself is not the most important invitation.

The important invitation is to try [Gloat](https://gloathub.org/) on your own
Clojure programs.
Compile something to a native Go binary.
Cross-compile it for a platform that GraalVM does not reach.
Build a shared library or put it in a browser as WebAssembly.

Gobb exists to show that this new Go-native world is possible for serious
Clojure software.
Now I want to see what the Clojure community builds with it.
