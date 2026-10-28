// I. Six toes — David meets Sophie by the stream and sees her foot; a rider on the meadow; the
// summer at the ruins of the Old People (digging out a find before the bell); at home, the mother
// asks where he has been.
// Steps 0–2 play “The bank by the stream” in its beats (its notes.md says what each one shows); the lines inside a
// beat wait for its moments (play:girl, ridge:rider…), not for seconds.
// Leaves: choices.talk hurt|whose|sit (how he spoke to her: what she answered, how she let him take the
// shoe off), hooves hid|late (late: suspicion +1), wender shush|away (the mother's look: he promised
// with a finger to his lips — she nodded back; or he looked away — she took Sophie off without a nod),
// find took|left, secret kept|told; marks.wender trusts|doubts (does Mrs Wender trust David —
// for whoever meets her again), marks.sophie kept|told.
import dig from '../minigames/dig.js';
import hem from '../minigames/hem.js';
import { SCENES } from '../story.js';

const BANK = SCENES.bank, RUINS = SCENES.ruins, FARM = SCENES.farm;

export default {
  number: 'I',
  title: tr('Six toes'),
  choices: [
    { id: 'talk', weight: '~', title: tr('How to speak to Sophie'),
      options: [{ id: 'hurt', label: tr('“Does it hurt?”') }, { id: 'whose', label: tr('“Whose are you?”') }, { id: 'sit', label: tr('sit beside her') }] },
    { id: 'hooves', weight: '~', title: tr('The rider on the meadow'),
      options: [{ id: 'hid', label: tr('covered it in time') }, { id: 'late', label: tr('too late') }] },
    { id: 'wender', weight: '~', title: tr('Mrs Wender’s look'),
      options: [{ id: 'shush', label: tr('a finger to my lips') }, { id: 'away', label: tr('look away') }] },
    { id: 'find', weight: '~', title: tr('The find in the ruins'),
      options: [{ id: 'took', label: tr('take it home') }, { id: 'left', label: tr('leave it to the Old People') }] },
    { id: 'secret', weight: '⚑', title: tr('Sophie’s secret'),
      options: [{ id: 'kept', label: tr('keep quiet') }, { id: 'told', label: tr('tell my mother') }] },
  ],
  titles: ['The bank by the stream', 'Hooves', 'The promise', 'The ruins of the Old People', 'Home: my mother asks'], // the steps, as the author's map lists them
  steps: [
    // the bank of the stream: sliding down the sand; a girl; her foot caught in the stones — how to speak to her
    async g => {
      const girl = g.told('play:girl');
      await g.scene(BANK, { beat: 'play' });
      const played = g.beat('play');
      await g.say('narrator', 'I was ten. The sandy bank by the stream was all mine.');
      await girl;
      await g.say('narrator', 'Until a girl got up out of the grass at the top.');
      await played;
      await g.beat('play_again');
      await g.beat('stuck');
      const talk = await g.choose('talk', 'sophie', [
        { id: 'hurt', label: tr('Does it hurt?') }, { id: 'whose', label: tr('Whose are you?') }, { id: 'sit', label: tr('Sit beside her') }]);
      const shoe = g.beat('talk_' + talk);
      if (talk === 'hurt') {
        await g.say('david', 'Does it hurt?');
        await g.say('sophie', 'It hurts. Only don’t look at it.');
      }
      if (talk === 'whose') {
        await g.say('david', 'Whose are you? I haven’t seen you before.');
        await g.say('sophie', 'The Wenders’. We live over the hill.');
        await g.say('sophie', 'Untie it. Only carefully.');
      }
      if (talk === 'sit') await g.say('narrator', 'I sat down beside her and said nothing. She cried a little more, and was quiet.');
      await shoe;
      const toes = g.beat('toes_bare');
      await g.say('narrator', 'There were six toes on her foot.');
      await g.say('narrator', 'Every Sunday my father read us the Definitions: “And each foot shall have five toes.”');
      await toes;
    },
    // the hooves: a rider on the meadow at a walk, and her foot still bare — “The hem”: her hem drawn over it before he
    // comes to where the stones are seen (the hooves heard before he shows)
    async g => {
      const rider = g.told('ridge:rider'), atHem = g.told('ridge:hem'), ridge = g.told('beat:ridge');
      await g.scene(BANK, { beat: 'ridge', r_wait: true }); // (the rider held at the meadow's edge till “The hem” lets him)
      g.beat('ridge', { wait: false }); // (cut short by «cover» if the hem is over the foot in time)
      const horse = g.sound.hooves({ gait: 'walk' });
      horse.loud(0.15, 2);
      horse.loud(0.8, 16);
      await rider;
      horse.halt(); // (he stands at the meadow's edge till “The hem” lets him ride on)
      await g.say('narrator', 'Hooves. Her foot must not be seen.');
      await atHem;
      let rides = false;
      const ride = () => { if (!rides) { rides = true; horse.gait('walk'); } };
      const { hid } = await g.play(hem, { onRide: ride });
      g.set('r_wait', false);
      ride();
      g.state.choices.hooves = hid ? 'hid' : 'late';
      if (hid) {
        await g.beat('cover'); // (it ends once he has come to where the stones are seen)
        const gone = g.beat('ridge_pass');
        horse.loud(0.1, 12);
        await g.say('narrator', 'The rider went by and did not turn his head.');
        await gone;
      } else {
        const held = g.told('ridge_stop:held'), on = g.told('ridge_stop:on');
        await ridge;
        const gone = g.beat('ridge_stop');
        horse.halt();
        await held;
        await g.say('narrator', 'The rider reined in his horse. He looked at us from the meadow — a long time.');
        g.scale('suspicion', 1);
        await on;
        horse.gait('walk');
        horse.loud(0.5, 1.5);
        horse.loud(0.1, 12);
        await g.say('narrator', 'Then he rode on.');
        await gone;
      }
      horse.stop(2);
    },
    // the promise: to her without words; then to her mother, who has felt the foot
    async g => {
      await g.scene(BANK, { beat: 'ask' });
      await g.beat('ask');
      await g.say('sophie', 'Promise you won’t tell anyone.');
      await g.choose(null, 'sophie', [{ id: 'promise', label: tr('I promise') }]);
      const given = g.beat('promise');
      await g.say('david', 'I promise.');
      await given;
      const wave = g.told('mother:wave');
      const found = g.beat('mother');
      await wave;
      await g.say('sophie', 'Mummy!');
      await found;
      const look = await g.choose('wender', 'mother', [{ id: 'shush', label: tr('Finger to lips') }, { id: 'away', label: tr('Look away') }]);
      const moment = g.told(look === 'shush' ? 'nod:nod' : 'away:gone');
      const gone = g.beat(look === 'shush' ? 'nod' : 'away');
      await moment;
      if (look === 'shush') {
        await g.say('narrator', 'She nodded to me. As to a grown-up.');
        g.mark('wender', 'trusts', tr('Mrs Wender will remember this.'));
      } else {
        await g.say('narrator', 'I looked at the sand. When I raised my eyes, she was already going — quickly, without looking back.');
        g.mark('wender', 'doubts', tr('Mrs Wender will remember this.'));
      }
      await gone;
      await g.say('narrator', 'Her name was Sophie. From that day on we met nearly every day.');
      await g.wait(1500);
    },
    // the ruins of the Old People: digging out what glints, until the bell
    async g => {
      await g.scene(RUINS, { sun: 0.2, children: 1, overgrowth: 0.6, glint: 0.2, bell: 0 });
      await g.wait(1500);
      await g.say('narrator', 'All summer we ran off to the ruins of the Old People — where we were not allowed to go.');
      g.set('glint', 1, 4);
      await g.wait(4000);
      await g.say('narrator', 'Something glinted in the grass. I began to scrape the earth away with my hands.');
      const dug = await g.play(dig);
      const seen = dug.cleared >= 0.6;
      if (seen && !dug.bell) {
        await g.say('narrator', 'A smooth plate with the Old People’s letters on it. What had it been for?');
        const guess = await g.choose(null, 'glint', [{ id: 'way', label: tr('Showing the way') }, { id: 'pray', label: tr('For prayers') }, { id: 'toy', label: tr('A toy') }],
          { seconds: 20 });
        if (guess) await g.say('david', { way: tr.line('david', 'To show the way.'), pray: tr.line('david', 'They prayed to it.'), toy: tr.line('david', 'It’s just a toy.') }[guess]);
        if (guess === 'way') await g.say('narrator', 'Perhaps. Only the roads from here had led nowhere for a long time.');
        if (guess === 'pray') await g.say('sophie', 'Hush. If they hear, we’ll be in trouble.');
        if (guess === 'toy') await g.say('sophie', 'Some toys they had!');
      }
      if (!dug.bell) {
        const find = await g.choose('find', 'glint', [{ id: 'took', label: tr('Take it home') }, { id: 'left', label: tr('Leave it') }], { seconds: 25 });
        if (find === 'took') await g.say('narrator', 'I pushed it inside my shirt.');
        if (find === 'left') {
          g.set('glint', 0.2, 3);
          await g.say('narrator', 'Let it lie. The Old People knew so much — and lost it all the same.');
        }
        g.set('bell', 1, 3);
        g.sound.toll();
        await g.wait(3500);
      }
      await g.say('narrator', 'From far off, from Waknuk, came the sound of the bell. Time to go home.');
      if (dug.bell) {
        // the bell caught us digging: grab it as it is, or leave it
        if (!seen) await g.say('narrator', 'I never did dig it out all the way.');
        const find = await g.choose('find', 'glint', [{ id: 'took', label: seen ? tr('Grab it, run') : tr('Pull it, run') }, { id: 'left', label: tr('Drop it, run') }],
          { seconds: 15, late: 'left' });
        g.set('glint', find === 'took' ? 0 : 0.2, 2);
        g.set('children', 0, 5);
        await g.wait(4000);
      } else await g.choose(null, 'david', [{ id: 'home', label: tr('Run home') }]);
    },
    // home: the mother asks — the secret
    async g => {
      await g.scene(FARM, { dusk: 0.75, window_lit: 1, boy_present: true, wind: 0.3 });
      await g.wait(1500);
      await g.say('narrator', 'At home it smelt of bread and wax.');
      await g.say('mother', 'Where have you been all day, David?', 'house');
      const secret = await g.choose('secret', 'house#window', [
        { id: 'kept', label: tr('By the stream') }, { id: 'told', label: tr('About the girl') }]);
      await g.say('david', secret === 'kept' ? tr.line('david', 'By the stream. On my own.') : tr.line('david', 'I met a girl. She has six toes on her foot.'));
      if (secret === 'kept') {
        g.mark('sophie', 'kept', tr('Sophie will remember this.'));
        await g.say('mother', 'Your father was asking. Don’t be late for prayers.', 'house');
      } else {
        await g.wait(1500);
        await g.say('mother', 'No one. Do you hear? Not your father, not the inspector. No one.', 'house');
        g.mark('sophie', 'told', tr('Sophie will not know of it. Not yet.'));
        g.scale('suspicion', 1);
      }
      if (g.state.choices.find === 'took') await g.say('narrator', 'That night I hid the Old People’s plate under a floorboard.');
      g.set('window_lit', 0, 4);
      await g.wait(4500);
    },
  ],
};
