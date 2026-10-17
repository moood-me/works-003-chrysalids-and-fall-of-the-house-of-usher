// rings on the water where something meets it (a plane seen from above): three, spreading one after another
// (rings.animate.js: as `ring` goes 0 → 1 they widen and fade)
for (let i = 0; i < 3; i++) {
  e.layer(`ring${i}`, { pivot: [0, 0], box: [-0.7, -0.7, 0.7, 0.7] }, q => {
    q.strokeStyle = '#eef0dc';
    q.lineWidth = 0.03;
    q.beginPath();
    q.arc(0, 0, 0.62, 0, 7);
    q.stroke();
  });
}
