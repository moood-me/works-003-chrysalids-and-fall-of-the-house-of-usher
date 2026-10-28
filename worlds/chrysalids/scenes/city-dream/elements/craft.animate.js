// The fish: each shows as `craft` has grown past its own threshold, clearer as the dream is, paler at the waking; the
// leading one goes along its way by `lead` (if the game leads it; else it drifts, as the others always do) — its
// point `fish` follows it; the others drift; the turning rings are the portholes' shimmer. David's eyes: a soft light at
// `gaze` on the same way (none while it is not set).
const A = e.aspect, S = e.state, Lb = e.lib, t = e.t;
const c = S.craft ?? 0.6, d = S.dream ?? 0.7, w = e.anim.clamp(S.waking ?? 0, 0, 1), cx0 = Lb.cityX(A);
for (let k = 0; k < 3; k++) {
  const D = Lb.FISH[k], F = e.layer('f' + k);
  const ap = Math.max(0, Math.min(1, (c - D[3]) / 0.3)), vis = ap * (0.45 + 0.55 * d) * (1 - w);
  const x0 = cx0 + D[0], y0 = D[1] - 0.07 * c;
  let x = x0 + 0.035 * Math.sin(t * 0.031 + k * 2.1) + 0.012 * Math.sin(t * 0.077 + k);
  let y = y0 + 0.008 * Math.sin(t * 0.05 + k * 1.3) + 0.003 * Math.sin(t * 0.19 + k);
  if (k === 0 && S.lead != null) [x, y] = Lb.PATH(A, e.anim.clamp(+S.lead, 0, 1), c);
  F.x = x - x0;
  F.y = y - y0;
  F.rotate = (0.03 * Math.sin(t * 0.07 + k)) * (k == 1 ? -1 : 1);
  F.alpha = vis;
  e.glow('f' + k, vis);
  if (k === 0) e.at(x, y, 'fish');
}
const G = e.layer('gaze');
if (S.gaze == null) G.alpha = 0;
else {
  const [gx, gy] = Lb.PATH(A, (e.anim.clamp(+S.gaze, -1, 1) + 1) / 2, c);
  G.x = gx; G.y = gy;
  G.alpha = (1 - w) * (0.8 + 0.2 * Math.sin(t * 0.7));
}
