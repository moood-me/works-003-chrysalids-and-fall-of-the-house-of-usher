// the lamp's oil burning on the floor before the platform (spill > 0.3): it spreads, flames,
// smoke; the broken lamp lies at its edge
const lib = e.lib,
  S = e.state,
  t = e.t;
const sp = lib.N(S.spill);
const p = lib.sm((sp - 0.25) / 0.75);
if (p < 0.01) return;
const W = 0.3 + 1.3 * p;
let gr = g.createRadialGradient(0, -0.05, 0.05, 0, -0.05, W * 1.3);
gr.addColorStop(0, "rgba(255,170,80," + 0.5 * p + ")");
gr.addColorStop(1, "rgba(255,120,50,0)");
g.fillStyle = gr;
g.beginPath();
g.ellipse(0, 0, W * 1.3, 0.25, 0, 0, 7);
g.fill();
// the broken lamp, on its side
g.fillStyle = "#1c1513";
g.beginPath();
g.ellipse(-W * 0.8, -0.05, 0.1, 0.06, 0.3, 0, 7);
g.fill();
g.fillRect(-W * 0.8, -0.07, 0.14, 0.04);
const n = 16;
for (let i = 0; i < n; i++) {
  const u = i / (n - 1) - 0.5;
  const x = u * 2 * W * (0.9 + 0.1 * Math.sin(i * 3.1));
  const ph = e.rnd() * 6.28;
  const edge = 1 - Math.abs(u) * 1.6;
  const h = (0.18 + 0.5 * e.rnd()) * p * Math.max(0.15, edge) * (0.7 + 0.3 * Math.sin(t * (6 + e.rnd() * 5) + ph));
  const sw = 0.03 * Math.sin(t * 3.3 + ph);
  gr = g.createLinearGradient(0, 0, 0, -h);
  gr.addColorStop(0, "rgba(255,225,150,0.95)");
  gr.addColorStop(0.4, "rgba(255,150,60,0.8)");
  gr.addColorStop(1, "rgba(200,60,30,0)");
  g.fillStyle = gr;
  g.beginPath();
  g.moveTo(x - 0.07, 0);
  g.quadraticCurveTo(x - 0.04 + sw, -h * 0.5, x + sw * 2, -h);
  g.quadraticCurveTo(x + 0.05 + sw, -h * 0.45, x + 0.07, 0);
  g.closePath();
  g.fill();
}
for (let i = 0; i < 6; i++) {
  const u = (t * 0.12 + i / 6) % 1;
  const x = (e.rnd() - 0.5) * W + 0.2 * Math.sin(t * 0.5 + i);
  const r = 0.2 + 0.6 * u;
  gr = g.createRadialGradient(x, -0.5 - 1.2 * u, 0, x, -0.5 - 1.2 * u, r);
  gr.addColorStop(0, "rgba(30,24,24," + 0.35 * (1 - u) * p + ")");
  gr.addColorStop(1, "rgba(30,24,24,0)");
  g.fillStyle = gr;
  g.fillRect(x - r, -0.5 - 1.2 * u - r, 2 * r, 2 * r);
}
e.light(0, -0.25, 2.6, "#ff8a3c", 0.7 * p);
