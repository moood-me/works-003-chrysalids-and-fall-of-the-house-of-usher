// the water lapping at the stones: each little wave coming and going in its own time, edging back and forth
const t = e.t;
for (let i = 0; i < 6; i++) {
  const L = e.layer(`lap${i}`);
  L.alpha = 0.25 + 0.25 * Math.sin(t * 1.7 + i * 2);
  L.x = 0.015 * Math.sin(t + i);
}
