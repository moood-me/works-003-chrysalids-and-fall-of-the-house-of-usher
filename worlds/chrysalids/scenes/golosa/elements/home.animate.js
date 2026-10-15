const pe = e.state.petra ?? 0;
e.layer('lit').alpha = Math.min(1, 0.78 + 0.1 * Math.sin(e.t * 0.4) + pe * (0.2 + 0.15 * Math.sin(e.t * 0.9)));
e.glow('win', (0.6 + pe * 0.6) / 1.2);
