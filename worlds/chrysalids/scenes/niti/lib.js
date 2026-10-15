// «Нити»: the play's chapters, a tree each, standing side by side along a panorama of the night sky — the viewer
// passes along them (the camera's own: a drag, a swipe; the game opens it at a chapter with camera_x). A tree: the
// chapter's knot at the top, its choices row by row below it, the threads going down through what was chosen (the main
// run's — bright; a replay's — pale). Each tree (t0…t7) and knot (k0…k7) is an element standing in the world, painted
// once: drawn in "frame units" — the frame's height 1, as the tree fills it from where the viewer stands (U metres).
const U = 10; // metres a frame unit is, at the trees' distance (10 m: the horizon low, the ground at the frame's foot)
const KY = 0.2; // the knot's height, from the top
const D = 0.7; // how far apart the chapters are (7 m), frame units
// e's painting in frame units: x across from the element's anchor, y from the frame's top (an element of height U
// standing on the ground) — or, for a knot, from its middle
const frame = (g, top) => { g.translate(0, -top * U); g.scale(U, U); };
const glow = (e, x, y, top, r, color, a) => e.light(x * U, (y - top) * U, r * U, color, a);
const text = (g, s, x, y, size, color, alpha, italic) => {
  g.save();
  g.translate(x, y);
  g.scale(0.001, 0.001);
  g.font = (italic ? "italic " : "") + Math.round(size * 1000) + 'px Georgia, "Times New Roman", serif';
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.globalAlpha = alpha;
  g.fillStyle = color;
  g.shadowColor = "rgba(4, 5, 11, 0.95)";
  g.shadowBlur = 14;
  g.fillText(s, 0, 0);
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
const optX = (cxk, j, m) => cxk + (j - (m - 1) / 2) * Math.min(0.2, (D * 0.66) / Math.max(1, m));
// where a chapter's main thread ends (the next chapter's thread starts there): its last chosen point, else its knot
const end = (c, cxk) => {
  const map = Array.isArray(c.map) ? c.map : [];
  const R = rows(map);
  for (let k = map.length - 1; k >= 0; k--) {
    const opts = map[k].options || [], j = opts.findIndex(o => o.state === "chosen" || o.state === "both");
    if (j >= 0) return { x: optX(cxk, j, opts.length), y: R.y(k) };
  }
  return { x: cxk, y: KY };
};
// a chapter's tree at cxk (still: it doesn't move with the time): its number and title over the knot, and — but for one not reached yet — its threads, grown as
// far as reveal says. c: { number, title, kind: here | played | next | future | end, map: [{ title, weight, options:
// [{ label, state: chosen | tried | both | open | unseen }] }] }
const draw = (g, e, c, cxk, alpha, reveal) => {
  const future = c.kind === "future";
  text(g, String(c.number || ""), cxk, 0.075, 0.03, "#d9c9a3", 0.7 * alpha * (future ? 0.5 : 1), false);
  text(g, String(c.title || ""), cxk, 0.125, 0.04, "#efe6d2", 0.92 * alpha * (future ? 0.4 : 1), true);
  const map = Array.isArray(c.map) && !future ? c.map : null;
  if (!map) return;
  const R = rows(map), n = map.length, rev = Math.max(0, Math.min(1, reveal == null ? 1 : reveal));
  let fromC = { x: cxk, y: KY }, fromT = fromC;
  for (let k = 0; k < n; k++) {
    const row = map[k], opts = row.options || [], m = opts.length, y = R.y(k);
    const grow = Math.max(0, Math.min(1, rev * n - k));
    if (grow <= 0) break;
    let nextC = fromC, nextT = null;
    for (let j = 0; j < m; j++) {
      const o = opts[j], ox = optX(cxk, j, m), st = o.state;
      const main = st === "chosen" || st === "both", tried = st === "tried" || st === "both", ghost = st === "unseen";
      // the threads into this option: the main run's from its point above; a replay's (pale) from its own
      const draw = (from, kind) => {
        const w = (kind === "tried" ? -1 : 1) * 0.008 * Math.sin(k * 1.7 + j);
        const c1x = from.x + w, c1y = from.y + (y - from.y) * 0.45, c2x = ox - w, c2y = y - (y - from.y) * 0.4;
        g.save();
        if (ghost) g.setLineDash([0.006, 0.01]);
        g.lineCap = "round";
        const steps = 40, upto = Math.floor(steps * grow);
        g.beginPath();
        for (let q = 0; q <= upto; q++) {
          const u = q / steps, a = 1 - u;
          const px = a * a * a * from.x + 3 * a * a * u * c1x + 3 * a * u * u * c2x + u * u * u * ox;
          const py = a * a * a * from.y + 3 * a * a * u * c1y + 3 * a * u * u * c2y + u * u * u * y;
          if (q === 0) g.moveTo(px, py); else g.lineTo(px, py);
        }
        g.globalAlpha = alpha;
        if (kind === "main") {
          g.strokeStyle = "rgba(255, 196, 120, 0.25)";
          g.lineWidth = 0.006;
          g.stroke();
          g.strokeStyle = "rgba(255, 214, 150, 0.95)";
          g.lineWidth = 0.0022;
        } else if (kind === "tried") {
          g.strokeStyle = "rgba(190, 215, 255, 0.75)";
          g.lineWidth = 0.0024;
          g.setLineDash([0.012, 0.006]);
        } else {
          g.strokeStyle = ghost ? "rgba(130, 135, 170, 0.22)" : "rgba(170, 180, 220, 0.38)";
          g.lineWidth = ghost ? 0.0016 : 0.0018;
        }
        g.stroke();
        g.restore();
      };
      if (tried) draw(fromT, "tried");
      draw(fromC, main ? "main" : "other");
      if (grow >= 1) {
        g.globalAlpha = alpha;
        g.beginPath();
        g.arc(ox, y, main ? 0.009 : tried ? 0.008 : 0.006, 0, 6.283);
        g.fillStyle = main ? "#ffd9a0" : tried ? "#cfe0ff" : ghost ? "rgba(120, 125, 160, 0.3)" : "rgba(190, 198, 235, 0.6)";
        g.fill();
        g.globalAlpha = 1;
        if (main && alpha > 0.6) glow(e, ox, y, 1, 0.05, "#ffc68a", 0.8 * alpha);
        text(g, ghost ? "· · ·" : o.label || "", ox, y + 0.024 * R.fs, 0.018 * R.fs,
          main ? "#f3dfbd" : tried ? "#d6e3ff" : "#aab0cc", (main || tried ? 0.95 : ghost ? 0.3 : 0.55) * alpha, !main);
      }
      if (main) nextC = { x: ox, y };
      if (tried) nextT = { x: ox, y };
    }
    // the row's name to the left of the tree, at its height: the steps seen, out of the tree's way
    text(g, (row.weight === "⚑" ? "⚑ " : "") + (row.title || ""), cxk, y - 0.032 * R.fs, 0.019 * R.fs, "#cfc6b4", 0.7 * grow * alpha, true);
    fromT = nextT || nextC;
    fromC = nextC;
  }
};
// the element t<i>: chapter i's tree — and, but for one not reached yet, the thread from its end on to the next one's knot
// (one story, left to right); the shown one's threads grown as far as reveal says
const tree = (g, e, i) => {
  const st = e.state || {}, chapters = Array.isArray(st.chapters) ? st.chapters : null;
  frame(g, 1);
  if (!chapters) {
    if (i === 0) text(g, "Нити", 0, 0.45, 0.07, "#efe6d2", 0.92, true);
    return;
  }
  const c = chapters[i], next = chapters[i + 1];
  if (!c) return;
  if (next && c.kind !== "future" && next.kind !== "future") {
    const a = end(c, 0);
    g.save();
    g.beginPath();
    g.moveTo(a.x, a.y);
    g.bezierCurveTo(a.x + D * 0.35, a.y + 0.06, D * 0.65, 0.12, D, KY);
    g.strokeStyle = "rgba(255, 214, 150, 0.28)";
    g.lineWidth = 0.002;
    g.setLineDash([0.006, 0.008]);
    g.stroke();
    g.restore();
  }
  draw(g, e, c, 0, 1, i === st.shown ? st.reveal : 1);
};
// the element k<i>: chapter i's knot, at the top of its tree — the one shown (st.shown) bright; a chapter not reached
// yet has none
const knot = (g, e, i) => {
  const st = e.state || {}, t = e.t, chapters = Array.isArray(st.chapters) ? st.chapters : null;
  if (!chapters ? i !== 0 : !chapters[i] || chapters[i].kind === "future") return;
  frame(g, 0.08);
  const x = 0, y = 0,
    b = (st.knot == null ? 1 : st.knot) * (i === st.shown ? 1 : 0.6),
    p = 0.8 + 0.2 * Math.sin(t * 1.3 + i);
  const halo = g.createRadialGradient(x, y, 0, x, y, 0.07);
  halo.addColorStop(0, "rgba(255, 210, 150, " + 0.45 * b * p + ")");
  halo.addColorStop(1, "rgba(255, 210, 150, 0)");
  g.fillStyle = halo;
  g.beginPath();
  g.arc(x, y, 0.07, 0, 6.283);
  g.fill();
  g.strokeStyle = "rgba(255, 224, 180, " + (0.4 + 0.5 * b) + ")";
  g.lineWidth = 0.0025;
  for (let j = 0; j < 3; j++) {
    g.beginPath();
    g.ellipse(x, y, 0.016, 0.007, t * 0.4 + j * 1.047, 0, 6.283);
    g.stroke();
  }
  g.beginPath();
  g.arc(x, y, 0.005, 0, 6.283);
  g.fillStyle = "rgba(255, 240, 215, " + (0.6 + 0.4 * b) + ")";
  g.fill();
  glow(e, x, y, 0.08, 0.04, "#ffcf96", 0.6 * b);
};
return { tree, knot };
