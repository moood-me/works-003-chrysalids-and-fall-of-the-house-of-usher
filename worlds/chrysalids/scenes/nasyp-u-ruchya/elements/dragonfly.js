const t = e.t,
  x = 1.1 * Math.sin(t * 0.19) + 0.4 * Math.sin(t * 0.51 + 1),
  y = -0.18 * Math.sin(t * 0.16 + 2) - 0.08 * Math.sin(t * 0.43);
g.save();
g.translate(x, y);
g.rotate(0.12 * Math.sin(t * 0.3));
const dir = Math.cos(t * 0.19) >= 0 ? 1 : -1;
g.scale(dir, 1);
g.strokeStyle = "#3f4638";
g.lineWidth = 0.011;
g.lineCap = "round";
g.beginPath();
g.moveTo(-0.09, 0.004);
g.lineTo(0.04, 0);
g.stroke();
g.fillStyle = "#3f4638";
g.beginPath();
g.arc(0.045, 0, 0.009, 0, 7);
g.fill();
const w = 0.55 + 0.45 * Math.sin(t * 55);
g.fillStyle = "rgba(246,240,214,0.6)";
g.beginPath();
g.ellipse(0.01, -0.02 * w, 0.048, 0.011, -0.25, 0, 7);
g.ellipse(0.01, 0.016 * w, 0.048, 0.011, 0.25, 0, 7);
g.ellipse(-0.015, -0.017 * w, 0.042, 0.009, -0.35, 0, 7);
g.ellipse(-0.015, 0.014 * w, 0.042, 0.009, 0.35, 0, 7);
g.fill();
g.restore();
