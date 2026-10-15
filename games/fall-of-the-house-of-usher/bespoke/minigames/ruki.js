// «Руки» (IV, the end; «Буря и чтение», after the beat `hands`: the close-up of the hands). Roderick's hand and
// Madeline's reach — to the narrator (opts.roderick / opts.madeline) or else to each other (the scene's rod_reach,
// rod_to_mad, mad_reach, mad_to_rod).
//   1. what he does — takes a hand that reaches to him, and runs; or stays; 2. wants — to save someone, or not to leave
//   them; 3. horror, the house coming down, no time; 4. the player — reaching out in a hurry, choosing whom.
// Two marks at once, whichever comes first is the choice: the language's pull, free to the hands that reach to him, on
// his own hand (closeup#nar_hand: the scene draws it where the finger has it — grab, grab_x, grab_y); let go on a hand
// (closeup#rod_hand, closeup#mad_hand), he takes it (held_rod, held_mad) — and the other too, if both may be taken; and
// the language's hold on his own place (closeup#stay): held full, he stays. No hand reaching to him: only staying, or
// letting the time go by (the ghost shows both). The time — the arc on the marks: the house
// shakes harder as it runs out (quake; a jolt and the wood giving now and then); out — whatever is held is taken
// (nothing: nobody). It leaves the house trembling (quake 0.4).
//   opts: { roderick: bool, madeline: bool — each reaches to the narrator; both: bool — both may be taken (else the first
//   one taken is all); time: seconds (from the crack) }
//   → { took: 'none' | 'madeline' | 'roderick' | 'both', stayed: bool }
import { thunder, splinter } from '../sound.js';
import { until } from '../hands.js';

const STAY = 2; // s held on his own place: he stays
const HOLDING = 1.4; // s the close-up holds the hands taken

export default {
  title: 'Руки', // (as the author's ☰ lists it)
  about: 12,
  skipped: { took: 'none', stayed: false },
  async run(g, b, opts, signal) {
    const toMe = { rod: !!opts.roderick, mad: !!opts.madeline }, both = !!opts.both;
    const time = Math.max(3, opts.time ?? 12);
    g.set('rod_reach', toMe.rod ? 1 : 0, 1.4);
    g.set('rod_to_mad', toMe.rod ? 0 : 1, 1.4);
    g.set('mad_reach', toMe.mad ? 1 : 0, 1.6);
    g.set('mad_to_rod', toMe.mad ? 0 : 1, 1.6);
    const mg = g.minigame({ phrase: toMe.rod || toMe.mad ? 'Дом трясся, и ко мне тянулись руки' : 'Дом трясся, а их руки тянулись друг к другу' });
    thunder(0.9);
    // (his own hand to pull only when a hand reaches to him; staying — always; and if none reaches to him, doing nothing
    // is a way too: the ghost shows it)
    const targets = ['rod', 'mad'].filter(w => toMe[w]);
    const mine = targets.length ? mg.mark({ at: 'closeup#nar_hand', kind: 'dash', time: 1 }) : null;
    const reach = mine ? mg.pull({ on: mine, targets: targets.map(w => `closeup#${w}_hand`) }) : null;
    const place = mg.mark({ at: 'closeup#stay', kind: 'groove', time: 1 });
    const stay = mg.hold({ on: place, seconds: STAY, drain: 0.5 });
    if (reach) mg.show({ gestures: [reach, stay] });
    else (async () => { await mg.show({ gestures: [stay] }).finished; mg.show({ handsOff: true }); })();
    const held = { rod: false, mad: false };
    let taken = null, shake = 0, wasHeld = false;
    // the house: harder as the time runs out (the scene moves it)
    g.set('quake', 0.25);
    g.set('quake', 1, time);
    const f = b.frame();
    // the hand the finger has, in the close-up's units: the frame's height 1 from its middle, y down (the wrist; the palm
    // 0.2 above it)
    const hand = p => { b.set('grab_x', (p.x - (f.x + f.w / 2)) / f.h, 0.08, 'linear'); b.set('grab_y', (p.y - f.y) / f.h - 0.5 + 0.2, 0.08, 'linear'); };
    reach?.on('release', ({ target }) => {
      const who = targets[target];
      if (who == null || held[who] || (taken != null && !both)) return;
      held[who] = true;
      g.set(who === 'rod' ? 'held_rod' : 'held_mad', 1, 0.3);
      mg.snap({ at: `closeup#${who}_hand` });
      if (!both || targets.every(w => held[w])) taken = mg.t;
    });
    const t0 = mg.t;
    const done = await until(mg, ({ t, dt }) => {
      const u = t - t0, left = Math.max(0, 1 - u / time);
      mine?.set({ time: left });
      place.set({ time: left });
      // a jolt and the wood giving now and then, more often as the time runs out
      if ((shake -= dt) <= 0) {
        shake = 2.2 + 2.5 * Math.random() * left;
        g.set('shudder', 0.8);
        g.set('shudder', 0, 1.2);
        splinter();
      }
      const s = reach?.state;
      if (s?.held && s.at) hand(s.at);
      if (s && s.held !== wasHeld) { g.set('grab', s.held ? 1 : 0, s.held ? 0.35 : 0.5); wasHeld = s.held; }
      mg.plate.set({ fill: stay.state.fill, glow: stay.state.held ? 'good' : 'idle' });
      return stay.state.fill >= 1 || u >= time || (taken != null && t - taken > HOLDING);
    });
    g.set('grab', 0, 0.4);
    g.set('quake', done ? 0.4 : 0, 1);
    if (!done) {
      g.set('held_rod', 0, 0.3);
      g.set('held_mad', 0, 0.3);
      return this.skipped;
    }
    const stayed = stay.state.fill >= 1 && !held.rod && !held.mad;
    await mg.end({ as: 'neutral' });
    const took = held.rod && held.mad ? 'both' : held.rod ? 'roderick' : held.mad ? 'madeline' : 'none';
    return { took, stayed };
  },
};
