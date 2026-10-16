THE BURNING OF THE FIELD (The Chrysalids v3; II.4), engine 3. Rewritten from the "film game" (engine 1, the module chrysalids' puppets): the people —
the world's cast (jo — Joseph Strorm with a torch, in — the inspector with a lantern, em — Emily, dv — David, p0…p9 — the community, ten
different looks: man_a, woman_a, old_man, woman_b, farmhand, old_woman, girl, man_b, woman_c, boy). The pictures — once, in
day colours; the night, the dawn and the grey morning — the scene's light (the base — a light night, the looks dawn and morning) and the sky's layers
(sky.animate). The fire: the flame over the burning edge — the shader of each row of wheat (wheat*.wgsl, one text: the stalks blacken,
over the front — tongues of light, behind it — the stubble of the layer stubble), the burnt ground — the plane ash with its own shader (ash where
the fire has passed, smouldering sparks), particles of fire on the two fronts (flames_r/flames_l by front_r/front_l), sparks and smoke over the field,
the fire's light — fire_r/fire_l (by fire_light), the torch — particles and a light at jo#flame (jo_torch: a flare 1.5). The ear — the element ear
(in the inspector's hand, then flying in an arc by in_toss); the stalk left standing — the element stalk (the point stalk#ear).

BEATS (lib.FILM; `from` — the whole state):
 dawn       Out of the dark, the blue before daybreak; the inspector with a lantern to the edge of the field, down on one knee, he plucks an ear.
 ear        He carries the ear to Strorm (the camera moves in), to the lantern — the ear turns golden; the people raise their heads; two slow nods
            from Strorm — an Offence; the inspector flings the ear over his shoulder into the field (the motion throw_back), it flies in an arc.
 raise      Strorm raises the unlit torch to the sky; everyone down on their knees and praying, each at his own moment; David stands (the game's choice
            knees — on dv).
 rise       (knelt in time) David on his knees with everyone; the prayer; they get up together.
 kneel_late (the canon) One standing among the kneeling; the camera to him; his mother pulls his hand; he goes down last and gets up
            last.
 light      Strorm lights the torch from the inspector's lantern (the camera nearer) — a flare.
 fire       To the field, the torch up, down — fire; he leads the fire along the edge to the road.
 hymn       He steps back, turns to the people, the torch high; the hymn (sing_stand, raggedly; everyone looks at the torch); those in front
            step back from the heat, a woman shades her eyes (shade); David and his mother facing us, heads raised — singing; the camera to
            them — and it stands (hymn:still): "Sing with everyone" (the game: turned; the marks — dv, the beat's sign — on jo). The fire goes on (ignite to 0.75
            over 36 s — and after the beat's end).
 hymn_loud  David sings; his mother looks at him; his father's look passes over (the game brings those in front back to the fire: turned → 0).
 hymn_hide  (the canon) Those in front have turned round (the game turned them: turned); the father's look on his side; David goes still (still),
            lets go of his mother's hand, buries his face in her skirt; the look moves on (the heads to the fire — when the game lowers turned).
            The beats do not write turned.
 burn       The camera draws back; the field burns out; the fade.
 morning    A grey morning: ash, a little smoke. The people go off; the inspector goes away across the burnt ground; the mother leads David along the road; at the edge of
            the burnt ground he turns to the stalk left standing (the camera close; the choice stalk — on dv).
 stalk_stay (the canon) He reaches for the stalk; his mother looks back and pulls; they go. The inspector is gone (in_here).
 stalk_go   He turns away from the stalk and goes with his mother.

The community stands in two wings facing the edge of the field (where Strorm lights and sings), side-on to us.

KEYS: beat, fade, dawn, morning, fire, ignite, ash, smoke, jo_torch, dv_kneel (the game: David on his knees at once, with everyone), turned (the game; script.js turns the six in front
— p3, p6, p1, p9, p4, p0 — each at his own threshold, with a delay of ½…1 s: the body halfway, the head farther), in_ear, in_toss;
the scene sets by itself: front_r, front_l, fire_light. The "film" puppets' keys are gone (jo_raise, in_nod, dv_kneel, dv_sing, hand…):
these are now the people's actions in the beats. A new motion of the cast: throw_back.

## Contract for the check

```json
{
  "beats": {
    "dawn": { "after": [], "tells": [], "seconds": 10 },
    "ear": { "after": ["dawn"], "tells": ["ear:nod"], "seconds": 16 },
    "raise": { "after": ["ear"], "tells": [], "seconds": 6 },
    "rise": { "after": ["raise"], "tells": [], "seconds": 7 },
    "kneel_late": { "after": ["raise"], "tells": [], "seconds": 9 },
    "light": { "after": ["rise", "kneel_late"], "tells": [], "seconds": 6 },
    "fire": { "after": ["light"], "tells": ["fire:caught"], "seconds": 12 },
    "hymn": { "after": ["fire"], "tells": ["hymn:still"], "seconds": 10 },
    "hymn_loud": { "after": ["hymn"], "tells": [], "seconds": 8 },
    "hymn_hide": { "after": ["hymn"], "tells": ["hymn_hide:look"], "seconds": 12 },
    "burn": { "after": ["hymn_loud", "hymn_hide"], "tells": [], "seconds": 7 },
    "morning": { "after": ["burn"], "tells": [], "seconds": 14 },
    "stalk_stay": { "after": ["morning"], "tells": ["stalk_stay:pull"], "seconds": 25 },
    "stalk_go": { "after": ["morning"], "tells": [], "seconds": 22 }
  },
  "points": ["dv", "jo", "em", "in", "stalk#ear"],
  "offers": ["dv"],
  "party": { "beat": null, "turned": 0, "dv_kneel": false },
  "speakers": ["dv", "jo", "em", "in"]
}
```
