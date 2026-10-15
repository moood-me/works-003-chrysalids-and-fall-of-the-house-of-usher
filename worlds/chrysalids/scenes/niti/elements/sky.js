// still: painted once
var A = e.aspect;
var bg = g.createLinearGradient(0, -0.35, 0, 1.25);
bg.addColorStop(0, "#04050b");
bg.addColorStop(0.5, "#0a0e1f");
bg.addColorStop(1, "#130f20");
g.fillStyle = bg;
g.fillRect(-0.3, -0.35, A + 0.6, 1.6);
for (var i = 0; i < 220; i++) {
  var s = e.rnd(),
    x0 = e.rnd() * (A + 0.6),
    y = -0.3 + e.rnd() * 1.4,
    ph = e.rnd();
  var x = -0.3 + x0;
  g.globalAlpha = (0.1 + 0.45 * s) * (0.6 + 0.4 * ph);
  g.fillStyle = s > 0.85 ? "#ffe9c4" : "#c9d2ff";
  var r = 0.0012 + 0.0022 * s;
  g.fillRect(x - r / 2, y - r / 2, r, r);
}
g.globalAlpha = 1;
var mist = g.createRadialGradient(A / 2, 1.1, 0.05, A / 2, 1.1, 0.9);
mist.addColorStop(0, "rgba(80, 60, 110, 0.22)");
mist.addColorStop(1, "rgba(80, 60, 110, 0)");
g.fillStyle = mist;
g.fillRect(-0.3, 0.2, A + 0.6, 1.1);
