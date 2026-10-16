// between the calf's ring and the farmhand's right hand while he holds it (`farmhand_reach` on the ring), as the calf is there
const s = e.state, L = e.layer('rope'), a = e.point('calf#ring'), b = e.point('farmhand#hand_r');
const held = (s.calf_present ?? 1) > 0.5 && s.farmhand_reach && s.farmhand_reach.r === 'calf#ring';
if (!a || !b || !held) { L.alpha = 0; return; }
L.x = a[0];
L.y = a[1];
L.rotate = Math.atan2(-(b[0] - a[0]), b[1] - a[1]);
L.scaleY = Math.max(0.01, Math.hypot(b[0] - a[0], b[1] - a[1]));
L.alpha = 1;
