// Low clouds over the house: dark masses with a pale underside, a rift of light over the horizon behind the house; two
// layers drifting slowly to the right, the nearer faster — each painted once round its box (its ends meet).
const A = e.aspect, L = e.lib, lt = L.light(e.state || {});
const rn = (i) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const X0 = -0.8, W = A + 1.6, BOX = [X0, -0.4, X0 + W, 0.5];
const dark = (a) => L.tone(lt, "#11161c", "#5f686d", a), pale = (a) => L.tone(lt, "#707c84", "#c3c8c9", a);
function blob(g, cx, cy, rx, ry, col, a) {
  for (const dx of [-W, 0, W]) {
    const rg = g.createRadialGradient(0, 0, 0, 0, 0, 1);
    rg.addColorStop(0, col(a)); rg.addColorStop(0.55, col(a * 0.6)); rg.addColorStop(1, col(0));
    g.save(); g.translate(cx + dx, cy); g.scale(rx, ry); g.fillStyle = rg; g.beginPath(); g.arc(0, 0, 1, 0, 7); g.fill(); g.restore();
  }
}
// the sky's dark at the top
const top = g.createLinearGradient(0, -0.35, 0, 0.3);
top.addColorStop(0, L.tone(lt, "#0a0d11", "#4b5459", 0.75)); top.addColorStop(1, L.tone(lt, "#0a0d11", "#4b5459", 0));
g.fillStyle = top; g.fillRect(-0.4, -0.4, A + 0.8, 0.7);
for (const [name, near] of [["far", false], ["near", true]]) {
  e.layer(name, { box: BOX, drift: [near ? 0.0016 : 0.001, 0] }, (g) => {
    for (let i = 0; i < 70; i++) {
      const r1 = rn(i), r2 = rn(i + 100), r3 = rn(i + 200), r4 = rn(i + 300);
      if (r3 >= 0.5 !== near) continue;
      const y = -0.3 + Math.pow(r2, 1.2) * 0.72, x = X0 + r1 * W;
      const rx = 0.2 + 0.35 * r4, ry = rx * (0.14 + 0.1 * r3);
      // (thinner over the horizon behind the house: the rift)
      const rift = Math.exp(-Math.pow((x - A / 2) / 0.6, 2)) * Math.min(1, Math.max(0, (y - 0.22) / 0.16));
      blob(g, x + 0.02, y + ry * 0.6, rx * 0.85, ry * 0.45, pale, 0.13 * (1 - 0.5 * lt.dark) * (1 - rift));
      blob(g, x, y, rx, ry, dark, (0.4 + 0.3 * r3) * (1 - 0.85 * rift));
    }
  });
}
