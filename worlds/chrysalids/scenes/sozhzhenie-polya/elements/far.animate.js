// the windmill's sails turning; the window lamps out as the day comes
const dawn = e.anim.clamp(e.state.dawn ?? 0.22, 0, 1), k = e.anim.clamp(1 - dawn * 1.6, 0, 1);
e.layer('sails').rotate = e.t * 0.05;
e.glow('lamp1', 0.35 * k);
e.glow('lamp2', 0.25 * k);
