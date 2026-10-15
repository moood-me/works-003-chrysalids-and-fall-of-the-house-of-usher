// The ear the Inspector breaks off: held in his hand (its animate puts it at in#hand_r while `in_ear` is up), thrown in an
// arc back into the wheat as `in_toss` goes 0 → 1 — a heavy, hooked ear of the Offence, its hairs; golden in the lantern
const col = '#b0985a';
e.layer('ear', { pivot: [0, 0], box: [-30, -12, 30, 3] }, q => {
  q.strokeStyle = col;
  q.fillStyle = col;
  q.lineCap = 'round';
  q.lineWidth = 0.012;
  q.beginPath(); q.moveTo(0, 0.12); q.lineTo(0, -0.02); q.stroke();
  q.beginPath();
  q.moveTo(0, -0.02);
  q.bezierCurveTo(0.03, -0.06, 0.03, -0.18, 0, -0.22);
  q.bezierCurveTo(-0.03, -0.18, -0.03, -0.06, 0, -0.02);
  q.fill();
  q.lineWidth = 0.004;
  for (let j = 1; j < 6; j++) {
    q.beginPath();
    q.moveTo(0, -0.02 - j * 0.035); q.lineTo(0.04, -0.06 - j * 0.035);
    q.moveTo(0, -0.02 - j * 0.035); q.lineTo(-0.04, -0.06 - j * 0.035);
    q.stroke();
  }
});
