// the stars going out and the dawn's band coming up as `dawn` grows
const d = e.anim.clamp(e.state.dawn ?? 0.1, 0, 1);
e.layer('stars').alpha = 1 - 0.85 * d;
e.layer('dawn').alpha = 0.45 + 0.55 * d;
e.glow('venus', 0.9 - 0.4 * d);
