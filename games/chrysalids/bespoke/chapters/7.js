// VII. Зеландия — the scene «Корабль из Зеландии» is played in beats (its notes.md): the children at the
// cave above the clearing, Waknuk against the Fringes; the Spider's arrow takes my father. I run to him
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
  { id: 'sealand', label: 'Зеландия' }, { id: 'return', label: 'Возвращение' }, { id: 'michael', label: 'Остался с Майклом' },
  { id: 'fringes', label: 'Окраины' }, { id: 'alone', label: 'Один' },
];
// after the last chapter (game.js): how it ended, years later
export async function epilogue(g, ending) {
  if (ending === 'sealand') {
    await g.say('narrator', 'Город из моего сна оказался настоящим. Там никто не считал пальцы.');
    await g.say('narrator', 'Но и там о старых людях говорили так, как отец говорил об отклонениях.');
  } else if (ending === 'return') {
    await g.say('narrator', 'Через восемь лет я вернулся в Вакнук. Без оружия.');
    await g.say('narrator', 'Майкл ждал у брода. Нас слушали. Не все — но слушали.');
  } else if (ending === 'michael') {
    await g.say('narrator', 'Корабль ушёл. Мы остались на уступе — Розалинда, Майкл и я.');
    await g.say('narrator', 'Что будет дальше, теперь решали мы сами.');
  } else if (ending === 'alone') {
    await g.say('narrator', 'Розалинда улетела с Петрой. Я остался с Майклом.');
    await g.say('narrator', 'По ночам я слушал небо. Иногда оно отвечало.');
  } else if (ending === 'fringes') {
    await g.say('narrator', 'Корабль так и не прилетел. Мы остались у Окраин.');
    await g.say('narrator', 'Через год Петра перестала звать. И я перестал ждать.');
  }
}

export default {
  number: 'VII',
  title: 'Зеландия',
  choices: [
    { id: 'father', weight: '⚑', title: 'Отец упал',
      options: [{ id: 'run', label: 'бежать к нему' }, { id: 'stay', label: 'остаться' }] },
    { id: 'cover', weight: '⚑', title: 'Нити',
      options: [{ id: 'petra', label: 'накрыть Петру' }, { id: 'rosalind', label: 'накрыть Розалинду' }, { id: 'none', label: 'не успел' },
        { id: 'father', label: 'закрыть отца' }, { id: 'self', label: 'упасть рядом' }] },
    { id: 'leave', weight: '⚑', title: 'У трапа',
      options: [{ id: 'fly', label: 'улететь' }, { id: 'stay', label: 'остаться с Майклом' }] },
  ],
  titles: ['Бой', 'Женщина из Зеландии', 'Отлёт'],
  steps: [
    // the fight on the clearing: my father falls — to him, or not; then the ship — or nothing in the sky
    async g => {
      const { choices, marks } = g.state;
      const { ended: cave } = await open(g, 'cave');
      await g.say('narrator', 'Мы лежали за камнем у пещеры. Внизу, на поляне, стреляли.');
      await cave;
      const clearing = g.told('fight:clearing');
      const fight = play(g, 'fight');
      if (choices.fringes === 'fight') await g.think('rosalind', 'Мы сказали Пауку, откуда они идут. Теперь поздно жалеть.');
      await clearing;
      await g.think('rosalind', 'Твой отец. Впереди, у коня.');
      await fight;
      const father = await g.choose('father', { david: [{ id: 'run', label: 'Бежать к отцу' }], rosalind: [{ id: 'stay', label: 'Остаться' }] }, { seconds: 12, late: 'stay' });
      if (father === 'stay') {
        const hold = play(g, 'hold');
        await g.think('rosalind', 'Нельзя, Дэвид! Ты ему не поможешь!');
        await g.say('narrator', 'К Пауку бежала Софи.');
        await hold;
      } else {
        g.mark('rosalind_hold', 'slipped', 'Розалинда это запомнит.');
        const by = g.told('run:by');
        const run = play(g, 'run');
        await g.think('rosalind', 'Дэвид! Стой!');
        await by;
        if (marks.father === 'disowned') await g.say('father', '— Не трогай меня.', 'joseph');
        else await g.say('father', '— Уходи, Дэвид. Уходи отсюда.', 'joseph');
        await g.say('narrator', 'К Пауку бежала Софи.');
        await run;
      }
      // the sky: the ship — or nothing
      if (!shipComes(g.state)) {
        const sky = g.told('noship:sky'), flee = g.told('noship:flee');
        const none = play(g, 'noship');
        await sky;
        await g.say('narrator', 'Мы ждали корабль. Небо оставалось пустым.');
        await flee;
        await g.say('narrator', 'Люди Вакнука дрогнули и побежали к лесу. Отца они оставили.');
        await none;
        await g.think('petra', 'Дэвид… Она больше не отвечает.');
        g.state.marks.ending = 'fringes';
        await g.wait(2000);
        return;
      }
      const seen = g.told('ship:petra');
      const ship = play(g, 'ship');
      await seen;
      await g.think('petra', 'Это она! Дэвид, это она!');
      await ship;
      // the threads come down: whom do I cover?
      const run = father === 'run';
      const cover = await g.choose('cover', run
        ? { joseph: [{ id: 'father', label: 'Закрыть отца' }], david: [{ id: 'self', label: 'Упасть рядом' }] }
        : { petra: [{ id: 'petra', label: 'Накрыть Петру' }], rosalind: [{ id: 'rosalind', label: 'Накрыть Розалинду' }] },
      { seconds: 10, late: run ? 'self' : 'none' });
      const web = play(g, WEB[cover]);
      if (cover === 'petra') await g.say('narrator', 'Петра лежала подо мной тихо-тихо. Нити ложились мне на спину.');
      else if (cover === 'rosalind') {
        g.mark('rosalind_cover', 'covered', 'Розалинда это запомнит.');
        await g.say('narrator', 'Розалинда держала Петру. Я держал их обеих.');
      } else if (cover === 'none') await g.say('narrator', 'Я не успел ни к кому. Нити легли на всех.');
      else if (cover === 'father') {
        g.mark('father', 'saved', 'Отец это запомнит.');
        g.scale('path', 1, true);
        await g.say('narrator', 'Я лёг на отца. Нити ложились на меня, а не на него.');
      } else await g.say('narrator', 'Я упал рядом с ним. Нити легли на нас обоих.');
      await web;
      await g.say('narrator', 'Они были мягкие и липкие. И чем больше бьёшься, тем крепче держат.');
    },
    // the woman from Sealand: she frees us, takes Petra by the hand; at the ramp Michael stays behind
    async g => {
      const { choices, marks } = g.state;
      if (marks.ending === 'fringes') return;
      const run = choices.father === 'run';
      const down = g.told(run ? 'landing_run:down' : 'landing:down');
      const { ended: landing } = await open(g, run ? 'landing_run' : 'landing');
      await down;
      await g.say('narrator', 'Стало тихо. Корабль опустился посреди поляны.');
      await landing;
      const runs = g.told(run ? 'free_run:petra' : 'free:petra');
      const free = play(g, run ? 'free_run' : 'free');
      await runs;
      await g.think('petra', 'Это ты! Я тебя знаю!');
      await g.say('sealand', '— Вот ты какая, Петра. Как же громко ты зовёшь.');
      if (run) await g.think('rosalind', 'Дэвид! Ты живой? Я тебя почти не слышу.');
      await free;
      const by = g.told(run ? 'back_run:free' : 'back:father');
      const back = play(g, run ? 'back_run' : 'back');
      await by;
      if (run) {
        await g.say('sealand', '— Смело. И глупо.');
        if (marks.father === 'saved') {
          await g.say('narrator', 'Под нитями отец дышал. Я видел, как шевельнулись его пальцы.');
          await g.say('sealand', '— Этого я освобождать не стану. Он пришёл вас убить.');
        }
      } else await g.say('sealand', '— Не жалей их. Их время прошло.');
      await back;
      await g.think('michael', 'Я остаюсь, Дэвид. Кто-то должен рассказать нашим, что мы есть.');
      await g.choose('leave', { ship: [{ id: 'fly', label: 'Улететь' }], michael: [{ id: 'stay', label: 'Остаться с Майклом' }] }, { seconds: 60, late: 'fly' });
    },
    // the door closes; the ship goes — with me, or without me
    async g => {
      const { choices, scales } = g.state;
      if (g.state.marks.ending === 'fringes') return;
      if (choices.leave === 'stay') {
        const her = withMe(g.state);
        const turn = her ? null : g.told('stay_alone:turn');
        const { ended: beat } = await open(g, her ? 'stay_ros' : 'stay_alone');
        await g.think('petra', 'Дэвид, ты куда? Ты с нами?');
        if (her) await g.think('rosalind', 'Куда ты — туда и я.');
        else {
          await turn;
          await g.think('rosalind', 'Я не могу остаться, Дэвид. Не здесь. Не после всего.');
        }
        await beat;
        if (!her) await play(g, 'stay_alone_away');
        g.state.marks.ending = her ? 'michael' : 'alone';
      } else {
        const look = g.told('board:look'), michael = g.told('board:michael');
        const { ended: beat } = await open(g, 'board');
        await g.think('rosalind', 'Пойдём, Дэвид.');
        await look;
        await g.say('narrator', 'На пороге я оглянулся. Один раз.');
        await michael;
        await g.think('michael', 'Я им расскажу. Когда-нибудь они станут слушать.');
        await beat;
        g.state.marks.ending = scales.path >= 2 ? 'return' : 'sealand';
      }
      await g.wait(1500);
    },
  ],
};
