// the rider on the crest: there as `someone_coming` grows, riding along it at a walk (a horse his size: its own pace),
// over its rises; the horse's legs in the walk's four beats — each hoof down while the horse goes on over it, then
// swung ahead
const sc = e.state.someone_coming ?? 0, m = e.mem, k = 3.6, LEG = 1.0 * k;
const PACE = 1.63 * Math.sqrt(k), STRIDE = 1.05 * 1.55 * k, DUTY = 0.64, REACH = DUTY * STRIDE, WAY = 250;
m.x = sc > 0 ? Math.min(WAY, (m.x ?? 0) + PACE * e.dt) : 0;
const f = x => -(13 + 5 * Math.sin(x / 95 + 0.4) + 2.5 * Math.sin(x / 41 + 1.3) + 1 * Math.sin(x / 13));
const x = m.x, y = f(30 + x) - f(30), ph = (x / STRIDE) % 1, seen = Math.min(1, sc * 1.2) * Math.min(1, (WAY - x) / 10);
const body = e.layer('far_rider');
body.x = x;
body.y = y;
body.alpha = seen;
for (let i = 0; i < 4; i++) {
  // (hind left, hind right, fore left, fore right)
  const u = (ph + (i === 0 ? 0 : i === 1 ? 0.5 : i === 2 ? 0.25 : 0.75)) % 1;
  const L = e.layer(i === 0 ? 'far_leg0' : i === 1 ? 'far_leg1' : i === 2 ? 'far_leg2' : 'far_leg3');
  let z, lift = 0;
  if (u < DUTY) z = REACH * (0.5 - u / DUTY);
  else { const q = (u - DUTY) / (1 - DUTY); z = REACH * (q * q * (3 - 2 * q) - 0.5); lift = 0.1 * 1.55 * k * Math.sin(Math.PI * q); }
  L.x = x;
  L.y = y;
  L.rotate = -Math.atan2(z, LEG);
  L.scaleY = (Math.sqrt(z * z + LEG * LEG) - lift) / LEG;
  L.alpha = seen;
}
