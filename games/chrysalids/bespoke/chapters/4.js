// IV. Petra — Petra falls into the river: her fear is a cry in every head of ours; David breathes with
// her as he runs and swims to her (how loud she stays, the far field sees); on the bank, Rosalind across
// the water; on the hill at night, David decides whether she is
// taught to hide her thoughts; then someone very far, beyond the sea, hears her.
//
// Reads: choices.calf, marks.sophie_night, marks.anne (a line each), choices.newcomer (how many windows
// on the hill), scales.petra (how bright she is, how far she is heard).
// Leaves: choices.river quiet|loud (seen in the beats: quiet — only Rosalind runs to the river; loud — the
// rakers see her run, one follows her down, people come along the top to stare), choices.petra hush|free (⚑),
// choices.far answer|listen; marks.petra hushed|free (Petra remembers); marks.sealand answered|heard
// (the far voice: she answered it / only listened); scales: suspicion (+1 if loud), group (hush +1 /
// free −1), petra (loud +1, her signal caught on the hill +1, hush −1, free +1, answer +1) — the ship of
// chapter VII comes by it.
import calm from '../minigames/calm.js';
import dream from '../minigames/dream.js';
import windows from '../minigames/windows.js';
import { SCENES } from '../story.js';

const RIVER = SCENES.river, VOICES = SCENES.voices, DREAM = SCENES.dream;

export default {
  number: 'IV',
  title: tr('Petra'),
  choices: [
    { id: 'river', weight: '~', title: tr('The cry at the river'),
      options: [{ id: 'quiet', label: tr('she went quiet') }, { id: 'loud', label: tr('she cried to the end') }] },
    { id: 'petra', weight: '⚑', title: tr('Petra’s gift'),
      options: [{ id: 'hush', label: tr('teach her to hide her thoughts') }, { id: 'free', label: tr('let her be herself') }] },
    { id: 'far', weight: '~', title: tr('The voice from over the sea'),
      options: [{ id: 'answer', label: tr('answer') }, { id: 'listen', label: tr('only listen') }] },
  ],
  titles: ['The river', 'The bank', 'Voices: Petra’s gift', 'The dream of the city'], // the steps, as the author's map lists them
  steps: [
    // the river (“Petra at the river”, in beats): her cry in every head of ours; breathing with her while running
    // down to the water and swimming after her — how loud she is when he has her is seen on the far field
    async g => {
      await g.scene(RIVER, { beat: 'pool' });
      const pool = g.beat('pool');
      await g.say('narrator', 'In spring, when Petra was six, she went off to the river alone.');
      await pool;
      const struck = g.beat('struck');
      await g.say('narrator', 'And then it struck into my head. Not a voice — fear, enormous, without words.');
      await g.think('petra', 'David…!', 'petra');
      await struck;
      // down to her and after her, breathing for both: the beats run the minigame's time (what he tells her — before it)
      await g.think('david', 'Petra, I’m here. Breathe with me.', 'david');
      const run = (async () => { await g.beat('edge'); await g.beat('run'); })();
      const { cry } = await g.play(calm, { until: run });
      await run;
      const river = cry <= 0.3 ? 'quiet' : 'loud';
      g.state.choices.river = river;
      // the far field: only Rosalind — or everyone sees her run
      const field = g.beat(`field_${river}`);
      if (river === 'quiet') await g.say('narrator', 'She went quiet. No one farther than Rosalind heard her.');
      else await g.say('narrator', 'The grown-ups heard not a sound. They saw her run.');
      await field;
      const bank = g.told('out:bank');
      const out = g.beat('out');
      await bank;
      if (river === 'quiet') await g.say('narrator', 'I brought her out onto the bank. She was crying — out loud, like any child.');
      else {
        await g.say('narrator', 'I brought her out onto the bank. She called to the very last — and not with her mouth.');
        g.scale('suspicion', 1);
        g.scale('petra', 1, true);
      }
      await out;
      await g.wait(1500);
    },
    // the bank: Rosalind across the water — we hear each other; and whoever else has come to look
    async g => {
      const loud = g.state.choices.river === 'loud', beat = loud ? 'bank_loud' : 'bank_quiet';
      const across = g.told(`${beat}:across`);
      await g.scene(RIVER, { beat });
      const shown = g.beat(beat);
      await across;
      await g.think('rosalind', 'Is that her? Your sister?', 'rosalind');
      await g.say('petra', 'I held on. But the branch broke.', 'petra');
      if (loud) await g.think('rosalind', 'All of ours heard her. And they saw us running.', 'rosalind');
      else await g.think('rosalind', 'She went quiet all of a sudden. Was it you who calmed her?', 'rosalind');
      await g.think('rosalind', 'She’s stronger than all of us, David. What are we going to do with her?', 'rosalind');
      await shown;
      await g.choose(null, 'david', [{ id: 'home', label: tr('Carry Petra home') }]);
      await g.beat('home');
    },
    // the hill at night: her light among ours — to teach her to hide it, or to let her be
    async g => {
      const light = Math.min(1, 0.5 + 0.25 * (g.state.scales.petra || 0)); // brighter if her scream was heard far
      const all = g.state.choices.newcomer === 'took' ? 7 : 6;
      await g.scene(VOICES, { count: 0, petra: light * 0.6, voices: 0.45, clouds: 0.15, david_present: 1 });
      await g.wait(2000);
      await g.say('narrator', 'From that day Petra was among us. Her thoughts thundered all over the district.');
      // calling ours again, window by window — and her window is awake now, and pulls at every thread
      const { caught } = await g.play(windows, {
        targets: Array.from({ length: all }, (_, i) => `farm${i + 1}`), petra: light * 0.6, voices: 0.45,
        onLink: async n => { if (n === 1) await g.think('rosalind', 'Here. Quietly, David. She’s listening.'); },
        onPetra: () => g.think('petra', 'David, is that you? I want to be with you too!', 'home'),
      });
      g.set('count', all);
      g.set('petra', light, 3);
      g.set('voices', 0.6, 3);
      if (caught) {
        await g.think('rosalind', 'She shouted us all down. Alone.');
        g.scale('petra', 1, true);
      }
      if (g.state.marks.anne === 'widowed') await g.think('rosalind', 'Anne has guessed already. Teach Petra to hide her thoughts, David.');
      else await g.think('rosalind', 'Teach her to hide her thoughts. Or the wrong people will hear her.');
      await g.think('michael', 'We hide all our lives. Let her at least be as she is.');
      const petra = await g.choose('petra', 'home', [
        { id: 'hush', label: tr('Hide her thoughts') }, { id: 'free', label: tr('Let her call') }]);
      if (petra === 'hush') {
        if (g.state.choices.calf === 'show') await g.say('narrator', 'My father taught me to spot Deviations. Now I was teaching my sister to hide them.');
        else await g.say('narrator', 'Every evening I taught her: think quietly, very quietly, as if you were whispering.');
        g.set('petra', 0.15, 8);
        await g.think('petra', 'All right. I’ll be tiny, tiny.', 'home');
        g.scale('petra', -1, true);
        g.scale('group', 1);
        g.mark('petra', 'hushed', tr('Petra will remember this.'));
      } else {
        g.set('petra', 1, 4);
        g.set('voices', 0.9, 4);
        await g.think('petra', 'David! I can hear all of you! All of you!', 'home');
        await g.think('rosalind', 'She’ll give us away, David.');
        if (g.state.marks.sophie_night === 'stayed') await g.say('narrator', 'Once already I had told myself to keep quiet. I did not want to again.');
        g.scale('petra', 1, true);
        g.scale('group', -1);
        g.mark('petra', 'free', tr('Petra will remember this.'));
      }
      await g.wait(3000);
    },
    // someone beyond the sea hears her: as near as she is strong; the city of my dreams
    async g => {
      const p = g.state.scales.petra || 0;
      // my own dream first: the city, and a shining fish over it — followed with the eyes, so as not to wake
      await g.scene(DREAM, { dream: 0.75, craft: 0.2, lights: 0.6, waking: 0, boy_present: 1 });
      await g.wait(2000);
      await g.say('narrator', 'I dreamt of that city again. I followed a shining fish with my eyes — quietly, quietly, so as not to wake.');
      const { held, broke } = await g.play(dream);
      if (broke) await g.say('narrator', 'The dream fell apart. I never made out the towers.');
      else if (held >= 0.5) await g.say('narrator', 'I had time to make out every tower.');
      g.set('waking', 1, 3);
      await g.wait(3000);
      g.set('lead', null);
      g.set('gaze', null);
      await g.say('narrator', 'A month later Petra woke me in the middle of the night.');
      // what she shows me: as clear as she is strong
      g.set('dream', p >= 2 ? 0.95 : p >= 1 ? 0.65 : 0.3, 4);
      g.set('craft', p >= 2 ? 0.9 : p >= 1 ? 0.35 : 0, 4);
      g.set('lights', p >= 1 ? 0.8 : 0.3, 4);
      await g.say('petra', 'David, somebody’s talking out there. Far, far away, over the water.', 'narrator');
      g.set('waking', 0, 5);
      if (p >= 1 && held >= 0.5) await g.say('narrator', 'She showed me what she saw. And I knew the city from my dream.');
      if (p >= 2) await g.think('sealand', 'Who are you, little girl? Where are you? You call so loudly.', 'city');
      else if (p >= 1) await g.think('sealand', '…who are you… where…', 'city');
      else await g.say('petra', 'I can’t hear words. Only that somebody’s there.', 'narrator');
      const far = await g.choose('far', 'city', [
        { id: 'answer', label: tr('Answer her, Petra') }, { id: 'listen', label: tr('Don’t answer') }]);
      await g.say('david', far === 'answer' ? tr.line('david', 'Answer her, Petra.') : tr.line('david', 'Don’t answer. We don’t know who it is.'), 'narrator');
      if (far === 'answer') {
        await g.think('petra', 'I’m Petra! I’m here!', 'narrator');
        if (p >= 1) await g.think('sealand', 'I hear you. Call to me again.', 'city');
        await g.think('rosalind', 'David, what is it? Someone strange can hear us.');
        g.state.marks.sealand = 'answered';
        g.scale('petra', 1, true);
      } else {
        g.set('craft', 0, 6);
        await g.say('narrator', 'Petra did as she was told. The voice called a while longer, fainter and fainter, and then it was gone.');
        g.state.marks.sealand = 'heard';
      }
      g.set('waking', 1, 7);
      await g.wait(6000);
      if (p >= 1) await g.say('narrator', 'That city was real. Somewhere over the sea.');
      else await g.say('narrator', 'I never did know whether it was a dream.');
      await g.wait(2000);
    },
  ],
};
