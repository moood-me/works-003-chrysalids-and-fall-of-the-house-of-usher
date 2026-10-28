// The ridge the track runs along (9 m off, side-on; lib.cr — its crest, y up negative): its grassy flank, the track's
// two ruts along the crest, the hollow going down past its shoulder (the land under the people: relief.js)
const { cr } = e.lib;
g.fillStyle = '#5e6a4e';
g.beginPath();
g.moveTo(-80, 0.4);
for (let x = -80; x <= 80; x += 0.4) g.lineTo(x, -cr(x));
g.lineTo(80, 0.4);
g.closePath();
g.fill();
for (let i = 0; i < 90; i++) {
  const x = -40 + e.rnd() * 110, y = -cr(x) + 0.3 + e.rnd() * 1.3, r = 0.4 + e.rnd() * 1.2;
  g.fillStyle = e.rnd() < 0.6 ? 'rgba(60,70,50,0.25)' : 'rgba(130,140,110,0.18)';
  g.beginPath();
  g.ellipse(x, y, r * 2, r * 0.5, 0, 0, 7);
  g.fill();
}
for (const rut of [0.06, 0.16]) {
  g.strokeStyle = 'rgba(150,140,118,0.6)';
  g.lineWidth = 0.05;
  g.beginPath();
  for (let x = -14; x <= 80; x += 0.5) { const y = -cr(x) + rut; x === -14 ? g.moveTo(x, y) : g.lineTo(x, y); }
  g.stroke();
}
for (let k = 0; k < 10; k++) {
  e.layer(`grass${k}`, { pivot: [-20 + k * 6 + 3, 0], wind: { strength: 0.3, gust: 0.6 }, box: [-21 + k * 6, -2.0, -13 + k * 6, 0.2] }, q => {
    for (let i = 0; i < 40; i++) {
      const x = -20 + k * 6 + e.rnd() * 6, h = 0.05 + Math.pow(e.rnd(), 2.6) * 0.45, y0 = -cr(x) + 0.04 + e.rnd() * 0.08, l = (e.rnd() - 0.5) * 0.6;
      q.fillStyle = e.rnd() < 0.5 ? '#6a7656' : '#76825e';
      q.beginPath();
      q.moveTo(x - 0.018, y0);
      q.quadraticCurveTo(x + l * h * 0.4, y0 - h * 0.6, x + l * h, y0 - h);
      q.quadraticCurveTo(x + l * h * 0.4 + 0.008, y0 - h * 0.5, x + 0.018, y0);
      q.fill();
    }
  });
}
