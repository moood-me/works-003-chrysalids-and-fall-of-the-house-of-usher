// the stones at the edge of the stream where her foot gets caught (onLand false: painted on the bank's line), pebbles
// round them, the water lapping at their feet (stones.animate.js: each lap comes and goes)
const SX = e.lib.SX, sd = '#6d6a58', sl = '#a7a284', lit = '#efe4bb', wet = '#4f5546';
function stone(x, y, rx, ry, a) {
  g.save();
  g.translate(x, y);
  g.rotate(a);
  g.fillStyle = wet;
  g.beginPath();
  g.ellipse(0, ry * 0.15, rx * 1.02, ry * 0.95, 0, 0, 7);
  g.fill();
  const gr = g.createLinearGradient(0, -ry, 0, ry);
  gr.addColorStop(0, sl);
  gr.addColorStop(1, sd);
  g.fillStyle = gr;
  g.beginPath();
  g.ellipse(0, 0, rx, ry, 0, 0, 7);
  g.fill();
  g.strokeStyle = lit;
  g.globalAlpha = 0.8;
  g.lineWidth = 0.012;
  g.beginPath();
  g.ellipse(0, 0, rx * 0.97, ry * 0.95, 0, Math.PI * 1.1, Math.PI * 1.75);
  g.stroke();
  g.globalAlpha = 1;
  g.restore();
}
for (let i = 0; i < 18; i++) {
  const x = 0.9 + e.rnd() * 1.6, y = -0.01 + e.rnd() * 0.07, r = 0.02 + e.rnd() * 0.04;
  g.fillStyle = e.rnd() < 0.5 ? sd : sl;
  g.beginPath();
  g.ellipse(x, y, r * 1.4, r, 0, 0, 7);
  g.fill();
}
stone(SX - 0.17, -0.035, 0.15, 0.1, 0.15); // the left one, behind the ankle
stone(SX + 0.2, -0.05, 0.19, 0.13, -0.1); // the big one
stone(SX + 0.02, 0.02, 0.11, 0.07, 0.05); // the low one in front of the foot
// the water lapping at their feet
for (let i = 0; i < 6; i++) {
  const x = SX - 0.4 + i * 0.16;
  e.layer(`lap${i}`, { box: [x - 0.05, 0.05, x + 0.2, 0.1] }, q => {
    q.strokeStyle = '#e9ecd8';
    q.lineWidth = 0.008;
    q.beginPath();
    q.moveTo(x, 0.075);
    q.lineTo(x + 0.1, 0.078);
    q.stroke();
  });
}
