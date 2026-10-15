КОРАБЛЬ ИЗ ЗЕЛАНДИИ (Хризалиды v3; VII), движок 3. Переписана с «кино-игры» (движок 1, куклы модуля chrysalids): люди
— каст (david — david_teen, rosalind, petra, michael на уступе; joseph, w1–w3 — люди Вакнука с ружьями, spider, sophie,
f2, f3 — Окраины с луками; sealand — женщина из Зеландии с распылителем); конь Джозефа — модуль chrysalids. Рассвет в дыму —
свет сцены (база светлая, взгляд dawn, низкое солнце слева). Корабль — жемчужная рыба (элемент ship: картина один раз,
шейдер ship.wgsl ведёт спираль по spin, нити под ним по fall, бусины на нитях; слои ног, двери, трапа); его отблеск вдали
и свет двери — свет сцены. Паутина: на поляне — плоскость webfield (шейдер: дальняя сторона раньше), в воздухе — частицы
gossamer (спрайт — нить с бусиной), на людях — коконы (элементы cocoon_<id>: стоя или лёжа), на детях у пещеры — cave_web.
Каждый на поляне застывает у своего порога (<id>_th, lib.TH; script.js: перед этим — рывок, flinch, потом still); распылитель
поднимает порог выше 1.5 — паутина отпускает. Выстрелы — частицы (вспышка и дымок у w<i>#muzzle по w<i>_fire). Земля
(relief.js): уступ у пещеры на метр выше поляны, спуск справа.

Режиссура: смерть Джозефа — одно действие на кадр (общий план: выстрел Паука, стрела, Джозеф падает — collapse — и лежит);
реакция Дэвида — отдельной склейкой (дети); в web_* — склейка сверху (OVER_THEM): видно, кто под кем; женщина ведёт Петру,
не оглядываясь, Дэвид оглядывается на поляну.

КУСКИ (lib.FILM; `from` — всё состояние): cave, fight (выбор «бежать к отцу» — на david), hold | run, ship (выбор «кого
заслонить» — на rosalind, petra или joseph), noship (если корабля нет), web | web_petra | web_rosalind (Дэвид на уступе) |
web_father | web_alone (Дэвид у отца), landing | landing_run, free | free_run, back | back_run (выбор «улететь или остаться» —
на ship и michael), board | stay_ros | stay_alone → stay_alone_away. free и free_run — всегда склейка (after пуст): стоят в таблице
сразу за своей посадкой — их начало модуль beats готовит заранее; board игра открывает своим шагом (с трапа). После паутины
joseph_th — ключ игры (web_father или партия): from кусков после неё его не пишут. Склейки внутри кусков сказаны заранее (lib.ahead). «кино»-кусок stay_alone (32 с) разделён по своей склейке:
stay_alone — Дэвид уходит наверх к Майклу, Розалинда входит за Петрой, оборачивается из света и исчезает; stay_alone_away —
корабль уходит, они на уступе смотрят вслед.

КЛЮЧИ: beat, fade, dawn, smoke, fight, fall, web, cave_web, spin, door, dust, ship_vis, ship_a/d/h, arrow_vis, arrow_a/d/h,
horse_a/d/face/toss, <id>_th, <id>_down, w<i>_fire. Убраны ключи кукол «кино» (<id>_p, _w_*, _hr/_hl, _hide, _dead…): это
теперь действия людей и ключи движка. Новые движения/части каста: aim_rifle, kneel_aim (ружьё — часть gun), sprayer.

## Контракт для проверки

```json
{
  "beats": {
    "cave": { "after": [], "tells": [], "seconds": 5 },
    "fight": { "after": ["cave"], "tells": ["fight:clearing"], "seconds": 14 },
    "hold": { "after": ["fight"], "tells": [], "seconds": 9 },
    "run": { "after": ["fight"], "tells": ["run:by"], "seconds": 12 },
    "ship": { "after": ["hold", "run"], "tells": ["ship:petra"], "seconds": 14 },
    "noship": { "after": ["hold", "run"], "tells": ["noship:sky", "noship:flee"], "seconds": 18 },
    "web": { "after": ["ship"], "tells": [], "seconds": 9 },
    "web_petra": { "after": ["ship"], "tells": [], "seconds": 9 },
    "web_rosalind": { "after": ["ship"], "tells": [], "seconds": 9 },
    "web_father": { "after": ["ship"], "tells": [], "seconds": 9 },
    "web_alone": { "after": ["ship"], "tells": [], "seconds": 9 },
    "landing": { "after": ["web", "web_petra", "web_rosalind"], "tells": ["landing:down"], "seconds": 13 },
    "landing_run": { "after": ["web_father", "web_alone"], "tells": ["landing_run:down"], "seconds": 13 },
    "free": { "after": [], "tells": ["free:petra"], "seconds": 12 },
    "free_run": { "after": [], "tells": ["free_run:petra"], "seconds": 11 },
    "back": { "after": ["free"], "tells": ["back:father"], "seconds": 22 },
    "back_run": { "after": ["free_run"], "tells": ["back_run:free"], "seconds": 21 },
    "board": { "after": [], "tells": ["board:look", "board:michael"], "seconds": 28 },
    "stay_ros": { "after": ["back", "back_run"], "tells": [], "seconds": 28 },
    "stay_alone": { "after": ["back", "back_run"], "tells": ["stay_alone:turn"], "seconds": 14 },
    "stay_alone_away": { "after": ["stay_alone"], "tells": [], "seconds": 18 }
  },
  "points": ["david", "rosalind", "petra", "joseph", "ship", "michael", "sealand", "ship#door"],
  "offers": ["david", "rosalind", "petra", "joseph", "ship", "michael"],
  "party": { "beat": null, "joseph_th": 0 },
  "speakers": ["david", "rosalind", "petra", "michael", "joseph", "sealand", "spider"]
}
```
