// the leaf turned into the stairwell about its hinge as `stair_door` opens
e.layer('leaf').scaleX = Math.cos(e.anim.clamp(e.state.stair_door ?? 0, 0, 1) * Math.PI / 2 * 0.92);
