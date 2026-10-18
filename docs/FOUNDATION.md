# Ben.M — Foundation (developer guide)

The Foundation is the shared design system + chrome + behaviour every page uses:

| File | What |
|---|---|
| `assets/css/main.css` | tokens, reset, typography, utilities, components, chrome, motion/RTL/reduced-motion rules |
| `assets/js/i18n.js` | shared strings `window.BENM_I18N = { en, ckb }` |
| `assets/js/layout.js` | injects the chrome around `<main>` + the icon set `window.BENM_ICONS` |
| `assets/js/main.js` | `window.BENM` — the API below |
| `styleguide.html` | living reference of everything here (open it next to this doc) |

Page builders own `assets/css/pages/<page>.css` and `assets/js/pages/<page>.js` only. Never edit the files above —
ask the Foundation owner (see "Requests" in its report) and never redefine `.c-*` / `.u-*` classes in page CSS
(compose them, or add a page-prefixed class: `.home-hero`, `.shop-toolbar`).

---------------------------------------------------------------------------------------------------------------------

## 1. Page skeleton (copy exactly)

```html
<!doctype html>
<html lang="en" dir="ltr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title data-i18n="home.meta.title">Genuine leather — Ben.M</title>
  <meta name="description" content="…" data-i18n-attr="content:home.meta.description">
  <meta name="theme-color" content="#0C1D17">
  <link rel="icon" href="assets/brand/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="assets/brand/favicon-32.png" sizes="32x32">
  <link rel="apple-touch-icon" href="assets/brand/apple-touch-icon.png">
  <meta property="og:title" content="…"><meta property="og:description" content="…">
  <meta property="og:image" content="assets/brand/og-image.jpg"><meta property="og:type" content="website">
  <script>/* boot flags — identical on every page */
  (function(h){h.classList.add('js');try{var l=localStorage.getItem('benm:lang');if(l==='ckb'){h.lang='ckb';h.dir='rtl';}
  if(!sessionStorage.getItem('benm:visited')){h.classList.add('is-preloading');}
  else if(sessionStorage.getItem('benm:transition')){h.classList.add('is-transitioning');}}catch(e){}})(document.documentElement);
  </script>
  <link rel="stylesheet" href="assets/fonts/fonts.css">
  <link rel="stylesheet" href="assets/css/main.css">
  <link rel="stylesheet" href="assets/css/pages/home.css">
</head>
<body data-page="home" data-header="dark">
  <main id="main" class="page page--home">
    … sections …
  </main>
  <script src="assets/vendor/gsap.min.js"></script>
  <script src="assets/vendor/ScrollTrigger.min.js"></script>
  <script src="assets/vendor/SplitText.min.js"></script>
  <script src="assets/vendor/lenis.min.js"></script>
  <script src="assets/js/brand.js"></script>
  <script src="assets/js/i18n.js"></script>
  <script src="assets/js/data.js"></script>
  <script src="assets/js/layout.js"></script>
  <script src="assets/js/main.js"></script>
  <script src="assets/js/leather.js"></script>   <!-- only on pages that use it -->
  <script src="assets/js/pages/home.js"></script>
</body>
</html>
```

`<body>` attributes:

| Attribute | Meaning |
|---|---|
| `data-page="home"` | page id (informational, used by QA) |
| `data-header="dark"` / `"light"` | header colours at the top of the page: **dark** = ivory header over a dark hero, **light** = green header over an ivory hero. After 40 px of scroll the header always becomes the solid ivory bar. |
| `data-footer="none"` | omit the footer (rarely wanted) |
| `data-base="../"` | only for pages in sub-folders (`_lab/`): prefixes every internal link and asset path |

Do **not** add a `<header>`, `<footer>`, skip link, grain or drawer yourself — `layout.js` injects them.
Do not add `<link rel="preload">` (from file:// it produces console errors).

### Anchors the chrome links to (page builders must provide these ids)
`maison.html#craft` `#materials` `#care` · `atelier.html#configurator` `#appointment` · `boutiques.html#contact` `#faq`.
Query links: `shop.html?cat=men|women|bags|accessories`, `shop.html?new=1`, `shop.html?saved=1`, `shop.html?q=…`,
`product.html?id=<id>`. Same-page `#anchors` scroll smoothly (with header offset) automatically.

---------------------------------------------------------------------------------------------------------------------

## 2. Lifecycle

`main.js` defines `window.BENM` at parse time, so page scripts can call these at their **top level**:

```js
(function (B) {
  'use strict';
  B.i18n.add({ en: { 'home.hero.title': 'Genuine leather, <em>made to last.</em>' },
               ckb: { 'home.hero.title': 'چەرمی ڕەسەن، <em>بۆ هەمیشە.</em>' } });

  B.page(function () {          // step 5: render dynamic content, create page ScrollTriggers (fonts are loaded)
    document.getElementById('new-grid').innerHTML = B.products(function (p) { return p.isNew; })
      .map(function (p, i) { return B.productCard(p, { index: i + 1 }); }).join('');
  });

  B.ready(function () {         // step 7: after the preloader / curtain — hero intros, autoplay
  });

  B.on('langchange', function () { /* re-render anything you rendered from data */ });
})(window.BENM);
```

Boot order on `DOMContentLoaded`: 1 language + currency → 2 i18n applied to the whole document (incl. `<title>`) →
3 Lenis + ScrollTrigger → 4 chrome behaviours → *(fonts ready, ≤1.5 s)* → 5 `BENM.page` initialisers (each in
try/catch, errors go to `console.error`) → 6 `BENM.reveal(document)` (all declarative attributes) → 7 preloader /
curtain-out → `<html data-ready="true">` → `BENM.ready` callbacks → `ready` event → 8 `ScrollTrigger.refresh()` after
fonts and `load`.

* `data-ready="true"` is ALWAYS reached (watchdog at 9 s). QA waits for it.
* Reveals of elements already in view are **queued until ready** and then play in DOM order with a small cascade —
  a hero built from `data-reveal` attributes animates in automatically, behind no cover.
* `BENM.page(fn)` registered after boot runs immediately; `BENM.ready(fn)` after ready runs on the next tick.

Events (`BENM.on(name, fn)` returns an unsubscribe function; also dispatched on `document` as `benm:<name>`):

| Event | Detail |
|---|---|
| `ready` | `{ lang }` |
| `langchange` | `{ lang }` — strings, prices and product cards are already updated; re-render what you built yourself |
| `currencychange` | `{ currency }` — `[data-price]` elements are already updated |
| `cart` | `{ action: 'add'|'remove'|'update'|'clear'|'sync', key, id, items, count, subtotal }` |
| `wishlist` | `{ id, saved, ids, count }` |
| `formsubmit` | `{ form, data, newsletter }` (also `benm:submit` on the form itself, bubbling, `detail.data`) |
| `accordion` / `tab` | `{ item, open }` / `{ tab }` |

---------------------------------------------------------------------------------------------------------------------

## 3. i18n

Shared keys live in `assets/js/i18n.js` (prefixes: `brand a11y nav header lang currency price menu search drawer
card product toast form footer cursor wa 404 common`). **Page keys are registered by the page script** and prefixed
with the page name (`home.*`, `shop.*`, `product.*`, `maison.*`, `atelier.*`, `boutiques.*`, `nf.*` for 404).

Markup (the HTML keeps the English text as default content):

```html
<h2 data-i18n="home.craft.title">The craft</h2>                         <!-- textContent -->
<h1 data-i18n-html="home.hero.title">Genuine leather, <em>made to last.</em></h1>   <!-- trusted innerHTML -->
<input data-i18n-attr="placeholder:form.email;aria-label:form.email">
<span data-i18n="footer.rights" data-i18n-vars='{"year":2026}'>© 2026 Ben.M</span>
<span class="c-price" data-price="320">$320</span>                     <!-- USD; re-rendered on lang/currency -->
<span data-num="22">22</span>                                            <!-- digits localised (٢٢ in ckb) -->
```

JS: `BENM.t(key, vars)` (`{name}` interpolation; number vars are localised; `key_one` is used when `vars.n === 1`) ·
`BENM.lang` (`'en'|'ckb'`) · `BENM.loc({en, ckb})` · `BENM.num(n)` · `BENM.price(usd[, 'USD'|'IQD'])`
→ `$320` · `IQD 419,250` · `٣٢٠ دۆلار` · `٤١٩٬٢٥٠ د.ع` (IQD rounded to 250, rate `BENM_CONFIG.currency.iqdRate`) ·
`BENM.setLang('ckb')` · `BENM.setCurrency('IQD')` · `BENM.i18n.apply(root)` after injecting markup that uses
`data-i18n` (not needed for `BENM.productCard`, which renders in the current language).

A missing key warns once (`[i18n] missing key: …`, QA counts it) and falls back to English.

**Kurdish rules** — natural Sorani, Kurdish letters (ڕ ڵ ێ ۆ ە ی ک گ), never ي ك ة; "Ben.M" stays Latin; tagline
exactly «چەرمی ڕەسەن»; glossary BRIEF §7.1. Typography switches automatically under `lang="ckb"` (fonts, no tracking,
no uppercase, no italics — `<em>` in headings becomes gold instead, taller line-heights, display −10 %). Never split
Kurdish into characters. Local language islands work both ways: `<span lang="ckb">چەرمی ڕەسەن</span>` in an English
page, `<span lang="en">Genuine leather</span>` in a Kurdish page.

---------------------------------------------------------------------------------------------------------------------

## 4. Tokens (`:root` in main.css — never hard-code hex in page CSS; data swatches excepted)

Colour: `--c-green-950 #07120E` `--c-green-900 #0C1D17` `--c-green-800 #132A22` `--c-green-700 #1F3E35` (logo)
`--c-green-600` `--c-green-500` `--c-sage-300` · `--c-gold-800 #7A5B2B` (**added**: small gold text on light, AA
5.4:1 — gold-700 is only 4.3:1) `--c-gold-700` `--c-gold-600` `--c-gold-500` (primary on dark) `--c-gold-400`
`--c-gold-300` `--c-gold-100` · `--c-ivory` `--c-paper` `--c-sand` `--c-ink` `--c-stone` `--c-white` ·
`--c-error` / `--c-error-dk` · `--g-foil` (foil gradient) · `--g-sheen` · `--g-hairline` (gold hairline fading at
both ends) · `--line-dark` `--line-light` · `--ivory-84` (body text on dark) · `--scrim`.

Type: `--f-display` `--f-sans` (switch under ckb) · `--f-serif-latin` (Cormorant for Latin numerals like N°01) ·
`--fs-mega --fs-h1 --fs-h2 --fs-h3 --fs-h4 --fs-lead --fs-body --fs-small --fs-eyebrow --fs-ui --fs-micro` ·
`--fw-display --fw-body` · `--lh-*` · `--ls-*` · `--tt-ui` (uppercase / none in ckb) · `--fst-em` (italic / normal).
Use the tokens in page CSS and Kurdish just works: `font: var(--fw-display) var(--fs-h2)/var(--lh-h2) var(--f-display);
letter-spacing: var(--ls-display);`.

Layout: `--gutter clamp(20px,4.5vw,72px)` · `--container 1720px` · `--grid-gap` · `--space-section` ·
`--space-1…10` (4…128 px) · `--header-h` (84 px, 64 px < 700 px).

Motion: `--ease-out` (expo-out) · `--ease-inout` · `--ease-soft` · `--dur-micro .25s` `--dur-ui .5s`
`--dur-reveal 1.2s`. GSAP equivalents: `"expo.out"`, `"power3.inOut"`.

Z-index scale (use the variables): `--z-raised 2` · `--z-sticky 50` (page sticky bars) · `--z-menu 90` ·
`--z-header 100` · `--z-search 110` · `--z-drawer 120` · `--z-modal 130` · `--z-toast 140` · `--z-curtain 150` ·
`--z-preloader 160` · `--z-grain 170` · `--z-skip 190`. Page content stays below 50.

Breakpoints (min-width unless noted): 560 · **700** (header compact below; `@md` helpers) · 760 (modal becomes a
bottom sheet below) · 900 · 1000 · **1100** (menu image preview; `@lg` helpers) · 1280 (4-column product grid).

### Section themes (one class per section; components follow)

| Class | Background | Use |
|---|---|---|
| `.theme-light` | ivory | default paper |
| `.theme-paper` | paper | alternating light section |
| `.theme-dark` | green-900 | dark stage |
| `.theme-night` | green-950 | deepest (footer uses it) |
| `.theme-forest` | green-700 (brand) | rare accent band |

Each sets the slots `--bg --fg --fg-muted --fg-strong --accent --accent-soft --line --line-strong --surface --focus
--error --em --btn-*`. In page CSS use the **slots** (`color: var(--fg-muted)`, `border-color: var(--line)`) so the
same component works on every stage.

---------------------------------------------------------------------------------------------------------------------

## 5. Typography & layout utilities

`h1 h2 h3` are display serif by default (sizes `--fs-h1/2/3`). Classes: `.t-mega .t-h1 .t-h2 .t-h3 .t-h4 .t-lead
.t-body .t-small .t-quote .t-num` · `.t-muted .t-strong .t-accent .t-italic .t-serif` · `.t-foil` / `.u-foil`
(foil text) · `.u-foil--sheen` (+`.is-loop`) · `.t-outline` (gold outline text) · `.t-center .t-start .t-end` ·
`.c-prose` (long copy). `<em>` inside display type = italic (EN) / gold (ckb).

Layout: `.u-container` (`--narrow`, `--wide`) · `.u-section` (`--tight`, `--flush-top`, `--flush-bottom`) ·
`.u-pad-header` · `.u-grid` 12 columns — children span 12 by default; `.u-span-1…12` (all sizes),
`.u-span-N@md` (≥700), `.u-span-N@lg` / `.u-start-N@lg` (≥1100) — span sets the END and start sets the START, so
`class="u-span-6@lg u-start-7@lg"` works · `.u-products` (2 → 3 cols, `.u-products--4` → 4 cols ≥1280) ·
`.u-stack` (`--stack-gap`) · `.u-cluster` (`--cluster-gap`) · `.u-flow` · `.u-split` · `.u-media` (overflow hidden,
img covers) · `.u-ratio-1x1 / 4x5 / 3x4 / 2x3 / 16x9 / 21x9` · `.u-visually-hidden` · `.u-clip-x` (clip horizontal
overflow of decorative bleed) · `[dir=rtl] .u-flip-rtl` mirrors.

---------------------------------------------------------------------------------------------------------------------

## 6. Components (markup)

**Eyebrow / caption / rules / frames**
```html
<p class="c-eyebrow c-eyebrow--line"><span class="c-eyebrow__num">02</span><span data-i18n="home.craft.eyebrow">The craft</span></p>
<p class="c-caption"><span class="c-caption__num">N°01</span><span>The Azmar Oxford</span></p>
<span class="c-rule"></span>  <span class="c-rule c-rule--gold" data-reveal="draw"></span>  <span class="c-rule c-rule--accent"></span>
<figure class="c-frame"> … </figure>          <!-- offset gold hairline frame (leave 14px room, --frame-offset) -->
<div class="c-corners"></div>                  <!-- absolute hairline frame with gold corner brackets (--corners-inset) -->
<span class="c-diamond"></span>                <!-- small gold lozenge separator -->
<span class="c-index"><span class="c-index__n">N°</span>01</span>
```

**Badges / counts**: `.c-badge` (`--new`, `--limited`, `--soldout`, `--dot`) · `.c-count` (`.is-empty`, `.is-bump`).

**Buttons** — label roll needs the inner span; arrow optional:
```html
<a class="c-btn c-btn--primary" href="shop.html" data-magnetic>
  <span class="c-btn__label"><span data-i18n="home.hero.cta">Shop the collection</span></span><span class="c-btn__arrow"></span></a>
<button class="c-btn c-btn--ghost c-btn--sm" type="button"><span class="c-btn__label"><span>…</span></span></button>
<a class="c-btn c-btn--foil">…</a>             <!-- gold-foil face: the ONE key action of a view -->
```
Variants: `--primary` (green on light / ivory on dark — automatic), `--ghost`, `--foil`, `--on-dark` / `--on-light`
(force colours, e.g. over a photo), `--sm`, `--lg`, `--block`, `[disabled]`. Hover: foil sheen + label roll + arrow
stretch. `.c-btn__icon` wraps an icon that nudges on hover.
**Links**: `.c-link` (small caps, underline slides out/in, arrow `BENM.icon('arrow')` nudges; RTL mirrored),
`.c-link--quiet` (underline only on hover), `.c-text-link` (inside copy), `.c-hover-line` (nav lists).
**Icon button**: `.c-icon-btn` (44×44, `--framed`).

**Icons**: `BENM.icon(name, { className, label, size })` → inline SVG (`.c-icon c-icon--<name>`, 1.25 px hairline,
`--icon-size` default 20 px). Names: bag heart heart-fill search menu close arrow arrow-up-right plus minus chevron
check whatsapp instagram facebook tiktok phone mail pin truck return gift needle sparkle globe zoom clock calendar
ruler. Directional icons (arrow, arrow-up-right, chevron, return) flip in RTL automatically.

**Chips / swatches / sizes / qty / switch**
```html
<div class="u-cluster" data-select="single">                <!-- optional built-in selection; emits benm:select {values} -->
  <button class="c-chip" type="button" aria-pressed="true" data-value="men" data-i18n="nav.men">Men</button></div>
<button class="c-swatch" type="button" style="--swatch:#8A4B22" aria-pressed="false" aria-label="Cognac"></button>
<label class="c-swatch" style="--swatch:#161616"><input type="radio" name="color" value="noir"><span class="c-swatch__dot"></span><span class="u-visually-hidden">Noir</span></label>
<div class="c-sizes"><label class="c-size"><input type="radio" name="size" value="42"><span>42</span></label>
  <button class="c-size" type="button" disabled>46</button></div>      <!-- sold out: disabled → diagonal strike -->
<div class="c-qty" data-qty data-value="1" data-min="1" data-max="10" role="group" aria-label="Quantity">
  <button class="c-qty__btn" type="button" data-qty-step="-1" aria-label="…">BENM.icon('minus')</button>
  <span class="c-qty__value">1</span>
  <button class="c-qty__btn" type="button" data-qty-step="1" aria-label="…">BENM.icon('plus')</button></div>  <!-- emits benm:qty {value} -->
<div class="c-switch" role="group"><button class="c-switch__btn" data-set-lang="en" lang="en" aria-pressed="true">EN</button>…</div>
```
`[data-set-lang]` / `[data-set-currency]` buttons work anywhere and are kept in sync.

**Forms** — floating labels need `placeholder=" "` and the label AFTER the input:
```html
<form class="c-form" data-validate novalidate>
  <div class="c-form__row c-form__row--2">
    <div class="c-field">
      <input class="c-field__input" id="ap-name" name="name" type="text" required placeholder=" " autocomplete="name">
      <label class="c-field__label" for="ap-name" data-i18n="form.name">Full name</label>
      <span class="c-field__line" aria-hidden="true"></span>
      <p class="c-field__msg"></p>
    </div> …
  </div>
  <div class="c-field c-field--select"><select class="c-field__input" id="x" required>…</select><label class="c-field__label" for="x">…</label><span class="c-field__line"></span><p class="c-field__msg"></p></div>
  <div><label class="c-check"><input type="checkbox" name="consent" required><span data-i18n="form.consent">…</span></label><p class="c-field__msg"></p></div>
  <button class="c-btn c-btn--primary" type="submit"><span class="c-btn__label"><span data-i18n="form.send">Send</span></span></button>
</form>
<div class="c-form-success" data-form-success hidden> … </div>   <!-- shown on success, right after the form -->
```
`data-validate`: required, `type=email`, `type=tel`, `minlength`, required checkbox — localised messages
(`form.error.*`) that re-translate on language change; first invalid field is focused; live re-validation after
the first attempt. On success: form hidden, `[data-form-success]` shown + focused, `formsubmit` event. No backend.
`data-newsletter` on a form = same + an automatic success panel (the footer uses it; reuse it on "Join the House").
`.c-field--float` forces the label up; date/time inputs float automatically. `.c-inline-form` + `.c-inline-form__submit`
= field with an arrow submit (newsletter). `BENM.validate(form)` validates programmatically.

**Accordion** (`data-accordion="single"` = one open at a time; `.is-open` on an item = initially open; without JS all
panels are open):
```html
<div class="c-accordion" data-accordion="single">
  <div class="c-accordion__item is-open">
    <h3 class="c-accordion__heading"><button class="c-accordion__trigger" type="button">
      <span><span class="c-accordion__num">01</span><span data-i18n="…">Description</span></span><span class="c-accordion__icon" aria-hidden="true"></span></button></h3>
    <div class="c-accordion__panel"><div class="c-accordion__inner"><div class="c-accordion__content">…</div></div></div>
  </div>
</div>
```
ids / `aria-controls` / `aria-expanded` are added automatically. Accordions inserted later: call `BENM.reveal(root)`.

**Tabs**: `<div data-tabs><div class="c-tabs" role="tablist"><button class="c-tab" role="tab" aria-controls="p1"
aria-selected="true">…</button>…</div><div role="tabpanel" id="p1">…</div></div>` — click + arrow keys (RTL aware).
**Breadcrumbs**: `<nav class="c-breadcrumbs" aria-label="…"><ol><li><a>…</a></li><li><span aria-current="page">…</span></li></ol></nav>`.
**Empty state**: `.c-empty` › `.c-empty__mark` (monogram) `.c-empty__title` `.c-empty__text` + a button.
**Section head**: `.c-section-head` (`--split` puts a link/text at the end) › `.c-section-head__title`.
**Marquee**: see §8. **Skeleton**: `.c-skeleton`.

### Product card — THE shared card
```js
el.innerHTML = BENM.productCard(product | id, {
  variant: 'default' | 'dark' | 'compact',   // dark = on dark stages (automatic inside .theme-dark too); compact = search/related
  index: 1,                                   // "N°01" before the type
  heading: 'h3',                              // h2–h6 for the name
  eager: false,                               // true for above-the-fold images
  reveal: 'up',                               // adds data-reveal to the card
  className: '', attrs: 'data-foo="1"'
});
BENM.reveal(el);                              // after injecting: reveals, accordions, etc.
```
Includes: 4:5 media with second photo on hover, New/Limited badge, wishlist heart (`[data-wish]`), quick add
(one-size → adds to bag with toast + fly animation; sized → quick view), type, colour dots, name link
(stretched over the card), price (`data-price`). Re-localises **in place** on language change
(no re-render needed) via `data-product-id` + `data-pfield`. You can use the same mechanism on product pages:
`<div data-product-id="azmar-oxford"><h1 data-pfield="name"></h1><p data-pfield="short"></p></div>` — any `{en, ckb}`
field of the product (`name typeName short description care`) is kept in the current language.

---------------------------------------------------------------------------------------------------------------------

## 7. Chrome (injected — behaviour reference)

* **Header** `#site-header` — theme from `body[data-header]`; `.is-solid` after 40 px; `.is-hidden` when scrolling down
  past 180 px (never while an overlay is open), shown again on scroll up, on keyboard focus and when the menu opens. `BENM.header.show() / hide() /
  setTheme('light'|'dark')`. Menu + search at the start, centred logo (never mirrored), language + saved + bag at the
  end. Under 700 px: icons only, language moves into the menu.
* **Menu** `#site-menu` — `BENM.menu.open() / close() / toggle() / isOpen()`. Collections with live previews
  (main categories of `BENM_CATEGORIES` with their sub-category links, images + taglines), the House links, secondary
  links, language/currency, socials. `BENM_LAYOUT.refresh()` rebuilds the collections (menu + footer) when the live
  catalogue arrives; hover/focus handlers are delegated, so rebuilt links keep working.
* **Search** `#site-search` — `BENM.searchUI.open() / close()`. Live results (6 compact cards) via `BENM.search(q)`
  (name, type, category, colours, short text; both languages; normalises Arabic/Kurdish letters and digits; English
  plurals and Kurdish ـەکان). Enter → `shop.html?q=<query>` with the page transition. **shop.html must read `?q=`
  and call `BENM.search(q)` so results match.**
* **Drawer** `#site-drawer` — `BENM.openDrawer('bag'|'saved')`, `BENM.closeDrawer()`, any `[data-open-drawer="bag"]`.
  Bag: lines with qty stepper, remove (+ Undo toast), free-shipping progress (`BENM_CONFIG.freeShippingThreshold`),
  subtotal, "Checkout via WhatsApp" (`BENM.orderMessage()`). Saved: add to bag / remove.
* **Quick view** — `BENM.quickView(id)` or `[data-quick-view="<id>"]`: gallery, colour (radio swatches), sizes (sold
  out disabled), add to bag (asks for a size first), wishlist, link to the product page.
* **Modal** — `BENM.modal.open(htmlOrElement, opts)` → panel element; `BENM.modal.close()`. Options: `label` or
  `labelledBy` (id of your title), `size: 'sm'|'md'|'lg'|'full'`, `theme: 'light'|'dark'|'night'|'paper'`,
  `padded: true` (adds `.c-modal__body`), `className`, `initialFocus: '<selector>'`, `onOpen(panel)`, `onClose()`.
  Any `[data-modal-close]` inside closes it. Below 760 px it is a bottom sheet.
* **Layers** (menu, search, drawer, modal) share one stack: Esc closes the top one, Tab is trapped, focus is restored,
  the page cannot scroll (Lenis stopped + wheel/touch/key guards — the scrollbar never disappears, no layout shift),
  toasts on screen are dismissed. Scrollable regions inside layers need `data-lenis-prevent`.
* **Toasts** — `BENM.toast(message, { icon: 'check', action: { label, onClick }, duration: 4200 })` → `{ el, close }`.
  Max 3, pause on hover/focus, announced politely.
* **Page transitions** — every internal `.html` link (same tab, no modifier keys, not `#hash`-only, not
  `target=_blank`, not `download`, not `data-no-transition`) → curtain covers (0.58 s) → navigate → next page arrives
  covered and uncovers when ready. bfcache-safe. Programmatic: `BENM.go('shop.html?cat=men')`.
* **Preloader** — first visit per session: foil wordmark pen-draw → foil fill + sheen → counter 000→100 → lift
  (≈2.55 s). Reduced motion: static mark + 0.45 s fade. Hero intros should use `data-reveal` / `BENM.ready`.
* **Footer** — newsletter (`data-newsletter`), 4 link columns, contacts from `BENM_CONFIG`, giant wordmark drawn on
  scroll, © year, bilingual tagline, language + currency, back to top.

---------------------------------------------------------------------------------------------------------------------

## 8. Declarative motion & behaviour attributes

Scanned at boot and by `BENM.reveal(root)` (call it after you inject markup — it is idempotent).

| Attribute | Effect |
|---|---|
| `data-reveal="up"` | rise 46 px + fade (default) |
| `data-reveal="fade"` / `"scale"` | fade · scale .94→1 + fade |
| `data-reveal="lines"` / `"words"` | SplitText lines / words rise out of masks (words in ckb, never chars) |
| `data-reveal="clip"` / `"clip-up"` | clip-path wipe from inline-start (RTL aware) / from bottom; the inner `img` scales 1.16→1 (skipped if the img has `data-parallax`) |
| `data-reveal="draw"` | hairline scaleX 0→1 from inline-start, or SVG strokes drawn (paths get `pathLength=1`) |
| `data-reveal-delay=".2"` | seconds |
| `data-reveal-stagger=".08"` | on a container: animates its **children** one by one (for up/fade/scale/clip); for lines/words it is the piece stagger |
| `data-reveal-start="top 70%"` | ScrollTrigger start (default `top 88%`) |
| `data-parallax="0.15"` | on the `img` inside an overflow-hidden wrapper (`.u-media`): travels ±7.5 % and is scaled to cover; off in reduced motion |
| `data-magnetic` / `="0.4"` | element follows the pointer (fine pointers only) |
| `data-marquee` + `data-marquee-speed="1.4"` | infinite marquee of `.c-marquee__track` children; reacts to scroll velocity; RTL flows the other way; pauses off-screen; static in reduced motion |
| `data-split="words|lines"` | split at boot without animating (for your own timelines; prefer `BENM.split`) |
| `data-count-to="100"` (+ `data-count-from`, `-pad="3"`, `-duration="1.8"`) | counts up when revealed, localised digits |

Initial hidden states exist **only** with `html.js` and motion allowed; if `main.js` fails, a CSS failsafe shows
everything after 3 s. Reduced motion: everything is visible immediately, no Lenis, no parallax, no marquee motion.

Marquee markup:
```html
<div class="c-marquee" data-marquee aria-hidden="true"><div class="c-marquee__track">
  <span class="c-marquee__item"><span lang="en">Genuine leather</span><span class="c-marquee__sep">✦</span></span>
  <span class="c-marquee__item c-marquee__item--outline"><span lang="ckb">چەرمی ڕەسەن</span><span class="c-marquee__sep">✦</span></span>
</div></div>                                     <!-- .c-marquee--sm for a smaller band -->
```

---------------------------------------------------------------------------------------------------------------------

## 9. JS API reference (`window.BENM`)

| Area | API |
|---|---|
| state | `version` · `lang` · `dir` · `currency` · `reducedMotion` · `isTouch` · `lenis` (null when reduced motion) · `isRTL()` · `isReady()` |
| lifecycle | `page(fn)` · `ready(fn)` · `on(name, fn) → off()` · `off(name, fn)` · `emit(name, detail)` |
| i18n | `t(key, vars)` · `loc(obj)` · `num(n)` · `price(usd, cur?)` · `i18n.add({en, ckb})` · `i18n.apply(root)` · `i18n.has(key)` · `setLang(l)` · `setCurrency(c)` |
| scroll | `scrollTo(number | element | '#id' | 'top', { offset = -header, duration = 1.4, immediate, onComplete })` · `refresh()` (debounced ScrollTrigger.refresh) |
| motion | `reveal(root)` · `split(el, 'words'|'lines') → { words, lines, revert() }` |
| catalogue | `findProduct(id)` · `category(id)` · `products(filterFn)` · `search(query)` · `productCard(p, opts)` · `refreshProducts(root)` |
| cart | `cart.add(id, { color, size, qty, options }) → key` · `.remove(key)` · `.update(key, qty)` (≤0 removes) · `.restore(line)` · `.items()` → `[{ key, id, product, color, colorId, size, qty, options, unitPrice, lineTotal }]` · `.get(key)` · `.count()` · `.subtotal()` (USD) · `.has(id)` · `.clear()` · `.max` (10) |
| wishlist | `wishlist.toggle(id) → saved?` · `.add(id)` · `.remove(id)` · `.has(id)` · `.ids()` · `.items()` (products) · `.count()` · `.clear()` |
| gestures | `addToBag(id, opts, sourceEl)` (add + toast + fly) · `flyToBag(imgOrContainer)` · `openDrawer(tab)` · `closeDrawer()` · `quickView(id)` |
| WhatsApp | `whatsappLink(text)` → `https://wa.me/<config>?text=…` · `orderMessage(items?)` (bag by default) · `productMessage(id, { color, size, qty, options })` |
| UI | `toast(msg, opts)` · `modal.open/close/isOpen/el` · `icon(name, opts)` · `validate(form)` · `menu.*` · `searchUI.*` · `header.*` · `go(href)` |
| helpers | `param(name)` · `url(path)` (adds body[data-base]) · `esc(str)` |

`cart.add` options: `color` = colour id (defaults to the first = photographed colour), `size` (EU number; `null` for
one-size), `qty` (1–10), `options` = free object stored with the line — `options.fee` (USD) is added to the unit
price and `options.summary` (`{en, ckb}`) is shown in the drawer and the WhatsApp message (the Atelier uses this:
`{ fee: BENM_CONFIG.personalisationFee, summary: { en: 'Initials KH · Gold foil', ckb: '…' }, initials: 'KH', foil: 'gold' }`).
Identical id + colour + size + options merge into one line. Storage: `localStorage['benm:cart']`, `['benm:wishlist']`,
`['benm:lang']`, `['benm:currency']`; sessionStorage `benm:visited`, `benm:transition`. Tabs stay in sync.

Declarative commerce attributes (no JS needed): `[data-wish="<id>"]` (toggle, `aria-pressed` kept in sync everywhere;
add `data-wish-static` to keep your own aria-label) · `[data-quick-add="<id>"]` · `[data-quick-view="<id>"]` ·
`[data-add-to-bag="<id>" data-color data-size data-qty]` · `[data-open-drawer="bag|saved"]` · `[data-scroll-top]`.

---------------------------------------------------------------------------------------------------------------------

## 10. RTL rules

* Use logical properties only (`margin-inline-start`, `inset-inline-end`, `padding-inline`, `text-align: start`,
  `border-inline-start`). Grid/flex order mirrors automatically.
* Physical things must be mirrored explicitly: `translateX`, GSAP `x`/`xPercent`, horizontal scroll direction,
  `transform-origin: left`, gradients `90deg`, arrows (use `BENM.icon('arrow')` — auto-flipped — or `.u-flip-rtl`).
  In JS: `var dir = BENM.isRTL() ? -1 : 1; gsap.to(track, { x: dir * -distance })`.
* `scrollLeft` is negative in RTL (Chrome) — use `Math.abs()`.
* Never mirror the logo, product photos or the Latin "N°01" numerals. Prices/digits come from `BENM.price/num`.
* After a language switch the page direction flips: re-create direction-dependent ScrollTriggers in `langchange`.

## 11. Reduced motion

`BENM.reducedMotion === true` → no Lenis (`BENM.lenis === null`), no pin, no parallax, no scrub, reveals instant,
marquee static, counters final, preloader = 0.45 s fade, curtain off. In page code:
```js
if (B.reducedMotion) { /* final state, no ScrollTrigger pin / scrub */ return; }
```
CSS transitions/animations are globally neutralised in main.css under `prefers-reduced-motion: reduce`.

---------------------------------------------------------------------------------------------------------------------

## 12. Recipes

**Hero with a split headline** (plays when the preloader/curtain lifts, no extra JS):
```html
<section class="home-hero theme-night">
  <p class="c-eyebrow c-eyebrow--line" data-reveal="fade" data-i18n="home.hero.eyebrow">…</p>
  <h1 class="t-mega" data-reveal="lines" data-i18n-html="home.hero.title">Genuine leather, <em>made to last.</em></h1>
  <p class="t-lead" data-reveal="up" data-reveal-delay=".2" data-i18n="home.hero.lead">…</p>
  <div class="u-cluster" data-reveal="up" data-reveal-stagger=".08" data-reveal-delay=".35"> two .c-btn </div>
</section>
```
Custom timeline instead: split in `B.page`, animate in `B.ready`, and handle reduced motion:
```js
var s;
B.page(function () { if (!B.reducedMotion) { s = B.split(h1, 'words'); gsap.set(s.words, { yPercent: 115 }); } });
B.ready(function () { if (s) gsap.to(s.words, { yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: .05, onComplete: function () { s.revert(); } }); });
```

**Image reveal with parallax**
```html
<figure class="c-frame">
  <div class="u-media u-ratio-4x5" data-reveal="clip-up">
    <img src="assets/img/editorial/atelier.jpg" alt="…" width="1600" height="2000" loading="lazy" decoding="async" data-parallax="0.12">
  </div>
  <figcaption class="c-caption"><span class="c-caption__num">N°03</span><span data-i18n="…">…</span></figcaption>
</figure>
```

**Product grid + filters**
```js
B.page(render);
B.on('langchange', updateCounts);                 // cards re-localise themselves; only your own texts need work
function render() {
  var list = B.products(function (p) { return !cat || p.category === cat; });
  grid.innerHTML = list.map(function (p, i) { return B.productCard(p, { index: i + 1 }); }).join('');
  if (!B.reducedMotion) gsap.from(grid.children, { opacity: 0, y: 30, duration: .9, ease: 'expo.out', stagger: .05, clearProps: 'all' });
  B.reveal(grid);                                   // accordions/reveals inside + ScrollTrigger refresh
  history.replaceState(null, '', '?cat=' + cat);   // keep the URL in sync (file:// safe)
}
```

**RTL-safe pinned horizontal gallery** (desktop only, never in reduced motion):
```js
B.page(function () {
  if (B.reducedMotion || window.matchMedia('(max-width: 899px)').matches) return;   // vertical stack instead
  var mm = gsap.matchMedia();
  mm.add('(min-width: 900px)', function () {
    var dist = function () { return track.scrollWidth - section.clientWidth; };
    var tw = gsap.to(track, {
      x: function () { return (B.isRTL() ? 1 : -1) * dist(); }, ease: 'none',
      scrollTrigger: { trigger: section, pin: true, scrub: 1, start: 'top top', end: function () { return '+=' + dist(); }, invalidateOnRefresh: true }
    });
    return function () { tw.scrollTrigger && tw.scrollTrigger.kill(); tw.kill(); };
  });
  B.on('langchange', function () { B.refresh(); });   // x is a function → recomputed for the new direction
});
```
Put the track in an element with `overflow: clip` (or `.u-clip-x`) so it never causes horizontal page scroll.

**Page-specific ScrollTriggers — safe pattern**: create them inside `B.page` (fonts loaded, layout final), guard every
selector (`if (!el) return;` — GSAP/ScrollTrigger warn on missing targets and QA counts warnings), call `B.refresh()`
after you change layout later (images, accordions, filters), never read layout inside `onUpdate` loops, and kill/rebuild
direction-dependent tweens on `langchange`.

**WhatsApp order from the product page**
```js
link.href = B.whatsappLink(B.productMessage(id, { color: colorId, size: size, qty: 1 }));   // target="_blank" rel="noopener"
```

---------------------------------------------------------------------------------------------------------------------

## 13. Do / Don't

Do: use slots (`var(--fg-muted)`) and tokens · use `.c-btn__label` for the label roll · give images `width`/`height`
(or a ratio class) and `loading="lazy" decoding="async"` below the fold · add `data-lenis-prevent` to any scrollable
area inside a fixed panel · keep page keys prefixed · re-render your own data-driven texts on `langchange` · use
`B.price()` / `data-price` for every price and `B.num()` for digits · test with `--lang ckb --mobile` and `--reduced`.

Don't: hard-code hex · use `!important` · redefine `.c-*` classes · put a `<header>`/`<footer>` in pages · use
`type="module"`, `fetch()`, `<link rel=preload>` · split text into chars · use physical `left/right/margin-left`
· animate `width/height/top/left` · pass selector strings that may match nothing to GSAP · call
`lenis.scrollTo('#missing')` (use `B.scrollTo`, it is guarded) · use gold-500 for small text on ivory (use `--accent`).

## 14. Gotchas

* SplitText `revert()` empties its arrays — `BENM.split` keeps copies; reveal splits are reverted after they play
  (keep no references to children of a `data-reveal="lines|words"` element).
* A language switch reverts every split and re-splits (`data-split` / `BENM.split` elements) — page timelines that
  hold split pieces must be rebuilt in `langchange`.
* `BENM.lenis` is `null` in reduced motion — always guard: `if (B.lenis) B.lenis.stop();`.
* The header is fixed: light-header pages need top padding (`.u-pad-header` or `calc(var(--header-h) + …)`).
* Fixed/pinned elements: use `--z-sticky` (50) or lower; overlays live above 90.
* Elements inside open overlays are outside `<main>`; query them from `document`.
* `data-reveal` is driven by vertical scroll: inside a horizontally pinned track use your own tweens with
  ScrollTrigger `containerAnimation` instead (or reveal the whole track once).
* `BENM.refresh()` is debounced (120 ms); call `ScrollTrigger.refresh()` directly if you need it synchronously.
* `leather.js` attaches `BENM.Leather` after main.js — `window.BENM` is a plain object, extend it, never replace it.
* bfcache only exists over http(s); from file:// "Back" reloads the page (both paths are handled).
* From file:// every page is its own origin: storage is shared, but canvas reads of image files are tainted.

## 15. QA

```bash
QA="C:/Users/mahmod/AppData/Local/Temp/claude/d--desktop-folder-bendotm/8ad16062-9889-4d18-ad03-515f15b14d17/scratchpad/qa"
node "$QA/shoot.mjs" --page styleguide.html --agent <you> --sheet
node "$QA/shoot.mjs" --page styleguide.html --lang ckb --mobile --agent <you> --sheet
node "$QA/tests/foundation-core.mjs" [--lang ckb] [--mobile]      # chrome interaction test (39 checks)
node "$QA/tests/foundation-preloader.mjs"                         # timed preloader frames
node "$QA/links.mjs"
```
