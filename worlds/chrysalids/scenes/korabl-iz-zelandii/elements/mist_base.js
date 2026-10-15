// smoke lying at the roots of the wood (31 m), drifting
e.layer('m', { drift: [0.2, 0], box: [-70, -4, 70, 2] }, q => {
  for (let i = 0; i < 10; i++) {
    const x = -70 + e.rnd() * 140, w = 5 + e.rnd() * 8;
    for (const k of [-140, 0, 140]) {
      const mg = q.createRadialGradient(x + k, -0.8, 0, x + k, -0.8, w);
      mg.addColorStop(0, 'rgba(180,170,176,0.25)');
      mg.addColorStop(1, 'rgba(180,170,176,0)');
      q.save(); q.translate(x + k, -0.8); q.scale(1, 0.2); q.translate(-(x + k), 0.8);
      q.fillStyle = mg; q.fillRect(x + k - w, -0.8 - w, 2 * w, 2 * w); q.restore();
    }
  }
});
