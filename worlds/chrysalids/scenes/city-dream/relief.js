// the dune David stands on: its crest 0.7 m up at about 5.5 m, falling away toward the sea on the right and beyond
const crest = 0.7 + 0.1 * Math.sin(-across * 0.5) + 0.04 * Math.sin(across * 1.9);
const fall = anim.ease.smooth(anim.span(across, -1.6, 2.9)) * 0.85;
const along = Math.exp(-Math.pow((distance - 5.6) / 2.4, 2));
return Math.max(0, (crest - fall) * along);
