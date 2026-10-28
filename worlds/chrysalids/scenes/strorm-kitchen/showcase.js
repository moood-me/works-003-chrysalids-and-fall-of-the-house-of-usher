// The kitchen's own little film, outside games: the evening of the third hand as the book tells it — the boy in with
// his cut hand, his mother binding it, the slip and the pale third hand, the boy on his knees before his father, sent up
// to bed — then a night at the table years later and the boy slipping out (lib.js SHOWCASE: the beats of lib.js FILM
// in that order, each cut made ready ahead). Between the evening and the night, what the game's keys do at the table:
// the boy holding its edge, shivering, letting go, the father looking up.
const L = scene.lib;
const beats = scene.kit.beats.showcase(scene, L.FILM, L.SHOWCASE);
const i = L.SHOWCASE.indexOf('late');
const table = { name: 'the table', run: async s => {
  s.set('at_table', true);
  await s.wait(2.5);
  s.set('david_stir', 1);
  await s.wait(2.0);
  s.set('father_look', 1);
  await s.wait(1.8);
  s.set('father_look', 0);
  s.set('david_stir', 0);
  await s.wait(1.2);
  s.set('david_grip', 0);
  await s.wait(2.0);
  s.set('david_grip', 1);
  await s.wait(1.0);
} };
return [...beats.slice(0, i + 1), table, ...beats.slice(i + 1)];
