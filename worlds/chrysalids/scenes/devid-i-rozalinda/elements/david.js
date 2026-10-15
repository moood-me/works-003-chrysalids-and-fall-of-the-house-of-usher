function SH(g, x, w, L, d, a) {
  var dy = (1.7 * L * 0.7) / d;
  var gr = g.createLinearGradient(x, 0, x - L, dy);
  gr.addColorStop(0, "rgba(40,28,36," + a + ")");
  gr.addColorStop(1, "rgba(40,28,36,0)");
  g.fillStyle = gr;
  g.beginPath();
  g.moveTo(x + w, 0);
  g.quadraticCurveTo(x, 0.04 * w, x - w, 0.01);
  g.lineTo(x - L - w * 0.4, dy + w * 0.12);
  g.quadraticCurveTo(x - L, dy + w * 0.5, x - L + w * 0.6, dy + w * 0.2);
  g.closePath();
  g.fill();
}
function P(g, o, e) {
  var t = e.t,
    s = o.s || 1.75,
    f = o.f || 1,
    ph = o.ph || 0;
  var br = 0.005 * Math.sin(t * 1.05 + ph) + 0.002 * Math.sin(t * 0.37 + ph * 2);
  var hd = o.hd == null ? 1 : o.hd;
  var sx = hd >= 0 ? Math.max(0.45, hd) : Math.min(-0.45, hd);
  var ln = (o.lean || 0) + 0.006 * Math.sin(t * 0.23 + ph) + 0.003 * Math.sin(t * 0.61 + ph * 3);
  function man() {
    var B = br,
      st = o.step || 0;
    g.beginPath();
    g.moveTo(-0.07, -0.47);
    g.lineTo(-0.006, -0.47);
    g.lineTo(-0.016, -0.04);
    g.lineTo(-0.06, -0.04);
    g.closePath();
    g.fill();
    g.beginPath();
    g.moveTo(-0.066, 0);
    g.lineTo(-0.064, -0.048);
    g.lineTo(-0.014, -0.048);
    g.quadraticCurveTo(0.03, -0.036, 0.034, 0);
    g.closePath();
    g.fill();
    g.beginPath();
    g.moveTo(-0.004, -0.47);
    g.lineTo(0.06, -0.47);
    g.lineTo(0.056 + st, -0.04);
    g.lineTo(0.016 + st, -0.04);
    g.closePath();
    g.fill();
    g.beginPath();
    g.moveTo(0.012 + st, 0);
    g.lineTo(0.014 + st, -0.048);
    g.lineTo(0.06 + st, -0.048);
    g.quadraticCurveTo(0.1 + st, -0.036, 0.104 + st, 0);
    g.closePath();
    g.fill();
    var hw = o.slim ? 0.94 : 1.04;
    g.save();
    g.scale(hw, 1);
    g.beginPath();
    g.moveTo(-0.045, -0.848 - B);
    g.quadraticCurveTo(-0.1, -0.842 - B, -0.11, -0.78 - B);
    g.quadraticCurveTo(-0.12, -0.55, -0.125, -0.285);
    g.quadraticCurveTo(-0.01, -0.272, 0.106, -0.288);
    g.lineTo(0.1, -0.56);
    g.quadraticCurveTo(0.108, -0.69 - B, 0.09, -0.778 - B);
    g.quadraticCurveTo(0.076, -0.838 - B, 0.03, -0.85 - B);
    g.closePath();
    g.fill();
    g.restore();
    g.lineWidth = 0.05;
    g.beginPath();
    g.moveTo(-0.082, -0.77 - B);
    g.quadraticCurveTo(-0.118, -0.6, -0.1, -0.455);
    g.stroke();
    g.beginPath();
    g.ellipse(-0.099, -0.44, 0.022, 0.028, 0, 0, 7);
    g.fill();
    var hx = o.hand[0],
      hy = o.hand[1],
      ex = (0.06 + hx) / 2 + 0.01,
      ey = (-0.77 + hy) / 2 + 0.07;
    g.beginPath();
    g.moveTo(0.058, -0.77 - B);
    g.quadraticCurveTo(ex, ey, hx, hy);
    g.stroke();
    g.beginPath();
    g.ellipse(hx + 0.004, hy + 0.012, 0.022, 0.027, 0, 0, 7);
    g.fill();
    g.fillRect(-0.02, -0.89 - B, 0.046, 0.06);
    g.save();
    g.translate(0.004, -0.918 - B);
    g.rotate((o.tilt || 0) * sx);
    g.beginPath();
    g.ellipse(0.004 * sx, 0, 0.046, 0.056, 0, 0, 7);
    g.fill();
    g.beginPath();
    g.moveTo(0.036 * sx, -0.014);
    g.lineTo(0.06 * sx, 0.01);
    g.lineTo(0.04 * sx, 0.018);
    g.closePath();
    g.fill();
    g.beginPath();
    g.moveTo(-0.012 * sx, 0.045);
    g.quadraticCurveTo(0.03 * sx, 0.062, 0.045 * sx, 0.028);
    g.lineTo(0, 0.02);
    g.closePath();
    g.fill();
    g.beginPath();
    g.ellipse(0.008 * sx, -0.036, 0.098, 0.014, 0, 0, 7);
    g.fill();
    g.beginPath();
    g.moveTo(-0.044 + 0.006 * sx, -0.038);
    g.lineTo(-0.042 + 0.006 * sx, -0.088);
    g.quadraticCurveTo(0.006 * sx, -0.1, 0.052 + 0.006 * sx, -0.088);
    g.lineTo(0.054 + 0.006 * sx, -0.038);
    g.closePath();
    g.fill();
    g.restore();
  }
  function pass(dx, dy, c, al) {
    g.save();
    g.globalAlpha *= al;
    g.translate(o.x + dx, dy);
    g.scale(s * f, s);
    g.rotate(ln * f);
    g.fillStyle = c;
    g.strokeStyle = c;
    g.lineCap = "round";
    g.lineJoin = "round";
    man();
    g.restore();
  }
  if (o.rim) {
    pass(1.6 * e.px, -0.8 * e.px, o.rim, o.ra || 0.7);
  }
  pass(0, 0, o.col || "#2b2330", 1);
}
var t = e.t,
  s = e.state || {},
  gl = s.glance == null ? 0 : +s.glance,
  dk = s.dusk == null ? 0.2 : +s.dusk;
var C = "#241d27",
  RIM = "#dcae80";
SH(g, 0, 0.32, 4 + 3.5 * dk, 10, 0.4);
var cx = -2.15;
var csg = g.createLinearGradient(cx, 0, cx - 9, 0.9);
csg.addColorStop(0, "rgba(40,28,36,0.42)");
csg.addColorStop(1, "rgba(40,28,36,0)");
g.fillStyle = csg;
g.beginPath();
g.moveTo(cx + 1.5, 0);
g.lineTo(cx - 3.2, 0);
g.lineTo(cx - 10, 0.75);
g.lineTo(cx - 3, 0.85);
g.closePath();
g.fill();
g.fillStyle = C;
g.strokeStyle = C;
g.lineCap = "round";
g.lineWidth = 0.07;
g.beginPath();
g.moveTo(cx - 1.35, -0.9);
g.quadraticCurveTo(cx - 2.3, -0.55, cx - 3.15, -0.04);
g.stroke();
g.lineWidth = 0.06;
g.beginPath();
g.moveTo(cx - 1.4, -0.82);
g.quadraticCurveTo(cx - 2.1, -0.45, cx - 2.75, 0.0);
g.stroke();
g.beginPath();
g.moveTo(cx - 1.5, -0.72);
g.lineTo(cx + 1.5, -0.72);
g.lineTo(cx + 1.55, -1.22);
g.lineTo(cx - 1.6, -1.22);
g.closePath();
g.fill();
g.fillStyle = "rgba(225,175,130,0.18)";
g.fillRect(cx - 1.6, -1.24, 3.15, 0.05);
g.fillStyle = C;
for (var i = 0; i < 3; i++) {
  g.beginPath();
  g.ellipse(cx - 0.8 + i * 0.55, -1.28 - 0.03 * i, 0.3, 0.2, 0.1 * i, 0, 7);
  g.fill();
}
g.fillRect(cx - 1.55, -1.6, 0.08, 0.4);
g.fillRect(cx - 1.25, -1.45, 0.5, 0.08);
function wheel(x, r) {
  g.strokeStyle = C;
  g.lineWidth = 0.07;
  g.beginPath();
  g.arc(x, -r, r - 0.035, 0, 7);
  g.stroke();
  g.lineWidth = 0.035;
  for (var k = 0; k < 12; k++) {
    var a = (k * Math.PI) / 6 + 0.1;
    g.beginPath();
    g.moveTo(x, -r);
    g.lineTo(x + Math.cos(a) * r * 0.95, -r + Math.sin(a) * r * 0.95);
    g.stroke();
  }
  g.beginPath();
  g.arc(x, -r, 0.09, 0, 7);
  g.fill();
  g.strokeStyle = "rgba(225,175,130,0.25)";
  g.lineWidth = 0.02;
  g.beginPath();
  g.arc(x + 0.012, -r - 0.006, r - 0.005, -1.4, 0.3);
  g.stroke();
}
wheel(cx + 0.95, 0.58);
wheel(cx - 0.95, 0.46);
var k = gl * gl * (3 - 2 * gl);
P(
  g,
  {
    x: 0,
    s: 1.8,
    f: -1,
    slim: 1,
    hd: Math.cos(Math.PI * k * 0.88),
    tilt: 0.14 - 0.1 * k,
    lean: -0.04,
    hand: [0.33, -0.66],
    col: C,
    rim: RIM,
    ra: 0.8,
    ph: 0.5,
    step: -0.02,
  },
  e,
);
e.at(0, -1.75);
