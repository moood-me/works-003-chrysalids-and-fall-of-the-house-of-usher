const A = e.aspect;
let gr = g.createLinearGradient(0, -0.35, 0, 1.25);
gr.addColorStop(0, "#070b18");
gr.addColorStop(0.3, "#0e1630");
gr.addColorStop(0.5, "#1d2a4a");
gr.addColorStop(0.56, "#26355a");
gr.addColorStop(1, "#0c111e");
g.fillStyle = gr;
g.fillRect(-0.4, -0.4, A + 0.8, 1.7);
for (let i = 0; i < 140; i++) {
  const x = -0.3 + e.rnd() * (A + 0.6),
    y = -0.35 + e.rnd() * 0.85,
    r = e.rnd();
  const tw = 0.55 + 0.45 * Math.sin(e.t * (0.25 + r * 0.6) + i * 1.7);
  g.globalAlpha = Math.max(0, (0.15 + 0.5 * r * r) * tw * (1 - Math.max(0, (y - 0.32) / 0.18)));
  g.fillStyle = "#cdd6ec";
  const s = 0.0015 + r * 0.0018;
  g.fillRect(x, y, s, s);
}
g.globalAlpha = 1;
