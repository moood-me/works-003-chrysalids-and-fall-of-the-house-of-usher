// each glint in its cell of the water (0.1 × 0.04 of the close-up's own units from the water's corner; `cx`, `cy`, `k`:
// where its frame is on the stage and how large — closeup_glints.animate.js) blinking in its own time
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  let local = (at - vec2f(u_cx, u_cy)) / u_k;
  let cell = floor((local - vec2f(-0.7, 0.25)) / vec2f(0.1, 0.04));
  let k = (1.0 + 2.0 * hash2(cell + 3.0)) / (2.0 * PI);
  let p = hash2(cell + 9.0);
  return painted * 0.7 * max(0.0, sin(2.0 * PI * (cycle(k) + p)));
}
