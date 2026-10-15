const dk = e.state.dusk ?? 0.2, L = Math.max(0, Math.min(1, (dk - 0.25) * 1.6)) * (0.85 + 0.1 * Math.sin(e.t * 0.5));
e.layer('lit').alpha = L;
e.glow('w1', L * 0.6);
e.glow('w2', L);
