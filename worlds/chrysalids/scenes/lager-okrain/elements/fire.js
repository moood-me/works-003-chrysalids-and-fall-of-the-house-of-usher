const S = e.state || {};
const f = S.fire ?? 0.8;
const t = e.t;
const fl = 0.85 + 0.1 * Math.sin(t * 6.3) + 0.05 * Math.sin(t * 10.7);
let eg = g.createRadialGradient(0, -0.05, 0, 0, -0.05, 0.9);
eg.addColorStop(0, "rgba(240,150,70," + (0.2 + 0.35 * f) + ")");
eg.addColorStop(1, "rgba(180,70,30,0)");
g.fillStyle = eg;
g.save();
g.scale(1, 0.3);
g.beginPath();
g.arc(0, -0.2, 0.9, 0, 7);
g.fill();
g.restore();
for (let i = 0; i < 9; i++) {
  const a = (i / 9) * Math.PI * 2 + 0.3;
  const x = Math.cos(a) * 0.62,
    y = Math.sin(a) * 0.1;
  g.fillStyle = "#17120f";
  g.beginPath();
  g.ellipse(x, y, 0.14, 0.085, 0, 0, 7);
  g.fill();
  g.fillStyle = "rgba(190,110,56," + 0.3 * f * fl + ")";
  g.beginPath();
  g.ellipse(x, y - 0.05, 0.09, 0.022, 0, 0, 7);
  g.fill();
}
g.strokeStyle = "#1c120e";
g.lineCap = "round";
g.lineWidth = 0.12;
g.beginPath();
g.moveTo(-0.55, 0.0);
g.lineTo(0.4, -0.14);
g.moveTo(0.5, 0.02);
g.lineTo(-0.3, -0.17);
g.moveTo(-0.1, 0.02);
g.lineTo(0.05, -0.3);
g.stroke();
g.strokeStyle = "rgba(230,120,50," + 0.45 * f + ")";
g.lineWidth = 0.03;
g.beginPath();
g.moveTo(-0.3, -0.06);
g.lineTo(0.2, -0.12);
g.stroke();
const H = 0.2 + 1.2 * f;
g.globalCompositeOperation = "lighter";
for (let k = 0; k < 9; k++) {
  const ph = k * 1.9;
  const x0 = (k - 4) * 0.07;
  const h =
    H *
    (0.45 + 0.55 * Math.abs(Math.sin(k * 2.3 + 1))) *
    (0.85 + 0.12 * Math.sin(t * 3.1 + ph) + 0.07 * Math.sin(t * 5.7 + ph * 1.3));
  const w = 0.1 + 0.05 * Math.sin(k * 1.7);
  const sx = 0.07 * Math.sin(t * 2.3 + ph) + 0.04 * Math.sin(t * 4.1 + ph);
  const fg = g.createLinearGradient(0, 0, 0, -h);
  fg.addColorStop(0, "rgba(240,176,100,0.4)");
  fg.addColorStop(0.4, "rgba(216,116,56,0.3)");
  fg.addColorStop(1, "rgba(150,56,36,0)");
  g.fillStyle = fg;
  g.beginPath();
  g.moveTo(x0 - w, -0.05);
  g.bezierCurveTo(x0 - w, -h * 0.4, x0 + sx - w * 0.3, -h * 0.7, x0 + sx * 1.6, -h);
  g.bezierCurveTo(x0 + sx + w * 0.3, -h * 0.6, x0 + w, -h * 0.35, x0 + w, -0.05);
  g.closePath();
  g.fill();
}
let cg = g.createRadialGradient(0, -0.25, 0, 0, -0.25, 0.35);
cg.addColorStop(0, "rgba(255,220,150," + 0.5 * f + ")");
cg.addColorStop(1, "rgba(255,200,120,0)");
g.fillStyle = cg;
g.beginPath();
g.arc(0, -0.25, 0.35, 0, 7);
g.fill();
g.globalCompositeOperation = "source-over";
for (let i = 0; i < 22; i++) {
  const sp = 0.15 + e.rnd() * 0.25,
    ph = e.rnd(),
    dx = (e.rnd() - 0.5) * 0.5;
  const life = (t * sp + ph) % 1;
  const x = dx + Math.sin(t * 0.9 + i * 2.1) * 0.25 * life + life * life * 0.9;
  const y = -H * 0.5 - life * (2.5 + f * 2.5);
  const a = (1 - life) * (1 - life) * f * 0.9;
  if (a <= 0.02) continue;
  g.fillStyle = "rgba(255,190,116," + a + ")";
  g.beginPath();
  g.arc(x, y, 0.016 + 0.012 * (1 - life), 0, 7);
  g.fill();
}
e.light(0, -0.5, 3 + 8 * f, "#e08a46", (0.3 + 0.55 * f) * fl);
