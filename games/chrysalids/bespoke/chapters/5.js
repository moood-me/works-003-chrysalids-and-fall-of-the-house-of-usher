// V. Раскрытие — Katherine and Sally are taken; that night David flees with Petra — or first tries to
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
//   deny|silent|truth, trial friends|dark|fire, rider kill|warn|hide, shadow hid|seen (seen: the
//   pursuers know where we went into the Fringes); marks.sally left|tried|freed (Katherine and Sally:
//   freed — they went to the Fringes another way), marks.father disowned, marks.sheba let|took (Sheba
//   sent home from the ridge, or with us on a rope behind the pack horse: a horse more — and a loud one);
//   scales.path (the rider: shot −1, shot unseeing −2, waited out +1).
import shadow from '../minigames/shadow.js';
import horses from '../minigames/horses.js';
import bellows from '../minigames/bellows.js';
import { SCENES } from '../story.js';

// a step that plays only on one branch, gone to from the author's ☰ (nothing chosen before it): it says
// so, and may be played as if that had been chosen; → whether to play it
async function onlyIf(g, text, choice, value, label) {
  if (g.state.choices[choice] !== undefined) return g.state.choices[choice] === value;
  await g.say('author', text, 'narrator'); // (no one's voice: a word to the author, not the story)
  const go = await g.choose(null, 'david', [{ id: 'play', label }, { id: 'skip', label: 'Дальше' }]);
  if (go === 'play') g.state.choices[choice] = value;
  return go === 'play';
}

const HALL = SCENES.hall, KITCHEN = SCENES.kitchen, FARM = SCENES.farm, FORGE = SCENES.forge, FLIGHT = SCENES.flight, EDGE = SCENES.edge;

export default {
  number: 'V',
  title: 'Раскрытие',
  choices: [
    { id: 'night', weight: '⚑', title: 'Когда взяли Кэтрин и Салли',
      options: [{ id: 'flee', label: 'бежать сейчас' }, { id: 'rescue', label: 'вытащить их' }] },
    { id: 'forge', weight: '~', title: 'Человек с фонарём',
      options: [{ id: 'calm', label: 'держать ритм мехов' }, { id: 'force', label: 'кивнуть дяде на молот' }] },
    { id: 'caught', weight: '⚑', title: 'Раскрытие',
      options: [{ id: 'free', label: 'ушёл' }, { id: 'caught', label: 'схвачен' }] },
    { id: 'answer', weight: '~', title: 'Допрос',
      options: [{ id: 'deny', label: 'отпираться' }, { id: 'silent', label: 'молчать' }, { id: 'truth', label: 'сказать правду' }] },
    { id: 'trial', weight: '⚑', title: 'Суд',
      options: [{ id: 'friends', label: 'вытащили свои' }, { id: 'dark', label: 'задул лампу' }, { id: 'fire', label: 'смахнул лампу' }] },
    { id: 'rider', weight: '~', title: 'Всадник на гребне',
      options: [{ id: 'kill', label: 'стрелять в него' }, { id: 'warn', label: 'над головой' }, { id: 'hide', label: 'замереть в тумане' }] },
    { id: 'shadow', weight: '~', title: 'По тени',
      options: [{ id: 'hid', label: 'прошли в тени' }, { id: 'seen', label: 'фонарь нас увидел' }] },
  ],
  titles: ['Ночь: нас выдали', 'Кузница: ключ', 'Суд', 'Бегство', 'По тени'], // the steps, as the author's ☰ lists them
  steps: [
    // the kitchen at night, years on (the film's tableau `late`): Michael's news in my head, the father reading longer
    // than he used to — and, if he has grown suspicious, lifting his head from the Book (`asks`). Flee now, or get
    // them out; either way David goes up to bed as on any night (`to_bed`)
    async g => {
      const { marks, scales } = g.state;
      await g.scene(KITCHEN, { beat: 'late' });
      const late = g.beat('late');
      await g.say('narrator', 'В тот вечер отец читал дольше обычного.');
      if (marks.anne === 'widowed') await g.think('michael', 'Энн больше нет. Она оставила инспектору письмо. Там все наши имена.');
      else if (marks.anne === 'free') await g.think('michael', 'Энн всё рассказала Алану. Утром Алан был у инспектора.');
      else await g.think('michael', 'Нас выдали.');
      await g.think('michael', 'Кэтрин и Салли взяли. Их допрашивают.');
      await g.think('sally', 'Дэвид… Они спрашивают про тебя. Я не скажу. Я постараюсь.');
      await late;
      if (scales.suspicion >= 3) {
        await g.beat('asks');
        await g.say('father', '— Дэвид. О чём ты думаешь, когда я читаю?', 'joseph');
        if (marks.mother === 'lied') await g.say('mother', '— Он устал, Джозеф. Пусть идёт спать.', 'emily');
      }
      await g.think('michael', 'Уходи этой ночью. С Петрой. Розалинда будет ждать у брода.');
      const night = await g.choose('night', 'david', [
        { id: 'flee', label: 'Уйти этой ночью — с Петрой' }, { id: 'rescue', label: 'Сначала вытащить Кэтрин и Салли' }]);
      const up = g.beat('to_bed');
      if (night === 'rescue') {
        await g.think('rosalind', 'Тогда я жду у брода. До рассвета — не дольше.');
        g.scale('group', 1);
        await up;
        return;
      }
      await up;
      g.mark('sally', 'left', 'Кэтрин и Салли это запомнят.');
      // the yard at night, Petra in my arms
      await g.scene(FARM, { dusk: 1, window_lit: 1, boy_present: true, wind: 0.5 });
      await g.wait(1500);
      await g.say('narrator', 'Ночью я разбудил Петру и вынес её из дома.');
      await g.think('petra', 'Дэвид, мы куда?');
      await g.think('david', 'Далеко. Только думай тихо.');
      if (marks.petra === 'free') await g.think('petra', 'Я не умею тихо!');
      const look = await g.choose(null, { 'house#window': [{ id: 'look', label: 'Оглянуться на дом' }], david: [{ id: 'go', label: 'Уйти не оглядываясь' }] });
      if (look === 'look' && marks.sophie === 'told') await g.say('narrator', 'В окне стояла мать. Она смотрела, как мы уходим, и не позвала отца.');
      else if (look === 'look') { g.set('window_lit', 0, 3); await g.say('narrator', 'Окно погасло. В доме никто не проснулся.'); }
      if (scales.suspicion >= 4) {
        const horse = g.sound.hooves({ gait: 'walk' });
        horse.loud(0.8, 4);
        await g.wait(3000);
        await g.say('narrator', 'У ворот ждали всадники. Инспектор знал, к кому ехать.');
        await g.think('david', 'Петра, беги к броду. К Розалинде.');
        await g.say('narrator', 'Петра выскользнула у меня из рук и пропала в темноте. За ней не погнались.');
        await g.think('rosalind', 'Слышу её. Иду навстречу.');
        horse.stop(4);
        g.state.choices.caught = 'caught';
      } else g.state.choices.caught = 'free';
      await g.wait(2000);
    },
    // (getting them out) the forge at night: Axel makes the key, I keep the bellows going — a man with a lantern
    async g => {
      if (!(await onlyIf(g, 'Этот шаг — только если ночью выбрано «вытащить Кэтрин и Салли».', 'night', 'rescue',
        'Сыграть, будто выбрано «вытащить их»'))) return;
      const { marks, scales } = g.state;
      await g.scene(FORGE, { beat: 'key' });
      const key = g.beat('key');
      await g.say('narrator', 'Я прибежал к дяде Акселю. Больше было не к кому.');
      await g.say('axel', '— Их держат у инспектора, в подвале. Дверь на замке.');
      await g.say('axel', '— Ключ я сделаю. А ты качай мехи — пусть думают, что я работаю.');
      await key;
      await g.wait(1500);
      const stop = g.told('stranger:stop');
      const came = g.beat('stranger');
      await stop;
      await g.say('narrator', 'В воротах остановился человек с фонарём.');
      if (marks.calf === 'hidden') await g.say('narrator', 'Работник отца. Тот, что видел телёнка.');
      await came;
      const forge = await Promise.race([
        g.choose('forge', { david: [{ id: 'calm', label: 'Качать мехи, как ни в чём не бывало' }], axel: [{ id: 'force', label: 'Кивнуть дяде на молот' }] }),
        g.wait(20000).then(() => 'calm'),
      ]);
      g.withdraw();
      g.state.choices.forge = forge;
      if (forge === 'calm') {
        // the rhythm, and hope: he watches the anvil, the boy, the bellows
        const { broke } = await g.play(bellows, { watched: marks.calf === 'hidden' });
        if (broke) g.scale('suspicion', 1);
        if (scales.suspicion >= 3 || (marks.calf === 'hidden' && scales.suspicion >= 2)) {
          // he knew: a whistle, two more lanterns out of the dark; the hammer up — and down
          const called = g.beat('caught');
          await g.say('narrator', 'Он посмотрел мне в лицо — и свистнул. Из темноты подошли ещё двое.');
          await g.say('narrator', 'Дядя так и стоял с молотом. Я покачал головой: не надо.');
          await called;
          g.mark('sally', 'tried', 'Кэтрин и Салли это запомнят.');
          g.state.choices.caught = 'caught';
          await g.wait(1500);
          return;
        }
        const gone = g.beat('stranger_go');
        await g.say('narrator', 'Он постоял и ушёл. Не заметил. Или не захотел заметить.');
        await gone;
      } else {
        // a nod at the hammer: Axel goes to the gate, and the man falls back into the dark
        const step = g.told('strike:step');
        const struck = g.beat('strike');
        await step;
        await g.say('narrator', 'Дядя шагнул к воротам. Человек не успел обернуться.');
        await struck;
        await g.wait(1000);
        await g.say('narrator', 'Мы оттащили его в темноту. Он дышал.');
        g.scale('path', -1, true);
      }
      await g.wait(1500);
      await g.say('narrator', 'Под утро дядя вернулся один.');
      await g.say('axel', '— Ушли. Другой дорогой, к Окраинам. Теперь твой черёд, Дэви.');
      g.mark('sally', 'freed', 'Кэтрин и Салли это запомнят.');
      g.state.choices.caught = 'free';
      await g.wait(1500);
    },
    // (caught) the trial in the meeting house at night: the inspector at the elders' table, the men of
    // the community along the walls, the father standing apart — and the way out
    async g => {
      if (!(await onlyIf(g, 'Этот шаг — только если Дэвида схватили: у ворот или в кузнице.', 'caught', 'caught',
        'Сыграть, будто схватили'))) return;
      await g.scene(HALL, { lamp: 1, spill: 0, men: 1, rush: 0, inspector_present: true, inspector_up: 0, father_present: true,
        father_away: 0, david_present: 1, david_look: 'inspector', fire_outside: 0, door: 0 });
      g.set('men', 6, 9);
      await g.wait(2000);
      await g.say('narrator', 'Меня привели в дом собраний. Была ночь, на столе старейшин горела одна лампа.');
      await g.say('narrator', 'Мужчины входили по одному и садились вдоль стен. Отец стоял отдельно.');
      await g.say('inspector', '— Девочки назвали тебя, Дэвид. Ты слышишь их без слов?');
      const answer = await g.choose('answer', 'david', [
        { id: 'deny', label: '— Не понимаю, о чём вы.' }, { id: 'silent', label: 'Молчать' }, { id: 'truth', label: '— Слышу. И греха в этом нет.' }]);
      if (answer === 'deny') await g.say('inspector', '— Они тоже сначала не понимали.');
      if (answer === 'silent') {
        g.set('david_look', 'father');
        await g.say('father', '— Отвечай, когда спрашивают.');
        g.set('david_look', 'inspector');
      }
      if (answer === 'truth') {
        g.set('david_look', 'father');
        await g.say('father', '— Тогда ты мне не сын.');
        g.set('father_away', 1, 2.5);
        g.mark('father', 'disowned', 'Отец это запомнит.');
        await g.wait(1500);
        g.set('david_look', 'inspector');
      }
      g.set('inspector_up', 1, 2);
      await g.wait(1200);
      await g.say('inspector', '— Утром тебя увезут. Там спросят по-другому.');
      if (g.state.scales.group >= 3) {
        await g.think('rosalind', 'Дэвид. Мы рядом. Сейчас.');
        g.set('fire_outside', 1, 6);
        await g.wait(2500);
        await g.say('narrator', 'Во дворе закричали: горит сарай.');
        g.set('door', 1, 1.2);
        g.set('rush', 1, 6);
        await g.say('narrator', 'Все бросились к дверям — инспектор, отец, мужчины.');
        if (g.state.choices.night === 'rescue') await g.think('rosalind', 'Петра с нами — вывели через окно. Беги к броду.');
        else await g.think('rosalind', 'Петра у меня. Беги к броду.');
        await g.choose(null, 'david', [{ id: 'run', label: 'Бежать' }]);
        g.state.choices.trial = 'friends';
      } else {
        await g.think('michael', 'Нас слишком мало, Дэвид. Выбирайся сам.');
        const trial = await g.choose('trial', 'lamp#flame', [{ id: 'dark', label: 'Задуть лампу' }, { id: 'fire', label: 'Смахнуть лампу на пол' }]);
        if (trial === 'dark') {
          g.set('lamp', 0, 0.3);
          await g.say('narrator', 'В темноте отец схватил меня за рукав. Я вырвался.');
          g.set('david_present', 0, 1.5);
          await g.say('narrator', 'Он кричал мне вслед, пока я не добежал до ворот.');
        } else {
          g.set('spill', 1, 2.5);
          await g.wait(800);
          await g.say('narrator', 'Масло вспыхнуло по полу. Все бросились тушить, а я — к окну.');
          g.set('david_present', 0, 1.5);
          g.scale('path', -1, true);
        }
        if (g.state.choices.night === 'rescue') await g.say('narrator', 'Петру я вынес через окно её комнаты.');
        else await g.think('rosalind', 'Петра у меня. Беги к броду.');
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
        await g.say('narrator', 'Шебу я увёл из загона за домом. Петра уже ждала меня — в корзине у Розалинды.');
        if (marks.petra === 'free') await g.think('petra', 'Дэвид! Я знала, что ты придёшь!');
      } else await g.say('narrator', 'Розалинда ждала за бродом, на гребне, с двумя большими конями своего отца.');
      await came;
      if (!alone) await g.beat('handover');
      await g.think('michael', 'Я остаюсь. Буду среди них — и буду слушать.');
      // Sheba: home — or with us
      await g.beat('sheba_turn');
      await g.think('rosalind', 'Отпусти её, Дэвид. Большим коням она не пара. И ржёт на всю округу.');
      const sheba = await g.choose(null, 'david', [{ id: 'let', label: 'Отпустить Шебу домой' }, { id: 'take', label: 'Взять Шебу с собой' }]);
      marks.sheba = sheba === 'take' ? 'took' : 'let';
      if (sheba === 'let') {
        const off = g.told('sheba_go:gone');
        const went = g.beat('sheba_go');
        await off;
        await g.say('narrator', 'Шеба ушла домой одна. Назад дороги не было.');
        await went;
      } else {
        const tied = g.beat('sheba_keep');
        await g.say('narrator', 'Я не смог. Отвёл её назад и привязал повод к вьючному коню.');
        await g.think('rosalind', 'Она нас выдаст, Дэвид.');
        await tied;
      }
      await g.beat('climb');
      const armed = g.beat('bow');
      await g.think('rosalind', 'Фонари на дороге. Твой отец с ними.');
      if (choices.forge === 'force') await g.think('michael', 'Того человека у кузницы нашли. За вами поднялась вся округа.');
      await armed;
      // over the shoulder into the fog; the search comes up onto the crest above us
      const fog = g.told('hollow:fog');
      const down = g.beat('hollow');
      await fog;
      await g.say('narrator', 'За плечом гряды дорога ныряла в лощину. Лощина была полна тумана.');
      await down;
      await g.think('rosalind', 'Стоим. Пусть проедут.');
      const horse = g.sound.hooves({ gait: 'walk' });
      horse.loud(0.3, 3);
      const riders = g.told('watch:riders');
      const up = g.beat('watch');
      await riders;
      await g.say('narrator', 'На гребень поднялись двое верховых с фонарями.');
      await up;
      horse.loud(0.03, 2);
      const { seen } = await g.play(horses, { start, sheba: marks.sheba === 'took', petra: marks.petra === 'free', horse });
      if (seen) {
        g.beat('spotted', { wait: false });
        await g.say('narrator', 'Передний поднял фонарь выше — и увидел нас. Второй поскакал назад, за остальными.');
        await g.think('rosalind', 'Он едет сюда.');
      } else {
        g.beat('stay', { wait: false });
        await g.say('narrator', 'Они долго светили в туман. Потом задний повернул назад, за остальными, а передний остался стеречь дорогу.');
        await g.think('rosalind', 'Скоро рассвет. Туман сойдёт — и он нас увидит.');
      }
      let timed = false;
      const rider = await Promise.race([
        g.choose('rider', {
          searcher: [{ id: 'kill', label: '— Стреляй в него.' }, { id: 'warn', label: '— Стреляй над головой!' }],
          david: [{ id: 'hide', label: 'Замереть в тумане' }],
        }),
        g.wait(20000).then(() => (timed = true, seen ? 'kill' : 'hide')), // she will not wait for him to reach us
      ]);
      g.withdraw();
      g.state.choices.rider = rider;
      const shot = rider === 'hide' ? null : g.told(`${rider}:shot`);
      const done = g.beat(rider);
      if (rider === 'kill') {
        if (timed) await g.say('narrator', 'Я не успел ничего сказать. Розалинда уже натянула лук.');
        await shot;
        await g.say('narrator', 'Всадник упал. Его конь ушёл за гребень один.');
        await done;
        if (seen) await g.think('rosalind', 'Он бы нас не пощадил, Дэвид.');
        else await g.say('narrator', 'Он так нас и не увидел.');
        g.scale('path', seen ? -1 : -2, true);
      } else if (rider === 'warn') {
        await shot;
        await g.say('narrator', 'Стрела свистнула над самой его головой. Конь шарахнулся, и всадник ускакал за гребень.');
        await done;
        await g.think('rosalind', seen ? 'Он видел, куда мы ушли.' : 'Теперь он знает, где мы.');
      } else {
        await g.say('narrator', 'Мы замерли. Петра зажала рот ладошкой.');
        await g.say('narrator', seen ? 'Он подъехал к самому краю лощины и долго светил в туман.' : 'Он поехал по краю лощины, светя в туман. Совсем рядом.');
        await done;
        await g.think('rosalind', seen ? 'Он видел нас. Он вернётся не один.' : 'Мы потеряли час. Теперь они будут у Окраин раньше нас.');
        g.scale('path', 1, true);
      }
      horse.loud(0.1, 4);
      // on, out of the hollow toward the trees
      const on = g.beat('away');
      g.set('pursuers', 0.2, 12);
      await g.say('narrator', 'К рассвету фонари отстали. Днём мы прятались в лесу.');
      horse.stop(4);
      if (marks.sally !== 'freed') {
        await g.think('michael', 'Кэтрин и Салли увезли. Я ничего не смог.');
        if (rider === 'kill') await g.think('michael', 'Тот всадник умер. Теперь пощады не будет — ни вам, ни им.');
      }
      if (marks.sealand === 'answered' && scales.petra >= 2) await g.think('sealand', 'Мы вас слышим. Держитесь. Мы идём.');
      else if (marks.sealand === 'answered') await g.say('petra', '— Дэвид, та тётя за водой опять зовёт. Она нас ищет.', 'petra');
      await on;
    },
    // the last field before the Fringes: from shadow to shadow while the lantern looks for us
    async g => {
      const hard = g.state.choices.rider !== 'kill';
      await g.scene(EDGE, { glow: 0.7, mist: 0.6, figure_on_path: 0, lantern_in_field: 0 });
      await g.wait(1500);
      await g.say('narrator', 'На вторую ночь мы вышли к последнему полю. За изгородью начинались Окраины.');
      g.set('lantern_in_field', 1, 2);
      await g.wait(2500);
      await g.say('narrator', 'Фонарь нёс высокий человек. По походке я узнал отца.');
      await g.say('narrator', 'Луна стояла за лесом, и тени деревьев лежали поперёк поля. Идти можно было по ним — или пока он светил в другую сторону.');
      const { seen } = await g.play(shadow, {
        hard, onSeen: at => (at === 'fence' ? g.say('father', '— Вон они! У изгороди!', 'joseph') : g.say('father', '— Вон они! В поле!', 'joseph')),
      });
      g.state.choices.shadow = seen ? 'seen' : 'hid';
      g.set('figure_on_path', 1, 4);
      if (seen) {
        g.set('lantern_in_field', 1, 1);
        await g.say('narrator', 'Сзади кричали, к изгороди бежали фонари. Но за неё никто не шагнул.');
      } else {
        g.set('lantern_in_field', 0, 5);
        await g.say('narrator', 'Фонарь постоял у изгороди и повернул назад.');
      }
      await g.think('rosalind', 'Вот и всё, Дэвид. Мы на Окраинах.');
      await g.say('narrator', 'Неправильный лес сомкнулся за нами.');
      await g.wait(3000);
    },
  ],
};
