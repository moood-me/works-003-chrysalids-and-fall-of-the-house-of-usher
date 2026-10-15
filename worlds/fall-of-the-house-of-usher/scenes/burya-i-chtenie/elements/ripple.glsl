// Where the sound from below comes up (`ring`: its animate follows `ripple`): faint rings spreading over the stone from a
// point, a soft sheen there, and the grit on it trembling — the more, the nearer it is heard.
vec4 shade(vec4 painted, vec2 at, vec2 uv) {
  float r = length(at * vec2(1.0, 1.087)), a = 0.0;
  for (int i = 0; i < 4; i++) {
    float u = fract(cycle(0.35) + float(i) / 4.0), rr = 0.06 + u * (0.45 + 0.45 * ring);
    a += ring * 0.32 * sin(3.14159 * u) * (1.0 - 0.5 * u) * smoothstep(0.012, 0.0, abs(r - rr));
  }
  a += ring * 0.12 * max(0.0, 1.0 - r / (0.5 + 0.4 * ring));
  vec2 cell = floor(at / 0.03);
  float h = hash1(cell * 7.0 + 3.0);
  if (h > 0.9 && r < 0.55) {
    vec2 c = (cell + 0.5) * 0.03 + 0.01 * ring * vec2(sin(6.2831853 * cycle(6.4 + 2.0 * h)), cos(6.2831853 * cycle(5.9 + 1.7 * h)));
    a += smoothstep(0.006, 0.0, length(at - c)) * ring * 0.6;
  }
  a = clamp(a, 0.0, 1.0);
  return vec4(vec3(0.69, 0.76, 0.78) * a, a);
}
