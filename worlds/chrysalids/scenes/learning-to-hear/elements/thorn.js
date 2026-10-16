var t = 0;
g.save();
g.fillStyle = "rgba(50,42,28,0.22)";
g.beginPath();
g.ellipse(-5, 0.05, 5, 0.18, 0, 0, 7);
g.fill();
g.restore();
var C = "#4a4932";
g.fillStyle = C;
g.strokeStyle = C;
g.lineCap = "round";
g.beginPath();
g.moveTo(-0.35, 0.05);
g.quadraticCurveTo(-0.1, -1.5, 0.5, -2.6);
g.lineTo(0.75, -2.5);
g.quadraticCurveTo(0.25, -1.4, 0.3, 0.05);
g.closePath();
g.fill();
g.lineWidth = 0.13;
g.beginPath();
g.moveTo(0.55, -2.5);
g.quadraticCurveTo(1.5, -3.0, 2.6, -3.3);
g.moveTo(0.5, -2.55);
g.quadraticCurveTo(0.2, -3.3, -0.7, -3.7);
g.moveTo(0.6, -2.6);
g.quadraticCurveTo(1.0, -3.6, 1.2, -4.4);
g.stroke();
var sw = 0.06 * Math.sin(t * 0.35) + 0.03 * Math.sin(t * 0.83);
g.beginPath();
for (var i = 0; i < 26; i++) {
  var a = i * 2.399,
    rr = Math.sqrt((i + 0.5) / 26);
  var cx = 0.9 + Math.cos(a) * 2.2 * rr + sw * (0.5 + rr),
    cy = -4.0 + Math.sin(a) * 1.05 * rr - 0.25 * Math.cos(a * 0.5);
  var r = 0.4 + 0.25 * Math.abs(Math.sin(i * 1.9));
  g.moveTo(cx + r, cy);
  g.ellipse(cx, cy, r, r * 0.8, 0, 0, 7);
}
for (var i = 0; i < 70; i++) {
  var a = (i * 0.0898 * Math.PI * 2) / 1.0 + 0.3 * Math.sin(i * 3.1);
  var j = 0.85 + 0.2 * Math.sin(i * 2.7);
  var cx = 0.9 + Math.cos(a) * 2.75 * j + sw * 1.4 + 0.04 * Math.sin(t * 0.9 + i),
    cy = -4.05 + Math.sin(a) * 1.35 * j - 0.25 * Math.cos(a * 0.5);
  var r = 0.12 + 0.12 * Math.abs(Math.sin(i * 1.3));
  g.moveTo(cx + r, cy);
  g.ellipse(cx, cy, r, r * 0.75, a, 0, 7);
}
g.fill();
g.save();
g.clip();
var hg = g.createRadialGradient(2.6, -5.0, 0, 2.6, -5.0, 3.2);
hg.addColorStop(0, "rgba(214,198,138,0.42)");
hg.addColorStop(0.5, "rgba(214,198,138,0.1)");
hg.addColorStop(1, "rgba(214,198,138,0)");
g.fillStyle = hg;
g.fillRect(-3, -7, 8, 5);
var dg = g.createLinearGradient(0, -5, 0, -2.6);
dg.addColorStop(0, "rgba(30,28,18,0)");
dg.addColorStop(1, "rgba(30,28,18,0.35)");
g.fillStyle = dg;
g.fillRect(-3, -7, 8, 5);
g.restore();
