const f = e.anim.clamp(e.state.fog ?? 0, 0, 1);
e.layer('f0').alpha = f;
e.layer('f1').alpha = f * 0.8;
e.layer('bank').alpha = f;
