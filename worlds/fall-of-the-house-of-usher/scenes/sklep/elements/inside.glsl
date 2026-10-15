// The inside of the coffin, each moment (inside.js paints it once: the base — the dark, the lid's underside —, layer 1 the
// hairline, 2 the screws' points through, 3 the wood split round them). fl — the torch's light beyond the wood now (its
// tremble and how much is left), seam — how much is left (the shapes' darkness on the wood goes with it), m1, m2 — the
// two shapes over the seam (across, frame heights from the middle), n1, n2 — how dark each is now, u1…u4 — how far each
// point has come (0…1: the wood splits by 0.3, then the point slides out of it). In frame heights about the middle.
const vec2 MID = vec2(0.888889, 0.5);
const float Y = -0.2;
float span(float v, float a, float b) { return clamp((v - a) / (b - a), 0.0, 1.0); }
// how much of the hairline the shapes hide at x
float shadowAt(float x) {
  float d = max(clamp(1.0 - abs(x - m1) / 0.3, 0.0, 1.0) * n1, clamp(1.0 - abs(x - m2) / 0.24, 0.0, 1.0) * n2);
  return min(0.97, 1.3 * d);
}
// a shape's darkness on the wood under the seam (a soft disc about it, as far as it reaches)
float shapeDark(vec2 p, float m, float w) {
  if (abs(p.x - m) > 0.5 || p.y < Y - 0.05 || p.y > Y + 0.25) return 0.0;
  return 0.85 * seam * (1.0 - clamp(length(p - vec2(m, Y)) / (w * 1.3), 0.0, 1.0));
}
vec4 over(vec4 top, vec4 under) { return top + under * (1.0 - top.a); }
vec4 shade(vec4 painted, vec2 at, vec2 uv) {
  float pxl = max(length(fwidth(at)), 1e-5);
  vec2 p = at - MID;
  // the dark and the underside, as much as the seam lights it, darker under the shapes
  float dk = 1.0 - (1.0 - shapeDark(p, m1, 0.3)) * (1.0 - shapeDark(p, m2, 0.24));
  vec4 c = vec4(painted.rgb * fl * (1.0 - dk), painted.a);
  // the hairline, cut off under the shapes
  vec4 hair = layer(1, at) * (fl * (1.0 - shadowAt(p.x + 0.01)));
  c = over(hair, c);
  emission += hair.rgb * 1.5;
  // each screw: the wood splitting round it, its point sliding out, grit falling toward her face
  vec4 S[4] = vec4[4](vec4(-0.5, Y + 0.09, u1, 0.0), vec4(0.38, Y + 0.08, u2, 1.0), vec4(-0.05, Y + 0.05, u3, 2.0), vec4(0.78, Y + 0.06, u4, 3.0));
  vec3 grit = srgbToLinear(vec3(150.0, 110.0, 70.0) / 255.0);
  for (int n = 0; n < 4; n++) {
    float px = S[n].x, py = S[n].y, u = S[n].z, z = 0.6 + 4.0 * (py - Y);
    if (u <= 0.01) continue;
    if (abs(p.x - px) < 0.05 * z) c = over(layer(3, at) * (0.8 * span(u, 0.0, 0.3) * fl), c);
    float full = 0.12 * z, shown = span(u, 0.3, 1.0) * full;
    if (shown > 0.001 && p.y >= py && p.y <= py + shown && abs(p.x - px) < 0.02 * z) {
      vec4 pt = layer(2, at + vec2(0.0, full - shown));
      c = over(vec4(pt.rgb * (0.15 + 0.85 * fl), pt.a), c);
    }
    float ga = 0.55 * fl * span(u, 0.05, 0.3) * (1.0 - 0.6 * span(u, 0.85, 1.0));
    if (ga > 0.002) for (int d = 0; d < 6; d++) {
      float q = fract(u * 4.0 + float(d) / 6.0);
      vec2 gp = vec2(px + (hash1(vec3(float(d), S[n].w, 2.0)) - 0.5) * 0.05 * z + (hash1(vec3(float(d), S[n].w, 6.0)) - 0.5) * q * 0.1, py + 0.02 + q * q * 0.4);
      float r = 0.003 * z * (1.0 + q), a = ga * (1.0 - smoothstep(r - 0.5 * pxl, r + 0.5 * pxl, length(p - gp)));
      c = over(vec4(grit * a, a), c);
    }
  }
  return c;
}
