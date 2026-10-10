/* =============================================================================
   Ben.M — style guide page                         assets/js/pages/styleguide.js
   -----------------------------------------------------------------------------
   Living reference + Foundation test bed. Registers its strings (sg.*), renders
   the data-driven demos (colour ramps, leathers, sizes, icons, product cards)
   and wires the overlay demo buttons. Everything else is declarative markup
   handled by main.js.
   ========================================================================== */
(function (w, d) {
  'use strict';
  var B = w.BENM;
  if (!B) return;

  /* ---------------------------------------------------------------------------
     1. Strings
     ------------------------------------------------------------------------ */
  B.i18n.add({
    en: {
      'sg.meta.title': 'House style — Ben.M',
      'sg.meta.description': 'The Ben.M design system: colour, type, components and motion.',
      'sg.index': 'Contents',
      'sg.hero.eyebrow': 'Ben.M — Design system',
      'sg.hero.version': 'Foundation',
      'sg.hero.title': 'The house <em>style</em>',
      'sg.hero.lead': 'Every colour, letter and gesture of Ben.M in one place — the shared foundation every page is built from.',
      'sg.nav.colour': 'Colour',
      'sg.nav.type': 'Typography',
      'sg.nav.buttons': 'Buttons & links',
      'sg.nav.forms': 'Forms',
      'sg.nav.controls': 'Controls',
      'sg.nav.cards': 'Product cards',
      'sg.nav.overlays': 'Overlays',
      'sg.nav.motion': 'Motion',
      'sg.nav.themes': 'Themes',
      'sg.colour.title': 'Emerald <em>&amp;</em> Gilt',
      'sg.colour.text': 'Green is the stage, ivory is the paper, gold is the jewellery — used like foil: hairlines, numerals, small caps and the logo.',
      'sg.colour.greens': 'Greens',
      'sg.colour.golds': 'Golds',
      'sg.colour.neutrals': 'Paper & ink',
      'sg.colour.brand': 'Logo',
      'sg.colour.foil': 'Gold foil — hairlines, numerals, sheens',
      'sg.type.title': 'Type in <em>two scripts</em>',
      'sg.type.text': 'Cormorant Garamond and Poppins for English; Noto Naskh Arabic and Noto Sans Arabic for Kurdish — never tracked, never slanted.',
      'sg.type.sample': 'Made to <em>last</em>',
      'sg.type.h4': 'The Azmar Oxford, cap-toe',
      'sg.type.quote': '“Leather chosen by hand. Stitched with patience.”',
      'sg.type.body': 'Leather chosen by hand. Stitched with patience. Finished slowly, so that it can be worn for years.',
      'sg.type.eyebrow': 'The craft · Stitching',
      'sg.type.caption': 'The Azmar Oxford',
      'sg.btn.title': 'Buttons <em>&amp; links</em>',
      'sg.btn.text': 'Square corners, small caps, a foil sheen on hover. The label rolls, the arrow stretches, and the key actions are magnetic.',
      'sg.btn.light': 'On ivory',
      'sg.btn.dark': 'On green',
      'sg.btn.primary': 'Shop the collection',
      'sg.btn.ghost': 'Discover the craft',
      'sg.forms.title': 'Forms, <em>quietly</em>',
      'sg.forms.text': 'Underlined fields with floating labels; errors in plain words, in both languages. Send the empty form to see them.',
      'sg.forms.care': 'Care & repair',
      'sg.forms.order': 'An order',
      'sg.ctrl.title': 'Chips, swatches <em>&amp; sizes</em>',
      'sg.ctrl.text': 'Small controls with generous touch targets — every one of them at least 44 pixels.',
      'sg.ctrl.chips': 'Chips',
      'sg.ctrl.badges': 'Badges',
      'sg.ctrl.switches': 'Language & currency',
      'sg.ctrl.swatches': 'Leather colours',
      'sg.ctrl.sizes': 'Sizes',
      'sg.ctrl.breadcrumbs': 'Breadcrumbs',
      'sg.ctrl.tabs': 'Tabs',
      'sg.ctrl.icons': 'Icons',
      'sg.tabs.description': 'Description',
      'sg.tabs.details': 'Details & materials',
      'sg.tabs.care': 'Care',
      'sg.cards.title': 'The product <em>card</em>',
      'sg.cards.text': 'One card everywhere — hover for the second photograph, quick add, the gold hairline and the heart.',
      'sg.cards.dark': 'On the <em>dark</em> stage',
      'sg.cards.compact': 'Compact — <em>search &amp; related</em>',
      'sg.ov.title': 'Overlays <em>&amp; feedback</em>',
      'sg.ov.text': 'Every layer closes with Esc, keeps focus inside, and gives it back when it leaves.',
      'sg.ov.modal': 'Open a dialog',
      'sg.ov.toast': 'Show a toast',
      'sg.ov.bag': 'Open the bag',
      'sg.ov.saved': 'Open saved',
      'sg.ov.search': 'Open search',
      'sg.ov.menu': 'Open the menu',
      'sg.ov.dialogTitle': 'A quiet <em>dialog</em>',
      'sg.ov.dialogText': 'Esc closes it, focus stays inside, and afterwards returns to the button that opened it.',
      'sg.ov.toastMsg': 'This is how the House speaks: briefly.',
      'sg.motion.title': 'Motion, <em>slowly</em>',
      'sg.motion.text': 'Add an attribute and the foundation does the rest — and nothing moves for those who ask for stillness.',
      'sg.motion.lines': 'Text rises line by line out of its mask, like a page being turned.',
      'sg.motion.words': 'Word by word — never letter by letter.',
      'sg.motion.reduced': 'With reduced motion, everything is simply there.',
      'sg.motion.pieces': 'Pieces in the demo collection',
      'sg.motion.leathers': 'House leathers',
      'sg.motion.boutiques': 'Boutiques',
      'sg.motion.languages': 'Languages',
      'sg.themes.title': 'Five <em>stages</em>',
      'sg.themes.text': 'A section declares its stage with one class; text, gold, hairlines, buttons and cards follow.',
      'sg.themes.sample': 'Leather chosen by hand',
      'sg.lab': 'Test page (page transition)'
    },
    ckb: {
      'sg.meta.title': 'شێوازی ماڵەکە — Ben.M',
      'sg.meta.description': 'سیستەمی دیزاینی Ben.M: ڕەنگ، پیت، پێکهاتەکان و جووڵە.',
      'sg.index': 'ناوەڕۆک',
      'sg.hero.eyebrow': 'Ben.M — سیستەمی دیزاین',
      'sg.hero.version': 'بنچینە',
      'sg.hero.title': 'شێوازی <em>ماڵەکە</em>',
      'sg.hero.lead': 'هەموو ڕەنگ، پیت و جووڵەیەکی Ben.M لە یەک شوێندا — ئەو بنچینە هاوبەشەی هەموو پەڕەکان لەسەری بنیات دەنرێن.',
      'sg.nav.colour': 'ڕەنگ',
      'sg.nav.type': 'پیت',
      'sg.nav.buttons': 'دوگمە و بەستەر',
      'sg.nav.forms': 'فۆرم',
      'sg.nav.controls': 'کۆنترۆڵ',
      'sg.nav.cards': 'کارتی بەرهەم',
      'sg.nav.overlays': 'پەنجەرەکان',
      'sg.nav.motion': 'جووڵە',
      'sg.nav.themes': 'ڕووکارەکان',
      'sg.colour.title': 'زمرووت و <em>زێڕ</em>',
      'sg.colour.text': 'سەوز شانۆکەیە، عاجی کاغەزەکەیە، زێڕیش خشڵەکەیە — وەک فۆیل بەکاردێت: هێڵی باریک، ژمارە، پیتی بچووک و لۆگۆ.',
      'sg.colour.greens': 'سەوزەکان',
      'sg.colour.golds': 'زێڕینەکان',
      'sg.colour.neutrals': 'کاغەز و مەرەکەب',
      'sg.colour.brand': 'لۆگۆ',
      'sg.colour.foil': 'فۆیلی زێڕین — هێڵی باریک، ژمارە، درەوشانەوە',
      'sg.type.title': 'پیت بە <em>دوو ئەلفوبێ</em>',
      'sg.type.text': 'کۆرمۆرانت گاراموند و پۆپینز بۆ ئینگلیزی؛ نۆتۆ نەسخ و نۆتۆ سانس بۆ کوردی — پیتەکان هەرگیز لێک دوور ناخرێنەوە و لار ناکرێن.',
      'sg.type.sample': 'بۆ <em>مانەوە</em> دروستکراوە',
      'sg.type.h4': 'ئۆکسفۆردی ئەزمەڕ، بە سەرەپەنجەی دوورراو',
      'sg.type.quote': '«چەرم بە دەست هەڵدەبژێردرێت. بە پشوودرێژی دەدوورێت.»',
      'sg.type.body': 'چەرم بە دەست هەڵدەبژێردرێت، بە پشوودرێژی دەدوورێت، و بە هێمنی تەواو دەکرێت، بۆ ئەوەی ساڵانێک لەبەر بکرێت.',
      'sg.type.eyebrow': 'وەستایی · دوورین',
      'sg.type.caption': 'ئۆکسفۆردی ئەزمەڕ',
      'sg.btn.title': 'دوگمە و <em>بەستەرەکان</em>',
      'sg.btn.text': 'گۆشەی ڕاست، پیتی بچووک، و درەوشانەوەیەکی زێڕین کاتێک ماوس دەچێتە سەری. نووسینەکە دەخولێتەوە، تیرەکە درێژ دەبێتەوە، و دوگمە سەرەکییەکان ماوس ڕادەکێشن.',
      'sg.btn.light': 'لەسەر عاجی',
      'sg.btn.dark': 'لەسەر سەوز',
      'sg.btn.primary': 'سەیری کۆلێکشنەکە بکە',
      'sg.btn.ghost': 'وەستاییەکە بدۆزەرەوە',
      'sg.forms.title': 'فۆرمەکان، <em>بە هێمنی</em>',
      'sg.forms.text': 'خانەی هێڵدار لەگەڵ ناونیشانی جووڵاو؛ هەڵەکان بە زمانێکی ڕوون و بە هەردوو زمان. فۆرمە بەتاڵەکە بنێرە بۆ ئەوەی بیانبینیت.',
      'sg.forms.care': 'چاودێری و چاککردنەوە',
      'sg.forms.order': 'داواکارییەک',
      'sg.ctrl.title': 'چیپ، ڕەنگ و <em>قەبارە</em>',
      'sg.ctrl.text': 'کۆنترۆڵی بچووک بە ناوچەی دەستلێدانی فراوان — هەر یەکەیان لانیکەم ٤٤ پیکسڵ.',
      'sg.ctrl.chips': 'چیپەکان',
      'sg.ctrl.badges': 'نیشانەکان',
      'sg.ctrl.switches': 'زمان و دراو',
      'sg.ctrl.swatches': 'ڕەنگەکانی چەرم',
      'sg.ctrl.sizes': 'قەبارەکان',
      'sg.ctrl.breadcrumbs': 'ڕێڕەوی پەڕە',
      'sg.ctrl.tabs': 'تابەکان',
      'sg.ctrl.icons': 'ئایکۆنەکان',
      'sg.tabs.description': 'وەسف',
      'sg.tabs.details': 'وردەکاری و کەرەستە',
      'sg.tabs.care': 'چاودێری',
      'sg.cards.title': 'کارتی <em>بەرهەم</em>',
      'sg.cards.text': 'یەک کارت لە هەموو شوێنێک — ماوسەکەت بهێنە سەری بۆ وێنەی دووەم، زیادکردنی خێرا، هێڵی زێڕین و دڵەکە.',
      'sg.cards.dark': 'لەسەر شانۆی <em>تاریک</em>',
      'sg.cards.compact': 'بچووک — <em>گەڕان و پەیوەندیدار</em>',
      'sg.ov.title': 'پەنجەرە و <em>وەڵامدانەوە</em>',
      'sg.ov.text': 'هەموو چینێک بە Esc دادەخرێت، فۆکەس لە ناو خۆیدا دەهێڵێتەوە، و لە کاتی داخستندا دەیگەڕێنێتەوە.',
      'sg.ov.modal': 'کردنەوەی پەنجەرەیەک',
      'sg.ov.toast': 'پیشاندانی ئاگادارییەک',
      'sg.ov.bag': 'کردنەوەی سەبەتە',
      'sg.ov.saved': 'کردنەوەی دڵخوازەکان',
      'sg.ov.search': 'کردنەوەی گەڕان',
      'sg.ov.menu': 'کردنەوەی مێنو',
      'sg.ov.dialogTitle': 'پەنجەرەیەکی <em>هێمن</em>',
      'sg.ov.dialogText': 'Esc دایدەخات، فۆکەس لە ناویدا دەمێنێتەوە، و پاشان دەگەڕێتەوە بۆ ئەو دوگمەیەی کردییەوە.',
      'sg.ov.toastMsg': 'ماڵەکە بەم شێوەیە قسە دەکات: بە کورتی.',
      'sg.motion.title': 'جووڵە، <em>بە هێواشی</em>',
      'sg.motion.text': 'تەنها تایبەتمەندییەک زیاد بکە و بنچینەکە ئەوانی تر دەکات — و بۆ ئەوانەی داوای بێجووڵەیی دەکەن، هیچ شتێک ناجووڵێت.',
      'sg.motion.lines': 'دەق هێڵ بە هێڵ لە ناو دەمامکەکەیەوە بەرز دەبێتەوە، وەک هەڵدانەوەی لاپەڕەیەک.',
      'sg.motion.words': 'وشە بە وشە — هەرگیز پیت بە پیت.',
      'sg.motion.reduced': 'لەگەڵ جووڵەی کەمکراوە، هەموو شتێک یەکسەر لە شوێنی خۆیدایە.',
      'sg.motion.pieces': 'پارچە لە کۆلێکشنی نموونەدا',
      'sg.motion.leathers': 'چەرمی ماڵەکە',
      'sg.motion.boutiques': 'فرۆشگا',
      'sg.motion.languages': 'زمان',
      'sg.themes.title': 'پێنج <em>شانۆ</em>',
      'sg.themes.text': 'هەر بەشێک بە یەک کلاس شانۆکەی خۆی دیاری دەکات؛ دەق، زێڕ، هێڵ، دوگمە و کارتەکان شوێنی دەکەون.',
      'sg.themes.sample': 'چەرم بە دەست هەڵدەبژێردرێت',
      'sg.lab': 'پەڕەی تاقیکردنەوە (گواستنەوەی پەڕە)'
    }
  });

  /* ---------------------------------------------------------------------------
     2. Data for the demos
     ------------------------------------------------------------------------ */
  var RAMPS = [
    { key: 'sg.colour.greens', items: [['--c-green-950', '#07120E'], ['--c-green-900', '#0C1D17'], ['--c-green-800', '#132A22'],
      ['--c-green-700', '#1F3E35', 1], ['--c-green-600', '#2C5446'], ['--c-green-500', '#3F6E5E'], ['--c-sage-300', '#9DB5AA']] },
    { key: 'sg.colour.golds', items: [['--c-gold-800', '#7A5B2B'], ['--c-gold-700', '#8C6A34'], ['--c-gold-600', '#A88246'],
      ['--c-gold-500', '#C4A062', 1], ['--c-gold-400', '#D6B97F'], ['--c-gold-300', '#E8D6AC'], ['--c-gold-100', '#F6EEDC']] },
    { key: 'sg.colour.neutrals', items: [['--c-white', '#FFFDF8'], ['--c-ivory', '#F4EFE5'], ['--c-paper', '#EBE3D3'],
      ['--c-sand', '#D7CAB0'], ['--c-stone', '#5F655E'], ['--c-ink', '#0F1613']] }
  ];
  var CARDS_LIGHT = ['azmar-oxford', 'nergiz-pump', 'nawroz-tote', 'dijla-belt'];
  var CARDS_DARK = ['zagros-chelsea-boot', 'hawler-briefcase', 'shilan-loafer'];
  var CARDS_COMPACT = ['safeen-penny-loafer', 'qalat-crossbody', 'zab-card-holder', 'hiva-ankle-boot', 'sirwan-clutch', 'slemani-bifold'];

  function $(id) { return d.getElementById(id); }
  function luminance(hex) {
    var n = parseInt(hex.slice(1), 16);
    var c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(function (v) {
      v /= 255;
      return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4);
    });
    return .2126 * c[0] + .7152 * c[1] + .0722 * c[2];
  }

  /* ---------------------------------------------------------------------------
     3. Renderers
     ------------------------------------------------------------------------ */
  function renderRamps() {
    var el = $('sg-ramps');
    if (!el) return;
    el.innerHTML = RAMPS.map(function (r) {
      return '<div class="sg-ramp" data-reveal="up" data-reveal-stagger=".05">' +
        '<p class="sg-demo__label sg-ramp__label" data-i18n="' + r.key + '">' + B.esc(B.t(r.key)) + '</p>' +
        '<div class="sg-ramp__row">' + r.items.map(function (it) {
          var dark = luminance(it[1]) < .22;
          return '<div class="sg-swatch' + (dark ? ' is-dark' : '') + (it[2] ? ' is-brand' : '') + '" style="background:var(' + it[0] + ')">' +
            (it[2] ? '<span class="sg-swatch__brand" data-i18n="sg.colour.brand">' + B.esc(B.t('sg.colour.brand')) + '</span>' : '') +
            '<code>' + it[0] + '</code><span class="sg-swatch__hex">' + it[1] + '</span></div>';
        }).join('') + '</div></div>';
    }).join('');
  }

  function renderTaglines() {
    var el = $('sg-taglines'), brand = w.BENM_BRAND;
    if (!el || !brand) return;
    el.innerHTML = '<span class="sg-hero__tag sg-hero__tag--en">' + brand.svg('taglineEn') + '</span>' +
      '<span class="c-diamond" aria-hidden="true"></span>' +
      '<span class="sg-hero__tag sg-hero__tag--ku">' + brand.svg('taglineKu') + '</span>';
  }

  function renderSpecimens() {
    var p = B.findProduct('azmar-oxford');
    if (!p) return;
    if ($('sg-en-body')) $('sg-en-body').textContent = p.description.en;
    if ($('sg-ku-body')) $('sg-ku-body').textContent = p.description.ckb;
  }

  function renderSwatches() {
    var el = $('sg-swatches'), list = w.BENM_LEATHERS || [];
    if (!el) return;
    var current = (el.querySelector('[aria-pressed="true"]') || {}).getAttribute ? el.querySelector('[aria-pressed="true"]').getAttribute('data-value') : list[0] && list[0].id;
    el.innerHTML = list.map(function (l) {
      return '<button class="c-swatch" type="button" style="--swatch:' + l.hex + '" data-value="' + l.id + '" aria-pressed="' + (l.id === current) + '" aria-label="' + B.esc(B.loc(l.name)) + '"></button>';
    }).join('');
    swatchName();
  }
  function swatchName() {
    var el = $('sg-swatches'), out = $('sg-swatch-name');
    if (!el || !out) return;
    var on = el.querySelector('[aria-pressed="true"]');
    var l = (w.BENM_LEATHERS || []).filter(function (x) { return on && x.id === on.getAttribute('data-value'); })[0];
    out.textContent = l ? B.loc(l.name) : '';
  }

  function renderSizes() {
    var el = $('sg-sizes'), p = B.findProduct('azmar-oxford');
    if (!el || !p) return;
    var current = el.querySelector('[aria-pressed="true"]');
    current = current ? +current.getAttribute('data-value') : 42;
    el.innerHTML = p.sizes.map(function (s) {
      var out = p.soldOut.indexOf(s) > -1;
      return '<button class="c-size" type="button" data-value="' + s + '" aria-pressed="' + (s === current) + '"' +
        (out ? ' disabled title="' + B.esc(B.t('product.sizeSoldOut', { size: B.num(s) })) + '"' : '') + '>' + B.num(s) + '</button>';
    }).join('');
  }

  function renderIcons() {
    var el = $('sg-icons');
    if (!el) return;
    el.innerHTML = Object.keys(w.BENM_ICONS || {}).map(function (name) {
      return '<li class="sg-icon">' + B.icon(name) + '<code>' + name + '</code></li>';
    }).join('');
  }

  function renderDetails() {
    var el = $('sg-details'), p = B.findProduct('azmar-oxford');
    if (!el || !p) return;
    el.innerHTML = (p.details[B.lang] || p.details.en).map(function (line) {
      return '<li>' + B.esc(line) + '</li>';
    }).join('');
  }

  function renderCards() {
    var light = $('sg-cards-light'), dark = $('sg-cards-dark'), compact = $('sg-cards-compact');
    if (light) {
      light.innerHTML = CARDS_LIGHT.map(function (id, i) { return B.productCard(id, { index: i + 1 }); }).join('');
      light.setAttribute('data-reveal', 'up');
      light.setAttribute('data-reveal-stagger', '.09');
    }
    if (dark) {
      dark.innerHTML = CARDS_DARK.map(function (id) { return B.productCard(id, { variant: 'dark' }); }).join('');
      dark.setAttribute('data-reveal', 'up');
      dark.setAttribute('data-reveal-stagger', '.09');
    }
    if (compact) {
      compact.innerHTML = CARDS_COMPACT.map(function (id) { return B.productCard(id, { variant: 'compact', heading: 'h4' }); }).join('');
      compact.setAttribute('data-reveal', 'up');
      compact.setAttribute('data-reveal-stagger', '.06');
    }
  }

  /* ---------------------------------------------------------------------------
     4. Demo actions (overlays & feedback)
     ------------------------------------------------------------------------ */
  function openDialog() {
    B.modal.open(
      '<div class="c-modal__body sg-dialog">' +
        '<p class="c-eyebrow c-eyebrow--line" data-i18n="sg.nav.overlays">Overlays</p>' +
        '<h2 class="sg-h3" id="sg-dialog-title" data-i18n-html="sg.ov.dialogTitle">A quiet <em>dialog</em></h2>' +
        '<p class="t-body t-muted" data-i18n="sg.ov.dialogText"></p>' +
        '<div class="u-cluster" style="--cluster-gap:12px">' +
          '<button class="c-btn c-btn--primary c-btn--sm" type="button" data-modal-close><span class="c-btn__label"><span data-i18n="common.close">Close</span></span></button>' +
          '<button class="c-btn c-btn--ghost c-btn--sm" type="button" data-sg-toast><span class="c-btn__label"><span data-i18n="sg.ov.toast">Show a toast</span></span></button>' +
        '</div>' +
      '</div>',
      { size: 'sm', labelledBy: 'sg-dialog-title' }
    );
  }

  d.addEventListener('click', function (e) {
    var tg = e.target.closest ? e.target : null;
    if (!tg) return;
    if (tg.closest('[data-sg-modal]')) openDialog();
    else if (tg.closest('[data-sg-toast]')) B.toast(B.t('sg.ov.toastMsg'), { icon: 'sparkle' });
    else if (tg.closest('[data-sg-search]')) B.searchUI.open();
    else if (tg.closest('[data-sg-menu]')) B.menu.open();
  });
  d.addEventListener('benm:select', function (e) {
    if (e.target && e.target.id === 'sg-swatches') swatchName();
  });

  /* ---------------------------------------------------------------------------
     5. Lifecycle
     ------------------------------------------------------------------------ */
  B.page(function () {
    renderTaglines();
    renderRamps();
    renderSpecimens();
    renderSwatches();
    renderSizes();
    renderIcons();
    renderDetails();
    renderCards();
  });
  B.on('langchange', function () {
    swatchName();
    renderSwatches();
    renderSizes();
    renderDetails();
  });
})(window, document);
