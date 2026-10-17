// The night over the valley (stage heights; the horizon at lib.HZ): deep blue, the Milky Way across, stars (a layer);
// the clouds — eight layers that come as `clouds` grows (sky.animate.js drifts them); the voices: David's aura, a
// thread from him to each window (a layer each, its pulse a small light going along it — sky.animate.js), Petra's
// window's bloom, rings and warm thread (layers by `petra`). `david_present` (set once a scene) — without him the
// threads go from window to window. Painted once.
const A = e.aspect, S = e.state || {}, L = e.lib, hz = L.HZ;
const dp = S.david_present == null ? 1 : +S.david_present;
const gr = g.createLinearGradient(0, -0.35, 0, hz);
gr.addColorStop(0, '#0e1226'); gr.addColorStop(0.55, '#1c223e'); gr.addColorStop(0.88, '#303656'); gr.addColorStop(1, '#424462');
g.fillStyle = gr;
g.fillRect(-0.4, -0.4, A + 0.8, 1.7);
const hg = g.createRadialGradient(A * 0.62, hz, 0, A * 0.62, hz, 0.7);
hg.addColorStop(0, 'rgba(115,100,128,0.22)'); hg.addColorStop(1, 'rgba(115,100,128,0)');
g.fillStyle = hg;
g.fillRect(-0.4, hz - 0.8, A + 0.8, 0.85);
for (let i = 0; i < 44; i++) {
  const u = i / 43, mx = A * (1.0 - 0.9 * u) + 0.05 * Math.sin(u * 7), my = hz + 0.02 - (hz + 0.3) * u + 0.03 * Math.sin(u * 11);
  const rr = 0.08 + 0.05 * Math.sin(u * 13 + 1) + 0.04 * e.rnd();
  const mg = g.createRadialGradient(mx, my, 0, mx, my, rr);
  mg.addColorStop(0, 'rgba(140,150,185,0.06)'); mg.addColorStop(1, 'rgba(140,150,185,0)');
  g.fillStyle = mg; g.fillRect(mx - rr, my - rr, 2 * rr, 2 * rr);
}
e.layer('stars', { box: [-0.3, -0.35, A + 0.3, hz] }, q => {
  for (let i = 0; i < 520; i++) {
    const r1 = e.rnd(), r2 = e.rnd(), r3 = e.rnd(), r4 = e.rnd();
    let x, y;
    if (i < 240) { x = A * (1.0 - 0.9 * r1) + (r2 - 0.5) * 0.2; y = hz + 0.02 - (hz + 0.3) * r1 + (r3 - 0.5) * 0.16; }
    else { x = -0.3 + r1 * (A + 0.6); y = -0.35 + Math.pow(r2, 1.2) * (hz + 0.35); }
    if (y > hz - 0.004) continue;
    const a = Math.min(1, (hz - y) / 0.2) * (0.3 + 0.7 * r4) * 0.85;
    q.fillStyle = `rgba(222,228,244,${a})`;
    q.beginPath(); q.arc(x, y, 0.0006 + Math.pow(r4, 5) * 0.0026, 0, 7); q.fill();
  }
});
for (let k = 0; k < 8; k++) e.layer('c' + k, { box: [-0.4, -0.1, 0.4, 0.1] }, q => {
  for (let m = 0; m < 7; m++) {
    const ex = (m - 3) * 0.07, ey = 0.015 * Math.sin(m * 1.7 + k) - 0.012 * Math.sin(m * 0.9), rr = 0.05 + 0.03 * Math.sin(m * 2.3 + k * 1.1) + 0.02 * (m > 1 && m < 5 ? 1 : 0);
    q.save(); q.translate(ex, ey); q.scale(2.2, 0.6);
    const cg = q.createRadialGradient(0, 0, 0, 0, 0, rr * 2);
    cg.addColorStop(0, 'rgba(36,40,64,0.92)'); cg.addColorStop(0.55, 'rgba(36,40,64,0.6)'); cg.addColorStop(1, 'rgba(36,40,64,0)');
    q.fillStyle = cg; q.beginPath(); q.arc(0, 0, rr * 2, 0, 7); q.fill(); q.restore();
  }
});
const [AX, AY] = L.AURA(A);
e.layer('aura', { box: [AX - 0.15, AY - 0.1, AX + 0.15, AY + 0.1] }, q => {
  q.save(); q.translate(AX, AY); q.scale(1.6, 1);
  const ag = q.createRadialGradient(0, 0, 0, 0, 0, 0.09);
  ag.addColorStop(0, 'rgba(190,205,228,0.2)'); ag.addColorStop(0.45, 'rgba(170,190,220,0.08)'); ag.addColorStop(1, 'rgba(170,190,220,0)');
  q.fillStyle = ag; q.beginPath(); q.arc(0, 0, 0.09, 0, 7); q.fill(); q.restore();
});
// a thread: a soft curve from one place to another, rising between (its middle brighter, its ends faint)
function thread(q, x0, y0, x1, y1, rise, lift, seed, warm, wid) {
  const c1x = x0 + 0.02 * Math.sin(seed * 1.7), c1y = y0 - rise, c2x = x1 - (x1 - x0) * 0.25, c2y = Math.min(y0, y1) - lift;
  const G = q.createLinearGradient(x0, y0, x1, y1);
  for (let k = 0; k <= 12; k++) {
    const u = k / 12, a = Math.pow(Math.sin(Math.PI * u), 0.6) * (0.55 + 0.25 * Math.sin(u * 7 + seed));
    G.addColorStop(u, warm ? `rgba(245,230,205,${a * 0.6})` : `rgba(208,224,240,${a * 0.6})`);
  }
  q.strokeStyle = G; q.lineCap = 'round';
  q.lineWidth = wid * 8; q.globalAlpha = 0.12;
  q.beginPath(); q.moveTo(x0, y0); q.bezierCurveTo(c1x, c1y, c2x, c2y, x1, y1); q.stroke();
  q.globalAlpha = 1; q.lineWidth = wid; q.stroke();
}
const wy = hz - 0.008;
L.ORDER.forEach((id, i) => {
  const x1 = L.W[id] * A, ox = AX - 0.04 + 0.08 * ((i * 0.618 + 0.2) % 1), oy = AY - 0.01 + 0.018 * ((i * 0.383) % 1);
  const o = L.W[L.ORDER[(i + 1) % 8]] * A;
  const x0 = dp > 0.5 ? ox : o, y0 = dp > 0.5 ? oy : wy;
  const box = [Math.min(x0, x1) - 0.05, Math.min(y0, wy) - 0.45, Math.max(x0, x1) + 0.05, Math.max(y0, wy) + 0.05];
  e.layer('t' + i, { box }, q => thread(q, x0, y0, x1, wy, 0.07 + 0.06 * ((i * 0.71) % 1), 0.15 + 0.15 * ((i * 0.618) % 1), i, false, 0.0016));
  e.layer('p' + i, { blend: 'add', box: [-0.02, -0.02, 0.02, 0.02] }, q => {
    const pg = q.createRadialGradient(0, 0, 0, 0, 0, 0.012);
    pg.addColorStop(0, 'rgba(226,236,250,0.9)'); pg.addColorStop(1, 'rgba(226,236,250,0)');
    q.fillStyle = pg; q.beginPath(); q.arc(0, 0, 0.012, 0, 7); q.fill();
  });
});
// Petra's window: its bloom, three rings spreading, a warm thread to David
const hx = L.W.home * A, hy = hz - 0.012;
e.layer('bloom', { box: [hx - 0.3, hy - 0.2, hx + 0.3, hy] }, q => {
  q.save(); q.translate(hx, hy); q.scale(1.4, 1);
  const bl = q.createRadialGradient(0, 0, 0, 0, 0, 0.18);
  bl.addColorStop(0, 'rgba(245,228,200,0.3)'); bl.addColorStop(1, 'rgba(245,228,200,0)');
  q.fillStyle = bl; q.beginPath(); q.arc(0, 0, 0.18, Math.PI, 2 * Math.PI); q.fill(); q.restore();
});
for (let r = 0; r < 3; r++) e.layer('ring' + r, { pivot: [hx, hy], box: [hx - 0.46, hy - 0.26, hx + 0.46, hy] }, q => {
  q.save(); q.translate(hx, hy); q.scale(1, 0.55);
  const rg = q.createRadialGradient(0, 0, 0.45 * 0.85, 0, 0, 0.45);
  rg.addColorStop(0, 'rgba(240,226,205,0)'); rg.addColorStop(0.8, 'rgba(240,226,205,0.1)'); rg.addColorStop(1, 'rgba(240,226,205,0)');
  q.fillStyle = rg; q.beginPath(); q.arc(0, 0, 0.45, Math.PI, 2 * Math.PI); q.fill(); q.restore();
});
{
  const tx = dp > 0.5 ? AX : L.W.farm1 * A, ty = dp > 0.5 ? AY : wy;
  e.layer('pt', { box: [Math.min(hx, tx) - 0.05, Math.min(hy, ty) - 0.2, Math.max(hx, tx) + 0.05, Math.max(hy, ty) + 0.05] }, q => thread(q, hx, hy, tx, ty, 0.05, 0.08, 11, true, 0.003));
}
