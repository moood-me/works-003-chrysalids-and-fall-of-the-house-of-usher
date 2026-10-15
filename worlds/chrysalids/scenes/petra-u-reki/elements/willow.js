// The willow bush at the bank's toe leaning out over the pool, and the branch Petra holds (near bank's metres).
// branch 0..1: it bends under her (to 0.85), then snaps: the stub springs up and shivers, the broken piece rides
// the current away to the right.
const L = e.lib,
  t = e.t,
  Bv = e.state.branch ?? 0.2,
  W = L.W;
const broke = L.clamp((Bv - 0.85) / 0.15),
  root = L.ROOT;
const sw = (k) => 0.05 * Math.sin(t * 0.9 + k) + 0.025 * Math.sin(t * 2.3 + k * 1.7);
g.lineCap = "round";
const leaf = (x, y, a, s, col) => {
  g.fillStyle = col;
  g.beginPath();
  g.ellipse(x, y, 0.12 * s, 0.028 * s, a, 0, 7);
  g.fill();
};
const stems = [
  [-0.6, -2.4, 2.0, -1.5],
  [0.2, -2.7, 3.4, -1.2],
  [0.9, -2.2, 4.4, -0.4],
  [1.6, -1.6, 4.9, 0.0],
  [-0.2, -1.9, 1.4, -0.6],
  [2.6, -1.2, 5.6, 0.2],
];
stems.forEach(([cx, cy, ex, ey], k) => {
  const sx = sw(k) * 0.6,
    Pq = (u) => [
      (1 - u) * (1 - u) * root[0] + 2 * (1 - u) * u * (root[0] + cx) + u * u * (ex + sx * u),
      (1 - u) * (1 - u) * root[1] + 2 * (1 - u) * u * (root[1] + cy) + u * u * ey,
    ];
  g.strokeStyle = k % 2 ? "#2c2f2a" : "#33372f";
  g.lineWidth = 0.06 - k * 0.004;
  g.beginPath();
  for (let u = 0; u <= 1.001; u += 0.05) {
    const p = Pq(u);
    u ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]);
  }
  g.stroke();
  for (let i = 0; i < 46; i++) {
    const u = 0.25 + 0.75 * e.rnd(),
      p = Pq(u),
      hang = 0.05 + e.rnd() * 0.35,
      a = 1.2 + (e.rnd() - 0.5) * 0.9 + 0.15 * Math.sin(t * 1.3 + i);
    g.globalAlpha = 0.75 + e.rnd() * 0.25;
    leaf(
      p[0] + (e.rnd() - 0.5) * 0.2 + sw(i) * 0.3,
      p[1] + hang,
      a,
      1 + e.rnd() * 0.6,
      e.rnd() < 0.5 ? "#3b4237" : "#485043",
    );
  }
  g.globalAlpha = 1;
});
// the branch she holds
const tp = L.tip(Bv, t),
  bx = root[0] + 1.3,
  by = -1.0 + 0.55 * L.clamp(Bv / 0.85);
g.strokeStyle = "#2e312b";
g.lineWidth = 0.065;
g.beginPath();
g.moveTo(root[0], root[1]);
if (broke > 0) {
  // the stub springs back up and shivers, settling
  const sh = Math.exp(-broke * 3) * Math.sin(t * 22) * 0.06;
  const stub = [3.9, -0.75 - 0.35 * L.clamp(broke * 3) + sh];
  g.quadraticCurveTo(bx - 0.2, by - 0.3, stub[0], stub[1]);
  g.stroke();
  // the broken piece: carried off on the current, turning a little
  const fx = 4.6 + 3.2 * broke + 1.2 * Math.max(0, Bv - 1),
    fy = W - 0.02;
  g.save();
  g.translate(fx, fy);
  g.rotate(0.12 + 0.12 * Math.sin(t * 1.3));
  g.lineWidth = 0.05;
  g.beginPath();
  g.moveTo(-0.7, 0);
  g.quadraticCurveTo(0, -0.08, 0.7, -0.04);
  g.stroke();
  for (let i = 0; i < 12; i++)
    leaf(-0.6 + i * 0.11, 0.0 - 0.04 * Math.sin(i), 0.3 + e.rnd() * 0.8, 1, e.rnd() < 0.5 ? "#3b4237" : "#485043");
  g.restore();
} else {
  g.quadraticCurveTo(bx, by, tp[0], tp[1]);
  g.stroke();
  for (let i = 0; i < 30; i++) {
    const u = 0.4 + 0.42 * e.rnd(),
      x = (1 - u) * (1 - u) * root[0] + 2 * (1 - u) * u * bx + u * u * tp[0],
      y = (1 - u) * (1 - u) * root[1] + 2 * (1 - u) * u * by + u * u * tp[1];
    g.globalAlpha = 0.85;
    leaf(x, y + 0.05 + e.rnd() * 0.2, 1.3 + (e.rnd() - 0.5) * 0.6, 1.1, e.rnd() < 0.5 ? "#3b4237" : "#485043");
  }
  g.globalAlpha = 1;
  // the leaves at its end trail in the water: a little wake
  g.strokeStyle = "#c9ccc4";
  g.lineWidth = 0.02;
  for (let i = 0; i < 8; i++) {
    const k = (t * 0.6 + i / 8) % 1;
    g.globalAlpha = 0.25 * (1 - k);
    g.beginPath();
    g.moveTo(tp[0] + 0.5 + k * 1.8, W + 0.01);
    g.lineTo(tp[0] + 0.8 + k * 2.3, W + 0.015);
    g.stroke();
  }
  g.globalAlpha = 1;
}
