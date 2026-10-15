// The curtain in the wind (`gust`: its animate follows `wind`): it stirs a little always; blown, it billows into the room
// — the more toward its hem, blown left, its lower part lifted, the gusts running down the cloth in waves; its right
// edge, against the wall, goes less.
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  let y = at.y;
  let t = u_time;
  let k = pow(max(0.0, (y + 4.9) / 4.9), 1.8);
  let sway = k * (0.04 * sin(6.2831853 * cycle(0.0844)) + 0.022 * sin(6.2831853 * cycle(0.1385) + 1.0) + 0.01 * sin(6.2831853 * cycle(0.3024) + 2.0));
  let blow = u_gust * k * (0.95 + 0.25 * wobble(t * 1.3 + y * 0.6) + 0.1 * sin(y * 3.2 - 6.2831853 * cycle(1.114)));
  let edge = mix(1.0, 0.4 + 0.45 * u_gust, smoothstep(-0.24, 0.36, at.x));
  let kl = max(0.0, (y + 2.6) / 2.6);
  let lift = u_gust * kl * kl * (0.75 + 0.2 * wobble(t * 1.7) + 0.05 * sin(6.2831853 * cycle(1.43) + y * 4.0));
  return layer(0, vec2f(at.x - (sway - blow) * edge, at.y + lift * mix(1.0, 0.8, smoothstep(-0.24, 0.36, at.x))));
}
