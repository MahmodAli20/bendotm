/* =============================================================================
   Ben.M — shared behaviour & API                               assets/js/main.js
   -----------------------------------------------------------------------------
   Defines window.BENM synchronously at parse time (page scripts can call
   BENM.i18n.add / BENM.page / BENM.ready at their top level), then boots on
   DOMContentLoaded (BRIEF §6.1):

     1 language + currency → html[lang][dir]      5 page initialisers (BENM.page)
     2 i18n applied to the document               6 declarative scan (BENM.reveal)
     3 Lenis + ScrollTrigger (not reduced motion)  7 preloader / curtain-out →
     4 chrome: header, menu, search, drawer,        html[data-ready="true"] →
       cursor, switches, transitions                BENM.ready callbacks → 'ready'
                                                  8 ScrollTrigger.refresh after
                                                    fonts + images

   Classic script, no modules, no fetch — works from file://.
   Full developer documentation: docs/FOUNDATION.md
   ========================================================================== */
(function (w, d) {
  'use strict';

  /* ===========================================================================
     0. Environment & feature flags
     ======================================================================== */
  var html = d.documentElement;
  html.classList.add('benm-booted');                 // disables the CSS failsafes

  var gsap = w.gsap || null;
  var ScrollTrigger = w.ScrollTrigger || null;
  var SplitText = w.SplitText || null;
  var LenisCtor = typeof w.Lenis === 'function' ? w.Lenis : null;
  var HAS_GSAP = !!(gsap && ScrollTrigger);
  if (HAS_GSAP) {
    try { gsap.registerPlugin(ScrollTrigger); if (SplitText) gsap.registerPlugin(SplitText); } catch (e) { console.error(e); }
  }
  function media(q) { try { return w.matchMedia(q).matches; } catch (e) { return false; } }
  var REDUCED = media('(prefers-reduced-motion: reduce)') || !HAS_GSAP;
  var FINE_POINTER = media('(hover: hover) and (pointer: fine)');
  var TOUCH = media('(hover: none), (pointer: coarse)');
  if (REDUCED) html.classList.add('reduced-motion');
  if (TOUCH) html.classList.add('is-touch');

  var CONFIG = w.BENM_CONFIG || {};
  var PRODUCTS = w.BENM_PRODUCTS || [];
  var CATEGORIES = w.BENM_CATEGORIES || [];
  var I18N = w.BENM_I18N = w.BENM_I18N || {};
  if (!I18N.en) I18N.en = {};
  if (!I18N.ckb) I18N.ckb = {};
  var BASE = (d.body && d.body.getAttribute('data-base')) || '';
  var IQD_RATE = (CONFIG.currency && CONFIG.currency.iqdRate) || 1310;
  var EASE_EXPO = function (x) { return x === 1 ? 1 : 1 - Math.pow(2, -10 * x); };
  var MAX_QTY = 10;

  /* ===========================================================================
     1. Small utilities
     ======================================================================== */
  var hasOwn = function (o, k) { return Object.prototype.hasOwnProperty.call(o, k); };
  function $(sel, root) { return (root || d).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || d).querySelectorAll(sel)); }
  // like $$ but also includes root itself when it matches
  function scan(sel, root) {
    root = root || d;
    var list = $$(sel, root);
    if (root !== d && root.nodeType === 1 && root.matches && root.matches(sel)) list.unshift(root);
    return list;
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
  function debounce(fn, ms) {
    var id;
    return function () {
      var a = arguments, self = this;
      clearTimeout(id);
      id = setTimeout(function () { fn.apply(self, a); }, ms);
    };
  }
  function pad(n, len) { n = String(n); while (n.length < len) n = '0' + n; return n; }
  function url(path) { return /^(https?:|mailto:|tel:|data:|#)/.test(path || '') ? path : BASE + (path || ''); }
  function param(name) {
    try { return new URLSearchParams(w.location.search).get(name); } catch (e) { return null; }
  }
  function tryCall(fn, arg) {
    try { return fn(arg); } catch (e) { console.error(e); return undefined; }
  }
  var uidN = 0;
  function uid(prefix) { return (prefix || 'benm') + '-' + (++uidN); }
  function nextFrame(fn) { w.requestAnimationFrame(function () { w.requestAnimationFrame(fn); }); }
  function focusEl(el) { if (el && el.focus) { try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); } } }

  var store = {
    get: function (k, session) { try { return (session ? w.sessionStorage : w.localStorage).getItem(k); } catch (e) { return null; } },
    set: function (k, v, session) { try { (session ? w.sessionStorage : w.localStorage).setItem(k, v); } catch (e) { /* storage blocked */ } },
    del: function (k, session) { try { (session ? w.sessionStorage : w.localStorage).removeItem(k); } catch (e) { /* storage blocked */ } },
    json: function (k, fallback) {
      try { var v = JSON.parse(store.get(k)); return v == null ? fallback : v; } catch (e) { return fallback; }
    }
  };

  /* ===========================================================================
     2. Event bus — ready, langchange, currencychange, cart, wishlist, …
        Also re-dispatched on document as 'benm:<name>' CustomEvents.
     ======================================================================== */
  var listeners = {};
  function on(name, fn) {
    (listeners[name] = listeners[name] || []).push(fn);
    return function () { off(name, fn); };
  }
  function off(name, fn) {
    var l = listeners[name];
    if (!l) return;
    var i = l.indexOf(fn);
    if (i > -1) l.splice(i, 1);
  }
  function emit(name, detail) {
    (listeners[name] || []).slice().forEach(function (fn) { tryCall(fn, detail); });
    try { d.dispatchEvent(new CustomEvent('benm:' + name, { detail: detail })); } catch (e) { /* old browsers */ }
  }

  /* ===========================================================================
     3. i18n engine — t, loc, num, price, apply, setLang
     ======================================================================== */
  var lang = (store.get('benm:lang') === 'ckb' || html.getAttribute('lang') === 'ckb') ? 'ckb' : 'en';
  var currency = store.get('benm:currency') === 'IQD' ? 'IQD' :
    ((CONFIG.currency && CONFIG.currency.default === 'IQD') ? 'IQD' : 'USD');
  var warned = {};
  var EASTERN = '٠١٢٣٤٥٦٧٨٩';

  function isRTL() { return lang === 'ckb'; }
  function lookup(key, l) {
    var dict = I18N[l];
    return dict && hasOwn(dict, key) ? dict[key] : undefined;
  }
  function warnMissing(key) {
    if (warned[key]) return;
    warned[key] = 1;
    console.warn('[i18n] missing key: ' + key);
  }
  /** Localise digits (Eastern Arabic in ckb). Numbers or strings. */
  function num(n) {
    var s = String(n == null ? '' : n);
    return lang === 'ckb' ? s.replace(/[0-9]/g, function (c) { return EASTERN.charAt(+c); }).replace(/,/g, '٬').replace(/\./g, '٫') : s;
  }
  function interpolate(s, vars) {
    return String(s).replace(/\{(\w+)\}/g, function (m, k) {
      if (!vars || vars[k] == null) return m;
      return typeof vars[k] === 'number' ? num(vars[k]) : vars[k];
    });
  }
  // raw lookup with fallback; null when the key exists in no language
  function translate(key, vars) {
    var one = vars && vars.n === 1;
    var s = one ? lookup(key + '_one', lang) : undefined;
    if (s === undefined) s = lookup(key, lang);
    if (s === undefined) {
      warnMissing(key);
      if (one) s = lookup(key + '_one', 'en');
      if (s === undefined) s = lookup(key, 'en');
    }
    if (s === undefined) return null;
    return vars ? interpolate(s, vars) : s;
  }
  /** BENM.t('key', {name:'…'}) — current language, English fallback, key as last resort. */
  function t(key, vars) {
    var s = translate(key, vars);
    return s == null ? key : s;
  }
  /** {en, ckb} → current language (English fallback). */
  function loc(obj) {
    if (obj == null) return '';
    if (typeof obj !== 'object') return String(obj);
    return obj[lang] || obj.en || '';
  }
  function group(n) {
    return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  /** BENM.price(usd[, currency]) → "$320" · "IQD 419,250" · "٣٢٠ دۆلار" · "٤١٩٬٢٥٠ د.ع" */
  function price(usd, cur) {
    cur = cur || currency;
    var v = Number(usd) || 0;
    if (cur === 'IQD') return t('price.iqd', { amount: num(group(Math.round(v * IQD_RATE / 250) * 250)) });
    var amount = Math.round(v) === v ? group(v) : v.toFixed(2);
    return t('price.usd', { amount: num(amount) });
  }

  function parseVars(el) {
    var raw = el.getAttribute('data-i18n-vars');
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
  }
  /** Apply translations to a subtree (default: the whole document incl. <head>). */
  function applyI18n(root) {
    root = root && root !== d ? root : html;
    scan('[data-i18n]', root).forEach(function (el) {
      var s = translate(el.getAttribute('data-i18n'), parseVars(el));
      if (s != null && el.textContent !== s) el.textContent = s;
    });
    scan('[data-i18n-html]', root).forEach(function (el) {
      var s = translate(el.getAttribute('data-i18n-html'), parseVars(el));
      if (s != null && el.innerHTML !== s) el.innerHTML = s;
    });
    scan('[data-i18n-attr]', root).forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var i = pair.indexOf(':');
        if (i < 1) return;
        var s = translate(pair.slice(i + 1).trim());
        if (s != null) el.setAttribute(pair.slice(0, i).trim(), s);
      });
    });
    refreshPrices(root);
    refreshProducts(root);
  }
  function refreshPrices(root) {
    scan('[data-price]', root || html).forEach(function (el) {
      var v = parseFloat(el.getAttribute('data-price'));
      if (!isNaN(v)) el.textContent = price(v);
    });
    scan('[data-num]', root || html).forEach(function (el) {
      var src = el.getAttribute('data-num') || el.textContent;
      if (!el.hasAttribute('data-num') || !el.getAttribute('data-num')) el.setAttribute('data-num', src);
      el.textContent = num(src);
    });
  }

  function addStrings(dict) {
    if (!dict) return;
    ['en', 'ckb'].forEach(function (l) {
      if (!dict[l]) return;
      for (var k in dict[l]) if (hasOwn(dict[l], k)) I18N[l][k] = dict[l][k];
    });
    if (booted) applyI18n(d);
  }

  function syncSwitches() {
    $$('[data-set-lang]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-set-lang') === lang)); });
    $$('[data-set-currency]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-set-currency') === currency)); });
  }

  /** Switch language: persist, flip lang/dir, re-apply strings, re-split, emit, refresh. */
  function setLang(next) {
    next = next === 'ckb' ? 'ckb' : 'en';
    if (next === lang && html.getAttribute('lang') === next) return;
    lang = next;
    store.set('benm:lang', lang);
    var resume = suspendSplits();
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ckb' ? 'rtl' : 'ltr');
    applyI18n(d);
    syncSwitches();
    tryCall(resume);
    emit('langchange', { lang: lang });
    fadeIn([$('#main'), $('#site-footer')]);
    refresh();
    // Arabic-script fonts load on first use; line breaks change once they arrive
    if (d.fonts && d.fonts.ready) { void html.offsetHeight; d.fonts.ready.then(function () { refresh(); }); }
  }
  function fadeIn(els) {
    els = els.filter(Boolean);
    if (REDUCED || !els.length) return;
    gsap.fromTo(els, { opacity: 0 }, { opacity: 1, duration: .7, ease: 'power2.out', clearProps: 'opacity' });
  }

  /** Switch currency (USD ⇄ IQD): persist, re-render prices, emit. */
  function setCurrency(next) {
    next = next === 'IQD' ? 'IQD' : 'USD';
    if (next === currency) return;
    currency = next;
    store.set('benm:currency', currency);
    refreshPrices(html);
    syncSwitches();
    emit('currencychange', { currency: currency });
  }

  /* ===========================================================================
     4. Catalogue helpers
     ======================================================================== */
  var productIndex = {};
  PRODUCTS.forEach(function (p) { productIndex[p.id] = p; });
  function findProduct(id) { return (id && productIndex[id]) || null; }
  function category(id) {
    for (var i = 0; i < CATEGORIES.length; i++) if (CATEGORIES[i].id === id) return CATEGORIES[i];
    return null;
  }
  function products(filter) { return typeof filter === 'function' ? PRODUCTS.filter(filter) : PRODUCTS.slice(); }
  function colorOf(p, id) {
    var list = (p && p.colors) || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return list[0] || null;
  }
  function isOneSize(p) { return !p.sizes || !p.sizes.length; }
  function productUrl(id) { return url('product.html?id=' + encodeURIComponent(id)); }

  /* ---- Search (both languages, typo-tolerant normalisation) -------------- */
  function norm(s) {
    s = String(s || '').toLowerCase();
    try { s = s.normalize('NFKD'); } catch (e) { /* old engines */ }
    return s.replace(/[\u0300-\u036f]/g, '')
      .replace(/[يى]/g, 'ی').replace(/ك/g, 'ک').replace(/ة/g, 'ە')
      .replace(/[\u064B-\u065F\u0670\u0640\u200C\u200D]/g, '')
      .replace(/[٠-٩]/g, function (c) { return String(EASTERN.indexOf(c)); })
      .replace(/[^0-9a-z\u0600-\u06FF]+/g, ' ')
      .trim();
  }
  function stem(tok) {
    if (/^[a-z]+$/.test(tok) && tok.length > 3 && /s$/.test(tok) && !/ss$/.test(tok)) return tok.replace(/(ies)$/, 'y').replace(/s$/, '');
    if (/[\u0600-\u06FF]/.test(tok) && tok.length > 4) return tok.replace(/(ەکان|کان|ەکە|یەکان)$/, '');
    return tok;
  }
  var ALIASES = {
    men: 'shoe shoes footwear پێڵاو پیاو',
    women: 'shoe shoes footwear heels پێڵاو ئافرەت',
    bags: 'bag bags جانتا',
    accessories: 'small leather goods wallet ئێکسسوار'
  };
  var searchIndex = null;
  function buildIndex() {
    searchIndex = PRODUCTS.map(function (p) {
      var c = category(p.category) || {};
      var both = function (o) { return o ? (o.en || '') + ' ' + (o.ckb || '') : ''; };
      return {
        p: p,
        fields: [
          [norm(both(p.name)), 10],
          [norm(both(p.typeName) + ' ' + p.type), 7],
          [norm(both(c.name) + ' ' + p.category + ' ' + (ALIASES[p.category] || '')), 5],
          [norm((p.colors || []).map(function (x) { return both(x.name); }).join(' ')), 3],
          [norm(both(p.short)), 1]
        ]
      };
    });
  }
  /** BENM.search('loafer') → products sorted by relevance (all words must match). */
  function search(query) {
    var q = norm(query);
    if (!q) return [];
    if (!searchIndex) buildIndex();
    var toks = q.split(' ').filter(Boolean).map(stem).filter(Boolean);
    var out = [];
    searchIndex.forEach(function (row, i) {
      var total = 0;
      for (var k = 0; k < toks.length; k++) {
        var best = 0;
        for (var f = 0; f < row.fields.length; f++) {
          var text = row.fields[f][0], at = text.indexOf(toks[k]);
          if (at > -1) {
            var wordStart = at === 0 || text.charAt(at - 1) === ' ';
            best = Math.max(best, row.fields[f][1] + (wordStart ? 2 : 0));
          }
        }
        if (!best) return;
        total += best;
      }
      out.push({ p: row.p, score: total + (row.p.featured ? .5 : 0), i: i });
    });
    out.sort(function (a, b) { return b.score - a.score || a.i - b.i; });
    return out.map(function (r) { return r.p; });
  }

  /* ===========================================================================
     5. Stores — cart & wishlist (localStorage, synced across tabs)
     ======================================================================== */
  var cart = (function () {
    var KEY = 'benm:cart';
    var lines = load();
    function load() {
      var a = store.json(KEY, []);
      return Array.isArray(a) ? a.filter(function (l) { return l && findProduct(l.id) && l.qty > 0; }) : [];
    }
    function save() { store.set(KEY, JSON.stringify(lines)); }
    function hash(o) {
      var s = JSON.stringify(o || ''), h = 0;
      for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
      return (h >>> 0).toString(36);
    }
    function keyOf(id, color, size, options) {
      return [id, color || '', size == null ? '' : size, options ? hash(options) : ''].join('|');
    }
    function find(key) {
      for (var i = 0; i < lines.length; i++) if (lines[i].key === key) return lines[i];
      return null;
    }
    function changed(action, key, extra) {
      save();
      var detail = { action: action, key: key, items: api.items(), count: api.count(), subtotal: api.subtotal() };
      if (extra) for (var k in extra) if (hasOwn(extra, k)) detail[k] = extra[k];
      emit('cart', detail);
    }
    function enrich(l) {
      var p = findProduct(l.id);
      var c = colorOf(p, l.color);
      var fee = l.options && Number(l.options.fee) || 0;
      return {
        key: l.key, id: l.id, product: p, color: c, colorId: l.color, size: l.size, qty: l.qty,
        options: l.options || null, unitPrice: p.price + fee, lineTotal: (p.price + fee) * l.qty
      };
    }
    var api = {
      /** add(id, {color, size, qty, options}) → line key (null for an unknown id) */
      add: function (id, opts) {
        var p = findProduct(id);
        if (!p) { console.warn('[BENM] cart.add: unknown product "' + id + '"'); return null; }
        opts = opts || {};
        var color = (colorOf(p, opts.color) || {}).id || '';
        var size = opts.size == null || opts.size === '' ? null : (isNaN(+opts.size) ? opts.size : +opts.size);
        var qty = clamp(parseInt(opts.qty, 10) || 1, 1, MAX_QTY);
        var key = keyOf(p.id, color, size, opts.options);
        var line = find(key);
        if (line) line.qty = clamp(line.qty + qty, 1, MAX_QTY);
        else lines.push({ key: key, id: p.id, color: color, size: size, qty: qty, options: opts.options || null, added: Date.now() });
        changed('add', key, { id: p.id, qty: qty });
        return key;
      },
      remove: function (key) {
        var line = find(key);
        if (!line) return false;
        lines.splice(lines.indexOf(line), 1);
        changed('remove', key, { id: line.id, line: line });
        return true;
      },
      /** update(key, qty) — qty ≤ 0 removes the line */
      update: function (key, qty) {
        var line = find(key);
        if (!line) return false;
        qty = parseInt(qty, 10) || 0;
        if (qty <= 0) return api.remove(key);
        line.qty = clamp(qty, 1, MAX_QTY);
        changed('update', key, { id: line.id });
        return true;
      },
      /** restore a removed line (undo) */
      restore: function (line) {
        if (!line || !findProduct(line.id) || find(line.key)) return false;
        lines.push(line);
        changed('add', line.key, { id: line.id, qty: line.qty });
        return true;
      },
      items: function () { return lines.map(enrich); },
      get: function (key) { var l = find(key); return l ? enrich(l) : null; },
      count: function () { return lines.reduce(function (s, l) { return s + l.qty; }, 0); },
      subtotal: function () { return lines.reduce(function (s, l) { return s + enrich(l).lineTotal; }, 0); },
      has: function (id) { return lines.some(function (l) { return l.id === id; }); },
      clear: function () { lines = []; changed('clear', null); },
      max: MAX_QTY,
      _reload: function () { lines = load(); }
    };
    return api;
  })();

  var wishlist = (function () {
    var KEY = 'benm:wishlist';
    var ids = load();
    function load() {
      var a = store.json(KEY, []);
      return Array.isArray(a) ? a.filter(function (id) { return !!findProduct(id); }) : [];
    }
    function changed(id, saved) {
      store.set(KEY, JSON.stringify(ids));
      emit('wishlist', { id: id, saved: saved, ids: ids.slice(), count: ids.length });
    }
    var api = {
      /** toggle(id) → true when now saved */
      toggle: function (id) { return api.has(id) ? !api.remove(id) : api.add(id); },
      add: function (id) {
        if (!findProduct(id) || api.has(id)) return api.has(id);
        ids.unshift(id);
        changed(id, true);
        return true;
      },
      remove: function (id) {
        var i = ids.indexOf(id);
        if (i < 0) return false;
        ids.splice(i, 1);
        changed(id, false);
        return true;
      },
      has: function (id) { return ids.indexOf(id) > -1; },
      ids: function () { return ids.slice(); },
      /** saved products (objects), newest first */
      items: function () { return ids.map(findProduct).filter(Boolean); },
      count: function () { return ids.length; },
      clear: function () { ids = []; changed(null, false); },
      _reload: function () { ids = load(); }
    };
    return api;
  })();

  // keep tabs in sync
  w.addEventListener('storage', function (e) {
    if (e.key === 'benm:cart') { cart._reload(); emit('cart', { action: 'sync', items: cart.items(), count: cart.count(), subtotal: cart.subtotal() }); }
    if (e.key === 'benm:wishlist') { wishlist._reload(); emit('wishlist', { id: null, saved: false, ids: wishlist.ids(), count: wishlist.count() }); }
  });

  /* ===========================================================================
     6. Icons · WhatsApp messages
     ======================================================================== */
  /** BENM.icon('bag', {className, label, size}) → inline <svg> string */
  function icon(name, opts) {
    opts = opts || {};
    var body = (w.BENM_ICONS || {})[name];
    if (!body) return '';
    return '<svg class="c-icon c-icon--' + name + (opts.className ? ' ' + opts.className : '') + '" viewBox="0 0 24 24"' +
      (opts.size ? ' style="--icon-size:' + (+opts.size) + 'px"' : '') +
      (opts.label ? ' role="img" aria-label="' + esc(opts.label) + '"' : ' aria-hidden="true" focusable="false"') + '>' + body + '</svg>';
  }

  function whatsappLink(text) {
    var n = String(CONFIG.whatsapp || '').replace(/\D/g, '');
    return 'https://wa.me/' + n + (text ? '?text=' + encodeURIComponent(text) : '');
  }
  function lineDetails(it) {
    var bits = [];
    if (it.color) bits.push(t('wa.color', { value: loc(it.color.name) }));
    if (it.size != null) bits.push(t('wa.size', { value: num(it.size) }));
    if (it.qty) bits.push(t('wa.qty', { value: num(it.qty) }));
    if (it.options && it.options.summary) bits.push(loc(it.options.summary));
    return bits.join(' · ');
  }
  function normaliseItems(items) {
    return (items || cart.items()).map(function (it) {
      if (it.product) return it;
      var p = findProduct(it.id);
      if (!p) return null;
      var fee = it.options && Number(it.options.fee) || 0;
      var qty = it.qty || 1;
      return { id: p.id, product: p, color: colorOf(p, it.color), size: it.size == null ? null : it.size, qty: qty,
        options: it.options || null, unitPrice: p.price + fee, lineTotal: (p.price + fee) * qty };
    }).filter(Boolean);
  }
  /** Localised order message for WhatsApp — default: the current bag. */
  function orderMessage(items) {
    items = normaliseItems(items);
    var total = 0;
    var lines = items.map(function (it, i) {
      total += it.lineTotal;
      return t('wa.line', { i: i + 1, name: loc(it.product.name), details: lineDetails(it), price: price(it.lineTotal) });
    });
    return [t('wa.order')].concat(lines, ['', t('wa.subtotal', { amount: price(total) }), t('wa.thanks')]).join('\n');
  }
  /** One-product enquiry ("Order via WhatsApp" on the product page). */
  function productMessage(id, opts) {
    var it = normaliseItems([{ id: id, color: opts && opts.color, size: opts && opts.size, qty: (opts && opts.qty) || 1, options: opts && opts.options }])[0];
    if (!it) return t('wa.hello');
    return t('wa.product', { name: loc(it.product.name), details: lineDetails(it) + ' · ' + price(it.lineTotal) });
  }

  /* ===========================================================================
     7. Layers — one stack for menu / search / drawer / modal:
        Esc closes the top layer, Tab is trapped, focus is restored,
        page scroll is locked (no layout shift: the scrollbar stays).
     ======================================================================== */
  var layers = [];
  var FOCUSABLE = 'a[href], area[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), iframe, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';
  function focusables(root) {
    return $$(FOCUSABLE, root).filter(function (el) {
      return !el.closest('[hidden], [inert]') && (el.offsetWidth || el.offsetHeight || el.getClientRects().length);
    });
  }
  function pushLayer(layer) {
    dismissToasts();                                    // stale feedback never covers a new layer
    layer.restore = d.activeElement;
    layers.push(layer);
    if (layers.length === 1) lockScroll();
    return layer;
  }
  function popLayer(layer, opts) {
    var i = layers.indexOf(layer);
    if (i < 0) return;
    layers.splice(i, 1);
    if (!layers.length) unlockScroll();
    if (!(opts && opts.noRestore) && layer.restore && d.contains(layer.restore)) focusEl(layer.restore);
  }
  function topLayer() { return layers[layers.length - 1] || null; }
  function closeLayers(except, immediate) {
    layers.slice().reverse().forEach(function (l) { if (l !== except && l.name !== except) l.close({ immediate: immediate, noRestore: true }); });
  }

  var scrollLocked = false;
  function scrollKeyGuard(e) {
    var keys = [' ', 'PageUp', 'PageDown', 'Home', 'End', 'ArrowUp', 'ArrowDown'];
    if (keys.indexOf(e.key) < 0) return;
    var tgt = e.target;
    if (tgt && tgt.closest && tgt.closest('input, textarea, select, [contenteditable="true"], [data-lenis-prevent], [role="tablist"]')) return;
    if (e.key === ' ' && tgt && tgt.closest && tgt.closest('button, a, [role="button"]')) return;
    e.preventDefault();
  }
  function wheelGuard(e) {
    if (e.target && e.target.closest && e.target.closest('[data-lenis-prevent]')) return;
    if (e.cancelable) e.preventDefault();
  }
  function lockScroll() {
    if (scrollLocked) return;
    scrollLocked = true;
    html.classList.add('is-locked');
    if (lenis) lenis.stop();
    else {
      w.addEventListener('wheel', wheelGuard, { passive: false });
      w.addEventListener('touchmove', wheelGuard, { passive: false });
    }
    w.addEventListener('keydown', scrollKeyGuard);
  }
  function unlockScroll() {
    if (!scrollLocked) return;
    scrollLocked = false;
    html.classList.remove('is-locked');
    if (lenis) lenis.start();
    w.removeEventListener('wheel', wheelGuard);
    w.removeEventListener('touchmove', wheelGuard);
    w.removeEventListener('keydown', scrollKeyGuard);
  }

  d.addEventListener('keydown', function (e) {
    var top = topLayer();
    if (!top) return;
    if (e.key === 'Escape' || e.key === 'Esc') {
      e.preventDefault();
      top.close();
      return;
    }
    if (e.key !== 'Tab') return;
    var list = focusables(top.el);
    if (top.extra) list = top.extra.filter(function (x) { return x && x.offsetWidth; }).concat(list);
    if (!list.length) { e.preventDefault(); return; }
    var first = list[0], last = list[list.length - 1], active = d.activeElement;
    var inside = list.indexOf(active) > -1;
    if (e.shiftKey && (active === first || !inside)) { e.preventDefault(); focusEl(last); }
    else if (!e.shiftKey && (active === last || !inside)) { e.preventDefault(); focusEl(first); }
  });

  /* ===========================================================================
     8. Toasts
     ======================================================================== */
  /** BENM.toast(message, {action:{label, onClick}, icon:'check', duration:4200}) */
  function toast(msg, opts) {
    opts = opts || {};
    var region = $('[data-toasts]');
    if (!region) return null;
    var el = d.createElement('div');
    el.className = 'c-toast';
    el.innerHTML = '<span class="c-toast__icon">' + icon(opts.icon || 'check') + '</span><p class="c-toast__msg"></p>' +
      (opts.action ? '<button class="c-toast__action" type="button"></button>' : '') +
      '<button class="c-icon-btn c-toast__close" type="button" aria-label="' + esc(t('a11y.close')) + '">' + icon('close') + '</button>';
    $('.c-toast__msg', el).textContent = msg;
    var timer = null, closed = false;
    function close() {
      if (closed) return;
      closed = true;
      clearTimeout(timer);
      if (REDUCED) { el.remove(); return; }
      gsap.to(el, { opacity: 0, y: 12, duration: .35, ease: 'power2.in', onComplete: function () { el.remove(); } });
    }
    function arm() { clearTimeout(timer); timer = setTimeout(close, opts.duration || 4200); }
    if (opts.action) {
      var btn = $('.c-toast__action', el);
      btn.textContent = opts.action.label;
      btn.addEventListener('click', function () { close(); tryCall(opts.action.onClick); });
    }
    el.__close = close;
    $('.c-toast__close', el).addEventListener('click', close);
    el.addEventListener('pointerenter', function () { clearTimeout(timer); });
    el.addEventListener('pointerleave', arm);
    el.addEventListener('focusin', function () { clearTimeout(timer); });
    el.addEventListener('focusout', arm);
    region.appendChild(el);
    var all = $$('.c-toast', region);
    if (all.length > 3) all[0].remove();
    if (!REDUCED) gsap.fromTo(el, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .7, ease: 'expo.out' });
    arm();
    return { el: el, close: close };
  }

  function dismissToasts() { $$('.c-toast').forEach(function (el) { if (el.__close) el.__close(); }); }

  /* ===========================================================================
     9. Modal — BENM.modal.open(htmlOrElement, opts) / .close()
     ======================================================================== */
  var modal = (function () {
    var current = null;
    function open(content, opts) {
      opts = opts || {};
      if (current) close({ immediate: true, noRestore: true });
      var root = d.createElement('div');
      root.className = 'c-modal' + (opts.className ? ' ' + opts.className : '');
      root.setAttribute('role', 'dialog');
      root.setAttribute('aria-modal', 'true');
      if (opts.labelledBy) root.setAttribute('aria-labelledby', opts.labelledBy);
      else root.setAttribute('aria-label', opts.label || t('a11y.dialog'));
      root.innerHTML = '<div class="c-modal__backdrop" data-modal-close></div>' +
        '<div class="c-modal__panel c-modal__panel--' + (opts.size || 'lg') + ' theme-' + (opts.theme || 'light') + '" tabindex="-1" data-lenis-prevent>' +
        '<button class="c-icon-btn c-modal__close" type="button" data-modal-close aria-label="' + esc(t('a11y.close')) + '" data-i18n-attr="aria-label:a11y.close">' + icon('close') + '</button>' +
        '<div class="c-modal__content"></div></div>';
      var panel = $('.c-modal__panel', root);
      var slot = $('.c-modal__content', root);
      if (typeof content === 'string') slot.innerHTML = content;
      else if (content && content.nodeType) slot.appendChild(content);
      if (opts.padded) slot.classList.add('c-modal__body');
      d.body.appendChild(root);
      applyI18n(root);
      var state = { root: root, panel: panel, opts: opts };
      state.layer = pushLayer({ name: 'modal', el: root, close: function (o) { close(o); } });
      current = state;
      root.addEventListener('click', function (e) {
        if (e.target.closest('[data-modal-close]')) close();
      });
      if (!REDUCED) {
        var sheet = w.innerWidth < 760;
        gsap.fromTo($('.c-modal__backdrop', root), { opacity: 0 }, { opacity: 1, duration: .5, ease: 'power2.out' });
        gsap.fromTo(panel, sheet ? { yPercent: 100 } : { opacity: 0, y: 46 },
          sheet ? { yPercent: 0, duration: .8, ease: 'expo.out' } : { opacity: 1, y: 0, duration: .9, ease: 'expo.out' });
      }
      var target = opts.initialFocus ? $(opts.initialFocus, root) : null;
      focusEl(target || panel);
      if (opts.onOpen) tryCall(opts.onOpen, panel);
      return panel;
    }
    function close(o) {
      o = o || {};
      if (!current) return;
      var state = current;
      current = null;
      var finish = function () {
        state.root.remove();
        if (state.opts.onClose) tryCall(state.opts.onClose);
      };
      popLayer(state.layer, { noRestore: o.noRestore });
      if (REDUCED || o.immediate) { finish(); return; }
      gsap.to($('.c-modal__backdrop', state.root), { opacity: 0, duration: .4, ease: 'power2.in' });
      gsap.to(state.panel, { opacity: 0, y: 24, duration: .35, ease: 'power2.in', onComplete: finish });
    }
    return {
      open: open,
      close: close,
      isOpen: function () { return !!current; },
      el: function () { return current ? current.panel : null; }
    };
  })();

  /* ===========================================================================
     10. Product card — THE shared card (BENM.productCard)
     ======================================================================== */
  /**
   * BENM.productCard(productOrId, opts) → HTML string
   *   opts.variant  'default' | 'dark' | 'compact'
   *   opts.index    number → "N°01" before the type
   *   opts.heading  'h2' | 'h3' (default) | 'h4'
   *   opts.eager    true for above-the-fold images
   *   opts.reveal   adds data-reveal="<type>" to the card
   *   opts.className / opts.attrs (raw attribute string)
   */
  function productCard(p, opts) {
    if (typeof p === 'string') p = findProduct(p);
    if (!p) return '';
    opts = opts || {};
    var variant = opts.variant || 'default';
    var compact = variant === 'compact';
    var name = loc(p.name);
    var first = (p.colors || [])[0];
    var saved = wishlist.has(p.id);
    var heading = /^h[2-6]$/.test(opts.heading || '') ? opts.heading : 'h3';
    var badgeKey = p.badge === 'new' ? 'card.new' : p.badge === 'limited' ? 'card.limited' : null;
    var oneSize = isOneSize(p);
    var cls = 'c-card' + (variant === 'dark' ? ' c-card--dark' : '') + (compact ? ' c-card--compact' : '') + (opts.className ? ' ' + opts.className : '');
    var dots = (p.colors || []).slice(0, 4).map(function (c) {
      return '<span class="c-card__dot" style="--swatch:' + esc(c.hex) + '" title="' + esc(loc(c.name)) + '" data-color-title="' + esc(c.id) + '"></span>';
    }).join('') + ((p.colors || []).length > 4 ? '<span class="c-card__more">+' + num(p.colors.length - 4) + '</span>' : '');
    return '' +
      '<article class="' + cls + '" data-product-id="' + esc(p.id) + '"' + (opts.reveal ? ' data-reveal="' + esc(opts.reveal) + '"' : '') + (opts.attrs ? ' ' + opts.attrs : '') + '>' +
        '<div class="c-card__media">' +
          '<img class="c-card__img c-card__img--main" src="' + esc(url(p.images[0])) + '" alt="' + esc(t('card.alt', { name: name, color: first ? loc(first.name) : '' })) + '"' +
            ' width="1200" height="1500" loading="' + (opts.eager ? 'eager' : 'lazy') + '" decoding="async" data-card-img>' +
          (!compact && p.images[1] ? '<img class="c-card__img c-card__img--alt" src="' + esc(url(p.images[1])) + '" alt="" aria-hidden="true" width="1200" height="1500" loading="lazy" decoding="async">' : '') +
          '<span class="c-card__veil" aria-hidden="true"></span>' +
          (badgeKey ? '<span class="c-badge c-badge--' + esc(p.badge) + ' c-card__badge" data-i18n="' + badgeKey + '">' + esc(t(badgeKey)) + '</span>' : '') +
          '<button class="c-icon-btn c-card__wish" type="button" data-wish="' + esc(p.id) + '" aria-pressed="' + saved + '" aria-label="' +
            esc(t(saved ? 'card.unsave' : 'card.save', { name: name })) + '">' + icon('heart') + icon('heart-fill') + '</button>' +
          (!compact ? '<button class="c-card__quick" type="button" data-quick-add="' + esc(p.id) + '" aria-label="' + esc(t(oneSize ? 'card.quickAdd' : 'card.quickView') + ' — ' + name) + '">' +
            icon('plus') + '<span class="c-card__quick-label" data-i18n="' + (oneSize ? 'card.quickAdd' : 'card.quickView') + '">' + esc(t(oneSize ? 'card.quickAdd' : 'card.quickView')) + '</span></button>' : '') +
        '</div>' +
        '<div class="c-card__body">' +
          '<div class="c-card__row">' +
            '<p class="c-card__type">' + (opts.index ? '<span class="c-card__index" aria-hidden="true">N°' + pad(opts.index, 2) + '</span>' : '') +
              '<span data-pfield="typeName">' + esc(loc(p.typeName)) + '</span></p>' +
            (!compact && dots ? '<span class="c-card__dots" aria-hidden="true">' + dots + '</span>' : '') +
          '</div>' +
          '<div class="c-card__row">' +
            '<' + heading + ' class="c-card__name"><a class="c-card__link" href="' + esc(productUrl(p.id)) + '" data-pfield="name" data-cursor-label="cursor.view">' + esc(name) + '</a></' + heading + '>' +
            '<span class="c-card__price c-price" data-price="' + (+p.price) + '">' + esc(price(p.price)) + '</span>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  /** Re-localise product texts in place (cards, product pages): [data-pfield] inside [data-product-id]. */
  function refreshProducts(root) {
    root = root || html;
    scan('[data-pfield]', root).forEach(function (el) {
      var host = el.closest('[data-product-id]');
      var p = host && findProduct(host.getAttribute('data-product-id'));
      var v = p && p[el.getAttribute('data-pfield')];
      if (v != null) el.textContent = loc(v);
    });
    scan('[data-product-id]', root).forEach(function (host) {
      var p = findProduct(host.getAttribute('data-product-id'));
      if (!p) return;
      var name = loc(p.name);
      var img = $('[data-card-img]', host);
      if (img && img.closest('[data-product-id]') === host) img.alt = t('card.alt', { name: name, color: loc((p.colors[0] || {}).name) });
      $$('[data-color-title]', host).forEach(function (dot) { var c = colorOf(p, dot.getAttribute('data-color-title')); if (c) dot.title = loc(c.name); });
      var qa = $('[data-quick-add]', host);
      if (qa && qa.closest('[data-product-id]') === host) qa.setAttribute('aria-label', t(isOneSize(p) ? 'card.quickAdd' : 'card.quickView') + ' — ' + name);
    });
    syncWishButtons(root);
  }
  function syncWishButtons(root) {
    scan('[data-wish]', root || html).forEach(function (b) {
      var id = b.getAttribute('data-wish');
      var p = findProduct(id);
      var saved = wishlist.has(id);
      b.setAttribute('aria-pressed', String(saved));
      if (p && !b.hasAttribute('data-wish-static')) b.setAttribute('aria-label', t(saved ? 'card.unsave' : 'card.save', { name: loc(p.name) }));
    });
  }

  /* ===========================================================================
     11. Quick view
     ======================================================================== */
  function quickView(id) {
    var p = findProduct(id);
    if (!p) return null;
    var key = uid('qv');
    var name = loc(p.name);
    var cat = category(p.category);
    var oneSize = isOneSize(p);
    var soldOut = p.soldOut || [];
    var slides = p.images.map(function (src, i) {
      return '<div class="c-qv__slide"><img src="' + esc(url(src)) + '" alt="' + (i ? '' : esc(t('card.alt', { name: name, color: loc(p.colors[0].name) }))) + '" width="1200" height="1500" decoding="async"></div>';
    }).join('');
    var dots = p.images.length > 1 ? '<div class="c-qv__dots" aria-hidden="true">' + p.images.map(function (s, i) { return '<span class="c-qv__dot' + (i ? '' : ' is-active') + '"></span>'; }).join('') + '</div>' : '';
    var swatches = p.colors.map(function (c, i) {
      return '<label class="c-swatch" style="--swatch:' + esc(c.hex) + '"><input type="radio" name="' + key + '-color" value="' + esc(c.id) + '"' + (i ? '' : ' checked') + '>' +
        '<span class="c-swatch__dot"></span><span class="u-visually-hidden">' + esc(loc(c.name)) + '</span></label>';
    }).join('');
    var sizes = oneSize ? '<p class="c-qv__short" data-i18n="product.oneSize">' + esc(t('product.oneSize')) + '</p>' :
      '<div class="c-sizes">' + p.sizes.map(function (s) {
        var out = soldOut.indexOf(s) > -1;
        return '<label class="c-size"' + (out ? ' title="' + esc(t('product.sizeSoldOut', { size: num(s) })) + '"' : '') + '><input type="radio" name="' + key + '-size" value="' + s + '"' + (out ? ' disabled' : '') + '>' +
          '<span>' + num(s) + '</span></label>';
      }).join('') + '</div>';
    var content = '' +
      '<div class="c-qv" data-product-id="' + esc(p.id) + '">' +
        '<div class="c-qv__media u-relative"><div class="c-qv__gallery" tabindex="0" aria-label="' + esc(name) + '">' + slides + '</div>' + dots + '</div>' +
        '<div class="c-qv__info" data-lenis-prevent>' +
          '<p class="c-eyebrow"><span data-pfield="typeName">' + esc(loc(p.typeName)) + '</span>' + (cat ? '<span class="c-diamond" aria-hidden="true"></span><span>' + esc(loc(cat.name)) + '</span>' : '') + '</p>' +
          '<div><h2 class="c-qv__name" id="' + key + '-title" data-pfield="name">' + esc(name) + '</h2>' +
            '<p class="c-price c-price--lg" data-price="' + p.price + '" style="margin-top:12px">' + esc(price(p.price)) + '</p></div>' +
          '<p class="c-qv__short" data-pfield="short">' + esc(loc(p.short)) + '</p>' +
          '<fieldset><legend class="c-qv__legend"><span data-i18n="product.color">' + esc(t('product.color')) + '</span><b data-qv-color>' + esc(loc(p.colors[0].name)) + '</b></legend>' +
            '<div class="c-swatches">' + swatches + '</div></fieldset>' +
          '<fieldset><legend class="c-qv__legend"><span data-i18n="product.size">' + esc(t('product.size')) + '</span></legend>' + sizes + '</fieldset>' +
          '<p class="c-qv__msg" role="alert" data-qv-msg></p>' +
          '<div class="c-qv__actions">' +
            '<button class="c-btn c-btn--primary" type="button" data-qv-add><span class="c-btn__label"><span data-i18n="product.addToBag">' + esc(t('product.addToBag')) + '</span></span></button>' +
            '<button class="c-icon-btn c-icon-btn--framed" type="button" data-wish="' + esc(p.id) + '" aria-pressed="' + wishlist.has(p.id) + '" aria-label="' + esc(t(wishlist.has(p.id) ? 'card.unsave' : 'card.save', { name: name })) + '" style="width:56px;height:56px">' +
              icon('heart') + '</button>' +
          '</div>' +
          (p.personalisable ? '<p class="c-qv__note">' + icon('needle') + '<span data-i18n="product.personalisable">' + esc(t('product.personalisable')) + '</span></p>' : '') +
          '<a class="c-link" href="' + esc(productUrl(p.id)) + '"><span data-i18n="product.viewDetails">' + esc(t('product.viewDetails')) + '</span>' + icon('arrow') + '</a>' +
        '</div>' +
      '</div>';
    return modal.open(content, {
      labelledBy: key + '-title',
      size: 'lg',
      className: 'c-modal--qv',
      onOpen: function (panel) {
        var gallery = $('.c-qv__gallery', panel);
        var dotEls = $$('.c-qv__dot', panel);
        if (gallery && dotEls.length) {
          gallery.addEventListener('scroll', function () {
            var i = Math.round(Math.abs(gallery.scrollLeft) / Math.max(1, gallery.clientWidth));
            dotEls.forEach(function (dt, k) { dt.classList.toggle('is-active', k === i); });
          }, { passive: true });
        }
        panel.addEventListener('change', function (e) {
          if (e.target.name === key + '-color') {
            var c = colorOf(p, e.target.value);
            $('[data-qv-color]', panel).textContent = loc(c.name);
          }
          if (e.target.name === key + '-size') $('[data-qv-msg]', panel).textContent = '';
        });
        $('[data-qv-add]', panel).addEventListener('click', function () {
          var color = ($('input[name="' + key + '-color"]:checked', panel) || {}).value;
          var sizeEl = $('input[name="' + key + '-size"]:checked', panel);
          if (!oneSize && !sizeEl) {
            var msg = $('[data-qv-msg]', panel);
            msg.textContent = t('product.chooseSize');
            var firstSize = $('input[name="' + key + '-size"]:not(:disabled)', panel);
            if (firstSize) focusEl(firstSize);
            return;
          }
          var img = $('.c-qv__slide img', panel);
          addToBag(p.id, { color: color, size: sizeEl ? sizeEl.value : null }, img);
          modal.close();
        });
      }
    });
  }

  /** Add + toast + fly animation — the shared "add to bag" gesture. */
  function addToBag(id, opts, sourceEl) {
    var key = cart.add(id, opts);
    if (!key) return null;
    var p = findProduct(id);
    if (sourceEl) flyToBag(sourceEl);
    toast(t('toast.added', { name: loc(p.name) }), { icon: 'bag', action: { label: t('toast.viewBag'), onClick: function () { openDrawer('bag'); } } });
    return key;
  }

  /** Ghost of an image flies into the header bag icon. */
  function flyToBag(source) {
    var target = $('.c-header [data-open-drawer="bag"]');
    var img = source && (source.tagName === 'IMG' ? source : $('img', source));
    if (REDUCED || !target || !img || !img.complete) return;
    var r = img.getBoundingClientRect();
    if (!r.width) return;
    if (header) header.show();
    var tr = target.getBoundingClientRect();
    var ghost = d.createElement('img');
    ghost.src = img.currentSrc || img.src;
    ghost.alt = '';
    ghost.className = 'c-fly';
    ghost.setAttribute('aria-hidden', 'true');
    ghost.style.width = r.width + 'px';
    ghost.style.height = r.height + 'px';
    d.body.appendChild(ghost);
    gsap.set(ghost, { x: r.left, y: r.top, transformOrigin: '50% 50%' });
    var tx = tr.left + tr.width / 2 - r.width / 2;
    var ty = tr.top + tr.height / 2 - r.height / 2;
    gsap.timeline({ onComplete: function () { ghost.remove(); } })
      .to(ghost, { x: tx, duration: .95, ease: 'power2.inOut' }, 0)
      .to(ghost, { y: ty, duration: .95, ease: 'power3.in' }, 0)
      .to(ghost, { scale: Math.max(.04, 22 / r.width), duration: .95, ease: 'power2.in' }, 0)
      .to(ghost, { opacity: 0, duration: .2 }, .8);
  }

  /* ===========================================================================
     12. Smooth scroll — Lenis + ScrollTrigger
     ======================================================================== */
  var lenis = null;
  function initScroll() {
    if (REDUCED || !LenisCtor) return;
    try {
      lenis = new LenisCtor({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 1, autoRaf: false });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
      BENM.lenis = lenis;
    } catch (e) {
      console.error(e);
      lenis = null;
    }
  }
  function headerOffset() { return header && header.el ? header.el.offsetHeight : 0; }
  /** BENM.scrollTo(number | element | '#id' | 'top', {offset, duration, immediate}) → true when scrolled */
  function scrollTo(target, opts) {
    opts = opts || {};
    var y = null;
    if (typeof target === 'number') y = target;
    else if (target === 'top') y = 0;
    else {
      var el = target;
      if (typeof target === 'string') { try { el = d.querySelector(target); } catch (e) { el = null; } }
      if (!el || !el.getBoundingClientRect) return false;
      y = el.getBoundingClientRect().top + (w.scrollY || html.scrollTop) + (opts.offset != null ? opts.offset : -headerOffset());
    }
    y = Math.max(0, y);
    if (lenis) lenis.scrollTo(y, { duration: opts.duration || 1.4, easing: EASE_EXPO, immediate: !!opts.immediate, force: true, onComplete: opts.onComplete });
    else {
      w.scrollTo({ top: y, behavior: REDUCED || opts.immediate ? 'auto' : 'smooth' });
      if (opts.onComplete) setTimeout(opts.onComplete, REDUCED ? 0 : 700);
    }
    return true;
  }
  var refresh = debounce(function () {
    if (HAS_GSAP) { try { ScrollTrigger.refresh(); } catch (e) { console.error(e); } }
  }, 120);

  /* ===========================================================================
     13. Split · reveals · parallax · magnetic · marquee · counters
     ======================================================================== */
  var splits = [];
  /** BENM.split(el, 'words'|'lines') → {words, lines, revert()} — never chars (Arabic joining). */
  function split(el, type, opts) {
    if (!el || !SplitText) return null;
    type = type === 'lines' ? 'lines' : 'words';
    if (el.__benmSplit) el.__benmSplit.revert();
    var inst;
    try {
      // reduceWhiteSpace:false keeps &nbsp; from the i18n strings (it would become a breakable space while split)
      inst = SplitText.create(el, { type: type === 'lines' ? 'lines' : 'words', mask: type, linesClass: 'split-line', wordsClass: 'split-word', aria: 'auto' });
    } catch (e) { console.error(e); return null; }
    var rec = {
      el: el, type: type, opts: opts || {}, words: (inst.words || []).slice(), lines: (inst.lines || []).slice(), instance: inst,
      revert: function () {
        var i = splits.indexOf(rec);
        if (i > -1) splits.splice(i, 1);
        try { inst.revert(); } catch (e) { /* already reverted */ }
        if (el.__benmSplit === rec) el.__benmSplit = null;
      }
    };
    el.__benmSplit = rec;
    splits.push(rec);
    return rec;
  }
  // Before a language switch: revert every split (text is about to change);
  // the returned function re-splits manual splits and re-arms pending reveals.
  function suspendSplits() {
    var manual = [], rearm = [];
    splits.slice().forEach(function (s) {
      if (s.opts.reveal) {
        var r = s.opts.reveal;
        if (r.tween) r.tween.kill();
        if (r.st) r.st.kill();
        rearm.push(r.el);
        r.el.__benmReveal = null;
      } else manual.push({ el: s.el, type: s.type, opts: s.opts });
      s.revert();
    });
    return function () {
      manual.forEach(function (m) { split(m.el, m.type, m.opts); });
      rearm.forEach(function (el) { setupReveal(el); });
    };
  }

  var isReady = false;
  var revealQueue = [];
  function playReveal(rec) {
    if (rec.played) return;
    if (!isReady) { if (revealQueue.indexOf(rec) < 0) revealQueue.push(rec); return; }
    rec.played = true;
    if (rec.tween) rec.tween.play();
  }
  function flushReveals() {
    var q = revealQueue.splice(0);
    q.sort(function (a, b) { return a.el.compareDocumentPosition(b.el) & 4 ? -1 : 1; });
    q.forEach(function (rec, i) {
      if (rec.tween) rec.tween.delay((rec.tween.delay() || 0) + Math.min(i, 8) * .07);
      playReveal(rec);
    });
  }
  function finishReveal(rec, targets) {
    rec.done = true;
    rec.el.classList.add('is-revealed');
    if (rec.split) { rec.split.revert(); rec.split = null; }       // pieces are gone: nothing to clear
    else if (targets !== rec.el && targets.length) gsap.set(targets, { clearProps: 'transform,opacity,clipPath,visibility' });
    gsap.set(rec.el, { clearProps: 'opacity,transform,clipPath' });
  }
  function setupReveal(el) {
    if (el.__benmReveal || el.classList.contains('is-revealed')) return;
    var rec = { el: el, type: (el.getAttribute('data-reveal') || 'up').trim(), done: false, played: false };
    el.__benmReveal = rec;
    if (REDUCED) { el.classList.add('is-revealed'); rec.done = true; return; }
    var delay = parseFloat(el.getAttribute('data-reveal-delay')) || 0;
    var sAttr = el.getAttribute('data-reveal-stagger');
    var stagger = sAttr != null && sAttr !== '' ? parseFloat(sAttr) || 0 : null;
    var targets = el, from, to;
    var children = stagger != null && ['lines', 'words'].indexOf(rec.type) < 0 ? Array.prototype.slice.call(el.children) : null;
    if (children && children.length) { targets = children; gsap.set(el, { opacity: 1 }); }
    var common = { paused: true, delay: delay };
    switch (rec.type) {
      case 'lines':
      case 'words':
        rec.split = split(el, rec.type, { reveal: rec });
        targets = rec.split ? (rec.type === 'lines' ? rec.split.lines : rec.split.words) : [el];
        gsap.set(el, { opacity: 1 });
        from = { yPercent: 115 };
        to = { yPercent: 0, duration: rec.type === 'lines' ? 1.3 : 1.15, ease: 'expo.out', stagger: stagger != null ? stagger : (rec.type === 'lines' ? .1 : .045) };
        if (!rec.split) { from = { opacity: 0, y: 40 }; to = { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out' }; }
        break;
      case 'fade':
        from = { opacity: 0 };
        to = { opacity: 1, duration: 1.4, ease: 'power2.out' };
        break;
      case 'scale':
        from = { opacity: 0, scale: .94 };
        to = { opacity: 1, scale: 1, duration: 1.5, ease: 'expo.out' };
        break;
      case 'clip':
      case 'clip-up':
        var hidden = rec.type === 'clip-up' ? 'inset(100% 0% 0% 0%)' : (isRTL() ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)');
        from = { clipPath: hidden, opacity: 1 };
        to = { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'power3.inOut' };
        var inner = $('img, video, picture, canvas', el);
        if (inner && !inner.hasAttribute('data-parallax') && !(children && children.length)) {
          rec.inner = inner;
        }
        break;
      case 'draw':
        var paths = el.tagName.toLowerCase() === 'path' ? [el] : $$('path, line, polyline, circle, rect, ellipse', el);
        if (el.namespaceURI === 'http://www.w3.org/2000/svg' || (paths.length && el.tagName.toLowerCase() === 'svg')) {
          paths.forEach(function (pth) { pth.setAttribute('pathLength', '1'); });
          gsap.set(el, { opacity: 1 });
          targets = paths;
          from = { strokeDasharray: '1 2', strokeDashoffset: 1 };   // gap > dash: no zero-length dot at the path end
          to = { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut', stagger: stagger != null ? stagger : .08 };
        } else {
          from = { scaleX: 0, opacity: 1 };
          to = { scaleX: 1, duration: 1.5, ease: 'expo.inOut' };
        }
        break;
      default: // 'up'
        from = { opacity: 0, y: 46 };
        to = { opacity: 1, y: 0, duration: 1.25, ease: 'expo.out' };
    }
    if (targets !== el && !(children && children.length) && rec.type !== 'draw') gsap.set(el, { opacity: 1 });
    if (children && children.length && to.stagger == null) to.stagger = stagger || .08;
    var final = Object.assign({}, to, common, {
      onComplete: function () { finishReveal(rec, targets); }
    });
    var tl = gsap.timeline({ paused: true, delay: delay });
    tl.fromTo(targets, from, Object.assign({}, final, { paused: false, delay: 0, onComplete: null }), 0);
    if (rec.inner) {
      tl.fromTo(rec.inner, { scale: 1.16 }, { scale: 1, duration: 1.9, ease: 'expo.out', clearProps: 'transform' }, .05);
    }
    tl.eventCallback('onComplete', final.onComplete);
    rec.tween = tl;
    var start = el.getAttribute('data-reveal-start') || 'top 88%';
    rec.st = ScrollTrigger.create({
      trigger: el,
      start: start,
      once: true,
      onEnter: function () { playReveal(rec); }
    });
    // already scrolled past (restored position): reveal right away
    if (rec.st && rec.st.scroll && rec.st.scroll() >= rec.st.start) playReveal(rec);
  }

  function setupParallax(el) {
    if (el.__benmParallax || REDUCED) return;
    el.__benmParallax = true;
    var amt = clamp(parseFloat(el.getAttribute('data-parallax')) || .12, -.5, .5);
    var wrap = el.parentElement || el;
    gsap.fromTo(el, { yPercent: -amt * 50, scale: 1 + Math.abs(amt) }, {
      yPercent: amt * 50, ease: 'none',
      scrollTrigger: { trigger: wrap, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  }

  function setupMagnetic(el) {
    if (el.__benmMagnetic || REDUCED || !FINE_POINTER) return;
    el.__benmMagnetic = true;
    var strength = parseFloat(el.getAttribute('data-magnetic')) || .32;
    var xTo = gsap.quickTo(el, 'x', { duration: .8, ease: 'power3.out' });
    var yTo = gsap.quickTo(el, 'y', { duration: .8, ease: 'power3.out' });
    var rect = null;
    el.addEventListener('pointerenter', function () { rect = el.getBoundingClientRect(); });
    el.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      if (!rect) rect = el.getBoundingClientRect();
      xTo((e.clientX - (rect.left + rect.width / 2)) * strength);
      yTo((e.clientY - (rect.top + rect.height / 2)) * strength);
    });
    el.addEventListener('pointerleave', function () { rect = null; xTo(0); yTo(0); });
  }

  /** Marquee: velocity-reactive, RTL-aware, paused off-screen. */
  function setupMarquee(el) {
    if (el.__benmMarquee) return;
    var track = $('.c-marquee__track', el) || el;
    var groupEl = d.createElement('div');
    groupEl.className = 'c-marquee__group';
    while (track.firstChild) groupEl.appendChild(track.firstChild);
    track.appendChild(groupEl);
    el.__benmMarquee = { group: groupEl };
    if (REDUCED) return;
    var speed = parseFloat(el.getAttribute('data-marquee-speed')) || 1;
    var clones = [], width = 0, pos = 0, vel = 0, visible = true;
    function build() {
      clones.forEach(function (c) { c.remove(); });
      clones = [];
      width = groupEl.getBoundingClientRect().width;
      if (!width) return;
      var need = Math.ceil(el.clientWidth / width) + 1;
      for (var i = 0; i < need; i++) {
        var c = groupEl.cloneNode(true);
        c.setAttribute('aria-hidden', 'true');
        $$('[id]', c).forEach(function (x) { x.removeAttribute('id'); });
        $$('a, button', c).forEach(function (x) { x.setAttribute('tabindex', '-1'); });
        track.appendChild(c);
        clones.push(c);
      }
    }
    build();
    if (w.ResizeObserver) new ResizeObserver(debounce(build, 160)).observe(groupEl);
    if (w.IntersectionObserver) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }).observe(el);
    gsap.ticker.add(function (time, dt) {
      if (!visible || !width) return;
      var v = lenis ? lenis.velocity : 0;
      vel += (v - vel) * .08;
      pos += (40 * speed + vel * 7) * Math.min(dt, 64) / 1000;
      pos = ((pos % width) + width) % width;
      track.style.transform = 'translate3d(' + (isRTL() ? pos : -pos).toFixed(2) + 'px,0,0)';
    });
  }

  function setupCounter(el) {
    if (el.__benmCount) return;
    var to = parseFloat(el.getAttribute('data-count-to')) || 0;
    var from = parseFloat(el.getAttribute('data-count-from')) || 0;
    var padLen = parseInt(el.getAttribute('data-count-pad'), 10) || 0;
    var dur = parseFloat(el.getAttribute('data-count-duration')) || 1.8;
    var dec = (String(el.getAttribute('data-count-to')).split('.')[1] || '').length;
    var state = { v: REDUCED ? to : from };
    var fmt = function () { el.textContent = num(pad(state.v.toFixed(dec), padLen)); };
    el.__benmCount = { fmt: fmt };
    fmt();
    if (REDUCED) return;
    var tw = gsap.to(state, { v: to, duration: dur, ease: 'power2.out', paused: true, onUpdate: fmt });
    var rec = { el: el, tween: tw, played: false };
    ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: function () { playReveal(rec); } });
  }

  /** BENM.reveal(root) — scan every declarative attribute under root (call after rendering). */
  function reveal(root) {
    root = root || d;
    scan('[data-split]', root).forEach(function (el) {
      if (!el.__benmSplit && !el.hasAttribute('data-reveal')) split(el, el.getAttribute('data-split'));
    });
    if (!HAS_GSAP) {
      scan('[data-reveal]', root).forEach(function (el) { el.classList.add('is-revealed'); });
      scan('[data-marquee]', root).forEach(setupMarquee);
      scan('[data-count-to]', root).forEach(function (el) { el.textContent = num(el.getAttribute('data-count-to')); });
      return;
    }
    scan('[data-reveal]', root).forEach(function (el) { tryCall(setupReveal, el); });
    scan('[data-parallax]', root).forEach(function (el) { tryCall(setupParallax, el); });
    scan('[data-magnetic]', root).forEach(function (el) { tryCall(setupMagnetic, el); });
    scan('[data-marquee]', root).forEach(function (el) { tryCall(setupMarquee, el); });
    scan('[data-count-to]', root).forEach(function (el) { tryCall(setupCounter, el); });
    scan('.c-accordion', root).forEach(initAccordion);
    if (booted) refresh();
  }

  /* ===========================================================================
     14. Header — theme, solid after 40px, hides on scroll down
     ======================================================================== */
  var header = null;
  function initHeader() {
    var el = $('#site-header');
    if (!el) return;
    var lastY = w.scrollY || 0, solid = null, hidden = false;
    function setHidden(v) {
      if (v === hidden) return;
      hidden = v;
      el.classList.toggle('is-hidden', v);
    }
    function update() {
      var y = w.scrollY || html.scrollTop || 0;
      var s = y > 40;
      if (s !== solid) { solid = s; el.classList.toggle('is-solid', s); }
      var dy = y - lastY;
      if (Math.abs(dy) > 6) {
        setHidden(dy > 0 && y > 180 && !layers.length && !el.querySelector(':focus-visible'));
        lastY = y;
      }
      if (y < 10) setHidden(false);
    }
    w.addEventListener('scroll', update, { passive: true });
    el.addEventListener('focusin', function () { setHidden(false); });
    update();
    header = {
      el: el,
      show: function () { setHidden(false); },
      hide: function () { setHidden(true); },
      setTheme: function (theme) { el.setAttribute('data-theme', theme === 'light' ? 'light' : 'dark'); },
      update: update
    };
    BENM.header = header;
  }

  function renderCounts(bump) {
    var c = cart.count(), s = wishlist.count();
    function set(sel, n, doBump) {
      $$(sel).forEach(function (el) {
        el.textContent = num(n);
        el.classList.toggle('is-empty', !n);
        if (doBump && n && !REDUCED) { el.classList.remove('is-bump'); void el.offsetWidth; el.classList.add('is-bump'); }
      });
    }
    set('[data-count="cart"]', c, bump === 'cart');
    set('[data-count="wishlist"]', s, bump === 'wishlist');
    $$('[data-count-text="cart"]').forEach(function (el) { el.textContent = num(c); });
    $$('[data-count-text="wishlist"]').forEach(function (el) { el.textContent = num(s); });
    $$('.c-header [data-open-drawer="bag"]').forEach(function (b) { b.setAttribute('aria-label', t('header.bagCount', { n: c })); });
    $$('.c-header [data-open-drawer="saved"]').forEach(function (b) { b.setAttribute('aria-label', t('header.savedCount', { n: s })); });
  }

  /* ===========================================================================
     15. Menu overlay
     ======================================================================== */
  var menu = { open: function () {}, close: function () {}, toggle: function () {}, isOpen: function () { return false; } };
  function initMenu() {
    var root = $('#site-menu'), toggle = $('[data-menu-toggle]');
    if (!root || !toggle) return;
    var labelEl = $('[data-menu-label]', toggle);
    var open = false, tl = null, layer = null, active = 0;
    var links = $$('.c-menu__link', root);
    var imgs = $$('[data-menu-img]', root);
    var capTitle = $('[data-menu-cap-title]', root), capText = $('[data-menu-cap-text]', root);
    var items = (w.BENM_LAYOUT && w.BENM_LAYOUT.menu) || [];

    function setToggleText() {
      var k = open ? 'header.close' : 'header.menu';
      if (labelEl) { labelEl.setAttribute('data-i18n', k); labelEl.textContent = t(k); }
      toggle.setAttribute('aria-label', t(open ? 'a11y.closeMenu' : 'a11y.openMenu'));
    }
    function caption(i) {
      var item = items[i];
      if (!item) return;
      var cat = item.cat && category(item.cat);
      if (capTitle) { capTitle.setAttribute('data-i18n', item.key); capTitle.textContent = t(item.key); }
      if (capText) {
        if (cat) { capText.removeAttribute('data-i18n'); capText.textContent = loc(cat.tagline); }
        else { capText.setAttribute('data-i18n', item.cap); capText.textContent = t(item.cap); }
      }
    }
    function preview(i) {
      if (i === active || !imgs[i]) return;
      var prev = imgs[active];
      active = i;
      caption(i);
      imgs.forEach(function (im, k) { im.style.zIndex = k === i ? 2 : (im === prev ? 1 : 0); });
      imgs[i].classList.add('is-active');
      if (REDUCED) { if (prev) prev.classList.remove('is-active'); return; }
      gsap.killTweensOf(imgs[i]);
      gsap.fromTo(imgs[i], { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.14 }, {
        clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.1, ease: 'expo.out',
        onComplete: function () { imgs.forEach(function (im, k) { if (k !== active) im.classList.remove('is-active'); }); }
      });
      if (capTitle) gsap.fromTo([capTitle, capText], { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .7, ease: 'expo.out', stagger: .05 });
    }
    links.forEach(function (a) {
      var i = +a.getAttribute('data-menu-index');
      a.addEventListener('pointerenter', function () { preview(i); });
      a.addEventListener('focus', function () { preview(i); });
    });

    function doOpen() {
      if (open) return;
      closeLayers('menu', true);
      open = true;
      root.hidden = false;
      html.classList.add('is-menu-open');
      toggle.setAttribute('aria-expanded', 'true');
      setToggleText();
      if (header) header.show();
      layer = pushLayer({ name: 'menu', el: root, extra: [toggle], close: doClose });
      if (tl) tl.kill();
      var labels = $$('.c-menu__label', root);
      if (!REDUCED) {
        tl = gsap.timeline()
          .fromTo(root, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: .95, ease: 'power3.inOut' })
          .fromTo(labels, { yPercent: 115 }, { yPercent: 0, duration: 1.15, ease: 'expo.out', stagger: .055 }, .36)
          .fromTo($$('.c-menu__num, .c-menu__group-label', root), { opacity: 0 }, { opacity: 1, duration: .9, stagger: .03 }, .5)
          .fromTo($$('.c-menu__figure', root), { opacity: 0, y: 34 }, { opacity: 1, y: 0, duration: 1.3, ease: 'expo.out' }, .45)
          .fromTo($('.c-menu__foot', root), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1, ease: 'expo.out' }, .7);
      }
      setTimeout(function () { if (open) focusEl(links[0]); }, REDUCED ? 0 : 450);
    }
    function doClose(o) {
      o = o || {};
      if (!open) return;
      open = false;
      toggle.setAttribute('aria-expanded', 'false');
      setToggleText();
      popLayer(layer, { noRestore: o.noRestore });
      if (!o.noRestore) focusEl(toggle);
      var finish = function () {
        root.hidden = true;
        html.classList.remove('is-menu-open');
        gsap && gsap.set($$('.c-menu__label, .c-menu__figure, .c-menu__foot, .c-menu__num, .c-menu__group-label', root).concat([root]), { clearProps: 'all' });
      };
      if (tl) tl.kill();
      if (REDUCED || o.immediate) { finish(); return; }
      tl = gsap.timeline({ onComplete: finish })
        .to($$('.c-menu__label', root), { yPercent: -115, duration: .45, ease: 'power3.in', stagger: .02 }, 0)
        .to($$('.c-menu__figure, .c-menu__foot, .c-menu__num, .c-menu__group-label', root), { opacity: 0, duration: .3 }, 0)
        .to(root, { clipPath: 'inset(0% 0% 100% 0%)', duration: .75, ease: 'power3.inOut' }, .2);
    }
    toggle.addEventListener('click', function () { if (open) doClose(); else doOpen(); });
    on('langchange', function () { setToggleText(); caption(active); });
    menu = { open: doOpen, close: doClose, toggle: function () { if (open) doClose(); else doOpen(); }, isOpen: function () { return open; } };
    BENM.menu = menu;
  }

  /* ===========================================================================
     16. Search overlay — live results from BENM_PRODUCTS (both languages)
     ======================================================================== */
  var searchUI = { open: function () {}, close: function () {} };
  function initSearch() {
    var root = $('#site-search'), toggle = $('[data-search-toggle]');
    if (!root) return;
    var panel = $('.c-search__panel', root), backdrop = $('.c-search__backdrop', root);
    var input = $('#site-search-input', root), form = $('[data-search-form]', root);
    var status = $('[data-search-status]', root), results = $('[data-search-results]', root);
    var open = false, layer = null, lastQ = '';

    function render(q) {
      q = (q || '').trim();
      lastQ = q;
      if (!q) { status.innerHTML = ''; results.innerHTML = ''; return; }
      var found = search(q);
      var href = url('shop.html?q=' + encodeURIComponent(q));
      if (!found.length) {
        status.innerHTML = '';
        results.innerHTML = '<div class="c-search__empty"><p class="c-search__empty-title"></p><p></p>' +
          '<a class="c-link" href="' + esc(url('shop.html')) + '" style="margin-top:18px">' + esc(t('search.browse')) + icon('arrow') + '</a></div>';
        $('.c-search__empty-title', results).textContent = t('search.none', { q: q });
        $('.c-search__empty p:not(.c-search__empty-title)', results).textContent = t('search.noneHint');
        return;
      }
      status.innerHTML = '<span>' + esc(t('search.count', { n: found.length })) + '</span>' +
        '<a class="c-link" href="' + esc(href) + '">' + esc(t('search.viewAll')) + icon('arrow') + '</a>';
      results.innerHTML = found.slice(0, 6).map(function (p) { return productCard(p, { variant: 'compact', heading: 'h3', eager: true }); }).join('');
      if (!REDUCED) gsap.fromTo(results.children, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .8, ease: 'expo.out', stagger: .045, clearProps: 'transform,opacity' });
    }
    var renderSoon = debounce(function () { render(input.value); }, 110);

    function doOpen() {
      if (open) return;
      closeLayers('search', true);
      open = true;
      root.hidden = false;
      if (toggle) toggle.setAttribute('aria-expanded', 'true');
      layer = pushLayer({ name: 'search', el: root, close: doClose });
      if (!REDUCED) {
        gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: .5 });
        gsap.fromTo(panel, { yPercent: -100 }, { yPercent: 0, duration: .9, ease: 'expo.out' });
        gsap.fromTo($$('.c-search__top, .c-search__form, .c-search__suggest', root), { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: .07, delay: .18, clearProps: 'transform,opacity' });
      }
      setTimeout(function () { focusEl(input); }, REDUCED ? 0 : 120);
    }
    function doClose(o) {
      o = o || {};
      if (!open) return;
      open = false;
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
      popLayer(layer, { noRestore: o.noRestore });
      var finish = function () { root.hidden = true; gsap && gsap.set([panel, backdrop], { clearProps: 'all' }); };
      if (REDUCED || o.immediate) { finish(); return; }
      gsap.to(backdrop, { opacity: 0, duration: .45, ease: 'power2.in' });
      gsap.to(panel, { yPercent: -100, duration: .6, ease: 'power3.in', onComplete: finish });
    }
    if (toggle) toggle.addEventListener('click', function () { if (open) doClose(); else doOpen(); });
    root.addEventListener('click', function (e) {
      if (e.target.closest('[data-search-close]')) { doClose(); return; }
      var chip = e.target.closest('[data-search-suggest]');
      if (chip) { input.value = chip.textContent.trim(); render(input.value); focusEl(input); }
    });
    input.addEventListener('input', renderSoon);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var q = input.value.trim();
      if (!q) { focusEl(input); return; }
      go(url('shop.html?q=' + encodeURIComponent(q)));
    });
    on('langchange', function () { if (open && lastQ) render(lastQ); });
    searchUI = { open: doOpen, close: doClose, isOpen: function () { return open; }, render: render };
    BENM.searchUI = searchUI;
  }

  /* ===========================================================================
     17. Drawer — bag & saved
     ======================================================================== */
  var drawer = { open: function () {}, close: function () {} };
  function initDrawer() {
    var root = $('#site-drawer');
    if (!root) return;
    var panel = $('.c-drawer__panel', root), backdrop = $('.c-drawer__backdrop', root);
    var panes = { bag: $('[data-drawer-pane="bag"]', root), saved: $('[data-drawer-pane="saved"]', root) };
    var tabs = $$('[data-drawer-tab]', root);
    var foot = $('[data-drawer-foot]', root);
    var open = false, layer = null, tab = 'bag';

    function emptyState(kind) {
      return '<div class="c-empty">' +
        '<span class="c-empty__mark">' + (w.BENM_BRAND ? w.BENM_BRAND.svg('monogram', { decorative: true }) : '') + '</span>' +
        '<p class="c-empty__title" data-i18n="' + (kind === 'bag' ? 'drawer.emptyBag' : 'drawer.emptySaved') + '">' + esc(t(kind === 'bag' ? 'drawer.emptyBag' : 'drawer.emptySaved')) + '</p>' +
        '<p class="c-empty__text" data-i18n="' + (kind === 'bag' ? 'drawer.emptyBagText' : 'drawer.emptySavedText') + '">' + esc(t(kind === 'bag' ? 'drawer.emptyBagText' : 'drawer.emptySavedText')) + '</p>' +
        '<a class="c-btn c-btn--ghost c-btn--sm" href="' + esc(url('shop.html')) + '"><span class="c-btn__label"><span data-i18n="drawer.discover">' + esc(t('drawer.discover')) + '</span></span></a>' +
      '</div>';
    }
    function thumb(p) {
      return '<a class="c-line__thumb" href="' + esc(productUrl(p.id)) + '" tabindex="-1" aria-hidden="true">' +
        '<img src="' + esc(url(p.images[0])) + '" alt="" width="1200" height="1500" loading="lazy" decoding="async"></a>';
    }
    function renderBag() {
      var items = cart.items();
      if (!items.length) { panes.bag.innerHTML = emptyState('bag'); return; }
      panes.bag.innerHTML = items.map(function (it) {
        var p = it.product, name = loc(p.name);
        var size = it.size == null ? (isOneSize(p) ? t('drawer.oneSize') : '—') : num(it.size);
        var meta = t('drawer.meta', { color: it.color ? loc(it.color.name) : '', size: size });
        return '<article class="c-line" data-line="' + esc(it.key) + '">' + thumb(p) +
          '<div class="c-line__info"><a class="c-line__name" href="' + esc(productUrl(p.id)) + '">' + esc(name) + '</a>' +
            '<p class="c-line__meta">' + esc(meta) + '</p>' +
            (it.options && it.options.summary ? '<p class="c-line__meta">' + esc(loc(it.options.summary)) + '</p>' : '') + '</div>' +
          '<p class="c-line__price c-price" data-price="' + it.lineTotal + '">' + esc(price(it.lineTotal)) + '</p>' +
          '<div class="c-line__actions">' +
            '<div class="c-qty" role="group" aria-label="' + esc(t('drawer.qty') + ' — ' + name) + '">' +
              '<button class="c-qty__btn" type="button" data-line-step="-1" aria-label="' + esc(t('drawer.decrease')) + '"' + (it.qty <= 1 ? ' disabled' : '') + '>' + icon('minus') + '</button>' +
              '<span class="c-qty__value" aria-live="polite">' + num(it.qty) + '</span>' +
              '<button class="c-qty__btn" type="button" data-line-step="1" aria-label="' + esc(t('drawer.increase')) + '"' + (it.qty >= MAX_QTY ? ' disabled' : '') + '>' + icon('plus') + '</button>' +
            '</div>' +
            '<button class="c-line__remove" type="button" data-line-remove aria-label="' + esc(t('drawer.removeItem', { name: name })) + '">' + esc(t('drawer.remove')) + '</button>' +
          '</div>' +
        '</article>';
      }).join('');
    }
    function renderSaved() {
      var items = wishlist.items();
      if (!items.length) { panes.saved.innerHTML = emptyState('saved'); return; }
      panes.saved.innerHTML = items.map(function (p) {
        var name = loc(p.name);
        return '<article class="c-line" data-saved="' + esc(p.id) + '">' + thumb(p) +
          '<div class="c-line__info"><a class="c-line__name" href="' + esc(productUrl(p.id)) + '">' + esc(name) + '</a>' +
            '<p class="c-line__meta">' + esc(loc(p.typeName)) + '</p></div>' +
          '<p class="c-line__price c-price" data-price="' + p.price + '">' + esc(price(p.price)) + '</p>' +
          '<div class="c-line__actions">' +
            '<button class="c-btn c-btn--ghost c-btn--sm" type="button" data-saved-add="' + esc(p.id) + '"><span class="c-btn__label"><span>' + esc(t(isOneSize(p) ? 'drawer.addToBag' : 'card.quickView')) + '</span></span></button>' +
            '<button class="c-line__remove" type="button" data-saved-remove="' + esc(p.id) + '" aria-label="' + esc(t('card.unsave', { name: name })) + '">' + esc(t('drawer.remove')) + '</button>' +
          '</div>' +
        '</article>';
      }).join('');
    }
    function renderFoot() {
      if (tab !== 'bag' || !cart.count()) { foot.hidden = true; foot.innerHTML = ''; return; }
      foot.hidden = false;
      var sub = cart.subtotal(), th = +CONFIG.freeShippingThreshold || 0;
      var ship = th > 0 ? '<div class="c-drawer__ship"><p>' + (sub >= th ? '<strong>' + esc(t('drawer.shipDone')) + '</strong>' : esc(t('drawer.shipAway', { amount: price(th - sub) }))) + '</p>' +
        '<div class="c-progress" role="presentation"><div class="c-progress__bar" style="--progress:' + Math.min(1, sub / th).toFixed(3) + '"></div></div></div>' : '';
      foot.innerHTML = ship +
        '<div class="c-drawer__total"><span class="c-drawer__total-label">' + esc(t('drawer.subtotal')) + '</span><span class="c-drawer__total-value c-price" data-price="' + sub + '">' + esc(price(sub)) + '</span></div>' +
        '<a class="c-btn c-btn--primary c-btn--block" href="' + esc(whatsappLink(orderMessage())) + '" target="_blank" rel="noopener" data-checkout>' + icon('whatsapp') +
          '<span class="c-btn__label"><span>' + esc(t('drawer.checkout')) + '</span></span></a>' +
        '<p class="c-drawer__note">' + esc(t('drawer.note')) + '</p>';
    }
    function render() {
      tryCall(renderBag);
      tryCall(renderSaved);
      tryCall(renderFoot);
    }
    function selectTab(name, focus) {
      tab = name === 'saved' ? 'saved' : 'bag';
      tabs.forEach(function (b) {
        var on = b.getAttribute('data-drawer-tab') === tab;
        b.setAttribute('aria-selected', String(on));
        b.setAttribute('tabindex', on ? '0' : '-1');
        if (on && focus) focusEl(b);
      });
      panes.bag.hidden = tab !== 'bag';
      panes.saved.hidden = tab !== 'saved';
      renderFoot();
    }
    function doOpen(name) {
      closeLayers('drawer', true);
      selectTab(name || tab);
      render();
      if (open) return;
      open = true;
      root.hidden = false;
      layer = pushLayer({ name: 'drawer', el: root, close: doClose });
      if (!REDUCED) {
        gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: .5 });
        gsap.fromTo(panel, { xPercent: isRTL() ? -100 : 100 }, { xPercent: 0, duration: .95, ease: 'expo.out' });
        gsap.fromTo($$('.c-line, .c-empty', panel), { opacity: 0, x: isRTL() ? -26 : 26 }, { opacity: 1, x: 0, duration: .9, ease: 'expo.out', stagger: .05, delay: .18, clearProps: 'transform,opacity' });
      }
      focusEl($('[data-drawer-tab][aria-selected="true"]', root) || panel);
    }
    function doClose(o) {
      o = o || {};
      if (!open) return;
      open = false;
      popLayer(layer, { noRestore: o.noRestore });
      var finish = function () { root.hidden = true; gsap && gsap.set([panel, backdrop], { clearProps: 'all' }); };
      if (REDUCED || o.immediate) { finish(); return; }
      gsap.to(backdrop, { opacity: 0, duration: .45, ease: 'power2.in' });
      gsap.to(panel, { xPercent: isRTL() ? -100 : 100, duration: .6, ease: 'power3.in', onComplete: finish });
    }

    root.addEventListener('click', function (e) {
      var tgt = e.target;
      if (tgt.closest('[data-drawer-close]')) { doClose(); return; }
      var tb = tgt.closest('[data-drawer-tab]');
      if (tb) { selectTab(tb.getAttribute('data-drawer-tab')); return; }
      var line = tgt.closest('[data-line]');
      var key = line && line.getAttribute('data-line');
      var step = tgt.closest('[data-line-step]');
      if (step && key) {
        var it = cart.get(key);
        if (it) cart.update(key, it.qty + (+step.getAttribute('data-line-step')));
        var again = $('[data-line="' + cssEsc(key) + '"] [data-line-step="' + step.getAttribute('data-line-step') + '"]', root);
        focusEl(again && !again.disabled ? again : $('[data-line="' + cssEsc(key) + '"] .c-qty__btn:not(:disabled)', root));
        return;
      }
      if (tgt.closest('[data-line-remove]') && key) {
        var removed = cart.get(key);
        var raw = removed && { key: removed.key, id: removed.id, color: removed.colorId, size: removed.size, qty: removed.qty, options: removed.options, added: Date.now() };
        cart.remove(key);
        focusEl($('.c-line__remove', root) || $('[data-drawer-tab][aria-selected="true"]', root));
        if (removed) toast(t('toast.removed', { name: loc(removed.product.name) }), { icon: 'bag', action: { label: t('toast.undo'), onClick: function () { cart.restore(raw); } } });
        return;
      }
      var sAdd = tgt.closest('[data-saved-add]');
      if (sAdd) {
        var id = sAdd.getAttribute('data-saved-add'), p = findProduct(id);
        if (!p) return;
        if (isOneSize(p)) addToBag(id, {}, null);
        else { doClose({ immediate: true, noRestore: true }); quickView(id); }
        return;
      }
      var sRem = tgt.closest('[data-saved-remove]');
      if (sRem) { wishlist.remove(sRem.getAttribute('data-saved-remove')); focusEl($('[data-saved-remove]', root) || $('[data-drawer-tab][aria-selected="true"]', root)); }
    });
    // arrow keys between the two tabs
    $('.c-tabs', root).addEventListener('keydown', function (e) {
      if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].indexOf(e.key) < 0) return;
      e.preventDefault();
      selectTab(tab === 'bag' ? 'saved' : 'bag', true);
    });
    on('cart', function () { if (open) render(); });
    on('wishlist', function () { if (open) render(); });
    on('langchange', function () { render(); });
    on('currencychange', function () { if (open) renderFoot(); });
    drawer = { open: doOpen, close: doClose, isOpen: function () { return open; }, render: render };
  }
  function cssEsc(s) { return w.CSS && CSS.escape ? CSS.escape(s) : String(s).replace(/["\\]/g, '\\$&'); }
  function openDrawer(tab) { drawer.open(tab); }
  function closeDrawer() { drawer.close(); }

  /* ===========================================================================
     18. Custom cursor (pointer: fine only)
     ======================================================================== */
  function initCursor() {
    var c = $('.c-cursor');
    if (!c || REDUCED || !FINE_POINTER) return;
    html.classList.add('has-cursor');
    var dot = $('.c-cursor__dot', c), ring = $('.c-cursor__ring', c), label = $('.c-cursor__label', c);
    var dx = gsap.quickTo(dot, 'x', { duration: .12, ease: 'power3' }), dy = gsap.quickTo(dot, 'y', { duration: .12, ease: 'power3' });
    var rx = gsap.quickTo(ring, 'x', { duration: .55, ease: 'power3' }), ry = gsap.quickTo(ring, 'y', { duration: .55, ease: 'power3' });
    var mode = '', labelKey = '', seen = false;
    c.classList.add('is-hidden');
    function setMode(m, key) {
      if (m === mode && key === labelKey) return;
      mode = m;
      labelKey = key || '';
      c.classList.toggle('is-link', m === 'link');
      c.classList.toggle('is-label', m === 'label');
      c.classList.toggle('is-hidden', m === 'hidden');
      if (m === 'label') label.textContent = t(labelKey);
    }
    w.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      if (!seen) { seen = true; gsap.set([dot, ring], { x: e.clientX, y: e.clientY }); if (mode !== 'hidden') c.classList.remove('is-hidden'); }
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
    }, { passive: true });
    d.addEventListener('pointerover', function (e) {
      if (e.pointerType !== 'mouse') return;
      var tg = e.target;
      if (!tg || !tg.closest) return;
      var lab = tg.closest('[data-cursor-label]');
      if (tg.closest('input, textarea, select, iframe, [contenteditable="true"]')) setMode('hidden');
      else if (lab) setMode('label', lab.getAttribute('data-cursor-label'));
      else if (tg.closest('a, button, [role="button"], [role="tab"], label, summary, [data-cursor]')) setMode('link');
      else setMode('');
    });
    d.documentElement.addEventListener('mouseleave', function () { c.classList.add('is-hidden'); });
    d.documentElement.addEventListener('mouseenter', function () { if (mode !== 'hidden') c.classList.remove('is-hidden'); });
    w.addEventListener('pointerdown', function () { c.classList.add('is-down'); });
    w.addEventListener('pointerup', function () { c.classList.remove('is-down'); });
    on('langchange', function () { if (mode === 'label') label.textContent = t(labelKey); });
  }

  /* ===========================================================================
     19. Accordions · tabs · selectable groups · qty steppers · forms
     ======================================================================== */
  function initAccordion(acc) {
    if (acc.__benmAcc) return;
    acc.__benmAcc = true;
    $$('.c-accordion__item', acc).forEach(function (item) {
      var btn = $('.c-accordion__trigger', item), panelEl = $('.c-accordion__panel', item);
      if (!btn || !panelEl) return;
      if (!panelEl.id) panelEl.id = uid('acc');
      if (!btn.id) btn.id = panelEl.id + '-btn';
      btn.setAttribute('aria-controls', panelEl.id);
      panelEl.setAttribute('role', 'region');
      panelEl.setAttribute('aria-labelledby', btn.id);
      btn.setAttribute('aria-expanded', String(item.classList.contains('is-open')));
    });
  }
  function toggleAccordion(btn) {
    var item = btn.closest('.c-accordion__item'), acc = btn.closest('.c-accordion');
    if (!item) return;
    var openIt = !item.classList.contains('is-open');
    if (openIt && acc && acc.getAttribute('data-accordion') === 'single') {
      $$('.c-accordion__item.is-open', acc).forEach(function (o) {
        if (o === item) return;
        o.classList.remove('is-open');
        var b = $('.c-accordion__trigger', o);
        if (b) b.setAttribute('aria-expanded', 'false');
      });
    }
    item.classList.toggle('is-open', openIt);
    btn.setAttribute('aria-expanded', String(openIt));
    setTimeout(refresh, 700);
    emit('accordion', { item: item, open: openIt });
  }

  // generic tabs: <div data-tabs><div role="tablist"><button role="tab" aria-controls>…</div><div role="tabpanel" id>…
  function selectTabIn(tabEl) {
    var list = tabEl.closest('[role="tablist"]');
    if (!list) return;
    $$('[role="tab"]', list).forEach(function (tb) {
      var on = tb === tabEl;
      tb.setAttribute('aria-selected', String(on));
      tb.setAttribute('tabindex', on ? '0' : '-1');
      var pnl = d.getElementById(tb.getAttribute('aria-controls'));
      if (pnl) pnl.hidden = !on;
    });
    emit('tab', { tab: tabEl });
    refresh();
  }

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var PHONE_RE = /^\+?[\d\s().-]{7,20}$/;
  function fieldMsg(input) {
    var host = input.closest('.c-field, .c-check-field, .c-check') || input.parentElement;
    var msg = host && ($('.c-field__msg', host) || (host.nextElementSibling && host.nextElementSibling.classList.contains('c-field__msg') ? host.nextElementSibling : null));
    return { host: host, msg: msg };
  }
  /** Validate one input; shows a localised message. Returns true when valid. */
  function validateField(input) {
    var v = input.type === 'checkbox' || input.type === 'radio' ? input.checked : String(input.value || '').trim();
    var key = null, vars = null;
    if (input.required && !v) key = input.type === 'checkbox' ? 'form.error.consent' : 'form.error.required';
    else if (v && input.type === 'email' && !EMAIL_RE.test(v)) key = 'form.error.email';
    else if (v && input.type === 'tel' && !PHONE_RE.test(v)) key = 'form.error.phone';
    else if (v && input.minLength > 0 && v.length < input.minLength) { key = 'form.error.min'; vars = { n: input.minLength }; }
    var f = fieldMsg(input);
    if (f.host) { f.host.classList.toggle('is-invalid', !!key); f.host.classList.toggle('is-valid', !key && !!v); }
    input.setAttribute('aria-invalid', String(!!key));
    if (f.msg) {
      if (!f.msg.id) f.msg.id = uid('msg');
      input.setAttribute('aria-describedby', f.msg.id);
      if (key) {
        f.msg.setAttribute('data-i18n', key);
        if (vars) f.msg.setAttribute('data-i18n-vars', JSON.stringify(vars)); else f.msg.removeAttribute('data-i18n-vars');
        f.msg.textContent = t(key, vars);
      } else {
        f.msg.removeAttribute('data-i18n');
        f.msg.textContent = '';
      }
    }
    return !key;
  }
  /** BENM.validate(form) → true when every field passes (first invalid field is focused). */
  function validate(form) {
    form.__benmTried = true;
    var ok = true, firstBad = null;
    $$('input, select, textarea', form).forEach(function (el) {
      if (el.type === 'hidden' || el.type === 'submit' || el.disabled) return;
      if (!validateField(el)) { ok = false; if (!firstBad) firstBad = el; }
    });
    if (firstBad) focusEl(firstBad);
    return ok;
  }
  function formData(form) {
    var out = {};
    try { new FormData(form).forEach(function (v, k) { out[k] = v; }); } catch (e) { /* old engines */ }
    return out;
  }
  function successPanel(titleKey, textKey) {
    var el = d.createElement('div');
    el.className = 'c-form-success';
    el.setAttribute('tabindex', '-1');
    el.setAttribute('role', 'status');
    el.innerHTML = '<p class="c-form-success__title">' + icon('check') + '<span data-i18n="' + titleKey + '">' + esc(t(titleKey)) + '</span></p>' +
      '<p data-i18n="' + textKey + '">' + esc(t(textKey)) + '</p>';
    return el;
  }
  function onSubmit(e) {
    var form = e.target;
    if (!form || form.nodeName !== 'FORM') return;
    var news = form.hasAttribute('data-newsletter');
    if (!news && !form.hasAttribute('data-validate')) return;
    e.preventDefault();
    if (!validate(form)) return;
    var data = formData(form);
    var next = form.nextElementSibling;
    var success = $('[data-form-success]', form.parentElement) || (next && next.hasAttribute('data-form-success') ? next : null);
    if (news && !success) {
      success = successPanel('form.success.title', 'form.success.newsletter');
      form.parentNode.insertBefore(success, form.nextSibling);
    }
    if (success) {
      form.hidden = true;
      success.hidden = false;
      if (!REDUCED) gsap.fromTo(success, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .9, ease: 'expo.out', clearProps: 'all' });
      if (!success.hasAttribute('tabindex')) success.setAttribute('tabindex', '-1');
      focusEl(success);
    } else toast(t('form.success.title'));
    form.dispatchEvent(new CustomEvent('benm:submit', { bubbles: true, detail: { data: data } }));
    emit('formsubmit', { form: form, data: data, newsletter: news });
    refresh();
  }

  /* ===========================================================================
     20. Page transitions — curtain cover (≤600ms) → navigate → next page uncovers
     ======================================================================== */
  var curtain = null, navigating = false;
  /** BENM.go(href) — navigate with the curtain. */
  function go(href) {
    if (navigating) return;
    navigating = true;
    if (REDUCED || !curtain || !HAS_GSAP) { w.location.href = href; return; }
    store.set('benm:transition', '1', true);
    var panel = $('.c-curtain__panel', curtain), mark = $('.c-curtain__mark', curtain);
    curtain.classList.add('is-active');
    var leave = function () { w.location.href = href; };
    gsap.timeline({ onComplete: leave })
      .fromTo(panel, { yPercent: 100 }, { yPercent: 0, duration: .58, ease: 'power3.inOut' })
      .fromTo(mark, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .35, ease: 'power2.out' }, .3);
  }
  function isTransitionLink(a, e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
    if ((a.target && a.target !== '_self') || a.hasAttribute('download') || a.hasAttribute('data-no-transition')) return false;
    var raw = a.getAttribute('href');
    if (!raw || raw.charAt(0) === '#' || /^(mailto|tel|javascript|data):/i.test(raw)) return false;
    var u;
    try { u = new URL(a.href, w.location.href); } catch (err) { return false; }
    if (u.protocol !== w.location.protocol) return false;
    if (u.protocol !== 'file:' && u.host !== w.location.host) return false;
    if (!/\.html?$/i.test(u.pathname)) return false;
    if (u.pathname === w.location.pathname && u.search === w.location.search && u.hash) return false;
    return true;
  }
  function curtainOut(done) {
    var covered = html.classList.contains('is-transitioning');
    store.del('benm:transition', true);
    if (!covered) { done(); return; }
    if (REDUCED || !curtain) { html.classList.remove('is-transitioning'); done(); return; }
    var panel = $('.c-curtain__panel', curtain), mark = $('.c-curtain__mark', curtain);
    curtain.classList.add('is-active');
    gsap.set(panel, { yPercent: 0 });
    gsap.set(mark, { opacity: 1, y: 0 });
    html.classList.remove('is-transitioning');
    gsap.timeline({ onComplete: function () { curtain.classList.remove('is-active'); } })
      .to(mark, { opacity: 0, y: -12, duration: .3, ease: 'power2.in' }, .05)
      .to(panel, { yPercent: -100, duration: .8, ease: 'power3.inOut' }, .2)
      .add(done, .45);
  }
  // back/forward cache: the page comes back exactly as we left it (covered)
  w.addEventListener('pageshow', function (e) {
    if (!e.persisted) return;
    navigating = false;
    store.del('benm:transition', true);
    html.classList.remove('is-transitioning');
    closeLayers(null, true);
    if (curtain) {
      var panel = $('.c-curtain__panel', curtain);
      if (REDUCED || !HAS_GSAP) { curtain.classList.remove('is-active'); return; }
      gsap.to(panel, { yPercent: -100, duration: .7, ease: 'power3.inOut', onComplete: function () { curtain.classList.remove('is-active'); } });
    }
  });

  /* ===========================================================================
     21. Preloader — wordmark stroke-draw → gold-foil fill + sheen → counter → lift
     ======================================================================== */
  function runPreloader(done) {
    var pl = $('.c-preloader');
    store.set('benm:visited', '1', true);
    html.classList.remove('is-preloading');
    if (!pl) { done(); return; }
    var finish = function () { pl.remove(); if (lenis) lenis.start(); };
    var fill = $('.c-preloader__fill', pl), strokes = $$('.c-preloader__stroke path', pl);
    var count = $('.c-preloader__count', pl);
    if (REDUCED) {                                      // short fade (WAAPI ignores the CSS kill-switch)
      if (fill) fill.setAttribute('opacity', '1');
      strokes.forEach(function (s) { s.style.display = 'none'; });
      if (count) count.textContent = num('100');
      setTimeout(function () {
        done();
        if (pl.animate) pl.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 450, easing: 'ease', fill: 'forwards' }).onfinish = finish;
        else finish();
      }, 650);
      return;
    }
    if (lenis) lenis.stop();
    var counter = { v: 0 };
    var sheen = $('#benm-pl-sheen', pl);
    var tl = gsap.timeline({ onComplete: finish });
    tl.from($('.c-preloader__frame', pl), { opacity: 0, scale: 1.015, duration: 1, ease: 'power2.out' }, 0)
      .to(strokes, { strokeDashoffset: 0, duration: 1.05, ease: 'power2.inOut', stagger: .11 }, .08)
      .to(fill, { attr: { opacity: 1 }, duration: .55, ease: 'power2.out' }, .98)
      .to(strokes, { opacity: 0, duration: .45, ease: 'power1.out' }, 1.2)
      .from($$('.c-preloader__tag, .c-preloader__taglines .c-diamond', pl), { opacity: 0, y: 14, duration: .8, ease: 'expo.out', stagger: .09 }, 1.02)
      .to($('.c-preloader__line i', pl), { scaleX: 1, duration: 1.65, ease: 'power2.inOut' }, 0)
      .to(counter, { v: 100, duration: 1.65, ease: 'power2.inOut', onUpdate: function () { if (count) count.textContent = num(pad(Math.round(counter.v), 3)); } }, 0)
      .addLabel('lift', 1.8)
      .to($('.c-preloader__inner', pl), { yPercent: -30, opacity: 0, duration: .62, ease: 'power3.in' }, 'lift')
      .to($$('.c-preloader__foot, .c-preloader__frame', pl), { opacity: 0, duration: .3 }, 'lift')
      .to(pl, { yPercent: -100, duration: .78, ease: 'power3.inOut' }, 'lift-=.02')
      .add(done, 'lift+=.22');
    if (sheen) tl.fromTo(sheen, { attr: { x1: -420, x2: -120 } }, { attr: { x1: 1120, x2: 1420 }, duration: .95, ease: 'power2.inOut' }, 1.18);
  }

  /* ===========================================================================
     22. Document-level delegation — one click handler for the whole site
     ======================================================================== */
  function onDocClick(e) {
    var tg = e.target;
    if (!tg || !tg.closest) return;

    var btn;
    if ((btn = tg.closest('[data-set-lang]'))) { setLang(btn.getAttribute('data-set-lang')); return; }
    if ((btn = tg.closest('[data-set-currency]'))) { setCurrency(btn.getAttribute('data-set-currency')); return; }
    if ((btn = tg.closest('[data-open-drawer]'))) { e.preventDefault(); openDrawer(btn.getAttribute('data-open-drawer')); return; }
    if ((btn = tg.closest('[data-wish]'))) {
      var wid = btn.getAttribute('data-wish'), wp = findProduct(wid);
      if (!wp) return;
      var now = wishlist.toggle(wid);
      toast(t(now ? 'toast.saved' : 'toast.unsaved', { name: loc(wp.name) }), {
        icon: now ? 'heart-fill' : 'heart',
        action: now ? { label: t('toast.viewSaved'), onClick: function () { openDrawer('saved'); } } : null
      });
      return;
    }
    if ((btn = tg.closest('[data-quick-add]'))) {
      var qid = btn.getAttribute('data-quick-add'), qp = findProduct(qid);
      if (!qp) return;
      if (isOneSize(qp)) addToBag(qid, {}, btn.closest('[data-product-id]'));
      else quickView(qid);
      return;
    }
    if ((btn = tg.closest('[data-quick-view]'))) { quickView(btn.getAttribute('data-quick-view')); return; }
    if ((btn = tg.closest('[data-add-to-bag]'))) {
      addToBag(btn.getAttribute('data-add-to-bag'), {
        color: btn.getAttribute('data-color'), size: btn.getAttribute('data-size'), qty: btn.getAttribute('data-qty') || 1
      }, btn.closest('[data-product-id]'));
      return;
    }
    if ((btn = tg.closest('.c-accordion__trigger'))) { toggleAccordion(btn); return; }
    if ((btn = tg.closest('[data-tabs] [role="tab"]'))) { selectTabIn(btn); return; }
    if ((btn = tg.closest('[data-select] [aria-pressed]'))) {
      var grp = btn.closest('[data-select]');
      if (grp.getAttribute('data-select') === 'single') $$('[aria-pressed]', grp).forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      else btn.setAttribute('aria-pressed', String(btn.getAttribute('aria-pressed') !== 'true'));
      grp.dispatchEvent(new CustomEvent('benm:select', { bubbles: true, detail: { values: $$('[aria-pressed="true"]', grp).map(function (b) { return b.getAttribute('data-value') || b.textContent.trim(); }) } }));
      return;
    }
    if ((btn = tg.closest('.c-qty[data-qty] [data-qty-step]'))) {
      var q = btn.closest('.c-qty'), val = $('.c-qty__value', q);
      var min = parseInt(q.getAttribute('data-min'), 10) || 1, max = parseInt(q.getAttribute('data-max'), 10) || MAX_QTY;
      var cur = clamp((parseInt(q.getAttribute('data-value'), 10) || min) + (+btn.getAttribute('data-qty-step')), min, max);
      q.setAttribute('data-value', cur);
      if (val) val.textContent = num(cur);
      $$('[data-qty-step]', q).forEach(function (b) { var s = +b.getAttribute('data-qty-step'); b.disabled = s < 0 ? cur <= min : cur >= max; });
      q.dispatchEvent(new CustomEvent('benm:qty', { bubbles: true, detail: { value: cur } }));
      return;
    }

    var a = tg.closest('a[href]');
    if (!a) return;
    if (a.hasAttribute('data-scroll-top')) {
      e.preventDefault();
      scrollTo(0);
      var mainEl = $('#main');
      if (mainEl) { if (!mainEl.hasAttribute('tabindex')) mainEl.setAttribute('tabindex', '-1'); focusEl(mainEl); }
      return;
    }
    // same-page anchors → smooth scroll
    var href = a.getAttribute('href') || '';
    if (href.indexOf('#') > -1 && !e.defaultPrevented && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
      var u = null;
      try { u = new URL(a.href, w.location.href); } catch (err) { u = null; }
      if (u && u.pathname === w.location.pathname && u.search === w.location.search) {
        var id = decodeURIComponent(u.hash.slice(1));
        var target = id ? d.getElementById(id) : null;
        if (!id || target) {
          e.preventDefault();
          if (layers.length) closeLayers(null, true);
          if (!target) { scrollTo(0); return; }
          scrollTo(target);
          if (id === 'main' || target.hasAttribute('tabindex') || /^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(target.tagName)) {
            if (!target.hasAttribute('tabindex') && id === 'main') target.setAttribute('tabindex', '-1');
            focusEl(target);
          }
          return;
        }
      }
    }
    if (isTransitionLink(a, e)) { e.preventDefault(); go(a.href); }
  }

  /* ===========================================================================
     23. Public API (defined synchronously at parse time)
     ======================================================================== */
  var pageFns = [], readyFns = [], booted = false;
  var prior = w.BENM;   // a script loaded earlier (e.g. leather.js) may already have attached to window.BENM
  var BENM = w.BENM = {
    version: '1.0.0',
    get lang() { return lang; },
    get currency() { return currency; },
    get dir() { return lang === 'ckb' ? 'rtl' : 'ltr'; },
    reducedMotion: REDUCED,
    isTouch: TOUCH,
    lenis: null,
    isRTL: isRTL,

    /* lifecycle */
    page: function (fn) { if (typeof fn !== 'function') return; if (booted) tryCall(fn, BENM); else pageFns.push(fn); },
    ready: function (fn) { if (typeof fn !== 'function') return; if (isReady) setTimeout(function () { tryCall(fn, BENM); }, 0); else readyFns.push(fn); },
    isReady: function () { return isReady; },
    on: on, off: off, emit: emit,

    /* i18n */
    t: t, loc: loc, num: num, price: price,
    i18n: { add: addStrings, apply: applyI18n, t: t, has: function (k) { return lookup(k, lang) !== undefined || lookup(k, 'en') !== undefined; } },
    setLang: setLang,
    setCurrency: setCurrency,

    /* scroll & motion */
    scrollTo: scrollTo,
    refresh: refresh,
    reveal: reveal,
    split: split,

    /* commerce */
    productCard: productCard,
    refreshProducts: refreshProducts,
    findProduct: findProduct,
    category: category,
    products: products,
    search: search,
    cart: cart,
    wishlist: wishlist,
    addToBag: addToBag,
    flyToBag: flyToBag,
    openDrawer: openDrawer,
    closeDrawer: closeDrawer,
    quickView: quickView,
    whatsappLink: whatsappLink,
    orderMessage: orderMessage,
    productMessage: productMessage,

    /* ui */
    toast: toast,
    modal: modal,
    icon: icon,
    validate: validate,
    menu: menu,
    searchUI: searchUI,
    header: null,
    go: go,

    /* helpers */
    param: param,
    url: url,
    esc: esc
  };
  // Keep whatever was attached before main.js ran (not copied with Object.assign: that would flatten the getters above)
  if (prior) Object.keys(prior).forEach(function (k) { if (!(k in BENM)) BENM[k] = prior[k]; });

  /* ===========================================================================
     24. Boot
     ======================================================================== */
  var coverDone = false, pageDone = false;
  function markReady() {
    if (isReady) return;
    isReady = true;
    html.setAttribute('data-ready', 'true');
    flushReveals();
    readyFns.splice(0).forEach(function (fn) { tryCall(fn, BENM); });
    emit('ready', { lang: lang });
    refresh();
    setTimeout(arriveAtHash, 220);   // after the debounced ScrollTrigger refresh (pin spacers move anchors)
  }
  // Arriving with a #hash: page initialisers may have rendered content above the target after the browser's
  // own fragment jump, so land on it once — unless the page already did (it is within 40 px of where it belongs).
  function arriveAtHash() {
    var id = (location.hash || '').slice(1), el = null;
    if (!id) return;
    try { el = d.getElementById(decodeURIComponent(id)); } catch (e) { el = null; }
    if (!el) return;
    var want = parseFloat(getComputedStyle(el).scrollMarginTop) || headerOffset();
    if (Math.abs(el.getBoundingClientRect().top - want) > 40) scrollTo(el, { offset: -want, immediate: true });
  }
  function maybeReady() { if (coverDone && pageDone) markReady(); }
  function fontsReady(ms) {
    return new Promise(function (resolve) {
      var fin = function () { resolve(); };
      try { if (d.fonts && d.fonts.ready) d.fonts.ready.then(fin, fin); else fin(); } catch (e) { fin(); }
      setTimeout(fin, ms);
    });
  }
  function step(fn) { tryCall(fn); }

  function boot() {
    // 1. language + currency
    step(function () {
      html.setAttribute('lang', lang);
      html.setAttribute('dir', lang === 'ckb' ? 'rtl' : 'ltr');
    });
    // 2. strings
    step(function () { applyI18n(d); syncSwitches(); });
    // 3. smooth scroll
    step(initScroll);
    // 4. chrome
    curtain = $('.c-curtain');
    step(initHeader);
    step(initMenu);
    step(initSearch);
    step(initDrawer);
    step(initCursor);
    step(function () { renderCounts(); });
    step(function () { $$('.c-accordion').forEach(initAccordion); });
    d.addEventListener('click', onDocClick);
    d.addEventListener('submit', onSubmit);
    d.addEventListener('input', function (e) {
      var el = e.target;
      if (el && el.form && el.form.__benmTried && el.closest && el.closest('.is-invalid')) validateField(el);
    });
    d.addEventListener('focusout', function (e) {
      var el = e.target;
      if (el && el.form && el.form.__benmTried && /^(INPUT|SELECT|TEXTAREA)$/.test(el.nodeName)) validateField(el);
    });
    d.addEventListener('keydown', function (e) {
      var tb = e.target && e.target.closest && e.target.closest('[data-tabs] [role="tab"]');
      if (!tb || ['ArrowLeft', 'ArrowRight'].indexOf(e.key) < 0) return;
      var all = $$('[role="tab"]', tb.closest('[role="tablist"]'));
      var i = all.indexOf(tb) + ((e.key === 'ArrowRight') !== isRTL() ? 1 : -1);
      var nx = all[(i + all.length) % all.length];
      e.preventDefault();
      selectTabIn(nx);
      focusEl(nx);
    });
    on('cart', function (e) { renderCounts(e && e.action === 'add' ? 'cart' : null); });
    on('wishlist', function (e) { renderCounts(e && e.saved ? 'wishlist' : null); syncWishButtons(); });
    on('langchange', function () { renderCounts(); scan('[data-count-to]', html).forEach(function (el) { if (el.__benmCount) el.__benmCount.fmt(); }); });
    booted = true;

    // 7a. the preloader starts at once (it covers the page while it initialises)
    var preloading = html.classList.contains('is-preloading');
    if (preloading) step(function () { runPreloader(function () { coverDone = true; maybeReady(); }); });

    fontsReady(1500).then(function () {
      // 5. page initialisers
      pageFns.splice(0).forEach(function (fn) { tryCall(fn, BENM); });
      // 6. declarative animation attributes
      step(function () { reveal(d); });
      refresh();
      pageDone = true;
      // 7b. curtain-out (or nothing) → ready
      if (!preloading) curtainOut(function () { coverDone = true; maybeReady(); });
      else maybeReady();
    });

    // 8. refresh once everything has loaded
    if (d.readyState === 'complete') refresh();
    else w.addEventListener('load', function () { refresh(); });
    if (d.fonts && d.fonts.addEventListener) d.fonts.addEventListener('loadingdone', refresh);

    // the ready contract must always be honoured
    setTimeout(function () {
      if (isReady) return;
      console.warn('[BENM] ready forced after timeout');
      html.classList.remove('is-preloading', 'is-transitioning');
      coverDone = pageDone = true;
      markReady();
    }, 9000);
  }

  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', boot);
  else setTimeout(boot, 0);
})(window, document);
