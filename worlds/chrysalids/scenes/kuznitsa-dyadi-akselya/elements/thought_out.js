// one thought-shape in flight (place: across/distance/elevation from the state). OUT: from David to the far window; else back.
const s = e.state,
  L = e.lib,
  OUT = true;
g.fillStyle = "rgba(128,128,128,0.01)";
g.fillRect(0, 0, 0.01, 0.01);
const d = OUT ? s.tho_d : s.thi_d,
  u = (d - L.HEAD[2]) / (L.WIN[2] - L.HEAD[2]);
if (!(u > 0.003 && u < 0.997)) return;
const env = Math.min(1, u / 0.04) * Math.min(1, (1 - u) / 0.12) * (s.th_amp ?? 1);
// on screen the window lies up and to the right of the boy's head
L.shape(g, e, OUT ? -1.12 : -1.12 + Math.PI, env, 0.3);
