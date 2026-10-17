// The Strorm kitchen (engine 3): what its elements and its scripts share — where the room's things are (metres: across,
// distance; up), the chairs as painted, the stairs behind the stair door (the land there: relief.js), and the film —
// the beats a game plays one at a time by `beat` (script.js, the world's module beats) and the showcase plays in order
// (showcase.js). The people are the engine's (elements with "person", the world's cast): <id>_a, <id>_d (their place),
// _do, _turn (0 away from us, 90 right, 180 toward us), _look, _reach, _with, _here, _gait, _steps, _wear.
const { clamp } = anim;
const LAMP = { a: 0.3, h: 1.02, d: 4.45 }, HEARTH = { a: 3.35, d: 6.2 };
// the window in the back wall (its card's metres: x across, y down from the ceiling's foot); the stair door's opening;
// the stairs behind it going straight up away from it — STEP.n steps of STEP.rise, each STEP.run deep, the first at STEP.d
const WIN = { x0: 0.4, x1: 1.2, y0: -2.45, y1: -1.4 };
const DOOR = { a0: -2.95, a1: -2.2, h: 2.02, d: 6.2 }, STEP = { d: 6.4, run: 0.26, rise: 0.21, n: 10 };
const stairAt = (across, distance) =>
  across > DOOR.a0 - 0.05 && across < DOOR.a1 + 0.05 && distance >= STEP.d ? STEP.rise * Math.min(STEP.n, Math.floor((distance - STEP.d) / STEP.run) + 1) : 0;
// a chair seen three-quarter on, painted once in its daylight colours: its back on side sg (+1 right), `top` m high
function chair(g, sg, top) {
  const q = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); }, dk = '#4e3826', md = '#634732';
  q(-0.13, -0.5, 0.03, 0.46, dk);
  q(0.21, -0.5, 0.03, 0.46, dk);
  g.fillStyle = md;
  g.beginPath();
  g.moveTo(-0.23, -0.46);
  g.lineTo(0.2, -0.46);
  g.lineTo(0.26, -0.51);
  g.lineTo(-0.17, -0.51);
  g.closePath();
  g.fill();
  q(-0.23, -0.46, 0.43, 0.04, md);
  q(-0.22, -0.43, 0.035, 0.43, md);
  q(0.165, -0.43, 0.035, 0.43, md);
  q(-0.2, -0.18, 0.38, 0.02, dk);
  const bx = sg > 0 ? 0.17 : -0.21, bw = 0.07;
  g.save();
  g.translate(bx, -0.48);
  g.transform(1, -0.35 * sg, 0, 1, 0, 0);
  q(0, -top + 0.48, 0.032, top - 0.48, md);
  q(bw, -top + 0.46, 0.032, top - 0.48, dk);
  for (let i = 0; i < 3; i++) q(0, -top + 0.52 + i * 0.13, bw + 0.03, 0.028, md);
  g.restore();
}

// ── where things are (metres: across, distance; elevation) ──
// the seats: the father's chair at the head of the table (he faces down it, to the right); Mary and the farmhand
// behind the table, facing us; the mother's chair at the hearth's end of it; the boy's place by night — Mary's
const SEAT = { joseph: [-1.68, 4.55], mary: [-0.3, 5.12], farmhand: [0.95, 5.12], emily: [2.12, 4.6] };
// the pot hanging in the hearth, and where the mother stands to stir it (her back to us)
const POT = [3.05, 6.1, 0.5], AT_POT = [3.05, 5.72];
// the yard door, off to the left; where the boy comes in and goes out
const YARD = [-4.8, 3.6];
// by the hearth's end of the table, where he tries to tie the rag; where she stands to bind it; their hands between
const BY_HEARTH = [1.78, 3.95], TO_TIE = [2.42, 4.36], KNOT = [2.08, 4.13, 0.9];
// (from the pot to him she goes round her chair); where she steps back to after, under the father's eyes
const ROUND_CHAIR = [2.78, 4.72], ASIDE = [2.85, 4.7];
// the stair door: before it; its latch; the stairs up (STEP), their top
const AT_DOOR = [-2.58, 5.98], LATCH = [-2.87, 6.16, 1.0], UP = [-2.58, 8.9];
// the sampler on the wall: the true image (“Honour the Image”)
const SAMPLER = [-0.45, 6.15, 2.45];
// the bowls on the table: Mary's, the farmhand's
const BOWL = { mary: [-0.3, 4.72, 0.8], farmhand: [1.0, 4.72, 0.8] };
// the table's near edge before someone seated behind it (their hands on it)
const EDGE = (a, d) => ({ r: [a - 0.13, d - 0.38, 0.8], l: [a + 0.13, d - 0.38, 0.8] });
// at the floor before someone, as they face
const DOWN = (a, d, turn, h = 0.1, ahead = 0.7) => [a + ahead * Math.sin((turn * Math.PI) / 180), d + ahead * Math.cos((turn * Math.PI) / 180), h];
// the way from one point to another, in degrees (as <id>_turn)
const toward = ([a, d], [a2, d2]) => (((Math.atan2(a2 - a, d2 - d) * 180) / Math.PI) + 360) % 360;
// where the father stands up to judge him: out of his chair, a step before it into the room, clear of the table — turned
// to the boy, who kneels before him close enough for his hand to come down on his head, facing him
const BY_CHAIR = [-1.3, 4.12], STANDS = [-1.25, 3.8], JUDGE = 120;
const KNEEL = [STANDS[0] + 0.44 * Math.sin((JUDGE * Math.PI) / 180), STANDS[1] + 0.44 * Math.cos((JUDGE * Math.PI) / 180)];
// his right hand raised over the Book, a little before him; pointing at the floor before him (where the boy is to kneel)
const RAISED = [STANDS[0] + 0.25 * Math.sin((JUDGE * Math.PI) / 180), STANDS[1] + 0.25 * Math.cos((JUDGE * Math.PI) / 180), 2.3];
const FLOOR = [STANDS[0] + 0.95 * Math.sin((JUDGE * Math.PI) / 180), STANDS[1] + 0.95 * Math.cos((JUDGE * Math.PI) / 180), 0];
// the camera's places (camera_x, camera_z, camera_look): the room; by the hearth; on the father and the boy before him
// (pushing in); the father close (the lie); the mother at the hearth (the lie); the empty chair and the bowl; the night
// table; the night table years later; the stairwell (the sneak)
const CAM = {
  room: [0, 0, 0], hearth: [1.85, 1.55, 0.02], judge: [-0.85, 0.9, 0.05], seek: [-0.35, 0.7, 0], father: [-1.3, 2.2, 0],
  mother: [2.3, 1.5, 0], bowl: [0.45, 1.2, 0.05], night: [-0.65, 2.6, 0.02], night_back: [-0.25, 1.3, 0], late: [-0.4, 1.4, 0],
  late_in: [-0.65, 2.4, 0.02], to_bed: [-0.9, 0.6, 0], sneak: [-1.6, 0.5, 0],
};
const camOf = c => ({ camera_x: c[0], camera_z: c[1], camera_look: c[2] });
const loop = motion => ({ motion, loop: true });

// ── what a beat does ──
const here = (s, id) => [s.state[`${id}_a`], s.state[`${id}_d`]];
// a motion done once: begun where they are (getting up) — or ending at `to` (down on his knees before his father; onto a
// seat) facing `turn`; they are where it takes them, held at its end
const once = (s, id, motion, turn, to) => s.person(id).go(motion, { ...(to ? { to } : { from: here(s, id) }), turn: turn ?? s.state[`${id}_turn`] });
// they walk (steps) along the points at their gait's pace, then turn to `turn`
async function walk(s, id, pts, turn) {
  s.set(`${id}_steps`, true);
  await s.person(id).walk(pts);
  if (turn != null) await s.person(id).turn(turn);
}
// the camera to a place over `over` seconds (all three keys together)
const cam = (s, c, over) => { const [x, z, look] = c; return s.all(s.move('camera_x', x, { over }), s.move('camera_z', z, { over }), s.move('camera_look', look, { over })); };
// a shake of the head: the eyes from one side of what they look at to the other, n times
async function shake(s, id, [a, d, h], n = 2) {
  for (let i = 0; i < n; i++) {
    s.person(id).look([a - 0.35, d, h]);
    await s.wait(0.25);
    s.person(id).look([a + 0.35, d, h]);
    await s.wait(0.25);
  }
  s.person(id).look([a, d, h]);
}
// a sequence beside the beat's own (another actor's, from now)
const aside = (s, fn) => s.sequence(fn);
// the boy goes up: the latch, the door opening, a look back at `back` (if any), up the stairs and out of sight; the
// door shutting behind him
async function goUp(s, back) {
  const david = s.person('david');
  david.reach({ r: LATCH });
  await s.move('stair_door', 1, { over: 1.0, ease: 'out' });
  david.reach(null);
  if (back) {
    await david.turn(80);
    david.look(back);
    await s.wait(1.6);
    david.look(null);
    await david.turn(0);
  }
  await walk(s, 'david', [[AT_DOOR[0], STEP.d - 0.05], UP]);
  david.here(false);
  await s.move('stair_door', 0, { over: 0.9, ease: 'in' });
}

// ── the state the beats begin at ──
// the evening, everyone at their place, the boy still outside
const START = {
  ...camOf(CAM.room), lamp: 1, dusk: 0.2, hearth: 1, fade: 0, fade_color: '#000000', steam: 1, yard_door: 0, stair_door: 0, wish: 0,
  at_table: false, david_grip: 1, david_stir: 0, father_look: 0,
  joseph_a: SEAT.joseph[0], joseph_d: SEAT.joseph[1], joseph_do: loop('read_seated'), joseph_turn: 90, joseph_look: null,
  joseph_reach: null, joseph_with: ['book_open'], joseph_here: true, joseph_steps: true,
  mary_a: SEAT.mary[0], mary_d: SEAT.mary[1], mary_do: loop('sit_still'), mary_turn: 174, mary_look: BOWL.mary,
  mary_reach: EDGE(...SEAT.mary), mary_with: null, mary_here: true,
  farmhand_a: SEAT.farmhand[0], farmhand_d: SEAT.farmhand[1], farmhand_do: loop('eat_seated'), farmhand_turn: 188,
  farmhand_look: BOWL.farmhand, farmhand_reach: null, farmhand_with: ['spoon'], farmhand_here: true,
  emily_a: AT_POT[0], emily_d: AT_POT[1], emily_do: loop('stir_pot'), emily_turn: 0, emily_look: POT, emily_reach: null,
  emily_with: ['ladle'], emily_here: true, emily_steps: true,
  david_a: YARD[0], david_d: YARD[1], david_do: loop('clutch'), david_turn: 90, david_look: null, david_reach: null,
  david_with: ['rag_loose'], david_gait: 'clutch_walk', david_wear: null, david_steps: true, david_here: true,
};
// by the hearth, the rag in his teeth; his mother turned to him from the pot (where help and self begin)
const AT_HEARTH = {
  ...START, ...camOf(CAM.hearth), dusk: 0.35, steam: 0.7,
  david_a: BY_HEARTH[0], david_d: BY_HEARTH[1], david_turn: 75, david_do: loop('teeth'), david_gait: null,
  emily_turn: 290, emily_look: 'david', emily_do: 'stand',
};
// the hand bound: she before him, his hand in hers (where slip begins)
const TIED = {
  ...AT_HEARTH, david_turn: toward(BY_HEARTH, TO_TIE), david_do: loop('clutch'), david_reach: { r: KNOT }, david_look: 'emily', david_with: ['rag'],
  emily_a: TO_TIE[0], emily_d: TO_TIE[1], emily_turn: toward(TO_TIE, BY_HEARTH), emily_do: loop('tend'), emily_with: null,
  emily_reach: { r: 'david#hand_r', l: 'david#hand_r' }, emily_look: 'david#hand_r',
};
// the slip heard: the room wide, everyone looking at him, the mother stepped aside (where kneel and lie begin)
const HEARD = {
  ...TIED, ...camOf(CAM.room), david_reach: null, david_look: [KNOT[0], KNOT[1], 0.2],
  emily_a: ASIDE[0], emily_d: ASIDE[1], emily_turn: toward(ASIDE, SEAT.joseph), emily_do: 'stand', emily_reach: null, emily_look: 'joseph',
  farmhand_do: loop('sit_still'), farmhand_look: 'david', mary_look: 'david', joseph_look: 'david',
};
// on his knees before his father, the father reading over him, the household praying (where seek and bow begin)
const KNELT = {
  ...HEARD, ...camOf(CAM.judge), dusk: 0.6,
  joseph_a: STANDS[0], joseph_d: STANDS[1], joseph_turn: JUDGE, joseph_do: 'stand', joseph_with: ['book_open_l'], joseph_reach: { r: RAISED }, joseph_look: 'david',
  david_a: KNEEL[0], david_d: KNEEL[1], david_turn: (JUDGE + 180) % 360, david_do: loop('kneel_pray'), david_look: 'joseph#feet',
  mary_do: loop('pray_seated'), mary_reach: null, mary_look: [SEAT.mary[0], SEAT.mary[1] - 0.6, 0.6],
  emily_do: loop('pray_stand'), emily_look: [ASIDE[0] - 0.4, ASIDE[1] - 0.6, 0.2],
  farmhand_do: loop('pray_seated'), farmhand_with: null, farmhand_look: [SEAT.farmhand[0], SEAT.farmhand[1] - 0.6, 0.6],
};
// the lie told: the boy hiding his hand by the hearth, the father close, his Book shut (where lie_mother begins)
const LIED = {
  ...HEARD, ...camOf(CAM.father), david_do: loop('hide_stand'), david_look: DOWN(...BY_HEARTH, toward(BY_HEARTH, TO_TIE)),
  david_a: BY_HEARTH[0], david_d: BY_HEARTH[1], emily_look: 'david', joseph_with: ['book'], joseph_do: loop('sit_still'), joseph_look: 'emily',
};
// a night at this table: the father reads, David sits across from us holding the table's edge, the mother sews by the
// hearth's end, her eyes down; the others have gone to bed
const NIGHT = {
  ...START, ...camOf(CAM.night), lamp: 0.85, dusk: 1, steam: 0, at_table: true, david_grip: 1, david_stir: 0, father_look: 0,
  david_a: SEAT.mary[0], david_d: SEAT.mary[1], david_turn: 174, david_do: loop('sit_grip'), david_reach: EDGE(...SEAT.mary),
  david_look: [SEAT.mary[0], SEAT.mary[1] - 0.5, 0.8], david_with: ['rag'], david_gait: null,
  emily_a: SEAT.emily[0], emily_d: SEAT.emily[1], emily_turn: 270, emily_do: loop('sew'), emily_with: null,
  emily_look: [SEAT.emily[0] - 0.3, SEAT.emily[1], 0.45], mary_here: false, farmhand_here: false,
};
// years later: David nearly grown (the cast's david_teen over him), the lamp lower
const LATE = { ...NIGHT, ...camOf(CAM.late), lamp: 0.6, david_wear: kit.cast.characters.david_teen, david_with: null };

const FILM = {
  // ---- 1. A quiet evening. The father reads; the mother stirs the pot; the farmhand eats. The yard door opens: David
  // comes in, his right hand in a rag held to his chest, past the father (who doesn't look up) to the hearth, and tries
  // to tie it himself — one hand and his teeth. His mother looks round. (The game's choice: on david.)
  evening: {
    from: () => ({ ...START, fade: 1 }),
    run: async s => {
      const david = s.person('david'), emily = s.person('emily');
      const near = s.shot({ ...camOf(CAM.hearth) });
      s.move('fade', 0, { over: 3.0 });
      s.move('dusk', 0.35, { over: 18, ease: 'linear' });
      s.move('steam', 0.7, { over: 18, ease: 'linear' });
      await s.wait(4.6);
      // (the yard door opens: cold light across the boards; the sister looks round, the spoon stops)
      s.move('yard_door', 1, { over: 1.0, ease: 'out' });
      await s.wait(0.4);
      s.person('mary').look([YARD[0], YARD[1], 1.1]);
      await s.wait(0.4);
      s.person('farmhand').do('sit_still', { loop: true });
      s.person('farmhand').look([YARD[0], YARD[1], 1.1]);
      await s.wait(0.2);
      // (he comes in, bowed, the hand at his chest, along the table — the father does not look up)
      s.tell('evening:in');
      const comes = walk(s, 'david', [[1.3, 3.6], BY_HEARTH], 75);
      await s.wait(1.2);
      s.person('mary').look('david');
      await s.wait(1.6);
      s.move('yard_door', 0, { over: 1.4, ease: 'in' });
      await s.wait(1.4);
      s.person('farmhand').do('eat_seated', { loop: true });
      s.person('farmhand').look(BOWL.farmhand);
      await s.wait(1.1);
      s.person('mary').look(BOWL.mary);
      await comes;
      // (closer, by the hearth: he pulls at the knot with his teeth; his mother looks round, stops stirring)
      near.cut();
      david.gait(null);
      david.do('teeth', { loop: true });
      await s.wait(1.8);
      await emily.turn(290);
      emily.look('david');
      await s.wait(0.7);
      emily.do('stand');
      await s.wait(0.5);
    },
  },
  // ---- 2a. He turns to her and holds the hand out; she comes, shakes her head at the mess, takes it and binds it
  help: {
    after: 'evening',
    from: () => AT_HEARTH,
    run: async s => {
      const david = s.person('david'), emily = s.person('emily');
      david.do('clutch', { loop: true });
      await david.turn(toward(BY_HEARTH, TO_TIE));
      david.look('emily');
      david.reach({ r: KNOT });
      emily.with(null);
      const comes = walk(s, 'emily', [ROUND_CHAIR, TO_TIE], toward(TO_TIE, BY_HEARTH));
      await s.wait(0.6);
      emily.look('david#hand_r');
      await comes;
      emily.do('tend', { loop: true });
      emily.reach({ r: 'david#hand_r', l: 'david#hand_r' });
      s.tell('help:tie'); // (she binds it — shaking her head at the mess)
      await shake(s, 'emily', KNOT);
      await s.wait(0.4);
      david.look('david#hand_r');
      await s.wait(2.9);
      david.with(['rag']);
      await s.wait(1.0);
    },
  },
  // ---- 2b. "I'll manage": he turns his shoulder to her and pulls at the knot with his teeth. She comes all the same,
  // takes his wrist from his mouth, turns him round by it and binds it — hard; he flinches.
  self: {
    after: 'evening',
    from: () => AT_HEARTH,
    run: async s => {
      const david = s.person('david'), emily = s.person('emily');
      david.turn(130);
      await s.wait(0.9);
      emily.with(null);
      const comes = walk(s, 'emily', [ROUND_CHAIR, TO_TIE], toward(TO_TIE, BY_HEARTH));
      await s.wait(0.5);
      emily.look('david#hand_r');
      await comes;
      await shake(s, 'emily', KNOT, 1);
      s.tell('self:take'); // (she takes his wrist all the same)
      emily.do('tend', { loop: true });
      emily.reach({ r: 'david#hand_r', l: 'david#hand_r' });
      await s.wait(0.5);
      david.do('clutch', { loop: true });
      david.reach({ r: KNOT });
      await david.turn(toward(BY_HEARTH, TO_TIE));
      david.look('emily');
      await s.wait(1.0);
      await david.do('flinch');
      david.do('clutch', { loop: true });
      david.look('david#hand_r');
      await s.wait(1.0);
      david.with(['rag']);
      await s.wait(0.7);
    },
  },
  // ---- 3. The slip: he looks up at her — "if I had another hand…" — and a pale third hand, his wish, grows out of his
  // side to the knot. Her head comes up: at him, then, slowly, at the father. (cut: wide) The whole room has heard: the
  // spoon stops, the sister looks, the father's head rises from the Book. The hand fades. (The game's choice: on david.)
  slip: {
    after: ['help', 'self'],
    from: () => TIED,
    run: async s => {
      const david = s.person('david'), emily = s.person('emily');
      const wide = s.shot({ ...camOf(CAM.room) });
      david.look('emily');
      await s.wait(0.7);
      s.move('wish', 1, { over: 1.7, ease: 'out' });
      await s.wait(0.5);
      emily.look('david');
      await s.wait(1.0);
      emily.look('joseph');
      await s.wait(1.4);
      wide.cut();
      await s.wait(0.1);
      s.person('farmhand').do('sit_still', { loop: true });
      await s.wait(0.1);
      s.person('farmhand').look('david');
      await s.wait(0.2);
      s.person('mary').look('david');
      await s.wait(0.2);
      david.look([KNOT[0], KNOT[1], 0.2]);
      await s.wait(0.3);
      s.person('joseph').look('david');
      await s.wait(0.3);
      s.move('wish', 0, { over: 2.0, ease: 'in' });
      await s.wait(0.6);
      emily.reach(null);
      emily.do('stand');
      await s.wait(0.4);
      david.reach(null);
      await s.wait(0.4);
      emily.look('joseph');
      await walk(s, 'emily', [ASIDE], toward(ASIDE, SEAT.joseph));
    },
  },
  // ---- 4. (said again, honestly) He shuts the Book and rises; his shadow climbs the wall and the ceiling. He points at
  // the floor before him. David comes, slowly, and goes down on his knees. (pushing in) The father points up at the
  // sampler — the true image — and the boy looks up at it; then at the boy's hands: the boy hides them behind his back.
  // The father opens the Book and reads over him; the household prays. (The game's choice: on david.)
  kneel: {
    after: 'slip',
    from: () => HEARD,
    run: async s => {
      const joseph = s.person('joseph'), david = s.person('david');
      s.move('dusk', 0.6, { over: 22, ease: 'linear' });
      joseph.with(['book']);
      await s.wait(0.6);
      joseph.look('david');
      await once(s, 'joseph', 'rise_chair', 90);
      s.person('mary').look(BOWL.mary);
      await s.wait(0.4);
      s.person('farmhand').look(BOWL.farmhand);
      await walk(s, 'joseph', [BY_CHAIR, STANDS], JUDGE);
      joseph.look(FLOOR);
      joseph.reach({ r: FLOOR });
      await s.wait(0.6);
      joseph.look('david');
      s.person('emily').look([ASIDE[0] - 0.5, ASIDE[1] - 0.6, 0.1]);
      // (he comes round the table, slowly, and goes down on his knees before him)
      await walk(s, 'david', [[0.3, 3.45], [-0.4, 3.35]]);
      joseph.reach(null);
      await once(s, 'david', 'kneel_down', (JUDGE + 180) % 360, KNEEL);
      david.look('joseph');
      david.do('kneel_pray', { loop: true });
      cam(s, CAM.judge, 6);
      await s.wait(0.8);
      // (the true image on the wall: the boy's eyes go up to it)
      await joseph.turn(toward(STANDS, SAMPLER));
      joseph.look(SAMPLER);
      joseph.reach({ r: SAMPLER });
      s.tell('kneel:image'); // (his hand on the true image on the wall)
      await s.wait(0.6);
      david.look(SAMPLER);
      await s.wait(2.5);
      joseph.reach(null);
      await joseph.turn(JUDGE);
      joseph.look('david#hands');
      joseph.reach({ r: 'david#hands' });
      await s.wait(0.3);
      david.look('joseph');
      await s.wait(0.6);
      david.do('kneel_hide', { loop: true });
      await s.wait(1.6);
      joseph.reach(null);
      await s.wait(0.4);
      // (the Book open on his left hand, the right raised over the boy; the household prays, each in their own time)
      joseph.with(['book_open_l']);
      joseph.look('david');
      joseph.reach({ r: RAISED });
      s.tell('kneel:pray'); // (the Book open, his hand raised over the boy)
      await s.wait(0.4);
      s.person('mary').do('pray_seated', { loop: true });
      s.person('mary').reach(null);
      s.person('mary').look([SEAT.mary[0], SEAT.mary[1] - 0.6, 0.6]);
      await s.wait(0.4);
      david.do('kneel_pray', { loop: true });
      david.look('joseph#feet');
      await s.wait(0.1);
      s.person('emily').do('pray_stand', { loop: true });
      s.person('emily').look([ASIDE[0] - 0.4, ASIDE[1] - 0.6, 0.2]);
      await s.wait(0.4);
      s.person('farmhand').do('pray_seated', { loop: true });
      s.person('farmhand').with(null);
      s.person('farmhand').look([SEAT.farmhand[0], SEAT.farmhand[1] - 0.6, 0.6]);
      await s.wait(2.0);
    },
  },
  // ---- 5a. On his knees he lifts his head to find his mother. She keeps hers down. The father stops reading, looks
  // down at him, puts his hand on the boy's head and presses it down.
  seek: {
    after: 'kneel',
    from: () => KNELT,
    run: async s => {
      const joseph = s.person('joseph'), david = s.person('david');
      cam(s, CAM.seek, 3.2);
      await s.wait(0.8);
      david.look('emily');
      await s.wait(2.2);
      joseph.reach(null);
      joseph.look('david');
      await s.wait(0.6);
      joseph.reach({ r: 'david#head' });
      await s.wait(0.4);
      david.look('joseph#feet');
      await s.wait(2.6);
      joseph.reach(null);
      await s.wait(0.3);
      joseph.reach({ r: RAISED });
      joseph.look('david');
      await s.wait(1.7);
    },
  },
  // ---- 5b. He keeps his eyes on the floor. His mother lifts hers to him for a moment — he doesn't see it.
  bow: {
    after: 'kneel',
    from: () => KNELT,
    run: async s => {
      cam(s, CAM.seek, 3.2);
      await s.wait(2.4);
      s.person('emily').look('david');
      await s.wait(3.2);
      s.person('emily').look([ASIDE[0] - 0.4, ASIDE[1] - 0.6, 0.2]);
      await s.wait(2.0);
    },
  },
  // ---- 6. (wide) He shuts the Book and points to the stair door. The boy gets up and goes. On the threshold he looks
  // back at his mother: she turns away to the hearth. He goes up; the door shuts. The father sits back down to the Book;
  // the mother stirs the pot again. (slowly in) The bowl goes cold by the empty chair.
  upstairs: {
    after: ['seek', 'bow'],
    from: () => ({ ...KNELT, ...camOf(CAM.seek) }),
    run: async s => {
      const joseph = s.person('joseph'), david = s.person('david'), emily = s.person('emily');
      s.move('dusk', 1, { over: 24, ease: 'linear' });
      s.move('steam', 0.15, { over: 24, ease: 'in' });
      cam(s, CAM.room, 2.4);
      joseph.reach(null);
      await s.wait(0.2);
      joseph.with(['book']);
      await s.wait(0.6);
      await joseph.turn(toward(STANDS, AT_DOOR));
      joseph.look([AT_DOOR[0], 6.2, 1.4]);
      joseph.reach({ r: [AT_DOOR[0], 6.2, 1.3] });
      await s.wait(0.8);
      await once(s, 'david', 'stand_from_kneel');
      david.look(null);
      await walk(s, 'david', [[-1.3, 3.2], [-2.45, 3.75], AT_DOOR], 0);
      joseph.reach(null);
      joseph.look('david');
      // (on the threshold he looks back at her: she turns away to the hearth, to the pot)
      const away = aside(s, async q => {
        await q.wait(1.6);
        emily.do('stand');
        emily.look(POT);
        await walk(q, 'emily', [AT_POT], 0);
        emily.with(['ladle']);
        emily.do('stir_pot', { loop: true });
      });
      await goUp(s, 'emily');
      await away;
      await joseph.turn(90);
      joseph.look(null);
      await walk(s, 'joseph', [BY_CHAIR]);
      await once(s, 'joseph', 'sit_chair', 90, SEAT.joseph);
      joseph.do('read_seated', { loop: true });
      joseph.with(['book_open']);
      s.person('mary').do('sit_still', { loop: true });
      s.person('mary').reach(EDGE(...SEAT.mary));
      s.person('mary').look(BOWL.mary);
      await s.wait(0.4);
      s.person('farmhand').do('eat_seated', { loop: true });
      s.person('farmhand').with(['spoon']);
      s.person('farmhand').look(BOWL.farmhand);
      s.tell('upstairs:bowl'); // (the empty chair and the bowl)
      await cam(s, CAM.bowl, 7);
      await s.wait(0.6);
    },
  },
  // ---- 4'. (the lie: "Nothing, Father.") He puts the bound hand behind his back and looks at the floor. (cut: the
  // father, close) He lowers the Book and turns his eyes, slowly, from the boy to the mother.
  lie: {
    after: 'slip',
    from: () => HEARD,
    run: async s => {
      const close = s.shot({ ...camOf(CAM.father) });
      s.person('david').do('hide_stand', { loop: true });
      s.person('david').look(DOWN(...BY_HEARTH, toward(BY_HEARTH, TO_TIE)));
      await s.wait(0.3);
      s.person('emily').look('david');
      await s.wait(1.3);
      close.cut();
      s.person('joseph').with(['book']);
      s.person('joseph').do('sit_still', { loop: true });
      await s.wait(0.8);
      s.person('joseph').look('emily');
      await s.wait(1.8);
    },
  },
  // ---- 4''. (cut: the mother at the hearth, the boy before her) She lifts her eyes to the father — and lowers them.
  lie_mother: {
    after: [], // (a cut: its opening said ahead by the module beats — it stands after lie in the table)
    from: () => ({ ...LIED, ...camOf(CAM.mother) }),
    run: async s => {
      await s.wait(0.6);
      s.person('emily').look('joseph');
      await s.wait(1.8);
      s.person('emily').look(DOWN(...ASIDE, toward(ASIDE, SEAT.joseph), 0.1, 1.2));
      await s.wait(1.2);
    },
  },
  // ---- 5'. She has answered. The father does not take his eyes off her; he sends the boy up without a look. The boy goes
  // the long way round the table. On the threshold he looks back: his mother stands as she stood, under the father's
  // eyes. The door shuts. Only then she turns to the pot.
  lie_up: {
    after: [], // (a cut, said ahead so: it stands after lie_mother in the table)
    from: () => ({ ...LIED, ...camOf(CAM.room) }),
    run: async s => {
      const david = s.person('david'), emily = s.person('emily');
      s.move('dusk', 1, { over: 20, ease: 'linear' });
      s.move('steam', 0.15, { over: 20, ease: 'in' });
      await s.wait(0.9);
      david.do('clutch', { loop: true });
      david.look(null);
      const goes = walk(s, 'david', [[1.2, 3.45], [-2.4, 3.5], AT_DOOR], 0);
      await s.wait(1.1);
      s.person('farmhand').look(BOWL.farmhand);
      await s.wait(0.6);
      s.person('mary').look(BOWL.mary);
      await goes;
      await goUp(s, 'emily');
      s.tell('lie_up:alone'); // (he is gone up; she turns to the pot)
      await s.wait(0.8);
      emily.look(POT);
      await walk(s, 'emily', [AT_POT], 0);
      s.person('joseph').look(null);
      emily.with(['ladle']);
      emily.do('stir_pot', { loop: true });
      await s.wait(0.6);
      s.person('joseph').with(['book_open']);
      s.person('joseph').do('read_seated', { loop: true });
      await s.wait(2.0);
    },
  },

  // ---- The game's other nights at this table ----
  // a night: the father reads, David across the table holds its edge (the game moves david_grip, david_stir,
  // father_look while he must not stir: “Not a stir” — its mark on david#hand_r)
  night: {
    from: () => ({ ...NIGHT, fade: 1 }),
    run: async s => { await s.move('fade', 0, { over: 2.4 }); },
  },
  // the reading is over: the camera eases back — the mother at the hearth's end, her eyes down
  night_after: {
    after: 'night',
    from: () => NIGHT,
    run: async s => { await cam(s, CAM.night_back, 3.5); },
  },
  // years later (David nearly grown), the lamp lower: the father reads longer than he used to
  late: {
    from: () => ({ ...LATE, fade: 1 }),
    run: async s => {
      s.move('fade', 0, { over: 2.4 });
      await cam(s, CAM.late_in, 14);
    },
  },
  // …and lifts his head from the Book, and looks at him; the boy lets go of the table's edge
  asks: {
    after: 'late',
    from: () => ({ ...LATE, ...camOf(CAM.late_in) }),
    run: async s => {
      s.set('at_table', false);
      s.person('joseph').look('david');
      await s.wait(0.3);
      const back = cam(s, CAM.night_back, 2.6);
      await s.wait(0.3);
      s.person('david').do('sit_fidget', { loop: true });
      s.person('david').reach(null);
      s.person('david').look('joseph');
      await back;
    },
  },
  // the reading is over: the father shuts the Book; David gets up and goes up to bed (the father reads on)
  to_bed: {
    after: ['night', 'night_after', 'late', 'asks'],
    from: () => NIGHT,
    run: async s => {
      const david = s.person('david');
      s.set('at_table', false);
      s.person('joseph').look(null);
      await s.wait(0.2);
      s.person('joseph').with(['book']);
      s.person('joseph').do('sit_still', { loop: true });
      await s.wait(0.8);
      david.do('sit_fidget', { loop: true });
      await s.wait(0.4);
      david.reach(null);
      david.look(null);
      cam(s, CAM.to_bed, 4);
      await once(s, 'david', 'rise_away');
      const eyes = aside(s, async q => { await q.wait(1.2); s.person('emily').look('david'); });
      await walk(s, 'david', [[-0.9, 5.3], [-2.4, 5.35], AT_DOOR], 0);
      await eyes;
      s.person('emily').look([SEAT.emily[0] - 0.4, SEAT.emily[1], 0.4]);
      await goUp(s);
      s.tell('to_bed:up'); // (he has gone up the stairs)
      s.person('joseph').with(['book_open']);
      s.person('joseph').do('read_seated', { loop: true });
      await s.wait(1.2);
    },
  },
  // (later that night) the lamp is out, the room empty, the hearth low. The stair door opens; David comes down on tiptoe,
  // crosses the room to the yard door, and the night takes him.
  sneak: {
    after: 'to_bed',
    from: () => ({
      ...NIGHT, ...camOf(CAM.sneak), fade: 1, lamp: 0, hearth: 0.35, at_table: false, joseph_here: false, emily_here: false,
      david_here: false, david_a: UP[0], david_d: UP[1], david_turn: 180, david_do: 'stand', david_reach: null, david_look: null, david_gait: null,
    }),
    run: async s => {
      const david = s.person('david');
      s.set('lamp', 0);
      s.set('hearth', 0.35);
      s.set('joseph_here', false);
      s.set('emily_here', false);
      await s.move('fade', 0, { over: 2.0 });
      s.move('stair_door', 1, { over: 1.0, ease: 'out' });
      await s.wait(0.3);
      david.here(true);
      await walk(s, 'david', [[AT_DOOR[0], STEP.d - 0.05], AT_DOOR]);
      david.gait('tiptoe');
      s.move('stair_door', 0, { over: 1.2, ease: 'in' });
      const out = walk(s, 'david', [[-2.6, 4.6], [-4.8, 3.7], [-6.4, 3.5]]);
      await s.wait(2.4);
      s.move('yard_door', 0.7, { over: 1.4, ease: 'out' });
      await out;
      david.here(false);
      s.move('yard_door', 0, { over: 1.4, ease: 'in' });
      await s.move('fade', 1, { over: 1.6 });
    },
  },
};
// the showcase: the evening of the third hand as the book tells it, then the night at the table, years later, and the
// boy slipping out
const SHOWCASE = ['evening', 'help', 'slip', 'kneel', 'seek', 'upstairs', 'late', 'asks', 'to_bed', 'sneak'];

return { LAMP, HEARTH, WIN, DOOR, STEP, stairAt, chair, SEAT, EDGE, FILM, SHOWCASE, clamp };
