// the dark wood ahead on the right (48 m), where the road goes: a ragged line of crowns a few metres high, its foot well
// down under the land falling away there (no edge of it seen over the land)
g.fillStyle = '#435064';
g.beginPath();
g.moveTo(10, 30);
for (let x = 10; x <= 260; x += 0.6) g.lineTo(x, -(5 + 1.6 * Math.sin(x * 0.11) + 1 * Math.sin(x * 0.37 + 1) + 0.6 * Math.abs(Math.sin(x * 1.7)) + 0.8 * e.rnd()) * Math.min(1, (x - 10) / 12));
g.lineTo(260, 30);
g.closePath();
g.fill();
