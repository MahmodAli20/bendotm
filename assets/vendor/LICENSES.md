# Third-party libraries — Ben.M website

All runtime libraries are self-hosted in this folder (no CDN at runtime). Files are byte-identical copies of the
official npm package builds (`dist/` UMD bundles), so they can be verified against the registry with the checksums below.

| File | Library | Version | Source (npm) | Global | License |
|---|---|---|---|---|---|
| `gsap.min.js` | GSAP core | 3.15.0 | `gsap@3.15.0` → `dist/gsap.min.js` | `window.gsap` | GSAP Standard "No Charge" License |
| `ScrollTrigger.min.js` | GSAP ScrollTrigger | 3.15.0 | `gsap@3.15.0` → `dist/ScrollTrigger.min.js` | `window.ScrollTrigger` | GSAP Standard "No Charge" License |
| `SplitText.min.js` | GSAP SplitText | 3.15.0 | `gsap@3.15.0` → `dist/SplitText.min.js` | `window.SplitText` | GSAP Standard "No Charge" License |
| `lenis.min.js` (+ `lenis.min.js.map`) | Lenis smooth scroll | 1.3.26 | `lenis@1.3.26` → `dist/lenis.min.js` | `window.Lenis` | MIT |
| `lenis.css` | Lenis recommended CSS | 1.3.26 | `lenis@1.3.26` → `dist/lenis.css` | — | MIT |

Load order (classic scripts, end of `<body>`, see BRIEF §6): `gsap.min.js` → `ScrollTrigger.min.js` → `SplitText.min.js` → `lenis.min.js`.
Register plugins once: `gsap.registerPlugin(ScrollTrigger, SplitText)`.

`lenis.min.js.map` is shipped only because `lenis.min.js` ends with a `//# sourceMappingURL=` comment; keeping the map
next to it avoids a "failed to load source map" notice when DevTools is open. It is never requested in normal browsing.

---

## GSAP (GreenSock Animation Platform) — 3.15.0

- Copyright © 2008–2026, GreenSock (a Webflow company). All rights reserved.
- License: **GSAP Standard "No Charge" License** — <https://gsap.com/standard-license>
- Since GSAP 3.13 (2025) the whole toolset, **including the formerly "Club" plugins such as SplitText**, is free for
  everyone, **including commercial use** (client websites, e-commerce, sites that sell products), with no membership
  required.
- Main restriction (read the full text above for details): GSAP may not be used to build a product that competes with
  Webflow's own visual/no-code animation tools. A brand website like this one is clearly permitted.
- The license header inside each `.min.js` file must be kept intact.

## Lenis — 1.3.26

- Copyright © 2024 darkroom.engineering — <https://github.com/darkroomengineering/lenis>
- License: **MIT**

```
The MIT License

Copyright (c) 2024 darkroom.engineering

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

## Fonts

The self-hosted web fonts in `assets/fonts/` are licensed separately under the SIL Open Font License 1.1 — see
`assets/fonts/LICENSES.md`.

---

## SHA-256 checksums

```
92bb9a96476f983d212a2bc4f54c889039c1696dd4461d40a736860938570fbb  gsap.min.js
b0b14d67b55b0c43c756ac0b106cfcb09d0879945f6ead64451065b0672916a2  ScrollTrigger.min.js
419f7027a5f086a12cb7988736d8fdd3a6ed2200229661de25b6628ca7ced344  SplitText.min.js
53195c9797e7ce7bf9d7fa9242b08209e57f46de4c9dac126a6494fa780e3346  lenis.min.js
77a24127c50cdd07207ea234d5245635e7107861481d9faa430d675ad6755414  lenis.min.js.map
2f668ae84a668327f246faf8a770383a2bf69196d214290fbc4d5548910606c5  lenis.css
```

To update: `npm pack gsap@<ver> lenis@<ver>`, copy the same files out of each package's `dist/`, update this table.
