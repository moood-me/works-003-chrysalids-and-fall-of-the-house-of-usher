// The Strorms' farmhouse (18 m): two storeys of grey stone under a slate roof, the chimney on the right (its point
// `chimney`: the smoke), dark windows, the door with its little porch on the left (`door`); the window on the right,
// where the lamp is, is an element of its own on it (pane) — its point here, `window`, and the house's own (its lines).
// Painted once in daylight colours: the evening is the scene's light.
g.fillStyle = '#a0937f';
g.fillRect(-5.5, -6, 11, 6.05);
for (let y = -5.8; y < 0; y += 0.32) { g.fillStyle = 'rgba(84,74,62,0.2)'; g.fillRect(-5.5, y, 11, 0.025); }
for (let i = 0; i < 160; i++) {
  g.fillStyle = e.rnd() < 0.5 ? 'rgba(74,66,56,0.16)' : 'rgba(204,194,174,0.14)';
  g.fillRect(-5.5 + e.rnd() * 10.6, -6 + e.rnd() * 5.9, 0.3 + e.rnd() * 0.5, 0.26);
}
g.fillStyle = '#5c5864';
g.beginPath(); g.moveTo(-6.1, -5.9); g.lineTo(0, -9.8); g.lineTo(6.1, -5.9); g.closePath(); g.fill();
g.strokeStyle = 'rgba(40,38,46,0.35)';
g.lineWidth = 0.04;
for (let y = -9.4; y < -6; y += 0.3) { const w = (y + 9.8) / 3.9 * 6.1; g.beginPath(); g.moveTo(-w, y); g.lineTo(w, y); g.stroke(); }
g.fillStyle = '#48444e';
g.fillRect(-6.15, -6.04, 12.3, 0.18);
g.fillStyle = '#8a7e70';
g.fillRect(2.6, -10.9, 0.8, 3.2);
g.fillStyle = '#6a6058';
g.fillRect(2.5, -11.05, 1.0, 0.22);
e.at(3.0, -11.1, 'chimney');
function win(x, y, w, h) {
  g.fillStyle = '#d2c8b4';
  g.fillRect(x - w / 2 - 0.08, y - h / 2 - 0.08, w + 0.16, h + 0.16);
  g.fillStyle = '#34343e';
  g.fillRect(x - w / 2, y - h / 2, w, h);
  g.fillStyle = '#d2c8b4';
  g.fillRect(x - 0.03, y - h / 2, 0.06, h);
  g.fillRect(x - w / 2, y - 0.03, w, 0.06);
  g.fillStyle = '#7e7464';
  g.fillRect(x - w / 2 - 0.15, y + h / 2 + 0.08, w + 0.3, 0.12);
}
win(-3.6, -4.4, 1, 1.5);
win(-0.6, -4.4, 1, 1.5);
win(2.4, -4.4, 1, 1.5);
win(-4.5, -1.5, 1, 1.5);
win(-0.4, -1.5, 1, 1.5);
win(0, -7.3, 0.7, 0.9);
// the frame round the lit window (its glass is the pane's)
g.fillStyle = '#d2c8b4';
g.fillRect(2.0 - 0.58, -1.45 - 0.83, 1.16, 1.66);
g.fillStyle = '#7e7464';
g.fillRect(2.0 - 0.65, -1.45 + 0.83, 1.3, 0.12);
// the door and its porch
g.fillStyle = '#5c4434';
g.fillRect(-3.0, -2.3, 1.0, 2.32);
g.strokeStyle = '#3e2e24';
g.lineWidth = 0.04;
g.strokeRect(-2.9, -2.2, 0.8, 0.9);
g.strokeRect(-2.9, -1.15, 0.8, 1.0);
g.fillStyle = '#c8b48a';
g.beginPath(); g.arc(-2.15, -1.15, 0.04, 0, 7); g.fill();
g.fillStyle = '#4c4650';
g.beginPath(); g.moveTo(-3.6, -2.55); g.lineTo(-1.4, -2.55); g.lineTo(-1.25, -2.85); g.lineTo(-3.75, -2.85); g.closePath(); g.fill();
g.fillStyle = '#6a5a48';
g.fillRect(-3.5, -2.55, 0.12, 2.57);
g.fillRect(-1.62, -2.55, 0.12, 2.57);
g.fillStyle = '#8a8274';
g.fillRect(-3.4, -0.18, 1.8, 0.2);
e.at(-2.5, -1.1, 'door');
e.at(2.0, -1.45, 'window');
e.at(2.0, -1.45);
