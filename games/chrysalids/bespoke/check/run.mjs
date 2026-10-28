// The check of the game's branches: node bespoke/check/run.mjs <a clone of the world>. No browser, no engine,
// nothing drawn. Every step of every chapter is played unseen, the way the author's map plays it (jump.js: a dry run,
// story.js context(…, j)), on a page that only knows the scenes' specs (fake.mjs): no time passes, the choices are
// those of the play walked (a choice on time: its moment passed, if that is what the play has), a minigame gives the
// result put in for it.
// Walked (the chapters' choices are too many to walk every combination of): the play of the first options with the
// minigames played cleanly; then each other option of each choice once, the rest as in the first play; then the first
// play with each minigame's other outcome (OTHER); then the plays that lead to each ending (ENDS) and those where David
// is caught (CAUGHT). Each play — all the
// steps in order, its state going from step to step.
// Noted, by a wrapper over the step's g (an unseen step's lines and offers never reach j) and over the sounds j plays:
// each scene opened and its keys, each beat, moment waited for, key set / moved / read, point asked, offer and its
// options, line (who, text, over what), minigame with its opts and the fields of its result the chapter reads, sound.
// A minigame is not run: what it takes of its scene is the table below (MINIGAMES; the spec v3.md §4); the functions a
// chapter gives it in opts are each called once — so the lines they say are heard.
// Compared with each scene's scene.json and the block “Contract for the check” that ends its notes.md (v3.md §2):
// {beats: {name: {after, tells, seconds, show}}, points, offers, party, speakers}. A person's own keys (<id>_look …)
// and the camera's are the engine's: not in states, and fine to set.
// Printed: what does not match (file, step, name); the cuts inside a scene; what the contracts have and no play
// named; every line said (who, text) once, repeats and near-repeats flagged — the voices are made from this list;
// for each ending — the beats of every step and the time by chapter and in all (the beats' `seconds`, the lines at
// 0.3 s + 0.06 s a letter, the minigames' `about`); every stretch of watching with nothing to do longer than 90 s.
// Exit code: 0 — nothing to fix, 1 — something does not match.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { page, scenes } from './fake.mjs';

const world = process.argv[2];
if (!world || !existsSync(join(world, 'scenes'))) {
  console.error('node bespoke/check/run.mjs <world clone>');
  process.exit(2);
}
const game = fileURLToPath(new URL('..', import.meta.url));
const load = file => import(pathToFileURL(join(game, file)).href);
// the game's texts as written (the source language): tr as the page gives it, without the translations
const fill = (t, p = {}) => t.replace(/\{(\w+)\}/g, (_, k) => String(p[k]));
globalThis.tr = Object.assign(fill, { n: (n, one, other, p) => fill(n === 1 ? one : other, { n, ...p }), c: (c, t, p) => fill(t, p), line: (who, t) => t, thought: (who, t) => t });
const PEOPLE = JSON.parse(readFileSync(join(game, 'people.json'), 'utf8'));
const { SCENES, facts, carry, context } = await load('story.js');
const { ENDINGS } = await load('chapters/7.js');
const { jump } = await load('jump.js');
const sound = await load('sound.js');

const WATCH = 90; // a stretch of watching longer than this, s, is reported
const several = (stem, n, tail = '') => Array.from({ length: n }, (_, i) => `${stem}${i + 1}${tail}`);
// The minigames (minigames/*.js heads): the scene a minigame is played on, the keys it moves and listens to, the moments
// it waits for, the points its marks stand on, the fields of its opts and of its result
const MINIGAMES = {
  hem: { scene: 'bank', keys: ['hem', 'r_near', 'r_wait'], opts: ['onRide'], points: ['closeup#hem', 'closeup#foot'], tells: ['ridge:seen'], result: ['hid'] },
  dig: { scene: 'ruins', keys: ['dig', 'bell'], points: ['glint#plate'], result: ['cleared', 'bell'] },
  gaze: { scene: 'inspector', keys: ['inspector_look'], points: ['calf', 'calf#head', 'calf#back', 'calf#tail', 'calf#legs'], result: ['found', 'left'] },
  hymn: { scene: 'burning', keys: ['turned'], points: ['jo', 'dv'], result: ['hymn', 'turned'] },
  still: { scene: 'kitchen', keys: ['david_grip', 'david_stir', 'father_look'], points: ['david#hand_r'], opts: ['while'], result: ['stirred'] },
  bellows: { scene: 'forge', keys: ['ax_work', 'pump_work', 'ax_blow', 'pump', 'fire', 'st_lamp', 'st_lx', 'st_lz'], points: ['axel#hand_l', 'pump#handle'], opts: ['watched', 'night'], result: ['broke'] },
  tuning: { scene: 'hear', keys: ['adults_near'], points: ['cart', 'washer', 'shepherd', 'far_girl'], opts: ['find', 'watch'], result: ['caught', 'seen'] },
  layers: { scene: 'square', keys: ['glance', 'someone_watching'], opts: ['watched', 'warm', 'until'], result: ['looked'] },
  windows: { scene: 'voices', keys: ['petra', 'count', 'voices'], points: ['home#window', 'david#head', ...several('farm', 8, '#window')], opts: ['targets', 'petra', 'voices', 'onLink', 'onPetra'], result: ['links', 'caught'] },
  calm: { scene: 'river', keys: ['cry'], points: ['petra', 'david'], opts: ['until'], result: ['cry'] },
  dream: { scene: 'dream', keys: ['lead', 'gaze', 'waking'], result: ['held', 'broke'] },
  horses: { scene: 'flight', keys: ['great_toss', 'pack_toss', 'sheba_toss', 'petra_peek', 'lamp_x', 'lamp', 'search_point', 'great_a', 'pack_a', 'sheba_a'], points: ['great#head', 'pack#head', 'sheba#head', 'petra'], opts: ['start', 'sheba', 'petra', 'horse'], result: ['seen'] },
  shadow: { scene: 'edge', keys: ['walkers', 'walk_u', 'walk_lit', 'walk_shade'], points: ['david'], opts: ['hard', 'onSeen'], result: ['seen'] },
};
// what game.js itself takes of “Threads” (it is not run here): its keys, the points its trees stand at (map.js) — each
// chapter's and the author's sign's
const THREADS = { keys: ['shown', 'come'], points: [...Array.from({ length: 8 }, (_, i) => `c${i}`), 'author'] };
// the results put in: the outcomes a chapter branches on — clean, and each one's other
const CLEAN = {};
const OTHER = [{ hem: { hid: false } }, { dig: { cleared: 0.3, bell: true } }, { gaze: { found: false, left: 0 } }, { hymn: { hymn: 'silent', turned: 0.7 } }, { hymn: { hymn: 'loud', turned: 0.1 } },
  { still: { stirred: 2 } }, { bellows: { broke: true } }, { tuning: { caught: false, seen: true } }, { layers: { looked: true } },
  { windows: { links: 7, caught: true } }, { calm: { cry: 0.8 } }, { dream: { held: 0.2, broke: true } }, { horses: { seen: true } }, { shadow: { seen: true } }];

// what does not match: text → the plays it was met in
const misses = new Map(), cuts = new Map();
let play = null; // the play walked now: its number
const put = (list, where, text) => {
  const key = `${where}: ${text}`;
  if (!list.has(key)) list.set(key, new Set());
  if (play != null) list.get(key).add(play);
};
const miss = (where, text) => put(misses, where, text);
const same = (a, b) => a.length === b.length && a.every(x => b.includes(x));

// a play at its beginning (game.js RUN)
const fresh = () => ({ chapter: 0, step: 0, scales: { suspicion: 0, group: 0, petra: 0, path: 0 }, marks: {}, choices: {} });
// a person's own keys and the camera's — the engine's (not the scene's states)
const OWN = /_(look|do|turn|reach|with|wear|gait|steps|on|here|still|mood|talk|a|d)$/;
const engines = (scene, k) => /^camera_/.test(k) || k === 'fade' || (OWN.test(k) && scene.persons.has(k.replace(OWN, '')));

// --- the world: each scene's spec, its contract block, what of it the plays named
function contract(notes) {
  const at = notes.search(/^#+\s*Contract for the check\s*$/m);
  if (at < 0) throw new Error('no section “Contract for the check”');
  const block = /```json\s*\n([\s\S]*?)\n\s*```/.exec(notes.slice(at));
  if (!block) throw new Error('the section “Contract for the check” has no ```json block');
  return JSON.parse(block[1]);
}
const WORLD = scenes(world);
for (const [title, scene] of WORLD) {
  const notes = `scenes/${scene.folder}/notes.md`, spec = `scenes/${scene.folder}/scene.json`;
  scene.named = new Set();
  scene.states = scene.spec.states ?? {};
  scene.objects = new Map((scene.spec.objects ?? []).map(o => [o.id, o]));
  scene.persons = new Set((scene.spec.objects ?? []).filter(o => o.person).map(o => o.id));
  scene.contract = null;
  if (!Object.values(SCENES).includes(title)) miss(spec, `scene “${title}” is not in the game’s SCENES`);
  try {
    if (!existsSync(join(world, notes))) throw new Error('no such file');
    const c = contract(readFileSync(join(world, notes), 'utf8'));
    if (!c) throw new Error('the contract block is empty');
    const shaped = c.beats && typeof c.beats === 'object' && Array.isArray(c.points) && Array.isArray(c.offers) && c.party && typeof c.party === 'object';
    if (!shaped) throw new Error('the contract block is not {beats, points, offers, party}');
    scene.contract = c;
  } catch (e) {
    miss(notes, `contract not read: ${e.message}`);
    continue;
  }
  const c = scene.contract;
  if (Object.keys(c.beats).length && !('beat' in scene.states)) miss(spec, 'no key “beat” in states');
  for (const [name, beat] of Object.entries(c.beats)) {
    if (!Array.isArray(beat.after) || !Array.isArray(beat.tells)) { miss(notes, `beat “${name}”: no after or tells`); beat.after ??= []; beat.tells ??= []; }
    if (!(beat.seconds > 0)) miss(notes, `beat “${name}”: no seconds`);
    for (const a of beat.after) if (!(a in c.beats)) miss(notes, `beat “${name}”: its after names beat “${a}”, which does not exist`);
    // (a moment is named after the beat it was first of: a beat may tell one of another's — ring_on, ring:on)
    for (const t of beat.tells) if (!(t.includes(':') && t.split(':')[0] in c.beats)) miss(notes, `beat “${name}”: moment “${t}” is not named “<scene beat>:<moment>”`);
  }
  for (const key in c.party) if (!(key in scene.states) && !engines(scene, key)) miss(notes, `party key “${key}” is not in states (${spec})`);
  for (const ref of c.speakers ?? []) if (!scene.objects.has(ref.split('#')[0])) miss(notes, `speaker “${ref}”: no such element in ${spec}`);
  // (a key the play has not decided yet is carried as the scene's own default)
  for (const [key, value] of Object.entries(carry(title, facts(fresh())) ?? {})) {
    if (key in c.party && JSON.stringify(c.party[key]) !== JSON.stringify(value)) miss(notes, `party key “${key}”: default ${JSON.stringify(c.party[key])}, a play without choices carries ${JSON.stringify(value)}`);
  }
  for (const ref of [...c.points, ...c.offers]) {
    if (!scene.objects.has(ref.split('#')[0])) miss(notes, `point “${ref}”: no such element in ${spec}`);
  }
  for (const ref of c.offers) {
    const o = scene.objects.get(ref.split('#')[0]);
    if (o && !o.name) miss(notes, `offer “${ref}”: the element has no name (${spec})`);
  }
}
for (const title of Object.values(SCENES)) if (!WORLD.has(title)) miss('story.js', `scene “${title}” (SCENES) is not in the world`);

// --- the game's own files
const CHAPTERS = [];
for (const name of ['1', '2', '3', '4', '5', '6', '7']) {
  const file = `chapters/${name}.js`, ch = (await load(file)).default;
  CHAPTERS.push({ file, ...ch });
  if (!Array.isArray(ch.choices)) throw new Error(`${file}: no choices`);
  if (!Array.isArray(ch.titles) || ch.titles.length !== ch.steps.length) miss(file, `titles: ${ch.titles?.length ?? 'none'}, steps: ${ch.steps.length}`);
}
const GAMES = new Map(); // a minigame (the module's default export) → {file, name, source}
for (const entry of readdirSync(join(game, 'minigames')).filter(f => f.endsWith('.js'))) {
  const file = `minigames/${entry}`, name = entry.slice(0, -3), m = (await load(file)).default;
  const source = readFileSync(join(game, file), 'utf8');
  GAMES.set(m, { file, name, source });
  const T = MINIGAMES[name];
  if (!T) { miss(file, 'the mini-game is not in the MINIGAMES table'); continue; }
  if (typeof m.title !== 'string' || !(m.about > 0) || typeof m.run !== 'function') miss(file, 'no title, about or run');
  if (!m.skipped || !same(Object.keys(m.skipped), T.result)) miss(file, `skipped: fields {${Object.keys(m.skipped ?? {}).join(', ')}}, the table’s result {${T.result.join(', ')}}`);
  for (const key of T.opts ?? []) if (!new RegExp(`\\b${key}\\b`).test(source)) miss(file, `opts field “${key}” (MINIGAMES) is not named in the file`);
  for (const [, s] of source.matchAll(/\bsound\.(\w+)/g)) if (!(s in sound) || !(s in sound.unheard().sounds)) miss(file, `sound “${s}” is not in sound.js or in unheard()`);
}
for (const name in MINIGAMES) if (![...GAMES.values()].some(m => m.name === name)) miss(`minigames/${name}.js`, 'no such file');
// every sound has its unheard twin
const quietNames = Object.keys(sound.unheard().sounds);
for (const name of quietNames) if (typeof sound[name] !== 'function') miss('sound.js', `sound “${name}” is in unheard(), but not in sound.js`);
for (const name in sound) {
  if (typeof sound[name] === 'function' && !['pause', 'unheard'].includes(name) && !quietNames.includes(name)) miss('sound.js', `sound “${name}” is not in unheard()`);
}
// “Threads”, as game.js opens it
const threads = WORLD.get(SCENES.threads);
if (threads) {
  for (const key of THREADS.keys) {
    if (!(key in threads.states) && !engines(threads, key)) miss('game.js', `“${SCENES.threads}”: key “${key}” is not in states`);
    if (threads.contract && !(key in threads.contract.party)) miss('game.js', `“${SCENES.threads}”: key “${key}” is not in the contract’s party`);
    threads.named.add(`party:${key}`);
  }
  for (const ref of THREADS.points) {
    if (threads.contract && !threads.contract.points.includes(ref)) miss('game.js', `“${SCENES.threads}”: point “${ref}” is not in the contract`);
    threads.named.add(`ref:${ref}`);
  }
}

// --- a step's g, watched: `here` — where it is (file, step), `events` — what the step did, in order:
// ['scene', title] | ['beat', name, seconds] | ['say', seconds] | ['act'] | ['play', name, about]
const lines = new Map(); // `${who}\n${text}` → {who, text, where}
const mute = () => ({ loud() {}, stop() {} });
function watched(g, j, ch, here, events) {
  const bad = text => miss(here, text);
  let cur = null; // the scene shown: {title, scene, last: the beat begun last, opening: the beat it was opened with, not taken up yet}
  let during = false; // a minigame is on: what is said now is said inside it
  let waits = []; // the moments waited for whose beat has not begun yet: {text, beat}
  const shown = what => (cur ? true : (bad(`${what} — before g.scene`), false));
  const key = (name, what) => { if (shown(`${what} «${name}»`) && !(name in cur.scene.states) && !engines(cur.scene, name)) bad(`${what}: key “${name}” is not in the states of scene “${cur.title}”`); };
  const element = (ref, what) => {
    const o = cur.scene.objects.get(ref.split('#')[0]);
    if (!o) bad(`${what}: element “${ref.split('#')[0]}” is not in scene “${cur.title}”`);
    return o;
  };
  const point = (ref, what) => {
    element(ref, what);
    cur.scene.named.add(`ref:${ref}`);
    if (cur.scene.contract && !cur.scene.contract.points.includes(ref)) bad(`${what}: point “${ref}” is not in the points of scene “${cur.title}”`);
  };
  const offer = (ref, what) => {
    const o = element(ref, what);
    if (o && !o.name) bad(`${what}: element “${o.id}” has no name`);
    cur.scene.named.add(`ref:${ref}`);
    if (cur.scene.contract && !cur.scene.contract.offers.includes(ref)) bad(`${what}: offer “${ref}” is not in the offers of scene “${cur.title}”`);
  };
  const moment = (text, what) => {
    const c = cur.scene.contract, beat = text.split(':')[0];
    cur.scene.named.add(`tell:${text}`);
    if (c && !c.beats[beat]?.tells.includes(text)) bad(`${what}: moment “${text}” is not among beat “${beat}”’s of scene “${cur.title}”`);
  };
  const begins = (name, opening) => {
    const c = cur.scene.contract, beat = c?.beats[name];
    events.push(['beat', name, beat?.seconds ?? 0]);
    cur.scene.named.add(`beat:${name}`);
    if (c && !beat) bad(`beat “${name}” is not in scene “${cur.title}”`);
    if (beat?.show === false) bad(`beat “${name}” of scene “${cur.title}” is for showing only (show: false)`);
    if (!opening && cur.last && beat && !beat.after.includes(cur.last)) put(cuts, here, `«${cur.title}»: ${cur.last} → ${name}`);
    for (const w of waits.filter(w => w.beat === name)) if (!w.end) moment(w.text, 'g.told');
    waits = waits.filter(w => w.beat !== name);
    cur.last = name;
  };
  j.sounds = new Proxy(j.sounds, {
    get(quiet, name) {
      if (typeof name !== 'string') return quiet[name];
      const known = n => {
        if (n in sound && n in quiet) return true;
        bad(`sound “${n}” is not in sound.js or in unheard()`);
        return false;
      };
      if (name === 'beds') return (levels = {}, seconds) => { Object.keys(levels).forEach(known); quiet.beds(levels, seconds); };
      return known(name) ? quiet[name] : mute;
    },
  });
  // a line said or thought over a point of the scene
  const said = (who, text, at) => {
    const what = `line “${text}”`;
    if (!(who in PEOPLE)) bad(`${what}: speaker “${who}” is not in people.json`);
    if (at !== 'narrator' && shown(what)) {
      if (at.includes('#') && !cur.scene.contract?.offers.includes(at)) point(at, what);
      else if (element(at, what)) cur.scene.named.add(`ref:${at}`);
      if (cur.scene.contract?.speakers && !cur.scene.contract.speakers.includes(at) && !cur.scene.contract.offers.includes(at) && !cur.scene.contract.points.includes(at)) bad(`${what}: over “${at}” — it is not in the speakers of scene “${cur.title}”`);
    }
    if (!lines.has(`${who}\n${text}`)) lines.set(`${who}\n${text}`, { who, text, where: here });
    if (!during) events.push(['say', 0.3 + 0.06 * text.length]);
  };
  const w = Object.create(g);
  Object.assign(w, {
    async scene(title, st = {}, how) {
      const scene = WORLD.get(title), party = carry(title, facts(g.state));
      if (scene && party) {
        cur = { title, scene, last: null, opening: typeof st.beat === 'string' ? st.beat : null };
        events.push(['scene', title]);
        for (const k in party) {
          scene.named.add(`party:${k}`);
          if (!(k in scene.states)) bad(`party key “${k}” is not in the states of scene “${title}”`);
          if (scene.contract && !(k in scene.contract.party)) bad(`party key “${k}” is not in the party of scene “${title}”`);
        }
        // (a key the step itself opens the scene with is named too: the party's keys the play does not carry)
        for (const k in st) { key(k, 'g.scene'); scene.named.add(`party:${k}`); }
        if (cur.opening) begins(cur.opening, true);
        else if (scene.contract && Object.keys(scene.contract.beats).length) bad(`scene “${title}” opened without a beat`);
      }
      return g.scene(title, st, how); // (a scene the world or SCENES lacks: the step breaks there)
    },
    beat(name, how) {
      if (shown(`g.beat «${name}»`)) {
        if (cur.opening !== name) begins(name, false);
        cur.opening = null;
      }
      return g.beat(name, how);
    },
    told(text, ms) {
      const [beat, name] = text.split(':');
      if (name == null) bad(`g.told “${text}”: not “<beat>:<moment>”`);
      else if (beat === 'beat') { if (cur?.last !== name) waits.push({ text, beat: name, end: true }); }
      else if (cur?.last === beat) { moment(text, 'g.told'); bad(`g.told “${text}” is set after its beat has begun (for the beat the scene opens with — after g.scene)`); }
      else waits.push({ text, beat });
      return g.told(text, ms);
    },
    heard(text, ms) { return w.told(text, ms); },
    set(k, value, seconds) { key(k, 'g.set'); return g.set(k, value, seconds); },
    get(k) { key(k, 'g.get'); return g.get(k); },
    say(who, text, at = who) { said(who, text, at); return g.say(who, text, at); },
    think(who, text, at = 'narrator') { said(who, text, at); return g.think(who, text, at); },
    choose(choice, ref, options, timed) {
      if (typeof ref !== 'string') timed = options;
      const offers = typeof ref === 'string' ? { [ref]: options } : ref;
      const what = `choice “${choice ?? Object.keys(offers).join(', ')}”`, ids = Object.values(offers).flat().map(o => o.id);
      if (shown(what)) for (const ref in offers) offer(ref, what);
      if (choice != null) {
        const declared = ch.choices.find(c => c.id === choice);
        if (!declared) bad(`${what}: it is not in the chapter’s choices`);
        else if (!ids.every(id => declared.options.some(o => o.id === id))) bad(`${what}: offered {${ids.join(', ')}}, the chapter’s choices {${declared.options.map(o => o.id).join(', ')}}`);
        else if (timed?.late != null && !declared.options.some(o => o.id === timed.late)) bad(`${what}: late “${timed.late}” — not in the chapter’s choices`);
      }
      // (the language's window: a choice on time lasts no less than 6 s; its words — one to three)
      if (timed && !(timed.seconds >= 6)) bad(`${what}: on time ${timed.seconds} s — less than 6`);
      for (const o of Object.values(offers).flat()) if (o.label.split(/\s+/).filter(w => /[\p{L}\d]/u.test(w)).length > 3) bad(`${what}: label “${o.label}” is longer than three words`);
      events.push(['act']);
      return g.choose(choice, offers, timed);
    },
    async play(minigame, opts = {}) {
      const m = GAMES.get(minigame), T = m && MINIGAMES[m.name];
      if (!T) {
        bad('g.play: the mini-game is not from minigames/ or not in MINIGAMES');
        return g.play(minigame, opts);
      }
      const what = `mini-game “${m.name}”`;
      events.push(['play', m.name, minigame.about ?? 0]);
      if (shown(what)) {
        if (cur.title !== SCENES[T.scene]) bad(`${what} plays in scene “${cur.title}”, in MINIGAMES — “${SCENES[T.scene]}”`);
        else {
          for (const k of T.keys) key(k, what);
          for (const ref of T.points ?? []) point(ref, what);
          for (const text of T.tells ?? []) moment(text, what);
        }
      }
      for (const k in opts) {
        if (!(T.opts ?? []).includes(k)) bad(`${what}: opts field “${k}” is not in MINIGAMES`);
        else if (!new RegExp(`\\b${k}\\b`).test(m.source)) bad(`${what}: opts field “${k}” is not named in ${m.file}`);
      }
      const result = await g.play(minigame, opts);
      // (what the chapter gives it to say and to sound: each once)
      during = true;
      for (const fn of Object.values(opts)) if (typeof fn === 'function') await fn(1);
      during = false;
      if (!result || typeof result !== 'object') {
        bad(`${what}: no result (skipped?)`);
        return result;
      }
      return new Proxy(result, {
        get(r, field) {
          if (typeof field === 'string' && field !== 'then' && !(field in (minigame.skipped ?? {}))) bad(`${what}: the chapter reads result field “${field}”, which skipped lacks`);
          return r[field];
        },
      });
    },
  });
  return { g: w, left: () => waits.forEach(t => bad(`g.told “${t.text}”: beat “${t.beat}” did not begin after it in the step`)) };
}

// --- the walk
const b = page(WORLD, text => miss('b.trouble', text));
// one play: its choices, the results put in → {ending, chapters: [[events of each step]]}
async function walk(choices, results) {
  const result = m => {
    const name = GAMES.get(m)?.name;
    return results[name] && { ...m.skipped, ...results[name] };
  };
  let came = fresh();
  const chapters = [];
  for (const ch of CHAPTERS) {
    const steps = [];
    for (const [n, step] of ch.steps.entries()) {
      const here = `${ch.file}, step ${n + 1} “${ch.titles?.[n] ?? ''}”`, events = [];
      const j = jump(Infinity, sound.unheard(), { result });
      const state = { ...structuredClone(came), choices: Object.assign(Object.create(choices), came.choices) };
      const { g, left } = watched(context(b, null, null, state, j), j, ch, here, events);
      const done = await Promise.race([
        (async () => step(g))().then(() => true, e => { miss(here, `step broke: ${e?.message || e}`); return true; }),
        j.idle.then(() => false),
      ]);
      if (!done) miss(here, 'the step did not run dry to its end: it waits for what an unseen step lacks');
      await j.idle; // (what the step began and did not wait for)
      left();
      came = { ...g.state, choices: { ...g.state.choices } };
      steps.push(events);
    }
    chapters.push(steps);
  }
  return { ending: came.marks.ending ?? '—', chapters };
}
const CHOICES = CHAPTERS.flatMap(ch => ch.choices);
const first = Object.fromEntries(CHOICES.map(c => [c.id, c.options[0].id]));
const combos = [first, ...CHOICES.flatMap(c => c.options.slice(1).map(o => ({ ...first, [c.id]: o.id })))];
// the plays that lead to each ending: the ship comes (Petra answered, strong) or not; flown, stayed with Michael
const ENDS = [
  { ...first, river: 'loud', petra: 'free', far: 'answer', leave: 'fly' },
  { ...first, river: 'loud', petra: 'free', far: 'answer', leave: 'stay' },
  { ...first, river: 'loud', petra: 'free', far: 'answer', leave: 'stay', glance: 'away', father: 'run', cover: 'self' },
  { ...first, far: 'listen' },
  // (the ship come, the father let be: the web over us on the ledge — over Petra, over Rosalind; with Rosalind after; and
  // over the father)
  { ...first, river: 'loud', petra: 'free', far: 'answer', father: 'stay', cover: 'petra', leave: 'fly' },
  { ...first, river: 'loud', petra: 'free', far: 'answer', father: 'stay', cover: 'rosalind', glance: 'looked', leave: 'stay' },
  { ...first, river: 'loud', petra: 'free', far: 'answer', cover: 'father', leave: 'fly' },
  { ...first, river: 'loud', petra: 'free', far: 'answer', father: 'stay', cover: 'none', leave: 'fly' },
];
// the plays where David is caught (suspicion high enough: at the gate, or at the forge) — the trial
const CAUGHT = [
  [{ ...first, secret: 'told', hand: 'lie', calf: 'hide', night: 'flee', trial: 'dark' }, { hem: { hid: false }, hymn: { hymn: 'silent', turned: 0.7 } }],
  [{ ...first, secret: 'told', hand: 'lie', calf: 'hide', night: 'flee', answer: 'truth', trial: 'fire' }, { hem: { hid: false }, hymn: { hymn: 'silent', turned: 0.7 }, layers: { looked: true } }],
  [{ ...first, secret: 'told', hand: 'lie', calf: 'hide', night: 'rescue', forge: 'calm', trial: 'dark' }, { hem: { hid: false }, bellows: { broke: true } }],
  // (the group holds — Anne told to Axel, Petra taught to hide: the friends pull him out; and at the forge the hammer)
  [{ ...first, secret: 'told', hand: 'lie', calf: 'hide', night: 'flee', anne: 'axel', petra: 'hush', trial: 'friends' }, { hem: { hid: false }, hymn: { hymn: 'silent', turned: 0.7 } }],
  [{ ...first, secret: 'told', hand: 'lie', calf: 'hide', night: 'rescue', forge: 'force', trial: 'fire' }, { hem: { hid: false }, bellows: { broke: true } }],
];
const plays = [];
for (const choices of [...combos, ...ENDS]) { play = plays.length; plays.push(await walk(choices, CLEAN)); }
for (const [choices, results] of CAUGHT) { play = plays.length; plays.push(await walk(choices, { ...CLEAN, ...results })); }
for (const other of OTHER) { play = plays.length; plays.push(await walk(first, { ...CLEAN, ...other })); }
play = null;

// --- the report
const out = [];
const say = (text = '') => out.push(text);
const met = set => (set.size && set.size < plays.length ? ` (plays: ${set.size})` : '');
const clock = s => { const r = Math.round(s); return `${Math.floor(r / 60)}:${String(r % 60).padStart(2, '0')}`; };
const span = all => { const lo = Math.min(...all), hi = Math.max(...all); return lo === hi ? clock(lo) : `${clock(lo)}…${clock(hi)}`; };
const seconds = events => events.reduce((sum, e) => sum + (e[0] === 'beat' || e[0] === 'play' ? e[2] : e[0] === 'say' ? e[1] : 0), 0);

say(`World: ${world} — ${WORLD.size} scenes. Game: ${CHAPTERS.length} chapters, ${CHAPTERS.reduce((n, ch) => n + ch.steps.length, 0)} steps, ${CHOICES.length} choices.`);
say(`Plays: ${plays.length} (${combos.length} — the first options and every other one once, ${ENDS.length} — to the endings, ${CAUGHT.length} — caught, ${OTHER.length} — with another mini-game outcome).`);

say(`
== Discrepancies: ${misses.size} ==`);
for (const [text, set] of misses) say(`${text}${met(set)}`);

say(`
== Cuts inside a scene (a beat not after its after): ${cuts.size} ==`);
for (const [text, set] of cuts) say(`${text}${met(set)}`);

say('\n== In the scenes’ contracts, named by no play ==');
for (const [title, scene] of WORLD) {
  const c = scene.contract;
  if (!c) continue;
  const left = [
    ...Object.entries(c.beats).filter(([name, beat]) => beat.show !== false && !scene.named.has(`beat:${name}`)).map(([name]) => `beat ${name}`),
    ...[...new Set(Object.values(c.beats).flatMap(beat => beat.tells))].filter(t => !scene.named.has(`tell:${t}`)).map(t => `moment ${t}`),
    ...Object.keys(c.party).filter(k => !scene.named.has(`party:${k}`)).map(k => `party key ${k}`),
    ...[...new Set([...c.points, ...c.offers])].filter(ref => !scene.named.has(`ref:${ref}`)).map(ref => `point ${ref}`),
  ];
  say(`${title}: ${left.join('; ') || '—'}`);
}

// (letters and digits only: the same words written another way)
const bare = text => text.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
const apart = (a, b) => {
  let row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const next = [i];
    for (let k = 1; k <= b.length; k++) next[k] = Math.min(row[k] + 1, next[k - 1] + 1, row[k - 1] + (a[i - 1] === b[k - 1] ? 0 : 1));
    row = next;
  }
  return row[b.length];
};
say(`
== Lines: ${lines.size} (who | text | ≈ s | where first) ==`);
const said = [...lines.values()];
for (const line of said) {
  say(`${line.who} | ${line.text} | ${(0.3 + 0.06 * line.text.length).toFixed(1)} | ${line.where}`);
  for (const other of said) {
    if (other === line) continue;
    const a = bare(line.text), z = bare(other.text);
    if (a === z) say(`    ! repeat: ${other.who} | ${other.text}`);
    else if (Math.min(a.length, z.length) >= 10 && apart(a, z) <= 2) say(`    ! near repeat: ${other.who} | ${other.text}`);
  }
}

say('\n== Beats and time by ending (beats — the contract’s seconds, lines — 0.3 s + 0.06 s a letter, mini-games — about) ==');
for (const ending of ENDINGS) {
  const mine = plays.filter(p => p.ending === ending.id);
  say(`
-- ${ending.label} (${ending.id}): ${mine.length} plays --`);
  if (!mine.length) continue;
  const times = mine.map(p => p.chapters.map(steps => seconds(steps.flat())));
  say(`time: ${CHAPTERS.map((ch, c) => `${ch.number} ${span(times.map(t => t[c]))}`).join(' · ')} · in all ${span(times.map(t => t.reduce((a, x) => a + x, 0)))}`);
  for (const [c, ch] of CHAPTERS.entries()) {
    for (const n of ch.steps.keys()) {
      const ways = new Map();
      for (const p of mine) {
        const events = p.chapters[c][n];
        const way = `${events.filter(e => e[0] !== 'say' && e[0] !== 'act').map(e => (e[0] === 'scene' ? `| ${e[1]}:` : e[0] === 'play' ? `[${e[1]}]` : e[1])).join(' ').replace(/^\| /, '') || '—'} — ${Math.round(seconds(events))} s`;
        ways.set(way, (ways.get(way) ?? 0) + 1);
      }
      for (const [way, count] of ways) say(`${ch.file} ${n + 1} «${ch.titles?.[n] ?? ''}»: ${way}${count < mine.length ? ` (plays: ${count})` : ''}`);
    }
  }
}

// a stretch of watching: from one thing the player does (a knot of “Threads”, a choice, a minigame) to the next. “Threads”
// stands before every chapter and after it (game.js)
const long = new Map(); // `${from} → ${to}` → [seconds of each play it is long in]
for (const p of plays) {
  let run = 0, from = 'the beginning';
  const acted = to => {
    if (run > WATCH) long.set(`${from} → ${to}`, [...(long.get(`${from} → ${to}`) ?? []), run]);
    run = 0;
    from = to;
  };
  for (const [c, ch] of CHAPTERS.entries()) {
    acted(`“Threads” before ${ch.file}`);
    for (const [n, events] of p.chapters[c].entries()) {
      for (const e of events) {
        if (e[0] === 'beat') run += e[2];
        else if (e[0] === 'say') run += e[1];
        else if (e[0] !== 'scene') acted(`${ch.file}, step ${n + 1} “${ch.titles?.[n] ?? ''}”`);
      }
    }
    acted(`“Threads” after ${ch.file}`);
  }
  acted('the end');
}
say(`
== Watching with nothing to do longer than ${WATCH} s: ${long.size} ==`);
for (const [where, all] of long) say(`${where}: ${span(all)} (plays: ${all.length})`);

// (a dry run's clock — jump.js — keeps the process alive: leave once all is written)
process.stdout.write(`${out.join('\n')}\n`, () => process.exit(misses.size ? 1 : 0));
