function cl(v) {
  return Math.max(0, Math.min(1, v));
}
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
    g.lineTo(-0.042 + 0.006 * sx, -0.088);
    g.quadraticCurveTo(0.006 * sx, -0.1, 0.052 + 0.006 * sx, -0.088);
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
    if (o.cane) {
      g.lineWidth = 0.018;
      g.beginPath();
      g.moveTo(0.1, -0.58);
      g.lineTo(0.17, 0);
      g.stroke();
    }
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
  cr = s.crowd == null ? 1 : +s.crowd,
  dk = s.dusk == null ? 0.2 : +s.dusk,
  sw = s.someone_watching == null ? 0 : +s.someone_watching;
function at(a, d, fn) {
  g.save();
  g.translate((a * 30) / d, -1.7 + 51 / d);
  var k = 30 / d;
  g.scale(k, k);
  fn(d);
  g.restore();
}
at(-14, 38, function (d) {
  var a = cl((cr - 0.5) / 0.3);
  if (a <= 0) return;
  g.globalAlpha = a;
  var dx = -(1 - cr) * 7,
    R = "#d0a07a";
  SH(g, dx, 0.35, 3.5 + 3 * dk, d, 0.3);
  SH(g, dx + 0.8, 0.35, 3.5 + 3 * dk, d, 0.3);
  P(g, { x: dx, w: 1, s: 1.68, f: 1, hd: 1, tilt: 0.08, col: "#2f2731", rim: R, ph: 0.4 }, e);
  P(g, { x: dx + 0.75, w: 1, s: 1.62, f: -1, hd: 1, tilt: 0.12, col: "#2f2731", rim: R, ph: 1.9 }, e);
});
at(7, 30, function (d) {
  var a = cl((cr - 0.1) / 0.3);
  if (a <= 0) return;
  g.globalAlpha = a;
  var dx = (1 - cr) * 20,
    R = "#d8a87c";
  SH(g, dx - 0.4, 0.3, 3.5 + 3 * dk, d, 0.3);
  SH(g, dx + 0.35, 0.3, 3.5 + 3 * dk, d, 0.3);
  SH(g, dx + 0.95, 0.25, 2.5 + 2 * dk, d, 0.3);
  P(g, { x: dx - 0.4, s: 1.76, f: 1, hd: 1, tilt: 0.02, col: "#2c2430", rim: R, ph: 0.7 }, e);
  P(g, { x: dx + 0.35, w: 1, s: 1.64, f: -1, hd: 1, tilt: 0.1, col: "#2c2430", rim: R, ph: 2.2 }, e);
  var cb = 0.03 * Math.sin(t * 0.9);
  P(
    g,
    { x: dx + 0.95 + cb, w: 1, s: 1.08, f: -1, hd: -0.2 + 0.9 * Math.sin(t * 0.17), col: "#2c2430", rim: R, ph: 3.1 },
    e,
  );
});
at(-1, 27, function (d) {
  var a = cl((cr - 0.3) / 0.3);
  if (a <= 0) return;
  g.globalAlpha = a;
  var dx = (1 - cr) * -6,
    R = "#d4a47a";
  SH(g, dx - 0.5, 0.3, 3.6 + 3 * dk, d, 0.32);
  SH(g, dx + 0.5, 0.3, 3.6 + 3 * dk, d, 0.32);
  var ges = cl(Math.sin(t * 0.21) * 1.6 - 0.4) * 0.8;
  P(g, { x: dx - 0.48, s: 1.74, f: 1, hd: 1, tilt: 0.04, arm: ges, col: "#2c2430", rim: R, ph: 0.1 }, e);
  P(g, { x: dx + 0.5, s: 1.7, f: -1, hd: 1, tilt: 0.12, lean: 0.05, col: "#2c2430", rim: R, ph: 1.3, step: 0.03 }, e);
});
at(-2.9, 23, function (d) {
  var k = sw * sw * (3 - 2 * sw);
  SH(g, 0, 0.3, 3.5 + 3 * dk, d, 0.32);
  P(
    g,
    {
      x: 0,
      w: 1,
      s: 1.56,
      f: 1,
      hd: Math.cos(Math.PI * k * 0.92),
      tilt: 0.2 - 0.14 * k,
      lean: 0.15 - 0.08 * k,
      cane: 1,
      col: "#272029",
      bon: "#2a222b",
      rim: "#d0a07a",
      ph: 2.7,
    },
    e,
  );
});
