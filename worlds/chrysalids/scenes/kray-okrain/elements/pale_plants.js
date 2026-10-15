function tip(x, y, ph) {
  const b = 0.6 + 0.4 * Math.sin(e.t * 0.5 + ph);
  const r = 0.2;
  const tg = g.createRadialGradient(x, y, 0, x, y, r);
  tg.addColorStop(0, "rgba(208,230,182," + 0.95 * b + ")");
  tg.addColorStop(0.3, "rgba(200,224,178," + 0.4 * b + ")");
  tg.addColorStop(1, "rgba(200,224,178,0)");
  g.fillStyle = tg;
  g.beginPath();
  g.arc(x, y, r, 0, 7);
  g.fill();
  if (ph < 1.6) e.light(x, y, 0.8, "#bfdcb0", 0.3 * b);
}
const cl = [
  [-20, 3],
  [-15, 4],
  [-11.5, 2],
  [-7, 5],
  [-4.2, 2],
  [-0.4, 3],
  [4.8, 4],
  [7.8, 2],
  [11, 5],
  [15.5, 3],
  [20, 3],
];
let k = 0;
for (const c of cl) {
  for (let j = 0; j < c[1]; j++) {
    k++;
    const x = c[0] + (e.rnd() - 0.5) * 1.6;
    const kind = Math.floor(e.rnd() * 4);
    const h = 0.5 + e.rnd() * e.rnd() * 2.4;
    const ph = e.rnd() * 6.28;
    const lean = (e.rnd() - 0.5) * 0.8;
    const a = 0.06 * Math.sin(e.t * 0.33 + ph) + 0.03 * Math.sin(e.t * 0.71 + ph * 1.7);
    const tx = x + (lean + a) * h,
      ty = -h * (1 - Math.abs(lean) * 0.3);
    const lw = 0.025 + e.rnd() * 0.03;
    g.strokeStyle = "rgba(150,166,180,0.55)";
    g.lineWidth = lw;
    g.lineCap = "round";
    if (kind == 0) {
      const hx = tx + 0.35 * (lean >= 0 ? 1 : -1),
        hy = ty + 0.05;
      g.beginPath();
      g.moveTo(x, 0);
      g.quadraticCurveTo(x + lean * h * 0.3, -h * 1.05, hx, hy);
      g.stroke();
      g.fillStyle = "rgba(180,196,194,0.6)";
      g.beginPath();
      g.ellipse(hx, hy + 0.09, 0.06, 0.1, 0, 0, 7);
      g.fill();
      tip(hx, hy + 0.17, ph);
    } else if (kind == 1) {
      g.beginPath();
      g.moveTo(x, 0);
      g.quadraticCurveTo(x + lean * h * 0.2, -h * 0.6, tx, ty);
      g.stroke();
      g.beginPath();
      g.arc(tx + 0.08, ty, 0.08, Math.PI, Math.PI * 2.6);
      g.stroke();
    } else if (kind == 2) {
      g.fillStyle = "rgba(150,166,180,0.38)";
      for (let f = 0; f < 5; f++) {
        const an = -Math.PI / 2 + (f - 2) * 0.42 + a;
        const L = 0.3 + h * 0.25;
        g.beginPath();
        g.ellipse(x + Math.cos(an) * L * 0.5, Math.sin(an) * L * 0.5, L * 0.5, 0.05, an, 0, 7);
        g.fill();
      }
    } else {
      g.beginPath();
      g.moveTo(x, 0);
      g.quadraticCurveTo(x + lean * h * 0.4, -h * 0.5, tx, ty);
      g.stroke();
      g.fillStyle = "rgba(190,204,200,0.6)";
      for (let s = 0; s < 5; s++) {
        g.beginPath();
        g.arc(tx + Math.cos(s * 1.3 + ph) * 0.09, ty + Math.sin(s * 1.3 + ph) * 0.07, 0.03 + 0.015 * (s % 2), 0, 7);
        g.fill();
      }
      if (k % 2) tip(tx, ty - 0.05, ph);
    }
  }
}
