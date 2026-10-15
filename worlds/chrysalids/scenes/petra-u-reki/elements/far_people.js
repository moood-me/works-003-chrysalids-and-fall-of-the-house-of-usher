// The far bank's people (its own metres: anchor x 0.5, 20 m off; the field's edge at y top(x), the water's edge y 0).
// Rosalind rakes hay with three farmhands. heard 0..1 — Petra's cry reaching her (pale rings sweeping over);
// ro_rake / ro_struck / ro_hands — her poses (raking; struck still; hands to her head); ro_drop 0..1 — the rake
// falls from her hands; ro_down 0..1 — down the slope to the water, ro_wade 0..1 — in to her knees; ro_x, ro_face.
// The farmhands hear nothing: they rake on — unless they see her run (stare, follow). crowd 0..1 — late, the others come along
// the top and stand staring; bond 0..1 — she and David hear each other; after 0..1 — she turns away.
const L = e.lib,
  s = e.state,
  t = e.t;
const heard = s.heard ?? 0,
  bond = s.bond ?? 0;
const sm = (u) => {
  u = L.clamp(u);
  return u * u * (3 - 2 * u);
};
// Petra's cry passing over the field: wide pale arcs from the river below-left
if (heard > 0.01) L.cry(g, t, 1, 5, heard, 20, "240,238,228", 0.11, 4);
// Rosalind, the farmhands (lib.js: people)
const me = e.kit.chrysalids.person(g, e, L.people.rosalind(e));
for (const o of L.people.farmhands(e)) e.kit.chrysalids.person(g, e, o);
const drop = s.ro_drop ?? 0,
  rx = s.ro_x ?? 6.2,
  y0 = L.top(rx) + 0.12;
// the rake she drops: it falls from her hands and lies in the stubble
if (drop >= 0.05) {
  const k = sm(drop),
    fall = Math.min(1, drop * 1.15),
    side = 1;
  const bx = rx + 0.35,
    by = y0 + 0.02; // where its head rests on the ground
  const ang = (((-12 + 101 * Math.pow(fall, 2)) * Math.PI) / 180) * side; // from leaning in her hands to lying down
  const bounce = drop > 0.87 ? (Math.sin(((drop - 0.87) / 0.13) * Math.PI) * 4 * Math.PI) / 180 : 0;
  g.save();
  g.translate(bx, by);
  g.rotate(ang - bounce);
  g.strokeStyle = "#5b4a38";
  g.lineWidth = 0.03;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(0, 0);
  g.lineTo(0, -1.55);
  g.stroke();
  g.lineWidth = 0.025;
  g.beginPath();
  g.moveTo(-0.22, 0.0);
  g.lineTo(0.22, 0.0);
  g.stroke();
  for (let i = -3; i <= 3; i++) {
    g.beginPath();
    g.moveTo(i * 0.07, 0);
    g.lineTo(i * 0.07 + 0.02, 0.07);
    g.stroke();
  }
  g.restore();
  void k;
}
if (bond > 0.01) L.cry(g, t + 0.3, me.head[0], me.head[1], bond * 0.8, 9, "255,214,160", 0.16, 3);
// the late ones (lib.js: people)
for (const o of L.people.late(e) ?? []) e.kit.chrysalids.person(g, e, o);
