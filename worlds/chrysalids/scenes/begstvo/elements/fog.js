// The fog lying in the hollow behind the shoulder (8.9 m, across 2.5…18): soft banks in two sheets drifting each its way
// (fog.animate.js thickens them with `fog`); over the hollow where the horses stand, it hides their legs and their flanks
const { cr } = e.lib;
const reach = x => Math.max(0, Math.min(1, (x - 2.6) / 1.6)) * Math.max(0, Math.min(1, (17 - x) / 3));
for (const [name, speed] of [['f0', 0.06], ['f1', -0.05]]) {
  e.layer(name, { drift: [speed, 0], box: [2, -4, 18, 0.6] }, q => {
    for (let i = 0; i < 16; i++) {
      const x = 2.5 + e.rnd() * 15, k = reach(x), y = -cr(x) + 0.25 - e.rnd() * 1.1, rw = 1.6 + e.rnd() * 2.2, a = (0.25 + 0.3 * e.rnd()) * k;
      for (const off of [-16, 0, 16]) {
        const gr = q.createRadialGradient(x + off, y, 0, x + off, y, rw);
        gr.addColorStop(0, `rgba(196,206,222,${a.toFixed(3)})`);
        gr.addColorStop(1, 'rgba(196,206,222,0)');
        q.save(); q.translate(x + off, y); q.scale(1, 0.32); q.translate(-(x + off), -y);
        q.fillStyle = gr; q.fillRect(x + off - rw, y - rw, 2 * rw, 2 * rw); q.restore();
      }
    }
  });
}
e.layer('bank', { box: [2, -4, 18, 0.6] }, q => {
  for (let x = 3; x < 18; x += 0.5) {
    const y0 = -cr(x), h = 1.1 * reach(x);
    const gr = q.createLinearGradient(0, y0 - h, 0, y0 + 0.2);
    gr.addColorStop(0, 'rgba(190,200,218,0)');
    gr.addColorStop(1, `rgba(190,200,218,${(0.55 * reach(x)).toFixed(3)})`);
    q.fillStyle = gr;
    q.fillRect(x, y0 - h, 0.52, h + 0.2);
  }
});
