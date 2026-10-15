// What a chapter's steps play with (context(bespoke, view, state)): its state is a working copy —
// kept only once the step is done (game.js). A step its author skips is left behind: whatever it
// still does then (says, shows, offers, waits) does nothing and never ends.
//   g.scene(title, state) — that scene of the world, full-screen, its state on top of where it starts
//   g.set / g.get — the shown scene's state; g.wait(ms); g.until(test, ms) — as soon as test() holds
//   g.say(who, text) — someone of PEOPLE says it (over their element; the narrator low in the
//     middle), in their voice; it stays long enough to be read, and the step goes on after
//   g.think(who, text, at) — what someone says without words, mind to mind: in their voice, but a
//     whisper inside the head; shown as «text» — Name, low in the middle (or over `at`)
//   g.choose(choice, element, options) — the player picks the element, then one of options
//     ([{id, label}]) — or, with { element: options, … }, any of those elements and one of its
//     options; a chapter's choice (its id) is remembered; → the option's id.
//     g.withdraw() — what is offered is taken back (the moment passed)
//   g.scale(name, delta, quiet) — a scale moves (the player sees which way — unless quiet: then
//     only by how the world takes it)
//   g.mark(who, value, text) — someone remembers it ("Софи это запомнит.")
//   g.beat(name, { wait }) — a piece of the shown scene's film (the world's module `film`): the scene
//     plays it; → once it has ended (the scene tells 'beat:<name>'), or at once with wait: false.
//     g.heard(text, ms) — until the scene tells `text` (or ms pass: then false)
//   g.play(minigame, opts) — a small game of the hands in the scene: a module of minigames/ —
//     export default { run: async (g, b, opts, signal) → its result, skipped: the result if it is
//     skipped } (b — the bespoke API: b.layer for what it shows, b.where(element) for where a thing
//     is on the screen, b.set / b.get for the scene's state). The game's author may skip it (⏭):
//     then the signal aborts — the minigame takes away what it showed and stops — and `skipped` is
//     the result.
//   g.sound — the game's sounds (sound.js)
// A step may be played up to a minigame unseen, without time (the author's ☰: a jump — jump.js j): then nothing of
// it is said, shown or heard till that minigame, and the scene is shown where the step has got to by then.
import * as sounds from './sound.js';

export const PEOPLE = {
  narrator: { voice: 'Charon', how: 'тихо, неторопливо, как взрослый вспоминает детство', name: 'Дэвид, взрослый, вспоминает', short: 'Дэвид' },
  david: { voice: 'Achird', how: 'тихо, по-мальчишески, сдержанно', name: 'Дэвид, мальчик', short: 'Дэвид' },
  sophie: { voice: 'Leda', how: 'по-детски, настороженно', name: 'Софи, девочка девяти лет', short: 'Софи' },
  mother: { voice: 'Kore', how: 'сдержанно, устало, почти шёпотом', name: 'мать Дэвида', short: 'мать' },
  father: { voice: 'Orus', how: 'твёрдо, холодно, как читают приговор', name: 'Джозеф Сторм, отец Дэвида', short: 'отец' },
  axel: { voice: 'Algenib', how: 'негромко, по-доброму, с хрипотцой бывалого моряка', name: 'дядя Аксель, кузнец', short: 'Аксель' },
  rosalind: { voice: 'Aoede', how: 'тихо, твёрдо, сдержанно', name: 'Розалинда, кузина Дэвида', short: 'Розалинда' },
  someone: { voice: 'Aoede', how: 'тихо, твёрдо, сдержанно', name: 'Розалинда, кузина Дэвида', short: 'чей-то голос' }, // Rosalind, before David knows it is her
  petra: { voice: 'Despina', how: 'звонко, по-детски, совсем маленькая', name: 'Петра, младшая сестра Дэвида, шесть лет', short: 'Петра' },
  michael: { voice: 'Puck', how: 'быстро, уверенно, по-мальчишески', name: 'Майкл, друг Дэвида', short: 'Майкл' },
  anne: { voice: 'Autonoe', how: 'резко, с обидой', name: 'Энн, из группы', short: 'Энн' },
  newcomer: { voice: 'Laomedeia', how: 'тонко, испуганно, совсем тихо', name: 'девочка с дальней фермы', short: 'чужой голос' },
  sealand: { voice: 'Vindemiatrix', how: 'издалека, спокойно и ясно, чуть непривычно выговаривая слова', name: 'женщина из Зеландии, за морем', short: 'голос из-за моря' },
  inspector: { voice: 'Iapetus', how: 'сухо, неторопливо, без злобы, как чиновник', name: 'инспектор', short: 'инспектор' },
  spider: { voice: 'Algieba', how: 'медленно, хрипло, с насмешкой', name: 'Паук, вожак Окраин, брат Джозефа Строрма', short: 'Паук' },
  sally: { voice: 'Achernar', how: 'тихо, сбивчиво, через силу, будто от боли', name: 'Салли, из группы', short: 'Салли' },
};
export const THOUGHT = ', но беззвучно, мысленно: шёпотом, будто прямо в голове'; // how a thought is heard
export const thought = (who, text) => `«${text}» — ${PEOPLE[who]?.short || ''}`; // and shown
const SCALES = { suspicion: 'Подозрение', group: 'Группа', petra: 'Петра', path: 'Путь' };

export function context(b, view, state, j = null) {
  let left = false; // the step was skipped
  const never = new Promise(() => {});
  const unseen = () => j?.on;
  const sleep = ms => (left ? never : unseen() ? j.sleep(ms) : new Promise(ok => setTimeout(() => (left ? null : ok()), ms)));
  const put = (key, value, seconds) => (unseen() ? j.did([key, value]) : b.set(key, value, seconds));
  // a jump at its minigame (or stuck before it: a choice the play didn't make): the scene where the step has got to
  // — and the step on from there, seen
  let seeing = null;
  const seen = () => (seeing ??= (async () => {
    const { shown, then } = j;
    for (const h of j.seen()) g.heard(h.text).then(h.ok);
    view.eye(state.scales.suspicion);
    if (shown) await b.show(shown.title, { state: shown.state, captions: false, then });
  })());
  if (j && j.target < Infinity) j.idle.then(seen);
  const g = {
    state,
    get sound() { return unseen() ? j.sounds : sounds; },
    async scene(title, st = {}) {
      if (left) return never;
      if (unseen()) return j.scene(title, st);
      b.offer({});
      await b.show(title, { state: st, captions: false });
    },
    set: (key, value, seconds) => (left ? undefined : put(key, value, seconds)),
    get: key => (unseen() ? j.values[key] : b.get(key)),
    wait: sleep,
    async until(test, ms = 60000) {
      if (unseen()) return true; // (unseen: it came to pass)
      for (const end = Date.now() + ms; Date.now() < end; await sleep(100)) if (test()) return true;
      return false;
    },
    async play(minigame, opts = {}) {
      if (left) return never;
      if (unseen()) {
        j.plays.push(minigame);
        if (j.plays.length <= j.target) return minigame.skipped;
        await seen();
      }
      const stop = new AbortController();
      const skipped = new Promise(ok => {
        const off = view.onSkip(() => { stop.abort(); ok(minigame.skipped); });
        stop.signal.addEventListener('abort', off);
      });
      try { return await Promise.race([minigame.run(g, b, opts, stop.signal), skipped]); } finally { stop.abort(); }
    },
    // the step is skipped: it is left behind (game.js)
    leave() { left = true; offered = null; b.offer({}); b.hush(); },
    async say(who, text, at = who) {
      if (left) return never;
      if (unseen()) return sleep(1400 + text.length * 55);
      const t0 = performance.now();
      await b.say(at, text, PEOPLE[who] || {});
      await sleep(Math.max(600, 1400 + text.length * 55 - (performance.now() - t0)));
    },
    async think(who, text, at = 'narrator') {
      if (left) return never;
      if (unseen()) return sleep(1400 + text.length * 55);
      const t0 = performance.now(), p = PEOPLE[who] || {}, line = thought(who, text);
      await b.say(at, line, { ...p, how: (p.how || '') + THOUGHT });
      await sleep(Math.max(600, 1400 + text.length * 55 - (performance.now() - t0)));
    },
    async choose(choice, element, options) {
      if (left) return never;
      const offers = typeof element === 'string' ? { [element]: options } : element;
      const offer = async () => {
        const action = await new Promise(ok => {
          offered = action => ok(action);
          b.offer(offers);
        });
        offered = null;
        b.offer({});
        return action;
      };
      // unseen: as the play chose it — else the first offered; one it chose that isn't here (the moment passed then):
      // offered once seen
      let picked;
      if (unseen()) {
        const all = Object.values(offers).flat(), was = choice && state.choices[choice];
        picked = !was ? all[0] : all.find(o => o.id === was) ?? (await new Promise(ok => j.later(() => offer().then(ok))));
      } else picked = await offer();
      if (choice) state.choices[choice] = picked.id;
      return picked.id;
    },
    withdraw() { if (!unseen()) { offered = null; b.offer({}); } },
    heard(text, ms = 180000) {
      if (left) return never;
      if (unseen()) return j.heard(text, ms);
      return new Promise(ok => {
        const w = { text, ok: () => { if (!left) ok(true); } };
        waiters.push(w);
        setTimeout(() => { const i = waiters.indexOf(w); if (i >= 0) { waiters.splice(i, 1); ok(false); } }, ms);
      });
    },
    async beat(name, { wait = true } = {}) {
      if (left) return never;
      const ended = wait ? g.heard(`beat:${name}`) : null;
      put('beat', null); // (the same beat again is a change too)
      put('beat', name);
      if (wait && !(await ended)) b.trouble(`кусок «${name}» сцены не кончился`);
    },
    scale(name, delta, quiet = false) {
      if (left) return;
      const v = (state.scales[name] || 0) + delta;
      state.scales[name] = name === 'path' ? v : Math.max(0, v); // the path goes both ways: force −, tolerance +
      if (unseen()) return;
      if (!quiet) view.toast(`${SCALES[name]} ${delta > 0 ? '↑' : '↓'}`);
      if (name === 'suspicion') view.eye(state.scales.suspicion);
    },
    mark(who, value, text) {
      if (left) return;
      state.marks[who] = value;
      if (!unseen()) view.toast(text, 'mark');
    },
  };
  return g;
}

// the one listener of the page's actions: whatever is being chosen now gets the action; and of what
// the scenes tell: whoever waits for it hears it
let offered = null;
const waiters = [];
export function listen(b) {
  b.on('act', (element, action) => offered?.(action));
  b.on('tell', text => {
    if (text.startsWith('beat-unknown:')) b.trouble(`в сцене нет куска «${text.slice(13)}»`); for (const w of waiters.filter(w => w.text === text)) { waiters.splice(waiters.indexOf(w), 1); w.ok(); } });
}
