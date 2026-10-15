// its gait from how fast its place goes, its turn (rider_face, the old way: 0 toward us, 90 to the right), its head
// tossed (horse_toss); its saddle and stirrups marked for the rider
if (e.state.rider_present !== false) e.kit.ushers.horseLive(e, { face: e.state.rider_face ?? 160, keys: ["rider_a", "rider_d"], toss: e.state.horse_toss ?? 0 });
