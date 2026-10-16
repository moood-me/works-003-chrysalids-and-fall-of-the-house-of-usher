// «The approach to the house»'s own little film, outside games: chapter I at dusk — the rider comes, looks (the gloom deepening, as
// the game's «Cause» deepens it look by look), the crack traced from the roof to the water, the vision in the tarn, on
// to the door; chapter II on the grey day — out of the house by the hand, to the middle, his breath, on to the shore;
// chapter III's morning and the ride away. Every beat of lib.js FILM in its order (SHOWCASE), each cut made ready ahead.
const L = scene.lib, F = L.FILM;
const film = {
  ...F,
  look: { ...F.look, run: async (s) => { await F.look.run(s); for (const k of [1, 2, 3]) await s.move("gloom", k / 3, { over: 3 }); } },
  trace: { ...F.trace, run: async (s) => { await F.trace.run(s); await s.move("crack_trace", 1, { over: 4, ease: "inOut" }); } },
};
return scene.kit.beats.showcase(scene, film, L.SHOWCASE);
