// Sedge at the water's edge, right of the causeway's start: tufts in groups, each group a layer the wind bends.
const rn = (i) => { const s = Math.sin(i * 63.7 + 1.3) * 43758.5453; return s - Math.floor(s); };
const col = e.lib.paint("#1f2528");
const groups = new Map();
for (let i = 0; i < 60; i++) {
  const cx = -9 + rn(i) * 18;
  if (cx < -3.6) continue;
  const k = Math.floor((cx + 3.6) / 2.4);
  if (!groups.has(k)) groups.set(k, []);
  groups.get(k).push(i);
}
for (const [k, list] of groups) {
  e.layer(`tufts${k}`, { pivot: [-2.4 + k * 2.4, 0.05], wind: { strength: 0.3, gust: 0.4 } }, (g) => {
    g.fillStyle = col;
    for (const i of list) {
      const cx = -9 + rn(i) * 18, n = 4 + Math.floor(rn(i + 100) * 9), H = 0.15 + rn(i + 200) * 0.5 * (0.5 + Math.abs(cx) / 6);
      for (let q = 0; q < n; q++) {
        const x = cx + (rn(i * 13 + q) - 0.5) * 0.4, h = H * (0.5 + 0.5 * rn(i * 17 + q)), l = (x - cx) * 0.9 + (rn(i * 19 + q) - 0.5) * 0.3;
        g.beginPath();
        g.moveTo(x - 0.009, 0.05);
        g.quadraticCurveTo(x + l * h * 0.4, -h * 0.6, x + l * h, -h);
        g.quadraticCurveTo(x + l * h * 0.4 + 0.004, -h * 0.5, x + 0.009, 0.05);
        g.fill();
      }
    }
  });
}
