// the pool, from under the near bank to the far one (19 m): the current runs right, faster with danger; rain rings
const D = e.state.danger ?? 0.5,
  R = e.state.rain ?? 0.5,
  t = e.t;
let gr = g.createLinearGradient(0, -9.5, 0, 9.5);
gr.addColorStop(0, "#8e938c");
gr.addColorStop(0.35, "#757b75");
gr.addColorStop(0.75, "#59615d");
gr.addColorStop(1, "#3d4542");
g.fillStyle = gr;
g.fillRect(-45, -9.5, 90, 19);
// the sky's pale light on the water, and darker deep under the near bank
let sl = g.createRadialGradient(-5, -7.5, 0, -5, -7.5, 18);
sl.addColorStop(0, "rgba(200,202,190,0.28)");
sl.addColorStop(1, "rgba(200,202,190,0)");
g.fillStyle = sl;
g.fillRect(-45, -9.5, 90, 19);
let dk = g.createLinearGradient(0, 4, 0, 9.5);
dk.addColorStop(0, "rgba(30,36,34,0)");
dk.addColorStop(1, "rgba(30,36,34,0.45)");
g.fillStyle = dk;
g.fillRect(-45, 4, 90, 5.5);
for (let i = 0; i < 50; i++) {
  const x = -40 + e.rnd() * 80,
    y = -9 + e.rnd() * 18,
    w = 4 + e.rnd() * 14,
    h = 0.15 + e.rnd() * 0.6;
  g.globalAlpha = 0.06 + e.rnd() * 0.07;
  g.fillStyle = e.rnd() < 0.5 ? "#a6aba4" : "#3f4844";
  g.beginPath();
  g.ellipse(x, y, w, h, 0, 0, 7);
  g.fill();
}
// the current: streaks running right, longer and faster near, quicker as the danger grows
const sp = 0.6 + D * 2.2;
for (let i = 0; i < 460; i++) {
  const y = -9.3 + e.rnd() * 18.6;
  const near = (y + 9.5) / 19;
  const L = 0.4 + e.rnd() * 1.2 + near * 2.8;
  const x = ((e.rnd() * 90 + t * sp * (0.7 + e.rnd() * 0.6) * (0.5 + near)) % 90) - 45;
  const a = (0.07 + e.rnd() * 0.14) * (0.6 + D * 0.7);
  const w = Math.sin(x * 0.5 + y) * 0.08 * (0.5 + near);
  g.globalAlpha = a;
  g.strokeStyle = e.rnd() < 0.55 ? "#b0b5ad" : "#353d3a";
  g.lineWidth = 0.02 + near * 0.05;
  g.beginPath();
  g.moveTo(x, y);
  g.quadraticCurveTo(x + L * 0.5, y + w, x + L, y);
  g.stroke();
}
// eddies in the pool: slow turning curls
for (let i = 0; i < 14; i++) {
  const cx = -20 + e.rnd() * 40,
    cy = -6 + e.rnd() * 14,
    r = 0.5 + e.rnd() * 1.5,
    a0 = t * (0.3 + e.rnd() * 0.4) * (0.6 + D) + e.rnd() * 6;
  g.globalAlpha = 0.12 * (0.5 + D);
  g.strokeStyle = "#b8bcb4";
  g.lineWidth = 0.03;
  g.beginPath();
  g.ellipse(cx, cy, r, r * 0.35, 0, a0, a0 + 2.2);
  g.stroke();
}
// rain on the water: rings
const n = Math.round(R * 240);
g.strokeStyle = "#c6cac2";
for (let i = 0; i < n; i++) {
  const x = -30 + e.rnd() * 60,
    y = -9 + e.rnd() * 18,
    sp2 = 0.35 + e.rnd() * 0.4,
    ph = e.rnd();
  const k = (t * sp2 + ph) % 1;
  const near = (y + 9.5) / 19;
  g.globalAlpha = 0.3 * (1 - k);
  g.lineWidth = 0.012 + near * 0.02;
  g.beginPath();
  g.arc(x, y, 0.04 + k * (0.18 + near * 0.22), 0, 7);
  g.stroke();
}
g.globalAlpha = 1;
