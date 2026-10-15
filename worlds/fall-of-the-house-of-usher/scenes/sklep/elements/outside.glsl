// The door at night, each moment (outside.js paints it once, the candle burning steadily at FL 0.85: the base — the dark —,
// layer 1 the passage round the door, 2 the door's leaf, 3 the flame). fl — the candle's light now (flickering, dipping
// with the knocks), shake — the leaf's tremble now (frame heights across), sway — the flame's tip leaning, kn, an — the
// pulses (1 at the knock, down to 0 as it runs out): dust shaken from the door's top falls as they run down. Over it all
// the dark closing in round the candle. In frame heights about the middle.
const vec2 MID = vec2(0.888889, 0.5);
const vec2 CANDLE = vec2(-0.55, 0.3);
const float FL = 0.85;
vec4 over(vec4 top, vec4 under) { return top + under * (1.0 - top.a); }
// the dust of one pulse (a — how much of it is left, the fall 1 − a), n motes
vec4 dust(vec2 p, float a, float n, float seed, float pxl) {
  vec4 c = vec4(0.0);
  if (a <= 0.01 || p.x < -0.5 || p.x > 0.55) return c;
  float fall = 1.0 - a, k = 0.5 * min(1.0, a * 2.0);
  vec3 col = srgbToLinear(vec3(170.0, 160.0, 140.0) / 255.0);
  for (int d = 0; d < 26; d++) {
    if (float(d) >= n) break;
    vec2 m = vec2(-0.42 + hash1(vec3(float(d), seed, 7.0)) * 0.9 + sin(fall * 6.0 + float(d)) * 0.01, -0.68 + (0.2 + hash1(vec3(float(d), seed, 9.0))) * fall * 1.1);
    float r = 0.002 + hash1(vec3(float(d), 0.0, 4.0)) * 0.0025, R = max(r, 0.7 * pxl);
    float o = k * (1.0 - smoothstep(R - 0.5 * pxl, R + 0.5 * pxl, length(p - m))) * min(1.0, r * r / (R * R));
    c = over(vec4(col * o, o), c);
  }
  return c;
}
vec4 shade(vec4 painted, vec2 at, vec2 uv) {
  float pxl = max(length(fwidth(at)), 1e-5);
  vec2 p = at - MID;
  float b = 1.3 * pow(max(fl, 0.0) / FL, 1.5);
  vec4 c = painted;
  vec4 room = layer(1, at);
  c = over(vec4(room.rgb * b, room.a), c);
  vec4 leaf = layer(2, at - vec2(shake, 0.0));
  c = over(vec4(leaf.rgb * b, leaf.a), c);
  // the flame: stretched about its foot as the light goes up and down, its tip leaning
  float foot = CANDLE.y + 0.03, rise = clamp((foot - p.y) / (0.05 * max(fl, 0.05)), 0.0, 1.0);
  vec2 q = vec2(p.x - sway * rise, foot + (p.y - foot) * FL / max(fl, 0.05));
  vec4 flame = layer(3, MID + q);
  c = over(flame, c);
  emission += flame.rgb * 2.0;
  c = over(dust(p, kn, 12.0, 0.0, pxl), c);
  c = over(dust(p, an, 26.0, 50.0, pxl), c);
  // the dark all round, closing in on the candle
  float v = clamp((length(p - (CANDLE + vec2(0.3, -0.1))) - 0.2) / 1.05, 0.0, 1.0);
  return c * (1.0 - 0.85 * v);
}
