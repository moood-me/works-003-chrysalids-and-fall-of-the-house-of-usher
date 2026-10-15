// Roderick's room for the game: `beat` names the beat to play (the world's module beats; the beats — lib.js FILM,
// notes.md lists them). Outside games the scene plays them all as its showcase.
scene.kit.beats.play(scene, scene.lib.FILM);

// The keys the room's lights are on, kept from what the game turns (lib.js light): the windows' grey by day and dusk-red
// in the evening (lights window, dusk, sky_day, sky_dusk — past the curtain, sinking with the song), and the thread of
// smoke from the candlestick's side candles once they are out but the middle one burns. Followed as those keys move.
const keep = () => {
  const L = scene.lib.light(scene.state);
  // (1 as the room was found — window_light 0.5, the curtain open; in the evening, as dusk comes through it — and
  // brighter; the curtain drawn, the night, the song: much less. The room's ambient follows it: looks)
  const w = Math.min(1, L.window / (0.5 * (1 - 0.6 * L.evening))) ** 1.5;
  scene.set('window_day', w * (1 - L.evening));
  scene.set('window_dusk', w * L.evening);
  scene.set('wick_smoke', L.candles > 0.02 && L.candles < 0.45 ? 1 : 0);
};
for (const key of ['window_light', 'curtain', 'window_open', 'evening', 'song', 'candles']) {
  scene.on('change', key, keep);
  scene.on('move', key, keep);
}
keep();
