// The Strorm kitchen — its mechanics: the film in beats for the game (lib.js FILM, the world's module beats: `beat` names
// one), and the night at the table — the game's keys turned into what the people do (below).
const L = scene.lib, P = id => scene.person(id);
const loop = motion => ({ motion, loop: true });
scene.kit.beats.play(scene, L.FILM);
// ── the night at the table («Не шелохнуться»): at_table — the boy sits at Mary's place; there, holding the table's edge
// (david_grip) — still, or shivering with how hard he holds still (david_stir); let go — fidgeting, looking about. The
// father looks up at him from the Book, and back down to it (father_look). ──
function still() {
  const s = scene.state;
  if (!s.at_table) return;
  const grip = (s.david_grip ?? 1) > 0.5, stir = (s.david_stir ?? 0) > 0.25;
  P('david').do(grip ? (stir ? 'sit_tremble' : 'sit_grip') : 'sit_fidget', { loop: true });
  P('david').reach(grip ? L.EDGE(...L.SEAT.mary) : null);
  P('david').look(grip ? [L.SEAT.mary[0], L.SEAT.mary[1] - 0.5, 0.8] : null);
}
for (const k of ['david_grip', 'david_stir', 'at_table']) scene.on('change', k, still);
scene.on('change', 'father_look', v => { if (scene.get('at_table')) P('joseph').look(v > 0.5 ? 'david' : null); });
