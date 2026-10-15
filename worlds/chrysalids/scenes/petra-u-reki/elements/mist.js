// mist low over the water under the far bank, in two drifting sheets (painted once, moved by their drift)
for (const [name, speed, y, a] of [['mist0', 0.25, -1.2, 0.22], ['mist1', 0.45, -0.6, 0.16]]) {
  e.layer(name, { drift: [speed, 0], box: [-55, -4, 55, 1] }, q => {
    for (let i = 0; i < 16; i++) {
      const x = -55 + e.rnd() * 110, w = 4 + e.rnd() * 8;
      for (const k of [-110, 0, 110]) {
        const mg = q.createRadialGradient(x + k, y, 0, x + k, y, w);
        mg.addColorStop(0, `rgba(214,218,212,${a})`);
        mg.addColorStop(1, 'rgba(214,218,212,0)');
        q.save();
        q.translate(x + k, y);
        q.scale(1, 0.18);
        q.translate(-(x + k), -y);
        q.fillStyle = mg;
        q.fillRect(x + k - w, y - w, 2 * w, 2 * w);
        q.restore();
      }
    }
  });
}
