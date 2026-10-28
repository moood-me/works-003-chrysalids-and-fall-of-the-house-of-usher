// the web reaching over the clearing as `web` grows: the far side (under the ship, y < 0) first, the near side last; the
// beads glinting in their own time
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  let th = clamp(0.15 + (at.y / 24.0 + 0.5) * 0.45 + abs(at.x - 2.0) / 40.0, 0.0, 0.9) * 0.9;
  let k = clamp((u_web - th) / 0.25, 0.0, 1.0);
  let cell = floor(at / 0.5);
  let tw = 0.6 + 0.4 * sin(2.0 * PI * (cycle(0.3 + 0.4 * hash2(cell)) + hash2(cell + 3.0)));
  return painted * k * tw;
}
