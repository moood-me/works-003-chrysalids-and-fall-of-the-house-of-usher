// the ash's shader: how far the fire and the ash have gone, how hot it still is
const s = e.state;
e.uniform('ash', s.ash ?? 0);
e.uniform('ignite', s.ignite ?? 0);
e.uniform('fire', s.fire ?? 0);
