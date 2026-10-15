// ===== «Хризалиды» — the world's kit: its people, horses and things =====
// The body of function (anim) returning the kit. Sources: film-kit/src/*.js, glued by build.cjs.
const { clamp, mix, span, hash, noise } = anim;
const PI = Math.PI, TAU = 2 * PI, D2R = PI / 180;
const sm = u => { u = clamp(u); return u * u * (3 - 2 * u); };
const sm2 = (v, a, b) => sm((v - a) / (b - a));

// ---- 3-vectors and rotations (body frame: x the body's right, y up, z forward) ----
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const madd = (a, b, k) => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const len = a => Math.hypot(a[0], a[1], a[2]);
const norm = a => { const l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const lerp3 = (a, b, u) => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];
// matrices as 9 numbers, rows
const M = (a, b, c, d, e, f, g, h, i) => [a, b, c, d, e, f, g, h, i];
const I3 = M(1, 0, 0, 0, 1, 0, 0, 0, 1);
// yaw: + turns the forward toward the body's left (the same sense as `face` growing)
const rotY = a => { const c = Math.cos(a), s = Math.sin(a); return M(c, 0, -s, 0, 1, 0, s, 0, c); };
// pitch: + tips the up vector forward (a bow, a nod)
const rotX = a => { const c = Math.cos(a), s = Math.sin(a); return M(1, 0, 0, 0, c, -s, 0, s, c); };
// roll: + tips the up vector toward the body's right (the right hip drops)
const rotZ = a => { const c = Math.cos(a), s = Math.sin(a); return M(c, s, 0, -s, c, 0, 0, 0, 1); };
const mm = (A, B) => [
  A[0] * B[0] + A[1] * B[3] + A[2] * B[6], A[0] * B[1] + A[1] * B[4] + A[2] * B[7], A[0] * B[2] + A[1] * B[5] + A[2] * B[8],
  A[3] * B[0] + A[4] * B[3] + A[5] * B[6], A[3] * B[1] + A[4] * B[4] + A[5] * B[7], A[3] * B[2] + A[4] * B[5] + A[5] * B[8],
  A[6] * B[0] + A[7] * B[3] + A[8] * B[6], A[6] * B[1] + A[7] * B[4] + A[8] * B[7], A[6] * B[2] + A[7] * B[5] + A[8] * B[8]];
const mv = (A, v) => [A[0] * v[0] + A[1] * v[1] + A[2] * v[2], A[3] * v[0] + A[4] * v[1] + A[5] * v[2], A[6] * v[0] + A[7] * v[1] + A[8] * v[2]];
// v made perpendicular to unit d (fallback if parallel)
const perp = (v, d, fb) => { const p = madd(v, d, -dot(v, d)); return len(p) < 1e-4 ? (fb ? perp(fb, d) : [1, 0, 0]) : norm(p); };

// a two-bone limb in 3D: root s, target t, bones a, b; the joint bends toward `pole` (a direction)
function ik3(s, t, a, b, pole) {
  let d = sub(t, s), dl = len(d);
  const lo = Math.abs(a - b) + 1e-4, hi = (a + b) * 0.9995;
  const u = dl < 1e-6 ? [0, -1, 0] : mul(d, 1 / dl);
  dl = clamp(dl, lo, hi);
  const p = perp(pole, u, [0, 0, 1]);
  const ca = clamp((a * a + dl * dl - b * b) / (2 * a * dl), -1, 1), sa = Math.sqrt(1 - ca * ca);
  const j = add(s, add(mul(u, a * ca), mul(p, a * sa)));
  return [j, madd(s, u, dl)];
}

// ---- springs (memory per figure): follow-through, overshoot and settle ----
const SUB = 1 / 90;
function spring(m, key, target, w, z, dt) {
  let s = m[key];
  if (!s || !isFinite(s.x)) s = m[key] = { x: target, v: 0 };
  if (dt > 0) {
    const n = Math.min(40, Math.ceil(dt / SUB)), h = dt / n;
    for (let i = 0; i < n; i++) { s.v += (w * w * (target - s.x) - 2 * z * w * s.v) * h; s.x += s.v * h; }
  }
  return s.x;
}
// an angle (radians) springing toward a target the short way round
function springA(m, key, target, w, z, dt) {
  const s = m[key];
  if (s) { while (target - s.x > PI) target -= TAU; while (target - s.x < -PI) target += TAU; }
  return spring(m, key, target, w, z, dt);
}
// a mass hanging off a point that moves (px, py): returns how far it lags behind [dx, dy]
function dangle(m, key, px, py, w, z, dt) {
  let s = m[key];
  if (!s || !isFinite(s.x)) s = m[key] = { x: px, y: py, vx: 0, vy: 0, px, py };
  if (dt > 0) {
    const n = Math.min(40, Math.ceil(dt / SUB)), h = dt / n, pvx = (px - s.px) / dt, pvy = (py - s.py) / dt;
    for (let i = 1; i <= n; i++) {
      const qx = s.px + (px - s.px) * i / n, qy = s.py + (py - s.py) * i / n;
      s.vx += (w * w * (qx - s.x) - 2 * z * w * (s.vx - pvx)) * h;
      s.vy += (w * w * (qy - s.y) - 2 * z * w * (s.vy - pvy)) * h;
      s.x += s.vx * h; s.y += s.vy * h;
    }
    // never more than a little way off (a jump of the anchor)
    const dx = s.x - px, dy = s.y - py, d = Math.hypot(dx, dy);
    if (d > 0.6) { s.x = px + dx * 0.6 / d; s.y = py + dy * 0.6 / d; }
  }
  s.px = px; s.py = py;
  return [s.x - px, s.y - py];
}
const MEM = new Map();

// a figure's memory: its springs and feet. A new one (or after a gap / a step back in time) starts at rest.
function memory(id, t) {
  let m = id != null ? MEM.get(id) : null;
  if (!m) { m = { t, fresh: true }; if (id != null) MEM.set(id, m); return [m, 0]; }
  let dt = t - m.t;
  if (!(dt >= 0) || dt > 1.5) { for (const k of Object.keys(m)) delete m[k]; m.t = t; m.fresh = true; return [m, 0]; }
  m.fresh = false; m.t = t;
  return [m, Math.min(dt, 0.25)];
}

// held noise: a value that holds, then moves to a new one (a strong pose and a hold — not a constant drift)
function held(t, rate, seed) {
  const x = t * rate, k = Math.floor(x), f = x - k;
  const len = 0.6 + hash(k, seed + 7) * 0.8;               // how long this hold lasts (relative)
  const a = hash(k - 1, seed) * 2 - 1, b = hash(k, seed) * 2 - 1;
  return mix(a, b, sm(f / Math.min(0.45, 0.25 * len + 0.1))) + noise(t * 0.7, seed + 3) * 0.15;
}

// ---- colours ----
const CC = new Map();
function rgbOf(c) {
  if (Array.isArray(c)) return c;
  let v = CC.get(c);
  if (!v) { const h = String(c).replace('#', ''); const n = parseInt(h.length === 3 ? h.replace(/./g, x => x + x) : h, 16); v = [(n >> 16) & 255, (n >> 8) & 255, n & 255]; CC.set(c, v); }
  return v;
}
const css = (r, gg, b, a = 1) => a >= 1 ? `rgb(${r | 0},${gg | 0},${b | 0})` : `rgba(${r | 0},${gg | 0},${b | 0},${a})`;
function shade(dark, col, k, mulk = 1) {
  const a = rgbOf(dark), b = rgbOf(col);
  return css(mix(a[0], b[0], k) * mulk, mix(a[1], b[1], k) * mulk, mix(a[2], b[2], k) * mulk);
}

// ---- shapes: projected circles, their hull, tapered limbs ----
// hull of circles [[x, y, r], …] (screen) as a Path2D (or added to one)
function hullPath(circles, path, n = 10) {
  const pts = [];
  for (const [x, y, r] of circles) {
    if (r <= 1e-5) { pts.push([x, y]); continue; }
    for (let i = 0; i < n; i++) { const a = i * TAU / n; pts.push([x + Math.cos(a) * r, y + Math.sin(a) * r]); }
  }
  const h = convex(pts);
  path = path || new Path2D();
  if (h.length < 3) return path;
  path.moveTo(h[0][0], h[0][1]);
  for (let i = 1; i < h.length; i++) path.lineTo(h[i][0], h[i][1]);
  path.closePath();
  return path;
}
function convex(p) {
  p.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], up = [];
  for (const q of p) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (let i = p.length - 1; i >= 0; i--) { const q = p[i]; while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  up.pop(); lo.pop();
  return lo.concat(up);
}
// a tapered limb between two circles (both clockwise: subpaths union under nonzero)
function taper(path, x1, y1, r1, x2, y2, r2) {
  const dx = x2 - x1, dy = y2 - y1, d = Math.hypot(dx, dy);
  if (d <= Math.abs(r1 - r2) + 1e-6) {
    const [x, y, r] = r1 >= r2 ? [x1, y1, r1] : [x2, y2, r2];
    path.moveTo(x + r, y); path.arc(x, y, r, 0, TAU); path.closePath(); return path;
  }
  const a = Math.atan2(dy, dx), th = Math.acos(clamp((r1 - r2) / d, -1, 1));
  path.moveTo(x1 + Math.cos(a + th) * r1, y1 + Math.sin(a + th) * r1);
  path.arc(x1, y1, r1, a + th, a + TAU - th);
  path.arc(x2, y2, r2, a - th, a + th);
  path.closePath();
  return path;
}
function disc(path, x, y, r) { path.moveTo(x + r, y); path.arc(x, y, r, 0, TAU); path.closePath(); return path; }

// ===== recorded motion (generated by mocap/export.py; sources and licences: see the notes) =====
const MOCAP = data; // modules/chrysalids.data.json

// ===== the cast: builds, clothes, colours (daylight colours; the scene's light mixes them toward its dark) =====
// H — height (m); heads — heads tall; legs — hip joint height / H; sh — shoulder joints apart / H; hipw — hip joints apart / H;
// girth — thickness; belly, bust 0…1; posture — stoop (deg); wear — what they wear; col — colours; gait — how they move.
const BASE = {
  style: 'neutral', H: 1.75, heads: 7.2, legs: 0.53, sh: 0.215, hipw: 0.1, girth: 1, belly: 0, bust: 0, posture: 0, neck: 1, sex: 'm',
  wear: { top: 'shirt', coat: 0, skirt: 0, apron: 0, shawl: 0, hat: 0, hair: 'short', beard: 0, sleeves: 'long' },
  col: { skin: '#b88d6e', hair: '#3b2c22', top: '#6b6558', bottom: '#4a4238', coat: '#3a3833', skirt: '#4f4a44', apron: '#a9a090', shawl: '#5a4c42', hat: '#2e2a26', boots: '#262220', band: '#1e1c1a' },
  gait: { energy: 1, stride: 1, swing: 1, bounce: 1, limp: 0, stiff: 0, heavy: 0 },
};
const CAST = {
  // David, ~10 (ch. 1–3): a boy in a blue shirt, braces, short hair, bare head
  david: { H: 1.38, heads: 6.0, legs: 0.5, sh: 0.2, hipw: 0.095, girth: 0.88, wear: { top: 'shirt', hair: 'short', sleeves: 'rolled' },
    col: { top: '#4f6a8a', bottom: '#4d4337', hair: '#4a3222', boots: '#2b2420' }, gait: { energy: 1.12, swing: 1.15, bounce: 1.25 } },
  // David at 14–16
  david_teen: { H: 1.7, heads: 7.0, legs: 0.52, sh: 0.21, girth: 0.9, wear: { top: 'jacket', hair: 'short' },
    col: { top: '#3f5470', bottom: '#463e34', hair: '#4a3222' }, gait: { energy: 1.05, swing: 1.05 } },
  // Rosalind: a tall girl, long hair tied low, a plain grey-green dress
  rosalind: { H: 1.67, heads: 7.1, legs: 0.53, sh: 0.195, hipw: 0.105, girth: 0.84, bust: 0.5, sex: 'f',
    wear: { top: 'dress', skirt: 0.88, hair: 'long', sleeves: 'long' }, col: { top: '#5b6152', skirt: '#5b6152', hair: '#5e3424' }, gait: { energy: 1.05, swing: 0.9, stride: 1.05 } },
  // Petra, ~6: small, curly fair hair, a plum shawl (the accent)
  petra: { H: 1.1, heads: 5.1, legs: 0.47, sh: 0.2, hipw: 0.1, girth: 0.95, sex: 'f',
    wear: { top: 'dress', skirt: 0.62, hair: 'curls', shawl: 1 }, col: { top: '#6b675e', skirt: '#6b675e', hair: '#d2b26e', shawl: '#7b4766' }, gait: { energy: 1.25, swing: 1.2, bounce: 1.35 } },
  // Sophie, ~10: a rust-red dress, a braid with a ribbon
  sophie: { H: 1.34, heads: 6.0, legs: 0.5, sh: 0.195, girth: 0.85, sex: 'f',
    wear: { top: 'dress', skirt: 0.7, hair: 'braid' }, col: { top: '#8c4130', skirt: '#8c4130', hair: '#6a4026', band: '#c9a45a' }, gait: { energy: 1.1, swing: 1.05, bounce: 1.2 } },
  // Joseph Strorm: tall, stern, upright; long black coat, wide-brimmed hat, beard
  joseph: { style: 'proud', H: 1.9, heads: 7.6, legs: 0.535, sh: 0.225, girth: 1.02, posture: -2,
    wear: { top: 'coat', coat: 0.72, hat: 'brim', hair: 'short', beard: 'full' }, col: { coat: '#24232a', top: '#24232a', bottom: '#222026', hat: '#1c1b1f', hair: '#2a2420' },
    gait: { energy: 0.86, swing: 0.55, bounce: 0.7, heavy: 0.6, stride: 1.05 } },
  // Emily Strorm: the mother — dark dress, pale apron, shawl, a white cap-bonnet
  emily: { H: 1.65, heads: 7.0, legs: 0.52, sh: 0.195, hipw: 0.11, girth: 0.95, bust: 0.6, sex: 'f',
    wear: { top: 'dress', skirt: 0.95, apron: 0.82, shawl: 1, hat: 'bonnet', hair: 'bun' }, col: { top: '#3f3a42', skirt: '#3f3a42', apron: '#b9b2a2', shawl: '#4f4440', hat: '#cfc8b8', hair: '#4a3a2c' },
    gait: { energy: 1.08, swing: 0.6, stride: 0.88, bounce: 0.8 } },
  // Uncle Axel: old sailor-smith; broad, beard, cap, leather apron, a stiff right leg (a limp)
  axel: { style: 'limp', H: 1.76, heads: 7.0, legs: 0.51, sh: 0.235, hipw: 0.11, girth: 1.18, belly: 0.5, posture: 4,
    wear: { top: 'shirt', apron: 0.6, hat: 'cap', hair: 'short', beard: 'full', sleeves: 'rolled' }, col: { top: '#6c665c', bottom: '#3c3832', apron: '#5c4130', hat: '#3a3530', hair: '#8c8578' },
    gait: { energy: 0.85, swing: 0.8, limp: 'r', heavy: 0.7, stride: 0.9 } },
  // Mary: the older sister — a grey-blue dress, apron, kerchief
  mary: { H: 1.63, heads: 7.0, legs: 0.52, sh: 0.195, hipw: 0.108, girth: 0.92, bust: 0.55, sex: 'f',
    wear: { top: 'dress', skirt: 0.94, apron: 0.8, hat: 'kerchief', hair: 'bun' }, col: { top: '#4d5664', skirt: '#4d5664', apron: '#b5ae9e', hat: '#8a8170', hair: '#5a4030' }, gait: { energy: 1.05, swing: 0.75, stride: 0.92 } },
  // Michael: a teen boy — jacket, cap
  michael: { H: 1.72, heads: 7.1, legs: 0.53, sh: 0.215, girth: 0.9, wear: { top: 'jacket', hat: 'cap', hair: 'short' },
    col: { top: '#4e4a3c', bottom: '#3e3a32', hat: '#3a3630', hair: '#3a2a20' }, gait: { energy: 1.05, swing: 1 } },
  // The Inspector: thin, a long grey coat, a tall-crowned hat; walks slowly, hands behind
  inspector: { style: 'hands_behind', H: 1.82, heads: 7.5, legs: 0.535, sh: 0.205, girth: 0.86, posture: 3,
    wear: { top: 'coat', coat: 0.8, hat: 'tall', hair: 'short' }, col: { coat: '#4a4740', top: '#4a4740', bottom: '#2e2c28', hat: '#26241f' }, gait: { energy: 0.82, swing: 0.4, stride: 0.95, heavy: 0.3 } },
  // The Sealand woman: a close white suit, pale short hair — upright, unhurried, light
  sealand: { style: 'proud', H: 1.74, heads: 7.5, legs: 0.545, sh: 0.2, hipw: 0.105, girth: 0.82, bust: 0.4, sex: 'f', posture: -2,
    wear: { top: 'suit', hair: 'cropped' }, col: { top: '#e9e8e2', bottom: '#e9e8e2', boots: '#d8d6ce', hair: '#d9c9a0', skin: '#d0b098' }, gait: { energy: 0.95, swing: 0.7, stride: 1.08, bounce: 0.7 } },
  // Sophie grown up (with the Fringes people): a worn dark jacket, trousers, hair tied back, a bow
  sophie_adult: { H: 1.62, heads: 7.0, legs: 0.53, sh: 0.195, hipw: 0.105, girth: 0.85, bust: 0.4, sex: 'f',
    wear: { top: 'jacket', hair: 'braid' }, col: { top: '#4a3d30', bottom: '#3a332a', hair: '#6a4026', band: '#8c4130' }, gait: { energy: 1.1, swing: 0.9 } },
  // Mrs Wender, Sophie's mother: a plain brown dress, apron, a kerchief
  wender: { H: 1.62, heads: 7.0, legs: 0.52, sh: 0.195, hipw: 0.11, girth: 0.98, bust: 0.55, sex: 'f',
    wear: { top: 'dress', skirt: 0.95, apron: 0.8, hat: 'kerchief', hair: 'bun', shawl: 1 }, col: { top: '#5a4a3a', skirt: '#5a4a3a', apron: '#b0a58e', hat: '#8a7a62', shawl: '#4a4038' } },
  // the community: generic, varied by seed (height, girth, hats, colours)
  man: { wear: { top: 'jacket', hat: 'brim', hair: 'short' }, col: { top: '#4a463e', bottom: '#3a362f', hat: '#2c2824' } },
  woman: { H: 1.63, heads: 7.0, legs: 0.52, sh: 0.195, hipw: 0.11, girth: 0.95, bust: 0.55, sex: 'f',
    wear: { top: 'dress', skirt: 0.95, apron: 0.8, shawl: 1, hat: 'bonnet', hair: 'bun' }, col: { top: '#47434a', skirt: '#47434a', apron: '#aaa292', shawl: '#53483f', hat: '#c6bfae' }, gait: { energy: 1, stride: 0.9, swing: 0.7 } },
  farmhand: { H: 1.76, girth: 1.05, wear: { top: 'smock', coat: 0.3, hat: 'brim', hair: 'short', sleeves: 'rolled' },
    col: { top: '#857c66', coat: '#857c66', bottom: '#433d33', hat: '#5a5040' }, gait: { energy: 0.95, swing: 1.05, heavy: 0.3 } },
  boy: { H: 1.36, heads: 6.0, legs: 0.5, sh: 0.2, girth: 0.88, wear: { top: 'shirt', hat: 'cap', hair: 'short' }, col: { top: '#6a6252', bottom: '#433c33' }, gait: { energy: 1.12, swing: 1.1, bounce: 1.2 } },
  girl: { H: 1.32, heads: 6.0, legs: 0.5, sh: 0.195, girth: 0.86, sex: 'f', wear: { top: 'dress', skirt: 0.72, hair: 'braid', hat: 'kerchief' },
    col: { top: '#5c5a52', skirt: '#5c5a52', hat: '#9a9078' }, gait: { energy: 1.1, swing: 1.05, bounce: 1.2 } },
  old_man: { style: 'old', H: 1.7, girth: 0.95, posture: 12, wear: { top: 'coat', coat: 0.6, hat: 'brim', beard: 'full', hair: 'short' }, col: { coat: '#3e3a34', top: '#3e3a34', hair: '#9a948a' },
    gait: { energy: 0.75, swing: 0.5, stride: 0.75, stiff: 0.6, bounce: 0.6 } },
  old_woman: { style: 'old', H: 1.55, heads: 6.9, sex: 'f', girth: 0.96, posture: 14, bust: 0.4, wear: { top: 'dress', skirt: 0.96, shawl: 1, hat: 'bonnet', hair: 'bun' },
    col: { top: '#3a3638', skirt: '#3a3638', shawl: '#4a403a', hat: '#bdb6a6' }, gait: { energy: 0.75, swing: 0.4, stride: 0.7, stiff: 0.6 } },
};
// the community's people differ: the same seed gives the same person
const TOPS = ['#4a463e', '#3e4248', '#544a3e', '#45403a', '#5a5548', '#3c3a40'];
const DRESSES = ['#47434a', '#4d5260', '#504840', '#3e3c44', '#5a5048', '#46504a'];
const HATS = ['#2c2824', '#3a342c', '#4a4234', '#24221f'];
function castOf(who, seed, over) {
  const c = CAST[who] || CAST[String(who).replace(/\d+$/, '')] || CAST.man;
  const P = { ...BASE, ...c, wear: { ...BASE.wear, ...c.wear }, col: { ...BASE.col, ...c.col }, gait: { ...BASE.gait, ...c.gait } };
  const generic = ['man', 'woman', 'farmhand', 'boy', 'girl', 'old_man', 'old_woman'].includes(who) || !CAST[who];
  if (generic) {
    const r = k => hash(seed * 13 + k, 911);
    P.H *= 0.94 + r(1) * 0.12; P.girth *= 0.9 + r(2) * 0.25; P.belly = r(3) < 0.25 ? 0.5 : 0; P.posture += (r(4) - 0.4) * 6;
    if (P.sex === 'f') { P.col.top = P.col.skirt = DRESSES[Math.floor(r(5) * DRESSES.length)]; if (r(6) < 0.3) P.wear.hat = 'kerchief'; if (r(7) < 0.35) P.wear.shawl = 0; if (r(8) < 0.3) P.wear.apron = 0; }
    else {
      P.col.top = TOPS[Math.floor(r(5) * TOPS.length)]; P.col.hat = HATS[Math.floor(r(6) * HATS.length)];
      if (who === 'man') { if (r(7) < 0.35) { P.wear.top = 'coat'; P.wear.coat = 0.55 + r(9) * 0.2; P.col.coat = P.col.top; } if (r(8) < 0.3) P.wear.hat = 'cap'; if (r(10) < 0.35) P.wear.beard = 'full'; }
    }
    P.gait = { ...P.gait, energy: P.gait.energy * (0.92 + r(11) * 0.16), swing: P.gait.swing * (0.8 + r(12) * 0.4) };
  }
  if (over) {
    for (const k of Object.keys(over)) {
      if (k === 'wear' || k === 'col' || k === 'gait') P[k] = { ...P[k], ...over[k] }; else P[k] = over[k];
    }
  }
  if (P.wear.top === 'coat' && !P.wear.coat) P.wear.coat = 0.7;
  if (P.wear.top === 'coat') P.col.top = P.col.coat;
  return dims(P);
}
// lengths from the build
function dims(P) {
  const H = P.H, hu = H / P.heads, d = {};
  d.hu = hu;
  d.ankle = 0.045 * H;
  d.hip = P.legs * H;                                   // hip joint height when standing straight
  d.thigh = (d.hip - d.ankle) * 0.5; d.shin = (d.hip - d.ankle) * 0.5;
  d.shoulderY = H - hu * 1.42;
  d.spine = d.shoulderY + 0.02 * H - d.hip;             // pelvis centre to chest point
  d.neck = hu * 0.2 * P.neck;
  d.upper = 0.186 * H * (P.heads < 6.5 ? 0.95 : 1); d.fore = 0.15 * H;
  d.foot = 0.135 * H * (P.heads < 6.5 ? 1.08 : 1);
  d.sw = P.sh * H * 0.86; d.hw = P.hipw * H;
  const g = P.girth, kid = clamp((7 - P.heads) / 2);
  d.r = {
    thigh: 0.062 * H * g * (P.sex === 'f' ? 1.06 : 1), knee: 0.04 * H * g, calf: 0.042 * H * g, ankle: 0.026 * H * g,
    shoulder: 0.046 * H * g, upper: 0.034 * H * g, elbow: 0.028 * H * g, wrist: 0.022 * H * g, hand: 0.019 * H * (1 + kid * 0.2),
    chest: 0.072 * H * g, waist: (P.sex === 'f' ? 0.05 : 0.056) * H * g, hips: 0.07 * H * g * (P.sex === 'f' ? 1.1 : 1), neck: 0.032 * H * g,
  };
  P.d = d;
  return P;
}

// ===== motion: recorded clips (motion capture) as body-relative channels, sampled, layered by masks =====
// A frame: pelvis offset (×leg length; x right, y up, z forward of the heading) and 20 unit vectors:
// pelvis forward/up (in the heading), chest forward/up (in the pelvis), head forward/up (in the chest), the spine (in the
// pelvis), the neck (in the chest), each arm's upper arm / forearm / hand (in the chest), each leg's thigh / shin / foot
// (in the pelvis). Proportion-free: any body is rebuilt from them with its own lengths.
const VK = ['pF', 'pU', 'cF', 'cU', 'hF', 'hU', 'spine', 'neck', 'rUp', 'rFo', 'rHa', 'lUp', 'lFo', 'lHa', 'rTh', 'rSh', 'rFt', 'lTh', 'lSh', 'lFt'];
const VI = Object.fromEntries(VK.map((k, i) => [k, 3 + i * 3]));
const FL = 3 + VK.length * 3;
const GROUPS = {
  root: [0, VI.pF, VI.pU], torso: [VI.cF, VI.cU, VI.spine], head: [VI.hF, VI.hU, VI.neck],
  armR: [VI.rUp, VI.rFo, VI.rHa], armL: [VI.lUp, VI.lFo, VI.lHa], legR: [VI.rTh, VI.rSh, VI.rFt], legL: [VI.lTh, VI.lSh, VI.lFt],
};
const GN = Object.keys(GROUPS);
const MASKS = {
  full: { root: 1, torso: 1, head: 1, armR: 1, armL: 1, legR: 1, legL: 1 },
  upper: { torso: 1, head: 1, armR: 1, armL: 1 }, arms: { armR: 1, armL: 1 }, armR: { armR: 1 }, armL: { armL: 1 },
  head: { head: 1 }, torso: { torso: 1, head: 1 }, body: { root: 1, torso: 1, head: 1, legR: 1, legL: 1 },
};
// ---- decoding the recorded clips (MOCAP, generated) ----
const b64 = s => { const bin = atob(s), u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u; };
const CLIPS = {};
function clipOf(name) {
  let c = CLIPS[name];
  if (c) return c;
  const src = MOCAP[name];
  if (!src) return null;
  const n = src.n, vb = new Int8Array(b64(src.v).buffer), pb = new Int16Array(b64(src.p).buffer), cb = src.c ? b64(src.c) : null;
  const F = new Float32Array(n * FL);
  for (let i = 0; i < n; i++) {
    F[i * FL] = pb[i * 3] / 8000; F[i * FL + 1] = pb[i * 3 + 1] / 8000; F[i * FL + 2] = pb[i * 3 + 2] / 8000;
    for (let j = 0; j < VK.length * 3; j++) F[i * FL + 3 + j] = vb[i * VK.length * 3 + j] / 127;
  }
  // the path over the floor (r: x, z ×leg length ×100 from where it starts) — a clip that has one keeps its pelvis
  // from it (a model's motion: the way the person goes is the motion's own)
  const R = src.r ? Float32Array.from(new Int16Array(b64(src.r).buffer), v => v / 100) : null;
  c = CLIPS[name] = { ...src, F, R, con: cb };
  return c;
}
// where a clip's path is at a (fractional) frame index, [x, z] ×leg length
function pathAt(c, x) {
  const a = clamp(Math.floor(x), 0, c.n - 1), b = Math.min(c.n - 1, a + 1), u = clamp(x - a), R = c.R;
  return [R[a * 2] * (1 - u) + R[b * 2] * u, R[a * 2 + 1] * (1 - u) + R[b * 2 + 1] * u];
}
// a frame of a clip at a (fractional) frame index; loops wrap
function sampleClip(c, x, out, loop) {
  const n = c.n;
  if (loop) { x = ((x % n) + n) % n; } else x = clamp(x, 0, n - 1);
  const a = Math.floor(x), b = loop ? (a + 1) % n : Math.min(n - 1, a + 1), u = x - a, F = c.F;
  for (let j = 0; j < FL; j++) out[j] = F[a * FL + j] * (1 - u) + F[b * FL + j] * u;
  return out;
}
const newFrame = () => new Float32Array(FL);
// blend src into dst by a weight per group (mask × weight)
function blendFrame(dst, src, mask, w) {
  for (const gname of GN) {
    const k = (mask[gname] || 0) * w;
    if (k <= 0) continue;
    for (const o of GROUPS[gname]) for (let j = 0; j < 3; j++) dst[o + j] += (src[o + j] - dst[o + j]) * k;
  }
}
function mirrorFrame(f) {
  const out = newFrame();
  out[0] = -f[0]; out[1] = f[1]; out[2] = f[2];
  const swap = { rUp: 'lUp', rFo: 'lFo', rHa: 'lHa', lUp: 'rUp', lFo: 'rFo', lHa: 'rHa', rTh: 'lTh', rSh: 'lSh', rFt: 'lFt', lTh: 'rTh', lSh: 'rSh', lFt: 'rFt' };
  for (const k of VK) { const s = VI[swap[k] || k], d = VI[k]; out[d] = -f[s]; out[d + 1] = f[s + 1]; out[d + 2] = f[s + 2]; }
  return out;
}
const vecOf = (f, k) => norm([f[VI[k]], f[VI[k] + 1], f[VI[k] + 2]]);
// a rotation from forward and up (columns: right, up, forward)
function frameFU(F, U) {
  F = norm(F); U = norm(madd(U, F, -dot(U, F)));
  const R = [U[1] * F[2] - U[2] * F[1], U[2] * F[0] - U[0] * F[2], U[0] * F[1] - U[1] * F[0]];
  return M(R[0], U[0], F[0], R[1], U[1], F[1], R[2], U[2], F[2]);
}
const mT = A => M(A[0], A[3], A[6], A[1], A[4], A[7], A[2], A[5], A[8]);

// ---- frames made by hand (what no recording has: riding, being carried, swimming…): the old angle language ----
const sag = a => [0, -Math.cos(a), Math.sin(a)];
const deg = a => (a || 0) * D2R;
function rodrigues(v, k, b) { const c = Math.cos(b), s = Math.sin(b), kx = [k[1] * v[2] - k[2] * v[1], k[2] * v[0] - k[0] * v[2], k[0] * v[1] - k[1] * v[0]], kd = dot(k, v) * (1 - c); return [v[0] * c + kx[0] * s + k[0] * kd, v[1] * c + kx[1] * s + k[1] * kd, v[2] * c + kx[2] * s + k[2] * kd]; }
function armDirs(A, side, Ra) {
  const fl = deg(A[0]), ab = deg(A[1]), el = deg(A[2]), tw = deg(A[3]);
  const R = mm(Ra, rotZ(-side * ab));
  const u = mv(R, sag(fl));
  let f = mv(R, sag(fl + el));
  if (tw) f = rodrigues(f, u, side * tw);
  return [u, f];
}
function legDirs(Lg, side) {
  const fl = deg(Lg[0]), ab = deg(Lg[1]), kn = deg(Lg[2]), an = deg(Lg[3]);
  const R = rotZ(-side * ab);
  return [mv(R, sag(fl)), mv(R, sag(fl - kn)), mv(R, sag(fl - kn + PI / 2 - an))];
}
const HAND_DIMS = { leg: 0.85, thigh: 0.425, shin: 0.425, hw: 0.175, spine: 0.5, foot: 0.24, ankle: 0.08, hips: 0.12, chest: 0.13, head: 0.24 };
function makeFrame(ps) {
  const f = newFrame(), D = HAND_DIMS;
  const Rp = rotX(deg(ps.pitch)), Rc = mm(rotY(deg(ps.twist)), mm(rotX(deg(ps.lean)), rotZ(deg(ps.side))));
  const Rh = mm(rotY(deg(ps.head?.[1])), mm(rotX(deg(ps.head?.[0])), rotZ(deg(ps.head?.[2]))));
  const put = (k, v) => { f[VI[k]] = v[0]; f[VI[k] + 1] = v[1]; f[VI[k] + 2] = v[2]; };
  put('pF', mv(Rp, [0, 0, 1])); put('pU', mv(Rp, [0, 1, 0]));
  put('cF', mv(Rc, [0, 0, 1])); put('cU', mv(Rc, [0, 1, 0]));
  put('hF', mv(Rh, [0, 0, 1])); put('hU', mv(Rh, [0, 1, 0]));
  put('spine', [0, 1, 0]); put('neck', norm([0, 1, 0.12]));
  const RcT = mT(Rc), Ra = rotY(deg(ps.twist));
  for (const [side, s] of [[1, 'r'], [-1, 'l']]) {
    const A = (side < 0 ? ps.armL : ps.armR) || ps.arm || [6, 5, 14, 12];
    const [u, fo] = Array.isArray(A) ? armDirs(A, side, Ra) : armDirs([6, 5, 14, 12], side, Ra);
    put(s + 'Up', mv(RcT, u)); put(s + 'Fo', mv(RcT, fo)); put(s + 'Ha', mv(RcT, fo));
    const Lg = (side < 0 ? ps.legL : ps.legR) || ps.leg || [0, 3, 2, 0];
    const [th, sh, ft] = legDirs(Lg, side);
    put(s + 'Th', th); put(s + 'Sh', sh); put(s + 'Ft', ft);
  }
  // the pelvis: where the pose's lowest point rests on the ground (or the anchor, for a seat or a pelvis)
  let y = 1.0;
  if (ps.ground === 'pelvis') y = 0;
  else if (ps.ground === 'saddle') y = 0.1;
  else {
    let lo = 0;
    for (const side of [1, -1]) {
      const Lg = (side < 0 ? ps.legL : ps.legR) || ps.leg || [0, 3, 2, 0], [th, sh, ft] = legDirs(Lg, side);
      const hip = [side * D.hw / 2, 0, 0], K = madd(hip, th, D.thigh), A = madd(K, sh, D.shin), T = madd(A, ft, D.foot * 0.7);
      for (const [p, r] of [[K, 0.06], [A, D.ankle], [T, 0.03]]) lo = Math.min(lo, mv(Rp, p)[1] - r);
    }
    lo = Math.min(lo, -D.hips, mv(Rp, mv(Rc, [0, D.spine, 0]))[1] - D.chest, mv(Rp, mv(Rc, [0, D.spine + 0.25, 0]))[1] - D.head * 0.5);
    y = -lo / D.leg;
  }
  f[1] = y;
  return f;
}

// ===== the pose library =====
// A pose: lean (torso bows forward, deg), side (leans to its right), twist (shoulders turn left), head [pitch down, yaw, roll],
// shrug (shoulders up, ×H), drop (knees bend: pelvis lowered, ×leg), pitch (the whole body tips forward: 90 face down, −90 on its back),
// arm / armR / armL: [flex (forward from hanging), abd (out to the side), elbow, twist (forearm toward the middle)] in degrees,
//   or { at: [ref, dx, dy, dz] (×H; ref: chest | head | hip | root; dx toward its own side), pole: [x, y, z] (where the elbow goes) },
// leg / legR / legL (the pose owns the legs): [flex (thigh forward from straight down), abd, knee, ankle (toes pointed)],
// ground: low (the lowest point rests on the ground) | seat (sits at the seat's height) | pelvis / saddle (hangs at the anchor),
// hand / handR / handL: open | point | fist. A function (u, P) gives a pose that moves (u — seconds, or the pose's own cycle).
const DOWN = [6, 5, 14, 12];
const POSES = {
  stand: {},
  // ---- on the ground ----
  sit: { legs: 1, ground: 'seat', lean: -2, head: [6, 0, 0], leg: [88, 8, 86, 0], arm: { at: ['hip', 0.075, 0.035, 0.19], pole: [0.5, -1, -0.5] } },
  sit_ground: { legs: 1, ground: 'low', lean: 16, head: [8, 0, 0], leg: [138, 14, 178, 30], arm: { at: ['hip', 0.06, 0.15, 0.24], pole: [0.6, -1, 0] } },
  sit_legs: { legs: 1, ground: 'low', lean: -16, head: [-4, 0, 0], legR: [86, 8, 10, 10], legL: [84, 10, 34, 10], arm: [-38, 14, 4, 0] },
  kneel: { legs: 1, ground: 'low', lean: 2, head: [8, 0, 0], leg: [2, 6, 92, 86], arm: DOWN },
  kneel_sit: { legs: 1, ground: 'low', lean: 6, head: [10, 0, 0], leg: [74, 8, 162, 86], arm: { at: ['hip', 0.08, 0.06, 0.16], pole: [0.5, -1, -0.3] } },
  kneel1: { legs: 1, ground: 'low', lean: 6, head: [6, 0, 0], legR: [86, 9, 88, 0], legL: [-6, 6, 96, 84],
    armR: { at: ['hip', 0.08, 0.06, 0.25], pole: [0.4, -0.6, 0.6] }, armL: DOWN },
  crouch: { legs: 1, ground: 'low', lean: 32, head: [-14, 0, 0], leg: [108, 18, 142, -36], arm: { at: ['hip', 0.06, 0.1, 0.3], pole: [0.6, -1, 0] } },
  squat: { legs: 1, ground: 'low', lean: 18, head: [10, 0, 0], leg: [112, 22, 150, -38], arm: { at: ['hip', 0.07, 0.2, 0.22], pole: [0.8, -1, 0] } },
  lie: { legs: 1, ground: 'low', pitch: -90, head: [0, 0, 0], leg: [4, 6, 8, 20], arm: [8, 14, 12, 0] },
  lie_face: { legs: 1, ground: 'low', pitch: 90, head: [-30, 0, 0], leg: [-4, 6, 6, 80], arm: [160, 30, 40, 0] },
  // ---- standing gestures (the legs keep walking or standing) ----
  reach: { lean: 10, head: [4, 0, 0], armR: [100, 6, 8, 0], handR: 'open' },
  point: { lean: 2, head: [0, 0, 0], armR: [88, 10, 3, 0], handR: 'point' },
  point_down: { lean: 6, head: [16, 0, 0], armR: [42, 8, 4, 0], handR: 'point' },
  point_up: { lean: -4, head: [-20, 0, 0], armR: [150, 12, 6, 0], handR: 'point' },
  wave: u => ({ head: [-4, 0, 0], armR: [148, 30, 52 + 28 * Math.sin(u * 8), 0], handR: 'open' }),
  beckon: u => ({ lean: 3, armR: [62, 10, 50 + 34 * Math.max(0, Math.sin(u * 5.5)), 20], handR: 'open' }),
  talk: u => ({ armR: [32 + 8 * noise(u * 1.3, 4), 12, 72 + 12 * noise(u * 1.7, 5), 25], handR: 'open' }),
  head_hands: { lean: 10, head: [16, 0, 0], shrug: 0.012, arm: { at: ['head', 0.075, 0.015, 0.0], pole: [1, -0.4, 0.4] }, hand: 'open' },
  face_hands: { lean: 16, head: [24, 0, 0], shrug: 0.01, arm: { at: ['head', 0.03, -0.02, 0.09], pole: [0.6, -1, 0] }, hand: 'open' },
  hug: { lean: 6, head: [10, 0, 8], arm: { at: ['chest', 0.0, -0.03, 0.21], pole: [1, -0.3, -0.3] } },
  carry: { lean: -7, side: -3, head: [8, 0, 0], armR: { at: ['chest', 0.07, -0.17, 0.15], pole: [0.6, -1, -0.2] }, armL: { at: ['chest', 0.05, -0.04, 0.17], pole: [1, -0.6, 0] } },
  lift: { lean: -6, head: [-14, 0, 0], arm: { at: ['chest', 0.075, 0.13, 0.24], pole: [0.8, -1, -0.2] } },
  offer: { lean: 6, head: [8, 0, 0], arm: [70, 6, 22, 0], hand: 'open' },
  hold_hand: { armR: [14, 13, 12, 0], handR: 'open' },
  pray: { lean: 5, head: [30, 0, 0], arm: { at: ['chest', 0.0, -0.04, 0.15], pole: [1, -1, 0] }, hand: 'open' },
  bow: { lean: 34, head: [20, 0, 0], arm: DOWN },
  slump: { lean: 12, head: [32, 0, 4], shrug: -0.012, drop: 0.02, arm: [2, 3, 8, 0] },
  look_up: { lean: -6, head: [-34, 0, 0] },
  cower: { lean: 22, head: [22, 0, 0], shrug: 0.022, drop: 0.07, arm: { at: ['chest', 0.035, 0.03, 0.12], pole: [0.4, -1, 0] }, hand: 'fist' },
  shush: { head: [4, 0, 0], armR: { at: ['head', 0.0, -0.035, 0.07], pole: [0.6, -1, 0] }, handR: 'point' },
  temple: { head: [0, 0, -4], armR: { at: ['head', 0.07, 0.01, 0.02], pole: [1, -0.5, 0.2] }, handR: 'point' },
  shade: { lean: -2, head: [-6, 0, 0], armR: { at: ['head', 0.01, 0.025, 0.075], pole: [1, -0.5, 0] }, handR: 'open' },
  think: { head: [8, 0, 6], armR: { at: ['head', 0.012, -0.055, 0.06], pole: [0.4, -1, 0] }, armL: { at: ['chest', -0.03, -0.1, 0.1], pole: [0.5, -1, 0] }, handR: 'fist' },
  arms_folded: { lean: -2, arm: { at: ['chest', -0.045, -0.065, 0.09], pole: [1, -0.6, 0.3] } },
  hands_behind: { lean: 2, arm: { at: ['hip', 0.015, 0.07, -0.1], pole: [0.6, -1, -0.6] } },
  hands_hips: { arm: { at: ['hip', 0.1, 0.07, 0.0], pole: [1, 0, -0.3] }, hand: 'fist' },
  preach: { lean: -3, head: [-12, 0, 0], armR: [164, 18, 10, 0], handR: 'open', armL: { at: ['chest', 0.03, -0.06, 0.2], pole: [0.6, -1, 0] } },
  read: { lean: 4, head: [26, 0, 0], arm: { at: ['chest', 0.04, -0.09, 0.19], pole: [0.6, -1, 0] } },
  raise: { lean: -3, head: [-10, 0, 0], armR: [148, 16, 22, 0], handR: 'fist' },
  scream: { lean: -8, head: [-28, 0, 0], shrug: 0.025, arm: [128, 34, 34, 0], hand: 'open' },
  pull: { lean: -16, drop: 0.06, arm: [76, 6, 6, 0], hand: 'fist' },
  push: { lean: 22, arm: [86, 8, 22, 0], hand: 'open' },
  // a smith's blow; the cycle counts blows (cycles: { hammer: n } — the blow lands at n + 0.7): a slow lift that gathers
  // (anticipation), a fast fall (in), the hammer bounces a little and rests on the iron, then lifts again
  hammer: u => { const p = ((u % 1) + 1) % 1;
    // lift 0…0.5 (slow, gathering), a breath at the top 0.5…0.56, the fall 0.56…0.7 (the elbow opens first, like a whip),
    // a small bounce 0.7…0.8, the hammer resting on the iron till the next lift; a dip before the lift (anticipation)
    const fall = p >= 0.56 && p < 0.7;
    const k = p < 0.06 ? -0.05 * Math.sin(PI * p / 0.06) : p < 0.5 ? sm((p - 0.06) / 0.44) : p < 0.56 ? 1 : fall ? 1 - Math.pow((p - 0.56) / 0.14, 2) : p < 0.8 ? 0.07 * Math.sin(PI * (p - 0.7) / 0.1) : 0;
    const lift = Math.max(-0.05, k), el = fall ? lift * lift : Math.max(0, lift);
    return { lean: 16 - 12 * lift, side: -3 * lift, twist: -10 * lift, head: [20 - 8 * lift, 0, 0],
      armR: [44 + 108 * lift, 14 + 8 * lift, 14 + 104 * el, 0], handR: 'fist', armL: [44, 12, 54, 14], handL: 'fist' }; },
  // a rake or a hoe worked back and forth (hold: { r: 'rake' })
  rake: u => { const s = Math.sin(u * 2.4); return { lean: 16 + 4 * s, head: [14, 0, 0], drop: 0.03,
    armR: { at: ['chest', 0.05, -0.15, 0.14 + 0.1 * s], pole: [1, -1, -0.5] }, armL: { at: ['chest', 0.0, -0.03, 0.2 + 0.1 * s], pole: [1, -1, 0] }, hand: 'fist' }; },
  // ---- carried, riding, swimming, climbing (the anchor is the seat or the pelvis) ----
  carried: { legs: 1, ground: 'saddle', lean: -4, head: [-6, 0, 0], leg: [78, 26, 84, 30], arm: { at: ['chest', 0.07, 0.02, 0.15], pole: [1, -0.6, 0] } },
  held_up: { legs: 1, ground: 'pelvis', head: [-10, 0, 0], leg: [14, 8, 30, 40], arm: [150, 34, 20, 0], hand: 'open' },
  kneel_stiff: { legs: 1, ground: 'low', lean: 8, head: [8, 0, 0], legR: [70, 14, 4, 30], legL: [0, 6, 96, 84], arm: [6, 5, 14, 12] },
  sit_dangle: u => ({ legs: 1, ground: 'seat', lean: 4, head: [6, 0, 0], legR: [84, 9, 70 + 22 * Math.sin(u * 3.1), 10], legL: [82, 10, 70 + 22 * Math.sin(u * 3.1 + 2.2), 10], arm: { at: ['hip', 0.1, 0.03, 0.12], pole: [0.5, -1, -0.5] } }),
  peek: { lean: 6, side: 22, head: [0, 0, -10] },
  aim: { lean: 6, head: [8, -20, 0], twist: -25, armR: { at: ['chest', 0.03, 0.0, 0.08], pole: [1, -1, 0] }, armL: { at: ['chest', -0.04, -0.01, 0.32], pole: [0.2, -1, 0] }, hand: 'fist' },
  draw_bow: { lean: 2, head: [0, -70, 0], twist: -70, armL: [90, 70, 0, 0], armR: { at: ['head', -0.03, -0.08, 0.05], pole: [1, 0, -1] }, hand: 'fist' },
  hit: { lean: -24, head: [-30, 0, 0], arm: [50, 40, 30, 0], hand: 'open' },
  arms_up: { lean: -6, head: [-28, 0, 0], arm: [170, 25, 10, 0], hand: 'open' },
  stir: u => ({ lean: 14, head: [22, 0, 0], armR: { at: ['hip', 0.02 + 0.06 * Math.cos(u * 3), 0.05, 0.3 + 0.06 * Math.sin(u * 3)], pole: [1, -1, 0] }, armL: [20, 8, 40, 10], handR: 'fist' }),
  eat: u => ({ lean: 10, head: [14 - 6 * Math.max(0, Math.sin(u * 2.2)), 0, 0], armR: { at: ['head', 0.0, -0.06 - 0.12 * (1 - Math.max(0, Math.sin(u * 2.2))), 0.12], pole: [1, -1, 0] }, armL: { at: ['hip', 0.03, 0.12, 0.28], pole: [1, -1, 0] }, handR: 'fist' }),
  hand_chest: { head: [6, 0, 0], armR: { at: ['chest', -0.02, -0.03, 0.1], pole: [0.6, -1, 0] }, handR: 'open' },
  freeze: { lean: -6, head: [-6, 0, 0], shrug: 0.02, arm: [20, 18, 40, 0], hand: 'open' },
  hang: { legs: 1, ground: 'pelvis', head: [-20, 0, 0], leg: [10, 6, 20, 30], arm: [175, 12, 6, 0], hand: 'fist' },
  ride: { legs: 1, ground: 'saddle', lean: 5, head: [2, 0, 0], leg: [52, 30, 74, -12], arm: { at: ['hip', 0.05, 0.16, 0.24], pole: [0.6, -1, -0.4] }, hand: 'fist' },
  // swimming face down, the head up out of the water (u: the stroke). Grounded 'low' (its lowest point on the anchor),
  // so standing in the water → lunge → swim is one continuous move: ease the anchor (y) from the bottom up to just
  // under the surface as the weight grows (y = mix(bottom, surface + 0.18, swim))
  swim: u => { const a = u * 3.4; return { legs: 1, ground: 'low', pitch: 74, lean: 0, head: [-58, 0, 0],
    armR: [120 + 55 * Math.sin(a), 26, 40 + 30 * Math.cos(a), 10], armL: [120 + 55 * Math.sin(a + PI), 26, 40 + 30 * Math.cos(a + PI), 10],
    legR: [10 + 16 * Math.sin(a * 2), 8, 24, 70], legL: [10 - 16 * Math.sin(a * 2), 8, 24, 70], hand: 'open' }; },
  // wading deep: leaning into the water, the arms out over it for balance (layered over walking)
  wade: { lean: 12, head: [6, 0, 0], arm: [40, 38, 30, 0], hand: 'open' },
  // throwing oneself forward (into the water, after someone): leaning far, the arms reaching ahead
  lunge: { lean: 34, head: [-24, 0, 0], arm: [150, 20, 10, 0], hand: 'open' },
  // clinging to someone (their neck, their shoulders): arms up and forward, hands meeting — aim the hands with
  // hand: { r: K.point(id, 'shoulder_l'), l: K.point(id, 'shoulder_r') }
  cling: { lean: 6, head: [10, 0, 0], arm: { at: ['chest', 0.03, 0.12, 0.2], pole: [1, -0.4, -0.2] }, hand: 'fist' },
  // scooping a child up from the ground: down on the haunches, both arms low and forward (aim them at the child:
  // hand: { r: K.point(child, 'chest'), l: K.point(child, 'back') }); rise to carry (pose carry, or carry: {...})
  scoop: { legs: 1, ground: 'low', lean: 36, head: [24, 0, 0], leg: [100, 22, 128, -30], arm: { at: ['hip', 0.08, -0.05, 0.38], pole: [0.8, -1, 0] }, hand: 'open' },
  // bent over someone lying: a layer over kneel1 / kneel (the back forward, the head down, one hand going to them)
  over: { lean: 34, head: [26, 0, 0], armR: { at: ['hip', 0.06, -0.02, 0.42], pole: [0.6, -1, 0] }, handR: 'open' },
  climb: u => { const s = Math.sin(u * 3.0), c = Math.max(0, s), d = Math.max(0, -s); return { legs: 1, ground: 'pelvis', lean: 8, head: [-20, 0, 0],
    legR: [20 + 60 * c, 8, 25 + 70 * c, 0], legL: [20 + 60 * d, 8, 25 + 70 * d, 0], armR: [150 + 20 * d, 12, 30 + 30 * c, 0], armL: [150 + 20 * c, 12, 30 + 30 * d, 0], hand: 'fist' }; },
};

// ===== the motion library: walking styles and named poses / actions =====
// Styles: recorded walk and run cycles and a standing idle (100STYLE). Missing ones fall back on neutral.
const STYLES = {
  neutral: { walk: 'walk_Neutral', run: 'run_Neutral', idle: 'idle_Neutral' },
  old: { walk: 'walk_Old', idle: 'idle_Old' },
  proud: { walk: 'walk_Proud', idle: 'idle_Proud' },
  sad: { walk: 'walk_Depressed', idle: 'idle_Depressed' },
  limp: { walk: 'walk_LimpRight', idle: 'idle_LimpRight' },
  monk: { walk: 'walk_Monk', idle: 'idle_Monk' },
  hands_behind: { walk: 'walk_ArmsBehindBack', idle: 'idle_ArmsBehindBack' },
  rushed: { walk: 'walk_Rushed', run: 'run_Rushed' },
  elated: { walk: 'walk_Elated', run: 'run_Elated' },
  tiptoe: { walk: 'walk_Tiptoe' },
  dark: { walk: 'walk_InTheDark' },
  followed: { walk: 'walk_Followed', run: 'run_Followed' },
  bent: { walk: 'walk_BentForward' },
  stick: { walk: 'walk_WalkingStickRight', idle: 'idle_WalkingStickRight' },
  skip: { walk: 'walk_Skip' },
};
// A pose of the old angle language → a layer: angled arms and legs become a hand-made frame under a mask (only the
// limbs it names), `at` hands become IK targets, lean / side / twist / head / shrug become additive turns.
function fromOld(ps) {
  const def = {}, mask = {};
  const armAng = k => Array.isArray(ps[k] || ps.arm) ? (ps[k] || ps.arm) : null, armAt = k => { const a = ps[k] || ps.arm; return a && !Array.isArray(a) ? a : null; };
  if (ps.legs) Object.assign(mask, MASKS.full);
  if (armAng('armR')) mask.armR = 1;
  if (armAng('armL')) mask.armL = 1;
  if (Object.keys(mask).length) { def.frame = ps; def.mask = mask; }
  const atR = armAt('armR'), atL = armAt('armL');
  if (atR || atL) { def.at = { r: atR?.at, l: atL?.at }; def.pole = { r: atR?.pole, l: atL?.pole }; }
  if (!ps.legs && (ps.lean || ps.side || ps.twist || ps.head)) def.add = { lean: ps.lean || 0, side: ps.side || 0, twist: ps.twist || 0, head: ps.head || [0, 0, 0] };
  const hr = ps.handR || ps.hand, hl = ps.handL || ps.hand;
  if (hr || hl) def.hand = { r: hr, l: hl };
  if (ps.ground) def.ground = ps.ground;
  return def;
}
const MOTIONS = {};
for (const [k, v] of Object.entries(POSES)) MOTIONS[k] = typeof v === 'function' ? { fn: v } : fromOld(v);
// head layers on top of anything: a nod, a shake of the head (cycle or time)
MOTIONS.nod = { cycAdd: u => [12 * Math.sin(u * 9), 0, 0] };
MOTIONS.shake = { cycAdd: u => [4, 32 * Math.sin(u * 7), 6 * Math.sin(u * 7)] };
// recorded poses and actions (their clips' own segments: in → hold → out, or a cycle) override the drawn ones
const KNEEL_SEG = { in: [4, 52], hold: [54, 99], out: [101, 146] };
const RECORDED = {
  // sitting down and getting up (Mixamo: Stand To Sit + Sit To Stand): upright, the hands on the thighs
  sit: { clip: 'm_sit2', mask: 'full', seat: 1 },
  // the recording's held stretch ends before he starts to rise (frame 101): held, he stays down
  kneel1: { clip: 'm_kneel1', seg: KNEEL_SEG, mask: { root: 1, legR: 1, legL: 1, torso: 0.6, head: 0.5 }, add: { lean: -22, head: [-12, 0, 0] } },
  kneel_reach: { clip: 'm_kneel1', seg: KNEEL_SEG, mask: 'full' },
  laugh: { clip: 'm_laugh', mask: 'upper', holdRate: 1 },
  face_hands: { clip: 'm_cry', mask: 'upper' },
  cry: { clip: 'm_cry', mask: 'upper' },
  cradle: { clip: 'm_cradle', mask: 'upper' },
  hand_shoulder: { clip: 'm_shoulder', mask: { armR: 1, torso: 0.4, head: 0.6 } },
  lie: { clip: 'm_lie', mask: 'full' },
  // ---- from Mixamo ----
  // down on both knees, the hands together, praying; getting up (Praying, two takes joined)
  pray_kneel: { clip: 'm_pray', mask: 'full' },
  // on both knees, the hands free (the same recording, the arms left to the rest)
  kneel2: { clip: 'm_pray', mask: { root: 1, legR: 1, legL: 1, torso: 0.6, head: 0.4 } },
  // a deep formal bow from the waist, held, and up again
  bow_deep: { clip: 'm_bow', mask: 'full' },
  // nodding yes, shaking the head no — recorded, on the head and a little of the chest, over anything
  nod_yes: { clip: 'm_nod', mask: { head: 1, torso: 0.3 }, holdRate: 1 },
  shake_no: { clip: 'm_shake', mask: { head: 1, torso: 0.3 }, holdRate: 1 },
  // treading water (a cycle; anchored at the pelvis, like the drawn one it replaces)
  tread: { clip: 'm_tread', mask: 'full', ground: 'pelvis' },
  // swimming crawl, face down (a cycle in place)
  crawl: { clip: 'm_swim', mask: 'full' },
  // falling: struck, staggering, down on the knees and forward onto the face; struck back onto the back; pitched forward
  collapse: { clip: 'm_collapse', mask: 'full' },
  fall_back: { clip: 'm_fall_back', mask: 'full' },
  fall_forward: { clip: 'm_fall_fwd', mask: 'full' },
  // bending from the waist to pick something up from the ground, standing up holding it at the chest
  pick_up: { clip: 'm_pickup', mask: 'full' },
  // squatting to lift something heavy (a child) from the ground with both arms, up to the chest
  lift_up: { clip: 'm_lift', mask: 'full' },
  // a rifle: aiming standing; going down on one knee and aiming (hold: { r: 'gun' })
  aim_rifle: { clip: 'm_aim', mask: 'full', holdRate: 1 },
  kneel_aim: { clip: 'm_aim_kneel', mask: 'full' },
  // throwing something overarm
  throw: { clip: 'm_throw', mask: 'full' },
  // scrambling up a steep slope on hands and feet (a cycle in place)
  scramble: { clip: 'm_climb', mask: 'full' },
  wave: { clip: 'm_wave', mask: { armR: 1, armL: 0.5, torso: 0.5, head: 0.5 }, holdRate: 1 },
  talk: { clip: 'm_talk', mask: { armR: 1, armL: 1, torso: 0.5, head: 0.5 }, holdRate: 1 },
};
Object.assign(MOTIONS, RECORDED);

// ===== the feet: a step planner driven by the way gone (feet never slide) =====
// World ground coordinates: X across (m, right +), Z depth (m, away +). The body faces φ (rad): 0 toward the viewer, +90° right.
const fwdW = f => [Math.sin(f), -Math.cos(f)];     // facing direction on the ground (X, Z)
const rightW = f => [-Math.cos(f), -Math.sin(f)];  // the body's right on the ground
function gaitOf(P, s, force) {
  const d = P.d, l = d.hip, k = Math.sqrt(l / 0.9), G = P.gait;
  let runW = span(s / k, 1.75, 2.5);
  if (force === 'walk') runW = 0; else if (force === 'run') runW = 1;
  const en = G.energy;
  const Tw = clamp(0.62 - 0.08 * s / k, 0.42, 0.62) * k * (G.stride || 1) / Math.pow(en, 0.4), Tr = clamp(0.37 - 0.018 * s / k, 0.28, 0.37) * k / Math.sqrt(en);
  return { runW, T: mix(Tw, Tr, runW), sigma: P.sig ? mix(P.sig[0], P.sig[1], runW) : mix(0.76, 1.3, runW), lift: mix(0.075, 0.42, runW) * l, width: mix(0.5, 0.18, runW) * d.hw };
}
function stepper(m, P, pos, face, t, dt, still, force, snap) {
  const d = P.d, G = P.gait;
  let L = m.loco;
  const rest = (i, f) => { const r = rightW(f), w = d.hw * 0.52 * (i ? -1 : 1); return [pos[0] + r[0] * w, pos[1] + r[1] * w]; };
  if (!L || Math.hypot(pos[0] - L.px, pos[1] - L.pz) > 3) {
    L = m.loco = { px: pos[0], pz: pos[1], vx: 0, vz: 0, s: 0, acc: 0, k: 0, tk: t, Tk: 0.6, settled: true,
      feet: [0, 1].map(i => { const p = rest(i, face); return { x: p[0], z: p[1], air: false, fx: p[0], fz: p[1], t0: -9, dur: 0.4, land: -9, liftH: 0 }; }) };
  }
  // speed: over the last ~0.2 s of where the anchor was (a frame's jitter doesn't matter), then smoothed
  if (dt > 0) {
    const hist = L.hist || (L.hist = []);
    hist.push([t, pos[0], pos[1]]);
    while (hist.length > 2 && t - hist[1][0] >= 0.2) hist.shift();
    const h0 = hist[0], span0 = t - h0[0];
    const vx = span0 > 0.03 ? (pos[0] - h0[1]) / span0 : L.vx, vz = span0 > 0.03 ? (pos[1] - h0[2]) / span0 : L.vz;
    const a = 1 - Math.exp(-dt / 0.08), s0 = L.s;
    L.vx += (vx - L.vx) * a; L.vz += (vz - L.vz) * a;
    L.s = Math.hypot(L.vx, L.vz);
    L.acc += ((L.s - s0) / dt - L.acc) * (1 - Math.exp(-dt / 0.2));
  }
  L.px = pos[0]; L.pz = pos[1];
  // the gait takes the speed it is heading for (a body speeding up quickens its steps before it is fast)
  const s = L.s, gp = gaitOf(P, s + clamp(L.acc, 0, 8) * 0.25, force);
  L.runW = gp.runW;
  const limp = G.limp === 'r' ? 0 : G.limp === 'l' ? 1 : -1;
  const Tof = k => gp.T * (limp < 0 ? 1 : (k % 2 === limp ? 1.3 : 0.72));      // the stiff leg swings slow, the step off it is quick
  const target = (i, tLand) => {
    const ahead = gp.T * (2 - gp.sigma) / 2, tp = Math.max(0, tLand - t);
    const r = rightW(face), w = gp.width * (i ? -1 : 1) + (limp === i ? d.hw * 0.25 * (i ? -1 : 1) : 0);
    // where the body will be: with its speed changing (a body slowing down plants its feet shorter)
    const tau = tp + ahead, sv = L.s || 1e-6, way = Math.max(0, sv * tau + 0.5 * clamp(L.acc, -6, 6) * tau * tau);
    const k = sv > 1e-4 ? way / sv : 0;
    let x = pos[0] + L.vx * k + r[0] * w, z = pos[1] + L.vz * k + r[1] * w;
    const dx = x - pos[0], dz = z - pos[1], dl = Math.hypot(dx, dz), mx = d.hip * 0.75;
    if (dl > mx) { x = pos[0] + dx * mx / dl; z = pos[1] + dz * mx / dl; }
    return [x, z];
  };
  const startSwing = (i, t0, dur) => {
    const f = L.feet[i];
    if (f.air) { const [lx, lz] = target(i, f.t0 + f.dur); f.x = lx; f.z = lz; f.land = f.t0 + f.dur; }
    f.air = true; f.fx = f.x; f.fz = f.z; f.t0 = t0; f.dur = dur;
    const [tx, tz] = target(i, t0 + dur);
    f.liftH = gp.lift * clamp(Math.hypot(tx - f.x, tz - f.z) / (0.25 * d.hip) + 0.25, 0.3, 1);
  };
  // are we standing settled? (slow, nothing in the air, feet near where they rest)
  const off = i => { const r = rest(i, face), f = L.feet[i]; return Math.hypot(f.x - r[0], f.z - r[1]); };
  if (still) L.settled = true;
  if (snap) {
    // held still (riding, carried, sitting): the feet go where the body goes
    L.feet.forEach((f, i) => { const r = rest(i, face); f.x = r[0]; f.z = r[1]; f.air = false; });
  }
  else if (L.settled) {
    if (s > 0.08 || off(0) > d.hw * 0.75 || off(1) > d.hw * 0.75) {
      // set off: the foot farther from where it should go first
      L.k = (off(0) >= off(1) ? 0 : 1) + 2; L.tk = t; L.Tk = Tof(L.k); L.settled = false;
      startSwing(L.k % 2, t, gp.sigma * L.Tk * (limp === L.k % 2 ? 1.1 : 1));
    }
  } else {
    // the step clock: a new step every Tk; the swinging foot is k % 2. A step quickens when the body speeds up
    // (and comes now if the standing foot is left too far behind); a foot in the air hurries down likewise
    const Tnow = Tof(L.k);
    if (Tnow < L.Tk) L.Tk = Math.max(t - L.tk, Tnow);
    const nf = L.feet[(L.k + 1) % 2];
    if (!nf.air && Math.hypot(nf.x - pos[0], nf.z - pos[1]) > d.hip * 0.5) L.Tk = Math.min(L.Tk, t - L.tk);
    for (const f of L.feet) if (f.air) { const want = gp.sigma * Tnow; if (want < f.dur) f.dur = Math.min(f.dur, Math.max(t - f.t0 + 0.03, want)); }
    let guard = 0;
    while (t >= L.tk + L.Tk && guard++ < 8) {
      const anyAir = L.feet.some(f => f.air && t < f.t0 + f.dur);
      if (s < 0.06 && !anyAir && off(0) < d.hw * 0.3 && off(1) < d.hw * 0.3) { L.settled = true; break; }
      L.tk += L.Tk; L.k++; L.Tk = Tof(L.k);
      if (t - L.tk > 0.5) L.tk = t;
      const i = L.k % 2;
      if (s < 0.06 && off(i) < d.hw * 0.3) continue;  // this foot is where it should be: skip its step
      startSwing(i, L.tk, gp.sigma * L.Tk);
    }
  }
  // the feet now
  const out = [];
  for (let i = 0; i < 2; i++) {
    const f = L.feet[i];
    let x = f.x, z = f.z, y = 0, pitch = 0, u = 1;
    if (f.air) {
      u = (t - f.t0) / f.dur;
      const [tx, tz] = target(i, f.t0 + f.dur);
      if (u >= 1) { f.air = false; f.x = tx; f.z = tz; f.land = f.t0 + f.dur; x = tx; z = tz; }
      else {
        const e = sm(u * 1.04);
        x = mix(f.fx, tx, e); z = mix(f.fz, tz, e);
        const hu = Math.sin(PI * Math.pow(clamp(u), mix(0.85, 0.55, L.runW)));
        y = f.liftH * hu * (limp === i ? 0.55 : 1);
        // heel-and-toe: pushed off on the toe, swung, the toe up as the heel comes down
        pitch = (u < 0.3 ? mix(32, 0, sm(u / 0.3)) : mix(0, -14, sm((u - 0.3) / 0.7))) * D2R * (limp === i ? 0.3 : 1) * mix(1, 0.6, L.runW);
      }
    }
    if (!f.air) {
      const since = t - f.land;
      pitch = -14 * D2R * (1 - sm(since / 0.12)) * (since < 0.2 ? 1 : 0) * mix(1, 0.3, L.runW) * (limp === i ? 0.3 : 1);
      // the heel rises before this foot lifts
      if (!L.settled && s > 0.12) {
        let tl = L.tk + L.Tk; if ((L.k + 1) % 2 !== i) tl += Tof(L.k + 1);
        const pre = tl - t, win = 0.32 * L.Tk;
        if (pre < win && pre > 0) pitch += 30 * D2R * sm(1 - pre / win) * (limp === i ? 0.2 : 1);
      }
    }
    out.push({ x, z, y, pitch, air: f.air, u, land: f.land });
  }
  return { feet: out, s, acc: L.acc, runW: L.runW, settled: L.settled, k: L.k, tk: L.tk, Tk: L.Tk, vx: L.vx, vz: L.vz, limp };
}

// ===== a person: recorded motion (layers by mask) on the step planner's feet, rebuilt for its own body =====
const CASTS = new Map();
const strHash = s => { let h = 2166136261; for (const ch of String(s)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return (h >>> 0) % 100003; };
const WHERE = new Map();       // id → where its parts were last painted (world: [across, height, depth])
const SOLE = 22 * D2R;          // the ankle→ball line dips this much below the sole
// where a pose's `at` names, in the body frame
function refPoint(at, side, J, H) {
  const [ref, dx = 0, dy = 0, dz = 0] = at, v = [dx * side * H, dy * H, dz * H];
  if (ref === 'head') return add(J.Hc, mv(J.Rhd, v));
  if (ref === 'hip') return add(J.P, mv(J.Rp, v));
  if (ref === 'root') return mv(rotY(0), v);
  return add(J.C, mv(J.Rc, v));
}
// the style's clips: walk and run cycles, an idle loop (falling back on the neutral ones)
function styleClips(name) {
  const st = STYLES[name] || STYLES.neutral, nt = STYLES.neutral;
  return { walk: clipOf(st.walk || nt.walk), run: clipOf(st.run || nt.run), idle: clipOf(st.idle || nt.idle) };
}
// one pose's frame now: a recorded transition played by its weight, a held stretch kept alive in time, a cycle by its
// phase — or a frame made by hand
function poseFrame(def, p, t, o, m, out) {
  if (def.frame) { out.set(def._f || (def._f = makeFrame(def.frame))); if (def.mirror) out.set(mirrorFrame(out)); return out; }
  const c = clipOf(def.clip); if (!c) return null;
  const fps = c.fps;
  if (def.cyc || c.cyc) {
    const [a, b] = def.cyc || c.cyc, ph = o.cycles?.[p.name] ?? o.cycle;
    const u = ph != null ? ph : t * (def.rate || fps / (b - a));
    sampleClip(c, a + (b - a) * (((u % 1) + 1) % 1), out, false);
  } else {
    const sg = def.seg || c.seg, w = clamp(p.u ?? p.w), mk = m['ph:' + def.clip] || (m['ph:' + def.clip] = { hold0: t });
    let x;
    if (w >= 0.999) {
      // held: back and forth through the held stretch, slowly — alive, not frozen
      const [a, b] = sg.hold || [sg.in[1], sg.in[1]], L = Math.max(1, b - a), sp = (def.holdRate || 0.6) * fps;
      const k = ((t - mk.hold0) * sp) % (2 * L); x = a + (k < L ? k : 2 * L - k);
      mk.out = false;
    } else {
      mk.hold0 = t;
      if (p.vel < 0 && sg.out) { const [a, b] = sg.out; x = a + (b - a) * (1 - w); }
      else { const [a, b] = sg.in; x = a + (b - a) * w; }
    }
    sampleClip(c, x, out, false);
    // a clip with a path (r): played where the figure is, or — travel — the body going along its path from `at`, the
    // steps and the way over the floor from one motion
    if (c.R && (o.travel ?? def.travel)) { const [rx, rz] = pathAt(c, x); out[0] += rx; out[2] += rz; }
    // in place: the recording's walk away from where it started (a step forward to kneel, back onto a seat) left
    // out — the pelvis stays over `at` (kneel on the spot; sit with the seat at `at`)
    else if (o.inPlace ?? def.inPlace) { out[0] = 0; out[2] = 0; }
  }
  if (def.mirror) out.set(mirrorFrame(out));
  return out;
}
function poseDef(name, own) {
  const mir = name.endsWith(':l'), bn = mir ? name.slice(0, -2) : name;
  const base = own && own[bn] ? (own[bn]._d || (own[bn]._d = typeof own[bn] === 'function' ? { fn: own[bn] } : own[bn].clip ? own[bn] : fromOld(own[bn]))) : MOTIONS[bn];
  if (!base) return null;
  if (!mir) return base;
  const key = '_m';
  return base[key] || (base[key] = { ...base, mirror: !base.mirror, at: base.at && { r: base.at.l, l: base.at.r }, pole: base.pole && { r: base.pole.l, l: base.pole.r }, mask: base.mask === 'armR' ? 'armL' : base.mask === 'armL' ? 'armR' : base.mask && typeof base.mask === 'object' ? { ...base.mask, armR: base.mask.armL || 0, armL: base.mask.armR || 0 } : base.mask, hand: base.hand && { r: base.hand.l, l: base.hand.r } });
}

// ===== each figure as it is now: moved once a frame (kit.move — the lib's beforeFrame), painted as moved =====
// id → { now: the frame's time it was moved at, o: its options, P, J, X: its body, info: its points } ('h:' + id: a horse)
const BODIES = new Map();
// frozen figures (o.frozen): the moment each one froze — time stops for it (no breath, no idle, the springs still)
const FROZEN = new Map();
// a person moved to the frame's time `frame` (its own time: o.t; frozen, stopped): its memory stepped, its body
// rebuilt, where its points are (info, WHERE) — and its head marked (mark(x, y): its element's point) if o.mark
function stepPerson(o, frame, mark) {
  const id0 = o.id;
  if (o.frozen) { if (!FROZEN.has(id0)) FROZEN.set(id0, o.t ?? frame); } else FROZEN.delete(id0);
  const t = o.frozen ? FROZEN.get(id0) : o.t ?? frame, who = o.who || 'man', id = id0;
  const seed = o.seed ?? strHash(id);
  const ck = who + '|' + seed + '|' + (o.build ? JSON.stringify(o.build) : '');
  let P = CASTS.get(ck);
  if (!P) { P = castOf(who, seed, o.build); CASTS.set(ck, P); }
  const d = P.d, H = P.H, hu = d.hu, G = P.gait;
  const now = t, [m, dt] = memory('p:' + id, now);
  const ox = o.x || 0, oy = o.y || 0, at = o.at || [ox, 0], pos = [at[0], at[1] || 0];
  if (dt === 0 && !m.fresh && m.lastPos && !o.only && Math.hypot(pos[0] - m.lastPos[0], pos[1] - m.lastPos[1]) > 0.4 && !m.warned) {
    m.warned = true; (globalThis.__mooodErrors = globalThis.__mooodErrors || []).push(`kit: two figures share the id "${id}" — give each its own id`);
  }
  m.lastPos = pos;
  const seedF = seed % 997;
  // ---- the poses asked for, each weight springing (a little past, and settling) ----
  const list = [];
  const raw = !o.pose ? [] : typeof o.pose === 'string' ? [[o.pose, 1]] : Array.isArray(o.pose) ? o.pose : Object.entries(o.pose);
  const springy = o.springy !== false && !m.fresh, seen = new Set();
  // a recorded action plays at its own pace (never faster than ~1.3× the recording) following the asked weight:
  // the scene's slow ease scrubs it, a jump plays it
  // Poses made from the same recording (kneel1, kneel_reach) share its progress: going from one to the other
  // cross-fades at the held stretch instead of getting down again; the recording's way down / up follows the
  // largest weight asked of any of them.
  const clipT = {};
  const clipN = {}, onClip = name => { const def = poseDef(name, o.poses), c = def?.clip && clipOf(def.clip); return c && (def.seg || c.seg) ? def.clip : null; };
  for (const [name, w0] of raw) { const k = onClip(name); if (k) { clipT[k] = clamp((clipT[k] ?? 0) + clamp(w0)); clipN[k] = (clipN[k] || 0) + 1; } }
  for (const k of Object.keys(m)) if (k.startsWith('w:') && !raw.some(r => r[0] === k.slice(2)) && Math.abs(m[k].x) > 0.003) { const c = onClip(k.slice(2)); if (c) clipN[c] = (clipN[c] || 0) + 1; }
  const take = (name, w, vel, w0) => {
    const def = poseDef(name, o.poses); if (!def) return;
    const c = def.clip && clipOf(def.clip), sg = c && (def.seg || c.seg);
    if (sg) {
      const key = 'u:' + def.clip, tgt = clipT[def.clip] ?? 0, st = m[key] || (m[key] = { u: m.fresh ? tgt : 0 });
      if (st.t !== now) {
        st.t = now;
        const seg = tgt >= st.u ? sg.in : sg.out || sg.in, dur = Math.max(0.3, (seg[1] - seg[0]) / c.fps) / 1.3;
        const du = tgt - st.u, stepU = dt / dur;
        st.vel = du > 0.001 ? 1 : du < -0.001 ? -1 : 0;
        st.u = Math.abs(du) <= stepU ? tgt : st.u + Math.sign(du) * stepU;
      }
      if (st.u <= 0.001 && tgt <= 0) { delete m[key]; return; }
      // one of several on the same recording: its own weight springs (the cross-fade); alone it follows the recording
      const grouped = clipN[def.clip] > 1, ws = grouped ? clamp(w) : 1;
      if (ws > 0.002) list.push({ name, w: clamp(st.u * 5) * (grouped ? ws : 1), u: st.u, vel: st.vel, def, grp: grouped ? ws : 0 });
      return;
    }
    if (w > 0.002) list.push({ name, w, vel, def });
  };
  for (const [name, w0] of raw) {
    seen.add(name);
    const w = springy ? spring(m, 'w:' + name, clamp(w0, 0, 1.2), 9, 0.8, dt) : (m['w:' + name] = { x: w0, v: 0 }).x;
    take(name, w, m['w:' + name]?.v || 0, clamp(w0));
  }
  for (const k of Object.keys(m)) if (k.startsWith('w:') && !seen.has(k.slice(2))) {
    const w = spring(m, k, 0, 9, 0.8, dt);
    const dk = poseDef(k.slice(2), o.poses); if (Math.abs(w) < 0.003 && Math.abs(m[k].v) < 0.01 && !(dk?.clip && m['u:' + dk.clip])) delete m[k]; else take(k.slice(2), w, m[k].v, 0);
  }
  const maskOf = def => (typeof def.mask === 'object' ? def.mask : MASKS[def.mask || 'full']);
  const legW = clamp(list.reduce((s, p) => s + (maskOf(p.def).legR ? p.w : 0), 0));
  const anchored = list.some(p => p.def.ground === 'saddle' || p.def.ground === 'pelvis') && legW > 0.5;

  // ---- facing: the head leads, the chest follows, the hips last ----
  const faceT = deg(o.face ?? 90);
  const fh = springA(m, 'fh', faceT, 6.5 / (1 + G.heavy * 0.4), 0.95, dt);
  const fc = springA(m, 'fc', faceT, 10, 0.8, dt);
  const fhd = springA(m, 'fhd', faceT, 15, 0.55, dt);

  // ---- the style's recorded walk, run and idle ----
  const styles = !o.style ? [[P.style || 'neutral', 1]] : typeof o.style === 'string' ? [[o.style, 1]] : Object.entries(o.style);
  const sc = styles.map(([n, w]) => [styleClips(n), w]);
  const C0 = sc[0][0];
  P.sig = [2 * (1 - (C0.walk.roff ?? 0.6)), 2 * (1 - (C0.run.roff ?? 0.48))];
  // ---- the feet ----
  const still = legW > 0.6 || o.still;
  const W = stepper(m, P, pos, fh, now, dt, still, o.gait, o.still || legW > 0.95);
  const s = W.s, runW = W.runW, moving = sm2(s, 0.05, 0.45) * (1 - legW);
  // the clips' phase from the planner's step clock: a step begins as its foot leaves the ground
  const uS = W.settled ? 0 : clamp((now - W.tk) / (W.Tk || 0.5)), swingR = (W.k % 2) === 0;
  const phaseOf = c => (((swingR ? c.roff : c.loff) ?? (swingR ? 0.6 : 0.1)) + 0.5 * uS) % 1;
  const base = newFrame(), tmp = newFrame();
  let first = true;
  const idleRate = 0.9 + hash(seedF, 77) * 0.2, idleOff = hash(seedF, 78) * 50;
  for (const [cl, ws] of sc) {
    const f = newFrame();
    sampleClip(cl.idle, (t * idleRate + idleOff) * cl.idle.fps, f, true);
    if (moving > 0) {
      blendFrame(f, sampleClip(cl.walk, phaseOf(cl.walk) * cl.walk.n, tmp, true), MASKS.full, moving * (1 - runW));
      if (runW > 0) blendFrame(f, sampleClip(cl.run, phaseOf(cl.run) * cl.run.n, tmp, true), MASKS.full, moving * runW);
    }
    if (first) { base.set(f); first = false; } else blendFrame(base, f, MASKS.full, ws / (ws + 1e-9));
  }
  if (globalThis.__kitdebug && base.some(Number.isNaN)) console.log('NaN base', moving, runW, uS, W.k, W.Tk, phaseOf(C0.walk), JSON.stringify(Array.from(base.slice(0,9))));
  // ---- the poses, layer by layer, each through its mask ----
  const add0 = { lean: 0, side: 0, twist: 0, head: [0, 0, 0] }, targets = [[], []], hands = [null, null];
  // poses on one recording blend its one frame once, through their masks joined by their weights (no dip between)
  const joined = {};
  for (const p of list) if (p.grp) { const k = p.def.clip + (p.def.mirror ? '|m' : ''), mk = maskOf(p.def), J = joined[k] || (joined[k] = { mask: {}, w: 0, done: false });
    for (const gname of GN) J.mask[gname] = clamp((J.mask[gname] || 0) + (mk[gname] || 0) * p.grp); J.w = Math.max(J.w, clamp(p.u * 5)); }
  for (const p of list) {
    // a pose that moves by itself (the old cyclic ones) is made afresh each frame
    if (p.def.fn) { const cyc = o.cycles?.[p.name] ?? o.cycles?.[p.name.replace(/:l$/, '')]; const d0 = fromOld(p.def.fn(cyc != null ? cyc : (o.cycle ?? t) + seedF * 0.37, P)); if (p.def.mirror) { d0.mirror = true; if (d0.at) d0.at = { r: d0.at.l, l: d0.at.r }; if (d0.pole) d0.pole = { r: d0.pole.l, l: d0.pole.r }; } p.def = d0; }
    const def = p.def, mk = maskOf(def);
    if (def.clip || def.frame) {
      const f = poseFrame(def, p, t + seedF * 0.37, o, m, newFrame());
      // the recording comes in over the first part of the weight (its own transition plays the rest)
      const J = p.grp && joined[def.clip + (def.mirror ? '|m' : '')];
      if (f && J) { if (!J.done) { J.done = true; blendFrame(base, f, J.mask, J.w); } }
      else if (f) blendFrame(base, f, mk, clamp(p.w));
    }
    if (def.add) { const sg = def.mirror ? -1 : 1; add0.lean += (def.add.lean || 0) * p.w; add0.side += sg * (def.add.side || 0) * p.w; add0.twist += sg * (def.add.twist || 0) * p.w; if (def.add.head) { add0.head[0] += def.add.head[0] * p.w; add0.head[1] += sg * def.add.head[1] * p.w; add0.head[2] += sg * def.add.head[2] * p.w; } }
    if (def.cycAdd) { const a = def.cycAdd(t + seedF * 0.37); for (let j = 0; j < 3; j++) add0.head[j] += (a[j] || 0) * p.w; }
    // a later layer that moves an arm takes it from the hand targets laid before it
    for (const [i, g0] of [[0, 'armR'], [1, 'armL']]) { const k = (mk[g0] || 0) * clamp(p.w); if (k > 0 && (def.clip || def.frame)) for (const tg of targets[i]) tg[2] *= 1 - k; }
    if (def.at) for (const [i, k] of [[0, 'r'], [1, 'l']]) if (def.at[k]) targets[i].push([def.at[k], Array.isArray(def.pole) ? def.pole : def.pole?.[k], clamp(p.w)]);
    if (def.hand) for (const [i, k] of [[0, 'r'], [1, 'l']]) if (def.hand[k] && p.w > 0.4) hands[i] = def.hand[k];
  }
  // ---- the body rebuilt from the frame with its own lengths ----
  const legLen = d.thigh + d.shin;
  const Rp0 = frameFU(vecOf(base, 'pF'), vecOf(base, 'pU'));
  let Pl = [base[0] * legLen, base[1] * legLen, base[2] * legLen];
  if (anchored) { const g0 = list.find(p => p.def.ground)?.def.ground; Pl = [Pl[0], g0 === 'saddle' ? d.r.hips * 0.75 : 0, Pl[2]]; }
  const seatP = list.find(p => p.def.seat || p.def.ground === 'seat');
  if (seatP && o.seat != null) Pl[1] = mix(Pl[1], o.seat + d.r.hips * 0.75, clamp(seatP.u ?? seatP.w) ** 2);
  const Rp = Rp0;
  // the chest: the recorded one, turned on by the turn's lag and the poses' leanings
  const RcRel = frameFU(vecOf(base, 'cF'), vecOf(base, 'cU'));
  const Rc = mm(rotY((fc - fh) + deg(add0.twist)), mm(Rp, mm(RcRel, mm(rotX(deg(add0.lean)), rotZ(deg(add0.side))))));
  // carried or riding: the upper body lags behind the seat's jolts
  const jolt = anchored ? dangle(m, 'seat', ox, oy, 7, 0.35, dt) : [0, 0];
  const swayY = -clamp(jolt[1], -0.08, 0.08) * H / 1.7, swayX = clamp(jolt[0], -0.08, 0.08);
  const swayB = [-swayX * Math.cos(fh), 0, swayX * Math.sin(fh)];
  // the poses' lean / side bend the spine itself (the chest goes forward over the hips, not only turns on them)
  const spineV = mv(mm(rotX(deg(add0.lean)), rotZ(deg(add0.side))), vecOf(base, 'spine'));
  const C = add(add(Pl, mv(Rp, mul(spineV, d.spine))), add([0, swayY * 0.6, 0], mul(swayB, 0.5)));
  const Nk = add(C, mv(Rc, [0, 0.012 * H, 0.004 * H]));
  // look: a point (element metres) or degrees; turning speed is a spring (o.lookSpeed)
  let lookYaw = 0, lookPitch = 0, lookW = 0;
  const RhRel = frameFU(vecOf(base, 'hF'), vecOf(base, 'hU'));
  if (o.look != null) {
    lookW = clamp(o.lookW ?? 1);
    if (Array.isArray(o.look)) {
      const c = Math.cos(fh), sn = Math.sin(fh), X = o.look[0] - ox, Za = (o.look[2] ?? 0), y = -(o.look[1] - oy);
      const tgt = [-X * c - Za * sn, y, X * sn - Za * c];
      const v = sub(tgt, add(Nk, [0, d.neck + 0.45 * hu, 0]));
      // the head's own recorded yaw is kept on top: the look is relative to where the chest faces
      const cf = mv(Rc, [0, 0, 1]);
      lookYaw = Math.atan2(-v[0], v[2]) - Math.atan2(-cf[0], cf[2]); lookPitch = Math.atan2(-v[1], Math.hypot(v[0], v[2]));
      while (lookYaw > PI) lookYaw -= TAU; while (lookYaw < -PI) lookYaw += TAU;
    } else if (typeof o.look === 'object') { lookYaw = deg(o.look.yaw); lookPitch = deg(o.look.pitch); }
    else lookYaw = deg(o.look);
  }
  const lsp = o.lookSpeed ?? 1;
  const ly = springA(m, 'ly', lookYaw * lookW, 13 * lsp, 0.62, dt), lp = spring(m, 'lp', lookPitch * lookW, 12 * lsp, 0.7, dt);
  const lyC = clamp(ly, -1.35, 1.35), extra = ly - lyC;
  const RhW = mm(Rc, RhRel);
  const Rhd = mm(rotY((fhd - fc) + lyC + deg(add0.head[1])), mm(RhW, mm(rotX(clamp(lp, -0.8, 0.9) * (1 - 0.5 * lookW * 0) + deg(add0.head[0])), rotZ(deg(add0.head[2])))));
  const Hc = add(add(add(Nk, mv(Rc, mul(vecOf(base, 'neck'), d.neck))), mv(Rhd, [0, 0.45 * hu, 0.03 * hu])), add([0, swayY * 0.35, 0], mul(swayB, 0.4)));
  const J = { P: Pl, C, Nk, Hc, Rh: Rp, Rp, Rc, Rhd, H, hu };
  const RcLook = extra ? mm(rotY(extra * 0.4), Rc) : Rc;
  const S = [1, -1].map(side => add(C, mv(RcLook, [side * d.sw / 2, -0.012 * H, -0.006 * H])));
  // ---- arms: the recording, then hands set by poses and by the scene (IK keeps the recorded elbow) ----
  const arms = [0, 1].map(i => {
    const side = i ? -1 : 1, s0 = i ? 'l' : 'r';
    const up = mv(RcLook, vecOf(base, s0 + 'Up')), fo = mv(RcLook, vecOf(base, s0 + 'Fo')), ha = mv(RcLook, vecOf(base, s0 + 'Ha'));
    let E = madd(S[i], up, d.upper), Wr = madd(E, fo, d.fore);
    let pole = up, Wt = Wr, wt = 0;
    for (const [spec, pl, w] of targets[i]) {
      const tp = refPoint(spec, side, J, H);
      Wt = lerp3(Wt, tp, w); wt = Math.max(wt, w);
      if (pl) pole = lerp3(pole, norm(mv(Rc, [pl[0] * side, pl[1], pl[2]])), w);
    }
    const tg = o.hand && (i ? o.hand.l : o.hand.r);
    if (tg) {
      const w = clamp(o.handW?.[i ? 'l' : 'r'] ?? 1);
      Wt = lerp3(Wt, targetBody(tg, o, pos, fh, S[i]), w); wt = Math.max(wt, w);
      if (w > 0.3) pole = lerp3(pole, norm([side * 0.7, -1, -0.4]), w * 0.4);
    }
    if (wt > 0.001) { [E, Wr] = ik3(S[i], Wt, d.upper, d.fore, pole); }
    return { S: S[i], E, W: Wr, hdir: wt > 0.5 ? norm(sub(Wr, E)) : ha, hand: (o.handShape && o.handShape[i ? 'l' : 'r']) || hands[i] || 'open' };
  });
  // ---- legs: the planner's feet (where they stand) with the recording's lift, knee and heel-to-toe ----
  const hips = [1, -1].map(side => add(Pl, mv(Rp, [side * d.hw / 2, 0, 0])));
  const cph = Math.cos(fh), sph = Math.sin(fh);
  const toBody = (X, Z) => { const dX = X - pos[0], dZ = Z - pos[1]; return [-dX * cph - dZ * sph, dX * sph - dZ * cph]; };
  const rec = [0, 1].map(i => {
    const s0 = i ? 'l' : 'r', th = mv(Rp, vecOf(base, s0 + 'Th')), sh = mv(Rp, vecOf(base, s0 + 'Sh')), ft = mv(Rp, vecOf(base, s0 + 'Ft'));
    const K = madd(hips[i], th, d.thigh), A = madd(K, sh, d.shin);
    return { K, A, ft };
  });
  // the pelvis comes down if the planted feet can't otherwise be reached
  const reach = legLen * 0.998, lw = 1 - legW;
  if (lw > 0.01 && !anchored) {
    let lim = Infinity;
    W.feet.forEach((f, i) => {
      if (f.air) return;
      const [x, z] = toBody(f.x, f.z), hd = Math.hypot(x - hips[i][0], z - hips[i][2]);
      lim = Math.min(lim, Math.max(rec[i].A[1], d.ankle) + Math.sqrt(Math.max(0, reach * reach - hd * hd)) - (hips[i][1] - Pl[1]));
    });
    if (Pl[1] > lim) { const dy = (Pl[1] - lim) * lw; for (const q of [Pl, C, Nk, Hc, ...S, ...hips]) q[1] -= dy; for (const a of arms) { a.E[1] -= dy; a.W[1] -= dy; } }
  }
  const ground = !anchored;
  const legs = [0, 1].map(i => {
    const side = i ? -1 : 1, R = rec[i];
    let A = R.A;
    if (lw > 0.001) {
      const [x, z] = toBody(W.feet[i].x, W.feet[i].z);
      A = lerp3(R.A, [x, Math.max(R.A[1], d.ankle * 0.95), z], lw);
    }
    if (o.seat != null && legW > 0.5) { const fl = [A[0], d.ankle, A[2]]; if (len(sub(fl, hips[i])) < legLen * 0.98) A = lerp3(A, fl, legW); }
    let [K, A2] = ik3(hips[i], A, d.thigh, d.shin, sub(R.K, lerp3(hips[i], R.A, 0.5)));
    if (W.limp === i && legW < 0.5 && !W.settled) { A2 = A; K = lerp3(hips[i], A, d.thigh / legLen); }
    // the sole: the ankle→ball line raised to lie along the foot
    const lat = norm(mv(Rp, [1, 0, 0])), f = norm(rodrigues(R.ft, lat, -SOLE)), n = norm(madd([0, -1, 0], f, dot(f, [0, -1, 0])));
    const fl = d.foot, ah = d.ankle;
    const heel = add(A2, add(mul(n, ah - 0.024 * H), mul(f, -0.2 * fl))), toe = add(A2, add(mul(n, ah - 0.017 * H), mul(f, 0.7 * fl)));
    return { H: hips[i], K, A: A2, heel, toe, f, n };
  });
  if (ground) for (const l of legs) {
    const lo = Math.min(l.heel[1] - 0.024 * H, l.toe[1] - 0.016 * H);
    if (lo < 0) for (const k of ['A', 'heel', 'toe']) l[k] = [l[k][0], l[k][1] - lo, l[k][2]];
  }
  // uneven ground: each foot (and knee) on the ground under it — groundAt(across) → height (m) at that point
  if (o.groundAt && ground) {
    const g0 = o.groundAt(pos[0]) || 0;
    const dys = legs.map(l => (o.groundAt(pos[0] + (-l.A[0] * cph + l.A[2] * sph)) || 0) - g0);
    const down = Math.min(0, ...dys);
    if (down < 0) { for (const q of [Pl, C, Nk, Hc, ...S]) q[1] += down; for (const a of arms) { a.E[1] += down; a.W[1] += down; } for (const l of legs) { l.H[1] += down; } }
    legs.forEach((l, i) => {
      const dy = dys[i];
      for (const k of ['A', 'heel', 'toe']) l[k] = [l[k][0], l[k][1] + dy, l[k][2]];
      l.K = ik3(l.H, l.A, d.thigh, d.shin, sub(l.K, lerp3(l.H, l.A, 0.5)))[0];
    });
  }
  J.arms = arms; J.legs = legs; J.S = S;
  // ---- follow-through: cloth and hair lag behind the body's moves ----
  const screenX = p => -p[0] * cph + p[2] * sph;
  const wind = o.wind || 0;
  const lag = (key, p, w, z, k = 1) => {
    const [dx, dy] = dangle(m, key, pos[0] + screenX(p), -p[1], w, z, dt);
    const mx = 0.09 * H * k; return [clamp(dx * k * 0.8 + wind * 0.02, -mx, mx), clamp(dy * k * 0.8, -mx * 0.5, mx * 0.5)];
  };
  J.lagHem = lag('hem', Pl, 6.5 + G.heavy * 2, 0.32);
  J.lagHair = lag('hair', J.Hc, 5, 0.26);
  J.lagTail = lag('tail', J.Hc, 3.4, 0.2, 1.3);
  J.lagHand = arms.map((a, i) => lag('hand' + i, a.W, 5.6, 0.12, 1));
  J.t = t; J.seedF = seedF;
  const body = { now: frame, o, P, J, X: { fh, ox, oy, pos, id, s, legW, W } };
  placed(body, frame, mark);
  BODIES.set(id, body);
  return body;
}
// a person painted as moved this frame, with the options it was moved with — over them what its element gives now (o:
// the same, or only { id } and what changes in the painting: only: 'far' | 'near', an alpha)
function person(g, e, o = {}) {
  const m = moved(e, o);
  return m && paintPerson(g, e, m.o, m.b);
}
// the body o names, as moved this frame, and its options — over them what its element gives now; or null (not moved:
// said in the scene's errors; o null: its people entry gave null — not there now)
function moved(e, o) {
  if (!o) return null;
  const id = o.id ?? e.id ?? (o.who || 'man'), b = BODIES.get(id);
  if (!b) { e.warn(`"${id}" is painted but not moved: give it to kit.chrysalids.move(people, f) in the lib's beforeFrame`); return null; }
  if (b.now !== e.t) e.warn(`"${id}" was not moved this frame (kit.chrysalids.move in the lib's beforeFrame): painted as it was`);
  return { b, o: { ...b.o, ...o } };
}
// body frame → element metres: [x, y, depth (+ away)] (o.view: how much depth lowers a point; o.lift: up off the ground)
function projector(o, fh, ox, oy) {
  const view = o.view ?? 0.14, lift = o.lift || 0, c = Math.cos(fh), sn = Math.sin(fh);
  return p => { const X = -p[0] * c + p[2] * sn, Z = -p[0] * sn - p[2] * c; return [ox + X, oy - p[1] - Z * view * (1 - (p[1] + lift) / 1.7), Z]; };
}
// where a person moved is (body.info: element metres; WHERE: the world, for another figure's hand — K.point), the child
// it carries moved with it (in its arms: body.child, its options), its head marked
function placed(body, frame, mark) {
  const { o, P, J, X } = body, { fh, ox, oy, pos, id } = X, H = P.H, hu = P.d.hu, Rc = J.Rc, Rh = J.Rh, Rhd = J.Rhd;
  const pr = projector(o, fh, ox, oy);
  // the seat for a child: between the hands (on the forearm when carrying, under the arms when lifting)
  const handsMid = lerp3(J.arms[0].W, J.arms[1].W, 0.5);
  let carryP = add(handsMid, mv(Rc, [0, 0.01 * H, 0.02 * H]));
  if (o.carry) {
    const cp = o.carry.pose, up = typeof cp === 'string' ? (cp === 'held_up' ? 1 : 0) : clamp(cp?.held_up || 0);
    if (up > 0) { const CP = castOf(o.carry.who || 'petra', 0, o.carry.build); carryP = add(carryP, [0, -up * (CP.d.spine * 0.95), 0]); }
  }
  let child = null;
  if (o.carry) {
    const cq = pr(carryP);
    body.child = { face: (o.face ?? 90) + 180 - 25, t: J.t, light: o.light, dark: o.dark, rim: o.rim, rimDir: o.rimDir, rimWidth: o.rimWidth, tint: o.tint, view: o.view ?? 0.14, pose: 'carried', id: id + ':child', ...o.carry,
      x: cq[0], y: cq[1], at: [pos[0] + cq[0] - ox, pos[1]], lift: carryP[1], shadow: 0, still: true };
    child = stepPerson(body.child, frame, mark).info;
  }
  const P2 = p => { const q = pr(p); return [q[0], q[1]]; };
  body.info = {
    head: P2(J.Hc), top: P2(add(J.Hc, mv(Rhd, [0, 0.55 * hu, 0]))), chest: P2(J.C), hip: P2(J.P),
    hand: { r: P2(J.arms[0].W), l: P2(J.arms[1].W) }, shoulder: { r: P2(J.S[0]), l: P2(J.S[1]) }, foot: { r: P2(J.legs[0].A), l: P2(J.legs[1].A) },
    carry: P2(carryP), lap: P2(add(J.P, mv(Rh, [0, 0.05 * H, 0.17 * H]))),
    back: P2(add(J.C, mv(Rc, [0, -0.04 * H, -0.12 * H]))), face: X.fh / D2R, speed: X.s, height: H, child,
  };
  // the world (across, height, depth) of each named point: for another figure's hand (K.point)
  const wpt = p => { const q = pr(p); return [pos[0] + q[0] - ox, -(q[1] - oy), pos[1] + q[2]]; };
  WHERE.set(id, { head: wpt(J.Hc), chest: wpt(J.C), hip: wpt(J.P), hand_r: wpt(J.arms[0].W), hand_l: wpt(J.arms[1].W),
    shoulder_r: wpt(J.S[0]), shoulder_l: wpt(J.S[1]), carry: wpt(carryP), back: wpt(add(J.C, mv(Rc, [0, -0.04 * H, -0.12 * H]))) });
  if (o.mark) mark(body.info.head[0], body.info.head[1] - 0.15 * hu);
}
// a target from the scene → the body frame: [x, y] element metres (y down, like the painting), [x, y, depth], or a K.point
function targetBody(tg, o, pos, fh, S) {
  const ox = o.x || 0, oy = o.y || 0;
  let X, Y, Za;
  if (tg.world) { X = tg.world[0] - pos[0] + ox; Y = -tg.world[1] + oy; Za = (tg.world[2] ?? pos[1]) - pos[1]; }
  else { X = tg[0]; Y = tg[1]; Za = tg[2]; }
  const c = Math.cos(fh), sn = Math.sin(fh), x0 = X - ox, y = -(Y - oy);
  if (Za == null) Za = (-S[0] * sn - S[2] * c) - 0.08 * Math.abs(c);
  return [-x0 * c - Za * sn, y, x0 * sn - Za * c];
}

// ===== painting a person: parts sorted by depth, a soft rim of light, a shadow =====
const DARK = '#1d1b22';
function colourer(o, P) {
  const lit = clamp(o.light ?? 0.35) * 0.92, dark = o.dark || DARK, tint = o.tint ? rgbOf(o.tint) : null, cache = {};
  return (name, far) => {
    const key = name + (far ? '*' : '');
    if (cache[key]) return cache[key];
    let c = rgbOf(P.col[name] || name);
    if (tint) c = [c[0] * tint[0] / 255, c[1] * tint[1] / 255, c[2] * tint[2] / 255];
    return (cache[key] = shade(dark, c, lit * (far ? 0.78 : 1), far ? 0.9 : 1));
  };
}
function paintPerson(g, e, o, body) {
  const { P, J, X } = body, { fh, ox, oy } = X, d = P.d, H = P.H, hu = d.hu, r = d.r, wear = P.wear;
  const view = o.view ?? 0.14, lift = o.lift || 0, c = Math.cos(fh);
  const pr = projector(o, fh, ox, oy);
  const col = colourer(o, P);
  const parts = [];
  const part = (grp, z, fills, edge) => parts.push({ grp, z, fills, edge });
  const circ = (p, rr) => { const q = pr(p); return [q[0], q[1], rr]; };
  const zOf = (...ps) => ps.reduce((s, p) => s + pr(p)[2], 0) / ps.length;
  const zC = pr(J.C)[2], zH = pr(J.Hc)[2];
  const skirtLen = wear.skirt || 0, coatLen = wear.coat || 0;
  const robe = Math.max(skirtLen, coatLen);
  // ---- legs ----
  const legCol = skirtLen ? 'boots' : 'bottom';
  J.legs.forEach((l, i) => {
    const far = pr(l.K)[2] > pr(J.legs[1 - i].K)[2] + 0.01;
    const leg = new Path2D(), boot = new Path2D();
    const h = pr(l.H), k = pr(l.K), a = pr(l.A), mid = pr(lerp3(l.K, l.A, 0.3));
    taper(leg, h[0], h[1], r.thigh, k[0], k[1], r.knee);
    taper(leg, k[0], k[1], r.knee, mid[0], mid[1], r.calf);
    taper(leg, mid[0], mid[1], r.calf, a[0], a[1], r.ankle);
    const bt = pr(lerp3(l.A, l.K, 0.28));
    taper(boot, bt[0], bt[1], r.ankle * 1.12, a[0], a[1], r.ankle * 1.05);
    hullPath([circ(l.A, r.ankle * 1.05), circ(l.heel, 0.022 * H), circ(l.toe, 0.014 * H), circ(lerp3(l.heel, l.toe, 0.55), 0.018 * H)], boot, 8);
    if (o.only === 'far' ? far : o.only === 'near' ? !far : true) part(2, zOf(l.K, l.A) + (far ? 0.001 : 0), [[leg, col(legCol, far)], [boot, col('boots', far)]]);
  });
  if (o.only === 'far') { drawParts(g, e, parts, o); return null; }
  // ---- skirt / long coat: from the waist over the legs to the hem, the hem lagging ----
  const Rc = J.Rc, Rh = J.Rh;
  const loose = (len01, flare, colName, from) => {
    const pts = [];
    const ring = (cen, rx, rz, Rm, n, lagk) => { for (let j = 0; j < n; j++) { const a = j * TAU / n; const q = pr(add(cen, mv(Rm, [Math.cos(a) * rx, 0, Math.sin(a) * rz]))); pts.push([q[0] + J.lagHem[0] * lagk, q[1] + J.lagHem[1] * lagk * 0.5, 0]); } };
    const top = from === 'chest' ? add(J.C, mv(Rc, [0, -0.06 * H, 0])) : lerp3(J.P, J.C, 0.3);
    ring(top, r.hips * 1.05 + d.hw * 0.25, r.hips * 0.95, from === 'chest' ? Rc : Rh, 10, 0);
    const legLen = d.thigh + d.shin, hemY = [];
    // the hem follows the legs only part of the way (cloth between them): the legs stride out beyond it
    const mid = lerp3(J.legs[0].A, J.legs[1].A, 0.5);
    J.legs.forEach(l => {
      const f = len01 * legLen;
      const pf = f <= d.thigh ? lerp3(l.H, l.K, f / d.thigh) : lerp3(l.K, l.A, Math.min(1, (f - d.thigh) / d.shin));
      const hang = Math.max(0, f - d.thigh);
      let kd = [l.K[0], l.K[1] - hang, l.K[2]];
      const gy = 0.012 * H;
      const pfc = [pf[0], Math.max(gy, pf[1]), pf[2]], kdc = [kd[0], Math.max(gy, kd[1]), kd[2]];
      const squeeze = q => { const mq = [mid[0], q[1], mid[2]]; let v = sub(q, mq); const l = len(v), mx = 0.14 * H; if (l > 0) v = mul(v, Math.min(0.6, mx / l)); return add(mq, v); };
      ring(squeeze(pfc), flare, flare * 0.85, Rh, 14, 1);
      ring(squeeze(kdc), flare * 0.9, flare * 0.8, Rh, 10, 1);
      const kq = pr(lerp3(l.K, l.H, 0.25)); pts.push([kq[0], kq[1], r.knee * 1.25]);
      hemY.push(pfc[1]);
    });
    const path = hullPath(pts, null, 8);
    return { path, hemY };
  };
  if (robe > 0) {
    const sk = skirtLen ? loose(skirtLen, r.thigh * 1.25 + 0.035 * H, 'skirt', 'waist') : loose(coatLen, r.thigh * 1.15 + 0.03 * H * coatLen, 'coat', 'waist');
    part(2.5, zC, [[sk.path, col(skirtLen ? 'skirt' : 'coat')]]);
    J.hemY = sk.hemY;
  }
  // ---- torso ----
  const tor = [];
  const tp = (v, rr, R = Rc, from = J.C) => tor.push(circ(add(from, mv(R, v)), rr));
  J.S.forEach((S, i) => { const sd = i ? -1 : 1; tor.push(circ(add(S, mv(Rc, [-sd * 0.014 * H, -0.02 * H, 0])), r.shoulder * 0.8)); tp([sd * 0.04 * H, 0.012 * H, -0.004 * H], 0.028 * H * P.girth); });
  tp([0, -0.045 * H, 0.03 * H * P.girth], r.chest * 0.82);
  tp([0, -0.035 * H, -0.03 * H], r.chest * 0.8);
  const Wc = lerp3(J.P, J.C, 0.45);
  tp([0.045 * H, 0, 0], r.waist, Rc, Wc); tp([-0.045 * H, 0, 0], r.waist, Rc, Wc);
  tp([0, -0.02 * H, 0.025 * H * (1 + P.belly)], r.waist * (1 + 0.35 * P.belly), Rc, lerp3(J.P, J.C, 0.3));
  if (P.bust) { tp([0.04 * H, -0.075 * H, 0.045 * H], 0.03 * H * P.bust + 0.012 * H); tp([-0.04 * H, -0.075 * H, 0.045 * H], 0.03 * H * P.bust + 0.012 * H); }
  // a shirt is tucked in: the trousers' seat is its own shape (a waist between); anything else covers the hips
  const tucked = wear.top === 'shirt' && !coatLen && !skirtLen;
  const hipS = [];
  const hpush = (v, rr) => hipS.push(circ(add(J.P, mv(Rh, v)), rr));
  hpush([0.06 * H, 0.005 * H, 0], r.hips); hpush([-0.06 * H, 0.005 * H, 0], r.hips); hpush([0, -0.005 * H, -0.03 * H], r.hips * 0.92);
  if (tucked) { hpush([0.05 * H, 0.06 * H, 0.0], r.waist * 0.9); hpush([-0.05 * H, 0.06 * H, 0.0], r.waist * 0.9); } else tor.push(...hipS);
  const torso = hullPath(tor, null, 16);
  if (tucked) part(2.6, zC, [[hullPath(hipS, null, 12), col('bottom')]]);
  const topCol = col(wear.top === 'coat' ? 'coat' : 'top');
  // neck
  const neck = new Path2D(); const n0 = pr(J.Nk), n1 = pr(add(J.Hc, mv(J.Rhd, [0, -0.32 * hu, -0.05 * hu])));
  taper(neck, n0[0], n0[1], r.neck * 1.15, n1[0], n1[1], r.neck);
  part(3, zC, [[neck, col('skin')], [torso, topCol]]);
  // apron (front panel; seen from the front and the side)
  const fwdZ = -c; // depth of the body's forward: < 0 faces the viewer
  if (wear.apron && fwdZ < -0.4) {
    const ap = new Path2D(), zf = r.hips * 0.8, wTop = 0.06 * H, wBot = 0.08 * H;
    const hemY = J.hemY ? Math.min(...J.hemY) : 0, legLen = d.thigh + d.shin;
    const botY = J.hemY ? mix(J.P[1], hemY, clamp(wear.apron / Math.max(0.01, robe))) : J.P[1] - wear.apron * legLen;
    const bib = wear.apron && (P.sex === 'm' || wear.apron > 0.75);
    const topP = bib ? add(J.C, mv(Rc, [0, -0.05 * H, r.chest * 0.75])) : add(lerp3(J.P, J.C, 0.35), mv(Rc, [0, 0, r.waist * 0.95]));
    const mid = add(lerp3(J.P, J.C, 0.3), mv(Rh, [0, 0, zf]));
    const lb = J.lagHem;
    const q = [add(topP, mv(Rc, [-wTop * 0.75, 0, 0])), add(topP, mv(Rc, [wTop * 0.75, 0, 0])), add(mid, mv(Rh, [wTop, 0, 0])),
      [mid[0] + wBot * 0, botY, mid[2] + 0.02 * H], add(mid, mv(Rh, [-wTop, 0, 0]))].map(pr);
    // the bottom edge: two corners
    const bL = pr(add([mid[0], botY, mid[2] + 0.02 * H], mv(Rh, [-wBot, 0, 0]))), bR = pr(add([mid[0], botY, mid[2] + 0.02 * H], mv(Rh, [wBot, 0, 0])));
    ap.moveTo(q[0][0], q[0][1]); ap.lineTo(q[1][0], q[1][1]); ap.lineTo(q[2][0], q[2][1]);
    ap.lineTo(bR[0] + lb[0], bR[1] + lb[1] * 0.5); ap.lineTo(bL[0] + lb[0], bL[1] + lb[1] * 0.5); ap.lineTo(q[4][0], q[4][1]); ap.closePath();
    part(3.1, zC - 0.01, [[ap, col('apron')]]);
  }
  // ---- head ----
  const Rhd = J.Rhd, Hc = J.Hc;
  const hp = (v, rr) => circ(add(Hc, mv(Rhd, v.map(x => x * hu))), rr * hu);
  const kid = clamp((7 - P.heads) / 2);
  const headP = hullPath([hp([0, 0.04, -0.05], 0.43 + kid * 0.04), hp([0, -0.2, 0.1], 0.3), hp([0, -0.37, 0.16], 0.15), hp([0, -0.04, 0.43 - kid * 0.06], 0.075 - kid * 0.025), hp([0, -0.3, 0.3], 0.1)], null, 12);
  part(4, zH, [[headP, col('skin')]]);
  // a face toward us, seen big and in light: just the shadow of the eyes and a mouth line — no more (a face is read by its posture)
  const litK = clamp(o.light ?? 0.35);
  const hfZ0 = (pr(add(Hc, mv(Rhd, [0, 0, hu])))[2] - zH) / hu;
  if (hfZ0 < -0.3 && litK > 0.25 && hu / (e.px || 0.01) > 14 && !(o.only)) {
    const fc = shade(o.dark || DARK, P.col.skin, litK * 0.42), feat = new Path2D(), sideK = clamp((-hfZ0 - 0.3) / 0.5);
    for (const sx of [-0.17, 0.17]) { const q = pr(add(Hc, mv(Rhd, [sx * hu, -0.07 * hu, 0.42 * hu]))); feat.moveTo(q[0] + 0.05 * hu, q[1]); feat.ellipse(q[0], q[1], 0.055 * hu, 0.035 * hu, 0, 0, TAU); }
    const m0 = pr(add(Hc, mv(Rhd, [-0.09 * hu, -0.3 * hu, 0.38 * hu]))), m1 = pr(add(Hc, mv(Rhd, [0.09 * hu, -0.3 * hu, 0.38 * hu])));
    const mouth = new Path2D(); mouth.moveTo(m0[0], m0[1]); mouth.lineTo(m1[0], m1[1]);
    part(4.05, zH - 0.0005, [[feat, fc], [mouth, fc, 0.025 * hu * sideK]]);
  }
  // hair: what lies behind the head is painted before it, what is in front after
  const zAt = v => pr(add(Hc, mv(Rhd, v.map(x => x * hu))))[2];
  // which way the face looks: < 0 toward the viewer. Hair at the back goes under the head only when the face is clearly seen
  const hfZ = (zAt([0, 0, 1]) - zH) / hu;
  // the hair at the back goes under the head when it lies farther than the head (the face toward us, or tipped up)
  const behind = v => (hfZ < -0.35 || zAt([0, 0, -0.35]) - zH > 0.05 * hu ? 3.9 : 4.1);
  const hairC = col('hair');
  const lh = J.lagHair, lt = J.lagTail;
  const style = wear.hair;
  const covered = wear.hat === 'bonnet' || wear.hat === 'kerchief';
  if (style && style !== 'bald') {
    const back = [[0, 0.1, -0.17, 0.41], [0, -0.12, -0.28, 0.26]], top = [[0, 0.3, 0.02, 0.3], [0.2, 0.2, 0.04, 0.22], [-0.2, 0.2, 0.04, 0.22]];
    if (style === 'curls') { back.push([0.3, -0.12, -0.1, 0.25], [-0.3, -0.12, -0.1, 0.25], [0, -0.2, -0.2, 0.3]); top[0] = [0, 0.3, 0, 0.36]; }
    if (style === 'cropped') { back[0] = [0, 0.08, -0.12, 0.33]; }
    if (style === 'long') back.push([0.36, -0.28, -0.12, 0.17], [-0.36, -0.28, -0.12, 0.17], [0, -0.3, -0.3, 0.3]);
    const bp = hullPath(back.map(([x, y, z, rr]) => hp([x, y, z], rr)), null, 10);
    const tpth = hullPath(top.map(([x, y, z, rr]) => hp([x, y, z], rr)), null, 10);
    if (!covered) part(behind(), zH + 0.001, [[bp, hairC]]);
    // the hair on top lies over the forehead — unless the head is tipped back (the face up toward us): then behind it
    const topBehind = zAt([0, 0.32, -0.05]) - zH > 0.1 * hu;
    if (!(wear.hat === 'bonnet' || wear.hat === 'kerchief')) part(topBehind ? 3.95 : 4.2, zH - 0.001, [[tpth, hairC]]);
    // a tail of hair, a braid, a bun — lagging
    if ((style === 'long' || style === 'braid' || style === 'bun') && !(covered && style === 'bun')) {
      const chain = [];
      const n = style === 'bun' ? 1 : 4, Lh = style === 'long' ? 0.24 * H : 0.2 * H;
      const start = add(Hc, mv(Rhd, [0, -0.1 * hu, -0.36 * hu]));
      for (let j = 0; j <= n; j++) {
        const u = j / n;
        let p = style === 'bun' ? add(Hc, mv(Rhd, [0, 0.0, -0.5 * hu])) : add(start, add(mv(Rc, [0, 0, -0.035 * H * Math.sin(u * 2)]), [0, -Lh * u, 0]));
        const q = pr(p), k = u * u;
        const rr = style === 'bun' ? 0.17 * hu : style === 'long' ? mix(0.26, 0.1, u) * hu : mix(0.12, 0.07, u) * hu;
        chain.push([q[0] - lt[0] * k * 0.7 + noise(J.t * 0.8, 3) * 0.004 * u, q[1] - Math.abs(lt[0]) * k * 0.2, rr]);
      }
      const tail = new Path2D();
      if (chain.length === 1) disc(tail, ...chain[0]);
      for (let j = 0; j < chain.length - 1; j++) taper(tail, ...chain[j], ...chain[j + 1]);
      const fills = [[tail, hairC]];
      if (style === 'braid') { const ribbon = new Path2D(); const l2 = chain[chain.length - 1]; disc(ribbon, l2[0], l2[1] + 0.01 * H, 0.012 * H); fills.push([ribbon, col('band')]); }
      part(hfZ < -0.2 ? 2.9 : 4.15, zH, fills);
    }
  }
  if (wear.beard) part(hfZ > 0.35 ? 3.9 : 4.12, zH - 0.002, [[hullPath([hp([0, -0.36, 0.2], 0.19), hp([0, -0.52, 0.17], 0.15), hp([0.22, -0.26, 0.02], 0.13), hp([-0.22, -0.26, 0.02], 0.13)], null, 12), hairC]]);
  // hats
  const hatC = col('hat');
  if (wear.hat === 'brim' || wear.hat === 'tall') {
    const brimR = wear.hat === 'tall' ? 0.6 : 0.74, crownH = wear.hat === 'tall' ? 0.78 : 0.48;
    const ringPts = (y, rx, rz, n, rr) => { const a = []; for (let j = 0; j < n; j++) { const an = j * TAU / n; a.push(hp([Math.cos(an) * rx, y, Math.sin(an) * rz + 0.02], rr)); } return a; };
    const brim = hullPath(ringPts(0.3, brimR, brimR * 0.95, 18, 0.03), null, 4);
    const crown = hullPath([...ringPts(0.28, 0.42, 0.44, 10, 0.02), ...ringPts(0.28 + crownH, 0.37, 0.39, 10, 0.05)], null, 4);
    part(4.4, zH - 0.003, [[brim, hatC], [crown, hatC]]);
  } else if (wear.hat === 'cap') {
    part(4.4, zH - 0.003, [[hullPath([hp([0, 0.27, -0.04], 0.42), hp([0.24, 0.2, 0.4], 0.04), hp([-0.24, 0.2, 0.4], 0.04), hp([0, 0.18, 0.62], 0.05)], null, 10), hatC]]);
  } else if (wear.hat === 'bonnet' || wear.hat === 'kerchief') {
    // a hood over the crown and the back of the head (a bonnet's brim stands forward past the face);
    // the face is painted over it again when it is turned toward us
    const bon = wear.hat === 'bonnet';
    const capPts = bon ? [hp([0, 0.12, -0.18], 0.46), hp([0, -0.14, -0.34], 0.28), hp([0, 0.36, 0.2], 0.26), hp([0, 0.4, 0.5], 0.1), hp([0.38, 0.1, 0.42], 0.1), hp([-0.38, 0.1, 0.42], 0.1), hp([0.4, -0.2, 0.25], 0.12), hp([-0.4, -0.2, 0.25], 0.12)]
      : [hp([0, 0.14, -0.16], 0.45), hp([0, 0.34, 0.14], 0.24), hp([0, -0.12, -0.3], 0.25), hp([0.32, 0.06, 0.12], 0.16), hp([-0.32, 0.06, 0.12], 0.16)];
    part(4.25, zH, [[hullPath(capPts, null, 16), hatC]]);
    if (hfZ < 0.3) part(4.26, zH, [[hullPath([hp([0, -0.06, 0.16], 0.3), hp([0, -0.22, 0.12], 0.29), hp([0, -0.37, 0.17], 0.15), hp([0, -0.04, 0.43 - kid * 0.06], 0.075 - kid * 0.025)], null, 10), col('skin')]]);
    if (!bon) part(hfZ < -0.2 ? 3.9 : 4.31, zH, [[disc(new Path2D(), ...hp([0, -0.15, -0.45], 0.13)), hatC]]);
  }
  // shawl over the shoulders
  if (wear.shawl) {
    const sh = hullPath([circ(J.S[0], r.shoulder * 1.4), circ(J.S[1], r.shoulder * 1.4), circ(add(J.C, mv(Rc, [0, -0.13 * H, -0.045 * H])), 0.06 * H),
      circ(add(J.C, mv(Rc, [0, -0.09 * H, 0.05 * H])), 0.04 * H), circ(add(J.C, mv(Rc, [0, 0.03 * H, 0])), 0.045 * H)], null, 10);
    part(3.5, zC, [[sh, col('shawl')]]);
  }
  // ---- arms ----
  const sleeve = wear.top === 'coat' ? 'coat' : 'top';
  J.arms.forEach((a, i) => {
    const s = pr(add(a.S, [0, -0.012 * H, 0])), el = pr(a.E), w = pr(a.W);
    const far = s[2] > pr(J.arms[1 - i].S)[2] + 0.01;
    const up = new Path2D(), fo = new Path2D(), hd = new Path2D();
    taper(up, s[0], s[1], r.upper * 1.12, el[0], el[1], r.elbow);
    const rolled = wear.sleeves === 'rolled';
    taper(fo, el[0], el[1], r.elbow, w[0], w[1], r.wrist * (wear.top === 'coat' ? 1.25 : 1));
    // the hand: along the forearm
    const dir = norm(sub(a.W, a.E));
    const h1 = pr(madd(a.W, dir, 0.035 * H)), h2 = pr(madd(a.W, dir, 0.06 * H));
    if (a.hand === 'point') { hullPath([[w[0], w[1], r.wrist], [h1[0], h1[1], r.hand * 0.9]], hd, 8); const f2 = pr(madd(a.W, dir, 0.1 * H)); taper(hd, h1[0], h1[1], 0.009 * H, f2[0], f2[1], 0.006 * H); }
    else if (a.hand === 'fist') disc(hd, h1[0], h1[1], r.hand * 0.95);
    else hullPath([[w[0], w[1], r.wrist], [h1[0], h1[1], r.hand * 0.9], [h2[0], h2[1], r.hand * 0.55]], hd, 8);
    const zu = (s[2] + el[2]) / 2, zf = (el[2] + w[2]) / 2;
    const gU = zu > zC + 0.03 ? 1 : zu < zC - 0.06 && zu < zH ? 5 : 3.3;
    const gF = zf > zC + 0.03 ? 1 : zf < zC - 0.03 ? 5 : 3.3;
    const skin = col('skin', true);
    const foreFills = rolled ? [[fo, skin], [hd, skin]] : [[fo, col(sleeve, far)], [hd, skin]];
    if (gU === gF) {
      // one arm, one outline (no seam at the elbow)
      const whole = new Path2D(); whole.addPath(up); whole.addPath(fo); whole.addPath(hd);
      part(gF, Math.min(zu, zf), [[up, col(sleeve, far)], ...foreFills], gF > 4); parts[parts.length - 1].edgePath = whole;
      if (!far) parts[parts.length - 1].near = 1;
    } else {
      part(gU, zu, [[up, col(sleeve, far)]], gU > 4); if (!far) parts[parts.length - 1].near = 1;
      part(gF, zf - 0.001, foreFills, gF > 4); if (!far) parts[parts.length - 1].near = 1;
    }
    a.zf = zf; a.gF = gF; a.far = far;
  });
  // ---- held things ----
  if (o.hold) for (const [k, what] of Object.entries(o.hold)) {
    if (!what) continue;
    const i = k === 'l' ? 1 : 0, a = J.arms[i];
    const fills = propInHand(what, a, J, i, pr, H, col, e, o);
    if (fills) { part(fills.behind ? 1 : a.gF, a.zf - 0.002 + (fills.back ? 0.05 : 0), fills.list); if (!a.far) parts[parts.length - 1].near = 1; }
  }
  // ---- the order: back to front ----
  parts.sort((A, B) => (A.grp - B.grp) || (B.z - A.z));
  // shadow on the ground
  const shadowA = o.shadow ?? 0.32;
  if (shadowA > 0 && !lift) {
    const fx = J.legs.map(l => pr([l.A[0], 0, l.A[2]])[0]);
    const cx = (Math.min(...fx) + Math.max(...fx)) / 2, rx = (Math.max(...fx) - Math.min(...fx)) / 2 + 0.1 * H;
    const hy = Math.min(...J.legs.map(l => Math.min(l.heel[1], l.toe[1]))), k = clamp(1 - hy / (0.4 * H));
    const ry = rx * Math.max(0.1, view * 0.9);
    g.save(); g.translate(cx, oy); g.scale(1, ry / rx);
    const gr = g.createRadialGradient(0, 0, 0, 0, 0, rx);
    gr.addColorStop(0, `rgba(0,0,0,${shadowA * k})`); gr.addColorStop(0.6, `rgba(0,0,0,${shadowA * k * 0.55})`); gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr; g.beginPath(); g.arc(0, 0, rx, 0, TAU); g.fill(); g.restore();
  }
  // a child carried: painted between the body and the near arm (which holds it)
  if (body.child) {
    drawParts(g, e, parts.filter(p => !p.near), o);
    person(g, e, body.child);
    drawParts(g, e, parts.filter(p => p.near), { ...o, rim: o.rim });
  } else drawParts(g, e, parts, o);
  return body.info;
}
// all parts: once in the rim colour shifted toward the light, then the body over it
function drawParts(g, e, parts, o) {
  const A = o.alpha ?? 1, a0 = g.globalAlpha;
  // rim light: the silhouette once more in the light's colour, shifted toward the light; a second one from the other side
  for (const [rim, dir, width, alpha] of [[o.rim, o.rimDir ?? 180, o.rimWidth ?? 1.3, o.rimAlpha ?? 0.85], [o.rim2, o.rimDir2 ?? 0, o.rimWidth2 ?? 1, o.rimAlpha2 ?? 0.6]]) {
    if (!rim) continue;
    const ang = deg(dir), w = width * (e.px || 0.01);
    g.save(); g.translate(Math.cos(ang) * w, Math.sin(ang) * w); g.globalAlpha = a0 * A * alpha;
    g.fillStyle = g.strokeStyle = rim;
    for (const p of parts) for (const [path, , lw] of p.fills) { if (lw) { g.lineWidth = lw; g.stroke(path); } else g.fill(path); }
    g.restore();
  }
  const edgeW = 1.3 * (e.px || 0.01), edgeC = o.dark || DARK;
  g.globalAlpha = a0 * A;
  for (const p of parts) {
    if (p.edge) { g.strokeStyle = edgeC; g.lineWidth = edgeW; g.globalAlpha = a0 * A * 0.4; if (p.edgePath) g.stroke(p.edgePath); else for (const [path, , lw] of p.fills) if (!lw) g.stroke(path); g.globalAlpha = a0 * A; }
    for (const [path, cl, lw] of p.fills) {
      if (lw) { g.strokeStyle = cl; g.lineWidth = lw; g.lineCap = 'round'; g.stroke(path); } else { g.fillStyle = cl; g.fill(path); }
    }
  }
  g.globalAlpha = a0;
}

// ===== things in the hand, and on their own =====
const WOOD = '#5c4935', IRON = '#3b3a3a', FLAME = '#ffb24a', GLASS = '#ffd98e', CLOTH = '#7a6a52', PAPER = '#d8ccb0';
// a thing held: returns { list: [[path, colour, lineWidth?]] } in the person's element metres
function propInHand(what, a, J, i, pr, H, col, e, o) {
  const two = i === 'both' || (o.hold.both === what && i === 0);
  const W = pr(a.W), lag = J.lagHand[typeof i === 'number' ? i : 0], list = [];
  const glow = o.glow ?? 0.7, t = J.t;
  const dir = norm(sub(a.W, a.E)), hp = pr(madd(a.W, dir, 0.035 * H));
  const L = (x1, y1, x2, y2, w, c) => { const p = new Path2D(); p.moveTo(x1, y1); p.lineTo(x2, y2); list.push([p, c, w]); };
  const pole = (len, up, headFn) => {
    // a shaft: through both hands, or upright in one
    let x0, y0, x1, y1;
    if (two) {
      // its head on the ground ahead, the shaft up through the hands
      const A2 = J.arms[1].W, hi = A2[1] > a.W[1] ? A2 : a.W, lo = hi === A2 ? a.W : A2;
      const fw = mv(J.Rh, [0, 0, 1]), base = madd([J.P[0], 0.03, J.P[2]], fw, Math.max(0.5, len * 0.62));
      const tip = pr(base), top = pr(hi), dx = top[0] - tip[0], dy = top[1] - tip[1], dl = Math.hypot(dx, dy) || 1;
      x0 = top[0] + dx / dl * 0.25; y0 = top[1] + dy / dl * 0.25; x1 = tip[0]; y1 = tip[1];
    } else { x0 = hp[0] + lag[0] * 0.2; y0 = hp[1] - up; x1 = hp[0] - lag[0] * 0.1; y1 = hp[1] + (len - up); }
    L(x0, y0, x1, y1, 0.028, col(WOOD));
    // in two hands the head is on the ground; carried upright in one, it is up
    if (two) headFn(x0, y0, x1, y1); else headFn(x1, y1, x0, y0);
  };
  switch (what) {
    case 'lantern': {
      const L0 = 0.07, Lh = 0.2, wdt = 0.12;
      const ax = hp[0], ay = hp[1] + 0.02, dx = lag[0] * 1.6, dy = 1;
      const ang = Math.atan2(dx, dy);
      const p = new Path2D(), gl = new Path2D(), bail = new Path2D();
      const cx = ax + Math.sin(ang) * (L0 + Lh / 2), cy = ay + Math.cos(ang) * (L0 + Lh / 2);
      const R = (x, y) => [cx + x * Math.cos(ang) + y * Math.sin(ang), cy - x * Math.sin(ang) + y * Math.cos(ang)];
      const poly = (path, pts) => { pts.forEach(([x, y], j) => { const [X, Y] = R(x, y); j ? path.lineTo(X, Y) : path.moveTo(X, Y); }); path.closePath(); };
      poly(p, [[-wdt * 0.35, -Lh / 2 - 0.03], [wdt * 0.35, -Lh / 2 - 0.03], [wdt / 2, -Lh / 2 + 0.02], [wdt / 2, Lh / 2], [-wdt / 2, Lh / 2], [-wdt / 2, -Lh / 2 + 0.02]]);
      poly(gl, [[-wdt * 0.36, -Lh / 2 + 0.035], [wdt * 0.36, -Lh / 2 + 0.035], [wdt * 0.36, Lh / 2 - 0.025], [-wdt * 0.36, Lh / 2 - 0.025]]);
      bail.moveTo(ax, ay - 0.01); const [bx, by] = R(0, -Lh / 2 - 0.03); bail.lineTo(bx, by);
      list.push([bail, col(IRON), 0.012], [p, col(IRON)]);
      if (glow > 0) { list.push([gl, GLASS]); e.light && e.light(cx, cy, 1.4 + glow, '#ffc46a', 0.55 * glow); }
      return { list };
    }
    case 'torch': {
      const tip = pr(madd(a.W, norm(add(mul(dir, 0.5), [0, 1, 0])), 0.55));
      const bot = pr(madd(a.W, norm(add(mul(dir, 0.5), [0, 1, 0])), -0.12));
      L(bot[0], bot[1], tip[0], tip[1], 0.035, col(WOOD));
      if (glow > 0) {
        const f = new Path2D(), n1 = noise(t * 6, 1), n2 = noise(t * 7.3, 2), fh = 0.22 + 0.05 * n1;
        const fx = tip[0] - lag[0] * 0.8 + n2 * 0.015, fy = tip[1] - fh;
        f.moveTo(tip[0] - 0.05, tip[1]); f.quadraticCurveTo(tip[0] - 0.06, tip[1] - fh * 0.5, fx, fy); f.quadraticCurveTo(tip[0] + 0.06, tip[1] - fh * 0.45, tip[0] + 0.05, tip[1]); f.closePath();
        const core = new Path2D(); core.moveTo(tip[0] - 0.025, tip[1]); core.quadraticCurveTo(tip[0], tip[1] - fh * 0.6, (fx + tip[0]) / 2, fy + fh * 0.35); core.quadraticCurveTo(tip[0] + 0.03, tip[1] - fh * 0.3, tip[0] + 0.025, tip[1]); core.closePath();
        list.push([f, FLAME], [core, '#ffe6a8']);
        e.light && e.light(tip[0], tip[1] - 0.1, 2.2 * glow + 0.8, '#ff9a40', 0.7 * glow);
      }
      return { list };
    }
    case 'book': {
      const p = new Path2D(), c = hp, w2 = 0.09, h2 = 0.065, an = Math.atan2(dir[1], 1) * 0;
      p.moveTo(c[0] - w2, c[1] - h2); p.lineTo(c[0] + w2, c[1] - h2); p.lineTo(c[0] + w2, c[1] + h2); p.lineTo(c[0] - w2, c[1] + h2); p.closePath();
      list.push([p, col('#2a2622')]);
      return { list };
    }
    case 'open_book': {
      const p = new Path2D(), c = hp;
      p.moveTo(c[0] - 0.14, c[1] - 0.02); p.quadraticCurveTo(c[0] - 0.07, c[1] - 0.05, c[0], c[1] - 0.01); p.quadraticCurveTo(c[0] + 0.07, c[1] - 0.05, c[0] + 0.14, c[1] - 0.02);
      p.lineTo(c[0] + 0.14, c[1] + 0.02); p.quadraticCurveTo(c[0] + 0.07, c[1] - 0.01, c[0], c[1] + 0.03); p.quadraticCurveTo(c[0] - 0.07, c[1] - 0.01, c[0] - 0.14, c[1] + 0.02); p.closePath();
      list.push([p, col(PAPER)]);
      return { list };
    }
    case 'bow': {
      const p = new Path2D(), s = new Path2D(), Lb = 0.62, bend = 0.16 * Math.sign(-Math.cos(0) || 1);
      const fx = Math.sign(dir[2] || 1) * 0; // the bow stands upright in the fist
      const c = hp, k = (o.draw || 0);
      p.moveTo(c[0] - 0.02 * 0, c[1] - Lb); p.quadraticCurveTo(c[0] + 0.2, c[1], c[0], c[1] + Lb);
      list.push([p, col(WOOD), 0.025]);
      s.moveTo(c[0], c[1] - Lb); s.lineTo(c[0] - 0.02 - k * 0.3, c[1]); s.lineTo(c[0], c[1] + Lb);
      list.push([s, col('#8a8070'), 0.006]);
      return { list };
    }
    case 'bundle': {
      const p = new Path2D(), cx = hp[0] + lag[0] * 1.2, cy = hp[1] + 0.15;
      p.moveTo(hp[0] - 0.03, hp[1]); p.quadraticCurveTo(cx - 0.2, cy - 0.05, cx - 0.16, cy + 0.08); p.quadraticCurveTo(cx, cy + 0.16, cx + 0.16, cy + 0.08); p.quadraticCurveTo(cx + 0.2, cy - 0.05, hp[0] + 0.03, hp[1]); p.closePath();
      list.push([p, col(CLOTH)]);
      return { list };
    }
    case 'rake': pole(1.55, 0.95, (x0, y0, x1, y1) => {
      const ux = x1 - x0, uy = y1 - y0, l = Math.hypot(ux, uy), nx = -uy / l, ny = ux / l;
      const head = new Path2D(); head.moveTo(x1 - nx * 0.22, y1 - ny * 0.22); head.lineTo(x1 + nx * 0.22, y1 + ny * 0.22); list.push([head, col(WOOD), 0.03]);
      const teeth = new Path2D(); for (let j = -3; j <= 3; j++) { const bx = x1 + nx * j * 0.065, by = y1 + ny * j * 0.065; teeth.moveTo(bx, by); teeth.lineTo(bx + ux / l * 0.07, by + uy / l * 0.07); }
      list.push([teeth, col(WOOD), 0.012]);
    }); return { list };
    case 'pitchfork': pole(1.6, 1.0, (x0, y0, x1, y1) => {
      const ux = x1 - x0, uy = y1 - y0, l = Math.hypot(ux, uy), nx = -uy / l, ny = ux / l;
      const tips = new Path2D(); for (const j of [-1, 0, 1]) { const bx = x1 + nx * j * 0.05, by = y1 + ny * j * 0.05; tips.moveTo(x1, y1); tips.quadraticCurveTo(bx, by, bx + ux / l * 0.25, by + uy / l * 0.25); }
      list.push([tips, col(IRON), 0.014]);
    }); return { list };
    case 'staff': pole(1.4, 0.35, () => {}); return { list };
    case 'ladle': case 'spoon': {
      const Lh = what === 'ladle' ? 0.42 : 0.17, end = pr(madd(a.W, dir, Lh)), st = pr(madd(a.W, dir, -0.02));
      L(st[0], st[1], end[0], end[1], what === 'ladle' ? 0.018 : 0.01, col(what === 'ladle' ? WOOD : IRON));
      const bw = new Path2D(); disc(bw, end[0], end[1], what === 'ladle' ? 0.045 : 0.018); list.push([bw, col(what === 'ladle' ? WOOD : IRON)]);
      return { list };
    }
    case 'bowl': {
      const p = new Path2D(), c = hp; p.moveTo(c[0] - 0.09, c[1] - 0.03); p.quadraticCurveTo(c[0], c[1] + 0.09, c[0] + 0.09, c[1] - 0.03); p.closePath();
      list.push([p, col('#6a5640')]); return { list };
    }
    case 'shoe': {
      const p = new Path2D(), c = hp; p.moveTo(c[0] - 0.02, c[1]); p.lineTo(c[0] + 0.03, c[1] + 0.13); p.quadraticCurveTo(c[0] + 0.1, c[1] + 0.16, c[0] + 0.06, c[1] + 0.03); p.closePath();
      list.push([p, col('#262220')]); return { list };
    }
    case 'gun': {
      // a long gun along the forearm toward the other hand; o.fire 0…1: the flash and a puff of smoke
      // held in both hands (the other hand near, ahead of this one: aiming): along from this hand through the other;
      // else forward from the chest (tipped by aimPitch)
      const oW = J.arms[i ? 0 : 1].W, toO = sub(oW, a.W), dO = len(toO);
      const twoH = dO > 0.08 * H && dO < 0.55 * H && dot(toO, mv(J.Rc, [0, 0, 1])) > -0.02 * H;
      const ax = twoH ? norm(add(mul(toO, 1 / dO), [0, Math.sin((o.aimPitch || 0) * D2R), 0])) : norm(add(mv(J.Rc, [0, 0, 1]), [0, Math.sin((o.aimPitch || 0) * D2R), 0]));
      const back = pr(madd(a.W, ax, -0.22)), tipW = pr(madd(a.W, ax, 1.05));
      L(back[0], back[1], tipW[0], tipW[1], 0.035, col('#2c2622'));
      const fire = o.fire || 0;
      if (fire > 0) {
        const f = new Path2D(), r = 0.12 * fire; disc(f, tipW[0] + (tipW[0] - back[0]) * 0.08, tipW[1] + (tipW[1] - back[1]) * 0.08, r);
        list.push([f, FLAME]); e.light && e.light(tipW[0], tipW[1], 2.5 * fire, '#ffc070', 0.9 * fire);
      }
      if (o.smoke) { const sm0 = new Path2D(); for (let k = 0; k < 4; k++) disc(sm0, tipW[0] + (k * 0.09 + o.smoke * 0.3) * (tipW[0] > back[0] ? 1 : -1), tipW[1] - k * 0.05 - o.smoke * 0.2, 0.05 + 0.04 * k * o.smoke); list.push([sm0, `rgba(200,195,185,${0.35 * (1 - o.smoke)})`]); }
      return { list };
    }
    case 'hammer': {
      const end = pr(madd(a.W, dir, 0.3 * 0 + 0.0)), h = pr(madd(madd(a.W, dir, 0.04 * H), norm(perp([0, 1, 0], dir)), 0.0));
      const top = pr(madd(a.W, norm(add(dir, [0, 0.0, 0])), 0.34));
      const hd = norm(sub(a.W, a.E)), side = pr(madd(madd(a.W, hd, 0.34), norm(perp([0, 0, 1], hd, [0, 1, 0])), 0.07)), side2 = pr(madd(madd(a.W, hd, 0.34), norm(perp([0, 0, 1], hd, [0, 1, 0])), -0.07));
      L(hp[0], hp[1], top[0], top[1], 0.025, col(WOOD));
      L(side[0], side[1], side2[0], side2[1], 0.055, col(IRON));
      return { list };
    }
  }
  return null;
}
// a thing on its own (on the ground, leaning, hanging): kit.prop(g, e, 'lantern', { x, y, angle, glow, light, dark })
function prop(g, e, what, o = {}) {
  const x = o.x || 0, y = o.y || 0, an = deg(o.angle || 0);
  const col = colourer(o, { col: {} });
  g.save(); g.translate(x, y); g.rotate(an);
  const fake = { W: [0, 0, 0], E: [0, 0.3, 0] };
  const J = { lagHand: [[0, 0]], t: o.t ?? e.t ?? 0, arms: [fake, fake] };
  const pr = p => [p[0], -p[1], 0];
  const res = propInHand(what, fake, J, 0, pr, 1.7, col, e, { hold: {}, glow: o.glow ?? 0.7 });
  if (res) for (const [path, cl, lw] of res.list) { if (lw) { g.strokeStyle = cl; g.lineWidth = lw; g.lineCap = 'round'; g.stroke(path); } else { g.fillStyle = cl; g.fill(path); } }
  g.restore();
}

// ===== horses: a riding horse, a pony, the great-horses — legs driven by the way gone =====
// gaits: [phase offsets of LF, RF, LH, RH], duty (part of the stride a hoof is down), stride (× withers height)
const GAITS = {
  walk: { off: [0.25, 0.75, 0.0, 0.5], duty: 0.64, stride: 1.05, lift: 0.1 },
  trot: { off: [0.0, 0.5, 0.5, 0.0], duty: 0.44, stride: 1.55, lift: 0.18 },
  canter: { off: [0.55, 0.3, 0.0, 0.3], duty: 0.38, stride: 2.0, lift: 0.2 },
  gallop: { off: [0.45, 0.55, 0.0, 0.1], duty: 0.3, stride: 3.2, lift: 0.22 },
};
const HORSES = {
  horse: { Hw: 1.55, col: { coat: '#3b2b22', mane: '#1f1915', hoof: '#1c1816', feather: '#3b2b22', blaze: 0 }, heavy: 0 },
  pony: { Hw: 1.25, col: { coat: '#5a4636', mane: '#2b221b', hoof: '#1c1816', feather: '#5a4636' }, heavy: 0.1 },
  great: { Hw: 2.35, col: { coat: '#2f2925', mane: '#1d1916', hoof: '#1a1715', feather: '#4d463f' }, heavy: 1, feather: 1 },
};
function horseGait(s, Hw, force) {
  const k = Math.sqrt(Hw / 1.55);
  if (force && GAITS[force]) return force;
  return s < 2.1 * k ? 'walk' : s < 4.6 * k ? 'trot' : s < 8 * k ? 'canter' : 'gallop';
}
// kit.horse(g, e, { id, kind: horse | pony | great, x, y, at, face, light, dark, rim, rimDir, tint, pose: { graze, toss, rear, rest },
//   look, pack: true (panniers), rider: { who, ... person options } | [riders], col: { coat, mane } }) → { saddle, head, rump, ... }
// a horse moved to the frame's time `frame` (its own: o.t): its memory stepped — the way gone and its speed, the gait and
// its blend, the stride's phase, its turn, its poses, the mane and tail lagging —, its riders moved on it, its head
// marked (mark(x, y): its element's point) if o.mark, after its riders' — o.id names it
function stepHorse(o, frame, mark) {
  const t = o.t ?? frame, kind = HORSES[o.kind] ? o.kind : 'horse', B = HORSES[kind];
  const Hw = o.height || B.Hw, id = o.id;
  const now = t, [m, dt] = memory('h:' + id, now);
  const ox = o.x || 0, at = o.at || [ox, 0], pos = [at[0], at[1] || 0];
  const seed = strHash(id) % 997;
  // speed from where it has been (the same as people)
  const hist = m.hist || (m.hist = []);
  if (dt > 0) { hist.push([now, pos[0], pos[1]]); while (hist.length > 2 && now - hist[1][0] >= 0.25) hist.shift(); }
  const h0 = hist[0] || [now, pos[0], pos[1]], sp = now - h0[0];
  const vRaw = sp > 0.04 ? Math.hypot(pos[0] - h0[1], pos[1] - h0[2]) / sp : 0;
  // turning on the spot it steps round too (the turn counts as way gone)
  const s = spring(m, 'v', Math.max(vRaw, Math.abs(m.f?.v || 0) * 0.5 * Hw), 4, 1, dt);
  const gname = horseGait(s, Hw, o.gait), G0 = GAITS[gname];
  // gait changes blend over a moment
  const gw = m.gait === gname ? spring(m, 'gw', 1, 6, 1, dt) : ((m.gait = gname), (m.gw = { x: 0, v: 0 }), 0);
  const prev = m.prev || gname, prevG = GAITS[prev];
  if (gw > 0.98) m.prev = gname;
  const stride = mix(prevG.stride, G0.stride, gw) * Hw * (B.heavy ? 0.85 : 1);
  m.ph = ((m.ph || hash(seed, 3)) + s * dt / stride) % 1;
  const ph = m.ph, move = sm2(s, 0.04, 0.45);
  const faceT = deg(o.face ?? 90), fh = springA(m, 'f', faceT, 3.5, 1, dt), fhead = springA(m, 'fh', faceT, 6, 0.8, dt);
  // poses
  const pw = name => spring(m, 'p:' + name, clamp(o.pose?.[name] ?? (o.pose === name ? 1 : 0)), 7, 0.7, dt);
  const graze = pw('graze'), toss = pw('toss'), rear = pw('rear'), rest = pw('rest');
  const S = { t, B, Hw, seed, s, gname, prev, gw, stride, ph, move, fh, fhead, graze, toss, rear, rest };
  const F = horseFrame(o, S);
  S.lagM = clamp(dangle(m, 'mane', pos[0], 0, 6, 0.3, dt)[0], -0.1, 0.1) * 0.5;
  S.lagT = dangle(m, 'tail', pos[0] + F.pr(F.bodyP([0, 0.9 * Hw, -0.68 * Hw]))[0] - ox, -(0.9 * Hw + F.bob), 4, 0.25, dt);
  // its riders, on it — in the saddle, behind it, in a pannier (basket: 'near' | 'far'): their options as painted
  const riders = (!o.rider ? [] : Array.isArray(o.rider) ? o.rider : [o.rider]).map((r, k) => {
    const Bk = r.basket && F.baskets[r.basket];
    const p = Bk ? [Bk.q[0], Bk.q[1] + 0.05 * Hw] : k === 0 ? F.saddle : F.behind, p3 = Bk ? [0, Bk.c0[1] - 0.05 * Hw] : k === 0 ? F.saddle3 : F.behind3;
    if (Bk) r = { pose: 'sit_ground', ...r };
    return { face: o.face ?? 90, pose: 'ride', t, id: id + ':rider' + k, who: 'man', ...r, x: p[0], y: p[1], at: [pos[0] + p[0] - ox, pos[1]], lift: p3[1], still: true, shadow: 0, light: r.light ?? o.light, dark: r.dark ?? o.dark, rim: r.rim ?? o.rim, rimDir: o.rimDir, tint: o.tint, view: F.view };
  });
  const out = riders.map(r => stepPerson(r, frame, mark).info), P2 = p => { const q = F.pr(p); return [q[0], q[1]]; };
  const info = { basket: [F.bq[0], F.bq[1]], saddle: [F.saddle[0], F.saddle[1]], pillion: [F.behind[0], F.behind[1]], head: P2(F.bodyP(lerp3(F.poll, F.muzzle, 0.4))), rump: P2(F.bodyP([0, 0.9 * Hw, -0.62 * Hw])), gait: gname, speed: s, riders: out };
  if (o.mark) mark(info.head[0], info.head[1]);
  const body = { now: frame, o, S, riders, info };
  BODIES.set('h:' + id, body);
  return body;
}
// a horse as it is now (S: what stepHorse keeps): its hooves, body, neck and head, as seen (pr: body frame → element
// metres), the saddle and the pillion, the panniers' places (o.pack), the near one's mouth
function horseFrame(o, S) {
  const { t, Hw, seed, gname, prev, gw, stride, ph, move, fh, fhead, graze, toss, rear, rest } = S, G0 = GAITS[gname], prevG = GAITS[prev];
  const ox = o.x || 0, oy = o.y || 0;
  // ---- the legs: hooves on the ground in stance, swinging forward otherwise ----
  const roots = [[0.1, 0.6, 0.44], [-0.1, 0.6, 0.44], [0.11, 0.62, -0.47], [-0.11, 0.62, -0.47]].map(v => mul(v, Hw));
  const legPos = (G, i) => {
    const u = (ph + G.off[i] + 1) % 1, S = G.duty * stride, front = i < 2;
    if (u < G.duty) { const k = u / G.duty; return { z: S * (0.5 - k), y: 0, u: k, stance: 1 }; }
    const k = (u - G.duty) / (1 - G.duty), e2 = sm(k);
    return { z: -S / 2 + S * e2, y: G.lift * Hw * Math.sin(PI * k) * (front ? 1.1 : 0.8), u: k, stance: 0 };
  };
  const hooves = roots.map((r0, i) => {
    const a = legPos(G0, i), b = legPos(prevG, i), w = gw;
    let z = mix(b.z, a.z, w) * move, y = mix(b.y, a.y, w) * move;
    // standing: one hind hoof rests on its toe now and then
    const resting = i === 3 && (rest > 0.01 || held(t, 0.05, seed) > 0.5) ? (1 - move) : 0;
    y += resting * 0.04 * Hw; z += resting * 0.06 * Hw;
    return { p: [r0[0] * 0.9, y + 0.035 * Hw, r0[2] + z], fold: mix(b.u, a.u, w) * (1 - (a.stance ? 1 : 0)), stance: a.stance, resting };
  });
  // ---- the body: bob and pitch with the gait; breathing; rearing ----
  const cyc = TAU * ph;
  const bob = move * Hw * (gname === 'walk' ? 0.008 * Math.cos(2 * cyc) : gname === 'trot' ? 0.03 * Math.abs(Math.cos(TAU * ph)) : 0.03 * Math.sin(cyc));
  const pitch = move * (gname === 'canter' || gname === 'gallop' ? 0.08 * Math.sin(cyc + 0.6) : 0.01 * Math.sin(2 * cyc)) - rear * 0.75;
  const breath = Math.sin(t * 1.3 + seed) * 0.004 * Hw;
  const R = rotX(pitch), hip = [0, 0.66 * Hw, -0.5 * Hw];
  const bodyP = v => { let q = [v[0], v[1] + bob + breath * (v[1] > 0.6 * Hw ? 1 : 0), v[2]]; if (Math.abs(pitch) > 1e-4) q = add(hip, mv(R, sub(q, hip))); if (rear > 0) q[1] += rear * 0.0; return q; };
  // the neck and head: nodding with the walk, down to graze, tossed
  const nod = move * (gname === 'walk' ? 0.08 * Math.sin(2 * cyc + 0.8) : gname === 'trot' ? 0.03 * Math.sin(2 * cyc) : 0.14 * Math.sin(cyc + 1.4));
  const idleHead = (1 - move) * held(t, 0.15, seed + 2) * 0.12;
  const tossA = toss * Math.sin(t * 7) * 0.5 * Math.max(0, Math.sin(t * 2.1));
  const neckA = 0.85 - 1.25 * graze + nod + idleHead + tossA - rear * 0.35; // radians, up from horizontal
  const headYaw = clamp((fhead - fh) * 1.2, -0.6, 0.6) + (1 - move) * held(t, 0.12, seed + 5) * 0.25 * (1 - graze);
  const nb = [0, 0.84 * Hw, 0.46 * Hw], nl = 0.6 * Hw;
  const neckDir = [Math.sin(headYaw) * -Math.cos(neckA) * 0, Math.sin(neckA), Math.cos(neckA)];
  const Ry = rotY(headYaw);
  const poll = add(nb, mv(Ry, mul(neckDir, nl)));
  const headA = neckA - 1.85 - toss * 0.3 + graze * 0.55; // the head hangs down from the poll
  const muzzle = add(poll, mv(Ry, [0, Math.sin(headA) * 0.5 * Hw, Math.cos(headA) * 0.5 * Hw]));
  // ---- projection ----
  const c = Math.cos(fh), sn = Math.sin(fh), view = o.view ?? 0.14;
  const pr = p => { const X = -p[0] * c + p[2] * sn, Z = -p[0] * sn - p[2] * c; return [ox + X, oy - p[1] - Z * view * (1 - p[1] / 1.7), Z]; };
  const circ = (p, r) => { const q = pr(p); return [q[0], q[1], r]; };
  const zB = pr(bodyP([0, 0.75 * Hw, 0]))[2];
  const saddle3 = bodyP([0, 0.98 * Hw, 0.08 * Hw]), saddle = pr(saddle3), behind3 = bodyP([0, 0.99 * Hw, -0.2 * Hw]), behind = pr(behind3);
  const baskets = {};
  if (o.pack) [1, -1].forEach(sd => { const c0 = bodyP([sd * 0.27 * Hw, 0.8 * Hw, -0.12 * Hw]), q = pr(c0); baskets[q[2] > zB ? 'far' : 'near'] = { q, c0 }; });
  const nearSide = Math.sin(fh) > 0 ? 1 : -1, bq = pr(bodyP([nearSide * 0.27 * Hw * (Math.abs(sn) > 0.3 ? 1 : 0), 0.97 * Hw, -0.12 * Hw]));
  return { roots, hooves, bob, bodyP, neckA, nb, Ry, poll, headA, muzzle, sn, view, pr, circ, zB, saddle3, saddle, behind3, behind, baskets, bq };
}
// a horse painted as moved this frame, with the options it was moved with — over them what its element gives now
function horse(g, e, given = {}) {
  if (!given) return null; // (its people entry gave null: not there now)
  const kind = HORSES[given.kind] ? given.kind : 'horse', id = given.id ?? e.id ?? kind, b = BODIES.get('h:' + id), now = e.t;
  if (!b) { e.warn(`horse "${id}" is painted but not moved: give it to kit.chrysalids.move(people, f) in the lib's beforeFrame (horse: true)`); return null; }
  if (b.now !== now) e.warn(`horse "${id}" was not moved this frame (kit.chrysalids.move in the lib's beforeFrame): painted as it was`);
  const o = { ...b.o, ...given }, { t, B, Hw, seed, gname, move, rear, lagM, lagT } = b.S, oy = o.y || 0;
  const { roots, hooves, bodyP, neckA, nb, Ry, poll, headA, muzzle, sn, view, pr, circ, zB, baskets: hung } = horseFrame(o, b.S);
  const col = (() => { const P = { col: { ...B.col, ...(o.col || {}) } }; return colourer(o, P); })();
  const parts = [], part = (grp, z, fills) => parts.push({ grp, z, fills });
  const coat = col('coat'), coatFar = col('coat', true), maneC = col('mane'), hoofC = col('hoof');
  // body
  // the body as three masses (forehand, barrel, quarters): their union keeps the dip of the back and the tuck of the belly
  const masses = [
    [[0, 0.79, 0.53, 0.16], [0, 0.63, 0.42, 0.14], [0, 0.91, 0.3, 0.115], [0.07, 0.62, 0.42, 0.12], [-0.07, 0.62, 0.42, 0.12], [0, 0.78, 0.25, 0.17]],
    [[0, 0.84, 0.05, 0.13], [0, 0.73, 0.1, 0.19], [0, 0.68, -0.08, 0.17], [0, 0.78, -0.25, 0.14], [0, 0.71, 0.25, 0.17]],
    [[0, 0.875, -0.42, 0.13], [0, 0.79, -0.53, 0.18], [0, 0.72, -0.63, 0.13], [0.06, 0.6, -0.48, 0.12], [-0.06, 0.6, -0.48, 0.12], [0, 0.74, -0.33, 0.15]],
  ];
  const body = new Path2D(), kb = B.heavy ? 1.06 : 1;
  for (const ms of masses) hullPath(ms.map(([x, y, z, r]) => circ(bodyP([x * Hw, y * Hw, z * Hw]), r * Hw * kb)), body, 24);
  part(3, zB, [[body, coat]]);
  // neck, head, ears, mane
  // the neck: thick at the shoulder, arched along the crest
  const arch = (u) => add(lerp3(nb, poll, u), mv(Ry, [0, Math.sin(PI * u) * 0.06 * Hw * Math.cos(neckA), -Math.sin(PI * u) * 0.04 * Hw]));
  const neckPts = [], NP = 6, thick = B.heavy ? 1.12 : 1;
  for (let j = 0; j <= NP; j++) { const u = j / NP; neckPts.push(circ(bodyP(arch(u)), mix(0.2, 0.07, Math.pow(u, 0.8)) * Hw * thick)); }
  neckPts.push(circ(bodyP(add(nb, [0, -0.1 * Hw, 0.06 * Hw])), 0.17 * Hw * thick));
  const neck = hullPath(neckPts, null, 10);
  const hd = norm(sub(muzzle, poll)), hup = mv(Ry, [0, Math.cos(headA), -Math.sin(headA)]);
  const hpt = (a, b) => bodyP(add(poll, add(mul(hd, a * Hw), mul(hup, b * Hw))));
  const headP = hullPath([circ(hpt(0, 0), 0.07 * Hw), circ(hpt(0.13, -0.03), 0.105 * Hw), circ(hpt(0.36, 0.02), 0.065 * Hw), circ(hpt(0.47, -0.005), 0.06 * Hw), circ(hpt(0.08, 0.05), 0.06 * Hw)], null, 10);
  const ears = new Path2D();
  [1, -1].forEach(sd => { const b0 = pr(bodyP(add(poll, mv(Ry, [sd * 0.03 * Hw, 0.03 * Hw, -0.01 * Hw])))), tip = pr(bodyP(add(poll, mv(Ry, [sd * 0.04 * Hw, 0.12 * Hw, -0.02 * Hw])))); taper(ears, b0[0], b0[1], 0.025 * Hw, tip[0], tip[1], 0.007 * Hw); });
  // the mane: a strip along the crest, stirring
  const mane = new Path2D();
  let mp = null;
  for (let j = 0; j <= 7; j++) {
    const u = 0.04 + 0.92 * j / 7, q = bodyP(arch(u)), rr = mix(0.2, 0.07, Math.pow(u, 0.8)) * Hw * thick;
    const cn = mv(Ry, [0, Math.cos(neckA), -Math.sin(neckA)]), top = pr(add(q, mul(cn, rr * 0.9))), cc = [top[0] + noise(t * 0.7 + j * 0.6, seed) * 0.006 * Hw - lagM * u, top[1], 0.03 * Hw];
    if (mp) taper(mane, ...mp, ...cc); mp = cc;
  }
  const zN = pr(bodyP(lerp3(nb, poll, 0.5)))[2];
  part(3.5, zN, [[neck, coat], [mane, maneC], [headP, coat], [ears, coat]]);
  // tail: hangs and lags, swishes
  const tail = new Path2D(), troot = bodyP([0, 0.93 * Hw, -0.66 * Hw]);
  let prev = circ(troot, 0.04 * Hw);
  const swish = (1 - move * 0.5) * (noise(t * 0.9, seed + 9) * 0.6 + Math.max(0, held(t, 0.2, seed + 4)) * Math.sin(t * 6) * 0.5);
  for (let j = 1; j <= 5; j++) {
    const u = j / 5, base = add(troot, [swish * 0.08 * Hw * u * u, -0.5 * Hw * u, -0.06 * Hw * u - move * 0.18 * Hw * u * (gname === 'walk' ? 0.3 : 1)]);
    const q = pr(base), cc = [q[0] - lagT[0] * u * u * 1.6, q[1] - Math.abs(lagT[0]) * u * 0.8, mix(0.04, 0.075, u) * Hw];
    taper(tail, prev[0], prev[1], prev[2], cc[0], cc[1], cc[2]); prev = cc;
  }
  part(2.9, pr(troot)[2] + 0.001, [[tail, maneC]]);
  // legs: upper limb, knee/hock, cannon, fetlock, hoof (IK), the far side darker
  roots.forEach((r0, i) => {
    const front = i < 2, hv = hooves[i], root = bodyP(r0);
    let fet = hv.p;
    if (front && rear > 0.01) { const tuck = bodyP(add(r0, [0, -0.36 * Hw, 0.14 * Hw])); fet = lerp3(fet, tuck, sm(rear)); }
    const lu = (front ? 0.275 : 0.3) * Hw, ll = (front ? 0.265 : 0.285) * Hw;
    const pole = front ? [0, 0, 1] : [0, 0, -1];
    const [knee, f2] = ik3(root, [fet[0], fet[1] + 0.045 * Hw, fet[2]], lu, ll, pole);
    // the hoof folds back as the leg lifts
    const fold = front ? Math.sin(PI * hv.fold) * move : Math.sin(PI * hv.fold) * move * 0.6;
    const hoof = [f2[0], f2[1] - 0.06 * Hw * (1 - fold), f2[2] - 0.05 * Hw * fold - 0.01 * Hw];
    const far = pr(root)[2] > zB;
    const lg = new Path2D(), hf = new Path2D();
    const P0 = pr(root), P1 = pr(knee), P2 = pr(f2), P3 = pr(hoof);
    taper(lg, P0[0], P0[1], 0.1 * Hw, P1[0], P1[1], 0.045 * Hw);
    taper(lg, P1[0], P1[1], 0.045 * Hw, P2[0], P2[1], 0.033 * Hw);
    taper(lg, P2[0], P2[1], 0.036 * Hw, P3[0], P3[1], 0.03 * Hw);
    hullPath([[P3[0], P3[1], 0.036 * Hw], [P3[0] + 0.01 * Hw * (front ? 1 : 1) * Math.sign(sn || 1), P3[1] + 0.025 * Hw, 0.035 * Hw]], hf, 8);
    const fills = [[lg, far ? coatFar : coat], [hf, hoofC]];
    if (B.feather) { const fe = new Path2D(), mid = lerp3(knee, f2, 0.55), M2 = pr(mid); hullPath([[M2[0], M2[1], 0.03 * Hw], [P2[0], P2[1] + 0.02 * Hw, 0.05 * Hw], [P3[0] - 0.03 * Hw, P3[1] + 0.035 * Hw, 0.03 * Hw], [P3[0] + 0.03 * Hw, P3[1] + 0.035 * Hw, 0.03 * Hw]], fe, 8); fills.splice(1, 0, [fe, col('feather', far)]); }
    part(far ? 2 : 4, pr(root)[2], fills);
  });
  // panniers (the great-horses carry baskets)
  const baskets = {};
  for (const [side, { q, c0 }] of Object.entries(hung)) {
    const w = 0.2 * Hw, h = 0.17 * Hw;
    const bp = hullPath([[q[0] - w, q[1] - h, 0.03 * Hw], [q[0] + w, q[1] - h, 0.03 * Hw], [q[0] + w * 0.8, q[1] + h, 0.06 * Hw], [q[0] - w * 0.8, q[1] + h, 0.06 * Hw]], null, 8);
    const rim = new Path2D(); rim.moveTo(q[0] - w - 0.02 * Hw, q[1] - h); rim.lineTo(q[0] + w + 0.02 * Hw, q[1] - h);
    const far = side === 'far', fills = [[bp, col('#5e5038', far)], [rim, col('#4a3f2c', far), 0.03 * Hw]];
    baskets[side] = { q, c0, fills };
    part(far ? 2.5 : 4.5, q[2], fills);
  }
  parts.sort((A, Bp) => (A.grp - Bp.grp) || (Bp.z - A.z));
  // shadow
  const shA = o.shadow ?? 0.3;
  if (shA > 0) {
    const rx = 0.75 * Hw * Math.max(0.35, Math.abs(sn)) + 0.15 * Hw, ry = rx * Math.max(0.08, view * 0.6), cx = pr([0, 0, -0.05 * Hw])[0];
    g.save(); g.translate(cx, oy); g.scale(1, ry / rx);
    const gr = g.createRadialGradient(0, 0, 0, 0, 0, rx); gr.addColorStop(0, `rgba(0,0,0,${shA})`); gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr; g.beginPath(); g.arc(0, 0, rx, 0, TAU); g.fill(); g.restore();
  }
  // riders: their far leg goes behind the horse, the rest over it; one in the near pannier behind its wall
  const riders = b.riders, side = Math.abs(sn) > 0.45;
  riders.forEach(r => { if (r.basket === 'far') person(g, e, r); });
  if (side) riders.forEach(r => { if (!r.basket) person(g, e, { ...r, only: 'far' }); });
  drawParts(g, e, parts.filter(p => !(baskets.near && p.fills === baskets.near.fills)), o);
  riders.forEach(r => { if (r.basket === 'near') person(g, e, r); });
  if (baskets.near) drawParts(g, e, [{ fills: baskets.near.fills }], o);
  riders.forEach(r => { if (!r.basket) person(g, e, { ...r, only: side ? 'near' : null }); });
  return b.info;
}

// ===== what the kit offers =====
// in water up to `water` metres above the feet: what is under the surface dark and faint, rings round the body
function personInWater(g, e, given = {}) {
  const m = moved(e, given);
  if (!m) return null;
  const o = m.o;
  if (!o.water) return paintPerson(g, e, o, m.b);
  const oy = o.y || 0, yS = oy - o.water, ox = o.x || 0, t = o.t ?? e.t ?? 0;
  g.save(); g.beginPath(); g.rect(ox - 30, yS, 60, 30); g.clip();
  person(g, e, { ...o, alpha: (o.alpha ?? 1) * (o.underAlpha ?? 0.35), shadow: 0, light: 0.04, dark: o.underDark || '#0e1418', rim: null, rim2: null });
  g.restore();
  g.save(); g.beginPath(); g.rect(ox - 30, yS - 30, 60, 30); g.clip();
  const r = person(g, e, { ...o, shadow: 0 });
  g.restore();
  // rings: flattened ellipses spreading slowly from the body
  const cx = r.hip[0], vw = Math.max(0.08, o.view ?? 0.14) * 0.5;
  g.save(); g.strokeStyle = o.ringColor || 'rgba(220,225,230,0.35)'; g.lineWidth = (e.px || 0.01) * 1.2;
  for (let k = 0; k < 3; k++) { const u = ((t * 0.4 + k / 3) % 1), rx = 0.18 + u * 0.5; g.globalAlpha = (1 - u) * 0.8; g.beginPath(); g.ellipse(cx, yS, rx, rx * vw, 0, 0, TAU); g.stroke(); }
  g.restore();
  return r;
}
const kit = {
  person: personInWater, prop,
  horse: typeof horse === 'function' ? horse : null,
  // the scene's people moved to this frame, from the lib's beforeFrame: beforeFrame: f => kit.chrysalids.move(people, f).
  // people: { key: (e, got) => a figure's options (a horse's with horse: true), a list of them (each with its own id), or
  // null (not there now) } — what an element paints, kit.chrysalids.person(g, e, lib.people.<key>(e)): f has what e has
  // (t, state, was, speed). The key is its element's id (its id, unless o.id; the point its head marks, unless o.el names
  // the element). In their order, each worked out once those before it are moved — got: where they are ({ key: their
  // info }, as person() returns it; one whose hand goes to another's point reads it there, or from kit.point). → got
  move(people, f) {
    const got = {};
    for (const [key, of] of Object.entries(people)) {
      const one = o => {
        const el = o.el ?? key;
        return (o.horse ? stepHorse : stepPerson)({ ...o, id: o.id ?? key }, f.t, (x, y) => f.at(el, x, y)).info;
      };
      const os = of(f, got);
      if (Array.isArray(os)) got[key] = os.map(o => o && one(o)); else if (os) got[key] = one(os);
    }
    return got;
  },
  // another figure's point (moved this frame, or the last if it is moved after), for a hand: hand: { r: kit.point('emily', 'shoulder_l') }
  point(id, name) { const w = WHERE.get(id); return w && w[name] ? { world: w[name] } : null; },
  // a crowd is never in step: a steady per-person delay (seconds) and a state value seen that much later
  late: (id, max = 0.6) => hash(strHash(id), 5) * max,
  delayed: (e, key, id, max = 0.6) => e.was(key, hash(strHash(id), 5) * max),
  // poses: the library (add your own: kit.poses.my_pose = {...}), the cast (people by name)
  poses: MOTIONS, styles: STYLES, cast: CAST, held, ease: anim.ease,
  // which way (face degrees) someone at (a, d) looks toward (a2, d2): across → 90 / -90, toward the viewer → 0
  faceToward: (a, d, a2, d2) => Math.atan2(a2 - a, -(d2 - d)) / D2R,
  // for scripts: walk someone to a place at a natural pace — turn toward it first (head, then body), then go, easing in
  // and out; keys { a, d, f } name its state values (across, distance, face). Returns the seconds it takes.
  // kit.walkTo(scene, { a: 'david_a', d: 'david_d', f: 'david_face' }, [2, 7], { speed: 1.2, delay: 0, faceEnd: 0 })
  // along a path of points [[a, d], …] at a steady walk (eased at the ends only); returns the seconds it takes
  walkPath(scene, keys, pts, o = {}) {
    const v = o.speed || 1.2, a0 = scene.get(keys.a) ?? 0, d0 = keys.d ? scene.get(keys.d) ?? 0 : 0, P = [[a0, d0], ...pts];
    const segs = []; let L = 0; for (let i = 1; i < P.length; i++) { const l = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); segs.push(l); L += l; }
    const T = L / v + 0.8, delay = o.delay || 0;
    const ease = anim.ease.inOut;
    const go = () => {
      const start = scene.time;
      if (keys.f && P.length > 1) scene.turn(keys.f, Math.atan2(P[1][0] - P[0][0], -(P[1][1] - P[0][1])) / D2R, 0.4);
      const tick = () => {
        const u = clamp((scene.time - start) / T), s = ease(u) * L; let acc = 0;
        for (let i = 0; i < segs.length; i++) {
          if (s <= acc + segs[i] || i === segs.length - 1) {
            const k = segs[i] ? clamp((s - acc) / segs[i]) : 1, A = P[i], B = P[i + 1];
            scene.set(keys.a, A[0] + (B[0] - A[0]) * k); if (keys.d) scene.set(keys.d, A[1] + (B[1] - A[1]) * k);
            if (keys.f && segs[i] > 0.05) { const want = Math.atan2(B[0] - A[0], -(B[1] - A[1])) / D2R, cur = scene.get(keys.f) ?? want; if (Math.abs(((want - cur + 540) % 360) - 180) > 2) scene.turn(keys.f, want, 0.35); }
            break;
          }
          acc += segs[i];
        }
        if (u < 1) scene.after(0.04, tick); else if (keys.f && o.faceEnd != null) scene.turn(keys.f, o.faceEnd, 0.7);
      };
      tick();
    };
    if (delay > 0) scene.after(delay, go); else go();
    return delay + T;
  },
  walkTo(scene, keys, to, o = {}) {
    const a0 = scene.get(keys.a) ?? 0, d0 = keys.d ? scene.get(keys.d) ?? 0 : 0, a1 = to[0], d1 = to[1] ?? d0;
    const dist = Math.hypot(a1 - a0, d1 - d0), v = o.seconds ? dist / o.seconds * 1.4 : o.speed || 1.2, run = v > 2;
    const dur = o.seconds || Math.max(0.6, dist / v * (run ? 1.25 : 1.4)), lead = o.turn ?? 0.45, delay = o.delay || 0;
    const go = () => {
      if (keys.f && dist > 0.05) scene.turn(keys.f, Math.atan2(a1 - a0, -(d1 - d0)) / D2R, lead, 'smooth');
      scene.after(lead * 0.6, () => { scene.set(keys.a, a1, dur, 'inOut'); if (keys.d) scene.set(keys.d, d1, dur, 'inOut'); });
      if (keys.f && o.faceEnd != null) scene.after(lead * 0.6 + dur - 0.2, () => scene.turn(keys.f, o.faceEnd, 0.7, 'smooth'));
    };
    if (delay > 0) scene.after(delay, go); else go();
    return delay + lead * 0.6 + dur + (o.faceEnd != null ? 0.5 : 0);
  },
};
return kit;
