// the iron as hot as the fire keeps it, breathing; the tools lying here while they are not in his hands
const s = e.state, f = e.anim.clamp(s.fire ?? 0.7, 0, 1), held = Array.isArray(s.axel_with) ? s.axel_with : [];
const hot = (0.55 + 0.15 * Math.sin(e.t * 0.5)) * (0.4 + 0.6 * f);
e.layer('iron').alpha = hot;
e.glow('iron', hot);
e.layer('hammer_on').alpha = held.includes('hammer') ? 0 : 1;
e.layer('tongs_on').alpha = held.includes('tongs') ? 0 : 1;
