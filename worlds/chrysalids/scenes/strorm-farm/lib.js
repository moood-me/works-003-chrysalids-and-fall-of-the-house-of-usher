// The Strorm farm (engine 3): what its elements share — the fence's line (from near the eye on the left away to the
// barn's corner: the wheat stands to the left of it), the land's places, a row of standing wheat.
// the fence: from [-2.2, 3.5] to [-5.6, 17] (across, distance)
const FENCE = { a0: -2.2, d0: 3.5, a1: -5.6, d1: 17 };
const fenceAt = d => FENCE.a0 + (FENCE.a1 - FENCE.a0) * (d - FENCE.d0) / (FENCE.d1 - FENCE.d0);
// a row of standing wheat `len` metres long to the left of its anchor (its right end at the fence), `h` tall: the dense
// stalks below, the ears above in pieces of 3 m — each a layer bending in the wind about its foot
function wheat(g, e, len, h) {
  g.fillStyle = '#9a7c44';
  g.beginPath();
  g.moveTo(-len, 0.3);
  for (let x = -len; x <= 0; x += 0.25) g.lineTo(x, -h * (0.5 + 0.06 * Math.sin(x * 3.1) + 0.04 * Math.sin(x * 7.3)));
  g.lineTo(0, 0.3);
  g.closePath();
  g.fill();
  for (let x0 = -len; x0 < 0; x0 += 3) {
    const x1 = Math.min(0, x0 + 3);
    e.layer('s' + Math.round(-x0), { pivot: [(x0 + x1) / 2, 0], wind: { strength: 0.45, gust: 0.4 }, box: [x0 - 0.3, -h - 0.3, x1 + 0.3, 0.05] }, q => {
      q.fillStyle = '#ae904e';
      q.beginPath();
      q.moveTo(x0, 0);
      for (let x = x0; x <= x1; x += 0.2) q.lineTo(x, -h * (0.72 + 0.05 * Math.sin(x * 4.7)));
      q.lineTo(x1, 0);
      q.closePath();
      q.fill();
      q.lineCap = 'round';
      const n = Math.round((x1 - x0) * 15);
      for (let i = 0; i < n; i++) {
        const x = x0 + e.rnd() * (x1 - x0), t = h * (0.9 + 0.18 * e.rnd()), lean = (e.rnd() - 0.5) * 0.12;
        q.strokeStyle = i % 3 ? '#a88a4a' : '#c0a060';
        q.lineWidth = 0.014;
        q.beginPath(); q.moveTo(x, -h * 0.6); q.quadraticCurveTo(x, -t * 0.85, x + lean, -t); q.stroke();
        q.fillStyle = i % 4 ? '#c6a862' : '#d6ba74';
        q.beginPath(); q.ellipse(x + lean * 1.2, -t - 0.05, 0.02, 0.065, lean * 2, 0, 7); q.fill();
      }
    });
  }
}
return { FENCE, fenceAt, wheat };
