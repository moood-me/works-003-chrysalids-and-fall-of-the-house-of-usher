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
function sh(L) {
  g.save();
  g.fillStyle = "rgba(60,48,32,0.25)";
  g.beginPath();
  g.ellipse(-L, 0.02 - L * 0.1, L, Math.max(0.03, L * 0.04), -0.18, 0, 7);
  g.fill();
  g.restore();
}
var L = LIS(0),
  w = 1 - L;
sh(1.9);
var C = "#29251f";
g.fillStyle = C;
g.strokeStyle = C;
g.lineCap = "round";
g.lineJoin = "round";
var c = Math.sin(t * 0.8) * mo,
  br = 0.006 * Math.sin(t * 1.3) * mo;
var a = w * (0.4 + 0.06 * c);
var hx = 0,
  hy = -0.74;
var sx = hx + 0.46 * Math.sin(a),
  sy = hy - 0.46 * Math.cos(a) + br;
var bf = -0.08 - 0.14 * w,
  ff = 0.1 + 0.12 * w;
leg(hx - 0.03, hy, bf, -0.01, -0.02, 0.12);
leg(hx + 0.03, hy, ff, 0.02, 0.03 + 0.03 * w, 0.12);
el(bf + 0.04, -0.01, 0.085, 0.035);
el(ff + 0.05, 0.02, 0.085, 0.035);
tor(hx, hy, sx, sy, 0.1, 0.12);
el(hx, hy, 0.11, 0.08);
var ux = Math.sin(a),
  uy = -Math.cos(a);
var nx = sx + ux * 0.07 + 0.02,
  ny = sy + uy * 0.07;
var ang = a + 0.35 * w - 0.3 * L;
var hcx = nx + 0.1 * Math.sin(ang),
  hcy = ny - 0.1 * Math.cos(ang);
ln(sx, sy, nx, ny, 0.08);
el(hcx, hcy, 0.09, 0.105, ang);
el(hcx - 0.02, hcy - 0.025, 0.088, 0.085, ang);
function lp(p, q) {
  return [p[0] + (q[0] - p[0]) * w, p[1] + (q[1] - p[1]) * w];
}
var wb = [0.98 + 0.05 * c, 0.12 - 0.1 * Math.max(0, c)],
  wh = [sx + 0.38, sy + 0.34 + 0.05 * c];
var B = lp([0.34, 0.04], wb),
  Hd = lp([0.3, -0.96], wh);
var vx = Hd[0] - B[0],
  vy = Hd[1] - B[1],
  vl = Math.sqrt(vx * vx + vy * vy) || 0.001;
var T = lp([0.29, -1.11], [Hd[0] + (vx / vl) * 0.3, Hd[1] + (vy / vl) * 0.3]);
arm(sx - 0.02, sy + 0.03, Hd[0] - 0.02, Hd[1] + 0.03, 0.54, 0.075);
g.lineWidth = 0.035;
g.beginPath();
g.moveTo(B[0], B[1]);
g.lineTo(T[0], T[1]);
g.stroke();
el(B[0] + 0.06, B[1] - 0.01, 0.08, 0.03, 0.2);
arm(sx + 0.01, sy + 0.02, Hd[0], Hd[1], 0.54, 0.08);
e.at(hcx, hcy - 0.15);
