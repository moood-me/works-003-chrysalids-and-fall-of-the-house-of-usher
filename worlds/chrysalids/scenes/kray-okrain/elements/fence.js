// The boundary fence (12 m): posts and two rails, the gap where the path goes through (lib.GAP); its point `gap`
const { GAP } = e.lib;
g.strokeStyle = '#6a5c4a';
g.fillStyle = '#6a5c4a';
g.lineCap = 'round';
const posts = [];
for (let k = 0; k <= 27; k++) { const x = -34 + k * 2.6; if (Math.abs(x - GAP) < 1.0) continue; posts.push([x + (e.rnd() - 0.5) * 0.4, 1.05 + e.rnd() * 0.35]); }
for (const [x, h] of posts) { g.beginPath(); g.moveTo(x - 0.07, 0.05); g.lineTo(x - 0.05, -h); g.lineTo(x + 0.05, -h - 0.03); g.lineTo(x + 0.07, 0.05); g.fill(); }
g.lineWidth = 0.08;
for (const r of [0.42, 0.9]) {
  for (let i = 0; i < posts.length - 1; i++) {
    const a = posts[i], b = posts[i + 1];
    if (a[0] < GAP && b[0] > GAP) continue;
    g.beginPath();
    g.moveTo(a[0], -r * a[1]);
    g.quadraticCurveTo((a[0] + b[0]) / 2, -r * (a[1] + b[1]) / 2 + 0.07, b[0], -r * b[1]);
    g.stroke();
  }
}
