// V. Discovery — Katherine and Sally are taken; that night David flees with Petra — or first tries to
// get them out, with Axel's help. Whoever the community suspects most is caught: the trial in the
// meeting house at night, where friends pull him out (if the group holds) or he gets out himself. Then the ride with
// Rosalind and Petra (Sheba sent home, or taken along), the search on the ridge, and the last field before the
// Fringes.
// Reads: marks.anne (who gave us away), marks.mother (II: lied — she speaks up for him when the father asks),
//   marks.sophie (the mother at the window), marks.calf (the man at the forge door is the farmhand who saw the
//   calf: he watches David, the bellows forgive fewer slips), marks.petra, marks.sealand; scales.suspicion
//   (caught: ≥ 4 fleeing, ≥ 3 at the forge — a broken rhythm of the bellows adds 1 —, ≥ 2 if the farmhand
//   knows), group (≥ 3: the friends come), petra (the far voice).
// Leaves for VI–VII: choices.night flee|rescue, forge calm|force, caught free|caught, answer
//   deny|silent|truth, trial friends|dark|fire, sheba let|take, rider kill|warn|hide, shadow hid|seen (seen: the
//   pursuers know where we went into the Fringes); marks.sally left|tried|freed (Katherine and Sally:
//   freed — they went to the Fringes another way), marks.father disowned, marks.sheba let|took (Sheba
//   sent home from the ridge, or with us on a rope behind the pack horse: a horse more — and a loud one);
//   scales.path (the rider: shot −1, shot unseeing −2, waited out +1).
import shadow from '../minigames/shadow.js';
import horses from '../minigames/horses.js';
import bellows from '../minigames/bellows.js';
import { SCENES } from '../story.js';

// a step that plays only on one branch, gone to from the author's map (nothing chosen before it): it says
// so, and may be played as if that had been chosen; → whether to play it
async function onlyIf(g, text, choice, value, label) {
  if (g.state.choices[choice] !== undefined) return g.state.choices[choice] === value;
  g.note(text);
  const go = await g.choose(null, 'david', [{ id: 'play', label }, { id: 'skip', label: 'Next' }]);
  if (go === 'play') g.state.choices[choice] = value;
  return go === 'play';
}

const HALL = SCENES.hall, KITCHEN = SCENES.kitchen, FARM = SCENES.farm, FORGE = SCENES.forge, FLIGHT = SCENES.flight, EDGE = SCENES.edge;

export default {
  number: 'V',
  title: tr('Discovery'),
  choices: [
    { id: 'night', weight: '⚑', title: tr('When Katherine and Sally were taken'),
      options: [{ id: 'flee', label: tr('run now') }, { id: 'rescue', label: tr('get them out') }] },
    { id: 'forge', weight: '~', title: tr('The man with the lantern'),
      options: [{ id: 'calm', label: tr('keep the bellows’ rhythm') }, { id: 'force', label: tr('give my uncle the nod') }] },
    { id: 'caught', weight: '⚑', title: tr('Discovery'),
      options: [{ id: 'free', label: tr('got away') }, { id: 'caught', label: tr('caught') }] },
    { id: 'answer', weight: '~', title: tr('Questioning'),
      options: [{ id: 'deny', label: tr('deny it') }, { id: 'silent', label: tr('keep silent') }, { id: 'truth', label: tr('tell the truth') }] },
    { id: 'trial', weight: '⚑', title: tr('The trial'),
      options: [{ id: 'friends', label: tr('my own got me out') }, { id: 'dark', label: tr('blew out the lamp') }, { id: 'fire', label: tr('knocked over the lamp') }] },
    { id: 'sheba', weight: '~', title: tr('Sheba'),
      options: [{ id: 'let', label: tr('let her go home') }, { id: 'take', label: tr('take her along') }] },
    { id: 'rider', weight: '~', title: tr('The rider on the crest'),
      options: [{ id: 'kill', label: tr('shoot him') }, { id: 'warn', label: tr('over his head') }, { id: 'hide', label: tr('freeze in the fog') }] },
    { id: 'shadow', weight: '~', title: tr('By the shadows'),
      options: [{ id: 'hid', label: tr('went in the shadows') }, { id: 'seen', label: tr('the lantern saw us') }] },
  ],
  titles: ['Night: we are given away', 'The forge: the key', 'The trial', 'Flight', 'By the shadows'], // the steps, as the author's map lists them
  steps: [
    // the kitchen at night, years on (the kitchen's tableau `late`): Michael's news in my head, the father reading longer
    // than he used to — and, if he has grown suspicious, lifting his head from the Book (`asks`). Flee now, or get
    // them out; either way David goes up to bed as on any night (`to_bed`)
    async g => {
      const { marks, scales } = g.state;
      await g.scene(KITCHEN, { beat: 'late' });
      const late = g.beat('late');
      await g.say('narrator', 'That evening my father read longer than usual.');
      if (marks.anne === 'widowed') await g.think('michael', 'Anne is dead. She left a letter for the inspector. All our names are in it.');
      else if (marks.anne === 'free') await g.think('michael', 'Anne told Alan everything. In the morning Alan was at the inspector’s.');
      else await g.think('michael', 'We’ve been given away.');
      await g.think('michael', 'They’ve taken Katherine and Sally. They’re being questioned.');
      await g.think('sally', 'David… They’re asking about you. I won’t tell. I’ll try.');
      await late;
      if (scales.suspicion >= 3) {
        await g.beat('asks');
        await g.say('father', 'David. What are you thinking about while I read?', 'joseph');
        if (marks.mother === 'lied') await g.say('mother', 'He’s tired, Joseph. Let him go to bed.', 'emily');
      }
      await g.think('michael', 'Go tonight. With Petra. Rosalind will wait at the ford.');
      const night = await g.choose('night', 'david', [
        { id: 'flee', label: tr('Go with Petra') }, { id: 'rescue', label: tr('Free the girls') }]);
      const up = g.beat('to_bed');
      if (night === 'rescue') {
        await g.think('rosalind', 'Then I’ll wait at the ford. Till dawn — no longer.');
        g.scale('group', 1);
        await up;
        return;
      }
      await up;
      g.mark('sally', 'left', tr('Katherine and Sally will remember this.'));
      // the yard at night, Petra in my arms
      await g.scene(FARM, { dusk: 1, window_lit: 1, boy_present: true, wind: 0.5 });
      await g.wait(1500);
      await g.say('narrator', 'In the night I woke Petra and carried her out of the house.');
      await g.think('petra', 'David, where are we going?');
      await g.think('david', 'Far away. Only think quietly.');
      if (marks.petra === 'free') await g.think('petra', 'I can’t do quietly!');
      const look = await g.choose(null, { 'house#window': [{ id: 'look', label: tr('Look back') }], david: [{ id: 'go', label: tr('Don’t look back') }] });
      if (look === 'look' && marks.sophie === 'told') await g.say('narrator', 'My mother stood at the window. She watched us go, and she did not call my father.');
      else if (look === 'look') { g.set('window_lit', 0, 3); await g.say('narrator', 'The window went dark. No one in the house woke.'); }
      if (scales.suspicion >= 4) {
        const horse = g.sound.hooves({ gait: 'walk' });
        horse.loud(0.8, 4);
        await g.wait(3000);
        await g.say('narrator', 'Riders were waiting at the gate. The inspector knew whom to come for.');
        await g.think('david', 'Petra, run to the ford. To Rosalind.');
        await g.say('narrator', 'Petra slipped out of my arms and vanished into the dark. No one went after her.');
        await g.think('rosalind', 'I hear her. I’m coming to meet her.');
        horse.stop(4);
        g.state.choices.caught = 'caught';
      } else g.state.choices.caught = 'free';
      await g.wait(2000);
    },
    // (getting them out) the forge at night: Axel makes the key, I keep the bellows going — a man with a lantern
    async g => {
      if (!(await onlyIf(g, 'This step plays only if “get Katherine and Sally out” was chosen that night.', 'night', 'rescue',
        'Play as if “get them out” was chosen'))) return;
      const { marks, scales } = g.state;
      await g.scene(FORGE, { beat: 'key' });
      const key = g.beat('key');
      await g.say('narrator', 'I ran to Uncle Axel. There was no one else to go to.');
      await g.say('axel', 'They’re holding them at the inspector’s, in the cellar. The door’s locked.');
      await g.say('axel', 'I’ll make a key. And you work the bellows — let them think I’m working.');
      await key;
      await g.wait(1500);
      const stop = g.told('stranger:stop');
      const came = g.beat('stranger');
      await stop;
      await g.say('narrator', 'A man with a lantern stopped in the gateway.');
      if (marks.calf === 'hidden') await g.say('narrator', 'My father’s farmhand. The one who saw the calf.');
      await came;
      const forge = await g.choose('forge', { david: [{ id: 'calm', label: tr('Work the bellows') }], axel: [{ id: 'force', label: tr('Nod to strike') }] },
        { seconds: 20, late: 'calm' });
      if (forge === 'calm') {
        // the rhythm, and hope: he watches the anvil, the boy, the bellows
        const { broke } = await g.play(bellows, { watched: marks.calf === 'hidden', night: true });
        if (broke) g.scale('suspicion', 1);
        if (scales.suspicion >= 3 || (marks.calf === 'hidden' && scales.suspicion >= 2)) {
          // he knew: a whistle, two more lanterns out of the dark; the hammer up — and down
          const called = g.beat('caught');
          await g.say('narrator', 'He looked me in the face — and whistled. Two more came up out of the dark.');
          await g.say('narrator', 'My uncle stood there with his hammer. I shook my head: don’t.');
          await called;
          g.mark('sally', 'tried', tr('Katherine and Sally will remember this.'));
          g.state.choices.caught = 'caught';
          await g.wait(1500);
          return;
        }
        const gone = g.beat('stranger_go');
        await g.say('narrator', 'He stood a while and went away. He did not notice. Or did not want to.');
        await gone;
      } else {
        // a nod at the hammer: Axel goes to the gate, and the man falls back into the dark
        const step = g.told('strike:step');
        const struck = g.beat('strike');
        await step;
        await g.say('narrator', 'My uncle stepped towards the gate. The man had no time to turn round.');
        await struck;
        await g.wait(1000);
        await g.say('narrator', 'We dragged him into the dark. He was breathing.');
        g.scale('path', -1, true);
      }
      await g.wait(1500);
      await g.say('narrator', 'Towards morning my uncle came back alone.');
      await g.say('axel', 'They’re away. Another road, to the Fringes. Now it’s your turn, Davie.');
      g.mark('sally', 'freed', tr('Katherine and Sally will remember this.'));
      g.state.choices.caught = 'free';
      await g.wait(1500);
    },
    // (caught) the trial in the meeting house at night: the inspector at the elders' table, the men of
    // the community along the walls, the father standing apart — and the way out
    async g => {
      if (!(await onlyIf(g, 'This step plays only if David was caught: at the gate or at the forge.', 'caught', 'caught',
        'Play as if caught'))) return;
      await g.scene(HALL, { lamp: 1, spill: 0, men: 1, rush: 0, inspector_present: true, inspector_up: 0, father_present: true,
        father_away: 0, david_present: 1, david_look: 'inspector', fire_outside: 0, door: 0 });
      g.set('men', 6, 9);
      await g.wait(2000);
      await g.say('narrator', 'They brought me to the meeting-house. It was night; one lamp burned on the elders’ table.');
      await g.say('narrator', 'The men came in one by one and sat down along the walls. My father stood apart.');
      await g.say('inspector', 'The girls named you, David. Do you hear them without words?');
      const answer = await g.choose('answer', 'david', [
        { id: 'deny', label: tr('I don’t understand') }, { id: 'silent', label: tr('Keep silent') }, { id: 'truth', label: tr('I hear them') }]);
      if (answer !== 'silent') await g.say('david', answer === 'deny' ? tr.line('david', 'I don’t understand what you mean.') : tr.line('david', 'I do. And there is no sin in it.'));
      if (answer === 'deny') await g.say('inspector', 'They didn’t understand at first either.');
      if (answer === 'silent') {
        g.set('david_look', 'father');
        await g.say('father', 'Answer when you are asked.');
        g.set('david_look', 'inspector');
      }
      if (answer === 'truth') {
        g.set('david_look', 'father');
        await g.say('father', 'Then you are no son of mine.');
        g.set('father_away', 1, 2.5);
        g.mark('father', 'disowned', tr('Father will remember this.'));
        await g.wait(1500);
        g.set('david_look', 'inspector');
      }
      g.set('inspector_up', 1, 2);
      await g.wait(1200);
      await g.say('inspector', 'In the morning they’ll take you away. They’ll ask you differently there.');
      if (g.state.scales.group >= 3) {
        await g.think('rosalind', 'David. We’re close. Now.');
        g.set('fire_outside', 1, 6);
        await g.wait(2500);
        await g.say('narrator', 'Someone shouted in the yard: the barn was on fire.');
        g.set('door', 1, 1.2);
        g.set('rush', 1, 6);
        await g.say('narrator', 'Everyone rushed for the doors — the inspector, my father, the men.');
        if (g.state.choices.night === 'rescue') await g.think('rosalind', 'Petra’s with us — we got her out through the window. Run to the ford.');
        else await g.think('rosalind', 'Petra’s with me. Run to the ford.');
        await g.choose(null, 'david', [{ id: 'run', label: tr('Run') }]);
        g.state.choices.trial = 'friends';
      } else {
        await g.think('michael', 'There are too few of us, David. Get yourself out.');
        const trial = await g.choose('trial', 'lamp#flame', [{ id: 'dark', label: tr('Blow it out') }, { id: 'fire', label: tr('Knock it over') }]);
        if (trial === 'dark') {
          g.set('lamp', 0, 0.3);
          await g.say('narrator', 'In the dark my father caught me by the sleeve. I tore free.');
          g.set('david_present', 0, 1.5);
          await g.say('narrator', 'He shouted after me until I reached the gate.');
        } else {
          g.set('spill', 1, 2.5);
          await g.wait(800);
          await g.say('narrator', 'The oil flared up across the floor. Everyone rushed to put it out, and I made for the window.');
          g.set('david_present', 0, 1.5);
          g.scale('path', -1, true);
        }
        if (g.state.choices.night === 'rescue') await g.say('narrator', 'I carried Petra out through the window of her room.');
        else await g.think('rosalind', 'Petra’s with me. Run to the ford.');
      }
      await g.wait(1500);
    },
    // the ridge before dawn: Rosalind with her father's great-horses; Petra handed up into a pannier (or there
    // already, if I was caught); Sheba sent home — or taken along; over the ridge's shoulder into the hollow full
    // of fog, and the search on the crest above it: hush the horses (seen — or not); then the rider: an arrow
    // into him, over his head, or stay still in the fog
    async g => {
      const { choices, marks, scales } = g.state;
      const start = choices.forge === 'force' || choices.trial === 'dark' ? 0.45 : choices.trial === 'fire' ? 0.1 : 0.25;
      // caught, I came alone: Petra got to Rosalind without me (she fled at the gate, or the friends brought her)
      const alone = choices.caught === 'caught' && (choices.night === 'flee' || choices.trial === 'friends');
      await g.scene(FLIGHT, { beat: alone ? 'arrive_alone' : 'arrive' });
      const came = g.beat(alone ? 'arrive_alone' : 'arrive');
      if (alone) {
        await g.say('narrator', 'I took Sheba from the paddock behind the house. Petra was already waiting for me — in a pannier on Rosalind’s horse.');
        if (marks.petra === 'free') await g.think('petra', 'David! I knew you’d come!');
      } else await g.say('narrator', 'Rosalind was waiting beyond the ford, on the ridge, with her father’s two great-horses.');
      await came;
      if (!alone) await g.beat('handover');
      await g.think('michael', 'I’m staying. I’ll be among them — and I’ll listen.');
      // Sheba: home — or with us
      await g.beat('sheba_turn');
      await g.think('rosalind', 'Let her go, David. She’s no match for the great-horses. And she neighs fit to wake the whole district.');
      const sheba = await g.choose('sheba', 'david', [{ id: 'let', label: tr('Let Sheba go') }, { id: 'take', label: tr('Take Sheba') }]);
      marks.sheba = sheba === 'take' ? 'took' : 'let';
      if (sheba === 'let') {
        const off = g.told('sheba_go:gone');
        const went = g.beat('sheba_go');
        await off;
        await g.say('narrator', 'Sheba went home alone. There was no way back.');
        await went;
      } else {
        const tied = g.beat('sheba_keep');
        await g.say('narrator', 'I couldn’t. I led her back and tied her rein to the pack-horse.');
        await g.think('rosalind', 'She’ll give us away, David.');
        await tied;
      }
      await g.beat('climb');
      const armed = g.beat('bow');
      await g.think('rosalind', 'Lanterns on the road. Your father is with them.');
      if (choices.forge === 'force') await g.think('michael', 'They found that man at the forge. The whole district has turned out after you.');
      await armed;
      // over the shoulder into the fog; the search comes up onto the crest above us
      const fog = g.told('hollow:fog');
      const down = g.beat('hollow');
      await fog;
      await g.say('narrator', 'Beyond the shoulder of the ridge the road dipped into a hollow. The hollow was full of fog.');
      await down;
      await g.think('rosalind', 'We stand still. Let them go by.');
      const horse = g.sound.hooves({ gait: 'walk' });
      horse.loud(0.3, 3);
      const riders = g.told('watch:riders');
      const up = g.beat('watch');
      await riders;
      await g.say('narrator', 'Two riders with lanterns came up onto the crest.');
      await up;
      horse.loud(0.03, 2);
      const { seen } = await g.play(horses, { start, sheba: marks.sheba === 'took', petra: marks.petra === 'free', horse });
      if (seen) {
        g.beat('spotted', { wait: false });
        await g.say('narrator', 'The first one raised his lantern higher — and saw us. The second galloped back for the others.');
        await g.think('rosalind', 'He’s coming this way.');
      } else {
        g.beat('stay', { wait: false });
        await g.say('narrator', 'They shone their lanterns into the fog for a long time. Then the second turned back for the others, and the first stayed to watch the road.');
        await g.think('rosalind', 'It’ll be dawn soon. The fog will lift — and he’ll see us.');
      }
      const said = await g.choose('rider', {
        searcher: [{ id: 'kill', label: tr('Shoot him') }, { id: 'warn', label: tr('Over his head') }],
        david: [{ id: 'hide', label: tr('Freeze') }],
      }, { seconds: 20 });
      // (the time out: she will not wait for him to reach us)
      const timed = said == null, rider = said ?? (seen ? 'kill' : 'hide');
      g.state.choices.rider = rider;
      if (rider !== 'hide' && !timed) await g.think('david', rider === 'kill' ? tr.thought('david', 'Shoot him.') : tr.thought('david', 'Shoot over his head!'));
      const shot = rider === 'hide' ? null : g.told(`${rider}:shot`);
      const done = g.beat(rider);
      if (rider === 'kill') {
        if (timed) await g.say('narrator', 'I had no time to say anything. Rosalind had already drawn her bow.');
        await shot;
        await g.say('narrator', 'The rider fell. His horse went off over the crest alone.');
        await done;
        if (seen) await g.think('rosalind', 'He wouldn’t have spared us, David.');
        else await g.say('narrator', 'He never saw us at all.');
        g.scale('path', seen ? -1 : -2, true);
      } else if (rider === 'warn') {
        await shot;
        await g.say('narrator', 'The arrow whistled just over his head. The horse shied, and the rider galloped off over the crest.');
        await done;
        await g.think('rosalind', seen ? tr.thought('rosalind', 'He saw where we went.') : tr.thought('rosalind', 'Now he knows where we are.'));
      } else {
        await g.say('narrator', 'We froze. Petra clapped her little hand over her mouth.');
        await g.say('narrator', seen ? tr.line('narrator', 'He rode right up to the edge of the hollow and shone his lantern into the fog for a long time.') : tr.line('narrator', 'He rode along the edge of the hollow, shining his lantern into the fog. Very close.'));
        await done;
        await g.think('rosalind', seen ? tr.thought('rosalind', 'He saw us. He won’t come back alone.') : tr.thought('rosalind', 'We’ve lost an hour. Now they’ll reach the Fringes before us.'));
        g.scale('path', 1, true);
      }
      horse.loud(0.1, 4);
      // on, out of the hollow toward the trees
      const on = g.beat('away');
      g.set('pursuers', 0.2, 12);
      await g.say('narrator', 'By dawn the lanterns had fallen behind. By day we hid in the woods.');
      horse.stop(4);
      if (marks.sally !== 'freed') {
        await g.think('michael', 'They’ve taken Katherine and Sally away. I could do nothing.');
        if (rider === 'kill') await g.think('michael', 'That rider died. There’ll be no mercy now — not for you, not for them.');
      }
      if (marks.sealand === 'answered' && scales.petra >= 2) await g.think('sealand', 'We hear you. Hold on. We are coming.');
      else if (marks.sealand === 'answered') await g.say('petra', 'David, that lady over the water is calling again. She’s looking for us.', 'petra');
      await on;
    },
    // the last field before the Fringes: from shadow to shadow while the lantern looks for us
    async g => {
      const hard = g.state.choices.rider !== 'kill';
      await g.scene(EDGE, { glow: 0.7, mist: 0.6, figure_on_path: 0, lantern_in_field: 0 });
      await g.wait(1500);
      await g.say('narrator', 'On the second night we came out to the last field. Beyond the fence the Fringes began.');
      g.set('lantern_in_field', 1, 2);
      await g.wait(2500);
      await g.say('narrator', 'The lantern was carried by a tall man. I knew my father by his walk.');
      await g.say('narrator', 'The moon stood behind the woods, and the shadows of the trees lay across the field. We could walk along them — or while he shone his light the other way.');
      const { seen } = await g.play(shadow, {
        hard, onSeen: at => (at === 'fence' ? g.say('father', 'There they are! By the fence!', 'joseph') : g.say('father', 'There they are! In the field!', 'joseph')),
      });
      g.state.choices.shadow = seen ? 'seen' : 'hid';
      g.set('figure_on_path', 1, 4);
      if (seen) {
        g.set('lantern_in_field', 1, 1);
        await g.say('narrator', 'Behind us there was shouting, lanterns running to the fence. But no one stepped over it.');
      } else {
        g.set('lantern_in_field', 0, 5);
        await g.say('narrator', 'The lantern stood a while by the fence and turned back.');
      }
      await g.think('rosalind', 'That’s it, David. We’re in the Fringes.');
      await g.say('narrator', 'The deviant forest closed behind us.');
      await g.wait(3000);
    },
  ],
};
