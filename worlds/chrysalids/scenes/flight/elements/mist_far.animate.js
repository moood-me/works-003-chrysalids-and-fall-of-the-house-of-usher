const m = e.anim.clamp(e.state.mist ?? 0.7, 0, 1);
e.layer('m0').alpha = m;
e.layer('m1').alpha = m;
