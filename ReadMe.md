# Clojure.cc

Source for [clojure.cc](https://clojure.cc), a site dedicated to the family of
Clojure dialects.

## Built With

- **MkDocs** static site generator
- **Material for MkDocs** theme
- **Makes** Makefile-based dependency system (auto-installs Python and tools)

## Local Development

```bash
make serve
```

Auto-installs Python, sets up a venv, installs MkDocs, and starts a livereload
dev server at http://localhost:8000.

No prerequisites needed beyond a working `make` and `git`.

## Build

```bash
make site
```

Output goes to `site/`.

## Publish

```bash
make publish
```

Builds the site and force-pushes to the `gh-pages` branch of the repo set in
`REPO` (override on the command line if needed).

## Site Structure

```
.
├── docs/                # Content (Markdown)
│   ├── index.md         # Homepage
│   ├── dialects.md      # Comparison table of Clojure dialects
│   ├── try.md           # Embedded WASM REPL
│   ├── repl.md          # REPL launcher documentation
│   ├── repl.mk          # The curl-able Makefile (clojure.cc/repl.mk)
│   ├── css/extra.css    # Custom styling
│   └── CNAME            # Custom domain
├── theme/               # Jinja2 theme overrides
├── bin/                 # Build helpers
├── mkdocs.yaml          # MkDocs config
├── requirements.txt     # Python dependencies
└── Makefile             # Build automation (Makes-based)
```
