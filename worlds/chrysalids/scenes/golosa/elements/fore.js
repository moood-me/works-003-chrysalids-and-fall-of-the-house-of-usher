// grass and seed heads at our feet, stirring (in eight layers, each bending in the wind)
const C = '#3a4030';
for (let band = 0; band < 8; band++) {
  const x0 = -8.8 + band * 2.2;
  e.layer('b' + band, { pivot: [x0 + 1.1, 0.45], wind: { strength: 0.35, gust: 0.4 }, box: [x0 - 0.6, -1.4, x0 + 2.8, 0.5] }, q => {
    q.fillStyle = C; q.strokeStyle = C; q.lineCap = 'round';
    for (let i = 0; i < 40; i++) {
      const x = x0 + e.rnd() * 2.2;
      let h = 0.15 + Math.pow(e.rnd(), 1.6) * 0.95;
      const lean = (e.rnd() - 0.5) * 0.35;
      if (x > -3 && x < 2.5 && e.rnd() < 0.7) h *= 0.45;
      const sw = lean * h, w = 0.008 + e.rnd() * 0.01, b = 0.45;
      q.beginPath(); q.moveTo(x - w, b); q.quadraticCurveTo(x + sw * 0.3, b - h * 0.55, x + sw, b - h); q.quadraticCurveTo(x + sw * 0.3 + w * 0.3, b - h * 0.5, x + w, b); q.fill();
      if (e.rnd() < 0.2 && h > 0.35) {
        q.save(); q.translate(x + sw, b - h); q.rotate(lean * 0.5);
        for (let k = 0; k < 7; k++) { q.beginPath(); q.ellipse((k % 2 ? 1 : -1) * 0.009, -0.015 - k * 0.017, 0.006, 0.016, k % 2 ? 0.4 : -0.4, 0, 7); q.fill(); }
        q.restore();
      }
    }
  });
}
