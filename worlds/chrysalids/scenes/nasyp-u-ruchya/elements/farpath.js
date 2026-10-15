function mix(a, b, t) {
  t = Math.max(0, Math.min(1, t));
  const p = parseInt(a.slice(1), 16),
    q = parseInt(b.slice(1), 16);
  return (
    "rgb(" +
    ((((p >> 16) & 255) * (1 - t) + ((q >> 16) & 255) * t) | 0) +
    "," +
    ((((p >> 8) & 255) * (1 - t) + ((q >> 8) & 255) * t) | 0) +
    "," +
    (((p & 255) * (1 - t) + (q & 255) * t) | 0) +
    ")"
  );
}
const S = e.state,
  ev = 1 - (S.sun ?? 1),
  T = e.t;
const lerp = (a, b, t) => a + (b - a) * t,
  clamp = (v, a, b) => Math.max(a, Math.min(b, v));
// the action plane (6 m away): the big bank's profile, metres above the sand, x = metres across
const TOPX = -3.6,
  TOPH = 2.2,
  LIP = -1.2,
  LIPH = 0.48,
  HC = -0.1,
  HW = 0.85;
function bankH(x) {
  if (x <= TOPX) return TOPH + 0.05 * Math.sin(x * 1.3 + 1) + 0.03 * Math.sin(x * 3.1) + (x < -6 ? 0.08 * (-6 - x) : 0);
  if (x <= LIP) {
    const u = (LIP - x) / (LIP - TOPX);
    return LIPH + (TOPH + 0.05 * Math.sin(TOPX * 1.3 + 1) + 0.03 * Math.sin(TOPX * 3.1) - LIPH) * Math.pow(u, 1.3);
  }
  if (x <= LIP + 0.26) {
    const u = (x - LIP) / 0.26;
    return LIPH * (1 - u * u * (3 - 2 * u));
  }
  if (Math.abs(x - HC) < HW) {
    const q = Math.cos((Math.PI * (x - HC)) / (2 * HW));
    return 0.16 * q * q;
  }
  return 0;
}
const SX = 1.3;
// the Wenders' cottage up the meadow, the footpath down from it, and the small figures on it
// (painted on a card 48 m away; a point A metres across, Z metres away lands at A*48/Z, 1.7*48/Z-1.7)
const ZC = 48,
  W = (A, Z) => [(A * ZC) / Z, (1.7 * ZC) / Z - 1.7];
const bz = (a, b, c, d, t) => {
  const u = 1 - t;
  return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d;
};
const P = [
  [5.2, 8.2],
  [10.5, 15],
  [7.5, 30],
  [14.3, 47.6],
];
const at = (s) => [bz(P[0][0], P[1][0], P[2][0], P[3][0], s), bz(P[0][1], P[1][1], P[2][1], P[3][1], s)];
// the path: a worn pale strip
g.fillStyle = mix("#b9b487", "#c0a682", ev);
g.globalAlpha = 0.55;
g.beginPath();
for (let i = 0; i <= 60; i++) {
  const [A, Z] = at(i / 60);
  const q = W(A - 0.35, Z);
  i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]);
}
for (let i = 60; i >= 0; i--) {
  const [A, Z] = at(i / 60);
  const q = W(A + 0.35, Z);
  g.lineTo(q[0], q[1]);
}
g.closePath();
g.fill();
g.globalAlpha = 1;
// the cottage (its door faces the path)
const ck = W(14.6, 48);
g.save();
g.translate(ck[0], ck[1]);
const wall = mix("#b8b49a", "#c6aa8c", ev),
  shade = mix("#8e8c76", "#957e68", ev),
  roof = mix("#5a5446", "#5a4a3c", ev);
g.fillStyle = mix("#3c4430", "#3f3a2c", ev);
g.globalAlpha = 0.5;
g.beginPath();
g.ellipse(0, 0.05, 4.4, 0.3, 0, 0, 7);
g.fill();
g.globalAlpha = 1;
g.fillStyle = wall;
g.fillRect(-3, -2.6, 4.4, 2.6);
g.fillStyle = shade;
g.fillRect(1.4, -2.6, 1.8, 2.6);
g.fillStyle = roof;
g.beginPath();
g.moveTo(-3.4, -2.5);
g.lineTo(-1.6, -4.6);
g.lineTo(2.0, -4.6);
g.lineTo(3.6, -2.5);
g.closePath();
g.fill();
g.fillStyle = mix("#6b6656", "#6a5848", ev);
g.fillRect(1.2, -5.4, 0.6, 1.2);
g.fillStyle = mix("#3d3a32", "#3c332a", ev);
g.fillRect(-2.3, -1.9, 0.8, 0.7);
g.fillRect(0.2, -1.9, 0.8, 0.7);
// door: opens (state door 0..1) to the dark inside
const dor = S.door ?? 0;
g.fillStyle = mix("#2a2622", "#29221c", ev);
g.fillRect(-1.0, -1.9, 0.9, 1.9);
g.fillStyle = mix("#6d5a44", "#6f5540", ev);
g.fillRect(-1.0, -1.9, 0.9 * (1 - dor * 0.85), 1.9);
// smoke from the chimney
for (let i = 0; i < 9; i++) {
  const t = (T * 0.12 + i / 9) % 1,
    x = 1.5 + t * 3 + 0.6 * Math.sin(T * 0.3 + i),
    y = -5.6 - t * 7,
    r = 0.4 + t * 1.6;
  g.globalAlpha = 0.16 * (1 - t);
  g.fillStyle = "#e8e2cc";
  g.beginPath();
  g.ellipse(x, y, r * 1.3, r, 0, 0, 7);
  g.fill();
}
g.globalAlpha = 1;
g.restore();
