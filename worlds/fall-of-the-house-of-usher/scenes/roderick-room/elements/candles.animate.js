// how lit each candle is now (lib.js litOf, sinking with the song), the guitar's jump and wildness — for the shader; and
// each flame's light, flickering with it (the same flicker as candles.wgsl)
const lib = e.lib, S = e.state;
const L = lib.light(S);
const lit = lib.litOf(L.candles);
const wild = lib.num(S.wild), p = lib.pulse(e);
e.uniform('wild', wild);
e.uniform('pulse', p);
for (let i = 0; i < 5; i++) {
  e.uniform('l' + i, lit[i]);
  e.glow('c' + i, lit[i] * Math.min(1.3, lib.flicker(e.t, i, wild, p)));
}
