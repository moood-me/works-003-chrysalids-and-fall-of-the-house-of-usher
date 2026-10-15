// The threads between the children who hear (a card 20 m ahead, before them all: their heads seen on it — lib.P): the
// glow round each listening head, a thread for each pair of lib.LINKS, warm golden between David and Rosalind as
// `rosalind` grows — each a layer (threads.animate.js: as strong as both ends listen, breathing), a light going along
// each (a small layer it moves). Painted once.
const L = e.lib;
L.KIDS.forEach((id, i) => {
  const [x, y] = L.P(i);
  e.layer('h' + i, { blend: 'add', box: [x - 0.5, y - 0.5, x + 0.5, y + 0.5] }, q => {
    const rg = q.createRadialGradient(x, y, 0, x, y, 0.4);
    rg.addColorStop(0, 'rgba(255,248,226,0.5)'); rg.addColorStop(1, 'rgba(255,248,226,0)');
    q.fillStyle = rg; q.fillRect(x - 0.4, y - 0.4, 0.8, 0.8);
  });
});
const curve = (j) => {
  const [a, b] = L.LINKS[j], A = L.P(a), B = L.P(b);
  const dx = B[0] - A[0], dy = B[1] - A[1], dist = Math.hypot(dx, dy), lift = dist * 0.22 + 0.15, top = Math.min(A[1], B[1]);
  return [A, [A[0] + dx * 0.2, top - lift + (A[1] - top) * 0.3], [A[0] + dx * 0.8, top - lift * 0.85 + (B[1] - top) * 0.3], B];
};
L.LINKS.forEach((_, j) => {
  const [A, C1, C2, B] = curve(j);
  const box = [Math.min(A[0], B[0]) - 0.5, Math.min(A[1], B[1], C1[1], C2[1]) - 0.5, Math.max(A[0], B[0]) + 0.5, Math.max(A[1], B[1]) + 0.5];
  for (const warm of j === 0 ? [false, true] : [false]) e.layer((warm ? 'w' : 'l') + j, { box }, q => {
    const G = q.createLinearGradient(A[0], A[1], B[0], B[1]);
    for (let k = 0; k <= 14; k++) {
      const u = k / 14, en = Math.pow(Math.sin(Math.PI * u), 0.5), gl = 0.75 + 0.25 * Math.sin(u * 31 + j * 3);
      G.addColorStop(u, warm ? `rgba(255,213,156,${(0.35 + 0.65 * en) * gl})` : `rgba(255,251,236,${(0.35 + 0.65 * en) * gl})`);
    }
    q.strokeStyle = G; q.lineCap = 'round';
    q.beginPath(); q.moveTo(A[0], A[1]); q.bezierCurveTo(C1[0], C1[1], C2[0], C2[1], B[0], B[1]);
    q.globalAlpha = 0.3; q.lineWidth = warm ? 0.56 : 0.36; q.stroke();
    q.globalAlpha = 1; q.lineWidth = warm ? 0.095 : 0.065; q.stroke();
  });
  e.layer('p' + j, { blend: 'add', box: [-0.2, -0.2, 0.2, 0.2] }, q => {
    const rg = q.createRadialGradient(0, 0, 0, 0, 0, 0.18);
    rg.addColorStop(0, 'rgba(255,250,235,1)'); rg.addColorStop(1, 'rgba(255,250,235,0)');
    q.fillStyle = rg; q.fillRect(-0.18, -0.18, 0.36, 0.36);
  });
});
for (const i of [0, 1]) {
  const [x, y] = L.P(i);
  e.layer('r' + i, { blend: 'add', box: [x - 0.6, y - 0.6, x + 0.6, y + 0.6] }, q => {
    const rg = q.createRadialGradient(x, y, 0, x, y, 0.5);
    rg.addColorStop(0, 'rgba(255,214,160,0.45)'); rg.addColorStop(1, 'rgba(255,214,160,0)');
    q.fillStyle = rg; q.fillRect(x - 0.5, y - 0.5, 1, 1);
  });
}
