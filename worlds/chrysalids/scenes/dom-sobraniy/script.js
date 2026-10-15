// The trial in the meeting house (notes.md). The game sets the hall's keys — men, inspector_up, father_away,
// david_present, lamp, spill, fire_outside, door, rush (and David's look, david_look: his own key) — and this script
// turns them into what its people do. The dais is the land under them (relief.js).
const s = scene, L = s.lib, N = L.N;
const toward = ([a, d], [a2, d2]) => (Math.atan2(a2 - a, d2 - d) * 180) / Math.PI;
// the inspector's chair on the dais (his hips over its seat, facing us), his hands on the table, leaning on it; the
// father, apart; David, before the table; the door in the back wall right of the dais (inside it, and out beyond it);
// before the dais, the way across the hall; the oil burning on the floor
const SEAT = [0.1, 6.2],
  LEANING = { r: [-0.34, 5.75, 1.15], l: [0.54, 5.75, 1.15] },
  FATHER = [-1.75, 4.3],
  DAVID = [0.55, 3.5],
  DOOR_IN = [2.5, 7.1],
  DOOR_OUT = [2.5, 8.6],
  ACROSS = 4.75,
  SPILL = [L.AT.spill[0], L.AT.spill[1], 0.2],
  WINDOW = [L.AT.door, 7.5, 1.6];
// the six men of the community, in the order they come in (men: how many are in the hall): where each goes, what he
// does there (seated on a bench along the wall, or standing by it)
const MEN = [
  { at: [-3.6, 5.25], turn: 90, does: 'bench_sit', seat: true },
  { at: [3.0, 5.05], turn: 270, does: 'bench_sit', seat: true },
  { at: [-4.05, 5.85], turn: 80, does: 'arms_folded' },
  { at: [3.5, 5.45], turn: 262, does: 'hands_behind' },
  { at: [-2.85, 5.75], turn: 95, does: 'staff_lean' },
  { at: [2.35, 5.55], turn: 265, does: 'arms_folded' },
].map((m, n) => ({ ...m, id: `man_${n}`, n }));
// from the door to a place: by the right wall straight there; to the left, along the hall before the dais — and back
const fromDoor = to => (to[0] > 1.8 ? [DOOR_IN, to] : [DOOR_IN, [2.0, ACROSS], [Math.max(to[0], -2.3), ACROSS], to]);
const toDoor = ([a, d]) => (a > 1.8 ? [DOOR_IN, DOOR_OUT] : [[a, Math.min(d, ACROSS)], [2.0, ACROSS], DOOR_IN, DOOR_OUT]);
const here = id => [+s.get(`${id}_a`), +s.get(`${id}_d`)];

// the men in the hall as the scene opens are at their places already; the others are not here yet
const inside = new Set(), gone = new Set();
for (const m of MEN) {
  if ((+s.get('men') || 0) > m.n) inside.add(m.n);
  else s.person(m.id).here(false);
}
// a man comes in by the door to his place — sits down on the bench, or stands — and watches David
function comeIn(m) {
  inside.add(m.n);
  s.sequence(async q => {
    const p = q.person(m.id);
    q.set(`${m.id}_a`, DOOR_OUT[0]);
    q.set(`${m.id}_d`, DOOR_OUT[1]);
    p.look(null);
    p.here(true);
    if (m.seat) {
      await p.walk(fromDoor(m.at).slice(0, -1));
      p.look('david');
      await p.go('bench_down', { to: m.at, turn: m.turn });
    } else {
      await p.walk(fromDoor(m.at));
      await p.turn(m.turn);
      p.look('david');
    }
    p.do(m.does, { loop: true });
  }, { name: m.id });
}
// the inspector rises (inspector_up), his hands on the table, and stands leaning on them over it
let risen = false;
function inspectorUp() {
  if (risen || gone.has('inspector')) return;
  risen = true;
  s.sequence(async q => {
    const p = q.person('inspector');
    p.reach(null);
    await p.go('rise_table', { from: SEAT, turn: 180 });
    p.do('lean_table', { loop: true });
    p.reach(LEANING);
  }, { name: 'inspector' });
}
// the father turns his back on his son (father_away), the head bowed
let turned = false;
function fatherTurns() {
  if (turned || gone.has('father')) return;
  turned = true;
  s.sequence(async q => {
    const p = q.person('father');
    p.look(null);
    await p.go('turn_away', { from: FATHER, turn: toward(FATHER, DAVID) + 180 });
    p.do('arms_folded', { loop: true });
  }, { name: 'father' });
}
// David slips away in the dark or the smoke (david_present → 0): off to the left, out of the hall
let fled = false;
function davidFlees() {
  if (fled) return;
  fled = true;
  s.sequence(async q => {
    const p = q.person('david');
    p.look(null);
    p.gait('run');
    await p.walk([[-0.6, 2.7], [-3.6, 1.5]]);
    p.here(false);
  }, { name: 'david' });
}
// everyone but David goes out by the door (rush: the father first, the inspector, the men one after another): up from
// the bench or the chair if sitting, and out to the yard
const LEAVE = [{ id: 'father', lag: 0 }, { id: 'inspector', lag: 0.05 }, ...MEN.map(m => ({ id: m.id, lag: 0.08 + m.n * 0.05, m }))];
function leave({ id, m }) {
  gone.add(id);
  s.sequence(async q => {
    const p = q.person(id);
    p.look(null);
    p.reach(null);
    if (id === 'inspector') {
      if (!risen) await p.go('rise_table', { from: SEAT, turn: 180 });
      await p.walk([[1.3, 6.65], [1.95, 6.95], DOOR_IN, DOOR_OUT]);
    } else {
      if (m?.seat) await p.go('bench_rise', { from: m.at, turn: m.turn });
      await p.walk(toDoor(here(id)));
    }
    p.here(false);
  }, { name: id });
}
// what the game sets, as it moves
function check() {
  const men = +s.get('men') || 0, rush = N(s.get('rush'));
  for (const m of MEN) if (men > m.n && !inside.has(m.n) && rush < 0.01) comeIn(m);
  for (const who of LEAVE) if (rush > who.lag + 0.01 && !gone.has(who.id) && (!who.m || inside.has(who.m.n))) leave(who);
  if (N(s.get('inspector_up')) > 0.3) inspectorUp();
  if (N(s.get('father_away')) > 0.3) fatherTurns();
  if (N(s.get('david_present')) < 0.7) davidFlees();
}
// gone already as the scene opens: not here
if (N(s.get('david_present')) < 0.7) { fled = true; s.person('david').here(false); }
for (const k of ['men', 'rush', 'inspector_up', 'father_away', 'david_present']) {
  s.on('change', k, check);
  s.on('move', k, check);
}
check();
// the lamp knocked down, the oil on fire (spill): they all look at the fire on the floor
s.on('change', 'spill', v => {
  if (!(N(v) > 0.2)) return;
  s.after(0.6, () => { for (const id of ['inspector', 'father', ...MEN.map(m => m.id)]) if (!gone.has(id)) s.person(id).look(SPILL); });
});
// the barn burning outside (fire_outside): the hall turns to the windows and the door
s.on('change', 'fire_outside', v => {
  if (!(N(v) > 0.2)) return;
  s.after(1.5, () => { for (const id of ['inspector', 'father', ...MEN.map(m => m.id)]) if (!gone.has(id)) s.person(id).look(WINDOW); });
});
// the inspector and the father not in the hall (the game's inspector_present, father_present)
for (const id of ['inspector', 'father']) {
  s.on('change', `${id}_present`, v => s.person(id).here(!!v));
  if (s.get(`${id}_present`) === false) s.person(id).here(false);
}
