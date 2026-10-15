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

const ef = (x) => 0.45 + 0.65 * Math.min(1, Math.max(0, (Math.abs(x - 0.6) - 2.0) / 1.6));
const top = (x) =>
  -(0.4 + 0.09 * Math.sin(x * 0.45 + 0.5) + 0.05 * Math.sin(x * 1.7) + (x < -2.5 ? 0.12 * (-2.5 - x) : 0));
g.beginPath();
g.moveTo(-16, 1.3);
for (let x = -16; x <= 16; x += 0.1) g.lineTo(x, top(x));
g.lineTo(16, 1.3);
g.closePath();
let gr = g.createLinearGradient(0, -0.8, 0, 1.2);
gr.addColorStop(0, mix("#56613f", "#5a5340", ev));
gr.addColorStop(0.5, mix("#3f4931", "#433d30", ev));
gr.addColorStop(1, mix("#2f3726", "#332e25", ev));
g.fillStyle = gr;
g.fill();
const lit = mix("#d6cc88", "#ebbb80", ev),
  d1 = mix("#46512f", "#4a4632", ev),
  d2 = mix("#3a442b", "#3d382b", ev),
  d3 = mix("#5d6a40", "#615a40", ev);
for (let i = 0; i < 1100; i++) {
  const x = -16 + e.rnd() * 32,
    y = top(x) + e.rnd() * 0.25,
    tall = x < -3 ? 1.6 : 1,
    h = (0.1 + e.rnd() * 0.38) * tall * ef(x),
    ph = e.rnd() * 6.28;
  const sw = (0.05 * Math.sin(e.t * 0.7 + ph + x * 0.4) + 0.025 * Math.sin(e.t * 0.27 + ph)) * (h / 0.3),
    lean = (e.rnd() - 0.5) * 0.12;
  const r = e.rnd();
  g.strokeStyle = r < 0.4 ? d1 : r < 0.75 ? d2 : d3;
  g.globalAlpha = 0.95;
  g.lineWidth = 0.008 + e.rnd() * 0.01;
  const ex = x + lean + sw,
    ey = y - h;
  g.beginPath();
  g.moveTo(x, y);
  g.quadraticCurveTo(x + lean * 0.4 + sw * 0.4, y - h * 0.6, ex, ey);
  g.stroke();
  if (e.rnd() < 0.32) {
    g.strokeStyle = lit;
    g.globalAlpha = 0.7;
    g.lineWidth *= 0.7;
    g.beginPath();
    g.moveTo(x + lean * 0.75 + sw * 0.65, y - h * 0.8);
    g.lineTo(ex, ey);
    g.stroke();
  }
}
for (let i = 0; i < 22; i++) {
  const x = -15 + e.rnd() * 30,
    y = top(x) + 0.05,
    h = (0.45 + e.rnd() * 0.5 * (x < -3 ? 1.5 : 1)) * ef(x),
    ph = e.rnd() * 6.28,
    sw = 0.06 * Math.sin(e.t * 0.55 + ph) + 0.03 * Math.sin(e.t * 0.23 + ph);
  g.globalAlpha = 0.95;
  g.strokeStyle = d2;
  g.lineWidth = 0.008;
  g.beginPath();
  g.moveTo(x, y);
  g.quadraticCurveTo(x + sw * 0.3, y - h * 0.6, x + sw, y - h);
  g.stroke();
  g.fillStyle = d1;
  g.beginPath();
  g.ellipse(x + sw, y - h - 0.035, 0.014, 0.045, sw, 0, 7);
  g.fill();
  g.strokeStyle = lit;
  g.globalAlpha = 0.75;
  g.lineWidth = 0.006;
  g.beginPath();
  g.ellipse(x + sw, y - h - 0.035, 0.014, 0.045, sw, Math.PI * 0.9, Math.PI * 1.6);
  g.stroke();
}
for (let i = 0; i < 7; i++) {
  const x = -6.5 + e.rnd() * 3.2,
    y = top(x) + 0.05,
    h = 0.7 + e.rnd() * 0.55,
    ph = e.rnd() * 6.28,
    sw = 0.05 * Math.sin(e.t * 0.5 + ph);
  g.globalAlpha = 0.95;
  g.strokeStyle = d2;
  g.lineWidth = 0.012;
  g.beginPath();
  g.moveTo(x, y);
  g.quadraticCurveTo(x + sw * 0.3, y - h * 0.6, x + sw, y - h);
  g.stroke();
  for (let k = 0; k < 9; k++) {
    const a = -Math.PI * 0.9 + (k * Math.PI * 0.8) / 8,
      rr = 0.09 + e.rnd() * 0.03;
    const ux = x + sw + Math.cos(a) * rr,
      uy = y - h + Math.sin(a) * rr * 0.4 - 0.03;
    g.strokeStyle = d2;
    g.lineWidth = 0.004;
    g.beginPath();
    g.moveTo(x + sw, y - h);
    g.lineTo(ux, uy);
    g.stroke();
    g.fillStyle = mix("#e8dfc2", "#f0d2b0", ev);
    g.globalAlpha = 0.85;
    g.beginPath();
    g.arc(ux, uy, 0.018, 0, 7);
    g.fill();
    g.globalAlpha = 0.95;
  }
}
g.globalAlpha = 1;
