// Voices — its mechanics: David here or not (`david_present`); he sits on the hill looking over the valley.
const s = scene;
const here = () => s.person('david').here(+(s.get('david_present') ?? 1) > 0.5);
s.on('change', 'david_present', here);
here();
