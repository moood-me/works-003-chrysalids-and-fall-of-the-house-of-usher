// The dream, outside games: the city over the water, the shining fish going over it along its way with David's eyes
// after it, Petra's strength growing (more fish, more lights, the dream clearer), and the waking — the towers settling
// into sparks, the bedroom's window closing round
return [
  { name: 'the city', run: async s => { s.set('lead', 0); s.set('gaze', null); await s.wait(4); } },
  { name: 'the fish', run: async s => { s.set('gaze', -1); s.move('lead', 1, { over: 14, ease: 'linear' }); await s.move('gaze', 1, { over: 14, ease: 'linear' }); s.set('gaze', null); await s.wait(2); } },
  { name: 'Petra\'s strength', run: async s => { s.set('craft', 0.9); s.set('lights', 0.85); s.set('dream', 0.95); await s.wait(6); } },
  { name: 'waking', run: async s => { await s.move('waking', 1, { over: 5 }); await s.wait(3); await s.move('waking', 0, { over: 4 }); } },
];
