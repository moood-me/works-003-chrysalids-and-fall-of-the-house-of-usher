// Builds scenes/medlin-prokhodit/scene.json and its elements/ from the scene's lib.js geometry (the arches, their soffit
// strips, the walls, the rooms behind the doorways, the window panes the light comes through) — run from the world's
// root: node tools/medlin-prokhodit-gen.js. The caption and the music are kept from the current scene.json.
const fs = require("fs"), path = require("path");
const DIR = path.join(__dirname, "../scenes/medlin-prokhodit"), EL = path.join(DIR, "elements");
const anim = { noise: () => 0 };
const L = new Function("anim", "kit", fs.readFileSync(path.join(DIR, "lib.js"), "utf8"))(anim, {});
const v1 = JSON.parse(fs.readFileSync(path.join(DIR, "scene.json"), "utf8"));
fs.rmSync(EL, { recursive: true, force: true });
fs.mkdirSync(EL, { recursive: true });
const r3 = (v) => Math.round(v * 1000) / 1000;
const objects = [], code = {};
const add = (o, c, extra = {}) => { objects.push(o); if (c) fs.writeFileSync(path.join(EL, `${o.id}.js`), c + "\n"); for (const k in extra) fs.writeFileSync(path.join(EL, `${o.id}.${k}`), extra[k] + "\n"); };
const { W, CE, END, BACK, DEEP, HW, SPRING, bay, BAYS, ARC_STRIPS, strip, DOORS, DOOR_BAYS, ROOM } = L;
const LEN = END - BACK, MID = (END + BACK) / 2;

add({ id: "floor", name: "Пол", plane: true, across: 0, distance: MID, elevation: 0, width: 2 * W, depth: LEN,
  reflect: { strength: 0.22, fade: 5, blur: 0.04, rough: 0.2 } }, "e.lib.floor(g, e);");
add({ id: "ceiling", name: "Свод", plane: true, across: 0, distance: MID, elevation: CE, width: 2 * W, depth: LEN, tilt: 180 }, "e.lib.ceiling(g, e);");
add({ id: "wall_l", name: "Левая стена", across: -W, distance: BACK, facing: 90, height: CE, box: [0, -CE - 0.1, LEN, 0.1] }, "e.lib.leftWall(g, e);");
add({ id: "wall_r", name: "Правая стена с окнами", across: W, distance: END, facing: 270, height: CE, box: [0, -CE - 0.1, LEN, 0.1] }, "e.lib.rightWall(g, e);");
add({ id: "windows", name: "Окна", across: W + 0.03, distance: END, facing: 270, glows: true, height: 8, box: [0, -7.6, 72, -1.3], redraw: { low_sun: 0.1, light_shafts: 0.1 } }, "e.lib.glass(g, e);");
add({ id: "end_wall", name: "Торцевая стена", across: 0, distance: END, facing: 180, height: CE, box: [-W - 0.1, -CE - 0.1, W + 0.1, 0.1] }, "e.lib.endWall(g, e);");
for (let k = 0; k < BAYS; k++) {
  const Z = r3(bay(k));
  add({ id: `arch${k}`, name: "Арка", across: 0, distance: Z, facing: 180, height: CE, box: [-W - 0.1, -CE - 0.1, W + 0.1, 0.1] }, "e.lib.arch(g, e);");
  add({ id: `arch${k}_pl`, name: "Арка", across: -HW, distance: Z, facing: 90, height: SPRING, box: [0, -SPRING, DEEP, 0] }, "e.lib.soffit(g, e);");
  add({ id: `arch${k}_pr`, name: "Арка", across: HW, distance: r3(Z + DEEP), facing: 270, height: SPRING, box: [0, -SPRING, DEEP, 0] }, "e.lib.soffit(g, e);");
  for (let i = 0; i < ARC_STRIPS; i++) {
    const s = strip(i), h = r3(s.len + 0.02);
    add({ id: `arch${k}_l${i}`, name: "Арка", across: r3(s.x), elevation: r3(s.y), distance: Z, facing: 90, tilt: r3(-s.lean), height: h, box: [0, -h, DEEP, 0] }, "e.lib.soffit(g, e);");
    add({ id: `arch${k}_r${i}`, name: "Арка", across: r3(-s.x), elevation: r3(s.y), distance: r3(Z + DEEP), facing: 270, tilt: r3(-s.lean), height: h, box: [0, -h, DEEP, 0] }, "e.lib.soffit(g, e);");
  }
}
add({ id: "crack", name: "Трещина", across: 0, distance: r3(bay(2) - 0.015), facing: 180, height: 9, box: [1.6, -10.8, 3.4, -2.0], uniforms: { reach: 0, wide: 0 } },
  "e.lib.crack(g, e);",
  { "animate.js": "const c = e.lib.crackNow(e.state.crack);\ne.uniform('reach', c.reach);\ne.uniform('wide', c.wide);",
    glsl: "// the crack as far as it has run (reach: metres up the pier), the thin one widening into the wide one\nvec4 shade(vec4 painted, vec2 at, vec2 uv) {\n  float shown = 1.0 - smoothstep(reach - 0.03, reach + 0.03, -at.y);\n  return mix(layer(1, at), layer(2, at), wide) * shown;\n}" });
DOORS.forEach(([a, b], i) => {
  const k = DOOR_BAYS[i], x0 = -W, x1 = -W - ROOM, z0 = a - 2, z1 = b + 2, H = 4.5;
  add({ id: `room${k}_floor`, name: "Тёмная комната", plane: true, across: r3((x0 + x1) / 2), distance: r3((z0 + z1) / 2), elevation: 0, width: ROOM, depth: r3(z1 - z0) }, `e.lib.room(g, e, ${ROOM}, ${r3(z1 - z0)}, true);`);
  add({ id: `room${k}_ceil`, name: "Тёмная комната", plane: true, across: r3((x0 + x1) / 2), distance: r3((z0 + z1) / 2), elevation: H, width: ROOM, depth: r3(z1 - z0), tilt: 180 }, `e.lib.room(g, e, ${ROOM}, ${r3(z1 - z0)}, true);`);
  add({ id: `room${k}_back`, name: "Тёмная комната", across: r3(x1), distance: r3(z0), facing: 90, height: H, box: [0, -H, r3(z1 - z0), 0] }, `e.lib.room(g, e, ${r3(z1 - z0)}, ${H});`);
  add({ id: `room${k}_near`, name: "Тёмная комната", across: x0, distance: r3(z0), facing: 0, height: H, box: [0, -H, ROOM, 0] }, `e.lib.room(g, e, ${ROOM}, ${H});`);
  add({ id: `room${k}_far`, name: "Тёмная комната", across: r3(x1), distance: r3(z1), facing: 180, height: H, box: [0, -H, ROOM, 0] }, `e.lib.room(g, e, ${ROOM}, ${H});`);
});
add({ id: "sconce", name: "Свеча в бра", across: -W + 0.12, distance: r3(bay(6) + 2.6), elevation: 2.6, height: 0.8, box: [-0.2, -0.4, 0.1, 0.4], glows: true, flicker: 0.35, redraw: { sconce: 0.1 } },
  "e.lib.sconce(g, e);", { "animate.js": "e.lib.sconceLive(e);" });
add({ id: "motes", name: "Пыль в свете окон", particles: { kind: "dust", at: [0, 18, 3.6], source: [2 * W - 0.2, 28, 7], rate: 200, life: [10, 16] } });
const who = (id, name, turn, place, extra = {}) => ({ id, name, person: { cast: "cast", who: id, turn, ...extra }, across: place[0], distance: place[1],
  place: { across: `${id}_a`, distance: `${id}_d` }, shadow: true });
add(who("narrator", "Рассказчик", 0, [-1.15, 2.7]));
add(who("roderick", "Родерик", 355, [0.75, 3.4]));
add(who("madeline", "Леди Мэдлин", 85, [-4.6, 20.4], { does: "still", gait: "sleepwalk" }));
add(who("doctor", "Врач", 90, [-4.6, 20.4]));
add({ id: "closeup", name: "Крупный план", insert: "closeup" },
  "e.kit.closeups.paint(g, e, e.lib.closeup(e.state));", { "animate.js": "e.kit.closeups.live(e, e.lib.closeup(e.state), e.lib.closeupNow(e.state));" });

const pane = (k) => L.windowOf(k, 2).map(([z, y]) => [W, r3(z), r3(y)]);
const panes = L.WINDOW_BAYS.map(pane);
const spec = {
  engine: 2,
  title: "Мэдлин проходит",
  caption: v1.caption,
  horizon: 0.56,
  camera: { mode: "picture" },
  light: {
    grain: 0.25, vignette: 0.55, tint: "#2a3d48", tintStrength: 0.12, saturation: 0.9,
    haze: 0.85, hazeColor: "#1e2c34", hazeGlow: 0.6, shafts: 0.8,
    ambient: 0.6, ambientColor: "#7f95a4", bounce: 0.6,
    looks: { low_sun: { lights: { evening: 0 }, ambientColor: "#8a8a84", hazeColor: "#191814", tint: "#3d3326", shafts: 0.3 } },
  },
  lights: [
    { id: "evening", from: [52.6, 47.8], through: panes, soft: 0.25, color: "#9fb2ba", strength: 1.5, on: "light_shafts" },
    { id: "sun", from: [58.6, 43.5], through: panes, soft: 0.2, color: "#d6a870", strength: 1.7, on: "low_sun" },
    { id: "candle", of: "sconce#flame", reach: 5, strength: 0.8, on: "sconce", flicker: 0.35, glow: 0.25 },
  ],
  state: {
    beat: null, fade: 1, camera_x: 0, camera_z: 0, crack: 0.3, light_shafts: 1, low_sun: 0, sconce: 1,
    closeup: 0, shot: "roderick", cu_turn: 0, cu_tear: 0, cu_inhale: 0, cu_blink: 0, speak: 0,
    narrator_a: -1.15, narrator_d: 2.7, narrator_turn: 0, roderick_a: 0.75, roderick_d: 3.4, roderick_turn: 355,
    madeline_a: -4.6, madeline_d: 20.4, madeline_turn: 85, doctor_a: -4.6, doctor_d: 20.4, doctor_here: false,
  },
  states: {
    beat: { type: "string", means: "кусок фильма (модуль beats): имя — он играется с начала, в конце сцена говорит beat:<имя>. Куски: " + L.SHOWCASE.join(", ") },
    crack: { range: [0, 1], smooth: true, means: "трещина на правом столбе арки 2: 0 — нет, 1 — прошла до свода и широкая (игра ставит по шкале)" },
    light_shafts: { range: [0, 1], smooth: true, means: "вечерний свет окон (и его лучи в воздухе): 0 — нет, 1 — полный" },
    low_sun: { range: [0, 1], smooth: true, means: "0 — вечер, холодный свет окон; 1 — другой день, низкое тёплое солнце (врач)" },
    sconce: { range: [0, 1], smooth: true, means: "свеча в бра на левой стене: 0 — погашена, 1 — горит" },
    closeup: { range: [0, 1], means: "крупный план поверх галереи (модуль closeups): 0 — нет, 1 — открыт" },
    shot: { values: ["roderick", "madeline", "doctor"], means: "чей крупный план: Родерик (лицо в ладонях), Мэдлин (застывшая — madeline_still), врач" },
    cu_turn: { range: [-1, 1], smooth: true, means: "лицо крупно: поворот головы, + к окну" },
    cu_tear: { range: [0, 1], smooth: true, means: "лицо крупно: слеза — как далеко сползла" },
    cu_inhale: { range: [0, 1], smooth: true, means: "лицо крупно: глубокий вдох (0→1→0)" },
    cu_blink: { range: [0, 1], smooth: true, means: "лицо крупно: моргание вручную (0 — моргает само, если не застыла)" },
    speak: { range: [0, 1], means: "губы на крупном плане шевелятся: игра ставит 1, пока говорит реплику, потом 0" },
    doctor_present: { range: [0, 1], means: "игра ставит при открытии: 1 — глава II, врач (свет и люди ставит кусок doctor)" },
    madeline: { range: [0, 1], means: "игра ставит при открытии: 0 — Мэдлин нет (люди ставит кусок)" },
  },
  objects,
  modules: ["cast", "beats", "closeups"],
  music: v1.music,
};
fs.writeFileSync(path.join(DIR, "scene.json"), JSON.stringify(spec, null, 2) + "\n");
console.log(objects.length, "objects");
