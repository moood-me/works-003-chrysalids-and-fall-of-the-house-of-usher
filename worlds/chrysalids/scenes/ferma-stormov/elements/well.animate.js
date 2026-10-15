// the bucket stirring on its rope: a slow swing, more as the wind gets up
const w = 0.3 + (e.state.wind ?? 0.4);
e.layer('bucket').rotate = w * (0.03 * e.anim.noise(e.t * 0.5, 1) + 0.015 * e.anim.noise(e.t * 1.3, 2));
