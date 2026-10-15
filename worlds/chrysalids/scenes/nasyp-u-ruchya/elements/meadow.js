// the meadow from the stream to the hills (a plane seen from above: x across, y toward us, its middle 85 m off), its
// grass in pale and dark strokes, a soft light on it toward the sun; the worn path up from the stream to the Wenders'
// house (lib.PATH_LINE, the way the people walk it)
const gr = g.createLinearGradient(0, -85, 0, 85);
gr.addColorStop(0, '#c8c396');
gr.addColorStop(0.5, '#aaad7a');
gr.addColorStop(0.8, '#859060');
gr.addColorStop(1, '#5f6b40');
g.fillStyle = gr;
g.fillRect(-300, -85, 600, 170);
const lp = g.createRadialGradient(-20, -80, 0, -20, -80, 150);
lp.addColorStop(0, 'rgba(250,234,180,0.55)');
lp.addColorStop(1, 'rgba(250,234,180,0)');
g.fillStyle = lp;
g.fillRect(-300, -85, 600, 170);
for (let i = 0; i < 120; i++) {
  const x = -300 + e.rnd() * 600, y = -85 + e.rnd() * 170, w = 3 + e.rnd() * 16, h = 0.6 + e.rnd() * 3;
  g.globalAlpha = 0.1 + e.rnd() * 0.12;
  g.fillStyle = e.rnd() < 0.45 ? '#c6c28c' : '#7c8857';
  g.beginPath();
  g.ellipse(x, y, w, h, 0, 0, 7);
  g.fill();
}
for (let i = 0; i < 9; i++) {
  const y = -70 + i * 16 + e.rnd() * 6, w = 200 + e.rnd() * 150, h = 3 + e.rnd() * 4, x = -120 + e.rnd() * 240;
  g.globalAlpha = 0.16;
  g.fillStyle = i % 2 ? '#cfc893' : '#6f7c4c';
  g.beginPath();
  g.ellipse(x, y, w, h, 0, 0, 7);
  g.fill();
}
const nb = g.createLinearGradient(0, 52, 0, 82);
nb.addColorStop(0, 'rgba(70,84,48,0)');
nb.addColorStop(1, '#46552f');
g.globalAlpha = 0.75;
g.fillStyle = nb;
g.fillRect(-300, 52, 600, 33);
for (let i = 0; i < 26; i++) {
  const y = -40 + e.rnd() * 118, x = -60 + e.rnd() * 120, s = 1 + (y + 40) / 60;
  g.globalAlpha = 0.18 + e.rnd() * 0.12;
  g.fillStyle = e.rnd() < 0.6 ? '#66733f' : '#c3bd88';
  g.beginPath();
  g.ellipse(x, y, 2.5 * s + e.rnd() * 3 * s, 0.5 * s + e.rnd() * 0.5 * s, 0, 0, 7);
  g.fill();
}
// the path: a worn pale strip 0.7 m wide along a smooth line through its points (Catmull-Rom), fading at its ends
const P = e.lib.PATH_LINE.map(([a, d]) => [a, 85 - d]);
const line = [];
for (let i = 0; i < P.length - 1; i++) {
  const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
  for (let k = i ? 1 : 0; k <= 12; k++) {
    const t = k / 12, t2 = t * t, t3 = t2 * t;
    line.push([0, 1].map(j => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3)));
  }
}
g.lineCap = 'round';
g.lineJoin = 'round';
g.strokeStyle = '#b9b487';
for (const [w, a] of [[0.9, 0.25], [0.7, 0.3]]) {
  g.globalAlpha = a;
  g.lineWidth = w;
  g.beginPath();
  line.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
  g.stroke();
}
g.globalAlpha = 1;
