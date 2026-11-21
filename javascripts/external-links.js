// Open external links in a new tab.
(function () {
  function apply() {
    var origin = window.location.origin;
    var links = document.querySelectorAll('a[href]');
    links.forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;
      if (!/^https?:\/\//i.test(href)) return;
      if (href.indexOf(origin) === 0) return;
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    });
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
