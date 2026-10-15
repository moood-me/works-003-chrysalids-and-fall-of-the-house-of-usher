g.fillStyle = "#6f5a5c";
g.fillRect(-2000, -600, 4000, 1200);
var cols = ["#76605f", "#6a5558", "#7b6461", "#655257"];
for (var i = 0; i < 220; i++) {
  var x = -2000 + e.rnd() * 4000,
    y = -600 + e.rnd() * 1200,
    w = 60 + e.rnd() * 200,
    h = 40 + e.rnd() * 140;
  g.fillStyle = cols[Math.floor(e.rnd() * 4)];
  g.globalAlpha = 0.7;
  g.fillRect(x, y, w, h);
}
g.globalAlpha = 1;
