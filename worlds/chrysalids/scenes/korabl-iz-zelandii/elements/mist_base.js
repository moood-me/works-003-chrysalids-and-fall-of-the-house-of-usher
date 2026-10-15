const S = e.state || {};
const sm = S.smoke ?? 0.5;
const a = 0.12 + 0.25 * sm;
const gr = g.createLinearGradient(0, -3, 0, 1.5);
gr.addColorStop(0, "rgba(120,106,120,0)");
gr.addColorStop(0.6, "rgba(120,106,120," + a * 0.6 + ")");
gr.addColorStop(1, "rgba(70,62,76,0)");
g.fillStyle = gr;
g.fillRect(-70, -3, 140, 4.5);
for (let i = 0; i < 6; i++) {
  const y = -0.6 - e.rnd() * 1.4;
  const sp = 0.1 + e.rnd() * 0.12;
  const base = e.rnd() * 140;
  const off = ((((e.t * sp * (i % 2 ? -1 : 1) + base) % 140) + 140) % 140) - 70;
  const rw = 10 + e.rnd() * 12;
  const rg = g.createRadialGradient(off, y, 0, off, y, rw);
  rg.addColorStop(0, "rgba(190,168,176," + 0.2 * sm + ")");
  rg.addColorStop(1, "rgba(190,168,176,0)");
  g.save();
  g.translate(off, y);
  g.scale(1, 0.07);
  g.translate(-off, -y);
  g.fillStyle = rg;
  g.fillRect(off - rw, y - rw, 2 * rw, 2 * rw);
  g.restore();
}
