(function () {
  "use strict";

  let loading;

  function loadEditor() {
    if (!document.querySelector("[data-clojuredocs-page]")) return;

    if (window.ClojureDocsEditor) {
      window.ClojureDocsEditor.init(document);
      return;
    }

    if (!loading) {
      loading = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "/javascripts/clojuredocs.js";
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    loading.then(() => window.ClojureDocsEditor.init(document));
  }

  if (typeof document$ !== "undefined") {
    document$.subscribe(loadEditor);
  } else {
    document.addEventListener("DOMContentLoaded", loadEditor);
  }
})();
