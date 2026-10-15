const A = e.aspect;
let gr = g.createLinearGradient(0, -0.35, 0, 0.48);
gr.addColorStop(0, "#525b5f");
gr.addColorStop(0.45, "#7c8483");
gr.addColorStop(0.85, "#a4a8a0");
gr.addColorStop(1, "#aeb0a7");
g.fillStyle = gr;
g.fillRect(-0.3, -0.35, A + 0.6, 1.6);
const sx = A * 0.27,
  sy = 0.3;
let gl = g.createRadialGradient(sx, sy, 0, sx, sy, 0.7);
gl.addColorStop(0, "rgba(222,222,206,0.45)");
gl.addColorStop(0.4, "rgba(212,212,198,0.15)");
gl.addColorStop(1, "rgba(210,210,200,0)");
g.fillStyle = gl;
g.fillRect(-0.3, -0.35, A + 0.6, 1.6);
for (let i = 0; i < 34; i++) {
  const W = A + 1.4;
  const cx = ((e.rnd() * W + e.t * 0.0035 * (0.5 + e.rnd())) % W) - 0.7,
    cy = -0.3 + e.rnd() * 0.62,
    w = 0.25 + e.rnd() * 0.55,
    h = 0.03 + e.rnd() * 0.07;
  const dark = e.rnd() < 0.65;
  const a = 0.12 + e.rnd() * 0.16;
  g.save();
  g.translate(cx, cy);
  g.scale(1, h / w);
  const rg = g.createRadialGradient(0, 0, 0, 0, 0, w);
  const c = dark ? "70,79,83" : "190,192,184";
  rg.addColorStop(0, "rgba(" + c + "," + a + ")");
  rg.addColorStop(0.6, "rgba(" + c + "," + a * 0.5 + ")");
  rg.addColorStop(1, "rgba(" + c + ",0)");
  g.fillStyle = rg;
  g.fillRect(-w, -w, 2 * w, 2 * w);
  g.restore();
}
