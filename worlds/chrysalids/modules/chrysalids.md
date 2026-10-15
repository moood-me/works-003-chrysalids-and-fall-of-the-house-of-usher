# chrysalids — the people, horses and things of «Хризалиды»

A module: list it in a scene (`"modules": ["chrysalids"]`) and call it as `e.kit.chrysalids` (`scene.kit.chrysalids` in scripts).

Human motion now comes from recordings of real people, not formulas: walking, running, limping, old, proud, sad,
hands-behind and other walking styles and standing idles from 100STYLE; sitting down and getting up, going down on
one knee, laughing, crying (face in hands), cradling, a hand on someone's shoulder, lying and getting up, waving and
talking from the CMU Motion Capture Database. Each body is rebuilt from them with its own proportions (child, tall
preacher, broad smith), seen from any side; feet are planted by the step planner (no sliding), the recorded walk is
played in step with them. Poses are layers with masks (head / arms / torso / legs): a nod or a wave goes on top of
anything without thinning it.

## Sources and licences (attribution required)
- 100STYLE dataset — Ian Mason, Sebastian Starke, Taku Komura, "Real-Time Style Modelling of Human Locomotion via
  Feature-Wise Transformations and Local Motion Phases", 2022. https://zenodo.org/records/8127870 — CC BY 4.0.
  Used: Neutral, Old, Proud, Depressed, LimpRight, Monk, ArmsBehindBack, Rushed, Elated, Tiptoe, InTheDark, Followed,
  BentForward, WalkingStickRight, Skip (walk / run cycles averaged and looped; idles cross-faded loops).
- CMU Graphics Lab Motion Capture Database — http://mocap.cs.cmu.edu ("The data used in this project was obtained
  from mocap.cs.cmu.edu. The database was created with funding from NSF EIA-0196217."). Free to use, modify, redistribute.
  Used: 14_31 (sit), 23_03 (kneel), 79_70 (laugh), 79_72 (cry), 79_89 (cradle), 23_04 (hand on shoulder),
  140_08 (lie / get up), 141_16 (wave), 18_08 (talk). (14_31, the old sit, is still in the data but sit now uses Mixamo.)
- Mixamo (https://www.mixamo.com, Adobe; free to use in projects): Praying (two takes joined: getting down, praying,
  getting up), Quick Formal Bow, Head Nod Yes, Thoughtful Head Shake, Treading Water, Swimming To Edge (the crawl),
  Dying, Falling Back Death, Falling Forward Death, Picking Up, Lifting, Rifle Aiming Idle, Rifle Stand To Kneel +
  Rifle Kneel To Aim, Throw, Stand To Sit + Sit To Stand, Climbing.
- The recordings, converted to joint tracks, are `chrysalids.data.json` (the conversion pipeline is moood/dev/mocap in the moood repository).


One puppet for the whole world, so every scene's people are the same people and move like people.
Bodies are built in 3D (so any view works: side, front, back, 3/4, and turning between them), painted as soft
silhouette shapes (tapered limbs, coats, skirts, bonnets, hats that hide the joints), and moved by timing:
feet planted by a step planner (never slide), weight over the standing foot, the head leading turns, the
shoulders against the hips, cloth / hair / tails / lanterns lagging and settling (springs), idle breathing and
weight shifts that hold (never frozen, never fidgety), poses mixed by weight with the limbs and the head
arriving one after another (overlap), crowds out of step.

## The one call

The scene's people are moved once a frame — seen or not — by the lib's beforeFrame, and painted by their elements
from the very same options:

```js
// lib.js: who is where now, worked out from e (an element's, or beforeFrame's: t, state, was, speed, with the lib, kit, anim)
const people = {
  // by the element's id (a figure moved by `place`: { across: 'david_a', distance: 'david_d' })
  david: (e) => {
    const s = e.state;
    return {
      who: 'david',                            // id: the element's id by default (give one per figure when an element paints several)
      at: [s.david_a, s.david_d],              // where it is in the world (m): the gait comes from how this changes
      face: s.david_face,                      // degrees: 90 faces right, -90 left, 0 the viewer, 180 away (turn with scene.turn)
      pose: { kneel: s.david_kneel, pray: s.david_pray },   // poses by weight 0…1 (numbers that scenes ease)
      look: [2, -1.5],                         // a point to look at (this element's metres), or degrees
      light: 0.3, rim: '#ffc88a', rimDir: 180, // how lit (0 silhouette … 1 daylight colours); back light from the left
      mark: true,                              // its head marks the element (e.at) every frame, drawn or not: its lines, the camera
    };
  },
};
const lib = { people, beforeFrame: (f) => kit.chrysalids.move(people, { ...f, lib, kit, anim }) };
return lib;
```
```js
// the element david
const me = e.kit.chrysalids.person(g, e, e.lib.people.david(e));
```
An entry gives the figure's options, a list of them (several figures of one element, each with its own `id`), or null
(not there now); a horse's have `horse: true` (its element paints it with `horse`). The figure's head marks the element
of its key, or `el: 'id'`. Entries are moved in their order: `(e, got)` — `got`, where those before it are now (by key,
as `person` returns it). Painting gives only what changes in the picture over the options it was moved with — `{ id }`
is enough; one painted but not moved this frame is said in the scene's errors.

Paint it at the element's anchor (x 0, y 0 = the feet). Give the element `height` ≈ the person's height
(1.1–1.9 m) and a `box` that holds the figure with its reach, e.g. `[-1, -2.3, 1, 0.3]` (a horse: `[-2.5, -3.2, 2.5, 0.3]`).
Several figures may share one element: give each its own `x` (local metres) and `at` ([x, 0] if they move within it).

`person` returns where its parts are now (element metres): `head, top, chest, hip, hand {r,l}, shoulder {r,l}, foot {r,l},
carry, lap, back, face (deg), speed (m/s), height`. `e.kit.chrysalids.point(id, name)` gives a figure's point
(head, chest, hip, hand_r, hand_l, shoulder_r, shoulder_l, carry, back) in world terms, usable as a hand target:
`hand: { r: e.kit.chrysalids.point('david', 'shoulder_l') }` — this frame's for one earlier in `people`, else the last frame's.

## People (`who`)
david (≈10, blue shirt) · david_teen · rosalind (tall girl, long hair, grey-green dress; often `hold: { l: 'bow' }`) ·
petra (≈6, plum shawl — the accent) · sophie (≈10, rust dress, braid with a ribbon) · joseph (tall, black long coat,
wide hat, beard, stiff and slow) · emily (dark dress, apron, shawl, white bonnet) · axel (broad old smith-sailor, cap,
leather apron, stiff right leg: he limps by himself) · mary (grey-blue dress, apron, kerchief) · michael (teen, jacket, cap) ·
inspector (thin, long grey coat, tall hat; slow) · sealand (the Sealand woman: close white suit, cropped pale hair) ·
the community, each different by `seed` (or id): man, woman, farmhand, boy, girl, old_man, old_woman.
`build: { H: 1.8, col: { top: '#556070' }, wear: { hat: 'cap' }, gait: { limp: 'l' } }` overrides anything.

## Moving
- Walking and running happen by themselves from how `at` changes (ease it: scene.set(key, v, secs, 'smooth')).
  ~0.3–1.6 m/s walk, ≥2 m/s run (`gait: 'walk' | 'run'` forces one). Starting, stopping and turning on the spot make
  real steps; the torso leans into the speed and carries on a little when the body stops. Walking backwards works.
- `face` turns the body: the head gets there first, the chest next, the hips and feet last (feet step round).
- A figure that is carried, rides or sits gets `still: true` (no steps).
- Physics (steps, springs, cloth) runs in `move`, frame by frame. A figure jumping more than 3 m (a cut) starts fresh.
- Crowds: give every person its own `id` (and `seed` for generic people); read the same state late per person:
  `kneel: e.kit.chrysalids.delayed(e, 'kneel', 'p7', 1.2)` (0…1.2 s late), so nobody moves in step.

## Walking styles
`style: 'neutral' | 'old' | 'proud' | 'sad' | 'limp' | 'monk' | 'hands_behind' | 'rushed' | 'elated' | 'tiptoe' |
'dark' | 'followed' | 'bent' | 'stick' | 'skip'` (or `{ old: 0.5, sad: 0.5 }`). The cast has defaults (Joseph proud,
Axel limp, the Inspector hands behind, the old ones old). The style also gives the standing idle.

## Recorded actions
A recorded pose (sit, kneel1, kneel_reach, laugh, cry / face_hands, cradle, hand_shoulder, lie, wave, talk) plays its
own recording as its weight goes 0 → 1 (getting down / up at the recording's pace — a scene's ease only scrubs it,
never faster than ~1.3×), then holds alive (the held stretch plays slowly back and forth). Going back to 0 plays
the getting-up part. Any pose can be mirrored to the other hand: `'wave:l'`, `'hand_shoulder:l'`, `'shush:l'`, `'hammer:l'`
(its hand, elbow and mask go to the other side). The near hand (seen in front of the body): facing right (90) the right one, facing left (−90) the left one.
Layers: `pose: { kneel1: 1, nod: 1 }`, `{ walk…, wave: 1 }` — each pose touches only its parts (wave: arm, a little torso).
Scenes' own poses: pass `poses: { my_pose: {...} }` to person (don't change kit.poses).
- `inPlace: true` (person): a recording's own walk away from where it started is left out — kneel1 kneels on the spot
  (the recording steps ~0.3 m forward and, getting up, steps back and aside), sit sits with the seat at `at`.
- `travel: true` (person, or a pose of the scene's own): a clip that carries its path over the floor (`r` — the
  motions a model makes: the MCP's `make_motion`) moves the body along it from `at`, the steps and the way from the
  one motion — nothing slides; without `travel` it plays on the spot. Recordings have no path and play as before.
- Poses made from one recording share it: kneel1 ↔ kneel_reach cross-fade at the held stretch, without getting down
  again (the way down/up follows the sum of their weights). One base, the gestures as layers on top, is still best.
- kneel1's held stretch ends before the recording starts to rise: held, he stays down. sit sits straighter.
- `lean` / `side` of a pose bend the spine (the chest goes forward over the hips): bow, slump, rake, stir, cower bend
  at the hips, not only at the shoulders.
- Water: `swim` is grounded 'low' (its lowest point on the anchor): from wading to swimming in one move, ease the
  anchor up as the weight grows — `y: mix(bottom, surface + 0.18…0.35, swim)`, `water: surface − y`; `wade` (deep water,
  arms out over it) and `lunge` (throwing oneself forward) are layers over walking; standing up out of the water is the
  same move back (swim → 0 as y comes down to the bottom). `tread` (recorded) is anchored at the pelvis (y = the pelvis).
- `cling` (arms up and forward, hands meeting: aim them at another's shoulders with `hand`), `scoop` (down on the
  haunches, arms low and forward: aim them at a child on the ground, then let the child go to `carried` on the arms
  and the adult to `carry`), `over` (a layer over kneel1 / kneel: bent over someone lying, a hand going to them).
- Recorded from Mixamo (each plays as its weight goes 0 → 1, holds alive, and gets up / back when it goes to 0; give
  `inPlace: true` to keep the body over `at`):
  `pray_kneel` (down on both knees, hands together, praying; the way up), `kneel2` (on both knees, the hands free),
  `bow_deep` (a deep bow from the waist), `nod_yes` / `shake_no` (recorded nodding and head-shaking: head layers over
  anything; the drawn `nod` / `shake` stay for a light touch by weight), `tread` (treading water — now the recording,
  still anchored at the pelvis), `crawl` (swimming face down, a cycle in place), `collapse` (struck, staggering, down
  on the knees, forward onto the face), `fall_back` (onto the back), `fall_forward`, `pick_up` (bending from the waist
  to pick a thing up, standing with it at the chest), `lift_up` (squatting to lift something heavy — a child — to the
  chest), `aim_rifle` (aiming standing) and `kneel_aim` (down on one knee aiming) — with `hold: { r: 'gun' }` the gun
  lies along both hands, `throw` (overarm), `scramble` (up a steep slope on hands and feet, a cycle in place), and
  `sit` (now Mixamo's sitting down and getting up: upright, the hands on the thighs; `seat` as before).
  The old drawn poses keep their names and meaning (`bow`, `pray`, `kneel`, `aim`, `nod`, `shake`, `swim`).
- `frozen: true` (person): time stops for the figure where it is — no breath, no idle, the cloth still (caught in a web).
- `hold: { l: 'gun' }` holds the gun in the left hand (forward from it, as in the right).
- Not in the recordings: getting on and off a horse, riding, bandaging, stairs (the Mixamo stair takes are in
  moood/dev/mocap/mixamo, not yet made into a gait), carrying a person and being carried (the Mixamo takes don't fit).

## Poses (`pose: 'name'` or `{ name: weight }`, mixed; weights spring a little past and settle)
On the ground (own the legs): sit (on a chair: give `seat: 0.45` — the feet reach for the floor or dangle), sit_ground
(knees up), sit_legs (legs out, leaning on the hands), kneel, kneel_sit (on the heels), kneel1 (one knee, the back upright), crouch, squat,
lie (on the back), lie_face.
Standing gestures (legs keep walking): reach, point, point_down, point_up, wave, beckon, talk, head_hands, face_hands,
hug, carry, lift, offer, hold_hand, pray, bow, slump, look_up, cower, shush (finger to lips), temple (tap the temple),
shade (hand over the eyes), think, arms_folded, hands_behind, hands_hips, preach (arm raised, book in the other),
read, raise (lantern/torch high), scream, pull, push, hammer, rake.
Anchored (the anchor is the seat/pelvis, not the feet): ride, carried, held_up, swim, tread (treading water), hang,
climb (`cycle` drives climb/swim). New drawn poses: hammer (`cycles: { hammer: n }` — the n-th blow lands exactly at
n + 0.7, the top of the swing at n + 0.53, so a scene can sync sparks; a cycle given in `cycles` is used as it is, with no
per-person offset; a mirrored pose reads its base name too: `cycles: { hammer: n }` drives `'hammer:l'`; the lift bends
the elbow and carries the hammer over the shoulder, the fall opens the elbow first), kneel_stiff (Axel: the stiff leg
stretched), sit_dangle (on a barrel, legs swinging; give `seat` — any pose that sits honours it; `cycles: { sit_dangle: u }`
sets how far the swing has gone, so a scene can slow it and stop it), peek, aim (`hold: { r: 'gun' }`, `fire`, `smoke`), draw_bow, hit (thrown back), arms_up, stir, eat,
hand_chest, freeze, nod, shake (head layers).
Add your own: `e.kit.chrysalids.poses.my_pose = { lean: 20, head: [30, 0, 0], armR: [90, 10, 20, 0], leg: [...] }`
(see the source comments for the fields). Cyclic poses (wave, hammer, rake, swim, climb) run on e.t or `cycle`.

## Hands, eyes, things
- `hand: { r: [x, y], l: K.point(...) }` (+ `handW: { r: 0…1 }`): IK, the elbow finds its own way.
- `look`: point or degrees; past ~75° the shoulders turn too. `lookSpeed` (1 default, 0.3 a slow turn of the head).
- `hold: { r: 'lantern' | 'torch' | 'book' | 'open_book' | 'bundle' | 'hammer' | 'staff' | 'rake' | 'pitchfork', l: 'bow', both: 'rake' }`
  — lanterns swing and settle, torches flicker; both glow through e.light (`glow: 0…1`). `both` = a long tool in two hands.
- `carry: { who: 'petra', id: 'petra', pose: 'carried' }` — the child sits on the arms, painted between the body and the
  near arm. Hand-overs: the child is a figure of its own (its `people` entry) on its own path, both adults' hands at
  `K.point('petra','chest')` (or `got.petra.chest`).
- `e.kit.chrysalids.prop(g, e, 'lantern', { x, y, angle, glow })` — a thing on its own.

## Horses
```js
// a people entry
sheba: (e) => ({ horse: true, kind: 'horse' | 'pony' | 'great', id: 'sheba', at: [s.sheba_a, s.sheba_d], face: 90,
  rider: { who: 'david', id: 'david' },          // or [rider, pillion]; their far leg goes behind the horse
  pack: true,                                    // panniers (the great-horses)
  pose: { graze: 0…1, toss: 0…1, rest: 0…1 }, light: 0.2, rim: '#ffc88a' }),
// its element
const h = e.kit.chrysalids.horse(g, e, e.lib.people.sheba(e));
```
Gait from speed: walk < ~2 m/s < trot < ~4.6 < canter < ~8 < gallop (scaled for size; `gait:` forces). Returns
`saddle, pillion, basket (the near pannier's mouth — a child in it: a separate person with pose 'carried' or 'sit_ground', `still: true`, y a little below), head, rump, gait, riders` (each rider's info). Riders sway with the horse's jolts.
Poses: graze, toss (head tossing), rear (on the hind legs, forelegs tucked), rest (a hind hoof resting).

## Directing helper (scripts)
`scene.kit.chrysalids.walkTo(scene, { a: 'david_a', d: 'david_d', f: 'david_face' }, [toAcross, toDistance], { speed: 1.2, delay: 0, faceEnd: 0 })`
turns the person toward the mark (head first), walks there at a natural pace easing in and out, optionally turns to
`faceEnd` on arrival; returns the seconds it takes (chain the next beat after it). speed ≥ 2 runs.
`scene.kit.chrysalids.faceToward(a, d, a2, d2)` — the face angle from one place toward another.

## Light and ground
`light` (0.1–0.3 for dusk/night silhouettes, 0.5–0.8 daylight), `dark` (the scene's silhouette colour, default #1d1b22),
`tint` (the light's colour multiplies the cloth), `rim` + `rimDir` (degrees toward the light on screen: 0 right,
180 left, -90 up) + `rimWidth` (px), `shadow` (0…1 contact shadow, default 0.32), `view` (how much the ground tilts
toward the eye: ≈ 1.7 / distance; default 0.14), `idle` (0 = no idle life), `wind` (m/s, hair and hems).

## Watch out
- One `id` = one figure. The element's id is used when you give none — enough for one figure per element; several
  figures in one element each need their own `id` (a shared id is reported in the scene's errors). Riders and carried
  children get ids of their own (`<id>:rider0`, `<id>:child`) unless you give them.
- Water: `water: 0.6` (metres of water above the feet) — the body under the surface dark and faint, rings around it.
- Uneven ground: `groundAt: x => height` (element-independent function of world across) — feet and knees follow it.
- `alpha` (0…1), `rim2` / `rimDir2` — a second rim light from the other side.
- Riders on great-horses in panniers: `rider: [{ who: 'rosalind', basket: 'near' }, { who: 'petra', basket: 'far' }]`.
- `walkTo(..., { seconds })` sets the duration; `walkPath(scene, keys, [[a, d], ...], { speed })` follows points.
- New cast: sophie_adult, wender (Mrs Wender). New props: gun, ladle, spoon, bowl, shoe.
- The kit's painting reads e.t: a figure repaints itself every frame. A figure not moved (null) for more than 1.5 s
  starts fresh.
- Keep `at` in world metres matching the place the engine puts the element; for figures inside a big element, `at: [x, 0]`.
- `point()` is where a figure was moved: this frame's for one earlier in `people`, else the last frame's (two reaching
  for each other: one reads the other's of a frame before).
- `held_up` / `carried` / `ride` anchor at the pelvis / seat — set y to where the seat is (the returned `carry`, `saddle`).
- Cost: ~0.3–0.5 ms a person, ~1 ms a horse with a rider, ~2 ms with rim light — a crowd of 20 is fine.
