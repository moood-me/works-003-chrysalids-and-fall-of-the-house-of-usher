const A = e.aspect,
  S = e.state || {};
const d = S.dream ?? 0.7,
  li = S.lights ?? 0.7,
  w = S.waking ?? 0;
const H = 0.6;
const P = (x) => [parseInt(x.slice(1, 3), 16), parseInt(x.slice(3, 5), 16), parseInt(x.slice(5, 7), 16)];
const M = (a, b, t) => {
  const p = P(a),
    q = P(b);
  return "rgb(" + p.map((v, i) => Math.round(v + (q[i] - v) * t)).join(",") + ")";
};
const k = w * 0.75;
const gr = g.createLinearGradient(0, -0.35, 0, H + 0.03);
gr.addColorStop(0, M("#0b0e22", "#06070d", k));
gr.addColorStop(0.35, M("#151a38", "#0a0b14", k));
gr.addColorStop(0.62, M("#2a2d58", "#12131f", k));
gr.addColorStop(0.85, M("#4c4876", "#1c1c2a", k));
gr.addColorStop(1, M("#8a7f9e", "#2a2834", k));
g.fillStyle = gr;
g.fillRect(-0.4, -0.4, A + 0.8, H + 0.45);
const cx = A * 0.665,
  gl = (0.35 + 0.65 * li) * (0.55 + 0.45 * d) * (1 - 0.85 * w);
g.save();
g.translate(cx, H);
g.scale(1, 0.42);
let rg = g.createRadialGradient(0, 0, 0, 0, 0, 0.75);
rg.addColorStop(0, "rgba(240,214,170," + 0.5 * gl + ")");
rg.addColorStop(0.3, "rgba(206,176,172," + 0.2 * gl + ")");
rg.addColorStop(1, "rgba(180,160,200,0)");
g.fillStyle = rg;
g.beginPath();
g.arc(0, 0, 0.75, 0, 7);
g.fill();
g.restore();
g.save();
g.translate(cx, H);
g.scale(1, 0.6);
rg = g.createRadialGradient(0, 0, 0, 0, 0, 1.3);
rg.addColorStop(0, "rgba(150,140,200," + 0.16 * gl + ")");
rg.addColorStop(1, "rgba(150,140,200,0)");
g.fillStyle = rg;
g.beginPath();
g.arc(0, 0, 1.3, 0, 7);
g.fill();
g.restore();
for (let i = 0; i < 110; i++) {
  const x = -0.3 + e.rnd() * (A + 0.6),
    y = -0.3 + Math.pow(e.rnd(), 1.4) * 0.8,
    r = e.rnd(),
    ph = e.rnd() * 6.28;
  const dx = (x - cx) / 0.6,
    dy = (y - H) / 0.3;
  const near = Math.min(1, Math.sqrt(dx * dx + dy * dy));
  const a =
    (0.15 + 0.6 * r * r) *
    near *
    Math.max(0, 1 - (y / H) * 0.6) *
    (0.65 + 0.35 * Math.sin(e.t * (0.3 + r * 0.5) + ph)) *
    (1 - 0.5 * w);
  g.fillStyle = "rgba(226,226,244," + a + ")";
  g.beginPath();
  g.arc(x, y, 0.001 + r * 0.0014, 0, 7);
  g.fill();
}
