// the coffin's lid, seen from above (the head to the left): planks of dark wood within a raised edge. On the coffin's
// walls, slid toward the foot by lid_x (0.75: off her face and breast), as high as lid_h (0.37 on them, more lifted off
// them). Its points — where hands take it: on its far edge by the head (lid#r, lid#l: his right and left hand facing us
// over it), on the far half by the foot (lid#n)
g.fillStyle = "#5e4a3d";
g.fillRect(-1.03, -0.32, 2.06, 0.64);
g.strokeStyle = "rgba(30,22,18,0.6)";
g.lineWidth = 0.01;
for (var i = 1; i < 4; i++) {
  g.beginPath();
  g.moveTo(-0.95, -0.32 + i * 0.16);
  g.lineTo(0.95, -0.32 + i * 0.16);
  g.stroke();
}
g.strokeStyle = "rgba(130,100,78,0.35)";
g.lineWidth = 0.005;
for (var k = 0; k < 9; k++) {
  var y = -0.3 + k * 0.07;
  g.beginPath();
  g.moveTo(-0.95, y);
  g.bezierCurveTo(-0.3, y + 0.01, 0.4, y - 0.008, 0.95, y + 0.004);
  g.stroke();
}
// the raised edge round the panel
g.strokeStyle = "#7d6452";
g.lineWidth = 0.012;
g.strokeRect(-0.97, -0.26, 1.94, 0.52);
e.at(-0.95, -0.24, "r");
e.at(-0.55, -0.24, "l");
e.at(0.0, -0.14, "n");
e.at(0, 0);
