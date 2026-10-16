THE DREAM OF THE CITY (The Chrysalids v3; IV.4), engine 3. Rewritten from the "film game" (engine 1): the sky, the clouds, the city by the sea, the fish,
the dust motes — elements of the sky (units — the scene's heights), painted once; dream, lights, craft — keys the game changes
seldom (the pictures read them, redraw in steps of 0.1; in the chapter they change behind the closed window of waking); waking — only layers
and animate (the towers sink in groups and pale, darkness, sparks, a thicker haze; the bedroom window — a card 1.5 m before
the eye, glows, its posts, its beam, its sill, its crossbars — layers; the "film"'s numbers in metres of its card, K = 1.5 / 4.26).
The dune — the ground (relief.js) and sand (a plane on it); David — a person of the cast from behind, in a nightshirt, barefoot (david_wear),
looking at the city. The wheat at the edge on the left — layers in the wind. The world's light — from the city (city, a far light on the right) and the night (ambient);
the look waking.

The fish (craft): up to three, each a layer in its own place (lib.FISH); the leading one, by `lead`, goes along its way over the city
(lib.PATH: u 0…1; the game leads lead over 40 s), its point `craft#fish` follows it (animate); without lead it drifts, like
the others. "Hold the dream": `gaze` −1…1 — where along the same way David looks: the place u = (gaze + 1) / 2 — there a soft
light spot on the sky (the layer craft), and David's head turned there (script.js: a look to a point of the world on that side, lib.toWorld);
null — he looks at the city. The "film"'s keys lead_x/lead_y are gone (§3). The twinkling of the windows and of the glints on the water — still (a small
regression); the water moves as a layer of waves.

KEYS: craft, dream, lights, waking (the direction "Wake up"), boy_present, lead, gaze. Points: craft#fish (≈ 0.46…0.80
in x, 0.28…0.33 in y — the way over the city, in 4:3), city ≈ (0.665, 0.54) — the choice "far", Sealand's lines over it.

## Contract for the check

```json
{
  "beats": {},
  "points": ["craft#fish", "city", "david"],
  "offers": ["city"],
  "party": { "dream": 0.75, "craft": 0.2, "lights": 0.6, "waking": 0, "boy_present": 1 },
  "speakers": ["city"]
}
```
