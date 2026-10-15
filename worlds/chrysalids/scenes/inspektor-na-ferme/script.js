// Инспектор на ферме — its mechanics, the game's keys turned into what the people do: the calf with the farmhand who holds
// it (its place by his); `verdict` — the inspector points at the barn's corner (0.3), the farmhand leads the calf there
// (0.55), the inspector lowers his hand and looks at the farmhand (1); `calf_present` 0 — David has taken the calf behind the
// barn while they talked: the farmhand lets the rope go and looks at the barn's corner (he saw), the inspector leafs his
// book; `david_present` — David peeking round the far corner of the barn, or gone behind it. (Where the inspector
// looks is his own key, inspector_look: the game's «Найди раньше него» leads it in lib.LOOK's order.) Opened (or restored),
// the scene stands at once as its keys say: what they did is done, nobody walks there.
const s = scene, L = s.lib, P = id => s.person(id);
const calf = () => s.set('calf_a', (s.get('farmhand_a') ?? -1.25) + L.CALF_OFF);
s.on('move', 'farmhand_a', calf);
s.on('change', 'farmhand_a', calf);
calf();
let stage = 0;
// the verdict's stage: 0, 1 — the hand to the barn's corner, 2 — the calf led there, 3 — the hand down; at once — opened
function verdict(once) {
  const v = s.get('verdict') || 0, now = v >= 1 ? 3 : v >= 0.55 ? 2 : v >= 0.3 ? 1 : 0;
  if (now === stage && !once) return;
  stage = now;
  if (once) {
    if (now >= 2) { s.set('farmhand_a', L.TO_BARN[0]); s.set('farmhand_d', L.TO_BARN[1]); s.set('farmhand_turn', 90); P('farmhand').look('calf'); }
    if (now >= 1) { P('inspector').reach(now >= 3 ? null : { r: 'barn#corner' }); P('inspector').look(now >= 3 ? 'farmhand' : 'barn#corner'); }
    return;
  }
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
s.on('change', 'verdict', () => verdict(false));
s.on('move', 'verdict', () => verdict(false));
function present() {
  const here = (s.get('calf_present') ?? 1) > 0.5;
  P('farmhand').reach(here ? { r: 'calf#ring' } : null);
  P('farmhand').look(here ? 'calf#ring' : 'barn#corner');
  if (!here) P('inspector').do('ledger_read', { loop: true });
}
s.on('change', 'calf_present', present);
s.on('move', 'calf_present', present);
// David at the far corner of the barn, peeking — or gone behind it; at once — opened
function david(once) {
  const here = (s.get('david_present') ?? 1) > 0.5, to = here ? L.DAVID.peek : L.DAVID.gone;
  if (once) {
    s.set('david_a', to[0]); s.set('david_d', to[1]);
    if (here) { s.set('david_turn', 60); P('david').do('peek_corner', { loop: true }); P('david').look('calf'); } else P('david').do('stand');
    return;
  }
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
s.on('change', 'david_present', () => david(false));
verdict(true);
if ((s.get('calf_present') ?? 1) <= 0.5) present();
david(true);
