// a cart loaded with sheaves on the far road (55 m), its horse before it (a layer: cart.animate.js brings it in from the
// right as `cart` grows)
e.layer('cart', { box: [-4, -3.6, 36, 0.6] }, q => {
  q.fillStyle = '#c8b072';
  q.beginPath(); q.moveTo(-2.4, -1.2); q.quadraticCurveTo(0, -3.4, 2.4, -1.2); q.closePath(); q.fill();
  q.fillStyle = '#6a5240';
  q.fillRect(-2.4, -1.25, 4.8, 0.3);
  q.strokeStyle = '#5a4434';
  q.lineWidth = 0.12;
  for (const x of [-1.6, 1.6]) { q.beginPath(); q.arc(x, -0.55, 0.55, 0, 7); q.stroke(); }
  q.fillStyle = '#6a5040';
  q.beginPath(); q.ellipse(-3.4, -1.3, 0.8, 0.45, 0, 0, 7); q.fill();
  q.fillRect(-3.9, -1.3, 0.12, 1.3); q.fillRect(-3.0, -1.3, 0.12, 1.3);
  q.beginPath(); q.ellipse(-4.1, -1.8, 0.25, 0.4, 0.4, 0, 7); q.fill();
});
