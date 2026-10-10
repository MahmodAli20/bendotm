# Ben.M — website

A bilingual (English / Central Kurdish, right-to-left) luxury website for **Ben.M**, a genuine-leather goods brand
(shoes, bags, belts, wallets), in the brand's deep green and gold.

Static HTML + CSS + vanilla JavaScript — **no build step, no server needed.**

---

## Open it

- **Locally:** double-click `index.html` (it works straight from the folder, offline — fonts and libraries are local).
- **Hosted:** upload the whole folder to any static host (Netlify / Vercel drag-and-drop, cPanel, S3…). Nothing to build.
- Optional local server: `npx serve .` (only needed if you want `http://` URLs).

## Host the demo

**GitHub Pages** (free, HTTPS). On a free GitHub account the repository must be **public**.
1. Create an empty repository on github.com, e.g. `benm`.
2. Push this folder to it (the `.gitignore` keeps local tooling such as `.claude/` out), or use "Add file → Upload files".
3. Repository → Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)` → Save.
4. After a minute the site is live at `https://<username>.github.io/benm/`.

**Netlify Drop** (no Git, link can stay unlisted): drag this folder onto https://app.netlify.com/drop.

Already prepared for hosting: `.nojekyll` (GitHub serves files as-is), `404.html` works from any missing URL
(it detects the `/<repo>/` folder on github.io; set `<html data-site-root="/your-folder/">` for other sub-folders).

**Demo mode:** every page has `<meta name="robots" content="noindex, nofollow">` and `robots.txt` blocks crawlers, so the
preview (with placeholder contacts) never appears in Google under the brand's name. **Remove both at launch.**

## Pages

| File | Page |
|---|---|
| `index.html` | Home — interactive leather hero (the logo debossed in gold foil, lit by the mouse), collections, new arrivals, craft, leathers, atelier teaser, lookbook, newsletter |
| `shop.html` | Collection — `?cat=men\|women\|bags\|accessories`, `?q=search`, `?new=1`, `?saved=1`; filters, sort, grid density, quick view |
| `product.html` | Product detail — `?id=<product id>` (e.g. `product.html?id=azmar-oxford`); gallery + zoom, colours, sizes, size guide, bag, WhatsApp order |
| `maison.html` | The House — story, the craft in six steps (`#craft`), materials (`#materials`), care guide (`#care`) |
| `atelier.html` | Personalisation — live configurator (`#configurator`: piece, leather, foil, initials, lettering) and appointment form (`#appointment`) |
| `boutiques.html` | Boutiques & client services — map, three boutiques, contact form (`#contact`), FAQ (`#faq`) |
| `404.html` | Not-found page (set it as the 404 page on your host) |
| `styleguide.html` | Internal design-system reference (not linked from the site) |

## Features

- Header with menu overlay, live search (both languages), bag + saved-items drawer, toasts, custom cursor.
- First-visit preloader (the wordmark draws itself in gold) and page-transition curtain.
- **EN ⇄ کوردی** switch: full RTL layout, Kurdish fonts, Eastern Arabic digits; remembered per visitor.
- **USD ⇄ IQD** switch (rate in `BENM_CONFIG.currency.iqdRate`).
- Bag and wishlist stored in the visitor's browser (localStorage). **Checkout = an order message sent via WhatsApp**
  (no payment backend yet).
- Smooth scrolling and scroll animations (GSAP + Lenis); everything respects "reduce motion".
- WebGL leather renderer (`assets/js/leather.js`) with an automatic CSS fallback when WebGL is unavailable.

## Edit the content

| What | Where |
|---|---|
| **Contact details, WhatsApp number, socials, IQD rate, free-shipping threshold, personalisation fee** | `assets/js/data.js` → `BENM_CONFIG` |
| Products (22 demo pieces), categories, leather colours | `assets/js/data.js` → `BENM_PRODUCTS`, `BENM_CATEGORIES`, `BENM_LEATHERS` |
| Boutique addresses, hours, phones, map positions | `assets/js/data.js` → `BENM_STORES` |
| Shared texts (menu, header, footer, bag, forms) in EN + Kurdish | `assets/js/i18n.js` |
| Page texts in EN + Kurdish | top of `assets/js/pages/<page>.js` (`BENM.i18n.add({ en: {…}, ckb: {…} })`) |
| Colours, fonts, spacing (design tokens) | `assets/css/main.css` → `:root` |
| Logo | `assets/brand/` (SVG + PNG) and `assets/js/brand.js` (traced from the original logo files) |
| Photos | `assets/img/…` — replace files keeping the same names and sizes (see below) |

Developer reference for every component, class and JS API: `docs/FOUNDATION.md` (+ open `styleguide.html`).

### Photo sizes (replace with the same file names)

- Products: `assets/img/products/<id>-1.jpg` (main) and `<id>-2.jpg` (hover/second) — 1200×1500
- Categories: `assets/img/categories/{men,women,bags,accessories}.jpg` — 1200×1600
- Editorial: `assets/img/editorial/hero-1..3, campaign-1..3, maison-hero` — 2400×1350; `atelier, care, notfound` — 1600×2000
- Lookbook: `assets/img/lookbook/look-1..8.jpg` — 1200×1600
- Craft: `assets/img/craft/*.jpg` — 1600×2000 (`workshop.jpg` 2400×1350)
- Boutiques: `assets/img/stores/{erbil,sulaymaniyah,duhok}.jpg` — 1600×1200 (`interior-wide.jpg` 2400×1350)

## Before launch — checklist

1. **Photos are placeholders** (Unsplash, colour-graded to match). They are *not* Ben.M products — replace them with the
   client's own photography. Credits per file: `assets/img/credits-*.json`.
2. **Placeholder contact data**: WhatsApp `9647500000000`, phone, email `hello@benm-leather.com`, social links, and the
   three boutique addresses/phones in `data.js` are invented — replace them.
3. **Catalogue**: product names, prices, sizes and descriptions are demo content — replace with the real collection.
4. **Kurdish copy**: written in natural Sorani with proper Kurdish letters, but have a native speaker proofread it.
5. **Forms** (newsletter, contact, appointment) validate and show a success state but send nothing yet — connect them
   (e.g. Formspree, Netlify Forms, EmailJS or your backend). Checkout currently sends the order via WhatsApp.
6. **Link previews**: `og:image` uses a relative path; once you have a domain, change it to an absolute URL
   (`https://yourdomain/assets/brand/og-image.jpg`) on each page.
7. Set `404.html` as the host's not-found page (GitHub Pages and Netlify pick it up automatically).
8. Remove the demo-mode `noindex` meta tags (6 pages) and change `robots.txt` to allow crawling.
9. Optional: remove `styleguide.html` and `docs/` from the public upload.

## Quality notes

- Automated checks (headless Chrome): every page × EN/Kurdish × desktop 1440×900 / mobile 390×844 — 0 console errors,
  0 warnings, no missing translations, no horizontal overflow; all 398 local links/assets resolve; per-page interaction
  tests (bag, wishlist, filters, configurator, forms, anchors, language switch) pass.
- Tested in Chrome. Safari and Firefox were not automatically tested — give them a manual pass before launch.

## Credits & licences

- Logo and brand: © Ben.M.
- [GSAP](https://gsap.com) (incl. ScrollTrigger, SplitText) — GSAP Standard "no charge" licence (free for commercial use).
- [Lenis](https://github.com/darkroomengineering/lenis) — MIT.
- Fonts: Cormorant Garamond, Poppins, Noto Naskh Arabic, Noto Sans Arabic — SIL Open Font License (self-hosted).
- Placeholder photography: [Unsplash](https://unsplash.com) licence — see `assets/img/credits-*.json`.
