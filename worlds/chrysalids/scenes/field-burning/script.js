// The burning of the field — its mechanics: the film in beats for the game (lib.js FILM, the world's module beats: `beat` names one);
// the fire's front and its light kept with `ignite`, `fire`, `ash`; the ones in front turning round to David as `turned`
// grows (the game's “Sing with everyone” moves it; a beat may too) — each at its own mark, each late in its own way, the body
// half way round, the head the rest.
const s = scene, L = s.lib, P = id => s.person(id), c = L.clamp;
s.kit.beats.play(s, L.FILM);
// the fire's two fronts on the burning field (where its flames' particles and its lights are), and how much it lights
// the world (fire_light: the lights' `on`)
function front() {
  const ign = s.get('ignite') || 0, reach = ign * 50;
  s.set('front_r', Math.min(30, L.X0 + Math.max(0.1, reach - 0.6)));
  s.set('front_l', Math.max(L.FIELD_L + 0.3, L.X0 - Math.max(0.1, reach - 0.6)));
  s.set('fire_light', L.fireLight(s.state));
}
for (const k of ['ignite', 'fire', 'ash']) { s.on('change', k, front); s.on('move', k, front); }
front();
// turned: each of the six in front at its mark turns to David — after its own delay (½…1 s) — the body a part of the way
// round, the head the rest; back to the fire as it falls under the mark again
const toward = ([a, d], [a2, d2]) => (((Math.atan2(a2 - a, d2 - d) * 180) / Math.PI) + 360) % 360;
const facing = {};
function turned() {
  const v = s.get('turned') || 0;
  L.MEMBERS.forEach((m, i) => {
    if (m.mark == null) return;
    const on = v > m.mark;
    if (facing[m.id] === on) return;
    facing[m.id] = on;
    s.after(0.5 + 0.5 * ((i * 0.618) % 1), () => {
      if (((s.get('turned') || 0) > m.mark) !== on) return;
      const to = toward(m.at, L.DV);
      let half = (((to - m.face) % 360) + 540) % 360 - 180;
      P(m.id).turn(on ? (m.face + half * 0.7 + 360) % 360 : m.face);
      P(m.id).look(on ? 'dv' : L.TORCH);
      if (on) P(m.id).do('stand');
      else if (s.get('beat') && /hymn/.test(s.get('beat'))) P(m.id).do(m.shade ? 'sing_stand' : 'sing_book', { loop: true });
    });
  });
}
s.on('change', 'turned', turned);
s.on('move', 'turned', turned);
turned(); // (opened, or restored: the ones in front as the key has them)
// dv_kneel (the game's: “Kneel” chosen while the others go down): David goes down on his knees at once, with
// them — not when the beat that raised the torch has ended
function kneel() {
  if (!s.get('dv_kneel')) return;
  s.sequence(async q => {
    await q.person('dv').go('kneel_down', { from: L.DV, turn: 150 });
    q.person('dv').do('kneel_pray', { loop: true });
  }, { name: 'dv_kneel' });
}
s.on('change', 'dv_kneel', kneel);
