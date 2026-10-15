// Падение дома — its mechanics: the beats for the game (lib.js film, the world's module beats: `beat` names one); who
// runs with him; the run (the game's `run` sends the narrator along the causeway at his own pace, the others and the
// camera with him); what the house's fall throws up (the dust, the stones, the spray, the rings, where the causeway is
// going down); the view swimming.
const L = scene.lib, N = L.N, sm = L.sm;
const P = (id) => scene.person(id);
const num = (key, or = 0) => { const v = scene.get(key); return typeof v === 'number' ? v : or; };
const follow = (keys, fn) => {
  for (const key of keys) { scene.on('change', key, fn); scene.on('move', key, fn); }
};

scene.kit.beats.play(scene, L.film(scene));

// who of the two runs with him is the game's (with_madeline, with_roderick): they are here or not
function who() {
  scene.set('madeline_here', !!scene.get('with_madeline'));
  scene.set('roderick_here', !!scene.get('with_roderick'));
}
scene.on('change', 'with_madeline', who);
scene.on('change', 'with_roderick', who);

// The run (running): `run` says where along the causeway he is making for (0 — 60 m before the house, 1 — the shore);
// he runs there at his own pace (the cast's flee), never faster — a game moving `run` faster than he runs has him a
// little behind it, catching up. `run` at where he is (or behind him) stops him: running, he runs out a stride and
// stands. The others and the camera go from where he is; `run_at` — where he is now, in `run`'s units (for the game).
const RUN_OUT = 0.6; // m: a runner told to stop comes to a stand this far on
let aim = null, going = null;
function chase() {
  if (!scene.get('running')) { aim = null; return; }
  const d = L.runAt(num('run')), here = num('nar_d');
  if (aim != null && Math.abs(aim - d) < 0.25) return;
  aim = d;
  if (here - d > 0.05) going = P('narrator').walk([[L.across(d) + 0.05, d]], { gait: 'flee' });
  else if (going && !going.done) going = P('narrator').walk([[L.across(here - RUN_OUT) + 0.05, here - RUN_OUT]], { gait: 'flee' });
}
scene.on('change', 'run', chase);
scene.on('change', 'running', chase);
scene.every(0.25, chase);
const runAt = () => scene.set('run_at', L.runOf(num('nar_d', L.runAt(0))));
follow(['nar_d'], runAt);
function around() {
  if (!scene.get('running')) return;
  const k = L.around(num('nar_d'), num('trip'), !!scene.get('with_madeline'), !!scene.get('with_roderick'));
  for (const key in k) scene.set(key, k[key]);
}
follow(['nar_d', 'trip'], around);
// (their hands: let go by the one stumbling, taken again as they are up)
let held = null;
function hands() {
  if (!scene.get('running')) { held = null; return; }
  const h = L.holding(num('trip'), !!scene.get('with_madeline'), !!scene.get('with_roderick')), now = JSON.stringify(h);
  if (now === held) return;
  held = now;
  for (const key in h) scene.set(key, h[key]);
}
follow(['trip'], hands);
for (const k of ['running', 'with_madeline', 'with_roderick']) scene.on('change', k, () => { around(); hands(); });

// What the fall throws up, as `fall` goes: dust from the fissure, stones falling, spray where the halves go into the
// water, the rings left on it (none in the morning); where the causeway is going down (brk_a, brk_d) and how hard it
// breaks there (breaking: while the fall moves).
function falling() {
  const f = N(scene.get('fall')), d = L.breakAt(f), was = N(scene.was('fall', 0.2));
  scene.set('house_dust', (0.3 + 0.7 * sm(0, 0.5, f)) * (1 - sm(0.8, 0.97, f)));
  scene.set('stones', sm(0.12, 0.4, f) * (1 - sm(0.7, 0.88, f)));
  scene.set('spray', sm(0.38, 0.6, f) * (1 - sm(0.9, 1, f)));
  scene.set('rings', sm(0.6, 0.95, f) * (1 - N(scene.get('morning'))));
  scene.set('brk_d', d);
  scene.set('brk_a', L.across(d));
  scene.set('breaking', f > 0.01 && f < 0.999 ? Math.min(1, Math.max(0, (f - was) / 0.2) * 40) : 0);
}
follow(['fall', 'morning'], falling);
// (the break settles once the fall stops)
scene.every(0.3, () => { if (num('breaking') > 0 && N(scene.get('fall')) === N(scene.was('fall', 0.3))) scene.move('breaking', 0, { over: 0.6 }); });

scene.on('load', () => { who(); around(); hands(); falling(); chase(); runAt(); });

// The view swims (swim 0…1): the gaze drifting up and down, the eye rising and sinking, unsteadily.
scene.every(0.9, () => {
  const w = num('swim');
  if (w > 0 || num('camera_h')) {
    scene.move('camera_look', 0.05 * w * scene.anim.noise(scene.time * 0.7, 3), { over: 0.9, ease: 'inOut' });
    scene.move('camera_h', 0.5 * w * scene.anim.noise(scene.time * 0.5, 7), { over: 0.9, ease: 'inOut' });
  }
});
