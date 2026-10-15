// Where the sound from below comes up (`ring`: its animate follows `ripple`): faint rings spreading over the stone from a
// point, a soft sheen there, and the grit on it trembling — the more, the nearer it is heard.
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  let r = length(at * vec2f(1.0, 1.087));
  var a = 0.0;
  for (var i = 0; i < 4; i++) {
    let u = fract(cycle(0.35) + f32(i) / 4.0);
    let rr = 0.06 + u * (0.45 + 0.45 * u_ring);
    a += u_ring * 0.32 * sin(3.14159 * u) * (1.0 - 0.5 * u) * smoothstep(0.012, 0.0, abs(r - rr));
  }
  a += u_ring * 0.12 * max(0.0, 1.0 - r / (0.5 + 0.4 * u_ring));
  let cell = floor(at / 0.03);
  let h = hash2(cell * 7.0 + 3.0);
  if (h > 0.9 && r < 0.55) {
    let c = (cell + 0.5) * 0.03 + 0.01 * u_ring * vec2f(sin(6.2831853 * cycle(6.4 + 2.0 * h)), cos(6.2831853 * cycle(5.9 + 1.7 * h)));
    a += smoothstep(0.006, 0.0, length(at - c)) * u_ring * 0.6;
  }
  a = clamp(a, 0.0, 1.0);
  return vec4f(vec3f(0.69, 0.76, 0.78) * a, a);
}
