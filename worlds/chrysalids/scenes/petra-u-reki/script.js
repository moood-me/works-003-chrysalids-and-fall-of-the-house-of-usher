// Петра у реки — its mechanics: the film in beats for the game (lib.js FILM, the world's module beats: `beat` names one);
// those in the pool kept afloat — their feet held over the deep bottom so the water comes to David's ribs (his head and shoulders over it as he swims), to Petra's
// chin (pt_e, dv_e: their places' elevation over the land), Petra dragged under as `pt_sink` says.
const s = scene, L = s.lib;
s.kit.beats.play(s, L.FILM);
function afloat() {
  s.set('pt_e', Math.max(0, L.afloat(s.get('petra_a'), 0.8) - 0.55 * (s.get('pt_sink') || 0)));
  s.set('dv_e', L.afloat(s.get('david_a'), 0.7)); // (the water to his ribs: swimming crouched, his head and shoulders over it)
}
for (const k of ['petra_a', 'david_a', 'pt_sink']) { s.on('change', k, afloat); s.on('move', k, afloat); }
afloat();
