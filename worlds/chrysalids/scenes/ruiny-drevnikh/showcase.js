// The ruins, outside games: the summer afternoon over the overpass, the flash in the grass, the digging — the Old
// People's plate coming up from under the sod —, the bell from Waknuk, the children running home
return [
  { name: 'the ruins', run: async s => { await s.wait(5); } },
  { name: 'the glint', run: async s => { await s.move('glint', 1, { over: 2 }); await s.wait(3); } },
  { name: 'digging', run: async s => { await s.move('dig', 1, { over: 14, ease: 'linear' }); await s.wait(3); } },
  { name: 'the bell', run: async s => { await s.move('bell', 1, { over: 3 }); await s.wait(5); } },
  { name: 'home', run: async s => { await s.move('children', 0, { over: 2 }); await s.wait(6); } },
];
