// What the elements of «The approach to the house» share: the light of the moment (its colours), the house (its facade, windows,
// door, crack — the house, the windows and the crack paint the same house), the causeway's line, and the film in beats
// (FILM: the world's module beats; SHOWCASE — their order outside games). notes.md tells it.
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const hex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
// the sky's colour of the moment (the sky paints its own light): as it is at dusk (`dark` — as it would be deeper into
// the evening), dimmed by the darkness as by a veil; on the grey day `day` (#rrggbb each)
const VEIL = hex("#060a0f");
const tone = (lt, dusk, day, alpha = 1, dark = dusk) => {
  const a = hex(dusk), b = hex(dark), c = hex(day), v = 0.42 * lt.dark;
  const rgb = a.map((x, i) => {
    const d = x + (b[i] - x) * lt.dark;
    return Math.round((d + (VEIL[i] - d) * v) * (1 - lt.day) + c[i] * lt.day);
  });
  return "rgba(" + rgb.join(",") + "," + alpha + ")";
};
// what stands in the world is painted in its daylight colours (`day`): the hour is the scene's light — its looks dusk
// and day (scene.json)
const paint = (day, alpha = 1) => "rgba(" + hex(day).join(",") + "," + alpha + ")";
// the moment, from the state — what is painted from it, the same for a whole shot: dusk (the evening: the sky's), day
// (the grey day of chapter II; 0.75 the morning of chapter III), the mist, the lamp in the upper window. The dread
// deepening it (`gloom`) moves over it as it plays: the light's look `gloom` and the animates (the mist thicker, the lamp
// dimmer) — nothing painted again.
const light = (S) => {
  const day = clamp(S.day ?? 0);
  return { day, dark: clamp(S.dusk ?? 0.4) * (1 - day), mist: S.mist ?? 0.6, lamp: (S.window_light ?? 0.45) * (1 - day) };
};

// The house, in metres from the middle of its front at the water line (across 0, 80 m).
// windows: [x, top, width, height]; the upper row first (the lit one is UW[0], the vision stands in UW[2])
const UW = [[-12, -13.6, 1.5, 4], [-7.5, -13.6, 1.5, 4], [7.5, -13.6, 1.5, 4], [12, -13.6, 1.5, 4], [-23.3, -10.6, 1.3, 3.4], [-18.2, -10.6, 1.3, 3.4], [18.2, -10.6, 1.3, 3.4], [23.3, -10.6, 1.3, 3.4], [0, -16.6, 1.8, 4.6]];
const LW = [[-12, -8.2, 1.6, 5], [-7.5, -8.2, 1.6, 5], [7.5, -8.2, 1.6, 5], [12, -8.2, 1.6, 5], [-23.3, -5.8, 1.4, 4], [-18.2, -5.8, 1.4, 4], [18.2, -5.8, 1.4, 4], [23.3, -5.8, 1.4, 4]];
const DOOR = [0, -5.8, 2.9, 5.9];
// the crack: from the roof's edge down the wall beside the bay to the water (x, y); CRACK_X — the line it keeps to (the
// crack element stands there; its points crack#k0 … k16 are these, from the roof down)
const CK = [[5.4, -23], [4.9, -21.6], [5.9, -20.4], [5.3, -19.1], [6.3, -17.6], [5.5, -16.2], [6.1, -15], [5.2, -13.4], [6.2, -11.9], [5.7, -10.6], [6.6, -9.1], [5.9, -7.6], [6.4, -6.1], [5.6, -4.6], [6.3, -3], [5.8, -1.6], [6.2, 0.3]];
const CRACK_X = 5.8, CRACK_TOP = 23, HOUSE = 80;
// the house's colours (its daylight ones are painted: the dusk is the scene's light)
const C = {
  wall: ["#2b343d", "#4c5458"], wall2: ["#252d35", "#454d52"], bay: ["#303a44", "#535b60"], roof: ["#151b21", "#2a3034"],
  win: ["#0b0f13", "#191e22"], trim: ["#1f262d", "#363d42"], sill: ["#3a4550", "#5e666b"], chimney: ["#1d242b", "#363c40"],
};
const colours = () => Object.fromEntries(Object.entries(C).map(([k, [, day]]) => [k, paint(day)]));

function arch(g, cx, top, w, h) {
  g.beginPath();
  g.moveTo(cx - w / 2, top + h);
  g.lineTo(cx - w / 2, top + w * 0.55);
  g.quadraticCurveTo(cx - w / 2, top + w * 0.12, cx, top);
  g.quadraticCurveTo(cx + w / 2, top + w * 0.12, cx + w / 2, top + w * 0.55);
  g.lineTo(cx + w / 2, top + h);
  g.closePath();
}
function rect(g, x, y, w, h, c) {
  g.fillStyle = c;
  g.fillRect(x, y, w, h);
}
function tri(g, a, b, c, d, f, h, col) {
  g.fillStyle = col;
  g.beginPath();
  g.moveTo(a, b);
  g.lineTo(c, d);
  g.lineTo(f, h);
  g.closePath();
  g.fill();
}
// the house's outline (its weathering clipped to it)
function outline(g) {
  g.beginPath();
  g.rect(-26, -12.5, 10.6, 12.6);
  g.rect(15.4, -12.5, 10.6, 12.6);
  g.rect(-15.5, -15.5, 31, 15.6);
  g.rect(-4.5, -19, 9, 19.1);
  g.moveTo(-4.5, -19); g.lineTo(0, -27.4); g.lineTo(4.5, -19); g.closePath();
  g.moveTo(-26, -12.5); g.lineTo(-20.7, -19); g.lineTo(-15.4, -12.5); g.closePath();
  g.moveTo(15.4, -12.5); g.lineTo(20.7, -19); g.lineTo(26, -12.5); g.closePath();
}
// the walls and roofs, weathered (stains, moss hanging from the eaves); the doorway cut out of them — the hall behind
// it (its own element) is seen through it, the door's leaves (the windows') close it
function walls(g, e, k) {
  rect(g, -10.6, -26.4, 1.7, 4, k.chimney);
  rect(g, 8.9, -26.4, 1.7, 4, k.chimney);
  rect(g, -10.9, -26.8, 2.3, 0.5, k.trim);
  rect(g, 8.6, -26.8, 2.3, 0.5, k.trim);
  g.fillStyle = k.roof;
  g.beginPath(); g.moveTo(-16.4, -15.3); g.lineTo(-12, -23.2); g.lineTo(12, -23.2); g.lineTo(16.4, -15.3); g.closePath(); g.fill();
  rect(g, -26, -12.5, 10.6, 12.6, k.wall2);
  rect(g, 15.4, -12.5, 10.6, 12.6, k.wall2);
  tri(g, -26, -12.5, -20.7, -19, -15.4, -12.5, k.wall2);
  tri(g, 15.4, -12.5, 20.7, -19, 26, -12.5, k.wall2);
  g.strokeStyle = k.roof; g.lineWidth = 0.5; g.lineJoin = "miter";
  g.beginPath(); g.moveTo(-26.5, -12.1); g.lineTo(-20.7, -19.4); g.lineTo(-14.9, -12.1); g.moveTo(14.9, -12.1); g.lineTo(20.7, -19.4); g.lineTo(26.5, -12.1); g.stroke();
  rect(g, -15.5, -15.5, 31, 15.6, k.wall);
  rect(g, -4.5, -19, 9, 19.1, k.bay);
  tri(g, -4.5, -19, 0, -27.4, 4.5, -19, k.bay);
  g.beginPath(); g.moveTo(-5, -18.6); g.lineTo(0, -27.9); g.lineTo(5, -18.6); g.stroke();
  rect(g, -0.12, -29.3, 0.24, 1.6, k.roof);
  rect(g, -15.9, -15.9, 31.8, 0.5, k.trim);
  rect(g, -26.3, -12.9, 10.9, 0.45, k.trim);
  rect(g, 15.4, -12.9, 10.9, 0.45, k.trim);
  rect(g, -4.8, -19.3, 9.6, 0.45, k.trim);
  rect(g, -26.5, -1.1, 53, 1.2, k.trim);
  g.save();
  outline(g);
  g.clip();
  const vg = g.createLinearGradient(0, -28, 0, 0);
  vg.addColorStop(0, "rgba(6,9,12,0.5)"); vg.addColorStop(0.6, "rgba(6,9,12,0.12)"); vg.addColorStop(1, "rgba(130,145,152,0.08)");
  g.fillStyle = vg; g.fillRect(-27, -30, 54, 31);
  for (let i = 0; i < 140; i++) {
    const x = -26 + e.rnd() * 52, y = -27 + e.rnd() * 27, r = 0.6 + e.rnd() * 3;
    const rg = g.createRadialGradient(x, y, 0, x, y, r);
    rg.addColorStop(0, e.rnd() < 0.6 ? "rgba(10,16,20,0.2)" : "rgba(110,122,130,0.06)");
    rg.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = rg; g.fillRect(x - r, y - r, 2 * r, 2 * r);
  }
  for (const ev of [[-15.5, 15.5, -15.0], [-26, -15.4, -12.0], [15.4, 26, -12.0], [-4.5, 4.5, -18.6]]) {
    const n = Math.round((ev[1] - ev[0]) * 3);
    for (let i = 0; i < n; i++) {
      const x = ev[0] + e.rnd() * (ev[1] - ev[0]), L = 0.4 + Math.pow(e.rnd(), 2) * 4, w = 0.05 + e.rnd() * 0.18;
      const fg = g.createLinearGradient(0, ev[2], 0, ev[2] + L);
      fg.addColorStop(0, "rgba(12,28,28,0.55)"); fg.addColorStop(1, "rgba(12,28,28,0)");
      g.fillStyle = fg;
      g.beginPath(); g.moveTo(x - w, ev[2]); g.quadraticCurveTo(x - w * 0.3, ev[2] + L * 0.6, x + (e.rnd() - 0.5) * 0.3, ev[2] + L); g.quadraticCurveTo(x + w * 0.3, ev[2] + L * 0.6, x + w, ev[2]); g.fill();
    }
  }
  const bg = g.createLinearGradient(0, -4, 0, 0);
  bg.addColorStop(0, "rgba(14,30,32,0)"); bg.addColorStop(1, "rgba(14,30,32,0.5)");
  g.fillStyle = bg; g.fillRect(-27, -4, 54, 4);
  g.restore();
  // the doorway: open to the hall behind
  const [dx, dt, dw, dh] = DOOR;
  g.save(); g.globalCompositeOperation = "destination-out"; arch(g, dx, dt, dw, dh); g.fill(); g.restore();
}
// the hall's dim warm lamplight, as seen through the open door: from the dark under the vault to the lit floor
function hallLight(g, x, top, w, h) {
  const hg = g.createLinearGradient(0, top, 0, top + h);
  hg.addColorStop(0, "rgba(120,78,44,0.5)"); hg.addColorStop(1, "rgba(176,120,70,0.8)");
  g.fillStyle = hg; g.fillRect(x - w / 2, top, w, h);
}
// the windows and the round one, their sills
function windows(g, k) {
  for (const w of UW.concat(LW)) {
    g.fillStyle = k.win; arch(g, w[0], w[1], w[2], w[3]); g.fill();
    rect(g, w[0] - w[2] / 2 - 0.25, w[1] + w[3], w[2] + 0.5, 0.28, k.sill);
  }
  g.fillStyle = k.win; g.beginPath(); g.arc(0, -22.4, 1.05, 0, 7); g.fill();
}
// a leaf of the door (side −1 the left, +1 the right), shut: its half of the dark arch, hinged at its jamb — the door
// opening swings them in (narrowing toward the jambs)
function doorLeaf(g, side) {
  const [dx, dt, dw, dh] = DOOR;
  g.save();
  g.beginPath(); g.rect(side < 0 ? dx - dw / 2 - 0.01 : dx, dt - 0.1, dw / 2 + 0.01, dh + 0.2); g.clip();
  g.fillStyle = "#080b0e"; arch(g, dx, dt, dw, dh); g.fill();
  g.strokeStyle = "rgba(40,48,54,0.6)"; g.lineWidth = 0.05;
  for (const y of [dt + 1.6, dt + 3.6]) { g.beginPath(); g.moveTo(dx + side * 0.2, y); g.lineTo(dx + side * dw * 0.42, y); g.stroke(); }
  g.restore();
}
// the lit window UW[0]: its warm panes (its glow: the windows' e.light "lamp")
function lampWindow(g) {
  const w = UW[0], gg = g.createLinearGradient(0, w[1], 0, w[1] + w[3]);
  gg.addColorStop(0, "rgba(206,150,92,0.6)"); gg.addColorStop(1, "rgba(140,92,52,0.4)");
  g.fillStyle = gg; arch(g, w[0], w[1] + 0.25, w[2] - 0.35, w[3] - 0.3); g.fill();
}
// the figure in the window UW[2], seen only in the water: pale, tall, still — the head, the hair down over the
// shoulders, the gown to the sill; a cold dim light in the room behind her
function figure(g) {
  const [x, top, w, h] = UW[2];
  g.save();
  arch(g, x, top + 0.12, w - 0.16, h - 0.12);
  g.clip();
  const room = g.createRadialGradient(x, top + 1.5, 0, x, top + 1.5, 2.4);
  room.addColorStop(0, "rgba(120,136,148,0.35)"); room.addColorStop(1, "rgba(120,136,148,0)");
  g.fillStyle = room; g.fillRect(x - w, top, 2 * w, h);
  const pale = g.createLinearGradient(0, top + 0.7, 0, top + h);
  pale.addColorStop(0, "rgba(232,234,230,1)"); pale.addColorStop(0.5, "rgba(206,212,212,0.9)"); pale.addColorStop(1, "rgba(160,170,174,0.6)");
  g.fillStyle = pale;
  g.beginPath(); g.ellipse(x, top + 0.95, 0.18, 0.23, 0, 0, 7); g.fill();
  g.beginPath();
  g.moveTo(x - 0.07, top + 1.15); g.lineTo(x - 0.1, top + 1.3); g.quadraticCurveTo(x - 0.3, top + 1.33, x - 0.31, top + 1.5); g.quadraticCurveTo(x - 0.34, top + 2.4, x - 0.42, top + h);
  g.lineTo(x + 0.42, top + h); g.quadraticCurveTo(x + 0.34, top + 2.4, x + 0.31, top + 1.5); g.quadraticCurveTo(x + 0.3, top + 1.33, x + 0.1, top + 1.3); g.lineTo(x + 0.07, top + 1.15);
  g.closePath(); g.fill();
  g.fillStyle = "rgba(190,196,198,0.95)";
  g.beginPath();
  g.moveTo(x, top + 0.7); g.bezierCurveTo(x - 0.26, top + 0.72, x - 0.24, top + 1.3, x - 0.22, top + 1.85); g.lineTo(x - 0.12, top + 1.8);
  g.bezierCurveTo(x - 0.15, top + 1.3, x - 0.16, top + 1.0, x - 0.08, top + 0.86); g.lineTo(x + 0.08, top + 0.86);
  g.bezierCurveTo(x + 0.16, top + 1.0, x + 0.15, top + 1.3, x + 0.12, top + 1.8); g.lineTo(x + 0.22, top + 1.85); g.bezierCurveTo(x + 0.24, top + 1.3, x + 0.26, top + 0.72, x, top + 0.7);
  g.fill();
  g.restore();
}
// the crack's line (from the top: CK from the first point down; `from`…`to` — a stretch of it, shares of its points)
function crackPath(g, from = 0, to = CK.length - 1) {
  g.beginPath();
  for (let i = from; i <= to; i++) i === from ? g.moveTo(CK[i][0], CK[i][1]) : g.lineTo(CK[i][0], CK[i][1]);
}
// where the crack is across at y (between its points)
function crackX(y) {
  const i = CK.findIndex((p) => p[1] >= y);
  if (i < 0) return CK[CK.length - 1][0];
  if (i === 0) return CK[0][0];
  const [x0, y0] = CK[i - 1], [x1, y1] = CK[i];
  return x0 + ((x1 - x0) * (y - y0)) / (y1 - y0);
}
// The causeway: across (m) where its middle is at a distance (m) — from the near shore at the bottom left to the door
const causeway = (d) => -5.5 * Math.pow(clamp((HOUSE - d) / 77, 0, 2), 1.6);

// ===== the film in beats =====
// The two on the causeway, along it: 0 — in the hall, a step inside the door; 1 — at the near shore (`walk`: where the
// game sends them; `walk_at`: where they are). The narrator a step ahead of Roderick (towards us) and to the right of him
// on the screen, his right hand holding Roderick's left.
const DOOR_D = 81.6, SHORE = 8.5, OUT = 0.15, MIDDLE = 0.5, RIDER = 10, AHEAD_OF = 0.45;
// (the point their joined hands are pulled toward — the element `lead`, low — so far before the narrator, towards us:
// the way a long one on the screen)
const LEAD = 2.4;
const dist = (w) => DOOR_D + (SHORE - DOOR_D) * w;
const NARRATOR = (w) => [causeway(dist(w)) + 0.3, dist(w) - AHEAD_OF], RODERICK = (w) => [causeway(dist(w)) - 0.35, dist(w) + 0.35];
// where along the causeway the two are, from where the narrator stands (his distance)
const walkOf = (d) => clamp((DOOR_D - AHEAD_OF - d) / (DOOR_D - SHORE), 0, 1);
const at = (id, [a, d]) => ({ [`${id}_a`]: a, [`${id}_d`]: d });
const places = (w) => ({ ...at("narrator", NARRATOR(w)), ...at("roderick", RODERICK(w)) });
// the way from one place to another (a person's turn: 0 away from the eye, 90 to its right, 180 toward it)
const toward = ([a, d], [a2, d2]) => ((Math.atan2(a2 - a, d2 - d) * 180) / Math.PI + 360) % 360;
const heading = (w0, w1) => toward(NARRATOR(w0), NARRATOR(w1));
// points along a walk from w0 to w1 (for a person's walk: their way along the causeway)
const way = (f, w0, w1, n = 6) => Array.from({ length: n }, (_, i) => f(w0 + ((w1 - w0) * (i + 1)) / n));
// points along the middle of the causeway from one distance to another (the horse's path)
const along = (d0, d1, n = 8) => Array.from({ length: n }, (_, i) => { const d = d0 + ((d1 - d0) * (i + 1)) / n; return [causeway(d), d]; });
// hand in hand (each reaching for the other's hand: they meet between); let go
const holding = { narrator_reach: { r: "roderick#hand_l" }, roderick_reach: { l: "narrator#hand_r" } };
// someone not in the scene now (Roderick indoors)
const away = (id) => ({ [`${id}_here`]: false, [`${id}_do`]: "stand", [`${id}_look`]: null, [`${id}_reach`]: null, [`${id}_gait`]: null, [`${id}_on`]: null });
// the narrator on his horse (rider#stirrups: his hips at the saddle), turned as it is (its face the old way: 0 toward us)
const mounted = (face) => ({ narrator_here: true, narrator_on: "rider#stirrups", narrator_do: { motion: "ride", loop: true }, narrator_turn: (180 - face + 360) % 360, narrator_reach: null, narrator_gait: null, narrator_steps: false, narrator_wear: { hat: "top" } });
// the two on foot, standing, facing us, hand in hand
const pair = {
  narrator_here: true, roderick_here: true, narrator_do: "stand", roderick_do: "stand", narrator_turn: 180, roderick_turn: 180,
  narrator_look: null, roderick_look: null, narrator_gait: null, roderick_gait: null, narrator_on: null, narrator_steps: true, narrator_wear: null, ...holding,
};
// where Roderick turns his face to the air in the middle: up over the causeway before him
const AIR = (w) => [RODERICK(w)[0], RODERICK(w)[1] - 3, 4.2];
const back = (w) => toward(NARRATOR(w), RODERICK(w));
// the camera: low on the causeway some way ahead of them (the house behind them), nearer on their faces in the middle
const AHEAD = 5;
const tracking = (w) => [causeway(dist(w)), dist(w) - AHEAD];
const camera = (w) => ({ camera_target: null, camera_x: tracking(w)[0], camera_z: tracking(w)[1], camera_h: -0.2, camera_look: 0.06 });
const NEAR = { camera_target: null, camera_x: causeway(dist(MIDDLE)) - 0.02, camera_z: dist(MIDDLE) - AHEAD - 1.2, camera_h: 0.1, camera_look: 0.08 };
const ZERO = { camera_target: null, camera_x: 0, camera_z: 0, camera_h: 0, camera_look: 0, camera_pitch: 0 };

const DUSK = {
  day: 0, dusk: 0.4, mist: 0.6, window_light: 0.45, door: 0, reflection_figure: 0, gloom: 0, crack_trace: 0, follow: false, resist: 0,
  rider_present: true, rider_a: causeway(RIDER), rider_d: RIDER, rider_face: 128, horse_toss: 0,
  ...mounted(128), narrator_look: [0, 80, 15], ...away("roderick"), closeup: 0, cu_inhale: 0, ...ZERO,
};
const DAY = {
  day: 1, dusk: 0, gloom: 0, mist: 0.3, window_light: 0, reflection_figure: 0, crack_trace: 1, rider_present: false, ...pair,
  follow: false, closeup: 0, cu_inhale: 0, door: 1, resist: 0.3, ...ZERO,
};
// in the middle of the causeway after his breath: the narrator turned back to him, Roderick's face up
const BREATHED = { ...DAY, ...places(MIDDLE), resist: 0, narrator_turn: back(MIDDLE), roderick_turn: heading(0, MIDDLE), roderick_look: AIR(MIDDLE), ...NEAR };
// a grey early morning (chapter III): his horse saddled by the tarn, he on foot beside it, looking out along the causeway
const HORSE = [causeway(RIDER - 1), RIDER - 1], BESIDE = [HORSE[0] + 0.55, HORSE[1] - 0.6], STIRRUP = [HORSE[0] + 0.05, HORSE[1] - 0.45];
const MORNING = {
  ...DUSK, day: 0.75, dusk: 0, gloom: 0, mist: 0.95, window_light: 0, crack_trace: 1, rider_a: HORSE[0], rider_d: HORSE[1], rider_face: 100,
  narrator_here: true, narrator_on: null, narrator_do: "stand", narrator_steps: true, ...at("narrator", BESIDE), narrator_turn: 200, narrator_look: null,
  narrator_wear: { hat: "top" }, ...ZERO, camera_x: -2.5, camera_z: 2.5, camera_look: 0.04,
};

// The beats (each a sequence of the director's: s). A beat that follows one of its `after` goes on from where that one
// left; else it is cut to its `from`.
const FILM = {
  // the rider rides in from the near end of the causeway, slows, stops at the tarn, the horse turns to the house and
  // tosses its head; he lifts his eyes to the house (the chapter begins)
  arrive: {
    from: () => ({ ...DUSK, rider_a: causeway(3.5), rider_d: 3.5, rider_face: 160, ...mounted(160), narrator_look: null }),
    run: async (s) => {
      const nar = s.person("narrator");
      await s.wait(0.4);
      await s.path(["rider_a", "rider_d"], along(3.5, RIDER), { over: 8.6, ease: "out" }).ending(1.4);
      // stopped, the horse steps round a little toward the house, he with it
      const turn = s.turn("rider_face", 128, 2.4);
      nar.turn(180 - 128);
      await s.wait(1.2);
      s.move("horse_toss", 1, { over: 0.3, ease: "out" });
      await s.wait(0.6);
      nar.look([0, 80, 15]);
      s.move("horse_toss", 0, { over: 1.2 });
      await s.all(turn, s.wait(2.2));
    },
  },
  // he looks; the gloom (the game, step by step) and the traced crack come over it
  look: {
    after: "arrive",
    from: () => ({ ...DUSK }),
    run: async (s) => { await s.move("camera_z", 0.8, { over: 3, ease: "inOut" }); },
  },
  // nearer to the house, for the crack to be traced from the roof to the water (the game's «Cause»)
  trace: {
    after: "look",
    from: () => ({ ...DUSK, gloom: 1 }),
    run: async (s) => { await s.all(s.move("camera_z", 26, { over: 3, ease: "inOut" }), s.move("camera_look", -0.06, { over: 3, ease: "inOut" })); },
  },
  // the eyes go down to the water, nearer: in the reflection a pale figure stands in an upper window; up — the window
  // itself is empty; below, she is still in the water a moment, then not
  tarn: {
    after: ["look", "trace"],
    from: () => ({ ...DUSK, gloom: 1, crack_trace: 1 }),
    run: async (s) => {
      s.move("camera_z", 30, { over: 4.2, ease: "inOut" });
      await s.wait(0.3);
      s.move("camera_look", 0.2, { over: 3.8, ease: "inOut" });
      await s.wait(2.1);
      await s.move("reflection_figure", 1, { over: 1.4, ease: "out" });
      await s.wait(2.2);
      await s.move("camera_look", -0.04, { over: 2.4, ease: "inOut" });
      await s.wait(1);
      await s.move("reflection_figure", 0, { over: 2, ease: "in" });
    },
  },
  // he rides on to the door; it opens, a dim light in it (the chapter's part ends)
  to_door: {
    after: ["look", "trace", "tarn"],
    from: () => ({ ...DUSK, gloom: 1, crack_trace: 1 }),
    run: async (s) => {
      s.move("camera_z", 0, { over: 5, ease: "inOut" });
      s.move("camera_look", 0, { over: 4, ease: "inOut" });
      s.person("narrator").look(null);
      await s.wait(1.2);
      const ride = s.path(["rider_a", "rider_d"], along(RIDER, 24), { over: 9, ease: "in" });
      await s.wait(3.3);
      s.move("door", 1, { over: 3 });
      await s.wait(2.7);
      await ride;
    },
  },
  // a grey day, the camera low on the causeway some way from the door: it opens; the narrator comes out of the hall
  // leading Roderick by the hand and comes towards us, the house rising behind them
  walk_out: {
    from: () => ({ ...DAY, door: 0, ...places(0), narrator_turn: heading(0, OUT), roderick_turn: heading(0, OUT), ...camera(OUT) }),
    run: async (s) => {
      await s.wait(0.6);
      // (the door begins to open: the game's line from here)
      s.tell("walk_out:door");
      await s.move("door", 1, { over: 2.2 });
      await s.all(s.person("narrator").walk(way(NARRATOR, 0, OUT)), s.person("roderick").walk(way(RODERICK, 0, OUT)));
    },
  },
  // where «By the hand» is played: the game moves `walk` (towards MIDDLE) and `resist`; the camera keeps them framed
  walk: {
    after: "walk_out",
    from: () => ({ ...DAY, ...places(OUT), narrator_turn: heading(0, OUT), roderick_turn: heading(0, OUT), ...camera(OUT) }),
    run: async (s) => { s.set("follow", true); },
  },
  // (outside games: what «By the hand» does — they go on to the middle of the causeway, he resisting more as they go)
  walk_on: {
    after: ["walk_out", "walk"],
    from: () => ({ ...DAY, ...places(OUT), narrator_turn: heading(0, OUT), roderick_turn: heading(0, OUT), ...camera(OUT) }),
    run: async (s) => {
      const nar = s.person("narrator").walk(way(NARRATOR, OUT, MIDDLE)), rod = s.person("roderick").walk(way(RODERICK, OUT, MIDDLE));
      s.move("resist", 0.55, { over: 8 });
      // the camera backs along the causeway ahead of them, as long as the narrator's walk is (known once it has begun)
      await s.wait(0.1);
      s.path(["camera_x", "camera_z"], way(tracking, OUT, MIDDLE), { over: nar.remaining || 18, ease: "linear" });
      await s.all(nar, rod);
    },
  },
  // in the middle of the causeway he stops resisting; the narrator turns to him; he lifts his face to the air and
  // breathes; the camera comes nearer; close: his face in the daylight, the eyes shut, one deep breath; back
  breathe: {
    after: ["walk", "walk_on"],
    from: () => ({ ...DAY, ...places(MIDDLE), resist: 0.6, narrator_turn: heading(0, MIDDLE), roderick_turn: heading(0, MIDDLE), ...camera(MIDDLE) }),
    run: async (s) => {
      s.set("follow", false);
      s.set("narrator_gait", null);
      s.set("roderick_gait", null);
      s.move("resist", 0, { over: 1.6, ease: "out" });
      await s.wait(0.6);
      s.person("narrator").turn(back(MIDDLE));
      await s.wait(0.6);
      s.person("roderick").look(AIR(MIDDLE));
      s.camera({ target: null });
      await s.all(...["camera_x", "camera_z", "camera_h", "camera_look"].map((k) => s.move(k, NEAR[k], { over: 3.6, ease: "inOut" })));
      // (the close-up: an insert — made ready while closed, it opens finished; the game's line on it from here)
      s.set("closeup", 1);
      s.tell("breathe:close");
      await s.wait(1);
      await s.move("cu_inhale", 1, { over: 1.8, ease: "inOut" });
      await s.move("cu_inhale", 0, { over: 2.2, ease: "inOut" });
      await s.wait(0.6);
      s.set("closeup", 0);
      await s.wait(0.8);
    },
  },
  // on to the shore: he lowers his face, the narrator leads again; nearer the shore (a cut), the last steps; he balks,
  // his hand slips out of the narrator's, who goes on a step; he goes down on his knees, the hands over his ears, and
  // rocks; the narrator turns back to him
  to_shore: {
    after: "breathe",
    from: () => ({ ...BREATHED }),
    run: async (s) => {
      const nar = s.person("narrator"), rod = s.person("roderick");
      // (the cut nearer the shore, said ahead: made ready while they walk)
      const near = s.shot({ ...places(0.88), narrator_turn: heading(0.56, 1), roderick_turn: heading(0.56, 1), camera_target: null, camera_x: -4, camera_z: 4, camera_h: 0.2, camera_look: 0.1 });
      rod.look(null);
      await s.wait(0.3);
      s.move("resist", 0.35, { over: 1.5 });
      await s.all(nar.walk(way(NARRATOR, MIDDLE, 0.56, 3)), rod.walk(way(RODERICK, MIDDLE, 0.56, 3)));
      near.cut();
      s.move("resist", 1, { over: 4, ease: "in" });
      await s.all(nar.walk(way(NARRATOR, 0.88, 0.975, 3)), rod.walk(way(RODERICK, 0.88, 0.975, 3)));
      // the hand slips out; the narrator, still pulling, goes on a step
      s.set("narrator_reach", null);
      s.set("roderick_reach", null);
      const step = nar.walk([NARRATOR(0.99)]);
      await rod.go("kneel_ears", { from: RODERICK(0.975), turn: heading(0.88, 1) });
      await step;
      nar.turn(toward(NARRATOR(0.99), RODERICK(0.975)));
      nar.look("roderick");
      rod.do("rock_ears", { loop: true });
      await s.wait(2);
    },
  },
  // back to the house: they let go and turn, he first; walking back he looks over his shoulder at the shore once; the
  // camera stays, rising a little
  turn_back: {
    after: "breathe",
    from: () => ({ ...BREATHED }),
    run: async (s) => {
      const nar = s.person("narrator"), rod = s.person("roderick");
      rod.look(null);
      await s.wait(0.2);
      s.set("narrator_reach", null);
      s.set("roderick_reach", null);
      // (he goes home of his own will: his own walk, not the led one)
      rod.gait("walk");
      s.move("camera_h", 0.4, { over: 7, ease: "inOut" });
      const home = rod.walk(way(RODERICK, MIDDLE, 0.42, 4));
      await s.wait(0.5);
      const follows = nar.walk(way(NARRATOR, MIDDLE, 0.42, 4));
      await s.wait(2.3);
      rod.look([causeway(SHORE), SHORE, 1.2]);
      await s.wait(1.6);
      rod.look(null);
      await s.all(home, follows);
    },
  },
  // the last morning: the horse waits saddled by the tarn, he stands by it; the camera creeps nearer;
  // the horse tosses its head; he looks back over his shoulder at the house
  morning: {
    from: () => ({ ...MORNING }),
    run: async (s) => {
      await s.wait(0.5);
      s.move("camera_z", 3.5, { over: 7, ease: "inOut" });
      await s.wait(3.7);
      // (the horse tosses its head: the game's line from here)
      s.tell("morning:toss");
      await s.move("horse_toss", 1, { over: 0.4, ease: "out" });
      await s.wait(0.4);
      s.move("horse_toss", 0, { over: 1.2 });
      await s.wait(0.6);
      s.person("narrator").look([0, 80, 10]);
      await s.wait(2.2);
    },
  },
  // he turns from the house to the horse, steps to the stirrup, his hand on the saddle — a cut: he is up in the
  // saddle; the horse turns and he rides off along the causeway towards us and out of the frame, the house behind in
  // the mist; dark (the end of chapter III's choice)
  ride_away: {
    after: "morning",
    from: () => ({ ...MORNING, camera_z: 3.5, narrator_look: [0, 80, 10] }),
    run: async (s) => {
      const nar = s.person("narrator");
      // (the cut into the saddle, said ahead: made ready while he goes to the stirrup)
      const up = s.shot({ ...mounted(100) });
      nar.look(null);
      await nar.walk([STIRRUP]);
      await nar.turn(toward(STIRRUP, HORSE));
      nar.reach({ l: "rider#saddle" });
      await s.wait(0.6);
      up.cut();
      nar.reach(null);
      await s.wait(0.8);
      await s.all(s.turn("rider_face", -30, 1.6), nar.turn(180 + 30));
      const ride = s.path(["rider_a", "rider_d"], along(RIDER - 1, 3.8), { over: 5.5, ease: "in" });
      await s.wait(1.8);
      s.move("camera_x", -3.4, { over: 4, ease: "inOut" });
      await s.wait(2.6);
      await ride;
    },
  },
};
// the showcase: chapter I at dusk (in, the look, the crack traced, the vision in the tarn, to the door), chapter II on the
// grey day (out of the house by the hand, to the middle, his breath; to the shore), chapter III's morning and the ride away
const SHOWCASE = ["arrive", "look", "trace", "tarn", "to_door", "walk_out", "walk_on", "breathe", "to_shore", "morning", "ride_away"];

// the close-up (an insert, opened by `closeup`): Roderick's face in the grey daylight, lifted to the air, the eyes closed
// — painted once, its breath (cu_inhale) its animate's
const SHOT = { light: "day", faces: [{ who: "roderick", eyes: 0, nod: -0.5 }] };
const closeup = () => SHOT;

return {
  closeup, clamp, tone, paint, light, colours, UW, LW, CK, DOOR, CRACK_X, CRACK_TOP, HOUSE, walls, windows, doorLeaf, lampWindow, hallLight, figure, arch,
  crackPath, crackX, causeway, FILM, SHOWCASE, places, walkOf, tracking, NARRATOR, RODERICK, dist, OUT, MIDDLE, SHORE, AHEAD, LEAD,
};
