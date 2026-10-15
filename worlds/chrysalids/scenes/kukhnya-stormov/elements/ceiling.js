const L = e.state.lamp === true ? 1 : Math.max(0, Math.min(1, +e.state.lamp || 0));
g.fillStyle = "#0e0b0c";
g.fillRect(-8, -2.75, 16, 5.5);
const gr = g.createRadialGradient(0.55, -1.0, 0.1, 0.55, -1.0, 3.0);
gr.addColorStop(0, "rgba(190,130,75," + 0.08 * L + ")");
gr.addColorStop(1, "rgba(190,130,75,0)");
g.fillStyle = gr;
g.fillRect(-8, -2.75, 16, 5.5);
