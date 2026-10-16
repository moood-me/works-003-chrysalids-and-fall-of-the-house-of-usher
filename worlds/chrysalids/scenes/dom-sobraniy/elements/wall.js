// The back wall of the meeting house (7.5 m), a card facing the hall: boards, the four windows and the door cut out (the
// yard and the night beyond — yard, sky), their frames, the board “Blessed is the Norm” over the elders' table; the door's
// leaf a layer (wall.animate.js: `door`, hinged on the right, opening inward). Painted once in daylight colours: the
// lamp, the oil burning, the barn's fire through the windows are the scene's light.
const { WIN, WY0, WY1, DOOR } = e.lib;
const holes = new Path2D();
holes.rect(-10, -4.3, 20, 4.35);
for (const [x, w] of WIN) holes.rect(x - w / 2, WY0, w, WY1 - WY0);
holes.rect(DOOR.x0, DOOR.y, DOOR.x1 - DOOR.x0, -DOOR.y + 0.05);
g.save();
g.clip(holes, 'evenodd');
g.fillStyle = '#8a6c52';
g.fillRect(-10, -4.3, 20, 4.35);
for (let x = -10; x < 10; x += 0.24) {
  g.fillStyle = e.rnd() < 0.5 ? 'rgba(60,44,32,0.12)' : 'rgba(200,176,146,0.1)';
  g.fillRect(x, -4.3, 0.24, 4.35);
  g.fillStyle = 'rgba(48,34,24,0.45)';
  g.fillRect(x, -4.3, 0.014, 4.35);
}
g.fillStyle = '#6e543e';
g.fillRect(-10, -0.95, 20, 1.0);
g.fillStyle = '#5a4432';
g.fillRect(-10, -0.98, 20, 0.04);
g.fillRect(-10, -4.3, 20, 0.22);
g.restore();
// the board over the elders' table
const bx = -0.3, by = -3.2, bw = 2.7, bh = 0.44;
g.fillStyle = '#5a4432';
g.fillRect(bx - bw / 2 - 0.05, by - bh / 2 - 0.05, bw + 0.1, bh + 0.1);
g.fillStyle = '#d8c8a2';
g.fillRect(bx - bw / 2, by - bh / 2, bw, bh);
g.save();
g.translate(bx, by);
g.scale(0.01, 0.01);
g.font = '15px Georgia, serif';
g.textAlign = 'center';
g.textBaseline = 'middle';
g.fillStyle = '#3a2a20';
g.fillText(tr('Blessed is the Norm'), 0, 1);
g.restore();
// the window frames, their bars and sills; the door's frame
g.fillStyle = '#5a4432';
for (const [x, w] of WIN) {
  const fw = 0.06;
  g.beginPath();
  g.rect(x - w / 2 - fw, WY0 - fw, w + 2 * fw, WY1 - WY0 + 2 * fw);
  g.rect(x - w / 2, WY0, w, WY1 - WY0);
  g.fill('evenodd');
  g.fillRect(x - 0.015, WY0, 0.03, WY1 - WY0);
  g.fillRect(x - w / 2, (WY0 + WY1) / 2 - 0.015, w, 0.03);
  g.fillRect(x - w / 2 - 0.1, WY1 + 0.05, w + 0.2, 0.05);
}
g.fillRect(DOOR.x0 - 0.08, DOOR.y - 0.1, DOOR.x1 - DOOR.x0 + 0.16, 0.1);
g.fillRect(DOOR.x0 - 0.08, DOOR.y, 0.08, -DOOR.y);
g.fillRect(DOOR.x1, DOOR.y, 0.08, -DOOR.y);
e.layer('door', { pivot: [DOOR.x1, 0], box: [DOOR.x0 - 0.02, DOOR.y - 0.03, DOOR.x1 + 0.02, 0.04] }, q => {
  q.fillStyle = '#6a4e3a';
  q.fillRect(DOOR.x0, DOOR.y, DOOR.x1 - DOOR.x0, -DOOR.y);
  q.strokeStyle = 'rgba(40,28,20,0.5)';
  q.lineWidth = 0.014;
  for (let k = 1; k < 4; k++) {
    const x = DOOR.x0 + (DOOR.x1 - DOOR.x0) * k / 4;
    q.beginPath(); q.moveTo(x, DOOR.y); q.lineTo(x, 0); q.stroke();
  }
  q.fillStyle = '#a08860';
  q.beginPath(); q.arc(DOOR.x0 + 0.1, -1.0, 0.03, 0, 7); q.fill();
});
