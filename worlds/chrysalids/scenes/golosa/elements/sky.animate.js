// the clouds drifting round (as many as `clouds`); the aura breathing (as `voices`, while David is here); each thread
// fading in and out on its own, at most four bright at once, its pulse going along it; Petra's bloom, rings and thread
const A = e.aspect, S = e.state, L = e.lib, t = e.t, hz = L.HZ;
const v = S.voices ?? 0.6, n = Math.max(0, Math.min(8, Math.round(S.count ?? 4))), pe = S.petra ?? 0, cl = S.clouds ?? 0.15;
const dp = S.david_present == null ? 1 : +S.david_present;
for (let k = 0; k < 8; k++) {
  const C = e.layer('c' + k), W2 = A + 1.4;
  C.x = ((((k * 0.53 * A + 0.2 + t * 0.004 * (1 + k * 0.27)) % W2) + W2) % W2) - 0.7;
  C.y = ((k * 0.41 + 0.13) % 1) * 0.5;
  C.alpha = Math.max(0, Math.min(1, cl * 8 - k));
}
e.layer('aura').alpha = Math.min(1, dp * v * (0.8 + 0.25 * Math.sin(t * 0.4) + 0.1 * Math.sin(t * 0.93)) * 1.4);
const vis = [];
for (let i = 0; i < n; i++) vis.push(Math.max(0, Math.min(1, (Math.sin(t * 0.045 * (1 + 0.13 * i) + i * 2.39) + 0.35) * 1.4)));
const [AX, AY] = L.AURA(A), wy = hz - 0.008;
for (let i = 0; i < 8; i++) {
  let f = i < n ? vis[i] : 0;
  if (i < n && n > 4) { let rank = 0; for (let j = 0; j < n; j++) if (vis[j] > vis[i] || (vis[j] === vis[i] && j < i)) rank++; if (rank >= 4) f *= 0.12; }
  if (i < n && n <= 4) f = 0.5 + 0.5 * f;
  e.layer('t' + i).alpha = Math.min(1, v * f * 1.6);
  // the pulse: along the same curve as the thread
  const x1 = L.W[L.ORDER[i]] * A, ox = AX - 0.04 + 0.08 * ((i * 0.618 + 0.2) % 1), oy = AY - 0.01 + 0.018 * ((i * 0.383) % 1);
  const o = L.W[L.ORDER[(i + 1) % 8]] * A, x0 = dp > 0.5 ? ox : o, y0 = dp > 0.5 ? oy : wy;
  const c1x = x0 + 0.02 * Math.sin(i * 1.7), c1y = y0 - (0.07 + 0.06 * ((i * 0.71) % 1)), c2x = x1 - (x1 - x0) * 0.25, c2y = Math.min(y0, wy) - (0.15 + 0.15 * ((i * 0.618) % 1));
  const p = ((t * 0.035 + i * 0.29) % 1.4) - 0.2, u = Math.max(0, Math.min(1, p)), iu = 1 - u;
  const P = e.layer('p' + i);
  P.x = iu * iu * iu * x0 + 3 * iu * iu * u * c1x + 3 * iu * u * u * c2x + u * u * u * x1;
  P.y = iu * iu * iu * y0 + 3 * iu * iu * u * c1y + 3 * iu * u * u * c2y + u * u * u * wy;
  P.alpha = p < 0 || p > 1 ? 0 : Math.min(1, v * f * 1.6) * Math.sin(Math.PI * u);
}
e.layer('bloom').alpha = Math.min(1, pe * 1.6);
for (let r = 0; r < 3; r++) {
  const qq = ((t / 9) % 1 + r / 3) % 1, R = e.layer('ring' + r);
  R.scale = (0.03 + qq * 0.42) / 0.45;
  R.alpha = Math.min(1, pe * (1 - qq) * (1 - qq));
}
e.layer('pt').alpha = Math.min(1, pe * 1.4);
e.layer('stars').alpha = 0.85 + 0.15 * Math.sin(t * 0.3);
