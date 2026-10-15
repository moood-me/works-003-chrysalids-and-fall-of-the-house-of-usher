// The knot comes as the crack reaches it (`reveal`, lib.js REVEAL; `knot` its brightness) and breathes: the glow on the
// stone — its heart (layer 1) breathing over its rim (2) — and the ember in the hole (3), shining; the hole (the base)
// under the ember.
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  let down = mix(-0.04, 0.98, smoothstep(0.0, 1.0, u_reveal));
  let b = u_knot * clamp((down - at.y + 0.02) / 0.05, 0.0, 1.0);
  let breath = 0.75 + 0.25 * sin(u_time * 1.1) + 0.05 * wobble(u_time * 0.9);
  let heart = layer(1, at) * b * breath;
  let rim = layer(2, at) * b;
  let ember = layer(3, at) * b * breath;
  let hole = painted * b;
  var o = heart + rim * (1.0 - heart.a);
  o = hole + o * (1.0 - hole.a);
  o = ember + o * (1.0 - ember.a);
  emission = ember.rgb * 2.0 + heart.rgb * 0.8;
  return o;
}
