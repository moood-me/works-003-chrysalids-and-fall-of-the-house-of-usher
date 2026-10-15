// The bellows on the forge's left (its own card, 6.4 m off — the forge's metres): the leather between two boards, its top
// board and the lever up from its end to the handle David pulls down (layers — pump.animate.js presses them as `pump`
// goes 0 → 1). Its point `handle` (where his hands hold the lever) is marked as it moves.
g.fillStyle = '#4e3a2a';
g.fillRect(-1.6, -0.66, 0.06, 0.69);
g.fillRect(-1.0, -0.74, 0.06, 0.77);
g.fillStyle = '#6a4a30';
g.beginPath();
g.moveTo(-0.88, -0.72); g.lineTo(-1.75, -0.62); g.lineTo(-1.75, -0.58); g.lineTo(-0.88, -0.68);
g.closePath();
g.fill();
e.layer('board', { pivot: [-0.88, -0.78], box: [-1.95, -1.3, -0.8, -0.5] }, q => {
  q.fillStyle = '#7a5a40';
  q.beginPath();
  q.moveTo(-0.88, -0.8); q.lineTo(-1.75, -0.95); q.quadraticCurveTo(-1.86, -0.8, -1.75, -0.62); q.lineTo(-0.88, -0.72);
  q.closePath();
  q.fill();
  q.strokeStyle = '#5a4030';
  q.lineWidth = 0.015;
  for (let k = 1; k < 4; k++) { q.beginPath(); q.moveTo(-0.88 - k * 0.21, -0.81); q.lineTo(-0.88 - k * 0.21, -0.71); q.stroke(); }
});
e.layer('lever', { pivot: [-1.75, -0.95], box: [-2.2, -1.6, -1.6, -0.85] }, q => {
  q.strokeStyle = '#5a4030';
  q.lineCap = 'round';
  q.lineWidth = 0.05;
  q.beginPath(); q.moveTo(-1.75, -0.95); q.lineTo(-2.02, -1.4); q.stroke();
  q.lineWidth = 0.07;
  q.beginPath(); q.moveTo(-2.11, -1.39); q.lineTo(-1.97, -1.41); q.stroke();
});
