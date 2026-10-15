// the window brighter as a thought-shape comes to it or leaves it (its way: tho_d / thi_d, from David's head to here)
const s = e.state, L = e.lib, span = L.WIN[2] - L.HEAD[2];
const uo = ((s.tho_d ?? L.HEAD[2]) - L.HEAD[2]) / span, ui = ((s.thi_d ?? L.HEAD[2]) - L.HEAD[2]) / span;
const fl = Math.max(uo > 0.8 && uo < 0.999 ? (uo - 0.8) / 0.2 : 0, ui > 0.75 && ui < 0.999 ? (ui - 0.75) / 0.25 : 0) * (s.th_amp ?? 1);
e.glow('window', 0.75 + 0.1 * Math.sin(e.t * 0.9) + 1.4 * fl);
