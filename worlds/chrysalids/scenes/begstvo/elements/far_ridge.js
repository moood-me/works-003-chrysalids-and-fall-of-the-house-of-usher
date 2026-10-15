const R = (x) => {
  let r =
    12 +
    70 * Math.exp(-Math.pow((x + 820) / 380, 2)) +
    30 * Math.exp(-Math.pow((x + 1500) / 300, 2)) +
    6 * Math.sin(x * 0.0045) +
    4 * Math.sin(x * 0.013);
  if (x > -200) r *= Math.max(0.25, 1 - (x + 200) / 1200);
  return r;
};
g.fillStyle = "#24324c";
g.beginPath();
g.moveTo(-3200, 300);
for (let x = -3200; x <= 3200; x += 20) g.lineTo(x, -R(x));
g.lineTo(3200, 300);
g.closePath();
g.fill();
g.fillStyle = "#202d45";
for (let x = -2400; x < 2600; x += 14 + e.rnd() * 40) {
  const h = 3 + e.rnd() * 6;
  const y = -R(x) + 2;
  g.beginPath();
  g.ellipse(x, y, 6 + e.rnd() * 10, h, 0, Math.PI, 0);
  g.fill();
}
