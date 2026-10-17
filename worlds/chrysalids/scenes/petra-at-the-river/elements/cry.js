// What only their own hear: Petra's cry — soft pale rings spreading from her head over the water, as strong as `cry`
// (cry.animate.js); painted once, a ring a layer, each scaled out and faded in its turn. The element stands where she is
// (its place: petra_a, pt_e), the rings round her head.
for (let i = 0; i < 4; i++) {
  e.layer(`ring${i}`, { pivot: [0, -0.85], blend: 'add', box: [-4.2, -3.6, 4.2, 1.9] }, q => {
    q.strokeStyle = 'rgba(244,242,232,0.8)';
    q.lineWidth = 0.08;
    q.beginPath();
    q.ellipse(0, -0.85, 4.0, 2.5, 0, 0, 7);
    q.stroke();
  });
}
e.layer('core', { blend: 'add', box: [-0.6, -1.45, 0.6, -0.25] }, q => {
  const rg = q.createRadialGradient(0, -0.85, 0, 0, -0.85, 0.55);
  rg.addColorStop(0, 'rgba(244,242,232,0.5)');
  rg.addColorStop(1, 'rgba(244,242,232,0)');
  q.fillStyle = rg;
  q.fillRect(-0.6, -1.45, 1.2, 1.2);
});
