// Uncle Axel’s forge — its mechanics: the film in beats for the game (lib.js FILM, the world's module beats: `beat` names
// one), and what goes on by itself while a key says so — and what a game drives (“The bellows’ rhythm”: ax_blow, pump; the
// lantern: st_lamp, st_lx, st_lz).
const s = scene, P = id => s.person(id), L = s.lib;
s.kit.beats.play(s, L.FILM);
// the smith's blow (smith_strike): the hammer meets the iron this far into it (seconds; the top of the lift at 0.73)
const IMPACT = 1.17;
// his right hand holds the iron on the anvil in the tongs (their jaws on it)
const TONGS_AT = [L.ANVIL[0] + 0.3, L.ANVIL[1] + 0.04, L.ANVIL[2] + 0.1];
// A blow of the hammer: up and down onto the iron — begun `lead` seconds before it lands (as much of the lift as there
// is time for); as it lands the sparks fly off the iron (ax_spark: one burst each time it goes up) and the scene tells
// 'ax:hit'
let blows = 0;
function blow(lead) {
  if ((s.get('axel_with') || []).includes('tongs')) P('axel').reach({ r: TONGS_AT });
  const me = ++blows;
  P('axel').do('smith_strike', { loop: false, from: Math.max(0, IMPACT - lead) });
  s.after(Math.min(lead, IMPACT), () => {
    if (me !== blows) return;
    s.set('ax_spark', (s.get('ax_spark') || 0) + 1);
    s.tell('ax:hit');
  });
}
// the game's: ax_blow — each change, one blow from the lift (it lands IMPACT seconds later: the game calls it so that the
// blow falls on its beat)
s.on('change', 'ax_blow', () => blow(IMPACT));
// what keeps on by itself while its key is up: ax_work 1 — Axel at work, a blow every ax_pace seconds; dv_chat N — David
// chattering, a thought out every N seconds and its answer 3.2 s after; pump_work N — the lever pulled every N seconds
function keep(key, first, each) {
  let gen = 0;
  s.on('change', key, v => {
    const me = ++gen;
    if (!(v > 0)) return;
    let n = 0;
    const go = () => { if (me === gen && s.get(key) > 0) s.after(each(n++, s.get(key)), go); };
    s.after(first, go);
  });
}
keep('ax_work', 0, () => { const per = s.get('ax_pace') || 2; blow(per); return per; });
keep('dv_chat', 1.4, (n, every) => {
  const me = s.get('dv_chat');
  s.sequence(async q => {
    await q.path(['tho_a', 'tho_e', 'tho_d'], [L.HEAD, L.WIN], { over: 2.6, ease: 'in' });
    await q.wait(0.6);
    if (q.state.dv_chat !== me) return;
    await q.path(['thi_a', 'thi_e', 'thi_d'], [L.WIN, L.HEAD], { over: 2.6, ease: 'out' });
    q.set('thi_d', L.HEAD[2]);
    await q.move('dv_glow', 1, { over: 0.3 });
    if (n === 0 && every < 10) P('david').do('perch_laugh');
    await q.wait(0.3);
    q.move('dv_glow', 0, { over: 1.4 });
    await q.wait(2.0);
    if (q.state.dv_chat > 0 && n === 0 && every < 10) P('david').do('perch_talk', { loop: true });
  }, { name: 'chat' });
  return every;
});
keep('pump_work', 0, () => { press(); return s.get('pump_work'); });
// one pull of the bellows' lever: the board goes down, the fire breathes up, then it rises again
function press() {
  const f = s.get('fire');
  s.move('pump', 1, { over: 0.3, ease: 'inOut' });
  s.move('fire', Math.min(1, f + 0.2), { over: 0.25 });
  s.move('sparks', 0.9, { over: 0.25 });
  s.after(0.35, () => {
    s.move('pump', 0, { over: 0.9, ease: 'inOut' });
    s.move('fire', f, { over: 1.1 });
    s.move('sparks', 0.5, { over: 1.2 });
  });
}
// David at the bellows (dv_pump 1): his hands on the lever's handle (pump#handle), wherever it is; each time it goes down
// (a pull — the scene's or a game's), he pulls it down with his body, then stands holding it
let pulls = 0;
const atLever = () => P('david').reach((s.get('dv_pump') || 0) > 0.5 ? { r: 'pump#handle', l: 'pump#handle' } : null);
s.on('change', 'dv_pump', atLever);
s.on('change', 'pump', (v, was) => {
  if (!((s.get('dv_pump') || 0) > 0.5) || !(v > 0.5) || was > 0.5) return;
  const me = ++pulls;
  P('david').do('pull_lever');
  s.after(1.4, () => { if (me === pulls && (s.get('dv_pump') || 0) > 0.5) P('david').do('stand'); });
});
// the man with the lantern (st_who: joseph | farmhand): in the yard while st_on, its light his while it is in his hand
// (st_drop: it has fallen); his look at st_lx/st_lz (where on the floor), the lantern up by st_lamp (1 — up, toward where
// he looks; above 1 — higher, on the boy: his look and the light on David, wherever he is — dv_a/dv_d)
const MEN = ['joseph', 'farmhand'];
function man() {
  const who = s.get('st_who') || 'joseph', on = (s.get('st_on') || 0) > 0.01, dropped = (s.get('st_drop') || 0) > 0.5;
  for (const m of MEN) {
    P(m).here(on && m === who);
    P(m).with(m === who && dropped ? null : ['lantern']);
    s.set(`${m}_lamp`, m === who && dropped ? 0 : 1);
  }
  lamp();
}
function lamp() {
  const who = s.get('st_who') || 'joseph', a = s.get('st_a'), d = s.get('st_d'), v = s.get('st_lamp') || 0, boy = v > 1.01;
  const lx = boy ? s.get('dv_a') : s.get('st_lx'), lz = boy ? s.get('dv_d') : s.get('st_lz');
  // (raised on him: its beam lies on the boy — st_glare, the light `glare` at him)
  s.set('st_glare', Math.max(0, Math.min(1, (v - 1) / 0.3)));
  const dx = lx - a, dz = lz - d, n = Math.hypot(dx, dz) || 1, up = (s.get('st_drop') || 0) < 0.5 && v > 0.05;
  P(who).reach(up ? { r: [a + 0.38 * dx / n, d + 0.38 * dz / n, 1.3 + 0.38 * Math.min(v, 1.3)] } : null);
  P(who).look([lx, lz, 1.0]);
}
for (const k of ['st_on', 'st_who', 'st_drop']) s.on('change', k, man);
for (const k of ['st_lamp', 'st_lx', 'st_lz']) { s.on('change', k, lamp); s.on('move', k, lamp); }
for (const k of ['st_a', 'st_d']) s.on('move', k, lamp);
// the two called out of the dark (st_more 1: they come; 0: not there): along the yard from the right, a lantern each,
// held up a little as they stop and look in
const WATCH = [[9.5, 3.0, 10.0], [11.5, 1.3, 10.6]];
s.on('change', 'st_more', (v, was) => WATCH.forEach(([x0, x1, d], i) => {
  const id = `watch${i}`, keys = [`w${i}_a`, `w${i}_d`];
  P(id).here(v > 0.005);
  P(id).with(['lantern']);
  if (!(v > 0.005) || was > 0.005) return;
  s.sequence(async q => {
    P(id).reach(null);
    P(id).look(null);
    q.set(`${id}_steps`, true);
    q.set(keys[0], x0);
    q.set(keys[1], d);
    await q.wait(i * 1.2);
    await P(id).walk([[x1, d]]);
    await P(id).turn(200);
    P(id).look([1.0, 5.0, 1.0]);
    P(id).reach({ r: [x1 - 0.25, d - 0.3, 1.45] });
  }, { name: `watch${i}` });
}));
man();
atLever();
