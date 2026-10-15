// The Strorm kitchen — a film in beats (module film: notes.md lists them). The viewer of the world sees the cut
// `film`: the evening of the third hand, told as the book tells it. A game plays the beats one at a time, its
// branches among them, and the nights at this table (tableaux) for its other steps.
// The people are the engine's (elements with "person", the world's cast): what each does is <id>_do, where each faces
// <id>_turn (degrees: 0 away from us, 90 to the right, 180 toward us), looks <id>_look, reaches <id>_reach, what is in
// their hands <id>_with — and where each is their place (<id>_a, <id>_d). The game's own keys at the night table —
// david_grip (he holds the table's edge, or has let go and fidgets), david_stir (the shiver in him while he holds on),
// father_look (the father looks up from the Book at him) — are turned into what they do (below).
const P = (id) => scene.person(id),
  L = scene.lib;
const loop = (motion) => ({ motion, loop: true });
const IDS = ["joseph", "emily", "mary", "farmhand", "david"];

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
// (from the pot to him she goes round her chair at the hearth's end of the table)
const ROUND_CHAIR = [2.78, 4.72];
// where she steps back to after, under the father's eyes
const ASIDE = [2.85, 4.7];
// the stair door: before it; its latch; the stairs up (lib.STEP), their top
const AT_DOOR = [-2.58, 5.98], LATCH = [-2.87, 6.16, 1.0], UP = [-2.58, 8.9];
// the sampler on the wall: the true image («Чти образ Божий»)
const SAMPLER = [-0.45, 6.15, 2.45];
// the bowls on the table: Mary's, the farmhand's
const BOWL = { mary: [-0.3, 4.72, 0.8], farmhand: [1.0, 4.72, 0.8] };
// the table's near edge before someone seated behind it (their hands on it)
const EDGE = (a, d) => ({ r: [a - 0.13, d - 0.38, 0.8], l: [a + 0.13, d - 0.38, 0.8] });
// the mother's eyes down at her sewing; at the floor before someone
const DOWN = (a, d, turn, h = 0.1, ahead = 0.7) => [a + ahead * Math.sin((turn * Math.PI) / 180), d + ahead * Math.cos((turn * Math.PI) / 180), h];
// the way from one point to another, in degrees (as <id>_turn)
const toward = ([a, d], [a2, d2]) => (((Math.atan2(a2 - a, d2 - d) * 180) / Math.PI) + 360) % 360;
// where the father stands up to judge him: out of his chair, a step before it into the room, clear of the table — turned
// to the boy, who kneels before him close enough for his hand to come down on his head, facing him
const BY_CHAIR = [-1.3, 4.12], STANDS = [-1.25, 3.8], JUDGE = 120;
const KNEEL = [STANDS[0] + 0.44 * Math.sin((JUDGE * Math.PI) / 180), STANDS[1] + 0.44 * Math.cos((JUDGE * Math.PI) / 180)];

// ── the scene's state when nothing has happened yet: the evening, everyone at their place, the boy still outside ──
const START = {
  lamp: 1, dusk: 0.2, fade: 0, steam: 1, camera_x: 0, camera_z: 0, camera_look: 0,
  yard_door: 0, stair_door: 0, wish: 0, moon_light: 0, at_table: 0, david_grip: 1, david_stir: 0, father_look: 0,
  joseph_a: SEAT.joseph[0], joseph_d: SEAT.joseph[1], joseph_do: loop("read_seated"), joseph_turn: 90, joseph_look: null,
  joseph_reach: null, joseph_with: ["book_open"], joseph_here: true,
  mary_a: SEAT.mary[0], mary_d: SEAT.mary[1], mary_do: loop("sit_still"), mary_turn: 174, mary_look: BOWL.mary,
  mary_reach: EDGE(...SEAT.mary), mary_with: null, mary_here: true,
  farmhand_a: SEAT.farmhand[0], farmhand_d: SEAT.farmhand[1], farmhand_do: loop("eat_seated"), farmhand_turn: 188,
  farmhand_look: BOWL.farmhand, farmhand_reach: null, farmhand_with: ["spoon"], farmhand_here: true,
  emily_a: AT_POT[0], emily_d: AT_POT[1], emily_do: loop("stir_pot"), emily_turn: 0, emily_look: POT, emily_reach: null,
  emily_with: ["ladle"], emily_here: true,
  david_a: YARD[0], david_d: YARD[1], david_e: 0, david_do: loop("clutch"), david_turn: 90, david_look: null, david_reach: null,
  david_with: ["rag_loose"], david_gait: "clutch_walk", david_wear: null, david_steps: true, david_here: true,
};

// ── the rows' helpers ──
// a beat's rows written in the film's own seconds (t0 — where the beat starts in them)
const at = (t0, rows) => rows.map(([t, ...r]) => [Math.round((t - t0) * 100) / 100, ...r]);
const cam = (t, x, z, look, over, ease) => [[t, "camera_x", x, over, ease], [t, "camera_z", z, over, ease], [t, "camera_look", look, over, ease]];
// a beat lasts till t
const till = (t) => [t, () => {}];
// the state once the rows have played (what the next beat begins at, when the scene opens on it): values, paths' ends,
// and what a row that is a function says it leaves (its `ends(state)`)
function settle(state, rows) {
  const out = { ...state };
  for (const [, k, v] of [...rows].sort((p, q) => p[0] - q[0])) {
    if (typeof k === "function") Object.assign(out, k.ends?.(out));
    else if (Array.isArray(k)) k.forEach((key, i) => (out[key] = v.path.at(-1)[i]));
    else out[k] = v;
  }
  return out;
}
// a motion done once, ending facing `turn`: begun where they are (getting up) — or ending at `to` (a point, or a function
// giving it: down on his knees before his father; onto a seat): a step to where it begins first; they are where it
// takes them, held at its end, after it
const once = (id, motion, turn, to) => {
  const end = (s) => turn ?? s[`${id}_turn`], dest = () => (typeof to === "function" ? to() : to);
  const f = () => {
    const s = scene.state;
    scene.set(`${id}_steps`, true);
    P(id).go(motion, { ...(to ? { to: dest() } : { from: [s[`${id}_a`], s[`${id}_d`]] }), turn: end(s) });
  };
  f.ends = (s) => {
    const off = to ? { across: 0, distance: 0 } : P(id).startOf(motion, end(s)) ?? { across: 0, distance: 0 };
    const [a, d] = to ? dest() : [s[`${id}_a`], s[`${id}_d`]];
    return { [`${id}_a`]: a - off.across, [`${id}_d`]: d - off.distance, [`${id}_turn`]: end(s), [`${id}_do`]: { motion, loop: false, from: 99 } };
  };
  return f;
};
// they walk (steps) from where they are along points, taking `over` seconds, and turn at the end
const walk = (t, id, pts, over, turn, ease = "inOut") => {
  const f = () => {
    const s = scene.state;
    scene.set(`${id}_steps`, true);
    scene.path([`${id}_a`, `${id}_d`], [[s[`${id}_a`], s[`${id}_d`]], ...pts], { over, ease });
  };
  f.ends = () => ({ [`${id}_a`]: pts.at(-1)[0], [`${id}_d`]: pts.at(-1)[1], [`${id}_steps`]: true });
  return [[t, f], ...(turn != null ? [[t + over, `${id}_turn`, turn]] : [])];
};
// a shake of the head: the eyes from one side of what they look at to the other, `n` times
const shake = (t, id, [a, d, h], n = 2) => Array.from({ length: n }, (_, i) => [
  [t + i * 0.5, `${id}_look`, [a - 0.35, d, h]], [t + i * 0.5 + 0.25, `${id}_look`, [a + 0.35, d, h]],
]).flat().concat([[t + n * 0.5, `${id}_look`, [a, d, h]]]);
// his right hand raised over the Book, a little before him; pointing at the floor before him (where the boy is to kneel,
// and on, the way he points)
const RAISED = [STANDS[0] + 0.25 * Math.sin((JUDGE * Math.PI) / 180), STANDS[1] + 0.25 * Math.cos((JUDGE * Math.PI) / 180), 2.3];
const FLOOR = [STANDS[0] + 0.95 * Math.sin((JUDGE * Math.PI) / 180), STANDS[1] + 0.95 * Math.cos((JUDGE * Math.PI) / 180), 0];
// up the stairs and out of sight (or down them): along them, then gone (here: false)
const upstairs = (t, over) => [...walk(t, "david", [[AT_DOOR[0], L.STEP.d - 0.05], UP], over, null, "linear"), [t + over, "david_here", false]];

// ── the night at the table: the game's keys, turned into what they do ──
// at_table: the boy sits at Mary's place (night, late); there, holding the edge — still, or shivering with how hard he
// holds still; let go — fidgeting, looking about. The father looks up at him from the Book, and back down to it.
function still() {
  const s = scene.state;
  if (!s.at_table) return;
  const grip = (s.david_grip ?? 1) > 0.5, stir = (s.david_stir ?? 0) > 0.25;
  scene.set("david_do", loop(grip ? (stir ? "sit_tremble" : "sit_grip") : "sit_fidget"));
  scene.set("david_reach", grip ? EDGE(...SEAT.mary) : null);
  scene.set("david_look", grip ? [SEAT.mary[0], SEAT.mary[1] - 0.5, 0.8] : null);
}
for (const k of ["david_grip", "david_stir", "at_table"]) scene.on("change", k, still);
scene.on("change", "father_look", (v) => P("joseph").look(v > 0.5 ? "david" : null));
// the light: with the lamp out, only the night at the window
const night = () => scene.set("moon_light", L.cl(1 - (scene.get("lamp") ?? 1) / 0.3, 0, 1) * (scene.get("dusk") ?? 0));
scene.on("change", "lamp", night);
scene.on("change", "dusk", night);

// ── the beats ──
const B = {
  // ---- 1. A quiet evening. The father reads; the mother stirs the pot; the farmhand eats. The yard door opens:
  // David comes in, his right hand in a rag held to his chest, past the father (who doesn't look up) to the
  // hearth, and tries to tie it himself — one hand and his teeth. His mother looks round.
  evening: { rows: [
    [0, "fade", 0, 3.0],
    [0, "dusk", 0.35, 18, "linear"],
    [0, "steam", 0.7, 18, "linear"],
    [5.2, "yard_door", 1, 1.0, "out"],
    [5.6, "mary_look", [YARD[0], YARD[1], 1.1]],
    [6.0, "farmhand_do", loop("sit_still")], [6.0, "farmhand_look", [YARD[0], YARD[1], 1.1]],
    ...walk(6.2, "david", [[1.3, 3.6]], 4.6),
    [7.4, "mary_look", "david"],
    [9.0, "yard_door", 0, 1.4, "in"],
    [10.4, "farmhand_do", loop("eat_seated")], [10.4, "farmhand_look", BOWL.farmhand],
    [11.5, "mary_look", BOWL.mary],
    ...walk(11.2, "david", [BY_HEARTH], 1.2, 75),
    // (closer, by the hearth)
    ...cam(14.6, 1.85, 1.55, 0.02, 0),
    [15.0, "david_do", loop("teeth")], [15.0, "david_gait", null],
    [16.8, "emily_turn", 290], [16.9, "emily_look", "david"],
    [17.6, "emily_do", "stand"],
    till(18.1),
  ] },
  // ---- 2a. He turns to her and holds the hand out; she comes, shakes her head at the mess, takes it and ties it
  help: { after: "evening", rows: [
    [0, "david_do", loop("clutch")], [0.1, "david_turn", toward(BY_HEARTH, TO_TIE)], [0.1, "david_look", "emily"],
    [0.3, "david_reach", { r: KNOT }],
    [0.4, "emily_with", null],
    ...walk(0.4, "emily", [ROUND_CHAIR, TO_TIE], 1.5, toward(TO_TIE, BY_HEARTH)),
    [1.0, "emily_look", "david#hand_r"],
    [2.0, "emily_do", loop("tend")], [2.0, "emily_reach", { r: "david#hand_r", l: "david#hand_r" }],
    ...shake(2.1, "emily", KNOT),
    [3.5, "david_look", "david#hand_r"],
    [6.4, "david_with", ["rag"]],
    till(7.4),
  ] },
  // ---- 2b. "I'll manage": he turns his shoulder to her and pulls at the knot with his teeth. She comes all the
  // same, takes his wrist from his mouth, turns him round by it and ties it — hard; he flinches.
  self: { after: "evening", rows: [
    [0, "david_turn", 130],
    [0.9, "emily_with", null],
    ...walk(0.9, "emily", [ROUND_CHAIR, TO_TIE], 1.4, toward(TO_TIE, BY_HEARTH)),
    [1.4, "emily_look", "david#hand_r"],
    ...shake(2.3, "emily", KNOT, 1),
    [2.6, "emily_do", loop("tend")], [2.6, "emily_reach", { r: "david#hand_r", l: "david#hand_r" }],
    [3.1, "david_do", loop("clutch")], [3.1, "david_reach", { r: KNOT }], [3.1, "david_turn", toward(BY_HEARTH, TO_TIE)],
    [3.3, "david_look", "emily"],
    [4.5, "david_do", "flinch"],
    [5.6, "david_do", loop("clutch")], [5.6, "david_look", "david#hand_r"],
    [6.6, "david_with", ["rag"]],
    till(7.3),
  ] },
  // ---- 3. The slip: he looks up at her — "if I had another hand…" — and a pale third hand, his wish, grows out of
  // his side to the knot. Her head comes up: at him, then, slowly, at the father. (cut: wide) The whole room has
  // heard: the spoon stops, the sister looks, the father's head rises from the Book. The hand fades.
  slip: { after: ["help", "self"], rows: [
    [0, "david_look", "emily"],
    [0.7, "wish", 1, 1.7, "out"],
    [1.2, "emily_look", "david"],
    [2.2, "emily_look", "joseph"],
    ...cam(3.6, 0, 0, 0, 0),
    [3.7, "farmhand_do", loop("sit_still")], [3.8, "farmhand_look", "david"],
    [4.0, "mary_look", "david"],
    [4.2, "david_look", [KNOT[0], KNOT[1], 0.2]],
    [4.5, "joseph_look", "david"],
    [4.8, "wish", 0, 2.0, "in"],
    [5.4, "emily_reach", null], [5.4, "emily_do", "stand"],
    [5.8, "david_reach", null],
    ...walk(6.2, "emily", [ASIDE], 2.2, toward(ASIDE, SEAT.joseph)),
    [6.3, "emily_look", "joseph"],
    till(8.6),
  ] },
  // ---- 4. (said again, honestly) He shuts the Book and rises; his shadow climbs the wall to the ceiling. He
  // points at the floor before him. David comes, slowly, and goes down on his knees. (pushing in) The father points
  // up at the sampler — the true image, one head, two arms — and the boy looks up at it; then at the boy's hand:
  // the boy hides his hands behind his back. The father opens the Book and reads over him; the household prays.
  kneel: { after: "slip", rows: [
    [0, "dusk", 0.6, 22, "linear"],
    [0, "joseph_with", ["book"]],
    [0.6, "joseph_look", "david"],
    [0.7, once("joseph", "rise_chair", 90)],
    [1.0, "mary_look", BOWL.mary], [1.5, "farmhand_look", BOWL.farmhand],
    ...walk(3.5, "joseph", [BY_CHAIR, STANDS], 1.4, JUDGE),
    [5.0, "joseph_look", FLOOR], [5.1, "joseph_reach", { r: FLOOR }],
    [5.6, "joseph_look", "david"],
    ...walk(4.4, "david", [[0.3, 3.45], [-0.4, 3.35]], 4.2),
    [4.6, "emily_look", [ASIDE[0] - 0.5, ASIDE[1] - 0.6, 0.1]],
    [7.4, "joseph_reach", null],
    [9.6, once("david", "kneel_down", (JUDGE + 180) % 360, KNEEL)],
    [9.8, "david_look", "joseph"],
    [12.0, "david_do", loop("kneel_pray")],
    ...cam(11.0, -0.85, 0.9, 0.05, 6, "inOut"),
    [11.8, "joseph_turn", toward(STANDS, SAMPLER)], [12.2, "joseph_look", SAMPLER],
    [12.3, "joseph_reach", { r: SAMPLER }],
    [12.9, "david_look", SAMPLER],
    [15.4, "joseph_reach", null], [15.4, "joseph_turn", JUDGE],
    [15.7, "joseph_look", "david#hands"],
    [15.8, "joseph_reach", { r: "david#hands" }],
    [16.0, "david_look", "joseph"],
    [16.6, "david_do", loop("kneel_hide")],
    [18.2, "joseph_reach", null],
    [18.6, "joseph_with", ["book_open_l"]], [18.7, "joseph_look", "david"],
    [18.9, "joseph_reach", { r: RAISED }],
    [19.0, "mary_do", loop("pray_seated")], [19.0, "mary_reach", null], [19.0, "mary_look", [SEAT.mary[0], SEAT.mary[1] - 0.6, 0.6]],
    [19.5, "emily_do", loop("pray_stand")], [19.5, "emily_look", [ASIDE[0] - 0.4, ASIDE[1] - 0.6, 0.2]],
    [19.9, "farmhand_do", loop("pray_seated")], [19.9, "farmhand_with", null], [19.9, "farmhand_look", [SEAT.farmhand[0], SEAT.farmhand[1] - 0.6, 0.6]],
    [19.4, "david_do", loop("kneel_pray")], [19.4, "david_look", "joseph#feet"],
    till(22),
  ] },
  // ---- 5a. On his knees he lifts his head to find his mother. She keeps hers down. The father stops reading,
  // looks down at him and puts his hand on the boy's head, and presses it down.
  seek: { after: "kneel", rows: [
    ...cam(0, -0.35, 0.7, 0, 3.2, "inOut"),
    [0.8, "david_look", "emily"],
    [3.0, "joseph_reach", null], [3.0, "joseph_look", "david"],
    [3.6, "joseph_reach", { r: "david#head" }],
    [4.0, "david_look", "joseph#feet"],
    [6.6, "joseph_reach", null],
    [6.9, "joseph_reach", { r: RAISED }], [6.9, "joseph_look", "david"],
    till(8.6),
  ] },
  // ---- 5b. He keeps his eyes on the floor. His mother lifts hers to him for a moment — he doesn't see it.
  bow: { after: "kneel", rows: [
    ...cam(0, -0.35, 0.7, 0, 3.2, "inOut"),
    [2.4, "emily_look", "david"],
    [5.6, "emily_look", [ASIDE[0] - 0.4, ASIDE[1] - 0.6, 0.2]],
    till(7.6),
  ] },
  // ---- 6. (wide) He shuts the Book and points to the stair door. The boy gets up and goes. On the threshold he
  // looks back at his mother: she turns away to the hearth. He goes up; the door shuts. The father sits back down to
  // the Book; the mother stirs the pot again. (slowly in) The bowl goes cold by the empty chair.
  upstairs: { after: ["seek", "bow"], rows: [
    [0, "dusk", 1, 24, "linear"],
    [0, "steam", 0.15, 24, "in"],
    ...cam(0, 0, 0, 0, 2.4, "inOut"),
    [0, "joseph_reach", null],
    [0.2, "joseph_with", ["book"]],
    [0.8, "joseph_turn", toward(STANDS, AT_DOOR)],
    [1.2, "joseph_look", [AT_DOOR[0], 6.2, 1.4]],
    [1.6, "joseph_reach", { r: [AT_DOOR[0], 6.2, 1.3] }],
    [2.6, once("david", "stand_from_kneel")],
    [3.4, "david_look", null],
    ...walk(4.6, "david", [[-1.3, 3.2], [-2.45, 3.75]], 2.6),
    ...walk(7.2, "david", [AT_DOOR], 2.5, 0),
    [8.2, "joseph_reach", null], [8.4, "joseph_look", "david"],
    [9.9, "david_reach", { r: LATCH }],
    [10.6, "stair_door", 1, 1.0, "out"],
    [11.3, "david_reach", null],
    [11.4, "david_turn", 80], [11.6, "david_look", "emily"],
    [11.9, "emily_do", "stand"], [12.0, "emily_look", POT],
    ...walk(12.0, "emily", [AT_POT], 2.6, 0),
    [13.2, "david_turn", 0], [13.2, "david_look", null],
    ...upstairs(13.6, 3.6),
    [14.8, "emily_with", ["ladle"]], [15.0, "emily_do", loop("stir_pot")],
    [17.4, "stair_door", 0, 0.9, "in"],
    [17.6, "joseph_turn", 90], [17.6, "joseph_look", null],
    ...walk(17.8, "joseph", [BY_CHAIR], 1.0),
    [18.8, once("joseph", "sit_chair", 90, SEAT.joseph)],
    [20.6, "joseph_do", loop("read_seated")], [20.6, "joseph_with", ["book_open"]],
    [22.6, "mary_do", loop("sit_still")], [22.6, "mary_reach", EDGE(...SEAT.mary)], [22.6, "mary_look", BOWL.mary],
    [23.0, "farmhand_do", loop("eat_seated")], [23.0, "farmhand_with", ["spoon"]], [23.0, "farmhand_look", BOWL.farmhand],
    ...cam(19.6, 0.45, 1.2, 0.05, 7, "inOut"),
    till(27),
  ] },
  // ---- 4'. (the lie: "Nothing, Father.") He puts the bound hand behind his back and looks at the floor.
  // (cut: the father, close) He lowers the Book and turns his eyes, slowly, from the boy to the mother.
  lie: { after: "slip", rows: [
    [0, "david_do", loop("hide_stand")], [0, "david_look", DOWN(...BY_HEARTH, toward(BY_HEARTH, TO_TIE))],
    [0.3, "emily_look", "david"],
    ...cam(1.6, -1.3, 2.2, 0, 0),
    [1.6, "joseph_with", ["book"]], [1.6, "joseph_do", loop("sit_still")],
    [2.4, "joseph_look", "emily"],
    till(4.2),
  ] },
  // ---- 4''. (cut: the mother at the hearth, the boy before her) She has looked at the boy; now she has to answer.
  // She lifts her eyes to the father — and lowers them.
  lie_mother: { after: "lie", rows: [
    ...cam(0, 2.3, 1.5, 0, 0),
    [0.6, "emily_look", "joseph"],
    [2.4, "emily_look", DOWN(...ASIDE, toward(ASIDE, SEAT.joseph), 0.1, 1.2)],
    till(3.6),
  ] },
  // ---- 5'. She has answered. The father does not take his eyes off her; he sends the boy up without a look. The
  // boy goes the long way round the table. On the threshold he looks back: his mother stands as she stood, under
  // the father's eyes. The door shuts. Only then she turns to the pot.
  lie_up: { after: "lie_mother", rows: [
    ...cam(0, 0, 0, 0, 0),
    [0, "dusk", 1, 20, "linear"],
    [0, "steam", 0.15, 20, "in"],
    [0.9, "david_do", loop("clutch")], [0.9, "david_look", null],
    ...walk(0.9, "david", [[1.2, 3.45], [-2.4, 3.5], AT_DOOR], 6.6, 0),
    [2.0, "farmhand_look", BOWL.farmhand], [2.6, "mary_look", BOWL.mary],
    [8.2, "david_reach", { r: LATCH }],
    [8.8, "stair_door", 1, 1.0, "out"],
    [9.4, "david_reach", null],
    [9.5, "david_turn", 80], [9.7, "david_look", "emily"],
    [11.6, "david_turn", 0], [11.6, "david_look", null],
    ...upstairs(12.0, 3.6),
    [15.8, "stair_door", 0, 0.9, "in"],
    [16.6, "emily_look", POT],
    ...walk(16.8, "emily", [AT_POT], 2.4, 0),
    [18.4, "emily_with", ["ladle"]], [18.6, "emily_do", loop("stir_pot")],
    [18.0, "joseph_look", null],
    [19.0, "joseph_with", ["book_open"]], [19.2, "joseph_do", loop("read_seated")],
    till(22),
  ] },

  // ---- Tableaux for the game's other nights at this table ----
  // a night: the father reads, David across the table holds its edge (a game moves david_grip, david_stir,
  // father_look while he must not stir)
  night: { rows: [[0, "fade", 0, 2.4]] },
  // the reading is over: the camera eases back — the mother at the hearth's end, her eyes down
  night_after: { after: "night", rows: [...cam(0, -0.25, 1.3, 0, 3.5, "inOut"), till(3.5)] },
  // years later (David nearly grown), the lamp lower: the father reads longer than he used to
  late: { rows: [[0, "fade", 0, 2.4], ...cam(0, -0.65, 2.4, 0.02, 14, "inOut")] },
  // …and lifts his head from the Book, and looks at him
  asks: { after: "late", rows: [
    [0, "father_look", 1],
    [0.6, "david_grip", 0],
    ...cam(0.3, -0.25, 1.3, 0, 2.6, "inOut"),
    till(2.9),
  ] },
  // the reading is over: the father shuts the Book; David gets up and goes up to bed (the father reads on)
  to_bed: { after: ["night", "night_after", "late", "asks"], rows: [
    [0, "father_look", 0],
    [0.2, "joseph_with", ["book"]], [0.2, "joseph_do", loop("sit_still")],
    [1.0, "david_grip", 0],
    [1.4, "at_table", 0], [1.4, "david_reach", null], [1.4, "david_look", null],
    [1.6, once("david", "rise_away")],
    ...cam(1.6, -0.9, 0.6, 0, 4, "inOut"),
    ...walk(3.4, "david", [[-0.9, 5.3], [-2.4, 5.35], AT_DOOR], 3.6, 0),
    [4.6, "emily_look", "david"],
    [7.0, "david_reach", { r: LATCH }],
    [7.4, "stair_door", 1, 1.0, "out"],
    [8.0, "david_reach", null],
    [8.0, "emily_look", [SEAT.emily[0] - 0.4, SEAT.emily[1], 0.4]],
    ...upstairs(8.4, 3.4),
    [12.0, "stair_door", 0, 0.9, "in"],
    [12.0, "joseph_with", ["book_open"]], [12.2, "joseph_do", loop("read_seated")],
    till(13.4),
  ] },
  // (later that night) the lamp is out, the room empty, the hearth low. The stair door opens; David comes down on
  // tiptoe, crosses the room to the yard door, and the night takes him.
  sneak: { after: "to_bed", rows: [
    [0, "fade", 0, 2.0],
    [1.6, "stair_door", 1, 1.0, "out"],
    [1.9, "david_here", true],
    ...walk(1.9, "david", [[AT_DOOR[0], L.STEP.d - 0.05], AT_DOOR], 2.6, null, "linear"),
    [4.5, "david_gait", "tiptoe"],
    [4.8, "stair_door", 0, 1.2, "in"],
    ...walk(5.0, "david", [[-2.6, 4.6], [-4.8, 3.7], [-6.4, 3.5]], 8.4, null, "linear"),
    [7.4, "yard_door", 0.7, 1.4, "out"],
    [13.4, "david_here", false],
    [12.4, "yard_door", 0, 1.4, "in"],
    [13.4, "fade", 1, 1.6],
    till(15),
  ] },
};

// ── what each beat begins at: the state after the beats that lead to it — worked out as it begins (where a motion done
// once takes someone is the motion's: the people know it once they are here) ──
const chain = (start, ...names) => names.reduce((st, n) => settle(st, B[n].rows), start);
const from = (name, make) => Object.defineProperty(B[name], "from", { get: make, enumerable: true });
from("evening", () => ({ ...START, fade: 1 }));
for (const n of ["help", "self"]) from(n, () => chain(START, "evening"));
from("slip", () => chain(START, "evening", "help"));
for (const n of ["kneel", "lie"]) from(n, () => chain(START, "evening", "help", "slip"));
for (const n of ["seek", "bow"]) from(n, () => chain(START, "evening", "help", "slip", "kneel"));
from("upstairs", () => chain(START, "evening", "help", "slip", "kneel", "seek"));
from("lie_mother", () => chain(START, "evening", "help", "slip", "lie"));
from("lie_up", () => chain(START, "evening", "help", "slip", "lie", "lie_mother"));
// a night at this table: the father reads, David sits across from us holding the table's edge, the mother sews by the
// hearth's end, her eyes down; the others have gone to bed
const NIGHT = {
  ...START, lamp: 0.85, dusk: 1, steam: 0, at_table: 1, david_grip: 1, david_stir: 0, father_look: 0,
  david_a: SEAT.mary[0], david_d: SEAT.mary[1], david_turn: 174, david_do: loop("sit_grip"), david_reach: EDGE(...SEAT.mary),
  david_look: [SEAT.mary[0], SEAT.mary[1] - 0.5, 0.8], david_with: ["rag"], david_gait: null,
  emily_a: SEAT.emily[0], emily_d: SEAT.emily[1], emily_turn: 270, emily_do: loop("sew"), emily_with: null,
  emily_look: [SEAT.emily[0] - 0.3, SEAT.emily[1], 0.45],
  mary_here: false, farmhand_here: false, camera_x: -0.65, camera_z: 2.6, camera_look: 0.02,
};
// years later: David nearly grown (the cast's david_teen over him), the lamp lower
const LATE = { ...NIGHT, lamp: 0.6, david_wear: scene.kit.cast.characters.david_teen, david_with: null, camera_x: -0.4, camera_z: 1.4 };
from("night", () => ({ ...NIGHT, fade: 1 }));
from("night_after", () => NIGHT);
from("late", () => ({ ...LATE, fade: 1 }));
from("asks", () => ({ ...LATE, camera_x: -0.65, camera_z: 2.4 }));
from("to_bed", () => NIGHT);
from("sneak", () => ({
  ...chain(NIGHT, "to_bed"), fade: 1, lamp: 0, steam: 0, joseph_here: false, emily_here: false, mary_here: false, farmhand_here: false,
  david_here: false, david_a: UP[0], david_d: UP[1], david_turn: 180, david_do: "stand", david_gait: null,
  camera_x: -1.6, camera_z: 0.5, camera_look: 0,
}));
night();
scene.kit.film.beats(scene, B, { film: ["evening", "help", "slip", "kneel", "seek", "upstairs"] });
