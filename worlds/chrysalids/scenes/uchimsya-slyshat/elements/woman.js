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
var C = "#2d2822";
g.save();
g.fillStyle = "rgba(70,56,38,0.2)";
g.beginPath();
g.ellipse(-1.4, 0, 1.4, 0.05, 0, 0, 7);
g.fill();
g.restore();
g.translate(-0.5 * an, 0);
g.fillStyle = C;
g.strokeStyle = C;
g.lineCap = "round";
g.lineJoin = "round";
var br = 0.008 * Math.sin(t * 1.1);
var lean = 0.06 * (1 - an);
g.beginPath();
g.moveTo(-0.27, 0);
g.quadraticCurveTo(-0.2, -0.5, -0.13, -0.95);
g.lineTo(0.12, -0.95);
g.quadraticCurveTo(0.2, -0.5, 0.27, 0);
g.closePath();
g.fill();
var sx = -lean,
  sy = -1.35 + br;
tor(0, -0.95, sx, sy, 0.12, 0.13);
var ang = -0.25 * (1 - an) + 0.1 * an;
var hcx = sx - 0.02 + 0.1 * Math.sin(ang),
  hcy = sy - 0.16;
ln(sx, sy, sx - 0.01, sy - 0.07, 0.08);
el(hcx, hcy, 0.085, 0.1, ang);
el(hcx + 0.08, hcy - 0.02, 0.05, 0.045);
var h1 = [-0.13 + 0.03 * an, -0.95 + -0.6 * an];
arm(sx, sy + 0.03, -0.12, -0.95, 0.62, 0.07, -1);
arm(sx + 0.01, sy + 0.03, h1[0], h1[1], 0.62, 0.075, -1);
e.at(hcx, hcy - 0.15);
