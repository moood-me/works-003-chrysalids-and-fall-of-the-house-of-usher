var t = e.t,
  s = e.state || {},
  an = +(s.adults_near || 0),
  mo = 1 - 0.85 * an,
  ro = +(s.rosalind || 0);
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
var L = LIS(1),
  w = 1 - L;
var C = "#2b2620",
  D2 = "#6a4436";
g.lineCap = "round";
g.lineJoin = "round";
g.fillStyle = C;
g.strokeStyle = C;
var hx = 0.05,
  hy = -0.99;
var k1 = (0.4 + 0.6 * w) * mo;
var sw1 = (0.06 * Math.sin(t * 0.9) + 0.03 * Math.sin(t * 0.37)) * k1,
  sw2 = (0.06 * Math.sin(t * 0.9 + 2.1) + 0.03 * Math.sin(t * 0.41 + 1)) * k1;
function lg(sw, o) {
  ln(hx + o, hy, -0.27 + o, -1.0, 0.11);
  ln(-0.27 + o, -1.0, -0.3 + o + sw, -0.63, 0.085);
  el(-0.34 + o + sw, -0.61, 0.065, 0.03);
}
lg(sw2, 0.04);
lg(sw1, 0);
g.fillStyle = D2;
g.beginPath();
g.moveTo(hx + 0.1, hy - 0.08);
g.lineTo(hx + 0.1, hy + 0.04);
g.quadraticCurveTo(-0.15, hy + 0.13, -0.31, hy + 0.07);
g.lineTo(-0.31, hy - 0.06);
g.quadraticCurveTo(-0.1, hy - 0.1, hx - 0.02, hy - 0.12);
g.closePath();
g.fill();
var a = 0.28 * w - 0.05 * L;
var sx = hx - 0.42 * Math.sin(a),
  sy = hy - 0.42 * Math.cos(a) + 0.005 * Math.sin(t * 1.2);
tor(hx, hy, sx, sy, 0.1, 0.11);
g.fillStyle = C;
var ang = -0.3 * w + 0.3 * L;
var nx = sx - 0.015,
  ny = sy - 0.065,
  hcx = nx + 0.1 * Math.sin(ang),
  hcy = ny - 0.1 * Math.cos(ang);
ln(sx, sy, nx, ny, 0.07);
el(hcx, hcy, 0.083, 0.1, ang);
g.beginPath();
g.moveTo(hcx - 0.02, hcy - 0.1);
g.quadraticCurveTo(hcx + 0.13, hcy - 0.06, hcx + 0.1 + 0.015 * Math.sin(t * 0.7), hcy + 0.3);
g.lineTo(hcx + 0.03, hcy + 0.22);
g.quadraticCurveTo(hcx + 0.06, hcy, hcx - 0.02, hcy - 0.1);
g.fill();
arm(sx + 0.02, sy + 0.03, hx + 0.17, -0.98, 0.5, 0.06, -1);
arm(sx, sy + 0.03, hx - 0.12, -0.98, 0.5, 0.065, -1);
if (ro > 0.01) e.light(hcx, hcy, 0.5, "#f0c890", ro * 0.35);
e.at(hcx, hcy - 0.12);
