import {basicSetup} from "codemirror";
import {defaultKeymap} from "@codemirror/commands";
import {EditorState} from "@codemirror/state";
import {EditorView, keymap} from "@codemirror/view";
import {clojure} from "@nextjournal/lang-clojure";
import {prepareReplSource} from "./forms.js";

const SOURCE_LIMIT = 100 * 1024;
const TIMEOUT = 5000;
const LOAD_TIMEOUT = 120000;
const DEBOUNCE = 500;
const TABLE_COLUMNS = {ns: 0, name: 1, examples: 2, runnable: 3};
const NUMERIC_TABLE_COLUMNS = new Set(["examples", "runnable"]);

class RuntimeQueue {
  constructor() {
    this.jobs = [];
    this.nextId = 1;
    this.worker = null;
    this.active = null;
  }

  run(source, progress, key) {
    this.cancel(key);
    return new Promise((resolve) => {
      this.jobs.push({
        id: this.nextId++,
        source,
        progress,
        resolve,
        key,
      });
      this.startNext();
    });
  }

  cancel(key) {
    this.jobs = this.jobs.filter((job) => {
      if (job.key !== key) return true;
      job.resolve({cancelled: true});
      return false;
    });
    if (this.active?.key === key) this.active.cancelled = true;
  }

  startNext() {
    if (this.active || this.jobs.length === 0) return;
    if (!this.worker) this.createWorker();

    this.active = this.jobs.shift();
    this.active.phase = "loading";
    this.active.progress("Loading Glojure");
    this.active.timer = window.setTimeout(
      () => this.timeout(),
      LOAD_TIMEOUT,
    );
    this.worker.postMessage({
      type: "run",
      id: this.active.id,
      source: this.active.source,
    });
  }

  createWorker() {
    this.worker = new Worker("/javascripts/clojuredocs-worker.js");
    this.worker.onmessage = (event) => this.receive(event.data);
    this.worker.onerror = (event) => this.fail(event.message);
  }

  receive(message) {
    if (!this.active || message.id !== this.active.id) return;
    if (message.type === "loading") {
      return;
    }
    if (message.type === "running") {
      window.clearTimeout(this.active.timer);
      this.active.phase = "running";
      if (!this.active.cancelled) this.active.progress("Running");
      this.active.timer = window.setTimeout(() => this.timeout(), TIMEOUT);
      return;
    }
    if (message.type !== "result") return;

    const job = this.active;
    window.clearTimeout(this.active.timer);
    job.resolve(job.cancelled ? {cancelled: true} : message);
    this.active = null;
    this.startNext();
  }

  timeout() {
    const job = this.active;
    this.worker.terminate();
    this.worker = null;
    this.active = null;
    job.resolve(job.cancelled
      ? {cancelled: true}
      : {
          ok: false,
          stdout: "",
          stderr: job.phase === "running"
            ? "Evaluation stopped after 5 seconds."
            : "Glojure did not load within 2 minutes.",
          truncated: false,
        });
    this.startNext();
  }

  fail(message) {
    if (!this.active) return;
    window.clearTimeout(this.active.timer);
    const job = this.active;
    job.resolve(job.cancelled
      ? {cancelled: true}
      : {
          ok: false,
          stdout: "",
          stderr: message || "The Glojure worker failed.",
          truncated: false,
        });
    this.worker.terminate();
    this.worker = null;
    this.active = null;
    this.startNext();
  }
}

const queue = new RuntimeQueue();
let editors = [];

function editorFor(textarea) {
  const example = textarea.closest(".clojuredocs-example");
  const runButton = textarea.parentElement.querySelector("[data-run]");
  const status = textarea.parentElement.querySelector("[data-status]");
  const output = textarea.parentElement.querySelector("[data-output]");
  const original = textarea.value;
  const queueKey = {};
  let debounceTimer;
  let live = false;
  let revision = 0;

  function clearOutput() {
    output.hidden = true;
    output.style.height = "";
    output.textContent = "";
    output.classList.remove("clojuredocs-output-error");
    status.textContent = "";
  }

  function updateControls() {
    runButton.textContent = live ? "\u25bc" : "\u25b6";
    runButton.setAttribute(
      "aria-label",
      live ? "Stop live evaluation" : "Run example",
    );
    runButton.setAttribute("aria-expanded", String(live));
  }

  function stop() {
    live = false;
    revision += 1;
    window.clearTimeout(debounceTimer);
    debounceTimer = undefined;
    queue.cancel(queueKey);
    example.setAttribute("aria-busy", "false");
    clearOutput();
    updateControls();
  }

  async function run() {
    if (!live) {
      live = true;
      updateControls();
    }
    window.clearTimeout(debounceTimer);
    debounceTimer = undefined;
    const currentRevision = ++revision;
    const source = view.state.doc.toString();
    queue.cancel(queueKey);
    const outputHeight = output.hidden
      ? 0
      : output.getBoundingClientRect().height;
    output.style.height = outputHeight > 0 ? `${outputHeight}px` : "";
    output.hidden = false;
    output.textContent = "";
    output.classList.remove("clojuredocs-output-error");
    if (new TextEncoder().encode(source).length > SOURCE_LIMIT) {
      example.setAttribute("aria-busy", "false");
      output.textContent = "Source is larger than the 100 KiB limit.";
      output.classList.add("clojuredocs-output-error");
      output.style.height = "";
      output.hidden = false;
      status.textContent = "";
      return true;
    }

    example.setAttribute("aria-busy", "true");
    const evaluationSource = prepareReplSource(source);
    const result = await queue.run(
      evaluationSource,
      (text) => {
        if (live && currentRevision === revision) {
          status.textContent = text;
        }
      },
      queueKey,
    );
    if (!live || currentRevision !== revision || result.cancelled) {
      return true;
    }

    example.setAttribute("aria-busy", "false");
    status.textContent = result.elapsedMs ? `${result.elapsedMs} ms` : "";
    const text = `${result.stdout}${result.stderr}`;
    output.textContent = text || (result.ok ? "nil" : "Evaluation failed.");
    if (result.truncated) output.textContent += "\n[output truncated]";
    output.classList.toggle("clojuredocs-output-error", !result.ok);
    output.style.height = "";
    output.hidden = false;
    return true;
  }

  function scheduleRun() {
    if (!live) {
      clearOutput();
      return;
    }
    revision += 1;
    queue.cancel(queueKey);
    example.setAttribute("aria-busy", "false");
    window.clearTimeout(debounceTimer);
    status.textContent = "Waiting";
    debounceTimer = window.setTimeout(run, DEBOUNCE);
  }

  const state = EditorState.create({
    doc: original,
    extensions: [
      basicSetup,
      clojure(),
      EditorView.lineWrapping,
      keymap.of([
        {key: "Mod-Enter", run},
        ...defaultKeymap,
      ]),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) scheduleRun();
      }),
    ],
  });
  const view = new EditorView({
    state,
    parent: textarea.parentElement.querySelector("[data-editor]"),
  });

  textarea.hidden = true;
  updateControls();
  view.dom.addEventListener("focusin", () => {
    if (!live) run();
  });
  runButton.addEventListener("click", () => {
    if (live) {
      stop();
    } else {
      run();
    }
  });
  return {
    destroy() {
      stop();
      view.destroy();
    },
  };
}

function tableValue(row, key) {
  const value = row.cells[TABLE_COLUMNS[key]].textContent.trim();
  return NUMERIC_TABLE_COLUMNS.has(key) ? Number(value) : value;
}

function compareValues(left, right, key) {
  if (NUMERIC_TABLE_COLUMNS.has(key)) return left - right;
  return left.localeCompare(right, undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

function compareRows(left, right, key, direction) {
  const primary = compareValues(
    tableValue(left, key),
    tableValue(right, key),
    key,
  );
  if (primary !== 0) return direction === "ascending" ? primary : -primary;

  for (const tieKey of ["ns", "name", "examples", "runnable"]) {
    if (tieKey === key) continue;
    const tie = compareValues(
      tableValue(left, tieKey),
      tableValue(right, tieKey),
      tieKey,
    );
    if (tie !== 0) return tie;
  }
  return 0;
}

const TABLE_SORT_STORAGE_KEY = "clojuredocs-sort-v1";

function loadTableSort() {
  try {
    const saved = JSON.parse(localStorage.getItem(TABLE_SORT_STORAGE_KEY));
    if (
      TABLE_COLUMNS[saved?.key] !== undefined &&
      ["ascending", "descending"].includes(saved.direction)
    ) {
      return saved;
    }
  } catch (_error) {
    // Storage can be unavailable in privacy-restricted browser contexts.
  }
  return null;
}

function saveTableSort(key, direction) {
  try {
    localStorage.setItem(
      TABLE_SORT_STORAGE_KEY,
      JSON.stringify({key, direction}),
    );
  } catch (_error) {
    // Sorting still works for the current page when storage is unavailable.
  }
}

function initTable(table) {
  if (table.dataset.sortReady) return;
  table.dataset.sortReady = "true";

  const body = table.tBodies[0];
  const headers = [...table.querySelectorAll("th[data-sort-key]")];
  const saved = loadTableSort();
  let key = saved?.key ?? "examples";
  let direction = saved?.direction ?? "descending";

  function updateHeaders() {
    headers.forEach((header) => {
      header.setAttribute(
        "aria-sort",
        header.dataset.sortKey === key ? direction : "none",
      );
    });
  }

  function applySort() {
    [...body.rows]
      .sort((left, right) => compareRows(left, right, key, direction))
      .forEach((row) => body.append(row));
    updateHeaders();
  }

  function sort(nextKey) {
    if (nextKey === key) {
      direction = direction === "ascending" ? "descending" : "ascending";
    } else {
      key = nextKey;
      direction = NUMERIC_TABLE_COLUMNS.has(key)
        ? "descending"
        : "ascending";
    }
    applySort();
    saveTableSort(key, direction);
  }

  headers.forEach((header) => {
    const button = header.querySelector("button");
    button.addEventListener(
      "click",
      () => {
        header.dataset.tooltipDismissed = "true";
        sort(header.dataset.sortKey);
      },
    );
    header.addEventListener("pointerleave", () => {
      delete header.dataset.tooltipDismissed;
    });
  });
  applySort();
}

function init(root) {
  root.querySelectorAll("[data-clojuredocs-table]").forEach(initTable);
  editors.forEach((editor) => editor.destroy());
  editors = [];
  root.querySelectorAll("[data-clojuredocs-source]").forEach((textarea) => {
    editors.push(editorFor(textarea));
  });
}

window.ClojureDocsEditor = {init};
