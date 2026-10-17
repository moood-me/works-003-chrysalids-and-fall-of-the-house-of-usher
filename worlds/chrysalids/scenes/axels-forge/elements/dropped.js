// The man's lantern where it fell in the yard (place: across st_lanx), lying on its side; its glass a glow of its own,
// going out as st_glow does (dropped.animate.js — and seen only once it has fallen: st_drop)
e.layer('lantern', { box: [-0.3, -0.3, 0.2, 0.1] }, q => {
  q.rotate(-1.35);
  q.fillStyle = '#3a3430';
  q.fillRect(-0.06, -0.2, 0.12, 0.03);
  q.fillRect(-0.05, -0.04, 0.1, 0.03);
  q.fillStyle = '#e8d2a8';
  q.fillRect(-0.042, -0.17, 0.084, 0.13);
  q.strokeStyle = '#3a3430';
  q.lineWidth = 0.008;
  q.beginPath();
  q.arc(0, -0.2, 0.05, Math.PI, 0);
  q.stroke();
});
e.light(-0.1, -0.05, 0.3, '#ffc46a', 1, 'glass');
