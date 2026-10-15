const k = Math.min(1, Math.max(0, e.state.reflection_figure ?? 0));
e.layer("her").alpha = k;
e.glow("room", k);
