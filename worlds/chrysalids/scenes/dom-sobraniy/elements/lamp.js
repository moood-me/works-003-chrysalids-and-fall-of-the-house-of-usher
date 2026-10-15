// the oil lamp on the elders' table — the one light of the hall; lamp: 0 blown out … 1 burning;
// spill: knocked off the table (it tips and falls behind the table's front; the fire takes over)
const lib = e.lib,
  S = e.state,
  t = e.t;
const sp = lib.N(S.spill);
const L = lib.N(S.lamp) * (1 - lib.sm(sp / 0.15));
const fall = lib.sm(sp / 0.3);
const f = 1 + 0.06 * Math.sin(t * 9.1) + 0.04 * Math.sin(t * 13.7 + 1) + 0.03 * Math.sin(t * 3.3);
g.save();
g.translate(-0.3 * fall, 0.85 * fall * fall);
g.rotate(-1.7 * fall);
if (L > 0.01) {
  const gr = g.createRadialGradient(0, -0.25, 0.01, 0, -0.25, 0.5);
  gr.addColorStop(0, "rgba(255,200,130," + 0.4 * L * f + ")");
  gr.addColorStop(1, "rgba(255,200,130,0)");
  g.fillStyle = gr;
  g.fillRect(-0.5, -0.75, 1, 1);
}
g.fillStyle = "#241d1a";
g.beginPath();
g.ellipse(0, -0.012, 0.075, 0.018, 0, 0, 7);
g.fill();
g.fillRect(-0.014, -0.1, 0.028, 0.09);
g.fillStyle = "rgba(140,98,52," + (0.5 + 0.35 * L) + ")";
g.beginPath();
g.ellipse(0, -0.13, 0.068, 0.045, 0, 0, 7);
g.fill();
g.fillStyle = "#241d1a";
g.fillRect(-0.03, -0.19, 0.06, 0.028);
g.beginPath();
g.moveTo(-0.024, -0.19);
g.bezierCurveTo(-0.05, -0.23, -0.05, -0.29, -0.02, -0.33);
g.lineTo(-0.02, -0.42);
g.lineTo(0.02, -0.42);
g.lineTo(0.02, -0.33);
g.bezierCurveTo(0.05, -0.29, 0.05, -0.23, 0.024, -0.19);
g.closePath();
g.fillStyle = "rgba(255,210,150," + (0.05 + 0.12 * L) + ")";
g.fill();
g.strokeStyle = "rgba(255,225,185," + (0.1 + 0.3 * L) + ")";
g.lineWidth = 0.005;
g.stroke();
if (L > 0.02) {
  const h = 0.07 * f * Math.sqrt(L);
  const fg = g.createRadialGradient(0, -0.235, 0, 0, -0.235, h);
  fg.addColorStop(0, "#fff6e0");
  fg.addColorStop(0.5, "#ffcf7a");
  fg.addColorStop(1, "rgba(255,150,60,0.2)");
  g.fillStyle = fg;
  g.beginPath();
  g.moveTo(0.002 * Math.sin(t * 5), -0.225 - h);
  g.quadraticCurveTo(0.022, -0.232, 0, -0.212);
  g.quadraticCurveTo(-0.022, -0.232, 0.002 * Math.sin(t * 5), -0.225 - h);
  g.fill();
  e.light(0, -0.25, 1.4, "#ffb366", 0.55 * L);
} else if (sp < 0.01) {
  // blown out: a thread of smoke
  g.strokeStyle = "rgba(180,170,160,0.15)";
  g.lineWidth = 0.006;
  g.beginPath();
  g.moveTo(0, -0.42);
  g.bezierCurveTo(0.03 * Math.sin(t * 0.7), -0.5, -0.03, -0.56, 0.02 * Math.sin(t * 0.5), -0.62);
  g.stroke();
}
g.restore();
e.at(0, -0.5);
