// The stair door's leaf (in the back wall's opening, hinged on its left): planks, battens, the latch. Its animate swings
// it open as `stair_door` goes 0 → 1 (seen narrowing to its edge as it turns into the stairwell)
const { DOOR } = e.lib, w = DOOR.a1 - DOOR.a0;
e.layer('leaf', { pivot: [0, 0], box: [-0.02, -DOOR.h - 0.02, w + 0.02, 0.02] }, q => {
  q.fillStyle = '#7a5a3e';
  q.fillRect(0, -DOOR.h, w, DOOR.h);
  q.fillStyle = 'rgba(40,26,16,0.45)';
  for (let i = 1; i < 4; i++) q.fillRect((w * i) / 4, -DOOR.h, 0.01, DOOR.h);
  q.fillStyle = '#5e4430';
  q.fillRect(0, -1.7, w, 0.07);
  q.fillRect(0, -0.4, w, 0.07);
  q.fillStyle = '#3a3028';
  q.beginPath();
  q.arc(w - 0.08, -1.0, 0.024, 0, 7);
  q.fill();
});
