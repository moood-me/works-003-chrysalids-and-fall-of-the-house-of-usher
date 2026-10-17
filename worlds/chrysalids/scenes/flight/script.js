// Flight — its mechanics: the film in beats for the game (lib.js FILM, the world's module beats: `beat` names one); the
// riders' feet and hands kept on their horses' stirrups and reins as the horses turn; Sheba on her rope behind the pack
// horse once she is led; Petra in the pannier peeking out as far as `petra_peek` says; the front searcher's lantern
// (lamp: held up toward lamp_x on the fog; search_point: his arm pointing into the hollow) — the game's “Quiet, horses”
// moves those.
const s = scene, L = s.lib, P = id => s.person(id);
s.kit.beats.play(s, L.FILM);
// the riders' tack as their horses turn
for (const [who, horse] of Object.entries(L.RIDERS)) {
  const keep = () => {
    const on = s.get(`${who}_on`);
    if (on && on.at === `${horse}#seat`) P(who).reach(s.kit.chrysalids.horse.tack(horse, s.get(L.HORSES[horse].face), L.HORSES[horse].kind));
  };
  s.on('change', L.HORSES[horse].face, keep);
  s.on('move', L.HORSES[horse].face, keep);
  s.on('change', `${who}_on`, keep);
  keep();
}
// Sheba led on her rope behind the pack horse
const led = () => { if (s.get('sheba_led')) s.set('sheba_a', s.get('pack_a') - 2.6); };
s.on('move', 'pack_a', led);
s.on('change', 'sheba_led', led);
// Petra in the near pannier, peeking out: higher in it as petra_peek grows
const peek = () => {
  const on = s.get('petra_on');
  if (on && typeof on.at === 'string' && on.at.startsWith('great#basket')) P('petra').on({ at: on.at, up: -0.55 + 0.3 * (s.get('petra_peek') || 0) });
};
s.on('change', 'petra_peek', peek);
s.on('move', 'petra_peek', peek);
// the front searcher's lantern and arm: up toward where it shines on the fog (lamp_x), pointing into the hollow
const lantern = () => {
  if (!s.get('searcher_on')) return;
  const lamp = s.get('lamp') || 0, x = s.get('lamp_x') ?? 6, point = s.get('search_point') || 0;
  P('searcher').reach(lamp > 0.05 || point > 0.05 ? { r: [x, L.D + 0.8, 1.2 + 0.8 * lamp], ...(point > 0.05 ? { l: [x + 2 * point, L.D + 1.5, 0.6] } : {}) } : s.kit.chrysalids.horse.tack('horse1', s.get('h1_face'), 'horse'));
  if (lamp > 0.05) P('searcher').look([x, L.D + 0.5, -0.3]);
};
for (const k of ['lamp', 'lamp_x', 'search_point']) { s.on('change', k, lantern); s.on('move', k, lantern); }
