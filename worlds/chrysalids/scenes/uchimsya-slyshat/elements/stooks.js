var t = 0;
var X = [-24, -21.5, -6, -3.2, -0.5, 8, 10.8, 13.5, 24, 26.6, 29.3, 36];
for (var i = 0; i < X.length; i++) {
  var x = X[i] + 0.2 * Math.sin(i * 2.3),
    h = 1.0 + 0.15 * Math.sin(i * 1.7);
  g.fillStyle = "rgba(70,56,38,0.2)";
  g.beginPath();
  g.ellipse(x - 1.3, 0, 1.3, 0.06, 0, 0, 7);
  g.fill();
  g.fillStyle = "#a48f5e";
  g.beginPath();
  g.moveTo(x - 0.55, 0);
  g.quadraticCurveTo(x - 0.35, -h * 0.6, x - 0.08, -h * 0.82);
  g.lineTo(x - 0.12, -h);
  g.lineTo(x + 0.1, -h * 0.98);
  g.lineTo(x + 0.08, -h * 0.82);
  g.quadraticCurveTo(x + 0.35, -h * 0.6, x + 0.55, 0);
  g.closePath();
  g.fill();
  g.fillStyle = "#c9b47c";
  g.beginPath();
  g.moveTo(x + 0.02, 0);
  g.quadraticCurveTo(x + 0.05, -h * 0.5, x + 0.06, -h * 0.82);
  g.quadraticCurveTo(x + 0.35, -h * 0.6, x + 0.55, 0);
  g.closePath();
  g.fill();
  g.strokeStyle = "rgba(255,236,190,0.6)";
  g.lineWidth = 0.05;
  g.beginPath();
  g.moveTo(x + 0.08, -h * 0.82);
  g.quadraticCurveTo(x + 0.35, -h * 0.6, x + 0.55, 0);
  g.stroke();
  g.fillStyle = "#7e6c46";
  g.fillRect(x - 0.12, -h * 0.84, 0.22, 0.06);
}
