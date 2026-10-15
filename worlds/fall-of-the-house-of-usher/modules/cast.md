# cast — the people of «Падение дома Ашеров» as the engine's people

A module for scenes with people (elements with `person`: `{"cast": "cast", "who": …}` — moood's docs/agents/people.md).
List it in a scene's `modules`. All in the world's style `usher` (the engine's `shadow`: slender, small-headed, tapering
silhouettes rimmed by the scene's light; the face `simple`, ground `night`).

## Who

- `roderick` — Roderick Usher: very tall, wasted, pale; long ash-silver hair (`straight`); a wine-black dressing gown to
  the floor (`robe`).
- `narrator` — his friend from boyhood: a long riding coat (`coat`), short dark hair; out of doors a top hat
  (`look: {hat: "top"}` on the element, or `<id>_wear: {hat: "top"}`).
- `madeline` — his twin: the same pallor and hair, long and loose; a long white-grey night gown (`gown`), barefoot;
  seen in her pale colours (paint `lit`). Risen from the vault: `<id>_wear: {garment: "shroud"}` — the gown torn at the
  hem, blood on its breast and on her hands.
- `doctor` — stout, ~55, a black frock coat, his bag in the right hand (`bag`, swinging late).
- `valet` — of stealthy step, a dark livery jacket.

## Things in the hands (`<id>_with`)

`lamp` — Roderick's oil lamp held up by its foot in the right hand, its glass glowing; its point `flame`
(`"roderick#flame"`: the scene's light `"at"` it). `book_open` — the open book in both hands, pages up; its point
`book`. `bag` — the doctor's. `torch` — a torch upright in the left hand; its point `flame` (its fire is the scene's:
particles `fire` and a light `"at": "<id>#flame"`). `guitar` — across the body, the right hand at the sound hole, the
left on the neck.

## Motions (Kimodo's, in cast.data.json; the engine has `stand` and `walk`)

- Sitting, the room: `sit_down`, `seated` (loop), `rise`, `sit_hands` (loop), `read_seated` (loop), `take_guitar`,
  `play_guitar` (loop), `lay_guitar`, `rock` (loop), `ease`, `tremble`, `talk`, `flinch`, `weep`, `lean_in`,
  `straighten`, `take_hand`, `bow`, `still`; `keep_time` (once, 1.2 s: standing, the right palm slaps the thigh — keeping time
  to his guitar; done again at each beat).
- Madeline: `sleepwalk` (gait), `sway`, `stagger`, `lean_fall`; the end: `catch_step`, `sink_kneel`, `kneel_slow`,
  `kneel_hold`, `kneel_down`, `kneel`.
- The lamp: `lamp_walk` (gait), `lamp_stand`, `lamp_put`.
- Roderick hurrying: `hurry` (gait: a hurried walk, leaning forward — a walk of its own pace, not a walk sped up).
- On horseback: `ride` (loop: astride, knees bent, the reins in both hands; with the ushers horse — `<id>_on: "rider#stirrups"`).
- On the causeway: `led_walk` (gait: led by the hand, leaning back), `back_walk` (gait: backwards), `balk` (standing,
  resisting, the face away), `kneel_ears` (down on the knees, hands over the ears), `rock_ears` (loop), `run`, `flee`
  (gait), `stumble` (once, `going`), `step_back`.
- The vault: `carry_walk`, `carry_back` (gaits: bearing a coffin, forwards and backwards), `set_down`, `lean_over`,
  `bend_over`, `lean_step_l`, `lean_step_r`, `straighten_coffin`, `grieve`, `lie` (lying, no breath), `lean_hand`;
  the torch: `take_torch`, `hold_torch`, `raise_torch`, `hold_high`, `lower_torch`, `torch_walk`, `torch_back`.
