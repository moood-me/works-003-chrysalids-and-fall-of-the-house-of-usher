const dk = Math.max(0, Math.min(1, typeof e.state.dusk === "number" ? e.state.dusk : 0)),
  t = e.t;
const mix = (a, b) => Math.round(a + (b - a) * dk);
let gr = g.createLinearGradient(0, -0.35, 0, 0.6);
gr.addColorStop(0, "rgb(" + mix(26, 8) + "," + mix(34, 10) + "," + mix(54, 18) + ")");
gr.addColorStop(0.6, "rgb(" + mix(58, 16) + "," + mix(76, 20) + "," + mix(108, 34) + ")");
gr.addColorStop(1, "rgb(" + mix(112, 22) + "," + mix(110, 28) + "," + mix(128, 44) + ")");
g.fillStyle = gr;
g.fillRect(-0.3, -0.35, e.aspect + 0.6, 1.6);
g.fillStyle = "rgba(220,225,235," + dk * (0.55 + 0.25 * Math.sin(t * 1.3)) + ")";
for (let i = 0; i < 16; i++) {
  const x = e.rnd() * (e.aspect + 0.6) - 0.3,
    y = -0.3 + e.rnd() * 0.5;
  g.beginPath();
  g.arc(x, y, 0.0012 + e.rnd() * 0.001, 0, 7);
  g.fill();
}
g.fillStyle = "rgba(" + mix(70, 20) + "," + mix(66, 24) + "," + mix(80, 34) + ",0.6)";
for (let i = 0; i < 5; i++) {
  const x = e.rnd() * e.aspect,
    y = 0.05 + e.rnd() * 0.25,
    w = 0.2 + e.rnd() * 0.3;
  g.beginPath();
  g.ellipse(x + 0.01 * Math.sin(t * 0.05 + i), y, w, 0.012, 0, 0, 7);
  g.fill();
}
