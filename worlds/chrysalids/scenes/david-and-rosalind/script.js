// David and Rosalind — its mechanics: `glance` — David's eyes going to Rosalind (0 away — on the church, 1 on her), hers
// to him with them; `someone_watching` — the old woman at the well turns her head from the men to David; `crowd` → 0 —
// the townsfolk walk off to the edges, Rosalind's parents lead her away, the second horse is led off.
const s = scene, L = s.lib, P = id => s.person(id);
const mix = (a, b, u) => a.map((v, i) => v + (b[i] - v) * u);
const AWAY_D = [-8, 44, 3.5], AWAY_R = [10, 30, 1.6];
function glance() {
  const u = Math.max(0, Math.min(1, +s.get('glance') || 0));
  P('david').look(mix(AWAY_D, L.ROS, u));
  P('rosalind').look(mix(AWAY_R, L.DAVID, u));
}
s.on('change', 'glance', glance);
s.on('move', 'glance', glance);
glance();
function watching() {
  const u = Math.max(0, Math.min(1, +s.get('someone_watching') || 0));
  P('old_woman').look(u > 0.5 ? 'david' : 'man_a');
}
s.on('change', 'someone_watching', watching);
s.on('move', 'someone_watching', watching);
watching();
let gone = false;
function crowd() {
  if (gone || (+s.get('crowd') || 0) > 0.5) return;
  gone = true;
  for (const [id, , to] of L.FOLK) s.sequence(async q => { await q.wait(q.random() * 1.5); await q.person(id).walk([to]); q.person(id).here(false); }, { name: id });
  for (const id of ['r_mother', 'r_father', 'rosalind']) s.sequence(async q => { await q.wait(id === 'rosalind' ? 0.8 : 0.3); await q.person(id).walk([[14, 18], [24, 24]]); q.person(id).here(false); }, { name: id });
  s.path(['h2_a', 'h2_d', 'h2_face'], [[22.5, 30.5, 90], [30, 34, 90], [44, 40, 90]], { speed: 1.6, ease: 'linear' });
}
s.on('change', 'crowd', crowd);
s.on('move', 'crowd', crowd);
if ((+s.get('crowd') || 0) <= 0.5) { gone = true; for (const [id] of L.FOLK) P(id).here(false); for (const id of ['r_mother', 'r_father', 'rosalind']) P(id).here(false); }
