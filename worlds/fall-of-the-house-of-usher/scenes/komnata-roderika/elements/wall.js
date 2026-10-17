// The back wall of the room and its vault, 10.5 m off: slate stone in courses, mottled, two heavy draperies, pilasters
// and vault ribs, the deep embrasures of the three lancet windows (their glass, lattice and leaves: window.js; the
// curtain: curtain.js; the fissure: fissure.js). Painted once, in its own colours: the candles' warmth on it, the
// windows' grey, the chair's shadow and the dark gathering in the vault are the scene's light.
let gr = g.createLinearGradient(0, -12, 0, 0);
gr.addColorStop(0, "#1c242a");
gr.addColorStop(0.3, "#2a343c");
gr.addColorStop(0.55, "#38444e");
gr.addColorStop(0.8, "#44505a");
gr.addColorStop(1, "#3c4750");
g.fillStyle = gr;
g.fillRect(-14, -12, 28, 12.3);
// the courses of stone
for (let r = 0; r < 22; r++) {
  const y = -0.42 * (r + 1);
  g.fillStyle = "rgba(0,0,0,0.12)";
  g.fillRect(-14, y, 28, 0.02);
  let x = -14 + e.rnd() * 0.8;
  while (x < 14) {
    g.fillRect(x, y, 0.02, 0.42);
    x += 0.75 + e.rnd() * 0.7;
  }
}
// mottling, damp and soot (down to the wall's foot)
for (let i = 0; i < 70; i++) {
  const x = -12 + e.rnd() * 24,
    y = -10 + e.rnd() * 10,
    r = 0.3 + e.rnd() * 1.3;
  const a = 0.03 + e.rnd() * 0.05;
  const c = e.rnd() < 0.55 ? "0,0,0" : "150,168,180";
  const gg = g.createRadialGradient(x, y, 0, x, y, r);
  gg.addColorStop(0, "rgba(" + c + "," + a + ")");
  gg.addColorStop(1, "rgba(" + c + ",0)");
  g.fillStyle = gg;
  g.fillRect(x - r, y - r, 2 * r, Math.min(2 * r, 0.3 - (y - r)));
}
// draperies
for (const s of [-1, 1]) {
  const x0 = s * 4.5,
    x1 = s * 6.4;
  const a = Math.min(x0, x1),
    b = Math.max(x0, x1);
  const D = new Path2D();
  D.moveTo(a, -9.5);
  D.lineTo(b, -9.5);
  D.lineTo(b + 0.05, 0);
  let k = 0;
  for (let x = b; x > a; x -= 0.32) {
    D.quadraticCurveTo(x - 0.08, 0.03 + 0.03 * (k++ % 2), x - 0.16, -0.01);
  }
  D.lineTo(a - 0.05, 0);
  D.closePath();
  g.fillStyle = "#20262c";
  g.fill(D);
  g.save();
  g.clip(D);
  for (let x = a; x < b; ) {
    const fw = 0.2 + e.rnd() * 0.35,
      hi = 0.03 + e.rnd() * 0.05;
    const f = g.createLinearGradient(x, 0, x + fw, 0);
    f.addColorStop(0, "rgba(0,0,0,0.14)");
    f.addColorStop(0.5, "rgba(120,140,152," + hi * 2 + ")");
    f.addColorStop(1, "rgba(0,0,0,0.12)");
    g.fillStyle = f;
    g.fillRect(x, -9.5, fw, 9.6);
    x += fw;
  }
  g.restore();
}
// pilasters and vault ribs
for (const s of [-1, 1]) {
  const px = s * 6.9;
  gr = g.createLinearGradient(px - 0.45, 0, px + 0.45, 0);
  gr.addColorStop(0, s > 0 ? "#3e4a54" : "#26303a");
  gr.addColorStop(0.5, "#36424c");
  gr.addColorStop(1, s > 0 ? "#26303a" : "#3e4a54");
  g.fillStyle = gr;
  g.fillRect(px - 0.45, -6.9, 0.9, 7.0);
  g.fillStyle = "#323e48";
  g.beginPath();
  g.moveTo(px - 0.6, -6.9);
  g.lineTo(px + 0.6, -6.9);
  g.lineTo(px + 0.5, -7.1);
  g.lineTo(px - 0.5, -7.1);
  g.closePath();
  g.fill();
  g.lineCap = "round";
  g.strokeStyle = "#2e3842";
  g.lineWidth = 0.32;
  g.beginPath();
  g.moveTo(px, -7.1);
  g.quadraticCurveTo(px * 0.9, -10.6, 0, -11.6);
  g.stroke();
  g.strokeStyle = "rgba(150,170,182,0.16)";
  g.lineWidth = 0.05;
  g.beginPath();
  g.moveTo(px - s * 0.14, -7.1);
  g.quadraticCurveTo(px * 0.88, -10.4, 0, -11.4);
  g.stroke();
  g.strokeStyle = "#28323a";
  g.lineWidth = 0.2;
  g.beginPath();
  g.moveTo(px - s * 0.35, -7.1);
  g.quadraticCurveTo(px * 0.45, -9.0, 0, -9.6);
  g.stroke();
}
// the embrasures of the lancet windows (x, sill, apex, half-width): deep stone round the glass, the sill's lit edge
const lancet = e.lib.lancet;
for (const [x, b, tp, w] of e.lib.WINDOWS) {
  const E = new Path2D();
  lancet(E, x, b + 0.08, tp - 0.16, w + 0.16);
  const eg = g.createLinearGradient(0, tp, 0, b);
  eg.addColorStop(0, "#1a2228");
  eg.addColorStop(1, "#2e3a42");
  g.fillStyle = eg;
  g.fill(E);
  // the sill
  g.fillStyle = "#56626c";
  g.beginPath();
  g.moveTo(x - w - 0.16, b + 0.08);
  g.lineTo(x + w + 0.16, b + 0.08);
  g.lineTo(x + w + 0.06, b);
  g.lineTo(x - w - 0.06, b);
  g.closePath();
  g.fill();
}
// the curtain's rod and its finials over the windows
const ROD = -7.05, OUT = 2.45;
g.fillStyle = "#1a1f23";
g.fillRect(-OUT - 0.1, ROD - 0.05, 2 * OUT + 0.2, 0.06);
for (const s of [-1, 1]) {
  g.beginPath();
  g.arc(s * (OUT + 0.14), ROD - 0.02, 0.06, 0, 7);
  g.fill();
}
g.fillStyle = "rgba(170,180,186,0.25)";
g.fillRect(-OUT - 0.1, ROD - 0.05, 2 * OUT + 0.2, 0.012);
// the foot of the wall, where the floor's damp rises
gr = g.createLinearGradient(0, -0.5, 0, 0);
gr.addColorStop(0, "rgba(10,14,18,0)");
gr.addColorStop(1, "rgba(10,14,18,0.45)");
g.fillStyle = gr;
g.fillRect(-14, -0.5, 28, 0.6);
