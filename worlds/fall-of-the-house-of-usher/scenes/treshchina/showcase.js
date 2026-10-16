// «Crack» outside the game: a chapter's title on the wall; after the chapter, the crack of its choices coming down;
// after the epilogue, the crack of the whole play. Each wall cut to whole (made ready while the one before plays), the
// crack coming down as long as the game gives it (game.js: 3.5 s a title, 2.5 s + 1.2 s a row a map), then the knot
// breathing a while, as the player would find it.
const opt = (label, state) => ({ label, state });
const WALLS = [
  { name: tr('The arrival'), state: { chapter_number: 'I', chapter_title: tr('The arrival'), map: null } },
  { name: tr('Map of chapter I'), state: { chapter_number: 'I', chapter_title: tr('The arrival'), map: [
    { title: tr('The tarn'), weight: '~', options: [opt(tr('into the water'), 'chosen'), opt(tr('ride on'), 'open')] },
    { title: tr('His chamber'), weight: '~', options: [opt(tr('his way'), 'open'), opt(tr('my way'), 'chosen')] },
    { title: tr('Madeline passes'), weight: '⚑', options: [opt(tr('follow her'), 'chosen'), opt(tr('stay with him'), 'open')] },
    { title: tr('Her plea'), weight: '~', options: [opt(tr('— I promise'), 'unseen'), opt(tr('say nothing'), 'unseen')] },
  ] } },
  { name: tr('The vault'), state: { chapter_number: 'III', chapter_title: tr('The vault'), map: null } },
  { name: tr('The whole game'), state: { chapter_number: '', chapter_title: tr('Epilogue'), map: [
    { title: tr('I. Madeline passes'), weight: '⚑', options: [opt(tr('follow her'), 'open'), opt(tr('stay with him'), 'chosen')] },
    { title: tr('II. The physician'), weight: '⚑', options: [opt(tr('tell him of it'), 'chosen'), opt(tr('say nothing'), 'open')] },
    { title: tr('III. The lid'), weight: '⚑', options: [opt(tr('“she may be living”'), 'chosen'), opt(tr('“do not close it”'), 'open'), opt(tr('say nothing'), 'open')] },
    { title: tr('III. The screws'), weight: '⚑', options: [opt(tr('screw it down'), 'open'), opt(tr('leave them loose'), 'chosen')] },
    { title: tr('III. A sound below'), weight: '⚑', options: [opt(tr('go down'), 'chosen'), opt(tr('tell him'), 'open'), opt(tr('“only the wind”'), 'open')] },
    { title: tr('The end'), weight: '⚑', options: [opt(tr('As in Poe'), 'unseen'), opt(tr('Madeline'), 'chosen'), opt(tr('Roderick'), 'unseen'), opt(tr('Both'), 'unseen'), opt(tr('Stayed'), 'unseen'), opt(tr('Left'), 'unseen')] },
  ] } },
];
const start = w => ({ ...w.state, reveal: 0, knot: 1 });
const seconds = w => (w.state.map ? 2.5 + w.state.map.length * 1.2 : 3.5);
// (the next wall made ready as each begins — for that one only: a jump lands on any of them)
let next = null;
return WALLS.map((w, i) => ({
  name: w.name,
  run: async s => {
    if (next?.for === w.name) next.shot.cut();
    else s.cut(start(w));
    next = WALLS[i + 1] ? { for: WALLS[i + 1].name, shot: scene.shot(start(WALLS[i + 1])) } : null;
    await s.move('reveal', 1, { over: seconds(w), ease: 'linear' });
    await s.wait(4);
  },
}));
