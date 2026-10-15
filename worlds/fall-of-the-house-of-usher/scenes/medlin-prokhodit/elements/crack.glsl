// the crack as far as it has run (reach: metres up the pier), the thin one widening into the wide one
vec4 shade(vec4 painted, vec2 at, vec2 uv) {
  float shown = 1.0 - smoothstep(reach - 0.03, reach + 0.03, -at.y);
  return mix(layer(1, at), layer(2, at), wide) * shown;
}
