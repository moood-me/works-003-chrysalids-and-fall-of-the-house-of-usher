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
    g.save();
    g.scale(1.04, 1);
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
    var a1 = o.arm || 0,
      hx = 0.078 + a1 * 0.11,
      hy = -0.45 - a1 * 0.13,
      ex = 0.09 + a1 * 0.03,
      ey = -0.6 + a1 * 0.02;
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
    g.lineTo(-0.042 + 0.006 * sx, -0.096);
    g.quadraticCurveTo(0.006 * sx, -0.108, 0.052 + 0.006 * sx, -0.096);
    g.lineTo(0.054 + 0.006 * sx, -0.038);
    g.closePath();
    g.fill();
    g.restore();
  }
  function woman() {
    var B = br,
      sw = 0.006 * Math.sin(t * 0.6 + ph) + 0.003 * Math.sin(t * 1.37 + ph);
    g.beginPath();
    g.moveTo(-0.07, -0.57);
    g.bezierCurveTo(-0.095, -0.4, -0.14, -0.15, -0.158 + sw, 0);
    g.quadraticCurveTo(-0.08, 0.01, 0, 0.003);
    g.quadraticCurveTo(0.08, 0.01, 0.15 + sw, 0);
    g.bezierCurveTo(0.13, -0.15, 0.092, -0.4, 0.07, -0.57);
    g.closePath();
    g.fill();
    g.beginPath();
    g.moveTo(-0.068, -0.56);
    g.lineTo(-0.078, -0.76 - B);
    g.quadraticCurveTo(-0.07, -0.796 - B, -0.03, -0.8 - B);
    g.lineTo(0.03, -0.8 - B);
    g.quadraticCurveTo(0.074, -0.79 - B, 0.074, -0.75 - B);
    g.quadraticCurveTo(0.086, -0.68, 0.068, -0.56);
    g.closePath();
    g.fill();
    g.beginPath();
    g.moveTo(-0.092, -0.772 - B);
    g.quadraticCurveTo(-0.114, -0.68, -0.104, -0.595);
    g.quadraticCurveTo(-0.02, -0.615, 0.062, -0.64);
    g.quadraticCurveTo(0.1, -0.7, 0.086, -0.778 - B);
    g.quadraticCurveTo(0, -0.818 - B, -0.092, -0.772 - B);
    g.closePath();
    g.fill();
    g.lineWidth = 0.04;
    g.beginPath();
    g.moveTo(0.05, -0.74);
    g.quadraticCurveTo(0.072, -0.63, 0.09, -0.588);
    g.stroke();
    g.beginPath();
    g.ellipse(0.093, -0.583, 0.021, 0.024, 0, 0, 7);
    g.fill();
    g.fillRect(-0.016, -0.835 - B, 0.036, 0.05);
    g.save();
    g.translate(0.004, -0.862 - B);
    g.rotate((o.tilt || 0) * sx);
    g.beginPath();
    g.ellipse(0.003 * sx, 0, 0.041, 0.051, 0, 0, 7);
    g.fill();
    g.beginPath();
    g.moveTo(0.032 * sx, -0.004);
    g.lineTo(0.052 * sx, 0.014);
    g.lineTo(0.034 * sx, 0.022);
    g.closePath();
    g.fill();
    g.beginPath();
    g.moveTo(-0.01 * sx, 0.04);
    g.quadraticCurveTo(0.028 * sx, 0.058, 0.04 * sx, 0.03);
    g.lineTo(0, 0.02);
    g.closePath();
    g.fill();
    if (o.bon && !o.rimpass) g.fillStyle = o.bon;
    g.save();
    g.scale(sx, 1);
    g.beginPath();
    g.moveTo(-0.056, 0.046);
    g.lineTo(-0.066, 0.0);
    g.quadraticCurveTo(-0.062, -0.07, 0.0, -0.076);
    g.quadraticCurveTo(0.064, -0.077, 0.086, -0.036);
    g.lineTo(0.082, 0.002);
    g.quadraticCurveTo(0.054, -0.026, 0.03, -0.022);
    g.quadraticCurveTo(0.004, -0.006, 0.0, 0.05);
    g.closePath();
    g.fill();
    g.beginPath();
    g.moveTo(-0.07, 0.028);
    g.quadraticCurveTo(-0.045, 0.08, 0.006, 0.064);
    g.lineTo(0.0, 0.04);
    g.lineTo(-0.058, 0.022);
    g.closePath();
    g.fill();
    if (o.bon && !o.rimpass && o.bonHi) {
      var hg = g.createLinearGradient(0.08, -0.07, -0.03, 0.02);
      hg.addColorStop(0, o.bonHi);
      hg.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = hg;
      g.beginPath();
      g.moveTo(-0.066, 0.0);
      g.quadraticCurveTo(-0.062, -0.07, 0.0, -0.076);
      g.quadraticCurveTo(0.064, -0.077, 0.086, -0.036);
      g.lineTo(0.082, 0.002);
      g.quadraticCurveTo(0.054, -0.026, 0.03, -0.022);
      g.closePath();
      g.fill();
    }
    g.restore();
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
    if (o.w) woman();
    else man();
    g.restore();
  }
  if (o.rim) {
    o.rimpass = 1;
    pass(1.6 * e.px, -0.8 * e.px, o.rim, o.ra || 0.7);
    o.rimpass = 0;
  }
  pass(0, 0, o.col || "#2b2330", 1);
}
var t = e.t,
  s = e.state || {},
  gl = s.glance == null ? 0 : +s.glance,
  dk = s.dusk == null ? 0.2 : +s.dusk;
var RIM = "#ecbe8a";
SH(g, 0, 0.3, 3.8 + 3 * dk, 19, 0.34);
SH(g, 1.6, 0.3, 3.6 + 3 * dk, 19, 0.34);
SH(g, 2.38, 0.32, 3.8 + 3 * dk, 19, 0.34);
P(g, { x: 1.6, w: 1, s: 1.64, f: 1, hd: 1, tilt: 0.06, col: "#2a2230", bon: "#3a3138", rim: "#e0b080", ph: 0.9 }, e);
P(g, { x: 2.38, s: 1.82, f: -1, hd: 1, tilt: 0.1, arm: 0.15, col: "#2a2230", rim: "#e0b080", ph: 2.4 }, e);
var k = gl * gl * (3 - 2 * gl);
P(
  g,
  {
    x: 0,
    w: 1,
    s: 1.78,
    f: 1,
    hd: Math.cos(Math.PI * k * 0.9),
    tilt: -0.02,
    lean: -0.01,
    col: "#2a2230",
    bon: "#c9b8a0",
    bonHi: "rgba(250,226,190,0.55)",
    rim: RIM,
    ra: 0.85,
    ph: 1.5,
  },
  e,
);
e.at(0, -1.7);
