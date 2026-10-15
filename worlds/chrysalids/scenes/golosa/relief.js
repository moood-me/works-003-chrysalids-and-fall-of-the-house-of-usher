// the hill David sits on (its crest 1.5 m up, at 6 m, on the left; below the eye — the valley seen over it), the land
// flat beyond 16 m
const a = across - lib.DAVID[0], d = distance - lib.DAVID[1];
if (distance > 16) return 0;
return 1.5 * Math.exp(-(a * a) / (a < 0 ? 40 : 10)) * Math.exp(-(d * d) / 6) * anim.span(16 - distance, 0, 4);
