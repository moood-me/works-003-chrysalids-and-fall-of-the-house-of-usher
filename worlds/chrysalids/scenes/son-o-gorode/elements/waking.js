// The waking (a card just before the eye, over everything; its own colours — it glows): the dark closing in from the
// edges, the bedroom window's posts sliding in from the sides, the beam coming down, the sill rising, the cross of the
// frame at the end — layers (waking.animate.js moves them by `waking`). Drawn in the units of «кино»'s card (its frame
// 4.26 high), scaled to where it stands (1.5 m).
const K = 1.5 / 4.26, Hm = 4.26, cy = -0.5 * Hm;
const wood = a => `rgba(30,24,30,${a})`;
e.layer('vig', { box: [-7 * K, -5 * K, 7 * K, 0.6 * K] }, q => {
  q.scale(K, K);
  q.save(); q.translate(0, cy); q.scale(1.35, 1);
  const rg = q.createRadialGradient(0, 0, Hm * 0.22, 0, 0, Hm * 0.7);
  rg.addColorStop(0, 'rgba(10,10,18,0)'); rg.addColorStop(1, 'rgba(10,10,18,0.92)');
  q.fillStyle = rg; q.fillRect(-5, -3, 10, 6);
  q.restore();
  q.fillStyle = 'rgba(10,10,18,0.35)'; q.fillRect(-7, -5, 14, 5.6);
});
for (const s of [-1, 1]) e.layer(s < 0 ? 'postL' : 'postR', { box: [-7 * K, -5 * K, 7 * K, 0.6 * K] }, q => {
  q.scale(K, K);
  const inner = s * 2.35, outer = s * 8, soft = 0.35;
  const lg = q.createLinearGradient(inner, 0, inner + s * soft, 0);
  lg.addColorStop(0, wood(0)); lg.addColorStop(1, wood(0.97));
  q.fillStyle = lg; q.fillRect(Math.min(inner, inner + s * soft), -5, soft, 5.6);
  q.fillStyle = wood(0.97); q.fillRect(Math.min(inner + s * soft, outer), -5, Math.abs(outer - inner - s * soft), 5.6);
  q.strokeStyle = 'rgba(74,60,56,0.18)'; q.lineWidth = 0.012;
  for (let i = 0; i < 4; i++) {
    const x = inner + s * (soft + 0.12 + i * 0.18);
    q.beginPath(); q.moveTo(x, -5);
    for (let y = -5; y <= 0.6; y += 0.25) q.lineTo(x + 0.015 * Math.sin(y * 3 + i * 2), y);
    q.stroke();
  }
});
e.layer('beam', { box: [-7 * K, -6 * K, 7 * K, -2.5 * K] }, q => {
  q.scale(K, K);
  const bb = -Hm + 0.87;
  q.fillStyle = wood(0.97); q.fillRect(-7, -6, 14, bb - 0.3 + 6);
  const tg = q.createLinearGradient(0, bb - 0.3, 0, bb);
  tg.addColorStop(0, wood(0.97)); tg.addColorStop(1, wood(0));
  q.fillStyle = tg; q.fillRect(-7, bb - 0.3, 14, 0.3);
});
e.layer('sill', { box: [-7 * K, -1 * K, 7 * K, 1.4 * K] }, q => {
  q.scale(K, K);
  const sb = -0.6;
  const sg = q.createLinearGradient(0, sb, 0, sb + 0.25);
  sg.addColorStop(0, wood(0)); sg.addColorStop(1, wood(0.97));
  q.fillStyle = sg; q.fillRect(-7, sb, 14, 0.25);
  q.fillStyle = wood(0.97); q.fillRect(-7, sb + 0.25, 14, 1.2);
});
e.layer('cross', { box: [-7 * K, -5 * K, 7 * K, 0.6 * K] }, q => {
  q.scale(K, K);
  const mw = 0.07, my = -0.52 * Hm;
  const lg = q.createLinearGradient(-mw * 2, 0, mw * 2, 0);
  lg.addColorStop(0, wood(0)); lg.addColorStop(0.35, wood(0.92)); lg.addColorStop(0.65, wood(0.92)); lg.addColorStop(1, wood(0));
  q.fillStyle = lg; q.fillRect(-mw * 2, -5, mw * 4, 5.6);
  const lh = q.createLinearGradient(0, my - mw * 2, 0, my + mw * 2);
  lh.addColorStop(0, wood(0)); lh.addColorStop(0.35, wood(0.92)); lh.addColorStop(0.65, wood(0.92)); lh.addColorStop(1, wood(0));
  q.fillStyle = lh; q.fillRect(-7, my - mw * 2, 14, mw * 4);
});
