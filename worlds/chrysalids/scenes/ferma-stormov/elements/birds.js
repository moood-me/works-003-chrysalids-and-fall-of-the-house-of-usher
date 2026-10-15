var A = e.aspect;
g.strokeStyle = "rgba(40,34,56,0.75)";
g.lineWidth = 0.0018;
g.lineCap = "round";
for (var i = 0; i < 5; i++) {
  var bx = e.rnd(),
    by = e.rnd(),
    ph = e.rnd() * 6;
  var x = (((bx * 1.4 + e.t * 0.0035) % 1.4) * (A + 0.6)) / 1.4 - 0.3 + 0.01 * Math.sin(e.t * 0.2 + ph);
  var y = 0.16 + by * 0.14 + 0.01 * Math.sin(e.t * 0.13 + ph);
  var s = 0.0055 + 0.002 * by;
  var f = Math.sin(e.t * 2.2 + ph * 3) * 0.5;
  g.beginPath();
  g.moveTo(x - s, y - s * (0.2 + f));
  g.quadraticCurveTo(x - s * 0.4, y - s * (0.5 + f * 0.6), x, y);
  g.quadraticCurveTo(x + s * 0.4, y - s * (0.5 + f * 0.6), x + s, y - s * (0.2 + f));
  g.stroke();
}
