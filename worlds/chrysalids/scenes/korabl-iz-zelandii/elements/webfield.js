// The web lying over the clearing (a plane seen from above): strands between tufts and bodies, beads at their knots — the
// far side under the ship first, the near side last (webfield.wgsl shows each strand as `web` reaches it, the beads glint)
g.lineCap = 'round';
for (let i = 0; i < 260; i++) {
  const x1 = (e.anim.hash(i, 1) - 0.5) * 34, y1 = (e.anim.hash(i, 2) - 0.5) * 24, an = e.anim.hash(i, 3) * 6.28, L = 0.8 + e.anim.hash(i, 4) * 3.5;
  const x2 = x1 + Math.cos(an) * L, y2 = y1 + Math.sin(an) * L;
  g.strokeStyle = 'rgba(238,230,236,0.45)';
  g.lineWidth = 0.03 + e.anim.hash(i, 5) * 0.03;
  g.beginPath(); g.moveTo(x1, y1); g.quadraticCurveTo((x1 + x2) / 2 + 0.3, (y1 + y2) / 2 - 0.3, x2, y2); g.stroke();
  if (i % 3 === 0) { g.fillStyle = 'rgba(255,248,238,0.9)'; g.beginPath(); g.arc(x1, y1, 0.06, 0, 7); g.fill(); }
}
