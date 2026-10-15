var s = e.state || {},
  t = e.t,
  D = 20;
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
var th = s.threads == null ? 0.7 : +s.threads,
  an = +(s.adults_near || 0),
  ro = +(s.rosalind || 0),
  dk = +(s.dusk || 0);
var HD = [
  [-8, 23.9, -2.64],
  [40.09, 74.9, -13.28],
  [36.47, 110, -13.62],
  [-50.01, 91.9, -7.5],
  [-0.79, 120, -12.92],
  [-40, 200, -13.6],
];
function P(i) {
  var p = HD[i],
    k = D / p[1];
  return [p[0] * k, -(1.7 + (p[2] - 1.7) * k)];
}
if (dk > 0.005) {
  g.save();
  g.globalCompositeOperation = "multiply";
  var vg = g.createLinearGradient(0, -1.8, 0, 14);
  vg.addColorStop(0, "rgba(120,100,120," + 0.25 * dk + ")");
  vg.addColorStop(1, "rgba(70,60,90," + 0.6 * dk + ")");
  g.fillStyle = vg;
  g.fillRect(-60, -1.72, 120, 60);
  g.restore();
}
g.save();
g.globalCompositeOperation = "screen";
g.translate(9.5, -1.75);
g.scale(1, 0.3);
var sg = g.createRadialGradient(0, 0, 0, 0, 0, 16);
sg.addColorStop(0, "rgba(255,226,170," + 0.2 * (1 - 0.6 * dk) + ")");
sg.addColorStop(1, "rgba(255,226,170,0)");
g.fillStyle = sg;
g.fillRect(-16, -16, 32, 32);
g.restore();
var Ls = [];
for (var i = 0; i < 6; i++) Ls.push(LIS(i));
var LK = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [0, 5],
  [2, 4],
  [3, 5],
  [1, 2],
];
g.save();
g.lineCap = "round";
g.lineJoin = "round";
var vis = 1 + 0.3 * dk;
for (var i = 0; i < 6; i++) {
  var a0 = th * Ls[i] * vis * 0.5;
  if (a0 < 0.01) continue;
  var q = P(i);
  var rr = 0.35 + 0.1 * Math.sin(t * 0.6 + i);
  var rg = g.createRadialGradient(q[0], q[1], 0, q[0], q[1], rr);
  rg.addColorStop(0, "rgba(255,248,226," + a0 + ")");
  rg.addColorStop(1, "rgba(255,248,226,0)");
  g.fillStyle = rg;
  g.fillRect(q[0] - rr, q[1] - rr, 2 * rr, 2 * rr);
}
for (var j = 0; j < LK.length; j++) {
  var a = LK[j][0],
    b = LK[j][1];
  var str = th * Math.sqrt(Ls[a] * Ls[b]) * 1.3;
  if (j >= 5) str *= 0.5;
  var bb = Math.max(0, Math.min(1, 0.5 + 0.9 * Math.sin(t * 0.047 * (1 + 0.17 * j) + j * 1.9)));
  str *= 0.6 + 0.4 * bb;
  var wm = j == 0 ? ro : 0;
  if (j == 0) str = Math.max(str, ro * (1 - an) * Math.min(1, th * 1.6 + 0.4));
  str *= vis;
  if (str < 0.01) continue;
  var A = P(a),
    B = P(b);
  var dx = B[0] - A[0],
    dy = B[1] - A[1],
    dist = Math.sqrt(dx * dx + dy * dy);
  var lift = dist * 0.22 + 0.15;
  var top = Math.min(A[1], B[1]);
  var c1x = A[0] + dx * 0.2,
    c1y = top - lift + (A[1] - top) * 0.3,
    c2x = A[0] + dx * 0.8,
    c2y = top - lift * 0.85 + (B[1] - top) * 0.3;
  var N = 64,
    Q = [];
  g.beginPath();
  for (var k = 0; k <= N; k++) {
    var u = k / N,
      iu = 1 - u;
    var x = iu * iu * iu * A[0] + 3 * iu * iu * u * c1x + 3 * iu * u * u * c2x + u * u * u * B[0],
      y = iu * iu * iu * A[1] + 3 * iu * iu * u * c1y + 3 * iu * u * u * c2y + u * u * u * B[1];
    y += 0.05 * Math.sin(u * Math.PI) * (Math.sin(u * 9 - t * 0.23 + j) + 0.6 * Math.sin(u * 17 + t * 0.31 + j * 2));
    Q.push([x, y]);
    if (k == 0) g.moveTo(x, y);
    else g.lineTo(x, y);
  }
  var G = g.createLinearGradient(A[0], A[1], B[0], B[1]);
  var p = ((t * 0.045 + j * 0.27) % 1.4) - 0.2;
  for (var k = 0; k <= 28; k++) {
    var u = k / 28;
    var en = Math.pow(Math.sin(Math.PI * u), 0.5);
    var gl = 0.55 + 0.45 * Math.max(0, Math.sin(u * 31 - t * 0.5 + j * 3) * Math.sin(u * 7.3 + t * 0.17 + j));
    var d2 = (u - p) / 0.06;
    var I = 0.65 * gl + 0.9 * Math.exp(-d2 * d2);
    var al = Math.max(0, Math.min(1, str * (0.35 + 0.65 * en) * I));
    G.addColorStop(u, "rgba(255," + Math.round(251 - 38 * wm) + "," + Math.round(236 - 80 * wm) + "," + al + ")");
  }
  g.strokeStyle = G;
  g.globalAlpha = 0.3;
  g.lineWidth = 0.36 + 0.2 * wm;
  g.stroke();
  g.globalAlpha = 1;
  g.lineWidth = 0.065 + 0.03 * wm;
  g.stroke();
  for (var m = 0; m < 3; m++) {
    var u = (t * 0.018 * (1 + m * 0.3) + m * 0.33 + j * 0.17) % 1;
    var q = Q[Math.round(u * N)];
    var ga = Math.min(1, str * Math.pow(Math.sin(Math.PI * u), 0.7) * (0.5 + 0.5 * Math.sin(t * 1.7 + m * 2 + j)));
    if (ga < 0.01) continue;
    var rg = g.createRadialGradient(q[0], q[1], 0, q[0], q[1], 0.18);
    rg.addColorStop(0, "rgba(255,250,235," + ga + ")");
    rg.addColorStop(1, "rgba(255,250,235,0)");
    g.fillStyle = rg;
    g.fillRect(q[0] - 0.18, q[1] - 0.18, 0.36, 0.36);
  }
}
if (ro > 0.01) {
  for (var i = 0; i < 2; i++) {
    var q = P(i);
    var rg = g.createRadialGradient(q[0], q[1], 0, q[0], q[1], 0.5);
    rg.addColorStop(0, "rgba(255,214,160," + 0.45 * ro * (1 - an) + ")");
    rg.addColorStop(1, "rgba(255,214,160,0)");
    g.fillStyle = rg;
    g.fillRect(q[0] - 0.5, q[1] - 0.5, 1, 1);
  }
}
for (var i = 0; i < 26; i++) {
  var r1 = e.rnd(),
    r2 = e.rnd(),
    r3 = e.rnd(),
    r4 = e.rnd();
  var x = -14 + r1 * 30 + 0.6 * Math.sin(t * 0.05 + i),
    y = -7 + r2 * 9 + 0.4 * Math.sin(t * 0.07 + i * 1.3);
  var a = (0.2 + 0.25 * Math.sin(t * (0.5 + r3) + i)) * (1 - dk * 0.5);
  if (a <= 0) continue;
  g.fillStyle = "rgba(255,246,220," + a + ")";
  g.beginPath();
  g.arc(x, y, 0.012 + r4 * 0.015, 0, 7);
  g.fill();
}
g.restore();
