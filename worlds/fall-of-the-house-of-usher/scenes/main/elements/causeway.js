// The causeway: an old stone path across the tarn from the near shore (bottom left) to the door — lib.causeway(d), its
// middle at a distance. A plane people walk on, seen from above: x across less its own across (−3), y toward the eye
// (42 − the distance).
const L = e.lib, lt = L.light(e.state || {});
const rn = (i) => { const s = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return s - Math.floor(s); };
const P = (y) => L.causeway(42 - y) + 3;
const hw = (y) => 1.15 + 0.07 * Math.sin(y * 1.7) + 0.05 * Math.sin(y * 4.1);
// its wet edge, darker, where the stones go into the water
g.fillStyle = L.tone(lt, "#161c21", "#2d3438");
g.beginPath();
for (let y = -38; y <= 39; y += 0.5) g.lineTo(P(y) - hw(y) - 0.35, y);
for (let y = 39; y >= -38; y -= 0.5) g.lineTo(P(y) + hw(y) + 0.35, y);
g.closePath(); g.fill();
const pg = g.createLinearGradient(0, -38, 0, 39);
pg.addColorStop(0, L.tone(lt, "#59636c", "#7d868b"));
pg.addColorStop(0.5, L.tone(lt, "#4a545c", "#6c7479"));
pg.addColorStop(1, L.tone(lt, "#2e363d", "#4b5257"));
g.fillStyle = pg;
g.beginPath();
for (let y = -38; y <= 39; y += 0.5) g.lineTo(P(y) - hw(y), y);
for (let y = 39; y >= -38; y -= 0.5) g.lineTo(P(y) + hw(y), y);
g.closePath(); g.fill();
// the stones
for (let i = 0; i < 260; i++) {
  const y = -38 + rn(i + 2000) * 77, x = P(y) + (rn(i + 2400) - 0.5) * 2 * hw(y), r = 0.1 + rn(i + 2800) * 0.25;
  g.fillStyle = rn(i + 3200) < 0.7 ? "rgba(18,24,28,0.3)" : "rgba(150,160,168,0.1)";
  g.beginPath(); g.ellipse(x, y, r, r * 0.6, 0, 0, 7); g.fill();
}
