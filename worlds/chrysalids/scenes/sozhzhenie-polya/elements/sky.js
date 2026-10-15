const { cl, mixc, rgba } = e.lib;
const { T, DAWN, FL } = e.lib.now(e);
const W = e.aspect,
  HZ = 0.55;
const gr = g.createLinearGradient(0, -0.35, 0, HZ + 0.05);
gr.addColorStop(0, mixc("#080a12", "#4d5462", DAWN));
gr.addColorStop(0.45, mixc("#141626", "#7a7c86", DAWN));
gr.addColorStop(0.8, mixc("#2a2a3c", "#a49c92", DAWN));
gr.addColorStop(1, mixc("#3e3a48", "#c4b49c", DAWN));
g.fillStyle = gr;
g.fillRect(-0.3, -0.35, W + 0.6, 1.6);
// first light in the east (left), growing with the dawn
{
  const a = 0.25 + 0.55 * DAWN;
  const rg = g.createRadialGradient(W * 0.12, HZ + 0.02, 0, W * 0.12, HZ, 0.9);
  rg.addColorStop(0, "rgba(214,190,160," + a + ")");
  rg.addColorStop(0.35, "rgba(150,140,140," + a * 0.45 + ")");
  rg.addColorStop(1, "rgba(100,100,120,0)");
  g.fillStyle = rg;
  g.fillRect(-0.3, -0.35, W + 0.6, 1.6);
}
// fire glow on the sky and smoke undersides
{
  const gx = W * 0.5 + 0.35,
    a = 0.5 * FL;
  const rg = g.createRadialGradient(gx, HZ, 0, gx, HZ * 0.85, 0.95);
  rg.addColorStop(0, "rgba(226,120,58," + a + ")");
  rg.addColorStop(0.35, "rgba(160,70,44," + a * 0.55 + ")");
  rg.addColorStop(1, "rgba(70,30,30,0)");
  g.fillStyle = rg;
  g.fillRect(-0.3, -0.35, W + 0.6, 1.6);
}
// stars, fading with the dawn and the fire
g.fillStyle = "#d8d6dc";
for (let i = 0; i < 140; i++) {
  const x = e.rnd() * (W + 0.6) - 0.3,
    y = e.rnd() * 0.55 - 0.33,
    r = e.rnd();
  const hide = cl(1 - DAWN * 1.6, 0, 1) * (1 - 0.7 * FL * cl(1 - Math.abs(x - W * 0.6) / 0.8, 0, 1));
  g.globalAlpha = (0.1 + 0.45 * r) * hide * (0.7 + 0.3 * Math.sin(T * (0.3 + r * 0.6) + i));
  g.fillRect(x, y, 0.0012 + r * 0.0014, 0.0012 + r * 0.0014);
}
g.globalAlpha = 1;
// a few long low clouds, lit from below by the dawn
for (let i = 0; i < 6; i++) {
  const y = 0.08 + i * 0.065 + e.rnd() * 0.04,
    x = -0.2 + e.rnd() * (W + 0.2),
    w = 0.25 + e.rnd() * 0.4,
    dx = T * 0.002 * (1 + i * 0.3);
  g.save();
  g.translate(x - dx, y);
  g.scale(1, 0.03 + e.rnd() * 0.02);
  const cg = g.createRadialGradient(0, 0, 0, 0, 0, w);
  const cc = DAWN > 0.3 ? "#9a8a80" : "#2c2836";
  cg.addColorStop(0, rgba(cc, 0.3 + 0.3 * DAWN));
  cg.addColorStop(1, rgba(cc, 0));
  g.fillStyle = cg;
  g.fillRect(-w, -w, 2 * w, 2 * w);
  g.restore();
}
