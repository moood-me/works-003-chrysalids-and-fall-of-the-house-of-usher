// What the player is shown of how things stand (ui.js now, compare): the scales in words — no numbers — and the people,
// each in a few words: what they think of David now (the latest of the chapters' marks that are theirs: g.mark,
// state.marks). The path (force or tolerance) is never shown: the world answers it.

export const SCALES = {
  suspicion: { name: 'Подозрение', levels: ['никто ничего не замечает', 'на тебя косятся', 'соседи шепчутся', 'тобой интересуется инспектор', 'за тобой следят'] },
  group: { name: 'Группа', levels: ['каждый сам по себе', 'вы знаете друг друга', 'вы держитесь вместе', 'вы — одно целое'] },
  petra: { name: 'Петра', levels: ['её зов едва слышен', 'её слышно далеко', 'её слышно за морем'] },
};
export const level = (k, v) => SCALES[k].levels[Math.max(0, Math.min(SCALES[k].levels.length - 1, Math.round(v || 0)))];

// the people: their marks, earliest first, each value → what they think of David then
const PEOPLE = [
  { name: 'Софи', marks: [
    ['sophie', { kept: 'верит тебе — ты сохранил её тайну', told: 'не знает, что ты рассказал о ней' }],
    ['sophie_night', { warned: 'благодарна: ты успел их предупредить', stayed: 'думает, что ты знал и промолчал' }],
    ['sophie_camp', { hid: 'спрятала вас — она на твоей стороне', gave: 'выдала тебя Окраинам' }]] },
  { name: 'Миссис Уэндер', marks: [['wender', { trusts: 'доверяет тебе, как взрослому', doubts: 'сомневается в тебе' }]] },
  { name: 'Мать', marks: [['mother', { lied: 'солгала отцу ради тебя' }]] },
  { name: 'Отец', marks: [['father', { proud: 'гордится тобой', disowned: 'отрёкся от тебя', saved: 'жив — ты закрыл его собой' }]] },
  { name: 'Работник', marks: [['calf', { hidden: 'видел, как ты прятал телёнка' }]] },
  { name: 'Энн', marks: [['anne', { free: 'ушла от вас — и знает всё', widowed: 'винит вас в смерти мужа' }]] },
  { name: 'Розалинда', marks: [
    ['rosalind', { looked: 'на вас смотрели вдвоём' }],
    ['rosalind_hold', { slipped: 'ты вырвался из её рук' }],
    ['rosalind_cover', { covered: 'ты укрыл её собой' }]] },
  { name: 'Петра', marks: [['petra', { hushed: 'учится думать тихо', free: 'зовёт в полный голос' }]] },
  { name: 'Голос из-за моря', marks: [['sealand', { answered: 'слышит Петру', heard: 'вы ей не ответили' }]] },
  { name: 'Кэтрин и Салли', marks: [['sally', { left: 'брошены', tried: 'ты пытался их спасти', freed: 'свободны благодаря тебе' }]] },
  { name: 'Шеба', marks: [['sheba', { let: 'ушла домой', took: 'с вами' }]] },
];
// the people as a run has them: [{ who, now: what they think of David }] — those who don't know him yet, left out
export const people = marks => PEOPLE.map(p => {
  const last = p.marks.filter(([k]) => marks[k]).at(-1);
  return last && { who: p.name, now: last[1][marks[last[0]]] ?? marks[last[0]] };
}).filter(Boolean);
// the same in two runs — what the people think otherwise: [{ who, was, now }]
export function differ(a, b) {
  const pa = new Map(people(a).map(p => [p.who, p.now])), pb = new Map(people(b).map(p => [p.who, p.now]));
  return [...new Set([...pa.keys(), ...pb.keys()])].filter(w => pa.get(w) !== pb.get(w)).map(w => ({ who: w, was: pa.get(w) ?? '—', now: pb.get(w) ?? '—' }));
}
