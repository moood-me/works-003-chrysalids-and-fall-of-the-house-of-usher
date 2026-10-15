// The flames (layer 1, each painted at its fullest over its wick) as they burn now: each its own height — how lit it is
// (l0…l4), its flicker (the same as lib.js flicker: livelier with `wild`, a jump at each stroke, `pulse`), taller in the
// guitar's frenzy — and sway, more toward its tip; shining (emission). The iron and the wax (the base) as the light has
// them.
const float CX[5] = float[5](-0.08, 0.0, 0.075, -0.5, 0.17);
const float TOP[5] = float[5](-1.1, -1.21, -1.05, -1.175, -1.115);
const float FH = 0.05;
float flick(float t, float k) {
  return 1.0 + (0.05 + 0.12 * wild) * sin(t * (7.3 + 5.0 * wild) + k) + (0.03 + 0.08 * wild) * sin(t * (11.9 + 7.0 * wild) + 1.0 + k * 2.0)
    + 0.025 * sin(t * 2.3 + k) + 0.35 * pulse;
}
vec4 shade(vec4 painted, vec2 at, vec2 uv) {
  float L[5] = float[5](l0, l1, l2, l3, l4);
  // the candle whose flame this may be: the nearest across
  int i = 0;
  float best = 1e9;
  for (int k = 0; k < 5; k++) { float d = abs(at.x - CX[k]); if (d < best) { best = d; i = k; } }
  vec4 o = painted;
  float lit = L[i];
  if (lit > 0.02 && best < 0.06) {
    float k = float(i), t = u_time;
    float f = flick(t, k) * (1.0 + 0.1 * sin(t * (8.1 + k) + k * 2.0));
    float sy = f * (0.45 + 0.55 * lit) * (1.0 + 0.5 * wild);
    float sx = mix(0.8, 1.0, lit);
    // its sway: the tip led aside, the root still
    float sw = (0.004 + 0.02 * wild) * sin(t * (2.1 + k * 0.4 + 6.0 * wild) + k);
    vec2 wick = vec2(CX[i], TOP[i]);
    vec2 d = at - wick;
    float up = clamp(-d.y / (FH * sy), 0.0, 1.0);
    vec2 src = wick + vec2((d.x - sw * up * up) / sx, d.y / sy);
    vec4 flame = layer(1, src) * lit;
    emission = flame.rgb * 2.2;
    o = flame + o * (1.0 - flame.a);
  }
  return o;
}
