const dk = e.state.dusk ?? 0.2, gl = Math.min(1, dk * (0.7 + 0.1 * Math.sin(e.t * 0.7) + 0.05 * Math.sin(e.t * 1.9)) * 1.25);
e.layer('lit').alpha = gl;
e.glow('w1', gl);
e.glow('w2', gl);
