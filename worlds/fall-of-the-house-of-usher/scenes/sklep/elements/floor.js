// the vault's floor (seen from above, its middle 5 m off, y toward us): flags in courses, damp and pale by turns; under
// the plinth a square of old tiles, cracked, green with damp. Daylight colours:
// the torch lays its pool here itself, wherever it burns
g.fillStyle = "#515f63";
g.fillRect(-10, -5, 20, 10);
for (var j = 0; j < 13; j++) {
  var y0 = -5 + j * 0.8, off = e.rnd() * 0.8;
  for (var i = -11; i < 11; i++) {
    var v = e.rnd();
    g.fillStyle = v < 0.5 ? "rgba(18,30,34," + (0.08 + v * 0.3).toFixed(3) + ")" : "rgba(170,190,192," + ((v - 0.5) * 0.14).toFixed(3) + ")";
    g.fillRect(i + off + 0.02, y0 + 0.02, 0.96, 0.76);
  }
}
// (the joints between the flags)
g.strokeStyle = "rgba(20,28,30,0.55)";
g.lineWidth = 0.02;
for (var j2 = 0; j2 < 13; j2++) {
  var yj = -5 + j2 * 0.8;
  g.beginPath();
  g.moveTo(-10, yj);
  g.lineTo(10, yj);
  g.stroke();
}
// the tiles under the plinth
var cx = -0.5, cy = -0.1, cw = 3.8, cd = 2.2;
g.fillStyle = "#6a7468";
g.fillRect(cx - cw / 2, cy - cd / 2, cw, cd);
for (var a = 0; a < 6; a++)
  for (var b = 0; b < 3; b++) {
    var t = e.rnd();
    g.fillStyle = t < 0.4 ? "rgba(70,110,92,0.35)" : t < 0.75 ? "rgba(28,34,32,0.35)" : "rgba(140,105,70,0.28)";
    g.fillRect(cx - cw / 2 + (a * cw) / 6, cy - cd / 2 + (b * cd) / 3, cw / 6, cd / 3);
  }
g.strokeStyle = "rgba(22,28,26,0.6)";
g.lineWidth = 0.02;
g.strokeRect(cx - cw / 2, cy - cd / 2, cw, cd);
for (var a2 = 1; a2 < 6; a2++) {
  g.beginPath();
  g.moveTo(cx - cw / 2 + (a2 * cw) / 6, cy - cd / 2);
  g.lineTo(cx - cw / 2 + (a2 * cw) / 6, cy + cd / 2);
  g.stroke();
}
for (var b2 = 1; b2 < 3; b2++) {
  g.beginPath();
  g.moveTo(cx - cw / 2, cy - cd / 2 + (b2 * cd) / 3);
  g.lineTo(cx + cw / 2, cy - cd / 2 + (b2 * cd) / 3);
  g.stroke();
}
// the brass studs at the tiles' corners, dulled
g.fillStyle = "rgba(190,165,120,0.35)";
for (var a3 = 0; a3 <= 6; a3++)
  for (var k = 0; k < 7; k++) {
    g.beginPath();
    g.arc(cx - cw / 2 + (a3 * cw) / 6, cy - cd / 2 + (k * cd) / 6, 0.018, 0, 7);
    g.fill();
  }
