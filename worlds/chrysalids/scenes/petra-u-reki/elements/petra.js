// Petra in the pool (near bank's metres), until David has her (pt_held 1: he paints her).
// pt_x — where she is; pt_sink — how low (0 the water at her chest, 1 under but for a hand); pt_look — where she
// looks (1 the bank, 2 the far field, 3 down: the breath before the cry); branch — she holds its tip until it snaps
// (0.85), then the current has her; cry 0..1 — her cry that only those like her hear: she lets go with one hand,
// throws her head back and reaches out (the rings are painted by the element 'rings').
const o = e.lib.people.petra(e);
if (!o) return;
const L = e.lib,
  s = e.state,
  t = e.t,
  W = L.W;
const broke = (s.branch ?? 0.2) >= 0.85,
  sink = s.pt_sink ?? 0,
  D = s.danger ?? 0.4;
e.kit.chrysalids.person(g, e, o);
// spray where she fights the current
L.splash(g, t, o.x + 0.15, (broke ? 0.8 : 0.1 + 0.2 * D) * (sink > 0.7 ? 0.4 : 1), 11, W, 0.4);
