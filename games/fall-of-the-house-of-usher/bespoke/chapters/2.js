// II. Days — her name is not spoken; the guitar: go with his frenzy or hold him («String»), the ballad;
// the doctor in the gallery: ⚑ tell him of her fits or keep silent, and ⚑ his carriage — the first
// chance to leave; the walk out of the house («By the hand»): his breath, his fear, the house alive — on to
// the shore or back. «She is no more». design.md, scenes.md (docs/usher).
// Reads: nothing. Leaves: choices.struna, doctor, carriage, walk; marks.doctor (he was told). «By the hand» let go — trust.
import { SCENES } from '../story.js';
import struna from '../minigames/struna.js';
import zaRuku from '../minigames/za-ruku.js';

const HOUSE = SCENES.house, ROOM = SCENES.room, GALLERY = SCENES.gallery;

export default {
  number: 'II',
  title: tr('Days'),
  titles: ['The guitar', 'The physician', 'The walk', 'Evening'],
  choices: [
    { id: 'struna', weight: '~', title: tr('His music'), options: [{ id: 'follow', label: tr('follow him') }, { id: 'steady', label: tr('my own time') }] },
    { id: 'doctor', weight: '⚑', title: tr('The physician'), options: [{ id: 'told', label: tr('tell him of it') }, { id: 'silent', label: tr('say nothing') }] },
    { id: 'carriage', weight: '⚑', ends: true, title: tr('The physician’s carriage'), options: [{ id: 'stay', label: tr('stay') }, { id: 'left', label: tr('leave') }] },
    { id: 'walk', weight: '~', title: tr('The walk'), options: [{ id: 'shore', label: tr('to the shore') }, { id: 'back', label: tr('back') }] },
  ],
  steps: [
    // the guitar: his frenzy — with him or against it; the ballad
    async g => {
      await g.scene(ROOM, { beat: 'turn_away' });
      const away = g.beat('turn_away');
      await g.say('narrator', 'For several days ensuing, her name was unmentioned.');
      await g.say('roderick', 'Speak not of her. I beg you.');
      await away;
      await g.beat('dusk');
      const song = g.beat('guitar');
      const tune = g.sound.melody({ as: 'guitar', tempo: 0.8, loud: 0.5 });
      await g.say('roderick', 'Her song. She sang it when we were children.');
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
      await g.say('narrator', 'Then he sang — of a palace into which, one day, madness entered.');
      await ballad;
      await g.say('narrator', 'He sang of himself.');
      await g.beat('guitar_down');
    },
    // the doctor: ⚑ tell him or keep silent; his carriage
    async g => {
      await g.scene(GALLERY, { beat: 'doctor' });
      const doctor = g.beat('doctor');
      await g.say('narrator', 'In the gallery I met the family physician.');
      await doctor;
      g.set('speak', 1);
      await g.say('doctor', 'A most curious case. When she… I should like to study her.', 'narrator');
      g.set('speak', 0);
      await g.beat('beside');
      const told = await g.choose('doctor', 'doctor', [{ id: 'told', label: tr('Tell him') }, { id: 'silent', label: tr('Say nothing') }]);
      if (told === 'told') {
        await g.say('narrator', 'I told him how she grows rigid.');
        await g.say('doctor', 'Catalepsy… Exquisite.');
        g.mark('doctor', true);
      } else g.scale('crack', 1);
      await g.say('doctor', 'I leave in the morning. There is room in my carriage.');
      const go = await g.choose('carriage', 'doctor', [{ id: 'stay', label: tr('Stay') }, { id: 'left', label: tr('Leave with him') }]);
      if (go === 'left') {
        const sure = await g.choose(null, 'doctor', [{ id: 'yes', label: tr('Leave') }, { id: 'no', label: tr('No. Stay') }]);
        if (sure === 'yes') {
          await g.say('narrator', 'To go — and leave him alone.');
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
      await g.say('narrator', 'For many years he had not ventured forth. I led him out by the hand.');
      await out;
      await g.beat('walk');
      const { letGo } = await g.play(zaRuku, {});
      // (his hand let go on the way out: he felt it)
      if (letGo) g.scale('trust', -1);
      // (said in the close-up of his breath)
      const close = g.told('breathe:close');
      const breathe = g.beat('breathe');
      await close;
      await g.say('roderick', 'I had forgotten the smell of the air.', 'narrator');
      await breathe;
      await g.say('roderick', 'I shall perish. Not of the evil itself — of the terror of it.');
      await g.say('roderick', 'This house lives. The stones, the tarn. They have made us what we are.');
      const walk = await g.choose('walk', 'roderick', [{ id: 'shore', label: tr('To the shore') }, { id: 'back', label: tr('Back') }]);
      if (walk === 'shore') {
        await g.say('narrator', 'I led him on, to the shore.');
        await g.beat('to_shore');
        await g.say('narrator', 'At the very brink he fell to his knees and stopped his ears.');
        g.scale('trust', -1);
        g.scale('sanity', 1);
      } else {
        await g.say('narrator', 'I turned back.');
        await g.beat('turn_back');
        g.scale('trust', 1);
        g.scale('sanity', -1);
      }
    },
    // the evening: «She is no more»
    async g => {
      // (said as his lips begin to move, in the close-up)
      const lips = g.told('news:lips');
      await g.scene(ROOM, { beat: 'news' });
      const news = g.beat('news');
      await lips;
      await g.say('roderick', 'She is no more.', 'narrator');
      await news;
    },
  ],
};
