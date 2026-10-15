БЕГСТВО (Хризалиды v3; V.4), движок 3. Переписана с «кино-игры» (движок 1, куклы модуля chrysalids, камера panorama):
камера picture (кадры режиссёра — ходы camera_x/z); люди — каст (rosalind в седле великого коня, petra, david — облик
david_teen, searcher — облик rider, searcher2 — man_b, с фонарями); кони — модуль chrysalids движка 3 (great — великий с
корзинами, pack — вьючный, sheba — Шеба, horse1/horse2 — кони верховых). Ночь к заре — свет сцены (база — светлая синяя
ночь, взгляды dawn и mist), слои неба; фонари облавы — свечения на дальней гряде (pursuers), фонари верховых — свет у их
рук, пятно фонаря на тумане лощины — свет lamp_spot (по lamp_x, lamp). Туман — слои с дрейфом (fog — в лощине, mist —
в низинах). Земля (relief.js, lib.ground): дорога по гребню на 9 м, за плечом гряды (x > 2.2) — вниз в лощину (на 1.75 м
под гребнем: над плечом видны головы коня и плечи седоков), дальше вниз совсем; карточка shoulder (8.85 м) прячет то, что
ушло за плечо.

Кто где сидит: Розалинда — в седле великого коня (great#seat; ступни и руки — его тека, script.js держит их при поворотах),
Петра — в ближней корзине (great#basket_r; petra_peek — насколько выглядывает), Дэвид — в дальней (great#basket_l) после
climb; в начале Дэвид в седле Шебы, Петра перед ним (точка в системе Шебы: chrysalids.horse.spot).

КУСКИ (lib.FILM; `from` — всё состояние):
 arrive       Затемнение расходится; на гребне великий конь, Розалинда в седле смотрит на дорогу; снизу рысью Шеба с
              Дэвидом и Петрой, встаёт у великого коня; наезд.
 arrive_alone (игра) Петра уже в корзине; Дэвид прискакал на Шебе один; Петра поднимается навстречу; он соскальзывает.
 handover     Дэвид слезает (dismount), поднимает Петру (lift_into), Розалинда принимает её в корзину; Петра выглядывает.
 sheba_turn   Он разворачивает Шебу к дому и кладёт руку ей на шею (выбор игры — на david: отпустить или взять).
 sheba_go     Замах, шлепок по крупу; Шеба уходит одна; он смотрит вслед, отворачивается (turn_away).
 sheba_keep   (игра) Ведёт Шебу назад и привязывает повод к вьючному (sheba_led: до конца сцены на верёвке); возвращается.
 climb        Розалинда тянет его за руку, он поднимается (mount) в дальнюю корзину.
 bow          Розалинда вперёд, потом назад на фонари, берёт лук и натягивает (draw_bow) — в профиль на светлом небе;
              Дэвид оборачивается; Петра прячется.
 go           Кони трогаются, через плечо гряды вниз, в туман лощины и прочь, рысью; камера ведёт вправо и возвращается на
              пустой гребень.
 search       (канон: конец) На пустой гребень поднимаются двое верховых с фонарями, передний поднимает фонарь, всматривается.
 hollow       (игра) Через плечо в лощину и стоп в тумане; камера отъезжает — лощина и гребень над ней.
 watch        (игра) На гребень поднимаются двое верховых, передний светит в туман. Камера стоит: «Тише, кони» — метки
              great#head, pack#head, sheba#head (если взята), petra (если свободна); игра двигает great_toss, pack_toss,
              sheba_toss, petra_peek, lamp, lamp_x, search_point.
 spotted      Увидели: передний показывает в лощину, второй скачет за остальными, передний — к краю лощины.
 stay         Не увидели: второй уезжает за остальными, передний стережёт дорогу, фонарь ниже.
 kill         Розалинда стреляет: стрела (arrow) в переднего; он слетает с седла (fall_back) и лежит (lie_back); конь
              уходит за гребень. (Выбор «Стреляй…» — на searcher.)
 warn         Стрела над головой; конь на дыбах (h1_toss); всадник разворачивает его и уходит галопом.
 hide         Туман густеет, Петра прячется; всадник едет по краю, светит в туман прямо над ними, уезжает.
 away         (после kill | warn | hide) Дальше, вниз из лощины; светает.

КЛЮЧИ: beat, fade, dawn, mist, fog, pursuers; кони — great_*, pack_*, sheba_* (_a, _d, _face, _toss), h1_*, h2_* (+ _here),
sheba_here, sheba_led; игра — great_toss, pack_toss, sheba_toss, petra_peek, lamp, lamp_x, search_point; arrow, arrow_high.
Убраны ключи кукол «кино» (gx, david_down, david_climb, ros_bow, fallen…): это теперь действия людей и места коней.

## Контракт для проверки

```json
{
  "beats": {
    "arrive": { "after": [], "tells": [], "seconds": 12 },
    "arrive_alone": { "after": [], "tells": [], "seconds": 13 },
    "handover": { "after": ["arrive"], "tells": [], "seconds": 9 },
    "sheba_turn": { "after": ["handover", "arrive_alone"], "tells": [], "seconds": 4 },
    "sheba_go": { "after": ["sheba_turn"], "tells": ["sheba_go:gone"], "seconds": 8 },
    "sheba_keep": { "after": ["sheba_turn"], "tells": [], "seconds": 16 },
    "climb": { "after": ["sheba_go", "sheba_keep"], "tells": [], "seconds": 7 },
    "bow": { "after": ["climb"], "tells": [], "seconds": 7 },
    "go": { "after": ["bow"], "tells": [], "seconds": 20, "show": false },
    "search": { "after": ["go"], "tells": [], "seconds": 14, "show": false },
    "hollow": { "after": ["bow"], "tells": ["hollow:fog"], "seconds": 11 },
    "watch": { "after": ["hollow"], "tells": ["watch:riders"], "seconds": 13 },
    "spotted": { "after": ["watch"], "tells": [], "seconds": 6 },
    "stay": { "after": ["watch"], "tells": [], "seconds": 9 },
    "kill": { "after": ["spotted", "stay"], "tells": ["kill:shot"], "seconds": 7 },
    "warn": { "after": ["spotted", "stay"], "tells": ["warn:shot"], "seconds": 7 },
    "hide": { "after": ["spotted", "stay"], "tells": [], "seconds": 16 },
    "away": { "after": ["kill", "warn", "hide"], "tells": [], "seconds": 12 }
  },
  "points": ["great#head", "pack#head", "sheba#head", "petra", "david", "searcher", "rosalind"],
  "offers": ["david", "searcher"],
  "party": { "beat": null, "great_toss": 0, "pack_toss": 0, "sheba_toss": 0, "petra_peek": 0, "lamp": 0, "lamp_x": 6, "search_point": 0 },
  "speakers": ["david", "rosalind", "petra", "searcher"]
}
```
