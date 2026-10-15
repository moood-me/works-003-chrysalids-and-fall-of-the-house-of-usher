var w = 0.5 + (e.state.wind == null ? 0.4 : e.state.wind);
function tf(x, h, s) {
  g.beginPath();
  for (var j = 0; j < 5; j++) {
    var a = (j - 2) * 0.18 + s * 0.1;
    g.moveTo(x + (j - 2) * 0.02, 0.02);
    g.quadraticCurveTo(x + a * h * 0.3, -h * 0.5, x + a * h * 0.8, -h * (0.75 + 0.25 * Math.cos(j)));
  }
  g.stroke();
}
g.strokeStyle = e.color;
g.lineWidth = 0.018;
g.lineCap = "round";
for (var i = 0; i < 8; i++) {
  var x = -1.0 + e.rnd() * 2.9,
    h = 0.18 + e.rnd() * 0.22,
    p = e.rnd() * 6;
  var s = (Math.sin(e.t * 0.8 + p) * 0.6 + Math.sin(e.t * 0.5 + x) * 0.4) * w;
  tf(x, h, s);
}
