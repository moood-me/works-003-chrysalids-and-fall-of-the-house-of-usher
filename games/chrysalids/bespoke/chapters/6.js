// VI. Окраины — the Fringes take us in at their fire. Sophie is there, grown: she hides us — or tells
// them whose son I am, and Rosalind and Petra are tied to the post. The tall one with long arms, the
// Spider, is my father's brother; he wants us against Waknuk. Then the horn: Waknuk is coming.
// Reads: marks.sophie kept|told, marks.sophie_night warned|stayed, marks.wender trusts|doubts (Mrs Wender,
//   chapter I: trusts — Sophie grew up hearing it, her trust +1); choices.shadow (seen:
//   the pursuers know where we went in); marks.sally (freed: Katherine and Sally are here);
//   marks.sealand, scales.petra (the far voice: near, or not answering — the ship of VII).
// Leaves for VII: choices.meet go|wait, sophie hid|gave (⚑, how Sophie took us), fringes fight|flee
//   (⚑ fight: we stand with the Fringes — path −1; flee: to the cave above the clearing);
//   marks.sophie_camp hid|gave; scales.path.

const CAMP = 'Лагерь Окраин';

// whether Sophie hides us: what she remembers of me
const trust = ({ marks }) => (marks.sophie === 'kept' ? 1 : 0) + (marks.sophie_night === 'warned' ? 1 : 0)
  - (marks.sophie_night === 'stayed' ? 1 : 0) + (marks.wender === 'trusts' ? 1 : 0);
// whether the ship can find us: Petra answered the far voice, and she is strong enough to be heard
export const shipComes = ({ marks, scales }) => marks.sealand === 'answered' && scales.petra >= 2;

export default {
  number: 'VI',
  title: 'Окраины',
  choices: [
    { id: 'meet', weight: '~', title: 'Софи у шалаша',
      options: [{ id: 'go', label: 'подойти к ней' }, { id: 'wait', label: 'ждать у костра' }] },
    { id: 'sophie', weight: '⚑', title: 'Софи',
      options: [{ id: 'hid', label: 'спрятала нас' }, { id: 'gave', label: 'сказала, чей я сын' }] },
    { id: 'fringes', weight: '⚑', title: 'Паук',
      options: [{ id: 'fight', label: 'встать с Окраинами' }, { id: 'flee', label: 'уйти к пещере' }] },
  ],
  titles: ['У костра: Софи', 'Паук', 'Рог'],
  steps: [
    // the fire at dawn, the strange people; Sophie at the edge of the light
    async g => {
      const { choices, marks } = g.state;
      await g.scene(CAMP, { fire: 0.8, people: 0.8, alarm: 0, captives: 0, sophie_present: 0 });
      await g.wait(2000);
      await g.say('narrator', 'Нас вывели к костру. Люди у огня были не такие, как мы. И не такие, как в Вакнуке.');
      if (choices.shadow === 'seen') await g.say('narrator', 'Они уже знали, что за нами шли до самой изгороди.');
      g.set('sophie_present', 1, 4);
      await g.wait(3500);
      await g.say('narrator', 'У крайнего шалаша стояла девушка в выцветшем платке. Босая.');
      await g.think('rosalind', 'Ты её знаешь?');
      const meet = await g.choose('meet', { sophie: [{ id: 'go', label: 'Подойти к Софи' }], fire: [{ id: 'wait', label: 'Ждать у костра' }] });
      let t = trust(g.state);
      if (meet === 'go') {
        await g.say('narrator', 'Я подошёл. Она не отступила.');
        if (t === 0) t = 1; // she remembers the boy who came to her, not the one who stayed away
      } else await g.say('narrator', 'Я остался у огня. Она смотрела на меня через весь лагерь.');
      if (t >= 1) {
        await g.say('sophie', '— Дэвид. Я тебя помню.');
        if (marks.sophie_night === 'warned') await g.say('sophie', '— Ты тогда прибежал ночью. Мы успели.');
        await g.say('sophie', '— Идите ко мне в шалаш. Пока он не вернулся.');
        g.state.choices.sophie = 'hid';
        g.mark('sophie_camp', 'hid', 'Софи спрятала вас.');
        g.set('people', 0.6, 4);
        await g.say('narrator', 'До вечера она никого к нам не пускала.');
      } else {
        await g.say('sophie', '— Это сын Строрма. Того самого.');
        g.state.choices.sophie = 'gave';
        g.mark('sophie_camp', 'gave', 'Софи не забыла.');
        g.set('captives', 1, 3);
        await g.wait(1500);
        await g.say('narrator', 'Розалинду и Петру привязали к столбу. Меня повели к тому, кто здесь решал.');
        await g.think('petra', 'Дэвид, верёвка колется!');
      }
      await g.wait(1500);
    },
    // the Spider: my father's brother; he wants our voices against Waknuk
    async g => {
      const { choices, marks } = g.state;
      const tied = choices.sophie === 'gave';
      await g.scene(CAMP, { fire: 0.55, people: 1, alarm: 0, captives: tied ? 1 : 0, sophie_present: 1 });
      await g.wait(2000);
      await g.say('narrator', 'Вечером к огню вышел высокий человек с длинными, как у паука, руками.');
      await g.say('narrator', 'Он долго разглядывал меня. Потом сказал, что он брат моего отца.');
      if (marks.sally === 'freed') await g.think('sally', 'Мы здесь, Дэвид, Кэтрин и я. Нас не трогают, пока мы им нужны.');
      await g.say('spider', '— Твой отец ведёт их сюда. Вы слышите друг друга без слов — будете моими глазами.', 'people');
      if (tied) await g.say('spider', '— Будешь с нами — отпущу твоих.', 'people');
      await g.think('rosalind', 'Он такой же, как твой отец, Дэвид. Только с другой стороны.');
      const fringes = await g.choose('fringes', { people: [{ id: 'fight', label: 'Встать с Окраинами' }], sophie: [{ id: 'flee', label: tied ? 'Ночью развязать своих и уйти' : 'Уйти в лес, к пещере' }] });
      if (fringes === 'fight') {
        g.scale('path', -1, true);
        if (tied) { g.set('captives', 0, 3); await g.say('narrator', 'Он кивнул, и верёвки у столба разрезали.'); }
        await g.say('narrator', 'Нас поставили у пещеры над поляной. Оттуда было видно, откуда они придут.');
      } else {
        if (tied) {
          g.set('fire', 0.3, 6);
          await g.say('narrator', 'Ночью костёр прогорел. Я подполз к столбу и перерезал верёвки.');
          g.set('captives', 0, 2);
          await g.say('narrator', 'Софи видела. Она отвернулась к огню.');
        } else await g.say('narrator', 'Ночью Софи вывела нас из лагеря тропой, которой не знали даже часовые.');
        await g.say('narrator', 'Бежать дальше было некуда. Мы укрылись в пещере над поляной.');
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
      await g.say('narrator', 'На рассвете затрубил рог.');
      if (choices.shadow === 'seen') await g.say('narrator', 'Они шли по нашим следам — от той самой изгороди.');
      else await g.say('narrator', 'Они шли через лес. Много. С ружьями.');
      await g.think('rosalind', 'Твой отец впереди. Я его слышу — не словами, просто знаю.');
      if (shipComes(g.state)) {
        await g.think('petra', 'Дэвид! Она совсем близко! Она говорит — держитесь вместе!');
        await g.think('sealand', 'Мы почти над вами. Не разбегайтесь. Ещё немного.');
      } else if (g.state.marks.sealand === 'answered') {
        await g.think('petra', 'Я зову её, зову… Она слышит, но не может найти.');
      } else await g.say('narrator', 'Петра молчала. Её никто не звал из-за моря.');
      g.set('sophie_present', 0, 3);
      await g.say('narrator', 'Софи побежала туда, куда ушёл Паук.');
      await g.wait(2000);
    },
  ],
};
