const S = e.state || {};
const ov = S.overgrowth ?? 0.6;
const sm = (t) => {
  t = Math.max(0, Math.min(1, t));
  return t * t * (3 - 2 * t);
};
const R = (x) =>
  0.2 + 7 * sm((-x - 26) / 40) + 5 * sm((x - 32) / 40) + 0.3 * Math.sin(x * 0.3) + 0.15 * Math.sin(x * 0.9);
let gr = g.createLinearGradient(0, -8, 0, 1.5);
gr.addColorStop(0, "#909b7a");
gr.addColorStop(0.85, "#828d6c");
gr.addColorStop(1, "#808b69");
g.fillStyle = gr;
g.beginPath();
g.moveTo(-130, 4);
for (let x = -130; x <= 130; x += 0.5) g.lineTo(x, -R(x));
g.lineTo(130, 4);
g.closePath();
g.fill();
for (let i = 0; i < 50; i++) {
  const x = -120 + e.rnd() * 240,
    y = -R(x) * e.rnd() + 0.5,
    r = 2 + e.rnd() * 6;
  const pg = g.createRadialGradient(x, y, 0, x, y, r);
  pg.addColorStop(0, e.rnd() < 0.5 ? "rgba(210,206,170,0.13)" : "rgba(84,98,70,0.12)");
  pg.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = pg;
  g.save();
  g.translate(x, y);
  g.scale(2.4, 0.45);
  g.translate(-x, -y);
  g.fillRect(x - r, y - r, 2 * r, 2 * r);
  g.restore();
}
for (let i = 0; i < 900; i++) {
  const x = -125 + e.rnd() * 250;
  const y0 = -R(x) + 0.05 + e.rnd() * 0.2;
  const h = (0.15 + e.rnd() * 0.45) * (0.6 + 0.8 * ov);
  const ph = e.rnd() * 6.28;
  const l = (e.rnd() - 0.5) * 0.5 + 0.06 * Math.sin(0 * 0.4 + ph + x * 0.05);
  g.fillStyle = e.rnd() < 0.25 ? "#a49d72" : e.rnd() < 0.5 ? "#7c8763" : "#8a9470";
  g.beginPath();
  g.moveTo(x - 0.05, y0);
  g.quadraticCurveTo(x + l * h * 0.4, y0 - h * 0.6, x + l * h, y0 - h);
  g.quadraticCurveTo(x + l * h * 0.4 + 0.02, y0 - h * 0.5, x + 0.05, y0);
  g.fill();
}
for (let x = -125; x < 125; x += 2 + e.rnd() * 4) {
  if (Math.abs(x) < 30 || e.rnd() < 0.5) continue;
  const y = -R(x) + 0.3;
  const r = 0.5 + e.rnd() * 1.0 * (0.5 + ov);
  g.fillStyle = "#74805e";
  g.beginPath();
  g.ellipse(x, y - r * 0.5, r * 1.4, r, 0, Math.PI, 0);
  g.fill();
  g.fillStyle = "rgba(170,176,136,0.3)";
  g.beginPath();
  g.ellipse(x - r * 0.4, y - r * 0.9, r * 0.7, r * 0.35, 0, 0, 7);
  g.fill();
}
