import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {pathToFileURL} from "node:url";
import vm from "node:vm";

const execPath = "docs/repl/wasm_exec.js";
const wasmPath = "docs/repl/glj.wasm";
const forms = process.env.CLOJUREDOCS_FORMS ||
  ".cache/local/cache/clojuredocs-js/forms.js";
const {prepareReplSource} = await import(pathToFileURL(resolve(forms)));

vm.runInThisContext(readFileSync(execPath, "utf8"), {
  filename: execPath,
});

const go = new Go();
const originalWrite = globalThis.fs.writeSync;
let exitCode = 0;
let stdout = "";
let stderr = "";

globalThis.fs.writeSync = (fd, buffer) => {
  const text = new TextDecoder().decode(buffer);
  if (fd === 1) stdout += text;
  if (fd === 2) stderr += text;
  return buffer.length;
};

const defaultExit = go.exit;
const source = "(def values [1 2 3])\n(map inc values)";
go.argv = ["glj", "-e", prepareReplSource(source)];
go.env = {GLJ_REPL_NO_BANNER: "all"};
go.exit = (code) => {
  exitCode = code;
  defaultExit(code);
};

try {
  const bytes = readFileSync(wasmPath);
  const result = await WebAssembly.instantiate(bytes, go.importObject);
  await go.run(result.instance);
} finally {
  globalThis.fs.writeSync = originalWrite;
}

const expected = "#'clojure.core/values\n(2 3 4)";
if (exitCode !== 0 || stdout.trim() !== expected || stderr) {
  console.error({exitCode, stdout, stderr});
  process.exitCode = 1;
} else {
  console.log("Glojure WebAssembly smoke test passed.");
}
