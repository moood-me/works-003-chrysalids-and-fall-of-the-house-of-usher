// The cry as Rosalind hears it on the far field: pale rings round her head (heard), the bond's warm ones too; the element
// stands where she is (rosalind_a, rosalind_d)
for (let i = 0; i < 4; i++) {
  e.layer(`ring${i}`, { pivot: [0, -1.55], blend: 'add', box: [-4.2, -4.3, 4.2, 1.2] }, q => {
    q.strokeStyle = 'rgba(244,242,232,0.8)';
    q.lineWidth = 0.08;
    q.beginPath();
    q.ellipse(0, -1.55, 4.0, 2.5, 0, 0, 7);
    q.stroke();
  });
}
e.layer('core', { blend: 'add', box: [-0.6, -2.15, 0.6, -0.95] }, q => {
  const rg = q.createRadialGradient(0, -1.55, 0, 0, -1.55, 0.55);
  rg.addColorStop(0, 'rgba(255,230,200,0.5)');
  rg.addColorStop(1, 'rgba(255,230,200,0)');
  q.fillStyle = rg;
  q.fillRect(-0.6, -2.15, 1.2, 1.2);
});
