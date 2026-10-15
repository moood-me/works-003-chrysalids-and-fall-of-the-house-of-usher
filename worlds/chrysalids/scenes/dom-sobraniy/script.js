// The trial in the meeting house (notes.md). The game sets the hall's keys — men, inspector_up, father_turn, david_look,
// david_present, lamp, spill, fire_outside, door, rush — and this script turns them into what its people do. The people
// are the engine's (elements with "person", the world's cast): what each does is <id>_do, where each faces <id>_turn
// (degrees: 0 away from us, 90 to the right, 180 toward us), looks <id>_look, reaches <id>_reach — and where each
// stands their place (<id>_a, <id>_d). The dais is the land under them (relief.js).
const P = (id) => scene.person(id);
const L = scene.lib;
const N = L.N;
// (degrees: the way from one place to another)
const toward = ([a, d], [a2, d2]) => (Math.atan2(a2 - a, d2 - d) * 180) / Math.PI;

// where things are: the inspector's chair on the dais (his hips over its seat, facing us) and his hands on the table
// before him; the father, apart; David, before the table; the door in the back wall right of the dais (inside it, and
// out beyond it, in the yard); before the dais, the way across the hall; the oil burning on the floor
const SEAT = [0.1, 6.2],
  ON_TABLE = { r: [-0.14, 5.9, 1.15], l: [0.34, 5.9, 1.15] },
  LEANING = { r: [-0.34, 5.75, 1.15], l: [0.54, 5.75, 1.15] },
  FATHER = [-1.75, 4.3],
  DAVID = [0.55, 3.5],
  DOOR_IN = [2.5, 7.1],
  DOOR_OUT = [2.5, 8.6],
  ACROSS = 4.75,
  SPILL = [L.AT.spill[0], L.AT.spill[1], 0.2];
// the six men of the community, in the order they come in (men: how many are in the hall): each where he is — on a
// bench along the wall (seated), or standing by it — what he does there, and on which side of the hall
const MEN = [
  { at: [-3.6, 5.25], turn: 90, does: "bench_sit", seat: true },
  { at: [3.0, 5.05], turn: 270, does: "bench_sit", seat: true },
  { at: [-4.05, 5.85], turn: 80, does: "arms_folded" },
  { at: [3.5, 5.45], turn: 262, does: "hands_behind" },
  { at: [-2.85, 5.75], turn: 95, does: "staff_lean" },
  { at: [2.35, 5.55], turn: 265, does: "arms_folded" },
].map((m, n) => ({ ...m, id: `man_${n}`, n, left: m.at[0] < 0 }));

// the way from the door to a place in the hall, and from a place to the door: by the right wall straight there; to the
// left, along the hall before the dais
const fromDoor = (to) => (to[0] > 1.8 ? [DOOR_IN, to] : [DOOR_IN, [2.0, ACROSS], [Math.max(to[0], -2.3), ACROSS], to]);
const toDoor = ([a, d]) => (a > 1.8 ? [DOOR_IN, DOOR_OUT] : [[a, Math.min(d, ACROSS)], [2.0, ACROSS], DOOR_IN, DOOR_OUT]);
// someone walks along points at a pace, and then (at the end) does what is asked
const walk = (id, pts, speed, then) => {
  const s = P(id).walk(pts, { speed });
  if (then) scene.after(s, then);
  return s;
};

// The men come in one by one by the door (men: how many are in the hall), each to his place — and sit down on the bench,
// or stand — watching David. Those in the hall as the scene opens are there already.
const inside = new Set(),
  gone = new Set();
for (const m of MEN) {
  if ((+scene.get("men") || 0) > m.n) inside.add(m.n);
  else scene.set(`${m.id}_here`, false);
}
function comeIn(m) {
  inside.add(m.n);
  scene.set(`${m.id}_a`, DOOR_OUT[0]);
  scene.set(`${m.id}_d`, DOOR_OUT[1]);
  scene.set(`${m.id}_do`, "stand");
  scene.set(`${m.id}_look`, null);
  scene.set(`${m.id}_here`, true);
  const sit = () => {
    const s = P(m.id).go("bench_down", { to: m.at, turn: m.turn, speed: 1.2 });
    scene.after(s + 2.9, () => P(m.id).do(m.does, { loop: true }));
  };
  const arrive = () => {
    if (m.seat) return sit();
    P(m.id).turn(m.turn, 0.6);
    P(m.id).do(m.does, { loop: true });
  };
  // (seated: to where sitting down begins, before the bench — go walks him there itself)
  if (m.seat) walk(m.id, fromDoor(m.at).slice(0, -1), 1.2, sit);
  else walk(m.id, fromDoor(m.at), 1.2, arrive);
  scene.after(2.5, () => P(m.id).look("david"));
}

// The inspector rises (inspector_up), his hands on the table, and stands leaning on them over it
let risen = false;
function inspectorUp() {
  if (risen || gone.has("inspector")) return;
  risen = true;
  P("inspector").reach(null);
  P("inspector").go("rise_table", { from: SEAT, turn: 180 });
  scene.after(2.5, () => {
    if (gone.has("inspector")) return;
    P("inspector").do("lean_table", { loop: true });
    P("inspector").reach(LEANING);
  });
}
// The father turns his back on his son (father_turn), the head bowed
let turned = false;
function fatherTurns() {
  if (turned || gone.has("father")) return;
  turned = true;
  const away = toward(FATHER, DAVID) + 180;
  P("father").look(null);
  P("father").go("turn_away", { from: FATHER, turn: away });
  scene.after(3.0, () => !gone.has("father") && P("father").do("arms_folded", { loop: true }));
}
// David slips away in the dark or the smoke (david_present → 0): off to the left, out of the hall
let fled = false;
function davidFlees() {
  if (fled) return;
  fled = true;
  P("david").look(null);
  P("david").gait("run");
  walk("david", [[-0.6, 2.7], [-3.6, 1.5]], 3.0, () => P("david").here(false));
}

// Everyone but David goes out by the door (rush: the father first, the inspector, the men one after another): up from
// the bench or the chair if sitting, and out to the yard
const LEAVE = [
  { id: "father", lag: 0 },
  { id: "inspector", lag: 0.05 },
  ...MEN.map((m) => ({ id: m.id, lag: 0.08 + m.n * 0.05, m })),
];
function leave({ id, m }) {
  gone.add(id);
  P(id).look(null);
  P(id).reach(null);
  const out = (at) => walk(id, toDoor(at), 1.6, () => P(id).here(false));
  const here = () => [+scene.get(`${id}_a`), +scene.get(`${id}_d`)];
  if (id === "inspector") {
    const by = [1.3, 6.65];
    if (!risen) {
      P(id).go("rise_table", { from: SEAT, turn: 180 });
      scene.after(2.5, () => walk(id, [by, [1.95, 6.95], DOOR_IN, DOOR_OUT], 1.4, () => P(id).here(false)));
    } else walk(id, [by, [1.95, 6.95], DOOR_IN, DOOR_OUT], 1.4, () => P(id).here(false));
    return;
  }
  if (m?.seat && inside.has(m.n)) {
    P(id).go("bench_rise", { from: m.at, turn: m.turn });
    scene.after(2.6, () => out(here()));
    return;
  }
  out(here());
}

// what the game sets, as it goes (its values move over seconds: looked at as they move)
scene.every(0.1, () => {
  const men = +scene.get("men") || 0,
    rush = N(scene.get("rush"));
  for (const m of MEN) if (men > m.n && !inside.has(m.n) && rush < 0.01) comeIn(m);
  for (const who of LEAVE) if (rush > who.lag + 0.01 && !gone.has(who.id) && (!who.m || inside.has(who.m.n))) leave(who);
  if (N(scene.get("inspector_up")) > 0.3) inspectorUp();
  if (N(scene.get("father_turn")) > 0.3) fatherTurns();
  if (N(scene.get("david_present")) < 0.7 && scene.get("david_here") !== false) davidFlees();
});
// David turns his head to his father (david_look), and back to the table
scene.on("change", "david_look", (v) => !fled && P("david").look(N(v) > 0.5 ? "father" : "inspector"));
// the lamp knocked down, the oil on fire (spill): they all look at the fire on the floor
scene.on("change", "spill", (v) => {
  if (!(N(v) > 0.2)) return;
  scene.after(0.6, () => {
    for (const id of ["inspector", "father", ...MEN.map((m) => m.id)]) if (!gone.has(id)) P(id).look(SPILL);
  });
});
// the barn burning outside (fire_outside): the hall turns to the windows and the door
scene.on("change", "fire_outside", (v) => {
  if (!(N(v) > 0.2)) return;
  scene.after(1.5, () => {
    for (const id of ["inspector", "father", ...MEN.map((m) => m.id)]) if (!gone.has(id)) P(id).look([DOOR_IN[0], 7.5, 1.6]);
  });
});
// the inspector and the father not in the hall (the game's inspector_present, father_present)
for (const id of ["inspector", "father"]) {
  const key = `${id}_present`;
  scene.on("change", key, (v) => P(id).here(!!v));
  if (scene.get(key) === false) P(id).here(false);
}
