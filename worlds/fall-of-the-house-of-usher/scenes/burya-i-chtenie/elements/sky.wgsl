// The storm's sky: the clouds flying (lower bands faster: `cloud`, its animate's — in the storm faster), wrapping round
// the stage's width; their undersides lit by the glowing mist (`glow`), their tops and the sky by the lightning
// (`flash`); the mist creeping over the land (`mistgo`).
fn over(src: vec4f, dst: vec3f) -> vec4f { return vec4f(src.rgb + dst * (1.0 - src.a), 1.0); }
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  let W = u_width;
  let A = W - 0.6;
  let band = 0.6 + 1.6 * clamp((at.y + 0.12) / 0.44, 0.0, 1.0);
  let ac = vec2f(wrap(at.x + 0.3 - u_cloud * band, W) - 0.3, at.y);
  let am = vec2f(wrap(at.x + 0.3 - u_mistgo, W) - 0.3, at.y);
  let fl = u_flash * (0.85 + 0.15 * sin(6.2831853 * cycle(6.5)));
  var col = painted.rgb;
  // the lightning in the sky, brightest off to the right, above the land
  let d = length(vec2f(at.x - A * 0.8, at.y - 0.12));
  col += vec3f(0.84, 0.88, 0.92) * fl * (0.7 * exp(-d * 3.0) + 0.12) * smoothstep(0.53, 0.47, at.y);
  col = over(layer(1, ac), col).rgb;
  col += layer(2, ac).rgb * (0.15 + 0.85 * u_glow);
  col += layer(3, ac).rgb * fl;
  let m = layer(4, am) * (0.2 + 0.8 * u_glow);
  col = m.rgb + col * (1.0 - m.a);
  return vec4f(col, 1.0);
}
