var s = e.state || {},
  dk = Math.max(0, Math.min(1, +(s.dusk || 0)));
function mx(a, b, u) {
  return (
    "rgb(" +
    Math.round(a[0] + (b[0] - a[0]) * u) +
    "," +
    Math.round(a[1] + (b[1] - a[1]) * u) +
    "," +
    Math.round(a[2] + (b[2] - a[2]) * u) +
    ")"
  );
}
function hh(x) {
  return Math.max(3, 20 + 12 * Math.sin(x / 430 + 2) + 8 * Math.sin(x / 170) + 4 * Math.sin(x / 63 + 1));
}
g.fillStyle = mx([163, 160, 122], [104, 88, 98], dk);
g.beginPath();
g.moveTo(-3500, 40);
for (var x = -3500; x <= 3500; x += 8) g.lineTo(x, -hh(x));
g.lineTo(3500, 40);
g.closePath();
g.fill();
g.save();
g.clip();
var cols = ["#aea979", "#b9ae82", "#9c9d70", "#aba480", "#99926c"];
for (var i = 0; i < 420; i++) {
  var x = -3500 + e.rnd() * 7000,
    y = -45 + e.rnd() * 85,
    w = 40 + e.rnd() * 140,
    h = 5 + e.rnd() * 14,
    c = Math.floor(e.rnd() * 5),
    r = (e.rnd() - 0.5) * 0.15;
  g.fillStyle = cols[c];
  g.globalAlpha = 0.7 * (1 - 0.85 * dk);
  g.save();
  g.translate(x, y);
  g.rotate(r);
  g.fillRect(-w / 2, -h / 2, w, h);
  g.restore();
}
g.globalAlpha = 1;
g.fillStyle = mx([128, 125, 91], [82, 70, 80], dk);
for (var i = 0; i < 260; i++) {
  var x = -3500 + e.rnd() * 7000,
    y = -hh(x) + 2 + e.rnd() * 30,
    a = 3 + e.rnd() * 4,
    b = 2.5 + e.rnd() * 2;
  g.beginPath();
  g.ellipse(x, y, a, b, 0, 0, 7);
  g.fill();
}
g.restore();
g.strokeStyle = "rgba(250,220,180," + 0.35 * (1 - 0.5 * dk) + ")";
g.lineWidth = 1.2;
g.beginPath();
for (var x = -3500; x <= 3500; x += 8) g.lineTo(x, -hh(x));
g.stroke();
