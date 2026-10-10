/* =============================================================================
   Ben.M — Atelier                                        assets/js/pages/atelier.js
   -----------------------------------------------------------------------------
   Personalisation & made to order (atelier.html).
     1  Strings (English + Central Kurdish)
     2  Helpers & data
     3  State — URL parameters → the first configuration
     4  Configurator — steps (items, leathers, foils, lettering, initials)
     5  Configurator — live preview (BENM.Leather) + leather swatches (snapshots)
     6  Configurator — summary, WhatsApp request, add to bag
     7  Configurator — boot & events
     8  Hero — the foil sheen
     9  Made to order — the stitched gold thread (scroll-scrubbed, RTL aware)
    10  Appointment — form, date rule, success panel
    11  Contact methods · FAQ fee · closing band · icons
    12  Language & currency · overlays
   URL: ?item=<product id> ?leather=<leather id> ?initials=XX ?foil=gold|silver|blind ?style=serif|roman
   WebGL: one live tag (the stage) + the shared snapshot context (swatches).
   ========================================================================== */
(function (w, d, B) {
  'use strict';
  if (!B) return;

  /* ===========================================================================
     1. Strings
     ======================================================================== */
  B.i18n.add({
    en: {
      'atelier.meta.title': 'Atelier — personalisation & made to order — Ben.M',
      'atelier.meta.description': 'Personalise a Ben.M leather piece with your initials in gold, silver or blind deboss — or book a made-to-order appointment with the atelier.',

      'atelier.hero.eyebrow': 'Personalisation & made to order',
      'atelier.hero.title': 'Make it<br><em>yours</em>.',
      'atelier.hero.lead': 'Your initials, pressed by hand into the leather you chose — in gold, in silver, or blind, so that only the light can read them.',
      'atelier.hero.cta': 'Begin your piece',
      'atelier.hero.note1': 'Up to three initials',
      'atelier.hero.note2': 'Gold, silver or blind',
      'atelier.hero.note3': 'Pressed by hand',
      'atelier.hero.alt': 'A craftsman stamping a design into leather with a mallet',
      'atelier.hero.caption': 'Letter by letter',

      'atelier.config.eyebrow': 'Personalisation',
      'atelier.config.title': 'Your letters, <em>pressed by hand.</em>',
      'atelier.config.text': 'Choose the piece, the leather and the foil, then type up to three initials. The preview follows every choice — in the atelier, the same letters are pressed into the leather by hand.',

      'atelier.stage.label': 'Live preview',
      'atelier.stage.hint': 'Move across the leather to catch the light',
      'atelier.stage.empty': 'Type your initials',
      'atelier.stage.spec': '{piece} · {leather} · {foil}',
      'atelier.stage.aria': 'Preview of the {piece} in {leather}: {initials}, {foil}, {style}',

      'atelier.step.item': 'The piece',
      'atelier.step.leather': 'The leather',
      'atelier.step.foil': 'The foil',
      'atelier.step.initials': 'Your initials',
      'atelier.step.style': 'The lettering',

      'atelier.leather.available': 'Made in {n} of our {total} leathers',
      'atelier.leather.unavailable': '{name} — not made in this piece',
      'atelier.leather.switched': 'The {piece} is not made in {from}, so {to} was chosen.',
      'atelier.grain.pebble': 'Pebble grain',
      'atelier.grain.smooth': 'Smooth calf',
      'atelier.grain.suede': 'Suede',

      'atelier.foil.gold': 'Gold foil',
      'atelier.foil.gold.text': 'Warm and bright — the house foil.',
      'atelier.foil.silver': 'Silver foil',
      'atelier.foil.silver.text': 'Cool and quiet, like moonlight.',
      'atelier.foil.blind': 'Blind deboss',
      'atelier.foil.blind.text': 'No foil — only the impression.',

      'atelier.initials.label': 'Initials',
      'atelier.initials.hint': 'Up to 3 Latin letters, digits or a full stop',
      'atelier.initials.count': '{n} / {max}',
      'atelier.initials.none': 'None yet',
      'atelier.initials.error.chars': 'Only the Latin letters A–Z, the digits 0–9 and a full stop can be pressed.',
      'atelier.initials.error.long': 'Three characters at most — the rest was left out.',
      'atelier.initials.error.empty': 'Add at least one letter or digit.',

      'atelier.style.serif': 'Classic serif',
      'atelier.style.serif.text': 'Italic, like a written hand.',
      'atelier.style.roman': 'Roman capitals',
      'atelier.style.roman.text': 'Upright and spaced, as if cut in stone.',

      'atelier.summary.title': 'Your piece',
      'atelier.summary.piece': 'Piece',
      'atelier.summary.leather': 'Leather',
      'atelier.summary.foil': 'Foil',
      'atelier.summary.initials': 'Initials',
      'atelier.summary.style': 'Lettering',
      'atelier.summary.fee': 'Personalisation',
      'atelier.summary.total': 'Total',
      'atelier.summary.wa': 'Request via WhatsApp',
      'atelier.summary.note': 'We confirm every personalisation with you before the letters are pressed.',
      'atelier.summary.inPerson': 'Prefer to choose in person?',
      'atelier.cart.summary': 'Initials {initials} · {foil} · {style}',
      'atelier.wa.message': 'Hello Ben.M, I would like to personalise a piece:\n• {piece}\n• Leather: {leather}\n• {foil}\n• Initials: {initials} ({style})\n• {price} + personalisation {fee} = {total}\nThank you.',

      'atelier.mto.eyebrow': 'Made to order',
      'atelier.mto.title': 'From a conversation <em>to your door.</em>',
      'atelier.mto.text': 'For shoes made to your measure, a bag drawn around what you carry, or a piece that does not exist yet. Five unhurried steps — and you are part of every one.',
      'atelier.mto.note': 'Timings depend on the piece and the leather; we agree them with you at the first conversation.',
      'atelier.mto.cta': 'Book a consultation',
      'atelier.mto.1.title': 'Consultation',
      'atelier.mto.1.text': 'We sit down together — in a boutique or on a call — and talk about what you want to wear, carry and keep.',
      'atelier.mto.1.alt': 'A master craftsman at his workbench in a leather workshop',
      'atelier.mto.2.title': 'Measure',
      'atelier.mto.2.text': 'Feet are measured and traced; a bag is drawn around what it must hold. Nothing is left to guesswork.',
      'atelier.mto.2.alt': 'An artisan’s hands marking a pattern onto a hide before cutting',
      'atelier.mto.3.title': 'Select',
      'atelier.mto.3.text': 'You choose the leather from the hides themselves, then the thread, the lining and the finish.',
      'atelier.mto.3.alt': 'Stacked hides of brown and tan leather, chosen by hand',
      'atelier.mto.4.title': 'Craft',
      'atelier.mto.4.text': 'Cut, stitched and finished by hand, at the pace leather asks for. We keep you posted along the way.',
      'atelier.mto.4.alt': 'Leatherworking tools laid out on a worn wooden bench',
      'atelier.mto.5.title': 'Deliver',
      'atelier.mto.5.text': 'Your piece is fitted and handed over in person, or sent to you wrapped — with its care notes.',
      'atelier.mto.5.alt': 'A cognac leather wallet and key fob on a walnut table',

      'atelier.appt.eyebrow': 'Appointments',
      'atelier.appt.title': 'Sit down <em>with the atelier.</em>',
      'atelier.appt.text': 'Tell us what you have in mind and when suits you. An advisor will reply to confirm a time at the boutique of your choice.',
      'atelier.appt.alt': 'Amber-lit glass cabinets displaying leather goods in a boutique',
      'atelier.appt.caption': 'In the boutique',
      'atelier.appt.contact': 'Prefer to write or call?',
      'atelier.appt.whatsapp': 'WhatsApp',
      'atelier.appt.wa': 'Hello Ben.M, I would like to book an appointment:\n• {service}\n• {city} — {date}\n• {name} · {phone}{message}\nThank you.',
      'atelier.appt.mailSubject': 'Appointment request — {service}',
      'atelier.form.service': 'Service',
      'atelier.form.service.personalisation': 'Personalisation',
      'atelier.form.service.mtoShoes': 'Made-to-order shoes',
      'atelier.form.service.mtoBag': 'Made-to-order bag',
      'atelier.form.service.care': 'Care & repair',
      'atelier.form.message': 'Message — optional',
      'atelier.form.error.date': 'Please choose today or a later date.',
      'atelier.form.submit': 'Request an appointment',
      'atelier.form.note': 'Nothing is charged. We reply personally to confirm.',
      'atelier.success.title': 'Thank you, {name}.',
      'atelier.success.text': 'Your request — {service} in {city}, {date} — is ready. To confirm it sooner, send it to us directly and an advisor will reply with a time.',
      'atelier.success.wa': 'Send on WhatsApp',
      'atelier.success.email': 'Send by email',
      'atelier.success.again': 'Make another request',

      'atelier.faq.eyebrow': 'Questions',
      'atelier.faq.title': 'Before <em>you begin.</em>',
      'atelier.faq.text': 'The questions we hear most about personalisation. For anything else, ask us — we answer personally.',
      'atelier.faq.more': 'More in client services',
      'atelier.faq.1.q': 'Which pieces can be personalised?',
      'atelier.faq.1.a': 'Our bags and small leather goods — wallets, card holders, belts and travel pieces. Look for “Personalise it” on a product page, or begin right here.',
      'atelier.faq.2.q': 'What can be pressed?',
      'atelier.faq.2.a': 'Up to three characters: the Latin letters A–Z, the digits 0–9 and a full stop, in classic serif or Roman capitals. If you have something else in mind, tell us at an appointment.',
      'atelier.faq.3.q': 'What is the difference between foil and a blind deboss?',
      'atelier.faq.3.a': 'Foil lays a fine film of gold or silver into the pressed letters. A blind deboss uses no foil at all — only the impression in the leather, which deepens quietly as the leather ages.',
      'atelier.faq.4.q': 'How much does it cost?',
      'atelier.faq.4.a': 'Personalisation adds {fee} to the price of the piece, whichever foil and lettering you choose.',
      'atelier.faq.5.q': 'Can I personalise a gift?',
      'atelier.faq.5.a': 'Of course. Use the initials of the person it is for, and tell us it is a gift when we confirm your order — it will be wrapped by hand, ready to give.',

      'atelier.next.label': 'Continue your visit',
      'atelier.next.shop.eyebrow': 'The collection',
      'atelier.next.shop.title': 'Choose your <em>piece.</em>',
      'atelier.next.shop.text': 'Bags, belts and small leather goods, ready for your initials.',
      'atelier.next.shop.cta': 'Shop the collection',
      'atelier.next.visit.eyebrow': 'The boutiques',
      'atelier.next.visit.title': 'Visit <em>the house.</em>',
      'atelier.next.visit.text': '{cities} — see and touch the leathers in person.',
      'atelier.next.visit.cta': 'Find a boutique',
      'atelier.and': 'and'
    },
    ckb: {
      'atelier.meta.title': 'ئاتێلیە — تایبەتکردن و دروستکردن بە داواکاری — Ben.M',
      'atelier.meta.description': 'پارچە چەرمییەکەت لە Ben.M بە پیتە سەرەتاییەکانی ناوت تایبەت بکە، بە فۆیلی زێڕین، زیوی یان مۆری بێڕەنگ — یان کاتێک بۆ دروستکردن بە داواکاری لەگەڵ ئاتێلیە دیاری بکە.',

      'atelier.hero.eyebrow': 'تایبەتکردن و دروستکردن بە داواکاری',
      'atelier.hero.title': 'بیکە بە<br><em>هی خۆت</em>.',
      'atelier.hero.lead': 'پیتە سەرەتاییەکانی ناوت، بە دەست لەسەر ئەو چەرمەی هەڵتبژاردووە مۆر دەکرێن — بە زێڕین، بە زیوی، یان بێڕەنگ، بە جۆرێک کە تەنها ڕووناکی بتوانێت بیانخوێنێتەوە.',
      'atelier.hero.cta': 'دەست بە پارچەکەت بکە',
      'atelier.hero.note1': 'تا سێ پیت',
      'atelier.hero.note2': 'زێڕین، زیوی یان بێڕەنگ',
      'atelier.hero.note3': 'بە دەست مۆر دەکرێت',
      'atelier.hero.alt': 'وەستایەک بە چەکوش نەخشێک لەسەر چەرم مۆر دەکات',
      'atelier.hero.caption': 'پیت بە پیت',

      'atelier.config.eyebrow': 'تایبەتکردن',
      'atelier.config.title': 'پیتەکانی تۆ، <em>بە دەست مۆرکراو.</em>',
      'atelier.config.text': 'پارچەکە، چەرمەکە و فۆیلەکە هەڵبژێرە، پاشان تا سێ پیت بنووسە. پێشبینینەکە لەگەڵ هەر هەڵبژاردنێکت دەگۆڕێت — لە ئاتێلیەدا هەمان پیت بە دەست لەسەر چەرمەکە مۆر دەکرێن.',

      'atelier.stage.label': 'پێشبینینی ڕاستەوخۆ',
      'atelier.stage.hint': 'ماوسەکە بەسەر چەرمەکەدا بگێڕە بۆ ئەوەی ڕووناکی بکەوێتە سەری',
      'atelier.stage.empty': 'پیتەکانت بنووسە',
      'atelier.stage.spec': '{piece} · {leather} · {foil}',
      'atelier.stage.aria': 'پێشبینینی {piece} بە ڕەنگی {leather}: {initials}، {foil}، {style}',

      'atelier.step.item': 'پارچەکە',
      'atelier.step.leather': 'چەرمەکە',
      'atelier.step.foil': 'فۆیلەکە',
      'atelier.step.initials': 'پیتەکانت',
      'atelier.step.style': 'شێوەی پیتەکان',

      'atelier.leather.available': 'بە {n} لە {total} چەرمەکەمان دروست دەکرێت',
      'atelier.leather.unavailable': '{name} — بۆ ئەم پارچەیە بەردەست نییە',
      'atelier.leather.switched': '{piece} بە ڕەنگی {from} دروست ناکرێت، بۆیە ڕەنگی {to} هەڵبژێردرا.',
      'atelier.grain.pebble': 'چەرمی دەنکدار',
      'atelier.grain.smooth': 'چەرمی لووس',
      'atelier.grain.suede': 'چەرمی مەخمەڵی',

      'atelier.foil.gold': 'فۆیلی زێڕین',
      'atelier.foil.gold.text': 'گەرم و درەوشاوە — فۆیلی ماڵەکەمان.',
      'atelier.foil.silver': 'فۆیلی زیوی',
      'atelier.foil.silver.text': 'فێنک و هێمن، وەک تیشکی مانگ.',
      'atelier.foil.blind': 'مۆری بێڕەنگ',
      'atelier.foil.blind.text': 'بێ فۆیل — تەنها شوێنی مۆرەکە.',

      'atelier.initials.label': 'پیتە سەرەتاییەکان',
      'atelier.initials.hint': 'تا ٣ پیتی لاتینی، ژمارە یان خاڵ',
      'atelier.initials.count': '{n} / {max}',
      'atelier.initials.none': 'هێشتا هیچ',
      'atelier.initials.error.chars': 'تەنها پیتە لاتینییەکانی A–Z، ژمارەکانی 0–9 و خاڵ مۆر دەکرێن.',
      'atelier.initials.error.long': 'زۆرترین سێ پیت — ئەوانی تر لابران.',
      'atelier.initials.error.empty': 'لانیکەم یەک پیت یان ژمارە بنووسە.',

      'atelier.style.serif': 'پیتی کلاسیک',
      'atelier.style.serif.text': 'لار، وەک دەستنووس.',
      'atelier.style.roman': 'پیتی گەورەی ڕۆمانی',
      'atelier.style.roman.text': 'ڕاست و بە بۆشایی، وەک ئەوەی لە بەرد هەڵکەنرابێت.',

      'atelier.summary.title': 'پارچەکەت',
      'atelier.summary.piece': 'پارچە',
      'atelier.summary.leather': 'چەرم',
      'atelier.summary.foil': 'فۆیل',
      'atelier.summary.initials': 'پیتەکان',
      'atelier.summary.style': 'شێوەی پیت',
      'atelier.summary.fee': 'تایبەتکردن',
      'atelier.summary.total': 'کۆی گشتی',
      'atelier.summary.wa': 'داواکردن لە ڕێگەی واتسئاپ',
      'atelier.summary.note': 'پێش ئەوەی پیتەکان مۆر بکرێن، هەموو تایبەتکردنێک لەگەڵ خۆت پشتڕاست دەکەینەوە.',
      'atelier.summary.inPerson': 'حەز دەکەیت بە ئامادەبوونی خۆت هەڵیبژێریت؟',
      'atelier.cart.summary': 'پیتەکان {initials} · {foil} · {style}',
      'atelier.wa.message': 'سڵاو Ben.M، دەمەوێت پارچەیەک تایبەت بکەم:\n• {piece}\n• چەرم: {leather}\n• {foil}\n• پیتەکان: {initials} ({style})\n• {price} + تایبەتکردن {fee} = {total}\nسوپاس.',

      'atelier.mto.eyebrow': 'دروستکردن بە داواکاری',
      'atelier.mto.title': 'لە گفتوگۆیەکەوە <em>تا بەردەم دەرگاکەت.</em>',
      'atelier.mto.text': 'بۆ پێڵاوێک بە پێوانەی پێی خۆت، جانتایەک بە دەوری ئەو شتانەی هەڵیاندەگریت، یان پارچەیەک کە هێشتا بوونی نییە. پێنج هەنگاوی بێپەلە — و تۆ لە هەموویاندا بەشداریت.',
      'atelier.mto.note': 'ماوەی کارەکە بەندە بە پارچەکە و چەرمەکەوە؛ لە یەکەم گفتوگۆدا پێکەوە دیاری دەکەین.',
      'atelier.mto.cta': 'کاتێک بۆ ڕاوێژ دیاری بکە',
      'atelier.mto.1.title': 'ڕاوێژ',
      'atelier.mto.1.text': 'پێکەوە دادەنیشین — لە فرۆشگا یان بە پەیوەندی تەلەفۆنی — و قسە لەسەر ئەو شتانە دەکەین کە دەتەوێت بەکاریان بهێنیت، هەڵیانبگریت و بیانپارێزیت.',
      'atelier.mto.1.alt': 'وەستایەکی لێهاتوو لەسەر مێزی کارەکەی لە کارگەیەکی چەرمدا',
      'atelier.mto.2.title': 'پێوانە',
      'atelier.mto.2.text': 'پێ دەپێورێت و شێوەکەی لەسەر کاغەز دەکێشرێت؛ جانتا بە دەوری ئەو شتانەدا نەخشە دەکرێت کە دەبێت هەڵیانبگرێت. هیچ شتێک بۆ گومان جێناهێڵرێت.',
      'atelier.mto.2.alt': 'دەستی وەستایەک کە پێش بڕین نەخشەیەک لەسەر پێستێک دیاری دەکات',
      'atelier.mto.3.title': 'هەڵبژاردن',
      'atelier.mto.3.text': 'چەرمەکە ڕاستەوخۆ لە نێو پێستەکاندا هەڵدەبژێریت، پاشان دەزوو، ناوپۆش و ڕووکاری کۆتایی.',
      'atelier.mto.3.alt': 'پێستی چەرمی قاوەیی و هەنگوینی کە لەسەر یەک دانراون و بە دەست هەڵبژێردراون',
      'atelier.mto.4.title': 'دروستکردن',
      'atelier.mto.4.text': 'بە دەست دەبڕدرێت، دەدوورێت و تەواو دەکرێت، بەو هێواشییەی چەرم داوای دەکات. لە ماوەی کارەکەدا ئاگادارت دەکەینەوە.',
      'atelier.mto.4.alt': 'ئامرازەکانی چەرمسازی لەسەر مێزێکی دارینی کۆن ڕیزکراون',
      'atelier.mto.5.title': 'گەیاندن',
      'atelier.mto.5.text': 'پارچەکەت بە دەستی خۆت دەدرێت و لەبەرت تاقی دەکرێتەوە، یان بە پێچراوی بۆت دەنێردرێت — لەگەڵ ڕێنماییەکانی چاودێریکردنی.',
      'atelier.mto.5.alt': 'جزدانێکی چەرمی کۆنیاکی و کلیلدانێک لەسەر مێزێکی داری گوێز',

      'atelier.appt.eyebrow': 'دیاریکردنی کات',
      'atelier.appt.title': 'دانیشتنێک <em>لەگەڵ ئاتێلیە.</em>',
      'atelier.appt.text': 'پێمان بڵێ چیت لە مێشکدایە و چ کاتێک بۆت گونجاوە. ڕاوێژکارێک وەڵامت دەداتەوە بۆ ئەوەی کاتێک لەو فرۆشگایەی هەڵیدەبژێریت دیاری بکات.',
      'atelier.appt.alt': 'دۆڵابی شووشەیی بە ڕووناکییەکی زەردباو کە کاڵای چەرمی لە فرۆشگایەکدا نمایش دەکەن',
      'atelier.appt.caption': 'لە فرۆشگادا',
      'atelier.appt.contact': 'دەتەوێت بنووسیت یان پەیوەندی بکەیت؟',
      'atelier.appt.whatsapp': 'واتسئاپ',
      'atelier.appt.wa': 'سڵاو Ben.M، دەمەوێت کاتێک دیاری بکەم:\n• {service}\n• {city} — {date}\n• {name} · {phone}{message}\nسوپاس.',
      'atelier.appt.mailSubject': 'داواکاری کات — {service}',
      'atelier.form.service': 'خزمەتگوزاری',
      'atelier.form.service.personalisation': 'تایبەتکردن',
      'atelier.form.service.mtoShoes': 'پێڵاوی دروستکراو بە داواکاری',
      'atelier.form.service.mtoBag': 'جانتای دروستکراو بە داواکاری',
      'atelier.form.service.care': 'چاودێری و چاککردنەوە',
      'atelier.form.message': 'نامە — ئارەزوومەندانە',
      'atelier.form.error.date': 'تکایە ئەمڕۆ یان ڕۆژێکی دواتر هەڵبژێرە.',
      'atelier.form.submit': 'داواکردنی کات',
      'atelier.form.note': 'هیچ پارەیەک وەرناگیرێت. خۆمان وەڵامت دەدەینەوە بۆ پشتڕاستکردنەوە.',
      'atelier.success.title': 'سوپاس، {name}.',
      'atelier.success.text': 'داواکارییەکەت — {service} لە {city}، {date} — ئامادەیە. بۆ ئەوەی زووتر پشتڕاست بکرێتەوە، ڕاستەوخۆ بۆمانی بنێرە و ڕاوێژکارێک بە کاتێکی دیاریکراو وەڵامت دەداتەوە.',
      'atelier.success.wa': 'ناردن لە ڕێگەی واتسئاپ',
      'atelier.success.email': 'ناردن بە ئیمەیڵ',
      'atelier.success.again': 'داواکارییەکی تر',

      'atelier.faq.eyebrow': 'پرسیارەکان',
      'atelier.faq.title': 'پێش ئەوەی <em>دەست پێبکەیت.</em>',
      'atelier.faq.text': 'ئەو پرسیارانەی زۆرتر لەبارەی تایبەتکردنەوە دەیانبیستین. هەر پرسیارێکی ترت هەیە، لێمان بپرسە — خۆمان وەڵامت دەدەینەوە.',
      'atelier.faq.more': 'زیاتر لە خزمەتگوزاری کڕیاران',
      'atelier.faq.1.q': 'کام پارچانە دەتوانرێت تایبەت بکرێن؟',
      'atelier.faq.1.a': 'جانتاکان و پارچە چەرمییە بچووکەکانمان — جزدان، جێکارت، قایش و پێداویستییەکانی گەشت. لە پەڕەی بەرهەمەکاندا بەدوای «تایبەتی بکە»دا بگەڕێ، یان هەر لێرەوە دەست پێبکە.',
      'atelier.faq.2.q': 'چی دەتوانرێت مۆر بکرێت؟',
      'atelier.faq.2.a': 'تا سێ پیت: پیتە لاتینییەکانی A–Z، ژمارەکانی 0–9 و خاڵ، بە پیتی کلاسیک یان پیتی گەورەی ڕۆمانی. ئەگەر شتێکی ترت لە مێشکدایە، لە کاتی دانیشتنەکەدا پێمان بڵێ.',
      'atelier.faq.3.q': 'جیاوازی نێوان فۆیل و مۆری بێڕەنگ چییە؟',
      'atelier.faq.3.a': 'فۆیل چینێکی تەنکی زێڕین یان زیوی دەخاتە ناو پیتە مۆرکراوەکانەوە. مۆری بێڕەنگ هیچ فۆیلێکی تێدا نییە — تەنها شوێنی مۆرەکەیە لەسەر چەرمەکە، کە هێدی هێدی لەگەڵ کۆنبوونی چەرمەکەدا قووڵتر دەبێتەوە.',
      'atelier.faq.4.q': 'نرخەکەی چەندە؟',
      'atelier.faq.4.a': 'تایبەتکردن {fee} دەخاتە سەر نرخی پارچەکە، هەر فۆیل و شێوەی پیتێک هەڵبژێریت.',
      'atelier.faq.5.q': 'دەتوانم دیارییەک تایبەت بکەم؟',
      'atelier.faq.5.a': 'بێگومان. پیتە سەرەتاییەکانی ئەو کەسە بەکاربهێنە کە دیارییەکەی بۆیە، و کاتێک داواکارییەکەت پشتڕاست دەکەینەوە پێمان بڵێ کە دیارییە — بە دەست دەپێچرێتەوە، ئامادە بۆ پێشکەشکردن.',

      'atelier.next.label': 'بەردەوامبە لە سەردانەکەت',
      'atelier.next.shop.eyebrow': 'کۆلێکشنەکە',
      'atelier.next.shop.title': 'پارچەکەت <em>هەڵبژێرە.</em>',
      'atelier.next.shop.text': 'جانتا، قایش و پارچە چەرمییە بچووکەکان، ئامادە بۆ پیتەکانت.',
      'atelier.next.shop.cta': 'سەیری کۆلێکشنەکە بکە',
      'atelier.next.visit.eyebrow': 'فرۆشگاکان',
      'atelier.next.visit.title': 'سەردانی <em>ماڵەکەمان بکە.</em>',
      'atelier.next.visit.text': '{cities} — چەرمەکان بە چاوی خۆت ببینە و دەستیان لێ بدە.',
      'atelier.next.visit.cta': 'فرۆشگایەک بدۆزەرەوە',
      'atelier.and': 'و'
    }
  });

  /* ===========================================================================
     2. Helpers & data
     ======================================================================== */
  var $ = function (sel, root) { return (root || d).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || d).querySelectorAll(sel)); };
  var esc = B.esc;
  var html = d.documentElement;
  var CONFIG = w.BENM_CONFIG || {};
  var LEATHERS = w.BENM_LEATHERS || [];
  var STORES = w.BENM_STORES || [];
  var FEE = Number(CONFIG.personalisationFee) || 0;
  var HAS_GSAP = typeof w.gsap !== 'undefined';
  var MAX = 3;
  var CORE = ['zab-card-holder', 'slemani-bifold', 'nawroz-tote', 'dijla-belt'];   // the four signature pieces
  var FOILS = ['gold', 'silver', 'blind'];
  var STYLES = ['serif', 'roman'];
  var STITCH = { gold: '#C4A062', silver: '#BEC3C6', blind: '#C4A062' };          // thread colour (data)
  // the leather panel per piece: aspect (w/h), size of the letters, where they sit (fractions)
  var SHAPES = {
    'card-holder':    { aspect: 4 / 3,   scale: .42, offset: [0, 0] },
    'bifold':         { aspect: 11 / 9,  scale: .32, offset: [0, .06] },
    'tote':           { aspect: 5 / 4,   scale: .26, offset: [0, -.16] },
    'belt':           { aspect: 5,       scale: .58, offset: [-.25, 0] },
    'passport-cover': { aspect: 10 / 14, scale: .4,  offset: [0, .16] },
    'crossbody':      { aspect: 12 / 7,  scale: .3,  offset: [0, 0] },
    'briefcase':      { aspect: 40 / 29, scale: .24, offset: [0, -.1] },
    'weekender':      { aspect: 16 / 9,  scale: .22, offset: [0, -.08] },
    'mini-bag':       { aspect: 4 / 3,   scale: .32, offset: [0, 0] },
    'backpack':       { aspect: 3 / 4,   scale: .3,  offset: [0, -.18] },
    _bag:             { aspect: 5 / 4,   scale: .28, offset: [0, -.1] },
    _small:           { aspect: 4 / 3,   scale: .36, offset: [0, 0] }
  };
  var SERVICE_KEYS = { 'personalisation': 'personalisation', 'mto-shoes': 'mtoShoes', 'mto-bag': 'mtoBag', 'care': 'care' };
  var EASTERN = '٠١٢٣٤٥٦٧٨٩', PERSIAN = '۰۱۲۳۴۵۶۷۸۹';
  var CKB_MONTHS = ['کانوونی دووەم', 'شوبات', 'ئازار', 'نیسان', 'ئایار', 'حوزەیران', 'تەمموز', 'ئاب', 'ئەیلوول', 'تشرینی یەکەم', 'تشرینی دووەم', 'کانوونی یەکەم'];
  var CKB_DAYS = ['یەکشەممە', 'دووشەممە', 'سێشەممە', 'چوارشەممە', 'پێنجشەممە', 'هەینی', 'شەممە'];

  function debounce(fn, ms) {
    var id;
    return function () {
      var a = arguments, self = this;
      clearTimeout(id);
      id = setTimeout(function () { fn.apply(self, a); }, ms);
    };
  }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function setText(el, s) { if (el && el.textContent !== s) el.textContent = s; }
  function setPrice(el, usd) {
    if (!el) return;
    el.setAttribute('data-price', String(usd));
    setText(el, B.price(usd));
  }
  function focusQuiet(el) {
    if (!el || !el.focus) return;
    try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); }
  }
  function headerOffset() { return B.header && B.header.el ? B.header.el.offsetHeight : 84; }
  function leatherById(id) {
    for (var i = 0; i < LEATHERS.length; i++) if (LEATHERS[i].id === id) return LEATHERS[i];
    return null;
  }
  function offers(p, leatherId) {
    return !!p && (p.colors || []).some(function (c) { return c.id === leatherId; });
  }
  function personalisable(p) { return !!(p && p.personalisable); }
  function shapeOf(p) { return SHAPES[p && p.type] || (p && p.category === 'bags' ? SHAPES._bag : SHAPES._small); }
  /** t() in a given language — the cart line keeps its summary in both. */
  function tIn(l, key, vars) {
    var all = w.BENM_I18N || {};
    var s = all[l] && all[l][key] != null ? all[l][key] : (all.en || {})[key];
    if (s == null) return key;
    return String(s).replace(/\{(\w+)\}/g, function (m, k) { return vars && vars[k] != null ? String(vars[k]) : m; });
  }
  /** run fn once the element comes within `margin` of the viewport */
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
  function hasLetters(s) { return /[A-Z0-9]/.test(s || ''); }
  /** Initials: Latin A–Z, 0–9 and '.', upper case, max 3. Eastern digits become Latin. */
  function sanitize(raw) {
    var s = String(raw == null ? '' : raw)
      .replace(/[٠-٩]/g, function (c) { return String(EASTERN.indexOf(c)); })
      .replace(/[۰-۹]/g, function (c) { return String(PERSIAN.indexOf(c)); })
      .replace(/\s+/g, '')
      .toUpperCase();
    var clean = s.replace(/[^A-Z0-9.]/g, '');
    return { value: clean.slice(0, MAX), bad: clean.length !== s.length, long: clean.length > MAX };
  }

  /* ===========================================================================
     3. State — URL parameters → the first configuration
     ======================================================================== */
  var items = [];
  var state = { item: null, leather: null, foil: 'gold', style: 'serif', initials: '' };
  var touched = false;                              // the URL follows only the visitor's own changes

  function initState() {
    items = CORE.map(B.findProduct).filter(personalisable);
    var p = B.findProduct(B.param('item') || '');
    var l = leatherById(B.param('leather') || '');
    if (personalisable(p)) state.item = p;
    else if (l) {
      // a leather without a piece (home "try your initials"): the first piece made in it
      state.item = items.filter(function (it) { return offers(it, l.id); })[0] ||
        B.products(function (x) { return personalisable(x) && offers(x, l.id); })[0] || null;
    }
    if (!state.item) state.item = items[0] || B.products(personalisable)[0];
    if (items.indexOf(state.item) < 0) items.unshift(state.item);   // a piece from a product page joins the list
    state.leather = l && offers(state.item, l.id) ? l : (leatherById(state.item.colors[0].id) || LEATHERS[0]);
    var foil = B.param('foil'), style = B.param('style');
    if (FOILS.indexOf(foil) > -1) state.foil = foil;
    if (STYLES.indexOf(style) > -1) state.style = style;
    state.initials = sanitize(B.param('initials') || '').value;
  }

  var syncUrl = debounce(function () {
    if (!touched || !w.history || typeof w.history.replaceState !== 'function') return;
    var q = ['item=' + encodeURIComponent(state.item.id), 'leather=' + encodeURIComponent(state.leather.id)];
    if (state.foil !== 'gold') q.push('foil=' + state.foil);
    if (state.style !== 'serif') q.push('style=' + state.style);
    if (state.initials) q.push('initials=' + encodeURIComponent(state.initials));
    var file = w.location.pathname.split('/').pop() || 'atelier.html';
    try { w.history.replaceState(w.history.state, '', file + '?' + q.join('&') + w.location.hash); } catch (e) { /* history blocked */ }
  }, 400);
  function changed() { touched = true; syncUrl(); }

  /* ===========================================================================
     4. Configurator — steps
     ======================================================================== */
  var stage, tagEl, itemsEl, leathersEl, foilsEl, stylesEl, input, field, msgEl, countEl, liveEl, noteEl, descEl, specEl;
  var refs = {};
  var msgKey = null, pendingLong = false, switchTimer = 0;
  var mqStack = w.matchMedia('(max-width: 999.98px) and (min-height: 541px)');

  function itemCard(p) {
    return '<label class="atelier-opt atelier-item" data-product-id="' + esc(p.id) + '">' +
      '<input class="atelier-opt__input" type="radio" name="atelier-item" value="' + esc(p.id) + '"' + (p === state.item ? ' checked' : '') + '>' +
      '<span class="atelier-item__media"><img src="' + esc(p.images[0]) + '" alt="" width="1200" height="1500" loading="lazy" decoding="async"></span>' +
      '<span class="atelier-item__body">' +
        '<span class="atelier-item__type" data-pfield="typeName">' + esc(B.loc(p.typeName)) + '</span>' +
        '<span class="atelier-item__name" data-pfield="name">' + esc(B.loc(p.name)) + '</span>' +
        '<span class="atelier-item__price c-price" data-price="' + p.price + '">' + esc(B.price(p.price)) + '</span>' +
      '</span>' +
      '<span class="atelier-item__check" aria-hidden="true">' + B.icon('check') + '</span>' +
    '</label>';
  }
  function leatherOpt(l) {
    return '<label class="atelier-opt atelier-leather" data-leather="' + esc(l.id) + '">' +
      '<input class="atelier-opt__input" type="radio" name="atelier-leather" value="' + esc(l.id) + '">' +
      '<span class="atelier-leather__chip" style="--swatch:' + esc(l.hex) + '" aria-hidden="true"><img alt="" decoding="async"></span>' +
      '<span class="atelier-leather__name" data-leather-name>' + esc(B.loc(l.name)) + '</span>' +
    '</label>';
  }
  /** all eight house leathers; the ones this piece is not made in are struck through */
  function syncLeathers() {
    $$('.atelier-leather', leathersEl).forEach(function (lab) {
      var id = lab.getAttribute('data-leather'), l = leatherById(id), on = offers(state.item, id);
      var inp = $('input', lab);
      inp.disabled = !on;
      inp.checked = on && id === state.leather.id;
      lab.classList.toggle('is-off', !on);
      lab.title = on ? B.loc(l.name) : B.t('atelier.leather.unavailable', { name: B.loc(l.name) });
      setText($('[data-leather-name]', lab), B.loc(l.name));
    });
  }
  function syncRadios() {
    $$('input[name="atelier-foil"]').forEach(function (r) { r.checked = r.value === state.foil; });
    $$('input[name="atelier-style"]').forEach(function (r) { r.checked = r.value === state.style; });
  }
  function renderLeatherInfo() {
    var l = state.leather;
    setText(descEl, B.loc(l.description));
    clearTimeout(switchTimer);
    noteEl.classList.remove('is-switch');
    setText(noteEl, B.t('atelier.grain.' + (l.grain || 'smooth')) + ' · ' +
      B.t('atelier.leather.available', { n: state.item.colors.length, total: LEATHERS.length }));
  }
  function noticeSwitch(from) {
    var msg = B.t('atelier.leather.switched', { piece: B.loc(state.item.name), from: B.loc(from.name), to: B.loc(state.leather.name) });
    setText(noteEl, msg);
    noteEl.classList.add('is-switch');
    setText(liveEl, msg);
    clearTimeout(switchTimer);
    switchTimer = setTimeout(renderLeatherInfo, 6500);
  }
  /** the foil and lettering chips show the visitor's own letters on the chosen leather */
  function renderSamples() {
    var s = hasLetters(state.initials) ? state.initials : 'AB';
    $$('[data-sample]').forEach(function (el) { setText(el, s); });
    if (foilsEl) {
      foilsEl.classList.toggle('is-roman', state.style === 'roman');
      foilsEl.style.setProperty('--chip', state.leather.hex);
    }
  }
  function renderInitialsUI() {
    if (input.value !== state.initials) input.value = state.initials;
    var n = state.initials.length;
    setText(countEl, B.t('atelier.initials.count', { n: n, max: MAX }));
    countEl.classList.toggle('is-full', n === MAX);
    stage.classList.toggle('is-empty', !hasLetters(state.initials));
  }
  function showMsg(key, isError) {
    msgKey = key;
    if (!key) {
      msgEl.removeAttribute('data-i18n');
      setText(msgEl, '');
      field.classList.remove('is-invalid');
      input.removeAttribute('aria-invalid');
      return;
    }
    msgEl.setAttribute('data-i18n', 'atelier.initials.error.' + key);
    setText(msgEl, B.t('atelier.initials.error.' + key));
    msgEl.classList.toggle('is-info', !isError);
    field.classList.toggle('is-invalid', !!isError);
    if (isError) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
  }

  /* ===========================================================================
     5. Configurator — live preview + leather swatches
     ======================================================================== */
  var tag = null, swapTl = null, snapsDone = false;

  function markOf() {
    return hasLetters(state.initials) ? { type: 'text', text: state.initials, font: state.style === 'roman' ? 'roman' : 'serif' } : null;
  }
  function previewLabel() {
    return B.t('atelier.stage.aria', {
      piece: B.loc(state.item.name), leather: B.loc(state.leather.name),
      initials: hasLetters(state.initials) ? state.initials : B.t('atelier.initials.none'),
      foil: B.t('atelier.foil.' + state.foil), style: B.t('atelier.style.' + state.style)
    });
  }
  function tagOptions() {
    var l = state.leather, sh = shapeOf(state.item);
    return {
      color: l.hex, grain: l.grain || 'pebble', foil: state.foil, mark: markOf(),
      markScale: sh.scale, markOffset: sh.offset, stitchColor: STITCH[state.foil] || STITCH.gold, label: previewLabel()
    };
  }
  function applyShape() {
    tagEl.style.setProperty('--aspect', String(shapeOf(state.item).aspect));
    stage.setAttribute('data-item-type', state.item.type || '');
  }
  function createTag() {
    if (tag || !tagEl || !B.Leather || typeof B.Leather.create !== 'function') return;
    try {
      var o = typeof B.Leather.preset === 'function' ? B.Leather.preset('atelier', tagOptions()) : tagOptions();
      tag = B.Leather.create(tagEl, o);
    } catch (e) { console.error(e); tag = null; }
  }
  /** a new piece: the tag lifts away, takes the new shape, and settles back */
  function swapItem() {
    if (swapTl) swapTl.progress(1);
    if (!tag || B.reducedMotion || !HAS_GSAP) {
      applyShape();
      if (tag) tag.set(tagOptions());
      return;
    }
    swapTl = gsap.timeline({ onComplete: function () { swapTl = null; } })
      .to(tagEl, { autoAlpha: 0, scale: .9, y: 14, duration: .32, ease: 'power2.in', onComplete: function () { applyShape(); tag.set(tagOptions()); } })
      .to(tagEl, { autoAlpha: 1, scale: 1, y: 0, duration: 1, ease: 'expo.out', clearProps: 'opacity,visibility,transform' }, '+=.16');
  }
  // keystrokes are debounced; each new set of letters "presses" the leather once
  var pushMark = debounce(function () {
    if (!tag) return;
    tag.set(tagOptions());
    if (!B.reducedMotion && HAS_GSAP && !swapTl && hasLetters(state.initials)) {
      gsap.fromTo(tagEl, { scale: .982 }, { scale: 1, duration: .8, ease: 'expo.out', clearProps: 'transform' });
    }
  }, 140);
  function updatePreview(kind) {
    stage.setAttribute('data-foil', state.foil);
    if (kind === 'item') { swapItem(); return; }
    if (!tag) return;
    if (kind === 'initials') pushMark();
    else tag.set(tagOptions());
  }
  /** real leather on every swatch: one shared snapshot context, CSS colour until it lands */
  function renderSnapshots() {
    if (snapsDone || !B.Leather || typeof B.Leather.snapshot !== 'function') return;
    snapsDone = true;
    LEATHERS.forEach(function (l, i) {
      var base = { color: l.hex, grain: l.grain || 'pebble', seed: i + 3, dpr: 2, mark: null, stitch: false };
      var opts = typeof B.Leather.preset === 'function' ? B.Leather.preset('swatch', base) : base;
      B.Leather.snapshot(opts, 112, 112).then(function (url) {
        var img = $('[data-leather="' + l.id + '"] img', leathersEl);
        if (!img || !url) return;
        img.onload = function () { img.classList.add('is-loaded'); };
        img.src = url;
      }, function () { /* the flat colour stays */ });
    });
  }

  /* ===========================================================================
     6. Configurator — summary, WhatsApp request, add to bag
     ======================================================================== */
  var busy = false, addedTimer = 0;

  function renderSummary() {
    var p = state.item, total = p.price + FEE;
    var name = B.loc(p.name), leather = B.loc(state.leather.name);
    var foil = B.t('atelier.foil.' + state.foil), style = B.t('atelier.style.' + state.style);
    setText(refs.piece, name);
    setText(refs.leather, leather);
    setText(refs.foil, foil);
    setText(refs.style, style);
    if (hasLetters(state.initials)) {
      refs.initials.classList.remove('is-none');
      refs.initials.innerHTML = '<bdi class="atelier-summary__initials' + (state.style === 'roman' ? ' is-roman' : '') + '" lang="en" dir="ltr">' + esc(state.initials) + '</bdi>';
    } else {
      refs.initials.classList.add('is-none');
      setText(refs.initials, B.t('atelier.initials.none'));
    }
    setText(refs.itemName, name);
    setPrice(refs.itemPrice, p.price);
    setPrice(refs.fee, FEE);
    setPrice(refs.total, total);
    setPrice(refs.addPrice, total);
    setPrice(refs.stageTotal, total);
    setText(refs.vItem, name);
    setText(refs.vLeather, leather);
    setText(refs.vFoil, foil);
    setText(refs.vStyle, style);
    setText(specEl, B.t('atelier.stage.spec', { piece: name, leather: leather, foil: foil }));
    if (refs.wa) refs.wa.setAttribute('href', B.whatsappLink(waMessage()));
  }
  function waMessage() {
    var p = state.item;
    return B.t('atelier.wa.message', {
      piece: B.loc(p.name), leather: B.loc(state.leather.name), foil: B.t('atelier.foil.' + state.foil),
      initials: hasLetters(state.initials) ? state.initials : '—', style: B.t('atelier.style.' + state.style),
      price: B.price(p.price), fee: B.price(FEE), total: B.price(p.price + FEE)
    });
  }
  function cartSummary(l) {
    return tIn(l, 'atelier.cart.summary', {
      initials: state.initials, foil: tIn(l, 'atelier.foil.' + state.foil), style: tIn(l, 'atelier.style.' + state.style)
    });
  }
  /** no letters yet → say so at the field, bring it into view and focus it */
  function requireInitials() {
    if (hasLetters(state.initials)) return true;
    showMsg('empty', true);
    var off = mqStack.matches ? -(stage.offsetHeight + 28) : -(headerOffset() + 28);
    B.scrollTo(field, { offset: off, duration: .9, onComplete: function () { focusQuiet(input); } });
    return false;
  }
  /** the ghost that flies into the bag is a picture of the live preview (or the piece's photo) */
  function flySource(done) {
    var checked = $('input:checked', itemsEl), card = checked && checked.closest('.atelier-item');
    var thumb = card ? $('img', card) : null;
    var fallback = thumb && thumb.complete && thumb.naturalWidth ? thumb : null;
    var url = '';
    if (tag && tag.webgl && !B.reducedMotion && typeof tag.toDataURL === 'function') {
      try { url = tag.toDataURL('image/webp', .9); } catch (e) { url = ''; }
    }
    if (!url || url.length < 64) { done(fallback, null); return; }
    var img = d.createElement('img');
    img.className = 'atelier-tag__ghost';
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    var cleanup = function () { if (img.parentNode) img.parentNode.removeChild(img); };
    img.onload = function () { done(img, cleanup); };
    img.onerror = function () { cleanup(); done(fallback, null); };
    tagEl.appendChild(img);
    img.src = url;
  }
  function markAdded() {
    var btn = refs.add, label = refs.addLabel;
    if (!btn || !label) return;
    clearTimeout(addedTimer);
    btn.classList.add('is-done');
    label.setAttribute('data-i18n', 'product.added');
    setText(label, B.t('product.added'));
    addedTimer = setTimeout(function () {
      btn.classList.remove('is-done');
      label.setAttribute('data-i18n', 'product.addToBag');
      setText(label, B.t('product.addToBag'));
    }, 1800);
  }
  function addToBag() {
    if (busy || !requireInitials()) return;
    busy = true;
    var id = state.item.id;
    var opts = {
      color: state.leather.id,
      options: {
        fee: FEE,
        summary: { en: cartSummary('en'), ckb: cartSummary('ckb') },
        initials: state.initials, foil: state.foil, style: state.style
      }
    };
    flySource(function (img, cleanup) {
      try { B.addToBag(id, opts, img); } catch (e) { console.error(e); }
      if (cleanup) setTimeout(cleanup, 60);
      busy = false;
      markAdded();
    });
  }

  /* ===========================================================================
     7. Configurator — boot & events
     ======================================================================== */
  function onItem(id) {
    var p = B.findProduct(id);
    if (!p || p === state.item) return;
    var from = state.leather;
    state.item = p;
    var switched = !offers(p, from.id);
    if (switched) state.leather = leatherById(p.colors[0].id) || LEATHERS[0];
    syncLeathers();
    renderLeatherInfo();
    if (switched) noticeSwitch(from);
    renderSamples();
    renderSummary();
    updatePreview('item');
    changed();
  }
  function onLeather(id) {
    var l = leatherById(id);
    if (!l || l === state.leather || !offers(state.item, id)) return;
    state.leather = l;
    renderLeatherInfo();
    renderSamples();
    renderSummary();
    updatePreview('leather');
    changed();
  }
  function onFoil(v) {
    if (FOILS.indexOf(v) < 0 || v === state.foil) return;
    state.foil = v;
    renderSummary();
    updatePreview('foil');
    changed();
  }
  function onStyle(v) {
    if (STYLES.indexOf(v) < 0 || v === state.style) return;
    state.style = v;
    renderSamples();
    renderSummary();
    updatePreview('style');
    changed();
  }
  function onInitials() {
    var raw = input.value, r = sanitize(raw);
    if (raw !== r.value) {
      var caret = Math.max(0, (input.selectionStart || 0) - (raw.length - r.value.length));
      input.value = r.value;
      try { input.setSelectionRange(caret, caret); } catch (e) { /* not focused */ }
    }
    if (r.bad) showMsg('chars', true);
    else if (r.long || pendingLong) showMsg('long', false);
    else if (msgKey) showMsg(null);
    pendingLong = false;
    if (r.value === state.initials) return;
    state.initials = r.value;
    renderInitialsUI();
    renderSamples();
    renderSummary();
    updatePreview('initials');
    changed();
  }
  /** phones: the typed letters stay between the sticky stage and the keyboard */
  function keepFieldVisible() {
    if (!mqStack.matches || d.activeElement !== input) return;
    var sr = stage.getBoundingClientRect(), fr = field.getBoundingClientRect();
    var vh = w.visualViewport ? w.visualViewport.height : w.innerHeight;
    var minTop = Math.max(0, sr.bottom) + 16, maxBottom = vh - 16, delta = 0;
    if (fr.top < minTop) delta = fr.top - minTop;
    else if (fr.bottom > maxBottom) delta = fr.bottom - maxBottom;
    if (Math.abs(delta) > 4) B.scrollTo((w.scrollY || html.scrollTop || 0) + delta, { duration: .6 });
  }

  B.page(function () {
    stage = $('#atelier-stage');
    tagEl = $('#atelier-tag');
    itemsEl = $('#atelier-items');
    leathersEl = $('#atelier-leathers');
    foilsEl = $('.atelier-foils');
    stylesEl = $('.atelier-styles');
    input = $('#atelier-initials');
    field = input ? input.closest('.c-field') : null;
    msgEl = $('#atelier-initials-msg');
    countEl = $('#atelier-initials-count');
    liveEl = $('#atelier-live');
    noteEl = $('#atelier-leather-note');
    descEl = $('#atelier-leather-desc');
    specEl = $('#atelier-spec');
    if (!stage || !tagEl || !itemsEl || !leathersEl || !input || !field || !msgEl || !countEl || !noteEl) return;
    refs = {
      piece: $('#sum-piece'), leather: $('#sum-leather'), foil: $('#sum-foil'), initials: $('#sum-initials'), style: $('#sum-style'),
      itemName: $('#sum-item-name'), itemPrice: $('#sum-item-price'), fee: $('#sum-fee'), total: $('#sum-total'),
      add: $('#atelier-add'), addLabel: $('#atelier-add-label'), addPrice: $('#atelier-add-price'),
      stageTotal: $('#atelier-stage-total'), wa: $('#atelier-wa'),
      vItem: $('#step-item-value'), vLeather: $('#step-leather-value'), vFoil: $('#step-foil-value'), vStyle: $('#step-style-value')
    };

    initState();
    itemsEl.innerHTML = items.map(itemCard).join('');
    leathersEl.innerHTML = LEATHERS.map(leatherOpt).join('');
    syncLeathers();
    syncRadios();
    applyShape();
    stage.setAttribute('data-foil', state.foil);
    renderLeatherInfo();
    renderInitialsUI();
    renderSamples();
    renderSummary();

    itemsEl.addEventListener('change', function (e) { if (e.target.name === 'atelier-item') onItem(e.target.value); });
    leathersEl.addEventListener('change', function (e) { if (e.target.name === 'atelier-leather') onLeather(e.target.value); });
    if (foilsEl) foilsEl.addEventListener('change', function (e) { if (e.target.name === 'atelier-foil') onFoil(e.target.value); });
    if (stylesEl) stylesEl.addEventListener('change', function (e) { if (e.target.name === 'atelier-style') onStyle(e.target.value); });

    input.addEventListener('beforeinput', function (e) {
      if (!/^insert/.test(e.inputType || '')) return;
      var data = e.data != null ? e.data : (e.dataTransfer ? e.dataTransfer.getData('text/plain') : '');
      var add = sanitize(data).value.length;
      var sel = (input.selectionEnd || 0) - (input.selectionStart || 0);
      pendingLong = add > 0 && input.value.length - sel + add > MAX;
      if (pendingLong && input.value.length - sel >= MAX) showMsg('long', false);   // blocked by maxlength: no input event follows
    });
    input.addEventListener('input', onInitials);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); if (B.isTouch) input.blur(); }
    });
    input.addEventListener('focus', function () { setTimeout(keepFieldVisible, 320); });
    if (w.visualViewport) w.visualViewport.addEventListener('resize', debounce(keepFieldVisible, 120));

    if (refs.add) refs.add.addEventListener('click', addToBag);
    if (refs.wa) refs.wa.addEventListener('click', function (e) {
      if (!hasLetters(state.initials)) { e.preventDefault(); requireInitials(); }
    });

    whenNear($('#configurator'), '600px 0px', function () { createTag(); renderSnapshots(); });
  });

  /* ===========================================================================
     8. Hero — one foil sheen across "yours" when the page arrives
     ======================================================================== */
  B.ready(function () {
    var h1 = $('.atelier-hero__title');
    if (h1 && !B.reducedMotion) h1.classList.add('is-sheen');
  });

  /* ===========================================================================
     9. Made to order — the stitched thread draws through the five steps
     ======================================================================== */
  B.page(function () {
    var track = $('#atelier-mto'), thread = $('#atelier-mto-thread');
    if (!track || !thread) return;
    var steps = $$('.atelier-mto__step', track);
    if (!steps.length) return;
    if (B.reducedMotion || !HAS_GSAP || !w.ScrollTrigger || typeof gsap.matchMedia !== 'function') {
      track.classList.add('is-drawn');
      steps.forEach(function (s) { s.classList.add('is-lit'); });
      return;
    }
    var marks = [];
    function measure(wide) {
      var tr = track.getBoundingClientRect(), rtl = B.isRTL();
      marks = steps.map(function (s) {
        var node = $('.atelier-mto__node', s);
        if (!node) return 1;
        var r = node.getBoundingClientRect(), f;
        if (wide) f = (rtl ? tr.right - (r.left + r.width / 2) : (r.left + r.width / 2) - tr.left) / (tr.width || 1);
        else f = (r.top + r.height / 2 - tr.top) / (tr.height || 1);
        return Math.max(0, Math.min(1, f));
      });
    }
    function light(p) {
      for (var i = 0; i < steps.length; i++) steps[i].classList.toggle('is-lit', marks.length > i && p >= marks[i] - .015);
    }
    var mm = gsap.matchMedia();
    mm.add({ wide: '(min-width: 1100px)', narrow: '(max-width: 1099.98px)' }, function (ctx) {
      var wide = !!ctx.conditions.wide, prop = wide ? 'scaleX' : 'scaleY';
      var from = {}, to = {
        ease: 'none',
        onUpdate: function () { light(this.progress()); },
        scrollTrigger: {
          trigger: track,
          start: wide ? 'top 76%' : 'top 70%',
          end: wide ? 'top 24%' : 'bottom 70%',
          scrub: .7,
          onRefresh: function () { measure(wide); }
        }
      };
      from[prop] = 0;
      to[prop] = 1;
      measure(wide);
      var tw = gsap.fromTo(thread, from, to);
      return function () {
        if (tw.scrollTrigger) tw.scrollTrigger.kill();
        tw.kill();
        gsap.set(thread, { clearProps: 'transform' });
        steps.forEach(function (s) { s.classList.remove('is-lit'); });
      };
    });
  });

  /* ===========================================================================
     10. Appointment — validated form (no backend), date rule, success panel
     ======================================================================== */
  var form, success, panel, dateEl, cityEl, serviceEl, appt = null;

  function todayISO() {
    var t = new Date();
    return t.getFullYear() + '-' + pad2(t.getMonth() + 1) + '-' + pad2(t.getDate());
  }
  function fmtDate(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    if (!m) return iso || '';
    var dt = new Date(+m[1], +m[2] - 1, +m[3]);
    if (B.lang === 'ckb') {
      return CKB_DAYS[dt.getDay()] + '، ' + B.num(dt.getDate()) + 'ی ' + CKB_MONTHS[dt.getMonth()] + 'ی ' + B.num(dt.getFullYear());
    }
    try {
      return new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(dt);
    } catch (e) { return iso; }
  }
  function serviceLabel(v) { return SERVICE_KEYS[v] ? B.t('atelier.form.service.' + SERVICE_KEYS[v]) : ''; }
  function cityLabel(id) {
    for (var i = 0; i < STORES.length; i++) if (STORES[i].id === id) return B.loc(STORES[i].city);
    return '';
  }
  function renderCityOptions() {
    if (!cityEl) return;
    var cur = cityEl.value;
    cityEl.innerHTML = '<option value="" data-i18n="form.select">' + esc(B.t('form.select')) + '</option>' +
      STORES.map(function (s) { return '<option value="' + esc(s.id) + '">' + esc(B.loc(s.city)) + '</option>'; }).join('');
    cityEl.value = cur;
  }
  /** same plumbing as the shared validator, for the one rule it does not know (date ≥ today) */
  function setFieldError(el, key) {
    var host = el.closest('.c-field'), msg = host && $('.c-field__msg', host);
    if (host) {
      host.classList.toggle('is-invalid', !!key);
      if (key) host.classList.remove('is-valid');
    }
    el.setAttribute('aria-invalid', String(!!key));
    if (!msg || !key) return;
    if (!msg.id) msg.id = 'atelier-msg-' + (el.id || 'field');
    el.setAttribute('aria-describedby', msg.id);
    msg.setAttribute('data-i18n', key);
    setText(msg, B.t(key));
  }
  function checkDate() {
    if (!dateEl) return true;
    dateEl.min = todayISO();
    var v = dateEl.value;
    if (!v || v >= dateEl.min) return true;          // empty: the required rule speaks
    setFieldError(dateEl, 'atelier.form.error.date');
    return false;
  }
  function readForm() {
    var val = function (id) { var el = d.getElementById(id); return el ? String(el.value || '').trim() : ''; };
    return { name: val('ap-name'), phone: val('ap-phone'), city: val('ap-city'), date: val('ap-date'), service: val('ap-service'), message: val('ap-message') };
  }
  function renderSuccess() {
    if (!appt || !success) return;
    var first = appt.name.split(/\s+/)[0] || appt.name;
    var vars = { service: serviceLabel(appt.service), city: cityLabel(appt.city), date: fmtDate(appt.date) };
    setText($('#atelier-success-title'), B.t('atelier.success.title', { name: first }));
    setText($('#atelier-success-text'), B.t('atelier.success.text', vars));
    var msg = B.t('atelier.appt.wa', {
      service: vars.service, city: vars.city, date: vars.date, name: appt.name, phone: appt.phone,
      message: appt.message ? '\n' + appt.message : ''
    });
    var wa = $('#atelier-success-wa'), mail = $('#atelier-success-mail');
    if (wa) wa.setAttribute('href', B.whatsappLink(msg));
    if (mail) mail.setAttribute('href', 'mailto:' + (CONFIG.email || '') + '?subject=' +
      encodeURIComponent(B.t('atelier.appt.mailSubject', { service: vars.service })) + '&body=' + encodeURIComponent(msg));
  }
  function onSubmit(e) {
    e.preventDefault();
    var ok = B.validate(form);                       // required · phone · focuses the first invalid field
    var dateOk = checkDate();
    if (!ok) return;
    if (!dateOk) { focusQuiet(dateEl); return; }
    appt = readForm();
    renderSuccess();
    form.hidden = true;
    success.hidden = false;
    if (!B.reducedMotion && HAS_GSAP) gsap.fromTo(success, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .9, ease: 'expo.out', clearProps: 'all' });
    if (panel.getBoundingClientRect().top < headerOffset()) B.scrollTo(panel, { offset: -(headerOffset() + 24), duration: .9 });
    focusQuiet(success);
    B.emit('formsubmit', { form: form, data: appt, newsletter: false });
    B.refresh();
  }
  function resetForm() {
    form.reset();
    form.__benmTried = false;
    $$('.c-field', form).forEach(function (f) {
      f.classList.remove('is-invalid', 'is-valid');
      var m = $('.c-field__msg', f);
      if (m) { m.removeAttribute('data-i18n'); setText(m, ''); }
    });
    $$('[aria-invalid]', form).forEach(function (el) { el.removeAttribute('aria-invalid'); });
    appt = null;
    success.hidden = true;
    form.hidden = false;
    if (dateEl) dateEl.min = todayISO();
    focusQuiet(d.getElementById('ap-name'));
    B.refresh();
  }

  B.page(function () {
    form = $('#atelier-form');
    success = $('#atelier-success');
    panel = $('.atelier-appt__panel');
    if (!form || !success || !panel) return;
    dateEl = $('#ap-date');
    cityEl = $('#ap-city');
    serviceEl = $('#ap-service');
    renderCityOptions();
    if (dateEl) dateEl.min = todayISO();
    form.addEventListener('submit', onSubmit);
    // the shared validator re-checks fields live; the date rule is re-applied right after it
    ['input', 'focusout'].forEach(function (type) {
      d.addEventListener(type, function (e) { if (e.target === dateEl && form.__benmTried) checkDate(); });
    });
    var again = $('#atelier-success-again');
    if (again) again.addEventListener('click', resetForm);
    // "Book an appointment / a consultation" links choose the service for the visitor
    d.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('[data-appointment-service]');
      if (!a || !serviceEl || form.hidden) return;
      var v = a.getAttribute('data-appointment-service');
      if (!SERVICE_KEYS[v]) return;
      serviceEl.value = v;
      if (form.__benmTried) serviceEl.dispatchEvent(new Event('input', { bubbles: true }));
    });
  });

  /* ===========================================================================
     11. Contact methods · FAQ fee · closing band · icons · arrival anchor
     ======================================================================== */
  function renderMethods() {
    var el = $('#atelier-methods');
    if (!el) return;
    var phone = String(CONFIG.phone || ''), email = String(CONFIG.email || '');
    var rows = [
      { icon: 'whatsapp', href: B.whatsappLink(B.t('wa.hello')), label: B.t('atelier.appt.whatsapp'), blank: true },
      phone ? { icon: 'phone', href: 'tel:' + phone.replace(/[^\d+]/g, ''), label: phone, ltr: true } : null,
      email ? { icon: 'mail', href: 'mailto:' + email, label: email, ltr: true } : null
    ].filter(Boolean);
    el.innerHTML = rows.map(function (r) {
      return '<li><a href="' + esc(r.href) + '"' + (r.blank ? ' target="_blank" rel="noopener"' : '') + '>' + B.icon(r.icon) +
        (r.ltr ? '<bdi dir="ltr">' + esc(r.label) + '</bdi>' : '<span>' + esc(r.label) + '</span>') +
        (r.blank ? '<span class="u-visually-hidden">' + esc(B.t('a11y.newTab')) + '</span>' : '') + '</a></li>';
    }).join('');
  }
  function renderFee() { setText($('#atelier-faq-fee'), B.t('atelier.faq.4.a', { fee: B.price(FEE) })); }
  function renderCities() {
    var el = $('#atelier-next-cities');
    if (!el) return;
    var names = STORES.map(function (s) { return B.loc(s.city); });
    var list = names.length > 1 ?
      names.slice(0, -1).join(B.lang === 'ckb' ? '، ' : ', ') + ' ' + B.t('atelier.and') + ' ' + names[names.length - 1] : names.join('');
    setText(el, B.t('atelier.next.visit.text', { cities: list }));
  }
  function fillIcons() {
    $$('[data-icon]').forEach(function (el) {
      var svg = B.icon(el.getAttribute('data-icon'));
      if (!svg) return;
      if (el.className) { el.innerHTML = svg; el.removeAttribute('data-icon'); }
      else el.outerHTML = svg;
    });
  }

  B.page(function () {
    fillIcons();
    renderMethods();
    renderFee();
    renderCities();
    // arriving on atelier.html#appointment from another page: land below the header, after our own rendering
    var id = '';
    try { id = decodeURIComponent((w.location.hash || '').slice(1)); } catch (e) { id = ''; }
    var target = id ? d.getElementById(id) : null;
    if (target) B.scrollTo(target, { immediate: true });
  });

  /* ===========================================================================
     12. Language & currency · overlays
     ======================================================================== */
  B.on('langchange', function () {
    if (stage && state.item) {
      syncLeathers();
      renderLeatherInfo();
      renderSamples();
      renderInitialsUI();
      renderSummary();
      if (tag) tag.set({ label: previewLabel() });
    }
    renderCityOptions();
    renderMethods();
    renderFee();
    renderCities();
    renderSuccess();
  });
  B.on('currencychange', function () {
    if (stage && state.item) renderSummary();
    renderFee();
  });

  // the live tag rests while an overlay (menu, search, drawer, dialog) covers the page
  if (w.MutationObserver) {
    var covered = false;
    new MutationObserver(function () {
      var now = html.classList.contains('is-menu-open') || html.classList.contains('is-locked');
      if (now === covered) return;
      covered = now;
      if (tag) { if (now) tag.pause(); else tag.resume(); }
    }).observe(html, { attributes: true, attributeFilter: ['class'] });
  }
})(window, document, window.BENM);
