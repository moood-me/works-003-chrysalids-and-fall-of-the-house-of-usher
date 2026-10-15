var A = e.aspect,
  t = e.t,
  s = e.state || {},
  hz = 0.66;
function num(k, d) {
  return s[k] == null ? d : +s[k];
}
var v = num("voices", 0.6),
  n = Math.max(0, Math.min(8, Math.round(num("count", 4)))),
  pe = num("petra", 0),
  cl = num("clouds", 0.15),
  dp = num("david_present", 1);
var gr = g.createLinearGradient(0, -0.35, 0, hz);
gr.addColorStop(0, "#0b0e1d");
gr.addColorStop(0.55, "#171c34");
gr.addColorStop(0.88, "#2a2f4c");
gr.addColorStop(1, "#3a3c58");
g.fillStyle = gr;
g.fillRect(-0.4, -0.4, A + 0.8, 1.7);
var hg = g.createRadialGradient(A * 0.62, hz, 0, A * 0.62, hz, 0.7);
hg.addColorStop(0, "rgba(115,100,128,0.22)");
hg.addColorStop(1, "rgba(115,100,128,0)");
g.fillStyle = hg;
g.fillRect(-0.4, hz - 0.8, A + 0.8, 0.85);
g.save();
g.globalCompositeOperation = "lighter";
for (var i = 0; i < 44; i++) {
  var u = i / 43;
  var mx = A * (1.0 - 0.9 * u) + 0.05 * Math.sin(u * 7),
    my = hz + 0.02 - (hz + 0.3) * u + 0.03 * Math.sin(u * 11);
  var rr = 0.08 + 0.05 * Math.sin(u * 13 + 1) + 0.04 * e.rnd();
  var mg = g.createRadialGradient(mx, my, 0, mx, my, rr);
  mg.addColorStop(0, "rgba(140,150,185,0.055)");
  mg.addColorStop(1, "rgba(140,150,185,0)");
  g.fillStyle = mg;
  g.fillRect(mx - rr, my - rr, 2 * rr, 2 * rr);
}
for (var i = 0; i < 520; i++) {
  var r1 = e.rnd(),
    r2 = e.rnd(),
    r3 = e.rnd(),
    r4 = e.rnd();
  var x, y;
  if (i < 240) {
    x = A * (1.0 - 0.9 * r1) + (r2 - 0.5) * 0.2;
    y = hz + 0.02 - (hz + 0.3) * r1 + (r3 - 0.5) * 0.16;
  } else {
    x = -0.3 + r1 * (A + 0.6);
    y = -0.35 + Math.pow(r2, 1.2) * (hz + 0.35);
  }
  if (y > hz - 0.004) continue;
  var sz = 0.0006 + Math.pow(r4, 5) * 0.0026;
  var tw = 0.65 + 0.35 * Math.sin(t * (0.35 + r3 * 0.8) + r1 * 40);
  var fade = Math.min(1, (hz - y) / 0.2);
  var a = tw * fade * (0.3 + 0.7 * r4);
  g.fillStyle = "rgba(222,228,244," + a + ")";
  g.beginPath();
  g.arc(x, y, sz, 0, 7);
  g.fill();
  if (r4 > 0.96) {
    var sg = g.createRadialGradient(x, y, 0, x, y, 0.012);
    sg.addColorStop(0, "rgba(200,210,235," + a * 0.25 + ")");
    sg.addColorStop(1, "rgba(200,210,235,0)");
    g.fillStyle = sg;
    g.fillRect(x - 0.012, y - 0.012, 0.024, 0.024);
  }
}
g.restore();
if (cl > 0.01) {
  for (var k = 0; k < 8; k++) {
    var ca = Math.max(0, Math.min(1, cl * 8 - k));
    if (ca <= 0) continue;
    var W2 = A + 1.4;
    var cx = ((((k * 0.53 * A + 0.2 + t * 0.004 * (1 + k * 0.27)) % W2) + W2) % W2) - 0.7;
    var cy = 0.0 + ((k * 0.41 + 0.13) % 1) * 0.5;
    for (var m = 0; m < 7; m++) {
      var ex = cx + (m - 3) * 0.07,
        ey = cy + 0.015 * Math.sin(m * 1.7 + k) - 0.012 * Math.sin(m * 0.9),
        rr = 0.05 + 0.03 * Math.sin(m * 2.3 + k * 1.1) + 0.02 * (m > 1 && m < 5 ? 1 : 0);
      g.save();
      g.translate(ex, ey);
      g.scale(2.2, 0.6);
      var cg = g.createRadialGradient(0, 0, 0, 0, 0, rr * 2);
      cg.addColorStop(0, "rgba(30,33,55," + 0.92 * ca + ")");
      cg.addColorStop(0.55, "rgba(30,33,55," + 0.6 * ca + ")");
      cg.addColorStop(1, "rgba(30,33,55,0)");
      g.fillStyle = cg;
      g.beginPath();
      g.arc(0, 0, rr * 2, 0, 7);
      g.fill();
      g.restore();
    }
    g.save();
    g.globalCompositeOperation = "lighter";
    g.translate(cx, cy + 0.025);
    g.scale(5, 0.5);
    var lg = g.createRadialGradient(0, 0, 0, 0, 0, 0.06);
    lg.addColorStop(0, "rgba(90,80,100," + 0.12 * ca + ")");
    lg.addColorStop(1, "rgba(90,80,100,0)");
    g.fillStyle = lg;
    g.beginPath();
    g.arc(0, 0, 0.06, 0, 7);
    g.fill();
    g.restore();
  }
}
var AX = 0.52,
  AY = 0.548;
var W = [0.52, 0.8, 0.905, 0.6, 0.44, 0.665, 0.97, 0.815];
g.save();
g.globalCompositeOperation = "lighter";
g.lineJoin = "round";
g.lineCap = "round";
if (dp > 0.02 && v > 0.01) {
  var au = 0.06 + 0.03 * v;
  var aa = dp * v * (0.16 + 0.05 * Math.sin(t * 0.4) + 0.02 * Math.sin(t * 0.93));
  g.save();
  g.translate(AX, AY);
  g.scale(1.6, 1);
  var ag = g.createRadialGradient(0, 0, 0, 0, 0, au);
  ag.addColorStop(0, "rgba(190,205,228," + aa + ")");
  ag.addColorStop(0.45, "rgba(170,190,220," + aa * 0.4 + ")");
  ag.addColorStop(1, "rgba(170,190,220,0)");
  g.fillStyle = ag;
  g.beginPath();
  g.arc(0, 0, au, 0, 7);
  g.fill();
  g.restore();
}
function thread(x0, y0, x1, y1, rise, lift, seed, str, warm, amp, wid) {
  var c1x = x0 + 0.02 * Math.sin(seed * 1.7),
    c1y = y0 - rise,
    c2x = x1 - (x1 - x0) * 0.25,
    c2y = Math.min(y0, y1) - lift;
  var N = 60,
    P = [];
  for (var k = 0; k <= N; k++) {
    var u = k / N,
      iu = 1 - u;
    var bx = iu * iu * iu * x0 + 3 * iu * iu * u * c1x + 3 * iu * u * u * c2x + u * u * u * x1,
      by = iu * iu * iu * y0 + 3 * iu * iu * u * c1y + 3 * iu * u * u * c2y + u * u * u * y1;
    var w =
      amp *
      Math.sin(u * Math.PI) *
      (Math.sin(u * Math.PI * 3.2 - t * 0.19 + seed * 2) + 0.5 * Math.sin(u * 8.3 + t * 0.27 + seed));
    P.push([bx, by + w]);
  }
  var p = ((t * 0.035 + seed * 0.29) % 1.4) - 0.2;
  var G = g.createLinearGradient(P[0][0], P[0][1], P[N][0], P[N][1]);
  var sh = seed * 1.3 + t * 0.06;
  for (var k = 0; k <= 24; k++) {
    var u = k / 24;
    var en = Math.pow(Math.sin(Math.PI * u), 0.6);
    var breath = 0.6 + 0.4 * Math.sin(u * 7.0 - sh) * Math.sin(u * 3.1 + sh * 0.7);
    var d = (u - p) / 0.07;
    var I = 0.4 * Math.max(0, breath) + 1.0 * Math.exp(-d * d);
    var a = Math.max(0, str * en * I);
    G.addColorStop(u, warm ? "rgba(245,230,205," + a * 0.6 + ")" : "rgba(208,224,240," + a * 0.6 + ")");
  }
  g.strokeStyle = G;
  g.lineWidth = wid * 8;
  g.globalAlpha = 0.12;
  g.beginPath();
  g.moveTo(P[0][0], P[0][1]);
  for (var k = 1; k <= N; k++) g.lineTo(P[k][0], P[k][1]);
  g.stroke();
  g.globalAlpha = 1;
  g.lineWidth = wid;
  g.stroke();
}
var vis = [];
for (var i = 0; i < n; i++) {
  var ph = Math.sin(t * 0.045 * (1 + 0.13 * i) + i * 2.39);
  vis.push(Math.max(0, Math.min(1, (ph + 0.35) * 1.4)));
}
var lim = Math.min(n, 4);
for (var i = 0; i < n; i++) {
  var f = vis[i];
  if (n > lim) {
    var rank = 0;
    for (var j = 0; j < n; j++) if (vis[j] > f || (vis[j] == f && j < i)) rank++;
    if (rank >= lim) f *= 0.12;
  }
  if (n <= 4) {
    f = 0.5 + 0.5 * f;
  }
  if (f < 0.01) continue;
  var x1 = W[i] * A,
    y1 = hz - 0.008;
  var ox = AX - 0.04 + 0.08 * ((i * 0.618 + 0.2) % 1),
    oy = AY - 0.01 + 0.018 * ((i * 0.383) % 1);
  var o = W[(i + 1) % n] * A;
  var x0 = ox * dp + o * (1 - dp),
    y0 = oy * dp + (hz - 0.008) * (1 - dp);
  thread(
    x0,
    y0,
    x1,
    y1,
    0.07 + 0.06 * ((i * 0.71) % 1),
    0.15 + 0.15 * ((i * 0.618) % 1),
    i,
    v * f,
    false,
    0.008,
    0.0015,
  );
}
if (pe > 0.01) {
  var hx = 0.735 * A,
    hy = hz - 0.012;
  var q = (t / 9) % 1;
  g.save();
  g.translate(hx, hy);
  g.scale(1.4, 1);
  var bl = g.createRadialGradient(0, 0, 0, 0, 0, 0.06 + 0.12 * pe);
  bl.addColorStop(0, "rgba(245,228,200," + 0.3 * pe + ")");
  bl.addColorStop(1, "rgba(245,228,200,0)");
  g.fillStyle = bl;
  g.beginPath();
  g.arc(0, 0, 0.06 + 0.12 * pe, Math.PI, 2 * Math.PI);
  g.fill();
  g.restore();
  for (var r = 0; r < 3; r++) {
    var qq = (q + r / 3) % 1;
    var ra = 0.03 + qq * 0.42;
    var ga = pe * 0.1 * (1 - qq) * (1 - qq);
    g.save();
    g.translate(hx, hy);
    g.scale(1, 0.55);
    var rg = g.createRadialGradient(0, 0, ra * 0.85, 0, 0, ra);
    rg.addColorStop(0, "rgba(240,226,205,0)");
    rg.addColorStop(0.8, "rgba(240,226,205," + ga + ")");
    rg.addColorStop(1, "rgba(240,226,205,0)");
    g.fillStyle = rg;
    g.beginPath();
    g.arc(0, 0, ra, Math.PI, 2 * Math.PI);
    g.fill();
    g.restore();
  }
  var tx = AX * dp + W[0] * A * (1 - dp),
    ty = AY * dp + (hz - 0.008) * (1 - dp);
  thread(hx, hy, tx, ty, 0.05, 0.08, 11, pe * 1.4, true, 0.012, 0.003);
}
g.restore();
