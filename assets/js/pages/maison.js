/* =============================================================================
   Ben.M — Maison (The House)                         assets/js/pages/maison.js
   -----------------------------------------------------------------------------
   Page behaviour for maison.html (classic script, after main.js + leather.js).

     0  Strings (maison.*)               5  Materials — leather.js swatches,
     1  Helpers                             pointer sheen
     2  Hero — scroll-out                6  House colours — selector → atelier
     3  Story — numeral drift            7  Shared: icons, language changes
     4  Craft — pinned timeline ≥1024 px 8  Deep links (#craft #materials #care)
        (RTL mirrored) / stacked reveals

   Rules: every GSAP/ScrollTrigger target is guarded; direction-dependent
   motion reads BENM.isRTL(); reduced motion → final states, no pin/scrub;
   WebGL: only the shared snapshot context (BENM.Leather.snapshot).
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
      'maison.meta.title': 'The House of Ben.M — Craft, leathers & care',
      'maison.meta.description': 'The philosophy behind Ben.M: genuine leather chosen by hand, the six steps of the craft, the leathers we work with and how to care for them.',

      'maison.hero.eyebrow': 'Our story, our craft',
      'maison.hero.caption': 'Hides, before the first cut',
      'maison.hero.alt': 'Raw leather hides laid out on dark cobblestones',
      'maison.hero.line1': 'The House',
      'maison.hero.line2': '<span class="maison-hero__of">of</span> <em>Ben.M</em>',
      'maison.hero.lead': 'We make few things, and we make them slowly — in genuine leather, by hand, to be worn for years and mended when they need it.',
      'maison.hero.index': 'On this page',
      'maison.hero.i1': 'The story',
      'maison.hero.i2': 'The craft',
      'maison.hero.i3': 'Leathers',
      'maison.hero.i4': 'Principles',
      'maison.hero.i5': 'Care',
      'maison.hero.scroll': 'Scroll',

      'maison.story.eyebrow': 'The story',
      'maison.story.title': 'A house built on <em>three convictions.</em>',
      'maison.story.lead': 'Ben.M is built on a simple idea: the things we wear and carry every day deserve to be made properly. Not more of them — better ones.',
      'maison.ch1.label': 'Chapter I',
      'maison.ch1.title': 'Genuine, <em>nothing less.</em>',
      'maison.ch1.text': 'We work only with genuine leather — never bonded, coated or imitation materials. Real leather breathes, softens and shapes itself to the person who wears it, and it is the only material we trust to age well.',
      'maison.ch1.caption': 'Marking the pattern',
      'maison.ch1.alt': 'An artisan’s hands marking a pattern onto a hide before cutting',
      'maison.ch2.label': 'Chapter II',
      'maison.ch2.title': 'Patience as <em>a material.</em>',
      'maison.ch2.text': 'Leather cannot be rushed. Glue is left to set, edges are burnished in layers, a polish is built up by hand. Each step waits for the one before it — time is the one ingredient we never cut.',
      'maison.ch2.caption': 'At the bench',
      'maison.ch2.alt': 'A master craftsman at his workbench in a leather workshop',
      'maison.ch3.label': 'Chapter III',
      'maison.ch3.title': 'Made to be <em>repaired.</em>',
      'maison.ch3.text': 'A well-made thing should outlive its first season, and even its first owner. So we build with seams that can be sewn again, edges that can be refinished and leather that can be polished back to life.',
      'maison.ch3.caption': 'The tools of the trade',
      'maison.ch3.alt': 'Leatherworking tools laid out on a worn wooden bench',

      'maison.craft.eyebrow': 'The craft',
      'maison.craft.title': 'Six steps, <em>no shortcuts.</em>',
      'maison.craft.lead': 'From the hide to the final polish, every piece passes through the same six moments. None of them can be hurried.',
      'maison.craft.hint': 'Scroll to follow the hide',
      'maison.craft.timeline': 'The six steps',
      'maison.craft.goto': 'Step {n} of {total}: {label}',
      'maison.craft.s1.label': 'Selection',
      'maison.craft.s1.title': 'Selection of hides',
      'maison.craft.s1.text': 'Every piece begins with a whole hide, unrolled and read in daylight. We study its grain, its thickness and its natural marks, and keep only the parts fit for a lifetime of wear.',
      'maison.craft.s1.alt': 'Stacked hides of brown and tan leather, chosen by hand',
      'maison.craft.s2.label': 'Cutting',
      'maison.craft.s2.title': 'Pattern & cutting',
      'maison.craft.s2.text': 'Patterns are laid on the leather and every part is cut along the direction of the grain, so the pieces stretch and settle together. Flaws are worked around, never hidden.',
      'maison.craft.s2.alt': 'Round knife and freshly cut leather pieces on the cutting table',
      'maison.craft.s3.label': 'Skiving',
      'maison.craft.s3.title': 'Skiving & preparation',
      'maison.craft.s3.text': 'Edges are thinned with a sharp blade so that seams lie flat and folds turn cleanly. Stitch lines are marked and the holes pricked by hand, evenly spaced.',
      'maison.craft.s3.alt': 'Artisan marking stitch holes along a leather edge with a pricking iron',
      'maison.craft.s4.label': 'Stitching',
      'maison.craft.s4.title': 'Stitched by hand',
      'maison.craft.s4.text': 'Two needles and one waxed thread, pulled tight stitch by stitch. A saddle stitch holds even if a thread is cut — which is why it is worth every hour it takes.',
      'maison.craft.s4.alt': 'Hand saddle-stitching with waxed thread at a stitching clam',
      'maison.craft.s5.label': 'Lasting',
      'maison.craft.s5.title': 'Lasting & assembly',
      'maison.craft.s5.text': 'For shoes, the upper is drawn over a wooden last and left to take its shape before the sole is attached. For bags, panels, gussets and handles come together piece by piece.',
      'maison.craft.s5.alt': 'Shoes shaped on wooden lasts on a shoemaker’s bench',
      'maison.craft.s6.label': 'Finishing',
      'maison.craft.s6.title': 'Finishing & polishing',
      'maison.craft.s6.text': 'Edges are sanded, dyed and burnished. The leather is fed, then polished by hand in thin layers until it takes on a soft, deep shine — ready to leave the bench.',
      'maison.craft.s6.alt': 'Hand-polishing a dark leather shoe with a brush and wax',
      'maison.craft.outro': 'From hide to hand — <em>nothing hurried.</em>',
      'maison.craft.next': 'Discover the leathers',

      'maison.materials.eyebrow': 'Leathers & materials',
      'maison.materials.title': 'Six leathers, <em>six characters.</em>',
      'maison.materials.text': 'Each leather wears, softens and ages in its own way. This is how ours look and feel — and how to keep each one at its best.',
      'maison.m.care': 'Care',
      'maison.m.calf.name': 'Full-grain calf',
      'maison.m.calf.finish': 'Smooth · the natural grain intact',
      'maison.m.calf.text': 'The strong outer layer of the hide, kept whole with its natural grain. Smooth and breathable, it darkens into a rich patina with every year of wear.',
      'maison.m.calf.care': 'Brush after wearing; a little neutral cream every few weeks.',
      'maison.m.suede.name': 'Suede',
      'maison.m.suede.finish': 'Napped · the inner side of the hide',
      'maison.m.suede.text': 'The inner side of the hide, buffed into a soft, velvety nap. Light and supple, with a deep, matt colour that catches the light as it moves.',
      'maison.m.suede.care': 'Lift the nap with a suede brush; protect it before the first wear.',
      'maison.m.nubuck.name': 'Nubuck',
      'maison.m.nubuck.finish': 'Sanded · a fine, short nap',
      'maison.m.nubuck.text': 'The outer grain, lightly sanded to a fine, short nap — softer to the touch than calf, finer and more even than suede.',
      'maison.m.nubuck.care': 'A nubuck eraser for marks, a soft brush, and distance from water.',
      'maison.m.pebble.name': 'Pebbled grain',
      'maison.m.pebble.finish': 'Grained · lively and resilient',
      'maison.m.pebble.text': 'A raised, pebbled surface with a lively texture that shrugs off scratches and keeps its shape — made for things that are used every day.',
      'maison.m.pebble.care': 'Wipe with a damp cloth; condition lightly once or twice a year.',
      'maison.m.polished.name': 'Polished calf',
      'maison.m.polished.finish': 'Shell-style · a deep, glassy shine',
      'maison.m.polished.text': 'Calf finished with layers of wax and patient hand polishing, until the surface glows like lacquer — the classic finish of a dress shoe.',
      'maison.m.polished.care': 'Buff with a soft cloth; refresh the shine with a little wax.',
      'maison.m.veg.name': 'Vegetable-tanned',
      'maison.m.veg.finish': 'Plant-tanned · firm, then honeyed',
      'maison.m.veg.text': 'Tanned slowly with natural plant extracts. Firm at first, it softens, darkens and takes on a warm, honeyed patina over the years.',
      'maison.m.veg.care': 'Keep it dry and lightly conditioned; let the patina come in its own time.',

      'maison.colours.title': 'The house <em>colours.</em>',
      'maison.colours.text': 'Eight colours we return to, season after season. Choose one to see its character.',
      'maison.colours.cta': 'Personalise it in {name}',
      'maison.grain.pebble': 'Pebbled grain',
      'maison.grain.smooth': 'Smooth calf',
      'maison.grain.suede': 'Suede',

      'maison.values.eyebrow': 'Our principles',
      'maison.values.title': 'Fewer things, <em>made better,</em> kept longer.',
      'maison.values.v1.title': 'Genuine leather only',
      'maison.values.v1.text': 'Real leather, chosen hide by hide. No bonded leather, no plastic coatings, no imitations dressed up as the real thing.',
      'maison.values.v2.title': 'Considered details',
      'maison.values.v2.text': 'Edges burnished, threads waxed, linings finished. The parts you rarely see are given the same care as the parts you do.',
      'maison.values.v3.title': 'Made to be repaired',
      'maison.values.v3.text': 'We design for a long life: seams that can be stitched again, soles that can be renewed, leather that can be fed and polished back to its best.',
      'maison.values.v4.title': 'Service beyond the sale',
      'maison.values.v4.text': 'A piece is not finished when it leaves our hands. Fit, care and repair are conversations we are always glad to have.',

      'maison.care.eyebrow': 'Leather care',
      'maison.care.title': 'Look after it, <em>and it will last.</em>',
      'maison.care.lead': 'Good leather asks for very little — some rest, a little cream and a dry place to sleep. Six habits keep it beautiful for years.',
      'maison.care.caption': 'Brushes, cream and wax',
      'maison.care.alt': 'A wooden shoe-care box with brushes and polish tins',
      'maison.care.s1.title': 'Rest between wears',
      'maison.care.s1.text': 'Leather needs a day to breathe. Alternate your shoes and give each pair at least a day off, so that moisture can dry out and the leather can recover its shape.',
      'maison.care.s2.title': 'Use shoe trees',
      'maison.care.s2.text': 'Cedar shoe trees draw out moisture and smooth the creases while the leather is still warm. Slip them in as soon as you take your shoes off.',
      'maison.care.s3.title': 'Condition',
      'maison.care.s3.text': 'Every few weeks, work a little neutral cream into clean leather with a soft cloth. It keeps the fibres supple and stops the surface from drying and cracking.',
      'maison.care.s4.title': 'Protect from rain',
      'maison.care.s4.text': 'If leather gets wet, blot it gently and let it dry slowly, filled with paper and away from radiators or direct sun. Suede and nubuck like a protective spray before the first wear.',
      'maison.care.s5.title': 'Brush & polish',
      'maison.care.s5.text': 'Brush off the dust after every wear. To polish, apply a thin layer of cream or wax in a matching shade, let it rest, then buff to a soft shine.',
      'maison.care.s6.title': 'Store in the dust bag',
      'maison.care.s6.text': 'Keep each piece in a breathable dust bag, out of direct light. Fill bags lightly with tissue so they hold their shape, and never store leather in plastic.',
      'maison.care.more': 'Something needs more than care? Our boutiques can advise on polishing and repairs.',
      'maison.care.moreLink': 'Care & repair questions',

      'maison.doors.title': 'Where to next',
      'maison.doors.shop.title': 'Shop the <em>collection</em>',
      'maison.doors.shop.text': 'Shoes, bags and the small things you carry — in genuine leather, finished by hand.',
      'maison.doors.shop.cta': 'Enter the collection',
      'maison.doors.atelier.title': 'Make it <em>yours</em>',
      'maison.doors.atelier.text': 'Up to three initials, debossed by hand in gold, silver or blind — a quiet signature on something you will keep.',
      'maison.doors.atelier.cta': 'Visit the atelier'
    },
    ckb: {
      'maison.meta.title': 'ماڵی Ben.M — وەستایی، چەرم و چاودێری',
      'maison.meta.description': 'فەلسەفەی پشت Ben.M: چەرمی ڕەسەن کە بە دەست هەڵدەبژێردرێت، شەش هەنگاوەکەی وەستایی، ئەو چەرمانەی کاریان پێدەکەین و چۆنیەتیی چاودێریکردنیان.',

      'maison.hero.eyebrow': 'چیرۆک و وەستاییمان',
      'maison.hero.caption': 'پێستەکان، پێش یەکەم بڕین',
      'maison.hero.alt': 'پێستی خاوی چەرم کە لەسەر بەردی ڕەشی شەقامێک ڕاخراون',
      'maison.hero.line1': 'ماڵی',
      'maison.hero.line2': '<span class="maison-hero__brand" lang="en">Ben.M</span>',
      'maison.hero.lead': 'شتی کەم دروست دەکەین، و بە هێمنی دروستیان دەکەین — لە چەرمی ڕەسەن، بە دەست، بۆ ئەوەی ساڵانێک لەبەر بکرێن و هەر کاتێک پێویست بوو چاک بکرێنەوە.',
      'maison.hero.index': 'لەم پەڕەیەدا',
      'maison.hero.i1': 'چیرۆکەکە',
      'maison.hero.i2': 'وەستایی',
      'maison.hero.i3': 'چەرمەکان',
      'maison.hero.i4': 'بنەماکان',
      'maison.hero.i5': 'چاودێری',
      'maison.hero.scroll': 'بڕۆ خوارەوە',

      'maison.story.eyebrow': 'چیرۆکەکە',
      'maison.story.title': 'ماڵێک لەسەر <em>سێ باوەڕ</em> بنیات نراوە.',
      'maison.story.lead': 'Ben.M لەسەر بیرۆکەیەکی سادە بنیات نراوە: ئەو شتانەی هەموو ڕۆژێک لەبەریان دەکەین و هەڵیان دەگرین، شایەنی ئەوەن بە شێوەیەکی دروست دروست بکرێن. نەک زیاتر — بەڵکو باشتر.',
      'maison.ch1.label': 'بەشی یەکەم',
      'maison.ch1.title': 'ڕەسەن، <em>بێ سازان.</em>',
      'maison.ch1.text': 'تەنها لەگەڵ چەرمی ڕەسەن کار دەکەین — هەرگیز چەرمی لکێنراو، ڕووپۆشکراو یان لاساییکراوە بەکارناهێنین. چەرمی ڕاستەقینە هەناسە دەدات، نەرم دەبێت و لەگەڵ ئەو کەسەی لەبەری دەکات دەگونجێت؛ تاکە کەرەستەیەکە کە متمانەمان پێیەتی بە جوانی بەساڵدا بچێت.',
      'maison.ch1.caption': 'نیشانەکردنی قاڵب',
      'maison.ch1.alt': 'دەستەکانی وەستایەک کە پێش بڕین قاڵبێک لەسەر پێستێک نیشانە دەکەن',
      'maison.ch2.label': 'بەشی دووەم',
      'maison.ch2.title': 'پشوودرێژی <em>وەک کەرەستەیەک.</em>',
      'maison.ch2.text': 'چەرم پەلەی تێدا ناکرێت. ڕێگە دەدرێت چەسپەکە بگیرێت، لێوارەکان چین بە چین ساف و بریقەدار دەکرێن، و بریقەکە بە دەست دروست دەکرێت. هەر هەنگاوێک چاوەڕێی هەنگاوی پێش خۆی دەکات — کات تاکە پێکهاتەیە کە هەرگیز کەمی ناکەینەوە.',
      'maison.ch2.caption': 'لەسەر مێزی کار',
      'maison.ch2.alt': 'وەستایەکی شارەزا لەسەر مێزی کارەکەی لە کارگەیەکی چەرمدا',
      'maison.ch3.label': 'بەشی سێیەم',
      'maison.ch3.title': 'دروستکراوە بۆ ئەوەی <em>چاک بکرێتەوە.</em>',
      'maison.ch3.text': 'شتێک کە باش دروستکرابێت، دەبێت لە یەکەم وەرزی خۆی و تەنانەت لە یەکەم خاوەنیشی زیاتر بژی. بۆیە بە دوورینێک دروستی دەکەین کە دەکرێت دووبارە بدوورێتەوە، بە لێوارێک کە دەکرێت نوێ بکرێتەوە، و بە چەرمێک کە بە بریقەدان دەگەڕێتەوە بۆ ژیان.',
      'maison.ch3.caption': 'ئامرازەکانی پیشەکە',
      'maison.ch3.alt': 'ئامرازەکانی کاری چەرم کە لەسەر مێزێکی داری کۆن ڕیز کراون',

      'maison.craft.eyebrow': 'وەستایی',
      'maison.craft.title': 'شەش هەنگاو، <em>بێ کورتبڕ.</em>',
      'maison.craft.lead': 'لە پێستەوە تا دوایین بریقەدان، هەموو پارچەیەک بەم شەش ساتەدا تێدەپەڕێت. هیچ کامیان پەلەی تێدا ناکرێت.',
      'maison.craft.hint': 'بڕۆ خوارەوە و شوێن پێستەکە بکەوە',
      'maison.craft.timeline': 'شەش هەنگاوەکە',
      'maison.craft.goto': 'هەنگاوی {n} لە {total}: {label}',
      'maison.craft.s1.label': 'هەڵبژاردن',
      'maison.craft.s1.title': 'هەڵبژاردنی پێست',
      'maison.craft.s1.text': 'هەموو پارچەیەک بە پێستێکی تەواو دەست پێدەکات، کە لە ڕووناکیی ڕۆژدا دەکرێتەوە و دەخوێنرێتەوە. ڕووەکەی، ئەستووریی و نیشانە سروشتییەکانی دەپشکنین، و تەنها ئەو بەشانە هەڵدەگرین کە شایەنی تەمەنێک لەبەرکردنن.',
      'maison.craft.s1.alt': 'پێستی چەرمی قاوەیی و هەنگوینی کە بە دەست هەڵبژێردراون و لەسەر یەک دانراون',
      'maison.craft.s2.label': 'بڕین',
      'maison.craft.s2.title': 'قاڵب و بڕین',
      'maison.craft.s2.text': 'قاڵبەکان لەسەر چەرمەکە دادەنرێن و هەموو بەشێک بە ئاڕاستەی ڕووی چەرمەکە دەبڕدرێت، تا پارچەکان پێکەوە بکشێن و جێگیر ببن. کەموکوڕییەکان لادەدرێن، هەرگیز ناشاردرێنەوە.',
      'maison.craft.s2.alt': 'چەقۆی خڕ و پارچە چەرمی تازە بڕاو لەسەر مێزی بڕین',
      'maison.craft.s3.label': 'تەنککردنەوە',
      'maison.craft.s3.title': 'تەنککردنەوە و ئامادەکاری',
      'maison.craft.s3.text': 'لێوارەکان بە تیغێکی تیژ تەنک دەکرێنەوە، تا دوورینەکان ڕێک بخەون و قەدکردنەکان پاک بن. هێڵی دوورین نیشانە دەکرێت و کونەکان بە دەست و بە دووریی یەکسان کون دەکرێن.',
      'maison.craft.s3.alt': 'وەستایەک بە ئامرازی کونکردن، کونی دوورین بە درێژایی لێواری چەرمێک نیشانە دەکات',
      'maison.craft.s4.label': 'دوورین',
      'maison.craft.s4.title': 'بە دەست دوورراو',
      'maison.craft.s4.text': 'دوو دەرزی و یەک داوی مۆمکراو، کە کوک بە کوک بە توندی دەکێشرێن. ئەم جۆرە دوورینە تەنانەت ئەگەر داوێکیش ببڕدرێت هەر دەمێنێتەوە — بۆیە شایەنی هەموو ئەو کاتژمێرانەیە کە دەیخایەنێت.',
      'maison.craft.s4.alt': 'دوورینی دەستی بە داوی مۆمکراو لەناو گیرەی دوورین',
      'maison.craft.s5.label': 'قاڵبگرتن',
      'maison.craft.s5.title': 'قاڵبگرتن و پێکەوەنان',
      'maison.craft.s5.text': 'بۆ پێڵاو، ڕووی پێڵاوەکە بەسەر قاڵبێکی داریندا دەکێشرێت و بەجێدەهێڵرێت تا شێوەی خۆی بگرێت، پێش ئەوەی بنەکەی بخرێتە سەر. بۆ جانتا، پارچەکان، لاتەنیشتەکان و دەسکەکان یەک بە یەک پێکەوە دەنرێن.',
      'maison.craft.s5.alt': 'پێڵاو کە لەسەر قاڵبی دارین، لەسەر مێزی پێڵاودروو شێوە دەگرن',
      'maison.craft.s6.label': 'تەواوکردن',
      'maison.craft.s6.title': 'تەواوکردن و بریقەدان',
      'maison.craft.s6.text': 'لێوارەکان سووان دەکرێن، ڕەنگ دەکرێن و ساف دەکرێنەوە. چەرمەکە خۆراکی پێدەدرێت، پاشان بە دەست و چین بە چین بریقەی پێدەدرێت، تا بریقەیەکی نەرم و قووڵ وەردەگرێت — ئامادە بۆ جێهێشتنی مێزی کار.',
      'maison.craft.s6.alt': 'بریقەدارکردنی پێڵاوێکی چەرمی تۆخ بە دەست، بە فڵچە و مۆم',
      'maison.craft.outro': 'لە پێستەوە تا دەستی تۆ — <em>بێ هیچ پەلەیەک.</em>',
      'maison.craft.next': 'چەرمەکان بناسە',

      'maison.materials.eyebrow': 'چەرم و کەرەستەکان',
      'maison.materials.title': 'شەش چەرم، <em>شەش سروشت.</em>',
      'maison.materials.text': 'هەر چەرمێک بە شێوەی خۆی لەبەر دەکرێت، نەرم دەبێت و بەساڵدا دەچێت. ئەمە ئەوەیە کە چەرمەکانمان چۆن دەردەکەون و چ هەستێک دەبەخشن — و چۆن هەر یەکەیان لە باشترین باری خۆیدا بهێڵیتەوە.',
      'maison.m.care': 'چاودێری',
      'maison.m.calf.name': 'گوێرەکەی ڕووتەواو',
      'maison.m.calf.finish': 'ساف · ڕووە سروشتییەکەی پارێزراوە',
      'maison.m.calf.text': 'چینی دەرەوەی پتەوی پێستەکە، کە بە ڕووە سروشتییەکەیەوە بە تەواوی دەهێڵرێتەوە. ساف و هەناسەدەرە، و لەگەڵ هەموو ساڵێکی لەبەرکردندا ڕەنگێکی قووڵ و دەوڵەمەند وەردەگرێت.',
      'maison.m.calf.care': 'دوای لەبەرکردن فڵچەی بکە؛ هەر چەند هەفتەیەک کەمێک کرێمی بێڕەنگ.',
      'maison.m.suede.name': 'چەرمی مەخمەڵی',
      'maison.m.suede.finish': 'نەرم وەک مەخمەڵ · ڕووی ناوەوەی پێست',
      'maison.m.suede.text': 'ڕووی ناوەوەی پێستەکە، کە سووان دەکرێت تا ڕووێکی نەرم و مەخمەڵی وەردەگرێت. سووک و نەرمە، بە ڕەنگێکی قووڵ و بێبریقە کە لەگەڵ جووڵەدا ڕووناکی دەگرێت.',
      'maison.m.suede.care': 'بە فڵچەی تایبەت مووەکەی زیندوو بکەرەوە؛ پێش یەکەم لەبەرکردن بیپارێزە.',
      'maison.m.nubuck.name': 'نووباک',
      'maison.m.nubuck.finish': 'سووانکراو · موویەکی ورد و کورت',
      'maison.m.nubuck.text': 'ڕووی دەرەوەی پێست، کە بە سووکی سووان دەکرێت تا موویەکی ورد و کورتی دەبێت — بۆ دەستلێدان لە گوێرەکە نەرمترە، و لە چەرمی مەخمەڵی وردتر و یەکسانترە.',
      'maison.m.nubuck.care': 'لاستیکی نووباک بۆ پەڵەکان، فڵچەیەکی نەرم، و دووری لە ئاو.',
      'maison.m.pebble.name': 'چەرمی دەنکدار',
      'maison.m.pebble.finish': 'دەنکدار · زیندوو و بەرگەگر',
      'maison.m.pebble.text': 'ڕووێکی بەرز و دەنکدار، بە ڕووخسارێکی زیندوو کە خوشین هەڵناگرێت و شێوەی خۆی دەپارێزێت — بۆ ئەو شتانەی هەموو ڕۆژێک بەکاردێن.',
      'maison.m.pebble.care': 'بە پەڕۆیەکی شێدار پاکی بکەرەوە؛ ساڵی یەک یان دوو جار کەمێک خۆراکی پێبدە.',
      'maison.m.polished.name': 'گوێرەکەی بریقەدار',
      'maison.m.polished.finish': 'بریقەدار · درەوشانەوەیەکی قووڵ وەک شووشە',
      'maison.m.polished.text': 'گوێرەکەیەک کە بە چەند چینێک مۆم و بریقەدانی دەستیی پشوودرێژ تەواو دەکرێت، تا ڕووەکەی وەک لاک دەدرەوشێتەوە — تەواوکاریی کلاسیکی پێڵاوی فەرمی.',
      'maison.m.polished.care': 'بە پەڕۆیەکی نەرم بیسوو؛ بە کەمێک مۆم بریقەکەی نوێ بکەرەوە.',
      'maison.m.veg.name': 'خۆشکراو بە ڕووەک',
      'maison.m.veg.finish': 'خۆشکراوی ڕووەکی · سەرەتا ڕەق، پاشان هەنگوینی',
      'maison.m.veg.text': 'بە هێواشی و بە ماددەی سروشتیی ڕووەکی خۆش دەکرێت. سەرەتا ڕەقە، پاشان نەرم دەبێت، تۆخ دەبێتەوە و بە تێپەڕبوونی ساڵان ڕەنگێکی گەرم و هەنگوینی وەردەگرێت.',
      'maison.m.veg.care': 'وشک و بە کەمێک خۆراکەوە بیهێڵەرەوە؛ لێگەڕێ ڕەنگە کۆنەکەی لە کاتی خۆیدا بێت.',

      'maison.colours.title': 'ڕەنگەکانی <em>ماڵەکە.</em>',
      'maison.colours.text': 'هەشت ڕەنگ کە وەرز لە دوای وەرز بۆیان دەگەڕێینەوە. یەکێکیان هەڵبژێرە بۆ ئەوەی سروشتەکەی ببینیت.',
      'maison.colours.cta': 'بە ڕەنگی {name} تایبەتی بکە',
      'maison.grain.pebble': 'چەرمی دەنکدار',
      'maison.grain.smooth': 'چەرمی ساف',
      'maison.grain.suede': 'چەرمی مەخمەڵی',

      'maison.values.eyebrow': 'بنەماکانمان',
      'maison.values.title': 'شتی کەمتر، <em>باشتر دروستکراو،</em> و بۆ ماوەیەکی درێژتر.',
      'maison.values.v1.title': 'تەنها چەرمی ڕەسەن',
      'maison.values.v1.text': 'چەرمی ڕاستەقینە، کە پێست بە پێست هەڵدەبژێردرێت. نە چەرمی لکێنراو، نە ڕووپۆشی پلاستیکی، نە لاساییکراوەیەک کە خۆی وەک ڕەسەن پیشان بدات.',
      'maison.values.v2.title': 'وردەکاریی بیرلێکراوە',
      'maison.values.v2.text': 'لێوارەکان ساف و بریقەدار دەکرێن، داوەکان مۆم دەکرێن، ناوپۆشەکان تەواو دەکرێن. ئەو بەشانەی کەم دەبینرێن، هەمان گرنگییان پێدەدرێت وەک ئەوانەی دەبینرێن.',
      'maison.values.v3.title': 'بۆ چاککردنەوە دروستکراوە',
      'maison.values.v3.text': 'بۆ تەمەنێکی درێژ دیزاین دەکەین: دوورینێک کە دەکرێت دووبارە بدوورێتەوە، بنێک کە دەکرێت نوێ بکرێتەوە، و چەرمێک کە خۆراکی پێدەدرێت و بریقەی دەدرێتەوە تا دەگەڕێتەوە باشترین باری خۆی.',
      'maison.values.v4.title': 'خزمەتگوزاری لە دوای کڕین',
      'maison.values.v4.text': 'پارچەیەک کاتێک دەستمان بەجێدەهێڵێت تەواو نابێت. قەبارە، چاودێری و چاککردنەوە ئەو گفتوگۆیانەن کە هەمیشە بە خۆشحاڵییەوە دەیانکەین.',

      'maison.care.eyebrow': 'چاودێریی چەرم',
      'maison.care.title': 'چاودێری بکە، <em>بۆت دەمێنێتەوە.</em>',
      'maison.care.lead': 'چەرمی باش داوای زۆر شت ناکات — کەمێک پشوو، کەمێک کرێم و شوێنێکی وشک بۆ پشوودان. شەش خوو بۆ ساڵانێک جوانی دەهێڵنەوە.',
      'maison.care.caption': 'فڵچە، کرێم و مۆم',
      'maison.care.alt': 'سندووقێکی داری چاودێریی پێڵاو، بە فڵچە و قوتووی بۆیاخەوە',
      'maison.care.s1.title': 'لە نێوان لەپێکردنەکاندا پشووی پێبدە',
      'maison.care.s1.text': 'چەرم پێویستی بە ڕۆژێک هەیە بۆ هەناسەدان. پێڵاوەکانت بگۆڕەوە و لانیکەم ڕۆژێک پشوو بە هەر جووتێک بدە، تا شێیەکەی وشک ببێتەوە و چەرمەکە شێوەی خۆی وەربگرێتەوە.',
      'maison.care.s2.title': 'قاڵبی پێڵاو بەکاربهێنە',
      'maison.care.s2.text': 'قاڵبی داری ئەرز شێ هەڵدەمژێت و چرچەکان ڕێک دەکاتەوە، لە کاتێکدا چەرمەکە هێشتا گەرمە. هەر کە پێڵاوەکانت داکەند، قاڵبەکانیان تێ بکە.',
      'maison.care.s3.title': 'خۆراکی پێبدە',
      'maison.care.s3.text': 'هەر چەند هەفتەیەک جارێک، بە پەڕۆیەکی نەرم کەمێک کرێمی بێڕەنگ لە چەرمی پاک بدە. ڕیشاڵەکانی نەرم دەهێڵێتەوە و ناهێڵێت ڕووەکەی وشک ببێت و درز ببات.',
      'maison.care.s4.title': 'لە باران بیپارێزە',
      'maison.care.s4.text': 'ئەگەر چەرم تەڕ بوو، بە نەرمی وشکی بکەرەوە، کاغەزی تێ بکە و لێگەڕێ بە هێواشی وشک ببێتەوە، دوور لە سۆبە و تیشکی ڕاستەوخۆی خۆر. چەرمی مەخمەڵی و نووباک پێش یەکەم لەبەرکردن سپرەیەکی پارێزەریان پێویستە.',
      'maison.care.s5.title': 'فڵچە و بریقەدان',
      'maison.care.s5.text': 'دوای هەموو لەبەرکردنێک تۆزەکەی بە فڵچە لابە. بۆ بریقەدان، چینێکی تەنک کرێم یان مۆمی هاوڕەنگی لێبدە، کەمێک بیهێڵەرەوە، پاشان بیسوو تا بریقەیەکی نەرم وەردەگرێت.',
      'maison.care.s6.title': 'لە کیسەی پاراستندا هەڵیبگرە',
      'maison.care.s6.text': 'هەر پارچەیەک لە کیسەیەکی پاراستنی هەناسەدەردا هەڵبگرە، دوور لە ڕووناکیی ڕاستەوخۆ. جانتاکان بە کاغەزی نەرم کەمێک پڕ بکە تا شێوەی خۆیان بپارێزن، و هەرگیز چەرم لە ناو نایلۆندا هەڵمەگرە.',
      'maison.care.more': 'شتێک پێویستی بە زیاتر لە چاودێرییە؟ فرۆشگاکانمان دەتوانن لەبارەی بریقەدان و چاککردنەوە ئامۆژگاریت بکەن.',
      'maison.care.moreLink': 'پرسیارەکانی چاودێری و چاککردنەوە',

      'maison.doors.title': 'دواتر بۆ کوێ',
      'maison.doors.shop.title': '<em>کۆلێکشنەکە</em> ببینە',
      'maison.doors.shop.text': 'پێڵاو، جانتا و ئەو شتە بچووکانەی لەگەڵ خۆت هەڵیاندەگریت — لە چەرمی ڕەسەن، بە دەست تەواوکراو.',
      'maison.doors.shop.cta': 'بچۆ ناو کۆلێکشنەکە',
      'maison.doors.atelier.title': 'بیکە بە <em>هی خۆت</em>',
      'maison.doors.atelier.text': 'تا سێ پیتی سەرەتایی، بە دەست مۆر دەکرێن بە زێڕین، زیوین یان بێڕەنگ — واژۆیەکی هێمن لەسەر شتێک کە دەیهێڵیتەوە.',
      'maison.doors.atelier.cta': 'سەردانی ئاتێلیە بکە'
    }
  });

  /* ===========================================================================
     1. Helpers
     ======================================================================== */
  var gsap = w.gsap || null;
  var ST = w.ScrollTrigger || null;
  var RM = !!B.reducedMotion || !gsap || !ST;          // reduced motion, or no GSAP: final states only
  var mm = !RM && gsap.matchMedia ? gsap.matchMedia() : null;
  var FINE = media('(hover: hover) and (pointer: fine)');
  var LEATHERS = w.BENM_LEATHERS || [];
  var main = d.getElementById('main');

  function media(q) { try { return w.matchMedia(q).matches; } catch (e) { return false; } }
  function $(sel, root) { return (root || d).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || d).querySelectorAll(sel)); }
  function pad2(n) { return n < 10 ? '0' + n : String(n); }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
  function esc(s) { return B.esc ? B.esc(s) : String(s == null ? '' : s); }
  function otherLang() { return B.lang === 'ckb' ? 'en' : 'ckb'; }
  function leatherById(id) {
    for (var i = 0; i < LEATHERS.length; i++) if (LEATHERS[i].id === id) return LEATHERS[i];
    return null;
  }
  // Leather snapshots read pixels back from the GPU (a short stall each): render them one at a time, in
  // idle time and never while the page is scrolling, so passing the section never stutters
  var snapQueue = [], snapBusy = false, lastScroll = 0;
  var idle = w.requestIdleCallback ? function (fn) { w.requestIdleCallback(fn, { timeout: 700 }); } : function (fn) { setTimeout(fn, 60); };
  // (Lenis scrolls the window natively, so window scroll events cover smooth scrolling too)
  w.addEventListener('scroll', function () { lastScroll = Date.now(); }, { passive: true });
  function queueSnap(job) { snapQueue.push(job); pumpSnaps(); }
  function pumpSnaps() {
    if (snapBusy || !snapQueue.length) return;
    snapBusy = true;
    var waited = 0;
    idle(function run() {
      // wait for a pause in scrolling, but never more than ~1.5 s
      if (Date.now() - lastScroll < 200 && waited < 1500) { waited += 200; setTimeout(function () { idle(run); }, 200); return; }
      var job = snapQueue.shift(), p = null;
      try { p = job(); } catch (e) { console.error(e); }
      var next = function () { snapBusy = false; pumpSnaps(); };
      if (p && p.then) p.then(next, next); else next();
    });
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

  /* ===========================================================================
     2. Hero — the headline drifts up and the veil deepens as it scrolls away
        (the intro itself is declarative: data-reveal + a CSS photo settle)
     ======================================================================== */
  var hero = $('.maison-hero');
  B.page(function () {
    if (!hero || RM) return;
    var headline = $('.maison-hero__headline', hero);
    var shade = $('.maison-hero__shade', hero);
    var fades = [$('.maison-hero__top', hero), $('.maison-hero__foot', hero)].filter(Boolean);
    var tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
    });
    if (headline) tl.to(headline, { yPercent: -26, opacity: 0.18 }, 0);
    if (shade) tl.fromTo(shade, { opacity: 0 }, { opacity: 0.72 }, 0);
    if (fades.length) tl.to(fades, { opacity: 0, duration: 0.45 }, 0);
  });

  /* ===========================================================================
     3. Story — the big numerals drift against the scroll
     ======================================================================== */
  B.page(function () {
    if (RM) return;
    $$('.maison-chapter').forEach(function (ch) {
      var n = $('.maison-chapter__numeral', ch);
      if (!n) return;
      gsap.fromTo(n, { yPercent: 10 }, {
        yPercent: -10, ease: 'none',
        scrollTrigger: { trigger: ch, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
  });

  /* ===========================================================================
     4. The craft — six steps
        ≥1024 px (and tall enough) with motion: pinned horizontal timeline,
        RTL mirrored, foil progress line + named ticks, per-step parallax.
        Otherwise: a stacked sequence with scroll reveals. Reduced motion:
        the stacked sequence, static. Both modes live in gsap.matchMedia
        contexts, so a resize across the breakpoint reverts cleanly.
     ======================================================================== */
  var craftSec = $('.maison-craft');
  var craftAnchor = d.getElementById('craft');
  var STEP_COUNT = 6;

  function labelTicks() {
    $$('[data-step-go]', craftSec || d).forEach(function (btn) {
      var i = +btn.getAttribute('data-step-go');
      btn.setAttribute('aria-label', B.t('maison.craft.goto', {
        n: i + 1, total: STEP_COUNT, label: B.t('maison.craft.s' + (i + 1) + '.label')
      }));
    });
  }

  function setupPin() {
    var pin = $('.maison-craft__pin', craftSec);
    var track = $('.maison-craft__track', craftSec);
    var steps = $$('.maison-step', craftSec);
    if (!pin || !track || !steps.length) return null;
    var nav = $('.maison-craft__progress', craftSec);
    var fill = $('.maison-craft__bar-fill', craftSec);
    var current = $('[data-craft-current]', craftSec);
    var ticks = $$('[data-step-go]', craftSec);

    craftSec.classList.add('is-pinned');
    if (craftAnchor) craftAnchor.classList.add('is-pinned');

    var imgs = steps.map(function (s) { return $('.maison-step__media img', s); });
    // lazy images never load ahead inside a sideways-translated track: fetch them as the section nears
    whenNear(craftSec, '1400px 0px', function () {
      imgs.forEach(function (img) { if (img && img.loading === 'lazy') img.loading = 'eager'; });
    });
    var nums = steps.map(function (s) { return $('.maison-step__num', s); });
    var setImg = imgs.map(function (el) { return el ? gsap.quickSetter(el, 'xPercent') : null; });
    var setNum = nums.map(function (el) { return el ? gsap.quickSetter(el, 'x', 'px') : null; });
    var geo = { vw: 1, centers: [], at: [] };
    var active = -1, tw = null;

    function dist() { return Math.max(0, track.scrollWidth - pin.clientWidth); }
    // progress (0…1) at which a point that sits at `c` (viewport px, track at x = 0) reaches the centre
    function progressAt(c) {
      var D = dist() || 1;
      return clamp((B.isRTL() ? geo.vw / 2 - c : c - geo.vw / 2) / D, 0, 1);
    }
    function measure() {                          // layout reads happen here only (refresh)
      var x = gsap.getProperty(track, 'x') || 0;
      geo.vw = pin.clientWidth || 1;
      geo.centers = steps.map(function (s) { var r = s.getBoundingClientRect(); return r.left - x + r.width / 2; });
      geo.at = geo.centers.map(progressAt);
      ticks.forEach(function (t, i) {
        var li = t.parentElement;
        if (li && geo.at[i] != null) li.style.setProperty('--at', (geo.at[i] * 100).toFixed(3) + '%');
      });
    }
    function setActive(i) {
      active = i;
      if (current) current.textContent = pad2(i + 1);
      steps.forEach(function (s, k) { s.classList.toggle('is-active', k === i); });
      ticks.forEach(function (t, k) {
        t.classList.toggle('is-active', k === i);
        t.classList.toggle('is-done', k < i);
        if (k === i) t.setAttribute('aria-current', 'step'); else t.removeAttribute('aria-current');
      });
    }
    function update() {                           // no layout reads in here
      var x = gsap.getProperty(track, 'x') || 0, best = 0, bestD = Infinity;
      if (fill) fill.style.transform = 'scaleX(' + (tw ? tw.progress() : 0).toFixed(4) + ')';
      for (var i = 0; i < geo.centers.length; i++) {
        var dn = (geo.centers[i] + x - geo.vw / 2) / geo.vw;     // 0 = centred, ±1 = a viewport away
        if (setImg[i]) setImg[i](clamp(dn * -9, -9, 9));          // the photo lags inside its frame
        if (setNum[i]) setNum[i](clamp(dn, -1.2, 1.2) * 44);      // the numeral leads, a layer closer
        var a = Math.abs(dn);
        if (a < bestD) { bestD = a; best = i; }
      }
      if (best !== active) setActive(best);
    }

    tw = gsap.fromTo(track, { x: 0 }, {
      x: function () { return (B.isRTL() ? 1 : -1) * dist(); },
      ease: 'none',
      onUpdate: update,
      scrollTrigger: {
        trigger: craftSec, pin: true, scrub: 1, start: 'top top',
        end: function () { return '+=' + dist(); },
        invalidateOnRefresh: true,
        onRefresh: function () { measure(); update(); }
      }
    });
    measure();
    update();

    function scrollToProgress(p, opts) {
      var st = tw && tw.scrollTrigger;
      if (!st) return;
      B.scrollTo(st.start + clamp(p, 0, 1) * (st.end - st.start), opts || { duration: 1.2 });
    }
    function onTick(e) {
      var btn = e.target.closest && e.target.closest('[data-step-go]');
      if (!btn) return;
      var i = +btn.getAttribute('data-step-go');
      scrollToProgress(geo.at[i] != null ? geo.at[i] : i / (STEP_COUNT - 1));
    }
    // keyboard focus inside the track (the outro link): bring it on stage
    function onFocus(e) {
      var el = e.target;
      if (!el || !el.getBoundingClientRect) return;
      var r = el.getBoundingClientRect(), x = gsap.getProperty(track, 'x') || 0;
      scrollToProgress(progressAt(r.left - x + r.width / 2), { immediate: true });
    }
    if (nav) nav.addEventListener('click', onTick);
    track.addEventListener('focusin', onFocus);

    return function () {
      if (nav) nav.removeEventListener('click', onTick);
      track.removeEventListener('focusin', onFocus);
      craftSec.classList.remove('is-pinned');
      if (craftAnchor) craftAnchor.classList.remove('is-pinned');
      steps.forEach(function (s) { s.classList.remove('is-active'); });
      var props = imgs.concat(nums).filter(Boolean);
      if (props.length) gsap.set(props, { clearProps: 'transform' });
      gsap.set(track, { clearProps: 'transform' });
      if (fill) fill.style.transform = '';
    };
  }

  // (toggleActions rather than once: a once-trigger that fires on creation — page already scrolled past,
  // e.g. arriving on #care — kills itself mid-refresh and ScrollTrigger throws)
  function setupStacked() {
    $$('.maison-step', craftSec).forEach(function (step) {
      var mediaEl = $('.maison-step__media', step);
      var img = mediaEl && $('img', mediaEl);
      var num = $('.maison-step__num', step);
      var body = $('.maison-step__body', step);
      var tl = gsap.timeline({ scrollTrigger: { trigger: step, start: 'top 86%', toggleActions: 'play none none none' } });
      if (mediaEl) tl.fromTo(mediaEl, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'power3.inOut', clearProps: 'clipPath' }, 0);
      if (img) tl.fromTo(img, { scale: 1.16 }, { scale: 1, duration: 1.9, ease: 'expo.out', clearProps: 'transform' }, 0.05);
      if (num) tl.fromTo(num, { opacity: 0, yPercent: 40 }, { opacity: 1, yPercent: 0, duration: 1.3, ease: 'expo.out', clearProps: 'opacity,transform' }, 0.3);
      if (body) tl.fromTo(body, { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', clearProps: 'opacity,transform' }, 0.35);
    });
    var outro = $('.maison-craft__outro', craftSec);
    if (outro) {
      gsap.fromTo(outro, { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', clearProps: 'opacity,transform',
        scrollTrigger: { trigger: outro, start: 'top 88%', toggleActions: 'play none none none' }
      });
    }
  }

  B.page(function () {
    if (!craftSec) return;
    labelTicks();
    if (!mm) return;
    mm.add('(min-width: 1024px) and (min-height: 600px)', setupPin);
    mm.add('(max-width: 1023.98px), (max-height: 599.98px)', setupStacked);
  });

  /* ===========================================================================
     5. Materials — six leather.js swatches (one shared snapshot context),
        and a warm light that follows the pointer across each one
     ======================================================================== */
  var MATERIALS = {
    calf:     { leather: 'cognac',   grain: 'smooth', mark: null, seed: 11 },
    suede:    { leather: 'sand',     grain: 'suede',  mark: null, seed: 12 },
    nubuck:   { leather: 'chestnut', grain: 'suede',  grainScale: 0.55, mark: { type: 'monogram' }, foil: 'blind', seed: 13 },
    pebble:   { leather: 'forest',   grain: 'pebble', mark: { type: 'monogram' }, foil: 'gold', seed: 14 },
    polished: { leather: 'oxblood',  grain: 'smooth', grainScale: 1.4, mark: null, light: [0.34, 0.18], lightHeight: 0.34, seed: 15 },
    veg:      { leather: 'tan',      grain: 'smooth', grainScale: 1.2, mark: { type: 'monogram' }, foil: 'blind', lightHeight: 0.8, seed: 16 }
  };
  // phones show a landscape sample, wider screens a 4:5 one — rendered at the shown aspect so the
  // stitched border is never cropped (re-rendered if the breakpoint is crossed)
  var mqPhone = w.matchMedia ? w.matchMedia('(max-width: 699.98px)') : null;
  var swatchGen = 0, swatchesOn = false;

  function renderMaterials() {
    var L = B.Leather;
    if (!L || !L.snapshot || !L.preset) return;
    swatchesOn = true;
    var gen = ++swatchGen;
    var W = 720, H = mqPhone && mqPhone.matches ? 450 : 900;
    $$('.maison-material').forEach(function (card) {
      var cfg = MATERIALS[card.getAttribute('data-material')];
      var sw = $('.maison-material__swatch', card);
      var leather = cfg && leatherById(cfg.leather);
      if (!cfg || !sw || !leather) return;
      var over = { color: leather.hex, grain: cfg.grain, mark: cfg.mark, markScale: H < W ? 0.34 : 0.26, seed: cfg.seed, dpr: 1.8, quality: 0.86 };
      ['foil', 'grainScale', 'light', 'lightHeight'].forEach(function (k) { if (cfg[k] != null) over[k] = cfg[k]; });
      queueSnap(function () {
        if (gen !== swatchGen) return null;
        return L.snapshot(L.preset('swatch', over), W, H).then(function (url) {
          if (!url || gen !== swatchGen) return;
          var old = $('.maison-material__img', sw);
          var img = d.createElement('img');
          img.className = 'maison-material__img';
          img.alt = '';
          img.width = W;
          img.height = H;
          img.decoding = 'async';
          img.onload = function () {
            if (old && old.parentNode) old.parentNode.removeChild(old);
            sw.classList.add('is-ready');
          };
          img.src = url;
          sw.insertBefore(img, sw.firstChild);
        }, function () { /* the CSS swatch stays: never an empty box */ });
      });
    });
  }
  if (mqPhone && mqPhone.addEventListener) {
    mqPhone.addEventListener('change', function () { if (swatchesOn) renderMaterials(); });
  }

  function initSheen() {
    if (!FINE || RM) return;
    $$('.maison-material__swatch').forEach(function (sw) {
      var sheen = d.createElement('span');
      sheen.className = 'maison-material__sheen';
      sheen.setAttribute('aria-hidden', 'true');
      sw.appendChild(sheen);
      var rect = null;
      sw.addEventListener('pointerenter', function () { rect = sw.getBoundingClientRect(); });
      sw.addEventListener('pointerleave', function () { rect = null; });
      sw.addEventListener('pointermove', function (e) {
        if (e.pointerType !== 'mouse') return;
        if (!rect) rect = sw.getBoundingClientRect();
        sheen.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width * 100).toFixed(1) + '%');
        sheen.style.setProperty('--my', ((e.clientY - rect.top) / rect.height * 100).toFixed(1) + '%');
      });
    });
  }

  var materialsAsked = false;
  function materialsOnce() { if (!materialsAsked) { materialsAsked = true; renderMaterials(); } }
  B.page(function () {
    whenNear($('.maison-materials__grid'), '1200px 0px', materialsOnce);
    initSheen();
  });

  /* ===========================================================================
     6. The house colours — eight leathers; choosing one shows its character
        and links to the atelier with that leather preselected
     ======================================================================== */
  var colourRow = $('[data-colours]');
  var colourSel = 'forest';

  function renderColours() {
    if (!colourRow || !LEATHERS.length) return;
    if (!leatherById(colourSel)) colourSel = LEATHERS[0].id;
    colourRow.innerHTML = LEATHERS.map(function (l) {
      return '<button class="maison-colour" type="button" data-leather="' + esc(l.id) + '" aria-pressed="' + (l.id === colourSel) + '" style="--swatch:' + esc(l.hex) + '" data-cursor>' +
        '<span class="maison-colour__chip" aria-hidden="true"></span>' +
        '<span class="maison-colour__en" lang="en">' + esc(l.name.en) + '</span>' +
        '<span class="maison-colour__ku" lang="ckb">' + esc(l.name.ckb) + '</span>' +
        '</button>';
    }).join('');
  }

  function renderDetail(animate) {
    var detail = $('[data-colour-detail]');
    var l = leatherById(colourSel);
    if (!detail || !l) return;
    var other = otherLang();
    var nameEl = $('[data-colour-name]', detail), metaEl = $('[data-colour-meta]', detail);
    var descEl = $('[data-colour-desc]', detail), link = $('[data-colour-link]', detail);
    var cta = $('[data-colour-cta]', detail);
    if (nameEl) {
      nameEl.innerHTML = '<span>' + esc(B.loc(l.name)) + '</span>' +
        '<span class="maison-colours__alt" lang="' + other + '">' + esc(l.name[other] || '') + '</span>';
    }
    if (metaEl) metaEl.textContent = B.t('maison.grain.' + (l.grain || 'smooth'));
    if (descEl) descEl.textContent = l.description ? B.loc(l.description) : '';
    if (link) link.setAttribute('href', 'atelier.html?leather=' + encodeURIComponent(l.id));
    if (cta) cta.textContent = B.t('maison.colours.cta', { name: B.loc(l.name) });
    if (animate && !RM) {
      detail.classList.remove('is-changing');
      void detail.offsetWidth;                    // restart the fade
      detail.classList.add('is-changing');
    }
  }

  function selectColour(id, animate) {
    if (!leatherById(id) || id === colourSel) return;
    colourSel = id;
    $$('.maison-colour', colourRow).forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-leather') === id));
    });
    renderDetail(animate);
  }

  var chipsAsked = false;
  function renderChips() {
    var L = B.Leather;
    if (chipsAsked || !L || !L.snapshot || !L.preset) return;
    chipsAsked = true;
    $$('.maison-colour', colourRow).forEach(function (b, i) {
      var l = leatherById(b.getAttribute('data-leather'));
      var chip = $('.maison-colour__chip', b);
      if (!l || !chip) return;
      queueSnap(function () {
        return L.snapshot(L.preset('swatch', { color: l.hex, grain: l.grain, mark: null, stitch: false, seed: 31 + i, dpr: 2, quality: 0.86 }), 192, 192)
          .then(function (url) { if (url) chip.style.backgroundImage = 'url("' + url + '")'; }, function () {});
      });
    });
  }


  B.page(function () {
    if (!colourRow) return;
    renderColours();
    renderDetail(false);
    colourRow.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('.maison-colour');
      if (b) selectColour(b.getAttribute('data-leather'), true);
    });
    // arrows move along the row (mirrored in RTL), Home / End jump to the ends
    colourRow.addEventListener('keydown', function (e) {
      if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].indexOf(e.key) < 0) return;
      var btns = $$('.maison-colour', colourRow), i = btns.indexOf(d.activeElement), n = btns.length;
      if (i < 0 || !n) return;
      var next = e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 :
        (i + ((e.key === 'ArrowRight') !== B.isRTL() ? 1 : -1) + n) % n;
      e.preventDefault();
      btns[next].focus();
      selectColour(btns[next].getAttribute('data-leather'), true);
    });
    whenNear(colourRow, '1200px 0px', renderChips);
  });

  // once the page has settled, render the swatches in idle time anyway: they are ready before anyone gets there
  B.ready(function () {
    setTimeout(function () { materialsOnce(); renderChips(); }, 2200);
  });

  /* ===========================================================================
     7. Shared — icon placeholders, language changes
     ======================================================================== */
  B.page(function () {
    $$('[data-icon]', main || d).forEach(function (el) {
      var svg = B.icon(el.getAttribute('data-icon'));
      if (!svg) return;
      if (el.className) { el.innerHTML = svg; el.removeAttribute('data-icon'); }
      else el.outerHTML = svg;
    });
  });

  B.on('langchange', function () {
    labelTicks();
    renderDetail(false);
    B.refresh();                                  // the timeline direction flips with the page
  });

  /* ===========================================================================
     8. Deep links — maison.html#craft / #materials / #care from other pages.
        Registered last: the pin exists, so positions are final; the jump is
        immediate (the curtain / preloader still covers the page).
     ======================================================================== */
  B.page(function () {
    var id = '';
    try { id = decodeURIComponent((w.location.hash || '').slice(1)); } catch (e) { id = ''; }
    if (!id || !/^[A-Za-z][\w-]*$/.test(id)) return;
    var target = d.getElementById(id);
    if (!target || !main || !main.contains(target)) return;
    var moved = false;
    function jump() {
      if (moved) return;
      if (ST) { try { ST.refresh(); } catch (e) { console.error(e); } }
      // Lenis clamps to the scroll limit it measured before the pin and the reveals changed the page height
      if (B.lenis && B.lenis.resize) B.lenis.resize();
      B.scrollTo(target, { immediate: true });
    }
    jump();
    // late layout (fonts, images) may still move the target: land again until the visitor takes over
    ['wheel', 'touchmove', 'keydown', 'pointerdown'].forEach(function (ev) {
      w.addEventListener(ev, function () { moved = true; }, { once: true, passive: true });
    });
    if (d.fonts && d.fonts.ready) d.fonts.ready.then(function () { setTimeout(jump, 60); });
    if (d.readyState !== 'complete') w.addEventListener('load', function () { setTimeout(jump, 60); }, { once: true });
    B.ready(function () { setTimeout(jump, 1800); });
  });
})(window, document);
