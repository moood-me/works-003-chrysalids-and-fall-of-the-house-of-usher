// The last field of Waknuk (a plane seen from above: x across, y toward us; its middle 6 m off): stubble in even rows —
// where the trees' shadows lie across it in the moonlight (the shadows are the scene's: the moon's)
g.fillStyle = '#7a7860';
g.fillRect(-40, -6.2, 80, 12.4);
for (let y = -6.2; y < 6.2; y += 0.35) {
  g.fillStyle = e.rnd() < 0.5 ? 'rgba(90,86,64,0.4)' : 'rgba(150,146,116,0.25)';
  g.fillRect(-40, y, 80, 0.12);
}
