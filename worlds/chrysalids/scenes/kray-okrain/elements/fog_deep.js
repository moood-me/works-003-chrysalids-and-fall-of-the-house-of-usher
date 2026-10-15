const S = e.state || {};
const m = S.mist ?? 0.6,
  gl = S.glow ?? 0.6;
const a = 0.08 + 0.36 * m;
let gr = g.createLinearGradient(0, -14, 0, 0);
gr.addColorStop(0, "rgba(52,64,92,0)");
gr.addColorStop(0.6, "rgba(52,64,92," + a * 0.5 + ")");
gr.addColorStop(1, "rgba(60,72,100," + a + ")");
g.fillStyle = gr;
g.fillRect(-160, -14, 320, 14.5);
const gx = 12;
let tg = g.createRadialGradient(gx, -2, 0, gx, -2, 50);
tg.addColorStop(0, "rgba(176,172,104," + 0.38 * gl * (0.5 + m * 0.5) + ")");
tg.addColorStop(1, "rgba(166,168,104,0)");
g.save();
g.translate(gx, -2);
g.scale(1, 0.2);
g.translate(-gx, 2);
g.fillStyle = tg;
g.fillRect(gx - 50, -52, 100, 100);
g.restore();
for (let i = 0; i < 5; i++) {
  const y = -1.5 - e.rnd() * 5;
  const sp = 0.2 + e.rnd() * 0.25;
  const base = e.rnd() * 300;
  const off = ((((e.t * sp * (i % 2 ? 1 : -1) + base) % 320) + 320) % 320) - 160;
  const rw = 30 + e.rnd() * 30;
  const lg = g.createRadialGradient(off, y, 0, off, y, rw);
  lg.addColorStop(0, "rgba(120,136,170," + 0.18 * m + ")");
  lg.addColorStop(1, "rgba(120,136,170,0)");
  g.save();
  g.translate(off, y);
  g.scale(1, 0.08);
  g.translate(-off, -y);
  g.fillStyle = lg;
  g.fillRect(off - rw, y - rw, rw * 2, rw * 2);
  g.restore();
}
