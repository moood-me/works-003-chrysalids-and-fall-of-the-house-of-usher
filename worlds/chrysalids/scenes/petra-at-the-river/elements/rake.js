// Rosalind's rake where it fell on the field's edge (seen once she has dropped it: rake.animate.js)
e.layer('rake', { box: [-1.2, -0.2, 1.2, 0.1] }, q => {
  q.strokeStyle = '#8a7258';
  q.lineWidth = 0.035;
  q.lineCap = 'round';
  q.beginPath();
  q.moveTo(-1.0, -0.03);
  q.lineTo(0.8, -0.05);
  q.stroke();
  q.lineWidth = 0.04;
  q.beginPath();
  q.moveTo(0.8, -0.15);
  q.lineTo(0.85, 0.05);
  q.stroke();
});
