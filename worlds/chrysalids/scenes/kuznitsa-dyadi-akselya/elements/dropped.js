// The man's lantern where it fell in the yard (place: across st_lanx), lying on its side, going out (st_glow) —
// while it is in his hand it is his (the cast's part, its light the scene's "lantern")
const s = e.state,
  glow = s.st_glow ?? 1;
g.fillStyle = "rgba(128,128,128,0.01)";
g.fillRect(0, -0.2, 0.01, 0.01);
if (!((s.st_drop || 0) > 0.5)) return;
g.save();
g.rotate(-1.35);
g.fillStyle = "#151210";
g.fillRect(-0.06, -0.2, 0.12, 0.03);
g.fillRect(-0.05, -0.04, 0.1, 0.03);
g.fillStyle = "rgba(255,196,106," + (0.25 + 0.7 * glow).toFixed(3) + ")";
g.fillRect(-0.042, -0.17, 0.084, 0.13);
g.strokeStyle = "#151210";
g.lineWidth = 0.008;
g.beginPath();
g.arc(0, -0.2, 0.05, Math.PI, 0);
g.stroke();
g.restore();
if (glow > 0.01) e.light(-0.1, -0.05, 1.6, "#ffc46a", 0.55 * glow);
