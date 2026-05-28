Clojure.cc
==========

Source for [clojure.cc](https://clojure.cc), a site dedicated to the family of
Clojure dialects.

Spotted a missing or incorrect dialect?
Click the pencil icon on the
[Clojure Dialects](https://clojure.cc/dialects/) page to edit
[`src/dialects.yaml`](src/dialects.yaml) on GitHub.
See [Contributing.md](Contributing.md) for details.

<p align="center">
  <a href="https://clojure.cc">
    <img src="docs/img/logo.svg" alt="Clojure.cc" width="200">
  </a>
</p>


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
