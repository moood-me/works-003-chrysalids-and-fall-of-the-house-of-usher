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
const C0 = {
  hx: -0.03,
  hy: -0.21,
  k1x: 0.17,
  k1y: -0.37,
  a1x: 0.11,
  a1y: -0.04,
  k2x: 0.11,
  k2y: -0.33,
  a2x: -0.07,
  a2y: -0.05,
  cx: 0.08,
  cy: -0.57,
  hdx: 0.2,
  hdy: -0.72,
  ha: 0.32,
  sx: 0.08,
  sy: -0.56,
  e1x: 0.26,
  e1y: -0.5,
  w1x: 0.41,
  w1y: -0.52,
  e2x: 0.17,
  e2y: -0.4,
  w2x: 0.22,
  w2y: -0.33,
  fhx: 0.25,
  fhy: -0.33,
  bhx: -0.18,
  bhy: -0.1,
};
const D0 = {
  hx: 0,
  hy: -0.62,
  k1x: 0.04,
  k1y: -0.33,
  a1x: 0.05,
  a1y: -0.05,
  k2x: -0.03,
  k2y: -0.33,
  a2x: -0.05,
  a2y: -0.05,
  cx: 0.0,
  cy: -0.93,
  hdx: 0.03,
  hdy: -1.1,
  ha: -0.08,
  sx: 0.0,
  sy: -0.92,
  e1x: 0.05,
  e1y: -0.71,
  w1x: 0.08,
  w1y: -0.55,
  e2x: -0.05,
  e2y: -0.71,
  w2x: -0.06,
  w2y: -0.55,
  fhx: 0.15,
  fhy: -0.42,
  bhx: -0.14,
  bhy: -0.42,
};
const u = sm(cl(b));
const P = lerpP(C0, D0, u);
const br = 0.005 * Math.sin(e.t * 1.9) + 0.003 * Math.sin(e.t * 0.7);
P.cy += br;
P.sy += br;
P.hdy += br;
P.w1x += (0.014 * Math.sin(e.t * 0.45) + 0.006 * Math.sin(e.t * 1.3)) * (1 - u);
P.w1y += 0.008 * Math.sin(e.t * 0.31) * (1 - u);
P.e1x += 0.007 * Math.sin(e.t * 0.45) * (1 - u);
P.ha += 0.03 * Math.sin(e.t * 0.29) + 0.015 * Math.sin(e.t * 0.83);
function foot(x, y) {
  g.beginPath();
  g.ellipse(x + 0.035, y + 0.02, 0.065, 0.03, 0, 0, 7);
  g.fill();
}
function fig(c) {
  g.fillStyle = c;
  seg(P.hx, P.hy, 0.11, P.k2x, P.k2y, 0.085);
  seg(P.k2x, P.k2y, 0.08, P.a2x, P.a2y, 0.06);
  foot(P.a2x, P.a2y);
  seg(P.sx, P.sy, 0.07, P.e2x, P.e2y, 0.058);
  seg(P.e2x, P.e2y, 0.056, P.w2x, P.w2y, 0.05);
  seg(P.hx + 0.02, P.hy, 0.115, P.k1x, P.k1y, 0.088);
  seg(P.k1x, P.k1y, 0.084, P.a1x, P.a1y, 0.062);
  foot(P.a1x, P.a1y);
  const hem = 0.01 * Math.sin(e.t * 0.7);
  g.beginPath();
  g.moveTo(P.cx - 0.1, P.cy + 0.02);
  g.quadraticCurveTo(P.cx, P.cy - 0.07, P.cx + 0.09, P.cy);
  g.quadraticCurveTo((P.cx + P.fhx) / 2 + 0.06, (P.cy + P.fhy) / 2, P.fhx + hem, P.fhy);
  g.quadraticCurveTo((P.fhx + P.bhx) / 2, Math.max(P.fhy, P.bhy) + 0.04, P.bhx - hem, P.bhy);
  g.quadraticCurveTo((P.cx + P.bhx) / 2 - 0.07, (P.cy + P.bhy) / 2, P.cx - 0.1, P.cy + 0.02);
  g.closePath();
  g.fill();
  seg(P.cx, P.cy, 0.07, P.hdx, P.hdy + 0.05, 0.065);
  g.save();
  g.translate(P.hdx, P.hdy);
  g.rotate(P.ha);
  g.beginPath();
  g.ellipse(0, 0, 0.088, 0.1, 0, 0, 7);
  g.fill();
  g.beginPath();
  g.moveTo(-0.1, 0.05);
  g.quadraticCurveTo(-0.115, -0.11, 0.0, -0.118);
  g.quadraticCurveTo(0.08, -0.11, 0.098, -0.03);
  g.lineTo(0.05, -0.05);
  g.quadraticCurveTo(-0.02, -0.06, -0.05, 0.07);
  g.closePath();
  g.fill();
  g.restore();
  const ca = Math.cos(P.ha),
    sa = Math.sin(P.ha);
  const wx = P.hdx - 0.085 * ca - 0.01 * sa,
    wy = P.hdy - 0.085 * sa + 0.01 * ca;
  const pw = 0.025 * Math.sin(e.t * 0.6) + 0.01 * Math.sin(e.t * 1.4);
  seg(wx, wy, 0.05, wx - 0.04 + pw, wy + 0.22, 0.03);
  g.beginPath();
  g.ellipse(wx - 0.04 + pw, wy + 0.25, 0.022, 0.035, 0, 0, 7);
  g.fill();
  seg(P.sx + 0.02, P.sy, 0.072, P.e1x, P.e1y, 0.06);
  seg(P.e1x, P.e1y, 0.058, P.w1x, P.w1y, 0.05);
  g.beginPath();
  g.arc(P.w1x, P.w1y, 0.032, 0, 7);
  g.fill();
}
g.globalAlpha = ch;
shadow(0.3);
g.save();
g.translate(-0.014, -0.01);
g.scale(-1, 1);
fig(RIM);
g.restore();
g.save();
g.scale(-1, 1);
fig(BODY);
g.restore();
g.globalAlpha = 1;
e.at(0, -1.2);
