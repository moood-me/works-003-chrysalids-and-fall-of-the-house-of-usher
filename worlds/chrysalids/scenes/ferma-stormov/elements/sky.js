var A = e.aspect,
  d = e.state.dusk == null ? 0.5 : e.state.dusk;
var gr = g.createLinearGradient(0, -0.35, 0, 0.64);
gr.addColorStop(0, "#1d1b34");
gr.addColorStop(0.35, "#363056");
gr.addColorStop(0.6, "#5f4c70");
gr.addColorStop(0.8, "#9a7686");
gr.addColorStop(0.92, "#c49c90");
gr.addColorStop(1, "#dcc0a4");
g.fillStyle = gr;
g.fillRect(-0.4, -0.4, A + 0.8, 1.05);
g.fillStyle = "#dcc0a4";
g.fillRect(-0.4, 0.64, A + 0.8, 0.7);
var dk = g.createLinearGradient(0, -0.35, 0, 0.7);
dk.addColorStop(0, "rgba(14,12,28," + d * 0.55 + ")");
dk.addColorStop(1, "rgba(14,12,28," + d * 0.2 + ")");
g.fillStyle = dk;
g.fillRect(-0.4, -0.4, A + 0.8, 1.7);
var gl = g.createRadialGradient(A * 0.42, 0.66, 0.02, A * 0.42, 0.66, 0.7);
gl.addColorStop(0, "rgba(235,190,150," + 0.22 * (1 - d * 0.7) + ")");
gl.addColorStop(1, "rgba(235,190,150,0)");
g.fillStyle = gl;
g.fillRect(-0.4, 0, A + 0.8, 0.7);
var a = 0.1 + d * 0.75;
for (var i = 0; i < 45; i++) {
  var x = -0.3 + e.rnd() * (A + 0.6),
    y = -0.32 + e.rnd() * 0.55,
    r = e.rnd();
  g.fillStyle = "rgba(235,230,245," + a * (0.2 + 0.5 * r) * (0.8 + 0.2 * Math.sin(e.t * 0.6 + i * 1.7)) + ")";
  g.fillRect(x, y, 0.0016 + r * 0.0012, 0.0016 + r * 0.0012);
}
var sx = A * 0.2,
  sy = 0.33;
e.light(sx, sy, 0.025, "#f3e6cc", 0.45 * (0.4 + a));
g.fillStyle = "rgba(245,236,220," + (0.5 + 0.4 * a) + ")";
g.beginPath();
g.arc(sx, sy, 0.0034, 0, 7);
g.fill();
