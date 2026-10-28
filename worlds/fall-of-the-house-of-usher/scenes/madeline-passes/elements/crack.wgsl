// the crack as far as it has run (reach: metres up the pier), the thin one widening into the wide one
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  let shown = 1.0 - smoothstep(u_reach - 0.03, u_reach + 0.03, -at.y);
  return mix(layer(1, at), layer(2, at), u_wide) * shown;
}
