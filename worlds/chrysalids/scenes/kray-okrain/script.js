// Край Окраин — its mechanics, all of them the game's keys turned into what happens: the father with his lantern in the
// field (lantern_in_field), its beam going over the field by itself (lantern_turn, moved every few seconds); the fugitives (david first, rosalind behind) walking the path while `walkers` is up and standing still when
// it is down («По тени»: held — they go, let go — they freeze); where they are on it (walk_u 0…1), whether they are in a
// tree's shadow (walk_shade) and how much the beam is on them (walk_lit) — set every frame they move, and every tenth of a
// second; at the end (figure_on_path) on into the wood.
const s = scene, L = s.lib, P = id => s.person(id);
// the father: there with his lantern while lantern_in_field; its beam a light where lantern_turn has it
function father() {
  const on = (s.get('lantern_in_field') || 0) > 0.05;
  P('joseph').here(on);
  P('joseph').with(['lantern']);
  beam();
}
function beam() {
  const [a, d] = L.beamAt(s.get('lantern_turn') ?? 150);
  s.set('beam_a', a);
  s.set('beam_d', d);
  P('joseph').reach((s.get('lantern_in_field') || 0) > 0.05 ? { r: [L.FATHER[0] + 0.5 * Math.sin((s.get('lantern_turn') ?? 150) * Math.PI / 180), L.FATHER[1] + 0.5 * Math.cos((s.get('lantern_turn') ?? 150) * Math.PI / 180), 1.4] } : null);
  P('joseph').look([a, d, 0]);
}
s.on('change', 'lantern_in_field', father);
s.on('move', 'lantern_in_field', father);
s.on('change', 'lantern_turn', beam);
s.on('move', 'lantern_turn', beam);
father();
// the beam goes over the field by itself while he is there: to a new place every few seconds, slowly
s.every(6.5, () => {
  if ((s.get('lantern_in_field') || 0) < 0.5) return;
  const to = 95 + s.random() * 110;
  s.move('lantern_turn', to, { over: 3.5 + s.random() * 1.5, ease: 'inOut' });
});
// the fugitives on the path: going while `walkers`, standing while not
let going = [];
function walkers() {
  const on = !!s.get('walkers');
  for (const g of going) g.cancel();
  going = [];
  if (!on) { P('david').do('stand'); P('rosalind').do('stand'); return; }
  const d0 = s.get('david_d') ?? L.START_D, r0 = s.get('rosalind_d') ?? L.START_D - 1, end = (s.get('figure_on_path') || 0) > 0.5 ? L.BEYOND_D : L.END_D;
  if (d0 >= end - 0.05) return;
  s.set('david_steps', true);
  s.set('rosalind_steps', true);
  going = [P('david').walk(L.WAY(Math.ceil(d0 + 0.01), end)), P('rosalind').walk(L.WAY(Math.ceil(r0 + 0.01), end - 1.2))];
}
s.on('change', 'walkers', walkers);
// on into the wood once it is over (figure_on_path): they walk on whatever `walkers` says
s.on('change', 'figure_on_path', v => { if (v > 0.5) { s.set('walkers', 1); walkers(); } });
// where they are: along the path, in a shadow, in the beam
function where() {
  const d = s.get('david_d') ?? L.START_D, a = s.get('david_a') ?? L.PATH(L.START_D);
  s.set('walk_u', L.clamp((d - L.START_D) / (L.END_D - L.START_D), 0, 1));
  s.set('walk_shade', L.shaded(a, d) ? 1 : 0);
  const [ba, bd] = L.beamAt(s.get('lantern_turn') ?? 150), lit = L.clamp(1 - Math.hypot(a - ba, d - bd) / 3.2, 0, 1);
  s.set('walk_lit', (s.get('lantern_in_field') || 0) > 0.5 ? lit : 0);
}
s.on('move', 'david_d', where);
s.every(0.1, where);
where();
