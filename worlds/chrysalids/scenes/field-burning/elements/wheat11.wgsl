// A row of the wheat burning: the row's own across a (= at.x: its anchor is on the line of sight) and distance u_rd. The
// offending field (from the track to 30 m across, up to 30 m deep) burns: the fire at 50·u_ignite m from across 0.5 (the
// farther rows later), the ash at 60·u_ash m behind it. Where the fire is, the stalks char and flames rise over them —
// tongues of light (emission) wavering on their own; where it has passed, the stubble (layer 1) is left.
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  let a = at.x;
  let off = step(-2.95, a) * step(a, 30.0) * step(u_rd, 30.0) * clamp((a + 2.95) / 0.7, 0.0, 1.0);
  let reach = abs(a - 0.5) + (u_rd - 9.5) * 0.9;
  let lit = clamp((u_ignite * 50.0 - reach) / 1.2, 0.0, 1.0) * off;
  let burnt = clamp((u_ash * 60.0 - reach) / 3.0, 0.0, 1.0) * off;
  let stub = layer(1, at);
  var c = painted * (1.0 - smoothstep(0.55, 0.9, burnt)) + stub * smoothstep(0.55, 0.9, burnt);
  c = vec4f(c.rgb * (1.0 - 0.8 * lit * (1.0 - burnt)), c.a);
  // the flames over the burning line: tongues — each its own height along the line, wavering in time, rising and
  // thinning, gaps between them; bright and yellow at their roots in the stalks, orange and thin at the tips
  let front = lit * (1.0 - burnt) * u_fire;
  let n = noise2(vec2f(a * 0.9 + u_time * 0.35, u_time * 1.1 + u_rd));
  let col = noise2(vec2f(a * 2.6, u_time * 0.9 + u_rd * 0.37));
  let h = front * (0.5 + 1.6 * n) * max(0.0, 1.5 * col - 0.3) * select(1.0, 1.25, u_rd < 12.0);
  let y = -at.y;
  let tongue = noise2(vec2f(a * 3.2, y * 2.4 - u_time * 3.0));
  let flame = smoothstep(-0.08, 0.06, y) * (1.0 - smoothstep(h * 0.2, h, y + 0.45 * h * (tongue - 0.5))) * step(0.02, h);
  let up = clamp(y / max(h, 0.01), 0.0, 1.0);
  let heat = mix(vec3f(1.0, 0.72, 0.32), vec3f(0.9, 0.28, 0.08), up);
  emission = heat * flame * (0.95 - 0.45 * up) * (0.45 + 0.55 * tongue);
  return vec4f(c.rgb, max(c.a, 0.0));
}
