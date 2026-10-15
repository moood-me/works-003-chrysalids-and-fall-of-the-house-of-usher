const S = e.state || {},
  s = S.season ?? 0,
  r = S.rain ?? 0,
  t = e.t;
const M = (a, b, k) => a.map((v, i) => Math.round(v + (b[i] - v) * k));
const C = (c, a) => "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + (a === undefined ? 1 : a) + ")";
const W = (x) => M(x, [x[0] * 0.72, x[1] * 0.72, x[2] * 0.76], r);
const d = W(M([128, 110, 82], [102, 92, 78], s)),
  dn = W(M([92, 78, 58], [76, 68, 58], s));
let gr = g.createLinearGradient(0, 4, 0, 14);
gr.addColorStop(0, C(d, 0));
gr.addColorStop(1, C(d, 1));
g.fillStyle = gr;
g.fillRect(-60, 4, 120, 10);
gr = g.createLinearGradient(0, 14, 0, 29);
gr.addColorStop(0, C(d));
gr.addColorStop(1, C(dn));
g.fillStyle = gr;
g.fillRect(-60, 14, 120, 16);
for (let i = 0; i < 110; i++) {
  const x = -30 + e.rnd() * 60,
    y = 8 + e.rnd() * 21,
    rr = 0.4 + e.rnd() * 2.2;
  const dark = e.rnd() < 0.6;
  const pg = g.createRadialGradient(x, y, 0, x, y, rr);
  pg.addColorStop(0, dark ? "rgba(56,46,34,0.2)" : "rgba(196,178,140,0.14)");
  pg.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = pg;
  g.save();
  g.translate(x, y);
  g.scale(1.6, 1);
  g.translate(-x, -y);
  g.fillRect(x - rr, y - rr, rr * 2, rr * 2);
  g.restore();
}
const gc = W(M([118, 112, 72], [98, 92, 74], s));
for (let i = 0; i < 26; i++) {
  const x = -24 + e.rnd() * 50,
    y = 12 + e.rnd() * 17,
    rr = 0.8 + e.rnd() * 2.5;
  const pg = g.createRadialGradient(x, y, 0, x, y, rr);
  pg.addColorStop(0, C(gc, 0.35));
  pg.addColorStop(1, C(gc, 0));
  g.fillStyle = pg;
  g.save();
  g.translate(x, y);
  g.scale(1.8, 0.7);
  g.translate(-x, -y);
  g.fillRect(x - rr, y - rr, rr * 2, rr * 2);
  g.restore();
}
const rut = (o, a) => {
  g.strokeStyle = "rgba(54,44,32," + a + ")";
  g.lineWidth = 0.22;
  g.beginPath();
  g.moveTo(60, 7 + o);
  g.bezierCurveTo(20, 7.5 + o, 8, 13 + o, 0, 16 + o);
  g.bezierCurveTo(-4, 17.5 + o, -7, 17.6 + o, -10, 17 + o);
  g.stroke();
};
rut(0, 0.3);
rut(1.5, 0.26);
g.strokeStyle = "rgba(180,162,124,0.2)";
g.lineWidth = 0.4;
g.beginPath();
g.moveTo(60, 7.75);
g.bezierCurveTo(20, 8.25, 8, 13.75, 0, 16.75);
g.bezierCurveTo(-4, 18.2, -7, 18.3, -10, 17.7);
g.stroke();
for (let i = 0; i < 40; i++) {
  const x = -6 + e.rnd() * 12,
    y = 19 + e.rnd() * 6;
  g.fillStyle = "rgba(50,40,30,0.22)";
  g.beginPath();
  g.ellipse(x, y, 0.06, 0.08, e.rnd(), 0, 7);
  g.fill();
}
const st = M([214, 190, 128], [150, 136, 110], s);
for (let i = 0; i < 500; i++) {
  const x = -28 + e.rnd() * 56,
    y = 8 + e.rnd() * 22,
    a = e.rnd() * 3.14,
    l = 0.08 + e.rnd() * 0.22;
  const k = e.rnd(),
    al = 0.3 + 0.3 * e.rnd();
  if (k < s * 0.7) continue;
  g.strokeStyle = C(st, al);
  g.lineWidth = 0.018;
  g.beginPath();
  g.moveTo(x, y);
  g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l * 0.6);
  g.stroke();
}
if (r > 0.02) {
  const sk = M([200, 196, 184], [170, 172, 174], s);
  for (let i = 0; i < 10; i++) {
    const x = -12 + e.rnd() * 30,
      y = 12 + e.rnd() * 16,
      w = 0.8 + e.rnd() * 2.2;
    const pg = g.createRadialGradient(x, y, 0, x, y, w);
    pg.addColorStop(0, C(sk, 0.45 * r));
    pg.addColorStop(0.7, C(sk, 0.3 * r));
    pg.addColorStop(1, C(sk, 0));
    g.fillStyle = pg;
    g.save();
    g.translate(x, y);
    g.scale(1, 0.45);
    g.translate(-x, -y);
    g.fillRect(x - w, y - w, w * 2, w * 2);
    g.restore();
    const rp = (t * 0.6 + i * 0.37) % 1;
    g.strokeStyle = C(sk, 0.5 * r * (1 - rp));
    g.lineWidth = 0.02;
    g.beginPath();
    g.ellipse(x + (e.rnd() - 0.5) * w, y, 0.05 + 0.3 * rp, (0.05 + 0.3 * rp) * 0.4, 0, 0, 7);
    g.stroke();
  }
}
