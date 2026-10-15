// The valley by day, outside games: the children at their work, one and another stopping to listen — the threads
// between them —, the ploughman stopping and turning (and the woman at the door), the warm thread to Rosalind, dusk
return [
  { name: 'the valley', run: async s => { s.set('children', 2); s.set('rosalind', 0); s.set('adults_near', 0); s.set('dusk', 0); await s.wait(5); } },
  { name: 'they hear', run: async s => { s.set('children', 4); await s.wait(5); s.set('children', 6); await s.move('threads', 0.9, { over: 3 }); await s.wait(6); } },
  { name: 'the ploughman', run: async s => { await s.move('adults_near', 1, { over: 2 }); await s.wait(5); await s.move('adults_near', 0, { over: 3 }); } },
  { name: 'Rosalind', run: async s => { await s.move('rosalind', 1, { over: 3 }); await s.wait(5); } },
  { name: 'dusk', run: async s => { await s.move('dusk', 1, { over: 10 }); await s.wait(3); } },
];
