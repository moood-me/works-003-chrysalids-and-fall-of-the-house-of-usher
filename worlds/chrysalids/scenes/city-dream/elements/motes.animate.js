const S = e.state;
e.layer('m').alpha = (0.5 + 0.5 * (S.dream ?? 0.7)) * (1 - 0.7 * e.anim.clamp(S.waking ?? 0, 0, 1)) * (0.7 + 0.3 * Math.sin(e.t * 0.6));
