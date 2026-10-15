// Эпилог — the ending the play came to (g.state.ending, set by chapter IV or by leaving), then the
// crack of the whole play (game.js). Each ending is a beat of «Падение дома» and the narrator's words
// over it; «Мэдлин» — her song hummed by the water; «Уехал» comes back to his letter (LETTER of the
// prologue). design.md (docs/usher): «Концовки».
import { LETTER } from './prologue.js';
import { SCENES } from '../story.js';

const FALL = SCENES.fall;
// the endings, as the crack of the whole play names them; beat — the scene's beat that shows it; lines — what the
// narrator says over it, each [when, words]: when the scene tells a moment of the beat (its name), or once the beat has
// ended ('end') — in order, each after the one before
const END = 'end';
const ENDINGS = [
  // (the tarn closing over the house)
  { id: 'poe', label: 'Как у По', beat: 'end_alone', lines: [['end_alone:under', 'Глубокий тёмный пруд у моих ног угрюмо и безмолвно сомкнулся над обломками дома Ашеров.']] },
  // (she at the very water; then, the house gone, his hand let down)
  { id: 'madeline', label: 'Мэдлин', beat: 'end_madeline', lines: [['end_madeline:water', 'Она жива. Она не говорит ни слова. Стоит у воды и напевает свою песню.'], [END, 'Не знаю, спас ли я её.']] },
  // (he on his knees at the water; the narrator come up behind him)
  { id: 'roderick', label: 'Родерик', beat: 'end_roderick', lines: [['end_roderick:behind', 'Он жив. О ней он не говорит. Сидит у воды — и всё ещё слушает.']] },
  // (the narrator's eyes on their hands)
  { id: 'both', label: 'Оба', beat: 'end_both', lines: [['end_both:hands', 'Дом ушёл под воду. А то, что вышло из него вместе с ними, не ушло.']] },
  { id: 'stayed', label: 'Остался', beat: 'end_stayed', lines: [['end_stayed:under', 'Пруд сомкнулся над домом Ашеров. Над ними. И надо мной.']] },
  // (the empty tarn in the morning, once it is all there)
  { id: 'left', label: 'Уехал', beat: 'gone', lines: [['gone:morning', 'Через месяц пришло письмо: дома Ашеров больше нет. Он ушёл в пруд в ночь бури.'], [END, 'Я перечитал его письмо.']] },
];

export default {
  number: '',
  title: 'Эпилог',
  titles: ['Концовка'],
  choices: [],
  endings: ENDINGS,
  steps: [
    // (gone to by the author, the play has no ending: nothing to show)
    async g => {
      const ending = ENDINGS.find(e => e.id === g.state.ending);
      if (!ending) return;
      // (the moments of the scene, listened for before it opens)
      const cues = ending.lines.map(([at]) => (at === END ? null : g.told(at)));
      await g.scene(FALL, { beat: ending.beat });
      const film = g.beat(ending.beat);
      const song = ending.id === 'madeline' ? g.sound.melody({ as: 'hum', tempo: 0.85, loud: 0.45 }) : null;
      g.signal.addEventListener('abort', () => song?.stop(0.5));
      for (const [i, [, line]] of ending.lines.entries()) {
        await (cues[i] ?? film);
        await g.say('narrator', line);
      }
      await film;
      song?.stop(4);
      if (ending.id === 'left') await g.letter(LETTER);
    },
  ],
};
