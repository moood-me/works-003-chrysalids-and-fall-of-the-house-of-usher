var A = e.aspect,
  t = e.t,
  s = e.state || {},
  hz = 0.62,
  dk = s.dusk == null ? 0.2 : +s.dusk;
function hx(c) {
  return [parseInt(c.substr(1, 2), 16), parseInt(c.substr(3, 2), 16), parseInt(c.substr(5, 2), 16)];
}
function mx(a, b, k) {
  var p = hx(a),
    q = hx(b);
  return (
    "rgb(" +
    Math.round(p[0] + (q[0] - p[0]) * k) +
    "," +
    Math.round(p[1] + (q[1] - p[1]) * k) +
    "," +
    Math.round(p[2] + (q[2] - p[2]) * k) +
    ")"
  );
}
function mxa(a, b, k, al) {
  return mx(a, b, k)
    .replace("rgb", "rgba")
    .replace(")", "," + al + ")");
}
var gr = g.createLinearGradient(0, -0.35, 0, hz + 0.04);
gr.addColorStop(0, mx("#4a4862", "#222339", dk));
gr.addColorStop(0.38, mx("#706379", "#3e3a56", dk));
gr.addColorStop(0.7, mx("#ad8a80", "#6e5568", dk));
gr.addColorStop(0.9, mx("#d6b18c", "#a3735f", dk));
gr.addColorStop(1, mx("#e2c299", "#b8846a", dk));
g.fillStyle = gr;
g.fillRect(-0.4, -0.4, A + 0.8, 1.7);
var sx = A * 0.845,
  sy = hz - 0.085 + dk * 0.11;
g.save();
g.globalCompositeOperation = "lighter";
var r1 = g.createRadialGradient(sx, sy, 0, sx, sy, 0.85);
r1.addColorStop(0, "rgba(240,200,150," + 0.32 * (1 - dk * 0.5) + ")");
r1.addColorStop(0.35, "rgba(200,150,120," + 0.12 * (1 - dk * 0.5) + ")");
r1.addColorStop(1, "rgba(160,120,120,0)");
g.fillStyle = r1;
g.fillRect(-0.4, -0.4, A + 0.8, 1.7);
var r2 = g.createRadialGradient(sx, sy, 0, sx, sy, 0.12);
r2.addColorStop(0, "rgba(255,236,200," + 0.55 * (1 - dk * 0.8) + ")");
r2.addColorStop(1, "rgba(255,236,200,0)");
g.fillStyle = r2;
g.beginPath();
g.arc(sx, sy, 0.12, 0, 7);
g.fill();
var r3 = g.createRadialGradient(sx, sy, 0, sx, sy, 0.026);
r3.addColorStop(0, "rgba(255,244,222," + 0.9 * (1 - dk) + ")");
r3.addColorStop(0.7, "rgba(255,240,210," + 0.6 * (1 - dk) + ")");
r3.addColorStop(1, "rgba(255,240,210,0)");
g.fillStyle = r3;
g.beginPath();
g.arc(sx, sy, 0.026, 0, 7);
g.fill();
g.restore();
for (var i = 0; i < 7; i++) {
  var cy = 0.17 + i * 0.055 + 0.03 * e.rnd();
  var cx = ((e.rnd() * (A + 1.6) + t * 0.0016 * (1 + i * 0.2)) % (A + 1.6)) - 0.8;
  var rx = 0.35 + e.rnd() * 0.5,
    th = 0.022 + e.rnd() * 0.025;
  var near = Math.max(0, 1 - Math.abs(cx - sx) / 1.1);
  for (var m = 0; m < 4; m++) {
    var ex = cx + (m - 1.5) * rx * 0.45,
      ey = cy + 0.006 * Math.sin(m * 1.9 + i),
      er = rx * (0.45 + 0.15 * Math.sin(m * 2.3 + i));
    g.save();
    g.translate(ex, ey);
    g.scale(1, th / er);
    var cg = g.createRadialGradient(0, 0, 0, 0, 0, er);
    cg.addColorStop(0, mxa("#8a6e7a", "#4a3f58", dk, 0.32));
    cg.addColorStop(0.6, mxa("#8a6e7a", "#4a3f58", dk, 0.14));
    cg.addColorStop(1, mxa("#8a6e7a", "#4a3f58", dk, 0));
    g.fillStyle = cg;
    g.beginPath();
    g.arc(0, 0, er, 0, 7);
    g.fill();
    g.restore();
  }
  g.save();
  g.globalCompositeOperation = "lighter";
  g.translate(cx + 0.02, cy + th * 0.5);
  g.scale(1, (th * 0.45) / rx);
  var lg = g.createRadialGradient(0, 0, 0, 0, 0, rx);
  var la = (0.04 + 0.14 * near) * (1 - dk * 0.6);
  lg.addColorStop(0, "rgba(235,180,130," + la + ")");
  lg.addColorStop(1, "rgba(235,180,130,0)");
  g.fillStyle = lg;
  g.beginPath();
  g.arc(0, 0, rx, 0, 7);
  g.fill();
  g.restore();
}
g.fillStyle = mx("#3a3040", "#241f30", dk);
for (var i = 0; i < 3; i++) {
  var bx = ((0.2 + i * 0.13 + t * (0.006 + i * 0.0013)) % (A + 0.6)) - 0.2,
    by = 0.2 + i * 0.05 + 0.01 * Math.sin(t * 0.2 + i);
  var fl = 0.004 * Math.sin(t * (2.1 + i * 0.4) + i);
  g.beginPath();
  g.moveTo(bx - 0.007, by - fl);
  g.quadraticCurveTo(bx - 0.003, by - 0.002, bx, by + 0.001);
  g.quadraticCurveTo(bx + 0.003, by - 0.002, bx + 0.007, by - fl);
  g.lineTo(bx, by + 0.0025);
  g.closePath();
  g.fill();
}
g.save();
g.globalCompositeOperation = "lighter";
for (var i = 0; i < 5; i++) {
  var y = hz - 0.01 - i * 0.018 + 0.003 * Math.sin(t * 0.06 + i);
  var cx = ((e.rnd() * A + t * 0.0015 * (1 + i * 0.3)) % (A + 0.8)) - 0.2;
  var rx = 0.4 + e.rnd() * 0.5;
  g.save();
  g.translate(cx, y);
  g.scale(1, 0.02 / rx);
  var mg = g.createRadialGradient(0, 0, 0, 0, 0, rx);
  var ma = (0.07 + 0.02 * Math.sin(t * 0.09 + i)) * (1 - dk * 0.5);
  mg.addColorStop(0, "rgba(230,190,150," + ma + ")");
  mg.addColorStop(1, "rgba(230,190,150,0)");
  g.fillStyle = mg;
  g.beginPath();
  g.arc(0, 0, rx, 0, 7);
  g.fill();
  g.restore();
}
g.restore();
