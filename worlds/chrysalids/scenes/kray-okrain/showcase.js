// The edge's own little film, outside games: the last field under the moon, the father's lantern coming into it and its beam
// going over the field, the two fugitives going by the trees' shadows — stopping when the beam comes near — through the gap
// in the fence and into the wrong wood
return [
  { name: 'the field', run: async s => { s.set('walkers', 0); s.set('lantern_in_field', 0); s.set('figure_on_path', 0); await s.wait(3); } },
  { name: 'the lantern', run: async s => { await s.move('lantern_in_field', 1, { over: 2 }); await s.wait(3); } },
  { name: 'by the shadows', run: async s => {
    for (let i = 0; i < 4; i++) {
      s.set('walkers', 1);
      await s.wait(3.5);
      s.set('walkers', 0);
      await s.wait(2);
    }
  } },
  { name: 'into the wood', run: async s => { s.set('figure_on_path', 1); await s.wait(4); await s.move('lantern_in_field', 0, { over: 5 }); await s.wait(6); } },
];
