var t = e.t,
  H = 2.3;
function hy(x) {
  var k = x < 0 ? 70 : 16;
  return -H * Math.exp((-x * x) / k) - 0.02 * Math.sin(x * 1.7) - 0.015 * Math.sin(x * 3.9 + 1);
}
var gr = g.createLinearGradient(0, -2.4, 0, 6);
gr.addColorStop(0, "#181b2f");
gr.addColorStop(0.45, "#141729");
gr.addColorStop(1, "#101323");
g.fillStyle = gr;
g.beginPath();
g.moveTo(-30, 8);
for (var x = -30; x <= 16; x += 0.2) {
  g.lineTo(x, hy(x));
}
g.lineTo(16, 8);
g.closePath();
g.fill();
var rg = g.createLinearGradient(0, -2.4, 0, -1.4);
rg.addColorStop(0, "rgba(80,84,118,0.28)");
rg.addColorStop(1, "rgba(80,84,118,0)");
g.fillStyle = rg;
g.beginPath();
for (var x = -30; x <= 16; x += 0.2) {
  g.lineTo(x, hy(x));
}
for (var x = 16; x >= -30; x -= 0.2) {
  g.lineTo(x, hy(x) + 0.4);
}
g.fill();
for (var i = 0; i < 30; i++) {
  var cx = -24 + e.rnd() * 38,
    cy = hy(cx) + 0.4 + e.rnd() * 4.5,
    rx = 1 + e.rnd() * 3.5,
    ry = 0.12 + e.rnd() * 0.3,
    dark = e.rnd() < 0.5;
  g.save();
  g.translate(cx, cy);
  g.scale(1, ry / rx);
  var sg = g.createRadialGradient(0, 0, 0, 0, 0, rx);
  sg.addColorStop(0, dark ? "rgba(8,10,20,0.3)" : "rgba(40,44,68,0.3)");
  sg.addColorStop(1, "rgba(20,24,40,0)");
  g.fillStyle = sg;
  g.beginPath();
  g.arc(0, 0, rx, 0, 7);
  g.fill();
  g.restore();
}
g.fillStyle = "#10132a";
for (var i = 0; i < 230; i++) {
  var x = -24 + e.rnd() * 38;
  var b = hy(x) + 0.03 + (e.rnd() < 0.4 ? e.rnd() * 1.5 : 0);
  var n = 3 + Math.floor(e.rnd() * 4);
  var h0 = 0.1 + Math.pow(e.rnd(), 2) * 0.38;
  if (Math.abs(x + 0.1) < 1.2 && b < hy(x) + 0.1) h0 *= 0.45;
  var ph = e.rnd() * 6;
  for (var j = 0; j < n; j++) {
    var off = (j - n / 2) * 0.035;
    var h = h0 * (0.6 + 0.4 * Math.sin(j * 2.3 + i));
    var sw = h * (0.22 * Math.sin(t * 0.5 + x * 0.3 + ph) + 0.1 * Math.sin(t * 1.13 + x * 0.9 + j)) + off * 1.5;
    g.beginPath();
    g.moveTo(x + off - 0.012, b);
    g.quadraticCurveTo(x + off + sw * 0.3, b - h * 0.55, x + off + sw, b - h);
    g.quadraticCurveTo(x + off + sw * 0.3 + 0.01, b - h * 0.5, x + off + 0.012, b);
    g.fill();
  }
}
g.globalCompositeOperation = "lighter";
for (var i = 0; i < 3; i++) {
  var cx = 2 + i * 4 + 1.5 * Math.sin(t * 0.05 + i),
    cy = hy(cx) + 1.2 + i * 0.6,
    rx = 6;
  g.save();
  g.translate(cx, cy);
  g.scale(1, 0.06);
  var mg = g.createRadialGradient(0, 0, 0, 0, 0, rx);
  mg.addColorStop(0, "rgba(55,58,86," + (0.12 + 0.04 * Math.sin(t * 0.11 + i)) + ")");
  mg.addColorStop(1, "rgba(55,58,86,0)");
  g.fillStyle = mg;
  g.beginPath();
  g.arc(0, 0, rx, 0, 7);
  g.fill();
  g.restore();
}
g.globalCompositeOperation = "source-over";
for (var i = 0; i < 14; i++) {
  var x = -20 + e.rnd() * 30,
    y = hy(x) - 0.3 - e.rnd() * 1.4;
  var a = 0.5 + 0.5 * Math.sin(t * (0.6 + e.rnd()) + i * 2.3);
  a = Math.max(0, a) * 0.6;
  var dx = 0.25 * Math.sin(t * 0.13 + i),
    dy = 0.12 * Math.sin(t * 0.21 + i * 1.7);
  e.light(x + dx, y + dy, 0.12, "#d8e0c0", a * 0.5);
}
