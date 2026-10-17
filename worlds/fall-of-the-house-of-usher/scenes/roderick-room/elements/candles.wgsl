// The flames (layer 1, each painted at its fullest over its wick) as they burn now: each its own height — how lit it is
// (l0…l4), its flicker (the same as lib.js flicker: livelier with `wild`, a jump at each stroke, `pulse`), taller in the
// guitar's frenzy — and sway, more toward its tip; shining (emission). The iron and the wax (the base) as the light has
// them.
const FH = 0.05;
fn flick(t: f32, k: f32) -> f32 {
  return 1.0 + (0.05 + 0.12 * u_wild) * sin(t * (7.3 + 5.0 * u_wild) + k) + (0.03 + 0.08 * u_wild) * sin(t * (11.9 + 7.0 * u_wild) + 1.0 + k * 2.0)
    + 0.025 * sin(t * 2.3 + k) + 0.35 * u_pulse;
}
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  var cx = array<f32, 5>(-0.08, 0.0, 0.075, -0.5, 0.17);
  var top = array<f32, 5>(-1.1, -1.21, -1.05, -1.175, -1.115);
  var lits = array<f32, 5>(u_l0, u_l1, u_l2, u_l3, u_l4);
  // the candle whose flame this may be: the nearest across
  var i = 0;
  var best = 1e9;
  for (var k = 0; k < 5; k++) {
    let d = abs(at.x - cx[k]);
    if (d < best) { best = d; i = k; }
  }
  var o = painted;
  let lit = lits[i];
  if (lit > 0.02 && best < 0.06) {
    let k = f32(i);
    let t = u_time;
    let f = flick(t, k) * (1.0 + 0.1 * sin(t * (8.1 + k) + k * 2.0));
    let sy = f * (0.45 + 0.55 * lit) * (1.0 + 0.5 * u_wild);
    let sx = mix(0.8, 1.0, lit);
    // its sway: the tip led aside, the root still
    let sw = (0.004 + 0.02 * u_wild) * sin(t * (2.1 + k * 0.4 + 6.0 * u_wild) + k);
    let wick = vec2f(cx[i], top[i]);
    let d = at - wick;
    let up = clamp(-d.y / (FH * sy), 0.0, 1.0);
    let src = wick + vec2f((d.x - sw * up * up) / sx, d.y / sy);
    let flame = layer(1, src) * lit;
    emission = flame.rgb * 2.2;
    o = flame + o * (1.0 - flame.a);
  }
  return o;
}
