const S = e.state || {};
const ch = S.children ?? 1;
const b = S.bell ?? 0;
const s = S.sun ?? 0.2;
const sm = (t) => t * t * (3 - 2 * t);
const cl = (v) => Math.max(0, Math.min(1, v));
function seg(x1, y1, w1, x2, y2, w2) {
  const a = Math.atan2(y2 - y1, x2 - x1) + Math.PI / 2,
    c = Math.cos(a),
    q = Math.sin(a);
  g.beginPath();
  g.moveTo(x1 + (c * w1) / 2, y1 + (q * w1) / 2);
  g.lineTo(x2 + (c * w2) / 2, y2 + (q * w2) / 2);
  g.arc(x2, y2, w2 / 2, a, a + Math.PI, true);
  g.lineTo(x1 - (c * w1) / 2, y1 - (q * w1) / 2);
  g.arc(x1, y1, w1 / 2, a + Math.PI, a + 2 * Math.PI, true);
  g.closePath();
  g.fill();
}
function lerpP(A, B, u) {
  const P = {};
  for (const k in A) P[k] = A[k] + (B[k] - A[k]) * u;
  return P;
}
const RIM = s > 0.5 ? "#b89a74" : "#a89c80",
  BODY = "#3a3c35";
function shadow(w) {
  const sg = g.createRadialGradient(0, 0, 0, 0, 0, 1);
  sg.addColorStop(0, "rgba(50,56,40,0.35)");
  sg.addColorStop(1, "rgba(50,56,40,0)");
  g.save();
  g.translate(0.12, 0.01);
  g.scale(w, 0.05);
  g.fillStyle = sg;
  g.beginPath();
  g.arc(0, 0, 1, 0, 7);
  g.fill();
  g.restore();
}
if (ch <= 0.01) return;
const A0 = {
  hx: 0,
  hy: -0.7,
  k1x: 0.07,
  k1y: -0.37,
  a1x: 0.05,
  a1y: -0.05,
  k2x: -0.05,
  k2y: -0.37,
  a2x: -0.1,
  a2y: -0.05,
  cx: -0.03,
  cy: -1.0,
  hdx: -0.01,
  hdy: -1.2,
  ha: -0.5,
  sx: -0.02,
  sy: -1.0,
  e1x: 0.15,
  e1y: -1.1,
  w1x: 0.1,
  w1y: -1.26,
  e2x: -0.07,
  e2y: -0.78,
  w2x: -0.05,
  w2y: -0.6,
};
const B0 = {
  hx: 0,
  hy: -0.7,
  k1x: 0.1,
  k1y: -0.38,
  a1x: 0.15,
  a1y: -0.05,
  k2x: -0.04,
  k2y: -0.37,
  a2x: -0.07,
  a2y: -0.05,
  cx: 0.02,
  cy: -1.0,
  hdx: 0.04,
  hdy: -1.21,
  ha: 0.06,
  sx: 0.02,
  sy: -0.99,
  e1x: 0.06,
  e1y: -0.79,
  w1x: 0.11,
  w1y: -0.61,
  e2x: -0.03,
  e2y: -0.78,
  w2x: -0.07,
  w2y: -0.6,
};
const u = sm(cl(b));
const P = lerpP(A0, B0, u);
const br = 0.006 * Math.sin(e.t * 1.7) + 0.003 * Math.sin(e.t * 0.63);
P.cy += br;
P.sy += br;
P.hdy += br;
P.e1y += br;
P.w1y += br;
P.ha += 0.04 * Math.sin(e.t * 0.37) + 0.02 * Math.sin(e.t * 0.91);
const tt = cl((b - 0.3) / 0.4);
const sc = Math.cos(Math.PI * sm(tt));
const sx = (sc < 0 ? -1 : 1) * Math.max(0.78, Math.abs(sc));
function foot(x, y) {
  g.beginPath();
  g.ellipse(x + 0.04, y + 0.02, 0.075, 0.035, 0, 0, 7);
  g.fill();
}
function fig(c) {
  g.fillStyle = c;
  seg(P.hx - 0.025, P.hy, 0.15, P.k2x, P.k2y, 0.115);
  seg(P.k2x, P.k2y, 0.105, P.a2x, P.a2y, 0.08);
  foot(P.a2x, P.a2y);
  seg(P.sx, P.sy, 0.095, P.e2x, P.e2y, 0.075);
  seg(P.e2x, P.e2y, 0.068, P.w2x, P.w2y, 0.06);
  g.beginPath();
  g.moveTo(P.hx - 0.135, P.hy + 0.07);
  g.quadraticCurveTo(P.cx - 0.17, (P.hy + P.cy) / 2, P.cx - 0.125, P.cy);
  g.quadraticCurveTo(P.cx, P.cy - 0.09, P.cx + 0.115, P.cy - 0.01);
  g.quadraticCurveTo(P.cx + 0.15, (P.hy + P.cy) / 2, P.hx + 0.135, P.hy + 0.08);
  g.closePath();
  g.fill();
  seg(P.hx + 0.025, P.hy, 0.155, P.k1x, P.k1y, 0.115);
  seg(P.k1x, P.k1y, 0.108, P.a1x, P.a1y, 0.082);
  foot(P.a1x, P.a1y);
  seg(P.cx, P.cy, 0.085, P.hdx, P.hdy + 0.06, 0.08);
  g.save();
  g.translate(P.hdx, P.hdy);
  g.rotate(P.ha);
  g.beginPath();
  g.ellipse(0, 0, 0.098, 0.112, 0, 0, 7);
  g.fill();
  const hs = 0.012 * Math.sin(e.t * 1.1) + 0.006 * Math.sin(e.t * 2.3);
  g.beginPath();
  g.moveTo(-0.105, 0.04);
  g.quadraticCurveTo(-0.135, -0.1, -0.04, -0.135);
  g.quadraticCurveTo(0.03, -0.16 + hs, 0.105, -0.08);
  g.lineTo(0.07, -0.075);
  g.quadraticCurveTo(0.0, -0.09, -0.06, -0.02);
  g.closePath();
  g.fill();
  g.restore();
  seg(P.sx + 0.02, P.sy, 0.1, P.e1x, P.e1y, 0.078);
  seg(P.e1x, P.e1y, 0.07, P.w1x, P.w1y, 0.062);
  g.beginPath();
  g.arc(P.w1x, P.w1y, 0.04, 0, 7);
  g.fill();
}
g.globalAlpha = ch;
shadow(0.35);
g.save();
g.translate(-0.016, -0.01);
g.scale(sx, 1);
fig(RIM);
g.restore();
g.save();
g.scale(sx, 1);
fig(BODY);
g.restore();
g.globalAlpha = 1;
e.at(0, -1.45);
