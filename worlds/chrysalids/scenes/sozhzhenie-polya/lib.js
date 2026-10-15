// Сожжение поля (engine 3): what its elements and its scripts share — a row of the wheat (painted once; its fire is its
// shader's, wheat.wgsl), how much the fire lights the world, where the congregation stands, and the film: the beats a
// game plays one at a time by `beat` (script.js, the world's module beats) and the showcase plays in order (showcase.js).
// The people are the engine's (the world's cast): jo (Joseph Strorm), in (the Inspector), em (Emily), dv (David), p0…p9
// (the congregation) — their places <id>_a, <id>_d; _do, _turn (0 away from us, 90 right, 180 toward us), _look, _reach.
const { clamp } = anim;
const sm = v => { v = clamp(v, 0, 1); return v * v * (3 - 2 * v); };
// how much the burning field lights the world now (0 … 1): the fire up, the front out, not yet ash
const fireLight = s => (s.fire ?? 0) * clamp((s.ignite ?? 0) * 8, 0, 1) * (1 - 0.88 * sm((s.ash ?? 0) * 1.05));
// the fire starts at across X0 (on the edge of the field, 9.5 m) and spreads 50·ignite m each way (to the left only to the
// track, FIELD_L); the ash follows, 60·ash m
const X0 = 0.5, FIELD_L = -3.0;

// ── a row of the wheat across the fields at distance RD, painted once in its daylight colours: left of the track and beyond
// 30 m — true wheat, even and upright; right of the track, up to 30 m — the Offence: stalks of all heights, too tall ones,
// ears too heavy that hang like hooks, forked ears. Its layer `stubble` (layer 1 of its shader) — the black stubble the fire
// leaves. ──
function wheat(g, e, RD) {
  const HS = RD * 1.25 + 3, SP = 0.075 * Math.max(1, RD / 9.5) * (RD > 25 ? 1.3 : 1);
  const OFF = a => a > -2.95 && a < 30 && RD <= 30;
  const trueC = '#c4a462', badC = '#8e8858', wheatC = '#a89058';
  g.lineCap = 'round';
  const N = Math.floor((2 * HS) / SP);
  const ear = (q, x, y, ang, L, W) => {
    q.save();
    q.translate(x, y);
    q.rotate(ang);
    q.beginPath();
    q.moveTo(0, 0);
    q.bezierCurveTo(W, -L * 0.25, W * 0.9, -L * 0.8, 0, -L);
    q.bezierCurveTo(-W * 0.9, -L * 0.8, -W, -L * 0.25, 0, 0);
    q.fill();
    q.restore();
  };
  const stubs = [];
  for (let i = 0; i < N; i++) {
    const a = -HS + (i + e.rnd()) * SP, r1 = e.rnd(), r2 = e.rnd(), r3 = e.rnd(), r4 = e.rnd();
    if (a > -4.05 && a < -2.95) continue;
    const sw = 0.04 * Math.sin(a * 0.5 + r3 * 2);
    if (!OFF(a)) {
      const h = 0.95 + 0.08 * r1;
      g.strokeStyle = trueC;
      g.fillStyle = trueC;
      g.lineWidth = 0.02 * (RD > 20 ? 1.6 : 1);
      const tx = a + sw * h, ty = -h;
      g.beginPath();
      g.moveTo(a, 0.05);
      g.quadraticCurveTo(a + sw * h * 0.3, -h * 0.5, tx, ty);
      g.stroke();
      ear(g, tx, ty, sw * 1.5 + 0.12, 0.11, 0.022 * (RD > 20 ? 1.5 : 1));
      continue;
    }
    stubs.push([a, r2, r3]);
    const bad = r1 > 0.45, tall = r1 > 0.66, fork = r1 > 0.86 && r1 < 0.95, crook = r1 >= 0.95;
    const h = bad ? (tall ? 1.45 + r2 * 1.0 : 1.0 + r2 * 0.45) : 0.75 + r2 * 0.3;
    const col = bad ? badC : wheatC;
    g.strokeStyle = col;
    g.fillStyle = col;
    g.lineWidth = (bad ? 0.026 + 0.02 * r2 : 0.02) * (RD > 20 ? 1.5 : 1);
    const bow = tall ? 0.25 + 0.35 * r3 : bad ? 0.12 : 0.05;
    const tx = a + sw * h + bow * h * 0.25, ty = -h * (1 - bow * 0.08);
    g.beginPath();
    g.moveTo(a, 0.05);
    g.bezierCurveTo(a + (crook ? 0.12 : 0), -h * 0.45, a + sw * h * 0.5, -h * 0.95, tx, ty);
    g.stroke();
    if (!bad) ear(g, tx, ty, 0.35 + sw * 2, 0.1, 0.02);
    else {
      const L = tall ? 0.24 + r4 * 0.2 : 0.16 + r4 * 0.08, W = tall ? 0.05 + r4 * 0.025 : 0.035, hang = 1.9 + r3 * 0.9 + sw * 2;
      g.beginPath();
      g.moveTo(tx, ty);
      g.quadraticCurveTo(tx + 0.1, ty - 0.06, tx + 0.12, ty + 0.02);
      g.stroke();
      ear(g, tx + 0.12, ty + 0.02, hang, L, W);
      if (fork) ear(g, tx + 0.06, ty - 0.01, hang - 0.9, L * 0.8, W * 0.85);
    }
  }
  e.layer('stubble', { box: e.area }, q => {
    q.strokeStyle = '#1e1a18';
    q.lineCap = 'round';
    q.lineWidth = 0.025 * (RD > 20 ? 1.5 : 1);
    for (const [a, r2, r3] of stubs) {
      if (r2 > 0.45) continue;
      q.beginPath();
      q.moveTo(a, 0.03);
      q.lineTo(a + 0.02, -0.05 - 0.12 * r3);
      q.stroke();
    }
  });
}
// a row's shader's uniforms, each frame: its distance, the fire, the front, the ash
function wheatMove(e, RD) {
  const s = e.state;
  e.uniform('rd', RD);
  e.uniform('ignite', s.ignite ?? 0);
  e.uniform('ash', s.ash ?? 0);
  e.uniform('fire', s.fire ?? 0);
}

// ── where everyone stands (across, distance, turn) ──
// the congregation in two wings either side of the track's end, turned to the field's front where Strorm lights it (and
// sings before it); who each is (the cast); the six in front who turn round to David, behind them, as `turned` passes
// their mark (each late in its own way)
const MEMBERS = [
  { id: 'p0', who: 'man_a', at: [-5.0, 7.6], face: 77, mark: 0.85 },
  { id: 'p1', who: 'woman_a', at: [-4.3, 7.0], face: 67, mark: 0.4 },
  { id: 'p2', who: 'old_man', at: [-5.7, 6.4], face: 67 },
  { id: 'p3', who: 'woman_b', at: [-3.6, 6.6], face: 57, mark: 0.05 },
  { id: 'p4', who: 'farmhand', at: [-4.8, 5.6], face: 55, mark: 0.7 },
  { id: 'p5', who: 'old_woman', at: [-6.0, 4.8], face: 55 },
  { id: 'p6', who: 'girl', at: [-2.9, 7.7], face: 69, mark: 0.25 },
  { id: 'p7', who: 'man_b', at: [3.4, 7.8], face: 282 },
  { id: 'p8', who: 'woman_c', at: [4.3, 7.1], face: 287, shade: true },
  { id: 'p9', who: 'boy', at: [2.7, 6.8], face: 299, mark: 0.55 },
];
// (the front ones step back from the heat)
const back = d => (d > 6.2 ? d - 0.55 : d);
// where one of them looks: down before their feet (heads bowed), or up at Strorm's torch in the hymn
const bowed = m => [m.at[0] + 0.8 * Math.sin((m.face * Math.PI) / 180), m.at[1] + 0.8 * Math.cos((m.face * Math.PI) / 180), 0.2];
// the left ones go home by the track toward Waknuk, the right ones across the fields
const homeL = i => -3.45 + 0.3 * Math.sin(i * 2.1);
const home = (m, i) => (m.at[0] < 0 ? [homeL(i), 34] : [m.at[0] + 9, m.at[1] + 3]);
const JO = [-0.5, 6.8], IN = [1.35, 7.0], EM = [-1.6, 4.95], DV = [-1.05, 4.55];
// where the Inspector breaks off the ear; where he shows it to Strorm; where Strorm lights the field, stands for the hymn
const EDGE_IN = [1.0, 8.85], SHOW = [0.4, 7.0], FIELD = [0.4, 8.95], HYMN_AT = [-1.0, 7.6], ALONG = [-2.0, 8.95];
const TORCH = [HYMN_AT[0], HYMN_AT[1], 3.0];
// in the hymn David and his mother stand turned toward Strorm and the fire (their faces seen from the side)
const SING = 80;
// where David and his mother go by the stalk; the stalk
const STALK = [-2.72, 9.5], BY_STALK = { em: [-3.6, 9.0], dv: [-3.15, 8.3] };
// the camera's places (camera_x, camera_z)
const CAM = { wide: [0, 0], ear: [0.15, 2.4], kneel: [-0.5, 0.9], light: [-0.05, 1.7], hymn: [-0.95, 1.45], stalk: [-2.3, 3.6] };
const camOf = c => ({ camera_x: c[0], camera_z: c[1] });
const loop = motion => ({ motion, loop: true });
const toward = ([a, d], [a2, d2]) => (((Math.atan2(a2 - a, d2 - d) * 180) / Math.PI) + 360) % 360;
// a person's state at rest
const person = (id, [a, d], turn, more = {}) => ({ [`${id}_a`]: a, [`${id}_d`]: d, [`${id}_turn`]: turn, [`${id}_do`]: 'stand', [`${id}_look`]: null,
  [`${id}_reach`]: null, [`${id}_steps`]: true, [`${id}_here`]: true, ...Object.fromEntries(Object.entries(more).map(([k, v]) => [`${id}_${k}`, v])) });
const congregation = (fn) => Object.assign({}, ...MEMBERS.map((m, i) => fn(m, i)));

// ── what a beat does ──
async function walk(s, id, pts, turn, gait) {
  s.set(`${id}_steps`, true);
  if (gait !== undefined) s.person(id).gait(gait);
  await s.person(id).walk(pts);
  if (gait !== undefined) s.person(id).gait(null);
  if (turn != null) await s.person(id).turn(turn);
}
const cam = (s, c, over) => s.all(s.move('camera_x', c[0], { over }), s.move('camera_z', c[1], { over }));
const aside = (s, fn) => s.sequence(fn);
const lower = (p, by) => (typeof p === 'string' ? `${p}#chest` : [p[0], p[1], p[2] - by]);
async function nod(s, id, p, n = 1, slow = 1) {
  for (let i = 0; i < n; i++) {
    s.person(id).look(lower(p, 0.32));
    await s.wait(0.35 * slow);
    s.person(id).look(p);
    await s.wait(0.35 * slow);
  }
}
// everyone of the congregation does it, each a little late (0 … `late` s)
async function each(s, late, fn) {
  await s.all(...MEMBERS.map((m, i) => s.sequence(async q => { await q.wait(late * ((i * 0.618) % 1)); await fn(q, m, i); })));
}
// the hands of David and his mother together (hand in hand), or apart
const hands = (s, on) => { s.person('dv').reach(on ? { l: 'em#hand_r' } : null); s.person('em').reach(on ? { r: 'dv#hand_l' } : null); };
// the torch lit (its fire, its light: jo_torch)
const torch = (s, v, over) => s.move('jo_torch', v, { over });

// ── the state the beats begin at ──
// the first moment: the blue before dawn, all standing heads bowed, David holding his mother's hand
const S0 = {
  fade: 1, fade_color: '#000000', dawn: 0.22, morning: 0, fire: 0, ignite: 0, ash: 0, smoke: 0, jo_torch: 0, turned: 0, in_ear: false, in_toss: 0,
  ...camOf(CAM.wide),
  ...person('jo', JO, 180, { with: ['torch'], wear: { hat: 'hat' } }),
  ...person('in', IN, 180, { with: ['lantern'], wear: { hat: 'hat' } }),
  ...person('em', EM, 150, { reach: { r: 'dv#hand_l' } }),
  ...person('dv', DV, 150, { reach: { l: 'em#hand_r' }, still: false }),
  ...congregation(m => person(m.id, m.at, m.face, { look: bowed(m) })),
};
const DAWN = { ...S0, fade: 0, dawn: 0.25, ...person('in', EDGE_IN, 180, { with: ['lantern'], wear: { hat: 'hat' } }), in_ear: true };
const EAR = { ...DAWN, dawn: 0.28, ...person('in', SHOW, 170, { with: ['lantern'], wear: { hat: 'hat' } }), in_ear: false, in_toss: 1, jo_turn: 100,
  ...congregation(m => ({ [`${m.id}_look`]: null })) };
const KNELT = { ...EAR, jo_turn: 180, jo_reach: { r: [JO[0], JO[1], 3.0] }, jo_look: [JO[0], JO[1] - 1, 5], in_turn: 200, in_look: [SHOW[0], SHOW[1] - 0.8, 0.2],
  ...congregation(m => ({ [`${m.id}_do`]: loop('kneel_pray'), [`${m.id}_look`]: bowed(m) })),
  em_do: loop('kneel_pray') };
const RISEN = { ...EAR, jo_turn: 180 };
const LIT = { ...RISEN, ...camOf(CAM.light), in_turn: 280, jo_turn: 100, jo_torch: 1 };
const BURNING = { ...LIT, ...camOf(CAM.wide), ...person('jo', ALONG, 270, { with: ['torch'], wear: { hat: 'hat' } }), jo_torch: 1,
  ...person('in', [2.3, 7.6], 200, { with: ['lantern'], wear: { hat: 'hat' } }), fire: 1, ignite: 0.07, smoke: 0.35 };
const HYMN = { ...BURNING, ...camOf(CAM.hymn), ...person('jo', HYMN_AT, 180, { with: ['torch'], wear: { hat: 'hat' }, reach: { r: [HYMN_AT[0], HYMN_AT[1] - 0.3, 2.9] } }), jo_torch: 1,
  ignite: 0.4, smoke: 0.75, ...congregation(m => ({ [`${m.id}_d`]: back(m.at[1]), [`${m.id}_do`]: loop('sing_stand'), [`${m.id}_look`]: TORCH })),
  em_do: loop('sing_stand'), em_turn: SING, em_look: TORCH, dv_turn: SING };
const HID = { ...HYMN, dv_a: -1.66, dv_d: 4.68, dv_turn: 13, dv_reach: { r: 'em#hips', l: 'em#hips' }, dv_look: 'em#chest', em_reach: null };
// the grey morning after (set at once under the black)
const GREY = { ash: 1, ignite: 1, fire: 0.12, smoke: 0.42, dawn: 0.82, morning: 1, jo_torch: 0, jo_reach: null, jo_turn: 180, jo_look: null,
  ...congregation(m => ({ [`${m.id}_do`]: 'stand', [`${m.id}_look`]: null })), em_do: 'stand' };
const STALKED = { ...HID, ...GREY, fade: 0, ...camOf(CAM.stalk), ...congregation((m, i) => person(m.id, home(m, i), 0)),
  ...person('in', [5.2, 26], 0, { with: ['lantern'], wear: { hat: 'hat' } }), ...person('em', BY_STALK.em, 180, { reach: { r: 'dv#hand_l' } }),
  ...person('dv', BY_STALK.dv, 125, { reach: { l: 'em#hand_r' }, look: 'stalk#ear' }) };

const FILM = {
  // out of the black: the blue before dawn; the Inspector goes to the edge of the field, goes down on one knee and breaks
  // off an ear
  dawn: {
    from: () => S0,
    run: async s => {
      const ins = s.person('in');
      s.move('fade', 0, { over: 2.2, ease: 'out' });
      s.move('dawn', 0.25, { over: 9.2 });
      await s.wait(1.0);
      await walk(s, 'in', [EDGE_IN], 0);
      ins.look([EDGE_IN[0], EDGE_IN[1] + 0.6, 0.3]);
      await ins.go('kneel_one', { from: EDGE_IN, turn: 0 });
      s.set('in_ear', true);
      await s.wait(0.6);
      await ins.do('kneel_one_rise');
      await ins.turn(180);
    },
  },
  // he brings it to Strorm and holds it up in the lantern light (the camera comes in) — the ear gold in it; the people
  // raise their heads; a long look, two slow nods: an Offence; he turns and flings it over his shoulder back into the wheat
  ear: {
    after: 'dawn',
    from: () => DAWN,
    run: async s => {
      const ins = s.person('in'), jo = s.person('jo');
      cam(s, CAM.ear, 4.5);
      s.move('dawn', 0.28, { over: 12 });
      await walk(s, 'in', [SHOW], 285);
      jo.turn(100);
      ins.reach({ r: 'jo', l: [SHOW[0] - 0.3, SHOW[1], 1.5] });
      ins.look('jo');
      await each(s, 1.0, async (q, m) => { q.person(m.id).look('in'); });
      jo.look('in#hand_r');
      await s.wait(1.6);
      s.tell('ear:nod'); // (two slow nods: an offence)
      await nod(s, 'jo', 'in#hand_r', 2, 2);
      ins.reach(null);
      await ins.turn(170);
      // (the throw: over his shoulder, back into the wheat)
      const thrown = ins.do('throw_back');
      await s.wait(0.8);
      await s.move('in_toss', 1, { over: 1.5, ease: 'linear' });
      s.set('in_ear', false);
      await thrown;
      jo.look(null);
      await each(s, 1.0, async (q, m) => { q.person(m.id).look(bowed(m)); });
      await cam(s, CAM.wide, 3.0);
    },
  },
  // Strorm lifts the unlit torch to heaven; the people go down on their knees and pray, each in their own time. David does
  // not: here the game asks (knees, on dv) — rise if he kneels in time, else kneel_late
  raise: {
    after: 'ear',
    from: () => EAR,
    run: async s => {
      const jo = s.person('jo');
      await jo.turn(180);
      jo.reach({ r: [JO[0], JO[1], 3.0] });
      jo.look([JO[0], JO[1] - 1, 5]);
      const ins = aside(s, async q => { await q.wait(1.0); await q.person('in').turn(200); q.person('in').look([SHOW[0], SHOW[1] - 0.8, 0.2]); });
      await s.wait(0.8);
      const down = q => async (sq, m) => { await sq.person(m.id).go('kneel_down', { from: m.at, turn: m.face }); sq.person(m.id).do('kneel_pray', { loop: true }); sq.person(m.id).look(bowed(m)); };
      const em = aside(s, async q => { await q.wait(0.6); await q.person('em').go('kneel_down', { from: EM, turn: 150 }); q.person('em').do('kneel_pray', { loop: true }); });
      await each(s, 1.4, down(s));
      await s.all(ins, em);
    },
  },
  // David knelt with them: a held prayer; all get up together
  rise: {
    after: 'raise',
    from: () => KNELT,
    run: async s => {
      const dv = s.person('dv'), jo = s.person('jo');
      await dv.go('kneel_down', { from: DV, turn: 150 });
      dv.do('kneel_pray', { loop: true });
      await s.wait(2.4);
      jo.reach(null);
      jo.look(null);
      await s.wait(0.4);
      const up = q => async (sq, m) => { await sq.person(m.id).do('stand_from_kneel'); sq.person(m.id).do('stand'); };
      const ups = each(s, 1.0, up(s));
      s.person('em').do('stand_from_kneel');
      await s.wait(0.3);
      await dv.do('stand_from_kneel');
      await ups;
    },
  },
  // David still standing among the kneeling: the camera finds him; his mother looks up at him and tugs his hand; he goes
  // down, last of all — and gets up last
  kneel_late: {
    after: 'raise',
    from: () => KNELT,
    run: async s => {
      const dv = s.person('dv'), em = s.person('em'), jo = s.person('jo');
      cam(s, CAM.kneel, 1.6);
      em.look('dv');
      await s.wait(0.3);
      em.reach({ r: [DV[0] - 0.2, DV[1] + 0.1, 0.5] });
      await s.wait(0.5);
      await dv.go('kneel_down', { from: DV, turn: 150 });
      dv.do('kneel_pray', { loop: true });
      em.reach({ r: 'dv#hand_l' });
      em.look([EM[0], EM[1] - 0.8, 0.2]);
      await s.wait(1.6);
      jo.reach(null);
      jo.look(null);
      cam(s, CAM.wide, 2.5);
      const up = q => async (sq, m) => { await sq.person(m.id).do('stand_from_kneel'); sq.person(m.id).do('stand'); };
      const ups = each(s, 1.0, up(s));
      em.do('stand_from_kneel');
      await ups;
      await s.wait(0.6);
      await dv.do('stand_from_kneel');
      hands(s, true);
    },
  },
  // he turns to the Inspector and lights the torch at his lantern (the camera comes in): a flare
  light: {
    after: ['rise', 'kneel_late'],
    from: () => RISEN,
    run: async s => {
      const jo = s.person('jo'), ins = s.person('in');
      cam(s, CAM.light, 3.6);
      ins.turn(280);
      await jo.turn(100);
      ins.reach({ r: 'jo#flame' });
      await s.wait(0.4);
      jo.reach({ r: 'in#hand_r' });
      await s.wait(1.3);
      await torch(s, 1.5, 0.35);
      torch(s, 1, 1.0);
      await each(s, 0.8, async (q, m) => { q.person(m.id).look('jo#flame'); });
      await s.wait(0.6);
      jo.reach(null);
      ins.reach(null);
    },
  },
  // to the wheat; the torch up, then down into the stalks: it catches; he drags the fire along the edge to the track
  fire: {
    after: 'light',
    from: () => LIT,
    run: async s => {
      const jo = s.person('jo');
      cam(s, CAM.wide, 4.2);
      aside(s, q => walk(q, 'in', [[2.3, 7.6]], 200));
      await walk(s, 'jo', [FIELD], 0);
      jo.reach({ r: [FIELD[0], FIELD[1] + 0.2, 2.6] });
      await s.wait(1.6);
      jo.reach({ r: [FIELD[0], FIELD[1] + 0.6, 0.2] });
      jo.look([FIELD[0], FIELD[1] + 0.6, 0]);
      await s.wait(0.6);
      s.move('fire', 1, { over: 3 });
      s.tell('fire:caught'); // (the wheat takes the fire)
      s.move('ignite', 0.025, { over: 1.3 });
      s.move('smoke', 0.35, { over: 6 });
      await s.wait(1.2);
      await jo.turn(270);
      s.move('ignite', 0.07, { over: 4.0 });
      await walk(s, 'jo', [ALONG]);
      jo.reach(null);
    },
  },
  // he steps back from the blaze and turns to the people, the torch high; the hymn — heads lifted, hands together, each
  // a little late; the front ones step back from the heat, a woman shades her eyes; the camera comes to David and his
  // mother. It holds there while the game's hymn is sung («Петь со всеми»: `turned` turns the ones in front round to him;
  // the marks — dv, the beat's sign on jo)
  hymn: {
    after: 'fire',
    from: () => BURNING,
    run: async s => {
      const jo = s.person('jo');
      // (the fire goes on spreading the while the hymn is sung — on after the beat, in its pose)
      s.move('ignite', 0.75, { over: 36, ease: 'inOut' });
      s.move('smoke', 0.75, { over: 12 });
      await walk(s, 'jo', [HYMN_AT], 180);
      jo.reach({ r: [HYMN_AT[0], HYMN_AT[1] - 0.3, 2.9] });
      jo.look([HYMN_AT[0], HYMN_AT[1] - 3, 2.5]);
      s.person('em').do('sing_stand', { loop: true });
      s.person('em').turn(SING);
      s.person('em').look(TORCH);
      s.person('dv').turn(SING);
      const sings = each(s, 1.2, async (q, m) => {
        q.person(m.id).do('sing_stand', { loop: true });
        q.person(m.id).look(TORCH);
        if (m.at[1] > 6.2) await walk(q, m.id, [[m.at[0], back(m.at[1])]], m.face);
        if (m.shade) q.person(m.id).do('shade', { loop: true });
      });
      await cam(s, CAM.hymn, 4.5);
      s.tell('hymn:still'); // (the camera stands: the game's hymn may begin)
      await sings;
    },
  },
  // David sings with them, head up; his mother glances down at him; the heads in front go back to the fire; the camera
  // leaves him — one of them — and his father's eyes go over the people and past him
  hymn_loud: {
    after: 'hymn',
    from: () => HYMN,
    run: async s => {
      const jo = s.person('jo'), dv = s.person('dv'), em = s.person('em');
      dv.do('sing_stand', { loop: true });
      dv.look(TORCH);
      cam(s, CAM.wide, 5);
      await s.wait(0.6);
      jo.look([-4.5, 6.2, 1.4]);
      await s.wait(0.2);
      em.look('dv');
      await s.wait(1.8);
      em.look(TORCH);
      jo.look([4.5, 6.2, 1.4]);
      await s.wait(3.6);
      jo.look([HYMN_AT[0], HYMN_AT[1] - 3, 2.5]);
      await s.wait(1.0);
    },
  },
  // David does not sing: the ones in front have turned round (at least three); his father's eyes go slowly over the
  // people and stop on his side; David looks up at him, goes still — lets go of his mother's hand, turns and hides his face
  // in her skirt; she sings on; the eyes move on (the heads go back to the fire as the game lets `turned` fall: the beats
  // never set it)
  hymn_hide: {
    after: 'hymn',
    from: () => HYMN,
    run: async s => {
      const jo = s.person('jo'), dv = s.person('dv');
      jo.look([-4.5, 6.2, 1.4]);
      await s.wait(1.4);
      dv.look('jo');
      await s.wait(1.4);
      s.tell('hymn_hide:look'); // (his father's eyes on his side; he freezes)
      dv.still(true);
      await s.wait(1.2);
      dv.still(false);
      hands(s, false);
      await walk(s, 'dv', [[-1.66, 4.68]], 13);
      dv.reach({ r: 'em#hips', l: 'em#hips' });
      dv.look('em#chest');
      await s.wait(1.0);
      jo.look([4.5, 6.2, 1.4]);
      await s.wait(3.8);
      jo.look([HYMN_AT[0], HYMN_AT[1] - 3, 2.5]);
    },
  },
  // the camera goes back; the field burns away into the dark; to black
  burn: {
    after: ['hymn_loud', 'hymn_hide'],
    from: () => HID,
    run: async s => {
      const jo = s.person('jo');
      cam(s, CAM.wide, 5);
      s.move('ignite', 1, { over: 7, ease: 'inOut' });
      s.move('ash', 0.4, { over: 7 });
      s.move('smoke', 1, { over: 5 });
      await s.wait(0.4);
      jo.reach({ r: [HYMN_AT[0], HYMN_AT[1] - 0.2, 2.0] });
      await s.wait(0.4);
      await jo.turn(180);
      jo.look(null);
      await s.wait(3.8);
      await s.move('fade', 1, { over: 1.8, ease: 'in' });
    },
  },
  // the grey morning after: ash, a little smoke. They go home; the Inspector goes off across the ash; his mother takes
  // David's hand and leads him to the track and along it; by the edge of the ash he stops and turns to the one stalk left
  // standing (the camera comes close). (The game's choice: stalk, on dv)
  morning: {
    after: 'burn',
    from: () => ({ ...HID, fade: 1 }),
    run: async s => {
      const dv = s.person('dv'), em = s.person('em');
      for (const [k, v] of Object.entries(GREY)) s.set(k, v);
      s.move('fade', 0, { over: 2.2, ease: 'out' });
      aside(s, q => each(q, 1.5, (sq, m, i) => walk(sq, m.id, m.at[0] < 0 ? [[home(m, i)[0], m.at[1]], home(m, i)] : [home(m, i)])));
      aside(s, async q => { await q.wait(1.4); await walk(q, 'in', [[5.2, 26]]); });
      await s.wait(3.4);
      dv.reach(null);
      dv.look(null);
      await dv.turn(150);
      hands(s, true);
      await s.wait(1.2);
      aside(s, q => walk(q, 'em', [[-3.6, 5.3], BY_STALK.em], 180));
      await s.wait(0.2);
      await walk(s, 'dv', [[-3.15, 5.0], BY_STALK.dv]);
      cam(s, CAM.stalk, 4.2);
      await s.wait(1.2);
      await dv.turn(125);
      dv.look('stalk#ear');
      await s.wait(1.6);
    },
  },
  // David stays by the stalk, his hand loose in hers, reaching for it; his mother looks back over her shoulder and tugs;
  // they go. Strorm alone before the ash, his back to us; the Inspector fades far off
  stalk_stay: {
    after: 'morning',
    from: () => STALKED,
    run: async s => {
      const dv = s.person('dv'), em = s.person('em');
      dv.reach({ r: 'stalk#ear', l: 'em#hand_r' });
      await s.wait(1.4);
      em.look('dv');
      await s.wait(1.2);
      em.reach({ r: [BY_STALK.em[0] - 0.1, BY_STALK.em[1] + 0.5, 0.9] });
      s.tell('stalk_stay:pull'); // (she looks back over her shoulder and pulls)
      await s.wait(0.7);
      s.person('in').here(false);
      em.reach({ r: 'dv#hand_l' });
      dv.reach({ l: 'em#hand_r' });
      dv.look(null);
      em.look(null);
      cam(s, CAM.wide, 6);
      await s.all(walk(s, 'em', [[-3.6, 34]]), s.sequence(async q => { await q.wait(0.3); await walk(q, 'dv', [[-3.15, 33.6]]); }));
    },
  },
  // David looks away from the stalk and goes on with his mother; she does not look back
  stalk_go: {
    after: 'morning',
    from: () => STALKED,
    run: async s => {
      const dv = s.person('dv');
      dv.look(null);
      s.person('in').here(false);
      await dv.turn(180);
      cam(s, CAM.wide, 6);
      await s.all(walk(s, 'em', [[-3.6, 34]]), s.sequence(async q => { await q.wait(0.1); await walk(q, 'dv', [[-3.15, 33.6]]); }));
    },
  },
};
const SHOWCASE = ['dawn', 'ear', 'raise', 'kneel_late', 'light', 'fire', 'hymn', 'hymn_hide', 'burn', 'morning', 'stalk_stay'];

return { wheat, wheatMove, fireLight, X0, FIELD_L, MEMBERS, DV, TORCH, FILM, SHOWCASE, clamp };
