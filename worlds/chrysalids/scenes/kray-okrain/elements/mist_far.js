// mist over the Fringes (26 m), two sheets drifting (their alpha: by `mist`)
for (const [name, speed, y, a] of [['m0', 0.25, -2, 0.3], ['m1', 0.45, -0.8, 0.22]]) {
  e.layer(name, { drift: [speed, 0], box: [-170, -10, 170, 1] }, q => {
    for (let i = 0; i < 18; i++) {
      const x = -170 + e.rnd() * 340, w = 8 + e.rnd() * 16;
      for (const k of [-340, 0, 340]) {
        const mg = q.createRadialGradient(x + k, y, 0, x + k, y, w);
        mg.addColorStop(0, `rgba(170,184,210,${a})`);
        mg.addColorStop(1, 'rgba(170,184,210,0)');
        q.save(); q.translate(x + k, y); q.scale(1, 0.18); q.translate(-(x + k), -y);
        q.fillStyle = mg; q.fillRect(x + k - w, y - w, 2 * w, 2 * w); q.restore();
      }
    }
  });
}
