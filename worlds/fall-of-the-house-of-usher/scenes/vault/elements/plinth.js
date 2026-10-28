// the stone plinth the coffin rests on: the front of its lower step (here), and of the upper one set back on it (a
// part); their tops are planes of their own (plinth_step, plinth_top). Dressed stone, its arrises worn pale
function front(g, w, y0, y1) {
  var st = g.createLinearGradient(-w, 0, w, 0);
  st.addColorStop(0, "#56666c");
  st.addColorStop(1, "#66777d");
  g.fillStyle = st;
  g.fillRect(-w, y1, 2 * w, y0 - y1);
  g.fillStyle = "rgba(200,212,214,0.4)";
  g.fillRect(-w, y1, 2 * w, 0.015);
  g.fillStyle = "rgba(18,28,32,0.4)";
  g.fillRect(-w, y0 - 0.03, 2 * w, 0.03);
  g.strokeStyle = "rgba(18,28,32,0.45)";
  g.lineWidth = 0.008;
  for (var x = -w + 0.45; x < w; x += 0.45) {
    g.beginPath();
    g.moveTo(x, y1);
    g.lineTo(x, y0);
    g.stroke();
  }
}
front(g, 0.95, 0, -0.17);
e.part(0, 0.12, function (g) {
  front(g, 0.85, -0.17, -0.43);
}, [-0.9, -0.45, 0.9, 0.02]);
