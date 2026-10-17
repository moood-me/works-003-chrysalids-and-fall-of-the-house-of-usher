THREADS (The Chrysalids v3; the play's map), engine 3. The game's own scene: the night sky — the map's background; the
chapters' trees (number, title, knot, the forks with their choices, the threads) the game draws itself over it, in its
own HTML (its `map.js`), at this scene's chapter points. Camera panorama, span [0, 35] — eight places of the sky
(chapters 0…6 and "The end") 5 m apart (10 m from the viewer). The sky goes to a chapter by the key camera_x, which the
scene leads itself by shown (script.js); the player may drag the sky left and right himself: span holds the sum of his
shift and camera_x, and camera_x going to a chapter takes his shift along with it (not while a finger holds the sky).
The arrows and A/D move the sky too; the wheel and a pinch come nearer (the camera goes toward the sky — the chapters'
points nearer, their depth less).

- `shown` — the chapter the player is at; `camera_x` — where the sky is: chapter i — i·5 m; the scene leads it itself by
  `shown` (at once on opening, over a second on a change); the player's shift — on top, within span.
- Elements: `sky` — the night sky, painted once; in its shader (elements/sky.wgsl) the stars twinkle and the mist low
  down slowly breathes (by time, with no repaint). `c0`…`c7` — the chapters' unseen points (unseen; across i·5, 8 m
  high — where the game's tree has its knot); `author` — the unseen point of the author's sign (across −3.2, left of
  the first chapter, at half height: seen when the sky is at the first chapter).

## Contract for the check

```json
{
  "beats": {},
  "points": ["c0", "c1", "c2", "c3", "c4", "c5", "c6", "c7", "author"],
  "offers": [],
  "party": { "shown": 0 },
  "speakers": []
}
```
