// a dragonfly over the water (dragonfly.animate.js: it darts to and fro, turning); its wings beat too fast to be seen —
// painted as their blur, each wing a faint fan of where it goes, trembling. (Each layer's box holds the whole of its way.)
e.layer('body', { pivot: [0, 0], box: [-1.65, -0.32, 1.6, 0.32] }, q => {
  q.strokeStyle = '#3f4638';
  q.lineWidth = 0.011;
  q.lineCap = 'round';
  q.beginPath();
  q.moveTo(-0.09, 0.004);
  q.lineTo(0.04, 0);
  q.stroke();
  q.fillStyle = '#3f4638';
  q.beginPath();
  q.arc(0.045, 0, 0.009, 0, 7);
  q.fill();
});
e.layer('wings', { pivot: [0, 0], flicker: 0.6, box: [-1.6, -0.34, 1.6, 0.34] }, q => {
  q.fillStyle = 'rgba(246,240,214,0.22)';
  for (const [x, a, rx, ry] of [[0.01, 0.25, 0.048, 0.011], [-0.015, 0.35, 0.042, 0.009]]) for (const beat of [1, 0.7, 0.4]) for (const side of [-1, 1]) {
    q.beginPath();
    q.ellipse(x, side * 0.018 * beat, rx, ry * beat, side * a * beat, 0, 7);
    q.fill();
  }
});
