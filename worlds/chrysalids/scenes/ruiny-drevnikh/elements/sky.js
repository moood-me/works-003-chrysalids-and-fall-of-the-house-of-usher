// The summer sky over the ruins: pale, warmer toward the sun low on the left (it sinks and warms with `sun`, which the
// game changes seldom); thin long clouds a layer of their own, drifting
const A = e.aspect, S = e.state || {}, s = S.sun ?? 0.2;
const L = (a, b, t) => 'rgb(' + a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',') + ')';
const LA = (a, b, t, al) => 'rgba(' + a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',') + ',' + al + ')';
const gr = g.createLinearGradient(0, -0.35, 0, 1.25);
gr.addColorStop(0, L([132, 146, 160], [104, 112, 134], s));
gr.addColorStop(0.3, L([172, 180, 182], [170, 160, 158], s));
gr.addColorStop(0.48, L([210, 207, 193], [216, 184, 152], s));
gr.addColorStop(0.58, L([228, 221, 202], [238, 202, 154], s));
gr.addColorStop(0.75, L([200, 198, 180], [196, 172, 140], s));
gr.addColorStop(1, L([170, 170, 154], [150, 132, 112], s));
g.fillStyle = gr;
g.fillRect(-0.4, -0.4, A + 0.8, 1.7);
function blob(q, cx, cy, rx, ry, st) {
  const rg = q.createRadialGradient(0, 0, 0, 0, 0, 1);
  for (const k of st) rg.addColorStop(k[0], k[1]);
  q.save(); q.translate(cx, cy); q.scale(rx, ry); q.fillStyle = rg; q.beginPath(); q.arc(0, 0, 1, 0, 7); q.fill(); q.restore();
}
const sx = A * (0.2 + 0.05 * s), sy = 0.16 + 0.3 * s;
blob(g, sx, sy, 1.0, 0.75, [[0, LA([252, 240, 212], [252, 222, 170], s, 0.42 + 0.18 * s)], [0.4, LA([246, 228, 194], [244, 206, 156], s, 0.14 + 0.14 * s)], [1, 'rgba(240,220,190,0)']]);
blob(g, sx, sy, 0.1, 0.1, [[0, 'rgba(255,249,232,0.8)'], [0.3, 'rgba(255,240,212,0.45)'], [1, 'rgba(255,236,200,0)']]);
blob(g, A * 0.5, 0.42, 1.5, 0.1, [[0, LA([242, 232, 210], [246, 214, 170], s, 0.3 + 0.2 * s)], [1, 'rgba(240,228,206,0)']]);
e.layer('clouds', { drift: [0.0012, 0], box: [-0.6, -0.1, A + 0.6, 0.45] }, q => {
  const W = A + 1.2;
  for (let c = 0; c < 9; c++) {
    const y = 0.06 + e.rnd() * 0.32, len = 0.3 + e.rnd() * 0.5, x0 = -0.6 + e.rnd() * W, n = 6 + Math.floor(e.rnd() * 5);
    for (let k = 0; k < n; k++) {
      const u = k / (n - 1) - 0.5;
      const cx = x0 + u * len + (e.rnd() - 0.5) * 0.04, cy = y + (e.rnd() - 0.5) * 0.012 + u * u * 0.01;
      const rx = 0.05 + e.rnd() * 0.08, ry = 0.007 + e.rnd() * 0.009, a = (0.13 + 0.1 * e.rnd()) * (1 - Math.abs(u) * 1.2);
      if (a <= 0) continue;
      for (const w of [-W, 0, W]) {
        blob(q, cx + w, cy, rx, ry, [[0, LA([248, 244, 232], [252, 232, 200], s, a)], [1, 'rgba(246,240,226,0)']]);
        blob(q, cx + w + 0.012, cy + ry * 0.8, rx * 0.8, ry * 0.5, [[0, LA([150, 154, 158], [176, 140, 128], s, a * 0.45)], [1, 'rgba(150,150,150,0)']]);
      }
    }
  }
});
