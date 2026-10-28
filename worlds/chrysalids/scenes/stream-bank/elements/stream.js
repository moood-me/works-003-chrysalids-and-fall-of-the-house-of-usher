// the stream (a plane seen from above: x across, y toward us, its middle 3.9 m off): its gravel banks, its water dark
// under the far bank and pale toward us, the sun's shimmer where it is ahead; its glints and the threads of its flow —
// stream.wgsl (they move on the GPU)
const cy = x => 0.8 * Math.sin(x / 6 - 0.3) + 0.1 * Math.sin(x / 2.7 + 1);
const hw = x => 0.62 + 0.12 * Math.sin(x / 4.3 + 2);
function band(a, b) {
  g.beginPath();
  for (let x = -35; x <= 35; x += 0.25) g.lineTo(x, cy(x) - hw(x) - a);
  for (let x = 35; x >= -35; x -= 0.25) g.lineTo(x, cy(x) + hw(x) + b);
  g.closePath();
}
band(0.5, 0.24);
g.fillStyle = '#7f7b5e';
g.fill();
for (let i = 0; i < 900; i++) {
  const x = -34 + e.rnd() * 68, far = e.rnd() < 0.55;
  const o = far ? -(hw(x) - 0.05 + e.rnd() * 0.5) : hw(x) - 0.05 + e.rnd() * 0.26;
  const y = cy(x) + o, r = 0.012 + e.rnd() * 0.035, t = e.rnd();
  g.fillStyle = t < 0.4 ? '#cbc29f' : t < 0.75 ? '#9a9275' : '#6c6754';
  g.globalAlpha = 0.85;
  g.beginPath();
  g.ellipse(x, y, r * 1.5, r, e.rnd() * 3, 0, 7);
  g.fill();
  if (t < 0.75) {
    g.globalAlpha = 0.5;
    g.fillStyle = '#ece2c0';
    g.beginPath();
    g.ellipse(x - r * 0.4, y - r * 0.3, r * 0.6, r * 0.35, 0, 0, 7);
    g.fill();
  }
}
g.globalAlpha = 1;
band(0.03, 0.03);
g.fillStyle = '#5d5a49';
g.globalAlpha = 0.6;
g.fill();
g.globalAlpha = 1;
band(0, 0);
const wg = g.createLinearGradient(0, -0.8, 0, 0.9);
wg.addColorStop(0, '#36402f');
wg.addColorStop(0.3, '#56635a');
wg.addColorStop(0.62, '#7d8a84');
wg.addColorStop(1, '#4b5446');
g.fillStyle = wg;
g.fill();
g.save();
band(0, 0);
g.clip();
for (let i = 0; i < 260; i++) {
  const x = -34 + e.rnd() * 68, y = cy(x) + (e.rnd() * 1.6 - 0.4) * hw(x);
  g.globalAlpha = 0.18;
  g.fillStyle = e.rnd() < 0.5 ? '#4e5546' : '#a7a88e';
  g.beginPath();
  g.ellipse(x, y, 0.05 + e.rnd() * 0.05, 0.03, 0, 0, 7);
  g.fill();
}
g.globalAlpha = 0.35;
g.fillStyle = '#3e4636';
g.beginPath();
for (let x = -35; x <= 35; x += 0.25) g.lineTo(x, cy(x) - hw(x));
for (let x = 35; x >= -35; x -= 0.25) g.lineTo(x, cy(x) - hw(x) + 0.12 + 0.06 * Math.sin(x * 3.1) + 0.04 * Math.sin(x * 7.3));
g.closePath();
g.fill();
const sx = -1.4, sh = g.createRadialGradient(sx, 0.1, 0, sx, 0.1, 3.2);
sh.addColorStop(0, 'rgba(255,238,200,0.55)');
sh.addColorStop(1, 'rgba(255,240,205,0)');
g.globalAlpha = 1;
g.fillStyle = sh;
g.fillRect(sx - 4, -1.5, 8, 3);
g.restore();
