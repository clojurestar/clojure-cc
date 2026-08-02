Contributing to ClojureStar
===========================

Thanks for your interest in helping out.
This site exists to catalog and showcase the family of Clojure dialects.
Additions, corrections and improvements are welcome.


## Suggesting a dialect

The dialect catalog is data-driven.
To add or correct a dialect, edit
[`src/dialects.yaml`](src/dialects.yaml) and open a pull request.
The pencil icon in the top-right of the
[Clojure Dialects](https://clojure.cc/dialects/) page links straight to that
file on GitHub.

Each entry looks like:

```yaml
- name: Babashka
  desc: Fast-starting Clojure interpreter for shell scripting
  site: https://book.babashka.org/
  repo: https://github.com/babashka/babashka
  host: GraalVM native
  fext: bb
  tags: [clojure, repl]
```

Fields:

- `name`, `desc`, `host` are required.
- `site` is the project homepage; if omitted, the dialect name links to `repo`.
- `repo` is the GitHub or GitLab URL. The build hits its API for the star
  count and either the latest release or the latest commit on the default
  branch.
- `fext` is the source file extension (optional).
- `tags` drives the badge icons. Current values: `clojure` (faithful
  implementation), `lisp` (Clojure-inspired Lisp), `native` (compiles to a
  native binary), `repl` (instant REPL via the CLI launcher).

The catalog is a single flat list, kept roughly in descending order of repo
stars.
The order isn't automatically updated when the site is published (the star
count and release info *are* updated automatically).
The site maintainers rearrange entries every so often as star counts drift.
New entries should be positioned according to the star count at the time of
entry.

After editing, test the website with `make serve`.


## Local development

```bash
make serve
```

Auto-installs Python, Go, the Glojure source, builds the WebAssembly REPL,
and starts a livereload dev server at <http://localhost:8000>.

```bash
make site     # production build into site/
make lint     # spellcheck with typos
```

All dependencies are installed locally under `./.cache/`.
No system-level Python, Go or other tools are required.


## Code style

- Markdown wraps at 80 columns.
- Each sentence starts on its own line.
- Markdown headings have 2 blank lines before them.
- YAML block sequences are not indented under their mapping keys.
- Commit messages start with capital, 20-50 chars, no final period.


## Reporting issues

Bugs, feature requests and dialect suggestions can also be filed on the
[issue tracker](https://github.com/clojurestar/clojure-cc/issues).
