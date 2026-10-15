// mist in the low ground far off, two sheets drifting (their alpha: mist_far.animate.js, by `mist`)
for (const [name, speed, y, a] of [['m0', 0.3, -1.5, 0.3], ['m1', 0.5, -0.6, 0.22]]) {
  e.layer(name, { drift: [speed, 0], box: [-160, -6, 160, 1] }, q => {
    for (let i = 0; i < 18; i++) {
      const x = -160 + e.rnd() * 320, w = 10 + e.rnd() * 20;
      for (const k of [-320, 0, 320]) {
        const mg = q.createRadialGradient(x + k, y, 0, x + k, y, w);
        mg.addColorStop(0, `rgba(170,184,206,${a})`);
        mg.addColorStop(1, 'rgba(170,184,206,0)');
        q.save(); q.translate(x + k, y); q.scale(1, 0.15); q.translate(-(x + k), -y);
        q.fillStyle = mg; q.fillRect(x + k - w, y - w, 2 * w, 2 * w); q.restore();
      }
    }
  });
}
