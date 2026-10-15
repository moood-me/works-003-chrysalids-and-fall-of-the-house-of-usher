// The barrel David sits on: staves, two iron hoops
g.fillStyle = '#7a5838';
g.beginPath();
g.moveTo(-0.22, 0.02);
g.bezierCurveTo(-0.3, -0.25, -0.3, -0.45, -0.22, -0.7);
g.lineTo(0.22, -0.7);
g.bezierCurveTo(0.3, -0.45, 0.3, -0.25, 0.22, 0.02);
g.closePath();
g.fill();
g.strokeStyle = '#3e3a36';
g.lineWidth = 0.025;
for (const y of [-0.12, -0.58]) {
  g.beginPath(); g.moveTo(-0.26, y); g.quadraticCurveTo(0, y + 0.03, 0.26, y); g.stroke();
}
g.strokeStyle = 'rgba(40,26,16,0.45)';
g.lineWidth = 0.008;
for (const x of [-0.12, 0.02, 0.15]) {
  g.beginPath(); g.moveTo(x, 0); g.quadraticCurveTo(x * 1.25, -0.35, x, -0.7); g.stroke();
}
