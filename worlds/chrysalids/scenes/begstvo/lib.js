// Бегство (engine 3): what its elements and its scripts share — the ridge (lib.cr: its crest at 9 m, metres across; the
// track along it, dropping past x 2.2 into a hollow 1.75 m under the crest, x 4.4…12.5, then on down out of sight), the
// land, the horses (the world's module chrysalids: the great-horse with its panniers, the pack horse, Sheba, the two
// searchers' horses) and the film: the beats a game plays one at a time by `beat` (script.js, the world's module beats)
// and the showcase plays in order (showcase.js). The people are the cast's: rosalind (on the great-horse's saddle, her bow),
// petra, david, searcher and searcher2 (in their saddles, lanterns).
const { clamp, mix } = anim;
const cr = x => {
  let c = 1.2 + 0.12 * Math.sin(x * 0.31 + 0.6) + 0.06 * Math.sin(x * 0.77);
  if (x < -3) { const k = Math.min(1, (-3 - x) / 12), s = k * k * (3 - 2 * k); c = c * (1 - s) + (0.25 + 0.1 * Math.sin(x * 0.2)) * s; }
  if (x > 3.5) { const k = Math.min(1, (x - 3.5) / 9), s = k * k * (3 - 2 * k); c = c * (1 - s) + 0.2 * s; }
  return c;
};
const ss = u => (u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u));
// the track's height (m, up) at x across: on the crest, then down into the hollow past the shoulder, then on down
const track = x => cr(x) - (x > 2.2 ? 1.75 * ss((x - 2.2) / 2.2) : 0) - (x > 12.5 ? 0.6 * Math.pow(x - 12.5, 1.4) : 0);
// the land: the near slope rising from where we stand to the track (at 9 m), the track, and the land falling away behind
const D = 9.0;
function ground(across, distance) {
  const t = track(across);
  if (distance <= D) return t * ss((distance - 3.5) / (D - 3.5 - 0.6));
  return mix(t, Math.min(t, 0), ss((distance - D - 0.6) / 2.4));
}
// the horses: which kind, the state keys of their place, heading, head tossed, being there
const HORSES = {
  great: { kind: 'great', across: 'great_a', distance: 'great_d', face: 'great_face', toss: 'great_toss' },
  pack: { kind: 'pack', across: 'pack_a', distance: 'pack_d', face: 'pack_face', toss: 'pack_toss' },
  sheba: { kind: 'sheba', across: 'sheba_a', distance: 'sheba_d', face: 'sheba_face', toss: 'sheba_toss', here: 'sheba_here' },
  horse1: { kind: 'horse', across: 'h1_a', distance: 'h1_d', face: 'h1_face', toss: 'h1_toss', here: 'h1_here' },
  horse2: { kind: 'horse', across: 'h2_a', distance: 'h2_d', face: 'h2_face', here: 'h2_here' },
};
// who rides which horse's saddle: their feet in its stirrups, their hands on its reins (script.js keeps them as it turns)
const RIDERS = { rosalind: 'great', searcher: 'horse1', searcher2: 'horse2', david: 'sheba' };
const pace = (gait, kind) => kit.chrysalids.horse.pace(gait, kind);
const spot = (id, face, p) => kit.chrysalids.horse.spot(id, face, HORSES[id].kind, p);
// where Petra sits before David on Sheba's saddle (its frame); where a hand slaps her rump; the pack horse's crupper
const BEFORE = [0, 0.98, 0.26], RUMP = [0, 0.95, -0.5], CRUPPER = [0, 0.92, -0.62];

// ── where things are (across along the track, at its distance) ──
const GX = 0.3, PACK_BEHIND = 3.4, SHEBA_BY = -0.6, SHEBA_D = D - 0.22, HOLLOW = 11.3, AWAY = 24;
const BY_GREAT = -0.45; // where David stands by the great-horse's near side to hand Petra up
// the camera's places (camera_x, camera_z)
const CAM = { wide: [0, 0], met: [0, 2.2], keep: [-3.4, 0], hollow: [5.2, -2.5], go_far: [6, 0], crest: [-1.2, 0], away: [7, 0] };
const camOf = c => ({ camera_x: c[0], camera_z: c[1] });
const cam = (s, c, over) => s.all(s.move('camera_x', c[0], { over }), s.move('camera_z', c[1], { over }));
const loop = motion => ({ motion, loop: true });
const aside = (s, fn) => s.sequence(fn);
async function walk(s, id, pts, turn, gait) {
  s.set(`${id}_steps`, true);
  if (gait !== undefined) s.person(id).gait(gait);
  await s.person(id).walk(pts);
  if (gait !== undefined) s.person(id).gait(null);
  if (turn != null) await s.person(id).turn(turn);
}
// a horse (and whoever it carries) along the track at a gait's own pace — the great-horse's pack horse follows it on its rope
const ride = (s, id, x, gait = 'walk', ease = 'linear') => s.path([`${HORSES[id].across}`], [[s.state[HORSES[id].across]], [x]], { speed: pace(gait, HORSES[id].kind), ease });
const lead = (s, x, gait = 'walk') => s.all(ride(s, 'great', x, gait), ride(s, 'pack', x - PACK_BEHIND, gait));
const turnHorse = (s, id, deg, over = 1.6) => s.move(HORSES[id].face, deg, { over });
const seat = id => ({ at: `${id}#seat`, up: -0.5 });

// ── the state the beats begin at ──
const START = {
  fade: 1, fade_color: '#000000', dawn: 0.1, mist: 0.7, fog: 0, pursuers: 0.12, ...camOf(CAM.wide),
  great_a: GX, great_d: D, great_face: 90, great_toss: 0,
  pack_a: GX - PACK_BEHIND, pack_d: D + 0.1, pack_face: 90, pack_toss: 0,
  sheba_a: -13, sheba_d: SHEBA_D, sheba_face: 90, sheba_toss: 0, sheba_here: true, sheba_led: false,
  h1_a: -20, h1_d: D, h1_face: 90, h1_toss: 0, h1_here: false, h2_a: -23.4, h2_d: D, h2_face: 90, h2_here: false,
  rosalind_on: seat('great'), rosalind_do: loop('perch_still'), rosalind_turn: 90, rosalind_look: [-6, D, 1.5], rosalind_with: null, rosalind_here: true,
  petra_on: spot('sheba', 90, BEFORE), petra_do: loop('perch_still'), petra_turn: 90, petra_look: null, petra_reach: null, petra_peek: 0,
  david_on: seat('sheba'), david_do: loop('perch_still'), david_turn: 90, david_look: null, david_with: null, david_steps: true, david_here: true,
  searcher_on: seat('horse1'), searcher_do: loop('perch_still'), searcher_turn: 90, searcher_with: ['lantern'], searcher_wear: { hat: 'hat' }, searcher_here: false, searcher_look: null,
  searcher2_on: seat('horse2'), searcher2_do: loop('perch_still'), searcher2_turn: 90, searcher2_with: ['lantern'], searcher2_wear: { hat: 'hat' }, searcher2_here: false,
  lamp: 0, lamp_x: 6, search_point: 0, arrow: 0, arrow_high: false,
};
// Sheba come up to the great-horse (arrive's end)
const MET = { ...START, fade: 0, pursuers: 0.35, ...camOf(CAM.met), sheba_a: SHEBA_BY };
// Petra in the near pannier, David on his feet by the great-horse (handover's end)
const IN_BASKET = { at: 'great#basket_r', up: -0.35 };
const HANDED = { ...MET, petra_on: IN_BASKET, petra_do: loop('sit_knees'), petra_turn: 0, petra_look: [-6, D, 1.2],
  david_on: null, david_do: 'stand', david_a: BY_GREAT, david_d: SHEBA_D - 0.5, david_turn: 270 };
// Sheba turned for home, his hand on her neck (sheba_turn's end)
const TURNED = { ...HANDED, sheba_face: 270, david_a: -0.25, david_reach: { r: 'sheba#head' }, david_look: 'sheba' };
// she has gone (sheba_go's end): he stands looking after her
const OFF = { ...TURNED, sheba_a: -16, sheba_here: false, david_reach: null, david_turn: 270, david_look: [-12, D, 1] };
// David in the far pannier (climb's end)
const ABOARD = { ...OFF, david_on: { at: 'great#basket_l', up: -0.35 }, david_do: loop('sit_knees'), david_turn: 0, david_look: [6, D, 1.5] };
// the bow drawn back at the lanterns (bow's end)
const ARMED = { ...ABOARD, pursuers: 0.65, rosalind_with: ['bow'], rosalind_turn: 270, rosalind_do: 'stand', rosalind_look: [-30, D, 3], david_look: [-12, D, 1.5], petra_peek: 0.3 };
// stopped in the fog of the hollow (hollow's end); with Sheba led behind the pack horse if she was kept
const IN_HOLLOW = { ...ARMED, rosalind_with: ['bow'], rosalind_do: loop('perch_still'), rosalind_turn: 90, fog: 0.6, dawn: 0.25, ...camOf(CAM.hollow),
  great_a: HOLLOW, pack_a: HOLLOW - PACK_BEHIND };
// the search on the crest above the hollow, the lantern raised toward the fog (watch's end)
const WATCHED = { ...IN_HOLLOW, searcher_here: true, searcher2_here: true, h1_here: true, h2_here: true, h1_a: 0.9, h2_a: -1.7, lamp: 0.6, lamp_x: 7,
  searcher_look: [7, D + 0.5, -0.3] };

const FILM = {
  // I. Night on the ridge: the great-horse waits, Rosalind in its saddle watching the track; lanterns far behind. Sheba
  // comes up the track at a trot with David and Petra, and stops by the great-horse
  arrive: {
    from: () => START,
    run: async s => {
      s.move('fade', 0, { over: 2.5, ease: 'out' });
      s.move('pursuers', 0.35, { over: 10 });
      await s.wait(1.0);
      await ride(s, 'sheba', SHEBA_BY, 'trot', 'out');
      cam(s, CAM.met, 5);
      s.person('rosalind').look('david');
      await s.move('great_toss', 1, { over: 0.4 });
      await s.move('great_toss', 0, { over: 1.2 });
      await s.wait(1.5);
    },
  },
  // (game) Petra is already in the pannier; David rides up alone; she rises to see him; he slides down
  arrive_alone: {
    from: () => ({ ...START, petra_on: IN_BASKET, petra_do: loop('sit_knees'), petra_turn: 0, petra_peek: 0.5 }),
    run: async s => {
      s.move('fade', 0, { over: 2.5, ease: 'out' });
      s.move('pursuers', 0.35, { over: 10 });
      await s.wait(1.0);
      await ride(s, 'sheba', SHEBA_BY, 'trot', 'out');
      cam(s, CAM.met, 5);
      s.move('petra_peek', 1, { over: 0.8, ease: 'out' });
      s.person('petra').look('david');
      await s.move('great_toss', 1, { over: 0.4 });
      s.move('great_toss', 0, { over: 1.2 });
      s.person('david').on(null);
      await s.person('david').go('dismount', { to: [BY_GREAT, SHEBA_D - 0.5], turn: 270 });
      s.move('petra_peek', 0.8, { over: 1.2 });
    },
  },
  // II. David slides down; lifts Petra; Rosalind takes her into the pannier; Petra looks out
  handover: {
    after: 'arrive',
    from: () => MET,
    run: async s => {
      const david = s.person('david'), petra = s.person('petra'), ro = s.person('rosalind');
      david.on(null);
      await david.go('dismount', { to: [BY_GREAT, SHEBA_D - 0.5], turn: 270 });
      david.look('petra');
      await s.wait(0.3);
      const lifts = david.do('lift_into');
      await s.wait(0.8);
      petra.on({ at: 'david#hands', up: -0.22 });
      petra.do('carried', { loop: true });
      await s.wait(1.0);
      ro.reach({ r: 'petra#chest' });
      ro.look('petra');
      await lifts;
      petra.on(IN_BASKET);
      petra.do('sit_knees', { loop: true });
      s.set('petra_turn', 0);
      await s.wait(0.4);
      ro.reach(null);
      ro.look([-6, D, 1.5]);
      s.move('petra_peek', 0.8, { over: 1.2, ease: 'out' });
      petra.look([-6, D, 1.2]);
      david.do('stand');
      await s.wait(1.0);
    },
  },
  // III. He turns Sheba for home and lays his hand on her neck (the game asks here, on david: send her home, or take her)
  sheba_turn: {
    after: ['handover', 'arrive_alone'],
    from: () => HANDED,
    run: async s => {
      const turning = turnHorse(s, 'sheba', 270, 2.2);
      await walk(s, 'david', [[-0.25, SHEBA_D - 0.5]], 270);
      s.person('david').reach({ r: 'sheba#head' });
      s.person('david').look('sheba');
      await turning;
      await s.wait(0.6);
    },
  },
  // IV. He raises his hand, slaps her rump: she bolts back alone. He watches her go, his shoulders drop. No way back
  sheba_go: {
    after: 'sheba_turn',
    from: () => TURNED,
    run: async s => {
      const david = s.person('david');
      david.reach(null);
      await s.wait(0.4);
      david.reach({ r: spot('sheba', 270, [0, 1.4, -0.5]) });
      await s.wait(0.6);
      david.reach({ r: spot('sheba', 270, RUMP) });
      await s.wait(0.2);
      s.move('sheba_toss', 1, { over: 0.3 });
      s.tell('sheba_go:gone'); // (she goes off home alone)
      const goes = ride(s, 'sheba', -16, 'canter', 'in');
      await s.wait(0.4);
      david.reach(null);
      s.move('sheba_toss', 0, { over: 0.8 });
      david.look('sheba');
      await goes;
      s.set('sheba_here', false);
      david.look([-12, D, 1]);
      await david.do('turn_away');
      await s.wait(0.8);
    },
  },
  // (game) He cannot: leads her back past the great-horse and ties her rein to the pack horse's crupper; comes back
  sheba_keep: {
    after: 'sheba_turn',
    from: () => TURNED,
    run: async s => {
      const david = s.person('david');
      cam(s, CAM.keep, 5.8);
      const back = GX - PACK_BEHIND - 2.6;
      await s.all(walk(s, 'david', [[back + 0.5, SHEBA_D - 0.5]], 90), ride(s, 'sheba', back));
      await turnHorse(s, 'sheba', 90, 2.0);
      david.reach({ r: spot('pack', 90, CRUPPER) });
      david.look('pack');
      await s.wait(1.4);
      s.move('sheba_toss', 0.6, { over: 0.3 });
      await s.wait(0.4);
      s.move('sheba_toss', 0, { over: 0.8 });
      david.reach(null);
      s.set('sheba_led', true);
      cam(s, CAM.wide, 5);
      await walk(s, 'david', [[-0.25, SHEBA_D - 0.5]], 90);
    },
  },
  // V. He turns to the great-horse and climbs it, Rosalind's hand pulling him up, into the far pannier
  climb: {
    after: ['sheba_go', 'sheba_keep'],
    from: () => OFF,
    run: async s => {
      const david = s.person('david'), ro = s.person('rosalind');
      await david.turn(0);
      david.look('rosalind');
      await s.wait(0.6);
      ro.reach({ l: 'david#hand_r' });
      ro.look('david');
      david.reach({ r: 'rosalind#hand_l' });
      await david.go('mount', { from: [GX - 0.3, D + 0.6], turn: 0 });
      david.reach(null);
      ro.reach(null);
      david.on({ at: 'great#basket_l', up: -0.35 });
      david.do('sit_knees', { loop: true });
      ro.look([-6, D, 1.5]);
      s.person('petra').look('david');
      await s.wait(1.2);
    },
  },
  // VI. Rosalind turns forward, then looks back at the lanterns and takes up her bow, draws it — in profile against the
  // pale sky; David turns; Petra ducks
  bow: {
    after: 'climb',
    from: () => ABOARD,
    run: async s => {
      const ro = s.person('rosalind');
      ro.look([12, D, 1.5]);
      s.move('pursuers', 0.65, { over: 6 });
      await s.wait(1.6);
      ro.look([-30, D, 3]);
      s.person('david').look([-12, D, 1.5]);
      await s.wait(0.6);
      ro.with(['bow']);
      s.move('petra_peek', 0.3, { over: 1.0 });
      await ro.do('draw_bow');
      s.move('great_toss', 0.5, { over: 0.3 });
      await s.wait(0.6);
      s.move('great_toss', 0, { over: 0.8 });
      await s.wait(0.6);
    },
  },
  // VII. They go: walk, then trot, over the ridge's shoulder, down through the fog of the hollow and out of sight —
  // Rosalind the last, looking back with her bow. The camera comes back to the empty crest
  go: {
    after: 'bow',
    from: () => ARMED,
    run: async s => {
      const ro = s.person('rosalind');
      s.person('david').look([6, D, 1.5]);
      cam(s, CAM.go_far, 10);
      s.move('dawn', 0.45, { over: 17 });
      s.move('fog', 0.75, { over: 8 });
      s.move('mist', 0.85, { over: 12 });
      s.move('pursuers', 0.85, { over: 12 });
      await lead(s, 2.8);
      ro.look([-20, D, 2]);
      await lead(s, 14, 'trot');
      cam(s, CAM.crest, 6.5);
      await lead(s, AWAY, 'trot');
    },
  },
  // VIII. The search comes up the track with lanterns, stops on the empty crest, raises a lantern, peers into the mist
  search: {
    after: 'go',
    from: () => ({ ...ARMED, great_a: AWAY, pack_a: AWAY - PACK_BEHIND, fog: 0.75, dawn: 0.4, mist: 0.85, pursuers: 0.85, ...camOf(CAM.crest) }),
    run: async s => {
      for (const k of ['searcher_here', 'searcher2_here', 'h1_here', 'h2_here']) s.set(k, true);
      await s.all(ride(s, 'horse1', -3.8, 'walk', 'out'), s.sequence(async q => { await q.wait(1.2); await ride(q, 'horse2', -7.2, 'walk', 'out'); }));
      s.person('searcher').look([6, D + 1, 0]);
      await s.move('lamp', 0.6, { over: 2.2 });
      await s.wait(1.0);
    },
  },
  // (game) over the shoulder and down into the hollow, and there they stop in the fog; the camera draws back to hold the
  // hollow and the crest above it
  hollow: {
    after: 'bow',
    from: () => ARMED,
    run: async s => {
      const framed = cam(s, CAM.hollow, 9);
      s.move('dawn', 0.25, { over: 9 });
      s.move('fog', 0.6, { over: 6 });
      s.person('rosalind').do('perch_still', { loop: true });
      s.person('rosalind').turn(90);
      s.person('rosalind').look([HOLLOW + 4, D, 1]);
      await lead(s, 2.8);
      s.tell('hollow:fog'); // (the hollow full of fog below)
      s.move('petra_peek', 0.5, { over: 1.5 });
      await lead(s, HOLLOW);
      await s.wait(0.6);
      await framed; // (the beat ends with the camera standing)
    },
  },
  // (game) the search comes up onto the crest above the hollow; the front one raises his lantern toward the fog. The camera
  // stands: «Тише, кони» (its marks: great#head, pack#head, sheba#head, petra; the game moves great_toss, pack_toss,
  // sheba_toss, petra_peek, lamp, lamp_x, search_point)
  watch: {
    after: 'hollow',
    from: () => IN_HOLLOW,
    run: async s => {
      for (const k of ['searcher_here', 'searcher2_here', 'h1_here', 'h2_here']) s.set(k, true);
      s.set('h1_a', -20);
      s.set('h2_a', -23.4);
      s.tell('watch:riders'); // (two riders with lanterns come up onto the crest)
      await s.all(ride(s, 'horse1', 0.9, 'walk', 'out'), s.sequence(async q => { await q.wait(0.8); await ride(q, 'horse2', -1.7, 'walk', 'out'); }));
      s.person('searcher').look([7, D + 0.5, -0.3]);
      s.set('lamp_x', 7);
      await s.move('lamp', 0.6, { over: 1.6 });
    },
  },
  // (game) spotted: he points into the hollow, the other turns back for the rest; he rides down to its edge
  spotted: {
    after: 'watch',
    from: () => WATCHED,
    run: async s => {
      s.move('search_point', 1, { over: 0.5, ease: 'out' });
      s.move('lamp', 1, { over: 0.5 });
      await s.wait(0.8);
      await turnHorse(s, 'horse2', 270, 1.0);
      ride(s, 'horse2', -16, 'canter', 'in');
      await s.wait(0.4);
      s.move('search_point', 0, { over: 0.8 });
      await ride(s, 'horse1', 2.0);
    },
  },
  // (game) not spotted: the other rides back for the rest; the front one stays on the crest to keep the road, his lantern
  // lower
  stay: {
    after: 'watch',
    from: () => WATCHED,
    run: async s => {
      await s.wait(0.5);
      await turnHorse(s, 'horse2', 270, 1.2);
      const goes = ride(s, 'horse2', -16, 'trot', 'in');
      s.move('lamp', 0.35, { over: 2 });
      s.move('lamp_x', 5, { over: 4 });
      s.person('searcher').look([5, D + 0.5, -0.3]);
      await goes;
      s.set('h2_here', false);
      s.set('searcher2_here', false);
    },
  },
  // (game) Rosalind draws — in profile on the pale sky; the arrow takes him; he goes back off the saddle and lies on the
  // crest by his lantern; his horse bolts back over the ridge alone
  kill: {
    after: ['spotted', 'stay'],
    from: () => ({ ...WATCHED, h1_a: 2.0, h2_here: false, searcher2_here: false }),
    run: async s => {
      const ro = s.person('rosalind'), sr = s.person('searcher');
      s.set('arrow', 0);
      s.set('arrow_high', false);
      await ro.turn(270);
      ro.look('searcher');
      ro.with(['bow']);
      const draws = ro.do('draw_bow');
      await s.wait(1.3);
      await s.move('arrow', 1, { over: 0.45, ease: 'linear' });
      s.set('arrow', 0);
      sr.on(null);
      sr.with(null);
      s.move('lamp', 0, { over: 1.2 });
      s.tell('kill:shot'); // (he falls — forward, down the near side of the crest: seen lying there)
      const falls = sr.do('collapse');
      await s.wait(0.3);
      await turnHorse(s, 'horse1', 270, 0.6);
      ride(s, 'horse1', -16, 'canter', 'in');
      await draws;
      await falls;
      sr.do('lie_back', { loop: true });
      s.move('petra_peek', 0, { over: 1 });
      await s.wait(1.0);
    },
  },
  // (game) over his head: his horse shies up, he wheels it round and gallops back over the crest
  warn: {
    after: ['spotted', 'stay'],
    from: () => ({ ...WATCHED, h1_a: 2.0, h2_here: false, searcher2_here: false }),
    run: async s => {
      const ro = s.person('rosalind');
      s.set('arrow', 0);
      s.set('arrow_high', true);
      await ro.turn(270);
      ro.look('searcher');
      ro.with(['bow']);
      const draws = ro.do('draw_bow');
      await s.wait(1.3);
      await s.move('arrow', 1, { over: 0.6, ease: 'linear' });
      s.set('arrow', 0);
      s.tell('warn:shot'); // (the arrow over his head)
      s.move('h1_toss', 1, { over: 0.4, ease: 'out' });
      await s.wait(0.6);
      s.move('h1_toss', 0, { over: 0.8 });
      s.move('lamp', 0, { over: 0.8 });
      await turnHorse(s, 'horse1', 270, 0.7);
      await draws;
      await ride(s, 'horse1', -16, 'gallop', 'in');
    },
  },
  // (game) still in the fog: the fog thickens, Rosalind lowers her bow, Petra ducks; he rides along the edge of the hollow
  // with his lantern low, stops right above them — turns and rides away
  hide: {
    after: ['spotted', 'stay'],
    from: () => ({ ...WATCHED, h1_a: 2.0, h2_here: false, searcher2_here: false }),
    run: async s => {
      s.move('fog', 1, { over: 3 });
      s.move('petra_peek', 0, { over: 1 });
      s.move('lamp', 0.8, { over: 1.5 });
      await s.wait(0.5);
      s.move('lamp_x', 9.5, { over: 7, ease: 'inOut' });
      await ride(s, 'horse1', 3.0);
      await s.wait(3.0);
      s.move('lamp_x', 6, { over: 3, ease: 'inOut' });
      await s.wait(3.0);
      await turnHorse(s, 'horse1', 270, 1.2);
      s.move('lamp', 0, { over: 2 });
      await ride(s, 'horse1', -16);
    },
  },
  // (game) on, down out of the hollow toward the trees; it grows light
  away: {
    after: ['kill', 'warn', 'hide'],
    from: () => ({ ...IN_HOLLOW, h1_here: false, h2_here: false, searcher_here: false, searcher2_here: false, lamp: 0 }),
    run: async s => {
      s.person('rosalind').turn(90);
      s.person('rosalind').look([AWAY, D, 1]);
      s.move('dawn', 0.5, { over: 14 });
      s.move('fog', 0.8, { over: 6 });
      cam(s, CAM.away, 9);
      s.move('petra_peek', 0.3, { over: 1 });
      await lead(s, AWAY, 'trot');
    },
  },
};
const SHOWCASE = ['arrive', 'handover', 'sheba_turn', 'sheba_go', 'climb', 'bow', 'go', 'search'];

return { cr, track, ground, D, HORSES, RIDERS, BEFORE, PACK_BEHIND, SHEBA_D, spot, FILM, SHOWCASE, clamp };
