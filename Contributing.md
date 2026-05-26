Contributing to Clojure.cc
==========================

Thanks for your interest in helping out.
This site exists to catalog and showcase the family of Clojure dialects.
Additions, corrections and improvements are welcome.


## Suggesting a dialect

The dialect catalog is data-driven.
To add or correct a dialect, edit
[`src/dialects.yaml`](src/dialects.yaml) and open a pull request.

Each entry looks like:

```yaml
- name: Glojure
  site: https://github.com/glojurelang/glojure
  host: Go
  desc: Clojure interpreter hosted on Go with seamless Go interop
```

Entries are grouped by host platform at the top level.
If the dialect introduces a new host platform that doesn't yet exist in the
catalog, add a new group and a matching `## <Group Name>` section plus
`+++GROUP-KEY+++` placeholder in
[`src/dialects.md`](src/dialects.md).
The placeholder key is the group name uppercased, with spaces replaced by `-`,
and all other non-alphanumeric characters removed.

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
