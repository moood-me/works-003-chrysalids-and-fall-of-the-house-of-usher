// the pen's fence behind the group (10 m): posts and three rails
g.strokeStyle = '#7a6650';
g.fillStyle = '#7a6650';
g.lineCap = 'round';
for (let x = -2.4; x <= 7.4; x += 1.4) { g.fillRect(x - 0.06, -1.4, 0.12, 1.45); }
g.lineWidth = 0.07;
for (const y of [-0.45, -0.9, -1.3]) { g.beginPath(); g.moveTo(-2.4, y); g.lineTo(7.4, y + 0.02); g.stroke(); }
