// The film in pieces (modules/film.md; the beats, their keys and what a game does with them — notes.md).
// The canon (`film`, what a viewer of the world sees): play → stuck → let → toes → ask → promise → mother → nod → alone.
// The game's branches: talk_hurt | talk_whose | talk_sit (in place of `let`), toes_bare (the foot left bare),
// ridge → cover → ridge_pass | ridge → ridge_stop (the rider on the crest), away (in place of `nod`);
// the night of chapter II: night_warn → night_warn_bye.
// The people are the engine's (elements with "person", the world's cast): what each does is <id>_do, where each faces
// <id>_turn (degrees: 0 away from us, 90 to the right, 180 toward us), looks <id>_look, reaches <id>_reach, what is in
// their hands <id>_with — and where each is their place (<id>_a, <id>_d; <id>_e — how high over the land, in a flight).
const P = id => scene.person(id), L = scene.lib, Z = L.Z0;
const loop = motion => ({ motion, loop: true });
// where things are (metres: across, distance, elevation): her caught foot, between the stones; the top of the bank;
// the far ridge; up the path, toward the Wenders' house; the rider on the meadow
const FOOT = [L.stonesA - 0.02, Z, 0.07];
// where he kneels by it: on its far side, past the stones, facing her
const BY_FOOT = [FOOT[0] + 0.58, Z + 0.06];
// where her mother kneels to her: at her side, a little behind her, facing her
const BY_HER = [2.45, Z + 0.42];
const TOP = [L.topA - 0.2, Z, L.TOPH + 1.0], RIDGE = [26, 250, 14], PATH = [10.6, 22, 1.5];
// the ground before someone, as they face it (where a child looks down the slope)
const down = (a, turn) => [a + (turn === 270 ? -0.8 : 0.8), Z, L.groundAt(a + (turn === 270 ? -0.8 : 0.8))];
const START = {
  sun: 1, night: 0, fade: 0, fade_color: '#000000', someone_coming: 0, shoe: 'on', foot_hidden: 0,
  closeup: 0, cu_pull: 0, cu_wig: 0, cu_hide: 0, cu_a: 0, cu_d: 2,
  camera_x: 0, camera_z: 0, camera_h: 0, camera_look: 0,
  puff: 0, puff_a: 1, puff2: 0, puff2_a: 1, ring: 0, ring_a: 2.7,
  david_a: -1.95, david_d: Z, david_e: 0, david_do: loop('sit_lean_back'), david_turn: 90, david_look: down(-1.95, 90), david_reach: null, david_with: null, david_steps: false, david_gait: null, david_here: true,
  sophie_a: -2.85, sophie_d: Z, sophie_e: 0, sophie_do: loop('crouch'), sophie_turn: 90, sophie_look: 'david', sophie_reach: null, sophie_with: null, sophie_steps: true, sophie_gait: null, sophie_on: null, sophie_here: true,
  mother_a: 10.6, mother_d: 22, mother_do: 'stand', mother_turn: 330, mother_look: null, mother_reach: null, mother_with: null, mother_steps: true, mother_gait: null, mother_here: false,
  r_a: -18, r_d: 17, r_face: 70, r_look: null, r_toss: 0, r_vis: 0,
};

// a beat's rows written in the film's own seconds (t0 — where the beat starts in them)
const at = (t0, rows) => rows.map(([t, ...r]) => [Math.round((t - t0) * 100) / 100, ...r]);
// the state once the rows have played (what the next beat begins at, when the scene opens on it): values, paths' ends,
// and what a row that is a function says it leaves (its `ends(state)`)
function settle(state, rows) {
  const out = { ...state };
  for (const [, k, v] of [...rows].sort((p, q) => p[0] - q[0])) {
    if (typeof k === 'function') Object.assign(out, k.ends?.(out));
    else if (Array.isArray(k)) k.forEach((key, i) => (out[key] = v.path.at(-1)[i]));
    else out[k] = v;
  }
  return out;
}
// a motion done once, ending facing `turn`: begun where they are (getting up, sitting down) — or ending at `to` (down on
// his knees by her foot: a step to where it begins first); they are where it takes them, held at its end, after it
const once = (id, motion, turn, to) => {
  const f = () => { const s = scene.state; P(id).go(motion, { ...(to ? { to } : { from: [s[`${id}_a`], s[`${id}_d`]] }), turn: turn ?? s[`${id}_turn`] }); };
  f.ends = s => {
    const end = turn ?? s[`${id}_turn`], off = to ? { across: 0, distance: 0 } : P(id).startOf(motion, end) ?? { across: 0, distance: 0 };
    const [a, d] = to ?? [s[`${id}_a`], s[`${id}_d`]];
    return { [`${id}_a`]: a - off.across, [`${id}_d`]: d - off.distance, [`${id}_turn`]: end, [`${id}_do`]: { motion, loop: false, from: 99 } };
  };
  return f;
};
// they walk (steps) from where they are along points, taking `over` seconds, and turn at the end
const walk = (t, id, pts, over, turn, ease = 'inOut') => {
  const f = () => {
    const s = scene.state;
    scene.set(`${id}_steps`, true);
    scene.path([`${id}_a`, `${id}_d`], [[s[`${id}_a`], s[`${id}_d`]], ...pts], { over, ease });
  };
  f.ends = () => ({ [`${id}_a`]: pts.at(-1)[0], [`${id}_d`]: pts.at(-1)[1], [`${id}_steps`]: true });
  return [[t, f], ...(turn != null ? [[t + over, `${id}_turn`, turn]] : [])];
};
// a child sitting goes down the bank — moved as they sit, no steps — to across x, over `over` seconds
const slide = (t, id, x, over, ease) => [[t, `${id}_steps`, false], [t, `${id}_a`, x, over, ease]];
// a flight off the lip: from where they leave it (across x0) to where they land (x1), up a little and down onto the land
// there — how high over the land they are as their across goes (the row that moves them says how fast; `over` — its
// seconds: they are down by then)
const flying = {};
for (const id of ['david', 'sophie']) scene.on('move', `${id}_a`, a => {
  const f = flying[id];
  if (!f || a <= f.x0) return;
  const u = Math.min(1, (a - f.x0) / (f.x1 - f.x0)), h = f.h0 + (f.h1 - f.h0) * u + 4 * f.up * u * (1 - u);
  scene.set(`${id}_e`, Math.max(0, h - L.groundAt(a)));
});
const fly = (id, x0, x1, over, up = 0.14) => {
  const f = () => {
    const mine = flying[id] = { x0, x1, up, h0: L.groundAt(x0), h1: L.groundAt(x1) };
    scene.after(over, () => { if (flying[id] === mine) { flying[id] = null; scene.set(`${id}_e`, 0); } });
  };
  f.ends = () => ({ [`${id}_e`]: 0 });
  return f;
};
// a nod: the head down a little toward what they look at and up again, `n` times (from second t)
const nod = (t, id, at, n = 1) => Array.from({ length: n }, (_, i) => [
  [t + i * 0.55, `${id}_look`, lower(at, 0.32)], [t + i * 0.55 + 0.28, `${id}_look`, at],
]).flat();
// a wave: the hand up over the head, on the side they face, to and fro `n` times
const wave = (id, n = 3) => {
  const f = () => {
    const s = scene.state, a = s[`${id}_a`], d = s[`${id}_d`], h = L.groundAt(a) + 1.25, side = s[`${id}_turn`] === 270 ? -1 : 1;
    for (let i = 0; i <= 2 * n; i++) scene.after(i * 0.32, () => P(id).reach({ r: [a + side * 0.15 + (i % 2 ? 0.18 : -0.05), d - 0.12, h] }));
    scene.after(2 * n * 0.32 + 0.3, () => P(id).reach(null));
  };
  f.ends = () => ({ [`${id}_reach`]: null });
  return f;
};
const lower = (at, by) => (typeof at === 'string' ? `${at}#chest` : [at[0], at[1], at[2] - by]);

// the shoe: on her foot, in his hands, in hers — and the foot bare once it is off (the stocking)
const shod = () => {
  const s = scene.get('shoe');
  P('david').with(s === 'david' ? ['shoe'] : null);
  P('sophie').with(s === 'sophie' ? ['shoe'] : null);
  P('sophie').wear(s === 'on' ? null : { barefoot: 'right' });
};
// the light on the people: the sun by day, the moon at night
const lit = () => { const n = scene.get('night') ?? 0; scene.set('sun_light', (scene.get('sun') ?? 1) * (1 - n)); scene.set('moon_light', n); };
scene.on('change', 'shoe', shod);
scene.on('change', 'night', lit);
scene.on('change', 'sun', lit);

// his hands at the knot, the shoe off; her foot free, her knee drawn up (t — the beat's second it starts; he is on his
// knees by her foot already)
const unlace = t => [
  [t, 'david_do', loop('kneel_work')], [t, 'david_reach', { r: 'sophie#foot_r', l: 'sophie#foot_r' }], [t, 'david_look', 'sophie#foot_r'],
  [t + 2.8, 'shoe', 'david'], [t + 2.8, 'sophie_do', loop('knee_up_sit')], [t + 2.8, 'sophie_reach', null], [t + 2.8, 'sophie_look', null],
  [t + 2.9, 'david_reach', null], [t + 3.3, 'david_do', loop('sit_heels')],
];
// the close-up of the foot: six toes (hide — her hand pulls the hem over it)
const toes = hide => at(45.8, [
  [45.8, 'cu_a', 1.95], [45.8, 'cu_d', 4.0], [45.9, 'closeup', 1, 0.8, 'out'], [45.9, 'cu_pull', 0], [46, 'cu_pull', 1, 4.0, 'smooth'],
  [48.2, 'cu_wig', 1, 0.3], [49.2, 'cu_wig', 0, 0.3],
  ...(hide ? [[49.3, 'cu_hide', 1, 1.4, 'inOut'], [49.6, 'sophie_do', loop('hug_knees')], [49.6, 'foot_hidden', 1]]
    : [[49.9, 'cu_wig', 0.6, 0.25], [50.3, 'cu_wig', 0, 0.3]]),
  [49.6, 'sophie_look', 'david'], [49.7, 'david_look', 'sophie'],
  [51.3, 'closeup', 0, 0.8, 'in'],
]);
// the rider on the meadow behind them: SEEN — where he could see the foot (the game: the hooves come too late
// once he is there); he rides on to the right and away up the path
const SEEN = [-4, 10.5];
const rideOn = (t, [a, d]) => [
  [t, 'r_face', 90, 1.0], [t + 0.4, 'r_look', null],
  [t + 0.6, ['r_a', 'r_d'], { path: [[a, d], [a + 4, d + 0.4], [8.6, 12.4], [11.2, 18], [12.8, 26]] }, 13, 'in'],
  [t + 5.6, 'r_face', 150, 2.0],
];
// she is carried off up the path: the walk goes on into the next beat (a row that only starts it)
const UP = [[2.65, 5.15], [5.6, 8.6], [8.2, 14], [10.6, 22], [12.6, 31]];
const walkOff = (over, ease) => {
  const f = () => scene.path(['mother_a', 'mother_d'], UP, { over, ease });
  f.ends = () => ({ mother_a: UP.at(-1)[0], mother_d: UP.at(-1)[1] });
  return f;
};
// the mother kneels by her, takes her up in her arms, stands, turns to the path (t: as she begins to lift her) — held by the
// waist, facing her, her mother's arms round her back
const HELD = { at: 'mother#hands', up: -0.22 };
// the mother kneels by her, takes her up in her arms, stands, turns to the path (t: as she begins to lift her)
const lift = t => [
  [t, 'mother_do', { motion: 'lift_child', loop: false }], [t, 'sophie_on', HELD], [t, 'sophie_turn', 180],
  [t, 'sophie_do', loop('carried')], [t, 'sophie_steps', false], [t, 'mother_reach', null],
  [t + 2.9, 'mother_do', loop('carry_stand')], [t + 2.9, 'mother_gait', 'carry_walk'],
];

const B = {
  // 1. Дэвид один катится; появляется Софи; катится она; с разбегу — на камни
  play: { rows: [
    // (he goes down the bank sitting, faster and faster, off the lip into the sand, laughing)
    ...slide(1.7, 'david', 1.0, 1.65, 'in'), [1.7, fly('david', L.lipA, 1.0, 1.65)],
    [2.85, 'david_do', 'land_cheer'], [2.9, 'david_look', null],
    [3.35, 'puff_a', 1.0], [3.35, 'puff', 0], [3.36, 'puff', 1, 1.4, 'out'],
    [4.3, 'david_do', loop('sit_laugh')],
    // (up on the top, she stands up out of the grass)
    [5.6, once('sophie', 'stand_from_kneel', 90)],
    [6.9, 'david_look', 'sophie'],
    ...walk(8.0, 'sophie', [[-3.0, Z]], 0.6, 90),
    [9.0, once('david', 'get_up_ground', 270)],
    [10.4, 'david_do', 'beckon'],
    [10.6, 'sophie_look', down(-3.0, 90)], [11.8, 'sophie_look', 'david'],
    // (to the edge, down onto her seat, a shuffle forward — and down the bank)
    ...walk(12.2, 'sophie', [[-2.3, Z]], 0.9, 90),
    [13.2, once('sophie', 'sit_down_ground', 90)], [13.3, 'sophie_look', down(-2.3, 90)],
    [14.4, 'sophie_do', loop('sit_lean_back')], ...slide(14.4, 'sophie', -1.95, 0.5, 'inOut'),
    ...walk(12.8, 'david', [[2.25, Z]], 1.4, 270), [14.6, 'david_look', 'sophie'],
    [14.7, 'sophie_look', 'david'],
    ...slide(15.2, 'sophie', 1.45, 1.7, 'in'), [15.2, fly('sophie', L.lipA, 1.45, 1.7)],
    [16.4, 'sophie_do', 'land_cheer'],
    [16.9, 'puff2_a', 1.45], [16.9, 'puff2', 0], [16.91, 'puff2', 1, 1.4, 'out'],
    [17.5, 'sophie_do', loop('sit_laugh')], [17.3, 'david_do', 'laugh_stand'],
    // (up again, «ещё!» — she points up the bank, runs to it and climbs, bent, to the top)
    [19.6, once('sophie', 'get_up_ground', 270)],
    [20.9, 'sophie_do', 'point_up'], [21.3, 'sophie_look', TOP],
    ...walk(22.1, 'sophie', [[0.35, Z]], 0.7, 270, 'in'),
    [22.8, 'sophie_gait', 'climb'], ...walk(22.8, 'sophie', [[-2.3, Z]], 2.6, 270, 'linear'), [25.4, 'sophie_gait', null],
    ...walk(25.4, 'sophie', [[-3.0, Z]], 0.6, 90, 'out'),
    [25.6, 'sophie_look', 'david'], [26.1, 'sophie_look', down(-3.0, 90)],
    [21.4, 'david_look', 'sophie'], ...walk(22.6, 'david', [[3.35, Z]], 1.0, 270), [23.8, 'david_look', TOP],
    // (a run at the edge, and she throws herself down on her seat: down the bank, off the lip, far — onto the stones)
    ...walk(26.4, 'sophie', [[-2.25, Z]], 1.0, 90, 'in'), [26.4, 'sophie_look', null],
    [27.45, 'sophie_do', loop('sit_lean_back')], ...slide(27.45, 'sophie', 2.1, 1.35, 'linear'), [27.45, fly('sophie', L.lipA, 2.1, 1.35, 0.32)],
    [28.0, 'sophie_do', 'land_cheer'],
  ] },
  // 2. Нога застряла; он тянет; тянется к башмаку — она не даёт, плачет (здесь игра спрашивает, как с ней заговорить)
  stuck: { after: 'play', rows: at(28.8, [
    [28.8, 'sophie_do', loop('stuck_sit')], [28.8, 'sophie_reach', { foot_r: FOOT }],
    [28.8, 'ring_a', 2.72], [28.8, 'ring', 0], [28.81, 'ring', 1, 1.8, 'out'],
    [28.8, 'puff_a', 2.0], [28.8, 'puff', 0], [28.81, 'puff', 1, 1.0, 'out'],
    [29, 'david_look', 'sophie'],
    [29.3, 'camera_x', 1.95, 3.2, 'smooth'], [29.3, 'camera_z', 2.0, 3.2, 'smooth'], [29.3, 'camera_look', 0.1, 3.2],
    [29.7, 'sophie_look', FOOT], [30.1, 'sophie_do', loop('tug')],
    [30.3, once('david', 'kneel_down', 270, BY_FOOT)], [31.1, 'david_look', FOOT],
    [32.3, 'sophie_do', loop('cry_sit')], [32.3, 'sophie_look', null],
    [32.2, 'david_do', loop('kneel_pull')], [32.2, 'david_reach', { r: 'sophie#foot_r', l: 'sophie#foot_r' }],
    [35.5, 'sophie_do', 'refuse'], [35.5, 'sophie_look', 'david'],
    [35.9, 'david_reach', null], [36, 'david_do', loop('sit_heels')], [36.1, 'david_look', 'sophie'],
    [37.4, 'sophie_do', loop('cry_sit')], [37.4, 'sophie_look', null],
  ]) },
  // 3. Она сдаётся без слов: смотрит на ногу, на него, кивает, отворачивается, закрыв лицо; он снимает башмак
  let: { after: 'stuck', rows: at(37.4, [
    [39.3, 'sophie_do', loop('stuck_sit')], [39.5, 'sophie_look', FOOT], [40.3, 'sophie_look', 'david'], ...nod(40.9, 'sophie', 'david'),
    [42.1, 'sophie_do', loop('turn_away_sit')], [42.1, 'sophie_look', null],
    ...unlace(42.4),
  ]) },
  // — Тебе больно? Она кивает сквозь слёзы («Больно. Только не смотри на неё.») и отворачивается, закрыв лицо
  talk_hurt: { after: 'stuck', rows: [
    [0.2, 'david_do', loop('kneel')], [0.2, 'david_look', 'sophie'],
    [1.9, 'sophie_look', 'david'], ...nod(2.6, 'sophie', 'david', 2),
    [4.6, 'sophie_look', FOOT], [5.0, 'sophie_do', loop('stuck_sit')],
    [6.6, 'sophie_do', loop('turn_away_sit')], [6.6, 'sophie_look', null],
    [7.0, 'david_look', FOOT],
    ...unlace(7.6),
  ] },
  // — Ты чья? Слёзы обрываются; она садится прямо и смотрит на него («Уэндеров. Мы за холмом живём.»);
  // сама показывает на ногу, кивает и смотрит, как он развязывает; только когда нога голая — отворачивается
  talk_whose: { after: 'stuck', rows: [
    [0.2, 'david_look', 'sophie'],
    [1.8, 'sophie_do', loop('sit_up_straight')], [1.9, 'sophie_look', 'david'],
    [6.6, 'sophie_reach', { foot_r: FOOT, r: [FOOT[0] - 0.1, Z - 0.1, 0.35] }], [6.7, 'sophie_look', FOOT], [7.4, 'sophie_reach', { foot_r: FOOT }],
    [7.6, 'sophie_look', 'david'], ...nod(7.9, 'sophie', 'david'),
    ...unlace(8.6),
  ] },
  // молча сесть рядом: он встаёт, обходит её и садится плечом к плечу, смотрит на воду; она плачет, стихает,
  // смотрит на него, кивает на ногу; он возвращается к ноге — она развязывает шнурок вместе с ним
  talk_sit: { after: 'stuck', rows: [
    [0.3, once('david', 'stand_from_kneel', 270)], [0.4, 'david_look', 'sophie'],
    ...walk(1.6, 'david', [[2.75, 5.5], [2.1, 5.6], [1.6, 5.3]], 2.4, 155),
    [4.2, once('david', 'sit_down_ground', 155)], [4.3, 'david_look', FOOT],
    [6.7, 'david_do', loop('sit_knees')],
    [7.0, 'sophie_do', loop('stuck_sit')],
    [7.5, 'sophie_look', 'david'],
    [8.6, 'david_look', 'sophie'],
    [9.6, 'sophie_look', FOOT], ...nod(10.1, 'sophie', FOOT),
    [10.9, once('david', 'get_up_ground', 155)],
    ...walk(12.4, 'david', [[2.5, 4.55], [3.4, 4.75]], 1.6, 270),
    [14.5, once('david', 'kneel_down', 270, BY_FOOT)], [15.5, 'david_do', loop('kneel_work')], [15.5, 'david_reach', { r: 'sophie#foot_r', l: 'sophie#foot_r' }],
    [15.5, 'sophie_reach', { foot_r: FOOT, r: 'sophie#foot_r' }], [15.6, 'david_look', 'sophie#foot_r'], [15.6, 'sophie_look', 'sophie#foot_r'],
    [17.2, 'shoe', 'david'], [17.2, 'sophie_do', loop('knee_up_sit')], [17.2, 'sophie_reach', null], [17.2, 'sophie_look', null],
    [17.3, 'david_reach', null], [17.6, 'david_do', loop('sit_heels')],
  ] },
  // 4. Крупно: шесть пальцев; она натягивает подол на ступню
  toes: { after: ['let', 'talk_hurt', 'talk_whose', 'talk_sit'], rows: toes(true) },
  // крупно, а нога так и остаётся голой (игра: копыта ещё впереди)
  toes_bare: { after: ['let', 'talk_hurt', 'talk_whose', 'talk_sit'], rows: toes(false) },
  // копыта: она замирает и смотрит; за ручьём, по лугу шагом едет всадник — к тому месту, откуда видно камни
  ridge: { after: 'toes_bare', rows: [
    [0, 'camera_x', 1.5, 2.6, 'smooth'], [0, 'camera_z', 1.1, 2.6, 'smooth'], [0, 'camera_look', 0.06, 2.6],
    [2.0, 'r_vis', 1],
    [2.0, ['r_a', 'r_d'], { path: [[-18, 17], [-11, 13], SEEN] }, 9.5, 'linear'],
    [3.6, 'sophie_do', loop('sit_knees')], [3.6, 'sophie_look', 'rider'],
    [4.6, 'david_look', 'rider'],
  ] },
  // он натягивает ей подол на ступню: она подтягивает колени (игра: успел)
  cover: { after: 'ridge', rows: [
    [0, 'david_do', loop('kneel')], [0, 'david_reach', { r: 'sophie#foot_r', l: 'sophie#foot_r' }], [0, 'david_look', 'sophie#foot_r'],
    [0.5, 'sophie_do', loop('hug_knees')], [0.7, 'foot_hidden', 1, 0.5], [0.9, 'david_reach', null], [1.0, 'david_do', loop('sit_heels')],
    [1.4, 'david_look', 'rider'], [1.2, 'sophie_look', 'rider'],
  ] },
  // всадник не обернулся: едет дальше, вверх по тропинке
  ridge_pass: { after: 'cover', rows: [
    ...rideOn(0, SEEN),
    [7.0, 'sophie_look', 'david'], [7.6, 'david_look', 'sophie'],
  ] },
  // не успел: всадник придерживает коня напротив них, поворачивает его к ручью и долго смотрит на них;
  // Дэвид поздно натягивает подол; потом всадник едет дальше
  ridge_stop: { after: 'ridge', rows: [
    [0, ['r_a', 'r_d'], { path: [SEEN, [-1, 10.1], [1.2, 9.9]] }, 4.0, 'out'],
    [2.8, 'r_face', 15, 1.4], [3.2, 'r_toss', 1, 0.3], [4.2, 'r_toss', 0, 0.8],
    [3.4, 'r_look', 'children'],
    [4.6, 'david_do', loop('kneel')], [4.6, 'david_reach', { r: 'sophie#foot_r', l: 'sophie#foot_r' }], [4.6, 'david_look', 'sophie#foot_r'],
    [5.1, 'sophie_do', loop('hug_knees')], [5.3, 'foot_hidden', 1, 0.6], [5.5, 'david_reach', null], [5.6, 'david_do', loop('sit_heels')],
    [6.0, 'david_look', 'rider'], [5.8, 'sophie_look', 'rider'],
    ...rideOn(9.0, [1.2, 9.9]),
    [15.5, 'sophie_look', 'david'], [16.0, 'david_look', 'sophie'],
  ] },
  // 5. Обещание: она, обхватив колени, тянет к нему руку
  ask: { after: ['toes', 'ridge_pass', 'ridge_stop'], rows: at(52.1, [
    [52.9, 'sophie_reach', { r: 'david#chest' }],
  ]) },
  // он — палец к губам, кивает; отдаёт ей башмак
  promise: { after: 'ask', rows: at(53.5, [
    [54.1, 'david_do', 'shush'],
    [56.3, 'sophie_reach', null],
    [56.9, 'david_reach', { r: 'sophie#hands' }],
    [57.7, 'sophie_reach', { r: 'david#hand_r' }], [58.2, 'shoe', 'sophie'], [58.3, 'sophie_reach', null], [58.4, 'david_reach', null],
    [58.4, 'david_do', loop('sit_heels')],
  ]) },
  // 6. Мать ищет её, бежит вниз, обнимает; рука находит ногу под подолом; мать поднимает глаза на Дэвида
  mother: { after: 'promise', rows: at(58.7, [
    [58.7, 'sun', 0.85, 16, 'linear'],
    [58.7, 'camera_z', 0.9, 3.0, 'smooth'], [58.7, 'camera_x', 2.6, 3.0, 'smooth'], [58.7, 'camera_look', 0.04, 3.0],
    // (out of the house, down the path; she stops and looks for her, a hand over her eyes)
    [58.7, 'mother_here', true], ...walk(58.7, 'mother', [[9.6, 19]], 1.6, 300),
    [60.3, 'mother_do', loop('shade')], [60.3, 'mother_look', [2.6, Z, 0.8]],
    [59.3, 'sophie_do', 'try_stand'], [61.0, 'sophie_do', loop('hug_knees')],
    [60.5, once('david', 'stand_from_kneel', 270)],
    [60.9, 'sophie_look', 'mother'], [61.3, 'david_look', 'mother'],
    [61.7, wave('sophie')],
    [62.2, 'mother_look', 'sophie'], [62.4, 'mother_do', 'stand'],
    ...walk(62.9, 'mother', [[8.2, 14], [5.6, 8.6], [3.4, 6.2]], 4.6, 225),
    ...walk(63.7, 'david', [[3.7, Z]], 1.0, 270), [65.1, 'david_look', 'mother'],
    [63.0, 'sophie_do', loop('hug_knees')],
    // (down on her knees by her, her arms round her)
    [67.5, once('mother', 'kneel_hug', 225, BY_HER)], [68.0, 'mother_look', 'sophie'],
    [69.1, 'sophie_do', loop('cry_sit')], [69.1, 'sophie_look', null],
    [68.9, 'camera_z', 1.5, 2.5, 'smooth'], [68.9, 'camera_x', 2.3, 2.5, 'smooth'],
    [70.4, 'mother_do', loop('kneel')], [70.4, 'mother_reach', { r: 'sophie#chest', l: 'sophie#chest' }],
    // (her hand finds the foot under the hem — and stops)
    [71.3, 'mother_reach', { r: 'sophie#foot_r', l: 'sophie#chest' }], [71.3, 'mother_look', 'sophie#foot_r'],
    [71.7, 'sophie_do', loop('hug_knees')], [71.9, 'sophie_look', 'mother'],
    [73.5, 'mother_look', 'david'], [73.9, 'mother_reach', null],
  ]) },
  // он — палец к губам, кивает; она кивает в ответ; поднимает Софи и уносит; Софи смотрит назад
  nod: { after: 'mother', rows: at(74.7, [
    [74.7, 'sun', 0.78, 11, 'linear'],
    [75.5, 'david_do', 'shush_stand'],
    ...nod(77.7, 'mother', 'david'),
    [78.7, 'mother_look', 'sophie'], [78.9, 'mother_reach', { r: 'sophie#chest', l: 'sophie#chest' }],
    ...lift(79.3), [79.3, 'sophie_look', 'david'], [79.4, 'mother_reach', null],
    [82.2, 'mother_look', null], [82.3, walkOff(11.5, 'in')],
    [80.9, 'david_look', 'mother'], ...walk(82.5, 'david', [[4.0, Z]], 0.8, 270),
    [81.1, 'camera_z', 0, 4.5, 'smooth'], [81.1, 'camera_x', 0.6, 4.5, 'smooth'],
  ]) },
  // он отводит глаза; она смотрит долго, без кивка; прижимает Софи к себе, поднимает и уходит быстро, не оглядываясь;
  // Софи смотрит назад, на него
  away: { after: 'mother', rows: [
    [0, 'sun', 0.78, 11, 'linear'],
    [0.5, 'david_look', down(3.7, 270)], [1.2, 'david_turn', 200],
    [3.6, 'mother_look', 'sophie'], [3.8, 'mother_reach', { r: 'sophie#chest', l: 'sophie#chest' }],
    [4.0, 'sophie_do', loop('cry_sit')], [5.0, 'sophie_do', loop('hug_knees')],
    [5.4, 'mother_reach', null],
    ...lift(5.6), [5.6, 'sophie_look', 'david'],
    [8.5, 'mother_look', null], [8.6, walkOff(9, 'inOut')],
    [8.3, 'david_turn', 270], [8.6, 'david_look', 'mother'],
    [8.6, 'camera_z', 0, 4.5, 'smooth'], [8.6, 'camera_x', 0.6, 4.5, 'smooth'],
  ] },
  // 7. Один у ручья: на дальнем гребне всадник; Дэвид садится у воды и смотрит вслед
  alone: { after: ['nod', 'away'], rows: at(83.7, [
    [83.7, 'sun', 0.72, 7, 'linear'],
    [83.7, 'someone_coming', 1, 6, 'smooth'],
    [86.5, 'david_look', RIDGE],
    [88.1, 'david_look', FOOT], [88.3, 'david_turn', 240],
    [88.9, once('david', 'sit_down_ground', 240)], [91.4, 'david_do', loop('sit_knees')],
    [90.5, 'david_look', 'mother'],
  ]) },
  // II. Ночь перед облавой: у ручья в темноте ждёт Софи, поодаль мать с узлом; Дэвид сбегает с насыпи
  night_warn: { rows: [
    [0, 'fade', 0.55, 1.4, 'out'],
    ...walk(0.9, 'david', [[1.35, Z]], 1.6, 90),
    [1.4, 'sophie_look', 'david'], [1.7, 'sophie_turn', 250],
    [2.2, 'mother_look', 'david'], [2.6, 'mother_turn', 290],
    [3.0, 'david_look', 'sophie'],
    ...walk(3.3, 'sophie', [[2.15, Z]], 0.9, 270), ...walk(3.5, 'david', [[1.6, Z]], 0.6, 90),
  ] },
  // она берёт его за руку; мать зовёт; Софи отпускает и уходит с матерью вверх по тропинке; один раз оглядывается
  night_warn_bye: { after: 'night_warn', rows: [
    [0.3, 'sophie_reach', { r: 'david#hand_l' }], [0.6, 'david_reach', { l: 'sophie#hand_r' }],
    [2.3, 'mother_do', 'beckon_woman'],
    [3.0, 'sophie_look', 'mother'], [3.6, 'sophie_reach', null], [3.8, 'david_reach', null],
    ...walk(4.1, 'sophie', [[3.6, 5.6], [4.8, 6.8]], 2.4, 30),
    [4.6, 'mother_look', null],
    ...walk(5.6, 'mother', [[5.6, 8.6], [8.2, 14], [10.6, 22]], 11, 30),
    ...walk(6.5, 'sophie', [[5.0, 8.0], [7.6, 13.4], [10.0, 21.4]], 10.5, 30),
    [6.6, 'sophie_look', null], [9.2, 'sophie_look', 'david'], [11.4, 'sophie_look', null],
    [4.8, 'david_look', 'sophie'],
  ] },
};
// what each beat begins at: the state after the beats that lead to it — worked out as it begins (where a motion done
// once takes someone is the motion's: the people know it once they are here)
const chain = (...names) => names.reduce((st, n) => settle(st, B[n].rows), START);
const from = (name, make) => Object.defineProperty(B[name], 'from', { get: make, enumerable: true });
from('play', () => START);
from('stuck', () => chain('play'));
for (const n of ['let', 'talk_hurt', 'talk_whose', 'talk_sit']) from(n, () => chain('play', 'stuck'));
for (const n of ['toes', 'toes_bare']) from(n, () => chain('play', 'stuck', 'let'));
from('ridge', () => chain('play', 'stuck', 'let', 'toes_bare'));
for (const n of ['cover', 'ridge_stop']) from(n, () => chain('play', 'stuck', 'let', 'toes_bare', 'ridge'));
from('ridge_pass', () => chain('play', 'stuck', 'let', 'toes_bare', 'ridge', 'cover'));
from('ask', () => chain('play', 'stuck', 'let', 'toes'));
from('promise', () => chain('play', 'stuck', 'let', 'toes', 'ask'));
from('mother', () => chain('play', 'stuck', 'let', 'toes', 'ask', 'promise'));
for (const n of ['nod', 'away']) from(n, () => chain('play', 'stuck', 'let', 'toes', 'ask', 'promise', 'mother'));
from('alone', () => chain('play', 'stuck', 'let', 'toes', 'ask', 'promise', 'mother', 'nod'));
const NIGHT = {
  ...START, night: 1, fade: 1, fade_color: '#08101d', sun: 0.72, shoe: 'on', foot_hidden: 1,
  camera_x: 0.6, camera_z: 0.7, camera_look: 0.04,
  david_a: -2.3, david_do: 'stand', david_turn: 90, david_look: down(-2.3, 90), david_steps: true,
  sophie_a: 2.9, sophie_d: 5.2, sophie_do: 'stand', sophie_turn: 30, sophie_look: PATH,
  mother_here: true, mother_a: 5.2, mother_d: 7, mother_do: 'stand', mother_turn: 30, mother_look: PATH, mother_with: ['bundle'],
};
from('night_warn', () => NIGHT);
from('night_warn_bye', () => settle(NIGHT, B.night_warn.rows));
shod(); lit();
scene.kit.film.beats(scene, B, { film: ['play', 'stuck', 'let', 'toes', 'ask', 'promise', 'mother', 'nod', 'alone'] });
