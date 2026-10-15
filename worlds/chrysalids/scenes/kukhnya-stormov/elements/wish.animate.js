// the third hand laid between the boy's side and the knot on his right hand, as far as `wish` has grown (the upper arm
// first, then the forearm, then the hand closing on the knot), as bright as `wish`, breathing
const w = e.anim.clamp(e.state.wish ?? 0, 0, 1), U = e.layer('upper'), F = e.layer('fore'), H = e.layer('hand');
if (w < 0.01) { U.alpha = F.alpha = H.alpha = 0; return; }
const s = e.point('david#chest'), h = e.point('david#hand_r');
if (!s || !h) { U.alpha = F.alpha = H.alpha = 0; return; }
const ease = e.anim.ease.out, u = ease(e.anim.clamp(w * 1.4, 0, 1)), fx = h[0] >= s[0] ? 1 : -1;
const s0 = [s[0] + fx * 0.04, s[1] + 0.12], el = [s0[0] - fx * 0.05 + 0.015 * Math.sin(e.t * 1.7), s0[1] + 0.2], en = [h[0] + fx * 0.02, h[1] - 0.035];
const lay = (L, a, b, k) => {
  const dx = (b[0] - a[0]) * k, dy = (b[1] - a[1]) * k;
  L.x = a[0];
  L.y = a[1];
  L.rotate = Math.atan2(-dx, dy);
  L.scaleY = Math.max(0.001, Math.hypot(dx, dy));
};
const glow = w * (0.82 + 0.18 * Math.sin(e.t * 3.1));
lay(U, s0, el, e.anim.clamp(u * 2, 0, 1));
lay(F, el, en, e.anim.clamp(u * 2 - 1, 0, 1));
U.alpha = glow;
F.alpha = u > 0.5 ? glow : 0;
H.x = en[0];
H.y = en[1];
H.rotate = Math.atan2(-(en[0] - el[0]), en[1] - el[1]);
H.alpha = glow * e.anim.ease.smooth(e.anim.clamp((u - 0.92) * 12.5, 0, 1));
