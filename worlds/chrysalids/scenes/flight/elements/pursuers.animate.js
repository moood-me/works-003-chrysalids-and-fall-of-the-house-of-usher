// as many lanterns as the pursuit has (pursuers 0…1), each trembling and bobbing in its own time
const p = e.anim.clamp(e.state.pursuers ?? 0.25, 0, 1), N = 3 + 11 * p;
for (let j = 0; j < 14; j++) {
  const on = e.anim.clamp(N - j, 0, 1), f = 0.75 + 0.25 * Math.sin(e.t * 2.1 + j * 2.1) * Math.sin(e.t * 0.9 + j), L = e.layer(`l${j}`);
  L.alpha = on * f;
  L.y = 1.2 * Math.sin(e.t * 1.3 + j * 1.7);
  e.glow(`l${j}`, on * f * (0.6 + 0.4 * p));
}
