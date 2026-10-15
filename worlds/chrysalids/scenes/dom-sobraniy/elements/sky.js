const F = e.lib.outside(e.state, e.t);
const t = e.t;
let gr = g.createLinearGradient(0, -0.35, 0, 0.6);
gr.addColorStop(0, "#0b0f1a");
gr.addColorStop(0.7, "#17213a");
gr.addColorStop(1, "#26324c");
g.fillStyle = gr;
g.fillRect(-0.3, -0.35, e.aspect + 0.6, 1.6);
for (let i = 0; i < 40; i++) {
  const x = e.rnd() * (e.aspect + 0.6) - 0.3,
    y = -0.3 + e.rnd() * 0.6,
    tw = 0.5 + 0.5 * Math.sin(t * (0.7 + e.rnd()) + i);
  g.fillStyle = "rgba(215,222,240," + (0.25 + 0.4 * tw) * (1 - 0.7 * F) + ")";
  g.beginPath();
  g.arc(x, y, 0.0012 + e.rnd() * 0.0012, 0, 7);
  g.fill();
}
if (F > 0.01) {
  const cx = e.aspect * 0.62;
  gr = g.createRadialGradient(cx, 0.48, 0.02, cx, 0.48, 0.75);
  gr.addColorStop(0, "rgba(255,140,60," + 0.75 * F + ")");
  gr.addColorStop(0.4, "rgba(200,80,40," + 0.35 * F + ")");
  gr.addColorStop(1, "rgba(120,40,30,0)");
  g.fillStyle = gr;
  g.fillRect(-0.3, -0.35, e.aspect + 0.6, 1.6);
  for (let i = 0; i < 5; i++) {
    const x = cx - 0.3 + i * 0.15 + 0.05 * Math.sin(t * 0.2 + i);
    const y = 0.2 - ((t * 0.02 + i * 0.13) % 0.5);
    const r = 0.12 + 0.05 * i;
    const sg = g.createRadialGradient(x, y, 0, x, y, r);
    sg.addColorStop(0, "rgba(30,20,22," + 0.35 * F + ")");
    sg.addColorStop(1, "rgba(30,20,22,0)");
    g.fillStyle = sg;
    g.fillRect(x - r, y - r, 2 * r, 2 * r);
  }
}
