// The sky over the tarn: the pale painting turning to the blood-red one as `moon` comes into the fissure; the high
// clouds and the low band flying (each band its pace, wrapping round `width`), thicker in the storm; the moon's disc
// between them (none in the morning); on the water the strokes swaying and the moon's path twinkling, dab by dab.
fn over(s: vec4f, d: vec4f) -> vec4f { return s + d * (1.0 - s.a); }
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  let W = u_width;
  var c = mix(painted, layer(1, at), u_moon);
  let a2 = vec2f(wrap(at.x + 0.8 - u_cloud * 0.7, W) - 0.8, at.y);
  c = over(mix(layer(2, a2), layer(3, a2), u_moon) * ((0.5 + 0.45 * u_storm) / 0.95), c);
  c = over(mix(layer(4, at), layer(5, at), u_moon) * (1.0 - u_morning), c);
  let a6 = vec2f(wrap(at.x + 0.8 - u_cloud * 1.4, W) - 0.8, at.y);
  c = over(mix(layer(6, a6), layer(7, a6), u_moon) * ((0.25 + 0.4 * u_storm) / 0.65), c);
  if (at.y > u_hz) {
    c = over(layer(9, at + vec2f(0.01 * sin(at.y * 40.0 + 6.2831853 * cycle(0.04)), 0.0)), c);
    let row = floor(at.y * 400.0);
    let p = layer(8, at + vec2f(0.008 * sin(6.2831853 * cycle(0.1) + at.y * 60.0), 0.0));
    let tw = 0.45 + 0.55 * sin(6.2831853 * cycle(0.14 + 0.16 * hash2(vec2f(row, 3.0))) + row * 2.3);
    c = vec4f(c.rgb + p.rgb * max(tw, 0.0) * (1.0 - u_morning), c.a);
  }
  return vec4f(c.rgb, 1.0);
}
