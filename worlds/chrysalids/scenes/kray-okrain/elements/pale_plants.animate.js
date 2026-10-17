const k = e.anim.clamp(e.state.glow ?? 0.7, 0, 1);
e.layer('tips').alpha = k * (0.75 + 0.25 * Math.sin(e.t * 0.5));
