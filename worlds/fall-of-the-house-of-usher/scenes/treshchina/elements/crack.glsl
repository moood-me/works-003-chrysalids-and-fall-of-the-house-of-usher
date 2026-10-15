// How far the crack has come down the wall (`reveal`, lib.js REVEAL): the crack (layer 3) and its red glow (the base,
// shining: emission) cut where its tip is; the rows' words (2) coming as it reaches them; the inscription (1) first.
vec4 shade(vec4 painted, vec2 at, vec2 uv) {
  float down = mix(-0.04, 0.98, smoothstep(0.0, 1.0, reveal));
  float px = max(length(fwidth(at)), 1e-5);
  float tip = clamp((down - at.y) / (1.5 * px), 0.0, 1.0);
  float reached = clamp((down - at.y + 0.06) / 0.06, 0.0, 1.0);
  vec4 o = layer(1, at) * title;
  vec4 c = layer(3, at) * tip;
  o = c + o * (1.0 - c.a);
  vec4 w = layer(2, at) * reached;
  o = w + o * (1.0 - w.a);
  emission = painted.rgb * tip * 0.35;
  return o;
}
