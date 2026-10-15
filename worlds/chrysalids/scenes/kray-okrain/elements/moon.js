const A = e.aspect,
  x = A * 0.2,
  y = 0.12,
  r = 0.026;
let h = g.createRadialGradient(x, y, r * 0.8, x, y, r * 16);
h.addColorStop(0, "rgba(200,212,236,0.26)");
h.addColorStop(0.25, "rgba(170,186,220,0.09)");
h.addColorStop(1, "rgba(150,170,210,0)");
g.fillStyle = h;
g.beginPath();
g.arc(x, y, r * 16, 0, 7);
g.fill();
let h2 = g.createRadialGradient(x, y, r, x, y, r * 2.8);
h2.addColorStop(0, "rgba(220,228,244,0.34)");
h2.addColorStop(1, "rgba(220,228,244,0)");
g.fillStyle = h2;
g.beginPath();
g.arc(x, y, r * 2.8, 0, 7);
g.fill();
g.fillStyle = "#d6ddeb";
g.beginPath();
g.arc(x, y, r, 0, 7);
g.fill();
g.fillStyle = "rgba(150,165,190,0.32)";
g.beginPath();
g.arc(x - r * 0.3, y - r * 0.2, r * 0.28, 0, 7);
g.fill();
g.beginPath();
g.arc(x + r * 0.35, y + r * 0.3, r * 0.18, 0, 7);
g.fill();
