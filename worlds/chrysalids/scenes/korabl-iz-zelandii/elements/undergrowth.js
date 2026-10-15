g.fillStyle = "#352f3c";
for (let x = -70; x < 70; x += 1.4) {
  const r = 0.5 + e.rnd() * 1.2;
  g.beginPath();
  g.ellipse(x, -0.05, r * 1.5, r * 0.7, 0, Math.PI, 0);
  g.fill();
}
g.strokeStyle = "#352f3c";
g.lineCap = "round";
for (let i = 0; i < 120; i++) {
  const x = -70 + e.rnd() * 140,
    h = 0.4 + e.rnd() * e.rnd() * 2.5,
    l = (e.rnd() - 0.5) * 0.8 + 0.05 * Math.sin(e.t * 0.3 + i);
  g.lineWidth = 0.04 + e.rnd() * 0.05;
  g.beginPath();
  g.moveTo(x, 0);
  g.quadraticCurveTo(x + l * h * 0.3, -h * 0.6, x + l * h, -h);
  g.stroke();
}
