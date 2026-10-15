const d = e.anim.clamp(e.state.dusk ?? 0.5, 0, 1);
e.layer('night').alpha = 0.95 * e.anim.ease.inOut(d);
e.layer('stars').alpha = e.anim.span(d, 0.3, 0.85);
e.glow('star', 0.35 + 0.65 * d);
