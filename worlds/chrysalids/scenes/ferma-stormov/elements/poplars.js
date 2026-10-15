var P = [
  [-6, 15],
  [-2.2, 17.5],
  [2.5, 13],
  [7.5, 16],
];
g.fillStyle = e.color;
for (var i = 0; i < P.length; i++) {
  var x = P[i][0],
    h = P[i][1],
    s = 0.15 * Math.sin(e.t * 0.4 + i * 1.9) + 0.08 * Math.sin(e.t * 0.71 + i);
  g.beginPath();
  g.moveTo(x - 0.15, 0);
  g.lineTo(x - 0.15, -1.5);
  g.bezierCurveTo(x - 1.5, -h * 0.35, x - 0.9 + s * 0.5, -h * 0.85, x + s, -h);
  g.bezierCurveTo(x + 0.9 + s * 0.5, -h * 0.85, x + 1.5, -h * 0.35, x + 0.15, -1.5);
  g.lineTo(x + 0.15, 0);
  g.closePath();
  g.fill();
}
