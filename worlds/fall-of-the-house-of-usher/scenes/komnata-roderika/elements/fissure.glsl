// The fissure's lines (layer 1) as the wall's light has them; while he sings (`song`) a pale light from within it (2) —
// unlit, added.
vec4 shade(vec4 painted, vec2 at, vec2 uv) {
  emission = layer(2, at).rgb * song * 0.6;
  return layer(1, at);
}
