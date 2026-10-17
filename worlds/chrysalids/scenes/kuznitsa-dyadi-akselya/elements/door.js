// The sliding door of the gate (on the far wall's rail, 7.45 m off): broad planks, a brace, two wheels on the rail. Its
// animate slides it along as `door` says (1 — the gate wide open, the door off to the right; 0.7 — half across) and marks
// where hands take its edge (`grip_low`, `grip_high`)
const DW = 4.1, top = -3.4 - 0.32;
e.layer('door', { box: [-0.05, top - 0.25, 7.9, 0.25] }, q => {
  q.fillStyle = '#6e5440';
  q.fillRect(0, top, DW, 0.2 - top);
  for (let x = 0.3; x < DW - 0.05; x += 0.34) {
    q.fillStyle = 'rgba(30,20,14,0.5)';
    q.fillRect(x, top, 0.022, 0.2 - top);
    q.fillStyle = 'rgba(160,130,100,0.1)';
    q.fillRect(x + 0.03, top, 0.12, 0.2 - top);
  }
  q.strokeStyle = '#5a4230';
  q.lineWidth = 0.13;
  q.beginPath();
  q.moveTo(0.1, top + 0.35); q.lineTo(DW - 0.1, top + 0.35);
  q.moveTo(0.1, -0.35); q.lineTo(DW - 0.1, -0.35);
  q.moveTo(0.15, -0.4); q.lineTo(DW - 0.15, top + 0.4);
  q.stroke();
  q.fillStyle = '#2e2a26';
  q.fillRect(0.12, -1.55, 0.07, 0.5);
  for (const wx of [0.5, DW - 0.5]) {
    q.beginPath();
    q.arc(wx, top - 0.1, 0.09, 0, 7);
    q.fill();
    q.fillRect(wx - 0.025, top - 0.1, 0.05, 0.14);
  }
});
