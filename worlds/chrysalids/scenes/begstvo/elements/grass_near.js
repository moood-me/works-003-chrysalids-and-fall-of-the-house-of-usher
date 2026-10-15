const S = e.state || {};
const d = S.dawn ?? 0.3;
const cols = ["#0a101c", "#0f1727", "#152038"];
for (let i = 0; i < 150; i++) {
  const cx = -14 + e.rnd() * 28;
  const cy = -0.1 + e.rnd() * 0.6;
  const n = 6 + Math.floor(e.rnd() * 14);
  const H = (0.2 + e.rnd() * 0.6) * (0.6 + 0.8 * Math.max(0, cy));
  const ph = e.rnd() * 6.28;
  g.fillStyle = cols[Math.floor(e.rnd() * 3)];
  for (let k = 0; k < n; k++) {
    const x = cx + (e.rnd() - 0.5) * 0.6;
    const h = H * (0.4 + 0.6 * e.rnd());
    const l =
      (x - cx) * 0.8 +
      (e.rnd() - 0.5) * 0.3 +
      0.07 * Math.sin(e.t * 0.42 + ph + k * 0.3) +
      0.03 * Math.sin(e.t * 1.13 + ph);
    g.beginPath();
    g.moveTo(x - 0.012, cy + 0.05);
    g.quadraticCurveTo(x + l * h * 0.4, cy - h * 0.6, x + l * h, cy - h);
    g.quadraticCurveTo(x + l * h * 0.4 + 0.006, cy - h * 0.5, x + 0.012, cy + 0.05);
    g.fill();
    if (e.rnd() < 0.07) {
      g.beginPath();
      g.ellipse(x + l * h, cy - h - 0.03, 0.014, 0.045, l, 0, 7);
      g.fill();
    }
  }
  const hl = e.rnd();
  if (hl < 0.6) {
    g.strokeStyle = "rgba(150,160,180," + (0.08 + 0.12 * d) * (0.5 + hl) + ")";
    g.lineWidth = 0.006;
    const x = cx + 0.1,
      h = H * 0.9;
    const l = 0.1 + 0.07 * Math.sin(e.t * 0.42 + ph);
    g.beginPath();
    g.moveTo(x, cy);
    g.quadraticCurveTo(x + l * h * 0.4, cy - h * 0.6, x + l * h, cy - h);
    g.stroke();
  }
}
