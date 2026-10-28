// The web over the children on the ledge: a silver veil laid over the ledge behind the stone (cave_web.animate.js: as much
// as `cave_web` says, the beads in it glinting)
e.layer('veil', { box: [-5.5, -2.2, 0, 0.2] }, q => {
  q.lineCap = 'round';
  for (let i = 0; i < 160; i++) {
    const x1 = -5.2 + e.rnd() * 4.8, y1 = -1.9 + e.rnd() * 1.9, an = e.rnd() * 6.28, L = 0.3 + e.rnd() * 1.4;
    q.strokeStyle = `rgba(238,232,240,${(0.3 + 0.4 * e.rnd()).toFixed(2)})`;
    q.lineWidth = 0.012 + e.rnd() * 0.015;
    q.beginPath(); q.moveTo(x1, y1); q.quadraticCurveTo(x1 + Math.cos(an) * L * 0.5 + 0.1, y1 + Math.sin(an) * L * 0.5 - 0.1, x1 + Math.cos(an) * L, y1 + Math.sin(an) * L * 0.4); q.stroke();
  }
});
