const d = e.anim.clamp(e.state.dusk ?? 0.5, 0, 1);
e.layer('night').alpha = 0.95 * e.anim.ease.inOut(d);
const st = e.anim.span(d, 0.3, 0.85);
for (let k = 0; k < 3; k++) e.layer(`stars${k}`).alpha = st * (0.75 + 0.25 * Math.sin(e.t * (0.9 + 0.37 * k) + k * 2.1));
e.glow('star', 0.35 + 0.65 * d);
