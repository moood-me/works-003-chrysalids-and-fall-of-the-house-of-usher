// The mist lying on the water by the house: soft banks drifting slowly along it, some one way, some the other — two layers drifting round
// their box (their ends meet), painted as thick as the gloom can make it (K): its animate thins them to the mist
// of the moment.
const lt = e.lib.light(e.state || {}), m = lt.mist, K = 1.8, mist = (a) => e.lib.paint("#b2b8bc", Math.min(1, a));
if (m < 0.01) return;
const rn = (i) => { const s = Math.sin(i * 57.3 + 9.1) * 43758.5453; return s - Math.floor(s); };
// its band along the water
e.layer("band", {}, (g) => {
  const gb = g.createLinearGradient(0, -4.5, 0, 1.5);
  gb.addColorStop(0, mist(0)); gb.addColorStop(0.7, mist(0.3 * m * K)); gb.addColorStop(1, mist(0));
  g.fillStyle = gb; g.fillRect(-140, -4.5, 280, 6);
});
const W = 280, BOX = [-140, -6.40, 140, 1];
for (const [name, sign] of [["east", 1], ["west", -1]]) {
  e.layer(name, { box: BOX, drift: [sign * 0.14, 0] }, (g) => {
    for (let i = 0; i < 14; i++) {
      if ((i % 2 ? 1 : -1) !== sign) continue;
      const y = -0.3 - rn(i) * 3, x = -140 + rn(i + 40) * W, rw = 14 + rn(i + 60) * 26;
      for (const dx of [-W, 0, W]) {
        const rg = g.createRadialGradient(x + dx, y, 0, x + dx, y, rw);
        rg.addColorStop(0, mist(0.22 * m * K)); rg.addColorStop(1, mist(0));
        g.save(); g.translate(x + dx, y); g.scale(1, 0.07); g.translate(-(x + dx), -y);
        g.fillStyle = rg; g.fillRect(x + dx - rw, y - rw, 2 * rw, 2 * rw);
        g.restore();
      }
    }
  });
}
