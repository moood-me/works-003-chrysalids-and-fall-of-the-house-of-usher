// The square, outside games: the evening, the two of them apart across it, the thread between them growing; his eyes
// going to her and hers to him; the old woman at the well turning to look; the people going home, the dusk
return [
  { name: 'the square', run: async s => { s.set('glance', 0); s.set('thread', 0.3); s.set('someone_watching', 0); await s.wait(4); } },
  { name: 'the thread', run: async s => { await s.move('thread', 0.85, { over: 6 }); await s.wait(2); } },
  { name: 'a glance', run: async s => { await s.move('glance', 1, { over: 1.5 }); await s.wait(2); await s.move('someone_watching', 1, { over: 2 }); await s.wait(3); await s.move('glance', 0, { over: 2 }); } },
  { name: 'going home', run: async s => { s.move('dusk', 0.8, { over: 12 }); await s.move('crowd', 0, { over: 10 }); await s.wait(4); } },
];
