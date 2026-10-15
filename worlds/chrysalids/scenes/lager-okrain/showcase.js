// The camp's own little film, outside games: dawn at the fire, the people of the Fringes coming to it one by one, Sophie
// out of her hut at the edge of the light, the captives at the post, the horn and the camp on its feet
return [
  { name: 'dawn', run: async s => { s.set('people', 0); s.set('alarm', 0); s.set('captives', 0); s.set('sophie_present', 0); await s.wait(2.5); } },
  { name: 'the people', run: async s => { for (const v of [0.2, 0.4, 0.6, 0.8, 1]) { s.set('people', v); await s.wait(1.6); } } },
  { name: 'Sophie', run: async s => { s.set('sophie_present', 1); await s.wait(6); } },
  { name: 'the captives', run: async s => { s.set('captives', 1); await s.wait(5); } },
  { name: 'the horn', run: async s => { s.set('alarm', 1); await s.wait(6); s.set('alarm', 0); s.set('captives', 0); await s.wait(3); } },
];
