// VI. The Fringes — the Fringes take us in at their fire. Sophie is there, grown: she hides us — or tells
// them whose son I am, and Rosalind and Petra are tied to the post. The tall one with long arms, the
// Spider, is my father's brother; he wants us against Waknuk. Then the horn: Waknuk is coming.
// Reads: marks.sophie kept|told, marks.sophie_night warned|stayed, marks.wender trusts|doubts (Mrs Wender,
//   chapter I: trusts — Sophie grew up hearing it, her trust +1); choices.shadow (seen:
//   the pursuers know where we went in); marks.sally (freed: Katherine and Sally are here);
//   marks.sealand, scales.petra (the far voice: near, or not answering — the ship of VII).
// Leaves for VII: choices.meet go|wait, sophie hid|gave (⚑, how Sophie took us), fringes fight|flee
//   (⚑ fight: we stand with the Fringes — path −1; flee: to the cave above the clearing);
//   marks.sophie_camp hid|gave; scales.path.

import { SCENES } from '../story.js';

const CAMP = SCENES.camp;

// whether Sophie hides us: what she remembers of me
const trust = ({ marks }) => (marks.sophie === 'kept' ? 1 : 0) + (marks.sophie_night === 'warned' ? 1 : 0)
  - (marks.sophie_night === 'stayed' ? 1 : 0) + (marks.wender === 'trusts' ? 1 : 0);
// whether the ship can find us: Petra answered the far voice, and she is strong enough to be heard
export const shipComes = ({ marks, scales }) => marks.sealand === 'answered' && scales.petra >= 2;

export default {
  number: 'VI',
  title: tr('The Fringes'),
  choices: [
    { id: 'meet', weight: '~', title: tr('Sophie by the hut'),
      options: [{ id: 'go', label: tr('go up to her') }, { id: 'wait', label: tr('wait by the fire') }] },
    { id: 'sophie', weight: '⚑', title: tr('Sophie'),
      options: [{ id: 'hid', label: tr('hid us') }, { id: 'gave', label: tr('told whose son I am') }] },
    { id: 'fringes', weight: '⚑', title: tr('the Spider'),
      options: [{ id: 'fight', label: tr('stand with the Fringes') }, { id: 'flee', label: tr('go to the cave') }] },
  ],
  titles: ['By the fire: Sophie', 'The Spider', 'The horn'],
  steps: [
    // the fire at dawn, the strange people; Sophie at the edge of the light
    async g => {
      const { choices, marks } = g.state;
      await g.scene(CAMP, { fire: 0.8, people: 0.8, alarm: 0, captives: 0, sophie_present: 0 });
      await g.wait(2000);
      await g.say('narrator', 'We were brought to the fire. The people round it were not like us. And not like the people in Waknuk.');
      if (choices.shadow === 'seen') await g.say('narrator', 'They knew already that we had been followed right to the fence.');
      g.set('sophie_present', 1, 4);
      await g.wait(3500);
      await g.say('narrator', 'By the farthest hut stood a girl in a faded headscarf. Barefoot.');
      await g.think('rosalind', 'Do you know her?');
      const meet = await g.choose('meet', { sophie: [{ id: 'go', label: tr('Go to Sophie') }], fire: [{ id: 'wait', label: tr('Wait here') }] });
      let t = trust(g.state);
      if (meet === 'go') {
        await g.say('narrator', 'I went up to her. She did not step back.');
        if (t === 0) t = 1; // she remembers the boy who came to her, not the one who stayed away
      } else await g.say('narrator', 'I stayed by the fire. She watched me across the whole camp.');
      if (t >= 1) {
        await g.say('sophie', 'David. I remember you.');
        if (marks.sophie_night === 'warned') await g.say('sophie', 'You came running that night. We got away in time.');
        await g.say('sophie', 'Come into my hut. Before he’s back.');
        g.state.choices.sophie = 'hid';
        g.mark('sophie_camp', 'hid', tr('Sophie hid you.'));
        g.set('people', 0.6, 4);
        await g.say('narrator', 'Until evening she let no one near us.');
      } else {
        await g.say('sophie', 'That’s Strorm’s son. Joseph Strorm’s.');
        g.state.choices.sophie = 'gave';
        g.mark('sophie_camp', 'gave', tr('Sophie did not forget.'));
        g.set('captives', 1, 3);
        await g.wait(1500);
        await g.say('narrator', 'Rosalind and Petra were tied to a post. I was taken to the one who decided things here.');
        await g.think('petra', 'David, the rope’s prickly!');
      }
      await g.wait(1500);
    },
    // the Spider: my father's brother; he wants our voices against Waknuk
    async g => {
      const { choices, marks } = g.state;
      const tied = choices.sophie === 'gave';
      await g.scene(CAMP, { fire: 0.55, people: 1, alarm: 0, captives: tied ? 1 : 0, sophie_present: 1 });
      await g.wait(2000);
      await g.say('narrator', 'In the evening a tall man came out to the fire, with long arms like a spider’s.');
      await g.say('narrator', 'He looked me over for a long time. Then he said he was my father’s brother.');
      if (marks.sally === 'freed') await g.think('sally', 'We’re here, David, Katherine and I. They leave us alone while they need us.');
      await g.say('spider', 'Your father is leading them here. You hear each other without words — you’ll be my eyes.', 'spider');
      if (tied) await g.say('spider', 'Stand with us — and I’ll let your people go.', 'spider');
      await g.think('rosalind', 'He’s just like your father, David. Only from the other side.');
      const fringes = await g.choose('fringes', { spider: [{ id: 'fight', label: tr('Stand with them') }], sophie: [{ id: 'flee', label: tied ? tr('Untie my own') : tr('To the cave') }] });
      if (fringes === 'fight') {
        g.scale('path', -1, true);
        if (tied) { g.set('captives', 0, 3); await g.say('narrator', 'He nodded, and the ropes at the post were cut.'); }
        await g.say('narrator', 'They put us by the cave above the clearing. From there you could see where they would come from.');
      } else {
        if (tied) {
          g.set('fire', 0.3, 6);
          await g.say('narrator', 'In the night the fire burned low. I crawled to the post and cut the ropes.');
          g.set('captives', 0, 2);
          await g.say('narrator', 'Sophie saw. She turned away to the fire.');
        } else await g.say('narrator', 'In the night Sophie led us out of the camp by a path even the sentries did not know.');
        await g.say('narrator', 'There was nowhere further to run. We hid in the cave above the clearing.');
      }
      await g.wait(1500);
    },
    // the horn: Waknuk is coming through the trees — and the far voice is near, or does not answer
    async g => {
      const { choices } = g.state;
      await g.scene(CAMP, { fire: 0.5, people: 1, alarm: 0, captives: 0, sophie_present: 1 });
      await g.wait(1500);
      g.set('alarm', 1, 2);
      await g.wait(1500);
      await g.say('narrator', 'At dawn a horn sounded.');
      if (choices.shadow === 'seen') await g.say('narrator', 'They were coming on our tracks — from that same fence.');
      else await g.say('narrator', 'They were coming through the forest. Many of them. With guns.');
      await g.think('rosalind', 'Your father is in front. I can hear him — not in words, I just know.');
      if (shipComes(g.state)) {
        await g.think('petra', 'David! She’s very close! She says — keep together!');
        await g.think('sealand', 'We are almost over you. Don’t scatter. A little longer.');
      } else if (g.state.marks.sealand === 'answered') {
        await g.think('petra', 'I call her and call her… She hears, but she can’t find us.');
      } else await g.say('narrator', 'Petra was silent. No one called her from over the sea.');
      g.set('sophie_present', 0, 3);
      await g.say('narrator', 'Sophie ran to where the Spider had gone.');
      await g.wait(2000);
    },
  ],
};
