/* =============================================================================
   Ben.M — Page not found                          assets/js/pages/notfound.js
   -----------------------------------------------------------------------------
   1. Strings (EN + Central Kurdish)
   2. Hosted safety — hash-only links stay on this page under <base>
   3. Search — the "Search the collection" row opens the shared overlay
   4. The numerals — pen-drawn foil outlines, a slow sheen, pointer depth
   5. While you are here — a few product cards
   ========================================================================== */
(function (B, w, d) {
  'use strict';
  if (!B) return;

  /* ===========================================================================
     1. Strings
     ======================================================================== */
  B.i18n.add({
    en: {
      'nf.meta.title': 'Page not found — Ben.M',
      'nf.meta.description': 'The page you were looking for could not be found. Return home, explore the collection or visit the boutique.',
      'nf.eyebrow': 'Error 404 · Page not found',
      'nf.title': 'This pair seems to have <em>wandered off.</em>',
      'nf.links.label': 'Find your way',
      'nf.links.shop': 'Shop the collection',
      'nf.links.boutiques': 'Visit the boutique',
      'nf.caption': 'Its partner is still looking for it.',
      'nf.picks.eyebrow': 'While you are here',
      'nf.picks.title': 'Right where <em>we left them.</em>'
    },
    ckb: {
      'nf.meta.title': 'پەڕەکە نەدۆزرایەوە — Ben.M',
      'nf.meta.description': 'ئەو پەڕەیەی بە دوایدا دەگەڕایت نەدۆزرایەوە. بگەڕێوە بۆ پەڕەی سەرەکی، سەیری کۆلێکشنەکە بکە یان سەردانی فرۆشگاکە بکە.',
      'nf.eyebrow': 'هەڵەی ٤٠٤، پەڕەکە نەدۆزرایەوە',          // «،» not «·»: beside ٤٠٤ a dot reads as another ٠
      'nf.title': 'وا دیارە ئەم جووتە <em>ڕێگای ون کردووە.</em>',
      'nf.links.label': 'ڕێگای خۆت بدۆزەرەوە',
      'nf.links.shop': 'سەیری کۆلێکشنەکە بکە',
      'nf.links.boutiques': 'سەردانی فرۆشگاکە بکە',
      'nf.caption': 'جووتەکەی هێشتا بە دوایدا دەگەڕێت.',
      'nf.picks.eyebrow': 'ئێستا کە لێرەیت',
      'nf.picks.title': 'هەر لە <em>شوێنی خۆیانن.</em>'
    }
  });

  var hasGsap = !!w.gsap;
  function $(s, r) { return (r || d).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); }

  /* ===========================================================================
     2. Hosted safety — 404.html adds <base> over http(s); "#main" would then
        point at the site root, so anchor-only links get this page's own path
     ======================================================================== */
  function keepHashLinksHere(root) {
    if (!d.querySelector('base')) return;
    var here = w.location.pathname + w.location.search;
    $$('a[href^="#"]', root).forEach(function (a) { a.setAttribute('href', here + a.getAttribute('href')); });
  }
  keepHashLinksHere(d);                         // the chrome (skip link, menu…) is already injected by layout.js

  /* ===========================================================================
     3. Search
     ======================================================================== */
  d.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('[data-nf-search]');
    if (!btn) return;
    e.preventDefault();
    if (B.searchUI && B.searchUI.open) B.searchUI.open();
  });

  /* ===========================================================================
     4. The numerals
     ======================================================================== */
  // The hidden start state lives in notfound.css (no flash when a page arrives uncovered); the
  // timeline takes over from it and .is-drawn releases the CSS hold.
  var DRAW = 1100;                              // ≥ the outline length of a "4" in its 100×124 box
  function playDigits() {
    var stage = $('[data-nf-stage]');
    if (!stage) return;
    stage.classList.add('is-drawn');
    if (B.reducedMotion || !hasGsap) return;
    var texts = $$('[data-nf-digit] text'), media = $('.nf-zero__media', stage), ring = $('.nf-zero__ring', stage);
    var img = $('[data-nf-img]'), foil = $('[data-nf-foil]');
    var tl = gsap.timeline({ delay: .1 });
    if (media) tl.fromTo(media, { clipPath: 'inset(50% 0% 50% 0% round 50%)' },
      { clipPath: 'inset(0% 0% 0% 0% round 50%)', duration: 1.6, ease: 'power3.inOut', clearProps: 'clipPath' }, 0);
    if (ring) tl.fromTo(ring, { opacity: 0, scale: .9 }, { opacity: 1, scale: 1, duration: 1.8, ease: 'expo.out', clearProps: 'opacity,transform' }, .9);
    if (img) tl.fromTo(img, { scale: 1.3 }, { scale: 1.08, duration: 2.4, ease: 'expo.out' }, .1);
    if (texts.length) tl.fromTo(texts, { strokeDasharray: DRAW, strokeDashoffset: DRAW },
      { strokeDashoffset: 0, duration: 2.6, ease: 'power2.inOut', stagger: .22, clearProps: 'strokeDasharray,strokeDashoffset' }, .25);
    // a slow foil sheen travels across the outlines, then rests
    if (foil) gsap.fromTo(foil, { attr: { gradientTransform: 'translate(-140 0)' } },
      { attr: { gradientTransform: 'translate(140 0)' }, duration: 3.2, ease: 'power1.inOut', repeat: -1, repeatDelay: 2.8, delay: 2.4 });
    initDepth();
  }
  // pointer depth: the shoe drifts inside its window, the numerals answer softly (fine pointers only)
  function initDepth() {
    var stage = $('[data-nf-stage]'), img = $('[data-nf-img]'), digits = $$('[data-nf-digit]');
    if (!stage || !img || !w.matchMedia || !w.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    var ix = gsap.quickTo(img, 'x', { duration: 1.4, ease: 'power3.out' }), iy = gsap.quickTo(img, 'y', { duration: 1.4, ease: 'power3.out' });
    var dx = digits.map(function (n) { return gsap.quickTo(n, 'x', { duration: 1.6, ease: 'power3.out' }); });
    var dy = digits.map(function (n) { return gsap.quickTo(n, 'y', { duration: 1.6, ease: 'power3.out' }); });
    w.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      var nx = e.clientX / w.innerWidth - .5, ny = e.clientY / w.innerHeight - .5;
      ix(nx * -26); iy(ny * -20);
      dx.forEach(function (f, i) { f(nx * (i ? 10 : 14)); });
      dy.forEach(function (f) { f(ny * 8); });
    }, { passive: true });
  }

  /* ===========================================================================
     5. While you are here
     ======================================================================== */
  function renderPicks() {
    var grid = $('[data-nf-picks]');
    if (!grid || !B.products) return;
    var list = B.products(function (p) { return p.featured; });
    if (list.length < 4) list = list.concat(B.products(function (p) { return p.isNew && !p.featured; }));
    var picks = list.slice(0, 4);
    if (!picks.length) { grid.closest('section').hidden = true; return; }
    grid.innerHTML = picks.map(function (p, i) {
      return B.productCard(p, { variant: 'dark', index: i + 1, heading: 'h3', reveal: 'up' });
    }).join('');
  }

  /* ===========================================================================
     Boot
     ======================================================================== */
  B.page(function () {
    $$('[data-nf-icon]').forEach(function (n) { if (!n.firstElementChild) n.innerHTML = B.icon(n.getAttribute('data-nf-icon')); });
    renderPicks();
    keepHashLinksHere(d);
  });
  B.ready(playDigits);
})(window.BENM, window, document);
