// the coffin's far side, seen from within over the near one while it is open: the dull satin it is lined with, gathered
// in soft pleats, its top edge of wood. Its points — the far corners of its ends, where the bearers' other hands hold it
// (coffin_far#head, coffin_far#foot), and its rim (coffin_far#rim), where a hand grips it
g.fillStyle = "#b9ad9a";
g.fillRect(-1.0, -0.34, 2.0, 0.3);
for (var i = 0; i < 26; i++) {
  var x = -0.98 + i * 0.077;
  var pg = g.createLinearGradient(x, 0, x + 0.077, 0);
  pg.addColorStop(0, "rgba(255,248,232,0.18)");
  pg.addColorStop(0.5, "rgba(60,50,40,0.12)");
  pg.addColorStop(1, "rgba(255,248,232,0.18)");
  g.fillStyle = pg;
  g.fillRect(x, -0.34, 0.077, 0.3);
}
var lg = g.createLinearGradient(0, -0.34, 0, -0.04);
lg.addColorStop(0, "rgba(0,0,0,0)");
lg.addColorStop(1, "rgba(30,24,20,0.45)");
g.fillStyle = lg;
g.fillRect(-1.0, -0.34, 2.0, 0.3);
g.fillStyle = "#4a3a30";
g.fillRect(-1.0, -0.355, 2.0, 0.02);
e.at(-0.97, -0.27, "head");
e.at(0, -0.4, "rim");
e.at(0.97, -0.27, "foot");
