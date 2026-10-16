THE STRORM FARM (The Chrysalids v3; I.5, II.1, V.2), engine 3. Rewritten from the "film game" (engine 1, camera walk, the house at 40 m,
a painted David) to read better: camera picture, the yard nearer — the barn on the left (20 m), the well (11.5 m), David (8.5 m,
a person of the cast), the house on the right (18 m) with one warm window; the fence goes away from us on the left to the barn's corner (the leading line), beyond it
stands the wheat (the rows wheat_a…e — pieces of 3 m in layers in the wind), on the right the stubble with stooks (copies of one), a boundary, poplars,
a shelterbelt, hills. The pictures — once, in day colours; the evening — the scene's light: the sun (just set, behind on the left) fades
by the look dusk, the moon takes its place (on: dusk). The window with the lamp — the element pane on the house (glows), its light — the scene's `window` (on:
window_lit), the warm layer of the glass — by window_lit. The sky's night — a layer over the evening one, the stars — a layer (both by dusk in
animate; they do not twinkle — a small regression, as in "The Strorms' kitchen"). What moves: birds (layers of the sky), smoke (particles from house#chimney),
fireflies (particles, amount = dusk), the wheat, the poplars, the grass, the well's bucket.

KEYS (the game sets them): dusk (0.45 — the evening of II.1, 0.75 — I.5, 1 — the night of V.2), wind, window_lit, boy_present, older (new:
V–VII — David a youth, david_teen; script.js sets it). Points: well#bucket, barn#door, house#door, house#window (it is also
house — the mother's lines over it), david, house#chimney (the smoke). All — in the middle of 4:3 (x 0.23…0.71, y 0.60…0.66); the choices
of one fork ≥ 0.15 apart: II.1 — well#bucket / barn#door / house#door; V.2 — house#window / david.

## Contract for the check

```json
{
  "beats": {},
  "points": ["well#bucket", "barn#door", "house#door", "house#window", "house", "david"],
  "offers": ["well#bucket", "barn#door", "house#door", "house#window", "david"],
  "party": { "dusk": 0.5, "wind": 0.4, "window_lit": 1, "boy_present": true, "older": false },
  "speakers": ["house", "david"]
}
```
