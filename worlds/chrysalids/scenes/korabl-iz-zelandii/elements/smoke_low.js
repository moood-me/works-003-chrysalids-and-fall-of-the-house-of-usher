// low smoke over the clearing (28 m), drifting
e.layer('s', { drift: [0.3, 0], box: [-60, -6, 60, 1] }, q => {
  for (let i = 0; i < 10; i++) {
    const x = -60 + e.rnd() * 120, w = 5 + e.rnd() * 8;
    for (const k of [-120, 0, 120]) {
      const mg = q.createRadialGradient(x + k, -1.5, 0, x + k, -1.5, w);
      mg.addColorStop(0, 'rgba(170,160,166,0.28)');
      mg.addColorStop(1, 'rgba(170,160,166,0)');
      q.save(); q.translate(x + k, -1.5); q.scale(1, 0.25); q.translate(-(x + k), 1.5);
      q.fillStyle = mg; q.fillRect(x + k - w, -1.5 - w, 2 * w, 2 * w); q.restore();
    }
  }
});
