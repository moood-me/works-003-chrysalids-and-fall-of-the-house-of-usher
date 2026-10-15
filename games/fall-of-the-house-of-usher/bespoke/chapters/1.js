// I. Приезд — the house at dusk: the player looks for the cause of the gloom and finds only the crack
// («Причина»); may look into the tarn. Roderick's room: the meeting, the room the player lives in his way
// or their own («Тише или светлее»), the portrait. The gallery: Madeline passes — ⚑ follow her (her
// catalepsy seen close, her one line, a promise) or stay with him. design.md, scenes.md (docs/usher).
// Leaves: choices.tarn, room, madeline, promise; marks.promise.
import { SCENES } from '../story.js';
import prichina from '../minigames/prichina.js';
import tishe from '../minigames/tishe.js';

const HOUSE = SCENES.house, ROOM = SCENES.room, GALLERY = SCENES.gallery;

// what the player finds, looking for the cause of the gloom: nothing (until the crack)
const LOOKS = {
  windows: 'Пустые окна. Дом большой, а живут в нём двое.',
  trees: 'Старые деревья. Мёртвые — только и всего.',
  tarn: 'Чёрная вода. Стоячий пруд.',
};
// Roderick's answer to each thing done in his room, his way or the narrator's
const ANSWERS = {
  his: { candles: 'Спасибо…', window: 'Да. Так лучше.', clock: 'Тишина. Благодарю тебя.' },
  mine: { candles: 'Не надо… Свет режет глаза.', window: 'Закрой! Ветер — он кричит.', clock: 'Каждый удар — как гвоздь.' },
};

export default {
  number: 'I',
  title: 'Приезд',
  titles: ['Дом над прудом', 'Родерик', 'Мэдлин проходит'],
  choices: [
    { id: 'tarn', weight: '~', title: 'Пруд', options: [{ id: 'looked', label: 'посмотреть в воду' }, { id: 'not', label: 'ехать к дому' }] },
    { id: 'room', weight: '~', title: 'Его комната', options: [{ id: 'his', label: 'по-его' }, { id: 'mine', label: 'по-своему' }] },
    { id: 'madeline', weight: '⚑', title: 'Мэдлин проходит', options: [{ id: 'follow', label: 'пойти за ней' }, { id: 'stay', label: 'остаться с ним' }] },
    { id: 'promise', weight: '~', title: 'Её просьба', options: [{ id: 'promised', label: '— Обещаю' }, { id: 'silent', label: 'промолчать' }] },
  ],
  steps: [
    // the house over the tarn at dusk: the gloom without a cause; the crack
    async g => {
      await g.scene(HOUSE, { beat: 'arrive' });
      g.sound.house(0.35, 6);
      await g.beat('arrive');
      await g.beat('look', { wait: false });
      await g.say('narrator', 'Не знаю отчего, но при первом взгляде на дом тоска овладела мной.');
      await g.play(prichina, {
        onLook: (which, n) => {
          g.sound.house(0.35 * (1 - n / 3), 3); // the gloom: the air goes silent, look by look
          return g.say('narrator', LOOKS[which]);
        },
      });
      await g.say('narrator', 'Едва заметная трещина. От крыши до самой воды.');
      g.gauge('crack');
      const tarn = await g.choose('tarn', {
        tarn: [{ id: 'looked', label: 'Посмотреть в воду' }],
        house: [{ id: 'not', label: 'Ехать к дому' }],
      });
      if (tarn === 'looked') {
        await g.beat('tarn');
        await g.say('narrator', 'В отражении, в верхнем окне, кто-то стоял. Я поднял глаза — окно было пустым.');
        g.scale('sanity', -1);
      }
      await g.beat('to_door');
    },
    // Roderick: the meeting; his room — his way or mine; the portrait
    async g => {
      await g.scene(ROOM, { beat: 'enter' });
      await g.beat('enter');
      // (said as his lips begin to move, in the close-up)
      const lips = g.told('meet:lips');
      const meet = g.beat('meet');
      await lips;
      await g.say('roderick', 'Ты приехал. Я думал — уже никто не приедет.', 'narrator');
      await meet;
      await g.say('narrator', 'Я едва узнал его. Лицо как у мертвеца, огромные светлые глаза, волосы — паутиной.');
      await g.beat('room');
      await g.say('roderick', 'Прости. Свет режет мне глаза. Каждый звук — как удар.');
      const done = { his: 0, mine: 0 };
      const room = await g.play(tishe, {
        onAct: async (kind, which) => {
          done[kind]++;
          g.scale('trust', kind === 'his' ? 1 : -1);
          await g.say('roderick', ANSWERS[kind][which]);
        },
      });
      g.state.choices.room = room.his >= room.mine ? 'his' : 'mine';
      // the room done his way: said before the portrait
      if (room.his >= 2) {
        await g.say('narrator', 'Я стал жить по его правилам. Так было проще — ему.');
        g.scale('sanity', -1);
      }
      // (he speaks once he stands before her, looking up: the scene tells it)
      const before = g.told('portrait:before');
      const portrait = g.beat('portrait');
      await before;
      await g.say('roderick', 'Мэдлин. Моя сестра. Мы близнецы.');
      await g.say('roderick', 'Она больна. Иногда застывает — как мёртвая. Потом приходит в себя.');
      await portrait;
    },
    // the gallery: Madeline passes; ⚑ follow her or stay with him
    async g => {
      await g.scene(GALLERY, { beat: 'pass' });
      await g.beat('pass');
      await g.beat('weep');
      const way = await g.choose('madeline', {
        madeline: [{ id: 'follow', label: 'Пойти за ней' }],
        roderick: [{ id: 'stay', label: 'Остаться с ним' }],
      });
      if (way === 'stay') {
        // (he speaks once his hands are down from his face: the scene tells it)
        const talks = g.told('stay:talk');
        const stay = g.beat('stay');
        await talks;
        await g.say('roderick', 'Мы всегда чувствовали друг друга. Когда ей больно — больно мне.');
        await g.say('roderick', 'Врачи не знают, что это. Однажды она застынет — и не очнётся.');
        await stay;
        g.scale('trust', 1);
        return;
      }
      g.scale('trust', -1); // (he saw his friend go after her)
      await g.beat('follow');
      // (said as she stops still mid-step)
      const still = g.told('freeze:still');
      const frozen = g.beat('freeze');
      await still;
      await g.say('narrator', 'Она застыла на полушаге. Не дышала. Глаза открыты.');
      await frozen;
      await g.beat('wake');
      g.set('speak', 1);
      await g.say('madeline', 'Когда я такая — я всё слышу. Не дай им меня закрыть.', 'narrator');
      g.set('speak', 0);
      await g.beat('look');
      const promise = await g.choose('promise', 'madeline', [{ id: 'promised', label: 'Обещаю' }, { id: 'silent', label: 'Промолчать' }]);
      if (promise === 'promised') {
        await g.say('narrator', 'Обещаю.');
        g.mark('promise', true, 'Мэдлин это запомнит.');
      }
      await g.beat('gone');
      await g.say('narrator', 'Больше я не видел её живой.');
    },
  ],
};
