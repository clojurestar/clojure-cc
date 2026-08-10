// Click-to-sort for dialect tables. State persists in a cookie so the
// table comes back in the same order on the next visit.
(function () {
  var COOKIE = 'dialects-sort-v2';
  // 1-based column index -> { type, default direction }.
  // Columns not listed are not sortable (e.g. Description).
  var COLS = {
    2: { type: 'number', def: 'desc' }, // Stars
    3: { type: 'text',   def: 'asc'  }, // Dialect
    4: { type: 'tags',   def: 'asc'  }, // Clojure relation
    5: { type: 'tags',   def: 'asc'  }, // Author
    6: { type: 'repl',   def: 'asc'  }, // REPL support
    7: { type: 'tags',   def: 'asc'  }, // Other tags
    8: { type: 'text',   def: 'asc'  }, // Host
    9: { type: 'text',   def: 'desc' }  // Release (YYYY-MM-DD sorts lexically)
  };

  function getCookie(name) {
    var m = document.cookie.match(
      new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : null;
  }

  function setCookie(name, value) {
    var yr = 365 * 24 * 60 * 60;
    document.cookie = name + '=' + encodeURIComponent(value) +
      '; path=/; max-age=' + yr + '; SameSite=Lax';
  }

  function tagValue(cell) {
    var names = [];
    cell.querySelectorAll('.badge').forEach(function (b) {
      b.classList.forEach(function (c) {
        if (c.indexOf('badge-') === 0 && c !== 'badge') {
          names.push(c.slice(6).toLowerCase());
        }
      });
    });
    return names.sort().join(' ');
  }

  function replValue(cell) {
    var tags = tagValue(cell).split(' ');
    var repl = tags.indexOf('repl') !== -1;
    var nrepl = tags.indexOf('nrepl') !== -1;
    if (repl && nrepl) return 1;
    if (nrepl) return 2;
    if (repl) return 3;
    return null;
  }

  function cellValue(row, col, type) {
    var cell = row.cells[col - 1];
    if (type === 'tags') return tagValue(cell);
    if (type === 'repl') return replValue(cell);
    var text = (cell.textContent || '').trim();
    if (type === 'number') {
      if (text === '') return null;
      var n = parseFloat(text);
      return isNaN(n) ? null : n;
    }
    return text.toLowerCase().replace(/^[^a-z0-9]+/, '');
  }

  function isEmpty(v) {
    return v === null || v === '';
  }

  function sortTable(table, col, dir) {
    var cfg = COLS[col];
    if (!cfg) return;
    var tbody = table.tBodies[0];
    var rows = Array.prototype.slice.call(tbody.rows);
    var sign = dir === 'desc' ? -1 : 1;
    rows.sort(function (a, b) {
      var av = cellValue(a, col, cfg.type);
      var bv = cellValue(b, col, cfg.type);
      // Empty cells always sink to the bottom, regardless of direction.
      if (isEmpty(av) && isEmpty(bv)) return 0;
      if (isEmpty(av)) return 1;
      if (isEmpty(bv)) return -1;
      if (av < bv) return -1 * sign;
      if (av > bv) return 1 * sign;
      return 0;
    });
    rows.forEach(function (r) { tbody.appendChild(r); });
    refreshRowNumbers(tbody);
    var headers = table.tHead.rows[0].cells;
    for (var i = 0; i < headers.length; i++) {
      headers[i].removeAttribute('aria-sort');
    }
    headers[col - 1].setAttribute(
      'aria-sort', dir === 'desc' ? 'descending' : 'ascending');
  }

  function refreshRowNumbers(tbody) {
    Array.prototype.forEach.call(tbody.rows, function (row, i) {
      var cell = row.cells[0];
      var link = cell && cell.querySelector('a');
      if (link) link.textContent = i + 1;
    });
  }

  function isDialectTable(headers) {
    if (!headers || headers.length !== 10) return false;
    var names = Array.prototype.map.call(headers, function (h) {
      return (h.textContent || '').trim();
    });
    return names[0] === '' &&
      names[1] === '★' &&
      names[2] === 'Dialect' &&
      names[3] === 'C' &&
      names[4] === 'A' &&
      names[5] === 'R' &&
      names[6] === 'Tag' &&
      names[7] === 'Host' &&
      names[8] === 'Release' &&
      names[9] === 'Description';
  }

  function setupTable(table) {
    var headers = table.tHead && table.tHead.rows[0]
      ? table.tHead.rows[0].cells : null;
    if (!isDialectTable(headers) || table.dataset.sortable) return;
    table.dataset.sortable = '1';
    for (var i = 0; i < headers.length; i++) {
      var col = i + 1;
      if (!COLS[col]) continue;
      headers[i].setAttribute('role', 'columnheader');
      (function (th, c) {
        th.addEventListener('click', function () {
          var current = th.getAttribute('aria-sort');
          var dir;
          if (!current) {
            dir = COLS[c].def;
          } else {
            dir = current === 'ascending' ? 'desc' : 'asc';
          }
          sortTable(table, c, dir);
          setCookie(COOKIE, c + ':' + dir);
        });
      })(headers[i], col);
    }
    var saved = getCookie(COOKIE);
    if (saved) {
      var parts = saved.split(':');
      var sCol = parseInt(parts[0], 10);
      var sDir = parts[1];
      if (COLS[sCol] && (sDir === 'asc' || sDir === 'desc')) {
        sortTable(table, sCol, sDir);
      }
    }
    // Hidden affordance: clicking the Description header clears the saved
    // sort order and reloads the page.
    var desc = headers[9];
    if (desc) {
      desc.addEventListener('click', function () {
        document.cookie = COOKIE + '=; path=/; max-age=0; SameSite=Lax';
        location.reload();
      });
    }
  }

  function apply() {
    var tables = document.querySelectorAll('article table:not([class])');
    tables.forEach(setupTable);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
  if (typeof document$ !== 'undefined' && document$.subscribe) {
    document$.subscribe(apply);
  }
})();
