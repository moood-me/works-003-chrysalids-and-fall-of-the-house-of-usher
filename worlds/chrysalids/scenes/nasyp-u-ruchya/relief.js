// the land: the bank's profile (lib.bankL — what big_bank paints side-on) along its line, 5 m away, laid 2 m deep round
// it (its own depth as the people go over it), flat beyond — the meadow, the stream's banks
const band = Math.max(0, Math.min(1, (1.6 - Math.abs(distance - lib.Z0)) / 0.6));
return band > 0 ? lib.groundAt(across) * band : 0;
