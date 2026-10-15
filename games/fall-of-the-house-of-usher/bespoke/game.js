// Падение дома Ашеров — по рассказу Эдгара Аллана По. A bespoke game (moood/engines/bespoke) on the
// world «Падение дома Ашеров»: the player is Roderick's friend from boyhood, called by his letter.
// A prologue (the end first: the house falls), four chapters, an epilogue — each a row of steps on
// the world's scenes. The choices, the scales (the crack, sanity, Roderick's trust), what Madeline
// heard and what is remembered carry from chapter to chapter. Between the chapters, the scene
// «Трещина»: the chapter's title on the wall of the house, and after it the crack of what was
// chosen in it; after the epilogue, the crack of the whole play.
//
// What is kept of the play (bespoke.keep), after every step: { chapter, step, scales, shown, heard,
// marks, choices, ending, start: the same as the chapter began } — a step cut short (the page
// closed) is played again from its beginning. A step that sets the ending ends the chapters: the
// epilogue comes next (its «Пройти главу заново» goes back to the chapter it ended in). The author
// may go to any chapter from the knot, or to any step of any chapter (☰) — or straight to a minigame of one (the
// step played up to it unseen: jump.js) —, and skip a step or a minigame (⏭): what is gone to begins as if nothing
// was chosen before it; a step skipped leaves nothing chosen.
import { SCALES, context, listen } from './story.js';
import { ui } from './ui.js';
import { hush, wake, unheard } from './sound.js';
import { jump as unseen } from './jump.js';
import prologue from './chapters/prologue.js';
import one from './chapters/1.js';
import two from './chapters/2.js';
import three from './chapters/3.js';
import four from './chapters/4.js';
import epilogue from './chapters/epilogue.js';

const CHAPTERS = [prologue, one, two, three, four, epilogue];
const EPILOGUE = CHAPTERS.length - 1;
const WALL = 'Трещина';
const fresh = () => ({
  chapter: 0, step: 0, scales: Object.fromEntries(Object.entries(SCALES).map(([k, s]) => [k, s.start])),
  shown: {}, heard: {}, marks: {}, choices: {}, ending: null,
});

export default async function (b) {
  await Promise.all([b.css('fonts.css'), b.css('ui.css')]);
  const hub = listen(b);
  const view = ui(b.layer);
  view.pausing(b);
  // the knot at the end of the crack: the player presses it (at the point the scene marks as its end), then where to go
  const knot = async options => {
    const away = view.hint('Коснись конца трещины', 5000);
    const { action } = await hub.offer({ 'knot#end': options });
    away();
    return action.id;
  };
  // the wall: the chapter's title, or the crack of `map`, coming down the wall; → once it is down
  const wall = async (number, title, map) => {
    hush(2);
    view.gauges(null);
    await b.show(WALL, { state: { chapter_number: number, chapter_title: title, map, reveal: 0, knot: 1 } });
    // (the scene moves it: done once it is down)
    await b.act('state', 'move', 'reveal', 1, { over: map ? 2.5 + map.length * 1.2 : 3.5 });
  };
  const jumps = at => (b.game.mine ? CHAPTERS.map((c, i) => ({ id: `jump:${i}`, label: `→ ${c.number ? `глава ${c.number}` : c.title}` })).filter((_, i) => i !== at) : []);
  const jump = id => ({ ...fresh(), chapter: Number(id.slice(5)) });
  let kept = { ...fresh(), ...b.saved };
  // the minigames a step plays (as one who chose nothing before plays it: its first options) — the step played through
  // unseen, once
  const listed = new Map();
  const plays = (chapter, step) => {
    const k = `${chapter}:${step}`;
    if (!listed.has(k)) {
      const j = unseen(Infinity, unheard()), g = context(b, view, hub, { ...fresh(), chapter, step }, j);
      listed.set(k, Promise.race([CHAPTERS[chapter].steps[step](g).catch(() => {}), j.idle]).then(() => j.plays.map(m => m.title || '…')));
    }
    return listed.get(k);
  };
  if (b.game.mine) view.author({ chapters: CHAPTERS, at: () => kept, plays, go: async (chapter, step, play) => {
    await b.keep({ ...fresh(), chapter, step, ...(play != null ? { play } : {}) });
    location.reload();
  } });
  for (;;) {
    const ch = CHAPTERS[kept.chapter];
    if (!kept.start) {
      const { start, play, ...now } = kept;
      kept.start = structuredClone({ ...now, step: 0 });
    }
    // the chapter's title; the player picks the knot to begin (the page may be heard from then on) —
    // unless it is over (the page was left at its crack): its crack again; or gone straight to a minigame
    if (kept.step < ch.steps.length && kept.play == null) {
      await wall(ch.number, ch.title, null);
      const go = await knot([{ id: 'go', label: kept.step ? 'Продолжить' : 'Начать' }, ...jumps(kept.chapter)]);
      if (go.startsWith('jump:')) { kept = jump(go); await b.keep(kept); continue; }
    }
    wake();
    while (kept.step < ch.steps.length) {
      view.gauges(kept.chapter === EPILOGUE ? null : kept); // (the ending: the play's own scales are done)
      // (gone to a minigame of it: the step played up to it unseen)
      const g = context(b, view, hub, structuredClone(kept), kept.play != null ? unseen(kept.play, unheard()) : null);
      let skip;
      const off = view.onSkip(() => skip());
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
      const to = await knot([{ id: 'again', label: 'Пройти главу заново' }, { id: 'anew', label: 'Сыграть заново' }, ...jumps(-1)]);
      if (to === 'anew') return b.restart();
      next = to === 'again' ? kept.start : jump(to);
    } else if (ch.choices.length) {
      // the crack of the chapter; then on — or the chapter again, from how it began
      await wall(ch.number, ch.title, map(ch, kept));
      const to = await knot([{ id: 'on', label: 'Дальше' }, { id: 'again', label: 'Пройти главу заново' }, ...jumps(kept.chapter)]);
      next = to === 'again' ? kept.start : to.startsWith('jump:') ? jump(to) : null;
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
// the whole play: the turns (⚑) of every chapter — but those the ending tells (ends: to leave, the
// hands) — and how it ended
const whole = kept => [
  ...CHAPTERS.slice(0, EPILOGUE).flatMap(ch => rows(ch.choices.filter(c => c.weight === '⚑' && !c.ends), kept, c => `${ch.number}. ${c.title}`)),
  { title: 'Конец', weight: '⚑', options: epilogue.endings.map(e => ({ label: e.label, state: e.id === kept.ending ? 'chosen' : 'open' })) },
];
