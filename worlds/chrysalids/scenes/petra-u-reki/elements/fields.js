// the fields beyond the river (a plane seen from above): broad strips of stubble and green running away
g.fillStyle = '#8a8a6a';
g.fillRect(-1500, -270, 3000, 540);
for (let y = -270; y < 270; y += 14) {
  g.fillStyle = e.rnd() < 0.5 ? '#7c8264' : '#9a9472';
  g.fillRect(-1500, y, 3000, 7 + e.rnd() * 5);
}
