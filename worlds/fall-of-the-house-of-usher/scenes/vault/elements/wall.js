// the vault's back wall, 6.8 m off (facing us): the vaulting's curve, its courses of stone, damp running down, pale
// mineral threads, the crack (`crack` 0…1, the game's), and the doorway cut through it at its right (across 1.8…2.9 m)
// — the passage beyond shows through. In its daylight colours: the torch and the cold air of the vault light it
function doorway() {
  g.moveTo(1.8, 0.1);
  g.lineTo(1.8, -1.35);
  g.arc(2.35, -1.35, 0.55, Math.PI, 0);
  g.lineTo(2.9, 0.1);
  g.closePath();
}
// beyond the vaulting's curve: the stone of the vault itself, going up into the dark
g.fillStyle = "#252f35";
g.beginPath();
g.rect(-9, -5.2, 18, 5.3);
doorway();
g.fill("evenodd");
var gr = g.createLinearGradient(0, -4.0, 0, 0);
gr.addColorStop(0, "#3f515c");
gr.addColorStop(0.5, "#53666f");
gr.addColorStop(1, "#5b6e77");
g.beginPath();
g.moveTo(-9, 0.1);
g.lineTo(-9, -2.4);
g.bezierCurveTo(-6, -3.6, -2.5, -4.0, 0, -4.0);
g.bezierCurveTo(2.5, -4.0, 6, -3.6, 9, -2.4);
g.lineTo(9, 0.1);
g.closePath();
doorway();
g.fillStyle = gr;
g.fill("evenodd");
g.save();
g.clip("evenodd");
// its courses: stones of uneven length, some darker with damp, some paler
var y = 0;
while (y > -4.2) {
  var h = 0.34 + e.rnd() * 0.18, x = -9 - e.rnd() * 0.8;
  while (x < 9) {
    var w = 0.7 + e.rnd() * 0.7, v = e.rnd();
    g.fillStyle = v < 0.55 ? "rgba(22,34,40," + (0.06 + v * 0.22).toFixed(3) + ")" : "rgba(170,190,195," + ((v - 0.55) * 0.14).toFixed(3) + ")";
    g.fillRect(x, y - h, w, h);
    g.strokeStyle = "rgba(20,30,35,0.5)";
    g.lineWidth = 0.014;
    g.strokeRect(x, y - h, w, h);
    x += w;
  }
  y -= h;
}
// damp running down from the vaulting
g.filter = "blur(0.06px)";
for (var i = 0; i < 22; i++) {
  var sx = -8 + e.rnd() * 16, st = -3.6 + e.rnd() * 1.2, sl = 0.8 + e.rnd() * 1.8, sw = 0.05 + e.rnd() * 0.18;
  var sg = g.createLinearGradient(0, st, 0, st + sl);
  sg.addColorStop(0, "rgba(18,40,46,0.5)");
  sg.addColorStop(1, "rgba(18,40,46,0)");
  g.fillStyle = sg;
  g.beginPath();
  g.ellipse(sx, st + sl / 2, sw, sl / 2, 0, 0, 7);
  g.fill();
}
g.filter = "none";
// pale mineral threads where water ran and dried
for (var j = 0; j < 14; j++) {
  var tx = -7 + e.rnd() * 14, tt = -3 + e.rnd() * 1.5, tl = 0.4 + e.rnd() * 1.2;
  var hg = g.createLinearGradient(0, tt, 0, tt + tl);
  hg.addColorStop(0, "rgba(205,220,220,0)");
  hg.addColorStop(0.5, "rgba(205,220,220,0.22)");
  hg.addColorStop(1, "rgba(205,220,220,0)");
  g.fillStyle = hg;
  g.fillRect(tx, tt, 0.012, tl);
}
e.lib.crack(g, e.state.crack ?? 0);
// the foot of the wall, darker where the floor's damp climbs it
var bg = g.createLinearGradient(0, -0.6, 0, 0.1);
bg.addColorStop(0, "rgba(16,26,30,0)");
bg.addColorStop(1, "rgba(16,26,30,0.55)");
g.fillStyle = bg;
g.fillRect(-9, -0.6, 18, 0.7);
g.restore();
