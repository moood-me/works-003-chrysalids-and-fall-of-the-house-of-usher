// The far hills and Waknuk on the left (700 m): the meeting house with its spire, roofs, a windmill (its sails a layer
// turning slowly); a lamp or two in a window, out with the dawn (far.animate.js). Painted in daylight colours.
g.fillStyle = '#6a6e64';
g.beginPath();
g.moveTo(-1400, 3);
for (let x = -1400; x <= 1400; x += 20) g.lineTo(x, -10 - 8 * Math.sin(x * 0.004 + 0.7) - 4 * Math.sin(x * 0.011 + 1));
g.lineTo(1400, 3);
g.closePath();
g.fill();
g.fillStyle = '#5c6256';
g.beginPath();
g.moveTo(-1400, 3);
for (let x = -1400; x <= 1400; x += 6) { const n = Math.sin(x * 0.05) * Math.sin(x * 0.013 + 2); g.lineTo(x, -2 - Math.max(0, n) * 7 - 1.5 * Math.sin(x * 0.37)); }
g.lineTo(1400, 3);
g.closePath();
g.fill();
g.fillStyle = '#6e6458';
g.beginPath();
g.moveTo(-40, 0); g.lineTo(-40, -13); g.lineTo(-37, -13); g.lineTo(-35, -32); g.lineTo(-33, -13); g.lineTo(-30, -13); g.lineTo(-30, 0); g.closePath();
g.moveTo(-60, 0); g.lineTo(-60, -8); g.lineTo(-54, -13); g.lineTo(-48, -8); g.lineTo(-48, 0); g.closePath();
g.moveTo(-24, 0); g.lineTo(-24, -7); g.lineTo(-18, -11); g.lineTo(-12, -7); g.lineTo(-12, 0); g.closePath();
g.moveTo(-78, 0); g.lineTo(-77, -12); g.lineTo(-75, -12); g.lineTo(-74, 0); g.closePath();
g.fill();
e.layer('sails', { pivot: [-76, -13], box: [-84, -21, -68, -5] }, q => {
  q.strokeStyle = '#5a524a';
  q.lineWidth = 0.8;
  for (let i = 0; i < 4; i++) {
    const a = i * Math.PI / 2;
    q.beginPath();
    q.moveTo(-76, -13);
    q.lineTo(-76 + 7 * Math.sin(a), -13 - 7 * Math.cos(a));
    q.stroke();
  }
});
e.light(-54, -4, 6, '#d8984e', 1, 'lamp1');
e.light(-18, -3, 5, '#d8984e', 1, 'lamp2');
