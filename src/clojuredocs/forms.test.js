import assert from "node:assert/strict";
import test from "node:test";

import {prepareReplSource} from "./forms.js";

const prefix =
  "(clojure.core/binding [clojure.core/*print-length* 100 " +
  "clojure.core/*print-level* 20] (clojure.core/prn ";

test("wraps each top-level form", () => {
  const source = "(def x 1)\n(+ x 2)";
  const expected = `${prefix}(def x 1)))\n${prefix}(+ x 2)))`;
  assert.equal(prepareReplSource(source), expected);
});

test("preserves comments and discarded forms", () => {
  const source = ";; heading\n(def x [1\n  2])\n#_(ignored)\n(+ x 3)";
  const expected =
    `;; heading\n${prefix}(def x [1\n  2])))\n` +
    `#_(ignored)\n${prefix}(+ x 3)))`;
  assert.equal(prepareReplSource(source), expected);
});

test("wraps reader prefixes with their forms", () => {
  const source = "^:private (def x 1)\n'foo";
  const expected =
    `${prefix}^:private (def x 1)))\n${prefix}'foo))`;
  assert.equal(prepareReplSource(source), expected);
});

test("discards lists headed by numbers or strings", () => {
  const source = '(2 4 5)\n("expected output")\n(+ 1 2)';
  const expected =
    '#_(2 4 5)\n#_("expected output")\n' +
    `${prefix}(+ 1 2)))`;
  assert.equal(prepareReplSource(source), expected);
});

test("evaluates standalone number and string forms", () => {
  const source = '42\n"hello"';
  const expected = `${prefix}42))\n${prefix}"hello"))`;
  assert.equal(prepareReplSource(source), expected);
});

test("leaves malformed input for Glojure to diagnose", () => {
  const source = "(def x 1";
  assert.equal(prepareReplSource(source), source);
});

test("leaves comment-only input unchanged", () => {
  const source = ";; nothing to evaluate";
  assert.equal(prepareReplSource(source), source);
});
