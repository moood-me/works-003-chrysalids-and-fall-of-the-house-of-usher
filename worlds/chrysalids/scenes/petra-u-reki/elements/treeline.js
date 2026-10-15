const f = (x) => -(8 + 4 * Math.sin(x / 170 + 0.4) + 2.5 * Math.sin(x / 61 + 1.7));
g.beginPath();
g.moveTo(-3000, 5);
for (let x = -3000; x <= 3000; x += 15) g.lineTo(x, f(x));
g.lineTo(3000, 5);
g.closePath();
g.fillStyle = "#737a76";
g.fill();
for (let i = 0; i < 160; i++) {
  const x = -1500 + e.rnd() * 3000,
    r = 4 + e.rnd() * 9;
  g.fillStyle = e.rnd() < 0.5 ? "#6a716d" : "#7a807b";
  g.beginPath();
  g.ellipse(x, f(x) - r * 0.4, r * 1.4, r, 0, 0, 7);
  g.fill();
}
