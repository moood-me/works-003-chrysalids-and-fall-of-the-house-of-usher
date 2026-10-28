# Roderick's room — engine 3

Chapters I–III. The game plays the beats one at a time (the key `beat` = the name; when it ends, the scene says
`beat:<name>`; the world's module `beats`); outside a game — its own showcase (`showcase.js`): all the beats in the order
of `lib.js ORDER`, the cuts prepared ahead. The beats are director's sequences in `lib.js FILM`: people walk as long as
they walk (at their gait's step), keys move, the camera films; seconds only where the game is tied to them (the lips in
the close-up from 0.9 s into the beat `meet` and from 5.0 s into `news`: the game waits as long, `g.wait(900)`,
`g.wait(5000)`). Each beat's `from` holds everything it does not set itself: any beat may open the scene.

## Beats

| beat | after | what is seen | ends on |
| --- | --- | --- | --- |
| `enter` | — | the valet shows the narrator in from the right; Roderick looks, the valet bows; Roderick rises from the chair — too quickly, goes to his friend, takes his hand in both of his; the valet leaves | the two in mid-room, hand in hand |
| `meet` | enter | a cut to the close-up (`closeup_shot` glad): the eyes huge, wet, a smile comes; the lips 0.9–4.4 s (**the game's line from 0.9 s**); from 4 s the smile tightens into strain | the strained face |
| `room` | meet | a cut to the room; he lets go of the hand, goes to the chair, sits; the narrator steps away | Roderick in the chair, the narrator to the right — the room free for “Quieter or brighter” |
| `ease` | room, ease, flinch | a breath out, the shoulders drop, a nod | sits, eased |
| `flinch` | room, ease, flinch | covers his eyes with a hand, turns away | sits, half turned away |
| `portrait` | room, ease, flinch | the camera to Madeline's portrait; he gets up, goes to it, looks up at her, his back to us; once he stands before her the scene says `portrait:before` (**the game's lines from here**), the camera settles | the portrait on the left, his back and silver head on the right |
| `turn_away` | portrait | he turns his face away, the camera back, he goes to the chair, sits | a wide shot, the face aside — “Speak not of her” |
| `dusk` | — | days pass: a cut to the evening — the panes crimson (the game takes it through black) | the room at evening |
| `guitar` | dusk | takes the guitar by the chair, plays slowly (`tempo` 0.12, the `strum` strokes go on for 40 s more); the camera to him | playing — under “Her song…”, then “String” |
| `frenzy` | guitar | (showcase only; in the game this is “String”) faster, wilder: `tempo`, `wild` → 1 | wild |
| `ballad` | guitar, frenzy | fewer strokes, he sings, the head thrown back; the room's light sinks, the crack glows (`song`) | singing |
| `guitar_down` | ballad | the light comes back, he lays the guitar by the chair, the hand trembles | sits, the hand trembling |
| `news` | — | another evening, he under the right window, his back to us, the friend by the clock; he turns; a cut to the close-up (`news`): dry eyes; the lips 5.0–6.4 s (**the game's line from 5.0 s**), grief shows through | the close-up |
| `plan` | news | a cut to the room; he walks quickly from the window past the chair, stops at the table, towards his friend, speaks (`talk`) | at the table, speaking — under the plan |
| `night_listen` | — | night: the candles almost out (0.12), only the cold of the windows; the camera to the back wall, right; Roderick at the wall, his ear to the stone; the friend comes in from the right, stands beside him, bows his head | the two at the wall, listening |

## The game's keys

- `crack` 0…1 — the crack in the back wall (branching after 0.35); it glows from within with `song`.
- `candles` 0…1.6 — 0.3 dimmed (the side ones out — a thread of smoke), 1 as found, 1.6 two more tall ones lit.
- `curtain` 0…1 — the curtain across the windows (a slit of light remains: the glass behind it). `window_open` 0…1 —
  the middle window's casements inward: misty air, the draught stirs the curtain. `window_light` 0…1 — the light through
  the panes (0.5 as found).
- `clock` 0 stopped · 0.5 going · 1 wound (the weights at the top, the pendulum at full swing).
- `evening`, `song`, `tempo`, `wild`, `strum` — set by the beats and by “String” (as before).
- People: the engine's people keys (`roderick_*`, `narrator_*`, `valet_*`, people_guide). The close-up: `closeup` 0/1,
  `closeup_shot` (glad | news), `closeup_smile`, `closeup_strain`, `closeup_grief`, `closeup_speak`.
- Set by the scene's script (not the game): `window_day`, `window_dusk` (the windows' light by day and at evening — from
  window_light, curtain, window_open, evening, song), `wick_smoke` (the smoke of the snuffed candles — from candles).

Elements the game may offer: `candles`, `window`, `clock`, `portrait`, `roderick`, `guitar`, `narrator`.

## How it is built

A picture camera, horizon 0.6. The scene is lit (`ambient` grey-blue, by the looks `evening`, `song`); everything is
painted once in its own colours — the light of the candles and windows, the shadows, are the scene's.

- `wall` (10.5 m) — stone, hangings, pilasters, ribs, the window niches and sills, the curtain's cornice. Not one key.
- `fissure` — the crack on a card of its own before the wall: painted by `crack` (in steps of 0.02), the light from
  within — a shader, by `song`.
- `window` — the panes and lattices (glowing: this is the light outside), repainted only by `evening`. Layers: `glass`
  (the side ones), `air`, `leaf_l`, `leaf_r` (the middle one's hinged casements — animated by `window_open`); the
  brightness of the panes and of the glows w0…w2 — animate (`window_light`, `curtain`, `song`).
- `curtain` — two halves, painted drawn; the animate gathers them to the sides (`curtain`), the layers `deep_*` deepen
  the gathered folds; the layers' wind is the draught (the look `window_open` raises the scene's wind).
- `candles` — the candlestick and the candles; the flame (a layer) — the shader `candles.wgsl`: height, flicker, sway, a
  jump on a stroke; each flame's light is `c0…c4` (the scene's lights `candle0…4`), the animate snuffs and flickers it.
  The smoke — particles `smoke_l`, `smoke_r` from `candles#wick0/2` by `wick_smoke`.
- `clock` — the case with the door's opening; behind it the layers `inside`, `weights` (rising by `clock`), `pendulum`
  (swinging by `clock`), the glass in front.
- `portrait`, `table`, `chair`, `chair_front`, `floor` (a plane), `guitar` (the ushers module; hidden while the guitar is
  in his hands), `dust` (dust particles — seen in the light), `closeup` (the insert, the closeups module).
- Lights: `candle0…4` (the flames), `window`, `dusk` (the windows, points before them by `window_day` / `window_dusk`),
  `sky_day`, `sky_dusk` — the far light through the three pointed openings: rays in the air and patches on the floor.

## The move from the old engine (2026-10-10)

Everything the old scene painted as light (warm rims, the windows' reflections, rays, the chair's shadow on the wall, the
candles' pool on the floor, the `glow` flicker) the engine's light now gives; the element `glow` is gone (the candles'
flicker on the wall is their light). The dust — particles. Walking — at the gait's step, without speeds; Roderick goes
to his friend at his own hurried gait `hurry` (cast), not a sped-up walk. In `plan` he walks, then speaks (walking and
`talk` are one track of the body). The close-up — an insert; the key `closeup_wet` is gone (wetness is a property of the
shot), `closeup_shot` added. Cuts — without fades; no fade of the scene's own (the passing of time between beats — a cut; the black between, if any,
is the game's). The valet out of frame — `valet_here: false`.

The crack's light from within is only the shader's `emission`: the engine does not discard a pixel where there is light
without paint (rpg e41bfb5; the former trace of alpha 0.004 is gone).

## The light after the tone-curve fix (2026-10-11)

The engine no longer subtracts black: the dark came out lighter and greyer. Chosen from contact sheets against v1 (the
mood — a cold grey-blue room with a warm pool of candles; the people read even at night): `ambient` 0.12 → 0.5 (what
remains without the windows — the night of `night_listen`, the ballad), `hazeGlow` 0.5 → 0.8 (the candles' halo), the
look `window_dusk`: `ambient` 0.6 → 0.8, `ambientColor` `#b89a9c` → `#a8a0b4` (the evening cold, not brown). The
windows' cold is stronger — it is what lights the night: the look `window_day` `ambient` 0.85 → 1.0, the light `window`
`strength` 0.5 → 1.0, `sky_day` 1.6 → 2.0. Lighter than v1: at night the two at the wall are seen.

## Engine 3 (v3, 2026-10-15)

- `"engine": 3`, shaders `candles.wgsl`, `fissure.wgsl`. Cuts into the close-up and out of it are the starts of beats:
  `meet`, `room`, `plan` begin with a cut (`after: []`, everything in `from`), the `beats` module prepares it ahead while
  the beat before them runs.
- Moments: `meet:lips`, `news:lips` (the lips in the close-up — the game's line), `portrait:before`,
  `night_listen:beside` (the friend has come to stand beside him at the wall).
- The game's points: `candles@`, `window#glass`, `clock#dial`, `portrait#face` (“Quieter or brighter”),
  `roderick#hand_r` (the sign of the beat — his strokes on the strings) and `narrator#hand_r` (“String”: at each touch
  the narrator slaps his palm on his thigh — the cast's motion `keep_time`).
- Step 2: the fill light `fill` at the eye — faces and hands read even against the windows (the guitar, the night at the
  wall).
- Step 4: at night by the wall — a light of its own from the eye's side, `night_fill` (a scene key: 1 in `night_listen`,
  0 in the other beats).

## Contract for the check

```json
{
  "beats": {
    "enter": {
      "after": [],
      "tells": [],
      "seconds": 16
    },
    "meet": {
      "after": [],
      "tells": [
        "meet:lips"
      ],
      "seconds": 7
    },
    "room": {
      "after": [],
      "tells": [],
      "seconds": 6
    },
    "flinch": {
      "after": [
        "room",
        "flinch",
        "ease"
      ],
      "tells": [],
      "seconds": 3
    },
    "ease": {
      "after": [
        "room",
        "flinch",
        "ease"
      ],
      "tells": [],
      "seconds": 3
    },
    "portrait": {
      "after": [
        "room",
        "flinch",
        "ease"
      ],
      "tells": [
        "portrait:before"
      ],
      "seconds": 10
    },
    "turn_away": {
      "after": [
        "portrait"
      ],
      "tells": [],
      "seconds": 7
    },
    "dusk": {
      "after": [],
      "tells": [],
      "seconds": 4
    },
    "guitar": {
      "after": [
        "dusk"
      ],
      "tells": [],
      "seconds": 8
    },
    "frenzy": {
      "after": [
        "guitar"
      ],
      "tells": [],
      "seconds": 16,
      "show": false
    },
    "ballad": {
      "after": [
        "guitar",
        "frenzy"
      ],
      "tells": [],
      "seconds": 10
    },
    "guitar_down": {
      "after": [
        "ballad"
      ],
      "tells": [],
      "seconds": 5
    },
    "news": {
      "after": [],
      "tells": [
        "news:lips"
      ],
      "seconds": 9
    },
    "plan": {
      "after": [],
      "tells": [],
      "seconds": 8
    },
    "night_listen": {
      "after": [],
      "tells": [
        "night_listen:beside"
      ],
      "seconds": 9
    }
  },
  "points": [
    "candles@",
    "window#glass",
    "clock#dial",
    "portrait#face",
    "roderick#hand_r",
    "narrator#hand_r"
  ],
  "offers": [],
  "party": {
    "crack": 0.1
  },
  "speakers": [
    "roderick"
  ]
}
```
