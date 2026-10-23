/* =============================================================================
   Ben.M — Home                                           assets/js/pages/home.js
   -----------------------------------------------------------------------------
   Page behaviour for index.html (classic script, after main.js + leather.js).

     0  Strings (home.*)            7  Manifesto — ink-in words
     1  Helpers                     8  Leathers — hanging tags (snapshots)
     2  Hero — the film, intro,     9  Atelier — try your initials
        scroll-out                 10  Lookbook — column parallax
     3  Campaign expand            11  Services + boutiques
     4  Collections pin            12  Shared: icons, brand marks, overlays,
     5  New arrivals rail              language & currency changes
     6  Craft — sticky stack

   Rules: every GSAP/ScrollTrigger target is guarded; direction-dependent
   motion reads BENM.isRTL(); reduced motion → final states, no pin/scrub;
   WebGL: atelier preview + the shared snapshot context (≤ 2).
   ========================================================================== */
(function (w, d) {
  'use strict';
  var B = w.BENM;
  if (!B) return;

  /* ===========================================================================
     0. Strings
     ======================================================================== */
  B.i18n.add({
    en: {
      'home.meta.title': 'Ben.M — Genuine leather goods',
      'home.meta.description': 'Shoes, bags, belts and wallets in genuine leather — chosen by hand, stitched with patience and made to last.',

      'home.hero.eyebrow': 'Shoes · Bags · Belts · Wallets',
      'home.hero.play': 'Play the film',
      'home.hero.pause': 'Pause the film',
      'home.hero.line1': 'Genuine leather,',
      'home.hero.line2': '<em>made to last.</em>',
      'home.hero.cta': 'Shop the collection',
      'home.hero.cta2': 'Discover the craft',
      'home.hero.scroll': 'Scroll',


      'home.campaign.eyebrow': 'The House of Ben.M',
      'home.campaign.title': 'Every pair begins with <em>a single hide.</em>',
      'home.campaign.text': 'We choose every hide by hand, read its grain and cut around its flaws. What reaches you has been looked at, touched and finished by people who care.',
      'home.campaign.link': 'Our story',
      'home.campaign.caption': 'Made to travel',
      'home.campaign.alt': 'A tan leather case beside dried flowers against a deep green wall',

      'home.collections.eyebrow': 'The collections',
      'home.collections.title': 'Men &amp; women, <em>one standard.</em>',
      'home.collections.text': 'Shoes, bags and the small things you carry, for him and for her — all in genuine leather, all finished by hand.',
      'home.collections.explore': 'Explore the collection',
      'home.collections.all': 'View the <em>full collection</em>',
      'home.collections.count': '{n} pieces',
      'home.cat.men.alt': 'A man in a navy suit carrying a black leather briefcase',
      'home.cat.women.alt': 'A woman in a check trench coat holding a cognac leather bag',

      'home.new.eyebrow': 'New arrivals',
      'home.new.title': 'Fresh from <em>the workshop.</em>',
      'home.new.text': 'The latest pieces to leave our benches — drag to browse, or see them all together.',
      'home.new.all': 'View all new arrivals',
      'home.new.prev': 'Previous pieces',
      'home.new.next': 'Next pieces',
      'home.new.railLabel': 'New arrivals — use the arrow keys or drag to browse',
      'home.new.end': 'See every new piece',

      'home.craft.eyebrow': 'The craft',
      'home.craft.title': 'Four steps, <em>no hurry.</em>',
      'home.craft.lead': 'Leather rewards patience. These are the moments every piece passes through before it is ready to leave the bench.',
      'home.craft.s1.label': 'Selection',
      'home.craft.s1.title': 'Chosen by hand',
      'home.craft.s1.text': 'Each hide is unrolled in daylight and read like a map. We keep the ones with a close, even grain, and mark every flaw before a knife comes near.',
      'home.craft.s1.alt': 'Stacked hides of brown and tan leather, chosen by hand',
      'home.craft.s2.label': 'Cutting',
      'home.craft.s2.title': 'Cut along the grain',
      'home.craft.s2.text': 'Pieces are cut one at a time, following the direction of the grain, so that every part stretches and settles the same way.',
      'home.craft.s2.alt': 'Round knife and freshly cut leather pieces on the cutting table',
      'home.craft.s3.label': 'Stitching',
      'home.craft.s3.title': 'Two needles, one thread',
      'home.craft.s3.text': 'Saddle-stitched with waxed thread, pulled tight stitch by stitch. If one thread ever breaks, the seam still holds.',
      'home.craft.s3.alt': 'Hand saddle-stitching with waxed thread at a stitching clam',
      'home.craft.s4.label': 'Finishing',
      'home.craft.s4.title': 'Finished slowly',
      'home.craft.s4.text': 'Edges are burnished, the leather is fed with wax and polished by hand, until it takes on a soft, deep shine.',
      'home.craft.s4.alt': 'Hand-polishing a dark leather shoe with a brush and wax',

      'home.manifesto.label': 'Manifesto',
      'home.manifesto.text': 'We believe a good thing should <em>get better with age.</em> So we choose leather that darkens, softens and remembers — and we make every piece slowly enough to be worn for years, mended when it needs it, and one day handed on.',
      'home.manifesto.sign': 'The House of Ben.M',

      'home.leathers.eyebrow': 'The leathers',
      'home.leathers.title': 'Eight leathers, <em>one house.</em>',
      'home.leathers.text': 'Pebbled, smooth and suede — the colours we return to, season after season. Choose one, then make it yours in the atelier.',
      'home.leathers.cta': 'Personalise in the atelier',
      'home.grain.pebble': 'Pebble grain',
      'home.grain.smooth': 'Smooth calf',
      'home.grain.suede': 'Suede',

      'home.atelier.eyebrow': 'The atelier',
      'home.atelier.title': 'Make it <em>yours.</em>',
      'home.atelier.text': 'Up to three initials, debossed by hand and pressed in gold foil — a quiet signature on something you will keep.',
      'home.atelier.label': 'Try your initials',
      'home.atelier.hint': 'Up to 3 Latin letters or digits',
      'home.atelier.colour': 'Leather colour',
      'home.atelier.cta': 'Personalise yours',
      'home.atelier.fee': 'Personalisation {price}',
      'home.atelier.preview': 'Preview of your initials on leather',
      'home.atelier.caption': 'Live preview · {leather}',
      'home.atelier.alt': 'A craftsman stamping a design into leather with a mallet',

      'home.look.eyebrow': 'Lookbook',
      'home.look.title': 'Worn, carried, <em>lived in.</em>',
      'home.look.text': 'Leather looks its best when it is used. A few of our pieces, out in the world.',
      'home.look.quote': 'Leather chosen by hand. <em>Stitched with patience.</em>',
      'home.look.1': 'Weekend, unhurried',
      'home.look.2': 'City hours',
      'home.look.3': 'Carried close',
      'home.look.4': 'Laced for the road',
      'home.look.5': 'Into the woods',
      'home.look.6': 'Everyday, crossbody',
      'home.look.7': 'Travel light',
      'home.look.8': 'Ready by the door',
      'home.look.1.alt': 'A man carrying a cognac leather weekender through a garden',
      'home.look.2.alt': 'A woman in a dark suit holding a small cognac handbag',
      'home.look.3.alt': 'A man in a denim shirt holding a brown leather clutch',
      'home.look.4.alt': 'Hands lacing brown leather boots',
      'home.look.5.alt': 'Black leather ankle boots in a forest clearing',
      'home.look.6.alt': 'A man wearing a tan leather crossbody bag over a denim jacket',
      'home.look.7.alt': 'A hand carrying a black leather duffel bag',
      'home.look.8.alt': 'A pair of brown cap-toe leather shoes on a warm wooden floor',

      'home.services.title': 'Client services',
      'home.services.note': 'Looked after, long after you leave.',
      'home.services.shipping': 'Complimentary shipping',
      'home.services.shipping.text': 'On every order over {amount}.',
      'home.services.returns': 'Easy returns',
      'home.services.returns.text': 'If something is not quite right, we will make it right.',
      'home.services.care': 'Care & repair',
      'home.services.care.text': 'Polishing, small repairs and advice for a long life.',
      'home.services.gift': 'Gift wrapping',
      'home.services.gift.text': 'Wrapped by hand, ready to give.',

      'home.boutiques.eyebrow': 'Boutique',
      'home.boutiques.title': 'Visit <em>the House.</em>',
      'home.boutiques.text': 'Our boutique in Sulaymaniyah, for slow choosing and fittings that take their time.',
      'home.boutiques.cta': 'Visit the boutique',

      'home.join.eyebrow': 'Letters from the House',
      'home.join.title': 'Join <em>the House.</em>',
      'home.join.text': 'A few letters a season: new pieces before anyone else, invitations to atelier days and notes on caring for leather.',
      'home.join.p1': 'First look at new pieces',
      'home.join.p2': 'Invitations to atelier days',
      'home.join.p3': 'Notes on leather care',
      'home.join.success.title': 'Welcome to the House',
      'home.join.success.text': 'You are on the list. Our first letter will find you soon.'
    },
    ckb: {
      'home.meta.title': 'Ben.M — کاڵای چەرمی ڕەسەن',
      'home.meta.description': 'پێڵاو، جانتا، قایش و جزدان لە چەرمی ڕەسەن — بە دەست هەڵبژێردراون، بە پشوودرێژی دوورراون و بۆ ماوەیەکی درێژ دروستکراون.',

      'home.hero.eyebrow': 'پێڵاو · جانتا · قایش · جزدان',
      'home.hero.play': 'ڤیدیۆکە لێبدە',
      'home.hero.pause': 'ڤیدیۆکە ڕابگرە',
      'home.hero.line1': 'چەرمی ڕەسەن،',
      'home.hero.line2': '<em>بۆ هەمیشە.</em>',
      'home.hero.cta': 'کۆلێکشنەکە ببینە',
      'home.hero.cta2': 'وەستاییەکە بدۆزەرەوە',
      'home.hero.scroll': 'بڕۆ خوارەوە',


      'home.campaign.eyebrow': 'ماڵی Ben.M',
      'home.campaign.title': 'هەر جووتێک <em>لە یەک پێستەوە</em> دەست پێدەکات.',
      'home.campaign.text': 'هەموو پێستێک بە دەست هەڵدەبژێرین، ڕووەکەی دەخوێنینەوە و بە دەوری کەموکوڕییەکانیدا دەیبڕین. ئەوەی دەگاتە دەستت، کەسانێک بینیویانە، دەستیان لێداوە و تەواویان کردووە کە گرنگی پێدەدەن.',
      'home.campaign.link': 'چیرۆکی ئێمە',
      'home.campaign.caption': 'دروستکراو بۆ گەشت',
      'home.campaign.alt': 'جانتایەکی چەرمی قاوەیی کاڵ لە تەنیشت گوڵی وشک، لە بەردەم دیوارێکی سەوزی تۆخ',

      'home.collections.eyebrow': 'کۆلێکشنەکان',
      'home.collections.title': 'پیاوان و خانمان، <em>یەک پێوەر.</em>',
      'home.collections.text': 'پێڵاو، جانتا و ئەو شتە بچووکانەی لەگەڵ خۆت هەڵیاندەگریت، بۆ پیاوان و خانمان — هەمووی لە چەرمی ڕەسەن، هەمووی بە دەست تەواوکراو.',
      'home.collections.explore': 'کۆلێکشنەکە بدۆزەرەوە',
      'home.collections.all': 'بینینی <em>هەموو کۆلێکشنەکە</em>',
      'home.collections.count': '{n} پارچە',
      'home.cat.men.alt': 'پیاوێک بە جلی شینی تۆخەوە، جانتایەکی کاری چەرمی ڕەشی هەڵگرتووە',
      'home.cat.women.alt': 'ئافرەتێک بە باڵتۆیەکی چوارخانەوە، جانتایەکی چەرمی کۆنیاکی بە دەستەوەیە',

      'home.new.eyebrow': 'تازە گەیشتووەکان',
      'home.new.title': 'تازە <em>لە کارگەکەوە.</em>',
      'home.new.text': 'نوێترین پارچەکان کە لە مێزی کارەکانمانەوە هاتوون — ڕایانبکێشە بۆ گەڕان، یان هەموویان پێکەوە ببینە.',
      'home.new.all': 'بینینی هەموو تازە گەیشتووەکان',
      'home.new.prev': 'پارچەکانی پێشوو',
      'home.new.next': 'پارچەکانی دواتر',
      'home.new.railLabel': 'تازە گەیشتووەکان — بۆ گەڕان کلیلەکانی تیر بەکاربهێنە یان ڕایبکێشە',
      'home.new.end': 'هەموو پارچە نوێیەکان ببینە',

      'home.craft.eyebrow': 'وەستایی',
      'home.craft.title': 'چوار هەنگاو، <em>بێ پەلەکردن.</em>',
      'home.craft.lead': 'چەرم پاداشتی پشوودرێژی دەداتەوە. ئەمانە ئەو ساتانەن کە هەموو پارچەیەک پێیاندا تێدەپەڕێت، پێش ئەوەی ئامادە بێت بۆ جێهێشتنی مێزی کار.',
      'home.craft.s1.label': 'هەڵبژاردن',
      'home.craft.s1.title': 'بە دەست هەڵبژێردراو',
      'home.craft.s1.text': 'هەر پێستێک لە ڕووناکیی ڕۆژدا دەکرێتەوە و وەک نەخشەیەک دەخوێنرێتەوە. ئەوانەی ڕووەکەیان چڕ و یەکسانە هەڵیاندەگرین، و پێش ئەوەی چەقۆ نزیکیان بکەوێتەوە، هەموو کەموکوڕییەک نیشانە دەکەین.',
      'home.craft.s1.alt': 'پێستی چەرمی قاوەیی و هەنگوینی کە بە دەست هەڵبژێردراون و لەسەر یەک دانراون',
      'home.craft.s2.label': 'بڕین',
      'home.craft.s2.title': 'بە ئاڕاستەی ڕووی چەرمەکە',
      'home.craft.s2.text': 'پارچەکان یەک بە یەک دەبڕدرێن، بە ئاڕاستەی ڕووی چەرمەکە، بۆ ئەوەی هەموو بەشەکان بە هەمان شێوە بکشێن و جێگیر ببن.',
      'home.craft.s2.alt': 'چەقۆی خڕ و پارچە چەرمی تازە بڕاو لەسەر مێزی بڕین',
      'home.craft.s3.label': 'دوورین',
      'home.craft.s3.title': 'دوو دەرزی، یەک داو',
      'home.craft.s3.text': 'بە داوی مۆمکراو و بە دوو دەرزی دەدوورێت، هەر کوکێک بە توندی دەکێشرێت. ئەگەر ڕۆژێک داوێک بپچڕێت، دوورینەکە هەر بەهێز دەمێنێتەوە.',
      'home.craft.s3.alt': 'دوورینی دەستی بە داوی مۆمکراو لەناو گیرەی دوورین',
      'home.craft.s4.label': 'تەواوکردن',
      'home.craft.s4.title': 'بە هێمنی تەواوکراو',
      'home.craft.s4.text': 'لێوارەکان ساف دەکرێن، چەرمەکە بە مۆم خۆراک دەدرێت و بە دەست بریقەدار دەکرێت، تا بریقەیەکی نەرم و قووڵ وەردەگرێت.',
      'home.craft.s4.alt': 'بریقەدارکردنی پێڵاوێکی چەرمی تۆخ بە دەست، بە فڵچە و مۆم',

      'home.manifesto.label': 'بەیاننامە',
      'home.manifesto.text': 'باوەڕمان وایە شتی باش دەبێت <em>بە تێپەڕبوونی کات جوانتر ببێت.</em> بۆیە چەرمێک هەڵدەبژێرین کە تۆختر و نەرمتر دەبێت و یادەوەری هەڵدەگرێت — و هەموو پارچەیەک هێندە بە هێمنی دروست دەکەین کە ساڵانێک لەبەر بکرێت، کاتێک پێویست بوو چاک بکرێتەوە، و ڕۆژێک بۆ کەسێکی تر بمێنێتەوە.',
      'home.manifesto.sign': 'ماڵی Ben.M',

      'home.leathers.eyebrow': 'چەرمەکان',
      'home.leathers.title': 'هەشت چەرم، <em>یەک ماڵ.</em>',
      'home.leathers.text': 'دەنکدار، ساف و مەخمەڵی — ئەو ڕەنگانەی وەرز لە دوای وەرز بۆیان دەگەڕێینەوە. یەکێکیان هەڵبژێرە، پاشان لە ئاتێلیەدا بیکە بە هی خۆت.',
      'home.leathers.cta': 'لە ئاتێلیە تایبەتی بکە',
      'home.grain.pebble': 'دەنکدار',
      'home.grain.smooth': 'چەرمی ساف',
      'home.grain.suede': 'مەخمەڵی',

      'home.atelier.eyebrow': 'ئاتێلیە',
      'home.atelier.title': 'بیکە بە <em>هی خۆت.</em>',
      'home.atelier.text': 'تا سێ پیت، بە دەست لەسەر چەرمەکە مۆر دەکرێن و بە فۆیلی زێڕین دەڕازێنرێنەوە — واژۆیەکی بێدەنگ لەسەر شتێک کە بۆ خۆتی دەهێڵیتەوە.',
      'home.atelier.label': 'پیتە سەرەتاییەکانت تاقی بکەرەوە',
      'home.atelier.hint': 'تا ٣ پیتی لاتینی یان ژمارە',
      'home.atelier.colour': 'ڕەنگی چەرم',
      'home.atelier.cta': 'هی خۆت تایبەت بکە',
      'home.atelier.fee': 'تایبەتکردن {price}',
      'home.atelier.preview': 'پێشبینینی پیتەکانت لەسەر چەرم',
      'home.atelier.caption': 'پێشبینینی ڕاستەوخۆ · {leather}',
      'home.atelier.alt': 'وەستایەک بە چەکوش نەخشێک لەسەر چەرم مۆر دەکات',

      'home.look.eyebrow': 'لووکبووک',
      'home.look.title': 'لە پێدا، لە دەستدا، <em>لە ناو ژیاندا.</em>',
      'home.look.text': 'چەرم کاتێک بەکاردێت جوانترین دەردەکەوێت. چەند پارچەیەک لە بەرهەمەکانمان، لە ناو ژیانی ڕۆژانەدا.',
      'home.look.quote': 'چەرمێک بە دەست هەڵبژێردراو. <em>بە پشوودرێژی دوورراو.</em>',
      'home.look.1': 'کۆتایی هەفتە، بێ پەلە',
      'home.look.2': 'کاتەکانی شار',
      'home.look.3': 'لە نزیکەوە هەڵگیراو',
      'home.look.4': 'بەستراو بۆ ڕێگا',
      'home.look.5': 'بەرەو دارستان',
      'home.look.6': 'هەموو ڕۆژێک، لەسەر شان',
      'home.look.7': 'گەشتی سووک',
      'home.look.8': 'ئامادە لە لای دەرگا',
      'home.look.1.alt': 'پیاوێک جانتایەکی گەشتی چەرمی کۆنیاکی بە ناو باخچەیەکدا هەڵدەگرێت',
      'home.look.2.alt': 'ئافرەتێک بە جلی تۆخەوە، جانتایەکی دەستیی بچووکی کۆنیاکی بە دەستەوەیە',
      'home.look.3.alt': 'پیاوێک بە کراسی جینزەوە، جانتایەکی دەستیی چەرمی قاوەیی گرتووە',
      'home.look.4.alt': 'دوو دەست قەیتانی پۆتینی چەرمی قاوەیی دەبەستن',
      'home.look.5.alt': 'پۆتینی کورتی چەرمی ڕەش لە بۆشاییەکی ناو دارستان',
      'home.look.6.alt': 'پیاوێک جانتایەکی شانیی چەرمی هەنگوینی بەسەر چاکەتی جینزەوە کردووە',
      'home.look.7.alt': 'دەستێک جانتایەکی گەشتی چەرمی ڕەش هەڵدەگرێت',
      'home.look.8.alt': 'جووتێک پێڵاوی چەرمی قاوەیی لەسەر زەوییەکی تەختەی گەرم',

      'home.services.title': 'خزمەتگوزاریی کڕیاران',
      'home.services.note': 'دوای کڕینیش، هەر لە خزمەتتداین.',
      'home.services.shipping': 'گەیاندنی بێبەرامبەر',
      'home.services.shipping.text': 'بۆ هەموو داواکارییەک کە لە {amount} زیاتر بێت.',
      'home.services.returns': 'گەڕاندنەوەی ئاسان',
      'home.services.returns.text': 'ئەگەر شتێک وەک پێویست نەبوو، بە ئاسانی چارەسەری دەکەین.',
      'home.services.care': 'چاودێری و چاککردنەوە',
      'home.services.care.text': 'بریقەدارکردن، چاککردنەوەی بچووک و ئامۆژگاری بۆ تەمەنێکی درێژ.',
      'home.services.gift': 'پێچانەوەی دیاری',
      'home.services.gift.text': 'بە دەست دەپێچرێتەوە، ئامادە بۆ پێشکەشکردن.',

      'home.boutiques.eyebrow': 'فرۆشگا',
      'home.boutiques.title': 'سەردانی <em>ماڵەکە</em> بکە.',
      'home.boutiques.text': 'فرۆشگاکەمان لە سلێمانی، بۆ هەڵبژاردنی بێپەلە و تاقیکردنەوەیەک کە کاتی خۆی دەبات.',
      'home.boutiques.cta': 'سەردانی فرۆشگاکە بکە',

      'home.join.eyebrow': 'نامەکانی ماڵەکە',
      'home.join.title': 'ببە بە ئەندامی <em>ماڵەکە.</em>',
      'home.join.text': 'چەند نامەیەک لە هەر وەرزێکدا: پارچە نوێیەکان پێش هەموو کەس، بانگهێشت بۆ ڕۆژانی ئاتێلیە و ئامۆژگاری بۆ چاودێریی چەرم.',
      'home.join.p1': 'یەکەم بینینی پارچە نوێیەکان',
      'home.join.p2': 'بانگهێشت بۆ ڕۆژانی ئاتێلیە',
      'home.join.p3': 'ئامۆژگاری بۆ چاودێریی چەرم',
      'home.join.success.title': 'بەخێربێیت بۆ ماڵەکە',
      'home.join.success.text': 'ناوت تۆمار کرا. یەکەم نامەمان بەم زووانە دەگاتە دەستت.'
    }
  });

  /* ===========================================================================
     1. Helpers
     ======================================================================== */
  var gsap = w.gsap || null;
  var ST = w.ScrollTrigger || null;
  var RM = !!B.reducedMotion;                  // also true when GSAP is missing
  var mm = !RM && gsap && gsap.matchMedia ? gsap.matchMedia() : null;
  var CONFIG = w.BENM_CONFIG || {};
  var LEATHERS = w.BENM_LEATHERS || [];
  var STORES = w.BENM_STORES || [];
  var html = d.documentElement;

  function $(sel, root) { return (root || d).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || d).querySelectorAll(sel)); }
  function pad2(n) { return n < 10 ? '0' + n : String(n); }
  function esc(s) { return B.esc ? B.esc(s) : String(s == null ? '' : s); }
  function otherLang() { return B.lang === 'ckb' ? 'en' : 'ckb'; }
  function leatherById(id) {
    for (var i = 0; i < LEATHERS.length; i++) if (LEATHERS[i].id === id) return LEATHERS[i];
    return LEATHERS[0] || null;
  }
  function killTween(t) {
    if (!t) return;
    if (t.scrollTrigger) t.scrollTrigger.kill();
    t.kill();
  }
  function debounce(fn, ms) {
    var id;
    return function () { clearTimeout(id); id = setTimeout(fn, ms); };
  }
  // run fn once when el comes within `margin` of the viewport
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
  // SplitText (aria:'auto') labels the split element and hides its pieces; on a
  // <span>/<p> that label is not exposed, so keep the real words readable instead.
  function keepReadable(el) {
    if (!el) return;
    el.removeAttribute('aria-label');
    $$('[aria-hidden="true"]', el).forEach(function (x) { x.removeAttribute('aria-hidden'); });
  }

  /* ===========================================================================
     2. Hero — the film
     A muted loop: landscape cut, or the portrait cut on tall screens. It plays
     only while the hero is on screen, the tab visible and no overlay open; it
     starts paused with reduced motion or data saving — the button always works.
     ======================================================================== */
  var hero = $('.home-hero');
  var heroLines = $$('.home-hero__line');
  var heroIntro = null;
  var film = hero && $('.home-hero__video', hero);
  var filmBtn = hero && $('[data-hero-film]', hero);
  var mqPortrait = w.matchMedia ? w.matchMedia('(max-aspect-ratio: 4/5)') : null;
  var filmWanted = !RM && !saveData();
  var filmSeen = true, filmCovered = false;

  function saveData() {
    var c = w.navigator.connection;
    return !!(c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || '')));
  }
  function filmSrc() {
    return B.url(film.getAttribute(mqPortrait && mqPortrait.matches ? 'data-src-portrait' : 'data-src'));
  }
  function loadFilm() {                          // also switches cut on rotation, at the same moment of the loop
    var src = filmSrc();
    if (film.getAttribute('src') === src) return;
    var t = film.currentTime || 0;
    film.setAttribute('src', src);
    if (t) film.addEventListener('loadedmetadata', function () { try { film.currentTime = t; } catch (e) { /* not seekable yet */ } }, { once: true });
  }
  function renderFilmBtn() {
    if (!filmBtn) return;
    var key = film.paused ? 'home.hero.play' : 'home.hero.pause';
    var label = $('[data-film-label]', filmBtn);
    filmBtn.setAttribute('data-state', film.paused ? 'paused' : 'playing');
    if (label) { label.setAttribute('data-i18n', key); label.textContent = B.t(key); }
  }
  function syncFilm() {
    if (!film) return;
    var go = filmWanted && filmSeen && !filmCovered && !d.hidden;
    if (go && film.paused) {
      loadFilm();
      var p = film.play();
      if (p && p.catch) p.catch(renderFilmBtn);  // refused (e.g. low-power mode): the button offers it
    } else if (!go && !film.paused) film.pause();
    renderFilmBtn();
  }
  if (film) {
    film.muted = true;                           // the property, not only the attribute, unlocks autoplay
    film.addEventListener('playing', function () { hero.classList.add('is-film'); renderFilmBtn(); });
    film.addEventListener('pause', renderFilmBtn);
    if (filmBtn) filmBtn.addEventListener('click', function () { filmWanted = film.paused; syncFilm(); });
    if (mqPortrait && mqPortrait.addEventListener) {
      mqPortrait.addEventListener('change', function () {
        if (!film.getAttribute('src')) return;
        var playing = !film.paused;
        loadFilm();
        if (playing) syncFilm();
      });
    }
    if ('IntersectionObserver' in w) {
      new IntersectionObserver(function (entries) {
        filmSeen = entries[entries.length - 1].isIntersecting;
        syncFilm();
      }).observe(hero);
    }
    d.addEventListener('visibilitychange', syncFilm);
  }

  function heroPieces(el) { return el && el.__benmSplit ? el.__benmSplit.lines : []; }

  B.page(function () {
    if (!hero) return;
    syncFilm();                                  // starts behind the cover, so it is running when the page opens
    if (RM) return;
    heroLines.forEach(function (el) { if (B.split(el, 'lines')) keepReadable(el); });
    var pieces = heroPieces(heroLines[0]).concat(heroPieces(heroLines[1]));
    if (pieces.length) gsap.set(pieces, { yPercent: 118 });
    gsap.set($$('[data-hero-fade]', hero), { opacity: 0, y: 18 });
    var filmEl = $('.home-hero__film', hero);
    if (filmEl) gsap.set(filmEl, { scale: 1.1 });

    // scroll-out: the film sinks behind the page (parallax), the headline drifts up
    var media = $('.home-hero__media', hero), title = $('.home-hero__title', hero);
    var top = $('.home-hero__top', hero), foot = $('.home-hero__foot', hero);
    var tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
    });
    if (media) tl.to(media, { yPercent: 22, scale: 1.06 }, 0);
    if (title) tl.to(title, { yPercent: -30, opacity: 0.15 }, 0);
    if (top && foot) tl.to([top, foot], { opacity: 0, duration: 0.45 }, 0);
  });

  function endHeroIntro() {
    heroLines.forEach(function (el) { if (el.__benmSplit) el.__benmSplit.revert(); });
    heroIntro = null;
  }

  B.ready(function () {
    if (!hero || RM) return;
    var filmEl = $('.home-hero__film', hero);
    heroIntro = gsap.timeline({ defaults: { ease: 'expo.out' }, onComplete: endHeroIntro });
    if (filmEl) heroIntro.to(filmEl, { scale: 1, duration: 2.6, ease: 'power3.out', clearProps: 'transform' }, 0);
    var l1 = heroPieces(heroLines[0]), l2 = heroPieces(heroLines[1]);
    if (l1.length) heroIntro.to(l1, { yPercent: 0, duration: 1.5, stagger: 0.12 }, 0.25);
    if (l2.length) heroIntro.to(l2, { yPercent: 0, duration: 1.5, stagger: 0.12 }, 0.5);
    heroIntro.to($$('[data-hero-fade]', hero), { opacity: 1, y: 0, duration: 1.3, stagger: 0.07, clearProps: 'transform,opacity' }, 0.85);
  });

  /* ===========================================================================
     3. Campaign — framed inset expands to full bleed (scrubbed, pinned)
     ======================================================================== */
  B.page(function () {
    var sec = $('.home-campaign');
    if (!sec || RM) return;
    var mediaEl = $('.home-campaign__media', sec);
    var img = mediaEl && $('img', mediaEl);
    var scrim = $('.home-campaign__scrim', sec);
    var statement = $('.home-campaign__statement', sec);
    var deco = [$('.home-campaign__frame', sec), $('.home-campaign__caption', sec)].filter(Boolean);
    if (!mediaEl || !img || !statement || !scrim) return;
    function startInset() {
      var cs = w.getComputedStyle(sec);
      var y = cs.getPropertyValue('--ci-y').trim() || '15%';
      var x = cs.getPropertyValue('--ci-x').trim() || '23%';
      return 'inset(' + y + ' ' + x + ' ' + y + ' ' + x + ')';
    }
    var tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: sec, start: 'top top', end: '+=115%', pin: true, scrub: 1, invalidateOnRefresh: true }
    });
    tl.fromTo(mediaEl, { clipPath: startInset }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.62, ease: 'power2.inOut' }, 0)
      .fromTo(img, { scale: 1.22 }, { scale: 1, duration: 0.62, ease: 'power2.inOut' }, 0)
      .fromTo(scrim, { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.4)
      .fromTo(statement, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, 0.54)
      .to({}, { duration: 0.16 });
    if (deco.length) tl.to(deco, { opacity: 0, scale: 1.04, duration: 0.2 }, 0);
  });

  /* ===========================================================================
     4. The collections — pinned horizontal gallery ≥1024px (RTL mirrored)
     ======================================================================== */
  var collSec = $('.home-collections');

  // One card per main category that holds pieces (Men, Women — editable in the admin), listing its
  // non-empty sub-categories. Rendered once; texts carry data-i18n="cat.<id>.…" so a language switch
  // re-labels them in place.
  function renderCollections() {
    var list = $('[data-home-cats]', collSec);
    if (!list || !B.categories) return;
    var mains = B.categories(null, { nonEmpty: true });
    if (!mains.length) return;
    list.innerHTML = mains.map(function (c, i) {
      var first = B.products(function (p) { return B.inCategory(p, c.id); })[0];
      var img = c.image || (first && first.images && first.images[0]) || '';
      var altKey = 'home.cat.' + c.id + '.alt', alt = B.t(altKey) === altKey ? '' : B.t(altKey);
      var subs = B.categories(c.id, { nonEmpty: true }).map(function (s) {
        return '<li><a class="home-cat__sub" href="' + esc(B.url('shop.html?cat=' + encodeURIComponent(s.id))) + '">' +
          '<span data-i18n="cat.' + esc(s.id) + '.name">' + esc(B.loc(s.name)) + '</span>' +
          '<sup class="home-cat__sub-n" data-sub-count="' + esc(s.id) + '"></sup></a></li>';
      }).join('');
      return '<li class="home-cat" data-cat="' + esc(c.id) + '" data-reveal="up"' + (i ? ' data-reveal-delay="' + Math.min(.3, i * .08).toFixed(2) + '"' : '') + '>' +
        '<span class="home-cat__num" aria-hidden="true">' + pad2(i + 1) + '</span>' +
        '<div class="home-cat__media u-media">' + (img ? '<img src="' + esc(B.url(img)) + '" alt="' + esc(alt) + '"' + (alt ? ' data-i18n-attr="alt:' + esc(altKey) + '"' : '') + ' width="1200" height="1600" loading="lazy" decoding="async">' : '') + '</div>' +
        '<div class="home-cat__body">' +
          '<p class="home-cat__index">N°' + pad2(i + 1) + '</p>' +
          '<h3 class="home-cat__name"><a class="home-cat__link" href="' + esc(B.url('shop.html?cat=' + encodeURIComponent(c.id))) + '" data-i18n="cat.' + esc(c.id) + '.name">' + esc(B.loc(c.name)) + '</a></h3>' +
          '<p class="home-cat__tagline" data-i18n="cat.' + esc(c.id) + '.tagline">' + esc(B.loc(c.tagline)) + '</p>' +
          (subs ? '<ul class="home-cat__subs" role="list">' + subs + '</ul>' : '') +
          '<p class="home-cat__cta" aria-hidden="true"><span data-i18n="home.collections.explore">' + esc(B.t('home.collections.explore')) + '</span><span data-icon="arrow"></span></p>' +
        '</div>' +
      '</li>';
    }).join('');
    var total = $('[data-collection-total]', collSec);
    if (total) total.textContent = '/ ' + pad2(mains.length);
  }

  function fillCategories() {
    if (!collSec) return;
    $$('[data-sub-count]', collSec).forEach(function (el) { el.textContent = B.num(pad2(B.categoryCount(el.getAttribute('data-sub-count')))); });
    var count = $('[data-collection-count]', collSec);
    if (count) count.textContent = B.t('home.collections.count', { n: (w.BENM_PRODUCTS || []).length });
  }

  function setupCollectionsPin() {
    var pinEl = $('.home-collections__pin', collSec);
    var track = $('.home-collections__track', collSec);
    var fill = $('.home-collections__bar-fill', collSec);
    var current = $('[data-collection-current]', collSec);
    var cards = $$('.home-cat', collSec);
    if (!pinEl || !track || !cards.length) return null;
    collSec.classList.add('is-pinned');
    var imgs = cards.map(function (c) { return $('.home-cat__media img', c); });
    var setters = imgs.map(function (img) { return img ? gsap.quickSetter(img, 'xPercent') : null; });
    var geo = { vw: 1, centers: [] }, last = -1, tw;

    function dist() { return Math.max(0, track.scrollWidth - pinEl.clientWidth); }
    function measure() {                         // card centres at x = 0 (viewport px)
      var x = gsap.getProperty(track, 'x') || 0;
      geo.vw = pinEl.clientWidth || 1;
      geo.centers = cards.map(function (c) { var r = c.getBoundingClientRect(); return r.left - x + r.width / 2; });
    }
    function update() {                          // no layout reads in here
      var x = gsap.getProperty(track, 'x') || 0, best = 0, bestD = Infinity;
      if (fill) fill.style.transform = 'scaleX(' + (tw ? tw.progress() : 0).toFixed(4) + ')';
      geo.centers.forEach(function (c0, i) {
        var dn = (c0 + x - geo.vw / 2) / geo.vw;
        if (setters[i]) setters[i](Math.max(-12, Math.min(12, dn * -9)));
        if (Math.abs(dn) < bestD) { bestD = Math.abs(dn); best = i; }
      });
      if (best !== last && current) { last = best; current.textContent = pad2(best + 1); }
    }
    tw = gsap.to(track, {
      x: function () { return (B.isRTL() ? 1 : -1) * dist(); },
      ease: 'none',
      onUpdate: update,
      scrollTrigger: {
        trigger: collSec, pin: true, scrub: 1, start: 'top top',
        end: function () { return '+=' + dist(); },
        invalidateOnRefresh: true,
        onRefresh: function () { measure(); update(); }
      }
    });
    return function () {
      killTween(tw);
      collSec.classList.remove('is-pinned');
      gsap.set(track, { clearProps: 'transform' });
      imgs.forEach(function (img) { if (img) gsap.set(img, { clearProps: 'transform' }); });
      if (fill) fill.style.transform = '';
    };
  }

  B.page(function () {
    if (!collSec) return;
    renderCollections();
    fillCategories();
    if (mm) mm.add('(min-width: 1024px)', setupCollectionsPin);
  });

  /* ===========================================================================
     5. New arrivals — draggable rail (mouse drag + momentum, native touch,
        keyboard-scrollable region, prev/next, progress thumb)
     ======================================================================== */
  var NEW_ORDER = ['azmar-oxford', 'nergiz-pump', 'nawroz-tote', 'zagros-chelsea-boot',
    'hiva-ankle-boot', 'dukan-weekender', 'safeen-penny-loafer', 'penjwen-passport-cover'];
  var rail = $('#new-rail');

  function newArrivals() {
    var list = (B.products ? B.products(function (p) { return p.isNew; }) : []).slice();
    function rank(p) { var i = NEW_ORDER.indexOf(p.id); return i < 0 ? 99 : i; }
    return list.sort(function (a, b) { return rank(a) - rank(b); });
  }

  function renderRail() {
    var listEl = rail && $('.home-rail__list', rail);
    if (!listEl) return;
    listEl.innerHTML = newArrivals().map(function (p, i) {
      return '<li class="home-rail__item">' + B.productCard(p, { index: i + 1, heading: 'h3' }) + '</li>';
    }).join('') +
      '<li class="home-rail__item"><a class="home-rail__end" href="shop.html?new=1">' +
        '<span class="c-eyebrow" data-i18n="home.new.eyebrow">' + esc(B.t('home.new.eyebrow')) + '</span>' +
        '<span class="home-rail__end-title" data-i18n="home.new.end">' + esc(B.t('home.new.end')) + '</span>' +
        B.icon('arrow') + '</a></li>';
  }

  function initRail() {
    if (!rail) return;
    var fill = $('.home-rail__progress-fill');
    var btns = $$('[data-rail-step]');
    var max = 0, ratio = 1, drag = null, suppress = false, tween = null;

    function logical() { return Math.abs(rail.scrollLeft); }
    function toPhysical(v) { return B.isRTL() ? -v : v; }
    function measure() {
      max = Math.max(0, rail.scrollWidth - rail.clientWidth);
      ratio = rail.scrollWidth ? Math.min(1, rail.clientWidth / rail.scrollWidth) : 1;
      if (fill) fill.style.setProperty('--thumb', (ratio * 100).toFixed(2) + '%');
      update();
    }
    function update() {
      var p = max ? Math.min(1, logical() / max) : 0;
      if (fill) {
        var travel = ratio < 1 ? (1 - ratio) / ratio * 100 * p : 0;
        fill.style.transform = 'translateX(' + (B.isRTL() ? -travel : travel).toFixed(3) + '%)';
      }
      btns.forEach(function (b) {
        var back = +b.getAttribute('data-rail-step') < 0;
        b.setAttribute('aria-disabled', String(max < 2 || (back ? p <= 0.002 : p >= 0.998)));
      });
    }
    function goTo(v) {
      v = Math.max(0, Math.min(max, v));
      if (tween) tween.kill();
      if (RM || !gsap) { rail.scrollLeft = toPhysical(v); return; }
      tween = gsap.to(rail, { scrollLeft: toPhysical(v), duration: 1, ease: 'expo.out', overwrite: true });
    }
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.getAttribute('aria-disabled') === 'true') return;
        var item = $('.home-rail__item', rail);
        var cardW = item ? item.getBoundingClientRect().width + 24 : rail.clientWidth * 0.8;
        var per = Math.max(1, Math.floor(rail.clientWidth * 0.85 / cardW));
        goTo(logical() + (+b.getAttribute('data-rail-step')) * per * cardW);
      });
    });

    // mouse drag with momentum (touch scrolls natively)
    rail.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      if (tween) tween.kill();
      suppress = false;
      drag = { id: e.pointerId, x: e.clientX, start: rail.scrollLeft, lastX: e.clientX, lastT: e.timeStamp, v: 0, moved: false };
    });
    rail.addEventListener('pointermove', function (e) {
      if (!drag || e.pointerId !== drag.id) return;
      var dx = e.clientX - drag.x;
      if (!drag.moved) {
        if (Math.abs(dx) < 6) return;
        drag.moved = true;
        rail.classList.add('is-dragging');
        try { rail.setPointerCapture(e.pointerId); } catch (err) { /* capture is optional */ }
      }
      rail.scrollLeft = drag.start - dx;
      var dt = Math.max(1, e.timeStamp - drag.lastT);
      drag.v = drag.v * 0.4 + ((e.clientX - drag.lastX) / dt) * 0.6;     // px per ms, smoothed
      drag.lastX = e.clientX;
      drag.lastT = e.timeStamp;
    });
    function endDrag() {
      if (!drag) return;
      var moved = drag.moved, v = drag.v;
      drag = null;
      rail.classList.remove('is-dragging');
      if (!moved) return;
      suppress = true;
      setTimeout(function () { suppress = false; }, 80);
      if (!RM && gsap && Math.abs(v) > 0.05) {
        var target = Math.abs(rail.scrollLeft - v * 420);
        goTo(target);
      }
    }
    rail.addEventListener('pointerup', endDrag);
    rail.addEventListener('pointercancel', endDrag);
    rail.addEventListener('click', function (e) {
      if (suppress) { e.preventDefault(); e.stopPropagation(); }
    }, true);
    rail.addEventListener('dragstart', function (e) { e.preventDefault(); });
    rail.addEventListener('scroll', update, { passive: true });
    w.addEventListener('resize', debounce(measure, 160));
    B.on('langchange', function () { if (tween) tween.kill(); rail.scrollLeft = 0; measure(); });
    measure();
    if (d.readyState !== 'complete') w.addEventListener('load', measure);
  }

  B.page(function () { renderRail(); initRail(); });

  /* ===========================================================================
     6. The craft — sticky image stack (≥900px) wiped by four scrolling steps
     ======================================================================== */
  B.page(function () {
    var sec = $('.home-craft');
    if (!sec || !ST) return;
    var steps = $$('.home-craft__step', sec);
    var imgs = $$('.home-craft__img', sec);
    var current = $('[data-craft-current]', sec);
    if (!steps.length) return;
    function setActive(i) {
      steps.forEach(function (s, k) { s.classList.toggle('is-active', k === i); });
      imgs.forEach(function (im, k) { im.classList.toggle('is-shown', k <= i); });   // reduced-motion swap
      if (current) current.textContent = pad2(i + 1);
    }
    steps.forEach(function (step, i) {
      ST.create({
        trigger: step, start: 'top 62%', end: 'bottom 62%',
        onToggle: function (self) { if (self.isActive) setActive(i); }
      });
    });
    if (mm && imgs.length > 1) {
      mm.add('(min-width: 900px)', function () {
        sec.classList.add('is-live');
        var tws = imgs.slice(1).map(function (img, k) {
          return gsap.fromTo(img, { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.14 }, {
            clipPath: 'inset(0% 0% 0% 0%)', scale: 1, ease: 'none',
            scrollTrigger: { trigger: steps[k + 1] || steps[steps.length - 1], start: 'top 95%', end: 'top 42%', scrub: true }
          });
        });
        return function () {
          sec.classList.remove('is-live');
          tws.forEach(killTween);
          gsap.set(imgs, { clearProps: 'clipPath,transform' });
        };
      });
    }
  });

  /* ===========================================================================
     7. Manifesto — inks in word by word (opacity scrub)
     ======================================================================== */
  var manifesto = $('.home-manifesto__text');
  var inkTween = null;
  function buildInk() {
    killTween(inkTween);
    inkTween = null;
    if (RM || !manifesto) return;
    // after a language switch main.js has already re-split the paragraph
    var s = manifesto.__benmSplit || B.split(manifesto, 'words');
    if (!s || !s.words || !s.words.length) return;
    keepReadable(manifesto);
    inkTween = gsap.fromTo(s.words, { opacity: 0.13 }, {
      opacity: 1, ease: 'none', stagger: 0.1,
      scrollTrigger: { trigger: manifesto, start: 'top 80%', end: 'bottom 50%', scrub: true }
    });
  }
  B.page(buildInk);

  // the signature: the wordmark is drawn in a gold line, then filled with foil
  function drawSignature() {
    var svg = $('[data-brand-sign] svg');
    if (!svg || RM) return;
    var paths = $$('path', svg);
    paths.forEach(function (p) { p.setAttribute('pathLength', '1'); });
    gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1, fillOpacity: 0 });
    gsap.timeline({ scrollTrigger: { trigger: svg, start: 'top 88%', once: true } })
      .to(paths, { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut', stagger: 0.12 })
      .to(paths, { fillOpacity: 1, duration: 1.2, ease: 'power2.out' }, '-=0.6')
      .set(paths, { strokeOpacity: 0 });
  }

  /* ===========================================================================
     8. Leathers — eight hanging tags (BENM.Leather.snapshot, one shared context)
     ======================================================================== */
  var tagsRoot = $('.home-tags');
  var tagList = $('[data-leather-list]');
  var tagCaption = $('[data-leather-caption]');
  var snaps = {};
  var selectedLeather = (LEATHERS[0] || {}).id;

  function renderTags() {
    if (!tagList) return;
    var other = otherLang();
    tagList.innerHTML = LEATHERS.map(function (l, i) {
      var style = '--swatch:' + esc(l.hex) + ';--sway:' + (5.2 + (i % 3) * 0.9).toFixed(1) + 's;--sway-delay:-' + (i * 0.7).toFixed(1) + 's';
      return '<li class="home-tag" style="' + style + '">' +
        '<button class="home-tag__btn" type="button" data-leather="' + esc(l.id) + '" aria-pressed="' + (l.id === selectedLeather) + '">' +
          '<span class="home-tag__body"><span class="home-tag__leather">' +
            '<img alt="" width="400" height="500" decoding="async"' + (snaps[l.id] ? ' class="is-loaded" src="' + snaps[l.id] + '"' : '') + '>' +
            '<svg class="home-tag__stitch" viewBox="0 0 100 125" preserveAspectRatio="none" aria-hidden="true" focusable="false">' +
              '<polygon points="20,6 80,6 94,19.5 94,119 6,119 6,19.5"/></svg>' +
          '</span><span class="home-tag__eyelet"></span></span>' +
          '<span class="home-tag__name" data-leather-name>' + esc(B.loc(l.name)) + '</span>' +
          '<span class="home-tag__alt" data-leather-alt lang="' + other + '">' + esc(l.name[other] || '') + '</span>' +
        '</button></li>';
    }).join('');
  }
  function relabelTags() {
    var other = otherLang();
    $$('[data-leather]', tagList).forEach(function (b) {
      var l = leatherById(b.getAttribute('data-leather'));
      var name = $('[data-leather-name]', b), alt = $('[data-leather-alt]', b);
      if (name) name.textContent = B.loc(l.name);
      if (alt) { alt.textContent = l.name[other] || ''; alt.setAttribute('lang', other); }
    });
    renderCaption();
  }
  function renderCaption() {
    var l = leatherById(selectedLeather);
    if (!tagCaption || !l) return;
    tagCaption.innerHTML = '<p class="home-tags__caption-meta">' + esc(B.loc(l.name)) + ' · ' + esc(B.t('home.grain.' + l.grain)) + '</p>' +
      '<p class="home-tags__caption-text">' + esc(B.loc(l.description)) + '</p>';
  }
  function selectLeather(id) {
    selectedLeather = id;
    $$('[data-leather]', tagList).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-leather') === id)); });
    renderCaption();
    setAtelierLeather(id);
  }
  function renderSnapshots() {
    if (!B.Leather || !B.Leather.snapshot) return;
    LEATHERS.forEach(function (l, i) {
      if (snaps[l.id]) return;
      var opts = B.Leather.preset('swatch', { color: l.hex, grain: l.grain, seed: i + 1, dpr: 2, stitch: false });
      B.Leather.snapshot(opts, 400, 500).then(function (url) {
        if (!url) return;
        snaps[l.id] = url;
        var img = $('[data-leather="' + l.id + '"] img', tagList);
        if (!img) return;
        img.onload = function () { img.classList.add('is-loaded'); };
        img.src = url;
      }, function () { /* the flat CSS colour stays */ });
    });
  }

  B.page(function () {
    if (!tagList) return;
    renderTags();
    renderCaption();
    tagList.addEventListener('click', function (e) {
      var btn = e.target.closest && e.target.closest('[data-leather]');
      if (btn) selectLeather(btn.getAttribute('data-leather'));
    });
    whenNear(tagsRoot, '700px 0px', renderSnapshots);
    whenNear(tagsRoot, '0px 0px -18% 0px', function () { tagsRoot.classList.add('is-in'); });
  });

  /* ===========================================================================
     9. Atelier — try your initials (lazy live preview, ATELIER preset)
     ======================================================================== */
  var atelierEl = $('#atelier-preview');
  var atelierTag = null;
  var atelierLeather = 'forest';
  var initials = '';
  var initialsInput = $('#home-initials');
  var atelierCta = $('[data-atelier-cta]');
  var atelierSwatches = $('[data-atelier-swatches]');
  var atelierFee = $('[data-atelier-fee]');
  var atelierCaption = $('[data-atelier-caption]');
  var EASTERN = '٠١٢٣٤٥٦٧٨٩';

  function renderAtelierCaption() {
    var l = leatherById(atelierLeather);
    if (atelierCaption && l) atelierCaption.textContent = B.t('home.atelier.caption', { leather: B.loc(l.name) });
  }

  function atelierMark() {
    return initials ? { type: 'text', text: initials, font: 'serif' } : { type: 'monogram' };
  }
  function createAtelierTag() {
    if (atelierTag || !atelierEl || !B.Leather) return;
    var l = leatherById(atelierLeather);
    try {
      atelierTag = B.Leather.create(atelierEl, B.Leather.preset('atelier', {
        color: l ? l.hex : undefined, grain: l ? l.grain : undefined,
        mark: atelierMark(), label: B.t('home.atelier.preview')
      }));
    } catch (e) { console.error(e); }
  }
  function updateAtelierCta() {
    if (!atelierCta) return;
    var q = [];
    if (initials) q.push('initials=' + encodeURIComponent(initials));
    if (atelierLeather) q.push('leather=' + encodeURIComponent(atelierLeather));
    atelierCta.setAttribute('href', 'atelier.html' + (q.length ? '?' + q.join('&') : ''));
  }
  function setAtelierLeather(id) {
    var l = leatherById(id);
    if (!l) return;
    atelierLeather = l.id;
    $$('[data-atelier-leather]', atelierSwatches).forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-atelier-leather') === l.id));
    });
    if (atelierTag) atelierTag.set({ color: l.hex, grain: l.grain });
    renderAtelierCaption();
    updateAtelierCta();
  }
  function renderSwatches() {
    if (!atelierSwatches) return;
    atelierSwatches.innerHTML = LEATHERS.map(function (l) {
      return '<button class="c-swatch" type="button" style="--swatch:' + esc(l.hex) + '" data-atelier-leather="' + esc(l.id) + '"' +
        ' aria-pressed="' + (l.id === atelierLeather) + '" aria-label="' + esc(B.loc(l.name)) + '" title="' + esc(B.loc(l.name)) + '"></button>';
    }).join('');
  }
  function relabelSwatches() {
    $$('[data-atelier-leather]', atelierSwatches).forEach(function (b) {
      var l = leatherById(b.getAttribute('data-atelier-leather'));
      b.setAttribute('aria-label', B.loc(l.name));
      b.setAttribute('title', B.loc(l.name));
    });
  }
  function renderFee() {
    if (atelierFee) atelierFee.textContent = B.t('home.atelier.fee', { price: B.price(CONFIG.personalisationFee || 25) });
  }
  var pushMark = debounce(function () { if (atelierTag) atelierTag.set({ mark: atelierMark() }); }, 140);

  B.page(function () {
    if (!atelierEl) return;
    renderSwatches();
    renderFee();
    renderAtelierCaption();
    updateAtelierCta();
    if (atelierSwatches) {
      atelierSwatches.addEventListener('click', function (e) {
        var b = e.target.closest && e.target.closest('[data-atelier-leather]');
        if (b) setAtelierLeather(b.getAttribute('data-atelier-leather'));
      });
    }
    if (initialsInput) {
      initialsInput.setAttribute('dir', 'ltr');
      initialsInput.addEventListener('input', function () {
        var raw = initialsInput.value;
        var clean = raw.replace(/[٠-٩]/g, function (c) { return String(EASTERN.indexOf(c)); })
          .toUpperCase().replace(/[^A-Z0-9.]/g, '').slice(0, 3);
        if (clean !== raw) initialsInput.value = clean;
        initials = clean;
        updateAtelierCta();
        pushMark();
      });
    }
    whenNear($('.home-atelier'), '400px 0px', createAtelierTag);
  });

  /* ===========================================================================
     10. Lookbook — three columns drift at different speeds (≥700px)
     ======================================================================== */
  B.page(function () {
    var cols = $$('[data-look-col]');
    var wrap = $('.home-look__cols');
    if (!mm || !wrap || cols.length < 3) return;
    mm.add('(min-width: 700px)', function () {
      var travel = [-8, 10, -16];            // yPercent over the section's passage
      var tws = cols.map(function (c, i) {
        return gsap.fromTo(c, { yPercent: -travel[i] / 2 }, {
          yPercent: travel[i] / 2, ease: 'none',
          scrollTrigger: { trigger: wrap, start: 'top bottom', end: 'bottom top', scrub: true }
        });
      });
      return function () { tws.forEach(killTween); gsap.set(cols, { clearProps: 'transform' }); };
    });
  });

  /* ===========================================================================
     11. Services + boutiques
     ======================================================================== */
  function renderShipping() {
    var el = $('[data-shipping-text]');
    if (el) el.textContent = B.t('home.services.shipping.text', { amount: B.price(CONFIG.freeShippingThreshold || 200) });
  }
  var cities = $('[data-cities]');
  function renderCities() {
    if (!cities) return;
    var other = otherLang();
    cities.innerHTML = STORES.map(function (s, i) {
      return '<li class="home-city"><a class="home-city__link" href="boutiques.html" data-store="' + esc(s.id) + '">' +
        '<span class="home-city__num" aria-hidden="true">N°' + pad2(i + 1) + '</span>' +
        '<span class="home-city__names"><span class="home-city__name" data-city-name>' + esc(B.loc(s.city)) + '</span>' +
        '<span class="home-city__alt" data-city-alt lang="' + other + '">' + esc(s.city[other] || '') + '</span></span>' +
        '<span class="home-city__arrow" aria-hidden="true">' + B.icon('arrow') + '</span></a></li>';
    }).join('');
  }
  function relabelCities() {
    var other = otherLang();
    $$('[data-store]', cities).forEach(function (a) {
      var s = null;
      for (var i = 0; i < STORES.length; i++) if (STORES[i].id === a.getAttribute('data-store')) s = STORES[i];
      if (!s) return;
      var n = $('[data-city-name]', a), alt = $('[data-city-alt]', a);
      if (n) n.textContent = B.loc(s.city);
      if (alt) { alt.textContent = s.city[other] || ''; alt.setAttribute('lang', other); }
    });
  }
  function showStore(id) {
    var imgs = $$('[data-store-img]');
    var has = imgs.some(function (im) { return im.getAttribute('data-store-img') === id; });
    imgs.forEach(function (im) { im.classList.toggle('is-active', im.getAttribute('data-store-img') === (has ? id : 'all')); });
  }

  B.page(function () {
    renderShipping();
    renderCities();
    if (!cities) return;
    var pick = function (e) {
      var a = e.target.closest && e.target.closest('[data-store]');
      if (a) showStore(a.getAttribute('data-store'));
    };
    cities.addEventListener('pointerover', pick);
    cities.addEventListener('focusin', pick);
    cities.addEventListener('pointerleave', function () { showStore('all'); });
    cities.addEventListener('focusout', function (e) { if (!cities.contains(e.relatedTarget)) showStore('all'); });
  });

  /* ===========================================================================
     12. Shared: icons, brand marks, overlays, language & currency
     ======================================================================== */
  B.page(function () {
    // icons: bare placeholders are replaced, styled wrappers are filled
    $$('[data-icon]').forEach(function (el) {
      var svg = B.icon(el.getAttribute('data-icon'));
      if (!svg) return;
      if (el.className) { el.innerHTML = svg; el.removeAttribute('data-icon'); }
      else el.outerHTML = svg;
    });
    var brand = w.BENM_BRAND;
    if (brand && brand.svg) {
      var mark = $('[data-brand-mark]');
      if (mark) mark.innerHTML = brand.svg('wordmark', { foil: true, hideReg: true, decorative: true });
      var sign = $('[data-brand-sign]');
      if (sign) sign.innerHTML = brand.svg('wordmark', { foil: true, hideReg: true, label: 'Ben.M' });
      var seal = $('[data-brand-seal]');
      if (seal) seal.innerHTML = brand.svg('monogram', { foil: true, decorative: true });
    }
    drawSignature();
  });

  // the film and the WebGL tag rest while an overlay (menu, search, drawer, dialog) covers the page
  if (w.MutationObserver) {
    var covered = false;
    new MutationObserver(function () {
      var now = html.classList.contains('is-menu-open') || html.classList.contains('is-locked');
      if (now === covered) return;
      covered = now;
      filmCovered = now;
      syncFilm();
      if (atelierTag) { if (now) atelierTag.pause(); else atelierTag.resume(); }
    }).observe(html, { attributes: true, attributeFilter: ['class'] });
  }

  B.on('langchange', function () {
    // hero: finish a running intro (its pieces were just re-split) and settle the text
    if (heroIntro) heroIntro.progress(1);
    endHeroIntro();
    if (film) renderFilmBtn();
    if (atelierTag) atelierTag.set({ label: B.t('home.atelier.preview') });
    fillCategories();
    buildInk();
    relabelTags();
    relabelSwatches();
    renderFee();
    renderAtelierCaption();
    renderShipping();
    relabelCities();
  });
  B.on('currencychange', function () { renderFee(); renderShipping(); });
})(window, document);
