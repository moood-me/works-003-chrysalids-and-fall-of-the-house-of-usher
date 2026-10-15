function mix(a, b, t) {
  t = Math.max(0, Math.min(1, t));
  const p = parseInt(a.slice(1), 16),
    q = parseInt(b.slice(1), 16);
  return (
    "rgb(" +
    ((((p >> 16) & 255) * (1 - t) + ((q >> 16) & 255) * t) | 0) +
    "," +
    ((((p >> 8) & 255) * (1 - t) + ((q >> 8) & 255) * t) | 0) +
    "," +
    (((p & 255) * (1 - t) + (q & 255) * t) | 0) +
    ")"
  );
}
const ev = 1 - (e.state.sun ?? 1);

const f = (x) => -(30 + 13 * Math.sin(x / 210 + 0.7) + 6 * Math.sin(x / 83 + 2.1) + 2.5 * Math.sin(x / 31));
g.beginPath();
g.moveTo(-2600, 10);
for (let x = -2600; x <= 2600; x += 20) g.lineTo(x, f(x));
g.lineTo(2600, 10);
g.closePath();
let gr = g.createLinearGradient(0, -50, 0, 5);
gr.addColorStop(0, mix("#a3abae", "#a898a0", ev));
gr.addColorStop(1, mix("#b9bcae", "#c2a898", ev));
g.fillStyle = gr;
g.fill();
