// a stook — sheaves leaned together — standing in the stubble on the right: painted once, standing in many places (copies)
const h = 1.1, r = 0.55;
g.fillStyle = '#c8aa6a';
g.beginPath();
g.moveTo(-r, 0.05);
g.bezierCurveTo(-r * 1.02, -h * 0.55, -r * 0.75, -h * 0.92, -r * 0.1, -h);
g.quadraticCurveTo(r * 0.15, -h * 1.02, r * 0.3, -h * 0.95);
g.bezierCurveTo(r * 0.8, -h * 0.85, r * 1.02, -h * 0.5, r, 0.05);
g.closePath();
g.fill();
g.strokeStyle = 'rgba(140,112,64,0.6)';
g.lineWidth = 0.025;
g.beginPath();
for (const k of [-0.6, -0.25, 0.15, 0.5]) { g.moveTo(k * r, 0.02); g.quadraticCurveTo(k * r * 0.6, -h * 0.5, -0.05, -h * 0.97); }
g.stroke();
g.strokeStyle = '#8c7448';
g.lineWidth = 0.035;
g.beginPath(); g.moveTo(-r * 0.85, -h * 0.6); g.quadraticCurveTo(0, -h * 0.52, r * 0.85, -h * 0.6); g.stroke();
