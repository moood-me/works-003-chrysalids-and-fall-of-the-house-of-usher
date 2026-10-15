var w = 0.5 + (e.state.wind == null ? 0.4 : e.state.wind);
var N = 28,
  X0 = -4.6,
  X1 = -1.1,
  H0 = 0.95,
  H1 = 0.45,
  C = e.color,
  LW = 0.016,
  EL = 0.055,
  EW = 0.018;
var ph, s, x, h, tx, ty;
for (var i = 0; i < N; i++) {
  x = X0 + e.rnd() * (X1 - X0);
  h = H0 + e.rnd() * H1;
  ph = e.rnd() * 6;
  var lean = (e.rnd() - 0.5) * 0.15;
  s = Math.sin(e.t * 0.62 + ph + x * 0.4) * 0.6 + Math.sin(e.t * 0.37 + x * 0.9) * 0.4;
  tx = x + lean + s * 0.09 * w;
  ty = -h;
  g.strokeStyle = C;
  g.lineWidth = LW;
  g.beginPath();
  g.moveTo(x, 1.2);
  g.quadraticCurveTo(x + lean * 0.3, -h * 0.4, tx, ty);
  g.stroke();
  if (e.rnd() < 0.85) {
    g.fillStyle = C;
    g.save();
    g.translate(tx, ty);
    g.rotate(lean * 1.5 + s * 0.12 * w);
    g.beginPath();
    g.ellipse(0, -EL, EW, EL, 0, 0, 7);
    g.fill();
    g.strokeStyle = C;
    g.lineWidth = LW * 0.5;
    g.beginPath();
    for (var k = 0; k < 3; k++) {
      g.moveTo(0, -EL * 2 + k * EL * 0.4);
      g.lineTo(-EW * 2.2, -EL * 2.6 + k * EL * 0.4);
      g.moveTo(0, -EL * 2 + k * EL * 0.4);
      g.lineTo(EW * 2.2, -EL * 2.6 + k * EL * 0.4);
    }
    g.stroke();
    g.restore();
  }
  if (e.rnd() < 0.5) {
    g.strokeStyle = C;
    g.lineWidth = LW * 0.9;
    g.beginPath();
    var ly = -h * (0.35 + e.rnd() * 0.2);
    g.moveTo(x + lean * 0.15, ly);
    g.quadraticCurveTo(x + 0.12, ly - 0.08, x + 0.2 + s * 0.03, ly + 0.05);
    g.stroke();
  }
}
