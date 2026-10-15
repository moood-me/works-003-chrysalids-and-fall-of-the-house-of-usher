var w = 0.5 + (e.state.wind == null ? 0.4 : e.state.wind);
var A1 = -1.9;
g.fillStyle = e.color;
g.beginPath();
g.moveTo(-17, 0.3);
g.lineTo(-17, -0.9);
for (var x = -17; x <= A1; x += 0.08) {
  var s = Math.sin(e.t * 0.8 + x * 0.5) * 0.6 + Math.sin(e.t * 0.47 + x * 0.13) * 0.4;
  var tp = Math.min(1, (A1 - x) / 0.8);
  g.lineTo(x + s * 0.07 * w, (-0.95 + 0.05 * Math.sin(x * 9.1) + s * 0.03) * (0.55 + 0.45 * tp));
}
g.lineTo(A1, 0.3);
g.closePath();
g.fill();
for (var i = 0; i < 110; i++) {
  var x = -17 + e.rnd() * 14.6,
    h = 1.0 + e.rnd() * 0.28,
    ph = e.rnd() * 6;
  var s = Math.sin(e.t * 0.8 + x * 0.5 + ph * 0.2) * 0.6 + Math.sin(e.t * 0.47 + x * 0.13) * 0.4;
  var tx = x + s * 0.12 * w,
    ty = -h;
  g.strokeStyle = i % 3 ? "#383038" : "#463b40";
  g.lineWidth = 0.016;
  g.beginPath();
  g.moveTo(x, -0.8);
  g.quadraticCurveTo(x, -h * 0.85, tx, ty);
  g.stroke();
  g.fillStyle = i % 4 ? "#4d4141" : "#62524c";
  g.beginPath();
  g.ellipse(tx + s * 0.02, ty - 0.06, 0.02, 0.07, s * 0.2, 0, 7);
  g.fill();
}
