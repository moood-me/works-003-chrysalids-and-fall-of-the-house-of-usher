// what reaches her: the cry (heard), or the bond across the water
const s = e.state, c = e.anim.clamp;
e.lib.rings(e, c(Math.max(s.heard ?? 0, (s.bond ?? 0) * (1 - (s.after ?? 0))), 0, 1), 0.09);
