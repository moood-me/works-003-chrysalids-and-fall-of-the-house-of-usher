var cols = [
  "#bba86f",
  "#c9bb8e",
  "#99a06c",
  "#aaa678",
  "#93825c",
  "#b4ad86",
  "#a2a672",
  "#c4b07a",
  "#8f9466",
  "#b8a070",
];
g.fillStyle = "#8c8760";
g.fillRect(-1800, -460, 3600, 920);
g.save();
g.translate(0, -30);
g.rotate(0.12);
for (var gx = -2200; gx < 2200; ) {
  var w = 40 + e.rnd() * 90;
  for (var gy = -1000; gy < 1000; ) {
    var h = 22 + e.rnd() * 60;
    var c = cols[Math.floor(e.rnd() * cols.length)];
    var j1 = (e.rnd() - 0.5) * 3,
      j2 = (e.rnd() - 0.5) * 3;
    g.fillStyle = c;
    g.beginPath();
    g.moveTo(gx + 0.5, gy + 0.6 + j1);
    g.lineTo(gx + w - 0.5, gy + 0.6 + j2);
    g.lineTo(gx + w - 0.5, gy + h - 0.6);
    g.lineTo(gx + 0.5, gy + h - 0.6);
    g.closePath();
    g.fill();
    var f = e.rnd(),
      fc = e.rnd(),
      sp = 1.6 + e.rnd() * 2;
    if (f < 0.8) {
      g.strokeStyle = fc < 0.5 ? "rgba(70,58,38,0.26)" : "rgba(250,236,200,0.22)";
      g.lineWidth = 0.7;
      g.beginPath();
      if (f < 0.4) {
        for (var k = gx + 3; k < gx + w - 2; k += sp) {
          g.moveTo(k, gy + 3);
          g.lineTo(k, gy + h - 3);
        }
      } else {
        for (var k = gy + 3; k < gy + h - 2; k += sp) {
          g.moveTo(gx + 3, k);
          g.lineTo(gx + w - 3, k);
        }
      }
      g.stroke();
    }
    var lg = g.createLinearGradient(gx, gy, gx + w, gy + h);
    lg.addColorStop(0, "rgba(255,245,215,0.1)");
    lg.addColorStop(1, "rgba(60,50,30,0.1)");
    g.fillStyle = lg;
    g.fillRect(gx + 0.5, gy + 0.6, w - 1, h - 1.2);
    for (var m = 0; m < 3; m++) {
      var mx = gx + e.rnd() * w,
        my = gy + e.rnd() * h,
        r = 4 + e.rnd() * 14,
        lt = e.rnd() < 0.5;
      var mg = g.createRadialGradient(mx, my, 0, mx, my, r);
      mg.addColorStop(0, lt ? "rgba(255,244,210,0.14)" : "rgba(60,50,30,0.12)");
      mg.addColorStop(1, lt ? "rgba(255,244,210,0)" : "rgba(60,50,30,0)");
      g.fillStyle = mg;
      g.fillRect(mx - r, my - r, 2 * r, 2 * r);
    }
    gy += h;
  }
  gx += w;
}
g.restore();
g.translate(0, 30);
g.strokeStyle = "#cfc09a";
g.lineWidth = 4;
g.lineCap = "round";
g.beginPath();
g.moveTo(-1800, 150);
g.quadraticCurveTo(-600, 420, 0, 330);
g.quadraticCurveTo(500, 250, 1800, -160);
g.stroke();
g.strokeStyle = "rgba(120,100,70,0.2)";
g.lineWidth = 0.6;
g.stroke();
var px0 = -40,
  px1 = 140,
  py0 = 345,
  py1 = 430;
g.fillStyle = "#bba978";
g.fillRect(px0, py0, px1 - px0, 400 - py0);
for (var k = py0 + 0.6; k < 400; k += 0.7) {
  g.fillStyle = Math.round(k / 0.7) % 2 ? "rgba(110,92,56,0.4)" : "rgba(250,236,196,0.4)";
  g.fillRect(px0, k, px1 - px0, 0.3);
}
g.fillStyle = "#7a6347";
g.fillRect(px0, 400, px1 - px0, py1 - 400);
for (var k = 400.4; k < py1; k += 0.8) {
  g.strokeStyle = Math.round(k / 0.8) % 2 ? "rgba(50,38,26,0.35)" : "rgba(170,140,100,0.25)";
  g.lineWidth = 0.3;
  g.beginPath();
  for (var x = px0; x <= px1; x += 3) g.lineTo(x, k + 0.12 * Math.sin(x * 0.3 + k));
  g.stroke();
}
for (var m = 0; m < 70; m++) {
  var mx = px0 + ((m * 37.3) % 180),
    my = py0 + ((m * 13.7) % 84),
    r = 4 + (m % 5) * 3;
  var mg = g.createRadialGradient(mx, my, 0, mx, my, r);
  mg.addColorStop(0, m % 2 ? "rgba(255,240,200,0.16)" : "rgba(50,40,25,0.14)");
  mg.addColorStop(1, m % 2 ? "rgba(255,240,200,0)" : "rgba(50,40,25,0)");
  g.fillStyle = mg;
  g.fillRect(mx - r, my - r, 2 * r, 2 * r);
}
