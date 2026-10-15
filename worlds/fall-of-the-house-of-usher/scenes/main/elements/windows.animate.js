// the door's leaves swing in as `door` opens (narrowing toward their jambs)
const door = Math.min(1, Math.max(0, e.state.door ?? 0)), k = 1 - 0.86 * door;
e.layer("door_l").scaleX = k;
e.layer("door_r").scaleX = k;
