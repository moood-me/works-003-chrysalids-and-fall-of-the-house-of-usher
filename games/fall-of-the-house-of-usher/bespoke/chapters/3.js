// III. The vault — his plan (two weeks in the vault); the vault: her blush and smile, a touch or the mirror,
// ⚑ what the narrator says at the coffin, ⚑ the screws («The screws»), her side of it (from inside), the iron
// door; the nights: «Listen» (the lower the sanity, the clearer she is), ⚑ go down and knock («Knock»),
// go to him, or call it the wind; ⚑ the morning — the last chance to leave. design.md, scenes.md.
// Reads: marks.doctor, marks.promise. Leaves: choices.check, coffin, screws, night, morning; heard.said,
// insisted, loose, knocked; marks.loose (the screws stayed loose), marks.key (he told of the key), marks.knocks (how many
// times he knocked at the vault's door).
import { SCALES, SCENES } from '../story.js';
import screws from '../minigames/screws.js';
import knock from '../minigames/knock.js';
import listening from '../minigames/listening.js';

const HOUSE = SCENES.house, ROOM = SCENES.room, VAULT = SCENES.vault, NIGHT = SCENES.storm;

export default {
  number: 'III',
  title: tr('The vault'),
  titles: ['A fortnight', 'The vault', 'Nights', 'Morning'],
  choices: [
    { id: 'check', weight: '~', title: tr('At the coffin'), options: [{ id: 'touch', label: tr('touch her hand') }, { id: 'mirror', label: tr('the mirror') }, { id: 'none', label: tr('do not touch') }] },
    { id: 'coffin', weight: '⚑', title: tr('The lid'), options: [{ id: 'said', label: tr('“she may be living”') }, { id: 'insisted', label: tr('“do not close it”') }, { id: 'silent', label: tr('say nothing') }] },
    { id: 'screws', weight: '⚑', title: tr('The screws'), options: [{ id: 'tight', label: tr('screw it down') }, { id: 'loose', label: tr('leave them loose') }] },
    { id: 'night', weight: '⚑', title: tr('A sound below'), options: [{ id: 'down', label: tr('go down') }, { id: 'told', label: tr('tell him') }, { id: 'wind', label: tr('“only the wind”') }] },
    { id: 'morning', weight: '⚑', ends: true, title: tr('Morning'), options: [{ id: 'stay', label: tr('stay') }, { id: 'left', label: tr('leave') }] },
  ],
  steps: [
    // his plan: two weeks in the vault
    async g => {
      // (he walks, then talks: his lines once he stands at the table talking — the beat's end)
      await g.scene(ROOM, { beat: 'plan' });
      await g.beat('plan');
      await g.say('roderick', 'For a fortnight she shall lie below, in a vault. The physicians are too eager in their inquiries. And the burial-ground is remote.');
      if (g.state.marks.doctor) {
        await g.say('roderick', 'You spoke with him. He will come for her. So it must be today.');
        g.scale('trust', -1);
      }
    },
    // the vault: her face; ⚑ the lid; the screws; from inside; the iron door
    async g => {
      await g.scene(VAULT, { beat: 'enter' });
      await g.beat('enter');
      // (said over her face, close: the scene tells the cut)
      const face = g.told('open:face');
      const open = g.beat('open');
      await face;
      await g.say('narrator', 'A faint blush upon the face. Upon the bosom. And that lingering smile upon the lip which is so terrible in death.', 'narrator');
      await open;
      const check = await g.choose('check', {
        madeline: [{ id: 'touch', label: tr('Touch her hand') }, { id: 'mirror', label: tr('Mirror to lips') }],
        roderick: [{ id: 'none', label: tr('Do not touch') }],
      });
      if (check === 'touch') {
        // (said as his hand goes to hers)
        const hand = g.told('touch:hand');
        const touch = g.beat('touch');
        await hand;
        await g.say('narrator', 'The hand was warm.', 'narrator');
        await touch;
      }
      if (check === 'mirror') {
        // (said as the mirror goes to her lips)
        const up = g.told('mirror:up');
        const mirror = g.beat('mirror');
        await up;
        await g.say('narrator', 'The mirror remained unclouded.', 'narrator');
        await mirror;
      }
      await g.say('narrator', 'So it is with her malady. She may be living. There is no knowing for certain.');
      await g.say('roderick', 'We are twins. I would have felt it.');
      const lid = await g.choose('coffin', 'roderick', [
        { id: 'said', label: tr('May be living') },
        { id: 'insisted', label: tr('Do not close') },
        { id: 'silent', label: tr('Say nothing') },
      ]);
      // (where the lid goes next: the screws, or — he shut it himself, hard — straight to her side of it: its cut made
      // ready ahead)
      g.set('beat_next', lid === 'insisted' ? 'inside' : 'screws');
      if (lid === 'said') {
        await g.say('narrator', 'She may be living.');
        g.overheard('said');
        const turn = g.beat('say');
        await g.say('roderick', 'I know. I dread it more than her death.');
        await turn;
        await g.beat('shut');
      } else if (lid === 'insisted') {
        await g.say('narrator', 'Wait. Do not close it.');
        g.overheard('insisted');
        const shut = g.beat('insist');
        await g.say('roderick', 'This is my house.');
        await shut;
        g.scale('trust', -2);
      } else {
        g.scale('crack', check === 'none' ? 1 : 2); // knowing makes the silence dearer
        await g.beat('close');
      }
      if (lid !== 'insisted') {
        if (lid === 'said') await g.say('roderick', 'The screws. Help me.');
        await g.beat('screws');
        g.set('beat_next', 'inside');
        const { loose } = await g.play(screws, { promised: !!g.state.marks.promise });
        g.state.choices.screws = loose.length ? 'loose' : 'tight';
        if (loose.length) {
          g.overheard('loose');
          if (g.state.scales.trust <= 0) {
            const check = g.beat('check');
            await g.say('narrator', 'He tried the screws. And drove them home himself.');
            await check;
            g.scale('trust', -1);
          } else g.mark('loose', true);
        }
      }
      // from inside: the line of light, the screw tips coming through the wood as the driver turns them — each turn heard
      // as it comes (the scene moves `tip` on, a turn at a time)
      g.watch('tip', (v, old) => { if (v > (old ?? 0)) g.sound.screw(0.6); });
      await g.beat('inside');
      g.set('beat_next', null);
      await g.beat('leave');
      await g.choose(null, 'door', [{ id: 'close', label: tr('Close the door') }]);
      g.sound.ironDoor(true);
      await g.beat('door_close');
    },
    // the nights: the sound from below; ⚑ go down, go to him, or the wind
    async g => {
      await g.scene(NIGHT, { beat: 'night' });
      g.sound.rain(0.3, 4);
      await g.beat('night');
      await g.say('narrator', 'Some days passed. He roamed the house by night. Sleep came not near my couch.');
      const { heard } = await g.play(listening, { clarity: 1 - g.state.scales.sanity / SCALES.sanity.max });
      g.sound.house(0.15, 3);
      if (heard === 'melody') await g.say('narrator', 'From below, through the stone — her song. Before, I should not have heard it.');
      else await g.say('narrator', 'From below — scarcely to be heard — as of something scratching at wood.');
      const lamp = g.beat('lamp_pass');
      await g.say('narrator', 'Lamplight passed beneath the door. It paused. It went on.');
      await lamp;
      const night = await g.choose('night', {
        door: [{ id: 'down', label: tr('Into the vault') }, { id: 'told', label: tr('Go to him') }],
        window: [{ id: 'wind', label: tr('Only the wind') }],
      });
      if (night === 'wind') {
        await g.say('narrator', 'It is the wind. Only the wind.');
        g.scale('crack', 1);
        return;
      }
      if (night === 'told') {
        // (said as he comes to stand beside him)
        const beside = g.told('night_listen:beside');
        await g.scene(ROOM, { beat: 'night_listen' });
        const listen = g.beat('night_listen');
        await beside;
        await g.say('narrator', 'I found him in the dark, against the wall.');
        await listen;
        await g.say('roderick', 'You hear it too?');
        await g.say('narrator', 'We stood and listened. Together.');
        g.scale('trust', 1);
        return;
      }
      await g.scene(VAULT, { beat: 'at_door' });
      await g.beat('at_door');
      const { knocks } = await g.play(knock, {});
      g.overheard('knocked');
      g.mark('knocks', knocks);
      await g.say('narrator', 'From within, there came an answer.');
      await g.say('narrator', 'In the morning I asked him for the key.');
      await g.say('roderick', 'I cast the key into the tarn. Else I should have opened — and seen her eyes.', 'narrator');
      g.mark('key', true);
      g.scale('trust', -1);
    },
    // the morning: his horse saddled — ⚑ the last chance to leave
    async g => {
      // (said as the horse tosses its head)
      const toss = g.told('morning:toss');
      await g.scene(HOUSE, { beat: 'morning' });
      const morning0 = g.beat('morning');
      await toss;
      await g.say('narrator', 'In the morning my horse stood saddled. I might yet depart.');
      await morning0;
      const morning = await g.choose('morning', {
        'rider#saddle': [{ id: 'left', label: tr('Leave') }],
        house: [{ id: 'stay', label: tr('Stay') }],
      });
      if (morning === 'left') {
        await g.beat('ride_away');
        g.end('left');
      }
    },
  ],
};
