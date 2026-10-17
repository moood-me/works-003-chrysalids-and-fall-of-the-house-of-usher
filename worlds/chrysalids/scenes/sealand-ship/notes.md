THE SHIP FROM SEALAND (The Chrysalids v3; VII), engine 3. Rewritten from the "film game" (engine 1, the module chrysalids' puppets): the people
— the cast (david — david_teen, rosalind, petra, michael on the ledge; joseph, w1–w3 — Waknuk men with guns, spider, sophie,
f2, f3 — the Fringes with bows; sealand — the Sealand woman with a sprayer); Joseph's horse — the module chrysalids. Dawn in the smoke —
the scene's light (the base light, the look dawn, a low sun on the left). The ship — a pearly fish (the element ship: a picture once,
the shader ship.wgsl turns the spiral by spin, the threads under it by fall, beads on the threads; layers of the legs, the door, the ramp); its gleam far off
and the door's light — the scene's light. The web: on the clearing — the plane webfield (the shader: the far side first), in the air — the particles
gossamer (a sprite — a thread with a bead), on the people — cocoons (the elements cocoon_<id>: standing or lying), on the children by the cave — cave_web.
Each one on the clearing freezes at his own threshold (<id>_th, lib.TH; script.js: before that — a jerk, flinch, then still); the sprayer
raises the threshold above 1.5 — the web lets go. The shots — particles (a flash and a puff of smoke at w<i>#muzzle by w<i>_fire). The ground
(relief.js): the ledge by the cave a metre above the clearing, a slope down on the right.

The directing: Joseph's death — one action a shot (a wide shot: the Spider's shot, the arrow, Joseph falls — collapse — and lies there);
David's reaction — a cut of its own (the children); in web_* — a cut from above (OVER_THEM): who is under whom is seen; the woman leads Petra
without looking back, David looks back at the clearing.

BEATS (lib.FILM; `from` — the whole state): cave, fight (the choice "run to Father" — on david), hold | run, ship (the choice "whom
to cover" — on rosalind, petra or joseph), noship (if there is no ship), web | web_petra | web_rosalind (David on the ledge) |
web_father | web_alone (David by his father), landing | landing_run, free | free_run, back | back_run (the choice "fly away or stay" —
on ship and michael), board | stay_ros | stay_alone → stay_alone_away. free and free_run — always a cut (after empty): they stand in the table
right after their landing — the module beats makes their beginning ready ahead; board the game opens with a step of its own (from the ramp). After the web
joseph_th is the game's key (web_father or the play): the beats' from after it do not write it. The cuts inside beats are said ahead (lib.ahead). The "film"'s beat stay_alone (32 s) is split at its cut:
stay_alone — David goes up to Michael, Rosalind goes in after Petra, turns round out of the light and is gone; stay_alone_away —
the ship goes, they on the ledge watch it go.

KEYS: beat, fade, dawn, smoke, fight, fall, web, cave_web, spin, door, dust, ship_vis, ship_a/d/h, arrow_vis, arrow_a/d/h,
horse_a/d/face/toss, <id>_th, <id>_down, w<i>_fire. The "film" puppets' keys are gone (<id>_p, _w_*, _hr/_hl, _hide, _dead…): these are
now the people's actions and the engine's keys. New motions/parts of the cast: aim_rifle, kneel_aim (the gun — the part gun), sprayer.

## Contract for the check

```json
{
  "beats": {
    "cave": { "after": [], "tells": [], "seconds": 5 },
    "fight": { "after": ["cave"], "tells": ["fight:clearing"], "seconds": 14 },
    "hold": { "after": ["fight"], "tells": [], "seconds": 9 },
    "run": { "after": ["fight"], "tells": ["run:by"], "seconds": 12 },
    "ship": { "after": ["hold", "run"], "tells": ["ship:petra"], "seconds": 14 },
    "noship": { "after": ["hold", "run"], "tells": ["noship:sky", "noship:flee"], "seconds": 18 },
    "web": { "after": ["ship"], "tells": [], "seconds": 9 },
    "web_petra": { "after": ["ship"], "tells": [], "seconds": 9 },
    "web_rosalind": { "after": ["ship"], "tells": [], "seconds": 9 },
    "web_father": { "after": ["ship"], "tells": [], "seconds": 9 },
    "web_alone": { "after": ["ship"], "tells": [], "seconds": 9 },
    "landing": { "after": ["web", "web_petra", "web_rosalind"], "tells": ["landing:down"], "seconds": 13 },
    "landing_run": { "after": ["web_father", "web_alone"], "tells": ["landing_run:down"], "seconds": 13 },
    "free": { "after": [], "tells": ["free:petra"], "seconds": 12 },
    "free_run": { "after": [], "tells": ["free_run:petra"], "seconds": 11 },
    "back": { "after": ["free"], "tells": ["back:father"], "seconds": 22 },
    "back_run": { "after": ["free_run"], "tells": ["back_run:free"], "seconds": 21 },
    "board": { "after": [], "tells": ["board:look", "board:michael"], "seconds": 28 },
    "stay_ros": { "after": ["back", "back_run"], "tells": [], "seconds": 28 },
    "stay_alone": { "after": ["back", "back_run"], "tells": ["stay_alone:turn"], "seconds": 14 },
    "stay_alone_away": { "after": ["stay_alone"], "tells": [], "seconds": 18 }
  },
  "points": ["david", "rosalind", "petra", "joseph", "ship", "michael", "sealand", "ship#door"],
  "offers": ["david", "rosalind", "petra", "joseph", "ship", "michael"],
  "party": { "beat": null, "joseph_th": 0 },
  "speakers": ["david", "rosalind", "petra", "michael", "joseph", "sealand", "spider"]
}
```
