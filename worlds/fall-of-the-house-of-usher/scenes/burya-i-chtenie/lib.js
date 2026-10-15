// Буря и чтение — the narrator's room: what its elements paint and move, and its film in beats (film(scene), at the
// end). World metres: across (0 the door's axis), distance ahead of the eye, the back wall at 6.5, the window's axis at
// WX. A lit scene: everything is painted once in its own colours (stone, wood, cloth) and the scene's lights — the
// candle, the lamp in the corridor and its light under the door, Roderick's lamp, the mist through the window, the
// lightning, the red rift — light it, rim the people and cast the shadows.
const { clamp, hash, noise } = anim;
const N = (v) => (v === true ? 1 : v === false ? 0 : clamp(+v || 0, 0, 1));
const sm = (a, b, x) => { const u = clamp((x - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };

// ── where things are ──
const WX = 3.25, // the window's axis
  DH = 0.58, // the door's half-width
  DT = -2.56, // the door's top (y up negative, metres from the floor)
  GAP = 0.06; // the gap under the door's leaf
const CANDLE = [-0.88, 3.6]; // the candle on the table (its flame ~1 m up)
const SPOT = [1.75, 5.15]; // where the sound from below comes up through the floor
const LAMP_DOWN = [1.15, 4.5]; // Roderick's lamp put down on the floor by his chair (where his hand sets it — lamp_put)
const PUT_AT = [1.3, 4.78]; // where he stands to put it down, facing right
// the door's leaf turns about its hinge on the right (the door_turn key, degrees): shut 180, wide open into the room
// 88; the casements' about their outer sides (case_l 180 → 282, case_r 180 → 78: into the room)
const DOOR = { shut: 180, open: 88 },
  CASE = { l: [180, 282], r: [180, 78] };

// a pointed arch from yb up to its springing ys and its apex ya (y down: all negative), its axis cx, half-width hw
function arch(p, cx, hw, yb, ys, ya) {
  const H = ys - ya;
  p.moveTo(cx - hw, yb);
  p.lineTo(cx - hw, ys);
  p.bezierCurveTo(cx - hw, ys - 0.55 * H, cx - 0.45 * hw, ya + 0.2 * H, cx, ya);
  p.bezierCurveTo(cx + 0.45 * hw, ya + 0.2 * H, cx + hw, ys - 0.55 * H, cx + hw, ys);
  p.lineTo(cx + hw, yb);
  p.closePath();
}

// ── the crack in the back wall: from the vault to the window (wall's metres). The same line for the wall (the dark
// fissure, as long as `crack` says) and for its glows (fissure: the mist seeping through it, the red moon in it) ──
const BASE = [[-3.05, -5.2], [-2.8, -4.35], [-2.25, -4.45], [-1.95, -3.9], [-1.25, -4.0], [-0.98, -3.45], [-0.3, -3.55],
  [-0.02, -3.12], [0.75, -3.22], [1.02, -2.82], [1.72, -2.92], [1.98, -2.5], [2.43, -2.58]];
const CRACK = (() => {
  const Q = [];
  for (let i = 0; i < BASE.length - 1; i++) {
    const a = BASE[i], b = BASE[i + 1], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy), nx = -dy / l, ny = dx / l;
    for (let k = 0; k < 4; k++) {
      const u = k / 4, j = k ? (hash(i * 4 + k, 3) - 0.5) * 0.07 : 0;
      Q.push([a[0] + dx * u + nx * j, a[1] + dy * u + ny * j]);
    }
  }
  Q.push(BASE[BASE.length - 1]);
  const cl = [0];
  for (let i = 1; i < Q.length; i++) cl.push(cl[i - 1] + Math.hypot(Q[i][0] - Q[i - 1][0], Q[i][1] - Q[i - 1][1]));
  // its branches: from points along it, a few short zigzags
  const brs = [];
  for (let k = 0; k < 4; k++) {
    const i = Math.floor(5 + hash(k, 11) * (Q.length - 10)), ang = (hash(k, 12) < 0.5 ? -1 : 1) * (0.6 + hash(k, 13) * 0.6);
    let p = Q[i], dir = Math.atan2(Q[i + 1][1] - Q[i][1], Q[i + 1][0] - Q[i][0]) + ang;
    const pts = [p];
    for (let m = 0; m < 5; m++) { dir += (hash(k * 7 + m, 14) - 0.5) * 0.9; p = [p[0] + Math.cos(dir) * 0.09, p[1] + Math.sin(dir) * 0.09]; pts.push(p); }
    brs.push([cl[i], pts]);
  }
  return { Q, cl, L: cl[cl.length - 1], brs };
})();
// the crack's line as long as k (0…1) of it
function crackLine(k) {
  const { Q, cl, L } = CRACK, vis = L * k, out = [];
  for (let i = 0; i < Q.length; i++) {
    if (cl[i] <= vis) out.push(Q[i]);
    else { const f = (vis - cl[i - 1]) / (cl[i] - cl[i - 1]); out.push([Q[i - 1][0] + (Q[i][0] - Q[i - 1][0]) * f, Q[i - 1][1] + (Q[i][1] - Q[i - 1][1]) * f]); break; }
  }
  return { pts: out, vis };
}
// a strip along points, as wide as wf(u) there
function strip(pts, wf) {
  const A = [], B = [], n = pts.length;
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
    let dx = b[0] - a[0], dy = b[1] - a[1];
    const l = Math.hypot(dx, dy) || 1, w = wf(i / Math.max(1, n - 1)) / 2;
    dx /= l; dy /= l;
    A.push([pts[i][0] - dy * w, pts[i][1] + dx * w]);
    B.unshift([pts[i][0] + dy * w, pts[i][1] - dx * w]);
  }
  const p = new Path2D(), all = A.concat(B);
  p.moveTo(all[0][0], all[0][1]);
  for (const q of all) p.lineTo(q[0], q[1]);
  p.closePath();
  return p;
}
const polyline = (g, pts) => { g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (const q of pts) g.lineTo(q[0], q[1]); };
// how far the crack runs (k of its length) and how wide, at `crack` (the rift is the fissure's)
const crackOf = (CR) => ({ k: 0.45 + 0.55 * CR, w: 0.026 + 0.05 * CR, branches: clamp((CR - 0.35) / 0.65, 0, 1) });

// ── the back wall: stone, the lancet window's deep reveal and the door's surround, both cut through (what is beyond
// shows: the sky, the corridor; the casements and the door's leaf are their own), and the crack ──
function wall(g, e) {
  const CR = N(e.state.crack);
  const W = new Path2D();
  W.rect(-8, -6.6, 16, 6.7);
  arch(W, WX, 0.6, -0.95, -3.35, -4.3);
  arch(W, 0, DH, 0.001, -1.86, DT);
  g.save();
  g.clip(W, 'evenodd');
  g.fillStyle = '#58616a';
  g.fillRect(-8, -6.6, 16, 6.7);
  // the courses of stone, each block a little its own (the first of a course cut short at the wall's end)
  const rect = (x0, y0, x1, y1) => { const a = Math.max(x0, -8), b = Math.min(x1, 8), c = Math.max(y0, -6.6), d = Math.min(y1, 0.1); if (b > a && d > c) g.fillRect(a, c, b - a, d - c); };
  for (let r = 0; r < 16; r++) {
    const y0 = -0.32 - (r + 1) * 0.42;
    let x = -8 - e.rnd() * 0.9;
    while (x < 8) {
      const w = 0.6 + e.rnd() * 0.75, k = e.rnd(), a = e.rnd();
      g.fillStyle = k < 0.5 ? `rgba(20,24,28,${0.1 + 0.14 * a})` : `rgba(150,160,166,${0.05 + 0.08 * a})`;
      rect(x, y0, x + w, y0 + 0.42);
      g.fillStyle = 'rgba(22,26,30,0.45)';
      rect(x, y0, x + 0.016, y0 + 0.42);
      x += w;
    }
    g.fillStyle = 'rgba(22,26,30,0.45)';
    rect(-8, y0, 8, y0 + 0.016);
  }
  // stains of damp, darker patches; the damp running down from the sill
  for (let i = 0; i < 14; i++) {
    const x = -7 + e.rnd() * 14, y = -0.5 - e.rnd() * 5, r = 0.4 + e.rnd() * 1.2, a = 0.12 + 0.12 * e.rnd();
    const rg = g.createRadialGradient(x, y, 0, x, y, r);
    rg.addColorStop(0, `rgba(24,32,34,${a})`);
    rg.addColorStop(1, 'rgba(24,32,34,0)');
    g.fillStyle = rg;
    rect(x - r, y - r, x + r, y + r);
  }
  for (let i = 0; i < 9; i++) {
    const x = WX - 0.7 + e.rnd() * 1.4, h = 0.3 + e.rnd() * 0.5, w = 0.03 + e.rnd() * 0.05;
    const gr = g.createLinearGradient(0, -0.85, 0, -0.85 + h);
    gr.addColorStop(0, 'rgba(26,34,36,0.45)');
    gr.addColorStop(1, 'rgba(26,34,36,0)');
    g.fillStyle = gr;
    g.fillRect(x, -0.85, w, h);
  }
  // the grime along the floor
  let gr = g.createLinearGradient(0, -0.45, 0, 0);
  gr.addColorStop(0, 'rgba(24,28,32,0)');
  gr.addColorStop(1, 'rgba(24,28,32,0.5)');
  g.fillStyle = gr;
  g.fillRect(-8, -0.45, 16, 0.46);
  // the window's deep reveal (its splayed sides, the far one catching the mist: the light does that) and its sill
  const O = new Path2D();
  arch(O, WX, 0.82, -0.85, -3.35, -4.62);
  gr = g.createLinearGradient(WX - 0.82, 0, WX + 0.82, 0);
  gr.addColorStop(0, '#3b4448');
  gr.addColorStop(0.55, '#4c565a');
  gr.addColorStop(1, '#5e696c');
  g.fillStyle = gr;
  g.fill(O);
  g.fillStyle = '#6a7477';
  g.fillRect(WX - 0.8, -0.96, 1.6, 0.11);
  // the door's stone surround, its step
  const S1 = new Path2D();
  arch(S1, 0, 0.8, 0, -1.9, -2.88);
  g.fillStyle = '#626b73';
  g.fill(S1);
  const S2 = new Path2D();
  arch(S2, 0, 0.68, 0, -1.88, -2.7);
  g.fillStyle = '#4e575e';
  g.fill(S2);
  g.fillStyle = '#727b82';
  g.fillRect(-0.86, -0.05, 1.72, 0.05);
  // the crack: as long as `crack` says, its branches past 0.35
  const C = crackOf(CR), { pts, vis } = crackLine(C.k);
  const main = strip(pts, (u) => C.w * (1 - 0.8 * u) * (0.7 + 0.3 * Math.sin(u * 31)));
  g.save();
  g.translate(0.008, 0.014);
  g.fillStyle = 'rgba(170,180,182,0.22)';
  g.fill(main);
  g.restore();
  g.fillStyle = '#0b0e10';
  g.fill(main);
  if (C.branches > 0.01) {
    g.globalAlpha = C.branches;
    for (const [c0, bp] of CRACK.brs) if (c0 <= vis) g.fill(strip(bp, (u) => C.w * 0.45 * (1 - u)));
    g.globalAlpha = 1;
  }
  g.restore();
}

// ── what glows in the crack (a glowing card just before the wall): the mist's cold light seeping through it (`seep`:
// its animate shows it as `crack`, `glow` and `shudder` say) and, split open, the red moon (`rift`) ──
function fissure(g, e) {
  const { pts } = crackLine(1);
  e.layer('seep', { blend: 'add' }, (g) => {
    g.filter = 'blur(4px)';
    g.strokeStyle = 'rgba(150,205,175,0.5)';
    g.lineWidth = 0.09;
    g.lineJoin = 'round';
    polyline(g, pts);
    g.stroke();
    g.filter = 'none';
    g.strokeStyle = 'rgba(175,225,195,0.7)';
    g.lineWidth = 0.006;
    polyline(g, pts);
    g.stroke();
  });
  // split open: wide in the middle, the deep red of the moon in it, and its bloom on the stone
  e.layer('rift', {}, (g) => {
    const wide = strip(pts, (u) => 0.28 * (1 - 0.8 * u) * (0.7 + 0.3 * Math.sin(u * 31)) * (1 + 1.4 * Math.sin(Math.PI * Math.min(1, u * 1.3))));
    g.save();
    g.filter = 'blur(10px)';
    g.strokeStyle = 'rgba(190,42,30,0.45)';
    g.lineWidth = 0.35;
    polyline(g, pts);
    g.stroke();
    g.restore();
    const gr = g.createLinearGradient(-3, -5, 2.5, -2.5);
    gr.addColorStop(0, '#78120f');
    gr.addColorStop(0.5, '#b92d22');
    gr.addColorStop(1, '#961914');
    g.fillStyle = gr;
    g.fill(wide);
    g.fillStyle = 'rgba(255,120,90,0.5)';
    g.fill(strip(pts, (u) => 0.05 * Math.sin(Math.PI * Math.min(1, u * 1.3))));
  });
}
function fissureMotion(e) {
  const s = e.state, CR = N(s.crack), m = e.mem;
  m.sh ??= 0;
  m.sh += (N(s.shudder) - m.sh) * Math.min(1, e.dt * 8);
  e.layer('seep').alpha = clamp(sm(0.6, 1, CR) * (0.3 + 0.7 * N(s.glow)) + 0.6 * m.sh, 0, 1) * (0.85 + 0.15 * noise(e.t * 0.7, 4));
  e.layer('rift').alpha = N(s.rift) * (0.9 + 0.1 * noise(e.t * 1.3, 5));
}

// ── the door's leaf (hinged on its right: painted from the hinge, x −2·DH … 0; the door_turn key turns it), and the
// corridor beyond ──
function door(g, e) {
  const LEAF = new Path2D();
  arch(LEAF, -DH, DH - 0.012, -GAP, -1.86, DT + 0.012);
  g.save();
  g.clip(LEAF);
  g.fillStyle = '#4a3c31';
  g.fill(LEAF);
  g.strokeStyle = 'rgba(20,14,10,0.45)';
  g.lineWidth = 0.012;
  for (let k = 1; k < 8; k++) {
    const x = -2 * DH + k * 0.145;
    g.beginPath();
    g.moveTo(x, 0);
    g.lineTo(x, DT);
    g.stroke();
  }
  // its grain, its iron straps, the ring
  for (let i = 0; i < 40; i++) {
    const x = -2 * DH + e.rnd() * 2 * DH, y = -0.75 - e.rnd() * 1.6;
    g.fillStyle = `rgba(${e.rnd() < 0.5 ? '30,22,16' : '110,90,70'},${0.08 + 0.1 * e.rnd()})`;
    g.fillRect(x, y, 0.006, 0.2 + 0.4 * e.rnd());
  }
  g.fillStyle = '#26221f';
  g.fillRect(-2 * DH, -0.62, 2 * DH, 0.05);
  g.fillRect(-2 * DH, -1.62, 2 * DH, 0.05);
  g.restore();
  g.strokeStyle = '#2a2622';
  g.lineWidth = 0.02;
  g.beginPath();
  g.arc(-2 * DH + 0.16, -1.05, 0.05, 0, 7);
  g.stroke();
  e.at(-2 * DH + 0.16, -1.05, 'ring');
}
function corridor(g, e) {
  g.fillStyle = '#4a5157';
  g.fillRect(-1.6, -3.2, 3.2, 3.3);
  g.fillStyle = 'rgba(20,24,28,0.35)';
  for (let r = 1; r < 7; r++) g.fillRect(-1.6, -r * 0.42, 3.2, 0.014);
  for (let i = 0; i < 18; i++) g.fillRect(-1.6 + e.rnd() * 3.2, -0.42 * (1 + Math.floor(e.rnd() * 7)), 0.014, 0.42);
  // its floor: flags, seen through the doorway
  g.fillStyle = '#3d4348';
  g.fillRect(-1.6, -0.06, 3.2, 0.16);
}
// the thread of lamplight under the shut door, and its glimmer round the leaf's edges (a glowing card behind the door:
// it shows only through the gaps) — its animate brings them up with the lamp
function doorGap(g, e) {
  e.layer('strip', {}, (g) => {
    const gr = g.createLinearGradient(-1.2, 0, 1.2, 0);
    gr.addColorStop(0, 'rgba(255,170,90,0)');
    gr.addColorStop(0.5, 'rgba(255,215,150,1)');
    gr.addColorStop(1, 'rgba(255,170,90,0)');
    g.fillStyle = gr;
    g.fillRect(-1.2, -GAP - 0.02, 2.4, GAP + 0.03);
  });
  e.layer('rim', {}, (g) => {
    const E = new Path2D();
    arch(E, 0, DH - 0.006, -GAP, -1.86, DT + 0.006);
    g.strokeStyle = 'rgba(255,190,110,0.6)';
    g.lineWidth = 0.012;
    g.stroke(E);
  });
}
// the lamp in the corridor (hall_x: where, hall_lamp: how bright) and the feet of whoever carries it: walking, the lifted
// foot lets the light through; stopped, both planted. → { k, x, feet: [[x, lifted 0…1] …] }
function hall(e) {
  const s = e.state, x = +s.hall_x || 0, v = Math.abs(e.speed('hall_x')), still = clamp(1 - v * 3, 0, 1), ph = x * 7.5;
  const k = N(s.hall_lamp) * (1 + 0.04 * Math.sin(e.t * 7.1) + 0.06 * still * noise(e.t * 9, 3));
  return { k, x, feet: [-1, 1].map((side) => [x + side * 0.16 + 0.05 * (1 - still) * Math.sin(ph + (side * Math.PI) / 2), (1 - still) * Math.max(0, Math.sin(ph + (side > 0 ? Math.PI : 0)))]) };
}
function doorGapMotion(e) {
  const H = hall(e), shut = clamp(1 - Math.abs((+e.state.door_turn || DOOR.shut) - DOOR.shut) / 4, 0, 1);
  const strip = e.layer('strip');
  strip.x = H.x;
  strip.alpha = clamp(H.k, 0, 1);
  e.layer('rim').alpha = clamp(H.k * 0.6, 0, 1) * shut;
}
// the carrier's feet (a card just behind the door: seen only in the gap under it, against the thread of light; they
// cast their shadows through the fan of light the gap throws on the floor)
function feet(g, e) {
  for (const side of ['l', 'r'])
    e.layer(side, {}, (g) => {
      g.fillStyle = '#16120f';
      g.beginPath();
      g.roundRect(-0.055, -0.13, 0.11, 0.13, [0.03, 0.03, 0, 0]);
      g.fill();
    });
}
function feetMotion(e) {
  const H = hall(e), on = H.k > 0.02 ? 1 : 0;
  H.feet.forEach(([x, up], i) => {
    const L = e.layer(i ? 'r' : 'l');
    L.x = x;
    L.y = -0.09 * up;
    L.alpha = on;
  });
}

// ── the lancet window: its stone tracery and the fixed glass of its head (the casements are their own) ──
function windowFrame(g, e) {
  const G = new Path2D();
  arch(G, WX, 0.6, -0.95, -3.35, -4.3);
  g.save();
  g.clip(G);
  g.fillStyle = 'rgba(150,185,180,0.12)';
  g.fillRect(WX - 0.7, -4.4, 1.4, 0.65);
  g.strokeStyle = 'rgba(30,40,42,0.5)';
  g.lineWidth = 0.007;
  g.beginPath();
  diamonds(g, WX - 0.62, WX + 0.62, -3.7, -4.35);
  g.stroke();
  g.restore();
  const TR = new Path2D();
  TR.moveTo(WX, -0.95);
  TR.lineTo(WX, -3.2);
  for (const c of [WX - 0.3, WX + 0.3]) {
    TR.moveTo(c - 0.3, -3.2);
    TR.bezierCurveTo(c - 0.3, -3.53, c - 0.135, -3.68, c, -3.8);
    TR.bezierCurveTo(c + 0.135, -3.68, c + 0.3, -3.53, c + 0.3, -3.2);
  }
  TR.moveTo(WX + 0.15, -4.02);
  TR.arc(WX, -4.02, 0.15, 0, 6.2832);
  g.strokeStyle = '#4c5559';
  g.lineWidth = 0.055;
  g.stroke(TR);
  g.lineWidth = 0.05;
  g.stroke(G);
}
// diamond leading over x a…b, from y0 up to y1 (y0 > y1): lines of slope ±2 a pane 0.13 wide, each cut to the span
function diamonds(g, a, b, y0, y1) {
  const H = y0 - y1;
  for (const d of [1, -1])
    for (let x0 = a - H / 2; x0 < b + H / 2; x0 += 0.13) {
      // (x = x0 + d·u/2 as it rises u from y0)
      const u0 = Math.max(0, Math.min(H, (d > 0 ? a - x0 : x0 - b) * 2)), u1 = Math.max(0, Math.min(H, (d > 0 ? b - x0 : x0 - a) * 2));
      if (u1 <= u0) continue;
      g.moveTo(x0 + (d * u0) / 2, y0 - u0);
      g.lineTo(x0 + (d * u1) / 2, y0 - u1);
    }
}
// a casement (k −1 the left, 1 the right): a lancet of leaded glass, painted from its hinge on the window's side (the
// left one to the right of its hinge, the right one to its left), from the sill (y −0.95) up to its pointed head; its
// handle on the free edge, 1.3 m up — "casement_l#handle", for a hand to take it as it swings
const bez = (a, b, c, d, u) => (1 - u) ** 3 * a + 3 * (1 - u) ** 2 * u * b + 3 * (1 - u) * u * u * c + u ** 3 * d;
function casement(g, e, k) {
  const c = -0.3 * k; // the lancet's middle, from the hinge
  const P = new Path2D();
  P.moveTo(c - 0.3, -0.95);
  for (let i = 0; i <= 8; i++) P.lineTo(bez(c - 0.3, c - 0.3, c - 0.135, c, i / 8), bez(-3.2, -3.53, -3.68, -3.8, i / 8));
  for (let i = 1; i <= 8; i++) P.lineTo(bez(c, c + 0.135, c + 0.3, c + 0.3, i / 8), bez(-3.8, -3.68, -3.53, -3.2, i / 8));
  P.lineTo(c + 0.3, -0.95);
  P.closePath();
  g.save();
  g.clip(P);
  g.fillStyle = 'rgba(150,190,185,0.1)';
  g.fill(P);
  // the diamond leading
  g.strokeStyle = 'rgba(30,38,40,0.6)';
  g.lineWidth = 0.007;
  g.beginPath();
  diamonds(g, c - 0.31, c + 0.31, -0.9, -3.85);
  g.stroke();
  // old glass: bubbles and streaks
  for (let i = 0; i < 45; i++) {
    g.fillStyle = `rgba(200,225,215,${0.06 + 0.1 * e.rnd()})`;
    g.beginPath();
    g.arc(c - 0.28 + e.rnd() * 0.56, -3.75 + e.rnd() * 2.8, 0.006 + e.rnd() * 0.008, 0, 7);
    g.fill();
  }
  g.restore();
  g.strokeStyle = '#3a3330';
  g.lineWidth = 0.03;
  g.lineJoin = 'round';
  g.stroke(P);
  // the iron latch on the free edge
  const fx = c - 0.3 * k;
  g.fillStyle = '#2b2826';
  g.fillRect(fx - 0.03 + 0.03 * k, -1.36, 0.03, 0.12);
  e.at(fx + 0.02 * k, -1.3, 'handle');
}

// ── the heavy curtain right of the window: the cloth painted hanging; its shader blows it into the room in the wind
// (gust: its animate follows `wind`), its lower part flying up and left, waves running down it ──
function curtain(g, e) {
  const P = new Path2D(), L = [], R = [];
  for (let i = 0; i <= 24; i++) {
    const y = -4.9 + (i * 4.9) / 24, k = i / 24;
    L.push([-0.24 - 0.1 * k + 0.012 * Math.sin(y * 4.1), y]);
    R.push([0.3 + 0.06 * k, y]);
  }
  P.moveTo(L[0][0], L[0][1]);
  for (const p of L) P.lineTo(p[0], p[1]);
  for (let i = R.length - 1; i >= 0; i--) P.lineTo(R[i][0], R[i][1]);
  P.closePath();
  g.fillStyle = '#2d4246';
  g.fill(P);
  g.save();
  g.clip(P);
  for (let f = 0; f < 6; f++) {
    const x0 = -0.2 + f * 0.09;
    g.strokeStyle = f % 2 ? 'rgba(10,16,18,0.45)' : 'rgba(120,160,155,0.12)';
    g.lineWidth = 0.05;
    g.beginPath();
    for (let i = 0; i <= 24; i++) {
      const y = -4.9 + (i * 4.9) / 24, x = x0 + x0 * 0.3 * (i / 24);
      i ? g.lineTo(x, y) : g.moveTo(x, y);
    }
    g.stroke();
  }
  // its fringe, its heavy hem
  g.fillStyle = 'rgba(14,20,22,0.6)';
  g.fillRect(-0.4, -0.12, 0.8, 0.12);
  g.restore();
  e.at(0.03, -1.4, 'cloth');
}
function curtainMotion(e) {
  const m = e.mem;
  m.w ??= N(e.state.wind);
  m.w += (N(e.state.wind) - m.w) * Math.min(1, e.dt * 2.5);
  e.uniform('gust', m.w);
}

// ── the stone floor (a plane: x across, y toward the eye; its far edge at the back wall); its point `mid` ──
function floor(g, e) {
  g.fillStyle = '#4f575d';
  g.fillRect(-8, -3.2, 16, 6.4);
  for (let r = 0; r < 8; r++) {
    const y0 = -3.2 + r * 0.8;
    let x = -8 - e.rnd() * 0.8;
    while (x < 8) {
      const w = 0.7 + e.rnd() * 0.6, k = e.rnd(), a = 0.06 + e.rnd() * 0.12;
      g.fillStyle = k < 0.5 ? `rgba(18,22,26,${a})` : `rgba(150,160,166,${a * 0.7})`;
      g.fillRect(x, y0, w, 0.8);
      g.fillStyle = 'rgba(20,24,28,0.55)';
      g.fillRect(x, y0, 0.022, 0.8);
      x += w;
    }
    g.fillStyle = 'rgba(20,24,28,0.55)';
    g.fillRect(-8, y0, 16, 0.022);
  }
  // worn smooth before the door, grit in the joints
  for (let i = 0; i < 120; i++) {
    g.fillStyle = `rgba(30,32,34,${0.15 + 0.2 * e.rnd()})`;
    g.fillRect(-8 + e.rnd() * 16, -3.2 + e.rnd() * 6.4, 0.01 + 0.02 * e.rnd(), 0.01 + 0.02 * e.rnd());
  }
  // the middle of the room's floor between the table and the door (where a game searches it: floor#mid)
  e.at(0.3, -1.4, 'mid');
}

// ── the furniture ──
// the small round table: its pedestal and feet (a card), its top (a plane: tableTop — it shadows the floor under it
// from the candle on it)
function table(g, e) {
  g.strokeStyle = g.fillStyle = '#3c2f27';
  g.lineCap = 'round';
  g.lineWidth = 0.035;
  g.beginPath();
  g.moveTo(0, -0.13); g.quadraticCurveTo(-0.14, -0.1, -0.25, -0.015);
  g.moveTo(0, -0.13); g.quadraticCurveTo(0.14, -0.1, 0.24, -0.02);
  g.moveTo(0, -0.13); g.quadraticCurveTo(0.02, -0.06, 0.05, 0.03);
  g.stroke();
  g.beginPath();
  g.moveTo(-0.028, -0.7); g.lineTo(0.028, -0.7); g.lineTo(0.026, -0.56);
  g.quadraticCurveTo(0.065, -0.46, 0.028, -0.36); g.lineTo(0.04, -0.12); g.lineTo(-0.04, -0.12); g.lineTo(-0.028, -0.36);
  g.quadraticCurveTo(-0.065, -0.46, -0.026, -0.56);
  g.closePath();
  g.fill();
}
// its round top seen from above (0.33 m across its radius): the board's grain, its worn rim
function tableTop(g, e) {
  g.fillStyle = '#4c3b2f';
  g.beginPath(); g.arc(0, 0, 0.33, 0, 7); g.fill();
  g.save();
  g.clip();
  for (let i = 0; i < 26; i++) {
    g.fillStyle = `rgba(${e.rnd() < 0.5 ? '30,22,16' : '120,95,70'},${0.06 + 0.08 * e.rnd()})`;
    g.fillRect(-0.33, -0.33 + i * 0.026, 0.66, 0.006 + 0.01 * e.rnd());
  }
  g.restore();
  g.strokeStyle = '#34281f';
  g.lineWidth = 0.02;
  g.beginPath(); g.arc(0, 0, 0.32, 0, 7); g.stroke();
}
// the candle on the table: its stick and the wax (its flame is its own: flame)
function candle(g, e) {
  g.fillStyle = '#5a4a36';
  g.beginPath(); g.ellipse(0, -0.01, 0.05, 0.012, 0, 0, 7); g.fill();
  g.fillRect(-0.007, -0.13, 0.014, 0.12);
  g.beginPath(); g.ellipse(0, -0.07, 0.014, 0.01, 0, 0, 7); g.fill();
  g.beginPath(); g.ellipse(0, -0.133, 0.036, 0.008, 0, 0, 7); g.fill();
  const ch = 0.12;
  const gr = g.createLinearGradient(-0.012, 0, 0.012, 0);
  gr.addColorStop(0, '#b8a888');
  gr.addColorStop(0.45, '#efe2c4');
  gr.addColorStop(1, '#c4b292');
  g.fillStyle = gr;
  g.fillRect(-0.012, -0.135 - ch, 0.024, ch);
  g.fillStyle = '#e8d8b5';
  g.beginPath(); g.ellipse(0.009, -0.2, 0.004, 0.02, 0, 0, 7); g.fill();
  g.strokeStyle = '#1a1410';
  g.lineWidth = 0.0025;
  g.beginPath(); g.moveTo(0, -0.255); g.lineTo(0, -0.268); g.stroke();
}
// the flame over the wick (a glowing card at the candle's place): a layer of its own — breathing, bending and guttering
// in the wind, shuddering when the house answers (its animate) — with its light; out (`candle` 0) — a thread of smoke
function flame(g, e) {
  // the flame (its heart white, its tip orange, the blue at its root) and its light, about its root at the wick
  e.layer('flame', { pivot: [0, -0.258], blend: 'add' }, (g) => {
    const h = 0.05;
    const hal = g.createRadialGradient(0, -0.29, 0.005, 0, -0.29, 0.2);
    hal.addColorStop(0, 'rgba(255,200,120,0.35)');
    hal.addColorStop(1, 'rgba(255,190,110,0)');
    g.fillStyle = hal;
    g.fillRect(-0.22, -0.5, 0.44, 0.44);
    const fg = g.createRadialGradient(0, -0.262 - h * 0.3, 0, 0, -0.262 - h * 0.3, h * 0.8);
    fg.addColorStop(0, '#fff8e6');
    fg.addColorStop(0.45, '#ffd58a');
    fg.addColorStop(1, 'rgba(255,140,50,0.35)');
    g.fillStyle = fg;
    g.beginPath();
    g.moveTo(0, -0.262 - h);
    g.bezierCurveTo(0.011, -0.262 - h * 0.55, 0.012, -0.262, 0, -0.257);
    g.bezierCurveTo(-0.012, -0.262, -0.011, -0.262 - h * 0.55, 0, -0.262 - h);
    g.fill();
    g.fillStyle = 'rgba(90,120,200,0.4)';
    g.beginPath(); g.ellipse(0, -0.26, 0.004, 0.003, 0, 0, 7); g.fill();
    e.light(0, -0.29, 1.3, '#ffb060', 0.5, 'flame');
  });
  // out: a thread of smoke curling up off the wick, swaying
  e.layer('smoke', { pivot: [0, -0.27], wind: { strength: 0.5, gust: 0.4 }, shimmer: 0.3 }, (g) => {
    g.strokeStyle = 'rgba(190,195,195,0.3)';
    g.lineWidth = 0.004;
    g.beginPath();
    g.moveTo(0, -0.27);
    g.bezierCurveTo(0.02, -0.36, -0.025, -0.44, 0.015, -0.55);
    g.stroke();
  });
}
function flameMotion(e) {
  const s = e.state, t = e.t, m = e.mem, WD = N(s.wind), SH = N(s.shudder), C = N(s.candle);
  e.layer('smoke').alpha = clamp(1 - C * 8, 0, 1);
  m.w ??= WD;
  m.w += (WD - m.w) * Math.min(1, e.dt * 3);
  // breathing (1 ± a little), guttering in the wind, dipping when the house answers
  const breath = 1 + 0.05 * Math.sin(t * 8.3) + 0.035 * Math.sin(t * 12.9 + 1) + 0.03 * Math.sin(t * 2.7);
  const k = breath * (1 - 0.35 * m.w * (0.5 + 0.5 * noise(t * 6, 2))) * (1 - 0.45 * SH * (0.5 + 0.5 * noise(t * 30, 4)));
  const F = e.layer('flame');
  F.scaleY = (0.45 + 0.55 * C) * k;
  F.scaleX = 0.9 + 0.1 * k;
  // bent away from the window by the wind, trembling
  F.rotate = 0.06 * Math.sin(t * 1.3) + 0.04 * Math.sin(t * 2.9 + 1) - m.w * (0.55 + 0.25 * noise(t * 5, 3)) + 0.25 * SH * noise(t * 25, 5);
  F.alpha = clamp(C * 1.6, 0, 1);
  e.glow('flame', C * k);
}
// the narrator's plain chair at the table, seen from the side (its back on the left)
function seat(g, e) {
  const P = new Path2D();
  P.rect(-0.24, -1.0, 0.045, 1.0);
  P.rect(0.16, -0.46, 0.04, 0.46);
  P.rect(-0.24, -0.48, 0.44, 0.04);
  P.rect(-0.22, -0.95, 0.025, 0.42);
  P.rect(-0.215, -0.9, 0.06, 0.03);
  P.rect(-0.215, -0.72, 0.06, 0.03);
  P.rect(-0.2, -0.2, 0.36, 0.02);
  g.fillStyle = '#3a2c24';
  g.fill(P);
}
// Roderick's high-backed chair, its back to us (it faces the door): carved posts with finials, a pointed arch carved
// in the panel; dark wood
function chair(g, e) {
  const BACK = 1.08, HW = 0.31, P = new Path2D();
  for (const x of [-HW, HW - 0.06]) {
    P.rect(x, -BACK, 0.06, BACK);
    P.moveTo(x - 0.008, -BACK);
    P.quadraticCurveTo(x + 0.03, -BACK - 0.05, x + 0.03, -BACK - 0.13);
    P.quadraticCurveTo(x + 0.03, -BACK - 0.05, x + 0.068, -BACK);
    P.closePath();
  }
  P.moveTo(-HW + 0.05, -0.52);
  P.lineTo(-HW + 0.05, -BACK + 0.08);
  P.quadraticCurveTo(0, -BACK - 0.06, HW - 0.05, -BACK + 0.08);
  P.lineTo(HW - 0.05, -0.52);
  P.closePath();
  P.rect(-HW - 0.03, -0.5, 2 * HW + 0.06, 0.05);
  P.rect(-HW - 0.05, -0.8, 0.04, 0.3);
  P.rect(HW + 0.01, -0.8, 0.04, 0.3);
  P.rect(-HW - 0.06, -0.82, 0.08, 0.03);
  P.rect(HW - 0.02, -0.82, 0.08, 0.03);
  P.rect(-HW + 0.02, -0.45, 0.04, 0.45);
  P.rect(HW - 0.06, -0.45, 0.04, 0.45);
  g.fillStyle = '#35271f';
  g.fill(P);
  // the carving: a pointed arch and its tracery
  const A = new Path2D();
  A.moveTo(-0.15, -0.62);
  A.lineTo(-0.15, -0.95);
  A.quadraticCurveTo(-0.15, -1.1, 0, -1.18);
  A.quadraticCurveTo(0.15, -1.1, 0.15, -0.95);
  A.lineTo(0.15, -0.62);
  g.strokeStyle = 'rgba(110,85,65,0.55)';
  g.lineWidth = 0.012;
  g.stroke(A);
  g.strokeStyle = 'rgba(20,14,10,0.6)';
  g.lineWidth = 0.008;
  g.stroke(A);
}
// «Безумный Тристан», closed on the table top (0.72 m) — not there while the narrator has it open in his hands (his
// <id>_with: book_open); its point then follows the book in his hands (its animate), for the game's choices on it
function book(g, e) {
  if ([].concat(e.state.narrator_with ?? []).includes('book_open')) return;
  g.fillStyle = '#4a2e24';
  g.beginPath();
  g.moveTo(-0.27, -0.73); g.lineTo(-0.1, -0.765); g.lineTo(-0.04, -0.72); g.lineTo(-0.21, -0.69);
  g.closePath();
  g.fill();
  g.fillStyle = '#d9cdb0';
  g.fillRect(-0.21, -0.69, 0.17, 0.008);
  g.fillStyle = '#5e3a2c';
  g.beginPath();
  g.moveTo(-0.26, -0.737); g.lineTo(-0.1, -0.77); g.lineTo(-0.05, -0.73); g.lineTo(-0.21, -0.698);
  g.closePath();
  g.fill();
}
function bookMotion(e) {
  if ([].concat(e.state.narrator_with ?? []).includes('book_open')) {
    const p = e.point('narrator#book');
    if (p) e.at(p[0], p[1]);
  } else e.at(-0.15, -0.74);
}

// ── the storm beyond the window (the sky, stage heights): low clouds flying, the land and its dead trees, the glowing
// mist over the ground; the sky's shader moves the clouds and the mist (wrapping round), lights the mist's glow and
// the clouds' undersides by `glow`, and flashes them with the lightning ──
const SKYW = (A) => A + 0.6; // the width the clouds and the mist wrap round (from −0.3)
function sky(g, e) {
  const A = e.aspect, W = SKYW(A);
  let gr = g.createLinearGradient(0, -0.35, 0, 0.7);
  gr.addColorStop(0, '#0b1217');
  gr.addColorStop(0.5, '#1d2c32');
  gr.addColorStop(1, '#3a5552');
  g.fillStyle = gr;
  g.fillRect(-0.3, -0.35, A + 0.6, 1.6);
  // the land: a low black rise, its dead trees
  g.fillStyle = '#0a1114';
  g.beginPath();
  g.moveTo(-0.3, 1.3);
  for (let k = 0; k <= 48; k++) { const x = -0.3 + (k * (A + 0.6)) / 48; g.lineTo(x, 0.505 + 0.018 * Math.sin(x * 5.3) + 0.008 * Math.sin(x * 17 + 1)); }
  g.lineTo(A + 0.3, 1.3);
  g.closePath();
  g.fill();
  g.strokeStyle = '#0a1114';
  g.lineCap = 'round';
  const branch = (x, y, ang, len, w, depth) => {
    const x2 = x + Math.cos(ang) * len, y2 = y + Math.sin(ang) * len;
    g.lineWidth = w;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x2, y2); g.stroke();
    if (depth > 0) {
      branch(x2, y2, ang - 0.45 + (e.rnd() - 0.5) * 0.5, len * 0.72, w * 0.62, depth - 1);
      branch(x2, y2, ang + 0.4 + (e.rnd() - 0.5) * 0.5, len * 0.68, w * 0.62, depth - 1);
    }
  };
  for (let i = 0; i < 16; i++) {
    const x = -0.2 + e.rnd() * (A + 0.4);
    branch(x, 0.51 + 0.018 * Math.sin(x * 5.3), -Math.PI / 2 + (e.rnd() - 0.5) * 0.2, 0.03 + e.rnd() * 0.04, 0.005, 4);
  }
  // three bands of low cloud, each blob painted again a width further so the band's ends meet as it wraps
  const blob = (g, x, y, w, h, col) => {
    for (const dx of [0, -W, W]) {
      g.save();
      g.translate(x + dx, y);
      g.scale(w, h);
      const rg = g.createRadialGradient(0, 0, 0, 0, 0, 1);
      rg.addColorStop(0, col(1));
      rg.addColorStop(1, col(0));
      g.fillStyle = rg;
      g.beginPath(); g.arc(0, 0, 1, 0, 7); g.fill();
      g.restore();
    }
  };
  const clouds = [];
  for (let l = 0; l < 3; l++) for (let i = 0; i < 10; i++) clouds.push({ l, a: e.rnd(), b: e.rnd(), c: e.rnd() });
  const at = (o) => [-0.3 + o.a * W, -0.12 + o.l * 0.14 + o.c * 0.16, 0.16 + 0.24 * o.c, 0.025 + 0.025 * o.b];
  // (1) the clouds, dark
  e.layer('clouds', {}, (g) => {
    for (const o of clouds) {
      const [x, y, w, h] = at(o), v = 12 + o.l * 6, a = 0.75 + 0.08 * o.l;
      blob(g, x, y, w, h, (k) => `rgba(${v},${v + 10},${v + 14},${a * k})`);
    }
  });
  // (2) their undersides lit by the glowing mist below
  e.layer('underlit', {}, (g) => {
    for (const o of clouds) {
      const [x, y, w, h] = at(o);
      blob(g, x, y + 0.55 * h, w, h, (k) => `rgba(150,205,175,${0.35 * (0.5 + o.l * 0.25) * k})`);
    }
  });
  // (3) their tops lit by the lightning
  e.layer('toplit', {}, (g) => {
    for (const o of clouds) {
      const [x, y, w, h] = at(o);
      blob(g, x, y - 0.3 * h, w, h, (k) => `rgba(205,218,230,${0.5 * k})`);
    }
  });
  // (4) the mist over the ground: long soft banks, glowing
  e.layer('mist', {}, (g) => {
    gr = g.createLinearGradient(0, 0.0, 0, 0.55);
    gr.addColorStop(0, 'rgba(150,205,175,0)');
    gr.addColorStop(1, 'rgba(150,205,175,0.5)');
    g.fillStyle = gr;
    g.fillRect(-0.3, 0, W, 0.7);
    for (let i = 0; i < 14; i++) blob(g, -0.3 + e.rnd() * W, 0.47 + e.rnd() * 0.08, 0.25 + e.rnd() * 0.3, 0.025 + 0.02 * e.rnd(), (k) => `rgba(160,210,180,${0.4 * k})`);
  });
}
function skyMotion(e) {
  const s = e.state, m = e.mem, ST = N(s.storm);
  // the clouds fly faster in the storm (each band at its own pace: the shader's); the mist creeps
  m.c ??= 0;
  m.c += e.dt * (0.012 + 0.03 * ST);
  m.m ??= 0;
  m.m += e.dt * 0.006;
  e.uniform('cloud', m.c);
  e.uniform('mistgo', m.m);
  e.uniform('glow', N(s.glow));
  e.uniform('flash', N(s.lightning));
}

// ── the ripple on the floor where the sound comes up (a plane at SPOT): its shader draws the rings and the grit
// trembling on the stone, as strong as `ripple` (its animate) ──
// (what a shader draws all of by itself: its painting holds nothing but the extent the shader runs over — a clear rect;
// a painting with nothing in it is not drawn at all)
function clear(g, e) {
  const [l, t, r, b] = e.area;
  g.fillStyle = 'rgba(0,0,0,0)';
  g.fillRect(l, t, r - l, b - t);
}
function rippleMotion(e) {
  const m = e.mem;
  m.k ??= 0;
  m.k += (N(e.state.ripple) - m.k) * Math.min(1, e.dt * 6);
  e.uniform('ring', m.k);
}

// ── the close-ups (an insert: the closeups module paints them). closeup(S) — the shot `shot` chooses, painted once as it
// is chosen; closeupNow(S) — all that moves in it (live, no repaint) ──
// The hands: Roderick's from the left, Madeline's (bloodied) from the right, reaching — to the narrator (rod_reach,
// mad_reach: up toward the eye, closer in) or to each other (rod_to_mad, mad_to_rod: in toward the middle, turned to the
// other); the narrator's own — open, following the player's finger (grab, grab_x, grab_y: the wrist; the palm ~0.2
// above), and gripping the hand he has taken (held_rod: his left under Roderick's, held_mad: his right under
// Madeline's). The reaching hands name their palms (rod_hand, mad_hand): where the player takes them
// (b.where('closeup#rod_hand')).
const BASE_AT = (side) => [side * 0.44, 0.36];
const reachOf = (side, toYou, toOther) => ({
  raise: 0.35 + 0.65 * Math.max(toYou, toOther),
  x: -side * (0.2 * toYou + 0.11 * toOther), y: -0.14 * toYou - 0.12 * toOther, angle: -side * 0.95 * toOther + side * 0.12 * toYou,
});
const HANDS = [
  { name: 'rod_hand', who: 'roderick', pose: 'reach', side: -1, at: BASE_AT(-1), angle: 0.3, size: 0.46, palm: true, curl: 0.2, spread: 0.55, tremble: 0.5 },
  { name: 'mad_hand', who: 'madeline', pose: 'reach', side: 1, blood: 1, at: BASE_AT(1), angle: -0.3, size: 0.46, palm: true, curl: 0.2, spread: 0.55, tremble: 0.5 },
  { name: 'nar_rod', who: 'narrator', pose: 'clasp', side: -1, size: 0.44, at: [-0.4, 0.42], angle: 0.2 },
  { name: 'nar_mad', who: 'narrator', pose: 'clasp', side: 1, size: 0.44, at: [0.4, 0.42], angle: -0.2 },
  { name: 'nar_hand', who: 'narrator', pose: 'open', side: 1, size: 0.44, at: [0, 0.3], angle: 0, spread: 0.4 },
];
const SHOTS = {
  rod_lamp: { light: 'lamp', flash: true, faces: [{ who: 'roderick', eyes: 1.3, fear: 0.8, wind: 1 }] },
  rod_confess: { light: 'candle', flash: true, faces: [{ who: 'roderick', eyes: 1.25, fear: 0.55, grief: 0.7, wet: 0.9, strain: 0.4, wind: 0.5 }] },
  mad_door: { light: 'door', flash: true, faces: [{ who: 'madeline', blood: 1, sway: 1, eyes: 1.15, size: 0.5, at: [-0.1, -0.12], hands: 'reach' }] },
  // (its point `stay`: between the reaching hands, above the narrator's own — where he stays as he is)
  hands: { light: 'candle', flash: true, hands: HANDS, points: [[0, -0.12, 'stay']] },
};
const closeup = (s) => SHOTS[s.shot] ?? null;
function closeupNow(s) {
  const rod = reachOf(-1, N(s.rod_reach), N(s.rod_to_mad)), mad = reachOf(1, N(s.mad_reach), N(s.mad_to_rod));
  // (his grip follows the hand it holds)
  const grip = (h, held) => ({ raise: held, x: h.x, y: h.y, angle: h.angle });
  return {
    zoom: 1 + 0.04 * N(s.cu_push), flash: N(s.lightning),
    roderick: { speak: N(s.cu_speak) }, madeline: { reach: N(s.cu_reach) },
    rod_hand: rod, mad_hand: mad, nar_rod: grip(rod, N(s.held_rod)), nar_mad: grip(mad, N(s.held_mad)),
    nar_hand: { raise: N(s.grab), x: +s.grab_x || 0, y: (+s.grab_y || 0.3) - 0.3 },
  };
}

// ── the film: the nights (III) and the storm (IV) in beats (the world's module beats — `beat` names one; notes.md
// lists them). film(scene) — the scene its people are measured on (where a motion done once begins: startOf) ──
const SHOWCASE = ['night', 'lamp_pass', 'enter_lamp', 'window_open', 'window_close', 'read', 'confess', 'door_opens', 'hands', 'collapse', 'flee'];
function film(scene) {
  // (a place `by` metres ahead of [a, d] facing `turn`; the way from one place to another, degrees)
  const ahead = ([a, d], turn, by) => [a + by * Math.sin((turn * Math.PI) / 180), d + by * Math.cos((turn * Math.PI) / 180)];
  const toward = ([a, d], [a2, d2]) => (Math.atan2(a2 - a, d2 - d) * 180) / Math.PI;
  const loop = (motion) => ({ motion, loop: true });
  const off = (id, motion, turn) => scene.startOf(id, motion, turn) ?? { across: 0, distance: 0, turn };
  // the narrator's chair at the table (his hips on its seat, facing the table); Roderick's high chair (its back to us,
  // facing the door); points to look at: the door, the window, the storm beyond, the floor where the sound comes up
  const SEAT = [-1.58, 3.85], AT_TABLE = 110, CHAIR = [0.55, 4.42];
  const DOOR_AT = [0, 6.5, 1.5], WINDOW_AT = [WX, 6.5, 2.2], STORM = [WX, 9, 2.6], SPOT_AT = [SPOT[0], SPOT[1], 0], THRESHOLD = [0, 6.85];
  // in the doorway, come in by it; at the window (before the opening, facing out), the lamp up to it; aside from it;
  // where the narrator comes up behind him, where he stands by him watching
  const DOORWAY = [0, 6.95], INSIDE = [-0.3, 5.6], AT_WINDOW = [WX, 5.92], LAMP_UP = [WX + 0.1, 6.15, 1.95], ASIDE = [3.85, 5.45],
    BEHIND = [2.6, 5.62], WATCHING = [2.55, 5.88];
  // mid-room, where the narrator stops when the window flies open; before the chair, where Roderick stands to speak;
  // Madeline come in; where the two meet and fall (she comes from the door aslant past the chair, facing FALL; he
  // facing her, 0.42 m before her)
  const MID = [-0.6, 4.6], BEFORE_CHAIR = [1.25, 3.75], IN_ROOM = [0.05, 5.6], FALL = 130, KNEEL_M = [1.65, 4.2], KNEEL_R = ahead(KNEEL_M, FALL, 0.42);
  // where going down onto their knees begins, so that they kneel there (she facing FALL, he facing her)
  const meet = (id) => {
    const [at, turn] = id === 'madeline' ? [KNEEL_M, FALL] : [KNEEL_R, FALL + 180], o = off(id, 'kneel_slow', turn);
    return [at[0] + o.across, at[1] + o.distance];
  };
  // where getting up from his chair leaves him (facing as he sat)
  const stood = () => { const o = off('narrator', 'rise', AT_TABLE); return [SEAT[0] - o.across, SEAT[1] - o.distance]; };

  // ── the state the beats begin at ──
  const room = {
    fade: 0, candle: 1, lightning: 0, glow: 0.55, storm: 1, window: 0, wind: 0.12, door: 0, hall_lamp: 0, hall_x: -1.4,
    ripple: 0, listen: 0, shudder: 0, quake: 0, rift: 0, rock: 0, lamp_down: 0, lamp_held: 0, closeup: 0, shot: null,
    cu_speak: 0, cu_reach: 0, cu_push: 0, grab: 0, held_rod: 0, held_mad: 0, camera_x: 0, camera_h: 0,
  };
  const night = { ...room, glow: 0.2, storm: 0, wind: 0 };
  // the narrator at the table, in his chair, his hands on his knees; …reading the book held open before him
  const seated = {
    narrator_a: SEAT[0], narrator_d: SEAT[1], narrator_do: loop('sit_hands'), narrator_turn: AT_TABLE, narrator_look: null,
    narrator_reach: null, narrator_with: null, narrator_gait: null, narrator_here: true,
  };
  const reads = { ...seated, narrator_do: loop('read_seated'), narrator_with: ['book_open'] };
  const up = () => ({ narrator_a: stood()[0], narrator_d: stood()[1], narrator_do: 'stand', narrator_turn: AT_TABLE, narrator_with: null });
  const noRoderick = {
    roderick_a: DOORWAY[0], roderick_d: DOORWAY[1], roderick_do: 'stand', roderick_turn: 180, roderick_look: null,
    roderick_reach: null, roderick_with: null, roderick_gait: null, roderick_here: false, lamp_held: 0,
  };
  const noMadeline = {
    fallen: 0, madeline_a: THRESHOLD[0], madeline_d: THRESHOLD[1], madeline_do: loop('sway'), madeline_turn: 180,
    madeline_look: null, madeline_reach: null, madeline_gait: null, madeline_here: false, madeline_wear: { garment: 'shroud' },
  };
  const hands = { rod_reach: 0, mad_reach: 0, rod_to_mad: 0, mad_to_rod: 0 };
  // Roderick come in with his lamp, by the door, turned to the narrator
  const inside = () => ({
    ...noRoderick, roderick_here: true, roderick_a: INSIDE[0], roderick_d: INSIDE[1], roderick_do: loop('lamp_stand'),
    roderick_turn: toward(INSIDE, stood()), roderick_look: 'narrator', roderick_with: ['lamp'], roderick_gait: 'lamp_walk', lamp_held: 1,
  });
  // the window flung open, he at it, his lamp up to the storm; the narrator a few steps from the table
  const atWindow = () => ({
    ...room, window: 1, wind: 1, glow: 1, door: 0.08, ...seated, ...up(),
    narrator_a: MID[0], narrator_d: MID[1], narrator_turn: toward(MID, AT_WINDOW), narrator_look: 'roderick',
    ...inside(), roderick_a: AT_WINDOW[0], roderick_d: AT_WINDOW[1], roderick_turn: 0, roderick_look: STORM, roderick_reach: { r: LAMP_UP },
  });
  // the reading: Roderick in the high chair facing the door, his lamp on the floor; the narrator reads
  const reading = {
    ...room, ...reads, ...noRoderick, roderick_here: true, roderick_a: CHAIR[0], roderick_d: CHAIR[1], roderick_do: loop('rock'),
    roderick_turn: 0, rock: 0.3, lamp_down: 1, ...noMadeline, ...hands,
  };
  // he has risen and stands before the chair, turned to the door; the narrator up from his chair; the door open
  const risen = () => ({
    ...reading, rock: 0, roderick_do: 'stand', roderick_a: BEFORE_CHAIR[0], roderick_d: BEFORE_CHAIR[1],
    roderick_turn: toward(BEFORE_CHAIR, DOOR_AT), roderick_look: 'madeline', ...up(), narrator_turn: toward(stood(), IN_ROOM),
    narrator_look: 'madeline', door: 1, wind: 0.4,
  });
  // Madeline on the threshold, swaying; come into the room
  const threshold = { madeline_here: true, madeline_a: THRESHOLD[0], madeline_d: THRESHOLD[1], madeline_turn: 180, madeline_do: loop('sway'), madeline_look: 'roderick', madeline_gait: 'stagger' };
  const inRoom = { ...threshold, madeline_a: IN_ROOM[0], madeline_d: IN_ROOM[1], madeline_turn: toward(IN_ROOM, BEFORE_CHAIR) };

  // a pulse: up to v at once, back to 0 over `secs` (a jolt of the room — shudder — counts a `jolt`: the grit falls)
  const pulse = (s, key, v, secs) => s.sequence(async (q) => {
    if (key === 'shudder') q.set('jolt', (+q.state.jolt || 0) + 1);
    await q.move(key, v, { over: 0.08, ease: 'out' });
    await q.move(key, 0, { over: secs, ease: 'out' });
  });
  // a close-up made ready (an insert: closeup.js) — cut to with .cut()
  const closeUp = (s, shot) => s.shot({ closeup: 1, shot, cu_push: 0, cu_reach: 0, cu_speak: 0 });
  // out of the close-up the beat began on: held a moment, then the room (the insert shut: the room went on under it)
  const outOf = async (s) => { await s.wait(0.4); s.set('closeup', 0); };
  // the end: whoever is not taken sinks to the floor where they stand (unless already fallen); the taken run behind
  // the narrator off to the left
  const leftBehind = (s) => {
    if (s.state.fallen > 0.5) return;
    for (const [id, taken, way, late] of [
      ['madeline', 'with_madeline', [[-1.6, 4.9], [-3.9, 2.9]], 0.5],
      ['roderick', 'with_roderick', [[0.2, 3.0], [-1.5, 2.85], [-3.9, 2.4]], 0.2],
    ]) {
      if (!s.state[`${id}_here`]) continue;
      const p = s.person(id);
      if (!s.state[taken]) { p.do('sink_kneel'); continue; }
      p.reach(null);
      p.look(null);
      p.gait('run');
      s.sequence(async (q) => { await q.wait(late); await q.person(id).walk(way); q.person(id).here(false); });
    }
  };
  // …and the room comes apart: the crack splits open on the red moon, the room shakes, the candle goes out
  const ruin = (s) => s.sequence(async (q) => {
    for (const k of ['rod_reach', 'mad_reach', 'rod_to_mad', 'mad_to_rod']) q.move(k, 0, { over: 0.6 });
    await q.wait(1.4);
    q.move('rift', 1, { over: 4.0, ease: 'in' });
    q.move('crack', 1, { over: 3.0, ease: 'in' });
    await q.wait(0.2);
    q.move('quake', 1, { over: 2.5, ease: 'in' });
    await q.wait(0.6);
    pulse(q, 'shudder', 1, 1.2);
    await q.wait(1.0);
    pulse(q, 'lightning', 0.6, 1.2);
    await q.wait(0.4);
    q.move('candle', 0, { over: 0.8, ease: 'in' });
    await q.wait(0.8);
    pulse(q, 'shudder', 1, 1.4);
    await q.wait(1.5);
  });

  return {
    // ---- The nights: alone by the candle, the quiet rain; out of black; he turns his head to the floor, and back
    night: {
      from: () => ({ ...night, ...seated, ...noRoderick, ...noMadeline, ...hands, fade: 1 }),
      run: async (s) => {
        const nar = s.person('narrator');
        s.move('fade', 0, { over: 2.5, ease: 'out' });
        await s.wait(2.8);
        nar.look(SPOT_AT);
        await s.wait(1.8);
        nar.look(null);
        await s.wait(1.2);
      },
    },
    // ---- A thread of lamplight under the door: someone comes along the corridor, stops at the door, trembling, goes on
    lamp_pass: {
      after: 'night',
      from: () => ({ ...night, ...seated, ...noRoderick, ...noMadeline, ...hands }),
      run: async (s) => {
        const nar = s.person('narrator');
        await s.wait(0.4);
        s.move('hall_x', 0, { over: 2.6, ease: 'out' });
        s.move('hall_lamp', 0.75, { over: 1.8, ease: 'inOut' });
        await s.wait(0.8);
        nar.look(DOOR_AT);
        await s.wait(2.2);
        await s.move('hall_x', 0.08, { over: 1.2, ease: 'inOut' });
        await s.wait(0.2);
        s.move('hall_x', 1.6, { over: 2.4, ease: 'in' });
        await s.wait(0.4);
        await s.move('hall_lamp', 0, { over: 2.0, ease: 'in' });
      },
    },
    // ---- The storm: hurried steps, the lamp under the door — the door bursts open: Roderick with his lamp, staring; he
    // comes in; the narrator gets up; the door drifts back; close: his face from below in his lamp's light, hair wild
    enter_lamp: {
      from: () => ({ ...room, ...seated, ...noRoderick, ...noMadeline, ...hands, fade: 1, hall_x: -1.3 }),
      run: async (s) => {
        const nar = s.person('narrator'), rod = s.person('roderick');
        s.move('fade', 0, { over: 1.5, ease: 'out' });
        await s.wait(0.9);
        s.move('hall_x', 0, { over: 1.2, ease: 'out' });
        s.move('hall_lamp', 0.85, { over: 0.9, ease: 'out' });
        await s.wait(0.4);
        nar.look(DOOR_AT);
        await s.wait(0.9);
        s.move('door', 1, { over: 0.35, ease: 'out' });
        rod.here();
        rod.with(['lamp']);
        s.set('lamp_held', 1);
        rod.do('lamp_stand', { loop: true });
        rod.gait('lamp_walk');
        rod.look('narrator');
        s.move('hall_lamp', 0, { over: 0.3 });
        pulse(s, 'shudder', 0.5, 1.2);
        const next = closeUp(s, 'rod_lamp');
        await s.wait(0.4);
        const rising = nar.go('rise', { from: SEAT, turn: AT_TABLE });
        await s.wait(0.8);
        const comes = rod.walk([[-0.08, 6.2], INSIDE]);
        await s.wait(0.4);
        nar.look('roderick');
        s.sequence(async (q) => { await rising; await q.person('narrator').turn(toward(stood(), INSIDE)); });
        await s.wait(0.6);
        s.move('door', 0.08, { over: 2.6, ease: 'inOut' });
        await comes;
        rod.turn(toward(INSIDE, stood()));
        await s.wait(0.3);
        next.cut();
        // (his face, close: the game's line from here)
        s.tell('enter_lamp:close');
        await s.move('cu_push', 1, { over: 3.6, ease: 'inOut' });
        await s.wait(0.4);
      },
    },
    // ---- He rushes to the window: the wind flings it open under his hand — the curtain flying, the glowing mist; his
    // lamp up to the storm, his eyes on it; the narrator steps away from the table to mid-room
    window_open: {
      after: 'enter_lamp',
      from: () => ({ ...room, ...seated, ...up(), narrator_turn: toward(stood(), INSIDE), narrator_look: 'roderick', ...inside(), ...noMadeline, ...hands, door: 0.08, closeup: 1, shot: 'rod_lamp' }),
      run: async (s) => {
        const nar = s.person('narrator'), rod = s.person('roderick');
        await outOf(s);
        await s.wait(0.2);
        rod.look(WINDOW_AT);
        await rod.walk([[1.2, 5.9], AT_WINDOW]);
        await rod.turn(0);
        // (his free hand on the latch; the wind takes the casements)
        rod.reach({ l: 'casement_l#handle' });
        await s.wait(0.45);
        s.move('window', 1, { over: 0.5, ease: 'back' });
        s.move('wind', 1, { over: 0.6, ease: 'out' });
        await s.wait(0.05);
        s.move('glow', 1, { over: 2.5, ease: 'inOut' });
        rod.reach({ r: LAMP_UP });
        await s.wait(0.1);
        rod.look(STORM);
        await s.wait(0.2);
        pulse(s, 'lightning', 0.8, 1.6);
        await s.wait(0.1);
        const steps = nar.walk([MID]);
        await s.wait(0.2);
        nar.look('roderick');
        await steps;
        await nar.turn(toward(MID, AT_WINDOW));
        await s.wait(1);
      },
    },
    // ---- The narrator goes to the window: Roderick steps aside, the narrator pulls the casements shut by their
    // handles, the wind drops; takes him by the hand and leads him round the chair; he puts his lamp down on the floor
    // by it and sits facing the door
    window_close: {
      after: 'window_open',
      from: () => ({ ...atWindow(), ...noMadeline, ...hands }),
      run: async (s) => {
        const nar = s.person('narrator'), rod = s.person('roderick');
        await s.wait(0.2);
        nar.look(WINDOW_AT);
        const comes = nar.walk([[0.9, 5.1], BEHIND]);
        await s.until(() => comes.remaining != null && comes.remaining < 0.8);
        rod.reach(null);
        rod.look('narrator');
        await s.wait(0.3);
        const aside = rod.walk([ASIDE]);
        await comes;
        await s.all(aside.then(() => s.person('roderick').turn(toward(ASIDE, BEHIND))), nar.walk([AT_WINDOW]));
        await nar.turn(0);
        nar.reach({ l: 'casement_l#handle', r: 'casement_r#handle' });
        await s.wait(0.3);
        s.move('wind', 0.12, { over: 0.8 });
        s.move('glow', 0.55, { over: 2.5 });
        await s.move('window', 0, { over: 0.7, ease: 'inOut' });
        await s.wait(0.1);
        nar.reach(null);
        await nar.turn(toward(AT_WINDOW, ASIDE));
        nar.look('roderick');
        await s.wait(0.4);
        // (led by the hand round the chair, the narrator beside him)
        rod.reach({ l: 'narrator#hand_r' });
        nar.reach({ r: 'roderick#hand_l' });
        await s.wait(0.3);
        const leads = nar.walk([[2.3, 5.2], [1.1, 4.95], [0.05, 4.9]]);
        await s.wait(0.2);
        await rod.walk([[2.2, 5.6], [1.6, 5.2], PUT_AT]);
        rod.reach(null);
        nar.reach(null);
        rod.look(DOOR_AT);
        s.sequence(async (q) => { await leads; await q.person('narrator').turn(toward([0.05, 4.9], CHAIR)); q.person('narrator').look('roderick'); });
        await rod.go('lamp_put', { to: PUT_AT, turn: 90 });
        s.set('lamp_held', 0);
        rod.with(null);
        s.set('lamp_down', 1);
        await s.wait(0.6);
        await rod.go('sit_down', { to: CHAIR, turn: 0 });
        rod.do('seated', { loop: true });
        await s.wait(1);
      },
    },
    // ---- Or he goes to stand by him at the open window, and they look out together
    watch: {
      after: 'window_open',
      from: () => ({ ...atWindow(), ...noMadeline, ...hands }),
      run: async (s) => {
        const nar = s.person('narrator'), rod = s.person('roderick');
        await s.wait(0.4);
        await nar.walk([[0.7, 5.3], WATCHING]);
        rod.reach(null);
        await nar.turn(0);
        nar.look([WX - 0.5, 9, 2.4]);
        await s.wait(1.2);
        pulse(s, 'lightning', 0.7, 1.4);
        await s.wait(0.2);
        rod.look('narrator');
        await s.wait(1.4);
        rod.look(STORM);
        await s.wait(1);
      },
    },
    // ---- Later: the window shut, Roderick in the high chair facing the door, rocking a little; the narrator reads
    read: {
      from: () => ({ ...reading, rock: 0, roderick_do: loop('seated'), fade: 1 }),
      run: async (s) => {
        await s.move('fade', 0, { over: 2, ease: 'inOut' });
        await s.move('rock', 0.3, { over: 2, ease: 'inOut' });
      },
    },
    // ---- The narrator lowers the book onto his knees and looks at him; he gets up, comes round the chair to before
    // it and turns to the narrator; close: his face — fear, grief, wet eyes — under the confession
    confess: {
      after: 'read',
      from: () => reading,
      run: async (s) => {
        const nar = s.person('narrator'), rod = s.person('roderick');
        await s.wait(0.2);
        s.move('rock', 0, { over: 0.8 });
        nar.do('sit_hands', { loop: true });
        await s.wait(0.4);
        nar.look('roderick');
        await s.wait(0.2);
        const next = closeUp(s, 'rod_confess');
        await rod.go('rise', { from: CHAIR, turn: 0 });
        await rod.walk([[1.3, 4.6], BEFORE_CHAIR]);
        rod.look('narrator');
        await rod.turn(toward(BEFORE_CHAIR, SEAT));
        await s.wait(0.3);
        next.cut();
        // (his face, close: the confession from here)
        s.tell('confess:close');
        await s.move('cu_push', 1, { over: 4.0, ease: 'inOut' });
        await s.wait(0.4);
      },
    },
    // ---- He turns to the door and points; the narrator lays the book on the table and gets up; the wind; the door
    // swings open by itself: Madeline on the threshold, bloodied, swaying; lightning; close: her, her hand coming up
    door_opens: {
      after: 'confess',
      from: () => ({ ...reading, rock: 0, narrator_do: loop('sit_hands'), narrator_look: 'roderick', roderick_do: 'stand', roderick_a: BEFORE_CHAIR[0], roderick_d: BEFORE_CHAIR[1], roderick_turn: toward(BEFORE_CHAIR, SEAT), roderick_look: 'narrator', closeup: 1, shot: 'rod_confess' }),
      run: async (s) => {
        const nar = s.person('narrator'), rod = s.person('roderick'), mad = s.person('madeline');
        await outOf(s);
        // (out of the close-up, he turns to the door: the game's «Безумец!…» from here)
        s.tell('door_opens:out');
        await s.wait(0.3);
        rod.turn(toward(BEFORE_CHAIR, DOOR_AT));
        rod.look(DOOR_AT);
        await s.wait(0.3);
        rod.reach({ r: [DOOR_AT[0], DOOR_AT[1], 1.45] });
        await s.wait(0.3);
        // (the book laid on the table by the candle)
        nar.reach({ r: [CANDLE[0] - 0.12, CANDLE[1] - 0.04, 0.76] });
        await s.wait(0.5);
        nar.with(null);
        await s.wait(0.1);
        nar.reach(null);
        await s.wait(0.1);
        nar.look(DOOR_AT);
        await nar.go('rise', { from: SEAT, turn: AT_TABLE });
        nar.turn(toward(stood(), BEFORE_CHAIR));
        await s.wait(0.5);
        s.move('wind', 0.4, { over: 1.2 });
        await s.wait(0.3);
        s.move('door', 1, { over: 3.2, ease: 'inOut' });
        await s.wait(0.4);
        mad.here();
        mad.look('roderick');
        await s.wait(0.8);
        pulse(s, 'lightning', 0.75, 1.5);
        pulse(s, 'shudder', 0.6, 1.5);
        const next = closeUp(s, 'mad_door');
        await s.wait(1.0);
        // (the arm sinks a little, still at the door)
        rod.reach({ r: [DOOR_AT[0], DOOR_AT[1], 0.9] });
        await s.wait(1.0);
        nar.look('madeline');
        await s.wait(1.0);
        next.cut();
        await s.wait(0.5);
        await s.move('cu_reach', 0.7, { over: 3.0, ease: 'inOut' });
      },
    },
    // ---- She staggers in; they reach (rod_reach / mad_reach / rod_to_mad / mad_to_rod — set by the game); close: the
    // hands
    hands: {
      after: 'door_opens',
      from: () => ({ ...risen(), roderick_look: DOOR_AT, roderick_reach: { r: [DOOR_AT[0], DOOR_AT[1], 0.9] }, ...threshold, closeup: 1, shot: 'mad_door' }),
      run: async (s) => {
        const nar = s.person('narrator'), rod = s.person('roderick'), mad = s.person('madeline');
        await outOf(s);
        await s.wait(0.3);
        const comes = mad.walk([[0.02, 6.2], IN_ROOM]);
        rod.reach(null);
        const next = s.shot({ closeup: 1, shot: 'hands' });
        await s.wait(0.5);
        rod.look('madeline');
        await s.wait(0.2);
        nar.turn(toward(stood(), IN_ROOM));
        await comes;
        mad.turn(toward(IN_ROOM, BEFORE_CHAIR));
        await s.wait(0.2);
        next.cut();
        await s.wait(0.9);
      },
    },
    // ---- She falls on her brother: she lurches to him, falls on him, her arms round his neck; he steps in, catches
    // her and is borne back a step; she goes down first, he with her: both sink to their knees; he bows his head over her
    collapse: {
      after: 'hands',
      from: () => ({ ...risen(), ...inRoom, closeup: 1, shot: 'hands' }),
      run: async (s) => {
        const rod = s.person('roderick'), mad = s.person('madeline');
        await outOf(s);
        for (const k of ['rod_reach', 'mad_reach', 'rod_to_mad', 'mad_to_rod']) s.move(k, 0, { over: 0.5 });
        await s.wait(0.2);
        // (each to where their motion begins, so that it ends at the meeting: he there before her, opening his arms as
        // she comes; she lurches the last steps onto him)
        const mEnd = meet('madeline'), rEnd = meet('roderick'), mo = off('madeline', 'lean_fall', FALL), ro = off('roderick', 'catch_step', FALL + 180);
        await s.all(
          rod.walk([[rEnd[0] + ro.across, rEnd[1] + ro.distance]]).then(() => s.person('roderick').turn(ro.turn)),
          mad.walk([[mEnd[0] + mo.across, mEnd[1] + mo.distance]]).then(() => s.person('madeline').turn(mo.turn)),
        );
        const catches = rod.go('catch_step', { to: rEnd, turn: FALL + 180 });
        await s.wait(0.4);
        const falls = mad.go('lean_fall', { to: mEnd, turn: FALL });
        await falls.ending(0.4);
        mad.reach({ r: 'roderick#nape', l: 'roderick#nape' });
        await s.wait(0.3);
        rod.reach({ r: 'madeline#back', l: 'madeline#back' });
        await s.wait(0.1);
        pulse(s, 'shudder', 0.7, 1.4);
        await s.wait(0.1);
        mad.look('roderick#shoulder_l');
        await s.wait(0.1);
        rod.look('madeline#nape');
        await s.all(falls, catches);
        // down together: she first
        const down = mad.go('kneel_slow', { from: mEnd, turn: FALL });
        await s.wait(0.3);
        const down2 = rod.go('kneel_slow', { from: rEnd, turn: FALL + 180 });
        await s.wait(0.5);
        s.set('fallen', 1);
        await down;
        mad.do('kneel_hold', { loop: true });
        await down2;
        rod.do('kneel_hold', { loop: true });
        await s.wait(1.5);
      },
    },
    // ---- The narrator runs out to the left — whoever he took (with_madeline, with_roderick) runs behind him; whoever
    // is left sinks to the floor; the room shakes, the crack splits open on the red moon, the candle goes out
    flee: {
      after: ['collapse', 'hands'],
      from: () => ({ ...risen(), ...inRoom, narrator_look: null }),
      run: async (s) => {
        const nar = s.person('narrator');
        if (s.state.closeup) await outOf(s);
        s.move('quake', 0.5, { over: 0.6 });
        const end = ruin(s);
        await s.wait(0.2);
        nar.look(null);
        nar.gait('run');
        await s.wait(0.1);
        const out = nar.walk([[-2.2, 3.4], [-3.9, 2.5]]);
        await s.wait(0.1);
        leftBehind(s);
        await out;
        nar.here(false);
        await end;
      },
    },
    // ---- Or he stays where he stands: the same end of the room around him; to black
    stay: {
      after: ['collapse', 'hands'],
      from: () => ({ ...risen(), ...inRoom, narrator_look: 'madeline' }),
      run: async (s) => {
        if (s.state.closeup) await outOf(s);
        s.move('quake', 0.5, { over: 0.6 });
        const end = ruin(s);
        await s.wait(0.4);
        leftBehind(s);
        await s.wait(5.0);
        await s.move('fade', 1, { over: 3.0, ease: 'in' });
        await end;
      },
    },
  };
}

return {
  film, SHOWCASE, N, WX, DH, DT, CANDLE, SPOT, LAMP_DOWN, PUT_AT, DOOR, CASE,
  wall, fissure, fissureMotion, door, corridor, doorGap, doorGapMotion, feet, feetMotion, windowFrame, casement, curtain,
  curtainMotion, floor, table, tableTop, candle, flame, flameMotion, seat, chair, book, bookMotion, sky, skyMotion, clear, rippleMotion, closeup, closeupNow,
};
