const dw = e.anim.clamp(e.state.dawn ?? 0, 0, 1);
e.layer('dawn').alpha = dw;
e.layer('stars').alpha = 1 - 0.95 * dw;
