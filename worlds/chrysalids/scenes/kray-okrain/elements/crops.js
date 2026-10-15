const px = -0.1;
function side(x0, x1, col, hs, seed) {
  g.fillStyle = col;
  for (let x = x0; x < x1; x += 0.035) {
    const n = 0.5 + 0.5 * Math.sin(x * 2.1 + seed) * Math.sin(x * 0.7 + seed * 2);
    const dg = Math.min(1, Math.abs(x - px) / 1.0);
    const h = (0.22 + 0.4 * n + 0.12 * e.rnd()) * hs * (0.4 + 0.6 * dg);
    const ph = e.rnd() * 6.28;
    const l = (e.rnd() - 0.5) * 0.25 + 0.05 * Math.sin(e.t * 0.45 + x * 0.6) + 0.025 * Math.sin(e.t * 1.07 + ph);
    const w = 0.018 + e.rnd() * 0.02;
    g.beginPath();
    g.moveTo(x - w, 0.05);
    g.quadraticCurveTo(x - w * 0.3 + l * h * 0.3, -h * 0.6, x + l * h, -h);
    g.quadraticCurveTo(x + w * 0.3 + l * h * 0.3, -h * 0.55, x + w, 0.05);
    g.fill();
  }
}
side(-8, px - 0.42, "#151c2c", 1.15, 1);
side(px + 0.42, 8, "#151c2c", 1.15, 1);
side(-8, px - 0.5, "#0c111d", 0.9, 3);
side(px + 0.5, 8, "#0c111d", 0.9, 3);
g.fillStyle = "#0c111d";
g.fillRect(-8, -0.06, 8 + px - 0.5, 0.4);
g.fillRect(px + 0.5, -0.06, 8 - px - 0.5, 0.4);
for (let i = 0; i < 9; i++) {
  const x = -2.8 + e.rnd() * 5.6;
  const h = 0.5 + e.rnd() * 0.2;
  if (Math.abs(x - px) < 0.7) continue;
  const l = 0.03 * Math.sin(e.t * 0.5 + i) + 0.06;
  g.strokeStyle = "#0c111d";
  g.lineWidth = 0.006;
  g.beginPath();
  g.moveTo(x, 0);
  g.quadraticCurveTo(x, -h * 0.7, x + l, -h);
  g.stroke();
  g.fillStyle = "#0c111d";
  g.beginPath();
  g.ellipse(x + l + 0.012, -h + 0.02, 0.009, 0.034, 0.5, 0, 7);
  g.fill();
}
