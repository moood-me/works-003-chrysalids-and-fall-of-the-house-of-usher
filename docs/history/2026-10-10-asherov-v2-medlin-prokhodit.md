# 2026-10-10 — «Падение дома Ашеров» v2: «Мэдлин проходит» on engine 2

World `moood-me/pavel--padenie-doma-asherov-v2`, branch `medlin-prokhodit` (scene `scenes/medlin-prokhodit`). Modules
(cast, beats, closeups) were ported by another agent. Renders only through prod's MCP (`look_at_branch`, `on: "gpu"`).

## Old → new

- **The gallery.** v1 drew the gallery as a sky in one-point perspective that reprojected itself from `camera_x/z`:
  `lib.view` with clip, `onPlane`, a fog colour per distance. Every camera move repainted everything, and the jamb
  cards repainted the left wall onto their planes. Now every surface stands where it is, in metres. The floor is a
  plane (stone flags, a faint `reflect`: the windows and the candle show in it). The ceiling is a plane with `tilt` 180.
  The left wall is a card facing 90 with the two doorways cut out; the right wall is a card facing 270 with the 16
  pointed windows cut out, and the glowing glass is a card 3 cm outside it. The 17 arches are cards with the opening cut
  out, and their 1 m soffit is cards too: the piers' inner faces, plus 4 strips per side of the arc, each a card
  `facing` ±90 with `tilt` = the segment's lean, anchored at its lower end. The dark rooms behind the doorways are
  planes and cards. Whoever goes into a doorway is hidden by the wall pixel by pixel; the jamb cards are gone.
- **Window light.** The v1 painted shaft volumes, floor patches and motes (reading `e.t`) became two far lights
  `through` 16 pane polygons, plus `shafts` in the haze and a `dust` particle emitter. The engine takes at most 8 points
  per pane (`LIGHTS.PANE_POINTS`), so the panes have 7 (`windowOf(k, 2)`), not v1's 9. Polygons are
  [across, distance, elevation] (v1's were [across, elevation, distance]).
- **The crack** is its own card, painted whole twice (thin and wide layers). Its shader shows it up to the height
  `crack` has reached and mixes the widths; the animate sets the uniforms. A game moving `crack` repaints nothing.
- **The candle**: a card facing the eye, its flame a layer swayed by `animate` (noise), its light `of: "sconce#flame"`.
- **Film → beats.** v1's second-rows (`film`) became director sequences (lib.js `FILM`, module `beats`). People walk at
  their gait's pace (v1 gave speeds). Moments are triggered by what happens (`until` she is out of the doorway, a
  walk's end, `ending`), not by seconds. The fades that hid cuts are gone (shots made ready with `s.shot`); only the
  opening fades (`pass`, `doctor`) and the chapter's end (`leave_with`) stay. Off-stage people use `_here: false`
  instead of standing behind the eye. The freeze mid-step: a walk on, `still(true)` once she passes the half step,
  then the walk cancelled. The close-up is an insert over the scene (the camera no longer moves to a card): its
  picture is `lib.closeup` (painted once per shot), its life is `lib.closeupNow` (the head's turn as `to`).
- Keys, element ids and beats the game uses are unchanged (`beat`, `speak`, `crack`, `madeline`/`roderick`/`doctor`,
  the 12 beat names). `doctor_present` and `madeline`, which the game sets on opening, are declared (they were unknown
  keys in v1).

## Notes

- Light is linear: ambient 0.2 rendered near-black; the mood of v1 came back with ambient 0.9, a greyer look (saturation 0.75, haze toward #2c383e) and the stone in daylight greys.
- The `walk` gait goes 1.6 m/s on the narrator. A key path moving him slower draws a warning; the hidden narrator in
  `gone` is now placed by the cut instead of moved.
- Found on the way: in a lit scene a silhouette style (usher, from `shadow`) was pure ink — the lit branch of
  `people/shading.js` gave it no light; fixed in the engine (`engine2-silhouette-lit`). The closeups insert rendered
  black — NaN in the module's `live()` (no `e.aspect` in animate), fixed in the module.
- The stone is painted in daylight greys (`#7f898e`); painted dark as v1's final colours, the lit scene came out far
  darker than v1.
- «The ground ends 82 m away» is a false positive: the end wall stands on the floor's edge.
- The scene's objects and elements/ are generated from lib.js geometry by `tools/medlin-prokhodit-gen.js` in the world repo (`node tools/medlin-prokhodit-gen.js` from its root); scene.json is not edited by hand.
