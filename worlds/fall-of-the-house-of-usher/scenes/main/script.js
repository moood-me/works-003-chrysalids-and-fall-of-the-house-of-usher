// «The approach to the house» — its mechanics: the film in beats for the game (lib.js FILM, the world's module beats: `beat` names
// one; notes.md tells them); `walk` — where the game sends the two along the causeway («By the hand»: they walk there),
// `walk_at` — where they are; `resist` — how hard Roderick resists (he balks); `follow` — the camera keeps them framed as
// they come.
const L = scene.lib;
// Whoever sets `walk` (the game, step by step) sends the two there: they walk at their own pace, hand in hand; sent back
// towards the house (the hand let go in «By the hand»: he pulls them both back) they step backwards, still facing us; sent
// where they are (within a foot of it), they stop there. The camera with them (`follow`): low on the causeway ahead of
// them, backing as they come (the house behind them) — as long as their walk takes
const STAND = 0.3; // m: sent no further than this from where they are — they stop
let going = [];
const put = (w) => {
  // (only the two on the causeway: not the rider of chapters I and III)
  if (typeof w !== "number" || scene.get("roderick_here") === false) return;
  const here = scene.get("walk_at") ?? w;
  const stand = Math.abs(L.dist(w) - L.dist(here)) < STAND;
  if (stand) {
    for (const a of going) a.cancel();
    going = [];
  } else {
    // (a new walk takes over from the one they are in, smoothly)
    const gait = w < here ? "back_walk" : null;
    going = [scene.person("narrator").walk([L.NARRATOR(w)], { gait }), scene.person("roderick").walk([L.RODERICK(w)], { gait })];
  }
  if (!scene.get("follow")) return;
  const [x, z] = L.tracking(stand ? here : w), over = Math.max(0.6, going[0]?.duration ?? 0);
  scene.move("camera_x", x, { over });
  scene.move("camera_z", z, { over });
};
scene.on("change", "walk", put);
// where the two are along the causeway, in `walk`'s units (from where the narrator stands): kept as they move; and the
// point a game pulls their joined hands toward (the element `lead`: on the causeway a little before them, towards us)
const at = () => {
  const d = scene.get("narrator_d"), a = scene.get("narrator_a");
  if (typeof d !== "number") return;
  scene.set("walk_at", L.walkOf(d));
  if (typeof a === "number") { scene.set("lead_a", a - 0.15); scene.set("lead_d", d - L.LEAD); }
};
scene.on("change", "narrator_d", at);
scene.on("move", "narrator_d", at);
scene.on("load", at);
// How hard Roderick resists (`resist` 0…1): standing, he balks — leans back, the arm drawn out, the face turned away —
// from 0.6, and stands again under 0.5 (on his feet only: not on his knees)
const balk = (v) => {
  const now = scene.get("roderick_do"), name = now?.motion ?? now ?? "stand";
  if (name !== "stand" && name !== "balk") return;
  if (v >= 0.6 && name !== "balk") scene.set("roderick_do", { motion: "balk", loop: true });
  else if (v <= 0.5 && name !== "stand") scene.set("roderick_do", "stand");
};
scene.on("change", "resist", balk);
scene.on("move", "resist", balk);
// (the camera taken up where they are as it begins to follow them)
scene.on("change", "follow", (on) => {
  if (!on) return;
  const [x, z] = L.tracking(scene.get("walk_at") ?? 0);
  scene.move("camera_x", x, { over: 0.8 });
  scene.move("camera_z", z, { over: 0.8 });
});

scene.kit.beats.play(scene, L.FILM);
