// slowly across from left to right, rising and falling a little; the wings beating (scaleY), each its own
const A = e.aspect, d = e.anim.clamp(e.state.dusk ?? 0.5, 0, 1);
for (let i = 0; i < 5; i++) {
  const L = e.layer('b' + i), ph = e.anim.hash(i, 3) * 6;
  L.x = ((e.anim.hash(i, 7) * 1.4 + e.t * 0.0035) % 1.4) * (A + 0.6) / 1.4 - 0.3 + 0.01 * Math.sin(e.t * 0.2 + ph);
  L.y = 0.01 * Math.sin(e.t * 0.13 + ph);
  L.scaleY = 0.4 + 0.6 * Math.abs(Math.sin(e.t * 2.2 + ph * 3));
  L.alpha = 1 - 0.7 * d;
}
