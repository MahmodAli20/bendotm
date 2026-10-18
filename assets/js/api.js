/* =============================================================================
   Ben.M — live catalogue + orders from the Directus backend         assets/js/api.js
   -----------------------------------------------------------------------------
   Loaded right after data.js. Active only when the page is served from a host
   listed in BENM_CONFIG.api.servers (local: `npm run dev` in bendotm-backend;
   production: the shop's domain, added by the backend's deploy script).
   Everywhere else (GitHub Pages, double-clicked files) it does nothing and the
   site uses the catalogue written in data.js.

   When active:
   1. the snapshot saved on the previous visit is applied at once (so the menu,
      built by layout.js, already shows the live collections);
   2. a fresh copy is fetched; main.js waits for it (max ~2.5 s) before the page
      renders, then locks — a later answer only refreshes the saved snapshot;
   3. checkout saves the order (BENM_API.saveOrder) before WhatsApp opens.
   Data is replaced IN PLACE (same arrays/objects), because main.js and the page
   scripts keep references to window.BENM_PRODUCTS etc.
   ========================================================================== */
(function (w) {
  'use strict';

  var CONFIG = w.BENM_CONFIG || {};
  var cfg = CONFIG.api || {};
  var URL_ = String((cfg.servers || {})[w.location.hostname] || '').replace(/\/+$/, '');
  var enabled = !!URL_;
  var CACHE_KEY = 'benm:live:v2';   // v2: categories carry parent + kind
  var locked = false;

  var api = { enabled: enabled, url: URL_, ready: Promise.resolve(false), lock: function () { locked = true; }, saveOrder: function () { return Promise.resolve(null); } };
  w.BENM_API = api;
  if (!enabled) return;

  /* ---- mapping: Directus rows → the shapes data.js uses ------------------------------------------ */
  // WebP for every browser: as small as it needs to be, and quick for the server to make (AVIF is not)
  function asset(id, width) { return id ? URL_ + '/assets/' + id + '?width=' + width + '&quality=82&format=webp' : ''; }
  function pair(row, base) { var en = row[base + '_en'] || ''; return { en: en, ckb: row[base + '_ckb'] || en }; }
  function lines(s) { return String(s || '').split(/\r?\n/).map(function (x) { return x.trim(); }).filter(Boolean); }
  function list(v) { return Array.isArray(v) ? v : String(v || '').split(',').filter(Boolean); }
  function nums(v) { return list(v).map(Number).filter(function (n) { return isFinite(n); }); }
  function bySort(a, b) { return (a.sort || 0) - (b.sort || 0); }

  function map(raw) {
    var leathers = raw.leathers.map(function (l) {
      return { id: l.id, hex: l.hex || '#1F3E35', grain: l.grain || 'pebble', name: pair(l, 'name'), description: pair(l, 'description') };
    });
    var L = {};
    leathers.forEach(function (l) { L[l.id] = l; });
    var products = raw.products.filter(function (p) { return p.status === 'published'; }).map(function (p) {
      var img1 = asset(p.image_main, 1200), img2 = asset(p.image_alt, 1200) || img1;
      return {
        id: p.id, category: p.category, type: p.type || '', typeName: pair(p, 'type_name'), name: pair(p, 'name'),
        price: Number(p.price) || 0,
        colors: (p.colors || []).slice().sort(bySort).map(function (c) { return L[c.leathers_id]; }).filter(Boolean),
        sizes: nums(p.sizes), soldOut: nums(p.sold_out),
        images: img1 ? [img1, img2] : [],
        isNew: !!p.is_new, featured: !!p.featured, badge: p.badge && p.badge !== 'none' ? p.badge : null, personalisable: !!p.personalisable,
        short: pair(p, 'short'), description: pair(p, 'description'),
        details: { en: lines(p.details_en), ckb: lines(p.details_ckb || p.details_en) }, care: pair(p, 'care'),
        related: (p.related || []).slice().sort(bySort).map(function (r) { return r.related_products_id; }).filter(Boolean)
      };
    });
    var categories = raw.categories.map(function (c) {   // parent empty = main category (Men, Women); else a sub-category
      return {
        id: c.id, parent: (c.parent && c.parent.id) || c.parent || null, kind: c.kind || '',
        name: pair(c, 'name'), tagline: pair(c, 'tagline'), intro: pair(c, 'intro'), image: asset(c.image, 1200)
      };
    });
    var stores = raw.stores.map(function (s) {
      var q = encodeURIComponent((s.city_en || '') + ', Iraq');
      return {
        id: s.id, city: pair(s, 'city'), name: pair(s, 'name'), description: pair(s, 'description'), address: pair(s, 'address'),
        hours: pair(s, 'hours'), phone: s.phone || '', lat: Number(s.lat), lng: Number(s.lng), image: asset(s.image, 1600),
        mapsUrl: s.maps_url || 'https://www.google.com/maps/search/?api=1&query=' + q,
        embedUrl: 'https://maps.google.com/maps?q=' + q + '&z=13&output=embed'
      };
    });
    var st = raw.settings || {};
    var config = {
      whatsapp: st.whatsapp, phone: st.phone, email: st.email,
      currency: { default: st.default_currency || 'USD', iqdRate: Number(st.iqd_rate) || 1310 },
      freeShippingThreshold: Number(st.free_shipping_threshold), personalisationFee: Number(st.personalisation_fee),
      social: { instagram: st.instagram, facebook: st.facebook, tiktok: st.tiktok }
    };
    return { products: products, categories: categories, leathers: leathers, stores: stores, config: config };
  }

  /* ---- apply in place ------------------------------------------------------------------------------ */
  function replace(arr, items) { if (!arr) return; arr.length = 0; Array.prototype.push.apply(arr, items); }
  function merge(dst, src) {
    for (var k in src) {
      if (!Object.prototype.hasOwnProperty.call(src, k)) continue;
      var v = src[k];
      if (v === undefined || v === null || v === '' || (typeof v === 'number' && !isFinite(v))) continue;   // keep data.js defaults
      if (v && typeof v === 'object' && !Array.isArray(v)) { dst[k] = dst[k] || {}; merge(dst[k], v); }
      else dst[k] = v;
    }
  }
  function apply(data) {
    if (!data || !data.products || !data.products.length) return false;   // an empty backend never wipes the site
    replace(w.BENM_PRODUCTS, data.products);
    if (data.categories.length) replace(w.BENM_CATEGORIES, data.categories);
    if (data.leathers.length) replace(w.BENM_LEATHERS, data.leathers);
    if (data.stores.length) replace(w.BENM_STORES, data.stores);
    merge(CONFIG, data.config);
    return true;
  }

  // 1. last visit's snapshot, synchronously
  try {
    var cached = JSON.parse(w.localStorage.getItem(CACHE_KEY) || 'null');
    if (cached && cached.url === URL_) apply(cached.data);
  } catch (e) { /* storage unavailable: fine */ }

  // 2. fresh copy
  function get(path) {
    return fetch(URL_ + path, { credentials: 'omit' }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status + ' ' + path);
      return r.json();
    }).then(function (j) { return j.data; });
  }
  api.ready = Promise.all([
    get('/items/products?limit=-1&sort=sort&filter[status][_eq]=published&fields=*,colors.leathers_id,colors.sort,related.related_products_id,related.sort'),
    get('/items/categories?limit=-1&sort=sort'),
    get('/items/leathers?limit=-1&sort=sort'),
    get('/items/stores?limit=-1&sort=sort'),
    get('/items/shop_settings')
  ]).then(function (r) {
    var data = map({ products: r[0] || [], categories: r[1] || [], leathers: r[2] || [], stores: r[3] || [], settings: r[4] || {} });
    try { w.localStorage.setItem(CACHE_KEY, JSON.stringify({ url: URL_, t: Date.now(), data: data })); } catch (e) {}
    return locked ? false : apply(data);
  }).catch(function (e) {
    if (w.console) w.console.info('[BENM_API] backend not reachable — using the saved catalogue (' + e.message + ')');
    return false;
  });

  /* ---- orders -------------------------------------------------------------------------------------- */
  api.saveOrder = function (order) {
    return fetch(URL_ + '/items/orders', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(order),
      credentials: 'omit', keepalive: true
    }).then(function (r) { return r.ok; }).catch(function () { return false; });
  };
})(window);
