// The stream's glints and its flow, over its painting: within the water (the band round its line, as stream.js paints
// it) short bright dashes come and go, each in its own time — dense in the sun's shimmer ahead (across −1.4), sparse
// elsewhere; faint threads of the current drift along it, each row at its own pace, coming round the 70 m it is long.
fn centre(x: f32) -> f32 { return 0.8 * sin(x / 6.0 - 0.3) + 0.1 * sin(x / 2.7 + 1.0); }
fn halfw(x: f32) -> f32 { return 0.62 + 0.12 * sin(x / 4.3 + 2.0); }
// a dash in a cell (cell: its size; q: the point in cell units): how much of it is here
fn dash(cell: vec2f, q: vec2f, seed: f32, len: f32, thick: f32) -> f32 {
  let c = floor(q);
  let f = q - c;
  let x0 = hash2(c + seed) * (1.0 - len);
  let y0 = 0.25 + 0.5 * hash2(c + seed + 3.7);
  let ax = smoothstep(x0, x0 + 0.02, f.x) * (1.0 - smoothstep(x0 + len - 0.02, x0 + len, f.x));
  let ay = 1.0 - smoothstep(0.0, thick / cell.y, abs(f.y - y0));
  return ax * ay;
}
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  let off = (at.y - centre(at.x)) / halfw(at.x);
  if (abs(off) > 1.0) { return painted; }
  var col = painted.rgb;
  // the glints: cells 0.45 m along, 0.07 m across
  let cell = vec2f(0.45, 0.07);
  let q = at / cell;
  let c = floor(q);
  let near = exp(-pow((at.x + 1.4) / 2.4, 2.0));
  let there = step(hash2(c + 11.0), mix(0.12, 0.85, near)) * step(abs(off), 0.85);
  let len = mix(0.12, 0.7, hash2(c + 5.0)) * mix(0.45, 1.0, near);
  let sp = 0.08 + 0.22 * hash2(c + 19.0);
  let ph = hash2(c + 23.0);
  let blink = max(0.0, sin(2.0 * PI * (cycle(sp) + ph)) * 0.7 + 0.4 * sin(2.0 * PI * (cycle(sp * 0.41) + ph * 2.0)) - 0.1);
  let gl = there * blink * mix(0.5, 0.95, near) * dash(cell, q, 0.0, len, 0.009);
  col = mix(col, vec3f(1.0, 0.92, 0.72) * painted.a, clamp(gl, 0.0, 1.0));
  // the flow: rows 0.12 m across, each drifting along at its own pace, a thread now and then in its 3 m cells
  let row = floor(at.y / 0.12);
  let v = 0.18 * (0.7 + 0.6 * hash2(vec2f(row, 41.0)));
  let x = wrap(at.x + 35.0 - 70.0 * cycle(v / 70.0), 70.0);
  let fc = vec2f(3.0, 0.12);
  let fq = vec2f(x, at.y) / fc;
  let thread = step(hash2(floor(fq) + 31.0), 0.3) * dash(fc, fq, 7.0, mix(0.1, 0.2, hash2(floor(fq) + 13.0)), 0.004);
  col = mix(col, vec3f(0.69, 0.72, 0.6) * painted.a, 0.18 * thread * step(abs(off), 0.7));
  return vec4f(col, painted.a);
}
