// as bright as it is along its way (none at the ends), the arcs stirring
const s = e.state, L = e.lib, u = ((s.thi_d ?? L.HEAD[2]) - L.HEAD[2]) / (L.WIN[2] - L.HEAD[2]);
L.flight(e, u, s.th_amp ?? 1);
