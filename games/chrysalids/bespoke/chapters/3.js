// III. Голоса — uncle Axel finds out that David hears thoughts, and tells him to keep it from
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
  title: 'Голоса',
  choices: [
    { id: 'axel', weight: '~', title: 'Дядя Аксель спросил',
      options: [{ id: 'truth', label: 'показать на окно' }, { id: 'lie', label: 'помотать головой' }] },
    { id: 'newcomer', weight: '~', title: 'Чужой голос',
      options: [{ id: 'took', label: 'ответить ей' }, { id: 'left', label: 'промолчать' }] },
    { id: 'glance', weight: '~', title: 'Розалинда на площади',
      options: [{ id: 'looked', label: 'посмотреть на неё' }, { id: 'away', label: 'не смотреть' }] },
    { id: 'anne', weight: '⚑', title: 'Энн уходит',
      options: [{ id: 'let', label: 'отпустить' }, { id: 'axel', label: 'рассказать Акселю' }] },
  ],
  titles: ['Кузница', 'Рассказы Акселя', 'Учимся слышать', 'Площадь', 'Голоса: Энн уходит'], // the steps, as the author's ☰ lists them
  steps: [
    // the forge: chattering without words with someone far away — and uncle Axel sees the boy laugh at nothing
    async g => {
      await g.scene(FORGE, { beat: 'chatter' });
      const chatter = g.beat('chatter');
      await g.say('narrator', 'Дядя Аксель когда-то ходил в море. Потом повредил ногу и стал у отца кузнецом.');
      await g.say('narrator', 'Я любил сидеть у него на бочке. И болтать — с той, кого, кроме меня, никто не слышал.');
      await g.think('rosalind', 'Дэвид? Ты опять в кузнице?');
      await g.think('david', 'Ага. Дядя куёт подковы. Тут тепло.');
      await g.think('rosalind', 'А у нас корова отвязалась. Ловили всем домом.');
      await chatter;
      // the hammer stops at the top; he comes over, down on his knee: "who?"
      const noticed = g.beat('notice');
      await g.say('narrator', 'Я засмеялся вслух. Молот у дяди замер.');
      await noticed;
      await g.say('axel', '— С кем это ты, Дэви?');
      const axel = await g.choose('axel', 'david', [
        { id: 'truth', label: 'Показать на её окно' }, { id: 'lie', label: 'Помотать головой: ни с кем' }]);
      // the truth: a shape out to the window and back, under his eyes; the lie: the answer comes anyway, and my eyes jump to it
      const far = g.told('truth:window'), ask = g.told(`${axel}:ask`);
      const shown = g.beat(axel);
      if (axel === 'truth') {
        await far;
        await g.say('narrator', 'За полем светилось окно Мортонов. Там жила Розалинда.');
        await ask;
        await g.say('axel', '— Через всё поле? Без слов?');
      } else {
        await ask;
        await g.say('axel', '— Ни с кем, значит. А смотришь — туда.');
      }
      await shown;
      // the door half shut; close, on his knee: finger to the lips, a tap at the temple
      await g.beat('door');
      const finger = g.told('hush:finger');
      const hushed = g.beat('hush');
      await finger;
      await g.say('axel', '— Никому, слышишь? Ни отцу, ни матери. Ни одной живой душе.');
      await g.say('axel', '— И тем, другим, скажи то же самое.');
      await hushed;
      // a lantern in the yard: the father. Off the barrel, to the bellows — as if I'd been at them all along
      const lantern = g.beat('lantern_bellows');
      await g.say('axel', '— Отец. К мехам, Дэви. Живо.');
      await lantern;
      // the farmhand saw the calf go behind the barn (II): the father has his eye on me
      const watched = g.state.marks.calf === 'hidden';
      if (watched) await g.say('narrator', 'Работник рассказал ему про телёнка. Отец смотрел не на дядю — на меня.');
      const { broke } = await g.play(bellows, { watched });
      if (broke) {
        const lingered = g.beat('lantern_linger');
        await g.say('narrator', 'Мехи у меня сипели невпопад. Отец поднял фонарь и долго смотрел на меня.');
        g.scale('suspicion', 1);
        await lingered;
      } else {
        const away = g.told('lantern_go:away');
        const gone = g.beat('lantern_go');
        await away;
        await g.say('narrator', 'Отец постоял, кивнул дяде и ушёл.');
        await gone;
      }
      const nod = g.told('rest:nod');
      const rest = g.beat('rest');
      await nod;
      await g.say('narrator', 'Дядя ничего не сказал. Только кивнул мне через всю кузницу.');
      await rest;
      await g.wait(2000);
    },
    // Axel's stories by the fire: the world is bigger than Labrador — seen in the smoke as he tells it (the scene shows
    // the vision: vision, story; only watched)
    async g => {
      await g.scene(STORIES, { fire: 0.8, story: 0, vision: 0, dawn: 0, david_present: true });
      await g.wait(1500);
      await g.say('narrator', 'По вечерам дядя рассказывал мне о том, что видел за морем.');
      const ASK = { sea: { id: 'sea', label: '— А какое оно, море?' }, city: { id: 'city', label: '— Ты видел, где жили Древние?' }, coast: { id: 'coast', label: '— А люди там какие?' } };
      const asked = [];
      while (asked.length < 2) {
        const q = await g.choose(null, 'axel', Object.values(ASK).filter(a => !asked.includes(a.id)));
        asked.push(q);
        g.set('story', 0, 1);
        await g.wait(1000);
        g.set('vision', { sea: 1, city: 2, coast: 3 }[q]);
        g.set('story', 0.7, 4);
        if (q === 'sea') await g.say('axel', '— Больше всей нашей земли. Неделями плывёшь — и ни одного берега.');
        else if (q === 'city') await g.say('axel', '— Видел. Чёрное стекло на многие мили. Там до сих пор ничего не растёт.');
        else await g.say('axel', '— Разные. На юге есть берег, где у всех по шесть пальцев. И неправильными они считают нас.');
        // what it looked like: the vision clear in the smoke while he tells it, a while after
        await (q === 'sea' ? g.say('axel', '— А корабль у нас был высокий, на три мачты. Паруса — один над другим.')
          : q === 'city' ? g.say('axel', '— А над стеклом — башни. Выше нашей колокольни, и все надломлены.')
          : g.say('axel', '— Берег у них зелёный. Деревья тонкие, высокие, а макушки — как зонты.'));
        const held = g.wait(6000).then(() => g.set('story', 0.1, 4));
        if (q === 'city' && g.state.choices.find === 'took') {
          await g.say('narrator', 'Я показал ему пластинку из руин.');
          await g.say('axel', '— Спрячь. И отцу не показывай.');
        } else if (q === 'coast') await g.say('narrator', 'Я подумал о Софи.');
        await held;
        await g.wait(1500);
      }
      g.set('story', 0.15, 5);
      g.set('fire', 0.4, 12);
      g.set('dawn', 1, 14);
      await g.say('axel', '— Истинный образ, говоришь? А кто его видел, этот образ?');
      await g.say('axel', '— Лабрадор — это ещё не весь мир, Дэви.');
      await g.wait(3000);
    },
    // learning to hear: finding the others across the valley; the ploughman turns; a strange voice
    async g => {
      await g.scene(HEAR, { children: 2, threads: 0.5, rosalind: 1, adults_near: 0, dusk: 0 });
      await g.wait(1500);
      await g.say('narrator', 'Шли годы. Мы нашли друг друга — тех, кто слышал.');
      await g.say('narrator', 'Днём, за работой, мы учились узнавать друг друга через всю долину.');
      // whose voice is it: the valley swept like a receiver's dial, the voice known by its tune
      await g.think('anne', 'Опять полдня у верёвки с бельём. Есть тут кто-нибудь?');
      const anne = await g.play(tuning, { find: 'washer' });
      g.set('children', 3);
      await g.say('narrator', anne.caught ? 'Энн.' : 'Энн. Она нашла меня сама.');
      await g.think('michael', 'Овцы разбрелись по всему холму. Дэвид, ты где?');
      // and while I search, the ploughman turns: not a move, before he sees
      const michael = await g.play(tuning, { find: 'shepherd', watch: true, onTurn: () => g.say('narrator', 'Пахарь внизу остановил лошадь и обернулся.') });
      if (michael.seen) {
        await g.say('narrator', 'Пахарь долго смотрел на меня из-под ладони. А я стоял и смотрел в небо.');
        g.scale('suspicion', 1);
      } else {
        await g.say('narrator', 'Я снова тюкал мотыгой. Пахарь постоял и тронул лошадь.');
      }
      g.set('children', 4);
      await g.say('narrator', 'Майкл. Потом отозвался Марк — с телеги на дороге.');
      g.set('children', 5);
      g.set('threads', 0.85, 3);
      g.scale('group', 2);
      await g.wait(2500);
      g.set('adults_near', 0, 6);
      await g.wait(3000);
      // a voice none of us knew
      await g.think('newcomer', 'Кто здесь? Кто это говорит?');
      await g.think('michael', 'Не отвечай. Мы её не знаем.');
      await g.think('rosalind', 'Она там совсем одна. Как мы когда-то.');
      const answer = await Promise.race([
        g.choose('newcomer', 'david', [{ id: 'took', label: 'Ответить ей' }, { id: 'left', label: 'Промолчать' }]),
        g.wait(30000).then(() => 'left'),
      ]);
      g.withdraw();
      g.state.choices.newcomer = answer;
      if (answer === 'took') {
        g.set('children', 6);
        await g.think('newcomer', 'Я думала, я одна такая.');
        await g.think('michael', 'Теперь нас девять. И девять, кто может проговориться.');
        g.scale('group', -1);
      } else {
        await g.think('newcomer', 'Кто здесь?..');
        await g.say('narrator', 'Она звала ещё несколько вечеров. Потом перестала.');
      }
      g.set('dusk', 1, 10);
      await g.wait(6000);
    },
    // the square by the church: talking without words, not looking
    async g => {
      const watched = g.state.scales.suspicion >= 2;
      await g.scene(SQUARE, { thread: 0.3, crowd: 1, glance: 0, someone_watching: watched ? 1 : 0, dusk: 0.2 });
      await g.wait(1500);
      await g.say('narrator', 'Нам было по шестнадцать. При всех мы с Розалиндой были почти чужими.');
      if (watched) await g.say('narrator', 'Старуха у колодца в тот день не сводила с меня глаз.');
      await g.say('narrator', 'Глаза сами искали её. Я уводил их — на колодец, на церковь, куда угодно.');
      g.set('thread', 0.85, 24);
      // talking without words — and the eyes, drawn to her the warmer it gets, kept away
      const TALK = [['rosalind', 'Не смотри на меня. Просто слушай.', 0.1], ['david', 'Когда-нибудь мы уйдём отсюда. Вдвоём.', 0.35],
        ['rosalind', 'Куда? Кругом Окраины.', 0.3], ['david', 'Дядя говорит, мир больше, чем Лабрадор.', 0.5],
        ['rosalind', 'Тогда — туда.', 0.75], ['rosalind', 'Я сейчас улыбаюсь. Жаль, ты не видишь.', 1]];
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
        await g.think('rosalind', 'Не надо. На нас смотрят.');
        await g.say('narrator', 'Старуха с палкой глядела на нас, пока мы не разошлись.');
        g.scale('suspicion', 1);
        g.mark('rosalind', 'looked', 'Розалинда это запомнит.');
      } else {
        await g.say('narrator', 'Я так и не обернулся. Она ушла с родителями, не оглянувшись.');
        await g.think('rosalind', 'Когда-нибудь я хочу, чтобы ты смотрел на меня. При всех.');
      }
      g.set('crowd', 0, 10);
      g.set('dusk', 0.8, 12);
      await g.wait(5000);
    },
    // the voices at night: calling the others, one by one — and Anne, who doesn't want to be called
    async g => {
      await g.scene(VOICES, { count: 0, voices: 0.4, petra: 0, clouds: 0.15, david_present: 1 });
      await g.wait(1500);
      await g.say('narrator', 'Ночами я уходил на холм и звал их. Одного за другим.');
      // a thread to each window in turn — Anne's the last; near our house, something pulls at it
      const all = g.state.choices.newcomer === 'took' ? 7 : 6;
      const anne = `farm${all + 1}`;
      const { caught } = await g.play(windows, {
        targets: Array.from({ length: all + 1 }, (_, i) => `farm${i + 1}`), petra: 0, voices: 0.4, hint: true,
        onLink: async n => {
          if (n === 1) await g.think('rosalind', 'Я здесь.');
          else if (n === 2) await g.think('michael', 'Здесь. Что так поздно?');
          else if (n === 3) await g.say('narrator', 'Потом Салли и Кэтрин. Марк. Рейчел.');
          else if (n === 7 && all === 7) await g.think('newcomer', 'И я.');
        },
        onPetra: () => g.say('narrator', 'Из нашего дома вдруг ответили — тонко и так громко, что зазвенело в ушах. И сразу стихло.'),
      });
      g.set('count', all + 1);
      g.set('voices', 0.7, 4);
      await g.think('anne', 'Не зовите меня больше. Я выхожу за Алана Эрвина.');
      await g.think('anne', 'Я хочу жить как все. Слышите? Как все.');
      g.set('count', all);
      await g.wait(1500);
      await g.think('michael', 'Она ему скажет. Не сразу — так через год.');
      await g.think('rosalind', 'Она одна из нас. Её не удержишь силой.');
      const choice = await g.choose('anne', anne, [{ id: 'let', label: 'Отпустить её' }, { id: 'axel', label: 'Рассказать всё дяде Акселю' }]);
      if (choice === 'let') {
        await g.think('michael', 'Тогда будем молиться, чтобы она молчала.');
        g.scale('group', -1);
        g.mark('anne', 'free', 'Энн это запомнит.');
      } else {
        // the forge at night: he listens, his hand in his beard; then sends me to bed
        await g.scene(FORGE, { beat: 'night_anne' });
        const told = g.beat('night_anne');
        await g.say('narrator', 'Я рассказал дяде про Энн и Алана.');
        await told;
        const sent = g.beat('night_anne_end');
        await g.say('axel', '— Ладно. Иди спать, Дэви.');
        await sent;
        await g.say('narrator', 'Через неделю Алана нашли у дороги. Со стрелой в горле.');
        await g.say('narrator', 'Дядя ни о чём меня не спросил. Я его — тоже.');
        await g.think('anne', 'Это вы. Я знаю, что это вы.');
        g.scale('group', 1);
        g.mark('anne', 'widowed', 'Энн это запомнит.');
        await g.scene(VOICES, { count: all, voices: 0.6, petra: 0, clouds: 0.3, david_present: 1 });
        await g.wait(1500);
      }
      await g.say('narrator', 'Энн больше не отзывалась.');
      g.set('petra', 0.12, 6);
      await g.say('narrator', 'А дома, в маленькой комнате, спала моя сестра Петра.');
      if (caught) await g.say('narrator', 'Тогда я ещё не знал, кто ответил мне из нашего дома.');
      await g.wait(3000);
    },
  ],
};
