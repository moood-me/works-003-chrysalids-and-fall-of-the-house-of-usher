// the door's leaf opening inward on its hinge on the right: seen from before it, narrower as it turns
const D = e.anim.clamp(e.state.door ?? 0, 0, 1);
e.layer('door').scaleX = Math.max(0.02, Math.cos(D * 1.35));
