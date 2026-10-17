// What the game shows over the scene (bespoke.layer): the eye in the corner — how much the people
// around suspect, darker the more; the few words that come up when a scale moves or someone
// will remember ("The group ↑", "Sophie will remember this."); the plate “Replay” in the other corner while a replay is
// going (game.js). The ⏸, ⏭ and ☰ are the page's. For the author a map (its mark on “Threads” opens it) — every chapter
// and its steps (and the minigames a step has, under it), to go to any of them.
//   view.replaying(on) — the plate shown or not
//   view.author({ chapters, at() → {chapter, step}, plays(chapter, step) → [titles of its minigames], go(chapter, step,
//     minigame) }) — the author's tools: a step to go to, or a minigame of it (its index among the step's); → what opens
//     them (or closes)
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
  const replay = el('div', 'replay', tr('Replay'));
  replay.hidden = true;
  layer.append(eye, toasts, replay);
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
    replaying(on) { replay.hidden = !on; },
    // “Threads”: how things stand now, in the corner — the scales in words, what the people think of David; no numbers.
    // { scales: [{name, words}], people: [{who, now}] } → it taken away
    now({ scales, people }) {
      const box = el('aside', 'now');
      for (const s of scales) box.append(line(s.name, s.words));
      if (people.length) box.append(el('hr'), ...people.map(p => line(p.who, p.now)));
      layer.append(box);
      return () => box.remove();
    },
    // a replay played to its end: how things would stand if it is kept, beside how they stand in the main run — only
    // what differs —, and whether the chapters after it are to be played anew then. { main: {scales, people} | null
    // (not known), replay, people: [{who, was, now}], again } → it taken away
    compare({ main, replay, people, again }) {
      const box = el('div', 'compare');
      box.append(el('b', '', tr('If you keep this')));
      if (main) {
        replay.scales.forEach((s, k) => { if (s.words !== main.scales[k].words) box.append(line(s.name, `${main.scales[k].words} → ${s.words}`)); });
        for (const p of people) box.append(line(p.who, `${p.was} → ${p.now}`));
        if (box.children.length === 1) box.append(el('p', '', tr('everything stays as it was')));
      }
      if (again) box.append(el('p', 'again', tr('The chapters after this one will have to be played again.')));
      layer.append(box);
      return () => box.remove();
    },
    author({ chapters, at, plays, go }) {
      const button = (text, title, onclick) => Object.assign(el('button', '', text), { type: 'button', title, onclick });
      // the map: every chapter a column of its steps (and their minigames) in a window over the scene; a click outside,
      // ✕ or Esc closes it
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
            const step = button(c.titles?.[si] || `step ${si + 1}`, '', () => { close(); go(ci, si); });
            if (ci === here.chapter && si === here.step) step.className = 'here';
            // (its minigames under it, once they are known: straight to one)
            const games = el('div', 'minigames');
            plays(ci, si).then(list => games.append(...list.map((name, k) =>
              Object.assign(button(`◆ ${name}`, 'straight to the mini-game', () => { close(); go(ci, si, k); }), { className: 'minigame' }))));
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
