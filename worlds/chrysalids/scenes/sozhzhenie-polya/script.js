// The film in beats (modules/film.md): a game plays them one by one; the world's viewer sees the cut `film`.
const K = scene.kit.chrysalids;
// the congregation: where each stands [across, distance, face]
const P = [
  [-5.0, 7.6, 140],
  [-4.3, 7.0, 145],
  [-5.7, 6.4, 135],
  [-3.6, 6.6, 150],
  [-4.8, 5.6, 140],
  [-6.0, 4.8, 130],
  [-2.9, 7.7, 155],
  [3.4, 7.8, 212],
  [4.3, 7.1, 215],
  [2.7, 6.8, 205],
  [5.2, 6.2, 220],
  [3.7, 5.5, 212],
  [4.7, 4.8, 222],
];
const people = (where) => Object.fromEntries(P.flatMap((p, i) => Object.entries(where(p, i)).map(([k, v]) => [`p${i}_${k}`, v])));
// the first moment: the blue before dawn, all standing heads bowed, David holding his mother's hand
const S0 = {
  fade: 1, dawn: 0.22, fire: 0, ignite: 0, ash: 0, smoke: 0, camera_x: 0, camera_z: 0,
  jo_a: -0.5, jo_d: 6.8, jo_f: 180, jo_raise: 0, jo_down: 0, jo_up: 0, jo_bow: 0, jo_torch: 0, jo_tip: 0, jo_look: 0, jo_lookw: 0,
  in_a: 1.35, in_d: 7.0, in_f: 180, in_kneel: 0, in_ear: 0, in_show: 0, in_nod: 0, in_nodc: 0, in_toss: 0, in_bow: 0, in_lift: 0, in_gone: 0,
  em_a: -1.6, em_d: 4.95, em_f: 150, em_look: 0, em_lookw: 0, em_pull: 0, hand: 1,
  dv_a: -1.05, dv_d: 4.55, dv_f: 150, dv_hide: 0, dv_kneel: 0, dv_sing: 0, dv_reach: 0, dv_freeze: 0, dv_atfa: 0, dv_atst: 0,
  kneel: 0, sing: 0, look: 0, heat: 0, turned: 0, morning: 0,
  ...people(([a, d, f]) => ({ a, d, f })),
};
// where each beat begins (its `from`): the moment before, as the beat before leaves it
const DAWN = { ...S0, fade: 0, dawn: 0.25, in_a: 1.0, in_d: 8.85, in_f: 180, in_ear: 1 };
const EAR = { ...DAWN, dawn: 0.28, in_a: 0.4, in_d: 7.0, in_f: 170, in_ear: 0, in_nodc: 1.4, in_toss: 1, jo_f: 100, jo_up: 0.25 };
const RAISED = { ...EAR, jo_f: 180, jo_raise: 1, jo_up: 0.8, kneel: 1, in_f: 200, in_bow: 1 };
const RISEN = { ...RAISED, jo_raise: 0, jo_up: 0, kneel: 0, in_bow: 0 };
const LIT = { ...RISEN, in_f: -80, jo_f: 100, jo_torch: 1, look: 0.7, camera_x: -0.05, camera_z: 1.7 };
const BURNING = { ...LIT, camera_x: 0, camera_z: 0, look: 0.5, jo_a: -2.0, jo_d: 8.95, jo_f: -90, jo_down: 0.75,
  in_a: 2.3, in_d: 7.6, in_f: 200, fire: 1, ignite: 0.07, smoke: 0.35 };
// the front ones step back from the heat
const back = (d) => (d > 6.2 ? d - 0.55 : d);
const HYMN = { ...BURNING, jo_down: 0, jo_a: -1.0, jo_d: 7.6, jo_f: 0, jo_raise: 1, jo_up: 0.45, look: 0, sing: 1, heat: 1,
  ignite: 0.4, smoke: 0.75, camera_x: -0.95, camera_z: 1.45, ...people(([, d]) => ({ d: back(d) })) };
const HID = { ...HYMN, hand: 0, dv_a: -1.66, dv_d: 4.68, dv_f: 172, dv_hide: 1, jo_look: 34 };
// the grey morning after (set at once under the black)
const GREY = { ash: 1, ignite: 1, fire: 0.12, smoke: 0.42, dawn: 0.82, sing: 0, look: 0, heat: 0, turned: 0, jo_raise: 0,
  jo_torch: 0, jo_up: 0, jo_bow: 0.15, jo_f: 180, jo_lookw: 0, em_lookw: 0, dv_sing: 0, morning: 1 };
// the left ones go home by the track toward Waknuk, the right ones across the fields
const homeL = (i) => -3.45 + 0.3 * Math.sin(i * 2.1);
const home = ([a, d], i) => (a < 0 ? { a: homeL(i), d: 34 } : { a: a + 9, d: d + 3 });
const BY_STALK = { ...HID, ...GREY, fade: 0, camera_x: -2.3, camera_z: 3.6, ...people(home), in_a: 5.2, in_d: 26,
  em_a: -3.6, em_d: 9.0, em_f: 180, dv_a: -3.15, dv_d: 8.3, dv_f: 125, dv_atst: 1, dv_hide: 0, hand: 1 };

const W = (who, to, o) => () => K.walkTo(scene, { a: who + "_a", d: who + "_d", f: who + "_f" }, to, o);
const set = (o) => () => Object.entries(o).forEach(([k, v]) => scene.set(k, v));

scene.kit.film.beats(
  scene,
  {
    // out of the black: the blue before dawn; the Inspector goes to the edge of the field, goes down on one knee and
    // breaks off an ear
    dawn: {
      from: S0,
      rows: [
        [0, "fade", 0, 2.2, "out"],
        [0, "dawn", 0.25, 9.2],
        [1.0, W("in", [1.0, 8.85], { speed: 0.8, faceEnd: 180 })],
        [5.6, "in_kneel", 1, 1.6],
        [7.0, "in_ear", 1],
        [7.6, "in_kneel", 0, 1.6],
      ],
    },
    // he brings it to Strorm and holds it up in the lantern light (the camera comes in); the people raise their heads;
    // a long look, two slow nods: an Offence; he turns and flings it over his shoulder back into the wheat
    ear: {
      after: "dawn",
      from: DAWN,
      rows: [
        [0, "camera_z", 2.4, 4.5, "inOut"],
        [0, "camera_x", 0.15, 4.5, "inOut"],
        [0, "dawn", 0.28, 12],
        [0.4, W("in", [0.4, 7.0], { speed: 0.8, faceEnd: -75 })],
        [3.0, "jo_f", 100, 1.0, "inOut"],
        [4.0, "in_show", 1, 1.2, "out"],
        [4.2, "look", 1, 2.0],
        [4.6, "jo_up", 0.25, 1.2],
        [6.6, "in_show", 0.8, 0.5],
        [6.8, "in_nod", 2.4, 0.3],
        [6.8, "in_nodc", 1.4, 1.8, "linear"],
        [8.6, "in_nod", 0, 0.4],
        [9.0, "in_show", 0, 0.6],
        [9.1, "in_f", 170, 0.8],
        [9.8, "in_toss", 1, 1.5, "linear"],
        [10.8, "look", 0, 1.5],
        [11.0, "camera_z", 0, 3.0, "inOut"],
        [11.0, "camera_x", 0, 3.0, "inOut"],
        [11.4, "in_ear", 0],
      ],
    },
    // Strorm lifts the unlit torch to heaven; the people go down on their knees and pray. David does not: he kneels
    // when the game says (dv_kneel) — or in kneel_late
    raise: {
      after: "ear",
      from: EAR,
      rows: [
        [0, "jo_f", 180, 1.0],
        [0, "jo_up", 0, 0.6],
        [0.6, "jo_raise", 1, 1.6, "anticipate"],
        [1.0, "jo_up", 0.8, 1.4],
        [1.4, "kneel", 1, 1.8],
        [1.6, "in_f", 200, 1.2],
        [1.6, "in_bow", 1, 1.5],
      ],
    },
    // David knelt with them: a held prayer; all get up together
    rise: {
      after: "raise",
      from: { ...RAISED, dv_kneel: 1 },
      rows: [
        [3.4, "jo_raise", 0, 1.4, "inOut"],
        [3.6, "jo_up", 0, 1.2],
        [3.8, "kneel", 0, 1.9],
        [4.0, "in_bow", 0, 1.0],
        [4.1, "dv_kneel", 0, 1.6],
      ],
    },
    // David still standing among the kneeling: the camera finds him, his mother looks up at him and tugs his hand; he
    // goes down, last of all — and gets up last
    kneel_late: {
      after: "raise",
      from: RAISED,
      rows: [
        [0, "camera_x", -0.5, 1.6, "inOut"],
        [0, "camera_z", 0.9, 1.6, "inOut"],
        [0, "em_lookw", 1, 0.5],
        [0, "em_look", -90, 0.6],
        [0.3, "em_pull", 0.6, 0.5, "out"],
        [0.6, "dv_kneel", 1, 1.3],
        [1.0, "em_pull", 0, 0.6],
        [1.4, "em_lookw", 0, 0.8],
        [3.6, "jo_raise", 0, 1.4, "inOut"],
        [3.8, "jo_up", 0, 1.2],
        [3.8, "camera_x", 0, 2.5, "inOut"],
        [3.8, "camera_z", 0, 2.5, "inOut"],
        [4.0, "kneel", 0, 1.9],
        [4.0, "in_bow", 0, 1.0],
        [5.4, "dv_kneel", 0, 1.6],
      ],
    },
    // he turns to the Inspector and lights the torch at his lantern (the camera comes in)
    light: {
      after: ["rise", "kneel_late"],
      from: RISEN,
      rows: [
        [0, "in_f", -80, 1.0],
        [0.2, "camera_z", 1.7, 3.6, "inOut"],
        [0.2, "camera_x", -0.05, 3.6, "inOut"],
        [0.3, "jo_f", 100, 1.0],
        [1.1, "in_lift", 1, 0.9, "out"],
        [1.5, "jo_tip", 1, 1.1, "inOut"],
        [2.8, "jo_torch", 1.5, 0.35, "out"],
        ["+0", "jo_torch", 1, 1.0, "inOut"],
        [2.9, "look", 0.7, 1.2],
        [4.0, "jo_tip", 0, 0.9, "inOut"],
        [4.2, "in_lift", 0, 0.9],
      ],
    },
    // to the wheat; the torch up, then down into the stalks: it catches; he drags the fire along the edge to the track
    fire: {
      after: "light",
      from: LIT,
      rows: [
        [0, "camera_z", 0, 4.2, "inOut"],
        [0, "camera_x", 0, 4.2, "inOut"],
        [0, W("jo", [0.4, 8.95], { speed: 0.8, faceEnd: 180 })],
        [0.4, "look", 0.2, 2],
        [0.6, W("in", [2.3, 7.6], { speed: 0.7, faceEnd: 200 })],
        [4.2, "jo_raise", 1, 1.1, "out"],
        [4.4, "jo_up", 0.5, 1],
        [6.0, "jo_raise", 0, 0.45, "in"],
        [6.0, "jo_down", 1, 0.6, "anticipate"],
        [6.2, "jo_up", 0, 0.5],
        [6.6, "fire", 1, 3],
        [6.6, "ignite", 0.025, 1.3],
        [7.0, "smoke", 0.35, 6],
        [7.0, "look", 0.5, 1],
        [7.8, "jo_f", -90, 0.7],
        [8.4, "jo_a", -2.0, 3.8, "inOut"],
        [8.4, "jo_down", 0.75, 0.8],
        [8.4, "ignite", 0.07, 4.0],
      ],
    },
    // he steps back from the blaze and turns to the people, the torch high; the hymn (hymnals held up, heads lifted;
    // without a book, hands together); the front ones step back from the heat; the camera comes to David and his mother
    // (it holds there while the game's hymn is sung: `turned` turns the ones in front round to him)
    hymn: {
      after: "fire",
      from: BURNING,
      rows: [
        [0, "jo_down", 0, 0.8],
        [0, W("jo", [-1.0, 7.6], { speed: 0.9, faceEnd: 0 })],
        [0.2, "ignite", 0.4, 12, "inOut"],
        [0.2, "smoke", 0.75, 12],
        [3.2, "jo_raise", 1, 1.3, "back"],
        [3.4, "jo_up", 0.45, 1.2],
        [3.8, "look", 0, 1.5],
        [3.8, "sing", 1, 2.4],
        [5.0, "heat", 1, 1.3],
        [5.2, () => P.forEach(([, d], i) => d > 6.2 && scene.after(K.late("p" + i, 1.2), () => scene.set(`p${i}_d`, back(d), 1.3, "inOut")))],
        [6.2, "camera_x", -0.95, 4.5, "inOut"],
        [6.2, "camera_z", 1.45, 4.5, "inOut"],
      ],
    },
    // David sings with them, head up, his hand on his chest; his mother glances down at him; the heads in front go
    // back to the fire; the camera leaves him — one of them — and his father's eyes go over the people and past him
    hymn_loud: {
      after: "hymn",
      from: HYMN,
      rows: [
        [0, "turned", 0, 1.5],
        [0, "dv_sing", 1, 1.2],
        [0.4, "camera_x", 0, 5, "inOut"],
        [0.4, "camera_z", 0, 5, "inOut"],
        [0.6, "jo_lookw", 1, 0.6],
        [0.6, "jo_look", -36, 2.0, "inOut"],
        [0.8, "em_lookw", 0.6, 0.8],
        [0.8, "em_look", -60, 1.0],
        [2.6, "jo_look", 34, 3.4, "inOut"],
        [2.8, "em_lookw", 0, 1.0],
        [6.4, "jo_lookw", 0, 1.0],
      ],
    },
    // David does not sing: the ones in front have turned round (at least three); his father's eyes go slowly over the
    // people and stop on his side; David looks up at him, goes still — lets go of his mother's hand, turns and hides his
    // face in her skirt; she sings on; the eyes move on, the heads go back to the fire
    hymn_hide: {
      after: "hymn",
      from: HYMN,
      rows: [
        [0, () => scene.set("turned", Math.max(scene.get("turned") || 0, 0.45), 1.2)],
        [0, "jo_lookw", 1, 0.6],
        [0, "jo_look", -36, 2.6, "inOut"],
        [1.4, "dv_atfa", 1, 0.8],
        [2.8, "dv_freeze", 1, 0.35, "out"],
        [4.0, "dv_freeze", 0, 0.5],
        [4.0, "dv_atfa", 0, 0.4],
        [4.0, "hand", 0, 0.4],
        [4.2, "dv_f", 190, 0.5],
        [4.3, W("dv", [-1.66, 4.68], { speed: 0.6, faceEnd: 172 })],
        [5.0, "dv_hide", 1, 1.0, "out"],
        [6.0, "jo_look", 34, 3.6, "inOut"],
        [6.6, "turned", 0, 3],
        [9.8, "jo_lookw", 0, 1.0],
      ],
    },
    // the camera goes back; the field burns away into the dark; to black
    burn: {
      after: ["hymn_loud", "hymn_hide"],
      from: HID,
      rows: [
        [0, "camera_x", 0, 5, "inOut"],
        [0, "camera_z", 0, 5, "inOut"],
        [0, "ignite", 1, 7, "inOut"],
        [0, "ash", 0.4, 7],
        [0, "smoke", 1, 5],
        [0.4, "jo_raise", 0.3, 2],
        [0.8, "jo_f", 180, 1.4],
        [0.8, "jo_up", 0, 1],
        [5.0, "fade", 1, 1.8, "in"],
      ],
    },
    // the grey morning after: ash, a little smoke. They go home; the Inspector goes off across the ash; his mother
    // takes David's hand and leads him to the track and along it; by the edge of the ash he stops and turns to the one
    // stalk left standing (the camera comes in)
    morning: {
      after: "burn",
      from: { ...HID, fade: 1, camera_x: 0, camera_z: 0 },
      rows: [
        [0, set(GREY)],
        [0.3, "fade", 0, 2.2, "out"],
        [0.3, () => P.forEach((p, i) => {
          const id = "p" + i, keys = { a: id + "_a", d: id + "_d", f: id + "_f" }, to = home(p, i);
          scene.after(K.late(id, 1.5) + (i % 3) * 0.3, () => {
            if (p[0] < 0) K.walkPath(scene, keys, [[to.a, scene.get(keys.d)], [to.a, to.d]], { speed: 1.15 });
            else K.walkTo(scene, keys, [to.a, to.d], { speed: 0.9 });
          });
        })],
        [1.7, W("in", [5.2, 26], { speed: 1.0 })],
        [3.7, "dv_hide", 0, 0.9],
        [4.1, "dv_f", 150, 0.7],
        [4.3, "hand", 1, 0.6],
        [5.7, () => K.walkPath(scene, { a: "em_a", d: "em_d", f: "em_f" }, [[-3.6, 5.3], [-3.6, 9.0]], { speed: 0.8 })],
        [5.9, () => K.walkPath(scene, { a: "dv_a", d: "dv_d", f: "dv_f" }, [[-3.15, 5.0], [-3.15, 8.3]], { speed: 0.8 })],
        [11.3, "camera_x", -2.3, 4.2, "inOut"],
        [11.3, "camera_z", 3.6, 4.2, "inOut"],
        [12.5, "dv_f", 125, 1.2, "inOut"],
        [12.7, "dv_atst", 1, 1.0],
      ],
    },
    // David stays by the stalk, his hand loose in hers, reaching for it; his mother looks back over her shoulder and
    // tugs; they go. Strorm alone before the ash, his back to us; the Inspector fades far off
    stalk_stay: {
      after: "morning",
      from: BY_STALK,
      rows: [
        [0, "hand", 0.35, 0.6],
        [0.3, "dv_reach", 0.45, 1.4, "inOut"],
        [1.4, "em_lookw", 1, 0.6],
        [1.4, "em_look", 160, 0.9],
        [2.6, "em_pull", 0.6, 0.5, "out"],
        [2.6, "in_gone", 1, 3],
        [3.3, "em_pull", 0, 0.6],
        [3.3, "dv_reach", 0, 0.6],
        [3.4, "hand", 1, 0.5],
        [3.6, "dv_atst", 0, 0.8],
        [3.8, "em_lookw", 0, 0.8],
        [4.0, W("em", [-3.6, 34], { speed: 0.85 })],
        [4.3, W("dv", [-3.15, 33.6], { speed: 0.85 })],
        [5.2, "camera_x", 0, 6, "inOut"],
        [5.2, "camera_z", 0, 6, "inOut"],
        [5.6, "jo_bow", 0.3, 3],
      ],
    },
    // David looks away from the stalk and goes on with his mother; she does not look back
    stalk_go: {
      after: "morning",
      from: BY_STALK,
      rows: [
        [0, "dv_atst", 0, 0.8],
        [0, "in_gone", 1, 3],
        [0.3, "dv_f", 180, 0.8, "inOut"],
        [1.0, W("em", [-3.6, 34], { speed: 0.85 })],
        [1.1, W("dv", [-3.15, 33.6], { speed: 0.85 })],
        [1.6, "camera_x", 0, 6, "inOut"],
        [1.6, "camera_z", 0, 6, "inOut"],
        [2.0, "jo_bow", 0.3, 3],
      ],
    },
  },
  { film: ["dawn", "ear", "raise", "kneel_late", "light", "fire", "hymn", "hymn_hide", "burn", "morning", "stalk_stay"] },
);
