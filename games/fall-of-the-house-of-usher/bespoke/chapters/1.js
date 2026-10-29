// I. The arrival — the house at dusk: the player looks for the cause of the gloom and finds only the crack
// («Cause»); may look into the tarn. Roderick's room: the meeting, the room the player lives in his way
// or their own («Quieter or brighter»), the portrait. The gallery: Madeline passes — ⚑ follow her (her
// catalepsy seen close, her one line, a promise) or stay with him. design.md, scenes.md (docs/usher).
// Leaves: choices.tarn, room, madeline, promise; marks.promise.
import { SCENES } from '../story.js';
import cause from '../minigames/cause.js';
import quieter from '../minigames/quieter.js';

const HOUSE = SCENES.house, ROOM = SCENES.room, GALLERY = SCENES.gallery;

// what the player finds, looking for the cause of the gloom: nothing (until the crack)
const LOOKS = {
  windows: tr.line('narrator', 'Vacant, eye-like windows. So vast a house — and but two to dwell in it.'),
  trees: tr.line('narrator', 'Old trees. Dead ones — nothing more.'),
  tarn: tr.line('narrator', 'Black water. A still and silent tarn.'),
};
// Roderick's answer to each thing done in his room, his way or the narrator's
const ANSWERS = {
  his: { candles: tr.line('roderick', 'I thank you…'), window: tr.line('roderick', 'Yes. It is better so.'), clock: tr.line('roderick', 'Silence. I thank you.') },
  mine: { candles: tr.line('roderick', 'Do not… The light is torture to my eyes.'), window: tr.line('roderick', 'Shut it! The wind — it shrieks.'), clock: tr.line('roderick', 'Each stroke — like a nail.') },
};

export default {
  number: 'I',
  title: tr('The arrival'),
  titles: ['The house above the tarn', 'Roderick', 'Madeline passes'],
  choices: [
    { id: 'tarn', weight: '~', title: tr('The tarn'), options: [{ id: 'looked', label: tr('into the water') }, { id: 'not', label: tr('ride on') }] },
    { id: 'room', weight: '~', title: tr('His chamber'), options: [{ id: 'his', label: tr('his way') }, { id: 'mine', label: tr('my way') }] },
    { id: 'madeline', weight: '⚑', title: tr('Madeline passes'), options: [{ id: 'follow', label: tr('follow her') }, { id: 'stay', label: tr('stay with him') }] },
    { id: 'promise', weight: '~', title: tr('Her plea'), options: [{ id: 'promised', label: tr('— I promise') }, { id: 'silent', label: tr('say nothing') }] },
  ],
  steps: [
    // the house over the tarn at dusk: the gloom without a cause; the crack
    async g => {
      await g.scene(HOUSE, { beat: 'arrive' }, { beds: { house: 0.35 } });
      await g.beat('arrive');
      await g.beat('look', { wait: false });
      await g.say('narrator', 'I know not how it was — but, with the first glimpse of the building, a sense of insufferable gloom pervaded my spirit.');
      await g.play(cause, {
        onLook: (which, n) => {
          g.beds({ house: 0.35 * (1 - n / 3) }); // the gloom: the air goes silent, look by look
          return g.say('narrator', LOOKS[which]);
        },
      });
      await g.say('narrator', 'A barely perceptible fissure. From the roof down to the very water.');
      g.gauge('crack');
      const tarn = await g.choose('tarn', {
        tarn: [{ id: 'looked', label: tr('Into the water') }],
        house: [{ id: 'not', label: tr('Ride on') }],
      });
      if (tarn === 'looked') {
        await g.beat('tarn');
        await g.say('narrator', 'In the reflection, at an upper window, someone stood. I raised my eyes — the window was vacant.');
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
      await g.say('roderick', 'You have come. I had thought that no one would come again.', 'narrator');
      await meet;
      await g.say('narrator', 'I scarcely knew him. A cadaverousness of complexion, an eye large and luminous, hair of a more than web-like softness.');
      await g.beat('room');
      await g.say('roderick', 'Forgive me. The light is torture to my eyes. Every sound — a blow.');
      const done = { his: 0, mine: 0 };
      const room = await g.play(quieter, {
        onAct: async (kind, which) => {
          done[kind]++;
          g.scale('trust', kind === 'his' ? 1 : -1);
          await g.say('roderick', ANSWERS[kind][which]);
        },
      });
      g.state.choices.room = room.his >= room.mine ? 'his' : 'mine';
      // the room done his way: said before the portrait
      if (room.his >= 2) {
        await g.say('narrator', 'I came to live by his rules. It was easier so — for him.');
        g.scale('sanity', -1);
      }
      // (he speaks once he stands before her, looking up: the scene tells it)
      const before = g.told('portrait:before');
      const portrait = g.beat('portrait');
      await before;
      await g.say('roderick', 'Madeline. My sister. We are twins.');
      await g.say('roderick', 'She is ill. At times she grows rigid — as one dead. Then she comes to herself again.');
      await portrait;
    },
    // the gallery: Madeline passes; ⚑ follow her or stay with him
    async g => {
      await g.scene(GALLERY, { beat: 'pass' });
      await g.beat('pass');
      await g.beat('weep');
      const way = await g.choose('madeline', {
        madeline: [{ id: 'follow', label: tr('Follow her') }],
        roderick: [{ id: 'stay', label: tr('Stay with him') }],
      });
      if (way === 'stay') {
        // (he speaks once his hands are down from his face: the scene tells it)
        const talks = g.told('stay:talk');
        const stay = g.beat('stay');
        await talks;
        await g.say('roderick', 'We have ever felt each other. When she suffers — I suffer.');
        await g.say('roderick', 'The physicians know not what it is. One day she will grow rigid — and not awaken.');
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
      await g.say('narrator', 'She stood fixed in mid-step. She did not breathe. Her eyes were open.');
      await frozen;
      await g.beat('wake');
      g.set('speak', 1);
      await g.say('madeline', 'When I am so — I hear everything. Do not let them shut me in.', 'narrator');
      g.set('speak', 0);
      await g.beat('look');
      const promise = await g.choose('promise', 'madeline', [{ id: 'promised', label: tr('I promise') }, { id: 'silent', label: tr('Say nothing') }]);
      if (promise === 'promised') {
        await g.say('narrator', 'I promise.');
        g.mark('promise', true, tr('Madeline will remember this.'));
      }
      await g.beat('gone');
      await g.say('narrator', 'I never beheld her living again.');
    },
  ],
};
