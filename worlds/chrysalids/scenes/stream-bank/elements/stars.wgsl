// each star twinkling in its own time: its cell of the sky (a star in it at most) says how fast and when; all of them
// as bright as the night is in (`night`: stars.animate.js)
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  let cell = floor(at / 0.012);
  let k = 0.1 + 0.15 * hash2(cell);
  let p = hash2(cell + 7.3);
  return painted * u_night * (0.75 + 0.25 * sin(2.0 * PI * (cycle(k) + p)));
}
