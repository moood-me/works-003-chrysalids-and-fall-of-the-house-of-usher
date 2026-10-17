// the sun sinking as the evening comes (gone at night), marked where it is: the scene's light "sun" comes from it; the
// night's sky and its moon coming over it all as `night` grows
const ev = e.state.evening ?? 0, night = e.state.night ?? 0, sun = e.layer('sun');
sun.y = 0.034 * ev;
sun.alpha = 1 - night;
e.layer('night').alpha = night;
e.at(e.aspect * 0.5 - 0.08, 0.27 + 0.034 * ev, 'sun');
