// closeups — painted close-ups of the cast for the key moments: faces, hands and the things they hold, as an insert of
// engine 2 (closeups.md says how a scene shows one). The body of function (anim) returning the kit: paint(g, e, shot) —
// the insert's painting, once for its state, its layers what moves; live(e, shot, now) — its animate: the life in it
// (a flame's breath, breath, blinks, glances, speech, a tear, hands), every frame, nothing painted again.
const { clamp, mix, noise, drift, hash } = anim;
const PI = Math.PI;
// a stage height on a 4K screen, px: how fine what is painted as an image (a face's form, its hair, a hand) is made
const PXH = 2160;
const sm = u => { u = clamp(u); return u * u * (3 - 2 * u); };
const rgb = h => [parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255];
const css = (c, a = 1) => `rgba(${clamp(c[0]) * 255 | 0},${clamp(c[1]) * 255 | 0},${clamp(c[2]) * 255 | 0},${clamp(a)})`;
const mix3 = (a, b, u) => [mix(a[0], b[0], u), mix(a[1], b[1], u), mix(a[2], b[2], u)];
const mul3 = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const lum = c => c[0] * 0.3 + c[1] * 0.59 + c[2] * 0.11;
const norm = v => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
// a smooth curve through knots [[x, value], …] (x rising), flat beyond the ends
function curve(k) {
  const n = k.length;
  return x => {
    if (x <= k[0][0]) return k[0][1];
    if (x >= k[n - 1][0]) return k[n - 1][1];
    let i = 0;
    while (x > k[i + 1][0]) i++;
    const t = (x - k[i][0]) / (k[i + 1][0] - k[i][0]), p0 = k[Math.max(0, i - 1)][1], p1 = k[i][1], p2 = k[i + 1][1], p3 = k[Math.min(n - 1, i + 2)][1];
    return 0.5 * (2 * p1 + (p2 - p0) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (3 * p1 - p0 - 3 * p2 + p3) * t * t * t);
  };
}
// steady smooth noise over the plane, −1…1
function noise2(x, y, seed) {
  const i = Math.floor(x), j = Math.floor(y), u = x - i, v = y - j, su = u * u * (3 - 2 * u), sv = v * v * (3 - 2 * v);
  const h = (a, b) => hash(a * 7919 + b * 104729, seed) * 2 - 1;
  return mix(mix(h(i, j), h(i + 1, j), su), mix(h(i, j + 1), h(i + 1, j + 1), su), sv);
}

// ---- light ----
// dir: toward the key light (x right, y down, z toward the eye); at: where it is on the card (its
// glow in the dark, its strength falling off over reach); color × power: the key; fill: the room's
// dark; rim: the light reflected back into the shadow side's edge, rimSide (+1 right, −1 left);
// hard 0…1 — how dark the shadows it casts; pool — how much light is left beyond the pool a face
// gathers it into (the rest of the frame sinks into the dark); air — what is behind, top to bottom,
// when it is not the dark (open sky)
const LIGHTS = {
  candle: { dir: [-0.36, -0.45, 0.82], at: [-1.0, -0.1], reach: 1.1, color: '#f2b47c', power: 2.0, fill: '#16120f', hard: 0.75, rim: '#4c5a66', rimSide: 1, flicker: 0.6, pool: 0.14 },
  window: { dir: [0.48, -0.6, 0.64], at: [1.0, -0.6], reach: 1.4, color: '#b2c0c8', power: 1.85, fill: '#101417', hard: 0.55, rim: '#5e4c40', rimSide: -1, flicker: 0, pool: 0.16 },
  torch: { dir: [-0.62, 0.12, 0.78], at: [-0.95, 0.35], reach: 1.2, color: '#f6a864', power: 2.2, fill: '#130f0d', hard: 0.75, rim: '#34444c', rimSide: 1, flicker: 1, pool: 0.14 },
  lamp: { dir: [0.32, 0.55, 0.77], at: [0.45, 0.85], reach: 1.0, color: '#f2b478', power: 2.3, fill: '#0f0d0c', hard: 0.78, rim: '#6a8296', rimSide: 1, flicker: 0.35, pool: 0.1 },
  day: { dir: [0.25, -0.6, 0.76], at: [0.4, -1.2], reach: 3, color: '#c4cacd', power: 1.2, fill: '#4a545c', hard: 0.25, air: ['#9aa3a8', '#6c767c'], rim: '#9aa4aa', rimSide: 1, flicker: 0, pool: 0.7 },
  door: { dir: [-0.58, -0.12, 0.8], at: [-0.95, 0.25], reach: 1.2, color: '#c0a890', power: 1.5, fill: '#0e1215', hard: 0.8, rim: '#9fb4c4', rimSide: 1, flicker: 0.5, pool: 0.18 },
};
const specOf = spec => (typeof spec === 'string' ? LIGHTS[spec] || LIGHTS.candle : { ...(LIGHTS[spec?.like] || LIGHTS.candle), ...spec });
function lightOf(spec, flash) {
  const p = specOf(spec), fl = 1;
  const k = norm(p.dir);
  const L = { k, h: norm([k[0], k[1], k[2] + 1]), kc: rgb(p.color).map(v => v * p.power * fl), at: p.at, reach2: p.reach * p.reach, f: rgb(p.fill), r: rgb(p.rim), rs: p.rimSide, hard: p.hard, air: p.air, fl, poolMin: p.pool ?? 0.3, pool: null };
  // lightning: a cold white flash from the window side
  if (flash) { L.k2 = norm([0.8, -0.4, 0.45]); L.kc2 = [1.1 * flash, 1.2 * flash, 1.35 * flash]; }
  return L;
}
// pallor: a colour drained toward an ashen, faintly green grey
const pale = (c, p) => { if (!p) return c; const m = lum(c); return [mix(c[0], m * 0.97, p), mix(c[1], m * 1.01, p), mix(c[2], m * 0.99, p)]; };
// paint keeps its darks and rolls its lights off softly
const tone = v => (v < 0.55 ? Math.max(0, v) : 0.55 + 0.45 * (1 - Math.exp(-(v - 0.55) * 2.2)));
// how much of the key reaches (x, y) of the card: its fall with distance, and the pool of light a
// face gathers (beyond it the frame sinks into the dark)
function reach(L, x, y) {
  const dx = x - L.at[0], dy = y - L.at[1];
  let f = 1 / (1 + (dx * dx + dy * dy) / L.reach2);
  if (L.pool) { const px = (x - L.pool[0]) / L.pool[2], py = (y - L.pool[1]) / L.pool[2]; f *= mix(L.poolMin, 1, Math.exp(-(px * px + py * py))); }
  return f;
}
// the colour of a surface of albedo a, facing n (unit), at (x, y) on the card; occ 0…1 — how open
// it is (a socket, a fold); cast 0…1 — how much of the key is not shadowed by something before it;
// gloss — its sheen (skin's oil, a wet lip); brk — the brush's unevenness where light turns to shade
function shade(L, n, a, x = 0, y = 0, occ = 1, cast = 1, gloss = 0, brk = 0) {
  const fall = reach(L, x, y), d = n[0] * L.k[0] + n[1] * L.k[1] + n[2] * L.k[2] + brk;
  // a painter's light: it wraps the form softly, the half-tone warm where it turns, the shadow deep
  const sh = mix(1, cast, L.hard), w = Math.pow(clamp((d + 0.38) / 1.3), 1.7) * 1.15 * fall * sh * mix(0.55, 1, occ);
  const band = sm((d + 0.16) / 0.2) * (1 - sm((d - 0.12) / 0.3)) * 0.14 * fall * sh;
  const amb = (0.5 - 0.28 * n[1]) * mix(0.25 + 0.3 * (1 - L.hard), 1, occ);
  // the light thrown back from the room into the shadow side's edge
  const rm = Math.pow(1 - Math.max(0, n[2]), 2.4) * clamp(n[0] * L.rs + 0.2) * occ * 0.55;
  const hv = n[0] * L.h[0] + n[1] * L.h[1] + n[2] * L.h[2], sp = gloss ? Math.pow(Math.max(0, hv), 22) * gloss * 0.5 * w : 0;
  const out = [0, 0, 0];
  for (let i = 0; i < 3; i++) out[i] = a[i] * (L.f[i] * amb + L.kc[i] * w + L.kc[i] * band * [1, 0.5, 0.35][i]) + L.r[i] * rm * a[i] + L.kc[i] * sp;
  if (L.k2) {
    const d2 = Math.max(0, n[0] * L.k2[0] + n[1] * L.k2[1] + n[2] * L.k2[2]) * occ;
    for (let i = 0; i < 3; i++) out[i] += a[i] * L.kc2[i] * d2;
  }
  return out.map(tone);
}

// ---- soft paint ----
// a dab: a soft ellipse of colour col, its middle a, fading to nothing at its edge; hard 0…1 — how
// much of it is solid before it fades
function dab(g, x, y, rx, ry, rot, col, a, hard = 0) {
  if (a <= 0.004 || rx <= 0 || ry <= 0) return;
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(rx, ry);
  const gr = g.createRadialGradient(0, 0, 0, 0, 0, 1);
  gr.addColorStop(0, css(col, a)); gr.addColorStop(hard * 0.9, css(col, a));
  gr.addColorStop(mix(hard * 0.9, 1, 0.5), css(col, a * 0.5)); gr.addColorStop(1, css(col, 0));
  g.fillStyle = gr; g.beginPath(); g.arc(0, 0, 1, 0, 7); g.fill();
  g.restore();
}
// a smooth closed or open path through points (quadratic through the midpoints)
function smooth(g, q, closed) {
  const n = q.length;
  if (closed) {
    const m0 = [(q[n - 1][0] + q[0][0]) / 2, (q[n - 1][1] + q[0][1]) / 2];
    g.moveTo(m0[0], m0[1]);
    for (let i = 0; i < n; i++) { const a = q[i], b = q[(i + 1) % n]; g.quadraticCurveTo(a[0], a[1], (a[0] + b[0]) / 2, (a[1] + b[1]) / 2); }
    g.closePath();
    return;
  }
  g.moveTo(q[0][0], q[0][1]);
  for (let i = 1; i < n - 1; i++) g.quadraticCurveTo(q[i][0], q[i][1], (q[i][0] + q[i + 1][0]) / 2, (q[i][1] + q[i + 1][1]) / 2);
  g.lineTo(q[n - 1][0], q[n - 1][1]);
}
// many thin strokes, each its own colour, laid in a few passes of like colours (one path each)
function strands(g, list, width) {
  const bins = new Map();
  for (const s of list) {
    const k = `${Math.round(s.c[0] * 24)},${Math.round(s.c[1] * 24)},${Math.round(s.c[2] * 24)},${Math.round(s.a * 8)}`;
    if (!bins.has(k)) bins.set(k, []);
    bins.get(k).push(s);
  }
  g.lineCap = 'round'; g.lineJoin = 'round'; g.lineWidth = width;
  for (const group of bins.values()) {
    const s0 = group[0];
    g.strokeStyle = css(s0.c, s0.a); g.beginPath();
    for (const s of group) smooth(g, s.p, false);
    g.stroke();
  }
}

// ---- the life of a face on the clock: blinks, small looks ----
function blinkAt(t, seed) {
  const k = Math.floor(t / 3.7), s = k * 3.7 + 0.3 + hash(k, seed) * 2.6, u = t - s;
  if (u < 0 || u > 0.3) return 0;
  return u < 0.07 ? sm(u / 0.07) : 1 - sm((u - 0.07) / 0.23);
}
function glanceAt(t, seed) {
  const k = Math.floor(t / 1.9 + hash(seed, 3)), u = clamp((t / 1.9 + hash(seed, 3) - k) * 12);
  const at = i => [(hash(i, seed) - 0.5) * 0.5, (hash(i, seed + 1) - 0.5) * 0.3];
  const a = at(k), b = at(k - 1), w = sm(u);
  return [mix(b[0], a[0], w), mix(b[1], a[1], w)];
}

// ---- the cast ----
// male, gaunt (hollow cheeks, deep sockets), stout (full cheeks, jowls), pallor, beard — the shaven
// beard's grey on the jaw and the lip, crown — how much hair covers the crown; skin, lip, iris
// (and its radius), under — the shade of sleepless eyes, mouthW — the mouth's half-width; hair,
// brow, hairline — where the hair starts over the brow, |x| → y; head — its outline: half-width at
// heights from the crown (−0.5) to the chin (0.5); shape — the head drawn out across, down
const CAST = {
  roderick: { male: 1, gaunt: 1, stout: 0, wild: 1, pallor: 0.5, beard: 1, crown: 1, skin: '#d2cdbe', lip: '#a89498', iris: '#8c9aa0', irisR: 0.031, eyeW: 1.16, mouthW: 0.1, rough: 0.65, under: '#5c4654', hair: '#cdc8bf', brow: '#5e5650', neck: 0.16, seed: 3, shape: [0.88, 1.07],
    hairline: [[0, -0.37], [0.12, -0.38], [0.2, -0.36], [0.27, -0.27], [0.32, -0.12], [0.35, 0.06]],
    head: [[-0.5, 0.0], [-0.49, 0.09], [-0.46, 0.17], [-0.4, 0.25], [-0.3, 0.305], [-0.18, 0.322], [-0.1, 0.314], [-0.02, 0.318], [0.06, 0.326], [0.13, 0.305], [0.22, 0.28], [0.3, 0.262], [0.36, 0.245], [0.41, 0.2], [0.46, 0.13], [0.49, 0.07], [0.5, 0.0]] },
  madeline: { male: 0, gaunt: 0.55, stout: 0, wild: 0, pallor: 0.22, beard: 0, crown: 1, skin: '#e0d3c9', lip: '#b58a90', iris: '#909ca4', irisR: 0.03, eyeW: 1.04, mouthW: 0.092, rough: 0.45, under: '#8a7a96', hair: '#a0968a', brow: '#8a8078', neck: 0.135, seed: 7, shape: [0.94, 1.02],
    hairline: [[0, -0.29], [0.12, -0.285], [0.22, -0.25], [0.28, -0.16], [0.32, -0.04], [0.35, 0.1]],
    head: [[-0.5, 0.0], [-0.49, 0.09], [-0.46, 0.17], [-0.4, 0.25], [-0.3, 0.305], [-0.18, 0.322], [-0.08, 0.318], [0.02, 0.32], [0.1, 0.315], [0.2, 0.282], [0.3, 0.24], [0.37, 0.19], [0.43, 0.13], [0.475, 0.075], [0.5, 0.03]] },
  doctor: { male: 1, gaunt: 0, stout: 1, wild: 0, pallor: 0.15, beard: 0.3, crown: 0.45, skin: '#c9a594', lip: '#a6685f', iris: '#5a4a3c', irisR: 0.026, eyeW: 0.92, mouthW: 0.11, rough: 1, under: '#9a6e60', hair: '#aaa49c', brow: '#8e877f', neck: 0.24, seed: 13, shape: [1, 1],
    hairline: [[0, -0.42], [0.12, -0.41], [0.22, -0.36], [0.28, -0.22], [0.31, -0.1], [0.34, 0.0]],
    head: [[-0.5, 0.0], [-0.49, 0.1], [-0.46, 0.2], [-0.4, 0.28], [-0.3, 0.33], [-0.15, 0.35], [0, 0.36], [0.1, 0.37], [0.2, 0.37], [0.28, 0.36], [0.35, 0.33], [0.42, 0.27], [0.46, 0.2], [0.49, 0.12], [0.5, 0.06]] },
};
const outlines = new Map();
const outlineOf = who => {
  if (!outlines.has(who)) outlines.set(who, curve(CAST[who].head));
  return outlines.get(who);
};
// how far toward the eye the head's surface is at (x, y): the face's front, rounding off to the sides
const DEPTH = curve([[-0.5, 0.0], [-0.42, 0.25], [-0.3, 0.36], [-0.2, 0.4], [-0.05, 0.41], [0.1, 0.41], [0.3, 0.4], [0.42, 0.37], [0.47, 0.3], [0.5, 0.18]]);

// ---- a head in space ----
// head space: the head 1 tall, the crown at y −0.5, the chin at 0.5, x right, y down, z toward the
// eye; yaw turns it (+ to the frame's right), pitch nods it (+ down), roll tilts it
// lift — a further nod that turns the face's light (not its drawing): a face lifted far shows the
// sky on it without the underside of the jaw the head's form has no shape for
function headFrame(at, S, yaw, pitch, roll, R, zf, kx = 1, ky = 1, lift = 0) {
  const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch), cr = Math.cos(roll), sr = Math.sin(roll), cl = Math.cos(lift), sl = Math.sin(lift);
  // turned and nodded, drawn out by its proportions (kx, ky — not for directions), tilted
  const rot = (x, y, z, ax = 1, ay = 1) => {
    const x1 = (x * cy + z * sy) * ax, z1 = -x * sy + z * cy, y1 = (y * cp + z1 * sp) * ay, z2 = -y * sp + z1 * cp;
    return [x1 * cr - y1 * sr, x1 * sr + y1 * cr, z2];
  };
  const H = {
    S, R, roll, yaw, at, kx, ky, rot: { cy, sy, cp, sp },
    // a direction of the card (x right, y down, z toward the eye) in head space
    unrot: ([x, y, z]) => {
      const x1 = x * cr + y * sr, y1 = -x * sr + y * cr, z1 = y1 * sp + z * cp, y0 = y1 * cp - z * sp;
      return [x1 * cy - z1 * sy, y0, x1 * sy + z1 * cy];
    },
    z: zf || (() => 0),
    // a point of head space on the card
    P: (x, y, z) => { const p = rot(x, y, z, kx, ky); return [at[0] + p[0] * S, at[1] + p[1] * S, p[2] * S]; },
    // a point on the surface (lifted by dz)
    on: (x, y, dz = 0) => H.P(x, y, H.z(x, y) + dz),
    // a direction of head space as seen (normals)
    n: v => norm(rot(v[0], v[1] * cl + v[2] * sl, -v[1] * sl + v[2] * cl)),
  };
  return H;
}
// a soft dab laid on the head's surface at (x, y): rx, ry along its own axes turned by rot, the
// surface's turn foreshortening it
function hdab(g, H, x, y, rx, ry, rot, col, a, hard = 0, dz = 0) {
  if (a <= 0.004) return;
  const ux = Math.cos(rot), uy = Math.sin(rot);
  const A = H.on(x, y, dz), B = H.on(x + ux * rx, y + uy * rx, dz), C = H.on(x - uy * ry, y + ux * ry, dz);
  g.save(); g.transform(B[0] - A[0], B[1] - A[1], C[0] - A[0], C[1] - A[1], A[0], A[1]);
  const gr = g.createRadialGradient(0, 0, 0, 0, 0, 1);
  gr.addColorStop(0, css(col, a)); gr.addColorStop(hard * 0.9, css(col, a));
  gr.addColorStop(mix(hard * 0.9, 1, 0.5), css(col, a * 0.5)); gr.addColorStop(1, css(col, 0));
  g.fillStyle = gr; g.beginPath(); g.arc(0, 0, 1, 0, 7); g.fill();
  g.restore();
}

// face(o) — head and shoulders of who; closeups.md lists what o holds. o.to — the expressions it may go on to, each over
// the one before ([{ smile: 1, part: 0.25 }, { strain: 1 }]); live() takes it there (now.<name>.to: how far, each 0…1),
// nothing painted again. Painted as the layers live() moves (n — its name, the layers' prefix):
//   n:body (the shoulders, the coffin's bed), n:hairB (the hair behind);
//   n:skin0, n:skin1… (the head lit, its forehead's folds — as it is, then each expression: shown over it as far as it
//   has gone); n:whites, n:iris (the irises: glances), n:lids (the lids' shade, the lashes), n:blink0, n:blink1 (each
//   eye's lid shut, let down from its fold: a blink, the eyes narrowing); n:brow0, n:brow1 (moved from one
//   expression's line to the next's); n:lips0, n:lips1… (the mouth, each expression's over the one before); n:mouth (the
//   mouth open as speech opens it); n:hairF (the hair in front, the doctor's whiskers and spectacles);
//   with o.tear — n:trail, n:drop (the tear running); hands 'face' — n:cover (and n:ftears with o.tear); hands 'reach'
//   — n:reach.
function face(c, o) {
  const { L } = c, who = CAST[o.who] ? o.who : 'roderick', C = CAST[who], n = nameOf(o);
  const P = poseOf(o, C, L), { frozen, life, S, at, yaw, pitch, roll, lying, br } = P;
  const X = statesOf(o, C), wind = o.wind ?? 0, hair = rgb(C.hair), pivot = c.stage(at);
  const near = (x0, y0, x1, y1) => c.box(at[0] + x0 * S, at[1] + y0 * S, at[0] + x1 * S, at[1] + y1 * S);
  // the light gathers on the face, a little toward its side; beyond it the frame sinks into the dark
  L.pool = [at[0] + L.k[0] * S * 0.08, at[1] - S * 0.1, S * (lying ? 0.7 : 0.8)];
  // each expression's head: its form (a field of its own), the light on it (sk — a feature's colour there, once its
  // skin is painted)
  const heads = X.map(x => {
    const f = cloneField(fieldOf(who, C, [x.smile, x.strain, x.grief, x.blush]));
    const H = headFrame(at, S, yaw, pitch, roll, outlineOf(who), (px, py) => fieldAt(f.z, px, py), ...C.shape, Math.min(0, P.pitch0 + 0.1));
    H.pallor = C.pallor;
    return { x, f, H, sk: null };
  });
  const H0 = heads[0].H;
  c.layer(`${n}:body`, { pivot }, () => {
    if (lying) bed(c, H0, S);
    body(c, { ...o, ...X[0] }, H0, C, br);
  });
  if (who !== 'doctor') c.layer(`${n}:hairB`, { pivot, ...(C.wild ? { shimmer: (0.15 + 0.35 * wind) * (lying ? 0 : 1) } : {}) }, () => hairBack(c, H0, C, hair, 0, life, wind, lying));
  heads.forEach((h, k) => c.layer(`${n}:skin${k}`, { pivot }, () => {
    const { H, f, x } = h;
    if (who === 'doctor') doctorEars(c, H, rgb(C.skin));
    head(c, H, f, C);
    h.sk = (px, py, a, occ = 1) => { const l = H.lit(px, py); return pale([a[0] * l[0] * occ, a[1] * l[1] * occ, a[2] * l[2] * occ].map(tone), C.pallor * 0.5); };
    for (const s of [-1, 1]) browSkin(c, H, C, s, ...browOf(x, s), h.sk);
    if (x.blood) bloodFace(c, H, x.blood);
    // (its point: between the eyes — the game's, the camera's)
    if (!k) { const m = H.on(0, 0.004); c.e.at(m[0], m[1], o.point || `${who}_face`); }
  }));
  const sk0 = heads[0].sk, x0 = X[0], squeeze = clamp(x0.sly * 0.3);
  // the eyes as wide as they ever are in it: narrower — their lids let down (live)
  const E = [-1, 1].map(s => eyeGeom(H0, C, s, Math.max(...X.map(x => openOf(x, s))), squeeze, clamp(x0.smile - x0.strain * 0.4)));
  const gaze = o.gaze || [0, 0], tearSide = o.tearEye ?? (L.k[0] >= 0 ? 1 : -1), wetOf = s => x0.wet + (o.tear != null && tearSide === s ? 0.5 : 0) + x0.grief * 0.3;
  const eyeBox = near(-0.45, -0.32, 0.45, 0.3);
  c.layer(`${n}:whites`, { pivot, box: eyeBox }, () => E.forEach(G => eyeWhite(c, H0, C, G, sk0)));
  c.layer(`${n}:iris`, { pivot, box: eyeBox }, () => E.forEach((G, i) => eyeIris(c, H0, C, G, i ? 1 : -1, gaze, sk0, x0.fear, wetOf(i ? 1 : -1))));
  c.layer(`${n}:lids`, { pivot, box: near(-0.47, -0.36, 0.47, 0.3) }, () => E.forEach((G, i) => eyeLids(c, H0, C, G, i ? 1 : -1, sk0, wetOf(i ? 1 : -1), squeeze)));
  E.forEach((G, i) => c.layer(`${n}:blink${i}`, { pivot: c.stage(G.fold), box: eyeBox }, () => eyeShut(c, H0, C, G, i ? 1 : -1, sk0)));
  [-1, 1].forEach((s, i) => {
    const b = browOf(x0, s);
    c.layer(`${n}:brow${i}`, { pivot: c.stage(browLine(H0, s, ...b)[0]), box: near(-0.5, -0.45, 0.5, 0.05) }, () => browHair(c, H0, C, s, ...b, sk0));
  });
  const mouthBox = near(-0.32, 0.05, 0.32, 0.6);
  heads.forEach((h, k) => c.layer(`${n}:lips${k}`, { pivot, box: mouthBox }, () => mouth(c, h.H, C, h.sk, lipsOf(h.x, life, C.seed, 0))));
  // the mouth open as far as speech opens it (live() shows it as much as a syllable is open)
  c.layer(`${n}:mouth`, { pivot, box: mouthBox }, () => mouth(c, H0, C, sk0, lipsOf(x0, life, C.seed, 0.45)));
  c.layer(`${n}:hairF`, { pivot }, () => {
    if (who === 'doctor') { doctorHair(c, H0, C, hair); spectacles(c, H0); }
    else hairFront(c, H0, C, hair, 0, life, wind, lying);
  });
  if (o.tear != null) {
    const T = tearPath(o, C, L, tearSide);
    c.layer(`${n}:trail`, { pivot: c.stage(T.at(0)) }, () => tearTrail(c, T, sk0));
    c.layer(`${n}:drop`, { pivot: c.stage(T.at(0)) }, () => tearDrop(c, T, sk0));
  }
  if (o.hands === 'face') {
    c.layer(`${n}:cover`, { pivot }, () => handsOnFace(c, H0, o));
    if (o.tear != null) c.layer(`${n}:ftears`, { box: near(-0.3, 0.1, 0.3, 0.55), drift: [0, 0.04 * S * c.z] }, () => fingerTears(c, H0, S));
  }
  if (o.hands === 'reach') c.layer(`${n}:reach`, { pivot }, () => hand(c, { who, pose: 'reach', at: [at[0] + S * 0.72, at[1] + S * 1.15], size: S * 1.05, angle: -0.45, blood: x0.blood, frozen, name: o.reachPoint }));
}
// a face's name (its layers' prefix, live()'s key)
const nameOf = o => o.name || o.who || 'roderick';
// what of a face changes with its expression, as it is (its first) and each it goes on to, each over the one before
const EXPR = ['smile', 'strain', 'fear', 'grief', 'sly', 'blush', 'eyes', 'part', 'wet', 'turn', 'blood'];
function statesOf(o) {
  const x = { smile: 0, strain: 0, fear: 0, grief: 0, sly: 0, blush: 0, eyes: 0.82, part: 0, wet: 0.4, turn: 0, blood: 0 };
  for (const k of EXPR) if (o[k] != null) x[k] = o[k];
  const out = [x];
  for (const t of o.to || []) { const y = { ...out[out.length - 1] }; for (const k of EXPR) if (t[k] != null) y[k] = t[k]; out.push(y); }
  return out;
}
// the expression where live() has it: each state's numbers mixed as far as each has gone (u — now's `to`)
function blendOf(X, u, k) {
  let v = X[0][k];
  for (let i = 1; i < X.length; i++) v += clamp(u?.[i - 1] ?? 0) * (X[i][k] - X[i - 1][k]);
  return v;
}
// how open an eye is in an expression (s: its side — a sly face's one eye narrower)
const openOf = (x, s) => clamp((x.eyes + x.fear * 0.35 + x.strain * 0.15) * (1 - x.grief * 0.22), 0, 1.4) * (1 - x.sly * 0.21) - x.sly * (s > 0 ? 1 : -0.3) * 0.3;
// a brow in an expression: how far its inner and outer ends are raised, how knit (worry lifts its inner end, fear the
// whole brow, a smile a little; grief draws them in)
function browOf(x, s) {
  const ss = x.sly * (s > 0 ? 1 : -0.3);
  return [0.15 * x.smile + 0.75 * x.strain + 0.95 * x.grief + 0.9 * x.fear + ss * 0.8, 0.2 * x.smile + 0.05 * x.strain - 0.35 * x.grief + 0.75 * x.fear + ss,
    0.25 * x.strain + 0.6 * x.grief + 0.3 * x.fear + Math.max(0, -ss) * 0.8];
}
// the lips in an expression (more: opened that much more)
const lipsOf = (x, life, seed, more) => ({ smile: x.smile, strain: x.strain + x.fear * 0.3, fear: x.fear, open: clamp(x.part + x.fear * 0.45 + x.strain * 0.1 + more), grief: x.grief, sly: x.sly, t: 0, life, seed, blush: x.blush });
// a face's pose as painted — its turn (the first expression's), nod, tilt; the breath's rest — the same for live(),
// which adds what moves
function poseOf(o, C, L) {
  const frozen = clamp(o.frozen === true ? 1 : o.frozen || 0), life = 1 - frozen, lying = !!o.lying;
  const yaw = 0.4 * (o.turn ?? 0), pitch0 = 0.4 * (o.nod ?? 0) + (o.hands === 'face' ? 0.12 : 0), roll = 0.35 * (o.tilt ?? 0);
  const S = (o.size ?? 0.62) * (o.who === 'doctor' ? 1.04 : 1), at = o.at || [0, -0.04];
  return { frozen, life, lying, S, at, yaw, pitch0, pitch: clamp(pitch0, -0.1, 0.25), roll, br: (o.breath ?? 1) * 0.5 * life };
}
// a face's form of its own (fieldOf keeps one for each of the cast, made anew for each expression)
const cloneField = f => ({ ...f, z: f.z.slice(), r: f.r.slice(), g: f.g.slice(), b: f.b.slice(), gl: f.gl.slice(), nx: f.nx.slice(), ny: f.ny.slice(), occ: f.occ.slice(), shadow: null });

// the head's form: a field over head space — how far toward the eye the surface is, its colour and
// its sheen — the skull rounded off to the sides, the bones, the sockets, the features as rises and
// hollows, the painter's zones of a face and the unevenness of skin in its colour. Made once for
// each of the cast: as it is, and what a smile, strain, grief, a flush change in it; a face's field
// is their sum
const FX0 = -0.5, FY0 = -0.62, FD = 0.0065, FW = 155, FH = 187;
function fieldFor(who, C, [smile, strain, grief, blush]) {
  const G = C.gaunt, F = C.stout, M = C.male, R = outlineOf(who), HL = curve(C.hairline);
  // [x, y, sx, sy, height, turn] — mirrored for ±x when x ≠ 0
  const B = [
    // the skull, the brow, the temples
    [0.11, -0.26, 0.11, 0.1, 0.012, 0], [0.13, -0.095, 0.1, 0.03, 0.012 + M * 0.034 + G * 0.01, -0.14], [0, -0.08, 0.04, 0.03, 0.004 + M * 0.018, 0],
    [0.31, -0.16, 0.05, 0.09, -0.018 - G * 0.022, 0],
    // the socket, the eyeball in it, the lid over it, the hollow under it
    [0.145, -0.008, 0.085, 0.055, -0.07 - M * 0.02 - G * 0.02, 0.06], [0.145, 0.005, 0.046, 0.03, 0.075, 0], [0.147, -0.024, 0.052, 0.014, 0.01, 0],
    [0.13, 0.056, 0.07, 0.016, -0.008 - G * 0.012 + smile * 0.012, -0.25],
    // the cheekbone, the hollow under it, the jowl, the jaw's angle
    [0.235, 0.068, 0.075, 0.045, 0.035 + G * 0.015 + F * 0.01, 0.3], [0.215, 0.21, 0.065, 0.075, -0.055 * G + 0.035 * F, 0], [0.21, 0.34, 0.08, 0.07, 0.05 * F, 0], [0.2, 0.15, 0.08, 0.07, 0.03 * F, 0], [0.15, 0.066, 0.06, 0.018, 0.016 * F, 0], [0, 0.47, 0.14, 0.04, 0.03 * F, 0],
    [0.27, 0.37, 0.05, 0.05, 0.015 * M, 0], [0.16, 0.16, 0.065, 0.05, 0.045 * smile + 0.03 * strain, 0],
    // the nose: bridge, back, tip, wings, the hollow under it; the barrel of the mouth
    [0, -0.02, 0.028 + 0.006 * M, 0.05, 0.02 + 0.008 * M, 0], [0, 0.07, 0.03 + 0.006 * M + 0.006 * F, 0.06, 0.05 + 0.02 * M, 0], [0, 0.15, 0.026 + 0.004 * M + 0.01 * F, 0.028, 0.08 + 0.015 * M + 0.01 * F, 0],
    [0.038 + 0.004 * M + 0.008 * F, 0.172, 0.02 + 0.002 * M + 0.005 * F, 0.02, 0.045 + 0.015 * M, 0], [0, 0.208, 0.04, 0.01, -0.016, 0], [0, 0.3, 0.13, 0.09, 0.035, 0],
    // the mouth: the philtrum, the lips, the line between them, the corners, the chin under them
    [0.013, 0.243, 0.006, 0.024, 0.005, 0], [0, 0.279, 0.092, 0.017, 0.02 - 0.005 * M - 0.006 * strain, 0], [0, 0.299, 0.11, 0.005, -0.012, 0],
    [0, 0.318, 0.072, 0.017, 0.026 - 0.008 * M - 0.008 * strain, 0], [0.105 + smile * 0.02, 0.302 - smile * 0.02, 0.012, 0.012, -0.012 - 0.006 * smile, 0],
    [0, 0.36, 0.06, 0.014, -0.015, 0], [0, 0.43, 0.075 + 0.02 * M, 0.045, 0.034 + 0.01 * M, 0], [0, 0.415, 0.025, 0.02, 0.012 * grief + 0.01 * strain, 0],
    // grief: the inner brows drawn up and in, the corners of the mouth pulled down
    [0.045, -0.17, 0.05, 0.04, 0.012 * grief, 0], [0.04, -0.092, 0.022, 0.02, 0.014 * grief, 0], [0.11, 0.35, 0.02, 0.03, -0.01 * grief, 0],
  ];
  // [x0, y0, x1, y1, width, height]: a ridge or a crease along a line, mirrored — the fold from the
  // nose's wing to the corner of the mouth and the cheek over it
  const SEG = [
    [0.06, 0.185, 0.125 + 0.02 * smile, 0.33 - 0.02 * smile, 0.011, (-0.002 - 0.003 * G) * (0.4 + 0.6 * M) - 0.008 * smile - 0.006 * strain - 0.01 * F],
    [0.088, 0.18, 0.15 + 0.02 * smile, 0.31 - 0.015 * smile, 0.024, 0.006 * M + 0.02 * smile + 0.012 * strain + 0.02 * F],
  ];
  const skin = rgb(C.skin), lip = mix3(rgb(C.lip), rgb('#c86a76'), 0.55 * blush), dark = mul3(skin, 0.35), hairC = mul3(rgb(C.hair), 0.5);
  // [x, y, sx, sy, colour, weight]
  const Z = [
    [0, -0.27, 0.3, 0.13, rgb('#eadcb4'), 0.16 * (1 - C.pallor)], [0.17, 0.14, 0.12, 0.08, rgb('#d68e86'), 0.12 * (1 - C.pallor) + F * 0.35],
    [0, 0.16, 0.035, 0.03, rgb('#d0887e'), 0.14 + 0.4 * F], [0, 0.42, 0.2, 0.09, rgb('#7e868e'), 0.3 * C.beard], [0.2, 0.32, 0.07, 0.09, rgb('#7e868e'), 0.26 * C.beard],
    [0, 0.25, 0.1, 0.022, rgb('#7e868e'), 0.22 * C.beard], [0.145, 0.045, 0.075, 0.025, rgb(C.under), 0.32 + 0.28 * G], [0.085, 0.0, 0.025, 0.025, rgb(C.under), 0.35], [0.2, -0.01, 0.03, 0.03, rgb(C.under), 0.25 * G],
    [0.147, -0.034, 0.065, 0.018, rgb('#b496a2'), 0.28], [0.3, -0.17, 0.05, 0.07, rgb('#9aa0b6'), 0.25 * C.pallor],
    [0.032, 0.198, 0.01, 0.005, dark, 0.45], [0.18, 0.12, 0.085, 0.065, rgb('#e8606e'), 0.8 * blush], [0, 0.17, 0.04, 0.03, rgb('#e2707c'), 0.3 * blush], [0, 0.42, 0.06, 0.04, rgb('#e2707c'), 0.25 * blush],
    [0, 0.282, 0.078 + 0.01 * smile, 0.011, lip, 0.75], [0, 0.318, 0.064 + 0.008 * smile, 0.013, lip, 0.75],
  ];
  // the lines of age: crow's feet, the folds under the eyes [x, y, length, turn, depth]
  const LINES = F ? [[0.25, -0.01, 0.035, -0.4, 0.3], [0.255, 0.015, 0.035, 0.0, 0.3], [0.245, 0.04, 0.03, 0.4, 0.25], [0.15, 0.075, 0.05, 0.15, 0.3], [0.17, 0.095, 0.05, 0.25, 0.2]] : [];
  // [x, y, sx, sy, sheen]: where skin shines
  const GL = [[0, -0.2, 0.14, 0.1, 0.5 + 0.6 * F], [0, 0.07, 0.022, 0.1, 0.7], [0, 0.152, 0.028, 0.024, 1], [0.22, 0.06, 0.05, 0.035, 0.45], [0, 0.43, 0.05, 0.03, 0.4],
    [0, 0.322, 0.05, 0.01, 1.2], [0.15, -0.03, 0.045, 0.012, 0.5], [0, -0.42, 0.2, 0.1, F * 1.5]];
  const N = FW * FH, z = new Float32Array(N), r = new Float32Array(N), g = new Float32Array(N), b = new Float32Array(N), gl = new Float32Array(N);
  for (let j = 0; j < FH; j++) {
    const y = FY0 + j * FD, yc = clamp(y, -0.5, 0.5), rx = Math.max(0.02, R(yc)), d = y < -0.5 || y > 0.5 ? 0 : DEPTH(yc);
    for (let i = 0; i < FW; i++) {
      const x = FX0 + i * FD, q = Math.min(0.995, Math.abs(x) / rx), p = j * FW + i;
      z[p] = d * Math.pow(1 - Math.pow(q, 2.6), 1 / 2.6);
      // the skin, uneven: blotches, a little warmer or cooler here and there; the hair over the scalp
      const k = 1 + C.rough * (0.025 * noise2(x * 30, y * 30, 5) + 0.012 * noise2(x * 85, y * 85, 6)), wc = 0.03 * noise2(x * 14, y * 14, 7);
      const hz = sm((HL(Math.abs(x)) - y) / 0.03) * C.crown, hk = 0.85 + 0.15 * noise2(Math.atan2(x, y + 0.7) * 36, Math.hypot(x, y + 0.7) * 4, 8);
      r[p] = mix(skin[0] * k * (1 + wc), hairC[0] * hk, hz); g[p] = mix(skin[1] * k, hairC[1] * hk, hz); b[p] = mix(skin[2] * k * (1 - wc), hairC[2] * hk, hz);
    }
  }
  // each rise, each zone over the cells it reaches
  const over = (x0, y0, ext, f) => {
    const i0 = Math.max(0, Math.floor((x0 - ext - FX0) / FD)), i1 = Math.min(FW - 1, Math.ceil((x0 + ext - FX0) / FD));
    const j0 = Math.max(0, Math.floor((y0 - ext - FY0) / FD)), j1 = Math.min(FH - 1, Math.ceil((y0 + ext - FY0) / FD));
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) f(j * FW + i, FX0 + i * FD - x0, FY0 + j * FD - y0);
  };
  for (const [bx, by, sx, sy, a, t] of B) {
    if (!a) continue;
    for (const s of bx ? [-1, 1] : [1]) {
      const cs = Math.cos(s * t), sn = Math.sin(s * t);
      over(s * bx, by, 3 * Math.max(sx, sy), (p, dx, dy) => {
        const u = (dx * cs + dy * sn) / sx, v = (-dx * sn + dy * cs) / sy, e = u * u + v * v;
        if (e < 9) z[p] += a * Math.exp(-0.5 * e);
      });
    }
  }
  for (const [x0, y0, x1, y1, w, a] of SEG) {
    if (!a) continue;
    for (const s of [-1, 1]) {
      const ax = s * x0, bx = s * x1, du = bx - ax, dv = y1 - y0, ll = du * du + dv * dv;
      over((ax + bx) / 2, (y0 + y1) / 2, Math.hypot(du, dv) / 2 + 3 * w, (p, dx, dy) => {
        const px = dx + (bx - ax) / 2, py = dy + dv / 2, k = clamp((px * du + py * dv) / ll), ex = px - du * k, ey = py - dv * k, e = (ex * ex + ey * ey) / (w * w);
        // the crease fades out at its ends
        if (e < 9) z[p] += a * Math.exp(-0.5 * e) * Math.sin(PI * (0.08 + 0.84 * k));
      });
    }
  }
  for (const [bx, by, sx, sy, col, w] of Z) {
    if (!w) continue;
    for (const s of bx ? [-1, 1] : [1]) {
      over(s * bx, by, 3 * Math.max(sx, sy), (p, dx, dy) => {
        const u = dx / sx, v = dy / sy, e = u * u + v * v;
        if (e > 9) return;
        const k = Math.min(1, w * Math.exp(-0.5 * e));
        r[p] = mix(r[p], col[0], k); g[p] = mix(g[p], col[1], k); b[p] = mix(b[p], col[2], k);
      });
    }
  }
  for (const [lx, ly, ll, lt, ld] of LINES) for (const s of [-1, 1]) {
    const cs = Math.cos(s * lt), sn = Math.sin(s * lt);
    over(s * lx, ly, ll * 1.5, (p, dx, dy) => {
      const u = (dx * cs + dy * sn) / ll, v = (-dx * sn + dy * cs) / 0.004, k = ld * Math.exp(-0.5 * (u * u * u * u + v * v));
      r[p] *= 1 - k; g[p] *= 1 - k * 1.1; b[p] *= 1 - k * 1.1;
    });
  }
  for (const [bx, by, sx, sy, w] of GL) {
    if (!w) continue;
    for (const s of bx ? [-1, 1] : [1]) over(s * bx, by, 3 * Math.max(sx, sy), (p, dx, dy) => { const u = dx / sx, v = dy / sy; gl[p] += w * Math.exp(-0.5 * (u * u + v * v)); });
  }
  return [z, r, g, b, gl];
}
// the face's field as its expression has it: the field as it is, plus each change by its weight;
// with the slope (nx, ny), how open each cell is (occ) and the brush's unevenness (brush)
const fields = new Map();
function fieldOf(who, C, ex) {
  if (!fields.has(who)) {
    const base = fieldFor(who, C, [0, 0, 0, 0]), N = FW * FH, brush = new Float32Array(N);
    // the brush: short strokes along the form, their marks a little lighter or darker
    for (let j = 0; j < FH; j++) for (let i = 0; i < FW; i++) {
      const x = FX0 + i * FD, y = FY0 + j * FD, a = 0.5 + 1.4 * x + 0.6 * (y - 0.1), ca = Math.cos(a), sa = Math.sin(a), u = (x * ca + y * sa) * 22, v = (-x * sa + y * ca) * 70;
      brush[j * FW + i] = 0.7 * noise2(u, v, 21) + 0.3 * noise2(u * 2.3, v * 2.3, 22);
    }
    fields.set(who, { base, deltas: [], now: base.map(a => new Float32Array(a)), nx: new Float32Array(N), ny: new Float32Array(N), occ: new Float32Array(N), brush, ex: null });
  }
  const F = fields.get(who), key = ex.map(v => v.toFixed(3)).join();
  // what each change does, made the first time it is asked for
  ex.forEach((w, k) => { if (w && !F.deltas[k]) F.deltas[k] = fieldFor(who, C, [0, 1, 2, 3].map(i => (i === k ? 1 : 0))).map((a, m) => a.map((v, p) => v - F.base[m][p])); });
  if (F.ex !== key) {
    F.ex = key;
    for (let m = 0; m < F.now.length; m++) {
      const out = F.now[m];
      out.set(F.base[m]);
      ex.forEach((w, k) => { if (w) { const d = F.deltas[k][m]; for (let p = 0; p < out.length; p++) out[p] += w * d[p]; } });
    }
    // the slope: of the form, and of the form softened (skin lets the light through: its turns are soft)
    const z = F.now[0], zb = blur(blur(z, FW, FH, 4), FW, FH, 4), R = 5, R2 = 11;
    for (let j = 0; j < FH; j++) for (let i = 0; i < FW; i++) {
      const p = j * FW + i, l = i > 0 ? p - 1 : p, rr = i < FW - 1 ? p + 1 : p, u = j > 0 ? p - FW : p, d = j < FH - 1 ? p + FW : p;
      const sx = (rr - l) * FD, sy = ((d - u) / FW) * FD;
      F.nx[p] = -mix(z[rr] - z[l], zb[rr] - zb[l], 0.7) / sx; F.ny[p] = -mix(z[d] - z[u], zb[d] - zb[u], 0.7) / sy;
      // a hollow: lower than what is round it
      const ring = r => (z[j * FW + Math.max(0, i - r)] + z[j * FW + Math.min(FW - 1, i + r)] + z[Math.max(0, j - r) * FW + i] + z[Math.min(FH - 1, j + r) * FW + i]) / 4 - z[p];
      F.occ[p] = clamp(1 - Math.max(0, ring(R)) * 7 - Math.max(0, ring(R2)) * 4, 0.25, 1);
    }
  }
  const [z, r, g, b, gl] = F.now;
  return Object.assign(F.out || (F.out = {}), { z, r, g, b, gl, nx: F.nx, ny: F.ny, occ: F.occ, brush: F.brush, key });
}
// a grid of w × h values blurred: the mean over 2r + 1 cells across, then down
function blur(a, w, h, r) {
  const t = new Float32Array(a.length), o = new Float32Array(a.length);
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { let s = 0; for (let k = -r; k <= r; k++) s += a[j * w + clamp(i + k, 0, w - 1)]; t[j * w + i] = s / (2 * r + 1); }
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { let s = 0; for (let k = -r; k <= r; k++) s += t[clamp(j + k, 0, h - 1) * w + i]; o[j * w + i] = s / (2 * r + 1); }
  return o;
}
// a field's value at (x, y) of head space, smoothly between its cells
function fieldAt(a, x, y) {
  const u = clamp((x - FX0) / FD, 0, FW - 1.001), v = clamp((y - FY0) / FD, 0, FH - 1.001), i = u | 0, j = v | 0, fu = u - i, fv = v - j, p = j * FW + i;
  return mix(mix(a[p], a[p + 1], fu), mix(a[p + FW], a[p + FW + 1], fu), fv);
}
// what of the key reaches each place of a face's field: the shadows its brow, its nose, its cheek
// cast — over a grid half as fine as the field's, made again when the light's way over the face or
// the face itself changes
function shadowOf(f, lk, sh) {
  const key = f.key + lk.map(v => Math.round(v * 30)).join();
  if (f.shadow?.key === key) return f.shadow.a;
  const a = f.shadow?.a || new Float32Array(FW * FH);
  for (let j = 0; j < FH; j += 2) for (let i = 0; i < FW; i += 2) {
    const x = FX0 + i * FD, y = FY0 + j * FD, z = f.z[j * FW + i];
    let cast = 1;
    for (let d = 0.014; d < 0.18; d *= 1.45) {
      const over = fieldAt(f.z, x + lk[0] * sh * d, y + lk[1] * sh * d) - (z + lk[2] * sh * d + 0.003);
      if (over > 0) cast = Math.min(cast, clamp(1 - over / (d * 0.9 + 0.014), 0.2, 1));
    }
    for (const q of [j * FW + i, j * FW + i + 1, (j + 1) * FW + i, (j + 1) * FW + i + 1]) if (q < FW * FH) a[q] = cast;
  }
  f.shadow = { key, a };
  return a;
}
// the head on the card: each cell of a grid over it found on the turned form and lit — its slope,
// its hollows' dark, the shadows the nose and the brow cast, its sheen, the brush's unevenness where
// the light turns — its edge soft, lost where it is dark against the dark; the grid as fine as the
// head is large on the screen (a cell ~5 px)
const GX = 0.5, GY = 0.6;
function head(c, H, f, C) {
  const { g, L } = c, S = H.S, { cy, sy, cp, sp } = H.rot, T = g.getTransform();
  const lk = H.unrot(L.k), sh = 1 / Math.max(0.2, Math.hypot(lk[0], lk[1]));
  const GV = Math.round(clamp(S * Math.hypot(T.a, T.b) * PXH * 1.2 / 5.5, 64, 176) / 8) * 8, GU = Math.round(GV * GX / GY);
  const cnv = new OffscreenCanvas(GU, GV), img = new ImageData(GU, GV), px = img.data, du = 2 * GX / GU, cr = Math.cos(H.roll), sr = Math.sin(H.roll);
  const { z: Z, r: Fr, g: Fg, b: Fb, gl: Fgl, nx: Fnx, ny: Fny, occ: Focc, brush: Fbr } = f;
  const zAt = (x, y) => fieldAt(Z, x, y), shadow = shadowOf(f, lk, sh);
  // a place in the field and its four cells' weights: many fields read at one place
  let p = 0, w00 = 0, w10 = 0, w01 = 0, w11 = 0;
  const place = (x, y) => {
    let u = (x - FX0) / FD, v = (y - FY0) / FD;
    u = u < 0 ? 0 : u > FW - 1.001 ? FW - 1.001 : u; v = v < 0 ? 0 : v > FH - 1.001 ? FH - 1.001 : v;
    const i = u | 0, j = v | 0, fu = u - i, fv = v - j;
    p = j * FW + i; w00 = (1 - fu) * (1 - fv); w10 = fu * (1 - fv); w01 = (1 - fu) * fv; w11 = fu * fv;
  };
  const at = a => a[p] * w00 + a[p + 1] * w10 + a[p + FW] * w01 + a[p + FW + 1] * w11;
  // two of Newton's steps along the row toward where the turned form is seen at u, kept within lo…hi
  const newton = (x, y, u, lo, hi) => {
    for (let b = 0; b < 2; b++) { place(x, y); x -= (x * cy + at(Z) * sy - u) / (cy - at(Fnx) * sy); x = x < lo ? lo : x > hi ? hi : x; }
    return x;
  };
  for (let j = 0; j < GV; j++) {
    const v = -GY + (j + 0.5) * (2 * GY / GV);
    // the row's extent at four heights in it: the head's outline on each side as turned
    const ext = [0, 1, 2, 3].map(m => {
      const vs = (v + (m - 1.5) / 4 * (2 * GY / GV)) / cp, rv = H.R(clamp(vs, -0.5, 0.5));
      if (Math.abs(vs) > 0.5) return [1, -1];
      let e0 = 1e9, e1 = -1e9;
      for (let k = 0; k <= 16; k++) { const x = rv * (k / 8 - 1), uu = x * cy + zAt(x, vs) * sy; e0 = Math.min(e0, uu); e1 = Math.max(e1, uu); }
      return [e0, e1];
    });
    for (let i = 0; i < GU; i++) {
      const u = -GX + (i + 0.5) * du, q = (j * GU + i) * 4;
      // off the head: the ray misses the form; above the crown, below the chin
      let al = 0;
      for (const [e0, e1] of ext) al += clamp(Math.min(u - e0, e1 - u) / du + 0.5) / 4;
      if (al <= 0) { px[q + 3] = 0; continue; }
      // back through the turn and the nod to the point of the form seen here: halving the row's
      // span a few times, then Newton's steps inside what is left; then the nod, and again
      let x = u, y = v, zz = 0;
      const r = H.R(y < -0.5 ? -0.5 : y > 0.5 ? 0.5 : y);
      let lo = -r, hi = r;
      if (sy) {
        for (let b = 0; b < 5; b++) { x = (lo + hi) / 2; place(x, y); if (x * cy + at(Z) * sy < u) lo = x; else hi = x; }
        x = newton(x, y, u, lo, hi);
      }
      if (sp) { place(x, y); y = (v - (-x * sy + at(Z) * cy) * sp) / cp; if (sy) x = newton(x, y, u, -r, r); }
      place(x, y); zz = at(Z);
      const n = H.n([at(Fnx), at(Fny), 1]), brk = at(Fbr);
      const cast = fieldAt(shadow, x, y);
      const cx = H.at[0] + (u * H.kx * cr - v * H.ky * sr) * S, cyy = H.at[1] + (u * H.kx * sr + v * H.ky * cr) * S;
      const col = pale(shade(L, n, [at(Fr), at(Fg), at(Fb)], cx, cyy, at(Focc), cast, at(Fgl), brk * 0.06 * C.rough), H.pallor), k = 1 + 0.03 * brk * C.rough;
      px[q] = col[0] * k * 255; px[q + 1] = col[1] * k * 255; px[q + 2] = col[2] * k * 255; px[q + 3] = al * 255;
    }
  }
  cnv.getContext('2d').putImageData(img, 0, 0);
  const T0 = g.getTransform();
  g.translate(H.at[0], H.at[1]); g.rotate(H.roll); g.scale(S * H.kx, S * H.ky);
  g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
  g.drawImage(cnv, -GX, -GY, 2 * GX, 2 * GY);
  g.setTransform(T0);
  // the painted colour at (x, y) of the face; the light there — that colour over the skin's own
  const cr2 = Math.cos(-H.roll), sr2 = Math.sin(-H.roll);
  H.paint = (x, y) => {
    const p = H.on(x, y), dx = (p[0] - H.at[0]) / S, dy = (p[1] - H.at[1]) / S, u = (dx * cr2 - dy * sr2) / H.kx, v = (dx * sr2 + dy * cr2) / H.ky;
    const gi = clamp(Math.floor((u + GX) / (2 * GX) * GU), 0, GU - 1), gj = clamp(Math.floor((v + GY) / (2 * GY) * GV), 0, GV - 1), q = (gj * GU + gi) * 4;
    return [px[q] / 255, px[q + 1] / 255, px[q + 2] / 255];
  };
  H.lit = (x, y) => { const c = H.paint(x, y); return [c[0] / fieldAt(Fr, x, y), c[1] / fieldAt(Fg, x, y), c[2] / fieldAt(Fb, x, y)]; };
  brushwork(g, H, f, S * Math.hypot(T.a, T.b) * PXH, C.rough);
}
// the painter's strokes over the lit form, only where the light is: short dabs of the colour under
// them, a little warmer or cooler, laid across the form's slope; finer where it is brightest
function brushwork(g, H, f, px, rough) {
  const S = H.S, list = [];
  for (let i = 0, n = clamp(px * 1.1, 240, 900); i < n; i++) {
    const y = -0.45 + 0.92 * hash(i, 301), x = H.R(y) * (hash(i, 302) * 1.8 - 0.9), c = H.paint(x, y), l = lum(c);
    if (l < 0.1) continue;
    // along the form, across it where it is flat
    const fl = sm(1 - Math.hypot(fieldAt(f.nx, x, y), fieldAt(f.ny, x, y)) / 0.3), gx = fieldAt(f.nx, x, y), gy = fieldAt(f.ny, x, y) - fl, gn = Math.hypot(gx, gy) || 1;
    const len = (0.014 + 0.03 * hash(i, 304)) * (1.25 - l), ax = -gy / gn * len, ay = gx / gn * len, w = (hash(i, 303) - 0.5) * 0.16, v = 1 + (hash(i, 305) - 0.5) * 0.14;
    const a = H.on(x - ax, y - ay), b = H.on(x + ax, y + ay), m = H.on(x + ay * 0.15, y - ax * 0.15);
    list.push({ c: [c[0] * v * (1 + w), c[1] * v * (1 + w * 0.3), c[2] * v * (1 - w * 0.4)], a: 0.3 * rough * clamp((l - 0.1) * 4), p: [a, m, b] });
  }
  strands(g, list, S * 0.013);
}

// an eye of side s (+1: on the frame's right), in four paintings — eyeWhite (the wet white in the socket's shade, on
// the head), eyeIris (the iris and the light in it: it glances), eyeLids (the upper lid's shade over it, the lash line,
// the wet rim, the fold), eyeShut (the lid shut over all of it, for a blink); fear widens it past the iris. Its shape:
// eyeGeom — the opening between the lids, and the fold under the brow it shuts from
function eyeGeom(H, C, s, open, squeeze, cheek) {
  const S = H.S, w = C.eyeW, o = Math.min(open, 1.4), ex = s * 0.145, ey = 0.004;
  const up = -(0.008 + 0.027 * Math.min(1, o) * (1 - 0.25 * C.stout) + 0.03 * Math.max(0, o - 1)), lo = 0.004 + 0.013 * Math.min(1, o) * (1 - squeeze * 0.4 - cheek * 0.45) + 0.01 * Math.max(0, o - 1);
  const E = (x, y, dz = 0.006) => H.on(ex + s * x * w, ey + y, dz);
  const inn = E(-0.067, 0.007), out = E(0.07, -0.003), u1 = E(-0.032, up * 1.08), u2 = E(0.026, up * 0.96);
  return { S, w, o, ex, ey, up, lo, E, inn, out, u1, u2, l1: E(-0.028, lo), l2: E(0.036, lo * 0.85), fold: E(0, up * 1.1 - 0.006) };
}
function almond(g, G) {
  const { inn, u1, u2, out, l1, l2 } = G;
  g.beginPath(); g.moveTo(inn[0], inn[1]);
  g.bezierCurveTo(u1[0], u1[1], u2[0], u2[1], out[0], out[1]);
  g.bezierCurveTo(l2[0], l2[1], l1[0], l1[1], inn[0], inn[1]);
}
function eyeWhite(c, H, C, G, sk) {
  if (G.o <= 0.04) return;
  const { g } = c, S = H.S, ec = G.E(0, 0);
  g.save(); almond(g, G); g.clip();
  // the white: dim, turning away into the corners, a little warm at the inner one
  const wc = sk(G.ex, G.ey, [0.41, 0.395, 0.38]), span = 0.08 * S * G.w;
  const gr = g.createRadialGradient(ec[0], ec[1], 0, ec[0], ec[1], span);
  gr.addColorStop(0, css(wc)); gr.addColorStop(0.5, css(mul3(wc, 0.8))); gr.addColorStop(1, css(mul3(wc, 0.35)));
  g.fillStyle = gr; g.fillRect(ec[0] - span, ec[1] - span, 2 * span, 2 * span);
  dab(g, G.inn[0], G.inn[1], 0.022 * S, 0.014 * S, 0, mix3(wc, [0.6, 0.32, 0.32], 0.45), 0.7);
  g.restore();
}
function eyeIris(c, H, C, G, s, gaze, sk, fear, wet) {
  if (G.o <= 0.04) return;
  const { g, L } = c, S = H.S, { ex, ey } = G, kcl = mix3(L.kc, [1, 1, 1], 0.45);
  const ir = C.irisR * S, lit = clamp(lum(H.lit(ex, ey)) * 1.4);
  g.save(); almond(g, G); g.clip();
  // the iris: its colour lit from inside on the side away from the light, a dark ring round it, the pupil
  const ic = H.on(ex + gaze[0] * 0.03 + s * 0.002, ey - 0.002 + gaze[1] * 0.012, 0.012), icol = rgb(C.iris), il = mul3(sk(ex, ey, icol), 0.85), deep = mul3(il, 0.3);
  let gr = g.createRadialGradient(ic[0], ic[1], ir * 0.2, ic[0], ic[1], ir * 1.04);
  gr.addColorStop(0, css(mul3(il, 0.9))); gr.addColorStop(0.6, css(mul3(il, 0.8)));
  gr.addColorStop(0.8, css(mix3(il, deep, 0.5))); gr.addColorStop(0.92, css(deep, 0.85)); gr.addColorStop(1, css(deep, 0));
  g.fillStyle = gr; g.beginPath(); g.arc(ic[0], ic[1], ir * 1.04, 0, 7); g.fill();
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * PI * 2 + hash(i, 5) * 0.3, r0 = ir * 0.45, r1 = ir * (0.72 + 0.18 * hash(i, 7));
    g.strokeStyle = css(i % 2 ? mix3(il, kcl, 0.3) : deep, 0.12); g.lineWidth = ir * 0.08;
    g.beginPath(); g.moveTo(ic[0] + Math.cos(a) * r0, ic[1] + Math.sin(a) * r0); g.lineTo(ic[0] + Math.cos(a) * r1, ic[1] + Math.sin(a) * r1); g.stroke();
  }
  dab(g, ic[0] - L.k[0] * ir * 0.42, ic[1] - L.k[1] * ir * 0.42, ir * 0.5, ir * 0.42, 0, mix3(icol, kcl, 0.35), 0.35 * (0.4 + lit));
  gr = g.createRadialGradient(ic[0], ic[1], 0, ic[0], ic[1], ir * (0.38 + fear * 0.1));
  gr.addColorStop(0, 'rgba(4,4,5,1)'); gr.addColorStop(0.75, 'rgba(4,4,5,0.95)'); gr.addColorStop(1, 'rgba(4,4,5,0)');
  g.fillStyle = gr; g.beginPath(); g.arc(ic[0], ic[1], ir * 0.5, 0, 7); g.fill();
  // the light in it: a small sharp reflection of the source on the wet cornea (a pixel and more on a 4K screen), and a
  // faint second
  const T = g.getTransform(), hx = ic[0] + L.k[0] * ir * 0.38, hy = ic[1] + L.k[1] * ir * 0.38 - ir * 0.1;
  const hr = Math.max(ir * (0.15 + wet * 0.06), 1.2 / (PXH * Math.hypot(T.a, T.b))), ha = clamp(0.45 + lit) * (0.85 + wet * 0.15);
  if (L.rs < 0) { g.fillStyle = css(kcl, ha); g.beginPath(); g.roundRect(hx - hr * 0.8, hy - hr, hr * 1.6, hr * 2, hr * 0.3); g.fill(); }
  else dab(g, hx, hy, hr, hr * 0.85, H.roll, kcl, ha, 0.55);
  dab(g, ic[0] - L.k[0] * ir * 0.3, ic[1] + ir * 0.5, ir * 0.12, ir * 0.07, 0, kcl, (0.15 + wet * 0.3) * ha, 0.3);
  g.restore();
}
function eyeLids(c, H, C, G, s, sk, wet, squeeze) {
  const { g, L } = c, S = H.S, { ex, ey, up, lo, E, inn, out, u1, u2 } = G, o = G.o;
  const lid = sk(ex, -0.03, rgb(C.skin)), lash = mul3(lid, 0.22), kcl = mix3(L.kc, [1, 1, 1], 0.45), ec = E(0, 0);
  const lit = clamp(lum(H.lit(ex, ey)) * 1.4), span = 0.08 * S * G.w;
  g.lineCap = 'round'; g.lineJoin = 'round';
  if (o > 0.04) {
    // the upper lid's shadow over the eye
    g.save(); almond(g, G); g.clip();
    const top = Math.min(u1[1], u2[1]), gr = g.createLinearGradient(0, top, 0, top + (lo - up) * S * 0.75);
    gr.addColorStop(0, css(mul3(lash, 0.5), 0.95)); gr.addColorStop(0.45, css(lash, 0.5)); gr.addColorStop(1, css(lash, 0));
    g.fillStyle = gr; g.fillRect(ec[0] - span, top - 0.01 * S, 2 * span, (lo - up) * S + 0.02 * S);
    g.restore();
    // the wet rim of the lower lid
    const wl1 = E(-0.028, lo + 0.001), wl2 = E(0.036, lo * 0.85 + 0.001);
    g.strokeStyle = css(mix3(lid, kcl, 0.3), (0.06 + wet * 0.16) * (0.3 + lit)); g.lineWidth = 0.0024 * S;
    g.beginPath(); g.moveTo(inn[0], inn[1]); g.bezierCurveTo(wl1[0], wl1[1], wl2[0], wl2[1], out[0], out[1]); g.stroke();
    // the lower lid's own edge, wet
    const b1 = E(-0.028, lo + 0.004), b2 = E(0.036, lo * 0.85 + 0.004);
    g.strokeStyle = css(mul3(lid, 0.85), 0.25); g.lineWidth = 0.005 * S;
    g.beginPath(); g.moveTo(inn[0], inn[1]); g.bezierCurveTo(b1[0], b1[1], b2[0], b2[1], out[0], out[1]); g.stroke();
    // the lash line: soft, darkest and heaviest toward the outer corner
    for (const [lw, a] of [[0.011, 0.3], [0.0055, 0.75]]) {
      g.strokeStyle = css(lash, a); g.lineWidth = lw * S;
      g.beginPath(); g.moveTo(inn[0], inn[1]); g.bezierCurveTo(u1[0], u1[1], u2[0], u2[1], out[0], out[1]); g.stroke();
    }
    g.lineWidth = 0.0022 * S; g.strokeStyle = css(lash, 0.5); g.beginPath();
    for (let i = 0; i < 7; i++) {
      const u = 0.35 + i * 0.1, a = bez(inn, u1, u2, out, u), b = [a[0] + s * (0.006 + 0.008 * u) * S, a[1] - (0.008 - 0.004 * u) * S];
      g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]);
    }
    g.stroke();
  } else shutLine(g, G, s, lash, 0);
  // the fold of the lid under the brow
  for (let i = 0; i < 5; i++) {
    const u = -0.045 + i * 0.024;
    hdab(g, H, ex + s * u * G.w, up * 0.6 - 0.024 - 0.008 * Math.cos(u * 20) - squeeze * 0.006, 0.02, 0.006, 0, mul3(lid, 0.45), 0.2);
  }
}
// the line of a shut eye (dy lower, head units): the lid's edge and its fringe
function shutLine(g, G, s, lash, dy) {
  const S = G.S, inn = G.E(-0.067, 0.007 + dy), out = G.E(0.07, -0.003 + dy), m1 = G.E(-0.03, 0.014 + dy), m2 = G.E(0.03, 0.012 + dy);
  for (const [lw, a] of [[0.008, 0.2], [0.0035, 0.6]]) {
    g.strokeStyle = css(lash, a); g.lineWidth = lw * S;
    g.beginPath(); g.moveTo(inn[0], inn[1]); g.bezierCurveTo(m1[0], m1[1], m2[0], m2[1], out[0], out[1]); g.stroke();
  }
  g.lineWidth = 0.002 * S; g.strokeStyle = css(lash, 0.3); g.beginPath();
  for (let i = 0; i < 7; i++) {
    const u = 0.3 + i * 0.1, a = bez(inn, m1, m2, out, u);
    g.moveTo(a[0], a[1]); g.lineTo(a[0] + s * 0.005 * S * u, a[1] + 0.007 * S);
  }
  g.stroke();
}
// the lid shut over the opening (a blink: live() lets it down from the fold, eyeGeom's): the lid's skin as the light
// has it, darker under the brow, the line where it meets the lower lid
function eyeShut(c, H, C, G, s, sk) {
  if (G.o <= 0.04) return;
  const { g } = c, S = H.S, lid = sk(G.ex, -0.03, rgb(C.skin)), low = sk(G.ex, G.ey, rgb(C.skin));
  const top = G.fold[1], bot = Math.max(G.l1[1], G.l2[1]) + 0.004 * S;
  g.beginPath(); g.moveTo(G.inn[0], G.inn[1]);
  g.bezierCurveTo(G.u1[0], top, G.u2[0], top, G.out[0], G.out[1]);
  g.bezierCurveTo(G.l2[0], bot, G.l1[0], bot, G.inn[0], G.inn[1]);
  const gr = g.createLinearGradient(0, top, 0, bot);
  gr.addColorStop(0, css(mul3(lid, 0.7))); gr.addColorStop(0.55, css(lid)); gr.addColorStop(1, css(mul3(low, 0.9)));
  g.fillStyle = gr; g.fill();
  shutLine(g, G, s, mul3(lid, 0.22), Math.max(0, G.lo - 0.012));
}

// a point on a cubic Bézier
const bez = (a, b, c, d, u) => {
  const v = 1 - u;
  return [v * v * v * a[0] + 3 * v * v * u * b[0] + 3 * v * u * u * c[0] + u * u * u * d[0], v * v * v * a[1] + 3 * v * v * u * b[1] + 3 * v * u * u * c[1] + u * u * u * d[1]];
};
// a brow: hairs growing up from its inner end, outward along its tail, lit as the bone under it; inner, outer — how far
// its ends are raised (− lowered); knit draws it in and down. In two paintings: browSkin — the forehead folding over it
// as it rises (across the middle when the inner ends go up), the creases between the brows as they knit (on the skin:
// each expression its own); browHair — the brow itself (live() moves it from one expression's line to another's:
// browLine — its inner and outer ends)
const browAt = (inner, outer, knit) => {
  const a = [0.05 + knit * 0.016, -0.09 - inner * 0.05 + knit * 0.014], b = [0.15, -0.12 - (inner + outer) * 0.018 + knit * 0.006], d = [0.25, -0.094 - outer * 0.035];
  return u => { const k = u < 0.4 ? u / 0.4 : (u - 0.4) / 0.6, p0 = u < 0.4 ? a : b, p1 = u < 0.4 ? b : d; return [mix(p0[0], p1[0], k), mix(p0[1], p1[1], k)]; };
};
// its ends on the card (inner, outer)
function browLine(H, s, inner, outer, knit) {
  const at = browAt(inner, outer, knit), a = at(0), d = at(1);
  return [H.on(s * a[0], a[1], 0.004), H.on(s * d[0], d[1], 0.004)];
}
function browSkin(c, H, C, s, inner, outer, knit, sk) {
  const { g } = c, S = H.S, skin = rgb(C.skin), up = (inner + outer) / 2;
  g.lineCap = 'round';
  if (up > 0.2 || inner > 0.3) {
    const k = clamp(Math.max(up - 0.2, inner - 0.3) * 1.6), mid = clamp(inner - outer);
    g.save(); g.filter = `blur(${(S * Math.hypot(g.getTransform().a, g.getTransform().b) * 0.005).toFixed(5)}px)`;
    for (let i = 0; i < 3; i++) {
      const y = -0.19 - i * 0.042, a = H.on(s * 0.015, y - 0.016 * mid), m = H.on(s * 0.09, y - 0.006 * (1 - mid)), b = H.on(s * mix(0.22, 0.14, mid), y + 0.008 + 0.014 * mid);
      const cc = sk(s * 0.1, y, skin);
      g.strokeStyle = css(mul3(cc, 0.6), 0.22 * k); g.lineWidth = S * 0.006;
      g.beginPath(); g.moveTo(a[0], a[1]); g.quadraticCurveTo(m[0], m[1], b[0], b[1]); g.stroke();
      g.strokeStyle = css(mul3(cc, 1.12), 0.2 * k); g.lineWidth = S * 0.004;
      g.beginPath(); g.moveTo(a[0], a[1] - 0.007 * S); g.quadraticCurveTo(m[0], m[1] - 0.007 * S, b[0], b[1] - 0.007 * S); g.stroke();
    }
    g.restore();
  }
  if (knit > 0.3) {
    const k = clamp((knit - 0.3) * 1.6), cc = sk(s * 0.03, -0.1, skin);
    for (const dx of [0.022, 0.034]) {
      const a = H.on(s * dx, -0.14), b = H.on(s * (dx + 0.006), -0.085);
      g.strokeStyle = css(mul3(cc, 0.55), 0.35 * k); g.lineWidth = S * 0.005;
      g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
    }
  }
}
function browHair(c, H, C, s, inner, outer, knit, sk) {
  const { g } = c, S = H.S, bc = rgb(C.brow), at = browAt(inner, outer, knit);
  // the brow's soft mass, then its hairs
  for (let i = 0; i < 8; i++) { const [x, y] = at(i / 7); hdab(g, H, s * x, y, 0.03, 0.015 * (1 - i / 10), s * -0.15, mul3(sk(s * x, y, bc), 0.8), 0.4, 0, 0.004); }
  const list = [];
  for (let i = 0; i < 110; i++) {
    const u = hash(i, C.seed + 9), [x, y] = at(u), j = (hash(i, C.seed + 10) - 0.5) * 0.02 * (1 - u * 0.6), dir = mix(-1.25, -0.25, Math.min(1, u * 1.6)) + (hash(i, 13) - 0.5) * 0.4;
    const l = 0.008 + 0.008 * hash(i, 11), p = H.on(s * x, y + j, 0.006), q = H.on(s * (x + Math.cos(dir) * l * 0.9), y + j + Math.sin(dir) * l * 0.5, 0.006);
    list.push({ c: mul3(sk(s * x, y, bc), 0.55 + 0.4 * hash(i, 12)), a: 0.22 + 0.15 * C.male, p: [p, q] });
  }
  strands(g, list, S * 0.0024);
}

// the mouth: the line between the lips — the drawing of it — its corners pressed in; the upper lip
// in shade, the lower catching the light; a smile lifts and widens the corners, strain stretches
// them and presses the lips thin, grief pulls them down; open — the dark inside, a glimpse of teeth
function mouth(c, H, C, sk, { smile, strain, fear, open, grief, sly, t, life, seed, blush }) {
  const { g, L } = c, S = H.S, lip = mix3(rgb(C.lip), rgb('#c86a76'), 0.55 * blush), thin = 1 - 0.25 * C.male - 0.3 * strain;
  const tw = strain * 0.005 * noise(t * 11, seed + 7) * life;
  const w = C.mouthW + smile * 0.03 + strain * 0.024, y = 0.299, lift = smile * 0.03 - grief * 0.024 - fear * 0.012;
  const yl = y - lift + tw, yr = y - lift - sly * 0.04 - tw, ym = y + 0.002 + smile * 0.003;
  const M = (x, yy) => H.on(x, yy, 0.006);
  const cy = k => (k < 0 ? yl : yr);
  // the line, its middle dipping a little under the bow of the upper lip
  const line = k => M(k * w, mix(ym + 0.0025 * Math.exp(-((k / 0.15) ** 2)), cy(k), Math.pow(Math.abs(k), 1.7)));
  const gap = open * (0.05 + smile * 0.04 + fear * 0.03);
  const inner = k => M(k * w * 0.9, mix(ym + gap, cy(k), Math.pow(Math.abs(k), 2.4)));
  const top = k => M(k * w * 0.86, mix(ym - (0.021 + 0.005 * (1 - C.male)) * thin * (1 - 0.3 * Math.exp(-((k / 0.13) ** 2))), cy(k), Math.pow(Math.abs(k), 2.2)));
  const bot = k => M(k * w * 0.74, mix(ym + (0.025 + 0.006 * (1 - C.male)) * thin * (1 - smile * 0.2) + gap, cy(k), Math.pow(Math.abs(k), 2)));
  const K = [-1, -0.8, -0.6, -0.4, -0.25, -0.12, 0, 0.12, 0.25, 0.4, 0.6, 0.8, 1];
  const path = (a, b) => { g.beginPath(); smooth(g, [...K.map(a), ...K.slice().reverse().map(b)], true); };
  const lo = sk(0, y + 0.02, lip), upc = mul3(sk(0, y - 0.012, lip), 0.8), dark = mul3(sk(0, y, lip), 0.28);
  const sh = M(0, ym + 0.05 * thin + gap);
  dab(g, sh[0], sh[1], w * S * 0.6, 0.016 * S, H.roll, mul3(lo, 0.45), 0.35);
  // the lips laid softly: the upper in shade, lighter along its border; the lower lit across its middle
  g.save(); g.filter = `blur(${(S * Math.hypot(g.getTransform().a, g.getTransform().b) * 0.004).toFixed(5)}px)`;
  // the dark inside, its edge soft under the lips
  if (open > 0.03) {
    path(line, inner); g.fillStyle = css(mix3(mul3(dark, 0.7), [0.16, 0.05, 0.05], 0.3), 0.88); g.fill();
    g.save(); g.clip();
    // the upper teeth under the lip, dim, darker toward the corners
    const tc = mul3(sk(L.k[0] * 0.03, y + 0.02, [0.74, 0.72, 0.66]), 0.8), tp = M(0, ym + 0.002 + gap * 0.25);
    dab(g, tp[0], tp[1], w * S * 0.8, (0.006 + gap * 0.6) * S, H.roll, tc, 0.95 * clamp(open * 5 - 0.3) * (1 - fear * 0.9) * (0.35 + 0.65 * smile), 0.6);
    g.restore();
  }
  const t0 = top(0), l0 = line(0), b0 = bot(0);
  let gr = g.createLinearGradient(t0[0], t0[1], l0[0], l0[1]);
  gr.addColorStop(0, css(mul3(upc, 1.1), 0.6)); gr.addColorStop(1, css(mul3(upc, 0.7), 0.85));
  path(top, line); g.fillStyle = gr; g.fill();
  gr = g.createLinearGradient(l0[0], l0[1], b0[0], b0[1]);
  gr.addColorStop(0, css(mul3(lo, 0.75), 0.7)); gr.addColorStop(0.45, css(mul3(lo, 1.08), 0.65)); gr.addColorStop(1, css(mul3(lo, 0.85), 0.4));
  path(open > 0.03 ? inner : line, bot); g.fillStyle = gr; g.fill();
  // the line and the corners, pressed in
  g.lineCap = 'round';
  for (const [lw, a] of [[0.009, 0.2], [0.004, 0.6]]) {
    g.strokeStyle = css(dark, a * (1 - clamp(open * 3))); g.lineWidth = lw * S;
    g.beginPath(); smooth(g, K.map(line), false); g.stroke();
  }
  g.restore();
  for (const k of [-1, 1]) { const p = M(k * w * 1.03, cy(k) + 0.002); dab(g, p[0], p[1], 0.014 * S, 0.01 * S, H.roll, dark, 0.55); }
  // the light on the lower lip
  const ll = M(L.k[0] * 0.02, ym + 0.014 * thin + gap);
  dab(g, ll[0], ll[1], 0.032 * S, 0.006 * S, H.roll, mix3(lo, mix3(L.kc, [1, 1, 1], 0.5), 0.4), 0.4);
}
// a tear: wells on the lower lid, then crawls down the cheek — stopping, going on — leaving a wet line. Its way down
// the cheek (tearPath, the same for the painting and live(): the head as the skull without its features, which a tear
// running down the cheek does not see), the wet line all the way (tearTrail: live() lets it out as far as the drop has
// gone) and the drop where it wells (tearDrop: live() carries it down and swells it)
const TEAR = [[0.13, 0.026], [0.134, 0.065], [0.142, 0.115], [0.152, 0.175], [0.163, 0.245], [0.176, 0.33]], TEAR_END = 0.92;
const skullZ = R => (x, y) => {
  const yc = clamp(y, -0.5, 0.5), rx = Math.max(0.02, R(yc)), q = Math.min(0.995, Math.abs(x) / rx);
  return y < -0.5 || y > 0.5 ? 0 : DEPTH(yc) * Math.pow(1 - Math.pow(q, 2.6), 1 / 2.6);
};
// the head as live() moves it about: the skull's frame (no field) — where a tear runs, where an eye's fold is
function skullFrame(o, C, L) {
  const P = poseOf(o, C, L), R = outlineOf(CAST[o.who] ? o.who : 'roderick');
  return headFrame(P.at, P.S, P.yaw, P.pitch, P.roll, R, skullZ(R), ...C.shape);
}
function tearPath(o, C, L, s) {
  const H = skullFrame(o, C, L);
  const at = u => {
    const f = clamp(u) * (TEAR.length - 1), i = Math.min(TEAR.length - 2, Math.floor(f)), k = f - i, x = mix(TEAR[i][0], TEAR[i + 1][0], k) + 0.003 * Math.sin(u * 17);
    return H.on(s * x, mix(TEAR[i][1], TEAR[i + 1][1], k), 0.006);
  };
  return { H, at, s, S: H.S };
}
// how far the tear is at v (0…1): how full it has welled, how far down it has run (in small slips with rests between)
function tearAt(v) {
  const well = clamp(v / 0.3), run = clamp((v - 0.3) / 0.7);
  return { well, u: run * TEAR_END - 0.03 * Math.sin(run * PI * 6) * (1 - run) };
}
function tearTrail(c, T, sk) {
  const { g, L } = c, S = T.S, kc = mix3(L.kc, [1, 1, 1], 0.55), cheek = sk(T.s * 0.15, 0.15, rgb('#d8d0c8'));
  // the wet line it leaves: its sheen, its shadowed edge, its lit edge
  g.lineCap = 'round'; g.lineJoin = 'round';
  const trail = (dx, w, col, a) => {
    g.strokeStyle = css(col, a); g.lineWidth = w;
    g.beginPath(); const p0 = T.at(0); g.moveTo(p0[0] + dx, p0[1]);
    for (let k = 1; k <= 20; k++) { const p = T.at((k / 20) * TEAR_END); g.lineTo(p[0] + dx, p[1]); }
    g.stroke();
  };
  trail(0, 0.014 * S, mix3(cheek, kc, 0.3), 0.18);
  trail(-L.k[0] * 0.004 * S, 0.004 * S, mul3(cheek, 0.6), 0.22);
  trail(L.k[0] * 0.003 * S, 0.0025 * S, kc, 0.5);
}
function tearDrop(c, T, sk) {
  const { g, L } = c, S = T.S, kc = mix3(L.kc, [1, 1, 1], 0.55), cheek = sk(T.s * 0.15, 0.15, rgb('#d8d0c8'));
  // the drop, full: clear, the cheek seen darker through it, the light caught on its top, a glint below
  const d = T.at(0), r = S * 0.018;
  dab(g, d[0], d[1] + r * 0.5, r * 1.15, r * 1.5, T.H.roll, mul3(cheek, 0.4), 0.35);
  dab(g, d[0], d[1] + r * 0.2, r * 0.85, r * 1.2, T.H.roll, mul3(cheek, 0.75), 0.85, 0.6);
  dab(g, d[0], d[1] + r * 0.6, r * 0.5, r * 0.35, T.H.roll, mix3(cheek, kc, 0.6), 0.6, 0.3);
  dab(g, d[0] + L.k[0] * r * 0.35, d[1] + L.k[1] * r * 0.3 - r * 0.25, r * 0.3, r * 0.24, T.H.roll, kc, 1, 0.6);
}

// ---- hair: ash-silver ----
// the colour of hair facing n (head space) at the card's (x, y): lit, its sheen, greyed
const hairLit = (c, H, hair, n, p) => { const col = shade(c.L, H.n(n), hair, p[0], p[1], 1, 1, 0.6); return mix3(col, [lum(col), lum(col), lum(col)], 0.65); };
// Roderick's, finer than a web, floats rather than falls: long strands standing off the skull all
// round it in slow curves, as in water — catching the light against the dark, the head's shape seen
// through them; each made once: its root (the angle round the skull), its length, its bend, its waves
const nimbi = new Map();
function nimbusOf(C) {
  if (!nimbi.has(C.seed)) {
    const list = [];
    for (let i = 0; i < 520; i++) {
      const h = k => hash(i, C.seed * 31 + k), a = mix(-PI - 0.6, 0.6, h(1)), s = Math.cos(a) < 0 ? -1 : 1, side = Math.abs(Math.cos(a));
      // each drifts off its root a little downward, curling on down, waving
      list.push({ a, s, tilt: s * mix(0.2, 0.9, h(2)), len: mix(0.14, 0.36, Math.pow(h(3), 0.8)) * (1 + 0.25 * side), bend: s * mix(-0.6, 2.2, h(4)), wave: mix(0.3, 1.1, h(5)), out: mix(0.86, 1.02, h(6)), ph: h(7) * 20 });
    }
    nimbi.set(C.seed, list);
  }
  return nimbi.get(C.seed);
}
// a strand's way from its root (head space, toward dir): bending, waving, drifting on the clock,
// blown by the wind (side: which way it goes off the head); at(x, y) — where a point of it is on the card
function strandPath(at, root, dir, len, bend, wave, ph, t, fl, wind, side, n = 7) {
  let [x, y] = root, a = Math.atan2(dir[1], dir[0]);
  const pts = [at(x, y)];
  for (let k = 0; k < n; k++) {
    a += bend / n + wave * 0.35 * Math.cos(k * 1.7 + ph) + fl * 0.5 * drift(t * 0.12 + ph + k * 0.3, 7) / n;
    let dx = Math.cos(a), dy = Math.sin(a);
    const w = wind * (k + 1) / n;
    dx += side * w * 0.6 * (0.8 + 0.4 * drift(t * 0.9 + ph, 9)); dy -= w * 0.5;
    const l = Math.hypot(dx, dy) || 1;
    x += dx / l * len / n; y += dy / l * len / n;
    pts.push(at(x, y));
  }
  return pts;
}
function nimbus(c, H, C, hair, t, life, wind) {
  const { g } = c, S = H.S, fl = (0.5 + wind) * mix(0.15, 1, life), roots = [], tips = [], at = (x, y) => H.P(x, y, -0.08);
  // the cloud of it: a faint lit haze round the skull
  for (let i = 0; i < 16; i++) {
    const a = -PI - 0.5 + (PI + 1) * i / 15, p = H.P(Math.cos(a) * 0.4, -0.08 + Math.sin(a) * 0.48, -0.1), col = hairLit(c, H, hair, [Math.cos(a), Math.sin(a), 0.4], p);
    dab(g, p[0], p[1], 0.2 * S, 0.2 * S, 0, col, clamp(lum(col) * 0.6) * 0.3);
  }
  for (const s of nimbusOf(C)) {
    const ca = Math.cos(s.a), sa = Math.sin(s.a), root = [ca * 0.3 * s.out, -0.1 + sa * 0.41 * s.out], d = s.a + s.tilt;
    const pts = strandPath(at, root, [Math.cos(d), Math.sin(d)], s.len, s.bend, s.wave, s.ph, t, fl, wind, s.s, 9);
    // a strand shows where it catches the light; in the shadow it is lost in the dark
    const col = mul3(hairLit(c, H, hair, [ca, sa, 0.4], pts[3]), 1.25), a = clamp(0.1 + lum(col) * 1.1) * 0.55;
    roots.push({ c: col, a, p: pts.slice(0, 5) }); tips.push({ c: col, a: a * 0.45, p: pts.slice(4) });
  }
  strands(g, roots, S * 0.0017); strands(g, tips, S * 0.0014);
}
// Roderick's in front: off the crown, lifting and floating out over the head's outline, and down
// from the temples along the face, over its edges
function nimbusFront(c, H, C, hair, t, life, wind) {
  const S = H.S, HL = curve(C.hairline), fl = (0.5 + wind) * mix(0.15, 1, life), roots = [], tips = [];
  for (let i = 0; i < 260; i++) {
    const h = k => hash(i, C.seed * 23 + k), crown = i < 170, s = h(1) < 0.5 ? -1 : 1;
    let root, d, len, bend;
    if (crown) {
      const u = h(2) * 2 - 1, x = u * 0.3, y = mix(-0.5 + 0.12 * u * u, HL(Math.abs(x)) - 0.02, h(3));
      root = [x, y]; d = Math.atan2(-(0.6 + h(7)), x * 3 + (h(4) - 0.5)); len = mix(0.1, 0.3, h(5)); bend = s * mix(-0.5, 1.5, h(6));
    } else if (i < 200) {
      // wisps fallen over the brow
      const ax = mix(0.02, 0.2, h(2)); root = [s * ax, HL(ax) - 0.02];
      d = Math.atan2(1, s * mix(0.1, 0.5, h(4))); len = mix(0.08, 0.2, h(5)); bend = -s * mix(-0.4, 0.8, h(6));
    } else {
      const ax = mix(0.2, 0.33, h(2)); root = [s * ax, HL(ax) - 0.01];
      d = Math.atan2(0.8, s * mix(0.3, 0.9, h(4))); len = mix(0.12, 0.32, h(5)); bend = -s * mix(-0.3, 0.8, h(6));
    }
    const z0 = H.z(root[0], root[1]) + 0.01, at = (x, y) => H.P(x, y, Math.max(z0 * 0.7, H.z(x, y)) + 0.03);
    const pts = strandPath(at, root, [Math.cos(d), Math.sin(d)], len, bend, mix(0.3, 1, h(8)), h(9) * 20, t, fl, wind, s, 8);
    const n = crown ? [root[0] * 2, -0.8, 0.5] : [s * 0.8, 0.1, 0.6], col = mul3(hairLit(c, H, hair, n, pts[2]), 1.2), a = clamp(0.08 + lum(col) * 1.1) * 0.5;
    roots.push({ c: col, a, p: pts.slice(0, 5) }); tips.push({ c: col, a: a * 0.45, p: pts.slice(4) });
  }
  strands(c.g, roots, S * 0.0017); strands(c.g, tips, S * 0.0014);
}
// Madeline's: long, loose, in soft masses — from the parting over the skull, down by the cheeks
// past the shoulders (and behind the neck); lying, spread on the pillow round the head. Each mass
// is a shape (the right half; the left mirrors it) made once into a field over head space: where
// the hair is, how it swells (the shape blurred), which way it runs; lit each frame — the sheen
// across the fall where the light catches it — and its strands painted along the fall over it
const MASSES = {
  front: [[-0.03, -0.512], [0.16, -0.502], [0.3, -0.45], [0.4, -0.31], [0.44, -0.1], [0.45, 0.15], [0.47, 0.42], [0.52, 0.72], [0.57, 1.02], [0.6, 1.35], [0.58, 1.62],
    [0.42, 1.62], [0.4, 1.25], [0.37, 0.88], [0.345, 0.56], [0.33, 0.3], [0.325, 0.08], [0.305, -0.08], [0.26, -0.18], [0.19, -0.255], [0.1, -0.285], [0, -0.295]],
  back: [[0, -0.3], [0.38, -0.28], [0.5, 0.15], [0.56, 0.7], [0.64, 1.2], [0.68, 1.62], [0, 1.62]],
  // the doctor's grey fringe over the ears and his side-whiskers down to the jaw
  whiskers: [[0.28, -0.28], [0.35, -0.25], [0.4, -0.1], [0.4, 0.08], [0.37, 0.24], [0.32, 0.37], [0.26, 0.41], [0.26, 0.3], [0.3, 0.16], [0.31, 0.0], [0.3, -0.14]],
  frontLying: [[-0.03, -0.525], [0.17, -0.515], [0.3, -0.45], [0.38, -0.3], [0.41, -0.1], [0.42, 0.12], [0.41, 0.32], [0.37, 0.44], [0.33, 0.32],
    [0.33, 0.1], [0.31, -0.04], [0.28, -0.18], [0.19, -0.255], [0.1, -0.285], [0, -0.295]],
};
const HX0 = -0.95, HY0 = -0.72, HDD = 0.015, HW = 127, HH = 158;
const hairFields = new Map();
// which way the hair runs at (x, y): out from the parting over the skull, then down the fall
const flow = (x, y, lying) => {
  const rx = x, ry = y + 0.56, rl = Math.hypot(rx, ry) || 1, k = lying ? 0 : sm((y + 0.2) / 0.45);
  const dx = mix(rx / rl, Math.sign(x) * 0.12, k), dy = mix(ry / rl, 1, k), l = Math.hypot(dx, dy) || 1;
  return [dx / l, dy / l];
};
function hairField(key, shape, lying) {
  if (hairFields.has(key)) return hairFields.get(key);
  const cnv = new OffscreenCanvas(HW, HH), g = cnv.getContext('2d', { willReadFrequently: true });
  const toPx = ([x, y]) => [(x - HX0) / HDD, (y - HY0) / HDD];
  const paint = blur => {
    g.clearRect(0, 0, HW, HH); g.filter = `blur(${blur}px)`; g.fillStyle = '#fff';
    for (const s of [-1, 1]) {
      // its edge waves a little
      const q = shape.map(([x, y], k) => toPx([s * (x + (x > 0.05 ? 0.012 * Math.sin(y * 13 + k) : 0)), y]));
      g.beginPath(); smooth(g, q, true); g.fill();
    }
    g.filter = 'none';
    const d = g.getImageData(0, 0, HW, HH).data, out = new Float32Array(HW * HH);
    for (let p = 0; p < out.length; p++) out[p] = d[p * 4 + 3] / 255;
    return out;
  };
  const al = paint(0.5), z = paint(5);
  const N = HW * HH, nx = new Float32Array(N), ny = new Float32Array(N), tx = new Float32Array(N), ty = new Float32Array(N), k = new Float32Array(N);
  for (let j = 1; j < HH - 1; j++) for (let i = 1; i < HW - 1; i++) {
    const p = j * HW + i, x = HX0 + (i + 0.5) * HDD, y = HY0 + (j + 0.5) * HDD;
    // the swell of the mass over the round of the skull
    const sx = x / 0.42, sy = (y + 0.05) / 0.56, on = Math.max(0, 1 - sx * sx - sy * sy), sk = lying ? 0 : 0.8 * Math.sqrt(on);
    nx[p] = -(z[p + 1] - z[p - 1]) * 0.9 + sk * sx; ny[p] = -(z[p + HW] - z[p - HW]) * 0.9 + sk * sy;
    const [fx, fy] = flow(x, y, lying);
    tx[p] = fx; ty[p] = fy;
    // the locks: lighter and darker bands along the fall
    k[p] = 0.84 + 0.1 * noise2((x * fy - y * fx) * 40, (x * fx + y * fy) * 5, 51) + 0.06 * noise2(x * 30, y * 30, 52);
  }
  // the strands: lines along the flow from seeds in the mass
  const lines = [];
  for (let m = 0; m < 1100; m++) {
    let x = HX0 + hash(m, 61) * HW * HDD, y = HY0 + hash(m, 62) * HH * HDD;
    const at = (x, y) => al[clamp(Math.floor((y - HY0) / HDD), 0, HH - 1) * HW + clamp(Math.floor((x - HX0) / HDD), 0, HW - 1)];
    if (at(x, y) < 0.9) continue;
    const pts = [[x, y]], len = mix(0.2, 0.6, hash(m, 63)), wv = hash(m, 64) * 6;
    for (let n = 0; n < 12; n++) {
      const [fx, fy] = flow(x, y, lying), w = 0.25 * Math.sin(n * 0.9 + wv);
      x += (fx * Math.cos(w) - fy * Math.sin(w)) * len / 12; y += (fx * Math.sin(w) + fy * Math.cos(w)) * len / 12;
      if (at(x, y) < 0.5) break;
      pts.push([x, y]);
    }
    if (pts.length > 3) lines.push(pts);
  }
  const f = { al, nx, ny, tx, ty, k, lines };
  hairFields.set(key, f);
  return f;
}
function locks(c, H, C, hair, name, dim, back = false) {
  const { g, L } = c, S = H.S, lying = name.endsWith('Lying'), F = hairField(C.seed + name, MASSES[name], lying), cnv = new OffscreenCanvas(HW, HH), img = new ImageData(HW, HH), px = img.data;
  const cr = Math.cos(H.roll), sr = Math.sin(H.roll), hv = L.h;
  for (let j = 0; j < HH; j++) for (let i = 0; i < HW; i++) {
    const p = j * HW + i, q = p * 4;
    if (F.al[p] <= 0.01) { px[q + 3] = 0; continue; }
    const x = HX0 + (i + 0.5) * HDD, y = HY0 + (j + 0.5) * HDD, cx = H.at[0] + (x * H.kx * cr - y * H.ky * sr) * S, cy = H.at[1] + (x * H.kx * sr + y * H.ky * cr) * S;
    const n = H.n([F.nx[p], F.ny[p], 1]), T = H.n([F.tx[p], F.ty[p], 0]), th = T[0] * hv[0] + T[1] * hv[1] + T[2] * hv[2];
    const col = shade(L, n, mul3(hair, F.k[p] * dim), cx, cy), w = reach(L, cx, cy) * clamp(n[0] * L.k[0] + n[1] * L.k[1] + n[2] * L.k[2] + 0.2);
    // the sheen across the fall
    const sh = Math.pow(Math.max(0, 1 - th * th), 14) * 0.4 * w * dim * F.k[p];
    px[q] = (col[0] + L.kc[0] * sh) * 255; px[q + 1] = (col[1] + L.kc[1] * sh) * 255; px[q + 2] = (col[2] + L.kc[2] * sh) * 255; px[q + 3] = F.al[p] * 255;
  }
  cnv.getContext('2d').putImageData(img, 0, 0);
  g.save();
  g.translate(H.at[0], H.at[1]); g.rotate(H.roll); g.scale(S * H.kx, S * H.ky); g.translate(Math.sin(H.yaw) * (back ? -0.2 : 0.12), 0); g.scale(Math.cos(H.yaw), 1);
  g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
  g.drawImage(cnv, HX0, HY0, HW * HDD, HH * HDD);
  // the strands, in the colour the light gives the mass under them, a little lighter or darker
  const list = [];
  F.lines.forEach((pts, m) => {
    const mid = pts[pts.length >> 1], i = clamp(Math.floor((mid[0] - HX0) / HDD), 0, HW - 1), j = clamp(Math.floor((mid[1] - HY0) / HDD), 0, HH - 1), q = (j * HW + i) * 4;
    const c0 = [px[q] / 255, px[q + 1] / 255, px[q + 2] / 255];
    list.push({ c: hash(m, 65) > 0.45 ? mix3(c0, mix3(L.kc, [1, 1, 1], 0.5), 0.3) : mul3(c0, 0.6), a: 0.34, p: pts });
  });
  strands(g, list, 0.0022);
  g.restore();
}
// the hair behind the head: Roderick's floating nimbus; Madeline's locks behind her neck
function hairBack(c, H, C, hair, t, life, wind, lying) {
  if (C.wild) nimbus(c, H, C, hair, t, life, wind);
  else if (!lying) locks(c, H, C, hair, 'back', 0.45, true);
}
// the hair in front: Roderick's off the crown and over the brow; Madeline's masses along her cheeks
function hairFront(c, H, C, hair, t, life, wind, lying) {
  if (C.wild) nimbusFront(c, H, C, hair, t, life, wind);
  else locks(c, H, C, hair, lying ? 'frontLying' : 'front', lying ? 0.55 : 0.85);
}
// the doctor: a bald crown, a grey fringe round it over the ears, bushy side-whiskers down the cheeks
function doctorEars(c, H, skin) {
  const { g, L } = c, S = H.S;
  for (const s of [-1, 1]) {
    const p = H.P(s * (H.R(0.06) + 0.02), 0.06, 0), col = shade(L, H.n([s * 0.8, 0, 0.6]), skin, p[0], p[1], 0.85);
    dab(g, p[0], p[1], 0.05 * S, 0.1 * S, H.roll + s * 0.15, col, 1, 0.75);
    dab(g, p[0] - s * 0.012 * S, p[1], 0.022 * S, 0.06 * S, H.roll, mul3(col, 0.55), 0.6);
  }
}
function doctorHair(c, H, C, hair) {
  locks(c, H, C, hair, 'whiskers', 0.55);
  // thin grey hair combed across the crown from a low parting, the scalp through it
  const S = H.S, combed = [];
  for (let i = 0; i < 70; i++) {
    const u = hash(i, 51), v = hash(i, 52), y0 = mix(-0.43, -0.3, v), x0 = 0.24 - 0.04 * v, pts = [];
    for (let k = 0; k <= 6; k++) { const w = k / 6, x = x0 - w * mix(0.3, 0.5, u), y = y0 - 0.035 * Math.sin(w * PI) + w * 0.03 * u; pts.push(H.on(x, y, 0.006)); }
    const col = hairLit(c, H, hair, [0, -0.8, 0.6], pts[3]);
    combed.push({ c: mul3(col, 0.7 + 0.4 * hash(i, 53)), a: 0.22, p: pts });
  }
  strands(c.g, combed, S * 0.002);
  // the bushy grey of them: hairs growing down the cheeks, curling a little out
  const list = [];
  for (const s of [-1, 1]) for (let i = 0; i < 220; i++) {
    const u = hash(i, s > 0 ? 31 : 32), v = hash(i, s > 0 ? 33 : 34), y = mix(-0.24, 0.36, u), x = s * (mix(0.28, 0.4, v) - Math.max(0, y - 0.15) * 0.45);
    const a = PI / 2 - s * (0.25 + 0.5 * (hash(i, 35) - 0.5)), l = 0.03 + 0.03 * hash(i, 36), p = H.P(x, y, 0.2), m = H.P(x + Math.cos(a) * l * 0.5 + s * 0.006, y + Math.sin(a) * l * 0.5, 0.2), q = H.P(x + Math.cos(a) * l, y + Math.sin(a) * l, 0.2);
    const col = hairLit(c, H, hair, [s * mix(0.5, 0.95, v), y < 0 ? -0.3 : 0.1, 0.6], p);
    list.push({ c: mul3(col, 0.65 + 0.5 * hash(i, 38)), a: 0.32, p: [p, m, q] });
  }
  strands(c.g, list, S * 0.0026);
}
function spectacles(c, H) {
  const { g, L } = c, S = H.S;
  const wire = css(shade(L, [0, -0.3, 0.95], [0.6, 0.52, 0.38], H.at[0], H.at[1]), 0.85), glint = mix3(L.kc, [1, 1, 1], 0.6);
  g.strokeStyle = wire; g.lineWidth = 0.005 * S;
  for (const s of [-1, 1]) {
    const p = H.on(s * 0.155, 0.006, 0.05), r = 0.068 * S;
    g.fillStyle = css(mix3(L.kc, [1, 1, 1], 0.3), 0.05);
    g.beginPath(); g.ellipse(p[0], p[1], r, r * 0.76, H.roll, 0, 7); g.fill(); g.stroke();
    // the light on the glass
    dab(g, p[0] + L.k[0] * r * 0.4, p[1] + L.k[1] * r * 0.35, r * 0.5, r * 0.16, -0.5, glint, 0.25);
    g.strokeStyle = css(glint, 0.65); g.lineWidth = 0.004 * S;
    g.beginPath(); g.ellipse(p[0], p[1], r * 0.82, r * 0.6, H.roll, -2.6 + L.k[0], -1.9 + L.k[0]); g.stroke();
    g.strokeStyle = wire; g.lineWidth = 0.005 * S;
    const e1 = H.on(s * 0.222, 0.0, 0.04), e2 = H.P(s * (H.R(0) + 0.01), 0.0, 0.05);
    g.beginPath(); g.moveTo(e1[0], e1[1]); g.lineTo(e2[0], e2[1]); g.stroke();
  }
  const b1 = H.on(-0.088, 0.0, 0.05), b2 = H.on(0.088, 0.0, 0.05), bm = H.on(0, -0.02, 0.06);
  g.beginPath(); g.moveTo(b1[0], b1[1]); g.quadraticCurveTo(bm[0], bm[1], b2[0], b2[1]); g.stroke();
}

// ---- the neck, the shoulders, the clothes ----
// the bust as a field over body space (the head's units, its middle at 0, y down): the neck, its
// cords and the hollow at its root, the collarbones, the slope to the shoulders — and what each
// wears over it: how far toward the eye, its colour, how open; skin or cloth; where a flush shows.
// Made once for each of the cast; lit each frame, its edges soft, lost in the dark
const BX0 = -1.2, BY0 = 0.2, BD = 0.02, BW = 120, BH = 90;
const SHOULDER = curve([[0, 0.48], [0.2, 0.58], [0.35, 0.68], [0.5, 0.77], [0.7, 0.87], [0.85, 0.97], [0.96, 1.11], [1.03, 1.36], [1.06, 2.0]]);
const busts = new Map();
function bustOf(who, C) {
  if (busts.has(who)) return busts.get(who);
  const N = BW * BH, z = new Float32Array(N), al = new Float32Array(N), r = new Float32Array(N), g = new Float32Array(N), b = new Float32Array(N);
  const skinF = new Float32Array(N), rose = new Float32Array(N), nx = new Float32Array(N), ny = new Float32Array(N);
  const nw0 = C.neck, skin = rgb(C.skin), M = C.male, G = C.gaunt;
  const seg = (x, y, x0, y0, x1, y1, w) => { const du = x1 - x0, dv = y1 - y0, k = clamp(((x - x0) * du + (y - y0) * dv) / (du * du + dv * dv)), ex = x - x0 - du * k, ey = y - y0 - dv * k; return Math.exp(-0.5 * (ex * ex + ey * ey) / (w * w)) * Math.sin(PI * (0.1 + 0.8 * k)); };
  // at a point: [height, colour, skin 0/1, where a flush shows, inside 0/1]
  const point = (x, y) => {
    const ax = Math.abs(x), nw = nw0 * (1 + 0.2 * clamp(y - 0.3)) + 0.1 * sm((y - 0.6) / 0.2);
    // the neck as a column, the shoulders and the chest as a broad round under it
    const zn = ax < nw ? Math.sqrt(nw * nw - ax * ax) * 0.9 : -1, inT = y - SHOULDER(ax);
    const zt = inT > 0 ? 0.32 * Math.sqrt(Math.max(0, 1 - (x / 1.1) ** 2)) * Math.sqrt(sm(inT / 0.25)) - 0.06 : -1;
    let h = Math.max(zn, zt);
    if (zn > -1 && zt > -1) h += Math.pow(Math.max(0, 0.04 - Math.abs(zn - zt)), 2) / 0.16;
    for (const s of [-1, 1]) h += 0.018 * seg(x, y, s * 0.11, 0.34, s * 0.03, 0.72, 0.022) + (0.012 + 0.008 * G) * seg(x, y, s * 0.05, 0.8, s * 0.44, 0.76, 0.016) - 0.014 * G * seg(x, y, s * 0.12, 0.74, s * 0.34, 0.7, 0.03);
    h -= 0.02 * Math.exp(-((x / 0.03) ** 2 + ((y - 0.77) / 0.025) ** 2)) - 0.02 * M * Math.exp(-((x / 0.025) ** 2 + ((y - 0.5) / 0.035) ** 2));
    let col = skin, sk = 1, fl = 0, inside = ax < nw || inT > 0 ? 1 : 0;
    if (who === 'roderick') {
      // the deep wine-black gown, its high rolled collar standing round the neck, a little of the shirt in the V
      const lin = mix(nw0 + 0.005, 0.02, clamp((y - 0.66) / 0.4)), lout = mix(nw0 + 0.12, 0.24, clamp((y - 0.5) / 0.6));
      if (ax > lin && y > 0.52 + 0.06 * clamp(1 - (ax - nw0) * 6) && (inside || ax < lout)) {
        sk = 0; col = rgb('#2a1a20'); inside = 1;
        if (ax < lout) { h += 0.04 * Math.sin(PI * clamp((ax - lin) / (lout - lin))); col = rgb('#33202a'); }
      } else if (y > 0.74 && ax < lin) { sk = 0; col = rgb('#8e8880'); }
    } else if (who === 'madeline') {
      // the white night gown, gathered at a wide neck below the collarbones
      const yn = 0.9 + 0.14 * (ax / 0.62) ** 2;
      if (y > yn || (ax > 0.66 && inside)) {
        sk = 0; col = rgb('#ccc7bf');
        h += 0.005 * Math.sin(x * 38) * Math.exp(-(y - yn) / 0.25) + 0.012 * Math.sin(x * 13 + 1) * clamp((y - yn) * 2);
        if (Math.abs(y - yn - 0.012) < 0.012) col = rgb('#b4aea4');
      } else fl = Math.exp(-(((y - 0.86) / 0.12) ** 2) - (x / 0.4) ** 2);
    } else if (y > 0.44) {
      // the high white collar, the black stock, the frock coat
      sk = 0;
      // the collar's two wings standing up under the jaw, parted at the front; the stock wound under them
      if (y < 0.58 && ax < nw + 0.03) { col = ax < 0.025 + (0.58 - y) * 0.25 ? rgb('#3a3634') : rgb('#cfd0cc'); h += 0.03 * sm((0.58 - y) / 0.04); }
      else if (y < 0.8 && ax < 0.19) { col = rgb('#141416'); h += 0.03 * Math.cos(ax * 8); }
      else if (y >= 0.62) { col = ax < 0.14 - (y - 0.8) * 0.1 ? rgb('#b8b0a4') : rgb('#1e1e22'); if (ax > 0.14 && ax < 0.3) h += 0.03; }
      else sk = 1;
    }
    return [h, col, sk, fl, inside];
  };
  // each cell the mean of nine points in it: soft edges
  for (let j = 0; j < BH; j++) for (let i = 0; i < BW; i++) {
    const p = j * BW + i, k = 1 + 0.06 * noise2(i * 0.4, j * 0.4, 31);
    let hh = 0, cr = 0, cg = 0, cb = 0, sk = 0, fl = 0, a = 0;
    for (let u = 0; u < 3; u++) for (let v = 0; v < 3; v++) {
      const [h, col, s, f, ins] = point(BX0 + (i + (u + 0.5) / 3) * BD, BY0 + (j + (v + 0.5) / 3) * BD);
      hh += h; cr += col[0]; cg += col[1]; cb += col[2]; sk += s; fl += f; a += ins;
    }
    z[p] = hh / 9; r[p] = cr / 9 * k; g[p] = cg / 9 * k; b[p] = cb / 9 * k; skinF[p] = sk / 9; rose[p] = fl / 9; al[p] = a / 9;
  }
  for (let j = 0; j < BH; j++) for (let i = 0; i < BW; i++) {
    const p = j * BW + i, l = i > 0 ? p - 1 : p, rr = i < BW - 1 ? p + 1 : p, u = j > 0 ? p - BW : p, d = j < BH - 1 ? p + BW : p;
    nx[p] = -(z[rr] - z[l]) / (2 * BD); ny[p] = -(z[d] - z[u]) / (2 * BD);
  }
  const f = { z, al, r, g, b, skin: skinF, rose, nx, ny };
  busts.set(who, f);
  return f;
}
function body(c, o, H, C, br) {
  const { g, L } = c, S = H.S, who = CAST[o.who] ? o.who : 'roderick', F = bustOf(who, C), cnv = new OffscreenCanvas(BW, BH), img = new ImageData(BW, BH), px = img.data, blush = o.blush ?? 0;
  const at = H.P(0, 0, 0), rl = H.roll * 0.4, cr = Math.cos(rl), sr = Math.sin(rl), up = -br * 0.012, yaw = H.yaw * 0.3;
  const rose = rgb('#d87a82'), jaw = 0.45 + 0.3 * clamp(-L.k[1]), cy = Math.cos(yaw), sy = Math.sin(yaw);
  for (let j = 0; j < BH; j++) for (let i = 0; i < BW; i++) {
    const p = j * BW + i, q = p * 4;
    if (F.al[p] <= 0) { px[q + 3] = 0; continue; }
    const x = BX0 + (i + 0.5) * BD, y = BY0 + (j + 0.5) * BD, cx = at[0] + (x * cr - y * sr) * S, cyy = at[1] + (x * sr + y * cr) * S;
    const n0 = norm([F.nx[p], F.ny[p], 1]), n = [n0[0] * cy + n0[2] * sy, n0[1], -n0[0] * sy + n0[2] * cy];
    const nr = [n[0] * cr - n[1] * sr, n[0] * sr + n[1] * cr, n[2]];
    let a = [F.r[p], F.g[p], F.b[p]];
    if (blush && F.rose[p]) a = mix3(a, rose, 0.55 * blush * F.rose[p]);
    // the head's shadow under the jaw
    const cast = mix(1, sm((y - jaw + L.k[0] * x * 0.3) / 0.16), F.skin[p]);
    const col = pale(shade(L, nr, a, cx, cyy, 0.7, cast, F.skin[p] * 0.25), C.pallor * F.skin[p]);
    px[q] = col[0] * 255; px[q + 1] = col[1] * 255; px[q + 2] = col[2] * 255; px[q + 3] = F.al[p] * 255;
  }
  cnv.getContext('2d').putImageData(img, 0, 0);
  g.save();
  g.translate(at[0], at[1]); g.rotate(rl); g.scale(S, S);
  g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
  g.drawImage(cnv, BX0 + yaw * 0.2, BY0 + up, BW * BD, BH * BD);
  g.restore();
  if (who === 'madeline' && o.blood) bloodGown(c, headFrame(at, S, 0, 0, rl, H.R), up, o.blood);
}
function bloodGown(c, B, up, blood) {
  const { g } = c, S = B.S;
  for (let i = 0; i < 10; i++) {
    const u = hash(i, 41), v = hash(i, 42), p = B.P((u - 0.5) * 1.1, 1.1 + v * 0.5 + up, 0), r = S * (0.05 + 0.07 * hash(i, 43)) * clamp(blood * 1.6 - u * 0.5);
    if (r <= 0) continue;
    dab(g, p[0], p[1] + r * 0.3, r * 1.2, r * 1.7, (hash(i, 44) - 0.5) * 0.5, [0.22, 0.035, 0.04], 0.75, 0.35);
    dab(g, p[0], p[1] + r * 1.4, r * 0.25, r * 0.9, 0, [0.26, 0.03, 0.04], 0.6, 0.3);
  }
  // the tear in the gown at the shoulder
  const a = B.P(0.3, 0.95 + up, 0), b = B.P(0.5, 1.2 + up, 0), d = B.P(0.36, 1.32 + up, 0);
  g.fillStyle = 'rgba(10,8,9,0.7)'; g.beginPath(); g.moveTo(a[0], a[1]); g.quadraticCurveTo(b[0], b[1] - S * 0.1, b[0], b[1]); g.lineTo(d[0], d[1]); g.closePath(); g.fill();
}
function bloodFace(c, H, blood) {
  const { g } = c, S = H.S, a = clamp(blood * 1.5 - 0.4);
  // scratches at the temple, blood run down from them and dried, a smear on the jaw — soft, dark
  g.save(); g.filter = `blur(${(S * Math.hypot(g.getTransform().a, g.getTransform().b) * 0.003).toFixed(5)}px)`; g.lineCap = 'round';
  for (let i = 0; i < 3; i++) {
    const p = H.on(0.2 + i * 0.022, -0.24 + i * 0.012), q = H.on(0.25 + i * 0.022, -0.12 + i * 0.012);
    g.strokeStyle = `rgba(52,8,10,${0.5 * a})`; g.lineWidth = 0.006 * S;
    g.beginPath(); g.moveTo(p[0], p[1]); g.lineTo(q[0], q[1]); g.stroke();
  }
  const r0 = H.on(0.27, -0.1), r1 = H.on(0.285, 0.05), r2 = H.on(0.27, 0.2);
  g.strokeStyle = `rgba(58,8,10,${0.45 * a})`; g.lineWidth = 0.009 * S;
  g.beginPath(); g.moveTo(r0[0], r0[1]); g.quadraticCurveTo(r1[0], r1[1], r2[0], r2[1]); g.stroke();
  g.restore();
  hdab(g, H, 0.25, -0.17, 0.05, 0.035, 0.6, [0.22, 0.03, 0.035], 0.3 * a, 0.2);
  hdab(g, H, -0.17, 0.38, 0.05, 0.03, 0.4, [0.24, 0.03, 0.04], 0.45 * a, 0.2);
}
// lying in the coffin: its dark sides, the pale satin lining in folds, the pillow under the head
function bed(c, H, S) {
  const { g, L } = c, o = H.P(0, 0.1, -0.5), satin = rgb('#8a8278'), wood = rgb('#2e2018');
  // the satin in the dark, the torch's light on it round the head
  g.fillStyle = css(shade(L, [0, 0, 1], satin, o[0] + 2, o[1] + 2, 0.4)); g.fillRect(o[0] - 1.3 * S, -1, 2.6 * S, 2);
  const lit = shade(L, [0, -0.2, 0.98], satin, H.at[0], H.at[1], 0.8), gr = g.createRadialGradient(H.at[0], H.at[1], 0, H.at[0], H.at[1], S * 1.1);
  gr.addColorStop(0, css(lit)); gr.addColorStop(0.5, css(lit, 0.55)); gr.addColorStop(1, css(lit, 0));
  g.fillStyle = gr; g.fillRect(o[0] - 1.3 * S, -1, 2.6 * S, 2);
  // the folds of the lining, fanning out from the head: a lit edge, a shadow beside it
  for (let i = 0; i < 22; i++) {
    const s = i % 2 ? 1 : -1, a = s * (0.3 + 1.2 * hash(i, 91)), r = S * (0.7 + 0.45 * hash(i, 92));
    const p = [o[0] + Math.sin(a) * r, o[1] - Math.cos(a) * r * 0.8], n = norm([Math.sin(a + 1.2 * s) * 0.6, -Math.cos(a) * 0.3, 0.75]);
    dab(g, p[0], p[1], S * 0.09, S * 0.3, a, shade(L, n, satin, p[0], p[1], 0.7), 0.16);
    dab(g, p[0] + Math.cos(a) * S * 0.08, p[1] + Math.sin(a) * S * 0.06, S * 0.07, S * 0.28, a, mul3(L.f, 0.6), 0.16);
  }
  // the pillow under the head
  const pc = H.P(0, -0.15, -0.45);
  dab(g, pc[0], pc[1], S * 0.8, S * 0.55, H.roll, shade(L, H.n([0, -0.3, 0.95]), satin, pc[0], pc[1], 0.8), 0.6, 0.4);
  // the coffin's sides in the dark, the torch along their edges
  for (const s of [-1, 1]) {
    const x = o[0] + s * 1.3 * S;
    g.fillStyle = css(shade(L, [-s * 0.6, 0, 0.8], wood, x, 0, 0.5)); g.fillRect(s > 0 ? x : x - 2, -1, 2, 2);
    g.fillStyle = css(shade(L, [s * 0.2, -0.3, 0.9], wood, x, 0)); g.fillRect(s > 0 ? x + 0.05 * S : x - 0.15 * S, -1, 0.1 * S, 2);
    dab(g, x, o[1], 0.08 * S, 1.2, 0, mul3(L.f, 0.3), 0.7);
  }
}

// ---- hands ----
// skin, how pale it is; w — how broad, len — how long the fingers; the sleeve and its cuff
const HANDS = {
  roderick: { skin: '#d6c6b6', pallor: 0.3, w: 0.82, len: 1.12, sleeve: '#3a1a22', cuff: '#cdc8bf' },
  madeline: { skin: '#e2d6cc', pallor: 0.35, w: 0.84, len: 1.08, sleeve: '#c4bfb7' },
  narrator: { skin: '#cdb3a3', pallor: 0.2, w: 1.0, len: 1.0, sleeve: '#2a2c30', cuff: '#c8c2b8' },
  doctor: { skin: '#d8aa90', pallor: 0.1, w: 1.12, len: 0.92, sleeve: '#1e1e22', cuff: '#d8d0c4' },
};
// poses: how the fingers curl (0 straight … 1 a fist), how they spread; palm — the palm toward the eye
const POSES = {
  rest: { curl: 0.28, spread: 0.04 },
  touch: { curl: 0.14, spread: 0.05 },
  reach: { curl: 0.22, spread: 0.45, palm: true },
  open: { curl: 0.06, spread: 0.35 },
  grip: { curl: 0.95, spread: 0.0 },
  // round another's wrist: the back of the hand to the eye, the fingers half closed (laid over the wrist it holds)
  clasp: { curl: 0.6, spread: 0.02 },
  cover: { curl: 0.1, spread: 0.3 },
};
// a hand's form over hand space (u across, v along, unit — its length): how far toward the eye each
// cell is — the palm, the thumb's root, the bones as tapered rounds, smoothly joined — its slope,
// how open it is, the skin's colour (redder over the knuckles and at the tips); kept by its pose
const HU = 120, HV = 142, U0 = -0.62, V0 = -1.3, HD = 1.24 / HU;
const handForms = new Map();
function handForm(key, caps, palmAt, thenar, knuckles, skin) {
  if (handForms.has(key)) return handForms.get(key);
  const N = HU * HV, h = new Float32Array(N), al = new Float32Array(N);
  for (let j = 0; j < HV; j++) {
    const v = V0 + (j + 0.5) * HD;
    for (let i = 0; i < HU; i++) {
      const u = U0 + (i + 0.5) * HD, p = j * HU + i;
      let best = null, rim = null, edge = -1;
      const join = (z, e) => { edge = Math.max(edge, e); if (e > 0) best = best === null ? z : Math.max(z, best) + Math.pow(Math.max(0.02 - Math.abs(z - best), 0), 2) / 0.08; else rim = Math.max(rim ?? z, z); };
      const pa = palmAt(u, v);
      if (pa) join(pa[0], pa[1]);
      const tq = ((u - thenar[0]) / thenar[2]) ** 2 + ((v - thenar[1]) / thenar[3]) ** 2;
      if (tq < 1) join(0.02 + 0.06 * Math.sqrt(1 - tq), (1 - tq) * 0.06);
      // each part (a finger, the wrist…) is its rounds' highest; the parts are joined softly
      let part = -1, pz = -1, pe = -1;
      for (const [u0, v0, u1, v1, r0, r1, z0, z1, m] of caps) {
        if (m !== part) { if (pe > -HD) join(pz, pe); part = m; pz = -1; pe = -1; }
        if (Math.abs(u - (u0 + u1) / 2) > Math.abs(u1 - u0) / 2 + r0 + 0.04 || Math.abs(v - (v0 + v1) / 2) > Math.abs(v1 - v0) / 2 + r0 + 0.04) continue;
        const du = u1 - u0, dv = v1 - v0, k = clamp(((u - u0) * du + (v - v0) * dv) / (du * du + dv * dv || 1e-9)), r = mix(r0, r1, k), d = Math.hypot(u0 + du * k - u, v0 + dv * k - v);
        if (d < r + HD) { pz = Math.max(pz, mix(z0, z1, k) + Math.sqrt(Math.max(0, r * r - d * d))); pe = Math.max(pe, r - d); }
      }
      if (pe > -HD) join(pz, pe);
      // just outside the form (its soft edge) the height of the round's rim, so the edge lights as the form does
      h[p] = best ?? rim ?? -0.03; al[p] = clamp(edge / (1.6 * HD) + 0.5);
    }
  }
  // the form smoothed a little, its rounds' seams gone: twice across, twice along
  const tmp = new Float32Array(N);
  for (let pass = 0; pass < 4; pass++) {
    const d = pass % 2 ? HU : 1, src = pass % 2 ? tmp : h, dst = pass % 2 ? h : tmp;
    for (let p = 0; p < N; p++) {
      const a = p - d >= 0 && al[p - d] > 0 ? src[p - d] : src[p], b = p + d < N && al[p + d] > 0 ? src[p + d] : src[p];
      dst[p] = al[p] > 0 ? (a + 2 * src[p] + b) / 4 : src[p];
    }
  }
  const nx = new Float32Array(N), ny = new Float32Array(N), occ = new Float32Array(N), r = new Float32Array(N), g = new Float32Array(N), b = new Float32Array(N);
  for (let j = 0; j < HV; j++) {
    for (let i = 0; i < HU; i++) {
      const p = j * HU + i;
      if (al[p] <= 0) continue;
      // the slope from the neighbours on the form (off it, the cell's own height)
      const hv = q => (al[q] > 0 ? h[q] : h[p]);
      nx[p] = -(hv(i < HU - 1 ? p + 1 : p) - hv(i > 0 ? p - 1 : p)) / (2 * HD);
      ny[p] = -(hv(j < HV - 1 ? p + HU : p) - hv(j > 0 ? p - HU : p)) / (2 * HD);
      occ[p] = clamp(1 - Math.max(0, (h[Math.max(0, p - 5)] + h[Math.min(N - 1, p + 5)]) / 2 - h[p]) * 10, 0.5, 1);
      const u = U0 + (i + 0.5) * HD, v = V0 + (j + 0.5) * HD;
      const k = 1 + 0.07 * noise2(u * 22, v * 22, 71) + 0.03 * noise2(u * 60, v * 60, 72);
      let a = [skin[0] * k, skin[1] * k, skin[2] * k];
      for (const [ku, kv] of knuckles) { const e = ((u - ku) ** 2 + (v - kv) ** 2) / 0.004; if (e < 4) a = mix3(a, [0.85, 0.55, 0.52], 0.18 * Math.exp(-e)); }
      if (v < -0.75) a = mix3(a, [0.88, 0.6, 0.58], 0.12 * clamp((-0.75 - v) * 4));
      r[p] = a[0]; g[p] = a[1]; b[p] = a[2];
    }
  }
  const f = { al, nx, ny, occ, r, g, b };
  if (handForms.size > 8) handForms.delete(handForms.keys().next().value);
  handForms.set(key, f);
  return f;
}
// hand(o) — one hand: the wrist at o.at, the fingers toward o.angle (0 up, + clockwise), o.size its
// length on the card; closeups.md lists the rest
function hand(c, o) {
  const { g, t, L } = c, P0 = POSES[o.pose] || POSES.rest, Hd = HANDS[o.who] || HANDS.narrator;
  const life = o.frozen ? 0 : 1, size = o.size ?? 0.4, tremble = (o.tremble ?? 0) * life;
  const curl = o.curl ?? P0.curl, spread = o.spread ?? P0.spread, palm = o.palm ?? !!P0.palm, side = o.side ?? 1;
  const raise = o.raise ?? 1, blood = o.blood ?? 0;
  const ang = (o.angle ?? 0) + tremble * 0.03 * noise(t * 9, 5) + life * 0.02 * drift(t * 0.3, 21);
  const [x0, y0] = o.at || [0, 0.2];
  const x = x0 + tremble * 0.003 * noise(t * 11, 3), y = y0 + (1 - sm(raise)) * (0.6 + size) + tremble * 0.003 * noise(t * 13, 4);
  const ca = Math.cos(ang), sa = Math.sin(ang);
  // hand space: the wrist at 0, the fingers up (−y), unit — the hand's length
  const T = (u, v) => [x + (u * ca - v * sa) * size, y + (u * sa + v * ca) * size];
  const skin = rgb(Hd.skin), nrm = (nx, ny, nz) => norm([nx * ca - ny * sa, nx * sa + ny * ca, nz]);
  const tx = (palm ? 1 : -1) * side, W = 0.4 * Hd.w;
  // the bones: index … little from the knuckles, the thumb from the palm's side; each joint bends
  // the finger away as it curls, and it shortens to the eye
  const bones = (u, v, a, segs, bends) => {
    const pts = [[u, v]];
    let b = 0;
    segs.forEach((seg, k) => {
      b += bends[k];
      const len = seg * Math.cos(b);
      u += Math.sin(a) * len; v -= Math.cos(a) * len;
      pts.push([u, v]);
    });
    return { pts, bend: b };
  };
  const fingers = [0.35, 0.39, 0.37, 0.29].map((l, f) => {
    const u = tx * (0.75 - f * 0.5) * W * 0.5, v = -0.47 - (f === 1 || f === 2 ? 0.025 : 0) + (f === 3 ? 0.03 : 0);
    const a = tx * (1.5 - f) * spread * 0.26, k = curl * (0.9 + 0.2 * hash(f, 3));
    return { ...bones(u, v, a, [0.46, 0.3, 0.24].map(s => s * l * Hd.len), [k * 1.0, k * 1.35, k * 0.9]), r: (0.053 - f * 0.004) * Hd.w };
  });
  const ta = tx * (0.25 + spread * 0.6 - curl * 0.8);
  const thumb = { ...bones(tx * W * 0.4, -0.1, ta, [0.2, 0.17, 0.14], [0, curl * 0.4, curl * 0.5]), r: 0.065 * Hd.w };
  // the form: palm, wrist, the thumb's root, the bones of the fingers as tapered rounds, smoothly
  // joined; a field over hand space lit cell by cell (and its shadow, if it lies on something)
  const caps = [];
  // a finger as one smooth tapering round along a curve through its joints (knuckle, middle, end, tip)
  const bonesOf = (f, z0, r0, taper, m) => {
    const zs = [z0];
    for (let k = 0; k < f.pts.length - 1; k++) {
      const [u0, v0] = f.pts[k], [u1, v1] = f.pts[k + 1];
      zs.push(zs[k] + Math.hypot(u1 - u0, v1 - v0) * Math.sin(Math.min(1.4, f.bend * (k + 1) / 3)) * (palm ? 0.6 : -0.9));
    }
    const P = f.pts.map((p, k) => [p[0], p[1], zs[k]]), n = P.length - 1, at = w => {
      const i = Math.min(n - 1, Math.floor(w * n)), k = w * n - i, p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(n, i + 2)];
      return [0, 1, 2].map(m => 0.5 * (2 * p1[m] + (p2[m] - p0[m]) * k + (2 * p0[m] - 5 * p1[m] + 4 * p2[m] - p3[m]) * k * k + (3 * p1[m] - p0[m] - 3 * p2[m] + p3[m]) * k * k * k));
    };
    let a = at(0);
    for (let k = 1; k <= 12; k++) {
      const b = at(k / 12);
      // a little fuller at the joints
      const j = w => 1 + 0.05 * Math.pow(Math.cos(w * n * PI), 8);
      caps.push([a[0], a[1], b[0], b[1], r0 * (1 - taper * (k - 1) / 12) * j((k - 1) / 12), r0 * (1 - taper * k / 12) * j(k / 12), a[2], b[2], m]);
      a = b;
    }
  };
  fingers.forEach((f, m) => bonesOf(f, 0.035, f.r, 0.22, m));
  bonesOf(thumb, 0.03, thumb.r, 0.25, 4);
  caps.push([0, 0.16, 0, -0.04, W * 0.36, W * 0.4, -0.12, -0.08, 5]);
  // the palm (the back of the hand): broad across the knuckles, narrowing to the wrist
  const palmAt = (u, v) => {
    const q = Math.pow(Math.abs(u) / (W * mix(0.56, 0.44, clamp((v + 0.5) / 0.5))), 2.2) + Math.pow(Math.abs(v + 0.27) / 0.29, 2.6);
    if (q >= 1.2) return null;
    // seen from its back: the tendons fanning from the wrist to the knuckles
    let td = 0;
    if (!palm) for (const f of fingers) { const [ku, kv] = f.pts[0], k = clamp((v - kv) / (0.02 - kv)), e = u - mix(ku, ku * 0.25, k); td += Math.exp(-0.5 * (e / 0.014) ** 2) * Math.sin(PI * (0.15 + 0.7 * k)); }
    return [-0.02 + 0.11 * Math.pow(Math.max(0, 1 - q), 0.6) + 0.007 * td * clamp(1 - q), (1 - q) * 0.1];
  };
  // the thumb's root: a full mound on the palm's side, a slight one seen from the back
  const thenar = palm ? [tx * W * 0.36, -0.13, 0.11, 0.17] : [tx * W * 0.4, -0.16, 0.07, 0.13];
  const F = handForm([o.who, palm, side, curl.toFixed(2), spread.toFixed(2)].join(), caps, palmAt, thenar, fingers.map(f => f.pts[0]), skin);
  const handCnv = new OffscreenCanvas(HU, HV), handImg = new ImageData(HU, HV), handSh = new OffscreenCanvas(HU, HV), handShImg = new ImageData(HU, HV);
  const px = handImg.data, sp = handShImg.data, mid = T(0, -0.45), Lh = L.pool ? L : { ...L, pool: [mid[0], mid[1], size * 1.1] };
  for (let j = 0; j < HV; j++) {
    for (let i = 0; i < HU; i++) {
      const p = j * HU + i, q = p * 4;
      if (F.al[p] <= 0) { px[q + 3] = 0; sp[q + 3] = 0; continue; }
      const c0 = T(U0 + (i + 0.5) * HD, V0 + (j + 0.5) * HD), col = pale(shade(Lh, nrm(F.nx[p], F.ny[p], 1), [F.r[p], F.g[p], F.b[p]], c0[0], c0[1], F.occ[p], 1, 0.08), Hd.pallor);
      px[q] = col[0] * 255; px[q + 1] = col[1] * 255; px[q + 2] = col[2] * 255; px[q + 3] = F.al[p] * 255;
      sp[q] = sp[q + 1] = sp[q + 2] = 0; sp[q + 3] = 110 * F.al[p];
    }
  }
  handCnv.getContext('2d').putImageData(handImg, 0, 0);
  const lay = (cnv, dx = 0, dy = 0, blur = 0) => {
    g.save(); g.translate(x + dx, y + dy); g.rotate(ang); g.scale(size, size);
    if (blur) g.filter = `blur(${(blur * Math.hypot(g.getTransform().a, g.getTransform().b)).toFixed(5)}px)`;
    g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
    g.drawImage(cnv, U0, V0, HU * HD, HV * HD);
    g.restore();
  };
  if (o.on) { handSh.getContext('2d').putImageData(handShImg, 0, 0); lay(handSh, -L.k[0] * size * 0.07, -L.k[1] * size * 0.07 + size * 0.03, 0.025); }
  lay(handCnv);
  // over the wrist's end: the sleeve from the frame's edge — cloth round the arm, lit across its
  // round, in soft folds bunched toward the wrist, going off into the dark; under a coat's sleeve a
  // sliver of the shirt's cuff
  if (o.sleeve !== false) {
    const onScreen = size * Math.hypot(g.getTransform().a, g.getTransform().b), v0 = Hd.cuff ? 0.1 : 0.05, sc = rgb(Hd.sleeve);
    const hw = v => (v < 0.6 ? W * mix(0.62, 0.82, clamp((v - v0) / (0.6 - v0))) : mix(W * 0.82, 0.42, (v - 0.6) / 1.1));
    const across = (col, v, p) => {
      const a = T(-hw(v), v), b = T(hw(v), v), gr = g.createLinearGradient(a[0], a[1], b[0], b[1]);
      for (let k = 0; k <= 4; k++) { const u = k / 2 - 1, q = T(u * hw(v), v); gr.addColorStop(k / 4, css(pale(shade(L, nrm(u * 0.85, 0, Math.sqrt(1 - 0.72 * u * u)), col, q[0], q[1]), p))); }
      return gr;
    };
    if (Hd.cuff) {
      g.save(); g.filter = `blur(${(onScreen * 0.004).toFixed(5)}px)`;
      g.fillStyle = across(rgb(Hd.cuff), 0.07, 0.5); g.beginPath(); smooth(g, [T(-W * 0.56, 0.035), T(0, 0.055), T(W * 0.56, 0.035), T(W * 0.6, 0.12), T(-W * 0.6, 0.12)], true); g.fill();
      g.restore();
    }
    g.save(); g.filter = `blur(${(onScreen * 0.008).toFixed(5)}px)`;
    const q = [T(-hw(v0), v0), T(-hw(0.6), 0.6), T(-0.42, 1.7), T(0.42, 1.7), T(hw(0.6), 0.6), T(hw(v0), v0)];
    g.fillStyle = across(sc, 0.4, Hd.pallor); g.beginPath(); smooth(g, q, true); g.fill();
    // the folds: a crease across the arm, the cloth over it catching the light
    const lit = pale(shade(L, nrm(L.k[0], L.k[1], 1), sc, x, y), Hd.pallor);
    g.lineCap = 'round'; g.filter = `blur(${(onScreen * 0.025).toFixed(5)}px)`;
    for (let k = 0; k < 4; k++) {
      const v = v0 + 0.1 + 0.75 * Math.pow(k / 4, 1.4) + 0.06 * hash(k, 81), bow = 0.04 + 0.08 * hash(k, 82), tilt = (hash(k, 83) - 0.5) * 0.2, e = hw(v) * 0.75;
      for (const [dv, c, a, w] of [[0.03, L.f, 0.35, 0.07], [-0.025, lit, 0.14, 0.05]]) {
        const p0 = T(-e, v + tilt + dv), p1 = T(0, v + bow + dv), p2 = T(e, v - tilt + dv);
        g.strokeStyle = css(c, a); g.lineWidth = size * w;
        g.beginPath(); g.moveTo(p0[0], p0[1]); g.quadraticCurveTo(2 * p1[0] - (p0[0] + p2[0]) / 2, 2 * p1[1] - (p0[1] + p2[1]) / 2, p2[0], p2[1]); g.stroke();
      }
    }
    // and the arm going off into the dark
    const m0 = T(0, 0.2), m1 = T(0, 1.3), gd = g.createLinearGradient(m0[0], m0[1], m1[0], m1[1]);
    gd.addColorStop(0, css(L.f, 0)); gd.addColorStop(1, css(L.f, 0.9));
    g.fillStyle = gd; g.beginPath(); smooth(g, q, true); g.fill();
    g.restore();
    if (blood && o.who === 'madeline') {
      const p = T(0.02, 0.22), q2 = T(-0.08, 0.6);
      dab(g, p[0], p[1], size * 0.26, size * 0.2, ang, [0.3, 0.03, 0.04], 0.75 * clamp(blood), 0.4);
      dab(g, q2[0], q2[1], size * 0.08, size * 0.3, ang, [0.28, 0.03, 0.04], 0.5 * clamp(blood), 0.3);
    }
  }
  // the small marks: nails, the creases of the joints; the palm's lines
  const mark = (pts, w, a) => { const q = pts.map(([u, v]) => T(u, v)); g.strokeStyle = css(mul3(shade(L, nrm(0, 0, 1), skin, q[0][0], q[0][1]), 0.55), a); g.lineWidth = size * w; g.lineCap = 'round'; g.beginPath(); smooth(g, q, false); g.stroke(); };
  for (const f of fingers) {
    const e = f.pts[f.pts.length - 1], d = f.pts[f.pts.length - 2], uu = e[0] - d[0], vv = e[1] - d[1], l = Math.hypot(uu, vv) || 1, r = f.r;
    if (!palm && f.bend < 1.4) {
      const m = T(e[0] - uu / l * r * 0.55, e[1] - vv / l * r * 0.55), cM = shade(L, nrm(0, 0, 1), skin, m[0], m[1]);
      dab(g, m[0], m[1], r * size * 0.45, r * size * 0.6, ang + Math.atan2(vv, uu) + PI / 2, mix3(cM, [1, 0.9, 0.88], 0.2), 0.3, 0.3);
    }
    if (blood) {
      // blood dried into the creases, smeared down from the tips
      const k = clamp(blood * 1.4 - hash(f.r * 1000, 7) * 0.4), a = ang + Math.atan2(vv, uu) + PI / 2, m = T(e[0] - uu / l * r * 1.2, e[1] - vv / l * r * 1.2), j = T(f.pts[2][0], f.pts[2][1]);
      dab(g, m[0], m[1], r * size * 0.9, r * size * 2.2, a, [0.3, 0.04, 0.05], 0.55 * k, 0.2);
      dab(g, j[0], j[1], r * size * 0.8, r * size * 1.4, a + 0.3, [0.26, 0.03, 0.04], 0.4 * k, 0.1);
    }
  }
  if (palm) {
    mark([[-W * 0.45 * tx, -0.37], [0, -0.31], [W * 0.42 * tx, -0.41]], 0.005, 0.2);
    mark([[W * 0.3 * tx, -0.05], [W * 0.05 * tx, -0.2], [-W * 0.1 * tx, -0.43]], 0.005, 0.2);
  }
  if (blood) {
    const p = T(0, -0.25);
    dab(g, p[0], p[1], W * size * 0.5, size * 0.22, ang, [0.28, 0.03, 0.04], 0.7 * clamp(blood), 0.3);
    for (let i = 0; i < 3; i++) {
      const u = hash(i, 61), d = T((u - 0.5) * 0.4, 0.02 + ((t * 0.05 * life + u) % 1) * 0.3);
      dab(g, d[0], d[1], size * 0.011, size * 0.02, ang, [0.32, 0.04, 0.05], 0.8 * clamp(blood * 1.4 - u * 0.4), 0.5);
    }
  }
  // its palm: a point the game may point at (o.name)
  if (o.name) { const m = T(0, -0.45); c.e.at(m[0], m[1], o.name); }
}
// Roderick's hands over his face: the long fingers spread up over the eyes — painted where they cover it (live() lets
// them down as far as `cover` says)
function handsOnFace(c, H, o) {
  const { g, L } = c, S = H.S;
  for (const s of [-1, 1]) {
    const w = H.P(s * 0.12, 0.5, 0.5), m = H.P(s * 0.1 - L.k[0] * 0.05, 0.08 - L.k[1] * 0.05, 0.5);
    // the hand's shadow on the face
    dab(g, m[0], m[1], 0.17 * S, 0.34 * S, H.roll, mul3(L.f, 0.4), 0.5);
    hand(c, { who: o.who, pose: 'cover', at: [w[0], w[1]], size: S * 0.72, angle: s * -0.1 + H.roll, side: s, palm: false, tremble: o.tremble ?? 0.4 });
  }
}
// tears running out between the fingers: drops and their wet streaks down the band under the eyes — the layer drifts
// down, round its box
function fingerTears(c, H, S) {
  const { g, L } = c, kc = mix3(L.kc, [1, 1, 1], 0.5);
  for (const s of [-1, 1]) for (let i = 0; i < 2; i++) for (let k = 0; k < 2; k++) {
    const u = (hash(i * 2 + k, s + 70) + k * 0.5) % 1, p = H.on(s * (0.07 + i * 0.075), 0.12 + u * 0.4, 0.3), q = H.on(s * (0.07 + i * 0.075), 0.12 + Math.max(0, u - 0.12) * 0.4, 0.3);
    g.strokeStyle = css(kc, 0.2); g.lineWidth = 0.003 * S; g.lineCap = 'round';
    g.beginPath(); g.moveTo(q[0], q[1]); g.lineTo(p[0], p[1]); g.stroke();
    dab(g, p[0], p[1], 0.006 * S, 0.01 * S, 0, kc, 0.7, 0.5);
  }
}

// ---- things ----
// mirror(o) — a small hand mirror; fog 0…1 — breath on the glass; held — the hand on its handle
function mirror(c, o) {
  const { g, L, t } = c, at = o.at || [0, 0], r = o.size ?? 0.12, a = o.angle ?? 0.4, fog = o.fog ?? 0;
  if (o.held !== false) hand(c, { who: o.who || 'narrator', pose: 'grip', at: [at[0] - Math.sin(a) * r * 3.2, at[1] + Math.cos(a) * r * 3.2], size: r * 2.6, angle: a, side: -1 });
  g.save(); g.translate(at[0], at[1]); g.rotate(a);
  // the handle, dark wood
  g.fillStyle = css(shade(L, [0.3, -0.2, 0.9], rgb('#3a2a1e'), at[0], at[1]));
  g.beginPath(); g.roundRect(-r * 0.13, r * 0.95, r * 0.26, r * 1.9, r * 0.1); g.fill();
  // the frame, old silver
  const fc = shade(L, [0, 0, 1], rgb('#8c8478'), at[0], at[1]);
  g.fillStyle = css(mul3(fc, 0.7)); g.beginPath(); g.ellipse(0, 0, r * 1.13, r * 1.15, 0, 0, 7); g.fill();
  g.strokeStyle = css(mix3(fc, L.kc, 0.4), 0.8); g.lineWidth = r * 0.05;
  g.beginPath(); g.ellipse(0, 0, r * 1.09, r * 1.11, 0, PI * 0.9 + Math.atan2(L.k[1], L.k[0]), PI * 1.6 + Math.atan2(L.k[1], L.k[0])); g.stroke();
  // the glass: the dark of the vault, the torch's glint
  const gr = g.createLinearGradient(-r, -r, r, r);
  gr.addColorStop(0, css(mix3(L.f, L.kc, 0.22))); gr.addColorStop(0.5, css(mul3(L.f, 0.8))); gr.addColorStop(1, css(mul3(L.f, 0.4)));
  g.fillStyle = gr; g.beginPath(); g.ellipse(0, 0, r, r * 1.02, 0, 0, 7); g.fill();
  dab(g, L.k[0] * r * 0.45, L.k[1] * r * 0.45, r * 0.3, r * 0.08, -0.7, mix3(L.kc, [1, 1, 1], 0.4), 0.7, 0.3);
  // the breath: a milky bloom from the lips' side, its edge soft, breathing
  if (fog > 0.01) {
    const fr = r * (0.35 + 0.7 * sm(fog)) * (1 + 0.04 * Math.sin(t * 3));
    g.save(); g.beginPath(); g.ellipse(0, 0, r, r * 1.02, 0, 0, 7); g.clip();
    dab(g, 0, r * 0.1, fr, fr * 0.9, 0, [0.78, 0.76, 0.74], 0.6 * fog, 0.3);
    g.restore();
  }
  g.restore();
  c.e.at(at[0], at[1], o.point || 'mirror');
}
// screws(o) — the coffin's lid, close: dark wood, four iron screws, the driver in a hand. Painted once, as layers live()
// moves by now.screws { v: [4 numbers: 0 standing … 1 home, three turns of the slot on the way], at (the screw the
// driver is in; between two — a fraction — the hand travels, the driver lifted; −1 none), test (0…1: the fingers instead,
// trying the screw at `at`) }: screws (the lid, its grain, the coffin's side), screws:gap (the dark gap under the lid,
// closing as the screws go in), screwN:shaft (its thread standing out of the hole), screwN:head (its head, rising
// with it; its point screwN), screwN:slot (turning), driver (the driver and the hand round its handle), test (the
// fingers on a screw's head). o: { who (whose hand), hand: false (none) }
const SCREW_TURNS = 3, SCREW_X = [-0.66, -0.22, 0.22, 0.66], SCREW_Y = 0.17, GAP = 0.021;
const screwR = x => 0.042 + 0.006 * (1 - Math.abs(x));
function screws(c, o) {
  const { L } = c, wood = rgb('#4e3626');
  c.layer('screws', {}, () => {
    const { g } = c;
    // the lid's wood in the torch's pool of light, its grain
    g.fillStyle = css(shade(L, [0, -0.2, 0.98], wood, 0.9, -0.6, 0.7)); g.fillRect(-1.2, -0.7, 2.4, 1.0);
    const gr = g.createRadialGradient(L.at[0] * 0.6, 0.1, 0, L.at[0] * 0.6, 0.1, 1.3);
    gr.addColorStop(0, css(shade(L, [0, -0.2, 0.98], wood, L.at[0] * 0.5, 0.1))); gr.addColorStop(1, css(shade(L, [0, -0.2, 0.98], wood, L.at[0] * 0.5, 0.1), 0));
    g.fillStyle = gr; g.fillRect(-1.2, -0.7, 2.4, 1.0);
    for (let i = 0; i < 46; i++) {
      const y = -0.7 + i * 0.022 + hash(i, 81) * 0.01;
      g.strokeStyle = `rgba(18,10,6,${0.12 + 0.2 * hash(i, 82)})`; g.lineWidth = 0.0015 + hash(i, 83) * 0.003;
      g.beginPath(); g.moveTo(-1.2, y);
      for (let x = -1.2; x <= 1.2; x += 0.08) g.lineTo(x, y + 0.006 * Math.sin(x * 3 + i) + 0.012 * Math.sin(x * 0.7 + i * 0.3));
      g.stroke();
    }
    // the lid's edge, the coffin's side under the gap
    g.fillStyle = css(shade(L, [0, 0.6, 0.8], wood, 0, 0.32)); g.fillRect(-1.2, 0.3, 2.4, 0.05);
    g.fillStyle = css(shade(L, [0, 0.1, 1], rgb('#3a281c'), 0, 0.5, 0.6)); g.fillRect(-1.2, 0.35, 2.4, 0.4);
    // the holes' dark round each screw
    for (const x of SCREW_X) { const r = screwR(x); g.fillStyle = 'rgba(0,0,0,0.5)'; g.beginPath(); g.ellipse(x, SCREW_Y + r * 0.15, r * 1.15, r * 0.7, 0, 0, 7); g.fill(); }
  });
  c.layer('screws:gap', { pivot: c.stage([0, 0.35]) }, () => { c.g.fillStyle = '#050304'; c.g.fillRect(-1.2, 0.35, 2.4, GAP); });
  SCREW_X.forEach((x, i) => {
    const r = screwR(x), iron = rgb('#77726a'), y = SCREW_Y, h0 = r * 1.4, n = `screw${i + 1}`;
    // the shaft standing out of its hole as high as it can, its thread; its shadow (live() lowers it with it)
    c.layer(`${n}:shaft`, { pivot: c.stage([x, y]) }, () => {
      const { g } = c;
      g.fillStyle = 'rgba(0,0,0,0.55)'; g.beginPath(); g.ellipse(x - L.k[0] * h0 * 0.8, y - L.k[1] * h0 * 0.8 + r * 0.2, r * 0.9, r * 0.6, 0, 0, 7); g.fill();
      g.fillStyle = css(shade(L, [0.5, 0, 0.8], iron, x, y)); g.fillRect(x - r * 0.35, y - h0, r * 0.7, h0);
      g.strokeStyle = 'rgba(10,8,8,0.6)'; g.lineWidth = r * 0.08;
      for (let k = r * 0.25; k < h0; k += r * 0.25) { g.beginPath(); g.moveTo(x - r * 0.35, y - k + r * 0.08); g.lineTo(x + r * 0.35, y - k - r * 0.04); g.stroke(); }
    });
    // its head, home (live() lifts it as far as it stands out)
    c.layer(`${n}:head`, { pivot: c.stage([x, y]) }, () => {
      const { g } = c, gr = g.createRadialGradient(x + L.k[0] * r * 0.4, y + L.k[1] * r * 0.3, 0, x, y, r);
      gr.addColorStop(0, css(shade(L, norm([L.k[0], L.k[1], 0.8]), iron, x, y))); gr.addColorStop(1, css(shade(L, [0, 0, 1], iron, x, y, 0.5)));
      g.fillStyle = gr; g.beginPath(); g.ellipse(x, y, r, r * 0.62, 0, 0, 7); g.fill();
      c.e.at(x, y, n);
    });
    // its slot, across (live() turns it in the head's plane, foreshortened as the head is)
    c.layer(`${n}:slot`, { pivot: c.stage([x, y]) }, () => {
      const { g } = c;
      g.strokeStyle = '#0a0808'; g.lineWidth = r * 0.2; g.lineCap = 'butt';
      g.beginPath(); g.moveTo(x - r * 0.85, y); g.lineTo(x + r * 0.85, y); g.stroke();
    });
  });
  if (o.hand === false) return;
  // the driver in a slot (the first screw's, home), the hand round its handle; the fingers trying a screw instead
  const x = SCREW_X[0], y = SCREW_Y, r = 0.045, who = o.who || 'narrator';
  c.layer('driver', { pivot: c.stage([x, y]) }, () => {
    const { g } = c;
    g.fillStyle = css(shade(L, [0.4, 0, 0.9], rgb('#8a8c90'), x, y)); g.fillRect(x - r * 0.12, y - r * 5.5, r * 0.24, r * 5.5);
    g.fillStyle = css(shade(L, [0.4, 0, 0.9], rgb('#8a6440'), x, y - r * 7));
    g.beginPath(); g.roundRect(x - r * 0.5, y - r * 9.5, r * 1.0, r * 4.2, r * 0.35); g.fill();
    hand(c, { who, pose: 'grip', at: [x - r * 2.6, y - r * 9.8], size: r * 6.2, angle: PI / 2 + 0.4, side: 1 });
  });
  c.layer('test', { pivot: c.stage([x, y]) }, () => {
    const size = r * 7, an = 2.3;
    hand(c, { who, pose: 'touch', curl: 0.3, at: [x - Math.sin(an) * size * 0.95, y + Math.cos(an) * size * 0.95], size, angle: an, side: 1 });
  });
}
// the lid where live() has it: each screw's height, its slot's turn; where the hand is
function screwsLive(set, toStage, M, o, now = {}) {
  const v = now.v || [0, 0, 0, 0], at = now.at ?? -1, test = clamp(now.test ?? 0), z = M.z;
  const home = (v[0] + v[1] + v[2] + v[3]) / 4;
  set('screws', toStage(0, 0), M);
  set('screws:gap', toStage(0, 0.35), M, { sy: ((1 - home) * 0.018 + 0.003) / GAP });
  SCREW_X.forEach((x, i) => {
    const r = screwR(x), p = toStage(x, SCREW_Y), u = clamp(v[i]), up = -(1 - u) * r * 1.4 * z, a = u * PI * 2 * SCREW_TURNS + x * 7, n = `screw${i + 1}`;
    set(`${n}:shaft`, p, M, { sy: Math.max(0.01, 1 - u), alpha: u < 0.999 ? 1 : 0 });
    set(`${n}:head`, p, M, { oy: up });
    set(`${n}:slot`, p, M, { oy: up, r: Math.atan2(0.52 * Math.sin(a), 0.85 * Math.cos(a)), sx: Math.hypot(Math.cos(a), 0.612 * Math.sin(a)) });
  });
  if (o.hand === false) return;
  // where the hand is: on a screw, or on its way between two
  const i0 = clamp(Math.floor(at), 0, 3), fr = clamp(at - i0), hx = mix(SCREW_X[i0], SCREW_X[Math.min(3, i0 + 1)], sm(fr)), near = Math.round(clamp(at, 0, 3)), vn = clamp(v[near]), r = 0.045;
  const away = Math.sin(PI * fr), dy = -(1 - vn) * r * 1.4 - away * r * 2.5, p = toStage(SCREW_X[0], SCREW_Y), dx = hx - SCREW_X[0];
  const tw = Math.sin(vn * PI * 2 * SCREW_TURNS) * 0.06 * (1 - away), tt = Math.sin(test * PI * 4) * 0.08 * (1 - away);
  const on = at >= 0;
  set('driver', p, M, { ox: dx * z, oy: (dy + tw * r * 0.3) * z, r: tw * 0.4, alpha: on && test <= 0 ? 1 : 0 });
  set('test', p, M, { ox: dx * z, oy: dy * z, r: tt, alpha: on && test > 0 ? 1 : 0 });
}

// profile(o) — the narrator: a profile in shadow, the light only on its edge
function profile(c, o) {
  const { g, L, t } = c, at = o.at || [0.15, 0], S = o.size ?? 0.7, f = o.facing ?? -1, life = o.frozen ? 0 : 1;
  const br = Math.sin(t * 1.3) * 0.004 * life;
  const Q = pts => pts.map(([x, y]) => [at[0] + x * -f * S, at[1] + (y - br) * S]);
  // the head and the neck: brow, nose, lips, chin, throat; the nape, the back of the skull
  const face = Q([[-0.2, -0.47], [-0.3, -0.3], [-0.33, -0.1], [-0.3, -0.03], [-0.34, 0.02], [-0.44, 0.17], [-0.38, 0.21], [-0.37, 0.24], [-0.385, 0.28],
    [-0.36, 0.31], [-0.375, 0.335], [-0.345, 0.37], [-0.36, 0.43], [-0.3, 0.5], [-0.15, 0.52], [-0.12, 0.62], [-0.13, 0.9]]);
  const back = Q([[0.3, 0.9], [0.28, 0.55], [0.3, 0.42], [0.42, 0.2], [0.45, -0.1], [0.35, -0.4], [0.08, -0.56]]);
  const head = [...face, ...back];
  const skin = rgb('#cfb09a'), dark = mul3(L.f, 0.55), lc = mix3(L.kc, L.r, 0.3);
  // the greatcoat's high collar behind and under the neck
  const coat = Q([[-0.3, 0.86], [-0.05, 0.8], [0.25, 0.6], [0.45, 0.62], [0.6, 1.0], [0.75, 1.6], [-0.6, 1.6], [-0.45, 1.05]]);
  // in shadow, its edges lost in the dark
  const soft = S * Math.hypot(g.getTransform().a, g.getTransform().b) * 0.01;
  g.save(); g.filter = `blur(${soft.toFixed(5)}px)`;
  g.fillStyle = css(shade(L, [f * 0.4, -0.3, 0.85], rgb('#2a2c30'), coat[0][0], coat[0][1], 0.5)); g.beginPath(); smooth(g, coat, true); g.fill();
  g.fillStyle = css(mix3(dark, shade(L, [f * 0.5, 0, 0.85], skin, at[0], at[1], 0.4), 0.25)); g.beginPath(); smooth(g, head, true); g.fill();
  g.restore();
  // the ear, a little lighter in the dark
  const ear = Q([[0.08, -0.02], [0.17, -0.04], [0.2, 0.08], [0.15, 0.2], [0.09, 0.18]]);
  g.fillStyle = css(mix3(dark, shade(L, [f * 0.3, 0, 0.95], skin, ear[0][0], ear[0][1], 0.5), 0.35)); g.beginPath(); smooth(g, ear, true); g.fill();
  // dark-brown hair from the brow back over the skull to the nape, the ear left bare
  const hair = Q([[-0.22, -0.43], [-0.05, -0.58], [0.25, -0.53], [0.44, -0.3], [0.48, 0.0], [0.4, 0.28], [0.3, 0.44], [0.22, 0.3], [0.2, 0.0], [0.08, -0.08], [-0.08, -0.25], [-0.18, -0.36]]);
  const hc = shade(L, [f * 0.3, -0.5, 0.8], rgb('#3a2a20'), at[0], at[1] - 0.3 * S, 0.7);
  g.save(); g.filter = `blur(${(soft * 0.5).toFixed(5)}px)`; g.fillStyle = css(hc); g.beginPath(); smooth(g, hair, true); g.fill(); g.restore();
  g.save(); g.beginPath(); smooth(g, hair, true); g.clip(); g.lineCap = 'round';
  for (let i = 0; i < 40; i++) {
    const u = hash(i, 401), v = hash(i, 402), a = Q([[-0.2 + u * 0.3, -0.5 + v * 0.3]])[0], b = Q([[0.15 + u * 0.3, -0.3 + v * 0.6]])[0], m = Q([[0.05 + u * 0.35, -0.5 + v * 0.35]])[0];
    g.strokeStyle = css(v > 0.5 ? mix3(hc, lc, 0.25) : mul3(hc, 0.6), 0.5); g.lineWidth = S * 0.006;
    g.beginPath(); g.moveTo(a[0], a[1]); g.quadraticCurveTo(m[0], m[1], b[0], b[1]); g.stroke();
  }
  g.restore();
  // the light along the face's edge, spreading a little into the cheek
  g.save(); g.beginPath(); smooth(g, head, true); g.clip();
  g.lineCap = 'round'; g.lineJoin = 'round';
  // the light along the face's edge, brightest on the brow, the nose, the lips, the chin, gone by the throat
  const lit = mix3(lc, shade(L, [f * 0.9, 0, 0.4], skin, at[0], at[1]), 0.5), top = face[0][1], bot = face[15][1];
  const along = a => { const gr = g.createLinearGradient(0, top, 0, bot); gr.addColorStop(0, css(lit, a * 0.6)); gr.addColorStop(0.35, css(lit, a)); gr.addColorStop(0.75, css(lit, a * 0.8)); gr.addColorStop(1, css(lit, 0)); return gr; };
  for (const [w, a] of [[0.12, 0.06], [0.05, 0.14], [0.018, 0.35]]) { g.strokeStyle = along(a); g.lineWidth = S * w; g.beginPath(); smooth(g, face, false); g.stroke(); }
  g.restore();
  g.strokeStyle = along(0.7); g.lineWidth = S * 0.004;
  g.beginPath(); smooth(g, face.slice(0, 15), false); g.stroke();
  // the eye's glint
  const ey = Q([[-0.26, -0.01]])[0];
  dab(g, ey[0], ey[1], S * 0.009, S * 0.006, 0, mix3(L.kc, [1, 1, 1], 0.5), 0.8 * (1 - blinkAt(t, 23) * life), 0.5);
}

// ---- the shot ----
// paint(g, e, shot) — an insert's painting (its code): the shot painted once for its state, in stage heights — its
// card's units the old card's, a screen height, origin at the stage's middle (x −0.89…0.89 and on past the edges for
// wide screens, y −0.5…0.5), moved by the shot's zoom and pan. The dark (or the sky) on its base; the light's glow,
// each face, hand, mirror, the lid, the profile, the lightning and the edges sinking into the dark as layers — what
// live() moves. shot: { light, zoom, pan, flash (true: lightning may strike), faces: [o…], hands: [o…], mirror: o,
// screws: o, profile: o, under: (g, L) => … } (closeups.md); null — nothing.
const STAGE = 16 / 9;
function paint(g, e, shot) {
  if (!shot) return;
  const z = shot.zoom ?? 1, pan = shot.pan || [0, 0], cx = e.aspect / 2, cy = 0.5;
  const L = lightOf(shot.light || 'candle', 0);
  const toStage = (x, y) => [cx + (x - pan[0]) * z, cy + (y - pan[1]) * z];
  const c = {
    g, e, t: 0, L, z,
    stage: p => toStage(p[0], p[1]),
    box: (x0, y0, x1, y1) => { const a = toStage(x0, y0), b = toStage(x1, y1); return [a[0], a[1], b[0], b[1]]; },
    // a layer of the shot, painted in the card's units
    layer(name, opts, fn) {
      e.layer(name, opts, g2 => {
        const g0 = c.g;
        c.g = g2; g2.save(); g2.translate(cx - pan[0] * z, cy - pan[1] * z); g2.scale(z, z);
        fn();
        g2.restore(); c.g = g0;
      });
    },
  };
  c.face = p => face(c, p); c.hand = p => hand(c, p); c.mirror = p => mirror(c, p); c.screws = p => screws(c, p); c.profile = p => profile(c, p);
  // the dark, or what is behind (open sky)
  g.save(); g.translate(cx, cy);
  if (L.air) {
    const gr = g.createLinearGradient(0, -0.6, 0, 0.6);
    gr.addColorStop(0, L.air[0]); gr.addColorStop(1, L.air[1]);
    g.fillStyle = gr;
  } else g.fillStyle = css(mul3(L.f, 0.7));
  g.fillRect(-1.6, -0.9, 3.2, 1.8);
  g.restore();
  // the light's glow in it (breathing with a flame)
  c.layer('glow', {}, () => {
    const gr = c.g.createRadialGradient(L.at[0], L.at[1], 0, L.at[0], L.at[1], 1.3);
    gr.addColorStop(0, css(mix3(L.f, L.kc, 0.1), L.air ? 0.4 : 1)); gr.addColorStop(1, css(L.f, 0));
    c.g.fillStyle = gr; c.g.fillRect(-1.6 / z + pan[0], -0.9 / z + pan[1], 3.2 / z, 1.8 / z);
  });
  // the scene's own, under what the shot shows (a gown the hands lie on): painted once, in the card's units — under(g, L)
  if (shot.under) c.layer('under', {}, () => shot.under(c.g, L));
  for (const o of shot.faces || []) face(c, o);
  (shot.hands || []).forEach((o, i) => c.layer(o.name || `hand${i}`, { pivot: c.stage(o.at || [0, 0.2]) }, () => hand(c, { ...o, raise: 1 })));
  if (shot.mirror) {
    const o = shot.mirror, n = o.name || 'mirror', pivot = c.stage(o.at || [0, 0]);
    c.layer(n, { pivot }, () => mirror(c, { ...o, fog: 0 }));
    if (o.fog > 0.01) c.layer(`${n}:fog`, { pivot }, () => mirrorFog(c, o));
  }
  if (shot.screws) screws(c, shot.screws);
  if (shot.profile) c.layer(shot.profile.name || 'profile', { pivot: c.stage(shot.profile.at || [0.15, 0]) }, () => profile(c, shot.profile));
  // the lightning: a cold white flash from the window side, over all — the faces lit by it alone (added as much as
  // live() says)
  if (shot.flash) {
    const Lf = lightOf(shot.light || 'candle', 1);
    Lf.kc = [0, 0, 0]; Lf.f = [0, 0, 0]; Lf.r = [0, 0, 0];
    c.layer('flash', { blend: 'add' }, () => {
      c.g.fillStyle = 'rgba(150,170,195,0.22)'; c.g.fillRect(-1.6 / z + pan[0], -0.9 / z + pan[1], 3.2 / z, 1.8 / z);
      const lit = { ...c, L: Lf };
      for (const o of shot.faces || []) faceLit(lit, o);
    });
  }
  // the edges of the frame sink into the dark
  e.layer('edges', {}, g2 => {
    const gr = g2.createRadialGradient(cx, cy - 0.05, 0.35, cx, cy, 1.1);
    gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, `rgba(0,0,0,${L.air ? 0.3 : 0.7})`);
    g2.fillStyle = gr; g2.fillRect(cx - 1.6, -0.4, 3.2, 1.8);
  });
}
// a face lit by one light alone (the lightning's): its shoulders, its head, its hair — added over it
function faceLit(c, o) {
  const { L } = c, who = CAST[o.who] ? o.who : 'roderick', C = CAST[who], P = poseOf(o, C, L), { S, at, life, lying } = P;
  const f = fieldOf(who, C, [o.smile ?? 0, o.strain ?? 0, o.grief ?? 0, o.blush ?? 0]);
  const H = headFrame(at, S, P.yaw, P.pitch, P.roll, outlineOf(who), (x, y) => fieldAt(f.z, x, y), ...C.shape, Math.min(0, P.pitch0 + 0.1));
  H.pallor = C.pallor;
  L.pool = [at[0] + L.k[0] * S * 0.08, at[1] - S * 0.1, S * (lying ? 0.7 : 0.8)];
  const hair = rgb(C.hair), wind = o.wind ?? 0;
  if (who !== 'doctor') hairBack(c, H, C, hair, 0, life, wind, lying);
  body(c, o, H, C, P.br);
  head(c, H, f, C);
  if (who !== 'doctor') hairFront(c, H, C, hair, 0, life, wind, lying);
}
// the breath on the mirror's glass: a milky bloom from the lips' side, its edge soft (live() breathes it)
function mirrorFog(c, o) {
  const { g } = c, at = o.at || [0, 0], r = o.size ?? 0.12, a = o.angle ?? 0.4, fog = o.fog ?? 0, fr = r * (0.35 + 0.7 * sm(fog));
  g.save(); g.translate(at[0], at[1]); g.rotate(a);
  g.beginPath(); g.ellipse(0, 0, r, r * 1.02, 0, 0, 7); g.clip();
  dab(g, 0, r * 0.1, fr, fr * 0.9, 0, [0.78, 0.76, 0.74], 0.6 * fog, 0.3);
  g.restore();
}

// live(e, shot, now) — an insert's animate: the shot's life, every frame, nothing painted: the flame's breath in the
// light, each face's breath and its small drift, a sway, its blinks and glances, its expression going on to the next,
// its lips as it speaks, a deep breath, a flinch, a tear running, hands coming over the face or up into the frame, the
// mirror's fog, the screws turning, the lightning. shot — the same as paint's; now — what moves, by name: { zoom (a slow
// push, 1), flash (0…1), screws: { v, at, test }, <name>: { to: [0…1 …], speak, inhale, flinch, frozen, blink, tear,
// cover, reach, raise, angle, x, y } } (closeups.md).
function live(e, shot, now = {}) {
  // (nothing yet: the shot closed, or not painted yet — its first layer not there)
  if (!shot || !e.layer('glow').scaleX) return;
  // (an animate is not given the stage's width: the stage is 16:9, as an insert's painting has it — e.aspect there)
  const t = e.t, z = shot.zoom ?? 1, pan = shot.pan || [0, 0], cx = STAGE / 2, cy = 0.5;
  const spec = specOf(shot.light || 'candle'), L = { k: norm(spec.dir) };
  const fl = 1 + spec.flicker * (0.09 * drift(t * 2.1, 11) + 0.04 * noise(t * 8.5, 12));
  const toStage = (x, y) => [cx + (x - pan[0]) * z, cy + (y - pan[1]) * z];
  // the push: the whole shot scaled about the stage's middle
  const push = now.zoom ?? 1, G0 = { s: push, r: 0, tx: (1 - push) * cx, ty: (1 - push) * cy, z };
  // the motion of a group of layers: G0 ∘ (turned by r about p, then moved by d)
  const group = (p, r, dx, dy) => {
    const c = Math.cos(r), s = Math.sin(r), hx = p[0] + dx - (c * p[0] - s * p[1]), hy = p[1] + dy - (s * p[0] + c * p[1]);
    return { s: push, r, tx: push * hx + G0.tx, ty: push * hy + G0.ty, z };
  };
  // a layer (p — its pivot as painted) moved by its group M and, before that, by its own: scaled sx, sy and turned r
  // about its pivot, moved by (ox, oy)
  const set = (name, p, M, { sx = 1, sy = 1, r = 0, ox = 0, oy = 0, alpha = 1, bright = fl } = {}) => {
    const h = e.layer(name), c = Math.cos(M.r), s = Math.sin(M.r), qx = p[0] + ox, qy = p[1] + oy;
    h.rotate = M.r + r; h.scaleX = M.s * sx; h.scaleY = M.s * sy; h.alpha = alpha; h.brightness = bright;
    h.x = M.s * (c * qx - s * qy) + M.tx - p[0]; h.y = M.s * (s * qx + c * qy) + M.ty - p[1];
  };
  set('glow', [0, 0], G0);
  if (shot.under) set('under', [0, 0], G0);
  for (const o of shot.faces || []) faceLive(o, now[nameOf(o)] || {});
  function faceLive(o, N) {
    const who = CAST[o.who] ? o.who : 'roderick', C = CAST[who], seed = C.seed, n = nameOf(o), X = statesOf(o), u = N.to;
    const P = poseOf(o, C, L), S = P.S, frozen = clamp(N.frozen ?? P.frozen), life = 1 - frozen, inhale = N.inhale ?? 0, sway = (o.sway ?? 0) * life;
    const flinch = clamp(N.flinch ?? 0), away = L.k[0] > 0 ? -1 : 1, x = {};
    for (const k of EXPR) x[k] = blendOf(X, u, k);
    // the breath: the chest and the head rise and sink; one deep breath taken
    const br = (o.breath ?? 1) * life * (0.5 + 0.5 * Math.sin(t * 1.4 + seed)) + inhale * 1.6 - P.br;
    // the life in it — a small drift, a tremor under strain; a sway as before a fall — stopped when frozen; a flinch
    // turns it from the light and down
    const dx = S * (life * (0.01 * drift(t * 0.23, seed) + 0.01 * drift(t * 0.21, seed + 5)) + sway * 0.09 * Math.sin(t * 0.9 - 0.3) + flinch * away * 0.06);
    const dy = S * (life * 0.008 * drift(t * 0.19, seed + 1) - 0.008 * br - inhale * 0.012 + flinch * 0.03);
    const roll = life * 0.012 * drift(t * 0.15, seed + 2) + sway * 0.07 * Math.sin(t * 0.9) + x.strain * 0.006 * noise(t * 9, seed) * life - flinch * away * 0.1;
    const hc = toStage(P.at[0], P.at[1]), M = group(hc, roll, dx * z, dy * z), Mb = group(hc, 0, 0, -S * 0.012 * br * z);
    // a turn: the features on the front of the head move across it more than its outline, the hair behind less
    const turn = (Math.sin(0.4 * x.turn) - Math.sin(P.yaw)) * 0.4 * S * z, fx = { ox: turn };
    const shown = k => (k ? clamp(u?.[k - 1] ?? 0) : 1);
    set(`${n}:body`, hc, Mb);
    if (who !== 'doctor') set(`${n}:hairB`, hc, M, { ox: -0.2 * turn });
    for (let k = 0; k < X.length; k++) set(`${n}:skin${k}`, hc, M, { ox: 0.45 * turn, alpha: shown(k) });
    set(`${n}:whites`, hc, M, fx);
    set(`${n}:lids`, hc, M, fx);
    set(`${n}:hairF`, hc, M, { ox: 0.5 * turn });
    // the eyes: small looks about (less in fear), a blink now and then; narrower than painted — their lids let down
    const gl = glanceAt(t, seed), gk = life * (1 - x.fear * 0.6);
    set(`${n}:iris`, hc, M, { ox: turn + gl[0] * gk * 0.03 * S * z, oy: gl[1] * gk * 0.6 * 0.012 * S * z });
    const blink = typeof N.blink === 'number' ? N.blink : blinkAt(t, seed) * life, Hs = skullFrame(o, C, L);
    [-1, 1].forEach((s, i) => {
      const most = Math.max(...X.map(y => openOf(y, s))), open = Math.min(most, openOf(x, s));
      const shut = Math.max(blink, most > 0.04 ? 1 - open / most : 0, flinch * 0.63);
      set(`${n}:blink${i}`, toStage(...Hs.on(s * 0.145, -0.03)), M, { ox: turn, sy: Math.max(0.01, shut), alpha: shut > 0.02 ? 1 : 0 });
      // the brow: from the first expression's line to where the expression has it now (and down in a flinch)
      const lines = X.map(y => browLine(Hs, s, ...browOf(y, s))), A = lines[0][0], D = lines[0][1], a = [A[0], A[1]], d = [D[0], D[1]];
      for (let k = 1; k < X.length; k++) {
        const w = shown(k);
        for (const j of [0, 1]) { a[j] += w * (lines[k][0][j] - lines[k - 1][0][j]); d[j] += w * (lines[k][1][j] - lines[k - 1][1][j]); }
      }
      const r = Math.atan2(d[1] - a[1], d[0] - a[0]) - Math.atan2(D[1] - A[1], D[0] - A[0]), sc = Math.hypot(d[0] - a[0], d[1] - a[1]) / (Math.hypot(D[0] - A[0], D[1] - A[1]) || 1);
      set(`${n}:brow${i}`, toStage(A[0], A[1]), M, { ox: turn + (a[0] - A[0]) * z, oy: (a[1] - A[1] + flinch * 0.02 * S) * z, r, sx: sc, sy: sc });
    });
    // the mouth: each expression's over the one before as far as it has gone; open as it speaks (syllables), parting
    // for a breath
    for (let k = 0; k < X.length; k++) set(`${n}:lips${k}`, hc, M, { ox: turn, alpha: shown(k) });
    const syl = (N.speak ?? 0) * life * clamp(0.45 + 0.8 * noise(t * 7.2, seed) + 0.35 * noise(t * 12.5, seed + 4));
    set(`${n}:mouth`, hc, M, { ox: turn, alpha: clamp(Math.max(syl, inhale * 0.67)) });
    if (o.tear != null) {
      const T = tearPath(o, C, L, o.tearEye ?? (L.k[0] >= 0 ? 1 : -1)), { well, u: v } = tearAt(N.tear ?? 0), a0 = toStage(...T.at(0)), av = toStage(...T.at(Math.max(0, v)));
      set(`${n}:trail`, a0, M, { ox: turn, sy: Math.max(0.01, v / TEAR_END), alpha: v > 0.002 ? 1 : 0 });
      const k = (0.009 + 0.009 * well) / 0.018;
      set(`${n}:drop`, a0, M, { ox: turn + av[0] - a0[0], oy: av[1] - a0[1], sx: k, sy: k, alpha: well >= 0.03 ? 1 : 0 });
    }
    if (o.hands === 'face') {
      set(`${n}:cover`, hc, M, { oy: (1 - (N.cover ?? 1)) * 0.55 * S * z });
      if (o.tear != null) set(`${n}:ftears`, hc, M, { alpha: clamp((N.tear ?? 0) * 1.5) });
    }
    if (o.hands === 'reach') set(`${n}:reach`, hc, M, { oy: S * 0.6 * (1 - (N.reach ?? 1)) * z });
  }
  (shot.hands || []).forEach((o, i) => {
    const n = o.name || `hand${i}`, N = now[n] || {}, at = o.at || [0, 0.2], p = toStage(at[0], at[1]);
    const life = (N.frozen ?? o.frozen) ? 0 : 1, tremble = (o.tremble ?? 0) * life, size = o.size ?? 0.4;
    const ang = (N.angle ?? 0) + tremble * 0.03 * noise(t * 9, 5) + life * 0.02 * drift(t * 0.3, 21);
    const raise = N.raise ?? 1, ddy = (1 - sm(raise)) * (0.6 + size) + tremble * 0.003 * noise(t * 13, 4) + (N.y ?? 0), ddx = tremble * 0.003 * noise(t * 11, 3) + (N.x ?? 0);
    set(n, p, group(p, ang, ddx * z, ddy * z));
  });
  if (shot.mirror) {
    const o = shot.mirror, n = o.name || 'mirror', N = now[n] || {}, at = o.at || [0, 0], p = toStage(at[0], at[1]), M = group(p, 0, (N.x ?? 0) * z, (N.y ?? 0) * z);
    set(n, p, M);
    if (o.fog > 0.01) { const k = 1 + 0.04 * Math.sin(t * 3); set(`${n}:fog`, p, M, { sx: k, sy: k }); }
  }
  if (shot.screws) screwsLive(set, toStage, G0, shot.screws, now.screws);
  if (shot.profile) {
    const o = shot.profile, at = o.at || [0.15, 0], p = toStage(at[0], at[1]), life = o.frozen ? 0 : 1;
    set(o.name || 'profile', p, group(p, 0, 0, -Math.sin(t * 1.3) * 0.004 * life * (o.size ?? 0.7) * z));
  }
  if (shot.flash) set('flash', [0, 0], G0, { alpha: clamp(now.flash ?? 0), bright: 1 });
}

return { paint, live, LIGHTS };
