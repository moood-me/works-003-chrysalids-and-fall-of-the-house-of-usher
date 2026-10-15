// The vision coast (Axel's story, `vision` 3): painted once into its layer at the middle of the smoke; its
// animate (vis_coast.animate.js) moves it there, sizes it and shows it as `story`, `vision` and `dawn` say
const A = e.aspect;
const t = 0;
const C = "190,200,224";
const lerp = (a, b, k) => a + (b - a) * k;
function soft(body, a, B, rule) {
  // the outlines the body draws, gathered into one path (its own fills and strokes are not drawn), filled once blurred
  const P = new Path2D();
  const sh = { lineWidth: 0, lineCap: 'butt', beginPath() {}, fill() {}, stroke() {},
    closePath: () => P.closePath(), moveTo: (x, y) => P.moveTo(x, y), lineTo: (x, y) => P.lineTo(x, y),
    quadraticCurveTo: (...q) => P.quadraticCurveTo(...q), bezierCurveTo: (...q) => P.bezierCurveTo(...q),
    arc: (...q) => P.arc(...q), ellipse: (...q) => P.ellipse(...q), rect: (...q) => P.rect(...q) };
  body(sh);
  g.save();
  g.filter = 'blur(' + B / 1080 + 'px)';
  g.globalAlpha = a;
  g.fill(P, rule || 'nonzero');
  g.globalAlpha = a * 0.45;
  g.lineWidth = 0.005;
  g.stroke(P);
  g.restore();
  g.filter = 'none';
}
function grad(top) {
  const gr = g.createLinearGradient(0, top, 0, 0.02);
  gr.addColorStop(0, "rgba(" + C + ",0.25)");
  gr.addColorStop(0.5, "rgba(" + C + ",0.85)");
  gr.addColorStop(0.85, "rgba(" + C + ",0.8)");
  gr.addColorStop(1, "rgba(" + C + ",0)");
  g.fillStyle = gr;
  g.strokeStyle = gr;
}
function puff(x, y, rx, ry, col, al) {
  g.save();
  g.translate(x, y);
  g.scale(rx, ry);
  const rg = g.createRadialGradient(0, 0, 0, 0, 0, 1);
  rg.addColorStop(0, "rgba(" + col + "," + al + ")");
  rg.addColorStop(1, "rgba(" + col + ",0)");
  g.fillStyle = rg;
  g.fillRect(-1, -1, 2, 2);
  g.restore();
}
function smoke(a, w, top) {
  for (let i = 0; i < 9; i++) {
    const r1 = e.rnd(),
      r2 = e.rnd(),
      r3 = e.rnd();
    const x = (r1 - 0.5) * w * 2 + 0.03 * Math.sin(t * (0.05 + r3 * 0.06) + i * 2);
    const y = top * (0.15 + r2 * 0.8) + 0.006 * Math.sin(t * 0.11 + i);
    puff(x, y, 0.05 + r3 * 0.08, 0.012 + r2 * 0.015, "18,26,52", 0.5 * Math.min(1, a * 4));
  }
  g.globalAlpha = 1;
  for (let i = 0; i < 6; i++) {
    const r1 = e.rnd(),
      r2 = e.rnd();
    const x = (r1 - 0.5) * w * 2.2 + 0.04 * Math.sin(t * 0.04 + i * 1.7);
    const y = top * (0.1 + r2 * 0.9);
    puff(x, y, 0.07 + r2 * 0.06, 0.02 + r1 * 0.02, C, a * 0.7);
  }
}
function sea(a, w) {
  for (let i = 0; i < 9; i++) {
    const r1 = e.rnd(),
      r2 = e.rnd();
    const y = 0.008 + i * 0.007 + i * i * 0.0006;
    const x = (r1 - 0.5) * w * 1.4 + 0.012 * Math.sin(t * 0.13 + i * 1.3);
    puff(x, y, 0.06 + r2 * w * 0.6, 0.008 + i * 0.001, C, a * 0.75 * (1 - i / 10));
  }
}
function draw(a, s) {
  sea(a, 0.28);
  grad(-0.3);
  soft(
    (g) => {
      g.beginPath();
      g.moveTo(-0.36, 0.014);
      g.lineTo(-0.35, -0.04);
      g.bezierCurveTo(-0.31, -0.062, -0.24, -0.07, -0.16, -0.058);
      g.bezierCurveTo(-0.08, -0.046, 0.04, -0.03, 0.13, -0.02);
      g.bezierCurveTo(0.19, -0.012, 0.24, -0.004, 0.28, 0.014);
      g.closePath();
      g.fill();
      const tr = [
        [-0.28, -0.062, 0.17, 0],
        [-0.205, -0.066, 0.25, 1],
        [-0.13, -0.056, 0.15, 2],
        [-0.045, -0.043, 0.22, 0],
        [0.04, -0.032, 0.13, 1],
        [0.13, -0.02, 0.19, 2],
      ];
      for (const q of tr) {
        const x = q[0],
          y = q[1],
          h = q[2],
          k = q[3];
        const sw = 0.007 * Math.sin(t * 0.4 + x * 30) + 0.003 * Math.sin(t * 0.93 + x * 11);
        g.beginPath();
        g.moveTo(x - 0.009, y + 0.006);
        g.quadraticCurveTo(x + 0.02, y - h * 0.5, x + sw + 0.008, y - h);
        g.lineTo(x + sw + 0.017, y - h);
        g.quadraticCurveTo(x + 0.031, y - h * 0.5, x + 0.01, y + 0.006);
        g.fill();
        const cx = x + sw + 0.0125,
          cy = y - h;
        if (k === 0) {
          g.beginPath();
          g.moveTo(cx - 0.075, cy + 0.008);
          g.bezierCurveTo(cx - 0.06, cy - 0.035, cx + 0.06, cy - 0.035, cx + 0.075, cy + 0.008);
          g.quadraticCurveTo(cx, cy - 0.006, cx - 0.075, cy + 0.008);
          g.fill();
          g.lineWidth = 0.004;
          for (let j = 0; j < 6; j++) {
            const xx = cx - 0.06 + j * 0.024;
            g.beginPath();
            g.moveTo(xx, cy);
            g.quadraticCurveTo(
              xx + 0.004 * Math.sin(t * 0.6 + j),
              cy + 0.03,
              xx + 0.002,
              cy + 0.045 + 0.01 * (j % 2),
            );
            g.stroke();
          }
        } else if (k === 1) {
          for (let j = 0; j < 4; j++) {
            g.beginPath();
            g.arc(cx + (j % 2 ? 0.016 : -0.014), cy + j * 0.042, 0.026 - j * 0.004, 0, 7);
            g.fill();
          }
        } else {
          g.lineWidth = 0.008;
          g.lineCap = "round";
          for (let j = 0; j < 8; j++) {
            const an = -Math.PI * 0.95 + (j * Math.PI * 0.9) / 7;
            const L = 0.07 + 0.012 * Math.sin(j * 2.3);
            const ex = cx + Math.cos(an) * L,
              ey = cy + 0.035 + 0.005 * Math.sin(t * 0.5 + j);
            g.beginPath();
            g.moveTo(cx, cy);
            g.quadraticCurveTo(cx + Math.cos(an) * L * 0.75, cy - 0.04 + Math.abs(Math.cos(an)) * 0.01, ex, ey);
            g.stroke();
          }
        }
      }
    },
    a,
    3.2,
  );
  smoke(a, 0.3, -0.3);
}
const dom = [A * 0.5 + 0.2, 0.41];
const plain = g;
e.layer('v', { pivot: dom, box: [dom[0] - 0.5, dom[1] - 0.5, dom[0] + 0.5, dom[1] + 0.2] }, q => {
  g = q;
  g.save();
  g.translate(dom[0], dom[1]);
  draw(0.3, 1);
  g.restore();
  g = plain;
});
