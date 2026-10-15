const S = e.state || {},
  s = S.season ?? 0,
  t = e.t;
const M = (a, b, k) => "rgb(" + a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(",") + ")";
const col = M([170, 160, 122], [150, 146, 136], s),
  col2 = M([156, 147, 112], [140, 136, 128], s);
const H = (x) => {
  const gp = Math.sin(x * 0.013) + 0.6 * Math.sin(x * 0.041 + 1) + 0.3 * Math.sin(x * 0.13);
  return gp > -0.4 ? (1.2 + 0.9 * Math.min(1, gp + 0.4) + 0.4 * Math.sin(x * 0.7)) * (1 - 0.25 * s) : 0.15;
};
g.fillStyle = col2;
g.beginPath();
g.moveTo(-700, 0.5);
for (let x = -700; x <= 700; x += 1) g.lineTo(x, -H(x));
g.lineTo(700, 0.5);
g.closePath();
g.fill();
g.fillStyle = col;
for (let x = -700; x < 700; x += 0.6 + e.rnd() * 1.2) {
  const h = H(x);
  const rr = e.rnd();
  if (h < 0.5) continue;
  g.beginPath();
  g.ellipse(x, -h + 0.2, 0.5 + rr * 0.8, 0.35 + rr * 0.3, 0, 0, 7);
  g.fill();
}
const tree = (x, h, sw) => {
  g.fillStyle = col2;
  g.beginPath();
  g.moveTo(x - 0.45, 0.3);
  g.quadraticCurveTo(x - 0.25, -h * 0.3, x - 0.3, -h * 0.5);
  g.lineTo(x + 0.3, -h * 0.5);
  g.quadraticCurveTo(x + 0.25, -h * 0.3, x + 0.45, 0.3);
  g.fill();
  const dens = 1 - 0.55 * s;
  for (let k = 0; k < 40; k++) {
    const a = (k / 40) * 6.28 + e.rnd() * 0.5;
    const rr = Math.sqrt(e.rnd());
    const cx = x + Math.cos(a) * h * 0.24 * rr + sw * (0.4 + rr),
      cy = -h * 0.64 + Math.sin(a) * h * 0.2 * rr - h * 0.04 * (1 - rr);
    g.globalAlpha = dens;
    g.fillStyle = k % 3 ? col : col2;
    g.beginPath();
    g.ellipse(cx, cy, h * (0.06 + 0.04 * e.rnd()), h * (0.05 + 0.035 * e.rnd()), e.rnd(), 0, 7);
    g.fill();
  }
  g.globalAlpha = 1;
};
tree(150, 17, 0.3 * Math.sin(t * 0.2) + 0.15 * Math.sin(t * 0.47));
tree(-300, 14, 0.25 * Math.sin(t * 0.23 + 1));
tree(330, 12, 0.2 * Math.sin(t * 0.19 + 2));
