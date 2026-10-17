// ===== «Падение дома Ашеров» — the world's people: the narrator, Roderick, Madeline, the doctor, the valet, the horse, their things =====
// The body of function (anim, data) returning the kit; data = ushers.data.json (recorded motion).
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
// a colour made translucent
const alpha = (c, a) => c.replace('rgb(', 'rgba(').replace(')', `,${a})`);
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
// a stain soaking into cloth: a ragged blot of overlapping discs, a run below it
function blot(path, x, y, r, seed) {
  disc(path, x, y, r * 0.7);
  for (let i = 0; i < 6; i++) { const a = hash(i, seed) * TAU, k = 0.45 + 0.5 * hash(i, seed + 9); disc(path, x + Math.cos(a) * r * k, y + Math.sin(a) * r * k * 0.8, r * (0.22 + 0.3 * hash(i, seed + 17))); }
  taper(path, x, y + r * 0.4, r * 0.28, x + r * 0.15, y + r * 2.4, r * 0.08);
}
function disc(path, x, y, r) { path.moveTo(x + r, y); path.arc(x, y, r, 0, TAU); path.closePath(); return path; }

// ===== recorded motion (moood/dev/mocap: python export.py ushers; sources and licences: ushers.md) =====
const MOCAP = data;

// ===== the cast: builds, clothes, colours (daylight colours; the scene's light mixes them toward its dark) =====
// H — height (m); heads — heads tall; legs — hip joint height / H; sh — shoulder joints apart / H; hipw — hip joints apart / H;
// girth — thickness; belly, bust 0…1; posture — the torso's carriage (deg, + stooped), chin (deg, + down) — over its style's;
// face — [width, length] of the face; pallor — how pale the face and hands stay in the dark (0…1); wear — what they wear; col — colours; gait — how they move.
const BASE = {
  style: 'neutral', H: 1.75, heads: 7.2, legs: 0.53, sh: 0.215, hipw: 0.1, girth: 1, belly: 0, bust: 0, posture: 0, chin: 0, neck: 1, sex: 'm',
  face: [1, 1], pallor: 0,
  wear: { top: 'shirt', coat: 0, skirt: 0, cape: 0, hat: 0, hair: 'short', beard: 0, shirt: 0, glasses: 0, barefoot: 0, blood: 0 },
  col: { skin: '#b88d6e', hair: '#3b2c22', top: '#6b6558', bottom: '#2c2a2a', coat: '#3a3833', skirt: '#4f4a44', hat: '#1e1c1e', boots: '#1e1b1a', shirt: '#d8d4cc', blood: '#5a0f12' },
  gait: { energy: 1, stride: 1, swing: 1, heavy: 0 },
};
// Roderick and Madeline are twins: the same face (narrow and long), the same ash-silver hair, the same pallor
const TWIN = { face: [0.9, 1.1], col: { skin: '#e4dfd6', hair: '#c9c6bd' } };
const CAST = {
  // the narrator (the player): ~30, tall and lean, dark-brown hair; a long charcoal greatcoat, dark trousers, boots.
  // Outdoors: wear: { cape: 1, hat: 'top' } (the greatcoat's short shoulder cape and a top hat)
  narrator: { H: 1.83, heads: 7.5, legs: 0.535, sh: 0.215, girth: 0.92, wear: { top: 'coat', coat: 0.82, hair: 'short', shirt: 1 },
    col: { coat: '#2e2f33', hair: '#3a2a20', bottom: '#232327', hat: '#151417' }, gait: { energy: 1, swing: 0.85 } },
  // Roderick Usher: very tall and thin, stooped; cadaverous pale, long silky ash-silver hair floating round the face;
  // a deep wine-black dressing gown over a white shirt, a loose cravat. Furtive.
  roderick: { style: 'followed', H: 1.88, heads: 7.6, legs: 0.54, sh: 0.2, hipw: 0.095, girth: 0.8, posture: 8, chin: -2, neck: 1.15, pallor: 0.62, ...TWIN,
    wear: { top: 'coat', coat: 0.92, hair: 'float', shirt: 1 }, col: { ...TWIN.col, coat: '#2c1218', bottom: '#1c1517', boots: '#151213' },
    gait: { energy: 0.95, swing: 0.7, heavy: 0 } },
  // the lady Madeline: his twin — the same face, softer; very pale, thin; the same hair, long and loose; a long
  // white-grey night gown, barefoot. Walks slowly as if half asleep. At the end: wear: { blood: 1 } (torn, stained).
  madeline: { style: 'sleepwalk', H: 1.66, heads: 7.0, legs: 0.53, sh: 0.19, hipw: 0.1, girth: 0.78, bust: 0.35, sex: 'f', posture: -3, chin: -4, neck: 1.1, pallor: 0.66, ...TWIN,
    wear: { top: 'dress', skirt: 1, hair: 'loose', barefoot: 1 }, col: { ...TWIN.col, top: '#c4c2bb', skirt: '#c4c2bb' },
    gait: { energy: 0.8, swing: 0.3, stride: 0.85 } },
  // the doctor: ~55, stout; a black frock coat, grey side-whiskers, spectacles; carries his bag (hold: { r: 'bag' })
  doctor: { style: 'proud', H: 1.7, heads: 7.0, legs: 0.51, sh: 0.22, hipw: 0.11, girth: 1.18, belly: 0.8, posture: -2,
    wear: { top: 'coat', coat: 0.55, hair: 'short', beard: 'whiskers', shirt: 1, glasses: 1 }, col: { coat: '#1b1a1e', bottom: '#232226', hair: '#8e8a84', skin: '#c49a82' },
    gait: { energy: 0.88, swing: 0.6, stride: 0.9, heavy: 0.6 } },
  // the valet: silent, grey-haired, in dark livery; stealthy steps
  valet: { style: 'dark', H: 1.74, heads: 7.3, legs: 0.53, sh: 0.205, girth: 0.88, posture: 6, chin: -4,
    wear: { top: 'coat', coat: 0.45, hair: 'short', shirt: 1 }, col: { coat: '#24232b', bottom: '#1f1e24', hair: '#a8a49c' },
    gait: { energy: 0.9, swing: 0.6 } },
};
function castOf(who, over) {
  const c = CAST[who] || CAST.narrator;
  const P = { ...BASE, ...c, wear: { ...BASE.wear, ...c.wear }, col: { ...BASE.col, ...c.col }, gait: { ...BASE.gait, ...c.gait } };
  if (over) {
    for (const k of Object.keys(over)) {
      if (k === 'wear' || k === 'col' || k === 'gait') P[k] = { ...P[k], ...over[k] }; else P[k] = over[k];
    }
  }
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
  d.upper = 0.186 * H; d.fore = 0.15 * H;
  d.foot = 0.135 * H;
  d.sw = P.sh * H * 0.86; d.hw = P.hipw * H;
  const g = P.girth;
  d.r = {
    thigh: 0.062 * H * g * (P.sex === 'f' ? 1.06 : 1), knee: 0.04 * H * g, calf: 0.042 * H * g, ankle: 0.026 * H * g,
    shoulder: 0.046 * H * g, upper: 0.034 * H * g, elbow: 0.028 * H * g, wrist: 0.022 * H * g, hand: 0.019 * H,
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

// ---- frames made by hand (what no recording has: riding, lying, the drawn gestures): the angle language ----
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
  if (ps.ground === 'saddle') y = 0.1;
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
// A pose: lean (torso bows forward, deg), side (leans to its right), twist (shoulders turn left), head [pitch down, yaw left, roll],
// shrug (shoulders up, ×H), drop (knees bend: the pelvis lowered, ×leg), pitch (the whole body tips forward: 90 face down, −90 on its back),
// arm / armR / armL: [flex (forward from hanging), abd (out to the side), elbow, twist (forearm toward the middle)] in degrees,
//   or { at: [ref, dx, dy, dz] (×H; ref: chest | head | hip; dx toward its own side), pole: [x, y, z] (where the elbow goes) },
// leg / legR / legL (the pose owns the legs): [flex (thigh forward from straight down), abd, knee, ankle (toes pointed)],
// ground: low (the lowest point rests on the ground) | seat (sits at the seat's height) | saddle (hangs at the anchor),
// hand / handR / handL: open | point | fist. A function (u, P, tempo) gives a pose that moves: u — its cycle (cycles: { name: u }
// from the scene, or the figure's seconds × the pose's rate), tempo — cycles a second now.
const DOWN = [6, 5, 14, 12];
const cyc1 = u => ((u % 1) + 1) % 1;
// the guitar across the lap (the pelvis frame, metres): the body's centre over the right thigh, the face toward the front
// and up a little, the neck up to the left; across the strings (strum)
const GUITAR = (() => { const face = norm([0.1, 0.35, 0.93]), neck = norm([-0.85, 0.45, -0.08]);
  return { body: [0.07, 0.17, 0.27], face, neck, strum: norm([face[1] * neck[2] - face[2] * neck[1], face[2] * neck[0] - face[0] * neck[2], face[0] * neck[1] - face[1] * neck[0]]) }; })();
const onNeck = k => add(GUITAR.body, mul(GUITAR.neck, k));
// the strumming cycle: the hand high at n, across the strings (down) at n + 0.25, low at n + 0.5, back up
const strum = u => Math.cos(TAU * cyc1(u));
const POSES = {
  // ---- on the ground ----
  kneel: { legs: 1, ground: 'low', lean: 2, head: [8, 0, 0], leg: [2, 6, 92, 86], arm: DOWN },
  lie: { legs: 1, ground: 'low', pitch: -90, head: [0, 0, 0], leg: [4, 6, 8, 20], arm: [8, 14, 12, 0] },
  lie_face: { legs: 1, ground: 'low', pitch: 90, head: [-30, 0, 0], leg: [-4, 6, 6, 80], arm: [160, 30, 40, 0] },
  ride: { legs: 1, ground: 'saddle', lean: 5, head: [2, 0, 0], leg: [52, 30, 74, -12], arm: { at: ['hip', 0.05, 0.16, 0.24], pole: [0.6, -1, -0.4] }, hand: 'fist' },
  // ---- gestures (the legs keep walking, standing or sitting) ----
  reach: { lean: 12, shrug: 0.012, head: [-4, 0, 0], armR: [96, 8, 6, 0], handR: 'open' },
  point: { lean: 2, armR: [88, 10, 3, 0], handR: 'point' },
  offer: { lean: 6, head: [8, 0, 0], arm: [62, 6, 26, 0], hand: 'open' },
  // a hand given and shaken (aim it at the other's hand: hand: { r: K.point(id, 'hand_r') })
  handshake: u => ({ lean: 5, head: [6, 0, 0], armR: { at: ['chest', 0.03, -0.19 + 0.012 * Math.sin(TAU * 2 * u), 0.26], pole: [0.8, -1, -0.2] }, handR: 'open' }),
  // leading someone by the hand: a little ahead and leaning into the way, the arm back to the one led
  lead: { lean: 9, head: [-2, 0, 0], armR: [-28, 14, 10, 0], handR: 'open' },
  // pulled by the hand and resisting: leaning back, the knees giving, the arm drawn out straight, the face turned away
  pulled: { lean: -15, drop: 0.035, head: [12, 28, -4], armR: [64, 6, 4, 0], handR: 'open', armL: { at: ['chest', -0.02, -0.04, 0.11], pole: [0.5, -1, 0] }, handL: 'fist' },
  // holding someone's hand side by side, walking or standing (aim it at theirs): the arm low and a little out
  hold_hand: { armR: [14, 14, 12, 0], handR: 'open' },
  // shrinking from a light (at its right): the near hand shields the eyes, the head and shoulders turn away, the body draws in
  flinch: { lean: 12, side: -5, twist: 18, shrug: 0.022, drop: 0.04, head: [16, 46, -10], armR: { at: ['head', 0.07, 0.03, 0.1], pole: [1, -0.2, 0.3] }, handR: 'open',
    armL: { at: ['chest', 0.03, -0.05, 0.1], pole: [0.5, -1, 0] }, handL: 'fist' },
  // a fist knocking on a door ahead (~0.3 H): drawn back, the blow lands at n + 0.6, a small rebound, a rest
  knock: u => { const p = cyc1(u);
    const k = p < 0.5 ? sm(p / 0.5) : p < 0.6 ? 1 - Math.pow((p - 0.5) / 0.1, 2) : p < 0.72 ? 0.15 * Math.sin(PI * (p - 0.6) / 0.12) : 0;
    return { lean: 5 - 3 * k, head: [4, 0, 0], armR: { at: ['chest', 0.05, 0.03 + 0.03 * k, 0.29 - 0.09 * k], pole: [1, -0.6, -0.3] }, handR: 'fist' }; },
  // bent over a coffin's lid turning a screwdriver (hold: { r: 'screwdriver' }): a half turn of the wrist, the elbow rising
  // with it, a regrip; the other hand steadies the lid. The n-th turn ends at n + 0.5
  screw: u => { const p = cyc1(u), k = p < 0.5 ? sm(p / 0.5) : 1 - sm((p - 0.5) / 0.5);
    return { lean: 38, head: [28, 0, 0], drop: 0.05, armR: { at: ['hip', 0.03 + 0.015 * k, -0.07, 0.31], pole: [0.3 + 1.2 * k, -0.9, 0.2] }, handR: 'fist',
      armL: { at: ['hip', -0.03, -0.075, 0.33], pole: [0.8, -1, 0] }, handL: 'open' }; },
  // the guitar in the lap (seated: with sit; hold: { r: 'guitar' }): the right hand strums over the sound hole
  // (cycles: { play_guitar: n } — the n-th stroke crosses the strings at n + 0.25), the left hand on the neck shifting now and
  // then; the faster the strumming, the more the head and body go with it (frantic at ≥ 4 strokes a second)
  play_guitar: (u, P, tempo) => { const s = strum(u), f = clamp((tempo - 1.5) / 3), slide = 0.36 + 0.05 * Math.round(held(u * 0.4, 0.5, 11) * 2);
    const H = P.H, hole = add(add(onNeck(0.06), mul(GUITAR.face, 0.05)), mul(GUITAR.strum, 0.045 * s)), fret = add(onNeck(slide), mul(GUITAR.face, -0.01));
    return { lean: 3 + 8 * f + 4 * f * s, twist: -4, head: [12 + 8 * f * s, 20 * (1 - f), 4 + 4 * f * Math.sin(PI * u)],
      armR: { at: ['hip', hole[0] / H, hole[1] / H, hole[2] / H], pole: [1, -0.3, -0.6] }, handR: 'open',
      armL: { at: ['hip', -fret[0] / H, fret[1] / H, fret[2] / H], pole: [0.4, -1, -0.2] }, handL: 'fist' }; },
  // rocking to and fro (seated, a layer over sit): once a cycle
  rock: u => { const k = 0.5 - 0.5 * Math.cos(TAU * u); return { lean: 2 + 16 * k, head: [10 - 6 * k, 0, 0] }; },
  // a light held before one (a candle, the lamp), or raised high
  carry_light: { lean: -2, armR: [30, 10, 82, 12], handR: 'fist' },
  raise: { lean: -4, head: [-12, 0, 0], armR: [150, 14, 24, 0], handR: 'fist' },
  // an open book in both hands, read aloud: the head down to the page, the eyes up now and then
  read: u => ({ lean: 4, head: [26 - 14 * Math.max(0, held(u, 0.18, 5)), 0, 0], arm: { at: ['chest', 0.045, -0.1, 0.2], pole: [0.6, -1, 0] }, hand: 'open' }),
  // carrying a coffin's front end behind one (the hands down and back at the hips; aim them at its handles)
  carry_behind: { lean: 6, head: [2, 0, 0], arm: { at: ['hip', 0.1, -0.06, -0.13], pole: [0.5, -0.2, 1] }, hand: 'fist' },
  // clinging to someone (round the neck: aim the hands at their shoulders), falling onto them: the body forward, the knees giving
  fall_on: { lean: 22, drop: 0.1, head: [14, 20, 10], arm: { at: ['chest', 0.03, 0.1, 0.2], pole: [1, -0.4, -0.2] }, hand: 'open' },
  // catching someone who falls onto one: the arms round them, borne back, the knees giving
  catch: { lean: -10, drop: 0.06, head: [16, -14, -6], arm: { at: ['chest', 0.01, -0.05, 0.22], pole: [1, -0.3, -0.3] }, hand: 'open' },
  // bent over someone lying (a coffin): a layer over kneel1 / kneel, a hand going to them
  over: { lean: 34, head: [26, 0, 0], armR: { at: ['hip', 0.06, -0.02, 0.42], pole: [0.6, -1, 0] }, handR: 'open' },
  head_hands: { lean: 10, head: [16, 0, 0], shrug: 0.012, arm: { at: ['head', 0.075, 0.015, 0.0], pole: [1, -0.4, 0.4] }, hand: 'open' },
  hands_behind: { lean: 2, arm: { at: ['hip', 0.015, 0.07, -0.1], pole: [0.6, -1, -0.6] } },
  arms_folded: { lean: -2, arm: { at: ['chest', -0.045, -0.065, 0.09], pole: [1, -0.6, 0.3] } },
  slump: { lean: 12, head: [32, 0, 4], shrug: -0.012, drop: 0.02, arm: [2, 3, 8, 0] },
  look_up: { lean: -6, head: [-34, 0, 0] },
};
// the drawn cycles' own pace when the scene gives no cycle (cycles a second)
const RATE = { handshake: 1, knock: 2.6, screw: 0.9, play_guitar: 2, rock: 0.55, read: 1 };

// ===== the motion library: walking styles and named poses / actions =====
// Styles: recorded walk and run cycles and a standing idle (100STYLE). Missing ones fall back on neutral.
const STYLES = {
  neutral: { walk: 'walk_Neutral', run: 'run_Neutral', idle: 'idle_Neutral' },
  proud: { walk: 'walk_Proud', idle: 'idle_Proud' },
  sleepwalk: { walk: 'walk_Neutral', idle: 'idle_Neutral' },
  dark: { walk: 'walk_InTheDark' },
  followed: { walk: 'walk_Followed', run: 'run_Followed' },
};
// A pose of the angle language → a layer: angled arms and legs become a hand-made frame under a mask (only the limbs it
// names), `at` hands become IK targets, lean / side / twist / head / shrug / drop become additive.
function layerOf(ps) {
  const def = {}, mask = {};
  const armAng = k => Array.isArray(ps[k] || ps.arm) ? (ps[k] || ps.arm) : null, armAt = k => { const a = ps[k] || ps.arm; return a && !Array.isArray(a) ? a : null; };
  if (ps.legs) Object.assign(mask, MASKS.full);
  if (armAng('armR')) mask.armR = 1;
  if (armAng('armL')) mask.armL = 1;
  if (Object.keys(mask).length) { def.frame = ps; def.mask = mask; }
  const atR = armAt('armR'), atL = armAt('armL');
  if (atR || atL) { def.at = { r: atR?.at, l: atL?.at }; def.pole = { r: atR?.pole, l: atL?.pole }; }
  if (!ps.legs && (ps.lean || ps.side || ps.twist || ps.head || ps.shrug || ps.drop)) def.add = { lean: ps.lean || 0, side: ps.side || 0, twist: ps.twist || 0, head: ps.head || [0, 0, 0], shrug: ps.shrug || 0, drop: ps.drop || 0 };
  const hr = ps.handR || ps.hand, hl = ps.handL || ps.hand;
  if (hr || hl) def.hand = { r: hr, l: hl };
  if (ps.ground) def.ground = ps.ground;
  return def;
}
const MOTIONS = {};
for (const [k, v] of Object.entries(POSES)) MOTIONS[k] = typeof v === 'function' ? { fn: v, rate: RATE[k] || 1 } : layerOf(v);
// a shake of the head, on top of anything
MOTIONS.shake = { cycAdd: u => [4, 32 * Math.sin(u * 7), 6 * Math.sin(u * 7)] };
// recorded poses and actions (their clips' own segments: in → hold → out)
const KNEEL_SEG = { in: [4, 52], hold: [54, 99], out: [101, 146] };
const UPPER_NO_LEGS = { torso: 1, head: 1, armR: 1, armL: 1 };
const RECORDED = {
  // sits down on a chair and stands up again (Mixamo): the pelvis over `at` throughout (the recording's way back onto
  // the seat left out) — `at` is the seat
  sit: { clip: 'mx_sit', mask: 'full', seat: 1, inPlace: true },
  // one knee down; the recording's held stretch ends before he starts to rise (frame 101): held, he stays down
  kneel1: { clip: 'm_kneel1', seg: KNEEL_SEG, mask: { root: 1, legR: 1, legL: 1, torso: 0.6, head: 0.5 }, add: { lean: -22, head: [-12, 0, 0] } },
  talk: { clip: 'm_talk', mask: { armR: 1, armL: 1, torso: 0.5, head: 0.5 }, holdRate: 1 },
  hand_shoulder: { clip: 'm_shoulder', mask: { armR: 1, torso: 0.4, head: 0.6 } },
  // weeping, the face in the hands: the recording's body (Mixamo), both palms over the face (the wrists at the chin),
  // the head bowed, the shoulders hunched and shaking with sobs
  weep: { clip: 'mx_weep', mask: UPPER_NO_LEGS, holdRate: 0.8, sob: 1, add: { lean: 6, head: [16, 0, 0], shrug: 0.014 },
    at: { r: ['head', 0.022, -0.075, 0.062], l: ['head', 0.022, -0.075, 0.062] }, pole: { r: [0.35, -1, 0.1], l: [0.35, -1, 0.1] }, hand: { r: 'open', l: 'open' } },
  // a nod (the held stretch nods on, slowly)
  nod: { clip: 'mx_nod', mask: { head: 1, torso: 0.3 }, holdRate: 1 },
  // a bow from the waist (the valet)
  // a valet's bow from the waist (the recording's shallow bow, deepened)
  bow: { clip: 'mx_bow', mask: { root: 1, torso: 1, head: 1, armR: 1, armL: 1 }, add: { lean: 22 } },
  // the arms holding a weight before one, the back taking it (a coffin's end: aim the hands at its handles)
  carry: { clip: 'mx_carry', mask: { armR: 1, armL: 1, torso: 0.6 }, holdRate: 0.5 },
  // wounded, swaying, clutching, reaching out — the upper body of a dying walk over one's own slow steps
  stagger: { clip: 'mx_dying', mask: UPPER_NO_LEGS, holdRate: 0.7 },
  // falling dead: forward (the knees go, onto the face) and backward (onto the back) — the weight 0 → 1 plays the fall
  collapse: { clip: 'mx_fall_forward', mask: 'full' },
  fall_back: { clip: 'mx_fall_back', mask: 'full' },
};
Object.assign(MOTIONS, RECORDED);

// ===== the feet: a step planner driven by the way gone (feet never slide) =====
// World ground coordinates: X across (m, right +), Z depth (m, away +). The body faces φ (rad): 0 toward the viewer, +90° right.
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
  const target = (i, tLand) => {
    const ahead = gp.T * (2 - gp.sigma) / 2, tp = Math.max(0, tLand - t);
    const r = rightW(face), w = gp.width * (i ? -1 : 1);
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
      L.k = (off(0) >= off(1) ? 0 : 1) + 2; L.tk = t; L.Tk = gp.T; L.settled = false;
      startSwing(L.k % 2, t, gp.sigma * L.Tk);
    }
  } else {
    // the step clock: a new step every Tk; the swinging foot is k % 2. A step quickens when the body speeds up
    // (and comes now if the standing foot is left too far behind); a foot in the air hurries down likewise
    const Tnow = gp.T;
    if (Tnow < L.Tk) L.Tk = Math.max(t - L.tk, Tnow);
    const nf = L.feet[(L.k + 1) % 2];
    if (!nf.air && Math.hypot(nf.x - pos[0], nf.z - pos[1]) > d.hip * 0.5) L.Tk = Math.min(L.Tk, t - L.tk);
    for (const f of L.feet) if (f.air) { const want = gp.sigma * Tnow; if (want < f.dur) f.dur = Math.min(f.dur, Math.max(t - f.t0 + 0.03, want)); }
    let guard = 0;
    while (t >= L.tk + L.Tk && guard++ < 8) {
      const anyAir = L.feet.some(f => f.air && t < f.t0 + f.dur);
      if (s < 0.06 && !anyAir && off(0) < d.hw * 0.3 && off(1) < d.hw * 0.3) { L.settled = true; break; }
      L.tk += L.Tk; L.k++; L.Tk = gp.T;
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
        y = f.liftH * hu;
        // heel-and-toe: pushed off on the toe, swung, the toe up as the heel comes down
        pitch = (u < 0.3 ? mix(32, 0, sm(u / 0.3)) : mix(0, -14, sm((u - 0.3) / 0.7))) * D2R * mix(1, 0.6, L.runW);
      }
    }
    if (!f.air) {
      const since = t - f.land;
      pitch = -14 * D2R * (1 - sm(since / 0.12)) * (since < 0.2 ? 1 : 0) * mix(1, 0.3, L.runW);
      // the heel rises before this foot lifts
      if (!L.settled && s > 0.12) {
        let tl = L.tk + L.Tk; if ((L.k + 1) % 2 !== i) tl += gp.T;
        const pre = tl - t, win = 0.32 * L.Tk;
        if (pre < win && pre > 0) pitch += 30 * D2R * sm(1 - pre / win);
      }
    }
    out.push({ x, z, y, pitch, air: f.air, u, land: f.land });
  }
  return { feet: out, s, acc: L.acc, runW: L.runW, settled: L.settled, k: L.k, tk: L.tk, Tk: L.Tk, vx: L.vx, vz: L.vz };
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
  return add(J.C, mv(J.Rc, v));
}
// the style's clips: walk and run cycles, an idle loop (falling back on the neutral ones)
function styleClips(name) {
  const st = STYLES[name] || STYLES.neutral, nt = STYLES.neutral;
  return { walk: clipOf(st.walk || nt.walk), run: clipOf(st.run || nt.run), idle: clipOf(st.idle || nt.idle) };
}
// one pose's frame now: a recorded transition played by its weight, a held stretch kept alive in time — or a frame
// made by hand
function poseFrame(def, p, t, o, m, out) {
  if (def.frame) { out.set(def._f || (def._f = makeFrame(def.frame))); if (def.mirror) out.set(mirrorFrame(out)); return out; }
  const c = clipOf(def.clip); if (!c) return null;
  const fps = c.fps, sg = def.seg || c.seg, w = clamp(p.u ?? p.w), mk = m['ph:' + def.clip] || (m['ph:' + def.clip] = { hold0: t });
  let x;
  if (w >= 0.999) {
    // held: back and forth through the held stretch, slowly — alive, not frozen
    const [a, b] = sg.hold || [sg.in[1], sg.in[1]], L = Math.max(1, b - a), sp = (def.holdRate || 0.6) * fps;
    const k = ((t - mk.hold0) * sp) % (2 * L); x = a + (k < L ? k : 2 * L - k);
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
  if (def.mirror) out.set(mirrorFrame(out));
  return out;
}
function poseDef(name, own) {
  const mir = name.endsWith(':l'), bn = mir ? name.slice(0, -2) : name;
  const base = own && own[bn] ? (own[bn]._d || (own[bn]._d = typeof own[bn] === 'function' ? { fn: own[bn] } : own[bn].clip ? own[bn] : layerOf(own[bn]))) : MOTIONS[bn];
  if (!base) return null;
  if (!mir) return base;
  const key = '_m';
  return base[key] || (base[key] = { ...base, mirror: !base.mirror, at: base.at && { r: base.at.l, l: base.at.r }, pole: base.pole && { r: base.pole.l, l: base.pole.r }, mask: base.mask === 'armR' ? 'armL' : base.mask === 'armL' ? 'armR' : base.mask && typeof base.mask === 'object' ? { ...base.mask, armR: base.mask.armL || 0, armL: base.mask.armR || 0 } : base.mask, hand: base.hand && { r: base.hand.l, l: base.hand.r } });
}

// each figure's own clock: it stops while the figure is frozen (o.frozen — catalepsy: no breath, no idle, the cloth still)
// and goes on from there when it thaws, with a deep breath
const CLOCK = new Map();
const BREATH = 1.6;                                   // the breath back to life (s)
function clockOf(id, T, frozen) {
  let c = CLOCK.get(id);
  if (!c || T < c.last - 0.5) { c = { off: 0, since: null, thaw: -9 }; CLOCK.set(id, c); }
  c.last = T;
  if (frozen) { if (c.since == null) c.since = T; return { t: c.since - c.off, thaw: 9 }; }
  if (c.since != null) { c.off += T - c.since; c.since = null; c.thaw = T - c.off; }
  const t = T - c.off;
  return { t, thaw: t - c.thaw };
}
// a pose given as a name, [[name, weight]…] or { name: weight } → { name: weight }
const poseMap = p => !p ? {} : typeof p === 'string' ? { [p]: 1 } : Array.isArray(p) ? Object.fromEntries(p) : p;
// ===== each figure as it is now: moved once a frame (kit.move — the lib's beforeFrame), painted as moved =====
// id → { now: the frame's time it was moved at, o: its options, P, J, X: its body, info: its points } ('h:' + id: a horse)
const BODIES = new Map();
// a person moved to the frame's time `frame` (its own clock: o.t; frozen, stopped): its memory stepped, its body rebuilt,
// where its points are (info, WHERE) — and its head marked (mark(x, y): its element's point) if o.mark
function stepPerson(o, frame, mark) {
  const who = o.who || 'narrator', id = o.id;
  const { t, thaw } = clockOf(id, o.t ?? frame, o.frozen);
  const build = o.wear ? { ...o.build, wear: { ...o.build?.wear, ...o.wear } } : o.build;
  const ck = who + '|' + (build ? JSON.stringify(build) : '');
  let P = CASTS.get(ck);
  if (!P) { P = castOf(who, build); CASTS.set(ck, P); }
  const d = P.d, H = P.H, hu = d.hu, G = P.gait, seed = strHash(id);
  const now = t;
  let [m, dt] = memory('p:' + id, now);
  const ox = o.x || 0, oy = o.y || 0, at = o.at || [ox, 0], pos = [at[0], at[1] || 0];
  if (dt === 0 && !o.frozen && !m.fresh && m.lastPos && !o.only && Math.hypot(pos[0] - m.lastPos[0], pos[1] - m.lastPos[1]) > 0.4 && !m.warned) {
    m.warned = true; (globalThis.__mooodErrors = globalThis.__mooodErrors || []).push(`kit: two figures share the id "${id}" — give each its own id`);
  }
  // a cut (a jump of more than a metre at once): it starts fresh there, its cloth and hair at rest
  if (dt > 0 && m.lastPos && Math.hypot(pos[0] - m.lastPos[0], pos[1] - m.lastPos[1]) > 1) { for (const k of Object.keys(m)) delete m[k]; m.t = now; m.fresh = true; dt = 0; }
  m.lastPos = pos;
  const seedF = seed % 997;
  // ---- the poses asked for, each weight springing (a little past, and settling) ----
  const list = [];
  const raw = Object.entries(poseMap(o.pose));
  const springy = o.springy !== false && !m.fresh, seen = new Set();
  // a recorded action plays at its own pace (never faster than ~1.3× the recording) following the asked weight:
  // the scene's slow ease scrubs it, a jump plays it
  // Poses made from the same recording share its progress: going from one to the other
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
  const anchored = list.some(p => p.def.ground === 'saddle') && legW > 0.5;

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
  // the arms swing as much as the gait's swing (the rest of the way they hang as standing)
  const walkMask = { ...MASKS.full, armR: G.swing, armL: G.swing };
  for (const [cl, ws] of sc) {
    const f = newFrame();
    sampleClip(cl.idle, (t * idleRate + idleOff) * cl.idle.fps, f, true);
    if (moving > 0) {
      blendFrame(f, sampleClip(cl.walk, phaseOf(cl.walk) * cl.walk.n, tmp, true), walkMask, moving * (1 - runW));
      if (runW > 0) blendFrame(f, sampleClip(cl.run, phaseOf(cl.run) * cl.run.n, tmp, true), MASKS.full, moving * runW);
    }
    if (first) { base.set(f); first = false; } else blendFrame(base, f, MASKS.full, ws / (ws + 1e-9));
  }
  // ---- the poses, layer by layer, each through its mask ----
  const add0 = { lean: P.posture, side: 0, twist: 0, head: [P.chin, 0, 0], shrug: 0, drop: 0 }, targets = [[], []], hands = [null, null];
  // poses on one recording blend its one frame once, through their masks joined by their weights (no dip between)
  const joined = {};
  for (const p of list) if (p.grp) { const k = p.def.clip + (p.def.mirror ? '|m' : ''), mk = maskOf(p.def), J = joined[k] || (joined[k] = { mask: {}, w: 0, done: false });
    for (const gname of GN) J.mask[gname] = clamp((J.mask[gname] || 0) + (mk[gname] || 0) * p.grp); J.w = Math.max(J.w, clamp(p.u * 5)); }
  for (const p of list) {
    // a pose that moves by itself (a drawn cycle) is made afresh each frame
    if (p.def.fn) {
      // its cycle: the scene's, or the figure's own time at the pose's pace; tempo — how fast the cycle goes now
      const cyc = o.cycles?.[p.name.replace(/:l$/, '')], u = cyc != null ? cyc : t * p.def.rate + seedF * 0.37;
      const ck = 'c:' + p.name, tempo = m[ck] != null && dt > 0 ? spring(m, 'ct:' + p.name, (u - m[ck]) / dt, 3, 1, dt) : (m['ct:' + p.name]?.x ?? p.def.rate);
      m[ck] = u;
      const d0 = layerOf(p.def.fn(u, P, tempo)); if (p.def.mirror) { d0.mirror = true; if (d0.at) d0.at = { r: d0.at.l, l: d0.at.r }; if (d0.pole) d0.pole = { r: d0.pole.l, l: d0.pole.r }; } p.def = d0; }
    const def = p.def, mk = maskOf(def);
    if (def.clip || def.frame) {
      const f = poseFrame(def, p, t + seedF * 0.37, o, m, newFrame());
      // the recording comes in over the first part of the weight (its own transition plays the rest)
      const J = p.grp && joined[def.clip + (def.mirror ? '|m' : '')];
      if (f && J) { if (!J.done) { J.done = true; blendFrame(base, f, J.mask, J.w); } }
      else if (f) blendFrame(base, f, mk, clamp(p.w));
    }
    // a recording's own leanings go with its progress (the way down and up), a drawn pose's with its weight
    if (def.add) { const sg = def.mirror ? -1 : 1, aw = p.u != null ? Math.min(p.w, p.u) : p.w; add0.lean += (def.add.lean || 0) * aw; add0.shrug += (def.add.shrug || 0) * aw; add0.drop += (def.add.drop || 0) * aw; add0.side += sg * (def.add.side || 0) * aw; add0.twist += sg * (def.add.twist || 0) * aw; if (def.add.head) { add0.head[0] += def.add.head[0] * aw; add0.head[1] += sg * def.add.head[1] * aw; add0.head[2] += sg * def.add.head[2] * aw; } }
    // sobs: the shoulders jerk up and the chest heaves in bursts
    if (def.sob) { const k = p.w * Math.max(0, held(t, 0.5, seedF + 21)) * (0.5 + 0.5 * Math.sin(t * 8.5)); add0.shrug += 0.008 * k; add0.lean += 2.5 * k; add0.head[0] += 3 * k; }
    if (def.cycAdd) { const a = def.cycAdd(t + seedF * 0.37); for (let j = 0; j < 3; j++) add0.head[j] += (a[j] || 0) * p.w; }
    // a later layer that moves an arm takes it from the hand targets laid before it
    for (const [i, g0] of [[0, 'armR'], [1, 'armL']]) { const k = (mk[g0] || 0) * clamp(p.w); if (k > 0 && (def.clip || def.frame)) for (const tg of targets[i]) tg[2] *= 1 - k; }
    if (def.at) for (const [i, k] of [[0, 'r'], [1, 'l']]) if (def.at[k]) targets[i].push([def.at[k], Array.isArray(def.pole) ? def.pole : def.pole?.[k], clamp(p.w)]);
    if (def.hand) for (const [i, k] of [[0, 'r'], [1, 'l']]) if (def.hand[k] && p.w > 0.4) hands[i] = def.hand[k];
  }
  // breathing where a pose holds the whole body (seated, kneeling): the idle that breathes standing is under it
  if (legW > 0.01) { const b = Math.sin(TAU * t / 4.2 + seedF); add0.shrug += 0.003 * b * legW; add0.lean += 0.8 * b * legW; add0.head[0] += 1.5 * held(t, 0.12, seedF + 31) * legW; }
  // coming back to life after a freeze: a deep breath (the chest rises and opens, the head lifts)
  if (thaw < BREATH) { const b = Math.sin(PI * clamp(thaw / BREATH)); add0.shrug += 0.014 * b; add0.lean -= 7 * b; add0.head[0] -= 9 * b; }
  // trembling (fear, a hand that shakes after the guitar): fine fast shakes of the head and the hands
  const tr = clamp(o.tremble || 0);
  if (tr) { add0.head[0] += 2.5 * tr * noise(t * 9, seedF + 1); add0.head[1] += 2.5 * tr * noise(t * 8, seedF + 2); }
  // ---- the body rebuilt from the frame with its own lengths ----
  const legLen = d.thigh + d.shin;
  const Rp = frameFU(vecOf(base, 'pF'), vecOf(base, 'pU'));
  let Pl = [base[0] * legLen, base[1] * legLen, base[2] * legLen];
  if (anchored) { const g0 = list.find(p => p.def.ground)?.def.ground; Pl = [Pl[0], g0 === 'saddle' ? d.r.hips * 0.75 : 0, Pl[2]]; }
  const seatP = list.find(p => p.def.seat || p.def.ground === 'seat');
  if (seatP && o.seat != null) Pl[1] = mix(Pl[1], o.seat + d.r.hips * 0.75, clamp(seatP.u ?? seatP.w) ** 2);
  Pl[1] -= add0.drop * legLen * (1 - legW);
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
  const Rhd = mm(rotY((fhd - fc) + lyC + deg(add0.head[1])), mm(RhW, mm(rotX(clamp(lp, -0.8, 0.9) + deg(add0.head[0])), rotZ(deg(add0.head[2])))));
  const Hc = add(add(add(Nk, mv(Rc, mul(vecOf(base, 'neck'), d.neck))), mv(Rhd, [0, 0.45 * hu, 0.03 * hu])), add([0, swayY * 0.35, 0], mul(swayB, 0.4)));
  const J = { P: Pl, C, Nk, Hc, Rh: Rp, Rp, Rc, Rhd, H, hu };
  const RcLook = extra ? mm(rotY(extra * 0.4), Rc) : Rc;
  const S = [1, -1].map(side => add(C, mv(RcLook, [side * d.sw / 2, (add0.shrug - 0.012) * H, -0.006 * H])));
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
  if (tr) arms.forEach((a, i) => { const k = 0.006 * H * tr; a.W = add(a.W, [k * noise(t * 11, seedF + 3 + i), k * noise(t * 13, seedF + 5 + i), k * noise(t * 12, seedF + 7 + i)]); });
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
    const R = rec[i];
    let A = R.A;
    if (lw > 0.001) {
      const [x, z] = toBody(W.feet[i].x, W.feet[i].z);
      A = lerp3(R.A, [x, Math.max(R.A[1], d.ankle * 0.95), z], lw);
    }
    if (o.seat != null && legW > 0.5) { const fl = [A[0], d.ankle, A[2]]; if (len(sub(fl, hips[i])) < legLen * 0.98) A = lerp3(A, fl, legW); }
    const [K, A2] = ik3(hips[i], A, d.thigh, d.shin, sub(R.K, lerp3(hips[i], R.A, 0.5)));
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
  J.arms = arms; J.legs = legs; J.S = S;
  // ---- follow-through: cloth and hair lag behind the body's moves ----
  const screenX = p => -p[0] * cph + p[2] * sph;
  const wind = o.wind || 0;
  const lag = (key, p, w, z, k = 1) => {
    const [dx, dy] = dangle(m, key, pos[0] + screenX(p), -p[1], w, z, dt);
    const mx = 0.09 * H * k; return [clamp(dx * k * 0.8 + wind * 0.02, -mx, mx), clamp(dy * k * 0.8, -mx * 0.5, mx * 0.5)];
  };
  J.lagHem = lag('hem', Pl, 6.5 + G.heavy * 2, 0.32);
  J.lagHair = lag('hair', J.Hc, 5, 0.45);
  J.lagTail = lag('tail', J.Hc, 3.4, 0.4, 1.3);
  J.lagCape = lag('cape', C, 5.5, 0.3);
  J.lagHand = arms.map((a, i) => lag('hand' + i, a.W, 5.6, 0.12, 1));
  J.t = t; J.seedF = seedF;
  const body = { now: frame, o, P, J, X: { fh, ox, oy, pos, id, s, legW, W } };
  placed(body, mark);
  BODIES.set(id, body);
  return body;
}
// a person painted as moved this frame, with the options it was moved with — over them what its element gives now (o:
// the same, or only { id } and what changes in the painting: only: 'far' | 'near', an alpha)
function person(g, e, o = {}) {
  if (!o) return null; // (its people entry gave null: not there now)
  const id = o.id ?? e.id ?? (o.who || 'narrator'), b = BODIES.get(id), now = e.t;
  if (!b) { e.warn(`"${id}" is painted but not moved: give it to kit.ushers.move(people, f) in the lib's beforeFrame`); return null; }
  if (b.now !== now) e.warn(`"${id}" was not moved this frame (kit.ushers.move in the lib's beforeFrame): painted as it was`);
  return paintPerson(g, e, { ...b.o, ...o }, b);
}
// body frame → element metres: [x, y, depth (+ away)] (o.view: how much depth lowers a point; o.lift: up off the ground)
function projector(o, fh, ox, oy) {
  const view = o.view ?? 0.14, lift = o.lift || 0, c = Math.cos(fh), sn = Math.sin(fh);
  return p => { const X = -p[0] * c + p[2] * sn, Z = -p[0] * sn - p[2] * c; return [ox + X, oy - p[1] - Z * view * (1 - (p[1] + lift) / 1.7), Z]; };
}
// where a person moved is (body.info: element metres; WHERE: the world, for another figure's hand — K.point), its head marked
function placed(body, mark) {
  const { o, P, J, X } = body, { fh, ox, oy, pos, id } = X, H = P.H, d = P.d, hu = d.hu, r = d.r, Rc = J.Rc, Rh = J.Rh, Rhd = J.Rhd, Hc = J.Hc;
  const pr = projector(o, fh, ox, oy), P2 = p => { const q = pr(p); return [q[0], q[1]]; };
  const lap = add(J.P, mv(Rh, [0, 0.05 * H, 0.17 * H])), backP = add(J.C, mv(Rc, [0, -0.05 * H, -r.chest * 0.8]));
  body.info = {
    head: P2(Hc), top: P2(add(Hc, mv(Rhd, [0, 0.55 * hu, 0]))), chest: P2(J.C), hip: P2(J.P),
    hand: { r: P2(J.arms[0].W), l: P2(J.arms[1].W) }, shoulder: { r: P2(J.S[0]), l: P2(J.S[1]) }, foot: { r: P2(J.legs[0].A), l: P2(J.legs[1].A) },
    lap: P2(lap), back: P2(backP), face: X.fh / D2R, speed: X.s, height: H,
  };
  // the world (across, height, depth) of each named point: for another figure's hand (K.point)
  const wpt = p => { const q = pr(p); return [pos[0] + q[0] - ox, -(q[1] - oy), pos[1] + q[2]]; };
  WHERE.set(id, { head: wpt(Hc), chest: wpt(J.C), hip: wpt(J.P), hand_r: wpt(J.arms[0].W), hand_l: wpt(J.arms[1].W),
    shoulder_r: wpt(J.S[0]), shoulder_l: wpt(J.S[1]), back: wpt(backP), lap: wpt(lap) });
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
// colours in the scene's light: a cloth's daylight colour mixed toward the dark by `light`; a pale face (and the silver
// hair) keeps some of its paleness in the dark (pale 0…1)
function colourer(o, P) {
  const lit = clamp(o.light ?? 0.35) * 0.92, dark = o.dark || DARK, tint = o.tint ? rgbOf(o.tint) : null, cache = {};
  return (name, far, pale = 0) => {
    const key = name + (far ? '*' : '') + pale;
    if (cache[key]) return cache[key];
    let c = rgbOf(P.col[name] || name);
    if (tint) c = [c[0] * tint[0] / 255, c[1] * tint[1] / 255, c[2] * tint[2] / 255];
    const k = lit + (0.92 - lit) * clamp(pale) * 0.55;
    return (cache[key] = shade(dark, c, k * (far ? 0.78 : 1), far ? 0.9 : 1));
  };
}
function paintPerson(g, e, o, body) {
  const { P, J, X } = body, { fh, ox, oy } = X, d = P.d, H = P.H, hu = d.hu, r = d.r, wear = P.wear;
  const view = o.view ?? 0.14, lift = o.lift || 0;
  const pr = projector(o, fh, ox, oy);
  const col = colourer(o, P), pale = P.pallor;
  const skin = col('skin', false, pale), skinFar = col('skin', true, pale);
  const parts = [];
  // form: [x, y, r] — the mass the key light shades across (lit side → shadow side)
  const part = (grp, z, fills, edge, form) => parts.push({ grp, z, fills, edge, form });
  const formOf = (p, rr) => { const q = pr(p); return [q[0], q[1], rr]; };
  const circ = (p, rr) => { const q = pr(p); return [q[0], q[1], rr]; };
  const zOf = (...ps) => ps.reduce((s, p) => s + pr(p)[2], 0) / ps.length;
  const facing = v => pr(add(J.C, v))[2] - pr(J.C)[2];          // < 0: that side of the body is toward the viewer
  const zC = pr(J.C)[2], zH = pr(J.Hc)[2];
  const Rc = J.Rc, Rh = J.Rh, Rhd = J.Rhd, Hc = J.Hc;
  const skirtLen = wear.skirt || 0, coatLen = wear.coat || 0, robe = Math.max(skirtLen, coatLen);
  // ---- legs: trousers and boots, or bare feet ----
  const bare = wear.barefoot;
  J.legs.forEach((l, i) => {
    const far = pr(l.K)[2] > pr(J.legs[1 - i].K)[2] + 0.01;
    const leg = new Path2D(), foot = new Path2D();
    const h = pr(l.H), k = pr(l.K), a = pr(l.A), mid = pr(lerp3(l.K, l.A, 0.3));
    taper(leg, h[0], h[1], r.thigh, k[0], k[1], r.knee);
    taper(leg, k[0], k[1], r.knee, mid[0], mid[1], r.calf);
    taper(leg, mid[0], mid[1], r.calf, a[0], a[1], r.ankle);
    if (!bare) { const bt = pr(lerp3(l.A, l.K, 0.28)); taper(foot, bt[0], bt[1], r.ankle * 1.12, a[0], a[1], r.ankle * 1.05); }
    const fr = bare ? 0.8 : 1;
    hullPath([circ(l.A, r.ankle * fr), circ(l.heel, 0.02 * H * fr), circ(l.toe, 0.012 * H), circ(lerp3(l.heel, l.toe, 0.55), 0.017 * H * fr)], foot, 8);
    const legC = bare ? (far ? skinFar : skin) : col('bottom', far);
    if (o.only === 'far' ? far : o.only === 'near' ? !far : true) part(2, zOf(l.K, l.A) + (far ? 0.001 : 0), [[leg, legC], [foot, bare ? legC : col('boots', far)]], false, formOf(l.K, r.thigh * 1.2));
  });
  if (o.only === 'far') { drawParts(g, e, parts, o, keyOf(o)); return null; }
  // ---- a gown or a long coat: from the waist over the legs to the hem, the hem lagging ----
  if (robe > 0) {
    const pts = [], flare = skirtLen ? r.thigh * 1.25 + 0.035 * H : r.thigh * 1.15 + 0.03 * H * coatLen;
    const ring = (cen, rx, rz, Rm, n, lagk) => { for (let j = 0; j < n; j++) { const an = j * TAU / n; const q = pr(add(cen, mv(Rm, [Math.cos(an) * rx, 0, Math.sin(an) * rz]))); pts.push([q[0] + J.lagHem[0] * lagk, q[1] + J.lagHem[1] * lagk * 0.5, 0]); } };
    ring(lerp3(J.P, J.C, 0.3), r.hips * 1.05 + d.hw * 0.25, r.hips * 0.95, Rh, 10, 0);
    const legLen = d.thigh + d.shin, hem = [], mid = lerp3(J.legs[0].A, J.legs[1].A, 0.5);
    // the hem follows the legs only part of the way (cloth between them): the legs stride out beyond it
    const squeeze = q => { const mq = [mid[0], q[1], mid[2]]; let v = sub(q, mq); const l = len(v), mx = 0.14 * H; if (l > 0) v = mul(v, Math.min(0.6, mx / l)); return add(mq, v); };
    J.legs.forEach(l => {
      const f = robe * legLen, pf = f <= d.thigh ? lerp3(l.H, l.K, f / d.thigh) : lerp3(l.K, l.A, Math.min(1, (f - d.thigh) / d.shin));
      const kd = [l.K[0], l.K[1] - Math.max(0, f - d.thigh), l.K[2]], gy = 0.012 * H;
      const pfc = squeeze([pf[0], Math.max(gy, pf[1]), pf[2]]), kdc = squeeze([kd[0], Math.max(gy, kd[1]), kd[2]]);
      ring(pfc, flare, flare * 0.85, Rh, 14, 1); ring(kdc, flare * 0.9, flare * 0.8, Rh, 10, 1);
      const kq = pr(lerp3(l.K, l.H, 0.25)); pts.push([kq[0], kq[1], r.knee * 1.25]);
      hem.push(pfc);
    });
    const fills = [[hullPath(pts, null, 8), col(skirtLen ? 'skirt' : 'coat')]];
    // torn and stained (blood): dark rents up from the hem, stains spreading on the cloth
    if (wear.blood) {
      const tear = new Path2D(), stain = new Path2D(), h0 = lerp3(hem[0], hem[1], 0.5);
      for (const [k, up] of [[-0.6, 0.16], [0.15, 0.1], [0.7, 0.2]]) {
        const b0 = add(h0, mv(Rh, [k * flare, 0, flare * 0.9])), q = pr(b0), tq = pr(add(b0, [0.02 * H * k, up * H * wear.blood, 0]));
        tear.moveTo(q[0] - 0.012 * H, q[1]); tear.lineTo(tq[0], tq[1]); tear.lineTo(q[0] + 0.012 * H, q[1]); tear.closePath();
      }
      for (const [x, y, rr, sd] of [[0.3, 0.62, 0.045, 1], [-0.35, 0.2, 0.03, 2]]) {
        const p = add(lerp3(h0, J.P, y), mv(Rh, [x * flare, 0, flare * 0.85 * (1 - y * 0.4)]));
        if (pr(add(p, mv(Rh, [0, 0, 0.1])))[2] < pr(p)[2]) { const q = pr(p); blot(stain, q[0], q[1], rr * H * wear.blood, sd); }
      }
      fills.push([stain, alpha(col('blood'), 0.85)], [tear, o.dark || DARK]);
    }
    part(2.5, zC, fills, false, formOf(lerp3(J.P, mid, 0.45), flare * 1.4));
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
  for (const sd of [1, -1]) tor.push(circ(add(J.P, mv(Rh, [sd * 0.06 * H, 0.005 * H, 0])), r.hips));
  tor.push(circ(add(J.P, mv(Rh, [0, -0.005 * H, -0.03 * H])), r.hips * 0.92));
  const torso = hullPath(tor, null, 16), topC = col(wear.top === 'coat' ? 'coat' : 'top');
  const neck = new Path2D(), n0 = pr(J.Nk), n1 = pr(add(Hc, mv(Rhd, [0, -0.32 * hu, -0.05 * hu])));
  taper(neck, n0[0], n0[1], r.neck * 1.15, n1[0], n1[1], r.neck);
  part(3, zC, [[neck, skin], [torso, topC]], false, formOf(lerp3(J.C, J.P, 0.3), r.chest * 1.6));
  // the shirt's collar and front in the coat's opening (a loose cravat: a soft knot, its ends hanging)
  const front = facing(mv(Rc, [0, 0, 0.1]));
  if (wear.shirt && front < -0.02) {
    const v = new Path2D(), q = [[-0.04, 0.012, 0.75], [0.04, 0.012, 0.75], [0, -0.1, 0.98]].map(([x, y, z]) => pr(add(J.C, mv(Rc, [x * H, y * H, z * r.chest]))));
    v.moveTo(q[0][0], q[0][1]); v.lineTo(q[1][0], q[1][1]); v.lineTo(q[2][0], q[2][1]); v.closePath();
    const fills = [[v, col('shirt')]];
    if (wear.shirt === 'cravat') {
      const cr = new Path2D(), k0 = pr(add(J.C, mv(Rc, [0, -0.012 * H, r.chest * 0.9]))), k1 = pr(add(J.C, mv(Rc, [0.008 * H, -0.075 * H, r.chest * 1.02])));
      disc(cr, k0[0], k0[1], 0.014 * H); taper(cr, k0[0], k0[1], 0.012 * H, k1[0] + J.lagCape[0] * 0.3, k1[1], 0.007 * H);
      fills.push([cr, col('shirt', true)]);
    }
    part(3.05, zC - 0.01, fills);
  }
  // blood on the bodice
  if (wear.blood && front < 0.05) {
    const st = new Path2D();
    const q = pr(add(J.C, mv(Rc, [0.035 * H, -0.11 * H, r.chest * 0.95])));
    blot(st, q[0], q[1], 0.032 * H * wear.blood, 3);
    part(3.06, zC - 0.011, [[st, alpha(col('blood'), 0.85)]]);
  }
  // the greatcoat's short shoulder cape (outdoors): over the shoulders to the elbows, lagging
  if (wear.cape) {
    const lc = J.lagCape, cp = [circ(J.S[0], r.shoulder * 1.5), circ(J.S[1], r.shoulder * 1.5), circ(add(J.C, mv(Rc, [0, 0.02 * H, 0])), 0.05 * H)];
    for (const [x, z] of [[0.13, 0.03], [-0.13, 0.03], [0.1, 0.07], [-0.1, 0.07], [0, -0.08], [0.06, -0.07], [-0.06, -0.07]]) {
      const q = pr(add(J.C, mv(Rc, [x * H, -0.14 * H, z * H]))); cp.push([q[0] + lc[0], q[1] + lc[1] * 0.5, 0.035 * H]);
    }
    part(3.5, zC, [[hullPath(cp, null, 10), col('coat')]], false, formOf(J.C, 0.16 * H));
  }
  // ---- head: the face's own shape (P.face: width, length) ----
  const [fw, fl] = P.face, hp = (v, rr) => circ(add(Hc, mv(Rhd, [v[0] * hu * fw, v[1] * hu * (v[1] < 0 ? fl : 1), v[2] * hu])), rr * hu);
  part(4, zH, [[hullPath([hp([0, 0.04, -0.05], 0.43), hp([0, -0.2, 0.1], 0.3 * fw), hp([0, -0.37, 0.16], 0.15), hp([0, -0.04, 0.43], 0.075), hp([0, -0.17, 0.45], 0.055), hp([0, -0.3, 0.3], 0.1)], null, 12), skin]], false, formOf(Hc, 0.5 * hu));
  // the face, toward us or turned (three-quarter, profile): the eye sockets (deeper in a pale face) under the brows, the
  // nose's ridge, the cheekbone catching the light over its hollow, and seen bigger a mouth; spectacles catch the light
  const zAt = v => pr(add(Hc, mv(Rhd, v.map(x => x * hu))))[2];
  const hfZ = (zAt([0, 0, 1]) - zH) / hu, px = e.px || 0.01;
  if (hfZ < 0.35 && hu / px > 7 && !o.only) {
    const lit = clamp(o.light ?? 0.35), fc = shade(o.dark || DARK, P.col.skin, (lit + (0.92 - lit) * pale * 0.55) * 0.42), feat = new Path2D();
    const at = (x, y, z) => pr(add(Hc, mv(Rhd, [x * hu * fw, y * hu * (y < 0 ? fl : 1), z * hu])));
    const glasses = new Path2D(), lines = new Path2D(), hollow = new Path2D(), cheek = new Path2D();
    for (const sx of [-0.17, 0.17]) {
      if (zAt([sx * 2.2, 0, 0.9]) - zH > 0) continue;            // this eye turned away
      const q = at(sx, -0.07, 0.42), ex = (0.05 + 0.015 * pale) * hu * fw;
      feat.moveTo(q[0] + ex, q[1]); feat.ellipse(q[0], q[1], ex, (0.03 + 0.02 * pale) * hu, 0, 0, TAU);
      const b0 = at(sx * 0.45, 0.03, 0.45), b1 = at(sx * 1.45, 0.05, 0.38); lines.moveTo(b0[0], b0[1]); lines.lineTo(b1[0], b1[1]);
      if (wear.glasses) { glasses.moveTo(q[0] + 0.07 * hu, q[1] - 0.02 * hu); glasses.lineTo(q[0] - 0.04 * hu, q[1] + 0.03 * hu); }
      // the cheekbone and the hollow under it, on a cheek turned toward us
      if (zAt([sx * 2, -0.2, 0.6]) - zH < 0) { const c = at(sx * 1.55, -0.17, 0.34), h2 = at(sx * 1.35, -0.29, 0.31);
        disc(cheek, c[0], c[1], 0.05 * hu); hollow.moveTo(h2[0] + 0.06 * hu, h2[1]); hollow.ellipse(h2[0], h2[1], 0.06 * hu, (0.025 + 0.02 * pale) * hu, 0, 0, TAU); }
    }
    // the nose: its ridge down from between the brows, the tip a little out — a line only as the face turns (head on,
    // just the shadow under its tip)
    const turn = clamp(Math.abs(zAt([1, 0, 0]) - zH) / hu * 1.6), nose = new Path2D(), n0 = at(0, -0.02, 0.46), n1 = at(0, -0.17, 0.5), n2 = at(0.04, -0.2, 0.45);
    nose.moveTo(n0[0], n0[1]); nose.lineTo(n1[0], n1[1]); nose.lineTo(n2[0], n2[1]);
    const tip = at(0, -0.21, 0.44), under = new Path2D(); under.moveTo(tip[0] + 0.05 * hu, tip[1]); under.ellipse(tip[0], tip[1], 0.05 * hu, 0.018 * hu, 0, 0, TAU);
    const fills = [[hollow, alpha(fc, 0.3 + 0.3 * pale)], [cheek, 'rgba(255,240,228,0.1)'], [feat, fc], [lines, alpha(fc, 0.7), 0.022 * hu], [under, alpha(fc, 0.4)]];
    if (turn > 0.05) fills.push([nose, alpha(fc, (0.7 * turn).toFixed(3)), 0.022 * hu]);
    if (hu / px > 16) { const m0 = at(-0.08, -0.3, 0.38), m1 = at(0.08, -0.3, 0.38); const mo = new Path2D(); mo.moveTo(m0[0], m0[1]); mo.lineTo(m1[0], m1[1]); fills.push([mo, fc, 0.02 * hu]); }
    if (wear.glasses) fills.push([glasses, 'rgba(220,226,232,0.35)', Math.max(px * 0.8, 0.012 * hu)]);
    part(4.05, zH - 0.0005, fills);
  }
  // ---- hair: what lies behind the head under it, what is in front over it ----
  const hairC = col('hair', false, pale * 0.8), hairFar = col('hair', true, pale * 0.8);
  const lh = J.lagHair, lt = J.lagTail, style = wear.hair;
  // short hair at the back goes under the head when the face is toward us; long hair whenever the face is not turned away
  const behind = (style === 'short' ? hfZ < -0.35 : hfZ < 0.3) || zAt([0, 0, -0.35]) - zH > 0.05 * hu ? 3.9 : 4.1;
  const topBehind = zAt([0, 0.32, -0.05]) - zH > 0.1 * hu;
  const scalp = [[0, 0.3, 0.02, 0.3], [0.2, 0.2, 0.04, 0.22], [-0.2, 0.2, 0.04, 0.22]];
  if (style === 'short') {
    part(behind, zH + 0.001, [[hullPath([hp([0, 0.1, -0.17], 0.41), hp([0, -0.12, -0.28], 0.26)], null, 10), hairC]]);
    part(topBehind ? 3.95 : 4.2, zH - 0.001, [[hullPath(scalp.map(([x, y, z, rr]) => hp([x, y, z], rr)), null, 10), hairC]]);
  } else if (style === 'float') {
    // Roderick's: long, silky, floating round the face like cobweb — the hair close on the skull and down the nape, and
    // fine strands with gaps between them, bulging out as they fall, lighter at the ends, each drifting on its own
    const halo = [hp([0, 0.08, -0.06], 0.45), hp([0.33, -0.25, -0.1], 0.17), hp([-0.33, -0.25, -0.1], 0.17), hp([0, -0.55, -0.28], 0.22), hp([0.2, -0.7, -0.25], 0.1), hp([-0.2, -0.7, -0.25], 0.1), hp([0, -0.1, -0.33], 0.34)];
    // the mass under the strands a shade deeper, so the strands over it read one by one
    const fallC = col('hair', true, pale * 0.3);
    part(behind, zH + 0.0012, [[hullPath(halo, null, 12), fallC]], false, formOf(Hc, 0.6 * hu));
    part(topBehind ? 3.95 : 4.2, zH - 0.001, [[hullPath(scalp.map(([x, y, z, rr]) => hp([x, y, z], rr * 1.05)), null, 10), hairC]]);
    const S2 = () => ({ body: new Path2D(), tip: new Path2D() }), near = S2(), back = S2();
    const stir = 1 + 2 * Math.abs(o.wind || 0);
    for (let j = 0; j < 26; j++) {
      const an = -1.9 + j * 0.152, dir = [Math.sin(an), Math.cos(an) * 0.7 - 0.2], set = zAt([dir[0], 0, 0.25]) - zH < 0 ? near : back;
      const Ls = 0.85 + 0.35 * hash(j, 41), out = 0.1 + 0.15 * hash(j, 43);
      const root = add(Hc, mv(Rhd, [dir[0] * 0.4 * hu, (0.22 + dir[1] * 0.2) * hu, (-0.08 - 0.34 * hash(j, 47)) * hu]));
      let q = pr(root);
      set.body.moveTo(q[0], q[1]);
      for (let k = 1; k <= 5; k++) {
        const u = k / 5, drift = noise(J.t * 0.3 * stir + j * 1.7, 31 + k) * 0.1 * hu * u * stir;
        const p = add(root, mv(Rhd, [dir[0] * (0.12 * u + out * Math.sin(PI * u) + 0.05) * hu + drift, (-Ls * u + 0.1 * Math.sin(PI * u)) * hu, (0.04 - 0.18 * u) * hu]));
        const sw = clamp(-lh[0] * u - lt[0] * u * u * 0.5, -0.2 * hu * u, 0.2 * hu * u);   // a strand trails a little, never far
        const q2 = pr(p), x = q2[0] + sw, y = q2[1] + Math.abs(sw) * 0.4 + noise(J.t * 0.25 * stir + j, 7) * 0.04 * hu * u * stir;
        if (k <= 3) set.body.lineTo(x, y);
        if (k >= 3) { if (k === 3) set.tip.moveTo(x, y); else set.tip.lineTo(x, y); }
      }
    }
    // each strand catches the rim: a thin line of the rim's light along its lit side
    const tipC = col('#e2e0da', false, pale), rimOf = (set, w) => {
      if (!o.rim) return [];
      const a = deg(o.rimDir ?? 180), d = 0.012 * hu, m = new DOMMatrix().translateSelf(Math.cos(a) * d, Math.sin(a) * d), q = new Path2D();
      q.addPath(set.body, m); q.addPath(set.tip, m);
      return [[q, alpha(css(...rgbOf(o.rim)), 0.5 * (o.rimAlpha ?? 0.85)), w]];
    };
    // seen from behind the strands lie over the scalp too
    part(behind > 4 ? 4.25 : behind, zH + 0.0015, [[back.body, alpha(hairC, 0.85), 0.026 * hu], [back.tip, alpha(tipC, 0.55), 0.02 * hu], ...rimOf(back, 0.012 * hu)]);
    // the locks over the cheeks only with the face toward us (in profile they would cross it)
    if (hfZ < -0.4) part(4.22, zH - 0.0015, [[near.body, alpha(hairC, 0.7), 0.024 * hu], [near.tip, alpha(tipC, 0.45), 0.018 * hu], ...rimOf(near, 0.01 * hu)]);
  } else if (style === 'loose') {
    // Madeline's: long and loose down the back, two locks over the shoulders framing the face, lagging
    part(behind, zH + 0.001, [[hullPath([hp([0, 0.1, -0.14], 0.45), hp([0.3, -0.3, -0.12], 0.24), hp([-0.3, -0.3, -0.12], 0.24)], null, 10), hairC]]);
    part(topBehind ? 3.95 : 4.2, zH - 0.001, [[hullPath(scalp.map(([x, y, z, rr]) => hp([x, y, z * 1.3], rr * 1.06)), null, 10), hairC]]);
    const chain = (start, Lh, r0, r1, side) => {
      const ch = [];
      for (let j = 0; j <= 4; j++) {
        const u = j / 4, p = add(start, add(mv(Rc, [side * 0.01 * H * u, 0, -0.03 * H * Math.sin(u * 2) * (side ? 0 : 1)]), [0, -Lh * u, 0]));
        const q = pr(p), k = u * u;
        const sw = clamp(-lt[0] * k * 0.8, -0.25 * Lh * u, 0.25 * Lh * u);
        ch.push([q[0] + sw + noise(J.t * 0.5 + side, 3) * 0.006 * u, q[1] + Math.abs(sw) * 0.3, mix(r0, r1, u) * hu]);
      }
      const t2 = new Path2D(); for (let j = 0; j < ch.length - 1; j++) taper(t2, ...ch[j], ...ch[j + 1]); return t2;
    };
    part(hfZ < -0.2 ? 2.9 : 4.15, zH, [[chain(add(Hc, mv(Rhd, [0, -0.1 * hu, -0.36 * hu])), 0.3 * H, 0.34, 0.16, 0), hairC]]);
    for (const sd of [1, -1]) {
      const st = add(Hc, mv(Rhd, [sd * 0.44 * hu * fw, -0.12 * hu, -0.08 * hu])), inFront = zAt([sd * 0.4, 0, 0.3]) - zH < 0;
      part(inFront && hfZ < 0.2 ? 4.16 : behind, zH - (inFront ? 0.002 : -0.002), [[chain(st, 0.17 * H, 0.13, 0.07, sd), hairC]]);
    }
  }
  if (wear.beard === 'whiskers') {
    const wk = hullPath([hp([0.36, -0.18, 0.06], 0.12), hp([0.3, -0.34, 0.14], 0.11)], null, 8);
    hullPath([hp([-0.36, -0.18, 0.06], 0.12), hp([-0.3, -0.34, 0.14], 0.11)], wk, 8);
    part(4.12, zH - 0.002, [[wk, hairC]]);
  }
  // a top hat (outdoors)
  if (wear.hat === 'top') {
    const ringPts = (y, rx, rz, n, rr) => { const a = []; for (let j = 0; j < n; j++) { const an = j * TAU / n; a.push(hp([Math.cos(an) * rx, y, Math.sin(an) * rz + 0.02], rr)); } return a; };
    const hatC = col('hat');
    part(4.4, zH - 0.003, [[hullPath(ringPts(0.3, 0.6, 0.58, 18, 0.025), null, 4), hatC], [hullPath([...ringPts(0.29, 0.4, 0.42, 10, 0.02), ...ringPts(1.22, 0.43, 0.45, 10, 0.03)], null, 4), hatC]]);
  }
  // ---- arms ----
  const sleeve = wear.top === 'coat' ? 'coat' : 'top';
  J.arms.forEach((a, i) => {
    const s = pr(add(a.S, [0, -0.012 * H, 0])), el = pr(a.E), w = pr(a.W);
    const far = s[2] > pr(J.arms[1 - i].S)[2] + 0.01;
    const up = new Path2D(), fo = new Path2D(), hd = new Path2D();
    taper(up, s[0], s[1], r.upper * 1.12, el[0], el[1], r.elbow);
    taper(fo, el[0], el[1], r.elbow, w[0], w[1], r.wrist * (wear.top === 'coat' ? 1.25 : 1));
    // the hand: along the forearm
    const dir = norm(sub(a.W, a.E)), h1 = pr(madd(a.W, dir, 0.035 * H)), h2 = pr(madd(a.W, dir, 0.06 * H));
    if (a.hand === 'point') { hullPath([[w[0], w[1], r.wrist], [h1[0], h1[1], r.hand * 0.9]], hd, 8); const f2 = pr(madd(a.W, dir, 0.1 * H)); taper(hd, h1[0], h1[1], 0.009 * H, f2[0], f2[1], 0.006 * H); }
    else if (a.hand === 'fist') disc(hd, h1[0], h1[1], r.hand * 0.95);
    else hullPath([[w[0], w[1], r.wrist], [h1[0], h1[1], r.hand * 0.9], [h2[0], h2[1], r.hand * 0.55]], hd, 8);
    const zu = (s[2] + el[2]) / 2, zf = (el[2] + w[2]) / 2;
    const gU = zu > zC + 0.03 ? 1 : zu < zC - 0.06 && zu < zH ? 5 : 3.3;
    const gF = zf > zC + 0.03 ? 1 : zf < zC - 0.03 ? 5 : 3.3;
    const foreFills = [[fo, col(sleeve, far)], [hd, far ? skinFar : skin]];
    if (gU === gF) {
      // one arm, one outline (no seam at the elbow)
      const whole = new Path2D(); whole.addPath(up); whole.addPath(fo); whole.addPath(hd);
      part(gF, Math.min(zu, zf), [[up, col(sleeve, far)], ...foreFills], gF > 4, formOf(a.E, r.upper * 2)); parts[parts.length - 1].edgePath = whole;
      if (!far) parts[parts.length - 1].near = 1;
    } else {
      part(gU, zu, [[up, col(sleeve, far)]], gU > 4, formOf(lerp3(a.S, a.E, 0.5), r.upper * 1.6)); if (!far) parts[parts.length - 1].near = 1;
      part(gF, zf - 0.001, foreFills, gF > 4, formOf(lerp3(a.E, a.W, 0.5), r.elbow * 1.6)); if (!far) parts[parts.length - 1].near = 1;
    }
    a.zf = zf; a.gF = gF; a.far = far;
  });
  // ---- held things ----
  // a flame in the hands: its glow is painted behind the body (not over it) and lights the body as its key light; only
  // its small bloom goes over (e.light). The room's wide light is the scene's (info.flames says where they burn)
  const glows = [], held = { light: (x, y, rr, c, a) => { glows.push([x, y, Math.min(0.22 * rr, 0.55), c, a]); if (e.light) e.light(x, y, Math.min(0.1 * rr, 0.3), c, 0.5 * a); } };
  if (o.hold) for (const [k, what] of Object.entries(o.hold)) {
    if (!what) continue;
    const i = k === 'l' ? 1 : 0, a = J.arms[i];
    const fills = propInHand(what, a, J, i, pr, H, col, held, o);
    if (fills) { part(fills.grp ?? a.gF, (fills.z ?? a.zf) - 0.002, fills.list); parts[parts.length - 1].noRim = true; }
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
  if (glows.length) {
    g.save(); g.globalCompositeOperation = 'lighter';
    for (const [x, y, rr, c, a] of glows) {
      const [r0, g0, b0] = rgbOf(c), gr = g.createRadialGradient(x, y, 0, x, y, rr);
      gr.addColorStop(0, `rgba(${r0},${g0},${b0},${0.45 * a})`); gr.addColorStop(0.25, `rgba(${r0},${g0},${b0},${0.18 * a})`); gr.addColorStop(1, `rgba(${r0},${g0},${b0},0)`);
      g.fillStyle = gr; g.fillRect(x - rr, y - rr, 2 * rr, 2 * rr);
    }
    g.restore();
  }
  drawParts(g, e, parts, o, keyOf(o, glows));
  // where it is (element metres), for the scene to use; the flames in its hands (where they burn as painted)
  return { ...body.info, flames: glows.map(([x, y]) => [x, y]) };
}
// the key light that shades each part across its form: o.key ({ dir: degrees toward the light on screen, or at: [x, y]
// a point light in element metres; color; power 0…1 }), else a flame in the hands, else the first rim (softly); false: none
function keyOf(o, glows) {
  if (o.key === false) return null;
  const k = o.key || (glows?.length ? { at: glows[0].slice(0, 2), color: glows[0][3], power: 0.55 } : o.rim ? { dir: o.rimDir ?? 180, color: o.rim, power: 0.22 } : null);
  return k && { at: k.at, dir: deg(k.dir ?? 180), rgb: rgbOf(k.color || '#ffb26a'), power: clamp(k.power ?? 0.4) };
}
// all parts: once in the rim colour shifted toward the light, then the body over it, shaded by the key light
function drawParts(g, e, parts, o, key) {
  const A = o.alpha ?? 1, a0 = g.globalAlpha;
  // rim light: the silhouette once more in the light's colour, shifted toward the light; a second one from the other side
  for (const [rim, dir, width, alpha] of [[o.rim, o.rimDir ?? 180, o.rimWidth ?? 1.3, o.rimAlpha ?? 0.85], [o.rim2, o.rimDir2 ?? 0, o.rimWidth2 ?? 1, o.rimAlpha2 ?? 0.6]]) {
    if (!rim) continue;
    const ang = deg(dir), w = width * (e.px || 0.01);
    g.save(); g.translate(Math.cos(ang) * w, Math.sin(ang) * w); g.globalAlpha = a0 * A * alpha;
    g.fillStyle = g.strokeStyle = rim;
    for (const p of parts) if (!p.noRim) for (const [path, , lw] of p.fills) { if (lw) { g.lineWidth = lw; g.stroke(path); } else g.fill(path); }
    g.restore();
  }
  const edgeW = 1.3 * (e.px || 0.01), edgeC = o.dark || DARK;
  g.globalAlpha = a0 * A;
  for (const p of parts) {
    if (p.edge) { g.strokeStyle = edgeC; g.lineWidth = edgeW; g.globalAlpha = a0 * A * 0.4; if (p.edgePath) g.stroke(p.edgePath); else for (const [path, , lw] of p.fills) if (!lw) g.stroke(path); g.globalAlpha = a0 * A; }
    for (const [path, cl, lw] of p.fills) {
      if (lw) { g.strokeStyle = cl; g.lineWidth = lw; g.lineCap = 'round'; g.stroke(path); } else { g.fillStyle = cl; g.fill(path); }
    }
    if (key && p.form) {
      // across the form: the side toward the light lit in its colour, the far side into the dark
      const [cx, cy, rr] = p.form;
      let dx = Math.cos(key.dir), dy = Math.sin(key.dir), k = key.power;
      if (key.at) { dx = key.at[0] - cx; dy = key.at[1] - cy; const dd = Math.hypot(dx, dy) || 1; dx /= dd; dy /= dd; k *= clamp(1.25 - dd / 2.4); }
      if (k > 0.01) {
        const [r0, g0, b0] = key.rgb, dk = rgbOf(o.dark || DARK), gr = g.createLinearGradient(cx + dx * rr, cy + dy * rr, cx - dx * rr, cy - dy * rr);
        gr.addColorStop(0, `rgba(${r0},${g0},${b0},${0.55 * k})`); gr.addColorStop(0.45, `rgba(${r0},${g0},${b0},0)`);
        gr.addColorStop(0.6, `rgba(${dk[0]},${dk[1]},${dk[2]},0)`); gr.addColorStop(1, `rgba(${dk[0]},${dk[1]},${dk[2]},${0.5 * k})`);
        g.fillStyle = gr;
        for (const [path, , lw] of p.fills) if (!lw) g.fill(path);
      }
    }
  }
  g.globalAlpha = a0;
}

// ===== things in the hand, and on their own =====
const WOOD = '#4a3424', IRON = '#2e2d2e', BRASS = '#8a7444', FLAME = '#ffb24a', CORE = '#ffe6a8', WAX = '#d9d0b8', PAPER = '#d8ccb0', LEATHER = '#241b16';
// a flame (flickering, leaning back from the way the hand goes) at (x, y): its paths, and its light (e.light)
function flame(list, e, x, y, h, t, seed, lean, glow, light) {
  if (glow <= 0) return;
  const n1 = noise(t * 6, seed), n2 = noise(t * 7.3, seed + 1), fh = h * (1 + 0.15 * n1), fx = x - lean + n2 * h * 0.08, fy = y - fh;
  const f = new Path2D(), core = new Path2D(), w = h * 0.32;
  f.moveTo(x - w, y); f.quadraticCurveTo(x - w * 1.1, y - fh * 0.5, fx, fy); f.quadraticCurveTo(x + w * 1.1, y - fh * 0.45, x + w, y); f.closePath();
  core.moveTo(x - w * 0.45, y); core.quadraticCurveTo(x, y - fh * 0.55, (fx + x) / 2, fy + fh * 0.4); core.quadraticCurveTo(x + w * 0.5, y - fh * 0.3, x + w * 0.45, y); core.closePath();
  list.push([f, FLAME], [core, CORE]);
  if (light && e.light) e.light(x, y - fh * 0.4, light[0] * (0.92 + 0.08 * n1) * glow, light[1], light[2] * glow);
}
// a torch's fire: tongues licking up, each flickering on its own, leaning from the way it moves; smoke curling off the
// top; its light (e.light)
function fire(list, e, x, y, h, t, seed, lean, glow, light) {
  if (glow <= 0) return;
  const w = h * 0.36;
  for (let i = 0; i < 7; i++) {
    const u = (t * 0.45 + i / 7 + hash(i, seed) * 0.05) % 1, rr = (0.03 + 0.11 * u) * h * 3, p = new Path2D();
    const sx = x - lean * (0.5 + u) + noise(t * 0.6 + i * 3, seed + 5) * 0.12 * u * h * 3, sy = y - h * (1 + 2.6 * u);
    p.arc(sx, sy, rr, 0, TAU);
    list.push([p, `rgba(36,32,30,${(0.1 * Math.sin(PI * u) * glow).toFixed(3)})`]);
  }
  const tongue = (ox, th, ww, sway, c) => {
    const p = new Path2D(), tx = x + ox * 0.35 + sway - lean, ty = y - th;
    p.moveTo(x + ox - ww, y); p.bezierCurveTo(x + ox - ww * 1.2, y - th * 0.45, tx - ww * 0.3, ty + th * 0.3, tx, ty);
    p.bezierCurveTo(tx + ww * 0.25, ty + th * 0.35, x + ox + ww * 1.1, y - th * 0.4, x + ox + ww, y); p.closePath();
    list.push([p, c]);
  };
  for (const j of [0, 4, 1, 3, 2]) {                // the outer tongues first, the brightest over them
    const n = 0.5 + 0.5 * noise(t * (4.5 + j * 1.3), seed + j * 7), th = h * (j === 2 ? 1.25 : 0.75 - 0.1 * Math.abs(j - 2)) * (0.65 + 0.55 * n);
    tongue((j - 2) * w * 0.3, th, w * (j === 2 ? 0.55 : 0.32), noise(t * 3.7 + j, seed + 11 + j) * h * 0.1, j === 2 ? FLAME : '#d0601e');
  }
  tongue(0, h * (0.45 + 0.15 * noise(t * 6, seed + 3)), w * 0.28, noise(t * 4.1, seed + 13) * h * 0.08, CORE);
  if (light && e.light) e.light(x, y - h * 0.4, light[0] * (0.9 + 0.1 * noise(t * 7, seed)) * glow, light[1], light[2] * glow);
}
// the guitar in its own frame: the body's centre at 0, the neck up (−y); 1 m long
function guitarPaths() {
  const B = new Path2D();
  B.moveTo(0, 0.25); B.bezierCurveTo(0.12, 0.25, 0.165, 0.17, 0.16, 0.09); B.bezierCurveTo(0.155, 0.01, 0.085, -0.01, 0.09, -0.05);
  B.bezierCurveTo(0.095, -0.09, 0.13, -0.11, 0.125, -0.16); B.bezierCurveTo(0.12, -0.22, 0.06, -0.24, 0, -0.24);
  B.bezierCurveTo(-0.06, -0.24, -0.12, -0.22, -0.125, -0.16); B.bezierCurveTo(-0.13, -0.11, -0.095, -0.09, -0.09, -0.05);
  B.bezierCurveTo(-0.085, -0.01, -0.155, 0.01, -0.16, 0.09); B.bezierCurveTo(-0.165, 0.17, -0.12, 0.25, 0, 0.25); B.closePath();
  const N = new Path2D(); N.moveTo(-0.022, -0.22); N.lineTo(-0.02, -0.61); N.lineTo(-0.032, -0.62); N.lineTo(-0.028, -0.75); N.lineTo(0.03, -0.75); N.lineTo(0.032, -0.62); N.lineTo(0.02, -0.61); N.lineTo(0.022, -0.22); N.closePath();
  const hole = new Path2D(); hole.arc(0, -0.06, 0.042, 0, TAU); hole.closePath(); hole.rect(-0.05, 0.13, 0.1, 0.018);
  const str = new Path2D(); for (const x of [-0.012, -0.004, 0.004, 0.012]) { str.moveTo(x, 0.135); str.lineTo(x * 0.9, -0.72); }
  return { B, N, hole, str };
}
let GUITAR_P = null;
// the guitar's paths placed: centre (x, y), its neck's angle (radians from up) and length scale, its width scale
function guitarAt(list, col, x, y, ang, k, wk) {
  const G = GUITAR_P || (GUITAR_P = guitarPaths()), m = new DOMMatrix().translateSelf(x, y).rotateSelf(ang / D2R).scaleSelf(wk, k);
  const pth = p => { const q = new Path2D(); q.addPath(p, m); return q; };
  list.push([pth(G.N), col('#16120f')], [pth(G.B), col('#6a4a30')], [pth(G.hole), col('#0a0807')], [pth(G.str), col('#cfc4b0'), 0.003]);
}
// a thing held: returns { list: [[path, colour, lineWidth?]], grp?, z? } in the person's element metres
function propInHand(what, a, J, i, pr, H, col, e, o) {
  const lag = J.lagHand[i], list = [], glow = o.glow ?? 1, t = J.t, seed = i * 7 + 3;
  const dir = norm(sub(a.W, a.E)), hp = pr(madd(a.W, dir, 0.035 * H));
  const L = (x1, y1, x2, y2, w, c) => { const p = new Path2D(); p.moveTo(x1, y1); p.lineTo(x2, y2); list.push([p, c, w]); };
  const R = (x, y, w, h, c) => { const p = new Path2D(); p.rect(x - w / 2, y - h / 2, w, h); list.push([p, c]); };
  // what is held upright in the fist: its foot a little above the hand
  const up = hp[1] - 0.02, x = hp[0];
  switch (what) {
    case 'candle': {
      const dish = new Path2D(); dish.ellipse(x, up, 0.055, 0.014, 0, 0, TAU); list.push([dish, col(BRASS)]);
      R(x, up - 0.065, 0.022, 0.12, col(WAX, false, 0.6));
      flame(list, e, x, up - 0.125, 0.045, t, seed, lag[0] * 0.6, glow, [1.8, '#ffc070', 0.6]);
      return { list };
    }
    case 'candlestick': {
      // three branches on a stem: the light of three flames
      L(x, up, x, up - 0.16, 0.016, col(BRASS));
      const arms = new Path2D(); arms.moveTo(x - 0.1, up - 0.24); arms.quadraticCurveTo(x - 0.1, up - 0.15, x, up - 0.15); arms.quadraticCurveTo(x + 0.1, up - 0.15, x + 0.1, up - 0.24);
      list.push([arms, col(BRASS), 0.012]);
      for (const dx of [-0.1, 0, 0.1]) {
        const top = dx ? up - 0.24 : up - 0.27;
        R(x + dx, top - 0.05, 0.02, 0.1, col(WAX, false, 0.6));
        flame(list, e, x + dx, top - 0.1, 0.04, t, seed + dx * 30, lag[0] * 0.6, glow, dx ? null : [2.6, '#ffc070', 0.75]);
      }
      return { list };
    }
    case 'lamp': {
      // an oil lamp held by its foot: the font, the glass chimney glowing, the steady flame inside
      const font = new Path2D(); font.ellipse(x, up - 0.04, 0.06, 0.04, 0, 0, TAU); list.push([font, col(BRASS)]);
      R(x, up - 0.005, 0.07, 0.014, col(BRASS));
      const ch = new Path2D(); ch.moveTo(x - 0.022, up - 0.075); ch.quadraticCurveTo(x - 0.045, up - 0.12, x - 0.022, up - 0.2); ch.lineTo(x + 0.022, up - 0.2); ch.quadraticCurveTo(x + 0.045, up - 0.12, x + 0.022, up - 0.075); ch.closePath();
      list.push([ch, glow > 0 ? `rgba(255,214,150,${0.35 + 0.35 * glow})` : col('#8a8478')]);
      flame(list, e, x, up - 0.09, 0.05, t * 0.4, seed, 0, glow, [2.6, '#ffcf80', 0.6]);
      return { list };
    }
    case 'torch': {
      const tip = pr(madd(a.W, norm(add(mul(dir, 0.5), [0, 1, 0])), 0.55)), bot = pr(madd(a.W, norm(add(mul(dir, 0.5), [0, 1, 0])), -0.12));
      L(bot[0], bot[1], tip[0], tip[1], 0.035, col(WOOD));
      L(tip[0], tip[1] + 0.04, tip[0], tip[1], 0.05, col('#2a1e14'));
      fire(list, e, tip[0], tip[1], 0.22, t, seed, lag[0] * 0.8, glow, [3.2, '#ff9a40', 0.8]);
      return { list };
    }
    case 'guitar': {
      // across the lap (sit + play_guitar): its frame from the pelvis
      const P3 = v => add(J.P, mv(J.Rp, v)), b = pr(P3(GUITAR.body)), n = pr(P3(onNeck(0.5)));
      const fz = pr(add(J.P, mv(J.Rp, GUITAR.face)))[2] - pr(J.P)[2];
      const ang = Math.atan2(n[0] - b[0], -(n[1] - b[1])), k = Math.hypot(n[0] - b[0], n[1] - b[1]) / 0.5;
      guitarAt(list, col, b[0], b[1], ang, k, clamp(Math.abs(fz), 0.3, 1));
      return { list, grp: 3.2, z: pr(J.C)[2] - 0.05 };
    }
    case 'open_book': {
      // open in both hands (read): between them, the pages toward the reader's eyes
      const o2 = pr(J.arms[1 - i].W), c = [(hp[0] + o2[0]) / 2, Math.min(hp[1], o2[1]) - 0.01], w = 0.15;
      const p = new Path2D();
      p.moveTo(c[0] - w, c[1] - 0.02); p.quadraticCurveTo(c[0] - w / 2, c[1] - 0.05, c[0], c[1] - 0.01); p.quadraticCurveTo(c[0] + w / 2, c[1] - 0.05, c[0] + w, c[1] - 0.02);
      p.lineTo(c[0] + w, c[1] + 0.02); p.quadraticCurveTo(c[0] + w / 2, c[1] - 0.01, c[0], c[1] + 0.03); p.quadraticCurveTo(c[0] - w / 2, c[1] - 0.01, c[0] - w, c[1] + 0.02); p.closePath();
      const cover = new Path2D(); cover.moveTo(c[0] - w - 0.01, c[1] + 0.025); cover.quadraticCurveTo(c[0], c[1] + 0.06, c[0] + w + 0.01, c[1] + 0.025);
      list.push([cover, col('#2a1a16'), 0.02], [p, col(PAPER, false, 0.35)]);
      return { list, z: Math.min(pr(a.W)[2], pr(J.arms[1 - i].W)[2]) };
    }
    case 'book': R(x, hp[1], 0.17, 0.12, col('#2a1a16')); return { list };
    case 'letter': {
      const p = new Path2D(), an = 0.3;
      p.moveTo(x, hp[1]); p.lineTo(x + Math.cos(an) * 0.16, hp[1] - Math.sin(an) * 0.16); p.lineTo(x + Math.cos(an) * 0.16 + Math.sin(an) * 0.1, hp[1] - Math.sin(an) * 0.16 + Math.cos(an) * 0.1); p.lineTo(x + Math.sin(an) * 0.1, hp[1] + Math.cos(an) * 0.1); p.closePath();
      list.push([p, col(PAPER, false, 0.4)]);
      return { list };
    }
    case 'mirror': {
      // a small hand mirror: the handle in the fist, the glass catching a cold light
      const tip = pr(madd(a.W, dir, 0.16)), gl = new Path2D();
      L(hp[0], hp[1], tip[0], tip[1], 0.016, col(WOOD));
      const c = pr(madd(a.W, dir, 0.22)); gl.ellipse(c[0], c[1], 0.055, 0.07, Math.atan2(dir[0], -dir[1]), 0, TAU);
      list.push([gl, col('#3a3226')]);
      const sh = new Path2D(); sh.ellipse(c[0], c[1], 0.042, 0.056, Math.atan2(dir[0], -dir[1]), 0, TAU); list.push([sh, col('#a8b0b8', false, 0.5)]);
      return { list };
    }
    case 'bag': {
      // the doctor's bag hanging from the hand, swinging and settling
      const sx = lag[0] * 1.4, cx = x + sx, top = hp[1] + 0.06, p = new Path2D(), hd = new Path2D();
      p.moveTo(cx - 0.17, top + 0.03); p.quadraticCurveTo(cx, top - 0.02, cx + 0.17, top + 0.03); p.lineTo(cx + 0.19, top + 0.22); p.lineTo(cx - 0.19, top + 0.22); p.closePath();
      hd.moveTo(cx - 0.05, top + 0.005); hd.quadraticCurveTo(x, hp[1] - 0.04, cx + 0.05, top + 0.005);
      list.push([hd, col(LEATHER), 0.014], [p, col(LEATHER)], [new Path2D(`M${cx - 0.17} ${top + 0.06}L${cx + 0.17} ${top + 0.06}`), col(BRASS), 0.008]);
      return { list };
    }
    case 'key': {
      const tip = pr(madd(a.W, dir, 0.16)), ring = new Path2D(); ring.arc(hp[0], hp[1], 0.022, 0, TAU);
      L(hp[0], hp[1], tip[0], tip[1], 0.01, col(IRON)); L(tip[0], tip[1], tip[0] + 0.025, tip[1], 0.012, col(IRON)); list.push([ring, col(IRON), 0.008]);
      return { list };
    }
    case 'screwdriver': {
      // down from the fist, onto the screw
      const bot = [hp[0], hp[1] + 0.17];
      L(hp[0], hp[1] - 0.03, hp[0], hp[1] + 0.06, 0.028, col(WOOD)); L(hp[0], hp[1] + 0.06, bot[0], bot[1], 0.007, col('#6a6a6a'));
      return { list };
    }
  }
  return null;
}
// ===== the horse: the narrator's dark horse — legs driven by the way gone =====
// gaits: [phase offsets of LF, RF, LH, RH], duty (part of the stride a hoof is down), stride (× withers height)
const GAITS = {
  walk: { off: [0.25, 0.75, 0.0, 0.5], duty: 0.64, stride: 1.05, lift: 0.1 },
  trot: { off: [0.0, 0.5, 0.5, 0.0], duty: 0.44, stride: 1.55, lift: 0.18 },
  canter: { off: [0.55, 0.3, 0.0, 0.3], duty: 0.38, stride: 2.0, lift: 0.2 },
  gallop: { off: [0.45, 0.55, 0.0, 0.1], duty: 0.3, stride: 3.2, lift: 0.22 },
};
const HORSE = { Hw: 1.6, col: { coat: '#241c18', mane: '#141110', hoof: '#151312' } };
function horseGait(s, Hw, force) {
  const k = Math.sqrt(Hw / 1.55);
  if (force && GAITS[force]) return force;
  return s < 2.1 * k ? 'walk' : s < 4.6 * k ? 'trot' : s < 8 * k ? 'canter' : 'gallop';
}
// a horse as it is now (S: what stepHorse keeps): its hooves, body, neck and head, as seen (pr: body frame → element
// metres), the saddle
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
  const bodyP = v => { let q = [v[0], v[1] + bob + breath * (v[1] > 0.6 * Hw ? 1 : 0), v[2]]; if (Math.abs(pitch) > 1e-4) q = add(hip, mv(R, sub(q, hip))); return q; };
  // the neck and head: nodding with the walk, down to graze, tossed
  const nod = move * (gname === 'walk' ? 0.08 * Math.sin(2 * cyc + 0.8) : gname === 'trot' ? 0.03 * Math.sin(2 * cyc) : 0.14 * Math.sin(cyc + 1.4));
  const idleHead = (1 - move) * held(t, 0.15, seed + 2) * 0.12;
  const tossA = toss * Math.sin(t * 7) * 0.5 * Math.max(0, Math.sin(t * 2.1));
  const neckA = 0.85 - 1.25 * graze + nod + idleHead + tossA - rear * 0.35; // radians, up from horizontal
  const headYaw = clamp((fhead - fh) * 1.2, -0.6, 0.6) + (1 - move) * held(t, 0.12, seed + 5) * 0.25 * (1 - graze);
  const nb = [0, 0.84 * Hw, 0.46 * Hw], nl = 0.6 * Hw;
  const neckDir = [0, Math.sin(neckA), Math.cos(neckA)];
  const Ry = rotY(headYaw);
  const poll = add(nb, mv(Ry, mul(neckDir, nl)));
  const headA = neckA - 1.85 - toss * 0.3 + graze * 0.55; // the head hangs down from the poll
  const muzzle = add(poll, mv(Ry, [0, Math.sin(headA) * 0.5 * Hw, Math.cos(headA) * 0.5 * Hw]));
  // ---- projection ----
  const c = Math.cos(fh), sn = Math.sin(fh), view = o.view ?? 0.14;
  const pr = p => { const X = -p[0] * c + p[2] * sn, Z = -p[0] * sn - p[2] * c; return [ox + X, oy - p[1] - Z * view * (1 - p[1] / 1.7), Z]; };
  const circ = (p, r) => { const q = pr(p); return [q[0], q[1], r]; };
  const zB = pr(bodyP([0, 0.75 * Hw, 0]))[2];
  const saddle3 = bodyP([0, 0.98 * Hw, 0.08 * Hw]), saddle = pr(saddle3);
  return { roots, hooves, bob, bodyP, neckA, nb, Ry, poll, headA, muzzle, sn, view, pr, circ, zB, saddle3, saddle };
}
// ===== the horse on engine 2: a rig of layers its animate moves =====
// The narrator's dark horse, built as the old one was — masses of rounds (the forehand, the barrel, the quarters), the
// neck along its arched crest, the head, the ears, the mane, the tail, four legs of three bones and a hoof — each round a
// layer painted once (a round is a round from any side) and each piece between two rounds a tapered limb painted once
// along its length; horseLive() moves them every frame where the horse's 3D frame (horseFrame: its gait from how fast
// its place goes, its turn, the bob and the nod of its walk, its poses) puts them as seen — turned, stretched along their
// length as they are foreshortened. Nothing painted again. The legs are painted twice — the far side's, darker, before
// the body, the near side's after it; each shows on the side it is on now.
const HORSE_MASSES = [
  [[0, 0.79, 0.53, 0.16], [0, 0.63, 0.42, 0.14], [0, 0.91, 0.3, 0.115], [0.07, 0.62, 0.42, 0.12], [-0.07, 0.62, 0.42, 0.12], [0, 0.78, 0.25, 0.17]],
  [[0, 0.84, 0.05, 0.13], [0, 0.73, 0.1, 0.19], [0, 0.68, -0.08, 0.17], [0, 0.78, -0.25, 0.14], [0, 0.71, 0.25, 0.17]],
  [[0, 0.875, -0.42, 0.13], [0, 0.79, -0.53, 0.18], [0, 0.72, -0.63, 0.13], [0.06, 0.6, -0.48, 0.12], [-0.06, 0.6, -0.48, 0.12], [0, 0.74, -0.33, 0.15]],
];
// all the body's rounds, and which of them are joined: those whose rounds meet (the body is rigid: once)
const HORSE_BODY = HORSE_MASSES.flat();
const HORSE_JOINS = [];
for (let i = 0; i < HORSE_BODY.length; i++) for (let j = i + 1; j < HORSE_BODY.length; j++) {
  const [a, b] = [HORSE_BODY[i], HORSE_BODY[j]], d = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  if (d < a[3] + b[3]) HORSE_JOINS.push([i, j]);
}
// the horse's pieces in its own frame F (horseFrame's) — each [A, B] (3D, its body frame) and its radii; a round is A alone
function horsePieces(F, S, Hw, lag) {
  const P = [], disc = (name, a, r, col) => P.push({ name, a, b: null, r0: r, r1: r, col }), limb = (name, a, b, r0, r1, col) => P.push({ name, a, b, r0, r1, col });
  const { bodyP, nb, poll, Ry, neckA, headA, muzzle, roots, hooves } = F;
  // the body: its rounds (the forehand's, the barrel's, the quarters'), each joined to every round near it — the
  // outline smooth over them, the dip of the back and the tuck of the belly kept
  const rounds = HORSE_BODY.map(([x, y, z, r]) => [bodyP([x * Hw, y * Hw, z * Hw]), r * Hw]);
  rounds.forEach(([p, r], i) => disc(`horse:b${i}`, p, r, 'coat'));
  for (const [i, j] of HORSE_JOINS) limb(`horse:b${i}_${j}`, rounds[i][0], rounds[j][0], rounds[i][1], rounds[j][1], 'coat');
  // the neck: thick at the shoulder, arched along the crest
  const arch = u => add(lerp3(nb, poll, u), mv(Ry, [0, Math.sin(PI * u) * 0.06 * Hw * Math.cos(neckA), -Math.sin(PI * u) * 0.04 * Hw]));
  const NP = 6, neck = [];
  for (let j = 0; j <= NP; j++) { const u = j / NP; neck.push([bodyP(arch(u)), mix(0.2, 0.07, Math.pow(u, 0.8)) * Hw]); }
  neck.push([bodyP(add(nb, [0, -0.1 * Hw, 0.06 * Hw])), 0.17 * Hw]);
  const neckParts = [];
  neck.forEach(([p, r], i) => neckParts.push(() => disc(`horse:n${i}`, p, r, 'coat')));
  for (let i = 0; i < NP; i++) neckParts.push(() => limb(`horse:nj${i}`, neck[i][0], neck[i + 1][0], neck[i][1], neck[i + 1][1], 'coat'));
  for (const i of [0, 1, 2]) neckParts.push(() => limb(`horse:nb${i}`, neck[NP + 1][0], neck[i][0], neck[NP + 1][1], neck[i][1], 'coat'));
  // the head: its rounds from the poll to the muzzle, each joined to the next
  const hd = norm(sub(muzzle, poll)), hup = mv(Ry, [0, Math.cos(headA), -Math.sin(headA)]);
  const hpt = (a, b) => bodyP(add(poll, add(mul(hd, a * Hw), mul(hup, b * Hw))));
  const head = [[hpt(0, 0), 0.07 * Hw], [hpt(0.13, -0.03), 0.105 * Hw], [hpt(0.36, 0.02), 0.065 * Hw], [hpt(0.47, -0.005), 0.06 * Hw], [hpt(0.08, 0.05), 0.06 * Hw]];
  // the mane: a strip along the crest, stirring and lagging
  const mane = [];
  for (let j = 0; j <= 7; j++) {
    const u = 0.04 + 0.92 * j / 7, q = bodyP(arch(u)), rr = mix(0.2, 0.07, Math.pow(u, 0.8)) * Hw, cn = mv(Ry, [0, Math.cos(neckA), -Math.sin(neckA)]);
    mane.push(add(add(q, mul(cn, rr * 0.9)), [noise(S.t * 0.7 + j * 0.6, S.seed) * 0.006 * Hw - lag.mane * u, 0, 0]));
  }
  // the tail: hangs and lags, swishes
  const troot = bodyP([0, 0.93 * Hw, -0.66 * Hw]), swish = (1 - S.move * 0.5) * (noise(S.t * 0.9, S.seed + 9) * 0.6 + Math.max(0, held(S.t, 0.2, S.seed + 4)) * Math.sin(S.t * 6) * 0.5);
  const tail = [troot];
  for (let j = 1; j <= 5; j++) {
    const u = j / 5;
    tail.push(add(troot, [swish * 0.08 * Hw * u * u - lag.tail[0] * u * u * 1.6, -0.5 * Hw * u - Math.abs(lag.tail[0]) * u * 0.8, -0.06 * Hw * u - S.move * 0.18 * Hw * u * (S.gname === 'walk' ? 0.3 : 1)]));
  }
  // the legs: the upper limb, the knee or hock, the cannon, the fetlock, the hoof folding back as it lifts
  const legs = roots.map((r0, i) => {
    const front = i < 2, hv = hooves[i], root = bodyP(r0);
    let fet = hv.p;
    if (front && S.rear > 0.01) fet = lerp3(fet, bodyP(add(r0, [0, -0.36 * Hw, 0.14 * Hw])), sm(S.rear));
    const lu = (front ? 0.275 : 0.3) * Hw, ll = (front ? 0.265 : 0.285) * Hw;
    const [knee, f2] = ik3(root, [fet[0], fet[1] + 0.045 * Hw, fet[2]], lu, ll, front ? [0, 0, 1] : [0, 0, -1]);
    const fold = Math.sin(PI * hv.fold) * S.move * (front ? 1 : 0.6);
    const hoof = [f2[0], f2[1] - 0.06 * Hw * (1 - fold), f2[2] - 0.05 * Hw * fold - 0.01 * Hw];
    return { root, knee, f2, hoof };
  });
  const legParts = set => legs.forEach((L, i) => {
    const col = set === 'far' ? 'far' : 'coat';
    limb(`horse:${set}${i}a`, L.root, L.knee, 0.1 * Hw, 0.045 * Hw, col);
    limb(`horse:${set}${i}b`, L.knee, L.f2, 0.045 * Hw, 0.033 * Hw, col);
    limb(`horse:${set}${i}c`, L.f2, L.hoof, 0.036 * Hw, 0.03 * Hw, col);
    disc(`horse:${set}${i}h`, L.hoof, 0.036 * Hw, 'hoof');
  });
  // in the order drawn: the far legs, the tail, the body, the neck, the mane, the head, the ears, the near legs
  legParts('far');
  for (let j = 0; j < 5; j++) limb(`horse:t${j}`, tail[j], tail[j + 1], mix(0.04, 0.075, j / 5) * Hw, mix(0.04, 0.075, (j + 1) / 5) * Hw, 'mane');
  const body = P.length;
  neckParts.forEach(f => f());
  for (let j = 0; j < 7; j++) limb(`horse:mane${j}`, mane[j], mane[j + 1], 0.03 * Hw, 0.03 * Hw, 'mane');
  head.forEach(([p, r], i) => disc(`horse:h${i}`, p, r, 'coat'));
  head.forEach(([p, r], i) => { const [q, r2] = head[(i + 1) % head.length]; limb(`horse:hj${i}`, p, q, r, r2, 'coat'); });
  [1, -1].forEach((sd, k) => limb(`horse:ear${k}`, bodyP(add(poll, mv(Ry, [sd * 0.03 * Hw, 0.03 * Hw, -0.01 * Hw]))), bodyP(add(poll, mv(Ry, [sd * 0.04 * Hw, 0.12 * Hw, -0.02 * Hw]))), 0.025 * Hw, 0.007 * Hw, 'coat'));
  legParts('near');
  P.body = body;
  return { pieces: P, legs };
}
// the horse at rest, side on: what its pieces are painted as (their lengths)
function horseRest(o) {
  const Hw = o.height || HORSE.Hw, S = { t: 0, B: HORSE, Hw, seed: 1, s: 0, gname: 'walk', prev: 'walk', gw: 1, stride: GAITS.walk.stride * Hw, ph: 0, move: 0, fh: PI / 2, fhead: PI / 2, graze: 0, toss: 0, rear: 0, rest: 0 };
  return horsePieces(horseFrame({ view: 0 }, S), S, Hw, { mane: 0, tail: [0, 0] });
}
// the horse painted once: each piece a layer (its id's, or o.id: "<id>:…"), a round about its middle, a limb from its
// first end up its length. o: { height (withers, 1.6 m), col: { coat, mane, hoof }, light (0 a silhouette of o.dark …
// 1 its own colours; 0.35), dark }
function horse(g, e, o = {}) {
  // its colours in the light it is in (o.light: 0 a silhouette of o.dark … 1 its own colours), the far side darker
  const C = { ...HORSE.col, ...(o.col || {}) }, lit = clamp(o.light ?? 0.35) * 0.92, dk = rgbOf(o.dark || DARK);
  const lay = (c, k) => rgbOf(c).map((v, i) => mix(dk[i], v, k));
  const cols = { coat: lay(C.coat, lit), far: lay(C.coat, lit * 0.78), mane: lay(C.mane, lit), hoof: lay(C.hoof, lit) };
  for (const p of horseRest(o).pieces) {
    const col = cols[p.col];
    if (!p.b) {
      e.layer(p.name, { pivot: [0, 0], box: [-p.r0, -p.r0, p.r0, p.r0] }, g2 => {
        // a round: lighter toward the sky, its edge soft
        const gr = g2.createRadialGradient(-p.r0 * 0.3, -p.r0 * 0.35, 0, 0, 0, p.r0);
        gr.addColorStop(0, css(...col.map(v => Math.min(255, v * 1.25)))); gr.addColorStop(0.75, css(...col)); gr.addColorStop(1, css(...col.map(v => v * 0.8)));
        g2.fillStyle = gr; g2.beginPath(); g2.arc(0, 0, p.r0, 0, TAU); g2.fill();
      });
    } else {
      const L = len(sub(p.b, p.a)) || 0.01, r = Math.max(p.r0, p.r1);
      e.layer(p.name, { pivot: [0, 0], box: [-r, -L - p.r1, r, p.r0] }, g2 => {
        // a limb up its length: rounder in the middle of its width
        const gr = g2.createLinearGradient(-r, 0, r, 0);
        gr.addColorStop(0, css(...col.map(v => v * 0.8))); gr.addColorStop(0.45, css(...col.map(v => Math.min(255, v * 1.12)))); gr.addColorStop(1, css(...col.map(v => v * 0.8)));
        const path = new Path2D(); taper(path, 0, 0, p.r0, 0, -L, p.r1);
        g2.fillStyle = gr; g2.fill(path);
      });
    }
  }
}
// horseLive(e, o) — the horse's animate: its gait from how fast its place goes, its turn, its poses — o: { face
// (degrees: 0 toward the eye, 90 to the right, 180 away — the old way), keys: [across, distance] (its place's state
// keys), toss, graze, rear, rest (0…1), gait (forced), height, view (how much the ground tilts toward the eye; default
// 1.7 / its distance from the eye) }. Marks its points: saddle (its seat), stirrups (where a rider's feet are: a person
// riding it stands there — their hips at the saddle, `<id>_on`), head, rump. → its gait's name
function horseLive(e, o = {}) {
  // (nothing yet: not painted)
  if (!e.layer('horse:b0').scaleX) return null;
  const m = e.mem, dt = Math.min(0.1, Math.max(0, e.dt)), t = e.t, Hw = o.height || HORSE.Hw, seed = 1;
  const keys = o.keys || [], sp = keys.length ? Math.hypot(e.speed(keys[0]) || 0, keys[1] ? e.speed(keys[1]) || 0 : 0) : 0;
  // turning on the spot it steps round too (the turn counts as way gone)
  const s = spring(m, 'v', Math.max(sp, Math.abs(m.f?.v || 0) * 0.5 * Hw), 4, 1, dt);
  const gname = horseGait(s, Hw, o.gait), G0 = GAITS[gname];
  const gw = m.gait === gname ? spring(m, 'gw', 1, 6, 1, dt) : ((m.gait = gname), (m.gw = { x: 0, v: 0 }), 0);
  const prev = m.prev || gname, prevG = GAITS[prev];
  if (gw > 0.98) m.prev = gname;
  const stride = mix(prevG.stride, G0.stride, gw) * Hw;
  m.ph = ((m.ph ?? 0.3) + s * dt / stride) % 1;
  const move = sm2(s, 0.04, 0.45), faceT = deg(o.face ?? 90), fh = springA(m, 'f', faceT, 3.5, 1, dt), fhead = springA(m, 'fh', faceT, 6, 0.8, dt);
  const pw = name => spring(m, 'p:' + name, clamp(o[name] ?? 0), 7, 0.7, dt);
  const S = { t, B: HORSE, Hw, seed, s, gname, prev, gw, stride, ph: m.ph, move, fh, fhead, graze: pw('graze'), toss: pw('toss'), rear: pw('rear'), rest: pw('rest') };
  const spot = e.spot, eye = Math.max(2, (spot?.distance ?? 10) - (e.state.camera_z ?? 0));
  const F = horseFrame({ view: o.view ?? Math.min(0.5, 1.7 / eye) }, S);
  const across = keys.length ? e.state[keys[0]] ?? 0 : 0;
  const lag = { mane: clamp(dangle(m, 'mane', across, 0, 6, 0.3, dt)[0], -0.1, 0.1) * 0.5, tail: dangle(m, 'tail', across + F.pr(F.bodyP([0, 0.9 * Hw, -0.68 * Hw]))[0], -(0.9 * Hw + F.bob), 4, 0.25, dt) };
  const { pieces, legs } = horsePieces(F, S, Hw, lag), rest = HORSE_REST.get(Hw) || HORSE_REST.set(Hw, horseRest(o).pieces).get(Hw);
  const zB = F.pr(F.bodyP([0, 0.75 * Hw, 0]))[2], far = legs.map(L => F.pr(L.root)[2] > zB);
  pieces.forEach((p, i) => {
    const h = e.layer(p.name), A = F.pr(p.a);
    let show = 1;
    const leg = /^horse:(far|near)(\d)/.exec(p.name);
    if (leg) show = (leg[1] === 'far') === far[+leg[2]] ? 1 : 0;
    h.alpha = show;
    if (!p.b) { h.x = A[0]; h.y = A[1]; return; }
    const B = F.pr(p.b), dx = B[0] - A[0], dy = B[1] - A[1], L0 = len(sub(rest[i].b, rest[i].a)) || 0.01;
    h.x = A[0]; h.y = A[1]; h.rotate = Math.atan2(dx, -dy); h.scaleY = Math.max(0.02, Math.hypot(dx, dy) / L0);
  });
  // its points: the saddle, where a rider's feet hang (their hips at the saddle), its head, its rump
  const sd = F.saddle, P2 = p => F.pr(p);
  e.at(sd[0], sd[1], 'saddle');
  e.at(sd[0], sd[1] + (o.seat ?? 0.75), 'stirrups');
  const hd = P2(F.bodyP(lerp3(F.poll, F.muzzle, 0.4))), rp = P2(F.bodyP([0, 0.9 * Hw, -0.62 * Hw]));
  e.at(hd[0], hd[1], 'head');
  e.at(rp[0], rp[1], 'rump');
  return gname;
}
const HORSE_REST = new Map();

// ===== a still figure: the old puppet, in one pose, painted once =====
// figure(g, e, o) — someone of the cast standing as the old 2D puppet drew them, in one moment of a pose (no time):
// a vision in a reflection, a figure in a painting — o as the old people's options (who, at [x, 0] in its element's
// metres or x, face, pose, wear, build, light, dark, rim, rimDir, key, alpha, shadow…); o.id names it (several in one
// element: each its own). Its breath, if it has any, is its layer's (the scene's animate).
function figure(g, e, o = {}) {
  const id = o.id ?? e.id ?? (o.who || 'narrator');
  MEM.delete(id);
  stepPerson({ ...o, id, t: 0, frozen: true }, 0, () => {});
  person(g, { id: e.id, t: 0, px: o.px ?? 0.004, light: o.glows === false ? null : e.light, warn: e.warn }, { ...o, id });
}

// ===== things on their own =====
// prop(g, e, what, o) — a thing standing on its own (on a table, on the floor): 'candle', 'candlestick', 'lamp', 'torch',
// 'guitar' (upright on its foot), 'book', 'letter', 'mirror', 'bag', 'key', 'screwdriver' — at (o.x, o.y), turned
// o.angle degrees, in the light o.light (0 silhouette … 1 daylight colours), o.dark. Its flames (and their light, e.light
// where they burn: the scene's light "of" it) are a layer of their own that flickers and wavers on the GPU — o.flame:
// its name (default '<what>:flame'), or false: painted in place (when the prop is painted inside a layer of the scene's).
// o.glow — how much they burn (0: out).
function prop(g, e, what, o = {}) {
  const x = o.x || 0, y = o.y || 0, an = deg(o.angle || 0);
  const col = colourer(o, { col: {} }), list = [];
  list.flames = o.flame === false ? null : [];
  const isFlame = c => c === FLAME || c === CORE || c === '#d0601e' || String(c).startsWith('rgba(36,32,30');
  g.save(); g.translate(x, y); g.rotate(an);
  const T = g.getTransform();
  if (what === 'guitar') guitarAt(list, col, 0, -0.25, 0, 1, 1);
  else {
    const fake = { W: [0, -0.0795, 0], E: [0, -0.3, 0] };
    const J = { lagHand: [[0, 0], [0, 0]], t: 0, arms: [fake, fake] };
    const res = propInHand(what, fake, J, 0, p => [p[0], -p[1], 0], 1.7, col, { light: e.light && ((lx, ly, ...r) => e.light(x + lx, y + ly, ...r)) }, { glow: o.glow ?? 1 });
    // (its flames and their smoke apart, for their layer)
    if (res) for (const it of res.list) (list.flames && isFlame(it[1]) ? list.flames : list).push(it);
  }
  const draw = (G, items) => { for (const [path, cl, lw] of items) { if (lw) { G.strokeStyle = cl; G.lineWidth = lw; G.lineCap = 'round'; G.stroke(path); } else { G.fillStyle = cl; G.fill(path); } } };
  draw(g, list);
  g.restore();
  if (list.flames?.length) {
    e.layer(o.flame || `${what}:flame`, { flicker: 0.35, shimmer: 0.4 }, g2 => { g2.setTransform(T); draw(g2, list.flames); });
  }
}

// ===== what the kit offers =====
return {
  horse, horseLive, figure, prop,
  // the cast as the old puppet has it (figure's who), its poses and walking styles
  poses: MOTIONS, styles: STYLES, cast: CAST,
};
