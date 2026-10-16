// What David and Rosalind hear of each other across the water: warm rings from his head (bond — rings as cry's,
// warmer); the element stands where he is (david_a, dv_e)
for (let i = 0; i < 4; i++) {
  e.layer(`ring${i}`, { pivot: [0, -1.1], blend: 'add', box: [-4.2, -3.9, 4.2, 1.6] }, q => {
    q.strokeStyle = 'rgba(255,214,160,0.8)';
    q.lineWidth = 0.08;
    q.beginPath();
    q.ellipse(0, -1.1, 4.0, 2.5, 0, 0, 7);
    q.stroke();
  });
}
e.layer('core', { blend: 'add', box: [-0.6, -1.7, 0.6, -0.5] }, q => {
  const rg = q.createRadialGradient(0, -1.1, 0, 0, -1.1, 0.55);
  rg.addColorStop(0, 'rgba(255,214,160,0.5)');
  rg.addColorStop(1, 'rgba(255,214,160,0)');
  q.fillStyle = rg;
  q.fillRect(-0.6, -1.7, 1.2, 1.2);
});
