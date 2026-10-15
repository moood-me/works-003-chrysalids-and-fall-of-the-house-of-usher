// The barn on the left (13 m): its gable end toward us, weathered boards, the roof's slope, the side wall going away; the far
// corner behind which David stands (his point is his own). Painted once in daylight colours.
g.fillStyle = '#5a5048';
g.beginPath(); g.moveTo(2.4, -3.7); g.lineTo(2.92, -3.38); g.lineTo(2.92, -0.27); g.lineTo(2.4, 0.02); g.closePath(); g.fill();
g.fillStyle = '#7a6a5a';
g.beginPath(); g.moveTo(-0.6, -6.38); g.lineTo(2.72, -3.56); g.lineTo(3.18, -3.26); g.lineTo(0.4, -5.63); g.closePath(); g.fill();
g.fillStyle = '#8a7660';
g.beginPath(); g.moveTo(-3.6, 0.02); g.lineTo(-3.6, -3.7); g.lineTo(-0.6, -6.2); g.lineTo(2.4, -3.7); g.lineTo(2.4, 0.02); g.closePath(); g.fill();
g.save();
g.clip();
for (let x = -3.6; x < 2.4; x += 0.26) {
  g.fillStyle = e.rnd() < 0.5 ? 'rgba(60,50,40,0.18)' : 'rgba(190,176,150,0.12)';
  g.fillRect(x, -6.3, 0.26, 6.4);
  g.fillStyle = 'rgba(50,42,34,0.4)';
  g.fillRect(x + 0.245, -6.3, 0.018, 6.4);
}
g.restore();
g.fillStyle = '#4a3e34';
g.fillRect(-1.2, -2.6, 1.3, 2.6);
g.strokeStyle = '#6a5848';
g.lineWidth = 0.06;
g.beginPath(); g.moveTo(-1.2, -2.6); g.lineTo(0.1, 0); g.moveTo(0.1, -2.6); g.lineTo(-1.2, 0); g.stroke();
e.at(2.6, -1.6, 'corner');
