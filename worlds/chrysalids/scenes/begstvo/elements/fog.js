// The fog lying in the hollow behind the shoulder (8.9 m, across 2.5…18): soft banks in two sheets swaying each its way
// (fog.animate.js thickens them with `fog` and sways them a little — whole within the card: no bank meets its edge);
// on the hollow's floor (lib.track) where the horses stand, about their legs — their bodies and heads over it
const { track } = e.lib, floor = x => track(Math.min(x, 12.5));
const reach = x => Math.max(0, Math.min(1, (x - 2.6) / 1.6)) * Math.max(0, Math.min(1, (17 - x) / 3));
for (const name of ['f0', 'f1']) {
  e.layer(name, { box: [2, -4, 18, 3] }, q => {
    for (let i = 0; i < 16; i++) {
      const rw = 1.6 + e.rnd() * 2.2, x = 3.1 + rw + e.rnd() * (13.4 - 2 * rw), k = reach(x), y = -floor(x) + 0.25 - e.rnd() * 1.1, a = (0.25 + 0.3 * e.rnd()) * k;
      const gr = q.createRadialGradient(x, y, 0, x, y, rw);
      gr.addColorStop(0, `rgba(196,206,222,${a.toFixed(3)})`);
      gr.addColorStop(1, 'rgba(196,206,222,0)');
      q.save(); q.translate(x, y); q.scale(1, 0.32); q.translate(-x, -y);
      q.fillStyle = gr; q.fillRect(x - rw, y - rw, 2 * rw, 2 * rw); q.restore();
    }
  });
}
e.layer('bank', { box: [2, -4, 18, 3] }, q => {
  for (let x = 3; x < 18; x += 0.5) {
    const y0 = -floor(x), h = 1.1 * reach(x);
    const gr = q.createLinearGradient(0, y0 - h, 0, y0 + 0.2);
    gr.addColorStop(0, 'rgba(190,200,218,0)');
    gr.addColorStop(0.8, `rgba(190,200,218,${(0.55 * reach(x)).toFixed(3)})`);
    gr.addColorStop(1, 'rgba(190,200,218,0)');
    q.fillStyle = gr;
    q.fillRect(x, y0 - h, 0.52, h + 0.2);
  }
});
