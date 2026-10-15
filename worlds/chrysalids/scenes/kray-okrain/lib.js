// Край Окраин (engine 3): what its elements and its script share — the path through the last field to the gap in the fence
// and on into the Fringes, the trees on the left whose shadows the moon throws across it (the moon: from MOON — low on the
// left behind the wood), the pools of shadow on the path worked out from them (POOLS: where the path goes into each shadow
// and out of it — the same trees and moon the engine casts them from), the father with his lantern in the field.
const { clamp } = anim;
// the moon: its bearing (degrees: 0 ahead, −90 left) and its height over the horizon — the scene's light `moon` comes from it
const MOON = { bearing: -50, height: 25 };
// the guardian trees on the left (across, distance, the crown's middle over the ground, the trunk's lean) and their crowns
const TREES = [{ a: -14.7, d: 16, h: 8, lean: 0.4 }, { a: -13.2, d: 20, h: 8.3, lean: -0.3 }, { a: -11.8, d: 24, h: 7.8, lean: 0.5 },
  { a: -10.3, d: 28, h: 8.2, lean: -0.2 }, { a: -16.5, d: 31, h: 9, lean: 0.3 }];
const CROWN = { r: 2.6, flat: 0.6 };
// the path (across at distance d): from the near field, diagonally to the gap in the fence (12 m), on into the Fringes
const PATH = d => -3 + 0.36 * (d - 1);
const START_D = 1.5, END_D = 21, FENCE_D = 12, GAP = PATH(FENCE_D), BEYOND_D = 32;
// a ground point is in a tree's shadow: the crown's card at the tree's distance, the moon's light from MOON
const toward = [Math.sin((MOON.bearing * Math.PI) / 180), Math.cos((MOON.bearing * Math.PI) / 180)], k = 1 / Math.tan((MOON.height * Math.PI) / 180);
function shaded(X, D) {
  for (const t of TREES) {
    const up = (t.d - D) / (toward[1] * k);
    if (up <= 0) continue;
    const x = X - t.a + toward[0] * k * up;
    const u = (x - t.lean * 1.4) / CROWN.r, v = (up - t.h) / (CROWN.r * CROWN.flat);
    if (u * u + v * v <= 1) return true;
  }
  return false;
}
// the pools on the path, [into it, out of it] (distances)
const POOLS = [];
{
  let from = null;
  for (let d = START_D; d <= END_D; d += 0.05) {
    const s = shaded(PATH(d), d);
    if (s && from == null) from = d;
    if (!s && from != null) { POOLS.push([from, d]); from = null; }
  }
  if (from != null) POOLS.push([from, END_D]);
}
// the father with his lantern in the field, by the fence on the left; where his beam lies (lantern_turn: degrees, 0 away
// from us, 90 to the right) — a pool of light this far from him
const FATHER = [-6.2, 10.4], BEAM = 5.5;
const beamAt = turn => [FATHER[0] + BEAM * Math.sin((turn * Math.PI) / 180), FATHER[1] + BEAM * Math.cos((turn * Math.PI) / 180)];
// the way the fugitives go (points along the path), David first, Rosalind a little behind
const WAY = (d0, d1, step = 1) => { const p = []; for (let d = d0; d <= d1 + 1e-6; d += step) p.push([PATH(d), d]); return p; };
return { MOON, TREES, CROWN, PATH, START_D, END_D, FENCE_D, BEYOND_D, GAP, POOLS, shaded, FATHER, beamAt, WAY, clamp };
