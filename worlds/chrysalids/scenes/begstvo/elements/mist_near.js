// mist low along the near slope (8 m), one sheet drifting
e.layer('m', { drift: [0.12, 0], box: [-60, -1.5, 60, 0.4] }, q => {
  for (let i = 0; i < 14; i++) {
    const x = -60 + e.rnd() * 120, w = 3 + e.rnd() * 5;
    for (const k of [-120, 0, 120]) {
      const mg = q.createRadialGradient(x + k, -0.4, 0, x + k, -0.4, w);
      mg.addColorStop(0, 'rgba(180,192,212,0.22)');
      mg.addColorStop(1, 'rgba(180,192,212,0)');
      q.save(); q.translate(x + k, -0.4); q.scale(1, 0.15); q.translate(-(x + k), 0.4);
      q.fillStyle = mg; q.fillRect(x + k - w, -0.4 - w, 2 * w, 2 * w); q.restore();
    }
  }
});
