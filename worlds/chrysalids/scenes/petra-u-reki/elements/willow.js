// The willow bush at the bank's toe leaning out over the pool (the bank's metres), and the branch Petra holds: its stems
// and leaves (layers swaying), the branch (a layer bent down under her weight as `branch` goes to 0.85 — willow.animate.js
// — then snapped: the stub springs up, the broken piece rides the current away). Its point `tip` — where her hands are.
const { ROOT } = e.lib;
g.lineCap = 'round';
const leaf = (q, x, y, a, s, col) => { q.fillStyle = col; q.beginPath(); q.ellipse(x, y, 0.12 * s, 0.028 * s, a, 0, 7); q.fill(); };
const stems = [[-0.6, -2.4, 2.0, -1.5], [0.2, -2.7, 3.4, -1.2], [0.9, -2.2, 4.4, -0.4], [1.6, -1.6, 4.9, 0.0], [-0.2, -1.9, 1.4, -0.6], [2.6, -1.2, 5.6, 0.2]];
stems.forEach(([cx, cy, ex, ey], k) => {
  const Pq = u => [(1 - u) * (1 - u) * ROOT[0] + 2 * (1 - u) * u * (ROOT[0] + cx) + u * u * ex, (1 - u) * (1 - u) * ROOT[1] + 2 * (1 - u) * u * (ROOT[1] + cy) + u * u * ey];
  e.layer(`stem${k}`, { pivot: ROOT, wind: { strength: 0.2, gust: 0.6 }, box: [1.5, -3.2, 9.5, 1.0] }, q => {
    q.strokeStyle = k % 2 ? '#5a5244' : '#62594a';
    q.lineWidth = 0.06 - k * 0.004;
    q.lineCap = 'round';
    q.beginPath();
    for (let u = 0; u <= 1.001; u += 0.05) { const p = Pq(u); u ? q.lineTo(p[0], p[1]) : q.moveTo(p[0], p[1]); }
    q.stroke();
    for (let i = 0; i < 46; i++) {
      const u = 0.25 + 0.75 * e.rnd(), p = Pq(u);
      leaf(q, p[0] + (e.rnd() - 0.5) * 0.2, p[1] + 0.05 + e.rnd() * 0.35, 1.2 + (e.rnd() - 0.5) * 0.9, 1 + e.rnd() * 0.6, e.rnd() < 0.5 ? '#6a7a58' : '#7a8a64');
    }
  });
});
// the branch she holds, from its root out over the pool (at rest; its animate bends it down about ROOT)
const bx = ROOT[0] + 1.3, by = -1.0, tp = [5.05, -0.2];
e.layer('branch', { pivot: ROOT, box: [1.8, -1.6, 6.2, 0.8] }, q => {
  q.strokeStyle = '#5a5244';
  q.lineWidth = 0.065;
  q.lineCap = 'round';
  q.beginPath();
  q.moveTo(ROOT[0], ROOT[1]);
  q.quadraticCurveTo(bx, by, tp[0], tp[1]);
  q.stroke();
  for (let i = 0; i < 30; i++) {
    const u = 0.4 + 0.42 * e.rnd(), x = (1 - u) * (1 - u) * ROOT[0] + 2 * (1 - u) * u * bx + u * u * tp[0], y = (1 - u) * (1 - u) * ROOT[1] + 2 * (1 - u) * u * by + u * u * tp[1];
    leaf(q, x, y + 0.05 + e.rnd() * 0.2, 1.3 + (e.rnd() - 0.5) * 0.6, 1.1, e.rnd() < 0.5 ? '#6a7a58' : '#7a8a64');
  }
});
// the broken-off piece riding the current (its animate carries it off once the branch snaps)
e.layer('piece', { pivot: [0, 0], box: [-1.0, -0.4, 12, 0.6] }, q => {
  q.strokeStyle = '#5a5244';
  q.lineWidth = 0.05;
  q.lineCap = 'round';
  q.beginPath();
  q.moveTo(-0.7, 0);
  q.quadraticCurveTo(0, -0.08, 0.7, -0.04);
  q.stroke();
  for (let i = 0; i < 12; i++) leaf(q, -0.6 + i * 0.11, -0.04 * Math.sin(i), 0.3 + e.rnd() * 0.8, 1, e.rnd() < 0.5 ? '#6a7a58' : '#7a8a64');
});
