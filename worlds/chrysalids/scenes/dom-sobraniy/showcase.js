// The trial, outside games: the men coming in one by one, David looking round at his father, the father turning his
// back, the inspector rising over the table; the barn on fire outside, the door, everyone running out — and David gone
return [
  { name: 'the hall', run: async s => { await s.move('men', 6, { over: 9, ease: 'linear' }); await s.wait(8); } },
  { name: 'the father', run: async s => { s.person('david').look('father'); await s.wait(2); await s.move('father_away', 1, { over: 2.5 }); await s.wait(4); s.person('david').look('inspector'); await s.wait(1.5); } },
  { name: 'the inspector rises', run: async s => { await s.move('inspector_up', 1, { over: 2 }); await s.wait(4); } },
  { name: 'the barn on fire', run: async s => { await s.move('fire_outside', 1, { over: 6 }); await s.wait(2); s.move('door', 1, { over: 1.2 }); await s.move('rush', 1, { over: 6, ease: 'linear' }); await s.wait(6); } },
  { name: 'David runs', run: async s => { await s.move('david_present', 0, { over: 1.5 }); await s.wait(4); } },
];
