# chrysalids — the horses of «Хризалиды» (engine 3)

The world's people are the engine's (the module `cast`); this module has what the engine does not move: its horses. List
it in a scene's `modules` and call it as `e.kit.chrysalids` (`kit.chrysalids` in the lib).

## A horse

An element of the scene, its place and its heading state keys; its code and its animate the module's:

```json
{ "id": "horse", "name": "Конь", "across": -18, "distance": 17, "place": { "across": "r_a", "distance": "r_d" },
  "box": [-2.6, -3.2, 2.6, 0.4], "shadow": true }
```
```js
// the scene's lib: which horse, and the state keys it goes by
const HORSE = { kind: 'horse', across: 'r_a', distance: 'r_d', face: 'r_face', toss: 'r_toss', here: 'rider_here' };
// elements/horse.js — painted once
e.kit.chrysalids.horse.paint(g, e, { kind: e.lib.HORSE.kind });
// elements/horse.animate.js — its steps, its turn, its head, its tail, each frame
e.kit.chrysalids.horse.animate(e, e.lib.HORSE);
```

- **Painted once**, reading no state, in daylight colours (the scene's light lays the hour, the rims and the shadows):
  its body, its neck with its mane, its head and its tail as seen from 24 ways round (a layer each; a little from
  above), each leg's three bones once — every layer at its own depth: what of it is nearer the eye is before what is
  farther, a rider's near leg before its barrel, the far one behind it. Nothing repaints as it turns or goes; no
  `redraw`.
- **`animate`** moves it and makes nothing: `face` — the key of its heading, degrees (0 toward the eye, 90 to its right,
  180 away): the layers of the nearest painted way are shown, laid as it is turned now (a turn on the spot is stepped
  round); `across`, `distance` — the keys of its place: its gait by how fast they go — a walk up to 2.1 m/s, a trot to
  4.6, a canter to 8, a gallop (a horse of 1.55 m; × √ its height), each with its own beats, stride, bob, pitch and nod,
  one going over into the next —, the hooves planted on the way gone; `toss` — the key of its head tossed, 0…1 (a horse
  fretting: its head thrown up and shaken); `here` — a key that is `false` while it is not there. Standing it breathes,
  its head idles, its tail swishes.
- **Move it at a gait's own pace**: `horse.pace('walk' | 'trot' | 'canter' | 'gallop', kind)` → m/s (1.63, 3.3, 6.2, 11
  for the riding horse) — `scene.path([...], points, { speed: pace, ease: 'linear' })`. Another speed is another gait:
  the legs follow the ground whatever the speed, the gait is the one that speed has.
- `kind`:
  - `horse` — a riding horse, 1.55 m at the withers, dark bay (the riders of the community);
  - `great` — a great-horse of the Fringes' kind, 2.05 m, heavy, a wicker pannier either side (a child sits in one);
  - `pack` — the pack horse, 1.42 m, a load of bundles roped over its back;
  - `sheba` — Sheba, the mare, 1.52 m, light grey — the one horse that reads first at night.
  `col` (paint's): `{ coat, mane, hoof, load, strap }` over its colours.
- Its points: `head` (`<id>#head` — where it is looked at, framed, marked by a game: its head as it nods and is tossed;
  the element's own point too), `seat` (the saddle's top as the stride moves it — a rider's `on`), and a great-horse's
  `basket_l`, `basket_r` (each pannier's mouth, its left and its right — a child's `on`). Its stirrups and its reins are
  points in its frame, other ones each way it is turned: `horse.tack(id, face, kind)` → `{ foot_l, foot_r, r, l }`, each
  `{ "on": id, "at": [across, distance, elevation] }` — a rider's `reach`.

## Its rider

A person of the cast (`rider`, or anyone) in the saddle: `<id>_on: {"at": "horse#seat", "up": -0.5}` (the seat is the
saddle's top; a seated loop sits a man's pelvis 0.58 m over its floor — `up` puts the hips onto the saddle), a seated
loop (`perch_still`), `<id>_reach` the horse's `tack` for its heading — kept as it turns by the scene's script:

```js
const tack = () => scene.set('rider_reach', scene.kit.chrysalids.horse.tack('horse', scene.get('r_face')));
scene.on('change', 'r_face', tack); scene.on('move', 'r_face', tack); tack();
```

`<id>_turn` the horse's heading as a person's turn (`180 − face`), `<id>_look` where the rider looks. Getting up into
the saddle and down out of it are the cast's `mount` and `dismount`: done standing at the near side (the horse's left),
then `on` the seat as `mount` ends; `on(null)` as `dismount` begins.

## A child in a pannier

`<id>_on: {"at": "great#basket_l", "up": -0.35}` and a seated loop (`sit_knees`): the pannier's near wall is a layer
before the barrel, so the child's legs are in it and its body above the rim. Put in by someone standing beside — the
cast's `lift_into` (a child lifted from the ground into a high basket before them): the child `on` the lifter's
`hands` while it lifts, then the basket.
