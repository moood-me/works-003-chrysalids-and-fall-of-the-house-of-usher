// as `waking` grows: the dark closes in, the posts slide in from the sides, the beam comes down, the sill up, the cross
// of the frame shows last (from «кино»'s waking, its numbers in the card's metres here)
const K = 1.5 / 4.26, w = e.anim.clamp(e.state.waking ?? 0, 0, 1), ww = w * w * (3 - 2 * w);
const wob = 0.04 * Math.sin(e.t * 0.2);
e.layer('vig').alpha = ww;
const slide = K * (1.55 * (1 - ww) + wob);
e.layer('postL').x = -slide;
e.layer('postR').x = slide;
e.layer('postL').alpha = ww;
e.layer('postR').alpha = ww;
e.layer('beam').y = K * (-0.75 + 0.75 * ww);
e.layer('beam').alpha = ww;
e.layer('sill').y = K * (0.45 - 0.45 * ww);
e.layer('sill').alpha = ww;
e.layer('cross').alpha = Math.max(0, (ww - 0.4) / 0.6);
