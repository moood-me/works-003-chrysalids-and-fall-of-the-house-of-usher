# Буря и чтение — the narrator's room: the nights (III) and the storm (IV). Engine 3

The game plays one beat at a time (`beat` = its name; the scene tells `beat:<name>` when it ends — the world's module
`beats`); outside games the showcase plays them all (night, lamp_pass, enter_lamp, window_open, window_close, read,
confess, door_opens, hands, collapse, flee). Every beat's `from` holds all it does not set itself (any beat may open the
scene); a beat that follows its `after` goes on from what is there. After a beat the values hold and the people breathe.

## How it is built

- A picture (camera `picture`), frontal; world metres: across (0 the door's axis), distance ahead of the eye; the back
  wall at 6.5, the window's axis at WX 3.25. Everything is in `lib.js` (painters, their animates, the close-ups, the
  film); `elements/<id>.js` call it.
- **A lit scene**: stone, wood and cloth are painted once in their own colours; the light is the scene's — the candle
  (`flame#flame`, flickering), the lamp coming along the corridor (`hall`, carried by `hall_x`), the light it throws
  under the door (`gap`: a light at the floor behind the door, the wall and the leaf casting its shadows — only the gap
  lets it through, a fan on the floor; the carrier's `feet` stand in it and streak it), Roderick's lamp at his hand
  (`lamp` at `roderick#flame`, while `lamp_held`), his lamp on the floor (`lamp_floor`, of `floor_lamp`), the mist
  through the window's opening (`mist`, `through` its panes, by `glow`), the lightning through it (`lightning`; its
  look lifts the ambient — the whole room blinks), the red moon through the rift (`rift`; its look tints red). The old
  painted pools and rims (wallLights, the floor's fans, the chair's rims) are the light's now.
- `wall` — stone, the window's reveal, the door's surround, both cut through; the crack as long as `crack` says
  (repainted in steps of 0.02). `fissure` (a glowing card on it) — the mist seeping through the crack (`seep`, its
  alpha from `crack`, `glow`, `shudder`) and, split open, the red moon (`rift` layer).
- `door` — the leaf, hinged on the right, turned by `door_turn` (the script sets it from `door`: 180 shut … 88 open);
  `corridor` beyond; `door_gap` — the thread of light in the gap and the glimmer round the shut leaf (glowing, behind
  the door: seen only through the gaps), moving with `hall_x`, as bright as `hall_lamp`; `feet` — the carrier's two
  feet, walking (one lifted at a time) or standing, from how `hall_x` moves.
- `window` — the tracery and the fixed glass of its head; `casement_l`, `casement_r` — the leaded casements, cards
  turned by `case_l`, `case_r` (the script sets them from `window`, its overshoot their bounce, rattling in the wind
  while open); each marks `handle` (`casement_l#handle`) — hands reach for it and follow it as it swings. Rain runs down
  them (`drops_l`, `drops_r`); open, the rain is driven in (`rain_in`, amount `window`).
- `sky` — the storm: its shader flies the clouds (faster in the storm), lights their undersides by `glow`, flashes them
  and the sky with `lightning`, creeps the mist over the land. The rain beyond the window: `rain_quiet` always,
  `rain_storm` by `storm` (weather in the yard: `area` beyond the wall).
- `curtain` — the cloth painted hanging; its shader blows it into the room by `gust` (its animate follows `wind`).
- `floor` (plane); `ripple` (plane at SPOT) — its shader: rings and trembling grit by `ripple`.
- `table`, `candle` (the stick), `flame` (glowing: the flame layer breathing, bending away in the wind, shuddering;
  out — a thread of smoke), `dust` (motes, lit only where the light falls), `grit` (falling from the vault: a burst at
  each `jolt` — every shudder, every `sound` — and steadily with `quake`), `seat`, `chair`, `floor_lamp` (the ushers
  module's lamp, while `lamp_down`), `book` (closed on the table; while the narrator has it open its point follows
  `narrator#book`).
- People — the world's cast: `narrator`, `roderick` (his lamp: `roderick_with: ["lamp"]`), `madeline` (in the shroud:
  `madeline_wear: {garment: "shroud"}`). They walk at their gaits' own pace (Roderick's `lamp_walk`, Madeline's
  `stagger`, the run `run`); a beat waits for them.
- Close-ups — an insert (`closeup` 0/1, the closeups module): `shot` says which — `rod_lamp`, `rod_confess`,
  `mad_door`, `hands`; `lib.closeup` is what is painted, `lib.closeupNow` what moves (push `cu_push`, lips `cu_speak`,
  her hand `cu_reach`, the hands' raise, the narrator's hand at `grab_x`, `grab_y`, the lightning). Cut in and out —
  each close-up made ready ahead (`s.shot`), no fades.
- The script: the beats; door and casements from `door` / `window`; Roderick's rocking and flinching; the house's answer
  to `sound`; `listen`; the game's reaching keys → the hands in the room; the eye jolting with `quake` / `shudder`;
  lightning now and then in the storm (every 14…34 s, scene.random).

## Beats

| beat | after | what is seen | ends on (held) |
| --- | --- | --- | --- |
| `night` | — | out of black (2.5 s); night, quiet rain, the candle; the narrator at the table; he turns his head to the floor and back | seated, still — under «Слушать» |
| `lamp_pass` | night | lamplight along the corridor under the door, stops at the door (trembling), goes on and fades; he turns to the door | dark again, he looks at the door |
| `enter_lamp` | — | the storm, out of black; hurried lamplight; the door bursts open — Roderick with his lamp; the narrator gets up; Roderick comes in; the door drifts back; close-up `rod_lamp`, slowly closer | the close-up (~6 s in) — under «И ты не видел?» (`cu_speak`) |
| `window_open` | enter_lamp | out of the close-up; he goes to the window, his hand on the latch — the wind flings the casements open: the curtain flies, the mist brightens, lightning; his lamp up to the storm; the narrator to mid-room | Roderick at the open window, the narrator mid-room |
| `window_close` | window_open | the narrator comes up behind him; Roderick steps aside; the narrator pulls the casements shut by their handles, the wind drops; takes his hand, leads him round the chair; Roderick puts his lamp down and sits facing the door | Roderick seated, the narrator by the chair |
| `watch` | window_open | the narrator stands by him at the open window; lightning; Roderick glances at him | the two at the window |
| `read` | — | later, out of black; Roderick rocking in his chair; the narrator reads | the reading — under «Чтение» |
| `confess` | read | the book lowered; Roderick gets up, comes round before the chair; close-up `rod_confess` | the close-up — under the confession |
| `door_opens` | confess | out of the close-up; he points at the door — «Безумец!…»; the narrator lays the book down, gets up; the door swings open: Madeline, swaying; lightning; close-up `mad_door`, her hand coming up | her close-up |
| `hands` | door_opens | she staggers in; close-up of the hands (the game's reaching keys) | the hands — under «Руки» |
| `collapse` | hands | out of the close-up; she lurches onto him, he catches her, borne back; arms round each other; both sink to their knees | the two on their knees |
| `flee` | collapse, hands | the narrator runs out left — with whoever he took; whoever is left sinks down; the room shakes, the crack splits on the red moon, the candle goes out | the empty room shaking, red |
| `stay` | collapse, hands | the same end around the narrator, who stays; to black | black |

Beat lengths follow the people (their walks and motions take what they take): the game waits for the beats' moments
(`enter_lamp:close`, `confess:close`, `door_opens:out`), never for seconds.

## Keys the game sets

- `crack` 0…1; `rod_reach`, `mad_reach`, `rod_to_mad`, `mad_to_rod` 0…1; `with_madeline`, `with_roderick`; `cu_speak`
  0/1; «Слушать»: `ripple`, `listen`; «Чтение»: `sound`, `listen`, `rock`; «Руки»: the reaching keys, `grab`,
  `grab_x`, `grab_y`, `held_rod`, `held_mad`, `quake`, `shudder`.
- «Руки» finds the palms as the insert's named points: `closeup#rod_hand`, `closeup#mad_hand` (its marks stand on them)
  (no longer the old card's geometry from `closeup`'s distance); `grab_x`, `grab_y` — card units: the frame's height 1,
  origin its middle, y down (the wrist; the palm ~0.2 above).

## All the keys

`scene.json` "states" describes every key. Changed from the old scene: `door` and `window` keep their meaning (0…1),
the cards are turned by `door_turn`, `case_l`, `case_r` (the scene's own, set from them); `jolt` (the scene's: a
counter, each rise a burst of grit); `madeline_wear` (the shroud, the cast's way now). `rod_hand` / `mad_hand` are no
longer elements: they are the close-up's points.

## Elements for choices

`door`, `window`, `book` (on the table; in his hands while reading), `roderick`, `madeline`, `narrator`; points:
`ripple` (the plane: `ripple@`), `closeup#rod_hand`, `closeup#mad_hand`, `casement_l#handle`,
`casement_r#handle`, `door#ring`.

## Свет после правки тональной кривой (2026-10-11)

Подобрано по листам против v1 (настроение — холодная серо-синяя комната, тёплая свеча; комната видна, а не чёрная вокруг
лужи света): `ambient` 0.06 → 0.5, `ambientColor` `#7d8f9c` → `#8aa3b8`; взгляд `lightning`: `ambient` 0.4 → 0.7 (над
новой базой); `rift`: `tintStrength` 0.22 → 0.15, свет `rift` `strength` 1.6 → 1.2 (красное — зарево в комнате, не
заливка кадра).

## Движок 3 (v3, 2026-10-15)

- `"engine": 3`, шейдеры `sky.wgsl`, `curtain.wgsl`, `ripple.wgsl`. Из крупного плана — ключом `closeup` (вставка
  закрывается, комната шла под ней), в него — склейкой, сказанной заранее (как было).
- Моменты: `enter_lamp:close`, `confess:close` (крупный план — реплики игры), `door_opens:out` (из крупного плана: он
  поворачивается к двери).
- Точки игры: `floor#mid` (середина пола — «Слушать» ищет по нему), `ripple@` (откуда звук), `book@` («Чтение»),
  `closeup#nar_hand`, `closeup#rod_hand`, `closeup#mad_hand`, `closeup#stay` (вставка рук — «Руки»; `stay` — между руками,
  над его рукой: «остаться»); выборы — `door`, `window`, `roderick`.

## Контракт для проверки

```json
{
  "beats": {
    "night": {
      "after": [],
      "tells": [],
      "seconds": 7
    },
    "lamp_pass": {
      "after": [
        "night"
      ],
      "tells": [],
      "seconds": 7
    },
    "enter_lamp": {
      "after": [],
      "tells": [
        "enter_lamp:close"
      ],
      "seconds": 9
    },
    "window_open": {
      "after": [
        "enter_lamp"
      ],
      "tells": [],
      "seconds": 7
    },
    "window_close": {
      "after": [
        "window_open"
      ],
      "tells": [],
      "seconds": 12
    },
    "watch": {
      "after": [
        "window_open"
      ],
      "tells": [],
      "seconds": 6
    },
    "read": {
      "after": [],
      "tells": [],
      "seconds": 4
    },
    "confess": {
      "after": [
        "read"
      ],
      "tells": [
        "confess:close"
      ],
      "seconds": 9
    },
    "door_opens": {
      "after": [
        "confess"
      ],
      "tells": [
        "door_opens:out"
      ],
      "seconds": 10
    },
    "hands": {
      "after": [
        "door_opens"
      ],
      "tells": [],
      "seconds": 4
    },
    "collapse": {
      "after": [
        "hands"
      ],
      "tells": [],
      "seconds": 8
    },
    "flee": {
      "after": [
        "collapse",
        "hands"
      ],
      "tells": [],
      "seconds": 7
    },
    "stay": {
      "after": [
        "collapse",
        "hands"
      ],
      "tells": [],
      "seconds": 9
    }
  },
  "points": [
    "floor#mid",
    "ripple@",
    "book@",
    "closeup#nar_hand",
    "closeup#rod_hand",
    "closeup#mad_hand",
    "closeup#stay"
  ],
  "offers": [
    "door",
    "window",
    "roderick"
  ],
  "party": {
    "crack": 0.1
  },
  "speakers": [
    "roderick"
  ]
}
```
