// the toes turned into the foot about its ankle, each curling from its root in its own time as `cu_wig` says; the hem
// drawn along the foot as `cu_hide` (her hand) or `hem` (his — the game's) goes 0 → 1, its edge stirring; her fingers
// on it while she pulls, his hand on it while `cu_cover`; his hands drawing back with the shoe as `cu_pull` goes 0 → 1
// (in the close-up's units: lib.CU.k of the stage's)
const s = e.state, t = e.t, { CU, FOOT_CU } = e.lib, { ANG, L, COVER } = FOOT_CU, K = CU.k;
const c = Math.cos(ANG), si = Math.sin(ANG), wig = s.cu_wig ?? 0, hide = s.cu_hide ?? 0, pulled = Math.max(hide, s.hem ?? 0);
for (let i = 0; i < 6; i++) {
  const curl = wig * Math.max(0, Math.sin(t * 6 + i * 1.1)), k = 1 - 0.3 * curl, x0 = L - 0.012 - i * 0.004, T = e.layer(`toe${i}`);
  T.rotate = ANG;
  T.scaleX = k;
  T.x = (1 - k) * x0 * c * K;
  T.y = (1 - k) * x0 * si * K;
}
const along = (COVER * pulled + 0.005 * Math.sin(t * 3)) * K;
for (const name of ['hem', 'fingers', 'his_hand']) {
  const H = e.layer(name);
  H.x = along * c;
  H.y = along * si;
}
e.layer('fingers').alpha = hide > 0.02 && hide < 0.98 ? 1 : 0;
e.layer('his_hand').alpha = s.cu_cover ? 1 : 0;
e.layer('hands').x = 0.2 * K * (s.cu_pull ?? 0);
