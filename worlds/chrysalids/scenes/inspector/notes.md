THE INSPECTOR AT THE FARM (The Chrysalids v3; II.3), engine 3. Rewritten from the "film game" (engine 1): the pictures — once, in day
colours; the light — the scene's (an overcast day, the looks rain and season); the people — the cast (david peeps out from behind the far corner of the barn,
farmhand holds the calf by the halter, inspector with a book on his left arm, joseph with his arms folded; in the yard — in hats);
the inspector's horse — the module chrysalids (tied at the last post, breathing, swishing its tail). The calf — painted once
(the one accent of colour — a reddish brown; its legs noticeably a little too long, knobbly — the "not right" seen by the eye), its legs, head and
tail — layers: it steps when the farmhand leads it, nods, swishes its tail; its place — beside the farmhand (calf_a, the scene sets it
itself). The rope — a layer between calf#ring and the farmhand's hand. The rain — particles; the autumn leaves — particles.

KEYS (the game sets them; script.js turns them into what the people do): verdict (0.3 — the inspector points to the corner of the barn, 0.55 —
the farmhand leads the calf to the barn, 1 — the inspector looks at the farmhand), calf_present (0 — David has led the calf behind the barn: the calf goes off left, to the barn's corner, and is gone; the farmhand
lets go of the rope and looks at the barn's corner — he saw; the inspector leafs through his book), david_present, cart, rain, season; inspector_look —
the person's own key (where he looks: a point): "Find it before he does" sets it in the order of lib.LOOK — the book (inspector#hand_l),
the barn's corner, the pen, the horse, the calf's head, back, tail, legs. Points: calf#head, calf#back, calf#tail, calf#legs, calf#ring, barn#corner; the choices — on calf and joseph (as in the "film").

## Contract for the check

```json
{
  "beats": {},
  "points": ["calf#head", "calf#back", "calf#tail", "calf#legs", "calf", "joseph", "david", "inspector", "farmhand", "barn#corner"],
  "offers": ["calf", "joseph"],
  "party": { "cart": 0.5, "rain": 0, "season": 0, "verdict": 0, "calf_present": 1, "david_present": 1, "inspector_look": "inspector#hand_l" },
  "speakers": ["joseph", "inspector", "david", "farmhand"]
}
```
