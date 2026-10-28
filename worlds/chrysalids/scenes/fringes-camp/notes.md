THE FRINGES CAMP (The Chrysalids v3; VI), engine 3. Rewritten from the "film game" (engine 1, a picture: the people — one painted
element, camera walk): camera picture; the people — the cast: guard (a tall guard with a spear — he blows the horn), spider (the Spider:
very tall, long-armed), hunch (a hunchback), sitter (sits by the fire), woman, guard2 (a second guard), sophie (Sophie grown
up: a dark jacket, a madder headscarf — the scene's accent of colour), rosalind and petra (captives at the post). Dawn — the scene's light
(a light grey-blue morning) and the campfire: the particles of fire, sparks, smoke and the light `fire` (by the key fire). The pictures — once, in
day colours; the grass, the crowns, the pale plants — layers in the wind; the mist — layers with a drift.

KEYS (the game sets them; script.js turns them into what the people do):
 fire           how the campfire burns.
 people         how many Fringes people are at the fire: the guard always, the Spider from 0.2, the hunchback 0.4, the sitting one 0.6, the woman 0.7, the second guard 0.8
                (each comes a little after another out of the dusk beyond the fire, and goes back there; on opening — at once in place).
 alarm          alarm: the sitting one gets up, the guard raises the horn to his mouth and looks into the forest, the others turn to the forest.
 captives       Rosalind and Petra at the post (their hands behind their backs).
 sophie_present Sophie comes out of her hut to the edge of the light and looks at the fire; 0 — she goes away.
Places: the fire at 6.2 m, the people by the fire 5.7–7.7 m, the post with the captives 7 m, Sophie at the edge of the light 5.2 m, the camera 0.8 m nearer (camera_z in state); the Spider stands, his arms down — one sees how long they are (the speakers — no less than
a quarter of the frame). Opened (or restored) — it stands as the keys say: Sophie there at once or not.
The choices' points: sophie, fire, spider (in the "film" — the element people; the cast's people are no longer in one element — the choice "Stand with
them" and the Spider's lines — on spider). Lines: over sophie, spider, rosalind, petra.

## Contract for the check

```json
{
  "beats": {},
  "points": ["sophie", "fire", "spider", "rosalind", "petra", "post#rope"],
  "offers": ["sophie", "fire", "spider"],
  "party": { "fire": 0.8, "alarm": 0, "people": 0.8, "captives": 0, "sophie_present": 1 },
  "speakers": ["sophie", "spider", "rosalind", "petra"]
}
```
