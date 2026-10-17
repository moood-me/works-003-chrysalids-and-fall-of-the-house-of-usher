// the water's glints in the close-up: a short bright dash in each little cell of the water (closeup_glints.wgsl: each
// comes and goes in its own time); in the close-up's own frame (lib.cuFrame)
e.lib.cuFrame(g);
g.fillStyle = '#fff3d6';
for (let i = 0; i < 14; i++) for (let j = 0; j < 6; j++) {
  if (e.rnd() > 0.8) continue;
  const w = 0.02 + e.rnd() * 0.04, x = -0.7 + i * 0.1 + e.rnd() * (0.1 - w), y = 0.25 + j * 0.04 + 0.01 + e.rnd() * 0.02;
  g.fillRect(x, y, w, 0.003);
}
