// the stars twinkle: what is bright in the painting (a star) wavers, each cell of the sky at its own pace; the mist low
// down breathes — a wide soft swell of light going slowly along the horizon
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  let cell = floor(at * 300.0);
  let h = hash2(cell);
  let tw = 0.65 + 0.35 * sin(u_time * (0.4 + h * 1.4) + h * 6.283);
  let star = step(0.08, luma(painted.rgb) - 0.04);
  let low = smoothstep(0.45, 1.15, at.y);
  let swell = 0.5 + 0.5 * sin(u_time * 0.21 + at.x * 1.7 + noise2(vec2f(at.x * 1.3, u_time * 0.03)) * 3.0);
  let haze = vec3f(0.022, 0.015, 0.034) * low * swell * painted.a;
  return vec4f(mix(painted.rgb, painted.rgb * tw, star) + haze, painted.a);
}
