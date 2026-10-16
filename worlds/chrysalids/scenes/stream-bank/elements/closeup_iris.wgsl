// the dark ring round the close-up's window: from its edge (`r` × `open` of the frame's height about `cx`, `cy`) out
// a third as far again, darkest at the edge, soft both ways; nothing beyond it
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  let r = u_r * max(u_open, 0.001);
  let d = length(at - vec2f(u_cx, u_cy));
  let ring = smoothstep(0.86 * r, r, d) * (1.0 - smoothstep(r, 1.35 * r, d));
  return painted * 0.8 * ring * min(1.0, u_open * 1.6);
}
