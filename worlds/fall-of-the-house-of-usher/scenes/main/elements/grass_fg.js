// Dry grass at the eye's feet, in clumps (the causeway's start left clear): each group of clumps a layer the wind
// bends, more toward the tips.
const rn = (i) => { const s = Math.sin(i * 17.3 + 5.1) * 43758.5453; return s - Math.floor(s); };
const col = e.lib.paint("#181d20");
const groups = new Map();
for (let i = 0; i < 50; i++) {
  const cx = -6 + rn(i) * 12;
  if (Math.abs(cx) < 1.2) continue;
  const k = Math.floor((cx + 6) / 2);
  if (!groups.has(k)) groups.set(k, []);
  groups.get(k).push(i);
}
for (const [k, list] of groups) {
  e.layer(`clumps${k}`, { pivot: [-5 + k * 2, 0.5], wind: { strength: 0.35, gust: 0.4 } }, (g) => {
    g.fillStyle = col;
    for (const i of list) {
      const cx = -6 + rn(i) * 12, cy = 0.2 + rn(i + 100) * 0.4, n = 5 + Math.floor(rn(i + 200) * 10);
      const H = (0.15 + rn(i + 300) * 0.45) * (0.4 + Math.abs(cx) / 4);
      for (let q = 0; q < n; q++) {
        const x = cx + (rn(i * 7 + q + 500) - 0.5) * 0.5, h = H * (0.4 + 0.6 * rn(i * 11 + q + 900));
        const l = (x - cx) * 0.8 + (rn(i * 5 + q + 1300) - 0.5) * 0.3;
        g.beginPath();
        g.moveTo(x - 0.012, cy + 0.05);
        g.quadraticCurveTo(x + l * h * 0.4, cy - h * 0.6, x + l * h, cy - h);
        g.quadraticCurveTo(x + l * h * 0.4 + 0.006, cy - h * 0.5, x + 0.012, cy + 0.05);
        g.fill();
      }
    }
  });
}
