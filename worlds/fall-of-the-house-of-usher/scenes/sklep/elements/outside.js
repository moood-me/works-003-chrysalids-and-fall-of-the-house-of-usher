// close (insert `outside`): another night, the iron door from the passage, shut, in the light of one candle on the floor;
// the crack (`crack`) in the wall beside it. Painted once, in stage heights about lib.CARD (the frame's middle), the
// candle's light as it burns steadily (FL): the dark (the base); the passage — its stones lit near the candle, the
// crack, the floor and the candle's pool, the door's deep frame, the candle in its dish (layer room); the door's leaf
// of iron plates and its bands, the keyhole — the key is gone (layer leaf, which the knocks shake); the candle's flame
// (layer flame). What moves is its shader's (outside.wgsl) and its animate's: the flame's flicker and the light with it,
// the knocks (`knock` from this side, `answer` from the other — pulses 1 → 0): the door trembling, dust shaken from its
// top falling, the flame dipping
var L = e.lib, A = e.anim, X = L.CARD[0], M = L.CARD[1], C = L.CANDLE, cx = C[0], cy = C[1], FL = L.FL;
g.translate(X, M);
L.cardDark(g, "#030405");
// its points: the door's leaf (where it is knocked on) and the passage beside it, the way up (where one goes from it)
e.at(0.03, -0.05, "door");
e.at(0.5, 0.0, "away");
// the candle's glow (its animate: as it flickers and dips)
e.light(cx, cy + 0.01, 0.6, "#ffb870", 0.7 * FL);
e.layer("room", { box: [X - 1.42, M - 0.72, X + 1.42, M + 0.72] }, function (g) {
  g.translate(X, M);
  // the stones of the passage round the door, rough and uneven, lit only near the candle: warm by it, a cold grey a
  // little way off, gone into the dark beyond
  for (var r = 0; r < 9; r++) {
    var y = 0.38 - r * 0.13;
    for (var x = -1.4 - A.hash(r, 2) * 0.2; x < 1.4; ) {
      var v = A.hash(r * 31 + Math.round(x * 10), 3), w = 0.2 + A.hash(r * 17 + Math.round(x * 10), 5) * 0.2;
      var k = A.clamp(1.15 - Math.hypot(x + w / 2 - cx, (y - 0.06 - cy) * 1.3) / 0.85, 0.08, 1) * FL;
      g.fillStyle = "rgb(" + Math.round(4 + v * 5 + 62 * k * k) + "," + Math.round(6 + v * 5 + 42 * k * k) + "," + Math.round(8 + v * 5 + 26 * k * k) + ")";
      g.beginPath();
      g.roundRect(x + 0.007, y - 0.123 + v * 0.006, w - 0.012, 0.114 - v * 0.006, 0.012);
      g.fill();
      x += w;
    }
  }
  // the crack in the wall beside the door, in the candlelight
  g.save();
  g.translate(-0.56, 0.37);
  g.scale(0.24, 0.24);
  L.crack(g, e.state.crack ?? 0);
  g.restore();
  // the floor, the candle's pool on it
  var fg = g.createLinearGradient(0, 0.38, 0, 0.62);
  fg.addColorStop(0, "#0d1011");
  fg.addColorStop(1, "#040506");
  g.fillStyle = fg;
  g.fillRect(-1.4, 0.38, 2.8, 0.34);
  g.save();
  g.scale(1, 0.25);
  var pr = 0.6, py = (cy + 0.1) * 4, pg = g.createRadialGradient(cx, py, 0, cx, py, pr);
  pg.addColorStop(0, "rgba(214,150,90," + (0.3 * FL).toFixed(3) + ")");
  pg.addColorStop(0.5, "rgba(160,105,65," + (0.1 * FL).toFixed(3) + ")");
  pg.addColorStop(1, "rgba(160,105,65,0)");
  g.fillStyle = pg;
  g.fillRect(cx - pr, py - pr, 2 * pr, 2 * pr);
  g.restore();
  // the door's deep frame
  g.fillStyle = "#030405";
  g.beginPath();
  g.moveTo(-0.47, 0.385);
  g.lineTo(-0.47, -0.28);
  g.arc(0.03, -0.28, 0.5, Math.PI, 0);
  g.lineTo(0.53, 0.385);
  g.closePath();
  g.fill();
  // the candle on the floor, in its dish
  g.fillStyle = "#3a2e20";
  g.beginPath();
  g.ellipse(cx, cy + 0.1, 0.05, 0.012, 0, 0, 7);
  g.fill();
  var wx = g.createLinearGradient(cx - 0.012, 0, cx + 0.012, 0);
  wx.addColorStop(0, "#8c7f68");
  wx.addColorStop(1, "#d8cdb4");
  g.fillStyle = wx;
  g.fillRect(cx - 0.012, cy + 0.03, 0.024, 0.068);
});
// the leaf: iron plates riveted, the bands, the lock plate and the keyhole; going dark away from the candle, its light
// across it
e.layer("leaf", { box: [X - 0.45, M - 0.75, X + 0.51, M + 0.39] }, function (g) {
  g.translate(X, M);
  g.beginPath();
  g.moveTo(-0.43, 0.38);
  g.lineTo(-0.43, -0.28);
  g.arc(0.03, -0.28, 0.46, Math.PI, 0);
  g.lineTo(0.49, 0.38);
  g.closePath();
  g.fillStyle = "#101517";
  g.fill();
  g.clip();
  for (var p = 0; p < 4; p++) {
    var px = -0.43 + p * 0.23;
    g.fillStyle = p % 2 ? "#121719" : "#0e1214";
    g.fillRect(px, -0.8, 0.23, 1.2);
    g.fillStyle = "rgba(0,0,0,0.5)";
    g.fillRect(px + 0.226, -0.8, 0.006, 1.2);
    g.fillStyle = "rgba(150,160,158,0.16)";
    for (var q = 0; q < 9; q++) {
      g.beginPath();
      g.arc(px + 0.02, -0.66 + q * 0.13, 0.007, 0, 7);
      g.arc(px + 0.21, -0.66 + q * 0.13, 0.007, 0, 7);
      g.fill();
    }
  }
  g.fillStyle = "#0e1214";
  g.fillRect(-0.5, -0.36, 1.1, 0.05);
  g.fillRect(-0.5, 0.2, 1.1, 0.05);
  g.fillStyle = "#0b0f10";
  g.fillRect(-0.36, -0.08, 0.13, 0.2);
  g.strokeStyle = "rgba(200,140,90,0.22)";
  g.lineWidth = 0.003;
  g.strokeRect(-0.36, -0.08, 0.13, 0.2);
  g.fillStyle = "rgba(200,140,90,0.12)";
  g.fillRect(-0.5, -0.36, 1.1, 0.005);
  g.fillRect(-0.5, 0.2, 1.1, 0.005);
  g.fillStyle = "#000";
  g.beginPath();
  g.arc(-0.295, -0.01, 0.012, 0, 7);
  g.fill();
  g.fillRect(-0.3, -0.01, 0.01, 0.045);
  var dk = g.createRadialGradient(cx, cy, 0.2, cx, cy, 1.2);
  dk.addColorStop(0, "rgba(2,3,4,0)");
  dk.addColorStop(1, "rgba(2,3,4,0.75)");
  g.fillStyle = dk;
  g.fillRect(-0.5, -0.8, 1.1, 1.2);
  var lg = g.createRadialGradient(cx, cy, 0, cx, cy, 1.1);
  lg.addColorStop(0, "rgba(240,170,100," + (0.22 * FL).toFixed(3) + ")");
  lg.addColorStop(0.5, "rgba(160,100,60," + (0.08 * FL).toFixed(3) + ")");
  lg.addColorStop(1, "rgba(160,100,60,0)");
  g.fillStyle = lg;
  g.fillRect(-0.5, -0.8, 1.1, 1.2);
});
// the flame, as tall as it burns steadily (its shader stretches it with the flicker and leans its tip)
e.layer("flame", { box: [X + cx - 0.03, M + cy - 0.05, X + cx + 0.03, M + cy + 0.035] }, function (g) {
  g.translate(X, M);
  var h = 0.05 * FL, base = cy + 0.03;
  var flg = g.createLinearGradient(0, base, 0, base - h);
  flg.addColorStop(0, "rgba(255,240,200,0.95)");
  flg.addColorStop(0.5, "rgba(250,170,80,0.85)");
  flg.addColorStop(1, "rgba(220,100,40,0)");
  g.fillStyle = flg;
  g.beginPath();
  g.moveTo(cx - 0.008, base);
  g.quadraticCurveTo(cx - 0.012, base - h * 0.5, cx, base - h);
  g.quadraticCurveTo(cx + 0.012, base - h * 0.5, cx + 0.008, base);
  g.closePath();
  g.fill();
});
