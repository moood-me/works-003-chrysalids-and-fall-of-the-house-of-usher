// The find in the grass (5.1 m, the card leant back: the sod over the plate as on a slope): the Old People's plate —
// dull metal, a bent corner, their letters «…АНЦИЯ» and an arrow (its point `plate`) —, over it the earth and the grass
// (layers that go as `dig` grows: glint.animate.js), and the flash of the sun on its edge (a layer and its glow,
// `spark`: as `glint` says). Gone when David has taken it (glint 0).
const ov = (e.state || {}).overgrowth ?? 0.6;
g.fillStyle = '#6a6448';
g.beginPath(); g.ellipse(0, -0.18, 0.5, 0.24, 0, 0, 7); g.fill();
e.layer('plate', { box: [-0.4, -0.42, 0.4, 0.05] }, q => {
  q.save();
  q.translate(0, -0.18);
  q.rotate(-0.09);
  const pw = 0.6, ph = 0.34;
  const grad = q.createLinearGradient(-pw / 2, -ph / 2, pw / 2, ph / 2);
  grad.addColorStop(0, '#a3a69b'); grad.addColorStop(0.5, '#858a80'); grad.addColorStop(1, '#666a62');
  q.fillStyle = grad;
  q.beginPath();
  q.moveTo(-pw / 2 + 0.02, -ph / 2); q.lineTo(pw / 2 - 0.05, -ph / 2); q.lineTo(pw / 2, -ph / 2 + 0.04);
  q.lineTo(pw / 2, ph / 2 - 0.02); q.lineTo(-pw / 2, ph / 2); q.lineTo(-pw / 2, -ph / 2 + 0.02);
  q.closePath();
  q.fill();
  q.fillStyle = 'rgba(128,96,60,0.25)';
  for (let i = 0; i < 18; i++) { q.beginPath(); q.ellipse((e.rnd() - 0.5) * pw, (e.rnd() - 0.5) * ph, 0.01 + e.rnd() * 0.03, 0.006 + e.rnd() * 0.015, e.rnd() * 3, 0, 7); q.fill(); }
  q.save();
  q.scale(0.01, 0.01);
  q.font = 'bold 11px Georgia, serif';
  q.textAlign = 'center';
  q.textBaseline = 'middle';
  q.fillStyle = 'rgba(44,48,46,0.75)';
  q.fillText('…АНЦИЯ', -2.5, -4);
  q.restore();
  q.strokeStyle = 'rgba(44,48,46,0.75)';
  q.lineWidth = 0.022;
  q.lineCap = 'round';
  q.beginPath();
  q.moveTo(-pw * 0.3, ph * 0.26); q.lineTo(pw * 0.22, ph * 0.26);
  q.moveTo(pw * 0.12, ph * 0.14); q.lineTo(pw * 0.24, ph * 0.26); q.lineTo(pw * 0.12, ph * 0.38);
  q.stroke();
  q.restore();
});
e.layer('earth', { box: [-0.5, -0.45, 0.5, 0.05] }, q => {
  q.fillStyle = '#6e6046';
  q.beginPath(); q.ellipse(0, -0.18, 0.42, 0.22, 0, 0, 7); q.fill();
  for (let i = 0; i < 40; i++) {
    q.fillStyle = e.rnd() < 0.5 ? '#5a4e38' : '#86785a';
    q.beginPath(); q.ellipse((e.rnd() - 0.5) * 0.75, -0.18 + (e.rnd() - 0.5) * 0.36, 0.02 + e.rnd() * 0.04, 0.015 + e.rnd() * 0.03, e.rnd() * 3, 0, 7); q.fill();
  }
  q.fillStyle = '#7e837b';
  q.beginPath(); q.ellipse(0.12, -0.3, 0.075, 0.032, -0.2, Math.PI, 0); q.fill();
});
e.layer('grass', { box: [-0.5, -0.5, 0.5, 0.08] }, q => {
  for (let i = 0; i < 46; i++) {
    const x = -0.42 + e.rnd() * 0.84, y0 = -0.02 - e.rnd() * 0.3, h = (0.08 + 0.22 * ov) * (0.4 + 0.6 * e.rnd()), l = (e.rnd() - 0.5) * 0.8;
    q.fillStyle = e.rnd() < 0.3 ? '#9e976b' : '#6c7752';
    q.beginPath();
    q.moveTo(x - 0.008, y0); q.quadraticCurveTo(x + l * h * 0.4, y0 - h * 0.6, x + l * h, y0 - h);
    q.quadraticCurveTo(x + l * h * 0.4 + 0.004, y0 - h * 0.5, x + 0.008, y0);
    q.fill();
  }
});
e.layer('spark', { blend: 'add', pivot: [0.1, -0.32], box: [-0.4, -0.7, 0.4, 0.1] }, q => {
  const cx = 0.1, cy = -0.32, r = 0.35;
  const rg = q.createRadialGradient(cx, cy, 0, cx, cy, r);
  rg.addColorStop(0, 'rgba(255,248,226,0.95)'); rg.addColorStop(0.2, 'rgba(255,238,200,0.4)'); rg.addColorStop(1, 'rgba(255,236,200,0)');
  q.fillStyle = rg;
  q.beginPath(); q.arc(cx, cy, r, 0, 7); q.fill();
  for (let k = 0; k < 4; k++) {
    const an = (k * Math.PI) / 2 + 0.25, len = 0.33 * (k % 2 ? 0.6 : 1);
    q.save(); q.translate(cx, cy); q.rotate(an);
    const lg = q.createLinearGradient(0, 0, len, 0);
    lg.addColorStop(0, 'rgba(255,250,232,0.8)'); lg.addColorStop(1, 'rgba(255,250,232,0)');
    q.fillStyle = lg;
    q.beginPath(); q.moveTo(0, -0.008); q.lineTo(len, 0); q.lineTo(0, 0.008); q.closePath(); q.fill();
    q.restore();
  }
  e.light(cx, cy, 0.8, '#fff0cc', 0.6, 'spark');
});
e.at(0, -0.18, 'plate');
e.at(0, -0.18);
