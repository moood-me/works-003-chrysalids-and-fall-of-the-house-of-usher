// the coffin's near side (on coffin_box: its bottom's middle, x along it, the head at −1): dark polished wood, its plinth
// moulding, the grain of its boards, its two handles. Its points — where the bearers' hands hold it: the corners of its
// ends, by its top (coffin#head, coffin#foot; the far side's are coffin_far's)
g.fillStyle = "#2c221c";
g.fillRect(-1.0, -0.04, 2.0, 0.04);
var sg = g.createLinearGradient(0, -0.34, 0, -0.04);
sg.addColorStop(0, "#5a463a");
sg.addColorStop(1, "#3e3028");
g.fillStyle = sg;
g.fillRect(-1.0, -0.34, 2.0, 0.3);
// the grain of the boards
g.strokeStyle = "rgba(120,90,68,0.35)";
g.lineWidth = 0.006;
for (var i = 0; i < 4; i++) {
  g.beginPath();
  g.moveTo(-0.98, -0.1 - i * 0.06);
  g.bezierCurveTo(-0.3, -0.11 - i * 0.06, 0.3, -0.085 - i * 0.062, 0.96, -0.1 - i * 0.06);
  g.stroke();
}
// the handles, dull iron
g.strokeStyle = "#8a8478";
g.lineWidth = 0.014;
for (var hx of [-0.62, 0.6]) {
  g.beginPath();
  g.moveTo(hx - 0.09, -0.2);
  g.quadraticCurveTo(hx, -0.13, hx + 0.09, -0.2);
  g.stroke();
}
// its top edge, a rounded lip catching what light there is
g.strokeStyle = "#7a6250";
g.lineWidth = 0.008;
g.beginPath();
g.moveTo(-1.0, -0.336);
g.lineTo(1.0, -0.336);
g.stroke();
e.at(-0.97, -0.27, "head");
e.at(0.97, -0.27, "foot");
e.at(0, -0.3);
