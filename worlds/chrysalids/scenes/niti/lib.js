// «Нити»: the play's chapters, a tree each, standing side by side across the night sky; the sky comes to the chapter
// `shown` (script.js: camera_x — chapter i at i·SPACING m: the one shown and both its neighbours within the language's
// window).
// A tree: the chapter's knot at the top, its choices row by row below it, the threads going down through what was
// chosen (the main run's — bright; a replay's — pale). Each tree (t0…t7) and knot (k0…k7) is an element standing in the
// world, painted once (from `chapters` — set as the scene opens); what moves — the rows coming as `reveal` grows, the
// shown knot brighter (`shown`, `knot`) — is their animate's; the sky going to the chapter shown is the script's. Drawn in "frame units": the frame's
// height 1, as the tree fills it from where the viewer stands (U metres).
const U = 10; // metres a frame unit is, at the trees' distance (10 m: the horizon low, the ground at the frame's foot)
const KY = 0.2; // the knot's height, from the top
const D = 0.5; // how far apart the chapters are (5 m), frame units
const SPACING = D * U;
// e's painting in frame units: x across from the element's anchor, y from the frame's top (an element of height U
// standing on the ground) — or, for a knot, from its middle
const frame = (g, top) => { g.translate(0, -top * U); g.scale(U, U); };
const glow = (e, x, y, top, r, color, a, name) => e.light(x * U, (y - top) * U, r * U, color, a, name);
const text = (g, s, x, y, size, color, alpha, italic) => {
  g.save();
  g.translate(x, y);
  g.scale(0.001, 0.001);
  g.font = (italic ? 'italic ' : '') + Math.round(size * 1000) + 'px Georgia, "Times New Roman", serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.globalAlpha = alpha;
  g.fillStyle = color;
  g.fillText(s, 0, 0);
  g.restore();
  g.globalAlpha = 1;
};
// the rows of a chapter's choices, from under the knot to the frame's foot: where row k's points are, and how small it is
// drawn. A row is one group — its name just over its points, their words just under — and the rows stand apart from
// one another more than that, so a name is read with its own row
const rows = map => {
  const n = map.length, gap = n > 1 ? Math.min(0.12, 0.6 / (n - 1)) : 0.2;
  return { y: k => 0.35 + k * gap, fs: Math.max(0.75, Math.min(1, gap / 0.12)) };
};
const optX = (cxk, j, m) => cxk + (j - (m - 1) / 2) * Math.min(0.15, (D * 0.66) / Math.max(1, m));
// where a chapter's main thread ends (the next chapter's thread starts there): its last chosen point, else its knot
const end = (c, cxk) => {
  const map = Array.isArray(c.map) ? c.map : [];
  const R = rows(map);
  for (let k = map.length - 1; k >= 0; k--) {
    const opts = map[k].options || [], j = opts.findIndex(o => o.state === 'chosen' || o.state === 'both');
    if (j >= 0) return { x: optX(cxk, j, opts.length), y: R.y(k) };
  }
  return { x: cxk, y: KY };
};
// one thread into an option: from a point above to the option's point (main — bright with a glow round it; tried — pale
// blue, dashed; other — faint; a ghost — dotted)
const strand = (g, from, ox, y, k, j, kind, ghost, alpha) => {
  const w = (kind === 'tried' ? -1 : 1) * 0.008 * Math.sin(k * 1.7 + j);
  const c1x = from.x + w, c1y = from.y + (y - from.y) * 0.45, c2x = ox - w, c2y = y - (y - from.y) * 0.4;
  g.save();
  if (ghost) g.setLineDash([0.006, 0.01]);
  g.lineCap = 'round';
  g.beginPath();
  g.moveTo(from.x, from.y);
  g.bezierCurveTo(c1x, c1y, c2x, c2y, ox, y);
  g.globalAlpha = alpha;
  if (kind === 'main') {
    g.strokeStyle = 'rgba(255, 196, 120, 0.25)';
    g.lineWidth = 0.006;
    g.stroke();
    g.strokeStyle = 'rgba(255, 214, 150, 0.95)';
    g.lineWidth = 0.0022;
  } else if (kind === 'tried') {
    g.strokeStyle = 'rgba(190, 215, 255, 0.75)';
    g.lineWidth = 0.0024;
    g.setLineDash([0.012, 0.006]);
  } else {
    g.strokeStyle = ghost ? 'rgba(130, 135, 170, 0.22)' : 'rgba(170, 180, 220, 0.38)';
    g.lineWidth = ghost ? 0.0016 : 0.0018;
  }
  g.stroke();
  g.restore();
};
// a chapter's tree at cxk: its number and title over the knot, and — but for one not reached yet — its rows, each a
// layer `r<k>` (treeAnim shows them as `reveal` grows). c: { number, title, kind: here | played | next | future | end,
// map: [{ title, weight, options: [{ label, state: chosen | tried | both | open | unseen }] }] }
const draw = (g, e, c, cxk, alpha) => {
  const future = c.kind === 'future';
  text(g, String(c.number || ''), cxk, 0.075, 0.03, '#d9c9a3', 0.7 * alpha * (future ? 0.5 : 1), false);
  text(g, String(c.title || ''), cxk, 0.125, 0.04, '#efe6d2', 0.92 * alpha * (future ? 0.4 : 1), true);
  const map = Array.isArray(c.map) && !future ? c.map : null;
  if (!map) return;
  const R = rows(map), n = map.length;
  let fromC = { x: cxk, y: KY }, fromT = fromC;
  for (let k = 0; k < n; k++) {
    const row = map[k], opts = row.options || [], m = opts.length, y = R.y(k);
    const pts = opts.map((o, j) => ({ o, ox: optX(cxk, j, m), main: o.state === 'chosen' || o.state === 'both', tried: o.state === 'tried' || o.state === 'both', ghost: o.state === 'unseen' }));
    const FC = fromC, FT = fromT;
    e.layer('r' + k, {}, q => {
      q.save();
      q.translate(0, -U);
      q.scale(U, U);
      pts.forEach(({ o, ox, main, tried, ghost }, j) => {
        if (tried) strand(q, FT, ox, y, k, j, 'tried', ghost, alpha);
        strand(q, FC, ox, y, k, j, main ? 'main' : 'other', ghost, alpha);
        q.globalAlpha = alpha;
        q.beginPath();
        q.arc(ox, y, main ? 0.009 : tried ? 0.008 : 0.006, 0, 6.283);
        q.fillStyle = main ? '#ffd9a0' : tried ? '#cfe0ff' : ghost ? 'rgba(120, 125, 160, 0.3)' : 'rgba(190, 198, 235, 0.6)';
        q.fill();
        q.globalAlpha = 1;
        if (main && alpha > 0.6) glow(e, ox, y, 1, 0.05, '#ffc68a', 0.8 * alpha);
        text(q, ghost ? '· · ·' : o.label || '', ox, y + 0.024 * R.fs, 0.018 * R.fs, main ? '#f3dfbd' : tried ? '#d6e3ff' : '#aab0cc', (main || tried ? 0.95 : ghost ? 0.3 : 0.55) * alpha, !main);
      });
      text(q, (row.weight === '⚑' ? '⚑ ' : '') + (row.title || ''), cxk, y - 0.032 * R.fs, 0.019 * R.fs, '#cfc6b4', 0.7 * alpha, true);
      q.restore();
    });
    let nextC = fromC, nextT = null;
    for (const p of pts) { if (p.main) nextC = { x: p.ox, y }; if (p.tried) nextT = { x: p.ox, y }; }
    fromT = nextT || nextC;
    fromC = nextC;
  }
};
// the element t<i>: chapter i's tree — and, but for one not reached yet, the thread from its end on to the next one's
// knot (one story, left to right)
const tree = (g, e, i) => {
  const st = e.state || {}, chapters = Array.isArray(st.chapters) ? st.chapters : null;
  if (!chapters) {
    if (i === 0) { g.save(); frame(g, 1); text(g, 'Нити', 0, 0.45, 0.07, '#efe6d2', 0.92, true); g.restore(); }
    return;
  }
  const c = chapters[i], next = chapters[i + 1];
  if (!c) return;
  g.save();
  frame(g, 1);
  if (next && c.kind !== 'future' && next.kind !== 'future') {
    const a = end(c, 0);
    g.save();
    g.beginPath();
    g.moveTo(a.x, a.y);
    g.bezierCurveTo(a.x + D * 0.35, a.y + 0.06, D * 0.65, 0.12, D, KY);
    g.strokeStyle = 'rgba(255, 214, 150, 0.28)';
    g.lineWidth = 0.002;
    g.setLineDash([0.006, 0.008]);
    g.stroke();
    g.restore();
  }
  draw(g, e, c, 0, 1);
  g.restore();
};
// its animate: the shown chapter's rows come one after another as `reveal` grows; the others' are all there
const treeAnim = (e, i) => {
  const st = e.state || {}, c = Array.isArray(st.chapters) ? st.chapters[i] : null;
  const map = c && c.kind !== 'future' && Array.isArray(c.map) ? c.map : [];
  const rev = i === st.shown ? Math.max(0, Math.min(1, st.reveal == null ? 1 : +st.reveal)) : 1;
  for (let k = 0; k < map.length; k++) e.layer('r' + k).alpha = Math.max(0, Math.min(1, rev * map.length - k));
};
// the element k<i>: chapter i's knot, at the top of its tree (its point `knot`) — a chapter not reached yet has none:
// its halo layer, its bright middle, its glow (knotAnim: the shown one bright, the others dimmer) — the language's mark
// stands on it: no rings of its own
const knot = (g, e, i) => {
  const st = e.state || {}, chapters = Array.isArray(st.chapters) ? st.chapters : null;
  if (!chapters ? i !== 0 : !chapters[i] || chapters[i].kind === 'future') return;
  e.at(0, -0.08 * U, 'knot');
  e.at(0, -0.08 * U);
  e.layer('halo', {}, q => {
    q.save(); frame(q, 0.08);
    const halo = q.createRadialGradient(0, 0, 0, 0, 0, 0.07);
    halo.addColorStop(0, 'rgba(255, 210, 150, 0.45)');
    halo.addColorStop(1, 'rgba(255, 210, 150, 0)');
    q.fillStyle = halo; q.beginPath(); q.arc(0, 0, 0.07, 0, 6.283); q.fill();
    q.restore();
  });
  g.save(); frame(g, 0.08);
  g.beginPath(); g.arc(0, 0, 0.005, 0, 6.283); g.fillStyle = 'rgba(255, 240, 215, 1)'; g.fill();
  g.restore();
  glow(e, 0, 0, 0.08, 0.04, '#ffcf96', 0.6, 'k');
};
const knotAnim = (e, i) => {
  const st = e.state || {}, chapters = Array.isArray(st.chapters) ? st.chapters : null;
  if (!chapters ? i !== 0 : !chapters[i] || chapters[i].kind === 'future') return;
  const b = (st.knot == null ? 1 : +st.knot) * (i === st.shown ? 1 : 0.6), p = 0.8 + 0.2 * Math.sin(e.t * 1.3 + i);
  e.layer('halo').alpha = b * p;
  e.glow('k', b);
};
return { U, D, SPACING, tree, treeAnim, knot, knotAnim };
