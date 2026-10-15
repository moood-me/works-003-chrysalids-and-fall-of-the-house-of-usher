const S = e.state || {};
const w = S.waking ?? 0;
if (w < 0.004) return;
const ww = w * w * (3 - 2 * w);
const Hm = 4.26,
  cy = -0.5 * Hm;
g.save();
g.translate(0, cy);
g.scale(1.35, 1);
const rg = g.createRadialGradient(0, 0, Hm * (0.62 - 0.4 * ww), 0, 0, Hm * (1.0 - 0.3 * ww));
rg.addColorStop(0, "rgba(10,10,18,0)");
rg.addColorStop(1, "rgba(10,10,18," + 0.92 * ww + ")");
g.fillStyle = rg;
g.fillRect(-5, -3, 10, 6);
g.restore();
g.fillStyle = "rgba(10,10,18," + 0.35 * ww + ")";
g.fillRect(-7, -5, 14, 5.6);
const wood = (a) => "rgba(30,24,30," + a + ")";
const wob = 0.04 * Math.sin(e.t * 0.2);
function post(s) {
  const inner = s * (3.9 - 1.55 * ww + wob);
  const outer = s * 6.5;
  const soft = 0.35;
  const lg = g.createLinearGradient(inner, 0, inner + s * soft, 0);
  lg.addColorStop(0, wood(0));
  lg.addColorStop(1, wood(0.97 * ww));
  g.fillStyle = lg;
  g.fillRect(Math.min(inner, inner + s * soft), -5, soft, 5.6);
  g.fillStyle = wood(0.97 * ww);
  g.fillRect(Math.min(inner + s * soft, outer), -5, Math.abs(outer - inner - s * soft), 5.6);
  g.strokeStyle = "rgba(74,60,56," + 0.18 * ww + ")";
  g.lineWidth = 0.012;
  for (let i = 0; i < 4; i++) {
    const x = inner + s * (soft + 0.12 + i * 0.18);
    g.beginPath();
    g.moveTo(x, -5);
    for (let y = -5; y <= 0.6; y += 0.25) g.lineTo(x + 0.015 * Math.sin(y * 3 + i * 2), y);
    g.stroke();
  }
}
post(-1);
post(1);
const bt = -Hm - 0.2,
  bb = -Hm + 0.12 + 0.75 * ww;
const tg = g.createLinearGradient(0, bb - 0.3, 0, bb);
tg.addColorStop(0, wood(0.97 * ww));
tg.addColorStop(1, wood(0));
g.fillStyle = wood(0.97 * ww);
g.fillRect(-7, bt - 1, 14, bb - 0.3 - bt + 1);
g.fillStyle = tg;
g.fillRect(-7, bb - 0.3, 14, 0.3);
g.strokeStyle = "rgba(78,62,56," + 0.2 * ww + ")";
g.lineWidth = 0.014;
for (let i = 0; i < 4; i++) {
  const y = bt + 0.25 + i * 0.16 * ww;
  g.beginPath();
  g.moveTo(-7, y);
  for (let x = -7; x <= 7; x += 0.3) g.lineTo(x, y + 0.02 * Math.sin(x * 1.3 + i * 2));
  g.stroke();
}
const sb = -0.15 - 0.45 * ww;
const sg = g.createLinearGradient(0, sb, 0, sb + 0.25);
sg.addColorStop(0, wood(0));
sg.addColorStop(1, wood(0.97 * ww));
g.fillStyle = sg;
g.fillRect(-7, sb, 14, 0.25);
g.fillStyle = wood(0.97 * ww);
g.fillRect(-7, sb + 0.25, 14, 1);
const m = Math.max(0, (ww - 0.4) / 0.6);
if (m > 0) {
  const mw = 0.07;
  const lg = g.createLinearGradient(-mw * 2, 0, mw * 2, 0);
  lg.addColorStop(0, wood(0));
  lg.addColorStop(0.35, wood(0.92 * m));
  lg.addColorStop(0.65, wood(0.92 * m));
  lg.addColorStop(1, wood(0));
  g.fillStyle = lg;
  g.fillRect(-mw * 2, -5, mw * 4, 5.6);
  const my = -0.52 * Hm;
  const lh = g.createLinearGradient(0, my - mw * 2, 0, my + mw * 2);
  lh.addColorStop(0, wood(0));
  lh.addColorStop(0.35, wood(0.92 * m));
  lh.addColorStop(0.65, wood(0.92 * m));
  lh.addColorStop(1, wood(0));
  g.fillStyle = lh;
  g.fillRect(-7, my - mw * 2, 14, mw * 4);
}
const cg = g.createLinearGradient(-2.5, 0, 2.5, 0);
cg.addColorStop(0, "rgba(150,150,190,0)");
cg.addColorStop(0.5, "rgba(150,150,190," + 0.05 * ww + ")");
cg.addColorStop(1, "rgba(150,150,190,0)");
g.fillStyle = cg;
g.fillRect(-2.5, bb, 5, sb - bb);
