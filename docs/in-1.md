---
title: in-1
description:
  Install Clojure dialects and tools with no prerequisites.
hide:
- navigation
---

# Install with in-1

[in-1](https://in-1.cc) gives you a working local Clojure dialect command
with a single command and no prerequisites.
This installs the dialect _(very quickly!)_ and adds its command directory to
`PATH`.
You can then run the command by name.

```bash
$ source <(curl -sL in-1.cc) bb && which bb && bb --version
/tmp/in-1/local/bin/bb
babashka v1.13.219
```

The command is [in-1](https://in-1.cc), which uses
[Makes](https://github.com/makeplus/makes) to auto-install both the dialect
*and* its host language (Java, Go, Python, PHP, etc.) into a local directory.
Your system stays clean.

By default, everything lives under `$TMPDIR/in-1/` (normally `/tmp/in-1/`),
with the commands in `/tmp/in-1/local/bin/`.
Set `PREFIX` to choose a different self-contained location:

```bash
$ source <(curl -sL in-1.cc) jolt JOLT-VERSION=0.7.1 PREFIX=/tmp/foobar && which jolt && jolt --version
/tmp/foobar/bin/jolt
jolt v0.7.1
```

This installs the public command as `/tmp/foobar/bin/jolt` and keeps the
versioned Jolt installation and its dependencies under
`/tmp/foobar/share/jolt/0.7.1/`.

You can ask for several dialects at once:

```bash
source <(curl -sL in-1.cc) bb clj glj
```

> **Note:** For the Fish shell, use:
> ```fish
> curl -sL in-1.cc | source - bb; and bb
> ```


## Install the in-1 command

Use `source <(curl -sL in-1.cc) bb && bb` to start Babashka directly, or
install `in-1` first:

```bash
source <(curl -sL in-1.cc) in-1
```

Then use the shorter commands from [Try Dialects](try.md) or
[Clojure Tools](tools.md) in the same shell.


## Updates and permanent installations

| Command | Purpose |
|:--------|---------|
| **`source <(curl -sL in-1.cc) -U bb`** | Update in-1 and Makes first, then install |
| **`in-1 --local bb`** | Keep a dialect for good, under `~/.local` |

The second one needs the `in-1` command installed; see
<https://in-1.cc/install/>.


## Examples

Launch a Glojure REPL:

```bash
source <(curl -sL in-1.cc) glj && glj
```

Evaluate a let-go expression:

```bash
source <(curl -sL in-1.cc) lg && lg -e '(+ 1 2 3)'
```

Pin a Babashka version:

```bash
source <(curl -sL in-1.cc) bb BABASHKA-VERSION=1.12.218 &&
  bb -e 'babashka.fs/glob'
```

Or simplify with a shell function:

```bash
ccc() {
  local dialect=$1
  shift
  source <(curl -sL in-1.cc) "$dialect" && "$dialect" "$@"
}

ccc clj
ccc bb -e '(+ 1 2 3)'
```


## How it works

The sourced script is [in-1](https://in-1.cc), which:

1. Clones itself into `/tmp/in-1/` and shallow-clones
   [makeplus/makes](https://github.com/makeplus/makes) into it.
2. Loads the Makes module for the requested dialect.
3. Downloads the host language toolchain (Java, Go, Python...).
4. Downloads and installs the dialect under
   `/tmp/in-1/local/share/<dialect>/<version>/`.
5. Creates a command wrapper in `/tmp/in-1/local/bin/` containing the
   complete runtime environment.
   Clojure and Leiningen keep their `.clojure` and `.m2` directories inside
   the installation, and Jolt and Phel start their REPL under `rlwrap` when
   it is available.
6. Adds the wrapper directory to `PATH` in your current shell.

Everything lives under the selected prefix; remove that directory manually
when you no longer need the installation.

See [in-1](https://in-1.cc/doc/design/) and
[makeplus/makes](https://github.com/makeplus/makes) for the implementation
details.
