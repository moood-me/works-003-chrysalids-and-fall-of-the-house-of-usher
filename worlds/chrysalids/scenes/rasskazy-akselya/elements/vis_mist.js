const S = e.state || {};
const A = e.aspect;
const t = e.t;
const st = Math.max(0, Math.min(1, S.story ?? 0.7));
const dw = S.dawn ?? 0;
const lerp = (a, b, k) => a + (b - a) * k;
const mc = [Math.round(lerp(70, 170, dw)), Math.round(lerp(82, 146, dw)), Math.round(lerp(116, 156, dw))].join(",");
const mc2 = [Math.round(lerp(56, 176, dw)), Math.round(lerp(68, 148, dw)), Math.round(lerp(100, 150, dw))].join(",");
const k0 = 0.3 + 0.7 * st;
for (let i = 0; i < 12; i++) {
  const bx = A * (0.38 + e.rnd() * 0.65),
    by = 0.2 + e.rnd() * 0.4,
    r = 0.1 + e.rnd() * 0.22,
    sp2 = 0.004 + e.rnd() * 0.006;
  const x = bx + Math.sin(t * sp2 + i) * 0.08;
  g.save();
  g.translate(x, by);
  g.rotate(-0.15 + e.rnd() * 0.3);
  g.scale(1, 0.16);
  const rg = g.createRadialGradient(0, 0, 0, 0, 0, r);
  rg.addColorStop(0, "rgba(" + mc + "," + 0.2 * k0 + ")");
  rg.addColorStop(1, "rgba(" + mc + ",0)");
  g.fillStyle = rg;
  g.fillRect(-r, -r, 2 * r, 2 * r);
  g.restore();
}
for (let i = 0; i < 8; i++) {
  const bx = A * (0.42 + e.rnd() * 0.6),
    by = 0.52 + e.rnd() * 0.08,
    r = 0.14 + e.rnd() * 0.2,
    sp2 = 0.004 + e.rnd() * 0.006;
  const x = bx + Math.sin(t * sp2 + i) * 0.08;
  g.save();
  g.translate(x, by);
  g.scale(1, 0.16);
  const rg = g.createRadialGradient(0, 0, 0, 0, 0, r);
  rg.addColorStop(0, "rgba(" + mc2 + "," + 0.4 * k0 + ")");
  rg.addColorStop(1, "rgba(" + mc2 + ",0)");
  g.fillStyle = rg;
  g.fillRect(-r, -r, 2 * r, 2 * r);
  g.restore();
}
