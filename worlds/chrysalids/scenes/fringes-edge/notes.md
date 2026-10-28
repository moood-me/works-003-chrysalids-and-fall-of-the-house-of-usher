THE EDGE OF THE FRINGES (The Chrysalids v3; V.5), engine 3. Rewritten from the "film game" (engine 1, a picture, camera walk): camera picture.
The last field of Waknuk under the moon, the boundary fence with a gap, beyond it — pale plants, the deviant forest,
fog; on the left — "the guardians of the gap", five trees (hero_trees, their parts at their own depths). The moon — behind the forest on the left, low (the light
`moon` from lib.MOON): the trees' shadows — the engine's real shadows — fall across the field and the path. The path (path — a plane on the
field) goes from the near edge of the field diagonally to the gap and on into the forest; whether a point of the field is in shadow — lib.shaded (from the same
trees and moon the engine casts the shadows by; a crown — by its painted edge, lib.CAST).
The father (joseph, tall, with a lantern, in a hat) — in the field by the fence on the left, while lantern_in_field; his beam — the scene's light `beam`:
a spot 5.5 m from him, where lantern_turn says; the beam goes over the field by itself (once in 6.5 s — to a new place). The fugitives — david
(the look david_teen, he goes first; starts at 5.5 m) and rosalind (on the path a metre behind him).

"By the shadows" (the game): `walkers` 1 — they walk along the path (the action walk, at their own pace), 0 — they stand. The scene sets by itself: walk_u
(where David is on the path, 0…1; every frame of the way and once in 0.1 s), walk_shade (1 — in a tree's shadow), walk_lit (0…1 — how much of the beam is on
them). figure_on_path 1 — they go off along the path into the forest. The "film"'s keys glow (the pale plants, the spores), mist — as they are.
The father — a small figure by the fence; the fugitives start near and go off into the depth; the path, the beam and the shadows are clear.

## Contract for the check

```json
{
  "beats": {},
  "points": ["david", "joseph", "rosalind"],
  "offers": [],
  "party": { "glow": 0.7, "mist": 0.6, "figure_on_path": 0, "lantern_in_field": 0, "walkers": 0 },
  "speakers": ["joseph", "rosalind", "david"]
}
```
