// the ridge of the hill behind the meadow (260 m off), its line lit by the low sun, bushes along it; on it, as
// `someone_coming` grows, a rider riding along the crest — a small dark shape (ridge.animate.js: he rides at a walk, his
// horse's legs stepping). Painted clear: the haze between is the engine's
const f = x => -(13 + 5 * Math.sin(x / 95 + 0.4) + 2.5 * Math.sin(x / 41 + 1.3) + 1 * Math.sin(x / 13));
g.beginPath();
g.moveTo(-1400, 6);
for (let x = -1400; x <= 1400; x += 6) g.lineTo(x, f(x));
g.lineTo(1400, 6);
g.closePath();
const gr = g.createLinearGradient(0, -20, 0, 5);
gr.addColorStop(0, '#74825a');
gr.addColorStop(1, '#87905f');
g.fillStyle = gr;
g.fill();
g.strokeStyle = '#e2d9a8';
g.globalAlpha = 0.45;
g.lineWidth = 0.5;
g.beginPath();
for (let x = -1400; x <= 1400; x += 6) x === -1400 ? g.moveTo(x, f(x)) : g.lineTo(x, f(x));
g.stroke();
g.globalAlpha = 1;
for (let i = 0; i < 34; i++) {
  const x = -700 + e.rnd() * 1400, r = 1.3 + e.rnd() * 2.4;
  g.fillStyle = '#5f6e48';
  g.beginPath();
  g.ellipse(x, f(x) - r * 0.65, r * 1.25, r, 0, 0, 7);
  g.fill();
}
// the rider on the crest (k: his size — drawn large enough to be read 260 m off): horse and man, and the horse's legs, each
// a layer swinging from its hip
const k = 3.6, rx = 30, ry = f(rx) + 0.3, c = '#33322b';
e.layer('far_rider', { box: [rx - 4.5, ry - 10, rx + 5.5, ry + 1] }, q => {
  q.fillStyle = c;
  q.strokeStyle = c;
  q.lineCap = 'round';
  q.translate(rx, ry);
  q.beginPath();
  q.ellipse(0, -1.15 * k, 0.72 * k, 0.3 * k, 0, 0, 7);
  q.fill();
  q.lineWidth = 0.28 * k;
  q.beginPath();
  q.moveTo(0.55 * k, -1.25 * k);
  q.lineTo(0.95 * k, -1.8 * k);
  q.stroke();
  q.beginPath();
  q.ellipse(1.05 * k, -1.78 * k, 0.22 * k, 0.1 * k, 0.5, 0, 7);
  q.fill();
  q.lineWidth = 0.08 * k;
  q.beginPath();
  q.moveTo(-0.7 * k, -1.2 * k);
  q.quadraticCurveTo(-0.95 * k, -0.9 * k, -0.9 * k, -0.6 * k);
  q.stroke();
  q.beginPath();
  q.moveTo(-0.15 * k, -1.38 * k);
  q.lineTo(0.0 * k, -2.25 * k);
  q.lineTo(0.26 * k, -2.2 * k);
  q.lineTo(0.2 * k, -1.38 * k);
  q.fill();
  q.beginPath();
  q.arc(0.13 * k, -2.42 * k, 0.16 * k, 0, 7);
  q.fill();
  q.beginPath();
  q.ellipse(0.13 * k, -2.52 * k, 0.32 * k, 0.06 * k, 0, 0, 7);
  q.fill();
});
[-0.53, -0.3, 0.45, 0.59].forEach((x, i) => {
  e.layer(`far_leg${i}`, { pivot: [rx + x * k, ry - 1.0 * k], box: [rx + x * k - 1, ry - 1.2 * k, rx + x * k + 1, ry + 0.5] }, q => {
    q.strokeStyle = c;
    q.lineCap = 'round';
    q.lineWidth = 0.2 * k;
    q.beginPath();
    q.moveTo(rx + x * k, ry - 1.0 * k);
    q.lineTo(rx + x * k, ry);
    q.stroke();
  });
});
