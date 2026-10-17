// its place: where the farmhand leads it; its legs stepping as it goes (by how fast it goes), its head nodding and its tail
// swishing; its halter's ring marked where the head is; seen as much as `calf_present`
const s = e.state, m = e.mem, v = Math.abs(e.speed('calf_a') || 0);
m.ph = (m.ph ?? 0) + v * e.dt / 0.55;
const amp = Math.min(1, v * 1.6), w = m.ph * Math.PI * 2, idle = 0.025 * Math.sin(e.t * 0.31);
e.layer('leg_fn').rotate = amp * 0.35 * Math.sin(w + Math.PI) + idle;
e.layer('leg_hf').rotate = amp * 0.35 * Math.sin(w + Math.PI);
e.layer('leg_ff').rotate = amp * 0.35 * Math.sin(w);
e.layer('leg_hn').rotate = amp * 0.35 * Math.sin(w) - idle;
const H = e.layer('head');
H.rotate = 0.06 * e.anim.noise(e.t * 0.3, 1) + amp * 0.05 * Math.sin(w * 2);
e.layer('tail').rotate = 0.1 * Math.sin(e.t * 0.9) + 0.14 * Math.sin(e.t * 2.3) * Math.max(0, Math.sin(e.t * 0.31));
const c = Math.cos(H.rotate), sn = Math.sin(H.rotate), dx = -0.22, dy = 0.16;
e.at(-0.4 + dx * c - dy * sn, -0.98 + dx * sn + dy * c, 'ring');
const k = e.anim.clamp(s.calf_present ?? 1, 0, 1);
for (const n of ['leg_fn', 'leg_hn', 'leg_ff', 'leg_hf', 'body', 'head', 'tail']) e.layer(n).alpha = k;
