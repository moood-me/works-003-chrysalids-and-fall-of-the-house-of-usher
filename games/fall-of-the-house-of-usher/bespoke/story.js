// What a chapter's steps play with: context(b, view, hub, state) → g. Its state is a working copy —
// kept only once the step is done (game.js). A step left behind (its author skipped it: ⏭) does
// nothing more and never ends: whatever it still calls returns a promise that never settles.
//   g.state — what the play carries: {scales, shown, heard, marks, choices, ending} (game.js)
//   g.signal — aborts when the step is left: stop what it started (a sound, a timer) on it
//   g.scene(title, state) — that scene of the world, full-screen, its state on top of where it
//     starts; its `crack` (if it has one) as the crack scale says, unless `state` says otherwise. Its scenes
//     (engine 2) play no beat until one is named: the step's first beat goes in `state` ({beat: name}) — the scene
//     opens playing it, its first frame the beat's own — and g.beat(name) then takes it up (waits for its end)
//   g.set(key, value, seconds) / g.get(key) — the shown scene's state; g.move(key, value, seconds, ease) — the key
//     moved by the scene's director (engine 2): → once it is there
//   g.wait(ms) — time of the game's own (a pause, a toast); never to wait for something the scene does — that is
//     an event of the scene's:
//   g.told(text, ms) — until the scene tells `text` (→ true), or ms pass (→ false)
//   g.when(key, test, ms) — until the scene sets the key (a value set, or moved: where it goes, as the move begins) to
//     one that test(value) holds for (a value: that one) (→ true), or ms pass (→ false)
//   g.arrived(who, ms) — until someone's walk in the scene ends there (→ true), or ms pass (→ false)
//   g.watch(key, fn) — fn(value, old) each time the scene sets the key, till the step is left
//   g.say(who, text, at) — someone of PEOPLE says it, over `at` (their element; the narrator low in
//     the middle), in their voice; → a breath after it has been heard (unvoiced: once it could be read)
//   g.think(who, text, at) — heard inside the head: their voice, a whisper; «text» — Name, shown low
//   g.choose(choice, element, options) — the player picks the element, then one of options
//     ([{id, label}]); or g.choose(choice, {element: options, …}); → the option's id, kept in
//     state.choices[choice] (choice null: not a choice of the chapter's map). g.withdraw() — what is
//     offered is taken back (the moment passed)
//   g.beat(name, {wait}) — a beat of the shown scene's film (the world's module `beats`); → once it
//     has ended (the scene tells 'beat:<name>'), or at once with wait: false. To wait for a moment inside a beat
//     (a cut, lips moving), make the g.told / g.when / g.arrived before g.beat
//   g.play(minigame, opts) — a small game of the hands: a module of minigames/ — export default {
//     run: async (g, b, opts, signal) → its result, skipped: its result if skipped }. The signal
//     aborts when the author skips it (⏭) or the step is left: it takes away what it showed, stops.
//   g.scale(name, delta, quiet) — crack, sanity or trust moves; the player sees which way (the
//     gauge, the words) unless quiet; the first time a scale shows, one line says what it means.
//     The crack grows in the shown scene too, before the eyes.
//   g.gauge(name) — the scale is shown from now on (with its line), not moved
//   g.overheard(what) — Madeline heard it (state.heard[what]): «Мэдлин это слышала.»
//   g.mark(key, value, text) — remembered (state.marks[key]); text — what the player is told, if any
//   g.end(ending) — the play ends: after this step comes the epilogue, showing `ending` (epilogue.js)
//   g.letter({text, highlight, sign}) — a letter the player unfolds, reads and folds again (ui.js)
//   g.title(text) — words over the scene, as a film's title; → once they have gone
//   g.sound — the game's sounds (sound.js)
// A step may be played up to a minigame unseen, without time (the author's ☰: a jump — jump.js j): then nothing of
// it is said, shown or heard till that minigame, and the scene is shown where the step has got to by then.
import * as sounds from './sound.js';

export const PEOPLE = {
  narrator: { voice: 'Charon', how: 'тихо, размеренно, глуховато — так вспоминают то, что хотели бы забыть', name: 'рассказчик, друг детства Родерика', short: 'я' },
  roderick: { voice: 'Enceladus', how: 'нервно, порывисто, то почти шёпотом, то срываясь', name: 'Родерик Ашер', short: 'Родерик' },
  madeline: { voice: 'Achernar', how: 'еле слышно, медленно, шёпотом, будто издалека', name: 'леди Мэдлин, сестра-близнец Родерика', short: 'Мэдлин' },
  doctor: { voice: 'Sadaltager', how: 'вкрадчиво, с жадным любопытством, чуть заискивающе', name: 'врач Ашеров, пожилой', short: 'врач' },
};
export const THOUGHT = ', но беззвучно: шёпотом, будто прямо в голове'; // how a thought is heard
const thought = (who, text) => `«${text}» — ${PEOPLE[who]?.short || ''}`; // and shown

// The scales: where they start, their bounds, what the player reads when they move, and the one
// line that says what they mean, the first time they show.
export const SCALES = {
  crack: { start: 0, min: 0, up: 'Трещина растёт', down: 'Трещина затихла', rule: 'Трещина растёт, когда здесь молчат о правде.' },
  sanity: { start: 5, min: 0, max: 5, up: 'Рассудок ↑', down: 'Рассудок ↓', rule: 'Чем ниже рассудок, тем больше ты видишь и слышишь.' },
  trust: { start: 1, up: 'Родерик ↑', down: 'Родерик ↓', rule: 'Родерик ↑ — он верит тебе больше, ↓ — меньше.' },
};
export const CRACK_FULL = 9; // the crack scale at which the crack is all it can be
export const crackIn = n => Math.min(1, 0.1 + (0.9 * n) / CRACK_FULL); // a scene's crack 0…1 for the scale

const BEAT = 180000; // a beat longer than this has not ended: the scene lacks it

export function context(b, view, hub, state, j = null) {
  const left = new AbortController(); // the step is left behind (game.js)
  const gone = () => left.signal.aborted;
  const never = new Promise(() => {});
  const alive = p => p.then(v => (gone() ? never : v));
  const unseen = () => j?.on;
  const sleep = ms => (gone() ? never : unseen() ? j.sleep(ms) : new Promise(ok => setTimeout(() => gone() || ok(), ms)));
  const put = (key, value, seconds) => (unseen() ? j.did([key, value]) : b.set(key, value, seconds));
  let spec = null; // the shown scene's (unseen: the one it would be)
  let opening = null; // the beat it was opened with, till g.beat takes it up: {name, ended}
  const cracked = () => !!(spec?.state && 'crack' in spec.state);
  // a jump at its minigame (or stuck before it: a choice the play didn't make): the scene where the step has got to
  // — and the step on from there, seen
  let seeing = null;
  const seen = () => (seeing ??= (async () => {
    const { shown, then } = j;
    for (const h of j.seen()) hub.told(h.text, h.ms).then(h.ok);
    view.gauges(state);
    if (shown) await alive(b.show(shown.title, { state: shown.state, captions: false, then }));
  })());
  if (j && j.target < Infinity) j.idle.then(seen);
  // a line, and the time it asks: heard — a breath after; shown without a voice — as long as it
  // takes to read it (the page keeps it 1.5 s + 60 ms a letter from when it shows: speech.js)
  async function speak(at, text, opts) {
    if (unseen()) return sleep(300 + text.length * 60);
    let heard = false;
    const hear = e => { if (e.detail.on && e.detail.text === text.trim()) heard = true; };
    addEventListener('moood:speech', hear);
    try { await b.say(at, text, opts); } finally { removeEventListener('moood:speech', hear); }
    await sleep(heard ? 500 : 300 + text.length * 60);
  }
  // the scale is met: its gauge from now on, and its line once
  const meet = name => {
    if (state.shown[name]) return;
    state.shown[name] = true;
    if (!unseen()) view.toast(SCALES[name].rule, 'rule');
  };
  const g = {
    state,
    signal: left.signal,
    get sound() { return unseen() ? j.sounds : sounds; },
    async scene(title, st = {}) {
      if (gone()) return never;
      // (opened as it is to be: its crack as the scale says, the beat it opens with playing from its first frame)
      spec = await alive(unseen() ? j.real(b.specOf(title)) : b.specOf(title));
      if (!('crack' in st) && cracked()) st = { ...st, crack: crackIn(state.scales.crack) };
      opening = typeof st.beat === 'string' ? { name: st.beat, ended: g.told(`beat:${st.beat}`, BEAT) } : null;
      if (unseen()) j.scene(title, st);
      else {
        hub.withdraw();
        await alive(b.show(title, { state: st, captions: false }));
      }
    },
    set: (key, value, seconds) => (gone() ? undefined : put(key, value, seconds)),
    get: key => (unseen() ? j.values[key] : b.get(key)),
    async move(key, value, seconds, ease) {
      if (gone()) return never;
      if (unseen()) { put(key, value); return sleep(seconds * 1000); }
      await alive(Promise.resolve(b.act('state', 'move', key, value, { over: seconds, ease })));
    },
    wait: sleep,
    // (unseen: it came to pass — the scene, shown once the jump is there, has done it: bespoke.show's then)
    when(key, test, ms = 60000) {
      const ok = typeof test === 'function' ? test : v => v === test;
      return gone() ? never : unseen() ? Promise.resolve(true) : alive(hub.when(key, ok, ms));
    },
    arrived(who, ms = 60000) {
      return gone() ? never : unseen() ? Promise.resolve(true) : alive(hub.arrived(who, ms));
    },
    watch(key, fn) {
      if (gone() || unseen()) return;
      const off = hub.watch(key, (v, old) => { if (!gone()) fn(v, old); });
      left.signal.addEventListener('abort', off);
    },
    say(who, text, at = who) {
      return gone() ? never : speak(at, text, PEOPLE[who] || {});
    },
    think(who, text, at = 'narrator') {
      if (gone()) return never;
      const p = PEOPLE[who] || {};
      return speak(at, thought(who, text), { ...p, how: (p.how || '') + THOUGHT });
    },
    async choose(choice, element, options) {
      if (gone()) return never;
      const offers = typeof element === 'string' ? { [element]: options } : element;
      const offer = async () => (await alive(hub.offer(offers))).action;
      // unseen: as the play chose it — else the first offered; one it chose that isn't here (the moment passed then):
      // offered once seen
      let action;
      if (unseen()) {
        const all = Object.values(offers).flat(), was = choice && state.choices[choice];
        action = !was ? all[0] : all.find(o => o.id === was) ?? (await new Promise(ok => j.later(() => offer().then(ok))));
      } else action = await offer();
      if (choice) state.choices[choice] = action.id;
      return action.id;
    },
    withdraw: () => { if (!unseen()) hub.withdraw(); },
    async beat(name, { wait = true } = {}) {
      if (gone()) return never;
      // (the beat the scene was opened with: playing already)
      const opened = opening?.name === name ? opening : null;
      opening = null;
      const ended = opened ? opened.ended : wait ? g.told(`beat:${name}`, BEAT) : null;
      if (!opened) {
        put('beat', null); // (the same beat again is a change too)
        put('beat', name);
      }
      if (wait && !(await ended)) b.trouble(`кусок «${name}» не кончился`);
    },
    told(text, ms = 60000) {
      return gone() ? never : unseen() ? j.heard(text, ms) : alive(hub.told(text, ms));
    },
    async play(minigame, opts = {}) {
      if (gone()) return never;
      if (unseen()) {
        j.plays.push(minigame);
        if (j.plays.length <= j.target) return minigame.skipped;
        await seen();
      }
      const stop = new AbortController();
      const end = () => stop.abort();
      const off = view.onSkip(end);
      left.signal.addEventListener('abort', end);
      const skipped = new Promise(ok => stop.signal.addEventListener('abort', () => ok(minigame.skipped)));
      try {
        return await alive(Promise.race([minigame.run(g, b, opts, stop.signal), skipped]));
      } finally {
        off();
        left.signal.removeEventListener('abort', end);
        stop.abort();
      }
    },
    scale(name, delta, quiet = false) {
      if (gone() || !delta) return;
      const S = SCALES[name];
      state.scales[name] = Math.min(S.max ?? Infinity, Math.max(S.min ?? -Infinity, state.scales[name] + delta));
      if (name === 'crack' && cracked()) put('crack', crackIn(state.scales.crack), 3);
      if (unseen()) { if (!quiet) meet(name); return; }
      if (!quiet) {
        meet(name);
        view.toast(delta > 0 ? S.up : S.down);
      }
      view.gauges(state);
    },
    gauge(name) {
      if (gone()) return;
      meet(name);
      if (!unseen()) view.gauges(state);
    },
    overheard(what) {
      if (gone() || state.heard[what]) return;
      state.heard[what] = true;
      if (!unseen()) view.toast('Мэдлин это слышала.', 'her');
    },
    mark(key, value, text) {
      if (gone()) return;
      state.marks[key] = value;
      if (text && !unseen()) view.toast(text, 'mark');
    },
    end(ending) {
      if (!gone()) state.ending = ending;
    },
    letter(letter) {
      return gone() ? never : unseen() ? Promise.resolve() : alive(view.letter(letter, { signal: left.signal }));
    },
    title(text) {
      return gone() ? never : unseen() ? sleep(9000) : alive(view.title(text, { signal: left.signal }));
    },
    // the step is left behind (game.js): nothing it offered or still had to say stays
    leave() {
      left.abort();
      hub.withdraw();
      b.hush();
    },
  };
  return g;
}

// The page's actions and what its scenes tell and do, listened to once for the whole play (bespoke.on
// keeps a listener for good) — game.js owns it: whatever is being chosen now gets the action;
// whoever waits for a tell, a key set, a walk's end hears it.
//   hub.offer({element: options}) → {element, action} once the player has done it (what was offered before is dropped)
//   hub.withdraw() — nothing offered; hub.told(text, ms) → true once the scene tells it, false if ms pass
//   hub.when(key, test, ms) → true once the scene sets the key to a value test holds for, false if ms pass;
//   hub.arrived(who, ms) — a walk of theirs ended; hub.watch(key, fn) → off — fn(value, old) on each
export function listen(b) {
  let offered = null;
  const waiting = new Set(), watching = new Set();
  const wait = (w, ms) => new Promise(ok => {
    w.ok = ok;
    waiting.add(w);
    setTimeout(() => { if (waiting.delete(w)) ok(false); }, ms);
  });
  const heard = (kind, hit) => { for (const w of waiting) if (w.kind === kind && hit(w)) { waiting.delete(w); w.ok(true); } };
  b.on('act', (element, action) => {
    const ok = offered;
    offered = null;
    b.offer({});
    ok?.({ element, action });
  });
  b.on('tell', text => heard('tell', w => w.text === text));
  b.on('change', (value, old, key) => {
    heard('change', w => w.key === key && w.test(value));
    for (const w of watching) if (w.key === key) w.fn(value, old);
  });
  b.on('arrived', d => heard('arrived', w => w.who === d?.who));
  return {
    offer: offers => new Promise(ok => { offered = ok; b.offer(offers); }),
    withdraw() { offered = null; b.offer({}); },
    told: (text, ms) => wait({ kind: 'tell', text }, ms),
    when: (key, test, ms) => wait({ kind: 'change', key, test }, ms),
    arrived: (who, ms) => wait({ kind: 'arrived', who }, ms),
    watch(key, fn) {
      const w = { key, fn };
      watching.add(w);
      return () => watching.delete(w);
    },
  };
}
