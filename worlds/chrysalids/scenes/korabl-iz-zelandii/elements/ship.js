// the Sealand craft: anchor = the ground point under it (its legs stand there when landed); it is moved by place
const S = e.state || {}, A = e.anim, T = e.t;
const cl = A.clamp, sm = A.ease.smooth, mix = A.mix, hash = A.hash;
const V = (k, d) => (typeof S[k] === 'number' ? S[k] : d);
const h = V('ship_h', 8), spin = V('spin', 0), door = V('door', 0), dust = V('dust', 0), fall = V('fall', 0), vis = V('ship_vis', 1), tilt = V('ship_tilt', 0), web = V('web', 0);
if (vis <= 0.001) return;
const d = V('ship_d', 21);
const SL = 10, CY = -2.05;           // length; body centre above the anchor
const airborne = h > 0.05;
const bob = airborne ? 0.12 * A.noise(T * 0.5, 3) + 0.05 * spin * Math.sin(T * 9) : 0;
const far = cl((d - 60) / 200, 0, 1);  // far away: a glint
g.save(); g.globalAlpha = vis;
// a glint round it while it is far
if (far > 0) { const r = 3 + 3.5 * far; const gg = g.createRadialGradient(0, CY, 0, 0, CY, r); gg.addColorStop(0, 'rgba(252,240,236,' + (0.45 * far) + ')'); gg.addColorStop(1, 'rgba(252,240,236,0)'); g.fillStyle = gg; g.beginPath(); g.arc(0, CY, r, 0, 7); g.fill(); }
// ---- the threads, under it while it hovers ----
const fv = sm(fall);
if (fv > 0.01 && airborne) {
  g.lineCap = 'round';
  for (let i = 0; i < 120; i++) {
    const u = hash(i, 1), r2 = hash(i, 2), r3 = hash(i, 3), sd = hash(i, 4) * 6.28;
    const x0 = (u - 0.5) * SL * 0.62, y0 = CY + 0.95;
    const x1 = (u - 0.5) * 17 - 3.2 * r2 + (r3 - 0.5) * 4, y1 = h + 0.05 - r3 * 1.2;
    const len = cl(fv * 1.5 - hash(i, 5) * 0.5, 0, 1);       // how far down it has come
    if (len <= 0) continue;
    g.beginPath();
    let px = x0, py = y0;
    for (let k = 0; k <= 12; k++) {
      const f = k / 12 * len;
      px = mix(x0, x1, f) + 0.5 * Math.sin(T * 0.6 + sd + f * 5) * f - 1.2 * f * f;
      py = mix(y0, y1, Math.pow(f, 0.85)) + 0.25 * Math.sin(f * 7 + sd) * f;
      k ? g.lineTo(px, py) : g.moveTo(px, py);
    }
    const a = (0.08 + 0.2 * r3) * (web > 0.5 ? fv : 1);
    g.strokeStyle = 'rgba(244,236,242,' + a + ')'; g.lineWidth = 0.025 + 0.03 * r3; g.stroke();
    // a bead sliding down the thread
    const f = ((hash(i, 6) + T * 0.16 * (0.6 + r2)) % 1) * len;
    const bx = mix(x0, x1, f) + 0.5 * Math.sin(T * 0.6 + sd + f * 5) * f - 1.2 * f * f, by = mix(y0, y1, Math.pow(f, 0.85)) + 0.25 * Math.sin(f * 7 + sd) * f;
    g.fillStyle = 'rgba(255,248,238,' + (0.75 * Math.sin(f / Math.max(len, 0.01) * 3.14) * fv) + ')'; g.beginPath(); g.arc(bx, by, 0.07, 0, 7); g.fill();
  }
  // the veil falling in the air, drifting toward the cave (left)
  for (let i = 0; i < 60; i++) {
    const sp = 0.06 + hash(i, 8) * 0.06, f = (hash(i, 9) + T * sp) % 1;
    const x = (hash(i, 7) - 0.5) * 20 - 5 * f, y = mix(CY, h, f);
    const a = fv * 0.45 * Math.sin(f * 3.14);
    g.strokeStyle = 'rgba(244,236,240,' + (a * 0.6) + ')'; g.lineWidth = 0.025;
    g.beginPath(); g.moveTo(x + 0.1, y - 0.7); g.quadraticCurveTo(x + 0.2 * Math.sin(T + i), y - 0.35, x, y); g.stroke();
    g.fillStyle = 'rgba(255,248,238,' + a + ')'; g.beginPath(); g.arc(x, y, 0.06, 0, 7); g.fill();
  }
}
// ---- dust on the ground under the rotor ----
if (dust > 0.01) {
  for (let i = 0; i < 30; i++) {
    const r0 = hash(i, 11), f = (hash(i, 12) + T * 0.4 * (0.6 + r0)) % 1, side = hash(i, 13) < 0.5 ? -1 : 1;
    const x = side * (1 + f * 8 * (0.6 + r0 * 0.6)), y = h - f * (0.4 + r0 * 1.6), R = 0.5 + f * 2.2;
    const a = dust * 0.2 * Math.sin(f * 3.14) * (1 - cl(h / 12, 0, 1));
    const rg = g.createRadialGradient(x, y, 0, x, y, R); rg.addColorStop(0, 'rgba(150,132,126,' + a + ')'); rg.addColorStop(1, 'rgba(150,132,126,0)'); g.fillStyle = rg; g.beginPath(); g.arc(x, y, R, 0, 7); g.fill();
  }
}
g.translate(0, CY + bob); g.rotate(tilt);
// ---- the spiral on top: spaced, almost clear sections, turning ----
const sp = T * (0.8 + 9 * spin) + V('spin_phase', 0);
for (let i = 5; i >= 0; i--) {
  const ry = -1.25 - i * 0.42, rx = 3.3 * (1 - i / 6.6), ryy = rx * 0.2;
  g.fillStyle = 'rgba(226,222,236,' + (0.08 + 0.05 * spin) + ')'; g.beginPath(); g.ellipse(0.4, ry, rx, ryy, 0, 0, 7); g.fill();
  g.strokeStyle = 'rgba(246,242,248,0.32)'; g.lineWidth = 0.035; g.beginPath(); g.ellipse(0.4, ry, rx, ryy, 0, 0, 7); g.stroke();
  for (let j = 0; j < 3; j++) { const a = sp * (1 + i * 0.08) + j * 2.09 + i * 0.7; g.strokeStyle = 'rgba(255,252,250,' + (0.2 + 0.45 * spin) + ')'; g.lineWidth = 0.07; g.beginPath(); g.ellipse(0.4, ry, rx, ryy, 0, a, a + 0.3 + 0.9 * spin); g.stroke(); }
}
g.strokeStyle = 'rgba(240,236,246,0.3)'; g.lineWidth = 0.04; g.beginPath();
for (let q = 0; q <= 120; q++) { const u = q / 120, a = u * 6 * Math.PI * 2 + sp; const rx = 3.3 * (1 - u * 0.85), y = -1.2 - u * 2.2; const xx = 0.4 + Math.cos(a) * rx, yy = y + Math.sin(a) * rx * 0.2; q ? g.lineTo(xx, yy) : g.moveTo(xx, yy); }
g.stroke();
g.fillStyle = '#bdb8c8'; g.fillRect(0.3, -1.35, 0.2, 0.4);
// ---- legs: out when low ----
const lo = cl((12 - h) / 6, 0, 1);
if (lo > 0) { g.strokeStyle = '#8f8aa2'; g.lineWidth = 0.13; g.lineCap = 'round'; for (const lx of [-2.6, 1.2, 3.4]) { const fx = lx + (lx < 0 ? -0.35 : 0.35); g.beginPath(); g.moveTo(lx, 0.85); g.lineTo(fx, 0.85 + 1.15 * lo); g.stroke(); g.fillStyle = '#8f8aa2'; g.fillRect(fx - 0.32, 0.85 + 1.15 * lo - 0.05, 0.64, 0.1); } }
// ---- the body: a fish, nose to the left (toward the cave) ----
g.save(); g.scale(SL, SL * 1.12);
g.beginPath(); g.moveTo(-0.5, 0.01); g.bezierCurveTo(-0.44, -0.09, -0.2, -0.12, 0.08, -0.11); g.bezierCurveTo(0.28, -0.1, 0.38, -0.05, 0.44, -0.025); g.quadraticCurveTo(0.5, -0.06, 0.56, -0.11); g.quadraticCurveTo(0.53, -0.02, 0.53, 0.0); g.quadraticCurveTo(0.53, 0.03, 0.57, 0.09); g.quadraticCurveTo(0.5, 0.05, 0.44, 0.025); g.bezierCurveTo(0.36, 0.06, 0.2, 0.1, 0.02, 0.1); g.bezierCurveTo(-0.24, 0.1, -0.44, 0.08, -0.5, 0.01); g.closePath();
const bg = g.createLinearGradient(-0.3, -0.12, 0.1, 0.1); bg.addColorStop(0, '#e2dce2'); bg.addColorStop(0.45, '#aaa5b6'); bg.addColorStop(1, '#5e586e'); g.fillStyle = bg; g.fill();
g.strokeStyle = 'rgba(255,252,250,0.7)'; g.lineWidth = 0.006; g.beginPath(); g.moveTo(-0.44, -0.04); g.bezierCurveTo(-0.3, -0.1, -0.05, -0.1, 0.3, -0.075); g.stroke();
g.strokeStyle = 'rgba(80,80,110,0.35)'; g.lineWidth = 0.004; g.beginPath(); g.moveTo(-0.46, 0.03); g.bezierCurveTo(-0.2, 0.05, 0.15, 0.05, 0.42, 0.012); g.stroke();
// fins
g.fillStyle = 'rgba(190,186,204,0.9)'; g.beginPath(); g.moveTo(0.05, 0.085); g.quadraticCurveTo(0.12, 0.14, 0.2, 0.15); g.quadraticCurveTo(0.16, 0.1, 0.18, 0.07); g.closePath(); g.fill();
for (let w = 0; w < 6; w++) { const wx = -0.34 + w * 0.085; g.fillStyle = 'rgba(66,58,78,0.85)'; g.beginPath(); g.ellipse(wx, -0.045, 0.022, 0.014, 0, 0, 7); g.fill(); g.fillStyle = 'rgba(240,196,160,' + (0.2 + 0.4 * door) + ')'; g.beginPath(); g.ellipse(wx, -0.045, 0.016, 0.009, 0, 0, 7); g.fill(); }
// the door: a seam that slides open on warm light
const dx0 = -0.195, dw = 0.07, dt = -0.025, db = 0.088;
g.strokeStyle = 'rgba(90,86,110,0.55)'; g.lineWidth = 0.004; g.strokeRect(dx0, dt, dw, db - dt);
if (door > 0.01) { const o = sm(door); g.fillStyle = 'rgba(246,208,162,' + (0.95 * o) + ')'; g.fillRect(dx0 + dw * (1 - o) * 0.5, dt, dw * o, db - dt); g.fillStyle = 'rgba(255,238,206,' + (0.5 * o) + ')'; g.fillRect(dx0 + dw * (1 - o) * 0.5 + dw * o * 0.3, dt + 0.01, dw * o * 0.4, db - dt - 0.01); }
const ey = g.createRadialGradient(-0.4, -0.01, 0, -0.4, -0.01, 0.05); ey.addColorStop(0, 'rgba(250,206,176,0.9)'); ey.addColorStop(1, 'rgba(250,206,176,0)'); g.fillStyle = ey; g.beginPath(); g.arc(-0.4, -0.01, 0.05, 0, 7); g.fill();
g.restore();
// the ramp: down from the door toward us
const rp = sm(cl(door * 1.5 - 0.4, 0, 1));
if (rp > 0 && !airborne) {
  const x0 = -1.6, top = 1.0 * 1.12 * 0.088 + 0.0, gy = -CY;        // door bottom in body units; the ground
  const ax = x0 - 0.38, bx = x0 + 0.38, ty = top * SL * 0 + 0.98;
  const fy = mix(ty, gy + 0.22, rp), spread = mix(0, 0.12, rp);
  g.fillStyle = '#aaa5b8'; g.beginPath(); g.moveTo(ax, ty); g.lineTo(bx, ty); g.lineTo(bx + spread, fy); g.lineTo(ax - spread, fy); g.closePath(); g.fill();
  g.strokeStyle = 'rgba(252,228,204,0.5)'; g.lineWidth = 0.03; g.stroke();
  e.light(x0, gy + 0.5, 1.6, '#f6cfa0', 0.3 * sm(door));
}
if (door > 0.01) e.light(-1.6, 0.4, 0.9, '#f6cfa0', 0.4 * sm(door));
g.restore();
e.light(0, CY, 5, '#f2e2e6', 0.2 * vis);
