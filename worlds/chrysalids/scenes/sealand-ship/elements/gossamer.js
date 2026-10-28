// a thread of the falling web (the particles' sprite): a short curved strand and its bead
g.strokeStyle = 'rgba(244,236,242,0.8)';
g.lineWidth = 0.04;
g.lineCap = 'round';
g.beginPath();
g.moveTo(0, -0.45);
g.bezierCurveTo(0.08, -0.25, -0.06, -0.1, 0, 0.3);
g.stroke();
g.fillStyle = 'rgba(255,248,238,1)';
g.beginPath();
g.arc(0, 0.3, 0.06, 0, 7);
g.fill();
