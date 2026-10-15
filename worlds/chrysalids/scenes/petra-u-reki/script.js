// The film in beats (the module film): a game plays them one at a time, a viewer of the world sees `film`.
//   pool        the pool: wide, then a slow push in to Petra; she slips, then cries out — without a sound
//   struck      the far field, from below the bank: Rosalind stops dead among the rakers; nobody else hears
//   edge        the near bank: David bursts in along the top and stops at the edge — he sees her
//   run         down the clay, into the water; the branch snaps, the current takes her; he swims after her, has her
//   field_quiet the far field: the cry has died down — Rosalind alone runs to the river; the rakers never look up
//   field_loud  the far field: the cry hits hard — her hands to her head, the rake falls; the rakers stop and stare,
//               one goes down to the water after her
//   out         back at the pool: he brings Petra back, leads her out by the hand; she sits on the bank and cries,
//               he kneels by her, his hand on her shoulder (Rosalind wades in across the water)
//   bank_quiet  wide, across the water: he and Rosalind hear each other (warm rings); only the rain
//   bank_loud   the same, but the others come along the top, late, and stand staring; the raker at the water's edge
//   home        they look away; Rosalind wades out; David lifts Petra in his arms and carries her up the bank; fade
// While `edge` and `run` play, a game may drive `cry` itself (its minigame «успокоить»): the beats leave it alone.
const S = {
  rain: 0.6, danger: 0.35, branch: 0.2, cry: 0,
  pt_x: 5.3, pt_sink: 0, pt_held: 0, pt_look: 0, pt_wx: 3.3, pt_sit: 0, pt_face: -90, pt_cry: 0,
  dv_a: -17.5, dv_face: 90, dv_swim: 0, dv_wade: 0, dv_kneel: 0, dv_lunge: 0, dv_look: 0, dv_hand: 0, dv_shoulder: 0, dv_scoop: 0, dv_carry: 0,
  ro_x: 6.2, ro_down: 0, ro_face: 90, ro_rake: 1, ro_struck: 0, ro_hands: 0, ro_drop: 0, ro_wade: 0, ro_away: 0,
  heard: 0, stare: 0, follow: 0, bond: 0, crowd: 0, after: 0,
  camera_x: 0, camera_h: 0, camera_z: 0, camera_look: 0, fade: 1,
};
const cut = (at, cam) => Object.entries(cam).map(([k, v]) => [at, 'camera_' + k, v]);
const move = (at, cam, over, ease = 'inOut') => Object.entries(cam).map(([k, v]) => [at, 'camera_' + k, v, over, ease]);
// where a beat leaves the scene: its `from`, then each row's value in the order the rows end
const ends = (from, rows) => {
  const v = { ...from };
  for (const [at, k, x] of rows.filter(r => typeof r[1] === 'string').sort((a, b) => a[0] + (a[3] || 0) - b[0] - (b[3] || 0))) v[k] = x;
  return v;
};
const FIELD = { z: 13.0, x: 5.0, h: 0.35, look: -0.05 };
const B = {};
B.pool = { from: S, rows: [
  [0, 'fade', 0, 2.5, 'out'],
  [0, 'branch', 0.45, 8],
  [0, 'danger', 0.6, 8],
  [0.5, 'pt_look', 1], // she looks to the bank: nobody
  ...move(2.6, { z: 6.3, x: 2.7, look: 0.47 }, 7.4), // the push in
  [3.8, 'pt_look', 2], // then across, to the far field
  [5.4, 'pt_sink', 0.45, 0.35, 'in'], // the current drags her under to the chin
  [5.9, 'pt_sink', 0.02, 0.8, 'out'], // she hauls herself up
  [7.2, 'pt_look', 3], // a breath: the head down…
  [7.7, 'pt_look', 0],
  [7.7, 'cry', 1, 0.6, 'out'], // …and the cry, the head thrown back
] };
B.struck = { after: 'pool', from: ends(B.pool.from, B.pool.rows), rows: [
  ...cut(0, FIELD),
  [0.1, 'heard', 1, 0.8, 'out'],
  [0.6, 'ro_rake', 0, 0.2],
  [0.6, 'ro_struck', 1, 0.25, 'out'], // she stops dead
  [1.1, 'ro_face', 35, 0.8], // turns toward the river: where it comes from
  [1.0, 'cry', 0.65, 3], // the cry goes on, a little less
  [2.6, 'heard', 0.5, 1.4],
] };
B.edge = { after: 'struck', from: ends(B.struck.from, B.struck.rows), rows: [
  ...cut(0, { z: 4.0, x: -6.6, h: 1.6, look: 0.22 }),
  [0, 'heard', 0],
  [0, 'dv_a', -13.2], // (just off the frame, running)
  [0, 'dv_a', -10.5, 0.8, 'linear'], // David bursts in along the top
  [0.8, 'dv_a', -8.7, 1.0, 'out'], // and stops at the edge
  [1.5, 'dv_look', 1, 1.1], // sees her
] };
B.run = { after: 'edge', from: ends(B.edge.from, B.edge.rows), rows: [
  [0, 'dv_a', -7.0, 1.0, 'in'], // down the slope, gathering speed
  [1.0, 'dv_a', -0.5, 1.8, 'linear'], // (a boy's run, not a flight)
  ...move(0, { x: -0.6, z: 3.8, look: 0.14, h: 0 }, 3.4),
  [2.8, 'dv_a', 0.7, 1.2, 'out'],
  [2.6, 'dv_wade', 1, 0.5], // into the water, slowed by it
  [3, 'branch', 1, 0.45, 'in'], // the branch snaps
  [3.2, 'pt_x', 8.2, 4.4, 'out'], // the current takes her downstream
  [3.2, 'pt_sink', 0.9, 1.0, 'in'],
  [4.4, 'pt_sink', 0.55, 0.5, 'out'],
  [5, 'pt_sink', 1, 0.8, 'in'],
  [5.9, 'pt_sink', 0.65, 0.5, 'out'],
  [6.5, 'pt_sink', 1, 0.8, 'in'],
  [7.5, 'pt_sink', 0.6, 0.5, 'out'],
  [4.1, 'dv_lunge', 1, 0.3, 'out'],
  [4.4, 'dv_swim', 1, 0.5],
  [4.7, 'dv_lunge', 0, 0.4], // he throws himself in
  [4.5, 'dv_a', 5.1, 4.2, 'inOut'], // swims after her
  ...move(3.7, { x: 2.5, z: 4.8, look: 0.23 }, 4.8),
  [8.7, 'pt_held', 1],
  [8.7, 'pt_sink', 0], // has her: she comes up clinging to his neck
  [9, 'dv_face', -90, 1.0], // he turns in the water
] };
const afterRun = ends(B.run.from, B.run.rows);
B.field_quiet = { after: 'run', from: afterRun, rows: [
  ...cut(0, FIELD),
  [0, 'heard', 0.35, 0.6, 'out'],
  [0, 'cry', 0, 2.5], // she has quieted: what reaches the field is faint
  [0.4, 'ro_face', 0, 0.8], // Rosalind turns to the river
  [0.6, 'ro_struck', 0, 0.6],
  [1.0, 'ro_drop', 1, 0.75, 'in'], // lets the rake fall
  [1.4, 'ro_down', 1, 3.0, 'inOut'], // and runs down to it
  [2.0, 'heard', 0, 2.0],
] };
B.field_loud = { after: 'run', from: afterRun, rows: [
  ...cut(0, FIELD),
  [0, 'heard', 1, 0.5, 'out'],
  [0, 'cry', 1, 0.5, 'out'], // the cry at its loudest
  [0.3, 'ro_hands', 1, 0.45, 'out'],
  [0.3, 'ro_struck', 0, 0.45], // hands to her head: it is inside her
  [0.6, 'ro_drop', 1, 0.75, 'in'], // the rake falls
  [0.5, 'stare', 1, 1.0], // the rakers stop and look at her: they hear nothing, they see her
  [2.2, 'ro_hands', 0, 0.35],
  [2.2, 'ro_face', 0, 0.5],
  [2.5, 'ro_down', 1, 3.0, 'inOut'], // she runs down to the river
  [3.3, 'follow', 1, 4.0, 'inOut'], // and one of them goes down after her
  [3.0, 'heard', 0.4, 2.0],
] };
B.out = { after: ['field_quiet', 'field_loud'], from: ends(B.field_quiet.from, B.field_quiet.rows), rows: [
  ...cut(0, { x: 2.5, z: 4.8, look: 0.23, h: 0 }),
  [0.2, 'dv_a', 0.5, 4.2, 'inOut'], // brings her back
  ...move(0, { x: 0.6, z: 4.4, look: 0.2 }, 5),
  [1.0, 'ro_wade', 1, 2.5], // across the water, Rosalind wades in
  [3.0, 'cry', 0, 3], // (if she was still crying out, she stops now)
  [4.3, 'dv_swim', 0, 0.7],
  [4.3, 'pt_wx', 3.4],
  [4.5, 'dv_hand', 1, 0.5], // finds his feet; she stands, her hand in his
  [5.2, 'dv_a', -0.4, 2.4, 'inOut'],
  [5.4, 'pt_wx', 2.4, 2.4, 'inOut'], // he leads her out
  [6.6, 'dv_wade', 0, 0.8],
  [7.6, 'dv_a', -1.25, 1.4, 'inOut'],
  [7.8, 'pt_wx', 1.75, 1.3, 'inOut'], // up onto the bank
  [9.0, 'dv_face', 90, 0.6],
  [9.2, 'pt_sit', 1, 0.9],
  [9.2, 'pt_face', -20, 0.8], // she sits down; he turns to her
  [9.4, 'dv_hand', 0, 0.4],
  [9.5, 'dv_kneel', 1, 1.2], // goes down on one knee by her
  ...move(8.7, { x: -0.9, z: 5.3, look: 0.24 }, 3.5), // closer, while she cries
  [9.9, 'pt_cry', 1, 0.8], // only now she cries, her face in her hands
  [10.7, 'dv_shoulder', 1, 0.9], // his hand on her shoulder
  [0, 'rain', 0.35, 12],
] };
const ACROSS = [
  ...cut(0, { z: 1.4, x: 0.5, h: 1.1, look: 0.17 }),
  [0.8, 'bond', 1, 2], // they hear each other
  ...move(2.0, { z: 3.2, x: 0.4, h: 0.8, look: 0.15 }, 11),
];
B.bank_quiet = { after: 'out', from: ends(B.out.from, B.out.rows), rows: ACROSS };
B.bank_loud = { after: 'out', from: { ...ends(B.out.from, B.out.rows), stare: 1, follow: 1 }, rows: [
  ...ACROSS,
  [2.5, 'crowd', 1, 12, 'linear'], // the others come along the top, late
] };
B.home = { after: ['bank_quiet', 'bank_loud'], from: ends(B.bank_quiet.from, B.bank_quiet.rows), rows: [
  [0, 'bond', 0, 1.5],
  [0.2, 'after', 1, 1.5], // the two look away
  [0.4, 'ro_face', 160, 1.2], // Rosalind turns her back and wades out, slowly
  [0.6, 'ro_away', 1, 1.5],
  [0.9, 'ro_wade', 0, 3],
  [0.9, 'ro_down', 0.8, 3.4, 'inOut'],
  [1.0, 'dv_shoulder', 0, 0.6],
  [1.2, 'pt_cry', 0, 0.8], // she lifts her face
  [1.9, 'dv_kneel', 0, 1.0],
  [1.9, 'dv_scoop', 1, 1.0], // he gets his arms under her
  [3.0, 'dv_carry', 1, 1.2],
  [3.0, 'dv_scoop', 0, 1.2], // and rises with her in his arms
  [4.4, 'dv_face', -90, 0.9],
  [4.9, 'dv_a', -6.4, 7.5, 'inOut'], // up the bank, home
  ...move(3.0, { z: 2.6, x: -0.6, h: 0.9, look: 0.15 }, 9),
  [11.2, 'fade', 1, 2.5, 'in'],
] };
scene.kit.film.beats(scene, B, { film: ['pool', 'struck', 'edge', 'run', 'field_loud', 'out', 'bank_loud', 'home'] });
