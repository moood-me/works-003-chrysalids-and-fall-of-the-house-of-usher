PETRA AT THE RIVER (The Chrysalids v3; IV.1–2), engine 3. Rewritten from the "film game" (engine 1, the module chrysalids' puppets): the people —
the world's cast (david, petra, rosalind, the farmhands r0–r2 with rakes, the latecomers c0–c3). The downpour — particles (lighter and sparser than in
the "film"), the ripples and the current on the river — a shader (river.wgsl), the river — a mirror with ripples, a little transparent: a body under the water darker.
The light — an overcast day (ambient, a soft light from above). The pictures — once, in day colours; the grass, the reeds, the willow, the alders —
layers in the wind. The ground (relief.js, lib.ground): the near bank along its line at 9 m (the top on the left, the slope into the pool), the river's bed,
the far bank up to the field (20 m). In the water: Petra and David keep afloat — script.js sets the height of their feet above the bed (pt_e,
dv_e: the place's elevation), so the water is up to Petra's chin, to David's chest; pt_sink pulls Petra under. The rings round those
in the water — the planes wake_pt/wake_dv. What our own hear — ring layers: cry (by Petra's head, by cry), bond (by David,
warm, by bond), heard (by Rosalind, by heard and bond).

BEATS (lib.FILM; `from` — the whole state):
 pool        The pool: a wide shot, a slow push in on Petra; the branch bends; she is pulled under up to her chin, she struggles up; a breath —
             and a soundless cry, her head thrown back (cry 1).
 struck      The far field from below: Rosalind freezes among the farmhands (still), turns to the river; no one else hears.
 edge        The near bank: David runs in along the top and stops at the edge — sees her; looks at the water.
 run         Down the clay, into the water; the branch breaks — Petra is swept off by the current, under and up; he throws himself in and swims after her,
             catches her: she clings to his neck. (edge + run ≈ 22 s: "Calm her" — the game leads cry, the beats do not touch it,
             the camera moves; the leading sign — on petra, then on david.)
 field_quiet The cry quieted: Rosalind drops her rake and runs to the water alone; the farmhands do not raise their heads.
 field_loud  The cry to the end: her hands to her head, the rake falls; the farmhands stop raking and look, each at his own moment; she runs to
             the water, one of them goes down after her.
 out         He leads Petra by the hand out onto the bank; she sits down and only now cries; he on one knee, his hand on her shoulder; beyond the water
             Rosalind wades in.
 bank_quiet  A wide shot across the water: he and Rosalind hear each other (warm rings); only the rain.
 bank_loud   The same — and late, along the top of the far bank, the others come, one by one, and stand and stare.
 home        They look away; Rosalind comes out of the water; David lifts Petra in his arms (scoop → carry) and carries her up the bank;
             the fade. (The choice "Carry Petra home" — on david, before home.)

KEYS: beat, fade, rain, danger, branch, cry (the game), heard, bond, after, pt_sink, splash, ro_drop; the scene sets by itself: pt_e,
dv_e. The people — the engine's keys (<id>_a, _d, _do, _turn, _look, _reach, _with, _here, _on…). The "film" puppets' keys are gone (pt_x,
pt_held, dv_swim, dv_scoop, ro_hands, stare, follow, crowd…): these are now the people's actions in the beats. Points: petra, david,
rosalind, willow#tip (what Petra holds on to).
Motions: swim (a weak one — Kimodo cannot swim: standing, it strokes with its arms; the body under the water), cling, scoop, carry, rake (new).

CUTS: struck, edge, field_quiet, field_loud, bank_quiet, bank_loud begin with a cut (after empty, the camera — in their
from): the module beats makes their beginning ready ahead (the next in the table; field_loud and field_quiet open with the same —
the ready one serves both). field_* end with a cut back to the pool, said ahead, and out goes on from it (after) — the far
bank stays as field_* left it. edge and field_* do not write cry ("Calm her" leads it).

## Contract for the check

```json
{
  "beats": {
    "pool": { "after": [], "tells": [], "seconds": 10 },
    "struck": { "after": [], "tells": [], "seconds": 5 },
    "edge": { "after": [], "tells": [], "seconds": 7 },
    "run": { "after": ["edge"], "tells": [], "seconds": 15 },
    "field_quiet": { "after": [], "tells": [], "seconds": 6 },
    "field_loud": { "after": [], "tells": [], "seconds": 8 },
    "out": { "after": ["field_quiet", "field_loud"], "tells": ["out:bank"], "seconds": 16 },
    "bank_quiet": { "after": [], "tells": ["bank_quiet:across"], "seconds": 13 },
    "bank_loud": { "after": [], "tells": ["bank_loud:across"], "seconds": 13 },
    "home": { "after": ["bank_quiet", "bank_loud"], "tells": [], "seconds": 16 }
  },
  "points": ["petra", "david", "rosalind", "willow#tip"],
  "offers": ["david"],
  "party": { "beat": null, "cry": 0 },
  "speakers": ["petra", "david", "rosalind"]
}
```
