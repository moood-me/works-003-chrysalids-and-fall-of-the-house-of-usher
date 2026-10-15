const S = e.state, st = Math.max(0, Math.min(1, S.story ?? 0.7)), dw = S.dawn ?? 0, k = (0.3 + 0.7 * st) * (1 - 0.5 * dw);
e.layer('hi').alpha = k;
e.layer('lo').alpha = k;
e.layer('hi').x = 0.06 * Math.sin(e.t * 0.006);
e.layer('lo').x = 0.06 * Math.sin(e.t * 0.005 + 1);
