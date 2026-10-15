// the passage beyond the iron door, seen through the doorway: a low stone wall, the floor, and steps rising to the right
// toward the house. Stone in its daylight colours: the torch lights it when it comes near the doorway or through it
g.fillStyle = "#3e484b";
g.fillRect(-2, -2.8, 4.5, 2.9);
// the far wall's stones
for (var y = 0; y > -2.8; ) {
  var h = 0.3 + e.rnd() * 0.12;
  for (var x = -2 - e.rnd() * 0.5; x < 2.5; ) {
    var w = 0.5 + e.rnd() * 0.5, v = e.rnd();
    g.fillStyle = v < 0.5 ? "rgba(20,28,31," + (0.1 + v * 0.2).toFixed(3) + ")" : "rgba(150,165,168," + ((v - 0.5) * 0.12).toFixed(3) + ")";
    g.fillRect(x, y - h, w, h);
    g.strokeStyle = "rgba(18,25,28,0.45)";
    g.lineWidth = 0.012;
    g.strokeRect(x, y - h, w, h);
    x += w;
  }
  y -= h;
}
// the steps, rising to the right: each tread's worn lip a little lighter, its riser darker
for (var s = 0; s < 9; s++) {
  var sx = 0.35 + s * 0.26, sy = -s * 0.19;
  g.fillStyle = s % 2 ? "#4a5559" : "#505c60";
  g.fillRect(sx, sy - 0.19, 2.6, 0.21);
  g.fillStyle = "rgba(170,185,188,0.35)";
  g.fillRect(sx, sy - 0.19, 2.6, 0.014);
  g.fillStyle = "rgba(15,20,22,0.35)";
  g.fillRect(sx, sy - 0.05, 2.6, 0.05);
}
// the floor's foot of the wall, in its own dust
var fl = g.createLinearGradient(0, -0.3, 0, 0.1);
fl.addColorStop(0, "rgba(20,26,28,0)");
fl.addColorStop(1, "rgba(20,26,28,0.6)");
g.fillStyle = fl;
g.fillRect(-2, -0.3, 4.5, 0.4);
