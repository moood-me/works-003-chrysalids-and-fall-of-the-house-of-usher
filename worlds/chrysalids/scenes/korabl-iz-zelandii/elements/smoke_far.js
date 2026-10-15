// smoke over the wood from the fight, a sheet drifting
e.layer('s', { drift: [0.4, 0], box: [-200, -40, 200, 2] }, q => {
  for (let i = 0; i < 12; i++) {
    const x = -200 + e.rnd() * 400, y = -14 - e.rnd() * 18, w = 12 + e.rnd() * 20;
    for (const k of [-400, 0, 400]) {
      const mg = q.createRadialGradient(x + k, y, 0, x + k, y, w);
      mg.addColorStop(0, 'rgba(150,140,146,0.3)');
      mg.addColorStop(1, 'rgba(150,140,146,0)');
      q.save(); q.translate(x + k, y); q.scale(1, 0.35); q.translate(-(x + k), -y);
      q.fillStyle = mg; q.fillRect(x + k - w, y - w, 2 * w, 2 * w); q.restore();
    }
  }
});
