// smoke and mist hanging over the clearing (24 m), two sheets drifting
for (const [name, speed, y, a] of [['f0', 0.2, -4, 0.25], ['f1', 0.35, -1.5, 0.18]]) {
  e.layer(name, { drift: [speed, 0], box: [-80, -10, 80, 4] }, q => {
    for (let i = 0; i < 14; i++) {
      const x = -80 + e.rnd() * 160, w = 6 + e.rnd() * 10;
      for (const k of [-160, 0, 160]) {
        const mg = q.createRadialGradient(x + k, y, 0, x + k, y, w);
        mg.addColorStop(0, `rgba(190,196,210,${a})`);
        mg.addColorStop(1, 'rgba(190,196,210,0)');
        q.save(); q.translate(x + k, y); q.scale(1, 0.2); q.translate(-(x + k), -y);
        q.fillStyle = mg; q.fillRect(x + k - w, y - w, 2 * w, 2 * w); q.restore();
      }
    }
  });
}
