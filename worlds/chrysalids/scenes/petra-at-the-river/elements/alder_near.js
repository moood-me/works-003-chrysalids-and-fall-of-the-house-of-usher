// An alder over the water on the right, near (11 m): its trunk and three limbs; its leaves in three masses, each a layer
// swaying from where it grows
g.fillStyle = '#4e4a40';
g.beginPath();
g.moveTo(0.5, 1);
g.quadraticCurveTo(0.1, -3, 0.6, -9);
g.lineTo(1.2, -9);
g.quadraticCurveTo(0.9, -3, 1.4, 1);
g.closePath();
g.fill();
const br = [[0.45, -5.6, -2.6, -6.4, -5.0, -5.2, 0.13], [0.5, -7.3, -2.2, -8.2, -4.2, -7.9, 0.1], [0.45, -4.6, -1.2, -4.6, -2.3, -4.1, 0.07]];
g.strokeStyle = '#4e4a40';
for (const B of br) {
  g.lineWidth = B[6];
  g.beginPath();
  g.moveTo(B[0], B[1]);
  g.quadraticCurveTo(B[2], B[3], B[4], B[5]);
  g.stroke();
}
const P = (B, u) => [(1 - u) * (1 - u) * B[0] + 2 * (1 - u) * u * B[2] + u * u * B[4], (1 - u) * (1 - u) * B[1] + 2 * (1 - u) * u * B[3] + u * u * B[5]];
br.forEach((B, n) => {
  e.layer(`leaves${n}`, { pivot: [B[0], B[1]], wind: { strength: 0.15, gust: 0.6 }, box: [-7, -9.5, 2.5, -2.5] }, q => {
    for (let k = 0; k < 180; k++) {
      const p = P(B, 0.2 + e.rnd() * 0.8), dx = (e.rnd() - 0.5) * 1.3, dy = (e.rnd() - 0.35) * 0.9, r = 0.045 + e.rnd() * 0.06;
      q.fillStyle = e.rnd() < 0.55 ? '#4c5a44' : e.rnd() < 0.7 ? '#58664e' : '#647258';
      q.beginPath();
      q.ellipse(p[0] + dx, p[1] + dy, r * 1.6, r * 0.7, 0.4 + e.rnd() * 0.9, 0, 7);
      q.fill();
    }
  });
});
