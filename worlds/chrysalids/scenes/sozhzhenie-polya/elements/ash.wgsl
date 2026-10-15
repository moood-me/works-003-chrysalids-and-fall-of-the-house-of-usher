// the ash only where the fire has passed (the field's across a: 13.5 + at.x; its distance d: 19.7 − at.y): burnt as far as
// u_ash has gone (as the wheat's rows burn: 60·ash m from across 0.5, later the farther); embers glowing in what burnt just
// now (between the fire and the ash: u_ignite ahead of u_ash)
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  let a = 13.5 + at.x;
  let d = 19.7 - at.y;
  let reach = abs(a - 0.5) + (d - 9.5) * 0.9;
  let burnt = clamp((u_ash * 60.0 - reach) / 3.0, 0.0, 1.0);
  let lit = clamp((u_ignite * 50.0 - reach) / 1.2, 0.0, 1.0);
  let hot = lit * (1.0 - burnt);
  let speck = step(0.82, hash2(floor(at / 0.12))) * (0.6 + 0.4 * sin(2.0 * PI * (cycle(0.4 + 0.5 * hash2(floor(at / 0.12) + 3.0)) + hash2(floor(at / 0.12) + 7.0))));
  emission = vec3f(1.0, 0.35, 0.1) * speck * hot * u_fire * 2.0;
  // (soft at the burnt field's own edges — by the track and its near row —, no plate's edge)
  let edge = smoothstep(9.2, 10.6, d) * smoothstep(-3.0, -1.6, a);
  let shown = max(burnt, hot * 0.35) * edge;
  return painted * shown;
}
