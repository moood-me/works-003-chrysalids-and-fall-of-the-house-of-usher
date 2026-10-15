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
let gr = g.createLinearGradient(0, -85, 0, 85);
gr.addColorStop(0, mix("#c8c396", "#cdb08c", ev));
gr.addColorStop(0.5, mix("#aaad7a", "#ab9b72", ev));
gr.addColorStop(0.8, mix("#859060", "#857b58", ev));
gr.addColorStop(1, mix("#5f6b40", "#5f5a3e", ev));
g.fillStyle = gr;
g.fillRect(-300, -85, 600, 170);
let lp = g.createRadialGradient(-20, -80, 0, -20, -80, 150);
lp.addColorStop(0, "rgba(250,234,180,0.55)");
lp.addColorStop(1, "rgba(250,234,180,0)");
g.fillStyle = lp;
g.fillRect(-300, -85, 600, 170);
for (let i = 0; i < 120; i++) {
  const x = -300 + e.rnd() * 600,
    y = -85 + e.rnd() * 170,
    w = 3 + e.rnd() * 16,
    h = 0.6 + e.rnd() * 3;
  g.globalAlpha = 0.1 + e.rnd() * 0.12;
  g.fillStyle = e.rnd() < 0.45 ? "#c6c28c" : "#7c8857";
  g.beginPath();
  g.ellipse(x, y, w, h, 0, 0, 7);
  g.fill();
}
for (let i = 0; i < 9; i++) {
  const y = -70 + i * 16 + e.rnd() * 6,
    w = 200 + e.rnd() * 150,
    h = 3 + e.rnd() * 4,
    x = -120 + e.rnd() * 240;
  g.globalAlpha = 0.16;
  g.fillStyle = i % 2 ? "#cfc893" : "#6f7c4c";
  g.beginPath();
  g.ellipse(x, y, w, h, 0, 0, 7);
  g.fill();
}
let nb = g.createLinearGradient(0, 52, 0, 82);
nb.addColorStop(0, "rgba(70,84,48,0)");
nb.addColorStop(1, mix("#46552f", "#4a4430", ev));
g.globalAlpha = 0.75;
g.fillStyle = nb;
g.fillRect(-300, 52, 600, 33);
for (let i = 0; i < 26; i++) {
  const y = -40 + e.rnd() * 118,
    x = -60 + e.rnd() * 120,
    s = 1 + (y + 40) / 60;
  g.globalAlpha = 0.18 + e.rnd() * 0.12;
  g.fillStyle = e.rnd() < 0.6 ? "#66733f" : "#c3bd88";
  g.beginPath();
  g.ellipse(x, y, 2.5 * s + e.rnd() * 3 * s, 0.5 * s + e.rnd() * 0.5 * s, 0, 0, 7);
  g.fill();
}
g.globalAlpha = 0.13;
g.strokeStyle = mix("#bfb588", "#c8aa84", ev);
g.lineCap = "round";
g.beginPath();
g.moveTo(-40, -40);
g.bezierCurveTo(-20, 0, -30, 30, -14, 55);
g.bezierCurveTo(-8, 66, -6, 74, -5, 79);
g.lineWidth = 0.5;
g.stroke();
g.globalAlpha = 0.08;
g.lineWidth = 0.9;
g.stroke();
g.globalAlpha = 1;
