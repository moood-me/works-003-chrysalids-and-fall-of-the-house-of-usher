// The forge's own little film, outside games: the night forge — the boy chattering to the far window, his uncle's question,
// the truth, the door, the hush, the father's lantern, after — and the night of the key with the stranger in the gap (lib.js
// SHOWCASE: the beats of lib.js FILM in that order, each cut made ready ahead). Between the key and the stranger, what a
// game's keys do here («Ритм мехов»): blows on the beat, the boy's pulls with them, the fire breathing, the lantern turning.
const L = scene.lib;
const beats = scene.kit.beats.showcase(scene, L.FILM, L.SHOWCASE);
const i = L.SHOWCASE.indexOf('key');
const rhythm = { name: 'the bellows', run: async s => {
  s.set('ax_work', 0);
  s.set('pump_work', 0);
  for (let n = 0; n < 6; n++) {
    s.set('ax_blow', n + 1);
    await s.wait(1.17);
    s.move('pump', 1, { over: 0.3 });
    s.move('fire', 0.85, { over: 0.25 });
    await s.wait(0.35);
    s.move('pump', 0, { over: 0.9 });
    s.move('fire', 0.6, { over: 1.0 });
    await s.wait(0.1);
  }
  s.set('ax_pace', 1.4);
  s.set('ax_work', 1);
  s.set('pump_work', 1.3);
} };
return [...beats.slice(0, i + 1), rhythm, ...beats.slice(i + 1)];
