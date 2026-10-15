// The near shore under the eye: dark wet earth to the water's edge (a wavy line about 5.6 m off), a pale line where the
// water touches it. A plane, seen from above: x across, y toward the eye (its middle 4.5 m off: y = 4.5 − the distance).
const L = e.lib;
const edge = (x) => -1.1 + 0.5 * Math.sin(x * 0.35 + 1) + 0.25 * Math.sin(x * 1.1);
const gg = g.createLinearGradient(0, -1.6, 0, 2.5);
gg.addColorStop(0, L.paint("#30383c"));
gg.addColorStop(1, L.paint("#1d2427"));
g.fillStyle = gg;
g.beginPath();
g.moveTo(-70, 2.5);
for (let x = -70; x <= 70; x += 0.5) g.lineTo(x, edge(x));
g.lineTo(70, 2.5);
g.closePath(); g.fill();
g.strokeStyle = "rgba(110,122,130,0.18)"; g.lineWidth = 0.08;
g.beginPath();
for (let x = -70; x <= 70; x += 0.5) x == -70 ? g.moveTo(x, edge(x) - 0.03) : g.lineTo(x, edge(x) - 0.03);
g.stroke();
