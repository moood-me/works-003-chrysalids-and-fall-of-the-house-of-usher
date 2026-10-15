// close (insert `inside`): her eyes, from inside the shut coffin — near-total dark; the lid a hand above the face, its far
// edge a hairline of torchlight. Painted once, in stage heights (about lib.CARD, the frame's middle: y −0.5…0.5 about
// it): the dark and the lid's rough underside as the hairline shows it (the base); the hairline itself (layer seam); the
// four screws' points as they are when through (layer points); the wood split round each (layer splinters). What moves
// is its shader's (inside.glsl) and its animate's: the flame's tremble and how much of it is left (`seam`), the two
// men's shapes passing over it (`shade`), the points coming through one after another (`tip`), grit falling
var L = e.lib, A = e.anim, Y = L.SEAM, X = L.CARD[0], M = L.CARD[1];
g.translate(X, M);
L.cardDark(g, "#010101");
// the lid's underside: rough boards, only just, near the seam
var under = g.createLinearGradient(0, Y, 0, Y + 0.22);
under.addColorStop(0, "rgba(58,40,26,0.32)");
under.addColorStop(1, "rgba(20,14,9,0)");
g.fillStyle = under;
g.fillRect(-1.4, Y, 2.8, 0.22);
for (var i = 0; i < 6; i++) {
  var y = Y + 0.025 + i * 0.03;
  g.strokeStyle = "rgba(2,1,0,0.45)";
  g.lineWidth = 0.002 + e.rnd() * 0.002;
  g.beginPath();
  g.moveTo(-1.4, y);
  g.bezierCurveTo(-0.4, y + (e.rnd() - 0.5) * 0.015, 0.5, y + (e.rnd() - 0.5) * 0.015, 1.4, y);
  g.stroke();
}
// the seam's glow, in seven lengths (g0…g6: its animate dims each as the flame and the men's shapes have it)
for (var n = 0; n < 7; n++) e.light(-1.2 + n * 0.4, Y, 0.22, "#ffb070", 0.22, "g" + n);
// the hairline: uneven (the boards meet unevenly), brightest where they gape
e.layer("seam", { box: [X - 1.42, M + Y - 0.012, X + 1.42, M + Y + 0.012] }, function (g) {
  g.translate(X, M);
  g.lineCap = "round";
  for (var x = -1.4; x < 1.4; x += 0.02) {
    var gape = 0.55 + 0.45 * (0.5 + 0.5 * A.noise(x * 6, 3));
    g.strokeStyle = "rgba(255,200,135," + gape.toFixed(3) + ")";
    g.lineWidth = 0.002 + 0.0025 * gape;
    g.beginPath();
    g.moveTo(x, Y + 0.0012 * A.noise(x * 11, 5));
    g.lineTo(x + 0.02, Y + 0.0012 * A.noise((x + 0.02) * 11, 5));
    g.stroke();
  }
});
// the screws' points, through: each a threaded cone from the wood down toward her face, a glint of the seam's light
// along one flank (its shader slides each out of the wood as far as it has come)
e.layer("points", { box: [X - 0.7, M + Y, X + 1.0, M + Y + 0.22] }, function (g) {
  g.translate(X, M);
  for (var n = 0; n < 4; n++) {
    var sc = L.SCREWS[n], px = sc[0], py = sc[1], z = L.near(py), out = 0.12 * z, w0 = 0.015 * z;
    var tg = g.createLinearGradient(px - w0, 0, px + w0, 0);
    tg.addColorStop(0, "#0b0a09");
    tg.addColorStop(0.62, "#cc9864");
    tg.addColorStop(1, "#100e0d");
    g.fillStyle = tg;
    g.beginPath();
    g.moveTo(px - w0, py);
    g.lineTo(px + w0, py);
    g.lineTo(px, py + out);
    g.closePath();
    g.fill();
    g.strokeStyle = "rgba(8,6,5,0.85)";
    g.lineWidth = 0.0018 * z;
    for (var th = 0.004 * z; th < out - 0.007 * z; th += 0.016 * z) {
      var w = w0 * (1 - th / out);
      g.beginPath();
      g.moveTo(px - w, py + th);
      g.lineTo(px + w, py + th + 0.005 * z);
      g.stroke();
    }
  }
});
// the wood bulging and splitting round each point
e.layer("splinters", { box: [X - 0.7, M + Y - 0.01, X + 1.0, M + Y + 0.06] }, function (g) {
  g.translate(X, M);
  g.fillStyle = "#4e3826";
  for (var n = 0; n < 4; n++) {
    var sc = L.SCREWS[n], px = sc[0], py = sc[1], z = L.near(py);
    for (var f = 0; f < 6; f++) {
      var an = (f / 6) * Math.PI * 2 + 0.4 + n;
      g.beginPath();
      g.moveTo(px + Math.cos(an) * 0.006 * z, py + Math.sin(an) * 0.003 * z);
      g.lineTo(px + Math.cos(an + 0.15) * 0.032 * z, py + Math.sin(an + 0.15) * 0.008 * z);
      g.lineTo(px + Math.cos(an - 0.15) * 0.008 * z, py + Math.sin(an - 0.15) * 0.004 * z);
      g.closePath();
      g.fill();
    }
  }
});
