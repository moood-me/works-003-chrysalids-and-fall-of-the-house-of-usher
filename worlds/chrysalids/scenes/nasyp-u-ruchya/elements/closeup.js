// The close-up (an insert opened by `closeup`, its iris round lib.CU — to the right of the frame's middle, so the meadow
// and the rider coming over it stay in sight): the bare foot on the wet stones, seen from above, in the low sun — this
// the ground under it: sand and pebbles, the water along the bottom (its edge lapping: the layer drifts). Over it:
// closeup_glints (the water's glints), closeup_foot (the stones, the foot, the hem, the hands), closeup_iris (a soft
// dark ring round the iris). All four paint in the close-up's own frame (lib.cuFrame: its units as the iris's were
// 0.46 of the frame's height).
const { CU, cuFrame, cuBox, FOOT_CU } = e.lib;
cuFrame(g);
const bg = g.createLinearGradient(0, -0.5, 0, 0.5);
bg.addColorStop(0, '#c8b78a');
bg.addColorStop(0.55, '#a89a72');
bg.addColorStop(1, '#6f7058');
g.fillStyle = bg;
g.fillRect(-0.9, -0.9, 1.8, 1.8);
for (let i = 0; i < 300; i++) {
  const x = -0.8 + e.rnd() * 1.6, y = -0.7 + e.rnd() * 0.95, r = 0.003 + e.rnd() * 0.009;
  g.fillStyle = e.rnd() < 0.5 ? '#8e8462' : '#e2d6ac';
  g.globalAlpha = 0.55;
  g.beginPath();
  g.ellipse(x, y, r * 1.4, r, e.rnd() * 3, 0, 7);
  g.fill();
}
g.globalAlpha = 1;
// the water: its edge a ripple 0.45 wide (eight of them across its box, so its ends meet as it drifts)
const P = (2 * Math.PI) / 14, x0 = -4 * P, x1 = 4 * P;
e.layer('water', { drift: [(-1.2 / 14) * CU.k, 0], box: cuBox(x0, 0.18, x1, 0.9) }, q => {
  cuFrame(q);
  const wg = q.createLinearGradient(0, 0.18, 0, 0.5);
  wg.addColorStop(0, '#5c6a62');
  wg.addColorStop(1, '#3c463c');
  q.fillStyle = wg;
  q.beginPath();
  q.moveTo(x0, 0.24);
  for (let x = x0; x <= x1 + 1e-6; x += 0.01) q.lineTo(x, 0.22 + 0.015 * Math.sin(x * 14));
  q.lineTo(x1, 0.9);
  q.lineTo(x0, 0.9);
  q.closePath();
  q.fill();
});
// the game's points (the close-up's — closeup#…): the hem's edge where it is with nothing pulled, and where it comes to
// over the foot (the way his hand pulls it: «Подол») — in the close-up's own frame, as the canvas is now (e.at maps
// its x, y through what was done to the canvas: cuFrame above)
{
  const { AX, AY, ANG, HX, COVER } = FOOT_CU, c = Math.cos(ANG), s = Math.sin(ANG);
  e.at(AX + HX * c, AY + HX * s, 'hem');
  e.at(AX + (HX + COVER) * c, AY + (HX + COVER) * s, 'foot');
}
