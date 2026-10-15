const A = e.aspect;
const S = e.state || {};
const gl = S.glow ?? 0.6;
let gr = g.createLinearGradient(0, -0.35, 0, 1.25);
gr.addColorStop(0, "#060a16");
gr.addColorStop(0.3, "#0d1529");
gr.addColorStop(0.5, "#18233c");
gr.addColorStop(0.56, "#222e48");
gr.addColorStop(1, "#0c1220");
g.fillStyle = gr;
g.fillRect(-0.4, -0.4, A + 0.8, 1.7);
for (let i = 0; i < 150; i++) {
  const x = -0.3 + e.rnd() * (A + 0.6),
    y = -0.35 + e.rnd() * 0.85,
    r = e.rnd();
  const tw = 0.5 + 0.5 * Math.sin(e.t * (0.3 + r) + i);
  g.globalAlpha = Math.max(0, (0.12 + 0.4 * r * r) * (0.6 + 0.4 * tw) * (1 - Math.max(0, (y - 0.25) / 0.25)));
  g.fillStyle = "#c9d4ea";
  const s = 0.0016 + r * 0.0016;
  g.fillRect(x, y, s, s);
}
g.globalAlpha = 1;
const p = 0.86 + 0.1 * Math.sin(e.t * 0.37) + 0.04 * Math.sin(e.t * 0.91);
const gx = A * 0.62,
  gy = 0.548;
function blob(rx, ry, st) {
  const rg = g.createRadialGradient(0, 0, 0, 0, 0, 1);
  for (const s of st) rg.addColorStop(s[0], s[1]);
  g.save();
  g.translate(gx, gy);
  g.scale(rx, ry);
  g.fillStyle = rg;
  g.beginPath();
  g.arc(0, 0, 1, 0, 7);
  g.fill();
  g.restore();
}
blob(1.25, 0.26, [
  [0, "rgba(156,164,104," + 0.55 * gl * p + ")"],
  [0.5, "rgba(112,132,96," + 0.22 * gl * p + ")"],
  [1, "rgba(60,80,80,0)"],
]);
blob(0.6, 0.07, [
  [0, "rgba(214,194,112," + 0.85 * gl * p + ")"],
  [0.55, "rgba(176,176,104," + 0.35 * gl * p + ")"],
  [1, "rgba(150,160,100,0)"],
]);
