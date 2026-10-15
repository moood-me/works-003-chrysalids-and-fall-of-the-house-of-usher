const S = e.state || {};
const gl = S.glint ?? 0.3;
const ov = S.overgrowth ?? 0.6;
g.fillStyle = "#7e837b";
g.beginPath();
g.ellipse(0, -0.01, 0.075, 0.032, -0.2, Math.PI, 0);
g.fill();
g.fillStyle = "rgba(206,212,200,0.7)";
g.beginPath();
g.ellipse(-0.02, -0.03, 0.03, 0.008, -0.2, 0, 7);
g.fill();
if (gl > 0.01) {
  const p = 0.6 + 0.25 * Math.sin(e.t * 1.3) + 0.15 * Math.sin(e.t * 3.7 + 1);
  const a = gl * p;
  const cx = -0.015,
    cy = -0.03;
  const r = 0.12 + 0.45 * gl;
  const rg = g.createRadialGradient(cx, cy, 0, cx, cy, r);
  rg.addColorStop(0, "rgba(255,248,226," + 0.95 * a + ")");
  rg.addColorStop(0.2, "rgba(255,238,200," + 0.4 * a + ")");
  rg.addColorStop(1, "rgba(255,236,200,0)");
  g.fillStyle = rg;
  g.beginPath();
  g.arc(cx, cy, r, 0, 7);
  g.fill();
  for (let k = 0; k < 4; k++) {
    const an = (k * Math.PI) / 2 + 0.25 + 0.05 * Math.sin(e.t * 0.4);
    const len = (0.1 + 0.45 * gl) * (k % 2 ? 0.6 : 1) * (0.85 + 0.15 * Math.sin(e.t * 2.1 + k));
    g.save();
    g.translate(cx, cy);
    g.rotate(an);
    const lg = g.createLinearGradient(0, 0, len, 0);
    lg.addColorStop(0, "rgba(255,250,232," + 0.8 * a + ")");
    lg.addColorStop(1, "rgba(255,250,232,0)");
    g.fillStyle = lg;
    g.beginPath();
    g.moveTo(0, -0.008);
    g.lineTo(len, 0);
    g.lineTo(0, 0.008);
    g.closePath();
    g.fill();
    g.restore();
  }
  g.fillStyle = "rgba(255,252,240," + Math.min(1, a * 1.4) + ")";
  g.beginPath();
  g.arc(cx, cy, 0.016, 0, 7);
  g.fill();
  e.light(cx, cy, 0.5 + 0.6 * gl, "#fff0cc", 0.6 * a);
}
for (let i = 0; i < 26; i++) {
  const x = -0.3 + e.rnd() * 0.6;
  const y0 = 0.02 + e.rnd() * 0.06;
  const h = (0.08 + 0.22 * ov) * (0.4 + 0.6 * e.rnd());
  const l = (e.rnd() - 0.5) * 0.8 + 0.1 * Math.sin(e.t * 0.45 + i);
  g.fillStyle = e.rnd() < 0.3 ? "#9e976b" : "#6c7752";
  g.beginPath();
  g.moveTo(x - 0.008, y0);
  g.quadraticCurveTo(x + l * h * 0.4, y0 - h * 0.6, x + l * h, y0 - h);
  g.quadraticCurveTo(x + l * h * 0.4 + 0.004, y0 - h * 0.5, x + 0.008, y0);
  g.fill();
}
