// where the vision is and how it is seen: all three small, one above another, while none is told (vision 0); the one
// told comes to the middle of the smoke, full size; as strong as the story (`story`), paler at dawn; drifting a little
const S = e.state, A = e.aspect, t = e.t, K = 1;
const lerp = (a, b, k) => a + (b - a) * k;
const st = Math.max(0, Math.min(1, S.story ?? 0.7)), dw = S.dawn ?? 0, v = Math.max(0, Math.min(3, S.vision ?? 1));
const sp = [A * 0.55, 0.48, 0.62], dom = [A * 0.7, 0.41, 1.0];
const base = Math.max(0, 1 - v);
const pulse = 0.85 + 0.15 * Math.sin(t * 0.21 + K) * Math.sin(t * 0.13 + 1);
const d = Math.max(0, 1 - Math.abs(v - K)), w = Math.max(d, 0.55 * base);
const L = e.layer('v');
L.alpha = Math.min(1, st * (1 - dw * 0.75) * pulse * w);
L.x = lerp(sp[0], dom[0], d) + 0.012 * Math.sin(t * 0.05 + K * 2) + 0.006 * Math.sin(t * 0.13 + K) - dom[0];
L.y = lerp(sp[1], dom[1], d) + 0.004 * Math.sin(t * 0.09 + K * 1.3) - dom[1];
L.scale = lerp(sp[2], dom[2], d);
L.rotate = 0.025 * Math.sin(t * 0.35) + 0.012 * Math.sin(t * 0.83);
