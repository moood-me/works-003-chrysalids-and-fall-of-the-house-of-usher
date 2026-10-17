// The Fall of the House of Usher — after the tale by Edgar Allan Poe. A bespoke game (moood/engines/bespoke) on the world «The Fall of the House
// of Usher v3» (engine 3): the player is Roderick's friend from boyhood, called by his letter. A prologue (the end first:
// the house falls), four chapters, an epilogue — each a row of steps on the world's scenes. The choices, the scales
// (the crack, sanity, Roderick's trust), what Madeline heard and what is remembered carry from chapter to chapter; a
// step that sets the ending ends the chapters: the epilogue comes next (those between never reached). Choices are the
// language of mini-games' (story.js hub): a mark on the thing, its words as petals.
//   The map of the play (moood/docs/agents/games.md): the scene «Crack» — the wall of the house, a point for each
// chapter — and over it each chapter's tree drawn by the game (map.js): its rows of choices (the forks), what was
// chosen brighter, the chapters to come numbered only. The view comes to a chapter (`shown`), the player drags it
// anywhere. What can be done on it is its own drawing — pressed, the language's mark opens there, born open (story.js
// hub.ask): the main run's pointer — «Start», «Continue» (from the beginning of the step it stopped in); a chapter
// played — «Replay the chapter»; each fork the main run reached in it — «Replay from here» (from that step, with all the
// main run chose before it). The play begins on the map, comes to it after each chapter, by ☰ (the page's: the step
// going on is left — played again from its beginning), and whenever it is opened again. Its author has one more sign
// (left of the prologue): his map of the chapters and their steps (ui.js author) — straight to any step, or a minigame
// of one: a replay from there — as the main run stood at that step where it has played it, else as if nothing was
// chosen before it.
//
// The play is one — its main run, as far as the player has come. A replay (begun on the map) goes on its own and is
// never kept: closed, it is gone. Meanwhile the slip «Replay» in the corner; on the map its threads beside the
// main run's, its pointer «Continue the replay» or «Back to the main run» (the main run played on at once);
// whatever would leave it asks first (its mark opens again) — «Drop the replay». Played to its chapter's end (or to
// an ending), the player keeps it — «Keep»: it becomes the main run from the next chapter on, the chapters after it
// to be played anew (said beside) — or not, «Undo».
//
// What is kept of the play (bespoke.keep), after every step: the main run — { chapter, step, scales, shown, heard,
// marks, choices, ending } —, steps: {chapter: [the main run as each of its steps began, and as it ended]} (what
// «Replay from here» starts from), seen: {chapter: how many of its steps the player has ever played through} — never
// lessened. The page's ⏭ (bespoke.forward, story.js) is the player's only where they have been: in a step not past what
// they have seen of its chapter — on to the next interaction —, and in a minigame there, or one they have been in a
// while (story.js SKIPPABLE).
import { SCALES, SCENES, context, listen } from './story.js';
import { ui } from './ui.js';
import { trees } from './map.js';
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
const END = CHAPTERS.length; // the play played through: no chapter of the main run
const REVEAL = 6; // s: a chapter's threads growing on the wall, row by row, as it has been played through
// a replay's end asks on its knot once the knot has stood still REST looks REST_STEP ms apart (REST_MAX s at most)
const REST = 3, REST_STEP = 100, REST_MAX = 12;
const fresh = () => ({
  chapter: 0, step: 0, scales: Object.fromEntries(Object.entries(SCALES).map(([k, s]) => [k, s.start])),
  shown: {}, heard: {}, marks: {}, choices: {}, ending: null,
});

export default async function (b) {
  await Promise.all([b.css('fonts.css'), b.css('ui.css')]);
  // the language of mini-games in this game's hand: the world's key (A major and F♯ minor, as its scenes' music), the
  // book's serif, ink and bone, the red of the crack
  b.minigame.style({ key: 'A_MAJOR_G_FLAT_MINOR', font: 'Georgia, "Times New Roman", serif', colors: { mark: '#e4d8bf', fill: '#c9a46a', good: '#a8b89a', danger: '#b0261a', fork: '#9aa4b4', ghost: 'rgba(228, 216, 191, 0.5)' } });
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
      const j = jump(Infinity, unheard()), g = context(b, view, hub, { ...fresh(), chapter, step }, j);
      listed.set(k, Promise.race([CHAPTERS[chapter].steps[step](g).catch(() => {}), j.idle]).then(() => j.plays.map(m => m.title || '…')));
    }
    return listed.get(k);
  };
  // the author's map (his sign on «Crack» opens it): where it goes to is what the map waiting now is told
  let jumped = () => {};
  const author = b.game.mine ? view.author({ chapters: CHAPTERS, at: () => replay?.run ?? kept, plays, go: (chapter, step, play) => jumped({ jump: { chapter, step, play } }) }) : null;
  // ☰ while the play goes on: to the map (on the map itself there is none)
  const away = () => new Promise(ok => b.menu(() => ok('away')));

  for (let after = {}; ;) {
    const to = await map(after);
    after = {};
    wake(); // (a touch: the page may be heard from now on)
    if (to === 'drop') { replay = null; continue; }
    if (to === 'keep') { await keepReplay(); continue; }
    if (to === 'main' || to === 'back') replay = null; // («Back to the main run»: the main run goes on from where it stands)
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
    after = { reveal: done };
  }

  // the run being played (the replay, else the main run), step by step to its chapter's end or an ending → 'done'; or
  // till ☰ → 'away'
  async function play() {
    for (;;) {
      const r = replay ? replay.run : kept, ch = CHAPTERS[r.chapter];
      if (r.step >= ch.steps.length || ended(r)) return 'done';
      view.gauges(r.chapter === EPILOGUE ? null : r); // (the ending: the play's own scales are done)
      // (gone to a minigame of it by the author's map: the step played up to it unseen)
      const g = context(b, view, hub, structuredClone(run(r)), r.play != null ? jump(r.play, unheard()) : null,
        { forward: r.step < (kept.seen[r.chapter] ?? 0) });
      const how = await Promise.race([
        ch.steps[r.step](g).then(() => 'done', e => { b.trouble(`a step broke: ${e.message || e}`); return 'broke'; }),
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
  // the main run on to the next chapter (an ending set: the epilogue), kept as it begins it
  function onward() {
    const on = { ...run(kept), chapter: onto(kept), step: 0 };
    return keep({ ...kept, ...on, steps: { ...kept.steps, [on.chapter]: [on] } });
  }
  // a replay begun on the map: a chapter from its beginning (`chapter:i`) or from a fork's step (`fork:i:s`) — as the
  // main run was then —, or where the author's map went ({jump}: as the main run stood there where it has played that
  // step, else as if nothing was chosen before it)
  function replayFrom(to) {
    if (to.jump) {
      // (a step of a chapter the main run has played: as it stood there, its steps before as they were — as «Replay
      // from here»)
      const { chapter, step, play } = to.jump, at = kept.steps[chapter];
      if (at?.[step]) {
        return { run: { ...structuredClone(at[step]), ...(play != null ? { play } : {}) }, steps: structuredClone(at.slice(0, step + 1)), done: false };
      }
      // (else as if nothing was chosen before it)
      const r = { ...fresh(), chapter, step, ...(play != null ? { play } : {}) };
      return { run: r, steps: Object.assign([], { [step]: run(r) }), done: false };
    }
    const [, i, s = 0] = to.split(':').map(Number), at = kept.steps[i];
    return { run: structuredClone(at[s]), steps: structuredClone(at.slice(0, s + 1)), done: false };
  }
  // a replay played to its end, kept: the main run from the chapter after it on — what came after it in the main run
  // gone
  function keepReplay() {
    const i = replay.run.chapter, on = { ...run(replay.run), chapter: onto(replay.run), step: 0 }, steps = replay.steps;
    replay = null;
    view.replaying(false);
    return keep({ ...on, steps: { ...pick(kept.steps, j => j < i), [i]: steps, [on.chapter]: [on] }, seen: kept.seen });
  }

  // «Crack», the map: the play on the wall, where it is now in the middle (the replay's chapter, else the main
  // run's).
  // What brought the play here: a chapter played through (reveal: its threads grow — its forks offered once they have
  // —, then the view goes on to where the play is now). → what was picked: an option's id, or {jump} — the author's map
  async function map({ reveal = null }) {
    b.menu(null);
    // (nothing of the chapter said or shown stays over the map)
    b.hush();
    view.quiet();
    hush(2);
    view.gauges(null);
    view.replaying(!!replay);
    const here = replay ? replay.run.chapter : Math.min(kept.chapter, EPILOGUE);
    await b.show(SCENES.wall, { state: { shown: reveal ?? here }, captions: false });
    const drawn = trees(b, sky(), { grow: reveal, seconds: REVEAL, author: !!author });
    const notice = replay?.done && anew() ? view.notice(tr('If you keep it, the chapters after this one will have to be played again.')) : () => {};
    let grown = reveal == null, asked = null; // (an option that would leave the replay: asked again)
    let at = reveal ?? here; // (the chapter the view is at)
    const go = i => { if (i !== at) { at = i; b.set('shown', i); } };
    // (something of a chapter pressed — the view goes to it)
    const touched = ref => { const i = /^(?:knot|fork|go|goreplay):(\d+)/.exec(ref)?.[1]; if (i != null) bring(Number(i)); };
    // (pressed on the chapter already shown, wherever the player dragged the view: back to it)
    let come = 0;
    const bring = i => { if (i === at) b.set('come', ++come); else go(i); };
    // what the map's drawing offers now; pressed — told here (while a choice is open nothing else is pressed: a touch
    // off its petals folds it)
    let pressed = () => {};
    const offer = () => drawn.offer(Object.keys(marks(asked, grown ? null : reveal)), ref => pressed(ref));
    // (the chapter just played grown: its forks offered too, the view on to where the play is)
    const growing = grown ? null : setTimeout(() => { grown = true; offer(); go(here); }, REVEAL * 1000);
    try {
      // (a replay played to its end: its knot's mark opens by itself — keep it or not, the question the map asks; the
      // one mark that opens untouched)
      const asking = replay?.done ? await standing(drawn, `knot:${replay.run.chapter}`) : null;
      for (let again = asking; ;) {
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
        if (replay && !['replay', 'keep', 'drop', 'main'].includes(picked.id) && asked !== picked.id) { asked = picked.id; again = ref; continue; }
        return picked.id;
      }
    } finally {
      clearTimeout(growing);
      jumped = () => {};
      hub.withdraw();
      notice();
      drawn.remove();
    }
  }
  // a ref of the map's drawing once it has come to rest in the frame — the scene there, the view arrived (a mark
  // opened on it while the view still moves could go out of sight: folded); none within REST_MAX s — null
  function standing(drawn, ref) {
    return new Promise(ok => {
      let last = null, still = 0, waited = 0;
      // (looked at every REST_STEP ms, not each frame: a scene at rest may send none)
      const look = setInterval(() => {
        const at = drawn.at(ref)();
        still = at && last && Math.hypot(at.x - last.x, at.y - last.y) < 0.5 ? still + 1 : 0;
        last = at;
        waited += REST_STEP;
        if (still >= REST || waited >= REST_MAX * 1000) { clearInterval(look); ok(still >= REST ? ref : null); }
      }, REST_STEP);
    });
  }
  // what can be done on the map: {ref (map.js: what of its drawing is pressed): options} — `asked`: the option that
  // would leave the replay, now «Drop the replay»; `growing`: the chapter whose forks are not there yet
  function marks(asked, growing) {
    const offers = {};
    const add = (ref, id, label) => { (offers[ref] ??= []).push({ id, label: id === asked ? tr('Drop the replay') : label }); };
    if (replay) {
      const c = replay.run.chapter;
      if (replay.done) { add(`knot:${c}`, 'keep', tr('Keep')); add(`knot:${c}`, 'drop', tr('Undo')); }
      else { add(`goreplay:${c}`, 'replay', tr('Continue the replay')); add(`goreplay:${c}`, 'back', tr('Back to the main run')); }
    }
    if (kept.chapter < END) add(`go:${kept.chapter}`, 'main', replay ? tr('Drop the replay') : kept.step ? tr('Continue') : tr('Start'));
    for (let i = 0; i < Math.min(kept.chapter, END); i++) {
      if (!kept.steps[i]?.[0]) continue; // (never reached: an ending came before it)
      add(`knot:${i}`, `chapter:${i}`, tr('Replay the chapter'));
      if (i === growing) continue;
      CHAPTERS[i].choices.forEach((c, k) => {
        const s = fork(i, c.id);
        if (s != null) add(`fork:${i}:${k}`, `fork:${i}:${s}`, tr('Replay from here'));
      });
    }
    if (author) add('author', 'author', tr('The author’s map'));
    return offers;
  }
  // the step of chapter i in which the main run made the choice `id`: the first that began without it and ended with
  // it — known where both states are kept
  function fork(i, id) {
    const at = kept.steps[i] ?? [];
    for (let s = 0; s + 1 < at.length; s++) if (at[s] && at[s + 1] && !(id in at[s].choices) && id in at[s + 1].choices) return s;
    return null;
  }
  // whether keeping the replay played to its end makes chapters the main run has played since to be played anew
  function anew() {
    return kept.chapter > onto(replay.run) || (kept.chapter === onto(replay.run) && kept.step > 0);
  }
  // the chapters as the map draws them (map.js): each one's rows — the main run's, and the replay's where it is —, the
  // play's pointer, the replay's
  function sky() {
    const re = replay?.run;
    return CHAPTERS.map((c, i) => {
      const reached = i < kept.chapter ? !!kept.steps[i]?.[0] : i === kept.chapter;
      const tried = re?.chapter === i;
      const kind = i === (re ? re.chapter : kept.chapter) ? 'here' : i < kept.chapter && reached ? 'played' : i === kept.chapter ? 'next' : 'future';
      // (a chapter played: all its rows; one going on — those reached so far)
      const all = rows(c, reached ? kept.choices : {}, tried ? re.choices : {});
      return { number: c.number, title: c.title, kind, rows: i < kept.chapter && !tried ? all : all.filter(r => r.options.some(o => o.state !== 'unseen')),
        go: i === kept.chapter ? (kept.step ? tr('continue\nthe game') : tr('start\nthe game')) : null, replay: tried && !replay.done, badge: tried };
    });
  }
}

// the chapter that comes after a run's (one that set an ending: the epilogue); a run at an ending — its chapter is over
const ended = r => !!r.ending && r.chapter !== EPILOGUE;
const onto = r => (ended(r) ? EPILOGUE : r.chapter + 1);
// the play as it was kept — or as this game kept it before (the chapter's start; a minigame gone to — gone): the main
// run as it is (a chapter it played through — the next one begun), the states known at its steps' beginnings, how far
// each chapter has been seen
function load(saved) {
  let main = run({ ...fresh(), ...saved });
  const steps = saved.steps ?? (saved.start ? { [main.chapter]: [run(saved.start)] } : {});
  const seen = saved.seen ?? Object.fromEntries(CHAPTERS.map((c, i) => [i, i < main.chapter ? c.steps.length : i === main.chapter ? main.step : 0]));
  if (main.chapter < END && (main.step >= CHAPTERS[main.chapter].steps.length || ended(main))) {
    main = { ...main, chapter: onto(main), step: 0 };
    steps[main.chapter] = [run(main)];
  }
  (steps[main.chapter] ??= [])[main.step] ??= run(main);
  return { ...main, steps, seen };
}
// a run's own fields (the play's position and what it carries), apart from what the play keeps of its chapters
const run = p => structuredClone({ chapter: p.chapter, step: p.step, scales: p.scales, shown: p.shown, heard: p.heard, marks: p.marks, choices: p.choices, ending: p.ending ?? null });
const pick = (o, keep) => Object.fromEntries(Object.entries(o).filter(([j]) => keep(Number(j))));
// a chapter's choices as rows of threads: the main run's chosen, a replay's tried (both — the same), could have been,
// never reached
function rows(ch, mainChoices, triedChoices) {
  return ch.choices.map(c => {
    const m = mainChoices[c.id], t = triedChoices[c.id];
    return { title: c.title, weight: c.weight, options: c.options.map(o => ({ label: o.label,
      state: m === o.id && t === o.id ? 'both' : m === o.id ? 'chosen' : t === o.id ? 'tried' : m || t ? 'open' : 'unseen' })) };
  });
}
