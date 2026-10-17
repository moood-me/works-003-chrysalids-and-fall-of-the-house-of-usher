// the stars twinkling, each in its own time: its cell of the sky says how fast and when
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  let st = layer(1, at);
  let cell = floor(at / 0.012);
  let k = 0.12 + 0.25 * hash2(cell);
  let p = hash2(cell + 7.3);
  let tw = 0.6 + 0.4 * sin(2.0 * PI * (cycle(k) + p));
  return vec4f(painted.rgb * (1.0 - st.a) + st.rgb * tw, painted.a);
}
