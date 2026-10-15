// Long thin strands of cloud, warmer near the city (as its `lights` say): a layer drifting slowly round
const A = e.aspect, S = e.state || {}, li = S.lights ?? 0.7, cx = e.lib.cityX(A);
e.layer('c', { drift: [0.0015, 0], box: [-0.6, 0.1, A + 0.6, 0.62] }, q => {
  const W = A + 1.2;
  for (let c = 0; c < 7; c++) {
    const cy = 0.2 + e.rnd() * 0.34, x0 = -0.6 + e.rnd() * W, len = 0.4 + e.rnd() * 0.7, n = 8;
    for (let j = 0; j < n; j++) {
      const u = j / (n - 1) - 0.5;
      const x = x0 + u * len + (e.rnd() - 0.5) * 0.06, y = cy + (e.rnd() - 0.5) * 0.015 + u * u * 0.02;
      const rx = 0.07 + e.rnd() * 0.12, ry = 0.008 + e.rnd() * 0.01;
      const prox = Math.max(0, 1 - Math.abs(x - cx) / 0.7) * Math.max(0, (y - 0.15) / 0.45);
      const a = (0.05 + 0.1 * prox * li) * (1 - Math.abs(u) * 1.4);
      if (a <= 0) continue;
      const col = prox > 0.3 ? '226,196,180' : '150,146,190';
      for (const k of [-W, 0, W]) {
        const rg = q.createRadialGradient(0, 0, 0, 0, 0, 1);
        rg.addColorStop(0, `rgba(${col},${a})`); rg.addColorStop(1, `rgba(${col},0)`);
        q.save(); q.translate(x + k, y); q.scale(rx, ry); q.fillStyle = rg; q.beginPath(); q.arc(0, 0, 1, 0, 7); q.fill(); q.restore();
      }
    }
  }
});
