// The yard beyond the hall (30 m), seen through the windows and the door: the trodden ground, a dark line of trees, and
// the barn right of the door's line of sight (its point `roof`: the fire's particles there). Painted once in daylight
// colours; the night and the fire are the scene's light.
g.fillStyle = '#5c5446';
g.fillRect(-40, -2, 80, 2.3);
g.fillStyle = '#3c4a36';
g.beginPath();
g.moveTo(-40, -1.2);
for (let x = -40; x <= 40; x += 2) g.lineTo(x, -1.2 - 1.2 * Math.abs(Math.sin(x * 0.13)) - 0.6 * e.rnd());
g.lineTo(40, 0.3);
g.lineTo(-40, 0.3);
g.closePath();
g.fill();
const bx = 12;
g.fillStyle = '#6a4c3a';
g.beginPath();
g.moveTo(bx - 7, 0.3); g.lineTo(bx - 7, -4); g.lineTo(bx, -8); g.lineTo(bx + 7, -4); g.lineTo(bx + 7, 0.3);
g.closePath();
g.fill();
g.fillStyle = '#4e3a2e';
g.fillRect(bx - 2, -3.6, 4, 3.6);
e.at(bx, -5.5, 'roof');
