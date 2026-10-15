// Буря и чтение — its mechanics: the beats for the game (lib.js film, the world's module beats: `beat` names one); the
// door and the casements turned as `door` and `window` say (the casements rattling in the wind); Roderick in his chair
// rocking and flinching; the house answering the reading; the narrator listening; the hands reaching; the room shaking;
// lightning now and then in the storm.
const L = scene.lib, anim = scene.anim, N = L.N;
const P = (id) => scene.person(id);
const nameOf = (v) => (typeof v === 'string' ? v : v?.motion ?? null);
const follow = (keys, fn) => {
  for (const key of keys) { scene.on('change', key, fn); scene.on('move', key, fn); }
  fn();
};

scene.kit.beats.play(scene, L.film(scene));

// The door's leaf turned as `door` says (0 shut … 1 wide open into the room). The casements as `window` says (0 shut …
// 1 flung open; its overshoot — the bounce at the end of the swing — swings them a little further), rattling in the wind
// while they are open.
follow(['door'], () => scene.set('door_turn', L.DOOR.shut + (L.DOOR.open - L.DOOR.shut) * Math.min(1.1, Math.max(0, +scene.get('door') || 0))));
function casements(over) {
  const w = Math.min(1.12, Math.max(0, +scene.get('window') || 0)), rattle = N(scene.get('window')) * N(scene.get('wind')) * 4;
  for (const [k, i] of [['l', 0], ['r', 1]]) {
    const [shut, open] = L.CASE[k], at = shut + (open - shut) * w + rattle * anim.noise(scene.time * 3.1 + i, 11 + i);
    if (over) scene.move(`case_${k}`, at, { over, ease: 'linear' });
    else scene.set(`case_${k}`, at);
  }
}
follow(['window'], () => casements(0));
scene.every(0.12, () => { if (N(scene.get('window')) > 0.3) casements(0.12); });

// Roderick in his chair: still, or rocking (`rock`: the game reads it back too) — and flinching
const IN_CHAIR = ['seated', 'rock', 'flinch'];
const inChair = () => IN_CHAIR.includes(nameOf(scene.get('roderick_do')));
const rocking = () => ((+scene.get('rock') || 0) > 0.15 ? 'rock' : 'seated');
scene.on('change', 'rock', () => {
  if (['seated', 'rock'].includes(nameOf(scene.get('roderick_do')))) P('roderick').do(rocking(), { loop: true });
});
// The house answers the reading (the game sets `sound` 1…3): the candle shudders, the crack breathes, grit falls from the
// vault, the room jolts; Roderick flinches in his chair and rocks harder.
scene.on('change', 'sound', (n) => {
  if (!(n > 0)) return;
  scene.sequence(async (s) => {
    s.set('jolt', (+s.state.jolt || 0) + 1);
    s.move('rock', Math.min(1, (+s.state.rock || 0) + 0.25), { over: 1.5 });
    if (inChair()) {
      const flinch = s.person('roderick').do('flinch');
      s.sequence(async (q) => { await flinch; if (inChair()) q.person('roderick').do(rocking(), { loop: true }); });
    }
    await s.move('shudder', 0.55 + 0.15 * n, { over: 0.08, ease: 'out' });
    await s.move('shudder', 0, { over: 1.6, ease: 'out' });
  });
});
// Listening (the game's «Слушать», «Чтение»: `listen`): the narrator turns his head to the floor where the sound comes up,
// the book sinking to his knees; and back.
let ears = null;
scene.on('change', 'listen', (v) => {
  const on = (+v || 0) > 0.3;
  if (on === !!ears) return;
  if (on) {
    ears = { look: scene.get('narrator_look'), reading: nameOf(scene.get('narrator_do')) === 'read_seated' };
    P('narrator').look([L.SPOT[0], L.SPOT[1], 0]);
    if (ears.reading) P('narrator').do('sit_hands', { loop: true });
  } else {
    P('narrator').look(ears.look);
    if (ears.reading) P('narrator').do('read_seated', { loop: true });
    ears = null;
  }
});
// The game's reaching in the room (rod_reach / mad_reach: to the narrator; rod_to_mad / mad_to_rod: to each other): the
// hand out to them.
const reachOf = (toYou, toOther, other) => ((+toOther || 0) > 0.3 ? `${other}#hand_l` : (+toYou || 0) > 0.3 ? 'narrator#chest' : null);
let aimed = null;
scene.on('change', 'rod_reach', aim);
scene.on('change', 'mad_reach', aim);
scene.on('change', 'rod_to_mad', aim);
scene.on('change', 'mad_to_rod', aim);
function aim() {
  const g = (k) => scene.get(k), rod = reachOf(g('rod_reach'), g('rod_to_mad'), 'madeline'), mad = reachOf(g('mad_reach'), g('mad_to_rod'), 'roderick');
  const now = `${rod}|${mad}`;
  if (now === aimed) return;
  aimed = now;
  if (g('roderick_here') && !(g('fallen') > 0.5)) P('roderick').reach(rod && { r: rod });
  if (g('madeline_here') && !(g('fallen') > 0.5)) P('madeline').reach(mad && { l: mad });
}
// The room shakes (quake, and each shudder): the eye jolts about where it is.
let shaking = false;
scene.every(0.07, () => {
  const q = Math.max(+scene.get('quake') || 0, 0.5 * (+scene.get('shudder') || 0));
  if (q < 0.01) {
    if (shaking) { shaking = false; scene.move('camera_x', 0, { over: 0.3 }); scene.move('camera_h', 0, { over: 0.3 }); }
    return;
  }
  shaking = true;
  scene.move('camera_x', 0.035 * q * anim.noise(scene.time * 13, 1), { over: 0.07, ease: 'linear' });
  scene.move('camera_h', 0.025 * q * anim.noise(scene.time * 15, 2), { over: 0.07, ease: 'linear' });
});
// Lightning in the storm now and then: a double flash, every 14…34 s.
function flash() {
  if ((+scene.get('lightning') || 0) > 0.05 || !(scene.get('storm') > 0.5)) return;
  scene.sequence(async (s) => {
    await s.move('lightning', 0.75, { over: 0.12 });
    await s.move('lightning', 0.2, { over: 0.25 });
    await s.wait(0.05);
    await s.move('lightning', 0.55, { over: 0.08 });
    await s.wait(0.1);
    await s.move('lightning', 0, { over: 2.5 });
  }, { name: 'lightning' });
}
(function plan() {
  scene.after(14 + scene.random() * 20, () => { flash(); plan(); });
})();
