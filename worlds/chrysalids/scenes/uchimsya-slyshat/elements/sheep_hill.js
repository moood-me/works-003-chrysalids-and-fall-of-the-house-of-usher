var t = e.t;
function hh(x) {
  return (
    6 * Math.exp((-x * x) / 260) +
    1.2 * Math.exp((-(x + 25) * (x + 25)) / 300) +
    0.25 * Math.sin(x * 0.2 + 1) * (1 - Math.exp((-x * x) / 50)) * Math.exp((-x * x) / 1200)
  );
}
var gr = g.createLinearGradient(0, -6, 0, 0);
gr.addColorStop(0, "#9a996c");
gr.addColorStop(1, "#8d8c63");
g.fillStyle = gr;
g.beginPath();
g.moveTo(-60, 0.1);
for (var x = -60; x <= 60; x += 0.4) g.lineTo(x, Math.min(0.1, -hh(x)));
g.lineTo(60, 0.1);
g.closePath();
g.fill();
g.save();
g.clip();
var sg = g.createLinearGradient(-25, 0, 15, 0);
sg.addColorStop(0, "rgba(50,46,30,0.25)");
sg.addColorStop(1, "rgba(50,46,30,0)");
g.fillStyle = sg;
g.fillRect(-60, -8, 120, 9);
for (var i = 0; i < 30; i++) {
  var x = -40 + e.rnd() * 80,
    y = -hh(x) + 0.5 + e.rnd() * 4,
    r = 2 + e.rnd() * 5,
    lt = e.rnd() < 0.5;
  g.save();
  g.translate(x, y);
  g.scale(1, 0.2);
  var q = g.createRadialGradient(0, 0, 0, 0, 0, r);
  q.addColorStop(0, lt ? "rgba(220,210,160,0.2)" : "rgba(60,58,38,0.15)");
  q.addColorStop(1, lt ? "rgba(220,210,160,0)" : "rgba(60,58,38,0)");
  g.fillStyle = q;
  g.beginPath();
  g.arc(0, 0, r, 0, 7);
  g.fill();
  g.restore();
}
g.restore();
g.strokeStyle = "rgba(250,230,185,0.45)";
g.lineWidth = 0.12;
g.beginPath();
for (var x = -40; x <= 40; x += 0.4) g.lineTo(x, -hh(x));
g.stroke();
var S = [
  [-14, 1],
  [-10, -1],
  [-7, 1],
  [-4, -1],
  [4.5, 1],
  [7.5, -1],
  [10.5, 1],
  [14, 1],
  [-17.5, -1],
  [17, -1],
];
g.lineCap = "round";
for (var i = 0; i < S.length; i++) {
  var sx = S[i][0] + 0.4 * Math.sin(t * 0.013 + i * 2),
    d = S[i][1],
    gy = -hh(sx);
  var bob = Math.max(0, Math.sin(t * 0.3 + i * 1.7));
  g.strokeStyle = "#3d362c";
  g.lineWidth = 0.07;
  for (var k = 0; k < 4; k++) {
    var lx = sx + (k < 2 ? -0.28 : 0.22) * d + (k % 2) * 0.08;
    g.beginPath();
    g.moveTo(lx, gy - 0.3);
    g.lineTo(lx, gy);
    g.stroke();
  }
  g.fillStyle = "#e2dac4";
  g.beginPath();
  g.ellipse(sx, gy - 0.45, 0.46, 0.23, 0, 0, 7);
  g.fill();
  g.fillStyle = "rgba(150,138,110,0.35)";
  g.beginPath();
  g.ellipse(sx - 0.05 * d, gy - 0.38, 0.4, 0.14, 0, 0, 7);
  g.fill();
  g.fillStyle = "#3d362c";
  g.beginPath();
  g.ellipse(sx - 0.5 * d, gy - 0.52 + 0.28 * bob, 0.14, 0.09, 0.5 * d * bob, 0, 7);
  g.fill();
}
