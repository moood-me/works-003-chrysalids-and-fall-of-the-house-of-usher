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
const ev = 1 - (e.state.sun ?? 1);
const P = {
  L: 1.4,
  W: 2.3,
  cy: 6.0,
  len: 4.8,
  n: 340,
  tw: 0.21,
  rs: 1,
  sw: 0.035,
  c: ["#3b3a2e", "#4b5737", "#5b6942", "#cfc685", "#2f3626"],
};

const W = P.W,
  tw = P.tw;
const tr = mix(P.c[0], "#4e3f34", ev * 0.4),
  lf2 = mix(P.c[1], "#6b5d48", ev * 0.45),
  lf = mix(P.c[2], "#86775a", ev * 0.45),
  lit = mix(P.c[3], "#e6b582", ev);
g.lineCap = "round";
g.globalAlpha = 0.3;
g.fillStyle = P.c[4];
g.beginPath();
g.ellipse(P.L * 0.4 + 0.6, 0.1, W * 1.15, 0.2, 0, 0, 7);
g.fill();
g.globalAlpha = 1;
const tx = P.L,
  ty = -P.cy + 1.0;
g.fillStyle = tr;
g.beginPath();
g.moveTo(-tw * 1.8, 0.03);
g.bezierCurveTo(-tw * 0.8, -P.cy * 0.3, tx - tw * 1.3, ty + P.cy * 0.35, tx - tw * 0.5, ty);
g.lineTo(tx + tw * 0.5, ty);
g.bezierCurveTo(tx + tw * 1.1, ty + P.cy * 0.35, tw * 0.9, -P.cy * 0.3, tw * 1.9, 0.03);
g.closePath();
g.fill();
g.strokeStyle = tr;
g.lineWidth = tw * 0.55;
g.beginPath();
g.moveTo(tx, ty + 0.5);
g.quadraticCurveTo(tx - W * 0.4, ty - 0.5, tx - W * 0.85, ty - 0.3);
g.moveTo(tx, ty + 0.3);
g.quadraticCurveTo(tx + W * 0.4, ty - 0.7, tx + W * 0.9, ty - 0.45);
g.moveTo(tx, ty);
g.lineTo(tx + 0.15, ty - 1.1);
g.stroke();
const cx = tx,
  cyy = -P.cy;
g.fillStyle = lf2;
for (let i = 0; i < 7; i++) {
  const u = (i / 6) * 2 - 1;
  g.globalAlpha = 0.9;
  g.beginPath();
  g.ellipse(cx + u * W * 0.72, cyy - 0.5 + u * u * 0.9, W * 0.4, 0.75, 0, 0, 7);
  g.fill();
}
g.globalAlpha = 0.55;
g.fillStyle = lit;
g.beginPath();
g.ellipse(cx + P.rs * W * 0.5, cyy - 0.9, W * 0.35, 0.35, P.rs * 0.3, 0, 7);
g.fill();
for (let i = 0; i < P.n; i++) {
  const u = e.rnd() * 2 - 1;
  const x0 = cx + u * W,
    y0 = cyy - 1.1 + u * u * 1.4 + e.rnd() * 0.4;
  const len = P.len * (0.55 + 0.45 * e.rnd()) * (1 - 0.28 * Math.abs(u));
  const ph = e.rnd() * 6.28;
  const sw = 0.14 * Math.sin(e.t * 0.45 + ph + x0 * 0.2) + 0.07 * Math.sin(e.t * 0.17 + ph * 1.3);
  const out = u * 0.55;
  const r = e.rnd();
  g.strokeStyle = u * P.rs > 0.2 && r < 0.55 ? lit : r < 0.5 ? lf : lf2;
  g.globalAlpha = 0.6 + e.rnd() * 0.35;
  g.lineWidth = P.sw * (0.7 + e.rnd() * 0.6);
  g.beginPath();
  g.moveTo(x0, y0);
  g.bezierCurveTo(x0 + out, y0 - 0.15, x0 + out * 1.1 + sw * 0.3, y0 + len * 0.35, x0 + out * 0.9 + sw, y0 + len);
  g.stroke();
}
g.globalAlpha = 0.9;
for (let i = 0; i < 60; i++) {
  const x = (e.rnd() * 2 - 1) * tw * 7,
    h = 0.12 + e.rnd() * 0.4 * (1 - Math.abs(x) / (tw * 8)),
    s = 0.04 * Math.sin(e.t * 0.7 + i);
  g.strokeStyle = e.rnd() < 0.3 ? lit : lf2;
  g.lineWidth = 0.02 + e.rnd() * 0.02;
  g.beginPath();
  g.moveTo(x, 0.05);
  g.quadraticCurveTo(x + s * 0.5, -h * 0.5, x + s, -h);
  g.stroke();
}
g.globalAlpha = 1;
