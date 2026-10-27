FILM "The bank by the stream" (The Chrysalids v3, ch. I and II), engine 3 (moved from the "film game v2" by the changes of engine3-porting.md:
shaders — WGSL, lights have no `size`; the module beats says the next beat's cut ahead). The people — the engine's people (elements with person, the world's cast modules/cast.js:
david, sophie, wender — Mrs Wender, rider — the rider); the rider's horse — the world's module chrysalids (the engine does not lead horses:
a card in layers at their own depths, painted once from every side, the gait and the turn — its animate). A silent film in beats (the world's module beats): the game "The Chrysalids — film"
plays them one at a time, choices between them. No captions. Moved from the old engine (the world pavel/khrizalidy-kino-igra) —
what became what — docs/history/2026-10-10-engine2-nasyp.md in moood's repository (rpg).

SHOWING (showcase.js, lib.SHOWCASE, ~2.7 min): play → play_again → stuck → let → toes_bare → ridge → cover → ridge_pass →
ask → promise → mother → nod → alone → night_warn → night_warn_bye. The game's canon (what the world's viewer sees, if he plays):
play → play_again → stuck → let → toes → ask → promise → mother → nod → alone.

BEATS (lib.FILM: the director's sequences; the people — at their own pace; `from` — the whole state, the scene can be opened at any of them):
 play        David slides down the slope into the sand, laughing; at the top Sophie gets up; he waves — she slides down, they laugh.
 play_again  "Again!" — she gets up, points to the top, runs to the slope, scrambles up; with a run-up she flies past the heap, onto the stones.
 stuck       A blow on the stones (spray, dust, rings); the camera comes up. Her foot is stuck: she tugs, cries; he on his knees pulls;
             reaches for the shoe — she leans back, pushes him away; he sits back on his heels, she cries. The end — the game asks
             how to speak to her (the element sophie).
 let         (the canon) She goes quiet, looks at her foot, at him, nods, turns away, covering her face; he takes off the shoe.
 talk_hurt   "Does it hurt?" He bends down; she nods through her tears (twice), looks at her foot, turns away; he takes it off.
 talk_whose  "Whose are you?" The tears break off, she sits up straight, looks him in the eyes; points to her foot, nods; he unties it.
 talk_sit    Silently: he gets up, goes round her and sits down shoulder to shoulder; she quietens, nods at her foot; he comes back; they untie it
             together. All four end the same: the shoe with David, Sophie — her knee to her chest, her foot bare.
 toes        (the canon) An iris, close: six toes, curling; her hand pulls the hem over. Outside — she has hugged her knees.
 toes_bare   The same, but the hem is not pulled over: the toes move twice; the foot stays bare (the game: the rider is still to come).
 ridge       The camera draws back; on the left, at the edge of the meadow, a rider (the scene says ridge:rider — he has appeared); Sophie freezes
             and looks at him, then David; he gets on his knees and reaches for her foot — the close shot opens
             (right of the frame's middle, the meadow and the rider seen): the foot, the hem, his hand on the hem's edge (ridge:hem). Here
             the rider moves off at a walk (if the game is not holding him with the key r_wait — then, when it lets him go), ≈ 11 s at a slow walk to the stones; he waits on the meadow on the left, in the frame. Here
             the game plays "The hem": the key hem (his hand pulls the hem over the foot). The end — the rider where the stones can be seen from:
             the scene says ridge:seen; the close shot stays open until cover or ridge_stop closes it.
 cover       The hem on the foot (the game: in time — it may begin in the middle of ridge): the close shot closes, he lets go of the foot,
             she draws her knees up; both look at the rider; the camera settles on its shot from where it was, the rider
             comes to that place at his own pace (ridge:seen); the beat ends when the rider has got there.
 ridge_pass  The rider does not turn his head: he rides on at a walk, to the right and up, to the path. Then they look at each
             other. The end — the rider far off on the path (he rides on after the beat's end too).
 ridge_stop  Too late (the hem not pulled over by ridge:seen): the close shot closes; the rider reins in his horse right behind them, turns it to them, the horse tosses its head, the rider
             looks at them; David pulls the hem over too late; the rider rides on (the end — as in ridge_pass).
 ask         She, hugging her knees, holds out her hand to him (a promise). It comes after toes; after ridge_pass/ridge_stop — a cut
             (the game opens it anew, the rider gone already).
 promise     He — a finger to his lips; gives back the shoe, she takes it.
 mother      She tries to stand — cannot; far off her mother (a hand shading her eyes), Sophie waves, the mother runs down, on her knees, hugs her;
             her hand finds the foot under the hem, stops; the mother raises her eyes to David. The end — David's choice (the element mother).
 nod         (the canon) He — a finger to his lips; she nods; lifts Sophie and carries her off along the path; Sophie looks back.
 away        He lowers his eyes, turns away; the mother looks a long time; lifts Sophie and goes off without looking back; Sophie looks
             back; he raises his eyes after her. (In both the mother goes on after the beat's end too.)
 alone       (the canon) On the far crest a rider (someone_coming); David looks at him, sits down by the water, looks after them.
 night_warn  CHAPTER II, "The night before the raid". Night (night 1). The chapter's beginning: David runs down the bank;
             by the stones Sophie, a little way off on the path her mother with a bundle; both turn round; Sophie steps towards him; they are face to face.
             The choice can be offered on sophie, mother, david.
 night_warn_bye  Sophie takes his hand; her mother calls; Sophie lets go, goes off with her mother up the path into the dark;
             looks back; he stands and looks after her.

THE GAME: `g.scene('stream-bank', { beat: '<beat>' })` opens the scene at a beat; `g.beat('<beat>')` — the next one (the scene
says beat:<beat> when it has ended); the branches — talk_*, toes_bare, ridge/cover/ridge_pass/ridge_stop, away; the canon —
let, toes, nod, alone; chapter II — night_warn, then night_warn_bye. The rider's moments the scene says itself (scene.tell):
ridge:rider — he has appeared on the meadow (from this moment there is someone to hide the foot from; the game starts the hooves earlier — by r_a / r_near),
ridge:hem — the close shot open, David's hand on the hem (the mark of "The hem" — from this moment), ridge:seen — he has come to where the stones can be seen from
(said by the beat in which he got there: ridge or cover). Moments for the game's lines: play:girl — Sophie gets up out of the grass at the top; ridge_stop:held —
the rider has reined in behind them and looks; ridge_stop:on — he has ridden on; mother:wave — Sophie waves to her mother; nod:nod — the mother
nods; away:gone — the mother lifts Sophie and goes. The game waits for these words, not for seconds or r_a. The scene's numbers the game
need not know. What changed for the game against the old scene: after play comes play_again (then stuck); "the rider
has appeared" — ridge:rider instead of a pause of a second; after cover there is no need to wait for r_a ≥ −4.05 — beat:cover means "he has got there".

KEYS (states — what each means): beat; hem 0…1 (the hem David's hand pulls: the game leads it — "The hem"; the beats do not
write it), cu_cover (David's hand on the hem — ridge sets it), r_near 0…1 (the rider comes closer: it goes with r_a, r_d from
the edge of the meadow to the place the stones can be seen from — by it the game leads the arc of time of "The hem", the scene's numbers it need not know);
r_wait (the game holds the rider at the edge of the meadow after ridge:hem, while "The hem" shows its gesture: the showing does not count against the time; the beats do not
write it, false by default — he rides at once; from the edge to the stones at a walk ≈ 11 s);
evening 0…1 (the evening — the light's look and the sun lower), night 0…1 (the night's look,
the stars, the moon); someone_coming; shoe (and with it david_with, sophie_with, sophie_wear — the beats set them); closeup, cu_pull,
cu_wig, cu_hide (the close shot's inserts); puff/puff_a (dust: a burst when the number grows), splash (spray), ring/ring_a
(rings on the water); r_a, r_d, r_face, r_toss (the horse). The people — the engine's keys with an id: david_, sophie_, mother_, rider_ (_a, _d, _e for
the children — the flight off the edge, _do, _turn, _look, _reach, _with, _wear, _gait, _steps, _on, _here). The rider: rider_on — the horse's saddle
(horse#seat), rider_reach — his feet in the stirrups, his hands on the reins: points in the horse's frame ({on: horse, at}), their own for each
turn — script.js keeps them (lib.tack) when r_face changes; rider_here — he (and the horse) on the meadow, rider_look — where
he looks. A nod — a look down and back, a wave sitting — a hand to a point to and fro (lib nod, wave): they lie over what
the person is doing (a motion of the cast would take the whole body; a trial "waves sitting" came out sitting on a chair — not taken).

THE MAKING: the ground — relief.js (the bank's profile lib.bankL along its line, 2 m deep); big_bank, stones, fringe, dragonfly —
"onLand": false (they paint the ground itself). The pictures are still, in day colours, without haze (the far hills and the crest too:
the haze is the engine's); no picture reads keys that move. What moves: the grass and the willows — layers in the wind (lib.tufts,
lib.willow), the clouds — a drift, the sun — sky.animate (lower towards evening, its point — the light sun), the night sky with the moon — a layer of the sky,
sky.animate brings it out by night; the stars (brightness — the uniform night) and the stream's glints — shaders of their own, the dust, the spray,
the motes, the smoke — particles, the rings on the water and the dragonfly — animate, the rider on the crest — the layers ridge (he rides along the crest at the pace of a horse
of his size, the legs — the four beats of a walk by the way gone; painted at 3.6 his height, to read at 260 m).
LIGHT: the scene is lit by day too (ambient 0.95, warm; bounce, shafts). The sun low and ahead (sky#sun), all that faces
us — against the light: the light round about holds it (ambient), the sun adds onto the ground and gives the shadows; the shadows soft,
the people's and the horse's — strength 0.8. The bank (the relief) hides the sun itself: its slope towards us and the shore below it — in its shadow (it is not
a spot, but the ground's shadow; without ambient it was black). The evening and the night — light.looks.
The close shot — four inserts by the key closeup with one iris (lib.CU: the middle 1.05 / 0.37 of the frame's height, the radius
0.24 (the top — under the language's plate) — high, a little right of the middle, in the middle of 4:3 over the far meadow; the children under it and the rider on the left seen while it is open): closeup (sand, water; the game's points
closeup#hem — the hem's edge, closeup#foot — where it lies, covering the foot), closeup_glints (glints), closeup_foot (the stones,
the foot, the toes, the hem — cu_hide pulls it (her hand, the canon toes) or hem (his hand, "The hem"), the hands), closeup_iris (a soft
dark ring round the window — a shader, the uniform open; beyond the ring the scene as it is). The inserts' pictures — in units of their own
(lib.cuFrame: as when the iris was 0.46 of the height in the middle), animate gives the shaders their place.
THE HORSE (the module chrysalids, chrysalids.md): painted once — the body, the neck, the head, the tail from 24 sides (a layer a side,
the one nearest r_face seen), the leg bones once each; animate sets the legs by the gait (a walk, a trot, a canter, a gallop — by the speed of
the place's keys, one going over into the next), a turn on the spot — by stepping round. The film leads the horse at a walk (lib.RIDE — the walk's pace
from the module), reins it in smoothly (ridge_stop). The rider sits on its point seat.

## Contract for the check

```json
{
  "beats": {
    "play": { "after": [], "tells": ["play:girl"], "seconds": 21 },
    "play_again": { "after": ["play"], "tells": [], "seconds": 12 },
    "stuck": { "after": ["play_again"], "tells": [], "seconds": 10 },
    "let": { "after": ["stuck"], "tells": [], "seconds": 7, "show": false },
    "talk_hurt": { "after": ["stuck"], "tells": [], "seconds": 10 },
    "talk_whose": { "after": ["stuck"], "tells": [], "seconds": 11 },
    "talk_sit": { "after": ["stuck"], "tells": [], "seconds": 18 },
    "toes": { "after": ["let", "talk_hurt", "talk_whose", "talk_sit"], "tells": [], "seconds": 7, "show": false },
    "toes_bare": { "after": ["let", "talk_hurt", "talk_whose", "talk_sit"], "tells": [], "seconds": 6 },
    "ridge": { "after": ["toes_bare"], "tells": ["ridge:rider", "ridge:hem", "ridge:seen"], "seconds": 18 },
    "cover": { "after": ["ridge"], "tells": ["ridge:seen"], "seconds": 3 },
    "ridge_pass": { "after": ["cover"], "tells": [], "seconds": 16 },
    "ridge_stop": { "after": ["ridge"], "tells": ["ridge_stop:held", "ridge_stop:on"], "seconds": 27 },
    "ask": { "after": ["toes"], "tells": [], "seconds": 2 },
    "promise": { "after": ["ask"], "tells": [], "seconds": 4 },
    "mother": { "after": ["promise"], "tells": ["mother:wave"], "seconds": 24 },
    "nod": { "after": ["mother"], "tells": ["nod:nod"], "seconds": 10 },
    "away": { "after": ["mother"], "tells": ["away:gone"], "seconds": 11 },
    "alone": { "after": ["nod", "away"], "tells": [], "seconds": 9, "show": false },
    "night_warn": { "after": [], "tells": [], "seconds": 5 },
    "night_warn_bye": { "after": ["night_warn"], "tells": [], "seconds": 12 }
  },
  "points": ["closeup#hem", "closeup#foot", "sophie", "mother", "david"],
  "offers": ["sophie", "mother", "david"],
  "party": { "beat": null, "hem": 0, "r_near": 0, "r_wait": false },
  "speakers": ["david", "sophie", "mother"]
}
```
