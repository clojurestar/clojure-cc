import {clojureLanguage} from "@nextjournal/lang-clojure";

const RESULT_PREFIX =
  "(clojure.core/binding [clojure.core/*print-length* 100 " +
  "clojure.core/*print-level* 20] (clojure.core/prn ";
const RESULT_SUFFIX = "))";
const IGNORED_TOP_LEVEL = new Set(["Discard", "LineComment"]);
const NON_CALL_HEADS = new Set(["Number", "String"]);

function hasParseError(tree) {
  const cursor = tree.cursor();

  for (;;) {
    if (cursor.type.isError) return true;
    if (cursor.firstChild()) continue;

    while (!cursor.nextSibling()) {
      if (!cursor.parent()) return false;
    }
  }
}

function hasNonCallHead(cursor) {
  if (cursor.name !== "List") return false;

  const head = cursor.node.firstChild?.nextSibling;
  return NON_CALL_HEADS.has(head?.name);
}

export function prepareReplSource(source) {
  const tree = clojureLanguage.parser.parse(source);
  if (hasParseError(tree)) return source;

  const forms = [];
  const cursor = tree.cursor();
  if (cursor.firstChild()) {
    do {
      if (!IGNORED_TOP_LEVEL.has(cursor.name)) {
        forms.push({
          discard: hasNonCallHead(cursor),
          from: cursor.from,
          to: cursor.to,
        });
      }
    } while (cursor.nextSibling());
  }

  let prepared = source;
  for (const form of forms.reverse()) {
    const prefix = form.discard ? "#_" : RESULT_PREFIX;
    const suffix = form.discard ? "" : RESULT_SUFFIX;
    prepared =
      prepared.slice(0, form.from) +
      prefix +
      prepared.slice(form.from, form.to) +
      suffix +
      prepared.slice(form.to);
  }
  return prepared;
}
