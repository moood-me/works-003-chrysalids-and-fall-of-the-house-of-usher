// The corner of the forge on the left (on the rise): its boarded wall, the eaves, the old cartwheel leant against it.
// Painted once in daylight colours; the fire lights it.
const wall = () => { g.beginPath(); g.moveTo(-6, 0.3); g.lineTo(-6, -4.5); g.lineTo(2.4, -3.35); g.lineTo(2.4, 0.3); g.closePath(); };
g.fillStyle = '#6a5440';
wall();
g.fill();
g.save();
wall();
g.clip();
for (let x = -5.8; x < 2.4; x += 0.26 + e.rnd() * 0.1) {
  g.fillStyle = 'rgba(40,30,22,0.45)';
  g.fillRect(x, -5, 0.02, 5.4);
  g.fillStyle = `rgba(150,124,96,${0.08 + e.rnd() * 0.12})`;
  g.fillRect(x + 0.03, -5, 0.08 + e.rnd() * 0.08, 5.4);
}
g.restore();
const ey = x => -5.02 + ((x + 6) / 8.84) * 1.5;
g.fillStyle = '#4a3c30';
g.beginPath(); g.moveTo(-6, -4.45); g.lineTo(2.42, -3.33); g.lineTo(2.8, ey(2.8)); g.lineTo(-6, ey(-6)); g.closePath(); g.fill();
g.fillStyle = '#56504c';
g.beginPath();
g.moveTo(-6, -5.32); g.quadraticCurveTo(-1.6, -4.62, 2.82, -3.66); g.lineTo(2.86, -3.5); g.quadraticCurveTo(-1.6, -4.36, -6, ey(-6));
g.closePath();
g.fill();
g.strokeStyle = '#4a3a2c';
g.lineWidth = 0.08;
const wx = 1.5, wy = -0.56, R = 0.56;
g.beginPath(); g.ellipse(wx, wy, R * 0.92, R, 0, 0, 7); g.stroke();
g.lineWidth = 0.04;
for (let k = 0; k < 8; k++) {
  const a = (k * Math.PI) / 4 + 0.2;
  g.beginPath(); g.moveTo(wx, wy); g.lineTo(wx + Math.cos(a) * R * 0.92, wy + Math.sin(a) * R); g.stroke();
}
g.fillStyle = '#4a3a2c';
g.beginPath(); g.arc(wx, wy, 0.1, 0, 7); g.fill();
