// The plough behind the ploughman's horse: its beam, the share in the furrow, the two handles (`handle_l`, `handle_r`:
// his hands on them)
g.strokeStyle = '#6a5440'; g.lineWidth = 0.09; g.lineCap = 'round';
g.beginPath(); g.moveTo(-1.6, -0.6); g.lineTo(0.6, -0.15); g.stroke();
g.beginPath(); g.moveTo(0.6, -0.15); g.lineTo(1.5, -0.95); g.moveTo(0.7, -0.1); g.lineTo(1.55, -0.85); g.stroke();
g.fillStyle = '#7a7470';
g.beginPath(); g.moveTo(0.3, 0); g.lineTo(0.9, 0.02); g.lineTo(0.7, -0.25); g.closePath(); g.fill();
g.strokeStyle = 'rgba(80,64,48,0.5)'; g.lineWidth = 0.05;
g.beginPath(); g.moveTo(-1.6, -0.6); g.lineTo(-2.6, -0.95); g.stroke();
e.at(1.5, -0.95, 'handle_l');
e.at(1.55, -0.85, 'handle_r');
