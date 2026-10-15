var w = 0.5 + (e.state.wind == null ? 0.4 : e.state.wind);
g.fillStyle = e.color;
g.beginPath();
g.moveTo(-110, 0.3);
for (var x = -110; x <= 4; x += 0.6) {
  var s = Math.sin(e.t * 0.6 + x * 0.21) * 0.5 + Math.sin(e.t * 0.37 + x * 0.07) * 0.5;
  g.lineTo(x + s * 0.1 * w, -1.0 + 0.05 * Math.sin(x * 3.1) + s * 0.04);
}
g.lineTo(5, 0.3);
g.closePath();
g.fill();
