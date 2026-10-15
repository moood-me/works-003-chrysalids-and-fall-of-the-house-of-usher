// Мэдлин проходит — the gallery, built in the world's metres: across (X, right of the gallery's axis; the walls at ±W),
// distance (Z, ahead of where the eye stands at the start), elevation (Y, up from the floor). Every surface is a card or a
// plane where it truly is — the engine lays the perspective, the light through the windows, the haze, the reflections:
// nothing here knows where the eye is. And the film in beats (FILM, the world's module beats) — at the end.
const W = 3.3, // the walls: across ±W
  CE = 11, // the ceiling
  Z0 = 4.1, // the first arch; then one every BAY metres
  BAY = 4.6,
  BAYS = 17,
  END = 82, // the end wall
  BACK = -3, // the walls and the floor begin this far behind the eye's start
  DEEP = 1, // an arch is a wall this thick
  HW = 2.5, // half the arch's opening
  SPRING = 5; // where its pointed arc springs from the piers
const bay = (k) => Z0 + BAY * k;
// the doorways in the left wall, [distance from, to]: she comes out of the first (bay 3) and goes into the second (bay 5)
const DOOR_BAYS = [3, 5];
const DOORS = DOOR_BAYS.map((k) => [bay(k) + 1.5, bay(k) + 3.5]);
const DOOR_SPRING = 3.0, DOOR_TOP = 3.7;
const ROOM = 4.2; // how deep the dark rooms behind the doorways are (past the wall)
const hx = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const rgb = (c, a = 1) => `rgba(${hx(c).join(",")},${a})`;
// colour c warmed toward the low sun's (w 0…1)
const warmed = (c, w) =>
  "#" + hx(c).map((v, i) => Math.round(v + ([214, 168, 112][i] - v) * w * 0.75).toString(16).padStart(2, "0")).join("");

// A pointed window of bay k in the right wall, as [distance, elevation] points: the sill at 1.4 m, the arc from 5.6 m.
// n points a side on its arc (8: as it is painted; 1: the pane the light comes through — the engine takes 8 points a pane)
function windowOf(k, n = 8) {
  const Z1 = bay(k) + 1.5, Z2 = bay(k) + 4, hz = (Z2 - Z1) / 2, Zm = Z1 + hz, r = 1.6 * hz, cx = -hz + r,
    a1 = Math.atan2(Math.sqrt(r * r - cx * cx), -cx), p = [[Z1, 1.4]];
  for (let i = 0; i <= n; i++) {
    const a = Math.PI + ((a1 - Math.PI) * i) / n;
    p.push([Zm + cx + r * Math.cos(a), 5.6 + r * Math.sin(a)]);
  }
  for (let i = n - 1; i >= 0; i--) {
    const a = Math.PI + ((a1 - Math.PI) * i) / n;
    p.push([Zm - cx - r * Math.cos(a), 5.6 + r * Math.sin(a)]);
  }
  p.push([Z2, 1.4]);
  return p;
}
const WINDOW_BAYS = Array.from({ length: BAYS - 1 }, (_, i) => i + 1);
// The arch's opening, [x, y] (y up): from the left pier's foot up its arc to the point, down the other side
const R_ARC = HW * 1.6, CX_ARC = -HW + R_ARC, A_TOP = Math.atan2(Math.sqrt(R_ARC * R_ARC - CX_ARC * CX_ARC), -CX_ARC);
// a point of the left arc, u 0 (the springing) … 1 (the point); the right one is its mirror
const arcAt = (u) => {
  const a = Math.PI + (A_TOP - Math.PI) * u;
  return [CX_ARC + R_ARC * Math.cos(a), SPRING + R_ARC * Math.sin(a)];
};
const APEX = arcAt(1)[1];
function opening(n = 16) {
  const p = [[-HW, 0]];
  for (let i = 0; i <= n; i++) p.push(arcAt(i / n));
  for (let i = n - 1; i >= 0; i--) { const [x, y] = arcAt(i / n); p.push([-x, y]); }
  p.push([HW, 0]);
  return p;
}
// the soffit's arc in strips: ARC_STRIPS a side, each a card leaning over the opening
const ARC_STRIPS = 4;
const strip = (i) => {
  const [x0, y0] = arcAt(i / ARC_STRIPS), [x1, y1] = arcAt((i + 1) / ARC_STRIPS);
  return { x: x0, y: y0, len: Math.hypot(x1 - x0, y1 - y0), lean: (Math.atan2(x1 - x0, y1 - y0) * 180) / Math.PI };
};

// ---- painting helpers (g in metres, y down)
const path = (g, pts, flip = -1) => {
  pts.forEach(([x, y], i) => (i ? g.lineTo(x, flip * y) : g.moveTo(x, flip * y)));
  g.closePath();
};
const line = (g, x0, y0, x1, y1) => { g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); };
// stone: its colour, a little uneven in big soft patches (seeded by the element), and its courses' joints
const STONE = "#7f898e", STONE_DK = "#5b6569", JOINT = "rgba(10,14,16,0.32)", JOINT_LT = "rgba(150,165,172,0.10)";
function stone(g, e, x0, y0, x1, y1, o = {}) {
  g.save();
  g.beginPath();
  g.rect(x0, y0, x1 - x0, y1 - y0);
  g.clip();
  g.fillStyle = o.color || STONE;
  g.fillRect(x0, y0, x1 - x0, y1 - y0);
  // patches of damp and soot
  const n = Math.round(((x1 - x0) * (y1 - y0)) / 6);
  for (let i = 0; i < n; i++) {
    const cx = x0 + e.rnd() * (x1 - x0), cy = y0 + e.rnd() * (y1 - y0), r = 0.6 + e.rnd() * 2.2;
    const rg = g.createRadialGradient(cx, cy, 0, cx, cy, r);
    const dark = e.rnd() < 0.6;
    rg.addColorStop(0, dark ? "rgba(20,26,29,0.22)" : "rgba(120,134,140,0.12)");
    rg.addColorStop(1, dark ? "rgba(20,26,29,0)" : "rgba(120,134,140,0)");
    g.fillStyle = rg;
    const l = Math.max(x0, cx - r), t = Math.max(y0, cy - r);
    g.fillRect(l, t, Math.min(x1, cx + r) - l, Math.min(y1, cy + r) - t);
  }
  // the courses: rows `course` high, blocks staggered
  const course = o.course || 0.62, block = o.block || 1.1;
  g.lineWidth = 0.022;
  for (let y = y1 - course, r = 0; y > y0 + 0.05; y -= course, r++) {
    g.strokeStyle = JOINT;
    line(g, x0, y, x1, y);
    g.strokeStyle = JOINT_LT;
    line(g, x0, y + 0.02, x1, y + 0.02);
    g.strokeStyle = JOINT;
    for (let x = x0 + (r % 2 ? block / 2 : 0) + e.rnd() * 0.2; x < x1; x += block * (0.8 + 0.4 * e.rnd())) line(g, x, y, x, Math.min(y1, y + course));
  }
  g.restore();
}

// ---- the arches. A cross wall at bay(k), facing the start: the gallery's section with the pointed opening cut out,
// its stone, the impost mouldings at the springing, a stone shield on the left pier of arches 2 and 4.
function arch(g, e) {
  const k = Number(e.id.slice(4));
  g.save();
  g.beginPath();
  path(g, [[-W, 0], [-W, CE], [W, CE], [W, 0]]);
  path(g, opening());
  g.clip("evenodd");
  stone(g, e, -W, -CE, W, 0);
  // the piers' feet darker with the floor's damp; the wall high up lost in the dark
  let gr = g.createLinearGradient(0, -CE, 0, 0);
  gr.addColorStop(0, "rgba(8,12,14,0.55)");
  gr.addColorStop(0.4, "rgba(8,12,14,0)");
  gr.addColorStop(0.9, "rgba(8,12,14,0)");
  gr.addColorStop(1, "rgba(8,12,14,0.35)");
  g.fillStyle = gr;
  g.fillRect(-W, -CE, 2 * W, CE);
  // the voussoirs round the opening: a ring of stones, their joints pointing to the arc's centres
  g.strokeStyle = JOINT;
  g.lineWidth = 0.025;
  for (const s of [-1, 1]) {
    for (let i = 0; i <= 10; i++) {
      const u = i / 10, [x, y] = arcAt(u), cx = CX_ARC, nx = x - cx, ny = y - SPRING, l = Math.hypot(nx, ny);
      line(g, s * x, -y, s * (x + (nx / l) * 0.55), -(y + (ny / l) * 0.55));
    }
    // the ring's outer edge
    g.beginPath();
    for (let i = 0; i <= 20; i++) {
      const [x, y] = arcAt(i / 20), nx = x - CX_ARC, ny = y - SPRING, l = Math.hypot(nx, ny);
      const X = s * (x + (nx / l) * 0.55), Y = -(y + (ny / l) * 0.55);
      i ? g.lineTo(X, Y) : g.moveTo(X, Y);
    }
    g.stroke();
  }
  // the impost mouldings: a ledge at the springing, lit on its top edge
  for (const [a, b] of [[-W, -HW], [HW, W]]) {
    g.fillStyle = STONE_DK;
    g.fillRect(a, -SPRING - 0.08, b - a, 0.16);
    g.fillStyle = "rgba(150,165,172,0.25)";
    g.fillRect(a, -SPRING - 0.09, b - a, 0.025);
  }
  if (k === 2 || k === 4) {
    g.fillStyle = STONE_DK;
    g.beginPath();
    g.moveTo(-3.15, -3.9);
    g.lineTo(-2.75, -3.9);
    g.quadraticCurveTo(-2.75, -3.45, -2.95, -3.28);
    g.quadraticCurveTo(-3.15, -3.45, -3.15, -3.9);
    g.fill();
    g.strokeStyle = "rgba(150,165,172,0.18)";
    g.lineWidth = 0.015;
    g.stroke();
  }
  g.restore();
}
// The soffit — the opening's inner faces, DEEP metres through the wall: arch<k>_pl / _pr, the piers' inner faces (cards
// facing across the gallery, x 0…DEEP along it), arch<k>_l<i> / _r<i>, the strips of its arc (leaning over the opening).
// Its stones' joints run across it.
function soffit(g, e) {
  const pier = /_p[lr]$/.test(e.id), h = pier ? SPRING : strip(Number(e.id.slice(-1))).len + 0.02;
  stone(g, e, 0, -h, DEEP, 0, { course: pier ? 0.62 : h + 1, block: DEEP + 1 });
  if (!pier) {
    g.strokeStyle = JOINT;
    g.lineWidth = 0.02;
    line(g, 0, -h, DEEP, -h);
  }
  // the edges toward the faces of the wall, worn and lighter
  g.fillStyle = "rgba(150,165,172,0.12)";
  g.fillRect(0, -h, 0.04, h);
  g.fillRect(DEEP - 0.04, -h, 0.04, h);
}

// ---- the crack up the right pier of arch 2: painted whole, twice (thin, as it starts; wide, as it is all it can be),
// its shader showing as much of it as `crack` has run and as wide (its animate: lib.crackNow)
const CRACK = [[3.1, 2.2], [3.22, 2.8], [3.0, 3.3], [3.15, 3.9], [2.95, 4.5], [3.08, 5.1], [2.8, 5.8], [2.95, 6.4], [2.55, 7.1],
  [2.68, 7.7], [2.15, 8.5], [2.3, 9.1], [1.8, 9.8], [1.95, 10.6]];
function crack(g, e) {
  const draw = (wide) => (q) => {
    const ln = (pts) => { q.beginPath(); pts.forEach(([x, y], i) => (i ? q.lineTo(x, -y) : q.moveTo(x, -y))); q.stroke(); };
    q.lineJoin = "miter";
    q.strokeStyle = "rgba(150,168,176,0.45)";
    q.lineWidth = 0.02 * wide;
    ln(CRACK.map(([x, y]) => [x + 0.04, y - 0.03]));
    q.strokeStyle = "rgba(4,8,10,0.9)";
    q.lineWidth = 0.03 * wide;
    ln(CRACK);
    q.lineWidth = 0.018 * wide;
    ln([[2.95, 4.5], [W, 4.2]]);
    ln([[2.55, 7.1], [2.9, 7.5]]);
  };
  e.layer("thin", {}, draw(0.6));
  e.layer("wide", {}, draw(1.2));
}
// how high the crack has run (metres) and how wide it is (0…1), for `crack` 0…1
function crackNow(c) {
  const v = Math.max(0, Math.min(1, typeof c === "number" ? c : 0)), run = v * (CRACK.length - 1), n = Math.min(CRACK.length - 2, Math.floor(run));
  const [, y0] = CRACK[n], [, y1] = CRACK[n + 1];
  return { reach: v <= 0.001 ? 0 : y0 + (y1 - y0) * (run - n), wide: v };
}

// ---- the walls. The left one: a card facing right (into the gallery), its x along the gallery from BACK; the doorways of
// bays 3 and 5 cut out of it, in the other bays panels of darker stone. The right one: facing left, its x from END back
// toward the eye; the pointed windows cut out of it.
const LEFT_X = (z) => z - BACK, RIGHT_X = (z) => END - z;
function leftWall(g, e) {
  const L = END - BACK;
  g.save();
  g.beginPath();
  path(g, [[0, 0], [0, CE], [L, CE], [L, 0]]);
  for (const [a, b] of DOORS) path(g, [[LEFT_X(a), 0], [LEFT_X(a), DOOR_SPRING], [LEFT_X((a + b) / 2), DOOR_TOP], [LEFT_X(b), DOOR_SPRING], [LEFT_X(b), 0]]);
  g.clip("evenodd");
  stone(g, e, 0, -CE, L, 0);
  for (let k = 1; k < BAYS; k++) {
    const x0 = LEFT_X(bay(k) + 1.4), x1 = LEFT_X(bay(k) + 4.1);
    if (DOOR_BAYS.includes(k)) {
      // the doorway's surround: a band of dressed stone round it
      const [a, b] = DOORS[DOOR_BAYS.indexOf(k)];
      g.strokeStyle = STONE_DK;
      g.lineWidth = 0.22;
      g.beginPath();
      path(g, [[LEFT_X(a) - 0.11, 0], [LEFT_X(a) - 0.11, DOOR_SPRING], [LEFT_X((a + b) / 2), DOOR_TOP + 0.16], [LEFT_X(b) + 0.11, DOOR_SPRING], [LEFT_X(b) + 0.11, 0]]);
      g.stroke();
      continue;
    }
    g.fillStyle = "#6a7572";
    g.fillRect(x0, -5.3, x1 - x0, 4.2);
    g.strokeStyle = "rgba(10,14,16,0.4)";
    g.lineWidth = 0.03;
    g.strokeRect(x0, -5.3, x1 - x0, 4.2);
    for (let j = 0; j < 4; j++) {
      g.fillStyle = "rgba(120,132,128,0.35)";
      g.fillRect(x0 + 0.2, -(1.7 + j * 0.95) - 0.07, x1 - x0 - 0.4, 0.07);
    }
  }
  g.restore();
}
function rightWall(g, e) {
  const L = END - BACK;
  g.save();
  g.beginPath();
  path(g, [[0, 0], [0, CE], [L, CE], [L, 0]]);
  for (const k of WINDOW_BAYS) path(g, windowOf(k).map(([z, y]) => [RIGHT_X(z), y]));
  g.clip("evenodd");
  stone(g, e, 0, -CE, L, 0);
  // each window's splay: a frame of dressed stone round it
  g.strokeStyle = STONE_DK;
  g.lineWidth = 0.18;
  for (const k of WINDOW_BAYS) {
    g.beginPath();
    path(g, windowOf(k).map(([z, y]) => [RIGHT_X(z), y]));
    g.stroke();
  }
  g.restore();
}
// The windows' glass, just outside the right wall (glowing: the light outside, its own): the pale evening sky in it (or
// the low warm sun of another day), brighter about the arc; its leading in diamond quarries; the mullion.
function glass(g, e) {
  const S = e.state, warm = typeof S.low_sun === "number" ? S.low_sun : 0, shafts = typeof S.light_shafts === "number" ? S.light_shafts : 1;
  const sky = warmed("#b4c4cb", warm), glow = warmed("#e2ebee", warm), lead = "rgba(20,28,32,0.75)";
  for (const k of WINDOW_BAYS) {
    const w = windowOf(k).map(([z, y]) => [RIGHT_X(z), y]), Z1 = bay(k) + 1.5, Z2 = bay(k) + 4, xm = RIGHT_X((Z1 + Z2) / 2);
    g.save();
    g.beginPath();
    path(g, w);
    g.clip();
    g.fillStyle = rgb(sky, 0.35 + 0.65 * shafts);
    g.fillRect(RIGHT_X(Z2), -8, Z2 - Z1, 7);
    const rg = g.createRadialGradient(xm, -4.6, 0, xm, -4.6, 3.2);
    rg.addColorStop(0, rgb(glow, 0.55 * shafts));
    rg.addColorStop(1, rgb(glow, 0));
    g.fillStyle = rg;
    g.fillRect(RIGHT_X(Z2), -8, Z2 - Z1, 7);
    // the leading: lines rising a metre a metre each way, 0.42 m apart
    g.strokeStyle = lead;
    g.lineWidth = 0.018;
    const x0 = RIGHT_X(Z2), x1 = RIGHT_X(Z1);
    // (each cut to the window's span: X from a to b on a line rising one a metre)
    for (let c = x0 - 6.5; c < x1; c += 0.42) {
      const a = Math.max(c, x0), b = Math.min(c + 6.5, x1);
      if (b <= a) continue;
      line(g, a, -1.4 - (a - c), b, -1.4 - (b - c));
      line(g, a, -1.4 - (c + 6.5 - a), b, -1.4 - (c + 6.5 - b));
    }
    // the mullion and the frame
    g.strokeStyle = "rgba(14,20,24,1)";
    g.lineWidth = 0.07;
    line(g, xm, -1.4, xm, -6.6);
    g.restore();
    g.strokeStyle = "rgba(14,20,24,1)";
    g.lineWidth = 0.06;
    g.beginPath();
    path(g, w);
    g.stroke();
  }
}

// ---- the floor (a plane: seen from above, y toward the start): flags of stone, worn smooth, a faint polish that mirrors
// the windows and the candle (its "reflect"); the ceiling (a plane facing down): dark stone, its transverse ribs over the
// arches; the end wall
function floor(g, e) {
  const L = END - BACK, y0 = -L / 2;
  g.fillStyle = "#6c767a";
  g.fillRect(-W, y0, 2 * W, L);
  // flags: rows across, each its own shade
  for (let y = y0, r = 0; y < -y0; y += 0.9, r++) {
    for (let x = -W + (r % 2 ? 0.55 : 0); x < W; x += 1.1) {
      g.fillStyle = `rgba(${e.rnd() < 0.5 ? "20,26,29" : "110,122,128"},${(0.04 + e.rnd() * 0.1).toFixed(3)})`;
      g.fillRect(x, y, 1.1, 0.9);
    }
  }
  g.strokeStyle = "rgba(12,16,18,0.45)";
  g.lineWidth = 0.015;
  for (let y = y0, r = 0; y < -y0; y += 0.9, r++) {
    line(g, -W, y, W, y);
    for (let x = -W + (r % 2 ? 0.55 : 0); x < W; x += 1.1) line(g, x, y, x, y + 0.9);
  }
  // worn along the middle, where they walk
  const gr = g.createLinearGradient(-W, 0, W, 0);
  gr.addColorStop(0, "rgba(16,20,22,0.35)");
  gr.addColorStop(0.3, "rgba(16,20,22,0)");
  gr.addColorStop(0.7, "rgba(16,20,22,0)");
  gr.addColorStop(1, "rgba(16,20,22,0.35)");
  g.fillStyle = gr;
  g.fillRect(-W, y0, 2 * W, L);
}
function ceiling(g, e) {
  const L = END - BACK, y0 = -L / 2;
  g.fillStyle = "#566065";
  g.fillRect(-W, y0, 2 * W, L);
  g.strokeStyle = "rgba(10,14,16,0.4)";
  g.lineWidth = 0.02;
  for (let y = y0; y < -y0; y += 0.62) line(g, -W, y, W, y);
}
function endWall(g, e) {
  stone(g, e, -W, -CE, W, 0, { color: "#717c81" });
}
// the dark rooms past the doorways: their floors, walls and ceilings in one dark stone (a wall: w wide, h high from its
// foot; a plane: w across, h deep, round its centre)
function room(g, e, w, h, plane) {
  g.fillStyle = "#262d30";
  if (plane) g.fillRect(-w / 2, -h / 2, w, h);
  else g.fillRect(0, -h, w, h);
}

// ---- the candle in its bracket on the left wall, past her doorway (a card facing the eye, 0.12 m off the wall): the iron
// arm out of the wall, the cup, the candle; its flame a layer of its own that the animate sways and trembles; its glow
// the engine's (e.light, the light "candle" of it), out with `sconce`
function sconce(g, e) {
  const on = typeof e.state.sconce === "number" ? e.state.sconce : 1;
  g.strokeStyle = "#0a0f11";
  g.lineWidth = 0.05;
  g.beginPath();
  g.moveTo(-0.12, 0.35);
  g.quadraticCurveTo(-0.02, 0.3, 0, 0.05);
  g.stroke();
  g.fillStyle = "#0a0f11";
  g.fillRect(-0.07, 0, 0.14, 0.06);
  g.fillStyle = "rgba(205,192,168,0.9)";
  g.fillRect(-0.025, -0.2, 0.05, 0.2);
  if (on < 0.01) return;
  e.layer("flame", { pivot: [0, -0.21], blend: "add" }, (q) => {
    const rg = q.createRadialGradient(0, -0.27, 0, 0, -0.27, 0.07);
    rg.addColorStop(0, `rgba(255,236,190,${on})`);
    rg.addColorStop(0.45, `rgba(255,190,110,${0.85 * on})`);
    rg.addColorStop(1, "rgba(255,150,70,0)");
    q.fillStyle = rg;
    q.beginPath();
    q.ellipse(0, -0.27, 0.028, 0.06, 0, 0, 6.283);
    q.fill();
    e.light(0, -0.28, 0.05, "#f0b070", 0.8 * on, "flame");
  });
}
function sconceLive(e) {
  const m = e.mem, a = e.anim;
  m.p = (m.p ?? 0) + e.dt;
  const f = e.layer("flame");
  if (!f) return;
  f.rotate = 0.08 * a.noise(m.p * 0.9, 3);
  f.scaleY = 1 + 0.12 * a.noise(m.p * 2.3, 7);
  f.scaleX = 1 - 0.05 * a.noise(m.p * 2.3, 7);
}

// ---- the close-ups (the world's module closeups: an insert over the gallery). closeup(S) — the picture, painted once as
// the shot is chosen (`closeup`, `shot`: whose face); closeupNow(S) — all that moves in it, never repainting: the head's
// turn (`cu_turn` −1…1, + toward the window: the face's `to`), the tear (`cu_tear`), the breath (`cu_inhale`), a blink by
// hand (`cu_blink`; 0 — by itself), the lips (`speak`), her catalepsy (`madeline_still`), his hands over his face.
// (Madeline is painted turned to him, −0.1, and turns toward the window as far as `to` says: 1 at cu_turn 1.)
const MAD_TURN = -0.1;
function closeup(S) {
  const SHOTS = {
    // his face in his long fingers, tears running through them
    roderick: { light: "window", faces: [{ who: "roderick", grief: 1, hands: "face", tear: 1 }] },
    // the eyes open, the breath stopped, a tear crawling; then alive, whispering
    madeline: { light: "window", faces: [{ who: "madeline", frozen: 1, eyes: 1, tear: 1, turn: MAD_TURN, to: [{ turn: 1 }] }] },
    // the spectacles, the sly perplexed eyes, in the low warm sun of another day
    doctor: { light: { like: "window", color: "#c8b096" }, faces: [{ who: "doctor", sly: 0.7, smile: 0.3, tilt: 0.2, turn: 0.3 }] },
  };
  return SHOTS[S.shot] || null;
}
function closeupNow(S) {
  const face = { speak: S.speak ? 1 : 0, inhale: S.cu_inhale || 0, tear: S.cu_tear || 0, blink: S.cu_blink > 0 ? S.cu_blink : undefined };
  if (S.shot === "roderick") return { roderick: { ...face, cover: 1 } };
  if (S.shot === "madeline") {
    const u = Math.max(0, Math.min(1, ((S.cu_turn || 0) - MAD_TURN) / (1 - MAD_TURN)));
    return { madeline: { ...face, frozen: S.madeline_still ? 1 : 0, to: [u] } };
  }
  return { doctor: face };
}

// ================================================================================================================
// The film — the gallery's evening and the doctor's day in beats (the world's module beats; notes.md lists them). The
// game plays them by the `beat` key (script.js); outside games the showcase plays them all (showcase.js). Places are
// [across, distance]; turns in degrees: 0 away from us, 90 to the right, 180 toward us.
const toward = ([a, d], [a2, d2]) => (Math.atan2(a2 - a, d2 - d) * 180) / Math.PI;
const at = (id, [a, d]) => ({ [`${id}_a`]: a, [`${id}_d`]: d });
const person = (id, place, turn, more = {}) => ({
  ...at(id, place), [`${id}_turn`]: turn, [`${id}_do`]: "stand", [`${id}_look`]: null, [`${id}_reach`]: null,
  [`${id}_still`]: false, [`${id}_here`]: true, ...more,
});
// not in the gallery (come later, gone): not drawn; kept by a doorway
const away = (id, place = DOOR3) => ({ ...person(id, place, 90), [`${id}_here`]: false });
// a close-up face at rest
const FACE = { speak: 0, cu_turn: 0, cu_tear: 0, cu_inhale: 0, cu_blink: 0 };
const EVENING = { fade: 0, camera_x: 0, camera_z: 0, low_sun: 0, light_shafts: 1, sconce: 1, closeup: 0, shot: "roderick", ...FACE };
// in the dark of the doorways, past the wall (DOORS): she comes out of the first, goes into the second
const DOOR3 = [-4.6, 20.4], DOOR5 = [-4.8, 29.6];
// the two of them at the start, their backs to us
const FRIEND = [-1.15, 2.7], RODERICK = [0.75, 3.4];
const TOGETHER = { ...person("narrator", FRIEND, 0), ...person("roderick", RODERICK, 355) };
// Roderick turned away from her, weeping, his face in his hands; his friend looking round at him
const TURNED = { ...TOGETHER, roderick_turn: 165, roderick_do: { motion: "weep", loop: true }, narrator_look: "roderick" };
// she stops in the light by the window, turned to it, not seeing them; on into its full light; half a step more
const STOP = [0.3, 23.0], LIT = [1.3, 23.9], HALF = [1.5, 24.05];
const madeline = (place, turn, more) => person("madeline", place, turn, { madeline_do: "still", ...more });
const STOPPED = madeline(STOP, 110);
// her way from the first doorway to the window, and from the window into the second doorway
const MAD_IN = [[-3.0, 20.6], [-1.8, 21.6], [-0.5, 22.5], STOP];
const OUT_GONE = [[0.4, 26.2], [-2.3, 29.4], [-3.6, 29.8], DOOR5], OUT_STAY = [[0.2, 26.2], [-2.3, 29.2], [-3.6, 29.7], DOOR5];
// the narrator after her, a few steps behind; she in the full light by the window
const BEHIND = [-0.5, 20.8];
const NEAR = { ...EVENING, camera_x: -0.3, camera_z: 18.0, ...TOGETHER, ...person("narrator", BEHIND, 15) };
const LITUP = madeline(LIT, 100);
// another day: the low sun; the narrator alone, farther down the gallery; the doctor beside him
const ALONE = [-0.9, 13.6], DOCTOR = [0.25, 14.6];
const DAY = {
  ...EVENING, low_sun: 1, light_shafts: 0.85, camera_x: -0.2, camera_z: 11, shot: "doctor",
  ...person("narrator", ALONE, 0), ...away("roderick", [0, -6]), ...away("madeline"), ...away("doctor"),
};
const BESIDE = {
  ...DAY, narrator_turn: toward(ALONE, DOCTOR), narrator_look: "doctor",
  ...person("doctor", DOCTOR, toward(DOCTOR, ALONE), { doctor_look: "narrator", doctor_do: { motion: "lean_in", from: 3.9 } }),
};
// a close-up of `shot` (the insert opened over the scene, the camera where it was)
const CLOSE = (shot, o = {}) => ({ ...FACE, closeup: 1, shot, ...o });
// the doctor's way out of the first doorway toward the narrator (the last step his lean_in's), and back into it
const DOCTOR_IN = [[-3.1, 20.6], [-1.8, 19.8], [0.0, 16.6]], DOCTOR_OUT = [[-0.4, 17.4], [-2.0, 19.9], [-3.6, 20.5], DOOR3];

const FILM = {
  // ---- She passes in the depth. Out of the dark: the narrator and Roderick, their backs to us, at the start of the gallery.
  // Out of the first doorway on the left comes Madeline, slowly, as if asleep, across through the windows' light; Roderick
  // raises his head to her, his head drops; he turns away toward us and hides his face in his hands; his friend looks round
  // at him. She stops in the light by a window and turns to it, not seeing them.
  pass: {
    from: () => ({ ...EVENING, ...TOGETHER, fade: 1, ...madeline(DOOR3, 85), ...away("doctor") }),
    run: async (s) => {
      const rod = s.person("roderick"), friend = s.person("narrator");
      s.move("fade", 0, { over: 2.5, ease: "out" });
      await s.all(
        s.sequence(async (q) => {
          await q.wait(0.3);
          await q.person("madeline").walk(MAD_IN);
          await q.person("madeline").turn(110);
        }),
        s.sequence(async (q) => {
          // he sees her come out of the dark
          await q.until(() => q.state.madeline_a > -3.4);
          rod.look("madeline");
          await q.wait(1.7);
          friend.look("madeline");
          await q.wait(2);
          // the head drops; he turns his back on her and covers his face
          rod.look([0.5, 5.2, 0]);
          await q.wait(0.8);
          await q.person("roderick").turn(165);
          rod.look(null);
          q.person("roderick").do("weep");
          // (his hands at his face: on in the weeping's loop)
          await q.wait(1.4);
          q.person("roderick").do("weep", { loop: true });
          await q.wait(0.2);
          friend.look("roderick");
        }),
      );
      await s.wait(0.8);
    },
  },
  // ---- Close: his face in his long fingers, the tears running through them; back to the gallery.
  weep: {
    after: "pass",
    from: () => ({ ...EVENING, ...TURNED, ...STOPPED, ...away("doctor") }),
    run: async (s) => {
      const close = s.shot(CLOSE("roderick"));
      await s.wait(0.6);
      close.cut();
      await s.wait(0.8);
      await s.move("cu_tear", 1, { over: 3.8, ease: "inOut" });
      s.set("closeup", 0);
      s.set("cu_tear", 0);
      await s.wait(1.4);
    },
  },
  // ---- The narrator goes after her down the gallery, the eye with him, leaving Roderick on the right; cut: he a few steps
  // behind her, she goes on into the full light of the window and stands facing it; he stops.
  follow: {
    after: "weep",
    from: () => ({ ...EVENING, ...TURNED, ...STOPPED, ...away("doctor") }),
    run: async (s) => {
      const friend = s.person("narrator");
      const behind = s.shot({ camera_x: -0.3, camera_z: 17.8, ...at("narrator", [-1.0, 19.5]), narrator_look: null });
      friend.look(null);
      await s.wait(0.3);
      friend.walk([[-1.0, 4.4], [-0.7, 7.2]]);
      await s.wait(0.2);
      s.move("camera_z", 3.0, { over: 3.3, ease: "in" });
      await s.move("camera_x", -1.0, { over: 3.4, ease: "inOut" });
      behind.cut();
      await s.all(
        s.sequence(async (q) => {
          await q.person("narrator").walk([BEHIND]);
          q.move("camera_z", 18.0, { over: 2.4, ease: "inOut" });
          await q.person("narrator").turn(15);
        }),
        s.sequence(async (q) => {
          await q.wait(0.1);
          await q.person("madeline").walk([[0.8, 23.5], LIT]);
          await q.person("madeline").turn(100);
        }),
      );
      await s.wait(0.6);
    },
  },
  // ---- Half a step on — and she stops in it, in the middle of the step: no breath, her hair and gown still; the eye
  // comes a little nearer. Close: her face to the window, the eyes open, not blinking; a tear crawls down her cheek.
  freeze: {
    after: "follow",
    from: () => ({ ...NEAR, ...LITUP, ...away("doctor") }),
    run: async (s) => {
      const mad = s.person("madeline");
      const close = s.shot(CLOSE("madeline", { cu_turn: 1 }));
      await s.wait(0.3);
      const step = mad.walk([[1.75, 24.25]]);
      await s.until(() => s.state.madeline_a >= HALF[0]);
      mad.still(true);
      // (stopped still mid-step: the game's line from here)
      s.tell("freeze:still");
      step.cancel();
      s.move("camera_z", 18.3, { over: 2.4, ease: "inOut" });
      await s.wait(2);
      close.cut();
      await s.wait(0.8);
      await s.move("cu_tear", 1, { over: 4.4, ease: "inOut" });
    },
  },
  // ---- Still close: a deep breath — life comes back; a blink; she turns her head to him. (The game says her line: speak 1
  // while it does.)
  wake: {
    after: "freeze",
    from: () => ({ ...NEAR, camera_z: 18.3, ...madeline(HALF, 100, { madeline_still: true }), ...away("doctor"), ...CLOSE("madeline", { cu_turn: 1, cu_tear: 1 }) }),
    run: async (s) => {
      const mad = s.person("madeline");
      await s.wait(0.8);
      mad.still(false);
      await s.move("cu_inhale", 1, { over: 0.5, ease: "out" });
      await s.move("cu_inhale", 0, { over: 0.8, ease: "inOut" });
      await s.wait(0.1);
      await s.move("cu_blink", 1, { over: 0.1 });
      await s.move("cu_blink", 0, { over: 0.15 });
      await s.wait(0.25);
      mad.look("narrator");
      await s.move("cu_turn", -0.1, { over: 1.2, ease: "inOut" });
    },
  },
  // ---- Back to the gallery: she in the light, looking at him.
  look: {
    after: "wake",
    from: () => ({ ...NEAR, camera_z: 18.3, ...madeline(HALF, 100, { madeline_look: "narrator" }), ...away("doctor") }),
    run: async (s) => {
      s.set("closeup", 0);
      await s.wait(1.2);
    },
  },
  // ---- She turns away and goes. Cut: his eyes (the narrator unseen, the eye where he stands, a step on toward the window,
  // where the arch's pier no longer hides her doorway) — nothing between him and her all the way to the dark doorway on
  // the left deep in the gallery; she goes behind the wall, into its dark. The empty gallery.
  gone: {
    after: "look",
    from: () => ({ ...NEAR, camera_z: 18.3, ...madeline(HALF, 100, { madeline_look: "narrator" }), ...away("doctor") }),
    run: async (s) => {
      const mad = s.person("madeline");
      const eyes = s.shot({ camera_x: 0.3, camera_z: 19.9, ...at("narrator", [0.9, 21.5]), narrator_here: false });
      await s.wait(0.3);
      mad.look(null);
      await s.wait(0.5);
      const going = mad.walk(OUT_GONE);
      await s.wait(0.6);
      eyes.cut();
      s.path(["camera_x", "camera_z"], [[0.3, 19.9], [0.9, 21.5]], { over: 8, ease: "inOut" });
      await going;
      mad.here(false);
      await s.wait(1.4);
    },
  },
  // ---- He stays: he goes up to Roderick and lays a hand on his shoulder (the eye steps left); Roderick lowers his hands,
  // turns his head to him, talks with his hands. Behind them she goes into the doorway.
  stay: {
    after: "weep",
    from: () => ({ ...EVENING, ...TURNED, ...STOPPED, ...away("doctor") }),
    run: async (s) => {
      const friend = s.person("narrator"), rod = s.person("roderick"), mad = s.person("madeline");
      await s.wait(0.2);
      friend.look("roderick");
      s.sequence(async (q) => { await q.wait(0.4); await q.move("camera_x", -0.9, { over: 3.4, ease: "inOut" }); });
      await s.all(
        s.sequence(async (q) => {
          await q.wait(0.3);
          await q.person("narrator").walk([[0.15, 3.0]]);
          await q.person("narrator").turn(63);
          friend.reach({ r: "roderick#shoulder_r" });
          await q.wait(1.2);
          // (his hands down from his face: the weeping's end)
          const down = q.person("roderick").do("weep", { from: 6.6 });
          await q.wait(1);
          rod.look("narrator");
          await down;
          q.person("roderick").do("talk", { loop: true });
          // (he begins to speak: the game's lines start then)
          q.tell("stay:talk");
        }),
        s.sequence(async (q) => {
          await q.wait(2.8);
          await q.person("madeline").walk(OUT_STAY);
          mad.here(false);
        }),
      );
      await s.wait(0.5);
    },
  },
  // ---- Chapter II, another day: the low warm sun. Out of the dark: the narrator alone in the middle of the gallery; the
  // doctor with his bag comes out of the first doorway and up to him; the narrator turns round to him; the doctor stops
  // facing him and leans in, confiding. Close: the spectacles, the sly perplexed eyes. (The game says his first line.)
  doctor: {
    from: () => ({ ...DAY, fade: 1, ...person("doctor", DOOR3, 95) }),
    run: async (s) => {
      const doc = s.person("doctor"), friend = s.person("narrator");
      const close = s.shot(CLOSE("doctor", { cu_turn: 0.3 }));
      s.move("fade", 0, { over: 2, ease: "out" });
      await s.all(
        s.sequence(async (q) => {
          await q.wait(0.4);
          await q.person("doctor").walk(DOCTOR_IN);
          doc.look("narrator");
          const lean = q.person("doctor").go("lean_in", { to: DOCTOR, turn: toward(DOCTOR, ALONE) });
          await lean.ending(0.3);
        }),
        s.sequence(async (q) => {
          await q.until(() => q.state.doctor_a > -3.0);
          friend.look("doctor");
          await q.until(() => q.state.doctor_d < 18.6);
          await q.person("narrator").turn(toward(ALONE, DOCTOR));
        }),
      );
      close.cut();
      // (his face held a moment: the eye reads it before he speaks)
      await s.wait(2.5);
    },
  },
  // ---- Back to the two of them, the doctor leaning in.
  beside: {
    after: "doctor",
    from: () => BESIDE,
    run: async (s) => {
      s.set("closeup", 0);
      await s.wait(1.2);
    },
  },
  // ---- He straightens and goes into the doorway, not looking back. The narrator alone.
  doctor_leaves: {
    after: "beside",
    from: () => BESIDE,
    run: async (s) => {
      const doc = s.person("doctor"), friend = s.person("narrator");
      await s.wait(0.2);
      doc.look(null);
      await doc.do("straighten");
      friend.look("doctor");
      await doc.walk(DOCTOR_OUT);
      doc.here(false);
      friend.look(null);
      await s.wait(0.6);
    },
  },
  // ---- The doctor goes; the narrator goes after him. The dark.
  leave_with: {
    after: "beside",
    from: () => BESIDE,
    run: async (s) => {
      const doc = s.person("doctor"), friend = s.person("narrator");
      await s.wait(0.2);
      doc.look(null);
      await doc.do("straighten");
      const out = doc.walk(DOCTOR_OUT);
      friend.look(null);
      await s.wait(0.6);
      friend.walk([[-0.7, 16.6], [-2.0, 19.6]]);
      await s.wait(2);
      await s.move("fade", 1, { over: 2.4, ease: "inOut" });
      out.finish();
    },
  },
};
const SHOWCASE = ["pass", "weep", "follow", "freeze", "wake", "look", "gone", "stay", "doctor", "beside", "doctor_leaves", "leave_with"];

return {
  W, CE, BAY, BAYS, END, BACK, DEEP, HW, SPRING, APEX, DOORS, DOOR_BAYS, ROOM, WINDOW_BAYS, bay, windowOf, strip, ARC_STRIPS,
  arch, soffit, crack, crackNow, leftWall, rightWall, glass, floor, ceiling, endWall, room, sconce, sconceLive, closeup, closeupNow,
  FILM, SHOWCASE,
};
