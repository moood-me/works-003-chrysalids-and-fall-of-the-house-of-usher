// the dark wood ahead on the right (48 m), where the road goes: a ragged line of crowns, a layer swaying a little
g.fillStyle = '#3c4c40';
g.beginPath();
g.moveTo(10, 1);
for (let x = 10; x <= 260; x += 0.6) g.lineTo(x, -(9 + 5 * Math.sin(x * 0.11) + 3 * Math.sin(x * 0.37 + 1) + 2 * e.rnd()) * Math.min(1, (x - 10) / 12));
g.lineTo(260, 1);
g.closePath();
g.fill();
