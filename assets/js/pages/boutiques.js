/* =============================================================================
   Ben.M — Boutiques & client services            assets/js/pages/boutiques.js
   -----------------------------------------------------------------------------
   1. Strings (EN + Central Kurdish)
   2. Helpers
   3. Hero — city index + the panorama that opens like a pair of doors
   4. Boutique cards (rendered from BENM_STORES)
   5. Dotted map — SVG dot field, graticule and route at the real lat/lng;
      markers are HTML links. Geography is never mirrored in RTL.
   6. Linking — markers ⇄ cards (hover, keyboard focus, scroll position)
   7. Client services — contact methods, hours, form behaviour
   8. FAQ deep links (#faq-<topic>) + arriving with a #hash
   9. Boot + language changes
   ========================================================================== */
(function (B, w, d) {
  'use strict';
  if (!B) return;

  var STORES = w.BENM_STORES || [];
  var CONFIG = w.BENM_CONFIG || {};
  var FREE = +CONFIG.freeShippingThreshold || 200;
  var FEE = +CONFIG.personalisationFee || 25;
  // price placeholders inside i18n HTML: filled (and re-filled on lang/currency change) by main.js via [data-price]
  function priceTag(usd) { return '<span class="c-price" data-price="' + usd + '">$' + usd + '</span>'; }

  /* ===========================================================================
     1. Strings
     ======================================================================== */
  B.i18n.add({
    en: {
      'boutiques.meta.title': 'Boutiques & client services — Ben.M',
      'boutiques.meta.description': 'Visit Ben.M in Erbil, Sulaymaniyah and Duhok, write to client services, or find answers about delivery, sizing and leather care.',

      'boutiques.hero.eyebrow': 'Boutiques & client services',
      'boutiques.hero.title': 'Visit the <em>House</em>',
      'boutiques.hero.lead': 'Three boutiques in Kurdistan, each a quiet room of leather and lamplight. Come to try, to choose slowly, or simply to talk about leather.',
      'boutiques.hero.index': 'Our boutiques',
      'boutiques.hero.find': 'Find a boutique',
      'boutiques.hero.caption': 'Inside the House',
      'boutiques.hero.contact': 'Client services',

      'boutiques.img.interior': 'A row of polished leather shoes on a boutique display',
      'boutiques.img.erbil': 'Amber-lit glass cabinets displaying leather goods',
      'boutiques.img.sulaymaniyah': 'A tailored salon with shelves of shoes and folded shirts',
      'boutiques.img.duhok': 'Lit wooden shelves displaying leather bags and shoes',

      'boutiques.list.eyebrow': 'The boutiques',
      'boutiques.list.title': 'Three houses, <em>one welcome.</em>',
      'boutiques.list.text': 'In Erbil, Sulaymaniyah and Duhok, every boutique keeps the same pace: fittings that take their time, honest advice, and leather you can hold in your hands.',
      'boutiques.map.label': 'Map of the Ben.M boutiques',
      'boutiques.map.note': 'A stylised map — each boutique sits at its city’s true latitude and longitude.',
      'boutiques.store.address': 'Address',
      'boutiques.store.hours': 'Opening hours',
      'boutiques.store.phone': 'Telephone',
      'boutiques.store.directions': 'Get directions',
      'boutiques.store.call': 'Call the boutique',

      'boutiques.services.title': 'In every boutique',
      'boutiques.services.fit': 'Fittings, unhurried',
      'boutiques.services.fit.text': 'Try every size and colour. We will help you find the pair that truly fits.',
      'boutiques.services.care': 'Care & repair',
      'boutiques.services.care.text': 'Polishing, small repairs and advice for a long life.',
      'boutiques.services.perso': 'Personalisation',
      'boutiques.services.perso.text': 'Initials pressed by hand in gold, silver or blind foil.',
      'boutiques.services.gift': 'Gift wrapping',
      'boutiques.services.gift.text': 'Wrapped by hand, ready to give.',

      'boutiques.contact.eyebrow': 'Client services',
      'boutiques.contact.title': 'Write to <em>us.</em>',
      'boutiques.contact.lead': 'A question about a size, an order or the care of a favourite pair? Write, call or send a message on WhatsApp — we reply personally.',
      'boutiques.contact.methods': 'Ways to reach us',
      'boutiques.contact.wa.note': 'The quickest way to reach us.',
      'boutiques.contact.phone.note': 'Speak to us during opening hours.',
      'boutiques.contact.email.label': 'Email',
      'boutiques.contact.email.note': 'For longer questions, photographs and details.',
      'boutiques.contact.hours.note': 'Messages that arrive after hours are answered the next day.',

      'boutiques.form.title': 'Send a message',
      'boutiques.form.topic.order': 'An order or a delivery',
      'boutiques.form.topic.returns': 'Returns & exchanges',
      'boutiques.form.topic.sizing': 'Sizing & fit',
      'boutiques.form.topic.care': 'Care & repair',
      'boutiques.form.topic.perso': 'Personalisation',
      'boutiques.form.topic.visit': 'Visiting a boutique',
      'boutiques.form.topic.other': 'Something else',
      'boutiques.form.reply': 'How should we reply?',
      'boutiques.form.reply.email': 'By email',
      'boutiques.form.reply.phone': 'By phone',
      'boutiques.form.reply.whatsapp': 'On WhatsApp',
      'boutiques.form.send': 'Send message',
      'boutiques.form.fine': 'We reply personally, usually within a day.',
      'boutiques.form.success.title': 'Thank you, {name}.',
      'boutiques.form.success.wa': 'Prefer to talk now? Message us on WhatsApp',
      'boutiques.form.again': 'Write another message',
      'boutiques.form.wa.msg': 'Hello Ben.M, I have just written to you about “{topic}”.',

      'boutiques.faq.eyebrow': 'Questions',
      'boutiques.faq.title': 'Questions, <em>answered.</em>',
      'boutiques.faq.text': 'The questions we hear most often, from delivery to the care of your leather. Anything else — simply ask us.',
      'boutiques.faq.write': 'Write to us',
      'boutiques.faq.wa': 'Ask on WhatsApp',
      'boutiques.faq.sample': 'For example',
      'boutiques.faq.t1': 'Shipping',
      'boutiques.faq.q1': 'How does delivery work?',
      'boutiques.faq.a1': 'Every order is confirmed with you personally on WhatsApp, where we agree on delivery to your door and how long it will take. Delivery is complimentary on orders over ' + priceTag(FREE) + '.',
      'boutiques.faq.t2': 'Returns & exchanges',
      'boutiques.faq.q2': 'Can I return or exchange a piece?',
      'boutiques.faq.a2': 'Yes. If a piece is not quite right, write to us and we will arrange an exchange or a return together. Keep it unworn and in its original packaging, so that it can travel back just as it came.',
      'boutiques.faq.t3': 'Sizing',
      'boutiques.faq.q3': 'How do I find my size?',
      'boutiques.faq.a3': 'Our shoes are made in EU sizes. Every product page has a size guide with conversions and a simple way to measure your foot. Between two sizes? Choose the larger one, or ask us — in a boutique we will fit you in person.',
      'boutiques.faq.t4': 'Payment',
      'boutiques.faq.q4': 'How can I pay?',
      'boutiques.faq.a4': 'Payment is agreed with you personally when we confirm your order on WhatsApp, or at the counter in our boutiques. Prices can be shown in US dollars or Iraqi dinars; dinar prices are converted from dollars and rounded, as a guide.',
      'boutiques.faq.t5': 'Care & repair',
      'boutiques.faq.q5': 'How should I care for my leather — and can you repair it?',
      'boutiques.faq.a5': 'Let it rest for a day between wears, keep it away from direct heat, and give it a little cream or balm whenever it looks thirsty. The <a class="c-text-link" href="maison.html#care">leather care guide</a> in the Maison has the details. For polishing and small repairs, bring your piece to any of our boutiques and we will advise you.',
      'boutiques.faq.t6': 'Personalisation',
      'boutiques.faq.q6': 'Can I have my initials added?',
      'boutiques.faq.a6': 'Yes — bags and small leather goods can carry up to three initials, pressed by hand in gold, silver or blind foil. Personalisation adds ' + priceTag(FEE) + '. Try it live in the <a class="c-text-link" href="atelier.html#configurator">Atelier</a>; because each piece is made for you, please check the letters carefully before you confirm.',
      'boutiques.faq.t7': 'Appointments',
      'boutiques.faq.q7': 'Can I book a private appointment?',
      'boutiques.faq.a7': 'Of course. <a class="c-text-link" href="atelier.html#appointment">Request an appointment</a> in the Atelier for a fitting, a made-to-order piece or personalisation, and we will confirm a time with you.',
      'boutiques.faq.t8': 'Gift wrapping',
      'boutiques.faq.q8': 'Do you gift-wrap?',
      'boutiques.faq.a8': 'Every piece can be wrapped by hand, ready to give. Simply mention it when we confirm your order, or ask in the boutique.'
    },
    ckb: {
      'boutiques.meta.title': 'فرۆشگاکان و خزمەتگوزاریی کڕیاران — Ben.M',
      'boutiques.meta.description': 'سەردانی Ben.M بکە لە هەولێر، سلێمانی و دهۆک، نامە بۆ خزمەتگوزاریی کڕیاران بنێرە، یان وەڵامی پرسیارەکانت دەربارەی گەیاندن، قەبارە و چاودێریی چەرم بدۆزەرەوە.',

      'boutiques.hero.eyebrow': 'فرۆشگاکان و خزمەتگوزاریی کڕیاران',
      // «ماڵەکە بکە» never parts (nowrap survives the reveal's word split, a no-break space does not);
      // under 560 px «سەردانی» takes its own line — a fixed composition instead of a threshold wrap
      'boutiques.hero.title': '<span class="btq-hero__w1">سەردانی</span> <span class="btq-keep"><em>ماڵەکە</em> بکە</span>',
      'boutiques.hero.lead': 'سێ فرۆشگا لە کوردستان، هەر یەکەیان ژوورێکی هێمنی چەرم و ڕووناکیی چرایە. وەرە بۆ تاقیکردنەوە، بۆ هەڵبژاردنێکی بێپەلە، یان تەنها بۆ ئەوەی پێکەوە باسی چەرم بکەین.',
      'boutiques.hero.index': 'فرۆشگاکانمان',
      'boutiques.hero.find': 'فرۆشگایەک بدۆزەرەوە',
      'boutiques.hero.caption': 'لە ناو ماڵەکەدا',
      'boutiques.hero.contact': 'خزمەتگوزاریی کڕیاران',

      'boutiques.img.interior': 'ڕیزێک پێڵاوی چەرمی بریقەدار لەسەر ڕەفەی فرۆشگا',
      'boutiques.img.erbil': 'دۆڵابی شووشەیی لە ژێر ڕووناکییەکی زەردی گەرمدا، پڕ لە بەرهەمی چەرم',
      'boutiques.img.sulaymaniyah': 'هۆڵێکی جلوبەرگی ڕێکوپێک، لەگەڵ ڕەفەی پێڵاو و کراسی پێچراوە',
      'boutiques.img.duhok': 'ڕەفەی دارینی ڕووناک کە جانتا و پێڵاوی چەرمی لەسەر نمایش کراوە',

      'boutiques.list.eyebrow': 'فرۆشگاکان',
      'boutiques.list.title': 'سێ ماڵ، <em>یەک پێشوازی.</em>',
      'boutiques.list.text': 'لە هەولێر، سلێمانی و دهۆک، هەموو فرۆشگاکانمان هەمان ڕیتمیان هەیە: تاقیکردنەوەیەک کە کاتی خۆی دەبات، ئامۆژگاریی ڕاستگۆیانە، و چەرمێک کە دەتوانیت بە دەستی خۆت هەستی پێ بکەیت.',
      'boutiques.map.label': 'نەخشەی فرۆشگاکانی Ben.M',
      'boutiques.map.note': 'نەخشەیەکی هونەری — هەر فرۆشگایەک لەسەر هێڵی پانی و درێژیی ڕاستەقینەی شارەکەی خۆی دانراوە.',
      'boutiques.store.address': 'ناونیشان',
      'boutiques.store.hours': 'کاتەکانی کارکردن',
      'boutiques.store.phone': 'تەلەفۆن',
      'boutiques.store.directions': 'ڕێنمایی ڕێگا',
      'boutiques.store.call': 'پەیوەندی بە فرۆشگاکەوە بکە',

      'boutiques.services.title': 'لە هەموو فرۆشگاکاندا',
      'boutiques.services.fit': 'تاقیکردنەوەی بێپەلە',
      'boutiques.services.fit.text': 'هەموو قەبارە و ڕەنگێک تاقی بکەرەوە. یارمەتیت دەدەین ئەو جووتە بدۆزیتەوە کە بە ڕاستی لە پێتدا دەگونجێت.',
      'boutiques.services.care': 'چاودێری و چاککردنەوە',
      'boutiques.services.care.text': 'بریقەدارکردن، چاککردنەوەی بچووک و ئامۆژگاری بۆ تەمەنێکی درێژ.',
      'boutiques.services.perso': 'تایبەتکردن',
      'boutiques.services.perso.text': 'پیتە سەرەتاییەکانت بە دەست دەچەسپێنرێن، بە فۆیلی زێڕین، زیوین یان مۆری بێڕەنگ.',
      'boutiques.services.gift': 'پێچانەوەی دیاری',
      'boutiques.services.gift.text': 'بە دەست دەپێچرێتەوە، ئامادە بۆ پێشکەشکردن.',

      'boutiques.contact.eyebrow': 'خزمەتگوزاریی کڕیاران',
      'boutiques.contact.title': 'بۆمان <em>بنووسە.</em>',
      'boutiques.contact.lead': 'پرسیارێکت دەربارەی قەبارە، داواکارییەک یان چاودێریی جووتێکی خۆشەویستت هەیە؟ بنووسە، پەیوەندی بکە یان لە واتسئاپەوە نامە بنێرە — خۆمان بە شێوەیەکی کەسی وەڵامت دەدەینەوە.',
      'boutiques.contact.methods': 'ڕێگاکانی پەیوەندیکردن',
      'boutiques.contact.wa.note': 'خێراترین ڕێگا بۆ گەیشتن بە ئێمە.',
      'boutiques.contact.phone.note': 'لە کاتەکانی کارکردندا قسەمان لەگەڵ بکە.',
      'boutiques.contact.email.label': 'ئیمەیڵ',
      'boutiques.contact.email.note': 'بۆ پرسیاری درێژتر، وێنە و وردەکاری.',
      'boutiques.contact.hours.note': 'ئەو نامانەی لە دەرەوەی کاتی کارکردن دەگەن، ڕۆژی دواتر وەڵام دەدرێنەوە.',

      'boutiques.form.title': 'نامەیەک بنێرە',
      'boutiques.form.topic.order': 'داواکاری یان گەیاندن',
      'boutiques.form.topic.returns': 'گەڕاندنەوە و گۆڕینەوە',
      'boutiques.form.topic.sizing': 'قەبارە و گونجان',
      'boutiques.form.topic.care': 'چاودێری و چاککردنەوە',
      'boutiques.form.topic.perso': 'تایبەتکردن',
      'boutiques.form.topic.visit': 'سەردانی فرۆشگایەک',
      'boutiques.form.topic.other': 'شتێکی تر',
      'boutiques.form.reply': 'چۆن وەڵامت بدەینەوە؟',
      'boutiques.form.reply.email': 'بە ئیمەیڵ',
      'boutiques.form.reply.phone': 'بە تەلەفۆن',
      'boutiques.form.reply.whatsapp': 'لە واتسئاپ',
      'boutiques.form.send': 'ناردنی نامە',
      'boutiques.form.fine': 'بە شێوەیەکی کەسی وەڵامت دەدەینەوە، زۆربەی جار لە ماوەی ڕۆژێکدا.',
      'boutiques.form.success.title': 'سوپاس، {name}.',
      'boutiques.form.success.wa': 'دەتەوێت ئێستا قسە بکەین؟ لە واتسئاپەوە نامەمان بۆ بنێرە',
      'boutiques.form.again': 'نامەیەکی تر بنووسە',
      'boutiques.form.wa.msg': 'سڵاو Ben.M، ئێستا دەربارەی «{topic}» نامەیەکم بۆ ناردن.',

      'boutiques.faq.eyebrow': 'پرسیارەکان',
      'boutiques.faq.title': 'وەڵامی <em>پرسیارەکانت.</em>',
      'boutiques.faq.text': 'ئەو پرسیارانەی زۆرتر دەیانبیستین، لە گەیاندنەوە تا چاودێریی چەرمەکەت. هەر پرسیارێکی ترت هەیە — تەنها لێمان بپرسە.',
      'boutiques.faq.write': 'بۆمان بنووسە',
      'boutiques.faq.wa': 'لە واتسئاپ بپرسە',
      'boutiques.faq.sample': 'بۆ نموونە',
      'boutiques.faq.t1': 'گەیاندن',
      'boutiques.faq.q1': 'گەیاندن چۆن ئەنجام دەدرێت؟',
      'boutiques.faq.a1': 'هەموو داواکارییەک بە شێوەیەکی کەسی لە ڕێگەی واتسئاپەوە لەگەڵت پشتڕاست دەکرێتەوە، و لەوێ لەسەر گەیاندن تا بەردەم دەرگاکەت و ماوەکەی ڕێک دەکەوین. گەیاندن بۆ داواکارییەکانی سەرووی ' + priceTag(FREE) + ' بێبەرامبەرە.',
      'boutiques.faq.t2': 'گەڕاندنەوە و گۆڕینەوە',
      'boutiques.faq.q2': 'دەتوانم پارچەیەک بگەڕێنمەوە یان بیگۆڕمەوە؟',
      'boutiques.faq.a2': 'بەڵێ. ئەگەر پارچەیەک وەک پێویست نەبوو، بۆمان بنووسە و پێکەوە گۆڕینەوە یان گەڕاندنەوەکەی ڕێک دەخەین. تکایە بە لەبەرنەکراوی و لە ناو پاکەتە سەرەکییەکەیدا بیهێڵەرەوە، تا وەک چۆن هاتووە ئاواش بگەڕێتەوە.',
      'boutiques.faq.t3': 'قەبارە',
      'boutiques.faq.q3': 'چۆن قەبارەی خۆم بدۆزمەوە؟',
      'boutiques.faq.a3': 'پێڵاوەکانمان بە قەبارەی ئەوروپی دروست دەکرێن. لە پەڕەی هەر بەرهەمێکدا ڕێبەری قەبارە هەیە، لەگەڵ خشتەی گۆڕین و ڕێگایەکی سادە بۆ پێوانی پێت. لە نێوان دوو قەبارەدایت؟ گەورەترەکەیان هەڵبژێرە، یان لێمان بپرسە — لە فرۆشگاکاندا خۆمان ڕاستەوخۆ یارمەتیت دەدەین.',
      'boutiques.faq.t4': 'پارەدان',
      'boutiques.faq.q4': 'چۆن پارە بدەم؟',
      'boutiques.faq.a4': 'پارەدان بە شێوەیەکی کەسی لەگەڵت ڕێک دەخرێت، کاتێک داواکارییەکەت لە واتسئاپ پشتڕاست دەکەینەوە، یان لە فرۆشگاکانماندا. نرخەکان دەتوانرێت بە دۆلاری ئەمریکی یان دیناری عێراقی پیشان بدرێن؛ نرخی دینار لە دۆلارەوە دەگۆڕدرێت و بە نزیکەیی خڕ دەکرێتەوە، تەنها وەک ڕێنمایی.',
      'boutiques.faq.t5': 'چاودێری و چاککردنەوە',
      'boutiques.faq.q5': 'چۆن چاودێریی چەرمەکەم بکەم — و دەتوانن چاکی بکەنەوە؟',
      'boutiques.faq.a5': 'ڕۆژێک لە نێوان هەر دوو جار لەبەرکردندا پشووی پێ بدە، لە گەرمای ڕاستەوخۆ دووری بخەرەوە، و هەر کاتێک تینوو دیار بوو کەمێک کرێم یان مەڵهەمی لێ بدە. <a class="c-text-link" href="maison.html#care">ڕێبەری چاودێریی چەرم</a> لە ماڵی Ben.M هەموو وردەکارییەکانی تێدایە. بۆ بریقەدارکردن و چاککردنەوەی بچووک، پارچەکەت بهێنە بۆ هەر یەکێک لە فرۆشگاکانمان و ئامۆژگاریت دەکەین.',
      'boutiques.faq.t6': 'تایبەتکردن',
      'boutiques.faq.q6': 'دەتوانم پیتە سەرەتاییەکانی ناوم لەسەری دابنێم؟',
      'boutiques.faq.a6': 'بەڵێ — جانتا و بەرهەمە بچووکەکانی چەرم دەتوانن تا سێ پیتی سەرەتایی هەڵبگرن، کە بە دەست بە فۆیلی زێڕین، زیوین یان مۆری بێڕەنگ لەسەریان دەچەسپێنرێن. تایبەتکردن ' + priceTag(FEE) + ' زیاد دەکات. لە <a class="c-text-link" href="atelier.html#configurator">ئاتێلیە</a> بە شێوەی ڕاستەوخۆ تاقیی بکەرەوە؛ چونکە هەر پارچەیەک تەنها بۆ تۆ دروست دەکرێت، تکایە پێش پشتڕاستکردنەوە پیتەکان بە وردی بپشکنە.',
      'boutiques.faq.t7': 'کاتی دیاریکراو',
      'boutiques.faq.q7': 'دەتوانم کاتێکی تایبەت دیاری بکەم؟',
      'boutiques.faq.a7': 'بێگومان. لە ئاتێلیە <a class="c-text-link" href="atelier.html#appointment">داوای کاتێک بکە</a> بۆ تاقیکردنەوە، پارچەیەکی بە داواکاری یان تایبەتکردن، و ئێمە کاتەکەت لەگەڵ پشتڕاست دەکەینەوە.',
      'boutiques.faq.t8': 'پێچانەوەی دیاری',
      'boutiques.faq.q8': 'پێچانەوەی دیاری دەکەن؟',
      'boutiques.faq.a8': 'هەموو پارچەیەک دەتوانرێت بە دەست بپێچرێتەوە، ئامادە بۆ پێشکەشکردن. تەنها لە کاتی پشتڕاستکردنەوەی داواکارییەکەتدا پێمان بڵێ، یان لە فرۆشگاکەدا داوای بکە.'
    }
  });

  /* ===========================================================================
     2. Helpers
     ======================================================================== */
  var esc = B.esc;
  var hasGsap = !!(w.gsap && w.ScrollTrigger);
  function $(s, r) { return (r || d).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function otherLang() { return B.lang === 'ckb' ? 'en' : 'ckb'; }
  function storeById(id) { for (var i = 0; i < STORES.length; i++) if (STORES[i].id === id) return STORES[i]; return null; }
  function telHref(p) { return 'tel:' + String(p || '').replace(/[^\d+]/g, ''); }
  // technical notation, Latin digits in both languages (like N°01): 36.1911° N · 44.0092° E
  function coords(s, digits) {
    return Math.abs(s.lat).toFixed(digits) + '° ' + (s.lat >= 0 ? 'N' : 'S') + ' · ' +
      Math.abs(s.lng).toFixed(digits) + '° ' + (s.lng >= 0 ? 'E' : 'W');
  }
  // WhatsApp digits → readable international number (+964 750 000 0000)
  function waDisplay(digits) {
    var s = String(digits || '').replace(/\D/g, '');
    if (/^964\d{10}$/.test(s)) return '+964 ' + s.slice(3, 6) + ' ' + s.slice(6, 9) + ' ' + s.slice(9);
    return s ? '+' + s : '';
  }
  function debounce(fn, ms) {
    var t = 0;
    return function () { clearTimeout(t); t = setTimeout(fn, ms); };
  }
  function fillIcons(root) {
    $$('[data-btq-icon]', root).forEach(function (el) {
      if (!el.firstElementChild) el.innerHTML = B.icon(el.getAttribute('data-btq-icon'));
    });
  }
  // opening hours as HTML: "Sat–Thu", "10:00–22:00" (any digits) never break at their dash, and a line
  // may only end after the separator — never "Fri 14:00–" / "22:00". In Kurdish the groups are joined
  // with «،»: a Latin "·" beside Eastern Arabic digits reads as another zero (٠).
  function hoursHTML(text) {
    return String(text || '').split(/\s*[·،]\s+/).map(function (part) {
      return esc(part).replace(/[^\s–]+–[^\s–]+/g, '<span class="btq-nowrap">$&</span>');
    }).join(B.lang === 'ckb' ? '، ' : '&nbsp;· ');
  }
  // the same opening hours everywhere → one line; otherwise none
  function sharedHours() {
    if (!STORES.length) return '';
    var first = JSON.stringify(STORES[0].hours);
    for (var i = 1; i < STORES.length; i++) if (JSON.stringify(STORES[i].hours) !== first) return '';
    return B.loc(STORES[0].hours);
  }

  /* ===========================================================================
     3. Hero — city index + doors
     ======================================================================== */
  function renderIndex() {
    var list = $('[data-btq-index]');
    if (!list) return;
    list.innerHTML = STORES.map(function (s, i) {
      return '<li class="btq-index__item"><a class="btq-index__link" href="#store-' + esc(s.id) + '">' +
        '<span class="btq-index__num" aria-hidden="true">' + pad2(i + 1) + '</span>' +
        '<span class="btq-index__city" data-sid="' + esc(s.id) + '" data-sfield="city">' + esc(B.loc(s.city)) + '</span>' +
        '<span class="btq-index__coord" aria-hidden="true"><span dir="ltr">' + coords(s, 2) + '</span></span>' +
        '<span class="btq-index__go btq-down">' + B.icon('arrow') + '</span></a></li>';
    }).join('');
  }

  // The panorama opens from a vertical seam, like boutique doors; a gold edge rides each leaf.
  function openDoors() {
    var media = $('[data-btq-doors]');
    if (!media) return;
    media.classList.add('is-open');                       // CSS stops holding it closed
    if (B.reducedMotion || !hasGsap) return;
    var zoom = $('.btq-hero__zoom', media), edges = $$('.btq-hero__edge', media);
    var half = function () { return media.offsetWidth / 2; };
    var tl = gsap.timeline({
      delay: .15,
      onComplete: function () { gsap.set(media, { clearProps: 'clipPath' }); if (edges.length) gsap.set(edges, { clearProps: 'all' }); }
    });
    tl.fromTo(media, { clipPath: 'inset(0% 50% 0% 50%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.9, ease: 'power3.inOut' }, 0);
    if (zoom) tl.fromTo(zoom, { scale: 1.22 }, { scale: 1, duration: 2.8, ease: 'expo.out', clearProps: 'transform' }, .1);
    if (edges.length === 2) {
      // physical left/right on purpose: the seam is symmetric, so nothing to mirror in RTL
      tl.fromTo(edges[0], { x: 0, opacity: 1 }, { x: function () { return -half(); }, duration: 1.9, ease: 'power3.inOut' }, 0)
        .fromTo(edges[1], { x: 0, opacity: 1 }, { x: function () { return half(); }, duration: 1.9, ease: 'power3.inOut' }, 0)
        .to(edges, { opacity: 0, duration: .6, ease: 'power1.out' }, 1.55);
    }
  }

  /* ===========================================================================
     4. Boutique cards
     ======================================================================== */
  var ALT = { erbil: 'boutiques.img.erbil', sulaymaniyah: 'boutiques.img.sulaymaniyah', duhok: 'boutiques.img.duhok' };

  function storeCard(s, i) {
    var id = 'store-' + s.id, sid = esc(s.id), alt = ALT[s.id], o = otherLang();
    var tel = telHref(s.phone);
    return '<li class="btq-stores__item">' +
      '<article class="btq-store" id="' + id + '" data-store="' + sid + '" tabindex="-1" aria-labelledby="' + id + '-title">' +
        '<figure class="btq-store__figure">' +
          '<div class="btq-store__media u-media" data-reveal="clip-up">' +
            '<img src="' + esc(s.image) + '" width="1600" height="1200" loading="lazy" decoding="async" alt="' +
              esc(alt ? B.t(alt) : B.loc(s.name)) + '"' + (alt ? ' data-i18n-attr="alt:' + alt + '"' : '') + '>' +
          '</div>' +
          '<figcaption class="c-caption btq-store__caption"><span class="c-caption__num">N°' + pad2(i + 1) + '</span>' +
            '<span data-sid="' + sid + '" data-sfield="name">' + esc(B.loc(s.name)) + '</span></figcaption>' +
        '</figure>' +
        '<div class="btq-store__body">' +
          '<p class="btq-store__coord" aria-hidden="true"><span dir="ltr">' + coords(s, 4) + '</span></p>' +
          '<h3 class="btq-store__city" id="' + id + '-title"><span data-sid="' + sid + '" data-sfield="city">' + esc(B.loc(s.city)) + '</span></h3>' +
          '<p class="btq-store__alt" lang="' + o + '" data-sid="' + sid + '" data-salt>' + esc(s.city[o] || '') + '</p>' +
          '<p class="btq-store__desc" data-sid="' + sid + '" data-sfield="description">' + esc(B.loc(s.description)) + '</p>' +
          '<dl class="btq-store__facts">' +
            '<div class="btq-fact"><dt data-i18n="boutiques.store.address">' + esc(B.t('boutiques.store.address')) + '</dt>' +
              '<dd data-sid="' + sid + '" data-sfield="address">' + esc(B.loc(s.address)) + '</dd></div>' +
            '<div class="btq-fact"><dt data-i18n="boutiques.store.hours">' + esc(B.t('boutiques.store.hours')) + '</dt>' +
              '<dd data-sid="' + sid + '" data-shours>' + hoursHTML(B.loc(s.hours)) + '</dd></div>' +
            '<div class="btq-fact"><dt data-i18n="boutiques.store.phone">' + esc(B.t('boutiques.store.phone')) + '</dt>' +
              '<dd><a class="c-text-link" href="' + esc(tel) + '" dir="ltr">' + esc(s.phone) + '</a></dd></div>' +
          '</dl>' +
          '<div class="btq-store__actions">' +
            '<a class="c-btn c-btn--ghost c-btn--sm" href="' + esc(s.mapsUrl) + '" target="_blank" rel="noopener" data-directions="' + sid + '">' +
              '<span class="c-btn__label"><span data-i18n="boutiques.store.directions">' + esc(B.t('boutiques.store.directions')) + '</span></span>' +
              '<span class="c-btn__icon">' + B.icon('arrow-up-right') + '</span>' +
              '<span class="u-visually-hidden" data-i18n="a11y.newTab">' + esc(B.t('a11y.newTab')) + '</span></a>' +
            '<a class="c-link btq-store__call" href="' + esc(tel) + '"><span data-i18n="boutiques.store.call">' + esc(B.t('boutiques.store.call')) + '</span>' + B.icon('phone') + '</a>' +
          '</div>' +
        '</div>' +
      '</article></li>';
  }

  function renderStores() {
    var list = $('[data-btq-stores]');
    if (!list) return;
    list.innerHTML = STORES.map(storeCard).join('');
  }

  // keep data-driven texts in the current language (cards, index, markers, readout)
  function localiseStores() {
    $$('[data-sid][data-sfield]').forEach(function (el) {
      var s = storeById(el.getAttribute('data-sid'));
      if (s) el.textContent = B.loc(s[el.getAttribute('data-sfield')]);
    });
    $$('[data-sid][data-shours]').forEach(function (el) {
      var s = storeById(el.getAttribute('data-sid'));
      if (s) el.innerHTML = hoursHTML(B.loc(s.hours));
    });
    var o = otherLang();
    $$('[data-sid][data-salt]').forEach(function (el) {
      var s = storeById(el.getAttribute('data-sid'));
      if (!s) return;
      el.setAttribute('lang', o);
      el.textContent = s.city[o] || '';
    });
    updateReadout();
  }

  /* ===========================================================================
     5. Dotted map
     ======================================================================== */
  var SVGNS = 'http://www.w3.org/2000/svg';
  var KX = Math.cos(36.2 * Math.PI / 180);           // equirectangular, corrected at the region's latitude
  var map = { el: null, svg: null, top: null, veil: null, w: 0, h: 0, fit: null, revealed: false, rings: null };

  // projection fitted so the three cities sit comfortably inside the frame, whatever its aspect
  function fitMap(W, H) {
    var xs = STORES.map(function (s) { return s.lng * KX; }), ys = STORES.map(function (s) { return -s.lat; });
    var minX = Math.min.apply(null, xs), maxX = Math.max.apply(null, xs);
    var minY = Math.min.apply(null, ys), maxY = Math.max.apply(null, ys);
    var narrow = W < 560;
    var padX = narrow ? .6 : .74, padY = narrow ? .62 : .66;   // breathing room, in degrees
    var k = Math.min(W / (maxX - minX + 2 * padX), H / (maxY - minY + 2 * padY));
    var cx = (minX + maxX) / 2, cy = (minY + maxY) / 2 + .05;
    return {
      W: W, H: H, k: k,
      x: function (lng) { return W / 2 + (lng * KX - cx) * k; },
      y: function (lat) { return H / 2 + (-lat - cy) * k; },
      lng: function (x) { return ((x - W / 2) / k + cx) / KX; },
      lat: function (y) { return -((y - H / 2) / k + cy); }
    };
  }

  // tiny deterministic value noise (in geographic space, so the texture is stable at every size)
  function hash2(i, j) { var h = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return h - Math.floor(h); }
  function vnoise(x, y) {
    var i = Math.floor(x), j = Math.floor(y), fx = x - i, fy = y - j;
    var u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
    var a = hash2(i, j), b = hash2(i + 1, j), c = hash2(i, j + 1), e = hash2(i + 1, j + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + e) * u * v;
  }
  function relief(lng, lat) { return vnoise(lng * 1.6, lat * 1.6) * .6 + vnoise(lng * 3.7 + 7.1, lat * 3.7 + 2.3) * .4; }
  function dot(x, y, r) {
    return 'M' + (x - r).toFixed(1) + ' ' + y.toFixed(1) + 'a' + r.toFixed(2) + ' ' + r.toFixed(2) + ' 0 1 0 ' + (2 * r).toFixed(2) +
      ' 0a' + r.toFixed(2) + ' ' + r.toFixed(2) + ' 0 1 0 ' + (-2 * r).toFixed(2) + ' 0';
  }
  function el(name, attrs) {
    var n = d.createElementNS(SVGNS, name);
    for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) n.setAttribute(k, attrs[k]);
    return n;
  }

  function buildMap() {
    if (!map.el || !map.svg) return;
    var W = Math.round(map.el.clientWidth), H = Math.round(map.el.clientHeight);
    if (W < 40 || H < 40 || (W === map.w && H === map.h)) return;
    map.w = W; map.h = H;
    var f = map.fit = fitMap(W, H);
    var sp = W < 520 ? 8.5 : W < 900 ? 10 : 11.5;       // dot pitch (px)
    var rowH = sp * .866;                                // hexagonal rows
    var tiers = 7, field = [], glow = {};
    for (var t = 0; t < tiers; t++) field.push('');
    var pts = STORES.map(function (s) { glow[s.id] = ['', '', '']; return { id: s.id, x: f.x(s.lng), y: f.y(s.lat) }; });
    var R = sp * 6.5;                                    // light pool around each city

    var cols = Math.ceil(W / sp) + 1, rows = Math.ceil(H / rowH) + 1;
    var ox = (W - (cols - 1) * sp) / 2, oy = (H - (rows - 1) * rowH) / 2;
    for (var r = 0; r < rows; r++) {
      var y = oy + r * rowH;
      if (y < 3 || y > H - 3) continue;
      for (var c = 0; c < cols; c++) {
        var x = ox + c * sp + (r % 2 ? sp / 2 : 0);
        if (x < 3 || x > W - 3) continue;
        // soft elliptical vignette — the only silhouette: an abstract field, never a border or a coastline
        var dx = (x / W - .5) * 2, dy = (y / H - .5) * 2;
        var dist = Math.sqrt(dx * dx * .9 + dy * dy * 1.1);
        var vig = clamp((1.08 - dist) / .7, 0, 1);
        if (vig < .04) continue;
        vig = vig * vig * (3 - 2 * vig);
        // texture: noise + a slow rise toward the north-east (the mountains) modulate size and light only
        var lng = f.lng(x), lat = f.lat(y);
        var n = relief(lng, lat);
        var ne = clamp(((lng - 42.4) / 4.2) * .55 + ((lat - 34.8) / 2.6) * .45, 0, 1);
        var o = vig * (.34 + .66 * Math.pow(n, 1.2) * (.55 + .45 * ne));
        var tier = clamp(Math.round(o * (tiers - 1)), 1, tiers - 1);
        var rad = sp * (.08 + .075 * n * (.6 + .4 * vig));
        field[tier] += dot(x, y, rad);
        // gold light pools
        for (var p = 0; p < pts.length; p++) {
          var gx = x - pts[p].x, gy = y - pts[p].y, gd = Math.sqrt(gx * gx + gy * gy);
          if (gd < R) {
            var g = 1 - gd / R;
            glow[pts[p].id][g > .66 ? 0 : g > .33 ? 1 : 2] += dot(x, y, rad + sp * .05 * g);
          }
        }
      }
    }

    // two layers: the dot field + graticule (painted once) and a light top layer (route, light pools,
    // range rings) that animates without re-rasterising thousands of dots
    [map.svg, map.top].forEach(function (s) {
      while (s.firstChild) s.removeChild(s.firstChild);
      s.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      s.setAttribute('width', W);
      s.setAttribute('height', H);
    });

    var layer = el('g', { class: 'btq-map__layer' });
    // graticule: whole degrees, labelled like a chart
    var grid = el('g', { class: 'btq-map__grid' });
    // labels keep clear of the corners (readout top-left, compass top-right)
    var lat0 = Math.ceil(f.lat(H)), lat1 = Math.floor(f.lat(0));
    for (var la = lat0; la <= lat1; la++) {
      var gy2 = f.y(la);
      grid.appendChild(el('line', { x1: 0, y1: gy2.toFixed(1), x2: W, y2: gy2.toFixed(1) }));
      if (gy2 < 64 || gy2 > H - 34) continue;
      var ty = el('text', { x: 12, y: (gy2 - 7).toFixed(1) });
      ty.textContent = la + '°N';
      grid.appendChild(ty);
    }
    var lng0 = Math.ceil(f.lng(0)), lng1 = Math.floor(f.lng(W));
    for (var lo = lng0; lo <= lng1; lo++) {
      var gx2 = f.x(lo);
      grid.appendChild(el('line', { x1: gx2.toFixed(1), y1: 0, x2: gx2.toFixed(1), y2: H }));
      if (gx2 < 40 || gx2 > W - 48) continue;
      var tx = el('text', { x: (gx2 + 7).toFixed(1), y: H - 14 });
      tx.textContent = lo + '°E';
      grid.appendChild(tx);
    }
    layer.appendChild(grid);

    var fieldG = el('g', { class: 'btq-map__field' });
    field.forEach(function (path, i) {
      if (path) fieldG.appendChild(el('path', { d: path, 'fill-opacity': (i / (tiers - 1) * .82 + .1).toFixed(3) }));
    });
    layer.appendChild(fieldG);
    map.svg.appendChild(layer);

    var top = el('g', { class: 'btq-map__layer' });
    // route — north-west to south-east, gently arched
    var byLng = pts.slice().sort(function (a, b) { return a.x - b.x; });
    var routeG = el('g', { class: 'btq-map__route' });
    for (var q = 0; q < byLng.length - 1; q++) {
      var A = byLng[q], Bp = byLng[q + 1];
      var mx = (A.x + Bp.x) / 2, my = (A.y + Bp.y) / 2, ddx = Bp.x - A.x, ddy = Bp.y - A.y;
      var bend = (q % 2 ? -1 : 1) * .16;
      routeG.appendChild(el('path', { d: 'M' + A.x.toFixed(1) + ' ' + A.y.toFixed(1) + 'Q' + (mx - ddy * bend).toFixed(1) + ' ' +
        (my + ddx * bend).toFixed(1) + ' ' + Bp.x.toFixed(1) + ' ' + Bp.y.toFixed(1), pathLength: 1 }));
    }
    top.appendChild(routeG);

    STORES.forEach(function (s) {
      var gG = el('g', { class: 'btq-map__glow', 'data-glow': s.id });
      glow[s.id].forEach(function (path, i) { if (path) gG.appendChild(el('path', { d: path, 'fill-opacity': ['.95', '.6', '.3'][i] })); });
      top.appendChild(gG);
    });
    // range rings: glide to whichever boutique is active
    var rings = el('g', { class: 'btq-map__rings' });
    rings.appendChild(el('circle', { cx: 0, cy: 0, r: (sp * 5.2).toFixed(1) }));
    rings.appendChild(el('circle', { cx: 0, cy: 0, r: (sp * 10.4).toFixed(1) }));
    top.appendChild(rings);
    map.top.appendChild(top);
    map.rings = rings;

    // the veil's iris opens from Erbil, the capital (first boutique)
    var origin = pts[0] || { x: W / 2, y: H / 2 };
    if (map.veil) { map.veil.style.setProperty('--vx', origin.x.toFixed(1) + 'px'); map.veil.style.setProperty('--vy', origin.y.toFixed(1) + 'px'); }
    placeMarkers();
    if (!map.revealed && !B.reducedMotion && hasGsap) gsap.set($$('path', routeG), { strokeDasharray: 1, strokeDashoffset: 1 });
    setActive(true);
  }

  function renderMarkers() {
    var host = $('[data-btq-markers]');
    if (!host) return;
    host.innerHTML = STORES.map(function (s, i) {
      return '<a class="btq-marker" href="#store-' + esc(s.id) + '" data-store="' + esc(s.id) + '">' +
        '<span class="btq-marker__pin" aria-hidden="true"><span class="btq-marker__ring"></span><span class="btq-marker__ring btq-marker__ring--late"></span><span class="btq-marker__dot"></span></span>' +
        '<span class="btq-marker__label"><span class="btq-marker__num" aria-hidden="true">N°' + pad2(i + 1) + '</span>' +
        '<span class="btq-marker__city" data-sid="' + esc(s.id) + '" data-sfield="city">' + esc(B.loc(s.city)) + '</span></span></a>';
    }).join('');
  }

  // percentages of the frame; physical left/top on purpose — the map keeps its geography in RTL
  function placeMarkers() {
    var f = map.fit;
    if (!f) return;
    $$('.btq-marker', map.el).forEach(function (m) {
      var s = storeById(m.getAttribute('data-store'));
      if (!s) return;
      var x = f.x(s.lng) / f.W * 100, y = f.y(s.lat) / f.H * 100;
      m.style.left = x.toFixed(3) + '%';
      m.style.top = y.toFixed(3) + '%';
      m.setAttribute('data-side', x > 62 ? 'left' : 'right');
    });
  }

  // sonar reveal: one CSS variable widens the veil's iris (a single gradient repaint per frame)
  function revealMap() {
    if (map.revealed) return;
    map.revealed = true;
    if (B.reducedMotion || !hasGsap) return;
    var veil = map.veil, tl = gsap.timeline();
    if (veil) tl.fromTo(veil, { '--vr': 0 }, { '--vr': Math.hypot(map.w, map.h), duration: 2, ease: 'power2.inOut',
      onComplete: function () { veil.classList.remove('is-on'); } }, 0);
    var route = $$('.btq-map__route path', map.el);
    if (route.length) tl.to(route, { strokeDashoffset: 0, duration: 1.3, ease: 'power2.inOut', stagger: .2 }, .55);
    var pins = $$('.btq-marker__pin', map.el), labels = $$('.btq-marker__label', map.el);
    if (pins.length) tl.fromTo(pins, { scale: 0 }, { scale: 1, duration: 1.1, ease: 'expo.out', stagger: .14, clearProps: 'transform' }, .4);
    if (labels.length) tl.fromTo(labels, { opacity: 0 }, { opacity: 1, duration: .9, ease: 'power2.out', stagger: .14, clearProps: 'opacity' }, .65);
  }

  function initMap() {
    map.el = $('[data-btq-map]');
    map.svg = $('[data-btq-svg]');
    map.top = $('[data-btq-svg-top]');
    map.veil = $('[data-btq-veil]');
    if (!map.el || !map.svg || !map.top || !STORES.length) return;
    renderMarkers();
    buildMap();
    if (!B.reducedMotion && hasGsap) {
      if (map.veil) { map.veil.style.setProperty('--vr', '0'); map.veil.classList.add('is-on'); }
      gsap.set($$('.btq-marker__label', map.el), { opacity: 0 });
      gsap.set($$('.btq-marker__pin', map.el), { scale: 0 });
      // end 'max': still fires when the page opens below the map (e.g. boutiques.html#contact)
      ScrollTrigger.create({ trigger: map.el, start: 'top 80%', end: 'max', once: true, onEnter: revealMap });
    } else {
      map.revealed = true;
    }
    var rebuild = debounce(function () { buildMap(); }, 160);
    if (w.ResizeObserver) new ResizeObserver(rebuild).observe(map.el);
    else w.addEventListener('resize', rebuild);
  }

  /* ===========================================================================
     6. Linking — markers ⇄ cards
     ======================================================================== */
  var link = { hover: null, focus: null, scroll: null, current: undefined };

  function setActive(force) {
    var id = link.hover || link.focus || link.scroll || null;
    var intent = !!(link.hover || link.focus);           // hover/focus dims the other cards; scroll alone does not
    var loc = $('[data-btq-locator]');
    if (loc) { loc.classList.toggle('has-active', !!id); loc.classList.toggle('has-intent', intent); }
    if (id === link.current && force !== true) return;
    link.current = id;
    $$('.btq-marker, .btq-store').forEach(function (n) { n.classList.toggle('is-active', n.getAttribute('data-store') === id); });
    $$('.btq-map__glow').forEach(function (g) {
      // SVG: classList works, but setAttribute keeps very old engines happy
      g.setAttribute('class', 'btq-map__glow' + (g.getAttribute('data-glow') === id ? ' is-active' : ''));
    });
    var s = id ? storeById(id) : null, rings = map.rings;
    if (rings && map.fit) {
      if (s) {
        var wasOn = /\bis-on\b/.test(rings.getAttribute('class') || '');
        if (!wasOn) rings.style.transition = 'none';     // appear in place; glide only between boutiques
        rings.style.transform = 'translate(' + map.fit.x(s.lng).toFixed(1) + 'px,' + map.fit.y(s.lat).toFixed(1) + 'px)';
        if (!wasOn) { rings.getBoundingClientRect(); rings.style.transition = ''; }
      }
      rings.setAttribute('class', 'btq-map__rings' + (s ? ' is-on' : ''));
    }
    updateReadout();
  }

  function updateReadout() {
    var out = $('[data-btq-readout]');
    if (!out) return;
    var s = link.current ? storeById(link.current) : null;
    if (s) {
      var i = STORES.indexOf(s);
      out.innerHTML = '<span class="btq-map__readout-num">N°' + pad2(i + 1) + '</span><span>' + esc(B.loc(s.city)) + '</span>' +
        '<span class="btq-map__readout-coord" dir="ltr">' + coords(s, 4) + '</span>';
    } else {
      out.innerHTML = '<span>' + STORES.map(function (x) { return esc(B.loc(x.city)); }).join(' · ') + '</span>';
    }
  }

  function initLinking() {
    var loc = $('[data-btq-locator]');
    if (!loc) return;
    var storeOf = function (t) { var n = t && t.closest ? t.closest('[data-store]') : null; return n ? n.getAttribute('data-store') : null; };
    loc.addEventListener('pointerover', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      var id = storeOf(e.target);
      if (id !== link.hover) { link.hover = id; setActive(); }
    });
    loc.addEventListener('pointerleave', function () { if (link.hover) { link.hover = null; setActive(); } });
    loc.addEventListener('focusin', function (e) { link.focus = storeOf(e.target); setActive(); });
    loc.addEventListener('focusout', function (e) {
      if (!e.relatedTarget || !loc.contains(e.relatedTarget)) { link.focus = null; setActive(); }
    });
    // scroll position: the card crossing the middle of the viewport lights its marker
    if (hasGsap) {
      $$('.btq-store', loc).forEach(function (card) {
        var id = card.getAttribute('data-store');
        ScrollTrigger.create({
          trigger: card, start: 'top 58%', end: 'bottom 42%',
          onToggle: function (self) {
            if (self.isActive) link.scroll = id;
            else if (link.scroll === id) link.scroll = null;
            setActive();
          }
        });
      });
    }
  }

  /* ===========================================================================
     7. Client services
     ======================================================================== */
  // every WhatsApp link opens a chat in the page language; the one after a sent message names its subject
  function updateWhatsApp() {
    var hello = B.whatsappLink(B.t('wa.hello'));
    $$('[data-btq-wa]').forEach(function (a) {
      var key = a.getAttribute('data-btq-wa-topic');
      a.href = key ? B.whatsappLink(B.t('boutiques.form.wa.msg', { topic: B.t(key) })) : hello;
    });
  }

  function initContact() {
    var values = {
      whatsapp: CONFIG.whatsapp ? waDisplay(CONFIG.whatsapp) : '',
      phone: CONFIG.phone || '',
      email: CONFIG.email || ''
    };
    $$('[data-btq-config]').forEach(function (n) {
      var v = values[n.getAttribute('data-btq-config')];
      var item = n.closest('li');
      if (!v) { if (item) item.hidden = true; return; }
      n.textContent = v;
    });
    var tel = $('[data-btq-tel]'), mail = $('[data-btq-mail]');
    if (tel) tel.href = telHref(CONFIG.phone);
    if (mail) mail.href = 'mailto:' + (CONFIG.email || '');
    updateWhatsApp();
    updateHours();

    var form = $('[data-btq-form]');
    if (!form) return;
    var phone = $('[data-btq-phone]', form), optional = $('[data-btq-optional]', form);
    var success = form.parentNode.querySelector('[data-form-success]');

    // a reply by phone or WhatsApp needs a number
    function syncReply() {
      var picked = $('[data-btq-reply]:checked', form);
      var need = !!picked && picked.value !== 'email';
      if (phone) {
        phone.required = need;
        if (form.__benmTried && phone.closest('.is-invalid, .is-valid')) phone.dispatchEvent(new Event('input', { bubbles: true }));
      }
      if (optional) optional.hidden = need;
    }
    $$('[data-btq-reply]', form).forEach(function (r) { r.addEventListener('change', syncReply); });
    syncReply();

    form.addEventListener('benm:submit', function (e) {
      var data = (e.detail && e.detail.data) || {};
      var first = String(data.name || '').trim().split(/\s+/)[0] || '';
      var title = success && $('[data-btq-success-title]', success);
      if (title) {
        if (first) {
          title.setAttribute('data-i18n', 'boutiques.form.success.title');
          title.setAttribute('data-i18n-vars', JSON.stringify({ name: first }));
        } else {
          title.setAttribute('data-i18n', 'form.success.title');
          title.removeAttribute('data-i18n-vars');
        }
        B.i18n.apply(title.parentNode);
      }
      // the follow-up on WhatsApp mentions the chosen subject
      var topic = $('[data-btq-topic]', form), opt = topic && topic.options[topic.selectedIndex];
      var wa = success && $('[data-btq-wa]', success);
      if (wa) {
        if (opt && opt.value && opt.getAttribute('data-i18n')) wa.setAttribute('data-btq-wa-topic', opt.getAttribute('data-i18n'));
        else wa.removeAttribute('data-btq-wa-topic');
        updateWhatsApp();
      }
      // the card just lost the form's height: bring the thank-you into view
      var card = form.closest('.btq-letter') || success;
      setTimeout(function () {
        var head = d.getElementById('site-header'), h = head ? head.offsetHeight : 0, top = card.getBoundingClientRect().top;
        if (top < h + 16 || top > w.innerHeight * .6) B.scrollTo(card, { offset: -(h + 32) });
      }, 60);
    });

    var again = success && $('[data-btq-again]', success);
    if (again) again.addEventListener('click', function () {
      form.reset();
      form.__benmTried = false;
      $$('.is-invalid, .is-valid', form).forEach(function (n) { n.classList.remove('is-invalid', 'is-valid'); });
      $$('[aria-invalid]', form).forEach(function (n) { n.removeAttribute('aria-invalid'); });
      $$('.c-field__msg', form).forEach(function (m) { m.textContent = ''; m.removeAttribute('data-i18n'); m.removeAttribute('data-i18n-vars'); });
      syncReply();
      success.hidden = true;
      form.hidden = false;
      var first = $('#btq-name', form);
      if (first) first.focus();
      B.refresh();
    });
  }

  function updateHours() {
    var h = $('[data-btq-hours]');
    if (!h) return;
    var line = sharedHours();
    var box = h.closest('.btq-hours');
    if (box) box.hidden = !line;
    h.innerHTML = hoursHTML(line);
  }

  /* ===========================================================================
     8. FAQ deep links + arriving with a #hash
     ======================================================================== */
  // a #faq-<topic> target: open that question at once (no collapse animation above it moving the target)
  function openFaqItemNow(item) {
    var acc = item && item.classList.contains('c-accordion__item') ? item.closest('.c-accordion') : null;
    if (!acc) return;
    var single = acc.getAttribute('data-accordion') === 'single';
    var panels = $$('.c-accordion__panel', acc);
    panels.forEach(function (p) { p.style.transition = 'none'; });
    $$('.c-accordion__item', acc).forEach(function (o) {
      var on = o === item || (!single && o.classList.contains('is-open'));
      o.classList.toggle('is-open', on);
      var b = $('.c-accordion__trigger', o);
      if (b) b.setAttribute('aria-expanded', String(on));
    });
    void acc.offsetHeight;                          // commit the open state before transitions return
    panels.forEach(function (p) { p.style.transition = ''; });
  }
  function hashTarget() {
    var id = '';
    try { id = decodeURIComponent((w.location.hash || '').slice(1)); } catch (e) { return null; }
    if (!id) return null;
    var t = d.getElementById(id);
    return t && t.closest('#main') ? t : null;
  }
  // One landing line per target: its scroll-margin (boutiques.css). Chrome may re-apply the native
  // fragment scroll (which honours scroll-margin) until `load`, so our own jumps must use the same value.
  function landing(t) {
    var m = parseFloat(w.getComputedStyle(t).scrollMarginTop) || 0;
    if (!m) { var head = d.getElementById('site-header'); m = head ? head.offsetHeight : 0; }
    return -m;
  }
  // A target inside a rising block (the FAQ list: data-reveal="up", 46 px of travel) would be measured
  // mid-rise — by our jump or by Chrome's native fragment re-scroll — and land off by that travel.
  // On arrival (B.page runs before main.js scans reveals) such blocks are shown in place instead:
  // is-revealed makes main.js skip them and main.css stop hiding them.
  function settleReveals(t) {
    for (var n = t; n && n.id !== 'main'; n = n.parentElement) {
      if (n.hasAttribute('data-reveal')) n.classList.add('is-revealed');
    }
  }
  // document y of the layout box — the offsetTop chain ignores transforms (later hash changes)
  function layoutY(el) { var y = 0; for (var n = el; n; n = n.offsetParent) y += n.offsetTop; return y; }
  function arriveAtHash() {
    var t = hashTarget();
    if (!t) return;
    settleReveals(t);
    openFaqItemNow(t);
    // the cards were just rendered: let Lenis re-measure, or the jump is clamped to the old page height
    if (B.lenis && typeof B.lenis.resize === 'function') { try { B.lenis.resize(); } catch (e) { /* older Lenis */ } }
    B.scrollTo(t, { immediate: true, offset: landing(t) });
  }
  w.addEventListener('hashchange', function () {
    var t = hashTarget();
    // open at once (a collapsing answer above would move the target during the scroll), then glide there
    if (t && t.classList.contains('c-accordion__item')) { openFaqItemNow(t); B.scrollTo(layoutY(t) + landing(t), { onComplete: B.refresh }); }
  });
  // hero index + map markers → the card, with the card's own breathing room under the header
  // (runs before main.js's document-level anchor handler, which then skips the prevented click)
  function initStoreJumps() {
    [$('[data-btq-index]'), $('[data-btq-markers]')].forEach(function (host) {
      if (!host) return;
      host.addEventListener('click', function (e) {
        var a = e.target.closest ? e.target.closest('a[href^="#store-"]') : null;
        if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        var card = d.getElementById(a.getAttribute('href').slice(1));
        if (!card) return;
        e.preventDefault();
        B.scrollTo(card, { offset: landing(card) });
        try { card.focus({ preventScroll: true }); } catch (err) { card.focus(); }
      });
    });
  }

  /* ===========================================================================
     9. Boot + language changes
     ======================================================================== */
  B.page(function () {
    renderIndex();
    renderStores();
    fillIcons(d);
    initMap();
    initLinking();
    initStoreJumps();
    initContact();
    arriveAtHash();
  });

  // (the #hash jump stays in B.page: fonts are loaded and nothing is transformed by reveals yet)
  B.ready(openDoors);

  B.on('langchange', function () {
    localiseStores();
    updateWhatsApp();
    updateHours();
    B.refresh();
  });
})(window.BENM, window, document);
