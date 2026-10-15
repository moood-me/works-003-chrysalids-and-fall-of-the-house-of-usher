// The night of the voices, outside games: David on the hill, the farms' windows called one by one — a thread to each
// —, Anne's window going dark, Petra's window waking (its glow, its rings, its warm thread), the clouds coming
return [
  { name: 'the night', run: async s => { s.set('count', 0); s.set('petra', 0); s.set('voices', 0.5); s.set('clouds', 0.15); await s.wait(4); } },
  { name: 'calling', run: async s => { for (let n = 1; n <= 8; n++) { s.set('count', n); await s.wait(2.2); } await s.wait(3); } },
  { name: 'Anne goes', run: async s => { s.set('count', 7); await s.wait(4); } },
  { name: 'Petra', run: async s => { await s.move('petra', 1, { over: 5 }); await s.wait(5); } },
  { name: 'clouds', run: async s => { await s.move('clouds', 0.8, { over: 8 }); await s.wait(3); } },
];
