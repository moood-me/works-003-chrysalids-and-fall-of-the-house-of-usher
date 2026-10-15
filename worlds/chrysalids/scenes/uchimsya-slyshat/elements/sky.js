var A = e.aspect,
  t = 0,
  s = e.state || {},
  dk = Math.max(0, Math.min(1, +(s.dusk || 0))),
  hz = 0.33;
function mx(a, b, u) {
  return (
    "rgb(" +
    Math.round(a[0] + (b[0] - a[0]) * u) +
    "," +
    Math.round(a[1] + (b[1] - a[1]) * u) +
    "," +
    Math.round(a[2] + (b[2] - a[2]) * u) +
    ")"
  );
}
var gr = g.createLinearGradient(0, -0.35, 0, hz + 0.1);
gr.addColorStop(0, mx([139, 151, 166], [58, 62, 92], dk));
gr.addColorStop(0.45, mx([190, 191, 183], [122, 104, 118], dk));
gr.addColorStop(0.8, mx([228, 215, 186], [198, 134, 104], dk));
gr.addColorStop(1, mx([238, 224, 192], [214, 152, 112], dk));
g.fillStyle = gr;
g.fillRect(-0.4, -0.4, A + 0.8, 1.7);
var sx = A * 0.8,
  sy = 0.19 + dk * 0.16;
var sg = g.createRadialGradient(sx, sy, 0, sx, sy, 0.8);
sg.addColorStop(0, "rgba(255,238,205," + (0.5 - 0.2 * dk) + ")");
sg.addColorStop(0.25, "rgba(250,226,186," + (0.18 - 0.06 * dk) + ")");
sg.addColorStop(1, "rgba(250,226,186,0)");
g.fillStyle = sg;
g.fillRect(sx - 0.8, sy - 0.8, 1.6, 1.6);
var cg = g.createRadialGradient(sx, sy, 0, sx, sy, 0.045);
cg.addColorStop(0, "rgba(255,250,236,0.95)");
cg.addColorStop(0.6, "rgba(255,244,220,0.7)");
cg.addColorStop(1, "rgba(255,240,210,0)");
g.fillStyle = cg;
g.fillRect(sx - 0.05, sy - 0.05, 0.1, 0.1);
for (var k = 0; k < 7; k++) {
  var W = A + 1.4;
  var cx = ((k * 0.37 * A + 0.3 + t * 0.003 * (1 + k * 0.2)) % W) - 0.7,
    cy = 0.03 + k * 0.04 + 0.02 * Math.sin(k * 2.1);
  var rx = 0.25 + 0.2 * ((k * 0.618) % 1);
  g.save();
  g.translate(cx, cy);
  g.scale(1, 0.07);
  var q = g.createRadialGradient(0, 0, 0, 0, 0, rx);
  q.addColorStop(0, "rgba(250,234,205," + (0.22 - 0.08 * dk) + ")");
  q.addColorStop(1, "rgba(250,234,205,0)");
  g.fillStyle = q;
  g.beginPath();
  g.arc(0, 0, rx, 0, 7);
  g.fill();
  g.restore();
}
