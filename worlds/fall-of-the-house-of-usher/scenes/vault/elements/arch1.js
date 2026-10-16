// the near arch, 2.6 m off (facing us), the frame the vault is seen through: its pillars and voussoirs, the soffit
// shading in toward the crown, a few drips of damp from it. Daylight colours: little of the torch reaches it — it
// stands dark against the lit vault, as it should
var W = 2.6, S = 1.85, A = 2.8, cy = -1.7;
function opening(k) {
  g.save();
  g.translate(0, cy);
  g.scale(k, k);
  g.translate(0, -cy);
  g.moveTo(-W, 1);
  g.lineTo(-W, -S);
  g.bezierCurveTo(-W, -S - 0.7, -0.45 * W, -A + 0.1, 0, -A);
  g.bezierCurveTo(0.45 * W, -A + 0.1, W, -S - 0.7, W, -S);
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
gr.addColorStop(0, "#334045");
gr.addColorStop(1, "#4d5c62");
g.fillStyle = gr;
g.fill("evenodd");
g.beginPath();
opening(1);
opening(0.9);
var sb = g.createLinearGradient(-W, 0, W, 0);
sb.addColorStop(0, "#47555b");
sb.addColorStop(0.55, "#53636a");
sb.addColorStop(1, "#5b6c73");
g.fillStyle = sb;
g.fill("evenodd");
g.beginPath();
opening(1);
opening(0.9);
g.clip("evenodd");
var vg = g.createLinearGradient(0, -2.9, 0, -1.6);
vg.addColorStop(0, "rgba(16,24,28,0.5)");
vg.addColorStop(1, "rgba(16,24,28,0)");
g.fillStyle = vg;
g.fillRect(-6, -4, 12, 2.5);
g.strokeStyle = "rgba(18,28,32,0.55)";
g.lineWidth = 0.01;
for (var i = 1; i < 16; i++) {
  var a = Math.PI + (i * Math.PI) / 16;
  g.beginPath();
  g.moveTo(0, cy);
  g.lineTo(Math.cos(a) * 5, cy + Math.sin(a) * 5);
  g.stroke();
}
// drips of damp hanging from the soffit
g.filter = "blur(0.04px)";
for (var d = 0; d < 6; d++) {
  var dx = -2 + e.rnd() * 4;
  g.fillStyle = "rgba(14,34,38,0.4)";
  g.beginPath();
  g.ellipse(dx, -2.75, 0.08 + e.rnd() * 0.1, 0.25, 0, 0, 7);
  g.fill();
}
g.filter = "none";
g.restore();
