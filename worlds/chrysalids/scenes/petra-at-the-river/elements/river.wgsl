// the river's flow and the rain on it: streaks drifting downstream (to the right), faster as `danger` grows and nearer
// us; the rain's dimples — little rings opening and fading, each in its own cell and time, as many as `rain`
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  var c = painted.rgb;
  let near = clamp((at.y + 9.5) / 19.0, 0.0, 1.0);
  let sp = (0.6 + u_danger * 2.2) * (0.5 + near);
  let rowk = floor(at.y / 0.35);
  let x = at.x - u_time * sp * (0.7 + 0.6 * hash2(vec2f(rowk, 3.0)));
  let cell = floor(vec2f(x / 2.4, at.y / 0.35));
  let f = vec2f(x / 2.4, at.y / 0.35) - cell;
  let streak = step(hash2(cell), 0.35) * (1.0 - smoothstep(0.0, 0.25, abs(f.y - 0.5))) * smoothstep(0.0, 0.2, f.x) * (1.0 - smoothstep(0.5, 0.9, f.x));
  c = mix(c, vec3f(0.78, 0.8, 0.76) * painted.a, 0.22 * streak);
  let dc = floor(at / 0.9);
  let df = at / 0.9 - dc;
  let k = fract(u_time * (0.5 + 0.4 * hash2(dc)) + hash2(dc + 5.0));
  let ring = abs(length((df - vec2f(0.5, 0.5)) * vec2f(1.0, 2.8)) - k * 0.45);
  let dimple = step(hash2(dc + 9.0), u_rain) * (1.0 - smoothstep(0.0, 0.03, ring)) * (1.0 - k);
  c = mix(c, vec3f(0.85, 0.87, 0.83) * painted.a, 0.4 * dimple);
  return vec4f(c, painted.a);
}
