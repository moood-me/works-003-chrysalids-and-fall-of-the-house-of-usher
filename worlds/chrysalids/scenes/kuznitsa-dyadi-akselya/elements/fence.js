// The corner of a fence in the yard: posts, two rails, rough grass at its foot (tufts swaying in the night wind)
g.fillStyle = '#6a5a48';
g.strokeStyle = '#6a5a48';
g.lineCap = 'round';
for (const p of [[0, 1.35, 0.13], [2.4, 1.25, 0.11], [4.9, 1.3, 0.11], [7.4, 1.2, 0.1]]) {
  g.beginPath();
  g.moveTo(p[0] - p[2] * 0.6, 0.05);
  g.lineTo(p[0] - p[2] * 0.5, -p[1]);
  g.lineTo(p[0] + p[2] * 0.4, -p[1] - 0.04);
  g.lineTo(p[0] + p[2] * 0.6, 0.05);
  g.fill();
}
g.lineWidth = 0.07;
for (const r of [0.45, 0.95]) {
  g.beginPath();
  g.moveTo(0, -r * 1.35);
  g.quadraticCurveTo(3.7, -r * 1.28 + 0.06, 7.6, -r * 1.2);
  g.stroke();
}
for (let k = 0; k < 6; k++) {
  e.layer(`grass${k}`, { pivot: [-1 + k * 1.5 + 0.75, 0.05], wind: { strength: 0.4, gust: 0.5 }, box: [-1.2 + k * 1.5, -0.5, 0.7 + k * 1.5, 0.1] }, q => {
    q.fillStyle = '#5e6a40';
    for (let i = 0; i < 12; i++) {
      const x = -1 + k * 1.5 + e.rnd() * 1.5, h = 0.1 + e.rnd() * 0.35, l = (e.rnd() - 0.5) * 0.4;
      q.beginPath();
      q.moveTo(x - 0.03, 0.02);
      q.quadraticCurveTo(x + l * h * 0.4, -h * 0.6, x + l * h, -h);
      q.quadraticCurveTo(x + l * h * 0.4 + 0.01, -h * 0.5, x + 0.03, 0.02);
      q.fill();
    }
  });
}
