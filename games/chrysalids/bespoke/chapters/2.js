// II. Как положено — the order of the Strorm farm; the third hand (a cut hand, one word too many at the table:
// say it again and kneel, or lie and let the mother answer for it); the inspector and the calf with the wrong
// legs (David looks it over before the inspector does); the burning of the wrong wheat (singing the hymn in time
// with everyone, while a frightened voice calls in his head); the night the Wenders were found out (not stirring
// while the father reads — David holds the table's edge).
// Reads: choices.hooves (I: late — the rider saw Sophie), marks.sophie (I: told — the mother knows whom it is about).
// Leaves: choices.order right|wrong, tie help|self (~: held the hand out to the mother, or «я сам» — she takes it
//   anyway), hand truth|lie ⚑ (said it again — on his knees under the sampler; or «Ничего, отец» — the father asks
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
  title: 'Как положено',
  choices: [
    { id: 'order', weight: '~', title: 'Вечерние дела',
      options: [{ id: 'right', label: 'как положено' }, { id: 'wrong', label: 'сбился' }] },
    { id: 'tie', weight: '~', title: 'Порезанная рука',
      options: [{ id: 'help', label: 'протянуть руку матери' }, { id: 'self', label: '«я сам»' }] },
    { id: 'hand', weight: '⚑', title: '«Будь у меня ещё одна рука»',
      options: [{ id: 'truth', label: 'повторить отцу' }, { id: 'lie', label: '«Ничего, отец»' }] },
    { id: 'kneel', weight: '~', title: 'На коленях',
      options: [{ id: 'seek', label: 'искать глазами мать' }, { id: 'bow', label: 'смотреть в пол' }] },
    { id: 'calf', weight: '⚑', title: 'Телёнок',
      options: [{ id: 'show', label: 'сказать отцу' }, { id: 'hide', label: 'увести за сарай' }, { id: 'silent', label: 'промолчать' }] },
    { id: 'knees', weight: '~', title: 'На колени со всеми',
      options: [{ id: 'with', label: 'встать на колени' }, { id: 'late', label: 'опоздать' }] },
    { id: 'hymn', weight: '~', title: 'Гимн у огня',
      options: [{ id: 'loud', label: 'петь в полный голос' }, { id: 'lips', label: 'шевелить губами' }, { id: 'silent', label: 'молчать' }] },
    { id: 'stalk', weight: '~', title: 'Колос на пепелище',
      options: [{ id: 'stay', label: 'остаться у колоса' }, { id: 'go', label: 'идти с матерью' }] },
    { id: 'warn', weight: '~', title: 'Ночь перед облавой',
      options: [{ id: 'warned', label: 'предупредить Софи' }, { id: 'stayed', label: 'остаться дома' }] },
  ],
  titles: ['Вечерние дела', 'Третья рука', 'Инспектор и телёнок', 'Сожжение поля', 'Ночь перед облавой'], // the steps, as the author's ☰ lists them
  steps: [
    // the evening chores, in their order — the father watches
    async g => {
      await g.scene(FARM, { dusk: 0.45, window_lit: 1, boy_present: true, wind: 0.4 });
      await g.wait(1500);
      await g.say('narrator', 'У отца всё было как положено. Вечером — вода из колодца, потом сарай, потом молитва.');
      const ORDER = ['well', 'barn', 'house'];
      const NOW = { well: tr.line('narrator', 'Не сейчас. Сначала — вода из колодца.'), barn: tr.line('narrator', 'Не сейчас. Сначала — сарай.'), house: tr.line('narrator', 'Теперь — молитва.') };
      const AT = { well: 'well#bucket', barn: 'barn#door', house: 'house#door' };
      const offers = { [AT.well]: [{ id: 'well', label: 'Набрать воды' }], [AT.barn]: [{ id: 'barn', label: 'Закрыть сарай' }], [AT.house]: [{ id: 'house', label: 'Войти к молитве' }] };
      let wrong = false;
      for (let done = 0; done < ORDER.length;) {
        const left = Object.fromEntries(Object.entries(offers).filter(([k]) => !ORDER.slice(0, done).map(o => AT[o]).includes(k)));
        const did = await g.choose(null, left);
        if (did === ORDER[done]) { done++; continue; }
        if (!wrong) {
          wrong = true;
          await g.say('narrator', 'Отец всё видел. Он ничего не сказал — и это было хуже всего.');
        }
        await g.say('narrator', NOW[ORDER[done]]);
      }
      g.state.choices.order = wrong ? 'wrong' : 'right';
      if (wrong) g.scale('suspicion', 1);
      g.set('window_lit', 1);
      await g.wait(1000);
    },
    // the third hand (the kitchen's beats): David comes in with his hand cut, his mother binds it — and he lets slip
    // that he could have managed «if he had another hand». The father heard. Say it again and kneel under «Чти
    // образ Божий» — or lie, and the father turns to the mother.
    async g => {
      const comes = g.told('evening:in');
      await g.scene(KITCHEN, { beat: 'evening' });
      const evening = g.beat('evening');
      await comes;
      await g.say('narrator', 'В тот вечер я распорол ладонь о борону.');
      await g.say('narrator', 'Когда отец читал, в дом входили тихо.');
      await evening;
      const tie = await g.choose('tie', 'david', [{ id: 'help', label: 'Протянуть руку' }, { id: 'self', label: 'Я сам' }]);
      if (tie === 'self') {
        await g.say('david', '— Я сам.');
        const take = g.told('self:take');
        const done = g.beat('self');
        await take;
        await g.say('mother', '— Дай сюда.', 'emily');
        await done;
      } else {
        const tie = g.told('help:tie');
        const done = g.beat('help');
        await tie;
        await g.say('mother', '— Кто же так вяжет.', 'emily');
        await done;
      }
      const slip = g.beat('slip');
      await g.say('david', '— Была бы у меня ещё одна рука — я бы и сам справился.');
      await slip;
      await g.say('father', '— Что ты сказал?', 'joseph');
      const hand = await g.choose('hand', 'david', [
        { id: 'truth', label: 'Повторить' }, { id: 'lie', label: 'Ничего, отец' }]);
      if (hand === 'truth') {
        await g.say('david', '— Я сказал… будь у меня ещё одна рука…');
        const image = g.told('kneel:image'), pray = g.told('kneel:pray');
        const knelt = g.beat('kneel');
        await image;
        await g.say('father', '— Вот образ Божий. Одна голова. Две руки.', 'joseph');
        await pray;
        await g.say('father', '— Господи, прости ему слово его. Да не пожелает он иного образа.', 'joseph');
        await knelt;
        const kneel = await g.choose('kneel', 'david', [{ id: 'seek', label: 'Поднять глаза' }, { id: 'bow', label: 'Смотреть в пол' }]);
        await g.beat(kneel);
        if (kneel === 'bow') await g.say('narrator', 'Я смотрел в пол. Что она на меня тогда посмотрела, я узнал много позже.');
        const bowl = g.told('upstairs:bowl');
        const up = g.beat('upstairs');
        await g.say('father', '— Ступай наверх.', 'joseph');
        await bowl;
        await g.say('narrator', 'Мою миску в тот вечер так никто и не убрал.');
        await up;
      } else {
        await g.say('david', '— Ничего, отец.');
        await g.beat('lie');
        await g.say('father', '— Эмили. Что он сказал?', 'joseph');
        await g.beat('lie_mother');
        await g.say('mother', '— Что рука болит, Джозеф. Только и всего.', 'emily');
        g.scale('suspicion', 1);
        g.mark('mother', 'lied', 'Мать это запомнит.');
        const alone = g.told('lie_up:alone');
        const up = g.beat('lie_up');
        await g.say('father', '— Ступай наверх.', 'joseph');
        await alone;
        await g.say('narrator', 'Мать никогда прежде не лгала отцу.');
        await up;
      }
      await g.wait(1000);
    },
    // the inspector, and the calf with the wrong legs: seen before he sees it — or after
    async g => {
      await g.scene(INSPECTOR, { verdict: 0, calf_present: 1, david_present: 1, season: 0.35, cart: 0, rain: 0 });
      await g.wait(1500);
      await g.say('narrator', 'Каждую осень приезжал инспектор и решал, чему жить.');
      await g.say('narrator', 'Я смотрел из-за сарая на нашего телёнка — пока на него не посмотрел инспектор.');
      const look = await g.play(gaze);
      const show = [{ id: 'show', label: 'Сказать отцу' }];
      if (look.found) await g.say('narrator', 'Ноги у него были длинноваты. Чуть-чуть.');
      else await g.say('narrator', 'Инспектор подошёл к телёнку раньше меня. Ноги у него были длинноваты. Чуть-чуть.');
      const calf = await g.choose('calf', look.found ? { calf: [{ id: 'hide', label: 'Увести телёнка' }], joseph: show } : { joseph: show },
        { seconds: look.found ? Math.max(10, look.left + 4) : 10, late: 'silent' });
      if (calf === 'show') await g.say('david', '— Отец, у телёнка ноги не такие.');
      if (calf === 'hide') {
        g.set('calf_present', 0, 2.5);
        await g.say('narrator', 'Пока инспектор листал свою книгу, я увёл телёнка за сарай.');
        await g.say('narrator', 'Инспектор ничего не нашёл. Но работник видел, куда я его увёл.');
        g.scale('suspicion', 1);
        g.mark('calf', 'hidden', 'Работник это запомнит.');
      } else {
        if (calf === 'show') await g.say('narrator', 'Я сказал. Отец медленно повернулся ко мне.');
        else await g.say('narrator', 'Я промолчал. Инспектор заметил сам.');
        g.set('verdict', 1, 7);
        await g.wait(7500);
        if (calf === 'show') {
          await g.say('father', '— Ты смотришь в оба. Это хорошо, Дэвид.', 'joseph');
          g.mark('father', 'proud', 'Отец это запомнит.');
          g.scale('suspicion', -1);
        } else {
          await g.say('narrator', 'Телёнка увели. Отец не посмотрел в мою сторону.');
        }
      }
      await g.wait(1500);
    },
    // the burning of the wrong wheat («Сожжение поля», in beats): on the knees with everyone — or late, and
    // seen; the hymn, sung in time — or not: the scene shows it at once (the heads in front turn round; David sings by
    // his mother, or hides his face in her skirt); in the grey morning, the one stalk the fire left
    async g => {
      await g.scene(BURNING, { beat: 'dawn' });
      const dawn = g.beat('dawn');
      await g.say('narrator', 'Неправильную пшеницу жгли до рассвета, всей общиной. Спорное решал инспектор.');
      await dawn;
      const nod = g.told('ear:nod');
      const ear = g.beat('ear');
      await nod;
      await g.say('inspector', '— Мерзость.', 'in');
      await ear;
      // the torch goes up and everyone goes down on their knees: with them — or late, standing alone among them (the
      // choice's window as long as the language asks: the beat ends in its pose and holds it)
      const raise = g.beat('raise');
      const knelt = await g.choose('knees', 'dv', [{ id: 'with', label: 'Встать на колени' }], { seconds: 6.5, late: 'late' });
      if (knelt === 'with') {
        g.set('dv_kneel', true); // (down on his knees now, with them)
        await raise;
        await g.beat('rise');
      } else {
        await raise;
        const late = g.beat('kneel_late');
        await g.say('narrator', 'Все уже стояли на коленях. Все, кроме меня.');
        g.scale('suspicion', 1);
        await late;
      }
      await g.beat('light');
      const caught = g.told('fire:caught');
      const fire = g.beat('fire');
      await caught;
      await g.say('narrator', 'Пшеница занялась сразу, с треском, как солома.');
      await fire;
      // the hymn: the fire goes on spreading while it is sung (the beat's; it ends in its pose and holds it while the
      // hymn goes on)
      const still = g.told('hymn:still');
      const hymnBeat = g.beat('hymn');
      await g.say('narrator', 'Все пели. Надо было петь со всеми — в такт.');
      await still; // (the camera stands)
      const singing = g.play(hymn);
      await g.wait(10000);
      await g.think('someone', 'Дэвид… А нас — тоже так? В огонь?');
      await g.wait(4000);
      await g.think('someone', 'Не пой с ними. Пожалуйста.');
      const sung = await singing;
      await hymnBeat;
      g.state.choices.hymn = sung.hymn;
      if (sung.hymn === 'loud') {
        const shown = g.beat('hymn_loud');
        g.set('turned', 0, 1.5); // (the ones in front back to the fire)
        await g.say('narrator', 'Я пел громко, громче матери. Голос был не мой.');
        g.scale('path', -1, true);
        await shown;
      } else {
        const look = g.told('hymn_hide:look');
        const shown = g.beat('hymn_hide');
        await look;
        if (sung.hymn === 'lips') await g.say('narrator', 'Я только шевелил губами. Отец смотрел прямо на нас.');
        else await g.say('narrator', 'Я не пел. Отец смотрел прямо на нас.');
        if (sung.hymn === 'silent') g.scale('path', 1, true);
        if (sung.hymn === 'silent' || sung.turned >= 0.5) g.scale('suspicion', 1);
        g.set('turned', 0, 3); // (the eyes moved on: the heads back to the fire)
        await shown;
      }
      await g.beat('burn');
      const morning = g.beat('morning');
      await g.say('narrator', 'К утру от поля осталась серая полоса.');
      await morning;
      // by the edge of the ash: the one stalk left standing
      const stalk = await g.choose('stalk', 'dv', [{ id: 'stay', label: 'Остаться у колоса' }, { id: 'go', label: 'Идти с матерью' }],
        { seconds: 9, late: 'stay' });
      if (stalk === 'stay') {
        const pull = g.told('stalk_stay:pull');
        const shown = g.beat('stalk_stay');
        await pull;
        await g.say('mother', '— Не смотри туда, Дэвид. Пойдём.', 'em');
        g.scale('path', 1, true);
        await shown;
      } else {
        const shown = g.beat('stalk_go');
        await g.say('narrator', 'Я не оглянулся.');
        await shown;
      }
      await g.wait(1500);
    },
    // the kitchen at night: the Wenders are found out — and David may not stir while the father reads: he holds the
    // table's edge (the minigame is his hands on it); then to bed — and, maybe, down again and out to the stream
    async g => {
      await g.scene(KITCHEN, { beat: 'night' });
      await g.beat('night');
      await g.say('narrator', 'Когда отец читал, нельзя было шелохнуться.');
      await g.say('narrator', 'Я взялся за край стола и замер.');
      const reading = (async () => {
        await g.say('father', '— «И каждая нога — о двух суставах, и на ней одна ступня, и на ступне пять пальцев…»', 'joseph');
        await g.say('father', '— …и проклят всякий, кто не по образу Его.', 'joseph');
        await g.wait(2500);
        if (g.state.choices.hooves === 'late') await g.say('father', '— Всадник видел у ручья девчонку Уендеров. Босую.', 'joseph');
        await g.say('father', '— У Уендеров дочь с отклонением. Утром за ними поедут.', 'joseph');
        await g.wait(1500);
        await g.think('someone', 'Дэвид? Что с тобой? Ты весь как струна.');
        await g.wait(2500);
      })();
      const sat = await g.play(still, { while: reading });
      await reading;
      g.beat('night_after', { wait: false });
      if (sat.stirred >= 2) {
        await g.say('father', '— Сиди смирно, когда читается Слово.', 'joseph');
        g.scale('suspicion', 1);
      }
      if (g.state.marks.sophie === 'told') await g.say('narrator', 'Мать не подняла глаз. Она знала, о ком он.');
      else await g.say('narrator', 'Я смотрел в стол и считал удары сердца.');
      const warn = await g.choose('warn', 'david', [{ id: 'warned', label: 'Бежать к Уэндерам' }, { id: 'stayed', label: 'Остаться в постели' }]);
      const up = g.told('to_bed:up');
      const bed = g.beat('to_bed');
      if (warn === 'warned') {
        await up;
        await g.say('narrator', 'Я лёг не раздеваясь.');
      }
      await bed;
      if (warn === 'warned') {
        const out = g.beat('sneak');
        await g.say('narrator', 'Я дождался, пока в доме всё стихнет.');
        await out;
        // at the stream (its beat night_warn): Sophie and her mother with a bundle, already on the path
        await g.scene(BANK, { beat: 'night_warn' });
        await g.beat('night_warn');
        await g.say('david', '— Утром за вами поедут.');
        await g.say('sophie', '— Мама знает. Мы уходим к Окраинам.');
        const bye = g.beat('night_warn_bye');
        await g.say('sophie', '— Спасибо, Дэвид.');
        g.mark('sophie_night', 'warned', 'Софи это запомнит.');
        g.scale('suspicion', 1);
        await bye;
        await g.say('narrator', 'Утром дом Уендеров стоял пустой.');
      } else {
        await g.say('narrator', 'Я лежал и слушал дождь.');
        g.mark('sophie_night', 'stayed', 'Софи будет думать, что ты знал.');
        await g.say('narrator', 'Их схватили у самых Окраин. Говорили, Софи вырвалась и убежала в лес.');
      }
      await g.wait(2000);
    },
  ],
};
