// the wall of the house in near darkness: courses of old dressed stone, worn and mottled, damp
// running down it; a little light where the inscription is
var A = e.aspect;
var X0 = -0.3;
var X1 = A + 0.3;
var Y0 = -0.35;
var Y1 = 1.25;
g.fillStyle = "#09080a";
g.fillRect(X0, Y0, X1 - X0, Y1 - Y0);
var tones = [
  [36, 33, 36],
  [33, 31, 35],
  [39, 35, 33],
  [31, 29, 32],
  [37, 34, 34],
];
var y = Y0;
while (y < Y1) {
  var h = 0.14 + e.rnd() * 0.07;
  var x = X0 - e.rnd() * 0.4;
  while (x < X1) {
    var w = 0.3 + e.rnd() * 0.32;
    var gap = 0.0025;
    var bx = x + gap;
    var by = y + gap;
    var bw = w - 2 * gap;
    var bh = h - 2 * gap;
    // a worn outline: the corners rounded off unevenly
    var c = function () {
      return 0.004 + e.rnd() * 0.012;
    };
    var j = function () {
      return (e.rnd() - 0.5) * 0.004;
    };
    var c1 = c();
    var c2 = c();
    var c3 = c();
    var c4 = c();
    g.beginPath();
    g.moveTo(bx + c1, by + j());
    g.lineTo(bx + bw * 0.5, by + j());
    g.lineTo(bx + bw - c2, by + j());
    g.quadraticCurveTo(bx + bw, by, bx + bw + j(), by + c2);
    g.lineTo(bx + bw + j(), by + bh - c3);
    g.quadraticCurveTo(bx + bw, by + bh, bx + bw - c3, by + bh + j());
    g.lineTo(bx + bw * 0.5, by + bh + j());
    g.lineTo(bx + c4, by + bh + j());
    g.quadraticCurveTo(bx, by + bh, bx + j(), by + bh - c4);
    g.lineTo(bx + j(), by + c1);
    g.quadraticCurveTo(bx, by, bx + c1, by);
    g.closePath();
    var t = tones[Math.floor(e.rnd() * tones.length)];
    var k = 0.85 + e.rnd() * 0.3;
    g.fillStyle = "rgb(" + Math.round(t[0] * k) + "," + Math.round(t[1] * k) + "," + Math.round(t[2] * k) + ")";
    g.fill();
    g.save();
    g.clip();
    // mottling: the stone is never one colour
    for (var m = 0; m < 5; m++) {
      var mx = bx + e.rnd() * bw;
      var my = by + e.rnd() * bh;
      var mr = 0.03 + e.rnd() * 0.08;
      var mot = g.createRadialGradient(mx, my, 0, mx, my, mr);
      var dark = e.rnd() < 0.6;
      mot.addColorStop(0, dark ? "rgba(0, 0, 0, 0.18)" : "rgba(120, 112, 104, 0.06)");
      mot.addColorStop(1, "rgba(0, 0, 0, 0)");
      g.fillStyle = mot;
      g.fillRect(mx - mr, my - mr, 2 * mr, 2 * mr);
    }
    // its face lit a little from above, the lower edge in shadow
    var face = g.createLinearGradient(0, by, 0, by + bh);
    face.addColorStop(0, "rgba(160, 152, 144, 0.07)");
    face.addColorStop(0.12, "rgba(160, 152, 144, 0)");
    face.addColorStop(0.75, "rgba(0, 0, 0, 0)");
    face.addColorStop(1, "rgba(0, 0, 0, 0.32)");
    g.fillStyle = face;
    g.fillRect(bx - 0.01, by - 0.01, bw + 0.02, bh + 0.02);
    // pits and grains
    for (var i = 0; i < 26; i++) {
      var px = bx + e.rnd() * bw;
      var py = by + e.rnd() * bh;
      var pr = 0.0012 + e.rnd() * 0.0035;
      g.fillStyle = e.rnd() < 0.7 ? "rgba(0, 0, 0, 0.22)" : "rgba(180, 170, 160, 0.05)";
      g.beginPath();
      g.ellipse(px, py, pr * 1.5, pr, e.rnd() * 3, 0, 6.283);
      g.fill();
    }
    g.restore();
    x += w;
  }
  y += h;
}
// damp running down from the joints
for (var s = 0; s < 11; s++) {
  var sx = X0 + e.rnd() * (X1 - X0);
  var sy = Y0 + e.rnd() * 0.9;
  var sl = 0.3 + e.rnd() * 0.8;
  var sw = 0.02 + e.rnd() * 0.06;
  var damp = g.createLinearGradient(0, sy, 0, sy + sl);
  damp.addColorStop(0, "rgba(3, 5, 7, 0)");
  damp.addColorStop(0.2, "rgba(3, 5, 7, 0.3)");
  damp.addColorStop(1, "rgba(3, 5, 7, 0)");
  g.fillStyle = damp;
  g.beginPath();
  g.moveTo(sx - sw / 2, sy);
  g.bezierCurveTo(sx - sw * 0.3, sy + sl * 0.5, sx - sw * 0.2, sy + sl * 0.8, sx, sy + sl);
  g.bezierCurveTo(sx + sw * 0.2, sy + sl * 0.8, sx + sw * 0.3, sy + sl * 0.5, sx + sw / 2, sy);
  g.fill();
}
// near darkness: a little light in the middle, the rest falling away
var light = g.createRadialGradient(A / 2, 0.45, 0.02, A / 2, 0.5, 1.05);
light.addColorStop(0, "rgba(110, 96, 86, 0.08)");
light.addColorStop(0.35, "rgba(0, 0, 0, 0.3)");
light.addColorStop(1, "rgba(0, 0, 0, 0.82)");
g.fillStyle = light;
g.fillRect(X0, Y0, X1 - X0, Y1 - Y0);
