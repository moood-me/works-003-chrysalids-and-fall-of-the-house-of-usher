// What a chapter's steps play with: context(b, view, hub, state, j) → g. Its state is a working copy — kept only
// once the step is done (game.js). A step left behind (its author skipped it: ⏭) does nothing more and never ends:
// whatever it still calls returns a promise that never settles.
//   g.state — what the play carries: {chapter, step, scales, marks, choices} (game.js); what follows from it: facts(g.state)
//   g.signal — aborts when the step is left: stop what it started (a sound, a timer) on it
//   g.sound — the game's sounds (sound.js)
//   g.scene(folder, state) — that scene of the world, full-screen, its state on top of where it starts — and under it
//     what the play has decided, as this scene's keys (carry). A scene of beats plays none until one is named: the
//     step's first beat goes in `state` ({beat: name}) — the scene opens playing it — and g.beat(name) then takes it
//     up (waits for its end)
//   g.set(key, value, seconds) / g.get(key) — the shown scene's state
//   g.wait(ms) — time of the game's own (a pause between lines); never to wait for something the scene does — that is
//     an event of the scene's: g.told / g.heard(text, ms) — until the scene tells `text` (→ true), or ms pass (→ false)
//   g.say(who, text, at) — someone of the game's people (people.json: bespoke.say) says it, over `at` ('id' | 'id#point'
//     of the scene; 'narrator' — low in the middle), in their voice; → a breath after it has been heard (unvoiced: once
//     it could be read)
//   g.think(who, text, at) — what someone says without words, mind to mind: in their voice, a whisper inside the head;
//     shown as “text” — Name, low in the middle (or over `at`)
//   g.note(text) — a word to the author, not the story (a step gone to from the author's ☰ on a branch not chosen): in
//     the corner, no one's voice
//   g.choose(choice, ref, options, timed) | g.choose(choice, {ref: options, …}, timed) — the player touches one of the
//     points ('id#point' | 'id'), then one of its options ([{id, label}]: petals, one too — seen in words, pressed; a
//     label of one to three words — a line it stands for is said after it); → the option's id, kept in
//     state.choices[choice] (choice null: not a choice of the chapter's map). timed {seconds, late}: a choice on time —
//     the arc of time on its marks runs down (with the play's pause); when it is out, the moment has passed: → `late`
//     (an option's id, a word of its own, or null — nothing; kept too, unless null). g.withdraw() — what is offered is
//     taken back
//   g.beat(name, {wait}) — a beat of the shown scene (the world's module `beats`); → once it has ended (the scene
//     tells 'beat:<name>'), or at once with wait: false. To wait for a moment inside a beat, make the g.told before g.beat
//   g.play(minigame, opts) — a small game of the hands: a module of minigames/ — export default {title, about,
//     skipped, run: async (g, b, opts, signal) → its result}, made of the language of mini-games (bespoke.minigame).
//     The signal aborts when it is skipped (the ⏭ in the game's row of tools, for every player: b.minigame.skip()) or
//     the step is left: it stops; → `skipped` then — read as played: a skipped minigame leaves in the story the same
//     trace as one played (the plain good outcome)
//   g.minigame({phrase, sample}) — inside a minigame's run: the language's mini-game begun, left when the signal
//     aborts; its ⏭ ends the minigame
//   g.scale(name, delta, quiet) — a scale moves; the player sees which way (unless quiet: then only by how the world
//     takes it)
//   g.mark(who, value, text) — someone remembers it (state.marks[who]); text — what the player is told
// A step may be played up to a minigame unseen, without time (the author's ☰: a jump — jump.js j), or all through
// (a dry run): then nothing of it is said, shown or heard, and a minigame gives what j.result says, else its `skipped`.
import * as sounds from './sound.js';

// the world's scenes the game plays, by their folders
export const SCENES = {
  bank: 'nasyp-u-ruchya', ruins: 'ruiny-drevnikh', farm: 'ferma-stormov', kitchen: 'kukhnya-stormov', inspector: 'inspektor-na-ferme',
  burning: 'sozhzhenie-polya', forge: 'kuznitsa-dyadi-akselya', stories: 'rasskazy-akselya', hear: 'uchimsya-slyshat',
  square: 'devid-i-rozalinda', voices: 'golosa', river: 'petra-u-reki', dream: 'son-o-gorode', hall: 'dom-sobraniy',
  flight: 'begstvo', edge: 'kray-okrain', camp: 'lager-okrain', ship: 'korabl-iz-zelandii', niti: 'niti',
};

// the scales: what the player reads when they move (the path is never shown: game.js, journal.js)
export const SCALES = {
  suspicion: { up: 'Подозрение ↑', down: 'Подозрение ↓' }, group: { up: 'Группа ↑', down: 'Группа ↓' }, petra: { up: 'Петра ↑', down: 'Петра ↓' },
};

// What follows from the play so far — all a step reads of it besides g.state: David nearly grown from the fifth
// chapter on (the cast's david_teen)
export function facts(state) {
  return { older: (state.chapter ?? 0) >= 4 };
}
// The play's facts (f) as a scene's own keys: what g.scene opens it with, under the step's state
export function carry(folder, f) {
  return folder === SCENES.farm ? { older: f.older } : {};
}

const BEAT = 180000; // a beat longer than this has not ended: the scene lacks it

export function context(b, view, hub, state, j = null) {
  const left = new AbortController(); // the step is left behind (game.js)
  const gone = () => left.signal.aborted;
  const never = new Promise(() => {});
  const alive = p => p.then(v => (gone() ? never : v));
  const unseen = () => j?.on;
  const sleep = ms => (gone() ? never : unseen() ? j.sleep(ms) : new Promise(ok => setTimeout(() => gone() || ok(), ms)));
  const put = (key, value, seconds) => (unseen() ? j.did([key, value]) : b.set(key, value, seconds));
  let opening = null; // the beat the scene was opened with, till g.beat takes it up: {name, ended}
  let playing = null; // the minigame played now: {signal, end}
  // a jump at its minigame (or stuck before it: a choice the play didn't make): the scene where the step has got to
  // — and the step on from there, seen
  let seeing = null;
  const seen = () => (seeing ??= (async () => {
    const { shown, then } = j;
    for (const h of j.seen()) hub.told(h.text, h.ms).then(h.ok);
    view.eye(state.scales.suspicion);
    if (shown) await alive(b.show(shown.folder, { state: shown.state, captions: false, then }));
  })());
  if (j && j.target < Infinity) j.idle.then(seen);
  // the time a line asks, once said: heard — a breath after; shown without a voice — as long as it takes to read it
  const after = ({ heard, text }) => sleep(heard ? 500 : 300 + text.length * 60);
  const g = {
    state,
    signal: left.signal,
    get sound() { return unseen() ? j.sounds : sounds; },
    async scene(folder, st = {}) {
      if (gone()) return never;
      // (opened as it is to be: what the play has decided — those of its keys the scene has —, the beat it opens
      // with playing from its first frame)
      const spec = await alive(unseen() ? j.real(b.specOf(folder)) : b.specOf(folder));
      st = { ...Object.fromEntries(Object.entries(carry(folder, facts(state))).filter(([key]) => key in (spec.states ?? {}))), ...st };
      opening = typeof st.beat === 'string' ? { name: st.beat, ended: g.told(`beat:${st.beat}`, BEAT) } : null;
      if (unseen()) j.scene(folder, st);
      else {
        g.withdraw();
        await alive(b.show(folder, { state: st, captions: false }));
      }
    },
    set: (key, value, seconds) => (gone() ? undefined : put(key, value, seconds)),
    get: key => (unseen() ? j.values[key] : b.get(key)),
    wait: sleep,
    say(who, text, at = who) {
      if (gone()) return never;
      return unseen() ? sleep(300 + text.length * 60) : alive(b.say(who, text, { at })).then(after);
    },
    think(who, text, at = 'narrator') {
      if (gone()) return never;
      return unseen() ? sleep(300 + text.length * 60) : alive(b.think(who, text, { at })).then(after);
    },
    note(text) {
      if (!gone() && !unseen()) view.toast(text, 'mark');
    },
    async choose(choice, ref, options, timed) {
      if (gone()) return never;
      if (typeof ref !== 'string') timed = options;
      const offers = typeof ref === 'string' ? { [ref]: options } : ref, late = timed ? timed.late ?? null : undefined;
      const offer = () => alive(hub.offer(offers, timed?.seconds));
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
      if (unseen()) {
        j.plays.push(minigame);
        if (j.plays.length <= j.target) return j.result?.(minigame) ?? minigame.skipped;
        await seen();
      }
      // skipped — by the player (the game's ⏭ → b.minigame.skip(): g.minigame hears it; before the language's mini-game
      // is begun, the ⏭ ends it itself), by the step left — it ends with its `skipped`
      const stop = new AbortController();
      const end = () => stop.abort();
      const off = view.onSkip(() => { if (!b.minigame.skip()) end(); });
      left.signal.addEventListener('abort', end);
      playing = { signal: stop.signal, end };
      const skipped = new Promise(ok => stop.signal.addEventListener('abort', () => {
        off();
        ok(minigame.skipped);
      }));
      try {
        return await alive(Promise.race([minigame.run(g, b, opts, stop.signal), skipped]));
      } finally {
        left.signal.removeEventListener('abort', end);
        stop.abort();
        playing = null;
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
      const v = (state.scales[name] || 0) + delta;
      state.scales[name] = name === 'path' ? v : Math.max(0, v); // the path goes both ways: force −, tolerance +
      if (unseen()) return;
      if (!quiet) view.toast(delta > 0 ? SCALES[name].up : SCALES[name].down);
      if (name === 'suspicion') view.eye(state.scales.suspicion);
    },
    mark(who, value, text) {
      if (gone()) return;
      state.marks[who] = value;
      if (text && !unseen()) view.toast(text, 'mark');
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

// The player's choices and what the scenes tell, listened to once for the whole play (bespoke.on keeps a listener for
// good) — game.js owns it: whatever is being chosen now gets the action; whoever waits for a tell hears it.
//   hub.offer({ref: options}, seconds) → the action once the player has chosen it (what was offered before is
//     dropped): a plain choice of the language of mini-games — a mark on each point; a touch opens its options as
//     petals, one too (what is chosen is seen in words first), a petal pressed is chosen; one who touches no mark for
//     SHOW s is shown how: the ghost finger on each in turn. seconds — on time: the arc of time on each mark runs down
//     (the mini-game's clock: it stands with the play's pause); out — null, the marks gone
//   hub.withdraw() — nothing offered; hub.told(text, ms) → true once the scene tells it, false if ms pass
const SHOW = 8; // s: nothing pressed so long — the ghost shows how

export function listen(b) {
  let offered = null; // the plain choice going on: the language's mini-game
  const waiting = new Set();
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
    withdraw() { offered?.leave(); offered = null; },
    told: (text, ms) => wait({ kind: 'tell', text }, ms),
  };
}
