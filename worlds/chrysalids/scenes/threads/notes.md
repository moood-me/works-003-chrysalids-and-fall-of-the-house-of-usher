THREADS (The Chrysalids v3; between the chapters), engine 3. The game's own scene: the whole play on the night sky — the chapters left to right,
each with its tree of choices. Camera picture (it was panorama: under the language's choice it cannot move by itself): the sky goes to a chapter
by the key camera_x, which the scene leads itself by shown (script.js); the chapters stand lib.SPACING = 5 m apart (10 m from the viewer) — the shown one
and both its neighbours in the language's window.

- `chapters` — the chapters in order: `{number, title, kind: here | played | next | future | end, map}`; `map` — the chapter's rows of
  choices `[{title, weight '⚑'|'~', options: [{label, state: chosen | tried | both | open | unseen}]}]`: the threads of the main
  run (`chosen`) — bright, of the replays (`tried`) — pale and dashed, `both` — shared, the unplayed (`unseen`) —
  dotted (as a silhouette). The future chapters (`future`) — only the number and the title, dim, without threads or a knot. Set on
  opening (the pictures read it); while moving nothing is repainted.
- `camera_x` — where the sky is: chapter i — i·5 m; the scene leads it itself by `shown` (script.js: at once on opening, over a second on a change).
- `shown` — the chapter the player is at (its knot brighter); `reveal` 0…1 — how many of its rows are seen (row by row — the tree's layers
  `r<k>`, animate); `knot` — the knots' brightness.
- Elements: `t0`…`t7` — the chapters' trees (and the thread from a chapter's end to the next one's knot); `k0`…`k7` — their knots (the point `k<i>#knot`,
  the halo and the rings — layers, the rings turn). The stars twinkle in the sky's shader (elements/sky.wgsl).
- The choices' labels — in the picture, without a shadow (the text's shadows are gone: shadow lengths on engine 3 are in the picture's units).

## Contract for the check

```json
{
  "beats": {},
  "points": ["k0#knot", "k1#knot", "k2#knot", "k3#knot", "k4#knot", "k5#knot", "k6#knot", "k7#knot"],
  "offers": ["k0#knot", "k1#knot", "k2#knot", "k3#knot", "k4#knot", "k5#knot", "k6#knot", "k7#knot"],
  "party": { "shown": 0, "reveal": 1, "knot": 1 },
  "speakers": []
}
```
