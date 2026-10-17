// The yard's own little film, outside games: the evening coming down over the farm — the lit window, the wind in the
// wheat, the night, the window going dark; David gone from the yard and back years later
return [
  { name: 'evening', run: async s => { s.set('dusk', 0); s.set('wind', 0.3); s.set('window_lit', 1); s.set('boy_present', true); s.set('older', false); await s.wait(3); } },
  { name: 'dusk', run: async s => { await s.move('dusk', 0.6, { over: 10 }); await s.wait(2); } },
  { name: 'wind', run: async s => { await s.move('wind', 1, { over: 4 }); await s.wait(4); await s.move('wind', 0.4, { over: 4 }); } },
  { name: 'night', run: async s => { await s.move('dusk', 1, { over: 6 }); await s.wait(3); } },
  { name: 'the window goes dark', run: async s => { await s.move('window_lit', 0, { over: 4 }); await s.wait(3); } },
  { name: 'years later', run: async s => { s.set('boy_present', false); await s.wait(2); s.set('older', true); s.set('boy_present', true); s.set('window_lit', 1); await s.wait(4); } },
];
