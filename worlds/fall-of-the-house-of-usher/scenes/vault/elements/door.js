// the iron door: a leaf hung on its left edge (the anchor, at the doorway's left jamb), turned by door_turn (180 shut in
// the doorway … 280 swung wide into the vault, its free edge toward us); painted from the hinge to the right, in its
// daylight colours (cold iron: the torch warms it as it comes near). Its ring (door#ring), by its free edge, is where a
// hand pulls it
function leaf() {
  g.beginPath();
  g.moveTo(0, 0);
  g.lineTo(0, -1.35);
  g.arc(0.55, -1.35, 0.55, Math.PI, 0);
  g.lineTo(1.1, 0);
  g.closePath();
}
leaf();
var lg = g.createLinearGradient(0, 0, 1.1, 0);
lg.addColorStop(0, "#454f53");
lg.addColorStop(1, "#56636a");
g.fillStyle = lg;
g.fill();
g.save();
leaf();
g.clip();
// its plates, the seams between them
for (var p = 1; p < 4; p++) {
  g.fillStyle = "rgba(18,24,27,0.55)";
  g.fillRect(p * 0.275 - 0.004, -2, 0.008, 2);
}
// rust bleeding down from the bands
g.filter = "blur(0.02px)";
for (var r0 = 0; r0 < 7; r0++) {
  var rx = 0.08 + e.rnd() * 0.95, ry = e.rnd() < 0.5 ? -0.33 : -1.43;
  var rg = g.createLinearGradient(0, ry, 0, ry + 0.25 + e.rnd() * 0.3);
  rg.addColorStop(0, "rgba(110,60,35,0.45)");
  rg.addColorStop(1, "rgba(110,60,35,0)");
  g.fillStyle = rg;
  g.fillRect(rx, ry, 0.02 + e.rnd() * 0.04, 0.55);
}
g.filter = "none";
// its iron bands and their rivets
g.strokeStyle = "#252c2f";
g.lineWidth = 0.045;
g.beginPath();
g.moveTo(-0.05, -0.35);
g.lineTo(1.15, -0.35);
g.moveTo(-0.05, -1.45);
g.lineTo(1.15, -1.45);
g.stroke();
g.fillStyle = "#8a9597";
for (var r = 0; r < 6; r++) {
  g.beginPath();
  g.arc(0.13 + r * 0.17, -0.35, 0.014, 0, 7);
  g.arc(0.13 + r * 0.17, -1.45, 0.014, 0, 7);
  g.fill();
}
// the lock plate and its keyhole at the free edge; the ring under it
g.fillStyle = "#30393c";
g.fillRect(0.92, -1.27, 0.1, 0.18);
g.fillStyle = "#050708";
g.fillRect(0.962, -1.21, 0.016, 0.05);
g.strokeStyle = "#7d8789";
g.lineWidth = 0.016;
g.beginPath();
g.arc(0.97, -1.0, 0.055, 0, 7);
g.stroke();
g.restore();
e.at(0.97, -0.98, "ring");
e.at(0.55, -1.0);
