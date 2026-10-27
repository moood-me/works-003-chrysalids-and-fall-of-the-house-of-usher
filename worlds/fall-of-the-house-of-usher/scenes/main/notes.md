# The approach to the house — on engine 3, a film in beats

Chapter I (dusk): the rider comes along the causeway, “Cause”, the reflection, to the door. Chapter II (a grey day): the
narrator leads Roderick by the hand out of the hall along the causeway towards us, “By the hand”, a breath in the
middle, to the shore or back. Chapter III (morning): the horse by the tarn, “Leave”. Modules: `cast` (the engine's
people: the narrator, Roderick; the motion `ride` — on horseback), `ushers` (the horse — Kimodo cannot do horses),
`closeups` (Roderick's face — an insert), `beats` (the beats: lib.js `FILM`; the showcase — `SHOWCASE`).

## Beats (lib.js FILM; when one ends, the scene says `beat:<name>`)

| beat | after | what | ends |
| --- | --- | --- | --- |
| `arrive` | — | the rider comes along the causeway from lower left, slowing, the horse turns towards the house, tosses its head, the narrator raises his eyes to the house | stands by the tarn, looking at the house |
| `look` | arrive | a slight push-in. Under “Cause”: the game raises `gloom` | a living pose |
| `trace` | look | the camera to the house, the crack larger: for the finger to trace (`crack_trace`) | the house, close |
| `tarn` | look, trace | the gaze down to the water, a pale figure shows in the reflection at an upper window, the gaze up — the window is empty, in the water she fades | the house, the window empty |
| `to_door` | look, trace, tarn | the camera back, the rider rides along the causeway to the door, the door opens (the end of the part) | the rider at the open door |
| `walk_out` | — | day, the camera low on the causeway 15 m from the door; the door opens; the narrator leads Roderick by the hand towards us (`walk` 0 → 0.15) | the two close, hand in hand |
| `walk` | walk_out | the camera goes with them (`follow`): the game moves `walk` (→ 0.5) and `resist` | at once |
| `walk_on` | walk_out, walk | (outside games — what “By the hand” does) they walk to the middle, he balks harder; the camera backs away ahead of them | in the middle |
| `breathe` | walk, walk_on | he stops balking, the narrator turns round, Roderick lifts his face to the sky, the camera closer; **close** (the insert `closeup`, a cut without a fade): eyes shut, a deep breath; back | a wide shot, the face lifted |
| `to_shore` | breathe | he lowers his face, they walk; a cut closer to the shore; he balks, the hand slips out, the narrator carried a step on by his own motion, Roderick falls to his knees, stops his ears, rocks | he on his knees, the narrator over him |
| `turn_back` | breathe | they let go of hands, he turns home first (at his own gait), looks back at the shore once | the two going off to the house |
| `morning` | — | chapter III, a grey morning, thick mist: the horse saddled by the tarn, the narrator on foot at its shoulder; the camera closer, the horse tosses its head, the narrator looks back at the house | a living pose (the choice: `rider` “Leave”, `house` “Stay”) |
| `ride_away` | morning | he goes to the stirrup, a hand on the saddle — a cut: he is in the saddle; the horse turns towards us, rides along the causeway towards us and out of frame | the causeway, empty |

The showcase (`showcase.js`): arrive, look (with the gloom in steps there too, as in the game), trace (and a finger's
trail along the crack), tarn, to_door, walk_out, walk_on, breathe, to_shore, morning, ride_away — ~2 min 8 s; each beat
≤ 30 s.

The game says the lines: “I had forgotten the smell of the air” — on the close-up of `breathe`; “I shall perish…”, “This
house lives…” — after it; the choice “to the shore / back” — on `roderick`.

## Keys

- `crack` 0…1 — the crack (the scale: thin and deep — layers, one into the other); `crack_trace` 0…1 — how much of it
  the finger has passed from the top: the stretches grow lighter, a light at the end of the trail (layers, animation;
  nothing is repainted).
- `dusk` 0…1 — dusk; `day` 0…1 — a grey day (0.75 — the morning of III); `mist` 0…1; `window_light` 0…1 — the light in
  the upper left window. These change only by cuts — the drawings read them.
- `gloom` 0…1 — the gloom: the light's look `gloom` (darker, greyer, the air thicker), the mist thicker and the window
  dimmer — animation.
- `door` 0…1 — the door's leaves swing inward (the layers `door_l`, `door_r` of `windows`), behind them the hall
  (`hall`) and its warm light (the light `hall` on the people in the door).
- `reflection_figure` 0…1 — a pale figure in window UW[2] — **only in the reflection**: the element `vision` (the layer
  `her`, its alpha the key) with `"seen": "reflection"` — in the tarn she is there, look up — the window is empty; the
  light of her room shines only in the reflection.
- The horse: `rider_present`, `rider_a`/`rider_d` (m, the way — `s.path`; the legs by the way gone, no sliding),
  `rider_face` (° the old way: 0 — towards us, 90 — to the right), `horse_toss` 0…1. The horse's points:
  `rider#saddle`, `rider#stirrups`.
- The rider is the engine's person `narrator`: `narrator_on: "rider#stirrups"`, `narrator_do: {motion: "ride", loop:
  true}`, `narrator_turn` = 180 − `rider_face` (the beats turn both together); his eyes raised — `narrator_look`. (It
  was: `rider_mounted`, `rider_up` — the ushers module drew the rider itself.)
- The engine's people `narrator`, `roderick` (people.md): `_here`, `_a`, `_d`, `_do`, `_turn` (0 — away from us,
  towards the house; 180 — towards us), `_look`, `_reach`, `_gait`, `_on`. Hand in hand — `narrator_reach: {r:
  "roderick#hand_l"}`, `roderick_reach: {l: "narrator#hand_r"}`. The cast's motions: Roderick — the gait `led_walk`,
  `balk`, `kneel_ears`, `rock_ears`; both — `back_walk`.
- `walk` 0…1 — where the game leads them along the causeway (0 — in the hall, 0.5 — the middle, 1 — at the shore): set,
  they walk there at their own step (back — backing; to where they are, nearer than 0.3 m — they stop); only while
  Roderick is here. The beats do not set `walk` themselves (their people walk by the director's `walk`). `walk_at` —
  where they are now, in the same units (by the narrator's place; the scene sets it while they walk): the game reads it,
  not the scene's metres. `resist` 0…1 — balks: standing — `balk` from 0.6.
- `follow` — the camera after them: low on the causeway, 5 m ahead of them, backing away as far as they walk towards
  `walk`.
- `closeup` 0/1 — the insert: Roderick's face by day (`lib.closeup`, drawn once); `cu_inhale` 0…1 — a breath (its
  animation). (It was `cu_d` — the card's distance; the insert does not need it.)
- The camera: `camera_x`, `camera_z`, `camera_h`, `camera_look`. No fade of the scene's own: a part begins and ends seen (the black between, if any, is the game's).

## Elements for choices

`rider`, `house`, `windows`, `trees`, `tarn` (the water), `crack` (by the water; its points `crack#k0` … `k16` — the crack
from the roof to the water), `roderick`, `narrator`.

## How it is built

Camera picture, horizon 0.5. The tarn is a mirror plane (`tarn`, 3 cm below the ground): the house, the sky, the
causeway, the trees, the horse and the people are reflected by the engine (in the old scene the reflection was painted
in strips). The house — `house` (the walls, the doorway cut out), `windows` (the windows, the leaves, the lamp), `crack`,
behind the door `hall` (83 m). The causeway — the plane `causeway` (`walk`), the near shore — `shore`. The mist
(`mist_*`) and the clouds (`clouds`) — layers with `drift`, their colours from the moment; grass, sedge — layers with
`wind`; the dead trees — a lean of their own in the animation. The horse — `ushers.horse` (rounds and limbs as layers,
moved by `horseLive`). Nothing is repainted while a beat runs: everything that moves is layers and animations.

## Engine 3 (v3, 2026-10-15)

- `"engine": 3`. The light is the engine's: everything standing in the world is painted in its own (daylight) colours
  (`lib.paint`), dusk is the scene's light (`ambient` and a cold `ambientColor`), the grey day is the look `day`; the sky
  and clouds paint their hour themselves (`lib.tone`). The hall behind the door glows (`glows`). The horse — in its own
  colours (`light: 1`). The key `people` is gone.
- The cuts are told ahead (`to_shore`, `ride_away` — at the start of the beat); the close-up is an insert, opened and
  closed by the key `closeup` (not by a cut).
- Moments: `walk_out:door` (the door begins to open), `breathe:close` (the close-up of the breath), `morning:toss` (the
  horse tosses its head).
- The game's points: `windows@`, `trees#trunk`, `tarn@` (“Cause”), `crack#k0` … `crack#k16` (the line of the crack from
  the roof to the water — “Cause” leads along it), `roderick#hand_l` and `lead@` (“By the hand”: the element `lead` — a
  point on the causeway before the narrator, towards us, its places `lead_a`, `lead_d` set by the scene); choices —
  `tarn`, `house`, `roderick`, `rider#saddle`.
- Step 2: for dusk — a fill light from behind the eye (`fill`, distant, weaker under the look `day`), `ambientColor`
  lighter, the gloom (`gloom`) darkens less. The lit window — an element of its own, `lamp` (`glows`: it shines at dusk
  and is seen in the tarn). The right tree nearer the causeway (5.4 m), its point `trees#trunk` — on the trunk below the
  fork, within the middle 4:3 (step 3; the unnamed `trees@` went off the edge).

## Contract for the check

```json
{
  "beats": {
    "arrive": {
      "after": [],
      "tells": [],
      "seconds": 14
    },
    "look": {
      "after": [
        "arrive"
      ],
      "tells": [],
      "seconds": 3
    },
    "trace": {
      "after": [
        "look"
      ],
      "tells": [],
      "seconds": 3
    },
    "tarn": {
      "after": [
        "look",
        "trace"
      ],
      "tells": [],
      "seconds": 12
    },
    "to_door": {
      "after": [
        "look",
        "trace",
        "tarn"
      ],
      "tells": [],
      "seconds": 10
    },
    "walk_out": {
      "after": [],
      "tells": [
        "walk_out:door"
      ],
      "seconds": 10
    },
    "walk": {
      "after": [
        "walk_out"
      ],
      "tells": [],
      "seconds": 1
    },
    "walk_on": {
      "after": [
        "walk_out",
        "walk"
      ],
      "tells": [],
      "seconds": 18,
      "show": false
    },
    "breathe": {
      "after": [
        "walk",
        "walk_on"
      ],
      "tells": [
        "breathe:close"
      ],
      "seconds": 12
    },
    "to_shore": {
      "after": [
        "breathe"
      ],
      "tells": [],
      "seconds": 14
    },
    "turn_back": {
      "after": [
        "breathe"
      ],
      "tells": [],
      "seconds": 9
    },
    "morning": {
      "after": [],
      "tells": [
        "morning:toss"
      ],
      "seconds": 9
    },
    "ride_away": {
      "after": [
        "morning"
      ],
      "tells": [],
      "seconds": 12
    }
  },
  "points": [
    "windows@",
    "trees#trunk",
    "tarn@",
    "crack#k0",
    "crack#k1",
    "crack#k2",
    "crack#k3",
    "crack#k4",
    "crack#k5",
    "crack#k6",
    "crack#k7",
    "crack#k8",
    "crack#k9",
    "crack#k10",
    "crack#k11",
    "crack#k12",
    "crack#k13",
    "crack#k14",
    "crack#k15",
    "crack#k16",
    "roderick#hand_l",
    "lead@"
  ],
  "offers": [
    "tarn",
    "house",
    "roderick",
    "rider#saddle"
  ],
  "party": {
    "crack": 0.1
  },
  "speakers": [
    "roderick"
  ]
}
```
