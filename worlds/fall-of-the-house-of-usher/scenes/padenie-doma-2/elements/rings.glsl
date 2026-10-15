// The rings on the tarn where the house went down (`rings`): seven of them spreading slowly from the middle, fading
// as they go; their near arcs red as far as `moon`.
vec4 shade(vec4 painted, vec2 at, vec2 uv) {
  float r = length(at), a = 0.0, near = smoothstep(0.5, 0.9, at.y / max(r, 0.001));
  for (int i = 0; i < 7; i++) {
    float u = fract(cycle(0.028) + float(i) / 7.0), R = 3.0 + 56.0 * (1.0 - (1.0 - u) * (1.0 - u));
    a += (1.0 - u) * min(1.0, u * 6.0) * 0.7 * smoothstep((0.5 - 0.25 * u) * 0.5, 0.0, abs(r - R));
  }
  a = clamp(a * rings, 0.0, 1.0);
  vec3 col = mix(vec3(0.59, 0.59, 0.63), vec3(0.86, 0.31, 0.22), 0.8 * moon * near);
  return vec4(col * a, a);
}
