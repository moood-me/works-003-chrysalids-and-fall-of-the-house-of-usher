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
// the stones at the edge of the stream where the foot gets caught
const sd = mix("#6d6a58", "#6e5f4e", ev),
  sl = mix("#a7a284", "#b09678", ev),
  lit = mix("#efe4bb", "#f5cd98", ev),
  wet = mix("#4f5546", "#51493c", ev);
function stone(x, y, rx, ry, a) {
  g.save();
  g.translate(x, y);
  g.rotate(a);
  g.fillStyle = wet;
  g.beginPath();
  g.ellipse(0, ry * 0.15, rx * 1.02, ry * 0.95, 0, 0, 7);
  g.fill();
  let gr = g.createLinearGradient(0, -ry, 0, ry);
  gr.addColorStop(0, sl);
  gr.addColorStop(1, sd);
  g.fillStyle = gr;
  g.beginPath();
  g.ellipse(0, 0, rx, ry, 0, 0, 7);
  g.fill();
  g.strokeStyle = lit;
  g.globalAlpha = 0.8;
  g.lineWidth = 0.012;
  g.beginPath();
  g.ellipse(0, 0, rx * 0.97, ry * 0.95, 0, Math.PI * 1.1, Math.PI * 1.75);
  g.stroke();
  g.globalAlpha = 1;
  g.restore();
}
for (let i = 0; i < 18; i++) {
  const x = 0.9 + e.rnd() * 1.6,
    y = -0.01 + e.rnd() * 0.07,
    r = 0.02 + e.rnd() * 0.04;
  g.fillStyle = e.rnd() < 0.5 ? sd : sl;
  g.beginPath();
  g.ellipse(x, y, r * 1.4, r, 0, 0, 7);
  g.fill();
}
stone(SX - 0.17, -0.035, 0.15, 0.1, 0.15); // left stone, behind the ankle
stone(SX + 0.2, -0.05, 0.19, 0.13, -0.1); // the big one
stone(SX + 0.02, 0.02, 0.11, 0.07, 0.05); // the low one in front of the foot
// water lapping at their feet
g.strokeStyle = "#e9ecd8";
g.lineWidth = 0.008;
for (let i = 0; i < 6; i++) {
  const x = SX - 0.4 + i * 0.16,
    a = 0.25 + 0.25 * Math.sin(T * 1.7 + i * 2);
  g.globalAlpha = a;
  g.beginPath();
  g.moveTo(x, 0.075);
  g.lineTo(x + 0.1 + 0.03 * Math.sin(T + i), 0.078);
  g.stroke();
}
g.globalAlpha = 1;
