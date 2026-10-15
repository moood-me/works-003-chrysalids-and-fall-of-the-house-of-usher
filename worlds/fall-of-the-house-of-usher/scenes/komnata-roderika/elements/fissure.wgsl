// The fissure's lines (layer 1) as the wall's light has them; while he sings (`song`) a pale light from within it (2) —
// unlit, added.
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  emission = layer(2, at).rgb * u_song * 0.6;
  return layer(1, at);
}
