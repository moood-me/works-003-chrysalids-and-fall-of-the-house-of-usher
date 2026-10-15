var w = 0.5 + (e.state.wind == null ? 0.4 : e.state.wind);
var A1 = -0.1;
g.fillStyle = e.color;
g.beginPath();
g.moveTo(-28, 0.3);
for (var x = -28; x <= A1; x += 0.15) {
  var s = Math.sin(e.t * 0.72 + x * 0.4) * 0.6 + Math.sin(e.t * 0.43 + x * 0.11) * 0.4;
  var tp = Math.min(1, (A1 - x) / 1.0);
  g.lineTo(x + s * 0.1 * w, (-1.08 + 0.05 * Math.sin(x * 6.3) + s * 0.04) * (0.5 + 0.5 * tp));
}
g.lineTo(A1, 0.3);
g.closePath();
g.fill();
g.strokeStyle = "rgba(125,104,94,0.4)";
g.lineWidth = 0.025;
g.beginPath();
for (var x = -28; x <= A1 - 0.4; x += 0.18) {
  var s = Math.sin(e.t * 0.72 + x * 0.4) * 0.6 + Math.sin(e.t * 0.43 + x * 0.11) * 0.4;
  var hx = x + s * 0.12 * w,
    hy = -1.1 + 0.05 * Math.sin(x * 6.3);
  g.moveTo(hx, hy);
  g.lineTo(hx + s * 0.03, hy - 0.13);
}
g.stroke();
