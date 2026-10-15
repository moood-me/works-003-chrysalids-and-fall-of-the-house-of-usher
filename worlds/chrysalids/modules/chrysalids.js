// «Хризалиды» on engine 3: the world's horses (its people are the engine's — the cast, modules/cast.js). chrysalids.md
// says how to use it.
// A horse is an element of the scene, painted once: its body, neck, head and tail as seen from each of HEADINGS ways
// round (a layer each, one way shown at a time), each leg's three bones (a layer each, hanging straight) — every layer
// at its own depth, so what of it is nearer the eye is before what is farther (and a rider in its saddle between its
// near and far side). Its animate moves it each frame and paints nothing: the way it is turned picks the layers, the
// legs step with the way it goes — a walk, a trot, a canter, a gallop by how fast, one going over into the next, the
// hooves planted —, the body bobs, pitches and breathes, the head nods with the steps, idles, is tossed, the tail
// swishes. Its seat is its point, for a rider of the cast to sit on; its stirrups and its reins are points in its
// frame (tack), for the rider's feet and hands.
const { clamp, noise, hash } = anim;
const TAU = Math.PI * 2;
const DEG = Math.PI / 180;

// ── the horses ──
// Hw: the height at the withers; its colours
// (painted in daylight colours: the scene's light lays the hour on them, its rims and its shadows); girth — how much
// thicker its body and neck are than a riding horse's; load — what it carries: panniers either side (the great-horses'),
// packs over its back (the pack horse's)
const HORSES = {
  horse: { Hw: 1.55, girth: 1, col: { coat: '#4a3a2e', mane: '#241c17', hoof: '#1c1816' } },
  great: { Hw: 2.05, girth: 1.16, load: 'panniers', col: { coat: '#6a5038', mane: '#2e231b', hoof: '#221c18', load: '#8a7452', strap: '#3a2c20' } },
  pack: { Hw: 1.42, girth: 1.06, load: 'packs', col: { coat: '#6e5e4c', mane: '#3a3028', hoof: '#221c18', load: '#7c7058', strap: '#3a2c20' } },
  sheba: { Hw: 1.52, girth: 0.96, col: { coat: '#8c877e', mane: '#4a4640', hoof: '#2a2624' } },
};
// The gaits: each leg's place in the stride (LF, RF, LH, RH), the share of it a hoof is down, the stride (× Hw), how
// high a hoof lifts (× Hw), its own pace (m/s, a horse of 1.55 m: × √(Hw / 1.55)) and the pace up to which it is gone
const GAITS = [
  { name: 'walk', off: [0.25, 0.75, 0.0, 0.5], duty: 0.64, stride: 1.05, lift: 0.1, pace: 1.63, upTo: 2.1 },
  { name: 'trot', off: [0.0, 0.5, 0.5, 0.0], duty: 0.44, stride: 1.55, lift: 0.18, pace: 3.3, upTo: 4.6 },
  { name: 'canter', off: [0.55, 0.3, 0.0, 0.3], duty: 0.38, stride: 2.0, lift: 0.2, pace: 6.2, upTo: 8 },
  { name: 'gallop', off: [0.45, 0.55, 0.0, 0.1], duty: 0.3, stride: 3.2, lift: 0.22, pace: 11, upTo: Infinity },
];
// where each leg leaves the body, its two long bones (front: forearm, cannon; hind: gaskin, cannon), its pastern
const LEGS = [[0.1, 0.6, 0.44], [-0.1, 0.6, 0.44], [0.11, 0.62, -0.47], [-0.11, 0.62, -0.47]];
const BONES = { front: [0.275, 0.265], hind: [0.3, 0.285] };
const PASTERN = Math.hypot(0.06, 0.01);
// how far before its card a near leg stands, behind it a far one (× Hw)
const LEG_DEPTH = 0.2;
// the body as three masses (forehand, barrel, quarters), each a hull of balls [x, y, z, r] (× Hw): their union keeps
// the dip of the back and the tuck of the belly
const MASSES = [
  [[0, 0.79, 0.53, 0.16], [0, 0.63, 0.42, 0.14], [0, 0.91, 0.3, 0.115], [0.07, 0.62, 0.42, 0.12], [-0.07, 0.62, 0.42, 0.12], [0, 0.78, 0.25, 0.17]],
  [[0, 0.84, 0.05, 0.13], [0, 0.73, 0.1, 0.19], [0, 0.68, -0.08, 0.17], [0, 0.78, -0.25, 0.14], [0, 0.71, 0.25, 0.17]],
  [[0, 0.875, -0.42, 0.13], [0, 0.79, -0.53, 0.18], [0, 0.72, -0.63, 0.13], [0.06, 0.6, -0.48, 0.12], [-0.06, 0.6, -0.48, 0.12], [0, 0.74, -0.33, 0.15]],
];
// the hip (what the body pitches about), the neck's root, its length, its angle up from level at rest; the head hangs
// from the poll this much below the neck's line; the tail's root; the saddle's top; the stirrups (each side) and the
// reins in the hands (× Hw)
const HIP = [0, 0.66, -0.5];
const NECK = { base: [0, 0.84, 0.46], length: 0.6, up: 0.85, head: 1.85, headLength: 0.5 };
const TAIL = [0, 0.93, -0.66];
const SADDLE = [0, 0.98, 0.08];
const STIRRUP = [0.24, 0.57, 0.06];
const REINS = [0, 1.06, 0.36];
// the panniers (each side of the barrel: [x, y, z] of its middle, half its width along, its depth across, its height),
// the mouth a child sits in; the packs over the back
const PANNIER = { at: [0.3, 0.64, 0.02], len: 0.24, wide: 0.12, high: 0.2 };
const PACKS = [[0, 1.0, -0.12, 0.13], [0.16, 0.9, -0.1, 0.11], [-0.16, 0.9, -0.1, 0.11], [0, 0.98, 0.18, 0.1]];
// how much the picture looks down on it (the world's own way of drawing horses: their backs seen a little)
const VIEW = 0.2;
// the ways round it is painted from: every STEP degrees (0 toward the eye, 90 to its right, 180 away)
const HEADINGS = 24, STEP = 360 / HEADINGS;
// its layers' names (made once: nothing is made as it moves)
const NAMES = {
  body: Array.from({ length: HEADINGS }, (_, k) => `body${k}`), neck: Array.from({ length: HEADINGS }, (_, k) => `neck${k}`),
  head: Array.from({ length: HEADINGS }, (_, k) => `head${k}`), tail: Array.from({ length: HEADINGS }, (_, k) => `tail${k}`),
  // the near pannier, before the barrel (a child in it is behind its wall)
  pannier: Array.from({ length: HEADINGS }, (_, k) => `pannier${k}`),
  // leg i's bone b: standing before its card (near), behind it (far)
  near: LEGS.map((_, i) => [0, 1, 2].map(b => `leg${i}_${b}n`)), far: LEGS.map((_, i) => [0, 1, 2].map(b => `leg${i}_${b}f`)),
};

// ── vectors (the horse's own frame: x to its right, y up, z ahead; metres) ──
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const lerp3 = (a, b, u) => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];
const sm = u => u * u * (3 - 2 * u);

// A horse seen turned `face` degrees: a point of its frame → [x, y, z] — x, y the element's painting (metres, y down),
// z how far behind its anchor's plane (toward the eye: below 0)
function seen(face) {
  const c = Math.cos(face * DEG), s = Math.sin(face * DEG);
  return p => {
    const z = -p[0] * s - p[2] * c;
    return [-p[0] * c + p[2] * s, -p[1] - z * VIEW * (1 - p[1] / 1.7), z];
  };
}
// how wide its body is seen turned so (its length seen from the side, its breadth end on; of its length)
const breadth = face => Math.hypot(Math.sin(face * DEG), 0.27 * Math.cos(face * DEG));

// a hull round balls [x, y, r] (painting units) into path: the outline of their union and the gaps between them
function hull(balls, path) {
  const pts = [];
  for (const [x, y, r] of balls) for (let k = 0; k < 24; k++) { const a = (k / 24) * TAU; pts.push([x + r * Math.cos(a), y + r * Math.sin(a)]); }
  pts.sort((p, q) => p[0] - q[0] || p[1] - q[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower = [], upper = [];
  for (const p of pts) { while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop(); lower.push(p); }
  for (let i = pts.length - 1; i >= 0; i--) { const p = pts[i]; while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop(); upper.push(p); }
  const h = lower.slice(0, -1).concat(upper.slice(0, -1));
  path.moveTo(h[0][0], h[0][1]);
  for (let i = 1; i < h.length; i++) path.lineTo(h[i][0], h[i][1]);
  path.closePath();
  return path;
}
// a tapering stroke from (x0, y0) r0 wide to (x1, y1) r1 wide, round at both ends
function taper(g, x0, y0, r0, x1, y1, r1) {
  const a = Math.atan2(y1 - y0, x1 - x0), n = a + Math.PI / 2;
  g.moveTo(x0 + Math.cos(n) * r0, y0 + Math.sin(n) * r0);
  g.lineTo(x1 + Math.cos(n) * r1, y1 + Math.sin(n) * r1);
  g.arc(x1, y1, r1, n, n + Math.PI, true);
  g.lineTo(x0 - Math.cos(n) * r0, y0 - Math.sin(n) * r0);
  g.arc(x0, y0, r0, n + Math.PI, n, true);
  g.closePath();
}

// the neck's line at angle a (up from level): from its root to the poll, arched along its crest
const arch = (Hw, a, u) => {
  const b = mul(NECK.base, Hw), poll = add(b, [0, Math.sin(a) * NECK.length * Hw, Math.cos(a) * NECK.length * Hw]);
  return add(lerp3(b, poll, u), [0, Math.sin(Math.PI * u) * 0.06 * Hw * Math.cos(a), -Math.sin(Math.PI * u) * 0.04 * Hw]);
};
// the head from the poll at angle h (its line, down from level): a point `a` along it, `b` up from it (× Hw)
const headPoint = (Hw, poll, h, a, b) => add(poll, add(mul([0, Math.sin(h), Math.cos(h)], a * Hw), mul([0, Math.cos(h), -Math.sin(h)], b * Hw)));

// which side of it (+1 its right, −1 its left) is toward the eye when it is seen turned k × STEP degrees
const nearSide = k => (Math.sin(k * STEP * DEG) >= 0 ? 1 : -1);
// a wicker pannier on side sd (+1 right, −1 left): a box of [x, y, z] corners seen so, its withies, the strap over
// the back to it
function pannier(q, pr, Hw, col, sd) {
  const { at, len, wide, high } = PANNIER, x0 = at[0] * sd, pts = [];
  for (const dx of [-wide, wide]) for (const dy of [-high, high]) for (const dz of [-len, len]) pts.push(pr(mul([x0 + dx, at[1] + dy, at[2] + dz], Hw)));
  const path = new Path2D();
  hull(pts.map(p => [p[0], p[1], 0.01 * Hw]), path);
  q.fillStyle = col.load;
  q.fill(path);
  q.strokeStyle = col.strap;
  q.lineWidth = 0.02 * Hw;
  for (const u of [-0.5, 0, 0.5]) {
    const a = pr(mul([x0 + wide * sd, at[1] - high, at[2] + len * u], Hw)), b = pr(mul([x0 + wide * sd, at[1] + high, at[2] + len * u], Hw));
    q.beginPath(); q.moveTo(a[0], a[1]); q.lineTo(b[0], b[1]); q.stroke();
  }
  const s0 = pr(mul([x0, at[1] + high, at[2]], Hw)), s1 = pr(mul([0, 1.02, 0.02], Hw));
  q.beginPath(); q.moveTo(s0[0], s0[1]); q.lineTo(s1[0], s1[1]); q.stroke();
}

// ── painted once ──
// paint(g, e, o): o — { kind, col }. Layers: leg<i>_<bone>f (the far legs, behind its card), tail<k>, body<k>, neck<k>,
// head<k> (k: the way it is seen from, k × STEP degrees), leg<i>_<bone>n (the near legs, before its card).
function paint(g, e, o = {}) {
  const B = HORSES[o.kind] ?? HORSES.horse, Hw = B.Hw, G = B.girth, col = { ...B.col, ...(o.col ?? {}) };
  // the legs: each bone hanging straight down from its joint, painted Hw over the anchor in a box as wide as a leg
  // reaches (its animate puts, turns and stretches it where the bone is, and dims a far one)
  const legs = (names, depth) => LEGS.forEach((_, i) => {
    const [l1, l2] = i < 2 ? BONES.front : BONES.hind;
    [[l1 * Hw, 0.1, 0.045], [l2 * Hw, 0.045, 0.033], [PASTERN * Hw, 0.036, 0.03]].forEach(([L, r0, r1], b) => {
      e.layer(names[i][b], { pivot: [0, -Hw], depth, box: [-0.75 * Hw, -1.75 * Hw, 0.75 * Hw, -0.25 * Hw] }, q => {
        q.fillStyle = col.coat;
        q.beginPath();
        taper(q, 0, -Hw, r0 * Hw, 0, L - Hw, r1 * Hw);
        q.fill();
        if (b === 2) {
          q.fillStyle = col.hoof;
          q.beginPath();
          q.ellipse(0, L - Hw + 0.012 * Hw, 0.04 * Hw, 0.032 * Hw, 0, 0, TAU);
          q.fill();
        }
      });
    });
  });
  legs(NAMES.far, -LEG_DEPTH * Hw);
  const each = fn => { for (let k = 0; k < HEADINGS; k++) fn(k, seen(k * STEP)); };
  // the tail: hanging from its root, a little back (its animate swishes it)
  each((k, pr) => {
    const troot = mul(TAIL, Hw), tr = pr(troot);
    e.layer(NAMES.tail[k], { pivot: [tr[0], tr[1]], depth: -tr[2], box: [tr[0] - 0.5 * Hw, tr[1] - 0.1 * Hw, tr[0] + 0.5 * Hw, tr[1] + 0.65 * Hw] }, q => {
      q.fillStyle = col.mane;
      q.beginPath();
      let prev = [tr[0], tr[1], 0.04 * Hw];
      for (let j = 1; j <= 5; j++) {
        const u = j / 5, p = pr(add(troot, [0, -0.5 * Hw * u, -0.06 * Hw * u])), cur = [p[0], p[1], (0.04 + 0.035 * u) * Hw];
        taper(q, prev[0], prev[1], prev[2], cur[0], cur[1], cur[2]);
        prev = cur;
      }
      q.fill();
    });
  });
  // the body: its three masses (its pivot the hip: what it pitches about)
  each((k, pr) => {
    const hip = pr(mul(HIP, Hw));
    e.layer(NAMES.body[k], { pivot: [hip[0], hip[1]], box: [-1.2 * Hw, -1.2 * Hw, 1.2 * Hw, -0.3 * Hw] }, q => {
      const body = new Path2D();
      // the far pannier first (the barrel hides most of it), the packs on top
      if (B.load === 'panniers') pannier(q, pr, Hw, col, -nearSide(k));
      for (const ms of MASSES) hull(ms.map(([x, y, z, r]) => { const p = pr(mul([x, y, z], Hw)); return [p[0], p[1], r * Hw * G]; }), body);
      q.fillStyle = col.coat;
      q.fill(body);
      if (B.load === 'packs') {
        q.fillStyle = col.load;
        for (const [x, y, z, r] of PACKS) { const p = pr(mul([x * G, y, z], Hw)); q.beginPath(); q.ellipse(p[0], p[1], r * Hw * 1.15, r * Hw * 0.85, 0, 0, TAU); q.fill(); }
        q.strokeStyle = col.strap; q.lineWidth = 0.025 * Hw;
        const a = pr(mul([0, 1.04, -0.12], Hw)), b = pr(mul([0, 0.62, -0.12], Hw));
        q.beginPath(); q.moveTo(a[0], a[1]); q.lineTo(b[0], b[1]); q.stroke();
      }
    });
    // the near pannier: a layer of its own before the barrel, its depth its front wall's
    if (B.load === 'panniers') {
      const sd = nearSide(k), c = pr(mul([PANNIER.at[0] * sd * G, PANNIER.at[1], PANNIER.at[2]], Hw)), hip = pr(mul(HIP, Hw));
      e.layer(NAMES.pannier[k], { pivot: [hip[0], hip[1]], depth: -c[2] + PANNIER.wide * Hw, box: [-1.2 * Hw, -1.2 * Hw, 1.2 * Hw, -0.3 * Hw] }, q => pannier(q, pr, Hw, col, sd));
    }
  });
  // the neck with its mane, the head with its ears — at rest (their animate turns them as they nod and toss)
  const a = NECK.up, poll = arch(Hw, a, 1), h = a - NECK.head;
  each((k, pr) => {
    const nb = pr(mul(NECK.base, Hw)), pp = pr(poll), mid = pr(arch(Hw, a, 0.5));
    e.layer(NAMES.neck[k], { pivot: [nb[0], nb[1]], depth: -mid[2], box: [nb[0] - 0.9 * Hw, pp[1] - 0.3 * Hw, nb[0] + 0.9 * Hw, nb[1] + 0.35 * Hw] }, q => {
      const neck = new Path2D(), balls = [];
      for (let j = 0; j <= 6; j++) { const u = j / 6, p = pr(arch(Hw, a, u)); balls.push([p[0], p[1], (0.2 + (0.07 - 0.2) * Math.pow(u, 0.8)) * Hw]); }
      const low = pr(add(mul(NECK.base, Hw), [0, -0.1 * Hw, 0.06 * Hw]));
      balls.push([low[0], low[1], 0.17 * Hw]);
      hull(balls.map(([x, y, r]) => [x, y, r * G]), neck);
      q.fillStyle = col.coat;
      q.fill(neck);
      // the mane along the crest
      q.fillStyle = col.mane;
      q.beginPath();
      let prev = null;
      for (let j = 0; j <= 7; j++) {
        const u = 0.04 + (0.92 * j) / 7, r = (0.2 + (0.07 - 0.2) * Math.pow(u, 0.8)) * Hw;
        const top = pr(add(arch(Hw, a, u), mul([0, Math.cos(a), -Math.sin(a)], r * 0.9))), cur = [top[0], top[1], 0.03 * Hw];
        if (prev) taper(q, ...prev, ...cur);
        prev = cur;
      }
      q.fill();
    });
  });
  each((k, pr) => {
    const pp = pr(poll), mid = pr(headPoint(Hw, poll, h, 0.2, 0));
    e.layer(NAMES.head[k], { pivot: [pp[0], pp[1]], depth: -mid[2], box: [pp[0] - 0.65 * Hw, pp[1] - 0.25 * Hw, pp[0] + 0.65 * Hw, pp[1] + 0.65 * Hw] }, q => {
      const at = (u, v, r) => { const p = pr(headPoint(Hw, poll, h, u, v)); return [p[0], p[1], r * Hw]; };
      const head = hull([at(0, 0, 0.07), at(0.13, -0.03, 0.105), at(0.36, 0.02, 0.065), at(0.47, -0.005, 0.06), at(0.08, 0.05, 0.06)], new Path2D());
      q.fillStyle = col.coat;
      q.fill(head);
      q.beginPath();
      for (const sd of [1, -1]) {
        const b0 = pr(add(poll, [sd * 0.03 * Hw, 0.03 * Hw, -0.01 * Hw])), tip = pr(add(poll, [sd * 0.04 * Hw, 0.12 * Hw, -0.02 * Hw]));
        taper(q, b0[0], b0[1], 0.025 * Hw, tip[0], tip[1], 0.007 * Hw);
      }
      q.fill();
    });
  });
  legs(NAMES.near, LEG_DEPTH * Hw);
}

// ── moved each frame (nothing made: what it works with is kept here, one horse at a time) ──
// the way it is seen now and as its layers are painted (the cosine and sine of each), a point seen so into `out`
const now = { c: 1, s: 0 }, was = { c: 1, s: 0 };
const turned = (V, face) => { V.c = Math.cos(face * DEG); V.s = Math.sin(face * DEG); };
function see(V, x, y, z, out) {
  const d = -x * V.s - z * V.c;
  out[0] = -x * V.c + z * V.s; out[1] = -y - d * VIEW * (1 - y / 1.7); out[2] = d;
}
// the body as it bobs and pitches about its hip: a point of the horse at rest (× Hw) → where it is, into `out`
const pose = { bob: 0, pc: 1, ps: 0, hy: 0, hz: 0 };
function carried(Hw, p, out) {
  const y = p[1] * Hw - pose.hy, z = p[2] * Hw - pose.hz;
  out[0] = p[0] * Hw; out[1] = pose.hy + y * pose.pc + z * pose.ps + pose.bob; out[2] = pose.hz - y * pose.ps + z * pose.pc;
}
const A3 = [0, 0, 0], B3 = [0, 0, 0], K3 = [0, 0, 0], F3 = [0, 0, 0];
const P0 = [0, 0, 0], P1 = [0, 0, 0], P2 = [0, 0, 0], P3 = [0, 0, 0], Q0 = [0, 0, 0], Q1 = [0, 0, 0];
const JOINTS = [P0, P1, P2, P3];
// a two-bone limb from A3 toward (bx, by, bz) (bones l1, l2), bending ahead (pole 1) or back (−1): the knee into K3,
// where its end is into F3
function limb(bx, by, bz, l1, l2, pole) {
  const dx = bx - A3[0], dy = by - A3[1], dz = bz - A3[2], dl = Math.max(1e-4, Math.sqrt(dx * dx + dy * dy + dz * dz));
  const nx = dx / dl, ny = dy / dl, nz = dz / dl, L = clamp(dl, 1e-4, l1 + l2 - 1e-4);
  const x = (l1 * l1 - l2 * l2 + L * L) / (2 * L), h = Math.sqrt(Math.max(0, l1 * l1 - x * x));
  let px = -nx * pole * nz, py = -ny * pole * nz, pz = pole - nz * pole * nz;
  const pl = Math.sqrt(px * px + py * py + pz * pz);
  if (pl > 1e-4) { px /= pl; py /= pl; pz /= pl; } else { px = 0; py = 0; pz = 1; }
  K3[0] = A3[0] + nx * x + px * h; K3[1] = A3[1] + ny * x + py * h; K3[2] = A3[2] + nz * x + pz * h;
  F3[0] = A3[0] + nx * L; F3[1] = A3[1] + ny * L; F3[2] = A3[2] + nz * L;
}
// a hoof in gait G at `ph` of the stride (`stride` metres): how far ahead of its leg it is, how high, how far through
// its swing (0 while it is down)
const step = { z: 0, y: 0, swing: 0 };
function hoofOf(G, i, ph, stride, Hw) {
  const u = (ph + G.off[i] + 1) % 1, S = G.duty * stride;
  if (u < G.duty) { step.z = S * (0.5 - u / G.duty); step.y = 0; step.swing = 0; return; }
  const k = (u - G.duty) / (1 - G.duty);
  step.z = -S / 2 + S * sm(k); step.y = G.lift * Hw * Math.sin(Math.PI * k) * (i < 2 ? 1.1 : 0.8); step.swing = k;
}
// the gait's own way of going at `cyc` of the stride (radians): the body's bob (× Hw), its pitch, the neck's nod
const bobOf = (g, cyc) => (g === 0 ? 0.008 * Math.cos(2 * cyc) : g === 1 ? 0.03 * Math.abs(Math.cos(cyc)) : 0.03 * Math.sin(cyc));
const pitchOf = (g, cyc) => (g >= 2 ? 0.08 * Math.sin(cyc + 0.6) : 0.01 * Math.sin(2 * cyc));
const nodOf = (g, cyc) => (g === 0 ? 0.08 * Math.sin(2 * cyc + 0.8) : g === 1 ? 0.03 * Math.sin(2 * cyc) : 0.14 * Math.sin(cyc + 1.4));
// the angle of the line a → b on the painting, as a layer painted hanging straight down turns to lie along it
const angle = (a, b) => Math.atan2(-(b[0] - a[0]), b[1] - a[1]);
// the gait a horse of Hw goes at pace v (m/s): its index
function gaitAt(v, Hw) {
  const k = Math.sqrt(Hw / 1.55);
  for (let i = 0; i < GAITS.length; i++) if (v < GAITS[i].upTo * k) return i;
  return GAITS.length - 1;
}

// animate(e, o): o — { kind, across, distance, face, toss, here }: the names of the state keys of its place (how fast
// it goes), its heading (degrees: 0 toward the eye, 90 to its right, 180 away — a turn on the spot is stepped round),
// its head tossed (0…1) and whether it is there (false: not seen); any of the last two may be left out. What it keeps
// in e.mem: its pace (eased), where it is in its stride, its gait, the one it goes over from and how far over it is.
// Marks its seat (the saddle as the stride moves it: what carries people is moved before them, so its rider goes with
// it) and its head (where it is looked at, framed).
function animateHorse(e, o) {
  const B = HORSES[o.kind] ?? HORSES.horse, Hw = B.Hw, m = e.mem, st = e.state, dt = Math.min(0.1, e.dt), t = e.t, seed = hash([...e.id].reduce((h, c) => h * 31 + c.charCodeAt(0), 7) % 9973, 7) * 97;
  const face = Number(st[o.face] ?? 90) || 0, toss = clamp(Number(st[o.toss] ?? 0) || 0, 0, 1), vis = st[o.here] === false ? 0 : 1;
  // its pace: the way it goes, and a turn on the spot (stepping round)
  const va = e.speed(o.across), vd = e.speed(o.distance), v = Math.sqrt(va * va + vd * vd) + Math.abs(e.speed(o.face)) * DEG * 0.5 * Hw;
  const fresh = m.v == null || e.cut < dt;
  if (fresh) m.v = v;
  m.v += (v - m.v) * Math.min(1, dt * 4);
  // its gait by its pace; a change of gait goes over in a moment (from the one it last went fully)
  const gi = gaitAt(m.v, Hw);
  if (fresh || m.g == null) { m.g = gi; m.from = gi; m.over = 1; }
  if (m.over > 0.98) m.from = m.g;
  if (gi !== m.g) { m.g = gi; m.over = 0; } else m.over += (1 - m.over) * Math.min(1, dt * 6);
  const G = GAITS[m.g], G0 = GAITS[m.from], w = m.over;
  const stride = (G0.stride + (G.stride - G0.stride) * w) * Hw;
  m.ph = ((m.ph ?? hash(seed, 3)) + (m.v * dt) / stride) % 1;
  const ph = m.ph, cyc = TAU * ph, move = sm(clamp((m.v - 0.04) / 0.41, 0, 1));
  // the body: the gait's bob and pitch (about the hip), a breath
  const pitch = move * (pitchOf(m.from, cyc) + (pitchOf(m.g, cyc) - pitchOf(m.from, cyc)) * w);
  pose.bob = move * Hw * (bobOf(m.from, cyc) + (bobOf(m.g, cyc) - bobOf(m.from, cyc)) * w) + Math.sin(t * 1.3 + seed) * 0.004 * Hw;
  pose.pc = Math.cos(pitch); pose.ps = Math.sin(pitch); pose.hy = HIP[1] * Hw; pose.hz = HIP[2] * Hw;
  // the way it is seen now; the nearest of the ways it is painted from
  const k = ((Math.round(face / STEP) % HEADINGS) + HEADINGS) % HEADINGS;
  turned(now, face);
  turned(was, k * STEP);
  // the legs: each hoof down for its share of the stride (planted: going back as the body goes on), then swung ahead,
  // folding as it lifts — the gait's and the one it goes over from, mixed; each bone's layer put at its joint, turned
  // and stretched along it as seen; the near legs before the card, the far ones behind it, dimmer
  for (let i = 0; i < 4; i++) {
    const front = i < 2, r = LEGS[i], l1 = (front ? BONES.front : BONES.hind)[0] * Hw, l2 = (front ? BONES.front : BONES.hind)[1] * Hw;
    hoofOf(G0, i, ph, stride, Hw);
    const z0 = step.z, y0 = step.y, s0 = step.swing;
    hoofOf(G, i, ph, stride, Hw);
    const z = (z0 + (step.z - z0) * w) * move, y = (y0 + (step.y - y0) * w) * move;
    const fold = step.swing > 0 ? Math.sin(Math.PI * (s0 + (step.swing - s0) * w)) * move * (front ? 1 : 0.6) : 0;
    carried(Hw, r, A3);
    limb(r[0] * Hw * 0.9, y + 0.08 * Hw, r[2] * Hw + z, l1, l2, front ? 1 : -1);
    see(now, A3[0], A3[1], A3[2], P0);
    see(now, K3[0], K3[1], K3[2], P1);
    see(now, F3[0], F3[1], F3[2], P2);
    see(now, F3[0], F3[1] - 0.06 * Hw * (1 - fold), F3[2] - 0.05 * Hw * fold - 0.01 * Hw, P3);
    const near = P0[2] <= 0, shown = near ? NAMES.near[i] : NAMES.far[i], hidden = near ? NAMES.far[i] : NAMES.near[i];
    for (let b = 0; b < 3; b++) {
      const p = JOINTS[b], q = JOINTS[b + 1], dx = q[0] - p[0], dy = q[1] - p[1], L = e.layer(shown[b]);
      L.x = p[0];
      L.y = p[1] + Hw;
      L.rotate = angle(p, q);
      L.scaleY = Math.sqrt(dx * dx + dy * dy) / ((b === 0 ? l1 : b === 1 ? l2 : PASTERN * Hw));
      L.alpha = vis;
      L.brightness = near ? 1 : 0.78;
      e.layer(hidden[b]).alpha = 0;
    }
  }
  // of the ways it is painted from, only the nearest is shown
  for (let j = 0; j < HEADINGS; j++) if (j !== k) {
    e.layer(NAMES.body[j]).alpha = 0;
    e.layer(NAMES.neck[j]).alpha = 0;
    e.layer(NAMES.head[j]).alpha = 0;
    e.layer(NAMES.tail[j]).alpha = 0;
    if (B.load === 'panniers') e.layer(NAMES.pannier[j]).alpha = 0;
  }
  // the body: its hip where it is seen now, as wide as it is seen turned so, pitched as the eye sees the pitch
  const side = now.s, bl = e.layer(NAMES.body[k]);
  see(was, HIP[0] * Hw, HIP[1] * Hw, HIP[2] * Hw, Q0);
  carried(Hw, HIP, A3);
  see(now, A3[0], A3[1], A3[2], P0);
  bl.x = P0[0] - Q0[0];
  bl.y = P0[1] - Q0[1];
  bl.scaleX = breadth(face) / breadth(k * STEP);
  bl.rotate = -pitch * side;
  bl.alpha = vis;
  if (B.load === 'panniers') { const pl = e.layer(NAMES.pannier[k]); pl.x = bl.x; pl.y = bl.y; pl.scaleX = bl.scaleX; pl.rotate = bl.rotate; pl.alpha = vis; }
  // the neck: nodding with the steps, idling standing, tossed — its painting's line from its root to the poll laid
  // along that line as it is now
  const nod = move * (nodOf(m.from, cyc) + (nodOf(m.g, cyc) - nodOf(m.from, cyc)) * w) + (1 - move) * 0.12 * noise(t * 0.15, seed) + toss * Math.sin(t * 7) * 0.5 * Math.max(0, Math.sin(t * 2.1));
  const a0 = NECK.up, a1 = a0 + nod + pitch, h0 = a0 - NECK.head, h1 = a1 - NECK.head - toss * 0.3, nl = NECK.length;
  see(was, 0, NECK.base[1] * Hw, NECK.base[2] * Hw, Q0);
  see(was, 0, (NECK.base[1] + Math.sin(a0) * nl) * Hw, (NECK.base[2] + Math.cos(a0) * nl) * Hw, Q1);
  carried(Hw, NECK.base, A3);
  see(now, A3[0], A3[1], A3[2], P0);
  B3[0] = 0; B3[1] = A3[1] + Math.sin(a1) * nl * Hw; B3[2] = A3[2] + Math.cos(a1) * nl * Hw;
  see(now, B3[0], B3[1], B3[2], P1);
  const d0 = Math.hypot(Q1[0] - Q0[0], Q1[1] - Q0[1]), d1 = Math.hypot(P1[0] - P0[0], P1[1] - P0[1]), nk = e.layer(NAMES.neck[k]);
  nk.x = P0[0] - Q0[0];
  nk.y = P0[1] - Q0[1];
  nk.rotate = angle(P0, P1) - angle(Q0, Q1);
  nk.scale = d0 > 1e-4 ? d1 / d0 : 1;
  nk.alpha = vis;
  // the head: hanging from the poll as it is now, its painting's line from the poll to the muzzle along it
  const hl = NECK.headLength * Hw;
  see(was, 0, (NECK.base[1] + Math.sin(a0) * nl) * Hw + Math.sin(h0) * hl, (NECK.base[2] + Math.cos(a0) * nl) * Hw + Math.cos(h0) * hl, Q0);
  see(now, 0, B3[1] + Math.sin(h1) * hl, B3[2] + Math.cos(h1) * hl, P2);
  const e0 = Math.hypot(Q0[0] - Q1[0], Q0[1] - Q1[1]), e1 = Math.hypot(P2[0] - P1[0], P2[1] - P1[1]), hd = e.layer(NAMES.head[k]);
  hd.x = P1[0] - Q1[0];
  hd.y = P1[1] - Q1[1];
  hd.rotate = angle(P1, P2) - angle(Q1, Q0);
  hd.scale = e0 > 1e-4 ? e1 / e0 : 1;
  hd.alpha = vis;
  // its head: where it is looked at, where a camera frames it, where a game marks it (`<id>#head`)
  e.at(P1[0] + (P2[0] - P1[0]) * 0.4, P1[1] + (P2[1] - P1[1]) * 0.4);
  e.at(P1[0] + (P2[0] - P1[0]) * 0.4, P1[1] + (P2[1] - P1[1]) * 0.4, 'head');
  // the tail: swishing from side to side, less as it goes; streaming back as it goes faster than a walk
  const fast = move * ((m.from === 0 ? 0.3 : 1) + ((m.g === 0 ? 0.3 : 1) - (m.from === 0 ? 0.3 : 1)) * w);
  const tl = e.layer(NAMES.tail[k]);
  see(was, 0, TAIL[1] * Hw, TAIL[2] * Hw, Q0);
  carried(Hw, TAIL, A3);
  see(now, A3[0], A3[1], A3[2], P0);
  tl.x = P0[0] - Q0[0];
  tl.y = P0[1] - Q0[1];
  tl.rotate = (1 - move * 0.5) * noise(t * 0.9, seed + 9) * 0.18 * now.c + fast * 0.3 * side;
  tl.alpha = vis;
  // the seat: the saddle as the stride moves it (a rider's `on`)
  carried(Hw, SADDLE, A3);
  see(now, A3[0], A3[1], A3[2], P0);
  e.at(P0[0], P0[1], 'seat');
  // the panniers' mouths (a child sat in one: `<id>_on` "great#basket_l" / "great#basket_r" — its left and right)
  if (B.load === 'panniers') for (const sd of [-1, 1]) {
    carried(Hw, [PANNIER.at[0] * sd * B.girth, PANNIER.at[1] + PANNIER.high * 0.6, PANNIER.at[2]], A3);
    see(now, A3[0], A3[1], A3[2], P0);
    e.at(P0[0], P0[1], sd < 0 ? 'basket_l' : 'basket_r');
  }
}

// tack(id, face, kind): where a rider's feet and hands go on horse `id` turned `face` degrees — its stirrups and its
// reins as points in its frame ({ foot_l, foot_r, r, l }: a person's `reach`)
function tack(id, face, kind) {
  const Hw = (HORSES[kind] ?? HORSES.horse).Hw, pr = seen(Number(face) || 0);
  const at = p => { const q = pr(mul(p, Hw)); return { on: id, at: [q[0], q[2], -q[1]] }; };
  const reins = at(REINS);
  return { foot_l: at([-STIRRUP[0], STIRRUP[1], STIRRUP[2]]), foot_r: at(STIRRUP), r: reins, l: reins };
}
// spot(id, face, kind, p): a point of horse `id` turned `face` degrees — p in its own frame (× its height: x to its right,
// y up, z ahead) — as a point in its frame ({ on: id, at }: someone's `on`, `reach`, `look`): a child in front of the rider
// on the saddle, the crupper a rein is tied to
function spot(id, face, kind, p) {
  const Hw = (HORSES[kind] ?? HORSES.horse).Hw, q = seen(Number(face) || 0)(mul(p, Hw));
  return { on: id, at: [q[0], q[2], -q[1]] };
}
// pace(gait, kind): a gait's own pace, m/s — how fast a scene moves a horse that walks, trots, canters, gallops
function pace(gait = 'walk', kind) {
  const Hw = (HORSES[kind] ?? HORSES.horse).Hw;
  return (GAITS.find(G => G.name === gait) ?? GAITS[0]).pace * Math.sqrt(Hw / 1.55);
}

return { horse: { paint, animate: animateHorse, tack, spot, pace }, HORSES };
