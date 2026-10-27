// Roderick's room: what its elements, its script and its beats share — the room's light as the state has it (for the
// lights' keys the script keeps and the candles' animate), the guitar's pulse, the close-up, the film in beats (FILM).
const { clamp, span } = anim;
const num = (v, hi = 1) => clamp(v === true ? 1 : +v || 0, 0, hi);

// The room's light from the state: the candles (warm, 0…1.6) and the windows (cold grey by day, a dull crimson in the
// evening), dimmed by the curtain and by the song.
function light(s) {
  const evening = num(s.evening),
    curtain = num(s.curtain),
    open = num(s.window_open),
    song = num(s.song);
  // what comes through the glass, and what of it reaches the room past the curtain
  const sky = num(s.window_light) * (1 - 0.6 * evening) + 0.45 * open;
  return {
    candles: num(s.candles, 1.6) * (1 - 0.5 * song),
    sky,
    window: sky * (1 - 0.9 * curtain) * (1 - 0.55 * song),
    evening,
    curtain,
    open,
    song,
  };
}
// the three lancet windows in the back wall: [x, sill, apex, half-width] (the wall's metres, y up negative)
const WINDOWS = [
  [-1.5, -4.25, -6.25, 0.26],
  [0, -4.1, -6.7, 0.3],
  [1.5, -4.25, -6.25, 0.26],
];
// a lancet's outline into path p
function lancet(p, x, b, top, w) {
  const sp = top + w * 2.4;
  p.moveTo(x - w, b);
  p.lineTo(x - w, sp);
  p.quadraticCurveTo(x - w, top + w * 0.5, x, top);
  p.quadraticCurveTo(x + w, top + w * 0.5, x + w, sp);
  p.lineTo(x + w, b);
  p.closePath();
}
// the candles: [x, wax height, base] on the candlestick (the element's metres) and how lit each is at `candles` C — the
// three of the candlestick (its side ones go out below 0.8, all out by 0.02), the two tall ones lit past 1
const CANDLES = [
  [-0.08, 0.2, -0.9],
  [0, 0.28, -0.93],
  [0.075, 0.15, -0.9],
  [-0.5, 0.3, -0.875],
  [0.17, 0.24, -0.875],
];
const litOf = (C) => [span(C, 0.45, 0.8), span(C, 0.02, 0.6), span(C, 0.45, 0.8), span(C, 1.02, 1.3), span(C, 1.2, 1.5)];
// his guitar: `strum` counts his strokes (the n-th crosses the strings at n + 0.25, as play_guitar has it); while it runs
// (e.speed), each stroke is a pulse 1 → 0, stronger the wilder he plays — the flames jump with it
function pulse(e) {
  if (!(e.speed("strum") > 0.05)) return 0;
  const f = ((((+e.state.strum || 0) - 0.25) % 1) + 1) % 1;
  return (1 - f) ** 3 * (0.55 + 0.45 * num(e.state.wild));
}
// a flame's flicker (≈1) at t, livelier with `wild`, a jump at each stroke — candles.wgsl has the same
function flicker(t, k, wild, p) {
  return (
    1 +
    (0.05 + 0.12 * wild) * Math.sin(t * (7.3 + 5 * wild) + k) +
    (0.03 + 0.08 * wild) * Math.sin(t * (11.9 + 7 * wild) + 1 + k * 2) +
    0.025 * Math.sin(t * 2.3 + k) +
    0.35 * p
  );
}

// The close-ups (the closeups module, an insert): Roderick's face, lit as the room is — the candles' warmth from the
// left, the windows' cold (or, in the evening, dusk-red) rim behind. `closeup_shot` chooses which (painted once when
// chosen): "glad" — meeting his friend, the eyes huge and wet, a smile coming (`closeup_smile`) and tightening into strain
// (`closeup_strain`); "news" — dry-eyed, strained, grief coming (`closeup_grief`). What moves in it is closeupNow's.
const SHOTS = {
  glad: { who: "roderick", turn: 0.2, gaze: [0.35, 0], eyes: 1.15, wet: 0.8, smile: 0.3, to: [{ smile: 0.9, part: 0.25 }, { strain: 1, smile: 0.5 }] },
  news: { who: "roderick", turn: 0.2, gaze: [0.35, 0], eyes: 1.15, wet: 0.15, strain: 0.3, grief: 0.2, to: [{ grief: 0.35 }] },
};
function closeup(S) {
  const face = SHOTS[S.closeup_shot];
  if (!face) return null;
  return { light: { like: "candle", power: 1.8, rim: S.evening > 0.5 ? "#7a4e4c" : "#56697a" }, faces: [face] };
}
// ... and what moves in it without painting it again: the expressions coming, his lips as he speaks
const closeupNow = (S) => ({
  roderick: { to: S.closeup_shot === "news" ? [num(S.closeup_grief)] : [num(S.closeup_smile), num(S.closeup_strain)], speak: num(S.closeup_speak) },
});

// ── the film, in beats (the world's module beats; notes.md lists them) ──
// (degrees: 0 away from us, 90 to the right, 180 toward us — the way from one place to another)
const toward = (a, d, a2, d2) => (Math.atan2(a2 - a, d2 - d) * 180) / Math.PI;
// his chair (where he sits: the seat, facing us), below her portrait (high on the wall at −3.05, 10.4 m), a step from
// the wall, turned up to it — and where on it he looks
const CHAIR = [0.32, 5.8];
const BEFORE_HER = [-2.6, 9.3],
  TO_HER = toward(...BEFORE_HER, -3.05, 10.4),
  HER = [-3.05, 10.4, 2.95];
// the camera on top of the picture: [x, z, h, look]
const WIDE = [0, 0, 0, 0],
  PORTRAIT = [-1.6, 2.6, 0.1, -0.1], // he below her, from his feet up to her
  PLAYING = [0.25, 1.6, 0.0, 0.04], // in on him with the guitar, the candles and his friend in the frame
  SINGING = [0.2, 2.1, 0.0, 0.03], // and a little closer as he sings
  LISTENING = [2.6, 5.6, 0.1, 0.02]; // in on the back wall right, where he listens at night
const shot = ([x, z, h, look]) => ({ camera_x: x, camera_z: z, camera_h: h, camera_look: look });
// the camera moved there over `over` seconds (all four together: one action — the last)
const cam = (s, [x, z, h, look], over, ease = "inOut") => {
  s.move("camera_x", x, { over, ease });
  s.move("camera_z", z, { over, ease });
  s.move("camera_h", h, { over, ease });
  return s.move("camera_look", look, { over, ease });
};
// someone walks to a place and turns there (an action: done as they have turned); `gait` — a walk of the cast's other
// than their own (Roderick's `hurry`)
const walkTo = (s, id, to, turn, gait) =>
  s.sequence(async (q) => {
    await q.person(id).walk([to], gait ? { gait } : {});
    if (turn != null) await q.person(id).turn(turn);
  });
// sitting down in his chair: to where it begins — before it, his back to it — and down; then at rest in it
const sitDown = (s) =>
  s.sequence(async (q) => {
    await q.person("roderick").go("sit_down", { to: CHAIR, turn: 180 });
    q.person("roderick").do("seated", { loop: true });
  });
// Roderick at rest in his chair, the narrator standing a little off, looking at him; the valet out of the room
const SEATED = {
  roderick_a: CHAIR[0], roderick_d: CHAIR[1], roderick_do: { motion: "seated", loop: true }, roderick_turn: 180, roderick_look: null, roderick_reach: null, roderick_with: null,
  narrator_a: 2.2, narrator_d: 6.4, narrator_do: "stand", narrator_turn: 255, narrator_look: "roderick", narrator_reach: null,
  valet_a: 7.6, valet_d: 7.2, valet_do: "stand", valet_turn: 270, valet_look: null, valet_here: false,
};
// the news: he under the right window, his friend by the clock, turned to him
const WINDOW = [1.4, 9.4],
  FRIEND = [2.6, 6.8];
// a night: he at the back wall right of the windows, his ear to the stone; his friend comes in from the door (off right)
// and stops beside him
const AT_WALL = [2.3, 10.25],
  BESIDE = [3.05, 9.75],
  DOOR = [7.6, 7.5];
const AT_WINDOW = { roderick_do: "stand", roderick_a: WINDOW[0], roderick_d: WINDOW[1], narrator_a: FRIEND[0], narrator_d: FRIEND[1], narrator_turn: toward(...FRIEND, ...WINDOW) };
const SHOT = { closeup: 0, night_fill: 0, ...shot(WIDE) };
// his face on the close-up, at rest
const FACE = { closeup_smile: 0, closeup_strain: 0, closeup_grief: 0, closeup_speak: 0 };
const DAY = { evening: 0, song: 0, tempo: 0, wild: 0 };
// deep night: the candles all but out, only the windows' cold
const NIGHT = { evening: 0, song: 0, tempo: 0, wild: 0, candles: 0.12, window_light: 0.3, curtain: 0, window_open: 0, night_fill: 1 };
const EVENING = { evening: 1, song: 0, tempo: 0, wild: 0 };
// mid-room, his friend's hand in both his: where they stand, and where their hands meet (between them, at the waist)
const MEET = [1.7, 6.4],
  GUEST = [2.45, 6.55],
  HANDS = [(MEET[0] + GUEST[0]) / 2, (MEET[1] + GUEST[1]) / 2, 1.0];
const MET = {
  roderick_a: MEET[0], roderick_d: MEET[1], roderick_turn: toward(...MEET, ...GUEST), roderick_look: "narrator", roderick_reach: { r: "narrator#hand_r", l: "narrator#hand_r" },
  narrator_a: GUEST[0], narrator_d: GUEST[1], narrator_turn: 260, narrator_reach: { r: HANDS },
};
// his eyes up, singing — over the room toward us (his face to the eye, lifted)
const UP = [CHAIR[0], CHAIR[1] - 2.5, 3.6];
// his hand runs on over the strings: `strokes` more, over `over` seconds (from wherever it is)
const strum = (s, strokes, over, ease = "linear") => s.move("strum", (+s.get("strum") || 0) + strokes, { over, ease });

// Each beat: `from` — all it does not set itself (cut to when it does not follow one of `after`); `run` — what happens,
// as long as its people and its keys take. The room itself — candles, curtain, window_open, window_light, clock, crack — is
// the game's: no beat touches it but the night's.
const FILM = {
  // the valet brings the narrator in; Roderick is up too fast, comes, takes his hand in both his
  enter: {
    from: () => ({ ...SEATED, ...SHOT, ...DAY, narrator_a: 5.4, narrator_d: 6.9, narrator_turn: 270, narrator_look: null, valet_a: 4.7, valet_d: 6.75, valet_here: true }),
    run: async (s) => {
      const rod = s.person("roderick"), nar = s.person("narrator"), valet = s.person("valet");
      await s.wait(0.5);
      const shown = walkTo(s, "valet", [3.0, 6.75], 240);
      await s.wait(0.6);
      await walkTo(s, "narrator", GUEST, 260);
      nar.look("roderick");
      rod.look("narrator");
      await shown;
      valet.do("bow");
      // (up out of the chair, too fast: from where he sits)
      await rod.go("rise", { from: CHAIR, turn: 180 });
      const out = s.sequence(async (q) => { await q.person("valet").walk([[7.6, 7.2]]); q.person("valet").here(false); });
      // (hurrying, too eager — a walk of its own)
      await walkTo(s, "roderick", MEET, toward(...MEET, ...GUEST), "hurry");
      // his friend's hand out to him, and his two hands round it
      nar.reach({ r: HANDS });
      rod.do("take_hand");
      rod.reach({ r: "narrator#hand_r", l: "narrator#hand_r" });
      await s.all(out, s.wait(3.2));
    },
  },
  // close: his face — the eyes huge and wet, glad; he speaks (his lips from 0.9 s: the scene tells meet:lips — the game's
  // line from there); the smile tightens into strain. It begins with a cut (said ahead by the module beats as `enter`
  // begins): its `from` is the close-up
  meet: {
    after: [],
    from: () => ({ ...SEATED, ...SHOT, ...DAY, ...FACE, ...MET, roderick_do: { motion: "take_hand", from: 3.9 }, closeup: 1, closeup_shot: "glad" }),
    run: async (s) => {
      await s.wait(0.5);
      s.move("closeup_smile", 1, { over: 0.6, ease: "out" });
      await s.wait(0.4);
      s.move("closeup_speak", 1, { over: 0.2 });
      s.tell("meet:lips");
      await s.wait(3.1);
      s.move("closeup_strain", 1, { over: 2.0 });
      await s.wait(0.2);
      await s.move("closeup_speak", 0, { over: 0.3 });
      await s.wait(1.6);
    },
  },
  // the whole room again (a cut, said ahead as `meet` begins): he lets go, goes back to his chair and sits; the narrator
  // is free
  room: {
    after: [],
    from: () => ({ ...SEATED, ...SHOT, ...DAY, ...FACE, ...MET, roderick_do: "stand" }),
    run: async (s) => {
      const rod = s.person("roderick"), nar = s.person("narrator");
      await s.wait(0.6);
      rod.reach(null);
      nar.reach(null);
      await s.wait(0.4);
      rod.look(null);
      const sat = sitDown(s);
      await s.wait(0.7);
      await s.all(sat, walkTo(s, "narrator", [2.2, 6.4], 255));
    },
  },
  // light or noise: he shields his eyes, turns away — and stays half turned
  flinch: {
    after: ["room", "flinch", "ease"],
    from: () => ({ ...SEATED, ...SHOT, ...DAY }),
    run: async (s) => {
      await s.person("roderick").do("flinch");
    },
  },
  // dimmer, quieter: he breathes out, the shoulders drop, a nod — and rests
  ease: {
    after: ["room", "flinch", "ease"],
    from: () => ({ ...SEATED, ...SHOT, ...DAY }),
    run: async (s) => {
      await s.person("roderick").do("ease");
      s.person("roderick").do("seated", { loop: true });
    },
  },
  // toward the portrait on the wall: Madeline at sixteen; he gets up, goes to it, looks up at her — standing before her
  // the scene tells 'portrait:before' (the game's lines start then); the camera settles on them
  portrait: {
    after: ["room", "flinch", "ease"],
    from: () => ({ ...SEATED, ...SHOT, ...DAY }),
    run: async (s) => {
      const rod = s.person("roderick");
      const camera = cam(s, PORTRAIT, 5);
      await s.wait(0.5);
      await rod.go("rise", { from: CHAIR, turn: 180 });
      await walkTo(s, "roderick", BEFORE_HER, TO_HER);
      rod.look(HER);
      s.tell("portrait:before");
      await s.all(camera, s.wait(3));
    },
  },
  // he turns his face from her (the game: «Speak not of her»), goes back to his chair; the room again
  turn_away: {
    after: "portrait",
    from: () => ({ ...SEATED, ...SHOT, ...DAY, ...shot(PORTRAIT), roderick_do: "stand", roderick_a: BEFORE_HER[0], roderick_d: BEFORE_HER[1], roderick_turn: TO_HER, roderick_look: HER }),
    run: async (s) => {
      // (the face turned from her, toward the windows' far side)
      await s.wait(0.1);
      s.person("roderick").look([2.6, 8.5, 1.6]);
      await s.wait(0.5);
      const camera = cam(s, WIDE, 4);
      await s.wait(0.7);
      const sat = sitDown(s);
      await s.all(camera, sat);
      s.person("roderick").look(null);
    },
  },
  // days go by: a cut to the room in the evening (time passing, a chapter's turn; the game takes it through black)
  dusk: {
    from: () => ({ ...SEATED, ...SHOT, ...DAY }),
    run: async (s) => {
      await s.wait(1.4);
      s.cut({ evening: 1 });
    },
  },
  // he takes up the guitar from beside the chair and plays, slowly — her song; he plays on
  guitar: {
    after: "dusk",
    from: () => ({ ...SEATED, ...SHOT, ...EVENING }),
    run: async (s) => {
      const rod = s.person("roderick");
      await s.wait(0.4);
      const take = rod.do("take_guitar");
      await s.wait(0.4);
      const camera = cam(s, PLAYING, 5);
      // (the hand closes on its neck)
      await s.wait(0.5);
      rod.with(["guitar"]);
      s.move("tempo", 0.12, { over: 1.5 });
      await take;
      rod.do("play_guitar", { loop: true });
      strum(s, 30, 40);
      await camera;
    },
  },
  // (the world's own film; in the game «String» plays this) faster and faster, wilder
  frenzy: {
    after: "guitar",
    from: () => ({ ...SEATED, ...SHOT, ...EVENING, ...shot(PLAYING), roderick_do: { motion: "play_guitar", loop: true }, roderick_with: ["guitar"], tempo: 0.12 }),
    run: async (s) => {
      const strokes = strum(s, 46, 16, "in");
      s.move("tempo", 1, { over: 15, ease: "in" });
      await s.wait(2);
      s.move("wild", 1, { over: 13, ease: "in" });
      await strokes;
    },
  },
  // he sings: the head back, the eyes up; the light sinks, the crack glows faintly
  ballad: {
    after: ["guitar", "frenzy"],
    from: () => ({ ...SEATED, ...SHOT, ...EVENING, ...shot(PLAYING), roderick_do: { motion: "play_guitar", loop: true }, roderick_with: ["guitar"] }),
    run: async (s) => {
      const strokes = strum(s, 7, 10, "out");
      s.move("tempo", 0.08, { over: 2.5 });
      s.move("wild", 0, { over: 3 });
      await s.wait(0.5);
      s.move("song", 1, { over: 3 });
      const camera = cam(s, SINGING, 9.5);
      await s.wait(0.3);
      s.person("roderick").look(UP);
      await s.all(strokes, camera);
    },
  },
  // he lays the guitar down; the hand that played trembles
  guitar_down: {
    after: "ballad",
    from: () => ({ ...SEATED, ...SHOT, ...EVENING, ...shot(SINGING), roderick_do: { motion: "play_guitar", loop: true }, roderick_with: ["guitar"], roderick_look: UP, song: 1 }),
    run: async (s) => {
      const rod = s.person("roderick");
      const back = s.move("song", 0, { over: 2.5 });
      await s.wait(0.2);
      rod.look(null);
      await s.wait(0.2);
      const lay = rod.do("lay_guitar");
      // (it touches the floor by the chair)
      await s.wait(1.6);
      rod.with(null);
      await s.all(lay, back);
      rod.do("tremble", { loop: true });
    },
  },
  // another evening: he stands under the window, his back to the room; turns. Close: dry eyes; his lips (the scene tells
  // news:lips — the game's line from there)
  news: {
    from: () => ({ ...SEATED, ...SHOT, ...EVENING, ...FACE, ...AT_WINDOW, roderick_turn: 0 }),
    run: async (s) => {
      const rod = s.person("roderick");
      const close = s.shot({ closeup: 1, closeup_shot: "news", ...FACE });
      await s.wait(2.4);
      rod.turn(toward(...WINDOW, ...FRIEND));
      rod.look("narrator");
      await s.wait(1.8);
      close.cut();
      await s.wait(0.8);
      s.tell("news:lips");
      await s.move("closeup_speak", 1, { over: 0.2 });
      await s.wait(1.2);
      s.move("closeup_speak", 0, { over: 0.3 });
      await s.move("closeup_grief", 1, { over: 1.2 });
    },
  },
  // the room again (a cut, said ahead as `news` begins): he talks fast, pacing the room past his chair, and stops at the
  // table, talking on
  plan: {
    after: [],
    from: () => ({ ...SEATED, ...SHOT, ...EVENING, ...FACE, ...AT_WINDOW, roderick_turn: toward(...WINDOW, ...FRIEND), roderick_look: "narrator" }),
    run: async (s) => {
      const rod = s.person("roderick");
      await s.wait(0.7);
      await rod.walk([[1.6, 7.6], [0.9, 5.3], [-0.6, 5.6]]);
      await rod.turn(toward(-0.6, 5.6, ...FRIEND));
      rod.do("talk", { loop: true });
    },
  },
  // a night (chapter III): dark, one candle guttering, the windows' cold; he stands at the wall, his ear to the stone,
  // still; his friend comes in from the door, stops beside him; they listen together
  night_listen: {
    // (his ear to the stone: facing the wall, his head turned along it — the ear to it — his palm flat on it)
    from: () => ({
      ...SEATED, ...SHOT, ...NIGHT, ...shot(LISTENING), roderick_do: "stand", roderick_a: AT_WALL[0], roderick_d: AT_WALL[1], roderick_turn: 0,
      roderick_look: [AT_WALL[0] + 3, AT_WALL[1] + 0.1, 1.62], roderick_reach: { l: [AT_WALL[0] - 0.28, 10.48, 1.55] }, narrator_a: DOOR[0], narrator_d: DOOR[1], narrator_turn: 290, narrator_look: null,
    }),
    run: async (s) => {
      await s.wait(1.2);
      await walkTo(s, "narrator", BESIDE, 10);
      // (his head bowed to the stone, listening too: the game's line from here)
      s.person("narrator").look([AT_WALL[0] + 0.4, AT_WALL[1] + 0.3, 1.3]);
      s.tell("night_listen:beside");
      await s.wait(3);
    },
  },
};
const ORDER = ["enter", "meet", "room", "ease", "flinch", "portrait", "turn_away", "dusk", "guitar", "frenzy", "ballad", "guitar_down", "news", "plan", "night_listen"];

return { num, light, WINDOWS, lancet, CANDLES, litOf, pulse, flicker, closeup, closeupNow, FILM, ORDER };
