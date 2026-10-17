THE MEETING-HOUSE (The Chrysalids v3; V.3 — the trial), engine 3. Rewritten from the "film game" (engine 1, the people were the engine's already): the pictures —
once, in day colours (the boards, the dais, the table, the chair, the benches); the light — the scene's: the lamp on the table (`lamp`, of lamp#flame,
on: lamp; on spill it goes out in lamp.animate.js — e.glow), the burning oil on the floor (`fire`, on: spill — a light from below,
the particles fire and smoke), the barn beyond the windows (`barn` — through the windows and the door, `barn_glow` — in the yard; particles of fire, sparks, smoke
over the barn; the glare — a layer of the sky), the moon outside faint. The lamp — a layer, it falls off the table (spill); the door — a layer of the wall,
narrowing as it opens inwards (door).

What is where (across, distance m): the back wall 7.5 (the windows and the door cut out evenodd, beyond them the yard with the barn yard at 30 m and the sky
sky; the door 2.0…3.0 right of the dais); the dais 0.35 m (dais, dais_front) from 5.0 to 7.4 — it is also the people's ground (relief.js by
lib.DAIS); the elders' table (table, tabletop) at 5.2…6.0; the lamp −0.75/5.3 on the table; the chair 0.1/6.48; benches along the walls;
the posts posts at 3 m — at the edges of a wide screen. The people — the cast: the inspector in the chair facing us, his hands on the table; the father
−1.75/4.3; David 0.55/3.5 with his back to us (V — david_teen); six men of the community (`man_0`…`man_5`) come in one by one.

KEYS (the game sets them; script.js turns them into what the people do): lamp, spill, men 0…6, rush, inspector_present,
inspector_up, father_present, father_away (it was the "film"'s father_turn — that is the person's own key, which way he faces:
renamed), david_present (0 — he has run off), fire_outside, door. Where David looks — his own key david_look
(a point: 'inspector', 'father'; in the "film" it was 0/1 — a person's key too). By itself: lamp_smoke — the lamp blown out, a thin thread of smoke over the wick for a few seconds. Points: lamp#flame (the choice "blow it out / knock it over"),
david (the choice of the answer), inspector, father (their lines). All — in the middle of 4:3: lamp#flame ≈ (0.42, 0.53), david ≈ (0.59, 0.47).
A small regression: no thin wisp of smoke from the blown-out lamp.

## Contract for the check

```json
{
  "beats": {},
  "points": ["lamp#flame", "lamp", "david", "inspector", "father"],
  "offers": ["david", "lamp#flame"],
  "party": { "lamp": 1, "spill": 0, "men": 1, "rush": 0, "inspector_present": true, "inspector_up": 0, "father_present": true,
             "father_away": 0, "david_present": 1, "david_look": "inspector", "fire_outside": 0, "door": 0 },
  "speakers": ["inspector", "father", "david"]
}
```
