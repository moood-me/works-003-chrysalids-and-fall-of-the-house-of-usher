// The yard beyond the gate (a plane seen from above): beaten earth, a pale path from the gate across it and away
g.fillStyle = '#6e6450';
g.fillRect(-80, -32, 160, 64);
for (let i = 0; i < 40; i++) {
  const x = -80 + e.rnd() * 160, y = -32 + e.rnd() * 64, r = 3 + e.rnd() * 8;
  g.fillStyle = e.rnd() < 0.5 ? 'rgba(70,64,48,0.25)' : 'rgba(130,124,100,0.2)';
  g.beginPath();
  g.ellipse(x, y, r, r * 0.4, 0, 0, 7);
  g.fill();
}
const Lf = [], Rt = [];
for (let y = 32; y >= -32; y -= 1) {
  const d = 32 - y, c = 1.6 + d * 0.35 + 1.5 * Math.sin(d * 0.08), w = 1.4 * (1 - d / 90);
  Lf.push([c - w, y]);
  Rt.push([c + w, y]);
}
g.fillStyle = '#9a8e72';
g.beginPath();
g.moveTo(Lf[0][0], Lf[0][1]);
for (const q of Lf) g.lineTo(q[0], q[1]);
for (let i = Rt.length - 1; i >= 0; i--) g.lineTo(Rt[i][0], Rt[i][1]);
g.closePath();
g.fill();
