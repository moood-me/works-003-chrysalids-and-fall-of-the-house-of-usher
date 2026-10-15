# cast — the people of «Хризалиды» as the engine's people

A module for scenes with people (elements with `person`: `{"cast": "cast", "who": …}` — moood's docs/agents/people.md).
List it in a scene's `modules` with the others.

## Who

- `david` — David, ~10: a blue shirt, brown trousers, short dark hair.
- `sophie` — Sophie Wender, ~10: a rust-red dress below the knee, a ponytail, pale stockings, laced shoes; her right
  foot (six toes) bare under `wear: {barefoot: 'right'}` — the stocking.
- `wender` — Mrs Wender, her mother: a plain brown dress to the ground, her hair in a bun.
- `axel` — uncle Axel, the smith: an old sailor, broad and heavy, a grey beard, a cap, a leather apron (`smith_apron`:
  the sleeves rolled up), a stiff right leg — his gait `limp` (the element's `person.gait`). Left-handed at the anvil.
- `david_teen` — David at 14–16: nearly grown, a dark blue jacket over the shirt (worn over `david` as his `wear`: the
  same element years later).
- `joseph` — Joseph Strorm, his father: tall, a long black coat (`longcoat`), a full dark beard (`beard`), bare-headed in
  the house; out of doors his wide-brimmed hat (`wear: {hat: 'hat'}`).
- `emily` — Emily Strorm, his mother: a dark dress to the ground with a pale apron (`apron_dress`, the apron in the
  look's `accent`), a white bonnet (`bonnet`) over her bun.
- `mary` — Mary, his older sister: a grey-blue dress and apron, a kerchief (`kerchief`).
- `farmhand` — the farmhand: a broad man in a fawn smock, bare-headed in the house; out of doors his brimmed hat
  (`wear: {hat: 'hat'}`). `villager` — a man of Waknuk: a dark jacket, a hat.
- `rider` — a rider of the community: a long dark riding coat (`longcoat`), a brimmed hat; in the saddle of a horse of the module
  `chrysalids` (`<id>_on` its `seat`, a seated loop — `perch_still` —, the feet reaching for its stirrups, the hands for
  its reins).
- `inspector` — the government's inspector: a lean man in a grey frock coat to the knee (`longcoat`), round spectacles
  (the face `spectacles`, in the look's `accent`); out of doors his hat (`wear: {hat: 'hat'}`).

- `rosalind` — Rosalind, ~16 (III–VII): tall, slender, long dark-auburn hair, a plain grey-green dress; her bow the part
  `bow` (in the left hand; the string to the right hand as it draws).
- `petra` — Petra, ~6: small, fair hair, a grey dress, a plum shawl over the shoulders (`shawl_dress`; the accent).
- `michael` — Michael, ~15: a dark jacket, a cap.
- `sealand` — the woman from Sealand: tall, upright, a close pale suit, short pale hair.
- `sophie_adult` — Sophie grown, with the Fringes people: a worn dark jacket, trousers, her hair tied back, a rust kerchief
  at the neck (`scarf`, the look's `accent`).
- `spider` — the Spider-man of the Fringes: very tall, the arms far too long, a ragged dark coat, long grey hair, a beard.
- The Fringes' people: `guard` (broad, a spear — `spear`), `hunchback` (a hump — `hump`), `fringe_man`, `fringe_woman`.
- The community of Waknuk, each in their own colours (a crowd is never one person ten times): `man_a` (jacket, hat),
  `man_b` (long coat, hat, beard, heavy), `man_c` (smock, cap), `woman_a` (dress and apron, bonnet), `woman_b` (dress,
  kerchief), `woman_c` (dress and apron, kerchief), `boy`, `girl`, `old_man` (long coat, hat, grey beard), `old_woman`
  (bonnet, shawl).
- David's nightshirt (the dream): `<id>_wear: {garment: 'nightshirt', barefoot: 'both'}`.

Parts and their points are drawn at the person's size: `F.fit.h` is their height as a share of a man's 1.76 m — a man's
`x` metres are `x * F.fit.h` on them.

All in the world's style `chrysalids` (the engine's `graphic`, toned, a fine line, the engine's face `simple` — at rest,
or as `<id>_mood` says; the inspector's `spectacles` over it). Parts in the hands (`with`): `shoe` — Sophie's shoe, `bundle` — a cloth bundle, `rag_loose` — a rag wound
anyhow round the right hand, an end hanging, blood through it, `rag` — the same bound neat, `book` — the Book shut in the
left hand, `book_open` — open in both hands, `torch` — a torch held up in the right hand (its point `flame`: the scene's fire particles and light there),
`book_open_l` — open on the left hand alone, `ladle` — a long wooden ladle,
`spoon`, `hammer` — the smith's hammer in the left hand (on along the forearm, its face the way the arm swings),
`tongs` — tongs in the right hand, `lantern` — a lantern hanging from the right hand (its light is the scene's: a light
`"at": "<who>#hand_r"`). `beard` — a full beard, `staff` — a tall walking staff in the right hand (a look's `parts`).

## Motions (Kimodo's; a child moves as a small adult)

Sitting on the floor (loops): `sit_lean_back` (leaning back on the hands, knees up — sliding down the bank),
`sit_laugh`, `sit_knees`, `sit_up_straight`, `hug_knees`, `knee_up_sit`, `stuck_sit` (the right leg out, the left knee
up), `tug` (pulling at the right leg), `cry_sit`, `turn_away_sit`; once: `land_cheer` (arms up), `refuse`, `try_stand`,
`sit_down_ground`, `get_up_ground`.
Kneeling: `kneel_down` (once), `kneel`, `kneel_pull` (pulling at something low), `kneel_work` (hands low, at a knot),
`sit_heels`, `crouch` (loops), `stand_from_kneel`, `shush` (a finger to the lips, on the heels; once).
Standing: `beckon`, `beckon_woman`, `point_up`, `shush_stand`, `laugh_stand` (once), `shade` (a hand over the eyes).
Gaits: `climb` (bent far forward — up a steep bank), `carry_walk` (with a child in the arms).
Carrying: `kneel_hug` (down on the knees, the arms out to someone; once), `lift_child` (up from the knees with a child;
once), `carry_stand`, `carried` (a child held, the arms round the neck: with `on`).
Smithing (Axel, left-handed): `smith_strike` (once: the lift high, the blow on the iron at 1.17 s, the top at 0.73 s;
the blow lands half a metre before the pelvis, on its middle), `raise_hammer` (up, held), `put_down`, `pick_up` (the left
hand, on the anvil), `think` (a hand to the chin), `limp` and `limp_back` (gaits: walking, backing away). On one knee
(the left): `kneel_one` (down, once), `kneel_one_still`, `kneel_one_hush` (a finger to the lips), `kneel_one_temple`,
`kneel_one_think`, `kneel_one_ask` (an open hand), `kneel_one_shake`, `kneel_one_rise` (once).
A child on a high seat (with `on` its top — a chair's sitting; the legs hang): `perch`, `perch_still`, `perch_talk`,
`perch_hunch`, `perch_slump`, `perch_laugh`, `perch_shake`, `perch_point` (up ahead, the right hand); `hop_down` (once:
slides forward onto the feet). `pull_lever` (once: both hands up, pulling down), `run` (a gait).
The man with a lantern: `whistle` (two fingers of the left hand), `fall_back` (struck, onto the back), `lie_back`.
Waving sitting is a reach to and fro (the scene's `wave`), a nod a look down and up (`nod`).
On a chair (loops): `read_seated` (an open book in both hands), `sit_still` (hands forward — on a table's edge with
`reach`), `sit_grip` (holding the table's edge), `sit_tremble` (holding it, shaking), `sit_fidget`, `eat_seated` (a
spoon to the bowl), `pray_seated` (hands clasped), `sew` (head bowed, hands in the lap); once: `rise_chair` (up — the
pelvis forward over the feet, ~0.45 m), `rise_away` (pushes the chair back from a table, stands a step behind the seat),
`sit_chair` (down onto a chair behind).
Standing (loops): `clutch` (the hurt right hand cradled at the chest, head down), `teeth` (the hand at the mouth, pulling
at a bandage), `hide_stand` (hands behind the back, eyes down), `stir_pot` (bent, stirring low with the right hand),
`tend` (both hands at chest height, binding something), `pray_stand`; once: `flinch`.
In the yard (loops): `rope_hold` (upright, the right hand out to an animal's halter — on it with `reach`), `ledger_read`
(the left hand up at the chest: a book open on it, `book_open_l`; the right free), `arms_folded`, `peek_corner` (the
right hand flat on a wall's edge at the head, leaning out to the right round it).
Kneeling (loops): `kneel_pray` (upright, hands clasped), `kneel_hide` (hands behind the back).
Gaits: `clutch_walk` (bowed, the hurt hand at the chest), `tiptoe` (stealthy). Stairs are a relief and the cast's walk
(Kimodo's own stair-climbing rises in the loop and falls back at its seam). Pointing and a hand raised or laid on a
head are reaches (`reach` to the point), a shake of the head a look from side to side.
In the meeting house: `inspector_seated` (at a table, the hands on it — with `reach`), `rise_table` (once: up from the
chair pushing on the table, 2.5 s), `lean_table` (standing bent over a table, the palms on it — with `reach`);
`bench_down` (once: down onto a bench behind, 2.9 s), `bench_sit`, `bench_rise` (once); standing: `arms_folded`,
`hands_behind`, `staff_lean` (on a staff in the right hand: the part `staff`), `child_stand` (a boy, the arms at his
sides), `turn_away` (once: a turn away, the head bowed).

For «Хризалиды v3» (2026-10-15): `scoop` (once: crouches, gathers a child up from the ground, stands holding it — the
child `on` the hands; then `carry`), `carry` (the hold, standing — carry_stand's recording), `collapse` (once: struck,
staggers, down — onto the back), `cling` (a loop: hanging by both hands from something overhead, the knees drawn up — a
child holding a branch in the water), `sing_stand` (a loop: standing, hands clasped, the head raised — a hymn; kneeling,
the hymn is `kneel_pray` with the look up), `draw_bow` (once: the left arm out with the bow, the right drawn to the
chin, held, loosed — with the part `bow`), `mount` (once: down into a high seat beside — then `on` the horse's seat),
`dismount` (once: down off something high onto the feet — `on(null)` as it begins), `lift_into` (once: crouches, lifts
a child up high before them — into a pannier), `pull_out` (once: crouching at an edge, both hands down and drawn back
toward the chest — pulling someone out of the water).
`throw_back` (once: turns and flings something back over the right shoulder, the arm high), `rake` (a loop: bent
forward, both hands low drawing toward the body — raking hay, with the part `rake`), `aim_rifle` (a loop: standing, both
arms straight out before the chest — a gun along them, the part `gun`), `kneel_aim` (a loop: down on the right knee, a gun
at the shoulder).
