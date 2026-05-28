(function () {
  var OUTER = [
    ['#E74C3C', 386.6, 150],
    ['#F39C12', 473.2, 300],
    ['#F1C40F', 386.6, 450],
    ['#27AE60', 213.4, 450],
    ['#3498DB', 126.8, 300],
    ['#9B59B6', 213.4, 150]
  ];
  var HEX = '0,-100 86.6,-50 86.6,50 0,100 -86.6,50 -86.6,-50';
  var HOME_URL = '/';
  var FALLBACK_CENTER = {
    fext: 'clj', name: 'Clojure', site: 'https://clojure.org/'
  };

  function data() { return window.CC_LOGO_DIALECTS || []; }

  function label(d) { return '.' + d.fext; }

  function findCenter(all) {
    for (var i = 0; i < all.length; i++) {
      if (all[i].fext === 'clj') return all[i];
    }
    return FALLBACK_CENTER;
  }

  function pickN(pool, n) {
    var copy = pool.slice(), out = [];
    while (out.length < n && copy.length) {
      out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
    }
    return out;
  }

  function fontSize(text) {
    var len = text.length;
    if (len <= 5) return 44;
    if (len === 6) return 36;
    if (len === 7) return 30;
    return 26;
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function outerHex(x, y, fill, d) {
    var text = label(d);
    var fs = fontSize(text);
    return '<g transform="translate(' + x + ' ' + y + ')">' +
      '<a href="' + esc(d.site) + '" target="_blank" rel="noopener noreferrer">' +
      '<title>' + esc(d.name) + '</title>' +
      '<polygon points="' + HEX + '" fill="' + fill +
      '" stroke="#ffffff" stroke-width="3"/>' +
      '<text font-size="' + fs + '">' + esc(text) + '</text>' +
      '</a></g>';
  }

  function centerHex(d) {
    var text = label(d);
    var fs = fontSize(text);
    return '<g transform="translate(300 300)">' +
      '<a href="' + esc(HOME_URL) + '" data-cc-center>' +
      '<title>Clojure.cc</title>' +
      '<polygon points="' + HEX + '" fill="#3949AB"' +
      ' stroke="#ffffff" stroke-width="3"/>' +
      '<text font-size="' + fs + '">' + esc(text) + '</text>' +
      '</a></g>';
  }

  function markup(className) {
    var all = data();
    var center = findCenter(all);
    var pool = all.filter(function (d) { return d.fext !== 'clj'; });
    var picks = pickN(pool, 6);
    while (picks.length < 6) picks.push(center);

    var classAttr = className ? ' class="' + esc(className) + '"' : '';
    var s =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600"' +
      ' data-cc-logo aria-label="Clojure.cc"' + classAttr + '>' +
      '<g font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"' +
      ' font-weight="700" font-size="44" fill="#ffffff"' +
      ' text-anchor="middle" dominant-baseline="central">';
    s += centerHex(center);
    for (var i = 0; i < OUTER.length; i++) {
      s += outerHex(OUTER[i][1], OUTER[i][2], OUTER[i][0], picks[i]);
    }
    return s + '</g></svg>';
  }

  function shuffle() {
    var nodes = document.querySelectorAll('[data-cc-logo]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var wrap = document.createElement('span');
      wrap.innerHTML = markup(el.getAttribute('class') || '');
      el.parentNode.replaceChild(wrap.firstChild, el);
    }
  }

  function isHomePage() {
    var p = window.location.pathname;
    return p === '/' || p === '' || /\/index\.html?$/.test(p);
  }

  function findCenterAnchor(target) {
    var t = target;
    while (t && t !== document.body) {
      if (t.tagName && String(t.tagName).toLowerCase() === 'a' &&
          t.hasAttribute && t.hasAttribute('data-cc-center')) {
        return t;
      }
      t = t.parentNode;
    }
    return null;
  }

  document.addEventListener('click', function (e) {
    if (!findCenterAnchor(e.target)) return;
    if (isHomePage()) {
      e.preventDefault();
      e.stopPropagation();
      shuffle();
    }
  }, true);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', shuffle);
  } else {
    shuffle();
  }
  if (typeof document$ !== 'undefined' && document$.subscribe) {
    document$.subscribe(shuffle);
  }
})();
