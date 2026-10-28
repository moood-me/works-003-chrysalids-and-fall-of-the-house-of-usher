// the far arch, 4.7 m off (facing us): the stone round its opening — the face of its pillars and the band of its
// voussoirs, the soffit's curve shading in toward the crown, courses on the pillars; on the right pillar the iron
// holder where the torch is left. Daylight colours: the torch lights it
var W = 2.75, S = 1.9, A = 2.95, cy = -1.7;
function opening(k) {
  g.save();
  g.translate(0, cy);
  g.scale(k, k);
  g.translate(0, -cy);
  g.moveTo(-W, 1);
  g.lineTo(-W, -S);
  g.bezierCurveTo(-W, -S - 0.75, -0.45 * W, -A + 0.1, 0, -A);
  g.bezierCurveTo(0.45 * W, -A + 0.1, W, -S - 0.75, W, -S);
  g.lineTo(W, 1);
  g.closePath();
  g.restore();
}
g.save();
g.beginPath();
g.rect(-14, -8, 28, 8);
g.clip();
g.beginPath();
g.rect(-14, -8, 28, 9);
opening(1);
var gr = g.createLinearGradient(0, -6, 0, 0);
gr.addColorStop(0, "#3a474c");
gr.addColorStop(1, "#5c6c72");
g.fillStyle = gr;
g.fill("evenodd");
// the soffit's band
g.beginPath();
opening(1);
opening(0.93);
var sb = g.createLinearGradient(-W, 0, W, 0);
sb.addColorStop(0, "#56656b");
sb.addColorStop(0.5, "#617178");
sb.addColorStop(1, "#6b7c83");
g.fillStyle = sb;
g.fill("evenodd");
g.beginPath();
opening(1);
opening(0.93);
g.clip("evenodd");
var vg = g.createLinearGradient(0, -3, 0, -1.5);
vg.addColorStop(0, "rgba(20,30,34,0.45)");
vg.addColorStop(1, "rgba(20,30,34,0)");
g.fillStyle = vg;
g.fillRect(-6, -4, 12, 2.5);
g.strokeStyle = "rgba(22,32,36,0.55)";
g.lineWidth = 0.012;
for (var i = 1; i < 14; i++) {
  var a = Math.PI + (i * Math.PI) / 14;
  g.beginPath();
  g.moveTo(0, cy);
  g.lineTo(Math.cos(a) * 5, cy + Math.sin(a) * 5);
  g.stroke();
}
for (var j = 0; j < 5; j++) {
  var yy = -0.35 - j * 0.36;
  g.beginPath();
  g.moveTo(-4, yy);
  g.lineTo(4, yy);
  g.stroke();
}
g.restore();
// the courses of the wall round it
g.save();
g.beginPath();
g.rect(-14, -8, 28, 9);
opening(1);
g.clip("evenodd");
g.strokeStyle = "rgba(22,32,36,0.4)";
g.lineWidth = 0.012;
for (var y = -0.42; y > -8; y -= 0.42) {
  g.beginPath();
  g.moveTo(-12, y);
  g.lineTo(12, y);
  g.stroke();
}
g.restore();
// the arris of the opening, worn pale
g.save();
g.beginPath();
g.rect(-14, -8, 28, 8);
g.clip();
g.strokeStyle = "rgba(190,205,208,0.3)";
g.lineWidth = 0.018;
g.beginPath();
opening(1);
g.stroke();
g.restore();
// the damp at the pillars' feet
var sg = g.createLinearGradient(0, -0.5, 0, 0);
sg.addColorStop(0, "rgba(16,26,30,0)");
sg.addColorStop(1, "rgba(16,26,30,0.5)");
g.fillStyle = sg;
g.fillRect(-12, -0.5, 12 - W, 0.5);
g.fillRect(W, -0.5, 12 - W, 0.5);
// the iron holder on the right pillar, where the torch is left: a bracket and its ring
g.strokeStyle = "#1c2225";
g.lineWidth = 0.03;
g.beginPath();
g.moveTo(3.0, -1.42);
g.lineTo(3.0, -1.62);
g.stroke();
g.lineWidth = 0.018;
g.beginPath();
g.ellipse(3.0, -1.6, 0.05, 0.015, 0, 0, 7);
g.stroke();
