// the branch bent down under her as `branch` goes 0 → 0.85, tugging with the current; snapped past it: the stub springs up
// and shivers, settling, the piece carried off downstream on the water, turning a little; the tip's point where her hands are
const s = e.state, c = e.anim.clamp, Bv = s.branch ?? 0.2, broke = c((Bv - 0.85) / 0.15, 0, 1), t = e.t, W = e.lib.W, m = e.mem;
const tug = 0.05 * Math.sin(t * 2.6) + 0.03 * Math.sin(t * 4.1 + 1);
const B = e.layer('branch'), Pc = e.layer('piece');
if (broke <= 0) {
  B.rotate = 0.16 * c(Bv / 0.85, 0, 1) + tug * 0.12;
  B.scaleX = 1;
  Pc.alpha = 0;
  m.snap = null;
} else {
  m.snap ??= t;
  const since = t - m.snap;
  B.rotate = -0.25 * c(broke * 3, 0, 1) + Math.exp(-since * 2) * Math.sin(since * 22) * 0.05;
  B.scaleX = 0.55;
  Pc.alpha = 1;
  Pc.x = 4.6 + Math.min(7, since * 0.9);
  Pc.y = W - 0.02;
  Pc.rotate = 0.12 + 0.12 * Math.sin(t * 1.3);
}
const ang = B.rotate, ex = 5.05 - e.lib.ROOT[0], ey = -0.2 - e.lib.ROOT[1];
e.at(e.lib.ROOT[0] + ex * Math.cos(ang) - ey * Math.sin(ang), e.lib.ROOT[1] + ex * Math.sin(ang) + ey * Math.cos(ang), 'tip');
