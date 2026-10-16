// The well in the yard (11.5 m): its stone ring, two posts and a little roof, the windlass; the bucket on its rope a layer
// (well.animate.js: it stirs in the wind) — its point `bucket`
g.fillStyle = '#8e8678';
g.beginPath();
g.moveTo(-0.8, 0.05); g.lineTo(-0.8, -0.8); g.quadraticCurveTo(0, -0.9, 0.8, -0.8); g.lineTo(0.8, 0.05);
g.closePath();
g.fill();
g.strokeStyle = 'rgba(80,74,64,0.5)';
g.lineWidth = 0.025;
g.beginPath();
for (const y of [-0.25, -0.5]) { g.moveTo(-0.8, y); g.lineTo(0.8, y); }
for (const [x, y] of [[-0.4, -0.25], [0.2, -0.25], [-0.1, -0.5], [0.5, -0.5], [-0.6, 0], [0.0, 0], [0.6, -0.25]]) { g.moveTo(x, y); g.lineTo(x, y - 0.25); }
g.stroke();
g.fillStyle = '#6a5642';
g.fillRect(-0.75, -2.0, 0.09, 1.25);
g.fillRect(0.66, -2.0, 0.09, 1.25);
g.fillStyle = '#5a4a3c';
g.beginPath(); g.moveTo(-1.05, -1.95); g.lineTo(0, -2.45); g.lineTo(1.05, -1.95); g.closePath(); g.fill();
g.fillStyle = '#7a6650';
g.fillRect(-0.7, -1.72, 1.4, 0.08);
e.layer('bucket', { pivot: [0.1, -1.66], box: [-0.2, -1.7, 0.4, -1.0] }, q => {
  q.strokeStyle = '#8a7a62';
  q.lineWidth = 0.02;
  q.beginPath(); q.moveTo(0.1, -1.66); q.lineTo(0.1, -1.27); q.stroke();
  q.fillStyle = '#6e5a44';
  q.beginPath(); q.moveTo(0.0, -1.27); q.lineTo(0.2, -1.27); q.lineTo(0.18, -1.08); q.lineTo(0.02, -1.08); q.closePath(); q.fill();
  q.strokeStyle = '#4a3c30';
  q.lineWidth = 0.015;
  q.beginPath(); q.moveTo(0.01, -1.2); q.lineTo(0.19, -1.2); q.stroke();
});
e.at(0.1, -1.18, 'bucket');
e.at(0.1, -1.18);
