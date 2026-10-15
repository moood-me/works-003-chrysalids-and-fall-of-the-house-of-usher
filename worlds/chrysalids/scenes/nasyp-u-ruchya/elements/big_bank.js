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
// the big bank, seen across the stream: a grassy top on the left, its steep sandy face sloping down to the right
// (the children's slide), a soft heap of sand at its foot; it is lit from behind, so its face is in soft shade
const dk = mix("#56603b", "#585036", ev),
  mid = mix("#6f7748", "#736846", ev),
  sand = mix("#c2ad7c", "#cba574", ev),
  sandD = mix("#97865f", "#9b7f5a", ev),
  sandL = mix("#ddca98", "#e6bf88", ev),
  lit = mix("#f1e4b2", "#f8ca92", ev);
const top = (x) => -bankH(x);
function outline(x0, x1) {
  g.beginPath();
  g.moveTo(x0, 0.07);
  for (let x = x0; x <= x1; x += 0.04) g.lineTo(x, top(x));
  g.lineTo(x1, 0.07);
  g.closePath();
}
// grassy body under the top
outline(-14, 1.2);
let gr = g.createLinearGradient(0, -2.6, 0, 0.1);
gr.addColorStop(0, mid);
gr.addColorStop(1, dk);
g.fillStyle = gr;
g.fill();
// the sandy face: from just under the lip of the top down to the heap, ragged at its left edge
g.save();
outline(-14, 1.2);
g.clip();
g.beginPath();
g.moveTo(TOPX - 0.35, top(TOPX) + 0.1);
for (let y = top(TOPX) + 0.1; y <= 0.07; y += 0.05) {
  const x = TOPX - 0.35 - 0.9 * ((y - top(TOPX)) / -top(TOPX)) - 0.12 * Math.sin(y * 9) - 0.06 * Math.sin(y * 23);
  g.lineTo(x, y);
}
g.lineTo(1.3, 0.07);
g.lineTo(1.3, -3);
g.lineTo(TOPX - 0.35, -3);
g.closePath();
let sg = g.createLinearGradient(0, -2.4, 0, 0.1);
sg.addColorStop(0, sand);
sg.addColorStop(0.6, sandD);
sg.addColorStop(1, mix("#7f7552", "#82704f", ev));
g.fillStyle = sg;
g.fill();
// light catching the slope's surface, fading down into the face
g.beginPath();
for (let x = TOPX - 0.2; x <= LIP + 0.3; x += 0.04) g.lineTo(x, top(x));
for (let x = LIP + 0.3; x >= TOPX - 0.2; x -= 0.04) g.lineTo(x, top(x) + 0.28);
g.closePath();
let lg = g.createLinearGradient(0, -2.2, 0, 0.4);
lg.addColorStop(0, sandL);
lg.addColorStop(1, sand);
g.globalAlpha = 0.8;
g.fillStyle = lg;
g.fill();
g.globalAlpha = 1;
// streaks of slid sand and two worn grooves along the slope
g.lineCap = "round";
for (let i = 0; i < 40; i++) {
  const x0 = TOPX + e.rnd() * 2.6,
    o = 0.03 + e.rnd() * 0.9,
    L = 0.3 + e.rnd() * 1.1;
  g.strokeStyle = e.rnd() < 0.5 ? sandL : sandD;
  g.globalAlpha = 0.3;
  g.lineWidth = 0.01 + e.rnd() * 0.012;
  g.beginPath();
  for (let x = x0; x < Math.min(LIP + 0.05, x0 + L); x += 0.05)
    g.lineTo(x, top(x) + o * (0.4 + (0.6 * (x - LIP)) / (TOPX - LIP)));
  g.stroke();
}
g.globalAlpha = 0.55;
g.strokeStyle = sandD;
g.lineWidth = 0.02;
for (const o of [0.07, 0.16]) {
  g.beginPath();
  for (let x = TOPX + 0.1; x < LIP; x += 0.05) g.lineTo(x, top(x) + o);
  g.stroke();
}
// tufts of grass clinging to the face, roots, pebbles
g.globalAlpha = 0.9;
for (let i = 0; i < 26; i++) {
  const x = TOPX - 0.8 + e.rnd() * 2.0,
    y = top(x) + 0.25 + e.rnd() * Math.max(0.1, -top(x) - 0.4);
  if (x > LIP - 0.3 && y < top(x) + 0.4) continue;
  g.strokeStyle = e.rnd() < 0.5 ? dk : mid;
  g.lineWidth = 0.012;
  for (let j = 0; j < 5; j++) {
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + (j - 2) * 0.03, y - 0.08 - e.rnd() * 0.08);
    g.stroke();
  }
}
for (let i = 0; i < 30; i++) {
  const x = TOPX - 1 + e.rnd() * 3.6,
    y = top(x) + 0.1 + e.rnd() * Math.max(0.05, -top(x) - 0.1);
  g.fillStyle = e.rnd() < 0.5 ? "#7c6f50" : "#c7b688";
  g.globalAlpha = 0.6;
  g.beginPath();
  g.ellipse(x, y, 0.02 + e.rnd() * 0.025, 0.014, 0, 0, 7);
  g.fill();
}
g.restore();
g.globalAlpha = 1;
// overhang of turf at the lip of the top, with hanging roots
g.fillStyle = mix("#4d5733", "#504a33", ev);
g.beginPath();
g.moveTo(-14, top(-14));
for (let x = -14; x <= TOPX + 0.15; x += 0.05) g.lineTo(x, top(x));
for (let x = TOPX + 0.15; x >= -14; x -= 0.05) g.lineTo(x, top(x) + 0.12 + 0.03 * Math.sin(x * 7));
g.closePath();
g.fill();
g.strokeStyle = mix("#3c3a28", "#3d3226", ev);
g.lineWidth = 0.01;
for (let i = 0; i < 12; i++) {
  const x = TOPX - 1.6 + e.rnd() * 1.7,
    y = top(x) + 0.1,
    L = 0.12 + e.rnd() * 0.3;
  g.beginPath();
  g.moveTo(x, y);
  g.quadraticCurveTo(x + 0.04, y + L * 0.5, x + 0.02, y + L);
  g.stroke();
}
// rim of light along the whole top edge (the sun is behind)
g.strokeStyle = lit;
g.lineWidth = 0.025;
g.globalAlpha = 0.8;
g.beginPath();
for (let x = -14; x <= 1.0; x += 0.04) {
  x === -14 ? g.moveTo(x, top(x)) : g.lineTo(x, top(x));
}
g.stroke();
// the heap of soft sand at the foot
g.globalAlpha = 1;
g.beginPath();
g.moveTo(LIP - 0.1, 0.07);
for (let x = LIP - 0.1; x <= HC + HW + 0.1; x += 0.04) {
  const h = x < LIP + 0.26 ? 0.02 : bankH(x);
  g.lineTo(x, -h - 0.005);
}
g.lineTo(HC + HW + 0.1, 0.07);
g.closePath();
let hg = g.createLinearGradient(0, -0.22, 0, 0.08);
hg.addColorStop(0, lit);
hg.addColorStop(0.3, sandL);
hg.addColorStop(1, sandD);
g.fillStyle = hg;
g.fill();
for (let i = 0; i < 16; i++) {
  const x = HC - HW * 0.8 + e.rnd() * HW * 1.6,
    y = -bankH(x) + 0.03 + e.rnd() * 0.08;
  g.globalAlpha = 0.3;
  g.fillStyle = "#9c8a5e";
  g.beginPath();
  g.ellipse(x, y, 0.05 + e.rnd() * 0.05, 0.01, 0, 0, 7);
  g.fill();
}
// the far bank of the stream going on to the right: a low grassy edge
g.globalAlpha = 1;
g.fillStyle = mix("#5b6640", "#5c5440", ev);
const eg = (x) => -0.04 - 0.03 * Math.sin(x * 1.3) - Math.min(0.07, Math.max(0, (x - 1.9) * 0.1));
g.beginPath();
g.moveTo(1.0, 0.07);
for (let x = 1.0; x <= 13; x += 0.1) g.lineTo(x, eg(x));
g.lineTo(13, 0.07);
g.closePath();
g.fill();
g.strokeStyle = lit;
g.globalAlpha = 0.5;
g.lineWidth = 0.015;
g.beginPath();
for (let x = 1.0; x <= 13; x += 0.1) {
  x === 1.0 ? g.moveTo(x, eg(x)) : g.lineTo(x, eg(x));
}
g.stroke();
g.globalAlpha = 1;
