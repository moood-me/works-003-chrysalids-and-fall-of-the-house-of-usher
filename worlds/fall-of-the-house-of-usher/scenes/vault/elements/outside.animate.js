// the door at night, moving: the candle's flicker, dipping as the iron rings (`knock` from this side, `answer` from the
// other, each a pulse let down from 1 to 0); the door trembling with each; its glow with the flame — into its shader
var s = e.state, A = e.anim, t = e.t;
var kn = A.clamp(s.knock ?? 0, 0, 1), an = A.clamp(s.answer ?? 0, 0, 1);
var fl = 0.85 + 0.08 * Math.sin(t * 6.1) + 0.05 * A.noise(t * 2.3, 4) - 0.35 * an * an - 0.15 * kn * kn;
e.uniform("fl", fl);
e.uniform("kn", kn);
e.uniform("an", an);
e.uniform("shake", (0.004 * kn * kn + 0.007 * an * an) * Math.sin(t * 70));
e.uniform("sway", 0.006 * Math.sin(t * 3.3) + 0.012 * an * Math.sin(t * 23));
e.glow(null, fl / e.lib.FL);
