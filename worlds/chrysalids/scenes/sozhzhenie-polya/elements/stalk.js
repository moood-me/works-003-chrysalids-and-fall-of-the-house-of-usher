// The one stalk the fire left standing at the field's edge by the track (morning: David turns to it): tall, its two
// heavy ears hanging like hooks, painted in daylight colours; its point `ear` (where the camera comes, where his hand
// reaches)
const a = 0, h = 2.0, col = '#8a8058';
g.strokeStyle = col;
g.fillStyle = col;
g.lineCap = 'round';
g.lineWidth = 0.04;
const tx = a + 0.22, ty = -h;
g.beginPath();
g.moveTo(a, 0.05);
g.bezierCurveTo(a + 0.05, -h * 0.45, a + 0.12, -h * 0.95, tx, ty);
g.stroke();
g.beginPath();
g.moveTo(tx, ty);
g.quadraticCurveTo(tx + 0.12, ty - 0.07, tx + 0.15, ty + 0.03);
g.stroke();
const ear = (x, y, ang, L, W) => {
  g.save();
  g.translate(x, y);
  g.rotate(ang);
  g.beginPath();
  g.moveTo(0, 0);
  g.bezierCurveTo(W, -L * 0.25, W * 0.9, -L * 0.8, 0, -L);
  g.bezierCurveTo(-W * 0.9, -L * 0.8, -W, -L * 0.25, 0, 0);
  g.fill();
  g.lineWidth = 0.008;
  for (let j = 1; j < 8; j++) {
    g.beginPath();
    g.moveTo(0, (-L * j) / 8); g.lineTo(0.09, (-L * j) / 8 - 0.06);
    g.moveTo(0, (-L * j) / 8); g.lineTo(-0.09, (-L * j) / 8 - 0.06);
    g.stroke();
  }
  g.restore();
};
ear(tx + 0.15, ty + 0.03, 2.35, 0.42, 0.075);
ear(tx + 0.07, ty, 1.45, 0.32, 0.06);
e.at(tx + 0.12, ty + 0.2, 'ear');
