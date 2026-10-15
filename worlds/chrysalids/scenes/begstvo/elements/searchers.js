// ── the search from Waknuk: two riders with lanterns up the track. search_look — the first raises his lantern,
// both peer about; lamp / lamp_x — he holds it toward that place of the hollow; search_point — he points there.
// search_rear — his horse shies; fallen 0…1 — he is hit (jerked back in the saddle), thrown off it backwards and falls
// onto his back (the kit's recorded fall_back), lying by his lantern at fallen_a
const s = e.state,
  K = e.kit.chrysalids,
  L = e.lib,
  A = e.anim,
  span = A.span;
const v = (k, d) => (typeof s[k] === "number" ? s[k] : d);
const fall = v("fallen", 0);
const [second, first, thrown] = L.people.searchers(e);
K.horse(g, e, second);
K.horse(g, e, first);
// the first one, thrown (lib.js: people); his lantern in the grass
if (thrown) {
  const fx = v("fallen_a", v("search_a", -20)),
    gy = L.path(fx);
  const lx = fx - 1.35,
    ly = gy - 0.06,
    k = span(fall, 0.14, 0.5);
  K.prop(g, e, "lantern", { ...L.night, light: 0.12, rim: "#e8b070", rimDir: -60, x: fx + (lx - fx) * k, y: gy - 1.9 + (ly - gy + 1.9) * A.ease.in(k), angle: -80 * span(fall, 0.2, 0.6), glow: 0.9 - 0.4 * fall });
  K.person(g, e, thrown);
}
