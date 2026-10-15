const w = e.anim.clamp(e.state.waking ?? 0, 0, 1);
e.layer('dark').alpha = 0.75 * w;
e.layer('stars').alpha = (1 - 0.5 * w) * (0.85 + 0.15 * e.anim.noise(e.t * 0.3, 1));
