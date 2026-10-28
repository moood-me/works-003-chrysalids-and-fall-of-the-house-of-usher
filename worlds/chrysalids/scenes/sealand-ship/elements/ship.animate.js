// the craft: its glint far off (none close), legs as it comes low, the door's light, the ramp, the threads and the spiral
// to the shader; seen as much as ship_vis
const s = e.state, c = e.anim.clamp, d = s.ship_d ?? 330, h = s.ship_h ?? 95, far = c((d - 60) / 200, 0, 1), vis = c(s.ship_vis ?? 0, 0, 1);
e.glow('glint', (0.2 + 1.6 * far) * vis);
e.uniform('spin', c(s.spin ?? 0, 0, 1));
e.uniform('fall', c(s.fall ?? 0, 0, 1) * (h > 0.05 ? 1 : 0));
e.uniform('legs', c((12 - h) / 6, 0, 1));
e.uniform('door', c(s.door ?? 0, 0, 1));
e.uniform('ramp', h < 0.05 ? c((s.door ?? 0) * 1.5 - 0.4, 0, 1) : 0);
e.glow('door', c(s.door ?? 0, 0, 1));
e.uniform('vis', vis);
