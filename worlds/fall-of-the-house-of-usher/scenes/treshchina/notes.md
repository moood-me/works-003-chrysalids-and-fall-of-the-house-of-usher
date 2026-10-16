A service scene of the game “The Fall of the House of Usher” (bespoke): between the chapters. The wall of the house in half-darkness; on it are carved the chapter's number and title, and after the chapter — the map of its choices, drawn by the crack. Engine 2: the pictures are static, the motion is shaders.

- `chapter_number`, `chapter_title` — the title (the number may be empty: the prologue, the whole game).
- `map` — null (only the title) or the rows of choices `[{title, weight '⚑'|'~', options: [{label, state: 'chosen'|'open'|'unseen'}]}]`. The crack's trunk goes from the top past the title through the chosen options — a deep crack, red in its depth; to the open but unchosen ones — a hairline; to the unreached ones — a barely visible line, with no word. The rows' questions — on the left, in italics (⚑ brighter). Above the map the chapter's number and title — on one line, below the site's header (y ≈ 0.19). The rows are laid out by measured words: each has a height of its own (the chosen option's label — beside its point, on the side where it does not cover other labels, else away from the crack that came in; the open ones' labels — under their points, below the chosen one's label if it is above them; if they do not fit their share of the width — every other one a line lower, twice as wide). If it all does not fit in height — everything smaller (down to 0.55), the labels — up to two lines, as a last resort with “…”.
- `reveal` 0…1 — how far the crack has come down the wall (the game leads it 0 → 1 over 3.5 s for a title, 2.5 + 1.2 s a row of a map): the edge goes from the top of the frame (−0.04) to its bottom (0.98), easing in and out (`lib.js` REVEAL; the same in `crack.wgsl`, `knot.wgsl`). The title — over the first third; a row's words show when the crack's edge has reached them.
- `knot` 0…1 — the brightness of the crack's end (the element `knot`, which the game offers to choose): a hole in the stone with a red ember, the glow around it breathing. Seen once the crack has reached it.

How it is built: `lib.js` — `layout(A, state, measure)`: where everything is on the wall (the title, the rows, the trunk, the branches, the chips, the knot), in scene heights; both `crack` and `knot` call it — the knot is always at the crack's end. All three elements are sky (a 16:9 scene, frame heights).
- `wall` — stone, reads no state: painted once.
- `crack` — painted once per map (reads `map`, `chapter_*`, not `reveal`): the base — a red glow in the depth of the trunk and at the chosen points (the shader makes it light, `emission`), layer 1 — the title, 2 — the rows' words, 3 — the crack with its points. `crack.wgsl` cuts the crack at the edge (`reveal` — a uniform from animate), the words — softly, 0.06 behind the edge, the title — `title`.
- `knot` — painted once per map: the base — the hole, the layers — the heart of the glow (breathing), the glow's rim, the ember; the breathing and the appearing — `knot.wgsl` (`u_time`, `reveal`, `knot`).

Font sizes are fractions of the frame's height, the same on every screen (the picture is sharp at any size): the smallest words 0.05 — 18 px on a phone held sideways. Everything within the scene's middle 4:3 (x from (A − 4/3)/2 + 0.03). The showcase (`showcase.js`): the title of chapter I, the map of chapter I, the title of chapter III, the whole game.

The move from the old engine: `e.px` (the size of a screen pixel) is gone — the fonts do not grow on small screens (the frame is always landscape, 0.05 of the height reads), the hairlines — 0.001 of the height (`HAIR`). Before, the crack's edge reached the knot exactly at `reveal` 1; now — the bottom of the frame (the shader does not know where the knot is: the picture passes it no numbers), the knot lights up a little before the end, on maps — at the very end. The red glows are the picture's base, shining through the shader's `emission`: so they are cut by the crack's edge pixel for pixel, as `reveal` goes (the engine now hides `e.light` glows by the sky's shader too, but whole, not by the edge — the base is surer here).

## Engine 3 (v3, 2026-10-15)

- `"engine": 3`, shaders `crack.wgsl`, `knot.wgsl`. The game leads `reveal` (`b.set` over time) and offers the knot `knot#end`
  with petals (“Begin”, “Go on”, “Replay the chapter”…). The scene has no music.
- Step 2: the map's rows end higher (0.74), the knot — no lower than 0.78: above the band of speech.

## Contract for the check

```json
{
  "beats": {},
  "points": [],
  "offers": [
    "knot#end"
  ],
  "party": {
    "chapter_number": "",
    "chapter_title": "",
    "map": null,
    "reveal": 1,
    "knot": 1
  },
  "speakers": []
}
```
