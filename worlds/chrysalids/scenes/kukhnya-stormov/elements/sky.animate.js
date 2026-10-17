// the night coming over the evening as `dusk` grows
e.layer('night').alpha = e.anim.clamp(((e.state.dusk ?? 0) - 0.2) / 0.7, 0, 1);
