// The map's trees (game.js map), over «Нити» — the play on the night sky. The scene is only the sky and a point for each
// chapter (c<i>: unseen, where the chapter's knot is) and for the author's sign (author); each tree is the game's own —
// HTML laid out by CSS (its words never run into one another) — in bespoke.underlay (under the language's marks). A
// tree stands at its chapter's point and goes with it each frame the scene says (bespoke.onFrame): the sky dragged,
// brought to a chapter, walked toward (the wheel, a pinch: nearer, larger — by the point's depth). Every size is in
// the frame's height (--u: a 900th of it). What lives is CSS, transform and opacity only (it stands with the play's
// pause): the knots breathe, the pointers' arrows nudge, a chapter just played comes row by row.
// A tree: its number and title over its knot (the current chapter's larger), a gold lead down to its rows; a row — a
// fork: the question on the left | the trunk with a gold dot | the answers on the right, the main run's first in gold,
// the others smaller under it on twigs (a replay's pale blue); ⚑ — a key one; a replay's thread dashed pale blue
// beside the trunk, from its first row to its last, and the plate «Переигровка» on its tree. Where the play is: the
// main run's chapter — a pending row after its last fork reached, the trunk dashed on from it, «продолжить игру» with
// its arrow; a replay — a cursor row under the last fork it played, «продолжить переигровку».
// What can be done on it is the map's own: its pointers, played forks (the dot, the answer chosen), knots and heads,
// the author's ring — pressed, the game opens the language's mark there, born open (story.js hub.ask). Only what is
// offered takes a touch (≥ 44 px); the rest of the sky is the scene's (dragged).
//   trees(b, chapters, {shown, grow, seconds, author}) → { at(ref) → () => {x, y} | null — that element's page point
//     now (refs: knot:<i>, fork:<i>:<k> — the dot of row k —, go:<i> — the main run's pointer —, cursor:<i> — the
//     replay's —, author); offer(refs, fn) — those take a press, fn(ref) told; shown(i) — the chapter in the middle
//     (its knot brighter); remove() }
//   chapters — as game.js sky() gives them: [{number, title, kind: here | played | next | future | end, map: [{title,
//     weight, options: [{label, state: chosen | tried | both | open | unseen}]}] | null, badge (a replay in it), go (the
//     main run's pointer: its words) | null, cursor (the replay's pointer)}]; grow — the chapter whose rows come one
//     after another within `seconds`; author — the author's sign shown
const DIST = 10; // m: the points' distance from the eye — a tree drawn at its size there
const ROW = 0.65; // s: a row just played after the one before it (less, for a chapter of many, to be in within `seconds`)
const NS = 'http://www.w3.org/2000/svg';
const el = (tag, cls, text) => Object.assign(document.createElement(tag), cls ? { className: cls } : {}, text != null ? { textContent: text } : {});
const svg = (cls, box, d, attrs = {}) => {
  const s = document.createElementNS(NS, 'svg'), p = document.createElementNS(NS, 'path');
  for (const [k, v] of Object.entries({ class: cls, viewBox: box, 'aria-hidden': 'true', ...attrs })) s.setAttribute(k, v);
  p.setAttribute('d', d);
  s.append(p);
  return s;
};
const tip = cls => svg(cls, '0 0 12 8', 'M1 1L6 6L11 1');
const arrow = () => svg('arr', '0 0 26 10', 'M0 5H24M19 1l5 4-5 4');
const twig = () => svg('twig', '0 0 22 16', 'M0 0 C0 9 9 16 22 16', { preserveAspectRatio: 'none' });
// a press's place: a button (none of it seen) over what it is on
const hit = (ref, label) => { const h = el('button', 'hit'); h.type = 'button'; h.dataset.ref = ref; h.setAttribute('aria-label', label); return h; };
const main = row => row.options.some(o => o.state === 'chosen' || o.state === 'both');
const tried = row => row.options.some(o => o.state === 'tried' || o.state === 'both');
const last = (rows, f) => rows.reduce((a, r, k) => (f(r) ? k : a), -1);

export function trees(b, chapters, { shown = 0, grow = null, seconds = 6, author = false } = {}) {
  const root = el('div', 'map');
  b.underlay.append(root);
  // [{ref: the scene's point, box: at it (scaled there), node: what stands in it, nodes: Map ref → an element a mark
  // stands on, offsets: Map ref → [x, y] from the point at size 1, i: the chapter}]
  const stands = [];
  const offsets = new Map(); // a ref → the stand it is in
  let offered = new Set(), told = null;
  root.addEventListener('click', e => {
    const ref = e.target.closest?.('[data-ref]')?.dataset.ref;
    if (ref && offered.has(ref)) told?.(ref);
  });
  // (what is offered takes a touch, the rest does not)
  const can = () => {
    for (const n of root.querySelectorAll('[data-ref]')) {
      const on = offered.has(n.dataset.ref);
      n.classList.toggle('can', on);
      if (n.tagName === 'BUTTON') n.tabIndex = on ? 0 : -1;
    }
  };

  function build() {
    root.replaceChildren();
    stands.length = 0;
    offsets.clear();
    root.style.setProperty('--h', `${b.frame().h}px`);
    chapters.forEach((c, i) => stand(`c${i}`, chapter(c, i), i));
    if (author) stand('author', sign());
    can();
    // (laid out: where each element a mark may stand on is, at the point's size 1 — the rows as they end up, not as
    // they come in)
    root.classList.add('still');
    for (const s of stands) {
      s.box.hidden = false;
      s.box.style.transform = 'none';
      const o = s.box.getBoundingClientRect();
      for (const [ref, node] of s.nodes) {
        const r = node.getBoundingClientRect();
        s.offsets.set(ref, [r.left + r.width / 2 - o.left, r.top + r.height / 2 - o.top]);
        offsets.set(ref, s);
      }
    }
    root.classList.remove('still');
    place(true);
  }
  // a stand: an element at a point of the scene, its content laid out round it — the point its origin
  function stand(ref, { node, nodes }, i = null) {
    const box = el('div', 'stand');
    box.append(node);
    root.append(box);
    stands.push({ ref, box, node, nodes, offsets: new Map(), i, now: '' });
  }

  // a chapter's tree, a 0×0 box on its knot: its head over it, its rows under it (one to come: its number only)
  function chapter(c, i) {
    const tree = el('section', ['tree', c.kind, c.kind === 'here' && 'current', i === shown && 'shown', i === grow && 'fresh'].filter(Boolean).join(' '));
    const nodes = new Map(), head = el('header', 'head');
    head.append(el('div', 'num', c.number || ''));
    tree.append(head);
    if (c.kind === 'future') return { node: tree, nodes };
    head.append(el('div', 'title', c.title));
    tree.setAttribute('aria-label', `${c.number ? `Глава ${c.number}. ` : ''}${c.title}`);
    head.dataset.ref = `knot:${i}`;
    if (c.badge) {
      const plate = el('div', 'badge');
      plate.append(el('i'), 'Переигровка');
      tree.append(plate);
    }
    const knot = el('div', 'knot');
    knot.append(el('i', 'halo'), el('i', 'core'), hit(`knot:${i}`, c.title));
    tree.append(el('i', 'lead'), knot);
    nodes.set(`knot:${i}`, knot);

    const rows = c.map || [];
    if (rows.length > 6) tree.classList.add('dense');
    // where the pointers stand: after the last fork the main run reached, after the last the replay played
    const goAt = c.go ? last(rows, main) + 1 : -1, cursorAt = c.cursor ? last(rows, tried) + 1 : -1;
    // the replay's thread: from its first fork to its last (and on to its pointer)
    const r0 = c.badge ? rows.findIndex(tried) : -1, r1 = c.badge ? last(rows, tried) : -1;
    const list = el('ol', 'rows'), items = [];
    for (let k = 0; k <= rows.length; k++) {
      if (k === cursorAt) items.push(pointer('cursor', i, 'продолжить переигровку', nodes));
      if (k === goAt) items.push(pointer('go', i, c.go, nodes));
      if (k < rows.length) items.push(fork(rows[k], i, k, { r: r0 >= 0 && k >= r0 && k <= r1, start: k === r0, end: k === r1 && !c.cursor }, nodes));
    }
    // (the trunk dashed on past where the main run is: not reached yet)
    const pending = items.findIndex(li => li.classList.contains('pending'));
    items.forEach((li, n) => {
      if (pending >= 0 && n > pending) li.classList.add('ahead');
      li.style.setProperty('--i', n);
    });
    tree.style.setProperty('--row', `${Math.min(ROW, seconds / Math.max(1, items.length))}s`);
    list.append(...items);
    tree.append(list);
    return { node: tree, nodes };
  }
  // a fork: its question | the trunk, its dot | the answers — the main run's first, the others under it on twigs
  function fork(row, i, k, replay, nodes) {
    const ref = `fork:${i}:${k}`, reached = main(row);
    const li = el('li', ['row', row.weight === '⚑' && 'key', !reached && 'off', replay.r && 'r', replay.start && 'r-start', replay.end && 'r-end'].filter(Boolean).join(' '));
    const name = el('div', 'name');
    if (row.weight === '⚑') name.append(el('span', 'flag', '⚑ '));
    name.append(row.title);
    const stem = el('div', 'stem'), dot = el('i', 'dot');
    stem.append(el('i', 'seg'));
    if (replay.r) stem.append(el('i', 'rseg'));
    stem.append(dot);
    if (reached) { stem.append(hit(ref, row.title)); nodes.set(ref, dot); }
    const opts = el('ul', 'opts');
    if (row.options.every(o => o.state === 'unseen')) opts.append(el('li', 'opt unseen', '· · ·'));
    else {
      const first = o => o.state === 'chosen' || o.state === 'both';
      for (const o of [...row.options.filter(first), ...row.options.filter(o => !first(o))]) {
        const opt = el('li', first(o) ? 'opt chosen' : o.state === 'tried' ? 'opt alt tried' : 'opt alt');
        if (first(o)) opt.dataset.ref = ref;
        else opt.append(twig(), el('i', 'pip'));
        opt.append(o.label);
        opts.append(opt);
      }
    }
    li.append(name, stem, opts);
    return li;
  }
  // where the play is: the main run's (go — gold, the trunk dashed to it) or a replay's (cursor — pale blue, its
  // thread), its words with their arrow toward the trunk; pressed (the words or the tip) — its mark there, on the tip
  function pointer(kind, i, words, nodes) {
    const ref = `${kind}:${i}`, go = kind === 'go';
    const li = el('li', go ? 'row pending' : 'row cursor r'), name = el('div', 'name'), stem = el('div', 'stem');
    const button = el('button', `go ${go ? 'go-game' : 'go-replay'}`), said = el('span');
    const [a, ...rest] = words.split(' ');
    said.append(a, ...(rest.length ? [el('br'), rest.join(' ')] : []));
    button.type = 'button';
    button.dataset.ref = ref;
    button.append(said, arrow());
    name.append(button);
    const end = tip(go ? 'tip' : 'tip r');
    stem.append(el('i', 'seg'), ...(go ? [] : [el('i', 'rseg')]), el('i', 'dot'), end);
    nodes.set(ref, end);
    li.append(name, stem, el('ul', 'opts'));
    return li;
  }

  // the author's sign: a ring of twelve stars, «автор» under it
  function sign() {
    const node = el('div', 'author'), ring = el('div', 'ring');
    for (let k = 0; k < 12; k++) {
      const a = (k / 12) * Math.PI * 2, d = k % 3 === 0 ? 4 : 2.5, r = 22, star = el('i');
      star.style.left = `calc(var(--u) * ${(Math.cos(a) * r - d / 2).toFixed(1)})`;
      star.style.top = `calc(var(--u) * ${(Math.sin(a) * r - d / 2).toFixed(1)})`;
      star.style.width = star.style.height = `calc(var(--u) * ${d})`;
      star.style.opacity = k % 3 === 0 ? 1 : 0.6;
      ring.append(star);
    }
    node.append(ring, el('span', '', 'автор'), hit('author', 'Карта автора'));
    return { node, nodes: new Map([['author', ring]]) };
  }

  // each frame the scene says: every stand at its point, as large as its depth makes it
  const scale = p => DIST / Math.max(0.5, p.depth);
  function place(again = false) {
    for (const s of stands) {
      const p = b.where(s.ref);
      const now = p ? `translate(${Math.round(p.x)}px, ${Math.round(p.y)}px) scale(${scale(p).toFixed(4)})` : 'hidden';
      if (now === s.now && !again) continue;
      s.now = now;
      s.box.hidden = !p;
      if (p) s.box.style.transform = now;
    }
  }
  const off = b.onFrame(() => place());
  const resized = () => build();
  addEventListener('resize', resized);
  build();

  return {
    at: ref => () => {
      const s = offsets.get(ref), o = s?.offsets.get(ref), p = s && b.where(s.ref);
      if (!p) return null;
      const k = scale(p);
      return { x: p.x + o[0] * k, y: p.y + o[1] * k };
    },
    offer(refs, fn) { offered = new Set(refs); told = fn; can(); },
    shown(i) { for (const s of stands) if (s.i != null) s.node.classList.toggle('shown', s.i === i); },
    remove() { off(); removeEventListener('resize', resized); root.remove(); },
  };
}
