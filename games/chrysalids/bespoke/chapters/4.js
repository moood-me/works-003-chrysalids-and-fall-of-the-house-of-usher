// IV. Петра — Petra falls into the river: her fear is a cry in every head of ours; David breathes with
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
  title: 'Петра',
  choices: [
    { id: 'river', weight: '~', title: 'Крик у реки',
      options: [{ id: 'quiet', label: 'она стихла' }, { id: 'loud', label: 'она кричала до конца' }] },
    { id: 'petra', weight: '⚑', title: 'Дар Петры',
      options: [{ id: 'hush', label: 'учить её прятать мысли' }, { id: 'free', label: 'дать ей быть собой' }] },
    { id: 'far', weight: '~', title: 'Голос из-за моря',
      options: [{ id: 'answer', label: 'ответить' }, { id: 'listen', label: 'только слушать' }] },
  ],
  titles: ['Река', 'Берег', 'Голоса: дар Петры', 'Сон о городе'], // the steps, as the author's ☰ lists them
  steps: [
    // the river («Петра у реки», in beats): her cry in every head of ours; breathing with her while running
    // down to the water and swimming after her — how loud she is when he has her is seen on the far field
    async g => {
      await g.scene(RIVER, { beat: 'pool' });
      const pool = g.beat('pool');
      await g.say('narrator', 'Весной, когда Петре было шесть, она одна ушла к реке.');
      await pool;
      const struck = g.beat('struck');
      await g.say('narrator', 'И тут в голову ударило. Не голос — страх, огромный, без слов.');
      await g.think('petra', 'Дэвид!..', 'petra');
      await struck;
      // down to her and after her, breathing for both: the beats run the minigame's time (what he tells her — before it)
      await g.think('david', 'Петра, я здесь. Дыши со мной.', 'david');
      const run = (async () => { await g.beat('edge'); await g.beat('run'); })();
      const { cry } = await g.play(calm, { until: run });
      await run;
      const river = cry <= 0.3 ? 'quiet' : 'loud';
      g.state.choices.river = river;
      // the far field: only Rosalind — or everyone sees her run
      const field = g.beat(`field_${river}`);
      if (river === 'quiet') await g.say('narrator', 'Она стихла. Дальше Розалинды её никто не услышал.');
      else await g.say('narrator', 'Взрослые не слышали ни звука. Они видели, как она бежит.');
      await field;
      const bank = g.told('out:bank');
      const out = g.beat('out');
      await bank;
      if (river === 'quiet') await g.say('narrator', 'Я вывел её на берег. Она плакала — вслух, как все дети.');
      else {
        await g.say('narrator', 'Я вывел её на берег. Она звала до последнего — и не ртом.');
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
      await g.think('rosalind', 'Это она? Твоя сестра?', 'rosalind');
      await g.say('petra', '— Я держалась. А ветка сломалась.', 'petra');
      if (loud) await g.think('rosalind', 'Её слышали все наши. А они видели, как мы бежим.', 'rosalind');
      else await g.think('rosalind', 'Она вдруг стихла. Это ты её успокоил?', 'rosalind');
      await g.think('rosalind', 'Она сильнее нас всех, Дэвид. Что мы будем с ней делать?', 'rosalind');
      await shown;
      await g.choose(null, 'david', [{ id: 'home', label: 'Нести Петру домой' }]);
      await g.beat('home');
    },
    // the hill at night: her light among ours — to teach her to hide it, or to let her be
    async g => {
      const light = Math.min(1, 0.5 + 0.25 * (g.state.scales.petra || 0)); // brighter if her scream was heard far
      const all = g.state.choices.newcomer === 'took' ? 7 : 6;
      await g.scene(VOICES, { count: 0, petra: light * 0.6, voices: 0.45, clouds: 0.15, david_present: 1 });
      await g.wait(2000);
      await g.say('narrator', 'С того дня Петра была среди нас. Её мысли гремели на всю округу.');
      // calling ours again, window by window — and her window is awake now, and pulls at every thread
      const { caught } = await g.play(windows, {
        targets: Array.from({ length: all }, (_, i) => `farm${i + 1}`), petra: light * 0.6, voices: 0.45,
        onLink: async n => { if (n === 1) await g.think('rosalind', 'Здесь. Тише, Дэвид. Она слушает.'); },
        onPetra: () => g.think('petra', 'Дэвид, это ты? Я тоже хочу с вами!', 'home'),
      });
      g.set('count', all);
      g.set('petra', light, 3);
      g.set('voices', 0.6, 3);
      if (caught) {
        await g.think('rosalind', 'Она перекричала нас всех. Одна.');
        g.scale('petra', 1, true);
      }
      if (g.state.marks.anne === 'widowed') await g.think('rosalind', 'Энн и так догадывается. Научи Петру прятать мысли, Дэвид.');
      else await g.think('rosalind', 'Научи её прятать мысли. Иначе её услышит кто-нибудь не тот.');
      await g.think('michael', 'Мы прячемся всю жизнь. Пусть хоть она будет как есть.');
      const petra = await g.choose('petra', 'home', [
        { id: 'hush', label: 'Учить прятать мысли' }, { id: 'free', label: 'Пусть зовёт' }]);
      if (petra === 'hush') {
        if (g.state.choices.calf === 'show') await g.say('narrator', 'Отец учил меня замечать отклонения. Теперь я учил сестру их прятать.');
        else await g.say('narrator', 'Каждый вечер я учил её: думай тихо, совсем тихо, будто шепчешь.');
        g.set('petra', 0.15, 8);
        await g.think('petra', 'Хорошо. Я буду маленькая-маленькая.', 'home');
        g.scale('petra', -1, true);
        g.scale('group', 1);
        g.mark('petra', 'hushed', 'Петра это запомнит.');
      } else {
        g.set('petra', 1, 4);
        g.set('voices', 0.9, 4);
        await g.think('petra', 'Дэвид! Я вас всех слышу! Всех-всех!', 'home');
        await g.think('rosalind', 'Она нас выдаст, Дэвид.');
        if (g.state.marks.sophie_night === 'stayed') await g.say('narrator', 'Однажды я уже велел себе сидеть тихо. Больше не хотел.');
        g.scale('petra', 1, true);
        g.scale('group', -1);
        g.mark('petra', 'free', 'Петра это запомнит.');
      }
      await g.wait(3000);
    },
    // someone beyond the sea hears her: as near as she is strong; the city of my dreams
    async g => {
      const p = g.state.scales.petra || 0;
      // my own dream first: the city, and a shining fish over it — followed with the eyes, so as not to wake
      await g.scene(DREAM, { dream: 0.75, craft: 0.2, lights: 0.6, waking: 0, boy_present: 1 });
      await g.wait(2000);
      await g.say('narrator', 'Мне снова снился тот город. Я вёл глазами блестящую рыбу — тихо-тихо, чтобы не проснуться.');
      const { held, broke } = await g.play(dream);
      if (broke) await g.say('narrator', 'Сон рассыпался. Я так и не разглядел башен.');
      else if (held >= 0.5) await g.say('narrator', 'Я успел разглядеть каждую башню.');
      g.set('waking', 1, 3);
      await g.wait(3000);
      g.set('lead', null);
      g.set('gaze', null);
      await g.say('narrator', 'Через месяц Петра разбудила меня среди ночи.');
      // what she shows me: as clear as she is strong
      g.set('dream', p >= 2 ? 0.95 : p >= 1 ? 0.65 : 0.3, 4);
      g.set('craft', p >= 2 ? 0.9 : p >= 1 ? 0.35 : 0, 4);
      g.set('lights', p >= 1 ? 0.8 : 0.3, 4);
      await g.say('petra', '— Дэвид, там кто-то говорит. Далеко-далеко, за водой.', 'narrator');
      g.set('waking', 0, 5);
      if (p >= 1 && held >= 0.5) await g.say('narrator', 'Она показала мне, что видит. И я узнал город из своего сна.');
      if (p >= 2) await g.think('sealand', 'Кто ты, девочка? Где ты? Ты так громко зовёшь.', 'city');
      else if (p >= 1) await g.think('sealand', '…кто ты… где…', 'city');
      else await g.say('petra', '— Я не слышу слов. Только что там кто-то есть.', 'narrator');
      const far = await g.choose('far', 'city', [
        { id: 'answer', label: 'Ответь ей' }, { id: 'listen', label: 'Не отвечай' }]);
      await g.say('david', far === 'answer' ? tr.line('david', '— Ответь ей, Петра.') : tr.line('david', '— Не отвечай. Мы не знаем, кто это.'), 'narrator');
      if (far === 'answer') {
        await g.think('petra', 'Я Петра! Я здесь!', 'narrator');
        if (p >= 1) await g.think('sealand', 'Слышу тебя. Зови меня ещё.', 'city');
        await g.think('rosalind', 'Дэвид, что это? Нас слышит кто-то чужой.');
        g.state.marks.sealand = 'answered';
        g.scale('petra', 1, true);
      } else {
        g.set('craft', 0, 6);
        await g.say('narrator', 'Петра послушалась. Голос ещё звал, всё тише, а потом пропал.');
        g.state.marks.sealand = 'heard';
      }
      g.set('waking', 1, 7);
      await g.wait(6000);
      if (p >= 1) await g.say('narrator', 'Тот город был на самом деле. Где-то за морем.');
      else await g.say('narrator', 'Я так и не понял, был ли это сон.');
      await g.wait(2000);
    },
  ],
};
