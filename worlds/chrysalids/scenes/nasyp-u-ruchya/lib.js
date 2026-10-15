// the scene's shared code: the bank's ground (world metres: its profile, the land under the people — relief.js), where
// its features are, and the rider on the meadow (the chrysalids module's horse; the people are the engine's)
const BX = 1.4, Z0 = 5.0;                 // the action plane: the bank element stands at across 1.4, 5 m away
const TOPX = -3.6, TOPH = 2.2, LIP = -1.2, LIPH = 0.48, HC = -0.1, HW = 0.85, SX = 1.3;   // in the bank's own metres
function bankL(x) {
  if (x <= TOPX) return TOPH + 0.05 * Math.sin(x * 1.3 + 1) + 0.03 * Math.sin(x * 3.1) + (x < -6 ? 0.08 * (-6 - x) : 0);
  if (x <= LIP) { const u = (LIP - x) / (LIP - TOPX); return LIPH + (TOPH + 0.05 * Math.sin(TOPX * 1.3 + 1) + 0.03 * Math.sin(TOPX * 3.1) - LIPH) * Math.pow(u, 1.3); }
  if (x <= LIP + 0.26) { const u = (x - LIP) / 0.26; return LIPH * (1 - u * u * (3 - 2 * u)); }
  if (Math.abs(x - HC) < HW) { const q = Math.cos(Math.PI * (x - HC) / (2 * HW)); return 0.16 * q * q; }
  return 0;
}
// the ground's height at world across a, on the bank's line (relief.js lays it 2 m deep round it)
const groundAt = a => bankL(a - BX);
const people = {
  // a rider of the community on the meadow behind the children (the game's hooves):
  //   r_a, r_d — where (world metres: across, away; `place` puts the element there); r_face — degrees (0 toward us, 90 right)
  //   r_look — null (ahead) | 'children' (down the slope, at the two by the stones); r_toss — the horse tosses its head; r_vis
  rider: (e) => {
    const s = e.state;
    if ((s.r_vis ?? 0) < 0.01) return null;
    const a = s.r_a ?? -18, d = s.r_d ?? 17;
    const sun = s.sun ?? 1;
    return {
      horse: true, id: 'horse', kind: 'horse', at: [a, d], face: s.r_face ?? 70, pose: { toss: s.r_toss ?? 0 },
      col: { coat: '#4a3a2e', mane: '#241c17' },
      rider: { who: 'man', id: 'rider', seed: 11, build: { wear: { top: 'coat', coat: 0.7, hat: 'brim' } },
        look: s.r_look === 'children' ? [2.5 - a, -0.6, 5 - d] : undefined, lookSpeed: 0.4 },
      light: 0.5 - 0.1 * (1 - sun), rim: '#ffdfa6', rimDir: -100, rimWidth: 1.8, shadow: 0.3, view: 0.2,
    };
  },
};
const lib = { BX, Z0, TOPX, TOPH, LIP, LIPH, SX, bankL, groundAt, people,
  // world across of the bank's features
  topA: BX + TOPX, lipA: BX + LIP, heapA: BX + HC, stonesA: BX + SX,
  beforeFrame: (f) => kit.chrysalids.move(people, { ...f, lib, kit, anim }) };
return lib;
