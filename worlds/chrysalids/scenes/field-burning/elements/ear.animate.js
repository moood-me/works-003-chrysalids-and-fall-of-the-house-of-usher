// in his hand while he holds it; thrown: from his hand up and over in an arc into the wheat beyond; gone after
const s = e.state, L = e.layer('ear'), toss = e.anim.clamp(s.in_toss ?? 0, 0, 1);
if (!s.in_ear && !(toss > 0 && toss < 1)) { L.alpha = 0; return; }
const hand = e.point('in#hand_r');
if (!hand) { L.alpha = 0; return; }
const m = e.mem;
if (toss <= 0) { m.from = hand; L.x = hand[0]; L.y = hand[1]; L.rotate = 0; L.alpha = 1; return; }
const from = m.from ?? hand, to = e.point([4.5, 13, 0]) ?? [from[0] + 3, from[1] + 1.8];
const u = toss, x = from[0] + (to[0] - from[0]) * u, y = from[1] + (to[1] - from[1]) * u - 2.2 * Math.sin(Math.PI * u);
L.x = x;
L.y = y;
L.rotate = 9 * u;
L.alpha = 1 - e.anim.clamp((u - 0.85) / 0.15, 0, 1);
