// The forge's far wall (a card facing us, 7.5 m off): rough planks round the wide gate (its opening clear: the yard and
// the night beyond), the tools hanging on their nails over the bench — a layer (wall.animate.js stirs it a little in the
// fire's draught) —, the gate's header and its rail. The sliding door is its own element (door).
const dL = 0.9, dR = 5.0, dT = -3.4;
g.save();
g.beginPath();
g.rect(-11, -7, 22, 7.2);
g.moveTo(dL, 0.2); g.lineTo(dL, dT); g.lineTo(dR, dT); g.lineTo(dR, 0.2);
g.closePath();
g.clip('evenodd');
g.fillStyle = '#7a6046';
g.fillRect(-11, -7, 22, 7.2);
for (let x = -11; x < 11; x += 0.3 + e.rnd() * 0.14) {
  g.fillStyle = 'rgba(40,28,20,' + (0.25 + e.rnd() * 0.2) + ')';
  g.fillRect(x, -7, 0.02, 7.2);
  g.fillStyle = e.rnd() < 0.5 ? 'rgba(160,130,100,0.1)' : 'rgba(50,36,26,0.12)';
  g.fillRect(x + 0.04, -7, 0.1 + e.rnd() * 0.1, 7.2);
}
// soot over the forge, darker toward the roof
g.fillStyle = 'rgba(40,32,28,0.35)';
g.beginPath();
g.ellipse(-3.8, -5.5, 3.2, 2.6, 0, 0, 7);
g.fill();
g.restore();
// the gate's posts and header, the rail the door runs on
g.fillStyle = '#5a4430';
g.beginPath();
g.moveTo(dL - 0.28, 0.2); g.lineTo(dL - 0.26, dT - 0.3); g.lineTo(dR + 0.3, dT - 0.34); g.lineTo(dR + 0.3, 0.2);
g.lineTo(dR, 0.2); g.lineTo(dR, dT); g.lineTo(dL, dT); g.lineTo(dL, 0.2);
g.closePath();
g.fill();
g.fillStyle = '#3e3630';
g.fillRect(dL - 0.45, dT - 0.46, 10, 0.09);
// the tools on their nails: tongs, hammers, horseshoes
e.layer('tools', { pivot: [-1.2, -2.4], box: [-3, -2.6, 0.5, -1.0] }, q => {
  q.strokeStyle = '#4a4744';
  q.fillStyle = '#4a4744';
  q.lineCap = 'round';
  for (const [px, py] of [[-2.55, -2.4], [-2.2, -2.42], [-1.8, -2.4], [-1.45, -2.44], [-1.05, -2.41], [-0.55, -2.25], [-0.2, -2.28], [0.15, -2.24]]) {
    q.beginPath();
    q.arc(px, py, 0.025, 0, 7);
    q.fill();
  }
  q.lineWidth = 0.032;
  for (const tx of [-2.55, -2.2]) {
    q.beginPath();
    q.moveTo(tx, -2.4); q.quadraticCurveTo(tx - 0.07, -1.9, tx - 0.05, -1.35);
    q.moveTo(tx, -2.4); q.quadraticCurveTo(tx + 0.06, -1.9, tx + 0.08, -1.37);
    q.stroke();
  }
  for (const [hx, hy, L] of [[-1.8, -2.4, 0.55], [-1.45, -2.44, 0.72], [-1.05, -2.41, 0.46]]) {
    q.strokeStyle = '#6a5038';
    q.lineWidth = 0.035;
    q.beginPath(); q.moveTo(hx, hy); q.lineTo(hx, hy + L); q.stroke();
    q.fillStyle = '#4a4744';
    q.beginPath();
    q.moveTo(hx - 0.11, hy + L - 0.02); q.lineTo(hx + 0.11, hy + L - 0.03); q.lineTo(hx + 0.1, hy + L + 0.06); q.lineTo(hx - 0.1, hy + L + 0.07);
    q.fill();
  }
  q.strokeStyle = '#4a4744';
  q.lineWidth = 0.05;
  for (const hx of [-0.55, -0.2, 0.15]) {
    q.beginPath();
    q.moveTo(hx - 0.09, -1.99); q.lineTo(hx - 0.1, -2.17);
    q.quadraticCurveTo(hx, -2.27, hx + 0.1, -2.17); q.lineTo(hx + 0.09, -1.99);
    q.stroke();
  }
});
