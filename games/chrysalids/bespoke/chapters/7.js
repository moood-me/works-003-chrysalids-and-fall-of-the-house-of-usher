// VII. Sealand — the scene “The ship from Sealand” is played in beats (its notes.md): the children at the
// cave above the clearing, Waknuk against the Fringes; the Spider-man's arrow takes my father. I run to him
// or Rosalind holds me. If Petra was heard over the sea (VI: shipComes), the fish-ship comes: its
// threads take everyone below — whom do I cover? The woman from Sealand frees us, leads Petra to the
// ramp; Michael stays on the ledge — I fly, or stay with him. If the ship never comes, the fight ends
// otherwise: Waknuk gives way, and we are the Fringes' now.
// Reads: shipComes (marks.sealand, scales.petra); choices.fringes (VI), marks.father disowned (his
//   words), choices.glance (III), scales.group, scales.path (the ending).
// Leaves: choices.father run|stay (⚑), cover petra|rosalind|none|father|self (⚑), leave fly|stay (⚑);
//   marks.rosalind_hold slipped (I tore out of her hands), rosalind_cover covered, father saved (I lay
//   over him: he lives under the web), ending sealand|return|michael|fringes|alone — game.js shows it.
import { shipComes } from './6.js';
import { SCENES } from '../story.js';

const SHIP = SCENES.ship;

// a beat of the scene, played; → once it has ended
function play(g, beat) {
  const ended = g.heard(`beat:${beat}`);
  g.beat(beat, { wait: false });
  return ended;
}
// the scene, opened at a beat — the father as the web left him (covered: his thread barely taken, joseph_th); → once it
// is open: { ended } — the beat's end, to wait for (a promise returned bare would be awaited too)
async function open(g, beat) {
  const ended = g.heard(`beat:${beat}`);
  await g.scene(SHIP, { beat, joseph_th: g.state.marks.father === 'saved' ? 0.97 : 0 });
  return { ended };
}
const WEB = { none: 'web', petra: 'web_petra', rosalind: 'web_rosalind', father: 'web_father', self: 'web_alone' };
// whether Rosalind stays where I stay
const withMe = ({ choices, scales }) => (choices.glance === 'looked' ? 1 : 0) + (choices.father === 'run' ? 0 : 1)
  + (choices.cover === 'rosalind' ? 1 : 0) + (scales.group >= 3 ? 1 : 0) >= 2;

export const ENDINGS = [
  { id: 'sealand', label: tr('Sealand') }, { id: 'return', label: tr('The return') }, { id: 'michael', label: tr('Stayed with Michael') },
  { id: 'fringes', label: tr('The Fringes') }, { id: 'alone', label: tr('Alone') },
];
// after the last chapter (game.js): how it ended, years later
export async function epilogue(g, ending) {
  if (ending === 'sealand') {
    await g.say('narrator', 'The city of my dream turned out to be real. No one there counted toes.');
    await g.say('narrator', 'But even there they spoke of people of the old kind the way my father spoke of Deviations.');
  } else if (ending === 'return') {
    await g.say('narrator', 'Eight years later I came back to Waknuk. Unarmed.');
    await g.say('narrator', 'Michael was waiting at the ford. They listened to us. Not all of them — but they listened.');
  } else if (ending === 'michael') {
    await g.say('narrator', 'The ship went away. We stayed on the ledge — Rosalind, Michael and I.');
    await g.say('narrator', 'What came next was for us to decide now.');
  } else if (ending === 'alone') {
    await g.say('narrator', 'Rosalind flew away with Petra. I stayed with Michael.');
    await g.say('narrator', 'At night I listened to the sky. Sometimes it answered.');
  } else if (ending === 'fringes') {
    await g.say('narrator', 'The ship never came. We stayed by the Fringes.');
    await g.say('narrator', 'A year later Petra stopped calling. And I stopped waiting.');
  }
}

export default {
  number: 'VII',
  title: tr('Sealand'),
  choices: [
    { id: 'father', weight: '⚑', title: tr('My father fell'),
      options: [{ id: 'run', label: tr('run to him') }, { id: 'stay', label: tr('stay') }] },
    { id: 'cover', weight: '⚑', title: tr('Threads'),
      options: [{ id: 'petra', label: tr('cover Petra') }, { id: 'rosalind', label: tr('cover Rosalind') }, { id: 'none', label: tr('too late') },
        { id: 'father', label: tr('shield my father') }, { id: 'self', label: tr('fall beside him') }] },
    { id: 'leave', weight: '⚑', title: tr('At the ramp'),
      options: [{ id: 'fly', label: tr('fly away') }, { id: 'stay', label: tr('stay with Michael') }] },
  ],
  titles: ['The fight', 'The woman from Sealand', 'Departure'],
  steps: [
    // the fight on the clearing: my father falls — to him, or not; then the ship — or nothing in the sky
    async g => {
      const { choices, marks } = g.state;
      const { ended: cave } = await open(g, 'cave');
      await g.say('narrator', 'We lay behind a rock by the cave. Down below, on the clearing, there was shooting.');
      await cave;
      const clearing = g.told('fight:clearing');
      const fight = play(g, 'fight');
      if (choices.fringes === 'fight') await g.think('rosalind', 'We told the Spider-man where they were coming from. Too late to be sorry now.');
      await clearing;
      await g.think('rosalind', 'Your father. In front, by the horse.');
      await fight;
      const father = await g.choose('father', { david: [{ id: 'run', label: tr('Run to Father') }], rosalind: [{ id: 'stay', label: tr('Stay') }] }, { seconds: 12, late: 'stay' });
      if (father === 'stay') {
        const hold = play(g, 'hold');
        await g.think('rosalind', 'You can’t, David! You can’t help him!');
        await g.say('narrator', 'Sophie was running to the Spider-man.');
        await hold;
      } else {
        g.mark('rosalind_hold', 'slipped', tr('Rosalind will remember this.'));
        const by = g.told('run:by');
        const run = play(g, 'run');
        await g.think('rosalind', 'David! Stop!');
        await by;
        if (marks.father === 'disowned') await g.say('father', 'Don’t touch me.', 'joseph');
        else await g.say('father', 'Go, David. Get away from here.', 'joseph');
        await g.say('narrator', 'Sophie was running to the Spider-man.');
        await run;
      }
      // the sky: the ship — or nothing
      if (!shipComes(g.state)) {
        const sky = g.told('noship:sky'), flee = g.told('noship:flee');
        const none = play(g, 'noship');
        await sky;
        await g.say('narrator', 'We waited for the ship. The sky stayed empty.');
        await flee;
        await g.say('narrator', 'The Waknuk men faltered and ran for the forest. They left my father behind.');
        await none;
        await g.think('petra', 'David… She doesn’t answer any more.');
        g.state.marks.ending = 'fringes';
        await g.wait(2000);
        return;
      }
      const seen = g.told('ship:petra');
      const ship = play(g, 'ship');
      await seen;
      await g.think('petra', 'It’s her! David, it’s her!');
      await ship;
      // the threads come down: whom do I cover?
      const run = father === 'run';
      const cover = await g.choose('cover', run
        ? { joseph: [{ id: 'father', label: tr('Shield my father') }], david: [{ id: 'self', label: tr('Fall beside him') }] }
        : { petra: [{ id: 'petra', label: tr('Cover Petra') }], rosalind: [{ id: 'rosalind', label: tr('Cover Rosalind') }] },
      { seconds: 10, late: run ? 'self' : 'none' });
      const web = play(g, WEB[cover]);
      if (cover === 'petra') await g.say('narrator', 'Petra lay very still under me. The threads settled on my back.');
      else if (cover === 'rosalind') {
        g.mark('rosalind_cover', 'covered', tr('Rosalind will remember this.'));
        await g.say('narrator', 'Rosalind held Petra. I held them both.');
      } else if (cover === 'none') await g.say('narrator', 'I reached no one in time. The threads settled on everyone.');
      else if (cover === 'father') {
        g.mark('father', 'saved', tr('Father will remember this.'));
        g.scale('path', 1, true);
        await g.say('narrator', 'I lay over my father. The threads settled on me, not on him.');
      } else await g.say('narrator', 'I fell beside him. The threads settled on us both.');
      await web;
      await g.say('narrator', 'They were soft and sticky. And the more you struggled, the tighter they held.');
    },
    // the woman from Sealand: she frees us, takes Petra by the hand; at the ramp Michael stays behind
    async g => {
      const { choices, marks } = g.state;
      if (marks.ending === 'fringes') return;
      const run = choices.father === 'run';
      const down = g.told(run ? 'landing_run:down' : 'landing:down');
      const { ended: landing } = await open(g, run ? 'landing_run' : 'landing');
      await down;
      await g.say('narrator', 'It grew quiet. The ship came down in the middle of the clearing.');
      await landing;
      const runs = g.told(run ? 'free_run:petra' : 'free:petra');
      const free = play(g, run ? 'free_run' : 'free');
      await runs;
      await g.think('petra', 'It’s you! I know you!');
      await g.think('sealand_woman', 'So this is what you are like, Petra. How loudly you call.', 'sealand');
      if (run) await g.think('rosalind', 'David! Are you alive? I can hardly hear you.');
      await free;
      const by = g.told(run ? 'back_run:free' : 'back:father');
      const back = play(g, run ? 'back_run' : 'back');
      await by;
      if (run) {
        await g.think('sealand_woman', 'Brave. And foolish.', 'sealand');
        if (marks.father === 'saved') {
          await g.say('narrator', 'Under the threads my father was breathing. I saw his fingers stir.');
          await g.think('sealand_woman', 'This one I will not free. He came to kill you.', 'sealand');
        }
      } else await g.think('sealand_woman', 'Don’t pity them. Their time is over.', 'sealand');
      await back;
      await g.think('michael', 'I’m staying, David. Someone has to tell our kind that we exist.');
      await g.choose('leave', { ship: [{ id: 'fly', label: tr('Fly away') }], michael: [{ id: 'stay', label: tr('Stay with Michael') }] }, { seconds: 60, late: 'fly' });
    },
    // the door closes; the ship goes — with me, or without me
    async g => {
      const { choices, scales } = g.state;
      if (g.state.marks.ending === 'fringes') return;
      if (choices.leave === 'stay') {
        const her = withMe(g.state);
        const turn = her ? null : g.told('stay_alone:turn');
        const { ended: beat } = await open(g, her ? 'stay_ros' : 'stay_alone');
        await g.think('petra', 'David, where are you going? Are you coming with us?');
        if (her) await g.think('rosalind', 'Where you go — I go.');
        else {
          await turn;
          await g.think('rosalind', 'I can’t stay, David. Not here. Not after all this.');
        }
        await beat;
        if (!her) await play(g, 'stay_alone_away');
        g.state.marks.ending = her ? 'michael' : 'alone';
      } else {
        const look = g.told('board:look'), michael = g.told('board:michael');
        const { ended: beat } = await open(g, 'board');
        await g.think('rosalind', 'Come, David.');
        await look;
        await g.say('narrator', 'On the threshold I looked back. Once.');
        await michael;
        await g.think('michael', 'I’ll tell them. Some day they’ll begin to listen.');
        await beat;
        g.state.marks.ending = scales.path >= 2 ? 'return' : 'sealand';
      }
      await g.wait(1500);
    },
  ],
};
