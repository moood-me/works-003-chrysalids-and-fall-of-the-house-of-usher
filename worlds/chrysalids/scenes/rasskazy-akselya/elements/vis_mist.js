// The haze of the visions in the smoke's zone: soft long banks (vis_mist.animate.js: as strong as `story`, drifting)
const A = e.aspect;
for (const [name, n, y0, y1, a0] of [['hi', 12, 0.11, 0.51, 0.2], ['lo', 8, 0.43, 0.51, 0.4]]) {
  e.layer(name, { box: [A * 0.3, y0 - 0.15, A * 1.1, y1 + 0.15] }, q => {
    for (let i = 0; i < n; i++) {
      const bx = A * (0.38 + e.rnd() * 0.62), by = y0 + e.rnd() * (y1 - y0), r = 0.1 + e.rnd() * 0.22;
      q.save();
      q.translate(bx, by);
      q.rotate(name === 'hi' ? -0.15 + e.rnd() * 0.3 : 0);
      q.scale(1, 0.16);
      const rg = q.createRadialGradient(0, 0, 0, 0, 0, r);
      rg.addColorStop(0, `rgba(${name === 'hi' ? '70,82,116' : '56,68,100'},${a0})`);
      rg.addColorStop(1, 'rgba(70,82,116,0)');
      q.fillStyle = rg;
      q.fillRect(-r, -r, 2 * r, 2 * r);
      q.restore();
    }
  });
}
