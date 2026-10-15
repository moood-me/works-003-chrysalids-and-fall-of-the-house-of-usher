for (var i = 0; i < 18; i++) {
  var k = (e.t * 0.03 + i / 18) % 1;
  var y = -k * 6;
  var x = -k * k * 3.5 + 0.3 * Math.sin(e.t * 0.3 + k * 6);
  var r = 0.2 + k * 0.9;
  g.fillStyle = "rgba(175,158,175," + 0.1 * (1 - k) * Math.min(1, k * 8) + ")";
  g.beginPath();
  g.arc(x, y, r, 0, 7);
  g.fill();
}
