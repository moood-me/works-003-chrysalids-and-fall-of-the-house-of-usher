// the grassy bank in the foreground, on our side of the stream: its dark earth, grass in tufts swaying in the wind
// (taller on the left), seed heads, umbels of cow parsley on the left (lib.js: tufts)
const { tufts, blade } = e.lib;
const ef = x => 0.45 + 0.65 * Math.min(1, Math.max(0, (Math.abs(x - 0.6) - 2.0) / 1.6));
const top = x => -(0.4 + 0.09 * Math.sin(x * 0.45 + 0.5) + 0.05 * Math.sin(x * 1.7) + (x < -2.5 ? 0.12 * (-2.5 - x) : 0));
g.beginPath();
g.moveTo(-16, 1.3);
for (let x = -16; x <= 16; x += 0.1) g.lineTo(x, top(x));
g.lineTo(16, 1.3);
g.closePath();
const gr = g.createLinearGradient(0, -0.8, 0, 1.2);
gr.addColorStop(0, '#56613f');
gr.addColorStop(0.5, '#3f4931');
gr.addColorStop(1, '#2f3726');
g.fillStyle = gr;
g.fill();
const lit = '#d6cc88', d1 = '#46512f', d2 = '#3a442b', d3 = '#5d6a40';
const blades = [];
for (let i = 0; i < 1100; i++) {
  const x = -16 + e.rnd() * 32, y = top(x) + e.rnd() * 0.25, tall = x < -3 ? 1.6 : 1, h = (0.1 + e.rnd() * 0.38) * tall * ef(x);
  const lean = (e.rnd() - 0.5) * 0.12, r = e.rnd(), color = r < 0.4 ? d1 : r < 0.75 ? d2 : d3, width = 0.008 + e.rnd() * 0.01;
  blades.push(blade(x, y, h, lean, color, width, e.rnd() < 0.32 ? { color: lit, alpha: 0.7, k: 0.7, from: 0.75, at: 0.8 } : null));
}
// seed heads
for (let i = 0; i < 22; i++) {
  const x = -15 + e.rnd() * 30, y = top(x) + 0.05, h = (0.45 + e.rnd() * 0.5 * (x < -3 ? 1.5 : 1)) * ef(x);
  blades.push({ x, y, h: h + 0.08, draw: q => {
    q.globalAlpha = 0.95;
    q.strokeStyle = d2;
    q.lineWidth = 0.008;
    q.beginPath();
    q.moveTo(x, y);
    q.quadraticCurveTo(x, y - h * 0.6, x, y - h);
    q.stroke();
    q.fillStyle = d1;
    q.beginPath();
    q.ellipse(x, y - h - 0.035, 0.014, 0.045, 0, 0, 7);
    q.fill();
    q.strokeStyle = lit;
    q.globalAlpha = 0.75;
    q.lineWidth = 0.006;
    q.beginPath();
    q.ellipse(x, y - h - 0.035, 0.014, 0.045, 0, Math.PI * 0.9, Math.PI * 1.6);
    q.stroke();
  } });
}
// umbels on the left
for (let i = 0; i < 7; i++) {
  const x = -6.5 + e.rnd() * 3.2, y = top(x) + 0.05, h = 0.7 + e.rnd() * 0.55;
  const spokes = Array.from({ length: 9 }, (_, k) => [-Math.PI * 0.9 + (k * Math.PI * 0.8) / 8, 0.09 + e.rnd() * 0.03]);
  blades.push({ x, y, h: h + 0.12, draw: q => {
    q.globalAlpha = 0.95;
    q.strokeStyle = d2;
    q.lineWidth = 0.012;
    q.beginPath();
    q.moveTo(x, y);
    q.quadraticCurveTo(x, y - h * 0.6, x, y - h);
    q.stroke();
    for (const [a, rr] of spokes) {
      const ux = x + Math.cos(a) * rr, uy = y - h + Math.sin(a) * rr * 0.4 - 0.03;
      q.strokeStyle = d2;
      q.globalAlpha = 0.95;
      q.lineWidth = 0.004;
      q.beginPath();
      q.moveTo(x, y - h);
      q.lineTo(ux, uy);
      q.stroke();
      q.fillStyle = '#e8dfc2';
      q.globalAlpha = 0.85;
      q.beginPath();
      q.arc(ux, uy, 0.018, 0, 7);
      q.fill();
    }
  } });
}
tufts(e, blades, { width: 0.5, wind: { strength: 0.45, gust: 0.6 }, below: 0.3, name: 'tuft' });
