THE STRORMS' KITCHEN (The Chrysalids v3; II.2, II.5, V.1), engine 3. Rewritten from the "film game" (engine 1): the pictures — once, in
day colours (a lime-washed wall, a plank floor and dado, the dark wood of the furniture); the light — the scene's: the lamp on the table (`lamp`,
the light of its point lamp#flame, `on` — the key lamp), the hearth fire (`hearth`, the particles fire and embers, a light by the key hearth), the door
to the yard off the frame on the left (`yard`, by yard_door), the window's cold light (`window_light`); the evening — the light's look `dusk` and
the night sky beyond the window (sky.animate). The lamp's shadows — the engine's: the father, getting up, throws a shadow on the wall and the ceiling; the tabletop
(a plane) shades the knees of those sitting. The film — the module beats (lib.js FILM), the cuts inside the beats — said ahead
(s.shot). The people — the world's cast: joseph, emily, mary, farmhand, david (V.1 — the look david_teen through david_wear).

After the book (ch. 3): David cut his hand open, wrapped it up anyhow by himself, his mother scolded him and bound it; he let slip that he could have managed
by himself "if I had another hand". His father took it for blasphemy, the family prayed for forgiveness, the boy was sent upstairs.

BEATS (lib.FILM; `from` — the whole state: the scene can be opened at any of them):
 evening   Out of the dark. The father at the head of the table reads, the mother, her back to us, stirs the pot, Mary and the farmhand at the table. The door
           from the yard opens (a cold light), Mary looks round, the farmhand stops eating; David comes in, hunched, his hand in a rag at
           his chest, goes along the table to the hearth; the father does not raise his eyes. A cut: nearer, by the hearth; he pulls the knot with his teeth; the mother
           looks round. (The game's choice — on david.)
 help      (the canon) He holds out his hand; the mother goes round the chair, shakes her head, binds it — the rag becomes a bandage.
 self      ("I can do it") He turns his shoulder away and pulls the knot with his teeth; the mother takes his hand all the same; it is tight — he flinches.
 slip      The slip of the tongue: a pale third hand (wish) grows out of his side to the knot; the mother — at him, at the father. A cut: a wide shot; everyone
           looks, the father raises his head; the hand melts; the mother steps back. (The choice — on david.)
 kneel     The father gets up (a shadow on the wall and the ceiling), points at the floor; David on his knees before him; the camera closes in; the sampler "Honour
           the Image" (wall#sampler); hands behind the back; the father reads over him, the family prays. (The choice — on david.)
 seek      (the canon) He looks for his mother with his eyes — she does not raise her head; the father's hand on his head bows it down.
 bow       He looks at the floor; the mother raises her eyes to him — he does not see.
 upstairs  A wide shot. The father points to the stair door; David gets up and goes; on the threshold he looks back at his mother — she goes off to
           the pot; upstairs, the door closes; the father sits down to the Book; a slow push in on the empty chair and the cold bowl.
 lie       ("Nothing, Father") He hides his hand behind his back, looks at the floor. A cut: the father close, he shuts the Book, moves his eyes to the mother.
 lie_mother A cut: the mother by the hearth; she raises her eyes to the father — and lowers them.
 lie_up    A wide shot. The father does not take his eyes off her; the boy goes upstairs round the table; on the threshold he looks back; the door closes;
           only then the mother goes to the pot, the father — to the Book.
 night     Out of the dark. Night at the table (Mary and the farmhand gone, the lamp lower): David in Mary's place holds the table's edge, the mother
           sews at the hearth end. The game ("Not a stir") moves david_grip, david_stir, father_look — script.js turns
           them into what the people do; the mark — on david#hand_r (the hands on the table's edge).
 night_after (after night) The reading is over: the camera draws back — the mother is seen.
 late      The same years later (david_teen, the lamp 0.6); a slow push in — the father reads longer than usual.
 asks      (after late) The father raises his head and looks at David; he lets go of the table's edge; the camera draws back.
 to_bed    (after night / night_after / late / asks) The father shuts the Book; David gets up, goes to the stair door; the mother
           raises her eyes to him; he goes upstairs; the father reads on.
 sneak     (after to_bed) Deep in the night: the lamp out, the hearth smouldering; David comes down and tiptoes out into the yard.
           The fade. Without the lamp the people are seen in the light of the window and the smouldering hearth.

KEYS: beat; lamp, dusk, hearth, fade, steam, yard_door, stair_door, wish; night at the table (the game's keys): at_table, david_grip,
david_stir, father_look. The "film"'s moon_light is gone (the window's light is now the scene's source, the night — the look dusk).

THE MAKING: lib.js — the places (SEAT, POT, BY_HEARTH, TO_TIE, KNOT, STANDS, KNEEL, AT_DOOR, LATCH, UP, CAM — the camera's shots),
the states the beats begin in (START, AT_HEARTH, TIED, HEARD, KNELT, LIED, NIGHT, LATE), FILM. relief.js — the steps beyond the stair
door. wall.js — the wall with the window, the doorway, the dresser, the samplers and the hearth; stairdoor — the door's leaf (animate narrows it
by stair_door); wish — the third hand: layers that animate lays each frame between david#chest and david#hand_r.

## Contract for the check

```json
{
  "beats": {
    "evening": { "after": [], "tells": ["evening:in"], "seconds": 18 },
    "help": { "after": ["evening"], "tells": ["help:tie"], "seconds": 8 },
    "self": { "after": ["evening"], "tells": ["self:take"], "seconds": 8 },
    "slip": { "after": ["help", "self"], "tells": [], "seconds": 9 },
    "kneel": { "after": ["slip"], "tells": ["kneel:image", "kneel:pray"], "seconds": 22 },
    "seek": { "after": ["kneel"], "tells": [], "seconds": 9 },
    "bow": { "after": ["kneel"], "tells": [], "seconds": 8 },
    "upstairs": { "after": ["seek", "bow"], "tells": ["upstairs:bowl"], "seconds": 28 },
    "lie": { "after": ["slip"], "tells": [], "seconds": 4 },
    "lie_mother": { "after": [], "tells": [], "seconds": 4 },
    "lie_up": { "after": [], "tells": ["lie_up:alone"], "seconds": 22 },
    "night": { "after": [], "tells": [], "seconds": 3 },
    "night_after": { "after": ["night"], "tells": [], "seconds": 4 },
    "late": { "after": [], "tells": [], "seconds": 14 },
    "asks": { "after": ["late"], "tells": [], "seconds": 3 },
    "to_bed": { "after": ["night", "night_after", "late", "asks"], "tells": ["to_bed:up"], "seconds": 14 },
    "sneak": { "after": ["to_bed"], "tells": [], "seconds": 15 }
  },
  "points": ["david", "david#hand_r", "joseph", "emily", "mary", "wall#sampler", "tabletop#bowl"],
  "offers": ["david"],
  "party": { "beat": null, "at_table": false, "david_grip": 1, "david_stir": 0, "father_look": 0 },
  "speakers": ["david", "joseph", "emily", "mary"]
}
```
