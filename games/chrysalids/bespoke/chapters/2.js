// II. As it should be — the order of the Strorm farm; the third hand (a cut hand, one word too many at the table:
// say it again and kneel, or lie and let the mother answer for it); the inspector and the calf with the wrong
// legs (David looks it over before the inspector does); the burning of the deviant wheat (singing the hymn in time
// with everyone, while a frightened voice calls in his head); the night the Wenders were found out (not stirring
// while the father reads — David holds the table's edge).
// Reads: choices.hooves (I: late — the rider saw Sophie), marks.sophie (I: told — the mother knows whom it is about).
// Leaves: choices.order right|wrong, tie help|self (~: held the hand out to the mother, or “I can do it” — she takes it
//   anyway), hand truth|lie ⚑ (said it again — on his knees under the sampler; or “Nothing, Father” — the father asks
//   the mother, and she lies for him), kneel seek|bow (~: on his knees looked for the mother — she kept her eyes
//   down; or looked at the floor — and missed that she looked at him), calf show|hide|silent ⚑, hymn
//   loud|lips|silent (path −1 loud, +1 silent; suspicion +1 when silent or the people in front turned round),
//   knees with|late (~, the burning: on the knees with everyone, or late — suspicion +1), stalk stay|go (~: the
//   one stalk left in the morning; stay: path +1, quietly), warn warned|stayed; marks.mother lied (she lied to
//   the father for him), calf hidden, father proud, sophie_night; scales.suspicion (+1 for the lie: the father
//   knows he was lied to).
import gaze from '../minigames/gaze.js';
import hymn from '../minigames/hymn.js';
import still from '../minigames/still.js';
import { SCENES } from '../story.js';

const FARM = SCENES.farm, INSPECTOR = SCENES.inspector, BURNING = SCENES.burning, KITCHEN = SCENES.kitchen, BANK = SCENES.bank;

export default {
  number: 'II',
  title: tr('As it should be'),
  choices: [
    { id: 'order', weight: '~', title: tr('The evening chores'),
      options: [{ id: 'right', label: tr('as it should be') }, { id: 'wrong', label: tr('lost the order') }] },
    { id: 'tie', weight: '~', title: tr('The cut hand'),
      options: [{ id: 'help', label: tr('hold my hand out to my mother') }, { id: 'self', label: tr('“I can do it”') }] },
    { id: 'hand', weight: '⚑', title: tr('“If I had another hand”'),
      options: [{ id: 'truth', label: tr('say it again to my father') }, { id: 'lie', label: tr('“Nothing, Father”') }] },
    { id: 'kneel', weight: '~', title: tr('On my knees'),
      options: [{ id: 'seek', label: tr('look for my mother') }, { id: 'bow', label: tr('look at the floor') }] },
    { id: 'calf', weight: '⚑', title: tr('The calf'),
      options: [{ id: 'show', label: tr('tell my father') }, { id: 'hide', label: tr('lead it behind the barn') }, { id: 'silent', label: tr('keep quiet') }] },
    { id: 'knees', weight: '~', title: tr('On our knees with everyone'),
      options: [{ id: 'with', label: tr('go down on my knees') }, { id: 'late', label: tr('be late') }] },
    { id: 'hymn', weight: '~', title: tr('The hymn by the fire'),
      options: [{ id: 'loud', label: tr('sing at the top of my voice') }, { id: 'lips', label: tr('move my lips') }, { id: 'silent', label: tr('keep silent') }] },
    { id: 'stalk', weight: '~', title: tr('The stalk on the ashes'),
      options: [{ id: 'stay', label: tr('stay by the stalk') }, { id: 'go', label: tr('go with my mother') }] },
    { id: 'warn', weight: '~', title: tr('The night before the raid'),
      options: [{ id: 'warned', label: tr('warn Sophie') }, { id: 'stayed', label: tr('stay at home') }] },
  ],
  titles: ['The evening chores', 'The third hand', 'The inspector and the calf', 'The burning of the field', 'The night before the raid'], // the steps, as the author's ☰ lists them
  steps: [
    // the evening chores, in their order — the father watches
    async g => {
      await g.scene(FARM, { dusk: 0.45, window_lit: 1, boy_present: true, wind: 0.4 });
      await g.wait(1500);
      await g.say('narrator', 'With my father everything was done as it should be. In the evening — water from the well, then the barn, then prayers.');
      const ORDER = ['well', 'barn', 'house'];
      const NOW = { well: tr.line('narrator', 'Not now. First — water from the well.'), barn: tr.line('narrator', 'Not now. First — the barn.'), house: tr.line('narrator', 'Now — prayers.') };
      const AT = { well: 'well#bucket', barn: 'barn#door', house: 'house#door' };
      const offers = { [AT.well]: [{ id: 'well', label: tr('Draw water') }], [AT.barn]: [{ id: 'barn', label: tr('Shut the barn') }], [AT.house]: [{ id: 'house', label: tr('Go to prayers') }] };
      let wrong = false;
      for (let done = 0; done < ORDER.length;) {
        const left = Object.fromEntries(Object.entries(offers).filter(([k]) => !ORDER.slice(0, done).map(o => AT[o]).includes(k)));
        const did = await g.choose(null, left);
        if (did === ORDER[done]) { done++; continue; }
        if (!wrong) {
          wrong = true;
          await g.say('narrator', 'My father saw it all. He said nothing — and that was the worst of it.');
        }
        await g.say('narrator', NOW[ORDER[done]]);
      }
      g.state.choices.order = wrong ? 'wrong' : 'right';
      if (wrong) g.scale('suspicion', 1);
      g.set('window_lit', 1);
      await g.wait(1000);
    },
    // the third hand (the kitchen's beats): David comes in with his hand cut, his mother binds it — and he lets slip
    // that he could have managed «if he had another hand». The father heard. Say it again and kneel under “Honour
    // the Image” — or lie, and the father turns to the mother.
    async g => {
      const comes = g.told('evening:in');
      await g.scene(KITCHEN, { beat: 'evening' });
      const evening = g.beat('evening');
      await comes;
      await g.say('narrator', 'That evening I cut my hand open on the harrow.');
      await g.say('narrator', 'When my father was reading, one came into the house on tiptoe.');
      await evening;
      const tie = await g.choose('tie', 'david', [{ id: 'help', label: tr('Offer my hand') }, { id: 'self', label: tr('I’ll do it') }]);
      if (tie === 'self') {
        await g.say('david', 'I can do it.');
        const take = g.told('self:take');
        const done = g.beat('self');
        await take;
        await g.say('mother', 'Give it here.', 'emily');
        await done;
      } else {
        const tie = g.told('help:tie');
        const done = g.beat('help');
        await tie;
        await g.say('mother', 'That’s no way to tie it.', 'emily');
        await done;
      }
      const slip = g.beat('slip');
      await g.say('david', 'If I’d had another hand, I could have managed it myself.');
      await slip;
      await g.say('father', 'What did you say?', 'joseph');
      const hand = await g.choose('hand', 'david', [
        { id: 'truth', label: tr('Say it again') }, { id: 'lie', label: tr('Nothing, Father') }]);
      if (hand === 'truth') {
        await g.say('david', 'I said… if I had another hand…');
        const image = g.told('kneel:image'), pray = g.told('kneel:pray');
        const knelt = g.beat('kneel');
        await image;
        await g.say('father', 'This is the Image of God. One head. Two hands.', 'joseph');
        await pray;
        await g.say('father', 'Lord, forgive him his word. Let him never wish for another image.', 'joseph');
        await knelt;
        const kneel = await g.choose('kneel', 'david', [{ id: 'seek', label: tr('Raise my eyes') }, { id: 'bow', label: tr('Look down') }]);
        await g.beat(kneel);
        if (kneel === 'bow') await g.say('narrator', 'I looked at the floor. Only much later did I learn that she had looked at me then.');
        const bowl = g.told('upstairs:bowl');
        const up = g.beat('upstairs');
        await g.say('father', 'Go upstairs.', 'joseph');
        await bowl;
        await g.say('narrator', 'No one cleared away my bowl that evening.');
        await up;
      } else {
        await g.say('david', 'Nothing, Father.');
        await g.beat('lie');
        await g.say('father', 'Emily. What did he say?', 'joseph');
        await g.beat('lie_mother');
        await g.say('mother', 'That his hand hurts, Joseph. That is all.', 'emily');
        g.scale('suspicion', 1);
        g.mark('mother', 'lied', tr('Mother will remember this.'));
        const alone = g.told('lie_up:alone');
        const up = g.beat('lie_up');
        await g.say('father', 'Go upstairs.', 'joseph');
        await alone;
        await g.say('narrator', 'My mother had never lied to my father before.');
        await up;
      }
      await g.wait(1000);
    },
    // the inspector, and the calf with the wrong legs: seen before he sees it — or after
    async g => {
      await g.scene(INSPECTOR, { verdict: 0, calf_present: 1, david_present: 1, season: 0.35, cart: 0, rain: 0 });
      await g.wait(1500);
      await g.say('narrator', 'Every autumn the inspector came and decided what should live.');
      await g.say('narrator', 'I watched our calf from behind the barn — until the inspector looked at it.');
      const look = await g.play(gaze);
      const show = [{ id: 'show', label: tr('Tell my father') }];
      if (look.found) await g.say('narrator', 'Its legs were a little too long. Only a little.');
      else await g.say('narrator', 'The inspector reached the calf before I did. Its legs were a little too long. Only a little.');
      const calf = await g.choose('calf', look.found ? { calf: [{ id: 'hide', label: tr('Lead it away') }], joseph: show } : { joseph: show },
        { seconds: look.found ? Math.max(10, look.left + 4) : 10, late: 'silent' });
      if (calf === 'show') await g.say('david', 'Father, the calf’s legs aren’t right.');
      if (calf === 'hide') {
        g.set('calf_present', 0, 2.5);
        await g.say('narrator', 'While the inspector leafed through his book, I led the calf away behind the barn.');
        await g.say('narrator', 'The inspector found nothing. But the farmhand saw where I had taken it.');
        g.scale('suspicion', 1);
        g.mark('calf', 'hidden', tr('The farmhand will remember this.'));
      } else {
        if (calf === 'show') await g.say('narrator', 'I told. My father turned slowly towards me.');
        else await g.say('narrator', 'I kept quiet. The inspector saw it for himself.');
        g.set('verdict', 1, 7);
        await g.wait(7500);
        if (calf === 'show') {
          await g.say('father', 'You keep your eyes open. That is good, David.', 'joseph');
          g.mark('father', 'proud', tr('Father will remember this.'));
          g.scale('suspicion', -1);
        } else {
          await g.say('narrator', 'They took the calf away. My father did not look my way.');
        }
      }
      await g.wait(1500);
    },
    // the burning of the deviant wheat (“The burning of the field”, in beats): on the knees with everyone — or late, and
    // seen; the hymn, sung in time — or not: the scene shows it at once (the heads in front turn round; David sings by
    // his mother, or hides his face in her skirt); in the grey morning, the one stalk the fire left
    async g => {
      await g.scene(BURNING, { beat: 'dawn' });
      const dawn = g.beat('dawn');
      await g.say('narrator', 'They burned the deviant wheat till dawn, the whole community together. What was in doubt, the inspector decided.');
      await dawn;
      const nod = g.told('ear:nod');
      const ear = g.beat('ear');
      await nod;
      await g.say('inspector', 'An Offence.', 'in');
      await ear;
      // the torch goes up and everyone goes down on their knees: with them — or late, standing alone among them (the
      // choice's window as long as the language asks: the beat ends in its pose and holds it)
      const raise = g.beat('raise');
      const knelt = await g.choose('knees', 'dv', [{ id: 'with', label: tr('Kneel') }], { seconds: 6.5, late: 'late' });
      if (knelt === 'with') {
        g.set('dv_kneel', true); // (down on his knees now, with them)
        await raise;
        await g.beat('rise');
      } else {
        await raise;
        const late = g.beat('kneel_late');
        await g.say('narrator', 'Everyone was on their knees already. Everyone but me.');
        g.scale('suspicion', 1);
        await late;
      }
      await g.beat('light');
      const caught = g.told('fire:caught');
      const fire = g.beat('fire');
      await caught;
      await g.say('narrator', 'The wheat caught at once, crackling like straw.');
      await fire;
      // the hymn: the fire goes on spreading while it is sung (the beat's; it ends in its pose and holds it while the
      // hymn goes on)
      const still = g.told('hymn:still');
      const hymnBeat = g.beat('hymn');
      await g.say('narrator', 'Everyone sang. You had to sing with everyone — in time.');
      await still; // (the camera stands)
      const singing = g.play(hymn);
      await g.wait(10000);
      await g.think('someone', 'David… Will they do that to us too? Into the fire?');
      await g.wait(4000);
      await g.think('someone', 'Don’t sing with them. Please.');
      const sung = await singing;
      await hymnBeat;
      g.state.choices.hymn = sung.hymn;
      if (sung.hymn === 'loud') {
        const shown = g.beat('hymn_loud');
        g.set('turned', 0, 1.5); // (the ones in front back to the fire)
        await g.say('narrator', 'I sang loudly, louder than my mother. The voice was not mine.');
        g.scale('path', -1, true);
        await shown;
      } else {
        const look = g.told('hymn_hide:look');
        const shown = g.beat('hymn_hide');
        await look;
        if (sung.hymn === 'lips') await g.say('narrator', 'I only moved my lips. My father was looking straight at us.');
        else await g.say('narrator', 'I did not sing. My father was looking straight at us.');
        if (sung.hymn === 'silent') g.scale('path', 1, true);
        if (sung.hymn === 'silent' || sung.turned >= 0.5) g.scale('suspicion', 1);
        g.set('turned', 0, 3); // (the eyes moved on: the heads back to the fire)
        await shown;
      }
      await g.beat('burn');
      const morning = g.beat('morning');
      await g.say('narrator', 'By morning all that was left of the field was a grey strip.');
      await morning;
      // by the edge of the ash: the one stalk left standing
      const stalk = await g.choose('stalk', 'dv', [{ id: 'stay', label: tr('Stay by it') }, { id: 'go', label: tr('Go with Mother') }],
        { seconds: 9, late: 'stay' });
      if (stalk === 'stay') {
        const pull = g.told('stalk_stay:pull');
        const shown = g.beat('stalk_stay');
        await pull;
        await g.say('mother', 'Don’t look over there, David. Come along.', 'em');
        g.scale('path', 1, true);
        await shown;
      } else {
        const shown = g.beat('stalk_go');
        await g.say('narrator', 'I did not look back.');
        await shown;
      }
      await g.wait(1500);
    },
    // the kitchen at night: the Wenders are found out — and David may not stir while the father reads: he holds the
    // table's edge (the minigame is his hands on it); then to bed — and, maybe, down again and out to the stream
    async g => {
      await g.scene(KITCHEN, { beat: 'night' });
      await g.beat('night');
      await g.say('narrator', 'When my father was reading, you were not to stir.');
      await g.say('narrator', 'I took hold of the edge of the table and kept still.');
      const reading = (async () => {
        await g.say('father', '“And each leg shall have two joints and one foot, and each foot five toes…”', 'joseph');
        await g.say('father', '…and whatever is not so formed is a Blasphemy against the true Image, and hateful in the sight of God.', 'joseph');
        await g.wait(2500);
        if (g.state.choices.hooves === 'late') await g.say('father', 'A rider saw the Wender girl by the stream. Barefoot.', 'joseph');
        await g.say('father', 'The Wenders have a daughter with a Deviation. They’ll be fetched in the morning.', 'joseph');
        await g.wait(1500);
        await g.think('someone', 'David? What’s wrong with you? You’re as tight as a string.');
        await g.wait(2500);
      })();
      const sat = await g.play(still, { while: reading });
      await reading;
      g.beat('night_after', { wait: false });
      if (sat.stirred >= 2) {
        await g.say('father', 'Sit still while the Word is read.', 'joseph');
        g.scale('suspicion', 1);
      }
      if (g.state.marks.sophie === 'told') await g.say('narrator', 'My mother did not raise her eyes. She knew whom he meant.');
      else await g.say('narrator', 'I looked at the table and counted my heartbeats.');
      const warn = await g.choose('warn', 'david', [{ id: 'warned', label: tr('Warn the Wenders') }, { id: 'stayed', label: tr('Stay in bed') }]);
      const up = g.told('to_bed:up');
      const bed = g.beat('to_bed');
      if (warn === 'warned') {
        await up;
        await g.say('narrator', 'I lay down without undressing.');
      }
      await bed;
      if (warn === 'warned') {
        const out = g.beat('sneak');
        await g.say('narrator', 'I waited until the house was still.');
        await out;
        // at the stream (its beat night_warn): Sophie and her mother with a bundle, already on the path
        await g.scene(BANK, { beat: 'night_warn' });
        await g.beat('night_warn');
        await g.say('david', 'They’ll come for you in the morning.');
        await g.say('sophie', 'Mummy knows. We’re going to the Fringes.');
        const bye = g.beat('night_warn_bye');
        await g.say('sophie', 'Thank you, David.');
        g.mark('sophie_night', 'warned', tr('Sophie will remember this.'));
        g.scale('suspicion', 1);
        await bye;
        await g.say('narrator', 'In the morning the Wenders’ house stood empty.');
      } else {
        await g.say('narrator', 'I lay and listened to the rain.');
        g.mark('sophie_night', 'stayed', tr('Sophie will think you knew.'));
        await g.say('narrator', 'They were caught at the very edge of the Fringes. They said Sophie broke free and ran into the forest.');
      }
      await g.wait(2000);
    },
  ],
};
