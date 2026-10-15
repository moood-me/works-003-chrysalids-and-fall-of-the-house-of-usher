// the door's leaves swing in as `door` opens (narrowing toward their jambs); the lamp in the upper window dims as the
// gloom deepens
const door = Math.min(1, Math.max(0, e.state.door ?? 0)), k = 1 - 0.86 * door;
e.layer("door_l").scaleX = k;
e.layer("door_r").scaleX = k;
if (e.layer("lamp").scaleX) {
  const lit = 1 - 0.75 * Math.min(1, Math.max(0, e.state.gloom ?? 0));
  e.layer("lamp").alpha = lit;
  e.glow("lamp", lit);
}
