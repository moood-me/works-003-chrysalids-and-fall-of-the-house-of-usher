// the knot's brightness and how far the crack has come (knot.glsl)
const c = e.anim.clamp;
e.uniform('reveal', c(e.state.reveal == null ? 1 : +e.state.reveal || 0, 0, 1));
e.uniform('knot', c(e.state.knot == null ? 1 : +e.state.knot || 0, 0, 1));
