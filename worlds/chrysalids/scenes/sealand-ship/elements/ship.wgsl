// the craft: its painting; the spiral's rings lit going round as fast as `spin` (bright arcs sweeping them); the threads
// (layer 1) let down from its belly as far as `fall`, beads of light sliding down them
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  var c = painted;
  let th = layer(1, at);
  let down = (at.y + 1.1) / 10.1;
  let shown = 1.0 - smoothstep(u_fall * 1.3 - 0.1, u_fall * 1.3, down);
  c = c + th * shown * (1.0 - c.a);
  let bead = step(0.2, th.a) * smoothstep(0.92, 1.0, fract(down * 3.0 - u_time * 0.3 + hash2(floor(at * 2.0)))) * shown;
  emission = vec3f(1.0, 0.96, 0.92) * bead * 0.8;
  let sp = layer(2, at);
  let ang = atan2((at.y + 2.05 + 2.3) * 5.0, at.x - 0.4);
  let sweep = pow(max(0.0, sin(ang * 3.0 - u_time * (0.8 + 9.0 * u_spin))), 6.0);
  c = c + sp * (1.0 - c.a);
  emission = emission + vec3f(1.0, 0.98, 1.0) * sp.a * sweep * (0.3 + 0.9 * u_spin);
  let lg = layer(3, at);
  c = c + lg * u_legs * (1.0 - c.a);
  let dr = layer(4, at);
  emission = emission + dr.rgb * u_door;
  let rp = layer(5, at);
  c = c + rp * u_ramp * (1.0 - c.a);
  emission = emission * u_vis;
  return c * u_vis;
}
