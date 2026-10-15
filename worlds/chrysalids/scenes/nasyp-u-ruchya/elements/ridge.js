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

const sc = e.state.someone_coming ?? 0;
const f = (x) => -(13 + 5 * Math.sin(x / 95 + 0.4) + 2.5 * Math.sin(x / 41 + 1.3) + 1 * Math.sin(x / 13));
g.beginPath();
g.moveTo(-1400, 6);
for (let x = -1400; x <= 1400; x += 6) g.lineTo(x, f(x));
g.lineTo(1400, 6);
g.closePath();
let gr = g.createLinearGradient(0, -20, 0, 5);
gr.addColorStop(0, mix("#8f9a78", "#978a74", ev));
gr.addColorStop(1, mix("#9ea47c", "#a29276", ev));
g.fillStyle = gr;
g.fill();
g.strokeStyle = mix("#e2d9a8", "#eec194", ev);
g.globalAlpha = 0.45;
g.lineWidth = 0.5;
g.beginPath();
for (let x = -1400; x <= 1400; x += 6) {
  x == -1400 ? g.moveTo(x, f(x)) : g.lineTo(x, f(x));
}
g.stroke();
g.globalAlpha = 1;
for (let i = 0; i < 34; i++) {
  const x = -700 + e.rnd() * 1400,
    r = 1.3 + e.rnd() * 2.4;
  g.fillStyle = mix("#76825e", "#7c705c", ev);
  g.beginPath();
  g.ellipse(x, f(x) - r * 0.65, r * 1.25, r, 0, 0, 7);
  g.fill();
}
if (sc > 0.01) {
  const rx = 30 + 2.5 * Math.sin(e.t * 0.03) + sc * 6,
    ry = f(rx) + 0.3,
    k = 3.6,
    st = Math.sin(e.t * 2.0);
  g.globalAlpha = Math.min(1, sc * 1.2);
  const c = mix("#4b4a40", "#4a4038", ev);
  g.fillStyle = c;
  g.strokeStyle = c;
  g.lineCap = "round";
  g.save();
  g.translate(rx, ry);
  g.beginPath();
  g.ellipse(0, -1.15 * k, 0.72 * k, 0.3 * k, 0, 0, 7);
  g.fill();
  g.lineWidth = 0.2 * k;
  g.beginPath();
  g.moveTo(-0.5 * k, -1.0 * k);
  g.lineTo(-0.56 * k + st * 0.07 * k, 0);
  g.moveTo(-0.32 * k, -1.0 * k);
  g.lineTo(-0.28 * k - st * 0.07 * k, 0);
  g.moveTo(0.42 * k, -1.0 * k);
  g.lineTo(0.48 * k - st * 0.07 * k, 0);
  g.moveTo(0.58 * k, -1.0 * k);
  g.lineTo(0.6 * k + st * 0.07 * k, 0);
  g.stroke();
  g.lineWidth = 0.28 * k;
  g.beginPath();
  g.moveTo(0.55 * k, -1.25 * k);
  g.lineTo(0.95 * k, -1.8 * k);
  g.stroke();
  g.beginPath();
  g.ellipse(1.05 * k, -1.78 * k, 0.22 * k, 0.1 * k, 0.5, 0, 7);
  g.fill();
  g.lineWidth = 0.08 * k;
  g.beginPath();
  g.moveTo(-0.7 * k, -1.2 * k);
  g.quadraticCurveTo(-0.95 * k, -0.9 * k, -0.9 * k, -0.6 * k);
  g.stroke();
  g.beginPath();
  g.moveTo(-0.15 * k, -1.38 * k);
  g.lineTo(0.0 * k, -2.25 * k);
  g.lineTo(0.26 * k, -2.2 * k);
  g.lineTo(0.2 * k, -1.38 * k);
  g.fill();
  g.beginPath();
  g.arc(0.13 * k, -2.42 * k, 0.16 * k, 0, 7);
  g.fill();
  g.beginPath();
  g.ellipse(0.13 * k, -2.52 * k, 0.32 * k, 0.06 * k, 0, 0, 7);
  g.fill();
  g.restore();
  g.globalAlpha = 1;
}
