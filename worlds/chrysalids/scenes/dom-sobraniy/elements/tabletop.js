// the elders' table seen from above (centre across −0.3, 5.6 m away): the book, the papers, the inkwell (the lamp is
// an element of its own on it)
g.fillStyle = '#6e5440';
g.fillRect(-1.3, -0.4, 2.6, 0.8);
for (let y = -0.4; y < 0.4; y += 0.2) { g.fillStyle = 'rgba(40,28,20,0.4)'; g.fillRect(-1.3, y, 2.6, 0.01); }
const paper = (x, y, w, h, r) => {
  g.save(); g.translate(x, y); g.rotate(r); g.fillStyle = '#e4d8bc'; g.fillRect(-w / 2, -h / 2, w, h); g.restore();
};
paper(0.42, 0.05, 0.3, 0.21, 0.1);
paper(0.5, -0.05, 0.3, 0.21, -0.15);
paper(0.18, 0.12, 0.21, 0.3, 0.05);
g.fillStyle = '#3a2a22';
g.fillRect(-0.05, -0.18, 0.3, 0.22);
paper(0.1, -0.07, 0.12, 0.2, 0);
g.fillStyle = '#1e1a1a';
g.beginPath(); g.arc(0.85, 0.08, 0.04, 0, 7); g.fill();
g.strokeStyle = '#d8ccb4';
g.lineWidth = 0.008;
g.beginPath(); g.moveTo(0.83, 0.06); g.lineTo(0.95, -0.1); g.stroke();
