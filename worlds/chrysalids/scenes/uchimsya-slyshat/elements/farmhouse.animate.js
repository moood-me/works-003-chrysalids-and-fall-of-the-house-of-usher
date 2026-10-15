const wl = Math.min(1, (+(e.state.dusk || 0)) * 1.5);
e.layer('lit').alpha = wl;
e.glow('w1', wl);
e.glow('w2', wl);
