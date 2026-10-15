const S = e.state || {};
const A = e.aspect;
const dw = S.dawn ?? 0;
let gr = g.createLinearGradient(0, -0.35, 0, 1.25);
gr.addColorStop(0, "#060a17");
gr.addColorStop(0.35, "#0d1530");
gr.addColorStop(0.56, "#1c2848");
gr.addColorStop(0.64, "#2c3a5c");
gr.addColorStop(0.7, "#141b2e");
gr.addColorStop(1, "#0a0e18");
g.fillStyle = gr;
g.fillRect(-0.4, -0.4, A + 0.8, 1.7);
if (dw > 0) {
  let dg = g.createLinearGradient(0, -0.35, 0, 0.66);
  dg.addColorStop(0, "rgba(40,52,88," + 0.5 * dw + ")");
  dg.addColorStop(0.5, "rgba(84,92,130," + 0.7 * dw + ")");
  dg.addColorStop(0.85, "rgba(150,132,150," + 0.8 * dw + ")");
  dg.addColorStop(1, "rgba(206,160,136," + 0.85 * dw + ")");
  g.fillStyle = dg;
  g.fillRect(-0.4, -0.4, A + 0.8, 1.06);
  const rg = g.createRadialGradient(A * 0.86, 0.64, 0, A * 0.86, 0.64, 0.8);
  rg.addColorStop(0, "rgba(232,184,148," + 0.45 * dw + ")");
  rg.addColorStop(1, "rgba(232,184,148,0)");
  g.fillStyle = rg;
  g.fillRect(-0.4, -0.2, A + 0.8, 0.86);
}
g.save();
g.translate(A * 0.45, 0.18);
g.rotate(-0.35);
for (let i = 0; i < 46; i++) {
  const x = (e.rnd() - 0.5) * 2.8,
    y = (e.rnd() - 0.5) * 0.14,
    r = 0.06 + e.rnd() * 0.13;
  const rg = g.createRadialGradient(x, y, 0, x, y, r);
  rg.addColorStop(0, "rgba(150,165,205," + 0.035 * (1 - dw) + ")");
  rg.addColorStop(1, "rgba(150,165,205,0)");
  g.fillStyle = rg;
  g.fillRect(x - r, y - r, 2 * r, 2 * r);
}
g.restore();
for (let i = 0; i < 240; i++) {
  const x = -0.3 + e.rnd() * (A + 0.6),
    y = -0.35 + e.rnd() * 0.95,
    r = e.rnd(),
    ph = e.rnd() * 6.28;
  const tw = 0.6 + 0.4 * Math.sin(e.t * (0.2 + r * 0.5) + ph);
  const fade = 1 - Math.max(0, (y - 0.4) / 0.22);
  g.globalAlpha = Math.max(0, (0.12 + 0.6 * r * r * r) * tw * fade * (1 - dw * 0.95));
  g.fillStyle = "#d4dcf0";
  const s = 0.0012 + r * r * 0.0022;
  g.beginPath();
  g.arc(x, y, s, 0, 7);
  g.fill();
}
g.globalAlpha = 1;
let hg = g.createLinearGradient(0, 0.5, 0, 0.65);
hg.addColorStop(0, "rgba(70,86,124,0)");
hg.addColorStop(1, "rgba(84,100,138,0.25)");
g.fillStyle = hg;
g.fillRect(-0.4, 0.5, A + 0.8, 0.15);
