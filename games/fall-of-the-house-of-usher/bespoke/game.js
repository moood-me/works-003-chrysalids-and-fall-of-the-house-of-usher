// Падение дома Ашеров — по рассказу Эдгара Аллана По. A bespoke game (moood/engines/bespoke) on the world «Падение дома
// Ашеров v3» (engine 3): the player is Roderick's friend from boyhood, called by his letter. A prologue (the end first:
// the house falls), four chapters, an epilogue — each a row of steps on the world's scenes. The choices, the scales (the
// crack, sanity, Roderick's trust), what Madeline heard and what is remembered carry from chapter to chapter. Between
// the chapters, the scene «Трещина»: the chapter's title on the wall of the house, and after it the crack of what was
// chosen in it; after the epilogue, the crack of the whole play. Choices — the chapters' and the knot's at the end of the
// crack — are the language of mini-games' (story.js hub): a mark on the thing, its words as petals.
//
// What is kept of the play (bespoke.keep), after every step: { chapter, step, scales, shown, heard, marks, choices,
// ending, start: the same as the chapter began } — a step cut short (the page closed) is played again from its
// beginning. A step that sets the ending ends the chapters: the epilogue comes next (its «Пройти главу заново» goes back
// to the chapter it ended in). The author may go to any step of any chapter (☰) — or straight to a minigame of one (the
// step played up to it unseen: jump.js) —, and skip a step (⏭): what is gone to begins as if nothing was chosen before
// it; a step skipped leaves nothing chosen. A minigame's ⏭ is every player's (story.js g.play): it counts as played.
import { SCALES, SCENES, context, listen } from './story.js';
import { ui } from './ui.js';
import { hush, wake, unheard, pause } from './sound.js';
import { jump } from './jump.js';
import prologue from './chapters/prologue.js';
import one from './chapters/1.js';
import two from './chapters/2.js';
import three from './chapters/3.js';
import four from './chapters/4.js';
import epilogue from './chapters/epilogue.js';

const CHAPTERS = [prologue, one, two, three, four, epilogue];
const EPILOGUE = CHAPTERS.length - 1;
const fresh = () => ({
  chapter: 0, step: 0, scales: Object.fromEntries(Object.entries(SCALES).map(([k, s]) => [k, s.start])),
  shown: {}, heard: {}, marks: {}, choices: {}, ending: null,
});

export default async function (b) {
  // seconds of the play's own: standing while it is paused (⏸), as the scene's time does
  const played = seconds => new Promise(ok => {
    let left = seconds * 1000, last = performance.now();
    const tick = now => { if (!b.paused) left -= now - last; last = now; if (left <= 0) ok(); else requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });
  await Promise.all([b.css('fonts.css'), b.css('ui.css')]);
  // the language of mini-games in this game's hand: the world's key (A major and F♯ minor, as its scenes' music), the
  // book's serif, ink and bone, the red of the crack
  b.minigame.style({ key: 'A_MAJOR_G_FLAT_MINOR', font: 'Georgia, "Times New Roman", serif', colors: { mark: '#e4d8bf', fill: '#c9a46a', good: '#a8b89a', danger: '#b0261a', fork: '#9aa4b4', ghost: 'rgba(228, 216, 191, 0.5)' } });
  const hub = listen(b);
  const view = ui(b.layer);
  b.onPause(pause);
  // the knot at the end of the crack: its words as petals (the first touch also lets the page be heard)
  const knot = async options => {
    const g = context(b, view, hub, fresh());
    const id = await g.choose(null, 'knot#end', options);
    wake();
    return id;
  };
  // the wall: the chapter's title, or the crack of `map`, coming down the wall; → once it is down
  const wall = async (number, title, map) => {
    hush(2);
    view.gauges(null);
    await b.show(SCENES.wall, { state: { chapter_number: number, chapter_title: title, map, reveal: 0, knot: 1 }, captions: false });
    const over = map ? 2.5 + map.length * 1.2 : 3.5;
    b.set('reveal', 1, over);
    await played(over);
  };
  let kept = { ...fresh(), ...b.saved };
  // the minigames a step plays (as one who chose nothing before plays it: its first options) — the step played through
  // unseen, once
  const listed = new Map();
  const plays = (chapter, step) => {
    const k = `${chapter}:${step}`;
    if (!listed.has(k)) {
      const j = jump(Infinity, unheard()), g = context(b, view, hub, { ...fresh(), chapter, step }, j);
      listed.set(k, Promise.race([CHAPTERS[chapter].steps[step](g).catch(() => {}), j.idle]).then(() => j.plays.map(m => m.title || '…')));
    }
    return listed.get(k);
  };
  if (b.game.mine) b.menu(view.author({ chapters: CHAPTERS, at: () => kept, plays, go: async (chapter, step, play) => {
    await b.keep({ ...fresh(), chapter, step, ...(play != null ? { play } : {}) });
    location.reload();
  } }));
  for (;;) {
    const ch = CHAPTERS[kept.chapter];
    if (!kept.start) {
      const { start, play, ...now } = kept;
      kept.start = structuredClone({ ...now, step: 0 });
    }
    // the chapter's title; the player picks the knot to begin (the page may be heard from then on) — unless it is over
    // (the page was left at its crack): its crack again; or gone straight to a minigame
    if (kept.step < ch.steps.length && kept.play == null) {
      await wall(ch.number, ch.title, null);
      await knot([{ id: 'go', label: kept.step ? 'Продолжить' : 'Начать' }]);
    }
    wake();
    while (kept.step < ch.steps.length) {
      view.gauges(kept.chapter === EPILOGUE ? null : kept); // (the ending: the play's own scales are done)
      // (gone to a minigame of it: the step played up to it unseen)
      const g = context(b, view, hub, structuredClone(kept), kept.play != null ? jump(kept.play, unheard()) : null);
      // (the ⏭ skips a step for the author only: a player has it inside a minigame — story.js g.play)
      let skip;
      const off = b.game.mine ? view.onSkip(() => skip()) : () => {};
      const done = await Promise.race([
        ch.steps[kept.step](g).then(() => true, e => { b.trouble(`шаг сломался: ${e.message || e}`); return false; }),
        new Promise(ok => { skip = () => ok(false); }),
      ]);
      off();
      if (!done) g.leave();
      kept = { ...(done ? g.state : kept), step: kept.step + 1, play: undefined };
      await b.keep(kept);
      if (kept.ending && kept.chapter !== EPILOGUE) break;
    }
    let next;
    if (kept.ending && kept.chapter !== EPILOGUE) {
      next = { ...kept, chapter: EPILOGUE, step: 0 }; // (start: the chapter it ended in)
    } else if (kept.chapter === EPILOGUE) {
      // the crack of the whole play; then the chapter it ended in again, or all of it anew
      await wall('', 'Падение дома Ашеров', whole(kept));
      const to = await knot([{ id: 'again', label: 'Пройти главу заново' }, { id: 'anew', label: 'Сыграть заново' }]);
      if (to === 'anew') return b.restart();
      next = kept.start;
    } else if (ch.choices.length) {
      // the crack of the chapter; then on — or the chapter again, from how it began
      await wall(ch.number, ch.title, map(ch, kept));
      const to = await knot([{ id: 'on', label: 'Дальше' }, { id: 'again', label: 'Пройти главу заново' }]);
      next = to === 'again' ? kept.start : null;
    }
    next ||= { ...kept, chapter: kept.chapter + 1, step: 0, start: kept.chapter + 1 === EPILOGUE ? kept.start : undefined };
    kept = next;
    await b.keep(kept);
  }
}

// a chapter's choices as rows of the crack: chosen, could have been, never reached
const rows = (choices, kept, title = c => c.title) => choices.map(c => ({
  title: title(c), weight: c.weight,
  options: c.options.map(o => ({ label: o.label, state: kept.choices[c.id] === o.id ? 'chosen' : c.id in kept.choices ? 'open' : 'unseen' })),
}));
const map = (ch, kept) => rows(ch.choices, kept);
// the whole play: the turns (⚑) of every chapter — but those the ending tells (ends: to leave, the hands) — and how it
// ended (the other endings a thread each, without words: the map stays readable)
const whole = kept => [
  ...CHAPTERS.slice(0, EPILOGUE).flatMap(ch => rows(ch.choices.filter(c => c.weight === '⚑' && !c.ends), kept, c => `${ch.number}. ${c.title}`)),
  { title: 'Конец', weight: '⚑', options: epilogue.endings.map(e => ({ label: e.label, state: e.id === kept.ending ? 'chosen' : 'unseen' })) },
];
