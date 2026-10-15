// The inside of the coffin, each moment (inside.js paints it once: the base — the dark, the lid's underside —, layer 1 the
// hairline, 2 the screws' points through, 3 the wood split round them). fl — the torch's light beyond the wood now (its
// tremble and how much is left), seam — how much is left (the shapes' darkness on the wood goes with it), m1, m2 — the
// two shapes over the seam (across, frame heights from the middle), n1, n2 — how dark each is now, u1…u4 — how far each
// point has come (0…1: the wood splits by 0.3, then the point slides out of it). In frame heights about the middle.
const MID = vec2f(0.888889, 0.5);
const Y = -0.2;
fn spanOf(v: f32, a: f32, b: f32) -> f32 { return clamp((v - a) / (b - a), 0.0, 1.0); }
// how much of the hairline the shapes hide at x
fn shadowAt(x: f32) -> f32 {
  let d = max(clamp(1.0 - abs(x - u_m1) / 0.3, 0.0, 1.0) * u_n1, clamp(1.0 - abs(x - u_m2) / 0.24, 0.0, 1.0) * u_n2);
  return min(0.97, 1.3 * d);
}
// a shape's darkness on the wood under the seam (a soft disc about it, as far as it reaches)
fn shapeDark(p: vec2f, m: f32, w: f32) -> f32 {
  if (abs(p.x - m) > 0.5 || p.y < Y - 0.05 || p.y > Y + 0.25) { return 0.0; }
  return 0.85 * u_seam * (1.0 - clamp(length(p - vec2f(m, Y)) / (w * 1.3), 0.0, 1.0));
}
fn over(top: vec4f, under: vec4f) -> vec4f { return top + under * (1.0 - top.a); }
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  let pxl = max(length(abs(at_dx) + abs(at_dy)), 1e-5);
  let p = at - MID;
  // the dark and the underside, as much as the seam lights it, darker under the shapes
  let dk = 1.0 - (1.0 - shapeDark(p, u_m1, 0.3)) * (1.0 - shapeDark(p, u_m2, 0.24));
  var c = vec4f(painted.rgb * u_fl * (1.0 - dk), painted.a);
  // the hairline, cut off under the shapes
  let hair = layer(1, at) * (u_fl * (1.0 - shadowAt(p.x + 0.01)));
  c = over(hair, c);
  emission += hair.rgb * 1.5;
  // each screw: the wood splitting round it, its point sliding out, grit falling toward her face
  var screws = array<vec4f, 4>(vec4f(-0.5, Y + 0.09, u_u1, 0.0), vec4f(0.38, Y + 0.08, u_u2, 1.0), vec4f(-0.05, Y + 0.05, u_u3, 2.0), vec4f(0.78, Y + 0.06, u_u4, 3.0));
  let grit = srgbToLinear(vec3f(150.0, 110.0, 70.0) / 255.0);
  for (var n = 0; n < 4; n++) {
    let sc = screws[n];
    let px = sc.x;
    let py = sc.y;
    let u = sc.z;
    let z = 0.6 + 4.0 * (py - Y);
    if (u <= 0.01) { continue; }
    if (abs(p.x - px) < 0.05 * z) { c = over(layer(3, at) * (0.8 * spanOf(u, 0.0, 0.3) * u_fl), c); }
    let full = 0.12 * z;
    let shown = spanOf(u, 0.3, 1.0) * full;
    if (shown > 0.001 && p.y >= py && p.y <= py + shown && abs(p.x - px) < 0.02 * z) {
      let pt = layer(2, at + vec2f(0.0, full - shown));
      c = over(vec4f(pt.rgb * (0.15 + 0.85 * u_fl), pt.a), c);
    }
    let ga = 0.55 * u_fl * spanOf(u, 0.05, 0.3) * (1.0 - 0.6 * spanOf(u, 0.85, 1.0));
    if (ga > 0.002) {
      for (var d = 0; d < 6; d++) {
        let q = fract(u * 4.0 + f32(d) / 6.0);
        let gp = vec2f(px + (hash3(vec3f(f32(d), sc.w, 2.0)) - 0.5) * 0.05 * z + (hash3(vec3f(f32(d), sc.w, 6.0)) - 0.5) * q * 0.1, py + 0.02 + q * q * 0.4);
        let r = 0.003 * z * (1.0 + q);
        let a = ga * (1.0 - smoothstep(r - 0.5 * pxl, r + 0.5 * pxl, length(p - gp)));
        c = over(vec4f(grit * a, a), c);
      }
    }
  }
  return c;
}
