const S = e.state || {};
const li = S.lights ?? 0.7,
  w = S.waking ?? 0;
for (let i = 0; i < 46; i++) {
  const x = -4 + Math.pow(e.rnd(), 1.3) * 5.6;
  const h = 0.5 + e.rnd() * 0.8 * (1 - (x + 4) / 7);
  const ph = e.rnd() * 6.28;
  const lean = (e.rnd() - 0.35) * 0.35;
  const sh = e.rnd();
  const y0 = 0.35;
  const sw = 0.04 * Math.sin(e.t * 0.3 + ph) + 0.02 * Math.sin(e.t * 0.77 + ph * 1.7);
  const mx = x + lean * h * 0.2,
    my = y0 - h * 0.6;
  const tx = x + (lean + sw) * h,
    ty = y0 - h;
  const col = sh < 0.5 ? "#0f0f20" : "#15152a";
  g.strokeStyle = col;
  g.lineWidth = 0.016;
  g.beginPath();
  g.moveTo(x, y0);
  g.quadraticCurveTo(mx, my, tx, ty);
  g.stroke();
  if (e.rnd() < 0.5) {
    g.lineWidth = 0.012;
    g.beginPath();
    g.moveTo(x + lean * h * 0.1, y0 - h * 0.3);
    g.quadraticCurveTo(x + 0.1, y0 - h * 0.45, x + 0.18 * (lean > 0 ? 1 : -1), y0 - h * 0.35);
    g.stroke();
  }
  const an = Math.atan2(ty - my, tx - mx);
  g.save();
  g.translate(tx, ty);
  g.rotate(an);
  g.fillStyle = col;
  g.beginPath();
  g.ellipse(0.07, 0, 0.085, 0.024, 0, 0, 7);
  g.fill();
  g.strokeStyle = col;
  g.lineWidth = 0.005;
  for (let a = -1; a <= 1; a++) {
    g.beginPath();
    g.moveTo(0.13, a * 0.01);
    g.lineTo(0.27, a * 0.04);
    g.stroke();
  }
  g.strokeStyle = "rgba(236,210,160," + 0.16 * li * (1 - 0.7 * w) + ")";
  g.lineWidth = 0.01;
  g.beginPath();
  g.ellipse(0.07, 0, 0.085, 0.024, 0, -2.6, -0.5);
  g.stroke();
  g.restore();
}
