// Насыпь у ручья (engine 3) — what the scene's elements and its film share: the bank's ground (world metres: its profile,
// the land under the people — relief.js), where its features are, the grass and the willows (painted once in their
// daylight colours, moved by the wind in layers), the horse's options, and the film — the beats the game plays one at a
// time by the `beat` key (script.js, the world's module beats) and the showcase plays in order (showcase.js).
const { clamp } = anim;

// ── the bank ──────────────────────────────────────────────────────────
// the action plane: the bank's card stands at across 1.4, 5 m away; its profile in its own metres — the grassy top, the
// sandy slope down to the lip, a short drop, the heap of sand at the foot, the stones by the water
const BX = 1.4, Z0 = 5.0;
const TOPX = -3.6, TOPH = 2.2, LIP = -1.2, LIPH = 0.48, HC = -0.1, HW = 0.85, SX = 1.3;
function bankL(x) {
  if (x <= TOPX) return TOPH + 0.05 * Math.sin(x * 1.3 + 1) + 0.03 * Math.sin(x * 3.1) + (x < -6 ? 0.08 * (-6 - x) : 0);
  if (x <= LIP) { const u = (LIP - x) / (LIP - TOPX); return LIPH + (TOPH + 0.05 * Math.sin(TOPX * 1.3 + 1) + 0.03 * Math.sin(TOPX * 3.1) - LIPH) * Math.pow(u, 1.3); }
  if (x <= LIP + 0.26) { const u = (x - LIP) / 0.26; return LIPH * (1 - u * u * (3 - 2 * u)); }
  if (Math.abs(x - HC) < HW) { const q = Math.cos((Math.PI * (x - HC)) / (2 * HW)); return 0.16 * q * q; }
  return 0;
}
// the ground's height at world across a, on the bank's line (relief.js lays it 2 m deep round it)
const groundAt = a => bankL(a - BX);
// world across of the bank's features
const topA = BX + TOPX, lipA = BX + LIP, stonesA = BX + SX;

// ── grass in the wind ─────────────────────────────────────────────────
// Blades rooted along a line ({x, y — the root, h — how tall, draw(g)}), painted in tufts `width` metres wide: each
// tuft a layer bending in the wind about a point `below` metres under its roots (the roots hardly move, the tips most;
// neighbours sway together, never in step)
function tufts(e, blades, { width, wind, below = 0.3, name }) {
  const groups = new Map();
  for (const b of blades) {
    const k = Math.floor(b.x / width);
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(b);
  }
  for (const [k, bs] of [...groups].sort((p, q) => p[0] - q[0])) {
    let x0 = Infinity, x1 = -Infinity, top = Infinity, root = -Infinity;
    for (const b of bs) { x0 = Math.min(x0, b.x); x1 = Math.max(x1, b.x); top = Math.min(top, b.y - b.h); root = Math.max(root, b.y); }
    const pivot = [(x0 + x1) / 2, root + below];
    e.layer(`${name}${k}`, { pivot, wind, box: [x0 - 0.4, top - 0.25, x1 + 0.4, pivot[1] + 0.05] }, g => {
      g.lineCap = 'round';
      for (const b of bs) b.draw(g);
      g.globalAlpha = 1;
    });
  }
}
// a blade: a curved stroke from its root, leaning, a lit edge near its tip now and then
const blade = (x, y, h, lean, color, width, lit) => ({
  x, y, h,
  draw: g => {
    g.strokeStyle = color;
    g.globalAlpha = 0.95;
    g.lineWidth = width;
    g.beginPath();
    g.moveTo(x, y);
    g.quadraticCurveTo(x + lean * 0.4, y - h * 0.6, x + lean, y - h);
    g.stroke();
    if (lit) {
      g.strokeStyle = lit.color;
      g.globalAlpha = lit.alpha;
      g.lineWidth = width * lit.k;
      g.beginPath();
      g.moveTo(x + lean * lit.from, y - h * lit.at);
      g.lineTo(x + lean, y - h);
      g.stroke();
    }
  },
});

// ── the willows ───────────────────────────────────────────────────────
// A weeping willow on a card: its trunk and limbs, the crown's dark masses, the light on the sun's side (rs), and its
// hanging strands in clusters — each cluster a layer swaying from its top in the wind; grass at its foot.
//   P: { L — the trunk's lean, W — the crown's half-width, cy — its height, len — the strands', n — how many, tw — the
// trunk's width, rs — the sun's side (−1 left), sw — a strand's width, c — [trunk, leaves dark, leaves, lit, shade],
// foot — grass at its foot }
function willow(g, e, P) {
  const W = P.W, tw = P.tw, [tr, lf2, lf, lit, shade] = P.c;
  g.lineCap = 'round';
  g.globalAlpha = 0.3;
  g.fillStyle = shade;
  g.beginPath();
  g.ellipse(P.L * 0.4 + 0.6, 0.1, W * 1.15, 0.2, 0, 0, 7);
  g.fill();
  g.globalAlpha = 1;
  const tx = P.L, ty = -P.cy + 1.0;
  g.fillStyle = tr;
  g.beginPath();
  g.moveTo(-tw * 1.8, 0.03);
  g.bezierCurveTo(-tw * 0.8, -P.cy * 0.3, tx - tw * 1.3, ty + P.cy * 0.35, tx - tw * 0.5, ty);
  g.lineTo(tx + tw * 0.5, ty);
  g.bezierCurveTo(tx + tw * 1.1, ty + P.cy * 0.35, tw * 0.9, -P.cy * 0.3, tw * 1.9, 0.03);
  g.closePath();
  g.fill();
  if (P.limbs) {
    g.strokeStyle = tr;
    g.lineWidth = tw * 0.55;
    g.beginPath();
    g.moveTo(tx, ty + 0.5);
    g.quadraticCurveTo(tx - W * 0.4, ty - 0.5, tx - W * 0.85, ty - 0.3);
    g.moveTo(tx, ty + 0.3);
    g.quadraticCurveTo(tx + W * 0.4, ty - 0.7, tx + W * 0.9, ty - 0.45);
    g.moveTo(tx, ty);
    g.lineTo(tx + 0.15, ty - 1.1);
    g.stroke();
  }
  const cx = tx, cyy = -P.cy;
  g.fillStyle = lf2;
  for (let i = 0; i < 7; i++) {
    const u = (i / 6) * 2 - 1;
    g.globalAlpha = 0.9;
    g.beginPath();
    g.ellipse(cx + u * W * 0.72, cyy - 0.5 + u * u * 0.9, W * 0.4, 0.75, 0, 0, 7);
    g.fill();
  }
  if (P.limbs) {
    g.globalAlpha = 0.55;
    g.fillStyle = lit;
    g.beginPath();
    g.ellipse(cx + P.rs * W * 0.5, cyy - 0.9, W * 0.35, 0.35, P.rs * 0.3, 0, 7);
    g.fill();
  }
  g.globalAlpha = 1;
  // the strands, in seven clusters across the crown
  const strands = [];
  for (let i = 0; i < P.n; i++) {
    const u = e.rnd() * 2 - 1;
    const x0 = cx + u * W, y0 = cyy - 1.1 + u * u * 1.4 + e.rnd() * 0.4;
    const len = P.len * (0.55 + 0.45 * e.rnd()) * (1 - 0.28 * Math.abs(u));
    const out = u * 0.55, r = e.rnd();
    strands.push({ u, x0, y0, len, out, color: u * P.rs > 0.2 && r < 0.55 ? lit : r < 0.5 ? lf : lf2, alpha: 0.6 + e.rnd() * 0.35, width: P.sw * (0.7 + e.rnd() * 0.6) });
  }
  for (let k = 0; k < 7; k++) {
    const mine = strands.filter(s => Math.min(6, Math.floor(((s.u + 1) / 2) * 7)) === k);
    if (!mine.length) continue;
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    for (const s of mine) { x0 = Math.min(x0, s.x0, s.x0 + s.out); x1 = Math.max(x1, s.x0, s.x0 + s.out * 1.1); y0 = Math.min(y0, s.y0); y1 = Math.max(y1, s.y0 + s.len); }
    e.layer(`strands${k}`, { pivot: [(x0 + x1) / 2, y0], wind: { strength: 0.22, gust: 0.6, scale: 2 }, box: [x0 - 0.8, y0 - 0.4, x1 + 0.8, y1 + 0.3] }, q => {
      q.lineCap = 'round';
      for (const s of mine) {
        q.strokeStyle = s.color;
        q.globalAlpha = s.alpha;
        q.lineWidth = s.width;
        q.beginPath();
        q.moveTo(s.x0, s.y0);
        q.bezierCurveTo(s.x0 + s.out, s.y0 - 0.15, s.x0 + s.out * 1.1, s.y0 + s.len * 0.35, s.x0 + s.out * 0.9, s.y0 + s.len);
        q.stroke();
      }
      q.globalAlpha = 1;
    });
  }
  // grass at its foot
  if (P.foot) {
    const blades = [];
    for (let i = 0; i < 60; i++) {
      const x = (e.rnd() * 2 - 1) * tw * 7, h = 0.12 + e.rnd() * 0.4 * (1 - Math.abs(x) / (tw * 8));
      blades.push(blade(x, 0.05, h, 0, e.rnd() < 0.3 ? lit : lf2, 0.02 + e.rnd() * 0.02, null));
    }
    tufts(e, blades, { width: tw * 4, wind: { strength: 0.5, gust: 0.6 }, below: 0.25, name: 'foot' });
  }
}

// ── the rider on the meadow: his horse ──────────────────────────────────
// the horse (the world's module chrysalids) and the state keys it goes by: r_a, r_d (where), r_face (its heading: 0
// toward us, 90 right), r_toss (it tosses its head); seen while its rider is here (rider_here). RIDE: its walk's own
// pace, m/s — what the film moves it at. tack: where its rider's feet and hands go on it, turned so (script.js keeps
// rider_reach on it as it turns)
const HORSE = { kind: 'horse', across: 'r_a', distance: 'r_d', face: 'r_face', toss: 'r_toss', here: 'rider_here' };
const RIDE = kit.chrysalids.horse.pace('walk', HORSE.kind);
const tack = face => kit.chrysalids.horse.tack('horse', face, HORSE.kind);

// ── the close-up ──────────────────────────────────────────────────────
// The close-up's iris (stage heights: its middle, its radius) — high, a little right of the frame's middle, within its
// middle 4:3, over the far meadow: the children under it and the rider coming over the meadow on its left stay in sight
// while it is open; its paintings are laid out in their own
// units (as when the iris was 0.46 of the frame's height round the stage's middle), `k` of the stage's, the point
// (ox, oy) of them in the iris's middle
const CU = { x: 1.05, y: 0.3, r: 0.25, k: 0.25 / 0.46, ox: -0.2, oy: -0.09 };
const cuFrame = q => { q.translate(CU.x - CU.k * CU.ox, CU.y - CU.k * CU.oy); q.scale(CU.k, CU.k); };
const cuAt = (x, y) => [CU.x + CU.k * (x - CU.ox), CU.y + CU.k * (y - CU.oy)];
const cuBox = (x0, y0, x1, y1) => [...cuAt(x0, y0), ...cuAt(x1, y1)];
// the foot in it: its ankle, its turn, its length; the hem's edge at rest (along the foot from the ankle) and how far
// along it a full cover draws it (over the toes)
const FOOT_CU = { AX: -0.3, AY: -0.12, ANG: 0.3, L: 0.27, HX: -0.2, COVER: 0.6 };

// ── the film ──────────────────────────────────────────────────────────
// The world's module beats plays it (beats.md): for the game one beat at a time by `beat` (script.js); outside games
// all of the showcase's, in order (showcase.js). Each beat is a sequence of the director (s): the children, the mother
// and the rider do what they do as long as it takes (their motions at their own pace; a child sliding down the bank is
// moved, not walked); time waits only where the film pauses. `from` — what a beat begins at when it does not follow the
// one before it (a cut: the scene opened on it, or the showcase's jump).
// The people are the engine's (elements with "person", the world's cast): <id>_a, <id>_d (metres of the world, on the
// scene's relief; <id>_e — the children's height over the land in a flight off the lip), _do, _turn, _look, _reach,
// _with, _wear, _gait, _steps, _on, _here.
const Z = Z0;
// where things are (metres: across, distance, elevation): her caught foot, between the stones; where he kneels by it (on
// its far side, past the stones, facing her); where her mother kneels to her (at her side, a little behind); the top of
// the bank; the far ridge; up the path toward the Wenders' house; between the two by the stones (what the rider looks at)
const FOOT = [stonesA - 0.02, Z, 0.07];
const BY_FOOT = [FOOT[0] + 0.58, Z + 0.06];
const BY_HER = [2.45, Z + 0.42];
const TOP = [topA - 0.2, Z, TOPH + 1.0], RIDGE = [26, 250, 14], PATH = [10.6, 22, 1.5], CHILDREN = [2.6, Z, 0.6];
// the path from the stream up to the Wenders' house (the meadow paints it; whoever goes up or down it walks it)
const UP = [[2.65, 5.15], [5.6, 8.6], [8.2, 14], [10.6, 22], [12.6, 31]];
const PATH_LINE = [[3.4, 6.2], [5.6, 8.6], [8.2, 14], [10.6, 22], [12.6, 31], [13.9, 40], [14.4, 46.6]];
// the ground before someone, as they face it (where a child looks down the slope)
const down = (a, turn) => { const x = a + (turn === 270 ? -0.8 : 0.8); return [x, Z, groundAt(x)]; };
const loop = motion => ({ motion, loop: true });
// a little lower than a point (a nod's look): a person's chest, or a place's 0.32 m down
const lower = at => (typeof at === 'string' ? `${at}#chest` : [at[0], at[1], at[2] - 0.32]);

// ── what a beat does ──
const here = (s, id) => [s.state[`${id}_a`], s.state[`${id}_d`]];
// a motion done once where they are (getting up, sitting down), ending facing `turn`
const once = (s, id, motion, turn) => s.person(id).go(motion, { from: here(s, id), turn: turn ?? s.state[`${id}_turn`] });
// they walk (steps) to the points at their gait's pace — or `gait`'s — then turn to `turn`
async function walk(s, id, pts, turn, gait) {
  s.set(`${id}_steps`, true);
  await s.person(id).walk(pts, gait === undefined ? {} : { gait });
  if (turn != null) await s.person(id).turn(turn);
}
// A child sitting goes down the bank — moved as they sit, no steps — to across x, over `over` seconds (the slope's pull:
// `ease`); `up` — off the lip, flying: over the line from the lip's height to the land's where they come down, up this
// much in the middle of it (their place's elevation: how high over the land under them)
function slide(s, id, x, over, ease, up) {
  s.set(`${id}_steps`, false);
  const a0 = s.state[`${id}_a`];
  if (up == null) return s.move(`${id}_a`, x, { over, ease });
  const h0 = groundAt(lipA), h1 = groundAt(x), pts = [];
  for (let k = 0; k <= 32; k++) {
    const a = a0 + ((x - a0) * k) / 32, u = clamp((a - lipA) / (x - lipA), 0, 1);
    pts.push([a, a <= lipA ? 0 : Math.max(0, h0 + (h1 - h0) * u + 4 * up * u * (1 - u) - groundAt(a))]);
  }
  return s.path([`${id}_a`, `${id}_e`], pts, { over, ease });
}
// a nod: the look down a little at what they look at and up again, n times
async function nod(s, id, at, n = 1) {
  for (let i = 0; i < n; i++) {
    s.set(`${id}_look`, lower(at));
    await s.wait(0.28);
    s.set(`${id}_look`, at);
    await s.wait(0.27);
  }
}
// a wave sitting: the hand up over the head, on the side they face, to and fro n times
async function wave(s, id, n = 3) {
  const [a, d] = here(s, id), h = groundAt(a) + 1.25, side = s.state[`${id}_turn`] === 270 ? -1 : 1;
  for (let i = 0; i <= 2 * n; i++) {
    s.set(`${id}_reach`, { r: [a + side * 0.15 + (i % 2 ? 0.18 : -0.05), d - 0.12, h] });
    await s.wait(0.32);
  }
  await s.wait(0.3);
  s.set(`${id}_reach`, null);
}
// the shoe: on her foot, in his hands, in hers — her right foot bare once it is off (the stocking)
const shoe = where => ({ shoe: where, david_with: where === 'david' ? ['shoe'] : null, sophie_with: where === 'sophie' ? ['shoe'] : null,
  sophie_wear: where === 'on' ? null : { barefoot: 'right' } });
const setAll = (s, values) => { for (const [k, v] of Object.entries(values)) s.set(k, v); };
// his hands at the knot, the shoe off; her foot free, her knee drawn up (he is on his knees by her foot already)
async function unlace(s) {
  s.set('david_do', loop('kneel_work'));
  s.set('david_reach', { r: 'sophie#foot_r', l: 'sophie#foot_r' });
  s.set('david_look', 'sophie#foot_r');
  await s.wait(2.8);
  setAll(s, shoe('david'));
  s.set('sophie_do', loop('knee_up_sit'));
  s.set('sophie_reach', null);
  s.set('sophie_look', null);
  await s.wait(0.1);
  s.set('david_reach', null);
  await s.wait(0.4);
  s.set('david_do', loop('sit_heels'));
}
// the rider rides on to the right and away up the path from where he is, at a walk (`standing`: his horse stands turned
// to the children — it steps round to the way first); done as he is well up the path (AWAY metres off), riding on
const AWAY = 17;
async function rideOn(s, standing) {
  const [a, d] = [s.state.r_a, s.state.r_d];
  s.move('r_face', 90, { over: standing ? 1.4 : 1.0 });
  s.person('rider').turn(90);
  if (standing) await s.wait(1.0);
  s.path(['r_a', 'r_d'], [[a, d], [a + 4, d + 0.4], [8.6, 12.4], [11.2, 18], [12.8, 26]], { speed: RIDE, ease: 'linear' });
  await s.wait(0.4);
  s.person('rider').look(null);
  // (where the path turns up the meadow, so does he)
  await s.until(() => s.state.r_a >= 7.4);
  s.move('r_face', 155, { over: 2.0 });
  s.person('rider').turn(25);
  await s.until(() => s.state.r_d >= AWAY);
}
// a sequence beside the beat's own (another actor's, from now)
const aside = (s, fn) => s.sequence(fn);

// ── the state the beats begin at ──
// a person: where, doing what, facing where, looking at what — the rest at rest
const person = (id, a, d, more = {}) => ({ [`${id}_a`]: a, [`${id}_d`]: d, [`${id}_do`]: 'stand', [`${id}_turn`]: 180, [`${id}_look`]: null,
  [`${id}_reach`]: null, [`${id}_with`]: null, [`${id}_gait`]: null, [`${id}_steps`]: true, [`${id}_here`]: true,
  ...Object.fromEntries(Object.entries(more).map(([k, v]) => [`${id}_${k}`, v])) });
// the rider in the saddle, his feet in the stirrups, the reins in his hands, his horse at the meadow's left edge (r_a,
// r_d: where; r_face: its heading — 0 toward us, 90 right; r_toss: it tosses its head); not on the meadow yet (r_wait —
// the game's key, no beat sets it: the game holds him at the meadow's edge while its «Подол» shows its gesture)
const RIDER = { rider_on: { at: 'horse#seat', up: -0.5 }, rider_do: loop('perch_still'), rider_turn: 110, rider_look: null, rider_here: false,
  rider_reach: tack(35), r_a: -10, r_d: 19.5, r_face: 35, r_toss: 0, r_near: 0 };
const START = {
  evening: 0, night: 0, fade: 0, fade_color: '#000000', someone_coming: 0, closeup: 0, cu_pull: 0, cu_wig: 0, cu_hide: 0, cu_cover: false, hem: 0,
  camera_x: 0, camera_z: 0, camera_h: 0, camera_look: 0, puff: 0, puff_a: 1, splash: 0, ring: 0, ring_a: 2.72,
  ...person('david', -1.95, Z, { e: 0, do: loop('sit_lean_back'), turn: 90, look: down(-1.95, 90), steps: false }),
  ...person('sophie', -2.85, Z, { e: 0, do: loop('crouch'), turn: 90, look: 'david', wear: null, on: null }),
  ...person('mother', 10.6, 22, { turn: 330, here: false }),
  ...RIDER, ...shoe('on'),
};
// at the stones, the foot caught, the shoe off and the foot hidden, the hooves never come: she hugs her knees, he sits on
// his heels by her foot, the shoe in his hands (where `ask` begins, after `toes`)
const STONES = {
  ...START, camera_x: 1.95, camera_z: 2.0, camera_look: 0.1,
  ...person('david', BY_FOOT[0], BY_FOOT[1], { e: 0, do: loop('sit_heels'), turn: 270, look: 'sophie' }),
  ...person('sophie', 2.1, Z, { e: 0, do: loop('hug_knees'), turn: 90, look: 'david', on: null }),
  ...shoe('david'),
};

const FILM = {
  // ---- 1. Дэвид один съезжает по скату в песок, смеётся; наверху поднимается Софи; он машет — она съезжает, смеются.
  play: {
    from: () => START,
    run: async s => {
      const david = s.person('david'), sophie = s.person('sophie');
      // (he: down the bank sitting, faster and faster, off the lip into the sand, laughing)
      const he = aside(s, async q => {
        await q.wait(1.7);
        await slide(q, 'david', 1.0, 1.65, 'in', 0.14);
        q.person('david').do('land_cheer');
        q.person('david').look(null);
        q.set('puff_a', 1.0);
        q.set('puff', q.state.puff + 1);
        await q.wait(1.45);
        q.person('david').do('sit_laugh', { loop: true });
        await q.wait(2.6);
        q.person('david').look('sophie');
      });
      // (up on the top, she stands up out of the grass, to the edge)
      await s.wait(5.6);
      s.tell('play:girl'); // (she rises out of the grass up on the top)
      await once(s, 'sophie', 'stand_from_kneel', 90);
      await s.wait(0.5);
      await walk(s, 'sophie', [[-3.0, Z]], 90);
      await he;
      // (he gets up and beckons her)
      const up = once(s, 'david', 'get_up_ground', 270);
      await s.wait(1.4);
      david.do('beckon');
      await s.wait(0.2);
      sophie.look(down(-3.0, 90));
      await s.wait(1.2);
      sophie.look('david');
      await up;
      await s.wait(0.4);
      // (to the edge, down onto her seat, a shuffle forward — and down the bank; he steps back to watch)
      const back = aside(s, async q => { await q.wait(0.6); await walk(q, 'david', [[2.25, Z]], 270); q.person('david').look('sophie'); });
      await walk(s, 'sophie', [[-2.3, Z]], 90);
      const sat = once(s, 'sophie', 'sit_down_ground', 90);
      await s.wait(0.1);
      sophie.look(down(-2.3, 90));
      await s.wait(1.1);
      sophie.do('sit_lean_back', { loop: true });
      await slide(s, 'sophie', -1.95, 0.5, 'inOut');
      await sat;
      await back;
      sophie.look('david');
      await s.wait(0.5);
      await slide(s, 'sophie', 1.45, 1.7, 'in', 0.14);
      sophie.do('land_cheer');
      s.set('puff_a', 1.45);
      s.set('puff', s.state.puff + 1);
      await s.wait(0.6);
      david.do('laugh_stand');
      await s.wait(0.2);
      sophie.do('sit_laugh', { loop: true });
      await s.wait(1.3);
    },
  },
  // «ещё!» — она встаёт, показывает наверх, бежит к скату и карабкается на него; с разбегу летит дальше кучи, на камни.
  play_again: {
    after: 'play',
    from: () => ({ ...START, ...person('david', 2.25, Z, { e: 0, turn: 270, look: 'sophie' }),
      ...person('sophie', 1.45, Z, { e: 0, do: loop('sit_laugh'), turn: 90, look: 'david', wear: null, on: null }) }),
    run: async s => {
      const david = s.person('david'), sophie = s.person('sophie');
      // (up again, «ещё!» — she points up the bank, runs to it and climbs, bent, to the top; he steps back to watch)
      once(s, 'sophie', 'get_up_ground', 270);
      await s.wait(1.3);
      sophie.do('point_up');
      await s.wait(0.4);
      sophie.look(TOP);
      david.look('sophie');
      await s.wait(0.8);
      const watch = aside(s, async q => { await q.wait(0.5); await walk(q, 'david', [[3.35, Z]], 270); await q.wait(0.2); q.person('david').look(TOP); });
      await walk(s, 'sophie', [[0.35, Z]], 270);
      await walk(s, 'sophie', [[-2.3, Z]], 270, 'climb');
      sophie.gait(null);
      await walk(s, 'sophie', [[-3.0, Z]], 90);
      sophie.look('david');
      await s.wait(0.4);
      sophie.look(down(-3.0, 90));
      await s.wait(0.2);
      await watch;
      // (a run at the edge, and she throws herself down on her seat: down the bank, off the lip, far — onto the stones)
      sophie.look(null);
      await walk(s, 'sophie', [[-2.25, Z]], null, 'run');
      sophie.gait(null);
      sophie.do('sit_lean_back', { loop: true });
      await slide(s, 'sophie', 2.1, 1.35, 'linear', 0.32);
      sophie.do('land_cheer');
      await s.wait(0.6);
    },
  },
  // ---- 2. Удар о камни (брызги, пыль); камера подходит. Нога застряла: дёргает, плачет; он на коленях тянет; тянется к
  // башмаку — она откидывается, отталкивает, мотает головой; он садится на пятки, она плачет. (Здесь игра спрашивает, как
  // с ней заговорить.)
  stuck: {
    after: 'play_again',
    from: () => ({ ...START, ...person('david', 3.35, Z, { e: 0, turn: 270, look: TOP }),
      ...person('sophie', 2.1, Z, { e: 0, do: 'land_cheer', turn: 90, on: null }) }),
    run: async s => {
      const david = s.person('david'), sophie = s.person('sophie');
      sophie.do('stuck_sit', { loop: true });
      sophie.reach({ foot_r: FOOT });
      s.set('ring_a', 2.72);
      s.set('ring', 0);
      s.move('ring', 1, { over: 1.8, ease: 'out' });
      s.set('splash', s.state.splash + 1);
      s.set('puff_a', 2.0);
      s.set('puff', s.state.puff + 1);
      await s.wait(0.2);
      david.look('sophie');
      await s.wait(0.3);
      // (the camera comes nearer)
      s.move('camera_x', 1.95, { over: 3.2 });
      s.move('camera_z', 2.0, { over: 3.2 });
      s.move('camera_look', 0.1, { over: 3.2 });
      await s.wait(0.4);
      sophie.look(FOOT);
      await s.wait(0.4);
      sophie.do('tug', { loop: true });
      await s.wait(0.2);
      // (he runs to her and goes down on his knees by her foot)
      await s.person('david').go('kneel_down', { to: BY_FOOT, turn: 270 });
      david.look(FOOT);
      await s.wait(0.6);
      david.do('kneel_pull', { loop: true });
      david.reach({ r: 'sophie#foot_r', l: 'sophie#foot_r' });
      await s.wait(0.1);
      sophie.do('cry_sit', { loop: true });
      sophie.look(null);
      await s.wait(3.2);
      // (he reaches for the shoe — she leans back, pushes him off, shakes her head)
      sophie.do('refuse');
      sophie.look('david');
      await s.wait(0.4);
      david.reach(null);
      await s.wait(0.1);
      david.do('sit_heels', { loop: true });
      await s.wait(0.1);
      david.look('sophie');
      await s.wait(1.3);
      sophie.do('cry_sit', { loop: true });
      sophie.look(null);
    },
  },
  // ---- 3. (канон) Она затихает, смотрит на ногу, на него, кивает, отворачивается, закрыв лицо; он снимает башмак.
  let: {
    after: 'stuck',
    from: () => CAUGHT(),
    run: async s => {
      const sophie = s.person('sophie');
      await s.wait(1.9);
      sophie.do('stuck_sit', { loop: true });
      await s.wait(0.2);
      sophie.look(FOOT);
      await s.wait(0.8);
      sophie.look('david');
      await s.wait(0.6);
      await nod(s, 'sophie', 'david');
      await s.wait(0.65);
      sophie.do('turn_away_sit', { loop: true });
      sophie.look(null);
      await s.wait(0.3);
      await unlace(s);
    },
  },
  // — Тебе больно? Он наклоняется к ней; она смотрит на него, кивает сквозь слёзы (дважды), смотрит на ногу,
  // отворачивается, закрыв лицо; он развязывает и снимает башмак.
  talk_hurt: {
    after: 'stuck',
    from: () => CAUGHT(),
    run: async s => {
      const david = s.person('david'), sophie = s.person('sophie');
      await s.wait(0.2);
      david.do('kneel', { loop: true });
      david.look('sophie');
      await s.wait(1.7);
      sophie.look('david');
      await s.wait(0.7);
      await nod(s, 'sophie', 'david', 2);
      await s.wait(0.9);
      sophie.look(FOOT);
      await s.wait(0.4);
      sophie.do('stuck_sit', { loop: true });
      await s.wait(1.6);
      sophie.do('turn_away_sit', { loop: true });
      sophie.look(null);
      await s.wait(0.4);
      david.look(FOOT);
      await s.wait(0.6);
      await unlace(s);
    },
  },
  // — Ты чья? Слёзы обрываются; она садится прямо и смотрит ему в глаза; сама показывает на ногу, кивает и смотрит, как он
  // развязывает; только когда нога голая — отворачивается.
  talk_whose: {
    after: 'stuck',
    from: () => CAUGHT(),
    run: async s => {
      const sophie = s.person('sophie');
      await s.wait(0.2);
      s.person('david').look('sophie');
      await s.wait(1.6);
      sophie.do('sit_up_straight', { loop: true });
      await s.wait(0.1);
      sophie.look('david');
      await s.wait(4.7);
      sophie.reach({ foot_r: FOOT, r: [FOOT[0] - 0.1, Z - 0.1, 0.35] });
      await s.wait(0.1);
      sophie.look(FOOT);
      await s.wait(0.7);
      sophie.reach({ foot_r: FOOT });
      await s.wait(0.2);
      sophie.look('david');
      await s.wait(0.3);
      await nod(s, 'sophie', 'david');
      await s.wait(0.15);
      await unlace(s);
    },
  },
  // молча сесть рядом: он встаёт, обходит её и садится плечом к плечу, смотрит на камни; она плачет, стихает, смотрит на
  // него, кивает на ногу; он возвращается к ноге — они развязывают шнурок вдвоём, башмак снят.
  talk_sit: {
    after: 'stuck',
    from: () => CAUGHT(),
    run: async s => {
      const david = s.person('david'), sophie = s.person('sophie');
      await s.wait(0.3);
      const up = once(s, 'david', 'stand_from_kneel', 270);
      await s.wait(0.1);
      david.look('sophie');
      await up;
      await walk(s, 'david', [[2.75, 5.5], [2.1, 5.6], [1.6, 5.3]], 155);
      const down_ = once(s, 'david', 'sit_down_ground', 155);
      await s.wait(0.1);
      david.look(FOOT);
      await down_;
      david.do('sit_knees', { loop: true });
      await s.wait(0.3);
      sophie.do('stuck_sit', { loop: true });
      await s.wait(0.5);
      sophie.look('david');
      await s.wait(1.1);
      david.look('sophie');
      await s.wait(1.0);
      sophie.look(FOOT);
      await s.wait(0.5);
      await nod(s, 'sophie', FOOT);
      await s.wait(0.25);
      await once(s, 'david', 'get_up_ground', 155);
      await walk(s, 'david', [[2.5, 4.55], [3.4, 4.75]], 270);
      await s.person('david').go('kneel_down', { to: BY_FOOT, turn: 270 });
      david.do('kneel_work', { loop: true });
      david.reach({ r: 'sophie#foot_r', l: 'sophie#foot_r' });
      sophie.reach({ foot_r: FOOT, r: 'sophie#foot_r' });
      await s.wait(0.1);
      david.look('sophie#foot_r');
      sophie.look('sophie#foot_r');
      await s.wait(1.6);
      setAll(s, shoe('david'));
      sophie.do('knee_up_sit', { loop: true });
      sophie.reach(null);
      sophie.look(null);
      await s.wait(0.1);
      david.reach(null);
      await s.wait(0.3);
      david.do('sit_heels', { loop: true });
    },
  },
  // ---- 4. (канон) Диафрагма, крупно: шесть пальцев, поджимаются; её рука натягивает подол. Снаружи — она обхватила
  // колени. Диафрагма закрывается.
  toes: { after: ['let', 'talk_hurt', 'talk_whose', 'talk_sit'], from: () => BARE(), run: s => toes(s, true) },
  // крупно, а нога так и остаётся голой (игра: копыта ещё впереди)
  toes_bare: { after: ['let', 'talk_hurt', 'talk_whose', 'talk_sit'], from: () => BARE(), run: s => toes(s, false) },
  // ---- копыта: камера отходит на средний план; слева по лугу шагом едет всадник (сцена говорит 'ridge:rider'); она
  // замирает и смотрит на него, потом Дэвид; он тянется к её ноге — и открывается крупный план: ступня, подол, его рука
  // на краю подола (игра: «Подол» — его рука тянет подол, `hem`). К концу всадник там, откуда видно камни: 'ridge:seen',
  // конец куска; крупный план открыт, пока его не закроет cover или ridge_stop.
  ridge: {
    after: 'toes_bare',
    from: () => ({ ...BARE(), sophie_look: 'david', david_look: 'sophie' }),
    run: async s => {
      const david = s.person('david');
      meadow(s, 2.6);
      await s.wait(2.6);
      s.person('rider').here();
      s.tell('ridge:rider');
      await s.wait(1.6);
      s.person('sophie').do('sit_knees', { loop: true });
      s.person('sophie').look('rider');
      await s.wait(0.8);
      david.look('rider');
      await s.wait(0.7);
      // (he goes to her foot: on his knees, his hands to it — the close-up opens on it, his hand on the hem's edge)
      david.do('kneel', { loop: true });
      david.reach({ r: 'sophie#foot_r', l: 'sophie#foot_r' });
      david.look('sophie#foot_r');
      s.set('cu_pull', 1);
      s.set('cu_wig', 0);
      s.set('cu_hide', 0);
      s.set('cu_cover', true);
      await s.wait(0.5);
      await s.move('closeup', 1, { over: 0.8, ease: 'out' });
      s.tell('ridge:hem');
      // (he rides on from the meadow's edge once the game lets him: r_wait)
      await s.until(() => !s.state.r_wait);
      await s.path(['r_a', 'r_d', 'r_near'], [[...EDGE, 0], [...BEND, NEAR_MID], [...SEEN, 1]], { speed: SLOW, ease: 'linear' });
      s.tell('ridge:seen');
    },
  },
  // подол уже на ступне (игра: «Подол» — успел; может быть, посреди куска ridge): крупный план закрывается, он отпускает
  // ногу, она подтягивает колени; камера встаёт на свой план оттуда, где была; всадник едет дальше своим шагом туда,
  // откуда видно камни, — 'ridge:seen', и кусок кончается не раньше
  cover: {
    after: 'ridge',
    from: () => ({ ...RIDGE_END(), hem: 1 }),
    run: async s => {
      const david = s.person('david'), sophie = s.person('sophie');
      meadow(s, 2.0);
      s.person('rider').here();
      const [a, d] = [s.state.r_a, s.state.r_d];
      const riding = Math.hypot(a - SEEN[0], d - SEEN[1]) > 0.01 && s.path(['r_a', 'r_d', 'r_near'], [[a, d, s.state.r_near], ...(a < BEND[0] ? [[...BEND, NEAR_MID]] : []), [...SEEN, 1]], { speed: SLOW, ease: 'linear' });
      david.do('kneel', { loop: true });
      david.reach({ r: 'sophie#foot_r', l: 'sophie#foot_r' });
      david.look('sophie#foot_r');
      await s.move('closeup', 0, { over: 0.8, ease: 'in' });
      s.set('cu_cover', false);
      sophie.do('hug_knees', { loop: true });
      await s.wait(0.4);
      david.reach(null);
      await s.wait(0.1);
      david.do('sit_heels', { loop: true });
      await s.wait(0.2);
      sophie.look('rider');
      await s.wait(0.2);
      david.look('rider');
      if (riding) { await riding; s.tell('ridge:seen'); }
    },
  },
  // всадник не обернулся: едет дальше, вверх по тропинке; потом они смотрят друг на друга
  ridge_pass: {
    after: 'cover',
    from: () => ({ ...RIDGE_END(), closeup: 0, cu_cover: false, hem: 1, david_do: loop('sit_heels'), david_reach: null, sophie_do: loop('hug_knees') }),
    run: async s => {
      const riding = aside(s, q => rideOn(q));
      await s.wait(7.0);
      s.person('sophie').look('david');
      await s.wait(0.6);
      s.person('david').look('sophie');
      await riding;
    },
  },
  // не успел: всадник придерживает коня прямо за ними, разворачивает к ним, конь вскидывает голову, всадник смотрит
  // вниз на них; Дэвид поздно натягивает подол; потом всадник едет дальше
  ridge_stop: {
    after: 'ridge',
    from: () => RIDGE_END(),
    run: async s => {
      const david = s.person('david'), sophie = s.person('sophie'), rider = s.person('rider');
      // (the close-up closes on the foot still bare; he lets it go, sits back)
      s.move('closeup', 0, { over: 0.8, ease: 'in' });
      david.reach(null);
      david.do('sit_heels', { loop: true });
      david.look('rider');
      // (on at his walk, then reined in over the last steps: `out` from the walk's pace — three times the way over it)
      await s.path(['r_a', 'r_d'], [SEEN, HALT[0]], { speed: RIDE, ease: 'linear' });
      s.set('cu_cover', false);
      const stopping = s.path(['r_a', 'r_d'], HALT, { over: (3 * Math.hypot(HALT[1][0] - HALT[0][0], HALT[1][1] - HALT[0][1])) / RIDE, ease: 'out' });
      await s.wait(1.6);
      s.move('r_face', 15, { over: 1.4 });
      rider.turn(165);
      await s.wait(0.4);
      s.move('r_toss', 1, { over: 0.3 });
      rider.look(CHILDREN);
      s.tell('ridge_stop:held'); // (reined in right behind them, he looks down at them)
      await s.wait(1.0);
      s.move('r_toss', 0, { over: 0.8 });
      await s.wait(0.4);
      david.do('kneel', { loop: true });
      david.reach({ r: 'sophie#foot_r', l: 'sophie#foot_r' });
      david.look('sophie#foot_r');
      await s.wait(0.5);
      sophie.do('hug_knees', { loop: true });
      await s.wait(0.4);
      david.reach(null);
      await s.wait(0.1);
      david.do('sit_heels', { loop: true });
      await s.wait(0.2);
      sophie.look('rider');
      await s.wait(0.2);
      david.look('rider');
      await stopping;
      await s.wait(3.0);
      s.tell('ridge_stop:on'); // (he rides on)
      const riding = aside(s, q => rideOn(q, true));
      await s.wait(6.5);
      sophie.look('david');
      await s.wait(0.5);
      david.look('sophie');
      await riding;
    },
  },
  // ---- 5. Обещание: она, обхватив колени, тянет к нему руку.
  ask: {
    after: 'toes',
    from: () => STONES,
    run: async s => {
      await s.wait(0.8);
      s.person('sophie').reach({ r: 'david#chest' });
      await s.wait(0.6);
    },
  },
  // он — палец к губам, кивает; отдаёт ей башмак, она берёт
  promise: {
    after: 'ask',
    from: () => ({ ...STONES, sophie_reach: { r: 'david#chest' } }),
    run: async s => {
      const david = s.person('david'), sophie = s.person('sophie');
      await s.wait(0.6);
      await david.do('shush');
      sophie.reach(null);
      await s.wait(0.6);
      david.reach({ r: 'sophie#hands' });
      await s.wait(0.8);
      sophie.reach({ r: 'david#hand_r' });
      await s.wait(0.5);
      setAll(s, shoe('sophie'));
      await s.wait(0.1);
      sophie.reach(null);
      await s.wait(0.1);
      david.reach(null);
      david.do('sit_heels', { loop: true });
      await s.wait(0.3);
    },
  },
  // ---- 6. Она пробует встать — не может; вдали мать (рука козырьком), Софи машет, мать бежит вниз, на колени, обнимает;
  // рука находит ногу под подолом, замирает; мать медленно поднимает глаза на Дэвида и держит взгляд. (Конец — выбор
  // Дэвида.)
  mother: {
    after: 'promise',
    from: () => GIVEN(),
    run: async s => {
      const david = s.person('david'), sophie = s.person('sophie'), mother = s.person('mother');
      s.move('evening', 0.54, { over: 16, ease: 'linear' });
      s.move('camera_z', 0.9, { over: 3.0 });
      s.move('camera_x', 2.6, { over: 3.0 });
      s.move('camera_look', 0.04, { over: 3.0 });
      // (out of the house, down the path; she stops and looks for her, a hand over her eyes)
      mother.here();
      const comes = aside(s, async q => {
        await walk(q, 'mother', [[9.6, 19]], 300);
        q.person('mother').do('shade', { loop: true });
        q.person('mother').look([2.6, Z, 0.8]);
      });
      await s.wait(0.6);
      sophie.do('try_stand');
      await s.wait(1.6);
      const up = once(s, 'david', 'stand_from_kneel', 270);
      await s.wait(0.1);
      sophie.do('hug_knees', { loop: true });
      await s.wait(0.3);
      sophie.look('mother');
      await s.wait(0.4);
      david.look('mother');
      await up;
      await comes;
      s.tell('mother:wave'); // (Sophie waves to her mother up the path)
      await wave(s, 'sophie');
      // (she sees her: down the path at a run, on her knees by her, her arms round her)
      mother.look('sophie');
      mother.do('stand');
      const runs = aside(s, async q => {
        await q.wait(0.4);
        await walk(q, 'mother', [[8.2, 14], [5.6, 8.6], [3.4, 6.2]], 225, 'run');
        q.person('mother').gait(null);
      });
      await s.wait(1.2);
      await walk(s, 'david', [[3.7, Z]], 270);
      david.look('mother');
      await runs;
      await s.person('mother').go('kneel_hug', { to: BY_HER, turn: 225 });
      mother.look('sophie');
      sophie.do('cry_sit', { loop: true });
      sophie.look(null);
      s.move('camera_z', 1.5, { over: 2.5 });
      s.move('camera_x', 2.3, { over: 2.5 });
      mother.do('kneel', { loop: true });
      mother.reach({ r: 'sophie#chest', l: 'sophie#chest' });
      await s.wait(0.9);
      // (her hand finds the foot under the hem — and stops)
      mother.reach({ r: 'sophie#foot_r', l: 'sophie#chest' });
      mother.look('sophie#foot_r');
      await s.wait(0.4);
      sophie.do('hug_knees', { loop: true });
      await s.wait(0.2);
      sophie.look('mother');
      await s.wait(1.6);
      mother.look('david');
      await s.wait(0.4);
      mother.reach(null);
      await s.wait(0.8);
    },
  },
  // он — палец к губам, кивает; она кивает в ответ; поднимает Софи и уносит по тропинке; Софи смотрит назад
  nod: {
    after: 'mother',
    from: () => FOUND(),
    run: async s => {
      const david = s.person('david'), mother = s.person('mother');
      s.move('evening', 0.79, { over: 11, ease: 'linear' });
      await s.wait(0.8);
      await david.do('shush_stand');
      s.tell('nod:nod'); // (she nods back to him)
      await nod(s, 'mother', 'david');
      await s.wait(0.45);
      mother.look('sophie');
      await s.wait(0.2);
      mother.reach({ r: 'sophie#chest', l: 'sophie#chest' });
      await s.wait(0.4);
      await lift(s);
    },
  },
  // он опускает глаза и отворачивается; мать смотрит долго, без кивка; прижимает Софи к себе, поднимает и уходит быстрее,
  // не оглядываясь; Софи смотрит назад; он поднимает глаза ей вслед
  away: {
    after: 'mother',
    from: () => FOUND(),
    run: async s => {
      const david = s.person('david'), mother = s.person('mother'), sophie = s.person('sophie');
      s.move('evening', 0.79, { over: 11, ease: 'linear' });
      await s.wait(0.5);
      david.look(down(3.7, 270));
      await s.wait(0.7);
      david.turn(200);
      await s.wait(2.4);
      mother.look('sophie');
      await s.wait(0.2);
      mother.reach({ r: 'sophie#chest', l: 'sophie#chest' });
      await s.wait(0.2);
      sophie.do('cry_sit', { loop: true });
      await s.wait(1.0);
      sophie.do('hug_knees', { loop: true });
      await s.wait(0.4);
      mother.reach(null);
      await s.wait(0.2);
      const turning = aside(s, async q => { await q.wait(2.7); q.person('david').turn(270); await q.wait(0.3); q.person('david').look('mother'); });
      s.tell('away:gone'); // (she lifts Sophie and goes)
      await lift(s, 'inOut');
      await turning;
    },
  },
  // ---- 7. (канон) Один у ручья: на дальнем гребне всадник; Дэвид смотрит на него, садится у воды, смотрит вслед.
  alone: {
    after: ['nod', 'away'],
    from: () => ({ ...FOUND(), evening: 0.79, camera_x: 0.6, camera_z: 0, ...person('david', 4.0, Z, { e: 0, turn: 270, look: 'mother' }),
      ...person('mother', UP[4][0], UP[4][1], { do: loop('carry_stand'), turn: 20, gait: 'carry_walk', reach: null }),
      sophie_on: HELD, sophie_turn: 180, sophie_do: loop('carried'), sophie_steps: false, sophie_look: 'david', sophie_reach: null }),
    run: async s => {
      const david = s.person('david');
      s.move('evening', 1, { over: 7, ease: 'linear' });
      s.move('someone_coming', 1, { over: 6 });
      await s.wait(2.8);
      david.look(RIDGE);
      await s.wait(1.6);
      david.look(FOOT);
      await s.wait(0.2);
      await david.turn(240);
      await once(s, 'david', 'sit_down_ground', 240);
      david.do('sit_knees', { loop: true });
      david.look('mother');
      await s.wait(1.5);
    },
  },
  // ---- II. Ночь перед облавой: у камней стоит Софи, поодаль на тропинке мать с узлом, обе смотрят вверх, на тропинку.
  // Из черноты Дэвид сбегает с насыпи; Софи оборачивается к нему, мать тоже; Софи шагает навстречу; они стоят лицом к
  // лицу, мать смотрит на них. (Выбор можно предлагать на sophie, mother, david.)
  night_warn: {
    from: () => NIGHT,
    run: async s => {
      const david = s.person('david'), sophie = s.person('sophie'), mother = s.person('mother');
      s.move('fade', 0, { over: 1.6, ease: 'out' });
      const runs = aside(s, async q => { await q.wait(0.9); await walk(q, 'david', [[1.35, Z]], 90, 'run'); q.person('david').gait(null); });
      await s.wait(1.4);
      sophie.look('david');
      await s.wait(0.3);
      sophie.turn(250);
      await s.wait(0.5);
      mother.look('david');
      await s.wait(0.4);
      mother.turn(290);
      await runs;
      david.look('sophie');
      await s.all(walk(s, 'sophie', [[2.15, Z]], 270), walk(s, 'david', [[1.6, Z]], 90));
    },
  },
  // она берёт его за руку; мать зовёт; Софи отпускает и уходит с матерью вверх по тропинке в темноту; один раз
  // оглядывается; он стоит и смотрит вслед
  night_warn_bye: {
    after: 'night_warn',
    from: () => ({ ...NIGHT, fade: 0, ...person('david', 1.6, Z, { e: 0, turn: 90, look: 'sophie' }),
      ...person('sophie', 2.15, Z, { e: 0, turn: 270, look: 'david', on: null }), mother_look: 'david', mother_turn: 290 }),
    run: async s => {
      const david = s.person('david'), sophie = s.person('sophie'), mother = s.person('mother');
      await s.wait(0.3);
      sophie.reach({ r: 'david#hand_l' });
      await s.wait(0.3);
      david.reach({ l: 'sophie#hand_r' });
      await s.wait(1.7);
      mother.do('beckon_woman');
      await s.wait(0.7);
      sophie.look('mother');
      await s.wait(0.6);
      sophie.reach(null);
      await s.wait(0.2);
      david.reach(null);
      const watches = aside(s, async q => { await q.wait(1.0); q.person('david').look('sophie'); });
      const goes = aside(s, async q => {
        await q.wait(1.5);
        q.person('mother').look(null);
        await walk(q, 'mother', [[5.6, 8.6], [8.2, 14], [10.6, 22]], 30);
      });
      // (up the path; once she looks back at him)
      s.set('sophie_steps', true);
      const way = sophie.walk([[3.6, 5.6], [4.8, 6.8], [5.0, 8.0], [7.6, 13.4], [10.0, 21.4]]);
      await s.wait(2.5);
      sophie.look(null);
      await s.wait(2.6);
      sophie.look('david');
      await s.wait(2.2);
      sophie.look(null);
      await way;
      await sophie.turn(30);
      await s.all(goes, watches);
    },
  },
};

// ── the close-up (toes, toes_bare): the iris opens on the bare foot — six toes; they curl twice; her hand pulls the hem
// over it (hide) — outside, she hugs her knees; the iris closes ──
async function toes(s, hide) {
  s.set('cu_pull', 0);
  s.set('cu_wig', 0);
  s.set('cu_hide', 0);
  s.move('closeup', 1, { over: 0.8, ease: 'out' });
  await s.wait(0.2);
  s.move('cu_pull', 1, { over: 4.0 });
  await s.wait(2.2);
  await s.move('cu_wig', 1, { over: 0.3 });
  await s.wait(0.7);
  s.move('cu_wig', 0, { over: 0.3 });
  await s.wait(0.1);
  if (hide) {
    s.move('cu_hide', 1, { over: 1.4, ease: 'inOut' });
    await s.wait(0.3);
    s.person('sophie').do('hug_knees', { loop: true });
  } else {
    await s.wait(0.5);
    await s.move('cu_wig', 0.6, { over: 0.25 });
    await s.wait(0.15);
    s.move('cu_wig', 0, { over: 0.3 });
    await s.wait(0.3);
  }
  s.person('sophie').look('david');
  await s.wait(0.1);
  s.person('david').look('sophie');
  await s.wait(hide ? 1.6 : 0.9);
  await s.move('closeup', 0, { over: 0.8, ease: 'in' });
}
// the mother takes her up in her arms, stands, turns to the path, and carries her off up it (the walk goes on past the
// beat's end: the beat ends as she has her and goes; Софи looks back at him)
const HELD = { at: 'mother#hands', up: -0.22 };
async function lift(s, ease) {
  const mother = s.person('mother'), sophie = s.person('sophie');
  mother.do('lift_child');
  sophie.on(HELD);
  s.set('sophie_turn', 180);
  sophie.do('carried', { loop: true });
  s.set('sophie_steps', false);
  mother.reach(null);
  sophie.look('david');
  await s.wait(1.6);
  s.person('david').look('mother');
  await s.wait(1.3);
  mother.do('carry_stand', { loop: true });
  mother.gait('carry_walk');
  await s.wait(ease ? 0.1 : 0.2);
  mother.look(null);
  s.set('mother_steps', true);
  aside(s, q => q.person('mother').walk(UP));
  if (!ease) {
    await s.wait(0.2);
    await walk(s, 'david', [[4.0, Z]], 270);
    s.move('camera_z', 0, { over: 4.5 });
    s.move('camera_x', 0.6, { over: 4.5 });
  } else {
    s.move('camera_z', 0, { over: 4.5 });
    s.move('camera_x', 0.6, { over: 4.5 });
  }
  await s.wait(3.0);
}

// where the rider sees the foot from (on the meadow, the stones in view across the stream); where he reins his horse in
// (from, to: right behind the children)
const SEEN = [-4, 10.5], HALT = [[-1, 10.1], [1.2, 9.9]];
// where he shows — on the meadow, at the left of the frame's middle 4:3 (seen while he waits there) —, the bend of his
// way, and his slow walk from there to SEEN (≈ 11 s)
const EDGE = [-10, 19.5], BEND = [-7, 14.5], SLOW = RIDE * 0.62;
// how near he has come at the bend of his way (its share of the way from where he shows to SEEN: r_near)
const NEAR_MID = Math.hypot(3, 5) / (Math.hypot(3, 5) + Math.hypot(3, 4));
// the camera on the meadow's shot (the children by the stones, the meadow behind them open, the rider's way over it
// within the frame's middle), from wherever it is
const MEADOW = [1.5, 1.1, 0.06];
function meadow(s, over) {
  s.move('camera_x', MEADOW[0], { over });
  s.move('camera_z', MEADOW[1], { over });
  s.move('camera_look', MEADOW[2], { over });
}
// the foot caught in the stones: she cries, he sits on his heels and looks at her (where the talk begins)
const CAUGHT = () => ({ ...START, camera_x: 1.95, camera_z: 2.0, camera_look: 0.1,
  ...person('david', BY_FOOT[0], BY_FOOT[1], { e: 0, do: loop('sit_heels'), turn: 270, look: 'sophie' }),
  ...person('sophie', 2.1, Z, { e: 0, do: loop('cry_sit'), turn: 90, reach: { foot_r: FOOT }, on: null }) });
// the shoe off, her foot bare, her knee drawn up (where the close-up begins)
const BARE = () => ({ ...CAUGHT(), ...shoe('david'), sophie_do: loop('knee_up_sit'), sophie_reach: null, david_look: 'sophie#foot_r' });
// the rider where he sees the stones; the two looking at him, her foot still bare
const RIDGE_END = () => ({ ...BARE(), camera_x: MEADOW[0], camera_z: MEADOW[1], camera_look: MEADOW[2], rider_here: true, r_a: SEEN[0], r_d: SEEN[1],
  r_near: 1, sophie_do: loop('sit_knees'), sophie_look: 'rider', david_look: 'rider', closeup: 1, cu_pull: 1, cu_cover: true,
  david_do: loop('kneel'), david_reach: { r: 'sophie#foot_r', l: 'sophie#foot_r' } });
// the promise given: the shoe in her hands
const GIVEN = () => ({ ...STONES, ...shoe('sophie') });
// the mother on her knees by her, looking up at him; he standing, looking back (where the choice is)
const FOUND = () => ({ ...GIVEN(), evening: 0.54, camera_x: 2.3, camera_z: 1.5, camera_look: 0.04,
  ...person('david', 3.7, Z, { e: 0, turn: 270, look: 'mother' }),
  ...person('mother', BY_HER[0], BY_HER[1], { do: loop('kneel'), turn: 225, look: 'david' }),
  sophie_do: loop('hug_knees'), sophie_look: 'mother' });
// the night before the raid: Софи by the stones, her mother up the path with a bundle, both looking up the path; he on
// the top of the bank; out of the dark
const NIGHT = {
  ...START, night: 1, fade: 1, fade_color: '#08101d', evening: 1, camera_x: 0.6, camera_z: 0.7, camera_look: 0.04,
  ...person('david', -2.3, Z, { e: 0, turn: 90, look: down(-2.3, 90) }),
  ...person('sophie', 2.9, 5.2, { e: 0, turn: 30, look: PATH, on: null }),
  ...person('mother', 5.2, 7, { turn: 30, look: PATH, with: ['bundle'] }),
};
// the showcase: the film as a viewer of the world sees it, with the rider on the meadow (the foot left bare till he
// comes; David covers it in time), and the night of chapter II
const SHOWCASE = ['play', 'play_again', 'stuck', 'let', 'toes_bare', 'ridge', 'cover', 'ridge_pass', 'ask', 'promise', 'mother', 'nod', 'alone', 'night_warn', 'night_warn_bye'];

return { BX, Z0, TOPX, TOPH, LIP, LIPH, HC, HW, SX, bankL, groundAt, topA, lipA, stonesA, PATH_LINE, tufts, blade, willow, HORSE, tack, CU, cuFrame, cuAt, cuBox, FOOT_CU, FILM, SHOWCASE };
