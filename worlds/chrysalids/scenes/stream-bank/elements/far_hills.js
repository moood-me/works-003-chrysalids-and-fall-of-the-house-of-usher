// the far hills, 900 m off (painted clear: the haze between is the engine's)
const f = x => -(30 + 13 * Math.sin(x / 210 + 0.7) + 6 * Math.sin(x / 83 + 2.1) + 2.5 * Math.sin(x / 31));
g.beginPath();
g.moveTo(-2600, 10);
for (let x = -2600; x <= 2600; x += 20) g.lineTo(x, f(x));
g.lineTo(2600, 10);
g.closePath();
const gr = g.createLinearGradient(0, -50, 0, 5);
gr.addColorStop(0, '#6d7a58');
gr.addColorStop(1, '#7e8961');
g.fillStyle = gr;
g.fill();
