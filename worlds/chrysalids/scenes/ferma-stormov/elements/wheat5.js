var w = 0.5 + (e.state.wind == null ? 0.4 : e.state.wind);
var A1 = 5.8;
g.fillStyle = e.color;
g.beginPath();
g.moveTo(-62, 0.3);
for (var x = -62; x <= A1; x += 0.4) {
  var s = Math.sin(e.t * 0.65 + x * 0.27) * 0.6 + Math.sin(e.t * 0.39 + x * 0.08) * 0.4;
  var tp = Math.min(1, (A1 - x) / 1.5);
  g.lineTo(x + s * 0.1 * w, (-1.05 + 0.05 * Math.sin(x * 4.1) + s * 0.04) * (0.5 + 0.5 * tp));
}
g.lineTo(A1, 0.3);
g.closePath();
g.fill();
