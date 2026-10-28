# Madeline passes — the gallery (engine 3)

## How it is built
- The gallery is built in world metres, every surface where it is (lib.js). The objects of scene.json and elements/ are
  assembled from lib.js's geometry by `tools/madeline-passes-gen.js` (from the world's root:
  `node tools/madeline-passes-gen.js`): when changing the geometry (`bay`, `strip`, `windowOf`, the openings) or the
  scene's light and keys, edit lib.js and the generator and rebuild — scene.json is not edited by hand: across — across
  from the axis (the walls ±3.3), distance — deep from the eye's place at the start, elevation — up from the floor. The
  engine lays the perspective, the windows' light, the haze and the reflections; the drawings are static and know nothing
  of the eye.
- `floor` — the floor (a plane): stone slabs, a light polish (`reflect`) — the windows and the candle in it. `ceiling` —
  the vault (a plane facing down, 11 m). `wall_l` — the left wall (a card facing right, x — along the gallery from
  −3 m): the openings of bays 3 and 5 cut out, panels in the other bays. `wall_r` — the right wall (facing left, x — from
  the end wall towards the eye): the pointed windows of bays 1…16 cut out; `windows` — their glass 3 cm behind the wall
  (`glows`: the sky, a glow at the arch, leaded diamonds, a mullion; warm under `low_sun`). `end_wall` — the end wall at
  82 m.
- The arches `arch0…arch16` (every 4.6 m from 4.1): a cross wall with a pointed opening cut out; 1 m thick — the
  soffit: `arch<k>_pl`, `_pr` — the inner faces of the piers, `arch<k>_l0…3`, `_r0…3` — the strips of the pointed arc
  (cards with `tilt`, leaning over the opening). A shield on the left pier of arches 2 and 4.
- `crack` — the crack on the right pier of arch 2: painted whole twice (thin and wide, layers), the shader shows it up to
  the height it has reached and widens it (`animate`: `lib.crackNow`) — `crack` repaints nothing.
- Beyond the openings — dark rooms (`room3_*`, `room5_*`: floor, vault, walls). Whoever goes into an opening goes behind
  the wall by himself — the wall hides him pixel by pixel, no overlays.
- `sconce` — a candle in a sconce on the left wall beyond its opening (34.3 m): the bracket, the candle, the flame — a
  layer that `animate` sways and twitches (`lib.sconceLive`); the light `candle` — from the point `sconce#flame`,
  `hazeGlow` — a halo in the air.
- Light: the scene is lit (`ambient` 0.6 `#7f95a4`, a cold blue-green; haze 0.85 `#1e2c34`, `tintStrength` 0.12,
  `saturation` 0.9 — chosen 2026-10-11 after the tone-curve fix: the stone a dark blue-green, as in v1, but lighter than
  it — the people read even between the bands of light). The evening `evening` and another day's low sun `sun` are
  distant sources only through the windows (`through`: 16 panes, 7 points each — the engine takes up to 8 points a pane):
  patches on the floor, rays in the haze (`shafts`), people in a band of light are lit and cast a shadow, between the
  bands — in shadow. `motes` — dust in the air, seen only in the rays. The look `low_sun` puts out the evening and warms
  the diffuse light.
- People — the world's cast (`modules/cast.js`): narrator, roderick, madeline, doctor; the people keys — people.md
  (`_a`, `_d`, `_do`, `_turn`, `_look`, `_reach`, `_still`, `_here`). Madeline walks `sleepwalk`, her catalepsy is
  `madeline_still`. Whoever is not in the gallery — `_here: false`. They walk at their gait's own speed (on engine 1
  speeds were set — now the beats last as long as the people walk).
- Close-ups — the `closeups` module, the element `closeup` — an insert (`insert`: the key `closeup`) over the gallery;
  the camera meanwhile stays where it stood. Whose — `shot`; the frame is drawn once per choice (`lib.closeup`),
  everything that moves in it (the head's turn `cu_turn` — like a face's `to`, the tear, the breath, the blink, the lips,
  the catalepsy) — `lib.closeupNow`, without repainting.

## Keys
| Key | What |
| --- | --- |
| `beat` | a beat of the film (the `beats` module); the showcase outside games — all the beats in order (`showcase.js`) |
| `camera_x`, `camera_z` | the eye (m) over the picture |
| `crack` | the crack 0…1 (the game sets it by the scale, smoothly) |
| `light_shafts` | the windows' evening light 0…1 |
| `low_sun` | 0 — evening; 1 — another day, a low warm sun (the physician) |
| `sconce` | the candle in the sconce 0…1 |
| `closeup`, `shot` | the close-up 0/1; whose: `roderick`, `madeline`, `doctor` |
| `cu_turn`, `cu_tear`, `cu_inhale`, `cu_blink` | the face, close: a turn (+ towards the window), a tear, a breath, a blink (0 — by itself) |
| `speak` | the lips in the close-up — **the game sets 1 while it says a line, then 0** |

## Elements for choices
`madeline`, `roderick`, `doctor` (and `narrator`) — where they stand. After `weep` Madeline stands in the light by the
window (≈ 23 m), Roderick ahead on the right, facing us; after `look` Madeline in the light looks at the narrator; after
`beside` the physician is beside him, leaning in.

## Beats (lib.js FILM)
The cuts are prepared ahead (`s.shot`) and shown whole; there are no fades to hide anything.

- **pass** — the narrator and Roderick with their backs to us; Madeline comes out of the first opening
  and walks on a diagonal through the bands of light; Roderick lifts his head to her (as soon as she has come out), the
  head drops, he turns away towards us and covers his face with his palms; the narrator looks round at him. She stops in
  the light by a window, facing the window. Ends: Roderick weeping, she standing in the light.
- **weep** (after pass) — a cut: Roderick close, his face in his fingers, tears; back to the gallery. Ends — the choice.
- **follow** (after weep) — the narrator goes after her, the eye with him; a cut: the eye at 18 m, the narrator a few
  steps behind; she walks into the full light of a window and stands facing it; he stops.
- **freeze** (after follow) — half a step — and she freezes in mid-step (`madeline_still`); the eye comes closer; a cut:
  close, the face to the window, a tear creeping. Ends: close, frozen.
- **wake** (after freeze, close) — a breath, she blinks, turns her head to him. The game says her line (`speak`).
- **look** (after wake) — back to the gallery: she in the light looks at him. The choice “I promise” / say nothing.
- **gone** (after look) — she turns away and goes; a cut: through his eyes (the narrator hidden, the eye a step forward
  and towards the window) — she goes behind the wall, into the dark of the second opening. Ends: the empty gallery.
- **stay** (after weep) — the narrator goes up to Roderick, a hand on his shoulder, the eye moves off to the left;
  Roderick lowers his hands, looks at him, speaks with his hands — he has begun to speak: the scene says `stay:talk`
  (the game's lines from here); Madeline behind them goes into the opening. Ends: they stand side by side, Roderick
  speaking.
- **doctor** (chapter II, from anywhere) — another day, a low sun: the narrator alone; the physician
  with his bag comes out of the first opening and walks to him; the narrator turns round; the physician stands facing
  him and leans in; a cut: close, spectacles, sly eyes. The game says his line.
- **beside** (after doctor) — back: the physician beside him, leaning. The choice, the second line.
- **doctor_leaves** (after beside) — the physician straightens and goes into the opening without looking back.
- **leave_with** (after beside) — the physician goes, the narrator after him (the end of the chapter). Ends:
  the gallery, the two going into the opening.

## Lines (the game says them)
Madeline after `wake` — “When I am so — I hear everything. Do not let them shut me in”; Roderick in `stay` (with
`stay:talk`); the physician after `doctor` and after `beside`. The lips move in the close-up while `speak` is 1.

## Engine 3 (v3, 2026-10-15)

- `"engine": 3` (the generator `tools/madeline-passes-gen.js` writes engine 3 and `crack.wgsl`). The cuts were already
  told ahead. The moment `freeze:still` — she has frozen in mid-step (the game's line). The keys `doctor_present`,
  `madeline` are gone: the beats set the people and the light.
- Step 2: the close-up is drawn by `shot`, not by its own key `closeup` (it is not redrawn at each opening).

## Contract for the check

```json
{
  "beats": {
    "pass": {
      "after": [],
      "tells": [],
      "seconds": 13
    },
    "weep": {
      "after": [
        "pass"
      ],
      "tells": [],
      "seconds": 7
    },
    "follow": {
      "after": [
        "weep"
      ],
      "tells": [],
      "seconds": 9
    },
    "freeze": {
      "after": [
        "follow"
      ],
      "tells": [
        "freeze:still"
      ],
      "seconds": 8
    },
    "wake": {
      "after": [
        "freeze"
      ],
      "tells": [],
      "seconds": 4
    },
    "look": {
      "after": [
        "wake"
      ],
      "tells": [],
      "seconds": 1.2
    },
    "gone": {
      "after": [
        "look"
      ],
      "tells": [],
      "seconds": 10
    },
    "stay": {
      "after": [
        "weep"
      ],
      "tells": [
        "stay:talk"
      ],
      "seconds": 9
    },
    "doctor": {
      "after": [],
      "tells": [],
      "seconds": 12
    },
    "beside": {
      "after": [
        "doctor"
      ],
      "tells": [],
      "seconds": 1.2
    },
    "doctor_leaves": {
      "after": [
        "beside"
      ],
      "tells": [],
      "seconds": 7
    },
    "leave_with": {
      "after": [
        "beside"
      ],
      "tells": [],
      "seconds": 6
    }
  },
  "points": [],
  "offers": [
    "madeline",
    "roderick",
    "doctor"
  ],
  "party": {
    "crack": 0.1
  },
  "speakers": [
    "roderick",
    "doctor"
  ]
}
```
