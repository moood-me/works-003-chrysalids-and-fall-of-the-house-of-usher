// Инспектор на ферме — its mechanics, the game's keys turned into what the people do: the calf with the farmhand who holds
// it (its place by his); `verdict` — the inspector points at the barn's corner (0.3), the farmhand leads the calf there
// (0.55), the inspector lowers his hand and looks at the farmhand (1); `calf_present` 0 — David has taken the calf behind the
// barn while they talked: the farmhand lets the rope go and looks at the barn's corner (he saw), the inspector leafs his
// book; `david_present` — David peeking round the far corner of the barn, or gone behind it. (Where the inspector
// looks is his own key, inspector_look: the game's «Найди раньше него» leads it in lib.LOOK's order.)
const s = scene, L = s.lib, P = id => s.person(id);
const calf = () => s.set('calf_a', (s.get('farmhand_a') ?? -1.25) + L.CALF_OFF);
s.on('move', 'farmhand_a', calf);
s.on('change', 'farmhand_a', calf);
calf();
let stage = 0;
function verdict() {
  const v = s.get('verdict') || 0, now = v >= 1 ? 3 : v >= 0.55 ? 2 : v >= 0.3 ? 1 : 0;
  if (now === stage) return;
  stage = now;
  s.sequence(async q => {
    if (now >= 1) { P('inspector').reach({ r: 'barn#corner' }); P('inspector').look('barn#corner'); }
    if (now >= 2) {
      P('farmhand').look('barn#corner');
      await P('farmhand').walk([L.TO_BARN]);
      await P('farmhand').turn(90);
      P('farmhand').look('calf');
    }
    if (now >= 3) { P('inspector').reach(null); P('inspector').look('farmhand'); }
    if (now === 0) { P('inspector').reach(null); P('inspector').look('inspector#hand_l'); }
  }, { name: 'verdict' });
}
s.on('change', 'verdict', verdict);
s.on('move', 'verdict', verdict);
function present() {
  const here = (s.get('calf_present') ?? 1) > 0.5;
  P('farmhand').reach(here ? { r: 'calf#ring' } : null);
  P('farmhand').look(here ? 'calf#ring' : 'barn#corner');
  if (!here) P('inspector').do('ledger_read', { loop: true });
}
s.on('change', 'calf_present', present);
s.on('move', 'calf_present', present);
function david() {
  const here = (s.get('david_present') ?? 1) > 0.5;
  s.sequence(async q => {
    if (here) {
      P('david').here(true);
      await P('david').walk([L.DAVID.peek]);
      await P('david').turn(60);
      P('david').do('peek_corner', { loop: true });
      P('david').look('calf');
    } else {
      P('david').do('stand');
      await P('david').walk([L.DAVID.gone]);
    }
  }, { name: 'david' });
}
s.on('change', 'david_present', david);
