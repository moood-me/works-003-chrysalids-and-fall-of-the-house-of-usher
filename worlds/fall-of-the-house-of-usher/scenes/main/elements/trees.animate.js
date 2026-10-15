// each dead tree leans a little on its own, slowly, never in step
e.layer("left").rotate = 0.004 * e.anim.drift(e.t * 0.15, 0);
e.layer("right").rotate = 0.004 * e.anim.drift(e.t * 0.15, 777);
