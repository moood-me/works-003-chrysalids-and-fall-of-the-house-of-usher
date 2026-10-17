// The check of the game's branches: node bespoke/check/run.mjs <a clone of the world>. No browser, no engine,
// nothing drawn. Every step of every chapter is played unseen, the way the author's map plays it (jump.js: a dry run,
// story.js context(…, j)), on a page that only knows the scenes' specs (fake.mjs): no time passes, the choices are
// those of the play walked (a choice on time: its moment passed, if that is what the play has), a minigame gives the
// result put in for it.
// Walked (the chapters' choices are too many to walk every combination of): the play of the first options with the
// minigames played cleanly; then each other option of each choice once, the rest as in the first play; then the first
// play with each minigame's other outcome (OTHER); then the plays that lead to each ending (ENDS). Each play — all the
// steps in order, its state going from step to step; a step that sets the ending ends the chapters, the epilogue comes
// next (game.js).
// Noted, by a wrapper over the step's g (an unseen step's lines and offers never reach j) and over the sounds j plays:
// each scene opened and its keys, each beat, moment waited for, key set / moved / read, point asked, offer and its
// options, line (who, text, over what), minigame with its opts and the fields of its result the chapter reads, sound.
// A minigame is not run: what it takes of its scene is the table below (MINIGAMES; docs/asherov/v3.md §2); the functions a
// chapter gives it in opts are each called — with each list of arguments its `calls` gives, else once with 1 — so the
// lines they say are heard.
// Compared with each scene's scene.json and the block «Contract for the check» that ends its notes.md (docs/asherov/v3.md):
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
const { SCENES, SCALES, facts, carry, context } = await load('story.js');
const { endings: ENDINGS } = (await load('chapters/epilogue.js')).default;
const { jump } = await load('jump.js');
const sound = await load('sound.js');

const WATCH = 90; // a stretch of watching longer than this, s, is reported
const several = (stem, n, tail = '') => Array.from({ length: n }, (_, i) => `${stem}${i + 1}${tail}`);
// The minigames (minigames/*.js heads): the scene a minigame is played on, the keys it moves and listens to, the moments
// it waits for, the beats it plays itself, the points its marks stand on, the fields of its opts (and what the opts'
// functions are called with) and of its result
const MINIGAMES = {
  cause: { scene: 'house', keys: ['gloom', 'crack_trace'], beats: ['trace'], points: ['windows@', 'trees#trunk', 'tarn@', ...Array.from({ length: 17 }, (_, i) => `crack#k${i}`)], opts: ['onLook'], calls: { onLook: [['windows', 1], ['trees', 2], ['tarn', 3]] }, result: ['looked', 'traced'] },
  quieter: { scene: 'room', keys: ['candles', 'curtain', 'window_open', 'clock'], beats: ['ease', 'flinch'], points: ['candles@', 'window#glass', 'clock#dial', 'portrait#face'], opts: ['onAct'], calls: { onAct: ['his', 'mine'].flatMap(kind => ['candles', 'window', 'clock'].map(which => [kind, which])) }, result: ['his', 'mine', 'order'] },
  string: { scene: 'room', keys: ['tempo', 'wild', 'strum', 'narrator_do'], points: ['roderick#hand_r', 'narrator#hand_r'], result: ['follow', 'wild'] },
  'by-the-hand': { scene: 'house', keys: ['walk', 'walk_at', 'resist'], points: ['roderick#hand_l', 'lead@'], result: ['seconds', 'letGo'] },
  screws: { scene: 'vault', keys: ['screw1', 'screw2', 'screw3', 'screw4', 'screw_at'], points: [...several('closeup#screw', 4), 'closeup#leave'], opts: ['promised'], result: ['loose', 'seconds'] },
  listening: { scene: 'storm', keys: ['ripple', 'listen'], points: ['floor#mid', 'ripple@'], opts: ['clarity'], result: ['heard', 'seconds'] },
  knock: { scene: 'vault', keys: ['knock', 'answer'], points: ['outside#door', 'outside#away'], result: ['knocks', 'answered'] },
  reading: { scene: 'storm', keys: ['sound', 'rock', 'listen'], points: ['book@'], result: ['louder', 'listened'] },
  hands: { scene: 'storm', keys: ['rod_reach', 'mad_reach', 'rod_to_mad', 'mad_to_rod', 'grab', 'grab_x', 'grab_y', 'held_rod', 'held_mad', 'quake', 'shudder'], points: ['closeup#nar_hand', 'closeup#rod_hand', 'closeup#mad_hand', 'closeup#stay'], opts: ['roderick', 'madeline', 'both', 'time'], result: ['took', 'stayed'] },
  flight: { scene: 'fall', keys: ['run', 'run_at', 'fall', 'swim'], beats: ['stumble'], points: ['narrator'], opts: ['companions', 'speed', 'sanity'], result: ['escaped'] },
};
// what game.js itself takes of «Crack» (it is not run here): its key, the points its trees stand at (map.js) — each
// chapter's and the author's sign's
const MAP = { keys: ['shown'], points: [...Array.from({ length: 6 }, (_, i) => `c${i}`), 'author'] };
// the results put in: the outcomes a chapter branches on — clean, and each one's other
const CLEAN = {};
const OTHER = [{ quieter: { his: 0, mine: 3, order: [['candles', 'mine'], ['window', 'mine'], ['clock', 'mine']] } }, { quieter: { his: 3, mine: 0, order: [['candles', 'his'], ['window', 'his'], ['clock', 'his']] } },
  { string: { follow: 1, wild: 1 } }, { string: { follow: 0, wild: 0 } }, { screws: { loose: [2, 4], seconds: 20 } }, { listening: { heard: 'melody', seconds: 10 } },
  { reading: { louder: 2, listened: 0 } }, { reading: { louder: 0, listened: 2 } }, { hands: { took: 'none', stayed: true } }, { flight: { escaped: false } }];

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

// a play at its beginning (game.js fresh)
const fresh = () => ({ chapter: 0, step: 0, scales: Object.fromEntries(Object.entries(SCALES).map(([k, s]) => [k, s.start])), shown: {}, heard: {}, marks: {}, choices: {}, ending: null });
// an element's id from a point's ref ('id#name' — a point it names, 'id@' — where it is pressed)
const idOf = ref => ref.replace(/[#@].*$/, '');
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
  for (const ref of c.speakers ?? []) if (!scene.objects.has(idOf(ref))) miss(notes, `speaker “${ref}”: no such element in ${spec}`);
  // (a key the play has not decided yet is carried as the scene's own default)
  for (const [key, value] of Object.entries(carry(title, facts(fresh())) ?? {})) {
    if (key in c.party && JSON.stringify(c.party[key]) !== JSON.stringify(value)) miss(notes, `party key “${key}”: default ${JSON.stringify(c.party[key])}, a run without choices carries ${JSON.stringify(value)}`);
  }
  for (const ref of [...c.points, ...c.offers]) {
    if (!scene.objects.has(idOf(ref))) miss(notes, `point “${ref}”: no such element in ${spec}`);
  }
  for (const ref of c.offers) {
    const o = scene.objects.get(idOf(ref));
    if (o && !o.name) miss(notes, `offer “${ref}”: the element has no name (${spec})`);
  }
}
for (const title of Object.values(SCENES)) if (!WORLD.has(title)) miss('story.js', `scene “${title}” (SCENES) is not in the world`);

// --- the game's own files
const CHAPTERS = [];
for (const name of ['prologue', '1', '2', '3', '4', 'epilogue']) {
  const file = `chapters/${name}.js`, ch = (await load(file)).default;
  CHAPTERS.push({ file, ...ch });
  if (!Array.isArray(ch.choices)) throw new Error(`${file}: no choices`);
  if (!Array.isArray(ch.titles) || ch.titles.length !== ch.steps.length) miss(file, `titles: ${ch.titles?.length ?? 'none'}, steps: ${ch.steps.length}`);
}
const GAMES = new Map(); // a minigame (the module's default export) → {file, name, source}
// what a minigame gives skipped (a clean play): its `skipped`, or skipped(opts)
const cleanOf = (m, opts = {}) => (typeof m.skipped === 'function' ? m.skipped(opts) : m.skipped);
for (const entry of readdirSync(join(game, 'minigames')).filter(f => f.endsWith('.js'))) {
  const file = `minigames/${entry}`, name = entry.slice(0, -3), m = (await load(file)).default;
  const source = readFileSync(join(game, file), 'utf8');
  GAMES.set(m, { file, name, source });
  const T = MINIGAMES[name];
  if (!T) { miss(file, 'the mini-game is not in the MINIGAMES table'); continue; }
  if (typeof m.title !== 'string' || !(m.about > 0) || typeof m.run !== 'function') miss(file, 'no title, about or run');
  const clean = m.skipped && cleanOf(m);
  if (!clean || !same(Object.keys(clean), T.result)) miss(file, `skipped: fields {${Object.keys(clean ?? {}).join(', ')}}, outcome in the table {${T.result.join(', ')}}`);
  for (const key of T.opts ?? []) if (!new RegExp(`\\b${key}\\b`).test(source)) miss(file, `opts field “${key}” (MINIGAMES) is not named in the file`);
  for (const [, s] of source.matchAll(/\bg\.sound\.(\w+)/g)) if (!(s in sound) || !(s in sound.unheard().sounds)) miss(file, `sound “${s}” is not in sound.js or in unheard()`);
}
for (const name in MINIGAMES) if (![...GAMES.values()].some(m => m.name === name)) miss(`minigames/${name}.js`, 'no such file');
// every sound has its unheard twin
const quietNames = Object.keys(sound.unheard().sounds);
for (const name of quietNames) if (typeof sound[name] !== 'function') miss('sound.js', `sound “${name}” is in unheard(), but not in sound.js`);
for (const name in sound) {
  if (typeof sound[name] === 'function' && !['pause', 'unheard'].includes(name) && !quietNames.includes(name)) miss('sound.js', `sound “${name}” is not in unheard()`);
}
// «Crack», as game.js opens it
const wall = WORLD.get(SCENES.wall);
if (wall) {
  for (const key of MAP.keys) {
    if (!(key in wall.states)) miss('game.js', `“${SCENES.wall}”: no key “${key}” in states`);
    if (wall.contract && !(key in wall.contract.party)) miss('game.js', `“${SCENES.wall}”: no key “${key}” in the contract’s party`);
    wall.named.add(`party:${key}`);
  }
  for (const ref of MAP.points) {
    if (wall.contract && !wall.contract.points.includes(ref)) miss('game.js', `“${SCENES.wall}”: no point “${ref}” in the contract`);
    wall.named.add(`ref:${ref}`);
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
  const key = (name, what) => { if (shown(`${what} «${name}»`) && !(name in cur.scene.states) && !engines(cur.scene, name)) bad(`${what}: no key “${name}” in the states of scene “${cur.title}”`); };
  const element = (ref, what) => {
    const o = cur.scene.objects.get(idOf(ref));
    if (!o) bad(`${what}: no element “${idOf(ref)}” in scene “${cur.title}”`);
    return o;
  };
  const point = (ref, what) => {
    element(ref, what);
    cur.scene.named.add(`ref:${ref}`);
    if (cur.scene.contract && !cur.scene.contract.points.includes(ref)) bad(`${what}: no point “${ref}” in the points of scene “${cur.title}”`);
  };
  const offer = (ref, what) => {
    const o = element(ref, what);
    if (o && !o.name) bad(`${what}: element “${o.id}” has no name`);
    cur.scene.named.add(`ref:${ref}`);
    if (cur.scene.contract && !cur.scene.contract.offers.includes(ref)) bad(`${what}: no offer “${ref}” in the offers of scene “${cur.title}”`);
  };
  const moment = (text, what) => {
    const c = cur.scene.contract, beat = text.split(':')[0];
    cur.scene.named.add(`tell:${text}`);
    if (c && !c.beats[beat]?.tells.includes(text)) bad(`${what}: beat “${beat}” of scene “${cur.title}” has no moment “${text}”`);
  };
  const begins = (name, opening) => {
    const c = cur.scene.contract, beat = c?.beats[name];
    events.push(['beat', name, beat?.seconds ?? 0]);
    cur.scene.named.add(`beat:${name}`);
    if (c && !beat) bad(`no beat “${name}” in scene “${cur.title}”`);
    if (beat?.show === false) bad(`beat “${name}” of scene “${cur.title}” is for the showcase only (show: false)`);
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
      if (/[#@]/.test(at) && !cur.scene.contract?.offers.includes(at)) point(at, what);
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
        else if (scene.contract && Object.keys(scene.contract.beats).length) bad(`scene “${title}” is opened without a beat`);
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
      else if (cur?.last === beat) { moment(text, 'g.told'); bad(`g.told “${text}” is placed after its beat has begun (for the beat the scene opens with — after g.scene)`); }
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
        else if (!ids.every(id => declared.options.some(o => o.id === id))) bad(`${what}: offered {${ids.join(', ')}}, the chapter’s choices have {${declared.options.map(o => o.id).join(', ')}}`);
        else if (timed?.late != null && !declared.options.some(o => o.id === timed.late)) bad(`${what}: late “${timed.late}” — not in the chapter’s choices`);
      }
      // (the language's window: a choice on time lasts no less than 6 s; its words — one to three)
      if (timed && !(timed.seconds >= 6)) bad(`${what}: a time of ${timed.seconds} s — less than 6`);
      for (const o of Object.values(offers).flat()) if (o.label.split(/\s+/).filter(w => /[\p{L}\d]/u.test(w)).length > 3) bad(`${what}: label “${o.label}” is longer than three words`);
      events.push(['act']);
      return g.choose(choice, offers, timed);
    },
    async play(minigame, opts = {}) {
      const m = GAMES.get(minigame), T = m && MINIGAMES[m.name];
      if (!T) {
        bad('g.play: the mini-game is not from minigames/ or is not in MINIGAMES');
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
          for (const name of T.beats ?? []) {
            if (cur.scene.contract && !cur.scene.contract.beats[name]) bad(`${what}: no beat “${name}” in scene “${cur.title}”`);
            cur.scene.named.add(`beat:${name}`);
          }
        }
      }
      for (const k in opts) {
        if (!(T.opts ?? []).includes(k)) bad(`${what}: no opts field “${k}” in MINIGAMES`);
        else if (!new RegExp(`\\b${k}\\b`).test(m.source)) bad(`${what}: opts field “${k}” is not named in ${m.file}`);
      }
      const result = await g.play(minigame, opts);
      // (what the chapter gives it to say and to sound: each once)
      during = true;
      for (const [k, fn] of Object.entries(opts)) if (typeof fn === 'function') for (const args of T.calls?.[k] ?? [[1]]) await fn(...args);
      during = false;
      if (!result || typeof result !== 'object') {
        bad(`${what}: no outcome (skipped?)`);
        return result;
      }
      return new Proxy(result, {
        get(r, field) {
          if (typeof field === 'string' && field !== 'then' && !(field in (cleanOf(minigame, opts) ?? {}))) bad(`${what}: the chapter reads outcome field “${field}”, which skipped does not have`);
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
    return results[name] && { ...cleanOf(m), ...results[name] };
  };
  let came = fresh();
  const chapters = [];
  for (const ch of CHAPTERS) {
    const steps = [];
    // (the ending set: the chapters left between are not played — the epilogue comes next, game.js)
    if (came.ending && ch !== CHAPTERS.at(-1)) { chapters.push(steps); continue; }
    for (const [n, step] of ch.steps.entries()) {
      const here = `${ch.file}, step ${n + 1} “${ch.titles?.[n] ?? ''}”`, events = [];
      const j = jump(Infinity, sound.unheard(), { result });
      const state = { ...structuredClone(came), choices: Object.assign(Object.create(choices), came.choices) };
      const { g, left } = watched(context(b, null, null, state, j), j, ch, here, events);
      const done = await Promise.race([
        (async () => step(g))().then(() => true, e => { miss(here, `a step broke: ${e?.message || e}`); return true; }),
        j.idle.then(() => false),
      ]);
      if (!done) miss(here, 'the dry run of the step did not reach its end: it waits for something the unseen step does not have');
      await j.idle; // (what the step began and did not wait for)
      left();
      came = { ...g.state, choices: { ...g.state.choices } };
      steps.push(events);
      // (the ending set: the chapter ends here)
      if (came.ending && ch !== CHAPTERS.at(-1)) break;
    }
    chapters.push(steps);
  }
  return { ending: came.ending ?? '—', chapters };
}
const CHOICES = CHAPTERS.flatMap(ch => ch.choices);
const first = Object.fromEntries(CHOICES.map(c => [c.id, c.options[0].id]));
const combos = [first, ...CHOICES.flatMap(c => c.options.slice(1).map(o => ({ ...first, [c.id]: o.id })))];
// the plays that lead to each ending (the hands are «Hands»'s outcome; caught on the causeway — «Run»'s), and the ones
// in which the trust and what she heard have both hands reach out (she heard him: “she may be living”; he trusts him:
// by his way in the room, with his music, staying with him)
const TRUSTED = { ...first, coffin: 'said', madeline: 'stay', string: 'follow' };
const ENDS = [
  [first, {}],
  [TRUSTED, { hands: { took: 'madeline', stayed: false } }],
  [TRUSTED, { hands: { took: 'roderick', stayed: false } }],
  [{ ...TRUSTED, screws: 'loose' }, { hands: { took: 'both', stayed: false }, screws: { loose: [2], seconds: 20 } }],
  [first, { hands: { took: 'none', stayed: true } }],
  [first, { flight: { escaped: false } }],
  [{ ...first, carriage: 'left' }, {}],
  [{ ...first, morning: 'left' }, {}],
  // (the mind gone — sanity 0: the tarn looked into, his room his way, his music followed, back to the house, the storm
  // watched with him — «Hands» not played)
  [{ ...first, walk: 'back', window: 'watch' }, {}],
];
const plays = [];
for (const choices of combos) { play = plays.length; plays.push(await walk(choices, CLEAN)); }
for (const [choices, results] of ENDS) { play = plays.length; plays.push(await walk(choices, { ...CLEAN, ...results })); }
for (const other of OTHER) { play = plays.length; plays.push(await walk(first, { ...CLEAN, ...other })); }
play = null;

// --- the report
const out = [];
const say = (text = '') => out.push(text);
const met = set => (set.size && set.size < plays.length ? ` (runs: ${set.size})` : '');
const clock = s => { const r = Math.round(s); return `${Math.floor(r / 60)}:${String(r % 60).padStart(2, '0')}`; };
const span = all => { const lo = Math.min(...all), hi = Math.max(...all); return lo === hi ? clock(lo) : `${clock(lo)}…${clock(hi)}`; };
const seconds = events => events.reduce((sum, e) => sum + (e[0] === 'beat' || e[0] === 'play' ? e[2] : e[0] === 'say' ? e[1] : 0), 0);

say(`World: ${world} — ${WORLD.size} scenes. Game: ${CHAPTERS.length} chapters, ${CHAPTERS.reduce((n, ch) => n + ch.steps.length, 0)} steps, ${CHOICES.length} choices.`);
say(`Runs: ${plays.length} (${combos.length} — the first options and every other one once, ${ENDS.length} — to the endings, ${OTHER.length} — with another mini-game outcome).`);

say(`
== Discrepancies: ${misses.size} ==`);
for (const [text, set] of misses) say(`${text}${met(set)}`);

say(`
== Seams within a scene (a beat does not follow its after): ${cuts.size} ==`);
for (const [text, set] of cuts) say(`${text}${met(set)}`);

say('\n== In the scenes’ contracts, named by no run ==');
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
-- ${ending.label} (${ending.id}): ${mine.length} runs --`);
  if (!mine.length) continue;
  const times = mine.map(p => p.chapters.map(steps => seconds(steps.flat())));
  say(`time: ${CHAPTERS.map((ch, c) => `${ch.number} ${span(times.map(t => t[c]))}`).join(' · ')} · in all ${span(times.map(t => t.reduce((a, x) => a + x, 0)))}`);
  for (const [c, ch] of CHAPTERS.entries()) {
    for (const n of ch.steps.keys()) {
      const ways = new Map();
      for (const p of mine) {
        const events = p.chapters[c][n] ?? []; // (a chapter the ending cut short: its steps after it not played)
        const way = `${events.filter(e => e[0] !== 'say' && e[0] !== 'act').map(e => (e[0] === 'scene' ? `| ${e[1]}:` : e[0] === 'play' ? `[${e[1]}]` : e[1])).join(' ').replace(/^\| /, '') || '—'} — ${Math.round(seconds(events))} s`;
        ways.set(way, (ways.get(way) ?? 0) + 1);
      }
      for (const [way, count] of ways) say(`${ch.file} ${n + 1} «${ch.titles?.[n] ?? ''}»: ${way}${count < mine.length ? ` (runs: ${count})` : ''}`);
    }
  }
}

// a stretch of watching: from one thing the player does (the knot of «Crack», a choice, a minigame) to the next.
// «Crack» stands before every chapter and after it (game.js)
const long = new Map(); // `${from} → ${to}` → [seconds of each play it is long in]
for (const p of plays) {
  let run = 0, from = 'start';
  const acted = to => {
    if (run > WATCH) long.set(`${from} → ${to}`, [...(long.get(`${from} → ${to}`) ?? []), run]);
    run = 0;
    from = to;
  };
  for (const [c, ch] of CHAPTERS.entries()) {
    acted(`“Fissure” before ${ch.file}`);
    for (const [n, events] of p.chapters[c].entries()) {
      for (const e of events) {
        if (e[0] === 'beat') run += e[2];
        else if (e[0] === 'say') run += e[1];
        else if (e[0] !== 'scene') acted(`${ch.file}, step ${n + 1} “${ch.titles?.[n] ?? ''}”`);
      }
    }
    acted(`“Fissure” after ${ch.file}`);
  }
  acted('end');
}
say(`
== Watching without action longer than ${WATCH} s: ${long.size} ==`);
for (const [where, all] of long) say(`${where}: ${span(all)} (runs: ${all.length})`);

// (a dry run's clock — jump.js — keeps the process alive: leave once all is written)
process.stdout.write(`${out.join('\n')}\n`, () => process.exit(misses.size ? 1 : 0));
