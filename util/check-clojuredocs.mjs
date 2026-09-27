import {readdirSync, readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";
import {resolve} from "node:path";
import {pathToFileURL} from "node:url";

const directory = "docs/clojuredocs.org";
const glj = process.env.GLJ || ".cache/local/bin/glj-check";
const forms = process.env.CLOJUREDOCS_FORMS ||
  ".cache/local/cache/clojuredocs-js/forms.js";
const selectedExamples = process.env.CLOJUREDOCS_EXAMPLE_IDS
  ? new Set(process.env.CLOJUREDOCS_EXAMPLE_IDS.split(","))
  : null;
const {prepareReplSource} = await import(pathToFileURL(resolve(forms)));
const failures = [];
const checkedExamples = new Set();

function evaluate(source) {
  return spawnSync(glj, ["-e", prepareReplSource(source)], {
    encoding: "utf8",
    maxBuffer: 1024 * 1024,
    timeout: 5000,
  });
}

function failProbe(name, result) {
  failures.push({
    id: name,
    page: "runtime-probe",
    error: (result.stderr || result.error?.message || "unexpected output")
      .trim()
      .split("\n")[0],
  });
}

const shared = evaluate("(def repl-probe 1)\n(+ repl-probe 2)");
const sharedLines = shared.stdout.trim().split("\n");
if (shared.status !== 0 ||
    !sharedLines[0]?.endsWith("/repl-probe") ||
    sharedLines[1] !== "3") {
  failProbe("shared-top-level-state", shared);
}

const printed = evaluate('(println "side effect")\n(+ 1 2)');
if (printed.status !== 0 || printed.stdout !== "side effect\nnil\n3\n") {
  failProbe("stdout-order", printed);
}

const bounded = evaluate("(partition 0 [1 2 3])");
if (bounded.status !== 0 || !bounded.stdout.includes("...")) {
  failProbe("bounded-printing", bounded);
}

const stopped = evaluate(
  '(throw (ex-info "stop here" {}))\n(println "ran after error")',
);
if (stopped.status === 0 || stopped.stdout.includes("ran after error")) {
  failProbe("stop-on-error", stopped);
}

function markdownFiles(path) {
  return readdirSync(path, {withFileTypes: true}).flatMap((entry) => {
    const child = `${path}/${entry.name}`;
    return entry.isDirectory() ? markdownFiles(child) : [child];
  }).filter((file) => file.endsWith(".md"));
}

function decode(text) {
  return text
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&");
}

for (const file of markdownFiles(directory)) {
  const markdown = readFileSync(file, "utf8");
  const pattern = new RegExp(
    'class="clojuredocs-example" data-example-id="([^"]+)"' +
      "[^]*?<textarea[^>]*>([^]*?)</textarea>",
    "g",
  );

  for (const match of markdown.matchAll(pattern)) {
    if (selectedExamples && !selectedExamples.has(match[1])) continue;
    checkedExamples.add(match[1]);
    const result = evaluate(decode(match[2]));
    if (result.status === 0) continue;

    failures.push({
      id: match[1],
      page: file.slice(directory.length + 1).replace(/\.md$/, ""),
      error: (result.stderr || result.error?.message || "timed out")
        .trim()
        .split("\n")[0],
    });
  }
}

if (selectedExamples) {
  for (const id of selectedExamples) {
    if (checkedExamples.has(id)) continue;
    failures.push({
      id,
      page: "selection",
      error: "selected example was not found",
    });
  }
}

console.log(JSON.stringify(failures, null, 2));
process.exitCode = failures.length ? 1 : 0;
