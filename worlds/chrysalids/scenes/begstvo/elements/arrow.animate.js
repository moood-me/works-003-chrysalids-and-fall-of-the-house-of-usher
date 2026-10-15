// from her bow hand to the front searcher's chest (or a metre over his head: arrow_high), as `arrow` goes 0 → 1
const s = e.state, u = e.anim.clamp(s.arrow ?? 0, 0, 1), L = e.layer('arrow');
if (u <= 0 || u >= 1) { L.alpha = 0; return; }
const a = e.point('rosalind#hand_l'), b = e.point(s.arrow_high ? 'searcher#head' : 'searcher#chest');
if (!a || !b) { L.alpha = 0; return; }
const to = [b[0], b[1] - (s.arrow_high ? 1.0 : 0)];
L.x = a[0] + (to[0] - a[0]) * u;
L.y = a[1] + (to[1] - a[1]) * u - 0.4 * Math.sin(Math.PI * u);
L.rotate = Math.atan2(to[1] - a[1], to[0] - a[0]);
L.alpha = 1;
