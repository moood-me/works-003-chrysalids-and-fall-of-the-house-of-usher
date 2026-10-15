const A = e.aspect;
let gr = g.createLinearGradient(0, -0.35, 0, 1.25);
gr.addColorStop(0, "#05080f");
gr.addColorStop(0.35, "#0a0f1c");
gr.addColorStop(0.58, "#141a2a");
gr.addColorStop(1, "#0a0d16");
g.fillStyle = gr;
g.fillRect(-0.4, -0.4, A + 0.8, 1.7);
for (let i = 0; i < 80; i++) {
  const x = -0.3 + e.rnd() * (A + 0.6),
    y = -0.3 + e.rnd() * 0.55,
    r = e.rnd();
  const tw = 0.5 + 0.5 * Math.sin(e.t * (0.2 + r * 0.5) + i * 1.7);
  g.globalAlpha = (0.06 + 0.3 * r * r) * (0.6 + 0.4 * tw);
  g.fillStyle = "#b8c4dc";
  const s = 0.0014 + r * 0.0014;
  g.fillRect(x, y, s, s);
}
g.globalAlpha = 1;
const mx = A * 0.78,
  my = 0.02;
let h = g.createRadialGradient(mx, my, 0, mx, my, 0.4);
h.addColorStop(0, "rgba(140,156,190,0.12)");
h.addColorStop(1, "rgba(140,156,190,0)");
g.fillStyle = h;
g.fillRect(mx - 0.45, my - 0.45, 0.9, 0.9);
