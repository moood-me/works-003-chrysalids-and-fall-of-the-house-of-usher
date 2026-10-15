// there once it has fallen; its glass going out as st_glow does
const down = (e.state.st_drop || 0) > 0.5, glow = e.anim.clamp(e.state.st_glow ?? 1, 0, 1);
e.layer('lantern').alpha = down ? 1 : 0;
e.glow('glass', down ? glow : 0);
