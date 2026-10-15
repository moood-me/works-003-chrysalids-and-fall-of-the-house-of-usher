// the dragonfly darting to and fro over the water, rising and dipping, turning the way it goes (its wings a blur,
// trembling: the layer's flicker)
const t = e.t, x = 1.1 * Math.sin(t * 0.19) + 0.4 * Math.sin(t * 0.51 + 1), y = -0.18 * Math.sin(t * 0.16 + 2) - 0.08 * Math.sin(t * 0.43);
const dir = Math.cos(t * 0.19) >= 0 ? 1 : -1, turn = 0.12 * Math.sin(t * 0.3), body = e.layer('body'), wings = e.layer('wings');
body.x = wings.x = x;
body.y = wings.y = y;
body.rotate = wings.rotate = turn;
body.scaleX = wings.scaleX = dir;
