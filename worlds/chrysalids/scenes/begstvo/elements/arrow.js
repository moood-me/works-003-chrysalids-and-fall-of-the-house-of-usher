// Rosalind's arrow in flight: a shaft and fletching (a layer its animate lays from her bow hand toward the front searcher —
// or over his head — as `arrow` goes 0 → 1)
e.layer('arrow', { pivot: [0, 0], box: [-40, -12, 40, 4] }, q => {
  q.strokeStyle = '#d8ccb0';
  q.lineWidth = 0.012;
  q.lineCap = 'round';
  q.beginPath();
  q.moveTo(-0.38, 0);
  q.lineTo(0.38, 0);
  q.stroke();
  q.fillStyle = '#a8a090';
  q.beginPath();
  q.moveTo(-0.38, 0); q.lineTo(-0.3, -0.03); q.lineTo(-0.26, 0); q.lineTo(-0.3, 0.03);
  q.closePath();
  q.fill();
});
