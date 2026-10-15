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
  g.fillStyle = "rgba(70,56,38,0.2)";
  g.beginPath();
  g.ellipse(-L, 0, L, Math.max(0.03, L * 0.03), 0, 0, 7);
  g.fill();
  g.restore();
}
var L = LIS(2),
  w = 1 - L;
sh(1.6);
g.fillStyle = "#4a4234";
g.fillRect(-2.35, -1.95, 0.07, 1.95);
g.fillRect(2.57, -1.95, 0.07, 1.95);
function ly(x) {
  var u = (x + 2.3) / 4.9;
  return (1 - u) * (1 - u) * -1.95 + 2 * u * (1 - u) * -1.18 + u * u * -1.95;
}
g.strokeStyle = "#4a4234";
g.lineWidth = Math.max(0.02, e.px * 0.7);
g.beginPath();
for (var x = -2.3; x <= 2.61; x += 0.1) g.lineTo(x, ly(x));
g.stroke();
function sheet(x0, x1, len, ph) {
  var sw = 0.07 * Math.sin(t * 0.5 + ph) + 0.03 * Math.sin(t * 1.3 + ph * 2);
  g.beginPath();
  g.moveTo(x0, ly(x0));
  for (var x = x0; x <= x1; x += 0.1) g.lineTo(x, ly(x));
  for (var k = 8; k >= 0; k--) {
    var x = x0 + ((x1 - x0) * k) / 8;
    g.lineTo(x + sw * (0.7 + 0.3 * Math.sin(k)), ly(x) + len + 0.05 * Math.sin(t * 0.7 + k * 1.3 + ph));
  }
  g.closePath();
  var gg = g.createLinearGradient(0, -1.9, 0, -0.5);
  gg.addColorStop(0, "#f1e7cf");
  gg.addColorStop(1, "#d9cca9");
  g.fillStyle = gg;
  g.fill();
}
sheet(-2.1, -0.55, 1.05, 0);
sheet(1.0, 1.45, 0.6, 1.7);
sheet(1.75, 2.4, 0.8, 3.1);
g.fillStyle = "#8c7656";
el(-0.2, -0.12, 0.28, 0.13);
g.fillStyle = "#e6dcc4";
el(-0.2, -0.22, 0.24, 0.06);
var C = "#2b2620";
g.fillStyle = C;
g.strokeStyle = C;
g.lineCap = "round";
g.lineJoin = "round";
var X = 0.4,
  c = Math.sin(t * 0.7) * mo;
var hy = -0.68,
  sx = X + 0.02,
  sy = -1.08 + 0.005 * Math.sin(t * 1.2);
leg(X - 0.03, hy, X - 0.07, -0.02, 0, 0.085);
leg(X + 0.03, hy, X + 0.08, -0.02, 0, 0.085);
el(X - 0.04, -0.03, 0.07, 0.03);
el(X + 0.12, -0.03, 0.07, 0.03);
g.beginPath();
g.moveTo(sx - 0.1, sy + 0.03);
g.lineTo(sx + 0.1, sy + 0.03);
g.quadraticCurveTo(X + 0.16, hy, X + 0.24 + 0.02 * c, -0.36);
g.lineTo(X - 0.2 + 0.02 * c, -0.36);
g.quadraticCurveTo(X - 0.14, hy, sx - 0.1, sy + 0.03);
g.fill();
tor(X, hy, sx, sy, 0.09, 0.105);
var ang = -0.3 * w + 0.22 * L;
var nx = sx + 0.02,
  ny = sy - 0.06,
  hcx = nx + 0.095 * Math.sin(ang) + 0.01,
  hcy = ny - 0.095 * Math.cos(ang);
ln(sx, sy, nx, ny, 0.07);
el(hcx, hcy, 0.083, 0.1, ang);
g.lineWidth = 0.04;
g.beginPath();
g.moveTo(hcx - 0.07, hcy);
g.quadraticCurveTo(hcx - 0.12, hcy + 0.12, hcx - 0.1 + 0.02 * Math.sin(t * 0.8), hcy + 0.26);
g.stroke();
var lyN = ly(X + 0.28),
  lyF = ly(X + 0.16);
var Hn = [X + 0.28 - 0.23 * L, lyN + 0.02 + 0.02 * c + (-0.72 - lyN - 0.02) * L];
var Hf = [X + 0.16, lyF + 0.03 + 0.02 * c * w];
arm(sx - 0.02, sy + 0.02, Hf[0], Hf[1], 0.5, 0.06);
arm(sx + 0.01, sy + 0.02, Hn[0], Hn[1], 0.5, 0.065);
e.at(hcx, hcy - 0.12);
