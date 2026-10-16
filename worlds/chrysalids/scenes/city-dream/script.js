// The dream of the city — its mechanics: David (from behind, in his nightshirt, barefoot) on the dune looking at the city — or,
// as the game's “Hold the dream” leads them (`gaze`), where his eyes are along the shining fish's way; `boy_present`.
const s = scene, L = s.lib, P = () => s.person('david');
const A = 16 / 9;
function look() {
  const g = s.get('gaze');
  if (g == null) { P().look('city'); return; }
  P().look(L.toWorld(A, L.PATH(A, (Math.max(-1, Math.min(1, +g)) + 1) / 2, +s.get('craft') || 0)));
}
s.on('change', 'gaze', look);
s.on('move', 'gaze', look);
look();
const here = () => P().here(+(s.get('boy_present') ?? 1) > 0.5);
s.on('change', 'boy_present', here);
here();
