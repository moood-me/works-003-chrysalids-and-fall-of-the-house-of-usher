// The sky of the blue hour before dawn: night overhead, paler toward the dawn low on the right (DX); stars — a layer the
// animate thins as the dawn grows; the dawn's band — a layer it brings in; Venus over the dawn. Painted once.
const A = e.aspect, H = 0.62, DX = A * 0.74;
const gr = g.createLinearGradient(0, -0.35, 0, 1.25);
gr.addColorStop(0, '#1c2c50');
gr.addColorStop(0.3, '#2c406a');
gr.addColorStop(0.5, '#4a5e88');
gr.addColorStop(0.61, '#7a88a4');
gr.addColorStop(0.7, '#4a5876');
gr.addColorStop(1, '#2e3a56');
g.fillStyle = gr;
g.fillRect(-0.4, -0.4, A + 0.8, 1.7);
e.layer('stars', { box: [-0.3, -0.35, A + 0.3, 0.6] }, q => {
  q.fillStyle = '#d6def0';
  for (let i = 0; i < 150; i++) {
    const x = -0.3 + e.rnd() * (A + 0.6), y = -0.35 + e.rnd() * 0.8, r = e.rnd();
    const nd = Math.max(0, 1 - Math.hypot(x - DX, (y - H) * 1.6) / 0.8);
    q.globalAlpha = Math.max(0, (0.15 + 0.5 * r * r) * (1 - nd) * (1 - Math.max(0, (y - 0.35) / 0.25)));
    q.fillRect(x, y, 0.0015 + r * 0.0016, 0.0015 + r * 0.0016);
  }
  q.globalAlpha = 1;
});
e.layer('dawn', { box: [DX - 1.4, H - 0.4, DX + 1.4, H + 0.4] }, q => {
  for (const [rx, ry, c0, c1] of [[1.3, 0.34, 'rgba(176,182,192,0.7)', 'rgba(120,136,160,0)'], [0.9, 0.085, 'rgba(236,216,184,0.95)', 'rgba(200,196,186,0)'], [0.42, 0.02, 'rgba(246,228,194,1)', 'rgba(236,218,186,0)']]) {
    const rg = q.createRadialGradient(0, 0, 0, 0, 0, 1);
    rg.addColorStop(0, c0);
    rg.addColorStop(1, c1);
    q.save();
    q.translate(DX, H);
    q.scale(rx, ry);
    q.fillStyle = rg;
    q.beginPath();
    q.arc(0, 0, 1, 0, 7);
    q.fill();
    q.restore();
  }
});
e.light(A * 0.84, 0.3, 0.012, '#e6eaf2', 0.8, 'venus');
