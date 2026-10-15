// how far the crack has come down (crack.wgsl), the inscription first (a third of the way)
const r = e.anim.clamp(e.state.reveal == null ? 1 : +e.state.reveal || 0, 0, 1);
e.uniform('reveal', r);
e.uniform('title', e.anim.clamp(r * 3, 0, 1));
