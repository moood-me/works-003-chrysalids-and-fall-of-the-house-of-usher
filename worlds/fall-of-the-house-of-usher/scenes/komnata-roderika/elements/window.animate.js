// how much comes through the glass (lib.js light): its brightness, the glows past the curtain; the middle window's
// leaves swung in on their hinges as it opens, the misty air beyond showing
const L = e.lib.light(e.state);
const bright = 0.3 + 0.7 * Math.min(1, L.sky);
for (const name of ['glass', 'leaf_l', 'leaf_r']) e.layer(name).brightness = bright;
const air = e.layer('air');
air.alpha = Math.min(1, L.open * 3);
air.brightness = bright;
const k = Math.max(0.04, Math.cos(L.open * 1.3));
e.layer('leaf_l').scaleX = k;
e.layer('leaf_r').scaleX = k;
const spill = bright * (1 - 0.9 * L.curtain) * (1 - 0.55 * L.song);
for (const name of ['w0', 'w1', 'w2']) e.glow(name, spill);
