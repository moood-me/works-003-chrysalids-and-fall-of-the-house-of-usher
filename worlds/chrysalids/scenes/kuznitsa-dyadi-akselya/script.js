// The film in beats (module film; the beats, their keys and what a game does with them — notes.md). The world's viewer
// sees the canon cut: chatter → notice → truth → door → hush → lantern → after; a game plays the beats one at a time,
// its branches and tableaux too. Times in the rows are the canon film's seconds; each beat counts from its own start.
// The people are the engine's (elements with "person", the world's cast): what each does is <id>_do, where each faces
// <id>_turn (degrees: 0 away from us, 90 to the right, 180 toward us, 270 to the left), looks <id>_look, reaches
// <id>_reach, has in the hands <id>_with — and where each is their place (Axel ax_a/ax_d, David dv_a/dv_d, the man with
// the lantern st_a/st_d, the two called out of the dark w0_*, w1_*). David on the barrel sits on it (david_on: its top).
const s = scene, P = id => s.person(id), L = s.lib;
const loop = motion => ({ motion, loop: true });
// where things are (metres: across, distance, elevation)
const ANVIL = [-1.05, 4.62, 0.88], // the iron on the anvil, where the hammer falls
  // where Axel stands to work it: his blow (smith_strike) lands half a metre before his pelvis, on his middle — there,
  // on the iron (facing it: 270)
  AT_ANVIL = [ANVIL[0] + 0.49, ANVIL[1] + 0.03],
  BARREL = [1.3, 4.32, 0.7], // the barrel's top, where David sits
  DAV = [1.3, 4.3, 1.25], DAVF = [1.3, 4.3, 1.15], // the boy's face on the barrel, a little lower
  AXH = [1.95, 4.5], // where Axel kneels by the boy (facing him)
  AXF = [1.95, 4.5, 1.2], // his face there
  GATE = [2.4, 10, 1.5], WIN = [23.6, 60, 7.6],
  JOS = [1.9, 8.4, 1.7], JOSG = [2.6, 8.4, 1.7], // the man in the gap (in the game's beats a little to the right)
  FIRE = [-3.8, 6.5, 0.95],
  BELLOWS = [-6.15, 6.3], // where David stands to work the bellows' lever
  DVB = [-6.15, 6.3, 1.25], // …his face there
  FLOOR_BY = [2.0, 4.2, 0.0], // the floor at the boy's feet
  YARD_L = [-6, 13, 1.6], YARD_R = [9, 13, 1.6]; // the yard to the left and to the right of the gate, as he looks out
// the smith's blow (smith_strike): the hammer meets the iron this far into it (seconds; the top of the lift at 0.73)
const IMPACT = 1.17, TOP = 0.73;
// where everyone begins, when a beat begins from nothing (a tableau: this and its own)
const START = {
  fade: 1, camera_x: 0, camera_z: 0, fire: 0.75, sparks: 0.5, door: 1, pump: 0,
  ax_a: AT_ANVIL[0], ax_d: AT_ANVIL[1], ax_work: 0, ax_pace: 2, ax_spark: 0,
  axel_do: 'stand', axel_turn: 270, axel_look: ANVIL, axel_reach: null, axel_with: ['hammer', 'tongs'], axel_steps: true, axel_gait: null,
  dv_a: BARREL[0], dv_d: BARREL[1], dv_chat: 0, dv_glow: 0, dv_pump: 0, pump_work: 0,
  david_on: BARREL, david_do: loop('perch'), david_turn: 90, david_look: [12, 40, 5], david_reach: null, david_steps: true, david_gait: null, david_here: true,
  th_amp: 1, tho_a: L.HEAD[0], tho_e: L.HEAD[1], tho_d: L.HEAD[2], thi_a: L.HEAD[0], thi_e: L.HEAD[1], thi_d: L.HEAD[2],
  st_on: 0, st_who: 'joseph', st_a: 5.8, st_d: 8.4, st_lamp: 0, st_lx: -5, st_lz: 8.4, st_drop: 0, st_glow: 1, st_lanx: 2.9, st_more: 0,
  joseph_do: 'stand', joseph_turn: 270, joseph_steps: true, farmhand_do: 'stand', farmhand_turn: 270, farmhand_steps: true,
  w0_a: 9.5, w0_d: 10, w1_a: 11.5, w1_d: 10.6, watch0_here: false, watch1_here: false, watch0_turn: 270, watch1_turn: 270,
  watch0_look: null, watch1_look: null, watch0_reach: null, watch1_reach: null, watch0_steps: true, watch1_steps: true,
};
// each one's place keys
const PLACE = { axel: ['ax_a', 'ax_d'], david: ['dv_a', 'dv_d'], joseph: ['st_a', 'st_d'], farmhand: ['st_a', 'st_d'], watch0: ['w0_a', 'w0_d'], watch1: ['w1_a', 'w1_d'] };

// ---- what goes on by itself while a key says so (and what a game drives: ax_blow, pump, st_lamp, st_lx/st_lz) ----
// a blow of the hammer: up and down onto the iron `per` seconds from now (as much of the lift as there is time for);
// the sparks as it lands
// (his right hand holds the iron on the anvil in the tongs: their jaws on it, the hand back along them)
const TONGS_AT = [ANVIL[0] + 0.3, ANVIL[1] + 0.04, ANVIL[2] + 0.1];
function blow(per) {
  if ((s.get('axel_with') || []).includes('tongs')) P('axel').reach({ r: TONGS_AT });
  P('axel').do('smith_strike', { loop: false, from: Math.max(0, IMPACT - per) });
  const mine = s.get('axel_do')?.n;
  s.after(Math.min(per, IMPACT), () => {
    if (s.get('axel_do')?.n !== mine) return; // (stopped before it fell)
    s.set('ax_spark', 1);
    s.set('ax_spark', 0, 0.55, 'out');
  });
}
// a thought-shape from David's head to the far window; an answer back (its glow in his head, a laugh)
function out(dur) {
  const H = L.HEAD, W = L.WIN;
  s.set('tho_a', H[0]); s.set('tho_e', H[1]); s.set('tho_d', H[2]);
  s.set('tho_a', W[0], dur, 'in'); s.set('tho_e', W[1], dur, 'in'); s.set('tho_d', W[2], dur, 'in');
}
function inn(dur, laugh) {
  const H = L.HEAD, W = L.WIN;
  s.set('thi_a', W[0]); s.set('thi_e', W[1]); s.set('thi_d', W[2]);
  s.set('thi_a', H[0], dur, 'out'); s.set('thi_e', H[1], dur, 'out'); s.set('thi_d', H[2], dur, 'out');
  s.after(dur - 0.35, () => s.set('dv_glow', 1, 0.3));
  s.after(dur + 0.3, () => s.set('dv_glow', 0, 1.4));
  if (laugh) {
    s.after(dur - 0.1, () => P('david').do('perch_laugh'));
    s.after(dur + 2.4, () => { if (s.get('dv_chat') > 0) P('david').do('perch_talk', { loop: true }); });
  }
}
// one pull of the bellows' lever: the board goes down, the fire breathes up, then it rises again
function press() {
  const f = s.get('fire');
  s.set('pump', 1, 0.3, 'inOut');
  s.set('fire', Math.min(1, f + 0.2), 0.25);
  s.set('sparks', 0.9, 0.25);
  s.after(0.35, () => {
    s.set('pump', 0, 0.9, 'inOut');
    s.set('fire', f, 1.1);
    s.set('sparks', 0.5, 1.2);
  });
}
s.on('change', 'ax_blow', () => blow(s.get('ax_pace') || 2));
// ax_work 1: Axel at work, a blow after a blow, every ax_pace seconds, till it is 0
// dv_chat N: David chatters away — a shape out every N seconds and its answer 3.2 s after, till it is 0
// pump_work N: David at the bellows pulls the lever every N seconds, till it is 0
function keep(key, first, each) {
  let gen = 0;
  s.on('change', key, v => {
    const me = ++gen;
    if (!(v > 0)) return;
    let n = 0;
    const go = () => {
      if (me !== gen) return;
      s.after(each(n++, s.get(key)), go);
    };
    s.after(first, go);
  });
}
keep('ax_work', 0, () => {
  const per = s.get('ax_pace') || 2;
  blow(per);
  return per;
});
keep('dv_chat', 1.4, (n, every) => {
  const me = s.get('dv_chat');
  out(2.6);
  s.after(3.2, () => { if (s.get('dv_chat') === me) inn(2.6, n === 0 && every < 10); });
  return every;
});
keep('pump_work', 0, () => {
  press();
  return s.get('pump_work');
});
// David at the bellows (dv_pump 1): his hands on the lever's handle, wherever it is; each time it goes down (a pull —
// the scene's or a game's), he pulls it down with his body, then stands holding it
let pulls = 0;
const atLever = () => P('david').reach((s.get('dv_pump') || 0) > 0.5 ? { r: 'forge#handle', l: 'forge#handle' } : null);
s.on('change', 'dv_pump', atLever);
s.on('change', 'pump', v => {
  if (!((s.get('dv_pump') || 0) > 0.5) || !(v > 0.5)) return;
  const me = ++pulls;
  P('david').do('pull_lever');
  s.after(1.4, () => { if (me === pulls && (s.get('dv_pump') || 0) > 0.5) P('david').do('stand'); });
});
// the man with the lantern (st_who: joseph | farmhand): in the yard while st_on, its light his while it is in his hand
// (st_drop: it has fallen); his look at st_lx/st_lz (where on the floor), the lantern up by st_lamp (1 — up, toward
// where he looks; 1.3 — higher)
const MEN = ['joseph', 'farmhand'];
// (a value as it is set — where it is going, not where it is on its way: a handler hears it as it is set)
let SET = {};
const now = k => (k in SET ? SET[k] : s.get(k));
function man() {
  const who = now('st_who') || 'joseph', on = (now('st_on') || 0) > 0.01, dropped = (now('st_drop') || 0) > 0.5;
  for (const m of MEN) {
    P(m).here(on && m === who);
    P(m).with(m === who && dropped ? null : ['lantern']);
    s.set(`${m}_lamp`, m === who && dropped ? 0 : 1);
  }
  lamp();
}
function lamp() {
  const who = now('st_who') || 'joseph', a = s.get('st_a'), d = s.get('st_d'), v = now('st_lamp') || 0, lx = now('st_lx'), lz = now('st_lz');
  const dx = lx - a, dz = lz - d, n = Math.hypot(dx, dz) || 1, up = (now('st_drop') || 0) < 0.5 && v > 0.05;
  P(who).reach(up ? { r: [a + 0.38 * dx / n, d + 0.38 * dz / n, 1.3 + 0.38 * Math.min(v, 1.3)] } : null);
  P(who).look([lx, lz, 1.0]);
}
const heard = fn => (v, old, k) => { SET = { [k]: v }; try { fn(); } finally { SET = {}; } };
for (const k of ['st_on', 'st_who', 'st_drop']) s.on('change', k, heard(man));
for (const k of ['st_lamp', 'st_lx', 'st_lz']) s.on('change', k, heard(lamp));
for (const k of ['st_a', 'st_d']) s.on('move', k, () => lamp());
// the two called out of the dark (st_more 1: they come; 0: not there): along the yard from the right, a lantern each,
// held up a little as they stop and look in
const WATCH = [[9.5, 3.0, 10.0], [11.5, 1.3, 10.6]];
s.on('change', 'st_more', (v, was) => WATCH.forEach(([x0, x1, d], i) => {
  const id = `watch${i}`, keys = [`w${i}_a`, `w${i}_d`];
  P(id).here(v > 0.005);
  P(id).with(['lantern']);
  if (!(v > 0.005) || was > 0.005) return;
  P(id).reach(null); P(id).look(null); s.set(`${id}_steps`, true);
  s.set(keys[0], x0); s.set(keys[1], d);
  s.path(keys, [[x0, d], [x1, d]], { over: 5 + i * 1.2, ease: 'inOut' });
  s.after(5 + i * 1.2, () => { P(id).turn(200, 0.6); P(id).look([1.0, 5.0, 1.0]); P(id).reach({ r: [x1 - 0.25, d - 0.3, 1.45] }); });
}));

// ---- the rows ----
// a beat's rows written in the film's own seconds (t0 — where the beat starts in them)
const at = (t0, rows) => rows.map(([t, ...r]) => [Math.round((t - t0) * 100) / 100, ...r]);
// the state once the rows have played (what the next beat begins at): values, paths' ends, and what a row that is a
// function says it leaves (its `ends(state)`)
function settle(state, rows) {
  const out = { ...state };
  for (const [, k, v] of [...rows].sort((p, q) => p[0] - q[0])) {
    if (typeof k === 'function') Object.assign(out, k.ends?.(out));
    else if (Array.isArray(k)) k.forEach((key, i) => (out[key] = v.path.at(-1)[i]));
    else out[k] = v && typeof v === 'object' && 'turn' in v ? v.turn : v;
  }
  return out;
}
// a motion done once, ending facing `turn`: begun where they are (getting up, kneeling down) — or ending at `to` (a
// step to where it begins first); they are where it takes them, held at its end, after it
const once = (id, motion, turn, to) => {
  const [ka, kd] = PLACE[id];
  const f = () => { const st = s.state; P(id).go(motion, { ...(to ? { to } : { from: [st[ka], st[kd]] }), turn: turn ?? st[`${id}_turn`] }); };
  f.ends = st => {
    const end = turn ?? st[`${id}_turn`], off = to ? { across: 0, distance: 0 } : P(id).startOf(motion, end) ?? { across: 0, distance: 0 };
    const [a, d] = to ?? [st[ka], st[kd]];
    return { [ka]: a - off.across, [kd]: d - off.distance, [`${id}_turn`]: end, [`${id}_do`]: { motion, loop: false, from: 99 } };
  };
  return f;
};
// they walk (steps) from where they are along points, taking `over` seconds, and turn at the end — or face `facing`
// all the way (a walk backwards: their gait walks backwards)
const walk = (t, id, pts, over, turn, ease = 'inOut', facing) => {
  const [ka, kd] = PLACE[id];
  const f = () => {
    const st = s.state;
    s.set(`${id}_steps`, true);
    if (facing != null) s.set(`${id}_turn`, facing);
    s.path([ka, kd], [[st[ka], st[kd]], ...pts], { over, ease });
  };
  f.ends = () => ({ [ka]: pts.at(-1)[0], [kd]: pts.at(-1)[1], [`${id}_steps`]: true, ...(facing != null ? { [`${id}_turn`]: facing } : {}) });
  return [[t, f], ...(turn != null ? [[t + over, `${id}_turn`, turn]] : [])];
};
// a nod: the head down a little toward what they look at and up again, `n` times (from second t)
const lower = (p, by) => (typeof p === 'string' ? `${p}#chest` : [p[0], p[1], p[2] - by]);
const nod = (t, id, p, n = 1) => Array.from({ length: n }, (_, i) => [
  [t + i * 0.6, `${id}_look`, lower(p, 0.32)], [t + i * 0.6 + 0.3, `${id}_look`, p],
]).flat();
// a shake of the head: the eyes from one side of what they look at to the other, `n` times
const shake = (t, id, p, side, n = 2) => [...Array.from({ length: n }, (_, i) => [
  [t + i * 0.5, `${id}_look`, [p[0] + side[0], p[1] + side[1], p[2]]], [t + i * 0.5 + 0.25, `${id}_look`, [p[0] - side[0], p[1] - side[1], p[2]]],
]).flat(), [t + n * 0.5, `${id}_look`, p]];
// off the barrel onto his feet (he slides forward off it): where he lands is the motion's
const offBarrel = () => {
  const f = () => { s.set('david_on', null); P('david').do('hop_down'); };
  f.ends = st => {
    const off = P('david').startOf('hop_down', st.david_turn) ?? { across: 0, distance: 0 };
    return { david_on: null, david_do: { motion: 'hop_down', loop: false, from: 99 }, dv_a: BARREL[0] - off.across, dv_d: BARREL[1] - off.distance };
  };
  return f;
};
// Axel's tools: in his hands, or laid on the anvil
const TOOLS = ['hammer', 'tongs'];
// a beat as long as its people: a row it ends on (they finish what they do)
const hold = t => [t, () => {}];

const B = {
  // 1. chatter — from black: the night forge. Axel at the anvil, his back to the boy. David on the barrel faces the
  //    open gate and chatters away to no one; thought-shapes go out to a far lit window and come back; he laughs.
  chatter: { rows: [
    [0, 'fade', 0, 2.2, 'out'],
    [0.6, 'ax_work', 1],
    [0, 'david_do', loop('perch_talk')], [0, 'dv_chat', 7.2],
    hold(10.6),
  ] },
  // 2. notice — the hammer stops at the top of a swing. He listens; lays the hammer down; turns; looks at the empty
  //    gate, at the boy. He limps over, round behind the boy; the boy falls silent, shrinks. Down on the knee, a hand
  //    on the shoulder, an open hand: "who?" — held (the game's choice: truth / lie).
  notice: { after: 'chatter', rows: at(10.6, [
    [10.6, 'ax_work', 0], [10.6, 'dv_chat', 0],
    [10.6, 'axel_do', 'smith_strike'], [11.3, 'axel_do', 'raise_hammer'],
    [12.0, 'axel_look', DAV],
    [13.4, 'axel_do', 'put_down'], [13.4, 'axel_reach', null], [13.4, 'axel_look', ANVIL], [14.6, 'axel_with', null],
    [15.2, 'axel_turn', 90], [15.4, 'axel_do', 'stand'],
    [13.8, () => inn(2.8, false)],
    [15.6, 'axel_look', GATE], [17.3, 'axel_look', DAV],
    ...walk(18.2, 'axel', [[0.5, 5.15], [1.9, 5.05], [2.6, 4.75]], 4.0),
    [19.0, 'david_do', loop('perch_still')], [19.4, 'david_look', [0.3, 4.8, 1.6]],
    [20.0, 'david_do', loop('perch_hunch')],
    [21.0, 'david_look', [1.4, 4.9, 1.7]], [22.4, 'david_look', AXF],
    [22.3, once('axel', 'kneel_one', 270, AXH)], [22.6, 'axel_look', DAVF],
    [22.4, 'camera_z', 1.1, 4.5, 'inOut'], [22.4, 'camera_x', 1.0, 4.5, 'inOut'],
    [25.0, 'axel_do', loop('kneel_one_still')],
    [25.2, 'axel_reach', { l: 'david#shoulder_r' }],
    [26.2, 'axel_reach', null], [26.4, 'axel_do', 'kneel_one_ask'],
    hold(27.6),
  ]) },
  // 3a. truth (canon) — he points over at the far light: a shape goes out, an answer comes back; he nods. Axel
  //     understands: a hand in the beard; his eyes go to the open gate.
  truth: { after: 'notice', rows: at(28.0, [
    [28.0, 'axel_do', loop('kneel_one_still')],
    [28.6, 'david_do', 'perch_point'],
    [29.0, 'axel_look', WIN], [30.4, 'david_look', WIN],
    [31.4, 'david_do', loop('perch_still')],
    [31.6, () => out(2.6)], [34.6, () => inn(2.6, false)],
    [37.6, 'david_look', AXF], ...nod(38.4, 'david', AXF),
    [37.2, 'axel_look', DAVF],
    [38.4, 'axel_do', 'kneel_one_think'],
    [41.0, 'axel_look', GATE],
    hold(41.8),
  ]) },
  // 3b. lie — he shakes his head and looks at the floor. Axel waits, looking at him. The answer comes all the same: it
  //     lands in the boy's head, he jerks up, his eyes jump to the far window. Axel's eyes follow his — to the window —
  //     and come back. The boy nods. A hand in the beard; his eyes go to the gate.
  lie: { after: 'notice', rows: at(28.0, [
    [28.0, 'axel_do', loop('kneel_one_still')],
    [28.4, 'david_do', 'perch_shake'],
    [30.0, 'david_look', FLOOR_BY], [30.0, 'david_do', loop('perch_hunch')],
    [31.0, () => inn(2.8, false)],
    [33.3, 'david_look', WIN], [33.3, 'david_do', loop('perch_still')],
    [34.4, 'axel_look', WIN], [36.4, 'axel_look', DAVF],
    [35.8, 'david_look', AXF], ...nod(37.6, 'david', AXF),
    [38.4, 'axel_do', 'kneel_one_think'],
    [41.0, 'axel_look', GATE],
    hold(41.8),
  ]) },
  // 4. door — he gets up; to the gate; a look out both ways; he slides the door half shut, backing with it.
  door: { after: ['truth', 'lie'], rows: at(41.6, [
    [41.6, once('axel', 'kneel_one_rise', 270)],
    [41.4, 'camera_z', 0, 3.0, 'inOut'], [41.4, 'camera_x', 0, 3.0, 'inOut'],
    [43.4, 'david_look', [3.2, 7.0, 1.6]], [44.0, 'david_do', loop('perch_hunch')],
    ...walk(43.6, 'axel', [[3.2, 7.0]], 3.8, 60),
    [47.6, 'axel_look', YARD_L], [49.4, 'axel_look', YARD_R], [50.8, 'axel_look', [4.3, 7.4, 1.2]],
    ...walk(51.2, 'axel', [[3.85, 7.0]], 1.2, 90),
    [52.6, 'axel_reach', { r: 'wall#grip_low', l: 'wall#grip_high' }],
    [53.8, 'door', 0.7, 3.0, 'inOut'],
    [53.8, 'axel_gait', 'limp_back'], ...walk(53.8, 'axel', [[2.8, 7.0]], 3.0, null, 'inOut', 90),
    [57.0, 'axel_reach', null], [57.0, 'axel_gait', null],
  ]) },
  // 5. hush — back to the boy, down on the knee, close: finger to the lips; a tap at the temple; both hands on his
  //    shoulders; no. The boy nods twice.
  hush: { after: 'door', rows: at(57.6, [
    [57.6, 'axel_look', DAV], [58.2, 'david_look', AXF],
    ...walk(57.8, 'axel', [[2.6, 4.75]], 3.0),
    [60.9, once('axel', 'kneel_one', 270, AXH)], [61.2, 'axel_look', DAVF],
    [61.6, 'camera_z', 1.4, 3.5, 'inOut'], [61.6, 'camera_x', 1.5, 3.5, 'inOut'],
    [63.8, 'axel_do', loop('kneel_one_still')],
    [65.0, 'axel_do', 'kneel_one_hush'], [67.0, 'axel_do', loop('kneel_one_still')],
    [67.4, 'axel_do', 'kneel_one_temple'], [69.2, 'axel_do', loop('kneel_one_still')],
    [69.6, 'axel_reach', { l: 'david#shoulder_r', r: 'david#shoulder_l' }],
    [70.6, 'axel_do', 'kneel_one_shake'],
    ...nod(72.9, 'david', AXF, 2),
    hold(74.2),
  ]) },
  // 6. lantern (canon) — a lantern beyond the door: David's father crosses the yard. Axel is up and back at the anvil,
  //    hammering; the boy turns away and looks at his feet. The father stops in the gap, lifts the lantern, looks in;
  //    Axel nods to him; he goes.
  lantern: { after: 'hush', rows: at(74.2, [
    [74.2, 'axel_reach', null], [74.2, 'axel_do', loop('kneel_one_still')],
    [74.6, 'st_on', 1, 0.8], ...walk(74.6, 'joseph', [[1.9, 8.4]], 4.2),
    [75.2, 'axel_look', GATE], [75.4, 'david_look', GATE],
    [75.2, 'camera_z', 0, 1.8, 'inOut'], [75.2, 'camera_x', 0, 1.8, 'inOut'],
    [75.8, once('axel', 'kneel_one_rise', 270)],
    [76.6, 'david_do', loop('perch_slump')], [76.6, 'david_look', [2.0, 4.2, 0.0]],
    [77.0, 'axel_look', ANVIL], ...walk(77.4, 'axel', [[1.4, 4.98], AT_ANVIL], 2.8, 270),
    [80.2, 'axel_do', 'pick_up'], [80.9, 'axel_with', TOOLS],
    [81.6, 'ax_work', 1],
    [79.0, 'joseph_turn', 180], [79.0, 'st_lx', DAV[0]], [79.0, 'st_lz', DAV[1]],
    [79.4, 'st_lamp', 1],
    [82.6, 'axel_look', JOS], ...nod(83.2, 'axel', JOS), [84.2, 'axel_look', ANVIL],
    [84.6, 'st_lamp', 0],
    [85.2, 'joseph_turn', 270], [85.2, 'st_lx', -5], [85.2, 'st_lz', 8.4],
    ...walk(85.6, 'joseph', [[0.3, 8.4]], 3.6),
    [89.4, 'st_on', 0, 0.8],
  ]) },
  // 7. after (canon) — gone. Axel lowers the hammer and looks at the boy; the boy looks back. One slow nod. The boy
  //    turns to the far light and, without moving at all, talks to it. Axel goes back to work — and so on.
  after: { after: 'lantern', rows: at(90.0, [
    [90.0, 'ax_work', 0], [90.6, 'axel_do', 'stand'], [90.6, 'axel_reach', null], [90.6, 'axel_turn', 150],
    [90.4, 'axel_look', DAVF],
    [90.8, 'david_do', loop('perch_still')], [91.0, 'david_look', [AT_ANVIL[0], AT_ANVIL[1], 1.6]],
    ...nod(92.4, 'axel', DAVF), [93.0, 'axel_look', DAVF],
    [94.0, 'david_look', WIN],
    [95.4, () => out(2.8)], [98.6, () => inn(2.8, false)],
    [96.0, 'axel_look', ANVIL], [96.0, 'axel_turn', 270],
    [97.4, 'ax_pace', 2.4], [97.4, 'ax_work', 1],
    [103.0, 'dv_chat', 13], [103.0, 'david_do', loop('perch')],
  ]) },

  // ---- the game's own beats ----
  // III.1, the lantern while David works the bellows: the father's lantern beyond the door; Axel back at the anvil;
  // the boy off the barrel and across the forge to the bellows' lever — he pulls it in time, as if he'd been at it
  // all along. The father stops in the gap, lifts the lantern, looks in. (Then the game's rhythm: ax_blow, pump.)
  lantern_bellows: { after: 'hush', rows: at(74.2, [
    [74.2, 'axel_reach', null], [74.2, 'axel_do', loop('kneel_one_still')],
    [74.6, 'st_on', 1, 0.8], ...walk(74.6, 'joseph', [[2.6, 8.4]], 5.4),
    [75.2, 'axel_look', GATE], [75.4, 'david_look', GATE],
    [75.2, 'camera_z', 0, 2.0, 'inOut'], [75.4, 'camera_x', -2.3, 4.6, 'inOut'],
    [75.8, once('axel', 'kneel_one_rise', 270)],
    [77.0, 'axel_look', ANVIL], ...walk(77.4, 'axel', [[1.4, 4.98], AT_ANVIL], 2.8, 270),
    [80.2, 'axel_do', 'pick_up'], [80.9, 'axel_with', TOOLS],
    // (off the barrel, sliding forward onto his feet; round in front of the anvil, running, to the lever)
    [76.0, 'david_turn', 180], [76.0, offBarrel()],
    [77.0, 'david_look', [-3, 4.2, 1.0]],
    [78.0, 'david_gait', 'run'], ...walk(78.0, 'david', [[0.4, 3.8], [-2.8, 3.95], [-5.4, 5.6], BELLOWS], 3.2, 90),
    [79.2, 'david_look', FIRE], [81.2, 'david_gait', null],
    [81.4, 'dv_pump', 1], [81.8, 'pump_work', 1.25],
    [81.6, 'ax_work', 1],
    [80.4, 'joseph_turn', 180], [80.4, 'st_lx', AT_ANVIL[0]], [80.4, 'st_lz', AT_ANVIL[1]],
    [80.8, 'st_lamp', 1],
    [82.8, 'st_lx', BELLOWS[0]], [82.8, 'st_lz', BELLOWS[1]],
    [82.6, 'david_look', JOSG], [83.4, 'david_look', FIRE],
    hold(84.2),
  ]) },
  // …he lowers the lantern; Axel nods to him over the hammer; he goes
  lantern_go: { after: 'lantern_bellows', rows: [
    [0, 'ax_work', 1], [0, 'pump_work', 1.25],
    [0.4, 'st_lx', AT_ANVIL[0]], [0.4, 'st_lz', AT_ANVIL[1]],
    [0.6, 'axel_look', JOSG], ...nod(1.2, 'axel', JOSG), [2.2, 'axel_look', ANVIL],
    [2.6, 'st_lamp', 0],
    [3.2, 'joseph_turn', 270], [3.2, 'st_lx', -5], [3.2, 'st_lz', 8.4],
    ...walk(3.6, 'joseph', [[0.3, 8.4]], 3.6),
    [7.4, 'st_on', 0, 0.8], [7.8, 'pump_work', 0],
  ] },
  // …or the bellows wheezed: the lantern comes up higher and stays on the boy; the father steps into the gap and looks
  // a long time. The boy keeps at the lever, eyes on the fire. Then he lowers it and goes.
  lantern_linger: { after: 'lantern_bellows', rows: [
    [0, 'ax_work', 1], [0, 'pump_work', 1.25],
    [0.2, 'joseph_turn', 215], [0.2, 'st_lx', BELLOWS[0]], [0.2, 'st_lz', BELLOWS[1]],
    [0.4, 'st_lamp', 1.3],
    ...walk(0.6, 'joseph', [[2.5, 7.8]], 1.6, 215),
    [1.4, 'david_look', JOSG], [2.2, 'david_look', FIRE],
    [6.6, 'st_lamp', 0],
    [7.2, 'joseph_turn', 270], [7.2, 'st_lx', -5], [7.2, 'st_lz', 8.4],
    ...walk(7.4, 'joseph', [[0.3, 8.4]], 3.8),
    [11.4, 'st_on', 0, 0.8], [11.8, 'pump_work', 0],
  ] },
  // …gone. Axel lowers the hammer and looks across at the boy at the bellows; the boy looks back; the camera comes
  // closer to them both. One slow nod.
  rest: { after: ['lantern_go', 'lantern_linger'], rows: [
    [0, 'ax_work', 0], [0, 'pump_work', 0],
    [0.6, 'axel_do', 'stand'], [0.6, 'axel_reach', null], [0.6, 'axel_turn', 280],
    [0.6, 'camera_z', 1.2, 5.0, 'inOut'], [0.6, 'camera_x', -3.2, 5.0, 'inOut'],
    [0.8, 'axel_look', DVB],
    [1.0, 'dv_pump', 0], [1.0, 'david_do', 'stand'],
    [1.2, 'david_look', [AT_ANVIL[0], AT_ANVIL[1], 1.6]], [1.4, 'david_turn', 120],
    ...nod(2.6, 'axel', DVB), ...nod(4.4, 'david', [AT_ANVIL[0], AT_ANVIL[1], 1.6]),
    hold(5.6),
  ] },
  // III.5, (Anne) a tableau — night, the fire low, the door half shut. David on the barrel, turned to Axel, telling him;
  // Axel by the bench, the hammer laid down, his hand in his beard, listening, looking at the floor.
  night_anne: { rows: [
    [0, 'fade', 0, 2.5, 'out'],
    [1.2, 'axel_do', 'think'],
    [3.5, 'axel_look', [0.8, 4.4, 0.1]],
    [6.0, 'david_do', loop('perch_still')],
    hold(9),
  ] },
  // …"go to bed, Davie": his hand from the beard, a look at the boy, a nod at the door; the boy slips off the barrel and
  // out into the night; Axel turns to the fire
  night_anne_end: { after: 'night_anne', rows: [
    [0, 'axel_do', 'stand'],
    [0.3, 'axel_look', DAVF],
    [0.6, 'david_do', loop('perch_still')],
    ...nod(1.4, 'axel', DAVF),
    [1.6, 'axel_look', GATE], [2.6, 'axel_look', DAVF],
    [3.6, offBarrel()],
    [4.4, 'david_look', GATE],
    ...walk(5.4, 'david', [[1.8, 5.2], [2.2, 7.4], [3.2, 9.6], [5.6, 10.6]], 7.0),
    [5.0, 'axel_look', GATE],
    [9.0, 'axel_turn', 280], [9.0, 'axel_look', FIRE],
    [9.0, 'fade', 0.25, 3],
    [12.4, 'david_here', false],
  ] },
  // V.2, the key: a tableau — night, the door half shut, the fire up; Axel at the anvil making the key, quick light blows;
  // David at the bellows, pulling the lever between them.
  key: { rows: [
    [0, 'fade', 0, 2.5, 'out'],
    hold(6),
  ] },
  // …a lantern in the yard: a man comes to the gap, stops, lifts it and looks in — at the anvil, at the boy
  stranger: { after: 'key', rows: [
    [0, 'st_on', 1, 0.8], ...walk(0, 'farmhand', [[2.6, 8.4]], 4.6),
    [1.4, 'david_look', JOSG], [2.6, 'david_look', FIRE],
    [4.6, 'farmhand_turn', 180], [4.6, 'st_lx', AT_ANVIL[0]], [4.6, 'st_lz', AT_ANVIL[1]],
    [5.0, 'st_lamp', 1],
    [6.8, 'st_lx', BELLOWS[0]], [6.8, 'st_lz', BELLOWS[1]],
    [7.0, 'axel_look', JOSG],
    hold(8.0),
  ] },
  // …(the rhythm held) he lowers the lantern and goes
  stranger_go: { after: 'stranger', rows: [
    [0, 'ax_work', 1], [0, 'pump_work', 1.3],
    [0.4, 'axel_look', ANVIL],
    [1.0, 'st_lamp', 0],
    [1.6, 'farmhand_turn', 90], [1.6, 'st_lx', 9], [1.6, 'st_lz', 8.4],
    ...walk(2.0, 'farmhand', [[4.6, 8.4]], 3.6),
    [5.6, 'st_on', 0, 0.8],
  ] },
  // …(he knew) he puts two fingers to his mouth and whistles; two more lanterns come up out of the dark behind him. Axel
  // stands with the hammer up; the boy lets go of the lever, turns to him and shakes his head: don't. The hammer goes
  // down. The man steps inside.
  caught: { after: 'stranger', rows: [
    [0, 'ax_work', 0], [0, 'pump_work', 0],
    [0.2, 'farmhand_do', 'whistle'],
    [0.3, 'axel_do', 'smith_strike'], [1.0, 'axel_do', 'raise_hammer'],
    [0.5, 'axel_look', JOSG], [0.8, 'david_look', JOSG],
    [1.4, 'st_more', 1],
    [2.4, 'dv_pump', 0], [2.5, 'david_do', 'stand'],
    [3.6, 'david_turn', 120], [3.8, 'david_look', [AT_ANVIL[0], AT_ANVIL[1], 1.6]],
    ...shake(4.4, 'david', [AT_ANVIL[0], AT_ANVIL[1], 1.6], [0.0, 0.5]),
    [4.6, 'axel_look', DVB],
    [6.4, 'axel_do', 'stand'], [6.4, 'axel_reach', null],
    [7.4, 'axel_look', JOSG],
    ...walk(7.0, 'farmhand', [[2.3, 7.0]], 1.8),
    [8.0, 'st_lamp', 0.6], [8.0, 'st_lx', AT_ANVIL[0]], [8.0, 'st_lz', AT_ANVIL[1]],
    hold(9.0),
  ] },
  // …(force) the boy looks at Axel, at the gap: a nod. Axel stops, the hammer comes up; he limps to the gap; the man
  // turns his head too late. The blow: the man falls on his back into the yard, his lantern falls and goes out in the
  // yard. Axel stands in the gap. The fire sinks.
  strike: { after: 'stranger', rows: [
    [0, 'pump_work', 0],
    [0.2, 'david_look', [AT_ANVIL[0], AT_ANVIL[1], 1.6]], [0.2, 'david_turn', 120],
    [0.6, 'dv_pump', 0], [0.7, 'david_do', 'stand'],
    [1.4, 'axel_look', DVB],
    ...nod(1.6, 'david', [AT_ANVIL[0], AT_ANVIL[1], 1.6]),
    [2.4, 'david_look', JOSG],
    [2.6, 'ax_work', 0],
    [3.0, 'axel_turn', 110], [3.0, 'axel_reach', null], [3.2, 'axel_look', JOSG],
    ...walk(3.4, 'axel', [[1.7, 5.05], [2.45, 7.25]], 2.7, 30),
    [5.8, 'st_lx', 2.45], [5.8, 'st_lz', 7.25],
    [6.1, 'axel_do', 'raise_hammer'],
    [6.5, 'axel_do', { motion: 'smith_strike', loop: false, from: TOP }],
    [6.95, 'farmhand_do', 'fall_back'], [6.95, 'st_drop', 1], [6.95, 'st_lanx', 2.9],
    [7.0, 'st_glow', 0.35, 0.6, 'out'], [7.6, 'st_glow', 0, 5.0],
    [7.0, 'fire', 0.3, 3.0],
    [8.0, 'axel_do', 'stand'],
    [8.2, 'axel_look', [2.75, 9.3, 0]],
    hold(10.0),
  ] },
};
// what each beat begins at: the state after the beats that lead to it — worked out as it begins (where a motion done
// once takes someone is the motion's: the people know it once they are here)
const chain = (base, ...names) => names.reduce((st, n) => settle(st, B[n].rows), base);
const from = (name, make) => Object.defineProperty(B[name], 'from', { get: make, enumerable: true });
const CANON = ['chatter', 'notice', 'truth', 'door', 'hush', 'lantern', 'after'];
from('chatter', () => START);
from('notice', () => chain(START, 'chatter'));
for (const n of ['truth', 'lie']) from(n, () => chain(START, 'chatter', 'notice'));
from('door', () => chain(START, 'chatter', 'notice', 'truth'));
from('hush', () => chain(START, 'chatter', 'notice', 'truth', 'door'));
for (const n of ['lantern', 'lantern_bellows']) from(n, () => chain(START, 'chatter', 'notice', 'truth', 'door', 'hush'));
from('after', () => chain(START, ...CANON.slice(0, 6)));
const BELL = ['chatter', 'notice', 'truth', 'door', 'hush', 'lantern_bellows'];
for (const n of ['lantern_go', 'lantern_linger']) from(n, () => chain(START, ...BELL));
from('rest', () => chain(START, ...BELL, 'lantern_go'));
// the night of Anne: the fire low, the door half shut; Axel by the bench, his tools laid down; the boy on the barrel,
// turned to him, telling
const ANNE = {
  ...START, fade: 1, fire: 0.35, door: 0.7,
  ax_a: 0.3, ax_d: 4.7, axel_turn: 90, axel_with: null, axel_look: DAVF, axel_do: 'stand',
  david_turn: 270, david_do: loop('perch_talk'), david_look: [0.3, 4.7, 1.6],
};
from('night_anne', () => ANNE);
from('night_anne_end', () => settle(ANNE, B.night_anne.rows));
// the night of the key: the door half shut, the fire up; Axel at the anvil, quick light blows; David at the bellows
const KEY = {
  ...START, fade: 1, fire: 0.6, door: 0.7, camera_x: -2.3, ax_work: 1, ax_pace: 1.4, axel_look: ANVIL,
  david_on: null, dv_a: BELLOWS[0], dv_d: BELLOWS[1], david_turn: 90, david_do: 'stand', dv_pump: 1, pump_work: 1.3,
  david_look: FIRE, st_who: 'farmhand',
};
from('key', () => KEY);
for (const n of ['stranger']) from(n, () => settle(KEY, B.key.rows));
for (const n of ['stranger_go', 'caught', 'strike']) from(n, () => chain(KEY, 'key', 'stranger'));
man();
atLever();
s.kit.film.beats(s, B, { film: CANON });
