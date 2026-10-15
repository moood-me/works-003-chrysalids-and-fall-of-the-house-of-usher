// The path through the last field to the gap in the fence and on into the Fringes (a plane over the field, seen from above:
// x across, y toward us; its middle 11 m off), trodden pale. Its points (the game's «По тени»): where it goes into each of
// the trees' shadows and out of it (shade1_in, shade1_out, …: lib.POOLS, worked out from the trees and the moon), its
// start and its end
const { PATH, POOLS, START_D, END_D } = e.lib, Y0 = 11, Y = d => Y0 - d;
g.strokeStyle = '#a49c7c';
g.lineCap = 'round';
g.lineWidth = 0.7;
g.beginPath();
for (let d = START_D - 1; d <= END_D + 4; d += 0.25) { const x = PATH(d); d === START_D - 1 ? g.moveTo(x, Y(d)) : g.lineTo(x, Y(d)); }
g.stroke();
g.strokeStyle = 'rgba(120,112,88,0.5)';
g.lineWidth = 0.08;
for (const off of [-0.18, 0.18]) {
  g.beginPath();
  for (let d = START_D - 1; d <= END_D + 4; d += 0.25) { const x = PATH(d) + off; d === START_D - 1 ? g.moveTo(x, Y(d)) : g.lineTo(x, Y(d)); }
  g.stroke();
}
POOLS.forEach(([d0, d1], i) => {
  e.at(PATH(d0), Y(d0), `shade${i + 1}_in`);
  e.at(PATH(d1), Y(d1), `shade${i + 1}_out`);
});
e.at(PATH(START_D), Y(START_D), 'start');
e.at(PATH(END_D), Y(END_D), 'end');
