const S = e.state || {};
const f = S.fire ?? 0.8;
const t = e.t;
for (let i = 0; i < 20; i++) {
  const sp = 0.025 + e.rnd() * 0.018,
    ph = e.rnd();
  const life = (t * sp + ph) % 1;
  const y = -1.2 - life * 10;
  const x = Math.sin(life * 3 + i) * 0.3 + life * life * 4.5 + Math.sin(t * 0.13 + i) * 0.3;
  const r = 0.25 + life * 1.9;
  const a = (0.08 + 0.12 * f) * Math.sin(Math.PI * Math.min(1, life * 1.15));
  const wm = Math.max(0, 1 - life * 2.2);
  const cr = Math.round(96 + 80 * wm * f),
    cg = Math.round(100 + 34 * wm * f),
    cb = Math.round(116 - 14 * wm);
  const sg = g.createRadialGradient(x, y, 0, x, y, r);
  sg.addColorStop(0, "rgba(" + cr + "," + cg + "," + cb + "," + a + ")");
  sg.addColorStop(0.6, "rgba(" + cr + "," + cg + "," + cb + "," + a * 0.4 + ")");
  sg.addColorStop(1, "rgba(" + cr + "," + cg + "," + cb + ",0)");
  g.fillStyle = sg;
  g.beginPath();
  g.arc(x, y, r, 0, 7);
  g.fill();
}
