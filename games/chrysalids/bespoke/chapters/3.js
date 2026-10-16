// III. Voices — uncle Axel finds out that David hears thoughts, and tells him to keep it from
// everyone; Axel's stories of the world beyond Labrador; the children who hear each other learn to
// find one another across the valley (and a strange voice calls); Rosalind on the square, where they
// may not look at each other; at night on the hill, the voices — and Anne, who wants to leave them.
// Reads: marks.calf (hidden: the farmhand told the father — at the forge he watches David, and the bellows forgive
//   fewer slips), choices.find (the Old People's plate),
//   scales.suspicion (the old woman on the square watches from the start).
// Leaves for later chapters: choices.axel truth|lie, newcomer took|left (a ninth
//   voice: one more to help — or to let it slip), glance looked|away, anne let|axel;
//   marks.anne free (married Alan, outside the group, knows everything) | widowed (Alan killed by
//   Axel; she guesses it was them — may break later), marks.rosalind looked; scales group, suspicion.
import bellows from '../minigames/bellows.js';
import tuning from '../minigames/tuning.js';
import layers from '../minigames/layers.js';
import windows from '../minigames/windows.js';
import { SCENES } from '../story.js';

const FORGE = SCENES.forge, STORIES = SCENES.stories, HEAR = SCENES.hear, SQUARE = SCENES.square, VOICES = SCENES.voices;

export default {
  number: 'III',
  title: tr('Voices'),
  choices: [
    { id: 'axel', weight: '~', title: tr('Uncle Axel asked'),
      options: [{ id: 'truth', label: tr('point to the window') }, { id: 'lie', label: tr('shake my head') }] },
    { id: 'newcomer', weight: '~', title: tr('A strange voice'),
      options: [{ id: 'took', label: tr('answer her') }, { id: 'left', label: tr('keep quiet') }] },
    { id: 'glance', weight: '~', title: tr('Rosalind on the square'),
      options: [{ id: 'looked', label: tr('look at her') }, { id: 'away', label: tr('not look') }] },
    { id: 'anne', weight: '⚑', title: tr('Anne leaves'),
      options: [{ id: 'let', label: tr('let her go') }, { id: 'axel', label: tr('tell Axel') }] },
  ],
  titles: ['The forge', 'Axel’s stories', 'Learning to hear', 'The square', 'Voices: Anne leaves'], // the steps, as the author's ☰ lists them
  steps: [
    // the forge: chattering without words with someone far away — and uncle Axel sees the boy laugh at nothing
    async g => {
      await g.scene(FORGE, { beat: 'chatter' });
      const chatter = g.beat('chatter');
      await g.say('narrator', 'Uncle Axel had been a sailor once. Then he hurt his leg and became my father’s smith.');
      await g.say('narrator', 'I liked to sit on a barrel in his forge. And to chatter — with someone no one but me could hear.');
      await g.think('rosalind', 'David? Are you at the forge again?');
      await g.think('david', 'Yes. Uncle’s making horseshoes. It’s warm here.');
      await g.think('rosalind', 'Our cow got loose. The whole house was out catching her.');
      await chatter;
      // the hammer stops at the top; he comes over, down on his knee: "who?"
      const noticed = g.beat('notice');
      await g.say('narrator', 'I laughed out loud. My uncle’s hammer stopped.');
      await noticed;
      await g.say('axel', 'Who are you talking to, Davie?');
      const axel = await g.choose('axel', 'david', [
        { id: 'truth', label: tr('Show the window') }, { id: 'lie', label: tr('Shake my head') }]);
      // the truth: a shape out to the window and back, under his eyes; the lie: the answer comes anyway, and my eyes jump to it
      const far = axel === 'truth' ? g.told('truth:window') : null, ask = g.told(`${axel}:ask`);
      const shown = g.beat(axel);
      if (axel === 'truth') {
        await far;
        await g.say('narrator', 'Beyond the field the Mortons’ window was lit. That was where Rosalind lived.');
        await ask;
        await g.say('axel', 'Right across the field? Without words?');
      } else {
        await ask;
        await g.say('axel', 'No one, eh? And yet you look — over there.');
      }
      await shown;
      // the door half shut; close, on his knee: finger to the lips, a tap at the temple
      await g.beat('door');
      const finger = g.told('hush:finger');
      const hushed = g.beat('hush');
      await finger;
      await g.say('axel', 'No one, do you hear? Not your father, not your mother. Not a living soul.');
      await g.say('axel', 'And tell the others the same.');
      await hushed;
      // a lantern in the yard: the father. Off the barrel, to the bellows — as if I'd been at them all along
      const lantern = g.beat('lantern_bellows');
      await g.say('axel', 'Your father. To the bellows, Davie. Quick.');
      await lantern;
      // the farmhand saw the calf go behind the barn (II): the father has his eye on me
      const watched = g.state.marks.calf === 'hidden';
      if (watched) await g.say('narrator', 'The farmhand had told him about the calf. My father was looking not at my uncle — at me.');
      const { broke } = await g.play(bellows, { watched });
      if (broke) {
        const lingered = g.beat('lantern_linger');
        await g.say('narrator', 'My bellows wheezed out of time. My father raised his lantern and looked at me for a long while.');
        g.scale('suspicion', 1);
        await lingered;
      } else {
        const away = g.told('lantern_go:away');
        const gone = g.beat('lantern_go');
        await away;
        await g.say('narrator', 'My father stood a while, nodded to my uncle and went away.');
        await gone;
      }
      const nod = g.told('rest:nod');
      const rest = g.beat('rest');
      await nod;
      await g.say('narrator', 'My uncle said nothing. He only nodded to me across the forge.');
      await rest;
      await g.wait(2000);
    },
    // Axel's stories by the fire: the world is bigger than Labrador — seen in the smoke as he tells it (the scene shows
    // the vision: vision, story; only watched)
    async g => {
      await g.scene(STORIES, { fire: 0.8, story: 0, vision: 0, dawn: 0, david_present: true });
      await g.wait(1500);
      await g.say('narrator', 'In the evenings my uncle told me what he had seen over the sea.');
      const ASK = { sea: { id: 'sea', label: tr('The sea?') }, city: { id: 'city', label: tr('The Old People?') }, coast: { id: 'coast', label: tr('The people there?') } };
      const LINE = { sea: tr.line('david', 'What is it like, the sea?'), city: tr.line('david', 'Have you seen where the Old People lived?'), coast: tr.line('david', 'And what are the people like there?') };
      const asked = [];
      while (asked.length < 2) {
        const q = await g.choose(null, 'axel', Object.values(ASK).filter(a => !asked.includes(a.id)));
        asked.push(q);
        await g.say('david', LINE[q]);
        g.set('story', 0, 1);
        await g.wait(1000);
        g.set('vision', { sea: 1, city: 2, coast: 3 }[q]);
        g.set('story', 0.7, 4);
        if (q === 'sea') await g.say('axel', 'Bigger than all our land. You sail for weeks — and not a shore in sight.');
        else if (q === 'city') await g.say('axel', 'I have. Black glass for miles and miles. Nothing grows there to this day.');
        else await g.say('axel', 'All sorts. In the south there’s a coast where everyone has six toes. And they think we’re the deviants.');
        // what it looked like: the vision clear in the smoke while he tells it, a while after
        await (q === 'sea' ? g.say('axel', 'Our ship was a tall one, three masts. Sails one above the other.')
          : q === 'city' ? g.say('axel', 'And over the glass — towers. Taller than our church tower, and every one of them broken.')
          : g.say('axel', 'Their coast is green. The trees are thin and tall, and their tops are like umbrellas.'));
        const held = g.wait(6000).then(() => g.set('story', 0.1, 4));
        if (q === 'city' && g.state.choices.find === 'took') {
          await g.say('narrator', 'I showed him the plate from the ruins.');
          await g.say('axel', 'Hide it. And don’t show it to your father.');
        } else if (q === 'coast') await g.say('narrator', 'I thought of Sophie.');
        await held;
        await g.wait(1500);
      }
      g.set('story', 0.15, 5);
      g.set('fire', 0.4, 12);
      g.set('dawn', 1, 14);
      await g.say('axel', 'The true image, you say? And who has ever seen it, this image?');
      await g.say('axel', 'Labrador isn’t the whole world, Davie.');
      await g.wait(3000);
    },
    // learning to hear: finding the others across the valley; the ploughman turns; a strange voice
    async g => {
      await g.scene(HEAR, { children: 2, threads: 0.5, rosalind: 1, adults_near: 0, dusk: 0 });
      await g.wait(1500);
      await g.say('narrator', 'The years went by. We found one another — those who could hear.');
      await g.say('narrator', 'By day, at work, we learnt to know one another right across the valley.');
      // whose voice is it: the valley swept like a receiver's dial, the voice known by its tune
      await g.think('anne', 'Half the day at the washing line again. Is anybody there?');
      const anne = await g.play(tuning, { find: 'washer' });
      g.set('children', 3);
      await g.say('narrator', anne.caught ? tr.line('narrator', 'Anne.') : tr.line('narrator', 'Anne. She found me herself.'));
      await g.think('michael', 'The sheep are scattered all over the hill. David, where are you?');
      // and while I search, the ploughman turns: not a move, before he sees (the plate says it)
      const michael = await g.play(tuning, { find: 'shepherd', watch: true });
      if (michael.seen) {
        await g.say('narrator', 'The ploughman looked at me a long time from under his hand. And I stood and looked at the sky.');
        g.scale('suspicion', 1);
      } else {
        await g.say('narrator', 'I went back to my hoeing. The ploughman stood a while and started his horse.');
      }
      g.set('children', 4);
      await g.say('narrator', 'Michael. Then Mark answered — from a cart on the road.');
      g.set('children', 5);
      g.set('threads', 0.85, 3);
      g.scale('group', 2);
      await g.wait(2500);
      g.set('adults_near', 0, 6);
      await g.wait(3000);
      // a voice none of us knew
      await g.think('newcomer', 'Who’s there? Who is it talking?');
      await g.think('michael', 'Don’t answer. We don’t know her.');
      await g.think('rosalind', 'She’s all alone out there. As we were once.');
      const answer = await g.choose('newcomer', 'david', [{ id: 'took', label: tr('Answer her') }, { id: 'left', label: tr('Keep quiet') }],
        { seconds: 30, late: 'left' });
      if (answer === 'took') {
        g.set('children', 6);
        await g.think('newcomer', 'I thought I was the only one.');
        await g.think('michael', 'Now there are nine of us. And nine of us who might let it slip.');
        g.scale('group', -1);
      } else {
        await g.think('newcomer', 'Who’s there…?');
        await g.say('narrator', 'She called for a few more evenings. Then she stopped.');
      }
      g.set('dusk', 1, 10);
      await g.wait(6000);
    },
    // the square by the church: talking without words, not looking
    async g => {
      const watched = g.state.scales.suspicion >= 2;
      await g.scene(SQUARE, { thread: 0.3, crowd: 1, glance: 0, someone_watching: watched ? 1 : 0, dusk: 0.2 });
      await g.wait(1500);
      await g.say('narrator', 'We were sixteen. In front of everyone, Rosalind and I were almost strangers.');
      if (watched) await g.say('narrator', 'That day the old woman by the well never took her eyes off me.');
      await g.say('narrator', 'My eyes went looking for her by themselves. I kept taking them away — to the well, to the church, anywhere.');
      g.set('thread', 0.85, 24);
      // talking without words — and the eyes, drawn to her the warmer it gets, kept away
      const TALK = [['rosalind', tr.thought('rosalind', 'Don’t look at me. Just listen.'), 0.1], ['david', tr.thought('david', 'Some day we’ll go away from here. The two of us.'), 0.35],
        ['rosalind', tr.thought('rosalind', 'Where to? It’s the Fringes all round.'), 0.3], ['david', tr.thought('david', 'Uncle says the world is bigger than Labrador.'), 0.5],
        ['rosalind', tr.thought('rosalind', 'Then — there.'), 0.75], ['rosalind', tr.thought('rosalind', 'I’m smiling now. A pity you can’t see.'), 1]];
      let warm = 0, looked = false;
      const talk = (async () => {
        for (const [who, text, w] of TALK) {
          if (looked) return;
          warm = w;
          await g.think(who, text, who === 'rosalind' ? 'rosalind' : 'narrator');
        }
        await g.wait(2000);
      })();
      looked = (await g.play(layers, { watched, warm: () => warm, until: talk })).looked;
      g.state.choices.glance = looked ? 'looked' : 'away';
      g.set('glance', looked ? 1 : 0, looked ? 1.5 : 2);
      if (looked) g.set('someone_watching', 1, 2);
      await talk;
      if (looked) {
        await g.think('rosalind', 'Don’t. They’re looking at us.');
        await g.say('narrator', 'The old woman with the stick watched us until we parted.');
        g.scale('suspicion', 1);
        g.mark('rosalind', 'looked', tr('Rosalind will remember this.'));
      } else {
        await g.say('narrator', 'I never did turn round. She went off with her parents without looking back.');
        await g.think('rosalind', 'Some day I want you to look at me. In front of everyone.');
      }
      g.set('crowd', 0, 10);
      g.set('dusk', 0.8, 12);
      await g.wait(5000);
    },
    // the voices at night: calling the others, one by one — and Anne, who doesn't want to be called
    async g => {
      await g.scene(VOICES, { count: 0, voices: 0.4, petra: 0, clouds: 0.15, david_present: 1 });
      await g.wait(1500);
      await g.say('narrator', 'At night I went up the hill and called them. One after another.');
      // a thread to each window in turn — Anne's the last; near our house, something pulls at it
      const all = g.state.choices.newcomer === 'took' ? 7 : 6;
      const anne = `farm${all + 1}`;
      const { caught } = await g.play(windows, {
        targets: Array.from({ length: all + 1 }, (_, i) => `farm${i + 1}`), petra: 0, voices: 0.4,
        onLink: async n => {
          if (n === 1) await g.think('rosalind', 'I’m here.');
          else if (n === 2) await g.think('michael', 'Here. Why so late?');
          else if (n === 7 && all === 7) await g.think('newcomer', 'And me.');
        },
      });
      if (caught) await g.say('narrator', 'Suddenly an answer came from our own house — so thin and so loud my ears rang. And at once it was gone.');
      g.set('count', all + 1);
      g.set('voices', 0.7, 4);
      await g.say('narrator', 'Then Sally and Katherine. Mark. Rachel.');
      await g.think('anne', 'Don’t call me any more. I’m marrying Alan Ervin.');
      await g.think('anne', 'I want to live like everyone else. Do you hear? Like everyone else.');
      g.set('count', all);
      await g.wait(1500);
      await g.think('michael', 'She’ll tell him. Not at once — but in a year.');
      await g.think('rosalind', 'She’s one of us. You can’t hold her by force.');
      const choice = await g.choose('anne', anne, [{ id: 'let', label: tr('Let her go') }, { id: 'axel', label: tr('Tell Axel') }]);
      if (choice === 'let') {
        await g.think('michael', 'Then we’ll pray she keeps quiet.');
        g.scale('group', -1);
        g.mark('anne', 'free', tr('Anne will remember this.'));
      } else {
        // the forge at night: he listens, his hand in his beard; then sends me to bed
        await g.scene(FORGE, { beat: 'night_anne' });
        const told = g.beat('night_anne');
        await g.say('narrator', 'I told my uncle about Anne and Alan.');
        await told;
        const sent = g.beat('night_anne_end');
        await g.say('axel', 'All right. Off to bed, Davie.');
        await sent;
        await g.say('narrator', 'A week later Alan was found by the road. With an arrow in his throat.');
        await g.say('narrator', 'My uncle asked me nothing. Nor I him.');
        await g.think('anne', 'It was you. I know it was you.');
        g.scale('group', 1);
        g.mark('anne', 'widowed', tr('Anne will remember this.'));
        await g.scene(VOICES, { count: all, voices: 0.6, petra: 0, clouds: 0.3, david_present: 1 });
        await g.wait(1500);
      }
      await g.say('narrator', 'Anne answered no more.');
      g.set('petra', 0.12, 6);
      await g.say('narrator', 'And at home, in the little room, my sister Petra was asleep.');
      if (caught) await g.say('narrator', 'I did not know yet who had answered me from our house.');
      await g.wait(3000);
    },
  ],
};
