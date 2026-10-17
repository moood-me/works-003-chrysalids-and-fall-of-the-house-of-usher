// The hay cart on the road (its load of hay, its wheels, the horse in the shafts), the boy perched on top of the load
g.fillStyle = '#c8b070';
g.beginPath(); g.moveTo(-2.6, -1.2); g.quadraticCurveTo(-2.6, -2.4, -1.2, -2.5); g.lineTo(1.6, -2.5); g.quadraticCurveTo(2.7, -2.4, 2.6, -1.2); g.closePath(); g.fill();
g.strokeStyle = 'rgba(150,126,70,0.6)'; g.lineWidth = 0.05;
for (let i = 0; i < 9; i++) { const x = -2.3 + i * 0.55; g.beginPath(); g.moveTo(x, -1.25); g.quadraticCurveTo(x + 0.1, -1.9, x + 0.05, -2.45); g.stroke(); }
g.fillStyle = '#6a5040'; g.fillRect(-2.6, -1.25, 5.2, 0.3);
g.strokeStyle = '#5a4434'; g.lineWidth = 0.12;
for (const x of [-1.7, 1.7]) { g.beginPath(); g.arc(x, -0.55, 0.55, 0, 7); g.stroke(); }
g.strokeStyle = '#6a5040'; g.lineWidth = 0.08;
g.beginPath(); g.moveTo(-2.6, -1.0); g.lineTo(-4.0, -1.1); g.stroke();
g.fillStyle = '#6a5038';
g.beginPath(); g.ellipse(-4.6, -1.35, 0.85, 0.45, 0, 0, 7); g.fill();
g.fillRect(-5.2, -1.3, 0.13, 1.32); g.fillRect(-4.1, -1.3, 0.13, 1.32);
g.beginPath(); g.ellipse(-5.5, -1.85, 0.25, 0.42, 0.5, 0, 7); g.fill();
e.at(0, -2.5, 'seat');
