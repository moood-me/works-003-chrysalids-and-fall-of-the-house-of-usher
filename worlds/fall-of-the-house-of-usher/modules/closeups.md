# closeups — close-ups (engine 2)

Painted close-ups for the key moments: the faces of Roderick, Madeline and the physician, hands, the little mirror, the
lid's screws, the narrator's profile. Painted like dark old painting: a single source, the light gathers on the face and
dies towards the edges of the frame, the form is modelled by half-shadow, the shadow goes into near-black with reflected
light along the rim, the edges are lost in the dark.

The drawing is made once per shot (who and what is in it). Everything that changes while the shot runs — the flame's
breathing in the light, the breathing and drift of the head, swaying, blinking, the gaze, the passage from one
expression to the next, the lips to speech, a deep breath, a flinch, a tear, the hands, the mist on the mirror, the
screws, lightning — `live()` moves as layers, redrawing nothing.

## How a scene shows a close-up

A close-up is an insert (`insert`): a frame of its own over the scene, filling the whole frame.

```json
{ "id": "closeup", "name": "Close-up", "insert": "closeup",
  "code": "e.kit.closeups.paint(g, e, e.lib.closeup(e.state))",
  "animate": "e.kit.closeups.live(e, e.lib.closeup(e.state), e.lib.closeupNow(e.state))" }
```

```js
// lib.js: what the shot is (the keys it is drawn from) and what moves in it (the keys live moves)
const closeup = S => S.shot === 'mad_frozen' ? { light: 'window', faces: [{ name: 'mad', who: 'madeline', frozen: 1, eyes: 1, turn: -0.5, tear: 0 }] } : null;
const closeupNow = S => ({ mad: { tear: S.cu_tear, frozen: S.madeline_still ? 1 : 0, speak: S.speak } });
```

- **The insert's key** (`closeup` 0…1) opens it. A cut to the close-up is `closeup: 1` in `s.shot(…)`/`s.cut(…)`,
  back — `closeup: 0`. No fades.
- **The drawing reads only what chooses the shot** (which close-up, who is in it) — a key that changes at once.
  Everything that moves (expression, speech, a breath, a tear, hands, screws, a push-in, lightning) is in `now`, which
  only `animate` reads. If `lib.closeup` reads a smooth key, the shot is redrawn every frame (~25 ms) — that must not be.
- The units are the old card's: the frame's height, the origin at the frame's middle, x −0.89…0.89 (and further for
  wide ones), y −0.5…0.5. On the scene (in scene heights): `x = e.aspect/2 + zoom·(x − pan[0])`,
  `y = 0.5 + zoom·(y − pan[1])`.

## paint(g, e, shot) — the shot

`shot` is `{ light, zoom, pan, flash, faces: [ … ], hands: [ … ], mirror, screws, profile, points }` (null — nothing).

- `light` — the light: `'candle'` (a candle to the left, warm), `'window'` (cold grey from upper right), `'torch'` (a
  torch from the left side, a little from below, orange, breathing), `'lamp'` (a lamp from below — the face in the
  storm), `'day'` (a grey day: soft light from above, behind it an overcast sky), `'door'` (weak warm from the front, a
  strong cold rim — Madeline on the threshold). Or
  `{ like: 'candle', dir: [x, y, z], at: [x, y], reach, color, power, fill, rim, rimSide, flicker, pool, air }`.
- `flash: true` — lightning may strike in the shot (a flash layer; its strength comes from `now.flash`).
- `zoom` (1), `pan` [x, y] — the shot larger and shifted (a slow push-in — `now.zoom`).

## live(e, shot, now) — life

`now` is `{ zoom (1), flash (0…1), screws: { v, at, test }, <name>: { … } }`, where the names are faces' (`name`, else
`who`), hands' (`name`, else `hand0`, `hand1`…), mirrors' (`name`, else `mirror`):

- a face: `to` — `[0…1, …]`: how far it has passed into each next expression of `o.to`; `flinch` 0…1 — flinches from
  the light (the head away and down, the eyes squeezed, the brows down); `speak` 0…1 — the lips move to a line;
  `inhale` 0…1 — a single deep breath (move it 0→1→0); `frozen` 0…1 — catalepsy (does not blink, breathe or drift; a
  fraction — coming back to life); `blink` — blinking by hand (without it, it blinks by itself); `tear` 0…1 — a tear (up
  to 0.3 it gathers on the lower lid, after that it creeps down the cheek; the face needs `tear` in `shot`); `cover` 0…1
  — the hands over the face (`hands: 'face'`); `reach` 0…1 — a hand reaches into the frame (`hands: 'reach'`);
- a hand: `raise` 0…1 (0 — below the frame), `x`, `y` — a shift (card units), `angle` — a turn about the wrist
  (radians, + clockwise); trembling (`tremble`) and drift come by themselves;
- a mirror: `x`, `y` — a shift (the mirror rises to the lips); the mist on it breathes by itself.

## c.face(o) — head and shoulders (`shot.faces`)

| key | what |
| --- | --- |
| `who`, `name` | `'roderick'`, `'madeline'`, `'doctor'`; `name` — the name for `now` (by default `who`) |
| `point` | the name of the point between the eyes (by default `<who>_face`) |
| `at`, `size` | where the head is ([0, −0.04]) and its height in frame heights (0.62; 0.9 — very close, 1.3 — lips and chin) |
| `turn`, `nod`, `tilt` | −1…1: turn (+ to the right of the frame, 1 ≈ 23°), nod (+ down), tilt |
| `eyes` | 0…1.4 — how open (0.82; 1.2 — wide) |
| `gaze` | [x, y] −1…1 — where the eyes look; on top of it, small darting glances of their own |
| `wet` | 0…1 — the wet shine of the eyes (0.4) |
| `smile`, `strain`, `fear`, `grief`, `flinch`, `sly` | 0…1: a smile; strain; fear; grief; a flinch from the light; slyness |
| `part` | 0…1 — the lips parted |
| `breath` | breathing (1); 0 — does not breathe |
| `frozen` | 0…1 — catalepsy as it is drawn (its life is `now`) |
| `to` | the next expressions, each over the one before: `[{ smile: 1, part: 0.25 }, { strain: 1 }]` (of the keys `smile`, `strain`, `fear`, `grief`, `sly`, `blush`, `eyes`, `part`, `wet`, `turn`, `blood`); `now.<name>.to` moves towards them. Each one's skin and lips are layers of their own (showing through over the rest), the brows are carried from line to line, narrower eyes are the lids lowering (drawn as open as they ever get), a turn is a shift of the features across the head. Use them in order: the next after the one before |
| `tear` | there is a tear (a number; how much of it — `now.<name>.tear`); `tearEye` ±1 — which eye |
| `blush` | 0…1 — a blush; `blood` 0…1 — blood (Madeline) |
| `wind` | 0…1 — the hair lifts and flies apart (the storm) |
| `sway` | 0…1 — sways, as before a fall |
| `lying` | true — lies in the coffin: a pillow, satin, the hair across the pillow |
| `hands` | `'face'` — Roderick has covered his face with his hands (with `tear` — tears between the fingers); `'reach'` — reaches a hand towards the camera (`reachPoint` — the name of the palm's point) |

## c.hand(o) — a hand (`shot.hands`)

`name` — the name (for `now`, and the palm's point: the game sees it), `who` (`roderick`, `madeline`, `narrator`,
`doctor`), `pose` (`rest`, `touch`, `reach`, `open`, `grip` — a fist, `cover`, `clasp` — round another's wrist: the back
of the hand to the eye, the fingers half closed, laid over the wrist it holds — list it after that hand), `at` — the
wrist, `angle` — where the fingers point (0 up, + clockwise), `size` — the length of the hand (0.4), `side` (1 right, −1
left), `palm`, `curl` 0…1, `spread` 0…1, `tremble` 0…1, `blood` 0…1, `frozen`, `on` — lies on something (a shadow under
it), `sleeve: false` — without a sleeve.

## shot.mirror, shot.screws, shot.profile

- `mirror`: `at`, `size` (0.12), `angle`, `fog` 0…1 — breath on the glass, `held` (a hand on the handle), `who`; the
  point `mirror` (or `point`) — the middle of the glass.
- `screws`: the coffin lid, close — `{ who (whose hand), hand: false (no hand) }`; what moves is `now.screws`: `v` [4
  numbers 0…1] — how far each is screwed in (0 sticks out with its thread, 1 is home, the gap under the lid closes; the
  slot makes three turns over 0…1), `at` — the index of the screw with the screwdriver (−1 — without it; a fraction —
  the hand on its way, the screwdriver lifted), `test` 0…1 — the fingers try screw `at`. The points `screw1`…`screw4`
  are the screw heads (they rise with them), on the card x −0.5, −0.17, 0.17, 0.5, y 0.17 (on the scene at zoom 1:
  x 0.389, 0.719, 1.059, 1.389; y 0.67) — within the middle 4:3 of the frame, not at the edges: the game's marks stand
  on them.
- `under: (g, L) => …` — the scene's own, under what is in the shot (a white shift under the hands): drawn once, in card
  units; `L` — the shot's light.
- `profile`: the narrator — a profile in shadow, light only along the rim. `at`, `size` (0.7), `facing` (−1 looks
  left).

## Points (for the game: `b.where('closeup#<name>')`)

A face — `<who>_face` (or `point`), between the eyes; a hand — its `name`, the middle of the palm; `mirror`;
`screw1`…`screw4`. The layers of hands and the mirror move — their points with them. `shot.points` —
`[[x, y, name], …]`: the scene's own points in the shot (card units), where nothing is drawn — for the game's marks (a
mini-game's second way: “leave it so”, “stay”); they stay in place.

## Ready moments

| moment | light | shot / now |
| --- | --- | --- |
| Roderick greets | candle | `face({ who:'roderick', eyes:1.15, wet:0.8, to:[{ smile:1, part:0.25 }, { strain:1 }] })`; now: `to` [0→1 over 0.6 s, then 0→1 over 2 s] |
| Roderick from the light | candle | now: `flinch` 0→1 (0.3 s, out) |
| Roderick weeps | window | `face({ who:'roderick', grief:1, hands:'face', tear:1 })`; now: `cover` 0→1, `tear` |
| Madeline frozen | window | `face({ who:'madeline', frozen:1, eyes:1, turn:0, tear:0, to:[{ turn:-0.5 }] })`; now: `to:[1]`, `tear` 0→1 over 5 s |
| Madeline comes to | window | now: `frozen` 1→0 (0.5 s), `inhale` 0→1→0, `to:[0]` (1 s), `speak` to a line |
| Madeline in the coffin | torch | `face({ who:'madeline', lying:true, eyes:0, blush:0.7, smile:0.25, breath:0, frozen:1 })` |
| hand on hand | torch | `under: a shift, hands: [{ name:'mad_hand', who:'madeline', pose:'rest', on:true, frozen:true, … }, { name:'nar_hand', who:'narrator', pose:'touch', on:true, … }]`; now: `nar_hand.y` — it settles |
| the mirror | torch | the face in the coffin `size:1.3, at:[0,-0.35]` + `mirror: { at:[0.12, 0.07], fog }`; now: `mirror.y` |
| the screws | torch | `screws: { who }`; now: `screws: { v:[…], at }` |
| Roderick in the storm | lamp | `flash:true, face({ who:'roderick', eyes:1.3, fear:0.8, wind:1 })`; now: `flash`, `speak` |
| Madeline on the threshold | door | `face({ who:'madeline', blood:1, sway:1, eyes:1.15, size:0.5, at:[-0.1,-0.12], hands:'reach' })`; now: `reach` |
| the physician | candle | `face({ who:'doctor', sly:0.7, smile:0.3, tilt:0.2 })` |
| Roderick breathes | day | `face({ who:'roderick', eyes:0, nod:-0.5 })`; now: `inhale` |
| the narrator | candle | `profile: {}` |

## Cost

A shot is drawn once, when it is chosen: a face ~0.1–0.4 s (each expression of `to` — the skin and lips once more), a
hand ~10 ms — before the cut to it (`s.shot(…)` prepares it ahead). While it runs, code does not draw it: the graphics
card moves the layers, `live` only sets their numbers.
