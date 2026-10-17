VOICES (The Chrysalids v3; III.5, IV.3), engine 3. Rewritten from the "film game" (engine 1): night, David on the hill on the left (a person of
the cast, sitting, looking into the valley; the hill — the ground relief.js, its crest 1.5 m — below the eye, the valley seen over it), across the valley
farms with windows — far off on purpose. Each farm — two elements: the buildings (farmN_b: a house, a barn, a windmill — its sails a layer
turning, poplars — layers in the wind) and the window (farmN: glows, a warm glass — a layer, the light `win`; animate — alight if the
window is among the first `count`, else dim: Anne's window goes dark at count −1). home — Petra's window (brighter, its light wider with `petra`).
The windows moved into the language's window (4:3, no nearer than 0.08 to the edges): x as shares of the scene — lib.W (farm7 in the "film" stood at 0.97).

The sky (the element sky, units — the scene's heights): stars (a layer), the Milky Way, clouds — eight layers (by `clouds`, a drift
in animate); the voices — a glow round David (the layer aura by voices), a thread to each window — a layer (the "film"'s drawing, without
a wave), its pulse — a small light that animate leads along the same curve; no more than four seen bright (as in the "film");
Petra — a radiance over her window, three spreading rings, a warm thread to David (layers by `petra`). The threads begin at David
(lib.AURA) and end at the windows (lib.W, the horizon lib.HZ); move a window or David — mend the lib. The haze at the horizon —
the sky's layer mist. The world's light — night (ambient, a faint light from above on the left), the windows' lights.

The "film"'s KEYS: count, petra, clouds, voices, david_present. Points: david#head (≈ 0.27, 0.54), farm1#window … farm8#window,
home#window (all ≈ y 0.66, x — lib.W), and their names without #window. Choices: anne — on farmN (the last window), petra — on home.

## Contract for the check

```json
{
  "beats": {},
  "points": ["david#head", "david", "farm1#window", "farm2#window", "farm3#window", "farm4#window", "farm5#window", "farm6#window",
             "farm7#window", "farm8#window", "home#window", "farm1", "farm2", "farm3", "farm4", "farm5", "farm6", "farm7", "farm8", "home"],
  "offers": ["farm7", "farm8", "home"],
  "party": { "count": 0, "voices": 0.4, "petra": 0, "clouds": 0.15, "david_present": 1 },
  "speakers": ["david", "home"]
}
```
