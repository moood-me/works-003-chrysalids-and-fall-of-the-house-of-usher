// The film in beats (module film): the viewer of the world sees `film`, one beat after another (~73 s); a game
// plays them one at a time — and the branches: David comes alone (Petra already in the pannier), takes Sheba
// along instead of sending her home, stops in the hollow behind the ridge while the search peers from the crest
// (spotted or not), and what Rosalind's bow does then.
const start = {
  dawn: 0.1,
  mist: 0.7,
  fog: 0,
  pursuers: 0.12,
  fade: 1,
  camera_x: 0,
  camera_z: 0,
  gx: 0.3,
  great_toss: 0,
  pack_rest: 1,
  pack_graze: 0,
  pack_toss: 0,
  sheba_a: -13,
  sheba_face: 90,
  sheba_rear: 0,
  sheba_toss: 0,
  sheba_led: 0,
  david_down: 0,
  david_a: -1.15,
  david_pat: 0,
  david_tie: 0,
  ros_draw: 0,
  david_far_face: 90,
  david_face: 90,
  david_lift: 0,
  david_raise: 0,
  david_slap: 0,
  david_slump: 0,
  david_climb: 0,
  petra_up: 0,
  petra_peek: 0,
  petra_face: 90,
  ros_face: -90,
  ros_reach_p: 0,
  ros_reach_d: 0,
  ros_bow: 0,
  search_a: -20,
  search2_a: -23.4,
  search_face: 90,
  search2_face: 90,
  search_look: 0,
  search_point: 0,
  search_rear: 0,
  lamp: 0,
  lamp_x: 6,
  fallen: 0,
  fallen_a: 0,
  arrow: 0,
  arrow_high: false,
};
// where each beat begins (all of `start`, and what the beats before it changed)
const at = (o) => ({ ...start, ...o });
const met = { fade: 0, pursuers: 0.35, sheba_a: -0.6, camera_z: 2.2 }; // Sheba has come up to the great-horses
const handed = { ...met, david_down: 1, david_a: -0.45, petra_up: 1, petra_peek: 0.8, petra_face: -90 }; // Petra in the pannier
const turned = { ...handed, sheba_face: -90, david_a: -0.25, david_pat: 1 }; // Sheba turned for home, his hand on her neck
const off = { ...handed, sheba_face: -90, sheba_a: -16, david_a: -0.25, david_face: -90, david_slump: 0.8 }; // she has gone
const aboard = { ...off, david_slump: 0, david_face: 90, david_climb: 1, petra_face: 90 }; // David in the far pannier
const armed = { ...aboard, pursuers: 0.65, ros_bow: 1, ros_draw: 1, david_far_face: -90, petra_peek: 0.3 }; // the bow drawn at the lanterns
const hollow = { ...armed, ros_draw: 0, pack_rest: 1, gx: 11.3, fog: 0.6, dawn: 0.25, camera_z: -2.5, camera_x: 5.2 }; // stopped in the hollow
const watched = { ...hollow, search_a: 0.9, search2_a: -1.7, search_look: 1, lamp: 0.6, lamp_x: 7 }; // the search on the crest

scene.kit.film.beats(
  scene,
  {
    // I. Night on the ridge: the great-horses wait, Rosalind in a pannier watching the track; lanterns far behind.
    // Sheba comes up the track at a trot with Petra and David, and stops by the great-horse
    arrive: {
      from: start,
      rows: [
        [0, "fade", 0, 2.5, "out"],
        [0.5, "pursuers", 0.35, 10],
        [1, "sheba_a", -0.6, 9, "out"],
        [6.5, "camera_z", 2.2, 5, "inOut"],
        [9.3, "great_toss", 1, 0.4],
        [10.2, "great_toss", 0, 1.2],
      ],
    },
    // (game) Petra is already in the pannier beside Rosalind; David rides up alone; she rises to see him, he slides down
    arrive_alone: {
      from: at({ petra_up: 1, petra_peek: 0.5, petra_face: -90 }),
      rows: [
        [0, "fade", 0, 2.5, "out"],
        [0.5, "pursuers", 0.35, 10],
        [1, "sheba_a", -0.6, 8, "out"],
        [5.5, "camera_z", 2.2, 5, "inOut"],
        [6.2, "petra_peek", 1, 0.8, "out"],
        [8.3, "great_toss", 1, 0.4],
        [9.2, "great_toss", 0, 1.2],
        [9.4, "david_down", 1, 1.6, "inOut"],
        [11.2, "david_a", -0.45, 0.7, "inOut"],
        [11.6, "petra_peek", 0.8, 1.2],
      ],
    },
    // II. David slides down; lifts Petra; Rosalind takes her into the pannier
    handover: {
      after: "arrive",
      from: at(met),
      rows: [
        [0, "david_down", 1, 1.6, "inOut"],
        [1.8, "david_a", -0.45, 0.7, "inOut"],
        [2.2, "david_lift", 1, 0.6],
        [2.3, "petra_up", 0.45, 1.4, "inOut"],
        [3.4, "ros_reach_p", 1, 0.7],
        [4.0, "petra_up", 0.78, 1.1, "inOut"],
        [5.0, "david_lift", 0, 0.9],
        [5.2, "petra_up", 1, 1.0, "inOut"],
        [6.0, "ros_reach_p", 0, 0.9],
        [6.6, "petra_peek", 0.8, 1.2, "out"],
        [6.8, "petra_face", { turn: -90 }, 1],
      ],
    },
    // III. He turns Sheba for home and lays his hand on her neck (the game asks here: send her home, or take her)
    sheba_turn: {
      after: ["handover", "arrive_alone"],
      from: at(handed),
      rows: [
        [0, "sheba_face", { turn: -90 }, 2.2],
        [0.2, "david_a", -0.25, 1.6, "inOut"],
        [1.4, "david_pat", 1, 0.7],
      ],
    },
    // IV. He raises his hand, slaps her rump: she bolts back alone. No way back
    sheba_go: {
      after: "sheba_turn",
      from: at(turned),
      rows: [
        [0, "david_pat", 0, 0.5],
        [0.4, "david_raise", 1, 0.5, "out"],
        [1.3, "david_slap", 1, 0.16, "in"],
        [1.42, "sheba_rear", 0.6, 0.25, "out"],
        [1.7, "sheba_rear", 0, 0.7],
        [1.6, "sheba_a", -16, 4.6, "in"],
        [1.5, "sheba_toss", 1, 0.3],
        [2.6, "sheba_toss", 0, 0.8],
        [1.6, "david_slap", 0, 0.7],
        [1.7, "david_raise", 0, 0.7],
        [2.2, "david_face", { turn: -90 }, 0.9],
        [3.8, "david_slump", 0.8, 1.6],
      ],
    },
    // (game) He cannot: leads her back past the great-horses and ties her rein to the pack horse's crupper
    sheba_keep: {
      after: "sheba_turn",
      from: at(turned),
      rows: [
        [1.2, "david_pat", 0, 0.5],
        [1.3, "david_face", { turn: -90 }, 0.8],
        [1.6, "sheba_a", -7.6, 6.2, "inOut"],
        [1.6, "david_a", -7.1, 6.2, "inOut"],
        [1.8, "camera_x", -3.4, 5.8, "inOut"],
        [7.9, "sheba_face", { turn: 90 }, 2.2],
        [8.0, "david_a", -7.2, 1.1, "inOut"],
        [8.2, "david_face", { turn: 90 }, 1],
        [10.0, "david_tie", 1, 0.6],
        [11.2, "sheba_toss", 0.6, 0.3],
        [11.6, "sheba_toss", 0, 0.8],
        [11.6, "david_tie", 0, 0.5],
        [12.1, "sheba_led", 1],
        [12.2, "david_a", -0.25, 5.2, "inOut"],
        [12.4, "camera_x", 0, 5, "inOut"],
      ],
    },
    // V. He turns to the great-horse and climbs it, Rosalind's hand pulling him up, into the far pannier
    climb: {
      after: ["sheba_go", "sheba_keep"],
      from: at(off),
      rows: [
        [0, "david_slump", 0, 0.6],
        [0.2, "david_face", { turn: 90 }, 0.7],
        [0.8, "david_climb", 0.15, 1.0],
        [1.5, "ros_reach_d", 1, 0.6],
        [2.0, "david_climb", 0.7, 2.6, "inOut"],
        [2.2, "petra_face", { turn: 90 }, 0.8],
        [4.4, "ros_reach_d", 0, 0.8],
        [4.6, "david_climb", 1, 1.2, "inOut"],
      ],
    },
    // VI. Rosalind turns forward, then looks back at the lanterns and takes up her bow, draws it; Petra ducks
    bow: {
      after: "climb",
      from: at(aboard),
      rows: [
        [0, "ros_face", { turn: 90 }, 0.9],
        [0.9, "pursuers", 0.65, 6],
        [1.6, "ros_face", { turn: -90 }, 1.0],
        [2.1, "david_far_face", { turn: -90 }, 1.1],
        [2.4, "ros_bow", 1, 0.6],
        [2.8, "petra_peek", 0.3, 1.0],
        [3.0, "ros_draw", 1, 0.9],
        [4.4, "great_toss", 0.5, 0.3],
        [5.0, "great_toss", 0, 0.8],
      ],
    },
    // VII. They go: walk, then trot, over the ridge's shoulder, down through the fog of the hollow and out of sight —
    // Rosalind the last, looking back with her bow. The camera comes back to the empty crest
    go: {
      after: "bow",
      from: at(armed),
      rows: [
        [0, "pack_rest", 0, 0.5],
        [0.1, "gx", 2.8, 4, "in"],
        [1.2, "david_far_face", { turn: 90 }, 0.9],
        [2.1, "ros_draw", 0, 0.9],
        [4.1, "gx", 24, 13, "linear"],
        [0.1, "camera_z", 0, 6, "inOut"],
        [0.6, "camera_x", 6, 10, "inOut"],
        [1.6, "dawn", 0.45, 17],
        [3, "fog", 0.75, 8],
        [5.6, "mist", 0.85, 12],
        [5.6, "pursuers", 0.85, 12],
        [13.5, "camera_x", -1.2, 6.5, "inOut"],
      ],
    },
    // VIII. The search comes up the track with lanterns, stops on the empty crest, raises a lantern, peers into the mist
    search: {
      after: "go",
      from: at({ ...armed, ros_draw: 0, david_far_face: 90, pack_rest: 0, gx: 24, fog: 0.75, dawn: 0.4, mist: 0.85, pursuers: 0.85, camera_x: -1.2 }),
      rows: [
        [0, "search_a", -3.8, 11, "out"],
        [0, "search2_a", -7.2, 11.5, "out"],
        [11.5, "search_look", 1, 2.2],
      ],
    },
    // (game) over the shoulder and down into the hollow, and there they stop in the fog; the camera draws back to
    // hold the hollow and the crest above it
    hollow: {
      after: "bow",
      from: at(armed),
      rows: [
        [0, "pack_rest", 0, 0.5],
        [0.1, "gx", 2.8, 4, "in"],
        [2.1, "ros_draw", 0, 0.9],
        [4.1, "gx", 11.3, 6.5, "out"],
        [0.1, "camera_z", -2.5, 9, "inOut"],
        [0.6, "camera_x", 5.2, 9, "inOut"],
        [1.6, "dawn", 0.25, 9],
        [3, "fog", 0.6, 6],
        [3, "petra_peek", 0.5, 1.5],
        [10.4, "pack_rest", 1, 1],
      ],
    },
    // (game) the search comes up onto the crest above the hollow; the first one raises his lantern toward the fog
    watch: {
      after: "hollow",
      from: at(hollow),
      rows: [
        [0, "search_a", 0.9, 11, "out"],
        [0, "search2_a", -1.7, 11.5, "out"],
        [11, "search_look", 1, 2.2],
        [11.8, "lamp_x", 7, 0.1],
        [11.8, "lamp", 0.6, 1.6],
      ],
    },
    // (game) spotted: he points into the hollow, the other turns back for the rest; he rides down to its edge
    spotted: {
      after: "watch",
      from: at(watched),
      rows: [
        [0, "search_point", 1, 0.5, "out"],
        [0, "lamp", 1, 0.5],
        [0.8, "search2_face", { turn: -90 }, 1],
        [1.2, "search2_a", -16, 5, "in"],
        [1.6, "search_point", 0, 0.8],
        [1.8, "search_a", 2.0, 3, "inOut"],
      ],
    },
    // (game) not spotted: the other one rides back for the rest; the first stays on the crest to keep the road
    stay: {
      after: "watch",
      from: at(watched),
      rows: [
        [0.5, "search2_face", { turn: -90 }, 1.2],
        [1.2, "search2_a", -16, 8, "in"],
        [1.5, "search_look", 0.6, 2],
        [1.5, "lamp", 0.35, 2],
        [2, "lamp_x", 5, 4],
      ],
    },
    // (game) Rosalind draws, the arrow takes him; he goes back off the saddle and lies on the crest by his lantern;
    // his horse bolts back over the ridge alone
    kill: {
      after: ["spotted", "stay"],
      from: at({ ...watched, search_a: 2.0, search2_a: -16, search2_face: -90 }),
      rows: [
        [0, "arrow", 0],
        [0, "arrow_high", false],
        [0, "ros_face", { turn: -90 }, 0.6],
        [0, "ros_bow", 1, 0.4],
        [0.3, "ros_draw", 1, 0.9],
        [1.6, (/* the place he falls */) => scene.set("fallen_a", scene.get("search_a"))],
        [1.6, "arrow", 1, 0.45, "linear"],
        [2.05, "fallen", 1, 2.4],
        [2.05, "lamp", 0, 1.2],
        [2.3, "search_face", { turn: -90 }, 0.6],
        [2.6, "search_a", -16, 4, "in"],
        [2.6, "ros_draw", 0, 0.8],
        [4.5, "petra_peek", 0, 1],
      ],
    },
    // (game) over his head: his horse shies up, he wheels it round and gallops back over the crest
    warn: {
      after: ["spotted", "stay"],
      from: at({ ...watched, search_a: 2.0, search2_a: -16, search2_face: -90 }),
      rows: [
        [0, "arrow", 0],
        [0, "arrow_high", true],
        [0, "ros_face", { turn: -90 }, 0.6],
        [0, "ros_bow", 1, 0.4],
        [0.3, "ros_draw", 1, 0.9],
        [1.6, "arrow", 1, 0.6, "linear"],
        [2.0, "search_rear", 1, 0.4, "out"],
        [2.0, "search_look", 0.3, 0.4],
        [2.6, "search_rear", 0, 0.8],
        [2.5, "search_face", { turn: -90 }, 0.7],
        [2.6, "lamp", 0, 0.8],
        [3.0, "search_a", -16, 4, "in"],
        [2.8, "ros_draw", 0, 0.8],
      ],
    },
    // (game) still in the fog: the fog thickens, Rosalind lowers her bow, Petra ducks; he rides along the edge
    // of the hollow with his lantern low, stops right above them — turns and rides away
    hide: {
      after: ["spotted", "stay"],
      from: at({ ...watched, search_a: 2.0, search2_a: -16, search2_face: -90 }),
      rows: [
        [0, "ros_draw", 0, 0.8],
        [0, "fog", 1, 3],
        [0.3, "petra_peek", 0, 1],
        [0.5, "search_look", 0.75, 1.5],
        [0.5, "lamp", 0.8, 1.5],
        [1.0, "search_a", 3.0, 5, "inOut"],
        [1.0, "lamp_x", 9.5, 7, "inOut"],
        [8.0, "lamp_x", 6, 3, "inOut"],
        [11.0, "search_face", { turn: -90 }, 1.2],
        [11.2, "lamp", 0, 2],
        [11.8, "search_a", -16, 7, "in"],
      ],
    },
    // (game) on, down out of the hollow toward the trees; it grows light
    away: {
      after: ["kill", "warn", "hide"],
      from: at({ ...hollow, search_a: -16, search2_a: -16, search_face: -90, search2_face: -90, lamp: 0 }),
      rows: [
        [0, "pack_rest", 0, 0.5],
        [0, "ros_face", { turn: 90 }, 1.2],
        [0.6, "david_far_face", { turn: 90 }, 1.2],
        [0.3, "petra_peek", 0.3, 1],
        [0.5, "gx", 24, 12, "in"],
        [0, "dawn", 0.5, 14],
        [0, "fog", 0.8, 6],
        [1, "camera_x", 7, 9, "inOut"],
      ],
    },
  },
  { film: ["arrive", "handover", "sheba_turn", "sheba_go", "climb", "bow", "go", "search"] },
);
