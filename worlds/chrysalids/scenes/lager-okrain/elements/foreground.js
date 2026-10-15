g.fillStyle = "#0b0e15";
g.fillRect(-14, -0.02, 28, 0.4);
for (let i = 0; i < 220; i++) {
  const x = -14 + e.rnd() * 28;
  let h = 0.15 + Math.pow(e.rnd(), 2) * 1.1;
  const ph = e.rnd() * 6.28,
    ln = e.rnd();
  const edge = Math.min(1, Math.abs(x - 0.6) / 6);
  h *= 0.3 + 0.9 * edge;
  const lean = (ln - 0.5) * 0.7 + 0.05 * Math.sin(e.t * 0.4 + ph) + 0.025 * Math.sin(e.t * 0.93 + ph);
  g.beginPath();
  g.moveTo(x - 0.035, 0.05);
  g.quadraticCurveTo(x + lean * h * 0.4, -h * 0.6, x + lean * h, -h);
  g.quadraticCurveTo(x + lean * h * 0.4 + 0.015, -h * 0.5, x + 0.035, 0.05);
  g.fill();
}
for (const c of [
  [5.2, 1],
  [-6.5, -1],
  [7.4, 1],
]) {
  const x = c[0];
  for (let k = 0; k < 6; k++) {
    const an = -Math.PI / 2 + (k - 2.5) * 0.38 + 0.04 * Math.sin(e.t * 0.3 + k);
    const Ls = 0.5 + 0.25 * Math.sin(k * 2.1);
    g.beginPath();
    g.ellipse(x + Math.cos(an) * Ls * 0.5, Math.sin(an) * Ls * 0.5, Ls * 0.5, 0.07, an, 0, 7);
    g.fill();
  }
}
for (let i = 0; i < 5; i++) {
  const x = -9 + e.rnd() * 18;
  if (Math.abs(x) < 3) continue;
  const h = 0.6 + e.rnd() * 0.5;
  const ph = e.rnd() * 6;
  const lx = x + 0.1 * Math.sin(e.t * 0.3 + ph);
  g.strokeStyle = "#0b0e15";
  g.lineWidth = 0.02;
  g.beginPath();
  g.moveTo(x, 0);
  g.quadraticCurveTo(x, -h * 0.6, lx, -h);
  g.stroke();
  const b = 0.5 + 0.5 * Math.sin(e.t * 0.45 + ph);
  const tg = g.createRadialGradient(lx, -h, 0, lx, -h, 0.07);
  tg.addColorStop(0, "rgba(196,220,184," + 0.6 * b + ")");
  tg.addColorStop(1, "rgba(196,220,184,0)");
  g.fillStyle = tg;
  g.beginPath();
  g.arc(lx, -h, 0.07, 0, 7);
  g.fill();
  g.fillStyle = "#0b0e15";
}
