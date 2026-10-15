const S = e.state || {},
  s = S.season ?? 0;
const M = (a, b, t) => "rgb(" + a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(",") + ")";
const go = M([178, 148, 88], [124, 108, 84], s),
  sh = M([136, 112, 68], [98, 86, 70], s);
for (let row = 0; row < 2; row++) {
  for (let x = -88; x < 88; x += 4.5 + e.rnd() * 2) {
    const k = e.rnd(),
      h = 1.25 + e.rnd() * 0.25,
      l = (e.rnd() - 0.5) * 0.1,
      dy = row * -0.3;
    if (k < s * 1.15) continue;
    g.fillStyle = go;
    g.beginPath();
    g.moveTo(x - 0.5, dy + 0.02);
    g.bezierCurveTo(x - 0.46, dy - h * 0.4, x - 0.26 + l, dy - h * 0.82, x - 0.06 + l, dy - h);
    g.quadraticCurveTo(x + l, dy - h - 0.14, x + 0.08 + l, dy - h);
    g.bezierCurveTo(x + 0.26 + l, dy - h * 0.82, x + 0.46, dy - h * 0.4, x + 0.52, dy + 0.02);
    g.closePath();
    g.fill();
    g.fillStyle = sh;
    g.beginPath();
    g.moveTo(x + 0.03 + l, dy - h + 0.04);
    g.bezierCurveTo(x + 0.24 + l, dy - h * 0.8, x + 0.44, dy - h * 0.4, x + 0.52, dy + 0.02);
    g.lineTo(x + 0.08, dy + 0.02);
    g.bezierCurveTo(x + 0.1, dy - h * 0.4, x + 0.05 + l, dy - h * 0.7, x + 0.03 + l, dy - h + 0.04);
    g.fill();
  }
}
