const S = e.state || {},
  s = S.season ?? 0,
  t = e.t;
const M = (a, b, k) => "rgb(" + a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(",") + ")";
const go = M([182, 152, 92], [124, 108, 84], s),
  sh = M([134, 110, 66], [96, 84, 68], s);
for (let x = -48; x < 48; x += 3.6 + e.rnd() * 1.6) {
  const k = e.rnd(),
    h = 1.25 + e.rnd() * 0.25,
    l = (e.rnd() - 0.5) * 0.1;
  if (k < s * 1.15 || (x > -24 && x < -6)) continue;
  g.fillStyle = go;
  g.beginPath();
  g.moveTo(x - 0.5, 0.02);
  g.bezierCurveTo(x - 0.46, -h * 0.4, x - 0.26 + l, -h * 0.82, x - 0.06 + l, -h);
  g.quadraticCurveTo(x + l, -h - 0.14, x + 0.08 + l, -h);
  g.bezierCurveTo(x + 0.26 + l, -h * 0.82, x + 0.46, -h * 0.4, x + 0.52, 0.02);
  g.closePath();
  g.fill();
  g.fillStyle = sh;
  g.beginPath();
  g.moveTo(x + 0.03 + l, -h + 0.04);
  g.bezierCurveTo(x + 0.24 + l, -h * 0.8, x + 0.44, -h * 0.4, x + 0.52, 0.02);
  g.lineTo(x + 0.08, 0.02);
  g.bezierCurveTo(x + 0.1, -h * 0.4, x + 0.05 + l, -h * 0.7, x + 0.03 + l, -h + 0.04);
  g.fill();
  g.strokeStyle = go;
  g.lineWidth = 0.035;
  g.lineCap = "round";
  for (let j = 0; j < 5; j++) {
    const sw = 0.02 * Math.sin(t * 0.6 + x + j);
    g.beginPath();
    g.moveTo(x + l, -h + 0.05);
    g.lineTo(x + l + (j - 2) * 0.09 + sw, -h - 0.1 - 0.04 * (j % 2));
    g.stroke();
  }
}
