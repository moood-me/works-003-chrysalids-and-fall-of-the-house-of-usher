// «Трещина» outside the game: a chapter's title on the wall; after the chapter, the crack of its choices coming down;
// after the epilogue, the crack of the whole play. Each wall cut to whole (made ready while the one before plays), the
// crack coming down as long as the game gives it (game.js: 3.5 s a title, 2.5 s + 1.2 s a row a map), then the knot
// breathing a while, as the player would find it.
const opt = (label, state) => ({ label, state });
const WALLS = [
  { name: 'Приезд', state: { chapter_number: 'I', chapter_title: 'Приезд', map: null } },
  { name: 'Карта главы I', state: { chapter_number: 'I', chapter_title: 'Приезд', map: [
    { title: 'Пруд', weight: '~', options: [opt('посмотреть в воду', 'chosen'), opt('ехать к дому', 'open')] },
    { title: 'Его комната', weight: '~', options: [opt('по-его', 'open'), opt('по-своему', 'chosen')] },
    { title: 'Мэдлин проходит', weight: '⚑', options: [opt('пойти за ней', 'chosen'), opt('остаться с ним', 'open')] },
    { title: 'Её просьба', weight: '~', options: [opt('— Обещаю', 'unseen'), opt('промолчать', 'unseen')] },
  ] } },
  { name: 'Склеп', state: { chapter_number: 'III', chapter_title: 'Склеп', map: null } },
  { name: 'Вся игра', state: { chapter_number: '', chapter_title: 'Эпилог', map: [
    { title: 'I. Мэдлин проходит', weight: '⚑', options: [opt('пойти за ней', 'open'), opt('остаться с ним', 'chosen')] },
    { title: 'II. Врач', weight: '⚑', options: [opt('рассказать', 'chosen'), opt('промолчать', 'open')] },
    { title: 'III. Крышка', weight: '⚑', options: [opt('«она может быть жива»', 'chosen'), opt('«не закрывай»', 'open'), opt('промолчать', 'open')] },
    { title: 'III. Винты', weight: '⚑', options: [opt('завинтить', 'open'), opt('оставить слабо', 'chosen')] },
    { title: 'III. Звук снизу', weight: '⚑', options: [opt('спуститься', 'chosen'), opt('сказать ему', 'open'), opt('«это ветер»', 'open')] },
    { title: 'Конец', weight: '⚑', options: [opt('Как у По', 'open'), opt('Мэдлин', 'chosen'), opt('Родерик', 'open'), opt('Оба', 'open'), opt('Остался', 'open'), opt('Уехал', 'open')] },
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
