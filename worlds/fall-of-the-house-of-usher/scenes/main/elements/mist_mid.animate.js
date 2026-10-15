// the mist as thick as the moment's (the gloom thickens it): its layers thinned from the most it can be
const gl = Math.min(1, Math.max(0, e.state.gloom ?? 0)), a = (1 + 0.8 * gl) / 1.8;
for (const n of ["east", "west"]) if (e.layer(n).scaleX) e.layer(n).alpha = a;
