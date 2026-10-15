// III. Склеп — his plan (two weeks in the vault); the vault: her blush and smile, a touch or the mirror,
// ⚑ what the narrator says at the coffin, ⚑ the screws («Винты»), her side of it (from inside), the iron
// door; the nights: «Слушать» (the lower the sanity, the clearer she is), ⚑ go down and knock («Стук»),
// go to him, or call it the wind; ⚑ the morning — the last chance to leave. design.md, scenes.md.
// Reads: marks.doctor, marks.promise. Leaves: choices.check, coffin, screws, night, morning; heard.said,
// insisted, loose, knocked; marks.loose (the screws stayed loose), marks.key (he told of the key).
import { SCALES, SCENES } from '../story.js';
import vinty from '../minigames/vinty.js';
import stuk from '../minigames/stuk.js';
import slushat from '../minigames/slushat.js';

const HOUSE = SCENES.house, ROOM = SCENES.room, VAULT = SCENES.vault, NIGHT = SCENES.storm;

export default {
  number: 'III',
  title: 'Склеп',
  titles: ['Две недели', 'Склеп', 'Ночи', 'Утро'],
  choices: [
    { id: 'check', weight: '~', title: 'У гроба', options: [{ id: 'touch', label: 'коснуться руки' }, { id: 'mirror', label: 'зеркальце' }, { id: 'none', label: 'не трогать' }] },
    { id: 'coffin', weight: '⚑', title: 'Крышка', options: [{ id: 'said', label: '«она может быть жива»' }, { id: 'insisted', label: '«не закрывай»' }, { id: 'silent', label: 'промолчать' }] },
    { id: 'screws', weight: '⚑', title: 'Винты', options: [{ id: 'tight', label: 'завинтить' }, { id: 'loose', label: 'оставить слабо' }] },
    { id: 'night', weight: '⚑', title: 'Звук снизу', options: [{ id: 'down', label: 'спуститься' }, { id: 'told', label: 'сказать ему' }, { id: 'wind', label: '«это ветер»' }] },
    { id: 'morning', weight: '⚑', ends: true, title: 'Утро', options: [{ id: 'stay', label: 'остаться' }, { id: 'left', label: 'уехать' }] },
  ],
  steps: [
    // his plan: two weeks in the vault
    async g => {
      // (he walks, then talks: his lines once he stands at the table talking — the beat's end)
      await g.scene(ROOM, { beat: 'plan' });
      await g.beat('plan');
      await g.say('roderick', 'Две недели она пробудет внизу, в подвале. Врачи слишком любопытны. И до кладбища далеко.');
      if (g.state.marks.doctor) {
        await g.say('roderick', 'Ты говорил с ним. Он приедет за ней. Значит — сегодня.');
        g.scale('trust', -1);
      }
    },
    // the vault: her face; ⚑ the lid; the screws; from inside; the iron door
    async g => {
      await g.scene(VAULT, { beat: 'enter' });
      await g.beat('enter');
      // (said over her face, close: the scene tells the cut)
      const face = g.told('open:face');
      const open = g.beat('open');
      await face;
      await g.say('narrator', 'Румянец на щеках. На груди. И улыбка — та, что так страшна у мёртвых.', 'narrator');
      await open;
      const check = await g.choose('check', {
        madeline: [{ id: 'touch', label: 'Коснуться руки' }, { id: 'mirror', label: 'Зеркальце к губам' }],
        roderick: [{ id: 'none', label: 'Не трогать' }],
      });
      if (check === 'touch') {
        // (said as his hand goes to hers)
        const hand = g.told('touch:hand');
        const touch = g.beat('touch');
        await hand;
        await g.say('narrator', 'Рука была тёплой.', 'narrator');
        await touch;
      }
      if (check === 'mirror') {
        // (said as the mirror goes to her lips)
        const up = g.told('mirror:up');
        const mirror = g.beat('mirror');
        await up;
        await g.say('narrator', 'Зеркальце осталось чистым.', 'narrator');
        await mirror;
      }
      await g.say('narrator', 'Так бывает при её болезни. Она может быть жива. Узнать наверняка нельзя.');
      await g.say('roderick', 'Мы близнецы. Я бы почувствовал.');
      const lid = await g.choose('coffin', 'roderick', [
        { id: 'said', label: 'Может быть жива' },
        { id: 'insisted', label: 'Не закрывай' },
        { id: 'silent', label: 'Промолчать' },
      ]);
      // (where the lid goes next: the screws, or — he shut it himself, hard — straight to her side of it: its cut made
      // ready ahead)
      g.set('beat_next', lid === 'insisted' ? 'inside' : 'screws');
      if (lid === 'said') {
        await g.say('narrator', 'Она может быть жива.');
        g.overheard('said');
        const turn = g.beat('say');
        await g.say('roderick', 'Я знаю. Я боюсь этого больше, чем её смерти.');
        await turn;
        await g.beat('shut');
      } else if (lid === 'insisted') {
        await g.say('narrator', 'Подожди. Не закрывай.');
        g.overheard('insisted');
        const shut = g.beat('insist');
        await g.say('roderick', 'Это мой дом.');
        await shut;
        g.scale('trust', -2);
      } else {
        g.scale('crack', check === 'none' ? 1 : 2); // knowing makes the silence dearer
        await g.beat('close');
      }
      if (lid !== 'insisted') {
        if (lid === 'said') await g.say('roderick', 'Винты. Помоги мне.');
        await g.beat('screws');
        g.set('beat_next', 'inside');
        const { loose } = await g.play(vinty, { promised: !!g.state.marks.promise });
        g.state.choices.screws = loose.length ? 'loose' : 'tight';
        if (loose.length) {
          g.overheard('loose');
          if (g.state.scales.trust <= 0) {
            const check = g.beat('check');
            await g.say('narrator', 'Он проверил винты. И дотянул их сам.');
            await check;
            g.scale('trust', -1);
          } else g.mark('loose', true);
        }
      }
      // from inside: the line of light, the screw tips coming through the wood as the driver turns them — each turn heard
      // as it comes (the scene moves `tip` on, a turn at a time)
      g.watch('tip', (v, old) => { if (v > (old ?? 0)) g.sound.screw(0.6); });
      await g.beat('inside');
      g.set('beat_next', null);
      await g.beat('leave');
      await g.choose(null, 'door', [{ id: 'close', label: 'Закрыть дверь' }]);
      g.sound.ironDoor(true);
      await g.beat('door_close');
    },
    // the nights: the sound from below; ⚑ go down, go to him, or the wind
    async g => {
      await g.scene(NIGHT, { beat: 'night' });
      g.sound.rain(0.3, 4);
      await g.beat('night');
      await g.say('narrator', 'Прошло несколько дней. Он бродил по дому ночами. Я не мог уснуть.');
      const { heard } = await g.play(slushat, { clarity: 1 - g.state.scales.sanity / SCALES.sanity.max });
      g.sound.house(0.15, 3);
      if (heard === 'melody') await g.say('narrator', 'Снизу, сквозь камень, — её песня. Раньше я бы этого не услышал.');
      else await g.say('narrator', 'Снизу — едва слышно — будто царапали дерево.');
      const lamp = g.beat('lamp_pass');
      await g.say('narrator', 'Под дверью прошёл свет лампы. Остановился. Ушёл.');
      await lamp;
      const night = await g.choose('night', {
        door: [{ id: 'down', label: 'Спуститься в склеп' }, { id: 'told', label: 'Пойти к нему' }],
        window: [{ id: 'wind', label: 'Это ветер' }],
      });
      if (night === 'wind') {
        await g.say('narrator', 'Это ветер. Только ветер.');
        g.scale('crack', 1);
        return;
      }
      if (night === 'told') {
        // (said as he comes to stand beside him)
        const beside = g.told('night_listen:beside');
        await g.scene(ROOM, { beat: 'night_listen' });
        const listen = g.beat('night_listen');
        await beside;
        await g.say('narrator', 'Я нашёл его в темноте, у стены.');
        await listen;
        await g.say('roderick', 'Ты тоже слышишь?');
        await g.say('narrator', 'Мы стояли и слушали. Вместе.');
        g.scale('trust', 1);
        return;
      }
      await g.scene(VAULT, { beat: 'at_door' });
      await g.beat('at_door');
      await g.play(stuk, {});
      g.overheard('knocked');
      await g.say('narrator', 'Оттуда ответили.');
      await g.say('narrator', 'Утром я попросил у него ключ.');
      await g.say('roderick', 'Я бросил ключ в пруд. Иначе я бы открыл — и увидел её глаза.', 'narrator');
      g.mark('key', true);
      g.scale('trust', -1);
    },
    // the morning: his horse saddled — ⚑ the last chance to leave
    async g => {
      // (said as the horse tosses its head)
      const toss = g.told('morning:toss');
      await g.scene(HOUSE, { beat: 'morning' });
      const morning0 = g.beat('morning');
      await toss;
      await g.say('narrator', 'Утром мой конь стоял осёдланный. Ещё можно было уехать.');
      await morning0;
      const morning = await g.choose('morning', {
        'rider#saddle': [{ id: 'left', label: 'Уехать' }],
        house: [{ id: 'stay', label: 'Остаться' }],
      });
      if (morning === 'left') {
        await g.beat('ride_away');
        g.end('left');
      }
    },
  ],
};
