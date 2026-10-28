// The wrong wood (44 m): trunks too tall, crowns that are not a tree's, a few swollen and bent — painted once, the crowns
// layers swaying a little in the night air
const T = (q, x, h, k, s, col) => {
  const w = h * 0.03, cx = t => s * h * 0.1 * t * t + Math.sin(t * 3.1 * (1 + k * 0.3) + s * 4) * h * 0.03 * t;
  q.fillStyle = col;
  q.strokeStyle = col;
  q.beginPath();
  q.moveTo(x - w * 2, 0.1);
  for (let i = 0; i <= 16; i++) { const t = i / 16; let hw = w * (1.3 - 1.05 * t); if (k === 1) hw += w * 2.6 * Math.exp(-Math.pow((t - 0.42) / 0.12, 2)); q.lineTo(x + cx(t) - hw, -t * h); }
  for (let i = 16; i >= 0; i--) { const t = i / 16; let hw = w * (1.3 - 1.05 * t); if (k === 1) hw += w * 2.6 * Math.exp(-Math.pow((t - 0.42) / 0.12, 2)); q.lineTo(x + cx(t) + hw, -t * h); }
  q.lineTo(x + w * 2, 0.1);
  q.closePath();
  q.fill();
  q.beginPath();
  q.ellipse(x + cx(1), -h, h * (0.12 + 0.1 * (k % 2)), h * (0.08 + 0.05 * k), s * 0.2, 0, 7);
  q.fill();
};
for (let n = 0; n < 6; n++) {
  e.layer(`trees${n}`, { pivot: [-100 + n * 33 + 16, 0], wind: { strength: 0.06, gust: 0.4 }, box: [-104 + n * 33, -36, -63 + n * 33, 1] }, q => {
    for (let i = 0; i < 9; i++) T(q, -100 + n * 33 + e.rnd() * 33, 14 + e.rnd() * 16, Math.floor(e.rnd() * 4), e.rnd() * 2 - 1, e.rnd() < 0.5 ? '#3a4a3e' : '#46564a');
  });
}
