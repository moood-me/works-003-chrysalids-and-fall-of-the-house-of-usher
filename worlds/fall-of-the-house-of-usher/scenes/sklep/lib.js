// Склеп — what the vault's elements share (the crack, the mist, the close shots' frame and what they show) and its film:
// the coffin carried in, opened, looked at, shut, screwed down; her eyes from inside; the iron door shut; another night
// outside it — in beats (FILM, at the end), played by the world's module beats: one at a time by the game (`beat`,
// script.js), all of them as the scene's own showcase (showcase.js, SHOWCASE).

// ── the elements' ──
// the torch is in the narrator's hand (the cast's part: his flame — narrator#flame) once he has it, else in its holder
const held = s => [].concat(s.narrator_with ?? []).includes("torch");

// the crack: a zigzag from the vault's top down to the floor, `k` (state crack, 0…1) how far it has run and how wide it
// gapes; points in the wall's metres
const CRACK = [[-1.2, -4.1], [-0.95, -3.7], [-1.15, -3.4], [-0.75, -3.1], [-0.9, -2.8], [-0.5, -2.5], [-0.64, -2.2], [-0.3, -1.95], [-0.4, -1.7], [-0.18, -1.5], [-0.3, -1.2], [-0.08, -0.95], [-0.2, -0.65], [0.02, -0.4], [-0.06, -0.15], [0.05, 0.05]];
const BRANCH = [[-0.75, -3.1], [-0.45, -3.15], [-0.32, -2.95], [-0.12, -2.98]];
function crackPath(g, pts, run) {
  const n = (pts.length - 1) * run;
  g.beginPath();
  g.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i <= Math.ceil(n); i++) {
    const u = Math.min(1, n - (i - 1)), p = pts[i - 1], q = pts[i];
    g.lineTo(p[0] + (q[0] - p[0]) * u, p[1] + (q[1] - p[1]) * u);
  }
}
function crack(g, k) {
  const run = 0.45 + 0.55 * k, w = 0.012 + 0.05 * k;
  g.save();
  g.lineJoin = "miter";
  g.lineCap = "round";
  // (its lit lip, a hair below and aside)
  g.strokeStyle = "rgba(190,200,196," + (0.12 + 0.12 * k).toFixed(3) + ")";
  g.lineWidth = 0.008;
  g.translate(0.025, 0.02);
  crackPath(g, CRACK, run);
  g.stroke();
  g.translate(-0.025, -0.02);
  g.strokeStyle = "#060c0f";
  g.lineWidth = w;
  crackPath(g, CRACK, run);
  g.stroke();
  if (k > 0.3) {
    g.lineWidth = 0.006 + 0.012 * k;
    crackPath(g, BRANCH, anim.span(k, 0.3, 0.8));
    g.stroke();
  }
  g.restore();
}

// the mist lying low: two sheets of soft banks (layers sheet0, sheet1), each drifting its own slow way along the element's
// box — W metres wide from x0, the banks painted so its ends meet — so the banks part and gather and never repeat.
// o: { W, x0, y: [nearest, farthest] (the banks' middles), r: [min, max] (their half-lengths), flat (height over length),
// n (banks), blur, color ("r,g,b"), a (alpha), drift: [sheet0, sheet1] (m/s) }
function mist(g, e, o) {
  for (let L = 0; L < 2; L++)
    e.layer("sheet" + L, { drift: [o.drift[L], 0] }, g => {
      g.filter = "blur(" + o.blur + "px)";
      for (let i = 0; i < o.n; i++) {
        const r = anim.hash(i, 11 + L), v = anim.hash(i, 21 + L);
        if (i % 2 !== L) continue;
        const bx = o.x0 + ((i + 0.5) / o.n) * o.W + (v - 0.5) * 1.2, by = o.y[0] + (o.y[1] - o.y[0]) * r, R = o.r[0] + (o.r[1] - o.r[0]) * r;
        g.fillStyle = "rgba(" + o.color + "," + (o.a * (0.75 + 0.5 * v)).toFixed(3) + ")";
        for (const k of [-1, 0, 1]) {
          g.beginPath();
          g.ellipse(bx + k * o.W, by, R, R * o.flat, 0, 0, 7);
          g.fill();
        }
      }
      g.filter = "none";
    });
}

// The close shots are inserts painted in stage heights; ours (inside, outside) about the frame's middle (CARD: x the
// 16:9 stage's half-width, y 0.5), y −0.5…0.5 about it, x ±0.89 on 16:9 (±1.17 on 21:9): the dark they are cut from
// reaches past any wide screen
const CARD = [8 / 9, 0.5];
function cardDark(g, col) {
  g.fillStyle = col;
  g.fillRect(-1.4, -0.7, 2.8, 1.4);
}
// inside the coffin: the seam (the lid's edge, its hairline of light) — and the four screws' points coming through the
// wood [x, y, from, to]: each comes through over its span of `tip` (inside.wgsl has them too)
const SEAM = -0.2;
const SCREWS = [[-0.5, SEAM + 0.09, 0, 0.4], [0.38, SEAM + 0.08, 0.4, 0.6], [-0.05, SEAM + 0.05, 0.6, 0.78], [0.78, SEAM + 0.06, 0.78, 0.9]];
// (how big a point looks: the nearer her eyes — the lower — the bigger)
const near = y => 0.6 + 4 * (y - SEAM);
// outside the door: where the candle stands, how strongly it burns steadily (its flicker and the knocks move it from
// there: outside.wgsl has them too)
const CANDLE = [-0.55, 0.3], FL = 0.85;

// The module closeups' shots (`closeup` open, `shot` which): 'face' — her face in the coffin: the faint blush on cheek
// and breast (`blush`), the lingering smile, no breath; 'mirror' — closer, the small mirror coming up to her lips
// (`mirror` 0 below the frame … 1 at her lips): it stays clear; 'hands' — her hand at rest and the narrator's coming to
// rest on it (`touch` 0 below the frame … 1 on hers); 'lid' — the shut lid, its four screws (`screw1…4` how far each is
// in; their points closeup#screw1…4 — the game's «Винты») and the driver on screw `screw_at` (1…4; between — the hand on
// its way) while `driver` is 1, in the narrator's hand or Roderick's (`driver_rod` 1); its point closeup#leave between
// them, above (the game's «оставить»). All in the torch's light (the
// hands near it: softer). closeup — what the picture is painted from (only those keys); closeupNow — what moves in it
// without a repaint (its animate's): the mirror coming up, his hand coming down onto hers, her stillness
const HER = { who: "madeline", lying: true, eyes: 0, smile: 0.55, breath: 0, frozen: 1 };
// her white gown under the hands, in soft folds, in the torch's light from the left — dimmer away from it (card units)
function gown(g) {
  const gr = g.createRadialGradient(-0.95, 0.35, 0.05, -0.95, 0.35, 1.9);
  gr.addColorStop(0, "#8c7c68");
  gr.addColorStop(0.45, "#4a423a");
  gr.addColorStop(1, "#141211");
  g.fillStyle = gr;
  g.fillRect(-1.2, -0.6, 2.4, 1.2);
  g.lineCap = "round";
  g.filter = "blur(0.009px)";
  for (let i = 0; i < 7; i++) {
    const y = -0.55 + i * 0.18;
    g.strokeStyle = i % 2 ? "rgba(8,7,7,0.4)" : "rgba(214,190,160,0.1)";
    g.lineWidth = 0.05;
    g.beginPath();
    g.moveTo(-1.2, y + 0.12);
    g.bezierCurveTo(-0.5, y + 0.02, 0.2, y + 0.1, 1.2, y - 0.06);
    g.stroke();
  }
  g.filter = "none";
}
function closeup(s) {
  if (s.shot === "face") return { light: "torch", faces: [{ ...HER, blush: s.blush ?? 0 }] };
  if (s.shot === "mirror") return { light: "torch", faces: [{ ...HER, blush: s.blush ?? 0, size: 1.3, at: [0, -0.35] }], mirror: { at: [0.12, 0.07], fog: 0 } };
  if (s.shot === "hands")
    return {
      light: { like: "torch", power: 1.1 },
      under: gown,
      hands: [
        { name: "mad_hand", who: "madeline", pose: "rest", on: true, frozen: true, at: [-0.25, 0.15], angle: 1.4, size: 0.46 },
        { name: "nar_hand", who: "narrator", pose: "touch", on: true, at: [0.34, 0.2], angle: -1.2, size: 0.48 },
      ],
    };
  // (the lid seen a little higher — pan — its screws in the middle of the frame; its point `leave`: between the screws,
  // above them — where a screw is left as it is)
  if (s.shot === "lid") return { light: "torch", pan: [0, 0.15], screws: { who: s.driver_rod ? "roderick" : "narrator" }, points: [[0, 0, "leave"]] };
  return null;
}
const STILL = { frozen: 1 };
function closeupNow(s) {
  if (s.shot === "mirror") return { madeline: STILL, mirror: { x: 0, y: 0.75 * (1 - anim.ease.inOut(anim.clamp(s.mirror ?? 0, 0, 1))) } };
  if (s.shot === "hands") return { nar_hand: { raise: s.touch ?? 0 } };
  if (s.shot === "lid") return { screws: { v: [s.screw1 ?? 0, s.screw2 ?? 0, s.screw3 ?? 0, s.screw4 ?? 0], at: s.driver ? anim.clamp(s.screw_at ?? 1, 1, 4) - 1 : -1 } };
  return { madeline: STILL };
}

// ── the film ──
// The people are the engine's (elements with "person", the world's cast): <id>_a, <id>_d (metres), _turn (0 away from
// us, 90 to the right, 180 toward us, 270 to the left), _do, _look, _reach, _with, _gait, _on, _here. They move at their
// own pace (a walk at its gait's, a motion done once as long as it is): a beat is as long as its people. The coffin is a
// thing in the vault (coffin_box: where its bottom's middle is, coffin_turn — 180 along the vault, its head to the left);
// the lid lies on it (lid_x: slid toward the foot; lid_h: how high, on its walls or lifted off them); Madeline lies in it.

// (the way from one place to another, in degrees)
const toward = ([a, d], [a2, d2]) => (Math.atan2(a2 - a, d2 - d) * 180) / Math.PI;
const loop = motion => ({ motion, loop: true });
const at = (o, extra) => ({ ...o, ...extra });

// where it all stands (metres: across, distance): the coffin on the plinth; Roderick behind it at its head, and beside
// her once the lid is slid down (his hands on the lid go with it); the narrator behind it by the foot, the torch in his
// left hand; under the torch's holder on the pillar; in the doorway, by the open door's ring
const COFFIN = [-0.5, 4.3], HEAD = [-1.25, 4.98], FOOT = [0.45, 5.02], PILLAR = [2.55, 4.42], HOLDER = [3.0, 4.68], SILL = [2.05, 6.05];
// how high the coffin's bottom is carried (the bearers' hands at its grips, by its top) and on the plinth; the lid slid
// off her face and breast; on its walls, lifted off them
const CARRIED = 0.96, ON_PLINTH = 0.43, SLID = 0.75, ON_WALLS = 0.37, LIFTED = 0.4;
// she lies in it: on its floor, going and turning with it; her arms straight along her sides, her legs straight and
// together — each limb reaching on toward the coffin's foot (its points there: past where they end, so straight)
const IN_IT = "coffin_floor#bed";
const LAID = { r: "coffin_foot#hand_r", l: "coffin_foot#hand_l", foot_r: "coffin_foot#foot_r", foot_l: "coffin_foot#foot_l" };
// his hands on the lid's far edge by the head; the bearers' at the corners of its ends
const ON_LID = { r: "lid#r", l: "lid#l" };
const BEARS = { roderick: { r: "coffin#head", l: "coffin_far#head" }, narrator: { r: "coffin_far#foot", l: "coffin#foot" } };
// the narrator's torch kept where it was, high over them, as he leans to lay his other hand on the lid
const STEADY = [FOOT[0] + 0.25, FOOT[1] - 0.12, 1.72];

// the vault as it stands once the coffin is on the plinth, the torch in the narrator's hand, the lid on her; no close shot
const VAULT = {
  closeup: 0, shot: "", inside: 0, outside: 0, fade: 0,
  camera_x: 0, camera_z: 0, camera_h: 0, camera_look: 0,
  door_turn: 280, lid_x: 0, lid_h: ON_WALLS, torch: 1, knock: 0, answer: 0, touch: 0, mirror: 0,
  coffin_a: COFFIN[0], coffin_d: COFFIN[1], coffin_h: ON_PLINTH, coffin_turn: 180,
  roderick_a: HEAD[0], roderick_d: HEAD[1], roderick_do: "stand", roderick_turn: 180, roderick_look: "coffin",
  roderick_reach: null, roderick_gait: null, roderick_here: true,
  narrator_a: FOOT[0], narrator_d: FOOT[1], narrator_do: loop("hold_torch"), narrator_turn: 180, narrator_look: "coffin",
  narrator_reach: null, narrator_gait: "torch_walk", narrator_with: ["torch"], narrator_here: true,
  madeline_on: IN_IT, madeline_reach: LAID, madeline_do: "lie",
};
// the vault framed closer on the coffin, the eye up and looking down into it (her in it, below its sides); the lid off
// her, Roderick bent over her, his hands on the lid, the torch held high: where the close shots cut back to, and the
// choices are offered
const MEDIUM = { camera_x: -0.35, camera_z: 0.9, camera_h: 0.9, camera_look: 0.3 };
const OPEN = at(VAULT, {
  lid_x: SLID, roderick_a: HEAD[0] + SLID, roderick_d: HEAD[1], roderick_do: loop("lean_over"), roderick_reach: ON_LID,
  roderick_look: "madeline", narrator_do: loop("hold_high"), narrator_look: "madeline", ...MEDIUM,
});
// the lid shut again over her, Roderick bent over it at her head, his hands on it
const SHUT = at(VAULT, { roderick_do: loop("lean_over"), roderick_reach: ON_LID, roderick_look: "lid", narrator_do: loop("hold_high") });
// the lid close: its four screws standing proud, the screwdriver in the narrator's hand on the first
const LID = { closeup: 1, shot: "lid", driver: 1, driver_rod: 0, screw_at: 1, screw1: 0, screw2: 0, screw3: 0, screw4: 0 };

// The paces of the cast's gaits on these people (m/s, as the engine measures them on their legs): what is moved with
// them goes at their pace, never faster or slower
const PACE = { carry_walk: 1.0, carry_back: 0.87, torch_back: 0.99, lean_step_r: 0.27, lean_step_l: 0.2 };

// (how far a walker goes along rows of a way: his place in columns a, d)
function walked(rows, a, d) {
  let m = 0;
  for (let i = 1; i < rows.length; i++) m += Math.hypot(rows[i][a] - rows[i - 1][a], rows[i][d] - rows[i - 1][d]);
  return m;
}

// The coffin carried in: its middle along a curve (a cubic's four points) in through the door and round onto
// the plinth, its head ahead — turned along the way, and straight along the vault as it comes there — the bearers at
// its ends, a step off them, their hands at its corners: [coffin_a, coffin_d, coffin_turn, roderick_a, roderick_d,
// narrator_a, narrator_d]. Its pace is the bearers': the narrator walking forward at the foot, Roderick backing at the
// head — as long as the slower of them takes (CARRY_T)
const OFF = 1.45; // (from its middle to a bearer's hips: half its length and the reach of the hands before them)
function carried(pts, n = 64) {
  const B = (u, k) => (1 - u) ** 3 * pts[0][k] + 3 * (1 - u) ** 2 * u * pts[1][k] + 3 * (1 - u) * u * u * pts[2][k] + u ** 3 * pts[3][k];
  const dB = (u, k) => 3 * (1 - u) ** 2 * (pts[1][k] - pts[0][k]) + 6 * (1 - u) * u * (pts[2][k] - pts[1][k]) + 3 * u * u * (pts[3][k] - pts[2][k]);
  return Array.from({ length: n + 1 }, (_, i) => {
    const u = i / n, a = B(u, 0), d = B(u, 1), along = (Math.atan2(-dB(u, 1), dB(u, 0)) * 180) / Math.PI;
    const w = anim.span(u, 0.55, 1), yaw = along + (180 - along) * w * w * (3 - 2 * w), r = (yaw * Math.PI) / 180;
    const hx = Math.cos(r), hz = -Math.sin(r);
    return [a, d, yaw, a + hx * OFF, d + hz * OFF, a - hx * OFF, d - hz * OFF];
  });
}
const BEARING = ["coffin_a", "coffin_d", "coffin_turn", "roderick_a", "roderick_d", "narrator_a", "narrator_d"];
const IN = carried([[2.3, 6.95], [2.25, 5.3], [1.0, 4.35], COFFIN]), IN0 = IN[0];
const CARRY_T = Math.max(walked(IN, 5, 6) / PACE.carry_walk, walked(IN, 3, 4) / PACE.carry_back);

// The narrator pulls the iron door shut after him: his right hand on its ring, backing out through the
// doorway as it swings to — [door_turn, narrator_a, narrator_d] (its ring an arm's length before him, out toward the
// passage; at the last he steps back from it, the torch before him clear of the iron), at his walking backwards' pace
const HINGE = [1.8, 6.8];
const PULL = Array.from({ length: 41 }, (_, i) => {
  const u = i / 40, turn = 280 - 100 * u, r = (turn * Math.PI) / 180;
  const ring = [HINGE[0] - Math.cos(r) * 0.97, HINGE[1] + Math.sin(r) * 0.97];
  const out = [2.35 - ring[0], 7.7 - ring[1]], l = Math.hypot(...out), away = 0.5 + 0.5 * u * u;
  return [turn, ring[0] + (out[0] / l) * away, ring[1] + (out[1] / l) * away];
});
const PULL_T = walked(PULL, 1, 2) / PACE.torch_back;
// The lid slid along by Roderick bent over it, stepping with it (his hands go with it): from `from` to `to`, his sidestep
// as his gait (the cast's lean_step_r / lean_step_l), at its pace
async function slide(s, from, to) {
  const rod = s.person("roderick"), gait = to > from ? "lean_step_r" : "lean_step_l";
  rod.gait(gait);
  await s.path(["lid_x", "roderick_a"], [[from, HEAD[0] + from], [to, HEAD[0] + to]], { over: Math.abs(to - from) / PACE[gait], ease: "linear" });
  rod.gait(null);
}
// the lid lifted off its seat on the walls, set back down on it
const lift = s => s.move("lid_h", LIFTED, { over: 0.4, ease: "out" });
const lower = s => s.move("lid_h", ON_WALLS, { over: 0.3, ease: "in" });
// the screws driven home over her, as she hears it from inside: each screw in turn, the driver's turns bringing its point
// through the wood (`tip` on to where that turn has it: each screw its own span of `tip` — SCREWS; the first, the longest,
// in two turns) — each turn a change of `tip`, which the game hears (a screw's sound); between the screws the driver set
// to the next
const TURNS = [[0.18, 0.4], [0.6], [0.78], [0.9]];
const TURN = 0.5, AGAIN = 0.5, NEXT = 0.45; // s: a turn bringing a point on; before the next turn of the same screw; to the next screw
async function driven(s) {
  for (const [i, turns] of TURNS.entries()) {
    if (i) await s.wait(NEXT);
    for (const [j, v] of turns.entries()) {
      if (j) await s.wait(AGAIN);
      await s.move("tip", v, { over: TURN, ease: "out" });
    }
  }
}

const FILM = {
  // the showcase's first shot (the scene's picture): the vault, the coffin open on the plinth, Roderick bent over her,
  // the torch held high; the eye drifts in; to black — the story from its start
  vault: {
    from: () => OPEN,
    run: async s => {
      s.move("camera_z", 1.15, { over: 3.8, ease: "inOut" });
      await s.wait(3.0);
      await s.move("fade", 1, { over: 0.8, ease: "in" });
    },
  },
  // the two of them bring the coffin in through the iron door, Roderick backing in at its head, the narrator at its
  // foot, and set it down on the plinth; Roderick goes round behind it to its head; the narrator takes the torch from
  // its holder on the pillar and comes back behind it, by the foot. Out of the dark: the chapter's first sight
  enter: {
    from: () => at(VAULT, {
      fade: 1, coffin_a: IN0[0], coffin_d: IN0[1], coffin_turn: IN0[2], coffin_h: CARRIED,
      roderick_a: IN0[3], roderick_d: IN0[4], roderick_turn: IN0[2] - 90, roderick_gait: "carry_back",
      roderick_reach: BEARS.roderick, roderick_look: "narrator",
      narrator_a: IN0[5], narrator_d: IN0[6], narrator_turn: IN0[2] + 90, narrator_gait: "carry_walk",
      narrator_reach: BEARS.narrator, narrator_with: null, narrator_do: "stand", narrator_look: "roderick",
    }),
    run: async s => {
      const rod = s.person("roderick"), nar = s.person("narrator");
      s.move("fade", 0, { over: 2.2, ease: "out" });
      await s.wait(0.3);
      const carry = s.path(BEARING, IN.slice(1), { over: CARRY_T, ease: "linear" });
      await s.wait(CARRY_T - 1.6);
      rod.look("coffin");
      nar.look("coffin");
      await carry;
      // (standing, they face along it as they carried it: Roderick at its head facing its foot, the narrator his way)
      s.set("roderick_turn", 90);
      s.set("narrator_turn", 270);
      // down onto the plinth, slowly, the weight taken at the last; and let go
      const rd = rod.do("set_down");
      nar.do("set_down");
      s.move("coffin_h", ON_PLINTH, { over: 1.35, ease: "inOut" });
      await rd.ending(1.4);
      rod.reach(null);
      nar.reach(null);
      rod.gait(null);
      nar.gait(null);
      await rd.ending(1.2);
      // Roderick round its head end to behind it; the narrator to the pillar, his hand up to the torch, and back with it
      const round = s.sequence(async q => {
        const r = q.person("roderick");
        await q.wait(0.2);
        await r.walk([[-2.2, 4.55], [-1.95, 5.05], HEAD]);
        await r.turn(180);
        r.look("coffin");
      });
      await nar.walk([[1.5, 4.25], PILLAR]);
      nar.look("torch#grip");
      await nar.turn(toward(PILLAR, HOLDER));
      const take = nar.do("take_torch");
      await s.wait(0.3);
      nar.reach({ l: "torch#grip" });
      await s.wait(0.6);
      nar.with(["torch"]);
      nar.reach(null);
      s.move("camera_z", 0.4, { over: 2.6, ease: "inOut" });
      await take;
      nar.do("hold_torch", { loop: true });
      nar.gait("torch_walk");
      nar.look("coffin");
      await nar.walk([[1.7, 4.98], FOOT]);
      await nar.turn(180);
      await round;
    },
  },
  // Roderick bends over the lid, takes it by its far edge, lifts it off its seat and slides it toward the foot, heavy,
  // stepping along with it, and sets it down; the camera comes in; the narrator raises the torch. Her face, close; back
  // to the coffin
  open: {
    after: "enter",
    from: () => VAULT,
    run: async s => {
      const rod = s.person("roderick"), nar = s.person("narrator");
      const face = s.shot({ closeup: 1, shot: "face" });
      const bend = rod.do("bend_over");
      await s.wait(0.3);
      rod.reach(ON_LID);
      rod.look("lid");
      await s.wait(0.5);
      for (const k in MEDIUM) s.move(k, MEDIUM[k], { over: 4.5, ease: "inOut" });
      await s.wait(0.2);
      nar.look("madeline");
      await bend.ending(1.4);
      await lift(s);
      rod.do("lean_over", { loop: true });
      const raise = s.sequence(async q => {
        await q.wait(0.2);
        await q.person("narrator").do("raise_torch");
        q.person("narrator").do("hold_high", { loop: true });
      });
      const going = slide(s, 0, SLID);
      await s.wait(1.1);
      rod.look("madeline");
      await going;
      await lower(s);
      await raise;
      await s.wait(0.3);
      face.cut();
      // (her face, close: the game's line from here)
      s.tell("open:face");
      await s.wait(4.6);
      // (back: the insert shut, the vault going on under it)
      s.set("closeup", 0);
    },
  },
  // close: the narrator's hand on hers — warm; back to the coffin. (The close-up said ahead as the beat begins: a breath
  // over the coffin, then the cut; his hand going to hers — the scene tells touch:hand, the game's line from there)
  touch: {
    after: ["open", "mirror"],
    from: () => OPEN,
    run: async s => {
      const close = s.shot({ closeup: 1, shot: "hands", touch: 0 });
      await s.wait(1.0);
      close.cut();
      await s.wait(1.2);
      s.tell("touch:hand");
      await s.move("touch", 1, { over: 2.0, ease: "inOut" });
      await s.wait(1.4);
      s.set("closeup", 0);
      s.set("touch", 0);
      await s.wait(0.8);
    },
  },
  // close: the small mirror at her lips — it stays clear; back to the coffin (said ahead as touch's; the mirror going up —
  // the scene tells mirror:up)
  mirror: {
    after: ["open", "touch"],
    from: () => OPEN,
    run: async s => {
      const close = s.shot({ closeup: 1, shot: "mirror", mirror: 0 });
      await s.wait(1.0);
      close.cut();
      await s.wait(1.0);
      s.tell("mirror:up");
      await s.move("mirror", 1, { over: 1.6, ease: "inOut" });
      await s.wait(2.4);
      s.set("closeup", 0);
      s.set("mirror", 0);
      await s.wait(0.8);
    },
  },
  // «She may be alive»: Roderick straightens up, turns his face from her, his hand gripping the coffin's far edge
  say: {
    after: ["open", "touch", "mirror"],
    from: () => OPEN,
    run: async s => {
      const rod = s.person("roderick");
      await s.wait(0.6);
      const up = rod.do("straighten_coffin");
      await s.wait(0.3);
      rod.reach(null);
      await up.ending(0.3);
      const away = rod.turn(270);
      rod.look(null);
      await s.wait(0.5);
      rod.reach({ l: "coffin_far#rim" });
      await away;
      rod.do("grieve", { loop: true });
      await s.wait(1.0);
    },
  },
  // and still he shuts it: he turns back to her, bends over the lid and slides it over her alone; the narrator only
  // holds the light
  shut: {
    after: "say",
    from: () => at(OPEN, { roderick_do: loop("grieve"), roderick_turn: 270, roderick_reach: { l: "coffin_far#rim" }, roderick_look: null }),
    run: async s => {
      const rod = s.person("roderick");
      await s.wait(0.6);
      const back = rod.turn(180);
      await s.wait(0.2);
      rod.look("madeline");
      await s.wait(0.4);
      rod.reach(null);
      await back;
      const bend = rod.do("bend_over");
      await s.wait(0.3);
      rod.reach(ON_LID);
      await bend.ending(1.4);
      await lift(s);
      rod.do("lean_over", { loop: true });
      await s.wait(0.3);
      const going = slide(s, SLID, 0);
      await s.wait(2.6);
      rod.look("lid");
      await going;
      await lower(s);
      await s.wait(1.2);
    },
  },
  // insisting: the narrator leans and lays his hand on the lid; Roderick takes it off and shuts the lid himself, hard
  insist: {
    after: ["open", "touch", "mirror"],
    from: () => OPEN,
    run: async s => {
      const rod = s.person("roderick"), nar = s.person("narrator");
      await s.wait(0.8);
      rod.look("narrator");
      await s.wait(0.2);
      nar.do("lean_hand");
      await s.wait(0.2);
      nar.reach({ r: "lid#n", l: STEADY });
      await s.wait(0.2);
      nar.look("roderick");
      await s.wait(0.7);
      rod.reach({ r: ON_LID.r, l: "narrator#hand_r" });
      await s.wait(0.3);
      nar.reach({ r: [0.3, 4.8, 1.15], l: STEADY });
      await s.wait(0.5);
      rod.reach(ON_LID);
      await s.wait(0.1);
      nar.reach(null);
      nar.do("hold_high", { loop: true });
      rod.look("lid");
      await slide(s, SLID, 0);
      await s.wait(1.0);
    },
  },
  // silent: the narrator lays his hand on the lid and they start it back over her together, slowly; Roderick takes it
  // the rest of the way
  close: {
    after: ["open", "touch", "mirror"],
    from: () => OPEN,
    run: async s => {
      const rod = s.person("roderick"), nar = s.person("narrator");
      await s.wait(0.8);
      nar.do("lean_hand");
      await s.wait(0.2);
      nar.reach({ r: "lid#n", l: STEADY });
      await s.wait(0.2);
      rod.look("lid");
      await s.wait(0.4);
      await lift(s);
      const going = slide(s, SLID, 0);
      await s.wait(0.7);
      nar.reach(null);
      await s.wait(0.2);
      nar.do("hold_high", { loop: true });
      await going;
      await lower(s);
      await s.wait(1.0);
    },
  },
  // close: the lid, its four screws standing proud, the screwdriver in the narrator's hand on the first — «Винты»
  // turns them. It begins with a cut (said ahead by the module beats as the beat before it begins: the game names it in
  // beat_next)
  screws: {
    after: [],
    from: () => at(SHUT, LID),
    run: async s => {
      await s.wait(1.35);
    },
  },
  // close: Roderick takes the driver (a cut, said ahead as the beat begins: his hand on the lid) and drives home the
  // screws left loose; to black
  check: {
    after: "screws",
    from: () => at(SHUT, { closeup: 1, shot: "lid", driver: 1, driver_rod: 0, screw_at: 1 }),
    run: async s => {
      const loose = [1, 2, 3, 4].filter(i => (s.state["screw" + i] ?? 0) < 1);
      const his = s.shot({ driver_rod: 1, driver: 1, screw_at: loose[0] ?? 1 });
      await s.wait(1.0);
      his.cut();
      await s.wait(1.1);
      const each = loose.length ? 4.2 / loose.length : 0;
      for (const [n, i] of loose.entries()) {
        if (n) await s.move("screw_at", i, { over: 0.5, ease: "inOut" });
        await s.move("screw" + i, 1, { over: each - (n ? 0.6 : 0.1), ease: "inOut" });
      }
      await s.wait(0.3);
      await s.move("fade", 1, { over: 0.6, ease: "in" });
    },
  },
  // her eyes: inside the shut coffin — the thread of light, the shadows of them over it as they work, the screws' points
  // coming through one after another as the driver turns them (driven: each turn a change of `tip`); the light goes
  inside: {
    from: () => at(SHUT, { closeup: 0, shot: "", inside: 1, seam: 1, tip: 0, shade: 0, fade: 1 }),
    run: async s => {
      await s.wait(0.6);
      s.move("fade", 0, { over: 1.6, ease: "inOut" });
      await s.wait(1.4);
      s.move("shade", 1, { over: 2.6, ease: "inOut" });
      await s.wait(1.4);
      await driven(s);
      await s.move("seam", 0.35, { over: 1.6, ease: "inOut" });
      await s.move("seam", 0, { over: 1.2, ease: "in" });
    },
  },
  // they go out: Roderick through the door and up the steps beyond, gone; the narrator lowers the torch, stops in the
  // doorway by the open door and looks back at the coffin
  leave: {
    from: () => SHUT,
    run: async s => {
      const rod = s.person("roderick"), nar = s.person("narrator");
      const gone = s.sequence(async q => {
        const r = q.person("roderick");
        await q.wait(0.6);
        const up = r.do("straighten_coffin");
        await q.wait(0.2);
        r.reach(null);
        await q.wait(0.2);
        r.look(null);
        await up.ending(0.6);
        // (behind the narrator's way, out through the door and up the steps)
        await r.walk([[-1.0, 5.45], [0.6, 6.0], [1.95, 6.3], [2.35, 6.95], [2.7, 7.4], [3.5, 7.45]]);
        r.here(false);
      });
      await s.wait(1.6);
      await nar.do("lower_torch");
      nar.do("hold_torch", { loop: true });
      await nar.walk([[1.2, 5.25], SILL]);
      await nar.turn(toward(SILL, COFFIN));
      nar.look("coffin");
      await gone;
      await s.wait(1.0);
    },
  },
  // he takes the ring of the open door and backs out through the doorway pulling it after him: heavy, then shut; the
  // torchlight is cut off
  door_close: {
    after: "leave",
    from: () => at(SHUT, { roderick_here: false, roderick_reach: null, narrator_a: SILL[0], narrator_d: SILL[1], narrator_turn: toward(SILL, COFFIN), narrator_do: loop("hold_torch"), narrator_look: "coffin" }),
    run: async s => {
      const nar = s.person("narrator");
      await s.wait(0.1);
      nar.look("door#ring");
      await s.wait(0.2);
      nar.reach({ r: "door#ring" });
      await s.wait(0.6);
      nar.gait("torch_back");
      await s.wait(0.1);
      const pull = s.path(["door_turn", "narrator_a", "narrator_d"], PULL.slice(1), { over: PULL_T, ease: "linear" });
      await s.wait(PULL_T - 0.2);
      s.move("torch", 0, { over: 1.1, ease: "in" });
      await s.wait(0.2);
      nar.reach(null);
      await s.wait(0.9);
    },
  },
  // another night: outside the shut iron door, one candle; «Стук» knocks on it (knock, answer)
  at_door: {
    from: () => at(SHUT, { outside: 1, knock: 0, answer: 0, roderick_here: false, narrator_here: false, door_turn: 180, torch: 0, fade: 1 }),
    run: async s => {
      await s.wait(0.4);
      await s.move("fade", 0, { over: 2.6, ease: "inOut" });
    },
  },
  // (the showcase's: «Стук» as the game plays it — two knocks, the silence, two answering from the other side)
  knock: {
    after: "at_door",
    from: () => at(SHUT, { outside: 1, knock: 0, answer: 0, roderick_here: false, narrator_here: false, door_turn: 180, torch: 0 }),
    run: async s => {
      const pulse = key => { s.set(key, 1); return s.move(key, 0, { over: 1.5, ease: "linear" }); };
      await s.wait(0.8);
      for (const key of ["knock", "knock", null, "answer", "answer"]) {
        if (key) pulse(key);
        await s.wait(key ? 0.75 : 2.5);
      }
      await s.wait(2.5);
    },
  },
};
// the showcase: the whole chapter in the vault — every way the lid can go (insist, close, say and shut, each from the
// coffin open again), the screws, the inside, the door, the night outside it
const SHOWCASE = ["vault", "enter", "open", "touch", "mirror", "insist", "close", "say", "shut", "screws", "check", "inside", "leave", "door_close", "at_door", "knock"];

return { held, crack, mist, CARD, cardDark, SEAM, SCREWS, near, CANDLE, FL, closeup, closeupNow, FILM, SHOWCASE };
