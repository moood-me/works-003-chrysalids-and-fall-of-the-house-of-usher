// Madeline at sixteen, in oils, in a dark gilt frame on the wall: light, alive — the one warm thing in the room. Painted
// as an old portrait: a dark umber ground, warm light from the left on her face (the painter's light, in the paint),
// ash-blond hair loose on her shoulders, a pale dress, a posy of small flowers at the neckline. Painted once; how the
// candles light it is the scene's.
const { mix } = e.anim;
const lit = 1;
const c = (r, gg, b, a = 1) =>
  "rgba(" + Math.round(r * lit) + "," + Math.round(gg * lit) + "," + Math.round(b * lit) + "," + a + ")";
const soft = (x, y, r, inner, outer = null) => {
  const gr = g.createRadialGradient(x, y, 0, x, y, r);
  gr.addColorStop(0, inner);
  gr.addColorStop(1, outer || inner.replace(/[\d.]+\)$/, "0)"));
  g.fillStyle = gr;
  g.fillRect(x - r, y - r, 2 * r, 2 * r);
};
// the frame
const W = 0.66,
  H = 1.72,
  F = 0.12;
let gr = g.createLinearGradient(-W, -H, W, 0);
gr.addColorStop(0, "#6a5230");
gr.addColorStop(0.35, "#3e2e1c");
gr.addColorStop(0.7, "#544024");
gr.addColorStop(1, "#2a1e12");
g.fillStyle = gr;
g.fillRect(-W, -H, 2 * W, H);
g.strokeStyle = c(190, 140, 80, 0.35);
g.lineWidth = 0.012;
g.strokeRect(-W + 0.03, -H + 0.03, 2 * W - 0.06, H - 0.06);
g.strokeStyle = c(150, 110, 60, 0.3);
g.strokeRect(-W + F - 0.02, -H + F - 0.02, 2 * (W - F) + 0.04, H - 2 * F + 0.04);
// the canvas
const x0 = -W + F,
  x1 = W - F,
  y0 = -H + F,
  y1 = -F;
g.save();
g.beginPath();
g.rect(x0, y0, x1 - x0, y1 - y0);
g.clip();
gr = g.createLinearGradient(x0, y0, x1, y1);
gr.addColorStop(0, c(70, 50, 32));
gr.addColorStop(0.6, c(36, 26, 18));
gr.addColorStop(1, c(22, 16, 12));
g.fillStyle = gr;
g.fillRect(x0, y0, x1 - x0, y1 - y0);
// a warm glow behind her, as painters set a figure against the dark
soft(-0.1, -1.12, 0.62, c(196, 132, 70, 0.45));
// brushwork: faint dabs over the ground
for (let i = 0; i < 40; i++) {
  const bx = mix(x0, x1, e.rnd()),
    by = mix(y0, y1, e.rnd());
  soft(bx, by, 0.04 + 0.08 * e.rnd(), e.rnd() < 0.5 ? c(120, 84, 50, 0.12) : "rgba(0,0,0,0.12)");
}
const skin = (a = 1) => c(232, 194, 164, a);
const shade = (a = 1) => c(150, 104, 86, a);
const lightToShade = (xa, xb, from, to) => {
  const gg = g.createLinearGradient(xa, 0, xb, 0);
  gg.addColorStop(0, from);
  gg.addColorStop(1, to);
  return gg;
};
// hair behind her shoulders, long and loose
const back = new Path2D();
back.moveTo(0.0, -1.27);
back.bezierCurveTo(-0.19, -1.27, -0.2, -1.02, -0.21, -0.88);
back.bezierCurveTo(-0.22, -0.74, -0.27, -0.62, -0.25, -0.5);
back.lineTo(0.27, -0.5);
back.bezierCurveTo(0.28, -0.64, 0.21, -0.78, 0.2, -0.95);
back.bezierCurveTo(0.19, -1.2, 0.13, -1.27, 0.0, -1.27);
back.closePath();
g.fillStyle = lightToShade(-0.22, 0.25, c(176, 146, 100), c(80, 62, 44));
g.fill(back);
// the dress: sloping shoulders, a soft scooped neckline, the light on her left
const dress = new Path2D();
dress.moveTo(-0.07, -0.9);
dress.bezierCurveTo(-0.15, -0.86, -0.25, -0.84, -0.28, -0.76);
dress.bezierCurveTo(-0.33, -0.62, -0.36, -0.4, -0.4, y1 + 0.02);
dress.lineTo(0.42, y1 + 0.02);
dress.bezierCurveTo(0.38, -0.4, 0.35, -0.62, 0.3, -0.76);
dress.bezierCurveTo(0.27, -0.84, 0.16, -0.86, 0.08, -0.9);
dress.closePath();
g.fillStyle = lightToShade(-0.36, 0.4, c(214, 192, 158), c(70, 58, 48));
g.fill(dress);
g.save();
g.clip(dress);
for (const [x, a] of [
  [-0.24, 0.1],
  [-0.06, 0.07],
  [0.14, 0.1],
  [0.3, 0.14],
]) {
  const fg = g.createLinearGradient(x - 0.05, 0, x + 0.05, 0);
  fg.addColorStop(0, "rgba(50,40,34,0)");
  fg.addColorStop(0.5, "rgba(50,40,34," + a + ")");
  fg.addColorStop(1, "rgba(50,40,34,0)");
  g.fillStyle = fg;
  g.fillRect(x - 0.05, -0.62, 0.1, 0.6);
}
// the skin of the neck and the neckline, the chin's shadow on the throat
const bare = new Path2D();
bare.moveTo(-0.05, -1.02);
bare.lineTo(-0.055, -0.89);
bare.bezierCurveTo(-0.12, -0.86, -0.18, -0.84, -0.2, -0.8);
bare.quadraticCurveTo(0.01, -0.71, 0.21, -0.8);
bare.bezierCurveTo(0.18, -0.84, 0.12, -0.86, 0.065, -0.89);
bare.lineTo(0.06, -1.02);
bare.closePath();
g.restore();
g.fillStyle = lightToShade(-0.2, 0.21, skin(), shade());
g.fill(bare);
g.save();
g.clip(bare);
const throat = g.createLinearGradient(0, -1.0, 0, -0.9);
throat.addColorStop(0, c(90, 58, 48, 0.6));
throat.addColorStop(1, c(90, 58, 48, 0));
g.fillStyle = throat;
g.fillRect(-0.1, -1.02, 0.2, 0.14);
g.restore();
// a posy of small pale-blue flowers at the neckline
for (let i = 0; i < 16; i++) {
  const fx = -0.19 + e.rnd() * 0.09,
    fy = -0.77 + e.rnd() * 0.07;
  g.fillStyle = e.rnd() < 0.25 ? c(120, 140, 90, 0.9) : c(150 + 40 * e.rnd(), 172, 210, 0.9);
  g.beginPath();
  g.arc(fx, fy, 0.008 + 0.005 * e.rnd(), 0, 7);
  g.fill();
}
// the face, turned a little toward the light
g.save();
g.translate(0.01, -1.09);
g.rotate(-0.06);
const face = new Path2D();
face.moveTo(0, -0.125);
face.bezierCurveTo(0.075, -0.125, 0.09, -0.06, 0.086, 0.0);
face.bezierCurveTo(0.082, 0.06, 0.048, 0.108, 0.0, 0.12);
face.bezierCurveTo(-0.05, 0.108, -0.082, 0.06, -0.086, 0.0);
face.bezierCurveTo(-0.09, -0.06, -0.075, -0.125, 0, -0.125);
face.closePath();
g.fillStyle = lightToShade(-0.09, 0.09, skin(), c(186, 140, 118));
g.fill(face);
g.save();
g.clip(face);
// the shadow side, cheeks warm, the eye sockets soft
soft(0.1, 0.01, 0.09, c(110, 70, 58, 0.45));
soft(-0.045, 0.035, 0.038, c(226, 140, 128, 0.4));
soft(0.048, 0.035, 0.032, c(206, 124, 112, 0.3));
for (const [ex, k] of [
  [-0.035, 1],
  [0.038, 0.88],
]) {
  soft(ex, -0.014, 0.026, c(140, 96, 84, 0.35));
  g.fillStyle = c(214, 206, 196, 0.9);
  g.beginPath();
  g.ellipse(ex, -0.01, 0.016 * k, 0.0075, 0, 0, 7);
  g.fill();
  g.fillStyle = c(104, 114, 118, 0.95);
  g.beginPath();
  g.arc(ex + 0.002, -0.0095, 0.0062, 0, 7);
  g.fill();
  g.fillStyle = c(40, 40, 44, 0.9);
  g.beginPath();
  g.arc(ex + 0.002, -0.0095, 0.0026, 0, 7);
  g.fill();
  g.fillStyle = c(250, 240, 225, 0.85);
  g.beginPath();
  g.arc(ex - 0.001, -0.012, 0.0018, 0, 7);
  g.fill();
  g.strokeStyle = c(64, 46, 40, 0.75);
  g.lineWidth = 0.0035;
  g.beginPath();
  g.ellipse(ex, -0.006, 0.018 * k, 0.011, 0, Math.PI * 1.08, Math.PI * 1.92);
  g.stroke();
  g.strokeStyle = c(140, 110, 84, 0.45);
  g.lineWidth = 0.004;
  g.beginPath();
  g.moveTo(ex - 0.02 * k, -0.034);
  g.quadraticCurveTo(ex, -0.041, ex + 0.02 * k, -0.035);
  g.stroke();
}
g.strokeStyle = c(150, 106, 92, 0.4);
g.lineWidth = 0.005;
g.beginPath();
g.moveTo(0.009, -0.005);
g.quadraticCurveTo(0.015, 0.03, 0.007, 0.045);
g.stroke();
soft(0.006, 0.047, 0.012, c(140, 92, 82, 0.35));
// lips: soft rose, the corners lifted a little
g.fillStyle = c(190, 108, 102, 0.85);
g.beginPath();
g.moveTo(-0.021, 0.071);
g.quadraticCurveTo(0.0, 0.065, 0.021, 0.07);
g.quadraticCurveTo(0.0, 0.087, -0.021, 0.071);
g.fill();
g.strokeStyle = c(110, 64, 60, 0.55);
g.lineWidth = 0.0025;
g.beginPath();
g.moveTo(-0.023, 0.068);
g.quadraticCurveTo(0.0, 0.075, 0.023, 0.067);
g.stroke();
g.restore();
g.restore();
// hair in front: parted, framing the face, one long strand over her left shoulder
const hair = new Path2D();
hair.moveTo(0.005, -1.245);
hair.bezierCurveTo(-0.085, -1.25, -0.115, -1.17, -0.105, -1.07);
hair.bezierCurveTo(-0.1, -0.97, -0.13, -0.86, -0.2, -0.7);
hair.bezierCurveTo(-0.15, -0.74, -0.1, -0.86, -0.082, -0.98);
hair.bezierCurveTo(-0.075, -1.08, -0.06, -1.16, 0.005, -1.2);
hair.bezierCurveTo(0.065, -1.17, 0.085, -1.1, 0.09, -1.02);
hair.bezierCurveTo(0.1, -0.96, 0.11, -0.92, 0.13, -0.88);
hair.bezierCurveTo(0.12, -0.96, 0.125, -1.08, 0.12, -1.13);
hair.bezierCurveTo(0.11, -1.22, 0.07, -1.25, 0.005, -1.245);
hair.closePath();
g.fillStyle = lightToShade(-0.12, 0.13, c(212, 182, 132), c(110, 86, 60));
g.fill(hair);
g.strokeStyle = c(236, 206, 150, 0.28);
g.lineWidth = 0.003;
for (let i = 0; i < 7; i++) {
  const k = i / 6;
  g.beginPath();
  g.moveTo(mix(-0.07, 0.0, k), -1.23);
  g.quadraticCurveTo(mix(-0.12, -0.06, k), -1.1, mix(-0.19, -0.1, k), -0.74 - 0.14 * k);
  g.stroke();
}
// varnish: the old painting's sheen and darkened corners
gr = g.createRadialGradient(-0.05, -0.95, 0.2, -0.05, -0.85, 0.85);
gr.addColorStop(0, "rgba(0,0,0,0)");
gr.addColorStop(1, "rgba(10,6,4,0.55)");
g.fillStyle = gr;
g.fillRect(x0, y0, x1 - x0, y1 - y0);
g.restore();
g.fillStyle = "rgba(0,0,0,0.5)";
g.fillRect(x0, y0, x1 - x0, 0.02);
g.fillRect(x1 - 0.02, y0, 0.02, y1 - y0);
e.at(0.01, -1.09, "face");
