UNCLE AXEL'S FORGE (The Chrysalids v3; III.1, III.5 `night_anne`, V.2 `key`), engine 3. Rewritten from the "film game" (engine 1):
the pictures — once, in day colours (a plank wall, an earth floor, a brick forge, iron); the light — the scene's: the forge fire
(`fire` — a point light by the coals, by the key fire; the coals — a glowing layer, the flame, the sparks and the smoke — particles), the moon (`moon`, a far
light from behind on the right: the yard beyond the gate in moonlight — a light gap, against which Axel kneels on one knee), the hot iron
on the anvil (`iron_glow`), the lanterns in hands (`lantern`, `lantern2`, `lantern_w0/w1`), the glow in David's head (`glow`,
by dv_glow). The roof (a plane) keeps the moon outside: inside — the fire. The film — the module beats (lib.js FILM). The people — the world's cast:
axel (limps — the gait limp; the hammer in his left hand, the tongs in his right — parts of the cast), david (on the barrel — david_on its top), joseph,
farmhand (with a lantern), watch0/watch1 (man_a, man_c — two more). The horse in the yard — the module chrysalids (dozing).

The hammer: Axel stands where his blow (smith_strike) lands on the iron (lib.AT_ANVIL); the hammer's face on the iron — 1.17 s into
the motion; at that moment sparks (the particles sparks from anvil#iron, by ax_spark) and `scene.tell('ax:hit')`. ax_blow (the game) — a blow from
the lift: it is called 1.17 s before the beat. While the tools are not in his hands (axel_with), they lie on the anvil (the anvil's layers).

BEATS (lib.FILM; `from` — the whole state):
 chatter   The night forge: Axel forges with his back to the boy; David on the barrel facing the gate "chatters" (dv_chat 7.2: a thought to the Mortons' far
           window and an answer, he laughs).
 notice    The hammer stops at the top; Axel lays down his tools, looks at the gate, at the boy; limps to him, David shrinks;
           down on one knee against the light gap of the gate, the camera moves in; a hand on the shoulder; an open palm "who?" (the choice — on david).
 truth     (the canon) David points to the window; a thought goes off, the answer comes; he nods. Axel — his hand at his beard; a look at the gate.
 lie       He shakes his head, looks at the floor; the answer comes all the same; his eyes go to the window; Axel looks there too; a nod.
 door      He gets up; to the gate, looks both ways; his hands on the door's edge (door#grip_low/high), backing (limp_back) he slides it shut.
 hush      Down on one knee right up close: a finger at his lips, a finger at his temple, his hands on the shoulders, he shakes his head; David nods twice.
 lantern   (the canon) The father's lantern in the yard; Axel to the anvil, forges; David droops; the father in the gap, the lantern up; Axel nods; he goes away.
 after     Axel lowers the hammer, nods to the boy; David "talks" with the window; Axel forges again (ax_pace 2.4), thoughts once in 13 s.
 lantern_bellows (III.1, after hush) The father's lantern; Axel to the anvil; David slides off the barrel and runs to the bellows' lever;
           the camera on the shot of the bellows and the anvil (both in the middle of the frame: CAM.bellows), stands. The father in the gap, the lantern up, on Axel,
           on the boy. Then "The bellows' rhythm": the game leads ax_blow and pump; the marks — axel#hand_l (the hammer), pump#handle; a miss —
           the lantern higher and on the boy (st_lamp above 1: the scene itself shines on David — the light glare by st_glare).
 lantern_go | lantern_linger  The father lowers the lantern and goes away | the lantern higher, the father steps into the gap, looks a long time, goes away.
 rest      Axel lowers the hammer, looks at the boy at the bellows; a slow nod; David nods.
 night_anne Night, the fire low, the door half shut; David on the barrel tells his story, Axel by the workbench, his hand at his beard.
 night_anne_end "Off to bed": a nod; David slides off the barrel and goes off into the night; Axel to the fire.
 key       (V.2; David — david_teen: years later) Night; Axel makes the key with quick blows (ax_pace 1.4); David at the bellows (pump_work 1.3).
 stranger  The farmhand in the gap raises his lantern, looks at the anvil, at the boy.
 stranger_go | caught | strike  He goes away (the rhythm held) | he whistles, two more with lanterns; David shakes his head "don't" |
           David nods; Axel to the gap, a blow: the farmhand falls on his back into the yard, the lantern goes out; the fire sinks.

KEYS: beat, fire, sparks, door, pump; by themselves: ax_work, ax_pace, dv_chat, pump_work, dv_pump; the game: ax_blow
(the moment ax:hit), pump, st_lamp (above 1 — on David); the beats: st_lx, st_lz; the man with the lantern: st_on, st_who, st_a/st_d, st_drop, st_glow, st_lanx,
st_more; the thoughts — th_amp, tho_*, thi_* (the elements thought_out, thought_in: layers, animate dims them on their way); the horse — hz_*.
Points: pump#handle (the bellows — an element of their own, pump), anvil#iron, door#grip_low, door#grip_high, morton#window, forge#fire.

## Contract for the check

```json
{
  "beats": {
    "chatter": { "after": [], "tells": [], "seconds": 11 },
    "notice": { "after": ["chatter"], "tells": [], "seconds": 17 },
    "truth": { "after": ["notice"], "tells": ["truth:window", "truth:ask"], "seconds": 14 },
    "lie": { "after": ["notice"], "tells": ["lie:ask"], "seconds": 14 },
    "door": { "after": ["truth", "lie"], "tells": [], "seconds": 16 },
    "hush": { "after": ["door"], "tells": ["hush:finger"], "seconds": 16 },
    "lantern": { "after": ["hush"], "tells": [], "seconds": 16, "show": false },
    "after": { "after": ["lantern"], "tells": [], "seconds": 14, "show": false },
    "lantern_bellows": { "after": ["hush"], "tells": [], "seconds": 12 },
    "lantern_go": { "after": ["lantern_bellows"], "tells": ["lantern_go:away"], "seconds": 8 },
    "lantern_linger": { "after": ["lantern_bellows"], "tells": [], "seconds": 12 },
    "rest": { "after": ["lantern_go", "lantern_linger"], "tells": ["rest:nod"], "seconds": 6 },
    "night_anne": { "after": [], "tells": [], "seconds": 9 },
    "night_anne_end": { "after": ["night_anne"], "tells": [], "seconds": 13 },
    "key": { "after": [], "tells": [], "seconds": 6 },
    "stranger": { "after": ["key"], "tells": ["stranger:stop"], "seconds": 8 },
    "stranger_go": { "after": ["stranger"], "tells": [], "seconds": 6 },
    "caught": { "after": ["stranger"], "tells": [], "seconds": 9 },
    "strike": { "after": ["stranger"], "tells": ["strike:step"], "seconds": 10 }
  },
  "tells": ["ax:hit"],
  "points": ["pump#handle", "axel#hand_l", "anvil#iron", "david", "axel", "joseph", "farmhand"],
  "offers": ["david", "axel"],
  "party": { "beat": null, "ax_blow": 0, "pump": 0, "fire": 0.75, "sparks": 0.5, "st_lamp": 0, "ax_work": 0, "pump_work": 0, "ax_pace": 2 },
  "speakers": ["david", "axel", "joseph", "farmhand"]
}
```
