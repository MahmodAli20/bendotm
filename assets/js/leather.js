/* =====================================================================================================================
   Ben.M — leather.js
   Procedural full-grain leather with a debossed, foil-stamped mark and a saddle-stitched border (WebGL 1).
   ---------------------------------------------------------------------------------------------------------------------
   const tag = BENM.Leather.create(el, { color, grain, foil, mark, markScale, stitch, stitchColor, interactive, tilt,
                                         idle, … });
   tag.set({ color: '#8A4B22', mark: { type: 'text', text: 'KH' } });     // live update
   tag.setLight(nx, ny);  tag.pause();  tag.resume();  tag.destroy();
   BENM.Leather.snapshot(opts, width, height) → Promise<dataURL>           // static render, one shared context
   BENM.Leather.supported → boolean                                         // WebGL usable
   BENM.Leather.preset('hero' | 'heroFull' | 'atelier' | 'swatch', overrides) → options object
   ---------------------------------------------------------------------------------------------------------------------
   Pipeline
   1. grain pass     (once per size / grain change) — domain-warped cellular pebbles with per-crease depth, micro grain,
                     wrinkles, nap and mottling → 16-bit height + albedo + cavity texture. One small shader per grain.
   2. composite pass (once per mark / stitch / shape change) — the mark mask (2D canvas: Path2D or fillText; one sharp
      + normal pass   and two blurred channels) presses the deboss into the grain; the analytic saddle stitch and the
                     burnished edge are added; normals by central differences → two G-buffer textures.
   3. light pass     (each frame, only while something moves) — leather / waxed thread / metal foil under a warm point
                     light that follows the pointer: two texture reads per pixel.
   Shaders compile in the background (KHR_parallel_shader_compile); the panel shows its flat colour until the first
   frame, then fades in. file:// safe: nothing is loaded. Standalone: attaches to window.BENM (created if missing) and
   uses window.BENM_BRAND (brand.js) for the wordmark when present (falls back to serif text).
   ===================================================================================================================== */
(function (root) {
  'use strict';

  var doc = root.document;
  if (!doc) return;
  var BENM = (root.BENM = root.BENM || {});

  /* ---- 1. Options, presets, material tables ------------------------------------------------------------------- */

  var DEFAULTS = {
    color: '#1F3E35',          // leather colour (hex)
    grain: 'pebble',           // 'pebble' | 'smooth' | 'suede'
    foil: 'gold',              // 'gold' | 'silver' | 'blind' (deboss only) | 'none' (no mark)
    mark: { type: 'logo' },    // {type:'logo', tagline?:'en'|'ckb', reg?:bool} | {type:'monogram'} |
                               // {type:'text', text:'AB', font:'serif'|'roman'} | null
    markScale: 0.55,           // the mark is fitted (contain) into markScale × panel width/height
    markOffset: [0, 0],        // mark centre offset, fraction of the panel size (x right, y down)
    stitch: true,
    stitchColor: '#C4A062',
    shape: 'tag',              // 'tag' = rounded panel, burnished edge, soft shadow · 'fill' = edge to edge
    radius: null,              // corner radius in CSS px (null = automatic; 'fill' defaults to 0)
    interactive: true,         // the pointer moves the light
    tilt: true,                // CSS 3D tilt toward the pointer ('tag' only)
    tiltMax: 6,                // degrees
    idle: true,                // slow light orbit when nobody is pointing (touch, before the first move); not on
                               // software-rendered WebGL (SwiftShader / blocklisted GPUs) or with reduced motion
    track: 'window',           // pointer area: 'window' | 'self' | Element
    light: [0.3, 0.24],        // resting light position (normalised panel coordinates, may lie outside 0…1)
    lightHeight: 0.42,         // light height × panel diagonal: low = dramatic torch, high (0.7) = soft even light
    grainScale: 1,             // multiplies the grain size
    seed: 1,                   // grain variation
    shadow: true,              // soft drop shadow under a 'tag'
    maxDpr: 2,                 // device-pixel-ratio cap (1.5 is applied on coarse pointers)
    maxPixels: 0,              // drawing-buffer pixel budget (0 = automatic)
    label: '',                 // accessible name (role="img"); empty = decorative (aria-hidden)
    onReady: null              // fn(tag) after the first frame
  };

  // cell: grain feature size in CSS px for a ~560 px panel · amp: relief height / cell · gloss: base glossiness
  var GRAINS = {
    pebble: { id: 0, cell: 7.5, amp: 0.07, gloss: 0.3 },
    smooth: { id: 1, cell: 9.0, amp: 0.055, gloss: 0.5 },
    suede: { id: 2, cell: 3.2, amp: 0.1, gloss: 0.0 }
  };

  // Metal F0 (linear) of the foils
  var FOILS = { gold: [1.0, 0.7, 0.3], silver: [0.84, 0.86, 0.88] };

  var PRESETS = {
    hero: { grain: 'pebble', foil: 'gold', mark: { type: 'logo' }, markScale: 0.56, stitch: true, shape: 'tag',
      tilt: true, idle: true, track: 'window' },
    heroFull: { grain: 'pebble', foil: 'gold', mark: { type: 'logo' }, markScale: 0.44, stitch: true, shape: 'fill',
      tilt: false, idle: true, track: 'window' },
    atelier: { grain: 'pebble', foil: 'gold', mark: { type: 'text', text: 'BM', font: 'serif' }, markScale: 0.36,
      stitch: true, shape: 'tag', tilt: true, idle: true, track: 'self' },
    swatch: { shape: 'fill', foil: 'blind', mark: { type: 'monogram' }, markScale: 0.3, stitch: true,
      light: [0.26, 0.2] }
  };

  var SNAPSHOT_DEFAULTS = { shape: 'fill', interactive: false, tilt: false, idle: false, shadow: false,
    light: [0.27, 0.2], lightHeight: 0.62 };

  /* ---- 2. Small utilities -------------------------------------------------------------------------------------- */

  var noop = function () {};
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var now = function () { return root.performance && root.performance.now ? root.performance.now() : Date.now(); };
  var raf = root.requestAnimationFrame ? root.requestAnimationFrame.bind(root) : function (fn) {
    return root.setTimeout(function () { fn(now()); }, 16);
  };
  var caf = root.cancelAnimationFrame ? root.cancelAnimationFrame.bind(root) : root.clearTimeout.bind(root);
  var media = function (q) { return root.matchMedia ? root.matchMedia(q) : null; };
  var HEX_RE = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

  function parseHex(hex) {
    var m = HEX_RE.exec(String(hex || '').trim());
    if (!m) return null;
    var h = m[1];
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    return [parseInt(h.slice(0, 2), 16) / 255, parseInt(h.slice(2, 4), 16) / 255, parseInt(h.slice(4, 6), 16) / 255];
  }

  function toLinear(rgb) {
    return rgb.map(function (c) { return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); });
  }

  function shade(hex, k) {   // darken (k < 1) / lighten an sRGB hex, returns css rgb()
    var c = parseHex(hex) || [0, 0, 0];
    return 'rgb(' + c.map(function (v) { return Math.round(clamp(v * k, 0, 1) * 255); }).join(',') + ')';
  }

  function copy(obj) { return JSON.parse(JSON.stringify(obj)); }

  function normaliseMark(m) {
    if (!m || m === 'none') return null;
    if (typeof m === 'string') m = (m === 'logo' || m === 'monogram') ? { type: m } : { type: 'text', text: m };
    if (m.type === 'text') {
      var t = String(m.text == null ? '' : m.text).trim();
      return t ? { type: 'text', text: t.slice(0, 12), font: m.font === 'roman' ? 'roman' : 'serif' } : null;
    }
    if (m.type === 'monogram') return { type: 'monogram' };
    return { type: 'logo', tagline: m.tagline === 'en' || m.tagline === 'ckb' ? m.tagline : false, reg: !!m.reg };
  }

  function pair(v, fallback) {
    return Array.isArray(v) && v.length > 1 && isFinite(v[0]) && isFinite(v[1]) ? [+v[0], +v[1]] : fallback.slice();
  }

  function normalise(raw) {
    var o = {}, k;
    for (k in DEFAULTS) o[k] = DEFAULTS[k];
    for (k in raw) if (Object.prototype.hasOwnProperty.call(raw, k) && raw[k] !== undefined) o[k] = raw[k];
    o.color = parseHex(o.color) ? String(o.color).trim() : DEFAULTS.color;
    if (o.color[0] !== '#') o.color = '#' + o.color;
    o.grain = GRAINS[o.grain] ? o.grain : 'pebble';
    o.foil = (FOILS[o.foil] || o.foil === 'blind' || o.foil === 'none') ? o.foil : 'gold';
    o.mark = normaliseMark(o.mark);
    o.markScale = clamp(+o.markScale || DEFAULTS.markScale, 0.04, 1);
    o.markOffset = pair(o.markOffset, DEFAULTS.markOffset);
    o.stitch = !!o.stitch;
    o.stitchColor = parseHex(o.stitchColor) ? String(o.stitchColor).trim() : DEFAULTS.stitchColor;
    if (o.stitchColor[0] !== '#') o.stitchColor = '#' + o.stitchColor;
    o.shape = o.shape === 'fill' ? 'fill' : 'tag';
    o.radius = (o.radius == null || o.radius === '' || !isFinite(o.radius)) ? null : Math.max(0, +o.radius);
    o.interactive = !!o.interactive;
    o.tilt = !!o.tilt;
    o.tiltMax = clamp(+o.tiltMax || 0, 0, 20);
    o.idle = !!o.idle;
    o.light = pair(o.light, DEFAULTS.light);
    o.lightHeight = clamp(+o.lightHeight || DEFAULTS.lightHeight, 0.15, 2);
    o.grainScale = clamp(+o.grainScale || 1, 0.25, 4);
    o.seed = isFinite(o.seed) ? +o.seed : 1;
    o.shadow = !!o.shadow;
    o.maxDpr = clamp(+o.maxDpr || 2, 0.5, 3);
    o.maxPixels = Math.max(0, +o.maxPixels || 0);
    o.label = o.label ? String(o.label) : '';
    o.onReady = typeof o.onReady === 'function' ? o.onReady : null;
    return o;
  }

  // What a change between two normalised option sets costs: 3 grain, 2 mark/stitch/shape, 1 uniforms only, 0 nothing
  function changeLevel(a, b) {
    if (a.grain !== b.grain || a.grainScale !== b.grainScale || a.seed !== b.seed) return 3;
    var markA = a.foil === 'none' ? null : a.mark, markB = b.foil === 'none' ? null : b.mark;
    if (JSON.stringify(markA) !== JSON.stringify(markB) || a.markScale !== b.markScale ||
        a.markOffset.join() !== b.markOffset.join() || a.stitch !== b.stitch || a.shape !== b.shape ||
        a.radius !== b.radius) return 2;
    if (a.color !== b.color || a.foil !== b.foil || a.stitchColor !== b.stitchColor ||
        a.lightHeight !== b.lightHeight) return 1;
    return 0;
  }

  /* ---- 3. Geometry (CSS px → device px) ------------------------------------------------------------------------- */

  function layout(o, cssW, cssH, W, H) {
    var dpr = W / cssW;
    var m = Math.min(cssW, cssH);
    var tag = o.shape === 'tag';
    var g = GRAINS[o.grain];
    var radius = o.radius != null ? o.radius : tag ? clamp(m * 0.028, 3, 20) : 0;
    radius = Math.min(radius, m / 2);
    var inset = clamp(m * 0.062, 7, 40);
    var pitch = clamp(m * 0.025, 6.5, 14);
    var thread = pitch * 0.13;                                    // thread radius
    var cell = g.cell * o.grainScale * clamp(Math.sqrt(m / 560), 0.62, 1.3);
    // stitch loop (centre line of the seam)
    var bx = Math.max(cssW / 2 - inset, pitch), by = Math.max(cssH / 2 - inset, pitch);
    var lr = Math.min(Math.max(radius - inset * 0.5, pitch * 1.25), bx, by);
    var quarter = (bx - lr) + Math.PI / 2 * lr + (by - lr);
    var count = Math.max(8, Math.round(4 * quarter / pitch));
    var L = 4 * quarter / count;
    var slant = 0.55;                                             // stitch angle to the seam (rad)
    var halfLen = Math.max(0.3, (0.8 * L - 2 * thread) / (2 * Math.cos(slant)));
    return {
      W: W, H: H, dpr: dpr, cssW: cssW, cssH: cssH, m: m, tag: tag,
      radius: radius * dpr, radiusCss: radius,
      edge: clamp(m * 0.006, 1.6, 4) * dpr,
      vignette: m * 0.24 * dpr,
      cell: cell * dpr,
      amp: cell * g.amp * dpr,
      loop: [bx * dpr, by * dpr, lr * dpr],
      stitch: [L * dpr, thread * dpr, slant, count],
      halfLen: halfLen * dpr,
      groove: thread * 0.32 * dpr,
      crinkle: 0.07 * dpr,
      crinkleFreq: 1 / (2.4 * dpr),
      markBox: [cssW * o.markScale * dpr, cssH * o.markScale * dpr,
        cssW * (0.5 + o.markOffset[0]) * dpr, cssH * (0.5 + o.markOffset[1]) * dpr]
    };
  }

  /* ---- 4. GLSL ---------------------------------------------------------------------------------------------------- */

  var VS = 'attribute vec2 aPos;\nvoid main() { gl_Position = vec4(aPos, 0.0, 1.0); }';

  var GLSL_HASH = [
    'precision highp float;',
    'float hash12(vec2 p) {',
    '  vec3 p3 = fract(vec3(p.xyx) * 0.1031);',
    '  p3 += dot(p3, p3.yzx + 33.33);',
    '  return fract((p3.x + p3.y) * p3.z);',
    '}',
    'vec2 hash22(vec2 p) {',
    '  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));',
    '  p3 += dot(p3, p3.yzx + 33.33);',
    '  return fract((p3.xx + p3.yz) * p3.zy);',
    '}'
  ].join('\n');

  var GLSL_NOISE = [
    // gradient noise, roughly -1…1
    'float gnoise(vec2 p) {',
    '  vec2 i = floor(p), f = fract(p);',
    '  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);',
    '  float a = dot(hash22(i) * 2.0 - 1.0, f);',
    '  float b = dot(hash22(i + vec2(1.0, 0.0)) * 2.0 - 1.0, f - vec2(1.0, 0.0));',
    '  float c = dot(hash22(i + vec2(0.0, 1.0)) * 2.0 - 1.0, f - vec2(0.0, 1.0));',
    '  float d = dot(hash22(i + vec2(1.0, 1.0)) * 2.0 - 1.0, f - vec2(1.0, 1.0));',
    '  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y) * 1.45;',
    '}',
    'const mat2 ROT = mat2(1.6, 1.2, -1.2, 1.6);',
    'float fbm3(vec2 p) {',
    '  float s = 0.0, a = 0.5;',
    '  for (int i = 0; i < 3; i++) { s += a * gnoise(p); p = ROT * p + 7.13; a *= 0.5; }',
    '  return s;',
    '}',
    'float fbm5(vec2 p) {',
    '  float s = 0.0, a = 0.5;',
    '  for (int i = 0; i < 5; i++) { s += a * gnoise(p); p = ROT * p + 3.71; a *= 0.5; }',
    '  return s;',
    '}'
  ].join('\n');

  // Compiled once per grain type: '#define GRAIN 0|1|2' is prepended (keeps each variant small → fast compile)
  var FS_GRAIN = [
    'uniform vec2 uRes;',
    'uniform vec4 uGrain;   // x cell (device px), zw seed offset',
    'uniform vec4 uGrainB;  // x one device px in cell units',
    // F1/F2 cellular distances, offset to the nearest feature point, ids of the nearest and second-nearest cells
    'vec2 voronoi(vec2 x, out vec2 nr, out vec2 cid, out vec2 cid2) {',
    '  vec2 n = floor(x), f = fract(x);',
    '  float d1 = 8.0, d2 = 8.0;',
    '  nr = vec2(0.0); cid = n; cid2 = n;',
    '  for (int j = -1; j <= 1; j++) {',
    '    for (int i = -1; i <= 1; i++) {',
    '      vec2 g = vec2(float(i), float(j));',
    '      vec2 r = g + 0.13 + 0.74 * hash22(n + g) - f;',
    '      float d = dot(r, r);',
    '      if (d < d1) { d2 = d1; cid2 = cid; d1 = d; nr = r; cid = n + g; }',
    '      else if (d < d2) { d2 = d; cid2 = n + g; }',
    '    }',
    '  }',
    '  return vec2(sqrt(d1), sqrt(d2));',
    '}',
    '#if GRAIN == 0',
    // Pebble: soft domes; every crease has its own depth (hash of the two cells it separates) so faint creases merge
    // neighbours into irregular blobs; finer pebbles in patches; a slight tilt per pebble so each catches the light
    'void grainAt(vec2 p, float px, out float h, out float alb, out float cav) {',
    '  vec2 w = vec2(fbm3(p * 0.16 + 1.7), fbm3(p * 0.16 + 9.2));',
    '  vec2 q = p + w * 0.9 + 0.14 * vec2(gnoise(p * 1.3 + 3.0), gnoise(p * 1.3 + 7.0));',
    '  vec2 nr, cid, cidB;',
    '  vec2 v = voronoi(q, nr, cid, cidB);',
    '  float e = v.y - v.x;',
    '  float rnd = hash12(cid + 0.37);',
    '  float depth = (0.45 + 0.55 * hash12(cid + cidB + 0.71)) *',
    '    (0.6 + 0.4 * smoothstep(-0.4, 0.4, gnoise(q * 0.7 + 2.0)));',
    '  float x = clamp(e / 0.7, 0.0, 1.0);',
    '  float dome = 1.0 - depth * (1.0 - x) * (1.0 - x);',
    '  float bump = 1.0 - clamp(dot(nr, nr) / 0.5, 0.0, 1.0);',
    '  float crease = (1.0 - smoothstep(0.0, max(0.045, 1.2 * px), e)) * depth;',
    '  vec2 tdir = hash22(cid + 4.1) - 0.5;',
    '  float tilt = dot(nr, tdir) * 0.3;',
    '  vec2 nr2, c2a, c2b;',
    '  vec2 v2 = voronoi(q * 2.1 + 3.3, nr2, c2a, c2b);',
    '  float e2 = v2.y - v2.x;',
    '  float sub = smoothstep(-0.3, 0.4, gnoise(p * 0.18 + 5.0));',
    '  float depth2 = (0.3 + 0.7 * hash12(c2a + c2b + 0.13)) * sub;',
    '  float x2 = clamp(e2 / 0.6, 0.0, 1.0);',
    '  float dome2 = 1.0 - 0.6 * depth2 * (1.0 - x2) * (1.0 - x2);',
    '  float crease2 = (1.0 - smoothstep(0.0, max(0.09, 2.0 * px), e2)) * depth2;',
    '  float relief = fbm3(p * 0.04 + 3.1);',
    '  h = (0.6 * dome + 0.4 * bump) * dome2 * (0.85 + 0.25 * rnd) + tilt * dome - 0.28 * crease - 0.16 * crease2',
    '    + 0.5 * relief;',
    '  cav = 1.0 - 0.3 * crease - 0.14 * crease2;',
    '  alb = 1.0 + 0.085 * fbm3(p * 0.05 + 11.0) + 0.04 * (rnd - 0.5) + 0.03 * gnoise(p * 0.45);',
    '  alb *= 1.0 - 0.06 * crease;',
    '}',
    '#elif GRAIN == 1',
    // Smooth calf: soft crackle net (lighter, open creases), micro grain speckle, long soft wrinkles, aniline mottling
    'void grainAt(vec2 p, float px, out float h, out float alb, out float cav) {',
    '  vec2 w = vec2(fbm3(p * 0.1 + 2.3), fbm3(p * 0.1 + 6.1));',
    '  vec2 q = p + w * 1.5;',
    '  vec2 nr, cid, cidB;',
    '  vec2 v = voronoi(q, nr, cid, cidB);',
    '  float e = v.y - v.x;',
    '  float net = smoothstep(-0.3, 0.5, gnoise(p * 0.15 + 8.0));',
    '  float crease = (1.0 - smoothstep(0.0, max(0.05, 1.1 * px), e)) * (0.25 + 0.75 * net);',
    '  float x = clamp(e / 0.6, 0.0, 1.0);',
    '  float dome = 1.0 - (1.0 - x) * (1.0 - x);',
    // micro grain: tiny rounded grain tops, the granular speckle of aniline calf (denser in patches)
    '  vec2 nr3, cid3, cid3B;',
    '  vec2 v3 = voronoi(p * 3.4 + w * 2.0, nr3, cid3, cid3B);',
    '  float x3 = clamp((v3.y - v3.x) / max(0.45, 10.0 * px), 0.0, 1.0);',
    '  float micro = (1.0 - (1.0 - x3) * (1.0 - x3)) * (0.55 + 0.45 * hash12(cid3 + 0.7));',
    '  float dens = smoothstep(-0.6, 0.6, gnoise(p * 0.18 + 1.5));',
    '  float wr = 1.0 - abs(gnoise(vec2(p.x * 0.05, p.y * 0.12) + w * 0.5 + 4.0));',
    '  wr = wr * wr * wr;',
    '  float relief = fbm3(p * 0.035 + 1.0);',
    '  float mott = fbm5(p * 0.022 + w * 0.3 + 4.0);',
    '  h = 0.14 * dome * (0.4 + 0.6 * net) + 0.2 * micro * (0.35 + 0.65 * dens) + 0.4 * wr + 0.55 * relief;',
    '  cav = 1.0 - 0.15 * crease - 0.12 * (1.0 - micro) * dens;',
    '  alb = (1.0 + 0.24 * mott + 0.05 * gnoise(p * 0.3)) * (1.0 + 0.07 * crease - 0.07 * wr) * (0.97 + 0.06 * micro * dens);',
    '}',
    '#else',
    // Suede: nap fibres combed in slowly turning directions, brushed patches, per-pixel velvet speckle
    'void grainAt(vec2 p, float px, out float h, out float alb, out float cav) {',
    '  float nap = fbm3(p * 0.012 + 2.0);',
    '  float ang = fbm3(p * 0.008 + 7.0) * 1.4 + 0.6;',
    '  vec2 dir = vec2(cos(ang), sin(ang));',
    '  vec2 fp = vec2(dot(p, dir), dot(p, vec2(-dir.y, dir.x)));',
    '  float fib = gnoise(fp * vec2(1.4, 2.8)) * 0.5 + gnoise(fp * vec2(2.6, 5.2) + 3.0) * 0.5;',
    '  float fuzz = hash12(floor(gl_FragCoord.xy) + 0.5) - 0.5;',
    '  h = 0.22 * fib + 0.35 * nap + 0.14 * fuzz;',
    '  cav = 1.0 - 0.24 * max(-fib, 0.0);',
    '  alb = 1.0 + 0.17 * nap + 0.1 * fib + 0.12 * fuzz;',
    '}',
    '#endif',
    'void main() {',
    '  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uGrain.x + uGrain.zw;',
    '  float h, alb, cav;',
    '  grainAt(p, uGrainB.x, h, alb, cav);',
    '  float h8 = clamp((h + 1.0) / 3.0, 0.0, 1.0) * 255.0;',
    '  gl_FragColor = vec4(floor(h8) / 255.0, fract(h8), clamp(alb * 0.5, 0.0, 1.0), clamp(cav, 0.0, 1.0));',
    '}'
  ].join('\n');

  // Composite: grain + deboss + stitch + edge, evaluated once per pixel. Output 0: 16-bit height (±32 device px), ao,
  // gloss → normal pass. Output 1: albedo, foil, thread, alpha → G-buffer B.
  var FS_COMP = [
    'uniform vec2 uRes;',
    'uniform sampler2D uGrain;',
    'uniform sampler2D uMask;',
    'uniform vec4 uPanel;   // xy centre, zw half size (device px)',
    'uniform vec4 uShape;   // x corner radius, y edge roll width, z tag (1) / fill (0), w output (0 height, 1 attributes)',
    'uniform vec4 uRelief;  // x grain amplitude, y deboss depth, z pillow depth, w foil crinkle (device px)',
    'uniform vec4 uLoop;    // xy stitch loop half size, z loop corner radius, w stitch on',
    'uniform vec4 uStitch;  // x stitch length, y thread radius, z slant (rad), w stitch count',
    'uniform vec4 uStitchB; // x capsule half length, y groove depth',
    'uniform vec4 uMisc;    // x dpr, y mark on, z crinkle frequency, w vignette width',
    'struct Px { float h; float ao; float alb; float gloss; float foil; float thread; float alpha; };',
    'float sdRound(vec2 p, vec2 b, float r) {',
    '  vec2 q = abs(p) - b + r;',
    '  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;',
    '}',
    // x: arc length along the stitch loop (clockwise from the top centre), y: signed distance (+ outside)
    'vec2 loopCoord(vec2 p) {',
    '  vec2 b = uLoop.xy;',
    '  float r = uLoop.z;',
    '  vec2 q = abs(p);',
    '  vec2 k = q - (b - r);',
    '  float sx = b.x - r, sy = b.y - r, arc = 1.5707963 * r;',
    '  float quarter = sx + arc + sy;',
    '  float s, d;',
    '  if (k.x > 0.0 && k.y > 0.0) { s = sx + atan(k.x, k.y) * r; d = length(k) - r; }',
    '  else if (k.x <= 0.0 && k.y > k.x) { s = q.x; d = q.y - b.y; }',
    '  else { s = sx + arc + (sy - q.y); d = q.x - b.x; }',
    '  if (p.x >= 0.0) s = p.y >= 0.0 ? s : 2.0 * quarter - s;',
    '  else s = p.y < 0.0 ? 2.0 * quarter + s : 4.0 * quarter - s;',
    '  return vec2(s, d);',
    '}',
    // Saddle stitch: slanted waxed-thread capsules with a three-ply twist, prick holes and a pressed channel
    'void stitchAt(vec2 p, inout Px s) {',
    '  vec2 sd = loopCoord(p);',
    '  float L = uStitch.x, tr = uStitch.y, d = sd.y;',
    '  float gw = tr * 2.3;',
    '  float groove = exp(-d * d / (gw * gw));',
    '  s.h -= groove * uStitchB.y;',
    '  if (abs(d) > L * 1.6) return;',
    '  float i0 = floor(sd.x / L);',
    '  float cov = 0.0, top = 0.0, tw = 0.0, near = 1e4, hole = 0.0;',
    '  for (int k = -1; k <= 1; k++) {',
    '    float i = i0 + float(k);',
    '    float id = mod(i, uStitch.w);',
    '    float j1 = hash12(vec2(id, 1.73)), j2 = hash12(vec2(id, 8.29));',
    '    float ang = uStitch.z + (j1 - 0.5) * 0.1;',
    '    vec2 lp = vec2(sd.x - (i + 0.5 + (j2 - 0.5) * 0.05) * L, d - (j1 - 0.5) * 0.06 * L);',
    '    float ca = cos(ang), sa = sin(ang);',
    '    vec2 a = vec2(ca * lp.x + sa * lp.y, -sa * lp.x + ca * lp.y);',
    '    float dist = length(vec2(max(abs(a.x) - uStitchB.x, 0.0), a.y));',
    '    near = min(near, dist - tr);',
    '    float cv = 1.0 - smoothstep(tr - 0.6, tr + 0.6, dist);',
    '    float prof = sqrt(max(0.0, 1.0 - dist * dist / (tr * tr)));',
    '    float twist = 0.5 + 0.5 * sin((a.x * 0.8 + a.y * 2.2) / tr * 2.8);',
    '    float hh = tr * (0.3 + 1.0 * prof * (0.86 + 0.14 * twist));',
    '    if (cv > cov) { cov = cv; top = hh; tw = twist; }',
    '    vec2 hp = vec2(sd.x - i * L, d);',
    '    float ha = ang + 0.5;',
    '    vec2 hq = vec2(cos(ha) * hp.x + sin(ha) * hp.y, -sin(ha) * hp.x + cos(ha) * hp.y);',
    '    float hd = length(hq / vec2(0.14 * L + 0.5, 0.05 * L + 0.5));',
    '    hole = max(hole, 1.0 - smoothstep(0.5, 1.0, hd));',
    '  }',
    '  float contact = (1.0 - smoothstep(0.0, tr * 0.9, near)) * (1.0 - cov);',
    '  s.h -= hole * tr * 0.8 * (1.0 - cov);',
    '  s.ao *= (1.0 - 0.45 * contact) * (1.0 - 0.65 * hole * (1.0 - cov));',
    '  s.h = mix(s.h, top - groove * uStitchB.y, cov);',
    '  s.ao = mix(s.ao, 0.74 + 0.26 * tw, cov);',
    '  s.thread = cov;',
    '}',
    'Px sampleAt(vec2 fc) {',
    '  Px s;',
    '  vec2 uv = fc / uRes;',
    '  vec4 g = texture2D(uGrain, uv);',
    '  vec3 m = texture2D(uMask, uv).rgb * uMisc.y;',
    '  float press = clamp(m.g * 1.08, 0.0, 1.0);',
    '  float hg = ((g.r + g.g / 255.0) * 3.0 - 1.0) * uRelief.x;',
    '  s.h = hg * (1.0 - 0.95 * press) - uRelief.y * press - uRelief.z * m.b;',
    '  float cr = gnoise(fc * uMisc.z) * 0.65 + gnoise(fc * uMisc.z * 2.7 + 3.1) * 0.35;',
    '  s.h += cr * uRelief.w * m.r;',
    '  s.ao = mix(g.a, 1.0, 0.7 * press);',
    '  s.alb = g.b * 2.0;',
    '  s.gloss = 0.45 * press + 0.1 * m.b;',
    '  s.foil = m.r;',
    '  s.thread = 0.0;',
    '  s.alpha = 1.0;',
    '  vec2 p = fc - uPanel.xy;',
    '  float sd = sdRound(p, uPanel.zw, uShape.x);',
    '  s.alb *= mix(0.8, 1.0, smoothstep(0.0, uMisc.w, -sd));',
    '  if (uShape.z > 0.5) {',
    '    s.alpha = clamp(0.5 - sd, 0.0, 1.0);',
    '    float t = clamp(-sd / uShape.y, 0.0, 1.0);',
    '    s.h -= (1.0 - sqrt(max(0.0, 1.0 - (1.0 - t) * (1.0 - t)))) * uShape.y * 0.85;',
    '    s.alb *= mix(0.6, 1.0, smoothstep(0.0, 0.5, t));',
    '    s.gloss += 0.4 * (1.0 - t);',
    '  }',
    '  if (uLoop.w > 0.5) stitchAt(p, s);',
    '  return s;',
    '}',
    'void main() {',
    '  Px c = sampleAt(gl_FragCoord.xy);',
    '  if (uShape.w > 0.5) {',
    '    gl_FragColor = vec4(clamp(c.alb * 0.5, 0.0, 1.0), c.foil, c.thread, c.alpha);',
    '    return;',
    '  }',
    '  float h16 = clamp(c.h / 64.0 + 0.5, 0.0, 1.0) * 255.0;',
    '  gl_FragColor = vec4(floor(h16) / 255.0, fract(h16), clamp(c.ao, 0.0, 1.0), clamp(c.gloss, 0.0, 1.0));',
    '}'
  ].join('\n');

  // Normals by central differences of the composite height → G-buffer A (normal xy, ao, gloss)
  var FS_NORMAL = [
    'precision highp float;',
    'uniform vec2 uRes;',
    'uniform sampler2D uComp;',
    'float hAt(vec2 fc) {',
    '  vec4 t = texture2D(uComp, fc / uRes);',
    '  return (t.r + t.g / 255.0 - 0.5) * 64.0;',
    '}',
    'void main() {',
    '  vec2 fc = gl_FragCoord.xy;',
    '  vec4 c = texture2D(uComp, fc / uRes);',
    '  vec3 n = normalize(vec3(hAt(fc - vec2(1.0, 0.0)) - hAt(fc + vec2(1.0, 0.0)),',
    '    hAt(fc - vec2(0.0, 1.0)) - hAt(fc + vec2(0.0, 1.0)), 2.0));',
    '  gl_FragColor = vec4(n.xy * 0.5 + 0.5, c.b, c.a);',
    '}'
  ].join('\n');

  var FS_LIGHT = [
    'uniform vec2 uRes;',
    'uniform sampler2D uFA;',
    'uniform sampler2D uFB;',
    'uniform vec4 uLight;   // xyz position (device px, y up), w intensity',
    'uniform vec4 uCam;     // xyz eye position, w grain type',
    'uniform vec4 uAlbedo;  // rgb linear leather colour, a base gloss',
    'uniform vec4 uThread;  // rgb linear thread colour',
    'uniform vec4 uFoil;    // rgb metal F0, a 1 = metallic foil, 0 = blind / none',
    'uniform vec4 uMat;     // x ambient, y exposure, z suede sheen',
    'uniform vec4 uBg;      // rgb sRGB background, a 1 = composite onto it (opaque output)',
    'vec3 shoulder(vec3 c) {',
    '  vec3 x = max(c - 0.72, 0.0);',
    '  return min(c, 0.72) + 0.28 * (1.0 - exp(-x / 0.28));',
    '}',
    'void main() {',
    '  vec2 uv = gl_FragCoord.xy / uRes;',
    '  vec4 A = texture2D(uFA, uv);',
    '  vec4 B = texture2D(uFB, uv);',
    '  vec3 N = vec3(A.xy * 2.0 - 1.0, 0.0);',
    '  N.z = sqrt(max(1.0 - dot(N.xy, N.xy), 0.0));',
    '  float ao = A.z, gls = A.w, alb = B.x * 2.0, foil = B.y, thr = B.z;',
    '  vec3 P = vec3(gl_FragCoord.xy, 0.0);',
    '  vec3 Lv = uLight.xyz - P;',
    '  float d2 = dot(Lv, Lv);',
    '  vec3 L = Lv * inversesqrt(d2);',
    '  vec3 V = normalize(uCam.xyz - P);',
    '  vec3 H = normalize(L + V);',
    '  float NdL = dot(N, L);',
    '  float NdH = max(dot(N, H), 0.0);',
    '  float NdV = max(dot(N, V), 0.0);',
    '  vec3 Li = vec3(1.0, 0.9, 0.76) * (uLight.w * uLight.z * uLight.z / d2);',
    '  vec3 amb = vec3(0.78, 0.88, 1.0) * uMat.x * (0.6 + 0.4 * N.z);',
    '  float wrap = clamp((NdL + 0.28) / 1.28, 0.0, 1.0);',
    '  float fres = pow(1.0 - clamp(dot(H, V), 0.0, 1.0), 5.0);',
    '  float metal = uFoil.a;',
    '  float pressed = foil * (1.0 - metal);',
    '  float specOcc = mix(0.25, 1.0, ao);',
    // leather: wrapped diffuse, broad sheen and a tighter lobe that breaks up on the grain
    '  vec3 base = uAlbedo.rgb * alb * (1.0 - 0.4 * pressed);',
    '  float g = clamp(uAlbedo.a + gls * 0.5 + pressed * 0.3, 0.0, 1.0);',
    '  vec3 col = base * (Li * wrap + amb) * ao;',
    '  vec3 sheenTint = mix(vec3(1.0, 0.97, 0.88), base / max(max(base.r, max(base.g, base.b)), 1e-4), 0.1);',
    '  float spec = pow(NdH, mix(5.0, 12.0, g)) * mix(0.01, 0.03, g) + pow(NdH, mix(18.0, 95.0, g)) * mix(0.03, 0.3, g);',
    '  col += Li * sheenTint * spec * (1.0 + 3.0 * fres) * specOcc * step(0.0, NdL);',
    '  if (uCam.w > 1.5) col += base * Li * pow(1.0 - NdV, 2.0) * uMat.z;',
    // waxed thread
    '  if (thr > 0.0) {',
    '    vec3 tc = uThread.rgb * (Li * wrap + amb) * ao + Li * pow(NdH, 30.0) * 0.22 * specOcc;',
    '    col = mix(col, tc, thr);',
    '  }',
    // metal foil: a dim studio environment reflected with a deeper (multi-bounce) tint, plus sharp and broad lobes of
    // the key light at the full metal colour — dark amber in the troughs, pale gold where it flares
    '  if (foil * metal > 0.0) {',
    '    vec3 R = reflect(-V, N);',
    '    vec3 F0 = uFoil.rgb;',
    '    vec3 Fm = F0 + (1.0 - F0) * pow(1.0 - NdV, 5.0);',
    '    float env = 0.12 + 0.16 * smoothstep(-0.5, 0.95, R.y) + 0.09 * smoothstep(0.1, 1.0, R.x * 0.35 + R.y * 0.65);',
    '    vec3 hot = Li * (pow(NdH, 300.0) * 4.5 + pow(NdH, 70.0) * 0.6 + pow(max(dot(R, L), 0.0), 6.0) * 0.3);',
    '    vec3 mc = Fm * F0 * env * (0.7 + 0.3 * ao) + Fm * hot;',
    '    col = mix(col, mc, foil * metal);',
    '  }',
    '  col = pow(shoulder(col * uMat.y), vec3(0.4545));',
    '  col += (hash12(gl_FragCoord.xy) - 0.5) / 255.0;',
    '  if (uBg.a > 0.5) gl_FragColor = vec4(mix(uBg.rgb, col, B.a), 1.0);',
    '  else gl_FragColor = vec4(col * B.a, B.a);',
    '}'
  ].join('\n');

  /* ---- 5. Mark mask (2D canvas, channel packed) ---------------------------------------------------------------- */

  var FONT_STACK = '"Cormorant Garamond", "Cormorant", Garamond, "Times New Roman", serif';
  var maskCanvas = null;

  function fontCss(style, px) {
    return (style === 'roman' ? '600 ' : 'italic 500 ') + px.toFixed(2) + 'px ' + FONT_STACK;
  }

  function brandMark(name) {
    var B = root.BENM_BRAND;
    return B && typeof B.get === 'function' && typeof B.draw === 'function' && typeof root.Path2D === 'function'
      ? B.get(name) : null;
  }

  // Resolves once the font a mark needs is usable (never rejects, gives up after 2.5 s)
  function ensureFont(mark) {
    var fonts = doc.fonts;
    if (!mark || !fonts || typeof fonts.load !== 'function') return Promise.resolve();
    var isText = mark.type === 'text';
    if (!isText && brandMark(mark.type === 'monogram' ? 'monogram' : 'wordmark')) return Promise.resolve();
    var spec = fontCss(isText ? mark.font : 'serif', 64);
    if (fonts.check && fonts.check(spec, isText ? mark.text : 'Ben.M')) return Promise.resolve();
    return Promise.race([
      fonts.load(spec, isText ? mark.text : 'Ben.M').catch(noop),
      new Promise(function (r) { root.setTimeout(r, 2500); })
    ]);
  }

  // → { draw(dx), h } : fills the mark (current fillStyle) fitted into the mark box, shifted by dx device px
  function markShape(ctx, mark, box) {
    var bw = box[0], bh = box[1], cx = box[2], cy = box[3];
    var name = mark.type === 'monogram' ? 'monogram'
      : mark.type === 'logo' ? (mark.tagline === 'ckb' ? 'lockupKu' : mark.tagline === 'en' ? 'lockupEn' : 'wordmark')
        : null;
    var data = name && brandMark(name);
    if (data) {
      var hide = !mark.reg;
      var vb = String((hide && data.viewBoxNoReg) || data.viewBox).split(/[\s,]+/).map(Number);
      var s = Math.min(bw / vb[2], bh / vb[3]);
      var w = vb[2] * s, h = vb[3] * s, x = cx - w / 2, y = cy - h / 2;
      return { h: h, draw: function (dx) { root.BENM_BRAND.draw(ctx, name, { x: x + dx, y: y, width: w, hideReg: hide }); } };
    }
    // text (initials, or "Ben.M" when brand.js is absent)
    var style = mark.type === 'text' ? mark.font : 'serif';
    var text = mark.type === 'text' ? (style === 'roman' ? mark.text.toUpperCase() : mark.text) : 'Ben.M';
    var chars = Array.from ? Array.from(text) : text.split('');
    var track = style === 'roman' ? 14 : 0;                       // letter spacing at the 100 px probe size
    ctx.font = fontCss(style, 100);
    var adv = chars.map(function (ch) { return ctx.measureText(ch).width; });
    var total = adv.reduce(function (a, b) { return a + b; }, 0) + track * (chars.length - 1);
    var whole = ctx.measureText(text);
    var first = ctx.measureText(chars[0]), last = ctx.measureText(chars[chars.length - 1]);
    var inkL = track ? -(first.actualBoundingBoxLeft || 0) : -(whole.actualBoundingBoxLeft || 0);
    var inkR = track ? total - adv[adv.length - 1] + (last.actualBoundingBoxRight || adv[adv.length - 1])
      : (whole.actualBoundingBoxRight || whole.width);
    var asc = whole.actualBoundingBoxAscent || 70, desc = whole.actualBoundingBoxDescent || 0;
    var k = Math.min(bw / Math.max(inkR - inkL, 1), bh / Math.max(asc + desc, 1));
    var x0 = cx - (inkL + inkR) / 2 * k, y0 = cy + (asc - desc) / 2 * k;
    var font = fontCss(style, 100 * k);
    return {
      h: (asc + desc) * k,
      draw: function (dx) {
        ctx.font = font;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
        if (!track) { ctx.fillText(text, x0 + dx, y0); return; }
        var x = x0 + dx;
        for (var i = 0; i < chars.length; i++) { ctx.fillText(chars[i], x, y0); x += (adv[i] + track) * k; }
      }
    };
  }

  // R = sharp mark (foil), G = narrow blur (deboss bevel), B = wide blur (pillow). → { canvas, sigma } | null
  function paintMask(o, lay) {
    if (!o.mark || o.foil === 'none') return null;
    var c = maskCanvas || (maskCanvas = doc.createElement('canvas'));
    if (c.width !== lay.W || c.height !== lay.H) { c.width = lay.W; c.height = lay.H; }
    var ctx = c.getContext('2d');
    if (!ctx) return null;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.shadowColor = 'rgba(0,0,0,0)';
    ctx.shadowBlur = ctx.shadowOffsetX = ctx.shadowOffsetY = 0;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, lay.W, lay.H);
    var shape = markShape(ctx, o.mark, lay.markBox);
    var sigma = clamp(shape.h * 0.0125, 0.55 * lay.dpr, 2.6 * lay.dpr);
    var wide = sigma * 7;
    var off = lay.W + Math.ceil(wide * 4) + 32;                     // shapes drawn off-canvas, only their shadow lands
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = '#f00';
    shape.draw(0);
    ctx.shadowOffsetX = off;
    ctx.shadowColor = '#0f0';
    ctx.shadowBlur = sigma * 2;
    ctx.fillStyle = '#0f0';
    shape.draw(-off);
    ctx.shadowColor = '#00f';
    ctx.shadowBlur = wide * 2;
    ctx.fillStyle = '#00f';
    shape.draw(-off);
    ctx.shadowColor = 'rgba(0,0,0,0)';
    ctx.shadowBlur = ctx.shadowOffsetX = 0;
    ctx.globalCompositeOperation = 'source-over';
    return { canvas: c, sigma: sigma };
  }

  function releaseMask() {
    if (maskCanvas && maskCanvas.width * maskCanvas.height > 4) maskCanvas.width = maskCanvas.height = 1;
  }

  /* ---- 6. Renderer (one WebGL context) ------------------------------------------------------------------------- */

  // Next tick for polling: a frame while visible, a timer while the tab is hidden (rAF pauses there)
  function soon(fn) { return doc.hidden ? root.setTimeout(fn, 60) : raf(fn); }

  function isSoftware(gl) {
    var name = '';
    try {
      name = String(gl.getParameter(gl.RENDERER) || '');
      if (/^webkit webgl$/i.test(name)) {
        var ext = gl.getExtension('WEBGL_debug_renderer_info');
        if (ext) name = String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || name);
      }
    } catch (e) { /* unknown renderer */ }
    return /swiftshader|llvmpipe|softpipe|software|basic render/i.test(name);
  }

  function seedOffset(seed) {
    return [((seed * 12.9898) % 61) + 17.3, ((seed * 78.233) % 53) + 29.1];
  }

  function Renderer(canvas, preserve, owner) {
    this.canvas = canvas;
    this.preserve = !!preserve;
    this.owner = owner || null;
    this.gl = null;
    this.lost = false;
    this.W = this.H = 0;
    this.lay = null;
    this.o = null;
    this.markOn = 0;
    this.markSigma = 1;
    this.compileMs = 0;
    var self = this;
    this._onLost = function (e) {
      e.preventDefault();
      self.lost = true;
      self.gl = null;
      if (self.owner) self.owner._contextLost();
    };
    this._onRestored = function () {
      self.lost = false;
      if (self._init() && self.owner) self.owner._contextRestored();
    };
    canvas.addEventListener('webglcontextlost', this._onLost, false);
    canvas.addEventListener('webglcontextrestored', this._onRestored, false);
    this._init();
  }

  Renderer.prototype._init = function () {
    var attrs = { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false,
      preserveDrawingBuffer: this.preserve, powerPreference: 'default' };
    var gl = null;
    try { gl = this.canvas.getContext('webgl', attrs) || this.canvas.getContext('experimental-webgl', attrs); }
    catch (e) { gl = null; }
    this.gl = null;
    if (!gl) return false;
    var hp = gl.getShaderPrecisionFormat && gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
    if (!hp || hp.precision < 16) return false;
    this.gl = gl;
    this.parallel = gl.getExtension('KHR_parallel_shader_compile');
    this.prog = {};
    this.software = isSoftware(gl);
    var dims = gl.getParameter(gl.MAX_VIEWPORT_DIMS);
    this.maxSize = Math.min(gl.getParameter(gl.MAX_TEXTURE_SIZE), dims[0], dims[1], 4096);
    this.buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);
    gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
    this.tex = { grain: this._texture(), fa: this._texture(), fb: this._texture(), mask: this._texture() };
    this.fbo = { grain: this._target(this.tex.grain), fa: this._target(this.tex.fa), fb: this._target(this.tex.fb) };
    this.W = this.H = 0;
    this.lay = null;
    // start compiling what every build needs (off the main thread where KHR_parallel_shader_compile exists)
    ['light', 'comp', 'normal'].forEach(this._program, this);
    return true;
  };

  Renderer.prototype._source = function (key) {
    if (key === 'light') return GLSL_HASH + '\n' + FS_LIGHT;
    if (key === 'normal') return FS_NORMAL;
    var noise = GLSL_HASH + '\n' + GLSL_NOISE + '\n';
    return key === 'comp' ? noise + FS_COMP : '#define GRAIN ' + key.slice(5) + '\n' + noise + FS_GRAIN;
  };

  // Starts compiling a program and returns its record (never waits).
  // key: 'light' | 'comp' | 'normal' | 'grain0' | 'grain1' | 'grain2'
  Renderer.prototype._program = function (key) {
    var rec = this.prog[key];
    if (rec) return rec;
    var gl = this.gl, id = gl.createProgram();
    var v = gl.createShader(gl.VERTEX_SHADER), f = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(v, VS);
    gl.compileShader(v);
    gl.shaderSource(f, this._source(key));
    gl.compileShader(f);
    gl.attachShader(id, v);
    gl.attachShader(id, f);
    gl.bindAttribLocation(id, 0, 'aPos');
    gl.linkProgram(id);
    rec = this.prog[key] = { id: id, v: v, f: f, u: null, ok: false, failed: false };
    return rec;
  };

  // True once the program is usable or has failed. The link-status query (the call that would block until the driver
  // is done) is only made after the driver reports completion through KHR_parallel_shader_compile.
  Renderer.prototype._settle = function (rec) {
    if (rec.ok || rec.failed) return true;
    var gl = this.gl;
    if (this.parallel && !gl.getProgramParameter(rec.id, this.parallel.COMPLETION_STATUS_KHR)) return false;
    if (gl.getProgramParameter(rec.id, gl.LINK_STATUS)) {
      var u = {}, n = gl.getProgramParameter(rec.id, gl.ACTIVE_UNIFORMS);
      for (var i = 0; i < n; i++) {
        var info = gl.getActiveUniform(rec.id, i);
        u[info.name] = gl.getUniformLocation(rec.id, info.name);
      }
      rec.u = u;
      rec.ok = true;
    } else {
      rec.failed = true;
      if (!gl.isContextLost() && root.console) {
        root.console.error('[BENM.Leather] shader: ' + (gl.getShaderInfoLog(rec.f) || gl.getProgramInfoLog(rec.id)));
      }
    }
    gl.deleteShader(rec.v);
    gl.deleteShader(rec.f);
    return true;
  };

  // Kick off the grain program an option set will need, before the first build asks for it
  Renderer.prototype.warm = function (o) {
    if (this.gl && !this.lost) this._program('grain' + GRAINS[o.grain].id);
  };

  // Resolves true once every program the options need is compiled. Polled once per frame so the page keeps animating
  // while the driver compiles; without the parallel-compile extension one program is finalised per frame.
  Renderer.prototype.prepare = function (o) {
    var self = this, keys = ['grain' + GRAINS[o.grain].id, 'comp', 'normal', 'light'], t0 = now();
    return new Promise(function (resolve) {
      (function poll() {
        if (!self.gl || self.lost) { resolve(false); return; }
        var recs = keys.map(self._program, self), waiting = false;
        for (var i = 0; i < recs.length; i++) {
          if (recs[i].ok || recs[i].failed) continue;
          if (!self.parallel) {
            self._settle(recs[i]);
            waiting = recs.some(function (r) { return !r.ok && !r.failed; });
            break;
          }
          if (!self._settle(recs[i])) waiting = true;
        }
        if (waiting) { soon(poll); return; }
        self.compileMs = Math.max(self.compileMs, now() - t0);
        resolve(recs.every(function (r) { return r.ok; }));
      })();
    });
  };

  Renderer.prototype._texture = function () {
    var gl = this.gl, t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));
    return t;
  };

  Renderer.prototype._target = function (tex) {
    var gl = this.gl, f = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, f);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return f;
  };

  Renderer.prototype.resize = function (W, H) {
    var gl = this.gl;
    if (!gl || (W === this.W && H === this.H)) return;
    this.W = W;
    this.H = H;
    this.canvas.width = W;
    this.canvas.height = H;
    ['grain', 'fa', 'fb'].forEach(function (k) {
      gl.bindTexture(gl.TEXTURE_2D, this.tex[k]);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, W, H, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    }, this);
  };

  Renderer.prototype._pass = function (fbo, prog) {
    var gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.viewport(0, 0, this.W, this.H);
    gl.useProgram(prog.id);
    gl.uniform2f(prog.u.uRes, this.W, this.H);
    return prog.u;
  };

  Renderer.prototype._bind = function (unit, tex) {
    var gl = this.gl;
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, tex);
  };

  // Call after prepare(o) resolved true. level 3: grain + fields, 2: fields (mark / stitch / shape), ≤1: nothing
  // (colour, foil and light are uniforms of the light pass)
  Renderer.prototype.build = function (o, lay, level) {
    var gl = this.gl;
    if (!gl || this.lost) return false;
    if (lay.W !== this.W || lay.H !== this.H) { this.resize(lay.W, lay.H); level = 3; }
    if (!this.lay) level = 3;
    this.o = o;
    this.lay = lay;
    if (level >= 3) this._grain(o, lay);
    if (level >= 2) {
      this._mask(o, lay);
      this._comp(lay, 1, this.fbo.fb);
      var tex = this._texture();                                     // scratch height target, freed right after
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.W, this.H, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      var fbo = this._target(tex);
      this._comp(lay, 0, fbo);
      this._normal(tex);
      gl.deleteFramebuffer(fbo);
      gl.deleteTexture(tex);
    }
    return true;
  };

  Renderer.prototype._grain = function (o, lay) {
    var u = this._pass(this.fbo.grain, this.prog['grain' + GRAINS[o.grain].id]), gl = this.gl;
    var seed = seedOffset(o.seed);
    gl.uniform4f(u.uGrain, lay.cell, 0, seed[0], seed[1]);
    gl.uniform4f(u.uGrainB, 1 / lay.cell, 0, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  Renderer.prototype._mask = function (o, lay) {
    var gl = this.gl, info = paintMask(o, lay);
    gl.bindTexture(gl.TEXTURE_2D, this.tex.mask);
    if (info) {
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, info.canvas);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      releaseMask();
    } else {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));
    }
    this.markOn = info ? 1 : 0;
    this.markSigma = info ? info.sigma : 1;
  };

  Renderer.prototype._comp = function (lay, out, fbo) {
    var gl = this.gl, u = this._pass(fbo, this.prog.comp);
    var o = this.o, s = this.markSigma;
    this._bind(0, this.tex.grain);
    this._bind(1, this.tex.mask);
    gl.uniform1i(u.uGrain, 0);
    gl.uniform1i(u.uMask, 1);
    gl.uniform4f(u.uPanel, lay.W / 2, lay.H / 2, lay.W / 2, lay.H / 2);
    gl.uniform4f(u.uShape, lay.radius, lay.edge, lay.tag ? 1 : 0, out);
    gl.uniform4f(u.uRelief, lay.amp, s * 1.6, s * 0.55, lay.crinkle);
    gl.uniform4f(u.uLoop, lay.loop[0], lay.loop[1], lay.loop[2], o.stitch ? 1 : 0);
    gl.uniform4f(u.uStitch, lay.stitch[0], lay.stitch[1], lay.stitch[2], lay.stitch[3]);
    gl.uniform4f(u.uStitchB, lay.halfLen, lay.groove, 0, 0);
    gl.uniform4f(u.uMisc, lay.dpr, this.markOn, lay.crinkleFreq, lay.vignette);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  Renderer.prototype._normal = function (tex) {
    var gl = this.gl, u = this._pass(this.fbo.fa, this.prog.normal);
    this._bind(0, tex);
    gl.uniform1i(u.uComp, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  // f: { lx, ly } light position in normalised panel coordinates (y down); bg: optional sRGB hex to composite onto
  Renderer.prototype.draw = function (f, bg) {
    var gl = this.gl, lay = this.lay, o = this.o;
    if (!gl || this.lost || !lay) return;
    var u = this._pass(null, this.prog.light);
    var diag = Math.sqrt(lay.W * lay.W + lay.H * lay.H);
    var grain = GRAINS[o.grain];
    var alb = toLinear(parseHex(o.color));
    var thr = toLinear(parseHex(o.stitchColor));
    var metal = FOILS[o.foil];
    var back = bg && parseHex(bg);
    this._bind(0, this.tex.fa);
    this._bind(1, this.tex.fb);
    gl.uniform1i(u.uFA, 0);
    gl.uniform1i(u.uFB, 1);
    gl.uniform4f(u.uLight, f.lx * lay.W, (1 - f.ly) * lay.H, diag * o.lightHeight, 1.35);
    gl.uniform4f(u.uCam, lay.W / 2, lay.H / 2, diag * 1.8, grain.id);
    gl.uniform4f(u.uAlbedo, alb[0], alb[1], alb[2], grain.gloss);
    gl.uniform4f(u.uThread, thr[0], thr[1], thr[2], 1);
    gl.uniform4f(u.uFoil, metal ? metal[0] : 0, metal ? metal[1] : 0, metal ? metal[2] : 0, metal ? 1 : 0);
    gl.uniform4f(u.uMat, 0.22, 1.0, 0.35, 0);
    gl.uniform4f(u.uBg, back ? back[0] : 0, back ? back[1] : 0, back ? back[2] : 0, back ? 1 : 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  Renderer.prototype.dispose = function () {
    var gl = this.gl;
    this.canvas.removeEventListener('webglcontextlost', this._onLost, false);
    this.canvas.removeEventListener('webglcontextrestored', this._onRestored, false);
    if (gl && !gl.isContextLost()) {
      var t = this.tex, f = this.fbo, p = this.prog;
      Object.keys(f).forEach(function (k) { gl.deleteFramebuffer(f[k]); });
      Object.keys(t).forEach(function (k) { gl.deleteTexture(t[k]); });
      Object.keys(p).forEach(function (k) {
        if (!p[k].ok && !p[k].failed) { gl.deleteShader(p[k].v); gl.deleteShader(p[k].f); }
        gl.deleteProgram(p[k].id);
      });
      gl.deleteBuffer(this.buf);
      var ext = gl.getExtension('WEBGL_lose_context');
      if (ext) ext.loseContext();
    }
    this.gl = null;
    this.owner = null;
  };

  /* ---- 7. Styles (injected once; everything is namespaced .bm-leather) ----------------------------------------- */

  var CSS = [
    '.bm-leather{position:relative;width:100%;height:100%;perspective:var(--bm-persp,1600px);',
    '-webkit-tap-highlight-color:transparent}',
    '.bm-leather__panel{position:absolute;inset:0;border-radius:var(--bm-radius,0px);background:var(--bm-color);',
    'transform-origin:50% 50%;will-change:transform;transition:background-color .5s}',
    '.bm-leather__canvas{position:absolute;inset:0;width:100%;height:100%;display:block;border-radius:inherit;',
    'opacity:0;transition:opacity 1.1s cubic-bezier(.16,1,.3,1)}',
    '.bm-leather.is-ready .bm-leather__canvas{opacity:1}',
    '.bm-leather__shadow{position:absolute;inset:7% 5% -2.5%;border-radius:var(--bm-radius,0px);',
    'background:rgba(2,8,6,.6);filter:blur(var(--bm-blur,26px));opacity:0;transition:opacity 1.2s;',
    'will-change:transform;pointer-events:none}',
    '.bm-leather.is-ready .bm-leather__shadow{opacity:1}',
    '.bm-leather--fill .bm-leather__shadow{display:none}',
    '.bm-leather__fallback{position:absolute;inset:0;border-radius:inherit;overflow:hidden;',
    'background:radial-gradient(120% 95% at var(--lx,30%) var(--ly,24%),rgba(255,236,204,.17),rgba(255,236,204,0) 58%),',
    'radial-gradient(150% 120% at 50% 50%,rgba(0,0,0,0) 45%,rgba(0,0,0,.34)),var(--bm-color);',
    'box-shadow:inset 0 0 0 1px rgba(0,0,0,.22)}',
    '.bm-leather__fallback svg{position:absolute;inset:0;width:100%;height:100%;display:block}',
    '.bm-leather__fb-mark{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);line-height:0;',
    'filter:drop-shadow(0 -1px 0 rgba(0,0,0,.6)) drop-shadow(0 1px 0 rgba(255,255,255,.13))}',
    '.bm-leather__fb-mark svg{position:static;width:100%;height:auto}',
    '@media (prefers-reduced-motion:reduce){.bm-leather__canvas,.bm-leather__shadow{transition:none}}'
  ].join('');

  function injectStyles() {
    if (doc.getElementById('bm-leather-style')) return;
    var s = doc.createElement('style');
    s.id = 'bm-leather-style';
    s.textContent = CSS;
    (doc.head || doc.documentElement).appendChild(s);
  }

  /* ---- 8. CSS / SVG fallback (no WebGL, or while a lost context is restored) ------------------------------------ */

  var SVG_NS = 'http://www.w3.org/2000/svg';
  var fbId = 0;

  function fallbackMarkup(o, w, h) {
    var lay = layout(o, w, h, w, h);
    var id = 'bm-lf' + (++fbId);
    var L = lay.stitch[0], tr = lay.stitch[1];
    var ins = Math.min(w, h) * 0.062;
    var svg = '<svg xmlns="' + SVG_NS + '" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h +
      '" aria-hidden="true" focusable="false"><defs><filter id="' + id + '" x="0" y="0" width="100%" height="100%">' +
      '<feTurbulence type="fractalNoise" baseFrequency="' + (o.grain === 'suede' ? 0.9 : o.grain === 'smooth' ? 0.35 : 0.16) +
      '" numOctaves="3" seed="' + Math.round(Math.abs(o.seed) * 7 + 3) + '"/>' +
      '<feDiffuseLighting lighting-color="#fff" surfaceScale="' + (o.grain === 'pebble' ? 2.4 : 1.2) + '">' +
      '<feDistantLight azimuth="235" elevation="52"/></feDiffuseLighting>' +
      '<feComponentTransfer><feFuncA type="linear" slope="0.2"/></feComponentTransfer></filter></defs>' +
      '<rect width="100%" height="100%" filter="url(#' + id + ')" style="mix-blend-mode:soft-light"/>';
    if (o.stitch) {
      svg += '<rect x="' + ins + '" y="' + ins + '" width="' + (w - 2 * ins) + '" height="' + (h - 2 * ins) +
        '" rx="' + Math.max(lay.radiusCss - ins * 0.5, 2) + '" fill="none" stroke="' + o.stitchColor +
        '" stroke-width="' + (tr * 2).toFixed(2) + '" stroke-dasharray="' + (L * 0.62).toFixed(2) + ' ' +
        (L * 0.38).toFixed(2) + '" stroke-linecap="round" opacity=".9"/>';
    }
    svg += '</svg>';
    var mark = '';
    if (o.mark && o.foil !== 'none') {
      var fill = o.foil === 'blind' ? shade(o.color, 0.62) : o.foil === 'silver' ? '#C9CCCF' : null;
      var mw = w * o.markScale, mh = h * o.markScale;
      var B = root.BENM_BRAND;
      var inner = '';
      if (o.mark.type !== 'text' && B && typeof B.svg === 'function') {
        var name = o.mark.type === 'monogram' ? 'monogram' : o.mark.tagline ? 'lockup' : 'wordmark';
        var data = brandMark(name === 'lockup' ? (o.mark.tagline === 'ckb' ? 'lockupKu' : 'lockupEn') : name);
        var vb = data ? String(data.viewBoxNoReg || data.viewBox).split(/[\s,]+/).map(Number) : [0, 0, 4, 1];
        mw = Math.min(mw, mh * vb[2] / vb[3]);
        inner = B.svg(name, { lang: o.mark.tagline === 'ckb' ? 'ckb' : 'en', hideReg: !o.mark.reg, decorative: true,
          foil: !fill, fill: fill || undefined });
      } else {
        var txt = o.mark.type === 'text' ? o.mark.text : 'Ben.M';
        var roman = o.mark.type === 'text' && o.mark.font === 'roman';
        var size = Math.min(mh * 0.9, mw / Math.max(txt.length * (roman ? 0.78 : 0.55), 1));
        mw = Math.min(mw, size * txt.length * (roman ? 0.8 : 0.6));
        inner = '<span style="display:block;line-height:1;white-space:nowrap;text-align:center;font:' +
          (roman ? '600 ' : 'italic 500 ') + size.toFixed(1) + 'px ' + FONT_STACK.replace(/"/g, "'") +
          (roman ? ';letter-spacing:.14em;text-transform:uppercase' : '') + ';color:' + (fill || '#C4A062') +
          (fill ? '' : ';background:linear-gradient(105deg,#7E5E2B,#C4A062 22%,#F3E2B3 40%,#B48D4F 58%,#E3C88E 76%,#8C6A34);' +
          '-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent') + '">' +
          txt.replace(/[&<>"]/g, '') + '</span>';
      }
      mark = '<div class="bm-leather__fb-mark" style="width:' + mw.toFixed(1) + 'px;margin-left:' +
        (o.markOffset[0] * w).toFixed(1) + 'px;margin-top:' + (o.markOffset[1] * h).toFixed(1) + 'px">' + inner + '</div>';
    }
    return svg + mark;
  }

  /* ---- 9. Live tag -------------------------------------------------------------------------------------------- */

  var instances = typeof WeakMap === 'function' ? new WeakMap() : null;
  var liveTags = [];
  // deviceorientation light: automatic on touch devices that need no permission (Android); iOS asks for it through
  // BENM.Leather.enableMotion() from a user gesture.
  var motion = {
    enabled: !!(root.DeviceOrientationEvent && typeof root.DeviceOrientationEvent.requestPermission !== 'function' &&
      root.matchMedia && root.matchMedia('(pointer: coarse)').matches),
    tags: []
  };

  function Tag(container, options) {
    this.container = container;
    this.raw = Object.assign({}, options || {});
    this.o = normalise(this.raw);
    this.stats = { compileMs: 0, buildMs: 0, readyMs: 0, drawMs: 0, fps: 0, frames: 0, pixels: 0, dpr: 0, software: false };
    this._t0 = now();
    this.webgl = false;
    this._light = this.o.light.slice();
    this._tilt = [0, 0];
    this._pointer = null;
    this._manual = null;
    this._gyro = null;
    this._level = 3;
    this._built = false;
    this._destroyed = false;
    this._paused = false;
    this._inView = true;
    this._hidden = !!doc.hidden;
    this._rectDirty = true;
    this._size = null;
    this._raf = 0;
    this._buildRaf = 0;
    this._lastT = 0;
    this._fpsT = 0;
    this._fpsN = 0;
    this._token = 0;
    var self = this;
    this.ready = new Promise(function (resolve) { self._resolveReady = resolve; });
    this._tick = this._tick.bind(this);
    this._onMove = this._onMove.bind(this);
    this._onDown = this._onDown.bind(this);
    this._onOut = this._onOut.bind(this);
    this._onLeave = this._onLeave.bind(this);
    this._onScroll = this._onScroll.bind(this);
    this._onVisibility = this._onVisibility.bind(this);
    this._onReduced = this._onReduced.bind(this);
    this._onOrient = this._onOrient.bind(this);
    injectStyles();
    this._mqReduced = media('(prefers-reduced-motion: reduce)');
    this._mqCoarse = media('(pointer: coarse)');
    this.reduced = !!(this._mqReduced && this._mqReduced.matches);
    this._dom();
    this.r = new Renderer(this.canvas, false, this);
    this.webgl = !!this.r.gl;
    this.stats.software = !!this.r.software;
    this._applyDom();   // _dom() ran before the renderer existed, so its classes assumed "no WebGL"
    if (this.webgl) this.r.warm(this.o);
    if (!this.webgl) this._showFallback(true);
    this._listen();
    this._measureAndBuild();
  }

  Tag.prototype._dom = function () {
    var el = (this.el = doc.createElement('div'));
    this.shadowEl = doc.createElement('div');
    this.shadowEl.className = 'bm-leather__shadow';
    this.panel = doc.createElement('div');
    this.panel.className = 'bm-leather__panel';
    this.canvas = doc.createElement('canvas');
    this.canvas.className = 'bm-leather__canvas';
    this.panel.appendChild(this.canvas);
    el.appendChild(this.shadowEl);
    el.appendChild(this.panel);
    this._applyDom();
    this.container.appendChild(el);
  };

  Tag.prototype._applyDom = function () {
    var o = this.o, el = this.el;
    el.className = 'bm-leather bm-leather--' + o.shape + (this._readyFired ? ' is-ready' : '') +
      (this.webgl ? '' : ' is-fallback');
    el.style.setProperty('--bm-color', o.color);
    if (o.label) {
      el.setAttribute('role', 'img');
      el.setAttribute('aria-label', o.label);
      el.removeAttribute('aria-hidden');
    } else {
      el.removeAttribute('role');
      el.removeAttribute('aria-label');
      el.setAttribute('aria-hidden', 'true');
    }
    this.shadowEl.style.display = o.shadow && o.shape === 'tag' ? '' : 'none';
    if (!this._tiltOn()) this.panel.style.transform = '';
  };

  Tag.prototype._tiltOn = function () {
    return this.o.tilt && this.o.tiltMax > 0 && this.o.shape === 'tag' && !this.reduced;
  };

  Tag.prototype._listen = function () {
    var self = this;
    this._trackEl = null;
    this._bindPointer();
    root.addEventListener('scroll', this._onScroll, { passive: true });
    doc.addEventListener('visibilitychange', this._onVisibility, false);
    if (this._mqReduced) {
      if (this._mqReduced.addEventListener) this._mqReduced.addEventListener('change', this._onReduced);
      else if (this._mqReduced.addListener) this._mqReduced.addListener(this._onReduced);
    }
    if (typeof root.ResizeObserver === 'function') {
      this._ro = new root.ResizeObserver(function (entries) {
        var r = entries[0] && entries[0].contentRect;
        if (!r) return;
        self._rectDirty = true;
        var s = self._size;
        if (s && Math.abs(r.width - s.w) < 1 && Math.abs(r.height - s.h) < 1) return;   // s is whole px (clientWidth)
        root.clearTimeout(self._resizeTimer);
        self._resizeTimer = root.setTimeout(function () { self._measureAndBuild(); }, s ? 140 : 0);
      });
      this._ro.observe(this.el);
    } else {
      this._onResize = function () { self._rectDirty = true; self._measureAndBuild(); };
      root.addEventListener('resize', this._onResize, false);
    }
    if (typeof root.IntersectionObserver === 'function') {
      this._io = new root.IntersectionObserver(function (entries) {
        self._inView = entries[entries.length - 1].isIntersecting;
        if (self._inView) self._wake();
      }, { rootMargin: '120px' });
      this._io.observe(this.el);
    }
    this._syncMotion();
  };

  Tag.prototype._bindPointer = function () {
    var t = null, o = this.o;
    if (o.interactive) t = o.track === 'self' ? this.el : (o.track && o.track.addEventListener) ? o.track : root;
    if (t === this._trackEl) return;
    this._unbindPointer();
    this._trackEl = t;
    if (!t) return;
    t.addEventListener('pointermove', this._onMove, { passive: true });
    t.addEventListener('pointerdown', this._onDown, { passive: true });
    if (t === root) doc.addEventListener('mouseout', this._onOut, false);
    else t.addEventListener('pointerleave', this._onLeave, false);
  };

  Tag.prototype._unbindPointer = function () {
    var t = this._trackEl;
    if (!t) return;
    t.removeEventListener('pointermove', this._onMove, { passive: true });
    t.removeEventListener('pointerdown', this._onDown, { passive: true });
    if (t === root) doc.removeEventListener('mouseout', this._onOut, false);
    else t.removeEventListener('pointerleave', this._onLeave, false);
    this._trackEl = null;
  };

  Tag.prototype._syncMotion = function () {
    var want = motion.enabled && this.o.idle && !this.reduced && !this._destroyed;
    var i = motion.tags.indexOf(this);
    if (want && i < 0) { motion.tags.push(this); root.addEventListener('deviceorientation', this._onOrient, false); }
    if (!want && i >= 0) { motion.tags.splice(i, 1); root.removeEventListener('deviceorientation', this._onOrient, false); }
  };

  /* -- pointer / device input -- */

  Tag.prototype._onMove = function (e) {
    this._pointer = { x: e.clientX, y: e.clientY, t: now(), fine: e.pointerType !== 'touch' };
    this._wake();
  };

  Tag.prototype._onDown = function (e) { if (e.pointerType === 'touch') this._onMove(e); };

  Tag.prototype._onOut = function (e) {
    if (!e.relatedTarget && !e.toElement) { this._pointer = null; this._wake(); }
  };

  Tag.prototype._onLeave = function (e) {
    if (e.pointerType !== 'touch') { this._pointer = null; this._wake(); }
  };

  Tag.prototype._onScroll = function () {
    this._rectDirty = true;
    if (this._pointer) this._wake();
  };

  Tag.prototype._onVisibility = function () {
    this._hidden = !!doc.hidden;
    if (!this._hidden) this._wake();
  };

  Tag.prototype._onReduced = function () {
    this.reduced = !!(this._mqReduced && this._mqReduced.matches);
    this._applyDom();
    this._syncMotion();
    this._wake();
  };

  Tag.prototype._onOrient = function (e) {
    if (e.beta == null || e.gamma == null) return;
    var g = this._gyro;
    if (!g) g = this._gyro = { b0: e.beta, g0: e.gamma, x: 0.5, y: 0.45, t: 0 };
    g.b0 += (e.beta - g.b0) * 0.004;                                // slowly re-centre on the holding angle
    g.g0 += (e.gamma - g.g0) * 0.004;
    g.x = clamp(0.5 + (e.gamma - g.g0) / 36, -0.3, 1.3);
    g.y = clamp(0.45 + (e.beta - g.b0) / 36, -0.3, 1.3);
    g.t = now();
    this._wake();
  };

  Tag.prototype._rect = function () {
    if (this._rectDirty || !this._r) {
      this._r = this.el.getBoundingClientRect();
      this._rectDirty = false;
    }
    return this._r;
  };

  /* -- animation loop (on demand) -- */

  Tag.prototype._live = function () {
    return !this._destroyed && this._built && this.webgl && !this._paused && this._inView && !this._hidden && !this.r.lost;
  };

  Tag.prototype._wake = function () {
    if (this._raf || !this._live()) return;
    this._raf = raf(this._tick);
  };

  // Where the light (and the tilt) wants to be now
  Tag.prototype._goal = function (t) {
    var o = this.o, p = this._pointer, n = now();
    if (this._manual) return { x: this._manual[0], y: this._manual[1], tx: 0, ty: 0, live: false };
    if (p && o.interactive && (p.fine || n - p.t < 2600)) {
      var r = this._rect();
      var x = clamp((p.x - r.left) / (r.width || 1), -0.8, 1.8), y = clamp((p.y - r.top) / (r.height || 1), -0.8, 1.8);
      return { x: x, y: y, tx: clamp((x - 0.5) * 2, -1, 1), ty: clamp((y - 0.5) * 2, -1, 1), live: !p.fine, fast: true };
    }
    var g = this._gyro;
    if (g && motion.enabled && n - g.t < 1200 && !this.reduced) {
      return { x: g.x, y: g.y, tx: (g.x - 0.5) * 1.2, ty: (g.y - 0.45) * 1.2, live: true };
    }
    if (o.idle && !this.reduced && !this.r.software) {             // no endless CPU rendering on software GL
      var a = t / 1000 * (Math.PI * 2 / 15);
      var ix = 0.5 + 0.32 * Math.cos(a), iy = 0.42 + 0.2 * Math.sin(a) + 0.04 * Math.sin(a * 2.3);
      return { x: ix, y: iy, tx: (ix - 0.5) * 0.6, ty: (iy - 0.42) * 0.6, live: true };
    }
    return { x: o.light[0], y: o.light[1], tx: 0, ty: 0, live: false };
  };

  Tag.prototype._tick = function (t) {
    this._raf = 0;
    if (!this._live()) { this._lastT = 0; return; }
    var dt = this._lastT ? Math.min((t - this._lastT) / 1000, 0.1) : 1 / 60;
    this._lastT = t;
    var goal = this._goal(t), L = this._light, T = this._tilt;
    var k = 1 - Math.exp(-dt * (goal.fast ? 8 : 4));
    L[0] += (goal.x - L[0]) * k;
    L[1] += (goal.y - L[1]) * k;
    var moving = Math.abs(goal.x - L[0]) + Math.abs(goal.y - L[1]) > 5e-4;
    if (this._tiltOn()) {
      var kt = 1 - Math.exp(-dt * 5);
      T[0] += (goal.tx - T[0]) * kt;
      T[1] += (goal.ty - T[1]) * kt;
      moving = moving || Math.abs(goal.tx - T[0]) + Math.abs(goal.ty - T[1]) > 1e-3;
    }
    this._render();
    if (moving || goal.live) this._raf = raf(this._tick);
    else this._lastT = 0;
  };

  Tag.prototype._render = function () {
    if (!this.webgl || !this._built || this.r.lost) return;
    var t0 = now();
    this.r.draw({ lx: this._light[0], ly: this._light[1] });
    var t1 = now();
    this.stats.drawMs = t1 - t0;
    this.stats.frames++;
    this._fpsN++;
    if (t1 - this._fpsT > 1000) {
      this.stats.fps = this._fpsT ? Math.round(this._fpsN * 1000 / (t1 - this._fpsT)) : 0;
      this._fpsT = t1;
      this._fpsN = 0;
    }
    if (this.o.shape !== 'tag') return;
    var lx = this._light[0] - 0.5, ly = this._light[1] - 0.5;
    if (this._tiltOn()) {
      var m = this.o.tiltMax;
      this.panel.style.transform = 'rotateX(' + (-this._tilt[1] * m * 0.8).toFixed(3) + 'deg) rotateY(' +
        (this._tilt[0] * m).toFixed(3) + 'deg)';
    }
    if (this.o.shadow) {
      this.shadowEl.style.transform = 'translate3d(' + clamp(-lx * 5, -6, 6).toFixed(2) + '%,' +
        clamp(1.5 - ly * 5, -4, 7).toFixed(2) + '%,0)';
    }
  };

  /* -- static build -- */

  Tag.prototype._dpr = function (w, h) {
    var o = this.o, coarse = !!(this._mqCoarse && this._mqCoarse.matches);
    var dpr = Math.min(root.devicePixelRatio || 1, o.maxDpr, coarse ? 1.5 : 2);
    var budget = o.maxPixels || (this.r.software ? 1.2e6 : 4.2e6);
    if (this.r.software && !o.maxPixels) dpr = Math.min(dpr, 1);
    if (w * h * dpr * dpr > budget) dpr = Math.sqrt(budget / (w * h));
    var max = this.r.maxSize || 4096;
    return Math.max(0.2, Math.min(dpr, max / w, max / h));
  };

  Tag.prototype._measureAndBuild = function () {
    if (this._destroyed) return;
    var w = this.el.clientWidth, h = this.el.clientHeight;
    if (w < 2 || h < 2) return;                                    // not laid out yet: the ResizeObserver retries
    var s = this._size;
    var changed = !s || Math.abs(s.w - w) >= 0.5 || Math.abs(s.h - h) >= 0.5;
    this._size = { w: w, h: h };
    this._rectDirty = true;
    this._schedule(changed ? 3 : 0);
  };

  Tag.prototype._schedule = function (level) {
    this._level = Math.max(this._level, level);
    if (this._buildRaf || this._destroyed) return;
    var self = this;
    this._buildRaf = raf(function () { self._buildRaf = 0; self._build(); });
  };

  Tag.prototype._build = function () {
    var self = this, size = this._size;
    if (this._destroyed || !size) return;
    var level = this._level;
    this._level = 0;
    var token = ++this._token;
    var o = this.o;
    var programs = this.webgl && !this.r.lost ? this.r.prepare(o) : Promise.resolve(false);
    Promise.all([ensureFont(o.foil === 'none' ? null : o.mark), programs]).then(function (res) {
      if (self._destroyed) return;
      if (token !== self._token) { self._level = Math.max(self._level, level); return; }
      if (!self.webgl) { self._showFallback(level >= 2); self._markReady(); return; }
      if (self.r.lost) { self._level = Math.max(self._level, level); return; }
      if (!res[1]) {                                               // shaders failed: settle on the CSS version
        self.webgl = false;
        self._showFallback(true);
        self._markReady();
        return;
      }
      self.stats.compileMs = Math.round(self.r.compileMs);
      var dpr = self._dpr(size.w, size.h);
      var W = Math.max(1, Math.round(size.w * dpr)), H = Math.max(1, Math.round(size.h * dpr));
      var lay = layout(self.o, size.w, size.h, W, H);
      var t0 = now();
      self.r.build(self.o, lay, Math.max(level, self._built ? 0 : 3));
      self.stats.buildMs = now() - t0;
      self.stats.pixels = W * H;
      self.stats.dpr = Math.round(dpr * 100) / 100;
      self.el.style.setProperty('--bm-radius', lay.radiusCss.toFixed(2) + 'px');
      self.el.style.setProperty('--bm-blur', clamp(lay.m * 0.05, 10, 44).toFixed(1) + 'px');
      self.el.style.setProperty('--bm-persp', Math.max(900, 2.4 * Math.max(size.w, size.h)).toFixed(0) + 'px');
      self._built = true;
      self._render();
      self._markReady();
      self._wake();
    });
  };

  Tag.prototype._markReady = function () {
    if (this._readyFired) return;
    this._readyFired = true;
    this.stats.readyMs = Math.round(now() - this._t0);
    this.el.classList.add('is-ready');
    this._resolveReady(this);
    if (this.o.onReady) {
      try { this.o.onReady(this); } catch (e) { if (root.console) root.console.error(e); }
    }
  };

  /* -- fallback & context loss -- */

  Tag.prototype._showFallback = function (rebuild) {
    var size = this._size || { w: this.el.clientWidth || 300, h: this.el.clientHeight || 200 };
    if (!this.fallbackEl) {
      this.fallbackEl = doc.createElement('div');
      this.fallbackEl.className = 'bm-leather__fallback';
      this.panel.appendChild(this.fallbackEl);
      rebuild = true;
    }
    this.canvas.style.display = 'none';
    this.el.classList.add('is-fallback');
    var l = this._light;
    this.fallbackEl.style.setProperty('--lx', (l[0] * 100).toFixed(1) + '%');
    this.fallbackEl.style.setProperty('--ly', (l[1] * 100).toFixed(1) + '%');
    if (rebuild) this.fallbackEl.innerHTML = fallbackMarkup(this.o, Math.max(size.w, 2), Math.max(size.h, 2));
  };

  Tag.prototype._hideFallback = function () {
    if (this.fallbackEl) { this.fallbackEl.remove(); this.fallbackEl = null; }
    this.canvas.style.display = '';
    this.el.classList.remove('is-fallback');
  };

  Tag.prototype._contextLost = function () {
    if (this._raf) { caf(this._raf); this._raf = 0; }
    this._showFallback(true);
  };

  Tag.prototype._contextRestored = function () {
    if (this._destroyed) return;
    this._hideFallback();
    this._built = false;
    this._schedule(3);
  };

  /* -- public API -- */

  Tag.prototype.set = function (opts) {
    if (!opts || this._destroyed) return this;
    for (var k in opts) if (Object.prototype.hasOwnProperty.call(opts, k)) this.raw[k] = opts[k];
    var prev = this.o;
    this.o = normalise(this.raw);
    var level = changeLevel(prev, this.o);
    if (prev.light.join() !== this.o.light.join() && !this._pointer && !this._manual) level = Math.max(level, 1);
    this._applyDom();
    this._bindPointer();
    this._syncMotion();
    if (!this.webgl) { this._showFallback(true); return this; }
    if (level >= 2) this._schedule(level);
    else if (level === 1 && this._built) {
      // colour / foil / stitch colour / light height are uniforms: no rebuild, but the renderer draws from the options
      // it was last built with, so hand it the new ones (otherwise e.g. noir → cognac, both smooth, keeps the old colour)
      this.r.o = this.o;
      this._render();
      this._wake();
    }
    else this._wake();
    return this;
  };

  // nx, ny: normalised panel coordinates (0…1, y down). setLight(null) returns the light to the pointer / idle orbit.
  Tag.prototype.setLight = function (nx, ny, immediate) {
    if (nx == null || !isFinite(nx)) this._manual = null;
    else {
      this._manual = [+nx, isFinite(ny) ? +ny : 0.5];
      if (immediate) { this._light = this._manual.slice(); this._tilt = [0, 0]; }
    }
    if (!this.webgl) { this._showFallback(false); return this; }
    if (immediate && this._built) this._render();
    this._wake();
    return this;
  };

  Tag.prototype.pause = function () {
    this._paused = true;
    if (this._raf) { caf(this._raf); this._raf = 0; }
    this._lastT = 0;
    return this;
  };

  Tag.prototype.resume = function () {
    this._paused = false;
    this._wake();
    return this;
  };

  // Current frame as an image (e.g. a personalised preview for the bag)
  Tag.prototype.toDataURL = function (type, quality) {
    if (!this.webgl || !this._built || this.r.lost) return '';
    this._render();
    return this.canvas.toDataURL(type || 'image/png', quality || 0.92);
  };

  // Dev helper: GPU time per light frame and per full rebuild (forces a sync readback; lab use only)
  Tag.prototype.benchmark = function (frames) {
    if (!this.webgl || !this._built || this.r.lost) return null;
    var gl = this.r.gl, px = new Uint8Array(4), n = Math.max(1, frames || 60);
    gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
    var t0 = now();
    for (var i = 0; i < n; i++) this.r.draw({ lx: 0.2 + 0.6 * i / n, ly: 0.3 });
    gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
    var t1 = now();
    this.r.build(this.o, this.r.lay, 3);
    this.r.draw({ lx: this._light[0], ly: this._light[1] });
    gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
    var t2 = now();
    return { frameMs: (t1 - t0) / n, buildMs: t2 - t1, pixels: this.r.W * this.r.H };
  };

  Tag.prototype.destroy = function () {
    if (this._destroyed) return;
    this._destroyed = true;
    if (this._raf) caf(this._raf);
    if (this._buildRaf) caf(this._buildRaf);
    root.clearTimeout(this._resizeTimer);
    this._unbindPointer();
    root.removeEventListener('scroll', this._onScroll, { passive: true });
    doc.removeEventListener('visibilitychange', this._onVisibility, false);
    if (this._onResize) root.removeEventListener('resize', this._onResize, false);
    if (this._mqReduced) {
      if (this._mqReduced.removeEventListener) this._mqReduced.removeEventListener('change', this._onReduced);
      else if (this._mqReduced.removeListener) this._mqReduced.removeListener(this._onReduced);
    }
    this._syncMotion();
    if (this._ro) this._ro.disconnect();
    if (this._io) this._io.disconnect();
    this.r.dispose();
    if (this.el.parentNode) this.el.parentNode.removeChild(this.el);
    if (instances && instances.get(this.container) === this) instances.delete(this.container);
    var li = liveTags.indexOf(this);
    if (li >= 0) liveTags.splice(li, 1);
    this._resolveReady(this);
    this.container = this.el = this.panel = this.canvas = this.shadowEl = this.fallbackEl = null;
  };

  Object.defineProperty(Tag.prototype, 'options', { get: function () { return copy(this.o); } });

  /* ---- 10. Snapshots (one shared offscreen context, jobs run one after another) -------------------------------- */

  var snap = { r: null, chain: null, timer: 0 };

  function snapRenderer() {
    if (snap.r && snap.r.gl && !snap.r.lost) return snap.r;
    if (snap.r) snap.r.dispose();
    snap.r = new Renderer(doc.createElement('canvas'), true, null);
    return snap.r.gl ? snap.r : null;
  }

  function fallbackSnapshot(o, w, h, type, quality) {
    var c = doc.createElement('canvas');
    c.width = w;
    c.height = h;
    var ctx = c.getContext('2d');
    if (!ctx) return '';
    ctx.fillStyle = o.color;
    ctx.fillRect(0, 0, w, h);
    var lx = o.light[0] * w, ly = o.light[1] * h;
    var g = ctx.createRadialGradient(lx, ly, 0, lx, ly, Math.max(w, h) * 1.1);
    g.addColorStop(0, 'rgba(255,236,205,.22)');
    g.addColorStop(0.55, 'rgba(255,236,205,0)');
    g.addColorStop(1, 'rgba(0,0,0,.38)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    var img = ctx.getImageData(0, 0, w, h), d = img.data;
    for (var i = 0; i < d.length; i += 4) {
      var n = (Math.random() - 0.5) * 16;
      d[i] += n; d[i + 1] += n; d[i + 2] += n;
    }
    ctx.putImageData(img, 0, 0);
    var lay = layout(o, w, h, w, h);
    if (o.stitch) {
      var ins = Math.min(w, h) * 0.062;
      ctx.strokeStyle = o.stitchColor;
      ctx.lineWidth = lay.stitch[1] * 2;
      ctx.lineCap = 'round';
      ctx.setLineDash([lay.stitch[0] * 0.62, lay.stitch[0] * 0.38]);
      ctx.strokeRect(ins, ins, w - 2 * ins, h - 2 * ins);
      ctx.setLineDash([]);
    }
    if (o.mark && o.foil !== 'none') {
      var shapeFn = markShape(ctx, o.mark, lay.markBox);
      ctx.fillStyle = 'rgba(0,0,0,.45)';
      shapeFn.draw(0);
      var fg = ctx.createLinearGradient(0, 0, w, h * 0.3);
      var stops = o.foil === 'silver' ? [[0, '#8E9296'], [0.4, '#EEF0F2'], [1, '#9A9EA2']]
        : o.foil === 'blind' ? [[0, shade(o.color, 0.6)], [1, shade(o.color, 0.7)]]
          : [[0, '#7E5E2B'], [0.22, '#C4A062'], [0.4, '#F3E2B3'], [0.58, '#B48D4F'], [0.76, '#E3C88E'], [1, '#8C6A34']];
      stops.forEach(function (s) { fg.addColorStop(s[0], s[1]); });
      ctx.save();
      ctx.translate(0, 1);
      ctx.fillStyle = fg;
      shapeFn.draw(0);
      ctx.restore();
    }
    return c.toDataURL(type, quality);
  }

  function snapshot(opts, width, height) {
    var w = Math.max(8, Math.round(+width || 480)), h = Math.max(8, Math.round(+height || +width || 480));
    var raw = Object.assign({}, SNAPSHOT_DEFAULTS, opts || {});
    var o = normalise(raw);
    var dpr = clamp(+raw.dpr || 1, 0.5, 4);
    var type = raw.format === 'png' ? 'image/png' : 'image/jpeg';
    var quality = clamp(+raw.quality || 0.9, 0.3, 1);
    var bg = raw.background || (type === 'image/jpeg' && o.shape === 'tag' ? '#0C1D17' : null);
    var job = function () {
      var r = snapRenderer();
      // swatch rows mix grains: start every variant now so they compile in parallel, not one after another
      if (r) Object.keys(GRAINS).forEach(function (g) { r.warm({ grain: g }); });
      var programs = r ? r.prepare(o) : Promise.resolve(false);
      return Promise.all([ensureFont(o.foil === 'none' ? null : o.mark), programs]).then(function (res) {
        root.clearTimeout(snap.timer);
        if (!r || !res[1] || !r.gl || r.lost) return fallbackSnapshot(o, w, h, type, quality);
        var lay = layout(o, w / dpr, h / dpr, w, h);
        r.build(o, lay, 3);
        r.draw({ lx: o.light[0], ly: o.light[1] }, bg);
        var url = r.canvas.toDataURL(type, quality);
        snap.timer = root.setTimeout(function () { if (snap.r && snap.r.gl) snap.r.resize(1, 1); }, 4000);
        return url;
      });
    };
    var p = (snap.chain || Promise.resolve()).then(job, job);
    snap.chain = p.catch(noop);
    return p;
  }

  /* ---- 11. Public API ----------------------------------------------------------------------------------------- */

  var supportedCache = null;

  var Leather = {
    version: '1.0.0',
    defaults: copy(DEFAULTS),
    presets: copy(PRESETS),

    create: function (container, options) {
      var el = typeof container === 'string' ? doc.querySelector(container) : container;
      if (!el || el.nodeType !== 1) throw new Error('BENM.Leather.create: container element not found');
      var prev = instances && instances.get(el);
      if (prev) prev.destroy();
      var tag = new Tag(el, options);
      if (instances) instances.set(el, tag);
      liveTags.push(tag);
      return tag;
    },

    // Options object for a named preset, merged with overrides (fresh copy every call)
    preset: function (name, overrides) {
      return Object.assign(copy(PRESETS[name] || {}), overrides || {});
    },

    snapshot: snapshot,

    // iOS asks for motion permission; call from a user gesture (tap). Resolves to true when gyro light is on.
    enableMotion: function () {
      var D = root.DeviceOrientationEvent;
      var grant = function (ok) {
        motion.enabled = !!ok;
        return !!ok;
      };
      if (!D) return Promise.resolve(false);
      var ask = typeof D.requestPermission === 'function' ? D.requestPermission() : Promise.resolve('granted');
      return ask.then(function (state) { return grant(state === 'granted'); }, function () { return grant(false); })
        .then(function (ok) {
          liveTags.forEach(function (t) { t._syncMotion(); });
          return ok;
        });
    }
  };

  Object.defineProperty(Leather, 'supported', {
    enumerable: true,
    get: function () {
      if (supportedCache === null) supportedCache = !!snapRenderer();
      return supportedCache;
    }
  });

  BENM.Leather = Leather;
})(window);
