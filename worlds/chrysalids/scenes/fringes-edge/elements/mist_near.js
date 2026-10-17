// mist low over the last field (9 m), a sheet drifting
e.layer('m', { drift: [0.15, 0], box: [-60, -3, 60, 0.5] }, q => {
  for (let i = 0; i < 14; i++) {
    const x = -60 + e.rnd() * 120, w = 3 + e.rnd() * 6;
    for (const k of [-120, 0, 120]) {
      const mg = q.createRadialGradient(x + k, -0.5, 0, x + k, -0.5, w);
      mg.addColorStop(0, 'rgba(180,192,214,0.2)');
      mg.addColorStop(1, 'rgba(180,192,214,0)');
      q.save(); q.translate(x + k, -0.5); q.scale(1, 0.15); q.translate(-(x + k), 0.5);
      q.fillStyle = mg; q.fillRect(x + k - w, -0.5 - w, 2 * w, 2 * w); q.restore();
    }
  }
});
