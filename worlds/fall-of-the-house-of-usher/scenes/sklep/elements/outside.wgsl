// The door at night, each moment (outside.js paints it once, the candle burning steadily at FL 0.85: the base — the dark —,
// layer 1 the passage round the door, 2 the door's leaf, 3 the flame). fl — the candle's light now (flickering, dipping
// with the knocks), shake — the leaf's tremble now (frame heights across), sway — the flame's tip leaning, kn, an — the
// pulses (1 at the knock, down to 0 as it runs out): dust shaken from the door's top falls as they run down. Over it all
// the dark closing in round the candle. In frame heights about the middle.
const MID = vec2f(0.888889, 0.5);
const CANDLE = vec2f(-0.55, 0.3);
const FL = 0.85;
fn over(top: vec4f, under: vec4f) -> vec4f { return top + under * (1.0 - top.a); }
// the dust of one pulse (a — how much of it is left, the fall 1 − a), n motes
fn dust(p: vec2f, a: f32, n: f32, seed: f32, pxl: f32) -> vec4f {
  var c = vec4f(0.0);
  if (a <= 0.01 || p.x < -0.5 || p.x > 0.55) { return c; }
  let fall = 1.0 - a;
  let k = 0.5 * min(1.0, a * 2.0);
  let col = srgbToLinear(vec3f(170.0, 160.0, 140.0) / 255.0);
  for (var d = 0; d < 26; d++) {
    if (f32(d) >= n) { break; }
    let m = vec2f(-0.42 + hash3(vec3f(f32(d), seed, 7.0)) * 0.9 + sin(fall * 6.0 + f32(d)) * 0.01, -0.68 + (0.2 + hash3(vec3f(f32(d), seed, 9.0))) * fall * 1.1);
    let r = 0.002 + hash3(vec3f(f32(d), 0.0, 4.0)) * 0.0025;
    let R = max(r, 0.7 * pxl);
    let o = k * (1.0 - smoothstep(R - 0.5 * pxl, R + 0.5 * pxl, length(p - m))) * min(1.0, r * r / (R * R));
    c = over(vec4f(col * o, o), c);
  }
  return c;
}
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  let pxl = max(length(abs(at_dx) + abs(at_dy)), 1e-5);
  let p = at - MID;
  let b = 1.3 * pow(max(u_fl, 0.0) / FL, 1.5);
  var c = painted;
  let room = layer(1, at);
  c = over(vec4f(room.rgb * b, room.a), c);
  let leaf = layer(2, at - vec2f(u_shake, 0.0));
  c = over(vec4f(leaf.rgb * b, leaf.a), c);
  // the flame: stretched about its foot as the light goes up and down, its tip leaning
  let foot = CANDLE.y + 0.03;
  let rise = clamp((foot - p.y) / (0.05 * max(u_fl, 0.05)), 0.0, 1.0);
  let q = vec2f(p.x - u_sway * rise, foot + (p.y - foot) * FL / max(u_fl, 0.05));
  let flame = layer(3, MID + q);
  c = over(flame, c);
  emission += flame.rgb * 2.0;
  c = over(dust(p, u_kn, 12.0, 0.0, pxl), c);
  c = over(dust(p, u_an, 26.0, 50.0, pxl), c);
  // the dark all round, closing in on the candle
  let v = clamp((length(p - (CANDLE + vec2f(0.3, -0.1))) - 0.2) / 1.05, 0.0, 1.0);
  return c * (1.0 - 0.85 * v);
}
