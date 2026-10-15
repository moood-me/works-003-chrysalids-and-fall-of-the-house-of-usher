var t = e.t;
function hh(x) {
  return 6 + 6 / (1 + Math.exp((x - 2) / 7)) + 0.3 * Math.sin(x * 0.37 + 1) * (1 - Math.exp((-(x + 8) * (x + 8)) / 20));
}
var x0 = -60,
  x1 = 60;
var gr = g.createLinearGradient(0, -12, 0, 4);
gr.addColorStop(0, "#7c7953");
gr.addColorStop(0.45, "#6a6847");
gr.addColorStop(1, "#55543a");
g.fillStyle = gr;
g.beginPath();
g.moveTo(x0, 8);
for (var x = x0; x <= x1; x += 0.25) g.lineTo(x, -hh(x));
g.lineTo(x1, 8);
g.closePath();
g.fill();
g.save();
g.clip();
var sg = g.createLinearGradient(-35, 0, 10, 0);
sg.addColorStop(0, "rgba(40,38,26,0.28)");
sg.addColorStop(1, "rgba(40,38,26,0)");
g.fillStyle = sg;
g.fillRect(x0, -20, x1 - x0, 30);
for (var i = 0; i < 55; i++) {
  var x = -45 + e.rnd() * 100,
    dep = 0.6 + e.rnd() * 10,
    r = 5 + e.rnd() * 12,
    lt = e.rnd() < 0.5;
  var y = -hh(x) + dep;
  var sl = Math.atan2(-hh(x + 1) + hh(x - 1), 2);
  g.save();
  g.translate(x, y);
  g.rotate(sl);
  g.scale(1, 0.07);
  var q = g.createRadialGradient(0, 0, 0, 0, 0, r);
  q.addColorStop(0, lt ? "rgba(205,195,140,0.16)" : "rgba(36,34,22,0.16)");
  q.addColorStop(1, lt ? "rgba(205,195,140,0)" : "rgba(36,34,22,0)");
  g.fillStyle = q;
  g.beginPath();
  g.arc(0, 0, r, 0, 7);
  g.fill();
  g.restore();
}
var R = [0.12, 0.32, 0.58, 0.9, 1.3, 1.8, 2.4, 3.1];
for (var r = 0; r < R.length; r++) {
  var dep = R[r],
    sp = 0.32 + dep * 0.06;
  g.fillStyle = r % 2 ? "rgba(70,60,40,0.3)" : "rgba(64,72,44,0.6)";
  for (var x = -15 + r * 0.13; x < -0.5; x += sp) {
    var y = -hh(x) + dep,
      sw = 0.02 * Math.sin(t * 0.6 + x * 2 + r);
    var fade = Math.min(1, (x + 15) / 4);
    g.globalAlpha = fade;
    g.beginPath();
    g.ellipse(x + sw, y - 0.04 - dep * 0.01, 0.07 + dep * 0.02, 0.035 + dep * 0.008, 0, 0, 7);
    g.fill();
  }
}
g.globalAlpha = 1;
g.restore();
for (var i = 0; i < 900; i++) {
  var x = x0 + 3 + e.rnd() * (x1 - x0 - 6),
    dep = Math.pow(e.rnd(), 1.4) * 10,
    h = 0.08 + e.rnd() * 0.32 * (1 + dep * 0.1),
    ph = e.rnd() * 6,
    lt = e.rnd() < 0.3;
  if (x > -15.3 && x < -0.3 && dep < 3.4) continue;
  var b = -hh(x) + dep + 0.03,
    sw = h * (0.2 * Math.sin(t * 0.5 + x * 0.3 + ph) + 0.08 * Math.sin(t * 1.13 + x + ph));
  g.fillStyle = lt ? "#86825a" : "#4d4b33";
  g.beginPath();
  g.moveTo(x - 0.025, b);
  g.quadraticCurveTo(x + sw * 0.3, b - h * 0.55, x + sw, b - h);
  g.quadraticCurveTo(x + sw * 0.3, b - h * 0.5, x + 0.025, b);
  g.fill();
}
g.strokeStyle = "rgba(250,228,180,0.35)";
g.lineWidth = 0.06;
g.beginPath();
for (var x = x0; x <= x1; x += 0.25) g.lineTo(x, -hh(x));
g.stroke();
