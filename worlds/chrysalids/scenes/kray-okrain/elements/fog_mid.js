const S = e.state || {};
const m = S.mist ?? 0.6,
  gl = S.glow ?? 0.6;
const a = 0.06 + 0.36 * m;
let gr = g.createLinearGradient(0, -9, 0, 0);
gr.addColorStop(0, "rgba(56,68,96,0)");
gr.addColorStop(0.7, "rgba(56,68,96," + a * 0.5 + ")");
gr.addColorStop(1, "rgba(66,78,106," + a + ")");
g.fillStyle = gr;
g.fillRect(-100, -9, 200, 9.5);
const gx = 7.5;
let tg = g.createRadialGradient(gx, -1.2, 0, gx, -1.2, 20);
tg.addColorStop(0, "rgba(166,168,104," + 0.16 * gl * (0.4 + m * 0.6) + ")");
tg.addColorStop(1, "rgba(166,168,104,0)");
g.save();
g.translate(gx, -1.2);
g.scale(1, 0.15);
g.translate(-gx, 1.2);
g.fillStyle = tg;
g.fillRect(gx - 20, -22, 40, 40);
g.restore();
for (let i = 0; i < 4; i++) {
  const y = -0.8 - e.rnd() * 3;
  const sp = 0.15 + e.rnd() * 0.2;
  const base = e.rnd() * 200;
  const off = ((((e.t * sp * (i % 2 ? -1 : 1) + base) % 200) + 200) % 200) - 100;
  const rw = 16 + e.rnd() * 18;
  const lg = g.createRadialGradient(off, y, 0, off, y, rw);
  lg.addColorStop(0, "rgba(124,140,174," + 0.16 * m + ")");
  lg.addColorStop(1, "rgba(124,140,174,0)");
  g.save();
  g.translate(off, y);
  g.scale(1, 0.07);
  g.translate(-off, -y);
  g.fillStyle = lg;
  g.fillRect(off - rw, y - rw, rw * 2, rw * 2);
  g.restore();
}
