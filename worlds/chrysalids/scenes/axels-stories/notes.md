AXEL'S STORIES (The Chrysalids v3; III.2), engine 3. Rewritten from the "film game" (engine 1): a night by the fire on the knoll behind
the forge. The knoll — the ground (relief.js: +0.7 m between 2.4 and 3.6 m; the grass — the plane rise, lying on it), the eye a little below
the people, as in the "film"; the horizon 0.55. The people — the cast, and bigger than in the "film": Axel sits on a log left of the fire (on —
the log's seat, perch_still / perch_talk), David on the right hugs his knees (hug_knees). The pictures — once, in day
colours; the light — the campfire (`fire`, of fire#flame, on: fire) and the night (ambient), the look dawn. The fire, the sparks, the smoke — particles
(amount: fire); the smouldering coals — a layer.

The visions — the sky's elements vis_ship (1), vis_city (2), vis_coast (3): each painted once into a layer of its own in the middle of
the smoke (their drawing is the "film"'s: the outlines gathered into one Path2D and filled once with a blur — the blur in the sky's units,
the "film"'s 3.6 px / 1080); where it is, how big and how much it is seen — animate by story, vision, dawn and the time, as in
the "film" (at vision 0 all three small, in a staircase; the one being told — in the middle, full size; the ship rocks). vis_mist —
the haze (layers, a drift). No captions: the scene is silent (the "film"'s captions line1/line2 are gone).

The "film"'s KEYS: dawn, fire, story (> 0.2 — Axel talks: his hand to the smoke, both look at the visions; else he is silent, looks at
the boy), vision 0…3, david_present. No mini-game (§8). Points: axel (the questions to him — as petals) ≈ (0.31, 0.48),
david ≈ (0.60, 0.53), fire#flame.

## Contract for the check

```json
{
  "beats": {},
  "points": ["axel", "david", "fire#flame"],
  "offers": ["axel"],
  "party": { "fire": 0.8, "story": 0, "vision": 0, "dawn": 0, "david_present": true },
  "speakers": ["axel", "david"]
}
```
