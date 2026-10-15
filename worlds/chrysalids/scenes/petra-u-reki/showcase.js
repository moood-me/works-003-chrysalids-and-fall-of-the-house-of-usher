// The river's own little film, outside games: the pool in the rain, the cry only their own hear, the far field, the boy's
// run and swim, the cry hitting hard on the field, Petra brought out, the two hearing each other across the water while the
// others stare, and home (lib.js SHOWCASE: the beats of lib.js FILM in that order, each cut made ready ahead). During edge
// and run a game's «Успокоить» moves `cry`: here it dies down and flares as it would.
const L = scene.lib;
const beats = scene.kit.beats.showcase(scene, L.FILM, L.SHOWCASE);
const i = L.SHOWCASE.indexOf('edge');
const breathe = { name: 'calming', run: async s => {
  for (let n = 0; n < 3; n++) { await s.move('cry', 0.4, { over: 1.6 }); await s.move('cry', 0.75, { over: 1.2 }); }
} };
return [...beats.slice(0, i), breathe, ...beats.slice(i)];
