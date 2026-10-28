# 2026-10-10 — «Падение дома Ашеров» v2: «Склеп» on engine 2

World `moood-me/pavel--padenie-doma-asherov-v2`, branch `asherov-v2-sklep` (from env/dev, merged by `merge_branch`),
folder `scenes/sklep` (as in v1). The world's modules — `cast`, `beats` (in place of v1's `film`), `closeups` (inserts)
— came from the module owner's port. No engine changes here. Renders were made only on prod's GPU (`look_at_branch`
`on: "gpu"`).

## Old → new

- **The torch's light.** v1's elements painted torch pools and warm edges themselves, each reading where the flame was
  (`lib.torch` → `e.where("narrator#flame")`). That repainted 20-odd elements every frame. Now everything is painted
  once, in daylight colours, and the scene is lit: `light.ambient` (cold), `bounce`, `haze` + `hazeGlow`. There are two
  lights: `holder` (`of: "torch"`, the e.light of the torch element while it stands in its holder) and `fire` (`at:
  "narrator#flame"`, the cast's torch part). Both are `on: torch`, the key the door cuts off. Shadows come from the
  engine: people, the coffin's walls, the lid, the plinth, the iron door.
- **Fire.** v1 painted the flame shapes with `e.t`. Now `particles` `fire` at `narrator#flame` and at `torch#flame`
  (`amount: torch`; no point means no fire, which is how the torch moves from the holder to the hand), plus a few
  `embers`.
- **Mist.** v1 moved its ellipses by `e.t`. Now there are two layers per mist card, each `drift`ing its own way along
  the box, painted so the ends meet (`lib.mist`). The doorway's breath is a layer whose alpha follows `door_turn`.
- **Close shots.** v1 used cards 1.6–2 m before a held camera, cut through black (`fade`). Now they are inserts,
  opened by a key at a cut, with no fades. The module's `closeup` uses `shot` = face | mirror | hands | lid; the gown
  under the hands goes in `shot.under`. Screw points are `closeup#screw1…4`: the game's «Винты» must call `b.where`
  with them (v1 had empty cards named `screw1…4`). The scene's own two inserts are painted once, and their motion lives
  in their GLSL plus animate:
  - `inside`: the hairline (layer) dimmed by the flame's tremble and by the two men's shapes (uniforms from `shade`).
    The screws' points are one layer painted fully through; the shader slides each out of the wood as far as `tip`
    has brought it, so the threads travel as a screw's do. Splinters fade in; the grit is procedural.
  - `outside`: the room, the leaf (shaken by `knock`/`answer`) and the flame (stretched and leaned) are layers. Dust
    and the closing dark are computed in the shader. The glows are dimmed through `e.glow`.
- **The film.** v1's `film` rows became `beats` (`lib.FILM`, `from` / `after` / `run`). People act at their own pace
  and the beats await them. Close-up cuts are prepared with `s.shot` and cut whole. `fade` is kept only as art: the
  chapter opening, `check` to black, her eyes, another night. The `vault` beat (the old film's first shot) and `knock`
  are the showcase's own. The showcase is ≈ 110 s and shows every lid branch.
- **Pace, not seconds.** The coffin carry (the coffin's place and turn, both bearers' places: `lib.IN`) and the door
  pull (the door's turn, the narrator's place: `lib.PULL`) are each one linear `s.path`, over the time the slower walker
  needs at his gait's pace (`CARRY_T`, `PULL_T`; the paces are the cast's gaits on these people, as the engine
  measures them: `lib.PACE`). The lid slide goes at the `lean_step_r/l` pace. A first version moved them by keys 0→1
  that a script followed, because `scene.path` then measured its way in key space (the coffin's 88° turn outweighed
  its 5 m, and the bearers went off their gaits); after the engine's fix (e41bfb5: a path is measured in metres, angles
  follow along) that was dropped.

## Found on the way (others fixed them)

- Inserts' named points did not reach the page (`thread.js` pointTable skipped inserts). The coordinator fixed this in
  the engine.
- The module closeups first painted nothing but its dark (its `live()` read `e.aspect`, which an animate has not). Reported
  with a repro; the module owner fixed it.
- GLSL: `out` is a keyword. A shader that does not compile leaves its insert undrawn, and the frame shows what is under
  it.
- The engine's people (fixed in e41bfb5): while the coffin was carried, Madeline's gown hung straight down through its
  floor to the ground.

Scene: https://moood.compl.dev/~pavel/worlds/padenie-doma-asherov-v2/scenes/283 (world commit 469e531).
