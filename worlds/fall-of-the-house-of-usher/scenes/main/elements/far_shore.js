// The far shore behind the house: a low dark bank with dry grass and bare trees (the tarn mirrors it).
const ink = e.lib.paint("#59636a");
const rn = (i) => { const s = Math.sin(i * 91.7 + 17.3) * 43758.5453; return s - Math.floor(s); };
function tree(x, h, sd) {
  let c = 0;
  const R = () => rn(sd + c++);
  function br(px, py, a, len, w, d) {
    if (d == 0) return;
    const x2 = px + Math.cos(a) * len, y2 = py + Math.sin(a) * len;
    g.lineWidth = w;
    g.beginPath(); g.moveTo(px, py); g.lineTo(x2, y2); g.stroke();
    const sp = 0.5 + R() * 0.5;
    br(x2, y2, a - sp * (0.4 + R() * 0.5), len * (0.55 + R() * 0.25), w * 0.6, d - 1);
    if (R() < 0.8) br(x2, y2, a + sp * (0.3 + R() * 0.6), len * (0.5 + R() * 0.3), w * 0.6, d - 1);
  }
  g.lineCap = "round";
  br(x, 0, -Math.PI / 2 + (R() - 0.5) * 0.2, h * 0.4, h * 0.045, 5);
}
g.fillStyle = ink;
g.strokeStyle = ink;
g.beginPath();
g.moveTo(-170, 0.3);
for (let x = -170; x <= 170; x += 2) {
  const h = 0.45 + 0.4 * Math.sin(x * 0.05 + 1) + 0.3 * Math.sin(x * 0.13) + (Math.abs(x) < 32 ? 0.4 : 0);
  g.lineTo(x, -Math.max(0.2, h));
}
g.lineTo(170, 0.3);
g.closePath();
g.fill();
for (let i = 0; i < 180; i++) {
  const x = -160 + rn(i + 500) * 320;
  if (Math.abs(x) < 28) continue;
  const h = 0.2 + Math.pow(rn(i + 900), 2) * 0.9, l = (rn(i + 1300) - 0.5) * 0.8;
  g.lineWidth = 0.12;
  g.beginPath(); g.moveTo(x, 0); g.quadraticCurveTo(x + l * 0.2, -h * 0.6, x + l, -h - 0.3); g.stroke();
}
tree(-41, 7, 10);
tree(-63, 5.2, 40);
tree(47, 6.2, 70);
tree(74, 7.5, 100);
