function mix(a, b, t) {
  t = Math.max(0, Math.min(1, t));
  const p = parseInt(a.slice(1), 16),
    q = parseInt(b.slice(1), 16);
  return (
    "rgb(" +
    ((((p >> 16) & 255) * (1 - t) + ((q >> 16) & 255) * t) | 0) +
    "," +
    ((((p >> 8) & 255) * (1 - t) + ((q >> 8) & 255) * t) | 0) +
    "," +
    (((p & 255) * (1 - t) + (q & 255) * t) | 0) +
    ")"
  );
}
const ev = 1 - (e.state.sun ?? 1);
const A = e.aspect;
let gr = g.createLinearGradient(0, -0.35, 0, 0.62);
gr.addColorStop(0, mix("#8fa2ab", "#7e7f90", ev));
gr.addColorStop(0.42, mix("#c4c9bd", "#c9ab9c", ev));
gr.addColorStop(0.8, mix("#ecdfb8", "#efbf92", ev));
gr.addColorStop(1, mix("#f3e5bd", "#f2c597", ev));
g.fillStyle = gr;
g.fillRect(-0.3, -0.35, A + 0.6, 1.6);
const sx = A * 0.5 - 0.08,
  sy = 0.27 + ev * 0.12;
let gl = g.createRadialGradient(sx, sy, 0, sx, sy, 0.85);
gl.addColorStop(0, "rgba(255,240,200,0.75)");
gl.addColorStop(0.18, "rgba(252,232,186,0.38)");
gl.addColorStop(0.5, "rgba(248,226,180,0.12)");
gl.addColorStop(1, "rgba(248,226,180,0)");
g.fillStyle = gl;
g.fillRect(-0.3, -0.35, A + 0.6, 1.6);
let d = g.createRadialGradient(sx, sy, 0, sx, sy, 0.06);
d.addColorStop(0, "rgba(255,252,236,1)");
d.addColorStop(0.5, "rgba(255,248,224,0.95)");
d.addColorStop(1, "rgba(255,244,214,0)");
g.fillStyle = d;
g.beginPath();
g.arc(sx, sy, 0.06, 0, 7);
g.fill();
// (where the sun is: the people's light comes from it)
e.at(sx, sy, "sun");
for (let i = 0; i < 8; i++) {
  const cx = ((e.rnd() * (A + 0.8) + e.t * 0.0012 * (0.6 + e.rnd())) % (A + 0.8)) - 0.4,
    cy = 0.03 + e.rnd() * 0.22,
    w = 0.2 + e.rnd() * 0.35,
    h = 0.005 + e.rnd() * 0.01;
  const near = Math.max(0, 1 - Math.abs(cx - sx) / 0.6);
  g.globalAlpha = 0.22 + e.rnd() * 0.15;
  g.fillStyle = near > 0.3 ? mix("#fff1cf", "#ffd9b0", ev) : mix("#e3ddc8", "#d9bfae", ev);
  g.beginPath();
  g.ellipse(cx, cy, w, h, 0, 0, 7);
  g.fill();
}
g.globalAlpha = 1;
let tp = g.createLinearGradient(0, -0.35, 0, 0.36);
tp.addColorStop(0, "rgba(48,60,70,0.8)");
tp.addColorStop(0.55, "rgba(62,76,86,0.42)");
tp.addColorStop(1, "rgba(80,92,98,0)");
g.fillStyle = tp;
g.fillRect(-0.3, -0.35, A + 0.6, 0.71);
// night (0…1): the sky goes deep blue, stars, a moon over the meadow (the scene's own `fade` darkens the land)
const nt = e.state.night ?? 0;
if (nt > 0.01) {
  g.globalAlpha = nt;
  let ng = g.createLinearGradient(0, -0.35, 0, 0.62);
  ng.addColorStop(0, "#070d1a");
  ng.addColorStop(0.6, "#15203a");
  ng.addColorStop(1, "#2a3550");
  g.fillStyle = ng;
  g.fillRect(-0.3, -0.35, A + 0.6, 1.6);
  for (let i = 0; i < 90; i++) {
    const x = e.anim.hash(i, 21) * A, y = -0.3 + e.anim.hash(i, 23) * 0.62, r = 0.0006 + 0.0014 * e.anim.hash(i, 25);
    g.globalAlpha = nt * (0.35 + 0.5 * e.anim.hash(i, 27)) * (0.75 + 0.25 * Math.sin(e.t * (0.6 + e.anim.hash(i, 29)) + i));
    g.fillStyle = "#e8eefc";
    g.beginPath();
    g.arc(x, y, r, 0, 7);
    g.fill();
  }
  const mx = A * 0.56, my = 0.15;
  // (where the moon is: the night's light on the people)
  e.at(mx, my, "moon");
  let mg = g.createRadialGradient(mx, my, 0, mx, my, 0.22);
  mg.addColorStop(0, "rgba(200,214,240,0.35)");
  mg.addColorStop(1, "rgba(200,214,240,0)");
  g.globalAlpha = nt;
  g.fillStyle = mg;
  g.fillRect(mx - 0.22, my - 0.22, 0.44, 0.44);
  g.fillStyle = "#eef2fa";
  g.beginPath();
  g.arc(mx, my, 0.022, 0, 7);
  g.fill();
  g.globalAlpha = 1;
}
