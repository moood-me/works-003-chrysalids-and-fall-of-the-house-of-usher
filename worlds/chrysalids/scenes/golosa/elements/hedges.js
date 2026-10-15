var t = e.t;
g.fillStyle = "#1a1e33";
var rows = [
  [-5800, -2600, 0],
  [-1900, -300, 0.5],
  [400, 2300, 0.2],
  [3000, 5800, 0.7],
];
for (var r = 0; r < rows.length; r++) {
  var a = rows[r][0],
    b = rows[r][1];
  g.beginPath();
  g.moveTo(a, 6);
  for (var x = a; x <= b; x += 25) {
    var hh = 9 + 6 * Math.sin(x * 0.013 + r) + 4 * Math.sin(x * 0.041 + r * 2) + 3 * e.rnd();
    g.lineTo(x, -hh);
  }
  g.lineTo(b, 6);
  g.closePath();
  g.fill();
}
var mg = g.createLinearGradient(0, -14, 0, 6);
mg.addColorStop(0, "rgba(70,72,100,0)");
mg.addColorStop(0.7, "rgba(70,72,100," + (0.2 + 0.05 * Math.sin(t * 0.1)) + ")");
mg.addColorStop(1, "rgba(70,72,100,0)");
g.fillStyle = mg;
g.fillRect(-6000, -14, 12000, 20);
