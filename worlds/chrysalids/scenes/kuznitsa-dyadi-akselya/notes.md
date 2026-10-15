КУЗНИЦА ДЯДИ АКСЕЛЯ (Хризалиды v3; III.1, III.5 `night_anne`, V.2 `key`), движок 3. Переписана с «кино-игры» (движок 1):
картины — один раз, в дневных цветах (дощатая стена, земляной пол, кирпичный горн, железо); свет — сцены: огонь горна
(`fire` — точечный свет у углей, по ключу fire; угли — светящийся слой, пламя, искры и дым — частицы), луна (`moon`, далёкий
свет справа сзади: двор за воротами в лунном свете — светлая щель, против которой Аксель стоит на колене), горячее железо
на наковальне (`iron_glow`), фонари в руках (`lantern`, `lantern2`, `lantern_w0/w1`), свечение в голове Дэвида (`glow`,
по dv_glow). Кровля (плоскость) держит луну снаружи: внутри — огонь. Фильм — модуль beats (lib.js FILM). Люди — каст мира:
axel (хромает — походка limp; молот в левой, клещи в правой — части каста), david (на бочке — david_on её верх), joseph,
farmhand (с фонарём), watch0/watch1 (man_a, man_c — ещё двое). Лошадь во дворе — модуль chrysalids (дремлет).

Молот: Аксель стоит там, где его удар (smith_strike) приходится на железо (lib.AT_ANVIL); боёк на железе — на 1.17 с
движения; в этот миг искры (частицы sparks из anvil#iron, по ax_spark) и `scene.tell('ax:hit')`. ax_blow (игра) — удар от
подъёма: его зовут за 1.17 с до доли. Пока инструментов нет в руках (axel_with), они лежат на наковальне (слои anvil).

КУСКИ (lib.FILM; `from` — всё состояние):
 chatter   Из темноты: Аксель куёт спиной к мальчику; Дэвид на бочке лицом к воротам «болтает» (dv_chat 7.2: мысль к далёкому
           окну Мортонов и ответ, смеётся).
 notice    Молот замирает наверху; Аксель кладёт инструменты, смотрит в ворота, на мальчика; хромает к нему, Дэвид сжимается;
           на колено против светлой щели ворот, камера подъезжает; рука на плечо; открытая ладонь «кто?» (выбор — на david).
 truth     (канон) Дэвид показывает на окно; мысль уходит, ответ приходит; кивает. Аксель — рука у бороды; взгляд на ворота.
 lie       Мотает головой, смотрит в пол; ответ приходит всё равно; глаза к окну; Аксель смотрит туда же; кивок.
 door      Встаёт; к воротам, смотрит в обе стороны; руки на край двери (door#grip_low/high), пятясь (limp_back) задвигает её.
 hush      На колено вплотную: палец у губ, палец у виска, руки на плечи, качает головой; Дэвид дважды кивает.
 lantern   (канон) Фонарь отца во дворе; Аксель к наковальне, куёт; Дэвид сникает; отец в щели, фонарь вверх; Аксель кивает; уходит.
 after     Аксель опускает молот, кивает мальчику; Дэвид «говорит» с окном; Аксель снова куёт (ax_pace 2.4), мысли раз в 13 с.
 lantern_bellows (III.1, после hush) Фонарь отца; Аксель к наковальне; Дэвид соскальзывает с бочки и бегом к рычагу мехов;
           камера на план мехов и наковальни (оба в середине кадра: CAM.bellows), стоит. Отец в щели, фонарь вверх, на Акселя,
           на мальчика. Дальше «Ритм мехов»: игра ведёт ax_blow и pump; метки — axel#hand_l (молот), pump#handle; промах —
           фонарь выше и на мальчика (st_lamp 1.3, st_lx/st_lz).
 lantern_go | lantern_linger  Отец опускает фонарь и уходит | фонарь выше, отец шагает в щель, долго смотрит, уходит.
 rest      Аксель опускает молот, смотрит на мальчика у мехов; медленный кивок; Дэвид кивает.
 night_anne Ночь, огонь низкий, дверь полузадвинута; Дэвид на бочке рассказывает, Аксель у верстака, рука у бороды.
 night_anne_end «Иди спать»: кивок; Дэвид соскальзывает с бочки и уходит в ночь; Аксель к огню.
 key       (V.2) Ночь; Аксель частыми ударами делает ключ (ax_pace 1.4); Дэвид у мехов (pump_work 1.3).
 stranger  Работник в щели поднимает фонарь, смотрит на наковальню, на мальчика.
 stranger_go | caught | strike  Уходит (ритм удержан) | свистит, ещё двое с фонарями; Дэвид мотает головой «не надо» |
           Дэвид кивает; Аксель к щели, удар: работник падает на спину во двор, фонарь гаснет; огонь оседает.

КЛЮЧИ: beat, fade, fire, sparks, door, pump; само по себе: ax_work, ax_pace, dv_chat, pump_work, dv_pump; игра: ax_blow
(момент ax:hit), pump, st_lamp, st_lx, st_lz; человек с фонарём: st_on, st_who, st_a/st_d, st_drop, st_glow, st_lanx,
st_more; мысли — th_amp, tho_*, thi_* (элементы thought_out, thought_in: слои, animate гасит их по пути); лошадь — hz_*.
Точки: pump#handle (мехи — свой элемент pump), anvil#iron, door#grip_low, door#grip_high, morton#window, forge#fire.

## Контракт для проверки

```json
{
  "beats": {
    "chatter": { "after": [], "tells": [], "seconds": 11 },
    "notice": { "after": ["chatter"], "tells": [], "seconds": 17 },
    "truth": { "after": ["notice"], "tells": ["truth:window", "truth:ask"], "seconds": 14 },
    "lie": { "after": ["notice"], "tells": ["lie:ask"], "seconds": 14 },
    "door": { "after": ["truth", "lie"], "tells": [], "seconds": 16 },
    "hush": { "after": ["door"], "tells": ["hush:finger"], "seconds": 16 },
    "lantern": { "after": ["hush"], "tells": [], "seconds": 16 },
    "after": { "after": ["lantern"], "tells": [], "seconds": 14 },
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
  "party": { "beat": null, "ax_blow": 0, "pump": 0, "fire": 0.75, "sparks": 0.5, "st_lamp": 0, "st_lx": -5, "st_lz": 8.4, "ax_work": 0, "pump_work": 0, "ax_pace": 2 },
  "speakers": ["david", "axel", "joseph", "farmhand"]
}
```
