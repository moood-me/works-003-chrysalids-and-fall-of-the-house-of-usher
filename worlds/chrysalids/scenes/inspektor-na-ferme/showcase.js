// The yard's own little film, outside games: the inspector going over the yard to the calf with his eyes (as the game's
// «Найди раньше него» leads them), the calf's long legs, the verdict — the farmhand leading it to the barn —, the cart
// coming along the far road, the rain
return [
  { name: 'the yard', run: async s => { s.set('verdict', 0); s.person('inspector').look('inspector#hand_l'); s.set('cart', 0); s.set('rain', 0); await s.wait(2.5); } },
  { name: 'his eyes', run: async s => { for (const p of s.lib.LOOK) { s.person('inspector').look(p); await s.wait(1.5); } await s.wait(2); } },
  { name: 'the verdict', run: async s => { await s.move('verdict', 1, { over: 7 }); await s.wait(5); } },
  { name: 'the cart', run: async s => { await s.move('cart', 1, { over: 8, ease: 'linear' }); } },
  { name: 'the rain', run: async s => { await s.move('rain', 1, { over: 4 }); await s.wait(5); } },
];
