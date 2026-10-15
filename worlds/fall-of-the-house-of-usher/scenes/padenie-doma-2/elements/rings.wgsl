// The rings on the tarn where the house went down (`rings`): seven of them spreading slowly from the middle, fading
// as they go; their near arcs holding the red of the sky as far as `moon`.
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  let r = length(at);
  var a = 0.0;
  let near = smoothstep(0.5, 0.9, at.y / max(r, 0.001));
  for (var i = 0; i < 7; i++) {
    let u = fract(cycle(0.028) + f32(i) / 7.0);
    let R = 3.0 + 56.0 * (1.0 - (1.0 - u) * (1.0 - u));
    a += (1.0 - u) * min(1.0, u * 6.0) * 0.7 * smoothstep((0.5 - 0.25 * u) * 0.5, 0.0, abs(r - R));
  }
  a = clamp(a * u_rings, 0.0, 1.0);
  let col = mix(vec3f(0.59, 0.59, 0.63), vec3f(0.86, 0.31, 0.22), 0.8 * u_moon * near);
  return vec4f(col * a, a);
}
