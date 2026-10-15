// The path through the last field to the gap in the fence and on into the Fringes (a plane over the field, seen from above:
// x across, y toward us; its middle 11 m off), trodden pale, from the field's near edge (NEAR)
const { PATH, END_D } = e.lib, Y0 = 11, Y = d => Y0 - d, NEAR = 0.5;
g.strokeStyle = '#a49c7c';
g.lineCap = 'round';
g.lineWidth = 0.7;
g.beginPath();
for (let d = NEAR; d <= END_D + 4; d += 0.25) { const x = PATH(d); d === NEAR ? g.moveTo(x, Y(d)) : g.lineTo(x, Y(d)); }
g.stroke();
g.strokeStyle = 'rgba(120,112,88,0.5)';
g.lineWidth = 0.08;
for (const off of [-0.18, 0.18]) {
  g.beginPath();
  for (let d = NEAR; d <= END_D + 4; d += 0.25) { const x = PATH(d) + off; d === NEAR ? g.moveTo(x, Y(d)) : g.lineTo(x, Y(d)); }
  g.stroke();
}
