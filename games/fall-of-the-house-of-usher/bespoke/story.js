// What a chapter's steps play with: context(b, view, hub, state, j, {forward}) → g. Its state is a working copy — kept
// only once the step is done (game.js). A step left behind (the player went to the map: ☰) does nothing more and never
// ends: whatever it still calls returns a promise that never settles.
//   g.state — what the play carries: {chapter, step, scales, shown, heard, marks, choices, ending} (game.js); what
//     follows from it for a scene: facts(g.state)
//   g.signal — aborts when the step is left: stop what it started (a sound, a timer) on it
//   g.sound — the game's sounds (sound.js)
//   g.scene(title, state) — that scene of the world, full-screen, its state on top of where it starts — and under it
//     what the play has decided, as this scene's keys (carry: its crack as the crack scale says). A scene of beats plays
//     none until one is named: the step's first beat goes in `state` ({beat: name}) — the scene opens playing it — and
//     g.beat(name) then takes it up (waits for its end)
//   g.set(key, value, seconds) / g.get(key) — the shown scene's state
//   g.wait(ms) — time of the game's own (a pause between lines); never to wait for something the scene does — that is
//     an event of the scene's: g.told / g.heard(text, ms) — until the scene tells `text` (→ true), or ms pass (→ false)
//   g.watch(key, fn) — fn(value, old) each time the scene sets the key, till the step is left (a sound to each of its
//     changes); unseen — nothing
//   g.say(who, text, at) — someone of PEOPLE says it, over `at` ('id' | 'id#point' of the scene; 'narrator' — low in
//     the middle), in their voice; → a breath after it has been heard (unvoiced: once it could be read)
//   g.think(who, text, at) — heard inside the head: their voice, a whisper; shown as «text» — Name, low in the middle
//   g.choose(choice, ref, options, timed) | g.choose(choice, {ref: options, …}, timed) — the player touches one of the
//     points ('id#point' | 'id'), then one of its options ([{id, label}]: petals, one too — seen in words, pressed; a
//     label of one to three words — a line it stands for is said after it); → the option's id, kept in
//     state.choices[choice] (choice null: not a choice of the chapter's map). timed {seconds, late}: a choice on time —
//     the arc of time on its marks runs down (with the play's pause); when it is out, the moment has passed: → `late`.
//     g.withdraw() — what is offered is taken back
//   g.beat(name, {wait}) — a beat of the shown scene (the world's module `beats`); → once it has ended (the scene
//     tells 'beat:<name>'), or at once with wait: false. To wait for a moment inside a beat, make the g.told before g.beat
//   g.play(minigame, opts) — a small game of the hands: a module of minigames/ — export default {title, about,
//     skipped (or skipped(opts): what a clean play of it gives with those opts), run: async (g, b, opts, signal) → its
//     result}, made of the language of mini-games (bespoke.minigame).
//     The signal aborts when it is skipped (the page's ⏭ → b.minigame.skip(): in a step the player has seen, or once
//     SKIPPABLE s have gone by in it) or the step is left: it stops; → `skipped` then — read as played: a skipped
//     minigame leaves in the story the same trace as one played (the plain good outcome)
//   g.minigame({phrase, sample}) — inside a minigame's run: the language's mini-game begun, left when the signal
//     aborts; its ⏭ ends the minigame
//   g.scale(name, delta, quiet) — crack, sanity or trust moves; the player sees which way (the gauge, the words) unless
//     quiet; the first time a scale shows, one line says what it means. The crack grows in the shown scene too
//   g.gauge(name) — the scale is shown from now on (with its line), not moved
//   g.overheard(what) — Madeline heard it (state.heard[what]): «Мэдлин это слышала.»
//   g.mark(key, value, text) — remembered (state.marks[key]); text — what the player is told, if any
//   g.end(ending) — the play ends: after this step comes the epilogue, showing `ending` (epilogue.js)
//   g.letter({text, highlight, sign}) — a letter the player unfolds, reads and folds again (ui.js)
//   g.title(text) — words over the scene, as a film's title; → once they have gone
//   g.done() → once the step's code is through: the page's ⏭ taken back; g.leave() — the step left behind (game.js)
// The page's ⏭ (bespoke.forward) is the step's while it is played ({forward}: whether the player has seen the step —
// game.js; none — a context of no step, the map's or a dry run's): where the step is seen, pressed, the step goes on at
// once to its next interaction — the next line said, choice, minigame, scene, beat it begins, letter or title —, what
// is between done at once: its waits over, the line heard and those still to be said dropped, the scene in its instant
// mode (bespoke.instant: all it does ends at once, as it would — its beats run to their ends and tell what they tell on
// the way), shown in one cut as the interaction is reached. In a minigame the ⏭ skips it; while a choice is offered
// there is none.
// A step may be played up to a minigame unseen, without time (the author's map: a jump — jump.js j), or all through
// (a dry run): then nothing of it is said, shown or heard, and a minigame gives what j.result says, else its `skipped`.
import * as sounds from './sound.js';

export const SCENES = {
  house: 'Подъезд к дому', room: 'Комната Родерика', gallery: 'Мэдлин проходит', vault: 'Склеп', storm: 'Буря и чтение',
  fall: 'Падение дома', wall: 'Трещина',
};

export const PEOPLE = {
  narrator: { voice: 'Charon', how: 'тихо, размеренно, глуховато — так вспоминают то, что хотели бы забыть', name: 'рассказчик, друг детства Родерика', short: 'я' },
  roderick: { voice: 'Enceladus', how: 'нервно, порывисто, то почти шёпотом, то срываясь', name: 'Родерик Ашер', short: 'Родерик' },
  madeline: { voice: 'Achernar', how: 'еле слышно, медленно, шёпотом, будто издалека', name: 'леди Мэдлин, сестра-близнец Родерика', short: 'Мэдлин' },
  doctor: { voice: 'Sadaltager', how: 'вкрадчиво, с жадным любопытством, чуть заискивающе', name: 'врач Ашеров, пожилой', short: 'врач' },
};
export const THOUGHT = ', но беззвучно: шёпотом, будто прямо в голове'; // how a thought is heard
const thought = (who, text) => `«${text}» — ${PEOPLE[who]?.short || ''}`; // and shown

// The scales: where they start, their bounds, what the player reads when they move, and the one line that says what
// they mean, the first time they show.
export const SCALES = {
  crack: { start: 0, min: 0, up: 'Трещина растёт', down: 'Трещина затихла', rule: 'Трещина растёт, когда здесь молчат о правде.' },
  sanity: { start: 5, min: 0, max: 5, up: 'Рассудок ↑', down: 'Рассудок ↓', rule: 'Чем ниже рассудок, тем больше ты видишь и слышишь.' },
  trust: { start: 1, up: 'Родерик ↑', down: 'Родерик ↓', rule: 'Родерик ↑ — он верит тебе больше, ↓ — меньше.' },
};
export const CRACK_FULL = 9; // the crack scale at which the crack is all it can be
export const crackIn = n => Math.min(1, 0.1 + (0.9 * n) / CRACK_FULL); // a scene's crack 0…1 for the scale

// What follows from the play so far for a scene — all a step reads of it besides g.state: how deep the crack is
export function facts(state) {
  return { crack: crackIn(state.scales?.crack ?? 0) };
}
// The play's facts (f) as a scene's own keys: what g.scene opens it with, under the step's state — the crack, in every
// scene where the house's wall is seen (not the fall, nor the wall between the chapters: theirs is their own)
export function carry(title, f) {
  return title === SCENES.fall || title === SCENES.wall ? {} : { crack: f.crack };
}

const BEAT = 180000; // a beat longer than this has not ended: the scene lacks it
const SKIPPABLE = 20000; // ms in a minigame of a step not seen yet before the ⏭ may skip it

export function context(b, view, hub, state, j = null, { forward = null } = {}) {
  const left = new AbortController(); // the step is left behind (game.js)
  const gone = () => left.signal.aborted;
  const never = new Promise(() => {});
  const alive = p => p.then(v => (gone() ? never : v));
  const unseen = () => j?.on;
  // the ⏭ pressed (fast: the step going on at once to its next interaction — land() there); the game's own waits going
  // ({timer, ok}): over at once as it is pressed
  let fast = false, choosing = false, showing = false;
  const waits = new Set();
  const sleep = ms => (gone() ? never : unseen() ? j.sleep(ms) : fast ? Promise.resolve() : new Promise(ok => {
    const w = { ok: () => gone() || ok() };
    w.timer = setTimeout(() => { waits.delete(w); w.ok(); }, ms);
    waits.add(w);
  }));
  const put = (key, value, seconds) => (unseen() ? j.did([key, value]) : b.set(key, value, seconds));
  let spec = null; // the shown scene's (unseen: the one it would be)
  let opening = null; // the beat the scene was opened with, till g.beat takes it up: {name, ended}
  let playing = null; // the minigame played now: {signal, end, skippable}
  // the page's ⏭ as the step stands now (a step's context only): none while a choice is offered or the step is still
  // unseen; in a minigame — its skip, where it may be skipped; else, where the step is seen, on to the next interaction
  const ahead = () => {
    if (forward == null || gone()) return;
    b.forward(choosing || unseen() ? null : playing ? (playing.skippable ? skip : null) : forward ? hurry : null);
  };
  const skip = () => { if (playing && !b.minigame.skip()) playing.end(); };
  function hurry() {
    if (gone() || fast || showing || playing || choosing || unseen()) return;
    fast = true;
    b.hush();
    b.instant(true);
    for (const w of waits) { clearTimeout(w.timer); w.ok(); }
    waits.clear();
  }
  // the next interaction reached: the scene as all it did meanwhile has left it, shown in one cut
  async function land() {
    if (!fast) return;
    fast = false;
    await b.instant(false);
  }
  const cracked = () => !!(spec?.states && 'crack' in spec.states);
  // a jump at its minigame (or stuck before it: a choice the play didn't make): the scene where the step has got to
  // — and the step on from there, seen
  let seeing = null;
  const seen = () => (seeing ??= (async () => {
    const { shown, then } = j;
    for (const h of j.seen()) hub.told(h.text, h.ms).then(h.ok);
    view.gauges(state);
    if (shown) await alive(b.show(shown.title, { state: shown.state, captions: false, then }));
    ahead();
  })());
  if (j && j.target < Infinity) j.idle.then(seen);
  // a line, and the time it asks: heard — a breath after; shown without a voice — as long as it takes to read it
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
      // (opened as it is to be: what the play has decided — those of its keys the scene has —, the beat it opens
      // with playing from its first frame)
      spec = await alive(unseen() ? j.real(b.specOf(title)) : b.specOf(title));
      st = { ...Object.fromEntries(Object.entries(carry(title, facts(state))).filter(([key]) => key in (spec.states ?? {}))), ...st };
      if (unseen()) {
        opening = typeof st.beat === 'string' ? { name: st.beat, ended: g.told(`beat:${st.beat}`, BEAT) } : null;
        j.scene(title, st);
        return;
      }
      showing = true;
      try {
        if (fast) await alive(land());
        opening = typeof st.beat === 'string' ? { name: st.beat, ended: g.told(`beat:${st.beat}`, BEAT) } : null;
        g.withdraw();
        await alive(b.show(title, { state: st, captions: false }));
      } finally { showing = false; }
    },
    set: (key, value, seconds) => (gone() ? undefined : put(key, value, seconds)),
    get: key => (unseen() ? j.values[key] : b.get(key)),
    wait: sleep,
    watch(key, fn) {
      if (gone() || unseen()) return;
      const off = hub.watch(key, (v, old) => { if (!gone()) fn(v, old); });
      left.signal.addEventListener('abort', off);
    },
    async say(who, text, at = who) {
      if (gone()) return never;
      if (fast) await alive(land());
      return speak(at, text, PEOPLE[who] || {});
    },
    async think(who, text, at = 'narrator') {
      if (gone()) return never;
      if (fast) await alive(land());
      const p = PEOPLE[who] || {};
      return speak(at, thought(who, text), { ...p, how: (p.how || '') + THOUGHT });
    },
    async choose(choice, ref, options, timed) {
      if (gone()) return never;
      if (typeof ref !== 'string') timed = options;
      const offers = typeof ref === 'string' ? { [ref]: options } : ref, late = timed ? timed.late ?? null : undefined;
      const offer = async () => {
        if (fast) await alive(land());
        choosing = true;
        ahead();
        try { return await alive(hub.offer(offers, timed?.seconds)); } finally { choosing = false; ahead(); }
      };
      // unseen: as the play chose it — else the first offered; one it chose that isn't here: on time — its moment
      // passed (late), else offered once seen
      let id;
      if (unseen()) {
        const all = Object.values(offers).flat(), was = choice && state.choices[choice];
        id = !was ? all[0].id : all.find(o => o.id === was)?.id
          ?? (timed ? late : (await new Promise(ok => j.later(() => offer().then(ok)))).id);
      } else id = (await offer())?.id ?? late;
      if (choice && id != null) state.choices[choice] = id;
      return id;
    },
    withdraw() {
      if (unseen()) return;
      hub.withdraw();
    },
    async beat(name, { wait = true } = {}) {
      if (gone()) return never;
      // (the beat the scene was opened with: playing already)
      const opened = opening?.name === name ? opening : null;
      opening = null;
      if (!opened && fast) await alive(land());
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
    heard(text, ms = BEAT) {
      return g.told(text, ms);
    },
    async play(minigame, opts = {}) {
      if (gone()) return never;
      const clean = typeof minigame.skipped === 'function' ? minigame.skipped(opts) : minigame.skipped;
      if (unseen()) {
        j.plays.push(minigame);
        if (j.plays.length <= j.target) return j.result?.(minigame) ?? clean;
        await seen();
      } else if (fast) await alive(land());
      // skipped — by the player (the page's ⏭ → b.minigame.skip(): g.minigame hears it; before the language's
      // mini-game is begun, the ⏭ ends it itself), by the step left — it ends with its `skipped`
      const stop = new AbortController();
      const end = () => stop.abort();
      left.signal.addEventListener('abort', end);
      const p = playing = { signal: stop.signal, end, skippable: !!forward };
      const may = forward ? 0 : setTimeout(() => { p.skippable = true; if (playing === p) ahead(); }, SKIPPABLE);
      ahead();
      const skipped = new Promise(ok => stop.signal.addEventListener('abort', () => ok(clean)));
      try {
        return await alive(Promise.race([minigame.run(g, b, opts, stop.signal), skipped]));
      } finally {
        left.signal.removeEventListener('abort', end);
        clearTimeout(may);
        stop.abort();
        playing = null;
        ahead();
      }
    },
    minigame(o = {}) {
      if (!playing) throw new Error('g.minigame — только внутри мини-игры (g.play)');
      const mg = b.minigame.start({ ...o, signal: playing.signal });
      mg.on('skip', playing.end);
      return mg;
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
    async letter(letter) {
      if (gone()) return never;
      if (fast) await alive(land());
      return unseen() ? Promise.resolve() : alive(view.letter(letter, { signal: left.signal }));
    },
    async title(text) {
      if (gone()) return never;
      if (fast) await alive(land());
      return unseen() ? sleep(9000) : alive(view.title(text, { signal: left.signal }));
    },
    async done() {
      await land();
      if (forward != null) b.forward(null);
    },
    // the step is left behind (game.js): nothing it offered or still had to say stays
    leave() {
      if (forward != null) b.forward(null);
      if (fast) { fast = false; b.instant(false); }
      left.abort();
      hub.withdraw();
      b.hush();
    },
  };
  ahead();
  return g;
}

// The player's choices, what the scenes tell and the keys they set, listened to once for the whole play (bespoke.on
// keeps a listener for good) — game.js owns it: whatever is being chosen now gets the action; whoever waits for a tell
// hears it; whoever watches a key, its changes.
//   hub.offer({ref: options}, seconds) → the action once the player has chosen it (what was offered before is
//     dropped): a plain choice of the language of mini-games — a mark on each point; a touch opens its options as
//     petals, one too (what is chosen is seen in words first), a petal pressed is chosen; one who touches no mark for
//     SHOW s is shown how: the ghost finger on each in turn. seconds — on time: the arc of time on each mark runs down
//     (the mini-game's clock: it stands with the play's pause); out — null, the marks gone
//   hub.ask(at, options) → the action chosen, or null: a mark of the plain choice born open where the game's own
//     drawing was pressed (at: fn → {x, y} page px — map.js), its options out as petals at once; a touch off them folds
//     it — null, the mark gone (nothing waits idle)
//   hub.withdraw() — nothing offered; hub.told(text, ms) → true once the scene tells it, false if ms pass;
//   hub.watch(key, fn) → off — fn(value, old) on each change of the key
const SHOW = 8; // s: nothing pressed so long — the ghost shows how

export function listen(b) {
  let offered = null; // the plain choice going on: the language's mini-game
  const waiting = new Set(), watching = new Set();
  const wait = (w, ms) => new Promise(ok => {
    w.ok = ok;
    waiting.add(w);
    setTimeout(() => { if (waiting.delete(w)) ok(false); }, ms);
  });
  const heard = (kind, hit) => { for (const w of waiting) if (w.kind === kind && hit(w)) { waiting.delete(w); w.ok(true); } };
  b.on('tell', text => {
    if (text.startsWith('beat-unknown:')) b.trouble(`в сцене нет куска «${text.slice(13)}»`);
    heard('tell', w => w.text === text);
  });
  b.on('change', (value, old, key) => { for (const w of watching) if (w.key === key) w.fn(value, old); });
  return {
    offer(offers, seconds) {
      offered?.leave();
      const mg = offered = b.minigame.start({ plate: false }), refs = Object.keys(offers), presses = [], marks = [];
      // (the thing itself glows when it alone is offered: one breath in one place)
      if (refs.length === 1) mg.glow(refs[0].split('#')[0]);
      let shown = false, touched = false;
      return new Promise(ok => {
        const over = action => { mg.leave(); offered = null; ok(action); };
        const chosen = (mark, action) => { mg.snap({ at: mark }); over(action); };
        for (const ref of refs) {
          const options = offers[ref], mark = mg.mark({ at: ref.includes('#') ? ref : `${ref}@`, ...(seconds ? { time: 1 } : {}) });
          const press = mg.press({ on: mark, petals: options });
          press.on('down', () => { touched = true; });
          press.on('choose', ({ id }) => chosen(mark, options.find(o => o.id === id)));
          presses.push(press);
          marks.push(mark);
        }
        // (by the mini-game's clock: the ghost after SHOW s untouched; the time running down)
        mg.on('frame', ({ t }) => {
          if (!shown && !touched && t >= SHOW) { shown = true; mg.show({ gestures: presses }); }
          if (!seconds) return;
          const left = Math.max(0, 1 - t / seconds);
          for (const m of marks) m.set({ time: left });
          if (!left) over(null);
        });
      });
    },
    ask(at, options) {
      offered?.leave();
      const mg = offered = b.minigame.start({ plate: false });
      return new Promise(ok => {
        const over = action => { ok(action); mg.leave(); if (offered === mg) offered = null; };
        const mark = mg.mark({ at });
        // (where it was pressed is out of the frame: nothing to open)
        if (!mark.pos) { over(null); return; }
        const press = mg.press({ on: mark, petals: options, open: true });
        press.on('choose', ({ id }) => { mg.snap({ at: mark }); over(options.find(o => o.id === id)); });
        press.on('fold', () => over(null));
      });
    },
    withdraw() { offered?.leave(); offered = null; },
    told: (text, ms) => wait({ kind: 'tell', text }, ms),
    watch(key, fn) {
      const w = { key, fn };
      watching.add(w);
      return () => watching.delete(w);
    },
  };
}
