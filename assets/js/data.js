/* =============================================================================
   Ben.M — Catalogue & configuration                          assets/js/data.js
   -----------------------------------------------------------------------------
   Classic script (no modules, no fetch) so the site works from file://.
   Loaded after i18n.js and before layout.js; it only assigns window globals:

     BENM_CONFIG      brand, currency, thresholds, contact details
     BENM_CATEGORIES  the four collections (Men, Women, Bags, Accessories)
     BENM_LEATHERS    the eight house leather colours (swatches + product colours)
     BENM_PRODUCTS    the 22 demo products
     BENM_STORES      the three boutiques

   Every visible string is a { en, ckb } pair (ckb = Central Kurdish / Sorani,
   rendered right-to-left). Prices are in USD; BENM.price() converts to IQD.
   Kurdish copy uses Kurdish letters (ی ک ە ڕ ڵ ێ ۆ) and Eastern Arabic digits.

   Products, prices and boutiques are DEMO CONTENT — replace before launch.
   Lines marked PLACEHOLDER must be replaced with the client's real details.
   ========================================================================== */

(function (w) {
  'use strict';

  /* ---------------------------------------------------------------------------
     1. Configuration
     ------------------------------------------------------------------------ */
  w.BENM_CONFIG = {
    brand: 'Ben.M',
    currency: { default: 'USD', iqdRate: 1310 },     // IQD per USD — configurable
    freeShippingThreshold: 200,                       // USD
    personalisationFee: 25,                           // USD
    whatsapp: '9647500000000',                        // PLACEHOLDER – client's WhatsApp number, digits only
    phone: '+964 750 000 0000',                       // PLACEHOLDER
    email: 'hello@benm-leather.com',                  // PLACEHOLDER
    social: {                                         // PLACEHOLDER – replace with the client's profile URLs
      instagram: 'https://www.instagram.com/',
      facebook: 'https://www.facebook.com/',
      tiktok: 'https://www.tiktok.com/'
    }
  };

  /* ---------------------------------------------------------------------------
     2. Categories — order = N°01–04 on the home page
        tagline: one line (cards, menu) · intro: 1–2 sentences (shop hero)
     ------------------------------------------------------------------------ */
  w.BENM_CATEGORIES = [
    {
      id: 'men',
      name: { en: 'Men', ckb: 'پیاوان' },
      tagline: {
        en: 'Built on the last. Broken in by life.',
        ckb: 'لەسەر قاڵب دروستکراون، هەنگاو بە هەنگاو لەگەڵ پێت ڕادێن.'
      },
      intro: {
        en: 'Oxfords, derbies, loafers and boots, each one built on the last and finished by hand. Shoes for the formal hours, and for the long walks in between.',
        ckb: 'ئۆکسفۆرد، دێربی، لۆفەر و پۆتین، هەر یەکەیان لەسەر قاڵب دروستکراوە و بە دەست تەواوکراوە. پێڵاو بۆ کاتە فەرمییەکان، و بۆ ئەو ڕێگا درێژانەی لە نێوانیاندان.'
      },
      image: 'assets/img/categories/men.jpg'
    },
    {
      id: 'women',
      name: { en: 'Women', ckb: 'ئافرەتان' },
      tagline: {
        en: 'Poised lines in supple leather, made to move with you.',
        ckb: 'هێڵی ناسک و چەرمی نەرم، دروستکراو بۆ ئەوەی لەگەڵ هەر هەنگاوێکت بڕوات.'
      },
      intro: {
        en: 'Pumps, loafers, ballerinas and boots in supple calf and suede. Light on the foot, exact in line, made for days that run late into the evening.',
        ckb: 'پاژنەبەرز، لۆفەر، باڵێرینا و پۆتین لە چەرمی گوێرەکەی نەرم و چەرمی مەخمەڵی. سووک لە پێدا، ورد لە هێڵدا، بۆ ئەو ڕۆژانەی تا درەنگانی ئێوارە درێژ دەبنەوە.'
      },
      image: 'assets/img/categories/women.jpg'
    },
    {
      id: 'bags',
      name: { en: 'Bags', ckb: 'جانتاکان' },
      tagline: {
        en: 'Leather that carries your day, and keeps its shape for years.',
        ckb: 'چەرمێک کە ڕۆژەکەت هەڵدەگرێت و ساڵانێک شێوەی خۆی دەپارێزێت.'
      },
      intro: {
        en: 'Totes, briefcases and travel bags in full-grain and vegetable-tanned leather. Built around what you carry, and made to go on carrying it.',
        ckb: 'جانتای تۆت، جانتای کار و جانتای گەشت لە چەرمی ڕووتەواو و چەرمی خۆشکراو بە ڕووەک. بە دەوری ئەو شتانەدا دروستکراون کە هەڵیاندەگریت، بۆ ئەوەی بە درێژایی ساڵان هەڵیانبگرن.'
      },
      image: 'assets/img/categories/bags.jpg'
    },
    {
      id: 'accessories',
      name: { en: 'Accessories', ckb: 'ئێکسسوارات' },
      tagline: {
        en: 'The small things, made with the same patience.',
        ckb: 'شتە بچووکەکان، بە هەمان پشوودرێژی دروستکراون.'
      },
      intro: {
        en: 'Belts, wallets and travel pieces, saddle-stitched and edge-painted by hand. Small things, held to the same standard as everything else we make.',
        ckb: 'قایش، جزدان و پێداویستییەکانی گەشت، بە دوو دەرزی و بە دەست دوورراون و لێوارەکانیان بە دەست ڕەنگ کراون. شتی بچووک، بەڵام بە هەمان ئەو پێوەرەی هەموو بەرهەمەکانی ترمانی پێ دروست دەکەین.'
      },
      image: 'assets/img/categories/accessories.jpg'
    }
  ];

  /* ---------------------------------------------------------------------------
     3. Leathers — the eight house colours
        hex: swatch colour · grain: suggested texture for BENM.Leather swatches
        ('smooth' | 'pebble' | 'suede') · description: one evocative line
     ------------------------------------------------------------------------ */
  var LEATHERS = [
    {
      id: 'forest', hex: '#1F3E35', grain: 'pebble',
      name: { en: 'Forest', ckb: 'سەوزی دارستان' },
      description: {
        en: 'The colour of the house — deep green, like pines at dusk.',
        ckb: 'ڕەنگی ماڵەکەمان؛ سەوزێکی قووڵ وەک دارکاژ لە تاریکوڕووندا.'
      }
    },
    {
      id: 'noir', hex: '#161616', grain: 'smooth',
      name: { en: 'Noir', ckb: 'ڕەش' },
      description: {
        en: 'An ink-deep black that takes a mirror shine.',
        ckb: 'ڕەشێکی قووڵ وەک مەرەکەب، کە بریقەی ئاوێنە وەردەگرێت.'
      }
    },
    {
      id: 'cognac', hex: '#8A4B22', grain: 'smooth',
      name: { en: 'Cognac', ckb: 'کۆنیاکی' },
      description: {
        en: 'A warm amber brown that deepens with every year of wear.',
        ckb: 'قاوەییەکی گەرمی مەیلەو سوور، کە ساڵ بە ساڵ قووڵتر دەبێتەوە.'
      }
    },
    {
      id: 'chestnut', hex: '#5A3220', grain: 'pebble',
      name: { en: 'Chestnut', ckb: 'شابەلووتی' },
      description: {
        en: 'The brown of chestnuts roasted on a winter night.',
        ckb: 'ڕەنگی شابەلووتی برژاو لە شەوێکی زستاندا.'
      }
    },
    {
      id: 'oxblood', hex: '#4A1518', grain: 'smooth',
      name: { en: 'Oxblood', ckb: 'هەناری تۆخ' },
      description: {
        en: 'A red-brown as dark as pomegranate seeds in shadow.',
        ckb: 'سوورێکی تۆخ وەک دەنکە هەنار لە سێبەردا.'
      }
    },
    {
      id: 'tan', hex: '#B07A45', grain: 'smooth',
      name: { en: 'Tan', ckb: 'هەنگوینی' },
      description: {
        en: 'Golden honey that slowly darkens into a rich patina.',
        ckb: 'ڕەنگی هەنگوین، کە بە تێپەڕبوونی کات هێدی هێدی تۆختر و جوانتر دەبێت.'
      }
    },
    {
      id: 'sand', hex: '#CDB28A', grain: 'suede',
      name: { en: 'Sand', ckb: 'لمی' },
      description: {
        en: 'Pale and sunlit — the plains at the end of summer.',
        ckb: 'کاڵ و ڕۆشن، ڕەنگی دەشت لە کۆتایی هاویندا.'
      }
    },
    {
      id: 'midnight', hex: '#1B2333', grain: 'pebble',
      name: { en: 'Midnight', ckb: 'شینی نیوەشەو' },
      description: {
        en: 'A blue so deep it passes for black, until the light finds it.',
        ckb: 'شینێکی هێندە قووڵ کە تا ڕووناکی پێی نەگات، ڕەش دەنوێنێت.'
      }
    }
  ];
  w.BENM_LEATHERS = LEATHERS;

  /* Product colours are taken from the leather table so names and hex values
     never drift: leather('noir', 'cognac') → [{ id, name, hex }, …].
     The FIRST colour of every product is the one shown in its photos. */
  var LEATHER_BY_ID = {};
  LEATHERS.forEach(function (l) { LEATHER_BY_ID[l.id] = l; });

  function leather() {
    return Array.prototype.slice.call(arguments)
      .filter(function (id) { return LEATHER_BY_ID[id]; })
      .map(function (id) {
        var l = LEATHER_BY_ID[id];
        return { id: l.id, name: l.name, hex: l.hex };
      });
  }

  /* ---------------------------------------------------------------------------
     4. Products — 22 demo pieces (ids are fixed: image files use them)
        price: USD · sizes: EU (men 39–46, women 35–41; [] = one size)
        soldOut: sizes currently unavailable · badge: 'new' | 'limited' | null
        details: same number of bullets in both languages
        related: "Complete the look" ids
     ------------------------------------------------------------------------ */
  w.BENM_PRODUCTS = [
    /* ----- Men -------------------------------------------------------- */
    {
      id: 'azmar-oxford',
      category: 'men',
      type: 'oxford',
      typeName: { en: 'Oxford', ckb: 'ئۆکسفۆرد' },
      name: { en: 'Azmar Oxford', ckb: 'ئۆکسفۆردی ئەزمەڕ' },
      price: 320,
      colors: leather('noir', 'chestnut', 'oxblood'),
      sizes: [39, 40, 41, 42, 43, 44, 45, 46],
      soldOut: [46],
      images: ['assets/img/products/azmar-oxford-1.jpg', 'assets/img/products/azmar-oxford-2.jpg'],
      isNew: true,
      featured: true,
      badge: 'new',
      personalisable: false,
      short: {
        en: 'The cap-toe oxford, drawn in its cleanest line.',
        ckb: 'ئۆکسفۆردێکی کلاسیک بە سەرەپەنجەی دوورراو، بە ساکارترین و پاکترین هێڵ.'
      },
      description: {
        en: 'The Azmar takes its name from the peak that keeps watch over Sulaymaniyah. It is our most formal shoe and the one that asks the most patience: full-grain calf cut from a single hide, closed lacing, and a cap toe burnished by hand until the colour runs deep. Wear it to the day that matters, then for every year after.',
        ckb: 'ئەزمەڕ ناوەکەی لەو چیایەوە وەرگرتووە کە چاودێری سلێمانی دەکات. فەرمیترین پێڵاوی ئێمەیە و ئەوەشە کە زۆرترین پشوودرێژی دەوێت: چەرمی گوێرەکەی لە یەک پارچە پێست دەبڕدرێت، قەیتانەکەی بە شێوەی داخراو دەبەسترێت، و سەرەپەنجەکەی بە دەست بریقە دەدرێت تا ڕەنگەکەی قووڵ دەبێتەوە. لە ڕۆژە گرنگەکەتدا لەپێی بکە، و دواتریش بۆ هەموو ساڵەکانی دوای ئەو.'
      },
      details: {
        en: [
          'Full-grain calf upper with a hand-burnished cap toe',
          'Calf lining and a cushioned leather insole',
          'Welt-stitched leather sole, made to be resoled',
          'Closed lacing, five eyelets, waxed cotton laces',
          'Handcrafted, finished by hand'
        ],
        ckb: [
          'ڕووی چەرمی گوێرەکەی ڕووتەواو، سەرەپەنجەی بە دەست بریقەدراو',
          'ناوپۆشی چەرمی گوێرەکە و ناوبنی چەرمی نەرم',
          'بنی چەرمی دوورراو، کە دەکرێت چەند جارێک نوێ بکرێتەوە',
          'قەیتانبەندی داخراو بە پێنج کون و قەیتانی لۆکەی مۆمکراو',
          'دەستکرد، بە دەست تەواوکراو'
        ]
      },
      care: {
        en: 'Rest them on cedar shoe trees between wears. Feed them with a neutral cream once a month and buff with a soft horsehair brush.',
        ckb: 'لە نێوان لەپێکردنەکاندا قاڵبی داری ئەرزیان تێ بکە. مانگی جارێک کرێمێکی بێڕەنگیان لێ بدە و بە فڵچەیەکی نەرمی موی ئەسپ بریقەیان پێ بدەوە.'
      },
      related: ['hawler-briefcase', 'dijla-belt', 'slemani-bifold', 'korek-double-monk']
    },
    {
      id: 'goizha-derby',
      category: 'men',
      type: 'derby',
      typeName: { en: 'Derby', ckb: 'دێربی' },
      name: { en: 'Goizha Derby', ckb: 'دێربی گۆیژە' },
      price: 285,
      colors: leather('tan', 'cognac', 'noir'),
      sizes: [39, 40, 41, 42, 43, 44, 45, 46],
      soldOut: [],
      images: ['assets/img/products/goizha-derby-1.jpg', 'assets/img/products/goizha-derby-2.jpg'],
      isNew: false,
      featured: false,
      badge: null,
      personalisable: false,
      short: {
        en: 'An open-laced derby with an easy fit and a quietly confident toe.',
        ckb: 'دێربییەکی قەیتانبەندی کراوە، ئاسوودە لە پێدا، بە سەرەپەنجەیەکی ئارام و بەخۆباوەڕ.'
      },
      description: {
        en: 'The Goizha is the shoe you reach for without thinking: open-laced, roomy enough to breathe, with a rounded toe that sits as well with tailoring as it does with denim. Its waxed calf shrugs off rain and scuffs, and the stitched sole is built to be renewed, not thrown away.',
        ckb: 'گۆیژە ئەو پێڵاوەیە کە بێ بیرکردنەوە دەستت بۆی دەچێت: قەیتانبەندییەکەی کراوەیە، پێ تێیدا هەناسە دەدات، و سەرەپەنجە خڕەکەی هەم لەگەڵ قاتدا دەگونجێت و هەم لەگەڵ جینزدا. چەرمە مۆمکراوەکەی بەرگەی باران و ڕووشان دەگرێت، و بنە دوورراوەکەی بۆ ئەوە دروستکراوە کە نوێ بکرێتەوە، نەک فڕێ بدرێت.'
      },
      details: {
        en: [
          'Waxed calf upper',
          'Soft calf lining throughout',
          'Welt-stitched leather sole with a rubber heel insert',
          'Open lacing, four eyelets',
          'Handcrafted'
        ],
        ckb: [
          'ڕووی چەرمی گوێرەکەی مۆمکراو',
          'ناوپۆشی تەواو لە چەرمی گوێرەکەی نەرم',
          'بنی چەرمی دوورراو و پاژنەی لاستیکی دژەخلیسکان',
          'قەیتانبەندی کراوە بە چوار کون',
          'دەستکرد'
        ]
      },
      care: {
        en: 'Brush away the day’s dust after each wear; the waxed finish asks only for an occasional coat of wax cream. Rain does them no harm, provided they dry at room temperature.',
        ckb: 'دوای هەر جارێک لەپێکردن، تۆزی ڕۆژەکەیان بە فڵچە لێ بکەرەوە؛ چەرمە مۆمکراوەکە تەنها جار جار پێویستی بە چینێک کرێمی مۆمدار هەیە. باران زیانیان پێ ناگەیەنێت، بە مەرجێک لە گەرمیی ئاسایی ژووردا وشک ببنەوە.'
      },
      related: ['rawanduz-lace-boot', 'bekhal-backpack', 'dijla-belt', 'amedi-wingtip-brogue']
    },
    {
      id: 'safeen-penny-loafer',
      category: 'men',
      type: 'penny-loafer',
      typeName: { en: 'Penny loafer', ckb: 'لۆفەری پێنی' },
      name: { en: 'Safeen Penny Loafer', ckb: 'لۆفەری سەفین' },
      price: 275,
      colors: leather('chestnut', 'cognac', 'noir'),
      sizes: [39, 40, 41, 42, 43, 44, 45, 46],
      soldOut: [],
      images: ['assets/img/products/safeen-penny-loafer-1.jpg', 'assets/img/products/safeen-penny-loafer-2.jpg'],
      isNew: true,
      featured: false,
      badge: null,
      personalisable: false,
      short: {
        en: 'A hand-sewn moccasin loafer that slips on like an old habit.',
        ckb: 'لۆفەرێکی بە دەست دوورراو، هێندە ئاسان لە پێ دەکرێت دەڵێی ساڵانێکە هی خۆتە.'
      },
      description: {
        en: 'Safeen is the mountain that shelters Shaqlawa, and the loafer that carries its name is built like a true moccasin — the apron sewn by hand, the strap cut with its classic slot. Unstructured and light, it shapes itself to your foot within days and holds that shape season after season.',
        ckb: 'سەفین ئەو چیایەیە کە باوەشی بە شەقڵاوەدا کردووە، و ئەم لۆفەرەی ناوی ئەوی هەڵگرتووە وەک مۆکەسینێکی ڕاستەقینە دروست دەکرێت: پارچەی سەرەوەی بە دەست دەدوورێت و قایشەکەی بە کەلێنە کلاسیکییەکەیەوە دەبڕدرێت. سووک و نەرمە، لە چەند ڕۆژێکدا لەگەڵ شێوەی پێت ڕادێت و وەرز لە دوای وەرز ئەو شێوەیە دەپارێزێت.'
      },
      details: {
        en: [
          'Glazed calf upper with a hand-sewn moccasin apron',
          'Leather lining and a padded leather footbed',
          'Blake-stitched leather sole for a close, flexible tread',
          'Penny strap with a hand-cut slot',
          'Handcrafted'
        ],
        ckb: [
          'ڕووی چەرمی گوێرەکەی بریقەدار، بە پارچەی سەرەوەی مۆکەسینیی بە دەست دوورراو',
          'ناوپۆشی چەرم و ناوبنی چەرمی نەرمکراو',
          'بنی چەرمی تەنک و نەرم، ڕاستەوخۆ دوورراو',
          'قایشی پێنی بە کەلێنێکی بە دەست بڕاو',
          'دەستکرد'
        ]
      },
      care: {
        en: 'Keep them on shoe trees so the aprons hold their shape. A thin coat of cream every few weeks keeps the glaze deep and the creases soft.',
        ckb: 'قاڵبی پێڵاویان تێ بکە تا پارچەی سەرەوەیان شێوەی خۆی بپارێزێت. هەر چەند هەفتەیەک جارێک چینێکی تەنکی کرێم بریقەکەیان قووڵ و چرچەکانیان نەرم دەهێڵێتەوە.'
      },
      related: ['shaqlawa-tassel-loafer', 'dukan-weekender', 'zab-card-holder', 'dijla-belt']
    },
    {
      id: 'shaqlawa-tassel-loafer',
      category: 'men',
      type: 'tassel-loafer',
      typeName: { en: 'Tassel loafer', ckb: 'لۆفەری گوڵینگدار' },
      name: { en: 'Shaqlawa Tassel Loafer', ckb: 'لۆفەری گوڵینگداری شەقڵاوە' },
      price: 295,
      colors: leather('oxblood', 'chestnut', 'noir'),
      sizes: [39, 40, 41, 42, 43, 44, 45, 46],
      soldOut: [39],
      images: ['assets/img/products/shaqlawa-tassel-loafer-1.jpg', 'assets/img/products/shaqlawa-tassel-loafer-2.jpg'],
      isNew: false,
      featured: false,
      badge: null,
      personalisable: false,
      short: {
        en: 'A polished tassel loafer with the ease of a summer evening.',
        ckb: 'لۆفەرێکی بریقەداری گوڵینگدار، بە ئاسوودەیی ئێوارەیەکی هاوین.'
      },
      description: {
        en: 'Shaqlawa is a town of orchards and long summer evenings, and this loafer keeps the same unhurried pace. Polished calf, a hand-sewn apron and a slender knotted tassel that moves as you walk. Smart enough for a wedding, easy enough for the drive home after it.',
        ckb: 'شەقڵاوە شاری باخ و ئێوارە درێژەکانی هاوینە، و ئەم لۆفەرەش هەمان هەنگاوی ئارام و بێپەلەی هەیە. چەرمی گوێرەکەی بریقەدار، پارچەیەکی سەرەوەی بە دەست دوورراو، و گوڵینگێکی باریکی گرێدراو کە لەگەڵ هەر هەنگاوێکدا دەجووڵێت. ئەوەندە ڕێکوپێکە کە بۆ ئاهەنگی بووک و زاوا بشێت، و ئەوەندەش ئاسوودەیە بۆ گەڕانەوە بۆ ماڵ دوای ئاهەنگەکە.'
      },
      details: {
        en: [
          'Polished calf upper with a hand-sewn apron',
          'Slender hand-knotted leather tassel',
          'Full leather lining',
          'Blake-stitched leather sole, stacked leather heel',
          'Handcrafted'
        ],
        ckb: [
          'ڕووی چەرمی گوێرەکەی بریقەدار، بە پارچەی سەرەوەی بە دەست دوورراو',
          'گوڵینگێکی باریکی چەرمی بە دەست گرێدراو',
          'ناوپۆشی تەواو لە چەرم',
          'بنی چەرمی ڕاستەوخۆ دوورراو، پاژنەی چین چین لە چەرم',
          'دەستکرد'
        ]
      },
      care: {
        en: 'After wearing, smooth the tassel with your fingers and set the shoes on trees. A matching cream, then a little wax, brings the shine back.',
        ckb: 'دوای لەپێکردن، بە پەنجە گوڵینگەکە ڕێک بخەرەوە و قاڵبی پێڵاویان تێ بکە. کرێمێکی هاوڕەنگ و پاشان کەمێک مۆم، بریقەکەیان دەگەڕێنێتەوە.'
      },
      related: ['safeen-penny-loafer', 'dijla-belt', 'slemani-bifold', 'dukan-weekender']
    },
    {
      id: 'zagros-chelsea-boot',
      category: 'men',
      type: 'chelsea-boot',
      typeName: { en: 'Chelsea boot', ckb: 'پۆتینی چێلسی' },
      name: { en: 'Zagros Chelsea Boot', ckb: 'پۆتینی زاگرۆس' },
      price: 365,
      colors: leather('chestnut', 'noir', 'sand'),
      sizes: [39, 40, 41, 42, 43, 44, 45, 46],
      soldOut: [],
      images: ['assets/img/products/zagros-chelsea-boot-1.jpg', 'assets/img/products/zagros-chelsea-boot-2.jpg'],
      isNew: true,
      featured: true,
      badge: null,
      personalisable: false,
      short: {
        en: 'A Chelsea boot with the stillness of the high mountains.',
        ckb: 'پۆتینێکی چێلسی، بە ئارامی و چەسپاویی چیا بەرزەکان.'
      },
      description: {
        en: 'The Zagros is a Chelsea boot drawn in one sweep: no seam across the vamp, elastic gussets set low, a leather pull tab at the heel. It rises just above the ankle and slips under a trouser hem without a ripple.',
        ckb: 'زاگرۆس پۆتینێکی چێلسییە کە بە یەک هێڵ کێشراوە: هیچ دوورینێک بە سەر پشتی پێدا نییە، لاستیکی لاتەنیشتەکانی نزم دانراون، و دەسکێکی چەرمی بۆ ڕاکێشان لە پاژنەدایە. کەمێک لە سەرووی قولەپێوە بەرز دەبێتەوە و بێ هیچ چرچێک دەچێتە ژێر لێواری پانتۆڵەوە.'
      },
      details: {
        en: [
          'Whole-cut calf upper; Sand is cut in suede',
          'Low-set elastic gussets and a leather pull tab',
          'Leather lining throughout',
          'Welt-stitched leather sole with a rubber heel',
          'Shaft height 15 cm',
          'Handcrafted'
        ],
        ckb: [
          'ڕووی یەکپارچەی چەرمی گوێرەکە؛ ڕەنگی لمی لە چەرمی مەخمەڵییە',
          'لاستیکی لاتەنیشتی نزم و دەسکی چەرمی بۆ ڕاکێشان',
          'ناوپۆشی تەواو لە چەرم',
          'بنی چەرمی دوورراو بە پاژنەی لاستیکی',
          'بەرزی پۆتینەکە: ١٥ سم',
          'دەستکرد'
        ]
      },
      care: {
        en: 'Keep polish off the elastic and wipe it with a damp cloth. Cream the calf regularly; revive suede with a crepe brush and a protective spray.',
        ckb: 'بۆیاخ لە لاستیکەکان دوور بخەرەوە و بە پەڕۆیەکی شێدار پاکیان بکەرەوە. بە بەردەوامی کرێم لە چەرمی گوێرەکە بدە؛ چەرمی مەخمەڵیش بە فڵچەی تایبەت و سپرەیەکی پارێزەر زیندوو بکەرەوە.'
      },
      related: ['rawanduz-lace-boot', 'dukan-weekender', 'penjwen-passport-cover', 'dijla-belt']
    },
    {
      id: 'korek-double-monk',
      category: 'men',
      type: 'double-monk',
      typeName: { en: 'Double monk strap', ckb: 'مۆنکی دووقایش' },
      name: { en: 'Korek Double Monk', ckb: 'مۆنکی کۆڕەک' },
      price: 345,
      colors: leather('chestnut', 'noir', 'midnight'),
      sizes: [39, 40, 41, 42, 43, 44, 45, 46],
      soldOut: [45, 46],
      images: ['assets/img/products/korek-double-monk-1.jpg', 'assets/img/products/korek-double-monk-2.jpg'],
      isNew: false,
      featured: false,
      badge: 'limited',
      personalisable: false,
      short: {
        en: 'Two buckles, one clean line: the monk strap made architectural.',
        ckb: 'دوو توکە و یەک هێڵی پاک؛ پێڵاوی مۆنک بە ڕۆحێکی تەلارسازانە.'
      },
      description: {
        en: 'Two straps cross the instep where laces would be, each closed by a solid buckle in polished nickel. The Korek takes its bearing from the mountain above Rawanduz: broad shoulders, a sharp profile, nothing extra. Made in a limited run.',
        ckb: 'لە جیاتی قەیتان، دوو قایش بە سەر پشتی پێدا تێدەپەڕن و هەر یەکەیان بە توکەیەکی کانزایی پتەو و بریقەدار دادەخرێت. کۆڕەک هەیبەتی خۆی لەو چیایەوە وەرگرتووە کە بەسەر ڕەواندزدا دەڕوانێت: شانی پان، سیمای تیژ، و هیچ شتێکی زیادە. تەنها بە ژمارەیەکی سنووردار دروست دەکرێت.'
      },
      details: {
        en: [
          'Smooth calf upper with a stitched toe cap',
          'Twin straps with solid buckles in polished nickel',
          'Calf lining and a firm leather heel counter',
          'Welt-stitched leather sole with a closed channel',
          'Handcrafted in a limited run'
        ],
        ckb: [
          'ڕووی چەرمی گوێرەکەی لووس، بە سەرەپەنجەی دوورراو',
          'دوو قایش بە دوو توکەی کانزایی پتەو و بریقەدار',
          'ناوپۆشی چەرمی گوێرەکە و پشتپاژنەی چەرمی ڕەق',
          'بنی چەرمی دوورراو، کە دوورینەکەی لە ناو بنەکەدا شاراوەیە',
          'دەستکرد، بە ژمارەی سنووردار'
        ]
      },
      care: {
        en: 'Fasten and release the buckles gently so the straps keep their curve. The metal needs only a chamois — never cream.',
        ckb: 'توکەکان بە نەرمی دابخە و بکەرەوە تا قایشەکان چەماوەیی خۆیان بپارێزن. بۆ کانزاکە تەنها پەڕۆیەکی نەرم بەسە؛ هەرگیز کرێمی لێ مەدە.'
      },
      related: ['azmar-oxford', 'hawler-briefcase', 'dijla-belt', 'slemani-bifold']
    },
    {
      id: 'amedi-wingtip-brogue',
      category: 'men',
      type: 'wingtip-brogue',
      typeName: { en: 'Wingtip brogue', ckb: 'برۆگی باڵدار' },
      name: { en: 'Amedi Wingtip', ckb: 'برۆگی ئامێدی' },
      price: 335,
      colors: leather('cognac', 'tan', 'oxblood'),
      sizes: [39, 40, 41, 42, 43, 44, 45, 46],
      soldOut: [],
      images: ['assets/img/products/amedi-wingtip-brogue-1.jpg', 'assets/img/products/amedi-wingtip-brogue-2.jpg'],
      isNew: false,
      featured: false,
      badge: null,
      personalisable: false,
      short: {
        en: 'A full brogue with every perforation punched by hand.',
        ckb: 'برۆگێکی تەواو، کە هەموو کونە وردەکانی بە دەست کون کراون.'
      },
      description: {
        en: 'Amedi sits on a crown of rock above its valley, a town shaped by old and careful patterns. The wingtip that bears its name follows the same discipline: each perforation punched by hand, the wing swept back to the heel, the medallion set by eye. Wear it in tan through summer and in oxblood once the evenings cool.',
        ckb: 'ئامێدی وەک تاجێکی بەردین لەسەر دۆڵەکەی وەستاوە، شارۆچکەیەک کە نەخش و نیگاری کۆن و ورد شێوەیان پێداوە. ئەم برۆگەی ناوی ئەوی هەڵگرتووە هەمان وردبینی هەیە: هەر کونێکی بە دەست کراوە، باڵەکەی تا پاژنە دەکشێت، و نەخشی سەرەپەنجەکەی بە چاو ڕێکخراوە. هاوینان بە ڕەنگی هەنگوینی لەپێی بکە، و کە ئێواران فێنک بوونەوە بە هەناری تۆخ.'
      },
      details: {
        en: [
          'Full-grain calf upper with hand-punched broguing',
          'Full wingtip with a medallion toe',
          'Leather lining and a cushioned insole',
          'Welt-stitched double leather sole',
          'Handcrafted'
        ],
        ckb: [
          'ڕووی چەرمی گوێرەکەی ڕووتەواو بە کونکاریی دەستی',
          'باڵی تەواو و نەخشێکی گوڵ لە سەرەپەنجەدا',
          'ناوپۆشی چەرم و ناوبنی نەرم',
          'بنی چەرمی دوو چینی دوورراو',
          'دەستکرد'
        ]
      },
      care: {
        en: 'Work cream into the perforations with a small dauber and brush it out before it dries. Store on shoe trees, out of direct sun.',
        ckb: 'بە فڵچەیەکی بچووک کرێم بخەرە ناو کونەکانەوە و پێش ئەوەی وشک ببێتەوە بە فڵچە لێی بکەرەوە. لەسەر قاڵب و دوور لە تیشکی ڕاستەوخۆی خۆر هەڵیبگرە.'
      },
      related: ['goizha-derby', 'azmar-oxford', 'bekhal-backpack', 'dijla-belt']
    },
    {
      id: 'rawanduz-lace-boot',
      category: 'men',
      type: 'lace-up-boot',
      typeName: { en: 'Lace-up boot', ckb: 'پۆتینی قەیتاندار' },
      name: { en: 'Rawanduz Lace Boot', ckb: 'پۆتینی قەیتانداری ڕەواندز' },
      price: 420,
      colors: leather('chestnut', 'noir', 'tan'),
      sizes: [39, 40, 41, 42, 43, 44, 45, 46],
      soldOut: [39],
      images: ['assets/img/products/rawanduz-lace-boot-1.jpg', 'assets/img/products/rawanduz-lace-boot-2.jpg'],
      isNew: false,
      featured: false,
      badge: null,
      personalisable: false,
      short: {
        en: 'A tall lace-up boot, built for the mountain road and made to be resoled.',
        ckb: 'پۆتینێکی بەرزی قەیتاندار، بۆ ڕێگای چیا دروستکراو و شیاوی نوێکردنەوەی بن.'
      },
      description: {
        en: 'Built for the road through the Rawanduz gorge, and for every road after it. Oiled calf, a padded collar and speed hooks for quick lacing sit over a stitched rubber sole that holds on wet stone. Of everything we make it is the heaviest — and it ages the most beautifully.',
        ckb: 'بۆ ڕێگای ناو دەربەندی ڕەواندز دروستکراوە، و بۆ هەموو ئەو ڕێگایانەی دوای ئەویش دێن. چەرمی گوێرەکەی چەورکراو، دەمێکی نەرمکراو و قولاپی خێرا بۆ قەیتانبەستن، هەموویان لەسەر بنێکی لاستیکیی دوورراو دانراون کە لەسەر بەردی تەڕیش ناخلیسکێت. لە هەموو ئەو شتانەی دروستیان دەکەین قورسترینە، و لە هەمووشیان جوانتر بەساڵدا دەچێت.'
      },
      details: {
        en: [
          'Oiled full-grain calf with a toe cap and a padded collar',
          'Nickel eyelets and speed hooks, waxed laces',
          'Full leather lining',
          'Welt-stitched rubber sole, fully resoleable',
          'Shaft height 16 cm',
          'Handcrafted'
        ],
        ckb: [
          'ڕووی چەرمی گوێرەکەی ڕووتەواوی چەورکراو، بە سەرەپەنجەی دوورراو و دەمێکی نەرمکراو',
          'کون و قولاپی کانزایی، قەیتانی مۆمکراو',
          'ناوپۆشی تەواو لە چەرم',
          'بنی لاستیکیی دوورراو، بە تەواوی شیاوی گۆڕین',
          'بەرزی پۆتینەکە: ١٦ سم',
          'دەستکرد'
        ]
      },
      care: {
        en: 'Brush off mud once it has dried and feed the leather with boot wax every season. Stuff wet boots with paper and let them dry slowly, never beside a heater.',
        ckb: 'کاتێک قوڕەکە وشک بوو، بە فڵچە لێی بکەرەوە، و هەموو وەرزێک مۆمی پۆتین لە چەرمەکە بدە. ئەگەر تەڕ بوون، کاغەزیان تێ بئاخنە و با بە هێواشی وشک ببنەوە؛ هەرگیز لە تەنیشت گەرمکەرەوە دایان مەنێ.'
      },
      related: ['zagros-chelsea-boot', 'bekhal-backpack', 'dukan-weekender', 'goizha-derby']
    },
    /* ----- Women ------------------------------------------------------ */
    {
      id: 'nergiz-pump',
      category: 'women',
      type: 'pump',
      typeName: { en: 'Pump', ckb: 'پێڵاوی پاژنەبەرز' },
      name: { en: 'Nergiz Pump', ckb: 'پاژنەبەرزی نێرگز' },
      price: 340,
      colors: leather('sand', 'noir', 'oxblood'),
      sizes: [35, 36, 37, 38, 39, 40, 41],
      soldOut: [41],
      images: ['assets/img/products/nergiz-pump-1.jpg', 'assets/img/products/nergiz-pump-2.jpg'],
      isNew: true,
      featured: true,
      badge: 'new',
      personalisable: false,
      short: {
        en: 'A pointed pump on a slender 100 mm heel, fine as a narcissus stem.',
        ckb: 'پێڵاوێکی سەرتیژ لەسەر پاژنەیەکی باریکی ١٠٠ ملم، ناسک وەک چڵی نێرگز.'
      },
      description: {
        en: 'The narcissus opens on the Kurdish hills while winter is still leaving, and the Nergiz shares its lightness. A low-cut topline, a precise pointed toe and a 100 mm heel balanced for a whole evening — for standing, for dancing, for staying late.',
        ckb: 'نێرگز لەسەر گردەکانی کوردستان دەپشکوێت، لە کاتێکدا زستان هێشتا بە تەواوی نەڕۆیشتووە؛ ئەم پێڵاوەش هەمان سووکی ئەوی هەیە. دەمێکی نزم، سەرەپەنجەیەکی تیژ و ورد، و پاژنەیەکی ١٠٠ ملم کە بۆ ئێوارەیەکی تەواو هاوسەنگ کراوە: بۆ وەستان، بۆ هەڵپەڕکێ، و بۆ مانەوە تا درەنگانی شەو.'
      },
      details: {
        en: [
          'Supple calf upper with a smooth, satin finish',
          '100 mm leather-covered stiletto heel',
          'Leather lining and a padded footbed',
          'Leather sole with a rubber heel tip',
          'Handcrafted'
        ],
        ckb: [
          'ڕووی چەرمی گوێرەکەی نەرم، بە ڕووکارێکی لووس و ئاوریشمین',
          'پاژنەی باریکی ١٠٠ ملم، داپۆشراو بە چەرم',
          'ناوپۆشی چەرم و ناوبنی نەرمکراو',
          'بنی چەرم بە سەرپاژنەی لاستیکی',
          'دەستکرد'
        ]
      },
      care: {
        en: 'Between evenings, rest them in the dust bag with a little tissue in each toe. Have the heel tips replaced as soon as they show wear.',
        ckb: 'لە نێوان ئاهەنگەکاندا لە ناو کیسەی پاراستنەکەیاندا هەڵیانبگرە، و کەمێک کاغەزی نەرم بخەرە سەرەپەنجەی هەر یەکەیانەوە. هەر کە سەرپاژنەکان کۆن بوون، بیانگۆڕە.'
      },
      related: ['sirwan-clutch', 'nali-ballet-flat', 'qalat-crossbody', 'zab-card-holder']
    },
    {
      id: 'shilan-loafer',
      category: 'women',
      type: 'loafer',
      typeName: { en: 'Loafer', ckb: 'لۆفەر' },
      name: { en: 'Shilan Loafer', ckb: 'لۆفەری شیلان' },
      price: 285,
      colors: leather('noir', 'oxblood', 'forest'),
      sizes: [35, 36, 37, 38, 39, 40, 41],
      soldOut: [],
      images: ['assets/img/products/shilan-loafer-1.jpg', 'assets/img/products/shilan-loafer-2.jpg'],
      isNew: false,
      featured: false,
      badge: null,
      personalisable: false,
      short: {
        en: 'A penny loafer on a light, cushioned sole, made for walking the whole city.',
        ckb: 'لۆفەرێکی پێنی لەسەر بنێکی سووک و نەرم، بۆ ئەوەی هەموو شار بە پێ بگەڕێیت.'
      },
      description: {
        en: 'Shilan is the wild rose of the mountain hedgerows — delicate to look at, far tougher than it seems. This loafer is the same: soft calf with a hand-stitched apron and penny strap, on a light rubber sole that takes cobbles, stairs and rain in its stride.',
        ckb: 'شیلان گوڵە کێوییەکەی پەرژینی چیاکانە؛ بە ڕواڵەت ناسکە، بەڵام زۆر لەوە بەهێزترە کە دەردەکەوێت. ئەم لۆفەرەش هەروایە: چەرمی گوێرەکەی نەرم بە پارچەیەکی سەرەوەی بە دەست دوورراو و قایشی پێنی، لەسەر بنێکی لاستیکیی سووک کە بەرد و پەیژە و باران بە ئاسانی تێدەپەڕێنێت.'
      },
      details: {
        en: [
          'Soft calf upper; Oxblood is cut in pebble grain',
          'Hand-stitched apron and penny strap',
          'Leather lining and a cushioned footbed',
          'Lightweight rubber lug sole, 30 mm',
          'Handcrafted'
        ],
        ckb: [
          'ڕووی چەرمی گوێرەکەی نەرم؛ ڕەنگی هەناری تۆخ لە چەرمی دەنکدارە',
          'پارچەی سەرەوەی بە دەست دوورراو و قایشی پێنی',
          'ناوپۆشی چەرم و ناوبنی نەرم',
          'بنی لاستیکیی سووک و دەندانەدار، ٣٠ ملم',
          'دەستکرد'
        ]
      },
      care: {
        en: 'Wipe them clean after wear and nourish with a little colourless cream. Light shoe trees or tissue will hold their shape between wears.',
        ckb: 'دوای لەپێکردن پاکیان بکەرەوە و کەمێک کرێمی بێڕەنگیان لێ بدە. لە نێوان لەپێکردنەکاندا قاڵبێکی سووک یان کاغەزی نەرم شێوەیان دەپارێزێت.'
      },
      related: ['nawroz-tote', 'nali-ballet-flat', 'qalat-crossbody', 'zab-card-holder']
    },
    {
      id: 'hiva-ankle-boot',
      category: 'women',
      type: 'ankle-boot',
      typeName: { en: 'Ankle boot', ckb: 'پۆتینی کورت' },
      name: { en: 'Hiva Ankle Boot', ckb: 'پۆتینی هیڤا' },
      price: 380,
      colors: leather('cognac', 'noir', 'tan'),
      sizes: [35, 36, 37, 38, 39, 40, 41],
      soldOut: [35],
      images: ['assets/img/products/hiva-ankle-boot-1.jpg', 'assets/img/products/hiva-ankle-boot-2.jpg'],
      isNew: true,
      featured: false,
      badge: null,
      personalisable: false,
      short: {
        en: 'An ankle boot on a 55 mm block heel, made for long city days.',
        ckb: 'پۆتینێکی کورت لەسەر پاژنەیەکی پانی ٥٥ ملم، بۆ ڕۆژە درێژەکانی شار.'
      },
      description: {
        en: 'Hiva means hope, and this is the boot for the days that ask the most of you. A side zip, a sculpted 55 mm block heel and a shaft cut to sit neatly under a hem or over a slim trouser. Comfortable on the first morning, better by the hundredth.',
        ckb: 'هیڤا واتە هیوا، و ئەمە ئەو پۆتینەیە کە بۆ ئەو ڕۆژانە دروستکراوە کە زۆرترین شتت لێ دەخوازن. زنجیرەیەکی لاتەنیشت، پاژنەیەکی پانی ٥٥ ملمی بە وردی تاشراو، و قەدێک کە بە ڕێکی دەچێتە ژێر لێواری جلەکەتەوە یان لەسەر پانتۆڵێکی تەسک دادەنیشێت. لە یەکەم بەیانییەوە ئاسوودەیە، و تا سەدەمین ڕۆژ باشتر دەبێت.'
      },
      details: {
        en: [
          'Smooth calf upper; Tan is cut in suede',
          'Side zip with a leather pull',
          '55 mm stacked leather block heel',
          'Leather lining; leather sole with rubber grip inserts',
          'Shaft height 14 cm',
          'Handcrafted'
        ],
        ckb: [
          'ڕووی چەرمی گوێرەکەی لووس؛ ڕەنگی هەنگوینی لە چەرمی مەخمەڵییە',
          'زنجیرەی لاتەنیشت بە دەسکێکی چەرم',
          'پاژنەی پانی چین چین لە چەرم، ٥٥ ملم',
          'ناوپۆشی چەرم؛ بنی چەرم بە پارچەی لاستیکی دژەخلیسکان',
          'بەرزی پۆتینەکە: ١٤ سم',
          'دەستکرد'
        ]
      },
      care: {
        en: 'Close the zips before storing so the shafts stand upright. Condition the calf monthly; brush suede gently and protect it before the rains.',
        ckb: 'پێش هەڵگرتن زنجیرەکانیان دابخە تا قەدەکانیان ڕاست بمێننەوە. مانگانە کرێم لە چەرمی گوێرەکە بدە؛ چەرمی مەخمەڵیش بە هێواشی فڵچە بکە و پێش وەرزی باران بیپارێزە.'
      },
      related: ['qalat-crossbody', 'nawroz-tote', 'nergiz-pump', 'penjwen-passport-cover']
    },
    {
      id: 'nali-ballet-flat',
      category: 'women',
      type: 'ballet-flat',
      typeName: { en: 'Ballet flat', ckb: 'باڵێرینا' },
      name: { en: 'Nali Ballerina', ckb: 'باڵێرینای نالی' },
      price: 240,
      colors: leather('sand', 'noir', 'oxblood'),
      sizes: [35, 36, 37, 38, 39, 40, 41],
      soldOut: [],
      images: ['assets/img/products/nali-ballet-flat-1.jpg', 'assets/img/products/nali-ballet-flat-2.jpg'],
      isNew: false,
      featured: false,
      badge: null,
      personalisable: false,
      short: {
        en: 'A pointed suede ballerina with a poet’s restraint.',
        ckb: 'باڵێرینایەکی سەرتیژی چەرمی مەخمەڵی، بە ساکاریی شیعرێکی جوان.'
      },
      description: {
        en: 'Nali, the poet, wrote of love in few and perfect words; this ballerina says a great deal with very little. Suede as soft as a glove, a pointed toe and sides cut low and open, on a sole so supple it folds in the palm of your hand.',
        ckb: 'نالیی شاعیر بە کەمترین و جوانترین وشە باسی خۆشەویستی دەکرد؛ ئەم باڵێرینایەش بە کەمترین شت زۆرترین دەڵێت. چەرمی مەخمەڵیی نەرم وەک دەستکێش، سەرەپەنجەیەکی تیژ و لاتەنیشتی نزم و کراوە، لەسەر بنێک هێندە نەرم کە لە ناو لەپی دەستدا دەچەمێتەوە.'
      },
      details: {
        en: [
          'Soft suede in Sand; nappa leather in Noir and Oxblood',
          'Pointed toe with open, d’Orsay-cut sides',
          'Leather lining and a padded footbed',
          'Flexible leather sole with a 10 mm heel',
          'Handcrafted'
        ],
        ckb: [
          'چەرمی مەخمەڵیی نەرم بە ڕەنگی لمی؛ چەرمی ناپا بە ڕەنگی ڕەش و هەناری تۆخ',
          'سەرەپەنجەی تیژ و لاتەنیشتی کراوە',
          'ناوپۆشی چەرم و ناوبنی نەرمکراو',
          'بنی چەرمی نەرم بە پاژنەی ١٠ ملم',
          'دەستکرد'
        ]
      },
      care: {
        en: 'Keep them flat in their dust bag. A soft suede brush revives the nap, and a suede eraser lifts most marks.',
        ckb: 'بە پانی لە ناو کیسەی پاراستنەکەیاندا دایانبنێ. فڵچەیەکی نەرمی تایبەت مووی چەرمەکە زیندوو دەکاتەوە، و لاستیکی تایبەتی چەرمی مەخمەڵی زۆربەی پەڵەکان لادەبات.'
      },
      related: ['shilan-loafer', 'sirwan-clutch', 'nawroz-tote', 'zab-card-holder']
    },
    /* ----- Bags ------------------------------------------------------- */
    {
      id: 'nawroz-tote',
      category: 'bags',
      type: 'tote',
      typeName: { en: 'Tote', ckb: 'جانتای تۆت' },
      name: { en: 'Nawroz Tote', ckb: 'جانتای نەورۆز' },
      price: 520,
      colors: leather('cognac', 'forest', 'noir', 'sand'),
      sizes: [],
      soldOut: [],
      images: ['assets/img/products/nawroz-tote-1.jpg', 'assets/img/products/nawroz-tote-2.jpg'],
      isNew: true,
      featured: true,
      badge: 'new',
      personalisable: true,
      short: {
        en: 'A tote with nothing to prove — just leather, patience and a perfect fold.',
        ckb: 'جانتایەک کە پێویستی بە خۆنواندن نییە؛ تەنها چەرم، پشوودرێژی و نووشتانەوەیەکی بێ کەموکوڕی.'
      },
      description: {
        en: 'Cut from broad panels of vegetable-tanned leather, the Nawroz opens like a new year: wide, light and full of room. Its handles are folded and stitched rather than glued, and its edges are painted by hand, one thin coat after another. It deepens in colour with every season you carry it.',
        ckb: 'نەورۆز لە پارچە پانەکانی چەرمی خۆشکراو بە ڕووەک دەبڕدرێت و وەک ساڵێکی نوێ دەکرێتەوە: فراوان، سووک و پڕ لە جێگە. دەسکەکانی دەنووشتێنرێنەوە و دەدوورێن، نەک بە چەسپ بلکێنرێن، و لێوارەکانی بە دەست، چین لە دوای چین، ڕەنگ دەکرێن. هەر وەرزێک لەگەڵت بێت، ڕەنگەکەی قووڵتر دەبێتەوە.'
      },
      details: {
        en: [
          'Vegetable-tanned full-grain leather',
          'Unlined interior with a detachable zip pouch',
          'Folded and stitched handles, 24 cm drop',
          'Hand-painted edges; brass feet on the base',
          '38 × 30 × 15 cm',
          'Handcrafted'
        ],
        ckb: [
          'چەرمی ڕووتەواوی خۆشکراو بە ڕووەک',
          'ناوەوەی بێ ناوپۆش، لەگەڵ کیسەیەکی زنجیرەداری جیاکراوە',
          'دەسکی نووشتێنراو و دوورراو، بە بەرزی ٢٤ سم',
          'لێواری بە دەست ڕەنگکراو؛ پێیەی مسی زەرد لە بنەوە',
          '٣٨ × ٣٠ × ١٥ سم',
          'دەستکرد'
        ]
      },
      care: {
        en: 'Vegetable-tanned leather darkens with light and touch — that is the point. Keep it dry and condition it twice a year with a natural balm.',
        ckb: 'چەرمی خۆشکراو بە ڕووەک بە ڕووناکی و دەستلێدان تۆختر دەبێت، و جوانییەکەی لەوەدایە. وشکی ڕابگرە و ساڵی دوو جار مەڵهەمێکی سروشتی لێ بدە.'
      },
      related: ['shilan-loafer', 'slemani-bifold', 'zab-card-holder', 'hiva-ankle-boot']
    },
    {
      id: 'qalat-crossbody',
      category: 'bags',
      type: 'crossbody',
      typeName: { en: 'Crossbody', ckb: 'جانتای سەرشان' },
      name: { en: 'Qalat Crossbody', ckb: 'جانتای سەرشانی قەڵات' },
      price: 390,
      colors: leather('sand', 'cognac', 'noir'),
      sizes: [],
      soldOut: [],
      images: ['assets/img/products/qalat-crossbody-1.jpg', 'assets/img/products/qalat-crossbody-2.jpg'],
      isNew: false,
      featured: false,
      badge: null,
      personalisable: true,
      short: {
        en: 'A rounded crossbody, as compact and complete as the citadel of Erbil.',
        ckb: 'جانتایەکی سەرشانی خڕ، هێندەی قەڵای هەولێر پتەو و تەواو.'
      },
      description: {
        en: 'The citadel at the heart of Erbil rises round and whole above the city — the Qalat borrows that silhouette. Soft full-grain leather is drawn into one compact curve, closed by a single zip and carried on a long strap that sits at the shoulder or across the body.',
        ckb: 'قەڵاکەی ناو دڵی هەولێر خڕ و تەواو بەسەر شارەکەدا بەرز بووەتەوە، و قەڵات شێوەکەی لەوەوە وەرگرتووە. چەرمی ڕووتەواوی نەرم لە یەک چەماوەی بچووکدا کێشراوە، بە یەک زنجیرە دادەخرێت و بە بەندێکی درێژ هەڵدەگیرێت، کە دەتوانیت لەسەر شان یان بە لاری بە سەر لەشتدا هەڵیبواسیت.'
      },
      details: {
        en: [
          'Soft full-grain leather',
          'Top zip with a leather pull',
          'Cotton-lined interior with one slip pocket',
          'Adjustable leather strap, 105–125 cm',
          '24 × 14 × 10 cm',
          'Handcrafted'
        ],
        ckb: [
          'چەرمی ڕووتەواوی نەرم',
          'زنجیرەی سەرەوە بە دەسکێکی چەرم',
          'ناوپۆشی لۆکە و گیرفانێکی ناوەوە',
          'بەندی چەرم بە درێژیی گۆڕاو، ١٠٥–١٢٥ سم',
          '٢٤ × ١٤ × ١٠ سم',
          'دەستکرد'
        ]
      },
      care: {
        en: 'When it is resting, stuff it lightly with tissue and slip it into the dust bag. Keep it away from oils and perfume; most marks lift with a soft brush.',
        ckb: 'کاتێک بەکاری ناهێنیت، کەمێک کاغەزی نەرمی تێ بکە و لە کیسەی پاراستنەکەیدا هەڵیبگرە. لە چەوری و بۆنی خۆش دووری بخەرەوە؛ زۆربەی پەڵەکان بە فڵچەیەکی نەرم لادەچن.'
      },
      related: ['hiva-ankle-boot', 'sirwan-clutch', 'zab-card-holder', 'shilan-loafer']
    },
    {
      id: 'hawler-briefcase',
      category: 'bags',
      type: 'briefcase',
      typeName: { en: 'Briefcase', ckb: 'جانتای کار' },
      name: { en: 'Hawler Briefcase', ckb: 'جانتای کاری هەولێر' },
      price: 690,
      colors: leather('chestnut', 'noir', 'midnight'),
      sizes: [],
      soldOut: [],
      images: ['assets/img/products/hawler-briefcase-1.jpg', 'assets/img/products/hawler-briefcase-2.jpg'],
      isNew: false,
      featured: true,
      badge: 'limited',
      personalisable: true,
      short: {
        en: 'A slim briefcase built like an heirloom, for work worth carrying.',
        ckb: 'جانتایەکی کاری باریک کە وەک میراتێکی بنەماڵە دروستکراوە، بۆ ئەو کارانەی شایەنی هەڵگرتنن.'
      },
      description: {
        en: 'Hawler is Erbil’s own Kurdish name, and this is our most architectural piece: a slim, double-gusseted briefcase whose frame holds its line even when full. A padded sleeve takes a 15-inch laptop, and the rest is laid out for papers, pens and the day’s small necessities. Made in small numbers, each one many hours at the bench.',
        ckb: 'هەولێر ناوە کوردییەکەی شارەکەیە، و ئەمە تەلارسازانەترین پارچەی ئێمەیە: جانتایەکی کاری باریک بە دوو بەش، کە چوارچێوەکەی تەنانەت کاتێک پڕیش بێت شێوەی خۆی ون ناکات. شوێنێکی نەرمکراو بۆ لاپتۆپی ١٥ ئینج تێدایە، و ئەوانی تر بۆ کاغەز و پێنووس و پێداویستییە بچووکەکانی ڕۆژ ڕێکخراون. بە ژمارەیەکی کەم دروست دەکرێت، و هەر دانەیەکی چەندین کاتژمێر کاری دەستی دەوێت.'
      },
      details: {
        en: [
          'Structured full-grain calf, finished by hand',
          'Two gussets and a padded 15-inch laptop sleeve',
          'Front flap with twin buckled straps; solid nickel hardware',
          'Detachable, adjustable shoulder strap',
          '40 × 29 × 9 cm',
          'Handcrafted in limited numbers'
        ],
        ckb: [
          'چەرمی گوێرەکەی ڕووتەواوی ڕەق، بە دەست تەواوکراو',
          'دوو بەشی سەرەکی و شوێنێکی نەرمکراو بۆ لاپتۆپی ١٥ ئینج',
          'سەرپۆشی پێشەوە بە دوو قایشی توکەدار؛ پارچە کانزاییە پتەوەکان بە ڕەنگی زیوی',
          'بەندی شانی جیاکراوە بە درێژیی گۆڕاو',
          '٤٠ × ٢٩ × ٩ سم',
          'دەستکرد، بە ژمارەی سنووردار'
        ]
      },
      care: {
        en: 'Empty it and fill it with tissue before storing. Condition the calf two or three times a year and keep the hardware dry.',
        ckb: 'پێش هەڵگرتن بەتاڵی بکەرەوە و کاغەزی نەرمی تێ بکە. ساڵانە دوو بۆ سێ جار کرێم لە چەرمەکەی بدە و پارچە کانزاییەکانی وشک ڕابگرە.'
      },
      related: ['azmar-oxford', 'korek-double-monk', 'slemani-bifold', 'dijla-belt']
    },
    {
      id: 'dukan-weekender',
      category: 'bags',
      type: 'weekender',
      typeName: { en: 'Weekender', ckb: 'جانتای گەشت' },
      name: { en: 'Dukan Weekender', ckb: 'جانتای گەشتی دوکان' },
      price: 640,
      colors: leather('chestnut', 'noir', 'forest'),
      sizes: [],
      soldOut: [],
      images: ['assets/img/products/dukan-weekender-1.jpg', 'assets/img/products/dukan-weekender-2.jpg'],
      isNew: true,
      featured: false,
      badge: null,
      personalisable: true,
      short: {
        en: 'A weekend bag with the calm of a still lake.',
        ckb: 'جانتایەکی گەشتی کۆتایی هەفتە، بە ئارامیی دەریاچەیەکی مەند.'
      },
      description: {
        en: 'Dukan is where the city goes to breathe, and this bag is packed for exactly that. Soft-structured waxed leather, a wide two-way zip that opens it like a doctor’s bag, and rolled handles that sit easily in the hand. It holds the weekend, and the gifts you bring back from it.',
        ckb: 'دوکان ئەو شوێنەیە کە خەڵکی شار بۆ هەناسەدان ڕووی تێدەکەن، و ئەم جانتایە ڕێک بۆ ئەوە ئامادە کراوە. چەرمی مۆمکراوی نەرم بەڵام خۆڕاگر، زنجیرەیەکی پانی دووسەر کە وەک جانتای پزیشک بە تەواوی دەیکاتەوە، و دەسکی لوولکراو کە بە ئاسوودەیی لە دەستدا جێ دەگرن. کۆتایی هەفتەکەت هەڵدەگرێت، لەگەڵ ئەو دیارییانەی لێیەوە دەیهێنیتەوە.'
      },
      details: {
        en: [
          'Waxed full-grain leather',
          'Cotton-twill lining with zip and slip pockets',
          'Rolled handles and a detachable shoulder strap',
          'Two-way brass zip; protective base studs',
          '50 × 28 × 25 cm, cabin size',
          'Handcrafted'
        ],
        ckb: [
          'چەرمی ڕووتەواوی مۆمکراو',
          'ناوپۆشی قوماشی لۆکە، بە گیرفانی زنجیرەدار و گیرفانی کراوە',
          'دەسکی لوولکراو و بەندی شانی جیاکراوە',
          'زنجیرەی مسی زەردی دووسەر؛ پێیەی پارێزەر لە بنەوە',
          '٥٠ × ٢٨ × ٢٥ سم، بە قەبارەی جانتای ناو فڕۆکە',
          'دەستکرد'
        ]
      },
      care: {
        en: 'Pack it, but never to bursting — the leather holds its shape best with a little room. Condition it each season and store it filled with tissue.',
        ckb: 'پڕی بکە، بەڵام لێوانلێوی مەکە؛ چەرمەکە کاتێک کەمێک بۆشایی تێدا بێت شێوەی خۆی باشتر دەپارێزێت. هەموو وەرزێک کرێمی لێ بدە و پڕ لە کاغەزی نەرم هەڵیبگرە.'
      },
      related: ['penjwen-passport-cover', 'zagros-chelsea-boot', 'safeen-penny-loafer', 'bekhal-backpack']
    },
    {
      id: 'sirwan-clutch',
      category: 'bags',
      type: 'mini-bag',
      typeName: { en: 'Mini bag', ckb: 'جانتای بچووک' },
      name: { en: 'Sirwan Mini Bag', ckb: 'جانتای بچووکی سیروان' },
      price: 280,
      colors: leather('forest', 'noir', 'oxblood', 'sand'),
      sizes: [],
      soldOut: [],
      images: ['assets/img/products/sirwan-clutch-1.jpg', 'assets/img/products/sirwan-clutch-2.jpg'],
      isNew: false,
      featured: false,
      badge: null,
      personalisable: true,
      short: {
        en: 'A croc-embossed mini bag, glossy as river water over stone.',
        ckb: 'جانتایەکی بچووک بە نەخشی پێستی تیمساح، بریقەدار وەک ئاوی ڕووبار بە سەر بەرددا.'
      },
      description: {
        en: 'The Sirwan holds the river’s green in a small, structured shape: calf leather embossed with a crocodile grain and glazed to a deep shine. Two rolled top handles, a magnetic closure and a detachable shoulder strap; inside, room for a phone, keys and a lipstick, and nothing more.',
        ckb: 'سیروان سەوزایی ڕووبارەکەی لە شێوەیەکی بچووک و ڕێکدا هەڵگرتووە: چەرمی گوێرەکە کە نەخشی پێستی تیمساحی لێ دراوە و تا بریقەیەکی قووڵ بریقە دراوە. دوو دەسکی لوولکراو، داخەرێکی موگناتیسی و بەندێکی جیاکراوەی شان؛ لە ناوەوەش جێگای مۆبایل و کلیل و سوورئاوێک هەیە، و هیچی تر.'
      },
      details: {
        en: [
          'Croc-embossed calf with a glazed finish',
          'Two rolled top handles; detachable shoulder strap',
          'Magnetic top closure',
          'Suede lining with a card slot',
          '20 × 15 × 9 cm',
          'Handcrafted'
        ],
        ckb: [
          'چەرمی گوێرەکە بە نەخشی پێستی تیمساح و ڕووکارێکی بریقەدار',
          'دوو دەسکی لوولکراو؛ بەندی شانی جیاکراوە',
          'داخەری موگناتیسی لە سەرەوە',
          'ناوپۆشی چەرمی مەخمەڵی و شوێنی کارتێک',
          '٢٠ × ١٥ × ٩ سم',
          'دەستکرد'
        ]
      },
      care: {
        en: 'Between outings, keep its shape with tissue paper, away from light and from anything heavy. Blot spills straight away; never rub.',
        ckb: 'لە نێوان بەکارهێنانەکاندا، کەمێک کاغەزی نەرمی تێ بکە و دوور لە ڕووناکی و لە هەر شتێکی قورس دایبنێ. ئەگەر شتێکی بەسەردا ڕژا، یەکسەر هەڵیبمژە؛ هەرگیز مەیسوو.'
      },
      related: ['nergiz-pump', 'nali-ballet-flat', 'zab-card-holder', 'qalat-crossbody']
    },
    {
      id: 'bekhal-backpack',
      category: 'bags',
      type: 'backpack',
      typeName: { en: 'Backpack', ckb: 'جانتای پشت' },
      name: { en: 'Bekhal Backpack', ckb: 'جانتای پشتی بێخاڵ' },
      price: 560,
      colors: leather('cognac', 'tan', 'noir'),
      sizes: [],
      soldOut: [],
      images: ['assets/img/products/bekhal-backpack-1.jpg', 'assets/img/products/bekhal-backpack-2.jpg'],
      isNew: false,
      featured: false,
      badge: null,
      personalisable: true,
      short: {
        en: 'A leather backpack for the city and the trail, with the energy of falling water.',
        ckb: 'جانتای پشتێکی چەرمی بۆ شار و ڕێگای چیا، بە وزەی ئاوی تاڤگە.'
      },
      description: {
        en: 'Bekhal is a waterfall that never stops moving, and this backpack is made for people who don’t either. A deep top flap and a front pocket, each closed with a buckled strap, and a padded back with a sleeve for a 14-inch laptop. Light enough to forget you are wearing it, strong enough to be carried every day for a very long time.',
        ckb: 'بێخاڵ تاڤگەیەکە هەرگیز لە جووڵە ناوەستێت، و ئەم جانتایەش بۆ ئەو کەسانە دروستکراوە کە ئەوانیش ناوەستن. سەرپۆشێکی قووڵ و گیرفانێکی پێشەوە، کە هەر یەکەیان بە قایشێکی توکەدار دادەخرێت، و پشتێکی نەرمکراو بە شوێنێک بۆ لاپتۆپی ١٤ ئینج. ئەوەندە سووکە لەبیرت دەچێت لە پشتتە، و ئەوەندە بەهێزە کە بۆ ماوەیەکی زۆر درێژ ڕۆژانە هەڵیبگریت.'
      },
      details: {
        en: [
          'Waxed full-grain leather',
          'Buckled top flap and a buckled front pocket',
          'Padded 14-inch laptop sleeve and two inner pockets',
          'Adjustable padded leather straps',
          '30 × 40 × 13 cm',
          'Handcrafted'
        ],
        ckb: [
          'چەرمی ڕووتەواوی مۆمکراو',
          'سەرپۆشی توکەدار و گیرفانێکی پێشەوەی توکەدار',
          'شوێنی نەرمکراو بۆ لاپتۆپی ١٤ ئینج و دوو گیرفانی ناوەوە',
          'بەندی چەرمی نەرمکراو بە درێژیی گۆڕاو',
          '٣٠ × ٤٠ × ١٣ سم',
          'دەستکرد'
        ]
      },
      care: {
        en: 'Loosen the straps and fill the bag lightly when storing so the front stays smooth. Condition it every few months, and more often in the dry heat of summer.',
        ckb: 'کاتی هەڵگرتن بەندەکان شل بکەرەوە و کەمێک پڕی بکە تا ڕووەکەی لووس بمێنێتەوە. هەر چەند مانگێک جارێک کرێمی لێ بدە، و لە گەرمای وشکی هاویندا زیاتر.'
      },
      related: ['rawanduz-lace-boot', 'goizha-derby', 'slemani-bifold', 'penjwen-passport-cover']
    },
    /* ----- Accessories ------------------------------------------------ */
    {
      id: 'dijla-belt',
      category: 'accessories',
      type: 'belt',
      typeName: { en: 'Belt', ckb: 'قایش' },
      name: { en: 'Dijla Belt', ckb: 'قایشی دیجلە' },
      price: 160,
      colors: leather('chestnut', 'noir', 'cognac'),
      sizes: [],
      soldOut: [],
      images: ['assets/img/products/dijla-belt-1.jpg', 'assets/img/products/dijla-belt-2.jpg'],
      isNew: false,
      featured: false,
      badge: null,
      personalisable: true,
      short: {
        en: 'A 3.5 cm belt in waxed bridle leather, closed with a solid, screw-fastened buckle.',
        ckb: 'قایشێکی ٣٫٥ سانتیمی لە چەرمی ئەستووری مۆمکراو، بە توکەیەکی کانزایی پتەو کە بە پێچ دەبەسترێت.'
      },
      description: {
        en: 'The Tigris runs through everything, and this belt goes with everything. Each one is a single long strip of dense, waxed bridle leather, its edges bevelled and burnished by hand, fastened with a solid metal buckle that will outlast the trousers it holds up.',
        ckb: 'دیجلە بە ناو هەموو شتێکدا تێدەپەڕێت، و ئەم قایشەش لەگەڵ هەموو شتێکدا دەگونجێت. لە یەک پارچە چەرمی چڕ و مۆمکراو دەبڕدرێت، لێوارەکانی بە دەست دەتاشرێن و بریقە دەدرێن، و بە توکەیەکی کانزایی پتەو دادەخرێت کە لە پانتۆڵەکانت زیاتر تەمەن دەکات.'
      },
      details: {
        en: [
          'Waxed bridle leather, full thickness',
          'Hand-bevelled, burnished edges',
          'Solid metal buckle, screw-fastened and replaceable',
          'Width 3.5 cm; supplied at 120 cm and trimmed to fit',
          'Handcrafted'
        ],
        ckb: [
          'چەرمی ئەستووری مۆمکراو، بە تەواوی ئەستوورییەکەی خۆی',
          'لێواری بە دەست تاشراو و بریقەدراو',
          'توکەی کانزایی پتەو، بە پێچ دەبەسترێت و دەگۆڕدرێت',
          'پانی ٣٫٥ سم؛ بە درێژی ١٢٠ سم دێت و بە پێی قەدی تۆ کورت دەکرێتەوە',
          'دەستکرد'
        ]
      },
      care: {
        en: 'New bridle leather can show a faint white bloom; buff it away with a soft cloth. Hang the belt or roll it loosely — never fold it.',
        ckb: 'لەوانەیە لەسەر چەرمی نوێ تۆزێکی سپیی کاڵ دەربکەوێت؛ بە پەڕۆیەکی نەرم بیسڕەوە. قایشەکە هەڵبواسە یان بە شلی لوولی بکە؛ هەرگیز مەینووشتێنەوە.'
      },
      related: ['azmar-oxford', 'korek-double-monk', 'slemani-bifold', 'hawler-briefcase']
    },
    {
      id: 'slemani-bifold',
      category: 'accessories',
      type: 'bifold',
      typeName: { en: 'Bifold wallet', ckb: 'جزدانی دووقات' },
      name: { en: 'Slemani Bifold', ckb: 'جزدانی سلێمانی' },
      price: 145,
      colors: leather('cognac', 'chestnut', 'noir', 'forest'),
      sizes: [],
      soldOut: [],
      images: ['assets/img/products/slemani-bifold-1.jpg', 'assets/img/products/slemani-bifold-2.jpg'],
      isNew: false,
      featured: true,
      badge: null,
      personalisable: true,
      short: {
        en: 'A slim bifold for eight cards and folded notes, finished edge to edge by hand.',
        ckb: 'جزدانێکی دووقاتی باریک بۆ هەشت کارت و پارەی کاغەز، لێوار بە لێوار بە دەست تەواوکراو.'
      },
      description: {
        en: 'Sulaymaniyah is a city of poets, booksellers and long conversations; this wallet is made in the same unhurried spirit. Eight card slots, two note compartments and a profile slim enough to vanish into a jacket pocket. The edges are painted, sanded and painted again until they shine.',
        ckb: 'سلێمانی شاری شاعیران و کتێبفرۆشان و گفتوگۆ درێژەکانە؛ ئەم جزدانەش بە هەمان ڕۆحی ئارام و بێپەلە دروستکراوە. هەشت شوێنی کارت، دوو بەشی پارە، و ئەوەندە باریکە کە لە گیرفانی چاکەتدا ون دەبێت. لێوارەکانی ڕەنگ دەکرێن، بە سمبادە لووس دەکرێن و دیسان ڕەنگ دەکرێنەوە، تا دەدرەوشێنەوە.'
      },
      details: {
        en: [
          'Waxed pull-up leather that lightens where it folds',
          'Eight card slots, two note compartments',
          'Saddle-stitched, with hand-painted edges',
          '11 × 9 cm closed',
          'Handcrafted'
        ],
        ckb: [
          'چەرمی مۆمکراو کە لە شوێنی نووشتانەوەکانیدا کاڵتر دەبێتەوە',
          'هەشت شوێنی کارت، دوو بەشی پارە',
          'بە دوو دەرزی و بە دەست دوورراو، لێوارەکانی بە دەست ڕەنگکراون',
          '١١ × ٩ سم کاتێک داخراوە',
          'دەستکرد'
        ]
      },
      care: {
        en: 'Resist overfilling it — a wallet keeps its shape by holding only what it should. Wipe with a dry cloth and condition once or twice a year.',
        ckb: 'زیاد لە پێویست شتی تێ مەئاخنە؛ جزدان کاتێک تەنها ئەوەی تێدا بێت کە پێویستە، شێوەی خۆی دەپارێزێت. بە پەڕۆیەکی وشک پاکی بکەرەوە و ساڵی یەک یان دوو جار کرێمی لێ بدە.'
      },
      related: ['zab-card-holder', 'dijla-belt', 'hawler-briefcase', 'penjwen-passport-cover']
    },
    {
      id: 'zab-card-holder',
      category: 'accessories',
      type: 'card-holder',
      typeName: { en: 'Card holder', ckb: 'جێکارت' },
      name: { en: 'Zab Card Holder', ckb: 'جێکارتی زێ' },
      price: 65,
      colors: leather('oxblood', 'tan', 'forest', 'noir'),
      sizes: [],
      soldOut: [],
      images: ['assets/img/products/zab-card-holder-1.jpg', 'assets/img/products/zab-card-holder-2.jpg'],
      isNew: false,
      featured: false,
      badge: null,
      personalisable: true,
      short: {
        en: 'Four cards, one centre pocket, nothing more.',
        ckb: 'چوار کارت، گیرفانێکی ناوەڕاست، و هیچی تر.'
      },
      description: {
        en: 'The Zab is the smallest thing we make and one of the hardest, because at this size every stitch shows. Four card slots and a centre pocket for folded notes, saddle-stitched by hand with waxed linen thread.',
        ckb: 'زێ بچووکترین شتێکە کە دروستی دەکەین و یەکێکە لە سەختترینەکانیش، چونکە لەم قەبارەیەدا هەموو دوورینێک دیارە. چوار شوێنی کارت و گیرفانێکی ناوەڕاست بۆ پارەی نووشتێنراو، بە دەست و بە دوو دەرزی بە دەزووی کەتانی مۆمکراو دوورراوە.'
      },
      details: {
        en: [
          'Full-grain calf, saddle-stitched with waxed linen',
          'Four card slots and a centre pocket',
          'Hand-painted edges',
          '10 × 7.5 cm',
          'Handcrafted'
        ],
        ckb: [
          'چەرمی گوێرەکەی ڕووتەواو، بە دەزووی کەتانی مۆمکراو دوورراو',
          'چوار شوێنی کارت و گیرفانێکی ناوەڕاست',
          'لێواری بە دەست ڕەنگکراو',
          '١٠ × ٧٫٥ سم',
          'دەستکرد'
        ]
      },
      care: {
        en: 'Carry it in a front pocket rather than a back one. A dry cloth is all it needs, with a little balm once a year to keep it supple.',
        ckb: 'لە گیرفانی پێشەوەدا هەڵیبگرە، نەک گیرفانی دواوە. تەنها پەڕۆیەکی وشکی پێویستە، و ساڵی جارێک کەمێک مەڵهەم نەرمی دەهێڵێتەوە.'
      },
      related: ['slemani-bifold', 'penjwen-passport-cover', 'nawroz-tote', 'sirwan-clutch']
    },
    {
      id: 'penjwen-passport-cover',
      category: 'accessories',
      type: 'passport-cover',
      typeName: { en: 'Passport cover', ckb: 'بەرگی پاسپۆرت' },
      name: { en: 'Penjwen Passport Cover', ckb: 'بەرگی پاسپۆرتی پێنجوێن' },
      price: 115,
      colors: leather('noir', 'cognac', 'forest'),
      sizes: [],
      soldOut: [],
      images: ['assets/img/products/penjwen-passport-cover-1.jpg', 'assets/img/products/penjwen-passport-cover-2.jpg'],
      isNew: true,
      featured: false,
      badge: null,
      personalisable: true,
      short: {
        en: 'A passport cover for journeys that begin at the border.',
        ckb: 'بەرگێکی پاسپۆرت بۆ ئەو گەشتانەی لە سنوورەوە دەست پێدەکەن.'
      },
      description: {
        en: 'Penjwen is a town at the edge of the map, where the road climbs into the mountains and on across the border — a fitting name for the piece that travels with you. It holds a passport, two cards and a folded boarding pass, and its leather gathers character trip by trip.',
        ckb: 'پێنجوێن شارۆچکەیەکە لە لێواری نەخشەدا، لەوێ ڕێگا بەرەو چیاکان و ئەودیوی سنوور هەڵدەکشێت؛ ناوێکی شیاوە بۆ ئەو پارچەیەی لەگەڵت گەشت دەکات. پاسپۆرتێک، دوو کارت و کارتی سواربوونی فڕۆکە دەگرێت، و چەرمەکەی گەشت بە گەشت جوانتر و پڕ لە یادگاری دەبێت.'
      },
      details: {
        en: [
          'Pebble-grain full-grain leather',
          'Holds a passport, two cards and a boarding pass',
          'Saddle-stitched by hand in a contrasting red thread',
          '14 × 10 cm closed',
          'Handcrafted'
        ],
        ckb: [
          'چەرمی ڕووتەواوی دەنکدار',
          'پاسپۆرتێک، دوو کارت و کارتی سواربوون دەگرێت',
          'بە دوو دەرزی و بە دەست، بە دەزوویەکی سووری جیاواز دوورراوە',
          '١٤ × ١٠ سم کاتێک داخراوە',
          'دەستکرد'
        ]
      },
      care: {
        en: 'The pebbled grain hides the knocks of travel, and water is its only real enemy. Give it a little balm whenever the leather looks thirsty.',
        ckb: 'دەنکەکانی ڕووی چەرمەکە شوێنەواری گەشت دەشارنەوە، و تاکە دوژمنی ڕاستەقینەی ئاوە. هەر کاتێک چەرمەکە تینوو دیار بوو، کەمێک مەڵهەمی لێ بدە.'
      },
      related: ['dukan-weekender', 'slemani-bifold', 'zab-card-holder', 'zagros-chelsea-boot']
    }
  ];

  /* ---------------------------------------------------------------------------
     5. Boutiques — addresses and phone numbers are PLACEHOLDERS;
        lat/lng are the real city centres (used by the dotted map).
        mapsUrl: "Get directions" link · embedUrl: keyless Google Maps embed
     ------------------------------------------------------------------------ */
  w.BENM_STORES = [
    {
      id: 'erbil',
      city: { en: 'Erbil', ckb: 'هەولێر' },
      name: { en: 'Ben.M Erbil', ckb: 'Ben.M هەولێر' },
      description: {
        en: 'Our house in the capital — leather, brass and lamplight.',
        ckb: 'ماڵی ئێمە لە پایتەخت؛ چەرم، مس و ڕووناکیی چرا.'
      },
      address: {                                      // PLACEHOLDER
        en: 'Gulan Street, Building 12, Ground Floor, Erbil',
        ckb: 'شەقامی گوڵان، باڵەخانەی ١٢، نهۆمی زەوی، هەولێر'
      },
      hours: {
        en: 'Sat–Thu 10:00–22:00 · Fri 14:00–22:00',
        ckb: 'شەممە تا پێنجشەممە ١٠:٠٠–٢٢:٠٠، هەینی ١٤:٠٠–٢٢:٠٠'
      },
      phone: '+964 750 000 0001',                     // PLACEHOLDER
      lat: 36.1911,
      lng: 44.0092,
      image: 'assets/img/stores/erbil.jpg',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Erbil%2C%20Iraq',
      embedUrl: 'https://maps.google.com/maps?q=Erbil%2C%20Iraq&z=13&output=embed'
    },
    {
      id: 'sulaymaniyah',
      city: { en: 'Sulaymaniyah', ckb: 'سلێمانی' },
      name: { en: 'Ben.M Sulaymaniyah', ckb: 'Ben.M سلێمانی' },
      description: {
        en: 'A room for slow choosing, and fittings that take their time.',
        ckb: 'ژوورێک بۆ هەڵبژاردنی بێپەلە، و تاقیکردنەوەیەک کە کاتی خۆی دەبات.'
      },
      address: {                                      // PLACEHOLDER
        en: 'Salim Street, No. 48, Sulaymaniyah',
        ckb: 'شەقامی سالم، ژمارە ٤٨، سلێمانی'
      },
      hours: {
        en: 'Sat–Thu 10:00–22:00 · Fri 14:00–22:00',
        ckb: 'شەممە تا پێنجشەممە ١٠:٠٠–٢٢:٠٠، هەینی ١٤:٠٠–٢٢:٠٠'
      },
      phone: '+964 770 000 0002',                     // PLACEHOLDER
      lat: 35.5613,
      lng: 45.4374,
      image: 'assets/img/stores/sulaymaniyah.jpg',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sulaymaniyah%2C%20Iraq',
      embedUrl: 'https://maps.google.com/maps?q=Sulaymaniyah%2C%20Iraq&z=13&output=embed'
    },
    {
      id: 'duhok',
      city: { en: 'Duhok', ckb: 'دهۆک' },
      name: { en: 'Ben.M Duhok', ckb: 'Ben.M دهۆک' },
      description: {
        en: 'At the foot of the mountains, a boutique for travellers.',
        ckb: 'لە داوێنی چیاکاندا، فرۆشگایەک بۆ ئەوانەی ڕێگایان دوورە.'
      },
      address: {                                      // PLACEHOLDER
        en: 'Kawa Street, No. 21, Duhok',
        ckb: 'شەقامی کاوە، ژمارە ٢١، دهۆک'
      },
      hours: {
        en: 'Sat–Thu 10:00–22:00 · Fri 14:00–22:00',
        ckb: 'شەممە تا پێنجشەممە ١٠:٠٠–٢٢:٠٠، هەینی ١٤:٠٠–٢٢:٠٠'
      },
      phone: '+964 750 000 0003',                     // PLACEHOLDER
      lat: 36.8669,
      lng: 42.9503,
      image: 'assets/img/stores/duhok.jpg',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Duhok%2C%20Iraq',
      embedUrl: 'https://maps.google.com/maps?q=Duhok%2C%20Iraq&z=13&output=embed'
    }
  ];
})(window);
