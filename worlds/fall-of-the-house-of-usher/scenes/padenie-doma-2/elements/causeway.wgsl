// The causeway as the house falls: its boards (layer 1) from the break (`brk`, plane metres: its ragged edge) to the
// shore; beyond it only sunk slabs and posts in the water (2); while the break runs (`hot`), a red-hot crack along the
// boards ahead of it, as red as the moon is (`moon`).
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  let x = at.x;
  let y = at.y;
  let edge = u_brk + 0.5 * sin(x * 9.0 + u_brk) + 0.35 * sin(x * 23.0 + 2.0 * u_brk);
  let keep = smoothstep(edge - 0.04, edge + 0.04, y);
  let c = layer(1, at) * keep + layer(2, at) * (1.0 - smoothstep(edge - 0.7, edge - 0.5, y)) * (1.0 - keep);
  let u = (y - edge + 1.0) / 10.0;
  if (u_hot > 0.0 && u > 0.0 && u < 1.0) {
    let j = (y - edge + 1.0) / 0.75;
    let seed = floor(u_brk / 3.0) * 13.0;
    let h0 = hash2(vec2f(floor(j), seed));
    let h1 = hash2(vec2f(floor(j) + 1.0, seed));
    let cx = (mix(h0, h1, fract(j)) - 0.5) * 0.9 * (1.0 - u * 0.5);
    let dx = abs(x - cx);
    emission += u_hot * u_moon * (vec3f(1.0, 0.47, 0.31) * 0.5 * smoothstep(0.02, 0.0, dx) + vec3f(0.75, 0.17, 0.11) * 0.25 * smoothstep(0.07, 0.0, dx)) * (1.0 - u);
  }
  return c;
}
