var t = e.t,
  s = e.state || {},
  an = +(s.adults_near || 0),
  mo = 1 - 0.85 * an;
function LIS(k) {
  var s = e.state || {},
    n = Math.round(s.children == null ? 5 : +s.children),
    an = +(s.adults_near || 0),
    th = s.threads == null ? 0.7 : +s.threads,
    ro = +(s.rosalind || 0),
    t = e.t,
    con,
    p;
  if (k == 0) {
    con = n > 1 || ro > 0.05 ? 1 : 0;
    p = 0.8 + 0.2 * Math.sin(t * 0.07);
  } else {
    con = k < n ? 1 : 0;
    if (k == 1) con = Math.max(con, Math.min(1, ro * 2));
    p = Math.max(0, Math.min(1, 0.65 + 1.4 * Math.sin(t * 0.083 + k * 2.3) + 0.3 * Math.sin(t * 0.031 + k * 1.7)));
  }
  return con * (1 - an) * Math.min(1, th * 1.6) * p;
}
function ln(a, b, c, d, w) {
  g.lineWidth = w;
  g.beginPath();
  g.moveTo(a, b);
  g.lineTo(c, d);
  g.stroke();
}
function el(x, y, rx, ry, r) {
  g.beginPath();
  g.ellipse(x, y, rx, ry, r || 0, 0, 7);
  g.fill();
}
function arm(sx, sy, hx, hy, L, w, f) {
  var dx = hx - sx,
    dy = hy - sy,
    d = Math.sqrt(dx * dx + dy * dy) || 0.001;
  var hl = L / 2,
    o = Math.sqrt(Math.max(0, hl * hl - (d * d) / 4)) * (f || 1);
  var mx = (sx + hx) / 2 - (dy / d) * o,
    my = (sy + hy) / 2 + (dx / d) * o;
  ln(sx, sy, mx, my, w);
  ln(mx, my, hx, hy, w * 0.85);
  el(hx, hy, w * 0.55, w * 0.55);
}
function tor(hx, hy, sx, sy, wh, ws) {
  var dx = sx - hx,
    dy = sy - hy,
    d = Math.sqrt(dx * dx + dy * dy);
  var nx = -dy / d,
    ny = dx / d,
    ux = dx / d,
    uy = dy / d;
  g.beginPath();
  g.moveTo(hx - nx * wh, hy - ny * wh);
  g.lineTo(hx + nx * wh, hy + ny * wh);
  g.lineTo(sx + nx * ws, sy + ny * ws);
  g.quadraticCurveTo(
    sx + nx * ws * 0.7 + ux * ws * 0.5,
    sy + ny * ws * 0.7 + uy * ws * 0.5,
    sx + ux * ws * 0.45,
    sy + uy * ws * 0.45,
  );
  g.quadraticCurveTo(
    sx - nx * ws * 0.7 + ux * ws * 0.5,
    sy - ny * ws * 0.7 + uy * ws * 0.5,
    sx - nx * ws,
    sy - ny * ws,
  );
  g.closePath();
  g.fill();
}
function horse(ox, dir, st, hd) {
  g.save();
  g.translate(ox, 0);
  g.scale(dir, 1);
  el(0, -1.22, 0.82, 0.3);
  g.beginPath();
  g.moveTo(-0.5, -1.48);
  g.quadraticCurveTo(-0.85, -1.7, -1.0, -1.98 + hd);
  g.lineTo(-1.2, -1.86 + hd);
  g.quadraticCurveTo(-0.98, -1.3, -0.75, -1.02);
  g.closePath();
  g.fill();
  el(-1.25, -1.72 + hd, 0.3, 0.11, -0.95 + hd * 0.8);
  g.beginPath();
  g.moveTo(-0.98, -1.95 + hd);
  g.lineTo(-0.95, -2.1 + hd);
  g.lineTo(-1.06, -1.98 + hd);
  g.fill();
  var LG = [
    [-0.62, 1],
    [-0.45, -1],
    [0.5, -1],
    [0.66, 1],
  ];
  for (var i = 0; i < 4; i++) {
    var x = LG[i][0],
      o = st * LG[i][1] * 0.14;
    ln(x, -1.1, x + o * 0.5, -0.55, 0.13);
    ln(x + o * 0.5, -0.55, x + o, -0.04, 0.075);
    el(x + o - 0.02, -0.03, 0.06, 0.035);
  }
  g.lineWidth = 0.09;
  g.beginPath();
  g.moveTo(0.8, -1.32);
  g.quadraticCurveTo(0.98, -1.1, 0.92 + 0.04 * Math.sin(e.t * 0.6), -0.82);
  g.stroke();
  g.restore();
}
var L = LIS(4),
  w = 1 - L;
g.save();
g.fillStyle = "rgba(70,56,38,0.2)";
g.beginPath();
g.ellipse(-3, 0, 3.2, 0.08, 0, 0, 7);
g.fill();
g.restore();
var C = "#2b2620";
g.fillStyle = C;
g.strokeStyle = C;
g.lineCap = "round";
g.lineJoin = "round";
var hd = 0.12 + 0.08 * Math.sin(t * 0.21) * mo;
horse(-2.4, 1, 0, hd);
ln(-1.15, -0.98, -2.7, -1.15, 0.05);
g.fillRect(-1.15, -1.05, 3.2, 0.22);
g.lineWidth = 0.08;
g.beginPath();
g.arc(0.5, -0.62, 0.6, 0, 7);
g.stroke();
el(0.5, -0.62, 0.09, 0.09);
g.lineWidth = 0.03;
for (var i = 0; i < 6; i++) {
  var a = (i * Math.PI) / 3;
  ln(0.5, -0.62, 0.5 + Math.cos(a) * 0.58, -0.62 + Math.sin(a) * 0.58, 0.03);
}
var hg = g.createLinearGradient(0, -1.95, 0, -1.0);
hg.addColorStop(0, "#d8c590");
hg.addColorStop(1, "#a8925f");
g.fillStyle = hg;
g.beginPath();
g.moveTo(-1.0, -1.03);
g.quadraticCurveTo(-1.15, -1.6, -0.6, -1.85);
g.quadraticCurveTo(0.5, -2.05, 1.6, -1.8);
g.quadraticCurveTo(2.15, -1.5, 2.0, -1.03);
g.closePath();
g.fill();
g.fillStyle = C;
var hx = -0.8,
  hy = -1.35;
var a = 0.35 * w + 0.04 * Math.sin(t * 0.5) * w * mo - 0.04 * L;
var sx = hx - 0.42 * Math.sin(a),
  sy = hy - 0.42 * Math.cos(a);
ln(hx + 0.02, hy, -1.08, -1.32, 0.1);
ln(-1.08, -1.32, -1.12 + 0.03 * Math.sin(t * 0.8) * mo, -1.0, 0.08);
tor(hx, hy, sx, sy, 0.09, 0.1);
var ang = -0.3 * w + 0.3 * L;
var nx = sx - 0.015,
  ny = sy - 0.065,
  hcx = nx + 0.1 * Math.sin(ang),
  hcy = ny - 0.1 * Math.cos(ang);
ln(sx, sy, nx, ny, 0.07);
el(hcx, hcy, 0.085, 0.1, ang);
var Hx = sx - 0.3,
  Hy = sy + 0.32;
arm(sx + 0.01, sy + 0.02, Hx, Hy, 0.5, 0.065, -1);
g.lineWidth = Math.max(0.02, e.px * 0.6);
g.beginPath();
g.moveTo(Hx, Hy);
g.quadraticCurveTo(-2.6, -1.2, -3.55, -1.7 + hd);
g.stroke();
e.at(hcx, hcy - 0.12);
