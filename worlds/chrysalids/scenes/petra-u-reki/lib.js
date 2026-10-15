// Петра у реки (engine 3): what its elements and its scripts share — the near bank's shape (its own metres: x along the
// river, y down; its anchor at across BANK_A, 9 m off; the water's surface at y W), the land under the people, the rings of
// what only their own hear and the rings on the water, and the film: the beats a game plays one at a time by `beat`
// (script.js, the world's module beats) and the showcase plays in order (showcase.js). The people are the engine's (the
// world's cast): david, petra, rosalind, the rakers r0…r2 and the late ones c0…c3 on the far field.
const { clamp, mix } = anim;
const BANK_A = -2.4, W = 0.3, ROOT = [2.5, 0.22];
// the near bank's top (y, its metres): high on the left, sloping down to its toe at x 2; past it the pool's bottom drops
const ys = x => {
  if (x < -5.5) return -1.6 + 0.08 * Math.sin(x * 0.7);
  if (x > 2) return 0.25;
  const u = (x + 5.5) / 7.5;
  return -1.6 + 1.85 * u * u * (3 - 2 * u);
};
const bed = x => (x <= 2 ? ys(x) : 0.25 + Math.pow(x - 2, 1.25) * 0.75);
const wl = x => 0.25 + Math.pow(Math.max(0, x - 2), 1.25) * 0.75 + 0.05 * Math.sin(x * 4.1);
// the far bank's top (its own metres: the water at y 0)
const farTop = x => -2.4 - 0.12 * Math.sin(x / 7 + 0.6) - 0.06 * Math.sin(x / 2.3);
// the land's height (m, up from the near bank's anchor) at a world point: the near bank along its line (2.6 m deep round
// it), the river's bed, the far bank's slope and the field over it
const NEAR = 9.0, FAR = 20.0;
function ground(across, distance) {
  if (distance < NEAR + 0.9) {
    const band = clamp((1.3 - Math.abs(distance - NEAR)) / 0.5, 0, 1);
    return band * -bed(across - BANK_A);
  }
  if (distance < FAR - 1.0) return -1.8;
  const top = -farTop(across) - W, u = clamp((distance - (FAR - 1.0)) / 1.3, 0, 1);
  return mix(-W - 0.4, top, u * u * (3 - 2 * u));
}
// how much water is over the bottom at a place on the near bank's line (m), and how high someone's feet are held over the
// bottom there so that the water comes up to `reach` m over their feet (to the chest swimming, the chin clinging)
const depth = across => Math.max(0, bed(across - BANK_A) - W);
const afloat = (across, reach) => Math.max(0, depth(across) - reach);
// the rings of what only their own hear (cry, bond, heard): each of the element's four rings opening out and fading in
// its turn, `speed` a second; the glow at the head as strong as it is
function rings(e, power, speed) {
  for (let i = 0; i < 4; i++) {
    const k = (e.t * speed + i / 4) % 1, L = e.layer(`ring${i}`);
    L.scale = 0.08 + 0.92 * k;
    L.alpha = power * 0.6 * Math.pow(1 - k, 1.5) * Math.min(1, k * 10);
  }
  e.layer('core').alpha = power * (0.8 + 0.2 * Math.sin(e.t * 2.3));
}
// rings on the water round someone in it (a plane at their place): spreading in turn, while they are in the water
function wake(e, across, here) {
  const on = here && depth(across ?? -99) > 0.3;
  for (let i = 0; i < 3; i++) {
    const k = (e.t * 0.45 + i / 3) % 1, L = e.layer(`w${i}`);
    L.scale = 0.15 + 0.85 * k;
    L.alpha = on ? 0.5 * (1 - k) : 0;
  }
}

// ── where things are (world metres: across, distance) ──
const B = x => x + BANK_A; // a near bank x as across
const PT0 = B(5.3), DOWNSTREAM = B(8.2), CAUGHT = B(7.6);
const EDGE = B(-6.3), TOE = B(1.9), WADE = B(3.1), SHALLOW = B(2.4), SITS = B(1.75), KNEELS = B(1.15), UP = B(-8.8);
const RO = [6.2, 20.9], RO_WATER = [5.6, 19.0], RO_WADE = [5.4, 18.4];
const RAKERS = [{ id: 'r0', who: 'farmhand', at: [1.4, 21.2], turn: 260 }, { id: 'r1', who: 'man_a', at: [3.3, 21.0], turn: 100 },
  { id: 'r2', who: 'man_c', at: [9.6, 21.1], turn: 260 }];
const LATE = [{ id: 'c0', who: 'man_b', to: [-1.8, 21.0] }, { id: 'c1', who: 'woman_a', to: [-0.6, 20.9] },
  { id: 'c2', who: 'old_man', to: [0.7, 21.1] }, { id: 'c3', who: 'woman_c', to: [4.2, 21.0] }];
// the camera's places (camera_x, camera_z, camera_h, camera_look)
const CAM = {
  wide: [0, 0, 0, 0], pool: [2.7, 6.3, 0, 0.47], field: [5.0, 13.0, 0.35, -0.05], edge: [-6.6, 4.0, 1.6, 0.22],
  down: [-0.6, 3.8, 0, 0.14], swim: [2.5, 4.8, 0, 0.23], out: [0.6, 4.4, 0, 0.2], kneel: [-0.9, 5.3, 0, 0.24],
  across: [0.5, 1.4, 1.1, 0.17], across_in: [0.4, 3.2, 0.8, 0.15], home: [-0.6, 2.6, 0.9, 0.15],
};
const camOf = c => ({ camera_x: c[0], camera_z: c[1], camera_h: c[2], camera_look: c[3] });
const cam = (s, c, over) => s.all(...['camera_x', 'camera_z', 'camera_h', 'camera_look'].map((k, i) => s.move(k, c[i], { over })));
const loop = motion => ({ motion, loop: true });
const aside = (s, fn) => s.sequence(fn);
async function walk(s, id, pts, turn, gait) {
  s.set(`${id}_steps`, true);
  if (gait !== undefined) s.person(id).gait(gait);
  await s.person(id).walk(pts);
  if (gait !== undefined) s.person(id).gait(null);
  if (turn != null) await s.person(id).turn(turn);
}
// moved through the water at a swimmer's pace (no steps: the place goes, the swimming is the motion), keys together
const swimTo = (s, keys, pts, speed = 0.8) => s.path(keys, pts, { speed, ease: 'inOut' });

// ── the state the beats begin at ──
const S = {
  fade: 1, fade_color: '#000000', rain: 0.5, danger: 0.35, branch: 0.2, cry: 0, splash: 0, heard: 0, bond: 0, after: 0,
  ...camOf(CAM.wide),
  petra_a: PT0, petra_d: NEAR, petra_do: loop('cling'), petra_turn: 200, petra_look: null, petra_reach: { r: 'willow#tip', l: 'willow#tip' },
  petra_steps: false, petra_on: null, petra_here: true, pt_sink: 0,
  david_a: B(-15), david_d: NEAR - 0.3, david_do: 'stand', david_turn: 90, david_look: null, david_reach: null, david_steps: true, david_gait: null, david_here: true,
  rosalind_a: RO[0], rosalind_d: RO[1], rosalind_do: loop('rake'), rosalind_turn: 100, rosalind_look: null, rosalind_reach: null, rosalind_with: ['rake'],
  rosalind_still: false, rosalind_here: true, rosalind_steps: true, rosalind_gait: null, ro_drop: 0,
  ...Object.assign({}, ...RAKERS.map(r => ({ [`${r.id}_a`]: r.at[0], [`${r.id}_d`]: r.at[1], [`${r.id}_do`]: loop('rake'), [`${r.id}_turn`]: r.turn,
    [`${r.id}_look`]: null, [`${r.id}_with`]: ['rake'], [`${r.id}_steps`]: true }))),
  ...Object.assign({}, ...LATE.map(c => ({ [`${c.id}_a`]: c.to[0] - 15, [`${c.id}_d`]: c.to[1], [`${c.id}_here`]: false, [`${c.id}_do`]: 'stand', [`${c.id}_turn`]: 90, [`${c.id}_look`]: null }))),
};
// she cries out in the pool, her head thrown back (pool's end)
const CRYING = { ...S, fade: 0, branch: 0.45, danger: 0.6, cry: 1, ...camOf(CAM.pool), petra_look: [PT0, NEAR + 6, 3] };
// on the field: Rosalind stopped dead, turned to the river (struck's end)
const STRUCK = { ...CRYING, ...camOf(CAM.field), cry: 0.65, heard: 0.5, rosalind_do: 'stand', rosalind_still: true, rosalind_turn: 35 };
// David at the edge of the near bank, looking down at her (edge's end)
const AT_EDGE = { ...STRUCK, ...camOf(CAM.edge), heard: 0, rosalind_still: false, david_a: EDGE, david_look: 'petra' };
// he has her, out in the stream, her arms round his neck (run's end)
const HAS_HER = { ...AT_EDGE, ...camOf(CAM.swim), branch: 1.1, david_a: CAUGHT, david_d: NEAR, david_do: loop('swim'), david_turn: 270, david_look: 'petra',
  petra_a: CAUGHT + 0.25, petra_d: NEAR + 0.15, petra_turn: 90, petra_reach: { r: 'david#nape', l: 'david#nape' } };
// on the field after the cry (field_quiet's end): Rosalind gone down to the water, the rake on the ground
// the far field cut to after the swim (the cry left as the game's «Успокоить» left it)
const without = (o, key) => { const { [key]: _, ...rest } = o; return rest; };
const FIELD = () => ({ ...without(HAS_HER, 'cry'), ...camOf(CAM.field) });
const DOWN = { ...HAS_HER, ...camOf(CAM.field), rosalind_a: RO_WATER[0], rosalind_d: RO_WATER[1], rosalind_turn: 200, rosalind_do: 'stand',
  rosalind_with: null, ro_drop: 1, cry: 0 };
// by the water's edge on the near bank: she sits and cries, he kneels by her, his hand on her shoulder (out's end)
const SAT = { ...DOWN, ...camOf(CAM.kneel), rain: 0.35, david_a: KNEELS, david_d: NEAR, david_do: loop('kneel_one_still'), david_turn: 90,
  david_reach: { r: 'petra#shoulder_l' }, david_look: 'petra', petra_a: SITS, petra_d: NEAR + 0.05, petra_do: loop('cry_sit'), petra_turn: 340,
  petra_reach: null, petra_look: null,  rosalind_a: RO_WADE[0], rosalind_d: RO_WADE[1], rosalind_look: 'david' };

const FILM = {
  // the pool: wide, then a slow push in to Petra; the branch bending; she slips under to the chin and hauls herself up;
  // a breath — and she cries out, the head thrown back, without a sound
  pool: {
    from: () => S,
    run: async s => {
      const petra = s.person('petra');
      s.move('fade', 0, { over: 2.5, ease: 'out' });
      s.move('branch', 0.45, { over: 8 });
      s.move('danger', 0.6, { over: 8 });
      await s.wait(0.5);
      petra.look([B(-6), NEAR - 0.5, 1.5]);
      await s.wait(2.1);
      cam(s, CAM.pool, 7.4);
      await s.wait(1.2);
      petra.look([PT0, NEAR + 10, 2]);
      await s.wait(1.6);
      // (the current drags her under to the chin; she hauls herself up)
      await s.move('pt_sink', 0.45, { over: 0.35, ease: 'in' });
      await s.move('pt_sink', 0.02, { over: 0.8, ease: 'out' });
      await s.wait(0.5);
      petra.look([PT0, NEAR, -1]);
      await s.wait(0.5);
      petra.look([PT0, NEAR + 6, 3]);
      await s.move('cry', 1, { over: 0.6, ease: 'out' });
      await s.wait(0.8);
    },
  },
  // the far field, from below the bank: Rosalind stops dead among the rakers — nobody else hears; she turns to the river
  struck: {
    after: [],
    from: () => ({ ...CRYING, ...camOf(CAM.field) }),
    run: async s => {
      const ro = s.person('rosalind');
      s.move('heard', 1, { over: 0.8, ease: 'out' });
      await s.wait(0.6);
      ro.do('stand');
      ro.still(true);
      s.move('cry', 0.65, { over: 3 });
      await s.wait(0.5);
      ro.still(false);
      await ro.turn(35);
      await s.move('heard', 0.5, { over: 1.4 });
      await s.wait(0.6);
    },
  },
  // the near bank: David bursts in along the top, running, and stops at the edge — he sees her; a breath, his eyes on her,
  // on the water. (While edge and run play the game's «Успокоить» drives `cry`: the beats leave it alone; the camera goes.)
  edge: {
    after: [],
    from: () => ({ ...without(STRUCK, 'cry'), ...camOf(CAM.edge), heard: 0, rosalind_still: false }),
    run: async s => {
      const david = s.person('david');
      await walk(s, 'david', [[EDGE, NEAR - 0.3]], 90, 'run');
      david.look('petra');
      await s.wait(1.4);
      david.look([WADE, NEAR, -0.3]);
      await s.wait(1.2);
      david.look('petra');
      await s.wait(1.6);
    },
  },
  // down the clay, gathering speed; into the water, slowed by it; the branch snaps — the current takes her downstream,
  // under and up; he throws himself in and swims after her, and has her: she comes up clinging to his neck; he turns
  run: {
    after: 'edge',
    from: () => AT_EDGE,
    run: async s => {
      const david = s.person('david'), petra = s.person('petra');
      cam(s, CAM.down, 3.4);
      await walk(s, 'david', [[TOE, NEAR - 0.1]], null, 'run');
      await walk(s, 'david', [[WADE, NEAR]]);
      // (the branch snaps; the current takes her)
      await s.move('branch', 1, { over: 0.45, ease: 'in' });
      s.set('splash', (s.state.splash || 0) + 1);
      petra.reach(null);
      const carried = aside(s, async q => {
        q.move('petra_a', DOWNSTREAM, { over: 6.0, ease: 'out' });
        for (const [k, v, over] of [[0.9, 1.0, 'in'], [0.55, 0.5, 'out'], [1.0, 0.8, 'in'], [0.65, 0.5, 'out'], [1.0, 0.8, 'in'], [0.6, 0.5, 'out']]) await q.move('pt_sink', k, { over: v, ease: over });
      });
      cam(s, CAM.swim, 5.2);
      await s.wait(0.6);
      // (he throws himself in and swims after her)
      david.do('swim', { loop: true });
      s.set('splash', (s.state.splash || 0) + 1);
      s.set('david_steps', false);
      await swimTo(s, ['david_a'], [[WADE], [CAUGHT]], 0.75);
      await carried;
      s.set('pt_sink', 0);
      petra.reach({ r: 'david#nape', l: 'david#nape' });
      s.move('petra_a', CAUGHT + 0.25, { over: 0.6 });
      await s.wait(0.4);
      await david.turn(270);
      david.look('petra');
      await s.wait(0.8);
    },
  },
  // the far field: the cry has died down — Rosalind lets the rake fall and runs down to the river alone; the rakers never
  // look up
  field_quiet: {
    after: [],
    from: () => FIELD(),
    run: async s => {
      const ro = s.person('rosalind'), back = s.shot({ ...camOf(CAM.swim) });
      s.move('heard', 0.35, { over: 0.6, ease: 'out' });
      await s.wait(0.4);
      await ro.turn(0);
      ro.do('stand');
      await s.wait(0.6);
      ro.with(null);
      s.set('ro_drop', 1);
      s.move('heard', 0, { over: 2.0 });
      await walk(s, 'rosalind', [RO_WATER], 200, 'run');
      back.cut(); // (back to the pool — the cut said ahead: `out` goes on from it)
    },
  },
  // the far field: the cry hits hard — her hands to her head, the rake falls; the rakers stop and look at her, each in his
  // own time (they hear nothing — they see her); she runs down to the river, and one of them goes down after her
  field_loud: {
    after: [],
    from: () => FIELD(),
    run: async s => {
      const ro = s.person('rosalind'), back = s.shot({ ...camOf(CAM.swim) });
      s.move('heard', 1, { over: 0.5, ease: 'out' });
      await s.wait(0.3);
      ro.do('stand');
      ro.reach({ r: 'rosalind#head', l: 'rosalind#head' });
      ro.look([RO[0], RO[1] + 1, 0]);
      await s.wait(0.3);
      ro.with(null);
      s.set('ro_drop', 1);
      const stare = Promise.all(RAKERS.map((r, i) => aside(s, async q => {
        await q.wait(0.3 + 0.5 * i);
        q.person(r.id).do('stand');
        q.person(r.id).look('rosalind');
        await q.person(r.id).turn(Math.atan2(RO[0] - r.at[0], RO[1] - r.at[1]) * 180 / Math.PI);
      })));
      await s.wait(1.6);
      ro.reach(null);
      ro.look(null);
      await ro.turn(200);
      const runs = walk(s, 'rosalind', [RO_WATER], 200, 'run');
      s.move('heard', 0.4, { over: 2.0 });
      await s.wait(0.8);
      await stare;
      const follows = walk(s, 'r1', [[4.7, 19.8]], 200);
      await s.all(runs, follows);
      back.cut(); // (back to the pool — the cut said ahead: `out` goes on from it, the far bank as this left it)
    },
  },
  // back at the pool: he brings Petra back and finds his feet; she stands, her hand in his; he leads her out; she sits down
  // on the bank and only now cries, her face in her hands; he kneels by her, his hand on her shoulder. Across the water,
  // Rosalind wades in
  out: {
    after: ['field_quiet', 'field_loud'],
    from: () => ({ ...without(DOWN, 'cry'), ...camOf(CAM.swim) }),
    run: async s => {
      const david = s.person('david'), petra = s.person('petra');
      cam(s, CAM.out, 5);
      s.move('rain', 0.35, { over: 12 });
      s.move('cry', 0, { over: 3 });
      aside(s, q => walk(q, 'rosalind', [RO_WADE], 200));
      await swimTo(s, ['david_a', 'petra_a'], [[CAUGHT, CAUGHT + 0.25], [WADE, WADE + 0.3]], 0.7);
      // (his feet on the bottom: she stands, her hand in his)
      david.do('stand');
      s.set('david_steps', true);
      s.set('petra_steps', true);
      petra.do('stand');
      petra.reach({ r: 'david#hand_l' });
      david.reach({ l: 'petra#hand_r' });
      await david.turn(270);
      const leads = walk(s, 'petra', [[SITS + 0.6, NEAR + 0.05], [SITS, NEAR + 0.05]]);
      await walk(s, 'david', [[SHALLOW, NEAR], [KNEELS, NEAR]]);
      await leads;
      s.tell('out:bank'); // (on the bank)
      cam(s, CAM.kneel, 3.5);
      david.reach(null);
      petra.reach(null);
      await david.turn(90);
      await petra.go('sit_down_ground', { from: [SITS, NEAR + 0.05], turn: 340 });
      david.go('kneel_one', { from: [KNEELS, NEAR], turn: 90 });
      await s.wait(0.4);
      petra.do('cry_sit', { loop: true });
      await s.wait(1.0);
      david.do('kneel_one_still', { loop: true });
      david.reach({ r: 'petra#shoulder_l' });
      david.look('petra');
      s.person('rosalind').look('david');
      await s.wait(1.2);
    },
  },
  // wide, across the water: he and Rosalind hear each other (warm rings); only the rain
  bank_quiet: {
    after: [],
    from: () => ({ ...SAT, ...camOf(CAM.across) }),
    run: async s => {
      await s.wait(0.8);
      s.move('bond', 1, { over: 2 });
      s.tell('bank_quiet:across'); // (Rosalind across the water: they hear each other)
      s.person('david').look('rosalind');
      await s.wait(1.2);
      await cam(s, CAM.across_in, 11);
    },
  },
  // the same — but the others come along the far top, late, one by one, and stand staring; the raker at the water's edge
  bank_loud: {
    after: [],
    from: () => ({ ...SAT, ...camOf(CAM.across), r1_a: 4.7, r1_d: 19.8, r1_do: 'stand', r1_look: 'rosalind', r0_do: 'stand', r2_do: 'stand' }),
    run: async s => {
      await s.wait(0.8);
      s.move('bond', 1, { over: 2 });
      s.tell('bank_loud:across'); // (Rosalind across the water: they hear each other)
      s.person('david').look('rosalind');
      const come = LATE.map((c, i) => aside(s, async q => {
        await q.wait(1.7 + i * 1.6);
        q.person(c.id).here(true);
        await walk(q, c.id, [c.to], 180);
        q.person(c.id).look('rosalind');
      }));
      await cam(s, CAM.across_in, 11);
      await Promise.all(come);
    },
  },
  // they look away; Rosalind turns her back and wades out, slowly; she lifts her face; he gets his arms under her and rises
  // with her in his arms (scoop → carry) and carries her up the bank, home; fade
  home: {
    after: ['bank_quiet', 'bank_loud'],
    from: () => ({ ...SAT, ...camOf(CAM.across_in), bond: 1 }),
    run: async s => {
      const david = s.person('david'), petra = s.person('petra'), ro = s.person('rosalind');
      s.move('bond', 0, { over: 1.5 });
      s.move('after', 1, { over: 1.5 });
      cam(s, CAM.home, 9);
      david.look('petra');
      ro.look(null);
      aside(s, async q => { await ro.turn(20); await walk(q, 'rosalind', [[RO_WATER[0] - 0.5, RO_WATER[1] + 0.8]]); });
      await s.wait(1.0);
      david.reach(null);
      petra.do('stand');
      await s.wait(0.8);
      // (his arms under her, up with her in his arms)
      const lifts = david.go('scoop', { to: [KNEELS + 0.2, NEAR], turn: 90 });
      await s.wait(0.9);
      petra.on({ at: 'david#hands', up: -0.22 });
      petra.do('carried', { loop: true });
      s.set('petra_turn', 180);
      await lifts;
      david.do('carry', { loop: true });
      await david.turn(270);
      await walk(s, 'david', [[B(-1.5), NEAR - 0.2], [UP, NEAR - 0.3]], null, 'carry_walk');
      await s.move('fade', 1, { over: 2.5, ease: 'in' });
    },
  },
};
const SHOWCASE = ['pool', 'struck', 'edge', 'run', 'field_loud', 'out', 'bank_loud', 'home'];

return { BANK_A, W, ROOT, NEAR, ys, bed, wl, farTop, ground, depth, afloat, rings, wake, FILM, SHOWCASE, clamp };
