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

const cy = (x) => 0.8 * Math.sin(x / 6 - 0.3) + 0.1 * Math.sin(x / 2.7 + 1);
const hw = (x) => 0.62 + 0.12 * Math.sin(x / 4.3 + 2);
function band(a, b) {
  g.beginPath();
  for (let x = -35; x <= 35; x += 0.25) g.lineTo(x, cy(x) - hw(x) - a);
  for (let x = 35; x >= -35; x -= 0.25) g.lineTo(x, cy(x) + hw(x) + b);
  g.closePath();
}
band(0.5, 0.24);
g.fillStyle = mix("#7f7b5e", "#86755e", ev);
g.fill();
for (let i = 0; i < 900; i++) {
  const x = -34 + e.rnd() * 68,
    far = e.rnd() < 0.55;
  const o = far ? -(hw(x) - 0.05 + e.rnd() * 0.5) : hw(x) - 0.05 + e.rnd() * 0.26;
  const y = cy(x) + o;
  const r = 0.012 + e.rnd() * 0.035;
  const t = e.rnd();
  g.fillStyle = t < 0.4 ? "#cbc29f" : t < 0.75 ? "#9a9275" : "#6c6754";
  g.globalAlpha = 0.85;
  g.beginPath();
  g.ellipse(x, y, r * 1.5, r, e.rnd() * 3, 0, 7);
  g.fill();
  if (t < 0.75) {
    g.globalAlpha = 0.5;
    g.fillStyle = "#ece2c0";
    g.beginPath();
    g.ellipse(x - r * 0.4, y - r * 0.3, r * 0.6, r * 0.35, 0, 0, 7);
    g.fill();
  }
}
g.globalAlpha = 1;
band(0.03, 0.03);
g.fillStyle = "#5d5a49";
g.globalAlpha = 0.6;
g.fill();
g.globalAlpha = 1;
band(0, 0);
let wg = g.createLinearGradient(0, -0.8, 0, 0.9);
wg.addColorStop(0, mix("#36402f", "#3e372d", ev));
wg.addColorStop(0.3, mix("#56635a", "#5f564c", ev));
wg.addColorStop(0.62, mix("#7d8a84", "#957f6e", ev));
wg.addColorStop(1, mix("#4b5446", "#524a3e", ev));
g.fillStyle = wg;
g.fill();
g.save();
band(0, 0);
g.clip();
for (let i = 0; i < 260; i++) {
  const x = -34 + e.rnd() * 68,
    y = cy(x) + (e.rnd() * 1.6 - 0.4) * hw(x);
  g.globalAlpha = 0.18;
  g.fillStyle = e.rnd() < 0.5 ? "#4e5546" : "#a7a88e";
  g.beginPath();
  g.ellipse(x, y, 0.05 + e.rnd() * 0.05, 0.03, 0, 0, 7);
  g.fill();
}
g.globalAlpha = 0.35;
g.fillStyle = mix("#3e4636", "#43392f", ev);
g.beginPath();
for (let x = -35; x <= 35; x += 0.25) g.lineTo(x, cy(x) - hw(x));
for (let x = 35; x >= -35; x -= 0.25)
  g.lineTo(x, cy(x) - hw(x) + 0.12 + 0.06 * Math.sin(x * 3.1) + 0.04 * Math.sin(x * 7.3));
g.closePath();
g.fill();
const sx = -1.4;
let sh = g.createRadialGradient(sx, 0.1, 0, sx, 0.1, 3.2);
sh.addColorStop(0, "rgba(255,238,200,0.55)");
sh.addColorStop(1, "rgba(255,240,205,0)");
g.globalAlpha = 1;
g.fillStyle = sh;
g.fillRect(sx - 4, -1.5, 8, 3);
g.fillStyle = "#fff6dc";
for (let i = 0; i < 260; i++) {
  const near = i < 170;
  const x = near ? sx + (e.rnd() + e.rnd() + e.rnd() - 1.5) * 2.4 : -34 + e.rnd() * 68;
  const y = cy(x) + (e.rnd() * 2 - 1) * hw(x) * 0.85;
  const L = 0.05 + e.rnd() * (near ? 0.28 : 0.14),
    ph = e.rnd() * 6.28,
    sp = 0.5 + e.rnd() * 1.4;
  const a = Math.max(0, Math.sin(e.t * sp + ph) * 0.7 + 0.4 * Math.sin(e.t * sp * 0.41 + ph * 2) - 0.1);
  g.globalAlpha = a * (near ? 0.95 : 0.5);
  const dx = 0.06 * Math.sin(e.t * 0.4 + ph);
  g.fillRect(x + dx - L / 2, y, L, 0.018);
}
g.strokeStyle = "#d8dccb";
g.lineWidth = 0.008;
for (let i = 0; i < 40; i++) {
  const x = ((e.rnd() * 70 + e.t * 0.18 * (0.7 + e.rnd() * 0.6)) % 70) - 35,
    y = cy(x) + (e.rnd() * 2 - 1) * hw(x) * 0.7,
    L = 0.3 + e.rnd() * 0.6;
  g.globalAlpha = 0.18;
  g.beginPath();
  g.moveTo(x, y);
  g.lineTo(x + L, y + 0.01);
  g.stroke();
}
g.restore();
g.globalAlpha = 1;
