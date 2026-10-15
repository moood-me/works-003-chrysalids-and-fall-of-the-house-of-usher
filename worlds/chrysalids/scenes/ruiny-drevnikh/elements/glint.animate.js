// the sod over the plate going as `dig` grows (the earth first, the grass after); the plate there unless taken
// (`glint` 0); the flash wavering as bright as `glint`
const A = e.anim, S = e.state, dig = A.clamp(S.dig ?? 0, 0, 1), gl = A.clamp(S.glint ?? 0.3, 0, 1);
e.layer('earth').alpha = 1 - A.ease.smooth(A.span(dig, 0, 0.7));
e.layer('grass').alpha = 1 - A.ease.smooth(A.span(dig, 0.3, 1));
e.layer('plate').alpha = gl > 0.05 ? 1 : 0;
const p = 0.6 + 0.25 * Math.sin(e.t * 1.3) + 0.15 * Math.sin(e.t * 3.7 + 1);
const Sp = e.layer('spark');
Sp.alpha = gl * p;
Sp.scale = 0.4 + 0.6 * gl;
e.glow('spark', gl * p);
