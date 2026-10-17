// The lit window of the house (on it): the glass dark, its bars; the lamp's warm light behind it a layer
// (pane.animate.js: `window_lit`), its glow the light `window` of the scene
g.fillStyle = '#2c2c36';
g.fillRect(-0.5, -1.5, 1, 1.5);
e.layer('lit', {}, q => {
  const gr = q.createRadialGradient(0.15, -0.6, 0.08, 0.15, -0.6, 0.95);
  gr.addColorStop(0, '#fbd892');
  gr.addColorStop(1, '#d08a4c');
  q.fillStyle = gr;
  q.fillRect(-0.5, -1.5, 1, 1.5);
  q.fillStyle = 'rgba(70,50,40,0.5)';
  q.fillRect(-0.5, -1.5, 0.22, 1.5);
});
g.fillStyle = '#d2c8b4';
g.fillRect(-0.03, -1.5, 0.06, 1.5);
g.fillRect(-0.5, -0.78, 1, 0.06);
e.light(0, -0.75, 1.4, '#f2b468', 0.7, 'glow');
