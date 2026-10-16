// IV. The storm — Roderick with his lamp: «And you have not seen it?», the window; the reading of «The Mad Trist»,
// each passage answered from below («The reading»: read louder — the crack grows — or listen); the
// confession; the door opens: Madeline. ⚑ The hands («Hands»): whose hand reaches out depends on what
// she heard and on his trust; the time — on the crack. The flight («Run»). Sets the ending.
// design.md (docs/usher): the hands at the end, the endings.
// Reads: scales; heard.*; marks.loose, key, knocks; choices.night, coffin. Leaves: choices.window, reading, hands.
import { CRACK_FULL, SCALES, SCENES } from '../story.js';
import chtenie from '../minigames/chtenie.js';
import ruki from '../minigames/ruki.js';
import beg from '../minigames/beg.js';

const STORM = SCENES.storm, FALL = SCENES.fall;

// what decides the hands: she reaches to him if he tried to save her; Roderick — if he trusts him;
// both hands are within reach only with time to spare and her screws loose (she can walk)
const tried = heard => !!(heard.said || heard.insisted || heard.loose || heard.knocked);
const TRUSTS = 2;

export default {
  number: 'IV',
  title: tr('The storm'),
  titles: ['The lamp', 'The reading', 'The confession', 'The door', 'The flight'],
  choices: [
    { id: 'window', weight: '~', title: tr('The window'), options: [{ id: 'close', label: tr('close it') }, { id: 'watch', label: tr('watch with him') }] },
    { id: 'reading', weight: '~', title: tr('The reading'), options: [{ id: 'louder', label: tr('louder') }, { id: 'listened', label: tr('listen') }] },
    { id: 'hands', weight: '⚑', ends: true, title: tr('Hands'), options: [
      { id: 'madeline', label: tr('hers') }, { id: 'roderick', label: tr('his') }, { id: 'both', label: tr('both') }, { id: 'none', label: tr('neither') }, { id: 'stayed', label: tr('stay') },
    ] },
  ],
  steps: [
    // the storm: his lamp, the window
    async g => {
      // (said in the close-up of his face, lit from below)
      const close = g.told('enter_lamp:close');
      await g.scene(STORM, { beat: 'enter_lamp' });
      g.sound.rain(0.9, 3);
      g.sound.thunder(0.7);
      const lamp = g.beat('enter_lamp');
      await close;
      g.set('cu_speak', 1);
      await g.say('roderick', 'And you have not seen it?', 'narrator');
      g.set('cu_speak', 0);
      await lamp;
      await g.beat('window_open');
      const w = await g.choose('window', {
        window: [{ id: 'close', label: tr('Close the window') }],
        roderick: [{ id: 'watch', label: tr('Watch with him') }],
      });
      if (w === 'close') {
        await g.beat('window_close');
        g.scale('trust', -1);
      } else {
        await g.beat('watch');
        g.scale('trust', 1);
        g.scale('sanity', -1);
      }
    },
    // the reading: each passage answered from below
    async g => {
      await g.scene(STORM, { beat: 'read' });
      await g.beat('read');
      await g.say('narrator', 'To divert him, I took up an antique romance of the knight Ethelred, and read it aloud.');
      const { louder, listened } = await g.play(chtenie, {});
      g.state.choices.reading = louder > listened ? 'louder' : 'listened';
      g.scale('crack', louder);
      await g.say('narrator', 'Each sound of which I read found its echo in the house.');
    },
    // the confession
    async g => {
      // (said in the close-up of his face)
      const close = g.told('confess:close');
      await g.scene(STORM, { beat: 'confess' });
      const confess = g.beat('confess');
      await close;
      const { choices, heard, marks } = g.state;
      const lines = [
        tr.line('roderick', 'We have put her living in the tomb! I have heard her — many, many days — yet I dared not speak!'),
        choices.night === 'told' && tr.line('roderick', 'And you heard it.'),
        (heard.said || heard.insisted) && tr.line('roderick', 'You would have spoken — I would not let you.'),
        heard.loose && tr.line('roderick', 'You left the screws loose. I knew it.'),
        marks.knocks >= 3 && tr.line('roderick', 'You knocked at her door by night. Again and again. And she answered.'),
        !marks.key && tr.line('roderick', 'I cast the key into the tarn — lest I should open it.'),
      ].filter(Boolean);
      g.set('cu_speak', 1);
      for (const line of lines) await g.say('roderick', line, 'narrator');
      g.set('cu_speak', 0);
      await confess;
    },
    // the door: Madeline; ⚑ the hands
    async g => {
      // (said as the close-up of the confession is left: he turns to the door and points)
      const out = g.told('door_opens:out');
      await g.scene(STORM, { beat: 'door_opens' });
      const door = g.beat('door_opens');
      await out;
      await g.say('roderick', 'Madman! I tell you that she now stands without the door!');
      g.sound.thunder(1);
      await door;
      await g.beat('hands');
      const { scales, heard, marks } = g.state;
      const madeline = tried(heard), roderick = scales.trust >= TRUSTS;
      const roomy = scales.crack <= 3 && marks.loose;
      let took = 'none', stayed = true;
      if (scales.sanity > 0) {
        ({ took, stayed } = await g.play(ruki, {
          madeline, roderick, both: !!roomy,
          time: roomy ? 12 : 9 - 5 * Math.min(1, scales.crack / CRACK_FULL), // (the hands come in over its first 1.5 s)
        }));
      } else {
        // the mind gone: the hands reach, and his own does not move
        g.set('quake', 0.6, 2);
        g.set('rod_reach', roderick ? 1 : 0, 1.4);
        g.set('rod_to_mad', roderick ? 0 : 1, 1.4);
        g.set('mad_reach', madeline ? 1 : 0, 1.6);
        g.set('mad_to_rod', madeline ? 0 : 1, 1.6);
        await g.wait(1600);
        await g.say('narrator', 'I could not take my eyes away.');
      }
      if (stayed) {
        g.state.choices.hands = 'stayed';
        await g.beat('stay');
        g.end('stayed');
        return;
      }
      g.state.choices.hands = took;
      g.set('with_madeline', took === 'madeline' || took === 'both');
      g.set('with_roderick', took === 'roderick' || took === 'both');
      if (took === 'none') await g.beat('collapse');
      await g.beat('flee');
    },
    // the flight along the causeway; caught — the house takes them too
    async g => {
      const { scales, choices } = g.state;
      const companions = { madeline: ['madeline'], roderick: ['roderick'], both: ['madeline', 'roderick'] }[choices.hands] || [];
      await g.scene(FALL, { with_madeline: companions.includes('madeline'), with_roderick: companions.includes('roderick'), beat: 'run' });
      await g.beat('run');
      const { escaped } = await g.play(beg, { companions, speed: Math.min(1, scales.crack / CRACK_FULL), sanity: scales.sanity / SCALES.sanity.max });
      if (!escaped) {
        g.set('fade', 1, 1.5);
        await g.wait(1500);
      }
      g.end(!escaped ? 'stayed' : { none: 'poe', madeline: 'madeline', roderick: 'roderick', both: 'both' }[choices.hands]);
    },
  ],
};
