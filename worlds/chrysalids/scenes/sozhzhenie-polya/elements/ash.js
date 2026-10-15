// The ash where the offending field has burnt (a plane just over the land, seen from above: its middle 13.5 m across,
// 19.7 m off — the field from the track to 30 m across and from 9.4 m to 30 m deep): grey-black ash with charred
// stubble; ash.wgsl shows it only where the fire has passed (u_ash) and lets the last embers glow in it
g.fillStyle = '#3a3634';
g.fillRect(-16.5, -10.5, 33, 21);
for (let i = 0; i < 900; i++) {
  g.fillStyle = e.rnd() < 0.5 ? '#26221f' : '#5a5450';
  g.fillRect(-16.5 + e.rnd() * 33, -10.5 + e.rnd() * 21, 0.04 + e.rnd() * 0.08, 0.02 + e.rnd() * 0.04);
}
