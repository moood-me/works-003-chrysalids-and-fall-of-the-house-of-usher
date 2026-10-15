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
  if (x <= TOPX)
    return TOPH + 0.05 * Math.sin(x * 1.3 + 1) + 0.03 * Math.sin(x * 3.1) + (x < -6 ? 0.08 * (-6 - x) : 0);
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
// the iris close-up (state closeup 0..1): the freed bare foot on the wet stones — six toes; cu_hide pulls the hem over it, cu_wig moves the toes
const cu = S.closeup ?? 0;
if (cu < 0.002) return;
g.scale(2, 2); // units: screen heights, origin at the frame's centre
const R = 0.46 * (1 - Math.pow(1 - Math.min(1, cu), 2)),
  hide = S.cu_hide ?? 0,
  wig = S.cu_wig ?? 0,
  pull = S.cu_pull ?? 0;
// the dark around the iris
g.fillStyle = "#1d1f18";
g.globalAlpha = Math.min(1, cu * 1.6) * 0.96;
g.beginPath();
g.rect(-1.4, -0.8, 2.8, 1.6);
g.moveTo(R, 0);
g.arc(0, 0, R, 0, Math.PI * 2, true);
g.closePath();
g.fill("evenodd");
let fe = g.createRadialGradient(0, 0, R * 0.82, 0, 0, R * 1.02);
fe.addColorStop(0, "rgba(29,31,24,0)");
fe.addColorStop(1, "rgba(29,31,24,0.9)");
g.globalAlpha = 1;
if (R < 0.003) return;
g.save();
g.beginPath();
g.arc(0, 0, R, 0, 7);
g.clip();
// sand and pebbles, warm in the low sun
let bg = g.createLinearGradient(0, -0.5, 0, 0.5);
bg.addColorStop(0, mix("#c8b78a", "#d2ac7e", ev));
bg.addColorStop(0.55, mix("#a89a72", "#ae9068", ev));
bg.addColorStop(1, mix("#6f7058", "#74624e", ev));
g.fillStyle = bg;
g.fillRect(-0.6, -0.6, 1.2, 1.2);
for (let i = 0; i < 260; i++) {
  const x = -0.55 + e.rnd() * 1.1,
    y = -0.5 + e.rnd() * 0.75,
    r = 0.003 + e.rnd() * 0.009;
  g.fillStyle = e.rnd() < 0.5 ? "#8e8462" : "#e2d6ac";
  g.globalAlpha = 0.55;
  g.beginPath();
  g.ellipse(x, y, r * 1.4, r, e.rnd() * 3, 0, 7);
  g.fill();
}
// the water along the bottom
g.globalAlpha = 1;
let wg = g.createLinearGradient(0, 0.18, 0, 0.5);
wg.addColorStop(0, mix("#5c6a62", "#685a50", ev));
wg.addColorStop(1, mix("#3c463c", "#40382f", ev));
g.fillStyle = wg;
g.beginPath();
g.moveTo(-0.6, 0.24);
for (let x = -0.6; x <= 0.6; x += 0.02) g.lineTo(x, 0.22 + 0.015 * Math.sin(x * 14 + T * 1.2));
g.lineTo(0.6, 0.6);
g.lineTo(-0.6, 0.6);
g.closePath();
g.fill();
g.fillStyle = "#fff3d6";
for (let i = 0; i < 40; i++) {
  const x = -0.5 + e.rnd() * 1.0,
    y = 0.25 + e.rnd() * 0.2,
    a = Math.max(0, Math.sin(T * (1 + e.rnd() * 2) + i));
  g.globalAlpha = a * 0.7;
  g.fillRect(x, y, 0.02 + e.rnd() * 0.04, 0.003);
}
g.globalAlpha = 1;
function stone(x, y, rx, ry) {
  let gr = g.createLinearGradient(0, y - ry, 0, y + ry);
  gr.addColorStop(0, mix("#b6af90", "#c09e7c", ev));
  gr.addColorStop(1, mix("#5d5c4c", "#5e5042", ev));
  g.fillStyle = gr;
  g.beginPath();
  g.ellipse(x, y, rx, ry, 0, 0, 7);
  g.fill();
  g.strokeStyle = mix("#f4ead0", "#f8d6a6", ev);
  g.globalAlpha = 0.7;
  g.lineWidth = 0.006;
  g.beginPath();
  g.ellipse(x, y, rx * 0.97, ry * 0.95, 0, Math.PI * 1.1, Math.PI * 1.8);
  g.stroke();
  g.globalAlpha = 1;
}
stone(-0.3, 0.08, 0.2, 0.14);
stone(0.33, 0.12, 0.25, 0.17);
// the foot: ankle up-left, toes down-right, seen from above
const ang = 0.3,
  L = 0.27,
  ax = -0.3,
  ay = -0.12;
g.save();
g.translate(ax, ay);
g.rotate(ang);
const skin = mix("#c79a76", "#d09670", ev),
  skinD = mix("#9c7558", "#a2704f", ev),
  rim = mix("#f6e2c0", "#fbd2a4", ev),
  line = mix("#6e4c38", "#734a34", ev);
g.fillStyle = "rgba(60,50,30,0.3)";
g.beginPath();
g.ellipse(L * 0.6, 0.09, L * 0.75, 0.07, 0, 0, 7);
g.fill();
const ws = [0.056, 0.04, 0.037, 0.034, 0.031, 0.026],
  ls = [0.085, 0.075, 0.07, 0.064, 0.057, 0.047],
  gap = 0.007;
let tot = 0;
for (const w of ws) tot += w + gap;
tot -= gap;
// the foot itself (sole of the toes under it)
let fg = g.createLinearGradient(0, -0.12, 0, 0.12);
fg.addColorStop(0, skin);
fg.addColorStop(1, skinD);
g.fillStyle = fg;
g.beginPath();
g.moveTo(-0.12, -0.07);
g.quadraticCurveTo(L * 0.5, -0.1, L, -tot / 2 - 0.004);
g.lineTo(L + 0.012, tot / 2 + 0.004);
g.quadraticCurveTo(L * 0.55, 0.12, -0.12, 0.075);
g.closePath();
g.fill();
g.strokeStyle = rim;
g.lineWidth = 0.006;
g.globalAlpha = 0.9;
g.beginPath();
g.moveTo(-0.12, -0.069);
g.quadraticCurveTo(L * 0.5, -0.099, L, -tot / 2 - 0.004);
g.stroke();
g.globalAlpha = 1;
// six toes, each its own, the last a small extra one beside the little toe
let yy = -tot / 2;
for (let i = 0; i < 6; i++) {
  const w = ws[i],
    cy = yy + w / 2,
    cu = wig * Math.max(0, Math.sin(T * 6 + i * 1.1)),
    l = ls[i] * (1 - 0.3 * cu),
    x0 = L - 0.012 - i * 0.004;
  g.fillStyle = skin;
  g.strokeStyle = line;
  g.lineWidth = 0.0035;
  g.beginPath();
  g.moveTo(x0, cy - w / 2);
  g.lineTo(x0 + l - w / 2, cy - w / 2);
  g.arc(x0 + l - w / 2, cy, w / 2, -Math.PI / 2, Math.PI / 2);
  g.lineTo(x0, cy + w / 2);
  g.closePath();
  g.fill();
  g.stroke();
  g.fillStyle = skinD;
  g.globalAlpha = 0.45;
  g.beginPath();
  g.ellipse(x0 + l * 0.55, cy + w * 0.25, l * 0.42, w * 0.18, 0, 0, 7);
  g.fill();
  g.globalAlpha = 1;
  g.fillStyle = mix("#ead2bc", "#efcaa8", ev);
  g.beginPath();
  g.ellipse(x0 + l - w * 0.42, cy - w * 0.03, w * 0.3, w * 0.3, 0, 0, 7);
  g.fill();
  g.strokeStyle = rim;
  g.globalAlpha = 0.8;
  g.lineWidth = 0.003;
  g.beginPath();
  g.arc(x0 + l - w / 2, cy, w / 2 - 0.002, -Math.PI / 2, -0.2);
  g.stroke();
  g.globalAlpha = 1;
  yy += w + gap;
}
// a red scrape where the stones held it
g.strokeStyle = "rgba(165,75,58,0.45)";
g.lineWidth = 0.004;
for (let i = 0; i < 3; i++) {
  g.beginPath();
  g.moveTo(-0.04 + i * 0.012, 0.045 + i * 0.008);
  g.lineTo(0.03 + i * 0.012, 0.04 + i * 0.008);
  g.stroke();
}
// the hem of her dress pulled over it
const hx = lerp(-0.2, L + 0.13, hide);
g.fillStyle = mix("#86473a", "#8b4535", ev);
g.beginPath();
g.moveTo(-0.6, -0.2);
g.lineTo(hx, -0.15);
g.quadraticCurveTo(hx + 0.05, -0.02, hx - 0.02 + 0.01 * Math.sin(T * 3), 0.13);
g.lineTo(-0.6, 0.17);
g.closePath();
g.fill();
g.strokeStyle = mix("#c78a6c", "#d08a62", ev);
g.lineWidth = 0.006;
g.beginPath();
g.moveTo(hx, -0.15);
g.quadraticCurveTo(hx + 0.05, -0.02, hx - 0.02 + 0.01 * Math.sin(T * 3), 0.13);
g.stroke();
// her fingers on the hem
if (hide > 0.02 && hide < 0.98) {
  g.fillStyle = skin;
  for (let i = 0; i < 4; i++) {
    g.beginPath();
    g.ellipse(hx + 0.005, -0.06 + i * 0.03, 0.018, 0.011, 0, 0, 7);
    g.fill();
  }
}
g.restore();
// David's hands with the shoe, drawing back
const dx = 0.32 + pull * 0.2;
g.save();
g.translate(dx, -0.12);
g.rotate(-0.3);
g.fillStyle = mix("#33271f", "#33251d", ev);
g.beginPath();
g.moveTo(-0.11, -0.035);
g.quadraticCurveTo(-0.13, 0.05, -0.03, 0.055);
g.lineTo(0.15, 0.055);
g.quadraticCurveTo(0.17, 0.0, 0.1, -0.02);
g.lineTo(0.0, -0.05);
g.closePath();
g.fill();
g.strokeStyle = mix("#6c5a46", "#6c5440", ev);
g.lineWidth = 0.004;
g.beginPath();
g.moveTo(-0.07, -0.03);
g.lineTo(-0.01, -0.045);
g.stroke();
g.fillStyle = mix("#a5805f", "#ad7c58", ev);
g.beginPath();
g.ellipse(0.12, -0.01, 0.05, 0.035, 0.3, 0, 7);
g.fill();
g.beginPath();
g.ellipse(0.04, 0.06, 0.045, 0.03, -0.2, 0, 7);
g.fill();
g.fillStyle = mix("#56626c", "#5a5a62", ev);
g.fillRect(0.15, -0.06, 0.3, 0.12);
g.restore();
g.restore();
// soft edge of the iris
g.fillStyle = fe;
g.beginPath();
g.arc(0, 0, R * 1.02, 0, 7);
g.fill();
