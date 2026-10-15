// The craft from Sealand — a pearly fish, nose to the left (toward the cave), its anchor the ground under it (its place:
// ship_a, ship_d, ship_h). Painted once: the body, its fins and portholes, the spiral over it (rings — ship.wgsl lights
// them going round as fast as `spin`), the legs (a layer let down as it comes low), the door (a layer of warm light opening
// with `door`), the ramp (a layer let down with it), the threads hanging under it (a layer ship.wgsl lets down with
// `fall`, beads sliding on them). Its glint far off — its e.light; its point `door` (where the ramp meets the ground).
const SL = 10, CY = -2.05;
// the threads (layer 1), from its belly down 9 m, spread wide
e.layer('threads', { box: [-12, CY + 0.9, 12, 9.2] }, q => {
  q.lineCap = 'round';
  for (let i = 0; i < 90; i++) {
    const u = e.anim.hash(i, 1), r2 = e.anim.hash(i, 2), r3 = e.anim.hash(i, 3), sd = e.anim.hash(i, 4) * 6.28;
    const x0 = (u - 0.5) * SL * 0.62, y0 = CY + 0.95, x1 = (u - 0.5) * 17 - 3.2 * r2 + (r3 - 0.5) * 4, y1 = 9 - r3 * 1.2;
    q.strokeStyle = `rgba(244,236,242,${(0.25 + 0.4 * r3).toFixed(2)})`;
    q.lineWidth = 0.025 + 0.03 * r3;
    q.beginPath();
    for (let k = 0; k <= 12; k++) {
      const f = k / 12, px = x0 + (x1 - x0) * f + 0.5 * Math.sin(sd + f * 5) * f - 1.2 * f * f, py = y0 + (y1 - y0) * Math.pow(f, 0.85) + 0.25 * Math.sin(f * 7 + sd) * f;
      k ? q.lineTo(px, py) : q.moveTo(px, py);
    }
    q.stroke();
  }
});
// the spiral over it (layer 2): rings, open, pale
e.layer('spiral', { box: [-3.4, CY - 4, 4.2, CY - 0.8] }, q => {
  for (let i = 5; i >= 0; i--) {
    const ry = CY - 1.25 - i * 0.42, rx = 3.3 * (1 - i / 6.6);
    q.fillStyle = 'rgba(230,226,240,0.15)';
    q.beginPath(); q.ellipse(0.4, ry, rx, rx * 0.2, 0, 0, 7); q.fill();
    q.strokeStyle = 'rgba(250,246,252,0.6)';
    q.lineWidth = 0.05;
    q.beginPath(); q.ellipse(0.4, ry, rx, rx * 0.2, 0, 0, 7); q.stroke();
  }
});
// the legs (layer 3): let down as it comes low
e.layer('legs', { box: [-3.4, CY + 0.6, 4.2, CY + 2.4] }, q => {
  q.strokeStyle = '#a8a2b8';
  q.lineWidth = 0.13;
  q.lineCap = 'round';
  for (const lx of [-2.6, 1.2, 3.4]) {
    const fx = lx + (lx < 0 ? -0.35 : 0.35);
    q.beginPath(); q.moveTo(lx, CY + 0.85); q.lineTo(fx, CY + 2.0); q.stroke();
    q.fillStyle = '#a8a2b8';
    q.fillRect(fx - 0.32, CY + 1.95, 0.64, 0.1);
  }
});
// the body: a fish, pearly — white, its sheen going rose and pale blue along it
g.save();
g.translate(0, CY);
g.scale(SL, SL * 1.12);
g.beginPath();
g.moveTo(-0.5, 0.01); g.bezierCurveTo(-0.44, -0.09, -0.2, -0.12, 0.08, -0.11); g.bezierCurveTo(0.28, -0.1, 0.38, -0.05, 0.44, -0.025);
g.quadraticCurveTo(0.5, -0.06, 0.56, -0.11); g.quadraticCurveTo(0.53, -0.02, 0.53, 0.0); g.quadraticCurveTo(0.53, 0.03, 0.57, 0.09);
g.quadraticCurveTo(0.5, 0.05, 0.44, 0.025); g.bezierCurveTo(0.36, 0.06, 0.2, 0.1, 0.02, 0.1); g.bezierCurveTo(-0.24, 0.1, -0.44, 0.08, -0.5, 0.01);
g.closePath();
const bg = g.createLinearGradient(-0.4, -0.12, 0.3, 0.1);
bg.addColorStop(0, '#f4f0f2');
bg.addColorStop(0.35, '#ece2ea');
bg.addColorStop(0.6, '#dfe2ee');
bg.addColorStop(1, '#c8c4d4');
g.fillStyle = bg;
g.fill();
g.strokeStyle = 'rgba(255,252,250,0.8)';
g.lineWidth = 0.006;
g.beginPath(); g.moveTo(-0.44, -0.04); g.bezierCurveTo(-0.3, -0.1, -0.05, -0.1, 0.3, -0.075); g.stroke();
g.fillStyle = '#d8d2e4';
g.beginPath(); g.moveTo(0.05, 0.085); g.quadraticCurveTo(0.12, 0.14, 0.2, 0.15); g.quadraticCurveTo(0.16, 0.1, 0.18, 0.07); g.closePath(); g.fill();
for (let w = 0; w < 6; w++) { const wx = -0.34 + w * 0.085; g.fillStyle = '#8a8298'; g.beginPath(); g.ellipse(wx, -0.045, 0.022, 0.014, 0, 0, 7); g.fill(); }
g.strokeStyle = 'rgba(120,114,140,0.6)';
g.lineWidth = 0.004;
g.strokeRect(-0.195, -0.025, 0.07, 0.113);
g.restore();
// the door's warm light (layer 4) and the ramp (layer 5)
e.layer('door', { blend: 'add', box: [-2.1, CY - 0.4, -1.1, CY + 1.1] }, q => {
  q.fillStyle = 'rgba(246,208,162,0.95)';
  q.fillRect(-1.95, CY - 0.28, 0.7, 1.26);
});
e.layer('ramp', { pivot: [-1.6, CY + 1.0], box: [-2.3, CY + 0.9, -0.9, 0.4] }, q => {
  q.fillStyle = '#c8c2d4';
  q.beginPath(); q.moveTo(-1.98, CY + 1.0); q.lineTo(-1.22, CY + 1.0); q.lineTo(-1.1, 0.2); q.lineTo(-2.1, 0.2); q.closePath(); q.fill();
});
e.light(0, CY, 5, '#f2e2e6', 1, 'glint');
e.light(-1.6, CY + 0.4, 0.9, '#f6cfa0', 1, 'door');
e.at(-1.6, 0.1, 'door');
e.at(0, CY);
