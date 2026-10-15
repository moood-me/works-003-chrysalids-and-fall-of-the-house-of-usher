// Пролог — the end first: under the red moon the house splits and goes down into the tarn; no words,
// only the title. Then, on the dark, his letter: the player unfolds it, reads, folds it again. The
// letter stays with the player: the ending «Уехал» comes back to it (LETTER).

import { SCENES } from '../story.js';

const FALL = SCENES.fall;
export const LETTER = {
  text: 'Друг мой,\nя болен телом, и ещё тяжелее — душой: меня гнетёт недуг, которому нет имени. Дом стал слишком тих, и я слышу в нём всё.\nТы — единственный мой друг.\nПриезжай. Одно твоё общество ещё может меня утешить. Не медли.',
  highlight: 'Ты — единственный мой друг.',
  sign: 'Родерик Ашер',
};

export default {
  number: '',
  title: 'Пролог',
  titles: ['Падение дома. Письмо'],
  choices: [],
  steps: [
    async g => {
      // the roar as the house splits (the scene tells the fissure opening)
      g.told('prologue:split').then(split => split && g.sound.crash());
      await g.scene(FALL, { beat: 'prologue' });
      g.sound.rain(0.6, 3);
      g.sound.thunder(0.3);
      await g.beat('prologue');
      await g.wait(800);
      await g.title('Падение дома Ашеров');
      // the dark; and his letter
      g.sound.rain(0.2, 5);
      g.set('fade', 0.94, 4);
      await g.wait(4500);
      await g.letter(LETTER);
      g.sound.rain(0, 4);
      await g.wait(1500);
    },
  ],
};
