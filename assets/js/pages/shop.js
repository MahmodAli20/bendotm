/* =============================================================================
   Ben.M — Shop · the collection page                       assets/js/pages/shop.js
   -----------------------------------------------------------------------------
   01 Strings · 02 Data & state · 03 URL ⇄ state · 04 Query (scope → filters →
   sort) · 05 Hero · 06 Category tabs · 07 Toolbar (count · sort · density)
   08 Active filters · 09 Grid (cards, editorial tiles, FLIP) · 10 Empty states
   11 End of list & band · 12 Filter panel · 13 In-page navigation · 14 Boot
   URL contract: ?cat=men|women|bags|accessories · ?q= · ?new=1 · ?saved=1
   (+ type, color, size, min, max, sort — written back with history.replaceState)
   ========================================================================== */
(function (B, w, d) {
  'use strict';
  if (!B || !B.i18n) return;

  /* ===========================================================================
     01  Strings — EN + Central Kurdish (Sorani)
     ======================================================================== */
  B.i18n.add({
    en: {
      'shop.meta.title': 'The collection — Ben.M',
      'shop.meta.description': 'Shoes, bags, belts and wallets in genuine leather — the Ben.M collection.',
      'shop.meta.titleFor': '{title} — Ben.M',
      'shop.title.all': 'The collection',
      'shop.title.new': 'New arrivals',
      'shop.title.saved': 'Saved',
      'shop.title.query': '“{q}”',
      'shop.title.searchPre': 'Search results for',
      'shop.lead.all': 'Leather chosen by hand. <em>Stitched with patience.</em>',
      'shop.intro.all': 'Shoes, bags and small leather goods in genuine leather — each piece cut, stitched and finished slowly, so that it can be used for years.',
      'shop.lead.new': 'The newest pieces, <em>fresh from the bench.</em>',
      'shop.intro.new': 'New shapes and new leathers, made with the same patience as everything else we make.',
      'shop.lead.saved': 'The pieces you have <em>set aside.</em>',
      'shop.intro.saved': 'Kept on this device. Move them to your bag when you are ready — or ask us about them on WhatsApp.',
      'shop.lead.search': '{n} pieces match your search.',
      'shop.lead.search_one': 'One piece matches your search.',
      'shop.lead.searchNone': 'No piece matches your search.',
      'shop.tabs.label': 'Categories',
      'shop.tabs.all': 'All',
      'shop.count': '{n} pieces',
      'shop.count_one': '1 piece',
      'shop.results': 'The pieces',
      'shop.filter': 'Filter',
      'shop.filterActive': 'Filter, {n} active',
      'shop.sort.label': 'Sort',
      'shop.sort.by': 'Sort by',
      'shop.sort.relevance': 'Best match',
      'shop.sort.recent': 'Recently saved',
      'shop.sort.featured': 'Featured',
      'shop.sort.newest': 'Newest',
      'shop.sort.priceAsc': 'Price, low to high',
      'shop.sort.priceDesc': 'Price, high to low',
      'shop.sort.price': 'Price',
      'shop.sort.recentShort': 'Recent',
      'shop.density.label': 'Pieces per row',
      'shop.density.n': '{n} per row',
      'shop.density.n_one': 'One per row',
      'shop.active.label': 'Filtered by',
      'shop.chip.remove': 'Remove filter: {label}',
      'shop.chip.size': 'EU {size}',
      'shop.clear': 'Clear all',
      'shop.panel.title': 'Filter',
      'shop.panel.type': 'Type',
      'shop.panel.colour': 'Colour',
      'shop.panel.price': 'Price',
      'shop.panel.size': 'Size (EU)',
      'shop.panel.min': 'Minimum price',
      'shop.panel.max': 'Maximum price',
      'shop.panel.sizeNote': 'Shoe sizes — bags and accessories come in one size.',
      'shop.panel.show': 'Show {n} pieces',
      'shop.panel.show_one': 'Show 1 piece',
      'shop.panel.showNone': 'No pieces match',
      'shop.empty.title': 'No pieces match this selection.',
      'shop.empty.text': 'Loosen a filter or two — or begin again with the whole collection.',
      'shop.empty.reset': 'Clear the filters',
      'shop.empty.everywhere': 'Look in every category',
      'shop.empty.all': 'View the whole collection',
      'shop.empty.searchTitle': 'Nothing found for “{q}”.',
      'shop.empty.searchText': 'Check the spelling or try a broader word — perhaps one of these:',
      'shop.empty.savedTitle': 'Your saved pieces will wait here.',
      'shop.empty.savedText': 'Tap the heart on any piece to set it aside. The list stays on this device.',
      'shop.empty.savedCta': 'Explore the collection',
      'shop.empty.newCta': 'See the new arrivals',
      'shop.empty.suggest': 'Perhaps one of these',
      'shop.end.text': 'You have seen all {n} pieces.',
      'shop.end.text_one': 'That is the one piece in this selection.',
      'shop.end.top': 'Back to top',
      'shop.end.ask': 'Looking for something in particular?',
      'shop.end.write': 'Write to us',
      'shop.end.helpMessage': 'Hello Ben.M, I am looking for a particular piece.',
      'shop.saved.ask': 'Ask about these on WhatsApp',
      'shop.saved.message': 'Hello Ben.M, I would like to ask about these pieces:',
      'shop.search.label': 'Refine your search',
      'shop.search.clear': 'Clear search',
      'shop.img.all': 'A pair of brown leather dress shoes in a pool of warm light',
      'shop.img.men': 'A man in a navy suit carrying a black leather briefcase',
      'shop.img.women': 'A woman in a check trench coat holding a cognac leather bag',
      'shop.img.bags': 'A dark brown leather tote resting on a side table',
      'shop.img.accessories': 'A brown leather belt worn with light denim and a knit sweater',
      'shop.img.new': 'A hand holding a round cognac leather bag against a wool coat',
      'shop.img.saved': 'A hand carrying a black leather duffel bag',
      'shop.img.search': 'A man wearing a tan leather crossbody bag over a denim jacket',
      'shop.tile.craft.eyebrow': 'The leathers',
      'shop.tile.craft.line': 'It all begins <em>with the hide.</em>',
      'shop.tile.craft.link': 'Discover the leathers',
      'shop.tile.craft.alt': 'Raw leather hides laid out on dark cobblestones',
      'shop.tile.stitch.eyebrow': 'The craft',
      'shop.tile.stitch.line': 'Stitched slowly, <em>so that it lasts.</em>',
      'shop.tile.stitch.link': 'Discover the craft',
      'shop.tile.stitch.alt': 'Hand saddle-stitching with waxed thread at a stitching clam',
      'shop.tile.atelier.eyebrow': 'Personalisation',
      'shop.tile.atelier.line': 'Your initials, <em>pressed by hand.</em>',
      'shop.tile.atelier.link': 'Make it yours',
      'shop.tile.atelier.alt': 'A craftsman stamping a design into leather with a mallet',
      'shop.tile.travel.eyebrow': 'Bags',
      'shop.tile.travel.line': 'Made for <em>the long way round.</em>',
      'shop.tile.travel.link': 'Shop the bags',
      'shop.tile.travel.alt': 'A man carrying a cognac leather weekender through a garden',
      'shop.tile.care.eyebrow': 'Leather care',
      'shop.tile.care.line': 'Cared for, leather <em>only grows better.</em>',
      'shop.tile.care.link': 'How to care for it',
      'shop.tile.care.alt': 'A wooden shoe-care box with brushes and polish tins',
      'shop.tile.women.eyebrow': 'Women',
      'shop.tile.women.line': 'Light on the foot, <em>exact in line.</em>',
      'shop.tile.women.link': 'Shop women',
      'shop.tile.women.alt': 'Black leather ankle boots in a forest clearing',
      'shop.tile.men.eyebrow': 'Men',
      'shop.tile.men.line': 'For the formal hours, <em>and the long walks between.</em>',
      'shop.tile.men.link': 'Shop men',
      'shop.tile.men.alt': 'A man in a denim shirt holding a brown leather clutch',
      'shop.tile.help.line': 'Looking for something <em>in particular?</em>',
      'shop.tile.help.link': 'Write to us',
      'shop.band.eyebrow': 'Boutiques & client services',
      'shop.band.title': 'Seen in person, <em>chosen by hand.</em>',
      'shop.band.text': 'Visit the House in Erbil, Sulaymaniyah or Duhok to feel the leathers and find your size — or write to us, and we will help you choose.',
      'shop.band.cta': 'Find a boutique',
      'shop.band.alt': 'Amber-lit glass cabinets displaying leather goods in a boutique',
      'shop.band.ship': 'Complimentary shipping on orders over {amount}',
      'shop.band.s2': 'Every order confirmed personally on WhatsApp',
      'shop.band.s3': 'Bags and small leather goods personalised in the Atelier',
      'shop.band.waMessage': 'Hello Ben.M, I have a question about the collection.'
    },
    ckb: {
      'shop.meta.title': 'کۆلێکشن — Ben.M',
      'shop.meta.description': 'پێڵاو، جانتا، قایش و جزدان لە چەرمی ڕەسەن — کۆلێکشنی Ben.M.',
      'shop.meta.titleFor': '{title} — Ben.M',
      'shop.title.all': 'کۆلێکشن',
      'shop.title.new': 'تازە گەیشتووەکان',
      'shop.title.saved': 'دڵخوازەکان',
      'shop.title.query': '«{q}»',
      'shop.title.searchPre': 'ئەنجامی گەڕان بۆ',
      'shop.lead.all': 'چەرم بە دەست هەڵدەبژێردرێت. <em>بە پشوودرێژی دەدوورێت.</em>',
      'shop.intro.all': 'پێڵاو، جانتا و کەلوپەلی بچووکی چەرمی، هەمووی لە چەرمی ڕەسەن — هەر پارچەیەک بە هێمنی دەبڕدرێت، دەدوورێت و تەواو دەکرێت، بۆ ئەوەی ساڵانێکی زۆر بەکاربهێنرێت.',
      'shop.lead.new': 'نوێترین پارچەکان، <em>تازە لە دەستی وەستاوە.</em>',
      'shop.intro.new': 'شێوەی نوێ و چەرمی نوێ، بە هەمان ئەو پشوودرێژییەی هەموو بەرهەمەکانی ترمانی پێ دروست دەکەین.',
      'shop.lead.saved': 'ئەو پارچانەی <em>بۆ خۆت هەڵتگرتوون.</em>',
      'shop.intro.saved': 'لەسەر ئەم ئامێرە پارێزراون. هەر کاتێک ئامادە بوویت بیانخەرە سەبەتەکەت — یان لە واتسئاپەوە پرسیاریان لەبارەوە بکە.',
      'shop.lead.search': '{n} پارچە لەگەڵ گەڕانەکەت دەگونجێن.',
      'shop.lead.searchNone': 'هیچ پارچەیەک لەگەڵ گەڕانەکەت ناگونجێت.',
      'shop.tabs.label': 'بەشەکان',
      'shop.tabs.all': 'هەموو',
      'shop.count': '{n} پارچە',
      'shop.results': 'پارچەکان',
      'shop.filter': 'فلتەر',
      'shop.filterActive': 'فلتەر، {n} چالاک',
      'shop.sort.label': 'ڕیزکردن',
      'shop.sort.by': 'ڕیزکردن بەپێی',
      'shop.sort.relevance': 'نزیکترین ئەنجام',
      'shop.sort.recent': 'دوایین هەڵگیراوەکان',
      'shop.sort.featured': 'هەڵبژاردەی ئێمە',
      'shop.sort.newest': 'نوێترین',
      'shop.sort.priceAsc': 'نرخ، لە کەمەوە بۆ زۆر',
      'shop.sort.priceDesc': 'نرخ، لە زۆرەوە بۆ کەم',
      'shop.sort.price': 'نرخ',
      'shop.sort.recentShort': 'دوایین هەڵگیراوەکان',
      'shop.density.label': 'ژمارەی پارچە لە هەر ڕیزێکدا',
      'shop.density.n': '{n} لە هەر ڕیزێکدا',
      'shop.active.label': 'فلتەرکراو بەپێی',
      'shop.chip.remove': 'لابردنی فلتەر: {label}',
      'shop.chip.size': 'قەبارەی {size}',
      'shop.clear': 'سڕینەوەی هەمووی',
      'shop.panel.title': 'فلتەر',
      'shop.panel.type': 'جۆر',
      'shop.panel.colour': 'ڕەنگ',
      'shop.panel.price': 'نرخ',
      'shop.panel.size': 'قەبارە (ئەورووپی)',
      'shop.panel.min': 'کەمترین نرخ',
      'shop.panel.max': 'زۆرترین نرخ',
      'shop.panel.sizeNote': 'قەبارەی پێڵاوەکان — جانتا و ئێکسسوارات یەک قەبارەن.',
      'shop.panel.show': 'پیشاندانی {n} پارچە',
      'shop.panel.showNone': 'هیچ پارچەیەک ناگونجێت',
      'shop.empty.title': 'هیچ پارچەیەک لەگەڵ ئەم هەڵبژاردنە ناگونجێت.',
      'shop.empty.text': 'یەک دوو فلتەر لاببە — یان لە سەرەتاوە سەیری هەموو کۆلێکشنەکە بکە.',
      'shop.empty.reset': 'لابردنی فلتەرەکان',
      'shop.empty.everywhere': 'لە هەموو بەشەکاندا بگەڕێ',
      'shop.empty.all': 'بینینی هەموو کۆلێکشنەکە',
      'shop.empty.searchTitle': 'هیچ شتێک بۆ «{q}» نەدۆزرایەوە.',
      'shop.empty.searchText': 'ڕێنووسەکە بپشکنە یان وشەیەکی گشتیتر تاقی بکەرەوە — لەوانەیە یەکێک لەمانە:',
      'shop.empty.savedTitle': 'پارچە دڵخوازەکانت لێرە چاوەڕێت دەکەن.',
      'shop.empty.savedText': 'دڵی سەر هەر پارچەیەک دابگرە بۆ ئەوەی هەڵیبگریت. لیستەکە لەسەر ئەم ئامێرە دەمێنێتەوە.',
      'shop.empty.savedCta': 'کۆلێکشنەکە بدۆزەرەوە',
      'shop.empty.newCta': 'سەیری تازە گەیشتووەکان بکە',
      'shop.empty.suggest': 'لەوانەیە یەکێک لەمانە',
      'shop.end.text': 'هەموو {n} پارچەکەت بینی.',
      'shop.end.text_one': 'ئەمە تاکە پارچەی ئەم هەڵبژاردنەیە.',
      'shop.end.top': 'گەڕانەوە بۆ سەرەوە',
      'shop.end.ask': 'بە دوای شتێکی تایبەتدا دەگەڕێیت؟',
      'shop.end.write': 'بۆمان بنووسە',
      'shop.end.helpMessage': 'سڵاو Ben.M، بە دوای پارچەیەکی تایبەتدا دەگەڕێم.',
      'shop.saved.ask': 'لە واتسئاپ پرسیاریان لەبارەوە بکە',
      'shop.saved.message': 'سڵاو Ben.M، دەمەوێت پرسیار لەبارەی ئەم پارچانەوە بکەم:',
      'shop.search.label': 'گەڕانەکەت وردتر بکە',
      'shop.search.clear': 'سڕینەوەی گەڕان',
      'shop.img.all': 'جووتێک پێڵاوی چەرمی قاوەیی لە ناو ڕووناکییەکی گەرمدا',
      'shop.img.men': 'پیاوێک بە چاکەتی شینی تۆخەوە، جانتایەکی کاری چەرمی ڕەشی بە دەستەوەیە',
      'shop.img.women': 'ئافرەتێک بە باڵتۆیەکی چوارخانەوە، جانتایەکی چەرمی کۆنیاکی بە دەستەوەیە',
      'shop.img.bags': 'جانتایەکی تۆتی چەرمی قاوەیی تۆخ لەسەر مێزێکی بچووک',
      'shop.img.accessories': 'قایشێکی چەرمی قاوەیی لەگەڵ پانتۆڵی جینزی کاڵ و بلوزێکی چنراو',
      'shop.img.new': 'دەستێک جانتایەکی خڕی چەرمی کۆنیاکی لە تەنیشت باڵتۆیەکی خوریدا گرتووە',
      'shop.img.saved': 'دەستێک جانتایەکی گەشتی چەرمی ڕەش هەڵدەگرێت',
      'shop.img.search': 'پیاوێک جانتایەکی سەرشانی چەرمی هەنگوینی بەسەر چاکەتێکی جینزەوە',
      'shop.tile.craft.eyebrow': 'چەرمەکان',
      'shop.tile.craft.line': 'هەموو شتێک لە <em>چەرمەکەوە</em> دەست پێدەکات.',
      'shop.tile.craft.link': 'چەرمەکان بدۆزەرەوە',
      'shop.tile.craft.alt': 'پێستی خاوی چەرم لەسەر بەردفەرشێکی تاریک ڕاخراون',
      'shop.tile.stitch.eyebrow': 'وەستایی',
      'shop.tile.stitch.line': 'بە هێواشی دەدوورێت، <em>بۆ ئەوەی بمێنێتەوە.</em>',
      'shop.tile.stitch.link': 'وەستاییەکە بدۆزەرەوە',
      'shop.tile.stitch.alt': 'دەستێک بە دەزووی مۆمکراو، چەرمەکە بە دوو دەرزی دەدوورێت',
      'shop.tile.atelier.eyebrow': 'تایبەتکردن',
      'shop.tile.atelier.line': 'پیتە سەرەتاییەکانی ناوت، <em>بە دەست لەسەر چەرم.</em>',
      'shop.tile.atelier.link': 'بیکە هی خۆت',
      'shop.tile.atelier.alt': 'وەستایەک بە چەکوشێک نەخشێک لەسەر چەرم دادەکوتێت',
      'shop.tile.travel.eyebrow': 'جانتاکان',
      'shop.tile.travel.line': 'دروستکراو بۆ <em>ڕێگا دوورەکان.</em>',
      'shop.tile.travel.link': 'سەیری جانتاکان بکە',
      'shop.tile.travel.alt': 'پیاوێک جانتایەکی گەشتی چەرمی کۆنیاکی بە ناو باخچەیەکدا هەڵدەگرێت',
      'shop.tile.care.eyebrow': 'چاودێریی چەرم',
      'shop.tile.care.line': 'چەرم بە چاودێری، <em>ڕۆژ بە ڕۆژ جوانتر دەبێت.</em>',
      'shop.tile.care.link': 'چۆن چاودێری بکەیت',
      'shop.tile.care.alt': 'سندووقێکی دارینی چاودێریی پێڵاو، لەگەڵ فڵچە و قوتووی بۆیاخ',
      'shop.tile.women.eyebrow': 'ئافرەتان',
      'shop.tile.women.line': 'سووک لە پێدا، <em>ورد لە هێڵدا.</em>',
      'shop.tile.women.link': 'سەیری بەشی ئافرەتان بکە',
      'shop.tile.women.alt': 'پۆتینی کورتی چەرمی ڕەش لە بۆشاییەکی ناو دارستاندا',
      'shop.tile.men.eyebrow': 'پیاوان',
      'shop.tile.men.line': 'بۆ کاتە فەرمییەکان، <em>و ڕێگا درێژەکانی نێوانیان.</em>',
      'shop.tile.men.link': 'سەیری بەشی پیاوان بکە',
      'shop.tile.men.alt': 'پیاوێک بە کراسێکی جینزەوە، جانتایەکی دەستی چەرمی قاوەیی گرتووە',
      'shop.tile.help.line': 'بە دوای شتێکی <em>تایبەتدا</em> دەگەڕێیت؟',
      'shop.tile.help.link': 'بۆمان بنووسە',
      'shop.band.eyebrow': 'فرۆشگاکان و خزمەتگوزاریی کڕیاران',
      'shop.band.title': 'بە چاوی خۆت ببینە، <em>بە دەستی خۆت هەڵیبژێرە.</em>',
      'shop.band.text': 'سەردانی ماڵەکەمان بکە لە هەولێر، سلێمانی یان دهۆک، بۆ ئەوەی چەرمەکان بە دەستی خۆت هەست پێ بکەیت و قەبارەکەت بدۆزیتەوە — یان بۆمان بنووسە و یارمەتیت دەدەین لە هەڵبژاردندا.',
      'shop.band.cta': 'فرۆشگایەک بدۆزەرەوە',
      'shop.band.alt': 'دۆڵابی شووشەیی بە ڕووناکییەکی گەرمەوە، کەلوپەلی چەرمی تێدا نمایش کراوە',
      'shop.band.ship': 'گەیاندنی بێبەرامبەر بۆ داواکارییەکانی سەرووی {amount}',
      'shop.band.s2': 'هەموو داواکارییەک بە شێوەیەکی کەسی لە واتسئاپ پشتڕاست دەکرێتەوە',
      'shop.band.s3': 'جانتا و کەلوپەلی بچووکی چەرمی لە ئاتێلیە تایبەت دەکرێن',
      'shop.band.waMessage': 'سڵاو Ben.M، پرسیارێکم دەربارەی کۆلێکشنەکە هەیە.'
    }
  });

  /* ===========================================================================
     02  Data, state, helpers
     ======================================================================== */
  var gsap = w.gsap || null;
  var RM = !!B.reducedMotion || !gsap;
  var PRODUCTS = w.BENM_PRODUCTS || [];
  var CATS = w.BENM_CATEGORIES || [];
  var LEATHERS = w.BENM_LEATHERS || [];
  var STORES = w.BENM_STORES || [];
  var CONFIG = w.BENM_CONFIG || {};

  var CAT_IDS = CATS.map(function (c) { return c.id; });
  var TYPE_IDS = unique(PRODUCTS.map(function (p) { return p.type; }));
  var COLOR_IDS = LEATHERS.map(function (l) { return l.id; });
  var SIZE_IDS = unique([].concat.apply([], PRODUCTS.map(function (p) { return p.sizes || []; }))).sort(byNum);

  var SORT_KEYS = {
    relevance: 'shop.sort.relevance', recent: 'shop.sort.recent', featured: 'shop.sort.featured',
    newest: 'shop.sort.newest', 'price-asc': 'shop.sort.priceAsc', 'price-desc': 'shop.sort.priceDesc'
  };
  var SORT_SHORT = { recent: 'shop.sort.recentShort', 'price-asc': 'shop.sort.price', 'price-desc': 'shop.sort.price' };
  var STD_SORTS = ['featured', 'newest', 'price-asc', 'price-desc'];
  var PRICE_STEP = 5;
  var HIST_BINS = 22;
  var DENSITY = { s: [1, 2], m: [2, 3], l: [2, 3, 4] };
  var DENSITY_DEFAULT = { s: 2, m: 2, l: 3 };
  var DENSITY_KEY = 'benm:shop-density';

  // hero image per view (categories use their own data image)
  var MEDIA = {
    all: { src: 'assets/img/editorial/hero-1.jpg', w: 2400, h: 1350, pos: '64% 62%', alt: 'shop.img.all' },
    fresh: { src: 'assets/img/editorial/campaign-2.jpg', w: 2400, h: 1350, pos: '44% 50%', alt: 'shop.img.new' },
    saved: { src: 'assets/img/lookbook/look-7.jpg', w: 1200, h: 1600, pos: '50% 50%', alt: 'shop.img.saved' },
    search: { src: 'assets/img/lookbook/look-6.jpg', w: 1200, h: 1600, pos: '50% 50%', alt: 'shop.img.search' },
    men: { w: 1200, h: 1600, pos: '50% 42%', alt: 'shop.img.men' },
    women: { w: 1200, h: 1600, pos: '50% 50%', alt: 'shop.img.women' },
    bags: { w: 1200, h: 1600, pos: '50% 50%', alt: 'shop.img.bags' },
    accessories: { w: 1200, h: 1600, pos: '50% 50%', alt: 'shop.img.accessories' }
  };

  // editorial interruptions (kind: split = portrait photo + text panel · wide = landscape photo)
  var TILES = [
    { id: 'craft', kind: 'wide', src: 'assets/img/editorial/maison-hero.jpg', w: 2400, h: 1350, pos: '50% 62%', href: 'maison.html#materials' },
    { id: 'atelier', kind: 'split', theme: 'dark', src: 'assets/img/editorial/atelier.jpg', w: 1600, h: 2000, pos: '50% 50%', href: 'atelier.html#configurator' },
    { id: 'travel', kind: 'split', theme: 'paper', src: 'assets/img/lookbook/look-1.jpg', w: 1200, h: 1600, pos: '50% 62%', href: 'shop.html?cat=bags', cat: 'bags' },
    { id: 'care', kind: 'split', theme: 'dark', src: 'assets/img/editorial/care.jpg', w: 1600, h: 2000, pos: '50% 50%', href: 'maison.html#care' },
    { id: 'women', kind: 'split', theme: 'paper', src: 'assets/img/lookbook/look-5.jpg', w: 1200, h: 1600, pos: '50% 70%', href: 'shop.html?cat=women', cat: 'women' },
    { id: 'men', kind: 'split', theme: 'dark', src: 'assets/img/lookbook/look-3.jpg', w: 1200, h: 1600, pos: '50% 50%', href: 'shop.html?cat=men', cat: 'men' },
    { id: 'stitch', kind: 'split', theme: 'paper', src: 'assets/img/craft/stitching.jpg', w: 1600, h: 2000, pos: '50% 55%', href: 'maison.html#craft' }
  ];

  var state = { cat: '', q: '', fresh: false, saved: false, types: [], colors: [], sizes: [], min: null, max: null, sort: '' };
  var last = { scope: [], results: [], view: '', title: '', count: 0, empty: '' };
  var ui = {};
  var prefs = loadPrefs();
  var mqS = mq('(max-width: 699.98px)');
  var mqM = mq('(max-width: 1099.98px)');
  var panel = null;           // open filter panel {el, root, dirty, bounds}

  function unique(a) { return a.filter(function (v, i) { return a.indexOf(v) === i; }); }
  function byNum(a, b) { return a - b; }
  function $(sel, root) { return (root || d).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || d).querySelectorAll(sel)); }
  function esc(s) { return B.esc(s); }
  function pad2(n) { return n < 10 ? '0' + n : String(n); }
  function mq(q) { try { return w.matchMedia(q); } catch (e) { return { matches: false }; } }
  function onMq(m, fn) { if (m.addEventListener) m.addEventListener('change', fn); else if (m.addListener) m.addListener(fn); }
  function debounce(fn, ms) { var id; return function () { clearTimeout(id); id = setTimeout(fn, ms); }; }
  function plain(html) { var t = d.createElement('div'); t.innerHTML = html; return t.textContent; }
  function icon(name) { return B.icon(name); }
  function leather(id) { for (var i = 0; i < LEATHERS.length; i++) if (LEATHERS[i].id === id) return LEATHERS[i]; return null; }
  function typeLabel(id) { for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].type === id) return B.loc(PRODUCTS[i].typeName); return id; }
  function loadPrefs() {
    try { var o = JSON.parse(w.localStorage.getItem(DENSITY_KEY) || '{}'); return o && typeof o === 'object' ? o : {}; } catch (e) { return {}; }
  }
  function savePrefs() { try { w.localStorage.setItem(DENSITY_KEY, JSON.stringify(prefs)); } catch (e) { /* storage blocked */ } }

  /* ===========================================================================
     03  URL ⇄ state (history.replaceState — file:// safe, no new entries)
     ======================================================================== */
  function listParam(params, name, valid) {
    var raw = params.get(name);
    if (!raw) return [];
    return unique(raw.split(',').map(function (v) { return v.trim().toLowerCase(); }).filter(function (v) { return valid.indexOf(v) > -1; }));
  }
  function intParam(params, name) {
    var v = parseInt(params.get(name), 10);
    return isFinite(v) && v >= 0 ? v : null;
  }
  function readParams(params) {
    var cat = (params.get('cat') || '').toLowerCase();
    state.cat = CAT_IDS.indexOf(cat) > -1 ? cat : '';
    state.q = (params.get('q') || '').replace(/\s+/g, ' ').trim().slice(0, 80);
    state.fresh = params.get('new') === '1' || params.get('new') === 'true';
    state.saved = params.get('saved') === '1' || params.get('saved') === 'true';
    state.types = listParam(params, 'type', TYPE_IDS);
    state.colors = listParam(params, 'color', COLOR_IDS);
    state.sizes = listParam(params, 'size', SIZE_IDS.map(String)).map(Number).sort(byNum);
    state.min = intParam(params, 'min');
    state.max = intParam(params, 'max');
    if (state.min != null && state.max != null && state.min > state.max) { var t = state.min; state.min = state.max; state.max = t; }
    var s = (params.get('sort') || '').toLowerCase();
    state.sort = sortOptions().indexOf(s) > -1 && s !== defaultSort() ? s : '';
  }
  function readURL() {
    var p;
    try { p = new URLSearchParams(w.location.search); } catch (e) { p = { get: function () { return null; } }; }
    readParams(p);
  }
  // shop.html?… for a state (scope only unless `full`)
  function queryFor(s, full) {
    var p = [];
    if (s.cat) p.push('cat=' + s.cat);
    if (s.q) p.push('q=' + encodeURIComponent(s.q));
    if (s.fresh) p.push('new=1');
    if (s.saved) p.push('saved=1');
    if (full) {
      if (s.types.length) p.push('type=' + s.types.join(','));
      if (s.colors.length) p.push('color=' + s.colors.join(','));
      if (s.sizes.length) p.push('size=' + s.sizes.join(','));
      if (s.min != null) p.push('min=' + s.min);
      if (s.max != null) p.push('max=' + s.max);
      if (s.sort) p.push('sort=' + s.sort);
    }
    return p.length ? '?' + p.join('&') : '';
  }
  function hrefFor(patch) {
    var s = { cat: state.cat, q: state.q, fresh: state.fresh, saved: state.saved };
    for (var k in patch) if (Object.prototype.hasOwnProperty.call(patch, k)) s[k] = patch[k];
    return B.url('shop.html' + queryFor(s, false));
  }
  function writeURL() {
    var file = (w.location.pathname.split('/').pop() || 'shop.html');
    try { w.history.replaceState(w.history.state, '', file + queryFor(state, true)); } catch (e) { /* sandboxed */ }
  }
  var writeURLSoon = debounce(writeURL, 180);

  /* ===========================================================================
     04  Query — scope (q · saved · new · category) → filters → sort
     ======================================================================== */
  function defaultSort() { return state.q ? 'relevance' : state.saved ? 'recent' : 'featured'; }
  function sortOptions() { var d0 = defaultSort(); return d0 === 'featured' ? STD_SORTS.slice() : [d0].concat(STD_SORTS); }
  function currentSort() { return state.sort && sortOptions().indexOf(state.sort) > -1 ? state.sort : defaultSort(); }

  function baseList() {
    var list = state.q ? B.search(state.q) : PRODUCTS.slice();
    if (state.saved) {
      var ids = B.wishlist.ids();
      list = list.filter(function (p) { return ids.indexOf(p.id) > -1; });
    }
    if (state.fresh) list = list.filter(function (p) { return p.isNew; });
    return list;
  }
  function scopeList() {
    var base = baseList();
    return state.cat ? base.filter(function (p) { return p.category === state.cat; }) : base;
  }
  function inStock(p, size) { return (p.sizes || []).indexOf(size) > -1 && (p.soldOut || []).indexOf(size) < 0; }
  function hasColor(p, id) { return (p.colors || []).some(function (c) { return c.id === id; }); }
  // does p pass every active filter (except the group named in `skip`)?
  function matches(p, skip) {
    if (skip !== 'types' && state.types.length && state.types.indexOf(p.type) < 0) return false;
    if (skip !== 'colors' && state.colors.length && !state.colors.some(function (c) { return hasColor(p, c); })) return false;
    if (skip !== 'sizes' && state.sizes.length && !state.sizes.some(function (s) { return inStock(p, s); })) return false;
    if (skip !== 'price' && state.min != null && p.price < state.min) return false;
    if (skip !== 'price' && state.max != null && p.price > state.max) return false;
    return true;
  }
  function sortList(list) {
    var mode = currentSort();
    var ids = mode === 'recent' ? B.wishlist.ids() : null;
    var rows = list.map(function (p, i) { return { p: p, i: i, c: PRODUCTS.indexOf(p) }; });
    rows.sort(function (a, b) {
      switch (mode) {
        case 'relevance': return a.i - b.i;
        case 'recent': return ids.indexOf(a.p.id) - ids.indexOf(b.p.id);
        case 'newest': return (b.p.isNew ? 1 : 0) - (a.p.isNew ? 1 : 0) || a.c - b.c;
        case 'price-asc': return a.p.price - b.p.price || a.c - b.c;
        case 'price-desc': return b.p.price - a.p.price || a.c - b.c;
        default: return (b.p.featured ? 1 : 0) - (a.p.featured ? 1 : 0) || a.c - b.c;
      }
    });
    return rows.map(function (r) { return r.p; });
  }
  function priceActive() { return state.min != null || state.max != null; }
  function filterCount() { return state.types.length + state.colors.length + state.sizes.length + (priceActive() ? 1 : 0); }
  function clearFilters() { state.types = []; state.colors = []; state.sizes = []; state.min = null; state.max = null; }
  function priceBounds(list) {
    if (!list.length) return null;
    var prices = list.map(function (p) { return p.price; });
    var lo = Math.floor(Math.min.apply(null, prices) / PRICE_STEP) * PRICE_STEP;
    var hi = Math.ceil(Math.max.apply(null, prices) / PRICE_STEP) * PRICE_STEP;
    return hi > lo ? { lo: lo, hi: hi } : null;
  }
  function priceLabel() {
    var b = priceBounds(scopeList()) || { lo: 0, hi: 0 };
    var lo = state.min != null ? state.min : b.lo, hi = state.max != null ? state.max : b.hi;
    return B.price(lo) + ' – ' + B.price(hi);
  }
  function compute() {
    last.scope = scopeList();
    last.results = sortList(last.scope.filter(function (p) { return matches(p); }));
    return last.results;
  }

  /* ===========================================================================
     05  Hero — title per view (masked swap), count, lead, crumbs, image
     ======================================================================== */
  function viewId() { return state.q ? 'search' : state.saved ? 'saved' : state.fresh ? 'fresh' : (state.cat || 'all'); }
  function titleText() {
    if (state.q) return B.t('shop.title.query', { q: state.q });
    if (state.saved) return B.t('shop.title.saved');
    if (state.fresh) return B.t('shop.title.new');
    if (state.cat) return B.loc((B.category(state.cat) || {}).name) || state.cat;
    return B.t('shop.title.all');
  }
  function leadHTML(v, n) {
    if (v === 'search') return n ? esc(B.t('shop.lead.search', { n: n })) : esc(B.t('shop.lead.searchNone'));
    if (v === 'saved') return B.t('shop.lead.saved');
    if (v === 'fresh') return B.t('shop.lead.new');
    if (v === 'all') return B.t('shop.lead.all');
    return esc(B.loc((B.category(v) || {}).tagline));
  }
  function introText(v) {
    if (v === 'search') return '';
    if (v === 'saved') return B.t('shop.intro.saved');
    if (v === 'fresh') return B.t('shop.intro.new');
    if (v === 'all') return B.t('shop.intro.all');
    return B.loc((B.category(v) || {}).intro);
  }
  function mediaFor(v) {
    var m = MEDIA[v] || MEDIA.all;
    if (!m.src && B.category(v)) m.src = B.category(v).image;
    return m;
  }

  function renderHero(animate) {
    var v = viewId(), n = last.results.length;
    var title = titleText();
    var swap = animate && (title !== last.title);

    ui.titlePre.textContent = state.q ? B.t('shop.title.searchPre') + ' ' : '';
    var shape = function () {
      ui.titleBox.classList.toggle('is-query', !!state.q);
      ui.titleBox.classList.toggle('is-long', ui.title.textContent.length > (state.q ? 12 : 16));
    };
    if (swap) swapTitle(title, shape);
    else if (ui.title.__swapping) ui.title.__next = title;      // a swap in flight lands on the newest text
    else { ui.title.textContent = title; shape(); }
    setCount(n, animate);

    setRich(ui.lead, leadHTML(v, n), animate && v !== last.view);
    setRich(ui.intro, esc(introText(v)), animate && v !== last.view);

    // search refine form · saved "ask on WhatsApp"
    ui.search.hidden = !state.q;
    if (state.q && d.activeElement !== ui.searchInput) ui.searchInput.value = state.q;
    var savedItems = state.saved ? last.results : [];
    ui.ask.hidden = !savedItems.length;
    if (savedItems.length) ui.askLink.href = B.whatsappLink(savedMessage(savedItems));

    d.title = B.t('shop.meta.titleFor', { title: title });
    renderCrumbs(v, title);
    swapMedia(v, animate && v !== last.view);
    // caption: N° + view name (categories numbered in catalogue order)
    var idx = CAT_IDS.indexOf(v);
    ui.capNum.textContent = 'N°' + pad2(idx > -1 ? idx + 1 : 0);
    ui.capNum.hidden = !(idx > -1 || v === 'all');
    ui.cap.textContent = v === 'search' ? B.t('header.search') : title;
    last.view = v;
    last.title = title;
  }
  function savedMessage(items) {
    return B.t('shop.saved.message') + '\n' + items.map(function (p) {
      return '• ' + B.loc(p.name) + ' — ' + B.price(p.price);
    }).join('\n');
  }
  function renderCrumbs(v, title) {
    var home = '<li><a href="' + esc(B.url('index.html')) + '">' + esc(B.t('nav.home')) + '</a></li>';
    var html = v === 'all'
      ? home + '<li><span aria-current="page">' + esc(B.t('nav.shop')) + '</span></li>'
      : home + '<li><a href="' + esc(B.url('shop.html')) + '">' + esc(B.t('nav.shop')) + '</a></li>' +
        '<li><span aria-current="page">' + esc(v === 'search' ? B.t('header.search') : title) + '</span></li>';
    ui.crumbs.innerHTML = html;
  }
  function setRich(el, html, animate) {
    if (el.innerHTML === html) return;
    if (!animate || RM) { el.innerHTML = html; return; }
    gsap.killTweensOf(el);
    gsap.to(el, {
      opacity: 0, y: -10, duration: .3, ease: 'power2.in',
      onComplete: function () {
        el.innerHTML = html;
        gsap.fromTo(el, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .9, ease: 'expo.out', delay: .12, clearProps: 'opacity,transform' });
      }
    });
  }
  function swapTitle(text, shape) {
    var el = ui.title;
    if (RM) { el.textContent = text; shape(); return; }
    el.__swapping = true;
    el.__next = text;
    gsap.killTweensOf(el);
    gsap.to(el, {
      yPercent: -112, duration: .45, ease: 'power3.in',
      onComplete: function () {
        el.textContent = el.__next;
        shape();
        gsap.fromTo(el, { yPercent: 112 }, {
          yPercent: 0, duration: 1.15, ease: 'expo.out',
          onComplete: function () {
            el.__swapping = false;
            gsap.set(el, { clearProps: 'transform' });
            if (el.textContent !== el.__next) { el.textContent = el.__next; shape(); }   // changed mid-rise (language)
          }
        });
      }
    });
  }
  var countState = { v: 0 };
  function setCount(n, animate) {
    var el = ui.count;
    var fmt = function () { el.textContent = B.num(Math.round(countState.v)); };
    if (!animate || RM) { if (gsap) gsap.killTweensOf(countState); countState.v = n; fmt(); return; }
    gsap.killTweensOf(countState);
    gsap.to(countState, { v: n, duration: .9, ease: 'power2.out', onUpdate: fmt, onComplete: fmt });
  }
  function swapMedia(v, animate) {
    var m = mediaFor(v);
    var layers = ui.layers;
    var cur = layers.lastElementChild;
    if (cur && cur.getAttribute('data-src') === m.src) { cur.alt = B.t(m.alt); return; }
    var img = d.createElement('img');
    img.className = 'shop-hero__img';
    img.src = B.url(m.src);
    img.alt = B.t(m.alt);
    img.width = m.w;
    img.height = m.h;
    img.decoding = 'async';
    img.style.objectPosition = m.pos;
    img.setAttribute('data-src', m.src);
    img.setAttribute('data-alt', m.alt);
    layers.appendChild(img);
    var drop = function () { $$('.shop-hero__img', layers).forEach(function (o) { if (o !== img) o.remove(); }); };
    if (!animate || RM) { drop(); return; }
    var reveal = function () {
      gsap.fromTo(img, { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.2 }, {
        clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.4, ease: 'expo.out',
        onComplete: function () { drop(); gsap.set(img, { clearProps: 'clipPath,transform' }); }
      });
    };
    gsap.set(img, { clipPath: 'inset(100% 0% 0% 0%)' });
    if (img.decode) img.decode().then(reveal, reveal); else reveal();
  }

  /* ===========================================================================
     06  Category tabs — counts per scope, aria-current, travelling underline
     ======================================================================== */
  function renderTabs() {
    var base = baseList();
    ui.tabs.forEach(function (a) {
      var id = a.getAttribute('data-cat');
      var cat = id === 'all' ? '' : id;
      var n = cat ? base.filter(function (p) { return p.category === cat; }).length : base.length;
      a.setAttribute('href', hrefFor({ cat: cat }));
      $('.shop-cats__n', a).textContent = B.num(n);
      $('[data-cat-sr]', a).textContent = ' (' + B.t('shop.count', { n: n }) + ')';
      a.classList.toggle('is-empty', !n);
      if (cat === state.cat) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }
  function placeLine(animate) {
    var line = ui.line, active = $('.shop-cats__link[aria-current="page"] .shop-cats__label', ui.cats);
    if (!line) return;
    if (!active) { line.style.opacity = '0'; return; }
    var origin = ui.origin.getBoundingClientRect().left;
    var r = active.getBoundingClientRect();
    line.classList.toggle('is-instant', !animate || RM);
    line.style.opacity = '1';
    line.style.transform = 'translateX(' + (r.left - origin).toFixed(1) + 'px) scaleX(' + Math.max(1, r.width).toFixed(1) + ')';
    // keep the active tab in view inside the scroller (mobile)
    var sr = ui.cats.getBoundingClientRect();
    if (r.left < sr.left + 8 || r.right > sr.right - 8) {
      var delta = (r.left + r.width / 2) - (sr.left + sr.width / 2);
      try { ui.cats.scrollBy({ left: delta, behavior: animate && !RM ? 'smooth' : 'auto' }); } catch (e) { ui.cats.scrollLeft += delta; }
    }
  }

  /* ===========================================================================
     07  Toolbar — results count · filter button · sort listbox · density
     ======================================================================== */
  function renderToolbar() {
    var n = last.results.length, f = filterCount();
    ui.status.textContent = B.t('shop.count', { n: n });
    ui.filterN.hidden = !f;
    ui.filterN.textContent = B.num(f);
    ui.filterBtn.setAttribute('aria-label', f ? B.t('shop.filterActive', { n: f }) : B.t('shop.filter'));
    var cur = currentSort(), full = esc(B.t(SORT_KEYS[cur])), sk = SORT_SHORT[cur];
    var arrow = cur === 'price-asc' ? 'M5 11V1.5M1.5 5L5 1.5 8.5 5' : cur === 'price-desc' ? 'M5 1v9.5M1.5 7L5 10.5 8.5 7' : '';
    // phones show a short label ("Price ↑"); the full one stays in the accessible name
    ui.sortValue.innerHTML = sk
      ? '<span class="shop-sort__full">' + full + '</span><span class="shop-sort__short" aria-hidden="true">' + esc(B.t(sk)) +
        (arrow ? '<svg viewBox="0 0 10 12" width="10" height="12" focusable="false"><path d="' + arrow + '"/></svg>' : '') + '</span>'
      : full;
    if (!ui.sortRoot.classList.contains('is-open')) buildSortList();
  }
  function buildSortList() {
    var cur = currentSort();
    ui.sortList.innerHTML = sortOptions().map(function (s) {
      return '<li class="shop-sort__opt" role="option" id="shop-sort-' + s + '" data-sort="' + s + '" tabindex="-1" aria-selected="' + (s === cur) + '">' +
        esc(B.t(SORT_KEYS[s])) + '</li>';
    }).join('');
  }
  function initSort() {
    var root = ui.sortRoot, btn = ui.sortBtn, list = ui.sortList;
    function opts() { return $$('[role="option"]', list); }
    function focusOpt(o) {
      if (!o) return;
      opts().forEach(function (x) { x.tabIndex = -1; });
      o.tabIndex = 0;
      o.focus({ preventScroll: true });              // the list is placed to fit; never let focus scroll the page
    }
    function outside(e) { if (!root.contains(e.target)) close(false); }
    // open downwards, or upwards when the toolbar sits low in the viewport (before it sticks)
    function place() {
      var r = btn.getBoundingClientRect(), h = list.offsetHeight;
      var vh = w.innerHeight || d.documentElement.clientHeight;
      var hdr = d.getElementById('site-header');
      var top = hdr && !hdr.classList.contains('is-hidden') ? Math.max(0, hdr.getBoundingClientRect().bottom) : 0;
      var below = vh - r.bottom - 14, above = r.top - top - 14;
      root.classList.toggle('is-up', h > below && above > below);
      void list.offsetWidth;                         // settle the closed transform before the open transition
    }
    function open(toLast) {
      buildSortList();
      place();
      root.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      var all = opts();
      focusOpt(toLast ? all[all.length - 1] : ($('[aria-selected="true"]', list) || all[0]));
      d.addEventListener('pointerdown', outside, true);
    }
    function close(refocus) {
      if (!root.classList.contains('is-open')) return;
      root.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      d.removeEventListener('pointerdown', outside, true);
      if (refocus) btn.focus();
    }
    function choose(o) {
      var s = o.getAttribute('data-sort');
      close(true);
      if (s === currentSort()) return;
      state.sort = s === defaultSort() ? '' : s;
      apply({ scroll: true });
    }
    btn.addEventListener('click', function () { if (root.classList.contains('is-open')) close(false); else open(false); });
    btn.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); open(e.key === 'ArrowUp'); }
    });
    list.addEventListener('keydown', function (e) {
      var all = opts(), i = all.indexOf(d.activeElement);
      switch (e.key) {
        case 'ArrowDown': e.preventDefault(); focusOpt(all[Math.min(all.length - 1, i + 1)]); break;
        case 'ArrowUp': e.preventDefault(); focusOpt(all[Math.max(0, i - 1)]); break;
        case 'Home': e.preventDefault(); focusOpt(all[0]); break;
        case 'End': e.preventDefault(); focusOpt(all[all.length - 1]); break;
        case 'Enter': case ' ': e.preventDefault(); if (all[i]) choose(all[i]); break;
        case 'Escape': case 'Esc': e.preventDefault(); close(true); break;
        case 'Tab': close(false); break;
      }
    });
    list.addEventListener('click', function (e) {
      var o = e.target.closest('[role="option"]');
      if (o) choose(o);
    });
  }

  function mode() { return mqS.matches ? 's' : mqM.matches ? 'm' : 'l'; }
  function columns() {
    var m = mode(), v = +prefs[m];
    return DENSITY[m].indexOf(v) > -1 ? v : DENSITY_DEFAULT[m];
  }
  function densityIcon(n) {
    var size = 18, gap = 2.5, bw = (size - 1 - gap * (n - 1)) / n, s = '';
    for (var i = 0; i < n; i++) s += '<rect x="' + (0.5 + i * (bw + gap)).toFixed(2) + '" y="1.5" width="' + bw.toFixed(2) + '" height="15"/>';
    return '<svg viewBox="0 0 18 18" width="18" height="18" aria-hidden="true" focusable="false">' + s + '</svg>';
  }
  function renderDensity() {
    var cur = columns();
    ui.density.innerHTML = DENSITY[mode()].map(function (n) {
      var label = B.t('shop.density.n', { n: n });
      return '<button class="shop-density__btn" type="button" data-density="' + n + '" aria-pressed="' + (n === cur) + '" aria-label="' + esc(label) + '" title="' + esc(label) + '">' + densityIcon(n) + '</button>';
    }).join('');
  }

  /* ===========================================================================
     08  Active filters — chips (toolbar row + panel), remove · clear all
     ======================================================================== */
  function chipsData() {
    var out = [];
    state.types.forEach(function (id) { out.push({ k: 'types', v: id, label: typeLabel(id) }); });
    state.colors.forEach(function (id) { var l = leather(id); out.push({ k: 'colors', v: id, label: l ? B.loc(l.name) : id, hex: l && l.hex }); });
    state.sizes.forEach(function (s) { out.push({ k: 'sizes', v: String(s), label: B.t('shop.chip.size', { size: s }) }); });
    if (priceActive()) out.push({ k: 'price', v: '', label: priceLabel() });
    return out;
  }
  function chipHTML(c) {
    return '<button class="c-chip shop-chip" type="button" data-remove="' + c.k + '" data-value="' + esc(c.v) + '" aria-label="' + esc(B.t('shop.chip.remove', { label: c.label })) + '">' +
      (c.hex ? '<span class="shop-chip__swatch" style="--swatch:' + esc(c.hex) + '" aria-hidden="true"></span>' : '') +
      '<span>' + esc(c.label) + '</span>' + icon('close') + '</button>';
  }
  function renderActive() {
    var chips = chipsData();
    ui.active.hidden = !chips.length;
    ui.active.innerHTML = !chips.length ? '' :
      '<span class="shop-active__label">' + esc(B.t('shop.active.label')) + '</span>' + chips.map(chipHTML).join('') +
      '<button class="c-link c-link--quiet shop-active__clear" type="button" data-clear-all>' + esc(B.t('shop.clear')) + '</button>';
  }
  function removeFilter(k, v) {
    if (k === 'price') { state.min = null; state.max = null; return; }
    if (k === 'sizes') v = +v;
    state[k] = state[k].filter(function (x) { return x !== v; });
  }
  function toggleFilter(k, v) {
    if (k === 'sizes') v = +v;
    var list = state[k], i = list.indexOf(v);
    if (i > -1) list.splice(i, 1); else list.push(v);
    if (k === 'sizes') list.sort(byNum);
  }

  /* ===========================================================================
     09  Grid — product cards + editorial tiles, keyed nodes, FLIP transitions
     ======================================================================== */
  function tilePool() {
    var pool = TILES.filter(function (t) { return t.cat !== state.cat; });
    var shift = state.cat ? CAT_IDS.indexOf(state.cat) + 1 : state.saved ? 1 : state.fresh ? 2 : 0;
    shift = shift % pool.length;
    return pool.slice(shift).concat(pool.slice(0, shift));
  }
  // rows are packed so that tiles never leave holes and DOM order = visual order
  function buildSequence(list, c) {
    var seq = [], tiles = list.length >= 6 ? tilePool() : [], t = 0, i = 0, since = 0;
    var firstGap = c >= 2 ? c * 2 : 3, nextGap = c >= 2 ? c * 3 : 5, maxTiles = 3;
    function product() { seq.push({ key: 'p-' + list[i].id, p: list[i], n: i + 1 }); i++; since++; }
    while (i < list.length) {
      var left = list.length - i;
      if (t < tiles.length && t < maxTiles && since >= (t ? nextGap : firstGap) && left >= Math.max(1, c - 2)) {
        var tile = tiles[t], side = t % 2 ? 'end' : 'start', k;
        var kind = c >= 3 ? (tile.kind === 'wide' ? 'wide' : 'split') : 'full';
        var item = { key: 't-' + tile.id, tile: tile, kind: kind, side: side, span: Math.min(2, c), num: t + 1 };
        if (c >= 3 && side === 'end') for (k = 0; k < c - 2; k++) product();
        seq.push(item);
        if (c >= 3 && side === 'start') for (k = 0; k < c - 2; k++) product();
        t++; since = 0;
        continue;
      }
      for (var j = 0; j < c && i < list.length; j++) product();
    }
    return closeRow(seq, c);
  }
  // an unfinished last row is closed by a quiet "write to us" tile instead of a hole
  // (keyed by its span, so a width change cross-fades instead of stretching)
  function closeRow(seq, c) {
    if (c < 2 || !seq.length) return seq;
    var used = 0;
    seq.forEach(function (it) { used += it.span || 1; });
    var hole = (c - used % c) % c;
    if (hole) seq.push({ key: 't-help-' + hole, help: true, span: hole });
    return seq;
  }
  function helpHTML(it) {
    var mark = w.BENM_BRAND ? w.BENM_BRAND.svg('monogram', { foil: true, decorative: true }) : '';
    return '<article class="shop-tile shop-tile--help theme-forest' + (it.span > 1 ? ' is-wide' : '') + '" aria-labelledby="shop-tile-help">' +
      '<div class="shop-tile__body">' +
        '<span class="c-corners" aria-hidden="true"></span>' +
        '<span class="shop-tile__mark" aria-hidden="true">' + mark + '</span>' +
        '<div class="shop-tile__foot">' +
          '<p class="shop-tile__line" id="shop-tile-help" data-i18n-html="shop.tile.help.line">' + B.t('shop.tile.help.line') + '</p>' +
          '<a class="c-link shop-tile__cta" href="' + esc(helpLink()) + '" target="_blank" rel="noopener" data-shop-help-tile>' +
            '<span data-i18n="shop.tile.help.link">' + esc(B.t('shop.tile.help.link')) + '</span>' + icon('arrow-up-right') + '</a>' +
        '</div>' +
      '</div>' +
    '</article>';
  }
  function helpLink() { return B.whatsappLink(B.t('shop.end.helpMessage')); }
  function tileHTML(it) {
    var tl = it.tile, base = 'shop.tile.' + tl.id + '.';
    var theme = it.kind === 'split' ? (tl.theme === 'paper' ? 'theme-paper' : 'theme-dark') : 'theme-dark';
    return '<article class="shop-tile ' + theme + '" data-key="' + it.key + '" data-cursor-label="cursor.discover" aria-labelledby="shop-tile-' + tl.id + '">' +
      '<div class="shop-tile__media">' +
        '<img src="' + esc(B.url(tl.src)) + '" alt="' + esc(B.t(base + 'alt')) + '" data-i18n-attr="alt:' + base + 'alt" width="' + tl.w + '" height="' + tl.h + '"' +
        ' loading="lazy" decoding="async" style="object-position:' + tl.pos + '">' +
      '</div>' +
      '<div class="shop-tile__body">' +
        (it.kind === 'split' ? '<span class="c-corners" aria-hidden="true"></span>' : '') +
        '<p class="c-eyebrow c-eyebrow--line"><span class="c-eyebrow__num" data-tile-num>' + pad2(it.num) + '</span><span data-i18n="' + base + 'eyebrow">' + esc(B.t(base + 'eyebrow')) + '</span></p>' +
        '<p class="shop-tile__line" id="shop-tile-' + tl.id + '" data-i18n-html="' + base + 'line">' + B.t(base + 'line') + '</p>' +
        '<a class="c-link shop-tile__cta" href="' + esc(B.url(tl.href)) + '"><span data-i18n="' + base + 'link">' + esc(B.t(base + 'link')) + '</span>' + icon('arrow') + '</a>' +
      '</div>' +
    '</article>';
  }
  function styleTile(el, it) {
    el.className = el.className.replace(/\bshop-tile--\S+/g, '').replace(/\s+/g, ' ').trim() + ' shop-tile--' + it.kind + ' shop-tile--' + it.side;
    el.style.gridColumn = 'span ' + it.span;
    var num = $('[data-tile-num]', el);
    if (num) num.textContent = pad2(it.num);
  }
  function createNode(it, eager) {
    var holder = d.createElement('div');
    if (it.help) holder.innerHTML = helpHTML(it);
    else if (it.tile) holder.innerHTML = tileHTML(it);
    else holder.innerHTML = B.productCard(it.p, { index: it.n, heading: 'h3', reveal: 'up', eager: !!eager });
    var el = holder.firstElementChild;
    if (!el) return null;
    el.setAttribute('data-key', it.key);
    if (it.help) { el.setAttribute('data-reveal', 'up'); el.style.gridColumn = 'span ' + it.span; }
    else if (it.tile) { el.setAttribute('data-reveal', 'up'); styleTile(el, it); }
    return el;
  }
  function updateNode(el, it) {
    if (it.help) return;
    if (it.tile) { styleTile(el, it); return; }
    var idx = $('.c-card__index', el);
    if (idx) idx.textContent = 'N°' + pad2(it.n);
  }
  function relRect(el, g) {
    var r = el.getBoundingClientRect();
    return { x: r.left - g.left, y: r.top - g.top, w: r.width, h: r.height };
  }
  function nearView(r, g) {
    var top = g.top + r.y, vh = w.innerHeight || d.documentElement.clientHeight;
    return top < vh + 120 && top + r.h > -120;
  }

  function renderGrid(list, animate) {
    var grid = ui.grid, c = columns();
    var doAnim = !!animate && !RM && B.isReady();
    var seq = buildSequence(list, c);

    $$('.is-ghost', grid).forEach(function (g) { if (gsap) gsap.killTweensOf(g); g.remove(); });
    var old = {};
    $$(':scope > [data-key]', grid).forEach(function (el) { old[el.getAttribute('data-key')] = el; });
    var g0 = grid.getBoundingClientRect(), before = {};
    if (doAnim) Object.keys(old).forEach(function (k) { before[k] = relRect(old[k], g0); });

    grid.style.setProperty('--cols', c);
    grid.setAttribute('data-cols', c);

    var nodes = [], fresh = [];
    seq.forEach(function (it, i) {
      var el = old[it.key];
      if (el) { delete old[it.key]; updateNode(el, it); }
      else { el = createNode(it, !B.isReady() && i < c); if (!el) return; fresh.push(el); }
      nodes.push(el);
    });

    // leaving nodes: fade out where they stood (ghosts), or just go
    Object.keys(old).forEach(function (k) {
      var el = old[k], r = before[k];
      if (!doAnim || !r || !list.length || !nearView(r, g0)) { el.remove(); return; }
      el.classList.add('is-ghost');
      el.setAttribute('aria-hidden', 'true');
      el.inert = true;
      el.style.cssText += ';position:absolute;left:' + r.x + 'px;top:' + r.y + 'px;width:' + r.w + 'px;height:' + r.h + 'px;margin:0';
      gsap.to(el, { opacity: 0, scale: .97, duration: .38, ease: 'power2.in', overwrite: true, onComplete: function () { el.remove(); } });
    });

    // order the DOM (moves only what is out of place)
    nodes.forEach(function (el, i) {
      var at = grid.children[i];
      if (at !== el) grid.insertBefore(el, at || null);
    });

    if (doAnim) {
      var g1 = grid.getBoundingClientRect(), j = 0, hasExit = !!$('.is-ghost', grid);
      nodes.forEach(function (el) {
        var k = el.getAttribute('data-key'), a = before[k];
        if (fresh.indexOf(el) > -1) {
          var rr = relRect(el, g1);
          if (nearView(rr, g1)) el.setAttribute('data-reveal-delay', (Math.min(j++, 8) * .06 + (hasExit ? .18 : .04)).toFixed(2));
          return;
        }
        if (!a) return;
        if (el.hasAttribute('data-reveal') && !el.classList.contains('is-revealed')) return;   // its reveal is still to come
        var b = relRect(el, g1);
        var dx = a.x - b.x, dy = a.y - b.y, s = b.w ? a.w / b.w : 1;
        if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && Math.abs(s - 1) < .01) return;
        if (!nearView(a, g0) && !nearView(b, g1)) return;
        gsap.fromTo(el, { x: dx, y: dy, scale: s, transformOrigin: '0 0' }, {
          x: 0, y: 0, scale: 1, duration: 1, ease: 'expo.out', overwrite: true, clearProps: 'transform,transformOrigin'
        });
      });
    }
    B.reveal(grid);
  }

  /* ===========================================================================
     10  Empty states — nothing saved · nothing found · filters too narrow
     ======================================================================== */
  function emptyKind() {
    if (last.results.length) return '';
    if (state.saved && !B.wishlist.count()) return 'saved';
    if (state.q && !filterCount() && !baseList().length) return 'search';
    return 'filters';
  }
  function btn(cls, href, label, attrs) {
    return '<a class="c-btn ' + cls + '" href="' + esc(href) + '"' + (attrs || '') + '><span class="c-btn__label"><span>' + esc(label) + '</span></span></a>';
  }
  function suggestions(kind) {
    var pool = kind === 'filters' && last.scope.length ? sortList(last.scope.slice()) : PRODUCTS.filter(function (p) { return p.featured; });
    var ids = B.wishlist.ids();
    pool = pool.concat(PRODUCTS).filter(function (p, i, a) { return a.indexOf(p) === i && (kind !== 'saved' || ids.indexOf(p.id) < 0); });
    return pool.slice(0, 4);
  }
  function renderEmpty(kind, animate) {
    var el = ui.empty;
    if (!kind) {
      if (!el.hidden) { el.hidden = true; el.innerHTML = ''; }
      last.empty = '';
      return;
    }
    var mark, title, text, chips = '', actions = '';
    if (kind === 'saved') {
      mark = icon('heart');
      title = B.t('shop.empty.savedTitle');
      text = B.t('shop.empty.savedText');
      actions = btn('c-btn--primary', B.url('shop.html'), B.t('shop.empty.savedCta'), ' data-magnetic') +
        btn('c-btn--ghost', B.url('shop.html?new=1'), B.t('shop.empty.newCta'));
    } else if (kind === 'search') {
      mark = w.BENM_BRAND ? w.BENM_BRAND.svg('monogram', { decorative: true }) : '';
      title = B.t('shop.empty.searchTitle', { q: state.q });
      text = B.t('shop.empty.searchText');
      chips = [1, 2, 3, 4, 5, 6].map(function (i) {
        var s = B.t('search.s' + i);
        return '<a class="c-chip" href="' + esc(B.url('shop.html?q=' + encodeURIComponent(s))) + '">' + esc(s) + '</a>';
      }).join('');
      actions = btn('c-btn--primary', B.url('shop.html'), B.t('shop.empty.all'));
    } else {
      mark = w.BENM_BRAND ? w.BENM_BRAND.svg('monogram', { decorative: true }) : '';
      title = B.t('shop.empty.title');
      text = B.t('shop.empty.text');
      chips = chipsData().map(chipHTML).join('');
      if (filterCount()) actions += '<button class="c-btn c-btn--primary" type="button" data-clear-all><span class="c-btn__label"><span>' + esc(B.t('shop.empty.reset')) + '</span></span></button>';
      if (state.cat && baseList().length) actions += btn('c-btn--ghost', hrefFor({ cat: '' }), B.t('shop.empty.everywhere'));
      else actions += btn('c-btn--ghost', B.url('shop.html'), B.t('shop.empty.all'));
    }
    var picks = suggestions(kind);
    el.innerHTML =
      '<div class="shop-empty__panel">' +
        '<span class="c-corners" aria-hidden="true"></span>' +
        '<span class="shop-empty__mark" aria-hidden="true">' + mark + '</span>' +
        '<h3 class="shop-empty__title">' + esc(title) + '</h3>' +
        '<p class="shop-empty__text">' + esc(text) + '</p>' +
        (chips ? '<div class="shop-empty__chips">' + chips + '</div>' : '') +
        '<div class="shop-empty__actions">' + actions + '</div>' +
      '</div>' +
      (picks.length ? '<div class="shop-empty__suggest">' +
        '<div class="shop-empty__suggest-head"><p class="c-eyebrow c-eyebrow--line">' + esc(B.t('shop.empty.suggest')) + '</p></div>' +
        '<div class="shop-empty__row">' + picks.map(function (p) { return B.productCard(p, { heading: 'h4', reveal: 'up' }); }).join('') + '</div>' +
      '</div>' : '');
    var wasHidden = el.hidden;
    el.hidden = false;
    last.empty = kind;
    if (animate && !RM && wasHidden) {
      gsap.fromTo($('.shop-empty__panel', el), { opacity: 0, y: 34 }, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', delay: .1, clearProps: 'opacity,transform' });
    }
    B.reveal(el);
  }

  /* ===========================================================================
     11  End of list · band (cities, services, WhatsApp)
     ======================================================================== */
  function renderEnd() {
    var n = last.results.length, href = helpLink();
    var tiles = $$('[data-shop-help-tile]', ui.grid);
    ui.end.hidden = !n;
    if (n) ui.endText.textContent = B.t('shop.end.text', { n: n });
    ui.help.href = href;
    tiles.forEach(function (a) { a.href = href; });
    // the grid's own "write to us" tile makes the line under it redundant
    ui.endHelp.hidden = tiles.some(function (a) { return !a.closest('.is-ghost'); });
  }
  function renderBand() {
    if (!ui.cities.children.length) {
      ui.cities.innerHTML = STORES.map(function (s, i) {
        return '<li><a class="shop-city" href="' + esc(B.url('boutiques.html')) + '"><span class="shop-city__n" aria-hidden="true">' + pad2(i + 1) + '</span>' +
          '<span class="shop-city__name" data-store="' + esc(s.id) + '"></span>' + icon('arrow') + '</a></li>';
      }).join('');
    }
    $$('[data-store]', ui.cities).forEach(function (el) {
      var s = STORES.filter(function (x) { return x.id === el.getAttribute('data-store'); })[0];
      if (s) el.textContent = B.loc(s.city);
    });
    ui.ship.textContent = B.t('shop.band.ship', { amount: B.price(CONFIG.freeShippingThreshold || 200) });
    ui.wa.href = B.whatsappLink(B.t('shop.band.waMessage'));
  }

  /* ===========================================================================
     12  Filter panel — BENM.modal (focus trap, Esc, scroll lock, restore)
     ======================================================================== */
  function panelHTML(sc) {
    var types = unique(sc.map(function (p) { return p.type; }));
    state.types.forEach(function (t) { if (types.indexOf(t) < 0) types.push(t); });
    var colors = COLOR_IDS.filter(function (id) { return state.colors.indexOf(id) > -1 || sc.some(function (p) { return hasColor(p, id); }); });
    var sizes = unique([].concat.apply([], sc.map(function (p) { return p.sizes || []; })).concat(state.sizes)).sort(byNum);
    var bounds = priceBounds(sc);
    var n = 0;
    var group = function (key, label, body, extra) {
      n++;
      return '<fieldset class="shop-panel__group" data-group="' + key + '">' +
        '<legend class="shop-panel__legend"><span class="shop-panel__num" aria-hidden="true">' + pad2(n) + '</span><span>' + esc(label) + '</span></legend>' +
        body + (extra || '') + '</fieldset>';
    };
    var html = '<div class="shop-panel__head">' +
        '<div><h2 class="shop-panel__title" id="shop-panel-title">' + esc(B.t('shop.panel.title')) + '</h2>' +
        '<p class="shop-panel__status" role="status" data-panel-status></p></div>' +
        '<button class="c-icon-btn c-icon-btn--framed shop-panel__close" type="button" data-modal-close aria-label="' + esc(B.t('a11y.close')) + '">' + icon('close') + '</button>' +
      '</div>' +
      '<div class="shop-panel__body">' +
        '<div class="shop-panel__selected" data-panel-selected hidden><div class="shop-panel__chips" data-panel-chips></div></div>';
    if (types.length > 1 || state.types.length) {
      html += group('types', B.t('shop.panel.type'), '<div class="shop-panel__chips">' + types.map(function (t) {
        return '<button class="c-chip shop-panel__opt" type="button" data-filter="types" data-value="' + esc(t) + '" aria-pressed="false">' +
          '<span>' + esc(typeLabel(t)) + '</span><span class="c-chip__count" data-n></span></button>';
      }).join('') + '</div>');
    }
    if (colors.length) {
      html += group('colors', B.t('shop.panel.colour'), '<div class="shop-colours">' + colors.map(function (id) {
        var l = leather(id);
        return '<button class="shop-colour shop-panel__opt" type="button" data-filter="colors" data-value="' + esc(id) + '" aria-pressed="false">' +
          '<span class="shop-colour__dot" style="--swatch:' + esc(l.hex) + '" aria-hidden="true"></span>' +
          '<span class="shop-colour__name">' + esc(B.loc(l.name)) + '</span><span class="shop-colour__n" data-n></span></button>';
      }).join('') + '</div>');
    }
    if (bounds) {
      var lo = state.min != null ? Math.max(bounds.lo, Math.min(state.min, bounds.hi)) : bounds.lo;
      var hi = state.max != null ? Math.min(bounds.hi, Math.max(state.max, bounds.lo)) : bounds.hi;
      var bars = '';
      for (var i = 0; i < HIST_BINS; i++) bars += '<span class="shop-price__bar"></span>';
      html += group('price', B.t('shop.panel.price'),
        '<div class="shop-price">' +
          '<div class="shop-price__hist" aria-hidden="true">' + bars + '</div>' +
          '<div class="shop-price__range">' +
            '<span class="shop-price__track"></span><span class="shop-price__fill" data-price-fill></span>' +
            '<input class="shop-price__input" type="range" data-range="min" min="' + bounds.lo + '" max="' + bounds.hi + '" step="' + PRICE_STEP + '" value="' + lo + '" aria-label="' + esc(B.t('shop.panel.min')) + '">' +
            '<input class="shop-price__input" type="range" data-range="max" min="' + bounds.lo + '" max="' + bounds.hi + '" step="' + PRICE_STEP + '" value="' + hi + '" aria-label="' + esc(B.t('shop.panel.max')) + '">' +
          '</div>' +
          '<div class="shop-price__vals"><output data-price-out="min"></output><output data-price-out="max"></output></div>' +
        '</div>');
    }
    if (sizes.length) {
      html += group('sizes', B.t('shop.panel.size'), '<div class="c-sizes">' + sizes.map(function (s) {
        return '<button class="c-size shop-panel__opt" type="button" data-filter="sizes" data-value="' + s + '" aria-pressed="false">' + esc(B.num(s)) + '</button>';
      }).join('') + '</div>', '<p class="shop-panel__note">' + esc(B.t('shop.panel.sizeNote')) + '</p>');
    }
    html += '</div>' +
      '<div class="shop-panel__foot">' +
        '<button class="c-btn c-btn--ghost c-btn--sm" type="button" data-clear-all><span class="c-btn__label"><span>' + esc(B.t('shop.clear')) + '</span></span></button>' +
        '<button class="c-btn c-btn--primary c-btn--sm" type="button" data-modal-close data-panel-apply><span class="c-btn__label"><span data-panel-show></span></span></button>' +
      '</div>';
    return { html: html, bounds: bounds };
  }

  function openPanel() {
    if (panel || !B.modal) return;
    var sc = scopeList();
    var built = panelHTML(sc);
    var el = d.createElement('div');
    el.className = 'shop-panel';
    el.innerHTML = built.html;
    panel = { el: el, scope: sc, bounds: built.bounds, dirty: false };
    ui.filterBtn.setAttribute('aria-expanded', 'true');
    B.modal.open(el, {
      labelledBy: 'shop-panel-title',
      size: 'md',
      theme: 'light',
      className: 'shop-filters',
      initialFocus: '.shop-panel__close',
      onOpen: function (p) {
        el.addEventListener('click', onPanelClick);
        el.addEventListener('input', onPanelInput);
        syncPanel();
        if (RM) return;
        if (w.innerWidth >= 760) {                   // side panel: slide in from the inline end
          gsap.killTweensOf(p);
          gsap.fromTo(p, { xPercent: B.isRTL() ? -100 : 100, opacity: 1, y: 0 }, { xPercent: 0, duration: .95, ease: 'expo.out' });
        }
        var groups = $$('.shop-panel__group, .shop-panel__selected:not([hidden])', el);
        if (groups.length) gsap.from(groups, { opacity: 0, y: 26, duration: .9, ease: 'expo.out', stagger: .06, delay: .18, clearProps: 'opacity,transform' });
      },
      onClose: function () {
        var dirty = panel && panel.dirty;
        panel = null;
        ui.filterBtn.setAttribute('aria-expanded', 'false');
        if (dirty) apply({ scroll: true });
      }
    });
  }
  function onPanelClick(e) {
    var t = e.target;
    var opt = t.closest('[data-filter]');
    if (opt) {
      toggleFilter(opt.getAttribute('data-filter'), opt.getAttribute('data-value'));
      panelChanged();
      return;
    }
    var chip = t.closest('[data-remove]');
    if (chip) {
      removeFilter(chip.getAttribute('data-remove'), chip.getAttribute('data-value'));
      panelChanged(true);
      var first = $('[data-panel-chips] [data-remove]', panel.el) || $('.shop-panel__close', panel.el);
      if (first) first.focus();
      return;
    }
    if (t.closest('[data-clear-all]')) {
      clearFilters();
      panelChanged(true);
    }
  }
  function onPanelInput(e) {
    var inp = e.target;
    if (!inp.hasAttribute('data-range') || !panel || !panel.bounds) return;
    var mn = $('[data-range="min"]', panel.el), mx = $('[data-range="max"]', panel.el);
    var a = +mn.value, b = +mx.value;
    if (a > b - PRICE_STEP) {
      if (inp === mn) { a = Math.max(panel.bounds.lo, b - PRICE_STEP); mn.value = a; }
      else { b = Math.min(panel.bounds.hi, a + PRICE_STEP); mx.value = b; }
    }
    state.min = a <= panel.bounds.lo ? null : a;
    state.max = b >= panel.bounds.hi ? null : b;
    panelChanged(false, true);
  }
  function panelChanged(resetRange, fromRange) {
    panel.dirty = true;
    if (resetRange && panel.bounds) {
      var mn = $('[data-range="min"]', panel.el), mx = $('[data-range="max"]', panel.el);
      mn.value = state.min != null ? state.min : panel.bounds.lo;
      mx.value = state.max != null ? state.max : panel.bounds.hi;
    }
    syncPanel();
    if (fromRange) writeURLSoon(); else writeURL();
  }
  function syncPanel() {
    if (!panel) return;
    var el = panel.el, sc = panel.scope;
    var n = sc.filter(function (p) { return matches(p); }).length;
    $('[data-panel-status]', el).textContent = B.t('shop.count', { n: n });
    $('[data-panel-show]', el).textContent = n ? B.t('shop.panel.show', { n: n }) : B.t('shop.panel.showNone');
    $$('[data-filter]', el).forEach(function (o) {
      var k = o.getAttribute('data-filter'), v = o.getAttribute('data-value');
      var val = k === 'sizes' ? +v : v;
      var pool = sc.filter(function (p) { return matches(p, k); });
      var count = pool.filter(function (p) {
        return k === 'types' ? p.type === val : k === 'colors' ? hasColor(p, val) : inStock(p, val);
      }).length;
      var on = state[k].indexOf(val) > -1;
      o.setAttribute('aria-pressed', String(on));
      o.classList.toggle('is-empty', !count);
      var nEl = $('[data-n]', o);
      if (nEl) nEl.textContent = B.num(count);
    });
    // selected chips + clear
    var chips = chipsData();
    var sel = $('[data-panel-selected]', el);
    sel.hidden = !chips.length;
    $('[data-panel-chips]', el).innerHTML = chips.map(chipHTML).join('');
    $$('[data-clear-all]', el).forEach(function (b) { b.disabled = !chips.length; });
    syncPrice();
  }
  function syncPrice() {
    if (!panel || !panel.bounds) return;
    var el = panel.el, bd = panel.bounds;
    var mn = $('[data-range="min"]', el), mx = $('[data-range="max"]', el);
    var a = +mn.value, b = +mx.value, span = bd.hi - bd.lo;
    var pa = (a - bd.lo) / span * 100, pb = (b - bd.lo) / span * 100;
    var fill = $('[data-price-fill]', el);
    // 9px = half a thumb: the fill runs between the thumb centres
    fill.style.insetInlineStart = 'calc(9px + (100% - 18px) * ' + (pa / 100).toFixed(4) + ')';
    fill.style.insetInlineEnd = 'calc(9px + (100% - 18px) * ' + (1 - pb / 100).toFixed(4) + ')';
    mn.style.zIndex = pa > 90 ? 3 : 2;
    mx.style.zIndex = 2;
    mn.setAttribute('aria-valuetext', B.price(a));
    mx.setAttribute('aria-valuetext', B.price(b));
    $('[data-price-out="min"]', el).textContent = B.price(a);
    $('[data-price-out="max"]', el).textContent = B.price(b);
    // histogram of the pieces that pass the other filters
    var pool = panel.scope.filter(function (p) { return matches(p, 'price'); });
    var bins = [], i, max = 0;
    for (i = 0; i < HIST_BINS; i++) bins.push(0);
    pool.forEach(function (p) { var k = Math.min(HIST_BINS - 1, Math.floor((p.price - bd.lo) / span * HIST_BINS)); bins[Math.max(0, k)]++; });
    bins.forEach(function (v) { if (v > max) max = v; });
    $$('.shop-price__bar', el).forEach(function (bar, k) {
      var from = bd.lo + span * k / HIST_BINS, to = bd.lo + span * (k + 1) / HIST_BINS;
      bar.style.blockSize = (bins[k] ? 18 + 82 * bins[k] / max : 4) + '%';
      bar.classList.toggle('is-in', bins[k] > 0 && to > a && from < b);
    });
  }

  /* ===========================================================================
     13  In-page navigation — tabs, tiles, crumbs and empty states that point
         at shop.html update the view instead of reloading the page
     ======================================================================== */
  var SHOP_HREF = /^(?:\.\/)?shop\.html(\?[^#]*)?$/i;
  function onMainClick(e) {
    var t = e.target;
    if (!t || !t.closest || e.defaultPrevented) return;
    var tile = t.closest('.shop-tile:not(.shop-tile--help)');
    if (tile && !t.closest('a, button')) {                  // whole tile is clickable (the link stays the a11y target)
      var link = $('.shop-tile__cta', tile);
      if (link && !(w.getSelection && String(w.getSelection()))) link.click();
      return;
    }
    if (t.closest('[data-clear-all]')) { clearFilters(); apply({}); focusAfterChips(0); return; }
    var chip = t.closest('[data-remove]');
    if (chip && ui.active.contains(chip)) {
      var at = $$('[data-remove]', ui.active).indexOf(chip);
      removeFilter(chip.getAttribute('data-remove'), chip.getAttribute('data-value'));
      apply({});
      focusAfterChips(at);
      return;
    }
    if (chip && ui.empty.contains(chip)) { removeFilter(chip.getAttribute('data-remove'), chip.getAttribute('data-value')); apply({}); return; }
    var a = t.closest('a[href]');
    if (!a || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if ((a.target && a.target !== '_self') || a.hasAttribute('download')) return;
    var m = SHOP_HREF.exec(a.getAttribute('href') || '');
    if (!m) return;
    e.preventDefault();
    navigate(m[1] || '', a.closest('.shop-cats') ? 'tabs' : 'link');
  }
  function focusAfterChips(at) {
    var chips = $$('[data-remove]', ui.active);
    var next = chips[Math.min(at, chips.length - 1)];
    (next || ui.filterBtn).focus();
  }
  function navigate(search, from) {
    var keep = { colors: state.colors.slice(), sort: state.sort };
    var p;
    try { p = new URLSearchParams(search); } catch (e) { p = { get: function () { return null; } }; }
    readParams(p);
    if (from === 'tabs') state.colors = keep.colors;
    if (!state.sort && keep.sort && sortOptions().indexOf(keep.sort) > -1) state.sort = keep.sort === defaultSort() ? '' : keep.sort;
    apply({ top: from !== 'tabs' });
  }

  /* ===========================================================================
     14  Update cycle · events · boot
     ======================================================================== */
  // one pass: data → hero → tabs → toolbar → chips → grid / empty → end → URL
  function render(animate) {
    compute();
    renderHero(animate);
    renderTabs();
    placeLine(animate);
    renderToolbar();
    renderActive();
    var kind = emptyKind();
    renderGrid(kind ? [] : last.results, animate);
    renderEmpty(kind, animate);
    renderEnd();
    writeURL();
  }
  function apply(o) {
    o = o || {};
    var animate = B.isReady();
    if (o.top && (w.scrollY || 0) > 2) B.scrollTo(0, { duration: 1.2 });
    else if (o.scroll) scrollToResults();
    render(animate);
  }
  function scrollToResults() {
    var hh = d.getElementById('site-header');
    var y = ui.sentinel.getBoundingClientRect().top + (w.scrollY || 0) - (hh ? hh.offsetHeight : 0);
    if ((w.scrollY || 0) > y + 4) B.scrollTo(Math.max(0, y), { duration: 1.1 });
  }

  function initSticky() {
    var tb = ui.toolbar, header = d.getElementById('site-header'), stuck = false, io = null;
    function paint() {
      tb.classList.toggle('is-stuck', stuck);
      tb.classList.toggle('is-lifted', stuck && !!header && header.classList.contains('is-hidden'));
    }
    function observe() {
      if (!('IntersectionObserver' in w)) return;
      if (io) io.disconnect();
      var hh = header ? header.offsetHeight : 0;
      io = new IntersectionObserver(function (entries) {
        var en = entries[entries.length - 1];
        stuck = !en.isIntersecting && en.boundingClientRect.top < hh + 2;
        paint();
      }, { rootMargin: '-' + (hh + 1) + 'px 0px 0px 0px', threshold: 0 });
      io.observe(ui.sentinel);
    }
    observe();
    onMq(mqS, observe);
    if (header && 'MutationObserver' in w) new MutationObserver(paint).observe(header, { attributes: true, attributeFilter: ['class'] });
  }

  function cache() {
    var main = d.getElementById('main');
    ui.main = main;
    ui.titleBox = $('[data-shop-titlebox]', main);
    ui.title = $('[data-shop-title]', main);
    ui.titlePre = $('[data-shop-title-pre]', main);
    ui.count = $('[data-shop-count]', main);
    ui.lead = $('[data-shop-lead]', main);
    ui.intro = $('[data-shop-intro]', main);
    ui.crumbs = $('[data-shop-crumbs]', main);
    ui.layers = $('[data-shop-layers]', main);
    ui.capNum = $('[data-shop-capnum]', main);
    ui.cap = $('[data-shop-cap]', main);
    ui.search = $('[data-shop-search]', main);
    ui.searchInput = $('#shop-q', main);
    ui.ask = $('[data-shop-ask]', main);
    ui.askLink = $('[data-shop-ask-link]', main);
    ui.cats = $('[data-shop-cats]', main);
    ui.origin = $('.shop-cats__origin', main);
    ui.line = $('.shop-cats__line', main);
    ui.tabs = $$('.shop-cats__link', main);
    ui.sentinel = $('.shop-sentinel', main);
    ui.toolbar = $('[data-shop-toolbar]', main);
    ui.filterBtn = $('[data-shop-filter-open]', main);
    ui.filterN = $('[data-shop-filter-n]', main);
    ui.status = $('[data-shop-status]', main);
    ui.sortRoot = $('[data-shop-sort]', main);
    ui.sortBtn = $('#shop-sort-btn', main);
    ui.sortValue = $('[data-shop-sort-value]', main);
    ui.sortList = $('[data-shop-sort-list]', main);
    ui.density = $('[data-shop-density]', main);
    ui.active = $('[data-shop-active]', main);
    ui.grid = $('[data-shop-grid]', main);
    ui.empty = $('[data-shop-empty]', main);
    ui.end = $('[data-shop-end]', main);
    ui.endText = $('[data-shop-end-text]', main);
    ui.endHelp = $('[data-shop-end-help]', main);
    ui.help = $('[data-shop-help]', main);
    ui.cities = $('[data-shop-cities]', main);
    ui.ship = $('[data-shop-ship]', main);
    ui.wa = $('[data-shop-wa]', main);
    return !!(ui.grid && ui.title && ui.toolbar);
  }

  function bind() {
    ui.main.addEventListener('click', onMainClick);
    ui.filterBtn.addEventListener('click', openPanel);
    ui.density.addEventListener('click', function (e) {
      var b = e.target.closest('[data-density]');
      if (!b) return;
      var n = +b.getAttribute('data-density');
      if (n === columns()) return;
      prefs[mode()] = n;
      savePrefs();
      renderDensity();
      var again = $('[data-density="' + n + '"]', ui.density);
      if (again) again.focus();
      renderGrid(last.empty ? [] : last.results, true);
      renderEnd();
    });
    ui.search.addEventListener('submit', function (e) {
      e.preventDefault();
      var q = ui.searchInput.value.replace(/\s+/g, ' ').trim().slice(0, 80);
      state.q = q;
      state.cat = '';
      clearFilters();
      if (state.sort && sortOptions().indexOf(state.sort) < 0) state.sort = '';
      apply({});
      if (!q) ui.filterBtn.focus();
    });
    $('[data-shop-search-clear]', ui.search).addEventListener('click', function () {
      ui.searchInput.value = '';
      state.q = '';
      if (state.sort === 'relevance') state.sort = '';
      apply({});
      ui.filterBtn.focus();
    });
    var onResize = debounce(function () { placeLine(false); }, 160);
    w.addEventListener('resize', onResize);
    var onMode = function () { renderDensity(); renderGrid(last.empty ? [] : last.results, false); renderEnd(); placeLine(false); };
    onMq(mqS, onMode);
    onMq(mqM, onMode);
  }

  function fillIcons(root) {
    $$('[data-shop-icon]', root).forEach(function (el) { el.innerHTML = icon(el.getAttribute('data-shop-icon')); });
  }

  B.page(function () {
    if (!cache()) return;
    fillIcons(ui.main);
    readURL();
    initSort();
    renderDensity();
    renderBand();
    bind();
    render(false);
    initSticky();
    if (!RM) {                                    // hero title + count wait for the curtain
      gsap.set(ui.title, { yPercent: 112 });
      gsap.set(ui.count, { opacity: 0 });
    }
  });

  B.ready(function () {
    if (!ui.grid) return;
    placeLine(false);
    if (RM) return;
    gsap.to(ui.title, { yPercent: 0, duration: 1.5, ease: 'expo.out', delay: .05, clearProps: 'transform' });
    countState.v = 0;
    ui.count.textContent = B.num(0);
    gsap.to(ui.count, { opacity: 1, duration: .6, delay: .5 });
    gsap.to(countState, {
      v: last.results.length, duration: 1.4, delay: .5, ease: 'power2.out',
      onUpdate: function () { ui.count.textContent = B.num(Math.round(countState.v)); }
    });
    if (d.fonts && d.fonts.ready) d.fonts.ready.then(function () { placeLine(false); });
  });

  B.on('langchange', function () {
    if (!ui.grid) return;
    last.title = '';                               // force fresh texts, no swap animation
    renderHero(false);
    renderTabs();
    renderToolbar();
    renderActive();
    renderDensity();
    if (last.empty) renderEmpty(last.empty, false);
    renderEnd();
    renderBand();
    $$('.shop-hero__img', ui.layers).forEach(function (img) { img.alt = B.t(img.getAttribute('data-alt')); });
    placeLine(false);
    if (d.fonts && d.fonts.ready) d.fonts.ready.then(function () { placeLine(false); });
  });
  B.on('currencychange', function () {
    if (!ui.grid) return;
    renderActive();
    renderBand();
    if (state.saved && last.results.length) ui.askLink.href = B.whatsappLink(savedMessage(last.results));
    if (panel) syncPanel();
  });
  B.on('wishlist', function () {
    if (!ui.grid || !state.saved) return;
    apply({});
  });
})(window.BENM, window, document);
