const f = e.anim.clamp(e.state.fog ?? 0, 0, 1);
e.layer('f0').alpha = f;
e.layer('f1').alpha = f * 0.8;
e.layer('bank').alpha = f;
// (each sheet sways slowly its own way, a few tenths of a metre: the banks stay within the card)
e.layer('f0').x = 0.35 * Math.sin(e.t * 0.05);
e.layer('f1').x = -0.3 * Math.sin(e.t * 0.04 + 1.3);
