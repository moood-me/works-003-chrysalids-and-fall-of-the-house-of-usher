// «Корабль из Зеландии» — the film in beats (module film; notes.md tells them). The world's viewer sees
// `film`; the game plays the beats one at a time, its choices picking the branches.
const s = scene;

// ---- where everything begins: the children behind the stone at the cave, the fight on the clearing ----
const PEOPLE = {
  //        across, distance, height, facing, pose
  david: [-2.3, 8.25, 1, 90, 'kneel'],
  petra: [-3.15, 8.45, 1, 90, 'crouch'],
  rosalind: [-3.9, 8.65, 1, 90, 'kneel'],
  michael: [-4.9, 8.95, 1, 90, 'crouch'],
  joseph: [-0.6, 14.2, 0, 90, 'point'],
  w1: [1.3, 16.4, 0, 90, 'kneel_aim'],
  w2: [2.6, 19.6, 0, 90, 'aim_rifle'],
  w3: [-3.6, 18.6, 0, 90, 'aim_rifle'],
  spider: [8.8, 19.6, 0, -90, ''],
  sophie: [12.6, 24.2, 0, -90, ''],
  f2: [9.4, 16, 0, -90, 'draw_bow'],
  f3: [14.8, 25.5, 0, -90, 'draw_bow'],
  sealand: [3, 20.3, 1, 0, ''],
};
const START = {
  dawn: 0.38, smoke: 0.8, fight: 1, fall: 0, web: 0, cave_web: 0, spin: 0, door: 0, dust: 0, spray: 0,
  ship_a: 150, ship_d: 330, ship_h: 95, ship_vis: 0, ship_tilt: 0.16,
  arrow_a: 6.3, arrow_d: 17.5, arrow_h: 1.6, arrow_vis: 0,
  horse_a: -2.9, horse_d: 15.6, horse_f: 90, horse_w_rear: 0,
  camera_x: -3.3, camera_z: 3.6, camera_h: 0.35, camera_look: 0, fade: 0,
  david_w_reach: 0,
};
for (const [id, [a, d, h, f, p]] of Object.entries(PEOPLE)) {
  Object.assign(START, { [id + '_a']: a, [id + '_d']: d, [id + '_h']: h, [id + '_f']: f, [id + '_p']: p,
    [id + '_look']: '', [id + '_hr']: '', [id + '_hl']: '', [id + '_hide']: 0, [id + '_dead']: 0, [id + '_th']: -1, [id + '_still']: 0, [id + '_fire']: 0 });
}
START.sealand_hide = 1;

// ---- writing a beat: rows at the film's own seconds (O — where this beat starts in them) ----
const BEATS = {}, END = {};
let rows, pos, O;
function beat(name, after, from, at, build) {
  const st = { ...(after ? END[[].concat(after)[0]] : START), ...from };
  rows = []; pos = {}; O = at;
  for (const k in st) { const m = k.match(/^(.*)_a$/); if (m && typeof st[m[1] + '_d'] === 'number') pos[m[1]] = [st[k], st[m[1] + '_d'], st[m[1] + '_h'] || 0]; }
  build();
  const end = { ...st }; // where it ends: each key's last value (the last row begun wins)
  for (const [, k, v] of [...rows].sort((x, y) => x[0] - y[0])) {
    if (Array.isArray(k)) k.forEach((key, i) => (end[key] = v.path[v.path.length - 1][i]));
    else end[k] = v && typeof v === 'object' ? v.turn : v;
  }
  BEATS[name] = { after, from: st, rows };
  END[name] = end;
}
const set = (t, k, v, o, e) => rows.push([Math.max(0, t - O), k, v, o, e]);
const turn = (t, id, deg, o = 0.6, e = 'smooth') => rows.push([Math.max(0, t - O), id + '_f', { turn: deg }, o, e]);
const pose = (t, id, p) => set(t, id + '_p', p);
const face = (a, d, a2, d2) => (Math.atan2(a2 - a, -(d2 - d)) * 180) / Math.PI;
// walk along points [[a, d, h?], …] from second t, one smooth movement (scene.path), turning toward each leg as it
// comes; v m/s on average (≥ 2 runs); o: { over (seconds), noTurn, face (hold this facing), ease } → { end, over }
function go(t, id, pts, v = 1.2, o = {}) {
  const P = [pos[id]];
  for (const q of pts) P.push([q[0], q[1], q[2] ?? P[P.length - 1][2]]);
  const seg = [];
  let L = 0;
  for (let i = 1; i < P.length; i++) { const l = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1], (P[i][2] - P[i - 1][2]) * 1.5); seg.push([L, l]); L += l; }
  const over = o.over ?? Math.max(0.6, (L / v) * 1.2), lead = o.noTurn ? 0 : 0.3;
  const useH = P.some(q => q[2] !== P[0][2]);
  if (!o.noTurn) seg.forEach(([s0, l], i) => {
    if (l < 0.05) return;
    const u = Math.acos(1 - 2 * (L > 0 ? s0 / L : 0)) / Math.PI; // when the smooth movement reaches this leg
    turn(t + (i ? lead + over * u - 0.25 : 0), id, o.face ?? face(P[i][0], P[i][1], P[i + 1][0], P[i + 1][1]), i ? 0.45 : 0.5);
  });
  const keys = useH ? [id + '_a', id + '_d', id + '_h'] : [id + '_a', id + '_d'];
  if (L > 0.01) rows.push([Math.max(0, t + lead - O), keys, { path: P.slice(1).map(q => q.slice(0, keys.length)) }, over, o.ease || 'smooth']);
  pos[id] = P[P.length - 1];
  return { end: t + lead + over, over };
}
const fire = (t, id) => { set(t, id + '_fire', 0); set(t + 0.01, id + '_fire', 1, 1.6, 'linear'); set(t + 1.7, id + '_fire', 0); };
const cam = (t, x, z, h, over = 0, look) => {
  set(t, 'camera_x', x, over, 'inOut'); set(t, 'camera_z', z, over, 'inOut'); set(t, 'camera_h', h, over, 'inOut');
  if (look != null) set(t, 'camera_look', look, over, 'inOut');
};
const CHILDREN = [-3.3, 3.6, 0.35], CLEARING = [2.2, 7.5, 0.15];

// ===== cave: close on the children behind the stone. A shot — Petra hides in Rosalind's arms =====
beat('cave', null, {}, 0, () => {
  set(0.6, 'david_w_reach', 0.55, 0.8);
  set(0.8, 'david_look', 8);
  fire(1.4, 'w1');
  pose(1.75, 'petra', 'crouch,cower');
  turn(1.9, 'petra', -80, 0.5);
  pose(2.3, 'petra', 'kneel,hug');
  set(2.0, 'rosalind_look', 'petra:head');
  set(2.1, 'rosalind_hr', 'petra:back');
  set(3.0, 'michael_look', 6);
  fire(3.9, 'w2');
  set(4.6, 'rosalind_look', 10);
});

// ===== fight: the whole clearing; Joseph commands; the tall one (Spider) draws on him — he falls.
// Ends on the children: David staring at his father =====
beat('fight', 'cave', {}, 5, () => {
  cam(5.0, 0, 0, 0, 4.8);
  fire(6.0, 'w3');
  pose(6.6, 'joseph', 'raise');
  fire(7.4, 'w1');
  pose(8.4, 'joseph', 'point');
  fire(9.6, 'w2');
  fire(10.8, 'w3');
  go(9.4, 'spider', [[6.8, 17.6]], 1.2);
  turn(11.4, 'spider', face(6.8, 17.6, -0.6, 14.2), 0.5);
  pose(11.6, 'spider', 'draw_bow');
  set(12.5, 'arrow_vis', 1);
  set(12.5, 'arrow_a', -0.45, 0.65, 'linear');
  set(12.5, 'arrow_d', 14.25, 0.65, 'linear');
  set(12.5, 'arrow_h', 1.45, 0.65, 'linear');
  set(13.15, 'arrow_vis', 0);
  pose(13.0, 'spider', '');
  cam(9.4, ...CLEARING);
  // Joseph: struck — staggers, down on his knees, forward onto his face (the recording)
  turn(13.1, 'joseph', 60, 0.3);
  pose(13.15, 'joseph', 'collapse');
  set(15.0, 'joseph_dead', 1);
  set(13.2, 'horse_w_rear', 1, 0.4, 'out');
  set(14.1, 'horse_w_rear', 0, 0.5);
  turn(14.0, 'horse', -90, 0.4);
  set(14.3, 'horse_a', -16, 2.8, 'in');
  set(14.3, 'horse_d', 16.2, 2.8, 'in');
  // cut: the children. David comes up off the stone, his eyes on his father; Rosalind's on him
  cam(15.6, ...CHILDREN);
  set(15.0, 'david_look', 'joseph:head');
  set(15.7, 'david_w_reach', 0, 0.5);
  pose(15.7, 'david', 'kneel,freeze');
  set(16.3, 'rosalind_look', 'david:head');
  set(16.3, 'rosalind_hr', '');
  pose(16.6, 'petra', 'crouch,cower');
  set(16.7, 'petra_look', 'david:head');
});

// ===== hold: David jumps up toward his father — Rosalind catches his shoulder and pulls him down;
// on the clearing Waknuk answers: the tall one falls, a woman runs to him =====
const C1 = 17.2; // the beats after the fight start here
beat('hold', 'fight', {}, C1, () => {
  pose(C1, 'david', 'reach');
  go(C1, 'david', [[-1.85, 8.15]], 1.7, { face: 55 });
  pose(C1 + 0.3, 'rosalind', '');
  go(C1 + 0.2, 'rosalind', [[-2.55, 8.4]], 2.0);
  set(C1 + 0.9, 'rosalind_hl', 'david:shoulder_l');
  set(C1 + 1.1, 'rosalind_hr', 'david:hand_r');
  pose(C1 + 1.4, 'david', 'kneel,slump');
  go(C1 + 1.4, 'david', [[-2.2, 8.25]], 0.8, { noTurn: true });
  turn(C1 + 1.6, 'david', 90, 0.8);
  pose(C1 + 1.7, 'rosalind', 'kneel');
  set(C1 + 2.4, 'rosalind_hl', '');
  set(C1 + 2.4, 'rosalind_hr', 'david:shoulder_l');
  turn(C1 + 1.0, 'petra', 70, 0.6);
  returnFire(C1 + 3.2);
});
// the clearing again: Waknuk answers, the tall one falls; a woman runs out to him (t: the cut)
function returnFire(t) {
  cam(t, ...CLEARING);
  fire(t - 0.4, 'w1');
  fire(t - 0.1, 'w2');
  pose(t + 0.2, 'spider', 'fall_back');
  set(t + 2.3, 'spider_dead', 1);
  go(t + 0.6, 'sophie', [[7.7, 18.2]], 3.4);
  pose(t + 1.9, 'sophie', 'kneel1,over');
  set(t + 2.0, 'sophie_hr', 'spider:chest');
  fire(t + 1.6, 'w3');
  set(t + 2.5, 'fight', 0.5, 1.5);
  cam(t + 2.9, 0, 0, 0);
}

// ===== run: David tears out of Rosalind's hand and runs down to his father, across the open clearing;
// Rosalind is left on the edge, then goes back to Petra =====
beat('run', 'fight', {}, C1, () => {
  set(C1, 'david_th', 0.3); // out on the clearing the web takes him as it takes the men
  pose(C1, 'david', '');
  go(C1, 'david', [[-1.5, 8.4, 1.0], [-1.05, 9.0, 0.6], [-0.5, 10.8, 0], [-0.15, 13.35, 0]], 3.4);
  pose(C1 + 0.3, 'rosalind', '');
  go(C1 + 0.2, 'rosalind', [[-2.0, 8.35]], 2.2);
  set(C1 + 0.6, 'rosalind_hl', 'david:shoulder_l');
  set(C1 + 1.0, 'rosalind_hl', '');
  pose(C1 + 0.5, 'rosalind', 'lunge');
  set(C1 + 1.1, 'rosalind_look', 'david:head');
  pose(C1 + 1.4, 'rosalind', 'reach');
  pose(C1 + 2.6, 'rosalind', 'freeze');
  turn(C1 + 1.0, 'petra', 70, 0.6);
  // from below the ledge: he comes down into the shooting and drops by his father
  cam(C1 + 1.5, -0.6, 4.6, 0.1);
  turn(C1 + 3.6, 'david', face(-0.15, 13.35, -0.6, 14.2), 0.4);
  pose(C1 + 3.6, 'david', 'kneel1,over');
  set(C1 + 4.2, 'david_hr', 'joseph:back');
  set(C1 + 4.4, 'david_hl', 'joseph:shoulder_r');
  fire(C1 + 2.8, 'w3');
  returnFire(C1 + 5.0);
  // (meanwhile, out of sight, Rosalind goes back to Petra)
  pose(C1 + 5.0, 'rosalind', '');
  const back = go(C1 + 5.0, 'rosalind', [[-2.6, 8.5]], 1.2).end;
  turn(back, 'rosalind', 90, 0.6);
  pose(back + 0.3, 'rosalind', 'kneel');
  set(C1 + 6.8, 'rosalind_hr', 'petra:back');
  set(C1 + 6.8, 'rosalind_look', 'petra:head');
});

// ===== ship: a glint over the forest grows into a fish with a spiral; the fight stops, all look up.
// Petra knows them: up, arms to the craft — Rosalind pulls her down. The first threads fall =====
const SH0 = C1 + 6.0; // where the ship beats start
beat('ship', ['hold', 'run'], {}, SH0, () => {
  const T = SH0 - 21; // the original timing, moved
  set(21 + T, 'ship_vis', 1);
  set(21 + T, 'spin', 1, 3);
  set(21 + T, 'ship_a', 4.6, 10, 'out');
  set(21 + T, 'ship_d', 21, 10, 'out');
  set(21 + T, 'ship_h', 8.5, 10, 'out');
  set(21 + T, 'ship_tilt', -0.02, 10, 'inOut');
  set(22 + T, 'fight', 0, 1);
  for (const [id, t, p] of [['w2', 22.2, 'look_up'], ['w3', 22.5, 'look_up'], ['w1', 22.7, 'kneel,look_up'], ['f3', 22.4, 'look_up'], ['f2', 22.9, 'look_up'], ['sophie', 23.3, 'kneel1,over,look_up']]) pose(t + T, id, p);
  set(22.6 + T, 'rosalind_hr', '');
  pose(22.6 + T, 'rosalind', 'kneel,look_up');
  set(22.6 + T, 'rosalind_look', -20);
  pose(23.0 + T, 'michael', 'kneel,look_up');
  set(23.4 + T, 'david_look', -25);
  set(23.2 + T, 'david_hr', '');
  set(23.2 + T, 'david_hl', '');
  pose(23.4 + T, 'david', 'kneel,look_up');
  set(22.4 + T, 'camera_look', -0.1, 3.0, 'inOut');
  cam(24.6 + T, -2.5, 5.0, 0.35, 2.6);
  turn(26.4 + T, 'petra', 70, 0.5);
  pose(26.6 + T, 'petra', 'arms_up');
  set(26.6 + T, 'petra_look', -40);
  go(26.7 + T, 'petra', [[-1.65, 7.95]], 1.4, { noTurn: true });
  set(28.0 + T, 'rosalind_hr', 'petra:chest');
  pose(28.0 + T, 'rosalind', 'kneel,reach');
  set(28.0 + T, 'rosalind_look', 'petra:head');
  pose(28.7 + T, 'petra', 'crouch');
  go(28.7 + T, 'petra', [[-2.55, 8.1]], 1.0, { noTurn: true });
  set(29.6 + T, 'rosalind_hr', 'petra:shoulder_l');
  cam(30.0 + T, 0, 0, 0, 2.8);
  go(28.5 + T, 'w3', [[-7.5, 18.2]], 3.0);
  go(29.0 + T, 'f2', [[13.5, 18.6]], 2.6);
  set(30.5 + T, 'camera_look', -0.04, 3, 'inOut');
  set(31.8 + T, 'fall', 0.4, 2.5);
});

// ===== web: the threads pour down; on the clearing each one fights them and goes still, a silver
// cocoon; the children on the ledge lie down under them. Variants: whom David covers =====
const WB = SH0 + 13.3;
// (near: where the camera goes, slowly; cut: a cut first, close on whom David covers)
function web(lie, near = [0, 2.0, 0], cut) {
  set(WB, 'fall', 1, 2.5);
  lie();
  set(WB + 1.0, 'web', 1, 9, 'linear');
  if (cut) cam(WB + 1.6, ...cut);
  cam(WB + 1.7, ...near, 10);
  set(WB + 4.2, 'cave_web', 1, 5.5);
  set(WB + 8.7, 'fall', 0, 3.5);
}
const lieDown = (ids, t0 = WB + 0.7) => ids.forEach((id, i) => {
  if (id === 'rosalind') set(t0, 'rosalind_hr', '');
  pose(t0 + i * 0.25, id, 'lie');
  set(t0, id + '_look', 0);
});
// nobody: they all lie down where they are
beat('web', 'ship', {}, WB, () => web(() => lieDown(['rosalind', 'petra', 'david', 'michael'])));
const OVER_THEM = [-2.5, 2.6, 1.4, 0, 0.17], ON_LEDGE = [-2.5, 3.2, 1.4]; // from above the stone: who is under him
// over Petra: David takes her from Rosalind, she lies down, he bends over her; Rosalind lies alone
beat('web_petra', 'ship', {}, WB, () => web(() => {
  set(WB, 'rosalind_hr', ''); // (David takes Petra from her; she lies down alone, a little away)
  go(WB + 0.1, 'rosalind', [[-3.45, 8.7]], 1.2);
  lieDown(['rosalind', 'michael'], WB + 1.3);
  pose(WB + 0.1, 'petra', 'lie');
  set(WB + 0.1, 'petra_look', 0);
  turn(WB + 0.2, 'david', -110, 0.5);
  pose(WB + 0.5, 'david', 'kneel,over');
  set(WB + 1.4, 'david_look', 'petra:head');
  set(WB + 1.7, 'david_hr', 'petra:back');
  set(WB + 1.8, 'david_hl', 'petra:head');
}, ON_LEDGE, OVER_THEM));
// over Rosalind: she holds Petra down; David bends over both of them
beat('web_rosalind', 'ship', {}, WB, () => web(() => {
  lieDown(['petra', 'michael'], WB + 0.6);
  set(WB + 0.8, 'rosalind_hr', '');
  pose(WB + 0.9, 'rosalind', 'lie');
  set(WB + 0.9, 'rosalind_look', 0);
  turn(WB + 0.3, 'david', -130, 0.5);
  pose(WB + 1.2, 'david', 'kneel,over');
  set(WB + 2.2, 'david_look', 'rosalind:head');
  set(WB + 2.5, 'david_hr', 'rosalind:back');
  set(WB + 2.6, 'david_hl', 'rosalind:shoulder_r');
}, ON_LEDGE, OVER_THEM));
const BY_FATHER = [-0.4, 5.2, 0.05]; // the camera near David and his father
// (David by his father) over his father: the threads take David, not him
beat('web_father', 'ship', {}, WB, () => web(() => {
  lieDown(['rosalind', 'petra', 'michael']);
  set(WB, 'joseph_th', 0.97);
  pose(WB + 0.2, 'david', 'kneel1,over');
  set(WB + 0.2, 'david_look', 'joseph:head');
  set(WB + 0.5, 'david_hr', 'joseph:back');
  set(WB + 0.6, 'david_hl', 'joseph:head');
  set(WB + 0.5, 'david_still', 1);
}, BY_FATHER));
// (David by his father) he throws himself down beside him; the threads take them both
beat('web_alone', 'ship', {}, WB, () => web(() => {
  lieDown(['rosalind', 'petra', 'michael']);
  set(WB + 0.2, 'david_hr', '');
  set(WB + 0.2, 'david_hl', '');
  pose(WB + 0.3, 'david', 'lie');
  set(WB + 0.3, 'david_look', 0);
  set(WB + 0.3, 'david_still', 1);
}, BY_FATHER));

// ===== landing: silence; it comes down, dust, the rotor slows. The door: warm light, a ramp. A woman
// in white comes out, looks toward the cave, starts her sprayer and walks toward the ledge =====
const LD = WB + 11;
function landing() {
  const T = LD - 41;
  set(41 + T, 'ship_h', 0, 5.5, 'inOut');
  set(41 + T, 'ship_tilt', 0, 5.5);
  set(43 + T, 'dust', 1, 2);
  set(46.1 + T, 'spin', 0.12, 3);
  set(46.5 + T, 'dust', 0, 4);
  cam(41 + T, 0, 0.6, 0, 5.5, 0);
  cam(45.2 + T, 2.6, 8.5, 0.15, 0, 0); // cut: closer, to the door
  set(45.6 + T, 'door', 1, 2.2);
  set(47.2 + T, 'sealand_hide', 0, 0.7);
  let e1 = go(47.2 + T, 'sealand', [[3.0, 19.9, 0.95]], 0.9, { noTurn: true }).end;
  e1 = go(e1, 'sealand', [[3.0, 18.8, 0]], 1.0, { noTurn: true }).end;
  set(e1 + 0.2, 'sealand_look', -45);
  set(e1 + 0.8, 'sealand_look', -70);
  pose(e1 + 1.0, 'sealand', 'spray');
  set(e1 + 1.1, 'spray', 1, 0.6);
  const w0 = e1 + 1.6;
  set(w0, 'sealand_look', '');
  go(w0, 'sealand', [[1.5, 15.9, 0]], 1.5);
}
const WEBBED = { fall: 0, web: 1, cave_web: 1 };
// (David in the web by his father, Rosalind and the children on the ledge)
const IN_WEB = { david_a: -0.15, david_d: 13.35, david_h: 0, david_f: face(-0.15, 13.35, -0.6, 14.2), david_p: 'kneel1,over', david_th: 0.3, david_still: 1, david_look: 'joseph:head', david_hr: 'joseph:back', david_hl: '', joseph_th: -1 };
beat('landing', ['web', 'web_petra', 'web_rosalind'], WEBBED, LD, landing);
beat('landing_run', ['web_father', 'web_alone'], { ...WEBBED, ...IN_WEB }, LD, landing);

// ===== free: up on the ledge she sprays the children — the web melts; Petra runs to her, the woman
// kneels and holds her. The others get up (in `free_run` David is not among them) =====
function free(t, withDavid) {
  // cut: she is already near the cave, the children under the web in front of us
  set(t, 'sealand_a', 0.3); set(t, 'sealand_d', 11.9); set(t, 'sealand_f', -30);
  pos.sealand = [0.3, 11.9, 0];
  cam(t, -2.0, 3.0, 0.3, 0, 0);
  const T1 = go(t + 0.05, 'sealand', [[-0.45, 10.4, 0], [-1.05, 9.0, 0.6], [-1.42, 8.5, 1.0]], 1.15).end;
  turn(T1, 'sealand', -90, 0.6);
  set(T1 + 0.3, 'sealand_look', 25);
  set(T1 + 0.5, 'cave_web', 0, 3.2);
  pose(T1 + 1.6, 'petra', ''); // (they get up the way people do: the recording)
  set(T1 + 2.9, 'petra_look', 'sealand:head');
  go(T1 + 3.1, 'petra', [[-1.92, 8.3]], 1.8);
  pose(T1 + 4.0, 'petra', 'hug');
  set(T1 + 3.7, 'sealand_look', 'petra:head');
  set(T1 + 4.3, 'sealand_hr', 'petra:back');
  set(T1 + 4.4, 'sealand_hl', 'petra:shoulder_r');
  set(T1 + 3.0, 'spray', 0, 0.6);
  pose(T1 + 3.2, 'sealand', 'kneel1');
  pose(T1 + 6.0, 'sealand', '');
  set(T1 + 5.9, 'sealand_hr', '');
  set(T1 + 6.2, 'sealand_hl', '');
  pose(T1 + 2.2, 'rosalind', '');
  set(T1 + 3.7, 'rosalind_look', withDavid ? 'sealand:head' : 'joseph:head');
  go(T1 + 3.9, 'rosalind', [[-3.35, 8.5]], 0.9);
  if (withDavid) {
    set(T1 + 2.0, 'david_hr', '');
    set(T1 + 2.0, 'david_hl', '');
    pose(T1 + 2.6, 'david', '');
    go(T1 + 4.6, 'david', [[-2.8, 8.75]], 0.9);
    set(T1 + 4.3, 'david_look', 'sealand:head');
  }
  pose(T1 + 3.0, 'michael', '');
  set(T1 + 4.9, 'michael_look', 'sealand:head');
  set(T1 + 6.6, 'michael_look', 'sealand:head'); // (where it ends)
}
const FR = LD + 17;
beat('free', 'landing', {}, FR, () => free(FR, true));
beat('free_run', 'landing_run', {}, FR, () => free(FR, false));

// ===== back: down through the clearing, the woman leading Petra by the hand, not looking back. David
// stops by his father's cocoon, kneels, touches it; Rosalind comes back for him. At the ramp Petra waves
// to Michael, who stays on the ledge; he answers =====
const BK = FR + 12;
const PATH = [[-1.05, 9.1, 0.55], [-0.2, 10.6, 0], [2.85, 18.7, 0]];
function lead(t, path) {
  pose(t, 'petra', 'hold_hand');
  set(t, 'petra_hr', 'sealand:hand_l');
  set(t, 'petra_look', '');
  set(t, 'sealand_look', '');
  const l = go(t, 'sealand', path, 1.45);
  go(t, 'petra', path.map(([a, d, h]) => [a - 0.45, d - 0.35, h]), 1.45, { over: l.over });
  go(t + 0.8, 'michael', [[-2.2, 8.15]], 0.9);
  set(t + 1.5, 'michael_look', 'sealand:head');
  return l.end;
}
const AT_FATHER = [0.5, 7.4, 0, 0, 0.04]; // cut: close on David at his father's side
// by the father: David kneels and touches him (from t, where he stands); Rosalind (her walk ending at
// r1, at ra, rd) turns back for him, a hand on his shoulder → when he gets up
function father(t, r1, ra, rd) {
  const [da, dd] = pos.david;
  turn(t, 'david', face(da, dd, -0.6, 14.2), 0.7);
  set(t + 0.1, 'david_look', 'joseph:head');
  pose(t + 0.9, 'david', 'kneel1');
  set(t + 1.6, 'david_hr', 'joseph:back');
  cam(t - 0.6, ...AT_FATHER);
  const rb = Math.max(r1, t + 1.2);
  turn(rb, 'rosalind', face(ra, rd, da, dd), 0.7);
  go(rb + 0.8, 'rosalind', [[da + 0.5, dd + 0.35]], 0.7, { face: face(ra, rd, da, dd) });
  set(rb + 1.8, 'rosalind_hr', 'david:shoulder_r');
  set(rb + 1.4, 'rosalind_look', 'david:head');
  return rb + 4.2;
}
const WIDE = [0.6, 1.0, 0, 0, 0], RAMP = [2.8, 9.6, 0.1, 0, 0];
// he gets up (up), she takes his hand; to the ramp, where the woman waits (from L1), turned back to
// them; then Petra waves to Michael on the ledge, he answers
function ramp(up, L1) {
  set(up - 0.3, 'david_hr', '');
  pose(up, 'david', '');
  set(up + 0.2, 'david_look', 'rosalind:head');
  set(up + 0.9, 'rosalind_hr', '');
  set(up + 1.2, 'rosalind_hr', 'david:hand_l');
  set(up + 1.2, 'rosalind_look', '');
  const r2 = go(up + 1.1, 'rosalind', [[2.25, 18.05]], 1.5).end;
  const d2 = go(up + 1.3, 'david', [[1.8, 17.8]], 1.5).end;
  set(up + 1.2, 'david_look', '');
  cam(up + 0.9, ...WIDE); // cut: wide, the two walk on to the craft
  turn(L1 + 0.3, 'sealand', -160, 0.8);
  set(L1 + 0.6, 'sealand_look', 'david:head');
  const W = Math.max(L1 + 1, d2 - 0.6);
  cam(W - 0.1, ...RAMP); // cut: the ramp — Petra turns and waves
  cam(W + 1.5, -2.2, 4.6, 0.4, 0, 0); // cut: Michael on the rock answers
  cam(W + 3.4, ...WIDE); // cut: wide — the craft and the rock
  turn(W, 'petra', -70, 0.6);
  set(W, 'petra_hr', '');
  pose(W + 0.3, 'petra', 'wave:l');
  set(W + 0.3, 'petra_look', 'michael:head');
  pose(W + 1.1, 'michael', 'wave');
  set(W + 1.1, 'michael_look', 'petra:head');
  set(Math.max(r2, d2) + 0.3, 'david_look', 'michael:head');
  set(W + 3.2, 'rosalind_look', 'david:head');
}
beat('back', 'free', {}, BK, () => {
  const L1 = lead(BK, PATH);
  set(BK + 1.4, 'rosalind_look', '');
  set(BK + 1.9, 'david_look', '');
  const r1 = go(BK + 1.4, 'rosalind', [[-1.3, 9.2, 0.5], [-0.4, 10.8, 0], [1.25, 13.6, 0]], 1.45).end;
  const d1 = go(BK + 1.9, 'david', [[-1.6, 9.1, 0.6], [-0.6, 11.0, 0], [0.25, 13.0, 0]], 1.45).end;
  cam(BK, 0.4, 1.4, 0, 7);
  ramp(father(d1, r1, 1.25, 13.6), L1);
});
// (David in the web by his father) on the way the woman stops and sprays him free; he gets up to his knees
beat('back_run', 'free_run', {}, BK, () => {
  const stop = go(BK, 'sealand', PATH.slice(0, 2).concat([[0.75, 12.6, 0]]), 1.45);
  go(BK, 'petra', [[-1.5, 8.75, 0.55], [-0.65, 10.25, 0], [0.4, 12.1, 0]], 1.45, { over: stop.over });
  pose(BK, 'petra', 'hold_hand');
  set(BK, 'petra_hr', 'sealand:hand_l');
  set(BK, 'petra_look', '');
  set(BK, 'sealand_look', '');
  go(BK + 0.8, 'michael', [[-2.2, 8.15]], 0.9);
  set(BK + 1.5, 'michael_look', 'sealand:head');
  cam(BK, 0.4, 1.4, 0, 7);
  const t = stop.end;
  turn(t, 'sealand', face(0.75, 12.6, -0.15, 13.35), 0.5);
  set(t + 0.3, 'sealand_look', 'david:head');
  pose(t + 0.5, 'sealand', 'spray');
  set(t + 0.6, 'spray', 1, 0.5);
  set(t + 0.8, 'david_th', 2, 2.5);
  set(t + 3.0, 'spray', 0, 0.6);
  pose(t + 3.2, 'sealand', '');
  set(t + 3.4, 'sealand_look', '');
  set(t + 3.0, 'david_still', 0);
  set(t + 3.0, 'david_look', 'joseph:head');
  pose(t + 3.2, 'david', 'kneel1');
  set(t + 4.3, 'david_hr', 'joseph:back');
  // Rosalind has come down after them
  set(BK + 1.4, 'rosalind_look', 'david:head');
  go(BK + 1.4, 'rosalind', [[-1.3, 9.2, 0.5], [-0.4, 10.8, 0], [0.6, 13.9, 0]], 1.45);
  // the woman takes Petra on to the ramp
  const L1 = go(t + 3.6, 'sealand', [PATH[2]], 1.45);
  go(t + 3.6, 'petra', [[2.4, 18.35, 0]], 1.45, { over: L1.over });
  cam(t - 0.3, ...AT_FATHER);
  // Rosalind's hand on his shoulder; up; her hand; to the ramp
  const rb = t + 4.4;
  set(rb + 0.6, 'rosalind_hr', 'david:shoulder_r');
  ramp(rb + 3.0, L1.end);
});

// ===== the craft goes. A rise of dust, the spiral turns, it lifts and goes, a glint far off =====
function away(D) {
  set(D, 'door', 0, 1.8);
  set(D + 1.5, 'spin', 1, 2.5);
  set(D + 2.2, 'dust', 1, 2);
  set(D + 3.0, 'ship_h', 9, 4.5, 'inOut');
  set(D + 6.5, 'dust', 0, 4);
  set(D + 4, 'camera_look', -0.08, 4, 'inOut');
  set(D + 7.5, 'ship_a', 260, 11, 'in');
  set(D + 7.5, 'ship_d', 520, 11, 'in');
  set(D + 7.5, 'ship_h', 170, 11, 'in');
  set(D + 7.5, 'ship_tilt', 0.18, 3);
  set(D + 17.0, 'ship_vis', 0, 2);
}
const BD = BK + 30;
// board: they go into the light; David looks back once at the clearing. Michael on the rock watches it
// go, looks once at the clearing of cocoons — and walks away along the rock. The still clearing
beat('board', ['back', 'back_run'], {}, BD, () => {
  cam(BD, ...RAMP); // cut: the ramp — they go in
  pose(BD, 'petra', 'hold_hand');
  set(BD, 'petra_hr', 'sealand:hand_l');
  set(BD, 'petra_look', '');
  pose(BD + 0.6, 'michael', '');
  turn(BD, 'sealand', 0, 0.6);
  set(BD, 'sealand_look', '');
  const in1 = go(BD + 0.3, 'sealand', [[3.0, 19.95, 0.95]], 1.1).end;
  go(BD + 0.3, 'petra', [[2.75, 19.85, 0.95]], 0.9, { over: in1 - BD - 0.6 });
  set(in1 - 0.4, 'sealand_hide', 1, 0.6);
  set(in1 - 0.3, 'petra_hide', 1, 0.6);
  set(BD + 0.8, 'rosalind_look', '');
  const in2 = go(Math.max(BD + 1.5, in1 - 1.0), 'rosalind', [[3.0, 19.95, 0.95]], 1.1).end;
  set(in2 - 0.4, 'rosalind_hide', 1, 0.6);
  set(BD + 0.9, 'david_look', -60); // once more, the clearing
  set(BD + 2.4, 'david_look', '');
  const in3 = go(Math.max(BD + 2.6, in2 - 0.6), 'david', [[2.9, 19.95, 0.95]], 1.1).end;
  set(in3 - 0.4, 'david_hide', 1, 0.6);
  const D = in3 + 0.3;
  away(D);
  cam(D + 0.4, 0, 0, 0, 0, -0.02); // cut: wide — it goes
  set(D + 13, 'camera_look', 0, 4, 'inOut');
  turn(D + 2.0, 'michael', 70, 0.8);
  set(D + 2.2, 'michael_look', -25);
  pose(D + 4.0, 'michael', 'look_up');
  const m2 = D + 8.5;
  pose(m2, 'michael', '');
  set(m2, 'michael_look', '');
  turn(m2, 'michael', 150, 1.0);
  go(m2 + 2.6, 'michael', [[-3.4, 8.7, 1.0], [-9.5, 9.0, 1.0]], 1.25);
  cam(m2 - 1.5, -2.3, 3.0, 0.3, 3, 0); // close on him for his last look
  cam(m2 + 4.2, 0, 0, 0, 5); // and, when he has gone, the whole still clearing
});
// stay: David lets go of Rosalind's hand and goes back up to Michael on the ledge — with Rosalind
// (stay_ros) or alone, Rosalind going in after Petra and looking back from the light (stay_alone).
// The craft goes; on the ledge they watch it, Michael's hand on David's shoulder
function stay(withHer) {
  set(BD, 'rosalind_hr', '');
  set(BD + 0.2, 'david_look', 'michael:head');
  pose(BD, 'petra', 'hold_hand');
  set(BD, 'petra_hr', 'sealand:hand_l');
  set(BD + 0.4, 'petra_look', 'david:head');
  pose(BD + 0.6, 'michael', '');
  turn(BD + 1.5, 'sealand', 0, 0.6);
  set(BD + 1.5, 'sealand_look', '');
  const back = [[0.6, 14.2, 0], [-0.4, 10.8, 0], [-1.05, 9.0, 0.6], [-1.65, 8.3, 1.0]];
  const dEnd = go(BD + 0.9, 'david', back, 1.2).end;
  const in1 = go(BD + 2.4, 'sealand', [[3.0, 19.95, 0.95]], 0.7).end;
  go(BD + 2.4, 'petra', [[2.75, 19.85, 0.95]], 0.7, { over: in1 - BD - 2.7 });
  set(in1 - 0.4, 'sealand_hide', 1, 0.6);
  set(in1 - 0.3, 'petra_hide', 1, 0.6);
  let D;
  if (withHer) {
    set(BD + 0.9, 'rosalind_look', 'petra:head');
    set(BD + 2.6, 'rosalind_look', 'david:head');
    const rEnd = go(BD + 2.8, 'rosalind', [[1.0, 14.6, 0], [-0.3, 10.9, 0], [-0.95, 9.1, 0.6], [-1.25, 8.6, 1.0]], 1.2).end;
    D = in1 + 1.2;
    set(rEnd + 0.2, 'rosalind_look', -30);
    pose(rEnd + 0.6, 'rosalind', 'look_up');
  } else {
    set(BD + 0.6, 'rosalind_look', 'david:head');
    const in2 = go(BD + 4.6, 'rosalind', [[3.0, 19.95, 0.95]], 0.6).end;
    turn(in2 + 0.1, 'rosalind', -140, 0.8);
    set(in2 + 0.2, 'rosalind_look', 'david:head');
    set(in2 + 2.4, 'rosalind_hide', 1, 0.8);
    D = in2 + 3.4;
  }
  turn(dEnd, 'david', 70, 0.8);
  set(dEnd + 0.2, 'david_look', -30);
  pose(D + 4, 'david', 'look_up');
  turn(dEnd - 0.5, 'michael', 70, 0.8);
  set(dEnd + 0.6, 'michael_hl', 'david:shoulder_r');
  set(dEnd + 0.4, 'michael_look', -30);
  away(D);
  cam(BD + 1.0, -0.6, 1.2, 0.05, 6);
  cam(D + 2, -1.8, 3.0, 0.3, 8, -0.06);
}
beat('stay_ros', ['back', 'back_run'], {}, BD, () => stay(true));
beat('stay_alone', ['back', 'back_run'], {}, BD, () => stay(false));

// ===== noship (the craft never comes): the fight goes on; then Waknuk gives way and runs, leaving
// Joseph; the Fringes keep the clearing. The children get up; Petra looks at the empty sky =====
beat('noship', ['hold', 'run'], {}, SH0, () => {
  const T = SH0;
  set(T, 'fight', 1, 1);
  pose(T, 'w2', 'aim');
  pose(T, 'w3', 'aim');
  fire(T + 0.6, 'w2');
  fire(T + 1.8, 'w1');
  fire(T + 3.0, 'w3');
  fire(T + 4.4, 'w2');
  // they give way: up, and run to the left
  pose(T + 5.6, 'w1', '');
  go(T + 6.0, 'w1', [[-16, 16.6]], 3.4);
  go(T + 6.4, 'w3', [[-16, 18.0]], 3.6);
  go(T + 7.0, 'w2', [[-16, 19.4]], 3.2);
  set(T + 9.0, 'fight', 0, 2);
  // the Fringes come out a little, bows down
  go(T + 9.5, 'f2', [[7.6, 16.4]], 1.0);
  go(T + 10.0, 'f3', [[12.4, 23.6]], 1.0);
  pose(T + 10.5, 'f2', '');
  pose(T + 11.0, 'f3', '');
  set(T + 6, 'dawn', 0.62, 14);
  set(T + 6, 'smoke', 0.45, 14);
  cam(T + 11, ...CHILDREN, 5, 0);
  // the children get up; Petra looks for something in the sky
  set(T + 12.5, 'rosalind_hr', '');
  pose(T + 12.6, 'rosalind', '');
  pose(T + 13.0, 'michael', '');
  go(T + 13.4, 'michael', [[-3.35, 9.05]], 0.8);
  pose(T + 13.4, 'petra', '');
  set(T + 14.4, 'petra_look', -30);
  pose(T + 15.2, 'petra', 'look_up');
  set(T + 14.8, 'rosalind_look', 'petra:head');
  set(T + 13.6, 'david_look', 'joseph:head');
  set(T + 16.5, 'michael_look', 'petra:head');
});

s.kit.film.beats(s, BEATS, { film: ['cave', 'fight', 'hold', 'ship', 'web', 'landing', 'free', 'back', 'board'] });
