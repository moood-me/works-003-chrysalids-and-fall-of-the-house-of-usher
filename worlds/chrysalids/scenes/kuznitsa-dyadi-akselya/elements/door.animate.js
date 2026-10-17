// the door along its rail to where `door` has it; its edge's grips where it is now
const ed = 3.55 * e.anim.clamp(e.state.door ?? 1, 0, 1), L = e.layer('door');
L.x = ed;
e.at(ed + 0.06, -1.12, 'grip_low');
e.at(ed + 0.06, -1.32, 'grip_high');
