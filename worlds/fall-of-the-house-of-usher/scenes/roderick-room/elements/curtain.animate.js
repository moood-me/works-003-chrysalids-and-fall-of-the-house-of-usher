// the halves gathered toward their outer edges as `curtain` falls (each half's inner edge at `reach`), their hollows
// deeper the narrower they are
const { mix, span } = e.anim;
const reach = mix(1.98, 0.015, e.lib.num(e.state.curtain));
const k = (2.45 - reach) / (2.45 - 0.015);
const deep = 1 - span(2.45 - reach, 0.4, 2.4);
for (const side of ['l', 'r']) {
  e.layer('half_' + side).scaleX = k;
  const d = e.layer('deep_' + side);
  d.scaleX = k;
  d.alpha = deep;
}
