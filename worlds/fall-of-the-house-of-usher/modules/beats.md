# beats — a scene's film in beats: for the game and for the showcase

For scenes with `"engine": 3` (in the v1 world, on the old engine, it is the `film` module, lines by seconds; the key
`beat` and `beat:<name>` are the same). A beat is a director's sequence (`s`): people walk as long as they walk, keys
move, the camera films; time only where it truly is (a pause). Beats are described once (usually in the scene's
`lib.js`) and are played in two ways:

```js
// the scene's lib.js
const FILM = {
  arrive: { from: () => ({ ...DUSK }), run: async s => { await s.wait(3); … } },
  look: { after: 'arrive', from: () => ({ ...DUSK }), run: async s => { await s.move('camera_z', 0.8, { over: 3 }); } },
  walk_out: { from: () => ({ ...DAY }), run: async s => { await s.person('narrator').walk([[0.3, 70]]); … } },
};
// script.js — for the game
scene.kit.beats.play(scene, scene.lib.FILM);
// showcase.js — the showcase, outside games
return scene.kit.beats.showcase(scene, scene.lib.FILM, ['arrive', 'look', 'walk_out']);
```

- **The `beat` key.** The game sets a beat's name — it plays from the start (a beat that is running stops). When the
  beat has ended, the scene says `scene.tell('beat:<name>')`; for an unknown name — at once `beat-unknown:<name>`. The
  same beat once more — `null` first. A scene opened (or restored) with a name in `beat` plays that beat from the start.
- **`from`** — a function that gives the values the beat starts from: everything it does not set itself (light, people
  — where they stand and whether they are seen, the camera). A cut (`s.cut`): set at once, shown whole. Not set if the
  beat follows one of its `after` (that one is still running or ended last): then it carries on from what there is.
- **The game's cut is prepared ahead.** When a beat has begun, the module prepares (`scene.shot`) the start of the beat
  most likely to come next: the one the game named in the key `beat_next` (the module's own key; a game that knows its
  way sets it), else the next one in the film's table — if it begins with a cut. The cut to it comes at once and whole;
  to another beat, or with other values — an ordinary one.
- **The showcase** (`showcase`) — the beats in order; the cut to the next is prepared ahead (`scene.shot`) as soon as
  the one before has begun, and is shown whole at its moment. A jump along the showcase's timeline lands on the start
  of a beat.
- A beat ends on a living pose: after it the values hold, people breathe.
