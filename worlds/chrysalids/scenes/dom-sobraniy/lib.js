// Shared by the hall's elements and its script: where things stand, where the light is (the lamp on the table — or
// the oil burning on the floor — and the barn burning outside), the dais.
const N = (v) => (v === true ? 1 : v === false ? 0 : Math.max(0, Math.min(1, +v || 0)));
const sm = (u) => {
  u = Math.max(0, Math.min(1, u));
  return u * u * (3 - 2 * u);
};
// across, distance (metres) — keep in step with scene.json
const AT = {
  lamp: [-0.75, 5.3, 1.45],
  spill: [-0.6, 4.7, 0.2],
  door: 2.5,
};

// the main light: the lamp on the table — or, knocked down (spill), the oil burning on the floor
function light(S, t) {
  const sp = N(S.spill),
    lamp = N(S.lamp);
  const fl = 1 + 0.05 * Math.sin(t * 8.3) + 0.035 * Math.sin(t * 12.9 + 1) + 0.03 * Math.sin(t * 2.7);
  const ff = sp * sp * (1 + 0.14 * Math.sin(t * 7.7) + 0.09 * Math.sin(t * 13.1 + 2) + 0.07 * Math.sin(t * 3.1)) * 1.3;
  const top = lamp * (1 - sp) * fl;
  if (ff > top) return { x: AT.spill[0], d: AT.spill[1], Y: AT.spill[2], k: ff, col: [245, 128, 58], low: true, fl };
  return { x: AT.lamp[0], d: AT.lamp[1], Y: AT.lamp[2], k: top, col: [228, 160, 94], low: false, fl };
}
// the barn burning outside, through the windows and the door
function outside(S, t) {
  return N(S.fire_outside) * (0.8 + 0.12 * Math.sin(t * 5.3) * Math.sin(t * 1.7 + 1) + 0.08 * Math.sin(t * 9.7));
}
// a bench of the hall seen from its long side (1.5 m, the seat 0.45 m up) — the elements stand it along the walls, turned
// to the hall; the lamp's light along its top
function bench(g, e) {
  const L = light(e.state, e.t);
  g.fillStyle = "#16110f";
  g.fillRect(-0.75, -0.47, 1.5, 0.06);
  g.fillRect(-0.68, -0.43, 0.05, 0.43);
  g.fillRect(0.63, -0.43, 0.05, 0.43);
  g.fillRect(-0.68, -0.18, 1.36, 0.03);
  g.fillStyle = "rgba(" + L.col.join(",") + "," + 0.1 * Math.min(1, L.k) + ")";
  g.fillRect(-0.75, -0.47, 1.5, 0.015);
}
// the dais (its top 0.35 m up, from 5.0 to 7.4 m away, −2.4…1.6 across): relief.js lays it under the people
const DAIS = { h: 0.35, a0: -2.4, a1: 1.6, d0: 5.0, d1: 7.4 };

return { N, sm, AT, DAIS, light, outside, bench };
