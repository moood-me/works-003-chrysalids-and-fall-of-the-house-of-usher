// a rider of the community on the meadow behind the children (lib.js: people)
const o = e.lib.people.rider(e);
if (!o) return;
g.save();
g.globalAlpha = e.state.r_vis ?? 0;
e.kit.chrysalids.horse(g, e, o);
g.restore();
