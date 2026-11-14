"use strict";

importScripts("/repl/wasm_exec.js");

const OUTPUT_LIMIT = 64 * 1024;
let modulePromise;

function loadModule() {
  if (!modulePromise) {
    modulePromise = fetch("/repl/glj.wasm")
      .then((response) => {
        if (!response.ok) throw new Error("Could not load Glojure.");
        return response.arrayBuffer();
      })
      .then((bytes) => WebAssembly.compile(bytes));
  }
  return modulePromise;
}

function captureOutput() {
  const decoder = new TextDecoder("utf-8");
  const streams = {1: "", 2: ""};
  let truncated = false;
  const original = globalThis.fs.writeSync;

  globalThis.fs.writeSync = function (fd, buffer) {
    if (fd !== 1 && fd !== 2) return original.apply(this, arguments);

    const text = decoder.decode(buffer);
    const left = OUTPUT_LIMIT - streams[fd].length;
    if (left > 0) streams[fd] += text.slice(0, left);
    if (text.length > left) truncated = true;
    return buffer.length;
  };

  return {
    finish() {
      globalThis.fs.writeSync = original;
      return {
        stdout: streams[1],
        stderr: streams[2],
        truncated,
      };
    },
  };
}

async function evaluate(message) {
  const started = performance.now();
  postMessage({type: "loading", id: message.id});

  try {
    const module = await loadModule();
    postMessage({type: "running", id: message.id});
    const go = new Go();
    let exitCode = 0;
    const defaultExit = go.exit;
    go.argv = ["glj", "-e", message.source];
    go.env = {GLJ_REPL_NO_BANNER: "all"};
    go.exit = (code) => {
      exitCode = code;
      defaultExit(code);
    };

    const capture = captureOutput();
    let output;
    try {
      const instance = await WebAssembly.instantiate(module, go.importObject);
      await go.run(instance);
    } finally {
      output = capture.finish();
    }

    postMessage({
      type: "result",
      id: message.id,
      ok: exitCode === 0,
      stdout: output.stdout,
      stderr: output.stderr,
      truncated: output.truncated,
      elapsedMs: Math.round(performance.now() - started),
    });
  } catch (error) {
    postMessage({
      type: "result",
      id: message.id,
      ok: false,
      stdout: "",
      stderr: error.message || String(error),
      truncated: false,
      elapsedMs: Math.round(performance.now() - started),
    });
  }
}

self.onmessage = (event) => {
  if (event.data.type === "run") evaluate(event.data);
};
