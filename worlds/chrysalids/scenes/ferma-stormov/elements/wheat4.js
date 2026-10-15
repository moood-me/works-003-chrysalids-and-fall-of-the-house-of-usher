var w = 0.5 + (e.state.wind == null ? 0.4 : e.state.wind);
var A1 = 2.3;
g.fillStyle = e.color;
g.beginPath();
g.moveTo(-42, 0.3);
for (var x = -42; x <= A1; x += 0.25) {
  var s = Math.sin(e.t * 0.7 + x * 0.33) * 0.6 + Math.sin(e.t * 0.41 + x * 0.09) * 0.4;
  var tp = Math.min(1, (A1 - x) / 1.2);
  g.lineTo(x + s * 0.1 * w, (-1.08 + 0.05 * Math.sin(x * 5.3) + s * 0.04) * (0.5 + 0.5 * tp));
}
g.lineTo(A1, 0.3);
g.closePath();
g.fill();
