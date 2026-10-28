// Sedge standing in the water mid-tarn, in clusters — each cluster a layer the wind bends (the tarn mirrors them).
const rn = (i) => { const s = Math.sin(i * 29.3 + 8.1) * 43758.5453; return s - Math.floor(s); };
const col = e.lib.paint("#343c41");
const C = [[-6.0, 0.9], [-5.1, 0.6], [-1.6, 0.7], [-1.0, 0.5], [9, 0.8], [11.5, 1.1], [15, 0.7], [-14, 1.0], [-18, 0.8], [20, 0.9]];
C.forEach((cl, i) => {
  e.layer(`cluster${i}`, { pivot: [cl[0], 0.05], wind: { strength: 0.3, gust: 0.4 } }, (g) => {
    g.fillStyle = col;
    const n = 6 + Math.floor(rn(i) * 6);
    for (let k = 0; k < n; k++) {
      const x = cl[0] + (rn(i * 7 + k) - 0.5) * 0.6, h = cl[1] * (0.5 + 0.5 * rn(i * 11 + k)), l = (x - cl[0]) * 0.8 + (rn(i * 3 + k) - 0.5) * 0.2;
      g.beginPath();
      g.moveTo(x - 0.02, 0.05);
      g.quadraticCurveTo(x + l * h * 0.4, -h * 0.6, x + l * h, -h);
      g.quadraticCurveTo(x + l * h * 0.4 + 0.01, -h * 0.5, x + 0.02, 0.05);
      g.fill();
    }
  });
});
