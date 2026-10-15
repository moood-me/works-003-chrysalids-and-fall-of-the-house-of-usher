var t = e.t,
  s = e.state || {},
  an = +(s.adults_near || 0);
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
function leg(hx, hy, fx, fy, kb, w) {
  var kx = (hx + fx) / 2 + kb,
    ky = (hy + fy) / 2;
  ln(hx, hy, kx, ky, w);
  ln(kx, ky, fx, fy, w * 0.8);
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
g.save();
g.fillStyle = "rgba(70,56,38,0.22)";
g.beginPath();
g.ellipse(-1.5, 0, 3.5, 0.1, 0, 0, 7);
g.fill();
g.restore();
var C = "#2a2520";
g.fillStyle = C;
g.strokeStyle = C;
g.lineCap = "round";
g.lineJoin = "round";
var mv = 1 - an;
var st = Math.sin(t * 0.9) * mv;
horse(3.0, -1, st, 0.05 + 0.05 * Math.sin(t * 0.4) * mv);
ln(1.15, -0.4, 2.35, -1.15, Math.max(0.025, e.px * 0.7));
ln(1.15, -0.05, -0.05, -0.9, 0.06);
ln(0.35, -0.4, -0.05, -0.82, 0.05);
g.beginPath();
g.moveTo(1.0, 0);
g.lineTo(1.35, -0.02);
g.lineTo(1.15, -0.22);
g.closePath();
g.fill();
var a = 0.42 * (1 - an) + 0.04 * Math.sin(t * 0.9) * mv;
var hx = -0.45,
  hy = -0.93;
var sx = hx + 0.56 * Math.sin(a),
  sy = hy - 0.56 * Math.cos(a);
leg(hx - 0.03, hy, hx - 0.18 - 0.14 * st, -0.02, -0.02, 0.14);
leg(hx + 0.03, hy, hx + 0.18 + 0.14 * st, -0.02, 0.04, 0.14);
el(hx - 0.15 - 0.14 * st, -0.03, 0.1, 0.04);
el(hx + 0.23 + 0.14 * st, -0.03, 0.1, 0.04);
tor(hx, hy, sx, sy, 0.13, 0.16);
el(hx, hy, 0.13, 0.09);
var hd = 1 - 2 * Math.max(0, Math.min(1, (an - 0.3) * 2.5));
var nx = sx + 0.03 * Math.sin(a),
  ny = sy - 0.08,
  hcx = nx + 0.04 * hd * Math.cos(a) + 0.08 * Math.sin(a),
  hcy = ny - 0.1 - 0.03 * an;
ln(sx, sy, nx, ny, 0.1);
el(hcx, hcy, 0.1, 0.12);
el(hcx + 0.07 * hd, hcy + 0.07, 0.06, 0.07);
el(hcx, hcy - 0.09, 0.2, 0.035);
el(hcx, hcy - 0.13, 0.11, 0.07);
var Hd = [-0.05 + (hx + 0.05 + 0.05) * an * 0, -0.92];
arm(sx - 0.03, sy + 0.03, -0.08, -0.9 + 0.05 * an, 0.7, 0.09);
var H2 = [-0.02 + (hx + 0.02) * an, -0.92 + 0.05 * an];
arm(sx, sy + 0.03, H2[0], H2[1], 0.7, 0.095);
e.at(hcx, hcy - 0.2);
