// The evening at the fire, outside games: Axel telling of the sea, the Old People's city, the far coast — each vision
// coming up in the smoke —, the fire sinking, the dawn
return [
  { name: 'the fire', run: async s => { s.set('story', 0); s.set('vision', 0); s.set('dawn', 0); s.set('fire', 0.8); await s.wait(4); } },
  { name: 'the sea', run: async s => { s.set('vision', 1); await s.move('story', 0.7, { over: 3 }); await s.wait(6); await s.move('story', 0, { over: 1 }); } },
  { name: 'the city', run: async s => { s.set('vision', 2); await s.move('story', 0.7, { over: 3 }); await s.wait(6); await s.move('story', 0, { over: 1 }); } },
  { name: 'the coast', run: async s => { s.set('vision', 3); await s.move('story', 0.7, { over: 3 }); await s.wait(6); await s.move('story', 0.15, { over: 2 }); } },
  { name: 'the dawn', run: async s => { s.move('fire', 0.4, { over: 12 }); await s.move('dawn', 1, { over: 14 }); await s.wait(3); } },
];
