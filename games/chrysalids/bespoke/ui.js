// What the game shows over the scene (bespoke.layer): the eye in the corner — how much the people
// around suspect, darker the more; and the few words that come up when a scale moves or someone
// will remember ("The group ↑", "Sophie will remember this."). The corner's tools: ⏭ while there is
// something to skip — a minigame (every player: a safety net if it glitches, not a way through) or, for the author
// only, a step (game.js); for the author a map (the page's ☰ opens it: bespoke.menu) — every chapter and its steps
// (and the minigames a step has, under it), to go to any of them.
//   view.onSkip(fn) → off — fn is what ⏭ does now (the latest one, until off()); none — the ⏭ not shown
//   view.author({ chapters, at() → {chapter, step}, plays(chapter, step) → [titles of its minigames], go(chapter, step,
//     minigame) }) — the author's tools: a step to go to, or a minigame of it (its index among the step's); → what opens
//     them (the game gives it to bespoke.menu: the page's ☰)
// an element of a tag and class, with text
const el = (tag, cls, text) => Object.assign(document.createElement(tag), cls ? { className: cls } : {}, text != null ? { textContent: text } : {});
// a line of «now»: a name and what stands by it
const line = (name, words) => { const p = el('p'); p.append(el('b', '', name), ' — ', words); return p; };

export function ui(layer) {
  const eye = document.createElement('div');
  eye.className = 'eye';
  eye.title = tr('suspicion');
  eye.innerHTML = '<svg viewBox="0 0 48 28"><path d="M2 14C10 4 38 4 46 14C38 24 10 24 2 14Z"/><circle cx="24" cy="14" r="6"/></svg>';
  const toasts = document.createElement('div');
  toasts.className = 'toasts';
  // the corner's tools: ⏭ while something can be skipped (⏸, ☰ — the page's)
  const tools = document.createElement('div');
  tools.className = 'tools';
  layer.append(eye, toasts, tools);
  const skips = []; // what ⏭ does, the latest last
  // (a button is never focused: the keys are the minigames')
  const skip = Object.assign(el('button', '', '⏭'), { type: 'button', title: tr('skip'), onclick: () => skips.at(-1)?.(), onmousedown: e => e.preventDefault() });
  const skipShown = () => { skip.hidden = !skips.length; };
  tools.append(skip);
  skipShown();
  return {
    eye(level) { eye.style.setProperty('--level', Math.min(3, Math.max(0, level))); },
    toast(text, kind = 'scale') {
      const t = document.createElement('p');
      t.className = kind;
      t.textContent = text;
      toasts.append(t);
      setTimeout(() => t.classList.add('gone'), 3800);
      setTimeout(() => t.remove(), 5200);
    },
    onSkip(fn) {
      skips.push(fn);
      skipShown();
      return () => { const i = skips.indexOf(fn); if (i >= 0) skips.splice(i, 1); skipShown(); };
    },
    // “Threads”: how things stand now, in the corner — the scales in words, what the people think of David; no numbers.
    // { scales: [{name, words}], people: [{who, now}] } → it taken away
    now({ scales, people }) {
      const box = el('aside', 'now');
      for (const s of scales) box.append(line(s.name, s.words));
      if (people.length) box.append(el('hr'), ...people.map(p => line(p.who, p.now)));
      tools.before(box);
      return () => box.remove();
    },
    // a replay played to its end: how things would stand if it is kept, beside how they stand in the main run — only
    // what differs. { main, replay: {scales, people}, people: [{who, was, now}] } → it taken away
    compare({ main, replay, people }) {
      const box = el('div', 'compare');
      box.append(el('b', '', tr('If you keep it so')));
      replay.scales.forEach((s, k) => { if (s.words !== main.scales[k].words) box.append(line(s.name, `${main.scales[k].words} → ${s.words}`)); });
      for (const p of people) box.append(line(p.who, `${p.was} → ${p.now}`));
      if (box.children.length === 1) box.append(el('span', '', tr('everything stays as it was')));
      tools.before(box);
      return () => box.remove();
    },
    author({ chapters, at, plays, go }) {
      const button = (text, title, onclick) => Object.assign(el('button', '', text), { type: 'button', title, onclick });
      // the map (the page's ☰ opens it): every chapter a column of its steps (and their minigames) in a window over
      // the scene; a click outside, ✕
      // or Esc closes it
      const map = el('div', 'author-map');
      map.hidden = true;
      const close = () => { map.hidden = true; };
      map.onclick = e => { if (e.target === map) close(); };
      addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
      const open = () => {
        const here = at(), panel = el('div', 'author-panel');
        panel.append(button('✕', 'close (Esc)', close), ...chapters.map((c, ci) => {
          const col = el('section');
          col.append(el('h3', '', `${c.number}. ${c.title}`));
          for (const [si] of c.steps.entries()) {
            const step = button(c.titles?.[si] || `step ${si + 1}`, '', () => go(ci, si));
            if (ci === here.chapter && si === here.step) step.className = 'here';
            // (its minigames under it, once they are known: straight to one)
            const games = el('div', 'minigames');
            plays(ci, si).then(list => games.append(...list.map((name, k) =>
              Object.assign(button(`◆ ${name}`, 'straight to the mini-game', () => go(ci, si, k)), { className: 'minigame' }))));
            col.append(step, games);
          }
          return col;
        }));
        map.replaceChildren(panel);
        map.hidden = false;
      };
      const toggle = () => (map.hidden ? open() : close());
      layer.append(map);
      return toggle;
    },
  };
}
