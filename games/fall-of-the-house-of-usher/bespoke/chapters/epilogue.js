// Epilogue — the ending the play came to (g.state.ending, set by chapter IV or by leaving), then the
// crack of the whole play (game.js). Each ending is a beat of «The fall of the house» and the narrator's words
// over it; «Madeline» — her song hummed by the water; «Left» comes back to his letter (LETTER of the
// prologue). design.md (docs/usher): the endings.
import { LETTER } from './prologue.js';
import { SCENES } from '../story.js';

const FALL = SCENES.fall;
// the endings, as the crack of the whole play names them; beat — the scene's beat that shows it; lines — what the
// narrator says over it, each [when, words]: when the scene tells a moment of the beat (its name), or once the beat has
// ended ('end') — in order, each after the one before
const END = 'end';
const ENDINGS = [
  // (the tarn closing over the house)
  { id: 'poe', label: tr('As in Poe'), beat: 'end_alone', lines: [['end_alone:under', tr.line('narrator', 'The deep and dank tarn at my feet closed sullenly and silently over the fragments of the House of Usher.')]] },
  // (she at the very water; then, the house gone, his hand let down)
  { id: 'madeline', label: tr('Madeline'), beat: 'end_madeline', lines: [['end_madeline:water', tr.line('narrator', 'She lives. She speaks no word. She stands by the water, and hums her song.')], [END, tr.line('narrator', 'I know not whether I saved her.')]] },
  // (he on his knees at the water; the narrator come up behind him)
  { id: 'roderick', label: tr('Roderick'), beat: 'end_roderick', lines: [['end_roderick:behind', tr.line('narrator', 'He lives. Of her he does not speak. He sits by the water — and listens still.')]] },
  // (the narrator's eyes on their hands)
  { id: 'both', label: tr('Both'), beat: 'end_both', lines: [['end_both:hands', tr.line('narrator', 'The house went down beneath the water. But that which came out of it with them — did not.')]] },
  { id: 'stayed', label: tr('Stayed'), beat: 'end_stayed', lines: [['end_stayed:under', tr.line('narrator', 'The tarn closed over the House of Usher. Over them. And over me.')]] },
  // (the empty tarn in the morning, once it is all there)
  { id: 'left', label: tr('Left'), beat: 'gone', lines: [['gone:morning', tr.line('narrator', 'A month later there came a letter: the House of Usher was no more. It had gone down into the tarn on the night of the storm.')], [END, tr.line('narrator', 'I read his letter once again.')]] },
];

export default {
  number: '',
  title: tr('Epilogue'),
  titles: [tr('Ending')],
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
