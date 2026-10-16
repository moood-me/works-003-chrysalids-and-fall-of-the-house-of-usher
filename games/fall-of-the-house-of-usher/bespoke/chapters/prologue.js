// Prologue — the end first: under the red moon the house splits and goes down into the tarn; no words,
// only the title. Then, on the dark, his letter: the player unfolds it, reads, folds it again. The
// letter stays with the player: the ending «Left» comes back to it (LETTER).

import { SCENES } from '../story.js';

const FALL = SCENES.fall;
export const LETTER = {
  text: tr('My friend,\nI am ill in body, and more grievously still in mind: a malady that has no name oppresses me. The house has grown too still, and I hear all things in it.\nYou are my only friend.\nCome. Your society alone may yet bring me some alleviation. Do not delay.'),
  highlight: tr('You are my only friend.'),
  sign: tr('Roderick Usher'),
};

export default {
  number: '',
  title: tr('Prologue'),
  titles: ['The fall of the house. The letter'],
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
      await g.title(tr('The Fall of the House of Usher'));
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
