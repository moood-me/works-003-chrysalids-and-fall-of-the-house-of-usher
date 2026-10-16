// Хризалиды — по роману Джона Уиндема. A bespoke game (moood/engines/bespoke) on the world «Хризалиды v3» (engine 3):
// the player is David; chapters one after another, each a row of steps on the world's scenes; their
// choices, the scales (suspicion, the group, Petra's strength, the path) and what people remember
// carry from chapter to chapter. Between the chapters, the scene «Нити»: the whole play on the night sky —
// the chapters left to right, a tree of each one's choices; the sky comes to a chapter (`shown`: the scene moves it there over a second)
// and its knot offers its words (begin it, go on, play it again); a neighbour's knot — its title: chosen, the sky goes
// to it. In the corner, how things stand now (ui.js now). Choices are the language of mini-games' (story.js hub).
//
// The play is one — its main run, as far as the player has come: never mixed with anything. A chapter
// passed may be played again: a replay, on its own, from how the chapter began in the main run (its threads drawn
// pale beside the main run's); left, it is forgotten; played to its end, the player keeps it — it becomes the main run,
// from the next chapter on (the chapters after it to be played anew) — or doesn't, and the main run is as it was; how
// things would stand either way is shown beside. «Сыграть сначала» at the end is a replay of the first chapter.
//
// What is kept of the play (bespoke.keep), after every step: the main run — { chapter, step, scales,
// marks, choices } —, starts: {chapter: the main run as the chapter began}, replay: a run of its own (the same fields)
// or null. A step cut short (the page closed) is played again from its beginning. Its author may go to any step of any
// chapter (☰: a replay — the main run untouched) or straight to a minigame of one (the step played up to it unseen:
// jump.js), and skip a step (⏭) — to try them: what is gone to begins as if nothing was chosen before it; a step
// skipped leaves nothing chosen. A minigame's ⏭ is every player's (story.js g.play): it counts as played.
import { SCENES, context, listen } from './story.js';
import { jump } from './jump.js';
import { unheard, pause } from './sound.js';
import { ui } from './ui.js';
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
const GO = 1; // s: the sky going from one chapter to the next
const RUN = { chapter: 0, step: 0, scales: { suspicion: 0, group: 0, petra: 0, path: 0 }, marks: {}, choices: {} };

export default async function (b) {
  await b.css('ui.css');
  // the language of mini-games in this game's hand: the book's serif, muted colours
  b.minigame.style({ key: 'C_MAJOR_A_MINOR', font: 'Georgia, "Times New Roman", serif', colors: { mark: '#efe6d2', fill: '#d9b878', good: '#a9c79a', danger: '#c8604a', fork: '#a8b4cc', ghost: 'rgba(239, 230, 210, 0.5)' } });
  const hub = listen(b);
  const view = ui(b.layer);
  b.onPause(pause);
  let kept = { ...structuredClone(RUN), starts: {}, replay: null, ...b.saved };
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
  if (b.game.mine) b.menu(view.author({ chapters: CHAPTERS, at: () => kept.replay ?? kept, plays, go: async (chapter, step, play) => {
    await b.keep({ ...kept, replay: { ...structuredClone(RUN), chapter, step, ...(play != null ? { play } : {}) } });
    location.reload();
  } }));
  const keep = next => { kept = next; return b.keep(kept); };
  const main = () => kept.chapter;
  const mainDone = () => kept.step >= (CHAPTERS[kept.chapter]?.steps.length ?? 0);
  // the chapters the player may go to: those the main run has played, where it is, the next once this one is done
  const open = () => [...new Set([...Object.keys(kept.starts).map(Number), main(), ...(mainDone() ? [main() + 1] : [])])].filter(i => i <= END);
  const replayOf = i => ({ ...run(kept.starts[i]), step: 0 });

  // «Нити»: the play on the sky, chapter `shown` in the middle; its knot offers `options`; a neighbour's knot (a chapter
  // one may go to) — its title: chosen, the sky goes to it (`shown`: the scene moves its sky there, over GO s) and its
  // knot offers what can be done
  // there (go back to the main run, the next chapter, play one again); how things stand (of run r) in the corner.
  // → what was chosen: an option's id, or `chapter:i`
  async function niti(shown, options, { reveal = false, r = kept.replay ?? kept, compare = null } = {}) {
    await b.show(NITI, { state: { chapters: sky(), shown, reveal: reveal ? 0 : 1, knot: 1 }, captions: false });
    if (reveal) b.set('reveal', 1, 6);
    const g = context(b, view, hub, r);
    const hideNow = view.now(now(r)), hideCompare = compare ? view.compare(compare) : () => {};
    const words = i => (i === shown ? options : [{ id: `chapter:${i}`, label: i === main() ? 'Продолжить историю' : i < main() ? 'Сыграть ещё раз' : 'Дальше' }]);
    const places = [...new Set([shown, ...open()])].filter(i => i <= END);
    try {
      for (let at = shown; ;) {
        const offers = { [`k${at}#knot`]: words(at) };
        for (const i of [at - 1, at + 1]) if (i !== at && places.includes(i)) offers[`k${i}#knot`] = [{ id: `to:${i}`, label: i === END ? 'Конец' : CHAPTERS[i].title }];
        const picked = await g.choose(null, offers);
        if (!picked.startsWith('to:')) return picked;
        at = Number(picked.slice(3));
        b.set('shown', at);
        await g.wait(GO * 1000);
      }
    } finally { hideNow(); hideCompare(); }
  }
  // the chapters as «Нити» draws them: each one's threads — the main run's, and the replay's where it is
  function sky() {
    const re = kept.replay;
    const list = CHAPTERS.map((c, i) => {
      const played = i < main() || (i === main() && kept.step > 0), tried = re?.chapter === i;
      const kind = i === (re ? re.chapter : main()) ? 'here' : open().includes(i) ? (i < main() ? 'played' : 'next') : 'future';
      return { number: c.number, title: c.title, kind, map: played || tried ? threads(c, played ? kept.choices : {}, tried ? re.choices : {}) : null };
    });
    const ended = main() >= END, ending = kept.marks.ending;
    list.push({ number: '', title: 'Конец', kind: ended ? 'end' : 'future',
      map: ended ? [{ title: 'Концовки', weight: '⚑', options: ENDINGS.map(e => ({ label: e.label, state: e.id === ending ? 'chosen' : 'open' })) }] : null });
    return list;
  }

  // a chapter picked on the sky (or «Дальше», «Сыграть ещё раз») is played at once — not its knot asked for again;
  // the knot to begin with is there when the page is opened
  let straight = kept.replay?.play != null; // (gone straight to a minigame)
  for (;;) {
    const replaying = !!kept.replay, cur = kept.replay ?? kept;
    view.eye(cur.scales.suspicion);
    const ch = CHAPTERS[cur.chapter];
    if (!ch) {
      // the end (of the main run): how it ended, years later; then the first chapter again — a replay, the main run
      // kept — or any chapter
      const ending = ENDINGS.find(e => e.id === kept.marks.ending);
      await b.show(NITI, { state: { chapters: sky(), shown: END, reveal: 1, knot: 0.6 }, captions: false });
      await epilogue(context(b, view, hub, kept), ending?.id);
      const next = await niti(END, [{ id: 'again', label: 'Сыграть сначала' }]);
      straight = true;
      await (next === 'again' ? keep({ ...kept, replay: replayOf(0) }) : goTo(Number(next.slice(8))));
      continue;
    }
    // how the chapter began in the main run: what replaying it starts from
    if (!replaying && !cur.step) kept.starts[cur.chapter] = run(kept);
    // the chapter on «Нити»: its knot to begin (the page may be heard from then on), go on, or begin it anew
    if (replaying) view.toast('Глава играется заново — твоя история не меняется', 'mark');
    const go = straight ? 'go' : await niti(cur.chapter, replaying ? [{ id: 'go', label: cur.step ? 'Продолжить' : 'Сыграть ещё раз' }]
      : cur.step ? [{ id: 'go', label: 'Продолжить' }, { id: 'anew', label: 'Начать главу сначала' }] : [{ id: 'go', label: 'Начать' }]);
    straight = false;
    if (go === 'anew') { await keep({ ...kept, ...run(kept.starts[cur.chapter]), step: 0 }); continue; }
    if (go.startsWith('chapter:')) { straight = true; await goTo(Number(go.slice(8))); continue; }
    // the chapter's steps, on the run being played
    while ((kept.replay ?? kept).step < ch.steps.length) {
      const at = kept.replay ?? kept;
      // (gone to a minigame of it: the step played up to it unseen)
      const g = context(b, view, hub, structuredClone(run(at)), at.play != null ? jump(at.play, unheard()) : null);
      // (the ⏭ skips a step for the author only: a player has it inside a minigame — story.js g.play)
      let skip;
      const off = b.game.mine ? view.onSkip(() => skip()) : () => {};
      const skipped = await Promise.race([
        ch.steps[at.step](g).then(() => false, e => { b.trouble(`шаг сломался: ${e.message || e}`); return true; }),
        new Promise(ok => { skip = () => ok(true); }),
      ]);
      off();
      if (skipped) g.leave();
      const after = { ...run(skipped ? at : g.state), step: at.step + 1 };
      await keep(replaying ? { ...kept, replay: after } : { ...kept, ...after });
    }
    const done = kept.replay ?? kept;
    if (!replaying) {
      // the chapter's threads grow on the sky; then on — or play it again
      const next = await niti(done.chapter, [{ id: 'on', label: 'Дальше' }, { id: 'again', label: 'Сыграть ещё раз' }], { reveal: true });
      if (next === 'on') await goTo(done.chapter + 1);
      else if (next === 'again') await keep({ ...kept, replay: replayOf(done.chapter) });
      else await goTo(Number(next.slice(8)));
      straight = true;
      continue;
    }
    // a replay played to its end: kept or not — how things would stand either way, side by side
    const i = done.chapter, mainAfter = kept.starts[i + 1] ?? (i === main() && mainDone() ? kept : null);
    const next = await niti(i, [{ id: 'save', label: 'Оставить так' },
      { id: 'drop', label: 'Вернуться к истории' }, { id: 'again', label: 'Сыграть ещё раз' }], { reveal: true,
      compare: mainAfter && { main: now(mainAfter), replay: now(done), people: differ(mainAfter.marks, done.marks) } });
    if (next === 'save') {
      // the replay is the main run now, from the next chapter on: what came after this chapter in the main run is gone
      const on = { ...run(done), chapter: i + 1, step: 0 };
      await keep({ ...on, starts: { ...pick(kept.starts, j => j <= i), [i + 1]: on }, replay: null });
    } else if (next === 'drop') await keep({ ...kept, replay: null });
    else if (next === 'again') await keep({ ...kept, replay: replayOf(i) });
    else await goTo(Number(next.slice(8)));
    straight = true;
  }

  // a chapter picked on the sky: where the main run is — the main run (the replay left); the next once that one is done
  // — the main run goes on to it; one passed — a replay of it
  function goTo(i) {
    if (i === main()) return keep({ ...kept, replay: null });
    if (i === main() + 1 && mainDone()) {
      const on = { ...run(kept), chapter: i, step: 0 };
      return keep({ ...kept, ...on, starts: { ...kept.starts, [i]: on }, replay: null });
    }
    return keep({ ...kept, replay: replayOf(i) });
  }
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
