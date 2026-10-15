g.fillStyle = "#1e2137";
g.fillRect(-3000, -700, 6000, 1400);
var cols = ["#22253b", "#1b1e33", "#24273e", "#272a41", "#1f2238"];
for (var i = 0; i < 520; i++) {
  var x = -3000 + e.rnd() * 6000,
    y = -700 + e.rnd() * 1360,
    w = 40 + e.rnd() * 170,
    h = 30 + e.rnd() * 130,
    c = Math.floor(e.rnd() * 5);
  g.fillStyle = cols[c];
  g.globalAlpha = 0.75;
  g.fillRect(x, y, w, h);
  g.globalAlpha = 0.16;
  g.strokeStyle = e.rnd() < 0.5 ? "#30334c" : "#16192c";
  g.lineWidth = 1.2;
  var dir = e.rnd() < 0.5;
  for (var k = 4; k < (dir ? w : h); k += 6 + e.rnd() * 3) {
    g.beginPath();
    if (dir) {
      g.moveTo(x + k, y);
      g.lineTo(x + k, y + h);
    } else {
      g.moveTo(x, y + k);
      g.lineTo(x + w, y + k);
    }
    g.stroke();
  }
}
g.globalAlpha = 1;
