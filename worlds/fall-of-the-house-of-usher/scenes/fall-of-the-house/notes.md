The scene is the finale of “The Fall of the House of Usher” on engine 3: the game's prologue, the flight of chapter IV,
the endings. Camera picture, horizon 0.58; frontal symmetry. The people are the engine's people from the world's cast
(`cast`), the beats — the `beats` module (script.js — for the game, showcase.js — the showcase), all the painting and the
beats are in lib.js (`film(scene)`), the elements call it.

## How it is built

The sky (the red moon behind the house, the glow on the clouds, the tarn, the far shore) paints its own light; everything
standing in the world is lit by the engine's light (the section “Engine 3” below). Everything is painted once; the sky,
which changes with the moon (`moon` 0.55 → 1), is painted twice — pale and in full red — and the second shows through
over the first as much as `moon` says (layers, a shader); everything that moves is layers, shaders, particles.

- **sky** — the sky, ragged clouds, the blood-red moon (cx = A/2, cy = 0.47, R = 0.17), the far shore with dead trees,
  the tarn's water with the moon's reflection. The shader: pale ↔ red by `moon`; clouds at two heights (`high`, `low`,
  each pale and red) fly and wrap around the width, thicker and faster in the storm (`storm`); the moon's disc between
  them; on the water the strokes ripple, the moon's path shimmers stroke by stroke; in the morning (`morning`) there is
  no disc and no path. `morning` repaints the sky (the morning is the cut of the beat `gone`). A layer that paints
  nothing is not a layer (the indices of `layer(k)` would shift): the disc and the path are always painted, the shader
  removes them.
- **house** (150 m, 50 high, 75 wide): the halves, parted by the crack F, — two layers each: the stone (`L`, `R`), the
  crack's glow (`Lc`, `Rc`, added light — and the red fires `crack1…3` on the right one, the moon in the high windows of
  both — the glows `winL0…2`, `winR0…2`, by `moon`). The animate moves them by `fall` (lib `fallOf`): they part (cw),
  lean outward (lean ≤ 0.13 rad, about the outer corners), sink (sinkL, sinkR down to 54 m). Seen only above the water:
  `clip: inside above_tarn` (an invisible card above the waterline). The layers' `box` covers their whole way.
- **house_mirror** — the reflection: the same house upside down in a dark palette (0.42), with red edges and windows
  (`Lr`, `Rr`, by `moon`: the reflection of what the moon lays on the house), a card anchored 56 m under the water (what
  it paints — where the mirror shows it), seen only below the waterline (`below_tarn`); its halves rise as they sink;
  ripples (`ripples`, shimmering). `ghosts` 0…1 — in the reflected right window of the hall, three: Madeline, the
  narrator, Roderick — figures of the `ushers` module (a vision, only in the water), a layer of the right half.
- **rings** — a plane on the tarn by the house: a shader of spreading rings (`rings`, the near arcs red by `moon`).
- The fall's particles: `house_dust` (dust from the crack), `stones` (stones), `house_spray` (spray from the sinking
  halves), `breach_spray`, `breach_boards` (where the causeway breaks: `brk_a`/`brk_d`); how much — keys that script.js
  sets by `fall` (`house_dust`, `stones`, `spray`, `rings`, `breaking`).
- **causeway** — the causeway plane (146 m). The shader: boards from the break to the shore, beyond the break — settled
  slabs and piles, before the break a red-hot crack runs along the boards (while it breaks); the break — lib
  `breakAt(fall)`: at the house's door at 0, at the shore at 1 (it overtakes one running at `run` r at fall ≈ 0.4 + 0.6 r).
- **breach** — a red glow where the causeway breaks, and its light (`breach`), while `breaking`.
- **shore** — the near shore's plane (wet earth, a red edge, puddles; a gap for the causeway); **reeds** — sedge by the
  water, the tufts are layers, bending in the wind (`light.wind`, stronger in the storm); **mist** — mist over the tarn,
  drifting (`drift`).
- **People**: narrator, madeline, roderick; places — `nar_a`/`nar_d`, `mad_a`/`mad_d`, `rod_a`/`rod_d`; their keys
  `<id>_do`, `_turn`, `_look`, `_reach`, `_gait`, `_here`. Madeline and Roderick are here if with him (`with_madeline`,
  `with_roderick` — from the game). The run — `flee`, Madeline on the shore — `sleepwalk`. All walk and run at their own
  step.

## The run

`running` — the run along the causeway. `run` 0…1 — where along the causeway the narrator runs (0 — 60 m before the
house, 1 — stepped off onto the shore, 8.2 m): he runs there at his own run (`flee`, not faster — a game that moves `run`
faster gets him a little behind, catching up). `run` where he is now (or behind) — stop: the runner finishes his step
(0.6 m) and stands. `run_at` — where he is now, in `run`'s units (the scene sets it while he runs): the game reads it,
not the scene's metres.
From where he is — the others: Madeline on the right, Roderick on the left, a step behind, their hands in his (hand to
hand — the engine: `narrator_reach {r: "madeline#hand_l"}` and the answering ones), the one who trips (`trip`) falls
0.7 m behind and lets go of the hand; and the camera — it backs away before them along the causeway (the narrator at
12 m, towards the end at 9 m) and stops on the shore. `swim` 0…1 — the gaze swims.
(In the old scene: the places by `run` frame by frame, the steps by the way gone. Engine 2 does not speed steps up — so
`run` is now a goal, not a place.)

## Beats

Each with `from` (a cut, if the beat does not follow its `after`). `_turn`: 0 — away from us (towards the house), 180 —
towards us.

- `prologue` (~22 s, no people): out of the dark, a push-in (`camera_z` → 9); the moon flares up in the crack (`moon` →
  1); the crack opens, dust and stones (`fall` → 0.3; > 0.2 — the game gives the roar); the halves part, lean, sink
  (→ 0.55 → 0.88); the tarn closes (→ 1); `storm` dies down.
- `run` (~1.5 s): out of the dark; the narrator (and those he holds) on the causeway, where `run` found them, facing us,
  `fall` 0.15. Then the mini-game “Run” moves `run`, `fall`, `swim`.
- `dash`, `ashore` — the showcase's: he runs half the way, then to the shore (`run` 0.5, 1), `fall` at its own pace (to
  0.33, 0.42).
- `stumble` (~1.7 s): the one he leads stumbles (Madeline, else Roderick; alone — he himself): `stumble` on the run, the
  hands forward, falls behind (`trip`) and lets go of the hand; the narrator looks round.
- `end_alone` (~15 s): he runs off the causeway, on the shore slows to a walk, stops at the edge, turns to the house; the
  house goes down under the water (`fall` 0.42 → 1), in fear he steps back half a step (`step_back`); the wind dies.
- `end_madeline`: the house goes (`fall` 0.78 → 1); she walks slowly to the very water; he comes up, looks, reaches a
  hand to her and lowers it. She does not turn round.
- `end_roderick`: Roderick to the water, half turned, onto his knees (`kneel_down`, `kneel`), bows his head to the water
  — listening; the narrator takes a step towards him and stops.
- `end_both`: brother and sister walk to the water hand in hand; she turns her head to him, he to her; the narrator looks
  at their hands.
- `end_stayed` (no one): the camera to the reflection (`camera_z` → 60, `camera_look` → 0.12), then nearer the reflected
  window (`camera_z` 75, `camera_x` 6, `camera_look` 0.22); in the reflected window the three show through — larger than
  the window, in its red light (`ghosts`) — and fade; the house goes.
- `gone`: morning (`morning` 1), the empty tarn without rings, of the causeway — piles; the camera eases forward a
  little. The morning seen whole (out of the dark) — the scene says `gone:morning` (the lines of “Left” from here).

The beats' length follows the people (their step): the game's epilogue lines, by seconds (11.5 s, 9 s …), fall close to
where they were.

Keys: `fall`, `moon`, `storm`, `morning`, `ghosts`, `narrator_here`, `with_madeline`, `with_roderick`, `run`, `run_at`,
`running`, `trip`, `hand_in_hand`, `swim`, the people's places, `brk_a`/`brk_d`, `breaking`, `house_dust`, `stones`,
`spray`, `rings` (the scene's). There are no choices in the scene; the game's point is `narrator` (“Run”).

## The mini-game “Run” (the game: bespoke/minigames/beg.js)

On the beat `run`: moves `run` 0 → 1 by the player's steps, `fall` by its own clock, `swim` by reason; a stumble — the
beat `stumble`, and `run` where he is (`run_at`): stopped. Overtaken if `fall` ≥ 0.4 + 0.6·`run_at`. For v2 it is worth
leading `run` at the run's step (`flee`: ~4–5 m/s on a causeway 84 m long), not faster: otherwise the narrator lags
behind `run`.

## Engine 3 (v3, 2026-10-15)

- `"engine": 3`, shaders `sky.wgsl`, `rings.wgsl`, `causeway.wgsl`. The light is the engine's: the sky (the moon, the
  clouds, the tarn, the far shore) paints itself, as it did; the house, the causeway, the shore, the sedge, the mist are
  painted in their own colours (`DAY` — lighter than the night paint) and lit by the scene: the night — `ambient`, the red
  moon and its glow from behind the house, the look `moon` reddens the night, the morning — the look `morning`; the
  crack's glow and the moon in the high windows are glows (`e.light` in the layers `Lc`, `Rc`). The painted red edges of
  the roofs, the red boards and the tips of the sedge are gone (that was light); the red in the house's reflection and on
  the shore's wet edge remains — it is the sky's reflection, the engine does not reflect the sky. The key `people` is
  gone.
- The run's camera is not set every frame: the script leads it (`scene.move`) to the place for where the runner is sent,
  over the time he takes to run there (`camOf`).
- Moments: `prologue:split` (the house splits — the game's roar), `end_alone:under`, `end_stayed:under` (the tarn has
  closed), `end_madeline:water`, `end_roderick:behind`, `end_both:hands`, `gone:morning`.
- The game's point: `narrator` (the sign of the run's beat — “Run”).
- Step 2: `house` and `house_mirror` are seen — engine 3 did not cut by the invisible `clip` elements (`above_tarn`,
  `below_tarn`); fixed in the engine (FLAG.CUT_ONLY). A fill light `fill` from behind the eye, reddish (weaker in the
  morning): the moon and its glow are behind the people. The run's camera travels to where the runner is sent, over his
  time (`run.remaining`).
- Step 4: the glow `glow` nearer the façade (−40°), `fill` and the moon's ambient light (`moon`) redder — the walls in
  red. The vision in the reflection larger than the window, in its red light; the breach's glow is a circle within its
  card (it was a rectangle with an edge).

## Contract for the check

```json
{
  "beats": {
    "prologue": {
      "after": [],
      "tells": [
        "prologue:split"
      ],
      "seconds": 22
    },
    "run": {
      "after": [],
      "tells": [],
      "seconds": 1.5
    },
    "dash": {
      "after": [
        "run",
        "stumble"
      ],
      "tells": [],
      "seconds": 8,
      "show": false
    },
    "stumble": {
      "after": [
        "run",
        "stumble",
        "dash"
      ],
      "tells": [],
      "seconds": 1.7
    },
    "ashore": {
      "after": [
        "dash",
        "stumble"
      ],
      "tells": [],
      "seconds": 8,
      "show": false
    },
    "end_alone": {
      "after": [],
      "tells": [
        "end_alone:under"
      ],
      "seconds": 15
    },
    "end_madeline": {
      "after": [],
      "tells": [
        "end_madeline:water"
      ],
      "seconds": 15
    },
    "end_roderick": {
      "after": [],
      "tells": [
        "end_roderick:behind"
      ],
      "seconds": 12
    },
    "end_both": {
      "after": [],
      "tells": [
        "end_both:hands"
      ],
      "seconds": 14
    },
    "end_stayed": {
      "after": [],
      "tells": [
        "end_stayed:under"
      ],
      "seconds": 13
    },
    "gone": {
      "after": [],
      "tells": [
        "gone:morning"
      ],
      "seconds": 7
    }
  },
  "points": [
    "narrator"
  ],
  "offers": [],
  "party": {
    "with_madeline": false,
    "with_roderick": false
  },
  "speakers": []
}
```
