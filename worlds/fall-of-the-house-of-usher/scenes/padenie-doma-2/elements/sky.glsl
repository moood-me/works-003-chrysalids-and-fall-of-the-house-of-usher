// The sky over the tarn: the pale painting turning to the blood-red one as `moon` comes into the fissure; the high
// clouds and the low band flying (each band its pace, wrapping round `width`), thicker in the storm; the moon's disc
// between them (none in the morning); on the water the strokes swaying and the moon's path twinkling, dab by dab.
vec4 over(vec4 s, vec4 d) { return s + d * (1.0 - s.a); }
vec4 shade(vec4 painted, vec2 at, vec2 uv) {
  float W = width;
  vec4 c = mix(painted, layer(1, at), moon);
  vec2 a2 = vec2(mod(at.x + 0.8 - cloud * 0.7, W) - 0.8, at.y);
  c = over(mix(layer(2, a2), layer(3, a2), moon) * ((0.5 + 0.45 * storm) / 0.95), c);
  c = over(mix(layer(4, at), layer(5, at), moon) * (1.0 - morning), c);
  vec2 a6 = vec2(mod(at.x + 0.8 - cloud * 1.4, W) - 0.8, at.y);
  c = over(mix(layer(6, a6), layer(7, a6), moon) * ((0.25 + 0.4 * storm) / 0.65), c);
  if (at.y > hz) {
    c = over(layer(9, at + vec2(0.01 * sin(at.y * 40.0 + 6.2831853 * cycle(0.04)), 0.0)), c);
    float row = floor(at.y * 400.0);
    vec4 p = layer(8, at + vec2(0.008 * sin(6.2831853 * cycle(0.1) + at.y * 60.0), 0.0));
    float tw = 0.45 + 0.55 * sin(6.2831853 * cycle(0.14 + 0.16 * hash1(vec2(row, 3.0))) + row * 2.3);
    c.rgb += p.rgb * max(tw, 0.0) * (1.0 - morning);
  }
  return vec4(c.rgb, 1.0);
}
