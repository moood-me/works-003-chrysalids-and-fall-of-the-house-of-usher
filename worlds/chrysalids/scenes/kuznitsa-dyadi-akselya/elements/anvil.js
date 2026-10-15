const S = e.state || {};
const f = S.fire ?? 0.7;
const t = e.t;
const fl = 0.85 + 0.1 * Math.sin(t * 2.3) + 0.05 * Math.sin(t * 5.1 + 1);
const F = f * fl;
g.fillStyle = "#17110d";
g.beginPath();
g.moveTo(-0.26, 0.03);
g.lineTo(-0.24, -0.46);
g.quadraticCurveTo(0, -0.5, 0.24, -0.46);
g.lineTo(0.27, 0.03);
g.closePath();
g.fill();
g.fillStyle = "#0e0c0b";
g.beginPath();
g.moveTo(-0.22, -0.46);
g.lineTo(-0.16, -0.6);
g.lineTo(-0.1, -0.66);
g.quadraticCurveTo(-0.3, -0.68, -0.42, -0.76);
g.quadraticCurveTo(-0.6, -0.8, -0.66, -0.82);
g.lineTo(-0.36, -0.86);
g.lineTo(0.34, -0.86);
g.lineTo(0.36, -0.74);
g.lineTo(0.2, -0.7);
g.lineTo(0.12, -0.66);
g.lineTo(0.18, -0.6);
g.lineTo(0.24, -0.46);
g.closePath();
g.fill();
let lg = g.createLinearGradient(-0.66, 0, 0.36, 0);
lg.addColorStop(0, "rgba(230,130,64," + 0.75 * F + ")");
lg.addColorStop(1, "rgba(150,70,34," + 0.25 * F + ")");
g.fillStyle = lg;
g.beginPath();
g.moveTo(-0.66, -0.82);
g.lineTo(-0.36, -0.86);
g.lineTo(0.34, -0.86);
g.lineTo(0.34, -0.835);
g.lineTo(-0.36, -0.835);
g.closePath();
g.fill();
const hs = 0.55 + 0.15 * Math.sin(t * 0.5);
g.strokeStyle = "rgba(214,96,40," + hs * (0.4 + 0.6 * f) + ")";
g.lineWidth = 0.025;
g.beginPath();
g.ellipse(0.05, -0.875, 0.09, 0.03, 0, Math.PI * 0.2, Math.PI * 1.8, false);
g.stroke();
e.light(0.05, -0.88, 0.6, "#d86a30", 0.35 * hs * f);
g.strokeStyle = "#0e0b09";
g.lineWidth = 0.025;
g.beginPath();
g.moveTo(0.3, 0.02);
g.lineTo(0.42, -0.62);
g.moveTo(0.36, 0.02);
g.lineTo(0.43, -0.62);
g.stroke();
// the smith's tools lying on the anvil while they are not in his hands (axel_with): the hammer, the tongs with the iron
const held = Array.isArray(S.axel_with) ? S.axel_with : [];
g.fillStyle = "#0c0a09";
g.strokeStyle = "#0c0a09";
if (!held.includes("hammer")) {
  g.lineWidth = 0.03;
  g.beginPath();
  g.moveTo(-0.05, -0.885);
  g.lineTo(0.3, -0.9);
  g.stroke();
  g.fillRect(-0.13, -0.96, 0.08, 0.08);
}
if (!held.includes("tongs")) {
  g.lineWidth = 0.02;
  g.beginPath();
  g.moveTo(0.02, -0.87);
  g.lineTo(0.45, -0.95);
  g.moveTo(0.02, -0.875);
  g.lineTo(0.46, -0.92);
  g.stroke();
}
// sparks where the hammer meets the iron (ax_spark: 1 at the blow, going to 0)
const sp = S.ax_spark ?? 0;
if (sp > 0.01) {
  const x = 0.06, y = -0.9;
  g.save();
  g.globalCompositeOperation = "lighter";
  for (let i = 0; i < 16; i++) {
    const an = -Math.PI / 2 + (e.anim.hash(i, 3) - 0.5) * 2.8,
      v = 0.25 + e.anim.hash(i, 7) * 0.6,
      r = (1 - sp) * v;
    g.fillStyle = "rgba(255,200,120," + (sp * 0.95).toFixed(3) + ")";
    g.beginPath();
    g.arc(x + Math.cos(an) * r, y + Math.sin(an) * r * 0.8 + (1 - sp) * (1 - sp) * 0.35, 0.016, 0, 7);
    g.fill();
  }
  g.restore();
  e.light(x, y, 1.3, "#ffb060", 0.7 * sp);
}
