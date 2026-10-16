// the night as far as the dawn has not come; the stars with it; the fire's glow on the sky as the field burns; the grey
// of the morning after
const s = e.state, c = e.anim.clamp, dawn = c(s.dawn ?? 0.22, 0, 1), fl = e.lib.fireLight(s);
e.layer('night').alpha = c(1 - dawn * 1.4, 0, 1);
e.layer('stars').alpha = c(1 - dawn * 1.6, 0, 1) * (1 - 0.7 * fl);
e.layer('glow').alpha = fl;
e.layer('grey').alpha = c((s.morning ?? 0) * 0.7, 0, 1);
