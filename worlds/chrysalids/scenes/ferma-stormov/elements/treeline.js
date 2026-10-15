// the shelter belt along the far fields (340 m), broken here and there
g.fillStyle = '#58623e';
g.beginPath();
g.moveTo(-800, 2);
for (let x = -800; x <= 800; x += 6) {
  const on = Math.sin(x * 0.004) + 0.6 * Math.sin(x * 0.011 + 2);
  g.lineTo(x, -(on > -0.3 ? 7 + 3 * Math.sin(x * 0.9) + 2 * Math.sin(x * 2.3) : 1.2));
}
g.lineTo(800, 2);
g.closePath();
g.fill();
