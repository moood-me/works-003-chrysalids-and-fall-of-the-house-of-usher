// Builds scenes/madeline-passes/scene.json and its elements/ from the scene's lib.js geometry (the arches, their soffit
// strips, the walls, the rooms behind the doorways, the window panes the light comes through) — run from the world's
// root: node tools/madeline-passes-gen.js. The caption and the music (its key, `scale`, too) are kept from the current
// scene.json.
const fs = require("fs"), path = require("path");
const DIR = path.join(__dirname, "../scenes/madeline-passes"), EL = path.join(DIR, "elements");
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

add({ id: "floor", name: 'Floor', plane: true, across: 0, distance: MID, elevation: 0, width: 2 * W, depth: LEN,
  reflect: { strength: 0.22, fade: 5, rough: 0.2 } }, "e.lib.floor(g, e);");
add({ id: "ceiling", name: 'Vault', plane: true, across: 0, distance: MID, elevation: CE, width: 2 * W, depth: LEN, tilt: 180 }, "e.lib.ceiling(g, e);");
add({ id: "wall_l", name: 'Left wall', across: -W, distance: BACK, facing: 90, height: CE, box: [0, -CE - 0.1, LEN, 0.1] }, "e.lib.leftWall(g, e);");
add({ id: "wall_r", name: 'Right wall with windows', across: W, distance: END, facing: 270, height: CE, box: [0, -CE - 0.1, LEN, 0.1] }, "e.lib.rightWall(g, e);");
add({ id: "windows", name: 'Windows', across: W + 0.03, distance: END, facing: 270, glows: true, height: 8, box: [0, -7.6, 72, -1.3], redraw: { low_sun: 0.1, light_shafts: 0.1 } }, "e.lib.glass(g, e);");
add({ id: "end_wall", name: 'End wall', across: 0, distance: END, facing: 180, height: CE, box: [-W - 0.1, -CE - 0.1, W + 0.1, 0.1] }, "e.lib.endWall(g, e);");
for (let k = 0; k < BAYS; k++) {
  const Z = r3(bay(k));
  add({ id: `arch${k}`, name: 'Arch', across: 0, distance: Z, facing: 180, height: CE, box: [-W - 0.1, -CE - 0.1, W + 0.1, 0.1] }, "e.lib.arch(g, e);");
  add({ id: `arch${k}_pl`, name: 'Arch', across: -HW, distance: Z, facing: 90, height: SPRING, box: [0, -SPRING, DEEP, 0] }, "e.lib.soffit(g, e);");
  add({ id: `arch${k}_pr`, name: 'Arch', across: HW, distance: r3(Z + DEEP), facing: 270, height: SPRING, box: [0, -SPRING, DEEP, 0] }, "e.lib.soffit(g, e);");
  for (let i = 0; i < ARC_STRIPS; i++) {
    const s = strip(i), h = r3(s.len + 0.02);
    add({ id: `arch${k}_l${i}`, name: 'Arch', across: r3(s.x), elevation: r3(s.y), distance: Z, facing: 90, tilt: r3(-s.lean), height: h, box: [0, -h, DEEP, 0] }, "e.lib.soffit(g, e);");
    add({ id: `arch${k}_r${i}`, name: 'Arch', across: r3(-s.x), elevation: r3(s.y), distance: r3(Z + DEEP), facing: 270, tilt: r3(-s.lean), height: h, box: [0, -h, DEEP, 0] }, "e.lib.soffit(g, e);");
  }
}
add({ id: "crack", name: 'Crack', across: 0, distance: r3(bay(2) - 0.015), facing: 180, height: 9, box: [1.6, -10.8, 3.4, -2.0], uniforms: { reach: 0, wide: 0 } },
  "e.lib.crack(g, e);",
  { "animate.js": "const c = e.lib.crackNow(e.state.crack);\ne.uniform('reach', c.reach);\ne.uniform('wide', c.wide);",
    wgsl: "// the crack as far as it has run (reach: metres up the pier), the thin one widening into the wide one\nfn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {\n  let shown = 1.0 - smoothstep(u_reach - 0.03, u_reach + 0.03, -at.y);\n  return mix(layer(1, at), layer(2, at), u_wide) * shown;\n}" });
DOORS.forEach(([a, b], i) => {
  const k = DOOR_BAYS[i], x0 = -W, x1 = -W - ROOM, z0 = a - 2, z1 = b + 2, H = 4.5;
  add({ id: `room${k}_floor`, name: 'Dark room', plane: true, across: r3((x0 + x1) / 2), distance: r3((z0 + z1) / 2), elevation: 0, width: ROOM, depth: r3(z1 - z0) }, `e.lib.room(g, e, ${ROOM}, ${r3(z1 - z0)}, true);`);
  add({ id: `room${k}_ceil`, name: 'Dark room', plane: true, across: r3((x0 + x1) / 2), distance: r3((z0 + z1) / 2), elevation: H, width: ROOM, depth: r3(z1 - z0), tilt: 180 }, `e.lib.room(g, e, ${ROOM}, ${r3(z1 - z0)}, true);`);
  add({ id: `room${k}_back`, name: 'Dark room', across: r3(x1), distance: r3(z0), facing: 90, height: H, box: [0, -H, r3(z1 - z0), 0] }, `e.lib.room(g, e, ${r3(z1 - z0)}, ${H});`);
  add({ id: `room${k}_near`, name: 'Dark room', across: x0, distance: r3(z0), facing: 0, height: H, box: [0, -H, ROOM, 0] }, `e.lib.room(g, e, ${ROOM}, ${H});`);
  add({ id: `room${k}_far`, name: 'Dark room', across: r3(x1), distance: r3(z1), facing: 180, height: H, box: [0, -H, ROOM, 0] }, `e.lib.room(g, e, ${ROOM}, ${H});`);
});
add({ id: "sconce", name: 'Candle in a sconce', across: -W + 0.12, distance: r3(bay(6) + 2.6), elevation: 2.6, height: 0.8, box: [-0.2, -0.4, 0.1, 0.4], glows: true, flicker: 0.35, redraw: { sconce: 0.1 } },
  "e.lib.sconce(g, e);", { "animate.js": "e.lib.sconceLive(e);" });
add({ id: "motes", name: 'Dust in the windows\' light', particles: { kind: "dust", at: [0, 18, 3.6], source: [2 * W - 0.2, 28, 7], rate: 200, life: [10, 16] } });
const who = (id, name, turn, place, extra = {}) => ({ id, name, person: { cast: "cast", who: id, turn, ...extra }, across: place[0], distance: place[1],
  place: { across: `${id}_a`, distance: `${id}_d` }, shadow: true });
add(who("narrator", 'Narrator', 0, [-1.15, 2.7]));
add(who("roderick", 'Roderick', 355, [0.75, 3.4]));
add(who("madeline", 'The Lady Madeline', 85, [-4.6, 20.4], { does: "still", gait: "sleepwalk" }));
add(who("doctor", 'Physician', 90, [-4.6, 20.4]));
add({ id: "closeup", name: 'Close-up', insert: "closeup" },
  "e.kit.closeups.paint(g, e, e.lib.closeup(e.state));", { "animate.js": "e.kit.closeups.live(e, e.lib.closeup(e.state), e.lib.closeupNow(e.state));" });

const pane = (k) => L.windowOf(k, 2).map(([z, y]) => [W, r3(z), r3(y)]);
const panes = L.WINDOW_BAYS.map(pane);
const spec = {
  engine: 3,
  title: 'Madeline passes',
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
    beat: null, camera_x: 0, camera_z: 0, crack: 0.3, light_shafts: 1, low_sun: 0, sconce: 1,
    closeup: 0, shot: "roderick", cu_turn: 0, cu_tear: 0, cu_inhale: 0, cu_blink: 0, speak: 0,
    narrator_a: -1.15, narrator_d: 2.7, narrator_turn: 0, roderick_a: 0.75, roderick_d: 3.4, roderick_turn: 355,
    madeline_a: -4.6, madeline_d: 20.4, madeline_turn: 85, doctor_a: -4.6, doctor_d: 20.4, doctor_here: false,
  },
  states: {
    beat: { type: "string", means: "a beat of the film (the beats module): the name — it plays from the start, at the end the scene says beat:<name>. Beats: " + L.SHOWCASE.join(", ") + "; moments — freeze:still, stay:talk" },
    crack: { range: [0, 1], smooth: true, means: 'the crack on the right pier of arch 2: 0 — none, 1 — run up to the vault and wide (the game sets it by the scale)' },
    light_shafts: { range: [0, 1], smooth: true, means: 'the windows\' evening light (and its rays in the air): 0 — none, 1 — full' },
    low_sun: { range: [0, 1], smooth: true, means: '0 — evening, the windows\' cold light; 1 — another day, a low warm sun (the physician)' },
    sconce: { range: [0, 1], smooth: true, means: 'the candle in the sconce on the left wall: 0 — out, 1 — burning' },
    closeup: { range: [0, 1], means: 'a close-up over the gallery (the closeups module): 0 — none, 1 — open' },
    shot: { values: ["roderick", "madeline", "doctor"], means: 'whose close-up: Roderick (his face in his palms), Madeline (frozen — madeline_still), the physician' },
    cu_turn: { range: [-1, 1], smooth: true, means: 'the face, close: the head\'s turn, + towards the window' },
    cu_tear: { range: [0, 1], smooth: true, means: 'the face, close: a tear — how far it has crept' },
    cu_inhale: { range: [0, 1], smooth: true, means: 'the face, close: a deep breath (0→1→0)' },
    cu_blink: { range: [0, 1], smooth: true, means: 'the face, close: blinking by hand (0 — blinks by itself, unless frozen)' },
    speak: { range: [0, 1], means: 'the lips in the close-up move: the game sets 1 while it says a line, then 0' },
  },
  objects,
  modules: ["cast", "beats", "closeups"],
  music: v1.music,
};
fs.writeFileSync(path.join(DIR, "scene.json"), JSON.stringify(spec, null, 2) + "\n");
console.log(objects.length, "objects");
