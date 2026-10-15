const R = e.state.rain ?? 0.5;
const n = Math.round(R * 240);
g.strokeStyle = "#d3d6d0";
g.lineCap = "round";
for (let i = 0; i < n; i++) {
  const x0 = -4 + e.rnd() * 8,
    ph = e.rnd(),
    sp = 0.35 + e.rnd() * 0.25,
    L = 0.12 + e.rnd() * 0.18;
  const k = (e.t * sp + ph) % 1;
  const y = -3.4 + k * 4.2;
  const x = x0 - k * 0.6;
  g.globalAlpha = (0.06 + e.rnd() * 0.08) * Math.min(1, R * 2);
  g.lineWidth = e.px * (0.8 + e.rnd() * 0.6);
  g.beginPath();
  g.moveTo(x, y);
  g.lineTo(x - L * 0.15, y + L);
  g.stroke();
}
g.globalAlpha = 1;
