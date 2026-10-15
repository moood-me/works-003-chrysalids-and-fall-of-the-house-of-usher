// Корабль из Зеландии — its mechanics: the film in beats for the game (lib.js FILM, the world's module beats: `beat` names
// one); the web taking each one on the clearing at its own mark — a last struggle as it nears, then still under the silver
// (the cocoons are their elements: lib.cocoon) —, letting them go when the woman's spray raises the mark past it.
const s = scene, L = s.lib, P = id => s.person(id);
s.kit.beats.play(s, L.FILM);
const held = {}, near = {};
function web() {
  const w = s.get('web') || 0;
  for (const id of L.WEBBED) {
    const th = s.get(`${id}_th`) ?? L.TH[id];
    const on = th >= 0 && th <= 1.5 && w > th;
    const close = th > 0 && th <= 1.5 && w > th - 0.12 && !on && !s.get(`${id}_down`);
    if (close && !near[id]) { near[id] = true; P(id).do('flinch'); }
    if (!close) near[id] = false;
    if (on !== !!held[id]) { held[id] = on; P(id).still(on); }
  }
}
for (const k of ['web', ...L.WEBBED.map(id => `${id}_th`)]) { s.on('change', k, web); s.on('move', k, web); }
web();
