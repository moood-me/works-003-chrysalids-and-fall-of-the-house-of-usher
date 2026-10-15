// the Spider's arrow in flight (its place: arrow_a, arrow_d, arrow_h; seen while arrow_vis)
e.layer('a', { box: [-0.6, -0.1, 0.6, 0.1] }, q => {
  q.strokeStyle = '#d8ccb0';
  q.lineWidth = 0.014;
  q.lineCap = 'round';
  q.beginPath(); q.moveTo(-0.45, 0); q.lineTo(0.45, 0); q.stroke();
  q.fillStyle = '#a8a090';
  q.beginPath(); q.moveTo(0.45, 0); q.lineTo(0.37, -0.03); q.lineTo(0.37, 0.03); q.closePath(); q.fill();
});
