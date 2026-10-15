// Корабль из Зеландии (engine 3): what its elements and its scripts share — the ledge before the cave (the land), the
// people of the clearing and who of them the web takes when (each at its own mark: TH), the cocoons, and the film: the beats
// a game plays one at a time by `beat` (script.js, the world's module beats) and the showcase plays in order (showcase.js).
// The people are the cast's: david (david_teen), rosalind, petra, michael on the ledge; joseph, w1–w3 (Waknuk, guns),
// spider, sophie, f2, f3 (the Fringes, bows) on the clearing; sealand (the woman from Sealand). Joseph's horse — the module's.
const { clamp, mix } = anim;
// the land: the ledge before the cave a metre over the clearing (across < −1.6, 7.4…10.3 m), the way down it on the right
function ground(across, distance) {
  if (distance < 7.3 || distance > 11.2) return 0;
  const inD = clamp((distance - 7.3) / 0.15, 0, 1) * clamp((11.2 - distance) / 0.9, 0, 1);
  if (across < -1.6) return 1.0 * (distance <= 10.3 ? inD : 0);
  if (across < -0.3) return 1.0 * ((-0.3 - across) / 1.3) * inD;
  return 0;
}
// where everyone begins: the children behind the stone at the cave, the fight on the clearing (across, distance, turn)
const PEOPLE = {
  david: [-2.3, 8.25, 90], petra: [-3.15, 8.45, 90], rosalind: [-3.9, 8.65, 90], michael: [-4.9, 8.95, 90],
  joseph: [-0.6, 14.2, 90], w1: [1.3, 16.4, 90], w2: [2.6, 19.6, 90], w3: [-3.6, 18.6, 90],
  spider: [8.8, 19.6, 270], sophie: [12.6, 24.2, 270], f2: [9.4, 16, 270], f3: [14.8, 25.5, 270], sealand: [3, 20.3, 0],
};
// who the web takes, and at what of it (each fights it and goes still at its own mark); −1 — not on the clearing
const TH = { w1: 0.15, w3: 0.25, w2: 0.35, f2: 0.45, f3: 0.55, sophie: 0.62, spider: 0, joseph: 0, david: -1 };
const WEBBED = Object.keys(TH);
// a cocoon over someone: as much of it as the web has over them (none below their mark; gone once their mark is raised
// past 1.5 — the woman's spray)
const cocoonOf = (web, th) => (th < 0 || th > 1.5 ? 0 : clamp((web - th) / 0.15, 0, 1));
function cocoon(g, e) {
  const veil = (name, w, h, y) => e.layer(name, { box: [-w - 0.2, y - h - 0.2, w + 0.2, 0.2] }, q => {
    q.lineCap = 'round';
    q.fillStyle = 'rgba(236,230,240,0.35)';
    q.beginPath();
    q.ellipse(0, y - h / 2, w, h / 2, 0, 0, 7);
    q.fill();
    for (let i = 0; i < 70; i++) {
      const a = e.rnd() * 6.28, b = a + 1 + e.rnd() * 2;
      q.strokeStyle = `rgba(246,240,246,${(0.35 + 0.4 * e.rnd()).toFixed(2)})`;
      q.lineWidth = 0.012 + e.rnd() * 0.012;
      q.beginPath();
      q.moveTo(Math.cos(a) * w, y - h / 2 + Math.sin(a) * h / 2);
      q.quadraticCurveTo(0, y - h / 2, Math.cos(b) * w, y - h / 2 + Math.sin(b) * h / 2);
      q.stroke();
    }
  });
  veil('stand', 0.5, 1.95, 0.05);
  veil('lie', 1.05, 0.55, 0.05);
}
function cocoonMove(e, id) {
  const s = e.state, k = cocoonOf(s.web ?? 0, s[`${id}_th`] ?? TH[id]), down = !!s[`${id}_down`];
  e.layer('stand').alpha = down ? 0 : k;
  e.layer('lie').alpha = down ? k : 0;
}
const HORSE = { kind: 'horse', across: 'horse_a', distance: 'horse_d', face: 'horse_face', toss: 'horse_toss' };

// ── the camera's places (camera_x, camera_z, camera_h, camera_look) ──
const CAM = {
  children: [-3.3, 3.6, 0.35, 0], clearing: [2.2, 7.5, 0.15, 0], wide: [0, 0, 0, 0], below: [-0.6, 4.6, 0.1, 0], ledge_wide: [-2.5, 5.0, 0.35, 0],
  over_them: [-2.5, 2.6, 1.4, 0.17], on_ledge: [-2.5, 3.2, 1.4, 0], by_father: [-0.4, 5.2, 0.05, 0], web_near: [0, 2.0, 0, 0],
  land: [0, 0.6, 0, 0], door: [2.6, 8.5, 0.15, 0], free: [-2.0, 3.0, 0.3, 0], back: [0.4, 1.4, 0, 0], at_father: [0.5, 7.4, 0, 0.04],
  wide2: [0.6, 1.0, 0, 0], ramp: [2.8, 9.6, 0.1, 0], michael: [-2.2, 4.6, 0.4, 0], stay: [-0.6, 1.2, 0.05, 0], stay_far: [-1.8, 3.0, 0.3, -0.06],
};
const camOf = c => ({ camera_x: c[0], camera_z: c[1], camera_h: c[2], camera_look: c[3] });
const cam = (s, c, over) => s.all(...['camera_x', 'camera_z', 'camera_h', 'camera_look'].map((k, i) => s.move(k, c[i], { over, ease: 'inOut' })));
// a beat's cuts said ahead (scene-format: a shot made ready while the one before plays is shown whole at once):
// ahead(s, [CAM.…]) → next() — cuts to the next of them, and makes the one after it ready
function ahead(s, list) {
  let i = 0, ready = s.shot(camOf(list[0]));
  return () => { const now = ready; i++; now.cut(); ready = i < list.length ? s.shot(camOf(list[i])) : null; };
}
const loop = motion => ({ motion, loop: true });
const aside = (s, fn) => s.sequence(fn);
const P = (s, id) => s.person(id);
async function walk(s, id, pts, turn, gait) {
  s.set(`${id}_steps`, true);
  if (gait !== undefined) P(s, id).gait(gait);
  await P(s, id).walk(pts);
  if (gait !== undefined) P(s, id).gait(null);
  if (turn != null) await P(s, id).turn(turn);
}
const toward = ([a, d], [a2, d2]) => (((Math.atan2(a2 - a, d2 - d) * 180) / Math.PI) + 360) % 360;
// a shot: the gun's flash and its puff of smoke at the muzzle (`<id>_fire`: one burst each time it goes up)
const shoot = (s, id) => s.set(`${id}_fire`, (s.state[`${id}_fire`] || 0) + 1);
// the ship along its way (its place) over `over` seconds
const fly = (s, to, over, ease = 'inOut') => s.path(['ship_a', 'ship_d', 'ship_h'], [[s.state.ship_a, s.state.ship_d, s.state.ship_h], to], { over, ease });
const lieDown = async (s, ids, gap = 0.25) => { for (const id of ids) { P(s, id).do('lie_back', { loop: true }); P(s, id).look(null); await s.wait(gap); } };
const SHIP_AT = [3, 21, 0], DOOR = [2.6, 19.8], RAMP_FOOT = [2.8, 18.7];

// ── the state the beats begin at ──
const person = (id, [a, d, turn], more = {}) => ({ [`${id}_a`]: a, [`${id}_d`]: d, [`${id}_turn`]: turn, [`${id}_do`]: 'stand', [`${id}_look`]: null,
  [`${id}_reach`]: null, [`${id}_still`]: false, [`${id}_steps`]: true, [`${id}_here`]: true, [`${id}_down`]: false,
  ...Object.fromEntries(Object.entries(more).map(([k, v]) => [`${id}_${k}`, v])) });
const START = {
  fade: 0, fade_color: '#000000', dawn: 0.38, smoke: 0.8, fight: 1, fall: 0, web: 0, cave_web: 0, spin: 0, door: 0, dust: 0,
  ship_a: 150, ship_d: 330, ship_h: 95, ship_vis: 0, arrow_vis: false, arrow_a: 6.3, arrow_d: 17.5, arrow_h: 1.6,
  horse_a: -2.9, horse_d: 15.6, horse_face: 90, horse_toss: 0, ...camOf(CAM.children),
  ...person('david', PEOPLE.david, { do: loop('kneel'), th: -1 }), ...person('petra', PEOPLE.petra, { do: loop('crouch') }),
  ...person('rosalind', PEOPLE.rosalind, { do: loop('kneel') }), ...person('michael', PEOPLE.michael, { do: loop('crouch') }),
  ...person('joseph', PEOPLE.joseph, { reach: { r: [3, 18, 2.2] }, th: 0, wear: { hat: 'hat' } }),
  ...person('w1', PEOPLE.w1, { do: loop('kneel_aim'), with: ['gun'], th: TH.w1, fire: 0 }), ...person('w2', PEOPLE.w2, { do: loop('aim_rifle'), with: ['gun'], th: TH.w2, fire: 0 }),
  ...person('w3', PEOPLE.w3, { do: loop('aim_rifle'), with: ['gun'], th: TH.w3, fire: 0 }),
  ...person('spider', PEOPLE.spider, { th: 0, with: ['bow'] }), ...person('sophie', PEOPLE.sophie, { th: TH.sophie }),
  ...person('f2', PEOPLE.f2, { with: ['bow'], th: TH.f2 }), ...person('f3', PEOPLE.f3, { with: ['bow'], th: TH.f3 }),
  ...person('sealand', PEOPLE.sealand, { here: false, with: ['sprayer'] }),
};
// David up off the stone, staring at his father, dead on the clearing (fight's end)
const STARED = { ...START, ...camOf(CAM.children), joseph_do: loop('lie_back'), joseph_down: true, joseph_reach: null, horse_a: -16, horse_d: 16.2, horse_face: 270,
  david_look: 'joseph', rosalind_look: 'david', petra_look: 'david', petra_do: loop('crouch') };
// held back on the ledge — or down by his father on the clearing (hold's / run's end): the Spider down, Sophie by him
const HELD = { ...STARED, ...camOf(CAM.wide), spider_do: loop('lie_back'), spider_down: true, sophie_a: 7.7, sophie_d: 18.2, sophie_do: loop('kneel_one_still'),
  sophie_look: 'spider', fight: 0.5, david_a: -2.2, david_d: 8.25, david_do: loop('kneel'), rosalind_a: -2.55, rosalind_d: 8.4, rosalind_reach: { r: 'david#shoulder_l' } };
const RAN = { ...HELD, david_a: -0.15, david_d: 13.35, david_do: loop('kneel_one_still'), david_turn: toward([-0.15, 13.35], [-0.6, 14.2]),
  david_reach: { r: 'joseph#back', l: 'joseph#shoulder_r' }, david_th: 0.3, rosalind_a: -2.6, rosalind_d: 8.5, rosalind_reach: { r: 'petra#back' }, rosalind_look: 'petra' };
// the craft over the clearing, the first threads falling, everyone looking up (ship's end)
const OVER = (from) => ({ ...from, ship_vis: 1, ship_a: 4.6, ship_d: 21, ship_h: 8.5, spin: 1, fight: 0, fall: 0.4,
  ...Object.fromEntries(['w1', 'w2', 'w3', 'f2', 'f3', 'rosalind', 'michael', 'david'].map(id => [`${id}_look`, [4.6, 21, 9]])) });
// under the web, the craft landed, the door open (landing's end): the woman walking toward the ledge
const LANDED = (from) => ({ ...from, ship_h: 0, spin: 0.12, fall: 0, web: 1, cave_web: 1, door: 1, dust: 0, sealand_here: true, sealand_a: 1.5, sealand_d: 15.9 });
// (cut) she is already by the cave, the camera on the ledge
const FREE = (from) => ({ ...LANDED(from), ...camOf(CAM.free), sealand_a: -0.45, sealand_d: 10.4, sealand_turn: 330 });

const FILM = {
  // cave — close on the children behind the stone. A shot: Petra hides in Rosalind's arms
  cave: {
    from: () => START,
    run: async s => {
      await s.wait(0.8);
      P(s, 'david').look([0, 14, 1]);
      await s.wait(0.6);
      shoot(s, 'w1');
      await s.wait(0.35);
      P(s, 'petra').turn(260);
      P(s, 'petra').do('kneel', { loop: true });
      P(s, 'rosalind').look('petra');
      P(s, 'rosalind').reach({ r: 'petra#back' });
      await s.wait(1.0);
      P(s, 'michael').look([6, 20, 1]);
      await s.wait(0.9);
      shoot(s, 'w2');
      await s.wait(0.7);
      P(s, 'rosalind').look([8, 20, 1]);
      await s.wait(0.4);
    },
  },
  // fight — the whole clearing; Joseph commands; the tall one (the Spider) comes out from the huts and draws on him — one
  // shot each: he falls; his horse bolts. (cut) The children: David comes up off the stone, his eyes on his father. (Here
  // the game asks «бежать к отцу», on david)
  fight: {
    after: 'cave',
    from: () => ({ ...START, petra_do: loop('kneel'), petra_turn: 260, rosalind_reach: { r: 'petra#back' } }),
    run: async s => {
      const jo = P(s, 'joseph'), sp = P(s, 'spider');
      const next = ahead(s, [CAM.clearing, CAM.children]);
      cam(s, CAM.wide, 4.8);
      await s.wait(1.0);
      shoot(s, 'w3');
      jo.reach({ r: [2, 18, 2.6] });
      await s.wait(0.8);
      shoot(s, 'w1');
      jo.reach({ r: [3, 18, 2.2] });
      await s.wait(1.0);
      next();
      s.tell('fight:clearing'); // (the clearing: Joseph ahead, by his horse)
      const comes = walk(s, 'spider', [[6.8, 17.6]], toward([6.8, 17.6], [-0.6, 14.2]));
      shoot(s, 'w2');
      await comes;
      // (the Spider's shot: the arrow across; Joseph falls — staggers, down, forward onto his face)
      await sp.do('draw_bow');
      s.set('arrow_vis', true);
      await s.path(['arrow_a', 'arrow_d', 'arrow_h'], [[6.3, 17.5, 1.6], [-0.45, 14.25, 1.45]], { over: 0.65, ease: 'linear' });
      s.set('arrow_vis', false);
      jo.reach(null);
      const falls = jo.do('collapse');
      s.move('horse_toss', 1, { over: 0.4, ease: 'out' });
      await s.wait(0.9);
      s.move('horse_toss', 0, { over: 0.5 });
      s.move('horse_face', 270, { over: 0.4 });
      s.path(['horse_a', 'horse_d'], [[-2.9, 15.6], [-16, 16.2]], { over: 2.8, ease: 'in' });
      await falls;
      jo.do('lie_back', { loop: true });
      s.set('joseph_down', true);
      // (cut: the children. David up off the stone, his eyes on his father; Rosalind's on him)
      next();
      P(s, 'david').look('joseph');
      await s.wait(0.6);
      P(s, 'david').do('stand');
      P(s, 'david').still(true);
      await s.wait(0.6);
      P(s, 'rosalind').look('david');
      P(s, 'rosalind').reach(null);
      await s.wait(0.3);
      P(s, 'petra').do('crouch', { loop: true });
      P(s, 'petra').look('david');
      await s.wait(0.6);
      P(s, 'david').still(false);
    },
  },
  // hold — David jumps up toward his father; Rosalind catches his shoulder and pulls him down. The clearing: Waknuk answers,
  // the Spider falls back; a woman (Sophie) runs to him
  hold: {
    after: 'fight',
    from: () => STARED,
    run: async s => {
      const d = P(s, 'david'), r = P(s, 'rosalind'), next = ahead(s, [CAM.clearing, CAM.wide]);
      const goes = walk(s, 'david', [[-1.85, 8.15]]);
      await s.wait(0.2);
      await walk(s, 'rosalind', [[-2.55, 8.4]]);
      r.reach({ l: 'david#shoulder_l', r: 'david#hand_r' });
      await goes;
      d.go('kneel_down', { to: [-2.2, 8.25], turn: 90 });
      r.go('kneel_down', { to: [-2.55, 8.4], turn: 90 });
      await s.wait(1.0);
      d.do('kneel', { loop: true });
      r.do('kneel', { loop: true });
      r.reach({ r: 'david#shoulder_l' });
      P(s, 'petra').turn(70);
      await returnFire(s, next);
    },
  },
  // run — David tears out of Rosalind's hand and runs down to his father, across the open clearing; drops by him, his hands
  // on his back; Rosalind is left on the edge reaching after him, then goes back to Petra
  run: {
    after: 'fight',
    from: () => STARED,
    run: async s => {
      const d = P(s, 'david'), r = P(s, 'rosalind'), next = ahead(s, [CAM.below, CAM.clearing, CAM.wide]);
      s.set('david_th', 0.3);
      const runs = walk(s, 'david', [[-1.5, 8.4], [-1.05, 9.0], [-0.5, 10.8], [-0.15, 13.35]], null, 'run');
      await s.wait(0.2);
      await walk(s, 'rosalind', [[-2.0, 8.35]]);
      r.reach({ r: [-1.4, 8.6, 1.8] });
      r.look('david');
      P(s, 'petra').turn(70);
      await s.wait(0.6);
      next();
      shoot(s, 'w3');
      await runs;
      await d.go('kneel_one', { to: [-0.15, 13.35], turn: toward([-0.15, 13.35], [-0.6, 14.2]) });
      d.do('kneel_one_still', { loop: true });
      d.reach({ r: 'joseph#back', l: 'joseph#shoulder_r' });
      d.look('joseph');
      s.tell('run:by'); // (David down by his father)
      // (meanwhile, out of sight, Rosalind goes back to Petra)
      aside(s, async q => { r.reach(null); await walk(q, 'rosalind', [[-2.6, 8.5]], 90); r.do('kneel', { loop: true }); r.reach({ r: 'petra#back' }); r.look('petra'); });
      await returnFire(s, next);
    },
  },
  // ship — a glint over the forest grows into a fish with a spiral; the fight stops, all look up, each in their time. Petra
  // knows them: up, her arms to the craft — Rosalind pulls her down; two run. The first threads. (Here the game asks
  // «кого заслонить», on rosalind, petra — or joseph, if David is by him)
  ship: {
    after: ['hold', 'run'],
    from: () => HELD,
    run: async s => {
      s.set('ship_vis', 1);
      s.move('spin', 1, { over: 3 });
      fly(s, [4.6, 21, 8.5], 10, 'out');
      await s.wait(1.0);
      s.move('fight', 0, { over: 1 });
      for (const [id, t] of [['w2', 0.2], ['w3', 0.3], ['f3', 0.2], ['w1', 0.2], ['f2', 0.2], ['sophie', 0.4], ['rosalind', 0.2], ['michael', 0.3], ['david', 0.3]]) {
        await s.wait(t);
        P(s, id).look([4.6, 21, 9]);
      }
      s.move('camera_look', -0.1, { over: 3.0, ease: 'inOut' });
      await s.wait(1.4);
      cam(s, CAM.ledge_wide, 2.6);
      await s.wait(1.8);
      // (Petra: up, her arms to the craft; Rosalind pulls her down)
      s.tell('ship:petra'); // (Petra up, her arms to the craft)
      const pt = P(s, 'petra');
      pt.do('stand');
      pt.reach({ r: [4.6, 21, 9], l: [4.6, 21, 9] });
      pt.look([4.6, 21, 9]);
      await walk(s, 'petra', [[-1.65, 7.95]]);
      P(s, 'rosalind').reach({ r: 'petra#chest' });
      P(s, 'rosalind').look('petra');
      await s.wait(0.7);
      pt.reach(null);
      pt.do('crouch', { loop: true });
      await walk(s, 'petra', [[-2.55, 8.1]]);
      P(s, 'rosalind').reach({ r: 'petra#shoulder_l' });
      aside(s, q => walk(q, 'w3', [[-7.5, 18.2]], null, 'run'));
      aside(s, async q => { await q.wait(0.5); await walk(q, 'f2', [[13.5, 18.6]], null, 'run'); });
      await cam(s, CAM.wide, 2.8);
      s.move('camera_look', -0.04, { over: 3 });
      await s.move('fall', 0.4, { over: 2.5 });
    },
  },
  // web — the threads pour down; on the clearing each one fights them and goes still, a silver cocoon (each at its own mark:
  // script.js); the children on the ledge lie down under them. Branches: whom David covers (from above the stone — who is
  // under whom)
  web: { after: 'ship', from: () => OVER(HELD), run: s => web(s, async () => lieDown(s, ['rosalind', 'petra', 'david', 'michael'])) },
  // over Petra: David takes her from Rosalind, she lies down, he bends over her; Rosalind lies alone, a little away
  web_petra: {
    after: 'ship', from: () => OVER(HELD), run: s => web(s, async () => {
      P(s, 'rosalind').reach(null);
      aside(s, async q => { await walk(q, 'rosalind', [[-3.45, 8.7]]); await lieDown(q, ['rosalind']); });
      P(s, 'petra').do('lie_back', { loop: true });
      P(s, 'petra').look(null);
      await P(s, 'david').turn(250);
      P(s, 'david').do('kneel', { loop: true });
      P(s, 'david').look('petra');
      P(s, 'david').reach({ r: 'petra#back', l: 'petra#head' });
      await lieDown(s, ['michael']);
    }, CAM.on_ledge, CAM.over_them),
  },
  // over Rosalind: she holds Petra down; David bends over both of them
  web_rosalind: {
    after: 'ship', from: () => OVER(HELD), run: s => web(s, async () => {
      await lieDown(s, ['petra', 'michael']);
      P(s, 'rosalind').reach(null);
      P(s, 'rosalind').do('lie_back', { loop: true });
      await P(s, 'david').turn(230);
      P(s, 'david').do('kneel', { loop: true });
      P(s, 'david').look('rosalind');
      P(s, 'david').reach({ r: 'rosalind#back', l: 'rosalind#shoulder_r' });
    }, CAM.on_ledge, CAM.over_them),
  },
  // (David by his father) over his father: the threads take David, not him
  web_father: {
    after: 'ship', from: () => OVER(RAN), run: s => web(s, async () => {
      s.set('joseph_th', 0.97);
      P(s, 'david').look('joseph');
      P(s, 'david').reach({ r: 'joseph#back', l: 'joseph#head' });
      await lieDown(s, ['rosalind', 'petra', 'michael']);
    }, CAM.by_father),
  },
  // (David by his father) he throws himself down beside him; the threads take them both
  web_alone: {
    after: 'ship', from: () => OVER(RAN), run: s => web(s, async () => {
      P(s, 'david').reach(null);
      P(s, 'david').do('lie_back', { loop: true });
      s.set('david_down', true);
      await lieDown(s, ['rosalind', 'petra', 'michael']);
    }, CAM.by_father),
  },
  // landing — silence; it comes down, dust, the rotor slows. (cut: closer, the door) Warm light, the ramp. The woman in white
  // comes out, looks toward the cave, starts her sprayer and points toward the ledge
  // free — (cut) she is already by the cave: up onto the ledge, she sprays — the web melts; Petra runs to her, the woman on
  // one knee holds her; the others get up (in free_run David is not among them: Rosalind looks down at the clearing). A cut
  // always (after none): each stands right after its landing in the table, so the module beats says its opening ahead
  landing: { after: ['web', 'web_petra', 'web_rosalind'], from: () => ({ ...OVER(HELD), fall: 0, web: 1, cave_web: 1 }), run: s => landing(s, 'landing') },
  free: { after: [], from: () => FREE(OVER(HELD)), run: s => free(s, true) },
  landing_run: { after: ['web_father', 'web_alone'], from: () => ({ ...OVER(RAN), fall: 0, web: 1, cave_web: 1 }), run: s => landing(s, 'landing_run') },
  free_run: { after: [], from: () => FREE(OVER(RAN)), run: s => free(s, false) },
  // back — down across the clearing, the woman leading Petra by the hand, not looking back; David looks back. (cut, close)
  // David by his father's cocoon, on one knee, touching it; Rosalind comes back, her hand on his shoulder; he gets up, she
  // takes his hand. (cut: wide) To the ramp. (cut) Petra waves to Michael on the ledge; (cut) he answers; (cut) wide. (Here
  // the game asks «улететь или остаться», on ship and michael)
  back: {
    after: 'free',
    from: () => ({ ...LANDED(OVER(HELD)), cave_web: 0, sealand_a: -1.42, sealand_d: 8.5, petra_a: -1.92, petra_d: 8.3, david_a: -2.8, david_d: 8.75,
      david_do: 'stand', rosalind_do: 'stand', petra_do: 'stand', michael_do: 'stand', rosalind_reach: null, ...camOf(CAM.free) }),
    run: async s => {
      const next = ahead(s, AFTER);
      cam(s, CAM.back, 7);
      const led = lead(s);
      aside(s, async q => { await q.wait(0.6); await walk(q, 'michael', [[-2.2, 8.15]]); P(q, 'michael').look('sealand'); });
      const r1 = aside(s, async q => { await q.wait(0.8); await walk(q, 'rosalind', [[-1.3, 9.2], [-0.4, 10.8], [1.25, 13.6]]); });
      await s.wait(1.0);
      P(s, 'david').look([-0.6, 14.2, 0.3]);
      await walk(s, 'david', [[-1.6, 9.1], [-0.6, 11.0], [0.25, 13.0]]);
      s.tell('back:father'); // (David by his father's cocoon)
      await father(s, r1, next);
      await ramp(s, led, next);
    },
  },
  // back_run — on the way the woman stops by David's cocoon and sprays it: it melts, he goes down on his knees by his
  // father, his hand on him; Rosalind, her hand on his shoulder; then as back
  back_run: {
    after: 'free_run',
    from: () => ({ ...LANDED(OVER(RAN)), cave_web: 0, sealand_a: -1.42, sealand_d: 8.5, petra_a: -1.92, petra_d: 8.3, rosalind_do: 'stand', petra_do: 'stand',
      michael_do: 'stand', rosalind_reach: null, ...camOf(CAM.free) }),
    run: async s => {
      const sl = P(s, 'sealand'), pt = P(s, 'petra'), next = ahead(s, AFTER);
      cam(s, CAM.back, 7);
      pt.reach({ r: 'sealand#hand_l' });
      const pts = aside(s, q => walk(q, 'petra', [[-1.5, 8.75], [-0.65, 10.25], [0.4, 12.1]]));
      aside(s, async q => { await q.wait(0.8); await walk(q, 'michael', [[-2.2, 8.15]]); });
      const r1 = aside(s, async q => { await q.wait(1.4); P(q, 'rosalind').look('david'); await walk(q, 'rosalind', [[-1.3, 9.2], [-0.4, 10.8], [0.6, 13.9]]); });
      await walk(s, 'sealand', [[-1.05, 9.1], [-0.2, 10.6], [0.75, 12.6]], toward([0.75, 12.6], [-0.15, 13.35]));
      await pts;
      next();
      sl.look('david');
      sl.reach({ r: 'david#chest' });
      await s.wait(0.4);
      s.move('david_th', 2, { over: 2.5 });
      s.tell('back_run:free'); // (she frees him by his father)
      await s.wait(1.6);
      sl.reach(null);
      sl.look(null);
      P(s, 'david').still(false);
      P(s, 'david').look('joseph');
      P(s, 'david').do('kneel_one_still', { loop: true });
      await s.wait(0.6);
      P(s, 'david').reach({ r: 'joseph#back' });
      const led = aside(s, async q => { await walk(q, 'sealand', [RAMP_FOOT]); await walk(q, 'petra', [[RAMP_FOOT[0] - 0.45, RAMP_FOOT[1] - 0.35]]); });
      await r1;
      P(s, 'rosalind').reach({ r: 'david#shoulder_r' });
      await s.wait(1.2);
      await ramp(s, led, next);
    },
  },
  // board — (cut: the ramp) they go into the light, one by one; David looks back once at the clearing. (cut: wide) The craft
  // goes; Michael on the rock watches it go, looks once at the clearing of cocoons — and walks away along the rock; the still
  // clearing
  // (a cut, always: its opening said ahead by the module beats — the game names it in beat_next once it is chosen)
  board: {
    after: [],
    from: () => ({ ...ATRAMP, ...camOf(CAM.ramp) }),
    run: async s => {
      const next = ahead(s, [CAM.wide, CAM.michael]);
      P(s, 'michael').do('stand');
      await goIn(s, 'sealand');
      aside(s, q => goIn(q, 'petra'));
      await s.wait(0.6);
      await goIn(s, 'rosalind');
      P(s, 'david').look([-6, 12, 1]);
      s.tell('board:look'); // (on the threshold he looks back, once)
      await s.wait(1.5);
      P(s, 'david').look(null);
      await goIn(s, 'david');
      next();
      await away(s);
      const m = P(s, 'michael');
      await m.turn(150);
      m.look(null);
      next();
      s.tell('board:michael'); // (Michael on the rock)
      await s.wait(1.5);
      await walk(s, 'michael', [[-3.4, 8.7], [-9.5, 9.0]]);
      await cam(s, CAM.wide, 5);
    },
  },
  // stay — David lets go of Rosalind's hand and goes back up to Michael on the ledge, with Rosalind (stay_ros) or alone,
  // Rosalind going in after Petra and looking back from the light (stay_alone, and the craft going: stay_alone_away). On
  // the ledge they watch it go, Michael's hand on David's shoulder
  stay_ros: {
    after: ['back', 'back_run'],
    from: () => ATRAMP,
    run: async s => {
      cam(s, CAM.stay, 6);
      const up = stayUp(s);
      P(s, 'rosalind').look('petra');
      aside(s, async q => { await goIn(q, 'sealand'); });
      aside(s, async q => { await q.wait(0.3); await goIn(q, 'petra'); });
      await s.wait(1.7);
      P(s, 'rosalind').look('david');
      await walk(s, 'rosalind', [[1.0, 14.6], [-0.3, 10.9], [-0.95, 9.1], [-1.25, 8.6]], 70);
      P(s, 'rosalind').look([4, 30, 12]);
      await up;
      cam(s, CAM.stay_far, 8);
      await away(s);
    },
  },
  stay_alone: {
    after: ['back', 'back_run'],
    from: () => ATRAMP,
    run: async s => {
      cam(s, CAM.stay, 6);
      const up = stayUp(s);
      P(s, 'rosalind').look('david');
      aside(s, async q => { await goIn(q, 'sealand'); });
      aside(s, async q => { await q.wait(0.3); await goIn(q, 'petra'); });
      await s.wait(2.6);
      await walk(s, 'rosalind', [[2.75, 19.85]]);
      s.tell('stay_alone:turn'); // (Rosalind turns back to him from the light)
      await P(s, 'rosalind').turn(220);
      P(s, 'rosalind').look('david');
      await s.wait(2.2);
      P(s, 'rosalind').here(false);
      await up;
    },
  },
  stay_alone_away: {
    after: 'stay_alone',
    from: () => ({ ...ATRAMP, ...STAYED, rosalind_here: false }),
    run: async s => {
      cam(s, CAM.stay_far, 8);
      await away(s);
    },
  },
  // noship — the craft never comes: the fight goes on; then Waknuk gives way and runs, leaving Joseph; the Fringes come out a
  // little, bows down; it grows light; the children get up; Petra looks for something in the empty sky
  noship: {
    after: ['hold', 'run'],
    from: () => HELD,
    run: async s => {
      s.move('fight', 1, { over: 1 });
      s.tell('noship:sky'); // (the fight goes on under an empty sky)
      for (const [id, t] of [['w2', 0.6], ['w1', 1.2], ['w3', 1.2], ['w2', 1.4]]) { await s.wait(t); shoot(s, id); }
      await s.wait(1.2);
      for (const [id, to] of [['w1', [-16, 16.6]], ['w3', [-16, 18.0]], ['w2', [-16, 19.4]]]) { P(s, id).do('stand'); aside(s, q => walk(q, id, [to], null, 'run')); await s.wait(0.5); }
      s.move('fight', 0, { over: 2 });
      s.tell('noship:flee'); // (Waknuk gives way and runs)
      s.move('dawn', 0.62, { over: 14 });
      s.move('smoke', 0.45, { over: 14 });
      await s.wait(1.5);
      aside(s, q => walk(q, 'f2', [[7.6, 16.4]]));
      aside(s, async q => { await q.wait(0.5); await walk(q, 'f3', [[12.4, 23.6]]); });
      await s.wait(1.0);
      cam(s, CAM.children, 5);
      await s.wait(1.5);
      for (const id of ['rosalind', 'michael', 'petra']) { P(s, id).do('stand'); P(s, id).reach(null); await s.wait(0.4); }
      P(s, 'david').look('joseph');
      await s.wait(0.6);
      P(s, 'petra').look([0, 40, 20]);
      P(s, 'rosalind').look('petra');
      await s.wait(2.0);
      P(s, 'michael').look('petra');
      await s.wait(1.0);
    },
  },
};
// the clearing: Waknuk answers; the Spider falls back; a woman (Sophie) runs out to him and kneels over him
//   (next — the beat's cuts said ahead: to the clearing, then wide)
async function returnFire(s, next) {
  next();
  shoot(s, 'w1');
  await s.wait(0.3);
  shoot(s, 'w2');
  await s.wait(0.3);
  P(s, 'spider').with(null);
  const falls = P(s, 'spider').do('fall_back');
  aside(s, async q => {
    await q.wait(0.4);
    await walk(q, 'sophie', [[7.7, 18.2]], null, 'run');
    await P(q, 'sophie').go('kneel_one', { to: [7.7, 18.2], turn: toward([7.7, 18.2], [6.8, 17.6]) });
    P(q, 'sophie').do('kneel_one_still', { loop: true });
    P(q, 'sophie').reach({ r: 'spider#chest' });
    P(q, 'sophie').look('spider');
  });
  await falls;
  P(s, 'spider').do('lie_back', { loop: true });
  s.set('spider_down', true);
  shoot(s, 'w3');
  s.move('fight', 0.5, { over: 1.5 });
  await s.wait(1.6);
  next();
  await s.wait(1.0);
}
// the web: the threads pour down; the field's web spreads; the ledge's children lie down under it (lie); the camera — near
// (slowly), after a cut first if there is one (close on whom David covers)
async function web(s, lie, near = CAM.web_near, first) {
  const close = first && ahead(s, [first]);
  s.move('fall', 1, { over: 2.5 });
  const lying = lie();
  await s.wait(1.0);
  s.move('web', 1, { over: 9, ease: 'linear' });
  close?.();
  await s.wait(0.7);
  cam(s, near, 10);
  await s.wait(2.5);
  s.move('cave_web', 1, { over: 5.5 });
  await lying;
  await s.wait(2.5);
  await s.move('fall', 0, { over: 2.5 });
}
// it comes down, dust, the rotor slows; (cut: the door) warm light, the ramp; she comes out, looks toward the cave, starts her
// sprayer and points toward the ledge
async function landing(s, beat) {
  const door = s.shot(camOf(CAM.door));
  cam(s, CAM.land, 4.5);
  const down = fly(s, SHIP_AT, 4.5);
  await s.wait(2.0);
  s.move('dust', 1, { over: 2 });
  await down;
  s.tell(`${beat}:down`); // (the craft down on the clearing)
  s.move('spin', 0.12, { over: 3 });
  s.move('dust', 0, { over: 4 });
  door.cut();
  await s.move('door', 1, { over: 2.2 });
  const sl = P(s, 'sealand');
  s.set('sealand_a', DOOR[0]);
  s.set('sealand_d', DOOR[1]);
  sl.here(true);
  await walk(s, 'sealand', [RAMP_FOOT]);
  sl.look([-6, 9, 1.2]);
  await s.wait(0.5);
  sl.reach({ r: [0, 15, 1.2] });
  await s.wait(0.6);
}
// (cut) she is already by the cave: up onto the ledge; she sprays — the web melts; Petra runs to her, she kneels and holds
// her; the others get up
async function free(s, withDavid) {
  const sl = P(s, 'sealand'), pt = P(s, 'petra');
  await walk(s, 'sealand', [[-1.05, 9.0], [-1.42, 8.5]], 270);
  sl.reach({ r: [-3, 8.5, 1.4] });
  sl.look([-3, 8.5, 1.0]);
  await s.move('cave_web', 0, { over: 3.2 });
  sl.reach(null);
  for (const id of withDavid ? ['petra', 'rosalind', 'michael', 'david'] : ['petra', 'rosalind', 'michael']) { P(s, id).do('get_up_ground'); await s.wait(0.35); }
  await s.wait(0.6);
  s.tell(`${withDavid ? 'free' : 'free_run'}:petra`); // (Petra runs to her)
  pt.look('sealand');
  await walk(s, 'petra', [[-1.92, 8.3]]);
  await sl.go('kneel_one', { to: [-1.42, 8.5], turn: 270 });
  sl.do('kneel_one_still', { loop: true });
  sl.reach({ r: 'petra#back', l: 'petra#shoulder_r' });
  sl.look('petra');
  pt.reach({ r: 'sealand#nape', l: 'sealand#nape' });
  P(s, 'rosalind').look(withDavid ? 'sealand' : 'joseph');
  await walk(s, 'rosalind', [[-3.35, 8.5]]);
  if (withDavid) { P(s, 'david').look('sealand'); await walk(s, 'david', [[-2.8, 8.75]]); }
  P(s, 'michael').look('sealand');
  await s.wait(1.0);
  sl.reach(null);
  pt.reach(null);
  await sl.do('kneel_one_rise');
}
// the woman leads Petra by the hand down across the clearing to the ramp, not looking back → when they are there
function lead(s) {
  const pt = P(s, 'petra');
  pt.reach({ r: 'sealand#hand_l' });
  pt.look(null);
  P(s, 'sealand').look(null);
  return s.all(walk(s, 'sealand', [[-1.05, 9.1], [-0.2, 10.6], RAMP_FOOT], 200), walk(s, 'petra', [[-1.5, 8.75], [-0.65, 10.25], [RAMP_FOOT[0] - 0.45, RAMP_FOOT[1] - 0.35]], 200));
}
// (cut, close) David by his father's cocoon: on one knee, touching it; Rosalind comes back for him (her walk: r1), her hand on
// his shoulder
async function father(s, r1, next) {
  const d = P(s, 'david');
  next();
  d.look('joseph');
  await d.go('kneel_one', { to: [0.25, 13.0], turn: toward([0.25, 13.0], [-0.6, 14.2]) });
  d.do('kneel_one_still', { loop: true });
  d.reach({ r: 'joseph#back' });
  await r1;
  await P(s, 'rosalind').turn(toward([1.25, 13.6], [0.25, 13.0]));
  await walk(s, 'rosalind', [[0.75, 13.35]]);
  P(s, 'rosalind').reach({ r: 'david#shoulder_r' });
  P(s, 'rosalind').look('david');
  await s.wait(1.2);
}
// he gets up, she takes his hand; (cut: wide) to the ramp, where the woman waits turned back to them; (cut) Petra waves to
// Michael on the ledge; (cut) he answers; (cut) wide
async function ramp(s, led, next) {
  const d = P(s, 'david'), r = P(s, 'rosalind');
  d.reach(null);
  await d.do('kneel_one_rise');
  d.look('rosalind');
  r.reach({ r: 'david#hand_l' });
  r.look(null);
  next();
  const goes = s.all(walk(s, 'rosalind', [[2.25, 18.05]]), walk(s, 'david', [[1.8, 17.8]]));
  await led;
  await P(s, 'sealand').turn(200);
  P(s, 'sealand').look('david');
  await goes;
  next();
  P(s, 'petra').reach(null);
  await P(s, 'petra').turn(290);
  P(s, 'petra').look('michael');
  P(s, 'petra').reach({ l: [RAMP_FOOT[0] - 1, RAMP_FOOT[1] - 1, 2.2] });
  await s.wait(0.9);
  next();
  P(s, 'michael').reach({ r: [-2.2, 9, 3.2] });
  P(s, 'michael').look('petra');
  await s.wait(1.3);
  next();
  d.look('michael');
  r.look('david');
  P(s, 'michael').reach(null);
  P(s, 'petra').reach(null);
  await s.wait(0.5);
}
// at the ramp, ready to go in (back's / back_run's end)
// the cuts of back and back_run, in order (by the father, then wide to the ramp, the ramp, Michael, wide)
const AFTER = [CAM.at_father, CAM.wide2, CAM.ramp, CAM.michael, CAM.wide2];
const ATRAMP = { ...LANDED(OVER(HELD)), cave_web: 0, ...camOf(CAM.wide2), sealand_a: RAMP_FOOT[0], sealand_d: RAMP_FOOT[1], sealand_turn: 200, sealand_look: 'david',
  petra_a: RAMP_FOOT[0] - 0.45, petra_d: RAMP_FOOT[1] - 0.35, petra_do: 'stand', petra_turn: 290, rosalind_a: 2.25, rosalind_d: 18.05, rosalind_do: 'stand',
  rosalind_look: 'david', rosalind_reach: { r: 'david#hand_l' }, david_a: 1.8, david_d: 17.8, david_do: 'stand', david_look: 'michael', david_th: -1, david_down: false,
  david_still: false, michael_a: -2.2, michael_d: 8.15, michael_do: 'stand', michael_look: 'petra' };
// David and Michael on the ledge, watching (stay's end)
const STAYED = { david_a: -1.65, david_d: 8.3, david_turn: 70, david_look: [4, 30, 12], michael_reach: { l: 'david#shoulder_r' }, michael_turn: 70,
  sealand_here: false, petra_here: false };
// into the light of the door, up the ramp, gone
async function goIn(s, id) {
  P(s, id).reach(null);
  await walk(s, id, [DOOR]);
  P(s, id).here(false);
}
// David lets go of Rosalind's hand and goes back up to the ledge, to Michael; Michael's hand on his shoulder
async function stayUp(s) {
  P(s, 'rosalind').reach(null);
  P(s, 'david').look('michael');
  P(s, 'petra').look('david');
  await walk(s, 'david', [[0.6, 14.2], [-0.4, 10.8], [-1.05, 9.0], [-1.65, 8.3]], 70);
  P(s, 'david').look([4, 30, 12]);
  await P(s, 'michael').turn(70);
  P(s, 'michael').reach({ l: 'david#shoulder_r' });
  P(s, 'michael').look([4, 30, 12]);
}
// the craft goes: the door shuts, the spiral turns, dust, it lifts, it goes off far, a glint
async function away(s) {
  await s.move('door', 0, { over: 1.8 });
  s.move('spin', 1, { over: 2.5 });
  s.move('dust', 1, { over: 2 });
  await fly(s, [3, 21, 9], 4.5);
  s.move('dust', 0, { over: 4 });
  s.move('camera_look', -0.08, { over: 4, ease: 'inOut' });
  await fly(s, [260, 520, 170], 11, 'in');
  await s.move('ship_vis', 0, { over: 2 });
}
const SHOWCASE = ['cave', 'fight', 'hold', 'ship', 'web', 'landing', 'free', 'back', 'board'];

return { ground, PEOPLE, TH, WEBBED, cocoon, cocoonMove, HORSE, FILM, SHOWCASE, clamp };
