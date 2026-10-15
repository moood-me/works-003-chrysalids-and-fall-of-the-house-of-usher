// I. Шесть пальцев — David meets Sophie by the stream and sees her foot; a rider on the meadow; the
// summer at the ruins of the Old People (digging out a find before the bell); at home, the mother
// asks where he has been.
// Steps 0–2 play the film «Насыпь у ручья» in its beats (its notes.md says what each one shows); the lines inside a
// beat wait for its moments (play:girl, ridge:rider…), not for seconds.
// Leaves: choices.talk hurt|whose|sit (how he spoke to her: what she answered, how she let him take the
// shoe off), hooves hid|late (late: suspicion +1), wender shush|away (the mother's look: he promised
// with a finger to his lips — she nodded back; or he looked away — she took Sophie off without a nod),
// find took|left, secret kept|told; marks.wender trusts|doubts (does Mrs Wender trust David —
// for whoever meets her again), marks.sophie kept|told.
import dig from '../minigames/dig.js';
import podol from '../minigames/podol.js';
import { SCENES } from '../story.js';

const BANK = SCENES.bank, RUINS = SCENES.ruins, FARM = SCENES.farm;

export default {
  number: 'I',
  title: 'Шесть пальцев',
  choices: [
    { id: 'talk', weight: '~', title: 'Как заговорить с Софи',
      options: [{ id: 'hurt', label: '— Тебе больно?' }, { id: 'whose', label: '— Ты чья?' }, { id: 'sit', label: 'сесть рядом' }] },
    { id: 'hooves', weight: '~', title: 'Всадник на лугу',
      options: [{ id: 'hid', label: 'успел прикрыть' }, { id: 'late', label: 'не успел' }] },
    { id: 'wender', weight: '~', title: 'Взгляд миссис Уэндер',
      options: [{ id: 'shush', label: 'палец к губам' }, { id: 'away', label: 'отвести глаза' }] },
    { id: 'find', weight: '~', title: 'Находка в руинах',
      options: [{ id: 'took', label: 'взять домой' }, { id: 'left', label: 'оставить Древним' }] },
    { id: 'secret', weight: '⚑', title: 'Тайна Софи',
      options: [{ id: 'kept', label: 'промолчать' }, { id: 'told', label: 'сказать матери' }] },
  ],
  titles: ['Насыпь у ручья', 'Копыта', 'Обещание', 'Руины Древних', 'Дома: мать спрашивает'], // the steps, as the author's ☰ lists them
  steps: [
    // the bank of the stream: sliding down the sand; a girl; her foot caught in the stones — how to speak to her
    async g => {
      const girl = g.told('play:girl');
      await g.scene(BANK, { beat: 'play' });
      const played = g.beat('play');
      await g.say('narrator', 'Мне было десять. Песчаный скат у ручья был только мой.');
      await girl;
      await g.say('narrator', 'Пока наверху, в траве, не поднялась девочка.');
      await played;
      await g.beat('play_again');
      await g.beat('stuck');
      const talk = await g.choose('talk', 'sophie', [
        { id: 'hurt', label: '— Тебе больно?' }, { id: 'whose', label: '— Ты чья? Я тебя раньше не видел.' }, { id: 'sit', label: 'Молча сесть рядом' }]);
      const shoe = g.beat('talk_' + talk);
      if (talk === 'hurt') {
        await g.say('david', '— Тебе больно?');
        await g.say('sophie', '— Больно. Только не смотри на неё.');
      }
      if (talk === 'whose') {
        await g.say('david', '— Ты чья? Я тебя раньше не видел.');
        await g.say('sophie', '— Уэндеров. Мы за холмом живём.');
        await g.say('sophie', '— Развяжи. Только осторожно.');
      }
      if (talk === 'sit') await g.say('narrator', 'Я сел рядом и ничего не сказал. Она поплакала ещё и затихла.');
      await shoe;
      const toes = g.beat('toes_bare');
      await g.say('narrator', 'На ноге было шесть пальцев.');
      await g.say('narrator', 'Каждое воскресенье отец читал нам Определения: «И каждая нога — о пяти пальцах».');
      await toes;
    },
    // the hooves: a rider on the meadow at a walk, and her foot still bare — «Подол»: her hem drawn over it before he
    // comes to where the stones are seen (the hooves heard before he shows)
    async g => {
      const rider = g.told('ridge:rider'), hem = g.told('ridge:hem'), ridge = g.told('beat:ridge');
      await g.scene(BANK, { beat: 'ridge' });
      g.beat('ridge', { wait: false }); // (cut short by «cover» if the hem is over the foot in time)
      const horse = g.sound.hooves({ gait: 'walk' });
      horse.loud(0.15, 2);
      horse.loud(0.8, 11);
      await rider;
      await g.say('narrator', 'Копыта. Нельзя, чтобы её ногу увидели.');
      await hem;
      const { hid } = await g.play(podol);
      g.state.choices.hooves = hid ? 'hid' : 'late';
      if (hid) {
        await g.beat('cover'); // (it ends once he has come to where the stones are seen)
        const gone = g.beat('ridge_pass');
        horse.loud(0.1, 12);
        await g.say('narrator', 'Всадник проехал мимо и не повернул головы.');
        await gone;
      } else {
        const held = g.told('ridge_stop:held'), on = g.told('ridge_stop:on');
        await ridge;
        const gone = g.beat('ridge_stop');
        horse.halt();
        await held;
        await g.say('narrator', 'Всадник придержал коня. Он смотрел на нас с луга — долго.');
        g.scale('suspicion', 1);
        await on;
        horse.gait('walk');
        horse.loud(0.5, 1.5);
        horse.loud(0.1, 12);
        await g.say('narrator', 'Потом тронул дальше.');
        await gone;
      }
      horse.stop(2);
    },
    // the promise: to her without words; then to her mother, who has felt the foot
    async g => {
      await g.scene(BANK, { beat: 'ask' });
      await g.beat('ask');
      await g.say('sophie', '— Обещай, что никому не скажешь.');
      await g.choose(null, 'sophie', [{ id: 'promise', label: '— Обещаю.' }]);
      const given = g.beat('promise');
      await g.say('david', '— Обещаю.');
      await given;
      const wave = g.told('mother:wave');
      const found = g.beat('mother');
      await wave;
      await g.say('sophie', '— Мама!');
      await found;
      const look = await g.choose('wender', 'mother', [{ id: 'shush', label: 'Палец к губам' }, { id: 'away', label: 'Отвести глаза' }]);
      const moment = g.told(look === 'shush' ? 'nod:nod' : 'away:gone');
      const gone = g.beat(look === 'shush' ? 'nod' : 'away');
      await moment;
      if (look === 'shush') {
        await g.say('narrator', 'Она кивнула мне. Как взрослому.');
        g.mark('wender', 'trusts', 'Миссис Уэндер это запомнит.');
      } else {
        await g.say('narrator', 'Я смотрел в песок. Когда я поднял глаза, она уже уходила — быстро, не оглядываясь.');
        g.mark('wender', 'doubts', 'Миссис Уэндер это запомнит.');
      }
      await gone;
      await g.say('narrator', 'Её звали Софи. С того дня мы виделись почти каждый день.');
      await g.wait(1500);
    },
    // the ruins of the Old People: digging out what glints, until the bell
    async g => {
      await g.scene(RUINS, { sun: 0.2, children: 1, overgrowth: 0.6, glint: 0.2, bell: 0 });
      await g.wait(1500);
      await g.say('narrator', 'Всё лето мы бегали к руинам Древних — туда, куда ходить было нельзя.');
      g.set('glint', 1, 4);
      await g.wait(4000);
      await g.say('narrator', 'В траве что-то блеснуло. Я стал разгребать землю руками.');
      const dug = await g.play(dig);
      const seen = dug.cleared >= 0.6;
      if (seen && !dug.bell) {
        await g.say('narrator', 'Гладкая пластинка с буквами Древних. Для чего она им была?');
        const guess = await Promise.race([
          g.choose(null, 'glint', [{ id: 'way', label: '— Дорогу показывать.' }, { id: 'pray', label: '— Им на неё молились.' }, { id: 'toy', label: '— Просто игрушка.' }]),
          g.wait(20000).then(() => null),
        ]);
        g.withdraw();
        if (guess === 'way') await g.say('narrator', 'Может быть. Только дороги отсюда давно никуда не вели.');
        if (guess === 'pray') await g.say('sophie', '— Тише. Услышат — нам попадёт.');
        if (guess === 'toy') await g.say('sophie', '— Ничего себе игрушки у них были.');
      }
      if (!dug.bell) {
        const find = await Promise.race([
          g.choose('find', 'glint', [{ id: 'took', label: 'Взять домой' }, { id: 'left', label: 'Оставить Древним' }]),
          g.wait(25000).then(() => null),
        ]);
        g.withdraw();
        if (find === 'took') await g.say('narrator', 'Я сунул её за пазуху.');
        if (find === 'left') {
          g.set('glint', 0.2, 3);
          await g.say('narrator', 'Пусть лежит. Древние знали так много — и всё равно всё потеряли.');
        }
        g.set('bell', 1, 3);
        g.sound.toll();
        await g.wait(3500);
      }
      await g.say('narrator', 'Издалека, из Вакнука, донёсся колокол. Пора домой.');
      if (dug.bell) {
        // the bell caught us digging: grab it as it is, or leave it
        if (!seen) await g.say('narrator', 'Я так и не откопал её до конца.');
        const find = await Promise.race([
          g.choose('find', 'glint', [{ id: 'took', label: seen ? 'Схватить её и бежать' : 'Выдернуть из земли и бежать' }, { id: 'left', label: 'Бросить и бежать' }]),
          g.wait(15000).then(() => 'left'),
        ]);
        g.withdraw();
        g.state.choices.find = find;
        g.set('glint', find === 'took' ? 0 : 0.2, 2);
        g.set('children', 0, 5);
        await g.wait(4000);
      } else await g.choose(null, 'david', [{ id: 'home', label: 'Бежать домой' }]);
    },
    // home: the mother asks — the secret
    async g => {
      await g.scene(FARM, { dusk: 0.75, window_lit: 1, boy_present: true, wind: 0.3 });
      await g.wait(1500);
      await g.say('narrator', 'Дома пахло хлебом и воском.');
      await g.say('mother', '— Где ты пропадал весь день, Дэвид?', 'house');
      const secret = await g.choose('secret', 'house#window', [
        { id: 'kept', label: '— У ручья. Один.' }, { id: 'told', label: '— Я встретил девочку. У неё на ноге шесть пальцев.' }]);
      if (secret === 'kept') {
        g.mark('sophie', 'kept', 'Софи это запомнит.');
        await g.say('mother', '— Отец спрашивал. Не опаздывай к молитве.', 'house');
      } else {
        await g.wait(1500);
        await g.say('mother', '— Никому. Слышишь? Ни отцу, ни инспектору. Никому.', 'house');
        g.mark('sophie', 'told', 'Софи об этом не узнает. Пока.');
        g.scale('suspicion', 1);
      }
      if (g.state.choices.find === 'took') await g.say('narrator', 'Ночью я спрятал пластинку Древних под половицу.');
      g.set('window_lit', 0, 4);
      await g.wait(4500);
    },
  ],
};
