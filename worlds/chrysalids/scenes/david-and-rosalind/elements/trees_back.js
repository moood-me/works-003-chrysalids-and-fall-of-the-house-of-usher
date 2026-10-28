var t = 0;
g.fillStyle = "#aa8fa8";
function elm(x, h, w) {
  var sw = 0.15 * Math.sin(t * 0.3 + x) + 0.07 * Math.sin(t * 0.71 + x * 2);
  for (var k = 0; k < 7; k++) {
    var a = k * 0.9 + x;
    g.beginPath();
    g.ellipse(
      x + Math.sin(a * 2.1) * w * 0.32 + sw * (k / 7),
      -h * 0.66 - Math.cos(a * 1.7) * h * 0.16,
      w * 0.3,
      h * 0.2,
      0,
      0,
      7,
    );
    g.fill();
  }
  g.beginPath();
  g.moveTo(x - 0.4, 0);
  g.quadraticCurveTo(x - 0.15, -h * 0.3, x - 0.5, -h * 0.55);
  g.lineTo(x + 0.5, -h * 0.55);
  g.quadraticCurveTo(x + 0.15, -h * 0.3, x + 0.4, 0);
  g.fill();
}
function pop(x, h) {
  var sw = 0.25 * Math.sin(t * 0.37 + x) + 0.1 * Math.sin(t * 0.91 + x * 2);
  g.beginPath();
  g.moveTo(x - 0.5, 0);
  g.quadraticCurveTo(x - h * 0.13, -h * 0.5, x + sw, -h);
  g.quadraticCurveTo(x + h * 0.13, -h * 0.5, x + 0.5, 0);
  g.fill();
}
elm(-58, 15, 16);
elm(-44, 12, 13);
elm(-70, 13, 14);
pop(-34, 17);
pop(-31, 14);
elm(22, 11, 10);
pop(36, 16);
pop(39, 19);
elm(52, 14, 15);
elm(66, 12, 13);
elm(-90, 12, 14);
g.beginPath();
g.moveTo(-110, 3);
for (var x = -110; x <= 110; x += 0.8) {
  var hh = 1.6 + 0.9 * Math.sin(x * 0.37) + 0.6 * Math.sin(x * 1.13 + 1) + 0.5 * e.rnd();
  g.lineTo(x, -hh);
}
g.lineTo(110, 3);
g.closePath();
g.fill();
