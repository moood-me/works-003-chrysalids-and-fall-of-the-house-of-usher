// mist low over the fields at the horizon: banks a layer drifting round
const A = e.aspect, hz = e.lib.HZ;
e.layer('m', { drift: [0.002, 0], box: [-0.4, hz - 0.03, A + 0.4, hz + 0.16] }, q => {
  const W = A + 0.8;
  for (let i = 0; i < 6; i++) {
    const y = hz + 0.012 + i * 0.022, cx = -0.4 + e.rnd() * W, rx = 0.35 + e.rnd() * 0.4;
    for (const k of [-W, 0, W]) {
      q.save(); q.translate(cx + k, y); q.scale(1, 0.018 / rx);
      const mg = q.createRadialGradient(0, 0, 0, 0, 0, rx);
      mg.addColorStop(0, 'rgba(90,94,124,0.06)'); mg.addColorStop(1, 'rgba(90,94,124,0)');
      q.fillStyle = mg; q.beginPath(); q.arc(0, 0, rx, 0, 7); q.fill(); q.restore();
    }
  }
});
