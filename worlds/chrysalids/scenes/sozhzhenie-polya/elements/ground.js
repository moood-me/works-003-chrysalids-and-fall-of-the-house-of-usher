const { mixc, rgba, X0 } = e.lib;
const { DAWN, FIRE, IGN, ASH, FL, litAt, burntAt } = e.lib.now(e);
// plane, seen from above: x = across, y = toward the viewer; centre at distance 100 -> a point at distance d is y = 100-d
const Y = (d) => 400 - d;
g.fillStyle = mixc("#141012", "#3a3533", DAWN);
g.fillRect(-800, -400, 1600, 800);
// the true field, left of the track: pale even stubble ground under the standing wheat
g.fillStyle = mixc("#1c1814", "#4a4234", DAWN);
g.fillRect(-800, Y(790), 797, Y(9.6) - Y(790));
// the offending field, right of the track
g.fillStyle = mixc("#1c1814", "#4a4234", DAWN);
g.fillRect(-2.9, Y(790), 803, Y(30) - Y(790));
g.fillStyle = mixc("#1a1513", "#463c30", DAWN);
g.fillRect(-2.9, Y(30), 33, Y(9.4) - Y(30));
// the track between them, toward the village
g.fillStyle = mixc("#211c1a", "#5e5650", DAWN);
g.fillRect(-3.9, Y(790), 1.0, 780);
g.fillStyle = mixc("#1c1817", "#4c4642", DAWN);
g.fillRect(-4.6, Y(9.6), 2.0, Y(-1) - Y(9.6));
// trampled ground where the congregation stands
{
  const rg = g.createRadialGradient(0, Y(6), 0, 0, Y(6), 7);
  rg.addColorStop(0, rgba(DAWN > 0.4 ? "#4a4440" : "#1e1a1a", 0.6));
  rg.addColorStop(1, "rgba(20,16,16,0)");
  g.fillStyle = rg;
  g.fillRect(-10, Y(14), 20, 12);
}
// what the fire has done: a diamond of ash spreading from the ignition point
g.save();
g.beginPath();
g.rect(-2.95, Y(30.5), 33, Y(9.35) - Y(30.5));
g.clip();
const R1 = IGN * 50,
  R2 = ASH * 60;
// burning band: glowing
if (R1 > 0.2) {
  const ga = FIRE * (1 - 0.7 * ASH);
  g.fillStyle = "rgba(120,48,28," + 0.85 * ga + ")";
  g.beginPath();
  g.moveTo(X0 - R1, Y(9.4));
  g.lineTo(X0 + R1, Y(9.4));
  g.lineTo(X0, Y(9.4 + R1 / 0.9));
  g.closePath();
  g.fill();
}
if (R2 > 0.2) {
  g.fillStyle = mixc("#0e0b0b", "#2a2626", DAWN);
  g.beginPath();
  g.moveTo(X0 - R2, Y(9.4));
  g.lineTo(X0 + R2, Y(9.4));
  g.lineTo(X0, Y(9.4 + R2 / 0.9));
  g.closePath();
  g.fill();
  // ember specks in the fresh ash
  for (let i = 0; i < 500; i++) {
    const x = e.rnd() * 60 - 10,
      d = 9.6 + e.rnd() * 45;
    const b = burntAt(x, d),
      l = litAt(x, d);
    if (b < 0.05) continue;
    const glow = (1 - b * 0.7) * (1 - ASH * 0.8);
    g.fillStyle = "rgba(214,104,52," + 0.7 * glow + ")";
    g.fillRect(x, Y(d), 0.12, 0.06);
  }
}
g.restore();
// warm light of the fire on the ground in front of it
{
  const a = 0.35 * FL;
  const rg = g.createRadialGradient(X0 + 3, Y(9.5), 0, X0 + 3, Y(9.5), 12);
  rg.addColorStop(0, "rgba(200,100,50," + a + ")");
  rg.addColorStop(1, "rgba(120,60,40,0)");
  g.fillStyle = rg;
  g.fillRect(-14, Y(24), 34, 24);
}
// furrow lines across the field
g.strokeStyle = "rgba(0,0,0,0.1)";
g.lineWidth = 0.05;
for (let d = 9.6; d < 70; d += 0.6 + d * 0.02) {
  g.beginPath();
  g.moveTo(-60, Y(d));
  g.lineTo(-4, Y(d));
  g.moveTo(-2.9, Y(d));
  g.lineTo(60, Y(d));
  g.stroke();
}
