// Хризалиды — по роману Джона Уиндема. A bespoke game (moood/engines/bespoke) on the world «Хризалиды v3» (engine 3):
// the player is David; chapters one after another, each a row of steps on the world's scenes; their
// choices, the scales (suspicion, the group, Petra's strength, the path) and what people remember
// carry from chapter to chapter. The map of the play: the whole play on the night sky of the scene «Нити» — the
// chapters left to right at its points, a tree of each one's choices (its rows: the forks) drawn by the game itself
// over it (map.js), the chapters to come only numbered; the sky comes to a chapter (`shown`: the scene moves it there over a second — to the chapter of what is pressed), the
// player drags it anywhere. In the corner, how things stand now (ui.js now). What can be done on it is the map's own
// drawing — pressed, the language's mark of a plain choice opens right there, born open with its petals (story.js
// hub.ask; a touch off them folds it, nothing waits idle): the main run's pointer «продолжить игру» — «Начать»,
// «Продолжить» (from the beginning of the step it stopped in); a chapter played, its knot or head — «Переиграть
// главу»; each fork the main run reached in it, its dot or answer — «Переиграть отсюда» (from that step, with all the
// main run chose before it). The play begins on the map, comes to it after each chapter, by ☰ (the page's: the step going on is
// left — played again from its beginning), and whenever it is opened again. Its author has one more sign (at the map's
// left edge): his map of the chapters and their steps (ui.js author) — straight to any step, or a minigame of one: a
// replay from there, as if nothing was chosen before it.
//
// The play is one — its main run, as far as the player has come: never mixed with anything. A replay (begun on the map)
// goes on its own and is never kept: closed, it is gone. Meanwhile the plate «Переигровка» in the corner; on the map its
// thread pale beside the main run's, its pointer under the last fork it played — «Продолжить переигровку» or «Вернуться
// к основной» (the main run played on at once); whatever would leave it (another choice) asks first, its mark opening
// again — «Бросить переигровку». Played to its chapter's end (its pointer gone), the player keeps it, on its knot —
// «Оставить»: it becomes the main run from the next chapter on, the chapters after it to be played anew (said beside,
// with how things would stand) — or not, «Отменить».
//
// What is kept of the play (bespoke.keep), after every step: the main run — { chapter, step, scales, marks, choices } —,
// steps: {chapter: [the main run as each of its steps began, and as it ended]} (what «Переиграть отсюда» starts from),
// seen: {chapter: how many of its steps the player has ever played through} — never lessened. The page's ⏭
// (bespoke.forward, story.js) is the player's only where they have been: in a step not past what they have seen of its
// chapter — on to the next interaction —, and in a minigame there, or one they have been in for 20 s (story.js SKIPPABLE).
import { SCENES, context, listen } from './story.js';
import { jump } from './jump.js';
import { unheard, pause } from './sound.js';
import { ui } from './ui.js';
import { trees } from './map.js';
import { SCALES, level, people, differ } from './journal.js';
import one from './chapters/1.js';
import two from './chapters/2.js';
import three from './chapters/3.js';
import four from './chapters/4.js';
import five from './chapters/5.js';
import six from './chapters/6.js';
import seven, { ENDINGS, epilogue } from './chapters/7.js';

const CHAPTERS = [one, two, three, four, five, six, seven];
const END = CHAPTERS.length; // «Нити»'s last place: how the play ended
const NITI = SCENES.niti;
const GO = 1; // s: the sky going from one chapter to another
const REVEAL = 6; // s: a chapter's threads growing on the sky, row by row, as it has been played through
const RUN = { chapter: 0, step: 0, scales: { suspicion: 0, group: 0, petra: 0, path: 0 }, marks: {}, choices: {} };

export default async function (b) {
  await b.css('ui.css');
  // the language of mini-games in this game's hand: the book's serif, muted colours
  b.minigame.style({ key: 'C_MAJOR_A_MINOR', font: 'Georgia, "Times New Roman", serif', colors: { mark: '#efe6d2', fill: '#d9b878', good: '#a9c79a', danger: '#c8604a', fork: '#a8b4cc', ghost: 'rgba(239, 230, 210, 0.5)' } });
  const hub = listen(b);
  const view = ui(b.layer);
  b.onPause(pause);
  let kept = load(b.saved);
  // the replay going on, never kept: {run, steps: its chapter's states as its steps began, done: played to its end}
  let replay = null;
  const keep = next => { kept = next; return b.keep(kept); };
  // the minigames a step plays (as one who chose nothing before plays it: its first options) — the step played through
  // unseen, once
  const listed = new Map();
  const plays = (chapter, step) => {
    const k = `${chapter}:${step}`;
    if (!listed.has(k)) {
      const j = jump(Infinity, unheard()), g = context(b, view, hub, structuredClone({ ...RUN, chapter, step }), j);
      listed.set(k, Promise.race([CHAPTERS[chapter].steps[step](g).catch(() => {}), j.idle]).then(() => j.plays.map(m => m.title || '…')));
    }
    return listed.get(k);
  };
  // the author's map (his sign on «Нити» opens it): where it goes to is what the map waiting now is told
  let jumped = () => {};
  const author = b.game.mine ? view.author({ chapters: CHAPTERS, at: () => replay?.run ?? kept, plays, go: (chapter, step, play) => jumped({ jump: { chapter, step, play } }) }) : null;
  // ☰ while the play goes on: to the map (on the map itself there is none)
  const away = () => new Promise(ok => b.menu(() => ok('away')));

  for (let after = {}; ;) {
    const to = await map(after);
    after = {};
    if (to === 'drop') { replay = null; continue; }
    if (to === 'keep') {
      await keepReplay();
      if (kept.chapter === END) after = { end: true };
      continue;
    }
    if (to === 'main' || to === 'back') replay = null; // («Вернуться к основной»: the main run goes on from where it stands)
    else if (to !== 'replay') replay = replayFrom(to);
    view.replaying(!!replay);
    if ((await play()) === 'away') continue;
    if (replay) {
      replay.done = true;
      after = { reveal: replay.run.chapter };
      continue;
    }
    const done = kept.chapter;
    await onward();
    after = { reveal: done, end: kept.chapter === END };
  }

  // the run being played (the replay, else the main run), step by step to its chapter's end → 'done'; or till ☰ → 'away'
  async function play() {
    for (;;) {
      const r = replay ? replay.run : kept, ch = CHAPTERS[r.chapter];
      if (r.step >= ch.steps.length) return 'done';
      view.eye(r.scales.suspicion);
      // (gone to a minigame of it by the author's map: the step played up to it unseen)
      const g = context(b, view, hub, structuredClone(run(r)), r.play != null ? jump(r.play, unheard()) : null,
        { forward: r.step < (kept.seen[r.chapter] ?? 0) });
      const how = await Promise.race([
        ch.steps[r.step](g).then(() => 'done', e => { b.trouble(`шаг сломался: ${e.message || e}`); return 'broke'; }),
        away(),
      ]);
      if (how === 'done') await g.done();
      else g.leave();
      if (how === 'away') return 'away';
      // (a step that broke: passed with nothing of it kept)
      const next = { ...run(how === 'broke' ? r : g.state), step: r.step + 1 };
      const seen = { ...kept.seen, [r.chapter]: Math.max(kept.seen[r.chapter] ?? 0, next.step) };
      if (replay) {
        replay.run = next;
        replay.steps[next.step] = next;
        await keep({ ...kept, seen });
      } else await keep({ ...kept, ...next, seen, steps: { ...kept.steps, [r.chapter]: Object.assign([...(kept.steps[r.chapter] ?? [])], { [next.step]: next }) } });
    }
  }
  // the main run on to the next chapter, kept as it begins it
  function onward() {
    const on = { ...run(kept), chapter: kept.chapter + 1, step: 0 };
    return keep({ ...kept, ...on, steps: { ...kept.steps, [on.chapter]: [on] } });
  }
  // a replay begun on the map: a chapter from its beginning (`chapter:i`) or from a fork's step (`fork:i:s`) — as the
  // main run was then —, or where the author's map went ({jump}: as if nothing was chosen before it)
  function replayFrom(to) {
    if (to.jump) {
      const { chapter, step, play } = to.jump, r = { ...structuredClone(RUN), chapter, step, ...(play != null ? { play } : {}) };
      return { run: r, steps: Object.assign([], { [step]: run(r) }), done: false };
    }
    const [, i, s = 0] = to.split(':').map(Number), at = kept.steps[i];
    return { run: structuredClone(at[s]), steps: structuredClone(at.slice(0, s + 1)), done: false };
  }
  // a replay played to its end, kept: the main run from the next chapter on — what came after it in the main run gone
  function keepReplay() {
    const i = replay.run.chapter, on = { ...run(replay.run), chapter: i + 1, step: 0 }, steps = replay.steps;
    replay = null;
    return keep({ ...on, steps: { ...pick(kept.steps, j => j < i), [i]: steps, [i + 1]: [on] }, seen: kept.seen });
  }

  // «Нити», the map: the play on the sky, where it is now in the middle (the replay's chapter, else the main run's).
  // What brought the play here: a chapter played through (reveal: its threads grow — its forks offered once they have
  // —, then the sky goes on to where the play is now), the end reached (end: how it ended, years later, said meanwhile).
  // → what was picked: an option's id, or {jump} — the author's map
  async function map({ reveal = null, end = false }) {
    b.menu(null);
    view.replaying(!!replay);
    const here = replay ? replay.run.chapter : Math.min(kept.chapter, END);
    await b.show(NITI, { state: { shown: reveal ?? here }, captions: false });
    const drawn = trees(b, sky(), { shown: reveal ?? here, grow: reveal, seconds: REVEAL, author: !!author });
    const hideNow = view.now(now(replay?.run ?? kept)), hideCompare = replay?.done ? view.compare(compared()) : () => {};
    const g = context(b, view, hub, kept); // (what the map says: the epilogue)
    let grown = reveal == null, asked = null; // (an option that would leave the replay: asked again)
    let at = reveal ?? here; // (the chapter the sky is at)
    const go = i => { if (i !== at) { at = i; b.set('shown', i); drawn.shown(i); } };
    // (something of a chapter pressed — the sky goes to it)
    const touched = ref => { const i = /^(?:knot|fork|go|cursor):(\d+)/.exec(ref)?.[1]; if (i != null) go(Number(i)); };
    const arrived = () => {
      go(here);
      if (end) g.wait(GO * 1000).then(() => epilogue(g, ENDINGS.find(e => e.id === kept.marks.ending)?.id));
    };
    if (reveal == null) arrived();
    // what the map's drawing offers now; pressed — told here (while a choice is open nothing else is pressed: a touch
    // off its petals folds it)
    let pressed = () => {};
    const offer = () => drawn.offer(Object.keys(marks(asked, grown ? null : reveal)), ref => pressed(ref));
    // (the chapter just played grown: its forks offered too, the sky on to where the play is)
    const growing = grown ? null : setTimeout(() => { grown = true; offer(); arrived(); }, REVEAL * 1000);
    try {
      for (let again = null; ;) {
        offer();
        // (a choice that would leave the replay: its mark opens again at once, asking)
        const ref = again ?? await new Promise(ok => { pressed = ok; jumped = ok; });
        pressed = () => {};
        jumped = () => {};
        again = null;
        if (ref.jump) return ref;
        touched(ref);
        const options = marks(asked, grown ? null : reveal)[ref];
        const picked = options ? await hub.ask(drawn.at(ref), options) : null;
        if (!picked) { asked = null; continue; }
        if (picked.id === 'author') { author(); continue; }
        if (replay && !['replay', 'keep', 'drop'].includes(picked.id) && asked !== picked.id) { asked = picked.id; again = ref; continue; }
        return picked.id;
      }
    } finally {
      clearTimeout(growing);
      jumped = () => {};
      g.leave();
      hub.withdraw();
      hideNow();
      hideCompare();
      drawn.remove();
    }
  }
  // what can be done on the map: {ref (map.js: what of its drawing is pressed): options} — `asked`: the option that
  // would leave the replay, now «Бросить переигровку»; `growing`: the chapter whose forks are not there yet
  function marks(asked, growing) {
    const offers = {};
    const add = (ref, id, label) => { (offers[ref] ??= []).push({ id, label: id === asked ? 'Бросить переигровку' : label }); };
    if (replay) {
      const i = replay.run.chapter;
      if (replay.done) { add(`knot:${i}`, 'keep', 'Оставить'); add(`knot:${i}`, 'drop', 'Отменить'); }
      else { add(`cursor:${i}`, 'replay', 'Продолжить переигровку'); add(`cursor:${i}`, 'back', 'Вернуться к основной'); }
    }
    if (kept.chapter < END) add(`go:${kept.chapter}`, 'main', kept.step ? 'Продолжить' : 'Начать');
    for (let i = 0; i < Math.min(kept.chapter, END); i++) {
      if (kept.steps[i]?.[0]) add(`knot:${i}`, `chapter:${i}`, 'Переиграть главу');
      if (i === growing) continue;
      CHAPTERS[i].choices.forEach((c, k) => {
        const s = fork(i, c.id);
        if (s != null) add(`fork:${i}:${k}`, `fork:${i}:${s}`, 'Переиграть отсюда');
      });
    }
    if (author) add('author', 'author', 'Карта автора');
    return offers;
  }
  // the step of chapter i in which the main run made the choice `id`: the first that began without it and ended with
  // it — known where both states are kept
  function fork(i, id) {
    const at = kept.steps[i] ?? [];
    for (let s = 0; s + 1 < at.length; s++) if (at[s] && at[s + 1] && !(id in at[s].choices) && id in at[s + 1].choices) return s;
    return null;
  }
  // a replay played to its end: how things would stand if it is kept, beside the main run as it came out of that
  // chapter, and whether chapters the main run has played since are to be played anew
  function compared() {
    const i = replay.run.chapter, main = kept.steps[i + 1]?.[0];
    return { main: main && now(main), replay: now(replay.run), people: main ? differ(main.marks, replay.run.marks) : [],
      again: kept.chapter > i + 1 || (kept.chapter === i + 1 && kept.step > 0) };
  }
  // the chapters as «Нити» draws them: each one's threads — the main run's, and the replay's where it is (its plate);
  // where the play is — the main run's pointer (its words), a replay's going on
  function sky() {
    const re = replay?.run;
    const list = CHAPTERS.map((c, i) => {
      const played = i < kept.chapter || (i === kept.chapter && kept.step > 0), tried = re?.chapter === i;
      const kind = i === (re ? re.chapter : kept.chapter) ? 'here' : i < kept.chapter ? 'played' : i === kept.chapter ? 'next' : 'future';
      return { number: c.number, title: c.title, kind, map: played || tried ? threads(c, played ? kept.choices : {}, tried ? re.choices : {}) : null,
        badge: tried, go: i === kept.chapter ? (i === 0 && !kept.step ? 'начать игру' : 'продолжить игру') : null, cursor: tried && !replay.done };
    });
    const ended = kept.chapter >= END, ending = kept.marks.ending;
    list.push({ number: '', title: 'Конец', kind: ended ? 'end' : 'future',
      map: ended ? [{ title: 'Концовки', weight: '⚑', options: ENDINGS.map(e => ({ label: e.label, state: e.id === ending ? 'chosen' : 'open' })) }] : null });
    return list;
  }
}

// the play as it was kept — or as this game kept it before (the chapters' starts; a replay — never kept now: gone): the
// main run as it is (a chapter it played through — the next one begun), the states known at its steps' beginnings, how
// far each chapter has been seen
function load(saved) {
  let main = run({ ...RUN, ...saved });
  const steps = saved.steps ?? Object.fromEntries(Object.entries(saved.starts ?? {}).map(([i, r]) => [i, [r]]));
  const seen = saved.seen ?? Object.fromEntries(CHAPTERS.map((c, i) => [i, i < main.chapter ? c.steps.length : i === main.chapter ? main.step : 0]));
  if (main.chapter < END && main.step >= CHAPTERS[main.chapter].steps.length) {
    main = { ...main, chapter: main.chapter + 1, step: 0 };
    steps[main.chapter] = [run(main)];
  }
  (steps[main.chapter] ??= [])[main.step] ??= run(main);
  return { ...main, steps, seen };
}
// a run's own fields (the play's position and what it carries), apart from what the play keeps of its chapters
const run = p => structuredClone({ chapter: p.chapter, step: p.step, scales: p.scales, marks: p.marks, choices: p.choices });
const pick = (o, keep) => Object.fromEntries(Object.entries(o).filter(([j]) => keep(Number(j))));
// how things stand in a run, in words (ui.js now): the scales the player sees, the people
const now = r => ({ scales: Object.keys(SCALES).map(k => ({ name: SCALES[k].name, words: level(k, r.scales[k]) })), people: people(r.marks) });
// a chapter's choices as rows of threads: the main run's chosen, a replay's tried (both — the same), could have been,
// never reached
function threads(ch, mainChoices, triedChoices) {
  return ch.choices.map(c => {
    const m = mainChoices[c.id], t = triedChoices[c.id];
    return { title: c.title, weight: c.weight, options: c.options.map(o => ({ label: o.label,
      state: m === o.id && t === o.id ? 'both' : m === o.id ? 'chosen' : t === o.id ? 'tried' : m || t ? 'open' : 'unseen' })) };
  });
}
