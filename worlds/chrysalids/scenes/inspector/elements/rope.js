// the halter rope from the calf's ring to the farmhand's hand (a layer its animate lays between the two each frame)
e.layer('rope', { pivot: [0, 0], box: [-3, -3, 3, 3] }, q => {
  q.strokeStyle = '#a89070';
  q.lineWidth = 0.02;
  q.beginPath(); q.moveTo(0, 0); q.lineTo(0, 1); q.stroke();
});
