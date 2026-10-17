// the broken lamp on its side on the floor, where the oil burns (spill.animate.js: there once it has fallen)
e.layer('lamp', {}, q => {
  q.fillStyle = '#5a4a3a';
  q.beginPath(); q.ellipse(-0.6, -0.05, 0.1, 0.06, 0.3, 0, 7); q.fill();
  q.fillStyle = '#a07a44';
  q.fillRect(-0.6, -0.07, 0.14, 0.04);
});
e.at(0, -0.3, 'fire');
