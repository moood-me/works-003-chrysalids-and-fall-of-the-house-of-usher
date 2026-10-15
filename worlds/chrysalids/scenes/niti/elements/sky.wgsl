// the stars twinkle: what is bright in the painting (a star) wavers, each cell of the sky at its own pace
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  let cell = floor(at * 300.0);
  let h = hash2(cell);
  let tw = 0.65 + 0.35 * sin(u_time * (0.4 + h * 1.4) + h * 6.283);
  let star = step(0.08, luma(painted.rgb) - 0.04);
  return vec4f(mix(painted.rgb, painted.rgb * tw, star), painted.a);
}
