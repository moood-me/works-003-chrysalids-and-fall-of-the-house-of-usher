// The mist near the shore: soft banks drifting slowly along it, some one way, some the other — two layers drifting round
// their box (their ends meet), painted as thick as the gloom can make it (K): its animate thins them to the mist
// of the moment.
const lt = e.lib.light(e.state || {}), m = lt.mist, K = 1.8, mist = (a) => e.lib.tone(lt, "#8c98a2", "#b2b8be", Math.min(1, a));
if (m < 0.01) return;
const rn = (i) => { const s = Math.sin(i * 21.7 + 2.3) * 43758.5453; return s - Math.floor(s); };
const W = 80, BOX = [-40, -1.97, 40, 1];
for (const [name, sign] of [["east", 1], ["west", -1]]) {
  e.layer(name, { box: BOX, drift: [sign * 0.065, 0] }, (g) => {
    for (let i = 0; i < 9; i++) {
      if ((i % 2 ? 1 : -1) !== sign) continue;
      const y = -0.05 - rn(i) * 0.9, x = -40 + rn(i + 40) * W, rw = 4 + rn(i + 60) * 8;
      for (const dx of [-W, 0, W]) {
        const rg = g.createRadialGradient(x + dx, y, 0, x + dx, y, rw);
        rg.addColorStop(0, mist(0.16 * m * K)); rg.addColorStop(1, mist(0));
        g.save(); g.translate(x + dx, y); g.scale(1, 0.06); g.translate(-(x + dx), -y);
        g.fillStyle = rg; g.fillRect(x + dx - rw, y - rw, 2 * rw, 2 * rw);
        g.restore();
      }
    }
  });
}
