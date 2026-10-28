// What the player is shown of how things stand (ui.js now, compare): the scales in words — no numbers — and the people,
// each in a few words: what they think of David now (the latest of the chapters' marks that are theirs: g.mark,
// state.marks). The path (force or tolerance) is never shown: the world answers it.

export const SCALES = {
  suspicion: { name: tr('Suspicion'), levels: [tr('no one notices anything'), tr('people look at you askance'), tr('the neighbours whisper'), tr('the inspector takes an interest in you'), tr('you are watched')] },
  group: { name: tr('The group'), levels: [tr('each on his own'), tr('you know one another'), tr('you hold together'), tr('you are one')] },
  petra: { name: tr('Petra'), levels: [tr('her call is barely heard'), tr('she is heard far off'), tr('she is heard over the sea')] },
};
export const level = (k, v) => SCALES[k].levels[Math.max(0, Math.min(SCALES[k].levels.length - 1, Math.round(v || 0)))];

// the people: their marks, earliest first, each value → what they think of David then
const PEOPLE = [
  { name: tr('Sophie'), marks: [
    ['sophie', { kept: tr('trusts you — you kept her secret'), told: tr('does not know you told about her') }],
    ['sophie_night', { warned: tr('is grateful: you warned them in time'), stayed: tr('thinks you knew and kept quiet') }],
    ['sophie_camp', { hid: tr('hid you — she is on your side'), gave: tr('gave you away to the Fringes') }]] },
  { name: tr('Mrs Wender'), marks: [['wender', { trusts: tr('trusts you as she would a grown-up'), doubts: tr('has her doubts about you') }]] },
  { name: tr('Mother'), marks: [['mother', { lied: tr('lied to your father for you') }]] },
  { name: tr('Father'), marks: [['father', { proud: tr('is proud of you'), disowned: tr('has disowned you'), saved: tr('is alive — you covered him with your body') }]] },
  { name: tr('The farmhand'), marks: [['calf', { hidden: tr('saw you hide the calf') }]] },
  { name: tr('Anne'), marks: [['anne', { free: tr('has left you — and knows everything'), widowed: tr('blames you for her husband’s death') }]] },
  { name: tr('Rosalind'), marks: [
    ['rosalind', { looked: tr('you two were seen together') }],
    ['rosalind_hold', { slipped: tr('you tore yourself out of her hands') }],
    ['rosalind_cover', { covered: tr('you covered her with your body') }]] },
  { name: tr('Petra'), marks: [['petra', { hushed: tr('is learning to think quietly'), free: tr('calls out at the top of her voice') }]] },
  { name: tr('The voice from over the sea'), marks: [['sealand', { answered: tr('hears Petra'), heard: tr('you did not answer her') }]] },
  { name: tr('Katherine and Sally'), marks: [['sally', { left: tr('left behind'), tried: tr('you tried to save them'), freed: tr('free, thanks to you') }]] },
  { name: tr('Sheba'), marks: [['sheba', { let: tr('went home'), took: tr('with you') }]] },
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
