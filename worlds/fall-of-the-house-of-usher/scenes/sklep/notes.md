# The vault (engine 3)

Chapter III. The coffin is carried into the vault beneath the house, opened, they look at her, close it, screw it down;
through her eyes — from within; the iron door closes. Another night — outside that door, a knock. The v1 world's scene
(the same `sklep`) moved to engine 2.

## How it is built
- Camera picture, horizon 0.46. The vault — from far to near: `dark` (the darkness above the vault), `passage` (the
  passage beyond the door: a wall, steps to the right up to the house), `wall` (the back wall at 6.8 m: the vault, stones,
  stains, the crack `crack`; the doorway), `doorway` (the stone surround of the doorway; mist from the open door — the
  layer `breath`, its animate: how far the door is open), `door` (the iron leaf hinged on the left jamb, `door_turn`: 180
  shut … 280 flung open into the vault; the ring `door#ring`), `floor`, `mist_back`, `arch2` (the far arch at 4.7 m, a
  torch holder on its right pier), `torch` (the torch in its holder, until it is taken; points `torch#grip`,
  `torch#flame`), the bier (`plinth` and its parts, `plinth_step`, `plinth_top`), the coffin, the people, `mist_front`,
  `arch1` (the near arch at 2.6 m).
- **Everything is painted in daylight colours, the light is the scene's.** The scene is lit (`light.ambient` cold,
  `bounce`), the light is the torch: `holder` (the light of the element `torch`, its `e.light`, while the torch is in the
  holder) and `fire` (at the point `narrator#flame`, when the torch is part of the cast, in the narrator's hand); both
  `on: torch` (0 — cut off by the door). The patches on the walls, the floor, the coffin, the shadows of the people, the
  coffin, the lid, the bier, the door — are the engine's; the drawings do not read where the torch is (in v1 they read it
  every frame). The air glows round the fire (`haze`, `hazeGlow`).
- **The fire is particles**: `flame` and `embers` at `narrator#flame`, `holder_fire` at `torch#flame`, `amount: torch`;
  no point (the torch is not there) — no fire.
- **The mist** (`mist_back`, `mist_front`, `lib.mist`) — two layers of low billows, each drifting at its own pace
  (`drift`), the ends meeting: the billows part and meet, never repeating. Nothing is repainted.
- **The coffin is a thing in the vault**: `coffin_box` (an invisible anchor — the middle of the bottom, `coffin_a/d/h`,
  `coffin_turn`: 180 — along the vault, the head to the left), on it the sides `coffin` (the near one, the game chooses
  it), `coffin_far`, `coffin_head`, `coffin_foot`, the bottom `coffin_floor`, the lid `lid` (`lid_x` — slid towards the
  feet, 0.75 — the face and breast uncovered; `lid_h` — 0.37 lying, 0.4 lifted) and `lid_edge`. Points:
  `coffin#head/foot`, `coffin_far#head/foot/rim`, `lid#r/l/n`, `coffin_floor#bed`, `coffin_foot#hand_r/l`,
  `#foot_r/l`.
- **People** — the world's cast (`modules/cast`): `roderick`, `narrator`, `madeline`. Madeline `madeline_on:
  coffin_floor#bed`, `lie` once, the hands and feet drawn to the points at the coffin's foot. All move at the pace of
  their gaits (`lib.PACE` — as the engine measures it on these people). The coffin is carried by one `s.path` over the
  keys of the coffin and of both (`lib.IN`, a cubic curve; the coffin turns along the vault) in the time the slowest of
  them needs at his gait (`CARRY_T`: Roderick backing, `carry_back`); the narrator pulls the door, backing (`lib.PULL`,
  `PULL_T` by `torch_back`). Roderick takes the lid with sideways steps (`lean_step_r/l`) at their pace. Walking —
  `walk`.
- **Close-ups are inserts** (insert): `closeup` (the `closeups` module, what is in it — `lib.closeup(state)`, which —
  `shot`: `face`, `mirror`, `hands`, `lid`), `inside`, `outside` — the scene's own. They open by a key 0/1, with a cut;
  the vault runs on under them. The own inserts are painted once (in scene heights around the frame's middle,
  `lib.CARD`), the motion is their shaders and animate:
  - `inside` (`inside.wgsl`): the base — darkness and the underside of the lid, layer 1 — a thread of light, 2 — the
    screws' points through the wood, 3 — splinters. The flame's tremor and `seam`, the shadows of the two (`shade`), the
    points one by one (`tip`: each over a stretch of its own — `lib.SCREWS`) come out of the wood by the layer's shift,
    the dust — in the shader. The points follow the screwdriver's work (`lib.TURNS`): screw after screw, each turn one
    change of `tip` (the first screw in two turns), between screws — the screwdriver to the next.
  - `outside` (`outside.wgsl`): layer 1 — the passage by the door, 2 — the leaf (trembling from `knock`/`answer`), 3 —
    the candle's flame (stretching and bending with its tremor); the dust from the top of the door and the darkness
    around — in the shader.
- Cuts without fades: the next shot is prepared (`s.shot`) and shown whole. `fade` — only as a device: the chapter out
  of the dark (`enter`), into the dark (`vault`, `check`), her eyes in the dark (`inside`), another night (`at_door`).

## Keys
| Key | What |
| --- | --- |
| `beat` | a beat (the `beats` module): the name — it plays from the start, at the end the scene says `beat:<name>` |
| `closeup`, `shot` | the close-up insert is open (0/1); which: `face`, `mirror`, `hands`, `lid` |
| `inside`, `outside` | the inserts “from within” and “at the door” (0/1) |
| `fade` | a fade 0…1 (only as a device) |
| `camera_x`, `camera_z`, `camera_h`, `camera_look` | the eye; at the coffin — `−0.35, 0.9, 0.9, 0.3` (from above into the coffin) |
| `crack` | the crack on the back wall 0…1 (the game sets it by the scale) |
| `blush` | the blush on the cheeks and breast 0…1 (`face`) |
| `mirror` | `mirror`: the little mirror rises to the lips 0…1 — clear |
| `touch` | `hands`: his hand rises into the frame and settles on hers 0…1 |
| `door_turn` | the iron door: 180 shut … 280 flung open |
| `lid_x`, `lid_h` | the lid: slid towards the feet 0…0.75; height 0.37 (lying) … 0.4 (lifted) |
| `torch` | how much torchlight 0…1; whether it is in his hand — `narrator_with: ["torch"]` |
| `coffin_a`, `coffin_d`, `coffin_h`, `coffin_turn` | where the coffin is (on the bier −0.5, 4.3, 0.43, 180; carried — 0.96) |
| `roderick_*`, `narrator_*`, `madeline_*` | the people (people.md). The cast's motions: `carry_walk`, `carry_back`, `set_down`, `bend_over`, `lean_over`, `lean_step_r/l`, `straighten_coffin`, `grieve`, `take_torch`, `hold_torch`, `raise_torch`, `hold_high`, `lower_torch`, `torch_walk`, `torch_back`, `lean_hand`, `lie` |
| `screw1…screw4` | `lid`: how far a screw is screwed in 0…1; the screws' points — `closeup#screw1…4` (the mini-game “The screws”) |
| `screw_at`, `driver`, `driver_rod` | which screw the screwdriver is on (a fraction — the hand on its way); the hand with the screwdriver in the frame; in Roderick's hand |
| `seam`, `shade`, `tip` | `inside`: the thread of light 0…1; how far the two have passed 0…1; the screws' points (to 0.4, 0.6, 0.78, 0.9) — each turn of the screwdriver sets `tip` further (the game hears each change: the screw's sound) |
| `knock`, `answer` | `outside`: a knock from here / an answer from there — a pulse 1 → 0 (~1.5 s) |

## What changed against v1 (for the game)
- The screws' points: they were the elements `screw1…4` (empty cards where the screws are) — now the insert's points
  `closeup#screw1…4`: the marks of “The screws” stand on them.
- `shot: ''|'inside'|'outside'` — now separate inserts: `shot` chooses only the module's close-up (`closeup` 1).
- The beat `vault` is not in the game (it was only in the montage before, too), `film` → the showcase (`showcase.js`);
  `beat` — the same names.
- `open`: her face — when the lid has been slid at Roderick's pace (≈ 5 s from the start of the beat, as it was ≈ 5.5);
  the scene says `open:face` (`scene.tell`) at the moment of the cut — the game waits for that, not for seconds.

## Elements for choices
- `madeline`, `roderick`, `coffin`, `lid` — after `open`/`touch`/`mirror` (the vault at the coffin, the lid slid back).
- `door` — after `leave` (the door open, the narrator in the doorway).

## Beats
Who is where: Roderick behind the coffin at its head (−1.25, 4.98), over her breast, having slid the lid (−0.5, 4.98);
the narrator behind the coffin at its foot (0.45, 5.02), the torch in his left hand. The beats last as long as the people
take; the seconds are approximate.

- **vault** (showcase, ≈ 4 s): the vault at the coffin, the lid slid back; the eye a little closer; into the dark.
- **enter** (≈ 22 s): out of the dark the two carry the coffin in through the door (Roderick backing at its head), carry
  it to the bier, the coffin turns along the vault; they set it down; Roderick goes round the head to behind the coffin;
  the narrator goes to the pier, takes the torch from its holder, comes back to the foot. Ends: the coffin on the bier,
  the two behind it, the torch in his hand.
- **open** (≈ 11 s, after enter): Roderick bends, lifts the lid, slides it towards the feet, stepping sideways; the eye
  comes closer and looks from above; the narrator raises the torch. A cut — her face (`face`, ≈ 4.6 s), back. Ends: for
  the choice.
- **touch** (≈ 5.4 s) / **mirror** (≈ 5.8 s), after open or each other: a cut to the hands / the face with the mirror,
  back.
- **say** (≈ 5 s): Roderick straightens, turns away, a hand on the far edge. Ends under his “I know…”.
- **shut** (≈ 9 s, after say): he turns, bends, slides the lid shut alone.
- **insist** (≈ 7.5 s): the narrator lays his hand on the lid; Roderick moves it aside and slides the lid shut himself —
  sharply, from the first step.
- **close** (≈ 8 s): to say nothing — they slide it shut together, Roderick to the end.
- **screws** (1.35 s, after shut/insist/close): the lid close, the screwdriver on the first screw. Ends under “The
  screws”.
- **check** (≈ 6 s, after screws): the screwdriver with Roderick, he drives home the ones not driven home; into the dark.
- **inside** (≈ 10.5 s): out of the dark a thread of light; the shadows of the two over it; the points come out one by
  one as the screwdriver works (`tip` — at each turn; the game sounds the screw at each change, not by seconds); the light
  goes. Ends: dark.
- **leave** (≈ 13 s): a cut to the vault; Roderick straightens and goes out by the door and up the steps; the narrator
  lowers the torch, goes to the door, looks back in the doorway. Ends: for the choice (`door`).
- **door_close** (≈ 4.5 s, after leave): takes the ring, backing, closes the door; the light cut off.
- **at_door** (3 s): another night, outside the door, a candle. Ends under “Knock”.
- **knock** (showcase): two blows, silence, two answers.

## The light after the tone-curve fix (2026-10-11)

Chosen from contact sheets against v1 (the mood — a cold blue-green vault, a small warm torch; not a yellow cave in the
dark): `ambient` 0.12 → 0.65, `ambientColor` `#4f6f86` → `#7fa3b4`, `hazeColor` `#1a272d` → `#27404a`, the torch
(`fire`, `holder`) `strength` 1.2 → 1.0. Both bearers of the coffin are seen (in the former light Roderick at the head
drowned in the dark).

## Engine 3 (v3, 2026-10-15)

- `"engine": 3`, shaders `inside.wgsl`, `outside.wgsl`. The close-ups `touch`, `mirror`, `check` — by a cut told at the
  start of the beat (a second before it); `screws` begins with a cut (`after: []`): the game names it in `beat_next` (the
  `beats` module's key), and the cut is ready ahead; likewise `inside` after the screws or after `insist`. Back out of
  the close-up — by the key `closeup` (the insert closes).
- Moments: `open:face` (it was `shot:face`), `touch:hand`, `mirror:up`.
- The game's points: `closeup#screw1…4` (the screws within the middle 4:3: the closeups module), `closeup#leave`
  (between the screws — “leave it so”), `outside#door` (the leaf — “Knock”), `outside#away` (the passage — “Walk
  away”); choices — `madeline`, `roderick`, `door`.
- Step 2: the lid's close-up raised (`pan`) — the screws in the middle of the frame; `outside#away` nearer the middle;
  the night at the door lighter (the candle's light in the insert's shader); a fill light `fill` at the eye.

## Contract for the check

```json
{
  "beats": {
    "vault": {
      "after": [],
      "tells": [],
      "seconds": 4,
      "show": false
    },
    "enter": {
      "after": [],
      "tells": [],
      "seconds": 22
    },
    "open": {
      "after": [
        "enter"
      ],
      "tells": [
        "open:face"
      ],
      "seconds": 12
    },
    "touch": {
      "after": [
        "open",
        "mirror"
      ],
      "tells": [
        "touch:hand"
      ],
      "seconds": 6.5
    },
    "mirror": {
      "after": [
        "open",
        "touch"
      ],
      "tells": [
        "mirror:up"
      ],
      "seconds": 6.5
    },
    "say": {
      "after": [
        "open",
        "touch",
        "mirror"
      ],
      "tells": [],
      "seconds": 5
    },
    "shut": {
      "after": [
        "say"
      ],
      "tells": [],
      "seconds": 9
    },
    "insist": {
      "after": [
        "open",
        "touch",
        "mirror"
      ],
      "tells": [],
      "seconds": 7.5
    },
    "close": {
      "after": [
        "open",
        "touch",
        "mirror"
      ],
      "tells": [],
      "seconds": 8
    },
    "screws": {
      "after": [],
      "tells": [],
      "seconds": 1.4
    },
    "check": {
      "after": [
        "screws"
      ],
      "tells": [],
      "seconds": 6
    },
    "inside": {
      "after": [],
      "tells": [],
      "seconds": 10.5
    },
    "leave": {
      "after": [],
      "tells": [],
      "seconds": 13
    },
    "door_close": {
      "after": [
        "leave"
      ],
      "tells": [],
      "seconds": 4.5
    },
    "at_door": {
      "after": [],
      "tells": [],
      "seconds": 3
    },
    "knock": {
      "after": [
        "at_door"
      ],
      "tells": [],
      "seconds": 8,
      "show": false
    }
  },
  "points": [
    "closeup#screw1",
    "closeup#screw2",
    "closeup#screw3",
    "closeup#screw4",
    "closeup#leave",
    "outside#door",
    "outside#away"
  ],
  "offers": [
    "madeline",
    "roderick",
    "door"
  ],
  "party": {
    "crack": 0.1
  },
  "speakers": [
    "roderick"
  ]
}
```
