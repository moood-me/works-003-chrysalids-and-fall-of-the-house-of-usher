// the top board closing and the lever coming down as `pump` goes 0 → 1; the handle's point where it is now
const p = e.anim.clamp(e.state.pump ?? 0, 0, 1), open = 0.2 - 0.17 * p, drop = 0.2 - open;
const B = e.layer('board'), V = e.layer('lever');
B.rotate = -0.18 * p;
V.y = drop;
e.at(-2.04, -1.4 + drop, 'handle');
