// the inside of the coffin, moving: the torch's tremble beyond the wood and how much of its light is left (`seam`), the
// two men's shapes over the seam (`shade`: how far they have gone — the one at the head going right as they work, the
// other coming left, both stooping and swaying), the points (`tip`: each its own span of it) — into its shader's
// uniforms; the seam's glows dimmed under the shapes
var s = e.state, A = e.anim, t = e.t, L = e.lib;
var k = A.clamp(s.seam ?? 1, 0, 1), tip = A.clamp(s.tip ?? 0, 0, 1), sh = A.ease.inOut(A.clamp(s.shade ?? 0, 0, 1));
var fl = k * (0.82 + 0.12 * (0.5 + 0.5 * A.noise(t * 7, 3)) + 0.06 * Math.sin(t * 17));
var m1 = -1.15 + 1.5 * sh + 0.05 * Math.sin(t * 1.3), m2 = 1.2 - 1.05 * sh + 0.06 * Math.sin(t * 0.9 + 2);
var n1 = 0.75 + 0.25 * (0.5 + 0.5 * A.noise(t * 2, 9)), n2 = 0.75 + 0.25 * (0.5 + 0.5 * A.noise(t * 2 + 1, 9));
e.uniform("fl", fl);
e.uniform("seam", k);
e.uniform("m1", m1);
e.uniform("m2", m2);
e.uniform("n1", n1);
e.uniform("n2", n2);
for (var i = 0; i < 4; i++) e.uniform("u" + (i + 1), A.span(tip, L.SCREWS[i][2], L.SCREWS[i][3]));
// (as the shader has it: the shapes' shadow on the seam at x)
var d, n;
for (n = 0; n < 7; n++) {
  var x = -1.2 + n * 0.4;
  d = Math.max(A.clamp(1 - Math.abs(x - m1) / 0.3) * n1, A.clamp(1 - Math.abs(x - m2) / 0.24) * n2);
  e.glow("g" + n, fl * (1 - Math.min(0.97, 1.3 * d)));
}
