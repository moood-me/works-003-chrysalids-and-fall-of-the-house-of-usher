// the mist from the doorway as open as the iron door is (door_turn 180 shut … 280 wide), stirring a little
var o = e.anim.clamp(((e.state.door_turn ?? 180) - 180) / 100, 0, 1), b = e.layer("breath");
b.alpha = o * (0.85 + 0.15 * e.anim.noise(e.t * 0.3, 7));
b.x = 0.03 * e.anim.drift(e.t * 0.2, 3);
