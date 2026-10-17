// The Fringes camp — its mechanics, the game's keys turned into what happens: `people` — how many of the camp are at the fire
// (each from its own mark, each coming in a little late); `alarm` — the one by the fire gets up, the guards' spears come
// round, the tall guard puts his horn to his mouth; `captives` — Rosalind and Petra tied at the post; `sophie_present` —
// Sophie at the edge of the light by her hut (coming out of it, going back into it); `fire` — how high the fire burns.
const s = scene, L = s.lib, P = id => s.person(id);
// people: those of the camp at the fire as `people` says — coming to it out of the dusk behind the fire, a few steps, or
// going back into it; opened (or restored) — there at once
const there = {};
function people(once) {
  const v = s.get('people') ?? 0.8;
  L.PEOPLE.forEach((p, i) => {
    const on = v >= p.from - 1e-6;
    if (there[p.id] === on) return;
    there[p.id] = on;
    const back = [p.at[0] + 0.4, p.at[1] + 3.2];
    if (once) {
      s.set(`${p.id}_a`, p.at[0]); s.set(`${p.id}_d`, p.at[1]);
      P(p.id).here(on);
      return;
    }
    s.sequence(async q => {
      await q.wait(0.4 * ((i * 0.618) % 1));
      if (on) {
        q.set(`${p.id}_a`, back[0]); q.set(`${p.id}_d`, back[1]);
        q.person(p.id).here(true);
        await q.person(p.id).walk([p.at]);
        await q.person(p.id).turn(p.turn);
        q.person(p.id).do(p.does, { loop: true });
      } else {
        await q.person(p.id).walk([back]);
        q.person(p.id).here(false);
      }
    }, { name: `p_${p.id}` });
  });
}
function alarm() {
  const on = (s.get('alarm') || 0) > 0.5;
  s.sequence(async q => {
    if (on) {
      await q.wait(0.3);
      q.person('sitter').do('get_up_ground');
      q.person('guard').reach({ r: 'guard#head' });
      q.person('guard').look([-3.6, 30, 6]);
      await q.wait(0.4);
      for (const id of ['guard2', 'spider', 'hunch', 'woman']) { q.person(id).look([-4, 40, 2]); await q.wait(0.3); }
    } else {
      q.person('guard').reach(null);
      q.person('guard').look(null);
      for (const id of ['guard2', 'spider', 'hunch', 'woman']) q.person(id).look('fire');
    }
  }, { name: 'alarm' });
}
function captives() {
  const on = (s.get('captives') || 0) > 0.5;
  for (const id of ['rosalind', 'petra']) { P(id).here(on); if (on) P(id).do('hide_stand', { loop: true }); }
}
// Sophie: out of her hut to the edge of the light, or back into it; at once — opened (or restored): where the key says
function sophie(once) {
  const on = (s.get('sophie_present') || 0) > 0.5, was = s.get('sophie_here') !== false;
  if (once) {
    s.set('sophie_a', L.SOPHIE.at[0]);
    s.set('sophie_d', L.SOPHIE.at[1]);
    s.set('sophie_turn', 200);
    P('sophie').here(on);
    P('sophie').look('fire');
    return;
  }
  if (on === was) return;
  s.sequence(async q => {
    if (on) {
      q.set('sophie_a', L.SOPHIE.hut[0]);
      q.set('sophie_d', L.SOPHIE.hut[1]);
      q.person('sophie').here(true);
      await q.person('sophie').walk([L.SOPHIE.at]);
      await q.person('sophie').turn(200);
      q.person('sophie').look('fire');
    } else {
      await q.person('sophie').walk([[L.SOPHIE.hut[0] - 1.2, L.SOPHIE.hut[1] + 4]]);
      q.person('sophie').here(false);
    }
  }, { name: 'sophie' });
}
s.on('change', 'people', () => people(false));
s.on('change', 'alarm', alarm);
s.on('change', 'captives', captives);
s.on('change', 'sophie_present', () => sophie(false));
people(true);
captives();
sophie(true);
if ((s.get('alarm') || 0) > 0.5) alarm();
