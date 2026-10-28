// Uncle Axel’s forge (engine 3): what its elements and its scripts share — the thought-shapes, where things are, the
// horse in the yard, and the film: the beats a game plays one at a time by `beat` (script.js, the world's module beats)
// and the showcase plays in order (showcase.js). The people are the engine's (the world's cast): Axel's place ax_a/ax_d,
// David's dv_a/dv_d, the man with the lantern st_a/st_d (joseph or farmhand — st_who), the two called out of the dark
// w0_*, w1_*; _do, _turn (0 away from us, 90 right, 180 toward us, 270 left), _look, _reach, _with, _gait, _on, _here.
const { clamp } = anim;
// ── the thought-shape: three soft arcs going its way (dir: radians on screen) and a halo — light, painted once; its
// animate (flight) fades it along its way and stirs the arcs ──
function shape(g, e, dir, r) {
  const box = [-r * 2.5, -r * 2.5, r * 2.5, r * 2.5];
  e.layer('halo', { blend: 'add', box }, q => {
    const gl = q.createRadialGradient(0, 0, 0, 0, 0, r * 2.4);
    gl.addColorStop(0, 'rgba(190,200,255,0.3)');
    gl.addColorStop(1, 'rgba(190,200,255,0)');
    q.fillStyle = gl;
    q.fillRect(-r * 2.5, -r * 2.5, r * 5, r * 5);
  });
  e.layer('arcs', { blend: 'add', pivot: [0, 0], box }, q => {
    q.lineCap = 'round';
    for (let i = 0; i < 3; i++) {
      const rr = r * (0.45 + i * 0.42);
      q.strokeStyle = `rgba(208,216,255,${(0.9 - i * 0.24).toFixed(2)})`;
      q.lineWidth = r * 0.1;
      q.beginPath();
      q.arc(-Math.cos(dir) * r * 0.9, -Math.sin(dir) * r * 0.9, rr, dir - 0.8, dir + 0.8);
      q.stroke();
    }
  });
}
// along its way u (0 at David's head … 1 at the window): seen only in flight, brightest in the middle; the arcs stirring
function flight(e, u, amp) {
  const env = u > 0.003 && u < 0.997 ? Math.min(1, u / 0.04) * Math.min(1, (1 - u) / 0.12) * amp : 0;
  e.layer('halo').alpha = env;
  const A = e.layer('arcs');
  A.alpha = env;
  A.rotate = 0.08 * Math.sin(e.t * 3);
}
// David's head on the barrel (across, height, distance) — where his thoughts go out from — and the far window
const HEAD = [1.3, 1.28, 4.3], WIN = [23.6, 7.6, 60];
// the horse dozing in the yard (the world's module chrysalids): its fixed keys
const HORSE = { kind: 'horse', across: 'hz_a', distance: 'hz_d', face: 'hz_face' };

// ── where things are (metres: across, distance, elevation) ──
const ANVIL = [-1.05, 4.62, 0.88], // the iron on the anvil, where the hammer falls
  // where Axel stands to work it: his blow (smith_strike) lands half a metre before his pelvis, on his middle — there
  AT_ANVIL = [ANVIL[0] + 0.49, ANVIL[1] + 0.03],
  BARREL = [1.3, 4.32, 0.7], // the barrel's top, where David sits
  DAV = [1.3, 4.3, 1.25], DAVF = [1.3, 4.3, 1.15], // the boy's face on the barrel, a little lower
  AXH = [1.95, 4.5], AXF = [1.95, 4.5, 1.2], // where Axel kneels by the boy (facing him) — against the gate's bright gap
  GATE = [2.4, 10, 1.5], FAR = [23.6, 60, 7.6],
  JOSG = [2.6, 8.4, 1.7], // the man in the gap
  FIRE = [-3.8, 6.5, 0.95],
  BELLOWS = [-6.15, 6.3], DVB = [-6.15, 6.3, 1.25], // where David stands to work the bellows' lever; his face there
  FLOOR_BY = [2.0, 4.2, 0.0], // the floor at the boy's feet
  YARD_L = [-6, 13, 1.6], YARD_R = [9, 13, 1.6]; // the yard to the left and to the right of the gate
const TOOLS = ['hammer', 'tongs'];
// the camera's places (camera_x, camera_z): the forge; on Axel kneeling by the boy; closer (the hush); on the bellows and
// the anvil both (the boy at the lever, Axel at the hammer — “The bellows’ rhythm”: both in the frame's middle); the two at rest
const CAM = { wide: [0, 0], kneel: [1.0, 1.1], hush: [1.5, 1.4], bellows: [-3.03, -1.6], rest: [-3.2, 1.2] };
const camOf = c => ({ camera_x: c[0], camera_z: c[1] });
const loop = motion => ({ motion, loop: true });

// ── what a beat does ──
const PLACE = { axel: ['ax_a', 'ax_d'], david: ['dv_a', 'dv_d'], joseph: ['st_a', 'st_d'], farmhand: ['st_a', 'st_d'], watch0: ['w0_a', 'w0_d'], watch1: ['w1_a', 'w1_d'] };
const here = (s, id) => PLACE[id].map(k => s.state[k]);
const once = (s, id, motion, turn, to) => s.person(id).go(motion, { ...(to ? { to } : { from: here(s, id) }), turn: turn ?? s.state[`${id}_turn`] });
async function walk(s, id, pts, turn, gait) {
  s.set(`${id}_steps`, true);
  if (gait !== undefined) s.person(id).gait(gait);
  await s.person(id).walk(pts);
  if (gait !== undefined) s.person(id).gait(null);
  if (turn != null) await s.person(id).turn(turn);
}
const cam = (s, c, over) => s.all(s.move('camera_x', c[0], { over }), s.move('camera_z', c[1], { over }));
const aside = (s, fn) => s.sequence(fn);
// a nod: the head down a little toward what they look at and up again, n times
const lower = (p, by) => (typeof p === 'string' ? `${p}#chest` : [p[0], p[1], p[2] - by]);
async function nod(s, id, p, n = 1) {
  for (let i = 0; i < n; i++) {
    s.person(id).look(lower(p, 0.32));
    await s.wait(0.3);
    s.person(id).look(p);
    await s.wait(0.3);
  }
}
// a shake of the head: the eyes from one side of what they look at to the other, n times
async function shake(s, id, p, side, n = 2) {
  for (let i = 0; i < n; i++) {
    s.person(id).look([p[0] + side[0], p[1] + side[1], p[2]]);
    await s.wait(0.25);
    s.person(id).look([p[0] - side[0], p[1] - side[1], p[2]]);
    await s.wait(0.25);
  }
  s.person(id).look(p);
}
// a thought-shape from David's head to the far window over `dur`; an answer back (the glow in his head as it lands)
const way = (a, b) => [[a[0], a[1], a[2]], [b[0], b[1], b[2]]];
function out(s, dur) {
  return s.path(['tho_a', 'tho_e', 'tho_d'], way(HEAD, WIN), { over: dur, ease: 'in' });
}
async function inn(s, dur) {
  await s.path(['thi_a', 'thi_e', 'thi_d'], way(WIN, HEAD), { over: dur, ease: 'out' });
  s.set('thi_d', HEAD[2]);
  await s.move('dv_glow', 1, { over: 0.3 });
  await s.wait(0.3);
  s.move('dv_glow', 0, { over: 1.4 });
}
// off the barrel onto his feet (he slides forward off it): where he lands is the motion's
function offBarrel(s) {
  s.set('david_on', null);
  return s.person('david').do('hop_down');
}
// the man with the lantern: where he looks and holds it (st_lx, st_lz), how high (st_lamp) — script.js lays his hand
const lantern = (s, at, up) => { s.set('st_lx', at[0]); s.set('st_lz', at[1]); if (up != null) s.set('st_lamp', up); };

// ── the state the beats begin at ──
const START = {
  ...camOf(CAM.wide), fire: 0.75, sparks: 0.5, door: 1, pump: 0,
  ax_a: AT_ANVIL[0], ax_d: AT_ANVIL[1], ax_work: 0, ax_pace: 2, ax_blow: 0,
  axel_do: 'stand', axel_turn: 270, axel_look: ANVIL, axel_reach: null, axel_with: TOOLS, axel_steps: true, axel_gait: null,
  dv_a: BARREL[0], dv_d: BARREL[1], dv_chat: 0, dv_glow: 0, dv_pump: 0, pump_work: 0,
  david_on: BARREL, david_do: loop('perch'), david_turn: 90, david_look: [12, 40, 5], david_reach: null, david_steps: true, david_gait: null, david_here: true,
  david_wear: null,
  th_amp: 1, tho_a: HEAD[0], tho_e: HEAD[1], tho_d: HEAD[2], thi_a: HEAD[0], thi_e: HEAD[1], thi_d: HEAD[2],
  st_on: 0, st_who: 'joseph', st_a: 5.8, st_d: 8.4, st_lamp: 0, st_lx: -5, st_lz: 8.4, st_drop: 0, st_glow: 1, st_lanx: 2.9, st_more: 0,
  joseph_do: 'stand', joseph_turn: 270, joseph_steps: true, farmhand_do: 'stand', farmhand_turn: 270, farmhand_steps: true,
  w0_a: 9.5, w0_d: 10, w1_a: 11.5, w1_d: 10.6, watch0_here: false, watch1_here: false, watch0_turn: 270, watch1_turn: 270,
  watch0_look: null, watch1_look: null, watch0_reach: null, watch1_reach: null, watch0_steps: true, watch1_steps: true,
};
// the boy in the open hand's question: Axel on one knee by him, his hand open — "who?"
const ASKED = {
  ...START, ...camOf(CAM.kneel), ax_a: AXH[0], ax_d: AXH[1], axel_turn: 270, axel_do: loop('kneel_one_still'), axel_with: null,
  axel_look: DAVF, david_do: loop('perch_hunch'), david_look: AXF,
};
// …he knows: Axel's hand in his beard, his eyes on the gate
const KNOWN = { ...ASKED, axel_do: loop('kneel_one_think'), axel_look: GATE, david_do: loop('perch_still') };
// the door half shut, Axel by it (where hush begins)
const SHUT = { ...KNOWN, ...camOf(CAM.wide), door: 0.7, ax_a: 2.8, ax_d: 7.0, axel_turn: 90, axel_do: 'stand', axel_look: DAV, david_do: loop('perch_hunch'), david_look: [3.2, 7.0, 1.6] };
// hushed: Axel on his knee close by the boy, his hands on his shoulders (where lantern and lantern_bellows begin)
const HUSHED = { ...SHUT, ...camOf(CAM.hush), ax_a: AXH[0], ax_d: AXH[1], axel_turn: 270, axel_do: loop('kneel_one_still'), axel_look: DAVF,
  axel_reach: { l: 'david#shoulder_r', r: 'david#shoulder_l' }, david_do: loop('perch_still'), david_look: AXF };
// the father's lantern gone by (where after begins): Axel at the anvil at work, the boy slumped on the barrel
const PASSED = { ...HUSHED, ...camOf(CAM.wide), ax_a: AT_ANVIL[0], ax_d: AT_ANVIL[1], axel_with: TOOLS, axel_reach: null, axel_do: 'stand', axel_look: ANVIL,
  david_do: loop('perch_slump'), david_look: FLOOR_BY, ax_work: 1 };
// the boy at the bellows, Axel at the anvil, the father in the gap with his lantern up (where lantern_go / linger begin)
const AT_BELLOWS = { ...PASSED, ...camOf(CAM.bellows), david_on: null, dv_a: BELLOWS[0], dv_d: BELLOWS[1], david_turn: 90, david_do: 'stand', david_look: FIRE,
  dv_pump: 1, pump_work: 1.25, st_on: 1, st_who: 'joseph', st_a: JOSG[0], st_d: JOSG[1], joseph_turn: 180, st_lamp: 1, st_lx: BELLOWS[0], st_lz: BELLOWS[1] };
// …the father gone (where rest begins)
const LEFT = { ...AT_BELLOWS, st_on: 0, st_lamp: 0, ax_work: 1, pump_work: 0 };
// the night of Anne: the fire low, the door half shut; Axel by the bench, his tools laid down; the boy on the barrel, turned
// to him, telling
const ANNE = { ...START, fire: 0.35, door: 0.7, ax_a: 0.3, ax_d: 4.7, axel_turn: 90, axel_with: null, axel_look: DAVF, axel_do: 'stand',
  david_turn: 270, david_do: loop('perch_talk'), david_look: [0.3, 4.7, 1.6] };
// the night of the key (years later: David nearly grown — the cast's david_teen over him): the door half shut, the fire
// up; Axel at the anvil, quick light blows; David at the bellows
const KEY = { ...START, fire: 0.6, door: 0.7, ...camOf(CAM.bellows), ax_work: 1, ax_pace: 1.4, axel_look: ANVIL, david_wear: kit.cast.characters.david_teen,
  david_on: null, dv_a: BELLOWS[0], dv_d: BELLOWS[1], david_turn: 90, david_do: 'stand', dv_pump: 1, pump_work: 1.3, david_look: FIRE, st_who: 'farmhand' };
// …the man in the gap with his lantern up, looking at the boy (where stranger_go, caught and strike begin)
const LOOKED = { ...KEY, st_on: 1, st_a: JOSG[0], st_d: JOSG[1], farmhand_turn: 180, st_lamp: 1, st_lx: BELLOWS[0], st_lz: BELLOWS[1], axel_look: JOSG };

const FILM = {
  // 1. chatter — the night forge. Axel at the anvil, his back to the boy. David on the barrel faces the open
  //    gate and chatters away to no one; thought-shapes go out to a far lit window and come back; he laughs.
  chatter: {
    from: () => START,
    run: async s => {
      s.person('david').do('perch_talk', { loop: true });
      s.set('dv_chat', 7.2);
      await s.wait(0.6);
      s.set('ax_work', 1);
      await s.wait(10);
    },
  },
  // 2. notice — the hammer stops at the top of a swing. He listens; lays the hammer down; turns; looks at the empty gate,
  //    at the boy. He limps over, round behind the boy; the boy falls silent, shrinks. Down on the knee against the
  //    gate's bright gap, a hand on the shoulder, an open hand: "who?" — held (the game's choice: on david).
  notice: {
    after: 'chatter',
    from: () => ({ ...START, ax_work: 1, dv_chat: 7.2, david_do: loop('perch_talk') }),
    run: async s => {
      const axel = s.person('axel'), david = s.person('david');
      s.set('ax_work', 0);
      s.set('dv_chat', 0);
      await axel.do('raise_hammer');
      axel.look(DAV);
      aside(s, q => inn(q, 2.8));
      await s.wait(1.4);
      axel.reach(null);
      axel.look(ANVIL);
      await axel.do('put_down');
      axel.with(null);
      await axel.turn(90);
      axel.do('stand');
      axel.look(GATE);
      await s.wait(1.7);
      axel.look(DAV);
      await s.wait(0.9);
      const comes = walk(s, 'axel', [[0.5, 5.15], [1.9, 5.05], [2.6, 4.75]]);
      await s.wait(0.8);
      david.do('perch_still', { loop: true });
      await s.wait(0.4);
      david.look([0.3, 4.8, 1.6]);
      await s.wait(0.6);
      david.do('perch_hunch', { loop: true });
      await s.wait(1.0);
      david.look([1.4, 4.9, 1.7]);
      await comes;
      cam(s, CAM.kneel, 4.5);
      await once(s, 'axel', 'kneel_one', 270, AXH);
      axel.look(DAVF);
      david.look(AXF);
      axel.do('kneel_one_still', { loop: true });
      await s.wait(0.2);
      axel.reach({ l: 'david#shoulder_r' });
      await s.wait(1.0);
      axel.reach(null);
      await s.wait(0.2);
      axel.do('kneel_one_ask');
      await s.wait(1.2);
    },
  },
  // 3a. truth (canon) — he points over at the far light: a shape goes out, an answer comes back; he nods. Axel
  //     understands: a hand in the beard; his eyes go to the open gate.
  truth: {
    after: 'notice',
    from: () => ASKED,
    run: async s => {
      const axel = s.person('axel'), david = s.person('david');
      axel.do('kneel_one_still', { loop: true });
      await s.wait(0.6);
      david.do('perch_point');
      await s.wait(0.4);
      axel.look(FAR);
      await s.wait(1.4);
      david.look(FAR);
      s.tell('truth:window'); // (both look out to her window across the field)
      await s.wait(1.0);
      david.do('perch_still', { loop: true });
      await s.wait(0.2);
      await out(s, 2.6);
      await s.wait(0.4);
      await inn(s, 2.6);
      david.look(AXF);
      axel.look(DAVF);
      await s.wait(0.8);
      await nod(s, 'david', AXF);
      s.tell('truth:ask'); // (Axel thinks it over)
      axel.do('kneel_one_think', { loop: true });
      await s.wait(2.0);
      axel.look(GATE);
      await s.wait(0.8);
    },
  },
  // 3b. lie — he shakes his head and looks at the floor. Axel waits, looking at him. The answer comes all the same: it
  //     lands in the boy's head, he jerks up, his eyes jump to the far window. Axel's eyes follow his — to the window —
  //     and come back. The boy nods. A hand in the beard; his eyes go to the gate.
  lie: {
    after: 'notice',
    from: () => ASKED,
    run: async s => {
      const axel = s.person('axel'), david = s.person('david');
      axel.do('kneel_one_still', { loop: true });
      await s.wait(0.4);
      await david.do('perch_shake');
      david.look(FLOOR_BY);
      david.do('perch_hunch', { loop: true });
      await s.wait(1.0);
      await inn(s, 2.8);
      david.look(FAR);
      david.do('perch_still', { loop: true });
      await s.wait(1.1);
      axel.look(FAR);
      await s.wait(1.4);
      david.look(AXF);
      await s.wait(0.6);
      axel.look(DAVF);
      await s.wait(1.2);
      await nod(s, 'david', AXF);
      s.tell('lie:ask'); // (Axel thinks it over)
      axel.do('kneel_one_think', { loop: true });
      await s.wait(2.4);
      axel.look(GATE);
      await s.wait(0.8);
    },
  },
  // 4. door — he gets up; to the gate; a look out both ways; he slides the door half shut, backing with it.
  door: {
    after: ['truth', 'lie'],
    from: () => KNOWN,
    run: async s => {
      const axel = s.person('axel'), david = s.person('david');
      cam(s, CAM.wide, 3.0);
      await once(s, 'axel', 'kneel_one_rise', 270);
      david.look([3.2, 7.0, 1.6]);
      david.do('perch_hunch', { loop: true });
      await walk(s, 'axel', [[3.2, 7.0]], 60);
      axel.look(YARD_L);
      await s.wait(1.8);
      axel.look(YARD_R);
      await s.wait(1.4);
      axel.look([4.3, 7.4, 1.2]);
      await walk(s, 'axel', [[3.85, 7.0]], 90);
      axel.reach({ r: 'door#grip_low', l: 'door#grip_high' });
      await s.wait(1.2);
      // (backing with it, the door sliding half across)
      s.set('axel_turn', 90);
      const slides = s.move('door', 0.7, { over: 3.0, ease: 'inOut' });
      await walk(s, 'axel', [[2.8, 7.0]], null, 'limp_back');
      await slides;
      axel.reach(null);
    },
  },
  // 5. hush — back to the boy, down on the knee, close: finger to the lips; a tap at the temple; both hands on his
  //    shoulders; no. The boy nods twice.
  hush: {
    after: 'door',
    from: () => SHUT,
    run: async s => {
      const axel = s.person('axel'), david = s.person('david');
      axel.look(DAV);
      await s.wait(0.6);
      david.look(AXF);
      await walk(s, 'axel', [[2.6, 4.75]]);
      cam(s, CAM.hush, 3.5);
      await once(s, 'axel', 'kneel_one', 270, AXH);
      axel.look(DAVF);
      axel.do('kneel_one_still', { loop: true });
      await s.wait(1.0);
      s.tell('hush:finger'); // (his finger to his lips)
      await axel.do('kneel_one_hush');
      axel.do('kneel_one_still', { loop: true });
      await s.wait(0.4);
      await axel.do('kneel_one_temple');
      axel.do('kneel_one_still', { loop: true });
      await s.wait(0.4);
      axel.reach({ l: 'david#shoulder_r', r: 'david#shoulder_l' });
      await s.wait(1.0);
      await axel.do('kneel_one_shake');
      await nod(s, 'david', AXF, 2);
      await s.wait(0.4);
    },
  },
  // 6. lantern (canon) — a lantern beyond the door: David's father crosses the yard. Axel is up and back at the anvil,
  //    hammering; the boy turns away and looks at his feet. The father stops in the gap, lifts the lantern, looks in;
  //    Axel nods to him; he goes.
  lantern: {
    after: 'hush',
    from: () => HUSHED,
    run: async s => {
      const axel = s.person('axel'), david = s.person('david'), joseph = s.person('joseph');
      axel.reach(null);
      s.set('st_who', 'joseph');
      s.set('st_on', 1);
      const comes = walk(s, 'joseph', [[1.9, 8.4]]);
      await s.wait(0.6);
      axel.look(GATE);
      david.look(GATE);
      cam(s, CAM.wide, 1.8);
      await s.wait(0.6);
      const up = once(s, 'axel', 'kneel_one_rise', 270);
      await s.wait(0.8);
      david.do('perch_slump', { loop: true });
      david.look(FLOOR_BY);
      await up;
      axel.look(ANVIL);
      const back = walk(s, 'axel', [[1.4, 4.98], AT_ANVIL], 270);
      await comes;
      await joseph.turn(180);
      lantern(s, DAV, 1);
      await back;
      await axel.do('pick_up');
      axel.with(TOOLS);
      s.set('ax_work', 1);
      await s.wait(1.0);
      axel.look(JOSG);
      await s.wait(0.6);
      await nod(s, 'axel', JOSG);
      axel.look(ANVIL);
      await s.wait(0.4);
      s.set('st_lamp', 0);
      await s.wait(0.6);
      lantern(s, [-5, 8.4]);
      await joseph.turn(270);
      await walk(s, 'joseph', [[0.3, 8.4]]);
      s.set('st_on', 0);
    },
  },
  // 7. after (canon) — gone. Axel lowers the hammer and looks at the boy; the boy looks back. One slow nod. The boy turns to
  //    the far light and, without moving at all, talks to it. Axel goes back to work — and so on.
  after: {
    after: 'lantern',
    from: () => PASSED,
    run: async s => {
      const axel = s.person('axel'), david = s.person('david');
      s.set('ax_work', 0);
      await s.wait(0.6);
      axel.do('stand');
      axel.reach(null);
      axel.look(DAVF);
      await axel.turn(150);
      david.do('perch_still', { loop: true });
      david.look([AT_ANVIL[0], AT_ANVIL[1], 1.6]);
      await s.wait(1.2);
      await nod(s, 'axel', DAVF);
      await s.wait(0.6);
      david.look(FAR);
      await s.wait(1.4);
      const talk = out(s, 2.8);
      await s.wait(0.6);
      axel.look(ANVIL);
      await axel.turn(270);
      await talk;
      s.set('ax_pace', 2.4);
      s.set('ax_work', 1);
      await inn(s, 2.8);
      s.set('dv_chat', 13);
      david.do('perch', { loop: true });
    },
  },

  // ---- the game's own beats ----
  // III.1, the lantern while David works the bellows: the father's lantern beyond the door; Axel back at the anvil; the
  // boy off the barrel and across the forge to the bellows' lever — he pulls it in time, as if he'd been at it all along.
  // The father stops in the gap, lifts the lantern, looks in. Then “The bellows’ rhythm”: the game drives ax_blow and pump (its
  // marks: axel#hand_l, pump#handle — the camera stands, both in the frame's middle).
  lantern_bellows: {
    after: 'hush',
    from: () => HUSHED,
    run: async s => {
      const axel = s.person('axel'), david = s.person('david'), joseph = s.person('joseph');
      axel.reach(null);
      s.set('st_who', 'joseph');
      s.set('st_on', 1);
      const comes = walk(s, 'joseph', [[2.6, 8.4]]);
      await s.wait(0.6);
      axel.look(GATE);
      david.look(GATE);
      cam(s, CAM.bellows, 4.6);
      const up = once(s, 'axel', 'kneel_one_rise', 270);
      // (off the barrel, sliding forward onto his feet; round in front of the anvil, running, to the lever)
      await david.turn(180);
      await offBarrel(s);
      david.look([-3, 4.2, 1.0]);
      const runs = walk(s, 'david', [[0.4, 3.8], [-2.8, 3.95], [-5.4, 5.6], BELLOWS], 90, 'run');
      await up;
      axel.look(ANVIL);
      const back = walk(s, 'axel', [[1.4, 4.98], AT_ANVIL], 270);
      await runs;
      david.look(FIRE);
      s.set('dv_pump', 1);
      s.set('pump_work', 1.25);
      await back;
      await axel.do('pick_up');
      axel.with(TOOLS);
      s.set('ax_work', 1);
      await comes;
      await joseph.turn(180);
      lantern(s, AT_ANVIL, 1);
      await s.wait(2.0);
      lantern(s, BELLOWS);
      david.look(JOSG);
      await s.wait(0.8);
      david.look(FIRE);
      await s.wait(0.8);
    },
  },
  // …he lowers the lantern; Axel nods to him over the hammer; he goes
  lantern_go: {
    after: 'lantern_bellows',
    from: () => AT_BELLOWS,
    run: async s => {
      const axel = s.person('axel'), joseph = s.person('joseph');
      s.set('ax_work', 1);
      s.set('pump_work', 1.25);
      await s.wait(0.4);
      lantern(s, AT_ANVIL);
      await s.wait(0.2);
      axel.look(JOSG);
      await s.wait(0.6);
      await nod(s, 'axel', JOSG);
      axel.look(ANVIL);
      await s.wait(0.4);
      s.set('st_lamp', 0);
      await s.wait(0.6);
      s.tell('lantern_go:away'); // (the father goes)
      lantern(s, [-5, 8.4]);
      await joseph.turn(270);
      await walk(s, 'joseph', [[0.3, 8.4]]);
      s.set('st_on', 0);
      s.set('pump_work', 0);
    },
  },
  // …or the bellows wheezed: the lantern comes up higher and stays on the boy; the father steps into the gap and looks a
  // long time. The boy keeps at the lever, eyes on the fire. Then he lowers it and goes.
  lantern_linger: {
    after: 'lantern_bellows',
    from: () => AT_BELLOWS,
    run: async s => {
      const david = s.person('david'), joseph = s.person('joseph');
      s.set('ax_work', 1);
      s.set('pump_work', 1.25);
      lantern(s, BELLOWS, 1.3);
      await joseph.turn(215);
      await walk(s, 'joseph', [[2.5, 7.8]], 215);
      david.look(JOSG);
      await s.wait(0.8);
      david.look(FIRE);
      await s.wait(4.0);
      s.set('st_lamp', 0);
      await s.wait(0.6);
      lantern(s, [-5, 8.4]);
      await joseph.turn(270);
      await walk(s, 'joseph', [[0.3, 8.4]]);
      s.set('st_on', 0);
      s.set('pump_work', 0);
    },
  },
  // …gone. Axel lowers the hammer and looks across at the boy at the bellows; the boy looks back; the camera comes closer
  // to them both. One slow nod.
  rest: {
    after: ['lantern_go', 'lantern_linger'],
    from: () => LEFT,
    run: async s => {
      const axel = s.person('axel'), david = s.person('david');
      s.set('ax_work', 0);
      s.set('pump_work', 0);
      await s.wait(0.6);
      axel.do('stand');
      axel.reach(null);
      cam(s, CAM.rest, 5.0);
      axel.turn(280);
      axel.look(DVB);
      await s.wait(0.4);
      s.set('dv_pump', 0);
      david.do('stand');
      david.look([AT_ANVIL[0], AT_ANVIL[1], 1.6]);
      await david.turn(120);
      await s.wait(1.0);
      s.tell('rest:nod'); // (Axel nods to him across the forge)
      await nod(s, 'axel', DVB);
      await s.wait(0.6);
      await nod(s, 'david', [AT_ANVIL[0], AT_ANVIL[1], 1.6]);
      await s.wait(0.6);
    },
  },
  // III.5, (Anne) — night, the fire low, the door half shut. David on the barrel, turned to Axel, telling him; Axel by the
  // bench, the hammer laid down, his hand in his beard, listening, looking at the floor.
  night_anne: {
    from: () => ANNE,
    run: async s => {
      await s.wait(1.2);
      s.person('axel').do('think', { loop: true });
      await s.wait(2.3);
      s.person('axel').look([0.8, 4.4, 0.1]);
      await s.wait(2.5);
      s.person('david').do('perch_still', { loop: true });
      await s.wait(3.0);
    },
  },
  // …"go to bed, Davie": his hand from the beard, a look at the boy, a nod at the door; the boy slips off the barrel and out
  // into the night; Axel turns to the fire
  night_anne_end: {
    after: 'night_anne',
    from: () => ({ ...ANNE, axel_do: loop('think'), axel_look: [0.8, 4.4, 0.1], david_do: loop('perch_still') }),
    run: async s => {
      const axel = s.person('axel'), david = s.person('david');
      axel.do('stand');
      await s.wait(0.3);
      axel.look(DAVF);
      await s.wait(0.8);
      await nod(s, 'axel', DAVF);
      axel.look(GATE);
      await s.wait(1.0);
      axel.look(DAVF);
      await s.wait(0.8);
      await offBarrel(s);
      david.look(GATE);
      const goes = walk(s, 'david', [[1.8, 5.2], [2.2, 7.4], [3.2, 9.6], [5.6, 10.6]]);
      await s.wait(0.6);
      axel.look(GATE);
      await goes;
      david.here(false);
      await axel.turn(280);
      axel.look(FIRE);
      await s.wait(3);
    },
  },
  // V.2, the key — night, the door half shut, the fire up; Axel at the anvil making the key, quick light blows; David at
  // the bellows, pulling the lever between them (“The bellows’ rhythm” again, in the stranger's eye).
  key: {
    from: () => KEY,
    run: async s => {
      await s.wait(3.5);
    },
  },
  // …a lantern in the yard: a man comes to the gap, stops, lifts it and looks in — at the anvil, at the boy
  stranger: {
    after: 'key',
    from: () => ({ ...KEY }),
    run: async s => {
      const david = s.person('david');
      s.set('st_who', 'farmhand');
      s.set('st_on', 1);
      const comes = walk(s, 'farmhand', [[2.6, 8.4]]);
      await s.wait(1.4);
      david.look(JOSG);
      await s.wait(1.2);
      david.look(FIRE);
      await comes;
      s.tell('stranger:stop'); // (he stops in the gate, the lantern up)
      await s.person('farmhand').turn(180);
      lantern(s, AT_ANVIL, 1);
      await s.wait(1.8);
      lantern(s, BELLOWS);
      await s.wait(0.2);
      s.person('axel').look(JOSG);
      await s.wait(1.0);
    },
  },
  // …(the rhythm held) he lowers the lantern and goes
  stranger_go: {
    after: 'stranger',
    from: () => LOOKED,
    run: async s => {
      s.set('ax_work', 1);
      s.set('pump_work', 1.3);
      await s.wait(0.4);
      s.person('axel').look(ANVIL);
      await s.wait(0.6);
      s.set('st_lamp', 0);
      await s.wait(0.6);
      lantern(s, [9, 8.4]);
      await s.person('farmhand').turn(90);
      await walk(s, 'farmhand', [[4.6, 8.4]]);
      s.set('st_on', 0);
    },
  },
  // …(he knew) he puts two fingers to his mouth and whistles; two more lanterns come up out of the dark behind him. Axel
  // stands with the hammer up; the boy lets go of the lever, turns to him and shakes his head: don't. The hammer goes
  // down. The man steps inside.
  caught: {
    after: 'stranger',
    from: () => LOOKED,
    run: async s => {
      const axel = s.person('axel'), david = s.person('david');
      s.set('ax_work', 0);
      s.set('pump_work', 0);
      await s.wait(0.2);
      s.person('farmhand').do('whistle');
      axel.do('raise_hammer');
      await s.wait(0.2);
      axel.look(JOSG);
      await s.wait(0.3);
      david.look(JOSG);
      await s.wait(0.6);
      s.set('st_more', 1);
      await s.wait(1.0);
      s.set('dv_pump', 0);
      david.do('stand');
      await s.wait(1.1);
      await david.turn(120);
      david.look([AT_ANVIL[0], AT_ANVIL[1], 1.6]);
      await s.wait(0.4);
      axel.look(DVB);
      await shake(s, 'david', [AT_ANVIL[0], AT_ANVIL[1], 1.6], [0.0, 0.5]);
      await s.wait(0.6);
      axel.do('stand');
      axel.reach(null);
      await s.wait(0.6);
      axel.look(JOSG);
      await walk(s, 'farmhand', [[2.3, 7.0]]);
      lantern(s, AT_ANVIL, 0.6);
      await s.wait(1.0);
    },
  },
  // …(force) the boy looks at Axel, at the gap: a nod. Axel stops, the hammer comes up; he limps to the gap; the man turns
  // his head too late. The blow: the man falls on his back into the yard, his lantern falls and goes out in the yard. Axel
  // stands in the gap. The fire sinks.
  strike: {
    after: 'stranger',
    from: () => LOOKED,
    run: async s => {
      const axel = s.person('axel'), david = s.person('david');
      s.set('pump_work', 0);
      david.look([AT_ANVIL[0], AT_ANVIL[1], 1.6]);
      await david.turn(120);
      s.set('dv_pump', 0);
      david.do('stand');
      await s.wait(0.6);
      axel.look(DVB);
      await nod(s, 'david', [AT_ANVIL[0], AT_ANVIL[1], 1.6]);
      david.look(JOSG);
      s.set('ax_work', 0);
      await s.wait(0.4);
      axel.reach(null);
      axel.look(JOSG);
      s.tell('strike:step'); // (Axel steps to the gate)
      await walk(s, 'axel', [[1.7, 5.05], [2.45, 7.25]], 30);
      lantern(s, [2.45, 7.25]);
      await axel.do('raise_hammer');
      // (the blow: down from the top of the lift; the man falls back, the lantern falls and goes out)
      axel.do('smith_strike', { loop: false, from: 0.73 });
      await s.wait(0.44);
      s.person('farmhand').do('fall_back');
      s.set('st_lanx', 2.9);
      s.set('st_drop', 1);
      s.move('st_glow', 0.35, { over: 0.6, ease: 'out' });
      s.move('fire', 0.3, { over: 3.0 });
      await s.wait(0.6);
      s.move('st_glow', 0, { over: 5.0 });
      await s.wait(0.4);
      axel.do('stand');
      axel.look([2.75, 9.3, 0]);
      await s.wait(2.0);
    },
  },
};
// the showcase: the canon — the boy's chatter, Axel's question, the truth, the door, the hush, the father's lantern,
// after — then the night of the key
const SHOWCASE = ['chatter', 'notice', 'truth', 'door', 'hush', 'lantern', 'after', 'key', 'stranger', 'stranger_go'];

return { shape, flight, HEAD, WIN, HORSE, ANVIL, AT_ANVIL, BARREL, FIRE, BELLOWS, CAM, FILM, SHOWCASE, clamp };
