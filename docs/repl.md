---
title: Browser REPL
description:
  An interactive Clojure REPL running entirely in your browser via
  WebAssembly. Nothing to install.
hide:
- navigation
- toc
---

<style>
body:has(#repl-container) .md-tabs {
  display: none;
}

#repl-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1a1a2e;
  border: 2px solid var(--cc-border);
  border-bottom: none;
  border-radius: 8px 8px 0 0;
  padding: 0.25rem 0.5rem;
}

#repl-toolbar:has(+ #repl-container:focus-within) {
  border-color: var(--cc-accent);
  box-shadow: 0 -2px 8px var(--cc-glow);
}

.repl-buttons {
  display: flex;
  gap: 0.5rem;
}

.repl-btn {
  background: transparent;
  border: 1px solid #444;
  border-radius: 4px;
  color: #aaa;
  font-size: 0.85rem;
  padding: 0.15rem 0.35rem;
  cursor: pointer;
  line-height: 1;
}

.repl-btn:hover {
  color: #e0e0e0;
  border-color: #666;
}

#repl-container {
  background: #1a1a2e;
  color: #e0e0e0;
  border: 2px solid var(--cc-border);
  border-radius: 0 0 8px 8px;
  padding: 1rem;
  font-family: 'Roboto Mono', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  height: calc(100vh - 210px);
  min-height: 370px;
  overflow-y: auto;
  cursor: text;
}

#repl-container:focus-within {
  border-color: var(--cc-accent);
  box-shadow: 0 0 8px var(--cc-glow);
}

#repl-output span {
  white-space: pre-wrap;
  word-wrap: break-word;
}

#repl-input {
  display: inline-block;
  vertical-align: top;
  background: transparent;
  color: #e0e0e0;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  border: none;
  outline: none;
  caret-color: var(--cc-accent);
  min-width: 1ch;
}

#repl-input:empty::before {
  content: '';
}

#repl-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 180px);
  min-height: 400px;
  background: #1a1a2e;
  border: 2px solid var(--cc-border);
  border-radius: 8px;
  color: var(--cc-accent);
  font-family: 'Roboto Mono', monospace;
  font-size: 1rem;
}

#repl-loading .spinner {
  display: inline-block;
  width: 1.2em;
  height: 1.2em;
  border: 2px solid var(--cc-accent);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-right: 0.75rem;
  vertical-align: middle;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.repl-error {
  color: #ff6b6b;
}

.repl-prompt {
  color: var(--cc-accent);
}

.hl-string  { color: #22c55e; }
.hl-keyword { color: #06b6d4; }
.hl-literal { color: #c084fc; }
.hl-special { color: #facc15; font-weight: bold; }
.hl-comment { color: #6b7280; }
.hl-core    { color: #5b8dd9; }
.hl-symbol  { color: #e0e0e0; }
.hl-rb0     { color: #ccc; }
.hl-rb1     { color: #0098e6; }
.hl-rb2     { color: #e16d6d; }
.hl-rb3     { color: #3fa455; }
.hl-rb4     { color: #c968e6; }
.hl-rb5     { color: #999; }
.hl-rb6     { color: #ce7e00; }
.hl-mismatch { color: #fff; background: #c33; }
</style>

<div id="repl-loading">
  <span><span class="spinner"></span>Loading Glojure REPL...</span>
</div>

<div id="repl-toolbar" style="display:none">
  <div class="repl-buttons">
    <button class="repl-btn" data-action="share" title="Copy share URL">&#x21D7;</button>
    <button class="repl-btn" data-action="copy-form" title="Copy current form">&#x29C9;</button>
    <button class="repl-btn" data-action="history-prev" title="History prev (Up)">&uarr;</button>
    <button class="repl-btn" data-action="history-next" title="History next (Down)">&darr;</button>
    <button class="repl-btn" data-action="kill-before" title="Kill before cursor (^U)">&lArr;</button>
    <button class="repl-btn" data-action="kill-after" title="Kill after cursor (^K)">&rArr;</button>
    <button class="repl-btn" data-action="clear" title="Clear screen (^L)">&#x2715;</button>
  </div>
</div>

<div id="repl-container" style="display:none"
     onclick="if (!window.getSelection().toString()) document.getElementById('repl-input').focus()">
  <div id="repl-output">
    <span id="repl-input" contenteditable="true"
          autocomplete="off" spellcheck="false"></span>
  </div>
</div>
