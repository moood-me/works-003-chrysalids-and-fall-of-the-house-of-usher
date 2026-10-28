// the clock as `clock` has it: the weights up as far as it is wound; the pendulum a seconds pendulum, swinging as far as
// it is going (stopped: hanging still) — its swing eased in and out by the key, never jumping
const { clamp, span, mix } = e.anim;
const K = e.lib.num(e.state.clock);
const amp = 0.12 * clamp(K * 2, 0, 1) + 0.03 * span(K, 0.5, 1);
e.layer('pendulum').rotate = amp * Math.sin(Math.PI * e.t);
e.layer('weights').y = mix(0, -0.62, span(K, 0.5, 1));
