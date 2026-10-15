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
  return 55 + 30 * Math.sin(x / 800 + 0.5) + 18 * Math.sin(x / 310 + 1.2) + 8 * Math.sin(x / 120 + 2);
}
function h2(x) {
  return 28 + 14 * Math.sin(x / 520 + 2) + 7 * Math.sin(x / 190);
}
g.fillStyle = mx([185, 178, 152], [150, 118, 122], dk);
g.beginPath();
g.moveTo(-8000, 40);
for (var x = -8000; x <= 8000; x += 40) g.lineTo(x, -hh(x));
g.lineTo(8000, 40);
g.closePath();
g.fill();
g.fillStyle = mx([174, 169, 141], [128, 102, 110], dk);
g.beginPath();
g.moveTo(-8000, 40);
for (var x = -8000; x <= 8000; x += 40) g.lineTo(x, -h2(x));
g.lineTo(8000, 40);
g.closePath();
g.fill();
