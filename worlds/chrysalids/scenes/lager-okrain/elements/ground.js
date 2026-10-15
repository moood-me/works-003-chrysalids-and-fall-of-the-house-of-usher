const S = e.state || {};
const f = S.fire ?? 0.8,
  P = S.people ?? 0.8,
  SP = S.sophie_present ?? 1;
const t = e.t;
const fl = 0.88 + 0.08 * Math.sin(t * 6.1) + 0.05 * Math.sin(t * 9.7);
let bg = g.createLinearGradient(0, -50, 0, 50);
bg.addColorStop(0, "#232a3a");
bg.addColorStop(0.45, "#1a202d");
bg.addColorStop(0.62, "#12161f");
bg.addColorStop(1, "#090c12");
g.fillStyle = bg;
g.fillRect(-70, -50, 140, 100);
for (let i = 0; i < 260; i++) {
  const x = -60 + e.rnd() * 120,
    y = -10 + e.rnd() * 60;
  g.fillStyle = e.rnd() < 0.5 ? "rgba(26,32,44,0.45)" : "rgba(6,8,12,0.4)";
  g.beginPath();
  g.ellipse(x, y, 0.3 + e.rnd() * 2.4, 0.2 + e.rnd() * 1.0, e.rnd() * 3, 0, 7);
  g.fill();
}
for (let i = 0; i < 60; i++) {
  const x = -12 + e.rnd() * 24,
    y = 30 + e.rnd() * 18;
  g.strokeStyle = "rgba(30,30,36,0.35)";
  g.lineWidth = 0.04 + e.rnd() * 0.05;
  g.beginPath();
  const a = e.rnd() * 3;
  g.moveTo(x, y);
  g.lineTo(x + Math.cos(a) * 0.6, y + Math.sin(a) * 0.6);
  g.stroke();
}
const fx = -1.2,
  fy = 40;
const R = 2 + 5.5 * f;
let wg = g.createRadialGradient(fx, fy, 0, fx, fy, R);
wg.addColorStop(0, "rgba(196,116,58," + 0.5 * f * fl + ")");
wg.addColorStop(0.25, "rgba(140,78,44," + 0.26 * f * fl + ")");
wg.addColorStop(0.6, "rgba(70,42,32," + 0.1 * f * fl + ")");
wg.addColorStop(1, "rgba(40,30,30,0)");
g.fillStyle = wg;
g.fillRect(fx - R, fy - R, 2 * R, 2 * R);
const sm = (v) => (v <= 0 ? 0 : v >= 1 ? 1 : v * v * (3 - 2 * v));
function sh(x, y, len, wid, a) {
  if (a <= 0.01) return;
  const dx = x - fx,
    dy = y - fy;
  const D = Math.hypot(dx, dy) || 1;
  const ux = dx / D,
    uy = dy / D;
  const L = len * (0.6 + 0.6 * f);
  g.save();
  g.translate(x + ux * L * 0.5, y + uy * L * 0.5);
  g.rotate(Math.atan2(uy, ux));
  const sg = g.createLinearGradient(-L * 0.5, 0, L * 0.5, 0);
  sg.addColorStop(0, "rgba(5,5,9," + 0.6 * a * f + ")");
  sg.addColorStop(1, "rgba(5,5,9,0)");
  g.fillStyle = sg;
  g.beginPath();
  g.ellipse(0, 0, L * 0.5, wid, 0, 0, 7);
  g.fill();
  g.restore();
}
const py = 39.7;
sh(-3.8, py, 3.2, 0.22, sm(P / 0.1));
sh(-2.5, py, 2.2, 0.3, sm((P - 0.2) / 0.12));
sh(0.1, py, 2.2, 0.32, sm((P - 0.4) / 0.12));
sh(2.6, py, 2.8, 0.22, sm((P - 0.8) / 0.12));
sh(2.3, 43.4, 3.6, 0.2, SP);
sh(-5.9, 38.8, 2.0, 0.4, 1);
