# ushers — the horse, still figures and things of “The Fall of the House of Usher” (engine 2)

A module: list it in a scene (`"modules": ["ushers"]`), call it as `e.kit.ushers`. The world's people are the engine's
(`cast`); this is what they are not: the narrator's horse, the old 2D puppet's figures in one moment (a vision, a
painted figure), and things standing on their own with their flames.

## The horse

Built as the old one was — masses of rounds (forehand, barrel, quarters), the arched neck, the head, ears, mane, tail,
four legs of three bones and a hoof — each round and each tapered limb between two of them a layer painted once;
`horseLive` moves them every frame where the horse's 3D frame puts them as seen from the eye: its gait (walk, trot,
canter, gallop) from how fast its place goes, the stride's phase by the way gone (the hooves never slide), the bob and
the nod, its turn (the head first), its poses. Nothing is painted again.

```json
{ "id": "rider", "name": "Horse", "height": 2.4, "box": [-2.5, -3.3, 2.5, 0.3],
  "across": -4.7, "distance": 10, "place": { "across": "rider_a", "distance": "rider_d" }, "shadow": true,
  "code": "e.kit.ushers.horse(g, e, {})",
  "animate": "e.kit.ushers.horseLive(e, { face: e.state.rider_face, keys: ['rider_a', 'rider_d'], toss: e.state.horse_toss })" }
```

- `horse(g, e, o)` — its layers (`horse:…`). `o`: `height` (withers, 1.6 m), `col: { coat, mane, hoof }`, `light` (0 a
  silhouette of `dark` … 1 its own colours; 0.35), `dark`.
- `horseLive(e, o)` — `face` (degrees, the old way: 0 toward the eye, 90 to the right, 180 away), `keys` (its place's
  [across, distance] keys: its speed), `toss`, `graze`, `rear`, `rest` (0…1, sprung), `gait` (forced), `seat` (metres from
  the saddle down to where a rider's feet hang, 0.75 — the cast's `ride`), `view` (how much the ground tilts toward the eye; default 1.7 / its
  distance from the eye). → the gait's name.
- Its points (marked every frame): `saddle`; `stirrups` — under it, where a rider's feet hang; `head`; `rump`.
- **A rider** is the engine's person (the cast's narrator), sitting it: `narrator_on: "rider#stirrups"` (their floor
  there, their hips at the saddle), `narrator_do: {motion: "ride", loop: true}`, `narrator_turn` = 180 − the horse's
  `face`; the far leg is hidden by the horse, the near one before it, pixel by pixel.

## A still figure

`figure(g, e, o)` — someone of the old puppet's cast (`who`: narrator, roderick, madeline, doctor, valet) in one moment
of a pose, painted once: `id` (several in one element: each its own), `x` (its element's metres), `face`, `pose`, `wear`
(`{ blood: 1 }`), `build`, `light`, `dark`, `rim`, `rimDir`, `rim2`, `key`, `alpha`, `shadow` — the old options
(the old ushers.md, «The one call» and «Light»). Any motion is its layer's (paint it inside an `e.layer` and move that).

## Things

`prop(g, e, what, o)` — `'candle'`, `'candlestick'`, `'lamp'`, `'torch'`, `'guitar'` (upright on its foot), `'book'`,
`'letter'`, `'mirror'`, `'bag'`, `'key'`, `'screwdriver'` at (`x`, `y`), turned `angle` degrees, in the light `light`
(0 silhouette … 1 daylight colours), `dark`. Its flames are a layer of their own (`'<what>:flame'`, or `o.flame`) that
flickers and wavers on the GPU, and their light is an `e.light` where they burn (light the room with the scene's light
`"of"` the element); `glow` — how much they burn (0: out); `flame: false` — painted in place (when the prop is painted
inside a layer of the scene's own: a layer has no layers).

## Sources and licences (the figures' recorded motion: ushers.data.json — attribution required)

- **100STYLE** — Ian Mason, Sebastian Starke, Taku Komura, "Real-Time Style Modelling of Human Locomotion via
  Feature-Wise Transformations and Local Motion Phases", 2022. https://zenodo.org/records/8127870 — CC BY 4.0.
- **CMU Graphics Lab Motion Capture Database** — http://mocap.cs.cmu.edu ("The data used in this project was obtained
  from mocap.cs.cmu.edu. The database was created with funding from NSF EIA-0196217.").
- **Mixamo** (Adobe, https://www.mixamo.com; free to use in a project).
