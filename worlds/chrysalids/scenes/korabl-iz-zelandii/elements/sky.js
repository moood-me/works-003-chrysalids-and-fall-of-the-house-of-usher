const A = e.aspect,
  S = e.state || {};
const d = S.dawn ?? 0.6;
function m(a, b, t) {
  const p = (x) => [parseInt(x.slice(1, 3), 16), parseInt(x.slice(3, 5), 16), parseInt(x.slice(5, 7), 16)];
  const A1 = p(a),
    B1 = p(b);
  return "rgb(" + A1.map((v, i) => Math.round(v + (B1[i] - v) * t)).join(",") + ")";
}
const gr = g.createLinearGradient(0, -0.35, 0, 1.25);
gr.addColorStop(0, m("#1e2232", "#4a4a5e", d));
gr.addColorStop(0.3, m("#2e3246", "#6e6778", d));
gr.addColorStop(0.5, m("#454658", "#a0909a", d));
gr.addColorStop(0.6, m("#5c5a6a", "#cdaeaa", d));
gr.addColorStop(0.75, m("#3a3a4a", "#7a6e78", d));
gr.addColorStop(1, m("#222432", "#3e3846", d));
g.fillStyle = gr;
g.fillRect(-0.4, -0.4, A + 0.8, 1.7);
const sx = A * 0.16,
  sy = 0.6;
g.save();
g.translate(sx, sy);
g.scale(1, 0.32);
const sg = g.createRadialGradient(0, 0, 0, 0, 0, 0.9);
sg.addColorStop(0, "rgba(236,190,176," + 0.55 * d + ")");
sg.addColorStop(0.35, "rgba(214,170,166," + 0.22 * d + ")");
sg.addColorStop(1, "rgba(200,160,160,0)");
g.fillStyle = sg;
g.beginPath();
g.arc(0, 0, 0.9, 0, 7);
g.fill();
g.restore();
for (let i = 0; i < 40; i++) {
  const x = -0.3 + e.rnd() * (A + 0.6),
    y = -0.3 + e.rnd() * 0.45,
    r = e.rnd();
  g.globalAlpha = (1 - d) * 0.5 * r * (0.6 + 0.4 * Math.sin(e.t * 0.4 + i));
  g.fillStyle = "#d8dcea";
  g.fillRect(x, y, 0.0018, 0.0018);
}
g.globalAlpha = 1;
