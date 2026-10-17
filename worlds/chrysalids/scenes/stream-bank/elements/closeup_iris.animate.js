// the ring as wide as the close-up's iris is open now, about its middle (lib.CU)
const { CU } = e.lib;
e.uniform('open', e.state.closeup ?? 0);
e.uniform('cx', CU.x);
e.uniform('cy', CU.y);
e.uniform('r', CU.r);
