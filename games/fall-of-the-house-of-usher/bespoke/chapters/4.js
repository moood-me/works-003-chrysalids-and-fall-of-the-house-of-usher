// IV. Буря — Roderick with his lamp: «И ты не видел?», the window; the reading of «Безумный Тристан»,
// each passage answered from below («Чтение»: read louder — the crack grows — or listen); the
// confession; the door opens: Madeline. ⚑ The hands («Руки»): whose hand reaches out depends on what
// she heard and on his trust; the time — on the crack. The flight («Бег»). Sets the ending.
// design.md: «Финал: руки», «Концовки».
// Reads: scales; heard.*; marks.loose, key; choices.night, coffin. Leaves: choices.window, reading, hands.
import { CRACK_FULL, SCALES } from '../story.js';
import chtenie from '../minigames/chtenie.js';
import ruki from '../minigames/ruki.js';
import beg from '../minigames/beg.js';

const STORM = 'Буря и чтение', FALL = 'Падение дома';

// what decides the hands: she reaches to him if he tried to save her; Roderick — if he trusts him;
// both hands are within reach only with time to spare and her screws loose (she can walk)
const tried = heard => !!(heard.said || heard.insisted || heard.loose || heard.knocked);
const TRUSTS = 2;

export default {
  number: 'IV',
  title: 'Буря',
  titles: ['Лампа', 'Чтение', 'Признание', 'Дверь', 'Бегство'],
  choices: [
    { id: 'window', weight: '~', title: 'Окно', options: [{ id: 'close', label: 'закрыть' }, { id: 'watch', label: 'смотреть с ним' }] },
    { id: 'reading', weight: '~', title: 'Чтение', options: [{ id: 'louder', label: 'громче' }, { id: 'listened', label: 'слушать' }] },
    { id: 'hands', weight: '⚑', ends: true, title: 'Руки', options: [
      { id: 'madeline', label: 'её' }, { id: 'roderick', label: 'его' }, { id: 'both', label: 'обе' }, { id: 'none', label: 'ничью' }, { id: 'stayed', label: 'остаться' },
    ] },
  ],
  steps: [
    // the storm: his lamp, the window
    async g => {
      // (said in the close-up of his face, lit from below)
      const close = g.when('closeup', 1);
      await g.scene(STORM, { beat: 'enter_lamp' });
      g.sound.rain(0.9, 3);
      g.sound.thunder(0.7);
      const lamp = g.beat('enter_lamp');
      await close;
      g.set('cu_speak', 1);
      await g.say('roderick', 'И ты не видел?', 'narrator');
      g.set('cu_speak', 0);
      await lamp;
      await g.beat('window_open');
      const w = await g.choose('window', {
        window: [{ id: 'close', label: 'Закрыть окно' }],
        roderick: [{ id: 'watch', label: 'Смотреть вместе с ним' }],
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
      await g.say('narrator', 'Чтобы отвлечь его, я взял старый роман о рыцаре Этельреде и стал читать вслух.');
      const { louder, listened } = await g.play(chtenie, {});
      g.state.choices.reading = louder > listened ? 'louder' : 'listened';
      g.scale('crack', louder);
      await g.say('narrator', 'Каждый звук, о котором я читал, отзывался в доме.');
    },
    // the confession
    async g => {
      // (said in the close-up of his face)
      const close = g.when('closeup', 1);
      await g.scene(STORM, { beat: 'confess' });
      const confess = g.beat('confess');
      await close;
      const { choices, heard, marks } = g.state;
      const lines = [
        'Мы положили её в могилу живой! Я слышал её много дней — и не смел сказать!',
        choices.night === 'told' && 'И ты слышал.',
        (heard.said || heard.insisted) && 'Ты хотел сказать — я не дал.',
        heard.loose && 'Ты не дотянул винты. Я знал.',
        !marks.key && 'Я бросил ключ в пруд — чтобы не открыть.',
      ].filter(Boolean);
      g.set('cu_speak', 1);
      for (const line of lines) await g.say('roderick', line, 'narrator');
      g.set('cu_speak', 0);
      await confess;
    },
    // the door: Madeline; ⚑ the hands
    async g => {
      // (said as the close-up of the confession is left: he turns to the door and points)
      const out = g.when('closeup', 0);
      await g.scene(STORM, { beat: 'door_opens' });
      const door = g.beat('door_opens');
      await out;
      await g.say('roderick', 'Безумец! Говорю тебе — она стоит за дверью!');
      g.sound.thunder(1);
      await door;
      await g.beat('hands');
      const { scales, heard, marks } = g.state;
      const madeline = tried(heard), roderick = scales.trust >= TRUSTS;
      const roomy = scales.crack <= 3 && marks.loose;
      let took = 'none', stayed = true;
      if (scales.sanity > 0) {
        ({ took, stayed } = await g.play(ruki, {
          madeline, roderick, both: roomy,
          time: roomy ? 12 : 9 - 5 * Math.min(1, scales.crack / CRACK_FULL), // (the hands come in over its first 1.5 s)
        }));
      } else {
        // the mind gone: the hands reach, and his own does not move
        g.set('quake', 0.6, 2);
        await Promise.all([
          g.move('rod_reach', roderick ? 1 : 0, 1.4), g.move('rod_to_mad', roderick ? 0 : 1, 1.4),
          g.move('mad_reach', madeline ? 1 : 0, 1.6), g.move('mad_to_rod', madeline ? 0 : 1, 1.6),
        ]);
        await g.say('narrator', 'Я не мог отвести глаз.');
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
        await g.move('fade', 1, 1.5);
      }
      g.end(!escaped ? 'stayed' : { none: 'poe', madeline: 'madeline', roderick: 'roderick', both: 'both' }[choices.hands]);
    },
  ],
};
