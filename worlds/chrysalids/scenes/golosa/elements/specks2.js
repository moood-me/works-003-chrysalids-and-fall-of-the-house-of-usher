var t = e.t;
var X = [-1500, -700, 350, 1250, 1900];
for (var i = 0; i < X.length; i++) {
  var a = 0.55 + 0.25 * Math.sin(t * (0.17 + i * 0.05) + i * 1.7);
  g.fillStyle = "rgba(232,182,112," + a + ")";
  g.fillRect(X[i] - 0.6, -2, 1.2, 1.1);
  e.light(X[i], -1.5, 8, "#e0a868", a * 0.5);
}
