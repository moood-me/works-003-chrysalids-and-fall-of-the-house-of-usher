// II. Дни — her name is not spoken; the guitar: go with his frenzy or hold him («Струна»), the ballad;
// the doctor in the gallery: ⚑ tell him of her fits or keep silent, and ⚑ his carriage — the first
// chance to leave; the walk out of the house («За руку»): his breath, his fear, the house alive — on to
// the shore or back. «Её больше нет». design.md, scenes.md (docs/usher).
// Reads: nothing. Leaves: choices.struna, doctor, carriage, walk; marks.doctor (he was told).
import { SCENES } from '../story.js';
import struna from '../minigames/struna.js';
import zaRuku from '../minigames/za-ruku.js';

const HOUSE = SCENES.house, ROOM = SCENES.room, GALLERY = SCENES.gallery;

export default {
  number: 'II',
  title: 'Дни',
  titles: ['Гитара', 'Врач', 'Прогулка', 'Вечер'],
  choices: [
    { id: 'struna', weight: '~', title: 'Его музыка', options: [{ id: 'follow', label: 'за ним' }, { id: 'steady', label: 'свой ритм' }] },
    { id: 'doctor', weight: '⚑', title: 'Врач', options: [{ id: 'told', label: 'рассказать' }, { id: 'silent', label: 'промолчать' }] },
    { id: 'carriage', weight: '⚑', ends: true, title: 'Коляска врача', options: [{ id: 'stay', label: 'остаться' }, { id: 'left', label: 'уехать' }] },
    { id: 'walk', weight: '~', title: 'Прогулка', options: [{ id: 'shore', label: 'до берега' }, { id: 'back', label: 'назад' }] },
  ],
  steps: [
    // the guitar: his frenzy — with him or against it; the ballad
    async g => {
      await g.scene(ROOM, { beat: 'turn_away' });
      const away = g.beat('turn_away');
      await g.say('narrator', 'Несколько дней её имя не произносили.');
      await g.say('roderick', 'Не говори о ней. Прошу.');
      await away;
      await g.beat('dusk');
      const song = g.beat('guitar');
      const tune = g.sound.melody({ as: 'guitar', tempo: 0.8, loud: 0.5 });
      await g.say('roderick', 'Её песня. Она пела её, когда мы были детьми.');
      await song;
      tune.stop();
      const { follow } = await g.play(struna, {});
      if (follow >= 0.5) {
        g.state.choices.struna = 'follow';
        g.scale('trust', 1);
        g.scale('sanity', -1);
      } else {
        g.state.choices.struna = 'steady';
        g.scale('trust', -1);
      }
      const ballad = g.beat('ballad');
      await g.say('narrator', 'Потом он запел. О дворце, в который однажды вошло безумие.');
      await ballad;
      await g.say('narrator', 'Он пел о себе.');
      await g.beat('guitar_down');
    },
    // the doctor: ⚑ tell him or keep silent; his carriage
    async g => {
      await g.scene(GALLERY, { beat: 'doctor' });
      const doctor = g.beat('doctor');
      await g.say('narrator', 'В галерее меня остановил их врач.');
      await doctor;
      g.set('speak', 1);
      await g.say('doctor', 'Любопытнейший случай. Когда она… я бы хотел её изучить.', 'narrator');
      g.set('speak', 0);
      await g.beat('beside');
      const told = await g.choose('doctor', 'doctor', [{ id: 'told', label: 'Рассказать' }, { id: 'silent', label: 'Промолчать' }]);
      if (told === 'told') {
        await g.say('narrator', 'Я рассказал ему, как она застывает.');
        await g.say('doctor', 'Каталепсия… Восхитительно.');
        g.mark('doctor', true);
      } else g.scale('crack', 1);
      await g.say('doctor', 'Утром я уезжаю. В коляске есть место.');
      const go = await g.choose('carriage', 'doctor', [{ id: 'stay', label: 'Остаться' }, { id: 'left', label: 'Уехать с ним' }]);
      if (go === 'left') {
        const sure = await g.choose(null, 'doctor', [{ id: 'yes', label: 'Уехать' }, { id: 'no', label: 'Нет. Остаться' }]);
        if (sure === 'yes') {
          await g.say('narrator', 'Уехать — и оставить его одного.');
          await g.beat('leave_with');
          g.end('left');
          return;
        }
        g.state.choices.carriage = 'stay';
      }
      await g.beat('doctor_leaves');
    },
    // the walk: out of the house, by the hand; his breath; ~ on to the shore or back
    async g => {
      // (said as the door opens)
      const door = g.told('walk_out:door');
      await g.scene(HOUSE, { beat: 'walk_out' });
      const out = g.beat('walk_out');
      await door;
      await g.say('narrator', 'Он не выходил из дома много лет. Я вывел его за руку.');
      await out;
      await g.beat('walk');
      await g.play(zaRuku, {});
      // (said in the close-up of his breath)
      const close = g.told('breathe:close');
      const breathe = g.beat('breathe');
      await close;
      await g.say('roderick', 'Я забыл, как пахнет воздух.', 'narrator');
      await breathe;
      await g.say('roderick', 'Я погибну. Не от беды — от страха перед ней.');
      await g.say('roderick', 'Этот дом живой. Камни, пруд. Они сделали нас такими.');
      const walk = await g.choose('walk', 'roderick', [{ id: 'shore', label: 'К берегу' }, { id: 'back', label: 'Назад' }]);
      if (walk === 'shore') {
        await g.say('narrator', 'Я повёл его дальше, к берегу.');
        await g.beat('to_shore');
        await g.say('narrator', 'У самого берега он упал на колени и зажал уши.');
        g.scale('trust', -1);
        g.scale('sanity', 1);
      } else {
        await g.say('narrator', 'Я повернул назад.');
        await g.beat('turn_back');
        g.scale('trust', 1);
        g.scale('sanity', -1);
      }
    },
    // the evening: «Её больше нет»
    async g => {
      // (said as his lips begin to move, in the close-up)
      const lips = g.told('news:lips');
      await g.scene(ROOM, { beat: 'news' });
      const news = g.beat('news');
      await lips;
      await g.say('roderick', 'Её больше нет.', 'narrator');
      await news;
    },
  ],
};
