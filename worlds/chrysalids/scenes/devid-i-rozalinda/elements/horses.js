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
function HO(g, x, f, c, t, ph, hl, e, rim) {
  function draw(dx, dy, cc, al) {
    g.save();
    g.globalAlpha *= al;
    g.translate(x + dx, dy);
    g.scale(-f, 1);
    g.fillStyle = cc;
    g.strokeStyle = cc;
    g.lineJoin = "round";
    var br = 0.012 * Math.sin(t * 0.8 + ph) + 0.004 * Math.sin(t * 0.31 + ph);
    var hy = hl * 0.28 + 0.02 * Math.sin(t * 0.27 + ph) + 0.01 * Math.sin(t * 0.71 + ph * 2);
    function fl(fx, k) {
      g.beginPath();
      g.moveTo(fx - 0.09, -1.02);
      g.lineTo(fx + 0.08, -1.02);
      g.lineTo(fx + 0.04, -0.56);
      g.lineTo(fx + 0.034 + k, -0.09);
      g.lineTo(fx + 0.06 + k, 0);
      g.lineTo(fx - 0.06 + k, 0);
      g.lineTo(fx - 0.036 + k, -0.1);
      g.lineTo(fx - 0.05, -0.56);
      g.closePath();
      g.fill();
    }
    function hl2(hx, k) {
      g.beginPath();
      g.moveTo(hx - 0.16, -1.0);
      g.lineTo(hx + 0.16, -1.08);
      g.lineTo(hx + 0.11, -0.56);
      g.lineTo(hx + 0.05 - k * 0.6, -0.47);
      g.lineTo(hx + 0.0 - k, -0.09 + k * 0.4);
      g.lineTo(hx + 0.03 - k, 0 + k * 0.4);
      g.lineTo(hx - 0.09 - k, 0 + k * 0.4);
      g.lineTo(hx - 0.06 - k, -0.1 + k * 0.4);
      g.lineTo(hx - 0.035, -0.5);
      g.lineTo(hx - 0.13, -0.76);
      g.closePath();
      g.fill();
    }
    fl(-0.46, 0.02);
    hl2(0.56, 0.08);
    fl(-0.62, 0);
    hl2(0.7, 0);
    g.beginPath();
    g.moveTo(-0.52, -1.5 - br);
    g.bezierCurveTo(-0.2, -1.42 - br, 0.25, -1.45 - br, 0.6, -1.5 - br);
    g.bezierCurveTo(0.82, -1.49, 0.93, -1.33, 0.87, -1.12);
    g.bezierCurveTo(0.83, -0.98, 0.72, -0.92, 0.56, -0.95);
    g.bezierCurveTo(0.2, -0.85 + br, -0.3, -0.85 + br, -0.55, -0.95);
    g.bezierCurveTo(-0.72, -1.0, -0.8, -1.15, -0.79, -1.3);
    g.bezierCurveTo(-0.86, -1.45, -0.98, -1.6 + hy * 0.5, -1.08, -1.66 + hy);
    g.lineTo(-1.36, -1.43 + hy * 1.4);
    g.quadraticCurveTo(-1.45, -1.44 + hy * 1.4, -1.43, -1.53 + hy * 1.4);
    g.lineTo(-1.17, -1.92 + hy);
    g.lineTo(-1.14, -2.05 + hy);
    g.lineTo(-1.09, -1.95 + hy);
    g.lineTo(-1.06, -2.03 + hy);
    g.lineTo(-1.03, -1.93 + hy);
    g.bezierCurveTo(-0.88, -1.86 + hy * 0.6, -0.7, -1.7, -0.52, -1.5 - br);
    g.closePath();
    g.fill();
    var ts = 0.05 * Math.sin(t * 0.7 + ph) + 0.03 * Math.sin(t * 1.9 + ph * 2);
    g.beginPath();
    g.moveTo(0.83, -1.42);
    g.bezierCurveTo(1.0, -1.3, 0.97 + ts, -1.0, 0.92 + ts * 1.6, -0.6);
    g.lineTo(0.84 + ts * 1.6, -0.62);
    g.bezierCurveTo(0.87 + ts, -1.0, 0.86, -1.2, 0.76, -1.32);
    g.closePath();
    g.fill();
    g.restore();
  }
  if (rim) draw(1.6 * e.px, -0.8 * e.px, rim, 0.6);
  draw(0, 0, c, 1);
}
var t = e.t,
  s = e.state || {},
  dk = s.dusk == null ? 0.2 : +s.dusk,
  cr = s.crowd == null ? 1 : +s.crowd;
var C = "#2e2630",
  RIM = "#d8a878";
SH(g, 0, 2.4, 4 + 3 * dk, 31, 0.3);
g.fillStyle = C;
function post(x) {
  g.beginPath();
  g.moveTo(x - 0.08, 0);
  g.lineTo(x - 0.07, -1.15);
  g.lineTo(x + 0.07, -1.17);
  g.lineTo(x + 0.08, 0);
  g.closePath();
  g.fill();
}
post(-2.6);
post(2.4);
g.beginPath();
g.moveTo(-2.75, -1.03);
g.quadraticCurveTo(0, -1.1, 2.6, -1.06);
g.lineTo(2.6, -1.17);
g.quadraticCurveTo(0, -1.2, -2.75, -1.14);
g.closePath();
g.fill();
HO(g, -1.0, -1, C, t, 0.3, 0.55, e, RIM);
var ha = cl((cr - 0.2) / 0.3);
if (ha > 0) {
  g.save();
  g.globalAlpha = ha;
  HO(g, 1.3, -1, "#2b2330", t, 2.1, 0.2, e, RIM);
  g.restore();
}
g.strokeStyle = C;
g.lineWidth = 0.03;
g.beginPath();
g.moveTo(-2.35, -1.1);
g.quadraticCurveTo(-2.3, -0.9, -2.42 + 0.02 * Math.sin(t * 0.3), -1.32 + 0.28 * 0.55);
g.stroke();
