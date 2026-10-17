FLIGHT (The Chrysalids v3; V.4), engine 3. Rewritten from the "film game" (engine 1, the module chrysalids' puppets, camera panorama):
camera picture (the director's shots — moves of camera_x/z); the people — the cast (rosalind in the great-horse's saddle, petra, david — the look
david_teen, searcher — the look rider, searcher2 — man_b, with lanterns); the horses — engine 3's module chrysalids (great — the great-horse with
the panniers, pack — the pack-horse, sheba — Sheba, horse1/horse2 — the riders' horses). Night to dawn — the scene's light (the base — a light blue
night, the looks dawn and mist), the sky's layers; the search party's lanterns — glows on the far ridge (pursuers), the riders' lanterns — a light by their
hands, the lantern's spot on the hollow's fog — the light lamp_spot (by lamp_x, lamp). Fog — layers with a drift (fog — in the hollow, mist —
in the low ground). The ground (relief.js, lib.ground): the road along the crest at 9 m, beyond the ridge's shoulder (x > 2.2) — down into the hollow (1.75 m
below the crest), farther on right down. The card shoulder (8.85 m): the crest, and beyond the shoulder — an edge running along the hollow's floor 0.45 m
above the road (the horses and riders seen whole, without the hooves); beyond the hollow's end (x > 12.5) the edge stands, and what has gone down hides behind
it. The fog fog (9.15 m) lies on the hollow's floor behind the horses: they are seen whole on it. The card hill (9.2 m) — beyond the road and
beyond the pack-horse (9.1). The horses in the hollow (HOLLOW 9.3) — their heads in the middle of 4:3, where the language of mini-games puts
the marks of "Quiet, horses". The forest (forest, 48 m) — a low edge of treetops, its foot under the ground.

Who sits where: Rosalind — in the great-horse's saddle (great#seat; her feet and hands — its tack, script.js keeps them as it turns),
Petra — in the near pannier (great#basket_r; petra_peek — how far she peeks out), David — in the far one (great#basket_l) after
climb; at the start David in Sheba's saddle, Petra before him (a point in Sheba's frame: chrysalids.horse.spot).

BEATS (lib.FILM; `from` — the whole state):
 arrive       The fade opens; on the crest the great-horse, Rosalind in the saddle looking at the road; from below at a trot Sheba with
              David and Petra, stops by the great-horse; the camera closes in.
 arrive_alone (the game) Petra already in the pannier; David has ridden up on Sheba alone; Petra rises to meet him; he slips down.
 handover     David gets down (dismount), lifts Petra (lift_into), Rosalind takes her into the pannier; Petra peeks out.
 sheba_turn   He turns Sheba towards home and lays his hand on her neck (the game's choice — on david: let her go or take her).
 sheba_go     A swing, a slap on the rump; Sheba goes off alone; he watches her go, turns away (turn_away).
 sheba_keep   (the game) He leads Sheba back and ties her rein to the pack-horse (sheba_led: on the rope to the scene's end); comes back.
 climb        Rosalind pulls him by the hand, he climbs (mount) into the far pannier.
 bow          Rosalind forward, then back to the lanterns, takes her bow and draws it (draw_bow) — in profile on the light sky;
              David looks round; Petra hides.
 go           The horses move off, over the ridge's shoulder down, into the hollow's fog and away, at a trot; the camera follows right and comes back to
              the empty crest.
 search       (the canon: the end) Two riders with lanterns come up onto the empty crest, the first raises his lantern, peers.
 hollow       (the game) Over the shoulder into the hollow and a stop in the fog; the camera draws back — the hollow and the crest above it.
 watch        (the game) Two riders come up onto the crest, the first shines into the fog. The camera stands: "Quiet, horses" — the marks
              great#head, pack#head, sheba#head (if taken), petra (if free); the game moves great_toss, pack_toss,
              sheba_toss, petra_peek, lamp, lamp_x, search_point.
 spotted      Seen: the first points into the hollow, the second gallops off for the others, the first — to the edge of the hollow.
 stay         Not seen: the second rides off for the others, the first watches the road, the lantern lower.
 kill         Rosalind shoots: an arrow (arrow) into the first; he falls forward out of the saddle, onto the near slope of the crest (collapse), and lies there (lie_back) — he is seen; the horse
              goes off over the crest. (The choice "Shoot…" — on searcher.)
 warn         An arrow over his head; the horse rears (h1_toss); the rider turns it and gallops off.
 hide         The fog thickens, Petra hides; the rider rides along the edge, shines into the fog right above them, rides away.
 away         (after kill | warn | hide) On, down out of the hollow; it grows light.

KEYS: beat, fade, dawn, mist, fog, pursuers; the horses — great_*, pack_*, sheba_* (_a, _d, _face, _toss), h1_*, h2_* (+ _here),
sheba_here, sheba_led; the game — great_toss, pack_toss, sheba_toss, petra_peek, lamp, lamp_x, search_point; arrow, arrow_high.
The "film" puppets' keys are gone (gx, david_down, david_climb, ros_bow, fallen…): these are now the people's actions and the horses' places.

## Contract for the check

```json
{
  "beats": {
    "arrive": { "after": [], "tells": [], "seconds": 12 },
    "arrive_alone": { "after": [], "tells": [], "seconds": 13 },
    "handover": { "after": ["arrive"], "tells": [], "seconds": 9 },
    "sheba_turn": { "after": ["handover", "arrive_alone"], "tells": [], "seconds": 4 },
    "sheba_go": { "after": ["sheba_turn"], "tells": ["sheba_go:gone"], "seconds": 8 },
    "sheba_keep": { "after": ["sheba_turn"], "tells": [], "seconds": 16 },
    "climb": { "after": ["sheba_go", "sheba_keep"], "tells": [], "seconds": 7 },
    "bow": { "after": ["climb"], "tells": [], "seconds": 7 },
    "go": { "after": ["bow"], "tells": [], "seconds": 20, "show": false },
    "search": { "after": ["go"], "tells": [], "seconds": 14, "show": false },
    "hollow": { "after": ["bow"], "tells": ["hollow:fog"], "seconds": 11 },
    "watch": { "after": ["hollow"], "tells": ["watch:riders"], "seconds": 13 },
    "spotted": { "after": ["watch"], "tells": [], "seconds": 6 },
    "stay": { "after": ["watch"], "tells": [], "seconds": 9 },
    "kill": { "after": ["spotted", "stay"], "tells": ["kill:shot"], "seconds": 7 },
    "warn": { "after": ["spotted", "stay"], "tells": ["warn:shot"], "seconds": 7 },
    "hide": { "after": ["spotted", "stay"], "tells": [], "seconds": 16 },
    "away": { "after": ["kill", "warn", "hide"], "tells": [], "seconds": 12 }
  },
  "points": ["great#head", "pack#head", "sheba#head", "petra", "david", "searcher", "rosalind"],
  "offers": ["david", "searcher"],
  "party": { "beat": null, "great_toss": 0, "pack_toss": 0, "sheba_toss": 0, "petra_peek": 0, "lamp": 0, "lamp_x": 6, "search_point": 0 },
  "speakers": ["david", "rosalind", "petra", "searcher"]
}
```
