// The storm's sky: the clouds flying (lower bands faster: `cloud`, its animate's — in the storm faster), wrapping round
// the stage's width; their undersides lit by the glowing mist (`glow`), their tops and the sky by the lightning
// (`flash`); the mist creeping over the land (`mistgo`).
vec4 over(vec4 src, vec3 dst) { return vec4(src.rgb + dst * (1.0 - src.a), 1.0); }
vec4 shade(vec4 painted, vec2 at, vec2 uv) {
  float W = width, A = W - 0.6;
  float band = 0.6 + 1.6 * clamp((at.y + 0.12) / 0.44, 0.0, 1.0);
  vec2 ac = vec2(mod(at.x + 0.3 - cloud * band, W) - 0.3, at.y);
  vec2 am = vec2(mod(at.x + 0.3 - mistgo, W) - 0.3, at.y);
  float fl = flash * (0.85 + 0.15 * sin(6.2831853 * cycle(6.5)));
  vec3 col = painted.rgb;
  // the lightning in the sky, brightest off to the right, above the land
  float d = length(vec2(at.x - A * 0.8, at.y - 0.12));
  col += vec3(0.84, 0.88, 0.92) * fl * (0.7 * exp(-d * 3.0) + 0.12) * smoothstep(0.53, 0.47, at.y);
  col = over(layer(1, ac), col).rgb;
  col += layer(2, ac).rgb * (0.15 + 0.85 * glow);
  col += layer(3, ac).rgb * fl;
  vec4 m = layer(4, am) * (0.2 + 0.8 * glow);
  col = m.rgb + col * (1.0 - m.a);
  return vec4(col, 1.0);
}
