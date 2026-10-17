// The workbench under the hanging tools: its top, legs, stretcher; a vice, a bowl of nails, a box
g.fillStyle = '#6e5440';
g.beginPath();
g.moveTo(-1.12, -0.9); g.lineTo(1.05, -0.92); g.lineTo(1.06, -0.8); g.lineTo(-1.1, -0.79);
g.closePath();
g.fill();
g.fillStyle = '#5a4430';
for (const x of [-1.0, 0.92]) {
  g.beginPath();
  g.moveTo(x - 0.05, -0.8); g.lineTo(x - 0.06, 0.03); g.lineTo(x + 0.06, 0.03); g.lineTo(x + 0.05, -0.8);
  g.fill();
}
g.beginPath();
g.moveTo(-1.0, -0.28); g.lineTo(0.92, -0.3); g.lineTo(0.92, -0.24); g.lineTo(-1.0, -0.22);
g.fill();
g.fillStyle = '#4a4a4c';
g.fillRect(-1.05, -1.05, 0.16, 0.16);
g.fillRect(-1.2, -0.98, 0.3, 0.03);
g.fillStyle = '#6a6056';
g.beginPath();
g.ellipse(-0.35, -0.97, 0.16, 0.07, 0, 0, 7);
g.fill();
g.fillStyle = '#7a5a40';
g.fillRect(0.25, -1.08, 0.3, 0.17);
