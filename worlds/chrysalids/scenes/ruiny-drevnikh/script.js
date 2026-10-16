// The ruins of the Old People — its mechanics: the game's keys turned into what the children do. `glint` — something flashes in the
// grass: David turns to it; `dig` (the game's “Digging”: the earth and the grass over the plate go as it grows, in
// glint.animate.js) — David kneels at the plate and digs, Sophie looks; `bell` — the village bell: both look round to
// the belfry far off, David gets up; `children` → 0 — they run home (off to the left).
const s = scene, L = s.lib, P = id => s.person(id);
const N = v => Math.max(0, Math.min(1, +v || 0));
let mode = 'idle';
function glint(v, o) {
  if (v > 0.7 && !(o > 0.7)) s.tell('Something glinted brightly in the grass in the sun.', 'glint');
  if (v > 0.5 && mode === 'idle') { P('david').look('glint#plate'); P('david').turn(150); }
}
s.on('change', 'glint', glint);
function dig() {
  if (N(s.get('dig')) <= 0.01 || mode !== 'idle' || N(s.get('children')) < 0.5) return;
  mode = 'dig';
  s.sequence(async q => {
    const d = q.person('david');
    d.look('glint#plate');
    await d.go('kneel_down', { to: L.DAVID.kneel, turn: L.DAVID.kneelTurn });
    d.do('kneel_work', { loop: true });
    d.reach({ r: 'glint#plate', l: 'glint#plate' });
  }, { name: 'david' });
  P('sophie').look('glint#plate');
}
s.on('change', 'dig', dig);
s.on('move', 'dig', dig);
function bell(v, o) {
  if (!(v > 0.6 && !(o > 0.6))) return;
  s.tell('From far off, beyond the hills, came the bell — the children turned towards home.', 'david');
  if (mode === 'gone') return;
  for (const id of ['david', 'sophie']) P(id).look('far_hills#belfry');
  if (mode === 'dig') {
    mode = 'up';
    s.sequence(async q => {
      const d = q.person('david');
      d.reach(null);
      await d.do('stand_from_kneel');
      d.do('stand', { loop: true });
      d.look('far_hills#belfry');
    }, { name: 'david' });
  }
}
s.on('change', 'bell', bell);
function home() {
  if (N(s.get('children')) >= 0.5 || mode === 'gone') return;
  mode = 'gone';
  for (const id of ['david', 'sophie']) s.sequence(async q => {
    const p = q.person(id);
    p.reach(null);
    p.look(null);
    // (Sophie a moment later and a little apart — two children running, not one shape)
    if (id === 'sophie') await q.wait(0.9);
    p.gait('run');
    await p.walk(id === 'sophie' ? L.HOME.map(([a, d]) => [a + 0.2, d + 1.4]) : L.HOME);
    p.here(false);
  }, { name: id });
}
s.on('change', 'children', home);
s.on('move', 'children', home);
// as the scene opens: gone already, or digging already
if (N(s.get('children')) < 0.5) { mode = 'gone'; for (const id of ['david', 'sophie']) P(id).here(false); }
else dig();
