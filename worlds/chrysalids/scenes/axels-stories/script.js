// Axel’s stories — its mechanics: Axel tells (`story` above 0.2): he talks, his hand going toward the smoke where the
// visions come, and both look up there; when he does not, he sits still looking at the boy, and David at him.
// `david_present` — David here or not.
const s = scene, L = s.lib, P = id => s.person(id);
let telling = null;
function story() {
  const now = (+s.get('story') || 0) > 0.2;
  if (now === telling) return;
  telling = now;
  // (his hand out toward the smoke — a reach, so it never passes before his face as a talking gesture did)
  P('axel').do('perch_still', { loop: true });
  P('axel').reach(now ? { r: L.VISION } : null);
  P('axel').look(now ? L.VISION : 'david');
  P('david').look(now ? L.VISION : 'axel');
}
s.on('change', 'story', story);
s.on('move', 'story', story);
story();
const here = () => P('david').here(s.get('david_present') !== false);
s.on('change', 'david_present', here);
here();
