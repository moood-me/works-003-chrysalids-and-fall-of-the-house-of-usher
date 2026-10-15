const F = e.anim.clamp(e.state.fire_outside ?? 0, 0, 1);
e.layer('glow').alpha = F * (0.85 + 0.15 * e.anim.noise(e.t * 1.3, 1));
e.layer('stars').alpha = 1 - 0.7 * F;
