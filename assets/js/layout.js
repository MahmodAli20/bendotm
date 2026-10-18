/* =============================================================================
   Ben.M — shared chrome                                       assets/js/layout.js
   -----------------------------------------------------------------------------
   Classic script, runs synchronously at the end of <body> (after brand.js,
   i18n.js, data.js; before main.js). It injects the chrome around <main>:

     before <main>  skip link · header · menu overlay · search overlay
     after  <main>  footer (omit with <body data-footer="none">)
     end of <body>  drawer · toast region · curtain · grain ·
                    preloader (only when <html class="is-preloading">)

   Strings are rendered in the current language straight away (no flash) and
   carry data-i18n keys so main.js can switch language later. Behaviour lives
   in main.js; this file only builds markup. It also defines the inline SVG
   icon set (window.BENM_ICONS) used by BENM.icon().

   <body data-base="../"> prefixes every internal link and asset path — used by
   test pages in sub-folders (_lab/); root pages need nothing.
   ========================================================================== */
(function (w, d) {
  'use strict';

  /* ---------------------------------------------------------------------------
     1. Icon set — 24×24, stroked with currentColor (1.25px hairline via CSS)
     ------------------------------------------------------------------------ */
  var HEART = 'M12 19.6c-4.6-3-7.6-6-7.6-9.4A4.1 4.1 0 0 1 8.5 6c1.5 0 2.8.7 3.5 1.9.7-1.2 2-1.9 3.5-1.9a4.1 4.1 0 0 1 4.1 4.2c0 3.4-3 6.4-7.6 9.4z';
  var ICONS = {
    'bag': '<path d="M5.4 8.6h13.2l-.95 11.1a1 1 0 0 1-1 .9H7.35a1 1 0 0 1-1-.9z"/><path d="M9 8.6V7a3 3 0 0 1 6 0v1.6"/>',
    'heart': '<path d="' + HEART + '"/>',
    'heart-fill': '<path class="is-fill" d="' + HEART + '"/><path d="' + HEART + '"/>',
    'search': '<circle cx="10.8" cy="10.8" r="6.3"/><path d="M15.4 15.4 20 20"/>',
    'menu': '<path d="M3.5 9h17M3.5 15h17"/>',
    'close': '<path d="m6 6 12 12M18 6 6 18"/>',
    'arrow': '<path d="M3.5 12h17M14.5 6l6 6-6 6"/>',
    'arrow-up-right': '<path d="M7 17 17 7M8.5 7H17v8.5"/>',
    'plus': '<path d="M12 5v14M5 12h14"/>',
    'minus': '<path d="M5 12h14"/>',
    'chevron': '<path d="m9.5 6 6 6-6 6"/>',
    'check': '<path d="m5 12.5 4.3 4.3L19 7.2"/>',
    'whatsapp': '<path d="m4.2 19.8 1.2-3.9A8.1 8.1 0 1 1 8.4 19z"/><path d="M9.3 8.3c.3-.3.7-.3.9-.1l.9 1.9c.1.3 0 .5-.2.7l-.6.6c.6 1.3 1.6 2.3 2.9 2.9l.6-.6c.2-.2.5-.3.7-.2l1.9.9c.3.1.3.6 0 .9l-.7.8c-.4.4-1 .6-1.6.4-2.4-.7-4.3-2.6-5-5-.2-.6 0-1.2.4-1.6z"/>',
    'instagram': '<rect x="4" y="4" width="16" height="16" rx="4.6"/><circle cx="12" cy="12" r="3.7"/><circle class="is-fill" cx="16.9" cy="7.1" r=".95"/>',
    'facebook': '<path d="M15 4.5h-2a3.5 3.5 0 0 0-3.5 3.5v12M7.3 11.2h7.2"/>',
    'tiktok': '<path d="M13.5 4v10.6a3.4 3.4 0 1 1-3.4-3.4"/><path d="M13.5 4a4.6 4.6 0 0 0 4.6 4.3"/>',
    'phone': '<path d="M7 4h2.6l1.5 3.9-1.9 1.2a10.4 10.4 0 0 0 5.7 5.7l1.2-1.9 3.9 1.5V17a2 2 0 0 1-2.1 2A15.1 15.1 0 0 1 5 6.1 2 2 0 0 1 7 4z"/>',
    'mail': '<rect x="3.5" y="6" width="17" height="12.5" rx=".6"/><path d="m4 6.8 8 6.2 8-6.2"/>',
    'pin': '<path d="M12 20.5s-6.2-5.6-6.2-10.6a6.2 6.2 0 1 1 12.4 0c0 5-6.2 10.6-6.2 10.6z"/><circle cx="12" cy="9.9" r="2.2"/>',
    'truck': '<path d="M3 6.5h11v9.4H3zM14 9.6h3.8l3.2 3.3v3H14"/><circle cx="7" cy="17.4" r="1.7"/><circle cx="17.2" cy="17.4" r="1.7"/>',
    'return': '<path d="M9 6.5 4.5 11 9 15.5"/><path d="M4.5 11h10a4.5 4.5 0 0 1 0 9H12"/>',
    'gift': '<rect x="4" y="10" width="16" height="10" rx=".6"/><path d="M3 7h18v3H3zM12 7v13"/><path d="M12 7c-1.2-2.4-4.5-3-4.5-1.2C7.5 7 10 7 12 7zm0 0c1.2-2.4 4.5-3 4.5-1.2C16.5 7 14 7 12 7z"/>',
    'needle': '<path d="M4.5 19.5 16.4 7.6"/><path d="M15.6 5.2a1.8 1.8 0 0 1 3.2 1.9l-1.4 1.3-1.9-1.9z"/><path d="M18.4 8c1.5 2.5.2 5-2.5 6.1s-6 2-6.3 5.4"/>',
    'sparkle': '<path d="m12 3.5 1.7 6.8 6.8 1.7-6.8 1.7-1.7 6.8-1.7-6.8L3.5 12l6.8-1.7z"/>',
    'globe': '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.4 2.3 3.6 5.2 3.6 8.5s-1.2 6.2-3.6 8.5c-2.4-2.3-3.6-5.2-3.6-8.5S9.6 5.8 12 3.5z"/>',
    'zoom': '<circle cx="10.8" cy="10.8" r="6.3"/><path d="M15.4 15.4 20 20M10.8 8.3v5M8.3 10.8h5"/>',
    'clock': '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    'calendar': '<rect x="4" y="5.5" width="16" height="14.5" rx=".6"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/>',
    'ruler': '<path d="m3.5 15.5 12-12 5 5-12 12z"/><path d="m7 12 1.6 1.6M9.5 9.5l2.3 2.3M12 7l1.6 1.6M14.5 4.5l2.3 2.3"/>'
  };
  w.BENM_ICONS = ICONS;

  function icon(name, cls, label) {
    var body = ICONS[name];
    if (!body) return '';
    return '<svg class="c-icon c-icon--' + name + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24"' +
      (label ? ' role="img" aria-label="' + esc(label) + '"' : ' aria-hidden="true" focusable="false"') + '>' + body + '</svg>';
  }

  /* ---------------------------------------------------------------------------
     2. Helpers — language, strings, paths
     ------------------------------------------------------------------------ */
  var html = d.documentElement;
  var body = d.body;
  var lang = html.getAttribute('lang') === 'ckb' ? 'ckb' : 'en';
  var I18N = w.BENM_I18N || { en: {}, ckb: {} };
  var BASE = (body && body.getAttribute('data-base')) || '';
  var BRAND = w.BENM_BRAND;
  var CONFIG = w.BENM_CONFIG || {};
  var CATS = w.BENM_CATEGORIES || [];

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function digits(s) {
    return lang === 'ckb' ? String(s).replace(/[0-9]/g, function (c) { return '٠١٢٣٤٥٦٧٨٩'.charAt(+c); }) : String(s);
  }
  function raw(key, vars) {
    var dict = I18N[lang] || {};
    var s = Object.prototype.hasOwnProperty.call(dict, key) ? dict[key] : (I18N.en || {})[key];
    if (s == null) s = key;
    if (vars) s = s.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] == null ? m : (typeof vars[k] === 'number' ? digits(vars[k]) : vars[k]); });
    return s;
  }
  function t(key, vars) { return esc(raw(key, vars)); }
  function loc(obj) { return obj ? (obj[lang] || obj.en || '') : ''; }
  function url(path) { return /^(https?:|data:)/.test(path || '') ? path : BASE + (path || ''); }
  function attrs(key) { return ' data-i18n="' + key + '"'; }
  function logo(name, opts) { return BRAND ? BRAND.svg(name, opts || {}) : '<span class="u-visually-hidden">Ben.M</span>'; }
  function waLink(text) {
    var n = String(CONFIG.whatsapp || '').replace(/\D/g, '');
    return 'https://wa.me/' + n + (text ? '?text=' + encodeURIComponent(text) : '');
  }

  // 105° foil gradient for an SVG box (same geometry as brand.js)
  function foilGradient(id, b) {
    var stops = (BRAND && BRAND.foil) || [[0, '#7E5E2B'], [0.4, '#F3E2B3'], [1, '#8C6A34']];
    var a = 105 * Math.PI / 180, dx = Math.sin(a), dy = -Math.cos(a);
    var half = (Math.abs(b[2] * dx) + Math.abs(b[3] * dy)) / 2;
    var cx = b[0] + b[2] / 2, cy = b[1] + b[3] / 2;
    var r = function (n) { return Math.round(n * 10) / 10; };
    return '<linearGradient id="' + id + '" gradientUnits="userSpaceOnUse" x1="' + r(cx - dx * half) + '" y1="' + r(cy - dy * half) +
      '" x2="' + r(cx + dx * half) + '" y2="' + r(cy + dy * half) + '">' +
      stops.map(function (s) { return '<stop offset="' + s[0] + '" stop-color="' + s[1] + '"/>'; }).join('') + '</linearGradient>';
  }

  function switches(cls) {
    return '' +
      '<div class="c-switch ' + (cls || '') + '" role="group" aria-label="' + t('a11y.language') + '" data-i18n-attr="aria-label:a11y.language">' +
        '<button class="c-switch__btn" type="button" data-set-lang="en" lang="en" aria-pressed="' + (lang === 'en') + '">EN</button>' +
        '<span class="c-switch__sep" aria-hidden="true"></span>' +
        '<button class="c-switch__btn" type="button" data-set-lang="ckb" lang="ckb" aria-pressed="' + (lang === 'ckb') + '">کوردی</button>' +
      '</div>';
  }
  function currencySwitch(cls) {
    return '' +
      '<div class="c-switch ' + (cls || '') + '" role="group" aria-label="' + t('a11y.currency') + '" data-i18n-attr="aria-label:a11y.currency">' +
        '<button class="c-switch__btn" type="button" data-set-currency="USD" aria-pressed="true"' + attrs('currency.usd') + '>' + t('currency.usd') + '</button>' +
        '<span class="c-switch__sep" aria-hidden="true"></span>' +
        '<button class="c-switch__btn" type="button" data-set-currency="IQD" aria-pressed="false"' + attrs('currency.iqd') + '>' + t('currency.iqd') + '</button>' +
      '</div>';
  }
  function socialLinks(cls) {
    var s = CONFIG.social || {};
    var nt = ' target="_blank" rel="noopener"';
    return '' +
      (s.instagram ? '<a class="' + cls + '" href="' + esc(s.instagram) + '"' + nt + ' aria-label="' + t('nav.instagram') + '" data-i18n-attr="aria-label:nav.instagram">' + icon('instagram') + '</a>' : '') +
      (s.facebook ? '<a class="' + cls + '" href="' + esc(s.facebook) + '"' + nt + ' aria-label="' + t('nav.facebook') + '" data-i18n-attr="aria-label:nav.facebook">' + icon('facebook') + '</a>' : '') +
      (s.tiktok ? '<a class="' + cls + '" href="' + esc(s.tiktok) + '"' + nt + ' aria-label="' + t('nav.tiktok') + '" data-i18n-attr="aria-label:nav.tiktok">' + icon('tiktok') + '</a>' : '') +
      '<a class="' + cls + '" href="' + esc(waLink()) + '"' + nt + ' aria-label="' + t('nav.whatsapp') + '" data-i18n-attr="aria-label:nav.whatsapp">' + icon('whatsapp') + '</a>';
  }

  /* ---------------------------------------------------------------------------
     3. Header
     ------------------------------------------------------------------------ */
  var theme = body.getAttribute('data-header') === 'light' ? 'light' : 'dark';
  var headerHTML = '' +
    '<a class="c-skip" href="#main"' + attrs('a11y.skip') + '>' + t('a11y.skip') + '</a>' +
    '<header class="c-header" id="site-header" data-theme="' + theme + '">' +
      '<div class="c-header__bg" aria-hidden="true"></div>' +
      '<div class="c-header__bar u-container">' +
        '<div class="c-header__group c-header__group--start">' +
          '<button class="c-hbtn" type="button" id="site-menu-toggle" data-menu-toggle aria-controls="site-menu" aria-expanded="false" aria-label="' + t('a11y.openMenu') + '">' +
            '<span class="c-burger" aria-hidden="true"><i></i><i></i></span>' +
            '<span class="c-hbtn__label" aria-hidden="true"><span data-menu-label' + attrs('header.menu') + '>' + t('header.menu') + '</span></span>' +
          '</button>' +
          '<button class="c-hbtn" type="button" id="site-search-toggle" data-search-toggle aria-controls="site-search" aria-expanded="false" aria-label="' + t('header.search') + '" data-i18n-attr="aria-label:header.search">' +
            icon('search') +
            '<span class="c-hbtn__label" aria-hidden="true"><span' + attrs('header.search') + '>' + t('header.search') + '</span></span>' +
          '</button>' +
        '</div>' +
        '<a class="c-header__logo" href="' + url('index.html') + '" aria-label="' + t('brand.home') + '" data-i18n-attr="aria-label:brand.home">' +
          logo('wordmark', { className: 'is-full', decorative: true }) +
          logo('wordmark', { className: 'is-compact', hideReg: true, decorative: true }) +
        '</a>' +
        '<div class="c-header__group c-header__group--end">' +
          switches('c-header__lang') +
          '<button class="c-hbtn c-hbtn--icon" type="button" data-open-drawer="saved" aria-controls="site-drawer" aria-label="' + t('header.savedCount', { n: 0 }) + '">' +
            icon('heart') + '<span class="c-count is-empty" data-count="wishlist" aria-hidden="true">' + digits(0) + '</span>' +
          '</button>' +
          '<button class="c-hbtn c-hbtn--icon" type="button" data-open-drawer="bag" aria-controls="site-drawer" aria-label="' + t('header.bagCount', { n: 0 }) + '">' +
            icon('bag') + '<span class="c-count is-empty" data-count="cart" aria-hidden="true">' + digits(0) + '</span>' +
          '</button>' +
        '</div>' +
      '</div>' +
    '</header>';

  /* ---------------------------------------------------------------------------
     4. Menu overlay — collections (with category previews) + the House
     ------------------------------------------------------------------------ */
  /* Collections come from the data (editable in the admin): main categories (Men, Women) with their
     sub-categories. Their texts are registered as strings ("cat.<id>.name") so data-i18n switches language. */
  var catMap = {};
  var PRODUCTS = w.BENM_PRODUCTS || [];
  function registerCats() {
    catMap = {};
    CATS.forEach(function (c) {
      catMap[c.id] = c;
      ['name', 'tagline', 'intro'].forEach(function (f) {
        if (!c[f]) return;
        (I18N.en = I18N.en || {})['cat.' + c.id + '.' + f] = c[f].en || '';
        (I18N.ckb = I18N.ckb || {})['cat.' + c.id + '.' + f] = c[f].ckb || c[f].en || '';
      });
    });
  }
  registerCats();
  function topOf(id) { var c = catMap[id]; return c && c.parent ? catMap[c.parent] || c : c; }
  function catCount(id) {
    return PRODUCTS.filter(function (p) { var top = topOf(p.category); return p.category === id || (top && top.id === id); }).length;
  }
  function mainCats() {   // the ones holding pieces (all of them while the catalogue is empty)
    var all = CATS.filter(function (c) { return !c.parent; });
    var full = all.filter(function (c) { return catCount(c.id) > 0; });
    return full.length ? full : all;
  }
  function subCats(id) { return CATS.filter(function (c) { return c.parent === id && catCount(c.id) > 0; }); }   // empty ones stay hidden
  function catItems() {
    return mainCats().map(function (c) { return { key: 'cat.' + c.id + '.name', href: 'shop.html?cat=' + encodeURIComponent(c.id), cat: c.id }; });
  }
  var MENU = catItems().concat([
    { key: 'nav.maison', href: 'maison.html', img: 'assets/img/craft/stitching.jpg', cap: 'menu.maison.caption' },
    { key: 'nav.atelier', href: 'atelier.html', img: 'assets/img/editorial/atelier.jpg', cap: 'menu.atelier.caption' },
    { key: 'nav.boutiques', href: 'boutiques.html', img: 'assets/img/stores/erbil.jpg', cap: 'menu.boutiques.caption' }
  ]);
  var NCATS = MENU.filter(function (m) { return m.cat; }).length;
  function menuLists() {
    return {
      cats: MENU.slice(0, NCATS).map(menuLink).join(''),
      house: MENU.slice(NCATS).map(function (m, i) { return menuLink(m, i + NCATS); }).join('')
    };
  }
  function menuLink(item, i) {
    var n = item.cat ? catCount(item.cat) : 0;
    var subs = item.cat ? subCats(item.cat) : [];
    return '<li class="c-menu__item"><a class="c-menu__link" href="' + url(item.href) + '" data-menu-index="' + i + '">' +
      '<span class="c-menu__num" aria-hidden="true">' + (i < 9 ? '0' : '') + (i + 1) + '</span>' +
      '<span class="c-menu__mask"><span class="c-menu__label"' + attrs(item.key) + '>' + t(item.key) + '</span></span>' +
      (n ? '<sup class="c-menu__count" aria-hidden="true" data-num="' + (n < 10 ? '0' : '') + n + '">' + digits((n < 10 ? '0' : '') + n) + '</sup>' : '') +
      '<span class="c-menu__arrow" aria-hidden="true">' + icon('arrow') + '</span>' +
    '</a>' +
    (subs.length ? '<ul class="c-menu__subs" role="list">' + subs.map(function (s) {
      return '<li><a class="c-menu__sub" href="' + url('shop.html?cat=' + encodeURIComponent(s.id)) + '" data-menu-index="' + i + '"' +
        attrs('cat.' + s.id + '.name') + '>' + esc(loc(s.name)) + '</a></li>';
    }).join('') + '</ul>' : '') +
    '</li>';
  }
  function catImage(id) {   // its own photo, else the first piece filed under it
    var c = catMap[id];
    if (c && c.image) return c.image;
    for (var i = 0; i < PRODUCTS.length; i++) {
      var p = PRODUCTS[i], top = topOf(p.category);
      if ((p.category === id || (top && top.id === id)) && p.images && p.images[0]) return p.images[0];
    }
    return 'assets/img/editorial/hero-1.jpg';
  }
  function menuImgs() {
    return MENU.map(function (item, i) {
      var src = item.cat ? catImage(item.cat) : item.img;
      return '<img class="c-menu__img' + (i === 0 ? ' is-active' : '') + '" src="' + url(src) + '" alt="" width="1200" height="1600" loading="lazy" decoding="async" data-menu-img="' + i + '">';
    }).join('');
  }
  var lists = menuLists();
  var first = catMap[MENU[0].cat];
  var menuHTML = '' +
    '<div class="c-menu" id="site-menu" role="dialog" aria-modal="true" aria-label="' + t('header.menu') + '" data-i18n-attr="aria-label:header.menu" hidden>' +
      '<div class="c-menu__inner u-container" data-lenis-prevent>' +
        '<nav class="c-menu__nav" aria-label="' + t('a11y.mainNav') + '" data-i18n-attr="aria-label:a11y.mainNav">' +
          '<span class="c-eyebrow c-eyebrow--line c-menu__group-label"' + attrs('menu.collections') + '>' + t('menu.collections') + '</span>' +
          '<ol class="c-menu__list" role="list" data-menu-cats>' + lists.cats + '</ol>' +
          '<span class="c-eyebrow c-eyebrow--line c-menu__group-label"' + attrs('menu.house') + '>' + t('menu.house') + '</span>' +
          '<ul class="c-menu__list c-menu__list--house" role="list" data-menu-house>' + lists.house + '</ul>' +
        '</nav>' +
        '<div class="c-menu__aside" aria-hidden="true">' +
          '<figure class="c-menu__figure">' +
            '<div class="c-menu__media" data-menu-media>' + menuImgs() + '</div>' +
            '<figcaption class="c-menu__caption">' +
              '<span class="c-menu__cap-title" data-menu-cap-title>' + t(MENU[0].key) + '</span>' +
              '<span class="c-menu__cap-text" data-menu-cap-text>' + esc(first ? loc(first.tagline) : '') + '</span>' +
            '</figcaption>' +
          '</figure>' +
        '</div>' +
        '<div class="c-menu__foot">' +
          '<div class="c-menu__secondary">' +
            '<a href="' + url('shop.html?new=1') + '"' + attrs('nav.newArrivals') + '>' + t('nav.newArrivals') + '</a>' +
            '<a href="' + url('shop.html?saved=1') + '"' + attrs('nav.saved') + '>' + t('nav.saved') + '</a>' +
            '<a href="' + url('atelier.html#appointment') + '"' + attrs('nav.appointment') + '>' + t('nav.appointment') + '</a>' +
            '<a href="' + url('boutiques.html#contact') + '"' + attrs('nav.contact') + '>' + t('nav.contact') + '</a>' +
            '<a href="' + url('boutiques.html#faq') + '"' + attrs('nav.faq') + '>' + t('nav.faq') + '</a>' +
          '</div>' +
          '<div class="c-menu__meta">' +
            '<div class="c-menu__switches">' + switches() + currencySwitch() + '</div>' +
            '<div class="c-menu__social" aria-label="' + t('a11y.social') + '" role="group" data-i18n-attr="aria-label:a11y.social">' + socialLinks('c-icon-btn') + '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';

  /* ---------------------------------------------------------------------------
     5. Search overlay
     ------------------------------------------------------------------------ */
  var chips = [1, 2, 3, 4, 5, 6].map(function (n) {
    return '<button class="c-chip" type="button" data-search-suggest' + attrs('search.s' + n) + '>' + t('search.s' + n) + '</button>';
  }).join('');
  var searchHTML = '' +
    '<div class="c-search" id="site-search" role="dialog" aria-modal="true" aria-label="' + t('search.title') + '" data-i18n-attr="aria-label:search.title" hidden>' +
      '<div class="c-search__backdrop" data-search-close></div>' +
      '<div class="c-search__panel theme-light" data-lenis-prevent>' +
        '<div class="u-container">' +
          '<div class="c-search__top">' +
            '<span class="c-eyebrow c-eyebrow--line"' + attrs('search.label') + '>' + t('search.label') + '</span>' +
            '<button class="c-search__close" type="button" data-search-close><span' + attrs('header.close') + '>' + t('header.close') + '</span>' + icon('close') + '</button>' +
          '</div>' +
          '<form class="c-search__form" role="search" action="' + url('shop.html') + '" method="get" data-search-form>' +
            icon('search', 'c-search__icon') +
            '<label class="u-visually-hidden" for="site-search-input"' + attrs('search.label') + '>' + t('search.label') + '</label>' +
            '<input class="c-search__input" id="site-search-input" type="search" name="q" autocomplete="off" spellcheck="false" enterkeyhint="search" placeholder="' + t('search.placeholder') + '" data-i18n-attr="placeholder:search.placeholder">' +
            '<button class="c-icon-btn c-search__submit" type="submit" aria-label="' + t('search.submit') + '" data-i18n-attr="aria-label:search.submit">' + icon('arrow') + '</button>' +
          '</form>' +
          '<div class="c-search__suggest"><span class="c-eyebrow"' + attrs('search.suggestions') + '>' + t('search.suggestions') + '</span>' + chips + '</div>' +
          '<div class="c-search__status" data-search-status aria-live="polite"></div>' +
          '<div class="c-search__results" data-search-results></div>' +
        '</div>' +
      '</div>' +
    '</div>';

  /* ---------------------------------------------------------------------------
     6. Drawer (bag + saved), toasts, curtain, grain
     ------------------------------------------------------------------------ */
  var drawerHTML = '' +
    '<div class="c-drawer" id="site-drawer" role="dialog" aria-modal="true" aria-label="' + t('drawer.label') + '" data-i18n-attr="aria-label:drawer.label" hidden>' +
      '<div class="c-drawer__backdrop" data-drawer-close></div>' +
      '<div class="c-drawer__panel theme-light" tabindex="-1">' +
        '<div class="c-drawer__head">' +
          '<div class="c-tabs" role="tablist">' +
            '<button class="c-tab" type="button" role="tab" id="drawer-tab-bag" aria-controls="drawer-pane-bag" aria-selected="true" data-drawer-tab="bag">' +
              '<span' + attrs('drawer.bag') + '>' + t('drawer.bag') + '</span><span class="c-tab__count" data-count-text="cart">' + digits(0) + '</span></button>' +
            '<button class="c-tab" type="button" role="tab" id="drawer-tab-saved" aria-controls="drawer-pane-saved" aria-selected="false" tabindex="-1" data-drawer-tab="saved">' +
              '<span' + attrs('drawer.saved') + '>' + t('drawer.saved') + '</span><span class="c-tab__count" data-count-text="wishlist">' + digits(0) + '</span></button>' +
          '</div>' +
          '<button class="c-icon-btn c-drawer__close" type="button" data-drawer-close aria-label="' + t('a11y.close') + '" data-i18n-attr="aria-label:a11y.close">' + icon('close') + '</button>' +
        '</div>' +
        '<div class="c-drawer__body" data-lenis-prevent>' +
          '<section class="c-drawer__pane" role="tabpanel" id="drawer-pane-bag" aria-labelledby="drawer-tab-bag" data-drawer-pane="bag"></section>' +
          '<section class="c-drawer__pane" role="tabpanel" id="drawer-pane-saved" aria-labelledby="drawer-tab-saved" data-drawer-pane="saved" hidden></section>' +
        '</div>' +
        '<div class="c-drawer__foot" data-drawer-foot></div>' +
      '</div>' +
    '</div>';

  var miscHTML = '' +
    '<div class="c-toasts" role="status" aria-live="polite" data-toasts></div>' +
    '<div class="c-curtain" aria-hidden="true"><div class="c-curtain__panel"><div class="c-curtain__mark">' +
      logo('monogram', { foil: true, decorative: true }) + '</div></div></div>' +
    '<div class="c-grain" aria-hidden="true"></div>';

  /* ---------------------------------------------------------------------------
     7. Preloader — wordmark glyphs drawn as foil strokes, then filled + sheen
     ------------------------------------------------------------------------ */
  function preloaderHTML() {
    if (!BRAND) return '';
    var m = BRAND.get('wordmark');
    var vb = (m.viewBoxNoReg || m.viewBox);
    var b = vb.split(' ').map(Number);
    var parts = BRAND.parts('wordmark', { hideReg: true, glyphs: true });
    var paths = function (extra) {
      return parts.map(function (p) { return '<path' + extra + ' data-glyph="' + p.glyph + '" d="' + p.d + '"/>'; }).join('');
    };
    var svg = '<svg viewBox="' + vb + '" aria-hidden="true" focusable="false">' +
      '<defs>' + foilGradient('benm-pl-foil', b) +
        '<linearGradient id="benm-pl-sheen" gradientUnits="userSpaceOnUse" x1="-420" y1="40" x2="-120" y2="250">' +
          '<stop offset="0" stop-color="#FFF6DE" stop-opacity="0"/><stop offset=".5" stop-color="#FFF6DE" stop-opacity=".9"/>' +
          '<stop offset="1" stop-color="#FFF6DE" stop-opacity="0"/></linearGradient>' +
        '<clipPath id="benm-pl-clip">' + paths('') + '</clipPath>' +
      '</defs>' +
      '<g class="c-preloader__fill" fill="url(#benm-pl-foil)" opacity="0">' + paths('') + '</g>' +
      '<g class="c-preloader__stroke">' + paths(' pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"') + '</g>' +
      '<rect class="c-preloader__sheen" clip-path="url(#benm-pl-clip)" x="' + b[0] + '" y="' + b[1] + '" width="' + b[2] + '" height="' + b[3] + '" fill="url(#benm-pl-sheen)"/>' +
    '</svg>';
    return '' +
      '<div class="c-preloader" aria-hidden="true">' +
        '<div class="c-preloader__frame"></div>' +
        '<div class="c-preloader__inner">' +
          '<div class="c-preloader__mark">' + svg + '</div>' +
          '<div class="c-preloader__taglines">' +
            '<span class="c-preloader__tag c-preloader__tag--en">' + logo('taglineEn', { decorative: true }) + '</span>' +
            '<span class="c-diamond" aria-hidden="true"></span>' +
            '<span class="c-preloader__tag c-preloader__tag--ku">' + logo('taglineKu', { decorative: true }) + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="c-preloader__foot">' +
          '<span class="c-preloader__line"><i></i></span>' +
          '<span class="c-preloader__count" lang="' + lang + '">' + digits('000') + '</span>' +
        '</div>' +
      '</div>';
  }

  /* ---------------------------------------------------------------------------
     8. Footer
     ------------------------------------------------------------------------ */
  function fLink(href, key, extra) {
    return '<li><a class="c-hover-line" href="' + href + '"' + (extra || '') + attrs(key) + '>' + t(key) + '</a></li>';
  }
  function fContact(href, iconName, text, label) {
    return '<li><a href="' + esc(href) + '"' + (label ? ' aria-label="' + esc(label) + '"' : '') + '>' + icon(iconName) +
      '<span class="c-hover-line c-footer__contact" dir="ltr">' + esc(text) + '</span></a></li>';
  }
  function footerShop() {
    return mainCats().map(function (c) { return fLink(url('shop.html?cat=' + encodeURIComponent(c.id)), 'cat.' + c.id + '.name'); }).join('') +
      fLink(url('shop.html?new=1'), 'nav.newArrivals') + fLink(url('shop.html?saved=1'), 'nav.saved');
  }
  var nt = ' target="_blank" rel="noopener"';
  var social = CONFIG.social || {};
  var year = new Date().getFullYear();
  var footerHTML = '' +
    '<footer class="c-footer theme-night" id="site-footer">' +
      '<div class="u-container">' +
        '<div class="c-footer__top">' +
          '<div class="c-footer__intro">' +
            '<p class="c-eyebrow c-eyebrow--line"' + attrs('footer.newsletter.eyebrow') + '>' + t('footer.newsletter.eyebrow') + '</p>' +
            '<h2 class="c-footer__title" data-i18n-html="footer.newsletter.title">' + raw('footer.newsletter.title') + '</h2>' +
            '<p' + attrs('footer.newsletter.text') + '>' + t('footer.newsletter.text') + '</p>' +
          '</div>' +
          '<div class="c-footer__form">' +
            '<form class="c-inline-form" data-newsletter novalidate>' +
              '<div class="c-field">' +
                '<input class="c-field__input" id="footer-email" name="email" type="email" autocomplete="email" inputmode="email" required placeholder=" ">' +
                '<label class="c-field__label" for="footer-email"' + attrs('form.email') + '>' + t('form.email') + '</label>' +
                '<span class="c-field__line" aria-hidden="true"></span>' +
                '<p class="c-field__msg" aria-live="polite"></p>' +
              '</div>' +
              '<button class="c-inline-form__submit" type="submit" aria-label="' + t('form.subscribe') + '" data-i18n-attr="aria-label:form.subscribe">' + icon('arrow') + '</button>' +
            '</form>' +
          '</div>' +
        '</div>' +
        '<nav class="c-footer__cols" aria-label="' + t('a11y.footerNav') + '" data-i18n-attr="aria-label:a11y.footerNav">' +
          '<div class="c-footer__col"><h2 class="c-eyebrow c-footer__col-title"' + attrs('footer.col.shop') + '>' + t('footer.col.shop') + '</h2><ul class="c-footer__list" role="list" data-footer-shop>' +
            footerShop() +
          '</ul></div>' +
          '<div class="c-footer__col"><h2 class="c-eyebrow c-footer__col-title"' + attrs('footer.col.maison') + '>' + t('footer.col.maison') + '</h2><ul class="c-footer__list" role="list">' +
            fLink(url('maison.html'), 'nav.story') + fLink(url('maison.html#craft'), 'nav.craft') +
            fLink(url('maison.html#materials'), 'nav.materials') + fLink(url('maison.html#care'), 'nav.care') +
            fLink(url('atelier.html'), 'nav.atelier') + fLink(url('atelier.html#configurator'), 'nav.personalisation') +
          '</ul></div>' +
          '<div class="c-footer__col c-footer__col--services"><h2 class="c-eyebrow c-footer__col-title"' + attrs('footer.col.services') + '>' + t('footer.col.services') + '</h2><ul class="c-footer__list" role="list">' +
            fLink(url('boutiques.html'), 'nav.boutiques') + fLink(url('atelier.html#appointment'), 'nav.appointment') +
            fLink(url('boutiques.html#contact'), 'nav.contact') + fLink(url('boutiques.html#faq'), 'nav.shipping') +
            (CONFIG.phone ? fContact('tel:' + String(CONFIG.phone).replace(/[^\d+]/g, ''), 'phone', CONFIG.phone) : '') +
            (CONFIG.email ? fContact('mailto:' + CONFIG.email, 'mail', CONFIG.email) : '') +
          '</ul></div>' +
          '<div class="c-footer__col"><h2 class="c-eyebrow c-footer__col-title"' + attrs('footer.col.follow') + '>' + t('footer.col.follow') + '</h2><ul class="c-footer__list" role="list">' +
            (social.instagram ? '<li><a href="' + esc(social.instagram) + '"' + nt + '>' + icon('instagram') + '<span class="c-hover-line"' + attrs('nav.instagram') + '>' + t('nav.instagram') + '</span></a></li>' : '') +
            (social.facebook ? '<li><a href="' + esc(social.facebook) + '"' + nt + '>' + icon('facebook') + '<span class="c-hover-line"' + attrs('nav.facebook') + '>' + t('nav.facebook') + '</span></a></li>' : '') +
            (social.tiktok ? '<li><a href="' + esc(social.tiktok) + '"' + nt + '>' + icon('tiktok') + '<span class="c-hover-line"' + attrs('nav.tiktok') + '>' + t('nav.tiktok') + '</span></a></li>' : '') +
            '<li><a href="' + esc(waLink()) + '"' + nt + ' data-whatsapp>' + icon('whatsapp') + '<span class="c-hover-line"' + attrs('nav.whatsapp') + '>' + t('nav.whatsapp') + '</span></a></li>' +
          '</ul></div>' +
        '</nav>' +
        '<div class="c-footer__mark" aria-hidden="true">' + logo('wordmark', { hideReg: true, glyphs: true, decorative: true }) + '</div>' +
        '<div class="c-footer__bottom">' +
          '<span data-i18n="footer.rights" data-i18n-vars=\'{"year":' + year + '}\'>' + t('footer.rights', { year: year }) + '</span>' +
          '<span class="c-footer__tagline"><span lang="en">Genuine leather</span><span class="c-diamond" aria-hidden="true"></span><span lang="ckb">چەرمی ڕەسەن</span></span>' +
          '<div class="c-footer__switches">' + switches() + currencySwitch() + '</div>' +
          '<a class="c-footer__top-link" href="#main" data-scroll-top><span' + attrs('footer.toTop') + '>' + t('footer.toTop') + '</span>' + icon('arrow') + '</a>' +
        '</div>' +
      '</div>' +
    '</footer>';

  /* ---------------------------------------------------------------------------
     9. Inject
     ------------------------------------------------------------------------ */
  var main = d.getElementById('main') || d.querySelector('main');
  if (main) {
    main.insertAdjacentHTML('beforebegin', headerHTML + menuHTML + searchHTML);
    if (body.getAttribute('data-footer') !== 'none') main.insertAdjacentHTML('afterend', footerHTML);
  } else {
    body.insertAdjacentHTML('afterbegin', headerHTML + menuHTML + searchHTML);
  }
  body.insertAdjacentHTML('beforeend', drawerHTML + miscHTML + (html.classList.contains('is-preloading') ? preloaderHTML() : ''));

  /* The live catalogue (api.js) can land with other categories than the ones the chrome was built with
     (the saved copy is one visit old): main.js calls refresh() once it is in, before the menu is wired. */
  var built = lists.cats + menuImgs() + footerShop();
  function refresh() {
    registerCats();
    MENU.splice.apply(MENU, [0, NCATS].concat(catItems()));
    NCATS = MENU.filter(function (m) { return m.cat; }).length;
    lists = menuLists();
    var now = lists.cats + menuImgs() + footerShop();
    if (now === built) return;
    built = now;
    var root = d.getElementById('site-menu');
    var set = function (sel, html, scope) { var el = (scope || d).querySelector(sel); if (el) el.innerHTML = html; };
    if (root) {
      set('[data-menu-cats]', lists.cats, root);
      set('[data-menu-house]', lists.house, root);
      set('[data-menu-media]', menuImgs(), root);
      var top = catMap[MENU[0].cat];
      var cap = root.querySelector('[data-menu-cap-title]'), capText = root.querySelector('[data-menu-cap-text]');
      if (cap) cap.textContent = raw(MENU[0].key);
      if (capText) capText.textContent = top ? loc(top.tagline) : '';
    }
    set('[data-footer-shop]', footerShop());
  }

  w.BENM_LAYOUT = { icon: icon, base: BASE, url: url, menu: MENU, refresh: refresh };
})(window, document);
