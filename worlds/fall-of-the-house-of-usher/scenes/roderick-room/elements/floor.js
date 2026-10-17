// The stone floor, seen from above: big slate flags, each its own shade, the joints dark. Painted once in its own
// colours: the candles' pool, the windows' light and everyone's shadows are the scene's.
g.fillStyle = "#3a444c";
g.fillRect(-14, -4.75, 28, 9.5);
for (let x = -14; x < 14; x += 1.15) {
  for (let y = -4.75; y < 4.75; y += 1.15) {
    const a = 0.04 + e.rnd() * 0.08;
    g.fillStyle = "rgba(" + (e.rnd() < 0.5 ? "0,0,0" : "170,186,196") + "," + a + ")";
    g.fillRect(x, y, 1.15, 1.15);
  }
}
g.fillStyle = "rgba(0,0,0,0.35)";
for (let x = -14; x < 14; x += 1.15) g.fillRect(x, -4.75, 0.025, 9.5);
for (let y = -4.75; y < 4.75; y += 1.15) g.fillRect(-14, y, 28, 0.025);
