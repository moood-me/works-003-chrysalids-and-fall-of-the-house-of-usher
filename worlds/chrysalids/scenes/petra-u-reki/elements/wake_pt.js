// rings on the water round Petra while she is in it (a plane on the water at her place): three, spreading in turn
for (let i = 0; i < 3; i++) {
  e.layer(`w${i}`, { pivot: [0, 0], box: [-1.3, -1.3, 1.3, 1.3] }, q => {
    q.strokeStyle = '#e8ecdf';
    q.lineWidth = 0.035;
    q.beginPath();
    q.arc(0, 0, 1.2, 0, 7);
    q.stroke();
  });
}
