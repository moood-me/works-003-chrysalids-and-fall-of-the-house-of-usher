// motes of the dream drifting up slowly: a layer going round from the bottom to the top
const A = e.aspect;
e.layer('m', { drift: [0, -0.012], box: [0, 0.25, A, 0.95] }, q => {
  for (let i = 0; i < 24; i++) {
    const x = e.rnd() * A, y = 0.25 + e.rnd() * 0.7, r = 0.0012 + 0.0008 * Math.sin(e.rnd() * 6.28);
    const rg = q.createRadialGradient(x, y, 0, x, y, r * 2.5);
    rg.addColorStop(0, `rgba(246,230,200,${0.15 + 0.15 * e.rnd()})`); rg.addColorStop(1, 'rgba(246,230,200,0)');
    q.fillStyle = rg; q.beginPath(); q.arc(x, y, r * 2.5, 0, 7); q.fill();
  }
});
