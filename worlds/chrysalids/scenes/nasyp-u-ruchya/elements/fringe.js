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
// tall grass on the plateau (in front of whoever stands or hides there) and at the edges
const d1 = mix("#4e5833", "#524c34", ev),
  d2 = mix("#65703f", "#6a6040", ev),
  lit = mix("#e9dca2", "#f2c288", ev);
g.lineCap = "round";
for (let i = 0; i < 560; i++) {
  const x = -12 + e.rnd() * (8.05 + TOPX + 4.1),
    y = -bankH(x) + 0.04,
    far = x > TOPX - 0.25 ? 0.45 : 1,
    h = (0.35 + e.rnd() * 0.6) * far,
    ph = e.rnd() * 6.28;
  const sw = (0.06 * Math.sin(T * 0.8 + ph + x * 0.5) + 0.03 * Math.sin(T * 0.31 + ph)) * (h / 0.5),
    lean = (e.rnd() - 0.35) * 0.18;
  const r = e.rnd();
  g.strokeStyle = r < 0.5 ? d1 : d2;
  g.globalAlpha = 0.95;
  g.lineWidth = 0.008 + e.rnd() * 0.012;
  g.beginPath();
  g.moveTo(x, y);
  g.quadraticCurveTo(x + lean * 0.4, y - h * 0.6, x + lean + sw, y - h);
  g.stroke();
  if (e.rnd() < 0.4) {
    g.strokeStyle = lit;
    g.globalAlpha = 0.8;
    g.lineWidth *= 0.6;
    g.beginPath();
    g.moveTo(x + lean * 0.6 + sw * 0.5, y - h * 0.75);
    g.lineTo(x + lean + sw, y - h);
    g.stroke();
  }
}
// seed heads
for (let i = 0; i < 40; i++) {
  const x = -11.5 + e.rnd() * (7.2 + TOPX + 4.1 - 0.4),
    y = -bankH(x) + 0.04,
    h = 0.55 + e.rnd() * 0.4,
    ph = e.rnd() * 6.28,
    sw = 0.07 * Math.sin(T * 0.7 + ph) + 0.03 * Math.sin(T * 0.29 + ph);
  g.globalAlpha = 0.95;
  g.strokeStyle = d1;
  g.lineWidth = 0.008;
  g.beginPath();
  g.moveTo(x, y);
  g.quadraticCurveTo(x + sw * 0.3, y - h * 0.6, x + sw, y - h);
  g.stroke();
  g.fillStyle = lit;
  g.globalAlpha = 0.8;
  g.beginPath();
  g.ellipse(x + sw, y - h - 0.04, 0.016, 0.05, sw, 0, 7);
  g.fill();
}
// a dense clump where someone can hide
for (let i = 0; i < 260; i++) {
  const x = TOPX - 1.15 + e.rnd() * 0.8,
    y = -bankH(x) + 0.04,
    h = 0.45 + e.rnd() * 0.35,
    ph = e.rnd() * 6.28,
    sw = (0.06 * Math.sin(T * 0.8 + ph + x * 0.5) + 0.03 * Math.sin(T * 0.31 + ph)) * (h / 0.5),
    lean = (e.rnd() - 0.4) * 0.25;
  g.strokeStyle = e.rnd() < 0.5 ? d1 : d2;
  g.globalAlpha = 0.97;
  g.lineWidth = 0.012 + e.rnd() * 0.014;
  g.beginPath();
  g.moveTo(x, y);
  g.quadraticCurveTo(x + lean * 0.4, y - h * 0.6, x + lean + sw, y - h);
  g.stroke();
  if (e.rnd() < 0.35) {
    g.strokeStyle = lit;
    g.globalAlpha = 0.8;
    g.lineWidth *= 0.6;
    g.beginPath();
    g.moveTo(x + lean * 0.6 + sw * 0.5, y - h * 0.75);
    g.lineTo(x + lean + sw, y - h);
    g.stroke();
  }
}
g.globalAlpha = 1;
