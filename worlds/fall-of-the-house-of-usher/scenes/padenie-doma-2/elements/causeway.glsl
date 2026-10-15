// The causeway as the house falls: its boards (pale, or red as `moon` says) from the break (`brk`, plane metres: its
// ragged edge) to the shore; beyond it only sunk slabs and posts in the water; while the break runs (`hot`), a red-hot
// crack along the boards ahead of it.
vec4 shade(vec4 painted, vec2 at, vec2 uv) {
  float x = at.x, y = at.y;
  float edge = brk + 0.5 * sin(x * 9.0 + brk) + 0.35 * sin(x * 23.0 + 2.0 * brk);
  float keep = smoothstep(edge - 0.04, edge + 0.04, y);
  vec4 c = mix(layer(1, at), layer(2, at), moon) * keep + layer(3, at) * (1.0 - smoothstep(edge - 0.7, edge - 0.5, y)) * (1.0 - keep);
  float u = (y - edge + 1.0) / 10.0;
  if (hot > 0.0 && u > 0.0 && u < 1.0) {
    float j = (y - edge + 1.0) / 0.75, seed = floor(brk / 3.0) * 13.0;
    float h0 = hash1(vec2(floor(j), seed)), h1 = hash1(vec2(floor(j) + 1.0, seed));
    float cx = (mix(h0, h1, fract(j)) - 0.5) * 0.9 * (1.0 - u * 0.5), dx = abs(x - cx);
    emission += hot * moon * (vec3(1.0, 0.47, 0.31) * 0.5 * smoothstep(0.02, 0.0, dx) + vec3(0.75, 0.17, 0.11) * 0.25 * smoothstep(0.07, 0.0, dx)) * (1.0 - u);
  }
  return c;
}
