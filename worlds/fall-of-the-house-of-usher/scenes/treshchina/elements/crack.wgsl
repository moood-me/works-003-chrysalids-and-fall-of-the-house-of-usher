// How far the crack has come down the wall (`reveal`, lib.js REVEAL): the crack (layer 3) and its red glow (the base,
// shining: emission) cut where its tip is; the rows' words (2) coming as it reaches them; the inscription (1) first.
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  let down = mix(-0.04, 0.98, smoothstep(0.0, 1.0, u_reveal));
  let px = max(length(abs(at_dx) + abs(at_dy)), 1e-5);
  let tip = clamp((down - at.y) / (1.5 * px), 0.0, 1.0);
  let reached = clamp((down - at.y + 0.06) / 0.06, 0.0, 1.0);
  var o = layer(1, at) * u_title;
  let c = layer(3, at) * tip;
  o = c + o * (1.0 - c.a);
  let w = layer(2, at) * reached;
  o = w + o * (1.0 - w.a);
  emission = painted.rgb * tip * 0.35;
  return o;
}
