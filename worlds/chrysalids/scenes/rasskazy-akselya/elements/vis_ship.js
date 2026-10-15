// The vision ship (Axel's story, `vision` 1): painted once into its layer at the middle of the smoke; its
// animate (vis_ship.animate.js) moves it there, sizes it and shows it as `story`, `vision` and `dawn` say
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
  sea(a, 0.22);
  const rk = 0.025 * Math.sin(t * 0.35) + 0.012 * Math.sin(t * 0.83);
  const by = 0.004 * Math.sin(t * 0.5);
  g.save();
  g.translate(0, by);
  g.rotate(rk);
  grad(-0.28);
  soft(
    (g) => {
      g.beginPath();
      g.moveTo(-0.14, -0.032);
      g.quadraticCurveTo(0.0, -0.026, 0.16, -0.04);
      g.quadraticCurveTo(0.13, -0.005, 0.09, 0.008);
      g.quadraticCurveTo(-0.02, 0.012, -0.1, 0.006);
      g.quadraticCurveTo(-0.13, -0.008, -0.14, -0.032);
      g.fill();
      g.lineWidth = 0.004;
      for (const m of [
        [-0.07, 0.2],
        [0, 0.245],
        [0.07, 0.18],
      ]) {
        const mx = m[0],
          mh = m[1];
        g.beginPath();
        g.moveTo(mx, -0.03);
        g.lineTo(mx, -0.03 - mh);
        g.stroke();
        for (let k = 0; k < 3; k++) {
          const y0 = -0.03 - mh * (0.14 + k * 0.28),
            h = mh * 0.27,
            w = 0.052 * (1 - k * 0.2);
          const bl = 0.016 + 0.006 * Math.sin(t * 0.5 + mx * 20 + k * 1.3);
          g.beginPath();
          g.moveTo(mx - w, y0 - h);
          g.quadraticCurveTo(mx, y0 - h - 0.012, mx + w, y0 - h);
          g.bezierCurveTo(mx + w + bl, y0 - h * 0.6, mx + w + bl * 0.8, y0 - h * 0.2, mx + w * 0.9, y0);
          g.quadraticCurveTo(mx + bl * 0.3, y0 - 0.012, mx - w * 0.9, y0);
          g.bezierCurveTo(mx - w + bl * 0.5, y0 - h * 0.25, mx - w + bl * 0.6, y0 - h * 0.65, mx - w, y0 - h);
          g.fill();
        }
      }
      g.beginPath();
      g.moveTo(0.074, -0.21);
      g.quadraticCurveTo(0.17, -0.12, 0.21, -0.045);
      g.quadraticCurveTo(0.15, -0.06, 0.1, -0.045);
      g.closePath();
      g.fill();
      g.beginPath();
      g.moveTo(-0.075, -0.2);
      g.quadraticCurveTo(-0.14, -0.12, -0.13, -0.05);
      g.quadraticCurveTo(-0.1, -0.06, -0.08, -0.05);
      g.closePath();
      g.fill();
    },
    a,
    3.6,
  );
  smoke(a, 0.17, -0.28);
  g.restore();
}
const dom = [A * 0.7, 0.41];
const plain = g;
e.layer('v', { pivot: dom, box: [dom[0] - 0.5, dom[1] - 0.5, dom[0] + 0.5, dom[1] + 0.2] }, q => {
  g = q;
  g.save();
  g.translate(dom[0], dom[1]);
  draw(0.3, 1);
  g.restore();
  g = plain;
});
