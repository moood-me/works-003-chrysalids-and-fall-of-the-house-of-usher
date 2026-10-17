// each glow and thread as strong as its ends listen (lib.LIS), each thread breathing on its own and its light going
// along it; the warm one between David and Rosalind as `rosalind`; brighter at dusk; all still while the grown-ups look
const L = e.lib, S = e.state, t = e.t;
const th = S.threads == null ? 0.7 : +S.threads, an = +(S.adults_near || 0), ro = +(S.rosalind || 0), dk = +(S.dusk || 0);
const vis = 1 + 0.3 * dk, Ls = L.KIDS.map((_, i) => L.LIS(i, t, S));
L.KIDS.forEach((_, i) => { e.layer('h' + i).alpha = Math.min(1, 2 * th * Ls[i] * vis * 0.5) * (0.8 + 0.2 * Math.sin(t * 0.6 + i)); });
L.LINKS.forEach(([a, b], j) => {
  let str = th * Math.sqrt(Ls[a] * Ls[b]) * 1.3;
  if (j >= 5) str *= 0.5;
  str *= 0.6 + 0.4 * Math.max(0, Math.min(1, 0.5 + 0.9 * Math.sin(t * 0.047 * (1 + 0.17 * j) + j * 1.9)));
  let warm = 0;
  if (j === 0) { warm = Math.min(1, ro * (1 - an) * Math.min(1, th * 1.6 + 0.4)); str = Math.max(str, warm); }
  str = Math.min(1, str * vis);
  e.layer('l' + j).alpha = str * (1 - warm);
  if (j === 0) e.layer('w0').alpha = warm;
  const A = L.P(a), B = L.P(b), dx = B[0] - A[0], dy = B[1] - A[1], dist = Math.hypot(dx, dy), lift = dist * 0.22 + 0.15, top = Math.min(A[1], B[1]);
  const C1 = [A[0] + dx * 0.2, top - lift + (A[1] - top) * 0.3], C2 = [A[0] + dx * 0.8, top - lift * 0.85 + (B[1] - top) * 0.3];
  const u = (t * 0.018 + j * 0.17) % 1, iu = 1 - u, Pl = e.layer('p' + j);
  Pl.x = iu * iu * iu * A[0] + 3 * iu * iu * u * C1[0] + 3 * iu * u * u * C2[0] + u * u * u * B[0];
  Pl.y = iu * iu * iu * A[1] + 3 * iu * iu * u * C1[1] + 3 * iu * u * u * C2[1] + u * u * u * B[1];
  Pl.alpha = Math.min(1, str * Math.pow(Math.sin(Math.PI * u), 0.7) * (0.5 + 0.5 * Math.sin(t * 1.7 + j)));
});
for (const i of [0, 1]) e.layer('r' + i).alpha = Math.min(1, ro * (1 - an));
