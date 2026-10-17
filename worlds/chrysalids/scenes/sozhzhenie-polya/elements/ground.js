// The land (a plane seen from above: x across, y toward us; its middle 400 m off): the even field left of the track,
// the offending field right of it (up to 30 m deep), the track toward the village, the trampled ground where the
// congregation stands. Painted once in daylight colours; the night, the dawn, the fire's light are the scene's; the ash
// is the element ash over it.
const Y = d => 400 - d;
g.fillStyle = '#5a5246';
g.fillRect(-800, -400, 1600, 800);
g.fillStyle = '#6a604a';
g.fillRect(-800, Y(790), 797, Y(9.6) - Y(790));
g.fillRect(-2.9, Y(790), 803, Y(30) - Y(790));
g.fillStyle = '#66583e';
g.fillRect(-2.9, Y(30), 33, Y(9.4) - Y(30));
g.fillStyle = '#7e746a';
g.fillRect(-3.9, Y(790), 1.0, 780);
g.fillStyle = '#6a625a';
g.fillRect(-4.6, Y(9.6), 2.0, Y(-1) - Y(9.6));
const tr = g.createRadialGradient(0, Y(6), 0, 0, Y(6), 7);
tr.addColorStop(0, 'rgba(96,86,76,0.7)');
tr.addColorStop(1, 'rgba(96,86,76,0)');
g.fillStyle = tr;
g.fillRect(-8, Y(14), 16, 16);
