// The cart David stands by (no horse: its shafts down on the ground), his hand on its side (`side`)
g.fillStyle = '#7a5a42';
g.fillRect(-1.6, -1.15, 3.2, 0.5);
g.fillStyle = '#8a6a50';
g.fillRect(-1.6, -1.2, 3.2, 0.08);
g.strokeStyle = 'rgba(50,36,26,0.5)'; g.lineWidth = 0.02;
for (let x = -1.5; x < 1.6; x += 0.4) { g.beginPath(); g.moveTo(x, -1.15); g.lineTo(x, -0.65); g.stroke(); }
g.strokeStyle = '#5a4434'; g.lineWidth = 0.08;
for (const x of [-1.0, 1.0]) { g.beginPath(); g.arc(x, -0.45, 0.45, 0, 7); g.stroke(); g.beginPath(); for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; g.moveTo(x, -0.45); g.lineTo(x + 0.45 * Math.cos(a), -0.45 + 0.45 * Math.sin(a)); } g.lineWidth = 0.03; g.stroke(); g.lineWidth = 0.08; }
g.strokeStyle = '#6a5040'; g.lineWidth = 0.07;
g.beginPath(); g.moveTo(1.6, -0.9); g.lineTo(3.2, 0); g.moveTo(1.6, -0.75); g.lineTo(3.3, 0.05); g.stroke();
e.at(1.4, -1.15, 'side');
