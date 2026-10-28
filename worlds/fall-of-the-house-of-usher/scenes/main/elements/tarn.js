// The black tarn (a plane: it mirrors the house, the sky, the far shore, the trees and whoever is on the causeway):
// still water, darkest near, a little paler toward the far shore as it takes the sky; faint breaks of light in it.
// Seen from above: x across, y toward the eye (its far edge y −46 at 95 m, its near y +46 at 3 m).
const L = e.lib;
const rn = (i) => { const s = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return s - Math.floor(s); };
const gr = g.createLinearGradient(0, -46, 0, 46);
gr.addColorStop(0, L.paint("#5b666a"));
gr.addColorStop(0.35, L.paint("#323d41"));
gr.addColorStop(1, L.paint("#1b2427"));
g.fillStyle = gr;
g.fillRect(-100, -46, 200, 92);
for (let i = 0; i < 360; i++) {
  const y = -42 + Math.pow(rn(i), 0.75) * 84, near = (y + 42) / 84;
  const len = 0.5 + near * 2.4 + rn(i + 400) * 1.6, x = -70 + rn(i + 800) * 140;
  g.fillStyle = L.paint("#c2ccd0", (0.025 + 0.05 * rn(i + 1200)) * 1.6);
  g.fillRect(x - len / 2, y, len, 0.03 + 0.05 * near);
}
// where the water is pressed (a game offering it): open water left of the causeway, well this side of the house
e.at(-8, 10);
