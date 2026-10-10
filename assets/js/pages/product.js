/* =============================================================================
   Ben.M — Product detail page                         assets/js/pages/product.js
   -----------------------------------------------------------------------------
   One template for every product: product.html?id=<id> (missing or unknown id
   → the first product, silently; the URL is corrected). Classic script, runs
   from file://. Uses the shared BENM API (main.js) and BENM.Leather.

     1  Strings (product.*)              8  Size guide (BENM.modal)
     2  Product · crops · state          9  Zoom viewer (BENM.modal, full screen)
     3  Helpers                         10  Sticky add-to-bag bar
     4  Head · breadcrumbs · eyebrow    11  The leather · atelier (leather.js)
     5  Gallery (frames, rail, HUD)     12  Complete the look · recently viewed
     6  Colour · size · bag · WhatsApp  13  Boot · language · currency
     7  Assurances · accordion copy
   ========================================================================== */
(function (w, d) {
  'use strict';

  var B = w.BENM;
  if (!B) return;

  /* ===========================================================================
     1. Strings — page keys (shared product.* / card.* keys come from i18n.js)
     ======================================================================== */
  B.i18n.add({
    en: {
      'product.meta.title': '{name} — Ben.M',
      'product.meta.description': '{name} — {short} Genuine leather, handcrafted by Ben.M.',
      'product.gallery.label': 'Product images',
      'product.gallery.zoom': 'View in full screen',
      'product.gallery.open': 'Open in full screen',
      'product.gallery.show': 'Show image {n} of {total}',
      'product.gallery.detail': 'Detail of the {name}',
      'product.gallery.second': 'The {name}, another view',
      'product.gallery.detailTag': 'Detail',
      'product.gallery.pictured': 'Pictured in {color}',
      'product.sizeEU': 'Size · EU',
      'product.assure.ship': 'Complimentary delivery on orders over {amount}',
      'product.assure.shipFree': 'Complimentary delivery on this piece',
      'product.assure.confirm': 'Every order is confirmed with you personally on WhatsApp',
      'product.assure.returns': 'Easy returns and exchanges',
      'product.acc.description': 'Description',
      'product.acc.details': 'Details & materials',
      'product.acc.care': 'Care',
      'product.acc.careLink': 'The leather care guide',
      'product.ship.p1': 'Delivery is complimentary on orders over {amount}. Every order is confirmed with you personally on WhatsApp, where we agree on delivery and payment.',
      'product.ship.p2': 'If a piece is not quite right, write to us and we will arrange an exchange or a return.',
      'product.leathers.eyebrow': 'The leather',
      'product.leathers.title': 'Cut from the hide <em>you choose.</em>',
      'product.leathers.text': 'Every colour is its own leather, chosen by hand for its depth and its grain. Choose yours, and your piece is made in it.',
      'product.leathers.pictured': 'Pictured',
      'product.leathers.selected': 'Your choice',
      'product.leathers.choose': 'Choose {color}',
      'product.atelier.title': 'Make it <em>yours.</em>',
      'product.atelier.text': 'Have the {name} pressed with your initials — by hand, in the Atelier, before it leaves for you.',
      'product.atelier.s1': 'Gold, silver or blind foil',
      'product.atelier.s2': 'Up to three initials',
      'product.atelier.s3': 'Pressed by hand in the Atelier',
      'product.atelier.fee': 'Personalisation · {amount}',
      'product.atelier.photoAlt': 'A craftsman stamping a design into leather with a mallet',
      'product.atelier.preview': 'Initials pressed in gold on {color} leather',
      'product.related.eyebrow': 'Styled together',
      'product.related.title': 'Complete <em>the look.</em>',
      'product.related.shop': 'Shop {category}',
      'product.recent.title': 'Recently viewed',
      'product.recent.clear': 'Clear',
      'product.bar.label': 'Quick purchase',
      'product.bar.add': 'Add',
      'product.guide.title': 'Find your <em>fit.</em>',
      'product.guide.intro': 'Our shoes are made in EU sizes. Find yours in the table, or measure your foot to be sure.',
      'product.guide.tabs': 'Size tables',
      'product.guide.caption': '{group}: shoe size conversions',
      'product.guide.eu': 'EU',
      'product.guide.uk': 'UK',
      'product.guide.us': 'US',
      'product.guide.foot': 'Foot length',
      'product.guide.cm': '{n} cm',
      'product.guide.yours': 'Your size',
      'product.guide.measureTitle': 'How to measure',
      'product.guide.measure': 'Measure in the evening, when your feet are at their largest. Stand on a sheet of paper, mark your heel and the tip of your longest toe, and measure between the two marks.',
      'product.guide.between': 'Between two sizes? Choose the larger one, or write to us and we will help you choose.',
      'product.guide.note': 'Conversions are a guide; every last fits a little differently.',
      'product.guide.ask': 'Ask about fit on WhatsApp',
      'product.guide.wa': 'Hello Ben.M, I have a question about the fit of the {name}.',
      'product.zoom.label': 'Image viewer',
      'product.zoom.in': 'Zoom in',
      'product.zoom.out': 'Zoom out',
      'product.zoom.hintFine': 'Move the pointer to explore',
      'product.zoom.hintTouch': 'Double-tap to zoom · swipe for the next image',
      'product.zoom.keys': 'Arrow keys change the image; + and − zoom in and out.'
    },
    ckb: {
      'product.meta.title': '{name} — Ben.M',
      'product.meta.description': '{name} — {short} چەرمی ڕەسەن، دەستکردی Ben.M.',
      'product.gallery.label': 'وێنەکانی بەرهەم',
      'product.gallery.zoom': 'بینین بە پڕی شاشە',
      'product.gallery.open': 'کردنەوە بە پڕی شاشە',
      'product.gallery.show': 'پیشاندانی وێنەی {n} لە {total}',
      'product.gallery.detail': 'وردەکارییەکی {name}',
      'product.gallery.second': '{name}، لە گۆشەیەکی ترەوە',
      'product.gallery.detailTag': 'وردەکاری',
      'product.gallery.pictured': 'لە وێنەکاندا: {color}',
      'product.sizeEU': 'قەبارە · ئەوروپی',
      'product.assure.ship': 'گەیاندنی بێبەرامبەر بۆ داواکارییەکانی سەرووی {amount}',
      'product.assure.shipFree': 'گەیاندنی ئەم پارچەیە بێبەرامبەرە',
      'product.assure.confirm': 'هەموو داواکارییەک بە شێوەیەکی کەسی لە ڕێگەی واتسئاپەوە لەگەڵت پشتڕاست دەکرێتەوە',
      'product.assure.returns': 'گەڕاندنەوە و گۆڕینەوەی ئاسان',
      'product.acc.description': 'وەسف',
      'product.acc.details': 'وردەکاری و کەرەستەکان',
      'product.acc.care': 'چاودێری',
      'product.acc.careLink': 'ڕێبەری چاودێریی چەرم',
      'product.ship.p1': 'گەیاندن بۆ داواکارییەکانی سەرووی {amount} بێبەرامبەرە. هەموو داواکارییەک بە شێوەیەکی کەسی لە ڕێگەی واتسئاپەوە لەگەڵت پشتڕاست دەکرێتەوە، و لەوێ لەسەر گەیاندن و پارەدان ڕێک دەکەوین.',
      'product.ship.p2': 'ئەگەر پارچەیەک وەک پێویست نەبوو، بۆمان بنووسە و گۆڕینەوە یان گەڕاندنەوەکەی بۆ ڕێک دەخەین.',
      'product.leathers.eyebrow': 'چەرمەکە',
      'product.leathers.title': 'لەو چەرمە دەبڕدرێت <em>کە خۆت هەڵیدەبژێریت.</em>',
      'product.leathers.text': 'هەر ڕەنگێک چەرمێکی جیاوازە، بە دەست بۆ قووڵی و ڕووکارەکەی هەڵبژێردراوە. هی خۆت هەڵبژێرە، و پارچەکەت بەو چەرمە دروست دەکرێت.',
      'product.leathers.pictured': 'لە وێنەکاندا',
      'product.leathers.selected': 'هەڵبژاردەی تۆ',
      'product.leathers.choose': 'ڕەنگی {color} هەڵبژێرە',
      'product.atelier.title': 'بیکە بە <em>هی خۆت.</em>',
      'product.atelier.text': '{name} بە پیتە سەرەتاییەکانی ناوت تایبەت بکە؛ پێش ئەوەی بگاتە دەستت، لە ئاتێلیەدا بە دەست مۆر دەکرێت.',
      'product.atelier.s1': 'فۆیلی زێڕین، زیوین یان مۆری بێڕەنگ',
      'product.atelier.s2': 'تا سێ پیت',
      'product.atelier.s3': 'لە ئاتێلیەدا بە دەست مۆر دەکرێت',
      'product.atelier.fee': 'تایبەتکردن · {amount}',
      'product.atelier.photoAlt': 'وەستایەک بە چەکوش نەخشێک لەسەر چەرم مۆر دەکات',
      'product.atelier.preview': 'پیتی زێڕین لەسەر چەرمی {color}',
      'product.related.eyebrow': 'پێکەوە دەگونجێن',
      'product.related.title': 'ستایلەکەت <em>تەواو بکە.</em>',
      'product.related.shop': 'کۆلێکشنی {category}',
      'product.recent.title': 'دوایین سەیرکراوەکان',
      'product.recent.clear': 'سڕینەوە',
      'product.bar.label': 'کڕینی خێرا',
      'product.bar.add': 'زیادکردن',
      'product.guide.title': 'قەبارەی <em>گونجاو</em> بدۆزەرەوە.',
      'product.guide.intro': 'پێڵاوەکانمان بە قەبارەی ئەوروپی دروست دەکرێن. قەبارەی خۆت لە خشتەکەدا بدۆزەرەوە، یان بۆ دڵنیابوون پێت بپێوە.',
      'product.guide.tabs': 'خشتەکانی قەبارە',
      'product.guide.caption': '{group}: گۆڕینی قەبارەی پێڵاو',
      'product.guide.eu': 'ئەوروپی',
      'product.guide.uk': 'بەریتانی',
      'product.guide.us': 'ئەمریکی',
      'product.guide.foot': 'درێژیی پێ',
      'product.guide.cm': '{n} سم',
      'product.guide.yours': 'قەبارەکەت',
      'product.guide.measureTitle': 'چۆن پێت بپێویت',
      'product.guide.measure': 'ئێواران بیپێوە، کاتێک پێیەکانت لە گەورەترین قەبارەیاندان. لەسەر پەڕەیەک کاغەز بوەستە، شوێنی پاژنە و سەری درێژترین پەنجەت نیشانە بکە، پاشان نێوانی هەردوو نیشانەکە بپێوە.',
      'product.guide.between': 'لە نێوان دوو قەبارەدایت؟ گەورەترەکە هەڵبژێرە، یان بۆمان بنووسە و یارمەتیت دەدەین.',
      'product.guide.note': 'ئەم گۆڕینانە تەنها بۆ ڕێنماییین؛ هەر قاڵبێک کەمێک جیاواز لە پێدا دەگونجێت.',
      'product.guide.ask': 'پرسیار دەربارەی قەبارە لە واتسئاپ',
      'product.guide.wa': 'سڵاو Ben.M، پرسیارێکم دەربارەی قەبارەی {name} هەیە.',
      'product.zoom.label': 'پیشاندەری وێنە',
      'product.zoom.in': 'گەورەکردن',
      'product.zoom.out': 'بچووککردنەوە',
      'product.zoom.hintFine': 'ماوسەکە بجوڵێنە بۆ سەیرکردنی وردەکاری',
      'product.zoom.hintTouch': 'دوو جار لێی بدە بۆ گەورەکردن · ڕایبکێشە بۆ وێنەی دواتر',
      'product.zoom.keys': 'بە دوگمەکانی تیر وێنەکە بگۆڕە، و بە + و − گەورە و بچووکی بکە.'
    }
  });

  /* ===========================================================================
     2. Product · crops · state
     ======================================================================== */
  var PRODUCTS = w.BENM_PRODUCTS || [];
  var LEATHERS = w.BENM_LEATHERS || [];
  var CONFIG = w.BENM_CONFIG || {};
  var REQUESTED = B.param('id');
  var P = B.findProduct(REQUESTED) || PRODUCTS[0] || null;
  if (!P) return;
  var INDEX = PRODUCTS.indexOf(P);
  var COLORS = P.colors || [];
  var HAS_SIZES = !!(P.sizes && P.sizes.length);
  var SOLD = P.soldOut || [];

  /* Detail crops — two per product: [photo index, centre x %, centre y %, zoom].
     Chosen by eye on contact sheets of the graded photos; products added later
     fall back to DEFAULT_CROPS. */
  var CROPS = {
    'azmar-oxford': [[0, 64, 46, 2.2], [1, 36, 72, 1.8]],
    'goizha-derby': [[0, 58, 32, 2.2], [1, 42, 62, 1.7]],
    'safeen-penny-loafer': [[0, 62, 58, 2.2], [1, 42, 82, 2.0]],
    'shaqlawa-tassel-loafer': [[0, 26, 84, 2.4], [1, 62, 58, 1.8]],
    'zagros-chelsea-boot': [[0, 46, 42, 2.2], [1, 55, 42, 1.9]],
    'korek-double-monk': [[0, 74, 38, 2.6], [1, 36, 54, 2.0]],
    'amedi-wingtip-brogue': [[0, 28, 62, 2.4], [1, 45, 56, 1.6]],
    'rawanduz-lace-boot': [[0, 58, 26, 2.3], [1, 58, 60, 1.8]],
    'nergiz-pump': [[0, 40, 72, 2.2], [1, 55, 52, 1.6]],
    'shilan-loafer': [[0, 24, 40, 2.2], [0, 80, 68, 2.3]],
    'hiva-ankle-boot': [[0, 24, 48, 2.4], [1, 56, 72, 1.7]],
    'nali-ballet-flat': [[0, 26, 32, 2.2], [1, 66, 70, 1.6]],
    'nawroz-tote': [[0, 36, 30, 2.3], [1, 40, 70, 1.9]],
    'qalat-crossbody': [[0, 55, 56, 2.4], [1, 66, 70, 2.0]],
    'hawler-briefcase': [[0, 72, 58, 2.6], [1, 30, 56, 1.8]],
    'dukan-weekender': [[0, 50, 62, 2.3], [1, 40, 55, 1.7]],
    'sirwan-clutch': [[0, 52, 44, 2.3], [1, 60, 32, 1.7]],
    'bekhal-backpack': [[0, 72, 45, 2.4], [1, 50, 55, 2.2]],
    'dijla-belt': [[0, 22, 38, 2.2], [1, 56, 47, 1.8]],
    'slemani-bifold': [[0, 55, 45, 2.4], [1, 40, 50, 1.6]],
    'zab-card-holder': [[0, 50, 32, 2.6], [1, 62, 70, 1.5]],
    'penjwen-passport-cover': [[0, 50, 52, 2.2], [1, 70, 72, 1.6]]
  };
  var DEFAULT_CROPS = [[0, 50, 42, 2.0], [1, 50, 58, 1.8]];

  /* Shoe size conversions (EU → UK, US); foot length ≈ EU / 1.5 − 1.5 cm */
  var SIZE_TABLES = {
    men: [[39, 6, 7], [40, 6.5, 7.5], [41, 7.5, 8.5], [42, 8, 9], [43, 9, 10], [44, 9.5, 10.5], [45, 10.5, 11.5], [46, 11, 12]],
    women: [[35, 2.5, 5], [36, 3.5, 6], [37, 4, 6.5], [38, 5, 7.5], [39, 6, 8.5], [40, 6.5, 9], [41, 7.5, 10]]
  };

  var RECENT_KEY = 'benm:recent';
  var RECENT_MAX = 6;
  var state = { color: (COLORS[0] || {}).id || null, size: null };
  var FRAMES = [];

  /* ===========================================================================
     3. Helpers
     ======================================================================== */
  var esc = B.esc;
  var html = d.documentElement;
  function $(sel, root) { return (root || d).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || d).querySelectorAll(sel)); }
  function byId(id) { return d.getElementById(id); }
  function pad(n) { n = String(n); return n.length < 2 ? '0' + n : n; }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
  function mq(q) { try { return w.matchMedia(q); } catch (e) { return { matches: false, addEventListener: function () {} }; } }
  function onMq(m, fn) { if (m.addEventListener) m.addEventListener('change', fn); else if (m.addListener) m.addListener(fn); }
  function focusEl(el) { if (!el) return; try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); } }
  function debounce(fn, ms) { var t; return function () { clearTimeout(t); t = setTimeout(fn, ms); }; }
  function whenNear(el, margin, fn) {
    if (!el) return;
    if (!('IntersectionObserver' in w)) { fn(); return; }
    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) { io.disconnect(); fn(); return; }
      }
    }, { rootMargin: margin });
    io.observe(el);
  }
  function colorById(id) {
    for (var i = 0; i < COLORS.length; i++) if (COLORS[i].id === id) return COLORS[i];
    return COLORS[0] || null;
  }
  function leatherById(id) {
    for (var i = 0; i < LEATHERS.length; i++) if (LEATHERS[i].id === id) return LEATHERS[i];
    return null;
  }
  function otherLang() { return B.lang === 'ckb' ? 'en' : 'ckb'; }
  function headerH() { var h = byId('site-header'); return h ? h.offsetHeight : 84; }
  function threshold() { return +CONFIG.freeShippingThreshold || 0; }
  function setMeta(sel, value) { var m = $(sel); if (m) m.setAttribute('content', value); }

  var DESKTOP = mq('(min-width: 1000px)');
  var FINE = mq('(hover: hover) and (pointer: fine)').matches;

  /* DOM */
  var hero = byId('pdp-hero');
  var framesEl = byId('pdp-frames'), railEl = byId('pdp-rail');
  var hudN = byId('pdp-hud-n'), hudTotal = byId('pdp-hud-total'), hudFill = byId('pdp-hud-fill'), hudZoom = byId('pdp-hud-zoom');
  var info = byId('pdp-info');
  var swatchesEl = byId('pdp-swatches'), colorName = byId('pdp-color-name'), pictured = byId('pdp-pictured');
  var sizeField = byId('pdp-size-field'), sizesEl = byId('pdp-sizes'), sizeName = byId('pdp-size-name'), oneSize = byId('pdp-one-size');
  var msgEl = byId('pdp-msg'), addBtn = byId('pdp-add'), wishBtn = byId('pdp-wish'), waLink = byId('pdp-wa');
  var bar = byId('pdp-bar');
  if (!hero || !framesEl || !info || !bar) return;

  /* ===========================================================================
     4. Head · breadcrumbs · eyebrow
     ======================================================================== */
  function renderHead() {
    var name = B.loc(P.name);
    var desc = B.t('product.meta.description', { name: name, short: B.loc(P.short) });
    d.title = B.t('product.meta.title', { name: name });
    setMeta('meta[name="description"]', desc);
    setMeta('meta[property="og:title"]', d.title);
    setMeta('meta[property="og:description"]', desc);
  }

  function renderMeta() {
    var cat = B.category(P.category);
    var catName = cat ? B.loc(cat.name) : '';
    var catHref = B.url('shop.html' + (cat ? '?cat=' + encodeURIComponent(cat.id) : ''));
    var crumb = byId('pdp-crumb-cat');
    if (crumb) { crumb.textContent = catName || B.t('nav.shop'); crumb.setAttribute('href', catHref); }
    var num = byId('pdp-num');
    if (num) num.textContent = 'N°' + pad(INDEX + 1);
    var catEl = byId('pdp-cat');
    if (catEl) catEl.textContent = catName;
    var badge = byId('pdp-badge');
    if (badge) {
      badge.innerHTML = P.badge === 'new' ? '<span class="c-badge c-badge--dot">' + esc(B.t('card.new')) + '</span>' :
        P.badge === 'limited' ? '<span class="c-badge c-badge--limited">' + esc(B.t('card.limited')) + '</span>' : '';
    }
    var alt = byId('pdp-altname'), other = otherLang();
    if (alt) { alt.textContent = (P.name && P.name[other]) || ''; alt.setAttribute('lang', other); }
    var rel = byId('pdp-related-link'), relText = byId('pdp-related-link-text');
    if (rel) rel.setAttribute('href', catHref);
    if (relText) relText.textContent = catName ? B.t('product.related.shop', { category: catName }) : B.t('nav.shopAll');
  }

  /* ===========================================================================
     5. Gallery — four frames: the photo, two detail crops, the second photo
     ======================================================================== */
  function frameList() {
    var imgs = P.images || [];
    var list = [];
    if (!imgs.length) return list;
    list.push({ photo: 0, crop: null, kind: 'main' });
    (CROPS[P.id] || DEFAULT_CROPS).forEach(function (c) {
      var photo = imgs[c[0]] ? c[0] : 0;
      list.push({ photo: photo, crop: [photo, c[1], c[2], c[3]], kind: 'detail' });
    });
    if (imgs[1]) list.push({ photo: 1, crop: null, kind: 'second' });
    return list;
  }
  /* scale s around an origin chosen so the crop is centred on (cx, cy) — never shows an edge */
  function cropStyle(c) {
    var s = Math.max(1.05, c[3]);
    var o = function (v) { return clamp((v / 100 - 0.5 / s) / (1 - 1 / s), 0, 1) * 100; };
    return '--s:' + s + ';--ox:' + o(c[1]).toFixed(2) + '%;--oy:' + o(c[2]).toFixed(2) + '%';
  }
  function photoAlt(photo) {
    var name = B.loc(P.name);
    return photo === 0 ? B.t('card.alt', { name: name, color: B.loc((COLORS[0] || {}).name) }) : B.t('product.gallery.second', { name: name });
  }
  function frameAlt(f) {
    return f.kind === 'detail' ? B.t('product.gallery.detail', { name: B.loc(P.name) }) : photoAlt(f.photo);
  }
  function imgTag(f, eager) {
    return '<img src="' + esc(B.url(P.images[f.photo])) + '" alt="' + esc(frameAlt(f)) + '" width="1200" height="1500" decoding="async"' +
      (eager ? ' fetchpriority="high"' : ' loading="lazy"') + ' data-frame-img>';
  }
  function wrapCrop(f, inner) {
    return f.crop ? '<span class="pdp-crop" style="' + cropStyle(f.crop) + '">' + inner + '</span>' : inner;
  }

  function renderGallery() {
    FRAMES = frameList();
    var total = FRAMES.length;
    framesEl.innerHTML = FRAMES.map(function (f, i) {
      return '<figure class="pdp-frame pdp-frame--' + (f.kind === 'detail' ? 'detail' : 'full') + '" data-frame="' + i + '">' +
        '<button class="pdp-frame__btn" type="button" data-zoom="' + i + '" data-cursor-label="cursor.zoom">' +
          '<span class="pdp-frame__media u-media" data-reveal="clip-up"' + (i ? '' : ' data-reveal-delay=".1"') + '>' + wrapCrop(f, imgTag(f, i === 0)) + '</span>' +
          (f.kind === 'detail' ? '<span class="pdp-frame__tag" aria-hidden="true"><span class="c-diamond"></span><span data-i18n="product.gallery.detailTag">' +
            esc(B.t('product.gallery.detailTag')) + '</span></span>' : '') +
          '<span class="pdp-frame__icon" aria-hidden="true">' + B.icon('zoom') + '</span>' +
          '<span class="u-visually-hidden" data-i18n="product.gallery.open">' + esc(B.t('product.gallery.open')) + '</span>' +
        '</button></figure>';
    }).join('');

    if (railEl) {
      railEl.innerHTML = FRAMES.map(function (f, i) {
        var img = '<img src="' + esc(B.url(P.images[f.photo])) + '" alt="" width="1200" height="1500" loading="lazy" decoding="async">';
        return '<button class="pdp-thumb" type="button" data-thumb="' + i + '" aria-current="' + (i === 0) + '" aria-label="' +
          esc(B.t('product.gallery.show', { n: i + 1, total: total })) + '">' + wrapCrop(f, img) + '</button>';
      }).join('') +
        '<p class="pdp-rail__count" aria-hidden="true"><span id="pdp-rail-n">' + B.num(pad(1)) + '</span><span class="pdp-rail__total">' + B.num(pad(total)) + '</span></p>';
      railEl.setAttribute('data-reveal', 'fade');
      railEl.setAttribute('data-reveal-stagger', '.07');
    }
    if (hudTotal) hudTotal.textContent = B.num(pad(total));
    if (hudN) hudN.textContent = B.num(pad(1));
    var hud = byId('pdp-hud');
    if (hud) { hud.hidden = total < 2; hud.setAttribute('data-reveal', 'fade'); }
  }

  /* language switch: alt texts, labels and digits in place (keeps scroll + reveal state) */
  function localizeGallery() {
    var total = FRAMES.length;
    $$('[data-frame-img]', framesEl).forEach(function (img, i) { if (FRAMES[i]) img.alt = frameAlt(FRAMES[i]); });
    $$('[data-thumb]', railEl).forEach(function (b, i) { b.setAttribute('aria-label', B.t('product.gallery.show', { n: i + 1, total: total })); });
    var railTotal = $('.pdp-rail__total', railEl);
    if (railTotal) railTotal.textContent = B.num(pad(total));
    if (hudTotal) hudTotal.textContent = B.num(pad(total));
    setActive(active, true);
    updateHud();
  }

  /* desktop: active frame ↔ rail */
  var active = 0;
  function setActive(i, force) {
    if (i === active && !force) return;
    active = i;
    $$('[data-thumb]', railEl).forEach(function (b) { b.setAttribute('aria-current', String(+b.getAttribute('data-thumb') === i)); });
    var n = byId('pdp-rail-n');
    if (n) n.textContent = B.num(pad(i + 1));
  }

  /* mobile / tablet: the scroll-snap track drives the HUD */
  var trackIndex = 0, hudRaf = 0;
  function updateHud() {
    hudRaf = 0;
    if (DESKTOP.matches || !framesEl.scrollWidth) return;
    var cw = framesEl.clientWidth, sw = framesEl.scrollWidth;
    var x = Math.abs(framesEl.scrollLeft);                  // negative in RTL
    var first = framesEl.firstElementChild;
    var step = first ? first.offsetWidth + 2 : cw;
    trackIndex = clamp(Math.round(x / Math.max(1, step)), 0, Math.max(0, FRAMES.length - 1));
    if (hudN) hudN.textContent = B.num(pad(trackIndex + 1));
    if (hudFill) hudFill.style.setProperty('--p', clamp((x + cw) / sw, 0, 1).toFixed(4));
  }

  function visibleFrameImg() {
    var i = DESKTOP.matches ? active : trackIndex;
    var fr = framesEl.children[i] || framesEl.firstElementChild;
    return fr ? $('img', fr) : null;
  }

  function initGallery() {
    framesEl.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('[data-zoom]');
      if (b) openViewer(+b.getAttribute('data-zoom'));
    });
    framesEl.addEventListener('scroll', function () { if (!hudRaf) hudRaf = w.requestAnimationFrame(updateHud); }, { passive: true });
    if (hudZoom) hudZoom.addEventListener('click', function () { openViewer(trackIndex); });
    if (railEl) {
      railEl.addEventListener('click', function (e) {
        var b = e.target.closest && e.target.closest('[data-thumb]');
        if (!b) return;
        var i = +b.getAttribute('data-thumb');
        var fr = framesEl.children[i];
        if (!fr) return;
        setActive(i);
        B.scrollTo(fr, { offset: -(headerH() + 24) });
      });
    }
    if ('IntersectionObserver' in w) {
      var io = new IntersectionObserver(function (entries) {
        if (!DESKTOP.matches) return;
        entries.forEach(function (en) { if (en.isIntersecting) setActive(+en.target.getAttribute('data-frame')); });
      }, { rootMargin: '-42% 0px -52% 0px' });
      $$('.pdp-frame', framesEl).forEach(function (fr) { io.observe(fr); });
    }
    w.addEventListener('resize', debounce(updateHud, 120));
    updateHud();
    initLeanIn();
  }

  /* desktop: the detail crops lean in as they cross the viewport */
  function initLeanIn() {
    if (B.reducedMotion || !w.gsap || !w.ScrollTrigger || !gsap.matchMedia) return;
    var crops = $$('.pdp-frame--detail .pdp-crop', framesEl);
    if (!crops.length) return;
    gsap.matchMedia().add('(min-width: 1000px)', function () {
      crops.forEach(function (el) {
        var s = parseFloat(el.style.getPropertyValue('--s')) || 1.6;
        var frame = el.closest('.pdp-frame');
        gsap.fromTo(el, { scale: Math.max(1.05, s * 0.84) }, {
          scale: s, ease: 'none',
          scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom 30%', scrub: 0.8 }
        });
      });
    });
  }

  /* desktop: a column taller than the viewport scrolls, then sticks by its bottom */
  function updateSticky() {
    if (!DESKTOP.matches) { info.style.removeProperty('--pdp-sticky-top'); return; }
    var top = Math.min(headerH() + 24, w.innerHeight - info.offsetHeight - 32);
    info.style.setProperty('--pdp-sticky-top', Math.round(top) + 'px');
  }

  /* ===========================================================================
     6. Colour · size · add to bag · WhatsApp
     ======================================================================== */
  function renderSwatches() {
    if (!swatchesEl) return;
    swatchesEl.innerHTML = COLORS.map(function (c) {
      var name = B.loc(c.name);
      return '<label class="c-swatch" style="--swatch:' + esc(c.hex) + '" title="' + esc(name) + '">' +
        '<input type="radio" name="pdp-color" value="' + esc(c.id) + '"' + (c.id === state.color ? ' checked' : '') + '>' +
        '<span class="c-swatch__dot"></span><span class="u-visually-hidden">' + esc(name) + '</span></label>';
    }).join('');
  }

  function updateColorTexts() {
    var c = colorById(state.color), first = COLORS[0];
    if (!c) return;
    var name = B.loc(c.name);
    if (colorName) colorName.textContent = name;
    var barColor = byId('pdp-bar-color');
    if (barColor) barColor.textContent = name;
    if (pictured) {
      var differs = !!first && c.id !== first.id;
      pictured.hidden = !differs;
      pictured.textContent = differs ? B.t('product.gallery.pictured', { color: B.loc(first.name) }) : '';
    }
  }

  function renderSizes() {
    if (!sizeField || !sizesEl) return;
    sizeField.hidden = !HAS_SIZES;
    if (oneSize) oneSize.hidden = HAS_SIZES;
    if (!HAS_SIZES) return;
    sizesEl.setAttribute('aria-describedby', 'pdp-msg');
    sizesEl.innerHTML = P.sizes.map(function (s) {
      var out = SOLD.indexOf(s) > -1;
      return '<label class="c-size"' + (out ? ' title="' + esc(B.t('product.sizeSoldOut', { size: B.num(s) })) + '"' : '') + '>' +
        '<input type="radio" name="pdp-size" value="' + s + '"' + (out ? ' disabled' : '') + (state.size === s ? ' checked' : '') + '>' +
        '<span>' + B.num(s) + '</span>' + (out ? '<span class="u-visually-hidden">' + esc(B.t('card.soldOut')) + '</span>' : '') + '</label>';
    }).join('');
    if (sizeName) sizeName.textContent = state.size == null ? '' : B.num(state.size);
    fitSizes();
  }
  /* one row when every size gets ≥ 46 px, otherwise two balanced rows */
  function fitSizes() {
    if (!HAS_SIZES || !sizesEl || !sizesEl.clientWidth) return;
    var n = P.sizes.length, gap = 8;
    var cols = (sizesEl.clientWidth + gap) / n - gap >= 46 ? n : Math.ceil(n / 2);
    sizesEl.style.setProperty('--size-cols', String(cols));
  }

  function setColor(id, from) {
    var c = colorById(id);
    if (!c) return;
    state.color = c.id;
    if (from !== 'swatch' && swatchesEl) {
      $$('input[name="pdp-color"]', swatchesEl).forEach(function (r) { r.checked = r.value === c.id; });
    }
    updateColorTexts();
    syncHides();
    updateWa();
    updateAtelier();
  }

  function setSize(v, from) {
    state.size = v == null || v === '' || isNaN(+v) ? null : +v;
    if (from !== 'grid' && sizesEl) $$('input[name="pdp-size"]', sizesEl).forEach(function (r) { r.checked = +r.value === state.size; });
    if (from !== 'bar' && barSelect) barSelect.value = state.size == null ? '' : String(state.size);
    if (sizeName) sizeName.textContent = state.size == null ? '' : B.num(state.size);
    clearErrors();
    updateWa();
  }

  function clearErrors() {
    if (msgEl) msgEl.textContent = '';
    if (sizeField) sizeField.classList.remove('is-invalid');
    if (barMsg) barMsg.textContent = '';
    if (barSelectWrap) barSelectWrap.classList.remove('is-invalid');
  }

  function showSizeError(where) {
    if (where === 'bar' && barSelect) {
      barMsg.textContent = B.t('product.chooseSize');
      barSelectWrap.classList.add('is-invalid');
      focusEl(barSelect);
      return;
    }
    if (msgEl) msgEl.textContent = B.t('product.chooseSize');
    if (sizeField) {
      sizeField.classList.remove('is-invalid');
      void sizeField.offsetWidth;                          // restart the nudge
      sizeField.classList.add('is-invalid');
    }
    focusEl($('input[name="pdp-size"]:not(:disabled)', sizesEl));
  }

  function addToBag(where) {
    if (HAS_SIZES && state.size == null) { showSizeError(where); return; }
    var source = where === 'bar' ? $('img', byId('pdp-bar-thumb')) : visibleFrameImg();
    var key = B.addToBag(P.id, { color: state.color, size: HAS_SIZES ? state.size : null, qty: 1 }, source);
    if (key) flashAdded(where === 'bar' ? byId('pdp-bar-add') : addBtn);
  }

  /* the button says "Added ✓" for a moment */
  function flashAdded(btn) {
    if (!btn) return;
    var spans = $$('[data-i18n]', btn);
    btn.classList.add('is-added');
    spans.forEach(function (s) { s.innerHTML = B.icon('check') + esc(B.t('product.added')); });
    clearTimeout(btn.__pdpTimer);
    btn.__pdpTimer = setTimeout(function () {
      btn.classList.remove('is-added');
      spans.forEach(function (s) { s.textContent = B.t(s.getAttribute('data-i18n')); });
    }, 1800);
  }

  function updateWa() {
    if (!waLink) return;
    waLink.setAttribute('href', B.whatsappLink(B.productMessage(P.id, { color: state.color, size: HAS_SIZES ? state.size : null, qty: 1 })));
  }

  function initBuy() {
    if (swatchesEl) swatchesEl.addEventListener('change', function (e) { if (e.target.name === 'pdp-color') setColor(e.target.value, 'swatch'); });
    if (sizesEl) sizesEl.addEventListener('change', function (e) { if (e.target.name === 'pdp-size') setSize(e.target.value, 'grid'); });
    if (addBtn) addBtn.addEventListener('click', function () { addToBag('main'); });
    var guideBtn = byId('pdp-guide-btn');
    if (guideBtn) guideBtn.addEventListener('click', openGuide);
    if (wishBtn) {
      wishBtn.setAttribute('data-wish', P.id);
      wishBtn.setAttribute('aria-pressed', String(B.wishlist.has(P.id)));
      wishBtn.setAttribute('aria-label', B.t(B.wishlist.has(P.id) ? 'card.unsave' : 'card.save', { name: B.loc(P.name) }));
    }
  }

  /* ===========================================================================
     7. Assurances · accordion copy (details, shipping)
     ======================================================================== */
  function renderAssure() {
    var el = byId('pdp-assure');
    if (!el) return;
    var thr = threshold();
    var items = [
      ['truck', thr <= 0 || P.price >= thr ? B.t('product.assure.shipFree') : B.t('product.assure.ship', { amount: B.price(thr) })],
      ['whatsapp', B.t('product.assure.confirm')],
      ['return', B.t('product.assure.returns')]
    ];
    el.innerHTML = items.map(function (it) { return '<li>' + B.icon(it[0]) + '<span>' + esc(it[1]) + '</span></li>'; }).join('');
  }

  function renderDetails() {
    var el = byId('pdp-details');
    if (!el) return;
    var list = (P.details && (P.details[B.lang] || P.details.en)) || [];
    el.innerHTML = list.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('');
  }

  function renderShip() {
    var el = byId('pdp-ship');
    if (!el) return;
    el.innerHTML = '<p>' + esc(B.t('product.ship.p1', { amount: B.price(threshold()) })) + '</p><p>' + esc(B.t('product.ship.p2')) + '</p>';
  }

  /* ===========================================================================
     8. Size guide — EU / UK / US + foot length, men & women (BENM.modal)
     ======================================================================== */
  var dialogN = 0;
  function guideTable(group) {
    var head = '<thead><tr><th scope="col">' + esc(B.t('product.guide.eu')) + '</th><th scope="col">' + esc(B.t('product.guide.uk')) + '</th>' +
      '<th scope="col">' + esc(B.t('product.guide.us')) + '</th><th scope="col">' + esc(B.t('product.guide.foot')) + '</th></tr></thead>';
    var mine = group === P.category && state.size != null;
    var rows = SIZE_TABLES[group].map(function (r) {
      var cur = mine && r[0] === state.size;
      var cm = (r[0] / 1.5 - 1.5).toFixed(1);
      return '<tr' + (cur ? ' class="is-current"' : '') + '><th scope="row">' + B.num(r[0]) +
        (cur ? '<span class="pdp-guide__mark"><span class="c-diamond" aria-hidden="true"></span>' + esc(B.t('product.guide.yours')) + '</span>' : '') + '</th>' +
        '<td>' + B.num(r[1]) + '</td><td>' + B.num(r[2]) + '</td><td>' + esc(B.t('product.guide.cm', { n: B.num(cm) })) + '</td></tr>';
    }).join('');
    var label = B.t(group === 'women' ? 'nav.women' : 'nav.men');
    return '<div class="pdp-guide__scroll"><table class="pdp-guide__table"><caption class="u-visually-hidden">' +
      esc(B.t('product.guide.caption', { group: label })) + '</caption>' + head + '<tbody>' + rows + '</tbody></table></div>';
  }

  function openGuide() {
    var k = 'pdp-guide-' + (++dialogN);
    var initial = P.category === 'women' ? 'women' : 'men';
    var tabs = ['men', 'women'].map(function (g) {
      var on = g === initial;
      return '<button class="c-tab" type="button" role="tab" id="' + k + '-tab-' + g + '" aria-controls="' + k + '-' + g + '" aria-selected="' + on + '"' +
        (on ? '' : ' tabindex="-1"') + '>' + esc(B.t(g === 'women' ? 'nav.women' : 'nav.men')) + '</button>';
    }).join('');
    var panels = ['men', 'women'].map(function (g) {
      return '<div role="tabpanel" id="' + k + '-' + g + '" aria-labelledby="' + k + '-tab-' + g + '"' + (g === initial ? '' : ' hidden') + '>' + guideTable(g) + '</div>';
    }).join('');
    var wa = B.whatsappLink(B.t('product.guide.wa', { name: B.loc(P.name) }));
    var content = '' +
      '<div class="pdp-guide">' +
        '<p class="c-eyebrow c-eyebrow--line">' + esc(B.t('product.sizeGuide')) + '</p>' +
        '<h2 class="pdp-guide__title" id="' + k + '-title">' + B.t('product.guide.title') + '</h2>' +
        '<p class="pdp-guide__intro">' + esc(B.t('product.guide.intro')) + '</p>' +
        '<div data-tabs><div class="c-tabs" role="tablist" aria-label="' + esc(B.t('product.guide.tabs')) + '">' + tabs + '</div>' + panels + '</div>' +
        '<div class="pdp-guide__measure"><h3>' + esc(B.t('product.guide.measureTitle')) + '</h3>' +
          '<p>' + esc(B.t('product.guide.measure')) + '</p><p>' + esc(B.t('product.guide.between')) + '</p></div>' +
        '<div class="pdp-guide__foot"><p class="pdp-guide__note">' + esc(B.t('product.guide.note')) + '</p>' +
          '<a class="c-link" href="' + esc(wa) + '" target="_blank" rel="noopener"><span>' + esc(B.t('product.guide.ask')) + '</span>' + B.icon('arrow-up-right') +
          '<span class="u-visually-hidden">' + esc(B.t('a11y.newTab')) + '</span></a></div>' +
      '</div>';
    B.modal.open(content, { labelledBy: k + '-title', size: 'md', padded: true, className: 'pdp-guide-modal' });
  }

  /* ===========================================================================
     9. Zoom viewer — full screen; pointer-pan (mouse), native scroll + pinch
        (touch), swipe / arrow keys between photos, + / − to zoom
     ======================================================================== */
  function openViewer(frameIndex) {
    var f = FRAMES[frameIndex] || FRAMES[0];
    var photos = P.images || [];
    if (!f || !photos.length) return;
    var rtl = B.isRTL();
    var n = photos.length;
    var k = 'pdp-zoom-' + (++dialogN);
    var v = { photo: f.photo, zoomed: FINE || !!f.crop, raf: 0, cx: 0, cy: 0, tx: 0, ty: 0, maxX: 0, maxY: 0, rect: null, pointer: 'mouse' };

    var root = d.createElement('div');
    root.className = 'pdp-zoom';
    root.innerHTML =
      '<div class="pdp-zoom__stage" tabindex="0" role="img" aria-describedby="' + k + '-keys"><img class="pdp-zoom__img" alt="" draggable="false" decoding="async"></div>' +
      '<div class="pdp-zoom__ui">' +
        '<div class="pdp-zoom__meta"><p class="pdp-zoom__count"><span aria-hidden="true" data-count></span><span class="u-visually-hidden" aria-live="polite" data-live></span></p>' +
          '<p class="pdp-zoom__name">' + esc(B.loc(P.name)) + '</p></div>' +
        '<div class="pdp-zoom__nav">' +
          '<button class="c-icon-btn pdp-zoom__prev" type="button" aria-label="' + esc(B.t('a11y.previous')) + '"' + (n > 1 ? '' : ' hidden') + '>' + B.icon('arrow') + '</button>' +
          '<button class="c-icon-btn pdp-zoom__toggle" type="button" aria-pressed="false">' + B.icon('zoom') + B.icon('minus') + '</button>' +
          '<button class="c-icon-btn pdp-zoom__next" type="button" aria-label="' + esc(B.t('a11y.next')) + '"' + (n > 1 ? '' : ' hidden') + '>' + B.icon('arrow') + '</button>' +
        '</div>' +
        '<p class="pdp-zoom__hint" aria-hidden="true">' + esc(B.t(FINE ? 'product.zoom.hintFine' : 'product.zoom.hintTouch')) + '</p>' +
      '</div>' +
      '<p class="u-visually-hidden" id="' + k + '-keys">' + esc(B.t('product.zoom.keys')) + '</p>';

    var stage = $('.pdp-zoom__stage', root), img = $('.pdp-zoom__img', root), toggle = $('.pdp-zoom__toggle', root);
    var countEl = $('[data-count]', root), liveEl = $('[data-live]', root);

    function scales() {
      var sw = stage.clientWidth, sh = stage.clientHeight;
      var nw = img.naturalWidth || 1200, nh = img.naturalHeight || 1500;
      var fit = Math.min(sw / nw, sh / nh);
      var zoom = Math.min(Math.max(fit * 2, sw / nw), Math.max(fit * 1.5, 1.35));
      return { sw: sw, sh: sh, nw: nw, nh: nh, fit: fit, zoom: Math.max(zoom, fit * 1.25) };
    }
    /* size the image for the mode; focus = {fx, fy} (image fractions) to centre */
    function apply(focus) {
      var s = scales(), ks = v.zoomed ? s.zoom : s.fit;
      var W = Math.round(s.nw * ks), H = Math.round(s.nh * ks);
      img.style.width = W + 'px';
      img.style.height = H + 'px';
      root.classList.toggle('is-zoomed', v.zoomed);
      toggle.setAttribute('aria-pressed', String(v.zoomed));
      toggle.setAttribute('aria-label', B.t(v.zoomed ? 'product.zoom.out' : 'product.zoom.in'));
      v.maxX = Math.max(0, W - s.sw);
      v.maxY = Math.max(0, H - s.sh);
      v.rect = stage.getBoundingClientRect();
      var fx = focus ? focus.fx : .5, fy = focus ? focus.fy : .5;
      v.cx = v.tx = clamp(fx * W - s.sw / 2, 0, v.maxX);
      v.cy = v.ty = clamp(fy * H - s.sh / 2, 0, v.maxY);
      stage.scrollLeft = v.cx;
      stage.scrollTop = v.cy;
    }
    function centreFocus() {
      var W = img.offsetWidth || 1, H = img.offsetHeight || 1;
      return { fx: (stage.scrollLeft + stage.clientWidth / 2) / W, fy: (stage.scrollTop + stage.clientHeight / 2) / H };
    }
    function focusAt(x, y) {
      var r = img.getBoundingClientRect();
      return { fx: clamp((x - r.left) / Math.max(1, r.width), 0, 1), fy: clamp((y - r.top) / Math.max(1, r.height), 0, 1) };
    }
    function setZoom(on, focus) {
      v.zoomed = on;
      apply(on ? focus || centreFocus() : null);
    }
    function load(i, focus) {
      v.photo = i;
      var src = B.url(photos[i]);
      var done = false;
      var finish = function () {
        if (done) return;
        done = true;
        apply(focus);
        img.classList.remove('is-swapping');
      };
      stage.setAttribute('aria-label', photoAlt(i));
      countEl.textContent = B.num(pad(i + 1)) + ' / ' + B.num(pad(n));
      liveEl.textContent = B.t('a11y.image', { n: i + 1, total: n });
      if (img.getAttribute('src') === src) { finish(); return; }
      img.classList.add('is-swapping');
      img.onload = finish;
      img.onerror = finish;
      img.src = src;
      if (img.complete && img.naturalWidth) finish();
    }
    function go(dir) {
      if (n < 2) return;
      v.zoomed = FINE;
      load((v.photo + dir + n) % n, null);
    }

    /* mouse: the image follows the pointer (lerped scroll positions) */
    function tick() {
      v.raf = 0;
      v.cx += (v.tx - v.cx) * .14;
      v.cy += (v.ty - v.cy) * .14;
      if (Math.abs(v.tx - v.cx) < .5 && Math.abs(v.ty - v.cy) < .5) { v.cx = v.tx; v.cy = v.ty; }
      else v.raf = w.requestAnimationFrame(tick);
      stage.scrollLeft = v.cx;
      stage.scrollTop = v.cy;
    }
    function panTo(e, immediate) {
      var r = v.rect || (v.rect = stage.getBoundingClientRect());
      v.tx = clamp((e.clientX - r.left) / Math.max(1, r.width), 0, 1) * v.maxX;
      v.ty = clamp((e.clientY - r.top) / Math.max(1, r.height), 0, 1) * v.maxY;
      if (immediate || B.reducedMotion) {
        v.cx = v.tx; v.cy = v.ty;
        stage.scrollLeft = v.cx; stage.scrollTop = v.cy;
        return;
      }
      if (!v.raf) v.raf = w.requestAnimationFrame(tick);
    }
    stage.addEventListener('pointermove', function (e) { if (e.pointerType === 'mouse' && v.zoomed) panTo(e); });
    stage.addEventListener('pointerdown', function (e) {
      v.pointer = e.pointerType || 'mouse';
      if (v.pointer !== 'mouse') v.down = { x: e.clientX, y: e.clientY, t: Date.now() };
    });
    stage.addEventListener('pointercancel', function () { v.down = null; });
    /* touch: swipe between photos (fit mode), double-tap to zoom at the finger */
    stage.addEventListener('pointerup', function (e) {
      if (v.pointer === 'mouse' || !v.down) return;
      var dx = e.clientX - v.down.x, dy = e.clientY - v.down.y, dt = Date.now() - v.down.t;
      v.down = null;
      if (!v.zoomed && Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.3) { go((dx < 0) !== rtl ? 1 : -1); return; }
      if (Math.abs(dx) > 12 || Math.abs(dy) > 12 || dt > 350) return;
      var now = Date.now();
      if (v.lastTap && now - v.lastTap < 320 && Math.abs(e.clientX - v.tapX) < 40 && Math.abs(e.clientY - v.tapY) < 40) {
        v.lastTap = 0;
        setZoom(!v.zoomed, v.zoomed ? null : focusAt(e.clientX, e.clientY));
      } else { v.lastTap = now; v.tapX = e.clientX; v.tapY = e.clientY; }
    });
    stage.addEventListener('click', function (e) {
      if (v.pointer !== 'mouse') return;
      setZoom(!v.zoomed, v.zoomed ? null : focusAt(e.clientX, e.clientY));
      if (v.zoomed) panTo(e, true);
    });
    $('.pdp-zoom__prev', root).addEventListener('click', function () { go(-1); });
    $('.pdp-zoom__next', root).addEventListener('click', function () { go(1); });
    toggle.addEventListener('click', function () { setZoom(!v.zoomed); });
    root.addEventListener('keydown', function (e) {
      var key = e.key;
      if (key === 'ArrowRight' || key === 'ArrowLeft') { e.preventDefault(); go((key === 'ArrowRight') !== rtl ? 1 : -1); }
      else if (key === '+' || key === '=') { e.preventDefault(); if (!v.zoomed) setZoom(true); }
      else if (key === '-' || key === '_') { e.preventDefault(); if (v.zoomed) setZoom(false); }
      else if ((key === 'ArrowUp' || key === 'ArrowDown') && v.zoomed) {
        e.preventDefault();
        stage.scrollTop += key === 'ArrowDown' ? 120 : -120;
        v.cy = v.ty = stage.scrollTop;
      } else if ((key === 'Enter' || key === ' ') && e.target === stage) { e.preventDefault(); setZoom(!v.zoomed); }
    });
    var onResize = debounce(function () { if (root.isConnected) apply(centreFocus()); }, 120);

    B.modal.open(root, {
      label: B.t('product.zoom.label'), size: 'full', theme: 'night', className: 'pdp-zoom-modal',
      initialFocus: '.pdp-zoom__stage',
      onClose: function () {
        w.removeEventListener('resize', onResize);
        if (v.raf) w.cancelAnimationFrame(v.raf);
      }
    });
    w.addEventListener('resize', onResize);
    load(v.photo, f.crop ? { fx: f.crop[1] / 100, fy: f.crop[2] / 100 } : null);
  }

  /* ===========================================================================
     10. Sticky add-to-bag bar — in when the main button has scrolled away
     ======================================================================== */
  var barSelect = byId('pdp-bar-size'), barSelectWrap = byId('pdp-bar-select-wrap'), barMsg = byId('pdp-bar-msg');
  var barOn = false, ctaPast = false, footerIn = false;

  function renderBarOptions() {
    if (!barSelect) return;
    if (!HAS_SIZES) { if (barSelectWrap) barSelectWrap.hidden = true; return; }
    barSelect.innerHTML = '<option value="">' + esc(B.t('product.size')) + '</option>' + P.sizes.map(function (s) {
      var out = SOLD.indexOf(s) > -1;
      return '<option value="' + s + '"' + (out ? ' disabled' : '') + '>' + esc(out ? B.t('product.sizeSoldOut', { size: B.num(s) }) : B.num(s)) + '</option>';
    }).join('');
    barSelect.value = state.size == null ? '' : String(state.size);
  }

  function renderBar() {
    var thumb = byId('pdp-bar-thumb');
    if (thumb && P.images && P.images[0]) {
      thumb.innerHTML = '<img src="' + esc(B.url(P.images[0])) + '" alt="" width="1200" height="1500" loading="lazy" decoding="async">';
    }
    var price = byId('pdp-bar-price');
    if (price) price.setAttribute('data-price', P.price);
    renderBarOptions();
  }

  function setBar(on) {
    if (on === barOn) return;
    barOn = on;
    bar.classList.toggle('is-on', on);
    if (on) bar.removeAttribute('inert');
    else {
      bar.setAttribute('inert', '');
      if (bar.contains(d.activeElement)) focusEl(addBtn);
      if (barMsg) barMsg.textContent = '';
      if (barSelectWrap) barSelectWrap.classList.remove('is-invalid');
    }
    html.classList.toggle('pdp-bar-on', on);
  }

  function initBar() {
    bar.setAttribute('inert', '');
    var measure = function () { html.style.setProperty('--pdp-bar-h', bar.offsetHeight + 'px'); };
    measure();
    w.addEventListener('resize', debounce(measure, 150));
    if (barSelect) barSelect.addEventListener('change', function () { setSize(barSelect.value, 'bar'); });
    var barAdd = byId('pdp-bar-add');
    if (barAdd) barAdd.addEventListener('click', function () { addToBag('bar'); });
    if (!('IntersectionObserver' in w)) return;
    /* The roots are stretched so each observer reports a STATE, not only a crossing:
       a jump (anchor, scrollIntoView, fast fling) from "below" straight to "above"
       still flips it. CTA: intersects unless scrolled past · footer: once reached. */
    var cta = byId('pdp-actions');
    if (cta) {
      new IntersectionObserver(function (entries) {
        ctaPast = !entries[entries.length - 1].isIntersecting;
        setBar(ctaPast && !footerIn);
      }, { rootMargin: '0px 0px 1000000px 0px' }).observe(cta);
    }
    var footer = byId('site-footer');
    if (footer) {
      new IntersectionObserver(function (entries) {
        footerIn = entries[entries.length - 1].isIntersecting;
        setBar(ctaPast && !footerIn);
      }, { rootMargin: '1000000px 0px 0px 0px' }).observe(footer);
    }
  }

  /* ===========================================================================
     11. The leather (snapshot hides, click = choose) · atelier tag (live)
     ======================================================================== */
  var hidesEl = byId('pdp-hides');
  var snaps = {};

  function renderHides() {
    if (!hidesEl) return;
    var other = otherLang();
    hidesEl.style.setProperty('--n', String(clamp(COLORS.length, 1, 4)));
    hidesEl.innerHTML = COLORS.map(function (c, i) {
      var L = leatherById(c.id) || {};
      return '<button class="pdp-hide" type="button" data-hide="' + esc(c.id) + '" aria-pressed="' + (c.id === state.color) + '"' +
        ' aria-label="' + esc(B.t('product.leathers.choose', { color: B.loc(c.name) })) + '" style="--swatch:' + esc(c.hex) + '">' +
          '<span class="pdp-hide__media"><img alt="" width="720" height="900" decoding="async"' + (snaps[c.id] ? ' class="is-loaded" src="' + snaps[c.id] + '"' : '') + '>' +
            '<span class="pdp-hide__chips">' +
              (i === 0 ? '<span class="pdp-hide__chip" data-i18n="product.leathers.pictured">' + esc(B.t('product.leathers.pictured')) + '</span>' : '') +
              '<span class="pdp-hide__chip pdp-hide__chip--choice">' + B.icon('check', { size: 12 }) + '<span data-i18n="product.leathers.selected">' + esc(B.t('product.leathers.selected')) + '</span></span>' +
            '</span></span>' +
          '<span class="pdp-hide__body"><span class="pdp-hide__head">' +
            '<span class="pdp-hide__name" data-hide-name>' + esc(B.loc(c.name)) + '</span>' +
            '<span class="pdp-hide__alt" lang="' + other + '" data-hide-alt>' + esc((c.name && c.name[other]) || '') + '</span></span>' +
            '<span class="pdp-hide__text" data-hide-text>' + esc(B.loc(L.description)) + '</span></span>' +
        '</button>';
    }).join('');
  }

  function localizeHides() {
    if (!hidesEl) return;
    var other = otherLang();
    $$('[data-hide]', hidesEl).forEach(function (b) {
      var c = colorById(b.getAttribute('data-hide')), L = leatherById(c.id) || {};
      b.setAttribute('aria-label', B.t('product.leathers.choose', { color: B.loc(c.name) }));
      var nm = $('[data-hide-name]', b), alt = $('[data-hide-alt]', b), tx = $('[data-hide-text]', b);
      if (nm) nm.textContent = B.loc(c.name);
      if (alt) { alt.textContent = (c.name && c.name[other]) || ''; alt.setAttribute('lang', other); }
      if (tx) tx.textContent = B.loc(L.description);
    });
  }

  function syncHides() {
    if (!hidesEl) return;
    $$('[data-hide]', hidesEl).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-hide') === state.color)); });
  }

  function renderSnapshots() {
    if (!B.Leather || !B.Leather.snapshot) return;
    COLORS.forEach(function (c, i) {
      if (snaps[c.id]) return;
      var L = leatherById(c.id) || {};
      var opts = B.Leather.preset('swatch', { color: c.hex, grain: L.grain || 'smooth', seed: i + 3, dpr: 2 });
      B.Leather.snapshot(opts, 720, 900).then(function (url) {
        if (!url) return;
        snaps[c.id] = url;
        var img = $('[data-hide="' + c.id + '"] img', hidesEl);
        if (!img) return;
        img.onload = function () { img.classList.add('is-loaded'); };
        img.src = url;
      }, function () { /* the flat leather colour stays */ });
    });
  }

  function initHides() {
    if (!hidesEl) return;
    hidesEl.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('[data-hide]');
      if (b) setColor(b.getAttribute('data-hide'), 'hide');
    });
    whenNear(hidesEl, '900px 0px', renderSnapshots);
  }

  /* Atelier band (personalisable pieces only) */
  var atelierSec = byId('pdp-atelier'), tagEl = byId('pdp-atelier-tag'), tag = null;
  function tagLabel() { return B.t('product.atelier.preview', { color: B.loc((colorById(state.color) || {}).name) }); }

  function renderAtelier() {
    if (!atelierSec) return;
    atelierSec.hidden = !P.personalisable;
    if (!P.personalisable) return;
    var text = byId('pdp-atelier-text'), fee = byId('pdp-atelier-fee');
    if (text) text.textContent = B.t('product.atelier.text', { name: B.loc(P.name) });
    if (fee) fee.textContent = B.t('product.atelier.fee', { amount: B.price(+CONFIG.personalisationFee || 0) });
    updateAtelier();
  }

  function updateAtelier() {
    if (!P.personalisable) return;
    var link = byId('pdp-atelier-link');
    if (link) link.setAttribute('href', B.url('atelier.html?item=' + encodeURIComponent(P.id) + (state.color ? '&leather=' + encodeURIComponent(state.color) : '')));
    var c = colorById(state.color), L = leatherById(state.color) || {};
    if (!c) return;
    if (tag) { try { tag.set({ color: c.hex, grain: L.grain || 'pebble', label: tagLabel() }); } catch (e) { console.error(e); } }
    else if (tagEl) tagEl.style.setProperty('--tag-color', c.hex);
  }

  function createTag() {
    if (tag || !tagEl || !B.Leather || !B.Leather.create) return;
    var c = colorById(state.color) || {}, L = leatherById(state.color) || {};
    try {
      tagEl.innerHTML = '';
      tagEl.classList.add('is-live');
      tag = B.Leather.create(tagEl, B.Leather.preset('atelier', {
        color: c.hex, grain: L.grain || 'pebble', mark: { type: 'text', text: 'KH', font: 'serif' }, track: 'window', label: tagLabel()
      }));
    } catch (e) { console.error(e); tag = null; }
  }

  function initAtelier() {
    if (!P.personalisable || !tagEl) return;
    whenNear(atelierSec, '700px 0px', createTag);
  }

  /* ===========================================================================
     12. Complete the look · recently viewed (localStorage 'benm:recent')
     ======================================================================== */
  function relatedIds() {
    var ids = [];
    var push = function (id) { if (id && id !== P.id && ids.indexOf(id) < 0 && B.findProduct(id)) ids.push(id); };
    (P.related || []).forEach(push);
    if (ids.length < 4) B.products(function (q) { return q.category === P.category; }).forEach(function (q) { push(q.id); });
    if (ids.length < 4) PRODUCTS.forEach(function (q) { push(q.id); });
    return ids.slice(0, 4);
  }
  function renderRelated() {
    var el = byId('pdp-related');
    if (!el) return;
    el.innerHTML = relatedIds().map(function (id) { return B.productCard(id, { heading: 'h3' }); }).join('');
  }

  function readRecent() {
    try {
      var a = JSON.parse(w.localStorage.getItem(RECENT_KEY) || '[]');
      return Array.isArray(a) ? a.filter(function (id, i) { return typeof id === 'string' && a.indexOf(id) === i && B.findProduct(id); }) : [];
    } catch (e) { return []; }
  }
  function writeRecent(list) {
    try { w.localStorage.setItem(RECENT_KEY, JSON.stringify(list)); } catch (e) { /* storage blocked */ }
  }
  function renderRecent() {
    var sec = byId('pdp-recent'), track = byId('pdp-recent-track');
    if (!sec || !track) return;
    var others = readRecent().filter(function (id) { return id !== P.id; }).slice(0, RECENT_MAX);
    writeRecent([P.id].concat(others));
    sec.hidden = !others.length;
    track.innerHTML = others.map(function (id) { return B.productCard(id, { variant: 'compact', heading: 'h3' }); }).join('');
    var clear = byId('pdp-recent-clear');
    if (clear && !clear.__pdp) {
      clear.__pdp = true;
      clear.addEventListener('click', function () {
        writeRecent([P.id]);
        sec.hidden = true;
        track.innerHTML = '';
        focusEl(byId('pdp-related-title'));
        B.refresh();
      });
    }
  }

  /* ===========================================================================
     13. Boot · language · currency
     ======================================================================== */
  function correctUrl() {
    if (REQUESTED === P.id) return;
    try {
      var file = w.location.pathname.split('/').pop() || 'product.html';
      w.history.replaceState(w.history.state, '', file + '?id=' + encodeURIComponent(P.id) + w.location.hash);
    } catch (e) { /* sandboxed or file:// restrictions — the page still shows the product */ }
  }

  B.page(function () {
    hero.setAttribute('data-product-id', P.id);
    bar.setAttribute('data-product-id', P.id);
    var price = byId('pdp-price'), addPrice = byId('pdp-add-price');
    if (price) price.setAttribute('data-price', P.price);
    if (addPrice) addPrice.setAttribute('data-price', P.price);

    renderHead();
    renderMeta();
    renderGallery();
    renderSwatches();
    updateColorTexts();
    renderSizes();
    renderDetails();
    renderAssure();
    renderShip();
    renderHides();
    renderAtelier();
    renderRelated();
    renderRecent();
    renderBar();
    updateWa();

    B.i18n.apply(byId('pdp'));
    B.i18n.apply(bar);

    initGallery();
    initBuy();
    initBar();
    initHides();
    initAtelier();
    correctUrl();

    updateSticky();
    w.addEventListener('resize', debounce(function () { fitSizes(); updateSticky(); }, 120));
    onMq(DESKTOP, function () { updateSticky(); updateHud(); });
    if ('ResizeObserver' in w) new ResizeObserver(debounce(updateSticky, 60)).observe(info);
  });

  B.on('langchange', function () {
    renderHead();
    renderMeta();
    renderSwatches();
    updateColorTexts();
    renderSizes();
    renderBarOptions();
    renderDetails();
    renderAssure();
    renderShip();
    localizeHides();
    localizeGallery();
    renderAtelier();
    updateWa();
    B.refresh();
  });

  B.on('currencychange', function () {
    renderAssure();
    renderShip();
    renderAtelier();
    updateWa();
  });
})(window, document);
