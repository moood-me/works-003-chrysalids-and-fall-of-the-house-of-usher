// the doorway in the back wall (the wall cuts the hole; the passage shows through it): its stone surround, and — a layer
// of its own — the cold mist breathing out of it while the iron door stands open (its animate: as open as the door)
function opening(g) {
  g.beginPath();
  g.moveTo(-0.55, 0);
  g.lineTo(-0.55, -1.35);
  g.arc(0, -1.35, 0.55, Math.PI, 0);
  g.lineTo(0.55, 0);
  g.closePath();
}
// the stone surround: dressed blocks round the arch, a shade lighter than the wall
g.beginPath();
g.moveTo(-0.78, 0.02);
g.lineTo(-0.78, -1.38);
g.arc(0, -1.38, 0.78, Math.PI, 0);
g.lineTo(0.78, 0.02);
g.closePath();
opening(g);
g.fillStyle = "#6c7b80";
g.fill("evenodd");
g.save();
g.beginPath();
g.moveTo(-0.78, 0.02);
g.lineTo(-0.78, -1.38);
g.arc(0, -1.38, 0.78, Math.PI, 0);
g.lineTo(0.78, 0.02);
g.closePath();
opening(g);
g.clip("evenodd");
g.strokeStyle = "rgba(25,34,38,0.6)";
g.lineWidth = 0.014;
for (var k = 0; k <= 8; k++) {
  var a = Math.PI + (k * Math.PI) / 8;
  g.beginPath();
  g.moveTo(Math.cos(a) * 0.55, -1.38 + Math.sin(a) * 0.55);
  g.lineTo(Math.cos(a) * 0.8, -1.38 + Math.sin(a) * 0.8);
  g.stroke();
}
for (var s = 0; s < 4; s++) {
  var yy = -0.34 * (s + 1);
  g.beginPath();
  g.moveTo(-0.8, yy);
  g.lineTo(-0.55, yy);
  g.moveTo(0.55, yy);
  g.lineTo(0.8, yy);
  g.stroke();
}
g.restore();
// the mist breathing out of the open doorway
e.layer("breath", { box: [-0.6, -0.9, 0.6, 0.05] }, function (g) {
  opening(g);
  g.clip();
  g.filter = "blur(0.05px)";
  var mg = g.createRadialGradient(-0.2, -0.05, 0, -0.2, -0.05, 0.8);
  mg.addColorStop(0, "rgba(150,175,182,0.3)");
  mg.addColorStop(1, "rgba(150,175,182,0)");
  g.fillStyle = mg;
  g.fillRect(-0.6, -0.8, 1.2, 0.8);
  g.filter = "none";
});
